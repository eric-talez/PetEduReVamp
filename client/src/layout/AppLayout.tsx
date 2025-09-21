import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { SimpleChatBot } from "@/components/ui/SimpleChatBot";
import { useAuth } from "@/hooks/useAuth";
import SkipLink from "@/components/accessibility/SkipLink";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { useLocation } from "wouter";
import { Home, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppBreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumbs?: AppBreadcrumbItem[];
  headerActions?: ReactNode;
  className?: string;
  contentClassName?: string;
  showBreadcrumbs?: boolean;
}

// Helper function to generate automatic breadcrumbs from URL path
const generateBreadcrumbs = (location: string): AppBreadcrumbItem[] => {
  const pathSegments = location.split('/').filter(Boolean);
  const breadcrumbs: AppBreadcrumbItem[] = [
    { label: '홈', href: '/' }
  ];

  // Route mapping for better breadcrumb labels
  const routeLabels: Record<string, string> = {
    dashboard: '대시보드',
    courses: '강의',
    community: '커뮤니티',
    shop: '쇼핑',
    trainers: '훈련사',
    institutes: '기관',
    profile: '프로필',
    settings: '설정',
    admin: '관리자',
    'my-courses': '내 강의',
    'my-pets': '내 반려동물',
    messages: '메시지',
    notifications: '알림',
    analytics: '분석',
    events: '이벤트',
    locations: '위치',
    help: '도움말',
    auth: '인증'
  };

  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeLabels[segment] || segment;
    const isLast = index === pathSegments.length - 1;
    
    breadcrumbs.push({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      href: isLast ? undefined : currentPath,
      current: isLast
    });
  });

  return breadcrumbs;
};

export function AppLayout({ 
  children, 
  title, 
  breadcrumbs, 
  headerActions, 
  className,
  contentClassName,
  showBreadcrumbs = true 
}: AppLayoutProps) {
  const { isAuthenticated, userRole } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    // localStorage에서 저장된 사이드바 확장 상태 가져오기
    const savedState = localStorage.getItem('sidebarExpanded');
    if (savedState !== null) {
      return savedState === 'true';
    }
    return true; // 기본값은 확장된 상태
  });
  
  // 자동 생성된 breadcrumbs 또는 수동으로 전달받은 breadcrumbs 사용
  const finalBreadcrumbs = breadcrumbs || generateBreadcrumbs(location);
  
  // 화면 크기에 따라 모바일 여부 확인
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // 사이드바 크기 토글 핸들러
  const toggleSidebarSize = () => {
    const newState = !sidebarExpanded;
    setSidebarExpanded(newState);
    
    try {
      localStorage.setItem('sidebarExpanded', String(newState));
    } catch (e) {
      console.error('사이드바 상태 저장 오류:', e);
    }
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* 키보드 사용자를 위한 스킵 링크 추가 */}
      <SkipLink contentId="main-content" />
      
      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
      />
      
      {/* 사이드바 - 확장/축소 지원 */}
      <div className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] z-20 transition-all duration-300",
        sidebarExpanded ? "w-64" : "w-[70px]",
        isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
      )}>
        <Sidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          userRole={userRole}
          isAuthenticated={isAuthenticated}
          expanded={sidebarExpanded}
          onToggleExpand={toggleSidebarSize}
        />
      </div>
      
      {/* 컨텐츠 영역 */}
      <div className={cn(
        "transition-all duration-300",
        !isMobile ? (sidebarExpanded ? "ml-64" : "ml-[70px]") : "ml-0",
        "pt-16 min-h-screen"
      )}>
        {/* Breadcrumbs 영역 */}
        {showBreadcrumbs && finalBreadcrumbs.length > 1 && (
          <nav 
            className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16 z-10"
            aria-label="Breadcrumb"
          >
            <div className="container mx-auto px-4 py-3">
              <Breadcrumb>
                <BreadcrumbList>
                  {finalBreadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center">
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {crumb.href && !crumb.current ? (
                          <BreadcrumbLink href={crumb.href} className="flex items-center gap-2">
                            {index === 0 && <Home className="h-4 w-4" />}
                            {crumb.label}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage className="flex items-center gap-2">
                            {index === 0 && <Home className="h-4 w-4" />}
                            {crumb.label}
                          </BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </nav>
        )}

        {/* 페이지 헤더 */}
        {title && (
          <header className="border-b border-border bg-background">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {title}
                  </h1>
                </div>
                {headerActions && (
                  <div className="flex items-center space-x-2">
                    {headerActions}
                  </div>
                )}
              </div>
            </div>
          </header>
        )}
        
        {/* 메인 컨텐츠 영역 - 표준화된 컨테이너와 패딩 */}
        <main 
          id="main-content"
          aria-label="메인 콘텐츠"
          tabIndex={-1}
          className={cn(
            "flex-1 outline-none",
            // 기본 컨테이너 스타일 - 페이지에서 오버라이드 가능
            !contentClassName?.includes('container') && "container mx-auto",
            !contentClassName?.includes('p-') && !contentClassName?.includes('px-') && "px-4",
            !contentClassName?.includes('p-') && !contentClassName?.includes('py-') && "py-6",
            contentClassName
          )}
        >
          {children}
        </main>
      </div>
      
      {/* 모바일에서 사이드바가 열릴 때 오버레이 */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          role="presentation"
        />
      )}

      {/* 챗봇 컴포넌트 */}
      <SimpleChatBot />
    </div>
  );
}