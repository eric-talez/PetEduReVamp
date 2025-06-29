import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/lib/auth-compat';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 기본 환영 메시지
const DEFAULT_WELCOME_MESSAGE = {
  id: 'welcome-1',
  role: 'assistant' as const,
  content: '안녕하세요! TALEZ의 AI 전문 어시스턴트입니다. 반려동물의 건강, 훈련, 영양, 행동 문제에 대해 전문적인 조언을 드릴 수 있습니다. 어떤 도움이 필요하신가요?'
};

export function SimpleChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    DEFAULT_WELCOME_MESSAGE
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

  // 메시지 전송 처리 - OpenAI API 사용
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const currentInput = inputValue.trim();
    
    // 사용자 메시지 생성
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: currentInput
    };

    // UI 업데이트
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 대화 기록 준비 (최근 10개 메시지만 전송하여 컨텍스트 유지)
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // 현재 사용자 메시지 추가
      conversationHistory.push({
        role: 'user',
        content: currentInput
      });

      // OpenAI API 호출
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationHistory,
          model: 'gpt-4o', // 최신 OpenAI 모델 사용
          maxTokens: 800, // 적절한 응답 길이 제한
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || '응답을 받지 못했습니다.'
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error('AI 응답 오류:', error);
      
      // API 오류 시 사용자 입력에 맞는 대체 응답 제공
      const fallbackResponse = getSimulatedResponse(currentInput);
      const errorMessage: Message = {
        id: `fallback-${Date.now()}`,
        role: 'assistant',
        content: fallbackResponse
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
      <div className="fixed bottom-6 right-6 z-[60]">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 border-2 border-white/20"
          style={{ 
            background: 'linear-gradient(135deg, #2BAA61 0%, #1e8b4f 100%)',
            boxShadow: '0 8px 32px rgba(43, 170, 97, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Bot size={22} className="text-white drop-shadow-sm" />
          {/* 펄스 애니메이션 효과 */}
          <div className="absolute -inset-2 rounded-full bg-primary/20 animate-ping" />
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/30 to-primary/10 animate-pulse" />
        </Button>
        
        {/* 툴팁 */}
        <div className="absolute bottom-16 right-0 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 pointer-events-none transition-opacity duration-200 whitespace-nowrap hover:opacity-100 group-hover:opacity-100">
          AI 도우미와 채팅하기
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-[480px] bg-white border border-gray-200 rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div>
            <span className="font-semibold text-sm">TALEZ AI 도우미</span>
            <div className="flex items-center gap-1 text-xs text-white/80">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              온라인
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 w-8 h-8 p-0 rounded-full"
        >
          <X size={16} />
        </Button>
      </div>

      {/* 메시지 영역 */}
      <ScrollArea className="flex-1 p-4 bg-gray-50/50">
        <div className="space-y-4">
          {messages.filter(m => m.role !== 'system').map(message => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3 mb-4',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center text-white shadow-sm">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={cn(
                  'rounded-2xl px-4 py-3 max-w-[75%] text-sm leading-relaxed shadow-sm',
                  message.role === 'user' 
                    ? 'bg-primary text-white rounded-br-md' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
                )}
              >
                <div className="whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                  <User size={16} />
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
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="반려동물에 대해 궁금한 것을 물어보세요..."
              className="resize-none min-h-[44px] max-h-[120px] border-gray-200 rounded-xl focus:border-primary focus:ring-primary/20 text-sm"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            size="icon"
            disabled={!inputValue.trim() || isLoading}
            className="w-11 h-11 rounded-xl bg-primary hover:bg-primary/90 shadow-sm"
          >
            <Send size={18} />
          </Button>
        </div>
        <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          {isAuthenticated 
            ? 'AI가 반려동물 케어에 대한 맞춤형 조언을 제공합니다' 
            : '로그인하면 개인화된 반려동물 관리 조언을 받을 수 있습니다'}
        </div>
      </div>
    </div>
  );
}