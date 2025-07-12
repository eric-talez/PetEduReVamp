import React, { useEffect, useState } from 'react';
import { ShoppingBag, Package2, Search, ShoppingCart } from 'lucide-react';
import { useLocation } from 'wouter';
import { Link } from 'wouter';

/**
 * 쇼핑 페이지 접근 안내 컴포넌트
 * - 쇼핑 미리보기 제공
 * - 직접 쇼핑 페이지로 이동 버튼 제공
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
  
  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <h1 className="text-xl font-bold mb-2">쇼핑 미리보기 준비 중...</h1>
        <p className="text-gray-500">잠시만 기다려주세요</p>
      </div>
    );
  }
  
  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {/* 쇼핑 미리보기 헤더 */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center">
            <ShoppingBag className="mr-2" /> 테일즈 샵
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                console.log("ShopAccess에서 쇼핑몰 바로가기 클릭 - 새 창으로 열기");
                
                // 쇼핑 페이지를 새 창에서 열기
                window.open('https://replit.com/join/wshpfpjewg-hnblgkjw', '_blank', 'noopener,noreferrer');
                
                // 디버깅 정보
                console.log("ShopAccess에서 쇼핑 페이지 새 창으로 열기:", new Date().toISOString());
                console.log("현재 경로:", window.location.pathname);
              }}
              className="px-4 py-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 rounded-md text-sm font-medium transition-colors"
            >
              쇼핑몰 바로가기
            </button>
          </div>
        </div>
      </div>
      
      {/* 쇼핑 미리보기 콘텐츠 */}
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* 쇼핑 카테고리 카드 */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div 
              key={index} 
              onClick={() => {
                console.log("ShopAccess에서 카테고리 클릭 - 새 창으로 열기");
                
                // 쇼핑 페이지를 새 창에서 열기
                window.open('https://replit.com/join/wshpfpjewg-hnblgkjw', '_blank', 'noopener,noreferrer');
                
                // 디버깅 정보
                console.log("ShopAccess 카테고리에서 새 창으로 열기:", new Date().toISOString());
                console.log("현재 경로:", window.location.pathname);
              }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 shadow-sm cursor-pointer"
            >
              <div className="p-3">
                <div className="flex items-center justify-center bg-primary/10 rounded-full w-8 h-8 mb-2">
                  <Package2 className="text-primary w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold mb-1">반려동물 {index % 2 === 0 ? '사료' : '간식'}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">고품질 제품</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* 주요 혜택 안내 */}
        <div className="mt-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
          <h3 className="text-sm font-medium mb-2">쇼핑몰 혜택</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-1"></span>
              <span>신규 가입 10% 할인</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-1"></span>
              <span>정기 배송 서비스</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-1"></span>
              <span>포인트 적립 및 사용</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-1"></span>
              <span>무료 배송 이벤트</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}