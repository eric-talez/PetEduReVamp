/**
 * 웹 알림 서비스
 * 
 * 웹 애플리케이션 내에서 사용자에게 알림을 표시하는 서비스입니다.
 * WebSocket을 통해 실시간 알림을 전송하고, DB에 알림 이력을 저장합니다.
 */
import { NotificationType } from './notification-types';
import { WebSocket } from 'ws';

// 웹 알림 옵션 인터페이스
export interface WebNotificationOptions {
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, any>;
  url?: string;
  isRead?: boolean;
}

// 알림 저장을 위한 인터페이스
interface StoredNotification extends WebNotificationOptions {
  id: string;
  createdAt: Date;
  readAt?: Date;
}

// 웹소켓 클라이언트 관리를 위한 인터페이스
interface WebSocketClient {
  userId: number;
  socket: WebSocket;
  connectionTime: Date;
}

// 웹 알림 서비스 클래스
class WebNotificationService {
  // 연결된 클라이언트 관리
  private clients: Map<number, WebSocketClient[]> = new Map();
  
  // 알림 저장소 (실제 구현에서는 DB를 사용해야 함)
  private notifications: Map<string, StoredNotification> = new Map();
  
  constructor() {
    console.log('웹 알림 서비스 초기화');
  }

  /**
   * 웹 알림을 전송합니다.
   * @param options 웹 알림 옵션
   */
  async send(options: WebNotificationOptions): Promise<void> {
    try {
      // 알림 ID 생성
      const id = this.generateId();
      
      // 알림 데이터 생성
      const notification: StoredNotification = {
        id,
        userId: options.userId,
        title: options.title,
        message: options.message,
        type: options.type,
        data: options.data || {},
        url: options.url,
        isRead: options.isRead || false,
        createdAt: new Date()
      };
      
      // 알림 저장 (실제 구현에서는 DB에 저장)
      this.saveNotification(notification);
      
      // 웹소켓으로 실시간 알림 전송
      this.sendToUser(options.userId, {
        type: 'notification',
        data: notification
      });
      
      console.log(`웹 알림 발송 성공: 사용자 ${options.userId}, 제목: ${options.title}`);
    } catch (error) {
      console.error('웹 알림 발송 실패:', error);
      throw new Error(`웹 알림 발송 실패: ${(error as Error).message}`);
    }
  }

  /**
   * 웹소켓 클라이언트를 등록합니다.
   * @param userId 사용자 ID
   * @param socket 웹소켓 객체
   */
  registerClient(userId: number, socket: WebSocket): void {
    // 사용자의 클라이언트 목록 가져오기
    const userClients = this.clients.get(userId) || [];
    
    // 새 클라이언트 추가
    const client: WebSocketClient = {
      userId,
      socket,
      connectionTime: new Date()
    };
    
    userClients.push(client);
    this.clients.set(userId, userClients);
    
    console.log(`웹소켓 클라이언트 등록: 사용자 ${userId}, 현재 연결 수: ${userClients.length}`);
    
    // 연결 종료 시 클라이언트 제거
    socket.on('close', () => {
      this.unregisterClient(userId, socket);
    });
  }

  /**
   * 웹소켓 클라이언트 등록을 해제합니다.
   * @param userId 사용자 ID
   * @param socket 웹소켓 객체
   */
  unregisterClient(userId: number, socket: WebSocket): void {
    const userClients = this.clients.get(userId);
    if (!userClients) return;
    
    // 해당 소켓 제거
    const updatedClients = userClients.filter(client => client.socket !== socket);
    
    // 클라이언트가 남아있으면 업데이트, 없으면 사용자 항목 제거
    if (updatedClients.length > 0) {
      this.clients.set(userId, updatedClients);
    } else {
      this.clients.delete(userId);
    }
    
    console.log(`웹소켓 클라이언트 해제: 사용자 ${userId}, 남은 연결 수: ${updatedClients.length}`);
  }

