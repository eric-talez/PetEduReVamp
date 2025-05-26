import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Calendar,
  Star,
  BookOpen,
  Clock,
  Trophy,
  Activity,
  BarChart3,
  PieChart,
  Download
} from 'lucide-react';

// 훈련 성과 데이터
const performanceData = {
  overall: {
    totalSessions: 45,
    completedSkills: 12,
    averageScore: 87,
    improvementRate: 23,
    currentStreak: 9,
    totalHours: 67
  },
  skillProgress: [
    { skill: '앉기', currentLevel: 95, targetLevel: 100, sessions: 15, improvement: '+12%' },
    { skill: '기다리기', currentLevel: 88, targetLevel: 95, sessions: 12, improvement: '+18%' },
    { skill: '손 주기', currentLevel: 82, targetLevel: 90, sessions: 10, improvement: '+25%' },
    { skill: '엎드리기', currentLevel: 75, targetLevel: 85, sessions: 8, improvement: '+30%' },
    { skill: '돌기', currentLevel: 65, targetLevel: 80, sessions: 6, improvement: '+35%' },
    { skill: '기어와', currentLevel: 70, targetLevel: 85, sessions: 7, improvement: '+28%' },
  ],
  weeklyProgress: [
    { week: '1주차', sessions: 3, score: 78, duration: 4.5 },
    { week: '2주차', sessions: 4, score: 82, duration: 6.0 },
    { week: '3주차', sessions: 5, score: 85, duration: 7.5 },
    { week: '4주차', sessions: 4, score: 89, duration: 6.0 },
    { week: '이번주', sessions: 3, score: 91, duration: 4.5 }
  ],
  achievements: [
    { title: '꾸준한 학습자', description: '7일 연속 훈련 완료', date: '2025-05-25', type: 'consistency' },
    { title: '빠른 학습자', description: '신규 기술 3일 만에 습득', date: '2025-05-23', type: 'speed' },
    { title: '완벽주의자', description: '5회 연속 100점 달성', date: '2025-05-20', type: 'perfection' },
    { title: '사회화 마스터', description: '다른 반려견과 원활한 소통', date: '2025-05-18', type: 'social' }
  ],
  recommendations: [
    {
      title: '고급 어질리티 도전',
      description: '기본기가 탄탄하니 어질리티 훈련을 시작해보세요',
      priority: 'high',
      estimatedTime: '4-6주'
    },
    {
      title: '사회화 훈련 강화',
      description: '다른 반려견들과의 상호작용을 더 늘려보세요',
      priority: 'medium',
      estimatedTime: '2-3주'
    },
    {
      title: '집중력 향상 훈련',
      description: '산만한 환경에서의 명령 수행 능력을 기르세요',
      priority: 'low',
      estimatedTime: '3-4주'
    }
  ]
};

export default function TrainingPerformancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30일');

  const getSkillLevelColor = (level: number) => {
    if (level >= 90) return 'text-green-600';
    if (level >= 70) return 'text-blue-600';
    if (level >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImprovementColor = (improvement: string) => {
    const value = parseInt(improvement.replace(/[^0-9]/g, ''));
    if (value >= 25) return 'text-green-600';
    if (value >= 15) return 'text-blue-600';
    return 'text-yellow-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'consistency': return '🔥';
      case 'speed': return '⚡';
      case 'perfection': return '⭐';
      case 'social': return '🐕';
      default: return '🏆';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            훈련 성과
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            반려견의 훈련 진행 상황과 성취도를 상세히 확인하세요
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            성과 보고서
          </Button>
          <Button size="sm">
            목표 설정
          </Button>
        </div>
      </div>

      {/* 전체 성과 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 훈련 세션</p>
                <p className="text-2xl font-bold">{performanceData.overall.totalSessions}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">완료 기술</p>
                <p className="text-2xl font-bold">{performanceData.overall.completedSkills}</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">평균 점수</p>
                <p className="text-2xl font-bold">{performanceData.overall.averageScore}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">향상률</p>
                <p className="text-2xl font-bold">+{performanceData.overall.improvementRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">연속 학습</p>
                <p className="text-2xl font-bold">{performanceData.overall.currentStreak}일</p>
              </div>
              <Activity className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 훈련 시간</p>
                <p className="text-2xl font-bold">{performanceData.overall.totalHours}h</p>
              </div>
              <Clock className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상세 분석 탭 */}
      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="skills">기술별 성과</TabsTrigger>
          <TabsTrigger value="progress">주간 진행도</TabsTrigger>
          <TabsTrigger value="achievements">성취 기록</TabsTrigger>
          <TabsTrigger value="recommendations">추천 계획</TabsTrigger>
        </TabsList>

        {/* 기술별 성과 */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                기술별 상세 성과
              </CardTitle>
              <CardDescription>
                각 훈련 기술의 현재 수준과 목표 달성률을 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceData.skillProgress.map((skill, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-lg">{skill.skill}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${getSkillLevelColor(skill.currentLevel)}`}>
                          {skill.currentLevel}%
                        </span>
                        <span className={`text-sm ${getImprovementColor(skill.improvement)}`}>
                          {skill.improvement}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>현재 수준</span>
                        <span>목표: {skill.targetLevel}%</span>
                      </div>
                      <Progress value={skill.currentLevel} className="h-3" />
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        총 {skill.sessions}회 세션 완료
                      </span>
                      <Badge variant="outline">
                        {skill.currentLevel >= skill.targetLevel ? '목표 달성' : '진행 중'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 주간 진행도 */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                주간 학습 진행도
              </CardTitle>
              <CardDescription>
                최근 5주간의 훈련 활동과 성과 변화를 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.weeklyProgress.map((week, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{week.week}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {week.sessions}회 세션 • {week.duration}시간
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-lg">{week.score}%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">평균 점수</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 성취 기록 */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                최근 성취 기록
              </CardTitle>
              <CardDescription>
                달성한 목표와 받은 인증을 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                    <div className="text-3xl">
                      {getAchievementIcon(achievement.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
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

        {/* 추천 계획 */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                맞춤 훈련 추천
              </CardTitle>
              <CardDescription>
                현재 성과를 바탕으로 한 다음 단계 훈련 계획
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold">{rec.title}</h3>
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority === 'high' ? '높음' : rec.priority === 'medium' ? '보통' : '낮음'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {rec.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        예상 소요 시간: {rec.estimatedTime}
                      </span>
                      <Button variant="outline" size="sm">
                        훈련 시작
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}