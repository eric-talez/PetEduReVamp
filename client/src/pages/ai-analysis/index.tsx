import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Clock, Calendar, LineChart, AlertCircle, Check, Brain, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

export default function AIAnalysisPage() {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isAnalysisAvailable, setIsAnalysisAvailable] = useState(true);
  const [timeUntilNextAnalysis, setTimeUntilNextAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 분석 데이터 로드 및 다음 분석 가능 시간 체크
  useEffect(() => {
    const savedAnalysis = localStorage.getItem('petAnalysisData');
    if (savedAnalysis) {
      const parsedAnalysis = JSON.parse(savedAnalysis) as AnalysisData;
      setAnalysis(parsedAnalysis);
      
      // 마지막 분석 시간으로부터 24시간이 지났는지 확인
      const lastAnalysisDate = new Date(parsedAnalysis.lastAnalysisDate);
      const now = new Date();
      const timeDiff = now.getTime() - lastAnalysisDate.getTime();
      const hoursPassed = timeDiff / (1000 * 60 * 60);
      
      if (hoursPassed < 24) {
        setIsAnalysisAvailable(false);
        
        // 다음 분석 가능 시간 계산
        const hoursRemaining = Math.floor(24 - hoursPassed);
        const minutesRemaining = Math.floor((24 - hoursPassed - hoursRemaining) * 60);
        setTimeUntilNextAnalysis(`${hoursRemaining}시간 ${minutesRemaining}분`);
      } else {
        setIsAnalysisAvailable(true);
      }
    } else {
      setIsAnalysisAvailable(true);
    }
  }, []);
  
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
    setIsLoading(true);
    
    // API 호출 모의 (실제로는 여기서 API 호출)
    setTimeout(() => {
      const newAnalysis = generateMockAnalysis();
      setAnalysis(newAnalysis);
      localStorage.setItem('petAnalysisData', JSON.stringify(newAnalysis));
      setIsAnalysisAvailable(false);
      setIsLoading(false);
      
      toast({
        title: "분석이 완료되었습니다",
        description: "AI가 반려견의 상태를 분석했습니다. 24시간 후에 다시 분석할 수 있습니다.",
        variant: "default",
      });
    }, 2000);
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">반려견 AI 분석</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI가 반려견의 성격, 훈련 진도, 그리고 앞으로의 방향을 분석합니다.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {!isAnalysisAvailable && (
            <div className="flex items-center text-amber-500 dark:text-amber-400">
              <Clock className="w-5 h-5 mr-2" />
              <span>다음 분석까지: {timeUntilNextAnalysis}</span>
            </div>
          )}
          <Button 
            onClick={performAnalysis}
            disabled={!isAnalysisAvailable || isLoading}
            className="flex items-center"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isLoading ? '분석 중...' : '지금 분석하기'}
          </Button>
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