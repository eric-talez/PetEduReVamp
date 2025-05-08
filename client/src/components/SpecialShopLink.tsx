import React from "react";

interface SpecialShopLinkProps {
  children: React.ReactNode;
  className?: string;
}

export function SpecialShopLink({ children, className = "" }: SpecialShopLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    console.log("SpecialShopLink 클릭됨");
    
    // URL 객체 사용하여 이동
    try {
      const url = new URL('/shop', window.location.origin);
      console.log("이동할 URL (URL 객체 사용):", url.toString());
      // 페이지 새로고침 느낌으로 이동
      window.location.replace(url.toString());
    } catch (e) {
      console.error("URL 생성 오류:", e);
      // 백업 방식
      window.location.href = "/shop";
    }
  };

  return (
    <a
      href="/shop"
      className={className}
      onClick={handleClick}
      data-special="shop-link"
    >
      {children}
    </a>
  );
}