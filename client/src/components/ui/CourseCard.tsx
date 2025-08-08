import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  image: string;
  title: string;
  description: string;
  badge?: { text: string; variant: string };
  trainer?: { image: string; name: string };
  status?: string;
  progress?: number;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function CourseCard({
  image,
  title,
  description,
  badge,
  trainer,
  status,
  progress,
  children,
  onClick,
  className
}: CourseCardProps) {
  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 overflow-hidden",
        className
      )}
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover"
        />
        {badge && (
          <Badge 
            variant={badge.variant as any}
            className="absolute top-3 left-3"
          >
            {badge.text}
          </Badge>
        )}
        {progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
            <div className="flex items-center justify-between text-sm">
              <span>진행률</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1.5 mt-1">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {description}
        </p>
        
        {trainer && (
          <div className="flex items-center mb-3">
            <img 
              src={trainer.image} 
              alt={trainer.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {trainer.name}
            </span>
          </div>
        )}
        
        {status && (
          <div className="mb-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              상태: {status}
            </span>
          </div>
        )}
        
        {children}
      </div>
    </Card>
  );
}