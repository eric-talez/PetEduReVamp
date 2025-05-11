import { memo } from 'react';
import { Message } from '@/hooks/useMessaging';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  showDate?: boolean;
}

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

function MessageItemComponent({ message, isCurrentUser }: MessageItemProps) {
  return (
    <div 
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
}

// 메모이제이션 처리 (불필요한 리렌더링 방지)
export const MessageItem = memo(MessageItemComponent, (prevProps, nextProps) => {
  // 같은 메시지이고 읽음 상태가 변경되지 않은 경우 리렌더링 방지
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.isRead === nextProps.message.isRead &&
    prevProps.isCurrentUser === nextProps.isCurrentUser
  );
});