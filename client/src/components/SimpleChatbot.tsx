import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Loader2, Bot, User, Move, RotateCcw } from 'lucide-react';
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
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const [size, setSize] = useState({ width: 320, height: 480 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  // 새 메시지가 추가될 때 스크롤을 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 드래그 시작
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (isResizing) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  }, [position, isResizing]);

  // 리사이즈 시작
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
    e.preventDefault();
    e.stopPropagation();
  }, [size]);

  // 마우스 이동 처리
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragStart.x));
        const newY = Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragStart.y));
        setPosition({ x: newX, y: newY });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(280, Math.min(600, resizeStart.width + deltaX));
        const newHeight = Math.max(400, Math.min(700, resizeStart.height + deltaY));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = isDragging ? 'move' : 'nw-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, isResizing, dragStart, resizeStart, size]);

  // 위치 초기화
  const resetPosition = () => {
    setPosition({ x: 24, y: 24 });
    setSize({ width: 320, height: 480 });
  };

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

      // API 오류 시 사용자 입력에 맞는 지능형 응답 제공
      const fallbackResponse = getIntelligentResponse(currentInput);
      const errorMessage: Message = {
        id: `fallback-${Date.now()}`,
        role: 'assistant',
        content: fallbackResponse
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  // 지능형 대화 시스템 - 사용자 입력 분석 및 맞춤형 응답
  function getIntelligentResponse(input: string): string {
    const lowerInput = input.toLowerCase().trim();

    // 더 복잡한 키워드 매칭과 컨텍스트 분석
    const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    // 인사 관련 - 다양한 응답
    const greetingKeywords = ['안녕', '반가워', '처음', '시작', 'hello', 'hi', '안녕하세요'];
    if (greetingKeywords.some(keyword => lowerInput.includes(keyword))) {
      const greetings = [
        '안녕하세요! TALEZ AI 어시스턴트입니다. 반려동물에 대해 어떤 궁금한 점이 있으신가요?',
        '반갑습니다! 반려동물의 건강과 훈련에 대해 도움을 드릴 수 있어요. 무엇이 궁금하신가요?',
        '안녕하세요! 오늘도 우리 반려동물을 위한 좋은 정보를 찾고 계시는군요. 어떤 도움이 필요하신지 알려주세요.',
        '환영합니다! TALEZ에서 반려동물 케어 전문가로 활동하고 있어요. 어떤 상황에 대해 조언이 필요하신가요?'
      ];
      return getRandomElement(greetings);
    }

    // 강아지 관련 다양한 키워드 조합 분석
    if (lowerInput.includes('강아지') || lowerInput.includes('개') || lowerInput.includes('댕댕이')) {
      // 짖음 문제
      if (lowerInput.includes('짖') || lowerInput.includes('짓') || lowerInput.includes('소음') || lowerInput.includes('시끄')) {
        const barkingResponses = [
          `강아지가 ${lowerInput.includes('밤') ? '밤에' : lowerInput.includes('아침') ? '아침에' : ''} 짖는 것 때문에 고민이시군요. 짖음의 원인을 파악하는 것이 우선입니다.\n\n가능한 원인:\n• 외부 소음이나 자극에 대한 반응\n• 관심을 끌고 싶어하는 행동\n• 불안하거나 스트레스 받는 상황\n• 영역을 지키려는 본능\n\n즉시 해볼 수 있는 방법:\n• 짖는 순간 주의를 다른 곳으로 돌리기\n• 조용할 때 간식으로 보상하기\n• 충분한 산책과 놀이로 에너지 소모시키기`,
          `짖음 문제는 많은 반려인들이 겪는 고민이에요. 강아지의 나이와 견종에 따라 접근법이 다를 수 있습니다.\n\n효과적인 훈련법:\n• '조용히' 명령어 훈련\n• 짖음을 유발하는 자극 줄이기\n• 규칙적인 일상 루틴 만들기\n• 사회화 훈련으로 외부 자극에 적응시키기\n\n참고로 TALEZ의 전문 훈련사들은 개별 상황에 맞는 맞춤 솔루션을 제공해드려요.`
        ];
        return getRandomElement(barkingResponses);
      }

      // 일반적인 강아지 관련 질문
      const generalDogResponses = [
        `강아지에 대한 궁금한 점이 있으시군요! 구체적으로 어떤 부분이 궁금하신가요? 훈련, 건강, 급여, 행동 등 어떤 주제든 도움을 드릴 수 있어요.`,
        `우리 반려견을 위한 정보를 찾고 계시는군요. 견종이나 나이, 현재 상황을 알려주시면 더 맞춤형 조언을 드릴 수 있습니다.`,
        `강아지 키우기는 정말 보람찬 일이지만 때로는 어려움도 있죠. 어떤 고민이 있으신지 자세히 말씀해주세요!`
      ];
      return getRandomElement(generalDogResponses);
    }

    // 기본 응답
    return `반려동물에 대해 궁금한 점이 있으시군요. 구체적으로 어떤 도움이 필요하신지 알려주세요. 건강, 훈련, 영양, 행동 등 어떤 주제든 도움을 드릴 수 있어요.`;
  }

  // 엔터 키로 메시지 전송 (Shift+Enter는 줄바꿈)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const shouldHideChatbot = () => {
    if (window.location.pathname.includes('/admin')) return true;
    if (window.location.pathname.includes('/ai-chatbot') || 
        window.location.pathname.includes('/ai-analysis')) return true;
    return false;
  };

  if (shouldHideChatbot()) {
    return null;
  }

  if (!isOpen) {
    return (
      <div 
        className="fixed z-[60]"
        style={{ 
          bottom: `${position.y}px`, 
          right: `${position.x}px` 
        }}
      >
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
      </div>
    );
  }

  return (
    <div 
      ref={chatbotRef}
      className="fixed bg-white border border-gray-200 rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden"
      style={{
        bottom: `${position.y}px`,
        right: `${position.x}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        minWidth: '280px',
        minHeight: '400px',
        maxWidth: '600px',
        maxHeight: '700px'
      }}
    >
      {/* 헤더 - 드래그 가능 */}
      <div 
        className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-primary/90 text-white cursor-move select-none"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-3">
          <Move size={16} className="text-white/80" />
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
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetPosition}
            className="text-white hover:bg-white/20 w-8 h-8 p-0 rounded-full"
            title="위치 초기화"
          >
            <RotateCcw size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 w-8 h-8 p-0 rounded-full"
          >
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <ScrollArea className="flex-1 p-4 bg-background/50">
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-sm">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={cn(
                  'rounded-2xl px-4 py-3 max-w-[75%] text-sm leading-relaxed shadow-sm',
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-br-md' 
                    : 'bg-card text-card-foreground border border-border rounded-bl-md'
                )}
              >
                <div className="whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
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
      <div className="p-4 bg-card border-t border-border">
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

      {/* 리사이즈 핸들 */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize opacity-50 hover:opacity-100 transition-opacity"
        onMouseDown={handleResizeStart}
        style={{
          background: 'linear-gradient(-45deg, transparent 30%, #666 30%, #666 70%, transparent 70%)',
          backgroundSize: '4px 4px'
        }}
        title="크기 조절"
      />
    </div>
  );
}