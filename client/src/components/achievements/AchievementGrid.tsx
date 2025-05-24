import React, { useEffect } from 'react';
import { AchievementBadge } from './AchievementBadge';
import { useAchievements } from '@/hooks/useAchievements';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface AchievementGridProps {
  userId?: string;
  className?: string;
}

export function AchievementGrid({ className }: AchievementGridProps) {
  const { achievements, userAchievements, checkAchievements } = useAchievements();
  
  // 컴포넌트 마운트시 및 일정 간격으로 성취 달성 여부 확인
  useEffect(() => {
    // 초기 로드시 체크
    checkAchievements();
    
    // 10초마다 체크 (실제 구현에서는 더 긴 간격이나 이벤트 기반으로 변경 권장)
    const intervalId = setInterval(() => {
      checkAchievements();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [checkAchievements]);
  
  // 카테고리별 배지 그룹화
  const categoryTitles = {
    'training': '훈련 배지',
    'community': '커뮤니티 배지',
    'system': '시스템 배지',
    'profile': '프로필 배지',
    'location': '위치 배지'
  };
  
  // 카테고리별 배지 목록 생성
  const achievementsByCategory = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    
    const userAchievement = userAchievements.find(ua => ua.id === achievement.id);
    
    if (userAchievement) {
      acc[achievement.category].push({
        ...achievement,
        unlocked: userAchievement.unlocked,
        progress: userAchievement.progress,
        maxProgress: achievement.maxProgress || 1
      });
    }
    
    return acc;
  }, {} as Record<string, any[]>);
  
  // 카테고리가 없는 경우
  if (Object.keys(achievementsByCategory).length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        배지 정보를 불러오는 중입니다...
      </div>
    );
  }
  
  return (
    <div className={className}>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">전체 배지</TabsTrigger>
          <TabsTrigger value="unlocked">획득한 배지</TabsTrigger>
          <TabsTrigger value="locked">미획득 배지</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-semibold">{categoryTitles[category as keyof typeof categoryTitles]}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categoryAchievements.map(achievement => (
                  <AchievementBadge
                    key={achievement.id}
                    {...achievement}
                  />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="unlocked" className="space-y-6">
          {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => {
            const unlockedAchievements = categoryAchievements.filter(a => a.unlocked);
            if (unlockedAchievements.length === 0) return null;
            
            return (
              <div key={category} className="space-y-3">
                <h3 className="text-lg font-semibold">{categoryTitles[category as keyof typeof categoryTitles]}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {unlockedAchievements.map(achievement => (
                    <AchievementBadge
                      key={achievement.id}
                      {...achievement}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>
        
        <TabsContent value="locked" className="space-y-6">
          {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => {
            const lockedAchievements = categoryAchievements.filter(a => !a.unlocked);
            if (lockedAchievements.length === 0) return null;
            
            return (
              <div key={category} className="space-y-3">
                <h3 className="text-lg font-semibold">{categoryTitles[category as keyof typeof categoryTitles]}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {lockedAchievements.map(achievement => (
                    <AchievementBadge
                      key={achievement.id}
                      {...achievement}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}