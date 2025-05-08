import React, { useEffect } from 'react';

export default function ShopRedirect() {
  useEffect(() => {
    console.log("ShopRedirect 컴포넌트 마운트");
    console.log("현재 URL:", window.location.href);
    console.log("origin:", window.location.origin);
    
    // 0.5초 후 리다이렉트 실행
    const timer = setTimeout(() => {
      // 원하는 경로
      const targetPath = '/shop';
      const targetUrl = window.location.origin + targetPath;
      
      console.log("리다이렉트 실행:", targetUrl);
      window.location.href = targetUrl;
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">쇼핑 페이지로 이동 중...</h1>
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}