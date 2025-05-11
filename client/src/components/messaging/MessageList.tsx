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
  const messageGroups = useMemo(() => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = format(new Date(message.timestamp), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  }, [messages]);
  
  if (!activeConversation) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-center text-gray-500">
        대화를 선택하거나 새 메시지를 보내세요
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {Object.entries(messageGroups).map(([date, groupMessages]) => (
        <div key={date} className="mb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full text-xs">
              {format(new Date(date), 'yyyy년 M월 d일 EEEE', { locale: ko })}
            </div>
          </div>
          
          {groupMessages.map((message) => (
            <MessageItem 
              key={message.id}
              message={message}
              isCurrentUser={message.sender.id === user?.id}
            />
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}