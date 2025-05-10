import React, { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { AppLayout } from "./layout/AppLayout";
import { useAuth } from "./hooks/useAuth";
import { CartProvider } from "./context/cart-context";
import { RedirectHandler } from "./components/RedirectHandler";

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
// 쇼핑 페이지
import CartPage from "@/pages/Cart"; // 장바구니 페이지
import ShopIndex from "./pages/shop/index"; // 쇼핑 페이지 메인
import ProductDetailPage from "./pages/shop/product"; // 상품 상세 페이지

import VideoTrainingPage from "./pages/video-training/index";
import VideoTrainingDetailPage from "./pages/video-training/video";
import ProfilePage from "./pages/profile/index";
import SettingsPage from "./pages/settings/index";
import NotFound from "./pages/not-found";
import TrainerTest from "./pages/TrainerTest";

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

export default function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <CartProvider>
      <AppLayout>
        <Switch>
          {/* 홈 페이지는 인증 상태와 관계없이 동일한 컴포넌트를 사용 */}
          <Route path="/" component={Home} />
          
          {/* 인증된 사용자를 위한 라우트 */}
          {auth.isAuthenticated && (
            <>
              <Route path="/dashboard">
                {() => {
                  if (!auth.user || !auth.user.role) return <RedirectHandler to="/" />;
                  const allowedRoles = ['pet-owner', 'trainer', 'institute-admin', 'admin'];
                  return allowedRoles.includes(auth.user.role) ? <Dashboard /> : <RedirectHandler to="/" />;
                }}
              </Route>
              <Route path="/my-courses">
                {() => {
                  if (!auth.user || !auth.user.role) return <RedirectHandler to="/" />;
                  const allowedRoles = ['pet-owner'];
                  return allowedRoles.includes(auth.user.role) ? <MyCoursesPage /> : <RedirectHandler to="/" />;
                }}
              </Route>
              <Route path="/my-pets">
                {() => {
                  if (!auth.user || !auth.user.role) return <RedirectHandler to="/" />;
                  const allowedRoles = ['pet-owner'];
                  return allowedRoles.includes(auth.user.role) ? <MyPetsPage /> : <RedirectHandler to="/" />;
                }}
              </Route>
              <Route path="/trainer/dashboard">
                {() => {
                  if (!auth.user || !auth.user.role) return <RedirectHandler to="/" />;
                  const allowedRoles = ['trainer', 'admin'];
                  return allowedRoles.includes(auth.user.role) ? <Dashboard typeProps="trainer" /> : <RedirectHandler to="/" />;
                }}
              </Route>
              <Route path="/institute/dashboard">
                {() => {
                  if (!auth.user || !auth.user.role) return <RedirectHandler to="/" />;
                  const allowedRoles = ['institute-admin', 'admin'];
                  return allowedRoles.includes(auth.user.role) ? <Dashboard typeProps="institute-admin" /> : <RedirectHandler to="/" />;
                }}
              </Route>
              <Route path="/admin/dashboard">
                {() => {
                  if (!auth.user || !auth.user.role) return <RedirectHandler to="/" />;
                  const allowedRoles = ['admin'];
                  return allowedRoles.includes(auth.user.role) ? <Dashboard typeProps="admin" /> : <RedirectHandler to="/" />;
                }}
              </Route>
              <Route path="/trainer/reservations">
                {() => {
                  if (!auth.user || !auth.user.role) return <RedirectHandler to="/" />;
                  const allowedRoles = ['trainer', 'admin'];
                  return allowedRoles.includes(auth.user.role) ? <TrainerReservationsPage /> : <RedirectHandler to="/" />;
                }}
              </Route>
              <Route path="/institute/course-approvals">
                {() => {
                  if (!auth.user || !auth.user.role) return <RedirectHandler to="/" />;
                  const allowedRoles = ['institute-admin', 'admin'];
                  return allowedRoles.includes(auth.user.role) ? <InstituteCourseApprovalsPage /> : <RedirectHandler to="/" />;
                }}
              </Route>
              <Route path="/institute/pet-assignments">
                {() => {
                  if (!auth.user || !auth.user.role) return <RedirectHandler to="/" />;
                  const allowedRoles = ['institute-admin', 'admin'];
                  return allowedRoles.includes(auth.user.role) ? <InstitutePetAssignmentsPage /> : <RedirectHandler to="/" />;
                }}
              </Route>
              <Route path="/notebook/:id">
                {() => {
                  if (!auth.user || !auth.user.role) return <RedirectHandler to="/" />;
                  const allowedRoles = ['pet-owner', 'trainer', 'institute-admin'];
                  return allowedRoles.includes(auth.user.role) ? <NotebookPage /> : <RedirectHandler to="/" />;
                }}
              </Route>
              <Route path="/ai-analysis">
                {() => {
                  if (!auth.user || !auth.user.role) return <RedirectHandler to="/" />;
                  const allowedRoles = ['pet-owner', 'admin'];
                  return allowedRoles.includes(auth.user.role) ? <AIAnalysisPage /> : <RedirectHandler to="/" />;
                }}
              </Route>
              <Route path="/messages" component={MessagesPage} />
              <Route path="/notifications" component={NotificationsPage} />
              <Route path="/profile" component={ProfilePage} />
              <Route path="/settings" component={SettingsPage} />
              
              {/* 쇼핑 - 인증된 사용자 */}
              <Route path="/shop/cart" component={CartPage} />
              <Route path="/shop-login-required">
                {() => <RedirectHandler to="/shop" />}
              </Route>
            </>
          )}
          
          {/* 인증 여부와 관계없이 접근 가능한 공통 라우트 */}
          {/* 쇼핑 관련 라우트 */}
          <Route path="/shop">
            {() => {
              console.log("사용자가 /shop 경로에 접근");
              return <ShopIndex />;
            }}
          </Route>
          <Route path="/shop/product/:id" component={ProductDetailPage} />
          <Route path="/shop/*">
            {() => <ShopIndex />}
          </Route>
          
          {/* 인증이 필요한 쇼핑 기능에 비인증 사용자 접근 시 */}
          {!auth.isAuthenticated && (
            <Route path="/shop/cart">
              {() => <RedirectHandler to="/auth" />}
            </Route>
          )}
          
          {/* 인증 페이지 - 비인증 사용자만 접근 가능 */}
          {!auth.isAuthenticated && (
            <>
              <Route path="/auth/login" component={LoginPage} />
              <Route path="/auth/register" component={RegisterPage} />
              <Route path="/shop-login-required">
                {() => <RedirectHandler to="/auth" />}
              </Route>
            </>
          )}
          
          {/* 공통 콘텐츠 라우트 */}
          <Route path="/courses" component={CoursesPage} />
          <Route path="/course/:id" component={CourseDetail} />
          <Route path="/trainers" component={TrainersPage} />
          <Route path="/institutes" component={InstitutesPage} />
          <Route path="/video-training" component={VideoTrainingPage} />
          <Route path="/video-training/:id" component={VideoTrainingDetailPage} />
          <Route path="/community" component={CommunityPage} />
          <Route path="/community/post/:id">
            {() => (
              <Suspense fallback={<div className="p-8 text-center">게시물 로딩 중...</div>}>
                <CommunityPostDetailPage />
              </Suspense>
            )}
          </Route>
          <Route path="/locations" component={LocationsPage} />
          <Route path="/video-call" component={VideoCallPage} />
          <Route path="/course-reservation" component={CourseReservationPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/events/calendar" component={EventCalendarPage} />
          <Route path="/events/:id">
            {() => (
              <Suspense fallback={<div className="p-8 text-center">이벤트 상세 페이지 로딩 중...</div>}>
                <EventDetailPage />
              </Suspense>
            )}
          </Route>
          
          {/* 도움말 페이지 */}
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
          
          {/* 기관 상세 페이지 */}
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
          
          <Route path="/modal-test" component={TrainerTest} />
          
          {/* 매칭되는 경로가 없는 경우 */}
          <Route component={NotFound} />
        </Switch>
      </AppLayout>
    </CartProvider>
  );
}