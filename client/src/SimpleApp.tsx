import { Switch, Route } from "wouter";
import { RedirectHandler } from './components/RedirectHandler';
import React, { ReactNode, lazy, Suspense } from "react";
import { useAuth, AuthProvider } from './hooks/useAuth';
import { Button } from "@/components/ui/Button";
import { SimpleDogLoading } from './components/SimpleDogLoading';

// 이전 버전과의 호환성을 위한 재내보내기
export { useAuth, AuthProvider } from './hooks/useAuth';

// 페이지 컴포넌트 임포트
import Home from "./pages/Home";
import Dashboard from "@/pages/dashboard";
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";
import Trainers from "@/pages/trainers";

// UI 컴포넌트
import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";

/**
 * 훈련사 전용 경로에 대한 권한 검증 컴포넌트
 */
function ProtectedTrainerRoute({ component: Component, fallback = <div className="p-8 text-center">접근 권한이 없습니다</div> }: {
  component: React.ComponentType;
  fallback?: React.ReactNode;
}) {
  const { userRole } = useAuth();
  
  if (userRole !== 'trainer' && userRole !== 'admin') {
    return <>{fallback}</>;
  }
  
  return <Component />;
}

/**
 * 응용 프로그램 레이아웃 컴포넌트
 */
function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const auth = useAuth();
  
  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <div className="flex">
        {/* 사이드바 */}
        <Sidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          userRole={auth.userRole}
          isAuthenticated={auth.isAuthenticated}
        />
        
        {/* 메인 콘텐츠 */}
        <div className="flex-1">
          <TopBar 
            sidebarOpen={sidebarOpen} 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          />
          <main className="p-0">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

/**
 * 인증된 사용자를 위한 라우트
 */
