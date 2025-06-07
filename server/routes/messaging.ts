
import type { Express } from "express";
import { WebSocket, WebSocketServer } from 'ws';
import type { Server } from "http";
import { db } from "../db";
import { messages, conversations, users } from "@shared/schema";
import { eq, and, desc, or, sql } from "drizzle-orm";

export function registerMessagingRoutes(app: Express, server: Server) {
  // WebSocket 서버 설정
  const wss = new WebSocketServer({ 
    server, 
    path: '/ws/messaging'
  });

  const activeConnections = new Map<number, WebSocket>();

  wss.on('connection', (ws: WebSocket, req) => {
    let userId: number | null = null;

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'auth' && data.userId) {
          userId = parseInt(data.userId);
          activeConnections.set(userId, ws);
          
          ws.send(JSON.stringify({
            type: 'auth_success',
            message: '메시징 연결 완료'
          }));
        }

        if (data.type === 'send_message' && userId) {
          handleRealTimeMessage(data, userId);
        }
      } catch (error) {
        console.error('메시징 WebSocket 오류:', error);
      }
    });

    ws.on('close', () => {
      if (userId) {
        activeConnections.delete(userId);
      }
    });
  });

  // 실시간 메시지 처리
  async function handleRealTimeMessage(data: any, senderId: number) {
    try {
      const { receiverId, content, conversationId } = data;

      // 메시지 저장
      const [newMessage] = await db.insert(messages)
        .values({
          conversationId,
          senderId,
          receiverId,
          content,
          isRead: false,
          createdAt: new Date()
        })
        .returning();

      // 수신자에게 실시간 전송
      const receiverWs = activeConnections.get(receiverId);
      if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
        receiverWs.send(JSON.stringify({
          type: 'new_message',
          message: newMessage
        }));
      }

      // 발신자에게 확인 응답
      const senderWs = activeConnections.get(senderId);
      if (senderWs && senderWs.readyState === WebSocket.OPEN) {
        senderWs.send(JSON.stringify({
          type: 'message_sent',
          message: newMessage
        }));
      }
    } catch (error) {
      console.error('실시간 메시지 처리 오류:', error);
    }
  }

  // 대화 목록 조회
  app.get('/api/messaging/conversations', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: '인증이 필요합니다.',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      const userId = req.user.id;

      const conversationList = await db.select({
        id: conversations.id,
        participantIds: conversations.participantIds,
        lastMessageAt: conversations.lastMessageAt,
        lastMessage: conversations.lastMessage,
        unreadCount: conversations.unreadCount,
        createdAt: conversations.createdAt
      })
      .from(conversations)
      .where(
        sql`${conversations.participantIds} @> ${JSON.stringify([userId])}`
      )
      .orderBy(desc(conversations.lastMessageAt));

      // 상대방 정보 조회
      const conversationsWithParticipants = await Promise.all(
        conversationList.map(async (conv) => {
          const otherUserId = conv.participantIds.find(id => id !== userId);
          
          if (otherUserId) {
            const [otherUser] = await db.select({
              id: users.id,
              name: users.name,
              username: users.username,
              avatar: users.avatar
            })
            .from(users)
            .where(eq(users.id, otherUserId));

            return {
              ...conv,
              otherUser
            };
          }
          
          return conv;
        })
      );

      res.json({
        success: true,
        conversations: conversationsWithParticipants
      });
    } catch (error) {
      console.error('대화 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '대화 목록을 불러올 수 없습니다.',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  });

  // 특정 대화의 메시지 목록 조회
  app.get('/api/messaging/conversations/:id/messages', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: '인증이 필요합니다.',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      const conversationId = parseInt(req.params.id);
      const userId = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = (page - 1) * limit;

      // 대화 참여 권한 확인
      const [conversation] = await db.select()
        .from(conversations)
        .where(eq(conversations.id, conversationId));

      if (!conversation || !conversation.participantIds.includes(userId)) {
        return res.status(403).json({
          success: false,
          message: '대화에 참여할 권한이 없습니다.',
          code: 'ACCESS_DENIED'
        });
      }

      // 메시지 목록 조회
      const messageList = await db.select({
        id: messages.id,
        content: messages.content,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        isRead: messages.isRead,
        createdAt: messages.createdAt,
        sender: {
          id: users.id,
          name: users.name,
          username: users.username,
          avatar: users.avatar
        }
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(limit)
      .offset(offset);

      // 읽음 처리
      await db.update(messages)
        .set({ isRead: true })
        .where(
          and(
            eq(messages.conversationId, conversationId),
            eq(messages.receiverId, userId),
            eq(messages.isRead, false)
          )
        );

      res.json({
        success: true,
        messages: messageList.reverse(),
        pagination: {
          page,
          limit,
          hasMore: messageList.length === limit
        }
      });
    } catch (error) {
      console.error('메시지 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '메시지를 불러올 수 없습니다.',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  });

  // 새 대화 시작
  app.post('/api/messaging/conversations', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: '인증이 필요합니다.',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      const { participantId, initialMessage } = req.body;
      const userId = req.user.id;

      if (!participantId || participantId === userId) {
        return res.status(400).json({
          success: false,
          message: '유효한 상대방을 선택해주세요.',
          code: 'INVALID_PARTICIPANT'
        });
      }

      // 기존 대화 확인
      const existingConversation = await db.select()
        .from(conversations)
        .where(
          sql`${conversations.participantIds} @> ${JSON.stringify([userId, participantId])}`
        )
        .limit(1);

      if (existingConversation.length > 0) {
        return res.json({
          success: true,
          conversation: existingConversation[0],
          message: '기존 대화로 연결됩니다.'
        });
      }

      // 새 대화 생성
      const [newConversation] = await db.insert(conversations)
        .values({
          participantIds: [userId, participantId],
          lastMessage: initialMessage || null,
          lastMessageAt: new Date(),
          unreadCount: 0,
          createdAt: new Date()
        })
        .returning();

      // 초기 메시지가 있으면 저장
      if (initialMessage) {
        await db.insert(messages)
          .values({
            conversationId: newConversation.id,
            senderId: userId,
            receiverId: participantId,
            content: initialMessage,
            isRead: false,
            createdAt: new Date()
          });
      }

      res.status(201).json({
        success: true,
        conversation: newConversation,
        message: '새 대화가 시작되었습니다.'
      });
    } catch (error) {
      console.error('대화 생성 오류:', error);
      res.status(500).json({
        success: false,
        message: '대화를 시작할 수 없습니다.',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  });

  // 메시지 전송
  app.post('/api/messaging/send', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: '인증이 필요합니다.',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      const { conversationId, receiverId, content } = req.body;
      const senderId = req.user.id;

      // 입력값 검증
      if (!content || content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: '메시지 내용을 입력해주세요.',
          code: 'EMPTY_MESSAGE'
        });
      }

      if (content.length > 1000) {
        return res.status(400).json({
          success: false,
          message: '메시지는 1000자를 초과할 수 없습니다.',
          code: 'MESSAGE_TOO_LONG'
        });
      }

      // 대화 참여 권한 확인
      const [conversation] = await db.select()
        .from(conversations)
        .where(eq(conversations.id, conversationId));

      if (!conversation || !conversation.participantIds.includes(senderId)) {
        return res.status(403).json({
          success: false,
          message: '대화에 참여할 권한이 없습니다.',
          code: 'ACCESS_DENIED'
        });
      }

      // 메시지 저장
      const [newMessage] = await db.insert(messages)
        .values({
          conversationId,
          senderId,
          receiverId,
          content: content.trim(),
          isRead: false,
          createdAt: new Date()
        })
        .returning();

      // 대화 업데이트
      await db.update(conversations)
        .set({
          lastMessage: content.trim(),
          lastMessageAt: new Date(),
          unreadCount: sql`${conversations.unreadCount} + 1`
        })
        .where(eq(conversations.id, conversationId));

      // 실시간 전송
      const receiverWs = activeConnections.get(receiverId);
      if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
        receiverWs.send(JSON.stringify({
          type: 'new_message',
          message: newMessage
        }));
      }

      res.json({
        success: true,
        message: newMessage,
        status: '메시지가 전송되었습니다.'
      });
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      res.status(500).json({
        success: false,
        message: '메시지 전송 중 오류가 발생했습니다.',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  });
}
