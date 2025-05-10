import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";

// 사용자 역할 타입 정의
export type UserRole = 'user' | 'pet-owner' | 'trainer' | 'institute-admin' | 'admin';

// 인증 상태 인터페이스
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: UserRole | null;
  userName: string | null;
  logout: () => void;
}

// 컨텍스트 생성
const AuthContext = createContext<AuthState | null>(null);

/**
 * 인증 상태 제공 컴포넌트
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // 인증 상태 관리 - 간소화된 버전
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: true,  // 항상 인증된 상태로 유지 (개발 편의성)
    isLoading: false,
    userRole: 'trainer',    // 기본적으로 훈련사 권한 부여
    userName: '박훈련',
    logout: () => {
      console.log("로그아웃 실행");
      localStorage.removeItem('petedu_auth');
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        userRole: null,
        userName: null
      }));
      
      // 로그아웃 후 인증 페이지로 리다이렉트
      window.location.href = "/auth";
    }
  });

  // 로컬 스토리지 인증 정보 변경 처리 (디버그 메뉴에서 사용)
  useEffect(() => {
    // 로컬 스토리지 변경 이벤트 핸들러
    const handleStorageChange = () => {
      const storedAuth = localStorage.getItem('petedu_auth');
      
      if (storedAuth) {
        try {
          const authData = JSON.parse(storedAuth);
          console.log('인증 정보 변경됨:', authData);
          
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: true,
            userRole: authData.role || null,
            userName: authData.user || null
          }));
          
          // 전역 인증 상태 업데이트 (iframe 통신용)
          if (typeof window !== 'undefined') {
            window.__peteduAuthState = {
              isAuthenticated: true,
              userRole: authData.role || null,
              userName: authData.user || null
            };
          }
        } catch (error) {
          console.error('인증 정보 파싱 오류:', error);
        }
      } else {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: false,
          userRole: null,
          userName: null
        }));
        
        // 전역 인증 상태 업데이트 (iframe 통신용)
        if (typeof window !== 'undefined') {
          window.__peteduAuthState = {
            isAuthenticated: false,
            userRole: null,
            userName: null
          };
        }
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('storage', handleStorageChange);
    
    // 디버깅을 위한 초기 인증 정보 설정
    if (!localStorage.getItem('petedu_auth')) {
      localStorage.setItem('petedu_auth', JSON.stringify({
        user: '박훈련',
        role: 'trainer'
      }));
    }
    
    // 초기 로드 시 스토리지 확인
    handleStorageChange();
    
    // 전역 인증 상태 설정
    if (typeof window !== 'undefined') {
      window.__peteduAuthState = {
        isAuthenticated: true,
        userRole: 'trainer',
        userName: '박훈련'
      };
    }
    
    // 클린업 함수
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 인증 상태 훅
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// 전역 인터페이스 확장 (타입스크립트용)
declare global {
  interface Window {
    __peteduAuthState?: {
      isAuthenticated: boolean;
      userRole: string | null;
      userName: string | null;
    };
  }
}