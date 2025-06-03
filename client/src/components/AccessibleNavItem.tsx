import React, { useContext } from 'react';
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SidebarContext } from "./Sidebar";

interface AccessibleNavItemProps {
  href: string;
  icon: React.ReactNode;
  hoverIcon?: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  onClick?: (path: string) => void;
  show: boolean;
}

/**
 * 접근성이 개선된 네비게이션 아이템 컴포넌트
 * - 사이드바 열림 상태: 아이콘 + 텍스트 표시
 * - 사이드바 닫힘 상태: 아이콘만 표시하되 툴팁으로 제목 표시
 * - 접근성 레이블 추가
 */
export function AccessibleNavItem({ href, icon, hoverIcon, children, active, onClick, show }: AccessibleNavItemProps) {
  const { expanded } = useContext(SidebarContext);
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (onClick) {
      onClick(href);
    } else {
      console.log("기본 네비게이션 시도:", href);
      window.location.href = href;
    }
  };
  
  if (!show) return null;
  
  // 접근성 레이블 생성
  const accessibilityLabel = typeof children === 'string' ? children : children?.toString();
  
  // 닫힌 상태에서는 아이콘만 표시하되 툴팁 제공
  if (!expanded) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={href}
              className={cn(
                "sidebar-link flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out px-2 group",
                active ? "bg-primary/10 text-primary" : "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-primary/5"
              )}
              onClick={handleClick}
              aria-label={accessibilityLabel}
            >
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 transition-all duration-300 group-hover:scale-0 group-hover:opacity-0">
                  {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
                </div>
                {hoverIcon && (
                  <div className="absolute inset-0 transition-all duration-300 scale-0 opacity-0 group-hover:scale-110 group-hover:opacity-100 group-hover:rotate-12">
                    {React.cloneElement(hoverIcon as React.ReactElement, { className: "w-5 h-5" })}
                  </div>
                )}
              </div>
            </a>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{children}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // 열린 상태에서는 아이콘 + 텍스트 표시
  return (
    <a
      href={href}
      className={cn(
        "sidebar-link flex items-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out px-3 group",
        active ? "bg-primary/10 text-primary" : "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-primary/5",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      )}
      onClick={handleClick}
      aria-label={accessibilityLabel}
      aria-current={active ? "page" : undefined}
      tabIndex={0}
      role="menuitem"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) {
            onClick(href);
          } else {
            window.location.href = href;
          }
        }
      }}
    >
      <div className="relative w-5 h-5 mr-3">
        <div className="absolute inset-0 transition-all duration-300 group-hover:scale-0 group-hover:opacity-0">
          {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
        </div>
        {hoverIcon && (
          <div className="absolute inset-0 transition-all duration-300 scale-0 opacity-0 group-hover:scale-110 group-hover:opacity-100 group-hover:rotate-12">
            {React.cloneElement(hoverIcon as React.ReactElement, { className: "w-5 h-5" })}
          </div>
        )}
      </div>
      <span className="transition-all duration-200 group-hover:translate-x-1">{children}</span>
    </a>
  );
}