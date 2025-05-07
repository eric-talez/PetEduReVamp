import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, createContext, useContext } from "react";
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
  Menu
} from "lucide-react";
import { useAppAuth } from "../App";

// 사이드바 컨텍스트 생성
interface SidebarContextType {
  expanded: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  expanded: true,
  toggleSidebar: () => {}
});

// NavItem 컴포넌트 정의
interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ href, icon, children, active, onClick }: NavItemProps) {
  // 부모 컴포넌트에서 expanded 상태를 받아오기 위해 useContext 사용
  const { expanded } = useContext(SidebarContext);
  
  return (
    <Link 
      href={href}
      className={cn(
        "sidebar-link flex items-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out",
        expanded ? "px-3" : "px-2 justify-center",
        active 
          ? "bg-primary/10 text-primary" 
          : "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
      )}
      onClick={onClick}
      title={expanded ? undefined : children?.toString()}
    >
      {icon}
      {expanded && <span>{children}</span>}
    </Link>
  );
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { userRole, isAuthenticated } = useAppAuth();
  
  // 사이드바 펼쳐짐/접힘 상태 관리
  const [expanded, setExpanded] = useState(true);
  
  // 모바일 환경에서는 항상 펼쳐진 상태로 시작
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setExpanded(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 메뉴 그룹 열기/닫기 상태 관리
  const [menuGroups, setMenuGroups] = useState({
    main: true,
    features: true,
    myLearning: true,
    trainer: false,
    institute: false,
    admin: false
  });
  
  // 사이드바 펼침/접힘 토글 함수
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  // 메뉴 그룹 토글 함수
  const toggleMenuGroup = (group: keyof typeof menuGroups) => {
    setMenuGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };
  
  // SidebarContext 값 설정
  const contextValue = {
    expanded,
    toggleSidebar
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        className={cn(
          "h-screen bg-white dark:bg-gray-900 transform transition-all duration-300 ease-in-out shadow-md flex-shrink-0 z-20",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          expanded ? "w-64" : "w-[70px]"
        )}
      >
        {/* Navigation */}
        {/* Logo */}
        <div className="h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 px-3">
          {expanded ? (
            <Link href="/" className="flex flex-col items-center w-full">
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                PetEdu<span className="text-primary">Platform</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">반려견 전문 교육 플랫폼</span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center justify-center w-full">
              <span className="text-2xl font-bold text-primary">P</span>
            </Link>
          )}
          
          {/* 데스크탑에서만 보이는 토글 버튼 */}
          <button 
            onClick={toggleSidebar} 
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none"
            aria-label={expanded ? "사이드바 접기" : "사이드바 펼치기"}
          >
            {expanded ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
          </button>
        </div>
        
        <div className={cn(
          "py-4 overflow-y-auto h-[calc(100vh-4rem)]",
          expanded ? "px-3" : "px-2"
        )}>
          <div className="space-y-1">
            {/* 비회원인 경우 표시할 메뉴 */}
            {!isAuthenticated && (
              <>
                {expanded ? (
                  <div 
                    className="px-3 py-2 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleMenuGroup('main')}
                  >
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      메인 메뉴
                    </h3>
                    {menuGroups.main ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </div>
                ) : (
                  <div className="flex justify-center py-2">
                    <Menu className="h-4 w-4 text-gray-500" />
                  </div>
                )}
                
                {menuGroups.main && (
                  <>
                    <NavItem 
                      href="/" 
                      icon={<Home className="w-5 h-5 mr-2" />}
                      active={isActive("/")}
                      onClick={onClose}
                    >
                      홈
                    </NavItem>

                    <NavItem 
                      href="/courses" 
                      icon={<GraduationCap className="w-5 h-5 mr-2" />}
                      active={isActive("/courses")}
                      onClick={onClose}
                    >
                      강의 탐색
                    </NavItem>
                    
                    <NavItem 
                      href="/trainers" 
                      icon={<UserRoundCheck className="w-5 h-5 mr-2" />}
                      active={isActive("/trainers")}
                      onClick={onClose}
                    >
                      훈련사 찾기
                    </NavItem>
                    
                    <NavItem 
                      href="/institutes" 
                      icon={<Building className="w-5 h-5 mr-2" />}
                      active={isActive("/institutes")}
                      onClick={onClose}
                    >
                      교육 기관
                    </NavItem>
                    
                    <NavItem 
                      href="/community" 
                      icon={<MessageSquare className="w-5 h-5 mr-2" />}
                      active={isActive("/community")}
                      onClick={onClose}
                    >
                      커뮤니티
                    </NavItem>
                  </>
                )}
                
                <div className="mt-6">
                  <NavItem 
                    href="/auth" 
                    icon={<LogIn className="w-5 h-5 mr-2" />}
                    active={isActive("/auth")}
                    onClick={onClose}
                  >
                    로그인
                  </NavItem>
                </div>
              </>
            )}
            
            {/* 로그인한 사용자에게 표시할 메뉴 */}
            {isAuthenticated && (
              <>
                {expanded ? (
                  <div 
                    className="px-3 py-2 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleMenuGroup('main')}
                  >
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      메인 메뉴
                    </h3>
                    {menuGroups.main ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </div>
                ) : (
                  <div className="flex justify-center py-2">
                    <Home className="h-4 w-4 text-gray-500" />
                  </div>
                )}
                
                {menuGroups.main && (
                  <>
                    <NavItem 
                      href="/" 
                      icon={<Home className="w-5 h-5 mr-2" />}
                      active={isActive("/")}
                      onClick={onClose}
                    >
                      홈
                    </NavItem>

                    <NavItem 
                      href="/dashboard" 
                      icon={<LineChart className="w-5 h-5 mr-2" />}
                      active={isActive("/dashboard")}
                      onClick={onClose}
                    >
                      대시보드
                    </NavItem>
                    
                    <NavItem 
                      href="/courses" 
                      icon={<GraduationCap className="w-5 h-5 mr-2" />}
                      active={isActive("/courses")}
                      onClick={onClose}
                    >
                      강의 탐색
                    </NavItem>
                    
                    <NavItem 
                      href="/trainers" 
                      icon={<UserRoundCheck className="w-5 h-5 mr-2" />}
                      active={isActive("/trainers")}
                      onClick={onClose}
                    >
                      훈련사 찾기
                    </NavItem>
                    
                    <NavItem 
                      href="/institutes" 
                      icon={<Building className="w-5 h-5 mr-2" />}
                      active={isActive("/institutes")}
                      onClick={onClose}
                    >
                      교육 기관
                    </NavItem>
                    
                    <NavItem 
                      href="/community" 
                      icon={<MessageSquare className="w-5 h-5 mr-2" />}
                      active={isActive("/community")}
                      onClick={onClose}
                    >
                      커뮤니티
                    </NavItem>
                  </>
                )}

                {expanded ? (
                  <div 
                    className="px-3 py-2 mt-6 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleMenuGroup('features')}
                  >
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      주요 기능
                    </h3>
                    {menuGroups.features ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </div>
                ) : (
                  <div className="flex justify-center py-2 mt-4">
                    <Video className="h-4 w-4 text-gray-500" />
                  </div>
                )}
                
                {menuGroups.features && (
                  <>
                    <NavItem 
                      href="/video-training" 
                      icon={<Video className="w-5 h-5 mr-2" />}
                      active={isActive("/video-training")}
                      onClick={onClose}
                    >
                      영상 훈련
                    </NavItem>
                    
                    <NavItem 
                      href="/video-call" 
                      icon={<VideoIcon className="w-5 h-5 mr-2" />}
                      active={isActive("/video-call")}
                      onClick={onClose}
                    >
                      화상 훈련
                    </NavItem>
                    
                    <NavItem 
                      href="/shop" 
                      icon={<ShoppingBag className="w-5 h-5 mr-2" />}
                      active={isActive("/shop")}
                      onClick={onClose}
                    >
                      쇼핑
                    </NavItem>
                    
                    <NavItem 
                      href="/messages" 
                      icon={<MessageSquare className="w-5 h-5 mr-2" />}
                      active={isActive("/messages")}
                      onClick={onClose}
                    >
                      메시지
                    </NavItem>
                    
                    <NavItem 
                      href="/notifications" 
                      icon={<Bell className="w-5 h-5 mr-2" />}
                      active={isActive("/notifications")}
                      onClick={onClose}
                    >
                      알림장
                    </NavItem>
                    
                    <NavItem 
                      href="/locations" 
                      icon={<MapPin className="w-5 h-5 mr-2" />}
                      active={isActive("/locations")}
                      onClick={onClose}
                    >
                      위치 기반 서비스
                    </NavItem>
                    
                    <NavItem 
                      href="/recommendations" 
                      icon={<ThumbsUp className="w-5 h-5 mr-2" />}
                      active={isActive("/recommendations")}
                      onClick={onClose}
                    >
                      맞춤 추천
                    </NavItem>
                  </>
                )}
                
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
                  <div className="flex justify-center py-2 mt-4">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                  </div>
                )}
                
                {menuGroups.myLearning && (
                  <>
                    <NavItem 
                      href="/my-courses" 
                      icon={<BookOpen className="w-5 h-5 mr-2" />}
                      active={isActive("/my-courses")}
                      onClick={onClose}
                    >
                      내 강의실
                    </NavItem>
                    
                    <NavItem 
                      href="/my-pets" 
                      icon={<PawPrint className="w-5 h-5 mr-2" />}
                      active={isActive("/my-pets")}
                      onClick={onClose}
                    >
                      내 반려견
                    </NavItem>
                    
                    <NavItem 
                      href="/calendar" 
                      icon={<Calendar className="w-5 h-5 mr-2" />}
                      active={isActive("/calendar")}
                      onClick={onClose}
                    >
                      교육 일정
                    </NavItem>
                    
                    <NavItem 
                      href="/certificates" 
                      icon={<Award className="w-5 h-5 mr-2" />}
                      active={isActive("/certificates")}
                      onClick={onClose}
                    >
                      자격증 및 수료증
                    </NavItem>
                  </>
                )}
              </>
            )}
            
            {/* Conditional role-based menus */}
            {(userRole === "trainer" || userRole === "pet-owner" || userRole === "institute-admin" || userRole === "admin") && (
              <>
                {expanded && (
                  <div 
                    className="px-3 py-2 mt-6 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleMenuGroup('trainer')}
                  >
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      훈련사 메뉴
                    </h3>
                    {menuGroups.trainer ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </div>
                )}
                
                {menuGroups.trainer && (
                  <>
                    <NavItem 
                      href="/trainer/dashboard" 
                      icon={<Presentation className="w-5 h-5 mr-2" />}
                      active={isActive("/trainer/dashboard")}
                      onClick={onClose}
                    >
                      훈련사 대시보드
                    </NavItem>
                    
                    <NavItem 
                      href="/trainer/courses" 
                      icon={<Edit className="w-5 h-5 mr-2" />}
                      active={isActive("/trainer/courses")}
                      onClick={onClose}
                    >
                      강의 관리
                    </NavItem>
                    
                    <NavItem 
                      href="/trainer/students" 
                      icon={<Users className="w-5 h-5 mr-2" />}
                      active={isActive("/trainer/students")}
                      onClick={onClose}
                    >
                      수강생 관리
                    </NavItem>
                    
                    <NavItem 
                      href="/trainer/stats" 
                      icon={<LineChart className="w-5 h-5 mr-2" />}
                      active={isActive("/trainer/stats")}
                      onClick={onClose}
                    >
                      통계 및 수익
                    </NavItem>
                  </>
                )}
              </>
            )}
            
            {/* Institute Admin Menu */}
            {(userRole === "institute-admin" || userRole === "admin") && (
              <>
                {expanded && (
                  <div 
                    className="px-3 py-2 mt-6 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleMenuGroup('institute')}
                  >
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      기관 관리자
                    </h3>
                    {menuGroups.institute ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </div>
                )}
                
                {menuGroups.institute && (
                  <>
                    <NavItem 
                      href="/institute/dashboard" 
                      icon={<Presentation className="w-5 h-5 mr-2" />}
                      active={isActive("/institute/dashboard")}
                      onClick={onClose}
                    >
                      기관 대시보드
                    </NavItem>
                    
                    <NavItem 
                      href="/institute/trainers" 
                      icon={<UserRoundCheck className="w-5 h-5 mr-2" />}
                      active={isActive("/institute/trainers")}
                      onClick={onClose}
                    >
                      훈련사 관리
                    </NavItem>
                    
                    <NavItem 
                      href="/institute/courses" 
                      icon={<Edit className="w-5 h-5 mr-2" />}
                      active={isActive("/institute/courses")}
                      onClick={onClose}
                    >
                      교육과정 관리
                    </NavItem>
                    
                    <NavItem 
                      href="/institute/students" 
                      icon={<Users className="w-5 h-5 mr-2" />}
                      active={isActive("/institute/students")}
                      onClick={onClose}
                    >
                      수강생 관리
                    </NavItem>
                    
                    <NavItem 
                      href="/institute/stats" 
                      icon={<AreaChart className="w-5 h-5 mr-2" />}
                      active={isActive("/institute/stats")}
                      onClick={onClose}
                    >
                      통계 및 수익
                    </NavItem>
                    
                    <NavItem 
                      href="/institute/settings" 
                      icon={<Cog className="w-5 h-5 mr-2" />}
                      active={isActive("/institute/settings")}
                      onClick={onClose}
                    >
                      기관 설정
                    </NavItem>
                  </>
                )}
              </>
            )}
            
            {/* System Admin Menu */}
            {userRole === "admin" && (
              <>
                {expanded && (
                  <div 
                    className="px-3 py-2 mt-6 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleMenuGroup('admin')}
                  >
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      시스템 관리자
                    </h3>
                    {menuGroups.admin ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </div>
                )}
                
                {menuGroups.admin && (
                  <>
                    <NavItem 
                      href="/admin/dashboard" 
                      icon={<Presentation className="w-5 h-5 mr-2" />}
                      active={isActive("/admin/dashboard")}
                      onClick={onClose}
                    >
                      관리자 대시보드
                    </NavItem>
                    
                    <NavItem 
                      href="/admin/users" 
                      icon={<UserCog className="w-5 h-5 mr-2" />}
                      active={isActive("/admin/users")}
                      onClick={onClose}
                    >
                      사용자 관리
                    </NavItem>
                    
                    <NavItem 
                      href="/admin/institutes" 
                      icon={<Building className="w-5 h-5 mr-2" />}
                      active={isActive("/admin/institutes")}
                      onClick={onClose}
                    >
                      기관 관리
                    </NavItem>
                    
                    <NavItem 
                      href="/admin/courses" 
                      icon={<Edit className="w-5 h-5 mr-2" />}
                      active={isActive("/admin/courses")}
                      onClick={onClose}
                    >
                      강의 관리
                    </NavItem>
                    
                    <NavItem 
                      href="/admin/reports" 
                      icon={<CheckSquare className="w-5 h-5 mr-2" />}
                      active={isActive("/admin/reports")}
                      onClick={onClose}
                    >
                      신고 관리
                    </NavItem>
                    
                    <NavItem 
                      href="/admin/settings" 
                      icon={<Wrench className="w-5 h-5 mr-2" />}
                      active={isActive("/admin/settings")}
                      onClick={onClose}
                    >
                      시스템 설정
                    </NavItem>
                    
                    <NavItem 
                      href="/admin/shop" 
                      icon={<Store className="w-5 h-5 mr-2" />}
                      active={isActive("/admin/shop")}
                      onClick={onClose}
                    >
                      쇼핑몰 관리
                    </NavItem>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}