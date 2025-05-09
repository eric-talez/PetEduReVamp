import React from 'react';
import { Link, useLocation } from 'wouter';

/**
 * 특별 쇼핑 링크 컴포넌트
 * - iframe 없이 직접 쇼핑 페이지로 이동하는 링크 컴포넌트
 * - 다양한 라우팅 방식 지원 (Wouter, 브라우저 API)
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
}

export function SpecialShopLink({ children, className = "" }: SpecialShopLinkProps) {
  const [location, setLocation] = useLocation();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('특별 쇼핑 링크 클릭됨');
    
    // window.location 사용 (전통적인 브라우저 네비게이션)
    // 인증 여부와 관계없이 쇼핑 페이지로 직접 이동
    // 정적 HTML 페이지로 이동
    window.location.href = "/shop.html";
  };
  
  return (
    <a 
      href="/shop.html" 
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}