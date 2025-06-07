import { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface NotificationContextType {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

const NotificationContext = createContext<NotificationContextType>({
  isConnected: false,
  connectionStatus: 'disconnected'
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
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setConnectionStatus('disconnected');
      return;
    }

    // WebSocket 연결 설정
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log('[WebSocket] 연결 시도:', wsUrl);
    setConnectionStatus('connecting');

    // WebSocket 서버가 비활성화되어 있어 연결하지 않음
    console.log('[WebSocket] 연결 건너뜀: 서버에서 비활성화됨');
    setConnectionStatus('disconnected');
    return;
    
    // const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('[WebSocket] 연결 성공');
      setIsConnected(true);
      setConnectionStatus('connected');
      
      // 사용자 인증
      ws.send(JSON.stringify({
        type: 'auth',
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
          
          // 알림 목록 캐시 무효화
          queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
          queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
          
          // 토스트 알림 표시
          toast({
            title: notification.title,
            description: notification.message,
            duration: 5000,
          });
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
    <NotificationContext.Provider value={{ isConnected, connectionStatus }}>
      {children}
    </NotificationContext.Provider>
  );
}