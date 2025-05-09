import React from 'react';
import { Link, useLocation } from 'wouter';

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
    console.log('특별 쇼핑 링크 클릭됨');
    
    // Wouter의 setLocation 사용 (프로그래매틱 라우팅)
    setLocation("/shop");
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