import React from 'react';
import { NotificationProvider as NotificationContextProvider } from '@/hooks/useNotification';

// 알림 시스템 프로바이더 래퍼 컴포넌트
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  return (
    <NotificationContextProvider>
      {children}
    </NotificationContextProvider>
  );
}