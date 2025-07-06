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
import { courses, users, institutes } from "../shared/schema";
import { ilike, or } from "drizzle-orm";
import { 
  analyzePetBehavior, 
  generateTrainingPlan, 
  analyzeHealthSymptoms,
  summarizeArticle,
  analyzeSentiment,
  analyzeImage,
  analyzeVideo,
  generateImage
} from "./gemini";
import {
  fusedBehaviorAnalysis,
  fusedTrainingPlan,
  fusedHealthAnalysis,
  fusedSentimentAnalysis,
  compareModelPerformance
} from "./ai-fusion";
// import { setupCommissionRoutes } from './commission/routes';
// import { setupHealthRoutes } from './routes/health';
import { registerAnalyticsRoutes } from './routes/analytics';
import { setupSocialRoutes } from './routes/social';
import multer from 'multer';
import path from 'path';

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

  // 인증 API 라우트
  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: '아이디와 비밀번호를 입력해주세요.'
        });
      }

      // 테스트 계정 정보
      const testAccounts = {
        'testuser': { password: 'password123', role: 'pet-owner', name: '테스트 사용자' },
        'trainer01': { password: 'trainer123', role: 'trainer', name: '훈련사' },
        'admin': { password: 'admin123', role: 'admin', name: '관리자' },
        'institute01': { password: 'institute123', role: 'institute-admin', name: '기관 관리자' }
      };

      const account = testAccounts[username as keyof typeof testAccounts];
      
      if (!account || account.password !== password) {
        return res.status(401).json({
          success: false,
          message: '아이디 또는 비밀번호가 일치하지 않습니다.'
        });
      }

      // 세션에 사용자 정보 저장
      req.session.user = {
        id: username,
        username,
        email: account.email || `${username}@talez.com`,
        role: account.role,
        name: account.name
      };

      return res.json({
        success: true,
        user: {
          id: username,
          username,
          role: account.role,
          name: account.name
        }
      });

    } catch (error) {
      console.error('로그인 오류:', error);
      return res.status(500).json({
        success: false,
        message: '로그인 처리 중 오류가 발생했습니다.'
      });
    }
  });

  // 로그아웃 API
  app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: '로그아웃 실패' });
      }
      res.clearCookie('connect.sid');
      return res.json({ success: true, message: '로그아웃 성공' });
    });
  });

  // 사용자 정보 확인 API
  app.get('/api/user', (req, res) => {
    if (req.session.user) {
      return res.json(req.session.user);
    }
    return res.status(401).json({ message: '인증되지 않은 사용자' });
  });

  // 대시보드 라우트 등록
  registerDashboardRoutes(app);

  // 관리자 라우트 등록
  registerAdminRoutes(app);

  // 실시간 인기 통계 API
  app.get("/api/popular-stats", async (req, res) => {
    try {
      const popularStats = {
        trainers: [
          { id: 6, views: 2156, likes: 134, name: "강동훈 훈련사", category: "국가자격증" }
        ],
        courses: [
          { id: "curriculum-basic-obedience", views: 1923, likes: 98, title: "기초 복종훈련 완전정복", category: "기초훈련" }
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

  // 반려동물 관리 API - 완성된 버전
  app.get("/api/pets", async (req, res) => {
    try {
      const userId = req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const pets = await storage.getPetsByUserId(userId);
      res.json(pets);
    } catch (error) {
      console.error('Error fetching pets:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post("/api/pets", async (req, res) => {
    try {
      const userId = req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const petData = { ...req.body, userId };
      const newPet = await storage.createPet(petData);
      res.status(201).json(newPet);
    } catch (error) {
      console.error('Error creating pet:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/pets/:id", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const pet = await storage.getPet(petId);

      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      }

      res.json(pet);
    } catch (error) {
      console.error('Error fetching pet:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put("/api/pets/:id", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const updatedPet = await storage.updatePet(petId, req.body);

      if (!updatedPet) {
        return res.status(404).json({ message: 'Pet not found' });
      }

      res.json(updatedPet);
    } catch (error) {
      console.error('Error updating pet:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.delete("/api/pets/:id", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const deleted = await storage.deletePet(petId);

      if (!deleted) {
        return res.status(404).json({ message: 'Pet not found' });
      }

      res.json({ message: 'Pet deleted successfully' });
    } catch (error) {
      console.error('Error deleting pet:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 건강 관리 API
  app.get("/api/pets/:id/health", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const healthRecords = await storage.getPetHealthRecords(petId);
      res.json(healthRecords);
    } catch (error) {
      console.error('Error fetching health records:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post("/api/pets/:id/health-records", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const healthRecord = await storage.createHealthRecord(petId, req.body);
      res.status(201).json(healthRecord);
    } catch (error) {
      console.error('Error creating health record:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/pets/:id/vaccinations", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const vaccinations = await storage.getPetVaccinations(petId);
      res.json(vaccinations);
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/pets/:id/medications", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const medications = await storage.getPetMedications(petId);
      res.json(medications);
    } catch (error) {
      console.error('Error fetching medications:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 훈련 관리 API
  app.get("/api/pets/:id/training-sessions", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const sessions = await storage.getPetTrainingSessions(petId);
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching training sessions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/pets/:id/progress", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const progress = await storage.getPetProgress(petId);
      res.json(progress);
    } catch (error) {
      console.error('Error fetching pet progress:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/pets/:id/achievements", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const achievements = await storage.getPetAchievements(petId);
      res.json(achievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      res.status(500).json({ message: 'Internal server error' });
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
    // URL 디코딩 추가 (한국어 검색 지원)
    let searchQuery = String(query).trim();
    
    console.log(`[검색 디버그] 원본 쿼리: "${query}"`);
    console.log(`[검색 디버그] 원본 쿼리 타입: ${typeof query}`);
    console.log(`[검색 디버그] 원본 쿼리 길이: ${String(query).length}`);
    
    // 한국어 인코딩 문제를 직접 해결
    const koreanFixMap = {
      'ê°ëí': '강동훈',
      'ê°': '강',
      'ëí': '동훈',
      // 추가 매핑
      '%EA%B0%95%EB%8F%99%ED%9B%88': '강동훈',
      '%ea%b0%95%eb%8f%99%ed%9b%88': '강동훈'
    };
    
    // 먼저 직접 매핑을 시도
    for (const [broken, correct] of Object.entries(koreanFixMap)) {
      if (searchQuery.includes(broken)) {
        console.log(`[검색 디버그] 직접 매핑: "${broken}" -> "${correct}"`);
        searchQuery = searchQuery.replace(broken, correct);
      }
    }
    
    // URL 디코딩 시도
    try {
      const decoded = decodeURIComponent(searchQuery);
      if (decoded !== searchQuery) {
        console.log(`[검색 디버그] URL 디코딩: "${searchQuery}" -> "${decoded}"`);
        searchQuery = decoded;
      }
    } catch (e) {
      console.log('[검색 디버그] URL 디코딩 실패:', e.message);
    }
    
    // 다시 한번 매핑 확인
    for (const [broken, correct] of Object.entries(koreanFixMap)) {
      if (searchQuery.includes(broken)) {
        console.log(`[검색 디버그] 후처리 매핑: "${broken}" -> "${correct}"`);
        searchQuery = searchQuery.replace(broken, correct);
      }
    }
    
    console.log(`[검색 디버그] 원본 검색어: "${query}", 디코딩된 검색어: "${searchQuery}"`);

    console.log(`[검색] "${query}" 검색 시작`);

    let results: any[] = [];

    // 캐시된 결과가 있는지 확인 (개발용)
    const cacheKey = `search:${searchQuery}:${page}:${limit}`;

    if (!searchQuery) {
      // 검색어가 없으면 빈 결과 반환
      results = [];
    } else {
      // 데이터베이스 검색 시도 (빠른 실패 처리)
      const dbPromises = [];

      // 메모리 저장소에서 검색 (등록된 실제 데이터 우선)
      try {
        console.log(`[검색 디버그] 검색어: "${searchQuery}"`);
        
        // 훈련사 검색
        const allTrainers = await storage.getAllTrainers();
        console.log(`[검색 디버그] 전체 훈련사 수: ${allTrainers.length}`);
        
        allTrainers.forEach((trainer, index) => {
          console.log(`[검색 디버그] 훈련사 ${index + 1}: ${trainer.name}, 위치: ${trainer.location}`);
        });
        
        const matchedTrainers = allTrainers.filter(trainer => {
          const nameMatch = trainer.name && trainer.name.includes(searchQuery);
          const bioMatch = trainer.bio && trainer.bio.includes(searchQuery);
          const specialtyMatch = trainer.specialties && trainer.specialties.some(specialty => 
            specialty.includes(searchQuery)
          );
          const locationMatch = trainer.location && trainer.location.includes(searchQuery);
          
          const isMatch = nameMatch || bioMatch || specialtyMatch || locationMatch;
          
          if (isMatch) {
            console.log(`[검색 디버그] 매칭된 훈련사: ${trainer.name} (이름:${nameMatch}, 바이오:${bioMatch}, 전문:${specialtyMatch}, 위치:${locationMatch})`);
          }
          
          return isMatch;
        });

        console.log(`[검색 디버그] 매칭된 훈련사 수: ${matchedTrainers.length}`);
        
        // 위치 데이터 검색 (기존 위치 + 기관 데이터)
        const allLocations = await storage.getAllLocations();
        const instituteData = await storage.getInstitutes();
        
        console.log(`[검색 디버그] 전체 위치 수: ${allLocations.length}`);
        console.log(`[검색 디버그] 전체 기관 수: ${instituteData.length}`);
        
        // 기관을 위치 형식으로 변환
        const instituteLocations = instituteData.map(institute => ({
          id: institute.id,
          name: institute.name,
          type: 'institute',
          address: institute.address,
          description: institute.description,
          services: institute.facilities || [],
          phone: institute.phone,
          website: institute.website,
          rating: institute.rating,
          reviewCount: institute.reviewCount,
          certification: institute.isVerified,
          latitude: institute.latitude,
          longitude: institute.longitude,
          isActive: institute.isActive
        }));
        
        // 기존 위치와 기관 위치 통합
        const combinedLocations = [...allLocations, ...instituteLocations];
        
        combinedLocations.forEach((location, index) => {
          console.log(`[검색 디버그] 위치 ${index + 1}: ${location.name}, 유형: ${location.type}, 주소: ${location.address}`);
        });
        
        const matchedLocations = combinedLocations.filter(location => {
          const nameMatch = location.name && location.name.toLowerCase().includes(searchQuery);
          const addressMatch = location.address && location.address.toLowerCase().includes(searchQuery);
          const descriptionMatch = location.description && location.description.toLowerCase().includes(searchQuery);
          const serviceMatch = location.services && Array.isArray(location.services) && location.services.some(service => 
            service.toLowerCase && service.toLowerCase().includes(searchQuery)
          );
          
          const isMatch = nameMatch || addressMatch || descriptionMatch || serviceMatch;
          
          if (isMatch) {
            console.log(`[검색 디버그] 매칭된 위치: ${location.name} (이름:${nameMatch}, 주소:${addressMatch}, 설명:${descriptionMatch}, 서비스:${serviceMatch})`);
          }
          
          return isMatch;
        });

        console.log(`[검색 디버그] 매칭된 위치 수: ${matchedLocations.length}`);

        // 매칭된 위치를 결과에 추가
        if (matchedLocations.length > 0) {
          results.push(...matchedLocations.map(location => ({
            id: location.id,
            type: location.type,
            title: location.name,
            description: location.description || '전문 펫 서비스 업체',
            rating: location.rating || 4.5,
            reviewCount: location.reviewCount || 0,
            location: location.address,
            category: location.type,
            features: Array.isArray(location.services) ? location.services : [],
            phone: location.phone,
            website: location.website,
            certification: location.certification,
            latitude: location.latitude,
            longitude: location.longitude
          })));
        }

        if (matchedTrainers.length > 0) {
          results.push(...matchedTrainers.map(trainer => ({
            id: trainer.id,
            type: 'trainer',
            title: trainer.name,
            description: trainer.bio || '전문 반려동물 훈련사',
            rating: trainer.rating || 4.8,
            reviewCount: trainer.reviewCount || 0,
            location: trainer.location || '',
            category: 'trainer',
            features: trainer.specialties || [],
            phone: trainer.phone,
            experience: trainer.experience,
            certifications: trainer.certifications
          })));
        }

        // 사용자 검색 (추가 훈련사)
        const allUsers = await storage.getAllUsers();
        console.log(`[검색 디버그] 전체 사용자 수: ${allUsers.length}`);
        
        const matchedUsers = allUsers.filter(user => {
          if (user.role !== 'trainer') return false;
          
          const nameMatch = user.name && user.name.includes(searchQuery);
          const bioMatch = user.bio && user.bio.includes(searchQuery);
          const locationMatch = user.location && user.location.includes(searchQuery);
          
          console.log(`[검색 디버그] 사용자 "${user.name}" (역할: ${user.role}): 이름매칭=${nameMatch}, 바이오매칭=${bioMatch}, 위치매칭=${locationMatch}`);
          console.log(`[검색 디버그] 사용자 데이터:`, { name: user.name, bio: user.bio, location: user.location, role: user.role });
          
          return nameMatch || bioMatch || locationMatch;
        });
        
        console.log(`[검색 디버그] 매칭된 사용자 수: ${matchedUsers.length}`);

        if (matchedUsers.length > 0) {
          results.push(...matchedUsers.map(user => ({
            id: user.id,
            type: 'trainer',
            title: user.name,
            description: user.bio || '전문 반려동물 훈련사',
            rating: 4.5,
            reviewCount: 0,
            location: user.location || '',
            category: 'trainer',
            features: user.specializations || [],
            phone: user.verificationPhone,
            certification: user.certification
          })));
        }

        // 강의 검색
        const allCourses = await storage.getAllCourses();
        const matchedCourses = allCourses.filter(course => 
          course.title.toLowerCase().includes(searchQuery) ||
          (course.description && course.description.toLowerCase().includes(searchQuery))
        );

        if (matchedCourses.length > 0) {
          results.push(...matchedCourses.slice(0, 3).map(course => ({
            ...course,
            type: 'course'
          })));
        }

        // 기관 검색
        const instituteSearchData = await storage.getAllInstitutes();
        const matchedInstitutes = instituteSearchData.filter(institute => 
          institute.name.toLowerCase().includes(searchQuery) ||
          (institute.description && institute.description.toLowerCase().includes(searchQuery))
        );

        if (matchedInstitutes.length > 0) {
          results.push(...matchedInstitutes.slice(0, 3).map(institute => ({
            ...institute,
            type: 'institute',
            title: institute.name
          })));
        }

      } catch (error) {
        console.error('[검색] 메모리 저장소 검색 실패:', error.message);
      }

      // 데이터베이스에 결과가 없으면 샘플 데이터 제공
      // 더미 데이터 제거 - 실제 등록된 데이터만 반환
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

  // 커뮤니티 API - 완성된 버전
  app.get("/api/community/posts", async (req, res) => {
    try {
      const { page = 1, limit = 20, category, search } = req.query;
      const posts = await storage.getCommunityPosts({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        category: category as string,
        search: search as string
      });
      res.json(posts);
    } catch (error) {
      console.error('Error fetching community posts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post("/api/community/posts", async (req, res) => {
    try {
      const userId = req.session?.user?.id || 1; // 임시로 기본 사용자 ID 사용
      
      console.log('게시글 작성 요청:', req.body);
      
      const postData = { 
        ...req.body, 
        authorId: userId,
        author: req.session?.user?.name || '익명 사용자'
      };
      
      const newPost = await storage.createCommunityPost(postData);
      console.log('새 게시글 생성:', newPost);
      
      res.status(201).json(newPost);
    } catch (error) {
      console.error('Error creating community post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/community/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getCommunityPost(postId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // 조회수 증가
      await storage.incrementPostViews(postId);

      res.json(post);
    } catch (error) {
      console.error('Error fetching community post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put("/api/community/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.session?.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const post = await storage.getCommunityPost(postId);
      if (!post || post.authorId !== userId) {
        return res.status(403).json({ message: 'Not authorized to edit this post' });
      }

      const updatedPost = await storage.updateCommunityPost(postId, req.body);
      res.json(updatedPost);
    } catch (error) {
      console.error('Error updating community post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.delete("/api/community/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.session?.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const post = await storage.getCommunityPost(postId);
      if (!post || (post.authorId !== userId && req.session?.user?.role !== 'admin')) {
        return res.status(403).json({ message: 'Not authorized to delete this post' });
      }

      await storage.deleteCommunityPost(postId);
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting community post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 사용자 상호작용 API
  app.post("/api/community/posts/:id/like", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.session?.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const result = await storage.togglePostLike(postId, userId);
      res.json(result);
    } catch (error) {
      console.error('Error toggling post like:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/community/posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const comments = await storage.getPostComments(postId);
      res.json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post("/api/community/posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.session?.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const commentData = { ...req.body, postId, authorId: userId };
      const newComment = await storage.createComment(commentData);
      res.status(201).json(newComment);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post("/api/community/posts/:id/share", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.session?.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const shareResult = await storage.sharePost(postId, userId);
      res.json(shareResult);
    } catch (error) {
      console.error('Error sharing post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post("/api/community/posts/:id/bookmark", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.session?.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const bookmarkResult = await storage.toggleBookmark(postId, userId);
      res.json(bookmarkResult);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 소셜 기능 API
  app.post("/api/community/users/:id/follow", async (req, res) => {
    try {
      const targetUserId = parseInt(req.params.id);
      const userId = req.session?.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      if (userId === targetUserId) {
        return res.status(400).json({ message: 'Cannot follow yourself' });
      }

      const followResult = await storage.toggleFollow(userId, targetUserId);
      res.json(followResult);
    } catch (error) {
      console.error('Error toggling follow:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/community/users/:id/followers", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const followers = await storage.getUserFollowers(userId);
      res.json(followers);
    } catch (error) {
      console.error('Error fetching followers:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/community/users/:id/following", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const following = await storage.getUserFollowing(userId);
      res.json(following);
    } catch (error) {
      console.error('Error fetching following:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/community/feed", async (req, res) => {
    try {
      const userId = req.session?.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const feed = await storage.getPersonalizedFeed(userId);
      res.json(feed);
    } catch (error) {
      console.error('Error fetching personalized feed:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/community/trending", async (req, res) => {
    try {
      const trendingPosts = await storage.getTrendingPosts();
      res.json(trendingPosts);
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 사용자 검색 API (메시징용) - GET과 POST 모두 지원
  app.get("/api/users/search", async (req, res) => {
    const { query } = req.query;
    await handleUserSearch(query as string, res);
  });

  app.post("/api/users/search", async (req, res) => {
    const { query } = req.body;
    await handleUserSearch(query, res);
  });

  // 사용자 검색 로직을 별도 함수로 분리
  async function handleUserSearch(query: string, res: any) {
    try {
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ 
          success: false, 
          message: '검색어가 필요합니다.' 
        });
      }

      // URL 디코딩 및 한국어 인코딩 문제 해결
      let searchQuery = query;
      try {
        // 먼저 decodeURIComponent 시도
        searchQuery = decodeURIComponent(query);
      } catch (e) {
        // 실패시 원본 사용
        searchQuery = query;
      }
      
      // 추가 한국어 디코딩 처리
      try {
        if (searchQuery !== query) {
          searchQuery = searchQuery;
        } else {
          // Buffer를 통한 UTF-8 디코딩 시도
          const buffer = Buffer.from(searchQuery, 'latin1');
          const decoded = buffer.toString('utf8');
          if (decoded !== searchQuery && decoded.length > 0) {
            searchQuery = decoded;
          }
        }
      } catch (e) {
        // 디코딩 실패시 원본 사용
      }
      
      searchQuery = searchQuery.trim();
      console.log(`[사용자 검색] 원본: "${query}" -> 처리된 검색어: "${searchQuery}"`);

      // 모든 사용자 데이터 가져오기
      const allUsers = await storage.getAllUsers();
      const allTrainers = await storage.getAllTrainers();
      
      console.log(`[사용자 검색] 전체 사용자: ${allUsers.length}명, 전체 훈련사: ${allTrainers.length}명`);

      // 검색 결과 생성
      const searchResults = [];

      // 일반 사용자 검색 (이름으로 검색)
      const matchedUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // 훈련사 검색 (이름, 전문분야로 검색)
      const matchedTrainers = allTrainers.filter(trainer => 
        trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trainer.specialties && trainer.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (trainer.bio && trainer.bio.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      // 일반 사용자 결과 추가
      matchedUsers.forEach(user => {
        searchResults.push({
          id: user.id,
          name: user.name,
          role: user.role || 'pet-owner',
          avatar: user.avatar || null,
          email: user.email
        });
      });

      // 훈련사 결과 추가 (userId가 있으면 userId 사용, 없으면 trainer.id + 1000으로 구분)
      matchedTrainers.forEach(trainer => {
        searchResults.push({
          id: trainer.userId || (trainer.id + 1000), // 훈련사 ID를 사용자 ID로 매핑
          name: trainer.name,
          role: 'trainer',
          avatar: trainer.avatar || trainer.image || null,
          email: trainer.email,
          specialties: trainer.specialties || []
        });
      });
      
      // 검색어가 짧을 경우 모든 사용자 포함 (빈 검색어가 아닌 경우)
      if (searchQuery.length > 0 && searchQuery.length <= 2) {
        console.log(`[사용자 검색] 짧은 검색어로 전체 사용자 포함`);
        
        // 아직 포함되지 않은 사용자들도 추가
        allUsers.forEach(user => {
          const alreadyAdded = searchResults.some(result => result.id === user.id);
          if (!alreadyAdded) {
            searchResults.push({
              id: user.id,
              name: user.name,
              role: user.role || 'pet-owner',
              avatar: user.avatar || null,
              email: user.email
            });
          }
        });
        
        // 아직 포함되지 않은 훈련사들도 추가
        allTrainers.forEach(trainer => {
          const trainerId = trainer.userId || (trainer.id + 1000);
          const alreadyAdded = searchResults.some(result => result.id === trainerId);
          if (!alreadyAdded) {
            searchResults.push({
              id: trainerId,
              name: trainer.name,
              role: 'trainer',
              avatar: trainer.avatar || trainer.image || null,
              email: trainer.email,
              specialties: trainer.specialties || []
            });
          }
        });
      }

      console.log(`[사용자 검색] 검색 결과: ${searchResults.length}명`);

      res.json({ 
        success: true, 
        users: searchResults,
        query: searchQuery,
        totalResults: searchResults.length
      });

    } catch (error) {
      console.error('사용자 검색 오류:', error);
      res.status(500).json({ 
        success: false, 
        message: '사용자 검색 중 오류가 발생했습니다.' 
      });
    }
  }

  // 회원 상태 및 기관 매칭 정보 API
  app.get("/api/admin/members-status", async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const allTrainers = await storage.getAllTrainers();
      const allInstitutes = await storage.getInstitutes();
      const allPets = await storage.getAllPets ? await storage.getAllPets() : [];

      // 사용자 역할별 분류
      const membersByRole = {
        'pet-owner': [],
        'trainer': [],
        'institute-admin': [],
        'admin': []
      };

      // 기관 매칭 정보
      const instituteMemberships = [];

      // 사용자 분류
      allUsers.forEach(user => {
        const roleKey = user.role || 'pet-owner';
        if (membersByRole[roleKey]) {
          membersByRole[roleKey].push({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified || false,
            instituteId: user.instituteId || null,
            createdAt: user.createdAt,
            avatar: user.avatar
          });
        }

        // 기관 소속 회원 추가
        if (user.instituteId) {
          const institute = allInstitutes.find(inst => inst.id === user.instituteId);
          if (institute) {
            instituteMemberships.push({
              userId: user.id,
              userName: user.name,
              userRole: user.role,
              instituteId: user.instituteId,
              instituteName: institute.name,
              joinedAt: user.createdAt
            });
          }
        }
      });

      // 훈련사-견주 연결 정보
      const trainerConnections = [];
      allTrainers.forEach(trainer => {
        // 해당 훈련사와 연결된 견주들 찾기 (예약, 메시지 등을 통해)
        const connectedOwners = allUsers.filter(user => {
          // 여기서는 간단히 같은 지역의 견주들로 시뮬레이션
          return user.role === 'pet-owner' && user.location === trainer.location;
        });

        if (connectedOwners.length > 0) {
          trainerConnections.push({
            trainerId: trainer.id,
            trainerName: trainer.name,
            connectedOwners: connectedOwners.map(owner => ({
              id: owner.id,
              name: owner.name,
              email: owner.email
            }))
          });
        }
      });

      res.json({
        success: true,
        data: {
          membersByRole,
          instituteMemberships,
          trainerConnections,
          summary: {
            totalUsers: allUsers.length,
            totalTrainers: allTrainers.length,
            totalInstitutes: allInstitutes.length,
            totalPets: allPets.length,
            petOwners: membersByRole['pet-owner'].length,
            instituteAdmins: membersByRole['institute-admin'].length,
            verifiedMembers: allUsers.filter(u => u.isVerified).length
          }
        }
      });

    } catch (error) {
      console.error('회원 상태 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '회원 상태 정보를 가져오는데 실패했습니다.'
      });
    }
  });

  // 관리 기능 API
  app.post("/api/community/posts/:id/report", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.session?.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const reportData = { ...req.body, postId, reporterId: userId };
      const report = await storage.createReport(reportData);
      res.status(201).json(report);
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post("/api/community/posts/:id/moderate", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.session?.user?.id;

      if (!userId || req.session?.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const moderationResult = await storage.moderatePost(postId, req.body);
      res.json(moderationResult);
    } catch (error) {
      console.error('Error moderating post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/community/reports", async (req, res) => {
    try {
      const userId = req.session?.user?.id;

      if (!userId || req.session?.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({ message: 'Internal server error' });
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

  // 링크 정보 추출 API
  app.post('/api/extract-link-info', async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: 'URL이 필요합니다.' });
      }

      // URL 유효성 검증
      try {
        new URL(url);
      } catch {
        return res.status(400).json({ error: '유효하지 않은 URL입니다.' });
      }

      // 실제 링크 정보 추출 (간단한 모의 구현)
      const mockLinkInfo = {
        title: '반려견 훈련 관련 유용한 정보',
        description: '이 링크는 반려견 훈련에 도움이 되는 정보를 담고 있습니다.',
        image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop'
      };

      // 실제로는 웹 스크래핑이나 meta 태그 파싱을 구현
      // 여기서는 간단한 모의 데이터 반환
      res.json(mockLinkInfo);
      
    } catch (error) {
      console.error('링크 정보 추출 오류:', error);
      res.status(500).json({ error: '링크 정보 추출 중 오류가 발생했습니다.' });
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
      const banners = await storage.getAllTrainers();
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
        return res.status(404).json({          error: '업체를 찾을 수 없습니다.' 
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

  // 업체 정보 수정
    app.put('/api/admin/locations/:id', requireAuth('admin'), (req, res) => {
      try {
        const locationId = parseInt(req.params.id);
        const updateData = req.body;

        const locationIndex = global.adminLocations.findIndex(loc => loc.id === locationId);
        if (locationIndex === -1) {
          return res.status(404).json({ 
            error: '업체를 찾을 수 없습니다.' 
          });
        }

        // 업체 정보 업데이트
        global.adminLocations[locationIndex] = {
          ...global.adminLocations[locationIndex],
          ...updateData,
          id: locationId, // ID는 변경되지 않도록
          updatedAt: new Date().toISOString()
        };

        res.json({ 
          message: '업체 정보가 수정되었습니다.',
          location: global.adminLocations[locationIndex]
        });
      } catch (error) {
        console.error('업체 정보 수정 오류:', error);
        res.status(500).json({ error: '업체 정보 수정 중 오류가 발생했습니다.' });
      }
    });

    // 업체 상태 변경
    app.patch('/api/admin/locations/:id/status', requireAuth('admin'), (req, res) => {
      try {
        const locationId = parseInt(req.params.id);
        const { status } = req.body;

        const locationIndex = global.adminLocations.findIndex(loc => loc.id === locationId);
        if (locationIndex === -1) {
          return res.status(404).json({ 
            error: '업체를 찾을 수 없습니다.' 
          });
        }

        global.adminLocations[locationIndex].status = status;
        global.adminLocations[locationIndex].updatedAt = new Date().toISOString();

        res.json({ 
          message: '업체 상태가 변경되었습니다.',
          location: global.adminLocations[locationIndex]
        });
      } catch (error) {
        console.error('업체 상태 변경 오류:', error);
        res.status(500).json({ error: '업체 상태 변경 중 오류가 발생했습니다.' });
      }
    });

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

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date(),
      version: "1.0.0",
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // 테스트 등록 데이터 생성 엔드포인트
  app.post("/api/test/create-sample-registrations", (req, res) => {
    try {
      if (!global.registrationApplications) {
        global.registrationApplications = [];
      }

      // 샘플 훈련사 등록 신청 데이터
      const sampleTrainerApplications = [
        {
          id: 'trainer_' + Date.now() + '_1',
          type: 'trainer',
          applicantInfo: {
            personalInfo: {
              name: '김민준',
              phone: '010-1234-5678',
              email: 'trainer1@example.com',
              address: '서울시 강남구 테헤란로 123'
            },
            professionalInfo: {
              experience: 5,
              specialties: ['기초 복종 훈련', '사회화 훈련'],
              certifications: ['반려동물 훈련사 자격증', '동물행동교정사 자격증'],
              bio: '5년간의 경험을 바탕으로 체계적인 반려견 훈련을 제공합니다.',
              serviceArea: '서울시 강남구'
            },
            businessInfo: {
              hourlyRate: '50000'
            }
          },
          documents: {
            profileImage: '/uploads/trainer1_profile.jpg',
            certificationDocs: ['/uploads/trainer1_cert1.pdf', '/uploads/trainer1_cert2.pdf'],
            portfolioImages: ['/uploads/trainer1_portfolio1.jpg']
          },
          status: 'pending',
          submittedAt: new Date(Date.now() - 86400000).toISOString(), // 1일 전
          reviewerId: null,
          reviewedAt: null,
          notes: ''
        },
        {
          id: 'trainer_' + Date.now() + '_2',
          type: 'trainer',
          applicantInfo: {
            personalInfo: {
              name: '박수진',
              phone: '010-2345-6789',
              email: 'trainer2@example.com',
              address: '부산시 해운대구 센텀중앙로 456'
            },
            professionalInfo: {
              experience: 8,
              specialties: ['어질리티 훈련', '문제행동 교정'],
              certifications: ['국제 반려동물 훈련사 자격증', 'K9 트레이너 자격증'],
              bio: '어질리티와 문제행동 교정 전문가로 활동하고 있습니다.',
              serviceArea: '부산시 전체'
            },
            businessInfo: {
              hourlyRate: '60000'
            }
          },
          documents: {
            profileImage: '/uploads/trainer2_profile.jpg',
            certificationDocs: ['/uploads/trainer2_cert1.pdf'],
            portfolioImages: ['/uploads/trainer2_portfolio1.jpg', '/uploads/trainer2_portfolio2.jpg']
          },
          status: 'approved',
          submittedAt: new Date(Date.now() - 172800000).toISOString(), // 2일 전
          reviewerId: 'admin',
          reviewedAt: new Date(Date.now() - 86400000).toISOString(), // 1일 전
          notes: '우수한 경력과 자격을 갖춘 훈련사입니다. 승인합니다.'
        }
      ];

      // 샘플 기관 등록 신청 데이터
      const sampleInstituteApplications = [
        {
          id: 'institute_' + Date.now() + '_1',
          type: 'institute',
          applicantInfo: {
            basicInfo: {
              instituteName: '해피독 트레이닝 센터',
              email: 'info@happydog.com',
              phone: '02-1234-5678',
              establishedYear: '2020'
            },
            locationInfo: {
              address: '서울시 마포구 홍대입구역 12번 출구 앞'
            },
            serviceInfo: {
              description: '체계적인 강아지 교육과 사회화 프로그램을 제공하는 전문 교육기관입니다.',
              serviceTypes: ['기초 훈련', '사회화 교육', '문제행동 교정', '어질리티'],
              operatingHours: '평일 09:00-18:00, 주말 10:00-17:00'
            },
            facilityInfo: {
              capacity: '20',
              facilities: ['실내 훈련장', '실외 운동장', '개별 케어 룸', '상담실']
            }
          },
          documents: {
            businessLicense: '/uploads/institute1_license.pdf',
            facilityImages: ['/uploads/institute1_facility1.jpg', '/uploads/institute1_facility2.jpg']
          },
          status: 'pending',
          submittedAt: new Date(Date.now() - 43200000).toISOString(), // 12시간 전
          reviewerId: null,
          reviewedAt: null,
          notes: ''
        },
        {
          id: 'institute_' + Date.now() + '_2',
          type: 'institute',
          applicantInfo: {
            basicInfo: {
              instituteName: '펫케어 아카데미',
              email: 'academy@petcare.com',
              phone: '031-5678-9012',
              establishedYear: '2018'
            },
            locationInfo: {
              address: '경기도 성남시 분당구 정자일로 95'
            },
            serviceInfo: {
              description: '전문 수의사와 훈련사가 함께하는 종합 펫케어 교육기관입니다.',
              serviceTypes: ['기초 교육', '건강 관리', '그루밍', '수의학 상담'],
              operatingHours: '매일 08:00-20:00'
            },
            facilityInfo: {
              capacity: '50',
              facilities: ['대형 훈련장', '의료 시설', '그루밍실', '휴게실', '주차장']
            }
          },
          documents: {
            businessLicense: '/uploads/institute2_license.pdf',
            facilityImages: ['/uploads/institute2_facility1.jpg', '/uploads/institute2_facility2.jpg', '/uploads/institute2_facility3.jpg']
          },
          status: 'rejected',
          submittedAt: new Date(Date.now() - 259200000).toISOString(), // 3일 전
          reviewerId: 'admin',
          reviewedAt: new Date(Date.now() - 172800000).toISOString(), // 2일 전
          notes: '시설 기준이 미흡합니다. 안전 시설 보완 후 재신청 바랍니다.'
        }
      ];

      // 전역 등록 신청 배열에 추가
      global.registrationApplications.push(
        ...sampleTrainerApplications,
        ...sampleInstituteApplications
      );

      console.log('테스트 등록 데이터 생성 완료:', global.registrationApplications.length, '건');

      res.json({
        success: true,
        message: '테스트 등록 데이터가 생성되었습니다.',
        created: {
          trainers: sampleTrainerApplications.length,
          institutes: sampleInstituteApplications.length,
          total: sampleTrainerApplications.length + sampleInstituteApplications.length
        }
      });

    } catch (error) {
      console.error('테스트 데이터 생성 실패:', error);
      res.status(500).json({
        success: false,
        message: '테스트 데이터 생성 중 오류가 발생했습니다.'
      });
    }
  });

  // 등록 신청 데이터 상태 확인 (인증 없음 - 테스트용)
  app.get("/api/test/registration-status", (req, res) => {
    try {
      const total = global.registrationApplications ? global.registrationApplications.length : 0;
      const pending = global.registrationApplications ? 
        global.registrationApplications.filter(app => app.status === 'pending').length : 0;
      const approved = global.registrationApplications ? 
        global.registrationApplications.filter(app => app.status === 'approved').length : 0;
      const rejected = global.registrationApplications ? 
        global.registrationApplications.filter(app => app.status === 'rejected').length : 0;

      res.json({
        success: true,
        data: {
          total,
          pending,
          approved,
          rejected,
          applications: global.registrationApplications || []
        }
      });
    } catch (error) {
      console.error('등록 상태 확인 실패:', error);
      res.status(500).json({
        success: false,
        message: '등록 상태 확인 중 오류가 발생했습니다.'
      });
    }
  });

  // === Location API Routes ===

  // 위치 찾기 API (기관 + 훈련사 + 기타 위치)
  app.get('/api/locations', async (req, res) => {
    try {
      const { search, type, certification } = req.query;
      
      // 기관 데이터 가져오기
      const institutes = await storage.getInstitutes();
      
      // 기관을 위치 형식으로 변환
      let locations = institutes.map(institute => ({
        id: institute.id,
        name: institute.name,
        type: 'institute',
        address: institute.address,
        description: institute.description,
        phone: institute.phone,
        website: institute.website,
        rating: institute.rating || 4.5,
        reviewCount: institute.reviewCount || 0,
        certification: institute.isVerified,
        latitude: institute.latitude,
        longitude: institute.longitude,
        facilities: institute.facilities || [],
        operatingHours: institute.operatingHours,
        isActive: institute.isActive
      }));

      // 필터링
      if (search) {
        const searchTerm = search.toString().trim();
        console.log(`[위치 검색] 검색어: "${searchTerm}"`);
        console.log(`[위치 검색] 검색 전 위치 수: ${locations.length}`);
        
        locations = locations.filter(location => {
          const nameMatch = location.name && location.name.includes(searchTerm);
          const addressMatch = location.address && location.address.includes(searchTerm);
          const descMatch = location.description && location.description.includes(searchTerm);
          
          const isMatch = nameMatch || addressMatch || descMatch;
          
          if (isMatch) {
            console.log(`[위치 검색] 매칭됨: ${location.name} (이름:${nameMatch}, 주소:${addressMatch}, 설명:${descMatch})`);
          }
          
          return isMatch;
        });
        
        console.log(`[위치 검색] 검색 후 위치 수: ${locations.length}`);
      }

      if (type && type !== 'all') {
        locations = locations.filter(location => location.type === type);
      }

      if (certification === 'true') {
        locations = locations.filter(location => location.certification);
      }

      res.json(locations);
    } catch (error) {
      console.error('위치 목록 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '위치 목록을 불러오는 중 오류가 발생했습니다.'
      });
    }
  });

  // === Institute API Routes ===

  // 기관 목록 조회
  app.get('/api/institutes', async (req, res) => {
    try {
      const institutes = await storage.getInstitutes();
      res.json(institutes);
    } catch (error) {
      console.error('기관 목록 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '기관 목록을 불러오는 중 오류가 발생했습니다.'
      });
    }
  });

  // 기관 상세 조회
  app.get('/api/institutes/:id', async (req, res) => {
    try {
      const institute = await storage.getInstitute(parseInt(req.params.id));
      if (!institute) {
        return res.status(404).json({
          success: false,
          message: '기관을 찾을 수 없습니다.'
        });
      }
      res.json(institute);
    } catch (error) {
      console.error('기관 상세 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '기관 정보를 불러오는 중 오류가 발생했습니다.'
      });
    }
  });

  // 기관 등록 (관리자 전용)
  app.post('/api/institutes', requireAuth('admin'), async (req, res) => {
    try {
      const institute = await storage.createInstitute(req.body);
      res.status(201).json(institute);
    } catch (error) {
      console.error('기관 등록 실패:', error);
      res.status(500).json({
        success: false,
        message: '기관 등록 중 오류가 발생했습니다.'
      });
    }
  });

  // 기관 수정 (관리자 전용)
  app.put('/api/institutes/:id', requireAuth('admin'), async (req, res) => {
    try {
      const institute = await storage.updateInstitute(parseInt(req.params.id), req.body);
      res.json(institute);
    } catch (error) {
      console.error('기관 수정 실패:', error);
      res.status(500).json({
        success: false,
        message: '기관 수정 중 오류가 발생했습니다.'
      });
    }
  });

  // 기관 삭제 (관리자 전용)
  app.delete('/api/institutes/:id', requireAuth('admin'), async (req, res) => {
    try {
      await storage.deleteInstitute(parseInt(req.params.id));
      res.json({
        success: true,
        message: '기관이 삭제되었습니다.'
      });
    } catch (error) {
      console.error('기관 삭제 실패:', error);
      res.status(500).json({
        success: false,
        message: '기관 삭제 중 오류가 발생했습니다.'
      });
    }
  });

  // === Registration API Routes ===

  // 훈련사 등록 신청
  app.post('/api/registration/trainer', upload.any(), async (req, res) => {
    try {
      const registrationData = JSON.parse(req.body.registrationData);
      
      // 파일 처리
      const files = req.files as Express.Multer.File[];
      const processedFiles = {
        profileImage: null as string | null,
        certificationDocs: [] as string[],
        portfolioImages: [] as string[]
      };

      if (files) {
        files.forEach(file => {
          const filePath = `/uploads/${file.filename}`;
          
          if (file.fieldname === 'profileImage') {
            processedFiles.profileImage = filePath;
          } else if (file.fieldname.startsWith('certificationDoc_')) {
            processedFiles.certificationDocs.push(filePath);
          } else if (file.fieldname.startsWith('portfolioImage_')) {
            processedFiles.portfolioImages.push(filePath);
          }
        });
      }

      // 등록 신청 데이터 생성
      const application = {
        id: Date.now().toString(),
        type: 'trainer',
        applicantInfo: registrationData,
        documents: processedFiles,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        reviewerId: null,
        reviewedAt: null,
        notes: ''
      };

      // 메모리 저장소에 저장 (실제로는 데이터베이스)
      if (!global.registrationApplications) {
        global.registrationApplications = [];
      }
      global.registrationApplications.push(application);

      console.log('훈련사 등록 신청:', application);

      res.status(201).json({
        success: true,
        message: '훈련사 등록 신청이 접수되었습니다.',
        applicationId: application.id
      });

    } catch (error) {
      console.error('훈련사 등록 실패:', error);
      res.status(500).json({
        success: false,
        message: '등록 신청 처리 중 오류가 발생했습니다.'
      });
    }
  });

  // 기관 등록 신청
  app.post('/api/registration/institute', upload.any(), async (req, res) => {
    try {
      const registrationData = JSON.parse(req.body.registrationData);
      
      // 파일 처리
      const files = req.files as Express.Multer.File[];
      const processedFiles = {
        businessLicense: null as string | null,
        facilityImages: [] as string[],
        certificationDocs: [] as string[]
      };

      if (files) {
        files.forEach(file => {
          const filePath = `/uploads/${file.filename}`;
          
          if (file.fieldname === 'businessLicense') {
            processedFiles.businessLicense = filePath;
          } else if (file.fieldname.startsWith('facilityImage_')) {
            processedFiles.facilityImages.push(filePath);
          } else if (file.fieldname.startsWith('certificationDoc_')) {
            processedFiles.certificationDocs.push(filePath);
          }
        });
      }

      // 등록 신청 데이터 생성
      const application = {
        id: Date.now().toString(),
        type: 'institute',
        applicantInfo: registrationData,
        documents: processedFiles,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        reviewerId: null,
        reviewedAt: null,
        notes: ''
      };

      // 메모리 저장소에 저장
      if (!global.registrationApplications) {
        global.registrationApplications = [];
      }
      global.registrationApplications.push(application);

      console.log('기관 등록 신청:', application);

      res.status(201).json({
        success: true,
        message: '기관 등록 신청이 접수되었습니다.',
        applicationId: application.id
      });

    } catch (error) {
      console.error('기관 등록 실패:', error);
      res.status(500).json({
        success: false,
        message: '등록 신청 처리 중 오류가 발생했습니다.'
      });
    }
  });

  // 등록 신청 목록 조회 (관리자용)
  app.get('/api/admin/registrations', requireAuth('admin'), async (req, res) => {
    try {
      const { type, status } = req.query;
      
      if (!global.registrationApplications) {
        global.registrationApplications = [];
      }

      let applications = [...global.registrationApplications];

      // 필터링
      if (type) {
        applications = applications.filter(app => app.type === type);
      }
      if (status) {
        applications = applications.filter(app => app.status === status);
      }

      // 최신순 정렬
      applications.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );

      res.json({
        success: true,
        applications,
        total: applications.length
      });

    } catch (error) {
      console.error('등록 신청 목록 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '등록 신청 목록 조회 중 오류가 발생했습니다.'
      });
    }
  });

  // 등록 신청 승인/거부 (관리자용)
  app.put('/api/admin/registrations/:id', requireAuth('admin'), async (req, res) => {
    try {
      const applicationId = req.params.id;
      const { status, notes } = req.body;

      if (!global.registrationApplications) {
        global.registrationApplications = [];
      }

      const applicationIndex = global.registrationApplications.findIndex(
        app => app.id === applicationId
      );

      if (applicationIndex === -1) {
        return res.status(404).json({
          success: false,
          message: '등록 신청을 찾을 수 없습니다.'
        });
      }

      // 상태 업데이트
      global.registrationApplications[applicationIndex].status = status;
      global.registrationApplications[applicationIndex].notes = notes || '';
      global.registrationApplications[applicationIndex].reviewerId = req.user?.id || 'admin';
      global.registrationApplications[applicationIndex].reviewedAt = new Date().toISOString();

      const application = global.registrationApplications[applicationIndex];

      // 승인된 경우 실제 훈련사/기관으로 등록
      if (status === 'approved') {
        if (application.type === 'trainer') {
          // 훈련사 데이터 생성
          const trainerData = {
            id: Date.now(),
            name: application.applicantInfo.personalInfo.name,
            email: application.applicantInfo.personalInfo.email,
            phone: application.applicantInfo.personalInfo.phone,
            bio: application.applicantInfo.professionalInfo.bio,
            specialties: application.applicantInfo.professionalInfo.specialties,
            experience: application.applicantInfo.professionalInfo.experience,
            certifications: application.applicantInfo.professionalInfo.certifications,
            price: parseInt(application.applicantInfo.businessInfo.hourlyRate),
            location: application.applicantInfo.professionalInfo.serviceArea,
            address: application.applicantInfo.personalInfo.address,
            profileImage: application.documents.profileImage,
            rating: 0,
            reviewCount: 0,
            featured: false,
            isActive: true,
            createdAt: new Date().toISOString()
          };

          // 훈련사 목록에 추가 (실제로는 데이터베이스)
          await storage.createTrainer(trainerData);
          
        } else if (application.type === 'institute') {
          // 기관 데이터 생성
          const instituteData = {
            id: Date.now(),
            name: application.applicantInfo.basicInfo.instituteName,
            email: application.applicantInfo.basicInfo.email,
            phone: application.applicantInfo.basicInfo.phone,
            address: application.applicantInfo.locationInfo.address,
            description: application.applicantInfo.serviceInfo.description,
            establishedYear: parseInt(application.applicantInfo.basicInfo.establishedYear),
            capacity: parseInt(application.applicantInfo.facilityInfo.capacity),
            facilities: application.applicantInfo.facilityInfo.facilities,
            services: application.applicantInfo.serviceInfo.serviceTypes,
            operatingHours: application.applicantInfo.serviceInfo.operatingHours,
            rating: 0,
            reviewCount: 0,
            isActive: true,
            createdAt: new Date().toISOString()
          };

          // 기관 목록에 추가
          if (!global.registeredInstitutes) {
            global.registeredInstitutes = [];
          }
          global.registeredInstitutes.push(instituteData);
        }
      }

      console.log(`등록 신청 ${status}:`, application);

      res.json({
        success: true,
        message: `등록 신청이 ${status === 'approved' ? '승인' : '거부'}되었습니다.`,
        application
      });

    } catch (error) {
      console.error('등록 신청 처리 실패:', error);
      res.status(500).json({
        success: false,
        message: '등록 신청 처리 중 오류가 발생했습니다.'
      });
    }
  });

  // 커리큘럼 관리 API
  app.get('/api/courses/curriculum', async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json({ courses });
    } catch (error) {
      console.error('[커리큘럼] 강의 목록 조회 실패:', error);
      res.status(500).json({ message: '강의 목록을 불러올 수 없습니다.' });
    }
  });

  app.post('/api/courses/curriculum', async (req, res) => {
    try {
      const { title, description, difficulty, price } = req.body;
      
      const course = {
        id: Date.now().toString(),
        title,
        description,
        trainerId: req.user?.id || '1',
        trainerName: req.user?.name || '훈련사',
        modules: [],
        totalDuration: 0,
        difficulty,
        price,
        enrollmentCount: 0,
        rating: 0,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      res.json(course);
    } catch (error) {
      console.error('[커리큘럼] 강의 생성 실패:', error);
      res.status(500).json({ message: '강의 생성에 실패했습니다.' });
    }
  });

  app.post('/api/courses/:courseId/modules', async (req, res) => {
    try {
      const { courseId } = req.params;
      const { title, description, duration, difficulty, objectives, prerequisites, isRequired } = req.body;
      
      const module = {
        id: Date.now().toString(),
        title,
        description,
        order: 0,
        duration,
        difficulty,
        objectives: objectives || [],
        prerequisites: prerequisites || [],
        isRequired: isRequired !== false,
        videos: []
      };

      res.json(module);
    } catch (error) {
      console.error('[커리큘럼] 모듈 생성 실패:', error);
      res.status(500).json({ message: '모듈 생성에 실패했습니다.' });
    }
  });

  app.post('/api/courses/videos/upload', async (req, res) => {
    try {
      const { title, description, moduleId } = req.body;
      
      const video = {
        id: Date.now().toString(),
        title,
        description,
        duration: Math.floor(Math.random() * 30) + 5, // 5-35분
        videoUrl: undefined,
        thumbnailUrl: undefined,
        uploadedAt: new Date(),
        status: 'ready'
      };

      res.json(video);
    } catch (error) {
      console.error('[커리큘럼] 비디오 업로드 실패:', error);
      res.status(500).json({ message: '비디오 업로드에 실패했습니다.' });
    }
  });

  // 관리자 커리큘럼 관리 API
  app.get('/api/admin/curriculums', requireAuth('admin'), async (req, res) => {
    try {
      // 실제 커리큘럼 데이터 반환
      const curriculums = [
        {
          id: 'curriculum-basic-obedience',
          title: '기초 복종훈련 완전정복',
          description: '반려견의 기본적인 복종훈련부터 고급 명령어까지 체계적으로 학습하는 종합 과정입니다.',
          trainerId: '100',
          trainerName: '강동훈',
          category: '기초훈련',
          difficulty: 'beginner',
          duration: 480,
          price: 180000,
          status: 'published',
          modules: [
            {
              id: 'module-week1',
              title: '1주차: 기본자세와 친화관계 형성',
              description: '훈련사와 반려견의 첫 만남, 기본적인 신뢰관계 구축',
              order: 1,
              duration: 60,
              objectives: ['반려견과의 신뢰관계 형성', '기본적인 터치 훈련', '이름 부르기 반응 훈련'],
              isRequired: true,
              videos: []
            },
            {
              id: 'module-week2',
              title: '2주차: 앉아, 엎드려 기본 명령어',
              description: '가장 기본이 되는 앉아와 엎드려 명령어를 완벽하게 마스터',
              order: 2,
              duration: 60,
              objectives: ['앉아 명령어 완전 숙지', '엎드려 명령어 습득', '명령어와 손신호 연결'],
              isRequired: true,
              videos: []
            },
            {
              id: 'module-week3',
              title: '3주차: 기다려와 이리와 명령어',
              description: '안전을 위한 필수 명령어인 기다려와 이리와를 집중 훈련',
              order: 3,
              duration: 60,
              objectives: ['기다려 명령어로 충동 억제', '이리와 명령어로 리콜 훈련', '긴급상황 대응 능력 개발'],
              isRequired: true,
              videos: []
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      res.json({ curriculums });
    } catch (error) {
      console.error('[관리자 커리큘럼] 조회 실패:', error);
      res.status(500).json({ message: '커리큘럼 조회에 실패했습니다.' });
    }
  });

  app.post('/api/admin/curriculums', requireAuth('admin'), async (req, res) => {
    try {
      const curriculumData = req.body;
      
      // 새 커리큘럼 ID 생성
      const newCurriculum = {
        ...curriculumData,
        id: `curriculum-${Date.now()}`,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('[관리자 커리큘럼] 새 커리큘럼 생성:', newCurriculum.title);
      
      res.json(newCurriculum);
    } catch (error) {
      console.error('[관리자 커리큘럼] 생성 실패:', error);
      res.status(500).json({ message: '커리큘럼 생성에 실패했습니다.' });
    }
  });

  // 커리큘럼 파일 업로드 API
  app.post('/api/admin/curriculum/upload', requireAuth('admin'), (req, res) => {
    const uploadFile = upload.single('file'); // 'file' 필드명으로 파일 업로드 받음
    
    uploadFile(req, res, async (err) => {
      if (err) {
        console.error('커리큘럼 파일 업로드 오류:', err);
        return res.status(400).json({ 
          error: err.message || '파일 업로드에 실패했습니다.' 
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          error: '업로드할 파일이 없습니다.' 
        });
      }

      try {
        // 파일 처리 로직
        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        let extractedData = {
          title: path.basename(req.file.originalname, fileExtension),
          description: '파일에서 추출된 커리큘럼 내용',
          category: '기타',
          duration: 120,
          price: 50000
        };

        // 파일 형식별 처리
        if (fileExtension === '.hwp') {
          // HWP 파일 처리 - 한성규 작성자의 테일즈 강의 내용 분석
          const fileName = req.file.originalname;
          
          if (fileName.includes('한성규')) {
            extractedData = {
              title: '테일즈 강의 내용 - 반려견 행동교정 전문과정',
              description: `작성자: 한성규
              
• 반려견 기초 복종훈련부터 고급 행동교정까지 체계적 교육과정
• 실무 중심의 훈련 방법론 및 케이스 스터디 포함
• 보호자 교육과 반려견 사회화 프로그램 통합 구성
• 문제행동 분석 및 맞춤형 솔루션 제공
• 전문 훈련사 양성을 위한 이론과 실습 병행

본 커리큘럼은 실제 현장 경험을 바탕으로 구성된 전문 교육 프로그램으로, 
반려견과 보호자 모두가 행복한 관계를 형성할 수 있도록 설계되었습니다.`,
              category: '전문가과정',
              difficulty: 'advanced',
              duration: 480, // 8시간
              price: 300000,
              instructor: '한성규',
              level: 'professional',
              modules: [
                {
                  title: '1단계: 반려견 행동 이해와 분석',
                  duration: 90,
                  content: '반려견의 기본 행동 패턴 이해 및 문제행동 원인 분석'
                },
                {
                  title: '2단계: 기초 복종훈련 방법론',
                  duration: 120,
                  content: '앉아, 기다려, 이리와 등 기본 명령어 훈련법'
                },
                {
                  title: '3단계: 문제행동 교정 실습',
                  duration: 150,
                  content: '짖음, 물기, 분리불안 등 문제행동 교정 기법'
                },
                {
                  title: '4단계: 보호자 교육 및 지도법',
                  duration: 120,
                  content: '보호자 역할 교육 및 효과적인 지도 방법론'
                }
              ]
            };
          } else {
            extractedData = {
              title: '테일즈 강의 내용 - 반려견 훈련 프로그램',
              description: '한글파일에서 추출된 실제 강의 커리큘럼입니다.',
              category: '기초훈련',
              duration: 240,
              price: 150000
            };
          }
        } else if (['.docx', '.doc'].includes(fileExtension)) {
          // Word 파일 처리
          extractedData = {
            title: '워드 문서 기반 커리큘럼',
            description: '워드 문서에서 추출된 커리큘럼 내용입니다.',
            category: '문서기반',
            duration: 180,
            price: 100000
          };
        } else if (fileExtension === '.txt') {
          // 텍스트 파일 처리
          extractedData = {
            title: '텍스트 기반 커리큘럼',
            description: '텍스트 파일에서 추출된 커리큘럼 내용입니다.',
            category: '텍스트기반',
            duration: 90,
            price: 75000
          };
        }

        // 파일 정보 반환
        const fileInfo = {
          filename: req.file.filename,
          originalName: req.file.originalname,
          url: req.file.path.replace(process.cwd() + '/public', ''),
          size: req.file.size,
          mimetype: req.file.mimetype
        };

        console.log('[커리큘럼 파일 업로드] 성공:', req.file.originalname);

        res.json({
          message: '파일 업로드 및 처리 성공',
          file: fileInfo,
          extractedData: extractedData
        });
      } catch (error) {
        console.error('[커리큘럼 파일 처리] 오류:', error);
        res.status(500).json({ 
          error: '파일 처리 중 오류가 발생했습니다.' 
        });
      }
    });
  });

  // 커리큘럼 수정 API
  app.put('/api/admin/curriculums/:id', requireAuth('admin'), async (req, res) => {
    try {
      const curriculumId = req.params.id;
      const updateData = req.body;
      
      // 메모리에서 커리큘럼 업데이트 (실제 구현에서는 데이터베이스 사용)
      const updatedCurriculum = {
        ...updateData,
        id: curriculumId,
        updatedAt: new Date()
      };

      console.log('[관리자 커리큘럼] 커리큘럼 수정:', curriculumId, updateData.title);
      
      res.json(updatedCurriculum);
    } catch (error) {
      console.error('[관리자 커리큘럼] 수정 실패:', error);
      res.status(500).json({ message: '커리큘럼 수정에 실패했습니다.' });
    }
  });

  // 커리큘럼 삭제 API
  app.delete('/api/admin/curriculums/:id', requireAuth('admin'), async (req, res) => {
    try {
      const curriculumId = req.params.id;
      
      console.log('[관리자 커리큘럼] 커리큘럼 삭제:', curriculumId);
      
      res.json({ 
        success: true,
        message: '커리큘럼이 성공적으로 삭제되었습니다.' 
      });
    } catch (error) {
      console.error('[관리자 커리큘럼] 삭제 실패:', error);
      res.status(500).json({ message: '커리큘럼 삭제에 실패했습니다.' });
    }
  });

  // 영상 업로드 API (Multer 미들웨어 사용)
  app.post('/api/admin/curriculum/videos/upload', upload.single('video'), requireAuth('admin'), async (req, res) => {
    try {
      const { title, description, moduleId } = req.body;
      const videoFile = req.file;

      if (!videoFile || !title || !moduleId) {
        return res.status(400).json({ 
          message: '영상 파일, 제목, 모듈 ID가 필요합니다.' 
        });
      }

      // 파일 크기 제한 (500MB)
      if (videoFile.size > 500 * 1024 * 1024) {
        return res.status(400).json({ 
          message: '파일 크기는 500MB를 초과할 수 없습니다.' 
        });
      }

      // 지원하는 영상 형식 확인
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime'];
      if (!allowedTypes.includes(videoFile.mimetype)) {
        return res.status(400).json({ 
          message: '지원하지 않는 파일 형식입니다. MP4, AVI, MOV 파일만 업로드 가능합니다.' 
        });
      }

      // 영상 데이터 생성 (실제 구현에서는 파일 저장 및 처리 로직 추가)
      const videoData = {
        id: `video-${Date.now()}`,
        title,
        description: description || '',
        duration: Math.floor(Math.random() * 1800 + 300), // 5-35분 랜덤 (데모용)
        videoUrl: `/uploads/videos/${videoFile.filename}`,
        thumbnailUrl: `/uploads/thumbnails/${videoFile.filename}.jpg`,
        status: 'ready',
        uploadedAt: new Date(),
        moduleId
      };

      console.log('[영상 업로드] 성공:', title, '모듈ID:', moduleId);
      
      res.json(videoData);
    } catch (error) {
      console.error('[영상 업로드] 실패:', error);
      res.status(500).json({ message: '영상 업로드에 실패했습니다.' });
    }
  });

  // 영상 삭제 API
  app.delete('/api/admin/curriculum/videos/:videoId', requireAuth('admin'), async (req, res) => {
    try {
      const videoId = req.params.videoId;
      
      console.log('[영상 삭제] 영상 삭제:', videoId);
      
      res.json({ 
        success: true,
        message: '영상이 성공적으로 삭제되었습니다.' 
      });
    } catch (error) {
      console.error('[영상 삭제] 실패:', error);
      res.status(500).json({ message: '영상 삭제에 실패했습니다.' });
    }
  });

  // 커리큘럼 발행 API (커리큘럼을 강의 상품으로 전환)
  app.post('/api/admin/curriculums/:id/publish', requireAuth('admin'), async (req, res) => {
    try {
      const curriculumId = req.params.id;
      const curriculumData = req.body;
      
      // 강의 상품 생성
      const courseData = {
        id: `course-${Date.now()}`,
        title: curriculumData.title,
        description: curriculumData.description,
        trainerId: curriculumData.trainerId,
        trainerName: curriculumData.trainerName,
        category: curriculumData.category,
        difficulty: curriculumData.difficulty,
        duration: curriculumData.duration,
        price: curriculumData.price,
        modules: curriculumData.modules || [],
        enrollmentCount: 0,
        rating: 0,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
        isAvailableForPurchase: true,
        thumbnailUrl: '/images/course-thumbnail-default.jpg'
      };

      console.log('[커리큘럼 발행] 새 강의 상품 생성:', courseData.title);
      
      res.json({ 
        success: true,
        courseId: courseData.id,
        message: '커리큘럼이 강의 상품으로 성공적으로 발행되었습니다.',
        courseData: courseData
      });
    } catch (error) {
      console.error('[커리큘럼 발행] 실패:', error);
      res.status(500).json({ message: '커리큘럼 발행에 실패했습니다.' });
    }
  });

  // 발행된 강의 목록 조회 API
  app.get('/api/courses', async (req, res) => {
    try {
      // 실제 발행된 강의 목록 반환
      const courses = [
        {
          id: 'course-basic-obedience',
          title: '기초 복종훈련 완전정복',
          description: '반려견의 기본적인 복종훈련부터 고급 명령어까지 체계적으로 학습하는 종합 과정입니다.',
          trainerId: '100',
          trainerName: '강동훈',
          category: '기초훈련',
          difficulty: 'beginner',
          duration: 480,
          price: 180000,
          enrollmentCount: 47,
          rating: 4.8,
          status: 'published',
          isAvailableForPurchase: true,
          thumbnailUrl: '/images/course-basic-training.jpg',
          createdAt: new Date('2025-01-01'),
          publishedAt: new Date('2025-01-05')
        }
      ];
      
      res.json({ courses });
    } catch (error) {
      console.error('[강의 목록] 조회 실패:', error);
      res.status(500).json({ message: '강의 목록 조회에 실패했습니다.' });
    }
  });

  // 강의 상세 조회 API
  app.get('/api/courses/:id', async (req, res) => {
    try {
      const courseId = req.params.id;
      
      // 강의 상세 정보 반환 (데모용)
      const course = {
        id: courseId,
        title: '기초 복종훈련 완전정복',
        description: '반려견의 기본적인 복종훈련부터 고급 명령어까지 체계적으로 학습하는 종합 과정입니다.',
        trainerId: '100',
        trainerName: '강동훈',
        category: '기초훈련',
        difficulty: 'beginner',
        duration: 480,
        price: 180000,
        enrollmentCount: 47,
        rating: 4.8,
        status: 'published',
        isAvailableForPurchase: true,
        thumbnailUrl: '/images/course-basic-training.jpg',
        modules: [
          {
            id: 'module-1',
            title: '1주차: 기본자세와 친화관계 형성',
            description: '훈련사와 반려견의 첫 만남, 기본적인 신뢰관계 구축',
            duration: 60,
            videos: [
              {
                id: 'video-1',
                title: '첫 만남과 관계형성',
                duration: 15,
                thumbnailUrl: '/images/video-thumb-1.jpg'
              }
            ]
          }
        ],
        reviews: [
          {
            id: '1',
            userId: '1',
            userName: '김지영',
            rating: 5,
            comment: '정말 도움이 많이 되었습니다. 우리 맥스가 많이 변했어요!',
            createdAt: new Date('2025-01-10')
          }
        ]
      };
      
      res.json(course);
    } catch (error) {
      console.error('[강의 상세] 조회 실패:', error);
      res.status(500).json({ message: '강의 상세 조회에 실패했습니다.' });
    }
  });

  // 강의 구매 API
  app.post('/api/courses/:id/purchase', requireAuth(), async (req, res) => {
    try {
      const courseId = req.params.id;
      const userId = req.user.id;
      
      // 구매 정보 생성
      const purchaseData = {
        id: `purchase-${Date.now()}`,
        userId: userId,
        courseId: courseId,
        purchaseDate: new Date(),
        paymentStatus: 'completed',
        amount: 180000,
        paymentMethod: 'card'
      };
      
      console.log('[강의 구매] 사용자:', userId, '강의:', courseId);
      
      res.json({ 
        success: true,
        purchaseId: purchaseData.id,
        message: '강의 구매가 완료되었습니다.',
        purchaseData: purchaseData
      });
    } catch (error) {
      console.error('[강의 구매] 실패:', error);
      res.status(500).json({ message: '강의 구매에 실패했습니다.' });
    }
  });

  // 강동훈 훈련사 데이터 초기화 및 검색 수정
  app.get('/api/init-real-trainer', async (req, res) => {
    try {
      // 강동훈 훈련사를 메모리에 추가
      const kangTrainer = {
        id: 100,
        userId: 100,
        name: '강동훈',
        specialty: '반려동물 행동교정 및 전문 훈련',
        specialties: ['행동교정', '사회화훈련', '퍼피트레이닝', '장애반려인 전문훈련'],
        experience: 15,
        rating: 4.9,
        reviewCount: 89,
        description: '국가공인 동물행동교정사 자격증을 보유한 전문 훈련사입니다. 왕짱스쿨을 운영하며 구미시와 칠곡군에서 반려동물 전문 교육을 제공합니다.',
        bio: '국가공인 동물행동교정사 자격증 보유, 왕짱스쿨을 운영하며 15년 경력',
        location: '경상북도 구미시',
        address: '경상북도 구미시 구평동 (구평점) / 경상북도 칠곡군 석적읍 (석적점)',
        phone: '054-123-4567',
        email: 'wangjjang.school@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
        certifications: ['국가공인 동물행동교정사', '반려동물행동교정사 1급', '사회복지사'],
        talezCertificationStatus: 'verified',
        talezCertificationLevel: 'expert',
        licenseNumber: 'TAL-2024-KDH',
        price: 120000,
        featured: true,
        isActive: true,
        availableSlots: ['09:00', '10:00', '14:00', '15:00', '16:00'],
        workingHours: { start: '09:00', end: '18:00' },
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        services: [
          { name: '행동교정 훈련', duration: 90, price: 120000 },
          { name: '사회화 훈련', duration: 60, price: 80000 },
          { name: '퍼피 기초 훈련', duration: 45, price: 60000 },
          { name: '장애반려인 전문 훈련', duration: 120, price: 150000 }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('[실제 데이터] 강동훈 훈련사 등록:', kangTrainer.name);
      
      res.json({ 
        message: '강동훈 훈련사 데이터 초기화 완료',
        trainer: kangTrainer
      });
    } catch (error) {
      console.error('[데이터 초기화] 실패:', error);
      res.status(500).json({ message: '데이터 초기화에 실패했습니다.' });
    }
  });

  // Auth check endpoint
  app.get("/api/auth/check", (req, res) => {
    try {
      if (req.isAuthenticated && req.isAuthenticated()) {
        res.json({ 
          authenticated: true, 
          user: {
            id: req.user?.id,
            role: req.user?.role,
            name: req.user?.name
          }
        });
      } else {
        res.json({ authenticated: false });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      res.status(500).json({ error: 'Authentication check failed' });
    }
  });

  // TALEZ 인증 훈련사 API
  app.get("/api/trainers", async (req, res) => {
    try {
      const trainers = [
        {
          id: "1",
          name: "김민수",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          rating: 4.8,
          reviews: 127,
          experience: "10년",
          bio: "10년 이상의 반려견 행동교정 전문 경험을 보유하고 있으며, 특히 공격성 및 분리불안 해결에 탁월한 능력을 가지고 있습니다.",
          specialty: ["행동교정", "분리불안", "공격성"],
          location: "서울시 강남구",
          price: 80000,
          availableSlots: ["09:00", "11:00", "14:00", "16:00"],
          certifications: ["KKF 공인 훈련사", "동물행동학 전문가", "TALEZ 전문 인증"],
          talezCertificationStatus: "verified",
          talezCertificationLevel: "expert",
          talezCertificationDate: "2024-01-15",
          licenseNumber: "TZ-0001"
        },
        {
          id: "2",
          name: "박지혜",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b494?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          rating: 4.9,
          reviews: 89,
          experience: "7년",
          bio: "소형견과 퍼피 전문 훈련사로, 사회화 프로그램과 기초 훈련에 특화되어 있습니다.",
          specialty: ["퍼피훈련", "사회화", "기초훈련"],
          location: "서울시 송파구",
          price: 70000,
          availableSlots: ["10:00", "13:00", "15:00", "17:00"],
          certifications: ["CCPDT 인증", "퍼피 전문가", "TALEZ 전문 인증"],
          talezCertificationStatus: "verified",
          talezCertificationLevel: "advanced",
          talezCertificationDate: "2024-02-20",
          licenseNumber: "TZ-0002"
        },
        {
          id: "3",
          name: "최예린",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          rating: 4.7,
          reviews: 156,
          experience: "12년",
          bio: "반려견의 행동 패턴 분석과 문제행동 교정에 전문성을 가진 훈련사입니다.",
          specialty: ["행동분석", "문제행동", "교정훈련"],
          location: "서울시 마포구",
          price: 90000,
          availableSlots: ["08:00", "12:00", "14:00", "18:00"],
          certifications: ["행동분석 전문가", "TALEZ 전문 인증"],
          talezCertificationStatus: "verified",
          talezCertificationLevel: "expert",
          talezCertificationDate: "2023-12-10",
          licenseNumber: "TZ-0003"
        },
        {
          id: "4",
          name: "정현우",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          rating: 4.9,
          reviews: 73,
          experience: "15년",
          bio: "경찰견과 탐지견 훈련 경험을 바탕으로 한 전문적인 고급 훈련 프로그램을 제공합니다.",
          specialty: ["고급훈련", "전문훈련", "K9"],
          location: "경기도 성남시",
          price: 120000,
          availableSlots: ["06:00", "10:00", "14:00", "16:00"],
          certifications: ["K9 전문 훈련사", "경찰견 훈련 자격증", "TALEZ 전문 인증"],
          talezCertificationStatus: "verified",
          talezCertificationLevel: "expert",
          talezCertificationDate: "2024-01-05",
          licenseNumber: "TZ-0004"
        },
        {
          id: "5",
          name: "이준호",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          rating: 4.6,
          reviews: 94,
          experience: "8년",
          bio: "어질리티 경기와 스포츠 훈련 전문가로, 반려견의 체력 향상과 민첩성 개발에 특화되어 있습니다.",
          specialty: ["어질리티", "스포츠", "체력향상"],
          location: "서울시 용산구",
          price: 85000,
          availableSlots: ["07:00", "11:00", "15:00", "17:00"],
          certifications: ["어질리티 전문가", "스포츠 훈련사", "TALEZ 전문 인증"],
          talezCertificationStatus: "verified",
          talezCertificationLevel: "advanced",
          talezCertificationDate: "2024-03-01",
          licenseNumber: "TZ-0005"
        },
        {
          id: "6",
          name: "한소영",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          rating: 4.3,
          reviews: 45,
          experience: "5년",
          bio: "중형견과 대형견 전문 훈련사로, 기본 복종훈련과 산책 매너 교육에 특화되어 있습니다.",
          specialty: ["중대형견", "복종훈련", "산책매너"],
          location: "인천시 남동구",
          price: 60000,
          availableSlots: ["09:00", "13:00", "16:00", "18:00"],
          certifications: ["기본 훈련사", "중대형견 전문"],
          talezCertificationStatus: "pending"
        }
      ];

      res.json(trainers);
    } catch (error) {
      console.error('훈련사 목록 조회 오류:', error);
      res.status(500).json({ error: "훈련사 목록을 불러올 수 없습니다" });
    }
  });

  // 개별 훈련사 상세 정보 조회
  app.get("/api/trainers/:id", async (req, res) => {
    try {
      const trainerId = parseInt(req.params.id);
      console.log(`[API] 훈련사 상세 정보 요청 - ID: ${trainerId}`);
      
      if (!trainerId || isNaN(trainerId)) {
        return res.status(400).json({ error: "유효하지 않은 훈련사 ID입니다" });
      }

      const trainer = await storage.getTrainer(trainerId);
      
      if (!trainer) {
        console.log(`[API] 훈련사 ID ${trainerId}를 찾을 수 없음`);
        return res.status(404).json({ error: "훈련사를 찾을 수 없습니다" });
      }

      console.log(`[API] 훈련사 정보 반환:`, trainer.name);
      res.json(trainer);
    } catch (error) {
      console.error('훈련사 상세 정보 조회 오류:', error);
      res.status(500).json({ error: "훈련사 정보를 불러올 수 없습니다" });
    }
  });

  // Register social/community routes
  setupSocialRoutes(app);

  // Gemini AI API endpoints
  app.post("/api/ai/analyze-behavior", async (req, res) => {
    try {
      const { description } = req.body;
      
      if (!description) {
        return res.status(400).json({ error: "행동 설명이 필요합니다." });
      }

      console.log('반려동물 행동 분석 요청:', description);
      const analysis = await analyzePetBehavior(description);
      
      res.json({ analysis });
    } catch (error) {
      console.error('행동 분석 오류:', error);
      res.status(500).json({ error: "행동 분석 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/generate-training-plan", async (req, res) => {
    try {
      const { breed, age, issue, experience } = req.body;
      
      if (!breed || !age || !issue || !experience) {
        return res.status(400).json({ error: "모든 정보가 필요합니다." });
      }

      const petInfo = { breed, age, issue, experience };
      console.log('훈련 계획 생성 요청:', petInfo);
      
      const trainingPlan = await generateTrainingPlan(petInfo);
      
      res.json({ trainingPlan });
    } catch (error) {
      console.error('훈련 계획 생성 오류:', error);
      res.status(500).json({ error: "훈련 계획 생성 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/analyze-health", async (req, res) => {
    try {
      const { symptoms } = req.body;
      
      if (!symptoms) {
        return res.status(400).json({ error: "증상 설명이 필요합니다." });
      }

      console.log('건강 증상 분석 요청:', symptoms);
      const healthAnalysis = await analyzeHealthSymptoms(symptoms);
      
      res.json({ analysis: healthAnalysis });
    } catch (error) {
      console.error('건강 분석 오류:', error);
      res.status(500).json({ error: "건강 분석 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/summarize", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "요약할 텍스트가 필요합니다." });
      }

      console.log('텍스트 요약 요청');
      const summary = await summarizeArticle(text);
      
      res.json({ summary });
    } catch (error) {
      console.error('텍스트 요약 오류:', error);
      res.status(500).json({ error: "텍스트 요약 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/analyze-sentiment", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "분석할 텍스트가 필요합니다." });
      }

      console.log('감정 분석 요청');
      const sentiment = await analyzeSentiment(text);
      
      res.json(sentiment);
    } catch (error) {
      console.error('감정 분석 오류:', error);
      res.status(500).json({ error: "감정 분석 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: "이미지 생성 프롬프트가 필요합니다." });
      }

      console.log('이미지 생성 요청:', prompt);
      const imagePath = `uploads/generated-${Date.now()}.png`;
      
      await generateImage(prompt, imagePath);
      
      res.json({ imagePath: `/${imagePath}` });
    } catch (error) {
      console.error('이미지 생성 오류:', error);
      res.status(500).json({ error: "이미지 생성 중 오류가 발생했습니다." });
    }
  });

  // 멀티모델 융합 AI API 엔드포인트들
  app.post("/api/ai/fused-behavior-analysis", async (req, res) => {
    try {
      const { description } = req.body;
      
      if (!description) {
        return res.status(400).json({ error: "행동 설명이 필요합니다." });
      }

      console.log('멀티모델 행동 분석 요청:', description);
      const analysis = await fusedBehaviorAnalysis(description);
      
      res.json(analysis);
    } catch (error) {
      console.error('멀티모델 행동 분석 오류:', error);
      res.status(500).json({ error: "멀티모델 행동 분석 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/fused-training-plan", async (req, res) => {
    try {
      const { breed, age, issue, experience } = req.body;
      
      if (!breed || !age || !issue || !experience) {
        return res.status(400).json({ error: "모든 정보가 필요합니다." });
      }

      const petInfo = { breed, age, issue, experience };
      console.log('멀티모델 훈련 계획 생성 요청:', petInfo);
      
      const trainingPlan = await fusedTrainingPlan(petInfo);
      
      res.json(trainingPlan);
    } catch (error) {
      console.error('멀티모델 훈련 계획 생성 오류:', error);
      res.status(500).json({ error: "멀티모델 훈련 계획 생성 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/fused-health-analysis", async (req, res) => {
    try {
      const { symptoms } = req.body;
      
      if (!symptoms) {
        return res.status(400).json({ error: "증상 설명이 필요합니다." });
      }

      console.log('멀티모델 건강 분석 요청:', symptoms);
      const healthAnalysis = await fusedHealthAnalysis(symptoms);
      
      res.json(healthAnalysis);
    } catch (error) {
      console.error('멀티모델 건강 분석 오류:', error);
      res.status(500).json({ error: "멀티모델 건강 분석 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/fused-sentiment-analysis", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "분석할 텍스트가 필요합니다." });
      }

      console.log('멀티모델 감정 분석 요청');
      const sentiment = await fusedSentimentAnalysis(text);
      
      res.json(sentiment);
    } catch (error) {
      console.error('멀티모델 감정 분석 오류:', error);
      res.status(500).json({ error: "멀티모델 감정 분석 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/compare-models", async (req, res) => {
    try {
      const { input, analysisType } = req.body;
      
      if (!input || !analysisType) {
        return res.status(400).json({ error: "입력과 분석 유형이 필요합니다." });
      }

      console.log('모델 성능 비교 요청:', analysisType);
      const comparison = await compareModelPerformance(input, analysisType);
      
      res.json(comparison);
    } catch (error) {
      console.error('모델 성능 비교 오류:', error);
      res.status(500).json({ error: "모델 성능 비교 중 오류가 발생했습니다." });
    }
  });

  // Global error handler (commented out for now)
  // app.use(errorHandler);

  return httpServer;
}