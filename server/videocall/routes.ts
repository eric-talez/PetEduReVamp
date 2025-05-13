import { Request, Response } from 'express';
import { Express } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import { IStorage } from '../storage';

// Zoom API 연동 관련 상수
const ZOOM_API_BASE = 'https://api.zoom.us/v2';

/**
 * 화상 통화 관련 라우트 등록
 */
export function registerVideoCallRoutes(app: Express) {
  // Zoom 미팅 생성 API
  app.post('/api/videocall/create-meeting', async (req: Request, res: Response) => {
    try {
      // 인증 확인
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
      }

      const { topic, start_time, duration, agenda, password } = req.body;

      if (!topic || !start_time || !duration) {
        return res.status(400).json({ error: '필수 필드가 누락되었습니다. (제목, 시작 시간, 지속 시간)' });
      }

      // Zoom JWT 토큰 생성
      const token = generateZoomJWT();

      // Zoom API 호출
      const response = await axios.post(
        `${ZOOM_API_BASE}/users/me/meetings`,
        {
          topic,
          type: 2, // 예약된 미팅
          start_time,
          duration,
          timezone: 'Asia/Seoul',
          agenda: agenda || '',
          password: password || generateMeetingPassword(),
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            mute_upon_entry: true,
            waiting_room: true,
            audio: 'both',
            auto_recording: 'none'
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // 성공적인 응답
      return res.status(201).json({
        success: true,
        meeting: response.data
      });
    } catch (error: any) {
      console.error('Zoom 미팅 생성 오류:', error.response?.data || error.message);
      return res.status(500).json({
        error: 'Zoom 미팅 생성 중 오류가 발생했습니다.',
        details: error.response?.data || error.message
      });
    }
  });

  // Zoom 미팅 상세 조회 API
  app.get('/api/videocall/meetings/:meetingId', async (req: Request, res: Response) => {
    try {
      // 인증 확인
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
      }

      const { meetingId } = req.params;
      const token = generateZoomJWT();

      const response = await axios.get(
        `${ZOOM_API_BASE}/meetings/${meetingId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return res.json(response.data);
    } catch (error: any) {
      console.error('Zoom 미팅 조회 오류:', error.response?.data || error.message);
      return res.status(500).json({
        error: 'Zoom 미팅 조회 중 오류가 발생했습니다.',
        details: error.response?.data || error.message
      });
    }
  });
  
  // 사용자의 예약된 미팅 목록 조회 API
  app.get('/api/videocall/my-meetings', async (req: Request, res: Response) => {
    try {
      // 인증 확인
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
      }

      const token = generateZoomJWT();

      const response = await axios.get(
        `${ZOOM_API_BASE}/users/me/meetings?type=scheduled`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return res.json(response.data);
    } catch (error: any) {
      console.error('Zoom 미팅 목록 조회 오류:', error.response?.data || error.message);
      return res.status(500).json({
        error: 'Zoom 미팅 목록 조회 중 오류가 발생했습니다.',
        details: error.response?.data || error.message
      });
    }
  });
  
  // 미팅 삭제 API
  app.delete('/api/videocall/meetings/:meetingId', async (req: Request, res: Response) => {
    try {
      // 인증 확인
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
      }

      const { meetingId } = req.params;
      const token = generateZoomJWT();

      await axios.delete(
        `${ZOOM_API_BASE}/meetings/${meetingId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            occurrence_id: req.query.occurrence_id,
            schedule_for_reminder: req.query.schedule_for_reminder
          }
        }
      );

      return res.json({ success: true, message: '미팅이 성공적으로 삭제되었습니다.' });
    } catch (error: any) {
      console.error('Zoom 미팅 삭제 오류:', error.response?.data || error.message);
      return res.status(500).json({
        error: 'Zoom 미팅 삭제 중 오류가 발생했습니다.',
        details: error.response?.data || error.message
      });
    }
  });
  
  // 미팅 참여 토큰 생성 API
  app.post('/api/videocall/join-token', (req: Request, res: Response) => {
    try {
      // 인증 확인
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
      }

      const { meetingNumber, role } = req.body;
      
      if (!meetingNumber) {
        return res.status(400).json({ error: '미팅 번호가 필요합니다.' });
      }
      
      // 역할: 0=참가자, 1=호스트
      const userRole = role === 'host' ? 1 : 0;
      
      const token = generateZoomJoinToken(meetingNumber, userRole);
      
      return res.json({
        signature: token,
        meetingNumber,
        userRole
      });
    } catch (error: any) {
      console.error('Zoom 참여 토큰 생성 오류:', error.message);
      return res.status(500).json({
        error: '참여 토큰 생성 중 오류가 발생했습니다.',
        details: error.message
      });
    }
  });
  
  // 화상 수업 예약 API
  app.post('/api/videocall/schedule', async (req: Request, res: Response) => {
    try {
      // 인증 확인
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
      }
      
      const { trainerId, courseId, title, description, startTime, endTime } = req.body;
      
      if (!trainerId || !title || !startTime || !endTime) {
        return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
      }
      
      // TODO: 여기에 저장소에 예약 정보 저장 로직 추가
      
      // Zoom 미팅 생성
      const token = generateZoomJWT();
      const durationMinutes = Math.ceil((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60));
      
      const response = await axios.post(
        `${ZOOM_API_BASE}/users/me/meetings`,
        {
          topic: title,
          type: 2, // 예약된 미팅
          start_time: startTime,
          duration: durationMinutes,
          timezone: 'Asia/Seoul',
          agenda: description || '',
          password: generateMeetingPassword(),
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            mute_upon_entry: true,
            waiting_room: true,
            audio: 'both',
            auto_recording: 'none'
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // TODO: 응답에서 받은 Zoom 미팅 정보를 저장소에 업데이트
      
      return res.status(201).json({
        success: true,
        schedule: {
          id: 'temp-id', // 실제 구현에서는 DB에서 생성된 ID
          trainerId,
          courseId,
          title,
          description,
          startTime,
          endTime,
          zoomMeeting: response.data
        }
      });
    } catch (error: any) {
      console.error('화상 수업 예약 오류:', error.response?.data || error.message);
      return res.status(500).json({
        error: '화상 수업 예약 중 오류가 발생했습니다.',
        details: error.response?.data || error.message
      });
    }
  });
}

