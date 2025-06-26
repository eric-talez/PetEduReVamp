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
  lastAnalysisDate: new Date().toISOString().split('T')[0],
  personalityType: '활발한 탐험가',
  strengths: ['높은 에너지', '사회성', '학습 능력'],
  weaknesses: ['집중력 부족', '과도한 활동성'],
  recommendations: [
    '매일 30분 이상 산책',
    '다양한 장난감으로 정신적 자극',
    '기본 명령어 반복 훈련'
  ],
  trainingProgress: {
    obedience: 75,
    socialization: 85,
    tricks: 60,
    agility: 90
  },
  mood: {
    current: '활발함',
    forecast: '안정적'
  },
  compatibility: {
    owner: 95,
    otherDogs: 80,
    children: 85,
    cats: 60
  }
};

// Mock analysis data generator
const generateMockAnalysis = (): AnalysisData => {
  const personalities = ['활발한 탐험가', '조용한 관찰자', '사교적인 리더', '신중한 수호자'];
  const moods = ['활발함', '차분함', '호기심 많음', '경계심'];
  const forecasts = ['안정적', '향상 예상', '주의 필요', '긍정적'];
  
  return {
    lastAnalysisDate: new Date().toISOString().split('T')[0],
    personalityType: personalities[Math.floor(Math.random() * personalities.length)],
    strengths: ['높은 학습능력', '뛰어난 사회성', '강한 충성심'].slice(0, Math.floor(Math.random() * 3) + 1),
    weaknesses: ['산만함', '과도한 에너지', '분리불안'].slice(0, Math.floor(Math.random() * 2) + 1),
    recommendations: [
      '정기적인 운동',
      '지속적인 훈련',
      '사회화 활동',
      '정신적 자극'
    ].slice(0, Math.floor(Math.random() * 3) + 2),
    trainingProgress: {
      obedience: Math.floor(Math.random() * 100),
      socialization: Math.floor(Math.random() * 100),
      tricks: Math.floor(Math.random() * 100),
      agility: Math.floor(Math.random() * 100)
    },
    mood: {
      current: moods[Math.floor(Math.random() * moods.length)],
      forecast: forecasts[Math.floor(Math.random() * forecasts.length)]
    },
    compatibility: {
      owner: Math.floor(Math.random() * 100),
      otherDogs: Math.floor(Math.random() * 100),
      children: Math.floor(Math.random() * 100),
      cats: Math.floor(Math.random() * 100)
    }
  };
};

interface DiaryEntry {
  id: number;
  date: string;
  content: string;
  trainer: string;
  tags: string[];
}

