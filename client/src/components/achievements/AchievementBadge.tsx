import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type AchievementLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface AchievementBadgeProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  level: AchievementLevel;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  className?: string;
}

const levelColors = {
  bronze: 'bg-amber-700',
  silver: 'bg-slate-400',
  gold: 'bg-amber-400',
  platinum: 'bg-indigo-400'
};

const levelBorders = {
  bronze: 'border-amber-900',
  silver: 'border-slate-600',
  gold: 'border-amber-600',
  platinum: 'border-indigo-600'
};

export function AchievementBadge({
  id,
  name,
  description,
  icon,
  level,
  unlocked,
  progress = 0,
  maxProgress = 1,
  className
}: AchievementBadgeProps) {
  const progressPercentage = Math.min(100, Math.round((progress / maxProgress) * 100));
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              'relative flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-300',
              unlocked ? levelColors[level] : 'bg-gray-300 dark:bg-gray-700',
              unlocked ? levelBorders[level] : 'border-gray-400 dark:border-gray-600',
              unlocked ? 'scale-100 opacity-100' : 'scale-90 opacity-80 grayscale',
              className
            )}
            data-achievement-id={id}
          >
            <div className="text-2xl text-white">
              {icon}
            </div>
            
            {!unlocked && maxProgress > 1 && (
              <div className="absolute -bottom-2 left-0 w-full">
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
            
            {unlocked && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center rounded-full"
              >
                ✓
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-bold">{name}</p>
            <p className="text-xs">{description}</p>
            {!unlocked && maxProgress > 1 && (
              <p className="text-xs font-semibold">
                진행도: {progress}/{maxProgress} ({progressPercentage}%)
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}