function AuthenticatedRoutes() {
  const { userRole } = useAuth();
  
  // 역할에 따라 홈 컴포넌트 다르게 처리
  const getHomeComponent = () => {
    switch(userRole) {
      case 'pet-owner':
        return <Dashboard />;
      case 'trainer':
        const TrainerHome = lazy(() => import('./pages/trainer/TrainerHome'));
        return <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
          <TrainerHome />
        </Suspense>;
      case 'institute-admin':
        const InstituteAdminHome = lazy(() => import('./pages/institute-admin/InstituteAdminHome'));
        return <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
          <InstituteAdminHome />
        </Suspense>;
      case 'admin':
        return <div className="p-8"><h1 className="text-2xl font-bold mb-4">관리자 대시보드</h1><p>시스템 관리자를 위한 대시보드입니다.</p></div>;
      default:
        return <Home />;
    }
  };
  
  return (
    <AppLayout>
      <Switch>
        {/* 메인 경로 */}
        <Route path="/" component={() => getHomeComponent()} />
        <Route path="/courses" component={Courses} />
        <Route path="/course/:id" component={CourseDetail} />
        <Route path="/trainers" component={Trainers} />
        <Route path="/institute" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">기관 정보</h1><p>기관 정보 페이지입니다.</p></div>} />
        <Route path="/membership" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">멤버십</h1><p>멤버십 정보 페이지입니다.</p></div>} />
        
        {/* 훈련사 메뉴 */}
        <Route path="/trainer/courses">
          {() => {
            const TrainerCourses = lazy(() => import('./pages/trainer/courses'));
            return (
              <Suspense fallback={<div className="p-8 text-center">페이지 로딩 중...</div>}>
                <ProtectedTrainerRoute component={TrainerCourses} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/trainer/students">
          {() => {
            const StudentManagement = lazy(() => import('./pages/trainer/students'));
            return (
              <Suspense fallback={<div className="p-8 text-center">페이지 로딩 중...</div>}>
                <ProtectedTrainerRoute component={StudentManagement} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/trainer/stats">
          {() => {
            const TrainerStats = lazy(() => import('./pages/trainer/stats'));
            return (
              <Suspense fallback={<div className="p-8 text-center">페이지 로딩 중...</div>}>
                <ProtectedTrainerRoute component={TrainerStats} />
              </Suspense>
            );
          }}
        </Route>
        
        {/* 기관 관리자 메뉴 */}
        <Route path="/institute/trainers" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">훈련사 관리</h1><p>기관의 훈련사를 관리하는 페이지입니다.</p></div>} />
        <Route path="/institute/courses" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">교육과정 관리</h1><p>기관의 교육과정을 관리하는 페이지입니다.</p></div>} />
        <Route path="/institute/students" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">수강생 관리</h1><p>기관의 수강생을 관리하는 페이지입니다.</p></div>} />
        <Route path="/institute/stats" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">통계 및 수익</h1><p>기관의 통계와 수익을 확인하는 페이지입니다.</p></div>} />
        <Route path="/institute/settings" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">기관 설정</h1><p>기관의 설정을 관리하는 페이지입니다.</p></div>} />
        
        {/* 관리자 메뉴 */}
        <Route path="/admin/users" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">사용자 관리</h1><p>시스템 사용자를 관리하는 페이지입니다.</p></div>} />
        <Route path="/admin/institutes" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">기관 관리</h1><p>등록된 기관을 관리하는 페이지입니다.</p></div>} />
        <Route path="/admin/system" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">시스템 설정</h1><p>시스템 설정을 관리하는 페이지입니다.</p></div>} />
        
        {/* 공통 메뉴 */}
        <Route path="/profile" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">프로필</h1><p>사용자 프로필 페이지입니다.</p></div>} />
        <Route path="/settings" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">설정</h1><p>사용자 설정 페이지입니다.</p></div>} />
        
        {/* 찾을 수 없는 페이지 */}
        <Route>
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
            <p className="mb-4">요청하신 페이지가 존재하지 않습니다.</p>
            <Button onClick={() => window.location.href = "/"}>홈으로 돌아가기</Button>
          </div>
        </Route>
      </Switch>
    </AppLayout>
  );
}

/**
 * 비인증 사용자를 위한 라우트
 */
function UnauthenticatedRoutes() {
  return (
    <div className="min-h-screen">
      <Switch>
        <Route path="/auth">
          {() => {
            const Auth = lazy(() => import('./pages/auth.js'));
            return (
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><SimpleDogLoading /></div>}>
                <Auth />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/">
          <Home />
        </Route>
        <Route>
          <RedirectHandler to="/auth" />
        </Route>
      </Switch>
    </div>
  );
}

/**
 * 디버그 버튼 컴포넌트
 */
function DebugButton() {
  const { logout } = useAuth();
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black bg-opacity-80 p-2 rounded shadow-lg text-white text-sm">
      <div className="flex flex-col space-y-1">
        <button 
          onClick={() => {
            localStorage.setItem('petedu_auth', JSON.stringify({
              user: 'demo-user',
              role: 'pet-owner'
            }));
            window.location.reload();
          }}
          className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700"
        >
          일반 사용자 로그인
        </button>
        <button 
          onClick={() => {
            localStorage.setItem('petedu_auth', JSON.stringify({
              user: 'demo-trainer',
              role: 'trainer'
            }));
            window.location.reload();
          }}
          className="px-2 py-1 bg-green-600 rounded hover:bg-green-700"
        >
          훈련사 로그인
        </button>
        <button 
          onClick={() => {
            localStorage.setItem('petedu_auth', JSON.stringify({
              user: 'demo-admin',
              role: 'institute-admin'
            }));
            window.location.reload();
          }}
          className="px-2 py-1 bg-purple-600 rounded hover:bg-purple-700"
        >
          기관 관리자 로그인
        </button>
        <button 
          onClick={() => {
            localStorage.setItem('petedu_auth', JSON.stringify({
              user: 'admin',
              role: 'admin'
            }));
            window.location.reload();
          }}
          className="px-2 py-1 bg-red-600 rounded hover:bg-red-700"
        >
          시스템 관리자 로그인
        </button>
        <button 
          onClick={() => logout()}
          className="px-2 py-1 bg-gray-600 rounded hover:bg-gray-700"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

/**
 * 메인 애플리케이션 컴포넌트
 */
function SimpleApp() {
  const auth = useAuth();
  
  // 로딩 상태 처리 - 강아지 테마 로딩 애니메이션 적용
  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20">
            {/* 몸통 */}
            <div className="absolute top-0 left-0 w-full h-full animate-wiggle origin-bottom">
              <div className="bg-primary rounded-full w-16 h-16 mx-auto"></div>
              <div className="bg-primary h-10 w-5 absolute top-10 left-1/2 -ml-2.5 rounded-b-full"></div>
            </div>
            
            {/* 귀 */}
            <div className="absolute top-0 w-full">
              <div className="relative mx-auto w-16">
                <div className="absolute left-1 top-0 w-5 h-6 bg-primary rounded-tl-full transform -rotate-12"></div>
                <div className="absolute right-1 top-0 w-5 h-6 bg-primary rounded-tr-full transform rotate-12"></div>
              </div>
            </div>
            
            {/* 꼬리 */}
            <div className="absolute right-1 top-6 w-4 h-5 bg-primary rounded-full animate-bounce-tail origin-top"></div>
            
            {/* 얼굴 */}
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-5">
                <div className="bg-white w-2.5 h-2.5 rounded-full animate-blink"></div>
                <div className="bg-white w-2.5 h-2.5 rounded-full animate-blink"></div>
              </div>
              <div className="mt-3 bg-white w-4 h-1.5 mx-auto rounded-full"></div>
            </div>
          </div>
          <p className="mt-4 text-primary font-medium">로딩 중...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {auth.isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
      {process.env.NODE_ENV === 'development' && <DebugButton />}
    </>
  );
}

// 최종 내보내기 - main.tsx에서는 이미 AuthProvider를 사용 중이므로 SimpleApp을 직접 내보냄
export default SimpleApp;