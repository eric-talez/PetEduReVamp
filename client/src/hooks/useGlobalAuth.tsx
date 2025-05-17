import { useState, useEffect } from 'react';
import { authStore, type AuthState } from '@/lib/global-auth-store';
import type { UserRole } from '@shared/schema';

// 인증 훅 반환 타입 (원래 useAuth 훅과 호환)
export interface UseGlobalAuthReturn extends AuthState {
  isLoading: boolean;
  logout: () => void;
  login: (role: UserRole, name: string, redirect?: boolean) => void;
  updateUserInfo: (userInfo: { name?: string; email?: string }) => void;
}

// 전역 인증 상태 관리 훅
export function useGlobalAuth(): UseGlobalAuthReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [authState, setAuthState] = useState<AuthState>(authStore.state);
  
  useEffect(() => {
    // 인증 상태 변경 구독
    const unsubscribe = authStore.subscribe((newState) => {
      setAuthState(newState);
      setIsLoading(false);
    });
    
    // 구독 해제
    return () => {
      unsubscribe();
    };
  }, []);
  
  // 로그인 처리 함수
  const login = (role: UserRole, name: string, redirect = true) => {
    authStore.login(role, name);
    
    // 필요시 리다이렉션
    if (redirect) {
      window.location.href = '/';
    }
  };
  
  // 로그아웃 처리 함수
  const logout = () => {
    authStore.logout();
  };
  
  // 사용자 정보 업데이트 함수
  const updateUserInfo = (userInfo: { name?: string; email?: string }) => {
    // 현재 인증 상태 유지하면서 사용자 정보만 업데이트
    const updatedState: Partial<AuthState> = {};
    
    if (userInfo.name) {
      updatedState.userName = userInfo.name;
    }
    
    // 상태 업데이트
    authStore.setState(updatedState);
  };
  
  return {
    ...authState,
    isLoading,
    login,
    logout,
    updateUserInfo
  };
}

// 글로벌 인증 리스너 초기화 (한 번만 호출)
export function initGlobalAuthListener() {
  console.log('[GlobalAuth] 이벤트 리스너 초기화');
  // 실제 초기화는 authStore.ts에서 수행
}