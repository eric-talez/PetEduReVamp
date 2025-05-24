/**
 * Firebase Cloud Messaging(FCM)을 활용한 푸시 알림 서비스
 */
import * as admin from 'firebase-admin';
import { NotificationType } from './notification-types';

// Firebase 초기화
const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY;
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
let firebaseInitialized = false;

// Firebase Admin SDK 초기화 함수
function initFirebase() {
  if (firebaseInitialized) return;
  
  try {
    if (FCM_SERVER_KEY && FIREBASE_PROJECT_ID) {
      // Firebase Admin SDK 초기화
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // private_key 환경 변수에서 개행 문자를 처리
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        }),
        databaseURL: `https://${FIREBASE_PROJECT_ID}.firebaseio.com`
      });
      
      firebaseInitialized = true;
      console.log('Firebase Admin SDK 초기화 성공');
    } else {
      console.warn('FCM 서버 키 또는 Firebase 프로젝트 ID가 설정되지 않았습니다. 푸시 알림이 비활성화됩니다.');
    }
  } catch (error) {
    console.error('Firebase Admin SDK 초기화 오류:', error);
  }
}

// 푸시 알림 옵션 인터페이스
export interface PushNotificationOptions {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  badge?: number;
  sound?: string;
  clickAction?: string;
  ttl?: number; // time to live (초)
  priority?: 'high' | 'normal';
  androidChannelId?: string;
}

// 푸시 서비스 클래스
class PushNotificationService {
  private isEnabled: boolean;
  
  constructor() {
    this.isEnabled = !!FCM_SERVER_KEY && !!FIREBASE_PROJECT_ID;
    
    // Firebase 초기화 시도
    if (this.isEnabled) {
      initFirebase();
    }
  }

