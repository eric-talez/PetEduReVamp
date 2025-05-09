import React, { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * 커스텀 리다이렉트 처리 컴포넌트
 * Wouter에서 Redirect 기능이 필요한 경우 사용
 */
interface RedirectHandlerProps {
  to: string;
}

export function RedirectHandler({ to }: RedirectHandlerProps) {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    console.log(`RedirectHandler: ${to}로 리다이렉트`);
    setLocation(to);
  }, [to, setLocation]);
  
  return (
    <div className="p-4 text-center">
      <p>리다이렉트 중...</p>
    </div>
  );
}