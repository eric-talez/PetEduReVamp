import React from 'react';

interface DogLoadingStateProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  color?: string;
  className?: string;
}

export function DogLoadingState({
  size = 'md',
  text = '로딩 중...',
  className = '',
}: DogLoadingStateProps) {
  // 사이즈에 따른 너비 설정
  const sizeMap = {
    sm: 'w-24',
    md: 'w-32',
    lg: 'w-40',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizeMap[size]}`}>
        {/* 간단한 강아지 모양 */}
        <div className="relative w-full aspect-square rounded-full bg-amber-200 animate-bounce">
          {/* 귀 - 왼쪽 */}
          <div className="absolute w-1/3 h-1/3 bg-amber-300 rounded-full -left-1/6 -top-1/6" />
          
          {/* 귀 - 오른쪽 */}
          <div className="absolute w-1/3 h-1/3 bg-amber-300 rounded-full -right-1/6 -top-1/6" />
          
          {/* 눈 - 왼쪽 */}
          <div className="absolute w-[15%] h-[15%] bg-gray-800 rounded-full left-1/4 top-1/3" />
          
          {/* 눈 - 오른쪽 */}
          <div className="absolute w-[15%] h-[15%] bg-gray-800 rounded-full right-1/4 top-1/3" />
          
          {/* 코 */}
          <div className="absolute w-[20%] h-[12%] bg-gray-800 rounded-full left-[40%] top-[45%]" />
          
          {/* 입 */}
          <div className="absolute w-[30%] h-[8%] border-b-2 border-gray-800 rounded-b-full left-[35%] top-[55%]" />
        </div>
        
        {/* 로딩 점들 */}
        <div className="flex justify-center mt-4 space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:200ms]" />
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:400ms]" />
        </div>
      </div>
      
      {text && (
        <div className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">
          {text}
        </div>
      )}
    </div>
  );
}