import React from 'react';
import { cn } from "@/lib/utils";

interface AccessibleIconButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  className?: string;
  variant?: 'default' | 'primary' | 'subtle';
}

/**
 * 접근성이 개선된 아이콘 버튼 컴포넌트
 * - aria-label을 통한 스크린 리더 지원
 * - 키보드 접근성 개선
 * - 시각적 피드백 제공
 */
export function AccessibleIconButton({
  onClick,
  icon,
  label,
  className,
  variant = 'default'
}: AccessibleIconButtonProps) {
  const variantClasses = {
    default: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600",
    primary: "text-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary/30 dark:focus:ring-primary/20",
    subtle: "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700"
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-md transition-colors focus:outline-none",
        variantClasses[variant],
        className
      )}
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {React.isValidElement(icon) 
        ? React.cloneElement(icon as React.ReactElement, { 'aria-hidden': 'true' }) 
        : icon}
    </button>
  );
}