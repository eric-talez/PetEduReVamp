import React from 'react';
import { useAchievements } from '@/hooks/useAchievements';
import { Award, User, BookOpen, MessageSquare, Dog, CheckCircle, Star, ShoppingBag, Bell, Calendar, Compass, LogIn } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  id: string;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// 아이콘 매핑 함수
const getIconForAchievement = (iconName: string, size: 'sm' | 'md' | 'lg') => {
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  const iconSize = iconSizes[size];
  
  switch (iconName) {
    case 'user':
      return <User className={iconSize} />;
    case 'log-in':
      return <LogIn className={iconSize} />;
    case 'book-open':
      return <BookOpen className={iconSize} />;
    case 'dog':
      return <Dog className={iconSize} />;
    case 'message-square':
      return <MessageSquare className={iconSize} />;
    case 'check-circle':
      return <CheckCircle className={iconSize} />;
    case 'star':
      return <Star className={iconSize} />;
    case 'award':
      return <Award className={iconSize} />;
    case 'shopping-bag':
      return <ShoppingBag className={iconSize} />;
    case 'bell':
      return <Bell className={iconSize} />;
    case 'calendar':
      return <Calendar className={iconSize} />;
    case 'compass':
      return <Compass className={iconSize} />;
    default:
      return <Award className={iconSize} />;
  }
};

// 카테고리별 스타일 매핑
const getCategoryStyle = (category: string, isUnlocked: boolean) => {
  if (!isUnlocked) {
    return 'bg-muted text-muted-foreground';
  }
  
  switch (category) {
    case 'beginner':
      return 'bg-amber-700 text-white';
    case 'intermediate':
      return 'bg-slate-400 text-white';
    case 'advanced':
      return 'bg-amber-400 text-amber-950';
    case 'expert':
      return 'bg-indigo-400 text-white';
    default:
      return 'bg-primary text-primary-foreground';
  }
};

// 크기별 컨테이너 스타일 매핑
const getSizeStyle = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return 'p-1 rounded-md';
    case 'md':
      return 'p-2 rounded-lg';
    case 'lg':
      return 'p-3 rounded-xl';
    default:
      return 'p-2 rounded-lg';
  }
};

export function AchievementBadge({ id, showTooltip = true, size = 'md', className }: AchievementBadgeProps) {
  const { getAchievementById, isAchievementUnlocked, getAchievementProgress } = useAchievements();
  
  const achievement = getAchievementById(id);
  
  if (!achievement) {
    return null;
  }
  
  const isUnlocked = isAchievementUnlocked(id);
  const progress = getAchievementProgress(id);
  const progressPercentage = Math.round((progress.current / progress.total) * 100);
  const containerStyle = getSizeStyle(size);
  const categoryStyle = getCategoryStyle(achievement.category, isUnlocked);
  
  const badgeContent = (
    <div 
      className={cn(
        containerStyle,
        categoryStyle,
        'flex items-center justify-center transition-all duration-300',
        isUnlocked ? 'shadow-md' : 'opacity-50',
        className
      )}
    >
      {getIconForAchievement(achievement.icon, size)}
    </div>
  );
  
  if (!showTooltip) {
    return badgeContent;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
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
}