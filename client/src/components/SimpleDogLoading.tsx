import React from 'react';

interface SimpleDogLoadingProps {
  text?: string;
  className?: string;
  color?: string;
}

export function SimpleDogLoading({ text = '로딩 중...', className = '', color = '#8B5CF6' }: SimpleDogLoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* 간단한 강아지 로딩 애니메이션(CSS-only) */}
      <div className="relative w-24 h-24">
        {/* 강아지 몸통 */}
        <div className="absolute w-16 h-10 bg-amber-200 rounded-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
          {/* 얼굴 */}
          <div className="absolute w-10 h-9 bg-amber-100 rounded-full -right-2 -top-2 z-10">
            {/* 귀 */}
            <div className="absolute w-5 h-5 bg-amber-300 rounded-full -left-1 -top-1 animate-bounce [animation-duration:2s]"></div>
            <div className="absolute w-5 h-5 bg-amber-300 rounded-full -right-1 -top-1 animate-bounce [animation-duration:2.2s]"></div>
            
            {/* 눈 - 깜빡이는 효과 추가 */}
            <div className="absolute w-2 h-2 bg-gray-800 rounded-full left-2 top-3 animate-blink"></div>
            <div className="absolute w-2 h-2 bg-gray-800 rounded-full right-2 top-3 animate-blink" style={{ animationDelay: '0.5s' }}></div>
            
            {/* 코 */}
            <div className="absolute w-2.5 h-2 bg-gray-800 rounded-full left-1/2 top-5 -translate-x-1/2"></div>
          </div>
          
          {/* 다리 */}
          <div className="absolute w-2 h-5 bg-amber-200 rounded-md left-2 bottom-0 animate-bounce [animation-duration:1s]"></div>
          <div className="absolute w-2 h-5 bg-amber-200 rounded-md left-6 bottom-0 animate-bounce [animation-duration:1.1s]"></div>
          <div className="absolute w-2 h-5 bg-amber-200 rounded-md right-6 bottom-0 animate-bounce [animation-duration:1s]"></div>
          <div className="absolute w-2 h-5 bg-amber-200 rounded-md right-2 bottom-0 animate-bounce [animation-duration:1.1s]"></div>
          
          {/* 꼬리 - Tailwind 설정의 애니메이션 사용 */}
          <div className="absolute w-4 h-2 bg-amber-200 rounded-md -left-3 top-1/2 -translate-y-1/2 origin-right animate-wiggle"></div>
        </div>
      </div>
      
      {/* 로딩 텍스트 - 애니메이션 적용 */}
      {text && (
        <div className="mt-4 text-sm font-medium flex space-x-1 text-primary">
          <span>{text}</span>
          <span className="inline-flex">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce [animation-delay:0.2s]">.</span>
            <span className="animate-bounce [animation-delay:0.4s]">.</span>
          </span>
        </div>
      )}
      
      {/* 애니메이션은 tailwind.config.ts에 정의됨 */}
    </div>
  );
}