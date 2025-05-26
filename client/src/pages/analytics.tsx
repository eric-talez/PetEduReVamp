import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth-compat';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Calendar,
  Download,
  Filter,
  Eye,
  Users,
  BookOpen,
  Award,
  Heart,
  Star,
  Target,
  Clock,
  Activity,
  Zap
} from 'lucide-react';

// 샘플 데이터 - 실제 환경에서는 API로 가져와야 함
const trainingProgressData = [
  { skill: '앉기', progress: 95, level: '마스터', sessions: 12 },
  { skill: '기다리기', progress: 80, level: '숙련', sessions: 8 },
  { skill: '손 주기', progress: 65, level: '중급', sessions: 6 },
  { skill: '엎드리기', progress: 45, level: '초급', sessions: 4 },
  { skill: '돌기', progress: 30, level: '입문', sessions: 3 }
];

const learningStatsData = {
  totalSessions: 28,
  completedCourses: 3,
  currentStreak: 7,
  averageScore: 87,
  totalHours: 42,
  achievements: 15
};

const monthlyProgressData = [
  { month: '1월', sessions: 8, score: 82 },
  { month: '2월', sessions: 12, score: 85 },
  { month: '3월', sessions: 15, score: 88 },
  { month: '4월', sessions: 10, score: 86 },
  { month: '5월', sessions: 18, score: 91 }
];

const recentAchievements = [
  { title: '7일 연속 훈련', description: '꾸준한 학습자', icon: '🔥', date: '2일 전' },
  { title: '첫 번째 코스 완주', description: '기본 훈련 마스터', icon: '🏆', date: '1주 전' },
  { title: '완벽한 앉기', description: '100% 성공률 달성', icon: '⭐', date: '3일 전' },
  { title: '훈련사 추천', description: '우수 학습자 인증', icon: '👨‍🏫', date: '5일 전' }
];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30일');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 데이터 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case '마스터': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case '숙련': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case '중급': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case '초급': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">분석 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            분석 및 보고서
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {user?.name || '반려인'}님의 훈련 진행 상황과 성과를 확인하세요
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            필터
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            내보내기
          </Button>
        </div>
      </div>

      {/* 주요 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 훈련 세션</p>
                <p className="text-2xl font-bold">{learningStatsData.totalSessions}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">완료된 코스</p>
                <p className="text-2xl font-bold">{learningStatsData.completedCourses}</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">평균 점수</p>
                <p className="text-2xl font-bold">{learningStatsData.averageScore}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">연속 학습일</p>
                <p className="text-2xl font-bold">{learningStatsData.currentStreak}일</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 탭 컨텐츠 */}
      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">훈련 진행도</TabsTrigger>
          <TabsTrigger value="monthly">월간 리포트</TabsTrigger>
          <TabsTrigger value="achievements">성취 기록</TabsTrigger>
          <TabsTrigger value="insights">인사이트</TabsTrigger>
        </TabsList>

        {/* 훈련 진행도 탭 */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                스킬별 훈련 진행도
              </CardTitle>
              <CardDescription>
                각 훈련 항목별 성취도와 숙련도를 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingProgressData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{item.skill}</h3>
                        <Badge className={getLevelBadgeColor(item.level)}>
                          {item.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Progress value={item.progress} className="h-2" />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem]">
                          {item.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.sessions}회 세션
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 월간 리포트 탭 */}
        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                월간 학습 트렌드
              </CardTitle>
              <CardDescription>
                최근 5개월간의 학습 패턴과 성과 변화를 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyProgressData.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{month.month}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {month.sessions}회 세션
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-lg">{month.score}%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">평균 점수</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 성취 기록 탭 */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                최근 성취 기록
              </CardTitle>
              <CardDescription>
                달성한 목표와 받은 인증을 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {achievement.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 인사이트 탭 */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  학습 패턴 분석
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">가장 활발한 시간대</span>
                    <span className="font-medium">오후 2-4시</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">선호하는 훈련 방식</span>
                    <span className="font-medium">반복 연습</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">강점 영역</span>
                    <span className="font-medium">기본 명령어</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">개선 필요 영역</span>
                    <span className="font-medium">고급 기술</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  추천 학습 계획
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                      이번 주 목표
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      "엎드리기" 명령어 80% 성공률 달성하기
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">
                      장기 목표
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      고급 훈련 코스 시작 준비하기
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}