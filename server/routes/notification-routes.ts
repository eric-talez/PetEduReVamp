/**
 * 알림 API 라우트
 * 
 * - 기기 등록/등록 해제 API
 * - 알림 설정 조회 및 업데이트 API
 * - 알림 목록 조회 및 읽음 처리 API
 * - 테스트 알림 발송 API
 * - 관리자용 대량 알림 발송 API
 */
import { Router, Request, Response } from 'express';
import { notificationService, Notification } from '../services/notification';
import { webNotificationService } from '../services/notification/web-notification-service';
import { emailService } from '../services/notification/email-service';
import { NotificationType, NotificationChannel } from '../services/notification/notification-types';
import { WebSocket } from 'ws';

// 알림 라우터 생성
export const notificationRouter = Router();

// 사용자 인증 여부 확인 미들웨어
const isAuthenticated = (req: Request, res: Response, next: () => void) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }
  next();
};

// 관리자 권한 확인 미들웨어
const isAdmin = (req: Request, res: Response, next: () => void) => {
  if (!req.isAuthenticated || !req.isAuthenticated() || req.user.role !== 'admin') {
    return res.status(403).json({ error: '관리자 권한이 필요합니다.' });
  }
  next();
};

// 웹소켓 클라이언트 등록 함수
export function registerWebSocketClient(userId: number, socket: WebSocket): void {
  webNotificationService.registerClient(userId, socket);
}

/**
 * 알림 설정 조회 API
 * GET /api/notifications/settings
 */
notificationRouter.get('/settings', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const settings = await notificationService.getUserSettings(userId);
    res.json(settings);
  } catch (error) {
    console.error('알림 설정 조회 오류:', error);
    res.status(500).json({ error: '알림 설정을 조회하는 중 오류가 발생했습니다.' });
  }
});

/**
 * 알림 설정 업데이트 API
 * PATCH /api/notifications/settings
 */
notificationRouter.patch('/settings', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const settings = req.body;
    
    // 설정 업데이트
    const updatedSettings = await notificationService.updateUserSettings(userId, settings);
    res.json(updatedSettings);
  } catch (error) {
    console.error('알림 설정 업데이트 오류:', error);
    res.status(500).json({ error: '알림 설정을 업데이트하는 중 오류가 발생했습니다.' });
  }
});

/**
 * 알림 목록 조회 API
 * GET /api/notifications
 */
notificationRouter.get('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const includeRead = req.query.includeRead === 'true';
    
    const notifications = await webNotificationService.getUserNotifications(
      userId,
      limit,
      offset,
      includeRead
    );
    
    res.json({
      notifications,
      pagination: {
        limit,
        offset,
        hasMore: notifications.length === limit
      }
    });
  } catch (error) {
    console.error('알림 목록 조회 오류:', error);
    res.status(500).json({ error: '알림 목록을 조회하는 중 오류가 발생했습니다.' });
  }
});

/**
 * 읽지 않은 알림 개수 조회 API
 * GET /api/notifications/unread-count
 */
notificationRouter.get('/unread-count', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const count = await webNotificationService.getUnreadCount(userId);
    res.json({ count });
  } catch (error) {
    console.error('읽지 않은 알림 개수 조회 오류:', error);
    res.status(500).json({ error: '읽지 않은 알림 개수를 조회하는 중 오류가 발생했습니다.' });
  }
});

/**
 * 알림 읽음 처리 API
 * PATCH /api/notifications/:id/read
 */
notificationRouter.patch('/:id/read', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;
    
    const success = await webNotificationService.markAsRead(userId, notificationId);
    
    if (!success) {
      return res.status(404).json({ error: '알림을 찾을 수 없거나 접근 권한이 없습니다.' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('알림 읽음 처리 오류:', error);
    res.status(500).json({ error: '알림을 읽음 처리하는 중 오류가 발생했습니다.' });
  }
});

/**
 * 모든 알림 읽음 처리 API
 * PATCH /api/notifications/read-all
 */
notificationRouter.patch('/read-all', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const count = await webNotificationService.markAllAsRead(userId);
    res.json({ success: true, count });
  } catch (error) {
    console.error('모든 알림 읽음 처리 오류:', error);
    res.status(500).json({ error: '모든 알림을 읽음 처리하는 중 오류가 발생했습니다.' });
  }
});

