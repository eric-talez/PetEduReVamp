import React from 'react';
import { NotificationProvider } from '@/hooks/useNotification';

// 단순화된 NotificationsProvider - 기존 컴포넌트와의 호환성을 위해 유지
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  // NotificationProvider는 이미 main.tsx에서 설정되었으므로, 여기서는 그냥 children을 반환
  return <>{children}</>;
}