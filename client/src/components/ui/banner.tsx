import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BannerProps {
  /** 배너 이미지 URL */
  imageUrl: string;
  /** 배너 제목 (H1 태그로 표시됨) */
  title?: string;
  /** 배너 부제목 또는 설명 */
  description?: string;
  /** 이미지 대체 텍스트 - 반드시 명확하고 설명적인 텍스트를 제공해야 함 */
  altText: string;
  /** 배너 높이 (기본값: h-64 md:h-72) */
  height?: string;
  /** 배너 내부에 렌더링할 추가 컴포넌트 (검색창, 버튼 등) */
  children?: ReactNode;
  /** 배너 이미지 오버레이 색상 및 투명도 (기본값: bg-black/20 dark:bg-black/40) */
  overlay?: string;
  /** 배너 추가 스타일 */
  className?: string;
  /** 배너 텍스트 컨테이너 스타일 */
  contentClassName?: string;
  /** 배너 역할 설명 (스크린 리더를 위한 ARIA 레이블) */
  ariaLabel?: string;
  /** 이미지 로딩 우선순위 */
  priority?: boolean;
}

/**
 * 접근성이 향상된 배너 컴포넌트
 * 
 * 페이지 상단 및 섹션 배너로 사용할 수 있는 재사용 가능한 컴포넌트입니다.
 * 이미지, 텍스트 오버레이, 그리고 추가 내용을 포함합니다.
 * 스크린 리더 및 키보드 접근성을 고려하여 설계되었습니다.
 */
export function Banner({
  imageUrl,
  title,
  description,
  altText,
  height = "h-64 md:h-72",
  children,
  overlay = "bg-black/20 dark:bg-black/40",
  className,
  contentClassName,
  ariaLabel = "페이지 배너",
  priority = false,
}: BannerProps) {
  return (
    <div className="mb-8">
      <div 
        className={cn(
          `relative ${height} rounded-lg overflow-hidden`, 
          className
        )}
        role="banner"
        aria-label={ariaLabel}
      >
        <img 
          src={imageUrl}
          alt={altText}
          className="absolute inset-0 w-full h-full object-cover"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
        <div className={cn("absolute inset-0", overlay)}></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className={cn("p-6 md:p-8", contentClassName)}>
            {title && (
              <h1 className="text-3xl font-bold mb-2 text-white dark:text-white bg-primary/80 dark:bg-primary/80 p-2 rounded inline-block">{title}</h1>
            )}
            
            {description && (
              <p className="text-white dark:text-white mb-4 bg-black/30 dark:bg-black/50 p-2 rounded max-w-lg">
                {description}
              </p>
            )}
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}