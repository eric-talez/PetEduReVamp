import { useEffect } from 'react';
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
    setLocation(to);
  }, [to, setLocation]);
  
  return null;
}