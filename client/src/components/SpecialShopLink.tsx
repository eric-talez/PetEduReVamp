import React, { useEffect, useState } from "react";

interface SpecialShopLinkProps {
  children: React.ReactNode;
  className?: string;
}

export function SpecialShopLink({ children, className = "" }: SpecialShopLinkProps) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    // 마운트 시에만 URL 설정
    setUrl(window.location.origin + "/shop");
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    console.log("SpecialShopLink 클릭됨");
    console.log("이동할 URL:", url);
    
    // 직접 URL 설정
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <a
      href="#"
      className={className}
      onClick={handleClick}
      data-special="shop-link"
    >
      {children}
    </a>
  );
}