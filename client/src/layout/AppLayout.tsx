import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/hooks/useAuth";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const auth = useAuth();
  console.log("AppLayout 렌더링 - auth:", auth);

  return (
    <div className="min-h-screen bg-background">
      {auth.isAuthenticated && (
        <>
          <Sidebar />
          <TopBar />
        </>
      )}
      <main className={`${auth.isAuthenticated ? 'ml-64 pt-16' : 'pt-16'}`}> {/* Added pt-16 for non-authenticated users */}
        {children}
      </main>
    </div>
  );
}