import { MessagingProvider } from '@/hooks/useMessaging';
import { ConversationList } from '@/components/messaging/ConversationList';
import { MessageList } from '@/components/messaging/MessageList';
import { MessageInput } from '@/components/messaging/MessageInput';
import { Card } from '@/components/ui/card';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { useState, useEffect } from 'react';
import { MessagesSquare } from 'lucide-react';

/**
 * 메시지 앱 컴포넌트
 */
function MessagesContent() {
  const { isAuthenticated } = useGlobalAuth();
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 화면 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <div>
          <MessagesSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">로그인이 필요합니다</h2>
          <p className="text-gray-500">
            메시지 기능을 사용하려면 로그인해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* 대화 목록 (모바일에서 전체 화면) */}
      <div className={`${isMobile ? 'w-full' : 'w-1/3 lg:w-1/4'} h-full flex-shrink-0`}>
        <ConversationList />
      </div>
      
      {/* 메시지 영역 (모바일에서 숨김) */}
      <div className={`${isMobile ? 'hidden' : 'flex'} flex-col flex-grow h-full`}>
        <div className="flex-grow overflow-hidden">
          <MessageList />
        </div>
        <MessageInput />
      </div>
    </div>
  );
}

/**
 * 메시지 페이지 컴포넌트
 */
export default function MessagesPage() {
  return (
    <Card className="flex-grow flex overflow-hidden max-h-[calc(100vh-7rem)]">
      <MessagingProvider>
        <MessagesContent />
      </MessagingProvider>
    </Card>
  );
}