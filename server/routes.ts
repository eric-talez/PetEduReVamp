import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { createUserSchema, createPetSchema, createCourseSchema } from "@shared/schema";
import { registerCommissionRoutes } from "./commission/routes";
import { registerTrainerRoutes } from "./trainers/routes";
import { registerCourseRoutes } from "./courses/routes";
import { registerInstituteRoutes } from "./institutes/routes";
import { registerLocationRoutes } from "./location/routes";
import { registerVideoCallRoutes } from "./videocall/routes";
import { registerMenuRoutes } from "./menu/routes";
import { registerAiRoutes } from "./ai/routes";
import { registerAnalyticsRoutes } from "./routes/analytics";
import { registerEducationRoutes } from "./routes/education";
import { javaBridge } from "./java-bridge";
import { registerShoppingRoutes } from "./routes/shopping";
import { userController } from "./java-style/UserController";
import { petController } from "./java-style/PetController";
import { courseController } from "./java-style/CourseController";
import { applicationConfig } from "./java-style/ApplicationConfig";
import { Event, EventLocation } from "@shared/schema";
import { WebSocketServer } from 'ws';
import { MessagingService } from './messaging/service';
import { NotificationService } from './notifications/service';
import { registerNotificationRoutes } from './notifications/routes';
import { requestPasswordReset, verifyResetToken, resetPassword } from './recovery';
import socialRouter from './routes/social';
import analyticsRouter from './routes/analytics';

// 타입은 server/types.d.ts에 정의되어 있습니다.

// 본인인증 관련 로직 임포트
import { verifyIdentity } from './auth/verify';

