import { useState, useRef, useEffect } from "react";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Bot,
  Send,
  User,
  RefreshCw,
  PawPrint,
  Sparkles,
  MoreVertical,
  Download,
  Copy,
  Save,
  Trash2,
  Share,
  Info,
  Star,
  Zap,
  Crown,
  Lock,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface Pet {
  id: number;
  name: string;
  breed: string;
  age: number;
  avatar?: string;
}

interface PetAnalysis {
  id: string;
  petId: number;
  petName: string;
  createdAt: Date;
  summary: string;
  behaviorTraits: string[];
  recommendations: string[];
  concerns: string[];
  dietTips: string[];
  trainingProgress: string;
}

export default function AIChatbot() {
  const { isAuthenticated, userName, userRole } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [loading, setLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<number | null>(null);
  const [petAnalyses, setPetAnalyses] = useState<PetAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<PetAnalysis | null>(null);
  const [showAnalysisDetails, setShowAnalysisDetails] = useState<boolean>(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'basic' | 'premium' | 'unlimited'>('free');
  const [usageCount, setUsageCount] = useState<number>(0);
  const [dailyLimit, setDailyLimit] = useState<number>(1);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 스크롤을 최하단으로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // 구독 등급별 일일 사용 한도
  useEffect(() => {
    switch(subscriptionTier) {
      case 'free':
        setDailyLimit(1);
        break;
      case 'basic':
        setDailyLimit(3);
        break;
      case 'premium':
        setDailyLimit(10);
        break;
      case 'unlimited':
        setDailyLimit(Infinity);
        break;
      default:
        setDailyLimit(1);
    }
  }, [subscriptionTier]);
  
  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        // 실제 구현 시 API 호출로 변경할 것
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 더미 데이터 생성
        const mockPets: Pet[] = [
          { id: 1, name: '초코', breed: '푸들', age: 3 },
          { id: 2, name: '루시', breed: '말티즈', age: 2 },
          { id: 3, name: '콩이', breed: '웰시코기', age: 1 }
        ];
        
        const mockConversations: Conversation[] = [
          {
            id: '1',
            title: '강아지 사료 추천',
            messages: [
              {
                id: '1',
                role: 'user',
                content: '3살 푸들에게 좋은 사료를 추천해주세요.',
                timestamp: new Date('2024-05-10T10:30:00')
              },
              {
                id: '2',
                role: 'assistant',
                content: '3살 푸들에게는 성인견용 프리미엄 사료가 적합합니다. 푸들은 피부와 털 관리가 중요하므로 오메가-3와 오메가-6 지방산이 풍부한 사료를 선택하는 것이 좋습니다. 또한 관절 건강을 위해 글루코사민과 콘드로이틴이 함유된 제품도 도움이 됩니다. 인기 있는 브랜드로는 로얄캐닌 푸들 전용 사료, 아카나, 오리젠 등이 있습니다. 급여량은 체중과 활동량에 따라 조절하시는 것이 좋습니다.',
                timestamp: new Date('2024-05-10T10:31:00')
              }
            ],
            createdAt: new Date('2024-05-10T10:30:00'),
            updatedAt: new Date('2024-05-10T10:31:00')
          },
          {
            id: '2',
            title: '자주 짖는 강아지 훈련 방법',
            messages: [
              {
                id: '3',
                role: 'user',
                content: '우리 강아지가 자꾸 집에서 짖어요. 어떻게 훈련해야 할까요?',
                timestamp: new Date('2024-05-08T15:45:00')
              },
              {
                id: '4',
                role: 'assistant',
                content: '강아지의 과도한 짖음 행동을 개선하기 위한 몇 가지 방법을 알려드리겠습니다.\n\n1. 짖는 원인 파악하기: 외부 소리, 불안감, 관심 끌기, 지루함 등 짖는 이유를 파악하는 것이 중요합니다.\n\n2. 무시하기: 관심을 끌기 위해 짖는 경우, 짖을 때는 관심을 주지 않고 조용해졌을 때 칭찬과 보상을 줍니다.\n\n3. 대체 행동 가르치기: "조용" 명령어를 가르쳐 짖는 대신 다른 행동을 하도록 유도합니다.\n\n4. 충분한 운동과 자극: 매일 충분한 운동과 정신적 자극을 제공하여 에너지를 소모시킵니다.\n\n5. 일관성 유지: 모든 가족 구성원이 같은 방식으로 대응해야 효과적입니다.\n\n인내심을 갖고 긍정적인 강화 훈련을 지속적으로 해주세요. 개선이 없다면 전문 훈련사의 도움을 받는 것도 좋은 방법입니다.',
                timestamp: new Date('2024-05-08T15:47:00')
              }
            ],
            createdAt: new Date('2024-05-08T15:45:00'),
            updatedAt: new Date('2024-05-08T15:47:00')
          }
        ];
        
        const mockAnalyses: PetAnalysis[] = [
          {
            id: '1',
            petId: 1,
            petName: '초코',
            createdAt: new Date('2024-05-05'),
            summary: '초코는 사교성이 좋고 활발한 성격을 가진 건강한 푸들입니다. 기본 훈련이 잘 되어 있으며, 사람과의 상호작용을 즐깁니다.',
            behaviorTraits: ['활발함', '사교적', '호기심이 많음', '학습 능력이 좋음'],
            recommendations: ['일주일에 3회 이상 다른 강아지들과 사회화 시간 갖기', '두뇌 자극을 위한 퍼즐 장난감 활용하기', '지루함 방지를 위한 다양한 활동 제공하기'],
            concerns: ['분리불안 초기 징후가 있음', '간식을 과하게 좋아함'],
            dietTips: ['단백질 함량이 높은 사료 권장', '간식은 하루 총 칼로리의 10% 이내로 제한'],
            trainingProgress: '기본 명령어를 잘 이해하고 있으며, 특히 앉아와 기다려 명령에 대한 반응이 좋습니다. 손 명령어는 추가 훈련이 필요합니다.'
          },
          {
            id: '2',
            petId: 2,
            petName: '루시',
            createdAt: new Date('2024-05-02'),
            summary: '루시는 조용하고 온순한 성격의 말티즈로, 사람과의 친밀한 관계를 중요시합니다. 낯선 환경에서 약간의 불안감을 보이지만, 익숙해지면 적응을 잘 합니다.',
            behaviorTraits: ['온순함', '애정표현이 많음', '조용함', '경계심이 있음'],
            recommendations: ['규칙적인 일정 유지하기', '부드러운 목소리와 접근으로 안정감 주기', '새로운 환경에 점진적으로 노출시키기'],
            concerns: ['낯선 사람에 대한 경계심', '털 관리가 필요함'],
            dietTips: ['작은 크기의 사료 권장', '피부와 털 건강을 위한 오메가 지방산 함유 식품 제공'],
            trainingProgress: '기본적인 훈련은 잘 따르지만, 낯선 환경에서 주의가 산만해집니다. 지속적이고 일관된 훈련이 필요합니다.'
          }
        ];
        
        setPets(mockPets);
        setConversations(mockConversations);
        setPetAnalyses(mockAnalyses);
        
        // 첫 번째 대화를 현재 대화로 설정
        if (mockConversations.length > 0) {
          setCurrentConversation(mockConversations[0]);
        }
        
        // 임의의 구독 상태 설정 (실제 구현시 API로 가져와야 함)
        setSubscriptionTier('free');
        setUsageCount(0);
        
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '데이터를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    };
    
    loadData();
  }, [toast]);
  
  // 메시지 내용이 변경될 때마다 스크롤 최하단으로 이동
  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);
  
  // 새로운 대화 시작
  const startNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: '새 대화',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    setInputValue("");
  };
  
  // 메시지 전송
  const sendMessage = async () => {
    if (!inputValue.trim() || !currentConversation) return;
    
    // 사용 한도 체크
    if (usageCount >= dailyLimit && activeTab === 'analysis') {
      setShowUpgradeDialog(true);
      return;
    }
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    // 현재 대화에 메시지 추가
    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, newMessage],
      updatedAt: new Date()
    };
    
    // 제목이 '새 대화'인 경우 첫 메시지로 제목 업데이트
    let conversationWithTitle = updatedConversation;
    if (updatedConversation.title === '새 대화' && updatedConversation.messages.length === 1) {
      const shortTitle = inputValue.slice(0, 30) + (inputValue.length > 30 ? '...' : '');
      conversationWithTitle = {
        ...updatedConversation,
        title: shortTitle
      };
    }
    
    setCurrentConversation(conversationWithTitle);
    setConversations(prev => 
      prev.map(conv => conv.id === currentConversation.id ? conversationWithTitle : conv)
    );
    setInputValue("");
    setLoading(true);
    
    try {
      // 실제 구현 시 API 호출로 변경할 것
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // AI 응답 메시지
      let responseContent = '';
      
      if (activeTab === 'analysis' && selectedPet) {
        responseContent = `${pets.find(p => p.id === selectedPet)?.name || '반려동물'}에 대한 분석을 완료했습니다. 상세 내용은 분석 결과 탭에서 확인하실 수 있습니다.`;
        
        // 새 분석 결과 추가
        const newAnalysis: PetAnalysis = {
          id: Date.now().toString(),
          petId: selectedPet,
          petName: pets.find(p => p.id === selectedPet)?.name || '반려동물',
          createdAt: new Date(),
          summary: `${pets.find(p => p.id === selectedPet)?.name || '반려동물'}는 건강하고 활발한 성격을 가지고 있으며, 훈련에 대한 반응이 좋습니다. 일상 생활에서 특별한 문제 행동은 보이지 않습니다.`,
          behaviorTraits: ['활발함', '사교적', '호기심이 많음', '학습 능력이 좋음'],
          recommendations: ['정기적인 운동 제공', '지루함 방지를 위한 장난감 활용', '일관된 훈련 지속하기'],
          concerns: ['간혹 분리불안 증상을 보임', '과도한 흥분 조절 필요'],
          dietTips: ['균형 잡힌 영양 섭취 유지', '적절한 간식 양 조절'],
          trainingProgress: '기본 명령어를 잘 이해하고 있으며, 지속적인 훈련이 도움이 될 것입니다.'
        };
        
        setPetAnalyses(prev => [newAnalysis, ...prev]);
        setUsageCount(prev => prev + 1);
      } else {
        // 일반 대화 응답
        if (inputValue.includes('사료') || inputValue.includes('먹이')) {
          responseContent = '반려견의 사료 선택은 나이, 크기, 활동량, 건강 상태에 따라 달라집니다. 고품질의 단백질 원료가 주 성분인 프리미엄 사료를 선택하는 것이 좋습니다. 또한 인공 색소, 향료, 방부제가 적게 들어간 제품이 건강에 좋습니다. 특별한 건강 문제가 있다면 수의사와 상담 후 처방식 사료를 고려해보세요.';
        } else if (inputValue.includes('훈련') || inputValue.includes('교육')) {
          responseContent = '반려견 훈련은 일관성, 인내심, 긍정적 강화가 핵심입니다. 원하는 행동에 대해 즉시 보상하고 칭찬하는 방식이 효과적입니다. 짧고 재미있는 훈련 세션을 자주 갖는 것이 좋으며, 강압적인 방법은 피해야 합니다. 기본 명령어부터 시작하여 점진적으로 난이도를 높여가세요. 전문 훈련사의 도움을 받는 것도 좋은 방법입니다.';
        } else if (inputValue.includes('건강') || inputValue.includes('질병')) {
          responseContent = '반려견의 건강 관리는 정기적인 수의사 검진, 예방 접종, 구충제 투여가 기본입니다. 균형 잡힌 식단과 적절한 운동, 치아 관리도 중요합니다. 식욕 변화, 활동량 감소, 비정상적인 배변 활동 등의 변화가 있다면 빨리 수의사를 찾아가세요. 정기적인 건강 검진은 질병을 조기에 발견하고 치료하는 데 도움이 됩니다.';
        } else {
          responseContent = '반려동물과의 생활은 많은 사랑과 책임이 필요합니다. 정기적인 운동, 건강한 식단, 꾸준한 훈련, 그리고 무엇보다 충분한 애정과 관심을 제공하는 것이 중요합니다. 반려동물의 행동과 건강 상태를 주의 깊게 관찰하고, 변화가 있을 때는 적절히 대응해 주세요. 함께하는 시간을 소중히 여기고, 서로에게 좋은 동반자가 되어 주세요.';
        }
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      
      // 응답 메시지 추가
      const finalConversation = {
        ...conversationWithTitle,
        messages: [...conversationWithTitle.messages, assistantMessage],
        updatedAt: new Date()
      };
      
      setCurrentConversation(finalConversation);
      setConversations(prev => 
        prev.map(conv => conv.id === currentConversation.id ? finalConversation : conv)
      );
      
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      toast({
        title: '메시지 전송 오류',
        description: '메시지를 처리하는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 대화 선택
  const selectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
  };
  
  // 대화 삭제
  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    // 현재 대화가 삭제된 경우 다른 대화 선택 또는 비우기
    if (currentConversation?.id === id) {
      const remainingConversations = conversations.filter(conv => conv.id !== id);
      if (remainingConversations.length > 0) {
        setCurrentConversation(remainingConversations[0]);
      } else {
        setCurrentConversation(null);
      }
    }
    
    toast({
      title: '대화 삭제됨',
      description: '대화가 삭제되었습니다.',
    });
  };
  
  // 대화 내용 내보내기
  const exportConversation = () => {
    if (!currentConversation) return;
    
    const conversationText = currentConversation.messages
      .map(msg => `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentConversation.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: '대화 내보내기 완료',
      description: '대화 내용이 텍스트 파일로 저장되었습니다.',
    });
  };
  
  // 분석 결과 상세 보기
  const viewAnalysisDetail = (analysis: PetAnalysis) => {
    setSelectedAnalysis(analysis);
    setShowAnalysisDetails(true);
  };
  
  // 구독 등급 업그레이드
  const upgradeSubscription = (tier: 'basic' | 'premium' | 'unlimited') => {
    setSubscriptionTier(tier);
    setShowUpgradeDialog(false);
    
    toast({
      title: '구독 등급 업그레이드',
      description: `${tier.charAt(0).toUpperCase() + tier.slice(1)} 등급으로 업그레이드되었습니다.`,
    });
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 왼쪽 사이드바 */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>AI 반려동물 도우미</CardTitle>
                <Button variant="ghost" size="sm" onClick={startNewConversation}>
                  <span className="sr-only">새 대화</span>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                반려동물 관련 질문을 해보세요
              </CardDescription>
            </CardHeader>
            <Tabs defaultValue="conversations" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="conversations" className="flex-1">대화 목록</TabsTrigger>
                <TabsTrigger value="analyses" className="flex-1">분석 결과</TabsTrigger>
              </TabsList>
              <TabsContent value="conversations" className="pt-2">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  {conversations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>대화 내역이 없습니다</p>
                      <Button 
                        variant="outline" 
                        onClick={startNewConversation}
                        className="mt-2"
                      >
                        새 대화 시작하기
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 px-1">
                      {conversations.map((conversation) => (
                        <div 
                          key={conversation.id}
                          className={`p-3 rounded-lg cursor-pointer flex justify-between items-start hover:bg-muted group ${
                            currentConversation?.id === conversation.id ? 'bg-muted' : ''
                          }`}
                          onClick={() => selectConversation(conversation)}
                        >
                          <div className="overflow-hidden">
                            <p className="font-medium text-sm truncate">{conversation.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(conversation.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="opacity-0 group-hover:opacity-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => exportConversation()}>
                                <Download className="h-4 w-4 mr-2" />
                                내보내기
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-500" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteConversation(conversation.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                삭제하기
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="analyses" className="pt-2">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  {petAnalyses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>분석 결과가 없습니다</p>
                      <p className="text-sm mt-1">반려동물 분석 탭에서 분석을 시작하세요</p>
                    </div>
                  ) : (
                    <div className="space-y-2 px-1">
                      {petAnalyses.map((analysis) => (
                        <div 
                          key={analysis.id}
                          className="p-3 rounded-lg cursor-pointer hover:bg-muted"
                          onClick={() => viewAnalysisDetail(analysis)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{analysis.petName} 분석</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(analysis.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              분석 완료
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {analysis.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
            
            {isAuthenticated && (
              <CardFooter className="mt-auto border-t pt-4">
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">AI 사용량</p>
                    <Badge variant={
                      subscriptionTier === 'free' ? 'outline' : 
                      subscriptionTier === 'basic' ? 'secondary' : 
                      subscriptionTier === 'premium' ? 'default' : 
                      'destructive'
                    }>
                      {subscriptionTier === 'free' ? '무료' : 
                       subscriptionTier === 'basic' ? '베이직' : 
                       subscriptionTier === 'premium' ? '프리미엄' : 
                       '무제한'}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`rounded-full h-2 ${
                        subscriptionTier === 'free' ? 'bg-blue-500' : 
                        subscriptionTier === 'basic' ? 'bg-green-500' : 
                        subscriptionTier === 'premium' ? 'bg-purple-500' : 
                        'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min((usageCount / dailyLimit) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    오늘 {usageCount}/{subscriptionTier === 'unlimited' ? '∞' : dailyLimit} 회 사용
                  </p>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
        
        {/* 오른쪽 메인 컨텐츠 */}
        <div className="lg:col-span-3">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full">
              <TabsTrigger value="chat" className="flex-1">
                <Bot className="mr-2 h-4 w-4" />
                일반 대화
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex-1">
                <Sparkles className="mr-2 h-4 w-4" />
                반려동물 분석
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="mt-4">
              <Card className="h-[calc(100vh-220px)]">
                <CardContent className="p-6 flex flex-col h-full">
                  {!currentConversation ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Bot className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">AI 반려동물 도우미</h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        반려동물 관련 질문을 해보세요. 훈련, 건강, 영양, 행동 등 다양한 주제에 대해 도움을 드립니다.
                      </p>
                      <Button onClick={startNewConversation}>
                        <Plus className="mr-2 h-4 w-4" />
                        새 대화 시작하기
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto mb-4 pr-2">
                        {currentConversation.messages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-center">
                            <p className="text-muted-foreground">
                              아래에 메시지를 입력하여 대화를 시작하세요
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {currentConversation.messages.map((message) => (
                              <div 
                                key={message.id} 
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div 
                                  className={`rounded-lg p-4 max-w-[80%] ${
                                    message.role === 'user' 
                                      ? 'bg-primary text-primary-foreground ml-auto' 
                                      : 'bg-muted'
                                  }`}
                                >
                                  <div className="flex items-center mb-2">
                                    {message.role === 'assistant' ? (
                                      <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                          <Bot className="h-3 w-3 text-primary" />
                                        </div>
                                        <span className="text-sm font-medium">AI 도우미</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center">
                                        <span className="text-sm font-medium">{userName || '사용자'}</span>
                                        <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center ml-2">
                                          <User className="h-3 w-3" />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="whitespace-pre-line">
                                    {message.content}
                                  </div>
                                  <div className="text-xs opacity-70 mt-2 text-right">
                                    {new Date(message.timestamp).toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="메시지를 입력하세요..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                              }
                            }}
                            disabled={loading}
                            className="flex-1"
                          />
                          <Button 
                            onClick={sendMessage} 
                            disabled={loading || !inputValue.trim()}
                          >
                            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          AI는 정확한 정보를 제공하기 위해 노력하지만, 항상 전문가의 조언을 우선시하세요.
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-4">
              <Card className="h-[calc(100vh-220px)]">
                <CardContent className="p-6 flex flex-col h-full">
                  {!isAuthenticated ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Lock className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">로그인이 필요합니다</h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        반려동물 분석 기능을 사용하려면 로그인이 필요합니다.
                      </p>
                      <Button asChild>
                        <a href="/auth/login">로그인하기</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="mb-6">
                        <h2 className="text-xl font-bold mb-2">AI 반려동물 분석</h2>
                        <p className="text-muted-foreground">
                          반려동물의 일기나 기록을 AI가 분석하여 행동 특성, 추천 사항 등을 제공합니다.
                        </p>
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                          분석할 반려동물 선택
                        </label>
                        <Select
                          value={selectedPet?.toString() || ''}
                          onValueChange={(value) => setSelectedPet(parseInt(value))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="반려동물을 선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            {pets.map((pet) => (
                              <SelectItem key={pet.id} value={pet.id.toString()}>
                                {pet.name} ({pet.breed}, {pet.age}세)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">
                          반려동물 일기 또는 행동 기록
                        </label>
                        <Textarea
                          placeholder="오늘 반려동물의 행동, 건강 상태, 훈련 상황 등을 자세히 기록해주세요..."
                          className="min-h-[200px] resize-none"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          오늘 {usageCount}/{subscriptionTier === 'unlimited' ? '∞' : dailyLimit} 회 사용
                        </div>
                        <Button 
                          onClick={sendMessage} 
                          disabled={loading || !selectedPet || !inputValue.trim()}
                        >
                          {loading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              분석 중...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              분석하기
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* 분석 결과 상세 모달 */}
      <Dialog open={showAnalysisDetails} onOpenChange={setShowAnalysisDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedAnalysis && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center">
                  <PawPrint className="h-5 w-5 mr-2" />
                  {selectedAnalysis.petName} 분석 결과
                </DialogTitle>
                <DialogDescription>
                  분석 일시: {new Date(selectedAnalysis.createdAt).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 my-2">
                <div>
                  <h3 className="text-lg font-medium mb-2">종합 요약</h3>
                  <p>{selectedAnalysis.summary}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">주요 행동 특성</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnalysis.behaviorTraits.map((trait, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">추천 사항</h3>
                  <ul className="space-y-2">
                    {selectedAnalysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">주의 사항</h3>
                  <ul className="space-y-2">
                    {selectedAnalysis.concerns.map((concern, index) => (
                      <li key={index} className="flex items-start">
                        <Info className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">식이 팁</h3>
                  <ul className="space-y-2">
                    {selectedAnalysis.dietTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <Star className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">훈련 진행 상황</h3>
                  <p>{selectedAnalysis.trainingProgress}</p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAnalysisDetails(false)}>
                  닫기
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* 구독 업그레이드 모달 */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>구독 등급 업그레이드</DialogTitle>
            <DialogDescription>
              AI 분석 기능을 더 자주 사용하려면 구독 등급을 업그레이드하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span>베이직</span>
                    <Badge className="ml-2">추천</Badge>
                  </div>
                  <span className="text-xl">₩5,000</span>
                </CardTitle>
                <CardDescription>월 3회 분석 제공</CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Button onClick={() => upgradeSubscription('basic')} className="w-full">
                  베이직 구독하기
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span>프리미엄</span>
                  </div>
                  <span className="text-xl">₩12,000</span>
                </CardTitle>
                <CardDescription>월 10회 분석 제공</CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Button onClick={() => upgradeSubscription('premium')} className="w-full">
                  프리미엄 구독하기
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span>무제한</span>
                    <Badge className="ml-2" variant="outline">
                      <Crown className="h-3 w-3 mr-1" />
                      VIP
                    </Badge>
                  </div>
                  <span className="text-xl">₩25,000</span>
                </CardTitle>
                <CardDescription>무제한 분석 제공</CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Button onClick={() => upgradeSubscription('unlimited')} className="w-full" variant="default">
                  무제한 구독하기
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}