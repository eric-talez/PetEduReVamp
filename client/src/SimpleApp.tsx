import { Switch, Route } from "wouter";
import { RedirectHandler } from './components/RedirectHandler';
import React, { ReactNode, useState, useEffect, lazy, Suspense } from "react";
import { SimpleChatBot } from './components/ui/SimpleChatBot';
import { UserPreferencesProvider } from './hooks/use-user-preferences';
import { useGlobalShortcuts } from './hooks/use-keyboard-shortcuts';
import { NotificationsProvider } from './components/NotificationsProvider';
import { AchievementsProvider } from './hooks/useAchievements';
import { useKeyboardAccessibility } from '@/hooks/use-keyboard-accessibility';

import { startCacheCleanup } from './utils/performance-optimizer';

// 페이지 컴포넌트 임포트
import Home from "./pages/Home";
import Dashboard from "@/pages/dashboard/index";
import Courses from "@/pages/courses/index";
import FAQPage from "@/pages/help/faq";
import CourseDetail from "@/pages/course-detail";
import Trainers from "@/pages/trainers/index";
import Institutes from "@/pages/institutes";
import Community from "@/pages/community/CommunityFixed";
import CommunityPostDetail from "@/pages/community/post/[id]";
import MyCourses from "@/pages/my-courses";
import MyPets from "@/pages/my-pets";
import Login from "@/pages/auth/login";
import NotFound from "@/pages/not-found";
import VideoTrainingPage from "@/pages/VideoTraining";
import LocationsPage from "./pages/locations";
import VideoCallPage from "./pages/video-call";
import MessagesPage from "./pages/messages";
import ChatbotPage from "./pages/chatbot";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Refund from "./pages/Refund";
import CertifiedPartner from "./pages/CertifiedPartner";
import AdminMenuConfigPage from "./pages/admin/menu-config";
import EventsPage from "./pages/events";
import EventDetailPage from "./pages/events/event-detail";
import EventCalendarPage from "./pages/events/calendar";
import AnalyticsPage from "./pages/analytics";
import EducationSchedulePage from "./pages/education-schedule";
import SubscriptionsPage from "./pages/subscriptions";
import SearchPage from "./pages/search";
import TalezExperiencePage from "./pages/TalezExperience";
import CurriculumManager from "./pages/courses/CurriculumManager";
import AdminCurriculum from "./pages/admin/AdminCurriculum";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import TrainerRegistration from "./pages/registration/TrainerRegistration";
import InstituteRegistration from "./pages/registration/InstituteRegistration";

// 관리자 페이지 직접 import
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminInstitutes from "./pages/admin/AdminInstitutes";
import AdminTrainers from "./pages/admin/AdminTrainers";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminMenuManagement from "./pages/admin/menu-management";
import AdminCommissionPage from "./pages/admin/commission";
import AdminApprovals from './pages/admin/AdminApprovals';
import PaymentIntegration from './pages/admin/PaymentIntegration';
import AdminReports from './pages/admin/AdminReports';
import NotebookMonitorPage from "./pages/admin/notebook-monitor";
import AdminShop from './pages/admin/AdminShop';
import AdminSettings from './pages/admin/AdminSettings';
import LocationManagement from './pages/admin/LocationManagement';
import SpringBootTestPage from "./pages/SpringBootTest";
import AdminContents from "./pages/admin/AdminContents";
import AdminMembersStatus from "./pages/admin/AdminMembersStatus";
import TrainerCertificationManagement from "./pages/admin/TrainerCertificationManagement";
import MessagingSettings from "./pages/admin/MessagingSettings";
import AdminProductPricing from "./pages/admin/AdminProductPricing";
import AdminSettlementPage from "./pages/admin/settlement";
import ContentCrawler from "./pages/admin/ContentCrawler";
import AdminCommunityManagement from "./pages/admin/AdminCommunityManagement";
import InstituteNotebookMonitorPage from "./pages/institute-admin/NotebookMonitor";
import TrainerActivityLogs from "./pages/admin/TrainerActivityLogs";
import PointManagement from "./pages/admin/PointManagement";
import AdminPointsManagement from "./pages/admin/PointsManagement";
import TrainerMyPoints from "./pages/trainer/MyPoints";
import InstituteMyPoints from "./pages/institute/MyPoints";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import TrainerRestManagement from "./pages/trainer/RestManagement";
import InstituteRestManagement from "./pages/institute/RestManagement";
import SubstituteClassBoard from "./pages/trainer/SubstituteClassBoard";
import SubstituteTrainerManagement from "./pages/institute/SubstituteTrainerManagement";
import SubstituteTrainerOverview from "./pages/admin/SubstituteTrainerOverview";
import AdminContentModeration from "./pages/admin/AdminContentModeration";
import ContentModerationTest from "./pages/admin/ContentModerationTest";
import ApiManagement from "./pages/admin/ApiManagement";
import AIApiManagement from "./pages/admin/AIApiManagement";
import AIOptimizationDashboard from "./pages/admin/AIOptimizationDashboard";
import MenuVisibilityControl from "./pages/admin/MenuVisibilityControl";
import NavigationProgress from "./components/NavigationProgress";
import { SimpleLoading, SimpleLoadingInline } from "./components/ui/simple-loading";

// 레이아웃 및 컴포넌트 임포트 - YouTube Style
import { YouTubeTopBar } from "@/components/YouTubeTopBar";
import { YouTubeSidebar } from "@/components/YouTubeSidebar";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

import { ThemeManager } from "@/components/ThemeManager";
import { AccessibilityFloatingButton } from "@/components/ui/AccessibilityControls";
import { DogLoading, FullScreenLoading } from "@/components/DogLoading";
import { SkipToContent } from "@/components/ui/skip-to-content";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AIAssistant } from "@/components/ui/AIAssistant";
import { ThemeProvider } from "@/context/theme-context";

