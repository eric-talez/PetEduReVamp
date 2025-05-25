import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface FadeProps {
  show: boolean;
  children: React.ReactNode;
  duration?: number;
  className?: string;
  onExited?: () => void;
}

/**
 * 페이드 애니메이션 컴포넌트
 * 
 * 요소의 등장과 퇴장에 부드러운 페이드 효과를 적용합니다.
 * 모션 감소 설정을 존중하여 접근성을 보장합니다.
 */
export const Fade: React.FC<FadeProps> = ({
  show,
  children,
  duration = 300,
  className,
  onExited,
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [isVisible, setIsVisible] = useState(show);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // prefers-reduced-motion 감지
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // 모션 감소 설정 감지
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  useEffect(() => {
    // 타이머 정리
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (show) {
      // 표시 시작
      setShouldRender(true);
      // 다음 프레임에서 가시성 설정 (트랜지션 활성화)
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      // 숨김 시작
      setIsVisible(false);
      
      // 모션 감소가 설정된 경우 트랜지션 건너뜀
      if (prefersReducedMotion) {
        setShouldRender(false);
        onExited?.();
        return;
      }
      
      // 트랜지션 완료 후 DOM에서 제거
      timerRef.current = setTimeout(() => {
        setShouldRender(false);
        onExited?.();
      }, duration);
    }
    
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [show, duration, onExited, prefersReducedMotion]);
  
  // 렌더링 여부 결정
  if (!shouldRender) {
    return null;
  }
  
  // 모션 감소가 설정된 경우 트랜지션 없이 즉시 변경
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <div
      className={cn(
        'transition-opacity',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

interface SlideProps {
  show: boolean;
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: string;
  duration?: number;
  className?: string;
  onExited?: () => void;
}

/**
 * 슬라이드 애니메이션 컴포넌트
 * 
 * 요소의 등장과 퇴장에 슬라이드 효과를 적용합니다.
 * 다양한 방향과 거리 설정이 가능합니다.
 */
export const Slide: React.FC<SlideProps> = ({
  show,
  children,
  direction = 'down',
  distance = '20px',
  duration = 300,
  className,
  onExited,
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [isVisible, setIsVisible] = useState(show);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // prefers-reduced-motion 감지
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // 모션 감소 설정 감지
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  // 방향에 따른 트랜스폼 계산
  const getTransform = (visible: boolean) => {
    if (visible) return 'translate(0, 0)';
    
    switch (direction) {
      case 'up':
        return `translate(0, -${distance})`;
      case 'down':
        return `translate(0, ${distance})`;
      case 'left':
        return `translate(-${distance}, 0)`;
      case 'right':
        return `translate(${distance}, 0)`;
      default:
        return 'translate(0, 0)';
    }
  };
  
  useEffect(() => {
    // 타이머 정리
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (show) {
      // 표시 시작
      setShouldRender(true);
      // 다음 프레임에서 가시성 설정 (트랜지션 활성화)
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      // 숨김 시작
      setIsVisible(false);
      
      // 모션 감소가 설정된 경우 트랜지션 건너뜀
      if (prefersReducedMotion) {
        setShouldRender(false);
        onExited?.();
        return;
      }
      
      // 트랜지션 완료 후 DOM에서 제거
      timerRef.current = setTimeout(() => {
        setShouldRender(false);
        onExited?.();
      }, duration);
    }
    
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [show, duration, onExited, prefersReducedMotion]);
  
  // 렌더링 여부 결정
  if (!shouldRender) {
    return null;
  }
  
  // 모션 감소가 설정된 경우 트랜지션 없이 즉시 변경
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <div
      className={cn(
        'transition-all',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        transform: getTransform(isVisible),
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};

interface ScaleProps {
  show: boolean;
  children: React.ReactNode;
  startScale?: number;
  duration?: number;
  className?: string;
  onExited?: () => void;
}

/**
 * 스케일 애니메이션 컴포넌트
 * 
 * 요소의 등장과 퇴장에 확대/축소 효과를 적용합니다.
 * 시작 크기를 조절하여 다양한 효과를 연출할 수 있습니다.
 */
export const Scale: React.FC<ScaleProps> = ({
  show,
  children,
  startScale = 0.95,
  duration = 300,
  className,
  onExited,
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [isVisible, setIsVisible] = useState(show);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // prefers-reduced-motion 감지
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // 모션 감소 설정 감지
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  useEffect(() => {
    // 타이머 정리
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (show) {
      // 표시 시작
      setShouldRender(true);
      // 다음 프레임에서 가시성 설정 (트랜지션 활성화)
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      // 숨김 시작
      setIsVisible(false);
      
      // 모션 감소가 설정된 경우 트랜지션 건너뜀
      if (prefersReducedMotion) {
        setShouldRender(false);
        onExited?.();
        return;
      }
      
      // 트랜지션 완료 후 DOM에서 제거
      timerRef.current = setTimeout(() => {
        setShouldRender(false);
        onExited?.();
      }, duration);
    }
    
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [show, duration, onExited, prefersReducedMotion]);
  
  // 렌더링 여부 결정
  if (!shouldRender) {
    return null;
  }
  
  // 모션 감소가 설정된 경우 트랜지션 없이 즉시 변경
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <div
      className={cn(
        'transition-all',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        transform: isVisible ? 'scale(1)' : `scale(${startScale})`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};

interface PageTransitionProps {
  children: React.ReactNode;
  location: string;
  mode?: 'fade' | 'slide' | 'scale';
  duration?: number;
  className?: string;
}

/**
 * 페이지 전환 애니메이션 컴포넌트
 * 
 * 페이지 간 전환 시 부드러운 애니메이션 효과를 적용합니다.
 * 페이지 식별자(location)를 통해 변경 시점을 감지합니다.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  location,
  mode = 'fade',
  duration = 300,
  className,
}) => {
  const [currentLocation, setCurrentLocation] = useState(location);
  const [nextLocation, setNextLocation] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [content, setContent] = useState(children);
  
  // prefers-reduced-motion 감지
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // 모션 감소 설정 감지
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  useEffect(() => {
    // 위치가 변경된 경우
    if (location !== currentLocation) {
      if (prefersReducedMotion) {
        // 모션 감소 설정 시 즉시 변경
        setContent(children);
        setCurrentLocation(location);
      } else {
        // 트랜지션 시작
        setIsTransitioning(true);
        setNextLocation(location);
      }
    }
  }, [location, currentLocation, children, prefersReducedMotion]);
  
  // 트랜지션 종료 핸들러
  const handleExited = () => {
    if (nextLocation) {
      // 콘텐츠 업데이트 및 진입 트랜지션 시작
      setContent(children);
      setCurrentLocation(nextLocation);
      setNextLocation(null);
      
      // 다음 프레임에서 트랜지션 재활성화
      requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
    }
  };
  
  // 모션 감소 설정 시 트랜지션 없이 즉시 렌더링
  if (prefersReducedMotion) {
    return <div className={className}>{content}</div>;
  }
  
  // 애니메이션 모드에 따른 컴포넌트 렌더링
  if (mode === 'fade') {
    return (
      <Fade
        show={!isTransitioning}
        duration={duration}
        className={className}
        onExited={handleExited}
      >
        {content}
      </Fade>
    );
  } else if (mode === 'slide') {
    return (
      <Slide
        show={!isTransitioning}
        duration={duration}
        className={className}
        onExited={handleExited}
      >
        {content}
      </Slide>
    );
  } else {
    return (
      <Scale
        show={!isTransitioning}
        duration={duration}
        className={className}
        onExited={handleExited}
      >
        {content}
      </Scale>
    );
  }
};