import React from "react";

interface SpecialShopLinkProps {
  children: React.ReactNode;
  className?: string;
}

export function SpecialShopLink({ children, className = "" }: SpecialShopLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    console.log("SpecialShopLink 클릭됨");
    
    // 직접 URL 설정 - 항상 /shop로 이동하도록 수정
    const shopUrl = "/shop";
    console.log("이동할 URL:", shopUrl);
    window.location.href = shopUrl;
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