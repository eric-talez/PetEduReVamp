import { WebSocket } from 'ws';
import { db } from '../db';
import { notifications } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';

export interface NotificationData {
  userId: number;
  type: 'system' | 'course' | 'event' | 'health' | 'payment' | 'message';
  title: string;
  message: string;
  data?: any;
}

// 실시간 알림 서비스 (WebSocket)
export class NotificationService {
  private static instance: NotificationService;
  private clients: Map<string, WebSocket> = new Map();
  private wsServer: WebSocket.Server | null = null;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // WebSocket 서버 초기화
  initializeWebSocketServer(server: any) {
    this.wsServer = new WebSocket.Server({ 
      server,
      path: '/ws'
    });

    this.wsServer.on('connection', (ws: WebSocket, req: any) => {
      const userId = req.url?.split('userId=')[1] || 'anonymous';
      this.addClient(userId, ws);

      ws.on('close', () => {
        this.removeClient(userId);
      });

      ws.on('error', (error) => {
        console.error(`[알림] WebSocket 오류:`, error);
        this.removeClient(userId);
      });

      // 연결 확인 메시지 발송
      ws.send(JSON.stringify({
        type: 'connected',
        message: '실시간 알림이 활성화되었습니다.'
      }));
    });

    console.log('[알림] WebSocket 서버가 초기화되었습니다.');
  }

  // WebSocket 연결 등록
  addClient(userId: string, ws: WebSocket) {
    this.clients.set(userId, ws);
    console.log(`[알림] 사용자 ${userId} WebSocket 연결됨 (총 ${this.clients.size}개 연결)`);
  }

  // WebSocket 연결 해제
  removeClient(userId: string) {
    this.clients.delete(userId);
    console.log(`[알림] 사용자 ${userId} WebSocket 연결 해제됨 (총 ${this.clients.size}개 연결)`);
  }

