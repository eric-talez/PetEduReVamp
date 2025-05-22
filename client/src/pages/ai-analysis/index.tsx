import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, Clock, Calendar, LineChart, AlertCircle, Check, Brain, 
  Lightbulb, ChevronRight, Book, X, Crown, Zap, Star, Shield, RefreshCw, PackageCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

// 로컬 스토리지에 저장할 분석 정보 인터페이스
interface AnalysisData {
  lastAnalysisDate: string;
  personalityType: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  trainingProgress: {
    obedience: number;
    socialization: number;
    tricks: number;
    agility: number;
  };
  mood: {
    current: string;
    forecast: string;
  };
  compatibility: {
    owner: number;
    otherDogs: number;
    children: number;
    cats: number;
  };
}

// 구독 정보 인터페이스
interface SubscriptionInfo {
  isSubscribed: boolean;
  plan: 'free' | 'basic' | 'premium' | 'unlimited';
  remainingAnalyses: number;
  maxAnalysesPerDay: number;
  startDate: string;
  endDate: string | null;
}

// 기본 분석 데이터
const defaultAnalysis: AnalysisData = {
  lastAnalysisDate: '',
  personalityType: '',
  strengths: [],
  weaknesses: [],
  recommendations: [],
  trainingProgress: {
    obedience: 0,
    socialization: 0,
    tricks: 0,
    agility: 0
  },
  mood: {
    current: '',
    forecast: ''
  },
  compatibility: {
    owner: 0,
    otherDogs: 0,
    children: 0,
    cats: 0
  }
};

// 모의 분석 데이터 생성 함수 (실제 API 연동 전까지 사용)
const generateMockAnalysis = (): AnalysisData => {
  const personalityTypes = [
    '활발하고 사교적인 유형', '차분하고 침착한 유형', 
    '독립적이고 자신감 있는 유형', '신중하고 조심스러운 유형',
    '호기심이 많고 탐험적인 유형', '충성스럽고 보호적인 유형'
  ];
  
  const strengths = [
    '빠른 학습 능력', '사람에 대한 친화력', '다른 동물과의 사회성', 
    '높은 에너지와 활동성', '온순하고 부드러운 성격', '높은 지능',
    '인내심이 좋음', '적응력이 뛰어남', '순종적인 성향'
  ];
  
  const weaknesses = [
    '집중력 부족', '과도한 짖음', '분리 불안', '과도한 활동성', 
    '낯선 사람에 대한 두려움', '훈련 저항성', '다른 동물에 대한 공격성',
    '예민한 성격', '지루함에 취약'
  ];
  
  const recommendations = [
    '규칙적인 운동 일정 만들기', '사회화 훈련 강화하기', '기본 복종 훈련 반복하기',
    '인내심 훈련 시작하기', '놀이를 통한 학습 강화', '일관된 훈련 방식 유지하기',
    '정신적 자극을 주는 장난감 활용하기', '잦은 칭찬과 보상 제공하기',
    '전문 훈련사의 도움 받기', '차분한 환경에서 훈련하기'
  ];
  
  const moods = ['행복함', '활기참', '평온함', '지루함', '불안함', '흥분됨', '호기심'];
  const forecasts = ['매우 좋음', '좋음', '보통', '약간 불안정', '변동 가능성'];
  
  // 랜덤 선택 헬퍼 함수
  const randomSelect = (arr: string[], count: number = 1) => {
    if (count === 1) return arr[Math.floor(Math.random() * arr.length)];
    
    const result = [];
    const copy = [...arr];
    for (let i = 0; i < count && copy.length > 0; i++) {
      const index = Math.floor(Math.random() * copy.length);
      result.push(copy[index]);
      copy.splice(index, 1);
    }
    return result;
  };
  
  // 랜덤 숫자 생성 헬퍼 함수
  const randomProgress = () => Math.floor(Math.random() * 100);
  const randomCompatibility = () => Math.floor(Math.random() * 5) + 1;  // 1-5 사이
  
  return {
    lastAnalysisDate: new Date().toISOString(),
    personalityType: randomSelect(personalityTypes) as string,
    strengths: randomSelect(strengths, 3) as string[],
    weaknesses: randomSelect(weaknesses, 2) as string[],
    recommendations: randomSelect(recommendations, 4) as string[],
    trainingProgress: {
      obedience: randomProgress(),
      socialization: randomProgress(),
      tricks: randomProgress(),
      agility: randomProgress()
    },
    mood: {
      current: randomSelect(moods) as string,
      forecast: randomSelect(forecasts) as string
    },
    compatibility: {
      owner: randomCompatibility(),
      otherDogs: randomCompatibility(),
      children: randomCompatibility(),
      cats: randomCompatibility()
    }
  };
};

