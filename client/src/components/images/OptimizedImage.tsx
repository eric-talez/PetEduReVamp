import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * 최적화된 이미지 컴포넌트
 * - 이미지 로딩 상태 관리
 * - 로딩 중 스켈레톤 UI 표시
 * - 오류 발생 시 대체 UI 표시
 * - 지연 로딩 지원 (intersection observer 사용)
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [imgRef, setImgRef] = useState<HTMLDivElement | null>(null);

  // 이미지 로드 핸들러
  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // 이미지 오류 핸들러
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Intersection Observer를 사용하여 이미지가 화면에 들어올 때만 로드
  useEffect(() => {
    if (priority || !imgRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // 이미지가 화면 진입 200px 전에 로드 시작
    );

    observer.observe(imgRef);
    return () => observer.disconnect();
  }, [imgRef, priority]);

  // 스타일 정의
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
  };

  return (
    <div 
      ref={setImgRef} 
      style={containerStyle}
      className={`relative overflow-hidden ${isLoading ? 'bg-muted/10' : ''} ${className}`}
      aria-busy={isLoading}
    >
      {isLoading && (
        <Skeleton 
          className="absolute inset-0 z-10" 
          style={{ width: '100%', height: '100%' }} 
        />
      )}
      
      {(shouldLoad || priority) && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20 text-muted-foreground">
          <span className="text-sm">이미지를 불러올 수 없습니다</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;