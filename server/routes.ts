import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {

  // 실시간 인기 통계 API
  app.get("/api/popular-stats", async (req, res) => {
    try {
      const popularStats = {
        trainers: [
          { id: 1, views: 2847, likes: 156, name: "김민수 전문 훈련사", category: "행동교정" },
          { id: 2, views: 2341, likes: 142, name: "박지연 훈련사", category: "소형견전문" }
        ],
        courses: [
          { id: 1, views: 1923, likes: 98, title: "기본 순종 훈련", category: "기본훈련" },
          { id: 2, views: 1756, likes: 87, title: "실내 배변 훈련", category: "배변훈련" }
        ],
        events: [
          { id: 1, views: 1534, likes: 76, title: "펫 케어 워크샵", category: "교육" },
          { id: 2, views: 1289, likes: 64, title: "반려견 사회화 프로그램", category: "사회화" }
        ],
        community: [
          { id: 1, views: 987, likes: 145, title: "우리 강아지 산책 팁 공유", category: "일상" },
          { id: 2, views: 823, likes: 98, title: "고양이 건강 관리법", category: "건강" }
        ]
      };

      res.json(popularStats);
    } catch (error) {
      console.error('인기 통계 조회 오류:', error);
      res.status(500).json({ error: "통계 데이터를 불러올 수 없습니다" });
    }
  });

  // 배너 API
  app.get("/api/banners", async (req, res) => {
    try {
      const banners = [
        {
          id: 1,
          title: "Talez 펫 교육 플랫폼",
          description: "반려동물과 함께하는 더 나은 삶을 위한 종합 교육 플랫폼",
          imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
          linkUrl: "/courses",
          isActive: true,
          type: "main",
          position: "hero"
        }
      ];

      res.json(banners);
    } catch (error) {
      console.error('배너 조회 오류:', error);
      res.status(500).json({ error: "배너를 불러올 수 없습니다" });
    }
  });

  // 커뮤니티 좋아요 API
  app.post("/api/community/posts/:id/like", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);

      res.json({ 
        success: true, 
        message: "좋아요가 반영되었습니다",
        likes: Math.floor(Math.random() * 100) + 50
      });
    } catch (error) {
      console.error('좋아요 처리 오류:', error);
      res.status(500).json({ error: "좋아요 처리 중 오류가 발생했습니다" });
    }
  });

  // 상담 신청 API (권한 체크 추가)
  const checkRole = (requiredRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const userRole = req.headers['x-user-role'] as string || 
                      req.user?.role || 
                      req.session?.user?.role;

      if (!userRole || !requiredRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          error: '접근 권한이 없습니다.',
          requiredRoles,
          userRole
        });
      }

      next();
    };
  };

  // 기관 관리자 권한으로 소속 훈련사 알림장 조회 허용
  const checkInstituteAccess = (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.headers['x-user-role'] as string || req.user?.role;
    const userId = req.user?.id;

    if (userRole === 'institute-admin') {
      // 기관 관리자는 소속 훈련사의 데이터만 접근 가능
      req.query.instituteFilter = userId?.toString();
    }

    next();
  };
  app.post('/api/consultation/request', 
    checkRole(['pet-owner', 'trainer', 'institute-admin', 'admin']),
    async (req, res) => {
    try {
      const { trainerId, message, preferredDate } = req.body;

      res.json({ 
        success: true, 
        message: "상담 신청이 완료되었습니다",
        consultationId: Date.now()
      });
    } catch (error) {
      console.error('상담 신청 오류:', error);
      res.status(500).json({ error: "상담 신청 중 오류가 발생했습니다" });
    }
  });

  // 메시지 전송 API
  app.post("/api/messages/send", async (req, res) => {
    try {
      const { receiverId, message } = req.body;

      res.json({ 
        success: true, 
        message: "메시지가 전송되었습니다",
        messageId: Date.now()
      });
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      res.status(500).json({ error: "메시지 전송 중 오류가 발생했습니다" });
    }
  });

  // 강좌 수강신청 API
  app.post("/api/courses/enroll", async (req, res) => {
    try {
      const { courseId } = req.body;

      res.json({ 
        success: true, 
        message: "수강신청이 완료되었습니다",
        enrollmentId: Date.now()
      });
    } catch (error) {
      console.error('수강신청 오류:', error);
      res.status(500).json({ error: "수강신청 중 오류가 발생했습니다" });
    }
  });

  // 개인 훈련 예약 생성 API
  app.post("/api/reservations/create", async (req, res) => {
    try {
      const { trainerId, date, time, service, duration, petName, notes, location, phone, email } = req.body;

      const reservation = {
        id: Date.now(),
        trainerId,
        date,
        time,
        service,
        duration,
        petName,
        notes,
        location,
        phone,
        email,
        status: 'pending',
        createdAt: new Date()
      };

      console.log('예약 생성:', reservation);

      res.json({ 
        success: true, 
        message: "예약이 신청되었습니다",
        reservationId: reservation.id,
        reservation
      });
    } catch (error) {
      console.error('예약 생성 오류:', error);
      res.status(500).json({ error: "예약 신청 중 오류가 발생했습니다" });
    }
  });

  // 예약 취소 API
  app.post("/api/reservations/:id/cancel", async (req, res) => {
    try {
      const reservationId = req.params.id;

      console.log(`예약 ${reservationId} 취소 요청`);

      res.json({ 
        success: true, 
        message: "예약이 성공적으로 취소되었습니다." 
      });
    } catch (error) {
      console.error('예약 취소 오류:', error);
      res.status(500).json({ error: "예약 취소 중 오류가 발생했습니다" });
    }
  });

  // 댓글 작성 API
  app.post("/api/community/posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const { content, authorName } = req.body;

      const newComment = {
        id: Date.now(),
        postId,
        content,
        author: authorName || "익명",
        createdAt: new Date().toISOString(),
        likes: 0
      };

      res.json({ 
        success: true, 
        message: "댓글이 작성되었습니다",
        comment: newComment
      });
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      res.status(500).json({ error: "댓글 작성 중 오류가 발생했습니다" });
    }
  });

  // 댓글 목록 조회 API
  app.get("/api/community/posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);

      const mockComments = [
        {
          id: 1,
          postId,
          content: "정말 유용한 정보네요! 감사합니다.",
          author: "반려인A",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          likes: 3
        },
        {
          id: 2,
          postId,
          content: "저도 비슷한 경험이 있어서 공감합니다.",
          author: "반려인B",
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          likes: 1
        }
      ];

      res.json({ 
        success: true, 
        comments: mockComments
      });
    } catch (error) {
      console.error('댓글 조회 오류:', error);
      res.status(500).json({ error: "댓글을 불러올 수 없습니다" });
    }
  });

  // 이벤트 참가 신청 API
  app.post("/api/events/:id/register", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const { participantName, phone, email } = req.body;

      res.json({ 
        success: true, 
        message: "이벤트 참가 신청이 완료되었습니다",
        registrationId: Date.now()
      });
    } catch (error) {
      console.error('이벤트 참가 신청 오류:', error);
      res.status(500).json({ error: "참가 신청 중 오류가 발생했습니다" });
    }
  });

  // 공유 링크 생성 API
  app.post("/api/share", async (req, res) => {
    try {
      const { type, id, title } = req.body;
      const shareUrl = `${req.protocol}://${req.get('host')}/${type}/${id}`;

      res.json({ 
        success: true, 
        message: "공유 링크가 생성되었습니다",
        shareUrl,
        title
      });
    } catch (error) {
      console.error('공유 링크 생성 오류:', error);
      res.status(500).json({ error: "공유 링크 생성 중 오류가 발생했습니다" });
    }
  });

  // 상담 관련 API
  app.get("/api/consultations/my-requests", async (req, res) => {
    try {
      // 실제 구현에서는 사용자 세션에서 userId를 가져와야 함
      const consultations = [
        {
          id: 1,
          trainerId: 1,
          trainerName: "김민수 전문 훈련사",
          status: "pending",
          date: "2025-06-10",
          time: "14:00",
          type: "행동교정",
          petName: "멍멍이",
          message: "강아지가 낯선 사람을 보면 짖는 문제로 상담 요청드립니다.",
          createdAt: "2025-06-03T17:30:00.000Z"
        },
        {
          id: 2,
          trainerId: 2,
          trainerName: "박지연 훈련사",
          status: "confirmed",
          date: "2025-06-08",
          time: "10:00",
          type: "기본훈련",
          petName: "코코",
          message: "기본적인 앉기, 기다리기 훈련을 배우고 싶습니다.",
          createdAt: "2025-06-01T09:15:00.000Z"
        }
      ];

      res.json({ success: true, consultations });
    } catch (error) {
      console.error('상담 목록 조회 오류:', error);
      res.status(500).json({ error: "상담 목록을 불러올 수 없습니다" });
    }
  });

  app.post("/api/consultations/:id/cancel", async (req, res) => {
    try {
      const consultationId = req.params.id;

      // 실제 구현에서는 데이터베이스에서 상담을 취소 상태로 업데이트
      console.log(`상담 ${consultationId} 취소 요청`);

      res.json({ 
        success: true, 
        message: "상담이 성공적으로 취소되었습니다." 
      });
    } catch (error) {
      console.error('상담 취소 오류:', error);
      res.status(500).json({ error: "상담 취소 중 오류가 발생했습니다" });
    }
  });

  app.get("/api/consultations/:id", async (req, res) => {
    try {
      const consultationId = req.params.id;

      // 실제 구현에서는 데이터베이스에서 상담 상세 정보 조회
      const consultation = {
        id: parseInt(consultationId),
        trainerId: 1,
        trainerName: "김민수 전문 훈련사",
        trainerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
        status: "confirmed",
        date: "2025-06-10",
        time: "14:00",
        type: "행동교정",
        petName: "멍멍이",
        petAge: "2년",
        petBreed: "골든 리트리버",
        message: "강아지가 낯선 사람을 보면 짖는 문제로 상담 요청드립니다.",
        contactPhone: "010-1234-5678",
        contactEmail: "user@example.com",
        createdAt: "2025-06-03T17:30:00.000Z",
        videoCallUrl: "https://meet.google.com/abc-defg-hij"
      };

      res.json({ success: true, consultation });
    } catch (error) {
      console.error('상담 상세 조회 오류:', error);
      res.status(500).json({ error: "상담 정보를 불러올 수 없습니다" });
    }
  });

  app.post("/api/consultations/:id/join", async (req, res) => {
    try {
      const consultationId = req.params.id;

      // 실제 구현에서는 화상 회의 시스템과 연동
      const videoCallUrl = "https://meet.google.com/abc-defg-hij";

      res.json({ 
        success: true, 
        message: "화상 상담에 참여합니다.",
        videoCallUrl 
      });
    } catch (error) {
      console.error('화상 상담 참여 오류:', error);
      res.status(500).json({ error: "화상 상담 참여 중 오류가 발생했습니다" });
    }
  });

  // 수강 목록 조회 API
  app.get('/api/enrollments', async (req: Request, res: Response) => {
    try {
      // 현재 로그인한 사용자 정보 가져오기
      const user = req.user || req.session?.user || { id: 1, role: 'pet-owner' };

      let enrollments;

      if (user.role === 'trainer') {
        // 훈련사인 경우: 자신이 담당하는 강좌의 수강생 목록
        enrollments = [
          {
            id: 1,
            studentName: '김반려',
            petName: '멍멍이',
            courseName: '기본 훈련 과정',
            enrolledAt: '2024-01-15',
            status: 'active',
            progress: 75
          },
          {
            id: 2,
            studentName: '이반려',
            petName: '야옹이',
            courseName: '고양이 행동 교정',
            enrolledAt: '2024-01-20',
            status: 'active',
            progress: 60
          }
        ];
      } else {
        // 반려인인 경우: 자신이 수강 중인 강좌 목록
        enrollments = [
          {
            id: 1,
            courseName: '기본 훈련 과정',
            trainerName: '김민수 훈련사',
            enrolledAt: '2024-01-15',
            status: 'active',
            progress: 75,
            nextClass: '2024-02-01 14:00'
          },
          {
            id: 2,
            courseName: '고급 서비스독 훈련',
            trainerName: '박영희 훈련사',
            enrolledAt: '2024-01-10',
            status: 'completed',
            progress: 100,
            completedAt: '2024-01-25'
          }
        ];
      }

      res.json({
        success: true,
        enrollments
      });
    } catch (error) {
      console.error('수강 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '수강 목록 조회에 실패했습니다.'
      });
    }
  });
  
    // 훈련사별 상담신청 목록 조회 (권한 체크 추가)
  app.get('/api/consultation/trainer/:trainerId', 
    checkRole(['trainer', 'institute-admin', 'admin']),
    async (req: Request, res: Response) => {
    try {
      // 실제 구현에서는 트레이너 ID를 이용하여 상담 신청 목록 조회
      const trainerId = req.params.trainerId;
      console.log(`훈련사 ${trainerId}의 상담 신청 목록 조회`);

      // 샘플 데이터
      const consultations = [
        {
          id: 1,
          petName: '코코',
          ownerName: '김반려',
          message: '짖음 문제 상담',
          status: '대기중'
        },
        {
          id: 2,
          petName: '뭉치',
          ownerName: '박반려',
          message: '배변 훈련 상담',
          status: '확정'
        }
      ];

      res.json({
        success: true,
        consultations
      });
    } catch (error) {
      console.error('상담 신청 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '상담 신청 목록 조회에 실패했습니다.'
      });
    }
  });

  // 알림장 목록 조회 API (권한 체크 추가)
  app.get('/api/notebook/entries', 
    checkRole(['pet-owner', 'trainer', 'institute-admin', 'admin']),
    checkInstituteAccess,
    async (req: Request, res: Response) => {
    try {
      const { petId, date, limit = 20, offset = 0 } = req.query;
      const userRole = req.headers['x-user-role'] as string || req.user?.role;
      const userId = req.user?.id || 1;

      // 실제로는 데이터베이스에서 권한별 필터링하여 조회
      let entries = [
        {
          id: '1',
          date: new Date().toISOString().split('T')[0],
          petName: '멍멍이',
          petId: 'pet1',
          trainerName: '김민수',
          trainerId: 'trainer1',
          title: '오늘의 기본 훈련 세션',
          content: '오늘 멍멍이는 기본 명령어 훈련을 매우 잘 따라했습니다.',
          activities: {
            training: ['기본 명령어', '리드줄 훈련'],
            play: ['공 던지기', '터그놀이']
          },
          mood: 'excellent',
          duration: 90,
          location: 'PetEdu 훈련장 A',
          tags: ['기본훈련', '개선됨'],
          isRead: false,
          createdAt: new Date().toISOString()
        }
      ];

      // 필터링 적용
      let filteredEntries = entries;
      if (petId) {
        filteredEntries = filteredEntries.filter(entry => entry.petId === petId);
      }
      if (trainerId) {
        filteredEntries = filteredEntries.filter(entry => entry.trainerId === trainerId);
      }
      if (date) {
        filteredEntries = filteredEntries.filter(entry => entry.date === date);
      }

      res.json({
        success: true,
        entries: filteredEntries.slice(Number(offset), Number(offset) + Number(limit)),
        total: filteredEntries.length
      });
    } catch (error) {
      console.error('알림장 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '알림장 목록 조회에 실패했습니다.'
      });
    }
  });
  
  // 새 알림장 작성 API
  app.post('/api/notebook/entries', async (req: Request, res: Response) => {
    try {
      const user = req.user || req.session?.user || { id: 1, role: 'trainer' };
      const entryData = req.body;

      // 필수 필드 검증
      if (!entryData.title || !entryData.content || !entryData.petName) {
        return res.status(400).json({
          success: false,
          error: '제목, 내용, 반려동물 이름은 필수입니다.'
        });
      }

      // 새 알림장 생성
      const newEntry = {
        id: Date.now().toString(),
        ...entryData,
        trainerId: user.id,
        trainerName: user.name || '훈련사',
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('[Notebook] 새 알림장 생성:', newEntry);

      res.json({
        success: true,
        message: '알림장이 성공적으로 저장되었습니다.',
        entry: newEntry
      });
    } catch (error) {
      console.error('알림장 작성 오류:', error);
      res.status(500).json({
        success: false,
        error: '알림장 작성에 실패했습니다.'
      });
    }
  });

  // 알림장 수정 API
  app.put('/api/notebook/entries/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const user = req.user || req.session?.user || { id: 1, role: 'trainer' };

      // 실제로는 데이터베이스에서 해당 알림장을 찾아 업데이트
      const updatedEntry = {
        id,
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      console.log('[Notebook] 알림장 수정:', updatedEntry);

      res.json({
        success: true,
        message: '알림장이 성공적으로 수정되었습니다.',
        entry: updatedEntry
      });
    } catch (error) {
      console.error('알림장 수정 오류:', error);
      res.status(500).json({
        success: false,
        error: '알림장 수정에 실패했습니다.'
      });
    }
  });

  // 알림장 삭제 API
  app.delete('/api/notebook/entries/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = req.user || req.session?.user || { id: 1, role: 'trainer' };

      // 실제로는 데이터베이스에서 해당 알림장을 삭제
      console.log('[Notebook] 알림장 삭제:', id);

      res.json({
        success: true,
        message: '알림장이 성공적으로 삭제되었습니다.'
      });
    } catch (error) {
      console.error('알림장 삭제 오류:', error);
      res.status(500).json({
        success: false,
        error: '알림장 삭제에 실패했습니다.'
      });
    }
  });

  // 알림장 읽음 처리 API
  app.patch('/api/notebook/entries/:id/read', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = req.user || req.session?.user || { id: 1, role: 'pet-owner' };

      // 실제로는 데이터베이스에서 읽음 상태 업데이트
      console.log('[Notebook] 알림장 읽음 처리:', id);

      res.json({
        success: true,
        message: '알림장을 읽음으로 표시했습니다.'
      });
    } catch (error) {
      console.error('알림장 읽음 처리 오류:', error);
      res.status(500).json({
        success: false,
        error: '알림장 읽음 처리에 실패했습니다.'
      });
    }
  });

  // 훈련사별 담당 반려동물 목록 API
  app.get('/api/trainer/my-pets', async (req: Request, res: Response) => {
    try {
      const user = req.user || req.session?.user || { id: 1, role: 'trainer' };

      if (user.role !== 'trainer') {
        return res.status(403).json({
          success: false,
          error: '훈련사만 접근 가능합니다.'
        });
      }

      // 실제로는 데이터베이스에서 훈련사가 담당하는 반려동물 목록 조회
      const myPets = [
        {
          id: 'pet1',
          name: '멍멍이',
          breed: '골든 리트리버',
          age: 2,
          ownerName: '김반려',
          ownerId: 'owner1',
          assignedDate: '2024-01-15',
          avatar: null
        },
        {
          id: 'pet2',
          name: '야옹이',
          breed: '러시안 블루',
          age: 3,
          ownerName: '이반려',
          ownerId: 'owner2',
          assignedDate: '2024-01-20',
          avatar: null
        }
      ];

      res.json({
        success: true,
        pets: myPets
      });
    } catch (error) {
      console.error('담당 반려동물 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '담당 반려동물 목록 조회에 실패했습니다.'
      });
    }
  });

  // 훈련사용 알림장 목록 조회 API
  app.get('/api/trainer/notebook/entries', async (req: Request, res: Response) => {
    try {
      const user = req.user || req.session?.user || { id: 1, role: 'trainer' };

      if (user.role !== 'trainer') {
        return res.status(403).json({
          success: false,
          error: '훈련사만 접근 가능합니다.'
        });
      }

      const { petId, date, limit = 20, offset = 0 } = req.query;

      // 실제로는 데이터베이스에서 해당 훈련사가 작성한 알림장 조회
      const entries = [
        {
          id: '1',
          date: new Date().toISOString().split('T')[0],
          petName: '멍멍이',
          petId: 'pet1',
          ownerName: '김반려',
          ownerId: 'owner1',
          title: '기본 훈련 세션',
          content: '오늘 멍멍이는 앉기와 기다리기 명령을 잘 따라했습니다.',
          activities: ['기본 명령어', '리드줄 훈련'],
          mood: 'excellent',
          duration: 90,
          location: 'PetEdu 훈련장 A',
          photos: [],
          nextGoals: ['산책 훈련', '다른 강아지와의 사회화'],
          isRead: false,
          createdAt: new Date().toISOString()
        }
      ];

      // 필터링 적용
      let filteredEntries = entries;
      if (petId && petId !== 'all') {
        filteredEntries = filteredEntries.filter(entry => entry.petId === petId);
      }
      if (date) {
        filteredEntries = filteredEntries.filter(entry => entry.date === date);
      }

      res.json({
        success: true,
        entries: filteredEntries.slice(Number(offset), Number(offset) + Number(limit)),
        total: filteredEntries.length
      });
    } catch (error) {
      console.error('훈련사 알림장 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '알림장 목록 조회에 실패했습니다.'
      });
    }
  });

  // AI 알림장 생성 API
  app.post('/api/notebook/ai-generate', async (req: Request, res: Response) => {
    try {
      const { petName, petBreed, activities, additionalContext } = req.body;

      if (!petName) {
        return res.status(400).json({
          success: false,
          error: '반려동물 이름은 필수입니다.'
        });
      }

      // AI 생성 시뮬레이션 (실제로는 OpenAI API 호출)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const aiGeneratedContent = {
        title: `${new Date().toLocaleDateString('ko-KR')} ${petName} 훈련 일지`,
        content: `오늘 ${petName}는 훈련에 적극적으로 참여했습니다.

특히 다음과 같은 활동에서 좋은 반응을 보였습니다:
- 기본 명령어 훈련: 이전보다 집중력이 향상되었음
- 사회화 훈련: 다른 반려동물들과 원활한 상호작용
- 놀이 활동: 활발하고 긍정적인 반응

오늘의 전반적인 상태는 양호하며, 지속적인 훈련을 통해 더욱 발전할 것으로 예상됩니다.

다음 세션에서는 ${petName}의 특성을 고려하여 맞춤형 훈련을 진행할 예정입니다.`,
        activities: activities || ['기본 명령어', '사회화 훈련', '놀이 활동'],
        nextGoals: [`${petName} 맞춤형 훈련`, '고급 명령어 학습'],
        tags: ['AI생성', '맞춤훈련']
      };

      res.json({
        success: true,
        message: 'AI가 알림장 내용을 생성했습니다.',
        content: aiGeneratedContent
      });
    } catch (error) {
      console.error('AI 알림장 생성 오류:', error);
      res.status(500).json({
        success: false,
        error: 'AI 알림장 생성에 실패했습니다.'
      });
    }
  });

  // 알림장 템플릿 목록 API
  app.get('/api/notebook/templates', async (req: Request, res: Response) => {
    try {
      const templates = [
        {
          id: 'basic-training',
          name: '기본 훈련 템플릿',
          description: '일반적인 반려동물 기본 훈련 세션용',
          activities: ['기본 명령어', '리드줄 훈련', '사회화 훈련'],
          defaultContent: '오늘 {petName}는 기본 훈련을 진행했습니다.',
          tags: ['기본훈련', '초급']
        },
        {
          id: 'behavior-correction',
          name: '행동 교정 템플릿',
          description: '문제 행동 교정을 위한 세션용',
          activities: ['문제행동 분석', '교정 훈련', '대안행동 제시'],
          defaultContent: '{petName}의 행동 교정을 위한 훈련을 실시했습니다.',
          tags: ['행동교정', '치료']
        },
        {
          id: 'socialization',
          name: '사회화 훈련 템플릿',
          description: '다른 동물이나 사람과의 사회화 훈련용',
          activities: ['타 반려동물과의 만남', '사람과의 교감', '환경 적응'],
          defaultContent: '{petName}의 사회화 능력 향상을 위한 훈련을 진행했습니다.',
          tags: ['사회화', '적응']
        }
      ];

      res.json```tool_code
({
        success: true,
        templates
      });
    } catch (error) {
      console.error('알림장 템플릿 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '알림장 템플릿 조회에 실패했습니다.'
      });
    }
  });

  // 훈련사 예약 가능 시간대 조회 API
  app.get('/api/trainers/:id/available-slots', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { date } = req.query;

      // 실제로는 데이터베이스에서 해당 날짜의 예약된 시간을 조회하여 
      // 사용 가능한 시간대를 계산해야 함
      const allSlots = [
        '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'
      ];

      // 샘플: 일부 시간대는 이미 예약됨
      const bookedSlots = ['11:00', '15:00'];
      const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

      res.json({
        success: true,
        slots: availableSlots,
        date,
        trainerId: id
      });
    } catch (error) {
      console.error('예약 가능 시간대 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '예약 가능 시간대를 조회할 수 없습니다.'
      });
    }
  });

  // 훈련사 가격 정보 조회 API
  app.get('/api/trainers/:id/pricing', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // 실제로는 데이터베이스에서 훈련사별 가격 정보 조회
      const pricing = {
        '기본훈련': 50000,
        '행동교정': 70000,
        '고급훈련': 90000,
        '특수훈련': 120000,
        '1:1맞춤훈련': 150000
      };

      res.json({
        success: true,
        pricing,
        trainerId: id
      });
    } catch (error) {
      console.error('가격 정보 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '가격 정보를 조회할 수 없습니다.'
      });
    }
  });

  // 상담 상태 업데이트 API
  app.patch('/api/consultations/:id/status', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // 유효한 상태 값 검증
      const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: '유효하지 않은 상태값입니다.'
        });
      }

      // 실제로는 데이터베이스에서 상담 상태 업데이트
      console.log(`상담 ${id}의 상태를 ${status}로 업데이트`);

      res.json({
        success: true,
        message: '상담 상태가 업데이트되었습니다.',
        consultationId: id,
        newStatus: status
      });
    } catch (error) {
      console.error('상담 상태 업데이트 오류:', error);
      res.status(500).json({
        success: false,
        error: '상담 상태 업데이트에 실패했습니다.'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}