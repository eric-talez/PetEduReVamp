import { Switch, Route, useLocation } from "wouter";
import { AppLayout } from "./layout/AppLayout";
import Dashboard from "@/pages/dashboard";
import Home from "./pages/Home";
import Courses from "@/pages/courses";
import Trainers from "@/pages/trainers";
import Institutes from "@/pages/institutes";
import Community from "@/pages/community";
import MyCourses from "@/pages/my-courses";
import MyPets from "@/pages/my-pets";
import Login from "@/pages/auth/login";
import NotFound from "@/pages/not-found";
import LocationsPage from "./pages/locations";
import VideoCallPage from "./pages/video-call";
import MessagesPage from "./pages/messages";
import AdminCommissionPage from "./pages/admin/commission";
import AdminMenuConfigPage from "./pages/admin/menu-config";
import AdminSettlementPage from "./pages/admin/settlement";
import { useState, useEffect, createContext, useContext } from "react";

// 인증된 사용자용 라우트
function AuthenticatedRoutes() {
  const auth = useAppAuth();
  const userRole = auth.userRole;
  
  // 역할에 따라 홈 경로를 다르게 처리
  const getHomeComponent = () => {
    switch(userRole) {
      case 'pet-owner':
        return <Dashboard />;
      case 'trainer':
        return <div className="p-8"><h1 className="text-2xl font-bold mb-4">훈련사 홈</h1><p>훈련사 전용 홈 페이지입니다.</p></div>;
      case 'institute-admin':
        return <div className="p-8"><h1 className="text-2xl font-bold mb-4">기관 관리자 홈</h1><p>기관 관리자 전용 홈 페이지입니다.</p></div>;
      case 'admin':
        return <div className="p-8"><h1 className="text-2xl font-bold mb-4">시스템 관리자 홈</h1><p>시스템 관리자 전용 홈 페이지입니다.</p></div>;
      default:
        return <Home />;
    }
  };
  
  return (
    <AppLayout>
      <Switch>
        {/* 역할별 메인 페이지 (각 역할의 홈) */}
        <Route path="/">
          {() => getHomeComponent()}
        </Route>
        <Route path="/dashboard" component={Dashboard} /> {/* 견주 회원의 대시보드 */}
        <Route path="/dashboard/trainer" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">훈련사 대시보드</h1><p>훈련사를 위한 대시보드입니다.</p></div>} />
        <Route path="/dashboard/institute" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">기관 관리자 대시보드</h1><p>기관 관리자를 위한 대시보드입니다.</p></div>} />
        <Route path="/dashboard/admin" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">시스템 관리자 대시보드</h1><p>시스템 관리자를 위한 대시보드입니다.</p></div>} />
        
        {/* 일반 메뉴 */}
        <Route path="/courses" component={Courses} />
        <Route path="/trainers" component={Trainers} />
        <Route path="/institutes" component={Institutes} />
        <Route path="/community" component={Community} />
        <Route path="/my-courses" component={MyCourses} />
        <Route path="/my-pets" component={MyPets} />
        <Route path="/video-training" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">영상 훈련</h1><p>영상으로 진행하는 훈련 컨텐츠를 볼 수 있는 페이지입니다.</p></div>} />
        <Route path="/video-call" component={VideoCallPage} />
        <Route path="/shop" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">쇼핑</h1><p>반려견 용품을 구매할 수 있는 쇼핑몰 페이지입니다.</p></div>} />
        <Route path="/notifications" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">알림장</h1><p>훈련사와 소통하고 훈련 진행상황을 확인할 수 있는 알림장 페이지입니다.</p></div>} />
        <Route path="/locations" component={LocationsPage} />
        <Route path="/recommendations" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">맞춤 추천</h1><p>반려견 프로필과 사용자 선호도 기반 맞춤형 추천 서비스 페이지입니다.</p></div>} />
        <Route path="/messages" component={MessagesPage} />
        
        {/* 관리자 메뉴 */}
        <Route path="/admin/commission" component={AdminCommissionPage} />
        <Route path="/admin/menu-config" component={AdminMenuConfigPage} />
        <Route path="/admin/settlement" component={AdminSettlementPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

// 비인증 사용자용 라우트
function UnauthenticatedRoutes() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/auth" component={Login} />
        <Route path="/courses" component={Courses} />
        <Route path="/trainers" component={Trainers} />
        <Route path="/institutes" component={Institutes} />
        <Route path="/community" component={Community} />
        <Route path="/" component={Home} />
        <Route path="/:rest*">
          {() => {
            window.location.href = "/auth";
            return null;
          }}
        </Route>
      </Switch>
    </AppLayout>
  );
}

// 인증 상태를 위한 타입 정의
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
  userName: string | null;
  logout: () => void;
}

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  isLoading: true,
  userRole: null,
  userName: null,
  logout: () => {}
});