export async function registerRoutes(app: Express): Promise<Server> {
  // 본인인증 API 엔드포인트
  app.post('/api/auth/verify-identity', verifyIdentity);
  
  // 비밀번호 재설정 API 엔드포인트
  app.post('/api/reset-password', requestPasswordReset);
  app.get('/api/reset-password/:token', verifyResetToken);
  app.post('/api/reset-password/confirm', resetPassword);
  // Register all modular routes
  registerCommissionRoutes(app);
  registerTrainerRoutes(app);
  registerCourseRoutes(app);
  registerInstituteRoutes(app);
  registerLocationRoutes(app);
  registerVideoCallRoutes(app);
  registerMenuRoutes(app);
  registerAiRoutes(app);
  
  // 테스트용 게시글 저장소 (메모리) - 샘플 데이터 포함
  const testPosts: any[] = [
    {
      id: Date.now() - 3600000,
      title: "반려견 기본 훈련 팁",
      content: "반려견과 함께하는 기본적인 훈련 방법들을 공유합니다. 앉기, 기다리기, 손 등의 기본 명령어를 가르치는 효과적인 방법을 알아보세요.",
      tag: "훈련팁",
      authorId: 3,
      image: null,
      likes: 5,
      comments: 2,
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3600000),
      author: {
        id: 3,
        username: 'testuser3',
        name: '반려인'
      }
    }
  ];

  // 댓글 저장소 (메모리)
  const testComments: any[] = [
    {
      id: 1,
      postId: Date.now() - 3600000,
      content: "정말 유용한 정보네요! 우리 강아지도 이 방법으로 훈련해봐야겠어요.",
      authorId: 1,
      author: { id: 1, username: 'testuser', name: '테스트 사용자' },
      createdAt: new Date(Date.now() - 1800000),
      updatedAt: new Date(Date.now() - 1800000)
    },
    {
      id: 2,
      postId: Date.now() - 3600000,
      content: "기본 명령어 훈련은 정말 중요하죠. 저희 집 골든리트리버도 이렇게 훈련했어요!",
      authorId: 3,
      author: { id: 3, username: 'testuser3', name: '반려인' },
      createdAt: new Date(Date.now() - 900000),
      updatedAt: new Date(Date.now() - 900000)
    }
  ];

  // API 라우팅 우선순위 보장을 위한 명시적 설정
  app.use('/api/community', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  // 테스트용 게시글 작성 API (인증 없음)
  app.post('/api/community/posts', async (req, res) => {
    // 명시적으로 JSON 응답 설정
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    
    console.log('=== 테스트 게시글 작성 API 호출됨 ===');
    console.log('요청 데이터:', req.body);
    
    try {
      const { title, content, tag } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ 
          message: '제목과 내용을 입력해주세요.',
          received: { title, content, tag }
        });
      }
      
      // 현재 로그인한 사용자 정보 가져오기
      const currentUser = req.user || { id: 3, username: 'testuser3', name: '반려인' };
      
      const responseData = {
        post: {
          id: Date.now(),
          title,
          content,
          tag: tag || '일반',
          authorId: currentUser.id,
          image: null,
          likes: 0,
          comments: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        author: {
          id: currentUser.id,
          username: currentUser.username,
          name: currentUser.name
        }
      };
      
      console.log('응답 데이터:', responseData);
      
      // 메모리에 게시글 저장 (작성자 정보 포함)
      const postWithAuthor = {
        ...responseData.post,
        author: responseData.author
      };
      testPosts.unshift(postWithAuthor);
      
      // Express 응답 파이프라인 우회하여 직접 응답
      res.writeHead(201, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      res.end(JSON.stringify(responseData));
      return;
    } catch (error: any) {
      console.error('게시글 작성 오류:', error);
      res.status(500).json({ 
        message: '게시글 작성 중 오류가 발생했습니다.',
        error: error.message 
      });
    }
  });

  // 테스트용 게시글 목록 API (인증 없음)
  app.get('/api/community/posts', async (req, res) => {
    // 명시적으로 JSON 응답 설정
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    
    console.log('=== 테스트 게시글 목록 API 호출됨 ===');
    console.log('저장된 게시글 수:', testPosts.length);
    
    try {
      // 게시글 목록을 작성자 정보와 함께 반환
      const postsWithAuthor = testPosts.map(post => ({
        ...post,
        author: {
          id: 1,
          username: 'testuser',
          name: '테스트 사용자'
        }
      }));
      
      const responseData = {
        posts: postsWithAuthor,
        pagination: {
          total: testPosts.length.toString(),
          page: "1",
          limit: "20"
        }
      };
      
      console.log('응답 데이터:', responseData);
      
      // Express 응답 파이프라인 우회하여 직접 응답
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      res.end(JSON.stringify(responseData));
      return;
    } catch (error: any) {
      console.error('게시글 목록 조회 오류:', error);
      res.status(500).json({ 
        message: '게시글 목록 조회 중 오류가 발생했습니다.',
        error: error.message 
      });
    }
  });

  // 게시글 상세 조회 API
  app.get('/api/community/posts/:id', async (req, res) => {
    try {
      console.log('=== 테스트 게시글 상세 조회 API 호출됨 ===');
      const postId = parseInt(req.params.id);
      console.log('요청된 게시글 ID:', postId);
      console.log('저장된 게시글 ID들:', testPosts.map(p => p.id));
      
      // 메모리에서 게시글 찾기 (숫자와 문자열 모두 고려)
      const post = testPosts.find(p => p.id == postId || p.id === req.params.id);
      
      if (!post) {
        console.log('게시글을 찾을 수 없음 - 새 게시글 생성');
        // 404 대신 기본 게시글 반환
        const defaultPost = {
          id: postId,
          title: '새로운 게시글',
          content: '게시글을 불러오는 중입니다...',
          tag: '일반',
          authorId: 1,
          author: { id: 1, username: 'system', name: '시스템' },
          image: null,
          likes: 0,
          comments: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const responseData = {
          post: defaultPost,
          author: defaultPost.author,
          comments: []
        };
        
        console.log('기본 게시글 응답 데이터:', responseData);
        res.status(200).json(responseData);
        return;
      }
      
      // 해당 게시글의 댓글 조회
      const postComments = testComments.filter(comment => comment.postId === postId);
      
      const responseData = {
        post: {
          ...post,
          author: post.author || { id: 1, username: 'testuser', name: '테스트 사용자' }
        },
        author: post.author || { id: 1, username: 'testuser', name: '테스트 사용자' },
        comments: postComments
      };
      
      console.log('게시글 상세 응답 데이터:', responseData);
      
      // Express 응답 파이프라인 우회하여 직접 응답
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      res.end(JSON.stringify(responseData));
      return;
    } catch (error: any) {
      console.error('게시글 상세 조회 오류:', error);
      res.status(500).json({ 
        message: '게시글 조회 중 오류가 발생했습니다.',
        error: error.message 
      });
    }
  });

  // 게시글 수정 API
  app.put('/api/community/posts/:id', async (req, res) => {
    try {
      console.log('=== 테스트 게시글 수정 API 호출됨 ===');
      const postId = parseInt(req.params.id);
      const { title, content, tag } = req.body;
      
      // 메모리에서 게시글 찾기
      const postIndex = testPosts.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        res.writeHead(404, {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        });
        res.end(JSON.stringify({ 
          message: '게시글을 찾을 수 없습니다.' 
        }));
        return;
      }
      
      // 게시글 수정
      testPosts[postIndex] = {
        ...testPosts[postIndex],
        title,
        content,
        tag,
        updatedAt: new Date()
      };
      
      const responseData = {
        post: testPosts[postIndex],
        message: '게시글이 성공적으로 수정되었습니다.'
      };
      
      console.log('게시글 수정 완료:', responseData);
      
      // Express 응답 파이프라인 우회하여 직접 응답
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      res.end(JSON.stringify(responseData));
      return;
    } catch (error: any) {
      console.error('게시글 수정 오류:', error);
      res.status(500).json({ 
        message: '게시글 수정 중 오류가 발생했습니다.',
        error: error.message 
      });
    }
  });

  // 게시글 삭제 API
  app.delete('/api/community/posts/:id', async (req, res) => {
    try {
      console.log('=== 테스트 게시글 삭제 API 호출됨 ===');
      const postId = parseInt(req.params.id);
      
      // 메모리에서 게시글 찾기
      const postIndex = testPosts.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        res.writeHead(404, {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        });
        res.end(JSON.stringify({ 
          message: '게시글을 찾을 수 없습니다.' 
        }));
        return;
      }
      
      // 게시글 삭제
      testPosts.splice(postIndex, 1);
      
      const responseData = {
        message: '게시글이 성공적으로 삭제되었습니다.'
      };
      
      console.log('게시글 삭제 완료:', responseData);
      
      // Express 응답 파이프라인 우회하여 직접 응답
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      res.end(JSON.stringify(responseData));
      return;
    } catch (error: any) {
      console.error('게시글 삭제 오류:', error);
      res.status(500).json({ 
        message: '게시글 삭제 중 오류가 발생했습니다.',
        error: error.message 
      });
    }
  });

  // 댓글 작성 API
  app.post('/api/community/posts/:id/comments', async (req, res) => {
    try {
      console.log('=== 댓글 작성 API 호출됨 ===');
      const postId = parseInt(req.params.id);
      const { content } = req.body;
      
      if (!content) {
        res.writeHead(400, {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        });
        res.end(JSON.stringify({ 
          message: '댓글 내용을 입력해주세요.' 
        }));
        return;
      }
      
      // 현재 로그인한 사용자 정보
      const currentUser = req.user || { id: 3, username: 'testuser3', name: '반려인' };
      
      const newComment = {
        id: Date.now(),
        postId,
        content,
        authorId: currentUser.id,
        author: {
          id: currentUser.id,
          username: currentUser.username,
          name: currentUser.name
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // 메모리에 댓글 저장
      testComments.push(newComment);
      
      // 게시글의 댓글 수 업데이트
      const postIndex = testPosts.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        testPosts[postIndex].comments = testComments.filter(c => c.postId === postId).length;
      }
      
      const responseData = {
        comment: newComment,
        message: '댓글이 성공적으로 작성되었습니다.'
      };
      
      console.log('댓글 작성 완료:', responseData);
      
      res.writeHead(201, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      res.end(JSON.stringify(responseData));
      return;
    } catch (error: any) {
      console.error('댓글 작성 오류:', error);
      res.status(500).json({ 
        message: '댓글 작성 중 오류가 발생했습니다.',
        error: error.message 
      });
    }
  });

  // 좋아요 토글 API
  app.post('/api/community/posts/:id/like', async (req, res) => {
    try {
      console.log('=== 좋아요 토글 API 호출됨 ===');
      const postId = parseInt(req.params.id);
      
      // 메모리에서 게시글 찾기
      const postIndex = testPosts.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        res.writeHead(404, {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        });
        res.end(JSON.stringify({ 
          message: '게시글을 찾을 수 없습니다.' 
        }));
        return;
      }
      
      // 좋아요 수 증가 (간단한 구현)
      testPosts[postIndex].likes = testPosts[postIndex].likes + 1;
      
      const responseData = {
        likes: testPosts[postIndex].likes,
        message: '좋아요가 추가되었습니다.'
      };
      
      console.log('좋아요 토글 완료:', responseData);
      
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      res.end(JSON.stringify(responseData));
      return;
    } catch (error: any) {
      console.error('좋아요 토글 오류:', error);
      res.status(500).json({ 
        message: '좋아요 처리 중 오류가 발생했습니다.',
        error: error.message 
      });
    }
  });

  // 소셜 기능 라우터 등록
  app.use('/api/social', socialRouter);
  
  // 분석 및 보고서 기능 라우터 등록
  app.use('/api/analytics', analyticsRouter);
  
  // 이벤트 API 엔드포인트
  // 샘플 이벤트 데이터
  const sampleEvents: Event[] = [
    {
      id: 1,
      title: "강아지 사회화 모임",
      description: "다양한 강아지들과 함께하는 사회화 모임입니다. 반려견의 사회성 향상을 위한 최고의 기회!",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      date: "2025-05-15",
      time: "14:00 - 16:00",
      locationId: 1,
      organizerId: 1,
      category: "소셜",
      price: "무료",
      attendees: 15,
      maxAttendees: 20,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: "반려견 건강 세미나",
      description: "반려견의 건강을 위한 영양과 운동에 대한 전문가 세미나입니다.",
      image: "https://images.unsplash.com/photo-1597633425046-08f5110420b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      date: "2025-05-20",
      time: "19:00 - 21:00",
      locationId: 2,
      organizerId: 2,
      category: "교육",
      price: 15000,
      attendees: 28,
      maxAttendees: 40,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      title: "반려동물 페스티벌",
      description: "다양한 반려동물 용품과 먹거리, 체험 부스가 준비된 대규모 페스티벌입니다.",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      date: "2025-06-05",
      time: "10:00 - 18:00",
      locationId: 3,
      organizerId: 3,
      category: "축제",
      price: 20000,
      attendees: 120,
      maxAttendees: 150,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      title: "강아지 훈련 워크샵",
      description: "기본 훈련부터 고급 훈련까지, 실전 강아지 훈련 워크샵입니다.",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      date: "2025-05-25",
      time: "13:00 - 17:00",
      locationId: 4,
      organizerId: 4,
      category: "교육",
      price: 50000,
      attendees: 8,
      maxAttendees: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      title: "반려동물 입양 행사",
      description: "새로운 가족을 찾고 있는 유기동물들을 만나볼 수 있는 입양 행사입니다.",
      image: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      date: "2025-06-10",
      time: "11:00 - 16:00",
      locationId: 5,
      organizerId: 5,
      category: "입양",
      price: "무료",
      attendees: 35,
      maxAttendees: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  // 샘플 이벤트 위치 데이터
  const sampleLocations: EventLocation[] = [
    {
      id: 1,
      name: "강남 애견공원",
      address: "서울 강남구 삼성동 159",
      lat: "37.508796",
      lng: "127.061359",
      region: "서울",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: "펫케어 센터",
      address: "서울 서초구 서초동 1445-3",
      lat: "37.491632",
      lng: "127.007358",
      region: "서울",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: "올림픽공원",
      address: "서울 송파구 방이동 88",
      lat: "37.520847",
      lng: "127.121674",
      region: "서울",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: "부산 반려동물 교육센터",
      address: "부산 해운대구 우동 1411",
      lat: "35.162844",
      lng: "129.159608",
      region: "부산",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      name: "대구 반려동물 문화센터",
      address: "대구 수성구 범어동 178-1",
      lat: "35.859971",
      lng: "128.631049",
      region: "대구",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  // 모든 이벤트 가져오기
  app.get("/api/events", (req, res) => {
    try {
      // 이벤트에 위치 정보 포함
      const eventsWithLocation = sampleEvents.map(event => {
        const location = sampleLocations.find(loc => loc.id === event.locationId);
        
        // 주최자 정보 (실제로는 사용자 데이터베이스에서 가져와야 함)
        const organizer = {
          name: `주최자 ${event.organizerId}`,
          avatar: `https://images.unsplash.com/photo-${1600000000000 + event.organizerId}?auto=format&fit=crop&w=100&h=100`
        };
        
        return {
          ...event,
          location,
          organizer
        };
      });
      
      return res.status(200).json(eventsWithLocation);
    } catch (error) {
      console.error("이벤트 조회 오류:", error);
      return res.status(500).json({ 
        message: "이벤트를 불러오는 중 오류가 발생했습니다", 
        code: "EVENT_FETCH_ERROR" 
      });
    }
  });
  
  // 이벤트 상세 조회
  app.get("/api/events/:id", (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = sampleEvents.find(e => e.id === eventId);
      
      if (!event) {
        return res.status(404).json({ 
          message: "이벤트를 찾을 수 없습니다", 
          code: "EVENT_NOT_FOUND" 
        });
      }
      
      const location = sampleLocations.find(loc => loc.id === event.locationId);
      
      // 주최자 정보
      const organizer = {
        name: `주최자 ${event.organizerId}`,
        avatar: `https://images.unsplash.com/photo-${1600000000000 + event.organizerId}?auto=format&fit=crop&w=100&h=100`
      };
      
      return res.status(200).json({
        ...event,
        location,
        organizer
      });
    } catch (error) {
      console.error("이벤트 상세 조회 오류:", error);
      return res.status(500).json({ 
        message: "이벤트 상세 정보를 불러오는 중 오류가 발생했습니다", 
        code: "EVENT_DETAIL_FETCH_ERROR" 
      });
    }
  });
  
  // 지역별 이벤트 조회
  app.get("/api/events/region/:region", (req, res) => {
    try {
      const { region } = req.params;
      
      if (!region) {
        return res.status(400).json({ 
          message: "지역 정보가 필요합니다", 
          code: "REGION_REQUIRED" 
        });
      }
      
      // 지역별 이벤트 필터링
      const filteredEvents = sampleEvents.filter(event => {
        const location = sampleLocations.find(loc => loc.id === event.locationId);
        return location && location.region === region;
      });
      
      // 이벤트에 위치 정보 포함
      const eventsWithLocation = filteredEvents.map(event => {
        const location = sampleLocations.find(loc => loc.id === event.locationId);
        
        // 주최자 정보
        const organizer = {
          name: `주최자 ${event.organizerId}`,
          avatar: `https://images.unsplash.com/photo-${1600000000000 + event.organizerId}?auto=format&fit=crop&w=100&h=100`
        };
        
        return {
          ...event,
          location,
          organizer
        };
      });
      
      return res.status(200).json(eventsWithLocation);
    } catch (error) {
      console.error("지역별 이벤트 조회 오류:", error);
      return res.status(500).json({ 
        message: "지역별 이벤트를 불러오는 중 오류가 발생했습니다", 
        code: "REGION_EVENTS_FETCH_ERROR" 
      });
    }
  });
  
  // 카테고리별 이벤트 조회
  app.get("/api/events/category/:category", (req, res) => {
    try {
      const { category } = req.params;
      
      if (!category) {
        return res.status(400).json({ 
          message: "카테고리 정보가 필요합니다", 
          code: "CATEGORY_REQUIRED" 
        });
      }
      
      // 카테고리별 이벤트 필터링
      const filteredEvents = sampleEvents.filter(event => event.category === category);
      
      // 이벤트에 위치 정보 포함
      const eventsWithLocation = filteredEvents.map(event => {
        const location = sampleLocations.find(loc => loc.id === event.locationId);
        
        // 주최자 정보
        const organizer = {
          name: `주최자 ${event.organizerId}`,
          avatar: `https://images.unsplash.com/photo-${1600000000000 + event.organizerId}?auto=format&fit=crop&w=100&h=100`
        };
        
        return {
          ...event,
          location,
          organizer
        };
      });
      
      return res.status(200).json(eventsWithLocation);
    } catch (error) {
      console.error("카테고리별 이벤트 조회 오류:", error);
      return res.status(500).json({ 
        message: "카테고리별 이벤트를 불러오는 중 오류가 발생했습니다", 
        code: "CATEGORY_EVENTS_FETCH_ERROR" 
      });
    }
  });
  
  // 프로필 업데이트 API
  app.put("/api/user/profile", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "인증되지 않은 사용자입니다" });
      }
      
      const userId = req.session.user.id;
      const { name, email, phone, bio, location, avatar } = req.body;
      
      // 업데이트할 프로필 데이터 준비
      const profileData = {
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        bio: bio || undefined,
        location: location || undefined,
        avatar: avatar || undefined
      };
      
      // 빈 객체인지 확인 (모든 값이 undefined면 업데이트할 내용이 없음)
      const hasUpdates = Object.values(profileData).some(value => value !== undefined);
      if (!hasUpdates) {
        return res.status(400).json({ message: "업데이트할 내용이 없습니다" });
      }
      
      // 프로필 업데이트
      const updatedUser = await storage.updateUserProfile(userId, profileData);
      
      // 세션 업데이트
      if (updatedUser) {
        const { password: _, instituteId, ...userWithoutSensitiveData } = updatedUser;
        
        // 세션에 저장할 사용자 정보 (타입에 맞게 조정)
        req.session.user = {
          ...userWithoutSensitiveData,
          instituteId: instituteId || undefined // null을 undefined로 변환
        };
        
        // 비밀번호를 제외한 사용자 정보만 반환
        return res.status(200).json(userWithoutSensitiveData);
      }
      
      return res.status(500).json({ message: "사용자 정보 업데이트에 실패했습니다" });
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
      return res.status(500).json({ message: "서버 오류가 발생했습니다" });
    }
  });
  
  // 로그 메시지
  console.log('[server] API routes registered');
  // ===== Auth Routes =====
  
  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      console.log("로그인 시도:", req.body);
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, we'd properly hash and compare the password
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user in session (removing password field and handling instituteId)
      const { password: _, instituteId, ...userWithoutSensitiveData } = user;
      
      // 세션에 저장할 사용자 정보 (타입에 맞게 조정)
      req.session.user = {
        ...userWithoutSensitiveData,
        instituteId: instituteId || undefined // null을 undefined로 변환
      };
      
      // 세션 저장 확인
      req.session.save((err) => {
        if (err) {
          console.error("세션 저장 오류:", err);
          return res.status(500).json({ message: "Session save error" });
        }
        
        console.log("세션 저장 성공:", req.sessionID);
        console.log("로그인한 사용자:", req.session.user);
        
        return res.status(200).json(userWithoutSensitiveData);
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
  
  // Get current user info
  app.get("/api/auth/me", (req, res) => {
    console.log("세션 확인 - SessionID:", req.sessionID);
    console.log("세션 확인 - 전체 세션:", req.session);
    console.log("세션 확인 - 사용자:", req.session.user);
    
    if (!req.session || !req.session.user) {
      // 로그인되지 않은 사용자는 401 상태 반환
      return res.status(401).json({ 
        message: "인증이 필요합니다. 로그인 후 다시 시도해주세요.", 
        code: "AUTH_REQUIRED"
      });
    }
    
    console.log("인증된 사용자 정보 반환:", req.session.user);
    return res.status(200).json(req.session.user);
  });
  
  // 챗봇 API 엔드포인트
  app.post('/api/chatbot', async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: '메시지가 필요합니다' });
      }

      // OpenAI API 키 확인
      if (!process.env.OPENAI_API_KEY) {
        return res.status(200).json({ 
          response: '죄송합니다. AI 서비스를 이용하려면 관리자가 OpenAI API 키를 설정해야 합니다. 관리자에게 문의해주세요.'
        });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `당신은 반려동물 훈련 전문가 AI 어시스턴트입니다. 반려동물(특히 강아지)의 훈련, 행동 교정, 건강 관리, 사회화 등에 대한 전문적이고 실용적인 조언을 제공해주세요. 

다음 가이드라인을 따라주세요:
- 친근하고 이해하기 쉬운 한국어로 답변
- 구체적이고 실행 가능한 조언 제공
- 안전을 최우선으로 고려
- 심각한 건강 문제나 공격성 문제는 전문가 상담 권유
- 답변은 200자 이내로 간결하게 작성`
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API 오류: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '죄송합니다. 응답을 생성할 수 없습니다.';

      res.json({ response: aiResponse });
    } catch (error) {
      console.error('챗봇 API 오류:', error);
      res.status(200).json({ 
        response: '죄송합니다. 현재 AI 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.' 
      });
    }
  });

  // Register new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = createUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
      }

      // 기관 코드가 제공된 경우 검증
      if (userData.instituteCode) {
        const institute = await storage.getInstituteByCode(userData.instituteCode);
        if (!institute) {
          return res.status(400).json({ message: "Invalid institute code" });
        }
        userData.role = 'trainer';
        // 올바른 방식으로 instituteId 처리 (userData에 포함시키지 않고 생성 후 처리)
      }
      
      const newUser = await storage.createUser(userData);
      
      // Don't return the password
      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== User Routes =====
  
  // 프로필 업데이트 (legacy 엔드포인트는 제거하고 `/api/user/profile`로 통합)
  
  // Get user profile
  app.get("/api/users/:id", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return the password
      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== Pet Routes =====
  
  // Get user's pets
  app.get("/api/pets", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.session.user.id;
      const pets = await storage.getPetsByUserId(userId);
      
      return res.status(200).json(pets);
    } catch (error) {
      console.error("Get pets error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get specific pet
  app.get("/api/pets/:id", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const petId = parseInt(req.params.id);
      const pet = await storage.getPet(petId);
      
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      
      // Check if pet belongs to the logged-in user
      if (pet.userId !== req.session.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      return res.status(200).json(pet);
    } catch (error) {
      console.error("Get pet error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Create new pet
  app.post("/api/pets", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const petData = createPetSchema.parse(req.body);
      
      // Assign the current user as the pet owner
      petData.userId = req.session.user.id;
      
      const newPet = await storage.createPet(petData);
      return res.status(201).json(newPet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      
      console.error("Create pet error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== Course Routes =====
  
  // Get all courses
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      return res.status(200).json(courses);
    } catch (error) {
      console.error("Get courses error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get course by ID
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      return res.status(200).json(course);
    } catch (error) {
      console.error("Get course error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get user's enrolled courses
  app.get("/api/user/courses", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.session.user.id;
      const courses = await storage.getCoursesByUserId(userId);
      
      return res.status(200).json(courses);
    } catch (error) {
      console.error("Get user courses error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Enroll in a course
  app.post("/api/courses/:id/enroll", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const courseId = parseInt(req.params.id);
      const userId = req.session.user.id;
      
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const enrollment = await storage.enrollUserInCourse(userId, courseId);
      return res.status(201).json(enrollment);
    } catch (error) {
      console.error("Enroll in course error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Create new course (for trainers)
  app.post("/api/courses", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is a trainer
      if (req.session.user.role !== "trainer" && req.session.user.role !== "institute-admin" && req.session.user.role !== "admin") {
        return res.status(403).json({ message: "Only trainers can create courses" });
      }
      
      const courseData = createCourseSchema.parse(req.body);
      
      // 과정 생성 시 trainerId는 현재 사용자로 설정하되, createCourse 함수에 별도로 전달
      const trainerId = req.session.user.id;
      
      const newCourse = await storage.createCourse({...courseData, trainerId});
      return res.status(201).json(newCourse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      
      console.error("Create course error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== Trainer Routes =====
  
  // Get all trainers
  app.get("/api/trainers", async (req, res) => {
    try {
      const trainers = await storage.getAllTrainers();
      return res.status(200).json(trainers);
    } catch (error) {
      console.error("Get trainers error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get trainer by ID
  app.get("/api/trainers/:id", async (req, res) => {
    try {
      const trainerId = parseInt(req.params.id);
      const trainer = await storage.getTrainer(trainerId);
      
      if (!trainer) {
        return res.status(404).json({ message: "Trainer not found" });
      }
      
      return res.status(200).json(trainer);
    } catch (error) {
      console.error("Get trainer error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== User Management Routes =====
  
  // Upgrade user to pet owner
  app.post("/api/users/:id/upgrade-to-pet-owner", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is institute admin
      if (req.session.user.role !== "institute-admin") {
        return res.status(403).json({ message: "Only institute admins can upgrade users" });
      }
      
      const userId = parseInt(req.params.id);
      const { trainerId } = req.body;
      
      // Validate trainer belongs to institute
      const trainer = await storage.getTrainer(trainerId);
      if (!trainer || trainer.instituteId !== req.session.user.instituteId) {
        return res.status(400).json({ message: "Invalid trainer" });
      }
      
      // Upgrade user
      const updatedUser = await storage.updateUserRole(userId, 'pet-owner', trainerId);
      
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Upgrade user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // 사용자 검색 API 엔드포인트
  app.get("/api/users/search", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          message: '검색어가 필요합니다.'
        });
      }
      
      // 검색 로직 구현 (이름, 이메일, 역할 등으로 검색)
      // 실제 구현에서는 데이터베이스 쿼리를 사용하여 검색
      // 예시: const users = await db.select().from(users).where(like(users.name, `%${query}%`));
      
      // 임시 구현 (메모리 스토리지에서 필터링)
      const sampleUsers = [
        { id: 2, name: '김훈련', role: 'trainer', avatar: null, email: 'trainer@example.com' },
        { id: 3, name: '이반려', role: 'pet-owner', avatar: null, email: 'pet-owner@example.com' },
        { id: 4, name: '박기관', role: 'institute-admin', avatar: null, email: 'institute@example.com' },
        { id: 5, name: '최관리', role: 'admin', avatar: null, email: 'admin2@example.com' },
        { id: 6, name: '홍길동', role: 'pet-owner', avatar: null, email: 'hong@example.com' },
        { id: 7, name: '김철수', role: 'trainer', avatar: null, email: 'kim@example.com' },
        { id: 8, name: '이영희', role: 'pet-owner', avatar: null, email: 'lee@example.com' },
      ];
      
      const searchResults = sampleUsers.filter(user => 
        user.name.includes(query) || 
        user.role.includes(query) ||
        user.email.includes(query)
      );
      
      return res.status(200).json({
        success: true,
        users: searchResults
      });
    } catch (error) {
      console.error('사용자 검색 오류:', error);
      return res.status(500).json({
        success: false,
        message: '사용자 검색 중 오류가 발생했습니다.'
      });
    }
  });
  
  // Institute and trainer routes are now in separate modules
  
  // ===== 쇼핑 API 엔드포인트 =====
  
  // 상품 카테고리 목록 가져오기
  app.get("/api/shop/categories", (req, res) => {
    try {
      const categories = [
        { id: 1, name: "사료", slug: "food", count: 32 },
        { id: 2, name: "간식", slug: "treats", count: 28 },
        { id: 3, name: "장난감", slug: "toys", count: 45 },
        { id: 4, name: "의류", slug: "clothing", count: 20 },
        { id: 5, name: "목줄/하네스", slug: "leashes", count: 15 },
        { id: 6, name: "위생용품", slug: "hygiene", count: 22 },
        { id: 7, name: "건강관리", slug: "health", count: 18 },
        { id: 8, name: "훈련용품", slug: "training", count: 12 }
      ];
      
      return res.status(200).json({ categories });
    } catch (error) {
      console.error("Get shop categories error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // 인기 반려견 품종 목록 가져오기
  app.get("/api/shop/popular-breeds", (req, res) => {
    try {
      const breeds = [
        { id: 1, name: "말티즈", slug: "maltese", count: 145 },
        { id: 2, name: "푸들", slug: "poodle", count: 132 },
        { id: 3, name: "포메라니안", slug: "pomeranian", count: 98 },
        { id: 4, name: "시츄", slug: "shih-tzu", count: 87 },
        { id: 5, name: "비숑 프리제", slug: "bichon-frise", count: 76 },
        { id: 6, name: "웰시 코기", slug: "welsh-corgi", count: 65 },
        { id: 7, name: "치와와", slug: "chihuahua", count: 52 },
        { id: 8, name: "댕댕이", slug: "mixed-breed", count: 189 }
      ];
      
      return res.status(200).json({ breeds });
    } catch (error) {
      console.error("Get popular breeds error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // 상품 목록 가져오기 (필터링 지원)
  app.get("/api/shop/products", async (req, res) => {
    try {
      // 필터링 파라미터 가져오기
      const { category, breed, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
      
      // 상품 목록 (예시 데이터)
      const products = [
        {
          id: 1,
          name: "프리미엄 강아지 사료",
          description: "영양 균형이 완벽한 프리미엄 사료",
          price: 45000,
          discountRate: 10,
          image: "/images/products/dog-food-premium.jpg",
          category: "food",
          rating: 4.8,
          reviewCount: 142,
          inStock: true,
          attributes: {
            weight: "3kg",
            flavor: "닭고기",
            suitableFor: ["all", "small", "medium"]
          }
        },
        {
          id: 2,
          name: "강아지 덴탈 간식",
          description: "치아 건강에 좋은 덴탈 간식",
          price: 12000,
          discountRate: 0,
          image: "/images/products/dog-treats-dental.jpg",
          category: "treats",
          rating: 4.5,
          reviewCount: 89,
          inStock: true,
          attributes: {
            weight: "300g",
            flavor: "치즈",
            suitableFor: ["all", "small", "medium", "large"]
          }
        },
        {
          id: 3,
          name: "인터랙티브 장난감",
          description: "반려견의 지능 발달에 도움이 되는 장난감",
          price: 28000,
          discountRate: 15,
          image: "/images/products/dog-toy-interactive.jpg",
          category: "toys",
          rating: 4.7,
          reviewCount: 76,
          inStock: true,
          attributes: {
            material: "고무, 플라스틱",
            size: "중형",
            suitableFor: ["all", "medium", "large"]
          }
        },
        {
          id: 4,
          name: "강아지 겨울 패딩",
          description: "추운 겨울을 따뜻하게 보낼 수 있는 패딩",
          price: 35000,
          discountRate: 20,
          image: "/images/products/dog-clothing-winter.jpg",
          category: "clothing",
          rating: 4.6,
          reviewCount: 52,
          inStock: true,
          attributes: {
            size: ["XS", "S", "M", "L", "XL"],
            color: ["레드", "네이비", "블랙"],
            material: "면, 폴리에스터",
            suitableFor: ["small", "medium"]
          }
        },
        {
          id: 5,
          name: "편안한 강아지 하네스",
          description: "산책할 때 편안하게 착용할 수 있는 하네스",
          price: 25000,
          discountRate: 5,
          image: "/images/products/dog-harness.jpg",
          category: "leashes",
          rating: 4.9,
          reviewCount: 112,
          inStock: true,
          attributes: {
            size: ["S", "M", "L"],
            color: ["블랙", "블루", "그린"],
            material: "나일론, 메쉬",
            suitableFor: ["all", "small", "medium", "large"]
          }
        },
        {
          id: 6,
          name: "강아지 샴푸",
          description: "피부 자극이 적은 천연 성분 샴푸",
          price: 18000,
          discountRate: 0,
          image: "/images/products/dog-shampoo.jpg",
          category: "hygiene",
          rating: 4.7,
          reviewCount: 95,
          inStock: true,
          attributes: {
            volume: "500ml",
            type: "저자극성",
            suitableFor: ["all", "sensitive-skin"]
          }
        }
      ];
      
      // 페이지네이션 계산
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      
      // 응답 데이터 구성
      const response = {
        products: products.slice(startIndex, endIndex),
        total: products.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(products.length / Number(limit))
      };
      
      return res.status(200).json(response);
    } catch (error) {
      console.error("Get products error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // 상품 상세 정보 가져오기
  app.get("/api/shop/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      // 예시 상품 상세 데이터
      const products = [
        {
          id: 1,
          name: "프리미엄 강아지 사료",
          description: "영양 균형이 완벽한 프리미엄 사료",
          longDescription: "이 프리미엄 사료는 성장기 강아지부터 성견까지 모든 연령대의 강아지에게 적합합니다. 필수 영양소와 비타민, 미네랄이 풍부하게 함유되어 있어 반려견의 건강한 성장과 유지에 도움을 줍니다. 인공 색소와 방부제를 첨가하지 않은 자연 그대로의 맛을 느낄 수 있습니다.",
          price: 45000,
          discountRate: 10,
          images: [
            "/images/products/dog-food-premium.jpg",
            "/images/products/dog-food-premium-2.jpg",
            "/images/products/dog-food-premium-3.jpg"
          ],
          category: "food",
          rating: 4.8,
          reviewCount: 142,
          inStock: true,
          attributes: {
            weight: "3kg",
            flavor: "닭고기",
            suitableFor: ["all", "small", "medium"],
            ingredients: "닭고기, 현미, 고구마, 당근, 블루베리, 비타민 E, 오메가3, 오메가6",
            nutritionalInfo: "단백질 26%, 지방 15%, 섬유질 4%, 수분 10%",
            feedingGuide: "체중 5kg 미만: 1일 100g, 체중 5-10kg: 1일 200g, 체중 10kg 이상: 1일 300g"
          },
          relatedProducts: [2, 6, 7],
          reviews: [
            { id: 1, user: "강아지집사", rating: 5, content: "우리 강아지가 정말 잘 먹어요!", date: "2023-04-15" },
            { id: 2, user: "멍멍이맘", rating: 4, content: "품질은 좋은데 가격이 조금 비싸요", date: "2023-03-22" }
          ]
        }
      ];
      
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      return res.status(200).json(product);
    } catch (error) {
      console.error("Get product detail error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // 장바구니에 상품 추가
  app.post("/api/shop/cart", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { productId, quantity } = req.body;
      
      if (!productId || !quantity) {
        return res.status(400).json({ message: "Product ID and quantity are required" });
      }
      
      // 간단한 성공 응답
      return res.status(200).json({ 
        success: true, 
        message: "Product added to cart",
        cart: {
          userId: req.session.user.id,
          items: [{ productId, quantity }]
        } 
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // 장바구니 정보 가져오기
  app.get("/api/shop/cart", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // 간단한 장바구니 데이터 반환
      return res.status(200).json({
        userId: req.session.user.id,
        items: [],
        subtotal: 0,
        total: 0
      });
    } catch (error) {
      console.error("Get cart error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // 추천인 코드 확인
  app.post("/api/shop/check-referral", async (req, res) => {
    try {
      const { referralCode } = req.body;
      
      if (!referralCode) {
        return res.status(400).json({ message: "Referral code is required" });
      }
      
      // 예시 추천인 코드
      const validCodes = ["TALES2024", "WELCOME10", "PETFRIEND"];
      
      const isValid = validCodes.includes(referralCode);
      
      return res.status(200).json({
        valid: isValid,
        discount: isValid ? 10 : 0,
        message: isValid ? "Valid referral code. 10% discount applied." : "Invalid referral code."
      });
    } catch (error) {
      console.error("Check referral code error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  
  // 외부 도메인 (funnytalez.com)에서의 인증 확인 API
  app.get("/api/auth/external-verify", (req, res) => {
    try {
      // URL 파라미터에서 인증 정보 확인
      const { auth, role, name } = req.query;
      
      // 간단한 검증 - 실제 운영에서는 더 강력한 보안 검증 필요
      if (auth === 'true' && role && name) {
        return res.status(200).json({
          authenticated: true,
          role: role,
          name: name,
          message: "인증이 확인되었습니다."
        });
      } else {
        return res.status(401).json({
          authenticated: false,
          message: "인증이 필요합니다."
        });
      }
    } catch (error) {
      console.error("외부 인증 확인 오류:", error);
      return res.status(500).json({ 
        message: "인증 확인 중 오류가 발생했습니다", 
        code: "AUTH_VERIFY_ERROR" 
      });
    }
  });
  
  // WebSocket 서버 초기화
  const wss = new WebSocketServer({
    server: httpServer,
    path: '/ws'  // WebSocket 연결 경로 (클라이언트에서도 같은 경로 사용)
  });

  // 메시징 서비스 초기화
  const messagingService = new MessagingService(wss, storage);
  
  // 알림 서비스 초기화
  const notificationService = new NotificationService(wss, storage);
  
  // 알림 라우트 등록
  registerNotificationRoutes(app, notificationService);
  
  // 분석 라우트 등록
  registerAnalyticsRoutes(app);
  
  // 교육 라우트 등록
  registerEducationRoutes(app);
  
  // 쇼핑 라우트 등록
  registerShoppingRoutes(app);

  // Spring Boot 스타일 API 엔드포인트 추가
  
  // User API
  app.get('/api/spring/users', userController.findAll.bind(userController));
  app.get('/api/spring/users/:id', userController.findById.bind(userController));
  app.post('/api/spring/users', userController.save.bind(userController));
  app.get('/api/spring/users/username/:username', userController.findByUsername.bind(userController));
  
  // Pet API
  app.get('/api/spring/pets', petController.findAll.bind(petController));
  app.get('/api/spring/pets/:id', petController.findById.bind(petController));
  app.post('/api/spring/pets', petController.save.bind(petController));
  app.get('/api/spring/pets/user/:userId', petController.findByUserId.bind(petController));
  
  // Course API
  app.get('/api/spring/courses', courseController.findAll.bind(courseController));
  app.get('/api/spring/courses/:id', courseController.findById.bind(courseController));
  app.post('/api/spring/courses', courseController.save.bind(courseController));
  app.get('/api/spring/courses/user/:userId', courseController.findByUserId.bind(courseController));
  app.post('/api/spring/courses/:courseId/enroll', courseController.enrollUser.bind(courseController));
  
  // Health Check & Application Info
  app.get('/actuator/health', userController.health.bind(userController));
  app.get('/actuator/info', (req, res) => {
    res.json(applicationConfig.getApplicationInfo());
  });

  // Spring Boot 애플리케이션 통합
  try {
    const { main } = await import('./spring/SpringBootApplication');
    // Spring Boot 애플리케이션을 별도 포트에서 실행하지 않고 현재 Express 앱에 통합
    console.log('[SpringBoot] Spring Boot 스타일 컴포넌트가 통합되었습니다');
  } catch (error) {
    console.log('[SpringBoot] Spring Boot 통합 스킵됨 (선택적)');
  }
  
  console.log('[SpringBoot] Spring Boot 스타일 API 엔드포인트가 등록되었습니다');

  // Java Bridge API 엔드포인트 추가
  app.get('/api/java/status', (req, res) => {
    res.json({ 
      isRunning: javaBridge.isRunning(),
      port: javaBridge.getPort(),
      message: javaBridge.isRunning() ? 'Java 서비스가 실행 중입니다.' : 'Java 서비스가 실행되지 않았습니다.'
    });
  });

  // Java 서비스 헬스 체크
  app.get('/api/java/health', async (req, res) => {
    try {
      if (!javaBridge.isRunning()) {
        return res.status(503).json({ message: 'Java 서비스가 실행되지 않았습니다.' });
      }
      
      const result = await javaBridge.callJavaService('/actuator/health');
      res.json({ status: 'UP', java: result });
    } catch (error) {
      res.status(503).json({ 
        status: 'DOWN', 
        message: 'Java 서비스 헬스 체크 실패',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  });

  // Java 서비스로 사용자 데이터 전송
  app.post('/api/java/users', async (req, res) => {
    try {
      if (!javaBridge.isRunning()) {
        return res.status(503).json({ message: 'Java 서비스가 실행되지 않았습니다.' });
      }
      
      const result = await javaBridge.callJavaService('/api/users', req.body);
      res.json({ message: 'Java 서비스로 데이터 전송 완료', result });
    } catch (error) {
      res.status(500).json({ 
        message: 'Java 서비스 호출 실패',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  });

  console.log('[server] WebSocket server initialized at /ws');
  console.log('[JavaBridge] Java Bridge API endpoints registered');
  
  return httpServer;
}
