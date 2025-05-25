import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TouchTargetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * 최소 터치 영역 크기 (픽셀)
   * WCAG 지침에 따라 최소 44x44px 권장
   */
  minSize?: number;
  /**
   * 원래 컨텐츠 크기 유지 여부
   */
  preserveContent?: boolean;
  /**
   * 터치 영역 디버그 모드 활성화 여부
   */
  debug?: boolean;
  /**
   * 클릭 이벤트 핸들러
   */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * 접근성 향상을 위한 터치 타겟 크기 최적화 컴포넌트
 * 
 * 모바일 사용자를 위해 작은 상호작용 요소의 터치 영역을 확장합니다.
 * WCAG 지침에 따라 최소 44x44px 크기의 터치 영역을 보장합니다.
 * 
 * @param props 컴포넌트 속성
 * @returns 확장된 터치 영역을 가진 컴포넌트
 */
export const TouchTarget = forwardRef<HTMLDivElement, TouchTargetProps>(
  (
    {
      children,
      minSize = 44,
      preserveContent = true,
      debug = false,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    // 최소 크기 스타일 설정
    const sizeStyle = {
      minWidth: `${minSize}px`,
      minHeight: `${minSize}px`,
    };

    // 컨텐츠 보존 스타일 설정
    const contentStyle = preserveContent
      ? {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }
      : {};

    // 디버그 스타일 설정
    const debugStyle = debug
      ? {
          outline: '1px dashed rgba(255, 0, 0, 0.5)',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
        }
      : {};

    return (
      <div
        ref={ref}
        className={cn('touch-target', className)}
        onClick={onClick}
        style={{
          ...sizeStyle,
          ...contentStyle,
          ...debugStyle,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TouchTarget.displayName = 'TouchTarget';

interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 최소 터치 영역 크기 (픽셀)
   */
  minSize?: number;
  /**
   * 터치 영역 디버그 모드 활성화 여부
   */
  debug?: boolean;
}

/**
 * 접근성이 향상된 버튼 컴포넌트
 * 
 * 최소 터치 영역 크기를 보장하는 버튼입니다.
 * 모바일 사용자를 위한 향상된 접근성을 제공합니다.
 */
export const TouchButton = forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ children, minSize = 44, debug = false, className, ...props }, ref) => {
    // 디버그 스타일 설정
    const debugStyle = debug
      ? {
          outline: '1px dashed rgba(255, 0, 0, 0.5)',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
        }
      : {};

    return (
      <button
        ref={ref}
        className={cn('touch-button', className)}
        style={{
          minWidth: `${minSize}px`,
          minHeight: `${minSize}px`,
          padding: '0.5rem',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...debugStyle,
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TouchButton.displayName = 'TouchButton';

/**
 * 터치 영역 최적화 아이콘 버튼
 * 
 * 작은 아이콘 버튼에 적절한 터치 영역을 제공합니다.
 */
export const TouchIconButton = forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ children, minSize = 44, debug = false, className, ...props }, ref) => {
    return (
      <TouchButton
        ref={ref}
        minSize={minSize}
        debug={debug}
        className={cn('p-2 rounded-full', className)}
        {...props}
      >
        {children}
      </TouchButton>
    );
  }
);

TouchIconButton.displayName = 'TouchIconButton';

/**
 * 사용 예시:
 * 
 * // 기본 터치 영역 확장
 * <TouchTarget>
 *   <a href="/link">작은 링크</a>
 * </TouchTarget>
 * 
 * // 최소 크기가 있는 버튼
 * <TouchButton onClick={handleClick}>
 *   클릭
 * </TouchButton>
 * 
 * // 아이콘 버튼
 * <TouchIconButton aria-label="좋아요">
 *   <HeartIcon className="w-5 h-5" />
 * </TouchIconButton>
 */