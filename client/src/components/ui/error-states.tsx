
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  showRetry?: boolean;
  onRetry?: () => void;
  showHome?: boolean;
  onHome?: () => void;
  variant?: 'default' | 'minimal' | 'full';
  className?: string;
}

export const ErrorState = ({
  title = '오류가 발생했습니다',
  message = '요청을 처리하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  action,
  showRetry = true,
  onRetry,
  showHome = false,
  onHome,
  variant = 'default',
  className
}: ErrorStateProps) => {
  const variantClasses = {
    default: 'min-h-[200px] p-8',
    minimal: 'p-4',
    full: 'min-h-[400px] p-12'
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center space-y-4",
      variantClasses[variant],
      className
    )}>
      <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          {message}
        </p>
      </div>

      <div className="flex gap-2 pt-2">
        {showRetry && onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            다시 시도
          </Button>
        )}
        
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
        
        {showHome && onHome && (
          <Button 
            onClick={onHome}
            variant="ghost"
            leftIcon={<Home className="h-4 w-4" />}
          >
            홈으로
          </Button>
        )}
      </div>
    </div>
  );
};

// 인라인 에러
export const InlineError = ({ message, onRetry }: { 
  message: string; 
  onRetry?: () => void; 
}) => (
  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
    <span className="text-sm text-red-700 dark:text-red-300 flex-grow">{message}</span>
    {onRetry && (
      <Button
        size="sm"
        variant="ghost"
        onClick={onRetry}
        className="text-red-600 hover:text-red-700 dark:text-red-400"
      >
        재시도
      </Button>
    )}
  </div>
);
