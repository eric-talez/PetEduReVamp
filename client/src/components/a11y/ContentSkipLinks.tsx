import React from 'react';
import { cn } from '@/lib/utils';

interface SkipLinkProps {
  id: string;
  label: string;
  className?: string;
}

interface ContentSkipLinksProps {
  links?: SkipLinkProps[];
  className?: string;
}

/**
 * 접근성 개선을 위한 건너뛰기 링크 컴포넌트
 * 
 * 키보드 사용자가 반복되는 네비게이션을 건너뛰고 주요 콘텐츠로 바로 이동할 수 있게 합니다.
 * Tab 키로 포커스를 받을 때만 화면에 표시되며, 스크린 리더 사용자에게도 유용합니다.
 * 
 * @param links 건너뛰기 링크 배열 (대상 ID와 레이블)
 * @param className 추가 CSS 클래스
 */
export const ContentSkipLinks: React.FC<ContentSkipLinksProps> = ({
  links = [
    { id: 'main-content', label: '메인 콘텐츠로 바로 가기' },
    { id: 'main-navigation', label: '메인 메뉴로 바로 가기' },
    { id: 'search', label: '검색으로 바로 가기' },
  ],
  className,
}) => {
  return (
    <div
      className={cn(
        'fixed top-0 left-0 z-[100] w-full flex flex-col items-center',
        className
      )}
    >
      {links.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className={cn(
            'sr-only focus:not-sr-only focus:absolute focus:z-[101]',
            'focus:p-3 focus:m-3 focus:bg-primary focus:text-primary-foreground',
            'focus:rounded focus:shadow-lg focus:outline-none',
            'focus:border-2 focus:border-primary-foreground focus:ring-2 focus:ring-primary',
            'transition-transform text-base font-medium',
            'hover:underline',
            link.className
          )}
          onClick={(e) => {
            // 대상 요소로 포커스 이동
            const target = document.getElementById(link.id);
            if (target) {
              e.preventDefault();
              target.focus();
              target.scrollIntoView({ behavior: 'smooth' });
              
              // 화면 위치 표시를 위한 애니메이션 효과
              const originalBg = target.style.background;
              const originalOutline = target.style.outline;
              
              target.style.background = 'rgba(59, 130, 246, 0.1)';
              target.style.outline = '2px solid #3b82f6';
              
              setTimeout(() => {
                target.style.background = originalBg;
                target.style.outline = originalOutline;
                
                // 일시적 애니메이션 클래스 추가
                target.classList.add('a11y-target-highlight');
                
                // 애니메이션 종료 후 클래스 제거
                setTimeout(() => {
                  target.classList.remove('a11y-target-highlight');
                }, 1500);
              }, 1500);
            }
          }}
        >
          {link.label}
        </a>
      ))}
      
      {/* 애니메이션 스타일 */}
      <style>{`
        @keyframes a11yTargetHighlight {
          0% { background: rgba(59, 130, 246, 0.2); }
          100% { background: transparent; }
        }
        
        .a11y-target-highlight {
          animation: a11yTargetHighlight 1.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContentSkipLinks;