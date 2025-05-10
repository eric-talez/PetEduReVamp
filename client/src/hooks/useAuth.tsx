import { createContext, ReactNode, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { SimpleDogLoading } from '@/components/SimpleDogLoading';

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

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  isLoading: true,
  userRole: null,
  userName: null,
  logout: () => {},
});

/**
 * 인증 상태 제공 컴포넌트
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // 인증 상태 관리
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userRole: null,
    userName: null,
    logout: () => {
      localStorage.removeItem('petedu_auth');
      setAuthState(prevState => ({
        ...prevState,
        isAuthenticated: false,
        userRole: null,
        userName: null
      }));
      
      // 로그아웃 후 인증 페이지로 리다이렉트
      window.location.href = "/auth";
    }
  });

  // 초기화 로직을 useMemo로 최적화하여 불필요한 재계산 방지
  const initAuthState = useCallback(() => {
    const storedAuth = localStorage.getItem('petedu_auth');
    
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        
        // 상태 업데이트
        setAuthState(prevState => ({
          ...prevState,
          isAuthenticated: true,
          isLoading: false,
          userRole: parsedAuth.role || 'user',
          userName: parsedAuth.user || 'User'
        }));
      } catch (e) {
        console.error('저장된 인증 정보 파싱 오류:', e);
        localStorage.removeItem('petedu_auth');
        
        // 에러 발생 시 로딩 상태 해제
        setAuthState(prevState => ({
          ...prevState,
          isLoading: false
        }));
      }
    } else {
      // 인증 정보가 없는 경우 로딩 상태만 해제
      setAuthState(prevState => ({
        ...prevState,
        isLoading: false
      }));
    }
  }, []);
  
  // 컴포넌트 마운트 시 한 번만 실행
  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window !== 'undefined') {
      initAuthState();
    }
  }, [initAuthState]);
  
  // 메시지 이벤트 처리 핸들러를 메모이제이션하여 불필요한 재생성 방지
  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === 'login' && event.data?.user) {
      const user = event.data.user;
      
      // 로그인 처리
      const username = user.username || user.name || 'User';
      const role = user.role || 'user';
      
      // 로컬 스토리지에 저장
      localStorage.setItem('petedu_auth', JSON.stringify({
        user: username,
        role: role
      }));
      
      // 상태 업데이트
      setAuthState(prevState => ({
        ...prevState,
        isAuthenticated: true,
        isLoading: false,
        userRole: role as UserRole,
        userName: username
      }));
    }
  }, []);
  
  // 이벤트 리스너 등록/제거
  useEffect(() => {
    // 이벤트 리스너 등록
    window.addEventListener('message', handleMessage);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]); // 의존성 배열에 메모이제이션된 핸들러만 포함
  
  // 글로벌 변수에 인증 상태 저장 (디버깅용) - 메모이제이션 적용
  const syncGlobalState = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.__peteduAuthState = {
        isAuthenticated: authState.isAuthenticated,
        userRole: authState.userRole,
        userName: authState.userName
      };
    }
  }, [authState.isAuthenticated, authState.userRole, authState.userName]);
  
  // 의존성 최적화를 위해 별도 useEffect로 분리
  useEffect(() => {
    syncGlobalState();
  }, [syncGlobalState]);

  // 로딩 중일 때 강아지 로딩 애니메이션 표시
  // isLoading 상태를 컨텍스트로 전달하여 컴포넌트에서 처리하도록 개선
  // 중앙에서 직접 렌더링하지 않음으로써 이중 렌더링 문제 방지

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
  return useContext(AuthContext);
}

// 디버깅을 위한 전역 변수 타입 정의
declare global {
  interface Window {
    __peteduAuthState?: {
      isAuthenticated: boolean;
      userRole: string | null;
      userName: string | null;
    };
  }
}