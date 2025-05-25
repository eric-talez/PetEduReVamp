import React, { useRef, useState, useEffect } from 'react';

interface GestureHandlerProps {
  children: React.ReactNode;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  onTap?: (point: { x: number; y: number }) => void;
  onDoubleTap?: (point: { x: number; y: number }) => void;
  onLongPress?: (point: { x: number; y: number }) => void;
  onPinch?: (scale: number, center: { x: number; y: number }) => void;
  onRotate?: (angle: number, center: { x: number; y: number }) => void;
  swipeThreshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 모바일 터치 제스처 핸들러 컴포넌트
 * 
 * 스와이프, 탭, 더블탭, 롱프레스, 핀치, 회전 등의 터치 제스처를 감지하고 처리합니다.
 * 모바일 환경에서 자연스러운 상호작용을 제공합니다.
 */
export const GestureHandler: React.FC<GestureHandlerProps> = ({
  children,
  onSwipe,
  onTap,
  onDoubleTap,
  onLongPress,
  onPinch,
  onRotate,
  swipeThreshold = 50,
  longPressDelay = 500,
  doubleTapDelay = 300,
  className,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 터치 관련 상태
  const [isTouching, setIsTouching] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchPointsRef = useRef<Array<{ x: number; y: number; id: number }>>([]);
  
  // 터치 시작 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // 불필요한 브라우저 동작 방지
    
    setIsTouching(true);
    
    // 첫 번째 터치 포인트 추적
    const touch = e.touches[0];
    const touchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    touchStartRef.current = touchPoint;
    
    // 모든 터치 포인트 추적 (핀치/회전용)
    const newTouchPoints = Array.from(e.touches).map(t => ({
      x: t.clientX,
      y: t.clientY,
      id: t.identifier
    }));
    touchPointsRef.current = newTouchPoints;
    
    // 롱프레스 타이머 설정
    if (onLongPress) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      
      longPressTimerRef.current = setTimeout(() => {
        if (isTouching && touchStartRef.current) {
          onLongPress({
            x: touchStartRef.current.x,
            y: touchStartRef.current.y
          });
        }
      }, longPressDelay);
    }
  };
  
  // 터치 이동 핸들러
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouching || !touchStartRef.current) return;
    
    // 첫 번째 터치 포인트
    const touch = e.touches[0];
    const currentPoint = {
      x: touch.clientX,
      y: touch.clientY
    };
    
    // 이동 거리 계산
    const deltaX = currentPoint.x - touchStartRef.current.x;
    const deltaY = currentPoint.y - touchStartRef.current.y;
    
    // 롱프레스 취소 (일정 거리 이상 이동 시)
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
    
    // 핀치 제스처 처리
    if (onPinch && e.touches.length >= 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      // 현재 두 손가락 사이 거리
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      // 이전 두 손가락 사이 거리
      const previousPoints = touchPointsRef.current;
      if (previousPoints.length >= 2) {
        const point1 = previousPoints[0];
        const point2 = previousPoints[1];
        const previousDistance = Math.hypot(
          point2.x - point1.x,
          point2.y - point1.y
        );
        
        // 중심점 계산
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        
        // 스케일 변화량 계산
        const scale = currentDistance / previousDistance;
        
        onPinch(scale, { x: centerX, y: centerY });
      }
      
      // 회전 제스처 처리
      if (onRotate && previousPoints.length >= 2) {
        const point1 = previousPoints[0];
        const point2 = previousPoints[1];
        
        // 이전 각도
        const previousAngle = Math.atan2(
          point2.y - point1.y,
          point2.x - point1.x
        );
        
        // 현재 각도
        const currentAngle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        );
        
        // 중심점 계산
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        
        // 각도 변화량 계산 (라디안)
        const angleChange = currentAngle - previousAngle;
        
        onRotate(angleChange * (180 / Math.PI), { x: centerX, y: centerY });
      }
    }
    
    // 터치 포인트 업데이트
    const newTouchPoints = Array.from(e.touches).map(t => ({
      x: t.clientX,
      y: t.clientY,
      id: t.identifier
    }));
    touchPointsRef.current = newTouchPoints;
  };
  
  // 터치 종료 핸들러
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    // 롱프레스 타이머 취소
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    const touchEnd = {
      x: touchStartRef.current.x,
      y: touchStartRef.current.y,
      time: Date.now()
    };
    
    // 터치 종료 시간
    const touchDuration = touchEnd.time - touchStartRef.current.time;
    
    // 이동 거리 계산
    const deltaX = touchEnd.x - touchStartRef.current.x;
    const deltaY = touchEnd.y - touchStartRef.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // 스와이프 제스처 처리
    if (onSwipe && distance > swipeThreshold) {
      // 가장 큰 변화량을 기준으로 스와이프 방향 결정
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        onSwipe(deltaX > 0 ? 'right' : 'left');
      } else {
        onSwipe(deltaY > 0 ? 'down' : 'up');
      }
    }
    // 탭 제스처 처리
    else if (distance < 10 && touchDuration < 300) {
      const currentTime = Date.now();
      
      // 더블탭 감지
      if (
        onDoubleTap &&
        lastTapRef.current &&
        currentTime - lastTapRef.current.time < doubleTapDelay
      ) {
        onDoubleTap({ x: touchEnd.x, y: touchEnd.y });
        lastTapRef.current = null; // 더블탭 후 상태 초기화
      } 
      // 싱글탭 처리
      else {
        if (onTap) {
          onTap({ x: touchEnd.x, y: touchEnd.y });
        }
        
        // 마지막 탭 기록 업데이트
        lastTapRef.current = {
          x: touchEnd.x,
          y: touchEnd.y,
          time: currentTime
        };
      }
    }
    
    // 상태 초기화
    setIsTouching(false);
    touchStartRef.current = null;
    touchPointsRef.current = [];
  };
  
  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);
  
  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        touchAction: 'none', // 브라우저 기본 터치 액션 비활성화
        ...style
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        // 터치 취소 시 상태 초기화
        setIsTouching(false);
        touchStartRef.current = null;
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
      }}
    >
      {children}
    </div>
  );
};

