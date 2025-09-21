
/**
 * @deprecated This provider has been deprecated in favor of the canonical use-notifications system
 * 
 * DEPRECATED: This NotificationProvider is being replaced by the use-notifications.tsx system
 * which provides more comprehensive WebSocket handling, better state management, enhanced TypeScript
 * interfaces, and integration with NotificationCenter for commercial deployment consistency.
 * 
 * Please use @/hooks/use-notifications and its NotificationProvider instead.
 * This file will be removed in a future version.
 * 
 * Migration: Replace useNotification from this provider with useNotifications from use-notifications
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface NotificationContextType {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  unreadCount: number;
  sendTestNotification: (data: { title: string; message: string; type?: string }) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  isConnected: false,
  connectionStatus: 'disconnected',
  unreadCount: 0,
  sendTestNotification: () => {}
});

export const useNotification = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: React.ReactNode;
  userId?: number;
}

export function NotificationProvider({ children, userId }: NotificationProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [unreadCount, setUnreadCount] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 읽지 않은 알림 수 조회
  const fetchUnreadCount = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/notifications/unread-count');
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('[Notification] 읽지 않은 알림 수 조회 실패:', error);
    }
  };

  // 테스트 알림 전송
  const sendTestNotification = async (data: { title: string; message: string; type?: string }) => {
    try {
      const response = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: '테스트 알림 전송됨',
          description: '알림이 성공적으로 전송되었습니다',
        });
      }
    } catch (error) {
      toast({
        title: '알림 전송 실패',
        description: '알림 전송 중 오류가 발생했습니다',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (!userId) {
      setConnectionStatus('disconnected');
      return;
    }

    // 초기 읽지 않은 알림 수 조회
    fetchUnreadCount();

    // WebSocket 연결 설정
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log('[WebSocket] 연결 시도:', wsUrl);
    setConnectionStatus('connecting');

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('[WebSocket] 연결 성공');
      setIsConnected(true);
      setConnectionStatus('connected');
      
      // 사용자 인증
      ws.send(JSON.stringify({
        type: 'authenticate',
        userId: userId
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[WebSocket] 메시지 수신:', data);

        if (data.type === 'auth_success') {
          console.log('[WebSocket] 인증 완료');
        } else if (data.type === 'notification') {
          // 새 알림 수신
          const notification = data.data;
          
          // 읽지 않은 알림 수 업데이트
          setUnreadCount(prev => prev + 1);
          
          // 알림 목록 캐시 무효화
          queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
          
          // 토스트 알림 표시
          toast({
            title: notification.title,
            description: notification.message,
            duration: 5000,
          });
        } else if (data.type === 'notification_read') {
          // 알림 읽음 처리
          setUnreadCount(prev => Math.max(0, prev - 1));
          queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
        } else if (data.type === 'all_notifications_read') {
          // 모든 알림 읽음 처리
          setUnreadCount(0);
          queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
        }
      } catch (error) {
        console.error('[WebSocket] 메시지 파싱 오류:', error);
      }
    };

    ws.onclose = () => {
      console.log('[WebSocket] 연결 종료');
      setIsConnected(false);
      setConnectionStatus('disconnected');
    };

    ws.onerror = (error) => {
      console.error('[WebSocket] 연결 오류:', error);
      setIsConnected(false);
      setConnectionStatus('error');
    };

    setSocket(ws);

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [userId, queryClient, toast]);

  return (
    <NotificationContext.Provider value={{ 
      isConnected, 
      connectionStatus, 
      unreadCount,
      sendTestNotification 
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
