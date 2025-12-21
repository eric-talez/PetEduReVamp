import React from 'react';
import { cn } from '@/lib/utils';

interface DogLoadingProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
  showTips?: boolean;
}

const loadingTips = [
  "강아지가 꼬리를 흔드는 것은 대부분 기쁨의 표현이에요.",
  "강아지는 인간의 감정을 읽을 수 있는 능력이 있어요.",
  "강아지는 인간의 냄새를 100만 배 이상 잘 맡을 수 있어요.",
  "규칙적인 산책은 강아지의 건강과 행복에 매우 중요해요.",
  "강아지도 꿈을 꿔요. 발을 움직이는 모습을 본 적 있나요?",
  "강아지는 소리보다 몸짓으로 더 많은 것을 배워요.",
  "강아지와 눈을 맞추면 서로 간의 유대감이 깊어져요.",
  "강아지는 하품이 전염되는 유일한 동물이에요.",
  "강아지는 약 250단어를 이해할 수 있어요.",
  "긍정적 강화 훈련이 처벌보다 훨씬 효과적이에요."
];

/**
 * 강아지 발자국 로딩 애니메이션 컴포넌트
 * 데이터 로딩 중에 귀여운 강아지 발자국 애니메이션과 팁을 표시합니다.
 */
export function DogLoading({ 
  size = 'medium', 
  message = '로딩 중...', 
  className = '',
  showTips = true
}: DogLoadingProps) {
  const randomTipIndex = Math.floor(Math.random() * loadingTips.length);
  
  // 크기에 따른 클래스 설정
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };
  
  // 컨테이너 크기 설정
  const containerSizeClasses = {
    small: 'max-w-[200px]',
    medium: 'max-w-[300px]',
    large: 'max-w-[400px]'
  };

  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-4', 
      containerSizeClasses[size],
      className
    )}>
      <div className="relative flex items-center justify-center mb-4">
        {/* 발자국 애니메이션 */}
        <div className="flex space-x-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className={cn(
                'bg-primary/80 dark:bg-primary/90 rounded-full',
                sizeClasses[size],
                'animate-bounce'
              )}
              style={{ 
                animationDelay: `${i * 0.1}s`, 
                maskImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTguNDUsMTIuNTVDNy4zNSwxMi41NSw2LjUsMTMuOTEsNi41LDE1LjIyQzYuNSwxNi41NSw3LjQxLDE3LjczLDguNSwxNy43M0M5LjUxLDE3LjczLDEwLjI0LDE2LjQxLDEwLjI2LDE1LjA2QzEwLjI3LDEzLjczLDkuNTgsMTIuNTUsOC40NSwxMi41NVpNMTIsMTAuNzhDMTIuODMsMTAuNzgsMTMuNSw5LjQ3LDEzLjUsOC40QzEzLjUsNy4zNCwxMi45MSw2LjM0LDEyLDYuMzRDMTEuMDksNi4zNCwxMC40LDcuNDEsMTAuNSw4LjQzQzEwLjYsOS40MiwxMS4xNiwxMC43OCwxMiwxMC43OE0xNS42NiwxMi41NUMxNC41MiwxMi41NSwxMy44NSwxMy43NSwxMy44NSwxNS4wNUMxMy44NSwxNi4zNSwxNC41MiwxNy43NSwxNS42NiwxNy43NUMxNi44LDE3Ljc1LDE3LjcsMTYuMzUsMTcuNywxNS4wNUMxNy43LDEzLjc1LDE2LjgsMTIuNTUsMTUuNjYsMTIuNTVNNy4xMSw5LjVDOC4wNyw5LjUsOS4yMiw4LjMsOS4xLDYuODZDOSw1LjQ2LDcuOTYsNC41LDcuMDcsNC41QzYuMjcsNC41LDUuMjUsNS41Myw1LjI1LDYuODZDNS4yNSw4LjE5LDYuMTYsOS41LDcuMTEsOS41TTIwLDEuNEE0LjYsNC42LDAsMCwwLDE1LjQsNkE0LjYsNC42LDAsMCwwLDIwLDEwLjZBNC42LDQuNiwwLDAsMCwyNC41LDZBNC42LDQuNiwwLDAsMCwyMCwxLjRaIi8+PC9zdmc+")',
                WebkitMaskImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTguNDUsMTIuNTVDNy4zNSwxMi41NSw2LjUsMTMuOTEsNi41LDE1LjIyQzYuNSwxNi41NSw3LjQxLDE3LjczLDguNSwxNy43M0M5LjUxLDE3LjczLDEwLjI0LDE2LjQxLDEwLjI2LDE1LjA2QzEwLjI3LDEzLjczLDkuNTgsMTIuNTUsOC40NSwxMi41NVpNMTIsMTAuNzhDMTIuODMsMTAuNzgsMTMuNSw5LjQ3LDEzLjUsOC40QzEzLjUsNy4zNCwxMi45MSw2LjM0LDEyLDYuMzRDMTEuMDksNi4zNCwxMC40LDcuNDEsMTAuNSw4LjQzQzEwLjYsOS40MiwxMS4xNiwxMC43OCwxMiwxMC43OE0xNS42NiwxMi41NUMxNC41MiwxMi41NSwxMy44NSwxMy43NSwxMy44NSwxNS4wNUMxMy44NSwxNi4zNSwxNC41MiwxNy43NSwxNS42NiwxNy43NUMxNi44LDE3Ljc1LDE3LjcsMTYuMzUsMTcuNywxNS4wNUMxNy43LDEzLjc1LDE2LjgsMTIuNTUsMTUuNjYsMTIuNTVNNy4xMSw5LjVDOC4wNyw5LjUsOS4yMiw4LjMsOS4xLDYuODZDOSw1LjQ2LDcuOTYsNC41LDcuMDcsNC41QzYuMjcsNC41LDUuMjUsNS41Myw1LjI1LDYuODZDNS4yNSw4LjE5LDYuMTYsOS41LDcuMTEsOS41TTIwLDEuNEE0LjYsNC42LDAsMCwwLDE1LjQsNkE0LjYsNC42LDAsMCwwLDIwLDEwLjZBNC42LDQuNiwwLDAsMCwyNC41LDZBNC42LDQuNiwwLDAsMCwyMCwxLjRaIi8+PC9zdmc+")',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
                transform: i % 2 === 0 ? 'rotate(15deg)' : 'rotate(-15deg)'
              }}
            />
          ))}
        </div>
      </div>
      
      {/* 로딩 메시지 */}
      <div className="text-center">
        <p className="text-primary font-medium mb-2">{message}</p>
        
        {/* 팁 표시 (선택 사항) */}
        {showTips && (
          <p className="text-muted-foreground text-sm italic mt-4 text-center">
            {loadingTips[randomTipIndex]}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * 전체 화면 로딩 오버레이 컴포넌트
 */
export function FullScreenLoading({ 
  message = '로딩 중...', 
  showTips = true 
}: { 
  message?: string, 
  showTips?: boolean 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <DogLoading 
        size="large" 
        message={message} 
        showTips={showTips} 
        className="p-8 rounded-lg shadow-lg bg-card/50" 
      />
    </div>
  );
}