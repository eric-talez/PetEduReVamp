import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ImageOptimizer, ImageCacheManager } from '../utils/image-optimizer';

interface AdvancedLazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  lowQualitySrc?: string;
  threshold?: number;
  sizes?: string;
  srcSet?: string;
  priority?: boolean;
  blur?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  enableCache?: boolean;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
}

/**
 * 고급 지연 로딩 이미지 컴포넌트
 * - 프로그레시브 로딩 (저화질 → 고화질)
 * - 자동 포맷 최적화 (AVIF → WebP → JPEG)
 * - 캐싱 지원
 * - 반응형 이미지 지원
 */
export function AdvancedLazyImage({
  src,
  alt,
  placeholderSrc,
  lowQualitySrc,
  threshold = 0.1,
  sizes,
  srcSet,
  priority = false,
  blur = true,
  className = '',
  style,
  onLoad,
  onError,
  enableCache = true,
  quality = 85,
  format = 'auto',
  ...props
}: AdvancedLazyImageProps) {
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [optimizedSrc, setOptimizedSrc] = useState<string>(src);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 저화질 이미지 URL 생성
  const generateLowQualitySrc = useCallback((originalSrc: string): string => {
    if (lowQualitySrc) return lowQualitySrc;
    
    // URL에 저화질 파라미터 추가
    const url = new URL(originalSrc, window.location.origin);
    url.searchParams.set('q', '20'); // 20% 품질
    url.searchParams.set('w', '40'); // 40px 너비 (블러용)
    return url.toString();
  }, [lowQualitySrc]);

  // 이미지 최적화 처리
  const optimizeImage = useCallback(async (originalSrc: string): Promise<string> => {
    if (format === 'auto') {
      return await ImageOptimizer.getOptimalImageFormat(originalSrc);
    }
    
    const extension = format === 'jpeg' ? 'jpg' : format;
    return originalSrc.replace(/\.[^/.]+$/, `.${extension}`);
  }, [format]);

  // 캐시에서 이미지 로드
  const loadFromCache = useCallback(async (src: string): Promise<string | null> => {
    if (!enableCache) return null;
    
    try {
      const cachedBlob = await ImageCacheManager.getCachedImage(src);
      if (cachedBlob) {
        return URL.createObjectURL(cachedBlob);
      }
    } catch (error) {
      console.warn('Cache loading failed:', error);
    }
    return null;
  }, [enableCache]);

  // 이미지를 캐시에 저장
  const saveToCache = useCallback(async (src: string, imageSrc: string): Promise<void> => {
    if (!enableCache) return;
    
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      await ImageCacheManager.cacheImage(src, blob);
    } catch (error) {
      console.warn('Cache saving failed:', error);
    }
  }, [enableCache]);

  // 프로그레시브 이미지 로딩
  const loadProgressiveImage = useCallback(async (): Promise<void> => {
    if (loadingState !== 'idle') return;
    
    setLoadingState('loading');
    
    try {
      // 1단계: 캐시에서 확인
      const cachedSrc = await loadFromCache(src);
      if (cachedSrc) {
        setCurrentSrc(cachedSrc);
        setLoadingState('loaded');
        onLoad?.();
        return;
      }

      // 2단계: 저화질 이미지 먼저 로딩
      if (blur) {
        const lowQualitySrc = generateLowQualitySrc(src);
        await ImageOptimizer.preloadImage(lowQualitySrc);
        setCurrentSrc(lowQualitySrc);
      }

      // 3단계: 최적화된 고화질 이미지 로딩
      const optimized = await optimizeImage(src);
      setOptimizedSrc(optimized);
      
      await ImageOptimizer.preloadImage(optimized);
      setCurrentSrc(optimized);
      setLoadingState('loaded');
      
      // 4단계: 캐시에 저장
      await saveToCache(src, optimized);
      
      onLoad?.();
    } catch (error) {
      console.error('Progressive image loading failed:', error);
      setLoadingState('error');
      setCurrentSrc(src); // 폴백
      onError?.();
    }
  }, [src, loadingState, blur, generateLowQualitySrc, optimizeImage, loadFromCache, saveToCache, onLoad, onError]);

  // Intersection Observer 설정
  useEffect(() => {
    if (!imgRef.current) return;
    
    // 우선순위가 높은 이미지는 즉시 로딩
    if (priority) {
      loadProgressiveImage();
      return;
    }
    
    // 일반 이미지는 뷰포트 진입 시 로딩
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadProgressiveImage();
          observerRef.current?.disconnect();
        }
      },
      { 
        threshold,
        rootMargin: '50px' // 50px 여유로 미리 로딩
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, threshold, loadProgressiveImage]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (currentSrc.startsWith('blob:')) {
        URL.revokeObjectURL(currentSrc);
      }
    };
  }, [currentSrc]);

  const isLoading = loadingState === 'loading' || loadingState === 'idle';
  const hasError = loadingState === 'error';
  const isLoaded = loadingState === 'loaded';

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* 로딩 스켈레톤 */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite linear',
          }}
          aria-hidden="true"
        />
      )}

      {/* 플레이스홀더 이미지 */}
      {placeholderSrc && isLoading && (
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          aria-hidden="true"
        />
      )}

      {/* 메인 이미지 */}
      <img
        ref={imgRef}
        src={currentSrc || (isLoaded ? optimizedSrc : '')}
        alt={alt}
        sizes={sizes}
        srcSet={srcSet}
        className={`
          w-full h-full object-cover transition-all duration-500
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${isLoading && blur && currentSrc ? 'filter blur-sm' : ''}
          ${isLoaded && !currentSrc.includes('q=20') ? 'filter blur-none' : ''}
        `}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...props}
      />

      {/* 에러 상태 */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg 
              className="w-12 h-12 mx-auto mb-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-sm">이미지를 로드할 수 없습니다</p>
          </div>
        </div>
      )}

      {/* 커스텀 CSS 애니메이션 */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * 간단한 사용을 위한 래퍼 컴포넌트
 */
export function OptimizedImage(props: Omit<AdvancedLazyImageProps, 'enableCache' | 'quality' | 'format'>) {
  return (
    <AdvancedLazyImage
      enableCache={true}
      quality={85}
      format="auto"
      blur={true}
      {...props}
    />
  );
}

/**
 * 갤러리용 최적화된 이미지 컴포넌트
 */
export function GalleryOptimizedImage(props: Omit<AdvancedLazyImageProps, 'blur' | 'priority'>) {
  return (
    <AdvancedLazyImage
      blur={true}
      priority={false}
      quality={90}
      format="auto"
      {...props}
    />
  );
}

/**
 * 히어로 섹션용 우선순위 이미지 컴포넌트
 */
export function HeroImage(props: Omit<AdvancedLazyImageProps, 'priority' | 'threshold'>) {
  return (
    <AdvancedLazyImage
      priority={true}
      threshold={0}
      quality={95}
      format="auto"
      {...props}
    />
  );
}