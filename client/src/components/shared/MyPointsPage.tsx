import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  TrendingUp, 
  Trophy, 
  Calendar, 
  Activity,
  Gift,
  Target,
  Award,
  Video,
  BookOpen,
  MessageSquare,
  Users,
  Crown,
  Zap,
  ChevronRight,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface MyPointsData {
  currentPoints: number;
  totalEarned: number;
  monthlyPoints: number;
  level: string;
  nextLevelPoints: number;
  levelProgress: number;
  activities: MyActivity[];
  achievements: MyAchievement[];
  rewards: AvailableReward[];
  ranking: UserRanking;
}

interface MyActivity {
  id: string;
  type: 'review' | 'consultation' | 'course' | 'community' | 'referral';
  title: string;
  description: string;
  points: number;
  date: string;
  status: 'completed' | 'pending' | 'processing';
}

interface MyAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: string;
  progress: number;
  target: number;
  isCompleted: boolean;
}

interface AvailableReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'cash' | 'gift' | 'certification' | 'service';
  available: boolean;
  image?: string;
}

interface UserRanking {
  currentRank: number;
  totalUsers: number;
  percentile: number;
  isStarUser: boolean;
}

interface MyPointsPageProps {
  userType: 'trainer' | 'institute';
}

export default function MyPointsPage({ userType }: MyPointsPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const apiEndpoint = userType === 'trainer' ? '/api/trainer/my-points' : '/api/institute/my-points';
  const userLabel = userType === 'trainer' ? '훈련사' : '기관';

  const { data: pointsData, isLoading } = useQuery<MyPointsData>({
    queryKey: [apiEndpoint],
    refetchInterval: 30000,
  });

  const defaultData: MyPointsData = {
    currentPoints: 2450,
    totalEarned: 8320,
    monthlyPoints: 680,
    level: 'Silver',
    nextLevelPoints: 5000,
    levelProgress: 49,
    activities: [
      {
        id: '1',
        type: 'review',
        title: '영상 리뷰 작성',
        description: '강아지 기초 훈련 영상 리뷰 작성',
        points: 50,
        date: '2025-01-18',
        status: 'completed'
      },
      {
        id: '2',
        type: 'consultation',
        title: '화상 상담 완료',
        description: '보더콜리 행동 교정 상담',
        points: 100,
        date: '2025-01-17',
        status: 'completed'
      },
      {
        id: '3',
        type: 'course',
        title: '커리큘럼 등록',
        description: '퍼피 사회화 프로그램 등록',
        points: 200,
        date: '2025-01-16',
        status: 'processing'
      }
    ],
    achievements: [
      {
        id: '1',
        title: '첫 리뷰 작성',
        description: '첫 번째 영상 리뷰를 작성하세요',
        icon: 'star',
        points: 100,
        progress: 1,
        target: 1,
        isCompleted: true,
        unlockedAt: '2025-01-10'
      },
      {
        id: '2',
        title: '인기 강사',
        description: '10명의 수강생을 확보하세요',
        icon: 'users',
        points: 500,
        progress: 7,
        target: 10,
        isCompleted: false
      },
      {
        id: '3',
        title: '콘텐츠 크리에이터',
        description: '5개의 커리큘럼을 등록하세요',
        icon: 'video',
        points: 300,
        progress: 3,
        target: 5,
        isCompleted: false
      }
    ],
    rewards: [
      {
        id: '1',
        title: '현금 환급',
        description: '1,000P = 1,000원으로 환급',
        pointsCost: 1000,
        category: 'cash',
        available: true
      },
      {
        id: '2',
        title: '프리미엄 배지',
        description: '프로필에 프리미엄 배지 표시',
        pointsCost: 500,
        category: 'certification',
        available: true
      },
      {
        id: '3',
        title: '광고 크레딧',
        description: '강좌 홍보 광고 크레딧',
        pointsCost: 2000,
        category: 'service',
        available: true
      }
    ],
    ranking: {
      currentRank: 23,
      totalUsers: 156,
      percentile: 85,
      isStarUser: false
    }
  };

  const data = pointsData || defaultData;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'review': return <Video className="w-4 h-4" />;
      case 'consultation': return <MessageSquare className="w-4 h-4" />;
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'community': return <Users className="w-4 h-4" />;
      case 'referral': return <Gift className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">완료</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">대기</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-700">처리중</Badge>;
      default:
        return null;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Bronze': return 'text-amber-600';
      case 'Silver': return 'text-gray-500';
      case 'Gold': return 'text-yellow-500';
      case 'Platinum': return 'text-cyan-500';
      case 'Diamond': return 'text-purple-500';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">내 포인트</h1>
          <p className="text-muted-foreground">{userLabel} 활동으로 포인트를 적립하고 다양한 혜택을 받으세요</p>
        </div>
        {data.ranking.isStarUser && (
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1">
            <Crown className="w-4 h-4 mr-1" />
            스타 {userLabel}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">보유 포인트</p>
                <p className="text-3xl font-bold text-primary">{data.currentPoints.toLocaleString()}P</p>
              </div>
              <Star className="w-10 h-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">이번 달 적립</p>
                <p className="text-3xl font-bold text-green-600">+{data.monthlyPoints.toLocaleString()}P</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">누적 적립</p>
                <p className="text-3xl font-bold">{data.totalEarned.toLocaleString()}P</p>
              </div>
              <Trophy className="w-10 h-10 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">현재 등급</p>
                <p className={`text-3xl font-bold ${getLevelColor(data.level)}`}>{data.level}</p>
              </div>
              <Award className="w-10 h-10 text-purple-500" />
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>다음 등급까지</span>
                <span>{data.nextLevelPoints - data.currentPoints}P</span>
              </div>
              <Progress value={data.levelProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="activities">활동</TabsTrigger>
          <TabsTrigger value="achievements">업적</TabsTrigger>
          <TabsTrigger value="rewards">리워드</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  랭킹
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-5xl font-bold text-primary">{data.ranking.currentRank}위</p>
                  <p className="text-muted-foreground mt-2">전체 {data.ranking.totalUsers}명 중</p>
                  <Badge className="mt-3 bg-blue-100 text-blue-700">
                    상위 {100 - data.ranking.percentile}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  최근 활동
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.activities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                      <span className="text-green-600 font-medium">+{activity.points}P</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>포인트 적립 내역</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{activity.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">+{activity.points}P</p>
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>업적 달성</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-4 border rounded-lg ${achievement.isCompleted ? 'bg-green-50 border-green-200' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full ${achievement.isCompleted ? 'bg-green-100' : 'bg-muted'}`}>
                          {achievement.isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Target className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{achievement.title}</p>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{achievement.points}P</Badge>
                    </div>
                    {!achievement.isCompleted && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>진행률</span>
                          <span>{achievement.progress}/{achievement.target}</span>
                        </div>
                        <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                      </div>
                    )}
                    {achievement.isCompleted && achievement.unlockedAt && (
                      <p className="text-xs text-green-600 mt-2">
                        {achievement.unlockedAt} 달성
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>포인트 사용</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.rewards.map((reward) => (
                  <div key={reward.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Gift className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{reward.title}</p>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{reward.pointsCost.toLocaleString()}P</span>
                      <Button 
                        size="sm" 
                        disabled={data.currentPoints < reward.pointsCost || !reward.available}
                      >
                        교환하기
                        <ChevronRight className="w-4 h-4 ml-1" />
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

const BarChart3 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18"/>
    <path d="M18 17V9"/>
    <path d="M13 17V5"/>
    <path d="M8 17v-3"/>
  </svg>
);
