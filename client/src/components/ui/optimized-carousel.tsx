import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useMemoizedCallback } from '@/hooks/use-memoized-callback';

interface OptimizedCarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
  slideClassName?: string;
  infiniteLoop?: boolean;
  carouselId?: string;
}

/**
 * 성능이 최적화된 캐러셀 컴포넌트
 * 
 * 특징:
 * - 메모이제이션을 통한 성능 최적화
 * - 자동 재생 및 일시 정지 기능
 * - 키보드 접근성 지원
 * - 스크린 리더 호환성
 * - 무한 루프 옵션
 * - 커스텀 스타일링 지원
 */
export function OptimizedCarousel({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
  className = '',
  slideClassName = '',
  infiniteLoop = true,
  carouselId = 'carousel',
}: OptimizedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const slides = React.Children.toArray(children);
  
  // 다음 슬라이드로 이동
  const goToNextSlide = useMemoizedCallback(() => {
    if (infiniteLoop || activeIndex < slides.length - 1) {
      setActiveIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }
  }, [activeIndex, slides.length, infiniteLoop]);

  // 이전 슬라이드로 이동
  const goToPrevSlide = useMemoizedCallback(() => {
    if (infiniteLoop || activeIndex > 0) {
      setActiveIndex((prevIndex) => 
        prevIndex === 0 ? slides.length - 1 : prevIndex - 1
      );
    }
  }, [activeIndex, slides.length, infiniteLoop]);

  // 특정 슬라이드로 이동
  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // 오른쪽으로 스와이프: 이전 슬라이드
    if (diff < -50) {
      goToPrevSlide();
      setTouchStart(null);
    }
    // 왼쪽으로 스와이프: 다음 슬라이드
    else if (diff > 50) {
      goToNextSlide();
      setTouchStart(null);
    }
  }, [touchStart, goToNextSlide, goToPrevSlide]);

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
  }, []);

  // 자동 재생 설정
  useEffect(() => {
    // 자동 재생이 활성화된 경우
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        goToNextSlide();
      }, autoPlayInterval);
    }
    
    // 클린업 함수
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, autoPlayInterval, goToNextSlide]);

  // 키보드 탐색 지원
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 다른 요소가 포커스된 경우 무시
      if (document.activeElement !== document.getElementById(carouselId)) {
        return;
      }
      
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevSlide();
          break;
        case 'ArrowRight':
          goToNextSlide();
          break;
        case 'Home':
          goToSlide(0);
          break;
        case 'End':
          goToSlide(slides.length - 1);
          break;
        case ' ':
          setIsPlaying(prev => !prev);
          break;
        default:
          return;
      }
      e.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNextSlide, goToPrevSlide, goToSlide, slides.length, carouselId]);

  // 컴포넌트에 마우스가 오버되면 자동 재생 일시 중지
  const handleMouseEnter = useCallback(() => {
    if (autoPlay && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [autoPlay]);

  // 마우스가 벗어나면 자동 재생 재개
  const handleMouseLeave = useCallback(() => {
    if (autoPlay && isPlaying && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        goToNextSlide();
      }, autoPlayInterval);
    }
  }, [autoPlay, isPlaying, autoPlayInterval, goToNextSlide]);

  return (
    <div 
      id={carouselId}
      className={cn(
        'relative w-full overflow-hidden', 
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${slides.length}개의 슬라이드가 있는 캐러셀`}
      tabIndex={0}
    >
      {/* 슬라이드 컨테이너 */}
      <div 
        className="flex transition-transform duration-300 ease-in-out" 
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={cn(
              'min-w-full flex-shrink-0', 
              slideClassName
            )}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1}/${slides.length}`}
            aria-hidden={activeIndex !== index}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* 이전/다음 버튼 */}
      {showControls && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 rounded-full p-2"
            onClick={goToPrevSlide}
            aria-label="이전 슬라이드"
            disabled={!infiniteLoop && activeIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 rounded-full p-2"
            onClick={goToNextSlide}
            aria-label="다음 슬라이드"
            disabled={!infiniteLoop && activeIndex === slides.length - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* 인디케이터 */}
      {showIndicators && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all',
                activeIndex === index 
                  ? 'bg-primary scale-125' 
                  : 'bg-primary/30 hover:bg-primary/50'
              )}
              onClick={() => goToSlide(index)}
              aria-label={`${index + 1}번 슬라이드로 이동`}
              aria-current={activeIndex === index}
            />
          ))}
        </div>
      )}

      {/* 자동 재생 상태 (스크린 리더용) */}
      <div className="sr-only" aria-live="polite">
        {isPlaying 
          ? '캐러셀이 자동으로 재생 중입니다.' 
          : '캐러셀이 일시 정지되었습니다.'}
      </div>
    </div>
  );
}