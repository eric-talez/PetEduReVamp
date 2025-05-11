import { useEffect, useRef, useMemo } from 'react';
import { format } from 'date-fns';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { Message, useMessaging } from '@/hooks/useMessaging';
import { ko } from 'date-fns/locale';
import { MessageItem } from './MessageItem';

export function MessageList() {
  const { userName } = useGlobalAuth();
  // The MessageList and other messaging components assume that the current user has ID 1
  // This matches the assumption in the MessagingProvider
  const user = { id: 1, name: userName || '사용자' };
  const { messages, activeConversation, markAsRead } = useMessaging();
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
      if (!message.isRead && message.sender.id !== user?.id) {
        markAsRead(message.id);
      }
    });
  }, [messages, markAsRead, user]);

  // 메시지 그룹화 (메모이제이션 적용)
  // 날짜별 그룹화에서 발신자 기준 세부 그룹화로 변경
  const processedMessages = useMemo(() => {
    if (!messages.length) return [];
    
    // 날짜 및 발신자 변경 여부에 따라 메시지 처리
    return messages.map((message, index) => {
      const prevMessage = index > 0 ? messages[index - 1] : null;
      const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
      
      // 날짜 변경 여부 확인
      const messageDate = new Date(message.timestamp).toDateString();
      const prevMessageDate = prevMessage ? new Date(prevMessage.timestamp).toDateString() : null;
      const showDate = !prevMessageDate || messageDate !== prevMessageDate;
      
      // 발신자 변경 여부 확인
      const sameSenderAsPrev = prevMessage && prevMessage.sender.id === message.sender.id;
      const sameSenderAsNext = nextMessage && nextMessage.sender.id === message.sender.id;
      
      // 시스템 메시지는 항상 분리
      const isSystemMessage = message.type === 'notification';
      
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
          isCurrentUser={message.sender.id === user?.id}
          showAvatar={showAvatar}
          showSender={showSender}
          showDate={showDate}
          previousMessage={previousMessage}
        />
      ))}
      <div ref={messagesEndRef} className="h-4" /> {/* 스크롤 여백 확보 */}
    </div>
  );
}