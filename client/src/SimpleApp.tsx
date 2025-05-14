import { Switch, Route } from "wouter";
import { RedirectHandler } from './components/RedirectHandler';
import React, { ReactNode, useState, useEffect, lazy, Suspense } from "react";

// 페이지 컴포넌트 임포트
import Home from "./pages/Home";
import Dashboard from "@/pages/dashboard";
import Courses from "@/pages/courses";
import FAQPage from "@/pages/help/faq";
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

// 인증 관련 임포트 - 호환성 레이어 사용
import { useAuth, USER_ROLES, type UserRole, type AuthState, UserRoleEnum } from "@/lib/auth-compat";

// 역호환성 유지를 위한 re-export
// 다른 파일에서 SimpleApp에서 useAuth를 import하는 경우 호환성 유지
export { useAuth, USER_ROLES, UserRoleEnum };
// 타입 re-export
export type { AuthState, UserRole };

/**
 * 특수 메시지 리스너 컴포넌트
 * 특수한 네비게이션 이벤트를 처리하는 역할만 담당
 */
function NavigationMessageListener({ children }: { children: ReactNode }) {
  useEffect(() => {
    // 쇼핑 페이지 이동 등 특수 메시지 이벤트 리스너
    const handleSpecialNavigation = (event: MessageEvent) => {
      try {
        const message = event.data;
        
        if (message && message.type) {
          console.log("[Navigation] 메시지 수신:", message.type);
          
          switch (message.type) {
            case 'NAVIGATE_TO_SHOP':
              console.log("[Navigation] 쇼핑 페이지로 이동 요청 수신");
              window.location.href = '/shop';
              break;
              
            case 'NAVIGATE_TO_HOME':
              console.log("[Navigation] 홈으로 이동 요청 수신");
              window.location.href = '/';
              break;
          }
        }
      } catch (error) {
        console.error("[Navigation] 메시지 처리 중 오류 발생:", error);
      }
    };
    
    // 이벤트 리스너 등록
    window.addEventListener('message', handleSpecialNavigation);
    
    // 정리 함수
    return () => {
      window.removeEventListener('message', handleSpecialNavigation);
    };
  }, []);

  return <>{children}</>;
}

/**
 * 응용 프로그램 레이아웃 컴포넌트
 */
