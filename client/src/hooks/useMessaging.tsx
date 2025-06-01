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
    role?: string;
    avatar?: string | null;
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
  typingUsers: Record<number, { name: string; timestamp: Date }>;
  sendMessage: (receiverId: number, content: string, type?: 'text' | 'image') => void;
  markAsRead: (messageId: string) => void;
  startConversation: (userId: number) => void;
  getMessages: (conversationId: number) => Message[];
  setActiveConversation: (conversation: Conversation | null) => void;
  sendTypingIndicator: (receiverId: number) => void;
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
  const [typingUsers, setTypingUsers] = useState<Record<number, { name: string; timestamp: Date }>>({});
  const messageHistoryRef = useRef<Record<string, Message[]>>({});
  const typingTimeoutRef = useRef<Record<number, NodeJS.Timeout>>({});
  
  // 재연결 시도 횟수 및 타이머 참조
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_RECONNECT_ATTEMPTS = 3;
  const RECONNECT_INTERVAL = 10000; // 10초마다 재시도 (더 긴 간격)
  
  // WebSocket 연결 함수
  const connectWebSocket = useCallback((isReconnect = false) => {
    if (!user || !isAuthenticated) return false;
    
    // WebSocket 프로토콜 결정 (HTTPS인 경우 WSS)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log(`WebSocket ${isReconnect ? '재' : ''}연결 시도:`, wsUrl);
    
    // 기존 연결이 있으면 닫기
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (err) {
        console.error('이전 WebSocket 연결 종료 중 오류:', err);
      }
    }
    
    // 새 연결 생성
    wsRef.current = new WebSocket(wsUrl);
    
    // 연결 이벤트 핸들러
    wsRef.current.onopen = () => {
      console.log('WebSocket 연결 성공');
      setIsConnected(true);
      reconnectAttemptsRef.current = 0; // 연결 성공 시 재시도 카운터 초기화
      
      // 인증 메시지 전송
      if (wsRef.current && user) {
        wsRef.current.send(JSON.stringify({
          type: 'authenticate',
          userId: user.id,
          token: 'dummy-token', // 실제 구현에서는 JWT 토큰 사용
          reconnect: isReconnect // 재연결 여부 전달
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
    wsRef.current.onclose = (event) => {
      console.log(`WebSocket 연결 종료: ${event.code} ${event.reason}`);
      setIsConnected(false);
      
      // 비정상적인 종료인 경우에만 재연결 시도
      // 1000: 정상 종료, 1001: 페이지 이동, 1005: 특별한 상태 코드 없음
      if (event.code !== 1000 && event.code !== 1001) {
        // 재연결 시도
        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
        }
        
        reconnectTimerRef.current = setTimeout(() => {
          attemptReconnect();
        }, RECONNECT_INTERVAL);
      }
    };
    
    // 오류 핸들러
    wsRef.current.onerror = (error) => {
      console.error('WebSocket 오류:', error);
      setIsConnected(false);
    };
    
    return true;
  }, [isAuthenticated, user]);
  
  // 재연결 함수
  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      console.error(`최대 재연결 시도 횟수(${MAX_RECONNECT_ATTEMPTS})를 초과했습니다.`);
      setIsConnected(false);
      return;
    }
    
    reconnectAttemptsRef.current++;
    console.log(`WebSocket 재연결 시도 ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS}...`);
    
    connectWebSocket(true);
  }, [connectWebSocket]);
  
  // WebSocket 연결 설정
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsConnected(false);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      
      // 재연결 타이머 정리
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      return;
    }
    
    // 최초 연결 시도
    connectWebSocket(false);
    
    // 컴포넌트 언마운트시 연결 종료 및 타이머 정리
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };
  }, [isAuthenticated, user, connectWebSocket]);
  
  // 수신 메시지 처리 함수
  const handleIncomingMessage = (data: any) => {
    switch (data.type) {
      case 'authentication_success':
        console.log('인증 성공:', data.user);
        if (data.reconnected) {
          console.log('재연결 성공 - 대화 기록 복원됨');
        }
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
        
      case 'conversation_history':
        handleConversationHistory(data.conversations);
        break;
        
      case 'user_status':
        handleUserStatusChange(data.userId, data.status);
        break;
        
      case 'read_receipt':
        handleReadReceipt(data.messageId);
        break;
        
      case 'typing_indicator':
        handleTypingIndicator(data.userId, data.userName);
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
    
    // 메시지 수신자 정보가 제한적일 수 있으므로 기본값 확장
    const receiver = {
      ...message.receiver,
      role: (message.receiver as any).role || 'user',
      avatar: (message.receiver as any).avatar || null
    };
    
    const otherParty = isReceiver ? message.sender : receiver;
    
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
  
  // 전체 대화 목록 업데이트 함수
  const updateConversationList = useCallback(() => {
    const userId = user?.id;
    if (!userId) return;
    
    // 현재 메시지 기록에서 모든 대화 가져오기
    const updatedConversations: Conversation[] = [];
    
    // 메시지 기록에서 대화 정보 추출
    Object.entries(messageHistoryRef.current).forEach(([conversationId, messages]) => {
      // 대화 ID 파싱하여 사용자가 포함된 대화만 처리
      const [id1, id2] = parseConversationId(conversationId);
      const otherUserId = id1 === userId ? id2 : (id2 === userId ? id1 : null);
      
      if (otherUserId !== null && messages.length > 0) {
        // 마지막 메시지 가져오기
        const lastMessage = messages[messages.length - 1];
        
        // 상대방 정보 가져오기
        const otherParty = lastMessage.sender.id === otherUserId 
          ? lastMessage.sender 
          : lastMessage.receiver;
        
        // 읽지 않은 메시지 개수 계산
        const unreadCount = messages.filter(
          msg => msg.receiver.id === userId && !msg.isRead
        ).length;
        
        // 기존 대화가 있는지 확인
        const existingIndex = updatedConversations.findIndex(c => c.userId === otherUserId);
        
        if (existingIndex !== -1) {
          // 기존 대화 업데이트
          updatedConversations[existingIndex].lastMessage = lastMessage;
          updatedConversations[existingIndex].unreadCount = unreadCount;
        } else {
          // 새 대화 추가
          updatedConversations.push({
            userId: otherUserId,
            userName: otherParty.name,
            userRole: (otherParty as any).role || 'user',
            userAvatar: (otherParty as any).avatar,
            lastMessage,
            unreadCount,
            isOnline: false // 기본값
          });
        }
      }
    });
    
    // 대화 목록 업데이트
    setConversations(updatedConversations);
  }, [user]);
  
  // 대화 기록 처리 (재연결 시)
  const handleConversationHistory = (conversations: Record<string, Message[]>) => {
    if (!conversations || Object.keys(conversations).length === 0) return;
    
    console.log(`대화 기록 수신: ${Object.keys(conversations).length}개 대화`);
    
    // 대화 기록 메모리에 저장
    Object.entries(conversations).forEach(([conversationId, messages]) => {
      // 기존 메시지 히스토리에 추가
      if (!messageHistoryRef.current[conversationId]) {
        messageHistoryRef.current[conversationId] = [];
      }
      
      // 중복 메시지 방지를 위해 ID 기반으로 필터링하여 병합
      const existingMessageIds = new Set(
        messageHistoryRef.current[conversationId].map(msg => msg.id)
      );
      
      const newMessages = messages.filter(msg => !existingMessageIds.has(msg.id));
      
      // 타임스탬프를 Date 객체로 변환
      newMessages.forEach(msg => {
        msg.timestamp = new Date(msg.timestamp);
      });
      
      // 기존 메시지와 새 메시지 병합
      messageHistoryRef.current[conversationId] = [
        ...messageHistoryRef.current[conversationId],
        ...newMessages
      ];
      
      // 타임스탬프 기준 정렬
      messageHistoryRef.current[conversationId].sort((a, b) => {
        return a.timestamp.getTime() - b.timestamp.getTime();
      });
    });
    
    // 활성 대화가 있는 경우 메시지 업데이트
    if (activeConversation) {
      const userId = user?.id;
      if (!userId) return;
      
      const conversationId = getConversationId(userId, activeConversation.userId);
      const conversationMessages = messageHistoryRef.current[conversationId] || [];
      setMessages(conversationMessages);
    }
    
    // 대화 목록 업데이트
    updateConversationList();
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
  const getConversationId = useCallback((id1: number, id2: number): string => {
    return id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
  }, []);
  
  // 대화 ID 파싱
  const parseConversationId = useCallback((conversationId: string): [number, number] => {
    const [id1Str, id2Str] = conversationId.split('-');
    return [parseInt(id1Str), parseInt(id2Str)];
  }, []);
  
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