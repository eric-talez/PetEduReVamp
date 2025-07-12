import { Link, useLocation, useRoute } from "wouter";
import { BarChart } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useEffect, createContext, useContext, useCallback } from "react";
import { SpecialShopLink } from "./SpecialShopLink";
import { HelpSection } from "./HelpSection";
import { StatisticsSection } from "./StatisticsSection";
import { AccessibleIconButton } from "./AccessibleIconButton";
import { AccessibleMenuToggle } from "./AccessibleMenuToggle";
import { AccessibleNavItem } from "./AccessibleNavItem";
import { SidebarMenuGroup } from "./SidebarMenuGroup";
import { ScrollReveal } from "@/components/ui/AnimatedContent";
import { useQuery } from "@tanstack/react-query";

import { AccessibilityFloatingButton } from "@/components/ui/AccessibilityControls";
import {
  Home,
  Users,
  BookOpen,
  Calendar,
  Settings,
  User,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bell,
  HelpCircle,
  LogOut,
  MapPin,
  Navigation,
  Award,
  UserCheck,
  Video,
  MessageCircle,
  Shield,
  Building,
  TrendingUp,
  FileText,
  BarChart3,
  Package,
  GraduationCap,
  UserRoundCheck,
  CalendarDays,
  CheckCircle,
  Eye,
  EyeOff,
  Sun,
  UserPlus,
  Moon,
  ChevronDown,
  ChevronUp,
  Briefcase,
  ClipboardList,
  Star,
  CreditCard,
  Activity,
  MessageSquare,
  Heart as PawPrint,
  Edit3 as Edit,
  Square as CheckSquare,
  UserCog,
  Wrench,
  Monitor as Presentation,
  Monitor,
  Play as VideoIcon,
  Sparkles,
  Bot,
  ThumbsUp,
  ShoppingBag,
  LogIn,
  ChevronsLeft,
  ChevronsRight,
  Percent,
  DollarSign,
  Image as ImageIcon
} from "lucide-react";

// 사이드바 컨텍스트 생성
export interface SidebarContextType {
  expanded: boolean;
  toggleSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  expanded: true,
  toggleSidebar: () => {}
});

// NavItem 컴포넌트 정의
interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  onClick?: (path: string) => void;
  show: boolean; // 추가: 권한에 따른 메뉴 표시 여부
}

