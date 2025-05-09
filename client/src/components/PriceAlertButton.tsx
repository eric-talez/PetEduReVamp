import React from 'react';
import { useAuth } from '../SimpleApp';

/**
 * 가격 알림 버튼 컴포넌트
 * - 상품 상세 페이지나 다른 곳에서 사용할 수 있는 가격 알림 설정 버튼
 * - 클릭 시 가격 알림 페이지로 이동하거나 모달 표시
 */
export function PriceAlertButton({ productId, productName, currentPrice }: {
  productId: number;
  productName: string;
  currentPrice: number;
}) {
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (!isAuthenticated) {
      // 비로그인 시 로그인 페이지로 유도 또는 간편 로그인 모달 표시
      alert('가격 알림을 설정하려면 로그인이 필요합니다.');
      return;
    }

    // 가격 알림 페이지로 이동하면서 상품 정보 전달
    window.location.href = `/price-alert.html?productId=${productId}&name=${encodeURIComponent(productName)}&price=${currentPrice}`;
  };

  return (
    <button 
      onClick={handleClick}
      className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
      </svg>
      가격 알림 설정
    </button>
  );
}