// 인증 관련 임포트 - 호환성 레이어 사용
import { useAuth, USER_ROLES, type UserRole, type AuthState, UserRoleEnum } from "@/lib/auth-compat";

// 로딩 시스템 임포트
import { usePageLoadingDetector } from "@/hooks/use-route-loading";
import { 
  RouteLoadingBar, 
  RouteLoadingMessage, 
  CourseSkeleton, 
  DashboardSkeleton, 
  TrainerSkeleton 
} from "@/components/ui/RouteLoadingBar";

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

  // 키보드 접근성 설정 (전역 단축키)
  useKeyboardAccessibility([
    // 홈 페이지로 이동
    { 
      key: 'h', 
      altKey: true, 
      handler: () => window.location.href = '/' 
    },
    // 사이드바 토글
    { 
      key: 'b', 
      altKey: true, 
      handler: () => isDesktop ? toggleSidebarSize() : setSidebarOpen(!sidebarOpen) 
    },
    // 도움말 표시
    { 
      key: '/', 
      handler: () => {
        alert(`키보드 단축키:
- Alt+H: 홈 페이지로 이동
- Alt+B: 사이드바 토글
- ESC: 모달 닫기
- /: 도움말 표시`);
      } 
    }
  ], true);

  // 페이지 로딩 감지 활성화
  usePageLoadingDetector();

  return (
    <ErrorBoundary>
      <div className="bg-background text-foreground min-h-screen font-sans flex flex-col">
        {/* 글로벌 로딩바 */}
        <RouteLoadingBar />

        {/* 로딩 메시지 (선택사항) */}
        <RouteLoadingMessage />

        {/* 접근성 개선: 콘텐츠로 건너뛰기 링크 */}
        <SkipToContent contentId="main-content" />

        {/* YouTube-style layout */}
        {/* Top Bar - Fixed at top */}
        <YouTubeTopBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarExpanded={sidebarExpanded}
          onToggleSidebarExpanded={toggleSidebarSize}
        />

        <div className="flex">
          {/* Sidebar - Starts below top bar */}
          <YouTubeSidebar 
            open={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            userRole={auth.userRole} 
            isAuthenticated={auth.isAuthenticated}
            expanded={sidebarExpanded}
            onToggleExpand={toggleSidebarSize}
          />

          {/* Main content area - Adjusted for YouTube layout */}
          <main 
            id="main-content" 
            className={`
              flex-grow pt-16 transition-all duration-200
              ${isDesktop ? (sidebarExpanded ? 'ml-60' : 'ml-[72px]') : 'ml-0'}
            `}
            tabIndex={-1}
          >
              <ErrorBoundary>
                <Switch>
                  {/* 홈 페이지 */}
                  <Route path="/" component={Home} />

                  {/* 관리자 메뉴 */}
                  <Route path="/admin/dashboard" component={AdminHome} />
                  <Route path="/admin/users" component={AdminUsers} />
                  <Route path="/admin/trainers" component={AdminTrainers} />
                  <Route path="/admin/institutes" component={AdminInstitutes} />
                  <Route path="/admin/locations" component={LocationManagement} />
                  <Route path="/admin/commissions" component={AdminCommissionPage} />
                  <Route path="/admin/commission-settings" component={AdminCommissionPage} />
                  <Route path="/admin/settlements" component={AdminSettlementPage} />
                  <Route path="/admin/shop" component={AdminShop} />
                  <Route path="/admin/settings" component={AdminSettings} />
                  <Route path="/admin/messaging-settings" component={MessagingSettings} />
                  <Route path="/admin/contents" component={AdminContents} />
                  <Route path="/admin/community" component={AdminCommunityManagement} />
                  <Route path="/admin/curriculum" component={AdminCurriculum} />
                  <Route path="/admin/registrations" component={AdminRegistrations} />
                  <Route path="/admin/members-status" component={AdminMembersStatus} />
                  <Route path="/admin/trainer-certification" component={TrainerCertificationManagement} />
                  <Route path="/admin/product-pricing" component={AdminProductPricing} />
                  <Route path="/admin/content-crawler" component={ContentCrawler} />
                  <Route path="/admin/spring-boot-test" component={SpringBootTestPage} />
                  <Route path="/admin/trainer-activity-logs" component={TrainerActivityLogs} />
                  <Route path="/admin/point-management" component={PointManagement} />
                  <Route path="/admin/points-management" component={AdminPointsManagement} />
                  <Route path="/admin/substitute-overview" component={SubstituteTrainerOverview} />
                  <Route path="/admin/payment" component={lazy(() => import('./pages/admin/PaymentManagement'))} />
                  <Route path="/admin/payment-integration" component={PaymentIntegration} />
                  <Route path="/admin/content-moderation" component={AdminContentModeration} />
                  <Route path="/admin/content-moderation-test" component={ContentModerationTest} />
                  <Route path="/admin/api-management" component={ApiManagement} />
                  <Route path="/admin/ai-api-management" component={AIApiManagement} />
                  <Route path="/admin/ai-optimization" component={AIOptimizationDashboard} />
                  <Route path="/admin/menu-visibility" component={MenuVisibilityControl} />
                  <Route path="/admin/analytics" component={AdminAnalytics} />
                  <Route path="/admin/revenue" component={AdminCommissionPage} />

                  {/* 업체 등록 관리 */}
                  <Route path="/admin/business-registration">
                    {() => {
                      console.log("[DEBUG] 업체 등록 관리 라우트 접근");
                      const BusinessRegistration = lazy(() => import('./pages/admin/BusinessRegistration'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <BusinessRegistration />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* 리뷰 관리 */}
                  <Route path="/admin/review-management">
                    {() => {
                      console.log("[DEBUG] 리뷰 관리 라우트 접근");
                      const ReviewManagement = lazy(() => import('./pages/admin/ReviewManagement'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <ReviewManagement />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* 정보 수정 요청 관리 */}
                  <Route path="/admin/info-correction-requests">
                    {() => {
                      console.log("[DEBUG] 정보 수정 요청 관리 라우트 접근");
                      const InfoCorrectionRequests = lazy(() => import('./pages/admin/InfoCorrectionRequests'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <InfoCorrectionRequests />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* 대시보드 */}
                  <Route path="/dashboard">
                    {() => {
                      const DashboardPage = lazy(() => import('./pages/dashboard'));
                      return (
                        <Suspense fallback={<div className="p-8"><DashboardSkeleton /></div>}>
                          <DashboardPage />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/trainer/dashboard">
                    {() => {
                      const DashboardPage = lazy(() => import('./pages/dashboard'));
                      return (
                        <Suspense fallback={<div className="p-8"><DashboardSkeleton /></div>}>
                          <DashboardPage />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* 강의 관련 */}
                  <Route path="/courses">
                    {() => {
                      const CoursesPage = lazy(() => import('./pages/courses'));
                      return (
                        <Suspense fallback={<div className="p-8"><CourseSkeleton /></div>}>
                          <CoursesPage />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/checkout">
                    {() => {
                      const Checkout = lazy(() => import('./pages/checkout'));
                      return (
                        <Suspense fallback={<div className="p-8 text-center">결제 준비 중...</div>}>
                          <Checkout />
                        </Suspense>
                      );
                    }}
                  </Route>

                  <Route path="/course/:id" component={CourseDetail} />
                  <Route path="/courses/:id">
                    {(params: { id?: string }) => {
                      const CourseDetail = lazy(() => import('./pages/courses/detail'));
                      const courseId = params?.id || '';
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <CourseDetail courseId={courseId} />
                        </Suspense>
                      );
                    }}
                  </Route>

                  <Route path="/courses/:id/preview">
                    {(params: { id?: string }) => {
                      const CoursePreview = lazy(() => import('./pages/courses/preview'));
                      const courseId = params?.id || '';
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <CoursePreview courseId={courseId} />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* 커리큘럼 관리 */}
                  <Route path="/curriculum-manager" component={CurriculumManager} />

                  {/* 프로필 페이지 */}
                  <Route path="/profile">
                    {() => (
                      <ProtectedRoute 
                        component={() => (
                          <div className="container mx-auto p-6">
                            <h1 className="text-2xl font-bold mb-6">내 프로필</h1>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                              <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0">
                                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                    <span className="text-4xl text-gray-500 dark:text-gray-400">반</span>
                                  </div>
                                </div>
                                <div className="flex-grow">
                                  <h2 className="text-xl font-semibold">반려인</h2>
                                  <p className="text-gray-500 dark:text-gray-400 mt-1">견주 회원</p>
                                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                      <p className="text-sm text-gray-500 dark:text-gray-400">이메일</p>
                                      <p>user@example.com</p>
                                    </div>
                                    <div className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                      <p className="text-sm text-gray-500 dark:text-gray-400">연락처</p>
                                      <p>010-1234-5678</p>
                                    </div>
                                    <div className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                      <p className="text-sm text-gray-500 dark:text-gray-400">가입일</p>
                                      <p>2023년 8월 15일</p>
                                    </div>
                                    <div className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                      <p className="text-sm text-gray-500 dark:text-gray-400">최근 로그인</p>
                                      <p>2023년 10월 5일</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      />
                    )}
                  </Route>

                  {/* 설정 페이지 */}
                  <Route path="/settings">
                    {() => {
                      const Settings = lazy(() => import('./pages/settings'));
                      return (
                        <Suspense fallback={<div className="p-8 flex justify-center items-center">
                          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                          <SimpleLoadingInline size="sm" />
                        </div>}>
                          <Settings />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* 훈련사 및 기관 */}
                  <Route path="/trainers">
                    {() => {
                      const TrainersPage = lazy(() => import('./pages/trainers'));
                      return (
                        <Suspense fallback={<div className="p-8"><TrainerSkeleton /></div>}>
                          <TrainersPage />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/trainers/:id">
                    {(params: { id?: string }) => {
                      const TrainerDetail = lazy(() => import('./pages/trainers/detail'));
                      const trainerId = params?.id || '';
                      return (
                        <Suspense fallback={<div className="p-8"><TrainerSkeleton /></div>}>
                          <TrainerDetail trainerId={trainerId} />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/institutes" component={Institutes} />
                  <Route path="/institutes/:id">
                    {(params: { id?: string }) => {
                      const InstituteDetail = lazy(() => import('./pages/institutes/detail'));
                      const instituteId = params?.id || '';
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <InstituteDetail instituteId={instituteId} />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* 위치 및 이벤트 */}
                  <Route path="/locations" component={LocationsPage} />
                  <Route path="/location-finder">
                    {() => {
                      const LocationsPage = lazy(() => import('./pages/location/index'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <LocationsPage />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/events">
                    {() => {
                      const EventsPageLazy = lazy(() => import('./pages/events'));
                      return (
                        <Suspense fallback={<div className="p-8"><CourseSkeleton /></div>}>
                          <EventsPageLazy />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/events/calendar">
                    {() => {
                      const EventCalendarPageLazy = lazy(() => import('./pages/events/calendar'));
                      return (
                        <Suspense fallback={<div className="p-8"><CourseSkeleton /></div>}>
                          <EventCalendarPageLazy />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/events/:id">
                    {(params) => {
                      const EventDetailPageLazy = lazy(() => import('./pages/events/event-detail'));
                      return (
                        <Suspense fallback={<div className="p-8"><CourseSkeleton /></div>}>
                          <EventDetailPageLazy />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* 영상 및 화상 */}
                  <Route path="/video-training" component={VideoTrainingPage} />
                  <Route path="/video-call" component={VideoCallPage} />
                  <Route path="/video-call/reserve">
                    {() => {
                      const VideoCallReserve = lazy(() => import('./pages/video-call/reserve'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <VideoCallReserve />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* 상담 관리 */}
                  <Route path="/consultation">
                    {() => {
                      const ConsultationPage = lazy(() => import('./pages/consultation'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <ConsultationPage />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* 커뮤니티 */}
                  <Route path="/community">
                    {() => {
                      const CommunityPage = lazy(() => import('./pages/community/CommunityFixed'));
                      return (
                        <Suspense fallback={<div className="p-8"><CourseSkeleton /></div>}>
                          <CommunityPage />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/community/post/:id" component={CommunityPostDetail} />

                  {/* 쇼핑 */}
                  <Route path="/shop">
                    {() => {
                      const ShopIndex = lazy(() => import('./pages/shop/index'));
                      return (
                        <Suspense fallback={<div className="p-8"><CourseSkeleton /></div>}>
                          <ShopIndex />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* 인증 */}
                  <Route path="/auth" component={Login} />

                  {/* AI 분석 */}
                  <Route path="/ai-analysis">
                    {() => {
                      const AIAnalysisPage = lazy(() => import('./pages/AIAnalysisPage'));
                      return (
                        <Suspense fallback={<div className="p-8"><CourseSkeleton /></div>}>
                          <AIAnalysisPage />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* AI 챗봇 - /chatbot 경로도 지원 */}
                  <Route path="/chatbot">
                    {() => {
                      const AIChatbotPage = lazy(() => import('./pages/ai-chatbot'));
                      return (
                        <Suspense fallback={<div className="p-8"><CourseSkeleton /></div>}>
                          <AIChatbotPage />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* 훈련사 메뉴 */}
                  <Route path="/trainer/classes">
                    {() => {
                      const TrainerClasses = lazy(() => import('./pages/trainer/classes'));
                      return (
                        <Suspense fallback={<div className="p-8"><TrainerSkeleton /></div>}>
                          <TrainerClasses />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/trainer/students">
                    {() => {
                      const TrainerStudents = lazy(() => import('./pages/trainer/students'));
                      return (
                        <Suspense fallback={<div className="p-8"><TrainerSkeleton /></div>}>
                          <TrainerStudents />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/trainer/courses">
                    {() => {
                      const TrainerCourses = lazy(() => import('./pages/trainer/courses'));
                      return (
                        <Suspense fallback={<div className="p-8"><TrainerSkeleton /></div>}>
                          <TrainerCourses />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/trainer/notebook">
                    {() => {
                      const TrainerNotebook = lazy(() => import('./pages/trainer/notebook'));
                      return (
                        <Suspense fallback={<div className="p-8"><TrainerSkeleton /></div>}>
                          <TrainerNotebook />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/trainer/reviews">
                    {() => {
                      const TrainerReviews = lazy(() => import('./pages/trainer/reviews'));
                      return (
                        <Suspense fallback={<div className="p-8"><TrainerSkeleton /></div>}>
                          <TrainerReviews />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/trainer/earnings">
                    {() => {
                      const TrainerEarnings = lazy(() => import('./pages/trainer/earnings'));
                      return (
                        <Suspense fallback={<div className="p-8"><TrainerSkeleton /></div>}>
                          <TrainerEarnings />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/trainer/referrals">
                    {() => {
                      const TrainerReferrals = lazy(() => import('./pages/trainer/referralCodeManagement'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <TrainerReferrals />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/trainer/my-points" component={TrainerMyPoints} />
                  <Route path="/trainer/settings">
                    {() => {
                      const TrainerSettings = lazy(() => import('./pages/trainer/Settings'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <TrainerSettings />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/trainer/rest-management" component={TrainerRestManagement} />
                  <Route path="/trainer/substitute-board" component={SubstituteClassBoard} />
                  <Route path="/trainer/substitute-class-board" component={SubstituteClassBoard} />



                  {/* 기관 관리자 메뉴 */}
                  <Route path="/institute/dashboard">
                    {() => {
                      const InstituteDashboard = lazy(() => import('./pages/institute-admin/InstituteDashboard'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <InstituteDashboard />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/institute/trainers">
                    {() => {
                      const InstituteTrainers = lazy(() => import('./pages/institute-admin/InstituteTrainers'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <InstituteTrainers />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/institute/courses">
                    {() => {
                      const InstituteCourses = lazy(() => import('./pages/institute-admin/InstituteCourses'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <InstituteCourses />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/institute/facility">
                    {() => {
                      const InstituteFacility = lazy(() => import('./pages/institute-admin/InstituteFacility'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <InstituteFacility />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/institute/stats">
                    {() => {
                      const InstituteStats = lazy(() => import('./pages/institute-admin/InstituteStats'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <InstituteStats />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/institute/pet-assignments">
                    {() => {
                      const InstitutePetAssignments = lazy(() => import('./pages/institute-admin/InstitutePetAssignments'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <InstitutePetAssignments />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/institute/settings">
                    {() => {
                      const InstituteSettings = lazy(() => import('./pages/institute-admin/InstituteSettings'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <InstituteSettings />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/institute/notebook-monitor">
                    <InstituteNotebookMonitorPage />
                  </Route>
                  
                  <Route path="/institute/rest-management" component={InstituteRestManagement} />
                  <Route path="/institute/substitute-management" component={SubstituteTrainerManagement} />
                  <Route path="/institute/trainers">
                    {() => {
                      const InstituteTrainers = lazy(() => import('./pages/institute-admin/InstituteTrainers'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <InstituteTrainers />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/institute/members">
                    {() => {
                      const InstituteMembers = lazy(() => import('./pages/institute-admin/InstituteMembers'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <InstituteMembers />
                        </Suspense>
                      );
                    }}
                  </Route>

                  <Route path="/institute/my-points">
                    {() => {
                      const InstituteMyPoints = lazy(() => import('./pages/institute-admin/MyPoints'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <InstituteMyPoints />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* 등록 페이지 */}
                  <Route path="/registration/trainer" component={TrainerRegistration} />
                  <Route path="/registration/institute" component={InstituteRegistration} />

                  {/* 관리자 등록 관리 */}
                  <Route path="/admin/registrations">
                    {() => (
                      <AdminRegistrations />
                    )}
                  </Route>

                  {/* 나의 학습 메뉴 */}
                  <Route path="/my-courses">
                    {() => {
                      const MyCoursesPage = lazy(() => import('./pages/my-courses'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <MyCoursesPage />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/my-trainers">
                    {() => {
                      const MyTrainersPage = lazy(() => import('./pages/my-trainers'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <MyTrainersPage />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/my-pets">
                    {() => {
                      const MyPetsPage = lazy(() => import('./pages/my-pets'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <MyPetsPage />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/pet-care/health-record">
                    {() => {
                      const HealthRecordPage = lazy(() => import('./pages/pet-care/health-record'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <HealthRecordPage />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/pet-care/pet-detail/:id">
                    {() => {
                      const PetDetailPage = lazy(() => import('./pages/pet-care/pet-detail'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <PetDetailPage />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/notebook">
                    {() => {
                      const NotebookPage = lazy(() => import('./pages/notebook'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <NotebookPage />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/education-schedule">
                    {() => {
                      const EducationSchedulePage = lazy(() => import('./pages/education-schedule'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <EducationSchedulePage />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/calendar">
                    {() => {
                      const EducationSchedulePage = lazy(() => import('./pages/education-schedule'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <EducationSchedulePage />
                        </Suspense>
                      );
                    }}
                  </Route>
                  The code will apply code splitting and lazy loading to improve performance.                  <Route path="/analytics">
                    {() => {
                      const AnalyticsPage = lazy(() => import('./pages/analytics'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <AnalyticsPage />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/subscriptions">
                    {() => {
                      const SubscriptionsPage = lazy(() => import('./pages/subscriptions'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <SubscriptionsPage />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* 기능 메뉴 */}
                  <Route path="/alerts">
                    {() => {
                      const AlertsPage = lazy(() => import('./pages/alerts'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <AlertsPage />
                        </Suspense>
                      );
                    }}
                  </Route>
                  <Route path="/messages">
                    {() => {
                      const MessagesPage = lazy(() => import('./pages/messages'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <MessagesPage />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* AI 챗봇 */}
                  <Route path="/ai-chatbot">
                    {() => {
                      const AIChatbotPage = lazy(() => import('./pages/ai-chatbot'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <AIChatbotPage />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* 영상강의 시스템 */}
                  <Route path="/video-lectures">
                    {() => {
                      const VideoLectureSystem = lazy(() => import('./pages/video-lectures/VideoLectureSystem'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <VideoLectureSystem />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* 영상강의 플레이어 */}
                  <Route path="/video-lectures/player/:lectureId?/:moduleId?">
                    {() => {
                      const VideoLecturePlayer = lazy(() => import('./pages/video-lectures/VideoLecturePlayer'));
                      return (
                        <Suspense fallback={<SimpleLoading />}>
                          <VideoLecturePlayer />
                        </Suspense>
                      );
                    }}
                  </Route>

                  {/* 검색 */}
                  <Route path="/search" component={SearchPage} />

                  {/* 약관 및 정책 페이지 */}
                  <Route path="/terms" component={Terms} />
                  <Route path="/privacy" component={Privacy} />
                  <Route path="/refund" component={Refund} />
                  <Route path="/certified-partner" component={CertifiedPartner} />

                  {/* 도움말 */}
                  <Route path="/help/faq" component={FAQPage} />

                  <Route path="/location-finder">
          {() => {
            const LocationsPage = lazy(() => import('./pages/location/index'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <LocationsPage />
              </Suspense>
            );
          }}
        </Route>

        <Route path="/alerts">
          {() => {
            const AlertsPage = lazy(() => import('./pages/alerts/index'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <AlertsPage />
              </Suspense>
            );
          }}
        </Route>

        <Route path="/ai-analysis">
          {() => {
            const AIAnalysisPage = lazy(() => import('./pages/ai-analysis/index'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <AIAnalysisPage />
              </Suspense>
            );
          }}
        </Route>

                  {/* 404 페이지 */}
                  <Route path="/not-found">
          {() => {
            const NotFoundPage = lazy(() => import('./pages/not-found'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <NotFoundPage />
              </Suspense>
            );
          }}
        </Route>

/**
 * 로그인 필요 경로 보호 컴포넌트 - 임시로 주석 처리
 */
// function ProtectedRoute(props: any) {
//   const Component = props.component;
//   return <Component />;
// }

/**
 * 훈련사 전용 경로에 대한 권한 검증 컴포넌트
 */
// function ProtectedTrainerRoute({ component: WrappedComponent, fallback = (<div className="p-8 text-center">접근 권한이 없습니다</div>) }: {
//   component: React.ComponentType<any>;
//   fallback?: React.ReactNode;
// }) {
//   return (
//     <ProtectedRoute 
//       component={WrappedComponent} 
//       requiredRoles={['trainer', 'admin']} 
//       fallback={fallback}
//     />
//   );
// }

/**
 * 기관 관리자 전용 경로 보호 컴포넌트
 */
// function ProtectedInstituteRoute({ component: WrappedComponent, fallback = (<div className="p-8 text-center">접근 권한이 없습니다</div>) }: {
//   component: React.ComponentType<any>;
//   fallback?: React.ReactNode;
// }) {
//   return (
//     <ProtectedRoute 
//       component={WrappedComponent} 
//       requiredRoles={['institute-admin', 'admin']} 
//       fallback={fallback}
//     />
//   );
// }

/**
 * 관리자 전용 경로 보호 컴포넌트
 */
// function ProtectedAdminRoute({ component: WrappedComponent, fallback = (<div className="p-8 text-center">접근 권한이 없습니다</div>) }: {
//   component: React.ComponentType<any>;
//   fallback?: React.ReactNode;
// }) {
//   return (
//     <ProtectedRoute 
//       component={WrappedComponent} 
//       requiredRoles={['admin']} 
//       fallback={fallback}
//     />
//   );
// }

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
          {() => <Dashboard type="trainer" />}
        </Route>
        <Route path="/institute/dashboard">
          {() => {
            const InstituteDashboard = lazy(() => import('./pages/institute-admin/InstituteDashboard'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <InstituteDashboard />
              </Suspense>
            );
          }}
        </Route>

        {/* 메뉴 관리는 따로 처리 */}
        <Route path="/admin/menu-management">
          {() => {
            const AdminMenuManagement = lazy(() => import('./pages/admin/menu-management'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <AdminMenuManagement />
              </Suspense>
            );
          }}
        </Route>

        {/* 기관 관리자 메뉴 */}
        <Route path="/institute/trainers">
          {() => {
            const InstituteTrainers = lazy(() => import('./pages/institute-admin/InstituteTrainers'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <InstituteTrainers />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/institute/courses">
          {() => {
            const InstituteCourses = lazy(() => import('./pages/institute-admin/InstituteCourses'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <InstituteCourses />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/institute/facility">
          {() => {
            const InstituteFacility = lazy(() => import('./pages/institute-admin/InstituteFacility'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <InstituteFacility />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/institute/members">
          {() => {
            const InstituteMembers = lazy(() => import('./pages/institute-admin/InstituteMembers'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <InstituteMembers />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/institute/stats">
          {() => {
            const InstituteStats = lazy(() => import('./pages/institute-admin/InstituteStats'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <InstituteStats />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/institute/pet-assignments">
          {() => {
            const InstitutePetAssignments = lazy(() => import('./pages/institute-admin/InstitutePetAssignments'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <InstitutePetAssignments />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/institute/settings">
          {() => {
            const InstituteSettings = lazy(() => import('./pages/institute-admin/InstituteSettings'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <InstituteSettings />
              </Suspense>
            );
          }}
        </Route>

        {/* 일반 메뉴 */}
        <Route path="/courses" component={() => <Courses />} />
        <Route path="/course/:id" component={CourseDetail} />
        <Route path="/trainers" component={Trainers} />
        <Route path="/institutes" component={Institutes} />
        <Route path="/community" component={Community} />
        <Route path="/community/create" component={() => {
          const CreatePost = lazy(() => import('./pages/community/create'));
          return (
            <Suspense fallback={<SimpleLoading />}>
              <CreatePost />
            </Suspense>
          );
        }} />
        <Route path="/community/post/:id" component={CommunityPostDetail} />
        <Route path="/events" component={EventsPage} />
        <Route path="/events/calendar" component={EventCalendarPage} />
        <Route path="/events/:id" component={EventDetailPage} />
        <Route path="/my-courses" component={MyCourses} />

        <Route path="/my-pets" component={MyPets} />

        <Route path="/certificates" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">자격증 및 수료증</h1><p>자격증 및 수료증을 확인할 수 있는 페이지입니다.</p></div>} />
        <Route path="/video-training" component={VideoTrainingPage} />
        <Route path="/video-call" component={VideoCallPage} />
        <Route path="/chatbot" component={ChatbotPage} />
        {/* 쇼핑몰 메인 */}
        <Route path="/shop">
          {() => {
            console.log("인증된 사용자 /shop 경로 접근");
            // ShopIndex 컴포넌트를 동적으로 임포트
            const ShopIndex = lazy(() => import('./pages/shop/index'));
            return (
              <Suspense fallback={<SimpleLoading />}>
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
              <Suspense fallback={<SimpleLoading />}>
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
              <Suspense fallback={<SimpleLoading />}>
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
              <Suspense fallback={<SimpleLoading />}>
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
              <Suspense fallback={<SimpleLoading />}>
                <OrderComplete />
              </Suspense>
            );
          }}
        </Route>

        {/* 주문 내역 페이지 */}
        <Route path="/shop/order-history">
          {() => {
            console.log("주문 내역 페이지 접근");
            const OrderHistory = lazy(() => import('./pages/shop/order-history'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <OrderHistory />
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
                <SimpleLoadingInline size="sm" />
              </div>}>
                <AlertsPage />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/locations">
          {() => {
            console.log("위치 서비스 페이지 접근");
            const Locations = lazy(() => import('./pages/location'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <SimpleLoadingInline size="sm" />
              </div>}>
                <Locations />
              </Suspense>
            );
          }}
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


        {/* 훈련사 메뉴 - 권한 검증 적용 */}
        <Route path="/trainer/courses">
          {() => {
            const CourseManagement = lazy(() => import('./pages/trainer/courses'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <CourseManagement />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/trainer/referrals">
          {() => {
            const ReferralManagement = lazy(() => import('./pages/referral/ReferralCodeManagement'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <ReferralManagement />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/trainer/students">
          {() => {
            const StudentManagement = lazy(() => import('./pages/trainer/students'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <StudentManagement />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/trainer/stats">
          {() => {
            const TrainerStats = lazy(() => import('./pages/trainer/stats'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <TrainerStats />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/trainer/classes">
          {() => {
            const TrainerClasses = lazy(() => import('./pages/trainer/classes'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <TrainerClasses />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/trainer/earnings">
          {() => {
            const TrainerEarnings = lazy(() => import('./pages/trainer/earnings'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <TrainerEarnings />
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
                <TrainerReviews />
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
                <NotebookPage />
              </Suspense>
            );
          }}
        </Route>

        <Route path="/trainer/profile">
          {() => {
            const TrainerProfile = lazy(() => import('./pages/trainer/profile'));
            return (
              <Suspense fallback={
                <div className="p-8 flex justify-center items-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              }>
                <ProtectedTrainerRoute 
                  component={() => <TrainerProfile />} 
                />
              </Suspense>
            );
          }}
        </Route>

        <Route path="/trainer/earnings">
          {() => {
            const TrainerEarnings = lazy(() => import('./pages/trainer/earnings'));
            return (
              <Suspense fallback={
                <div className="p-8 flex justify-center items-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              }>
                <ProtectedTrainerRoute 
                  component={() => <TrainerEarnings />} 
                />
              </Suspense>
            );
          }}
        </Route>

        <Route path="/trainer/students">
          {() => {
            const TrainerStudents = lazy(() => import('./pages/trainer/students'));
            return (
              <Suspense fallback={
                <div className="p-8 flex justify-center items-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              }>
                <ProtectedTrainerRoute 
                  component={() => <TrainerStudents />} 
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

        <Route path="/subscriptions">
          {() => {
            console.log("구독 관리 페이지 접근");
            return (
              <Suspense fallback={
                <div className="flex justify-center items-center h-screen">
                  <DogLoading message="구독 관리 로딩중" size="medium" showTips={true} />
                </div>
              }>
                <SubscriptionsPage />
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
                <Notebook />
              </Suspense>
            );
          }}
        </Route>

        <Route path="/ai-chatbot">
          {() => {
            console.log("AI 챗봇 페이지 접근");
            const AIChatbot = lazy(() => import('./pages/ai-chatbot'));
            return (
              <Suspense fallback={
                <div className="p-8 flex justify-center items-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  <SimpleLoadingInline size="sm" />
                </div>
              }>
                <AIChatbot />
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
                <TrainerReferrals />
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


        <Route path="/institute/pet-assignments">
          {() => {
            const InstitutePetAssignments = lazy(() => import('./pages/institute-admin/InstitutePetAssignments'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <InstitutePetAssignments />
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
                <InstituteSettings />
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
                <InstituteFacilityPage />
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
                <InstituteReportsPage />
              </Suspense>
            );
          }}
        </Route>

        {/* 관리자 메뉴 */}
        <Route path="/admin/dashboard">
          {() => {
            const AdminDashboard = lazy(() => import('./pages/admin/AdminHome'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <SimpleLoadingInline size="sm" />
              </div>}>
                <AdminDashboard />
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
                <AdminUsers />
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
                <AdminInstitutes />
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
                <AdminReports />
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
                <AnalyticsReportPage />
              </Suspense>
            );
          }}
        </Route>

        <Route path="/admin/approvals">
          {() => {
            const AdminApprovals = lazy(() => import('./pages/admin/AdminApprovals'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <AdminApprovals />
              </Suspense>
            );
          }}
        </Route>

        <Route path="/admin/info-correction-requests">
          {() => {
            const InfoCorrectionRequests = lazy(() => import('./pages/admin/InfoCorrectionRequests'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <InfoCorrectionRequests />
              </Suspense>
            );
          }}
        </Route>

        <Route path="/admin/review-management">
          {() => {
            const ReviewManagement = lazy(() => import('./pages/admin/ReviewManagement'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <ReviewManagement />
              </Suspense>
            );
          }}
        </Route>

        <Route path="/facilities">
          {() => {
            const FacilitiesPage = lazy(() => import('./pages/facilities'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <FacilitiesPage />
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
                <span className="ml-2">관리자 알림딩 중...</span>
              </div>}>
                <AdminNotifications />
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
                <AdminSettings />
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
                <AdminFacilityPage />
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
                <AdminShop />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/payment-integration">
          {() => {
            const PaymentIntegration = lazy(() => import('./pages/admin/PaymentIntegration'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <PaymentIntegration />
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
                <AdminCommission />
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
                <AdminCommission />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/commission-settings">
          {() => {
            const CommissionSettings = lazy(() => import('./pages/admin/commission-settings'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <CommissionSettings />
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
                <AdminBanners />
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
                <AdminContents />
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
                <MenuManagement />
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
        <Route path="/admin/commission">
          {() => {
            const AdminCommission = lazy(() => import('./pages/admin/AdminCommission'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <AdminCommission />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/admin/service-inspection">
          {() => {
            const ServiceInspection = lazy(() => import('./pages/admin/ServiceInspection'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>}>
                <ServiceInspection />
              </Suspense>
            );
          }}
        </Route>

        {/* AI 분석 페이지 */}
        <Route path="/ai-analysis">
          {() => {
            console.log("회원 AI 분석 페이지 로딩");
            const AIAnalysisPage = lazy(() => import('./pages/ai-analysis'));
            return (
              <Suspense fallback={
                <div className="flex justify-center items-center h-screen">
                  <DogLoading message="AI 반려동물 분석 페이지 로딩중" size="medium" showTips={true} />
                </div>
              }>
                <AIAnalysisPage />
              </Suspense>
            );
          }}
        </Route>

        {/* 분석 및 보고서 페이지 */}
        <Route path="/analytics">
          {() => {
            console.log("분석 및 보고서 페이지 접근");
            return (
              <Suspense fallback={
                <div className="flex justify-center items-center h-screen">
                  <DogLoading message="분석 데이터 로딩중" size="medium" showTips={true} />
                </div>
              }>
                <AnalyticsPage />
              </Suspense>
            );
          }}
        </Route>

        {/* 교육 일정 페이지 */}
        <Route path="/education-schedule">
          {() => {
            console.log("교육 일정 페이지 접근");
            return (
              <Suspense fallback={
                <div className="flex justify-center items-center h-screen">
                  <DogLoading message="교육 일정 로딩중" size="medium" showTips={true} />
                </div>
              }>
                <EducationSchedulePage />
              </Suspense>
            );
          }}
        </Route>

        {/* 캘린더 경로를 교육일정으로 리다이렉트 */}
        <Route path="/calendar">
          {() => {
            console.log("캘린더 페이지 접근 - 교육일정으로 리다이렉트");
            return (
              <Suspense fallback={
                <div className="flex justify-center items-center h-screen">
                  <DogLoading message="교육 일정 로딩중" size="medium" showTips={true} />
                </div>
              }>
                <EducationSchedulePage />
              </Suspense>
            );
          }}
        </Route>

        {/* 훈련사 메뉴 */}
        <Route path="/trainer/courses">
          {() => {
            const TrainerCourses = lazy(() => import('./pages/trainer/courses'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <TrainerCourses />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/trainer/notebook">
          {() => {
            const TrainerNotebook = lazy(() => import('./pages/trainer/notebook'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <TrainerNotebook />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/trainer/students">
          {() => {
            const TrainerStudents = lazy(() => import('./pages/trainer/students'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <TrainerStudents />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/trainer/stats">
          {() => {
            const TrainerStats = lazy(() => import('./pages/trainer/stats'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <TrainerStats />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/trainer/earnings">
          {() => {
            const TrainerEarnings = lazy(() => import('./pages/trainer/earnings'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <TrainerEarnings />
              </Suspense>
            );
          }}
        </Route>

        {/* 상담 관련 라우트 추가 */}


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
        <Route path="/chatbot" component={ChatbotPage} />

        {/* TALEZ 체험 서비스 */}
        <Route path="/experience">
          {() => {
            console.log("TALEZ 체험 서비스 접근");
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <SimpleLoadingInline size="sm" />
              </div>}>
                <TalezExperiencePage />
              </Suspense>
            );
          }}
        </Route>

        {/* 위치 서비스 */}
        <Route path="/locations">
          {() => {
            console.log("비회원이 위치 서비스 클릭");
            const LocationsPage = lazy(() => import('./pages/location'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <SimpleLoadingInline size="sm" />
              </div>}>
                <LocationsPage />
              </Suspense>
            );
          }}
        </Route>

        {/* AI 챗봇 */}
        <Route path="/ai-chatbot">
          {() => {
            console.log("비회원이 AI 챗봇 클릭");
            const AIChatbot = lazy(() => import('./pages/ai-chatbot'));
            return (
              <Suspense fallback={<div className="p-8 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <SimpleLoadingInline size="sm" />
              </div>}>
                <AIChatbot />
              </Suspense>
            );
          }}
        </Route>

        {/* 쇼핑몰 메인 */}
        <Route path="/shop">
          {() => {
            console.log("비인증 사용자 /shop 경로 접근");
            // ShopIndex 컴포넌트를 동적으로 임포트
            const ShopIndex = lazy(() => import('./pages/shop/index'));
            return (
              <Suspense fallback={<SimpleLoading />}>
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
              <Suspense fallback={<SimpleLoading />}>
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
              <Suspense fallback={<SimpleLoading />}>
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
              <Suspense fallback={<SimpleLoading />}>
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
              <Suspense fallback={<SimpleLoading />}>
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
              <Suspense fallback={<SimpleLoading />}>
                <GuidePage />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/help/about">
          {() => {
            const AboutPage = lazy(() => import('./pages/help/about'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <AboutPage />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/help/contact">
          {() => {
            const ContactPage = lazy(() => import('./pages/help/contact'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <ContactPage />
              </Suspense>
            );
          }}
        </Route>

        {/* 성취 배지 페이지 */}
        <Route path="/profile/achievements">
          {() => {
            const AchievementsPage = lazy(() => import('./pages/profile/achievements'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <AchievementsPage />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/" component={Home />

        {/* 404 페이지 */}
        <Route>
          {() => {
            const NotFound = lazy(() => import('./pages/NotFound'));
            return (
              <Suspense fallback={<SimpleLoading />}>
                <NotFound />
              </Suspense>
            );
          }}
        </Route>
                </Switch>
              </ErrorBoundary>
              
              {/* AI 챗봇 */}
              <SimpleChatBot />
            </main>
          </div>
        </div>
        
        {/* Debug info - only shown in development mode */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 p-2 bg-card border border-border text-card-foreground text-xs rounded z-50">
            역할: {auth.userRole || '미로그인'} / 
            인증: {auth.isAuthenticated ? 'true' : 'false'}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

/**
 * 디버그 버튼 컴포넌트 - 챗봇 버튼 가시성을 위해 비활성화
 */
function DebugButton() {
  // 챗봇 버튼을 보이게 하기 위해 로그인 버튼들을 숨김 처리
  return null;
}

/**
 * 전역 단축키 관리 컴포넌트
 */
function KeyboardShortcutsManager({ children }: { children: ReactNode }) {
  // 글로벌 단축키 훅 사용
  useGlobalShortcuts();
  return <>{children}</>;
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
    <ThemeProvider defaultTheme="light" storageKey="petedu-theme">
      <ThemeManager>
        <UserPreferencesProvider>
          <AchievementsProvider>
            <NotificationsProvider>
              <KeyboardShortcutsManager>
                <>
                  <NavigationProgress />
                  {auth.isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
                  <DebugButton />
                  <Toaster />


                </>
              </KeyboardShortcutsManager>
            </NotificationsProvider>
          </AchievementsProvider>
        </UserPreferencesProvider>
      </ThemeManager>
    </ThemeProvider>
  );
}

export default SimpleApp;