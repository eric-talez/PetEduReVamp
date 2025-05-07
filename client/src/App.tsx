import React, { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { AppLayout } from "./layout/AppLayout";
import { useAuth } from "./SimpleApp";

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
import ShopPage from "./pages/shop/index";
import VideoTrainingPage from "./pages/video-training/index";
import VideoTrainingDetailPage from "./pages/video-training/video";
import ProfilePage from "./pages/profile/index";
import SettingsPage from "./pages/settings/index";
import NotFound from "./pages/not-found";
import TrainerTest from "./pages/TrainerTest";
import TrainerReservationsPage from "./pages/trainer-dashboard/reservations";
import InstituteCourseApprovalsPage from "./pages/institute-dashboard/course-approvals";
import EventsPage from "./pages/events/index";
import EventCalendarPage from "./pages/events/calendar";

// 지연 로딩되는 컴포넌트들
const EventDetailPage = lazy(() => import('./pages/events/event-detail'));
const CommunityPostDetailPage = lazy(() => import('./pages/community/post-detail'));
const InstituteRegisterPage = lazy(() => import('./pages/institutes/register'));
const InstituteDetailPage = lazy(() => import('./pages/institutes/detail'));

// Help 페이지들
const FAQPage = lazy(() => import('./pages/help/faq'));
const GuidePage = lazy(() => import('./pages/help/guide'));
const AboutPage = lazy(() => import('./pages/help/about'));
const ContactPage = lazy(() => import('./pages/help/contact'));

// Auth Pages
import LoginPage from "./pages/auth/login";
// 임시로 로그인 페이지를 재사용 (회원가입 페이지가 아직 없을 경우)
import RegisterPage from "./pages/auth/login";

console.log('App initialized - CourseDetail component:', CourseDetail);

function AuthenticatedRoutes() {
  const { userRole } = useAuth();

  const checkAccess = (allowedRoles: string[]) => {
    if (!userRole) return false;
    return allowedRoles.includes(userRole);
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
        <Route path="/messages" component={MessagesPage} />
        <Route path="/notifications" component={NotificationsPage} />
        <Route path="/shop" component={ShopPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/events" component={EventsPage} />
        <Route path="/events/calendar" component={EventCalendarPage} />
        <Route path="/events/:id">
          {() => (
            <Suspense fallback={<div className="p-8 text-center">이벤트 상세 페이지 로딩 중...</div>}>
              <EventDetailPage />
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
        <Route path="/auth/login" component={LoginPage} />
        <Route path="/auth/register" component={RegisterPage} />
        <Route path="/" component={Home} />
        <Route path="/courses" component={CoursesPage} />
        <Route path="/course/:id" component={CourseDetail} />
        <Route path="/video-training" component={VideoTrainingPage} />
        <Route path="/video-training/:id" component={VideoTrainingDetailPage} />
        <Route path="/trainers" component={TrainersPage} />
        <Route path="/institutes" component={InstitutesPage} />
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
        <Route path="/community" component={CommunityPage} />
        <Route path="/community/post/:id">
          {() => (
            <Suspense fallback={<div className="p-8 text-center">게시물 로딩 중...</div>}>
              <CommunityPostDetailPage />
            </Suspense>
          )}
        </Route>
        <Route path="/video-call" component={VideoCallPage} />
        <Route path="/course-reservation" component={CourseReservationPage} />
        <Route path="/locations" component={LocationsPage} />
        <Route path="/events" component={EventsPage} />
        <Route path="/events/calendar" component={EventCalendarPage} />
        <Route path="/events/:id">
          {() => (
            <Suspense fallback={<div className="p-8 text-center">이벤트 상세 페이지 로딩 중...</div>}>
              <EventDetailPage />
            </Suspense>
          )}
        </Route>
        <Route path="/modal-test" component={TrainerTest} />
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

  return auth.isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />;
}