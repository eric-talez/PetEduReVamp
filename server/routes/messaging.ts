import type { Express } from "express";
import type { Server } from "http";
import { WebSocketServer } from 'ws';
import { MessagingService } from '../messaging/service';
import { storage } from '../storage';
import { asyncHandler, AppError } from '../middleware/error-handler';

let messagingService: MessagingService;

export function registerMessagingRoutes(app: Express, server: Server) {
  console.log('[MessagingRoutes] Registering messaging routes');

  // WebSocket 서버 설정
  const wss = new WebSocketServer({ 
    server,
    path: '/ws',
    perMessageDeflate: false
  });

  // WebSocket 연결 처리
  wss.on('connection', (ws, request) => {
    console.log('New WebSocket connection established');
    
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('Received message:', message);
        
        // Echo back for now
        ws.send(JSON.stringify({
          type: 'echo',
          data: message
        }));
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  // Ping clients regularly to check connection
  setInterval(() => {
    wss.clients.forEach(ws => {
      if (ws.isAlive === false) {
        console.log('Terminating WebSocket due to inactivity');
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping(() => {});
    });
  }, 30000); // Check every 30 seconds

  // 메시징 서비스 초기화
  messagingService = new MessagingService(wss, storage);

  // 대화 목록 조회
  app.get('/api/messages/conversations', asyncHandler(async (req: any, res: any) => {
    if (!req.user) {
      throw new AppError('인증이 필요합니다.', 401);
    }

    // 개발환경에서는 더미 데이터 반환
    const conversations = [
      {
        id: 'conv_1',
        participants: [
          { id: 1, name: '반려인', role: 'pet-owner' },
          { id: 2, name: '김민수 훈련사', role: 'trainer' }
        ],
        lastMessage: {
          content: '안녕하세요! 강아지 훈련 상담 받고 싶습니다.',
          timestamp: new Date(),
          senderId: 1
        },
        unreadCount: 2
      },
      {
        id: 'conv_2',
        participants: [
          { id: 1, name: '반려인', role: 'pet-owner' },
          { id: 3, name: '이영희 훈련사', role: 'trainer' }
        ],
        lastMessage: {
          content: '감사합니다. 다음 수업 일정을 확인해주세요.',
          timestamp: new Date(Date.now() - 3600000),
          senderId: 3
        },
        unreadCount: 0
      }
    ];

    return res.status(200).json({ 
      success: true, 
      data: conversations, 
      message: '대화 목록을 성공적으로 조회했습니다.' 
    });
  }));

  // 특정 대화의 메시지 목록 조회
  app.get('/api/messages/conversations/:conversationId', asyncHandler(async (req: any, res: any) => {
    if (!req.user) {
      throw new AppError('인증이 필요합니다.', 401);
    }

    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // 개발환경에서는 더미 메시지 반환
    const messages = [
      {
        id: 'msg_1',
        content: '안녕하세요! 강아지 훈련 상담 받고 싶습니다.',
        senderId: 1,
        senderName: '반려인',
        timestamp: new Date(Date.now() - 7200000),
        type: 'text'
      },
      {
        id: 'msg_2',
        content: '안녕하세요! 어떤 부분에 대해 상담을 원하시나요?',
        senderId: 2,
        senderName: '김민수 훈련사',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text'
      },
      {
        id: 'msg_3',
        content: '우리 강아지가 다른 개들과 잘 어울리지 못해서요.',
        senderId: 1,
        senderName: '반려인',
        timestamp: new Date(Date.now() - 1800000),
        type: 'text'
      }
    ];

    return res.status(200).json({ 
      success: true, 
      data: {
        messages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: messages.length,
          hasMore: false
        }
      }, 
      message: '메시지 목록을 성공적으로 조회했습니다.' 
    });
  }));

  // 메시지 전송
  app.post('/api/messages/send', asyncHandler(async (req: any, res: any) => {
    if (!req.user) {
      throw new AppError('인증이 필요합니다.', 401);
    }

    const { conversationId, content, receiverId } = req.body;
    
    if (!content || content.trim().length === 0) {
      throw new AppError('메시지 내용이 필요합니다.', 400);
    }

    // 메시지 생성
    const message = {
      id: `msg_${Date.now()}`,
      content: content.trim(),
      senderId: req.user.id,
      senderName: req.user.name,
      receiverId,
      timestamp: new Date(),
      type: 'text'
    };

    // WebSocket을 통해 실시간 전송
    if (messagingService) {
      messagingService.sendMessage(receiverId, message);
    }

    return res.status(201).json({ 
      success: true, 
      data: message, 
      message: '메시지가 성공적으로 전송되었습니다.' 
    });
  }));

  // 메시지 읽음 처리
  app.put('/api/messages/:messageId/read', asyncHandler(async (req: any, res: any) => {
    if (!req.user) {
      throw new AppError('인증이 필요합니다.', 401);
    }

    const { messageId } = req.params;

    // 읽음 처리 로직 (실제 구현에서는 데이터베이스 업데이트)
    console.log(`Message ${messageId} marked as read by user ${req.user.id}`);

    return res.status(200).json({ 
      success: true, 
      message: '메시지를 읽음으로 처리했습니다.' 
    });
  }));

  // 대화 생성
  app.post('/api/messages/conversations', asyncHandler(async (req: any, res: any) => {
    if (!req.user) {
      throw new AppError('인증이 필요합니다.', 401);
    }

    const { participantId } = req.body;
    
    if (!participantId) {
      throw new AppError('대화 상대방 ID가 필요합니다.', 400);
    }

    const conversation = {
      id: `conv_${Date.now()}`,
      participants: [
        { id: req.user.id, name: req.user.name, role: req.user.role },
        { id: participantId, name: '상대방', role: 'trainer' }
      ],
      createdAt: new Date(),
      lastMessage: null,
      unreadCount: 0
    };

    return res.status(201).json({ 
      success: true, 
      data: conversation, 
      message: '대화방이 성공적으로 생성되었습니다.' 
    });
  }));

  console.log('[MessagingRoutes] Messaging routes registered');
}