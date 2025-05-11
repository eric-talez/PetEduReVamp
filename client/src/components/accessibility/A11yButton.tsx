import React, { forwardRef } from 'react';
import { handleKeyboardAction } from '@/utils/accessibility/a11y-utils';

interface A11yButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 버튼 내용 */
  children: React.ReactNode;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 버튼의 설명(스크린 리더용) */
  ariaLabel?: string;
  /** 접근성 역할 지정 */
  role?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 접근성 강화 버튼 컴포넌트
 * 
 * div, span 등의 요소를 버튼처럼 사용할 때 접근성을 보장하기 위한 컴포넌트
 * 키보드 접근성 및 적절한 ARIA 속성을 제공합니다.
 */
const A11yButton = forwardRef<HTMLDivElement, A11yButtonProps>(({
  children,
  onClick,
  ariaLabel,
  role = 'button',
  disabled = false,
  className = '',
  ...rest
}, ref) => {
  // 비활성화 상태인 경우 클릭 핸들러를 처리하지 않음
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.();
  };

  // 키보드 이벤트 처리 (Enter 또는 Space 키로 버튼 활성화)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    handleKeyboardAction(event, () => onClick?.());
    
    // 원본 onKeyDown 핸들러가 있으면 호출
    rest.onKeyDown?.(event);
  };

  return (
    <div
      ref={ref}
      role={role}
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`${className} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      {...rest}
    >
      {children}
    </div>
  );
});

A11yButton.displayName = 'A11yButton';

export default A11yButton;