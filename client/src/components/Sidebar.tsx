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
  DollarSign,
  Gift,
  Percent,
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
      admin: false
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
      "/help/faq", "/help/guide", "/help/about", "/help/contact", "/shop"
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
      if (path.startsWith('/trainer-dashboard') && userRole !== 'trainer' && userRole !== 'admin') {
        console.log('훈련사 권한 필요');
        window.location.href = "/";
        return;
      }

      // 기관 관리자 전용 페이지
      if (path.startsWith('/institute-dashboard') && userRole !== 'institute-admin' && userRole !== 'admin') {
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
      '/calendar': '교육 일정'
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
      window.location.href = path;
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
        <div className="h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 px-3">
          {expanded ? (
            <a href="/" className="flex flex-col items-center w-full">
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                PetEdu<span className="text-primary">Platform</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">반려견 전문 교육 플랫폼</span>
            </a>
          ) : (
            <a href="/" className="flex items-center justify-center w-full">
              <span className="text-2xl font-bold text-primary">P</span>
            </a>
          )}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none"
            aria-label={expanded ? "사이드바 접기" : "사이드바 펼치기"}
          >
            {expanded ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
          </button>
        </div>

        <ScrollArea className={cn("flex-1", expanded ? "px-3" : "px-2")}>
          <div className="py-4 space-y-1 w-full min-h-min">
            {/* 비로그인 상태 메뉴 */}
            {!isAuthenticated ? (
              <>
                {expanded ? (
                  <div className="px-3 py-2 flex items-center justify-between cursor-pointer" onClick={() => toggleMenuGroup('main')}>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">메인 메뉴</h3>
                    {menuGroups.main ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </div>
                ) : (
                  <div className="py-2"></div>
                )}

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
                        window.location.href = path;
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
                        window.location.href = path;
                      }} 
                      show={true}
                    >화상 수업</AccessibleNavItem>
                    <AccessibleNavItem 
                      href="/community" 
                      icon={<MessageSquare className="w-5 h-5 mr-2" />} 
                      active={isActive("/community")} 
                      onClick={(path) => {
                        console.log("비회원이 커뮤니티 클릭");
                        window.location.href = path;
                      }} 
                      show={true}
                    >커뮤니티</AccessibleNavItem>
                    <AccessibleNavItem 
                      href="/events" 
                      icon={<Calendar className="w-5 h-5 mr-2" />} 
                      active={isActive("/events")} 
                      onClick={(path) => {
                        console.log("비회원이 이벤트 메뉴 클릭");
                        window.location.href = path;
                      }} 
                      show={true}
                    >이벤트</AccessibleNavItem>

                    <li className="relative">
                      <a 
                        href="https://replit.com/join/wshpfpjewg-hnblgkjw" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "sidebar-link flex items-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out",
                          expanded ? "px-3" : "px-2 justify-center",
                          "bg-primary/10 text-primary"
                        )}
                      >
                        {expanded ? (
                          <>
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            <span>반려견 쇼핑몰</span>
                          </>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <ShoppingBag className="w-5 h-5" aria-label="반려견 쇼핑몰" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p>반려견 쇼핑몰</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </a>
                    </li>

                    <AccessibleNavItem 
                      href="/ai-chatbot" 
                      icon={<Brain className="w-5 h-5 mr-2" />} 
                      active={isActive("/ai-chatbot")} 
                      onClick={(path) => {
                        console.log("AI 챗봇 메뉴 클릭:", path);
                        handleItemClick(path);
                      }} 
                      show={true}
                    >AI 챗봇</AccessibleNavItem>
                  </>
                )}

                {/* 로그인 버튼 - 비로그인 상태에서만 */}
                {expanded ? (
                  <div className="mt-6 px-3">
                    <a
                      href="/auth/login"
                      className="flex items-center justify-center py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = "/auth/login";
                      }}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      <span>로그인</span>
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
                {/* 모든 사용자 공통 메뉴 */}
                {expanded ? (
                  <div className="px-3 py-2 flex items-center justify-between cursor-pointer" onClick={() => toggleMenuGroup('main')}>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">메인 메뉴</h3>
                    {menuGroups.main ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </div>
                ) : (
                  <div className="py-2"></div>
                )}

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
                  </>
                )}

                {/* 기능 메뉴 그룹 */}
                {expanded ? (
                  <div className="px-3 py-2 mt-6 flex items-center justify-between cursor-pointer" onClick={() => toggleMenuGroup('features')}>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">기능</h3>
                    {menuGroups.features ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </div>
                ) : (
                  <div className="py-2 mt-4 border-t border-gray-200 dark:border-gray-800"></div>
                )}

                {menuGroups.features && (
                  <>
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
                      href="/community" 
                      icon={<Users className="w-5 h-5 mr-2" />} 
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
                    
                    <li className="relative">
                      <a 
                        href="https://replit.com/join/wshpfpjewg-hnblgkjw" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "sidebar-link flex items-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out",
                          expanded ? "px-3" : "px-2 justify-center",
                          "bg-primary/10 text-primary"
                        )}
                      >
                        {expanded ? (
                          <>
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            <span>반려견 쇼핑몰</span>
                          </>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <ShoppingBag className="w-5 h-5" aria-label="반려견 쇼핑몰" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p>반려견 쇼핑몰</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </a>
                    </li>
                  </>
                )}

                {/* 내 학습 관련 메뉴 */}
                {expanded ? (
                  <div 
                    className="px-3 py-2 mt-6 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleMenuGroup('myLearning')}
                  >
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      내 학습
                    </h3>
                    {menuGroups.myLearning ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </div>
                ) : (
                  <div className="py-2 mt-4 border-t border-gray-200 dark:border-gray-800"></div>
                )}

                {menuGroups.myLearning && (
                  <>
                    <AccessibleNavItem 
                      href="/my-courses" 
                      icon={<BookOpen className="w-5 h-5 mr-2" />} 
                      active={isActive("/my-courses")} 
                      onClick={handleItemClick} 
                      show={showPetOwnerMenu || showDashboardLink}
                    >내 강의</AccessibleNavItem>
                    
                    <AccessibleNavItem 
                      href="/my-pets" 
                      icon={<PawPrint className="w-5 h-5 mr-2" />} 
                      active={isActive("/my-pets")} 
                      onClick={handleItemClick} 
                      show={showPetOwnerMenu || isPetOwner}
                    >반려견 관리</AccessibleNavItem>
                    
                    <AccessibleNavItem 
                      href="/calendar" 
                      icon={<Calendar className="w-5 h-5 mr-2" />} 
                      active={isActive("/calendar")} 
                      onClick={handleItemClick} 
                      show={showDashboardLink}
                    >교육 일정</AccessibleNavItem>
                    
                    <AccessibleNavItem 
                      href="/notebook" 
                      icon={<Edit className="w-5 h-5 mr-2" />} 
                      active={isActive("/notebook")} 
                      onClick={handleItemClick} 
                      show={showPetOwnerMenu || isPetOwner}
                    >알림장</AccessibleNavItem>
                    
                    <AccessibleNavItem 
                      href="/certificates" 
                      icon={<Award className="w-5 h-5 mr-2" />} 
                      active={isActive("/certificates")} 
                      onClick={handleItemClick} 
                      show={true}
                    >자격증 및 수료증</AccessibleNavItem>
                  </>
                )}

                {/* Trainer Menu - remains largely unchanged */}
                {showTrainerMenu && (
                  <>
                    {expanded ? (
                      <div
                        className="px-3 py-2 mt-6 flex items-center justify-between cursor-pointer"
                        onClick={() => toggleMenuGroup('trainer')}
                      >
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          훈련사 메뉴
                        </h3>
                        {menuGroups.trainer ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                      </div>
                    ) : (
                      <div className="py-2 mt-4 border-t border-gray-200 dark:border-gray-800"></div>
                    )}

                    {menuGroups.trainer && (
                      <>
                        <AccessibleNavItem 
                          href="/trainer-dashboard" 
                          icon={<Presentation className="w-5 h-5 mr-2" />} 
                          active={isActive("/trainer-dashboard")} 
                          onClick={handleItemClick} 
                          show={true}
                        >훈련사 대시보드</AccessibleNavItem>
                        
                        <AccessibleNavItem 
                          href="/trainer-courses" 
                          icon={<BookOpen className="w-5 h-5 mr-2" />} 
                          active={isActive("/trainer-courses")} 
                          onClick={handleItemClick} 
                          show={true}
                        >강의 관리</AccessibleNavItem>
                        
                        <AccessibleNavItem 
                          href="/trainer-schedule" 
                          icon={<Calendar className="w-5 h-5 mr-2" />} 
                          active={isActive("/trainer-schedule")} 
                          onClick={handleItemClick} 
                          show={true}
                        >일정 관리</AccessibleNavItem>
                        
                        <AccessibleNavItem 
                          href="/trainer-students" 
                          icon={<Users className="w-5 h-5 mr-2" />} 
                          active={isActive("/trainer-students")} 
                          onClick={handleItemClick} 
                          show={true}
                        >수강생 관리</AccessibleNavItem>
                        
                        <AccessibleNavItem 
                          href="/trainer-reports" 
                          icon={<CheckSquare className="w-5 h-5 mr-2" />} 
                          active={isActive("/trainer-reports")} 
                          onClick={handleItemClick} 
                          show={true}
                        >평가 및 리포트</AccessibleNavItem>
                        
                        <AccessibleNavItem 
                          href="/trainer-commission" 
                          icon={<DollarSign className="w-5 h-5 mr-2" />} 
                          active={isActive("/trainer-commission")} 
                          onClick={handleItemClick} 
                          show={true}
                        >수수료 관리</AccessibleNavItem>
                      </>
                    )}
                  </>
                )}

                {/* Institute Admin Menu */}
                {showInstituteMenu && (
                  <>
                    {expanded ? (
                      <div
                        className="px-3 py-2 mt-6 flex items-center justify-between cursor-pointer"
                        onClick={() => toggleMenuGroup('institute')}
                      >
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          기관 관리자 메뉴
                        </h3>
                        {menuGroups.institute ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                      </div>
                    ) : (
                      <div className="py-2 mt-4 border-t border-gray-200 dark:border-gray-800"></div>
                    )}

                    {menuGroups.institute && (
                      <>
                        <AccessibleNavItem 
                          href="/institute/dashboard" 
                          icon={<Building className="w-5 h-5 mr-2" />} 
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
                          icon={<GraduationCap className="w-5 h-5 mr-2" />} 
                          active={isActive("/institute/courses")} 
                          onClick={handleItemClick} 
                          show={true}
                        >강의 관리</AccessibleNavItem>
                        
                        <AccessibleNavItem 
                          href="/institute/students" 
                          icon={<Users className="w-5 h-5 mr-2" />} 
                          active={isActive("/institute/students")} 
                          onClick={handleItemClick} 
                          show={true}
                        >수강생 관리</AccessibleNavItem>
                        

                        
                        <AccessibleNavItem 
                          href="/institute/reports" 
                          icon={<LineChart className="w-5 h-5 mr-2" />} 
                          active={isActive("/institute/reports")} 
                          onClick={handleItemClick} 
                          show={true}
                        >데이터 분석</AccessibleNavItem>
                        
                        <AccessibleNavItem 
                          href="/institute/commission" 
                          icon={<Percent className="w-5 h-5 mr-2" />} 
                          active={isActive("/institute/commission")} 
                          onClick={handleItemClick} 
                          show={true}
                        >수수료 관리</AccessibleNavItem>
                      </>
                    )}
                  </>
                )}

                {/* Admin Menu */}
                {showAdminMenu && (
                  <>
                    {expanded ? (
                      <div
                        className="px-3 py-2 mt-6 flex items-center justify-between cursor-pointer"
                        onClick={() => toggleMenuGroup('admin')}
                      >
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          관리자 메뉴
                        </h3>
                        {menuGroups.admin ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                      </div>
                    ) : (
                      <div className="py-2 mt-4 border-t border-gray-200 dark:border-gray-800"></div>
                    )}

                    {menuGroups.admin && (
                      <>
                        <AccessibleNavItem 
                          href="/admin/dashboard" 
                          icon={<LineChart className="w-5 h-5 mr-2" />} 
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
                        >회원 관리</AccessibleNavItem>
                        
                        <AccessibleNavItem 
                          href="/admin/institutes" 
                          icon={<Building className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/institutes")} 
                          onClick={handleItemClick} 
                          show={true}
                        >기관 관리</AccessibleNavItem>
                        
                        <AccessibleNavItem 
                          href="/admin/courses" 
                          icon={<BookOpen className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/courses")} 
                          onClick={handleItemClick} 
                          show={true}
                        >강의 관리</AccessibleNavItem>
                        
                        <AccessibleNavItem 
                          href="/admin/commission" 
                          icon={<DollarSign className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/commission")} 
                          onClick={handleItemClick} 
                          show={true}
                        >수수료 정책</AccessibleNavItem>
                        
                        <AccessibleNavItem 
                          href="/admin/settlements" 
                          icon={<CheckSquare className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/settlements")} 
                          onClick={handleItemClick} 
                          show={true}
                        >정산 관리</AccessibleNavItem>
                        
                        <AccessibleNavItem 
                          href="/admin/shop" 
                          icon={<ShoppingBag className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/shop")} 
                          onClick={handleItemClick} 
                          show={true}
                        >쇼핑몰 관리</AccessibleNavItem>
                        
                        <AccessibleNavItem 
                          href="/admin/statistics" 
                          icon={<BarChart2 className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/statistics")} 
                          onClick={handleItemClick} 
                          show={true}
                        >통계 및 분석</AccessibleNavItem>
                        
                        <AccessibleNavItem 
                          href="/admin/settings" 
                          icon={<Cog className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/settings")} 
                          onClick={handleItemClick} 
                          show={true}
                        >시스템 설정</AccessibleNavItem>
                        
                        <AccessibleNavItem 
                          href="/admin/facility" 
                          icon={<Wrench className="w-5 h-5 mr-2" />} 
                          active={isActive("/admin/facility")} 
                          onClick={handleItemClick} 
                          show={true}
                        >시설 관리</AccessibleNavItem>
                      </>
                    )}
                  </>
                )}

                {/* Help Section for authenticated users */}
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
              </>
            )}
          </div>
        </ScrollArea>

        {/* Service Statistics for non-authenticated users at bottom */}
        {!isAuthenticated && (
          expanded ? (
            <div className="mt-auto mb-4 px-3">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">실시간 이용자</span>
                  <span className="font-semibold text-primary">2,458명</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-600 dark:text-gray-300">총 반려견</span>
                  <span className="font-semibold text-primary">12,672마리</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-600 dark:text-gray-300">총 수료증</span>
                  <span className="font-semibold text-primary">8,945개</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-auto mb-4 px-2">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 flex justify-center">
                <Activity className="w-5 h-5 text-primary" aria-label="서비스 현황" />
              </div>
            </div>
          )
        )}
      </div>
    </SidebarContext.Provider>
  );
}