/**
 * 기기 토큰 등록 API
 * POST /api/notifications/device-token
 */
notificationRouter.post('/device-token', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { token, platform } = req.body;
    
    if (!token || !platform) {
      return res.status(400).json({ error: '토큰과 플랫폼 정보가 필요합니다.' });
    }
    
    if (!['android', 'ios', 'web'].includes(platform)) {
      return res.status(400).json({ error: '유효한 플랫폼 값이 아닙니다. (android, ios, web)' });
    }
    
    const success = await notificationService.registerDeviceToken(userId, token, platform as any);
    res.json({ success });
  } catch (error) {
    console.error('기기 토큰 등록 오류:', error);
    res.status(500).json({ error: '기기 토큰을 등록하는 중 오류가 발생했습니다.' });
  }
});

/**
 * 기기 토큰 삭제 API
 * DELETE /api/notifications/device-token
 */
notificationRouter.delete('/device-token', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: '토큰 정보가 필요합니다.' });
    }
    
    const success = await notificationService.unregisterDeviceToken(userId, token);
    res.json({ success });
  } catch (error) {
    console.error('기기 토큰 삭제 오류:', error);
    res.status(500).json({ error: '기기 토큰을 삭제하는 중 오류가 발생했습니다.' });
  }
});

/**
 * 간단한 테스트 알림 API (인증 필요 없음)
 * POST /api/notifications/test/{channel}
 */
