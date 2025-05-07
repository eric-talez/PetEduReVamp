import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { ReactNode, useState } from "react";
import { useAuth } from "../SimpleApp";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // 인증 정보를 직접 전달하기 위해 가져옴
  const auth = useAuth();

  console.log("AppLayout 렌더링 - auth:", auth);

  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <div className="flex">
        {/* 사이드바 - 인증 정보 직접 전달 */}
        <div className="fixed inset-y-0 left-0 z-50">
          <Sidebar 
            open={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            userRole={auth.userRole} 
            isAuthenticated={auth.isAuthenticated} 
          />
        </div>
        
        {/* 모바일에서 사이드바가 열렸을 때 배경 오버레이 */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
          {/* 상단바 */}
          <TopBar
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          
          {/* 메인 컨텐츠 */}
          <main className="flex-1 pt-16">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
