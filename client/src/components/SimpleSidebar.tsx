import React, { useState, useEffect, createContext, useContext } from 'react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useAuth } from '../SimpleApp';
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ChevronRight,
  Home,
  BookOpen,
  Star,
  Sparkles,
  LogIn,
  PawPrint,
  MessageSquare,
  GraduationCap,
  UserRoundCheck,
  Building,
  Bell,
  MapPin,
  Video,
  Users,
  Calendar,
  Award,
  ShoppingBag,
  LayoutDashboard,
  UserCheck,
  Cog,
  UserCog,
  FileEdit,
  VideoIcon,
  Presentation,
  CheckSquare,
  Wrench,
  Activity,
  LineChart
} from 'lucide-react';

interface SidebarContextType {
  expanded: boolean;
  toggleExpand: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  expanded: true,
  toggleExpand: () => {},
});

interface SidebarProps {
  onToggleExpand?: (expanded: boolean) => void;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  onClick?: (path: string) => void;
  show: boolean;
}

function NavItem({ href, icon, children, active, onClick, show }: NavItemProps) {
  const { expanded } = useContext(SidebarContext);
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick(href);
    } else {
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

export function SimpleSidebar({ onToggleExpand }: SidebarProps) {
  const { isAuthenticated, userRole } = useAuth();
  const [expanded, setExpanded] = useState(true);
  const [location] = useLocation();
  
  // 기본 메뉴 그룹 (모두 닫힌 상태로 시작)
  const [menuGroups, setMenuGroups] = useState({
    main: false,
    features: false,
    myLearning: false,
    trainer: false,
    institute: false,
    admin: false
  });

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
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location === '/';
    }
    return location.startsWith(path);
  };
  
  // 메뉴 클릭 핸들러
  const handleItemClick = (path: string) => {
    console.log(`메뉴 클릭: ${path} (사용자 역할: ${userRole})`);
    window.location.href = path;
  };
  
  // 컨텍스트 값 설정
  const contextValue = {
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
  }, [onToggleExpand, expanded]);

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
                      onClick={(path) => handleItemClick(path)} 
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
                    <NavItem 
                      href="/shop" 
                      icon={<ShoppingBag className="w-5 h-5 mr-2" />} 
                      active={isActive("/shop")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >쇼핑</NavItem>
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
                  </>
                )}
              </>
            )}
            
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
                      onClick={(path) => handleItemClick(path)} 
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
                      href="/shop" 
                      icon={<ShoppingBag className="w-5 h-5 mr-2" />} 
                      active={isActive("/shop")} 
                      onClick={(path) => handleItemClick(path)} 
                      show={true}
                    >쇼핑</NavItem>
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