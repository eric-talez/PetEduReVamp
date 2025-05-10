import React from 'react';
import { SimpleDogLoading } from './SimpleDogLoading';

interface SimpleLoadingProps {
  text?: string;
  className?: string;
  useDog?: boolean; // 강아지 로딩 애니메이션 사용 여부
}

export function SimpleLoading({ text = '로딩 중...', className = '', useDog = true }: SimpleLoadingProps) {
  // 강아지 로딩 애니메이션이 활성화된 경우 강아지 로딩 컴포넌트 사용
  if (useDog) {
    return <SimpleDogLoading text={text} className={className} />;
  }
  
  // 기본 로딩 애니메이션
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      {text && (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
}