import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Dog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

// 메시지 타입 정의
type MessageType = 'system' | 'user' | 'ai';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

interface PetAIChatBoxProps {
  isFullPage?: boolean;
}

export function PetAIChatBox({ isFullPage = false }: PetAIChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'system',
      content: '반려동물 케어에 대해 궁금한 점이 있으신가요? 질문해 주세요!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // AI 응답 생성 함수
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // API 호출 대신 임시로 샘플 응답 생성 로직 구현
      // 실제 구현시 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 1500)); // 로딩 효과를 위한 딜레이
      
      // 간단한 키워드 기반 응답 (실제로는 AI API 호출로 대체)
      if (userMessage.includes('사료') || userMessage.includes('먹이')) {
        return '반려견의 종류, 크기, 나이, 활동량에 따라 적절한 사료를 선택하는 것이 중요합니다. 고품질의 단백질 소스가 첫 번째 재료로 표시된 사료를 선택하고, 곡물 알러지가 있는 경우 곡물 없는 옵션을 고려해보세요. 또한 급여량은 사료 포장에 명시된 가이드라인을 참고하되, 반려견의 체중과 활동량에 맞게 조절하는 것이 좋습니다.';
      } else if (userMessage.includes('훈련') || userMessage.includes('교육')) {
        return '반려견 훈련의 기본은 일관성과 긍정적 강화입니다. 명령어를 가르칠 때는 짧고 분명한 단어를 사용하고, 올바른 행동에는 간식이나 칭찬으로 즉시 보상해주세요. 훈련 세션은 10-15분으로 짧게 유지하고, 하루에 여러 번 반복하는 것이 효과적입니다. 처벌보다는 올바른 행동에 보상하는 방식이 더 효과적이며 반려견과의 유대감도 강화할 수 있습니다.';
      } else if (userMessage.includes('건강') || userMessage.includes('병원')) {
        return '반려견의 건강을 위해 정기적인 수의사 방문, 예방 접종, 구충제 투여가 중요합니다. 또한 매일 신체 상태를 확인하고, 식욕 변화나 행동 변화가 있는지 주의 깊게 관찰하세요. 청결한 물과 적절한 영양 공급, 충분한 운동과 정신적 자극도 건강 유지에 필수적입니다. 이상 징후가 보이면 즉시 수의사와 상담하는 것이 좋습니다.';
      } else if (userMessage.includes('산책') || userMessage.includes('운동')) {
        return '반려견의 크기, 나이, 건강 상태에 따라 적절한 운동량이 다릅니다. 일반적으로 하루 최소 30분의 산책이 권장되며, 에너지가 많은 품종은 더 많은 운동이 필요할 수 있습니다. 산책은 신체적 운동뿐만 아니라 정신적 자극과 사회화에도 중요합니다. 날씨가 매우 덥거나 추울 때는 산책 시간을 조절하고, 충분한 물을 제공해야 합니다.';
      } else if (userMessage.includes('짖음') || userMessage.includes('소음')) {
        return '과도한 짖음은 여러 원인이 있을 수 있습니다. 지루함, 불안, 영역 방어, 관심 끌기 등이 주요 원인입니다. 짖음의 원인을 파악하고 그에 맞는 접근이 중요합니다. 충분한 운동과 정신적 자극을 제공하고, "조용히" 같은 명령어 훈련을 통해 개선할 수 있습니다. 특히 분리불안으로 인한 짖음은 점진적인 혼자 있는 시간 훈련이 도움이 될 수 있습니다.';
      } else {
        return '반려동물 돌봄에 대한 질문을 더 구체적으로 해주시면 더 자세한 답변을 드릴 수 있습니다. 사료, 훈련, 건강 관리, 산책, 행동 문제 등 다양한 주제에 대해 질문해주세요.';
      }
    } catch (error) {
      console.error('AI 응답 생성 오류:', error);
      return '죄송합니다. 현재 응답을 생성하는 데 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
  };

  // 메시지 전송 처리
  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // AI 응답 생성
      const aiResponse = await generateAIResponse(input);
      
      // AI 메시지 추가
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('메시지 처리 오류:', error);
      
      toast({
        title: '오류 발생',
        description: '메시지를 처리하는 중 문제가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      
      // 텍스트 입력창에 포커스
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // 엔터 키 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col ${isFullPage ? 'h-[80vh]' : 'h-[600px]'} bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden`}>
      {/* 채팅 헤더 */}
      <div className="bg-primary text-white p-4 flex items-center">
        <Dog className="mr-2 h-5 w-5" />
        <h2 className="font-bold">반려동물 AI 도우미</h2>
      </div>
      
      {/* 메시지 영역 */}
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-lg 
                ${message.type === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : message.type === 'system' 
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}>
                <p className="whitespace-pre-line">{message.content}</p>
                <div className={`text-xs mt-1 ${message.type === 'user' ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p>응답 생성 중...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
      
      {/* 메시지 입력 영역 */}
      <div className="p-3 border-t dark:border-slate-600 bg-white dark:bg-slate-800">
        <div className="flex space-x-2">
          <Textarea
            ref={inputRef}
            placeholder="강아지 케어에 대해 질문해보세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow resize-none"
            rows={2}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || input.trim() === ''}
            className="self-end"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          * 이 서비스는 계정 로그인 없이 사용할 수 있으나, 보다 개인화된 도움을 위해 로그인하여 반려동물 정보를 등록하세요.
        </div>
      </div>
    </div>
  );
}