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
import ProfilePage from "./pages/profile";
import SettingsPage from "./pages/settings";
import NotFound from "./pages/not-found";

// Auth Pages
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";

function AuthenticatedRoutes() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={user?.role === 'admin' ? Dashboard : Home} />
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