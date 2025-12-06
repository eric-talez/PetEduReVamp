import { useEffect, useRef, useMemo } from 'react';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { Message, useMessaging } from '@/hooks/useMessaging';
import { MessageItem } from './MessageItem';
import { Loader2 } from 'lucide-react';

export function MessageList() {
  const { userName } = useGlobalAuth();
  const { messages, activeConversation, markAsRead, isLoadingMessages } = useMessaging();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가되면 스크롤 아래로 이동
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 안 읽은 메시지 읽음 표시
  useEffect(() => {
    messages.forEach(message => {
      if (!message.isRead && message.sender?.id !== message.senderId) {
        markAsRead(message.id);
      }
    });
  }, [messages, markAsRead]);

  // 메시지 그룹화 (메모이제이션 적용)
  const processedMessages = useMemo(() => {
    if (!messages.length) return [];
    
    return messages.map((message, index) => {
      const prevMessage = index > 0 ? messages[index - 1] : null;
      const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
      
      // 날짜 변경 여부 확인
      const messageDate = new Date(message.createdAt).toDateString();
      const prevMessageDate = prevMessage ? new Date(prevMessage.createdAt).toDateString() : null;
      const showDate = !prevMessageDate || messageDate !== prevMessageDate;
      
      // 발신자 변경 여부 확인
      const sameSenderAsPrev = prevMessage && prevMessage.senderId === message.senderId;
      const sameSenderAsNext = nextMessage && nextMessage.senderId === message.senderId;
      
      // 시스템 메시지는 항상 분리
      const isSystemMessage = message.messageType === 'notification';
      
      return {
        message,
        showDate,
        showAvatar: !sameSenderAsPrev || isSystemMessage,
        showSender: !sameSenderAsPrev || isSystemMessage,
        isFirstInGroup: !sameSenderAsPrev || isSystemMessage,
        isLastInGroup: !sameSenderAsNext || isSystemMessage,
        previousMessage: prevMessage
      };
    });
  }, [messages]);
  
  if (!activeConversation) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-center text-gray-500">
        대화를 선택하거나 새 메시지를 보내세요
      </div>
    );
  }

  if (isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-center text-gray-500">
        <div>
          <p className="mb-2">아직 메시지가 없습니다.</p>
          <p className="text-sm">첫 메시지를 보내보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 relative message-timeline">
      {processedMessages.map(({ 
        message, 
        showDate, 
        showAvatar, 
        showSender, 
        isFirstInGroup, 
        isLastInGroup,
        previousMessage 
      }) => (
        <MessageItem 
          key={message.id}
          message={message}
          isCurrentUser={message.senderId === activeConversation.participant?.id ? false : true}
          showAvatar={showAvatar}
          showSender={showSender}
          showDate={showDate}
          previousMessage={previousMessage}
        />
      ))}
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
}