interface SwipeCarouselProps {
  children: React.ReactNode[];
  initialIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
  slideClassName?: string;
  indicators?: boolean;
  controls?: boolean;
  autoPlay?: boolean;
  interval?: number;
  loop?: boolean;
}

/**
 * 스와이프 캐러셀 컴포넌트
 * 
 * 터치 스와이프 제스처로 작동하는 이미지/콘텐츠 슬라이더입니다.
 * 모바일 환경에 최적화된 UI/UX를 제공합니다.
 */
export const SwipeCarousel: React.FC<SwipeCarouselProps> = ({
  children,
  initialIndex = 0,
  onChange,
  className,
  slideClassName,
  indicators = true,
  controls = true,
  autoPlay = false,
  interval = 5000,
  loop = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 슬라이드 변경 함수
  const goToSlide = (index: number) => {
    // 애니메이션 중이면 무시
    if (isAnimating) return;
    
    let newIndex = index;
    
    // 루프 옵션에 따른 인덱스 조정
    if (loop) {
      if (index < 0) {
        newIndex = children.length - 1;
      } else if (index >= children.length) {
        newIndex = 0;
      }
    } else {
      // 루프가 아닌 경우 범위 제한
      newIndex = Math.max(0, Math.min(index, children.length - 1));
    }
    
    // 변경이 있을 때만 처리
    if (newIndex !== currentIndex) {
      setIsAnimating(true);
      setCurrentIndex(newIndex);
      onChange?.(newIndex);
      
      // 애니메이션 완료 후 상태 업데이트
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  };
  
  // 다음/이전 슬라이드 이동
  const goToNext = () => goToSlide(currentIndex + 1);
  const goToPrev = () => goToSlide(currentIndex - 1);
  
  // 스와이프 핸들러
  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (direction === 'left') {
      goToNext();
    } else if (direction === 'right') {
      goToPrev();
    }
  };
  
  // 자동 재생 설정
  useEffect(() => {
    if (autoPlay) {
      autoPlayTimerRef.current = setInterval(goToNext, interval);
    }
    
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [autoPlay, interval, currentIndex]);
  
  return (
    <div className={`relative overflow-hidden ${className || ''}`}>
      <GestureHandler onSwipe={handleSwipe} className="w-full h-full">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${children.length * 100}%`,
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-full ${slideClassName || ''}`}
              style={{ width: `${100 / children.length}%` }}
            >
              {child}
            </div>
          ))}
        </div>
      </GestureHandler>
      
      {/* 인디케이터 */}
      {indicators && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {children.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-4'
                  : 'bg-white/60'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>
      )}
      
      {/* 컨트롤 버튼 */}
      {controls && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white"
            onClick={goToPrev}
            disabled={!loop && currentIndex === 0}
            aria-label="이전 슬라이드"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white"
            onClick={goToNext}
            disabled={!loop && currentIndex === children.length - 1}
            aria-label="다음 슬라이드"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};