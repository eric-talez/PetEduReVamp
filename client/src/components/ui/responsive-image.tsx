import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  lazyLoad?: boolean;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
}

/**
 * 성능 최적화된 반응형 이미지 컴포넌트
 * 
 * 기능:
 * - 지연 로딩 (화면에 보일 때만 로드)
 * - 에러 대응 (대체 이미지 지원)
 * - 최적화된 렌더링 (블러 효과로 부드러운 로딩)
 * - 접근성 개선 (alt 텍스트 필수)
 * 
 * @param props 이미지 속성 및 추가 기능 옵션
 */
export function ResponsiveImage({
  src,
  alt,
  fallbackSrc = '',
  lazyLoad = true,
  className,
  containerClassName,
  aspectRatio = '16/9',
  loading: _loading,
  ...props
}: ResponsiveImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(lazyLoad ? '' : src);
  const [isLoaded, setIsLoaded] = useState<boolean>(!lazyLoad);
  const [error, setError] = useState<boolean>(false);
  
  // IntersectionObserver를 사용한 지연 로딩 설정
  const [ref, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '200px',
    freezeOnceVisible: true,
  });

  // 이미지가 화면에 보일 때 로드 시작
  useEffect(() => {
    if (isIntersecting && lazyLoad && !imageSrc) {
      setImageSrc(src);
    }
  }, [isIntersecting, lazyLoad, imageSrc, src]);

  // 이미지 로드 핸들러
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // 이미지 에러 핸들러
  const handleError = () => {
    setError(true);
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <div 
      ref={ref}
      className={cn(
        'relative overflow-hidden',
        containerClassName
      )}
      style={{ aspectRatio }}
    >
      {/* 로딩 플레이스홀더 */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      {/* 실제 이미지 */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          loading={lazyLoad ? 'lazy' : 'eager'}
          {...props}
          // 접근성 속성 추가
          role={alt ? undefined : 'presentation'} // 장식적 이미지인 경우에만 presentation 역할 부여
        />
      )}
      
      {/* 에러 상태 표시 */}
      {error && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <span className="text-sm text-muted-foreground">이미지를 불러올 수 없습니다</span>
        </div>
      )}
    </div>
  );
}