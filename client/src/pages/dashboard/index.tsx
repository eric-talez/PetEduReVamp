
import { useAuth } from "../../SimpleApp";
import PetOwnerDashboard from "./pet-owner";
import TrainerDashboard from "./trainer";
import InstituteAdminDashboard from "./institute-admin";
import AdminDashboard from "./admin";

interface DashboardProps {
  type?: 'pet-owner' | 'trainer' | 'institute' | 'admin';
}

export default function Dashboard({ type }: DashboardProps) {
  const { userRole, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
  }

  // 대시보드 타입이 지정되지 않은 경우 사용자 역할 기반으로 결정
  const dashboardType = type || userRole;

  switch (dashboardType) {
    case "pet-owner":
      return <PetOwnerDashboard />;
    case "trainer":
      return <TrainerDashboard />;
    case "institute-admin":
      return <InstituteAdminDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <PetOwnerDashboard />; 
  }
}
