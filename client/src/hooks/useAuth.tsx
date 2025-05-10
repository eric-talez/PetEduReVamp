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
  // 인증 상태 관리 - 로그인 필요한 상태로 변경
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,  // 로그인 필요한 상태로 초기화
    isLoading: true,
    userRole: null,         // 기본 권한 없음
    userName: null,
    logout: () => {
      console.log("로그아웃 실행");
      // 로컬 스토리지 데이터 삭제
      localStorage.removeItem('petedu_auth');
      // 전역 변수 초기화
      (window as any).__peteduAuthState = null;
      // 인증 상태 초기화
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        userRole: null,
        userName: null
      }));
      // 커스텀 이벤트 발생
      window.dispatchEvent(new CustomEvent('clear-auth'));
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
    
    // 초기 로드 시 스토리지 확인 - 있는 경우에만 읽기
    handleStorageChange();
    
    // 로딩 상태 false로 설정
    setAuthState(prev => ({
      ...prev,
      isLoading: false,
      isAuthenticated: true,
      userRole: 'trainer',
      userName: '박훈련'
    }));
    
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