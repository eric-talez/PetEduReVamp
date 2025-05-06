import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { ReactNode, useState } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      {/* 모바일에서 사이드바가 열렸을 때 배경 오버레이 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="lg:pl-64 pt-16">
        {children}
      </main>
    </div>
  );
}
