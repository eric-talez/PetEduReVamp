import React from 'react';

/**
 * 특별 쇼핑 링크 컴포넌트
 * - 다른 페이지에서 쇼핑 페이지로 일관된 링크를 제공하기 위한 컴포넌트
 * - 인증 상태와 관계없이 쇼핑 페이지로 안전하게 이동할 수 있도록 함
 */

interface SpecialShopLinkProps {
  children: React.ReactNode;
  className?: string;
}

export function SpecialShopLink({ children, className = "" }: SpecialShopLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    console.log("특별 쇼핑 링크 클릭됨");
    
    // 리디렉션 컴포넌트 활용
    try {
      console.log("쇼핑 리디렉션 페이지로 이동");
      window.location.href = "/shop-redirect";
    } catch (error) {
      console.error("리디렉션 이동 실패:", error);
      
      // 백업 방식 1: 직접 shop-basic 경로 사용
      try {
        window.location.href = "/shop-basic";
      } catch (e2) {
        console.error("백업 방식 1 실패:", e2);
        
        // 백업 방식 2: 파라미터로 표시
        window.location.href = "/?shop=true";
      }
    }
  };
  
  return (
    <a 
      href="/shop-redirect" 
      onClick={handleClick}
      className={`inline-flex items-center ${className}`}
    >
      {children}
    </a>
  );
}