notificationRouter.post('/test/:channel', async (req: Request, res: Response) => {
  try {
    const { channel } = req.params;
    const userId = req.user?.id || 1; // 비로그인 시 기본 사용자 ID 사용
    
    if (!['email', 'push', 'web', 'all'].includes(channel)) {
      return res.status(400).json({ 
        error: '유효한 알림 채널이 아닙니다. (email, push, web, all)',
      });
    }
    
    const title = '테스트 알림';
    const message = `${channel} 채널 테스트 알림입니다. (${new Date().toLocaleTimeString()})`;
    
    // 채널별 테스트 알림 발송
    if (channel === 'email') {
      // 이메일 알림 발송
      await emailService.send({
        to: req.body.email || 'test@example.com', // 요청에 이메일이 없으면 기본값 사용
        type: NotificationType.SYSTEM,
        data: {
          title: title,
          message: message,
          isTest: true,
          timestamp: new Date().toISOString()
        }
      });
    } else if (channel === 'push') {
      // 푸시 알림 발송
      await notificationService.send({
        userId,
        type: NotificationType.SYSTEM,
        title: title,
        message: message,
        channels: [NotificationChannel.PUSH],
        data: {
          isTest: true,
          timestamp: new Date().toISOString()
        }
      });
    } else if (channel === 'web') {
      // 웹 알림 발송
      await webNotificationService.sendToUser(userId, {
        type: NotificationType.SYSTEM,
        title: title,
        body: message,
        data: {
          isTest: true,
          timestamp: new Date().toISOString()
        }
      });
    } else if (channel === 'all') {
      // 모든 채널 알림 발송
      await notificationService.send({
        userId,
        type: NotificationType.SYSTEM,
        title: title,
        message: message,
        channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH, NotificationChannel.WEB],
        data: {
          isTest: true,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    res.json({ success: true, message: `${channel} 알림이 발송되었습니다.` });
  } catch (error) {
    console.error(`${req.params.channel} 테스트 알림 발송 오류:`, error);
    res.status(500).json({ error: `테스트 알림을 발송하는 중 오류가 발생했습니다: ${error.message}` });
  }
});

/**
 * 테스트 알림 발송 API
 * POST /api/notifications/test
 */
notificationRouter.post('/test', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { type, channels } = req.body;
    
    if (!type || !channels || !Array.isArray(channels) || channels.length === 0) {
      return res.status(400).json({ 
        error: '알림 유형과 채널 정보가 필요합니다.',
        validTypes: Object.values(NotificationType),
        validChannels: Object.values(NotificationChannel)
      });
    }
    
    // 지원하는 알림 유형 확인
    if (!Object.values(NotificationType).includes(type as NotificationType)) {
      return res.status(400).json({ 
        error: '유효한 알림 유형이 아닙니다.',
        validTypes: Object.values(NotificationType)
      });
    }
    
    // 지원하는 채널 확인
    for (const channel of channels) {
      if (!Object.values(NotificationChannel).includes(channel as NotificationChannel)) {
        return res.status(400).json({ 
          error: '유효한 알림 채널이 아닙니다.',
          validChannels: Object.values(NotificationChannel)
        });
      }
    }
    
    // 테스트 알림 발송
    const result = await notificationService.send({
      userId,
      type: type as NotificationType,
      title: '테스트 알림',
      message: `${type} 유형의 테스트 알림입니다.`,
      channels: channels as NotificationChannel[],
      data: {
        isTest: true,
        timestamp: new Date().toISOString()
      }
    });
    
    res.json(result);
  } catch (error) {
    console.error('테스트 알림 발송 오류:', error);
    res.status(500).json({ error: '테스트 알림을 발송하는 중 오류가 발생했습니다.' });
  }
});

/**
 * 이메일 테스트 발송 API
 * POST /api/notifications/test-email
 */
notificationRouter.post('/test-email', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: '이메일 주소가 필요합니다.' });
    }
    
    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: '유효한 이메일 주소가 아닙니다.' });
    }
    
    // 테스트 이메일 발송
    await emailService.send({
      to: email,
      type: NotificationType.SYSTEM,
      data: {
        title: '테스트 이메일',
        message: '이 이메일은 Talez 알림 시스템 테스트를 위해 발송되었습니다.',
        isTest: true,
        timestamp: new Date().toISOString()
      }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('테스트 이메일 발송 오류:', error);
    res.status(500).json({ error: '테스트 이메일을 발송하는 중 오류가 발생했습니다.' });
  }
});

/**
 * 관리자용 알림 발송 API
 * POST /api/notifications/admin/send
 */
notificationRouter.post('/admin/send', isAdmin, async (req: Request, res: Response) => {
  try {
    const { userIds, roleTarget, notification } = req.body;
    
    if ((!userIds || !Array.isArray(userIds)) && !roleTarget) {
      return res.status(400).json({ error: '대상 사용자 ID 목록 또는 역할 대상이 필요합니다.' });
    }
    
    if (!notification || !notification.type || !notification.title || !notification.message) {
      return res.status(400).json({ error: '알림 정보(유형, 제목, 내용)가 필요합니다.' });
    }
    
    let results = [];
    
    // 역할별 전송
    if (roleTarget) {
      results = await notificationService.sendToRole(roleTarget, notification);
    } 
    // 사용자 ID별 전송
    else if (userIds && userIds.length > 0) {
      results = await Promise.all(
        userIds.map(userId => 
          notificationService.send({
            ...notification,
            userId
          })
        )
      );
    }
    
    res.json({ 
      success: true,
      sent: results.length,
      results
    });
  } catch (error) {
    console.error('관리자 알림 발송 오류:', error);
    res.status(500).json({ error: '알림을 발송하는 중 오류가 발생했습니다.' });
  }
});

// 라우터 등록 함수
export function registerNotificationRoutes(app: any) {
  app.use('/api/notifications', notificationRouter);
  console.log('[NotificationRoutes] Registering notification routes');
}