  /**
   * 특정 사용자에게 메시지를 전송합니다.
   * @param userId 사용자 ID
   * @param message 전송할 메시지 객체
   */
  sendToUser(userId: number, message: Record<string, any>): void {
    const userClients = this.clients.get(userId);
    if (!userClients || userClients.length === 0) {
      console.log(`메시지 전송 건너뜀: 사용자 ${userId}에게 연결된 클라이언트 없음`);
      return;
    }
    
    const messageStr = JSON.stringify(message);
    let successCount = 0;
    let failCount = 0;
    
    // 각 클라이언트에 메시지 전송
    userClients.forEach(client => {
      if (client.socket.readyState === WebSocket.OPEN) {
        try {
          client.socket.send(messageStr);
          successCount++;
        } catch (error) {
          console.error(`웹소켓 메시지 전송 실패: 사용자 ${userId}`, error);
          failCount++;
        }
      } else {
        // 연결이 닫혔으면 클라이언트 제거
        this.unregisterClient(userId, client.socket);
        failCount++;
      }
    });
    
    console.log(`메시지 전송 결과: 사용자 ${userId}, 성공 ${successCount}건, 실패 ${failCount}건`);
  }

  /**
   * 모든 클라이언트에게 메시지를 전송합니다.
   * @param message 전송할 메시지 객체
   */
  broadcast(message: Record<string, any>): void {
    const messageStr = JSON.stringify(message);
    let totalClients = 0;
    let successCount = 0;
    
    // 모든 클라이언트에 메시지 전송
    this.clients.forEach((clients, userId) => {
      clients.forEach(client => {
        totalClients++;
        if (client.socket.readyState === WebSocket.OPEN) {
          try {
            client.socket.send(messageStr);
            successCount++;
          } catch (error) {
            console.error(`웹소켓 브로드캐스트 실패: 사용자 ${userId}`, error);
          }
        } else {
          // 연결이 닫혔으면 클라이언트 제거
          this.unregisterClient(userId, client.socket);
        }
      });
    });
    
    console.log(`브로드캐스트 결과: 총 ${totalClients}개 클라이언트 중 ${successCount}개 성공`);
  }

  /**
   * 알림을 읽음 상태로 표시합니다.
   * @param userId 사용자 ID
   * @param notificationId 알림 ID
   */
  async markAsRead(userId: number, notificationId: string): Promise<boolean> {
    const notification = this.notifications.get(notificationId);
    
    if (!notification || notification.userId !== userId) {
      return false;
    }
    
    // 이미 읽은 알림이면 무시
    if (notification.isRead) {
      return true;
    }
    
    // 알림을 읽음 상태로 업데이트
    notification.isRead = true;
    notification.readAt = new Date();
    this.notifications.set(notificationId, notification);
    
    // 실제 구현에서는 DB 업데이트
    console.log(`알림 읽음 표시: ID ${notificationId}, 사용자 ${userId}`);
    
    return true;
  }

  /**
   * 사용자의 모든 알림을 읽음 상태로 표시합니다.
   * @param userId 사용자 ID
   */
  async markAllAsRead(userId: number): Promise<number> {
    let count = 0;
    
    // 모든 알림 순회
    this.notifications.forEach((notification, id) => {
      if (notification.userId === userId && !notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date();
        this.notifications.set(id, notification);
        count++;
      }
    });
    
    // 실제 구현에서는 DB 업데이트
    console.log(`모든 알림 읽음 표시: 사용자 ${userId}, ${count}개 업데이트`);
    
    return count;
  }

  /**
   * 사용자의 알림 목록을 가져옵니다.
   * @param userId 사용자 ID
   * @param limit 최대 개수
   * @param offset 시작 위치
   * @param includeRead 읽은 알림 포함 여부
   */
  async getUserNotifications(
    userId: number, 
    limit: number = 20, 
    offset: number = 0,
    includeRead: boolean = true
  ): Promise<StoredNotification[]> {
    // 사용자의 알림 필터링
    const userNotifications = Array.from(this.notifications.values())
      .filter(notification => 
        notification.userId === userId && 
        (includeRead || !notification.isRead)
      )
      // 최신순 정렬
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      // 페이지네이션 적용
      .slice(offset, offset + limit);
    
    return userNotifications;
  }

  /**
   * 사용자의 읽지 않은 알림 개수를 가져옵니다.
   * @param userId 사용자 ID
   */
  async getUnreadCount(userId: number): Promise<number> {
    // 읽지 않은 알림 개수 계산
    const count = Array.from(this.notifications.values())
      .filter(notification => 
        notification.userId === userId && 
        !notification.isRead
      ).length;
    
    return count;
  }

  /**
   * 알림을 저장합니다.
   * @param notification 알림 데이터
   */
  private saveNotification(notification: StoredNotification): void {
    // 실제 구현에서는 DB에 저장
    this.notifications.set(notification.id, notification);
  }

  /**
   * 고유 ID를 생성합니다.
   */
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substring(2, 15);
  }
}

// 싱글톤 인스턴스 생성
export const webNotificationService = new WebNotificationService();