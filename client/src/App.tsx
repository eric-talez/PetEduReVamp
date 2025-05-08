import React, { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { AppLayout } from "./layout/AppLayout";
import { useAuth } from "./hooks/useAuth";
import { CartProvider } from "./context/cart-context";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CoursesPage from "./pages/courses/index";
import CourseDetail from "./pages/course/index"; // 강의 상세 페이지
import TrainersPage from "./pages/trainers/index";
import InstitutesPage from "./pages/institutes/index";
import CommunityPage from "./pages/community/index";
import MyCoursesPage from "./pages/my-courses/index";
import MyPetsPage from "./pages/my-pets/index";
import LocationsPage from "./pages/locations/index";
import VideoCallPage from "./pages/video-call/index";
import CourseReservationPage from "./pages/course-reservation/index";
import MessagesPage from "./pages/messages/index";
import NotificationsPage from "./pages/notifications/index";
// 쇼핑 페이지: 새로운 컴포넌트 사용
import ShopNewPage from "./pages/shop-new/index";
import SimpleShopPage from "./pages/shop/simple";
import VideoTrainingPage from "./pages/video-training/index";
import VideoTrainingDetailPage from "./pages/video-training/video";
import ProfilePage from "./pages/profile/index";
import SettingsPage from "./pages/settings/index";
import NotFound from "./pages/not-found";
import TrainerTest from "./pages/TrainerTest";
import ShopRedirect from "./pages/ShopRedirect";
import TrainerReservationsPage from "./pages/trainer-dashboard/reservations";
import InstituteCourseApprovalsPage from "./pages/institute-dashboard/course-approvals";
import InstitutePetAssignmentsPage from "./pages/institute-dashboard/pet-assignments";
import NotebookPage from "./pages/notebook/index";
import EventsPage from "./pages/events/index";
import EventCalendarPage from "./pages/events/calendar";
import AIAnalysisPage from "./pages/ai-analysis/index";

// 지연 로딩되는 컴포넌트들
const EventDetailPage = lazy(() => import('./pages/events/event-detail'));
const CommunityPostDetailPage = lazy(() => import('./pages/community/post-detail'));
const InstituteRegisterPage = lazy(() => import('./pages/institutes/register'));
const InstituteDetailPage = lazy(() => import('./pages/institutes/detail'));
const Cart = lazy(() => import('./pages/shop/cart'));
const Checkout = lazy(() => import('./pages/shop/checkout'));

// Help 페이지들
const FAQPage = lazy(() => import('./pages/help/faq'));
const GuidePage = lazy(() => import('./pages/help/guide'));
const AboutPage = lazy(() => import('./pages/help/about'));
const ContactPage = lazy(() => import('./pages/help/contact'));

// Auth Pages
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/login"; // 임시로 로그인 페이지를 재사용

console.log('App initialized - CourseDetail component:', CourseDetail);

function AuthenticatedRoutes() {
  const { user } = useAuth();

  const checkAccess = (allowedRoles: string[]) => {
    if (!user || !user.role) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard">
          {() => checkAccess(['pet-owner', 'trainer', 'institute-admin', 'admin']) ? <Dashboard /> : window.location.href = '/'}
        </Route>
        <Route path="/courses" component={CoursesPage} />
        <Route path="/course/:id" component={CourseDetail} />
        <Route path="/video-training" component={VideoTrainingPage} />
        <Route path="/video-training/:id" component={VideoTrainingDetailPage} />
        <Route path="/trainers">
          {() => checkAccess(['pet-owner', 'trainer', 'institute-admin', 'admin']) ? <TrainersPage /> : window.location.href = '/'}
        </Route>
        <Route path="/institutes">
          {() => checkAccess(['pet-owner', 'trainer', 'institute-admin', 'admin']) ? <InstitutesPage /> : window.location.href = '/'}
        </Route>
        <Route path="/my-courses">
          {() => checkAccess(['pet-owner']) ? <MyCoursesPage /> : window.location.href = '/'}
        </Route>
        <Route path="/my-pets">
          {() => checkAccess(['pet-owner']) ? <MyPetsPage /> : window.location.href = '/'}
        </Route>
        <Route path="/trainer/dashboard">
          {() => checkAccess(['trainer', 'admin']) ? <Dashboard typeProps="trainer" /> : window.location.href = '/'}
        </Route>
        <Route path="/institute/dashboard">
          {() => checkAccess(['institute-admin', 'admin']) ? <Dashboard typeProps="institute-admin" /> : window.location.href = '/'}
        </Route>
        <Route path="/admin/dashboard">
          {() => checkAccess(['admin']) ? <Dashboard typeProps="admin" /> : window.location.href = '/'}
        </Route>
        <Route path="/community" component={CommunityPage} />
        <Route path="/community/post/:id">
          {() => (
            <Suspense fallback={<div className="p-8 text-center">게시물 로딩 중...</div>}>
              <CommunityPostDetailPage />
            </Suspense>
          )}
        </Route>
        <Route path="/my-courses" component={MyCoursesPage} />
        <Route path="/my-pets" component={MyPetsPage} />
        <Route path="/locations" component={LocationsPage} />
        <Route path="/video-call" component={VideoCallPage} />
        <Route path="/course-reservation" component={CourseReservationPage} />
        <Route path="/trainer/reservations">
          {() => checkAccess(['trainer', 'admin']) ? <TrainerReservationsPage /> : window.location.href = '/'}
        </Route>
        <Route path="/institute/course-approvals">
          {() => checkAccess(['institute-admin', 'admin']) ? <InstituteCourseApprovalsPage /> : window.location.href = '/'}
        </Route>
        <Route path="/institute/pet-assignments">
          {() => checkAccess(['institute-admin', 'admin']) ? <InstitutePetAssignmentsPage /> : window.location.href = '/'}
        </Route>
        <Route path="/notebook/:id">
          {() => checkAccess(['pet-owner', 'trainer', 'institute-admin']) ? <NotebookPage /> : window.location.href = '/'}
        </Route>
        <Route path="/messages" component={MessagesPage} />
        <Route path="/notifications" component={NotificationsPage} />
        <Route path="/shop-new">
          {() => {
            console.log("ShopNewPage 렌더링 - /shop-new 경로 (인증)");
            return <ShopNewPage />;
          }}
        </Route>
        {/* 아예 새로운 페이지로 대체 */}
        <Route path="/shop">
          {() => {
            console.log("심플 쇼핑 페이지 렌더링 시도 (인증)");
            const SimpleShopPage = lazy(() => import('./pages/shop-simple'));
            return (
              <Suspense fallback={<div className="p-8 text-center">쇼핑 페이지 로딩 중...</div>}>
                <SimpleShopPage />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/shop-redirect">
          {() => {
            console.log("Shop 리다이렉트 페이지 렌더링 (인증)");
            return <ShopRedirect />;
          }}
        </Route>
        <Route path="/shop/cart">
          {() => {
            const CartPage = lazy(() => import('./pages/shop/cart'));
            return (
              <Suspense fallback={<div className="p-8 text-center">장바구니 로딩 중...</div>}>
                <CartPage />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/shop/checkout">
          {() => {
            const CheckoutPage = lazy(() => import('./pages/shop/checkout'));
            return (
              <Suspense fallback={<div className="p-8 text-center">결제 페이지 로딩 중...</div>}>
                <CheckoutPage />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/profile" component={ProfilePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/events" component={EventsPage} />
        <Route path="/events/calendar" component={EventCalendarPage} />
        <Route path="/ai-analysis">
          {() => checkAccess(['pet-owner', 'admin']) ? <AIAnalysisPage /> : window.location.href = '/'}
        </Route>
        <Route path="/events/:id">
          {() => (
            <Suspense fallback={<div className="p-8 text-center">이벤트 상세 페이지 로딩 중...</div>}>
              <EventDetailPage />
            </Suspense>
          )}
        </Route>
        <Route path="/help/faq">
          {() => (
            <Suspense fallback={<div className="p-8 text-center">FAQ 페이지 로딩 중...</div>}>
              <FAQPage />
            </Suspense>
          )}
        </Route>
        <Route path="/help/guide">
          {() => (
            <Suspense fallback={<div className="p-8 text-center">이용 가이드 로딩 중...</div>}>
              <GuidePage />
            </Suspense>
          )}
        </Route>
        <Route path="/help/about">
          {() => (
            <Suspense fallback={<div className="p-8 text-center">회사 소개 로딩 중...</div>}>
              <AboutPage />
            </Suspense>
          )}
        </Route>
        <Route path="/help/contact">
          {() => (
            <Suspense fallback={<div className="p-8 text-center">문의하기 페이지 로딩 중...</div>}>
              <ContactPage />
            </Suspense>
          )}
        </Route>
        <Route path="/modal-test" component={TrainerTest} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function UnauthenticatedRoutes() {
  return (
    <AppLayout>
      <Switch>
        {/* 더 구체적인 경로가 먼저 오도록 순서 정렬 */}
        {/* 인증 관련 */}
        <Route path="/auth/login" component={LoginPage} />
        <Route path="/auth/register" component={RegisterPage} />
        
        {/* 쇼핑 관련 - 이 부분이 중요합니다 */}
        <Route path="/shop/cart">
          {() => {
            const CartPage = lazy(() => import('./pages/shop/cart'));
            return (
              <Suspense fallback={<div className="p-8 text-center">장바구니 로딩 중...</div>}>
                <CartPage />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/shop/checkout">
          {() => {
            const CheckoutPage = lazy(() => import('./pages/shop/checkout'));
            return (
              <Suspense fallback={<div className="p-8 text-center">결제 페이지 로딩 중...</div>}>
                <CheckoutPage />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/shop-new">
          {() => {
            console.log("ShopNewPage 렌더링 - /shop-new 경로 (비인증)");
            return <ShopNewPage />;
          }}
        </Route>
        {/* 아예 새로운 페이지로 대체 (비인증) */}
        <Route path="/shop">
          {() => {
            console.log("심플 쇼핑 페이지 렌더링 시도 (비인증)");
            const SimpleShopPage = lazy(() => import('./pages/shop-simple'));
            return (
              <Suspense fallback={<div className="p-8 text-center">쇼핑 페이지 로딩 중...</div>}>
                <SimpleShopPage />
              </Suspense>
            );
          }}
        </Route>
        <Route path="/shop-redirect">
          {() => {
            console.log("Shop 리다이렉트 페이지 렌더링 (비인증)");
            return <ShopRedirect />;
          }}
        </Route>
        
        {/* 강의 및 비디오 관련 */}
        <Route path="/course/:id" component={CourseDetail} />
        <Route path="/courses" component={CoursesPage} />
        <Route path="/video-training/:id" component={VideoTrainingDetailPage} />
        <Route path="/video-training" component={VideoTrainingPage} />
        
        {/* 이벤트 관련 */}
        <Route path="/events/calendar" component={EventCalendarPage} />
        <Route path="/events/:id">
          {() => (
            <Suspense fallback={<div className="p-8 text-center">이벤트 상세 페이지 로딩 중...</div>}>
              <EventDetailPage />
            </Suspense>
          )}
        </Route>
        <Route path="/events" component={EventsPage} />
        
        {/* 기관 관련 */}
        <Route path="/institutes/register">
          {() => (
            <Suspense fallback={<div className="p-8 text-center">기관 등록 페이지 로딩 중...</div>}>
              <InstituteRegisterPage />
            </Suspense>
          )}
        </Route>
        <Route path="/institutes/:id">
          {() => (
            <Suspense fallback={<div className="p-8 text-center">기관 상세 페이지 로딩 중...</div>}>
              <InstituteDetailPage />
            </Suspense>
          )}
        </Route>
        <Route path="/institutes" component={InstitutesPage} />
        
        {/* 커뮤니티 관련 */}
        <Route path="/community/post/:id">
          {() => (
            <Suspense fallback={<div className="p-8 text-center">게시물 로딩 중...</div>}>
              <CommunityPostDetailPage />
            </Suspense>
          )}
        </Route>
        <Route path="/community" component={CommunityPage} />
        
        {/* 도움말 관련 */}
        <Route path="/help/faq">
          {() => (
            <Suspense fallback={<div className="p-8 text-center">FAQ 페이지 로딩 중...</div>}>
              <FAQPage />
            </Suspense>
          )}
        </Route>
        <Route path="/help/guide">
          {() => (
            <Suspense fallback={<div className="p-8 text-center">이용 가이드 로딩 중...</div>}>
              <GuidePage />
            </Suspense>
          )}
        </Route>
        <Route path="/help/about">
          {() => (
            <Suspense fallback={<div className="p-8 text-center">회사 소개 로딩 중...</div>}>
              <AboutPage />
            </Suspense>
          )}
        </Route>
        <Route path="/help/contact">
          {() => (
            <Suspense fallback={<div className="p-8 text-center">문의하기 페이지 로딩 중...</div>}>
              <ContactPage />
            </Suspense>
          )}
        </Route>
        
        {/* 기타 페이지 */}
        <Route path="/trainers" component={TrainersPage} />
        <Route path="/video-call" component={VideoCallPage} />
        <Route path="/course-reservation" component={CourseReservationPage} />
        <Route path="/locations" component={LocationsPage} />
        <Route path="/modal-test" component={TrainerTest} />
        
        {/* 루트 경로는 마지막에 */}
        <Route path="/" component={Home} />
        
        {/* 찾을 수 없는 페이지 */}
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

export default function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <CartProvider>
      {auth.isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
    </CartProvider>
  );
}