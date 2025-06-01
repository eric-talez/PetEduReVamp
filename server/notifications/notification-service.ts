import { WebSocket } from 'ws';
import { db } from '../db';
import { notifications, users } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';

export interface NotificationData {
  id?: number;
  userId: number;
  type: 'event' | 'course' | 'health' | 'payment' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead?: boolean;
  createdAt?: Date;
}

export class NotificationService {
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

    console.log(`[Notification] 사용자 ${userId} WebSocket 연결됨`);
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
        data: notification.data,
        isRead: false
      }).returning();

      // 실시간으로 사용자에게 전송
      const userConnections = this.connections.get(notification.userId);
      if (userConnections && userConnections.length > 0) {
        const payload = JSON.stringify({
          type: 'notification',
          data: savedNotification
        });

        userConnections.forEach(ws => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(payload);
          }
        });

        console.log(`[Notification] 사용자 ${notification.userId}에게 실시간 알림 전송: ${notification.title}`);
      }
    } catch (error) {
      console.error('[Notification] 알림 발송 실패:', error);
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
      .set({ isRead: true })
      .where(and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId)
      ));
  }

  // 모든 알림 읽음 처리
  async markAllAsRead(userId: number): Promise<void> {
    await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId));
  }

  // 사용자 알림 목록 조회
  async getUserNotifications(userId: number, limit: number = 20): Promise<any[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }

  // 특정 이벤트 알림
  async notifyEventRegistration(userId: number, eventTitle: string, eventId: number): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'event',
      title: '이벤트 참가 신청 완료',
      message: `"${eventTitle}" 이벤트 참가 신청이 완료되었습니다.`,
      data: { eventId, action: 'registered' }
    });
  }

  async notifyEventCancellation(userId: number, eventTitle: string, eventId: number): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'event',
      title: '이벤트 참가 취소',
      message: `"${eventTitle}" 이벤트 참가가 취소되었습니다.`,
      data: { eventId, action: 'cancelled' }
    });
  }

  async notifyEventReminder(userId: number, eventTitle: string, eventDate: Date): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'event',
      title: '이벤트 일정 알림',
      message: `내일 "${eventTitle}" 이벤트가 예정되어 있습니다.`,
      data: { eventDate, action: 'reminder' }
    });
  }

  // 강좌 관련 알림
  async notifyCourseEnrollment(userId: number, courseTitle: string, courseId: number): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'course',
      title: '강좌 등록 완료',
      message: `"${courseTitle}" 강좌 등록이 완료되었습니다.`,
      data: { courseId, action: 'enrolled' }
    });
  }

  async notifyCourseProgress(userId: number, courseTitle: string, progress: number): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'course',
      title: '학습 진도 업데이트',
      message: `"${courseTitle}" 강좌 진도가 ${progress}%로 업데이트되었습니다.`,
      data: { progress, action: 'progress_update' }
    });
  }

  // 건강 관련 알림
  async notifyHealthCheckupReminder(userId: number, petName: string, dueDate: Date): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'health',
      title: '건강검진 일정 알림',
      message: `${petName}의 건강검진 일정이 다가왔습니다.`,
      data: { petName, dueDate, action: 'checkup_reminder' }
    });
  }

  async notifyVaccinationReminder(userId: number, petName: string, vaccineName: string): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'health',
      title: '예방접종 일정 알림',
      message: `${petName}의 ${vaccineName} 예방접종 일정입니다.`,
      data: { petName, vaccineName, action: 'vaccination_reminder' }
    });
  }

  // 결제 관련 알림
  async notifyPaymentSuccess(userId: number, amount: number, description: string): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'payment',
      title: '결제 완료',
      message: `${description} 결제가 완료되었습니다. (${amount.toLocaleString()}원)`,
      data: { amount, description, action: 'payment_success' }
    });
  }

  async notifyPaymentFailed(userId: number, amount: number, description: string): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'payment',
      title: '결제 실패',
      message: `${description} 결제가 실패했습니다. 다시 시도해주세요.`,
      data: { amount, description, action: 'payment_failed' }
    });
  }
}

export const notificationService = NotificationService.getInstance();