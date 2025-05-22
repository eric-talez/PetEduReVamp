import React, { useEffect, useState } from 'react';
import { LazyImage } from './LazyImage';

interface OptimizedContentProps {
  children: React.ReactNode;
  priority?: boolean;
  delay?: number;
}

/**
 * 컨텐츠를 최적화하여 로드하는 컴포넌트
 * priority가 false인 경우 화면에 보일 때만 렌더링
 */
export function OptimizedContent({ 
  children, 
  priority = false,
  delay = 0 
}: OptimizedContentProps) {
  const [shouldRender, setShouldRender] = useState(priority);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (priority) return;

    // 화면에 보일 때만 렌더링하는 로직
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 지정된 딜레이 후 렌더링
          if (delay > 0) {
            setTimeout(() => setShouldRender(true), delay);
          } else {
            setShouldRender(true);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef) {
      observer.observe(containerRef);
    }

    return () => observer.disconnect();
  }, [containerRef, priority, delay]);

  return (
    <div ref={setContainerRef} className="min-h-[10px]">
      {shouldRender ? children : null}
    </div>
  );
}

/**
 * 최적화된 이미지 갤러리 컴포넌트
 */
export function OptimizedGallery({
  images,
  className = '',
}: {
  images: Array<{ src: string; alt: string }>;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {images.map((image, index) => (
        <OptimizedContent key={index} priority={index < 3}>
          <GalleryImage src={image.src} alt={image.alt} />
        </OptimizedContent>
      ))}
    </div>
  );
}

/**
 * 갤러리 이미지 컴포넌트
 */
function GalleryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
      <LazyImage
        src={src}
        alt={alt}
        className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
      />
    </div>
  );
}

/**
 * 최적화된 콘텐츠 그룹 컴포넌트
 * 중요도에 따라 콘텐츠를 그룹화하여 렌더링
 */
export function OptimizedContentGroup({
  highPriority,
  mediumPriority,
  lowPriority,
}: {
  highPriority: React.ReactNode;
  mediumPriority?: React.ReactNode;
  lowPriority?: React.ReactNode;
}) {
  return (
    <>
      {/* 높은 우선순위 - 즉시 렌더링 */}
      <OptimizedContent priority>{highPriority}</OptimizedContent>
      
      {/* 중간 우선순위 - 약간의 지연 후 렌더링 */}
      {mediumPriority && (
        <OptimizedContent delay={100}>{mediumPriority}</OptimizedContent>
      )}
      
      {/* 낮은 우선순위 - 화면에 보일 때만 렌더링 */}
      {lowPriority && <OptimizedContent>{lowPriority}</OptimizedContent>}
    </>
  );
}