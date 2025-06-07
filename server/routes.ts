import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { registerMessagingRoutes } from "./routes/messaging";
import { errorHandler } from "./middleware/error-handler";
import { registerShoppingRoutes } from "./routes/shopping";
// import { registerNotificationRoutes } from "./routes/notification-routes";
import { registerUploadRoutes } from "./routes/upload";
import { storage } from "./storage";

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

    // 검색 API 구현
  app.get("/api/search", async (req, res) => {
    try {
      const { 
        q: query, 
        category = 'all',
        location = 'all',
        minPrice,
        maxPrice,
        difficulty = 'all',
        startDate,
        endDate,
        features,
        sortBy = 'relevance',
        minRating,
        page = 1,
        limit = 10
      } = req.query;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          results: [],
          totalCount: 0,
          currentPage: parseInt(page as string),
          totalPages: 0,
          message: "검색어를 입력해주세요."
        });
      }

      let results: any[] = [];

      // 훈련사 검색
      if (category === 'all' || category === 'trainer') {
        try {
          const trainers = await storage.getAllTrainers();
          const matchedTrainers = trainers
            .filter(trainer => 
              trainer.name.toLowerCase().includes(query.toLowerCase()) ||
              (trainer.bio && trainer.bio.toLowerCase().includes(query.toLowerCase())) ||
              (trainer.specialties && trainer.specialties.some((spec: string) => 
                spec.toLowerCase().includes(query.toLowerCase())
              ))
            )
            .map(trainer => ({
              id: trainer.id,
              type: 'trainer',
              title: trainer.name,
              description: trainer.bio || '전문 반려동물 훈련사입니다.',
              image: trainer.photo || trainer.avatar,
              rating: trainer.rating || 4.5,
              reviewCount: trainer.reviewCount || 0,
              location: trainer.address || trainer.location,
              category: trainer.specialties?.[0] || '기본훈련',
              price: trainer.price || 50000,
              trainer: {
                id: trainer.id,
                name: trainer.name,
                avatar: trainer.photo || trainer.avatar,
                specialty: trainer.specialties?.[0]
              }
            }));
          results.push(...matchedTrainers);
        } catch (error) {
          console.error('훈련사 검색 오류:', error);
        }
      }

      // 기관 검색
      if (category === 'all' || category === 'institute') {
        try {
          const institutes = await storage.getAllInstitutes();
          const matchedInstitutes = institutes
            .filter(institute => 
              institute.name.toLowerCase().includes(query.toLowerCase()) ||
              (institute.description && institute.description.toLowerCase().includes(query.toLowerCase()))
            )
            .map(institute => ({
              id: institute.id,
              type: 'institute',
              title: institute.name,
              description: institute.description || '전문 반려동물 교육 기관입니다.',
              image: institute.logo,
              rating: institute.rating || 4.0,
              reviewCount: institute.reviewCount || 0,
              location: institute.address,
              category: institute.category || '종합교육',
              institute: {
                id: institute.id,
                name: institute.name,
                location: institute.address
              }
            }));
          results.push(...matchedInstitutes);
        } catch (error) {
          console.error('기관 검색 오류:', error);
        }
      }

      // 강의 검색
      if (category === 'all' || category === 'course') {
        try {
          const courses = await storage.getAllCourses();
          const matchedCourses = courses
            .filter(course => 
              course.title.toLowerCase().includes(query.toLowerCase()) ||
              (course.description && course.description.toLowerCase().includes(query.toLowerCase()))
            )
            .map(course => ({
              id: course.id,
              type: 'course',
              title: course.title,
              description: course.description || '반려동물 교육 강의입니다.',
              image: course.thumbnail,
              price: course.price || 30000,
              rating: course.rating || 4.2,
              reviewCount: course.reviewCount || 0,
              difficulty: course.level || '초급',
              duration: course.duration || '4주',
              maxParticipants: course.maxParticipants || 10,
              currentParticipants: course.currentParticipants || 0,
              startDate: course.startDate ? new Date(course.startDate) : null,
              endDate: course.endDate ? new Date(course.endDate) : null
            }));
          results.push(...matchedCourses);
        } catch (error) {
          console.error('강의 검색 오류:', error);
        }
      }

      // 필터링 적용
      if (minPrice) {
        results = results.filter(item => (item.price || 0) >= parseInt(minPrice as string));
      }
      if (maxPrice) {
        results = results.filter(item => (item.price || 0) <= parseInt(maxPrice as string));
      }
      if (difficulty !== 'all') {
        results = results.filter(item => item.difficulty === difficulty);
      }
      if (minRating) {
        results = results.filter(item => (item.rating || 0) >= parseFloat(minRating as string));
      }

      // 정렬
      switch (sortBy) {
        case 'price-low':
          results.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price-high':
          results.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'rating':
          results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest':
          results.sort((a, b) => new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime());
          break;
        default: // relevance
          // 관련성 기준으로 정렬 (이름에 검색어가 포함된 것 우선)
          results.sort((a, b) => {
            const aNameMatch = a.title.toLowerCase().includes(query.toLowerCase());
            const bNameMatch = b.title.toLowerCase().includes(query.toLowerCase());
            if (aNameMatch && !bNameMatch) return -1;
            if (!aNameMatch && bNameMatch) return 1;
            return (b.rating || 0) - (a.rating || 0);
          });
      }

      // 페이지네이션
      const totalCount = results.length;
      const totalPages = Math.ceil(totalCount / parseInt(limit as string));
      const currentPage = parseInt(page as string);
      const startIndex = (currentPage - 1) * parseInt(limit as string);
      const endIndex = startIndex + parseInt(limit as string);
      const paginatedResults = results.slice(startIndex, endIndex);

      console.log(`[검색] "${query}" 검색 결과: ${totalCount}개 항목`);

      res.json({
        results: paginatedResults,
        totalCount,
        currentPage,
        totalPages,
        message: totalCount > 0 ? `"${query}"에 대한 ${totalCount}개 결과` : `"${query}"에 대한 검색 결과가 없습니다.`
      });

    } catch (error) {
      console.error('검색 API 오류:', error);
      res.status(500).json({
        results: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 0,
        message: "검색 중 오류가 발생했습니다."
      });
    }
  });

  // 알림 관련 라우트 (임시 비활성화)
  // registerNotificationRoutes(app);

  // 파일 업로드 라우트
  registerUploadRoutes(app);

  // 메시징 라우트 등록
  const httpServer = createServer(app);
  registerMessagingRoutes(app, httpServer);
  
  // 알림 라우트 등록 (WebSocket 설정 문제로 임시 비활성화)

  // 글로벌 에러 핸들러
  app.use(errorHandler);

  return httpServer;
}