function AppLayout({ children }: { children: ReactNode }) {
  // localStorage에서 사이드바 상태 불러오기
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    // localStorage에서 저장된 사이드바 확장 상태 가져오기
    const savedState = localStorage.getItem('sidebarExpanded');
    if (savedState !== null) {
      return savedState === 'true';
    }
    // 기본값은 확장된 상태 (데스크톱에서)
    return true;
  });
  const auth = useAuth();
  
  // 인증 상태가 변경될 때마다 윈도우 객체에 저장된 상태를 확인하고 동기화
  useEffect(() => {
    if (window.__peteduAuthState && window.__peteduAuthState.isAuthenticated) {
      // 전역 상태가 있고 인증되었는데 로컬 상태와 다르다면 동기화
      if (!auth.isAuthenticated || auth.userRole !== window.__peteduAuthState.userRole) {
        console.log("인증 상태 불일치 감지 - 전역:", window.__peteduAuthState, "로컬:", auth);
        // 인증 이벤트를 발생시켜 상태 동기화
        const loginEvent = new CustomEvent('login', {
          detail: {
            userRole: window.__peteduAuthState.userRole,
            userName: window.__peteduAuthState.userName
          }
        });
        window.dispatchEvent(loginEvent);
      }
    }
  }, [auth.isAuthenticated, auth.userRole, auth.userName]);
  
  // 사이드바 크기 토글 핸들러
  const toggleSidebarSize = () => {
    const newState = !sidebarExpanded;
    setSidebarExpanded(newState);
    
    // 사이드바 상태를 localStorage에 저장
    try {
      localStorage.setItem('sidebarExpanded', String(newState));
      console.log('사이드바 확장 상태 저장:', newState);
    } catch (e) {
      console.error('사이드바 상태 저장 오류:', e);
    }
  };
  
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
            shrink-0 h-screen fixed left-0 top-0 z-20
            transition-all duration-300
            ${sidebarExpanded ? 'w-64' : 'w-[70px]'}
            ${sidebarOpen || isDesktop ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <Sidebar 
            open={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            userRole={auth.userRole} 
            isAuthenticated={auth.isAuthenticated}
            expanded={sidebarExpanded}
            onToggleExpand={toggleSidebarSize}
          />
          {/* 디버그 정보 표시 - 개발 모드에서만 표시 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-4 right-4 p-2 bg-slate-900 text-white text-xs rounded z-50">
              역할: {auth.userRole || '미로그인'} / 
              인증: {auth.isAuthenticated ? 'true' : 'false'}
            </div>
          )}
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
          flex-grow flex flex-col min-h-screen transition-all duration-300 w-full
          ${isDesktop ? (sidebarExpanded ? 'ml-64' : 'ml-[70px]') : 'ml-0'}
        `}>
          {/* 상단바 */}
          <TopBar
            sidebarOpen={sidebarOpen}
            onToggleSidebar={isDesktop ? toggleSidebarSize : () => setSidebarOpen(!sidebarOpen)}
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
 * 로그인 필요 경로 보호 컴포넌트
 */
function ProtectedRoute({ component: Component, requiredRoles = null, fallback = <div className="p-8 text-center">접근 권한이 없습니다</div> }: {
  component: React.ComponentType<any>;
  requiredRoles?: Array<UserRole> | null;
  fallback?: React.ReactNode;
}) {
  const { isAuthenticated, userRole } = useAuth();
  
  // 로그인 여부 체크
  if (!isAuthenticated) {
    return <RedirectHandler to="/auth" />;
  }
  
  // 권한 검증 (requiredRoles이 null이면 로그인만 되어 있으면 됨)
  if (requiredRoles && userRole && !requiredRoles.includes(userRole as UserRole)) {
    return <>{fallback}</>;
  }
  
  return <Component />;
}

/**
 * 훈련사 전용 경로에 대한 권한 검증 컴포넌트
 */
function ProtectedTrainerRoute({ component: Component, fallback = <div className="p-8 text-center">접근 권한이 없습니다</div> }: {
  component: React.ComponentType<any>;
  fallback?: React.ReactNode;
}) {
  return (
    <ProtectedRoute 
      component={Component} 
      requiredRoles={['trainer', 'admin']} 
      fallback={fallback}
    />
  );
}

/**
 * 기관 관리자 전용 경로 보호 컴포넌트
 */
function ProtectedInstituteRoute({ component: Component, fallback = <div className="p-8 text-center">접근 권한이 없습니다</div> }: {
  component: React.ComponentType<any>;
  fallback?: React.ReactNode;
}) {
  return (
    <ProtectedRoute 
      component={Component} 
      requiredRoles={['institute-admin', 'admin']} 
      fallback={fallback}
    />
  );
}

/**
 * 관리자 전용 경로 보호 컴포넌트
 */
function ProtectedAdminRoute({ component: Component, fallback = <div className="p-8 text-center">접근 권한이 없습니다</div> }: {
  component: React.ComponentType<any>;
  fallback?: React.ReactNode;
}) {
  return (
    <ProtectedRoute 
      component={Component} 
      requiredRoles={['admin']} 
      fallback={fallback}
    />
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
        // 관리자는 관리자 대시보드로 리디렉션
        const AdminHome = lazy(() => import('./pages/admin/AdminHome'));
        return <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
          <AdminHome />
        </Suspense>;
      default:
        return <Home />;
    }
  };
  
  return (
    <AppLayout>
      <Switch>
        {/* 역할별 메인 페이지 */}
        <Route path="/">
          {getHomeComponent()}
        </Route>
        
        {/* 대시보드 */}
        <Route path="/dashboard">
          {() => <Dashboard />}
        </Route>
        <Route path="/trainer/dashboard">
          {() => <ProtectedTrainerRoute component={() => <Dashboard type="trainer" />} />}
        </Route>
        <Route path="/institute/dashboard">
          {() => <ProtectedInstituteRoute component={() => <Dashboard type="institute-admin" />} />}
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
        <Route path="/my-trainers" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">담당 훈련사</h1><p>담당 훈련사 정보를 확인할 수 있는 페이지입니다.</p></div>} />
        <Route path="/my-pets" component={MyPets} />
        <Route path="/calendar" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">교육 일정</h1><p>교육 일정을 관리할 수 있는 페이지입니다.</p></div>} />
        <Route path="/certificates" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">자격증 및 수료증</h1><p>자격증 및 수료증을 확인할 수 있는 페이지입니다.</p></div>} />
        <Route path="/video-training" component={VideoTrainingPage} />
        <Route path="/video-call" component={VideoCallPage} />
        {/* 쇼핑몰 메인 */}
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
        
        {/* 상품 상세 페이지 */}
        <Route path="/shop/product/:id">
          {() => {
            console.log("상품 상세 페이지 접근");
            const ProductDetail = lazy(() => import('./pages/shop/product-detail'));
            return (
              <Suspense fallback={<div className="p-8 text-center">상품 정보 로딩 중...</div>}>
                <ProductDetail />
              </Suspense>
            );
          }}
        </Route>
        
        {/* 장바구니 페이지 */}
        <Route path="/shop/cart">
          {() => {
            console.log("장바구니 페이지 접근");
            const Cart = lazy(() => import('./pages/shop/cart'));
            return (
              <Suspense fallback={<div className="p-8 text-center">장바구니 로딩 중...</div>}>
                <Cart />
              </Suspense>
            );
          }}
        </Route>
        
        {/* 결제 페이지 */}
        <Route path="/shop/checkout">
          {() => {
            console.log("결제 페이지 접근");
            const Checkout = lazy(() => import('./pages/shop/checkout'));
            return (
              <Suspense fallback={<div className="p-8 text-center">결제 페이지 로딩 중...</div>}>
                <Checkout />
              </Suspense>
            );
          }}
        </Route>
        
        {/* 주문 완료 페이지 */}
        <Route path="/shop/order-complete">
          {() => {
            console.log("주문 완료 페이지 접근");
            const OrderComplete = lazy(() => import('./pages/shop/order-complete'));
            return (
              <Suspense fallback={<div className="p-8 text-center">주문 완료 정보 로딩 중...</div>}>
                <OrderComplete />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/notifications">
          {() => {
            console.log("알림 페이지 리디렉션: /notifications → /alerts");
            // 이전 코드와의 호환성을 위해 /alerts로 리디렉션
            window.location.href = '/alerts';
            return null;
          }}
        </Route>
        <Route path="/alerts">
          {() => {
            console.log("알림 페이지 접근");
            const AlertsPage = lazy(() => import('./pages/alerts'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <span className="ml-2">알림 로딩 중...</span>
              </div>}>
                <ProtectedRoute component={AlertsPage} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/locations">
          {() => (
            <ProtectedRoute 
              component={LocationsPage}
            />
          )}
        </Route>
        <Route path="/recommendations">
          {() => (
            <ProtectedRoute 
              component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">맞춤 추천</h1><p>반려견 프로필과 사용자 선호도 기반 맞춤형 추천 서비스 페이지입니다.</p></div>}
            />
          )}
        </Route>
        <Route path="/messages">
          {() => (
            <ProtectedRoute 
              component={MessagesPage}
            />
          )}
        </Route>

        {/* 나의 학습 메뉴 서브 페이지들 */}
        <Route path="/my-trainers">
          {() => (
            <ProtectedRoute 
              component={() => <div className="container p-6"><h1 className="text-2xl font-bold mb-4">담당 훈련사</h1><p>현재 나의 반려견을 담당하고 있는 훈련사 목록과 연락 정보를 확인할 수 있습니다.</p></div>}
            />
          )}
        </Route>
        <Route path="/achievements">
          {() => (
            <ProtectedRoute 
              component={() => <div className="container p-6"><h1 className="text-2xl font-bold mb-4">훈련 성과</h1><p>반려견의 훈련 성과와 달성한 목표를 확인할 수 있는 페이지입니다.</p></div>}
            />
          )}
        </Route>
        
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
        <Route path="/trainer/classes">
          {() => {
            const TrainerClasses = lazy(() => import('./pages/trainer/classes'));
            return (
              <Suspense fallback={<div className="p-8 text-center">페이지 로딩 중...</div>}>
                <ProtectedTrainerRoute component={TrainerClasses} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/trainer/earnings">
          {() => {
            const TrainerEarnings = lazy(() => import('./pages/trainer/earnings'));
            return (
              <Suspense fallback={<div className="p-8 text-center">페이지 로딩 중...</div>}>
                <ProtectedTrainerRoute component={TrainerEarnings} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/trainer/reviews">
          {() => {
            const TrainerReviews = lazy(() => import('./pages/trainer/reviews'));
            return (
              <Suspense fallback={
                <div className="p-8 flex justify-center items-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              }>
                <ProtectedTrainerRoute component={TrainerReviews} />
              </Suspense>
            );
          }}
        </Route>
        
        <Route path="/trainer/notebook">
          {() => {
            const NotebookPage = lazy(() => import('./pages/notebook'));
            return (
              <Suspense fallback={
                <div className="p-8 flex justify-center items-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              }>
                <ProtectedTrainerRoute component={NotebookPage} />
              </Suspense>
            );
          }}
        </Route>
        
        <Route path="/trainer/profile">
          {() => {
            const ProfilePage = lazy(() => import('./pages/profile'));
            return (
              <Suspense fallback={
                <div className="p-8 flex justify-center items-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              }>
                <ProtectedTrainerRoute 
                  component={() => <ProfilePage userType="trainer" />} 
                />
              </Suspense>
            );
          }}
        </Route>
        
        <Route path="/trainer/settings">
          {() => {
            const SettingsPage = lazy(() => import('./pages/settings'));
            return (
              <Suspense fallback={
                <div className="p-8 flex justify-center items-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              }>
                <ProtectedTrainerRoute 
                  component={() => <SettingsPage userRole="trainer" />} 
                />
              </Suspense>
            );
          }}
        </Route>
        
        <Route path="/institute/profile">
          {() => {
            const ProfilePage = lazy(() => import('./pages/profile'));
            return (
              <Suspense fallback={
                <div className="p-8 flex justify-center items-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              }>
                <ProtectedInstituteRoute 
                  component={() => <ProfilePage userType="institute-admin" />} 
                />
              </Suspense>
            );
          }}
        </Route>
        
        <Route path="/institute/settings">
          {() => {
            const SettingsPage = lazy(() => import('./pages/settings'));
            return (
              <Suspense fallback={
                <div className="p-8 flex justify-center items-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              }>
                <ProtectedInstituteRoute 
                  component={() => <SettingsPage userRole="institute-admin" />} 
                />
              </Suspense>
            );
          }}
        </Route>
        
        <Route path="/profile">
          {() => {
            const ProfilePage = lazy(() => import('./pages/profile'));
            return (
              <Suspense fallback={
                <div className="p-8 flex justify-center items-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              }>
                <ProtectedRoute 
                  component={() => <ProfilePage userType="user" />} 
                />
              </Suspense>
            );
          }}
        </Route>
        
        <Route path="/settings">
          {() => {
            const SettingsPage = lazy(() => import('./pages/settings'));
            return (
              <Suspense fallback={
                <div className="p-8 flex justify-center items-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              }>
                <ProtectedRoute 
                  component={() => <SettingsPage userRole="user" />} 
                />
              </Suspense>
            );
          }}
        </Route>
        
        {/* 중복 경로 제거: /trainer-earnings는 /trainer/earnings로 통합되었습니다 */}
        
        <Route path="/notebook">
          {() => {
            const Notebook = lazy(() => import('./pages/notebook'));
            return (
              <Suspense fallback={
                <div className="p-8 flex justify-center items-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              }>
                <ProtectedRoute component={Notebook} requiredRoles={['pet-owner', 'trainer', 'admin']} />
              </Suspense>
            );
          }}
        </Route>
        
        <Route path="/ai-chatbot">
          {() => {
            const AIChatbot = lazy(() => import('./pages/ai-chatbot'));
            return (
              <Suspense fallback={
                <div className="p-8 flex justify-center items-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              }>
                <ProtectedRoute component={AIChatbot} requiredRoles={null} />
              </Suspense>
            );
          }}
        </Route>
        
        <Route path="/trainer-referrals">
          {() => {
            const TrainerReferrals = lazy(() => import('./pages/trainer-referrals'));
            return (
              <Suspense fallback={
                <div className="p-8 flex justify-center items-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              }>
                <ProtectedTrainerRoute component={TrainerReferrals} />
              </Suspense>
            );
          }}
        </Route>
        
        <Route path="/shop">
          {() => (
            <Suspense fallback={
              <div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            }>
              <div className="hidden">
                {/* 새 창에서 열리는 쇼핑몰은 이 라우트에서 실제로 렌더링되지 않고 
                    사이드바에서 클릭 시 window.open()을 통해 새 창을 엽니다 */}
              </div>
            </Suspense>
          )}
        </Route>
        
        {/* 기관 관리자 메뉴 */}
        <Route path="/institute-dashboard">
          {() => {
            const InstituteAdminHome = lazy(() => import('./pages/institute-admin/InstituteAdminHome'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedInstituteRoute component={InstituteAdminHome} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/institute/trainers">
          {() => {
            const InstituteTrainersManagement = lazy(() => import('./pages/institute-admin/InstituteTrainersManagement'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedInstituteRoute component={InstituteTrainersManagement} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/institute/courses">
          {() => {
            const InstituteCoursesPage = lazy(() => import('./pages/institute/InstituteCoursesPage'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedInstituteRoute component={InstituteCoursesPage} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/institute/students">
          {() => {
            const InstituteStudentsPage = lazy(() => import('./pages/institute/InstituteStudentsPage'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedInstituteRoute component={InstituteStudentsPage} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/institute/facility">
          {() => {
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedInstituteRoute component={() => <div className="p-8">
                  <h1 className="text-2xl font-bold mb-4">시설 관리</h1>
                  <p>기관의 시설 및 공간을 관리할 수 있는 페이지입니다.</p>
                </div>} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/institute/stats">
          {() => {
            const InstituteStatsAndRevenue = lazy(() => import('./pages/institute-admin/InstituteStatsAndRevenue'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedInstituteRoute component={InstituteStatsAndRevenue} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/institute/pet-assignments">
          {() => {
            const InstitutePetAssignments = lazy(() => import('./pages/institute-admin/InstitutePetAssignments'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedInstituteRoute component={InstitutePetAssignments} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/institute/settings">
          {() => {
            const InstituteSettings = lazy(() => import('./pages/institute-admin/InstituteSettings'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedInstituteRoute component={InstituteSettings} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/institute/facility">
          {() => {
            const InstituteFacilityPage = lazy(() => import('./pages/institute/InstituteFacilityPage'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedInstituteRoute component={InstituteFacilityPage} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/institute/reports">
          {() => {
            const InstituteReportsPage = lazy(() => import('./pages/institute/InstituteReportsPage'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedInstituteRoute component={InstituteReportsPage} />
              </Suspense>
            );
          }}
        </Route>
        
        {/* 관리자 메뉴 */}
        <Route path="/admin/dashboard">
          {() => {
            const AdminDashboard = lazy(() => import('./pages/admin/dashboard'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <span className="ml-2">관리자 대시보드 로딩 중...</span>
              </div>}>
                <ProtectedAdminRoute component={AdminDashboard} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/users">
          {() => {
            const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedAdminRoute component={AdminUsers} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/institutes">
          {() => {
            const AdminInstitutes = lazy(() => import('./pages/admin/AdminInstitutes'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedAdminRoute component={AdminInstitutes} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/courses">
          {() => {
            const AdminCourses = lazy(() => import('./pages/admin/AdminCourses'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedAdminRoute component={AdminCourses} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/reports">
          {() => {
            const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedAdminRoute component={AdminReports} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/reports/analytics">
          {() => {
            const AnalyticsReportPage = lazy(() => import('./pages/admin/reports/analytics'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedAdminRoute component={AnalyticsReportPage} />
              </Suspense>
            );
          }}
        </Route>
        
        <Route path="/admin/analytics">
          {() => {
            const AnalyticsPage = lazy(() => import('./pages/admin/analytics'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <span className="ml-2">심층 분석 대시보드 로딩 중...</span>
              </div>}>
                <ProtectedAdminRoute component={AnalyticsPage} />
              </Suspense>
            );
          }}
        </Route>
        {/* /admin/notifications를 /admin/alerts로 리디렉션 */}
        <Route path="/admin/notifications">
          {() => {
            console.log("관리자 알림 페이지 리디렉션: /admin/notifications → /admin/alerts");
            window.location.href = '/admin/alerts';
            return null;
          }}
        </Route>
        <Route path="/admin/alerts">
          {() => {
            const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <span className="ml-2">관리자 알림 로딩 중...</span>
              </div>}>
                <ProtectedAdminRoute component={AdminNotifications} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/settings">
          {() => {
            const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedAdminRoute component={AdminSettings} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/facility">
          {() => {
            const AdminFacilityPage = lazy(() => import('./pages/institute/InstituteFacilityPage'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedAdminRoute component={AdminFacilityPage} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/shop">
          {() => {
            const AdminShop = lazy(() => import('./pages/admin/AdminShop'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedAdminRoute component={AdminShop} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/commission">
          {() => {
            const AdminCommission = lazy(() => import('./pages/admin/AdminCommission'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedAdminRoute component={AdminCommission} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/commissions">
          {() => {
            const AdminCommission = lazy(() => import('./pages/admin/AdminCommission'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedAdminRoute component={AdminCommission} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/trainers">
          {() => {
            const AdminTrainers = lazy(() => import('./pages/admin/AdminTrainers'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedAdminRoute component={AdminTrainers} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/banners">
          {() => {
            const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedAdminRoute component={AdminBanners} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/contents">
          {() => {
            const AdminContents = lazy(() => import('./pages/admin/AdminContents'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedAdminRoute component={AdminContents} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/menu-config">
          {() => (
            <ProtectedAdminRoute 
              component={AdminMenuConfigPage}
            />
          )}
        </Route>
        <Route path="/admin/menu-management">
          {() => {
            console.log("[DEBUG] admin/menu-management 라우트 접근");
            // 메뉴 관리 컴포넌트 lazy 로딩
            const MenuManagement = lazy(() => import('./pages/admin/menu-management'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ProtectedAdminRoute component={MenuManagement} />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/settlement">
          {() => (
            <ProtectedAdminRoute 
              component={AdminSettlementPage}
            />
          )}
        </Route>
        
        {/* AI 분석 페이지 */}
        <Route path="/ai-analysis">
          {() => {
            console.log("회원 AI 분석 페이지 로딩");
            const AIAnalysisPage = lazy(() => import('./pages/ai-analysis'));
            return (
              <Suspense fallback={
                <div className="flex justify-center items-center h-screen">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mr-2"></div>
                  <span>AI 반려동물 분석 페이지 로딩 중...</span>
                </div>
              }>
                <AIAnalysisPage />
              </Suspense>
            );
          }}
        </Route>
        
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
        {/* 쇼핑몰 메인 */}
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
        
        {/* 상품 상세 페이지 */}
        <Route path="/shop/product/:id">
          {() => {
            console.log("상품 상세 페이지 접근");
            const ProductDetail = lazy(() => import('./pages/shop/product-detail'));
            return (
              <Suspense fallback={<div className="p-8 text-center">상품 정보 로딩 중...</div>}>
                <ProductDetail />
              </Suspense>
            );
          }}
        </Route>
        
        {/* 장바구니 페이지 */}
        <Route path="/shop/cart">
          {() => {
            console.log("장바구니 페이지 접근");
            const Cart = lazy(() => import('./pages/shop/cart'));
            return (
              <Suspense fallback={<div className="p-8 text-center">장바구니 로딩 중...</div>}>
                <Cart />
              </Suspense>
            );
          }}
        </Route>
        
        {/* 결제 페이지 */}
        <Route path="/shop/checkout">
          {() => {
            console.log("결제 페이지 접근");
            const Checkout = lazy(() => import('./pages/shop/checkout'));
            return (
              <Suspense fallback={<div className="p-8 text-center">결제 페이지 로딩 중...</div>}>
                <Checkout />
              </Suspense>
            );
          }}
        </Route>
        
        {/* 주문 완료 페이지 */}
        <Route path="/shop/order-complete">
          {() => {
            console.log("주문 완료 페이지 접근");
            const OrderComplete = lazy(() => import('./pages/shop/order-complete'));
            return (
              <Suspense fallback={<div className="p-8 text-center">주문 완료 정보 로딩 중...</div>}>
                <OrderComplete />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/help">
          {() => {
            return <RedirectHandler to="/help/faq" />;
          }}
        </Route>
        <Route path="/help/faq">
          {() => {
            return (
              <div className="p-8">
                <FAQPage />
              </div>
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
    
    // 역할에 맞는 표시 이름 설정
    const displayName = role === 'admin' ? '관리자' 
               : role === 'trainer' ? '훈련사' 
               : role === 'institute-admin' ? '기관 관리자' 
               : role === 'pet-owner' ? '반려인' 
               : '일반 사용자';
    
    // 새로운 글로벌 인증 시스템으로 로그인 이벤트 발생
    const loginEvent = new CustomEvent('login', { 
      detail: { 
        role: role, 
        name: displayName,
        userRole: role,
        userName: displayName
      } 
    });
    
    window.dispatchEvent(loginEvent);
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