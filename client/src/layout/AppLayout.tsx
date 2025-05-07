import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/hooks/useAuth";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && (
        <>
          <Sidebar />
          <TopBar />
        </>
      )}
      <main className={`${isAuthenticated ? 'ml-64 pt-16' : 'pt-16'}`}> {/* Added pt-16 for non-authenticated users */}
        {children}
      </main>
    </div>
  );
}