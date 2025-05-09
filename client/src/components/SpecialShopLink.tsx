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
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('특별 쇼핑 링크 클릭됨 - 새 창으로 열기');
    
    // 쇼핑 페이지를 새 창에서 열기
    window.open('/shop', '_blank', 'noopener,noreferrer');
    
    // 디버깅 정보
    console.log("SpecialShopLink에서 쇼핑 페이지 새 창으로 열기:", new Date().toISOString());
    console.log("현재 경로:", window.location.pathname);
  };
  
  return (
    <a 
      href="/shop" 
      onClick={handleClick}
      className={className}
      // 새 창에서 열기 속성 추가 (JavaScript 실패 시 대비)
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}