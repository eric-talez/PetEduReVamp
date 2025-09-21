
import React from 'react';
import { cn } from '@/lib/utils';

// 스피너 로딩
export const Spinner = ({ size = 'default', className }: { 
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <svg 
      className={cn(
        "animate-spin text-current",
        sizeClasses[size],
        className
      )}
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};

// 인라인 로딩
export const InlineLoading = ({ text = '로딩 중...' }: { text?: string }) => (
  <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
    <Spinner size="sm" />
    <span>{text}</span>
  </div>
);

// 페이지 로딩
export const PageLoading = ({ text = '페이지를 불러오는 중...' }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
    <Spinner size="lg" />
    <p className="text-gray-600 dark:text-gray-400">{text}</p>
  </div>
);

// 풀스크린 로딩
export const FullScreenLoading = ({ text = '로딩 중...' }: { text?: string }) => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4">
      <Spinner size="lg" />
      <p className="text-lg font-medium">{text}</p>
    </div>
  </div>
);
