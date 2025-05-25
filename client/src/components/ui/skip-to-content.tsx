import React from 'react';
import { cn } from '@/lib/utils';

interface SkipToContentProps {
  contentId: string;
  className?: string;
  label?: string;
}

/**
 * 콘텐츠로 바로 이동할 수 있는 접근성 컴포넌트
 * 
 * 키보드 사용자가 반복되는 네비게이션을 건너뛰고
 * 바로 메인 콘텐츠로 이동할 수 있도록 합니다.
 * 평소에는 화면에 보이지 않다가 Tab 키로 포커스를 받을 때만 표시됩니다.
 * 
 * @param contentId 건너뛸 메인 콘텐츠 요소의 ID
 * @param className 추가 CSS 클래스
 * @param label 버튼 텍스트
 */
export function SkipToContent({
  contentId,
  className,
  label = '메인 콘텐츠로 바로 가기'
}: SkipToContentProps) {
  return (
    <a
      href={`#${contentId}`}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50',
        'focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        className
      )}
    >
      {label}
    </a>
  );
}

// 사용 예시:
// 1. 먼저 컴포넌트를 렌더링합니다 (일반적으로 페이지 최상단에)
// <SkipToContent contentId="main-content" />
//
// 2. 그런 다음 메인 콘텐츠 요소에 해당 ID를 지정합니다
// <main id="main-content">...</main>