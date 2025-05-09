import React, { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * 쇼핑 페이지 리디렉션 컴포넌트
 * - 라우팅 문제를 우회하기 위한 특수 페이지
 * - 다양한 방식으로 ShopBasicPage로 리디렉션 시도
 */
export default function ShopRedirect() {
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    console.log('ShopRedirect 컴포넌트 마운트됨');
    console.log('현재 경로:', location);
    
    // 리디렉션 시도 (다양한 방법)
    const redirectToShop = () => {
      try {
        console.log('ShopBasicPage로 리디렉션 시도 (방법 1: Wouter)');
        setLocation('/shop-basic');
      } catch (e) {
        console.error('Wouter 리디렉션 실패:', e);
        
        try {
          console.log('방법 2: 히스토리 API 사용');
          window.history.pushState({}, '', '/shop-basic');
          window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (e2) {
          console.error('히스토리 API 사용 실패:', e2);
          
          try {
            console.log('방법 3: window.location 사용');
            window.location.href = '/shop-basic';
          } catch (e3) {
            console.error('window.location 사용 실패:', e3);
            
            // 최후의 수단: 절대 URL 사용
            console.log('방법 4: 절대 URL 사용');
            window.location.replace(window.location.origin + '/shop-basic');
          }
        }
      }
    };
    
    // 짧은 지연 후 리디렉션 실행 (컴포넌트가 마운트되고 DOM이 업데이트될 시간 제공)
    const timeoutId = setTimeout(redirectToShop, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [location, setLocation]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
      <h1 className="text-xl font-bold mb-2">쇼핑 페이지로 이동 중...</h1>
      <p className="text-gray-500">잠시만 기다려주세요</p>
    </div>
  );
}