
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

class NotificationService {
  private static instance: NotificationService;
  private connections: Map<number, WebSocket[]> = new Map();

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

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
  async sendBulkNotification(userIds: number[], notification: Omit<NotificationData, 'userId'>): Promise<void> {
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