// 호환성 점수를 별점으로 표시하는 컴포넌트
const CompatibilityStars = ({ score }: { score: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`w-5 h-5 ${i < score ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}>★</div>
      ))}
    </div>
  );
};

// 샘플 반려견 목록
const samplePets = [
  {
    id: 1,
    name: "토리",
    breed: "골든 리트리버",
    photo: "https://images.unsplash.com/photo-1600077106724-946750eeaf3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
  },
  {
    id: 2,
    name: "몽이",
    breed: "포메라니안",
    photo: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
  },
  {
    id: 3,
    name: "별이",
    breed: "말티즈",
    photo: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
  }
];

// 알림장 샘플 데이터
interface DiaryEntry {
  id: number;
  date: string;
  content: string;
  trainer: string;
  tags: string[];
}

const sampleDiaryEntries: DiaryEntry[] = [
  {
    id: 1,
    date: "2025-05-11",
    content: "오늘 토리는 기본 명령어 훈련에서 탁월한 성과를 보였습니다. '앉아', '기다려' 명령에 즉각 반응했고, 특히 다른 반려견과의 상호작용에서 긍정적인 모습을 보였습니다. 다만 집중력이 중간에 떨어지는 경향이 있어 짧은 세션으로 나누어 훈련하는 것이 좋을 것 같습니다.",
    trainer: "김훈련",
    tags: ["기본훈련", "사회화", "집중력"]
  },
  {
    id: 2,
    date: "2025-05-10",
    content: "몽이는 오늘 처음으로 어질리티 코스를 완주했습니다. 특히 높은 점프에서의 자신감이 향상되었습니다. 새로운 장애물에 대한 두려움도 줄어든 것으로 보입니다. 다음 세션에서는 속도와 정확성을 더 향상시키는 데 집중하겠습니다.",
    trainer: "박코치",
    tags: ["어질리티", "자신감", "신체활동"]
  },
  {
    id: 3,
    date: "2025-05-09",
    content: "별이는 오늘 특별히 사회화 훈련에 중점을 두었습니다. 다른 중형견들과의 만남에서 처음에는 약간의 불안함을 보였으나, 점차 적응하며 긍정적인 상호작용을 보였습니다. 특히 낯선 환경에서의 적응력이 이전보다 향상되었습니다.",
    trainer: "이트레이너",
    tags: ["사회화", "적응력", "스트레스관리"]
  }
];

// 샘플 구독 상품들
const subscriptionPlans = [
  {
    id: 'free',
    name: '무료',
    price: 0,
    description: '하루 1회 AI 분석 (기본)',
    features: ['기본 성격 분석', '훈련 진도 확인', '일일 추천 사항'],
    maxAnalysesPerDay: 1,
    badge: null
  },
  {
    id: 'basic',
    name: '베이직',
    price: 4900,
    description: '하루 3회 AI 분석 + 고급 기능',
    features: ['모든 무료 기능 포함', '고급 성격 분석', '상세 훈련 통계', '맞춤형 훈련 계획'],
    maxAnalysesPerDay: 3,
    badge: '인기'
  },
  {
    id: 'premium',
    name: '프리미엄',
    price: 9900,
    description: '하루 5회 AI 분석 + 전문가 기능',
    features: ['모든 베이직 기능 포함', '전문가 수준 분석', '행동 예측', '문제 행동 해결 가이드', '훈련사 상담 1회'],
    maxAnalysesPerDay: 5,
    badge: null
  },
  {
    id: 'unlimited',
    name: '언리미티드',
    price: 19900,
    description: '무제한 AI 분석 + 전문가 상담',
    features: ['모든 프리미엄 기능 포함', '무제한 AI 분석', '우선 분석 지원', '훈련사 상담 3회', 'VIP 지원'],
    maxAnalysesPerDay: 999,
    badge: '최고급'
  }
];

export default function AIAnalysisPage() {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isAnalysisAvailable, setIsAnalysisAvailable] = useState(true);
  const [timeUntilNextAnalysis, setTimeUntilNextAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<number>(1); // 기본값으로 첫 번째 반려견 선택
  const [selectedDiaryEntry, setSelectedDiaryEntry] = useState<DiaryEntry | null>(null);
  const [showDiarySelection, setShowDiarySelection] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    isSubscribed: false,
    plan: 'free',
    remainingAnalyses: 1,
    maxAnalysesPerDay: 1,
    startDate: new Date().toISOString(),
    endDate: null
  });
  const { toast } = useToast();
  
  // 선택된 반려견 정보
  const selectedPet = samplePets.find(pet => pet.id === selectedPetId);

  // 구독 정보 로드
  useEffect(() => {
    const savedSubscription = localStorage.getItem('petAnalysisSubscription');
    if (savedSubscription) {
      try {
        const parsedSubscription = JSON.parse(savedSubscription) as SubscriptionInfo;
        setSubscription(parsedSubscription);
      } catch (e) {
        console.error('Failed to parse subscription data', e);
      }
    }
  }, []);

  // 분석 데이터 로드 및 다음 분석 가능 시간 체크
  useEffect(() => {
    const savedAnalysis = localStorage.getItem('petAnalysisData');
    if (savedAnalysis) {
      const parsedAnalysis = JSON.parse(savedAnalysis) as AnalysisData;
      setAnalysis(parsedAnalysis);
      
      // 마지막 분석 시간으로부터 지난 시간 확인
      const lastAnalysisDate = new Date(parsedAnalysis.lastAnalysisDate);
      const now = new Date();
      
      // 날짜가 바뀌었는지 확인 (자정이 지났는지)
      const isNewDay = lastAnalysisDate.getDate() !== now.getDate() || 
                       lastAnalysisDate.getMonth() !== now.getMonth() || 
                       lastAnalysisDate.getFullYear() !== now.getFullYear();
      
      // 새로운 날이면 분석 횟수 리셋
      if (isNewDay) {
        setSubscription(prev => ({
          ...prev,
          remainingAnalyses: prev.maxAnalysesPerDay
        }));
        setIsAnalysisAvailable(true);
        return;
      }
      
      // 당일 남은 분석 횟수 확인
      if (subscription.remainingAnalyses <= 0) {
        setIsAnalysisAvailable(false);
        
        // 다음 분석 가능 시간 계산 (자정까지 남은 시간)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeToMidnight = tomorrow.getTime() - now.getTime();
        const hoursToMidnight = Math.floor(timeToMidnight / (1000 * 60 * 60));
        const minutesToMidnight = Math.floor((timeToMidnight % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeUntilNextAnalysis(`${hoursToMidnight}시간 ${minutesToMidnight}분`);
      } else {
        setIsAnalysisAvailable(true);
      }
    } else {
      setIsAnalysisAvailable(true);
    }
  }, [subscription.maxAnalysesPerDay, subscription.remainingAnalyses]);
  
  // 1초마다 남은 시간 업데이트
  useEffect(() => {
    if (!isAnalysisAvailable && analysis) {
      const interval = setInterval(() => {
        const lastAnalysisDate = new Date(analysis.lastAnalysisDate);
        const now = new Date();
        const timeDiff = now.getTime() - lastAnalysisDate.getTime();
        const hoursPassed = timeDiff / (1000 * 60 * 60);
        
        if (hoursPassed >= 24) {
          setIsAnalysisAvailable(true);
          clearInterval(interval);
        } else {
          const hoursRemaining = Math.floor(24 - hoursPassed);
          const minutesRemaining = Math.floor((24 - hoursPassed - hoursRemaining) * 60);
          const secondsRemaining = Math.floor(((24 - hoursPassed - hoursRemaining) * 60 - minutesRemaining) * 60);
          setTimeUntilNextAnalysis(`${hoursRemaining}시간 ${minutesRemaining}분 ${secondsRemaining}초`);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isAnalysisAvailable, analysis]);

  // 새 분석 수행
  const performAnalysis = () => {
    if (subscription.remainingAnalyses <= 0) {
      setShowSubscriptionModal(true);
      return;
    }
    
    setIsLoading(true);
    
    // API 호출 모의 (실제로는 여기서 API 호출)
    setTimeout(() => {
      const newAnalysis = generateMockAnalysis();
      setAnalysis(newAnalysis);
      localStorage.setItem('petAnalysisData', JSON.stringify(newAnalysis));
      
      // 남은 분석 횟수 차감
      const updatedSubscription = {
        ...subscription,
        remainingAnalyses: subscription.remainingAnalyses - 1
      };
      setSubscription(updatedSubscription);
      localStorage.setItem('petAnalysisSubscription', JSON.stringify(updatedSubscription));
      
      setIsLoading(false);
      
      toast({
        title: "분석이 완료되었습니다",
        description: `AI가 반려견의 상태를 분석했습니다. 오늘 ${updatedSubscription.remainingAnalyses}회 더 분석할 수 있습니다.`,
        variant: "default",
      });
    }, 2000);
  };
  
  // 구독 플랜 변경
  const changePlan = (planId: 'free' | 'basic' | 'premium' | 'unlimited') => {
    const selectedPlan = subscriptionPlans.find(plan => plan.id === planId);
    if (!selectedPlan) return;
    
    const updatedSubscription: SubscriptionInfo = {
      isSubscribed: planId !== 'free',
      plan: planId,
      remainingAnalyses: selectedPlan.maxAnalysesPerDay,
      maxAnalysesPerDay: selectedPlan.maxAnalysesPerDay,
      startDate: new Date().toISOString(),
      endDate: planId === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30일
    };
    
    setSubscription(updatedSubscription);
    localStorage.setItem('petAnalysisSubscription', JSON.stringify(updatedSubscription));
    setShowSubscriptionModal(false);
    
    if (planId !== 'free') {
      toast({
        title: `${selectedPlan.name} 구독이 시작되었습니다`,
        description: `이제 하루 ${selectedPlan.maxAnalysesPerDay}회 AI 분석을 사용할 수 있습니다.`,
        variant: "default",
      });
    }
  };

  // 분석 초기화 (개발 중 테스트용, 실제 서비스에서는 제거)
  const resetAnalysis = () => {
    localStorage.removeItem('petAnalysisData');
    setAnalysis(null);
    setIsAnalysisAvailable(true);
    
    toast({
      title: "분석 데이터 초기화",
      description: "분석 데이터가 초기화되었습니다. 새 분석을 진행할 수 있습니다.",
      variant: "default",
    });
  };

  return (
    <div className="container mx-auto py-8">
      {/* 구독 모달 */}
      <Dialog open={showSubscriptionModal} onOpenChange={setShowSubscriptionModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">AI 분석 구독 서비스</DialogTitle>
            <DialogDescription>
              AI 분석 사용 횟수를 늘리려면 아래 구독 플랜 중 하나를 선택하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
            {subscriptionPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`flex flex-col h-full overflow-hidden transition-all ${subscription.plan === plan.id ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'}`}
              >
                <CardHeader className="relative pb-2">
                  {plan.badge && (
                    <Badge className="absolute right-2 top-2 bg-primary">
                      {plan.badge}
                    </Badge>
                  )}
                  
                  <CardTitle className="flex items-center">
                    {plan.id === 'free' && <RefreshCw className="w-5 h-5 mr-2 text-blue-500" />}
                    {plan.id === 'basic' && <Zap className="w-5 h-5 mr-2 text-green-500" />}
                    {plan.id === 'premium' && <Star className="w-5 h-5 mr-2 text-amber-500" />}
                    {plan.id === 'unlimited' && <Crown className="w-5 h-5 mr-2 text-purple-500" />}
                    {plan.name}
                  </CardTitle>
                  
                  <div className="flex items-end">
                    <span className="text-2xl font-bold">
                      {plan.price.toLocaleString()}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">원/월</span>
                    )}
                  </div>
                  
                  <CardDescription>
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow pb-2">
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <Button 
                    onClick={() => changePlan(plan.id as 'free' | 'basic' | 'premium' | 'unlimited')}
                    variant={subscription.plan === plan.id ? "default" : "outline"}
                    className="w-full"
                  >
                    {subscription.plan === plan.id ? (
                      <><Check className="w-4 h-4 mr-2" /> 현재 플랜</>
                    ) : plan.price === 0 ? (
                      "무료로 계속하기"
                    ) : (
                      "선택하기"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    
      {/* Banner */}
      <div className="relative rounded-xl overflow-hidden h-48 md:h-64 mb-8 shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400" 
          alt="반려견 AI 분석"
          className="w-full h-full object-cover absolute"
        />

        <div className="relative h-full flex flex-col justify-center px-6 md:px-10">
          <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg inline-block">
            <h1 className="text-primary dark:text-white text-xl md:text-3xl font-bold">
              반려견 AI 분석
            </h1>
            
            {subscription.isSubscribed && (
              <Badge variant="outline" className="bg-amber-500 border-amber-400 text-white">
                <Crown className="w-3 h-3 mr-1" />
                {subscriptionPlans.find(p => p.id === subscription.plan)?.name || ''} 구독 중
              </Badge>
            )}
          </div>
          
          <p className="text-gray-800 dark:text-gray-200 text-sm md:text-base max-w-xl mb-4 mt-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg">
            AI가 반려견의 성격, 훈련 진도, 그리고 앞으로의 방향을 분석합니다.
          </p>

          <div className="flex items-center mt-2">
            <Button 
              onClick={performAnalysis}
              disabled={!isAnalysisAvailable && subscription.remainingAnalyses <= 0 || isLoading || !selectedPet}
              className="flex items-center"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {isLoading ? '분석 중...' : '지금 분석하기'}
            </Button>
            
            {subscription.remainingAnalyses > 0 ? (
              <div className="flex items-center text-white ml-4">
                <RefreshCw className="w-5 h-5 mr-2" />
                <span>오늘 남은 분석: {subscription.remainingAnalyses}회</span>
              </div>
            ) : !isAnalysisAvailable && (
              <div className="flex items-center text-amber-300 ml-4">
                <Clock className="w-5 h-5 mr-2" />
                <span>다음 분석까지: {timeUntilNextAnalysis}</span>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSubscriptionModal(true)}
              className="ml-auto text-white border-white hover:bg-white/20 hover:text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              구독 상품 보기
            </Button>
          </div>
        </div>
      </div>
      
      {/* 반려견 선택 섹션 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">분석할 반려견 선택</h2>
          {selectedDiaryEntry && (
            <Badge variant="outline" className="flex items-center bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
              <Book className="w-3 h-3 mr-1" />
              알림장 기반 분석
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {samplePets.map(pet => (
            <div 
              key={pet.id}
              onClick={() => setSelectedPetId(pet.id)}
              className={`
                relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                ${selectedPetId === pet.id ? 'border-primary shadow-md' : 'border-transparent'}
              `}
            >
              <div className="aspect-square">
                <img 
                  src={pet.photo} 
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`
                absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent
                ${selectedPetId === pet.id ? 'from-primary/80' : ''}
              `}>
                <p className="text-white font-medium">{pet.name}</p>
                <p className="text-white/80 text-xs">{pet.breed}</p>
              </div>
              {selectedPetId === pet.id && (
                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* 알림장 선택 섹션 */}
        {selectedPetId && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">알림장 내용 선택 (선택사항)</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDiarySelection(!showDiarySelection)}
                className="flex items-center"
              >
                {showDiarySelection ? '접기' : '알림장 선택'}
                <ChevronRight className={`ml-1 w-4 h-4 transition-transform ${showDiarySelection ? 'rotate-90' : ''}`} />
              </Button>
            </div>
            
            {showDiarySelection && (
              <div className="space-y-3 mt-2">
                {sampleDiaryEntries.map(entry => (
                  <div 
                    key={entry.id}
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-all
                      ${selectedDiaryEntry?.id === entry.id 
                        ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
                    `}
                    onClick={() => setSelectedDiaryEntry(selectedDiaryEntry?.id === entry.id ? null : entry)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{new Date(entry.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">훈련사: {entry.trainer}</div>
                      </div>
                      {selectedDiaryEntry?.id === entry.id && (
                        <Badge variant="default">선택됨</Badge>
                      )}
                    </div>
                    <p className="mt-2 text-sm line-clamp-2">{entry.content}</p>
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">분석 대시보드</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            반려견의 종합적인 분석 데이터를 확인해보세요.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {process.env.NODE_ENV === 'development' && (
            <Button 
              variant="outline" 
              onClick={resetAnalysis}
              className="text-red-500 border-red-500"
            >
              초기화 (개발용)
            </Button>
          )}
        </div>
      </div>

      {!analysis ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Brain className="w-16 h-16 text-primary/50" />
            <h2 className="text-xl font-semibold">아직 분석 데이터가 없습니다</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              '지금 분석하기' 버튼을 클릭하여 반려견에 대한 AI 분석을 시작하세요. 
              성격, 훈련 진도, 추천 활동 등 다양한 인사이트를 얻을 수 있습니다.
            </p>
            <Button 
              onClick={performAnalysis}
              disabled={isLoading}
              size="lg"
              className="mt-4"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {isLoading ? '분석 중...' : '지금 분석하기'}
            </Button>
          </div>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="personality">성격 분석</TabsTrigger>
            <TabsTrigger value="training">훈련 진도</TabsTrigger>
            <TabsTrigger value="recommendations">맞춤 추천</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-primary" />
                    성격 유형
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <div className="text-2xl font-bold">{analysis.personalityType}</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {analysis.strengths.map((strength, i) => (
                        <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="w-5 h-5 mr-2 text-primary" />
                    현재 상태
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">현재 기분</div>
                      <div className="text-lg font-medium">{analysis.mood.current}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">앞으로의 예상</div>
                      <div className="text-lg font-medium">{analysis.mood.forecast}</div>
                    </div>
                    <div className="col-span-2 mt-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">다음 분석까지</div>
                      {!isAnalysisAvailable ? (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-amber-500" />
                          <span>{timeUntilNextAnalysis}</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Check className="w-4 h-4 mr-2 text-green-500" />
                          <span>지금 분석 가능</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>훈련 개요</CardTitle>
                <CardDescription>주요 훈련 영역별 진도</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>기본 복종</span>
                        <span>{analysis.trainingProgress.obedience}%</span>
                      </div>
                      <Progress value={analysis.trainingProgress.obedience} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>사회화</span>
                        <span>{analysis.trainingProgress.socialization}%</span>
                      </div>
                      <Progress value={analysis.trainingProgress.socialization} className="h-2" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>트릭</span>
                        <span>{analysis.trainingProgress.tricks}%</span>
                      </div>
                      <Progress value={analysis.trainingProgress.tricks} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>어질리티</span>
                        <span>{analysis.trainingProgress.agility}%</span>
                      </div>
                      <Progress value={analysis.trainingProgress.agility} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>호환성 점수</CardTitle>
                <CardDescription>다양한 환경과의 호환성</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">보호자와의 호환성</div>
                    <CompatibilityStars score={analysis.compatibility.owner} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">다른 강아지와의 호환성</div>
                    <CompatibilityStars score={analysis.compatibility.otherDogs} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">아이들과의 호환성</div>
                    <CompatibilityStars score={analysis.compatibility.children} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">고양이와의 호환성</div>
                    <CompatibilityStars score={analysis.compatibility.cats} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="personality" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>성격 프로필</CardTitle>
                <CardDescription>AI가 분석한 반려견의 성격 특성</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">주요 성격 유형</h3>
                    <div className="flex items-center p-4 bg-primary/10 rounded-lg">
                      <Brain className="w-8 h-8 text-primary mr-4" />
                      <div>
                        <div className="text-2xl font-bold">{analysis.personalityType}</div>
                        <div className="text-gray-600 dark:text-gray-400 mt-1">
                          이 성격 유형은 반려견의 행동 패턴과 학습 방식에 영향을 미칩니다.
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">강점</h3>
                      <ul className="space-y-3">
                        {analysis.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mr-2">
                              <Check className="w-4 h-4" />
                            </div>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">개선 영역</h3>
                      <ul className="space-y-3">
                        {analysis.weaknesses.map((weakness, i) => (
                          <li key={i} className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mr-2">
                              <AlertCircle className="w-4 h-4" />
                            </div>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">호환성</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">보호자와의 호환성</div>
                        <CompatibilityStars score={analysis.compatibility.owner} />
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">다른 강아지와의 호환성</div>
                        <CompatibilityStars score={analysis.compatibility.otherDogs} />
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">아이들과의 호환성</div>
                        <CompatibilityStars score={analysis.compatibility.children} />
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">고양이와의 호환성</div>
                        <CompatibilityStars score={analysis.compatibility.cats} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>현재 기분 상태</CardTitle>
                <CardDescription>반려견의 현재 감정 상태와 앞으로의 예측</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3">
                        <span className="text-xl">😊</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">현재 기분</div>
                        <div className="text-xl font-bold">{analysis.mood.current}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      반려견의 현재 기분은 최근의 활동, 훈련, 그리고 주변 환경에 의해 영향을 받습니다.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-3">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">앞으로의 예상</div>
                        <div className="text-xl font-bold">{analysis.mood.forecast}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      이 예측은 반려견의 기질, 최근 패턴, 그리고 현재 환경을 분석하여 생성되었습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="training" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>훈련 진도</CardTitle>
                <CardDescription>주요 훈련 영역별 진도와 분석</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-semibold">기본 복종</h3>
                      <span className="text-lg font-bold">{analysis.trainingProgress.obedience}%</span>
                    </div>
                    <Progress value={analysis.trainingProgress.obedience} className="h-3 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      앉기, 엎드리기, 기다리기와 같은 기본 명령에 대한 이해도와 응답성을 나타냅니다.
                      {analysis.trainingProgress.obedience < 30 && " 이 영역에서 더 많은 연습이 필요합니다."}
                      {analysis.trainingProgress.obedience >= 30 && analysis.trainingProgress.obedience < 70 && " 안정적인 진도를 보이고 있습니다."}
                      {analysis.trainingProgress.obedience >= 70 && " 이 영역에서 뛰어난 진도를 보이고 있습니다."}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-semibold">사회화</h3>
                      <span className="text-lg font-bold">{analysis.trainingProgress.socialization}%</span>
                    </div>
                    <Progress value={analysis.trainingProgress.socialization} className="h-3 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      다른 강아지, 사람, 그리고 다양한 환경에 대한 적응력을 나타냅니다.
                      {analysis.trainingProgress.socialization < 30 && " 더 다양한 사회적 경험이 필요합니다."}
                      {analysis.trainingProgress.socialization >= 30 && analysis.trainingProgress.socialization < 70 && " 점차 사회적 상황에 익숙해지고 있습니다."}
                      {analysis.trainingProgress.socialization >= 70 && " 대부분의 사회적 상황에서 안정적인 모습을 보입니다."}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-semibold">트릭</h3>
                      <span className="text-lg font-bold">{analysis.trainingProgress.tricks}%</span>
                    </div>
                    <Progress value={analysis.trainingProgress.tricks} className="h-3 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      손 내밀기, 구르기, 점프하기와 같은 복잡한 동작에 대한 학습 능력을 나타냅니다.
                      {analysis.trainingProgress.tricks < 30 && " 기초적인 트릭부터 시작해보세요."}
                      {analysis.trainingProgress.tricks >= 30 && analysis.trainingProgress.tricks < 70 && " 중간 수준의 트릭에 도전해볼 준비가 되었습니다."}
                      {analysis.trainingProgress.tricks >= 70 && " 고급 수준의 트릭도 배울 준비가 되었습니다."}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-semibold">어질리티</h3>
                      <span className="text-lg font-bold">{analysis.trainingProgress.agility}%</span>
                    </div>
                    <Progress value={analysis.trainingProgress.agility} className="h-3 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      장애물 코스, 터널, 점프대와 같은 물리적 도전에 대한 대응 능력을 나타냅니다.
                      {analysis.trainingProgress.agility < 30 && " 기초 신체 조절 능력부터 훈련해보세요."}
                      {analysis.trainingProgress.agility >= 30 && analysis.trainingProgress.agility < 70 && " 중간 수준의 어질리티 코스에 도전해볼 수 있습니다."}
                      {analysis.trainingProgress.agility >= 70 && " 어질리티 경기에도 참가할 수 있는 수준입니다."}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="inline-block w-4 h-4 mr-1" />
                  마지막 업데이트: {new Date(analysis.lastAnalysisDate).toLocaleString()}
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>맞춤 추천</CardTitle>
                <CardDescription>AI가 분석한 반려견에게 적합한 활동 및 훈련 방법</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysis.recommendations.map((recommendation, i) => (
                      <div key={i} className="flex p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3">
                          <Lightbulb className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium">{recommendation}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">맞춤형 교육 과정 추천</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <Badge variant="outline" className="mb-2 border-primary text-primary">추천됨</Badge>
                          <CardTitle className="text-lg">기본 복종 마스터하기</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            반려견의 현재 단계에 맞춰진 체계적인 기본 복종 훈련 과정으로, 안정적인 명령 이행의 기초를 다집니다.
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full">과정 보기</Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">사회화 훈련 프로그램</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            다양한 환경, 사람, 그리고 동물들과의 상호작용을 통해 사회성을 키우는 단계별 훈련 과정입니다.
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full">과정 보기</Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">문제 행동 교정</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            짖음, 물기, 분리 불안 등의 일반적인 문제 행동을 긍정적인 방법으로 교정하는 방법을 배웁니다.
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full">과정 보기</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}