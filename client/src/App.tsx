import React, { lazy, Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { AppLayout } from "./layout/AppLayout";
import { useAuth } from "./hooks/useAuth";
import { CartProvider } from "./context/cart-context";
import { RedirectHandler } from "./components/RedirectHandler";
import { Chatbot } from "./components/features/Chatbot";

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
// 쇼핑 페이지 - 통합 경로 사용
import CartPage from "@/pages/Cart"; // 장바구니 페이지
import ShopIndex from "./pages/shop/index"; // 쇼핑 페이지 메인 컴포넌트 (단일 진입점)
import ProductDetailPage from "./pages/shop/product"; // 상품 상세 페이지

import VideoTrainingPage from "./pages/video-training/index";
import VideoTrainingDetailPage from "./pages/video-training/video";
import ProfilePage from "./pages/profile/index";
import SettingsPage from "./pages/settings/index";
import NotFound from "./pages/not-found";
import TrainerTest from "./pages/TrainerTest";

// 훈련사 페이지 임포트
import TrainerCoursesPage from "./pages/trainer/courses";
import TrainerStudentsPage from "./pages/trainer/students";
import TrainerStatsPage from "./pages/trainer/stats";

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
const Checkout = lazy(() => import('./pages/shop/checkout'));

// Help 페이지들
const FAQPage = lazy(() => import('./pages/help/faq'));
const GuidePage = lazy(() => import('./pages/help/guide'));
const AboutPage = lazy(() => import('./pages/help/about'));
const ContactPage = lazy(() => import('./pages/help/contact'));

// Auth Pages
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/login"; // 임시로 로그인 페이지를 재사용
import ShopLoginRequiredPage from "./pages/shop-login-required";

console.log('App initialized - CourseDetail component:', CourseDetail);

// 인증된 사용자를 위한 라우트 컴포넌트
function AuthenticatedRoutesContent() {
  const auth = useAuth();
  const userRole = auth.userRole;

  const checkAccess = (allowedRoles: string[]) => {
    if (!userRole) return false;
    return allowedRoles.includes(userRole);
  };

  return (
    <>
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
      <Route path="/trainer/profile">
        {() => checkAccess(['trainer', 'admin']) ? <ProfilePage userType="trainer" /> : window.location.href = '/'}
      </Route>
      <Route path="/trainer/schedule">
        {() => checkAccess(['trainer', 'admin']) ? <TrainerReservationsPage /> : window.location.href = '/'}
      </Route>
      {/* 훈련사 관련 라우트 */}
      <Route path="/trainer/courses">
        {() => checkAccess(['trainer', 'admin']) ? <TrainerCoursesPage /> : window.location.href = '/'}
      </Route>
      <Route path="/trainer/students">
        {() => checkAccess(['trainer', 'admin']) ? <TrainerStudentsPage /> : window.location.href = '/'}
      </Route>
      <Route path="/trainer/stats">
        {() => checkAccess(['trainer', 'admin']) ? <TrainerStatsPage /> : window.location.href = '/'}
      </Route>
      <Route path="/trainer/courses/new">
        {() => checkAccess(['trainer', 'admin']) ? <CoursesPage mode="create" userType="trainer" /> : window.location.href = '/'}
      </Route>
      <Route path="/trainer/schedule/new">
        {() => checkAccess(['trainer', 'admin']) ? <TrainerReservationsPage mode="create" /> : window.location.href = '/'}
      </Route>
      <Route path="/trainer/profile/certificates">
        {() => checkAccess(['trainer', 'admin']) ? <ProfilePage userType="trainer" section="certificates" /> : window.location.href = '/'}
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
      
      {/* 인증된 사용자의 쇼핑 관련 라우트 */}
      <Route path="/shop">
        {() => {
          console.log("인증된 사용자가 /shop 경로에 접근 - 단일 컴포넌트로 연결");
          return <ShopIndex />;
        }}
      </Route>
      
      {/* 쇼핑 카트 접근은 인증된 사용자만 가능 */}
      <Route path="/shop/cart" component={CartPage} />
      
      {/* 상품 상세 페이지 */}
      <Route path="/shop/product/:id">
        {(params) => {
          console.log("인증된 사용자가 상품 상세 페이지 접근:", params.id);
          return <ProductDetailPage />;
        }}
      </Route>
      
      {/* 추가 - 모든 쇼핑 관련 URL 처리 (조금 더 구체적인 경로는 위에서 처리) */}
      <Route path="/shop/*">
        {() => {
          console.log("인증된 사용자가 /shop/* 경로에 접근");
          return <ShopIndex />;
        }}
      </Route>
      
      {/* 쇼핑 로그인 요구 페이지 (인증된 사용자는 /shop으로 리다이렉트) */}
      <Route path="/shop-login-required">
        {() => {
          console.log("인증된 사용자가 shop-login-required 접근 - /shop으로 리다이렉트");
          return <RedirectHandler to="/shop" />;
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

      {/* 매칭되는 경로가 없는 경우 */}
      <Route component={NotFound} />
    </>
  );
}

// 비인증 사용자를 위한 라우트 컴포넌트
function UnauthenticatedRoutesContent() {
  return (
    <>
      {/* 더 구체적인 경로가 먼저 오도록 순서 정렬 */}
      {/* 인증 관련 */}
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/register" component={RegisterPage} />

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

      {/* 쇼핑 로그인 요구 페이지 라우트 - 카트 연결 전 페이지 */}
      <Route path="/shop-login-required">
        {() => {
          console.log("로그인 필요 페이지 - auth로 리다이렉트");
          return <RedirectHandler to="/auth" />;
        }}
      </Route>

      {/* 쇼핑 관련 모든 경로 - 비인증 상태에서도 직접 접근 가능 */}
      <Route path="/shop">
        {() => {
          console.log("비인증 사용자가 /shop 경로에 접근 - 단일 진입점으로 연결");
          return <ShopIndex />;
        }}
      </Route>

      {/* 쇼핑 관련 하위 라우트 - 카트는 계속 인증 필요, 상품 상세는 모든 사용자 접근 가능 */}
      <Route path="/shop/cart">
        {() => {
          console.log("비인증 사용자가 /shop/cart 경로에 접근 - 로그인 필요");
          return <RedirectHandler to="/auth" />;
        }}
      </Route>
      
      <Route path="/shop/product/:id">
        {(params) => {
          console.log("비인증 사용자가 상품 상세 페이지 접근:", params.id);
          return <ProductDetailPage />;
        }}
      </Route>
      
      {/* 모든 쇼핑 관련 URL 통합 처리 */}
      <Route path="/shop/*">
        {() => {
          console.log("비인증 사용자가 /shop/* 경로에 접근");
          return <ShopIndex />;
        }}
      </Route>

      {/* 기타 페이지 */}
      <Route path="/trainers" component={TrainersPage} />
      <Route path="/video-call" component={VideoCallPage} />
      <Route path="/course-reservation" component={CourseReservationPage} />
      <Route path="/locations" component={LocationsPage} />
      <Route path="/modal-test" component={TrainerTest} />

      {/* 매칭되는 경로가 없는 경우 */}
      <Route component={NotFound} />
    </>
  );
}

export default function App() {
  const auth = useAuth();

  // 라우트 설정 - 중요: 인증 여부에 관계 없이 쇼핑 페이지는 접근 가능해야 함
  // 홈 페이지도 인증 여부에 관계없이 동일한 내용이 표시되어야 함
  return (
    <CartProvider>
      <AppLayout>
        <Switch>
          {/* 홈 페이지는 인증 상태에 관계없이 동일한 컴포넌트 사용 */}
          <Route path="/" component={Home} />
          
          {/* 다른 경로는 인증 상태에 따라 다른 컴포넌트 사용 */}
          {auth.isAuthenticated ? (
            <AuthenticatedRoutesContent />
          ) : (
            <UnauthenticatedRoutesContent />
          )}
        </Switch>
      </AppLayout>
    </CartProvider>
  );
}