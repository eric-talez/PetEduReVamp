import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import Dashboard from "@/pages/Dashboard";
import SplashPage from "@/pages/SplashPage";
import RegisterPage from "@/pages/RegisterPage";
import PendingApprovalPage from "@/pages/PendingApprovalPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <SplashPage isLoading={true} />;
  }

  if (!isAuthenticated) {
    return <SplashPage />;
  }

  const registrationCompleted = user?.registrationCompleted === 'true' || (user?.registrationCompleted as unknown) === true;
  const approvalStatus = user?.approvalStatus;
  const isAdmin = user?.role === 'admin';
  const isApproved = approvalStatus === 'approved';

  if (!registrationCompleted && !isAdmin) {
    return (
      <Switch>
        <Route path="/register" component={RegisterPage} />
        <Route>
          <Redirect to="/register" />
        </Route>
      </Switch>
    );
  }

  if (!isApproved && !isAdmin) {
    return (
      <Switch>
        <Route path="/pending-approval" component={PendingApprovalPage} />
        <Route>
          <Redirect to="/pending-approval" />
        </Route>
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/pending-approval" component={PendingApprovalPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
