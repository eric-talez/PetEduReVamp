import { Switch, Route } from "wouter";
import { RedirectHandler } from './components/RedirectHandler';
import React, { ReactNode, useState, useEffect, createContext, useContext, lazy, Suspense } from "react";

// 페이지 컴포넌트 임포트
import Home from "./pages/Home";
import Dashboard from "@/pages/dashboard";
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";
import Trainers from "@/pages/trainers";
import Institutes from "@/pages/institutes";
import Community from "@/pages/community";
import CommunityPostDetail from "@/pages/community/post-detail";
import MyCourses from "@/pages/my-courses";
import MyPets from "@/pages/my-pets";
import Login from "@/pages/auth/login";
import NotFound from "@/pages/not-found";
import VideoTrainingPage from "@/pages/video-training";
import LocationsPage from "./pages/locations";
import VideoCallPage from "./pages/video-call";
import MessagesPage from "./pages/messages";
import AdminCommissionPage from "./pages/admin/commission";
import AdminMenuConfigPage from "./pages/admin/menu-config";
import AdminSettlementPage from "./pages/admin/settlement";
import EventsPage from "./pages/events";
import EventDetailPage from "./pages/events/event-detail";
import EventCalendarPage from "./pages/events/calendar";

// 레이아웃 및 컴포넌트 임포트
import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";

/**
 * 인증 관련 타입 및 인터페이스
 */
export type UserRole = 'user' | 'pet-owner' | 'trainer' | 'institute-admin' | 'admin';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: UserRole | null;
  userName: string | null;
  logout: () => void;
}

// 디버깅을 위한 전역 변수 타입 정의
// Note: global 타입 선언은 중복되어 발생하는 문제가 있어서 일부 코드에서 사용한다면 주석으로 남겨둡니다
// declare global {
//   interface Window {
//     __peteduAuthState?: AuthState;
//   }
// }

const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  isLoading: true,
  userRole: null,
  userName: null,
  logout: () => {},
});

/**
 * 인증 상태 훅 - 별도 함수로 분리하여 Fast Refresh 호환성 개선
 */
// 고정 함수로 선언하여 Fast Refresh 호환성 유지
const useAuthContext = () => useContext(AuthContext);
export const useAuth = useAuthContext;

/**
 * 인증 상태 제공 컴포넌트
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userRole: null,
    userName: null,
    logout: () => {
      localStorage.removeItem('petedu_auth');
      window.dispatchEvent(new CustomEvent('logout'));
      // React-Router 또는 Wouter를 사용하는 방향으로 변경 필요
      // window.location.href = "/auth";
      // 임시적으로 window.location 사용
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
            logout: authState.logout // 기존 logout 함수 유지
          };
          
          setAuthState(updatedState);
          
          // 디버깅용 전역 변수 설정 - TypeScript 오류 수정
          (window as any).__peteduAuthState = updatedState;
        } catch (e) {
          console.error('Failed to parse auth data', e);
          setAuthState(prevState => ({
            ...prevState,
            isLoading: false
          }));
        }
      } else {
        console.log("No auth data found in localStorage");
        setAuthState(prevState => ({
          ...prevState,
          isLoading: false
        }));
      }
    };
    
    // 즉시 초기화 실행
    initAuthState();

    // 쇼핑 페이지 이동 메시지 이벤트 리스너
    const handleMessage = (event: MessageEvent) => {
      try {
        const message = event.data;
        
        if (message && message.type) {
          console.log("메시지 수신:", message.type);
          
          switch (message.type) {
            case 'NAVIGATE_TO_SHOP':
              console.log("쇼핑 페이지로 이동 요청 수신");
              window.location.href = '/shop';
              break;
              
            case 'NAVIGATE_TO_HOME':
              console.log("홈으로 이동 요청 수신");
              window.location.href = '/';
              break;
          }
        }
      } catch (error) {
        console.error("메시지 처리 중 오류 발생:", error);
      }
    };
    
    // 메시지 이벤트 리스너 등록
    window.addEventListener('message', handleMessage);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('message', handleMessage);
    };

    // 로그인 이벤트 리스너 등록
    const handleLogin = (e: CustomEvent) => {
      const detail = e.detail as any;
      if (detail?.user) {
        const username = detail.user.username || detail.user.name || 'User';
        const role = detail.user.role || 'user';
        
        console.log("Login event received with user:", username, "role:", role);
        
        // 로컬 스토리지에 저장
        localStorage.setItem('petedu_auth', JSON.stringify({
          user: username,
          role: role
        }));
        console.log("Saved auth data to localStorage");
        
        // 상태 업데이트
        setAuthState(prevState => ({
          ...prevState,
          isAuthenticated: true,
          isLoading: false,
          userRole: role as UserRole,
          userName: username
        }));
        console.log("Updated auth state with login data");
        
        // 역할 기반 리다이렉션 구현
        setTimeout(() => {
          switch(role) {
            case 'pet-owner':
              window.location.href = '/dashboard';
              break;
            case 'trainer':
              window.location.href = '/trainer/dashboard';
              break;
            case 'institute-admin':
              window.location.href = '/institute/dashboard';
              break;
            case 'admin':
              window.location.href = '/admin/dashboard';
              break;
            default:
              window.location.href = '/';
              break;
          }
          console.log(`Redirecting to role-specific dashboard for: ${role}`);
        }, 300); // 상태 업데이트 후 리다이렉션을 위한 짧은 지연
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
    };

    window.addEventListener('login', handleLogin as EventListener);
    window.addEventListener('petedu-login', handleLogin as EventListener);
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('login', handleLogin as EventListener);
      window.removeEventListener('petedu-login', handleLogin as EventListener);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 응용 프로그램 레이아웃 컴포넌트
 */
