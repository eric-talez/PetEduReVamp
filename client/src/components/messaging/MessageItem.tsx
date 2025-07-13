import { memo, ReactElement } from 'react';
import { Message } from '@/hooks/useMessaging';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar?: boolean;
  showSender?: boolean;
  showDate?: boolean;
  previousMessage?: Message | null;
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

// 날짜 포맷팅 (오늘, 어제, 그 외)
const formatMessageDate = (date: Date) => {
  if (isToday(date)) {
    return '오늘';
  } else if (isYesterday(date)) {
    return '어제';
  } else {
    return format(date, 'yyyy년 M월 d일', { locale: ko });
  }
};

function MessageItemComponent({ 
  message, 
  isCurrentUser, 
  showAvatar = true, 
  showSender = true,
  showDate = false,
  previousMessage = null
}: MessageItemProps) {
  // 타임스탬프를 Date 객체로 변환
  const timestamp = new Date(message.timestamp);
  
  // 시스템 알림 메시지 여부 확인
  const isSystemNotification = message.type === 'notification';
  
  // 이전 메시지와 동일한 발신자인지 확인 (아바타 표시 여부 결정)
  const isSameSender = previousMessage && 
    previousMessage.sender.id === message.sender.id &&
    !isSystemNotification;
  
  // 이전 메시지와 동일한 날짜인지 확인 (날짜 구분선 표시 여부 결정)
  const isSameDay = previousMessage && 
    new Date(previousMessage.timestamp).toDateString() === timestamp.toDateString();
  
  // 최종 표시 여부 결정
  const shouldShowAvatar = showAvatar && !isCurrentUser && !isSameSender;
  const shouldShowSender = showSender && !isCurrentUser && !isSameSender;
  const shouldShowDate = showDate && !isSameDay;
  
  return (
    <>
      {/* 날짜 구분선 */}
      {shouldShowDate && (
        <div className="flex justify-center my-4">
          <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
            {formatMessageDate(timestamp)}
          </div>
        </div>
      )}
      
      <div 
        className={`flex ${isSystemNotification ? 'justify-center my-3' : isCurrentUser ? 'justify-end' : 'justify-start'} ${!isSystemNotification ? 'mb-2' : ''}`}
      >
        {/* 시스템 알림 메시지일 경우 */}
        {isSystemNotification ? (
          <div className="bg-muted/50 px-4 py-1.5 rounded-full text-sm text-muted-foreground max-w-[80%] text-center">
            {message.content}
          </div>
        ) : (
          <>
            {/* 일반 메시지 - 아바타 */}
            {shouldShowAvatar && (
              <div className="flex-shrink-0 mr-2 mt-1">
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
            
            {/* 아바타를 표시하지 않을 때 여백 처리 */}
            {!isCurrentUser && !shouldShowAvatar && (
              <div className="w-10"></div>
            )}
            
            <div className={`max-w-[75%]`}>
              {/* 발신자 이름 */}
              {shouldShowSender && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
                  {message.sender.name}
                </div>
              )}
              
              <div className="flex items-end">
                {/* 현재 사용자가 보낸 메시지의 시간 */}
                {isCurrentUser && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                    {format(timestamp, 'HH:mm')}
                    {message.isRead && (
                      <span className="ml-1 message-read-tick">✓</span>
                    )}
                  </div>
                )}
                
                {/* 메시지 내용 */}
                <div 
                  className={`rounded-lg px-3 py-1.5 ${
                    isCurrentUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {message.type === 'image' ? (
                    <img 
                      src={message.content} 
                      alt="Shared" 
                      className="max-w-full rounded cursor-pointer"
                      onClick={() => window.open(message.content, '_blank')}
                    />
                  ) : (
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  )}
                </div>
                
                {/* 상대방이 보낸 메시지의 시간 */}
                {!isCurrentUser && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    {format(timestamp, 'HH:mm')}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// 메모이제이션 처리 (불필요한 리렌더링 방지)
export const MessageItem = memo(
  MessageItemComponent,
  // 두 번째 인자에 타입 지정하여 명시적으로 boolean을 반환하도록 함
  function arePropsEqual(prevProps: MessageItemProps, nextProps: MessageItemProps): boolean {
    // 다음 상황에서만 리렌더링:
    // 1. 다른 메시지 ID
    // 2. 읽음 상태 변경
    // 3. 현재 사용자 상태 변경
    // 4. 이전 메시지 변경 (그룹화 로직에 영향)
    // 5. 아바타/발신자/날짜 표시 여부 변경
    
    // 이전 메시지 ID 비교 로직
    const prevMsgId = prevProps.previousMessage ? prevProps.previousMessage.id : null;
    const nextMsgId = nextProps.previousMessage ? nextProps.previousMessage.id : null;
    const sameMessage = prevProps.message.id === nextProps.message.id;
    const sameReadStatus = prevProps.message.isRead === nextProps.message.isRead;
    const sameUserStatus = prevProps.isCurrentUser === nextProps.isCurrentUser;
    const sameAvatar = prevProps.showAvatar === nextProps.showAvatar;
    const sameSender = prevProps.showSender === nextProps.showSender;
    const sameDate = prevProps.showDate === nextProps.showDate;
    const samePrevMsg = prevMsgId === nextMsgId;
    
    // 모든 조건이 같을 때만 리렌더링 방지 (true 반환)
    return sameMessage && sameReadStatus && sameUserStatus && 
           sameAvatar && sameSender && sameDate && samePrevMsg;
  }
);