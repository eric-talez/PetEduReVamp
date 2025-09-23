import React, { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BannerProps {
  /** 배너 ID (동적 배너용) */
  id?: number;
  /** 배너 이미지 URL */
  imageUrl: string;
  /** 배너 제목 (H1 태그로 표시됨) */
  title?: string;
  /** 배너 부제목 또는 설명 */
  description?: string;
  /** 배너 내용 (description보다 우선) */
  content?: string;
  /** 이미지 대체 텍스트 - 반드시 명확하고 설명적인 텍스트를 제공해야 함 */
  altText?: string;
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
  /** 액션 버튼 텍스트 */
  actionText?: string;
  /** 액션 버튼 URL */
  actionUrl?: string;
  /** 배너 위치 타입 */
  position?: string;
  /** 배너 타입 */
  type?: string;
  /** 닫기 버튼 표시 여부 */
  closable?: boolean;
  /** 배너 닫기 콜백 */
  onClose?: (bannerId?: number) => void;
  /** 배너 클릭 콜백 (통계용) */
  onClick?: (bannerId?: number) => void;
}

/**
 * 접근성이 향상된 배너 컴포넌트
 * 
 * 페이지 상단 및 섹션 배너로 사용할 수 있는 재사용 가능한 컴포넌트입니다.
 * 이미지, 텍스트 오버레이, 그리고 추가 내용을 포함합니다.
 * 스크린 리더 및 키보드 접근성을 고려하여 설계되었습니다.
 * 동적 배너 시스템을 지원하며 닫기 기능과 액션 버튼을 포함합니다.
 */
export function Banner({
  id,
  imageUrl,
  title,
  description,
  content,
  altText,
  height = "h-64 md:h-72",
  children,
  overlay = "bg-black/20 dark:bg-black/40",
  className,
  contentClassName,
  ariaLabel = "페이지 배너",
  priority = false,
  actionText,
  actionUrl,
  position,
  type,
  closable = false,
  onClose,
  onClick,
}: BannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.(id);
  };

  const handleBannerClick = () => {
    onClick?.(id);
  };

  const handleActionClick = () => {
    if (actionUrl) {
      if (actionUrl.startsWith('http') || actionUrl.startsWith('/')) {
        window.open(actionUrl, '_blank');
      } else {
        // 내부 라우팅의 경우
        window.location.href = actionUrl;
      }
    }
    onClick?.(id);
  };

  if (!isVisible) {
    return null;
  }

  const displayContent = content || description;
  const displayAltText = altText || title || '배너 이미지';

  return (
    <div className="mb-8">
      <div 
        className={cn(
          `relative ${height} rounded-lg overflow-hidden cursor-pointer`, 
          className
        )}
        role="banner"
        aria-label={ariaLabel}
        onClick={handleBannerClick}
        data-testid={`banner-${id || 'default'}`}
      >
        <img 
          src={imageUrl}
          alt={displayAltText}
          className="absolute inset-0 w-full h-full object-cover"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
        <div className={cn("absolute inset-0", overlay)}></div>
        
        {/* 닫기 버튼 */}
        {closable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="absolute top-4 right-4 z-10 p-1 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            aria-label="배너 닫기"
            data-testid={`button-close-banner-${id || 'default'}`}
          >
            <X size={20} />
          </button>
        )}
        
        <div className="absolute inset-0 flex items-center">
          <div className={cn("p-6 md:p-8 w-full", contentClassName)}>
            {title && (
              <h1 className="text-3xl font-bold mb-2 text-white dark:text-white bg-primary/80 dark:bg-primary/80 p-2 rounded inline-block">
                {title}
              </h1>
            )}
            
            {displayContent && (
              <p className="text-white dark:text-white mb-4 bg-black/30 dark:bg-black/50 p-2 rounded max-w-lg">
                {displayContent}
              </p>
            )}
            
            {/* 액션 버튼 */}
            {actionText && actionUrl && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick();
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                data-testid={`button-action-banner-${id || 'default'}`}
              >
                {actionText}
              </Button>
            )}
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}