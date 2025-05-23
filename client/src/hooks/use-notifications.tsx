import { useCallback, useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

// 알림 타입 정의
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  linkTo?: string;
  sender?: {
    id: number;
    name: string;
    avatar?: string;
  };
  metadata?: any;
}

// 메시지 타입 정의
interface Message {
  id: string;
  sender: {
    id: number;
    name: string;
    role: string;
    avatar?: string | null;
  };
  receiver: {
    id: number;
    name: string;
    role?: string;
    avatar?: string | null;
  };
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'notification';
  metadata?: any;
}

// 컨텍스트 타입 정의
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: Error | null;
  connected: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  sendNotification: (userId: number, title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error' | 'system', linkTo?: string, metadata?: any) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

// WebSocket 상태를 위한 타입
type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

/**
 * 알림 제공자 컴포넌트
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  // 사용자 정보 가져오기
  const { data: user } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false
  });
  
  // 상태
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [wsStatus, setWsStatus] = useState<WebSocketStatus>('disconnected');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  
  // 읽지 않은 알림 수 계산
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  /**
   * WebSocket 연결 설정
   */
  const setupWebSocket = useCallback(() => {
    if (!user) {
      return;
    }
    
    try {
      setWsStatus('connecting');
      
      // WebSocket URL 설정 (http/https에 따라 ws/wss 프로토콜 사용)
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      console.log('Connecting to WebSocket server at:', wsUrl);
      
      const newSocket = new WebSocket(wsUrl);
      
      // 연결 성공 핸들러
      newSocket.onopen = () => {
        console.log('WebSocket connection established');
        setWsStatus('connected');
        setReconnectAttempts(0);
        
        // 인증 메시지 전송
        newSocket.send(JSON.stringify({
          type: 'authenticate',
          userId: user.id,
          token: 'dummy-token', // 실제 구현에서는 인증 토큰 사용
          reconnect: reconnectAttempts > 0
        }));
      };
      
      // 메시지 수신 핸들러
      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      // 오류 핸들러
      newSocket.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError(new Error('WebSocket connection error'));
      };
      
      // 연결 종료 핸들러
      newSocket.onclose = () => {
        console.log('WebSocket connection closed');
        setWsStatus('disconnected');
        setSocket(null);
        
        // 재연결 시도
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          console.log(`Attempting to reconnect (${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})...`);
          setWsStatus('reconnecting');
          setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            setupWebSocket();
          }, Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)); // 지수 백오프 (최대 30초)
        } else {
          setError(new Error('Failed to connect to notification service after multiple attempts'));
          toast({
            title: '알림 서비스 연결 실패',
            description: '알림 서비스에 연결할 수 없습니다. 페이지를 새로고침해 보세요.',
            variant: 'destructive'
          });
        }
      };
      
      setSocket(newSocket);
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setError(error instanceof Error ? error : new Error('Failed to setup WebSocket connection'));
      setWsStatus('disconnected');
    }
  }, [user, reconnectAttempts, toast]);
  
  /**
   * WebSocket 메시지 처리
   */
  const handleWebSocketMessage = useCallback((data: any) => {
    console.log('Received WebSocket message:', data);
    
    switch (data.type) {
      case 'authentication_success':
        console.log('Authentication successful:', data.user);
        setLoading(false);
        break;
        
      case 'error':
        console.error('WebSocket error message:', data.message);
        setError(new Error(data.message));
        break;
        
      case 'new_message':
        handleNewMessage(data.message);
        break;
        
      case 'system_notification':
        handleSystemNotification(data.message);
        break;
        
      case 'unread_messages':
        handleUnreadMessages(data.messages);
        break;
        
      default:
        console.log('Unhandled WebSocket message type:', data.type);
    }
  }, []);
  
  /**
   * 새 메시지 처리
   */
  const handleNewMessage = useCallback((message: Message) => {
    if (message.type === 'notification') {
      // 알림 메시지를 알림 목록에 추가
      const notification: Notification = {
        id: message.id,
        title: `${message.sender.name}님의 메시지`,
        message: message.content,
        timestamp: new Date(message.timestamp),
        isRead: false,
        type: 'info',
        sender: {
          id: message.sender.id,
          name: message.sender.name,
          avatar: message.sender.avatar || undefined
        },
        linkTo: `/messages/${message.sender.id}`,
        metadata: message.metadata
      };
      
      setNotifications(prev => [notification, ...prev]);
      
      // 토스트 알림 표시
      toast({
        title: notification.title,
        description: notification.message.length > 50 ? `${notification.message.substring(0, 50)}...` : notification.message,
        duration: 5000
      });
    }
  }, [toast]);
  
  /**
   * 시스템 알림 처리
   */
  const handleSystemNotification = useCallback((message: Message) => {
    const notification: Notification = {
      id: message.id,
      title: '시스템 알림',
      message: message.content,
      timestamp: new Date(message.timestamp),
      isRead: false,
      type: 'system',
      linkTo: message.metadata?.linkTo,
      metadata: message.metadata
    };
    
    setNotifications(prev => [notification, ...prev]);
    
    // 토스트 알림 표시
    toast({
      title: notification.title,
      description: notification.message.length > 50 ? `${notification.message.substring(0, 50)}...` : notification.message,
      duration: 5000
    });
  }, [toast]);
  
  /**
   * 읽지 않은 메시지 처리
   */
  const handleUnreadMessages = useCallback((messages: Message[]) => {
    const newNotifications = messages.map(message => ({
      id: message.id,
      title: `${message.sender.name}님의 메시지`,
      message: message.content,
      timestamp: new Date(message.timestamp),
      isRead: false,
      type: 'info' as const,
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        avatar: message.sender.avatar || undefined
      },
      linkTo: `/messages/${message.sender.id}`,
      metadata: message.metadata
    }));
    
    setNotifications(prev => [...newNotifications, ...prev]);
    
    if (newNotifications.length > 0) {
      toast({
        title: '읽지 않은 메시지',
        description: `${newNotifications.length}개의 읽지 않은 메시지가 있습니다.`,
        duration: 5000
      });
    }
  }, [toast]);
  
  /**
   * 초기 알림 데이터 로드
   */
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    // 기존 알림 데이터 로드
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        // 더미 데이터 (실제 구현에서는 서버 API 호출)
        const dummyNotifications: Notification[] = [
          {
            id: 'notification_1',
            title: '프로필 업데이트',
            message: '프로필이 성공적으로 업데이트되었습니다.',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
            isRead: false,
            type: 'success'
          },
          {
            id: 'notification_2',
            title: '코스 업데이트',
            message: '구독 중인 코스에 새로운 레슨이 업데이트되었습니다.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
            isRead: true,
            type: 'info',
            linkTo: '/courses/3'
          },
          {
            id: 'notification_3',
            title: '시스템 알림',
            message: '서비스 점검으로 인해 내일 오전 2시부터 4시까지 서비스 이용이 제한될 수 있습니다.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12시간 전
            isRead: false,
            type: 'warning'
          }
        ];
        
        setNotifications(dummyNotifications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch notifications'));
        setLoading(false);
      }
    };
    
    fetchNotifications();
    setupWebSocket();
    
    return () => {
      // 연결 정리
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [user, setupWebSocket]);
  
  /**
   * 알림을 읽음으로 표시
   */
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  }, []);
  
  /**
   * 모든 알림을 읽음으로 표시
   */
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);
  
  /**
   * 알림 삭제
   */
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  /**
   * 모든 알림 삭제
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  /**
   * 알림 전송
   */
  const sendNotification = useCallback((
    userId: number, 
    title: string, 
    message: string, 
    type: 'info' | 'success' | 'warning' | 'error' | 'system' = 'info',
    linkTo?: string,
    metadata?: any
  ) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return;
    }
    
    socket.send(JSON.stringify({
      type: 'message',
      receiverId: userId,
      content: message,
      type: 'notification',
      metadata: {
        title,
        type,
        linkTo,
        ...metadata
      }
    }));
    
    console.log(`Notification sent to user ${userId}`);
  }, [socket]);
  
  // 컨텍스트 값
  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    error,
    connected: wsStatus === 'connected',
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    sendNotification
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * 알림 훅
 */
export function useNotifications() {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
}