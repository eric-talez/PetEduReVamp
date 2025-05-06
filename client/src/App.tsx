import { Switch, Route } from "wouter";
import { AppLayout } from "./layout/AppLayout";
import Dashboard from "@/pages/dashboard";
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
import { useContext, createContext, useEffect, useState } from "react";

// 인증 상태를 전역으로 확인하기 위한 심플한 컨텍스트
const AuthContext = createContext<{
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
}>({
  isAuthenticated: false,
  isLoading: true,
  userRole: null
});

export function useAppAuth() {
  return useContext(AuthContext);
}

// 인증된 사용자용 라우트
function AuthenticatedRoutes() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
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
    <Switch>
      <Route path="/auth" component={Login} />
      <Route path="/courses" component={Courses} />
      <Route path="/trainers" component={Trainers} />
      <Route path="/institutes" component={Institutes} />
      <Route path="/community" component={Community} />
      <Route path="/:rest*">
        {() => {
          window.location.href = "/auth";
          return null;
        }}
      </Route>
    </Switch>
  );
}

// 테스트를 위해 초기 상태는 비인증으로 설정
function App() {
  // 개발 환경을 위한 임시 상태 관리
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: false,
    userRole: null as string | null
  });

  // 로컬 스토리지에서 인증 상태 확인
  useEffect(() => {
    const storedAuth = localStorage.getItem('petedu_auth');
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          userRole: parsedAuth.role || 'user'
        });
      } catch (e) {
        console.error('Failed to parse auth data', e);
      }
    }

    // 로그인 이벤트 리스너 등록
    const handleLogin = (e: any) => {
      if (e.detail?.user) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          userRole: e.detail.user.role || 'user'
        });
        localStorage.setItem('petedu_auth', JSON.stringify({
          user: e.detail.user.username,
          role: e.detail.user.role
        }));
      }
    };

    // 로그아웃 이벤트 리스너 등록
    const handleLogout = () => {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        userRole: null
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

  if (authState.isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={authState}>
      {authState.isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
    </AuthContext.Provider>
  );
}

export default App;
