
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { ChevronUp, X, Send, Maximize2, Minimize2, MessageCircle, PawPrint, RefreshCw, Move } from 'lucide-react';
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

type Position = {
  x: number;
  y: number;
};

type Size = {
  width: number;
  height: number;
};

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

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
  
  // 위치 및 크기 상태
  const [position, setPosition] = useState<Position>({ x: 24, y: 24 });
  const [size, setSize] = useState<Size>({ width: 380, height: 500 });
  
  // 드래그 및 리사이즈 상태
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeDirection | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, posX: 0, posY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { theme } = useTheme();
  
  // 전역 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = () => {
      if (window.__peteduAuthState && window.__peteduAuthState.isAuthenticated) {
        setIsAuthenticated(window.__peteduAuthState.isAuthenticated);
      } else {
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

  // 드래그 시작
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (isExpanded) return; // 확대 모드에서는 드래그 불가
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y
    });
  }, [position, isExpanded]);

  // 리사이즈 시작
  const handleResizeStart = useCallback((e: React.MouseEvent, direction: ResizeDirection) => {
    if (isExpanded) return; // 확대 모드에서는 리사이즈 불가
    
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      posX: position.x,
      posY: position.y
    });
  }, [size, position, isExpanded]);

  // 마우스 이동 처리
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // 화면 경계 제한
      const maxX = window.innerWidth - size.width - 24;
      const maxY = window.innerHeight - size.height - 24;
      
      const newX = Math.max(24, Math.min(maxX, dragStart.posX + deltaX));
      const newY = Math.max(24, Math.min(maxY, dragStart.posY + deltaY));
      
      setPosition({ x: newX, y: newY });
    }
    
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = resizeStart.posX;
      let newY = resizeStart.posY;
      
      // 방향에 따른 크기 조절
      if (isResizing.includes('e')) {
        newWidth = Math.max(320, Math.min(800, resizeStart.width + deltaX));
      }
      if (isResizing.includes('w')) {
        const widthChange = Math.max(320, Math.min(800, resizeStart.width - deltaX)) - resizeStart.width;
        newWidth = resizeStart.width + widthChange;
        newX = resizeStart.posX - widthChange;
      }
      if (isResizing.includes('s')) {
        newHeight = Math.max(400, Math.min(700, resizeStart.height + deltaY));
      }
      if (isResizing.includes('n')) {
        const heightChange = Math.max(400, Math.min(700, resizeStart.height - deltaY)) - resizeStart.height;
        newHeight = resizeStart.height + heightChange;
        newY = resizeStart.posY - heightChange;
      }
      
      // 화면 경계 제한
      newX = Math.max(24, Math.min(window.innerWidth - newWidth - 24, newX));
      newY = Math.max(24, Math.min(window.innerHeight - newHeight - 24, newY));
      
      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, isResizing, dragStart, resizeStart, size]);

  // 마우스 업 처리
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(null);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // 이벤트 리스너 등록/해제
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      
      if (isDragging) {
        document.body.style.cursor = 'move';
      } else if (isResizing) {
        const cursorMap: Record<ResizeDirection, string> = {
          'n': 'n-resize',
          's': 's-resize',
          'e': 'e-resize',
          'w': 'w-resize',
          'ne': 'ne-resize',
          'nw': 'nw-resize',
          'se': 'se-resize',
          'sw': 'sw-resize'
        };
        document.body.style.cursor = cursorMap[isResizing];
      }
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsExpanded(false);
  };

  const toggleExpand = () => {
    if (isExpanded) {
      // 축소할 때 이전 위치로 복원
      setPosition({ x: 24, y: 24 });
    }
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
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
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: data.message || '죄송합니다. 응답을 생성하는데 문제가 발생했습니다.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
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

  // 리사이즈 핸들 컴포넌트
  const ResizeHandle: React.FC<{ direction: ResizeDirection; className: string }> = ({ direction, className }) => (
    <div
      className={cn("absolute opacity-0 hover:opacity-100 transition-opacity", className)}
      onMouseDown={(e) => handleResizeStart(e, direction)}
      style={{ cursor: `${direction}-resize` }}
    />
  );

  const shouldHideChatbot = () => {
    if (window.location.pathname.includes('/admin')) return true;
    if (window.location.pathname.includes('/ai-chatbot') || 
        window.location.pathname.includes('/ai-analysis')) return true;
    if (isAuthenticated && (
      window.location.pathname.includes('/ai-') ||
      window.location.pathname.includes('/trainer/notebook')
    )) return true;
    return false;
  };

  const handleGoToLogin = () => {
    window.location.href = "/auth/login";
  };

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
                className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
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
          ref={chatRef}
          className={cn(
            "fixed shadow-lg transition-all duration-300 z-50 select-none",
            isExpanded ? "inset-4 md:inset-10" : ""
          )}
          style={!isExpanded ? {
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${size.width}px`,
            height: `${size.height}px`
          } : undefined}
        >
          {/* 리사이즈 핸들들 (확대 모드가 아닐 때만 표시) */}
          {!isExpanded && (
            <>
              {/* 코너 핸들 */}
              <ResizeHandle direction="nw" className="top-0 left-0 w-3 h-3 bg-gray-400 rounded-br-md" />
              <ResizeHandle direction="ne" className="top-0 right-0 w-3 h-3 bg-gray-400 rounded-bl-md" />
              <ResizeHandle direction="sw" className="bottom-0 left-0 w-3 h-3 bg-gray-400 rounded-tr-md" />
              <ResizeHandle direction="se" className="bottom-0 right-0 w-3 h-3 bg-gray-400 rounded-tl-md" />
              
              {/* 모서리 핸들 */}
              <ResizeHandle direction="n" className="top-0 left-3 right-3 h-2 bg-gray-300 hover:bg-gray-400" />
              <ResizeHandle direction="s" className="bottom-0 left-3 right-3 h-2 bg-gray-300 hover:bg-gray-400" />
              <ResizeHandle direction="w" className="left-0 top-3 bottom-3 w-2 bg-gray-300 hover:bg-gray-400" />
              <ResizeHandle direction="e" className="right-0 top-3 bottom-3 w-2 bg-gray-300 hover:bg-gray-400" />
            </>
          )}

          <CardHeader 
            className={cn(
              "p-3 flex flex-row items-center justify-between space-y-0",
              !isExpanded && "cursor-move"
            )}
            onMouseDown={!isExpanded ? handleDragStart : undefined}
          >
            <CardTitle className="text-sm md:text-base flex items-center">
              <PawPrint className="h-4 w-4 mr-2" />
              반려동물 AI 어시스턴트
            </CardTitle>
            
            <div className="flex space-x-1">
              {!isExpanded && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  title="이동"
                >
                  <Move className="h-4 w-4" />
                </Button>
              )}
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
            isExpanded 
              ? "h-[calc(100%-7rem)]" 
              : `h-[${size.height - 140}px]`
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
              {!isExpanded && (
                <span className="text-xs opacity-50">
                  {size.width}×{size.height}
                </span>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default SimpleChatbot;
