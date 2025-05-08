import React from 'react';

export default function ShopSimplePage() {
  console.log("ShopSimplePage 컴포넌트 렌더링");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">반려견 용품 쇼핑</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(num => (
          <div key={num} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
            <h3 className="text-lg font-semibold mb-2">반려견 용품 {num}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              고품질 반려견 용품입니다.
            </p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">{(num * 15000).toLocaleString()}원</span>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                장바구니 담기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}