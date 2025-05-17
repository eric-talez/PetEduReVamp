import React from 'react';
import { cn } from '@/lib/utils';

interface BannerImageProps {
  src: string;
  alt: string;
  className?: string;
  overlayText?: string | React.ReactNode;
  height?: string;
  textPosition?: 'left' | 'center' | 'right';
  textSize?: 'small' | 'medium' | 'large';
  tint?: 'none' | 'light' | 'dark';
}

/**
 * 최적화된 배너 이미지 컴포넌트
 * 텍스트 위치 및 배경 오버레이 조정 가능
 */
export function BannerImage({
  src,
  alt,
  className,
  overlayText,
  height = 'h-64',
  textPosition = 'left',
  textSize = 'medium',
  tint = 'none'
}: BannerImageProps) {
  // 텍스트 위치에 따른 스타일 클래스
  const textPositionClasses = {
    left: 'justify-start text-left pl-8',
    center: 'justify-center text-center',
    right: 'justify-end text-right pr-8'
  };

  // 텍스트 크기에 따른 스타일 클래스
  const textSizeClasses = {
    small: 'text-xl md:text-2xl',
    medium: 'text-2xl md:text-3xl',
    large: 'text-3xl md:text-4xl lg:text-5xl'
  };

  // 배경 틴트 효과 (이미지 위에 덮이는 반투명 색상)
  const tintClasses = {
    none: '',
    light: 'before:absolute before:inset-0 before:bg-black/10 before:z-10',
    dark: 'before:absolute before:inset-0 before:bg-black/30 before:z-10'
  };

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-lg', 
        height,
        tintClasses[tint],
        className
      )}
    >
      {/* 이미지 - object-cover로 비율 유지하면서 컨테이너 채우기 */}
      <img 
        src={src} 
        alt={alt} 
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        style={{ filter: 'none' }} // 필터 제거 강제 적용
      />

      {/* 텍스트 오버레이가 있는 경우 */}
      {overlayText && (
        <div className={cn(
          'absolute inset-0 z-20 flex items-center',
          textPositionClasses[textPosition]
        )}>
          {typeof overlayText === 'string' ? (
            <h2 className={cn(
              textSizeClasses[textSize],
              'font-bold text-white px-4 py-2 rounded-md bg-black/40 shadow-lg max-w-xl'
            )}>
              {overlayText}
            </h2>
          ) : (
            overlayText
          )}
        </div>
      )}
    </div>
  );
}