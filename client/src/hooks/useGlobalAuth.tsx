/**
 * useGlobalAuth.tsx
 * 
 * 전역 인증 상태 관리 훅
 * - 모든 컴포넌트에서 일관된 인증 상태 접근
 * - React 컴포넌트 생명주기와 통합
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { authStore, type AuthState } from '@/lib/global-auth-store';
import { useToast } from './use-toast';
import type { UserRole } from '@shared/schema';

// 인증 훅 반환 타입 (원래 useAuth 훅과 호환)
interface UseGlobalAuthReturn extends AuthState {
  isLoading: boolean;
  logout: () => void;
  login: (role: UserRole, name: string, redirect?: boolean) => void;
  updateUserInfo: (userInfo: { name?: string; email?: string; phone?: string; bio?: string; location?: string; avatar?: string }) => Promise<boolean>;
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
  
  // 사용자 정보 업데이트 함수
  const updateUserInfo = useCallback(async (userInfo: { 
    name?: string; 
    email?: string;
    phone?: string;
    bio?: string;
    location?: string;
    avatar?: string;
  }): Promise<boolean> => {
    try {
      // API로 사용자 정보 업데이트 요청
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키를 포함하여 인증 세션 유지
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        throw new Error('프로필 정보 업데이트에 실패했습니다');
      }

      const updatedUser = await response.json();
      
      // 이름이 업데이트되었으면 전역 상태도 업데이트
      if (userInfo.name && userInfo.name !== authState.userName) {
        // 인증 상태 부분 업데이트 (이름만 변경)
        if (authState.userRole) {
          authStore.login(authState.userRole, userInfo.name);
        }
      }

      toast({
        title: "프로필 업데이트 성공",
        description: "회원 정보가 성공적으로 업데이트되었습니다.",
        variant: "default",
      });
      
      return true;
    } catch (error) {
      console.error('사용자 정보 업데이트 오류:', error);
      
      toast({
        title: "프로필 업데이트 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
      
      return false;
    }
  }, [authState.userName, authState.userRole, toast]);

  // 모든 반환값 병합
  const returnValue = useMemo(() => ({
    ...authState,
    isLoading,
    login,
    logout,
    updateUserInfo
  }), [authState, isLoading, login, logout, updateUserInfo]);
  
  return returnValue;
}

// 초기화 함수도 내보내기
export { initGlobalAuthListener } from '@/lib/global-auth-store';