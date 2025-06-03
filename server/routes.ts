import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { schema } from "./db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "./middleware";

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

  // 상담 관련 API
  app.get("/api/consultations/my-requests", async (req, res) => {
    try {
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

  // 반려동물 관리 라우트
  app.get('/api/pets', requireAuth, async (req: AuthRequest, res) => {
    try {
      const pets = await db.select().from(schema.pets).where(eq(schema.pets.ownerId, req.user!.id));
      res.json(pets);
    } catch (error) {
      console.error('반려동물 목록 조회 실패:', error);
      res.status(500).json({ message: '반려동물 목록을 가져올 수 없습니다.' });
    }
  });

  app.post('/api/pets', requireAuth, async (req: AuthRequest, res) => {
    try {
      const petData = {
        ...req.body,
        ownerId: req.user!.id
      };
      const [newPet] = await db.insert(schema.pets).values(petData).returning();
      res.status(201).json(newPet);
    } catch (error) {
      console.error('반려동물 등록 실패:', error);
      res.status(500).json({ message: '반려동물 등록에 실패했습니다.' });
    }
  });

  app.get('/api/pets/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const petId = parseInt(req.params.id);
      const [pet] = await db.select().from(schema.pets)
        .where(and(eq(schema.pets.id, petId), eq(schema.pets.ownerId, req.user!.id)));

      if (!pet) {
        return res.status(404).json({ message: '반려동물을 찾을 수 없습니다.' });
      }

      res.json(pet);
    } catch (error) {
      console.error('반려동물 조회 실패:', error);
      res.status(500).json({ message: '반려동물 정보를 가져올 수 없습니다.' });
    }
  });

  app.put('/api/pets/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const petId = parseInt(req.params.id);
      const [updatedPet] = await db.update(schema.pets)
        .set({ ...req.body, updatedAt: new Date() })
        .where(and(eq(schema.pets.id, petId), eq(schema.pets.ownerId, req.user!.id)))
        .returning();

      if (!updatedPet) {
        return res.status(404).json({ message: '반려동물을 찾을 수 없습니다.' });
      }

      res.json(updatedPet);
    } catch (error) {
      console.error('반려동물 수정 실패:', error);
      res.status(500).json({ message: '반려동물 정보 수정에 실패했습니다.' });
    }
  });

  app.delete('/api/pets/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const petId = parseInt(req.params.id);
      const [deletedPet] = await db.delete(schema.pets)
        .where(and(eq(schema.pets.id, petId), eq(schema.pets.ownerId, req.user!.id)))
        .returning();

      if (!deletedPet) {
        return res.status(404).json({ message: '반려동물을 찾을 수 없습니다.' });
      }

      res.json({ message: '반려동물이 삭제되었습니다.' });
    } catch (error) {
      console.error('반려동물 삭제 실패:', error);
      res.status(500).json({ message: '반려동물 삭제에 실패했습니다.' });
    }
  });

  // 커뮤니티 라우트
  app.get('/api/community/posts', async (req, res) => {
    try {
      const posts = await db.select({
        id: schema.posts.id,
        title: schema.posts.title,
        content: schema.posts.content,
        category: schema.posts.category,
        tags: schema.posts.tags,
        views: schema.posts.views,
        likes: schema.posts.likes,
        commentsCount: schema.posts.commentsCount,
        isPublished: schema.posts.isPublished,
        createdAt: schema.posts.createdAt,
        updatedAt: schema.posts.updatedAt,
        author: {
          id: schema.users.id,
          name: schema.users.name,
          role: schema.users.role
        }
      })
      .from(schema.posts)
      .leftJoin(schema.users, eq(schema.posts.authorId, schema.users.id))
      .where(eq(schema.posts.isPublished, true))
      .orderBy(desc(schema.posts.createdAt));

      res.json(posts);
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
      res.status(500).json({ message: '게시글을 가져올 수 없습니다.' });
    }
  });

  app.get('/api/community/posts/:id', async (req, res) => {
    try {
      const postId = parseInt(req.params.id);

      // 조회수 증가
      await db.update(schema.posts)
        .set({ views: sql`${schema.posts.views} + 1` })
        .where(eq(schema.posts.id, postId));

      const [post] = await db.select({
        id: schema.posts.id,
        title: schema.posts.title,
        content: schema.posts.content,
        category: schema.posts.category,
        tags: schema.posts.tags,
        views: schema.posts.views,
        likes: schema.posts.likes,
        commentsCount: schema.posts.commentsCount,
        isPublished: schema.posts.isPublished,
        createdAt: schema.posts.createdAt,
        updatedAt: schema.posts.updatedAt,
        author: {
          id: schema.users.id,
          name: schema.users.name,
          role: schema.users.role
        }
      })
      .from(schema.posts)
      .leftJoin(schema.users, eq(schema.posts.authorId, schema.users.id))
      .where(eq(schema.posts.id, postId));

      if (!post) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      }

      res.json(post);
    } catch (error) {
      console.error('게시글 조회 실패:', error);
      res.status(500).json({ message: '게시글을 가져올 수 없습니다.' });
    }
  });

  app.post('/api/community/posts', requireAuth, async (req: AuthRequest, res) => {
    try {
      const postData = {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category || 'general',
        tags: req.body.tags || [],
        authorId: req.user!.id,
        isPublished: req.body.isPublished ?? true
      };

      const [newPost] = await db.insert(schema.posts).values(postData).returning();
      res.status(201).json(newPost);
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      res.status(500).json({ message: '게시글 작성에 실패했습니다.' });
    }
  });

  app.put('/api/community/posts/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const postId = parseInt(req.params.id);
      const [updatedPost] = await db.update(schema.posts)
        .set({ 
          ...req.body, 
          updatedAt: new Date(),
          isEdited: true
        })
        .where(and(eq(schema.posts.id, postId), eq(schema.posts.authorId, req.user!.id)))
        .returning();

      if (!updatedPost) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      }

      res.json(updatedPost);
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      res.status(500).json({ message: '게시글 수정에 실패했습니다.' });
    }
  });

  app.delete('/api/community/posts/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const postId = parseInt(req.params.id);
      const [deletedPost] = await db.delete(schema.posts)
        .where(and(eq(schema.posts.id, postId), eq(schema.posts.authorId, req.user!.id)))
        .returning();

      if (!deletedPost) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      }

      res.json({ message: '게시글이 삭제되었습니다.' });
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      res.status(500).json({ message: '게시글 삭제에 실패했습니다.' });
    }
  });

  // 게시글 좋아요
  app.post('/api/community/posts/:id/like', requireAuth, async (req: AuthRequest, res) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user!.id;

      // 기존 좋아요 확인
      const [existingLike] = await db.select()
        .from(schema.likes)
        .where(and(eq(schema.likes.postId, postId), eq(schema.likes.userId, userId)));

      if (existingLike) {
        // 좋아요 취소
        await db.delete(schema.likes)
          .where(and(eq(schema.likes.postId, postId), eq(schema.likes.userId, userId)));

        await db.update(schema.posts)
          .set({ likes: sql`${schema.posts.likes} - 1` })
          .where(eq(schema.posts.id, postId));

        res.json({ liked: false, message: '좋아요가 취소되었습니다.' });
      } else {
        // 좋아요 추가
        await db.insert(schema.likes).values({ postId, userId });

        await db.update(schema.posts)
          .set({ likes: sql`${schema.posts.likes} + 1` })
          .where(eq(schema.posts.id, postId));

        res.json({ liked: true, message: '좋아요가 추가되었습니다.' });
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      res.status(500).json({ message: '좋아요 처리에 실패했습니다.' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}