import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useGlobalAuth } from './useGlobalAuth';

// 메시지 타입 정의
export interface Message {
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
  };
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'notification';
  metadata?: any;
}

// 대화 상대 타입 정의
export interface Conversation {
  userId: number;
  userName: string;
  userRole: string;
  userAvatar?: string | null;
  lastMessage?: Message | null;
  unreadCount: number;
  isOnline: boolean;
}

// 메시징 컨텍스트 타입 정의
interface MessagingContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isConnected: boolean;
  isLoadingMessages: boolean;
  sendMessage: (receiverId: number, content: string, type?: 'text' | 'image') => void;
  markAsRead: (messageId: string) => void;
  startConversation: (userId: number) => void;
  getMessages: (conversationId: number) => Message[];
  setActiveConversation: (conversation: Conversation | null) => void;
}

const MessagingContext = createContext<MessagingContextType | null>(null);

// 메시징 제공자 컴포넌트
export function MessagingProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, userName, userRole } = useGlobalAuth();
  // userName을 user 정보로 활용
  const user = isAuthenticated ? { id: 1, name: userName || '사용자', role: userRole || 'user' } : null;
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messageHistoryRef = useRef<Record<string, Message[]>>({});
  
  // WebSocket 연결 설정
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsConnected(false);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }
    
    // 이미 연결된 경우 스킵
    if (wsRef.current && isConnected) return;
    
    // WebSocket 프로토콜 결정 (HTTPS인 경우 WSS)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log('WebSocket 연결 시도:', wsUrl);
    
    wsRef.current = new WebSocket(wsUrl);
    
    // 연결 이벤트 핸들러
    wsRef.current.onopen = () => {
      console.log('WebSocket 연결 성공');
      setIsConnected(true);
      
      // 인증 메시지 전송
      if (wsRef.current && user) {
        wsRef.current.send(JSON.stringify({
          type: 'authenticate',
          userId: user.id,
          token: 'dummy-token' // 실제 구현에서는 JWT 토큰 사용
        }));
      }
    };
    
    // 메시지 수신 핸들러
    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleIncomingMessage(data);
      } catch (error) {
        console.error('WebSocket 메시지 처리 오류:', error);
      }
    };
    
    // 연결 종료 핸들러
    wsRef.current.onclose = () => {
      console.log('WebSocket 연결 종료');
      setIsConnected(false);
    };
    
    // 오류 핸들러
    wsRef.current.onerror = (error) => {
      console.error('WebSocket 오류:', error);
      setIsConnected(false);
    };
    
    // 컴포넌트 언마운트시 연결 종료
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isAuthenticated, user]);
  
  // 수신 메시지 처리 함수
  const handleIncomingMessage = (data: any) => {
    switch (data.type) {
      case 'authentication_success':
        console.log('인증 성공:', data.user);
        break;
        
      case 'new_message':
        handleNewMessage(data.message);
        break;
        
      case 'message_sent':
        handleSentMessage(data.message);
        break;
        
      case 'unread_messages':
        handleUnreadMessages(data.messages);
        break;
        
      case 'user_status':
        handleUserStatusChange(data.userId, data.status);
        break;
        
      case 'read_receipt':
        handleReadReceipt(data.messageId);
        break;
        
      case 'typing_indicator':
        // 필요하면 타이핑 표시기 구현
        break;
        
      case 'system_notification':
        handleNewMessage(data.message);
        break;
        
      case 'error':
        console.error('WebSocket 에러 메시지:', data.message);
        break;
    }
  };
  
  // 새 메시지 처리
  const handleNewMessage = (message: Message) => {
    if (!message || !message.id) return;
    
    // 타임스탬프를 Date 객체로 변환
    message.timestamp = new Date(message.timestamp);
    
    // 메시지 이력에 추가
    const conversationId = getConversationId(message.sender.id, message.receiver.id);
    if (!messageHistoryRef.current[conversationId]) {
      messageHistoryRef.current[conversationId] = [];
    }
    messageHistoryRef.current[conversationId].push(message);
    
    // 현재 활성화된 대화에 해당하는 메시지인 경우 메시지 목록 업데이트
    if (activeConversation && 
        (activeConversation.userId === message.sender.id || 
         activeConversation.userId === message.receiver.id)) {
      setMessages(prev => [...prev, message]);
    }
    
    // 대화 목록 업데이트
    updateConversation(message);
  };
  
  // 대화 목록 업데이트
  const updateConversation = (message: Message) => {
    // 현재 사용자 ID
    const currentUserId = user?.id;
    if (!currentUserId) return;
    
    // 상대방 정보 (발신자 또는 수신자)
    const isReceiver = message.sender.id !== currentUserId;
    const otherParty = isReceiver ? message.sender : message.receiver;
    
    setConversations(prev => {
      // 이미 대화 목록에 있는지 확인
      const existingConversationIndex = prev.findIndex(c => c.userId === otherParty.id);
      
      if (existingConversationIndex !== -1) {
        // 기존 대화 업데이트
        const updatedConversations = [...prev];
        const existingConversation = {...updatedConversations[existingConversationIndex]};
        
        existingConversation.lastMessage = message;
        
        // 새 메시지가 읽지 않은 것이고, 현재 활성화된 대화가 아닌 경우 읽지 않은 메시지 카운트 증가
        if (!message.isRead && isReceiver && 
            (!activeConversation || activeConversation.userId !== otherParty.id)) {
          existingConversation.unreadCount += 1;
        }
        
        updatedConversations[existingConversationIndex] = existingConversation;
        return updatedConversations;
      } else {
        // 새로운 대화 추가
        return [...prev, {
          userId: otherParty.id,
          userName: otherParty.name,
          userRole: otherParty.role,
          userAvatar: otherParty.avatar,
          lastMessage: message,
          unreadCount: isReceiver ? 1 : 0,
          isOnline: false // 온라인 상태는 나중에 업데이트
        }];
      }
    });
  };
  
  // 발신 메시지 처리
  const handleSentMessage = (message: Message) => {
    if (!message || !message.id) return;
    
    // 타임스탬프를 Date 객체로 변환
    message.timestamp = new Date(message.timestamp);
    
    // 메시지 이력에 추가
    const conversationId = getConversationId(message.sender.id, message.receiver.id);
    if (!messageHistoryRef.current[conversationId]) {
      messageHistoryRef.current[conversationId] = [];
    }
    messageHistoryRef.current[conversationId].push(message);
    
    // 현재 활성화된 대화에 해당하는 메시지인 경우 메시지 목록 업데이트
    if (activeConversation && activeConversation.userId === message.receiver.id) {
      setMessages(prev => [...prev, message]);
    }
    
    // 대화 목록 업데이트
    updateConversation(message);
  };
  
  // 읽지 않은 메시지 처리
  const handleUnreadMessages = (unreadMessages: Message[]) => {
    if (!unreadMessages || !unreadMessages.length) return;
    
    // 각 메시지 처리
    unreadMessages.forEach(message => {
      // 타임스탬프를 Date 객체로 변환
      message.timestamp = new Date(message.timestamp);
      
      // 메시지 이력에 추가
      const conversationId = getConversationId(message.sender.id, message.receiver.id);
      if (!messageHistoryRef.current[conversationId]) {
        messageHistoryRef.current[conversationId] = [];
      }
      messageHistoryRef.current[conversationId].push(message);
      
      // 대화 목록 업데이트
      updateConversation(message);
    });
  };
  
  // 사용자 상태 변경 처리
  const handleUserStatusChange = (userId: number, status: 'online' | 'offline') => {
    setConversations(prev => 
      prev.map(conversation => 
        conversation.userId === userId
          ? { ...conversation, isOnline: status === 'online' }
          : conversation
      )
    );
  };
  
  // 읽음 확인 처리
  const handleReadReceipt = (messageId: string) => {
    // 메시지 이력에서 해당 메시지 찾아 읽음 표시
    Object.keys(messageHistoryRef.current).forEach(conversationId => {
      const conversationMessages = messageHistoryRef.current[conversationId];
      const messageIndex = conversationMessages.findIndex(m => m.id === messageId);
      
      if (messageIndex !== -1) {
        conversationMessages[messageIndex].isRead = true;
        
        // 활성화된 대화의 메시지인 경우 메시지 목록 업데이트
        if (activeConversation) {
          const [id1, id2] = parseConversationId(conversationId);
          if (id1 === activeConversation.userId || id2 === activeConversation.userId) {
            setMessages(prev => 
              prev.map(message => 
                message.id === messageId
                  ? { ...message, isRead: true }
                  : message
              )
            );
          }
        }
      }
    });
  };
  
  // 메시지 전송 함수
  const sendMessage = useCallback((receiverId: number, content: string, type: 'text' | 'image' = 'text') => {
    if (!wsRef.current || !isConnected || !user) return;
    
    wsRef.current.send(JSON.stringify({
      type: 'message',
      receiverId,
      content,
      messageType: type
    }));
  }, [isConnected, user]);
  
  // 읽음 표시 함수
  const markAsRead = useCallback((messageId: string) => {
    if (!wsRef.current || !isConnected || !user || !activeConversation) return;
    
    wsRef.current.send(JSON.stringify({
      type: 'read_receipt',
      messageId,
      senderId: activeConversation.userId
    }));
  }, [isConnected, user, activeConversation]);
  
  // 대화 시작 함수
  const startConversation = useCallback((userId: number) => {
    // 이미 대화 목록에 있는지 확인
    const existingConversation = conversations.find(c => c.userId === userId);
    
    if (existingConversation) {
      setActiveConversation(existingConversation);
    } else {
      // 대화 상대 정보를 가져오는 API 호출 (실제 구현 필요)
      // 예시 코드
      fetch(`/api/users/${userId}`)
        .then(res => res.json())
        .then(userData => {
          const newConversation: Conversation = {
            userId: userData.id,
            userName: userData.name,
            userRole: userData.role,
            userAvatar: userData.avatar,
            unreadCount: 0,
            isOnline: false // 온라인 상태는 나중에 업데이트
          };
          
          setConversations(prev => [...prev, newConversation]);
          setActiveConversation(newConversation);
        })
        .catch(error => {
          console.error('대화 상대 정보 가져오기 오류:', error);
        });
    }
  }, [conversations]);
  
  // 대화 메시지 가져오기 함수
  const getMessages = useCallback((conversationUserId: number) => {
    setIsLoadingMessages(true);
    
    if (!user) {
      setIsLoadingMessages(false);
      return [];
    }
    
    const conversationId = getConversationId(user.id, conversationUserId);
    const conversationMessages = messageHistoryRef.current[conversationId] || [];
    
    // 메시지를 타임스탬프 순으로 정렬
    const sortedMessages = [...conversationMessages].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    setMessages(sortedMessages);
    setIsLoadingMessages(false);
    
    return sortedMessages;
  }, [user]);
  
  // 대화 ID 생성 (작은 ID가 항상 앞에 오도록)
  const getConversationId = (id1: number, id2: number): string => {
    return id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
  };
  
  // 대화 ID 파싱
  const parseConversationId = (conversationId: string): [number, number] => {
    const [id1Str, id2Str] = conversationId.split('-');
    return [parseInt(id1Str), parseInt(id2Str)];
  };
  
  // 컨텍스트 값
  const contextValue: MessagingContextType = {
    conversations,
    activeConversation,
    messages,
    isConnected,
    isLoadingMessages,
    sendMessage,
    markAsRead,
    startConversation,
    getMessages,
    setActiveConversation
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