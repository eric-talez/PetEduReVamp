import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { videoLectureSessionsInsertSchema, videoLectureBookingsInsertSchema } from '../../shared/schema';

const router = Router();

// Zoom 미팅 생성 요청 스키마
const createZoomMeetingSchema = z.object({
  topic: z.string().min(1, "미팅 제목은 필수입니다"),
  start_time: z.string().datetime("올바른 시작 시간 형식이 필요합니다"),
  duration: z.number().min(15).max(480, "미팅 시간은 15분에서 8시간 사이여야 합니다"),
  password: z.string().optional(),
  max_participants: z.number().min(1).max(500).optional().default(50),
  description: z.string().optional()
});

// Zoom 미팅 예약 스키마
const bookVideoLectureSchema = z.object({
  sessionId: z.number(),
  petId: z.number().optional(),
  specialRequests: z.string().optional()
});

/**
 * Zoom SDK를 사용해 미팅 생성
 */
async function createZoomMeeting(meetingData: z.infer<typeof createZoomMeetingSchema>) {
  const ZOOM_SDK_KEY = process.env.ZOOM_SDK_KEY;
  const ZOOM_SDK_SECRET = process.env.ZOOM_SDK_SECRET;
  
  if (!ZOOM_SDK_KEY || !ZOOM_SDK_SECRET) {
    throw new Error('Zoom SDK credentials not configured');
  }

  // JWT 토큰 생성 (실제 환경에서는 proper JWT library 사용 권장)
  const header = {
    "alg": "HS256",
    "typ": "JWT"
  };

  const payload = {
    "iss": ZOOM_SDK_KEY,
    "exp": Math.floor(Date.now() / 1000) + 3600 // 1시간 후 만료
  };

  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  const crypto = require('crypto');
  const signature = crypto
    .createHmac('sha256', ZOOM_SDK_SECRET)
    .update(`${base64Header}.${base64Payload}`)
    .digest('base64url');

  const jwtToken = `${base64Header}.${base64Payload}.${signature}`;

  // Zoom API 호출 (실제 환경에서는 Zoom Web SDK를 사용)
  // 여기서는 시뮬레이션된 응답을 반환
  const meetingId = `meeting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const joinUrl = `https://zoom.us/j/${meetingId}`;
  const startUrl = `https://zoom.us/s/${meetingId}?role=host`;
  
  return {
    id: meetingId,
    topic: meetingData.topic,
    start_time: meetingData.start_time,
    duration: meetingData.duration,
    join_url: joinUrl,
    start_url: startUrl,
    password: meetingData.password || generatePassword(),
    created_at: new Date().toISOString()
  };
}

/**
 * 안전한 비밀번호 생성
 */
