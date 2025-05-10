import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { NewSidebar } from "@/components/NewSidebar"; // 새로운 사이드바 컴포넌트 추가
import { TopBar } from "@/components/TopBar";
import { Chatbot } from "@/components/features/Chatbot";
import { useAuth } from "../SimpleApp";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, userRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // 화면 크기에 따라 모바일 여부 확인
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // 초기 로드 시 확인
    checkMobile();
    
    // 리사이즈 이벤트 처리
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  console.log("AppLayout 렌더링 - isAuthenticated:", isAuthenticated, "sidebarOpen:", sidebarOpen);
  
  return (
    <div className="min-h-screen bg-background">
      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
      />
      
      {/* 모든 사용자에게 사이드바 표시 (인증 여부와 관계없이) */}
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        userRole={userRole}
        isAuthenticated={isAuthenticated}
      />
      
      {/* 컨텐츠 영역: 화면 크기와 인증 여부에 따라 여백 조정 */}
      <main 
        className={`pt-16 transition-all duration-300 ${
          isAuthenticated && !isMobile ? 'lg:ml-64' : ''
        } ${
          isAuthenticated && isMobile && sidebarOpen ? 'ml-0' : ''
        }`}
      >
        {children}
      </main>
      
      {/* 모바일에서 사이드바가 열릴 때 오버레이 */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 챗봇 컴포넌트 */}
      <Chatbot />
    </div>
  );
}