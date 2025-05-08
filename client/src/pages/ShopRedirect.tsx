import React, { useEffect } from 'react';

export default function ShopRedirectPage() {
  useEffect(() => {
    // 직접 shop-simple 페이지로 리다이렉트
    console.log("ShopRedirect 페이지에서 shop-simple 페이지로 강제 리다이렉트 수행");
    window.location.replace('/shop-simple');
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-4">쇼핑몰 페이지로 이동 중...</h1>
      <p className="text-muted-foreground mb-8">잠시만 기다려주세요.</p>
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
}