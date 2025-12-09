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

// URL 검증 함수
const isValidShopUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    // HTTPS 프로토콜만 허용
    if (urlObj.protocol !== 'https:') {
      console.warn('[SpecialShopLink] HTTPS만 지원됩니다:', url);
      return false;
    }
    // 허용된 도메인 확인 (배포 버전)
    const allowedDomains = ['store.funnytalez.com', 'shop.funnytalez.com'];
    const isAllowed = allowedDomains.some(domain => urlObj.hostname === domain);
    if (!isAllowed && import.meta.env.PROD) {
      console.warn('[SpecialShopLink] 허용되지 않은 도메인:', urlObj.hostname);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[SpecialShopLink] 잘못된 URL:', error);
    return false;
  }
};

export function SpecialShopLink({ children, className = "", expanded = true }: SpecialShopLinkProps) {
  // 환경 변수에서 쇼핑몰 URL 가져오기
  const shopBaseUrl = import.meta.env.VITE_SHOP_URL || 'https://store.funnytalez.com/';
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('[SpecialShopLink] 쇼핑몰 클릭됨');
    
    // URL 검증
    if (!isValidShopUrl(shopBaseUrl)) {
      console.error('[SpecialShopLink] 유효하지 않은 쇼핑몰 URL');
      alert('쇼핑몰을 열 수 없습니다. 나중에 다시 시도해주세요.');
      return;
    }
    
    // 마이크로 인터랙션을 위한 효과
    const target = e.currentTarget as HTMLElement;
    target.classList.add('animate-bounce');
    
    // 현재 인증 상태 확인
    const authState = window.__peteduAuthState || {
      isAuthenticated: false,
      userRole: null,
      userName: null
    };
    
    // 보안: URL 파라미터로 민감한 정보 전달 제한
    let shopUrl = shopBaseUrl;
    
    // 개발 환경에서만 URL 파라미터 사용 (프로덕션에서는 JWT 토큰 사용 권장)
    if (!import.meta.env.PROD && authState.isAuthenticated && authState.userName) {
      const params = new URLSearchParams({
        auth: 'true',
        role: authState.userRole || 'pet-owner'
        // userName은 전달하지 않음 (보안)
      });
      shopUrl += '?' + params.toString();
    }
    
    // 애니메이션 후 클래스 제거를 위한 타이머
    setTimeout(() => {
      target.classList.remove('animate-bounce');
      // 쇼핑몰 페이지를 새 창에서 열기
      window.open(shopUrl, '_blank', 'noopener,noreferrer');
    }, 300);
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
              aria-label="쇼핑몰 (새 창에서 열림)"
              type="button"
            >
              <ShoppingCart className="w-5 h-5 text-primary transition-all duration-200 hover:scale-110" />
              <ExternalLink className="absolute top-0 right-0 w-3 h-3 text-blue-500 animate-pulse" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 shadow-lg">
            <p>테일즈 샵 (새 창에서 열림)</p>
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
      <div className="flex items-center">
        <ExternalLink className="w-4 h-4 text-blue-500 ml-1 transition-all duration-200 group-hover:text-primary" aria-label="새 창에서 열림" />
      </div>
    </button>
  );
}