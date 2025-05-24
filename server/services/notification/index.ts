/**
 * 통합 알림 관리 시스템
 * 
 * 웹, 이메일, 모바일 푸시 알림을 통합 관리하는 시스템입니다.
 * 사용자 설정에 따라 적절한 채널로 알림을 라우팅합니다.
 */

import { emailService } from './email-service';
import { pushService } from './push-service';
import { webNotificationService } from './web-notification-service';
import { NotificationType, NotificationChannel, NotificationPriority } from './notification-types';

// 알림 인터페이스
export interface Notification {
  id?: string;
  userId: number | number[]; // 단일 사용자 또는 사용자 그룹
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>; // 추가 데이터
  priority?: NotificationPriority;
  createdAt?: Date;
  readAt?: Date;
  channels?: NotificationChannel[]; // 알림 채널 (웹, 이메일, 푸시 등)
  role?: string; // 특정 역할을 대상으로 하는 경우
}

// 알림 결과 인터페이스
export interface NotificationResult {
  success: boolean;
  id?: string;
  channels: {
    web?: boolean;
    email?: boolean;
    push?: boolean;
  };
  errors?: Record<string, Error>;
}

// 사용자 알림 설정 인터페이스
export interface UserNotificationSettings {
  userId: number;
  channels: {
    web: boolean;
    email: boolean;
    push: boolean;
  };
  types: {
    [key in NotificationType]?: {
      enabled: boolean;
      channels?: NotificationChannel[];
    };
  };
}

/**
 * 알림 서비스 클래스
 * 다양한 알림 채널을 통합 관리합니다.
 */
class NotificationService {
  // 기본 알림 설정
  private defaultSettings: Partial<UserNotificationSettings> = {
    channels: {
      web: true,
      email: true,
      push: true
    },
    types: {
      [NotificationType.SYSTEM]: {
        enabled: true,
        channels: [NotificationChannel.WEB, NotificationChannel.EMAIL]
      },
      [NotificationType.MESSAGE]: {
        enabled: true,
        channels: [NotificationChannel.WEB, NotificationChannel.PUSH]
      },
      [NotificationType.COURSE]: {
        enabled: true,
        channels: [NotificationChannel.WEB, NotificationChannel.EMAIL, NotificationChannel.PUSH]
      },
      [NotificationType.PAYMENT]: {
        enabled: true,
        channels: [NotificationChannel.WEB, NotificationChannel.EMAIL]
      },
      [NotificationType.MARKETING]: {
        enabled: false,
        channels: [NotificationChannel.EMAIL]
      }
    }
  };

  // 사용자별 알림 설정 캐시 (실제 구현에서는 DB에서 가져와야 함)
  private userSettings: Map<number, UserNotificationSettings> = new Map();

  /**
   * 알림을 전송합니다.
   * @param notification 알림 데이터
   * @returns 알림 전송 결과
   */
  async send(notification: Notification): Promise<NotificationResult> {
    const result: NotificationResult = {
      success: false,
      channels: {},
      errors: {}
    };

    try {
      // 단일 사용자인지 여러 사용자인지 확인
      const userIds = Array.isArray(notification.userId) 
        ? notification.userId 
        : [notification.userId];
      
      // 각 사용자에게 알림 전송
      for (const userId of userIds) {
        const settings = await this.getUserSettings(userId);
        
        // 사용자가 이 유형의 알림을 받을지 확인
        const typeSettings = settings.types[notification.type];
        if (!typeSettings || !typeSettings.enabled) {
          continue;
        }
        
        // 알림 채널 결정
        const channels = notification.channels || typeSettings.channels || [];

        // 각 채널로 알림 전송
        for (const channel of channels) {
          try {
            if (channel === NotificationChannel.WEB && settings.channels.web) {
              await this.sendWebNotification(userId, notification);
              result.channels.web = true;
            }
            
            if (channel === NotificationChannel.EMAIL && settings.channels.email) {
              await this.sendEmailNotification(userId, notification);
              result.channels.email = true;
            }
            
            if (channel === NotificationChannel.PUSH && settings.channels.push) {
              await this.sendPushNotification(userId, notification);
              result.channels.push = true;
            }
          } catch (error) {
            result.errors![channel] = error as Error;
          }
        }
      }

      // 하나 이상의 채널로 전송되었으면 성공으로 간주
      result.success = !!(result.channels.web || result.channels.email || result.channels.push);
      
    } catch (error) {
      console.error('알림 전송 중 오류 발생:', error);
      result.errors!.general = error as Error;
    }

    return result;
  }

  /**
   * 웹 알림을 전송합니다.
   */
  private async sendWebNotification(userId: number, notification: Notification): Promise<void> {
    return webNotificationService.send({
      userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      data: notification.data
    });
  }

