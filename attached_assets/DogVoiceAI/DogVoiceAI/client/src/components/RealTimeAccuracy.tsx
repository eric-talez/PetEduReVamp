import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Target, 
  Zap, 
  TrendingUp, 
  Star,
  Award,
  Crown,
  Flame,
  ChevronUp,
  Timer
} from 'lucide-react';

interface AccuracyLevel {
  level: number;
  name: string;
  minAccuracy: number;
  maxAccuracy: number;
  color: string;
  icon: React.ReactNode;
  bonusMultiplier: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  type: 'accuracy' | 'streak' | 'time' | 'milestone';
}

interface AccuracyStats {
  currentAccuracy: number;
  peakAccuracy: number;
  streak: number;
  totalScore: number;
  level: AccuracyLevel;
  nextLevel: AccuracyLevel | null;
  experiencePoints: number;
  nextLevelXP: number;
  achievements: Achievement[];
  recentBoosts: string[];
}

const ACCURACY_LEVELS: AccuracyLevel[] = [
  { level: 1, name: '신입 분석가', minAccuracy: 0, maxAccuracy: 60, color: 'bg-gray-500', icon: <Target className="w-4 h-4" />, bonusMultiplier: 1.0 },
  { level: 2, name: '견습 전문가', minAccuracy: 60, maxAccuracy: 70, color: 'bg-green-500', icon: <Zap className="w-4 h-4" />, bonusMultiplier: 1.2 },
  { level: 3, name: '숙련 분석가', minAccuracy: 70, maxAccuracy: 80, color: 'bg-blue-500', icon: <Star className="w-4 h-4" />, bonusMultiplier: 1.4 },
  { level: 4, name: '전문 분석가', minAccuracy: 80, maxAccuracy: 90, color: 'bg-purple-500', icon: <Award className="w-4 h-4" />, bonusMultiplier: 1.6 },
  { level: 5, name: '마스터 분석가', minAccuracy: 90, maxAccuracy: 95, color: 'bg-yellow-500', icon: <Crown className="w-4 h-4" />, bonusMultiplier: 1.8 },
  { level: 6, name: '전설의 분석가', minAccuracy: 95, maxAccuracy: 100, color: 'bg-red-500', icon: <Trophy className="w-4 h-4" />, bonusMultiplier: 2.0 },
];

interface RealTimeAccuracyProps {
  currentAccuracy: number;
  isAnalyzing: boolean;
  onAccuracyUpdate?: (accuracy: number) => void;
}

