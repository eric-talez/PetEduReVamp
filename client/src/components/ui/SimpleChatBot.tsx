import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/lib/auth-compat';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 기본 시스템 메시지
const DEFAULT_SYSTEM_MESSAGE = {
  id: 'system-1',
  role: 'system' as const,
  content: `당신은 Talez의 AI 어시스턴트입니다. 반려동물 훈련과 교육에 관한 질문에 친절하고 전문적인 답변을 제공합니다.`
};

export function SimpleChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    DEFAULT_SYSTEM_MESSAGE
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

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
      content: inputValue.trim()
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

      // AI API 호출 (임시 모의 응답 사용)
      // 실제 구현에서는 '/api/ai/chat' 엔드포인트를 호출해야 합니다
      setTimeout(() => {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: getSimulatedResponse(userMessage.content)
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('AI 응답 오류:', error);
      
      // 오류 메시지 추가
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '죄송합니다, 응답을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  // 간단한 모의 응답 생성 함수
  function getSimulatedResponse(input: string): string {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('안녕') || lowerInput.includes('반가워')) {
      return '안녕하세요! Talez의 AI 어시스턴트입니다. 반려동물 훈련과 관련해 어떤 도움이 필요하신가요?';
    }
    
    if (lowerInput.includes('강아지') && (lowerInput.includes('짖') || lowerInput.includes('짓'))) {
      return '강아지가 짖는 것은 의사소통의 한 방법입니다. 과도한 짖음은 불안, 지루함, 영역 방어 등의 이유로 발생할 수 있습니다. 규칙적인 운동과 정신적 자극을 제공하고, 짖지 않을 때 보상하는 방식의 훈련이 도움이 될 수 있습니다.';
    }
    
    if (lowerInput.includes('고양이') && (lowerInput.includes('화장실') || lowerInput.includes('배변'))) {
      return '고양이가 화장실을 사용하지 않는 경우는 스트레스, 건강 문제, 또는 화장실 환경에 불만이 있을 수 있습니다. 화장실을 깨끗하게 유지하고, 조용하고 접근하기 쉬운 장소에 배치하세요. 지속적인 문제라면 수의사 상담을 권장합니다.';
    }
    
    if (lowerInput.includes('훈련') || lowerInput.includes('교육')) {
      return '효과적인 반려동물 훈련은 일관성, 인내, 그리고 긍정적 강화에 기반합니다. 원하는 행동에 보상을 주고, 짧은 세션으로 자주 훈련하며, 진행 상황을 기록하는 것이 중요합니다. 각 반려동물은 개성이 있으므로 그에 맞는 접근 방식을 찾는 것이 좋습니다.';
    }
    
    return '흥미로운 질문이네요. 구체적인 상황이나 반려동물의 종류, 나이 등을 알려주시면 더 도움이 될 수 있는 정보를 제공해 드릴 수 있습니다.';
  }

  // 엔터 키로 메시지 전송 (Shift+Enter는 줄바꿈)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full p-3 z-50"
      >
        <Bot size={24} />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[350px] h-[500px] bg-background border rounded-lg shadow-lg z-50 flex flex-col">
      {/* 헤더 */}
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="text-primary" size={20} />
          <h3 className="font-medium">AI 어시스턴트</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X size={18} />
        </Button>
      </div>

      {/* 메시지 영역 */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.filter(m => m.role !== 'system').map(message => (
            <div
              key={message.id}
              className={cn(
                'flex gap-2 mb-4',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Bot size={18} />
                </div>
              )}
              <div
                className={cn(
                  'rounded-lg px-4 py-2 max-w-[80%]',
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-muted rounded-tl-none'
                )}
              >
                <div className="whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-primary-foreground">
                  <User size={18} />
                </div>
              )}
            </div>
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
    </div>
  );
}