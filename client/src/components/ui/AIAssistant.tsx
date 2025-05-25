import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { X, Send, ChevronRight, ChevronDown, MessageSquare, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const DEFAULT_MODEL = "claude-3-7-sonnet-20250219";

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

export function AIAssistant({ defaultOpen = false, defaultMessages = [] }: AIAssistantProps) {
  const { isAuthenticated, userName } = useAuth();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const systemPrompt = `당신은 반려동물 교육 플랫폼 '털이즈'의 AI 어시스턴트입니다. 
반려동물 훈련, 행동, 건강에 관한 질문에 친절하고 정확하게 답변해 주세요.
항상 존중하는 태도를 유지하고, 과학적 근거에 기반한 정보를 제공하세요.
반려동물의 복지와 안전을 최우선으로 생각하세요.
${isAuthenticated ? `사용자 이름: ${userName}` : '비회원 사용자입니다.'} 
답변은 한국어로 제공하세요.`;

  // 스크롤을 최신 메시지로 이동
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 메시지가 추가될 때마다 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 챗봇이 열릴 때 input에 포커스
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // 메시지 전송 핸들러
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      // 시스템 메시지가 없으면 추가
      const hasSystemMessage = messages.some(msg => msg.role === 'system');
      const messagesWithSystem = hasSystemMessage
        ? [...messages, userMessage]
        : [{ id: 'system-1', role: 'system', content: systemPrompt, timestamp: new Date() }, ...messages, userMessage];

      // Anthropic Claude API 호출
      const response = await apiRequest('POST', '/api/ai/chat', {
        messages: messagesWithSystem.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        model: DEFAULT_MODEL
      });
      
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }
      
      const data = await response.json();
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date()
      };
      
      setMessages(prev => {
        // 첫 메시지가 시스템 메시지라면 유지, 아니면 시스템 메시지 추가
        const systemMsg = prev.find(msg => msg.role === 'system');
        return systemMsg 
          ? [...prev, assistantMessage]
          : [{ id: 'system-1', role: 'system', content: systemPrompt, timestamp: new Date() }, ...prev.filter(msg => msg.role !== 'system'), assistantMessage];
      });
    } catch (err) {
      console.error('AI 응답 오류:', err);
      setError('죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 엔터 키로 메시지 전송
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 채팅창 열기/닫기
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  // 챗봇 최소화/복원
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // 채팅 기록 초기화
  const resetChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* 챗봇 창 */}
      {isOpen && (
        <div 
          className={cn(
            "bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 mb-2 transition-all duration-300 ease-in-out overflow-hidden",
            isMinimized 
              ? "w-72 h-14" 
              : "w-80 sm:w-96 h-[500px] max-h-[80vh]"
          )}
        >
          {/* 헤더 */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-primary text-white">
            <div className="flex items-center" onClick={toggleMinimize} style={{ cursor: 'pointer' }}>
              <Bot className="h-5 w-5 mr-2" />
              <div>
                <h3 className="font-medium text-sm">털이즈 AI 어시스턴트</h3>
                {!isMinimized && (
                  <p className="text-xs text-primary-foreground/80">반려동물 훈련 전문 AI</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-white hover:bg-primary-foreground/20"
                onClick={toggleMinimize}
                aria-label={isMinimized ? "챗봇 창 확장" : "챗봇 창 최소화"}
              >
                {isMinimized ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-white hover:bg-primary-foreground/20"
                onClick={toggleChat}
                aria-label="챗봇 창 닫기"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 최소화되지 않았을 때만 메시지 영역과 입력창 표시 */}
          {!isMinimized && (
            <>
              {/* 메시지 영역 */}
              <div className="flex-1 overflow-y-auto p-4 h-[380px]">
                {messages.length === 0 ? (
                  <div className="text-center flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <Bot className="h-12 w-12 mb-3 text-primary opacity-50" />
                    <h3 className="font-medium mb-1">털이즈 AI 어시스턴트</h3>
                    <p className="text-sm max-w-[250px] mb-4">
                      반려동물 훈련, 행동, 건강에 관한 질문에 답변해 드립니다.
                    </p>
                    <div className="space-y-2 w-full max-w-[250px]">
                      {['반려견 분리불안 해결 방법', '자주 짖는 강아지 훈련법', '고양이 화장실 적응 방법'].map((suggestion, index) => (
                        <Button 
                          key={index}
                          variant="outline" 
                          className="w-full justify-start text-sm py-1 h-auto"
                          onClick={() => {
                            setInput(suggestion);
                            if (inputRef.current) {
                              inputRef.current.focus();
                            }
                          }}
                        >
                          <MessageSquare className="h-3 w-3 mr-2" />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.filter(m => m.role !== 'system').map((message, index) => (
                      <div key={message.id} className={cn(
                        "flex",
                        message.role === 'user' ? "justify-end" : "justify-start"
                      )}>
                        <div className={cn(
                          "flex items-start max-w-[80%] space-x-2",
                          message.role === 'user' ? "flex-row-reverse space-x-reverse" : ""
                        )}>
                          {message.role === 'assistant' && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/logo.png" alt="AI 어시스턴트" />
                              <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
                            </Avatar>
                          )}
                          
                          {message.role === 'user' && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-500 text-white">
                                {userName ? userName.charAt(0).toUpperCase() : '사'}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className={cn(
                            "rounded-lg px-3 py-2 text-sm",
                            message.role === 'user' 
                              ? "bg-blue-500 text-white" 
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          )}>
                            <div className="whitespace-pre-wrap">
                              {message.content}
                            </div>
                            <div className={cn(
                              "text-[10px] mt-1",
                              message.role === 'user' 
                                ? "text-blue-100" 
                                : "text-gray-500 dark:text-gray-400"
                            )}>
                              {new Intl.DateTimeFormat('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              }).format(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start max-w-[80%] space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
                          </Avatar>
                          <div className="rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-75"></div>
                              <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100"></div>
                              <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {error && (
                      <div className="flex justify-start">
                        <div className="flex items-start max-w-[80%] space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-red-500 text-white">!</AvatarFallback>
                          </Avatar>
                          <div className="rounded-lg px-3 py-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
                            {error}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* 입력창 */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-end space-x-2">
                  <div className="flex-1 relative">
                    <Textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="질문을 입력하세요..."
                      className="resize-none min-h-[60px] max-h-[120px] pr-10"
                      disabled={isLoading}
                      aria-label="AI 어시스턴트에게 메시지 입력"
                    />
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="outline" className="text-xs">
                        {isAuthenticated ? 'Premium' : 'Basic'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    aria-label="메시지 보내기"
                    className="h-10 w-10 rounded-full"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="mt-2 flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetChat}
                    className="text-xs h-7 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    disabled={messages.length === 0 || isLoading}
                  >
                    대화 초기화
                  </Button>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {isAuthenticated ? (
                      <span className="flex items-center">
                        <Bot className="h-3 w-3 mr-1 text-primary" />
                        Claude 3.7 Sonnet
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Bot className="h-3 w-3 mr-1 text-primary" />
                        기본 모델
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 챗봇 버튼 */}
      <Button
        size="lg"
        className={cn(
          "rounded-full w-14 h-14 p-0 shadow-lg transition-all",
          isOpen ? "bg-gray-500 hover:bg-gray-600" : "bg-primary hover:bg-primary/90"
        )}
        onClick={toggleChat}
        aria-label={isOpen ? "AI 어시스턴트 닫기" : "AI 어시스턴트 열기"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}