export const RealTimeAccuracy: React.FC<RealTimeAccuracyProps> = ({
  currentAccuracy,
  isAnalyzing,
  onAccuracyUpdate
}) => {
  const [accuracyStats, setAccuracyStats] = useState<AccuracyStats>(() => {
    const savedStats = localStorage.getItem('accuracyGameStats');
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      return {
        ...parsed,
        level: ACCURACY_LEVELS.find(l => l.level === parsed.level?.level) || ACCURACY_LEVELS[0],
        nextLevel: ACCURACY_LEVELS.find(l => l.level === (parsed.level?.level || 0) + 1) || null,
        achievements: parsed.achievements?.map((achievement: any, index: number) => ({
          ...achievement,
          icon: [
            <Target className="w-4 h-4" />,
            <Star className="w-4 h-4" />,
            <Flame className="w-4 h-4" />,
            <Timer className="w-4 h-4" />
          ][index] || <Target className="w-4 h-4" />
        })) || []
      };
    }
    
    return {
      currentAccuracy: 0,
      peakAccuracy: 0,
      streak: 0,
      totalScore: 0,
      level: ACCURACY_LEVELS[0],
      nextLevel: ACCURACY_LEVELS[1],
      experiencePoints: 0,
      nextLevelXP: 1000,
      achievements: [
        { id: 'first_analysis', name: '첫 분석', description: '첫 번째 음성 분석 완료', icon: <Target className="w-4 h-4" />, isUnlocked: false, progress: 0, maxProgress: 1, type: 'milestone' },
        { id: 'accuracy_70', name: '정확도 마스터', description: '70% 이상 정확도 달성', icon: <Star className="w-4 h-4" />, isUnlocked: false, progress: 0, maxProgress: 70, type: 'accuracy' },
        { id: 'streak_5', name: '연속 성공', description: '5회 연속 높은 정확도', icon: <Flame className="w-4 h-4" />, isUnlocked: false, progress: 0, maxProgress: 5, type: 'streak' },
        { id: 'speed_demon', name: '스피드 데몬', description: '30초 이내 빠른 분석', icon: <Timer className="w-4 h-4" />, isUnlocked: false, progress: 0, maxProgress: 1, type: 'time' },
      ],
      recentBoosts: []
    };
  });

  const [animatingAccuracy, setAnimatingAccuracy] = useState(currentAccuracy);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  // 정확도가 변경될 때 게임 스탯 업데이트
  const updateGameStats = useCallback((newAccuracy: number) => {
    setAccuracyStats(prev => {
      const updatedStats = { ...prev };
      const prevAccuracy = updatedStats.currentAccuracy;
      
      updatedStats.currentAccuracy = newAccuracy;
      
      // 최고 정확도 업데이트
      if (newAccuracy > updatedStats.peakAccuracy) {
        updatedStats.peakAccuracy = newAccuracy;
        updatedStats.recentBoosts = [...updatedStats.recentBoosts.slice(-2), `새 기록! ${newAccuracy.toFixed(1)}%`];
      }
      
      // 연속 성공 스트릭 계산
      if (newAccuracy >= 70) {
        updatedStats.streak += 1;
        if (updatedStats.streak % 3 === 0) {
          updatedStats.recentBoosts = [...updatedStats.recentBoosts.slice(-2), `${updatedStats.streak}연속 성공!`];
        }
      } else if (newAccuracy < 50) {
        updatedStats.streak = 0;
      }
      
      // 경험치 계산
      const baseXP = Math.floor(newAccuracy * 10);
      const streakBonus = Math.floor(updatedStats.streak * 50);
      const levelBonus = Math.floor(baseXP * updatedStats.level.bonusMultiplier);
      const totalXPGain = baseXP + streakBonus + levelBonus;
      
      updatedStats.experiencePoints += totalXPGain;
      updatedStats.totalScore += totalXPGain;
      
      // 레벨업 확인
      const currentLevelIndex = ACCURACY_LEVELS.findIndex(l => l.level === updatedStats.level.level);
      const possibleNextLevel = ACCURACY_LEVELS[currentLevelIndex + 1];
      
      if (possibleNextLevel && updatedStats.experiencePoints >= updatedStats.nextLevelXP) {
        updatedStats.level = possibleNextLevel;
        updatedStats.nextLevel = ACCURACY_LEVELS[currentLevelIndex + 2] || null;
        updatedStats.nextLevelXP = Math.floor(updatedStats.nextLevelXP * 1.5);
        updatedStats.recentBoosts = [...updatedStats.recentBoosts.slice(-2), `레벨업! ${updatedStats.level.name}`];
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
      
      // 업적 진행도 업데이트
      const newlyUnlocked: Achievement[] = [];
      updatedStats.achievements = updatedStats.achievements.map(achievement => {
        const updated = { ...achievement };
        
        switch (achievement.type) {
          case 'accuracy':
            if (achievement.id === 'accuracy_70' && newAccuracy >= 70) {
              updated.progress = Math.max(updated.progress, newAccuracy);
              if (!updated.isUnlocked && updated.progress >= updated.maxProgress) {
                updated.isUnlocked = true;
                newlyUnlocked.push(updated);
              }
            }
            break;
          case 'streak':
            if (achievement.id === 'streak_5') {
              updated.progress = updatedStats.streak;
              if (!updated.isUnlocked && updated.progress >= updated.maxProgress) {
                updated.isUnlocked = true;
                newlyUnlocked.push(updated);
              }
            }
            break;
          case 'milestone':
            if (achievement.id === 'first_analysis' && !updated.isUnlocked) {
              updated.progress = 1;
              updated.isUnlocked = true;
              newlyUnlocked.push(updated);
            }
            break;
        }
        
        return updated;
      });
      
      if (newlyUnlocked.length > 0) {
        setNewAchievements(newlyUnlocked);
        setTimeout(() => setNewAchievements([]), 4000);
      }
      
      return updatedStats;
    });
  }, []);

  // 현재 정확도가 변경될 때 애니메이션과 통계 업데이트
  useEffect(() => {
    if (isAnalyzing && currentAccuracy !== accuracyStats.currentAccuracy) {
      // 부드러운 애니메이션을 위한 중간 단계
      const steps = 20;
      const diff = currentAccuracy - animatingAccuracy;
      const stepSize = diff / steps;
      
      let currentStep = 0;
      const animationInterval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setAnimatingAccuracy(currentAccuracy);
          updateGameStats(currentAccuracy);
          clearInterval(animationInterval);
        } else {
          setAnimatingAccuracy(prev => prev + stepSize);
        }
      }, 50);
      
      return () => clearInterval(animationInterval);
    }
  }, [currentAccuracy, isAnalyzing, updateGameStats, animatingAccuracy, accuracyStats.currentAccuracy]);

  // 로컬 스토리지에 저장 (DOM 요소는 제외하고 직렬화 가능한 데이터만)
  useEffect(() => {
    const serializable = {
      ...accuracyStats,
      achievements: accuracyStats.achievements.map(achievement => ({
        ...achievement,
        icon: undefined // DOM 요소는 제외
      }))
    };
    localStorage.setItem('accuracyGameStats', JSON.stringify(serializable));
  }, [accuracyStats]);

  const resetStats = () => {
    localStorage.removeItem('accuracyGameStats');
    window.location.reload();
  };

  const progressToNextLevel = accuracyStats.nextLevel 
    ? ((accuracyStats.experiencePoints % accuracyStats.nextLevelXP) / accuracyStats.nextLevelXP) * 100 
    : 100;

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600 bg-green-100';
    if (accuracy >= 75) return 'text-blue-600 bg-blue-100';
    if (accuracy >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* 레벨업 알림 */}
      {showLevelUp && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-2xl">
            <CardContent className="p-4 text-center">
              <Crown className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold text-lg">레벨업!</div>
              <div className="text-sm">{accuracyStats.level.name}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 새 업적 알림 */}
      {newAchievements.map((achievement, index) => (
        <div key={achievement.id} className="fixed top-4 right-4 z-50 animate-slide-in-right" style={{ animationDelay: `${index * 0.5}s` }}>
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6" />
                <div>
                  <div className="font-bold">{achievement.name}</div>
                  <div className="text-sm opacity-90">{achievement.description}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}

      {/* 개선된 실시간 정확도 디스플레이 */}
      <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-0 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl ${accuracyStats.level.color} shadow-md`}>
                {accuracyStats.level.icon}
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  실시간 정확도
                </span>
                <div className="text-sm text-gray-600">게이미피케이션 시스템</div>
              </div>
            </CardTitle>
            <div className="text-right">
              <Badge 
                className={`${getAccuracyColor(animatingAccuracy)} px-4 py-2 text-sm font-bold shadow-sm`}
              >
                Lv.{accuracyStats.level.level}
              </Badge>
              <div className="text-xs text-gray-600 mt-1">{accuracyStats.level.name}</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* 현재 정확도 */}
          <div className="text-center">
            <div className="relative">
              <div className={`text-6xl font-bold mb-2 ${getAccuracyColor(animatingAccuracy)} bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                {animatingAccuracy.toFixed(1)}%
              </div>
              {isAnalyzing && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600">현재 분석 정확도</div>
          </div>

          {/* 진행 상황 통계 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <TrendingUp className="w-6 h-6 mx-auto text-green-500 mb-1" />
              <div className="font-semibold text-lg">{accuracyStats.peakAccuracy.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">최고 기록</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <Flame className="w-6 h-6 mx-auto text-orange-500 mb-1" />
              <div className="font-semibold text-lg">{accuracyStats.streak}</div>
              <div className="text-xs text-gray-500">연속 성공</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <Star className="w-6 h-6 mx-auto text-yellow-500 mb-1" />
              <div className="font-semibold text-lg">{accuracyStats.totalScore.toLocaleString()}</div>
              <div className="text-xs text-gray-500">총 점수</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <Target className="w-6 h-6 mx-auto text-blue-500 mb-1" />
              <div className="font-semibold text-lg">{accuracyStats.experiencePoints.toLocaleString()}</div>
              <div className="text-xs text-gray-500">경험치</div>
            </div>
          </div>

          {/* 다음 레벨 진행도 */}
          {accuracyStats.nextLevel && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>다음 레벨: {accuracyStats.nextLevel.name}</span>
                <span>{progressToNextLevel.toFixed(1)}%</span>
              </div>
              <Progress value={progressToNextLevel} className="h-3 bg-gray-200">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressToNextLevel}%` }}
                />
              </Progress>
            </div>
          )}

          {/* 최근 부스트 알림 */}
          {accuracyStats.recentBoosts.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">최근 달성</div>
              <div className="space-y-1">
                {accuracyStats.recentBoosts.slice(-3).map((boost, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full animate-pulse">
                    <ChevronUp className="w-4 h-4" />
                    <span>{boost}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 개선된 리셋 버튼 */}
          <div className="flex justify-center pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetStats} 
              className="text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
            >
              <span className="mr-1">🔄</span>
              통계 초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 업적 시스템 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>업적</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accuracyStats.achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`p-3 rounded-lg border transition-all ${
                  achievement.isUnlocked 
                    ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${achievement.isUnlocked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${achievement.isUnlocked ? 'text-green-800' : 'text-gray-600'}`}>
                      {achievement.name}
                    </div>
                    <div className="text-xs text-gray-500">{achievement.description}</div>
                    <div className="mt-1">
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-1"
                      />
                    </div>
                  </div>
                  {achievement.isUnlocked && (
                    <Badge className="bg-green-100 text-green-800">완료</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAccuracy;