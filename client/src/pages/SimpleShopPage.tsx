import React, { useEffect } from 'react';
import { ShoppingBag, Search } from 'lucide-react';

export default function SimpleShopPage() {
  useEffect(() => {
    console.log("SimpleShopPage 로드됨");
    console.log("현재 URL:", window.location.href);
    console.log("현재 경로:", window.location.pathname);
    
    // 문서 타이틀 설정
    document.title = "쇼핑 - 매우 간단한 버전";
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-4">매우 간단한 쇼핑 페이지</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          이 페이지는 라우팅 문제를 디버깅하기 위한 매우 간단한 페이지입니다.
        </p>
        <div className="flex items-center justify-between">
          <span>로딩 시간: {new Date().toLocaleTimeString()}</span>
          <ShoppingBag className="text-primary" size={24} />
        </div>
      </div>
      
      {/* 검색창 */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="상품 검색..."
            className="w-full pl-10 pr-4 py-2 border rounded-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
      
      {/* 간단한 상품 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3"></div>
            <h3 className="font-bold text-lg mb-1">테스트 상품 {i}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 h-10">
              간단한 상품 설명입니다.
            </p>
            <div className="flex justify-between items-center">
              <span className="font-bold">{(i * 10000).toLocaleString()}원</span>
              <button className="px-3 py-1 bg-primary text-white rounded-full text-sm">
                장바구니
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* 디버그 정보 */}
      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
        <h3 className="font-bold mb-2">디버그 정보</h3>
        <p>컴포넌트: SimpleShopPage</p>
        <p>파일 위치: client/src/pages/SimpleShopPage.tsx</p>
        <p>현재 경로: {window.location.pathname}</p>
        <p>전체 URL: {window.location.href}</p>
      </div>
    </div>
  );
}