  /**
   * 푸시 알림을 발송합니다.
   * @param options 푸시 알림 옵션
   */
  async send(options: PushNotificationOptions): Promise<void> {
    if (!this.isEnabled || !firebaseInitialized) {
      console.log('푸시 알림 발송 건너뜀 (FCM 설정 없음):', options);
      return;
    }

    try {
      // 토큰이 없으면 발송하지 않음
      if (!options.tokens || options.tokens.length === 0) {
        console.warn('푸시 알림 발송 건너뜀 (토큰 없음)');
        return;
      }

      // 메시지 구성
      const message: admin.messaging.MulticastMessage = {
        tokens: options.tokens,
        notification: {
          title: options.title,
          body: options.body,
          imageUrl: options.imageUrl
        },
        android: {
          priority: options.priority === 'high' ? 'high' : 'normal',
          ttl: options.ttl ? options.ttl * 1000 : undefined, // FCM은 밀리초 단위 사용
          notification: {
            channelId: options.androidChannelId || 'default',
            sound: options.sound || 'default',
            clickAction: options.clickAction
          }
        },
        apns: {
          payload: {
            aps: {
              badge: options.badge,
              sound: options.sound || 'default',
              'content-available': 1
            }
          }
        },
        data: options.data || {}
      };

      // 푸시 알림 발송
      const response = await admin.messaging().sendMulticast(message);
      
      // 결과 로깅
      console.log(`푸시 알림 발송 결과: 성공 ${response.successCount}건, 실패 ${response.failureCount}건`);
      
      // 실패한 토큰 처리
      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(options.tokens[idx]);
            console.error(`토큰 ${options.tokens[idx]} 발송 실패: ${resp.error}`);
            
            // 등록되지 않은 토큰인 경우 삭제 처리
            if (resp.error?.code === 'messaging/registration-token-not-registered') {
              // 이 부분에서 DB에서 해당 토큰 삭제 로직 구현 필요
              console.log(`유효하지 않은 토큰 감지: ${options.tokens[idx]}`);
            }
          }
        });
      }
    } catch (error) {
      console.error('푸시 알림 발송 실패:', error);
      throw new Error(`푸시 알림 발송 실패: ${(error as Error).message}`);
    }
  }

  /**
   * 특정 주제로 푸시 알림을 발송합니다.
   * @param topic 주제
   * @param options 푸시 알림 옵션 (tokens 제외)
   */
  async sendToTopic(topic: string, options: Omit<PushNotificationOptions, 'tokens'>): Promise<void> {
    if (!this.isEnabled || !firebaseInitialized) {
      console.log(`주제 ${topic}로 푸시 알림 발송 건너뜀 (FCM 설정 없음):`, options);
      return;
    }

    try {
      // 메시지 구성
      const message: admin.messaging.Message = {
        topic,
        notification: {
          title: options.title,
          body: options.body,
          imageUrl: options.imageUrl
        },
        android: {
          priority: options.priority === 'high' ? 'high' : 'normal',
          ttl: options.ttl ? options.ttl * 1000 : undefined,
          notification: {
            channelId: options.androidChannelId || 'default',
            sound: options.sound || 'default',
            clickAction: options.clickAction
          }
        },
        apns: {
          payload: {
            aps: {
              badge: options.badge,
              sound: options.sound || 'default',
              'content-available': 1
            }
          }
        },
        data: options.data || {}
      };

      // 푸시 알림 발송
      const response = await admin.messaging().send(message);
      console.log(`주제 ${topic}로 푸시 알림 발송 성공: ${response}`);
    } catch (error) {
      console.error(`주제 ${topic}로 푸시 알림 발송 실패:`, error);
      throw new Error(`주제 ${topic}로 푸시 알림 발송 실패: ${(error as Error).message}`);
    }
  }

  /**
   * 기기를 특정 주제에 구독시킵니다.
   * @param tokens 기기 토큰 배열
   * @param topic 주제
   */
  async subscribeToTopic(tokens: string[], topic: string): Promise<void> {
    if (!this.isEnabled || !firebaseInitialized) {
      console.log(`주제 ${topic} 구독 건너뜀 (FCM 설정 없음):`, tokens);
      return;
    }

    try {
      const response = await admin.messaging().subscribeToTopic(tokens, topic);
      console.log(`주제 ${topic} 구독 결과: 성공 ${response.successCount}건, 실패 ${response.failureCount}건`);
    } catch (error) {
      console.error(`주제 ${topic} 구독 실패:`, error);
      throw new Error(`주제 ${topic} 구독 실패: ${(error as Error).message}`);
    }
  }

  /**
   * 기기의 주제 구독을 해제합니다.
   * @param tokens 기기 토큰 배열
   * @param topic 주제
   */
  async unsubscribeFromTopic(tokens: string[], topic: string): Promise<void> {
    if (!this.isEnabled || !firebaseInitialized) {
      console.log(`주제 ${topic} 구독 해제 건너뜀 (FCM 설정 없음):`, tokens);
      return;
    }

    try {
      const response = await admin.messaging().unsubscribeFromTopic(tokens, topic);
      console.log(`주제 ${topic} 구독 해제 결과: 성공 ${response.successCount}건, 실패 ${response.failureCount}건`);
    } catch (error) {
      console.error(`주제 ${topic} 구독 해제 실패:`, error);
      throw new Error(`주제 ${topic} 구독 해제 실패: ${(error as Error).message}`);
    }
  }

  /**
   * 알림 유형에 따른 기본 옵션을 가져옵니다.
   * @param type 알림 유형
   * @param title 제목
   * @param body 내용
   */
  getOptionsForType(type: NotificationType, title: string, body: string): Partial<PushNotificationOptions> {
    const baseOptions = {
      title,
      body,
      priority: 'normal' as const,
      sound: 'default'
    };

    switch (type) {
      case NotificationType.MESSAGE:
        return {
          ...baseOptions,
          androidChannelId: 'messages',
          priority: 'high',
          badge: 1,
          sound: 'notification_message',
          clickAction: 'OPEN_MESSAGE_ACTIVITY'
        };
      
      case NotificationType.VIDEO_CALL:
        return {
          ...baseOptions,
          androidChannelId: 'calls',
          priority: 'high',
          sound: 'notification_call',
          clickAction: 'OPEN_CALL_ACTIVITY'
        };
      
      case NotificationType.PAYMENT:
        return {
          ...baseOptions,
          androidChannelId: 'payments',
          priority: 'high',
          sound: 'notification_payment',
          clickAction: 'OPEN_PAYMENT_ACTIVITY'
        };
      
      case NotificationType.SYSTEM:
        return {
          ...baseOptions,
          androidChannelId: 'system',
          priority: 'high'
        };
      
      default:
        return baseOptions;
    }
  }
}

// 싱글톤 인스턴스 생성
export const pushService = new PushNotificationService();