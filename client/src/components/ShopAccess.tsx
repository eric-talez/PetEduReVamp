import React, { useEffect, useState } from 'react';
import { ShoppingBag, Package2, Search, ShoppingCart } from 'lucide-react';
import { useLocation } from 'wouter';

/**
 * 쇼핑 페이지 직접 접근 컴포넌트
 * - iframe을 사용하지 않고 직접 페이지 콘텐츠를 렌더링
 * - 여러 방식의 접근 방법 제공
 */
export function ShopAccess() {
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log('ShopAccess 컴포넌트 마운트됨, 현재 경로:', location);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [location]);
  
  // 직접 쇼핑 페이지로 이동하기 위한 핸들러
  const handleDirectAccess = () => {
    console.log('직접 쇼핑 페이지로 이동 시도');
    try {
      // Wouter 라우팅 사용
      setLocation('/shop-basic');
    } catch (e) {
      console.error('Wouter 라우팅 실패:', e);
      
      // 백업 방식: 브라우저 API 사용
      window.location.href = '/shop-basic';
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <h1 className="text-xl font-bold mb-2">쇼핑 페이지 준비 중...</h1>
        <p className="text-gray-500">잠시만 기다려주세요</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* 쇼핑 페이지 헤더 */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center">
              <ShoppingBag className="mr-2" /> 펫에듀 쇼핑
            </h1>
            <div className="flex space-x-4">
              <button className="p-2 rounded-full hover:bg-primary-foreground/10">
                <Search />
              </button>
              <button className="p-2 rounded-full hover:bg-primary-foreground/10">
                <ShoppingCart />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 쇼핑 페이지 메인 콘텐츠 */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {/* 쇼핑 카테고리 카드 */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-card rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
              <div className="p-6">
                <div className="flex items-center justify-center bg-primary/10 rounded-full w-12 h-12 mb-4">
                  <Package2 className="text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">반려동물 {index % 2 === 0 ? '사료' : '간식'} {index + 1}</h3>
                <p className="text-gray-500 mb-4">고품질의 건강한 제품을 만나보세요</p>
                <button 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  onClick={handleDirectAccess}
                >
                  구경하기
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* 직접 접근 버튼 */}
        <div className="mt-12 text-center">
          <button 
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
            onClick={handleDirectAccess}
          >
            쇼핑몰 바로가기
          </button>
        </div>
      </div>
      
      {/* 에러 시 공지 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-8 mx-4">
        <p className="text-amber-700">
          참고: 쇼핑 페이지에 접근하는 중 문제가 발생했나요? 
          <button 
            className="ml-2 underline text-primary"
            onClick={handleDirectAccess}
          >
            여기를 클릭하여 다시 시도하세요
          </button>
        </p>
      </div>
    </div>
  );
}