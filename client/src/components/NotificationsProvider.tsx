import React, { useEffect } from 'react';
import { NotificationProvider } from '@/hooks/use-notifications';
import { useAuth } from '@/SimpleApp';

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  
  // 인증 상태 로깅
  useEffect(() => {
    console.log('NotificationsProvider - Auth Status:', auth.isAuthenticated, auth.userRole);
  }, [auth.isAuthenticated, auth.userRole]);
  
  // NotificationProvider 내에서 useAuth를 사용할 수 있도록 AuthProvider가 상위에 있어야 함
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
}