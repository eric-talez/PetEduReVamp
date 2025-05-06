import { createContext, useContext, ReactNode, useState, useEffect } from "react";

// 인증 상태 타입 정의
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
  userName: string | null;
  logout: () => void;
}

// 인증 상태를 전역으로 확인하기 위한 컨텍스트
export const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  isLoading: true,
  userRole: null,
  userName: null,
  logout: () => {}
});

// 인증 컨텍스트 사용을 위한 커스텀 훅
export const useAppAuth = () => {
  return useContext(AuthContext);
};

// 인증 상태 제공자 컴포넌트
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 인증 상태 관리
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userRole: null,
    userName: null,
    logout: async () => {
      try {
        // 서버 로그아웃 API 호출
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin'
        });
        
        if (response.ok) {
          // 로그아웃 이벤트 디스패치
          window.dispatchEvent(new CustomEvent('logout'));
        } else {
          console.error('Logout failed:', await response.text());
          // 실패하더라도 클라이언트 측에서는 로그아웃 처리
          window.dispatchEvent(new CustomEvent('logout'));
        }
      } catch (error) {
        console.error('Logout error:', error);
        // 오류 발생시에도 클라이언트 측에서는 로그아웃 처리
        window.dispatchEvent(new CustomEvent('logout'));
      }
    }
  });

  // 로컬 스토리지에서 인증 상태 확인
  useEffect(() => {
    const storedAuth = localStorage.getItem('petedu_auth');
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setAuthState(prevState => ({
          ...prevState,
          isAuthenticated: true,
          isLoading: false,
          userRole: parsedAuth.role || 'user',
          userName: parsedAuth.user || 'User'
        }));
      } catch (e) {
        console.error('Failed to parse auth data', e);
        setAuthState(prevState => ({
          ...prevState,
          isLoading: false
        }));
      }
    } else {
      setAuthState(prevState => ({
        ...prevState,
        isLoading: false
      }));
    }

    // 로그인 이벤트 리스너 등록
    const handleLogin = (e: any) => {
      if (e.detail?.user) {
        setAuthState(prevState => ({
          ...prevState,
          isAuthenticated: true,
          isLoading: false,
          userRole: e.detail.user.role || 'user',
          userName: e.detail.user.username || e.detail.user.name || 'User'
        }));
        localStorage.setItem('petedu_auth', JSON.stringify({
          user: e.detail.user.username || e.detail.user.name,
          role: e.detail.user.role
        }));
      }
    };

    // 로그아웃 이벤트 리스너 등록
    const handleLogout = () => {
      setAuthState(prevState => ({
        ...prevState,
        isAuthenticated: false,
        isLoading: false,
        userRole: null,
        userName: null
      }));
      localStorage.removeItem('petedu_auth');
    };

    window.addEventListener('login', handleLogin);
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('login', handleLogin);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};