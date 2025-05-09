import React from 'react';
import { ShopAccess } from '../components/ShopAccess';

/**
 * 쇼핑 페이지 리디렉션 컴포넌트
 * - iframe 사용하지 않고 직접 ShopAccess 컴포넌트를 렌더링
 * - 외부 사이트 리디렉션 문제 해결
 */
export default function ShopRedirect() {
  console.log('ShopRedirect 컴포넌트 렌더링 (ShopAccess 직접 사용)');
  
  return <ShopAccess />;
}