export default function AIAnalysisPage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData>(defaultAnalysis);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    isSubscribed: false,
    plan: 'free',
    remainingAnalyses: 2,
    maxAnalysesPerDay: 3,
    startDate: '',
    endDate: null
  });
  
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { toast } = useToast();

  const pets = [
    { id: '1', name: '뽀삐', type: '골든 리트리버', age: '2세' },
    { id: '2', name: '몽이', type: '푸들', age: '1세' },
    { id: '3', name: '코코', type: '시바견', age: '3세' }
  ];

  const subscriptionPlans = [
    {
      id: 'basic',
      name: '베이직',
      price: '9,900원',
      period: '월',
      analyses: 10,
      features: ['기본 AI 분석', '주간 리포트', '이메일 지원']
    },
    {
      id: 'premium',
      name: '프리미엄',
      price: '19,900원',
      period: '월',
      analyses: 50,
      features: ['고급 AI 분석', '실시간 상담', '맞춤 훈련 프로그램', '우선 지원']
    },
    {
      id: 'unlimited',
      name: '무제한',
      price: '29,900원',
      period: '월',
      analyses: 999,
      features: ['무제한 분석', '전문가 상담', '개인 맞춤 서비스', '24/7 지원']
    }
  ];

  useEffect(() => {
    // Load saved analysis data
    const savedData = localStorage.getItem('petAnalysisData');
    if (savedData) {
      setAnalysisData(JSON.parse(savedData));
    }

    // Load subscription info
    const savedSubscription = localStorage.getItem('subscriptionInfo');
    if (savedSubscription) {
      setSubscriptionInfo(JSON.parse(savedSubscription));
    }
  }, []);

  const runAnalysis = async () => {
    if (!selectedPet) {
      toast({
        title: "반려동물을 선택해주세요",
        description: "분석할 반려동물을 먼저 선택해주세요.",
        variant: "warning"
      });
      return;
    }

    if (subscriptionInfo.remainingAnalyses <= 0 && !subscriptionInfo.isSubscribed) {
      setShowUpgrade(true);
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    const newAnalysis = generateMockAnalysis();
    setAnalysisData(newAnalysis);
    localStorage.setItem('petAnalysisData', JSON.stringify(newAnalysis));

    // Update remaining analyses
    if (!subscriptionInfo.isSubscribed) {
      const updatedSubscription: SubscriptionInfo = {
        ...subscriptionInfo,
        remainingAnalyses: Math.max(0, subscriptionInfo.remainingAnalyses - 1)
      };
      setSubscriptionInfo(updatedSubscription);
      localStorage.setItem('subscriptionInfo', JSON.stringify(updatedSubscription));
    }

    setIsAnalyzing(false);
    toast({
      title: "분석 완료!",
      description: `${pets.find(p => p.id === selectedPet)?.name}의 새로운 분석 결과가 준비되었습니다.`,
      variant: "success"
    });
  };

  const handleSubscribe = (planId: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (plan) {
      const newSubscription: SubscriptionInfo = {
        isSubscribed: true,
        plan: planId as 'basic' | 'premium' | 'unlimited',
        remainingAnalyses: plan.analyses,
        maxAnalysesPerDay: plan.analyses,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      
      setSubscriptionInfo(newSubscription);
      localStorage.setItem('subscriptionInfo', JSON.stringify(newSubscription));
      setShowUpgrade(false);
      
      toast({
        title: "구독 완료!",
        description: `${plan.name} 플랜이 활성화되었습니다.`,
        variant: "success"
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-6 w-6" />
        <h1 className="text-2xl font-bold">AI 분석</h1>
        <Badge variant="secondary">Beta</Badge>
      </div>

      {/* Pet Selection and Analysis Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI 분석 시작하기
          </CardTitle>
          <CardDescription>
            반려동물의 행동 패턴을 AI로 분석하여 맞춤형 케어 가이드를 제공합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">분석할 반려동물 선택</label>
            <Select value={selectedPet} onValueChange={setSelectedPet}>
              <SelectTrigger>
                <SelectValue placeholder="반려동물을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {pets.map((pet) => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.name} ({pet.type}, {pet.age})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm font-medium">
                {subscriptionInfo.isSubscribed ? '구독 활성화' : '무료 사용'}
              </p>
              <p className="text-xs text-gray-600">
                {subscriptionInfo.isSubscribed 
                  ? `${subscriptionInfo.plan} 플랜` 
                  : `남은 분석: ${subscriptionInfo.remainingAnalyses}회`}
              </p>
            </div>
            {!subscriptionInfo.isSubscribed && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowUpgrade(true)}
              >
                업그레이드
              </Button>
            )}
          </div>

          <Button 
            onClick={runAnalysis} 
            disabled={isAnalyzing || !selectedPet}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                분석 중...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                AI 분석 시작
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="personality">성격 분석</TabsTrigger>
          <TabsTrigger value="training">훈련 현황</TabsTrigger>
          <TabsTrigger value="recommendations">추천사항</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  전체 평가
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {Math.round((analysisData.trainingProgress.obedience + 
                              analysisData.trainingProgress.socialization + 
                              analysisData.trainingProgress.tricks + 
                              analysisData.trainingProgress.agility) / 4)}점
                  </div>
                  <p className="text-sm text-gray-600">100점 만점</p>
                  <p className="mt-2 text-sm">
                    마지막 분석: {analysisData.lastAnalysisDate}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  성격 유형
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-xl font-bold mb-2">
                    {analysisData.personalityType}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-green-600">강점</p>
                      <p className="text-sm">
                        {analysisData.strengths.join(', ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-600">개선점</p>
                      <p className="text-sm">
                        {analysisData.weaknesses.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>현재 기분 상태</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">현재 상태</p>
                  <Badge variant="secondary">{analysisData.mood.current}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">예상 변화</p>
                  <Badge variant="outline">{analysisData.mood.forecast}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>성격 분석 상세</CardTitle>
              <CardDescription>
                AI가 분석한 반려동물의 성격 특성과 행동 패턴입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">주요 성격 유형</h3>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">{analysisData.personalityType}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2 text-green-600">강점</h3>
                  <ul className="space-y-1">
                    {analysisData.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-amber-600">개선이 필요한 영역</h3>
                  <ul className="space-y-1">
                    {analysisData.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>호환성 지수</CardTitle>
              <CardDescription>
                다양한 환경과 대상에 대한 적응력을 평가합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>주인과의 친밀도</span>
                    <span>{analysisData.compatibility.owner}%</span>
                  </div>
                  <Progress value={analysisData.compatibility.owner} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>다른 강아지와의 사회성</span>
                    <span>{analysisData.compatibility.otherDogs}%</span>
                  </div>
                  <Progress value={analysisData.compatibility.otherDogs} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>아이들과의 친화력</span>
                    <span>{analysisData.compatibility.children}%</span>
                  </div>
                  <Progress value={analysisData.compatibility.children} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>고양이와의 적응력</span>
                    <span>{analysisData.compatibility.cats}%</span>
                  </div>
                  <Progress value={analysisData.compatibility.cats} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>훈련 진행 현황</CardTitle>
              <CardDescription>
                각 영역별 훈련 성과와 발전 상황을 확인하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">기본 훈련</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>복종 훈련</span>
                        <span>{analysisData.trainingProgress.obedience}%</span>
                      </div>
                      <Progress value={analysisData.trainingProgress.obedience} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>사회화 훈련</span>
                        <span>{analysisData.trainingProgress.socialization}%</span>
                      </div>
                      <Progress value={analysisData.trainingProgress.socialization} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">고급 훈련</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>트릭 훈련</span>
                        <span>{analysisData.trainingProgress.tricks}%</span>
                      </div>
                      <Progress value={analysisData.trainingProgress.tricks} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>민첩성 훈련</span>
                        <span>{analysisData.trainingProgress.agility}%</span>
                      </div>
                      <Progress value={analysisData.trainingProgress.agility} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">훈련 팁</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 짧고 빈번한 훈련 세션이 더 효과적입니다</li>
                  <li>• 긍정적 강화를 활용하세요</li>
                  <li>• 일관성 있는 명령어를 사용하세요</li>
                  <li>• 충분한 휴식시간을 제공하세요</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                맞춤형 추천사항
              </CardTitle>
              <CardDescription>
                AI 분석을 바탕으로 한 개인화된 케어 가이드입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisData.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>추가 리소스</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <Book className="h-5 w-5 mb-2" />
                  <span className="font-medium">훈련 가이드</span>
                  <span className="text-xs text-gray-600">단계별 훈련 매뉴얼</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <Calendar className="h-5 w-5 mb-2" />
                  <span className="font-medium">일정 관리</span>
                  <span className="text-xs text-gray-600">훈련 스케줄 설정</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Subscription Upgrade Dialog */}
      <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              AI 분석 플랜 업그레이드
            </DialogTitle>
            <DialogDescription>
              더 많은 분석과 고급 기능을 이용하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id} className="relative">
                {plan.id === 'premium' && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary">인기</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-2xl font-bold">
                    {plan.price}
                    <span className="text-sm font-normal">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    월 {plan.analyses}회 분석
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleSubscribe(plan.id)}
                    className="w-full"
                    variant={plan.id === 'premium' ? 'default' : 'outline'}
                  >
                    {plan.id === 'premium' ? '추천 플랜 선택' : '플랜 선택'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">나중에</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}