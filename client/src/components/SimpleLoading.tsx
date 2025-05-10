import React from 'react';

interface SimpleLoadingProps {
  text?: string;
  className?: string;
}

export function SimpleLoading({ text = '로딩 중...', className = '' }: SimpleLoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      {text && (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
}