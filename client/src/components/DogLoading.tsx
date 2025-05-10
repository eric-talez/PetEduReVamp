import React from 'react';

interface DogLoadingProps {
  text?: string;
  className?: string;
}

/**
 * 강아지 모양 로딩 컴포넌트
 * CSS만으로 구현하여 이중 렌더링 방지 및 안정성 향상
 */
export function DogLoading({ text = '로딩 중...', className = '' }: DogLoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="dog-container relative w-24 h-24">
        {/* 몸통 */}
        <div className="absolute w-16 h-10 bg-amber-200 rounded-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
          {/* 얼굴 */}
          <div className="absolute w-10 h-9 bg-amber-100 rounded-full -right-2 -top-3 z-10">
            {/* 귀 */}
            <div className="absolute w-5 h-5 bg-amber-300 rounded-full -left-1 -top-1 animate-bounce" style={{ animationDuration: '2s' }}></div>
            <div className="absolute w-5 h-5 bg-amber-300 rounded-full -right-1 -top-1 animate-bounce" style={{ animationDuration: '2.2s' }}></div>
            
            {/* 눈 */}
            <div className="absolute w-1.5 h-1.5 bg-gray-800 rounded-full left-2 top-3"></div>
            <div className="absolute w-1.5 h-1.5 bg-gray-800 rounded-full right-2 top-3"></div>
            
            {/* 코 */}
            <div className="absolute w-2.5 h-2 bg-gray-800 rounded-full left-1/2 top-5 -translate-x-1/2"></div>
            
            {/* 입 */}
            <div className="absolute w-4 h-0.5 border-b border-gray-800 rounded-full left-1/2 top-7 -translate-x-1/2"></div>
          </div>
          
          {/* 다리 */}
          <div className="absolute w-2 h-5 bg-amber-200 rounded-md left-2 bottom-0 animate-bounce" style={{ animationDuration: '1s' }}></div>
          <div className="absolute w-2 h-5 bg-amber-200 rounded-md left-6 bottom-0 animate-bounce" style={{ animationDuration: '1.1s' }}></div>
          <div className="absolute w-2 h-5 bg-amber-200 rounded-md right-6 bottom-0 animate-bounce" style={{ animationDuration: '1s' }}></div>
          <div className="absolute w-2 h-5 bg-amber-200 rounded-md right-2 bottom-0 animate-bounce" style={{ animationDuration: '1.1s' }}></div>
          
          {/* 꼬리 */}
          <div className="absolute w-4 h-2 bg-amber-200 rounded-md -left-3 top-1/2 -translate-y-1/2 origin-right animate-ping" style={{ animationDuration: '2s' }}></div>
        </div>
      </div>
      
      {text && (
        <div className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-300 flex space-x-1">
          <span>{text}</span>
          <span className="inline-flex">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
          </span>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg) translateY(-50%); }
          25% { transform: rotate(20deg) translateY(-50%); }
          75% { transform: rotate(-20deg) translateY(-50%); }
        }
      `}} />
    </div>
  );
}