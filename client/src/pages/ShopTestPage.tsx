import React, { useEffect } from 'react';

export default function ShopTestPage() {
  useEffect(() => {
    console.log("ShopTestPage 마운트됨");
    console.log("경로:", window.location.pathname);
    console.log("URL:", window.location.href);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-4">간단한 테스트 쇼핑 페이지</h1>
        <p className="mb-2">이 페이지는 라우팅 테스트를 위한 매우 간단한 페이지입니다.</p>
        <p className="text-sm">현재 URL: <code>{window.location.href}</code></p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="bg-gray-200 dark:bg-gray-700 h-32 mb-3 rounded" />
            <h3 className="font-bold">테스트 상품 {i}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              간단한 상품 설명입니다.
            </p>
            <div className="flex justify-between">
              <span className="font-semibold">{i * 10000}원</span>
              <button className="px-3 py-1 bg-primary text-white rounded-md">담기</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg mt-6">
        <h3 className="font-bold mb-2">디버그 정보</h3>
        <p>컴포넌트: ShopTestPage</p>
        <p>파일 위치: client/src/pages/ShopTestPage.tsx</p>
        <p>현재 경로: {window.location.pathname}</p>
      </div>
    </div>
  );
}