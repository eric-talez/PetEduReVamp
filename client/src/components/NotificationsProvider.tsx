import React from 'react';
import { NotificationProvider } from '@/hooks/use-notifications';

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
}