  // 실시간 알림 발송
  async sendRealTimeNotification(userId: string, notification: any) {
    const client = this.clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify({
          type: 'notification',
          data: notification,
          timestamp: new Date().toISOString()
        }));
        console.log(`[알림] 사용자 ${userId}에게 실시간 알림 발송됨`);
        return true;
      } catch (error) {
        console.error(`[알림] 실시간 알림 발송 실패:`, error);
        this.removeClient(userId);
        return false;
      }
    }
    return false;
  }

  // 대량 알림 발송
  async sendBulkNotification(userIds: string[], notification: any) {
    const results = [];
    for (const userId of userIds) {
      const success = await this.sendRealTimeNotification(userId, notification);
      results.push({ userId, success });
    }
    console.log(`[알림] 대량 알림 발송 완료: ${results.filter(r => r.success).length}/${results.length}`);
    return results;
  }

  // 연결된 클라이언트 수 조회
  getConnectedClientsCount(): number {
    return this.clients.size;
  }

  // 특정 사용자 연결 상태 확인
  isUserConnected(userId: string): boolean {
    const client = this.clients.get(userId);
    return client ? client.readyState === WebSocket.OPEN : false;
  }

  // 푸시 알림 발송 (모의)
  async sendPushNotification(userId: string, notification: any) {
    // 실제 환경에서는 FCM, APNS 등과 연동
    console.log(`[푸시알림] 사용자 ${userId}에게 푸시 알림 발송:`, notification.title);
    return true;
  }

  // 이메일 알림 발송 (모의)
  async sendEmailNotification(userId: string, notification: any) {
    // 실제 환경에서는 이메일 서비스와 연동
    console.log(`[이메일알림] 사용자 ${userId}에게 이메일 알림 발송:`, notification.title);
    return true;
  }

  // SMS 알림 발송 (모의)
  async sendSMSNotification(userId: string, notification: any) {
    // 실제 환경에서는 SMS 서비스와 연동
    console.log(`[SMS알림] 사용자 ${userId}에게 SMS 알림 발송:`, notification.title);
    return true;
  }
  private connections: Map<number, WebSocket[]> = new Map();

  // static getInstance(): NotificationService {
  //   if (!NotificationService.instance) {
  //     NotificationService.instance = new NotificationService();
  //   }
  //   return NotificationService.instance;
  // }

  // WebSocket 연결 등록
  addConnection(userId: number, ws: WebSocket): void {
    if (!this.connections.has(userId)) {
      this.connections.set(userId, []);
    }
    this.connections.get(userId)!.push(ws);

    ws.on('close', () => {
      this.removeConnection(userId, ws);
    });

    ws.on('error', (error) => {
      console.error(`[Notification] WebSocket error for user ${userId}:`, error);
      this.removeConnection(userId, ws);
    });

    console.log(`[Notification] 사용자 ${userId} WebSocket 연결됨 (총 ${this.connections.get(userId)?.length}개)`);
  }

  // WebSocket 연결 해제
  removeConnection(userId: number, ws: WebSocket): void {
    const userConnections = this.connections.get(userId);
    if (userConnections) {
      const index = userConnections.indexOf(ws);
      if (index > -1) {
        userConnections.splice(index, 1);
      }
      if (userConnections.length === 0) {
        this.connections.delete(userId);
      }
    }
    console.log(`[Notification] 사용자 ${userId} WebSocket 연결 해제됨`);
  }

  // 실시간 알림 발송
  async sendNotification(notification: NotificationData): Promise<void> {
    try {
      // 데이터베이스에 알림 저장
      const [savedNotification] = await db.insert(notifications).values({
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data ? JSON.stringify(notification.data) : null,
        isRead: false
      }).returning();

      // 실시간으로 사용자에게 전송
      const userConnections = this.connections.get(notification.userId);
      if (userConnections && userConnections.length > 0) {
        const payload = JSON.stringify({
          type: 'notification',
          data: {
            ...savedNotification,
            data: savedNotification.data ? JSON.parse(savedNotification.data) : null
          }
        });

        userConnections.forEach(ws => {
          if (ws.readyState === WebSocket.OPEN) {
            try {
              ws.send(payload);
            } catch (error) {
              console.error(`[Notification] 전송 실패:`, error);
              this.removeConnection(notification.userId, ws);
            }
          }
        });

        console.log(`[Notification] 사용자 ${notification.userId}에게 실시간 알림 전송: ${notification.title}`);
      } else {
        console.log(`[Notification] 사용자 ${notification.userId}가 오프라인 상태 - 알림만 저장됨`);
      }
    } catch (error) {
      console.error('[Notification] 알림 발송 실패:', error);
      throw error;
    }
  }

  // 대량 알림 발송
  async sendBulkNotification2(userIds: number[], notification: Omit<NotificationData, 'userId'>): Promise<void> {
    const promises = userIds.map(userId => 
      this.sendNotification({ ...notification, userId })
    );
    await Promise.all(promises);
  }

  // 사용자별 읽지 않은 알림 수 조회
  async getUnreadCount(userId: number): Promise<number> {
    const result = await db.select().from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ));
    return result.length;
  }

  // 알림 읽음 처리
  async markAsRead(notificationId: number, userId: number): Promise<void> {
    await db.update(notifications)
      .set({ 
        isRead: true,
        readAt: new Date()
      })
      .where(and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId)
      ));

    // 실시간으로 읽음 상태 업데이트 전송
    const userConnections = this.connections.get(userId);
    if (userConnections) {
      const payload = JSON.stringify({
        type: 'notification_read',
        data: { notificationId }
      });

      userConnections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(payload);
        }
      });
    }
  }

  // 모든 알림 읽음 처리
  async markAllAsRead(userId: number): Promise<void> {
    await db.update(notifications)
      .set({ 
        isRead: true,
        readAt: new Date()
      })
      .where(eq(notifications.userId, userId));

    // 실시간으로 모든 읽음 상태 업데이트 전송
    const userConnections = this.connections.get(userId);
    if (userConnections) {
      const payload = JSON.stringify({
        type: 'all_notifications_read'
      });

      userConnections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(payload);
        }
      });
    }
  }

  // 사용자 알림 목록 조회
  async getUserNotifications(userId: number, limit: number = 20, offset: number = 0): Promise<any[]> {
    const results = await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);

    return results.map(notification => ({
      ...notification,
      data: notification.data ? JSON.parse(notification.data) : null
    }));
  }

  // 연결된 사용자 수 확인
  getConnectionsCount(): number {
    let total = 0;
    this.connections.forEach(connections => {
      total += connections.length;
    });
    return total;
  }

  // 특정 사용자 온라인 상태 확인
  isUserOnline(userId: number): boolean {
    const userConnections = this.connections.get(userId);
    return userConnections ? userConnections.length > 0 : false;
  }

  // 시스템 알림 전송 (모든 사용자에게)
  async sendSystemNotification(title: string, message: string, data?: any): Promise<void> {
    // 모든 온라인 사용자에게 시스템 알림 전송
    const onlineUsers = Array.from(this.connections.keys());

    for (const userId of onlineUsers) {
      await this.sendNotification({
        userId,
        type: 'system',
        title,
        message,
        data
      });
    }
  }

  // 특정 이벤트 알림 메서드들
  async notifyEventRegistration(userId: number, eventTitle: string, eventId: number): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'event',
      title: '이벤트 참가 신청 완료',
      message: `"${eventTitle}" 이벤트 참가 신청이 완료되었습니다.`,
      data: { eventId, action: 'registered' }
    });
  }

  async notifyCourseEnrollment(userId: number, courseTitle: string, courseId: number): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'course',
      title: '강좌 등록 완료',
      message: `"${courseTitle}" 강좌 등록이 완료되었습니다.`,
      data: { courseId, action: 'enrolled' }
    });
  }

  async notifyHealthCheckupReminder(userId: number, petName: string, dueDate: Date): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'health',
      title: '건강검진 일정 알림',
      message: `${petName}의 건강검진 일정이 다가왔습니다.`,
      data: { petName, dueDate, action: 'checkup_reminder' }
    });
  }

  async notifyPaymentSuccess(userId: number, amount: number, description: string): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'payment',
      title: '결제 완료',
      message: `${description} 결제가 완료되었습니다. (${amount.toLocaleString()}원)`,
      data: { amount, description, action: 'payment_success' }
    });
  }
}

export const notificationService = NotificationService.getInstance();