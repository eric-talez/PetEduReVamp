import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
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
import { Event, EventLocation } from "@shared/schema";
import { WebSocketServer } from 'ws';
import { MessagingService } from './messaging/service';
import { NotificationService } from './notifications/service';
import { registerNotificationRoutes } from './notifications/routes';

// 타입은 server/types.d.ts에 정의되어 있습니다.

// 본인인증 관련 로직 임포트
import { verifyIdentity } from './auth/verify';

export async function registerRoutes(app: Express): Promise<Server> {
  // 본인인증 API 엔드포인트
  app.post('/api/auth/verify-identity', verifyIdentity);
  // Register all modular routes
  registerCommissionRoutes(app);
  registerTrainerRoutes(app);
  registerCourseRoutes(app);
  registerInstituteRoutes(app);
  registerLocationRoutes(app);
  registerVideoCallRoutes(app);
  registerMenuRoutes(app);
  registerAiRoutes(app);
  
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
  
  // 정적 알림 테스트 페이지 라우트 추가
  app.get('/notification-test-page', (req, res) => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>알림 시스템 테스트</title>
  <style>
    body {
      font-family: 'Nunito', 'Inter', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    h1 {
      color: #4f46e5;
    }
    .notification {
      background-color: white;
      border-left: 4px solid #4f46e5;
      padding: 12px;
      margin-bottom: 12px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .notification-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .notification-title {
      font-weight: bold;
      color: #333;
    }
    .notification-time {
      color: #666;
      font-size: 0.8em;
    }
    .notification-body {
      color: #444;
    }
    .btn {
      background-color: #4f46e5;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      margin-right: 8px;
    }
    .btn:hover {
      background-color: #4338ca;
    }
    .tabs {
      display: flex;
      margin-bottom: 20px;
      border-bottom: 1px solid #ddd;
    }
    .tab {
      padding: 10px 20px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
    }
    .tab.active {
      border-bottom: 2px solid #4f46e5;
      font-weight: bold;
    }
    #notifications-container {
      min-height: 200px;
    }
    .notification-type {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.8em;
      margin-right: 8px;
    }
    .type-system { background-color: #e5e7eb; }
    .type-message { background-color: #dbeafe; }
    .type-course { background-color: #dcfce7; }
    .type-payment { background-color: #fef3c7; }
    .type-marketing { background-color: #fce7f3; }
    .status-message {
      margin-top: 8px;
      padding: 8px;
      border-radius: 4px;
    }
    .status-success {
      background-color: #dcfce7;
      color: #166534;
    }
    .status-error {
      background-color: #fee2e2;
      color: #b91c1c;
    }
  </style>
</head>
<body>
  <h1>알림 시스템 테스트</h1>
  
  <div class="container">
    <h2>알림 테스트 도구</h2>
    <div>
      <button id="test-email" class="btn">이메일 알림 테스트</button>
      <button id="test-push" class="btn">푸시 알림 테스트</button>
      <button id="test-web" class="btn">웹 알림 테스트</button>
      <button id="test-all" class="btn">모든 알림 테스트</button>
    </div>
    <div id="status-message"></div>
  </div>

  <div class="container">
    <h2>알림 목록</h2>
    <div class="tabs">
      <div class="tab active" data-type="all">전체</div>
      <div class="tab" data-type="system">시스템</div>
      <div class="tab" data-type="message">메시지</div>
      <div class="tab" data-type="course">수업</div>
      <div class="tab" data-type="payment">결제</div>
      <div class="tab" data-type="marketing">마케팅</div>
    </div>
    <div id="notifications-container"></div>
  </div>

  <script>
    // 알림 타입
    const NOTIFICATION_TYPES = {
      SYSTEM: 'system',
      MESSAGE: 'message',
      COURSE: 'course',
      PAYMENT: 'payment', 
      MARKETING: 'marketing'
    };

    // 샘플 알림 데이터
    const sampleNotifications = [
      { 
        id: 1, 
        type: NOTIFICATION_TYPES.SYSTEM, 
        title: '시스템 점검 안내', 
        body: '5월 25일 새벽 2시부터 4시까지 시스템 점검이 있을 예정입니다.', 
        createdAt: new Date(2025, 4, 24, 10, 0) 
      },
      { 
        id: 2, 
        type: NOTIFICATION_TYPES.MESSAGE, 
        title: '새 메시지 도착', 
        body: '김훈련사님으로부터 새 메시지가 도착했습니다.', 
        createdAt: new Date(2025, 4, 24, 11, 30) 
      },
      { 
        id: 3, 
        type: NOTIFICATION_TYPES.COURSE, 
        title: '수업 일정 안내', 
        body: '내일 예정된 "기본 복종 훈련" 수업이 있습니다.', 
        createdAt: new Date(2025, 4, 24, 14, 15) 
      },
      { 
        id: 4, 
        type: NOTIFICATION_TYPES.PAYMENT, 
        title: '결제 완료', 
        body: '고급 훈련 과정 결제가 완료되었습니다.', 
        createdAt: new Date(2025, 4, 24, 15, 45) 
      },
      { 
        id: 5, 
        type: NOTIFICATION_TYPES.MARKETING, 
        title: '특별 할인 이벤트', 
        body: '5월 가정의 달 특별 할인 이벤트가 시작되었습니다. 모든 코스 20% 할인!', 
        createdAt: new Date(2025, 4, 24, 16, 0) 
      }
    ];

    // 알림 목록 표시 함수
    function displayNotifications(notifications) {
      const container = document.getElementById('notifications-container');
      container.innerHTML = '';
      
      if (notifications.length === 0) {
        container.innerHTML = '<p>알림이 없습니다.</p>';
        return;
      }
      
      notifications.forEach(notification => {
        const notificationEl = document.createElement('div');
        notificationEl.className = 'notification';
        
        // 알림 타입에 따른 스타일 클래스
        const typeClass = \`type-\${notification.type}\`;
        
        notificationEl.innerHTML = \`
          <div class="notification-header">
            <div>
              <span class="notification-type \${typeClass}">\${notification.type}</span>
              <span class="notification-title">\${notification.title}</span>
            </div>
            <span class="notification-time">\${formatDate(notification.createdAt)}</span>
          </div>
          <div class="notification-body">\${notification.body}</div>
        \`;
        
        container.appendChild(notificationEl);
      });
    }
    
    // 날짜 포맷팅 함수
    function formatDate(date) {
      const now = new Date();
      const diff = now - date;
      
      // 1시간 이내
      if (diff < 60 * 60 * 1000) {
        const minutes = Math.floor(diff / (60 * 1000));
        return \`\${minutes}분 전\`;
      }
      
      // 오늘 이내
      if (date.getDate() === now.getDate() && 
          date.getMonth() === now.getMonth() && 
          date.getFullYear() === now.getFullYear()) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return \`오늘 \${hours}:\${minutes}\`;
      }
      
      // 그 외
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return \`\${year}-\${month}-\${day}\`;
    }
    
    // 상태 메시지 표시 함수
    function showStatusMessage(message, isSuccess = true) {
      const statusEl = document.getElementById('status-message');
      statusEl.textContent = message;
      statusEl.className = \`status-message \${isSuccess ? 'status-success' : 'status-error'}\`;
      
      // 5초 후 메시지 제거
      setTimeout(() => {
        statusEl.textContent = '';
        statusEl.className = 'status-message';
      }, 5000);
    }
    
    // 초기 알림 표시
    displayNotifications(sampleNotifications);
    
    // 탭 이벤트 리스너
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        // 활성 탭 스타일 변경
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // 선택된 타입에 따라 알림 필터링
        const type = tab.getAttribute('data-type');
        let filteredNotifications;
        
        if (type === 'all') {
          filteredNotifications = sampleNotifications;
        } else {
          filteredNotifications = sampleNotifications.filter(n => n.type === type);
        }
        
        displayNotifications(filteredNotifications);
      });
    });
    
    // 테스트 버튼 이벤트 리스너
    document.getElementById('test-email').addEventListener('click', () => {
      fetch('/api/notifications/test/email', { method: 'POST' })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('이메일 알림 테스트 실패');
        })
        .then(data => {
          showStatusMessage('이메일 알림 테스트가 전송되었습니다.');
        })
        .catch(err => showStatusMessage('이메일 알림 테스트 오류: ' + err.message, false));
    });
    
    document.getElementById('test-push').addEventListener('click', () => {
      fetch('/api/notifications/test/push', { method: 'POST' })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('푸시 알림 테스트 실패');
        })
        .then(data => {
          showStatusMessage('푸시 알림 테스트가 전송되었습니다.');
        })
        .catch(err => showStatusMessage('푸시 알림 테스트 오류: ' + err.message, false));
    });
    
    document.getElementById('test-web').addEventListener('click', () => {
      fetch('/api/notifications/test/web', { method: 'POST' })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('웹 알림 테스트 실패');
        })
        .then(data => {
          showStatusMessage('웹 알림 테스트가 전송되었습니다.');
        })
        .catch(err => showStatusMessage('웹 알림 테스트 오류: ' + err.message, false));
    });
    
    document.getElementById('test-all').addEventListener('click', () => {
      fetch('/api/notifications/test/all', { method: 'POST' })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('알림 테스트 실패');
        })
        .then(data => {
          showStatusMessage('모든 알림 테스트가 전송되었습니다.');
        })
        .catch(err => showStatusMessage('알림 테스트 오류: ' + err.message, false));
    });

    // 웹소켓 연결 설정
    function setupWebSocket() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = \`\${protocol}//\${window.location.host}/ws\`;
      const socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log('WebSocket 연결이 열렸습니다.');
        showStatusMessage('WebSocket 연결 성공');
        
        // 인증 메시지 전송 (실제 인증 데이터는 필요에 따라 수정)
        const authMessage = {
          type: 'auth',
          data: {
            token: localStorage.getItem('token') || 'guest-token'
          }
        };
        socket.send(JSON.stringify(authMessage));
      };
      
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('WebSocket 메시지 수신:', message);
          
          // 알림 메시지 처리
          if (message.type === 'notification') {
            const notification = message.data;
            
            // 알림 배열 맨 앞에 추가
            sampleNotifications.unshift({
              id: Date.now(), // 임시 ID
              type: notification.type || NOTIFICATION_TYPES.SYSTEM,
              title: notification.title || '새 알림',
              body: notification.body || notification.message || '새로운 알림이 도착했습니다.',
              createdAt: new Date()
            });
            
            // 현재 활성 탭에 맞게 알림 다시 표시
            const activeTab = document.querySelector('.tab.active');
            const activeType = activeTab.getAttribute('data-type');
            
            if (activeType === 'all' || activeType === notification.type) {
              displayNotifications(
                activeType === 'all' 
                  ? sampleNotifications 
                  : sampleNotifications.filter(n => n.type === activeType)
              );
            }
            
            // 알림 도착 메시지 표시
            showStatusMessage('새 알림이 도착했습니다: ' + (notification.title || '새 알림'));
            
            // 브라우저 알림 표시 (사용자가 허용한 경우)
            if ('Notification' in window && Notification.permission === 'granted') {
              const browserNotification = new Notification(
                notification.title || '새 알림', 
                { 
                  body: notification.body || notification.message || '새로운 알림이 도착했습니다.',
                  icon: '/favicon.ico'
                }
              );
              
              // 알림 클릭 시 탭으로 포커스 이동
              browserNotification.onclick = () => {
                window.focus();
              };
            }
          }
        } catch (err) {
          console.error('WebSocket 메시지 처리 오류:', err);
        }
      };
      
      socket.onclose = (event) => {
        console.log('WebSocket 연결이 닫혔습니다:', event.code, event.reason);
        showStatusMessage('WebSocket 연결이 끊어졌습니다. 재연결 중...', false);
        
        // 자동 재연결 시도
        setTimeout(setupWebSocket, 3000);
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket 오류:', error);
        showStatusMessage('WebSocket 연결 오류가 발생했습니다.', false);
      };
      
      return socket;
    }
    
    // 브라우저 알림 권한 요청
    function requestNotificationPermission() {
      if ('Notification' in window) {
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              showStatusMessage('브라우저 알림 권한이 허용되었습니다.');
            }
          });
        } else if (Notification.permission === 'granted') {
          showStatusMessage('브라우저 알림이 활성화되어 있습니다.');
        } else {
          showStatusMessage('브라우저 알림이 차단되어 있습니다. 알림을 받으려면 권한을 허용해주세요.', false);
        }
      } else {
        showStatusMessage('이 브라우저는 알림 기능을 지원하지 않습니다.', false);
      }
    }
    
    // 페이지 로드 시 실행
    document.addEventListener('DOMContentLoaded', () => {
      requestNotificationPermission();
      setupWebSocket();
    });
  </script>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(htmlContent);
  });

  // 정적 파일 라우트 - 알림 테스트 페이지
  app.get('/notification-test', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'public', 'notification-test.html'));
  });
  
  // 루트 경로에서 알림 테스트 페이지로 리다이렉트
  app.get('/', (req, res) => {
    res.redirect('/notification-test');
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

  console.log('[server] WebSocket server initialized at /ws');
  
  return httpServer;
}
