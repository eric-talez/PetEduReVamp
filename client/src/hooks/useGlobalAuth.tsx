/**
 * useGlobalAuth.tsx
 * 
 * 전역 인증 상태 관리 훅
 * - 모든 컴포넌트에서 일관된 인증 상태 접근
 * - React 컴포넌트 생명주기와 통합
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { authStore, type AuthState, type UserRole } from '@/lib/global-auth-store';
import { useToast } from './use-toast';

// 인증 훅 반환 타입 (원래 useAuth 훅과 호환)
interface UseGlobalAuthReturn extends AuthState {
  isLoading: boolean;
  logout: () => void;
  login: (role: UserRole, name: string, redirect?: boolean) => void;
}

/**
 * 전역 인증 상태를 React 컴포넌트에서 사용하기 위한 훅
 */
export function useGlobalAuth(): UseGlobalAuthReturn {
  const [authState, setAuthState] = useState<AuthState>(authStore.state);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // 상태 업데이트 함수
  const updateState = useCallback((newState: AuthState) => {
    setAuthState(newState);
    setIsLoading(false);
  }, []);
  
  // 초기 마운트 시 구독 설정
  useEffect(() => {
    // 전역 저장소에서 이벤트 구독
    const unsubscribe = authStore.subscribe(updateState);
    
    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      unsubscribe();
    };
  }, [updateState]);
  
  // 로그인 처리 함수
  const login = useCallback((role: UserRole, name: string, redirect = false) => {
    authStore.login(role, name);
    
    toast({
      title: "로그인 성공",
      description: `${name}님, 환영합니다!`,
      variant: "default",
    });
    
    // 필요한 경우 역할 기반 리다이렉션
    if (redirect) {
      setTimeout(() => {
        let redirectPath = '/';
        
        switch(role) {
          case 'pet-owner':
            redirectPath = '/dashboard';
            break;
          case 'trainer':
            redirectPath = '/trainer/dashboard';
            break;
          case 'institute-admin':
            redirectPath = '/institute/dashboard';
            break;
          case 'admin':
            redirectPath = '/admin/dashboard';
            break;
        }
        
        console.log('[GlobalAuth] 역할 기반 리다이렉션:', { role, redirectPath });
        window.location.href = redirectPath;
      }, 300);
    }
  }, [toast]);
  
  // 로그아웃 처리 함수
  const logout = useCallback(() => {
    authStore.logout();
    
    toast({
      title: "로그아웃 성공",
      description: "성공적으로 로그아웃되었습니다.",
      variant: "default",
    });
    
    // 로그아웃 후 홈으로 이동
    window.location.href = "/";
  }, [toast]);
  
  // 모든 반환값 병합
  const returnValue = useMemo(() => ({
    ...authState,
    isLoading,
    login,
    logout
  }), [authState, isLoading, login, logout]);
  
  return returnValue;
}

// 초기화 함수도 내보내기
export { initGlobalAuthListener } from '@/lib/global-auth-store';