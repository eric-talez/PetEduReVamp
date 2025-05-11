// useAuth.tsx
// 인증 관련 기능을 모듈화한 파일
// Fast Refresh 호환성을 위해 named export 방식 사용

import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// shared/schema.ts의 UserRole 타입 사용 (타입 일관성 유지)
import { UserRole } from '@shared/schema';

// 상수로도 제공 (상호 참조 문제 해결)
export const USER_ROLES = {
  USER: 'user' as UserRole,
  PET_OWNER: 'pet-owner' as UserRole,
  TRAINER: 'trainer' as UserRole,
  INSTITUTE_ADMIN: 'institute-admin' as UserRole,
  ADMIN: 'admin' as UserRole
};

// 인증 상태 인터페이스
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: UserRole | null;
  userName: string | null;
  logout: () => void;
}

// 기본 인증 상태
const defaultAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  userRole: null,
  userName: null,
  logout: () => {},
};

// Fast Refresh를 위한 확실한 분리: 인증 컨텍스트 생성
export const AuthContext = createContext<AuthState>(defaultAuthState);

// Fast Refresh를 위한 일관된 훅 정의 (named function)
export const useAuth = () => useContext(AuthContext);

/**
 * 인증 상태 제공 컴포넌트
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userRole: null,
    userName: null,
    logout: () => {
      try {
        localStorage.removeItem('petedu_auth');
        window.dispatchEvent(new CustomEvent('logout'));
        
        // 로그아웃 성공 알림
        toast({
          title: "로그아웃 성공",
          description: "성공적으로 로그아웃되었습니다.",
          variant: "default",
        });
        
        window.location.href = "/auth";
      } catch (error) {
        console.error("로그아웃 중 오류 발생:", error);
        
        // 로그아웃 실패 알림
        toast({
          title: "로그아웃 실패",
          description: "로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.",
          variant: "destructive",
        });
      }
    }
  });

  // 로깅 유틸리티 함수
  const logAuthEvent = (event: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Auth] ${event}`, data ? data : '');
    }
  };

  // 인증 상태 업데이트 유틸리티 함수
  const updateAuthState = (isAuthenticated: boolean, role: UserRole | null, name: string | null) => {
    setAuthState(prev => ({
      ...prev,
      isAuthenticated,
      isLoading: false,
      userRole: role, 
      userName: name
    }));
    
    // 전역 객체에 인증 상태 저장 (웹뷰 통신용)
    window.__peteduAuthState = {
      isAuthenticated,
      userRole: role,
      userName: name,
    };
    
    // 글로벌 이벤트 발행 - 모든 페이지에서 인증 상태 변경 감지
    const globalEvent = new CustomEvent('petedu-auth-changed', {
      detail: { isAuthenticated, userRole: role, userName: name }
    });
    window.dispatchEvent(globalEvent);
    
    logAuthEvent('상태 업데이트', { isAuthenticated, role, name });
  };

  /**
   * 인증 상태 관리 관련 
   * - 로컬 스토리지에서 인증 정보 로드 
   * - 이벤트 리스너 등록 및 해제
   */
  useEffect(() => {
    logAuthEvent('컴포넌트 마운트');
    
    // 인증 상태 초기화 함수 - 로컬 스토리지에서 데이터 로드
    const initAuthState = () => {
      const storedAuth = localStorage.getItem('petedu_auth');
      
      if (!storedAuth) {
        logAuthEvent('저장된 인증 정보 없음');
        updateAuthState(false, null, null);
        return;
      }
      
      try {
        const parsedAuth = JSON.parse(storedAuth);
        logAuthEvent('저장된 인증 정보 발견', parsedAuth);
        
        // 모든 가능한 키 이름 접근 방법 (역호환성 유지)
        const role = parsedAuth.role || parsedAuth.userRole || null;
        const name = parsedAuth.name || parsedAuth.userName || null;
        
        // 객체가 비어있지 않은지 확인
        if (parsedAuth && role) {
          // 모든 컴포넌트가 같은 정보를 사용하도록 표준화된 데이터 저장
          const standardAuthData = { 
            role, 
            name,
            userRole: role, // 역호환성을 위해 둘 다 저장
            userName: name  // 역호환성을 위해 둘 다 저장
          };
          
          // 로컬 스토리지에 표준화된 형식으로 다시 저장
          localStorage.setItem('petedu_auth', JSON.stringify(standardAuthData));
          
          // 인증 상태 업데이트
          updateAuthState(true, role, name);
        } else {
          logAuthEvent('저장된 인증 정보가 유효하지 않음', parsedAuth);
          localStorage.removeItem('petedu_auth');
          updateAuthState(false, null, null);
        }
      } catch (error) {
        // JSON 파싱 오류 시 인증 상태 초기화 및 알림
        console.error("인증 상태 파싱 오류:", error);
        localStorage.removeItem('petedu_auth');
        updateAuthState(false, null, null);
        
        toast({
          title: "인증 오류",
          description: "인증 정보가 손상되었습니다. 다시 로그인해주세요.",
          variant: "destructive",
        });
      }
    };
    
    // 즉시 초기화 실행
    initAuthState();
    
    /**
     * 로그인 처리를 위한 공통 함수
     * - 로컬 스토리지 업데이트
     * - 인증 상태 업데이트
     * - 성공 알림 표시
     * - 필요시 리다이렉션
     */
    const processLogin = (role: UserRole, name: string, shouldRedirect = false) => {
      try {
        // 로컬 스토리지 업데이트 - userRole과 userName 키도 동시에 저장하여 호환성 유지
        const authData = { 
          role, 
          name,
          userRole: role, // 역호환성을 위해 둘 다 저장
          userName: name  // 역호환성을 위해 둘 다 저장
        };
        localStorage.setItem('petedu_auth', JSON.stringify(authData));
        
        // 인증 상태 업데이트
        updateAuthState(true, role, name);
        
        // 로그인 성공 알림
        toast({
          title: "로그인 성공",
          description: `${name}님, 환영합니다!`,
          variant: "default",
        });
        
        // 리다이렉션이 필요한 경우에만 수행
        if (shouldRedirect) {
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
            
            logAuthEvent('역할 기반 리다이렉션', { role, redirectPath });
            window.location.href = redirectPath;
          }, 300);
        }
        
        return true;
      } catch (error) {
        console.error("로그인 처리 오류:", error);
        toast({
          title: "로그인 오류",
          description: "로그인 처리 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        return false;
      }
    };
    
    // 메시지 이벤트 리스너 등록
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'petedu-auth') {
        try {
          logAuthEvent('petedu-auth 메시지 수신', event.data);
          const { role, name } = event.data.data;
          processLogin(role, name);
        } catch (error) {
          console.error("메시지 처리 오류:", error);
          toast({
            title: "인증 오류",
            description: "메시지 처리 중 오류가 발생했습니다.",
            variant: "destructive",
          });
        }
      }
    };
    
    // 커스텀 이벤트 핸들러 등록
    const handleLogin = (e: Event) => {
      const customEvent = e as CustomEvent;
      logAuthEvent('login 이벤트 수신', customEvent.detail);
      
      if (customEvent.detail) {
        // 로그에서 확인된 데이터 구조에 맞게 처리
        const role = customEvent.detail.role || customEvent.detail.userRole;
        const name = customEvent.detail.name || customEvent.detail.userName;
        
        // 디버그 로그 추가
        console.log("로그인 처리 중:", { role, name });
        
        if (role && name) {
          processLogin(role, name, true); // 리다이렉션 필요
        } else {
          console.error("로그인 데이터 부족:", customEvent.detail);
        }
      }
    };
    
    // 로그아웃 이벤트 핸들러
    const handleLogout = () => {
      logAuthEvent('logout 이벤트 수신');
      updateAuthState(false, null, null);
    };
    
    // 이벤트 리스너 등록
    window.addEventListener('message', handleMessage);
    window.addEventListener('login', handleLogin as EventListener);
    window.addEventListener('petedu-login', handleLogin as EventListener);
    window.addEventListener('logout', handleLogout);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      logAuthEvent('컴포넌트 언마운트');
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('login', handleLogin as EventListener);
      window.removeEventListener('petedu-login', handleLogin as EventListener);
      window.removeEventListener('logout', handleLogout);
    };
  }, [toast]); // toast 의존성 추가
  
  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

// 글로벌 타입 확장 (Window 객체에 추가 프로퍼티 정의)
declare global {
  interface Window {
    __peteduAuthState?: {
      isAuthenticated: boolean;
      userRole: string | null;
      userName: string | null;
    };
  }
}