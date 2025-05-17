import { Link, useLocation, useRoute } from "wouter";
import { BarChart } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useEffect, createContext, useContext } from "react";
import { SpecialShopLink } from "./SpecialShopLink";
import { HelpSection } from "./HelpSection";
import { StatisticsSection } from "./StatisticsSection";
import { AccessibleIconButton } from "./AccessibleIconButton";
import { AccessibleMenuToggle } from "./AccessibleMenuToggle";
import { AccessibleNavItem } from "./AccessibleNavItem";
import { SidebarMenuGroup } from "./SidebarMenuGroup";
import { useSeasonalTheme } from "@/hooks/use-seasonal-theme";
import {
  ChevronDown,
  ChevronRight,
  Home,
  GraduationCap,
  UserRoundCheck,
  Building,
  MessageSquare,
  BookOpen,
  PawPrint,
  Calendar,
  Award,
  Presentation,
  Edit,
  Users,
  LineChart,
  AreaChart,
  Cog,
  UserCog,
  CheckSquare,
  Wrench,
  Video,
  VideoIcon,
  ShoppingBag,
  Bell,
  MapPin,
  ThumbsUp,
  Store,
  LogIn,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  Activity,
  HelpCircle,
  Brain,
  BarChart2,
  Sparkles,
  CreditCard,
  Settings,
  Percent,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Gift,
  Tag,
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
                "sidebar-link flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out px-2",
                active ? "bg-primary/10 text-primary" : "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
              )}
              onClick={handleClick}
              aria-label={typeof children === 'string' ? children : children?.toString()}
            >
              {icon}
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
        "sidebar-link flex items-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out px-3",
        active ? "bg-primary/10 text-primary" : "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
      )}
      onClick={handleClick}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span>{children}</span>
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

  // 메뉴 그룹 상태 초기화 - localStorage에서 이전 상태 불러오기
  const [menuGroups, setMenuGroups] = useState(() => {
    // localStorage에서 저장된 메뉴 그룹 상태 가져오기
    const savedMenuGroups = localStorage.getItem('menuGroups');
    if (savedMenuGroups) {
      try {
        return JSON.parse(savedMenuGroups);
      } catch (e) {
        console.error('저장된 메뉴 그룹 상태 파싱 오류:', e);
      }
    }
    
    // 기본값 (모두 닫힌 상태로 시작)
    return {
      main: false,
      features: false,
      myLearning: false,
      trainer: false,
      institute: false,
      admin: false,
      shopping: false
    };
  });
  
  useEffect(() => {
    console.log('Sidebar useEffect - userRole:', userRole);
    
    // 기관 관리자 및 관리자 권한 확인
    const isInstituteAdmin = userRole === 'institute-admin';
    const isAdmin = userRole === 'admin';
    const isTrainer = userRole === 'trainer';
    
    console.log('권한 체크 - 기관 관리자:', isInstituteAdmin, '관리자:', isAdmin, '훈련사:', isTrainer);
    
    // 기존 menuGroups 값 가져오기
    setMenuGroups((prevGroups: Record<string, boolean>) => {
      // 권한에 따른 값만 업데이트
      const updatedMenuGroups = {
        ...prevGroups,
        trainer: isTrainer || isAdmin,
        institute: isInstituteAdmin || isAdmin,
        admin: isAdmin
      };
      
      console.log('메뉴 그룹 업데이트:', updatedMenuGroups);
      return updatedMenuGroups;
    });
  }, [userRole]);

  const toggleSidebar = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const toggleMenuGroup = (group: string) => {
    console.log(`토글 메뉴 그룹: ${group}, 현재 상태: ${menuGroups[group as keyof typeof menuGroups]}`);
    setMenuGroups((prev: Record<string, boolean>) => {
      // 타입 안전성 보장을 위한 접근 방식
      const currentState = group in prev ? prev[group] : false;
      const newState = {
        ...prev,
        [group]: !currentState
      };
      
      // localStorage에 저장
      try {
        localStorage.setItem('menuGroups', JSON.stringify(newState));
      } catch (e) {
        console.error('메뉴 그룹 상태 저장 오류:', e);
      }
      
      console.log(`메뉴 상태 변경 후: ${group} = ${!currentState}`);
      return newState;
    });
  };

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const handleItemClick = (path: string) => {
    console.log(`메뉴 클릭: ${path} (사용자 역할: ${userRole || '비로그인'})`);

    // 특정 페이지 접근 권한 및 라우팅 처리
    const publicPaths = [
      "/", "/courses", "/trainers", "/video-training", "/video-call", "/community",
      "/institutes", "/institutes/register", "/events", "/events/calendar",
      "/help/faq", "/help/guide", "/help/about", "/help/contact", "/shop", "/locations"
    ];

    // 로그인 필요한 페이지 접근 시
    if (!isAuthenticated && !publicPaths.includes(path) && 
        !path.startsWith('/institutes/') && 
        !path.startsWith('/events/') && 
        !path.startsWith('/help/')) {
      console.log('로그인 필요: ', path);
      window.location.href = "/auth/login";
      return;
    }

    // 역할별 접근 제한
    if (isAuthenticated) {
      // 훈련사 전용 페이지
      if ((path.startsWith('/trainer-dashboard') || path.startsWith('/trainer/')) && userRole !== 'trainer' && userRole !== 'admin') {
        console.log('훈련사 권한 필요');
        window.location.href = "/";
        return;
      }

      // 기관 관리자 전용 페이지
      if ((path.startsWith('/institute-dashboard') || path.startsWith('/institute/')) && userRole !== 'institute-admin' && userRole !== 'admin') {
        console.log('기관 관리자 권한 필요');
        window.location.href = "/";
        return;
      }

      // 시스템 관리자 전용 페이지
      if (path.startsWith('/admin') && userRole !== 'admin') {
        console.log('관리자 권한 필요');
        window.location.href = "/";
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

    if (path in specialRoutes) {
      console.log(`${specialRoutes[path]} 페이지로 이동 중...`);
      // /notifications를 /alerts로 리다이렉션
      if (path === '/notifications') {
        console.log('알림 페이지로 리다이렉션: /alerts');
        window.location.href = '/alerts';
      } else {
        window.location.href = path;
      }
      // 모바일 화면에서만 사이드바 닫기
      if (onClose && window.innerWidth < 768) onClose();
      return;
    }

    // 일반 페이지 라우팅 - 모바일 화면에서만 사이드바 닫기
    console.log('페이지 이동:', path);
    window.location.href = path;
    // 모바일 화면에서만 사이드바 닫기 (창 크기가 작을 때)
    if (onClose && window.innerWidth < 768) onClose();
  };

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
            <a href="/" className="flex flex-col items-center w-full group">
              <span className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                PetEdu<span className="text-primary transition-all duration-300 group-hover:scale-110">Platform</span>
                <span className="ml-1 opacity-80">{useSeasonalTheme().getSeasonEmoji()}</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">반려견 전문 교육 플랫폼</span>
            </a>
          ) : (
            <a href="/" className="flex items-center justify-center w-full transition-all duration-300 hover:scale-110">
              <span className="text-2xl font-bold text-primary">P</span>
              <span className="absolute -top-1 -right-1 text-xs">{useSeasonalTheme().getSeasonEmoji()}</span>
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
            {/* 계절 효과 표시 */}
            <span className="absolute top-2 right-0 text-xs opacity-70 pointer-events-none">
              {useSeasonalTheme().getSeasonEmoji()}
            </span>
            {/* 비로그인 상태 메뉴 */}
            {!isAuthenticated ? (
              <>
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
                      active={isActive("/")} 
                      onClick={(path) => {
                        console.log("비회원 메뉴 클릭:", path);
                        handleItemClick(path);
                      }} 
                      show={true}
                    >홈</AccessibleNavItem>
                    <AccessibleNavItem 
                      href="/courses" 
                      icon={<GraduationCap className="w-5 h-5 mr-2" />} 
                      active={isActive("/courses")} 
                      onClick={(path) => {
                        console.log("강의 탐색 메뉴 클릭:", path);
                        handleItemClick(path);
                      }} 
                      show={true}
                    >강의 탐색</AccessibleNavItem>
                    <AccessibleNavItem 
                      href="/trainers" 
                      icon={<UserRoundCheck className="w-5 h-5 mr-2" />} 
                      active={isActive("/trainers")} 
                      onClick={(path) => {
                        console.log("훈련사 찾기 메뉴 클릭:", path);
                        handleItemClick(path);
                      }} 
                      show={true}
                    >훈련사 찾기</AccessibleNavItem>
                    <AccessibleNavItem 
                      href="/locations" 
                      icon={<MapPin className="w-5 h-5 mr-2" />} 
                      active={isActive("/locations")} 
                      onClick={(path) => {
                        console.log("비회원이 위치 서비스 클릭");
                        // 위치 서비스 메뉴는 비회원도 접근 가능
                        handleItemClick(path);
                      }} 
                      show={true}
                    >위치 서비스</AccessibleNavItem>
                    <AccessibleNavItem 
                      href="/video-training" 
                      icon={<Video className="w-5 h-5 mr-2" />} 
                      active={isActive("/video-training")} 
                      onClick={(path) => {
                        console.log("영상 훈련 메뉴 클릭:", path);
                        handleItemClick(path);
                      }} 
                      show={true}
                    >영상 훈련</AccessibleNavItem>
                    <AccessibleNavItem 
                      href="/video-call" 
                      icon={<VideoIcon className="w-5 h-5 mr-2" />} 
                      active={isActive("/video-call")} 
                      onClick={(path) => {
                        console.log("화상 수업 메뉴 클릭:", path);
                        handleItemClick(path);
                      }} 
                      show={true}
                    >화상 수업</AccessibleNavItem>
                    <AccessibleNavItem 
                      href="/community" 
                      icon={<MessageSquare className="w-5 h-5 mr-2" />} 
                      active={isActive("/community")} 
                      onClick={(path) => {
                        console.log("비회원이 커뮤니티 클릭");
                        handleItemClick(path);
                      }} 
                      show={true}
                    >커뮤니티</AccessibleNavItem>
                    <AccessibleNavItem 
                      href="/events" 
                      icon={<Calendar className="w-5 h-5 mr-2" />} 
                      active={isActive("/events")} 
                      onClick={(path) => {
                        console.log("비회원이 이벤트 메뉴 클릭");
                        handleItemClick(path);
                      }} 
                      show={true}
                    >이벤트</AccessibleNavItem>
                    <AccessibleNavItem 
                      href="/ai-chatbot" 
                      icon={<Sparkles className="w-5 h-5 mr-2" />} 
                      active={isActive("/ai-chatbot")} 
                      onClick={(path) => {
                        console.log("비회원이 AI 챗봇 메뉴 클릭");
                        handleItemClick(path);
                      }} 
                      show={true}
                    >AI 챗봇</AccessibleNavItem>
                    <AccessibleNavItem 
                      href="/shop" 
                      icon={<Store className="w-5 h-5 mr-2" />} 
                      active={isActive("/shop")} 
                      onClick={(path) => {
                        console.log("쇼핑몰 메뉴 클릭");
                        // 새 창에서 쇼핑몰 열기
                        window.open("https://replit.com/join/wshpfpjewg-hnblgkjw", "_blank");
                      }} 
                      show={true}
                    >쇼핑몰</AccessibleNavItem>
                  </>
                )}
                
                <SidebarMenuGroup
                  expanded={expanded}
                  title="특별 메뉴"
                  groupName="features"
                  isOpen={menuGroups.features}
                  toggleGroup={toggleMenuGroup}
                  icon={<Gift className="w-5 h-5 text-gray-500" />}
                />

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
                
                {menuGroups.features && (
                  <>
                    {/* features 메뉴 그룹 내용 */}
                  </>
                )}

                {expanded ? (
                  <div className="flex items-center mx-auto mt-4 px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-sm w-full">
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">반려견 교육 시작하기</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">회원가입 후 맞춤형 교육을 경험하세요.</p>
                    </div>
                    <a
                      href="/auth/login"
                      className="bg-primary hover:bg-primary/90 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = "/auth/login";
                      }}
                    >
                      로그인
                    </a>
                  </div>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href="/auth/login"
                          className="flex items-center justify-center py-2 px-2 mt-4 bg-primary hover:bg-primary/90 text-white rounded-lg mx-auto w-[48px]"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = "/auth/login";
                          }}
                          aria-label="로그인"
                        >
                          <LogIn className="w-5 h-5" />
                        </a>
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
                
                {/* 모든 사용자 공통 메뉴 */}
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
                      active={isActive("/")} 
                      onClick={handleItemClick} 
                      show={true}
                    >홈</AccessibleNavItem>
                    
                    {showDashboardLink && (
                      <AccessibleNavItem 
                        href="/dashboard" 
                        icon={<BarChart2 className="w-5 h-5 mr-2" />} 
                        active={isActive("/dashboard")} 
                        onClick={handleItemClick} 
                        show={true}
                      >대시보드</AccessibleNavItem>
                    )}
                    
                    <AccessibleNavItem 
                      href="/courses" 
                      icon={<GraduationCap className="w-5 h-5 mr-2" />} 
                      active={isActive("/courses")} 
                      onClick={handleItemClick} 
                      show={true}
                    >강의 탐색</AccessibleNavItem>
                    
                    <AccessibleNavItem 
                      href="/trainers" 
                      icon={<UserRoundCheck className="w-5 h-5 mr-2" />} 
                      active={isActive("/trainers")} 
                      onClick={handleItemClick} 
                      show={true}
                    >훈련사 찾기</AccessibleNavItem>
                    
                    <AccessibleNavItem 
                      href="/locations" 
                      icon={<MapPin className="w-5 h-5 mr-2" />} 
                      active={isActive("/locations")} 
                      onClick={handleItemClick} 
                      show={true}
                    >위치 서비스</AccessibleNavItem>
                    
                    <AccessibleNavItem 
                      href="/community" 
                      icon={<MessageSquare className="w-5 h-5 mr-2" />} 
                      active={isActive("/community")} 
                      onClick={handleItemClick} 
                      show={true}
                    >커뮤니티</AccessibleNavItem>
                    
                    <AccessibleNavItem 
                      href="/events" 
                      icon={<Calendar className="w-5 h-5 mr-2" />} 
                      active={isActive("/events")} 
                      onClick={handleItemClick} 
                      show={true}
                    >이벤트</AccessibleNavItem>
                    
                    <AccessibleNavItem 
                      href="/video-training" 
                      icon={<Video className="w-5 h-5 mr-2" />} 
                      active={isActive("/video-training")} 
                      onClick={handleItemClick} 
                      show={true}
                    >영상 훈련</AccessibleNavItem>
                    
                    <AccessibleNavItem 
                      href="/video-call" 
                      icon={<VideoIcon className="w-5 h-5 mr-2" />} 
                      active={isActive("/video-call")} 
                      onClick={handleItemClick} 
                      show={true}
                    >화상 훈련</AccessibleNavItem>
                    
                    <AccessibleNavItem 
                      href="/ai-analysis" 
                      icon={<Sparkles className="w-5 h-5 mr-2" />} 
                      active={isActive("/ai-analysis")} 
                      onClick={handleItemClick} 
                      show={true}
                    >AI 분석</AccessibleNavItem>
                    
                    <AccessibleNavItem 
                      href="/messages" 
                      icon={<MessageSquare className="w-5 h-5 mr-2" />} 
                      active={isActive("/messages")} 
                      onClick={handleItemClick} 
                      show={true}
                    >메시지</AccessibleNavItem>
                    
                    <AccessibleNavItem 
                      href="/alerts" 
                      icon={<Bell className="w-5 h-5 mr-2" />} 
                      active={isActive("/alerts")} 
                      onClick={handleItemClick} 
                      show={true}
                    >알림</AccessibleNavItem>
                    
                    {/* SpecialShopLink removed from here - now a standalone menu item */}
                  </>
                )}

                {/* 나의 학습 메뉴 */}
                {showPetOwnerMenu && (
                  <>
                    <SidebarMenuGroup
                      expanded={expanded}
                      title="나의 학습"
                      groupName="myLearning"
                      isOpen={menuGroups.myLearning}
                      toggleGroup={toggleMenuGroup}
                      icon={<BookOpen className="w-5 h-5 text-gray-500" />}
                    />

                    {menuGroups.myLearning && (
                      <>
                        <AccessibleNavItem 
                          href="/my-courses" 
                          icon={<GraduationCap className="w-5 h-5 mr-2" />} 
                          active={isActive("/my-courses")} 
                          onClick={handleItemClick} 
                          show={true}
                        >내 강의</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/my-trainers" 
                          icon={<UserRoundCheck className="w-5 h-5 mr-2" />} 
                          active={isActive("/my-trainers")} 
                          onClick={handleItemClick} 
                          show={true}
                        >담당 훈련사</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/my-pets" 
                          icon={<PawPrint className="w-5 h-5 mr-2" />} 
                          active={isActive("/my-pets")} 
                          onClick={handleItemClick} 
                          show={true}
                        >반려견 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/notebook" 
                          icon={<Edit className="w-5 h-5 mr-2" />} 
                          active={isActive("/notebook")} 
                          onClick={handleItemClick} 
                          show={true}
                        >알림장</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/calendar" 
                          icon={<Calendar className="w-5 h-5 mr-2" />} 
                          active={isActive("/calendar")} 
                          onClick={handleItemClick} 
                          show={true}
                        >교육 일정</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/achievements" 
                          icon={<Award className="w-5 h-5 mr-2" />} 
                          active={isActive("/achievements")} 
                          onClick={handleItemClick} 
                          show={true}
                        >훈련 성과</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/subscriptions" 
                          icon={<CreditCard className="w-5 h-5 mr-2" />} 
                          active={isActive("/subscriptions")} 
                          onClick={handleItemClick} 
                          show={true}
                        >구독 관리</AccessibleNavItem>
                      </>
                    )}
                  </>
                )}

                {/* 훈련사 메뉴 */}
                {showTrainerMenu && (
                  <>
                    <SidebarMenuGroup
                      expanded={expanded}
                      title="훈련사 메뉴"
                      groupName="trainer"
                      isOpen={menuGroups.trainer}
                      toggleGroup={toggleMenuGroup}
                      icon={<UserRoundCheck className="w-5 h-5 text-gray-500" />}
                    />

                    {menuGroups.trainer && (
                      <>
                        <AccessibleNavItem 
                          href="/trainer/dashboard" 
                          icon={<BarChart2 className="w-5 h-5 mr-2" />} 
                          active={isActive("/trainer/dashboard")} 
                          onClick={handleItemClick} 
                          show={true}
                        >훈련사 대시보드</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/trainer/notebook" 
                          icon={<BookOpen className="w-5 h-5 mr-2" />} 
                          active={isActive("/trainer/notebook")} 
                          onClick={handleItemClick} 
                          show={true}
                        >알림장 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/trainer/students" 
                          icon={<Users className="w-5 h-5 mr-2" />} 
                          active={isActive("/trainer/students")} 
                          onClick={handleItemClick} 
                          show={true}
                        >교육생 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/trainer/courses" 
                          icon={<Presentation className="w-5 h-5 mr-2" />} 
                          active={isActive("/trainer/courses")} 
                          onClick={handleItemClick} 
                          show={true}
                        >강의 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/trainer/classes" 
                          icon={<Calendar className="w-5 h-5 mr-2" />} 
                          active={isActive("/trainer/classes")} 
                          onClick={handleItemClick} 
                          show={true}
                        >수업 일정</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/trainer/reviews" 
                          icon={<ThumbsUp className="w-5 h-5 mr-2" />} 
                          active={isActive("/trainer/reviews")} 
                          onClick={handleItemClick} 
                          show={true}
                        >리뷰 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/trainer/earnings" 
                          icon={<DollarSign className="w-5 h-5 mr-2" />} 
                          active={isActive("/trainer/earnings")} 
                          onClick={handleItemClick} 
                          show={true}
                        >수익 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/trainer/referrals" 
                          icon={<Tag className="w-5 h-5 mr-2" />} 
                          active={isActive("/trainer/referrals")} 
                          onClick={handleItemClick} 
                          show={true}
                        >추천 코드 관리</AccessibleNavItem>
                      </>
                    )}
                  </>
                )}

                {/* 기관 관리자 메뉴 */}
                {showInstituteMenu && (
                  <>
                    <SidebarMenuGroup
                      expanded={expanded}
                      title="기관 관리자 메뉴"
                      groupName="institute"
                      isOpen={menuGroups.institute}
                      toggleGroup={toggleMenuGroup}
                      icon={<Building className="w-5 h-5 text-gray-500" />}
                    />

                    {menuGroups.institute && (
                      <>
                        <AccessibleNavItem 
                          href="/institute/dashboard" 
                          icon={<LineChart className="w-5 h-5 mr-2" />} 
                          active={isActive("/institute/dashboard")} 
                          onClick={handleItemClick} 
                          show={true}
                        >기관 대시보드</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/institute/trainers" 
                          icon={<UserCog className="w-5 h-5 mr-2" />} 
                          active={isActive("/institute/trainers")} 
                          onClick={handleItemClick} 
                          show={true}
                        >훈련사 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/institute/courses" 
                          icon={<BookOpen className="w-5 h-5 mr-2" />} 
                          active={isActive("/institute/courses")} 
                          onClick={handleItemClick} 
                          show={true}
                        >강좌 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/institute/students" 
                          icon={<Users className="w-5 h-5 mr-2" />} 
                          active={isActive("/institute/students")} 
                          onClick={handleItemClick} 
                          show={true}
                        >회원 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/institute/facility" 
                          icon={<Calendar className="w-5 h-5 mr-2" />} 
                          active={isActive("/institute/facility")} 
                          onClick={handleItemClick} 
                          show={true}
                        >시설 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/institute/stats" 
                          icon={<TrendingUp className="w-5 h-5 mr-2" />} 
                          active={isActive("/institute/stats")} 
                          onClick={handleItemClick} 
                          show={true}
                        >매출 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/institute/settings" 
                          icon={<Settings className="w-5 h-5 mr-2" />} 
                          active={isActive("/institute/settings")} 
                          onClick={handleItemClick} 
                          show={true}
                        >기관 설정</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/institute/pet-assignments" 
                          icon={<PawPrint className="w-5 h-5 mr-2" />} 
                          active={isActive("/institute/pet-assignments")} 
                          onClick={handleItemClick} 
                          show={true}
                        >반려견 배정</AccessibleNavItem>
                      </>
                    )}
                  </>
                )}

                {/* 관리자 메뉴 */}
                {showAdminMenu && (
                  <>
                    <SidebarMenuGroup
                      expanded={expanded}
                      title="관리자 메뉴"
                      groupName="admin"
                      isOpen={menuGroups.admin}
                      toggleGroup={toggleMenuGroup}
                      icon={<Cog className="w-5 h-5 text-gray-500" />}
                    />

                    {menuGroups.admin && (
                      <>
                        <AccessibleNavItem 
                          href="/admin/dashboard" 
                          icon={<AreaChart className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/dashboard")} 
                          onClick={handleItemClick} 
                          show={true}
                        >관리자 대시보드</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/admin/users" 
                          icon={<Users className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/users")} 
                          onClick={handleItemClick} 
                          show={true}
                        >사용자 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/admin/institutes" 
                          icon={<Building className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/institutes")} 
                          onClick={handleItemClick} 
                          show={true}
                        >기관 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/admin/menu-management" 
                          icon={<Menu className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/menu-management")} 
                          onClick={handleItemClick} 
                          show={true}
                        >메뉴 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/admin/courses" 
                          icon={<BookOpen className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/courses")} 
                          onClick={handleItemClick} 
                          show={true}
                        >강좌 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/admin/trainers" 
                          icon={<UserRoundCheck className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/trainers")} 
                          onClick={handleItemClick} 
                          show={true}
                        >훈련사 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/admin/contents" 
                          icon={<ImageIcon className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/contents")} 
                          onClick={handleItemClick} 
                          show={true}
                        >콘텐츠 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/admin/commissions" 
                          icon={<Percent className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/commissions")} 
                          onClick={handleItemClick} 
                          show={true}
                        >수수료 관리</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/admin/settings" 
                          icon={<Wrench className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/settings")} 
                          onClick={handleItemClick} 
                          show={true}
                        >시스템 설정</AccessibleNavItem>
                        <AccessibleNavItem 
                          href="/admin/shop" 
                          icon={<ShoppingBag className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/shop")} 
                          onClick={handleItemClick} 
                          show={true}
                        >쇼핑몰 관리</AccessibleNavItem>
                      </>
                    )}
                  </>
                )}

                {/* 공통 Help 섹션 */}
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
                  <HelpSection expanded={expanded} handleItemClick={handleItemClick} />
                )}

                {/* 통계 섹션 */}
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
                  <span>© 2025 PetEduPlatform</span>
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