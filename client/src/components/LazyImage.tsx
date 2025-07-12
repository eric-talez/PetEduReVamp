import React, { useState, useEffect, useRef } from 'react';
import { ImageOptimizer } from '../utils/performance-optimizer';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * 지연 로딩 이미지 컴포넌트
 * 뷰포트에 이미지가 들어올 때만 실제 이미지를 로드합니다.
 */
export function LazyImage({
  src,
  alt,
  placeholderSrc = '',
  threshold = 0.1,
  className = '',
  style,
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer를 사용하여 이미지가 뷰포트에 들어왔는지 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  // 이미지 로드 완료 핸들러
  const handleImageLoaded = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // 이미지 로드 실패 핸들러
  const handleImageError = () => {
    if (onError) onError();
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* 로딩 중 표시 (스켈레톤 또는 플레이스홀더 이미지) */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* 실제 이미지 - 뷰포트에 들어오면 로드 */}
      <img
        ref={imgRef}
        src={isInView ? src : placeholderSrc}
        alt={alt}
        className={`w-full h-full transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleImageLoaded}
        onError={handleImageError}
        loading="lazy"
        {...props}
      />
    </div>
  );
}

/**
 * 갤러리에 최적화된 지연 로딩 이미지 컴포넌트
 * 블러 효과를 사용하여 부드러운 로딩 경험 제공
 */
export function GalleryLazyImage({
  src,
  alt,
  className = '',
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [optimizedSrc, setOptimizedSrc] = useState(src); // Initialize with original src

  // 저해상도 썸네일 URL 생성 (실제로는 백엔드에서 제공하는 것이 좋음)
  const thumbnailSrc = src.replace(/\.(jpg|jpeg|png|webp)/, '-thumb.$1');

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 이미지 최적화 적용
          ImageOptimizer.getOptimalImageFormat(src)
            .then(optimizedSrc => {
              setOptimizedSrc(optimizedSrc);
              setIsInView(true);
            })
            .catch(() => {
              setOptimizedSrc(src);
              setIsInView(true);
            });
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 썸네일 이미지 (블러 처리) */}
      {!isLoaded && (
        <img
          src={thumbnailSrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover filter blur-lg transform scale-105"
          aria-hidden="true"
        />
      )}

      {/* 고해상도 이미지 */}
      <img
        ref={imgRef}
        src={isInView ? optimizedSrc : ''} // Use optimizedSrc here
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        {...props}
      />
    </div>
  );
}