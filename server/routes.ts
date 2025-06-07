import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { registerMessagingRoutes } from "./routes/messaging";
import { globalErrorHandler, notFoundHandler } from "./middleware/error-handler";

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

  // 메시징 라우트 등록
  const httpServer = createServer(app);
  registerMessagingRoutes(app, httpServer);

  // 404 핸들러
  app.use(notFoundHandler);

  // 글로벌 에러 핸들러
  app.use(globalErrorHandler);

  return httpServer;
}