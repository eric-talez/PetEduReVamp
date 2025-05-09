import React from 'react';
import { useLocation } from 'wouter';

/**
 * 특별 쇼핑 링크 컴포넌트
 * - iframe 없이 직접 쇼핑 페이지로 이동하는 링크 컴포넌트
 * - 다양한 라우팅 방식 지원 (Wouter, 브라우저 API)
 */

interface SpecialShopLinkProps {
  children: React.ReactNode;
  className?: string;
}

export function SpecialShopLink({ children, className = "" }: SpecialShopLinkProps) {
  const [location, setLocation] = useLocation();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    console.log("특별 쇼핑 링크 클릭됨 - iframe 없이 직접 이동");
    
    // 방법 1: Wouter 네비게이션 사용
    try {
      console.log("쇼핑 페이지로 직접 이동 (Wouter setLocation)");
      setLocation('/shop');
    } catch (error) {
      console.error("Wouter 이동 실패:", error);
      
      // 방법 2: 브라우저 네비게이션 API 사용
      try {
        window.history.pushState({}, "", "/shop");
        window.dispatchEvent(new PopStateEvent("popstate"));
      } catch (e2) {
        console.error("History API 사용 실패:", e2);
        
        // 방법 3: 직접 URL 이동
        try {
          window.location.href = "/shop";
        } catch (e3) {
          console.error("직접 URL 이동 실패:", e3);
          
          // 방법 4: 최후 대안으로 리디렉션 컴포넌트 사용
          window.location.href = "/shop-redirect";  
        }
      }
    }
  };
  
  return (
    <a 
      href="/shop" 
      onClick={handleClick}
      className={`inline-flex items-center ${className}`}
    >
      {children}
    </a>
  );
}