import { Switch, Route, useLocation } from "wouter";
import { AppLayout } from "./layout/AppLayout";
import { useAppAuth } from "./hooks/useAuth";
import Dashboard from "@/pages/dashboard";
import Home from "./pages/Home";
import NotFound from "@/pages/not-found";

// Pages
import CoursesPage from "@/pages/courses";
import TrainersPage from "@/pages/trainers";
import InstitutesPage from "@/pages/institutes";
import CommunityPage from "@/pages/community";
import MyCoursesPage from "@/pages/my-courses";
import MyPetsPage from "@/pages/my-pets";
import LocationsPage from "./pages/locations";
import VideoCallPage from "./pages/video-call";
import MessagesPage from "./pages/messages";
import NotificationsPage from "./pages/notifications";
import RecommendationsPage from "./pages/recommendations";
import ShopPage from "./pages/shop";
import ProfilePage from "./pages/profile";
import SettingsPage from "./pages/settings";

// Admin Pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCommissionPage from "@/pages/admin/commission";
import AdminMenuConfigPage from "@/pages/admin/menu-config";
import AdminSettlementPage from "@/pages/admin/settlement";
import AdminUsersPage from "@/pages/admin/users";
import AdminReportsPage from "@/pages/admin/reports";

// Auth Pages
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";

function AuthenticatedRoutes() {
  const auth = useAppAuth();
  const userRole = auth.userRole;

  const getHomeComponent = () => {
    switch(userRole) {
      case 'admin':
        return <AdminDashboard />;
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

  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={getHomeComponent} />

        {/* Common Routes */}
        <Route path="/courses" component={CoursesPage} />
        <Route path="/trainers" component={TrainersPage} />
        <Route path="/institutes" component={InstitutesPage} />
        <Route path="/community" component={CommunityPage} />
        <Route path="/locations" component={LocationsPage} />
        <Route path="/messages" component={MessagesPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/settings" component={SettingsPage} />

        {/* Authenticated User Routes */}
        <Route path="/my-courses" component={MyCoursesPage} />
        <Route path="/my-pets" component={MyPetsPage} />
        <Route path="/video-call" component={VideoCallPage} />
        <Route path="/notifications" component={NotificationsPage} />
        <Route path="/recommendations" component={RecommendationsPage} />
        <Route path="/shop" component={ShopPage} />

        {/* Admin Routes */}
        {userRole === 'admin' && (
          <>
            <Route path="/admin/dashboard" component={AdminDashboard} />
            <Route path="/admin/commission" component={AdminCommissionPage} />
            <Route path="/admin/menu-config" component={AdminMenuConfigPage} />
            <Route path="/admin/settlement" component={AdminSettlementPage} />
            <Route path="/admin/users" component={AdminUsersPage} />
            <Route path="/admin/reports" component={AdminReportsPage} />
          </>
        )}

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
        <Route path="/courses" component={CoursesPage} />
        <Route path="/trainers" component={TrainersPage} />
        <Route path="/institutes" component={InstitutesPage} />
        <Route path="/community" component={CommunityPage} />
        <Route path="/" component={Home} />
        <Route path="/:rest*">
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
  const auth = useAppAuth();

  if (auth.isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return auth.isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />;
}

export default App;