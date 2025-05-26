import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Medal, 
  Star, 
  Crown,
  Target,
  Zap,
  Heart,
  Shield,
  Award,
  Gift,
  Calendar,
  TrendingUp
} from 'lucide-react';

// 배지 및 업적 데이터
const achievements = {
  earned: [
    {
      id: 1,
      title: '첫걸음 마스터',
      description: '첫 번째 훈련 세션을 완료했습니다',
      icon: '🐾',
      type: 'milestone',
      earnedDate: '2025-05-01',
      rarity: 'common',
      points: 10
    },
    {
      id: 2,
      title: '꾸준한 학습자',
      description: '7일 연속 훈련을 완료했습니다',
      icon: '🔥',
      type: 'consistency',
      earnedDate: '2025-05-20',
      rarity: 'rare',
      points: 50
    },
    {
      id: 3,
      title: '완벽주의자',
      description: '5회 연속 100점을 달성했습니다',
      icon: '⭐',
      type: 'performance',
      earnedDate: '2025-05-18',
      rarity: 'epic',
      points: 100
    },
    {
      id: 4,
      title: '사회화 전문가',
      description: '다른 반려견과 성공적으로 소통했습니다',
      icon: '🤝',
      type: 'social',
      earnedDate: '2025-05-15',
      rarity: 'uncommon',
      points: 25
    },
    {
      id: 5,
      title: '빠른 학습자',
      description: '새로운 기술을 3일 만에 습득했습니다',
      icon: '⚡',
      type: 'speed',
      earnedDate: '2025-05-10',
      rarity: 'rare',
      points: 75
    }
  ],
  inProgress: [
    {
      id: 6,
      title: '마라톤 러너',
      description: '30일 연속 훈련 완료하기',
      icon: '🏃',
      type: 'consistency',
      progress: 18,
      target: 30,
      rarity: 'legendary',
      points: 200
    },
    {
      id: 7,
      title: '다재다능한 학습자',
      description: '10가지 다른 기술 마스터하기',
      icon: '🎯',
      type: 'skill',
      progress: 6,
      target: 10,
      rarity: 'epic',
      points: 150
    },
    {
      id: 8,
      title: '훈련 애호가',
      description: '총 100회의 훈련 세션 완료하기',
      icon: '💪',
      type: 'milestone',
      progress: 45,
      target: 100,
      rarity: 'rare',
      points: 100
    }
  ],
  locked: [
    {
      id: 9,
      title: '전설의 트레이너',
      description: '모든 고급 기술을 마스터하기',
      icon: '👑',
      type: 'mastery',
      requirement: '고급 레벨 달성 필요',
      rarity: 'legendary',
      points: 500
    },
    {
      id: 10,
      title: '커뮤니티 리더',
      description: '다른 사용자들을 도와주기',
      icon: '🌟',
      type: 'community',
      requirement: '소셜 기능 활성화 필요',
      rarity: 'epic',
      points: 200
    }
  ]
};

const userStats = {
  totalPoints: 260,
  rank: 'Silver',
  nextRank: 'Gold',
  pointsToNext: 240,
  level: 8,
  earnedAchievements: 5,
  totalAchievements: 10,
  rareAchievements: 2
};

export default function AchievementsPage() {
  const [selectedTab, setSelectedTab] = useState('earned');

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'uncommon': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rare': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'epic': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'uncommon': return 'border-green-400';
      case 'rare': return 'border-blue-400';
      case 'epic': return 'border-purple-400';
      case 'legendary': return 'border-yellow-400';
      default: return 'border-gray-300';
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'Bronze': return <Medal className="h-6 w-6 text-orange-600" />;
      case 'Silver': return <Medal className="h-6 w-6 text-gray-500" />;
      case 'Gold': return <Crown className="h-6 w-6 text-yellow-500" />;
      case 'Platinum': return <Crown className="h-6 w-6 text-blue-500" />;
      default: return <Trophy className="h-6 w-6" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            배지 및 업적
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            훈련 성과를 인정받고 특별한 배지를 수집하세요
          </p>
        </div>
        <Button variant="outline">
          <Gift className="h-4 w-4 mr-2" />
          보상 상점
        </Button>
      </div>

      {/* 사용자 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">현재 랭크</p>
                <div className="flex items-center gap-2 mt-1">
                  {getRankIcon(userStats.rank)}
                  <span className="text-xl font-bold">{userStats.rank}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 포인트</p>
                <p className="text-2xl font-bold">{userStats.totalPoints}</p>
              </div>
              <Star className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">획득 배지</p>
                <p className="text-2xl font-bold">{userStats.earnedAchievements}/{userStats.totalAchievements}</p>
              </div>
              <Trophy className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">레벨</p>
                <p className="text-2xl font-bold">{userStats.level}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 다음 랭크까지 진행도 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">다음 랭크까지</h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {userStats.pointsToNext}점 필요
            </span>
          </div>
          <Progress 
            value={(userStats.totalPoints / (userStats.totalPoints + userStats.pointsToNext)) * 100} 
            className="h-3"
          />
          <div className="flex justify-between items-center mt-2 text-sm">
            <span>{userStats.rank}</span>
            <span className="font-medium">{userStats.nextRank}</span>
          </div>
        </CardContent>
      </Card>

      {/* 배지 탭 */}
      <Tabs defaultValue="earned" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="earned">획득한 배지</TabsTrigger>
          <TabsTrigger value="progress">진행 중</TabsTrigger>
          <TabsTrigger value="locked">잠금 해제 대기</TabsTrigger>
        </TabsList>

        {/* 획득한 배지 */}
        <TabsContent value="earned" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                획득한 배지 ({achievements.earned.length}개)
              </CardTitle>
              <CardDescription>
                훈련 성과로 얻은 특별한 배지들입니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.earned.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 border-2 rounded-lg ${getRarityBorder(achievement.rarity)} bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20`}
                  >
                    <div className="text-center mb-3">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {achievement.description}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium">{achievement.points}pt</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {achievement.earnedDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 진행 중인 배지 */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                진행 중인 배지 ({achievements.inProgress.length}개)
              </CardTitle>
              <CardDescription>
                현재 도전하고 있는 배지들의 진행 상황입니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.inProgress.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>진행도</span>
                        <span>{achievement.progress}/{achievement.target}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.target) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {Math.round((achievement.progress / achievement.target) * 100)}% 완료
                      </span>
                      <span className="text-sm font-medium">{achievement.points}pt</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 잠금된 배지 */}
        <TabsContent value="locked" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                잠금 해제 대기 ({achievements.locked.length}개)
              </CardTitle>
              <CardDescription>
                특별한 조건을 만족하면 도전할 수 있는 배지들입니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.locked.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800 opacity-75"
                  >
                    <div className="text-center mb-3">
                      <div className="text-4xl mb-2 grayscale">{achievement.icon}</div>
                      <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {achievement.description}
                      </p>
                    </div>
                    
                    <div className="text-center mb-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {achievement.requirement}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge className={getRarityColor(achievement.rarity)} variant="outline">
                        {achievement.rarity}
                      </Badge>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {achievement.points}pt
                      </span>
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