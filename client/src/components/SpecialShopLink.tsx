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
    console.log('특별 쇼핑 링크 클릭됨 - 장바구니 페이지를 새 창으로 열기');
    
    // 장바구니 페이지를 새 창에서 열기 (쇼핑몰과 동일한 URL 사용)
    window.open('https://store.funnytalez.com/', '_blank', 'noopener,noreferrer');
    
    // 디버깅 정보
    console.log("SpecialShopLink에서 장바구니 페이지 새 창으로 열기:", new Date().toISOString());
    console.log("현재 경로:", window.location.pathname);
  };
  
  // 아이콘 설정 (장바구니 아이콘으로 변경)
  const icon = <ShoppingCart className="w-5 h-5 mr-2" />;
  
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
            >
              <ShoppingCart className="w-5 h-5" />
              <ExternalLink className="absolute top-0 right-0 w-3 h-3 text-blue-500" />
            </a>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>쇼핑몰 (새 창에서 열림)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // 확장된 사이드바에서는 일반 메뉴 아이템으로 표시
  return (
    <a 
      href="https://replit.com/join/wshpfpjewg-hnblgkjw" 
      onClick={handleClick}
      className={cn(
        "sidebar-link flex items-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out px-3",
        "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary group",
        className
      )}
      target="_blank"
      rel="noopener noreferrer"
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      <span className="flex-1">{children}</span>
      <ExternalLink className="w-4 h-4 text-blue-500 ml-1" aria-label="새 창에서 열림" />
    </a>
  );
}