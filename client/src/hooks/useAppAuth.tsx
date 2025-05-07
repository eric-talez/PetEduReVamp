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
  const context = useContext(AuthContext);
  console.log("useAppAuth hook called, returning:", context);
  return context;
};

// 인증 상태 제공자 컴포넌트
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  console.log("AuthProvider component rendering");
  
  // 초기 상태 설정 - 로컬 스토리지에서 값을 가져와 초기화
  const getInitialState = (): AuthState => {
    console.log("Getting initial auth state");
    try {
      const storedAuth = localStorage.getItem('petedu_auth');
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        console.log("Initial state from localStorage:", parsedAuth);
        return {
          isAuthenticated: true,
          isLoading: false,
          userRole: parsedAuth.role || 'user',
          userName: parsedAuth.user || 'User',
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
              
              window.dispatchEvent(new CustomEvent('logout'));
            } catch (error) {
              console.error('Logout error:', error);
              window.dispatchEvent(new CustomEvent('logout'));
            }
          }
        };
      }
    } catch (e) {
      console.error("Error parsing initial auth state:", e);
    }
    
    // 기본값은 로그인하지 않은 상태, 로딩 완료
    return {
      isAuthenticated: false,
      isLoading: false, // 초기값을 false로 설정
      userRole: null,
      userName: null,
      logout: async () => {
        window.dispatchEvent(new CustomEvent('logout'));
      }
    };
  };
  
  // 인증 상태 관리
  const [authState, setAuthState] = useState<AuthState>(getInitialState);

  // 이벤트 리스너만 설정하고 초기 상태는 getInitialState에서 처리
  useEffect(() => {
    console.log("Setting up auth event listeners");

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