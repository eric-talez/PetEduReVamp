import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// 연결 상태 표시 컴포넌트
interface StatusIndicatorProps {
  status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
  className?: string;
}

function StatusIndicatorComponent({ status, className }: StatusIndicatorProps) {
  let statusText = '';
  let statusColor = '';
  let showSpinner = false;
  
  switch (status) {
    case 'connecting':
      statusText = '연결 중...';
      statusColor = 'text-amber-500';
      showSpinner = true;
      break;
    case 'connected':
      statusText = '연결됨';
      statusColor = 'text-green-500';
      showSpinner = false;
      break;
    case 'disconnected':
      statusText = '연결 끊김';
      statusColor = 'text-red-500';
      showSpinner = false;
      break;
    case 'reconnecting':
      statusText = '재연결 중...';
      statusColor = 'text-amber-500';
      showSpinner = true;
      break;
  }
  
  return (
    <div className={cn('flex items-center text-xs', statusColor, className)}>
      {showSpinner && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
      <span>{statusText}</span>
    </div>
  );
}

// 타이핑 상태 표시 컴포넌트
interface TypingIndicatorProps {
  typingUserName?: string;
  className?: string;
}

function TypingIndicatorComponent({ typingUserName, className }: TypingIndicatorProps) {
  if (!typingUserName) return null;
  
  return (
    <div className={cn('flex items-center text-xs text-muted-foreground', className)}>
      <div className="typing-dots mr-1.5">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
      <span>{typingUserName}님이 입력 중...</span>
    </div>
  );
}

export const ConnectionStatus = memo(StatusIndicatorComponent);
export const TypingIndicator = memo(TypingIndicatorComponent);