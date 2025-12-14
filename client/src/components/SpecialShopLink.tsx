import React from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingCart } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * 특별 쇼핑 링크 컴포넌트
 * - 내부 쇼핑 페이지(/shop)로 이동하는 링크 컴포넌트
 * - Wouter 라우팅 사용
 */

interface SpecialShopLinkProps {
  children: React.ReactNode;
  className?: string;
  expanded?: boolean;
}

export function SpecialShopLink({ children, className = "", expanded = true }: SpecialShopLinkProps) {
  const [, setLocation] = useLocation();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('[SpecialShopLink] 쇼핑몰 클릭됨');
    
    // 마이크로 인터랙션을 위한 효과
    const target = e.currentTarget as HTMLElement;
    target.classList.add('animate-bounce');
    
    // 애니메이션 후 내부 쇼핑 페이지로 이동
    setTimeout(() => {
      target.classList.remove('animate-bounce');
      setLocation('/shop');
    }, 200);
  };
  
  // 아이콘 설정 (장바구니 아이콘으로 변경)
  const icon = <ShoppingCart className="w-5 h-5 mr-2 text-primary" />;
  
  // 축소된 사이드바일 때 툴팁으로 표시
  if (!expanded) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "sidebar-link relative flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out px-2",
                "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary",
                className
              )}
              onClick={handleClick}
              aria-label="쇼핑몰"
              type="button"
            >
              <ShoppingCart className="w-5 h-5 text-primary transition-all duration-200 hover:scale-110" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 shadow-lg">
            <p>테일즈 샵</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // 확장된 사이드바에서는 일반 메뉴 아이템으로 표시
  return (
    <button
      onClick={handleClick}
      className={cn(
        "sidebar-link flex items-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out px-3 w-full text-left",
        "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary group relative",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900",
        className
      )}
      type="button"
    >
      <ShoppingCart className="w-5 h-5 mr-2 text-primary transition-all duration-200 group-hover:scale-110" />
      <span className="flex-1">{children}</span>
    </button>
  );
}