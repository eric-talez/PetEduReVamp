import type { Express } from "express";
import { WebSocket, WebSocketServer } from 'ws';
import type { Server } from "http";
import { notificationService } from '../notifications/notification-service';
import { db } from '../db';
import { notifications } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';

export function registerNotificationRoutes(app: Express, server: Server) {
  console.log('[NotificationRoutes] Registering notification routes');

  // WebSocket 서버 초기화
  const wss = new WebSocketServer({ 
    server, 
    path: '/ws',
    verifyClient: (info) => {
      // WebSocket 연결 검증 로직 (필요시)
      return true;
    }
  });

  wss.on('connection', (ws: WebSocket, req) => {
    console.log('[WebSocket] 새로운 연결');
    
    let userId: number | null = null;

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'auth' && data.userId) {
          userId = parseInt(data.userId);
          notificationService.addConnection(userId, ws);
          
          ws.send(JSON.stringify({
            type: 'auth_success',
            message: '실시간 알림 연결 완료'
          }));
          
          console.log(`[WebSocket] 사용자 ${userId} 인증 완료`);
        }
      } catch (error) {
        console.error('[WebSocket] 메시지 파싱 오류:', error);
      }
    });

    ws.on('close', () => {
      if (userId) {
        notificationService.removeConnection(userId, ws);
      }
      console.log('[WebSocket] 연결 종료');
    });

    ws.on('error', (error) => {
      console.error('[WebSocket] 연결 오류:', error);
    });
  });

  // 알림 목록 조회
  app.get('/api/notifications', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: '인증이 필요합니다' });
    }

    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const userNotifications = await db.select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
        .offset(offset);

      res.json(userNotifications);
    } catch (error) {
      console.error('[Notifications] 알림 목록 조회 실패:', error);
      res.status(500).json({ error: '알림 목록을 불러올 수 없습니다' });
    }
  });

  // 읽지 않은 알림 수 조회
  app.get('/api/notifications/unread-count', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: '인증이 필요합니다' });
    }

    try {
      const userId = req.user.id;
      const count = await notificationService.getUnreadCount(userId);
      res.json({ count });
    } catch (error) {
      console.error('[Notifications] 읽지 않은 알림 수 조회 실패:', error);
      res.status(500).json({ error: '알림 정보를 불러올 수 없습니다' });
    }
  });

  // 알림 읽음 처리
  app.patch('/api/notifications/:id/read', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: '인증이 필요합니다' });
    }

    try {
      const notificationId = parseInt(req.params.id);
      const userId = req.user.id;

      await notificationService.markAsRead(notificationId, userId);
      
      res.json({ success: true });
    } catch (error) {
      console.error('[Notifications] 알림 읽음 처리 실패:', error);
      res.status(500).json({ error: '알림 상태를 업데이트할 수 없습니다' });
    }
  });

  // 모든 알림 읽음 처리
  app.patch('/api/notifications/read-all', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: '인증이 필요합니다' });
    }

    try {
      const userId = req.user.id;
      await notificationService.markAllAsRead(userId);
      
      res.json({ success: true });
    } catch (error) {
      console.error('[Notifications] 모든 알림 읽음 처리 실패:', error);
      res.status(500).json({ error: '알림 상태를 업데이트할 수 없습니다' });
    }
  });

  // 테스트용 알림 발송 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    app.post('/api/notifications/test', async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: '인증이 필요합니다' });
      }

      try {
        const userId = req.user.id;
        await notificationService.sendNotification({
          userId,
          type: 'system',
          title: '테스트 알림',
          message: '실시간 알림 시스템이 정상 작동합니다.',
          data: { test: true }
        });

        res.json({ success: true, message: '테스트 알림이 발송되었습니다' });
      } catch (error) {
        console.error('[Notifications] 테스트 알림 발송 실패:', error);
        res.status(500).json({ error: '테스트 알림을 발송할 수 없습니다' });
      }
    });
  }

  console.log('[NotificationRoutes] Notification routes registered');
}