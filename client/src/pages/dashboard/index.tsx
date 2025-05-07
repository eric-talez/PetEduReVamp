
import { useEffect } from "react";
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
  
  useEffect(() => {
    // 대시보드 진입 로깅
    console.log(`Dashboard accessed - User Role: ${userRole}`);
  }, [userRole]);

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
  }

  // 대시보드 타입이 지정되지 않은 경우 사용자 역할 기반으로 결정
  const dashboardType = type || userRole;

  // 권한별 대시보드 렌더링 및 클릭 이벤트 처리
  const handleDashboardClick = (action: string, data?: any) => {
    console.log(`Dashboard action: ${action}`, data);
    // 여기에 추가적인 클릭 이벤트 처리 로직 구현
  };

  switch (dashboardType) {
    case "pet-owner":
      return <PetOwnerDashboard onAction={handleDashboardClick} />;
    case "trainer":
      return <TrainerDashboard onAction={handleDashboardClick} />;
    case "institute-admin":
      return <InstituteAdminDashboard onAction={handleDashboardClick} />;
    case "admin":
      return <AdminDashboard onAction={handleDashboardClick} />;
    default:
      return <PetOwnerDashboard onAction={handleDashboardClick} />; 
  }
}
