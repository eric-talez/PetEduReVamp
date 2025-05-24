import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// 알림 유형 정의
export enum NotificationType {
  SYSTEM = 'system',
  MESSAGE = 'message',
  COURSE = 'course',
  PAYMENT = 'payment',
  MARKETING = 'marketing',
  NOTEBOOK = 'notebook',
  REVIEW = 'review',
  COMMENT = 'comment',
  VIDEO_CALL = 'video_call',
  TRAINING = 'training'
}

// 알림 채널 정의
export enum NotificationChannel {
  WEB = 'web',
  EMAIL = 'email',
  PUSH = 'push'
}

// 알림 인터페이스
export interface Notification {
  id: string;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, any>;
  url?: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

// 알림 설정 인터페이스
export interface NotificationSettings {
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

// 컨텍스트 인터페이스
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  sendTestNotification: (type: NotificationType, channels: NotificationChannel[]) => Promise<void>;
  registerDeviceToken: (token: string, platform: 'android' | 'ios' | 'web') => Promise<void>;
}

// 기본 설정값
const defaultSettings: NotificationSettings = {
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
    },
    [NotificationType.NOTEBOOK]: {
      enabled: true,
      channels: [NotificationChannel.WEB, NotificationChannel.PUSH]
    },
    [NotificationType.REVIEW]: {
      enabled: true,
      channels: [NotificationChannel.WEB, NotificationChannel.EMAIL]
    },
    [NotificationType.COMMENT]: {
      enabled: true,
      channels: [NotificationChannel.WEB, NotificationChannel.PUSH]
    },
    [NotificationType.VIDEO_CALL]: {
      enabled: true,
      channels: [NotificationChannel.WEB, NotificationChannel.PUSH, NotificationChannel.EMAIL]
    },
    [NotificationType.TRAINING]: {
      enabled: true,
      channels: [NotificationChannel.WEB, NotificationChannel.PUSH]
    }
  }
};

// 컨텍스트 생성
const NotificationContext = createContext<NotificationContextType | null>(null);

