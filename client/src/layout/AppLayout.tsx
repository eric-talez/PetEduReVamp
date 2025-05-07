import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "../SimpleApp";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, userRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      {isAuthenticated && (
        <Sidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          userRole={userRole}
          isAuthenticated={isAuthenticated}
        />
      )}
      <main className={`${isAuthenticated ? 'ml-64 pt-16' : 'pt-16'}`}> {/* Added pt-16 for non-authenticated users */}
        {children}
      </main>
    </div>
  );
}