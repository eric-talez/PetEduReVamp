import { Switch, Route } from "wouter";
import { AppLayout } from "./layout/AppLayout";
import Dashboard from "@/pages/dashboard";
import Courses from "@/pages/courses";
import Trainers from "@/pages/trainers";
import Institutes from "@/pages/institutes";
import Community from "@/pages/community";
import MyCourses from "@/pages/my-courses";
import MyPets from "@/pages/my-pets";
import Login from "@/pages/auth/login";
import NotFound from "@/pages/not-found";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import LocationsPage from "./pages/locations";
import VideoCallPage from "./pages/video-call";
import MessagesPage from "./pages/messages";
import AdminCommissionPage from "./pages/admin/commission";
import AdminMenuConfigPage from "./pages/admin/menu-config";
import AdminSettlementPage from "./pages/admin/settlement";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/auth" component={Login} />
        <Route path="/:rest*">
          {() => {
            window.location.href = "/auth";
            return null;
          }}
        </Route>
      </Switch>
    );
  }

  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/courses" component={Courses} />
        <Route path="/trainers" component={Trainers} />
        <Route path="/institutes" component={Institutes} />
        <Route path="/community" component={Community} />
        <Route path="/my-courses" component={MyCourses} />
        <Route path="/my-pets" component={MyPets} />
        <Route path="/video-training" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">영상 훈련</h1><p>영상으로 진행하는 훈련 컨텐츠를 볼 수 있는 페이지입니다.</p></div>} />
        <Route path="/video-call" component={VideoCallPage} />
        <Route path="/shop" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">쇼핑</h1><p>반려견 용품을 구매할 수 있는 쇼핑몰 페이지입니다.</p></div>} />
        <Route path="/notifications" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">알림장</h1><p>훈련사와 소통하고 훈련 진행상황을 확인할 수 있는 알림장 페이지입니다.</p></div>} />
        <Route path="/locations" component={LocationsPage} />
        <Route path="/recommendations" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">맞춤 추천</h1><p>반려견 프로필과 사용자 선호도 기반 맞춤형 추천 서비스 페이지입니다.</p></div>} />
        <Route path="/messages" component={MessagesPage} />
        <Route path="/admin/commission" component={AdminCommissionPage} />
        <Route path="/admin/menu-config" component={AdminMenuConfigPage} />
        <Route path="/admin/settlement" component={AdminSettlementPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