// 프로바이더 컴포넌트
export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // 알림 목록 가져오기
  const fetchNotifications = async () => {
    if (!isAuthenticated || !user) return;

    try {
      setIsLoading(true);
      const response = await apiRequest('GET', '/api/notifications');
      const data = await response.json();
      
      // 날짜 객체로 변환
      const parsedNotifications = data.notifications.map((notification: any) => ({
        ...notification,
        createdAt: new Date(notification.createdAt),
        readAt: notification.readAt ? new Date(notification.readAt) : undefined
      }));
      
      setNotifications(parsedNotifications);
      setIsError(false);
      setError(null);
    } catch (err) {
      console.error('알림 목록 가져오기 오류:', err);
      setIsError(true);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // 읽지 않은 알림 개수 가져오기
  const fetchUnreadCount = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await apiRequest('GET', '/api/notifications/unread-count');
      const data = await response.json();
      setUnreadCount(data.count);
    } catch (err) {
      console.error('읽지 않은 알림 개수 가져오기 오류:', err);
    }
  };

  // 알림 설정 가져오기
  const fetchSettings = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await apiRequest('GET', '/api/notifications/settings');
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      console.error('알림 설정 가져오기 오류:', err);
      // 오류 시 기본값 사용
      setSettings(defaultSettings);
    }
  };

  // 모든 데이터 새로고침
  const refreshData = async () => {
    await Promise.all([
      fetchNotifications(),
      fetchUnreadCount(),
      settings === null && fetchSettings()
    ]);
  };

  // 인증 상태 변경 시 데이터 로드
  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    } else {
      // 비인증 상태에서는 데이터 초기화
      setNotifications([]);
      setUnreadCount(0);
      setSettings(null);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // WebSocket 연결 설정
  useEffect(() => {
    if (!isAuthenticated) return;

    // 웹소켓 연결 생성
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    // 웹소켓 이벤트 핸들러
    ws.onopen = () => {
      console.log('웹소켓 연결 성공');
      // 인증 메시지 전송
      ws.send(JSON.stringify({
        type: 'authenticate',
        data: {
          userId: 1, // 임시 사용자 ID
          token: 'dummy-token' // 실제 구현에서는 실제 인증 토큰 사용
        }
      }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'notification') {
          // 새 알림 수신
          const newNotification = {
            ...message.data,
            createdAt: new Date(message.data.createdAt)
          };
          
          // 알림 목록과 읽지 않은 알림 개수 업데이트
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // 토스트 알림 표시
          toast({
            title: newNotification.title,
            description: newNotification.message,
            variant: 'default'
          });
        } else if (message.type === 'auth_success') {
          console.log('웹소켓 인증 성공:', message.data);
        }
      } catch (err) {
        console.error('웹소켓 메시지 처리 오류:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('웹소켓 오류:', error);
    };

    ws.onclose = () => {
      console.log('웹소켓 연결 종료');
    };

    // 소켓 상태 저장
    setSocket(ws);

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      ws.close();
    };
  }, [isAuthenticated, user?.id]);

  // 알림을 읽음 상태로 표시
  const markAsRead = async (notificationId: string) => {
    if (!isAuthenticated || !user) return;

    try {
      await apiRequest('PATCH', `/api/notifications/${notificationId}/read`);
      
      // 알림 상태 업데이트
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true, readAt: new Date() } 
            : notification
        )
      );
      
      // 읽지 않은 알림 개수 감소
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('알림 읽음 처리 오류:', err);
      toast({
        title: '알림 읽음 처리 실패',
        description: '알림을 읽음 상태로 표시하는데 실패했습니다.',
        variant: 'destructive'
      });
    }
  };

  // 모든 알림을 읽음 상태로 표시
  const markAllAsRead = async () => {
    if (!isAuthenticated || !user) return;

    try {
      await apiRequest('PATCH', '/api/notifications/read-all');
      
      // 모든 알림 읽음 상태로 업데이트
      setNotifications(prev => 
        prev.map(notification => ({ 
          ...notification, 
          isRead: true, 
          readAt: notification.readAt || new Date() 
        }))
      );
      
      // 읽지 않은 알림 개수 초기화
      setUnreadCount(0);
      
      toast({
        title: '모든 알림 읽음 처리 완료',
        description: '모든 알림이 읽음 상태로 표시되었습니다.',
        variant: 'default'
      });
    } catch (err) {
      console.error('모든 알림 읽음 처리 오류:', err);
      toast({
        title: '모든 알림 읽음 처리 실패',
        description: '알림을 읽음 상태로 표시하는데 실패했습니다.',
        variant: 'destructive'
      });
    }
  };

  // 알림 데이터 새로고침
  const refreshNotifications = async () => {
    await refreshData();
  };

  // 알림 설정 업데이트
  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await apiRequest('PATCH', '/api/notifications/settings', newSettings);
      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      
      toast({
        title: '알림 설정 업데이트 완료',
        description: '알림 설정이 성공적으로 업데이트되었습니다.',
        variant: 'default'
      });
    } catch (err) {
      console.error('알림 설정 업데이트 오류:', err);
      toast({
        title: '알림 설정 업데이트 실패',
        description: '알림 설정을 업데이트하는데 실패했습니다.',
        variant: 'destructive'
      });
    }
  };

  // 테스트 알림 전송
  const sendTestNotification = async (type: NotificationType, channels: NotificationChannel[]) => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await apiRequest('POST', '/api/notifications/test', {
        type,
        channels
      });
      
      const result = await response.json();
      
      toast({
        title: '테스트 알림 발송 완료',
        description: `${channels.join(', ')} 채널로 테스트 알림이 발송되었습니다.`,
        variant: 'default'
      });
      
      // 웹 알림이 있으면 자동으로 새로고침
      if (channels.includes(NotificationChannel.WEB)) {
        setTimeout(refreshNotifications, 1000);
      }
      
      return result;
    } catch (err) {
      console.error('테스트 알림 발송 오류:', err);
      toast({
        title: '테스트 알림 발송 실패',
        description: '테스트 알림을 발송하는데 실패했습니다.',
        variant: 'destructive'
      });
    }
  };

  // 기기 토큰 등록 (모바일 푸시 알림용)
  const registerDeviceToken = async (token: string, platform: 'android' | 'ios' | 'web') => {
    if (!isAuthenticated || !user) return;

    try {
      await apiRequest('POST', '/api/notifications/device-token', {
        token,
        platform
      });
      
      console.log(`${platform} 기기 토큰 등록 성공:`, token);
    } catch (err) {
      console.error('기기 토큰 등록 오류:', err);
    }
  };

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    settings,
    isLoading,
    isError,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    updateSettings,
    sendTestNotification,
    registerDeviceToken
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

// 훅
export function useNotification() {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
}