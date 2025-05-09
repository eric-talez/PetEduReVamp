import React from 'react';
import { ShoppingBag } from 'lucide-react';

/**
 * 쇼핑 페이지 직접 접근 컴포넌트
 * - iframe을 사용하지 않고 직접 페이지 콘텐츠를 렌더링
 * - 여러 방식의 접근 방법 제공
 */
export function ShopAccess() {
  // 다양한 방식으로 쇼핑 페이지로 이동 시도
  const navigateToShop = (e: React.MouseEvent) => {
    e.preventDefault();
    
    console.log("ShopAccess: 쇼핑 페이지로 이동 시도");
    
    try {
      // 1. 직접 URL 이동 (가장 확실한 방법)
      window.location.href = "/shop";
      
      // 아래는 백업 방법들로, 위 방법이 실패할 경우 사용됨
      
      // 2. History API 사용하여 이동
      // window.history.pushState({}, '', '/shop');
      // window.dispatchEvent(new PopStateEvent('popstate'));
      
      // 3. 대체 URL 패턴 사용
      // window.location.href = "/shop-simple";
      
      // 4. 절대 URL 사용
      // window.location.href = window.location.origin + "/shop";
    } catch (error) {
      console.error("쇼핑 페이지 이동 오류:", error);
      
      // 실패 시 대체 방법으로 이동
      try {
        window.location.replace("/shop");
      } catch (e) {
        console.error("대체 이동 방법도 실패:", e);
        alert("쇼핑 페이지 접근 실패. 다시 시도해주세요.");
      }
    }
  };
  
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800">
      <div className="flex items-center mb-4">
        <ShoppingBag className="w-8 h-8 text-primary mr-3" />
        <h2 className="text-xl font-bold">쇼핑 페이지 바로가기</h2>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        다양한 반려견 용품과 특별 할인 상품을 만나보세요!
      </p>
      
      <div className="flex space-x-3">
        <button
          onClick={navigateToShop}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          쇼핑 시작하기
        </button>
        
        <a 
          href="/shop"
          className="px-4 py-2 bg-white text-primary border border-primary rounded-lg hover:bg-gray-50 transition-colors"
        >
          일반 링크로 이동
        </a>
      </div>
    </div>
  );
}