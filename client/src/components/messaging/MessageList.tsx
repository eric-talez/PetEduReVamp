import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { Message, useMessaging } from '@/hooks/useMessaging';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ko } from 'date-fns/locale';

export function MessageList() {
  const { user } = useAuth();
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

  // 아바타 색상 생성 (이름 기반)
  const getInitialsColor = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500',
      'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500', 'bg-teal-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // 이니셜 생성
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // 메시지 그룹화
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = format(new Date(message.timestamp), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);
  
  if (!activeConversation) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-center text-gray-500">
        대화를 선택하거나 새 메시지를 보내세요
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {Object.entries(messageGroups).map(([date, messages]) => (
        <div key={date} className="mb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full text-xs">
              {format(new Date(date), 'yyyy년 M월 d일 EEEE', { locale: ko })}
            </div>
          </div>
          
          {messages.map((message) => {
            const isCurrentUser = message.sender.id === user?.id;
            
            return (
              <div 
                key={message.id} 
                className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isCurrentUser && (
                  <div className="flex-shrink-0 mr-2">
                    <Avatar className="w-8 h-8">
                      {message.sender.avatar ? (
                        <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                      ) : (
                        <AvatarFallback className={getInitialsColor(message.sender.name)}>
                          {getInitials(message.sender.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                )}
                
                <div className={`max-w-[75%]`}>
                  {!isCurrentUser && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {message.sender.name}
                    </div>
                  )}
                  
                  <div className="flex items-end">
                    {isCurrentUser && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                        {format(new Date(message.timestamp), 'HH:mm')}
                        {message.isRead && (
                          <span className="ml-1 text-blue-500">✓</span>
                        )}
                      </div>
                    )}
                    
                    <div 
                      className={`rounded-lg px-4 py-2 ${
                        isCurrentUser 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {message.type === 'image' ? (
                        <img 
                          src={message.content} 
                          alt="Shared" 
                          className="max-w-full rounded"
                        />
                      ) : message.type === 'notification' ? (
                        <div className="text-amber-500 font-medium">{message.content}</div>
                      ) : (
                        <div>{message.content}</div>
                      )}
                    </div>
                    
                    {!isCurrentUser && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {format(new Date(message.timestamp), 'HH:mm')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}