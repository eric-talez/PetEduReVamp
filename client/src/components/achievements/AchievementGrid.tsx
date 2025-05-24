import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { useAchievements } from '@/hooks/useAchievements';
import { Award, User, BookOpen, MessageSquare, Dog, CheckCircle, Star, ShoppingBag, Bell, Calendar, Compass, LogIn } from 'lucide-react';

interface AchievementGridProps {
  className?: string;
}

// 아이콘 매핑 함수
const getIconForAchievement = (iconName: string) => {
  switch (iconName) {
    case 'user':
      return <User className="h-6 w-6" />;
    case 'log-in':
      return <LogIn className="h-6 w-6" />;
    case 'book-open':
      return <BookOpen className="h-6 w-6" />;
    case 'dog':
      return <Dog className="h-6 w-6" />;
    case 'message-square':
      return <MessageSquare className="h-6 w-6" />;
    case 'check-circle':
      return <CheckCircle className="h-6 w-6" />;
    case 'star':
      return <Star className="h-6 w-6" />;
    case 'award':
      return <Award className="h-6 w-6" />;
    case 'shopping-bag':
      return <ShoppingBag className="h-6 w-6" />;
    case 'bell':
      return <Bell className="h-6 w-6" />;
    case 'calendar':
      return <Calendar className="h-6 w-6" />;
    case 'compass':
      return <Compass className="h-6 w-6" />;
    default:
      return <Award className="h-6 w-6" />;
  }
};

// 카테고리별 배경색 매핑
const getCategoryStyle = (category: string) => {
  switch (category) {
    case 'beginner':
      return 'bg-amber-700/10 border-amber-700/30';
    case 'intermediate':
      return 'bg-slate-400/10 border-slate-400/30';
    case 'advanced':
      return 'bg-amber-400/10 border-amber-400/30';
    case 'expert':
      return 'bg-indigo-400/10 border-indigo-400/30';
    default:
      return 'bg-muted border-muted-foreground/30';
  }
};

// 카테고리 한글 이름 매핑
const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'beginner':
      return '입문';
    case 'intermediate':
      return '중급';
    case 'advanced':
      return '고급';
    case 'expert':
      return '전문가';
    default:
      return '기타';
  }
};

export function AchievementGrid({ className = '' }: AchievementGridProps) {
  const { achievements, isAchievementUnlocked, getAchievementProgress } = useAchievements();
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
      {achievements.map((achievement) => {
        const isUnlocked = isAchievementUnlocked(achievement.id);
        const progress = getAchievementProgress(achievement.id);
        const progressPercentage = Math.round((progress.current / progress.total) * 100);
        const categoryStyle = getCategoryStyle(achievement.category);
        
        return (
          <TooltipProvider key={achievement.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className={`relative overflow-hidden transition-all duration-300 ${categoryStyle} ${isUnlocked ? 'border-2' : 'opacity-70 border hover:opacity-100'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${isUnlocked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {getIconForAchievement(achievement.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold truncate">{achievement.title}</h3>
                          <Badge variant={isUnlocked ? 'success' : 'outline'} className="ml-2">
                            {isUnlocked ? '달성' : `${progressPercentage}%`}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {getCategoryLabel(achievement.category)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {progress.current}/{progress.total}
                          </span>
                        </div>
                        <Progress 
                          value={progressPercentage} 
                          className="mt-2 h-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div>
                  <p className="font-bold">{achievement.title}</p>
                  <p className="text-sm">{achievement.description}</p>
                  {isUnlocked ? (
                    <p className="text-xs text-success mt-1">획득 완료!</p>
                  ) : (
                    <p className="text-xs mt-1">진행률: {progressPercentage}% ({progress.current}/{progress.total})</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}