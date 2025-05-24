import React from 'react';
import { useNotification, NotificationType, NotificationChannel } from './useNotification';

/**
 * 호환성 레이어: 알림 시스템 통합을 위한 래퍼 훅
 * 
 * 이 훅은 기존의 useNotifications 호출과 새로운 useNotification 시스템 사이의
 * 호환성을 제공하기 위한 것입니다.
 */
export function useNotifications() {
  // 기존 알림 시스템 훅 사용
  const notificationSystem = useNotification();
  
  // 호환성을 위한 래퍼 함수
  const sendNotification = async (
    title: string,
    message: string,
    type: NotificationType = NotificationType.SYSTEM
  ) => {
    // 새 알림 API로 메시지 전송
    try {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          message,
          type,
          channels: [NotificationChannel.WEB],
        }),
      });
    } catch (error) {
      console.error('알림 전송 실패:', error);
    }
  };

  // 테스트 알림 전송 함수
  const sendTestNotification = async (
    type: NotificationType = NotificationType.SYSTEM
  ) => {
    await notificationSystem.sendTestNotification(
      type,
      [NotificationChannel.WEB]
    );
  };

  return {
    ...notificationSystem,
    sendNotification,
    sendTestNotification,
  };
}