import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { hasProperAltText } from '@/utils/accessibility/a11y-utils';

interface A11yImageProps {
  /** 이미지 URL */
  src: string;
  /** 대체 텍스트 (alt text) */
  alt: string;
  /** 이미지 너비 */
  width?: number | string;
  /** 이미지 높이 */
  height?: number | string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 스켈레톤 로딩 표시 여부 */
  showSkeleton?: boolean;
  /** 에러 발생 시 표시할 대체 텍스트 */
  fallbackText?: string;
  /** 우선 로딩 여부 */
  priority?: boolean;
  /** 로딩 완료 시 콜백 */
  onLoad?: () => void;
  /** 로딩 실패 시 콜백 */
  onError?: () => void;
  /** 장식용 이미지 여부 (장식용인 경우 alt=""로 설정) */
  decorative?: boolean;
  /** 긴 설명이 필요한 경우, aria-describedby에 연결할 설명 요소의 ID */
  longDescriptionId?: string;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

/**
 * 접근성을 강화한 이미지 컴포넌트
 * 
 * 스크린 리더 사용자를 위한 적절한 대체 텍스트와 ARIA 속성을 제공하고,
 * 이미지 로딩 상태를 처리하며, 로딩 실패 시 폴백을 제공합니다.
 */
const A11yImage: React.FC<A11yImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  showSkeleton = true,
  fallbackText = '이미지를 불러올 수 없습니다',
  priority = false,
  onLoad,
  onError,
  decorative = false,
  longDescriptionId,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // 개발 환경에서 적절한 alt 텍스트가 제공되었는지 확인
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !decorative) {
      const dummyImg = new Image();
      dummyImg.src = src;
      dummyImg.alt = alt;
      
      if (!hasProperAltText(dummyImg)) {
        console.warn(
          `Accessibility warning: Image with src "${src}" has missing or inadequate alt text. ` +
          `Current alt: "${alt}". Provide a descriptive alt text for screen reader users.`
        );
      }
    }
  }, [src, alt, decorative]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // 이미지 스타일 설정
  const imageStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  // 접근성 속성 설정
  const accessibilityProps: Record<string, any> = {};
  
  if (decorative) {
    // 장식용 이미지는 스크린 리더가 무시하도록 빈 alt 제공
    accessibilityProps.alt = '';
    accessibilityProps.role = 'presentation';
    accessibilityProps['aria-hidden'] = true;
  } else {
    // 의미 있는 이미지는 적절한 alt 제공
    accessibilityProps.alt = alt;
    
    // 긴 설명이 필요한 경우, aria-describedby 설정
    if (longDescriptionId) {
      accessibilityProps['aria-describedby'] = longDescriptionId;
    }
  }

  return (
    <div 
      className={`relative ${className}`}
      style={imageStyle}
    >
      {/* 로딩 중 스켈레톤 표시 */}
      {isLoading && showSkeleton && (
        <Skeleton 
          className="absolute inset-0 z-10 w-full h-full" 
        />
      )}
      
      {/* 이미지 */}
      <img
        src={src}
        style={{ 
          ...imageStyle,
          objectFit: 'cover',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease'acity 0.3s ease',
        }}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        {...accessibilityProps}
        {...props}
      />
      
      {/* 이미지 로드 실패 시 폴백 */}
      {hasError && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-muted/20 text-muted-foreground"
          style={imageStyle}
        >
          <span className="text-sm text-center p-2">{fallbackText}</span>
        </div>
      )}
    </div>
  );
};

export default A11yImage;