/**
 * Zoom JWT 토큰 생성 유틸리티 함수
 */
function generateZoomJWT(): string {
  const API_KEY = process.env.ZOOM_API_KEY;
  const API_SECRET = process.env.ZOOM_API_SECRET;

  if (!API_KEY || !API_SECRET) {
    throw new Error('Zoom API 키와 시크릿이 설정되지 않았습니다.');
  }

  const payload = {
    iss: API_KEY,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 // 1시간 유효
  };

  // JWT 토큰 생성
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  const signature = crypto
    .createHmac('sha256', API_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Zoom 미팅 참여용 토큰 생성
 */
function generateZoomJoinToken(meetingNumber: string, role: number): string {
  const API_KEY = process.env.ZOOM_API_KEY;
  const API_SECRET = process.env.ZOOM_API_SECRET;

  if (!API_KEY || !API_SECRET) {
    throw new Error('Zoom API 키와 시크릿이 설정되지 않았습니다.');
  }

  const timestamp = new Date().getTime() - 30000;
  const msg = Buffer.from(`${API_KEY}${meetingNumber}${timestamp}${role}`).toString('base64');
  const hash = crypto.createHmac('sha256', API_SECRET).update(msg).digest('base64');
  const signature = Buffer.from(`${API_KEY}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');

  return signature;
}

/**
 * 랜덤 미팅 비밀번호 생성
 */
function generateMeetingPassword(): string {
  return Math.random().toString(36).slice(-8);
}