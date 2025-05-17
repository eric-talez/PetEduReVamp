import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// 스크롤에 따라 나타나는 애니메이션 컴포넌트
export const ScrollReveal = ({ 
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.1,
  once = true
}: { 
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number;
  once?: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 이미 한 번 애니메이션이 실행되었고, once가 true면 무시
        if (hasAnimated && once) return;
        
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) setHasAnimated(true);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { 
        threshold,
        rootMargin: '0px 0px -10% 0px'
      }
    );
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once, hasAnimated]);

  // 방향에 따른 초기 및 최종 변환 설정
  const getTransform = () => {
    if (direction === 'up') return 'translateY(20px)';
    if (direction === 'down') return 'translateY(-20px)';
    if (direction === 'left') return 'translateX(20px)';
    if (direction === 'right') return 'translateX(-20px)';
    return 'translate(0, 0)';
  };

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : getTransform(),
        transition: `opacity 0.5s ease-out ${delay}ms, transform 0.5s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// 데이터 로딩 상태를 시각적으로 표현하는 스켈레톤 로더
export const SkeletonLoader = ({ 
  className = '',
  variant = 'rectangular',
  width,
  height,
  count = 1
}: { 
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
  count?: number;
}) => {
  const items = Array.from({ length: count }, (_, i) => i);
  
  // 스켈레톤 형태에 따른 클래스 설정
  const getSkeletonClass = () => {
    const baseClass = 'animate-pulse bg-gray-200 dark:bg-gray-700';
    
    if (variant === 'circular') {
      return `${baseClass} rounded-full`;
    } else if (variant === 'text') {
      return `${baseClass} rounded-md h-4`;
    }
    
    return `${baseClass} rounded-md`;
  };
  
  const skeletonClass = getSkeletonClass();
  
  return (
    <>
      {items.map((item) => (
        <div
          key={item}
          className={cn(skeletonClass, className)}
          style={{
            width: width || '100%',
            height: height || (variant === 'text' ? '1rem' : '100px'),
            marginBottom: count > 1 ? '0.5rem' : undefined
          }}
        />
      ))}
    </>
  );
};

// 그래프와 차트를 위한 애니메이션 효과가 있는 진행 바
export const AnimatedProgressBar = ({ 
  value, 
  max = 100, 
  label, 
  color = 'primary',
  showValue = true,
  height = 8,
  animate = true
}: { 
  value: number;
  max?: number;
  label?: string;
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
  showValue?: boolean;
  height?: number;
  animate?: boolean;
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = (value / max) * 100;
  
  useEffect(() => {
    if (!animate) {
      setDisplayValue(percentage);
      return;
    }
    
    // 값이 변경되면 애니메이션 효과로 부드럽게 변경
    let start: number;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const stepValue = Math.min((progress / 800) * percentage, percentage);
      
      setDisplayValue(stepValue);
      
      if (stepValue < percentage) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [percentage, animate]);
  
  // 색상 클래스 매핑
  const colorClass = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-green-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          {showValue && (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {Math.round(displayValue)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`} style={{ height }}>
        <div
          className={`${colorClass[color]} transition-all duration-300`}
          style={{
            width: `${displayValue}%`,
            height: '100%',
            borderRadius: 'inherit'
          }}
        />
      </div>
    </div>
  );
};

// 입체적인 카드 효과를 위한 틸트 효과 컴포넌트
export const TiltCard = ({
  children,
  className = '',
  maxTilt = 5, // 최대 기울기 각도
  scale = 1.03, // 호버 시 확대 비율
  perspective = 1000 // 원근감 (값이 작을수록 효과가 강함)
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  perspective?: number;
}) => {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // 마우스 X 위치
    const y = e.clientY - rect.top; // 마우스 Y 위치
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // 중앙에서의 거리 계산 (-1 ~ 1 범위)
    const rotateX = ((y - centerY) / centerY) * -maxTilt; // Y축 회전 (가로축)
    const rotateY = ((x - centerX) / centerX) * maxTilt; // X축 회전 (세로축)
    
    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'none'
    });
  };
  
  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
      transition: 'all 0.5s ease'
    });
  };
  
  return (
    <div
      ref={cardRef}
      className={cn('transition-all duration-300', className)}
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};