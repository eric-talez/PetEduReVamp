import React from "react";

export default function ShopPage() {
  console.log("극단적으로 단순화된 ShopPage 컴포넌트 렌더링");
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">반려견 용품 쇼핑</h1>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
        <p className="text-lg mb-4">쇼핑 페이지 테스트 중</p>
        <p>정상적으로 렌더링되었습니다!</p>
      </div>
    </div>
  );
}