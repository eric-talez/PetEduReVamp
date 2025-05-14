import { useState, useRef, useEffect } from "react";
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, Zap, ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function SimpleChatbot() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // 스크롤을 최하단으로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // 메시지 내용이 변경될 때마다 스크롤 최하단으로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // 챗봇 토글
  const toggleChatbot = () => {
    setIsExpanded(!isExpanded);
    
    // 처음 열때 인사 메시지 추가
    if (!isExpanded && messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: '안녕하세요! 반려동물에 관한 질문이 있으신가요? 훈련, 건강, 영양 등에 대해 물어보세요. 더 자세한 분석을 원하시면 로그인 후 AI 분석 기능을 이용해보세요.'
        }
      ]);
    }
  };
  
  // 메시지 전송
  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      // 간단한 응답 로직 (실제로는 API 연동이 필요함)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let responseContent = '';
      
      if (inputValue.toLowerCase().includes('훈련') || inputValue.toLowerCase().includes('교육')) {
        responseContent = '반려견 훈련은 일관성, 인내심, 긍정적 강화가 핵심입니다. 기본 명령어부터 시작하여 점진적으로 난이도를 높여가는 것이 좋습니다. 더 자세한 분석과 맞춤형 훈련 계획은 로그인 후 AI 분석 서비스를 이용해보세요.';
      } else if (inputValue.toLowerCase().includes('사료') || inputValue.toLowerCase().includes('먹이')) {
        responseContent = '반려견의 사료는 나이, 크기, 활동량, 건강 상태에 따라 달라집니다. 고품질의 단백질 원료가 주 성분인 프리미엄 사료를 선택하는 것이 좋습니다. 반려견의 영양 상태 분석과 맞춤형 식단은 로그인 후 이용 가능합니다.';
      } else if (inputValue.toLowerCase().includes('건강') || inputValue.toLowerCase().includes('병원')) {
        responseContent = '반려견의 건강 관리는 정기적인 수의사 검진, 예방 접종, 구충제 투여가 기본입니다. 특별한 증상이 있다면 반드시 수의사의 진료를 받으세요. 건강 기록을 체계적으로 관리하려면 로그인 후 펫에듀 서비스를 이용해보세요.';
      } else {
        responseContent = '반려동물과의 생활은 많은 사랑과 책임이 필요합니다. 보다 전문적인 도움이 필요하시면 로그인 후 AI 분석 서비스를 이용해보세요. 맞춤형 분석과 훈련 계획을 제공해드립니다.';
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('메시지 처리 오류:', error);
      toast({
        title: '오류가 발생했습니다',
        description: '메시지를 처리하는 중 문제가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 엔터 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* 챗봇 버튼 */}
      <Button
        onClick={toggleChatbot}
        className="rounded-full w-12 h-12 shadow-lg p-0 flex items-center justify-center"
      >
        {isExpanded ? <ChevronDown className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>
      
      {/* 챗봇 카드 */}
      {isExpanded && (
        <Card className="absolute bottom-16 right-0 w-80 md:w-96 shadow-xl transition-all duration-300 overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="h-5 w-5 text-primary mr-2" />
                <CardTitle className="text-base">AI 반려동물 도우미</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs px-2 py-0">
                <Zap className="h-3 w-3 mr-1" />
                무료 체험
              </Badge>
            </div>
            <CardDescription className="text-xs mt-1">
              반려동물에 관한 질문을 해보세요
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-4 max-h-96">
            <ScrollArea className="h-72">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`rounded-lg p-3 max-w-[85%] ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground ml-auto' 
                          : 'bg-accent'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {message.role === 'assistant' ? (
                          <div className="flex items-center">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-1">
                              <Bot className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-xs font-medium">AI 도우미</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center mr-1">
                              <User className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-xs font-medium">나</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-lg p-3 bg-accent">
                      <div className="flex items-center mb-1">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-1">
                          <Bot className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-xs font-medium">AI 도우미</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '600ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="p-4 pt-2 border-t">
            <div className="flex w-full space-x-2">
              <Input
                placeholder="질문을 입력하세요..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}