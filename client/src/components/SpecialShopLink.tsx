import React from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * 특별 쇼핑 링크 컴포넌트
 * - iframe 없이 직접 쇼핑 페이지로 이동하는 링크 컴포넌트
 * - 다양한 라우팅 방식 지원 (Wouter, 브라우저 API)
 * - 새 창으로 열리는 것을 시각적으로 표현
 */

// 전역 window 인터페이스 확장
declare global {
  interface Window {
    __peteduAuthState?: {
      isAuthenticated: boolean;
      userRole: string | null;
      userName: string | null;
    };
  }
}

interface SpecialShopLinkProps {
  children: React.ReactNode;
  className?: string;
  expanded?: boolean;
}

export function SpecialShopLink({ children, className = "", expanded = true }: SpecialShopLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('특별 쇼핑 링크 클릭됨 - 쇼핑몰 페이지를 새 창으로 열기');
    
    // 마이크로 인터랙션을 위한 효과
    const target = e.currentTarget as HTMLElement;
    target.classList.add('animate-bounce');
    
    // 애니메이션 후 클래스 제거를 위한 타이머
    setTimeout(() => {
      target.classList.remove('animate-bounce');
      // 쇼핑몰 페이지를 새 창에서 열기
      window.open('https://store.funnytalez.com/', '_blank', 'noopener,noreferrer');
    }, 300);
    
    // 디버깅 정보
    console.log("SpecialShopLink에서 쇼핑몰 페이지 새 창으로 열기:", new Date().toISOString());
    console.log("현재 경로:", window.location.pathname);
  };
  
  // 아이콘 설정 (장바구니 아이콘으로 변경)
  const icon = <ShoppingCart className="w-5 h-5 mr-2 text-primary" />;
  
  // 축소된 사이드바일 때 툴팁으로 표시
  if (!expanded) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://store.funnytalez.com/"
              className={cn(
                "sidebar-link relative flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out px-2",
                "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary",
                className
              )}
              onClick={handleClick}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="쇼핑몰 (새 창에서 열림)"
              tabIndex={0}
            >
              <ShoppingCart className="w-5 h-5 text-primary transition-all duration-200 hover:scale-110" />
              <ExternalLink className="absolute top-0 right-0 w-3 h-3 text-blue-500 animate-pulse" />
            </a>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 shadow-lg">
            <p>쇼핑몰 (새 창에서 열림)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // 확장된 사이드바에서는 일반 메뉴 아이템으로 표시
  return (
    <a 
      href="https://store.funnytalez.com/" 
      onClick={handleClick}
      className={cn(
        "sidebar-link flex items-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out px-3",
        "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary group relative",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900",
        className
      )}
      target="_blank"
      rel="noopener noreferrer"
    >
      <ShoppingCart className="w-5 h-5 mr-2 text-primary transition-all duration-200 group-hover:scale-110" />
      <span className="flex-1">{children}</span>
      <div className="flex items-center">
        <ExternalLink className="w-4 h-4 text-blue-500 ml-1 transition-all duration-200 group-hover:text-primary" aria-label="새 창에서 열림" />
      </div>
    </a>
  );
}