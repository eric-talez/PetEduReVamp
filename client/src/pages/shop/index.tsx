import React, { useEffect } from 'react';
import ShopPage from './ShopPage';

/**
 * 쇼핑몰 진입점 컴포넌트
 * - 모든 shop/* 경로 요청은 이 컴포넌트를 통해 처리됨
 * - 인증 여부와 관계없이 접근 가능
 */
export default function ShopIndex() {
  useEffect(() => {
    console.log("shop/index.tsx가 로드됨:", new Date().toISOString());
  }, []);
  
  return <ShopPage />;
}