function NavItem({ href, icon, children, active, onClick, show }: NavItemProps) {
  const { expanded } = useContext(SidebarContext);
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 기본 동작 방지하고 커스텀 라우팅 로직 사용
    e.preventDefault();

    if (onClick) {
      onClick(href);
    } else {
      console.log("기본 네비게이션 시도:", href);
      // onClick이 없는 경우 window.location 사용 (임시 조치)
      window.location.href = href;
    }
  };

  if (!show) return null;

  // 접힌 상태에서는 툴팁으로 표시
  if (!expanded) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={href}
              className={cn(
                "sidebar-link flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out px-2 group",
                active ? "bg-primary/10 text-primary" : "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-primary/5"
              )}
              onClick={handleClick}
              aria-label={typeof children === 'string' ? children : children?.toString()}
            >
              <div className="transition-all duration-200 group-hover:scale-110 group-hover:rotate-6">
                {icon}
              </div>
            </a>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{children}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // 확장된 상태에서는 일반 메뉴 아이템으로 표시
  return (
    <a
      href={href}
      className={cn(
        "sidebar-link flex items-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out px-3 group",
        active ? "bg-primary/10 text-primary" : "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-primary/5"
      )}
      onClick={handleClick}
      aria-current={active ? "page" : undefined}
    >
      <div className="transition-all duration-200 group-hover:scale-110 group-hover:rotate-6 mr-3">
        {icon}
      </div>
      <span className="transition-all duration-200 group-hover:translate-x-1">{children}</span>
    </a>
  );
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  userRole: string | null;
  isAuthenticated: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export function Sidebar({ 
  open, 
  onClose, 
  userRole, 
  isAuthenticated,
  expanded: externalExpanded,
  onToggleExpand
}: SidebarProps) {
  console.log('Sidebar render - userRole:', userRole, 'isAuthenticated:', isAuthenticated);
  const [location, setLocation] = useLocation();
  const [internalExpanded, setInternalExpanded] = useState(true);

  // 외부에서 제어되는 상태 또는 내부 상태 사용
  const expanded = externalExpanded !== undefined ? externalExpanded : internalExpanded;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        if (onToggleExpand) {
          // 외부 상태 사용
        } else {
          setInternalExpanded(true);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [onToggleExpand]);

  // 간소화된 메뉴 그룹 상태 초기화
  const [menuGroups, setMenuGroups] = useState(() => {
    const savedMenuGroups = localStorage.getItem('menuGroups');
    if (savedMenuGroups) {
      try {
        return JSON.parse(savedMenuGroups);
      } catch (e) {
        console.error('저장된 메뉴 그룹 상태 파싱 오류:', e);
      }
    }

    return {
      main: true,         // 메인 메뉴
      learning: false,    // 학습 메뉴
      management: false,  // 운영 관리 메뉴
      tools: false,       // 도구 메뉴
      admin: false        // 관리자 메뉴
      //shopping: false
    };
  });

  useEffect(() => {
    console.log('Sidebar useEffect - userRole:', userRole, 'isAuthenticated:', isAuthenticated);

    // 권한별 메뉴 표시 권한 확인
    const isInstituteAdmin = userRole === 'institute-admin';
    const isAdmin = userRole === 'admin';
    const isTrainer = userRole === 'trainer';
    const isPetOwner = userRole === 'pet-owner';

    // 권한별 서비스 접근 가능 여부
    const canAccessNotebook = isPetOwner || isTrainer || isInstituteAdmin || isAdmin;
    const canAccessConsultation = isPetOwner || isTrainer || isInstituteAdmin || isAdmin;
    const canAccessCourses = isPetOwner || isTrainer || isInstituteAdmin || isAdmin;
    const canAccessMessaging = isPetOwner || isTrainer || isInstituteAdmin || isAdmin;

    console.log('권한 체크 - 기관 관리자:', isInstituteAdmin, '관리자:', isAdmin, '훈련사:', isTrainer);

    // 로그인 상태가 변경되면 메뉴 그룹 상태 업데이트
    setMenuGroups((prevGroups: Record<string, boolean>) => {
      // 권한에 따른 값 업데이트
      const updatedMenuGroups = {
        ...prevGroups,
        trainer: isTrainer || isAdmin,
        institute: isInstituteAdmin || isAdmin || isAdmin,
        admin: isAdmin,
        // 로그인 상태에 따라 메뉴 그룹 표시/숨김 처리
        myLearning: isAuthenticated ? prevGroups.myLearning : false,
        features: isAuthenticated ? prevGroups.features : false
      };

      // localStorage에 업데이트된 메뉴 상태 저장
      try {
        localStorage.setItem('menuGroups', JSON.stringify(updatedMenuGroups));
        console.log('메뉴 그룹 상태가 localStorage에 저장됨:', updatedMenuGroups);
      } catch (e) {
        console.error('메뉴 그룹 상태 저장 오류:', e);
      }

      console.log('메뉴 그룹 업데이트:', updatedMenuGroups);
      return updatedMenuGroups;
    });
  }, [userRole, isAuthenticated]);

  const toggleSidebar = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  // 메뉴 그룹 토글 함수 - 개선된 에러 처리
  const toggleMenuGroup = useCallback((groupId: string) => {
    setMenuGroups((prev: Record<string, boolean>) => {
      const updated = {
        ...prev,
        [groupId]: !prev[groupId]
      };

      // localStorage에 상태 저장 - 안전한 처리
      try {
        const serializedState = JSON.stringify(updated);
        localStorage.setItem('menuGroupStates', serializedState);
        console.log(`✅ 메뉴 그룹 [${groupId}] 상태 변경:`, updated[groupId] ? '열림' : '닫힘');
      } catch (error) {
        console.error('❌ localStorage 저장 실패:', error);
        // localStorage 실패 시에도 UI 상태는 업데이트
      }

      return updated;
    });
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const handleItemClick = (path: string) => {
    // path 값 검증
    if (!path || typeof path !== 'string') {
      console.warn('잘못된 경로:', path);
      return;
    }

    console.log(`메뉴 클릭: ${path} (사용자 역할: ${userRole || '비로그인'})`);

    // 특정 페이지 접근 권한 및 라우팅 처리
    const publicPaths = [
      "/", "/courses", "/trainers", "/video-training", "/video-call", "/community",
      "/institutes", "/institutes/register", "/events", "/events/calendar",
      "/help/faq", "/help/guide", "/help/about", "/help/contact", "/shop", "/locations",
      "/consultation", "/location-finder", "/facilities"
    ];

    // 로그인 필요한 페이지 접근 시
    if (!isAuthenticated && !publicPaths.includes(path) && 
        !path.startsWith('/institutes/') && 
        !path.startsWith('/events/') && 
        !path.startsWith('/help/')) {
      console.log('로그인 필요: ', path);

      // 로딩 표시를 위한 오버레이 요소 생성
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black/30 z-50 flex items-center justify-center';
      overlay.innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
          <div class="animate-spin w-6 h-6 border-3 border-primary border-t-transparent rounded-full mb-3"></div>
          <p class="mb-4">로그인이 필요한 서비스입니다</p>
          <p class="text-sm text-gray-500 mb-4">로그인 페이지로 이동합니다...</p>
        </div>
      `;
      document.body.appendChild(overlay);

      // 약간의 지연 후 페이지 이동 (로딩 표시가 보이도록)
      setTimeout(() => {
        try {
          if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
          }
        } catch (e) {
          console.log('오버레이 제거 중 오류:', e);
        }

        // 페이지 이동 시도 (여러 방식으로 시도)
        try {
          setLocation('/auth');
        } catch (e) {
          console.log('setLocation 실패, window.location 사용:', e);
          window.location.href = '/auth';
        }
      }, 1500);
      return;
    }

    // 역할별 접근 제한
    if (isAuthenticated) {
      // 훈련사 전용 페이지
      if ((path.startsWith('/trainer-dashboard') || path.startsWith('/trainer/')) && userRole !== 'trainer' && userRole !== 'admin' && userRole !== 'institute-admin') {
        console.log('훈련사 권한 필요');

        // 접근 제한 알림 표시
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/30 z-50 flex items-center justify-center';
        overlay.innerHTML = `
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div class="text-amber-500 mb-3"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>
            <p class="text-lg font-medium mb-2">접근 권한이 없습니다</p>
            <p class="text-sm text-gray-500 mb-4">이 페이지는 훈련사 권한이 필요합니다.</p>
            <button class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">확인</button>
          </div>
        `;

        document.body.appendChild(overlay);

        // 확인 버튼 클릭 시 오버레이 제거 및 홈으로 이동
        const button = overlay.querySelector('button');
        if (button) {
          button.addEventListener('click', () => {
            document.body.removeChild(overlay);
            window.location.href = '/';
          });
        }

        return;
      }

      // 기관 관리자 전용 페이지
      if ((path.startsWith('/institute-dashboard') || path.startsWith('/institute/')) && userRole !== 'institute-admin' && userRole !== 'admin') {
        console.log('기관 관리자 권한 필요');

        // 접근 제한 알림 표시
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/30 z-50 flex items-center justify-center';
        overlay.innerHTML = `
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div class="text-amber-500 mb-3"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>
            <p class="text-lg font-medium mb-2">접근 권한이 없습니다</p>
            <p class="text-sm text-gray-500 mb-4">이 페이지는 기관 관리자 권한이 필요합니다.</p>
            <button class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">확인</button>
          </div>
        `;

        document.body.appendChild(overlay);

        // 확인 버튼 클릭 시 오버레이 제거 및 홈으로 이동
        const button = overlay.querySelector('button');
        if (button) {
          button.addEventListener('click', () => {
            document.body.removeChild(overlay);
            window.location.href = '/';
          });
        }

        return;
      }

      // 시스템 관리자 전용 페이지
      if (path.startsWith('/admin') && userRole !== 'admin') {
        console.log('관리자 권한 필요');

        // 접근 제한 알림 표시
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/30 z-50 flex items-center justify-center';
        overlay.innerHTML = `
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div class="text-amber-500 mb-3"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>
            <p class="text-lg font-medium mb-2">접근 권한이 없습니다</p>
            <p class="text-sm text-gray-500 mb-4">이 페이지는 시스템 관리자 권한이 필요합니다.</p>
            <button class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">확인</button>
          </div>
        `;

        document.body.appendChild(overlay);

        // 확인 버튼 클릭 시 오버레이 제거 및 홈으로 이동
        const button = overlay.querySelector('button');
        if (button) {
          button.addEventListener('click', () => {
            document.body.removeChild(overlay);
            window.location.href = '/';
          });
        }

        return;
      }
    }

    // 특수 페이지 처리
    const specialRoutes: Record<string, string> = {
      '/video-training': '영상 훈련',
      '/video-call': '화상 수업',
      '/ai-analysis': 'AI 분석',
      '/my-pets': '반려견 관리',
      '/notebook': '알림장',
      '/calendar': '교육 일정',
      '/education-schedule': '교육 일정',
      '/alerts': '알림',
      '/notifications': '알림'  // /notifications를 요청하면 /alerts로 처리
      // '/shop' 항목은 제거 - 사이드바에서 직접 새 창으로 열기 처리
    };

    // 쇼핑 페이지는 새 창에서 열기
    if (path === '/shop') {
      console.log('쇼핑 페이지를 새 창에서 열기');
      window.open('https://replit.com/join/wshpfpjewg-hnblgkjw', '_blank', 'noopener,noreferrer');
      // 모바일 화면에서만 사이드바 닫기
      if (onClose && window.innerWidth < 768) onClose();
      return;
    }

    // SPA 라우팅 함수
    const navigateToPage = (targetPath: string) => {
      console.log(`페이지 이동: ${targetPath}`);

      // wouter를 사용한 SPA 라우팅
      setLocation(targetPath);

      // 모바일 화면에서만 사이드바 닫기
      if (onClose && window.innerWidth < 768) onClose();
    };

    if (path in specialRoutes) {
      console.log(`${specialRoutes[path]} 페이지로 이동 중...`);
      // /notifications를 /alerts로 리다이렉션
      if (path === '/notifications') {
        console.log('알림 페이지로 리다이렉션: /alerts');
        navigateToPage('/alerts');
      } else {
        navigateToPage(path);
      }
      return;
    }

    // 일반 페이지 라우팅
    navigateToPage(path);
  };

  // 동적 로고 로딩
  const { data: logoData } = useQuery({
    queryKey: ['/api/admin/logo'],
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 30000 // 30초
  });

  const contextValue = {
    expanded,
    toggleSidebar
  };

  // 사용자 권한에 따른 메뉴 표시 여부 결정 - 문자열 비교로 명확하게 처리
  const showDashboardLink = userRole !== null;
  const showTrainerMenu = userRole === 'trainer' || userRole === 'admin';
  const showInstituteMenu = userRole === 'institute-admin' || userRole === 'admin';
  const showAdminMenu = userRole === 'admin';
  const showPetOwnerMenu = userRole === 'pet-owner' || userRole === 'admin';
  const showBasicMenu = true; // 모든 사용자가 접근 가능한 메뉴
  const isPetOwner = userRole === 'pet-owner';

  // 이 useEffect는 중복되므로 제거 (위에서 이미 처리됨)

  console.log('메뉴 표시 상태 - 기관 관리자 메뉴:', showInstituteMenu, '(역할:', userRole, ')');
  console.log('메뉴 그룹 상태:', menuGroups);


  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        className={cn(
          "fixed left-0 top-0 bottom-0 h-screen bg-white dark:bg-gray-900 transform transition-all duration-300 ease-in-out shadow-md z-20 flex flex-col",
          expanded ? "w-64" : "w-[70px]"
        )}
      >
        <div className="h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 px-3 transition-all duration-300">
          {expanded ? (
            <ScrollReveal direction="left" delay={100}>
              <a href="/" className="flex items-center justify-center w-full h-full group">
                <img 
                  src={logoData?.expandedLogo || "/logo-light.svg"} 
                  alt="TALEZ 로고" 
                  className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
                />
              </a>
            </ScrollReveal>
          ) : (
            <a href="/" className="flex items-center justify-center w-full h-full transition-all duration-300 hover:scale-110">
              <img 
                src={logoData?.compactLogo || "/logo-compact.svg"} 
                alt="TALEZ" 
                className="w-full h-full object-contain transition-all duration-300 hover:scale-105"
              />
            </a>
          )}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={expanded ? "사이드바 접기" : "사이드바 펼치기"}
            aria-expanded={expanded}
            title={expanded ? "사이드바 접기" : "사이드바 펼치기"}
          >
            {expanded ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
          </button>
        </div>

        <ScrollArea className={cn("flex-1", expanded ? "px-3" : "px-2")}>
          <div className="py-4 space-y-1 w-full min-h-min relative">
            {/* 비로그인 상태 메뉴 */}
            {!isAuthenticated ? (
              <>
                <SidebarMenuGroup
                  expanded={expanded}
                  title="메인 메뉴"
                  groupName="main"
                  isOpen={menuGroups.main}
                  toggleGroup={toggleMenuGroup}
                  icon={<Home className="w-5 h-5 text-gray-500" />}
                />

                {menuGroups.main && (
                  <>
                    <AccessibleNavItem 
                      href="/" 
                      icon={<Home className="w-5 h-5 mr-2" />}
                      hoverIcon={<PawPrint className="w-5 h-5 mr-2 text-primary" />}
                      active={isActive("/")} 
                      onClick={handleItemClick} 
                      show={true}
                    >홈</AccessibleNavItem>
                    <AccessibleNavItem 
                      href="/courses" 
                      icon={<GraduationCap className="w-5 h-5 mr-2" />}
                      hoverIcon={<BookOpen className="w-5 h-5 mr-2 text-primary" />}
                      active={isActive("/courses")} 
                      onClick={handleItemClick} 
                      show={true}
                    >강의 찾기</AccessibleNavItem>
                    <AccessibleNavItem 
                      href="/trainers" 
                      icon={<UserRoundCheck className="w-5 h-5 mr-2" />}
                      hoverIcon={<Award className="w-5 h-5 mr-2 text-primary" />}
                      active={isActive("/trainers")} 
                      onClick={handleItemClick} 
                      show={true}
                    >전문가 찾기</AccessibleNavItem>
                    <AccessibleNavItem 
                      href="/location-finder" 
                      icon={<MapPin className="w-5 h-5 mr-2" />}
                      hoverIcon={<Navigation className="w-5 h-5 mr-2 text-primary" />}
                      active={isActive("/location-finder")} 
                      onClick={handleItemClick} 
                      show={true}
                    >위치 찾기</AccessibleNavItem>
                    <AccessibleNavItem 
                      href="/community" 
                      icon={<MessageSquare className="w-5 h-5 mr-2" />}
                      hoverIcon={<Users className="w-5 h-5 mr-2 text-primary" />}
                      active={isActive("/community")} 
                      onClick={handleItemClick} 
                      show={true}
                    >커뮤니티</AccessibleNavItem>
                  </>
                )}

                {/* 특별 메뉴는 비로그인 상태에서 숨김 처리 */}

                {/* 쇼핑몰 메뉴 그룹 (항상 표시) */}
                <SidebarMenuGroup
                  expanded={expanded}
                  title="쇼핑"
                  groupName="shopping"
                  isOpen={menuGroups.shopping}
                  toggleGroup={toggleMenuGroup}
                  icon={<ShoppingBag className="w-5 h-5 text-gray-500" />}
                />

                {/* 쇼핑몰 메뉴 그룹 내용 */}
                {menuGroups.shopping && (
                  <div className={cn("mt-1 pl-2", !expanded && "pl-0")}>
                    <SpecialShopLink expanded={expanded}>쇼핑몰</SpecialShopLink>
                  </div>
                )}

                {/* 비로그인 상태에서 특별 메뉴 내용도 숨김 처리 */}

                {expanded ? (
                  <div className="flex items-center mx-auto mt-4 px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-sm w-full">
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">반려견 교육 시작하기</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">회원가입 후 맞춤형 교육을 경험하세요.</p>
                    </div>
                    <Link
                      href="/auth/login"
                      className="bg-primary hover:bg-primary/90 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors inline-block text-center"
                    >
                      로그인
                    </Link>
                  </div>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="/auth/login"
                          className="flex items-center justify-center py-2 px-2 mt-4 bg-primary hover:bg-primary/90 text-white rounded-lg mx-auto w-[48px]"
                          aria-label="로그인"
                        >
                          <LogIn className="w-5 h-5" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>로그인</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {/* Help Section 컴포넌트 통합 */}
                {!expanded ? (
                  <div className="mt-4 flex flex-col items-center space-y-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 flex justify-center cursor-pointer" 
                            onClick={() => handleItemClick('/help/faq')}
                          >
                            <HelpCircle className="w-5 h-5 text-primary" aria-label="도움말" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>도움말 및 지원</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  /* 확장된 상태에서는 기존 HelpSection 컴포넌트 사용 */
                  <HelpSection expanded={expanded} handleItemClick={handleItemClick} />
                )}

                {/* 독립적인 StatisticsSection 컴포넌트 사용 */}
                <StatisticsSection expanded={expanded} />
              </>
            ) : (
              /* 로그인 상태 메뉴 */
              <>
                {/* 메인 메뉴 */}
                <SidebarMenuGroup
                  expanded={expanded}
                  title="메인"
                  groupName="main"
                  isOpen={menuGroups.main}
                  toggleGroup={toggleMenuGroup}
                  icon={<Home className="w-5 h-5 text-gray-500" />}
                />

                {menuGroups.main && (
                  <>
                    <AccessibleNavItem href="/" icon={<Home className="w-5 h-5 mr-2" />} hoverIcon={<PawPrint className="w-5 h-5 mr-2 text-primary" />} active={isActive("/")} onClick={handleItemClick} show={true}>홈</AccessibleNavItem>
                    {showDashboardLink && <AccessibleNavItem href="/dashboard" icon={<BarChart3 className="w-5 h-5 mr-2" />} hoverIcon={<TrendingUp className="w-5 h-5 mr-2 text-primary" />} active={isActive("/dashboard")} onClick={handleItemClick} show={true}>대시보드</AccessibleNavItem>}
                    <AccessibleNavItem href="/courses" icon={<GraduationCap className="w-5 h-5 mr-2" />} hoverIcon={<BookOpen className="w-5 h-5 mr-2 text-primary" />} active={isActive("/courses")} onClick={handleItemClick} show={true}>강의 찾기</AccessibleNavItem>
                    <AccessibleNavItem href="/trainers" icon={<UserRoundCheck className="w-5 h-5 mr-2" />} hoverIcon={<Award className="w-5 h-5 mr-2 text-primary" />} active={isActive("/trainers")} onClick={handleItemClick} show={true}>전문가 찾기</AccessibleNavItem>
                    <AccessibleNavItem href="/location-finder" icon={<MapPin className="w-5 h-5 mr-2" />} hoverIcon={<Navigation className="w-5 h-5 mr-2 text-primary" />} active={isActive("/location-finder")} onClick={handleItemClick} show={true}>위치 찾기</AccessibleNavItem>
                    <AccessibleNavItem href="/community" icon={<MessageSquare className="w-5 h-5 mr-2" />} hoverIcon={<Users className="w-5 h-5 mr-2 text-primary" />} active={isActive("/community")} onClick={handleItemClick} show={true}>커뮤니티</AccessibleNavItem>
                    <SpecialShopLink expanded={expanded}>쇼핑몰</SpecialShopLink>
                  </>
                )}

                {/* 학습 메뉴 (견주) */}
                {showPetOwnerMenu && (
                  <>
                    <SidebarMenuGroup expanded={expanded} title="학습" groupName="learning" isOpen={menuGroups.learning} toggleGroup={toggleMenuGroup} icon={<BookOpen className="w-5 h-5 text-gray-500" />} />
                    {menuGroups.learning && (
                      <>
                        <AccessibleNavItem href="/my-courses" icon={<GraduationCap className="w-5 h-5 mr-2" />} hoverIcon={<BookOpen className="w-5 h-5 mr-2 text-primary" />} active={isActive("/my-courses")} onClick={handleItemClick} show={true}>나의 학습</AccessibleNavItem>
                        <AccessibleNavItem href="/my-pets" icon={<PawPrint className="w-5 h-5 mr-2" />} hoverIcon={<Award className="w-5 h-5 mr-2 text-primary" />} active={isActive("/my-pets")} onClick={handleItemClick} show={true}>반려견 관리</AccessibleNavItem>
                        <AccessibleNavItem href="/consultation" icon={<MessageCircle className="w-5 h-5 mr-2" />} hoverIcon={<MessageSquare className="w-5 h-5 mr-2 text-primary" />} active={isActive("/consultation")} onClick={handleItemClick} show={true}>내 상담 현황</AccessibleNavItem>
                        <AccessibleNavItem href="/my-trainers" icon={<UserRoundCheck className="w-5 h-5 mr-2" />} hoverIcon={<Users className="w-5 h-5 mr-2 text-primary" />} active={isActive("/my-trainers")} onClick={handleItemClick} show={true}>내 훈련사</AccessibleNavItem>
                        <AccessibleNavItem href="/pet-care/health-record" icon={<Activity className="w-5 h-5 mr-2" />} hoverIcon={<TrendingUp className="w-5 h-5 mr-2 text-primary" />} active={isActive("/pet-care/health-record")} onClick={handleItemClick} show={true}>건강 관리</AccessibleNavItem>
                        <AccessibleNavItem href="/notebook" icon={<Edit className="w-5 h-5 mr-2" />} hoverIcon={<MessageSquare className="w-5 h-5 mr-2 text-primary" />} active={isActive("/notebook")} onClick={handleItemClick} show={true}>알림장</AccessibleNavItem>
                        <AccessibleNavItem href="/education-schedule" icon={<Calendar className="w-5 h-5 mr-2" />} hoverIcon={<CheckSquare className="w-5 h-5 mr-2 text-primary" />} active={isActive("/education-schedule")} onClick={handleItemClick} show={true}>일정 관리</AccessibleNavItem>
                      </>
                    )}
                  </>
                )}

                {/* 운영 관리 (훈련사/기관) */}
                {(showTrainerMenu || showInstituteMenu) && (
                  <>
                    <SidebarMenuGroup expanded={expanded} title="운영 관리" groupName="management" isOpen={menuGroups.management} toggleGroup={toggleMenuGroup} icon={<UserCog className="w-5 h-5 text-gray-500" />} />
                    {menuGroups.management && (
                      <>

                    <AccessibleNavItem href="/trainer/courses" icon={<BookOpen className="w-5 h-5 mr-2" />} hoverIcon={<GraduationCap className="w-5 h-5 mr-2 text-primary" />} active={isActive("/trainer/courses")} onClick={handleItemClick} show={true}>내 강좌</AccessibleNavItem>
                    <AccessibleNavItem href="/trainer/notebook" icon={<FileText className="w-5 h-5 mr-2" />} hoverIcon={<Edit className="w-5 h-5 mr-2 text-primary" />} active={isActive("/trainer/notebook")} onClick={handleItemClick} show={true}>알림장 관리</AccessibleNavItem>
                    <AccessibleNavItem href="/trainer/students" icon={<Users className="w-5 h-5 mr-2" />} hoverIcon={<UserCheck className="w-5 h-5 mr-2 text-primary" />} active={isActive("/trainer/students")} onClick={handleItemClick} show={true}>학생 관리</AccessibleNavItem>

                        {(showTrainerMenu || showInstituteMenu) && <AccessibleNavItem href="/trainer/earnings" icon={<DollarSign className="w-5 h-5 mr-2" />} active={isActive("/trainer/earnings")} onClick={handleItemClick} show={true}>수익 관리</AccessibleNavItem>}
                        {showInstituteMenu && <AccessibleNavItem href="/institute/trainers" icon={<UserCog className="w-5 h-5 mr-2" />} active={isActive("/institute/trainers")} onClick={handleItemClick} show={true}>훈련사 관리</AccessibleNavItem>}
                        {showInstituteMenu && <AccessibleNavItem href="/institute/facility" icon={<Building className="w-5 h-5 mr-2" />} active={isActive("/institute/facility")} onClick={handleItemClick} show={true}>시설 관리</AccessibleNavItem>}
                        {showInstituteMenu && <AccessibleNavItem href="/institute/notebook-monitor" icon={<FileText className="w-5 h-5 mr-2" />} hoverIcon={<Monitor className="w-5 h-5 mr-2 text-primary" />} active={isActive("/institute/notebook-monitor")} onClick={handleItemClick} show={true}>알림장 모니터링</AccessibleNavItem>}
                      </>
                    )}
                  </>
                )}

                {/* 도구 */}
                <SidebarMenuGroup expanded={expanded} title="도구" groupName="tools" isOpen={menuGroups.tools} toggleGroup={toggleMenuGroup} icon={<Wrench className="w-5 h-5 text-gray-500" />} />
                {menuGroups.tools && (
                  <>
                    <AccessibleNavItem href="/video-training" icon={<Video className="w-5 h-5 mr-2" />} hoverIcon={<Presentation className="w-5 h-5 mr-2 text-primary" />} active={isActive("/video-training")} onClick={handleItemClick} show={true}>영상 훈련</AccessibleNavItem>
                    <AccessibleNavItem href="/video-call" icon={<VideoIcon className="w-5 h-5 mr-2" />} hoverIcon={<Users className="w-5 h-5 mr-2 text-primary" />} active={isActive("/video-call")} onClick={handleItemClick} show={true}>화상 수업</AccessibleNavItem>
                    <AccessibleNavItem href="/ai-analysis" icon={<Sparkles className="w-5 h-5 mr-2" />} hoverIcon={<Bot className="w-5 h-5 mr-2 text-primary" />} active={isActive("/ai-analysis")} onClick={handleItemClick} show={true}>AI 도우미</AccessibleNavItem>
                    <AccessibleNavItem href="/messages" icon={<MessageSquare className="w-5 h-5 mr-2" />} hoverIcon={<ThumbsUp className="w-5 h-5 mr-2 text-primary" />} active={isActive("/messages")} onClick={handleItemClick} show={true}>메시지</AccessibleNavItem>
                    <AccessibleNavItem href="/alerts" icon={<Bell className="w-5 h-5 mr-2" />} hoverIcon={<Activity className="w-5 h-5 mr-2 text-primary" />} active={isActive("/alerts")} onClick={handleItemClick} show={true}>알림</AccessibleNavItem>
                    {(showTrainerMenu || showInstituteMenu) && <AccessibleNavItem href="/analytics" icon={<BarChart3 className="w-5 h-5 mr-2" />} hoverIcon={<TrendingUp className="w-5 h-5 mr-2 text-primary" />} active={isActive("/analytics")} onClick={handleItemClick} show={true}>분석 리포트</AccessibleNavItem>}
                  </>
                )}

                {/* 시스템 관리 (관리자) */}
                {showAdminMenu && (
                  <>
                    <SidebarMenuGroup expanded={expanded} title="시스템 관리" groupName="admin" isOpen={menuGroups.admin} toggleGroup={toggleMenuGroup} icon={<Settings className="w-5 h-5 text-gray-500" />} />
                    {menuGroups.admin && (
                      <>
                        <AccessibleNavItem href="/admin/curriculum" icon={<BookOpen className="w-5 h-5 mr-2" />} hoverIcon={<GraduationCap className="w-5 h-5 mr-2 text-primary" />} active={isActive("/admin/curriculum")} onClick={handleItemClick} show={true}>커리큘럼 관리</AccessibleNavItem>
                        <AccessibleNavItem href="/admin/registrations" icon={<UserPlus className="w-5 h-5 mr-2" />} hoverIcon={<UserCheck className="w-5 h-5 mr-2 text-primary" />} active={isActive("/admin/registrations")} onClick={handleItemClick} show={true}>등록 신청 관리</AccessibleNavItem>
                        <AccessibleNavItem href="/admin/trainer-certification" icon={<Award className="w-5 h-5 mr-2" />} hoverIcon={<Shield className="w-5 h-5 mr-2 text-primary" />} active={isActive("/admin/trainer-certification")} onClick={handleItemClick} show={true}>훈련사 인증 관리</AccessibleNavItem>
                        <AccessibleNavItem href="/admin/users" icon={<Settings className="w-5 h-5 mr-2" />} active={isActive("/admin/users")} onClick={handleItemClick} show={true}>시스템 관리</AccessibleNavItem>
                        <AccessibleNavItem href="/admin/members-status" icon={<Users className="w-5 h-5 mr-2" />} active={isActive("/admin/members-status")} onClick={handleItemClick} show={true}>회원 현황</AccessibleNavItem>
                        <AccessibleNavItem href="/admin/institutes" icon={<Building className="w-5 h-5 mr-2" />} active={isActive("/admin/institutes")} onClick={handleItemClick} show={true}>기관 관리</AccessibleNavItem>
                        <AccessibleNavItem href="/admin/business-registration" icon={<Building className="w-5 h-5 mr-2" />} active={isActive("/admin/business-registration")} onClick={handleItemClick} show={true}>업체 등록</AccessibleNavItem>
                        <AccessibleNavItem href="/admin/review-management" icon={<MessageSquare className="w-5 h-5 mr-2" />} active={isActive("/admin/review-management")} onClick={handleItemClick} show={true}>리뷰 관리</AccessibleNavItem>
                        <AccessibleNavItem href="/admin/info-correction-requests" icon={<Edit className="w-5 h-5 mr-2" />} active={isActive("/admin/info-correction-requests")} onClick={handleItemClick} show={true}>정보 수정 요청</AccessibleNavItem>
                        <AccessibleNavItem href="/admin/contents" icon={<ImageIcon className="w-5 h-5 mr-2" />} active={isActive("/admin/contents")} onClick={handleItemClick} show={true}>콘텐츠 관리</AccessibleNavItem>
                        <AccessibleNavItem href="/admin/commissions" icon={<Percent className="w-5 h-5 mr-2" />} active={isActive("/admin/commissions")} onClick={handleItemClick} show={true}>수수료 관리</AccessibleNavItem>
                        <AccessibleNavItem href="/admin/shop" icon={<ShoppingBag className="w-5 h-5 mr-2" />} active={isActive("/admin/shop")} onClick={handleItemClick} show={true}>쇼핑몰 관리</AccessibleNavItem>
                      </>
                    )}
                  </>
                )}

                {/* Help & Statistics */}
                {!expanded ? (
                  <div className="mt-4 flex flex-col items-center space-y-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 flex justify-center cursor-pointer" onClick={() => handleItemClick('/help/faq')}>
                            <HelpCircle className="w-5 h-5 text-primary" aria-label="도움말" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right"><p>도움말 및 지원</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <HelpSection expanded={expanded} handleItemClick={handleItemClick} />
                )}
                <StatisticsSection expanded={expanded} />
              </>
            )}
          </div>
        </ScrollArea>

        <div className={`p-4 ${expanded ? "" : "text-center"}`}>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {expanded ? (
              <>
                <div className="flex items-center justify-between">
                  <span>© 2025 Talez</span>
                  <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                    {userRole || '비로그인'}
                  </span>
                </div>
                <div className="mt-1">v1.2.0</div>
              </>
            ) : (
              <span className="block py-1 px-2 rounded bg-gray-100 dark:bg-gray-800 text-center text-xs">
                {userRole === 'admin' ? '관리자' : 
                 userRole === 'trainer' ? '훈련사' : 
                 userRole === 'institute-admin' ? '기관' :
                 userRole === 'pet-owner' ? '견주' : '비로그인'}
              </span>
            )}
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

// Add service inspection menu for admin role.