  /**
   * 이메일 알림을 전송합니다.
   */
  private async sendEmailNotification(userId: number, notification: Notification): Promise<void> {
    // 사용자 이메일 조회 (실제 구현에서는 DB에서 가져와야 함)
    const userEmail = await this.getUserEmail(userId);
    if (!userEmail) {
      throw new Error(`사용자 ID ${userId}의 이메일을 찾을 수 없습니다.`);
    }

    return emailService.send({
      to: userEmail,
      type: notification.type,
      data: {
        title: notification.title,
        message: notification.message,
        ...notification.data
      }
    });
  }

  /**
   * 푸시 알림을 전송합니다.
   */
  private async sendPushNotification(userId: number, notification: Notification): Promise<void> {
    // 사용자 기기 토큰 조회 (실제 구현에서는 DB에서 가져와야 함)
    const deviceTokens = await this.getUserDeviceTokens(userId);
    if (!deviceTokens || deviceTokens.length === 0) {
      throw new Error(`사용자 ID ${userId}의 기기 토큰을 찾을 수 없습니다.`);
    }

    return pushService.send({
      tokens: deviceTokens,
      title: notification.title,
      body: notification.message,
      data: notification.data
    });
  }

  /**
   * 사용자 알림 설정을 가져옵니다.
   */
  async getUserSettings(userId: number): Promise<UserNotificationSettings> {
    // 캐시된 설정이 있으면 반환
    if (this.userSettings.has(userId)) {
      return this.userSettings.get(userId)!;
    }

    // 실제 구현에서는 DB에서 사용자 설정을 가져와야 함
    // 여기서는 더미 데이터 반환
    const settings: UserNotificationSettings = {
      userId,
      channels: {
        web: true,
        email: true,
        push: true
      },
      types: {
        ...this.defaultSettings.types
      } as any
    };

    // 캐시에 저장
    this.userSettings.set(userId, settings);
    return settings;
  }

  /**
   * 사용자 알림 설정을 업데이트합니다.
   */
  async updateUserSettings(userId: number, settings: Partial<UserNotificationSettings>): Promise<UserNotificationSettings> {
    const currentSettings = await this.getUserSettings(userId);
    
    // 채널 설정 업데이트
    if (settings.channels) {
      Object.assign(currentSettings.channels, settings.channels);
    }
    
    // 알림 유형별 설정 업데이트
    if (settings.types) {
      for (const [type, typeSettings] of Object.entries(settings.types)) {
        currentSettings.types[type as NotificationType] = {
          ...currentSettings.types[type as NotificationType],
          ...typeSettings
        };
      }
    }
    
    // 캐시 업데이트
    this.userSettings.set(userId, currentSettings);
    
    // 실제 구현에서는 DB에 설정 저장
    
    return currentSettings;
  }

  /**
   * 사용자 이메일을 가져옵니다.
   */
  private async getUserEmail(userId: number): Promise<string | null> {
    // 실제 구현에서는 DB에서 사용자 이메일을 가져와야 함
    // 여기서는 더미 데이터 반환
    return `user${userId}@example.com`;
  }

  /**
   * 사용자의 기기 토큰을 가져옵니다.
   */
  private async getUserDeviceTokens(userId: number): Promise<string[]> {
    // 실제 구현에서는 DB에서 사용자 기기 토큰을 가져와야 함
    // 여기서는 더미 데이터 반환
    return [`device-token-${userId}`];
  }

  /**
   * 기기 토큰을 등록합니다.
   */
  async registerDeviceToken(userId: number, token: string, platform: 'android' | 'ios' | 'web'): Promise<boolean> {
    // 실제 구현에서는 DB에 기기 토큰 저장
    console.log(`사용자 ${userId}의 ${platform} 기기 토큰 등록: ${token}`);
    return true;
  }

  /**
   * 기기 토큰을 삭제합니다.
   */
  async unregisterDeviceToken(userId: number, token: string): Promise<boolean> {
    // 실제 구현에서는 DB에서 기기 토큰 삭제
    console.log(`사용자 ${userId}의 기기 토큰 삭제: ${token}`);
    return true;
  }

  /**
   * 역할별 알림을 전송합니다.
   */
  async sendToRole(role: string, notification: Omit<Notification, 'userId'>): Promise<NotificationResult[]> {
    // 실제 구현에서는 DB에서 해당 역할의 모든 사용자 ID를 가져와야 함
    const userIds = await this.getUserIdsByRole(role);
    
    const results: NotificationResult[] = [];
    for (const userId of userIds) {
      const result = await this.send({
        ...notification,
        userId
      });
      results.push(result);
    }
    
    return results;
  }

  /**
   * 역할별 사용자 ID를 가져옵니다.
   */
  private async getUserIdsByRole(role: string): Promise<number[]> {
    // 실제 구현에서는 DB에서 해당 역할의 모든 사용자 ID를 가져와야 함
    // 여기서는 더미 데이터 반환
    return [1, 2, 3];
  }
}

// 싱글톤 인스턴스 생성
export const notificationService = new NotificationService();