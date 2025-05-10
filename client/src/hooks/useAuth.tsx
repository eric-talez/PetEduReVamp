import { createContext, ReactNode, useContext, useState, useEffect } from "react";

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

  // 컴포넌트 마운트 시 즉시 로컬 스토리지에서 인증 상태 확인
  useEffect(() => {
    const storedAuth = localStorage.getItem('petedu_auth');
    
    // 즉시 실행되도록 별도 함수로 분리
    const initAuthState = () => {
      if (storedAuth) {
        try {
          const parsedAuth = JSON.parse(storedAuth);
          
          // setAuthState 함수를 직접 호출하지 않고 초기값으로 설정
          const updatedState = {
            isAuthenticated: true,
            isLoading: false,
            userRole: parsedAuth.role || 'user',
            userName: parsedAuth.user || 'User',
            logout: authState.logout
          };
          
          setAuthState(updatedState);
        } catch (e) {
          console.error('저장된 인증 정보 파싱 오류:', e);
          localStorage.removeItem('petedu_auth');
        }
      } else {
        setAuthState(prevState => ({
          ...prevState,
          isLoading: false
        }));
      }
    };
    
    // 함수 즉시 실행
    initAuthState();
  }, []);
  
  // 이벤트 리스너 등록/제거
  useEffect(() => {
    // 메시지 이벤트 처리 핸들러
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'login' && event.data?.user) {
        const user = event.data.user;
        console.log("Message received with user:", user);
        
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
    };
    
    // 이벤트 리스너 등록
    window.addEventListener('message', handleMessage);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  
  // 글로벌 변수에 인증 상태 저장 (디버깅용)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__peteduAuthState = {
        isAuthenticated: authState.isAuthenticated,
        userRole: authState.userRole,
        userName: authState.userName
      };
    }
  }, [authState]);

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