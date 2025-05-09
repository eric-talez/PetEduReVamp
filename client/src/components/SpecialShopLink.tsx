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
    console.log('특별 쇼핑 링크 클릭됨 - 직접 URL로 이동');
    
    // 인증 여부와 관계없이 쇼핑 페이지로 직접 이동하되 window.location.href 사용
    // wouter의 setLocation 대신 직접 URL 이동 방식을 사용하여 일관성 유지
    window.location.href = "/shop";
    
    // 디버깅 정보
    console.log("SpecialShopLink에서 쇼핑 페이지 이동 시작:", new Date().toISOString());
    console.log("현재 경로:", window.location.pathname);
    console.log("이동할 경로:", "/shop");
  };
  
  return (
    <a 
      href="/shop" 
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}