// 인증 컨텍스트 훅
export function useAppAuth() {
  return useContext(AuthContext);
}

// 인증 상태 제공 컴포넌트
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 인증 상태 관리 (원래 App 컴포넌트에 있던 로직)
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userRole: null,
    userName: null,
    logout: () => {
      // 실제 API가 없으므로 localStorage에서 직접 정보를 삭제하고 이벤트 발생
      localStorage.removeItem('petedu_auth');
      console.log("Logging out: Removed auth data from localStorage");
      window.dispatchEvent(new CustomEvent('logout'));
    }
  });

  // 로컬 스토리지에서 인증 상태 확인
  useEffect(() => {
    console.log("AuthProvider useEffect - checking localStorage");
    const storedAuth = localStorage.getItem('petedu_auth');
    
    if (storedAuth) {
      try {
        console.log("Found auth data in localStorage:", storedAuth);
        const parsedAuth = JSON.parse(storedAuth);
        setAuthState({
          ...authState,
          isAuthenticated: true,
          isLoading: false,
          userRole: parsedAuth.role || 'user',
          userName: parsedAuth.user || 'User'
        });
        console.log("Updated auth state with stored data");
      } catch (e) {
        console.error('Failed to parse auth data', e);
        setAuthState({
          ...authState,
          isLoading: false
        });
      }
    } else {
      setAuthState({
        ...authState,
        isLoading: false
      });
    }

    // 로그인 이벤트 리스너 등록
    const handleLogin = (e: any) => {
      if (e.detail?.user) {
        setAuthState({
          ...authState,
          isAuthenticated: true,
          isLoading: false,
          userRole: e.detail.user.role || 'user',
          userName: e.detail.user.username || e.detail.user.name || 'User'
        });
        localStorage.setItem('petedu_auth', JSON.stringify({
          user: e.detail.user.username || e.detail.user.name,
          role: e.detail.user.role
        }));
      }
    };

    // 로그아웃 이벤트 리스너 등록
    const handleLogout = () => {
      setAuthState({
        ...authState,
        isAuthenticated: false,
        isLoading: false,
        userRole: null,
        userName: null
      });
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
}

// 메인 앱 컴포넌트
function App() {
  console.log("App component rendering");
  const auth = useAppAuth();
  
  console.log("Auth state in App:", auth);
  
  // 디버깅을 위한 테스트용 로그아웃 버튼 추가
  const handleClearAuth = () => {
    console.log("Clear auth data manually");
    localStorage.removeItem('petedu_auth');
    window.location.reload();
  };
  
  if (auth.isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // 디버깅용 오버레이 버튼 추가
  const DebugButton = () => (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      <button
        onClick={handleClearAuth}
        style={{ 
          padding: '10px 15px',
          backgroundColor: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Reset Auth (Debug)
      </button>
    </div>
  );
  
  return (
    <>
      {auth.isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
      <DebugButton />
    </>
  );
}

export default App;
