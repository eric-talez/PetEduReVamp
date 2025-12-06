import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useGlobalAuth } from './useGlobalAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// 메시지 타입 정의
export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
  isRead: boolean;
  messageType: string;
  conversationId: number;
  sender: {
    id: number;
    name: string;
    role: string;
    avatar?: string | null;
  };
}

// 대화 상대 타입 정의
export interface Conversation {
  id: number;
  participant: {
    id: number;
    name: string;
    role: string;
    avatar?: string | null;
  };
  lastMessage: Message | null;
  unreadCount: number;
  lastMessageAt: string;
  createdAt: string;
}

// 메시징 컨텍스트 타입 정의
interface MessagingContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isConnected: boolean;
  isLoadingMessages: boolean;
  isLoadingConversations: boolean;
  sendMessage: (receiverId: number, content: string) => Promise<void>;
  markAsRead: (messageId: number) => void;
  startConversation: (userId: number) => Promise<void>;
  setActiveConversation: (conversation: Conversation | null) => void;
  refreshConversations: () => void;
  refreshMessages: () => void;
  typingUsers: Record<number, { name: string; timestamp: Date }>;
  sendTypingIndicator: (receiverId: number) => void;
}

const MessagingContext = createContext<MessagingContextType | null>(null);

// 메시징 제공자 컴포넌트
export function MessagingProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, userName, userRole } = useGlobalAuth();
  const queryClient = useQueryClient();
  
  // 현재 사용자 ID (세션에서 가져오기 - 실제 구현에서는 세션에서 가져와야 함)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<number, { name: string; timestamp: Date }>>({});
  const wsRef = useRef<WebSocket | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 사용자 ID 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.user?.id) {
            setCurrentUserId(data.user.id);
          }
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
    };

    if (isAuthenticated) {
      fetchCurrentUser();
    }
  }, [isAuthenticated]);

  // 대화 목록 조회
  const { 
    data: conversationsData, 
    isLoading: isLoadingConversations,
    refetch: refreshConversations 
  } = useQuery({
    queryKey: ['/api/messages/conversations', currentUserId],
    enabled: isAuthenticated && !!currentUserId,
    refetchInterval: 10000, // 10초마다 폴링
    select: (data: any) => data?.data || []
  });

  const conversations: Conversation[] = conversationsData || [];

  // 메시지 목록 조회
  const { 
    data: messagesData, 
    isLoading: isLoadingMessages,
    refetch: refreshMessages 
  } = useQuery({
    queryKey: ['/api/messages/conversation', activeConversation?.id, 'messages'],
    enabled: isAuthenticated && !!activeConversation?.id && !!currentUserId,
    refetchInterval: 3000, // 3초마다 폴링 (활성 대화)
    queryFn: async () => {
      const response = await fetch(`/api/messages/conversations/${activeConversation?.id}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
    select: (data: any) => data?.data?.messages || []
  });

  const messages: Message[] = messagesData || [];

  // 메시지 전송 뮤테이션
  const sendMessageMutation = useMutation({
    mutationFn: async ({ receiverId, content }: { receiverId: number; content: string }) => {
      const response = await apiRequest('POST', '/api/messages/send', { 
        receiverId, 
        content, 
        userId: currentUserId 
      });
      return response.json();
    },
    onSuccess: () => {
      refreshMessages();
      refreshConversations();
    }
  });

  // 대화 생성 뮤테이션
  const createConversationMutation = useMutation({
    mutationFn: async (participantId: number) => {
      const response = await apiRequest('POST', '/api/messages/conversations', { 
        participantId, 
        userId: currentUserId 
      });
      return response.json();
    },
    onSuccess: (data: any) => {
      refreshConversations();
      if (data?.data) {
        setActiveConversation(data.data);
      }
    }
  });

  // WebSocket 연결
  useEffect(() => {
    if (!isAuthenticated || !currentUserId) {
      setIsConnected(false);
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WS] Connected');
        setIsConnected(true);
        
        // 인증 메시지 전송
        ws.send(JSON.stringify({
          type: 'authenticate',
          userId: currentUserId
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'authentication_success':
              console.log('[WS] Authenticated');
              break;
            case 'new_message':
              // 새 메시지 수신 시 목록 새로고침
              refreshMessages();
              refreshConversations();
              break;
            case 'typing_indicator':
              setTypingUsers(prev => ({
                ...prev,
                [data.userId]: { name: data.userName, timestamp: new Date() }
              }));
              // 3초 후 타이핑 표시 제거
              setTimeout(() => {
                setTypingUsers(prev => {
                  const newState = { ...prev };
                  delete newState[data.userId];
                  return newState;
                });
              }, 3000);
              break;
          }
        } catch (error) {
          console.error('[WS] Message parsing error:', error);
        }
      };

      ws.onclose = () => {
        console.log('[WS] Disconnected');
        setIsConnected(false);
      };

      ws.onerror = (error) => {
        console.error('[WS] Error:', error);
        setIsConnected(false);
      };

      return () => {
        ws.close();
        wsRef.current = null;
      };
    } catch (error) {
      console.error('[WS] Connection error:', error);
      setIsConnected(false);
    }
  }, [isAuthenticated, currentUserId, refreshMessages, refreshConversations]);

  // 메시지 전송 함수
  const sendMessage = useCallback(async (receiverId: number, content: string) => {
    if (!content.trim()) return;

    // WebSocket으로 전송 시도
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        receiverId,
        content: content.trim(),
        messageType: 'text'
      }));
    } else {
      // REST API로 전송
      await sendMessageMutation.mutateAsync({ receiverId, content: content.trim() });
    }
  }, [sendMessageMutation]);

  // 읽음 표시 함수
  const markAsRead = useCallback(async (messageId: number) => {
    try {
      await apiRequest('PUT', `/api/messages/${messageId}/read`, { userId: currentUserId });
    } catch (error) {
      console.error('읽음 표시 실패:', error);
    }
  }, [currentUserId]);

  // 대화 시작 함수
  const startConversation = useCallback(async (userId: number) => {
    // 이미 대화 목록에 있는지 확인
    const existingConversation = conversations.find(c => c.participant.id === userId);
    
    if (existingConversation) {
      setActiveConversation(existingConversation);
    } else {
      await createConversationMutation.mutateAsync(userId);
    }
  }, [conversations, createConversationMutation]);

  // 타이핑 표시 전송
  const sendTypingIndicator = useCallback((receiverId: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'typing_indicator',
        receiverId,
        userName: userName || '사용자'
      }));
    }
  }, [userName]);

  // 컨텍스트 값
  const contextValue: MessagingContextType = {
    conversations,
    activeConversation,
    messages,
    isConnected,
    isLoadingMessages,
    isLoadingConversations,
    sendMessage,
    markAsRead,
    startConversation,
    setActiveConversation,
    refreshConversations,
    refreshMessages,
    typingUsers,
    sendTypingIndicator
  };

  return (
    <MessagingContext.Provider value={contextValue}>
      {children}
    </MessagingContext.Provider>
  );
}

// 커스텀 훅
export function useMessaging() {
  const context = useContext(MessagingContext);

  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }

  return context;
}
