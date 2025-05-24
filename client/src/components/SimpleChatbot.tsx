import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { ChevronUp, X, Send, Maximize2, Minimize2, MessageCircle, PawPrint, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '../hooks/use-theme';

// 전역 인증 상태 타입 확장
declare global {
  interface Window {
    __peteduAuthState?: {
      isAuthenticated: boolean;
      userRole: string | null;
      userName: string | null;
    };
  }
}

type Message = {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
};

const SimpleChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: '안녕하세요! 펫에듀 AI 어시스턴트입니다. 반려동물 관련 질문이 있으시면 편하게 물어보세요.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { theme } = useTheme();
  
  // 전역 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = () => {
      // window.__peteduAuthState가 있으면 해당 정보 사용
      if (window.__peteduAuthState && window.__peteduAuthState.isAuthenticated) {
        setIsAuthenticated(window.__peteduAuthState.isAuthenticated);
      } else {
        // 로컬 스토리지에서 확인
        const storedAuth = localStorage.getItem('petedu_auth');
        if (storedAuth) {
          try {
            const parsedAuth = JSON.parse(storedAuth);
            setIsAuthenticated(true);
          } catch (e) {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      }
    };
    
    checkAuthStatus();
    
    // 로그인/로그아웃 이벤트 리스너
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('login', handleAuthChange);
    window.addEventListener('logout', handleAuthChange);
    
    return () => {
      window.removeEventListener('login', handleAuthChange);
      window.removeEventListener('logout', handleAuthChange);
    };
  }, []);
  
  // 자동 스크롤
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 채팅창이 열리면 인풋에 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsExpanded(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // API 호출 처리 (실제로는 OpenAI API 호출)
      // OPENAI_API_KEY 환경 변수 사용
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          history: messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          isAuthenticated: isAuthenticated
        }),
      });
      
      if (!response.ok) {
        throw new Error('AI 응답을 가져오는데 실패했습니다');
      }
      
      const data = await response.json();
      
      // 봇 응답 추가
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: data.message || '죄송합니다. 응답을 생성하는데 문제가 발생했습니다.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // 오류 처리
      console.error('AI 채팅 오류:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        text: '안녕하세요! 펫에듀 AI 어시스턴트입니다. 반려동물 관련 질문이 있으시면 편하게 물어보세요.',
        timestamp: new Date()
      }
    ]);
  };

  // 로그인 중이거나 특정 경로에서는 챗봇 버튼을 숨김
  const shouldHideChatbot = () => {
    // 관리자 페이지에서는 숨김
    if (window.location.pathname.includes('/admin')) return true;
    
    // 이미 AI 채팅/분석 페이지에 있는 경우 숨김
    if (window.location.pathname.includes('/ai-chatbot') || 
        window.location.pathname.includes('/ai-analysis')) return true;
    
    // 인증된 사용자이고 AI 관련 경로에 있는 경우 숨김
    if (isAuthenticated && (
      window.location.pathname.includes('/ai-') ||
      window.location.pathname.includes('/trainer/notebook')
    )) return true;
    
    return false;
  };

  // 로그인을 위한 이동 함수
  const handleGoToLogin = () => {
    window.location.href = "/auth/login";
  };

  // 전체 Pet AI 분석으로 이동
  const handleGoToFullAnalysis = () => {
    if (isAuthenticated) {
      window.location.href = "/ai-analysis";
    } else {
      window.location.href = "/auth/login?redirect=/ai-analysis";
    }
  };

  if (shouldHideChatbot()) {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
                size="icon"
                onClick={handleOpen}
                aria-label="AI 반려동물 상담 챗봇 열기"
              >
                <PawPrint className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>AI 반려동물 상담</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {isOpen && (
        <Card 
          className={cn(
            "fixed shadow-lg transition-all duration-300 z-50",
            isExpanded 
              ? "inset-4 md:inset-10" 
              : "bottom-6 right-6 w-80 md:w-96"
          )}
        >
          <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm md:text-base flex items-center">
              <PawPrint className="h-4 w-4 mr-2" />
              반려동물 AI 어시스턴트
            </CardTitle>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={toggleExpand}
                aria-label={isExpanded ? "창 축소하기" : "창 확대하기"}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleClose}
                aria-label="챗봇 닫기"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className={cn(
            "px-3 overflow-y-auto", 
            isExpanded ? "h-[calc(100%-7rem)]" : "h-80"
          )}>
            <div className="flex flex-col space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={cn(
                    "flex",
                    message.type === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div 
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      message.type === 'user' 
                        ? "bg-primary text-primary-foreground" 
                        : theme === 'dark'
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    theme === 'dark'
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    <div className="flex space-x-1 items-center">
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          <CardFooter className="p-3 pt-0 flex flex-col space-y-2">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                ref={inputRef}
                placeholder="반려동물에 관해 물어보세요..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="icon" onClick={handleReset} title="대화 초기화">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </form>
            
            <div className="flex justify-between w-full text-xs text-muted-foreground">
              <button 
                className="hover:underline" 
                onClick={isAuthenticated ? handleGoToFullAnalysis : handleGoToLogin}
              >
                {isAuthenticated ? '고급 AI 분석 사용하기 →' : '로그인하여 더 많은 기능 사용하기 →'}
              </button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default SimpleChatbot;