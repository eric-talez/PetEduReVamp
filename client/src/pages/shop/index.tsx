import React, { useEffect } from 'react';

export default function ShopPage() {
  console.log("Original Shop Page Loaded!");
  
  useEffect(() => {
    // 여기서 리다이렉트
    console.log("Shop 페이지에서 shop-simple 페이지로 리다이렉트 시도");
    window.location.href = '/shop-simple';
  }, []);

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">쇼핑 페이지로 이동 중...</h1>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
}