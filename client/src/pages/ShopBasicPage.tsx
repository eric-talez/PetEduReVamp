import React from 'react';

export default function ShopBasicPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">간단한 쇼핑 페이지</h1>
      
      <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
        <p className="text-center">
          이 페이지는 쇼핑 페이지 문제 해결을 위한 테스트 페이지입니다.
        </p>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(num => (
          <div key={num} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <h3 className="text-lg font-semibold mb-2">테스트 상품 {num}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              이 상품은 테스트용 상품입니다.
            </p>
            <div className="flex justify-between items-center">
              <span className="font-bold">{(num * 10000).toLocaleString()}원</span>
              <button className="px-3 py-1 bg-primary text-white rounded">
                장바구니에 추가
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 text-center">
        <p className="text-xl">쇼핑 페이지가 정상적으로 로드되었습니다!</p>
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg mt-2 inline-block">
          <p>현재 경로: <code>{window.location.pathname}</code></p>
        </div>
      </div>
    </div>
  );
}