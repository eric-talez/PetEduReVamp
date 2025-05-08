import React, { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function ShopRedirectPage() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const loadShopPage = async () => {
      try {
        // 동적으로 페이지 모듈 가져오기 시도
        console.log("ShopRedirect: 쇼핑 페이지 모듈 동적 로드 시도");
        
        // 브라우저 콘솔에 명시적 로그 추가
        console.log("ShopRedirect: 로드 중 상태 - 쇼핑");
        
        // 기본 쇼핑 페이지로 이동
        const ShopPage = await import('./shop/index');
        console.log("ShopRedirect: 모듈 로드 성공", ShopPage);
        
        // 페이지 렌더링을 위해 location 설정 대신 직접 페이지 교체
        window.location.href = "/shop";
      } catch (error) {
        console.error("ShopRedirect: 쇼핑 페이지 로드 실패", error);
        
        // 대체 경로로 시도
        try {
          console.log("ShopRedirect: 대체 쇼핑 페이지 시도(shop-simple)");
          const SimpleShopPage = await import('./shop-simple/index');
          console.log("ShopRedirect: 대체 모듈 로드 성공", SimpleShopPage);
          window.location.href = "/shop-simple";
        } catch (fallbackError) {
          console.error("ShopRedirect: 대체 쇼핑 페이지 로드 실패", fallbackError);
          
          // 마지막 대안으로 기본 쇼핑 페이지 직접 로드
          console.log("ShopRedirect: 기본 ShopBasicPage 시도");
          window.location.href = "/";
        }
      }
    };

    loadShopPage();
  }, [setLocation]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-4">쇼핑몰 페이지로 이동 중...</h1>
      <p className="text-muted-foreground mb-8">잠시만 기다려주세요.</p>
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
}