function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const auth = useAuth();
  
  // 화면 크기 변경 감지
  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= 1024);
    }
    
    // 초기 실행
    handleResize();
    
    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);
    
    // 클린업
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="bg-background text-foreground min-h-screen font-sans flex flex-col">
      <div className="flex flex-grow">
        {/* 사이드바 - 항상 고정된 너비를 가짐 */}
        <aside 
          className={`
            w-64 shrink-0 h-screen fixed left-0 top-0 z-20
            transition-all duration-300
            ${sidebarOpen || isDesktop ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <Sidebar 
            open={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            userRole={auth.userRole} 
            isAuthenticated={auth.isAuthenticated} 
          />
        </aside>
        
        {/* 모바일 오버레이 - 사이드바가 열리면 본문 위에 표시 */}
        {sidebarOpen && !isDesktop && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* 우측 컨텐츠 영역 (헤더 + 메인) */}
        <div className={`
          flex-grow flex flex-col min-h-screen transition-all duration-300
          ${(sidebarOpen || isDesktop) ? 'ml-64' : 'ml-0'}
        `}>
          {/* 상단바 */}
          <TopBar
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          
          {/* 메인 컨텐츠 영역 */}
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

/**
 * 훈련사 전용 경로에 대한 권한 검증 컴포넌트
 */
function ProtectedTrainerRoute({ component: Component, fallback = <div className="p-8 text-center">접근 권한이 없습니다</div> }: {
  component: React.ComponentType<any>;
  fallback?: React.ReactNode;
}) {
  const { isAuthenticated, userRole } = useAuth();
  
  if (!isAuthenticated) {
    return <RedirectHandler to="/auth" />;
  }
  
  // 훈련사 또는 관리자만 접근 가능
  if (userRole !== 'trainer' && userRole !== 'admin') {
    return <>{fallback}</>;
  }
  
  return <Component />;
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
        {/* 역할별 메인 페이지 */}
        <Route path="/">
          {() => getHomeComponent()}
        </Route>
        
        {/* 대시보드 */}
        <Route path="/dashboard">
          {() => <Dashboard />}
        </Route>
        <Route path="/trainer/dashboard">
          {() => <Dashboard type="trainer" />}
        </Route>
        <Route path="/institute/dashboard">
          {() => <Dashboard type="institute-admin" />}
        </Route>
        <Route path="/admin/dashboard">
          {() => <Dashboard type="admin" />}
        </Route>
        
        {/* 일반 메뉴 */}
        <Route path="/courses" component={Courses} />
        <Route path="/course/:id" component={CourseDetail} />
        <Route path="/trainers" component={Trainers} />
        <Route path="/institutes" component={Institutes} />
        <Route path="/community" component={Community} />
        <Route path="/community/post/:id" component={CommunityPostDetail} />
        <Route path="/events" component={EventsPage} />
        <Route path="/events/calendar" component={EventCalendarPage} />
        <Route path="/events/:id" component={EventDetailPage} />
        <Route path="/my-courses" component={MyCourses} />
        <Route path="/my-pets" component={MyPets} />
        <Route path="/calendar" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">교육 일정</h1><p>교육 일정을 관리할 수 있는 페이지입니다.</p></div>} />
        <Route path="/certificates" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">자격증 및 수료증</h1><p>자격증 및 수료증을 확인할 수 있는 페이지입니다.</p></div>} />
        <Route path="/video-training" component={VideoTrainingPage} />
        <Route path="/video-call" component={VideoCallPage} />
        <Route path="/shop">
          {() => {
            console.log("인증된 사용자 /shop 경로 접근");
            // ShopIndex 컴포넌트를 동적으로 임포트
            const ShopIndex = lazy(() => import('./pages/shop/index'));
            return (
              <Suspense fallback={<div className="p-8 text-center">쇼핑 페이지 로딩 중...</div>}>
                <ShopIndex />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/notifications" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">알림장</h1><p>훈련사와 소통하고 훈련 진행상황을 확인할 수 있는 알림장 페이지입니다.</p></div>} />
        <Route path="/locations" component={LocationsPage} />
        <Route path="/recommendations" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">맞춤 추천</h1><p>반려견 프로필과 사용자 선호도 기반 맞춤형 추천 서비스 페이지입니다.</p></div>} />
        <Route path="/messages" component={MessagesPage} />
        
        {/* 훈련사 메뉴 - 권한 검증 적용 */}
        <Route path="/trainer/courses">
          {() => {
            const CourseManagement = lazy(() => import('./pages/trainer/courses'));
            return (
              <Suspense fallback={<div className="p-8 text-center">페이지 로딩 중...</div>}>
                <ProtectedTrainerRoute component={CourseManagement} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/trainer/referrals">
          {() => {
            const ReferralManagement = lazy(() => import('./pages/referral/ReferralCodeManagement'));
            return (
              <Suspense fallback={<div className="p-8 text-center">페이지 로딩 중...</div>}>
                <ProtectedTrainerRoute component={ReferralManagement} />
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
        <Route path="/admin/institutes" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">기관 관리</h1><p>교육 기관을 관리하는 페이지입니다.</p></div>} />
        <Route path="/admin/courses" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">강의 관리</h1><p>전체 강의를 관리하는 페이지입니다.</p></div>} />
        <Route path="/admin/reports" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">신고 관리</h1><p>사용자 신고를 관리하는 페이지입니다.</p></div>} />
        <Route path="/admin/settings" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">시스템 설정</h1><p>시스템 설정을 관리하는 페이지입니다.</p></div>} />
        <Route path="/admin/shop" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">쇼핑몰 관리</h1><p>쇼핑몰을 관리하는 페이지입니다.</p></div>} />
        <Route path="/admin/commission" component={AdminCommissionPage} />
        <Route path="/admin/menu-config" component={AdminMenuConfigPage} />
        <Route path="/admin/settlement" component={AdminSettlementPage} />
        
        {/* 404 페이지 */}
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

/**
 * 비인증 사용자를 위한 라우트
 */
function UnauthenticatedRoutes() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/auth" component={Login} />
        <Route path="/courses" component={Courses} />
        <Route path="/course/:id" component={CourseDetail} />
        <Route path="/trainers" component={Trainers} />
        <Route path="/video-training" component={VideoTrainingPage} />
        <Route path="/video-call" component={VideoCallPage} />
        <Route path="/institutes" component={Institutes} />
        <Route path="/community" component={Community} />
        <Route path="/community/post/:id" component={CommunityPostDetail} />
        <Route path="/events" component={EventsPage} />
        <Route path="/events/calendar" component={EventCalendarPage} />
        <Route path="/events/:id" component={EventDetailPage} />
        <Route path="/shop">
          {() => {
            console.log("비인증 사용자 /shop 경로 접근");
            // ShopIndex 컴포넌트를 동적으로 임포트
            const ShopIndex = lazy(() => import('./pages/shop/index'));
            return (
              <Suspense fallback={<div className="p-8 text-center">쇼핑 페이지 로딩 중...</div>}>
                <ShopIndex />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/help/faq">
          {() => {
            const FAQPage = lazy(() => import('./pages/help/faq'));
            return (
              <Suspense fallback={<div className="p-8 text-center">FAQ 페이지 로딩 중...</div>}>
                <FAQPage />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/help/guide">
          {() => {
            const GuidePage = lazy(() => import('./pages/help/guide'));
            return (
              <Suspense fallback={<div className="p-8 text-center">이용 가이드 로딩 중...</div>}>
                <GuidePage />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/help/about">
          {() => {
            const AboutPage = lazy(() => import('./pages/help/about'));
            return (
              <Suspense fallback={<div className="p-8 text-center">회사 소개 로딩 중...</div>}>
                <AboutPage />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/help/contact">
          {() => {
            const ContactPage = lazy(() => import('./pages/help/contact'));
            return (
              <Suspense fallback={<div className="p-8 text-center">문의하기 페이지 로딩 중...</div>}>
                <ContactPage />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/" component={Home} />
        <Route>
          {() => {
            console.log("404 - 페이지를 찾을 수 없습니다");
            // 필요한 경우에만 특정 경로로 리디렉션하고, 
            // 커뮤니티 관련 경로인 경우 리디렉션하지 않음
            const path = window.location.pathname;
            if (path.startsWith('/community')) {
              return <div>페이지를 찾을 수 없습니다.</div>;
            }
            window.location.href = "/";
            return null;
          }}
        </Route>
      </Switch>
    </AppLayout>
  );
}

/**
 * 디버그 버튼 컴포넌트
 */
function DebugButton() {
  const handleClearAuth = () => {
    console.log("Clear auth data manually");
    localStorage.removeItem('petedu_auth');
    window.location.reload();
  };
  
  const handleLoginAs = (role: 'user' | 'pet-owner' | 'trainer' | 'institute-admin' | 'admin') => {
    console.log(`Login as ${role}`);
    const authData = { user: `demo-${role}`, role: role };
    localStorage.setItem('petedu_auth', JSON.stringify(authData));
    
    // 사용자 역할에 따라 이벤트 발생
    const loginEvent = new CustomEvent('petedu-login', { 
      detail: { userName: `demo-${role}`, userRole: role } 
    });
    window.dispatchEvent(loginEvent);
    
    // 역할에 맞는 페이지로 리디렉션
    switch (role) {
      case 'pet-owner':
        window.location.href = '/dashboard';
        break;
      case 'trainer':
        window.location.href = '/trainer/dashboard';
        break;
      case 'institute-admin':
        window.location.href = '/institute/dashboard';
        break;
      case 'admin':
        window.location.href = '/admin/dashboard';
        break;
      default:
        window.location.href = '/';
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <button
        onClick={() => handleLoginAs('pet-owner')}
        style={{ 
          padding: '8px 12px',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Login as Pet Owner
      </button>
      <button
        onClick={() => handleLoginAs('trainer')}
        style={{ 
          padding: '8px 12px',
          backgroundColor: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Login as Trainer
      </button>
      <button
        onClick={() => handleLoginAs('institute-admin')}
        style={{ 
          padding: '8px 12px',
          backgroundColor: '#ff9800',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Login as Institute
      </button>
      <button
        onClick={() => handleLoginAs('admin')}
        style={{ 
          padding: '8px 12px',
          backgroundColor: '#9c27b0',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Login as Admin
      </button>
      <button
        onClick={handleClearAuth}
        style={{ 
          padding: '8px 12px',
          backgroundColor: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '8px',
          fontSize: '12px'
        }}
      >
        Logout
      </button>
    </div>
  );
}

/**
 * 메인 애플리케이션 컴포넌트
 */
function SimpleApp() {
  const auth = useAuth();
  
  // 디버깅: 현재 인증 상태 출력
  console.log('SimpleApp render - Auth state:', auth);
  
  // 로딩 상태는 더 이상 체크하지 않음 - 이미 useAuth에서 처리됨
  // if (auth.isLoading) {
  //   return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  // }
  
  return (
    <>
      {auth.isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
      <DebugButton />
      <Toaster />
    </>
  );
}

export default SimpleApp;