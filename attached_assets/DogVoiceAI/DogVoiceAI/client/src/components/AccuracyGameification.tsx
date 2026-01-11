
import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Target, Zap, Award, Medal } from 'lucide-react';

interface AccuracyStats {
  currentAccuracy: number;
  dailyGoal: number;
  streak: number;
  totalPoints: number;
  level: number;
  nextLevelProgress: number;
  badges: string[];
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export default function AccuracyGameification() {
  const [stats, setStats] = useState<AccuracyStats>({
    currentAccuracy: 94.2,
    dailyGoal: 95,
    streak: 7,
    totalPoints: 2847,
    level: 8,
    nextLevelProgress: 67,
    badges: ['🎯', '⚡', '🔥', '💎'],
    achievements: [
      {
        id: 'accuracy_master',
        title: '정확도 마스터',
        description: '95% 이상 정확도 10회 달성',
        icon: '🎯',
        unlocked: true,
        progress: 10,
        maxProgress: 10
      },
      {
        id: 'streak_warrior',
        title: '연속 달성 전사',
        description: '7일 연속 목표 달성',
        icon: '🔥',
        unlocked: true,
        progress: 7,
        maxProgress: 7
      },
      {
        id: 'data_collector',
        title: '데이터 수집가',
        description: '100개 분석 데이터 수집',
        icon: '📊',
        unlocked: false,
        progress: 87,
        maxProgress: 100
      },
      {
        id: 'perfectionist',
        title: '완벽주의자',
        description: '98% 이상 정확도 달성',
        icon: '💎',
        unlocked: false,
        progress: 0,
        maxProgress: 1
      }
    ]
  });

  const [recentActivity, setRecentActivity] = useState([
    { time: '14:32', action: '분석 완료', accuracy: 96.5, points: '+15', color: 'text-green-600' },
    { time: '14:28', action: '목표 달성', accuracy: 95.2, points: '+25', color: 'text-blue-600' },
    { time: '14:25', action: '연속 기록', accuracy: 94.8, points: '+10', color: 'text-purple-600' },
  ]);

  const [showCelebration, setShowCelebration] = useState(false);

  // 실시간 정확도 업데이트 시뮬레이션
  // 실제 분석 결과에서 정확도 계산
  const { data: behavioralAnalyses } = useQuery({
    queryKey: ['/api/research/behavioral-analyses']
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (behavioralAnalyses && Array.isArray(behavioralAnalyses) && behavioralAnalyses.length > 0) {
        // 실제 분석 데이터에서 정확도 계산
        const recentAnalyses = behavioralAnalyses.slice(-10);
        const avgConfidence = recentAnalyses.reduce((sum: number, analysis: any) => 
          sum + (analysis.confidence * 100), 0) / recentAnalyses.length;
        
        setStats(prev => {
          const newAccuracy = avgConfidence;
          const pointsGained = newAccuracy >= prev.dailyGoal ? 25 : 10;
          const newPoints = prev.totalPoints + pointsGained;
          
          // 레벨업 체크
          const newLevel = Math.floor(newPoints / 500) + 1;
          const isLevelUp = newLevel > prev.level;
          
          if (isLevelUp) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
          }

          return {
            ...prev,
            currentAccuracy: newAccuracy,
            totalPoints: newPoints,
            level: newLevel,
            nextLevelProgress: ((newPoints % 500) / 500) * 100,
            streak: newAccuracy >= prev.dailyGoal ? prev.streak + 1 : Math.max(0, prev.streak - 1)
          };
        });

        // 실제 분석 결과에서 활동 업데이트
        const now = new Date();
        const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        const latestAnalysis = recentAnalyses[recentAnalyses.length - 1];
        const confidence = latestAnalysis.confidence * 100;
        
        setRecentActivity(prev => [
          {
            time: timeStr,
            action: `${latestAnalysis.behavior} 분석`,
            accuracy: confidence,
            points: confidence >= 95 ? '+25' : '+15',
            color: confidence >= 95 ? 'text-green-600' : 'text-blue-600'
          },
          ...prev.slice(0, 4)
        ]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'from-purple-500 to-pink-500';
    if (level >= 7) return 'from-blue-500 to-purple-500';
    if (level >= 5) return 'from-green-500 to-blue-500';
    return 'from-yellow-500 to-green-500';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 98) return 'text-purple-600';
    if (accuracy >= 95) return 'text-green-600';
    if (accuracy >= 90) return 'text-blue-600';
    return 'text-orange-600';
  };

  return (
    <div className="space-y-6">
      {/* 레벨업 축하 애니메이션 */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-2xl font-bold text-purple-600 mb-2">레벨업!</div>
            <div className="text-lg text-gray-600">레벨 {stats.level}에 도달했습니다!</div>
          </div>
        </div>
      )}

      {/* 메인 대시보드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 현재 정확도 및 레벨 */}
        <Card className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${getLevelColor(stats.level)} opacity-10`} />
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span>실시간 정확도</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className={`text-4xl font-bold ${getAccuracyColor(stats.currentAccuracy)}`}>
                {stats.currentAccuracy.toFixed(1)}%
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <Badge className={`bg-gradient-to-r ${getLevelColor(stats.level)} text-white`}>
                  레벨 {stats.level}
                </Badge>
                <Badge variant="outline">
                  {stats.totalPoints.toLocaleString()} 포인트
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>다음 레벨까지</span>
                  <span>{Math.round(stats.nextLevelProgress)}%</span>
                </div>
                <Progress value={stats.nextLevelProgress} className="h-2" />
              </div>

              <div className="flex justify-center space-x-1">
                {stats.badges.map((badge, index) => (
                  <span key={index} className="text-2xl animate-pulse">{badge}</span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 일일 목표 및 연속 기록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span>일일 목표</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.dailyGoal}%</div>
                <div className="text-sm text-gray-600">목표 정확도</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <div className="font-medium">연속 달성</div>
                    <div className="text-sm text-gray-600">{stats.streak}일 연속</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-600">{stats.streak}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">오늘의 진행도</div>
                <Progress 
                  value={(stats.currentAccuracy / stats.dailyGoal) * 100} 
                  className="h-3"
                />
                <div className="text-xs text-center text-gray-600">
                  {stats.currentAccuracy >= stats.dailyGoal ? '✅ 목표 달성!' : '🎯 목표까지 조금 더!'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 실시간 활동 피드 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>실시간 활동</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg animate-fadeIn">
                  <div>
                    <div className="text-sm font-medium">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${activity.color}`}>
                      {activity.accuracy.toFixed(1)}%
                    </div>
                    <div className="text-xs text-green-600">{activity.points}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 업적 시스템 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>업적 시스템</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">{achievement.icon}</span>
                  <div>
                    <div className={`font-medium ${achievement.unlocked ? 'text-green-800' : 'text-gray-600'}`}>
                      {achievement.title}
                    </div>
                    <div className="text-sm text-gray-600">{achievement.description}</div>
                  </div>
                  {achievement.unlocked && (
                    <Badge className="bg-green-500 text-white ml-auto">
                      <Award className="w-3 h-3 mr-1" />
                      완료
                    </Badge>
                  )}
                </div>
                
                {!achievement.unlocked && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>진행도</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100} 
                      className="h-2"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 리더보드 프리뷰 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Medal className="w-5 h-5 text-purple-500" />
            <span>주간 리더보드</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { rank: 1, name: '김훈련사', accuracy: 97.8, points: 3200, badge: '🥇' },
              { rank: 2, name: '이전문가', accuracy: 96.5, points: 2950, badge: '🥈' },
              { rank: 3, name: '박분석가', accuracy: 95.2, points: 2847, badge: '🥉', isUser: true },
              { rank: 4, name: '최데이터', accuracy: 94.1, points: 2650, badge: '🏅' },
            ].map((user) => (
              <div 
                key={user.rank}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  user.isUser ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{user.badge}</span>
                  <div>
                    <div className={`font-medium ${user.isUser ? 'text-blue-800' : 'text-gray-800'}`}>
                      {user.name} {user.isUser && '(나)'}
                    </div>
                    <div className="text-sm text-gray-600">정확도 {user.accuracy}%</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{user.points.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">포인트</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