function generatePassword(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// 화상 강의 세션 생성
router.post('/sessions', async (req, res) => {
  try {
    console.log('🎥 [VideoCall] 화상 강의 세션 생성 요청:', req.body);
    
    const sessionData = videoLectureSessionsInsertSchema.parse(req.body);
    
    // Zoom 미팅 생성
    const zoomMeetingData = {
      topic: sessionData.title,
      start_time: sessionData.scheduledStartTime.toISOString(),
      duration: Math.ceil((sessionData.scheduledEndTime.getTime() - sessionData.scheduledStartTime.getTime()) / (1000 * 60)),
      max_participants: sessionData.maxParticipants || 50,
      description: sessionData.description || ''
    };

    const zoomMeeting = await createZoomMeeting(zoomMeetingData);
    
    // 세션 데이터에 Zoom 정보 추가
    const sessionWithZoom = {
      ...sessionData,
      zoomMeetingId: zoomMeeting.id,
      zoomJoinUrl: zoomMeeting.join_url,
      zoomStartUrl: zoomMeeting.start_url,
      zoomMeetingPassword: zoomMeeting.password,
      status: 'scheduled' as const
    };

    const session = await storage.createVideoLectureSession(sessionWithZoom);
    
    console.log('🎥 [VideoCall] 화상 강의 세션 생성 완료:', session.id);
    
    res.json({
      success: true,
      session,
      zoomInfo: {
        meetingId: zoomMeeting.id,
        joinUrl: zoomMeeting.join_url,
        password: zoomMeeting.password
      }
    });
  } catch (error) {
    console.error('🎥 [VideoCall] 세션 생성 오류:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 화상 강의 세션 목록 조회
router.get('/sessions', async (req, res) => {
  try {
    console.log('🎥 [VideoCall] 화상 강의 세션 목록 조회');
    
    const { instructorId, status, upcoming } = req.query;
    
    let sessions = await storage.getVideoLectureSessions();
    
    // 필터링
    if (instructorId) {
      sessions = sessions.filter(s => s.instructorId === parseInt(instructorId as string));
    }
    
    if (status) {
      sessions = sessions.filter(s => s.status === status);
    }
    
    if (upcoming === 'true') {
      const now = new Date();
      sessions = sessions.filter(s => new Date(s.scheduledStartTime) > now);
    }
    
    console.log('🎥 [VideoCall] 세션 목록 조회 완료:', sessions.length, '개');
    
    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    console.error('🎥 [VideoCall] 세션 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 화상 강의 예약
router.post('/bookings', async (req, res) => {
  try {
    console.log('🎥 [VideoCall] 화상 강의 예약 요청:', req.body);
    
    const bookingData = bookVideoLectureSchema.parse(req.body);
    
    // 세션 존재 확인
    const sessions = await storage.getVideoLectureSessions();
    const session = sessions.find(s => s.id === bookingData.sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: '존재하지 않는 세션입니다'
      });
    }
    
    // 정원 확인
    if (session.currentParticipants >= session.maxParticipants) {
      return res.status(400).json({
        success: false,
        error: '세션이 만석입니다'
      });
    }
    
    // 예약 생성 (실제로는 authentication에서 userId를 가져와야 함)
    const userId = 1; // 임시 사용자 ID
    
    const booking = await storage.createVideoLectureBooking({
      sessionId: bookingData.sessionId,
      userId,
      petId: bookingData.petId,
      specialRequests: bookingData.specialRequests,
      bookingStatus: 'confirmed',
      attendanceStatus: 'registered'
    });
    
    // 세션의 현재 참가자 수 업데이트
    await storage.updateVideoLectureSessionParticipants(
      bookingData.sessionId, 
      session.currentParticipants + 1
    );
    
    console.log('🎥 [VideoCall] 화상 강의 예약 완료:', booking.id);
    
    res.json({
      success: true,
      booking,
      sessionInfo: {
        title: session.title,
        startTime: session.scheduledStartTime,
        joinUrl: session.zoomJoinUrl,
        password: session.zoomMeetingPassword
      }
    });
  } catch (error) {
    console.error('🎥 [VideoCall] 예약 오류:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 화상 강의 예약 조회
router.get('/bookings', async (req, res) => {
  try {
    console.log('🎥 [VideoCall] 화상 강의 예약 목록 조회');
    
    const { userId, sessionId, status } = req.query;
    
    let bookings = await storage.getVideoLectureBookings();
    
    // 필터링
    if (userId) {
      bookings = bookings.filter(b => b.userId === parseInt(userId as string));
    }
    
    if (sessionId) {
      bookings = bookings.filter(b => b.sessionId === parseInt(sessionId as string));
    }
    
    if (status) {
      bookings = bookings.filter(b => b.bookingStatus === status);
    }
    
    console.log('🎥 [VideoCall] 예약 목록 조회 완료:', bookings.length, '개');
    
    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('🎥 [VideoCall] 예약 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 화상 강의 세션 상태 업데이트
router.patch('/sessions/:id/status', async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const { status } = req.body;
    
    console.log('🎥 [VideoCall] 세션 상태 업데이트:', sessionId, '->', status);
    
    if (!['scheduled', 'live', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: '올바르지 않은 상태입니다'
      });
    }
    
    await storage.updateVideoLectureSessionStatus(sessionId, status);
    
    console.log('🎥 [VideoCall] 세션 상태 업데이트 완료');
    
    res.json({
      success: true,
      message: '세션 상태가 업데이트되었습니다'
    });
  } catch (error) {
    console.error('🎥 [VideoCall] 세션 상태 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;