import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, Loader2, Bot, User, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/lib/auth-compat';
import { Textarea } from '@/components/ui/textarea';
import { apiRequest } from '@/lib/api';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  defaultOpen?: boolean;
  defaultMessages?: Message[];
}

// 채팅 말풍선 컴포넌트
const ChatBubble = ({ message, isUser }: { message: Message; isUser: boolean }) => {
  return (
    <div
      className={cn(
        'flex gap-2 mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          <Bot size={18} />
        </div>
      )}
      <div
        className={cn(
          'rounded-lg px-4 py-2 max-w-[80%]',
          isUser 
            ? 'bg-primary text-primary-foreground rounded-tr-none' 
            : 'bg-muted rounded-tl-none'
        )}
      >
        <div className="prose dark:prose-invert prose-sm break-words">
          {message.content}
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-primary-foreground">
          <User size={18} />
        </div>
      )}
    </div>
  );
};

// 기본 시스템 메시지
const DEFAULT_SYSTEM_MESSAGE = {
  id: 'system-1',
  role: 'system',
  content: `당신은 Talez의 AI 어시스턴트입니다. 반려동물 훈련과 교육에 관한 질문에 친절하고 전문적인 답변을 제공합니다.
다음과 같은 내용을 돕습니다:
- 반려동물 행동 문제 해결
- 기본적인 훈련 방법 안내
- 반려동물 건강 및 영양 관련 일반적인 정보
- 반려동물과의 관계 개선 방법

중요: 의료적 진단이나 치료 조언은 제공하지 않습니다. 항상 전문 수의사와 상담하도록 안내합니다.
답변은 한국어로 간결하고 친절하게 제공합니다.`,
  timestamp: new Date()
};

export function AIAssistant({ defaultOpen = false, defaultMessages = [] }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([
    DEFAULT_SYSTEM_MESSAGE,
    ...defaultMessages
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  // 채팅창이 열릴 때 인풋에 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 새 메시지가 추가될 때 스크롤을 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송 처리
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // 사용자 메시지 생성
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    // UI 업데이트
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // API 요청 준비
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      apiMessages.push({
        role: userMessage.role,
        content: userMessage.content
      });

      // AI API 호출
      const response = await apiRequest('POST', '/api/ai/chat', {
        messages: apiMessages,
        temperature: 0.7,
        maxTokens: isAuthenticated ? 1000 : 500 // 인증된 사용자는 더 긴 응답 허용
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '응답을 생성하는 중 오류가 발생했습니다.');
      }

      const responseData = await response.json();

      // 어시스턴트 메시지 생성
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: responseData.content || '죄송합니다, 응답을 생성할 수 없습니다.',
        timestamp: new Date()
      };

      // 메시지 목록에 어시스턴트 응답 추가
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI 응답 오류:', error);
      
      // 오류 메시지 추가
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '죄송합니다, 응답을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 엔터 키로 메시지 전송 (Shift+Enter는 줄바꿈)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* 접힌 상태일 때 표시되는 버튼 */}
      {!isOpen && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                size="icon"
                className="fixed bottom-4 right-4 rounded-full shadow-lg z-50 h-14 w-14"
              >
                <Bot size={24} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>AI 어시스턴트와 대화하기</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* 채팅 인터페이스 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 right-4 w-[350px] sm:w-[400px] h-[500px] bg-background border rounded-lg shadow-lg z-50 flex flex-col"
          >
            {/* 헤더 */}
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="text-primary" size={20} />
                <h3 className="font-medium">AI 어시스턴트</h3>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <ChevronDown size={18} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X size={18} />
                </Button>
              </div>
            </div>

            {/* 메시지 영역 */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.filter(m => m.role !== 'system').map(message => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    isUser={message.role === 'user'}
                  />
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <Bot size={18} />
                    </div>
                    <div className="bg-muted rounded-lg rounded-tl-none px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* 입력 영역 */}
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="질문을 입력하세요..."
                  className="resize-none min-h-[40px] max-h-[120px]"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Send size={18} />
                </Button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {isAuthenticated 
                  ? '모든 대화 내용은 개인정보 보호 정책에 따라 처리됩니다.' 
                  : '더 많은 기능을 사용하려면 로그인하세요.'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}