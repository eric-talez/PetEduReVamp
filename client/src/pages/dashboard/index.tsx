
import { useEffect, useState } from "react";
import { useAuth } from "../../SimpleApp";
import PetOwnerDashboard from "./pet-owner";
import TrainerDashboard from "./trainer";
import InstituteAdminDashboard from "./institute-admin";
import AdminDashboard from "./admin";
import { DogLoading } from "../../components/DogLoading";
import { OnboardingGuide } from "@/components/ui/Onboarding";

interface DashboardProps {
  type?: 'pet-owner' | 'trainer' | 'institute-admin' | 'admin';
}

export default function Dashboard({ type }: DashboardProps) {
  // 온보딩 상태 관리
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // 전역 상태에서 인증 정보 직접 확인
  const globalAuth = (window as any).__peteduAuthState;
  
  // 로컬 상태와 전역 상태 둘 다 확인
  const auth = useAuth();
  // 전역 상태가 있으면 우선 사용
  const authState = globalAuth || auth;
  
  // 상태 추출
  const userRole = authState?.userRole || auth?.userRole;
  const isAuthenticated = authState?.isAuthenticated || auth?.isAuthenticated;
  
  useEffect(() => {
    // 대시보드 진입 로깅 - 디버깅용
    console.log(`Dashboard accessed - User Role: ${userRole}`);
    console.log('Dashboard component auth state:', auth);
    
    // 전역에 설정된 인증 상태도 확인
    if ((window as any).__peteduAuthState) {
      console.log('Global auth state:', (window as any).__peteduAuthState);
    }

    // 온보딩 비활성화 - 팝업 표시 중지
    setShowOnboarding(false);
    
    // 온보딩 완료 상태로 저장 (로컬 스토리지)
    localStorage.setItem('talez_onboarding_completed', 'true');
  }, [userRole, auth]);

  // 인증 상태 체크 (로딩 상태도 확인)
  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">
      <DogLoading message="대시보드 로딩 중..." size="large" />
    </div>;
  }

  // 대시보드 타입이 지정되지 않은 경우 사용자 역할 기반으로 결정
  const dashboardType = type || userRole;

  // 권한별 대시보드 렌더링 및 클릭 이벤트 처리
  const handleDashboardClick = (action: string, data?: any) => {
    console.log(`Dashboard action: ${action}`, data);
    // 여기에 추가적인 클릭 이벤트 처리 로직 구현
  };

  // 대시보드 선택 및 온보딩 가이드 렌더링
  const renderDashboard = () => {
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
  };

  return (
    <>
      {renderDashboard()}
      
      {/* 온보딩 가이드 - 사용자 역할에 맞는 가이드 제공 */}
      {showOnboarding && (
        <OnboardingGuide 
          forceShow={true} 
          onComplete={() => {
            console.log('온보딩 완료');
            setShowOnboarding(false);
          }} 
        />
      )}
    </>
  );
}
