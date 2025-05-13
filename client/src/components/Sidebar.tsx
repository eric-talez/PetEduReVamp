import { Link, useLocation, useRoute } from "wouter";
import { BarChart } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, createContext, useContext } from "react";
import { SpecialShopLink } from "./SpecialShopLink";
import { HelpSection } from "./HelpSection";
import { StatisticsSection } from "./StatisticsSection";
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
  Sparkles,
  FileEdit,
  Scroll,
  UserCheck,
  LayoutDashboard,
  Star
} from "lucide-react";
import { useAuth } from '../SimpleApp';

// 사이드바 컨텍스트 정의
interface SidebarContextType {
  expanded: boolean;
  toggleExpand: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  expanded: true,
  toggleExpand: () => {}
});

export function useSidebar() {
  return useContext(SidebarContext);
}

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

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
        active ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : "hover:bg-gray-100 dark:hover:bg-gray-800",
        !expanded && "justify-center"
      )}
    >
      {icon}
      {expanded && <span>{children}</span>}
    </a>
  );
}

interface SidebarProps {
  onToggleExpand?: (expanded: boolean) => void;
}

export function Sidebar({ onToggleExpand }: SidebarProps) {
  const { isAuthenticated, userRole } = useAuth();
  const [expanded, setExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [match, params] = useRoute("/:path*");
  const [location] = useLocation();
  const path = location.split('/')[1] || '/';
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location === '/';
    }
    return location.startsWith(path);
  };
  
  // 메뉴 클릭 핸들러
  const handleItemClick = (path: string) => {
    console.log(`메뉴 클릭: ${path} (사용자 역할: ${userRole})`);
    
    // 로그인 페이지 외의 인증 필요 페이지를 비인증 사용자가 접근하려는 경우
    if (!isAuthenticated && path !== '/auth' && !path.startsWith('/shop') && path !== '/help' && !path.startsWith('/ai-chat')) {
      console.log("인증이 필요한 페이지에 비인증 사용자 접근. 로그인 페이지로 리다이렉트");
      window.location.href = "/auth";
      return;
    }
    
    // 기관 관리자 전용 페이지에 대한 권한 체크
    if (path.startsWith('/institute-dashboard') && userRole !== 'institute-admin' && userRole !== 'admin') {
      console.log("기관 관리자 권한이 없는 사용자가 기관 관리자 페이지 접근 시도");
      alert("기관 관리자 권한이 필요합니다.");
      return;
    }
    
    // 훈련사 전용 페이지에 대한 권한 체크
    if (path.startsWith('/trainer-dashboard') && userRole !== 'trainer' && userRole !== 'admin') {
      console.log("훈련사 권한이 없는 사용자가 훈련사 페이지 접근 시도");
      alert("훈련사 권한이 필요합니다.");
      return;
    }
    
    // 관리자 전용 페이지에 대한 권한 체크
    if (path.startsWith('/admin') && userRole !== 'admin') {
      console.log("관리자 권한이 없는 사용자가 관리자 페이지 접근 시도");
      alert("관리자 권한이 필요합니다.");
      return;
    }
    
    // 이동할 페이지에 따른 로깅
    if (path === '/ai-analysis') {
      console.log("AI 분석 페이지로 이동 중...");
    } else if (path === '/video-call') {
      console.log("영상 통화 페이지로 이동 중...");
    } else if (path === '/messages') {
      console.log("메시지 페이지로 이동 중...");
    }
    
    window.location.href = path;
  };
  
  // 사이드바 확장/축소 토글
  const toggleExpand = () => {
    setExpanded(!expanded);
    if (onToggleExpand) {
      onToggleExpand(!expanded);
    }
  };
  
  // 메뉴 그룹 토글 함수
  const toggleMenuGroup = (group: keyof typeof menuGroups) => {
    console.log(`토글 메뉴 그룹: ${group}, 현재 상태: ${menuGroups[group]}`);
    const newState = !menuGroups[group];
    console.log(`메뉴 상태 변경 후: ${group} = ${newState}`);
    setMenuGroups({
      ...menuGroups,
      [group]: newState
    });
  };

  // 컨텍스트 값 설정
  const contextValue: SidebarContextType = {
    expanded,
    toggleExpand
  };
  
  // 윈도우 크기 변경 감지
  useEffect(() => {
    function handleResize() {
      const isMobile = window.innerWidth < 768;
      if (isMobile && expanded) {
        setExpanded(false);
        if (onToggleExpand) {
          onToggleExpand(false);
        }
      }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [onToggleExpand]);

  // 기본 메뉴 그룹 (모두 닫힌 상태로 시작)
  const [menuGroups, setMenuGroups] = useState({
    main: false,
    features: false,
    myLearning: false,
    trainer: false,
    institute: false,
    admin: false
  });
  
  useEffect(() => {
    console.log('Sidebar useEffect - userRole:', userRole);
    
    // 사용자 역할에 따른 메뉴 그룹 표시 여부
    const showInstituteAdmin = userRole === 'institute-admin' || userRole === 'admin';
    const showTrainer = userRole === 'trainer' || userRole === 'admin';
    const showAdmin = userRole === 'admin';
    
    console.log('권한 체크 - 기관 관리자:', showInstituteAdmin, '관리자:', showAdmin, '훈련사:', showTrainer);
    
    // 사용자 권한에 맞게 기본적으로 표시되는 메뉴 그룹 설정
    if (isAuthenticated) {
      const updatedGroups = {
        ...menuGroups,
        trainer: userRole === 'trainer' || userRole === 'admin',
        institute: userRole === 'institute-admin' || userRole === 'admin', 
        admin: userRole === 'admin'
      };
      
      console.log('사용자 역할에 따른 메뉴 그룹 업데이트:', updatedGroups);
      setMenuGroups(updatedGroups);
    }
  }, [userRole]);
  
  console.log('메뉴 그룹 상태:', menuGroups);


  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        className={cn(
          "h-full bg-white dark:bg-gray-900 transform transition-all duration-300 ease-in-out shadow-md flex-shrink-0",
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
              <PawPrint className="h-8 w-8 text-primary" />
            </a>
          )}
          <button
            onClick={toggleExpand}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
            aria-label={expanded ? "접기" : "펼치기"}
          >
            {expanded ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
          </button>
        </div>

        <div className={cn("py-4 overflow-y-auto h-[calc(100vh-4rem)] flex flex-col", expanded ? "px-3" : "px-2")}>
          <div className="space-y-1">
            {!isAuthenticated && (
              <>
                {expanded ? (
                  <div className="px-3 py-2 flex items-center justify-between cursor-pointer" onClick={() => toggleMenuGroup('main')}>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">메인 메뉴</h3>
                    {menuGroups.main ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </div>
                ) : (
                  <div className="py-2 flex justify-center cursor-pointer" onClick={() => toggleMenuGroup('main')}>
                    <Home className="h-5 w-5 text-gray-500" />
                  </div>
                )}

                {menuGroups.main && (
                  <>
                    <NavItem 
                      href="/" 
                      icon={<Home className="w-5 h-5 mr-2" />} 
                      active={isActive("/")} 
                      onClick={(path) => {
                        console.log("비회원 메뉴 클릭:", path);
                        handleItemClick(path);
                      }} 
                      show={true}
                    >홈</NavItem>
                    <NavItem 
                      href="/auth" 
                      icon={<LogIn className="w-5 h-5 mr-2" />} 
                      active={isActive("/auth")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >로그인</NavItem>
                    <NavItem 
                      href="/ai-chat" 
                      icon={<Sparkles className="w-5 h-5 mr-2" />} 
                      active={isActive("/ai-chat")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >AI 챗봇</NavItem>
                    <NavItem 
                      href="/help" 
                      icon={<BookOpen className="w-5 h-5 mr-2" />} 
                      active={isActive("/help")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >도움말</NavItem>
                  </>
                )}
              </>
            )}

            {isAuthenticated && (
              <>
                {expanded ? (
                  <div className="px-3 py-2 flex items-center justify-between cursor-pointer" onClick={() => toggleMenuGroup('main')}>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">메인 메뉴</h3>
                    {menuGroups.main ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </div>
                ) : (
                  <div className="py-2 flex justify-center cursor-pointer" onClick={() => toggleMenuGroup('main')}>
                    <Home className="h-5 w-5 text-gray-500" />
                  </div>
                )}

                {menuGroups.main && (
                  <>
                    <NavItem 
                      href="/" 
                      icon={<Home className="w-5 h-5 mr-2" />} 
                      active={isActive("/")} 
                      onClick={(path) => {
                        console.log("메인 메뉴 홈 클릭");
                        handleItemClick(path);
                      }} 
                      show={true}
                    >홈</NavItem>
                    <NavItem 
                      href="/dashboard" 
                      icon={<LayoutDashboard className="w-5 h-5 mr-2" />} 
                      active={isActive("/dashboard")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >대시보드</NavItem>
                    <NavItem 
                      href="/profile" 
                      icon={<UserCheck className="w-5 h-5 mr-2" />} 
                      active={isActive("/profile")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >프로필</NavItem>
                    <NavItem 
                      href="/settings" 
                      icon={<Cog className="w-5 h-5 mr-2" />} 
                      active={isActive("/settings")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >설정</NavItem>
                  </>
                )}
                
                {expanded ? (
                  <div className="px-3 py-2 flex items-center justify-between cursor-pointer mt-4" onClick={() => toggleMenuGroup('features')}>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">주요 기능</h3>
                    {menuGroups.features ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </div>
                ) : (
                  <div className="py-2 flex justify-center cursor-pointer mt-4" onClick={() => toggleMenuGroup('features')}>
                    <Star className="h-5 w-5 text-gray-500" />
                  </div>
                )}
                
                {menuGroups.features && (
                  <>
                    <NavItem 
                      href="/courses" 
                      icon={<GraduationCap className="w-5 h-5 mr-2" />} 
                      active={isActive("/courses")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >강좌</NavItem>
                    <NavItem 
                      href="/trainers" 
                      icon={<UserRoundCheck className="w-5 h-5 mr-2" />} 
                      active={isActive("/trainers")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >훈련사</NavItem>
                    <NavItem 
                      href="/institutes" 
                      icon={<Building className="w-5 h-5 mr-2" />} 
                      active={isActive("/institutes")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >교육기관</NavItem>
                    <NavItem 
                      href="/messages" 
                      icon={<MessageSquare className="w-5 h-5 mr-2" />} 
                      active={isActive("/messages")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >메시지</NavItem>
                    <NavItem 
                      href="/notifications" 
                      icon={<Bell className="w-5 h-5 mr-2" />} 
                      active={isActive("/notifications")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >알림</NavItem>
                    <NavItem 
                      href="/my-pets" 
                      icon={<PawPrint className="w-5 h-5 mr-2" />} 
                      active={isActive("/my-pets")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >내 반려견</NavItem>
                    <NavItem 
                      href="/ai-analysis" 
                      icon={<Sparkles className="w-5 h-5 mr-2" />} 
                      active={isActive("/ai-analysis")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >AI 분석</NavItem>
                    <SpecialShopLink expanded={expanded} />
                    <NavItem 
                      href="/locations" 
                      icon={<MapPin className="w-5 h-5 mr-2" />} 
                      active={isActive("/locations")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >위치 서비스</NavItem>
                    <NavItem 
                      href="/video-call" 
                      icon={<Video className="w-5 h-5 mr-2" />} 
                      active={isActive("/video-call")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >화상 통화</NavItem>
                    <NavItem 
                      href="/community" 
                      icon={<Users className="w-5 h-5 mr-2" />} 
                      active={isActive("/community")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >커뮤니티</NavItem>
                  </>
                )}
                
                {expanded ? (
                  <div className="px-3 py-2 flex items-center justify-between cursor-pointer mt-4" onClick={() => toggleMenuGroup('myLearning')}>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">내 학습</h3>
                    {menuGroups.myLearning ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </div>
                ) : (
                  <div className="py-2 flex justify-center cursor-pointer mt-4" onClick={() => toggleMenuGroup('myLearning')}>
                    <BookOpen className="h-5 w-5 text-gray-500" />
                  </div>
                )}
                
                {menuGroups.myLearning && (
                  <>
                    <NavItem 
                      href="/my-courses" 
                      icon={<GraduationCap className="w-5 h-5 mr-2" />} 
                      active={isActive("/my-courses")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >수강 중인 강좌</NavItem>
                    <NavItem 
                      href="/notebook" 
                      icon={<FileEdit className="w-5 h-5 mr-2" />} 
                      active={isActive("/notebook")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >학습 노트</NavItem>
                    <NavItem 
                      href="/events" 
                      icon={<Calendar className="w-5 h-5 mr-2" />} 
                      active={isActive("/events")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >일정</NavItem>
                    <NavItem 
                      href="/course-reservation" 
                      icon={<Calendar className="w-5 h-5 mr-2" />} 
                      active={isActive("/course-reservation")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >강좌 예약</NavItem>
                    <NavItem 
                      href="/achievements" 
                      icon={<Award className="w-5 h-5 mr-2" />} 
                      active={isActive("/achievements")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >성취</NavItem>
                    <NavItem 
                      href="/video-training" 
                      icon={<VideoIcon className="w-5 h-5 mr-2" />} 
                      active={isActive("/video-training")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >영상 훈련</NavItem>
                  </>
                )}
                
                {/* 훈련사 메뉴 - 훈련사 또는 관리자만 표시 */}
                {(userRole === 'trainer' || userRole === 'admin') && (
                  <>
                    {expanded ? (
                      <div className="px-3 py-2 flex items-center justify-between cursor-pointer mt-4" onClick={() => toggleMenuGroup('trainer')}>
                        <h3 className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">훈련사 메뉴</h3>
                        {menuGroups.trainer ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                      </div>
                    ) : (
                      <div className="py-2 flex justify-center cursor-pointer mt-4" onClick={() => toggleMenuGroup('trainer')}>
                        <UserRoundCheck className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                    {menuGroups.trainer && (
                      <>
                        <NavItem 
                          href="/trainer-dashboard" 
                          icon={<LayoutDashboard className="w-5 h-5 mr-2 text-green-500" />} 
                          active={isActive("/trainer-dashboard")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >훈련사 대시보드</NavItem>
                        <NavItem 
                          href="/trainer/courses" 
                          icon={<Presentation className="w-5 h-5 mr-2 text-green-500" />} 
                          active={isActive("/trainer/courses")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >나의 강좌</NavItem>
                        <NavItem 
                          href="/trainer/students" 
                          icon={<Users className="w-5 h-5 mr-2 text-green-500" />} 
                          active={isActive("/trainer/students")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >수강생 관리</NavItem>
                        <NavItem 
                          href="/trainer-dashboard/reservations" 
                          icon={<Calendar className="w-5 h-5 mr-2 text-green-500" />} 
                          active={isActive("/trainer-dashboard/reservations")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >예약 관리</NavItem>
                        <NavItem 
                          href="/trainer/stats" 
                          icon={<BarChart className="w-5 h-5 mr-2 text-green-500" />} 
                          active={isActive("/trainer/stats")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >실적 통계</NavItem>
                        <NavItem 
                          href="/trainer/commission" 
                          icon={<LineChart className="w-5 h-5 mr-2 text-green-500" />} 
                          active={isActive("/trainer/commission")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >수수료/정산</NavItem>
                      </>
                    )}
                  </>
                )}
                
                {/* 기관 관리자 메뉴 - 기관 관리자 또는 관리자만 표시 */}
                {(userRole === 'institute-admin' || userRole === 'admin') && (
                  <>
                    {expanded ? (
                      <div className="px-3 py-2 flex items-center justify-between cursor-pointer mt-4" onClick={() => toggleMenuGroup('institute')}>
                        <h3 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">기관 관리</h3>
                        {menuGroups.institute ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                      </div>
                    ) : (
                      <div className="py-2 flex justify-center cursor-pointer mt-4" onClick={() => toggleMenuGroup('institute')}>
                        <Building className="h-5 w-5 text-blue-500" />
                      </div>
                    )}
                    {menuGroups.institute && (
                      <>
                        <NavItem 
                          href="/institute-dashboard" 
                          icon={<LayoutDashboard className="w-5 h-5 mr-2 text-blue-500" />} 
                          active={isActive("/institute-dashboard")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >기관 대시보드</NavItem>
                        <NavItem 
                          href="/institute-dashboard/trainers" 
                          icon={<UserRoundCheck className="w-5 h-5 mr-2 text-blue-500" />} 
                          active={isActive("/institute-dashboard/trainers")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >훈련사 관리</NavItem>
                        <NavItem 
                          href="/institute-dashboard/courses" 
                          icon={<GraduationCap className="w-5 h-5 mr-2 text-blue-500" />} 
                          active={isActive("/institute-dashboard/courses")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >강좌 관리</NavItem>
                        <NavItem 
                          href="/institute-dashboard/course-approvals" 
                          icon={<CheckSquare className="w-5 h-5 mr-2 text-blue-500" />} 
                          active={isActive("/institute-dashboard/course-approvals")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >강좌 승인</NavItem>
                        <NavItem 
                          href="/institute-dashboard/pet-assignments" 
                          icon={<PawPrint className="w-5 h-5 mr-2 text-blue-500" />} 
                          active={isActive("/institute-dashboard/pet-assignments")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >반려견 배정</NavItem>
                        <NavItem 
                          href="/institute-dashboard/stats" 
                          icon={<BarChart className="w-5 h-5 mr-2 text-blue-500" />} 
                          active={isActive("/institute-dashboard/stats")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >통계</NavItem>
                        <NavItem 
                          href="/institute-dashboard/billing" 
                          icon={<LineChart className="w-5 h-5 mr-2 text-blue-500" />} 
                          active={isActive("/institute-dashboard/billing")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >정산/정보</NavItem>
                      </>
                    )}
                  </>
                )}
                
                {/* 관리자 메뉴 - 관리자만 표시 */}
                {userRole === 'admin' && (
                  <>
                    {expanded ? (
                      <div className="px-3 py-2 flex items-center justify-between cursor-pointer mt-4" onClick={() => toggleMenuGroup('admin')}>
                        <h3 className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">관리자</h3>
                        {menuGroups.admin ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                      </div>
                    ) : (
                      <div className="py-2 flex justify-center cursor-pointer mt-4" onClick={() => toggleMenuGroup('admin')}>
                        <UserCog className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                    {menuGroups.admin && (
                      <>
                        <NavItem 
                          href="/admin/dashboard" 
                          icon={<LayoutDashboard className="w-5 h-5 mr-2 text-red-500" />} 
                          active={isActive("/admin/dashboard")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >관리자 대시보드</NavItem>
                        <NavItem 
                          href="/admin/users" 
                          icon={<Users className="w-5 h-5 mr-2 text-red-500" />} 
                          active={isActive("/admin/users")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >사용자 관리</NavItem>
                        <NavItem 
                          href="/admin/institutes" 
                          icon={<Building className="w-5 h-5 mr-2 text-red-500" />} 
                          active={isActive("/admin/institutes")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >기관 관리</NavItem>
                        <NavItem 
                          href="/admin/courses" 
                          icon={<GraduationCap className="w-5 h-5 mr-2 text-red-500" />} 
                          active={isActive("/admin/courses")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >강좌 관리</NavItem>
                        <NavItem 
                          href="/admin/fees" 
                          icon={<LineChart className="w-5 h-5 mr-2 text-red-500" />} 
                          active={isActive("/admin/fees")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >수수료 정책</NavItem>
                        <NavItem 
                          href="/admin/system" 
                          icon={<Wrench className="w-5 h-5 mr-2 text-red-500" />} 
                          active={isActive("/admin/system")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >시스템 설정</NavItem>
                        <NavItem 
                          href="/admin/stats" 
                          icon={<Activity className="w-5 h-5 mr-2 text-red-500" />} 
                          active={isActive("/admin/stats")} 
                          onClick={(path) => handleItemClick(path)} 
                          show={true}
                        >시스템 통계</NavItem>
                      </>
                    )}
                  </>
                )}
                
                <HelpSection expanded={expanded} />
              </>
            )}
          </div>
          
          {/* 푸터 통계 영역 (로그인 시만 표시) */}
          {isAuthenticated && expanded && (
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
              <StatisticsSection />
            </div>
          )}
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

// 메뉴 그룹 토글 함수는 Sidebar 컴포넌트 내부로 이동