import React, { useEffect, useState } from "react";
import { ShoppingCart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// 플로팅 장바구니 버튼 컴포넌트
export function FloatingCartButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasItems, setHasItems] = useState(false);

  useEffect(() => {
    // 스크롤 이벤트 핸들러 - 스크롤 시 버튼을 표시
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // 장바구니 상태 확인 (실제 구현에서는 API 호출 또는 전역 상태 사용)
    // 데모 목적으로 랜덤하게 장바구니 상태 설정
    const checkCartStatus = () => {
      // 실제 구현에서는 API 호출 또는 전역 상태에서 장바구니 상태 가져오기
      setHasItems(Math.random() > 0.5); // 데모용 랜덤 상태
    };

    // 초기 실행 및 이벤트 리스너 설정
    handleScroll();
    checkCartStatus();

    window.addEventListener("scroll", handleScroll);
    
    // 1분마다 장바구니 상태 확인 (실제 구현에서는 웹소켓 또는 다른 방법 사용)
    const intervalId = setInterval(checkCartStatus, 60000);

    // 클린업 함수
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(intervalId);
    };
  }, []);

  // 쇼핑몰로 이동하는 핸들러
  const handleOpenShop = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // 버튼에 간단한 애니메이션 효과 추가
    const target = e.currentTarget as HTMLElement;
    target.classList.add("scale-110");
    
    // 현재 인증 상태 확인
    const authState = window.__peteduAuthState || {
      isAuthenticated: false,
      userRole: null,
      userName: null
    };
    
    // 인증 정보를 URL 파라미터로 전달
    let shopUrl = 'https://store.funnytalez.com/';
    
    // 인증된 사용자인 경우에만 정보 전달
    if (authState.isAuthenticated && authState.userName) {
      const params = new URLSearchParams({
        auth: 'true',
        role: authState.userRole || 'pet-owner',
        name: authState.userName
      });
      shopUrl += '?' + params.toString();
    }
    
    console.log("FloatingCartButton 쇼핑몰 URL:", shopUrl);
    
    setTimeout(() => {
      target.classList.remove("scale-110");
      // 쇼핑몰 새 창에서 열기
      window.open(shopUrl, "_blank", "noopener,noreferrer");
    }, 200);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="default"
              className={`rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 ${
                hasItems ? "bg-primary hover:bg-primary/90" : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
              onClick={handleOpenShop}
              aria-label="쇼핑몰 장바구니 바로가기"
            >
              <ShoppingCart className={`h-6 w-6 ${hasItems ? "text-white" : "text-gray-600 dark:text-gray-300"}`} />
              <ExternalLink className="absolute top-0 right-0 w-3 h-3 text-white" />
              {hasItems && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center animate-pulse">
                  !
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-white dark:bg-gray-900 p-2 rounded shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm">쇼핑몰 바로가기 (새 창)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}