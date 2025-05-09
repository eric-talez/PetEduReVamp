import React from 'react';
import ShopBasicPage from './ShopBasicPage';

export default function SimpleShopPage() {
  console.log("SimpleShopPage 마운트됨 (ShopBasicPage로 리디렉션)");
  console.log("현재 URL:", window.location.href);
  console.log("현재 경로:", window.location.pathname);
  
  // ShopBasicPage 컴포넌트를 직접 반환
  return <ShopBasicPage />;
}