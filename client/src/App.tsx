import { Switch, Route } from "wouter";
import { AppLayout } from "./layout/AppLayout";
import { useAuth } from "./SimpleApp";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CoursesPage from "./pages/courses/index";
import TrainersPage from "./pages/trainers/index";
import InstitutesPage from "./pages/institutes/index";
import CommunityPage from "./pages/community/index";
import MyCoursesPage from "./pages/my-courses/index";
import MyPetsPage from "./pages/my-pets/index";
import LocationsPage from "./pages/locations/index";
import VideoCallPage from "./pages/video-call/index";
import MessagesPage from "./pages/messages/index";
import NotificationsPage from "./pages/notifications/index";
import ShopPage from "./pages/shop/index";
import ProfilePage from "./pages/profile/index";
import SettingsPage from "./pages/settings/index";
import NotFound from "./pages/not-found";

// Auth Pages
import LoginPage from "./pages/auth/login";
// 임시로 로그인 페이지를 재사용 (회원가입 페이지가 아직 없을 경우)
import RegisterPage from "./pages/auth/login";

function AuthenticatedRoutes() {
  const { userRole } = useAuth();

  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/courses" component={CoursesPage} />
        <Route path="/trainers" component={TrainersPage} />
        <Route path="/institutes" component={InstitutesPage} />
        <Route path="/community" component={CommunityPage} />
        <Route path="/my-courses" component={MyCoursesPage} />
        <Route path="/my-pets" component={MyPetsPage} />
        <Route path="/locations" component={LocationsPage} />
        <Route path="/video-call" component={VideoCallPage} />
        <Route path="/messages" component={MessagesPage} />
        <Route path="/notifications" component={NotificationsPage} />
        <Route path="/shop" component={ShopPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/settings" component={SettingsPage} />
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

export default function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return auth.isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />;
}