import React from 'react';
import ShopBasicPage from '../ShopBasicPage';

export default function ShopSimplePage() {
  console.log("ShopSimplePage 컴포넌트 렌더링 (ShopBasicPage로 리디렉션)");
  
  // ShopBasicPage 컴포넌트를 렌더링하여 동일한 내용을 표시
  return <ShopBasicPage />;
}