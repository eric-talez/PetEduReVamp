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
    
    // 인사 및 일반적인 대화
    const greetingKeywords = ['안녕', '반가워', '처음', '시작', 'hello', 'hi'];
    if (greetingKeywords.some(keyword => lowerInput.includes(keyword))) {
      return '안녕하세요! TALEZ의 AI 전문 어시스턴트입니다. 반려동물의 건강, 훈련, 영양, 행동 문제에 대해 전문적인 조언을 드릴 수 있습니다. 어떤 도움이 필요하신가요?';
    }
    
    // 강아지 행동 문제
    if (lowerInput.includes('강아지') && (lowerInput.includes('짖') || lowerInput.includes('짓') || lowerInput.includes('소음'))) {
      return '강아지 짖음은 의사소통의 자연스러운 방법이지만, 과도할 경우 문제가 될 수 있습니다.\n\n주요 원인:\n• 불안이나 스트레스\n• 지루함이나 관심 끌기\n• 영역 방어 본능\n• 분리불안\n\n해결 방법:\n• 충분한 운동과 정신적 자극 제공\n• 조용할 때 보상하는 긍정 강화 훈련\n• 규칙적인 일과 유지\n\n지속적인 문제라면 TALEZ 전문 훈련사와 상담해보세요.';
    }
    
    // 고양이 화장실/배변 문제
    if (lowerInput.includes('고양이') && (lowerInput.includes('화장실') || lowerInput.includes('배변') || lowerInput.includes('용변'))) {
      return '고양이 화장실 문제는 스트레스나 환경 변화로 인해 발생할 수 있습니다.\n\n점검 사항:\n• 화장실 청결도 (매일 청소)\n• 모래의 종류와 깊이 (5-7cm 권장)\n• 화장실 위치 (조용하고 접근 쉬운 곳)\n• 화장실 개수 (고양이 수 + 1개)\n\n갑작스러운 변화나 혈뇨, 변비 증상이 있다면 즉시 수의사 진료를 받으세요.';
    }
    
    // 훈련 및 교육
    if (lowerInput.includes('훈련') || lowerInput.includes('교육') || lowerInput.includes('가르치') || lowerInput.includes('배우')) {
      return 'TALEZ는 체계적인 반려동물 교육 프로그램을 제공합니다.\n\n주요 훈련 프로그램:\n• 기본 예의교육 (앉아, 기다려, 이리와)\n• 사회화 훈련\n• 문제행동 교정\n• 어질리티 훈련\n• 치료견 훈련\n\n"내 훈련사" 메뉴에서 전문 훈련사를 찾아 맞춤형 상담을 받아보세요. 각 훈련사의 전문 분야와 후기를 확인할 수 있습니다.';
    }
    
    // 건강 관련
    if (lowerInput.includes('건강') || lowerInput.includes('병원') || lowerInput.includes('아프') || lowerInput.includes('증상') || lowerInput.includes('진료')) {
      return '반려동물의 건강 관리는 예방이 가장 중요합니다.\n\n정기 관리 항목:\n• 연간 종합건강검진\n• 예방접종 (매년)\n• 심장사상충 예방약\n• 구충제 투여\n• 치과 관리\n\n응급 상황 징후:\n• 호흡곤란, 구토, 설사\n• 식욕부진이 24시간 이상 지속\n• 무기력, 고열\n\n이상 증상 발견 시 즉시 수의사와 상담하세요. TALEZ 건강관리 기능으로 접종 일정을 체계적으로 관리할 수 있습니다.';
    }
    
    // 영양 및 사료
    if (lowerInput.includes('사료') || lowerInput.includes('먹이') || lowerInput.includes('영양') || lowerInput.includes('급여') || lowerInput.includes('음식')) {
      return '균형잡힌 영양은 반려동물의 건강한 삶의 기초입니다.\n\n연령별 사료 선택:\n• 퍼피/키튼: 성장기용 고단백 사료\n• 성견/성묘: 활동량에 맞는 유지 사료\n• 시니어: 소화 쉬운 저칼로리 사료\n\n급여 원칙:\n• 정해진 시간에 규칙적으로\n• 적정량 준수 (비만 예방)\n• 충분한 신선한 물 제공\n• 사료 변경 시 점진적으로 (7-10일)\n\n특별한 건강 상태나 알레르기가 있다면 수의사와 상담 후 처방 사료를 고려하세요.';
    }
    
    // 운동 및 산책
    if (lowerInput.includes('산책') || lowerInput.includes('운동') || lowerInput.includes('활동') || lowerInput.includes('놀이')) {
      return '규칙적인 운동은 반려동물의 신체적, 정신적 건강에 필수입니다.\n\n견종별 운동량:\n• 소형견: 1일 30분-1시간\n• 중형견: 1일 1-2시간\n• 대형견: 1일 2시간 이상\n\n운동의 효과:\n• 스트레스 해소 및 문제행동 예방\n• 근육과 뼈 건강 유지\n• 면역력 강화\n• 사회화 기회 제공\n\n날씨가 좋지 않을 때는 실내 놀이나 정신적 자극 활동으로 대체할 수 있습니다. 퍼즐 장난감이나 숨바꼭질 게임을 활용해보세요.';
    }
    
    // 행동 문제
    if (lowerInput.includes('문제') || lowerInput.includes('행동') || lowerInput.includes('교정') || lowerInput.includes('버릇')) {
      return '반려동물의 문제행동은 대부분 환경적 요인이나 스트레스에서 비롯됩니다.\n\n일반적인 문제행동:\n• 분리불안 (울음, 파괴행동)\n• 공격성 (으르렁거림, 물기)\n• 강박행동 (계속 핥기, 돌기)\n• 배변 실수\n\n해결 접근법:\n• 원인 파악이 우선\n• 일관된 규칙과 루틴\n• 긍정적 강화 훈련\n• 충분한 운동과 자극\n\n심각한 문제행동은 TALEZ의 행동 전문 훈련사와 상담하여 체계적인 교정 프로그램을 받으시기를 권합니다.';
    }
    
    // TALEZ 서비스 관련
    if (lowerInput.includes('talez') || lowerInput.includes('테일즈') || lowerInput.includes('서비스') || lowerInput.includes('기능')) {
      return 'TALEZ는 종합 반려동물 케어 플랫폼입니다.\n\n주요 서비스:\n• 전문 훈련사 매칭 및 상담\n• 건강관리 스케줄링\n• 반려동물 프로필 관리\n• 교육 커뮤니티\n• 용품 쇼핑몰\n• AI 상담 서비스\n\n각 메뉴를 통해 맞춤형 서비스를 이용하실 수 있으며, 전문가들의 검증된 정보와 조언을 받을 수 있습니다.';
    }
    
    // 기본 응답
    return '구체적인 질문을 해주시면 더 정확하고 도움이 되는 답변을 드릴 수 있습니다.\n\n상담 가능한 주제:\n• 반려동물 훈련 및 교육\n• 건강관리 및 응급상황\n• 영양 및 사료 선택\n• 행동 문제 해결\n• 운동 및 놀이 활동\n\nTALEZ의 전문 서비스를 통해 더 전문적인 도움을 받으실 수도 있습니다.';
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