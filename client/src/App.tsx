
import { Switch, Route } from "wouter";
import { AppLayout } from "./layout/AppLayout";
import { useAuth } from "./hooks/useAuth";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/dashboard";
import CoursesPage from "./pages/courses";
import TrainersPage from "./pages/trainers";
import InstitutesPage from "./pages/institutes";
import CommunityPage from "./pages/community";
import MyCoursesPage from "./pages/my-courses";
import MyPetsPage from "./pages/my-pets";
import LocationsPage from "./pages/locations";
import VideoCallPage from "./pages/video-call";
import MessagesPage from "./pages/messages";
import NotificationsPage from "./pages/notifications";
import ShopPage from "./pages/shop";
import ProfilePage from "./pages/my-page";
import NotFound from "./pages/not-found";

// Admin Pages
import MenuConfig from "./pages/admin/menu-config";
import Commission from "./pages/admin/commission";
import Settlement from "./pages/admin/settlement";

// Auth Pages
import LoginPage from "./pages/auth/login";

function AuthenticatedRoutes() {
  const { user } = useAuth();

  const getHomeComponent = () => {
    switch(user?.role) {
      case 'admin':
        return <Dashboard type="admin" />;
      case 'trainer':
        return <Dashboard type="trainer" />;
      case 'institute-admin':
        return <Dashboard type="institute" />;
      case 'pet-owner':
        return <Dashboard type="pet-owner" />;
      default:
        return <Home />;
    }
  };

  // 공통 라우트 
  const commonRoutes = (
    <>
      <Route path="/courses" component={CoursesPage} />
      <Route path="/trainers" component={TrainersPage} />
      <Route path="/institutes" component={InstitutesPage} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/profile" component={ProfilePage} />
    </>
  );

  // 반려인 전용 라우트
  const petOwnerRoutes = (
    <>
      <Route path="/my-courses" component={MyCoursesPage} />
      <Route path="/my-pets" component={MyPetsPage} />
      <Route path="/locations" component={LocationsPage} />
      <Route path="/video-call" component={VideoCallPage} />
      <Route path="/messages" component={MessagesPage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/shop" component={ShopPage} />
    </>
  );

  // 관리자 전용 라우트
  const adminRoutes = (
    <>
      <Route path="/admin/menu-config" component={MenuConfig} />
      <Route path="/admin/commission" component={Commission} />
      <Route path="/admin/settlement" component={Settlement} />
    </>
  );

  return (
    <AppLayout>
      <Switch>
        <Route path="/">{getHomeComponent}</Route>
        {commonRoutes}
        {user?.role === 'admin' && adminRoutes}
        {(user?.role === 'pet-owner' || user?.role === 'admin') && petOwnerRoutes}
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
        <Route path="/courses" component={CoursesPage} />
        <Route path="/trainers" component={TrainersPage} />
        <Route path="/institutes" component={InstitutesPage} />
        <Route path="/community" component={CommunityPage} />
        <Route path="/" component={Home} />
        <Route>
          {() => {
            window.location.href = "/auth/login";
            return null;
          }}
        </Route>
      </Switch>
    </AppLayout>
  );
}

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return auth.isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />;
}

export default App;
