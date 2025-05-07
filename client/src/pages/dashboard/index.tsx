
import { useAuth } from "../../SimpleApp";
import PetOwnerDashboard from "./pet-owner";
import TrainerDashboard from "./trainer";
import InstituteAdminDashboard from "./institute-admin";
import AdminDashboard from "./admin";

interface DashboardProps {
  type?: 'pet-owner' | 'trainer' | 'institute-admin' | 'admin';
}

export default function Dashboard({ type }: DashboardProps) {
  const { userRole, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
  }

  // 사용자 역할에 따라 대시보드 렌더링
  if (!userRole) {
    return <div>권한이 없습니다</div>;
  }

  switch (userRole) {
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
