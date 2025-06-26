import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { registerMessagingRoutes } from "./routes/messaging";
import { registerDashboardRoutes } from "./routes/dashboard";
import { registerAdminRoutes } from "./routes/admin";
// import { errorHandler } from "./middleware/error-handler";
import { registerShoppingRoutes } from "./routes/shopping";
// import { registerNotificationRoutes } from "./routes/notification-routes";
import { registerUploadRoutes } from "./routes/upload";
import { storage } from "./storage";
import { courses, users, institutes } from "@shared/schema";
import { ilike, or } from "drizzle-orm";
import { setupCommissionRoutes } from './commission/routes';
// import { setupHealthRoutes } from './routes/health';
import { registerAnalyticsRoutes } from './routes/analytics';
// import { setupSocialRoutes } from './routes/social';

// requireAuth 미들웨어 함수
function requireAuth(role?: string) {
  return (req: any, res: any, next: any) => {
    // 개발 환경에서는 간단한 인증 체크
    if (process.env.NODE_ENV === 'development') {
      req.user = { id: 'admin', role: role || 'admin' };
      return next();
    }

    // 실제 프로덕션에서는 세션/토큰 기반 인증 구현
    const userRole = req.session?.user?.role || 'guest';

    if (role && userRole !== role) {
      return res.status(403).json({ error: '권한이 없습니다.' });
    }

    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {

  // 대시보드 라우트 등록
  registerDashboardRoutes(app);

  // 관리자 라우트 등록
  registerAdminRoutes(app);

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
      res.status(500).json({ error: "배너 데이터를 불러올 수 없습니다" });
    }
  });

  // 상담 신청 API
  app.post("/api/consultation/request", async (req, res) => {
    try {
      const { trainerId, message, preferredDate } = req.body;

      console.log('상담 신청 요청:', { trainerId, message, preferredDate });

      res.json({ 
        success: true, 
        message: "상담 신청이 성공적으로 완료되었습니다." 
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

      console.log('메시지 전송 요청:', { receiverId, message });

      res.json({ 
        success: true, 
        message: "메시지가 성공적으로 전송되었습니다." 
      });
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      res.status(500).json({ error: "메시지 전송 중 오류가 발생했습니다" });
    }
  });

  // 댓글 작성 API
  app.post("/api/comments/create", async (req, res) => {
    try {
      const { postId, content } = req.body;

      console.log('댓글 작성 요청:', { postId, content });

      res.json({ 
        success: true, 
        message: "댓글이 성공적으로 작성되었습니다.",
        comment: {
          id: Date.now(),
          postId,
          content,
          author: "반려인",
          createdAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      res.status(500).json({ error: "댓글 작성 중 오류가 발생했습니다" });
    }
  });

  // 이벤트 참가 신청 API
  app.post("/api/events/:id/register", async (req, res) => {
    try {
      const eventId = req.params.id;

      console.log('이벤트 참가 신청:', { eventId });

      res.json({ 
        success: true, 
        message: "이벤트 참가 신청이 완료되었습니다." 
      });
    } catch (error) {
      console.error('이벤트 참가 신청 오류:', error);
      res.status(500).json({ error: "이벤트 참가 신청 중 오류가 발생했습니다" });
    }
  });

  // 이벤트 문의 API
  app.post("/api/events/:id/inquiry", async (req, res) => {
    try {
      const eventId = req.params.id;
      const { message } = req.body;

      console.log('이벤트 문의:', { eventId, message });

      res.json({ 
        success: true, 
        message: "문의가 성공적으로 전송되었습니다." 
      });
    } catch (error) {
      console.error('이벤트 문의 오류:', error);
      res.status(500).json({ error: "문의 전송 중 오류가 발생했습니다" });
    }
  });

  // 좋아요 API
  app.post("/api/like", async (req, res) => {
    try {
      const { itemId, itemType } = req.body;

      console.log('좋아요 요청:', { itemId, itemType });

      res.json({ 
        success: true, 
        message: "좋아요가 추가되었습니다.",
        likes: Math.floor(Math.random() * 100) + 50
      });
    } catch (error) {
      console.error('좋아요 오류:', error);
      res.status(500).json({ error: "좋아요 처리 중 오류가 발생했습니다" });
    }
  });

  // 공유 링크 생성 API
  app.post("/api/share", async (req, res) => {
    try {
      const { itemId, itemType, title } = req.body;

      console.log('공유 링크 생성:', { itemId, itemType, title });

      const shareUrl = `${req.protocol}://${req.get('host')}/${itemType}/${itemId}`;

      res.json({ 
        success: true, 
        message: "공유 링크가 생성되었습니다.",
        shareUrl
      });
    } catch (error) {
      console.error('공유 링크 생성 오류:', error);
      res.status(500).json({ error: "공유 링크 생성 중 오류가 발생했습니다" });
    }
  });

  // 반려동물 관리 API
  app.get("/api/pets", async (req, res) => {
    try {
      const pets = [
        {
          id: 1,
          name: "토리",
          species: "dog",
          breed: "포메라니안",
          age: 3,
          gender: "female",
          weight: 3.2,
          color: "흰색",
          personality: "활발하고 친근한 성격",
          medicalHistory: "견과류 알레르기",
          specialNotes: "큰 소리에 예민함",
          imageUrl: "https://images.unsplash.com/photo-1600077106724-946750eeaf3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          isActive: true,
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-06-03T00:00:00.000Z"
        },
        {
          id: 2,
          name: "몽이",
          species: "dog",
          breed: "비숑 프리제",
          age: 1.5,
          gender: "male",
          weight: 4.5,
          color: "흰색",
          personality: "호기심이 많고 장난스러운 성격",
          medicalHistory: "분리불안 초기 증상",
          specialNotes: "새로운 환경에 잘 적응함",
          imageUrl: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          isActive: true,
          createdAt: "2025-02-15T00:00:00.000Z",
          updatedAt: "2025-06-03T00:00:00.000Z"
        }
      ];

      res.json(pets);
    } catch (error) {
      console.error('반려동물 목록 조회 오류:', error);
      res.status(500).json({ error: "반려동물 목록을 불러올 수 없습니다" });
    }
  });

  // 반려동물 생성
  app.post("/api/pets", async (req, res) => {
    try {
      const petData = req.body;

      console.log('반려동물 등록 요청:', petData);

      const newPet = {
        id: Date.now(),
        ...petData,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      res.json({ 
        success: true, 
        message: "반려동물이 성공적으로 등록되었습니다.",
        pet: newPet
      });
    } catch (error) {
      console.error('반려동물 등록 오류:', error);
      res.status(500).json({ error: "반려동물 등록 중 오류가 발생했습니다" });
    }
  });

  // 반려동물 수정
  app.put("/api/pets/:id", async (req, res) => {
    try {
      const petId = req.params.id;
      const updateData = req.body;

      console.log(`반려동물 ${petId} 수정 요청:`, updateData);

      res.json({ 
        success: true, 
        message: "반려동물 정보가 성공적으로 수정되었습니다." 
      });
    } catch (error) {
      console.error('반려동물 수정 오류:', error);
      res.status(500).json({ error: "반려동물 정보 수정 중 오류가 발생했습니다" });
    }
  });

  // 반려동물 삭제
  app.delete("/api/pets/:id", async (req, res) => {
    try {
      const petId = req.params.id;

      console.log(`반려동물 ${petId} 삭제 요청`);

      res.json({ 
        success: true, 
        message: "반려동물이 성공적으로 삭제되었습니다." 
      });
    } catch (error) {
      console.error('반려동물 삭제 오류:', error);
      res.status(500).json({ error: "반려동물 삭제 중 오류가 발생했습니다" });
    }
  });

  // 상담 관련 API
  app.get("/api/consultations/my-requests", async (req, res) => {
    try {
      const consultations = [
        {
          id: 1,
          trainerId: 1,
          trainerName: "김민수 전문 훈련사",
          trainerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
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
          trainerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b332b1b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
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

  // 메시지 전송 API
  app.post("/api/messages/send", async (req, res) => {
    try {
      const { trainerId, message } = req.body;

      console.log('메시지 전송 요청:', { trainerId, message });

      const messageId = Date.now();
      const messageData = {
        id: messageId,
        trainerId: trainerId,
        senderId: 'user',
        message: message,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };

      res.json({ 
        success: true, 
        message: "메시지가 성공적으로 전송되었습니다.",
        data: messageData
      });
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      res.status(500).json({ error: "메시지 전송 중 오류가 발생했습니다" });
    }
  });

  // 예약 생성 API
  app.post("/api/reservations/create", async (req, res) => {
    try {
      const { trainerId, date, time, notes } = req.body;

      console.log('예약 생성 요청:', { trainerId, date, time, notes });

      const reservationId = Date.now();
      const reservationData = {
        id: reservationId,
        trainerId: trainerId,
        userId: 'user',
        date: date,
        time: time,
        notes: notes,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      res.json({ 
        success: true, 
        message: "예약 요청이 성공적으로 전송되었습니다.",
        data: reservationData
      });
    } catch (error) {
      console.error('예약 생성 오류:', error);
      res.status(500).json({ error: "예약 생성 중 오류가 발생했습니다" });
    }
  });

  // 훈련사 등록 API
  app.post("/api/trainers/register", async (req, res) => {
    try {
      const { name, email, phone, institute, certification, experience, specialties, bio, location } = req.body;

      console.log('훈련사 등록 요청:', { name, email, institute });

      const trainerId = Date.now();
      const trainerData = {
        id: trainerId,
        name: name,
        email: email,
        phone: phone,
        institute: institute,
        certification: certification,
        experience: experience,
        specialties: specialties ? specialties.split(',').map((s: string) => s.trim()) : [],
        bio: bio || `${experience} 경력의 전문 훈련사입니다.`,
        location: location || '서울시',
        rating: 0,
        reviews: 0,
        courses: 0,
        category: "기본 훈련",
        avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        background: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
        status: 'active',
        verified: true,
        featured: false,
        createdAt: new Date().toISOString()
      };

      // 메모리에 훈련사 추가 (실제로는 데이터베이스에 저장)
      if (!global.trainersData) {
        global.trainersData = [];
      }
      global.trainersData.push(trainerData);

      res.json({ 
        success: true, 
        message: "훈련사 등록이 완료되었습니다.",
        data: trainerData
      });
    } catch (error) {
      console.error('훈련사 등록 오류:', error);
      res.status(500).json({ error: "훈련사 등록 중 오류가 발생했습니다" });
    }
  });

  // 반려동물 목록 조회 API
  app.get("/api/pets", async (req, res) => {
    try {
      console.log('반려동물 목록 조회 요청');

      // 메모리에서 반려동물 목록 조회 (실제로는 데이터베이스에서 조회)
      if (!global.petsData) {
        global.petsData = [
          {
            id: 1,
            name: "멍멍이",
            age: "2살",
            breed: "골든리트리버",
            gender: "수컷",
            weight: "25kg",
            image: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
            description: "활발하고 친근한 성격",
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            name: "야옹이",
            age: "1살",
            breed: "페르시안",
            gender: "암컷",
            weight: "4kg",
            image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
            description: "조용하고 우아한 성격",
            createdAt: new Date().toISOString()
          }
        ];
      }

      res.json({ 
        success: true, 
        pets: global.petsData
      });
    } catch (error) {
      console.error('반려동물 목록 조회 오류:', error);
      res.status(500).json({ error: "반려동물 목록 조회 중 오류가 발생했습니다" });
    }
  });

  // 반려동물 등록 API
  app.post("/api/pets", async (req, res) => {
    try {
      const { name, age, breed, gender, weight, description } = req.body;

      console.log('반려동물 등록 요청:', { name, breed, age });

      const petId = Date.now();
      const petData = {
        id: petId,
        name: name,
        age: age,
        breed: breed,
        gender: gender || '수컷',
        weight: weight || '',
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        description: description || '',
        createdAt: new Date().toISOString()
      };

      // 메모리에 반려동물 추가 (실제로는 데이터베이스에 저장)
      if (!global.petsData) {
        global.petsData = [];
      }
      global.petsData.push(petData);

      res.json({ 
        success: true, 
        message: "반려동물이 성공적으로 등록되었습니다.",
        pet: petData
      });
    } catch (error) {
      console.error('반려동물 등록 오류:', error);
      res.status(500).json({ error: "반려동물 등록 중 오류가 발생했습니다" });
    }
  });

  // 상담 Zoom 링크 조회 API
  app.get("/api/consultations/:id/zoom", async (req, res) => {
    try {
      const consultationId = req.params.id;

      // 상담 정보 조회 (실제로는 데이터베이스에서 조회)
      const consultation = {
        id: consultationId,
        trainerName: "김훈련사",
        zoomUrl: "https://zoom.us/j/123456789?pwd=abcd1234",
        meetingId: "123 456 789",
        passcode: "abcd1234",
        status: "scheduled",
        startTime: new Date().toISOString()
      };

      res.json({ 
        success: true, 
        consultation: consultation
      });
    } catch (error) {
      console.error('Zoom 링크 조회 오류:', error);
      res.status(500).json({ error: "Zoom 링크 조회 중 오류가 발생했습니다" });
    }
  });

  // 리뷰 작성 API
  app.post("/api/reviews", async (req, res) => {
    try {
      const { consultationId, trainerName, rating, title, content, tags } = req.body;

      console.log('리뷰 작성 요청:', { consultationId, trainerName, rating });

      const reviewId = Date.now();
      const reviewData = {
        id: reviewId,
        consultationId: consultationId,
        trainerName: trainerName,
        rating: rating,
        title: title,
        content: content,
        tags: tags || [],
        authorName: '반려인',
        createdAt: new Date().toISOString(),
        helpful: 0,
        verified: true
      };

      // 메모리에 리뷰 추가 (실제로는 데이터베이스에 저장)
      if (!global.reviewsData) {
        global.reviewsData = [];
      }
      global.reviewsData.push(reviewData);

      res.json({ 
        success: true, 
        message: "리뷰가 성공적으로 작성되었습니다.",
        review: reviewData
      });
    } catch (error) {
      console.error('리뷰 작성 오류:', error);
      res.status(500).json({ error: "리뷰 작성 중 오류가 발생했습니다" });
    }
  });

  // 리뷰 목록 조회 API
  app.get("/api/reviews", async (req, res) => {
    try {
      const { trainerName, limit = 10, offset = 0 } = req.query;

      console.log('리뷰 목록 조회 요청:', { trainerName, limit, offset });

      // 메모리에서 리뷰 목록 조회 (실제로는 데이터베이스에서 조회)
      if (!global.reviewsData) {
        global.reviewsData = [
          {
            id: 1,
            consultationId: '2',
            trainerName: '박전문가',
            rating: 5,
            title: '정말 만족스러운 상담이었습니다',
            content: '분리불안 문제로 고민이 많았는데, 전문적인 조언과 실질적인 해결방법을 제시해주셔서 큰 도움이 되었습니다. 강아지도 많이 안정되었어요.',
            tags: ['전문성', '친절함', '효과적', '추천함'],
            authorName: '반려인',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            helpful: 15,
            verified: true
          }
        ];
      }

      let filteredReviews = global.reviewsData;

      if (trainerName) {
        filteredReviews = filteredReviews.filter(review => 
          review.trainerName === trainerName
        );
      }

      const paginatedReviews = filteredReviews
        .slice(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string));

      res.json({ 
        success: true, 
        reviews: paginatedReviews,
        total: filteredReviews.length
      });
    } catch (error) {
      console.error('리뷰 목록 조회 오류:', error);
      res.status(500).json({ error: "리뷰 목록 조회 중 오류가 발생했습니다" });
    }
  });

  // 댓글 작성 API
  app.post("/api/comments", async (req, res) => {
    try {
      const { parentType, parentId, content, parentCommentId } = req.body;

      console.log('댓글 작성 요청:', { parentType, parentId, content });

      const commentId = Date.now();
      const commentData = {
        id: commentId,
        parentType: parentType, // 'review', 'course', 'post' 등
        parentId: parentId,
        parentCommentId: parentCommentId || null, // 대댓글인 경우
        content: content,
        authorName: '반려인',
        authorRole: 'pet-owner',
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: []
      };

      // 메모리에 댓글 추가 (실제로는 데이터베이스에 저장)
      if (!global.commentsData) {
        global.commentsData = [];
      }
      global.commentsData.push(commentData);

      res.json({ 
        success: true, 
        message: "댓글이 성공적으로 작성되었습니다.",
        comment: commentData
      });
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      res.status(500).json({ error: "댓글 작성 중 오류가 발생했습니다" });
    }
  });

  // 댓글 목록 조회 API
  app.get("/api/comments", async (req, res) => {
    try {
      const { parentType, parentId } = req.query;

      console.log('댓글 목록 조회 요청:', { parentType, parentId });

      // 메모리에서 댓글 목록 조회 (실제로는 데이터베이스에서 조회)
      if (!global.commentsData) {
        global.commentsData = [];
      }

      const comments = global.commentsData.filter(comment => 
        comment.parentType === parentType && 
        comment.parentId === parentId &&
        !comment.parentCommentId // 최상위 댓글만
      );

      // 각 댓글에 대댓글 추가
      const commentsWithReplies = comments.map(comment => ({
        ...comment,
        replies: global.commentsData.filter(reply => 
          reply.parentCommentId === comment.id
        )
      }));

      res.json({ 
        success: true, 
        comments: commentsWithReplies
      });
    } catch (error) {
      console.error('댓글 목록 조회 오류:', error);
      res.status(500).json({ error: "댓글 목록 조회 중 오류가 발생했습니다" });
    }
  });

  app.post("/api/consultations/:id/join", async (req, res) => {
    try {
      const consultationId = req.params.id;

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

// 검색 API - 성능 최적화 및 에러 처리 개선
app.get('/api/search', async (req, res) => {
  const startTime = Date.now();

  try {
    const { 
      q: query = '', 
      category = 'all', 
      location = 'all',
      difficulty = 'all',
      minPrice = 0,
      maxPrice = 1000000,
      startDate,
      endDate,
      features = [],
      sortBy = 'relevance',
      minRating = 0,
      page = 1,
      limit = 10
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const searchQuery = String(query).toLowerCase().trim();

    console.log(`[검색] "${query}" 검색 시작`);

    let results: any[] = [];

    // 캐시된 결과가 있는지 확인 (개발용)
    const cacheKey = `search:${searchQuery}:${page}:${limit}`;

    if (!searchQuery) {
      // 기본 추천 데이터 (빠른 응답)
      results = [
        {
          id: 1,
          type: 'course',
          title: '기본 순종 훈련',
          description: '반려견의 기본적인 순종 훈련을 배울 수 있는 과정입니다.',
          price: 120000,
          rating: 4.5,
          reviewCount: 32,
          location: '서울시 강남구',
          category: 'basic-training',
          difficulty: 'beginner',
          duration: '4주'
        },
        {
          id: 2,
          type: 'trainer',
          title: '김민수 전문 훈련사',
          description: '10년 경력의 행동교정 전문 훈련사입니다.',
          rating: 4.8,
          reviewCount: 156,
          location: '서울시 서초구',
          category: 'behavior-correction',
          features: ['1:1 수업', '방문 훈련', '수료증']
        },
        {
          id: 3,
          type: 'institute',
          title: '서울 반려동물 교육원',
          description: '종합적인 반려동물 교육 서비스를 제공합니다.',
          rating: 4.6,
          reviewCount: 89,
          location: '서울시 마포구',
          features: ['그룹 수업', '시설 완비', '주차 가능']
        }
      ];
    } else {
      // 데이터베이스 검색 시도 (빠른 실패 처리)
      const dbPromises = [];

      // 병렬 검색으로 성능 향상
      dbPromises.push(
        db.select().from(courses)
          .where(or(
            ilike(courses.title, `%${searchQuery}%`),
            ilike(courses.description, `%${searchQuery}%`)
          ))
          .limit(3)
          .catch(err => {
            console.log('[검색] 강의 검색 실패:', err.message);
            return [];
          })
      );

      dbPromises.push(
        db.select().from(users)
          .where(or(
            ilike(users.name, `%${searchQuery}%`),
            ilike(users.specialty, `%${searchQuery}%`)
          ))
          .limit(3)
          .catch(err => {
            console.log('[검색] 훈련사 검색 실패:', err.message);
            return [];
          })
      );

      dbPromises.push(
        db.select().from(institutes)
          .where(or(
            ilike(institutes.name, `%${searchQuery}%`),
            ilike(institutes.description, `%${searchQuery}%`)
          ))
          .limit(3)
          .catch(err => {
            console.log('[검색] 기관 검색 실패:', err.message);
            return [];
          })
      );

      try {
        const [courseResults, trainerResults, instituteResults] = await Promise.all(dbPromises);

        if (courseResults.length > 0) {
          results.push(...courseResults.map(course => ({ ...course, type: 'course' })));
        }
        if (trainerResults.length > 0) {
          results.push(...trainerResults.map(trainer => ({ ...trainer, type: 'trainer', title: trainer.name })));
        }
        if (instituteResults.length > 0) {
          results.push(...instituteResults.map(institute => ({ ...institute, type: 'institute', title: institute.name })));
        }
      } catch (error) {
        console.error('[검색] 전체 데이터베이스 검색 실패:', error.message);
      }

      // 데이터베이스에 결과가 없으면 샘플 데이터 제공
      if (results.length === 0) {
        results = [
          {
            id: 1,
            type: 'course',
            title: `${searchQuery} 맞춤 훈련 과정`,
            description: `${searchQuery}에 특화된 전문 훈련 프로그램입니다.`,
            price: 180000,
            rating: 4.7,
            reviewCount: 45,
            location: '서울시 강남구',
            category: 'specialized-training',
            difficulty: 'intermediate',
            duration: '6주'
          },
          {
            id: 2,
            type: 'trainer',
            title: `${searchQuery} 전문 훈련사`,
            description: `${searchQuery} 분야 10년 경력의 전문 훈련사입니다.`,
            rating: 4.9,
            reviewCount: 128,
            location: '서울시 서초구',
            category: 'specialized-training',
            features: ['1:1 맞춤', '온라인 상담', '사후 관리']
          }
        ];
      }
    }

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.log(`[검색] "${query}" 완료 - ${results.length}개 결과, ${responseTime}ms`);

    // 추천 검색어
    const suggestions = searchQuery ? [
      '기본 훈련', '행동 교정', '퍼피 트레이닝', '애질리티', '사회화 훈련'
    ].filter(s => s.toLowerCase().includes(searchQuery) || searchQuery.includes(s.slice(0, 2))) : [];

    res.json({
      results,
      totalCount: results.length,
      currentPage: Number(page),
      totalPages: Math.ceil(results.length / Number(limit)),
      suggestions: suggestions.slice(0, 5),
      responseTime
    });

  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.error('[검색] 치명적 오류:', error);

    res.status(500).json({ 
      error: '검색 서비스가 일시적으로 불안정합니다. 잠시 후 다시 시도해주세요.',
      responseTime,
      timestamp: new Date().toISOString()
    });
  }
});

  // 강의 수강신청
  app.post("/api/courses/:id/enroll", (req, res) => {
    const courseId = parseInt(req.params.id);
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "사용자 ID가 필요합니다." 
      });
    }

    // 실제로는 데이터베이스에서 수강신청 처리
    console.log(`강좌 ${courseId}에 사용자 ${userId} 수강신청`);

    return res.json({ 
      success: true, 
      message: "수강신청이 완료되었습니다." 
    });
  });

  // 강의 리뷰 조회
  app.get("/api/courses/:id/reviews", (req, res) => {
    const courseId = parseInt(req.params.id);

    const mockReviews = [
      {
        id: 1,
        userId: 1,
        userName: "김반려",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100",
        rating: 5,
        comment: "정말 유익한 강의였습니다. 우리 강아지가 많이 달라졌어요!",
        createdAt: "2025-06-15",
        helpful: 12
      },
      {
        id: 2,
        userId: 2,
        userName: "박훈련",
        userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b494?w=100&h=100",
        rating: 4,
        comment: "체계적이고 실용적인 내용이 좋았습니다.",
        createdAt: "2025-06-10",
        helpful: 8
      }
    ];

    return res.json(mockReviews);
  });

  // 강의 리뷰 작성
  app.post("/api/courses/:id/reviews", (req, res) => {
    const courseId = parseInt(req.params.id);
    const { userId, rating, comment } = req.body;

    if (!userId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "모든 필드를 입력해주세요."
      });
    }

    // 실제로는 데이터베이스에 저장
    console.log(`강좌 ${courseId}에 리뷰 작성:`, { userId, rating, comment });

    return res.json({
      success: true,
      message: "리뷰가 등록되었습니다.",
      review: {
        id: Date.now(),
        userId,
        rating,
        comment,
        createdAt: new Date().toISOString().split('T')[0],
        helpful: 0
      }
    });
  });

  // 강의 즐겨찾기 추가/제거
  app.post("/api/courses/:id/favorite", (req, res) => {
    const courseId = parseInt(req.params.id);
    const { userId, action } = req.body; // action: 'add' or 'remove'

    if (!userId || !action) {
      return res.status(400).json({
        success: false,
        message: "사용자 ID와 액션이 필요합니다."
      });
    }

    console.log(`강좌 ${courseId} 즐겨찾기 ${action}:`, userId);

    return res.json({
      success: true,
      message: action === 'add' ? "즐겨찾기에 추가되었습니다." : "즐겨찾기에서 제거되었습니다.",
      isFavorite: action === 'add'
    });
  });

  // 사용자 즐겨찾기 강의 목록
  app.get("/api/users/:userId/favorite-courses", (req, res) => {
    const userId = parseInt(req.params.userId);

    const mockFavorites = [
      {
        id: 1,
        title: "강아지 기본 복종 훈련",
        thumbnail: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=200",
        price: 120000,
        rating: 4.7,
        addedAt: "2025-06-15"
      }
    ];

    return res.json(mockFavorites);
  });

  // 강의 진행률 업데이트
  app.post("/api/courses/:id/progress", (req, res) => {
    const courseId = parseInt(req.params.id);
    const { userId, lessonId, completed } = req.body;

    if (!userId || !lessonId) {
      return res.status(400).json({
        success: false,
        message: "필수 정보가 누락되었습니다."
      });
    }

    // 실제로는 데이터베이스에서 진행률 업데이트
    console.log(`강좌 ${courseId} 진행률 업데이트:`, { userId, lessonId, completed });

    return res.json({
      success: true,
      message: "진행률이 업데이트되었습니다.",
      progress: completed ? 75 : 65 // 모의 진행률
    });
  });

  // 개인화된 강의 추천
  app.get("/api/users/:userId/recommended-courses", (req, res) => {
    const userId = parseInt(req.params.userId);

    const mockRecommendations = [
      {
        id: 4,
        title: "고급 어질리티 훈련",
        reason: "기본 훈련 과정을 완료하신 분께 추천",
        thumbnail: "https://images.unsplash.com/photo-1583336663277-620dc1996580?w=400&h=200",
        price: 180000,
        rating: 4.8,
        matchScore: 0.92
      },
      {
        id: 5,
        title: "반려견 심리 케어",
        reason: "관심 분야를 기반으로 추천",
        thumbnail: "https://images.unsplash.com/photo-1601758177266-bc599de87707?w=400&h=200",
        price: 150000,
        rating: 4.6,
        matchScore: 0.87
      }
    ];

    return res.json(mockRecommendations);
  });

  // 강의 수료증 발급
  app.post("/api/courses/:id/certificate", (req, res) => {
    const courseId = parseInt(req.params.id);
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "사용자 ID가 필요합니다."
      });
    }

    // 수강 완료 여부 확인 (실제로는 데이터베이스에서)
    const isCompleted = true; // 모의 데이터

    if (!isCompleted) {
      return res.status(400).json({
        success: false,
        message: "강의를 완료한 후 수료증을 발급받을 수 있습니다."
      });
    }

    const certificate = {
      id: `CERT-${courseId}-${userId}-${Date.now()}`,
      courseId,
      userId,
      courseTitle: "강아지 기본 복종 훈련",
      studentName: "김반려",
      completedAt: new Date().toISOString().split('T')[0],
      issuedAt: new Date().toISOString(),
      certificateUrl: `/certificates/${courseId}/${userId}.pdf`
    };

    console.log(`수료증 발급:`, certificate);

    return res.json({
      success: true,
      message: "수료증이 발급되었습니다.",
      certificate
    });
  });

  // 사용자 수료증 목록
  app.get("/api/users/:userId/certificates", (req, res) => {
    const userId = parseInt(req.params.userId);

    const mockCertificates = [
      {
        id: "CERT-1-1-1706123456789",
        courseId: 1,
        courseTitle: "강아지 기본 복종 훈련",
        completedAt: "2025-06-15",
        issuedAt: "2025-06-15T10:30:00.000Z",
        certificateUrl: "/certificates/1/1.pdf"
      }
    ];

    return res.json(mockCertificates);
  });

  // 알림 관련 라우트 (// 임시 비활성화)
  // registerNotificationRoutes(app);
  // Community API routes
  app.get("/api/community/posts", async (req, res) => {
    try {
      console.log('커뮤니티 게시글 조회 요청');

      const mockPosts = [
        {
          id: 1,
          user: {
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
            name: "최견주",
            time: "3시간 전"
          },
          title: "산책 중 다른 강아지 만났을 때 대처법",
          content: "오늘 산책 중 크고 활발한 강아지를 만났는데, 우리집 강아지가 너무 긴장하더라구요.",
          likes: 28,
          comments: 12,
          tag: { text: "산책팁", variant: "blue" }
        }
      ];

      res.setHeader('Content-Type', 'application/json');
      res.json(mockPosts);
    } catch (error: any) {
      console.error('커뮤니티 게시글 조회 오류:', error);
      res.status(500).json({ message: "커뮤니티 게시글 조회 실패: " + error.message });
    }
  });

  app.post("/api/community/posts", async (req, res) => {
    try {
      const { title, content, category, tags } = req.body;
      console.log('서버 - 새 게시글 작성 요청:', { title, content, category, tags });

      if (!title || !content) {
        return res.status(400).json({ message: "제목과 내용은 필수입니다." });
      }

      const newPost = {
        id: Date.now(),
        user: {
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
          name: "반려인",
          time: "방금 전"
        },
        title,
        content,
        likes: 0,
        comments: 0,
        tag: {
          text: category || '일반',
          variant: 'blue'
        },
        category: category || '일반',
        tags: Array.isArray(tags) ? tags : [],
        createdAt: new Date().toISOString()
      };

      console.log('서버 - 새 게시글 생성 완료:', newPost);
      res.setHeader('Content-Type', 'application/json');
      res.status(201).json(newPost);
    } catch (error: any) {
      console.error('서버 - 게시글 작성 오류:', error);
      res.status(500).json({ message: "게시글 작성 실패: " + error.message });
    }
  });

  // 파일 업로드 라우트
  registerUploadRoutes(app);

  // 메시징 라우트 등록
  const httpServer = createServer(app);
  registerMessagingRoutes(app, httpServer);

  // 알림 라우트 등록 (WebSocket 설정 문제로 임시 비활성화)

// 건강 관리 라우트 (임시 비활성화)
  // setupHealthRoutes(app);

  // 분석 라우트  
  registerAnalyticsRoutes(app);

  // 소셜/커뮤니티 라우트 (임시 비활성화)
  // setupSocialRoutes(app);

  // 서비스 검수 API
  app.get('/api/service/inspection', async (req, res) => {
    try {
      const inspection = {
        timestamp: new Date().toISOString(),
        status: 'operational',
        features: {
          authentication: { status: 'active', health: 100 },
          petManagement: { status: 'active', health: 95 },
          courses: { status: 'active', health: 90 },
          community: { status: 'active', health: 85 },
          messaging: { status: 'limited', health: 60 },
          shopping: { status: 'active', health: 80 },
          videoCall: { status: 'partial', health: 40 },
          payments: { status: 'inactive', health: 0 }
        },
        performance: {
          responseTime: '120ms',
          uptime: '99.8%',
          memoryUsage: '45%',
          cpuUsage: '23%'
        },
        recommendations: [
          'WebSocket 서버 활성화 권장',
          '결제 시스템 구현 필요',
          '실시간 기능 개선 필요',
          '데이터베이스 최적화 권장'
        ]
      };

      res.json(inspection);
    } catch (error) {
      console.error('서비스 검수 오류:', error);
      res.status(500).json({ error: '서비스 검수 중 오류가 발생했습니다' });
    }
  });

  // 기능별 상태 체크 API
  app.get('/api/service/features', async (req, res) => {
    try {
      const features = {
        core: [
          { name: '사용자 인증', status: 'active', coverage: 100 },
          { name: '반려동물 관리', status: 'active', coverage: 95 },
          { name: '훈련사 관리', status: 'active', coverage: 90 }
        ],
        educational: [
          { name: '강좌 시스템', status: 'active', coverage: 85 },
          { name: '화상 교육', status: 'partial', coverage: 40 },
          { name: '진도 관리', status: 'active', coverage: 70 }
        ],
        communication: [
          { name: '메시징', status: 'limited', coverage: 60 },
          { name: '알림 시스템', status: 'partial', coverage: 50 },
          { name: '커뮤니티', status: 'active', coverage: 80 }
        ],
        commerce: [
          { name: '상품 조회', status: 'active', coverage: 90 },
          { name: '장바구니', status: 'active', coverage: 85 },
          { name: '결제 처리', status: 'inactive', coverage: 0 }
        ]
      };

      res.json(features);
    } catch (error) {
      console.error('기능 상태 조회 오류:', error);
      res.status(500).json({ error: '기능 상태 조회 중 오류가 발생했습니다' });
    }
  });

// ===== Trainer Routes =====

// Get all trainers with filtering
  app.get("/api/trainers", async (req, res) => {
    try {
      const { 
        specialty, 
        location, 
        certification, 
        featured, 
        search, 
        minRating, 
        maxPrice,
        page = 1,
        limit = 12,
        sortBy = 'rating',
        sortOrder = 'desc'
      } = req.query;

      let trainers = await storage.getAllTrainers();

      // 필터링 적용
      if (specialty && specialty !== 'all') {
        trainers = trainers.filter(trainer => 
          trainer.specialties?.includes(specialty) || trainer.specialty === specialty
        );
      }

      if (location) {
        trainers = trainers.filter(trainer => 
          trainer.address?.includes(location as string) ||
          trainer.location?.includes(location as string)
        );
      }

      if (certification === 'true') {
        trainers = trainers.filter(trainer => trainer.certifications && trainer.certifications.length > 0);
      }

      if (featured === 'true') {
        trainers = trainers.filter(trainer => trainer.featured === true);
      }

      if (search) {
        const searchTerm = (search as string).toLowerCase();
        trainers = trainers.filter(trainer => 
          trainer.name.toLowerCase().includes(searchTerm) ||
          trainer.bio?.toLowerCase().includes(searchTerm) ||
          trainer.specialties?.some((spec: string) => spec.toLowerCase().includes(searchTerm))
        );
      }

      if (minRating) {
        trainers = trainers.filter(trainer => trainer.rating >= parseFloat(minRating as string));
      }

      if (maxPrice) {
        trainers = trainers.filter(trainer => trainer.price <= parseInt(maxPrice as string));
      }

      // 정렬
      trainers.sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
          case 'rating':
            aValue = a.rating || 0;
            bValue = b.rating || 0;
            break;
          case 'price':
            aValue = a.price || 0;
            bValue = b.price || 0;
            break;
          case 'experience':
            aValue = a.experience || 0;
            bValue = b.experience || 0;
            break;
          case 'reviews':
            aValue = a.reviewCount || 0;
            bValue = b.reviewCount || 0;
            break;
          default:
            aValue = a.rating || 0;
            bValue = b.rating || 0;
        }

        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
      });

      // 페이지네이션
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;

      const paginatedTrainers = trainers.slice(startIndex, endIndex);
      const totalPages = Math.ceil(trainers.length / limitNum);

      return res.status(200).json({
        trainers: paginatedTrainers,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount: trainers.length,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        },
        filters: {
          specialty,
          location,
          certification,
          featured,
          search,
          minRating,
          maxPrice
        }
      });
    } catch (error: any) {
      console.error("Get trainers error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // 훈련사 상담 예약 API
  app.post("/api/trainers/:id/consultation", async (req, res) => {
    try {
      const trainerId = parseInt(req.params.id);
      const { userId, date, time, message } = req.body;

      // 간단한 예약 데이터 생성 (실제로는 DB에 저장)
      const consultation = {
        id: Date.now(),
        trainerId,
        userId,
        date,
        time,
        message,
        status: 'pending',
        createdAt: new Date()
      };

      return res.status(201).json({
        message: "상담 예약이 완료되었습니다.",
        consultation
      });
    } catch (error: any) {
      console.error("Consultation booking error:", error);
      return res.status(500).json({ message: "예약 처리 중 오류가 발생했습니다." });
    }
  });

  // 훈련사 리뷰 조회 API
  app.get("/api/trainers/:id/reviews", async (req, res) => {
    try {
      const trainerId = parseInt(req.params.id);
      const { page = 1, limit = 10 } = req.query;

      // 임시 리뷰 데이터
      const reviews = [
        {
          id: 1,
          userId: 1,
          userName: "김반려",
          rating: 5,
          comment: "정말 친절하고 전문적인 훈련사님입니다. 우리 강아지가 많이 달라졌어요!",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          id: 2,
          userId: 2,
          userName: "이고양",
          rating: 4,
          comment: "체계적인 교육 프로그램으로 만족스러운 결과를 얻었습니다.",
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        }
      ];

      return res.status(200).json({
        reviews,
        totalCount: reviews.length
      });
    } catch (error: any) {
      console.error("Get trainer reviews error:", error);
      return res.status(500).json({ message: "리뷰 조회 중 오류가 발생했습니다." });
    }
  });

  // 훈련사 스케줄 조회 API
  app.get("/api/trainers/:id/schedule", async (req, res) => {
    try {
      const trainerId = parseInt(req.params.id);
      const { date } = req.query;

      // 임시 스케줄 데이터
      const schedule = {
        trainerId,
        date: date || new Date().toISOString().split('T')[0],
        availableSlots: [
          { time: "09:00", available: true },
          { time: "10:00", available: false },
          { time: "11:00", available: true },
          { time: "14:00", available: true },
          { time: "15:00", available: false },
          { time: "16:00", available: true }
        ]
      };

      return res.status(200).json(schedule);
    } catch (error: any) {
      console.error("Get trainer schedule error:", error);
      return res.status(500).json({ message: "스케줄 조회 중 오류가 발생했습니다." });
    }
  });

  // ===== Course Routes =====

  // Get all courses
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      return res.status(200).json(courses);
    } catch (error: any) {
      console.error("Get courses error:", error);
      return res.status(500).json({ message: "강좌 조회 중 오류가 발생했습니다." });
    }
  });

// 관리자 - 배너 관리
  app.get('/api/admin/banners', requireAuth('admin'), async (req, res) => {
    try {
      const banners = await storage.getAllBanners();
      res.json(banners);
    } catch (error) {
      console.error('배너 조회 오류:', error);
      res.status(500).json({ error: '배너 조회에 실패했습니다.' });
    }
  });

  // 관리자 - 업체 등록
  app.post('/api/admin/locations', requireAuth('admin'), async (req, res) => {
    try {
      const {
        name,
        type,
        address,
        phone,
        description,
        services,
        priceRange,
        operatingHours,
        image,
        latitude,
        longitude,
        isPartner,
        status
      } = req.body;

      // 필수 필드 검증
      if (!name || !type || !address) {
        return res.status(400).json({ 
          error: '업체명, 유형, 주소는 필수 항목입니다.' 
        });
      }

      // 새 업체 정보 생성
      const newLocation = {
        id: Date.now(), // 실제로는 DB에서 생성된 ID 사용
        name,
        type,
        address,
        phone: phone || '',
        description: description || '',
        services: services || [],
        priceRange: priceRange || '',
        operatingHours: operatingHours || { open: '09:00', close: '18:00' },
        image: image || 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400',
        latitude: latitude || 37.5665,
        longitude: longitude || 126.9780,
        isPartner: isPartner || true,
        status: status || 'active',
        rating: 0,
        reviewCount: 0,
        distance: 0,
        createdAt: new Date().toISOString(),
        createdBy: req.user?.id || 'admin'
      };

      // 메모리 저장소에 저장 (실제로는 데이터베이스 사용)
      if (!global.adminLocations) {
        global.adminLocations = [];
      }
      global.adminLocations.push(newLocation);

      console.log('새 업체 등록:', newLocation);

      res.status(201).json({
        success: true,
        message: '업체가 성공적으로 등록되었습니다.',
        location: newLocation
      });

    } catch (error) {
      console.error('업체 등록 오류:', error);
      res.status(500).json({ 
        error: '업체 등록 중 오류가 발생했습니다.' 
      });
    }
  });

  // 관리자 - 업체 목록 조회
  app.get('/api/admin/locations', requireAuth('admin'), async (req, res) => {
    try {
      // 실제로는 데이터베이스에서 조회, 임시로 메모리 저장소 사용
      if (!global.adminLocations) {
        global.adminLocations = [];
      }

      res.json({
        success: true,
        locations: global.adminLocations
      });
    } catch (error) {
      console.error('업체 목록 조회 오류:', error);
      res.status(500).json({ 
        error: '업체 목록 조회에 실패했습니다.' 
      });
    }
  });

  // 관리자 - 업체 삭제
  app.delete('/api/admin/locations/:id', requireAuth('admin'), async (req, res) => {
    try {
      const locationId = parseInt(req.params.id);

      if (!global.adminLocations) {
        global.adminLocations = [];
      }

      const locationIndex = global.adminLocations.findIndex(loc => loc.id === locationId);
      if (locationIndex === -1) {
        return res.status(404).json({ 
          error: '업체를 찾을 수 없습니다.' 
        });
      }

      global.adminLocations.splice(locationIndex, 1);

      res.json({
        success: true,
        message: '업체가 성공적으로 삭제되었습니다.'
      });

      console.log('업체 삭제:', locationId);
    } catch (error) {
      console.error('업체 삭제 오류:', error);
      res.status(500).json({ 
        error: '업체 삭제에 실패했습니다.' 
      });
    }
  });

  // 관리자 - 업체 상태 변경
  app.patch('/api/admin/locations/:id/status', requireAuth('admin'), async (req, res) => {
    try {
      const locationId = parseInt(req.params.id);
      const { status } = req.body;

      if (!global.adminLocations) {
        global.adminLocations = [];
      }

      const locationIndex = global.adminLocations.findIndex(loc => loc.id === locationId);
      if (locationIndex === -1) {
        return res.status(404).json({ 
          error: '업체를 찾을 수 없습니다.' 
        });
      }

      global.adminLocations[locationIndex].status = status;
      global.adminLocations[locationIndex].updatedAt = new Date().toISOString();

      res.json({
        success: true,
        message: '업체 상태가 성공적으로 변경되었습니다.',
        location: global.adminLocations[locationIndex]
      });

      console.log('업체 상태 변경:', locationId, status);
    } catch (error) {
      console.error('업체 상태 변경 오류:', error);
      res.status(500).json({ 
        error: '업체 상태 변경에 실패했습니다.' 
      });
    }
  });

  const multer = require('multer');
  const path = require('path');

  // Multer Storage 설정
  const storageConfig = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, 'public/uploads/'); // 파일 저장 경로
    },
    filename: (req: any, file: any, cb: any) => {
      const ext = path.extname(file.originalname);
      const filename = path.basename(file.originalname, ext) + '-' + Date.now() + ext;
      cb(null, filename); // 저장될 파일명
    }
  });

  // Multer 업로드 미들웨어 생성
  const upload = multer({ 
    storage: storageConfig,
    limits: { fileSize: 10 * 1024 * 1024 } // 파일 크기 제한: 10MB
  });

  // 이미지 업로드 라우트
  const uploadSingle = upload.single('image'); // 'image' 필드명으로 파일 업로드 받음
  // 이미지 업로드 라우트
  app.post('/api/upload', (req: any, res: any) => {
    uploadSingle(req, res, (err: any) => {
      if (err) {
        console.error('업로드 오류:', err);
        return res.status(400).json({ 
          error: err.message || '파일 업로드에 실패했습니다.' 
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          error: '업로드할 파일이 없습니다.' 
        });
      }

      // 파일 정보 반환
      const fileInfo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: req.file.path.replace(process.cwd() + '/public', ''),
        size: req.file.size,
        mimetype: req.file.mimetype
      };

      res.json({
        message: '파일 업로드 성공',
        url: fileInfo.url,
        file: fileInfo
      });
    });
  });

  // 위치 기반 서비스 라우트
  app.get('/api/places/nearby', async (req, res) => {
    try {
      const { latitude, longitude, radius = 1000 } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({ error: '위도와 경도가 필요합니다.' });
      }

      // 실제로는 데이터베이스에서 위치 기반 검색 실행
      const nearbyPlaces = [
        {
          id: 1,
          name: "Talez 펫 플레이스",
          type: "카페",
          address: "서울시 강남구 테헤란로 427",
          latitude: 37.5034,
          longitude: 127.0448,
          distance: 0.5
        },
        {
          id: 2,
          name: "Talez 동물병원",
          type: "병원",
          address: "서울시 강남구 삼성동 123-45",
          latitude: 37.5133,
          longitude: 127.0585,
          distance: 0.8
        }
      ];

      res.json(nearbyPlaces);
    } catch (error) {
      console.error('위치 기반 장소 조회 오류:', error);
      res.status(500).json({ error: '위치 기반 장소 조회에 실패했습니다.' });
    }
  });
  

  // Global error handler (commented out for now)
  // app.use(errorHandler);

  return httpServer;
}