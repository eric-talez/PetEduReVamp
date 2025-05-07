import { Link, useLocation } from "wouter";
import { BarChart } from "@/components/ui/chart";
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
  Menu,
  Activity,
  HelpCircle,
  Brain,
  BarChart2,
  Sparkles,
  DollarSign
} from "lucide-react";

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
  onClick?: (path: string) => void;
  show: boolean; // 추가: 권한에 따른 메뉴 표시 여부
}

function NavItem({ href, icon, children, active, onClick, show }: NavItemProps) {
  const { expanded } = useContext(SidebarContext);
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 일부 경로는 직접 URL 이동으로 처리하기 위해 기본 동작 방지
    if (href === '/video-call' || href === '/video-training') {
      e.preventDefault();
    }
    
    if (onClick) {
      onClick(href);
    }
  };

  return show ? ( // 추가: show 프로퍼티를 사용하여 메뉴 표시 여부 제어
    <Link
      href={href}
      className={cn(
        "sidebar-link flex items-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out",
        expanded ? "px-3" : "px-2 justify-center",
        active ? "bg-primary/10 text-primary" : "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
      )}
      onClick={handleClick}
      title={expanded ? undefined : children?.toString()}
    >
      {icon}
      {expanded && <span>{children}</span>}
    </Link>
  ) : null;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  userRole: string | null;
  isAuthenticated: boolean;
}

export function Sidebar({ open, onClose, userRole, isAuthenticated }: SidebarProps) {
  const [location] = useLocation();
  const [expanded, setExpanded] = useState(true);

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

  const [menuGroups, setMenuGroups] = useState({
    main: true,
    features: true,
    myLearning: true,
    trainer: false,
    institute: false,
    admin: false
  });

  useEffect(() => {
    if (userRole) {
      setMenuGroups(prev => ({
        ...prev,
        trainer: userRole === 'trainer' || userRole === 'admin',
        institute: userRole === 'institute-admin' || userRole === 'admin',
        admin: userRole === 'admin'
      }));
    }
  }, [userRole]);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

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

  const handleItemClick = (path: string) => {
    console.log(`메뉴 클릭: ${path} (사용자 역할: ${userRole || '비로그인'})`);
    
    // 상세 페이지 라우팅 처리
    if (path.startsWith('/courses/')) {
      console.log('강의 상세 페이지 접근');
    } else if (path.startsWith('/trainers/')) {
      console.log('훈련사 상세 페이지 접근');
    } else if (path.startsWith('/institutes/')) {
      console.log('교육기관 상세 페이지 접근');
    } else if (path === '/video-call') {
      console.log('화상 수업 페이지 접근');
    }

    // 권한 체크
    if (!isAuthenticated && 
        !["/", "/courses", "/trainers", "/video-training", "/video-call", "/community", 
          "/institutes", "/institutes/register", "/events", "/events/calendar"].includes(path) && 
        !path.startsWith('/institutes/') && 
        !path.startsWith('/events/') && 
        !path.startsWith('/help/')) {
      console.log('비인증 사용자 접근 제한');
      window.location.href = "/auth";
      return;
    }

    // 일부 라우트에서 404가 발생하는 문제 해결
    if (path === '/video-training') {
      console.log(`${path} 페이지로 이동 중...`);
      // 영상 훈련 메뉴는 직접 URL 이동
      window.location.href = path;
      return;
    }
    
    // 비로그인 상태에서도 화상 수업 목록 조회 가능
    if (path === '/video-call') {
      console.log('화상 수업 페이지로 이동 중');
      window.location.href = path;
      return;
    }

    if (onClose) {
      onClose();
    }
  };

  const contextValue = {
    expanded,
    toggleSidebar
  };

  const showDashboardLink = userRole !== null;
  const showTrainerMenu = userRole === 'trainer' || userRole === 'admin';
  const showInstituteMenu = userRole === 'institute-admin' || userRole === 'admin';
  const showAdminMenu = userRole === 'admin';
  const showPetOwnerMenu = userRole === 'pet-owner' || userRole === 'admin';
  const showBasicMenu = true; // 모든 사용자가 접근 가능한 메뉴
  const isPetOwner = userRole === 'pet-owner';


  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        className={cn(
          "fixed h-screen bg-white dark:bg-gray-900 transform transition-all duration-300 ease-in-out shadow-md flex-shrink-0 z-30",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          expanded ? "w-64" : "w-[70px]"
        )}
      >
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
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none"
            aria-label={expanded ? "사이드바 접기" : "사이드바 펼치기"}
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
                      onClick={(path) => {
                        console.log("비회원 메뉴 클릭:", path);
                        if (path !== "/" && 
                            path !== "/courses" && 
                            path !== "/trainers" && 
                            path !== "/video-training" &&
                            path !== "/community" &&
                            path !== "/institutes" &&
                            path !== "/events" &&
                            !path.startsWith("/help/")) {
                          window.location.href = "/auth";
                          return;
                        }
                        handleItemClick(path);
                      }} 
                      show={true}
                    >홈</NavItem>
                    <NavItem 
                      href="/courses" 
                      icon={<GraduationCap className="w-5 h-5 mr-2" />} 
                      active={isActive("/courses")} 
                      onClick={(path) => {
                        console.log("강의 탐색 메뉴 클릭:", path);
                        handleItemClick(path);
                      }} 
                      show={true}
                    >강의 탐색</NavItem>
                    <NavItem 
                      href="/trainers" 
                      icon={<UserRoundCheck className="w-5 h-5 mr-2" />} 
                      active={isActive("/trainers")} 
                      onClick={(path) => {
                        console.log("훈련사 찾기 메뉴 클릭:", path);
                        handleItemClick(path);
                      }} 
                      show={true}
                    >훈련사 찾기</NavItem>
                    <NavItem 
                      href="/institutes" 
                      icon={<MapPin className="w-5 h-5 mr-2" />} 
                      active={isActive("/institutes")} 
                      onClick={(path) => {
                        console.log("비회원이 위치 서비스 클릭");
                        // 위치 서비스 메뉴는 비회원도 접근 가능
                        window.location.href = path;
                      }} 
                      show={true}
                    >위치 서비스</NavItem>
                    <NavItem 
                      href="/video-training" 
                      icon={<Video className="w-5 h-5 mr-2" />} 
                      active={isActive("/video-training")} 
                      onClick={(path) => {
                        console.log("영상 훈련 메뉴 클릭:", path);
                        handleItemClick(path);
                      }} 
                      show={true}
                    >영상 훈련</NavItem>
                    <NavItem 
                      href="/video-call" 
                      icon={<VideoIcon className="w-5 h-5 mr-2" />} 
                      active={isActive("/video-call")} 
                      onClick={(path) => {
                        console.log("화상 수업 메뉴 클릭:", path);
                        // 직접 URL 이동 처리 (비로그인 화상 수업 접근 허용)
                        window.location.href = path;
                      }} 
                      show={true}
                    >화상 수업</NavItem>
                    <NavItem 
                      href="/community" 
                      icon={<MessageSquare className="w-5 h-5 mr-2" />} 
                      active={isActive("/community")} 
                      onClick={(path) => {
                        console.log("비회원이 커뮤니티 클릭");
                        // 비회원도 커뮤니티 페이지로 이동
                        window.location.href = path;
                      }} 
                      show={true}
                    >커뮤니티</NavItem>
                    <NavItem 
                      href="/events" 
                      icon={<Calendar className="w-5 h-5 mr-2" />} 
                      active={isActive("/events")} 
                      onClick={(path) => {
                        console.log("비회원이 이벤트 메뉴 클릭");
                        // 비회원도 이벤트 페이지로 이동
                        window.location.href = path;
                      }} 
                      show={true}
                    >이벤트</NavItem>
                    
                    {/* 도움말 그룹 추가 */}
                    {expanded && (
                      <div className="mt-4 px-3 py-2">
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          도움말
                        </h3>
                      </div>
                    )}
                    
                    <NavItem 
                      href="/help/faq" 
                      icon={<HelpCircle className="w-5 h-5 mr-2" />} 
                      active={isActive("/help/faq")} 
                      onClick={(path) => {
                        console.log("비회원이 FAQ 클릭");
                        window.location.href = path;
                      }} 
                      show={true}
                    >자주 묻는 질문</NavItem>
                    
                    <NavItem 
                      href="/help/guide" 
                      icon={<BookOpen className="w-5 h-5 mr-2" />} 
                      active={isActive("/help/guide")} 
                      onClick={(path) => {
                        console.log("비회원이 이용 가이드 클릭");
                        window.location.href = path;
                      }} 
                      show={true}
                    >이용 가이드</NavItem>
                    
                    <NavItem 
                      href="/help/about" 
                      icon={<Users className="w-5 h-5 mr-2" />} 
                      active={isActive("/help/about")} 
                      onClick={(path) => {
                        console.log("비회원이 소개 페이지 클릭");
                        window.location.href = path;
                      }} 
                      show={true}
                    >소개</NavItem>
                    
                    <NavItem 
                      href="/help/contact" 
                      icon={<MessageSquare className="w-5 h-5 mr-2" />} 
                      active={isActive("/help/contact")} 
                      onClick={(path) => {
                        console.log("비회원이 문의하기 클릭");
                        window.location.href = path;
                      }} 
                      show={true}
                    >문의하기</NavItem>
                    
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
                  <div className="flex justify-center py-2">
                    <Home className="h-4 w-4 text-gray-500" />
                  </div>
                )}

                {menuGroups.main && (
                  <>
                    <NavItem href="/" icon={<Home className="w-5 h-5 mr-2" />} active={isActive("/")} onClick={handleItemClick} show={true}>홈</NavItem>
                    <NavItem href="/dashboard" icon={<LineChart className="w-5 h-5 mr-2" />} active={isActive("/dashboard")} onClick={handleItemClick} show={showDashboardLink}>대시보드</NavItem>
                    <NavItem href="/courses" icon={<GraduationCap className="w-5 h-5 mr-2" />} active={isActive("/courses")} onClick={handleItemClick} show={true}>강의 탐색</NavItem>
                    <NavItem href="/trainers" icon={<UserRoundCheck className="w-5 h-5 mr-2" />} active={isActive("/trainers")} onClick={handleItemClick} show={true}>훈련사 찾기</NavItem>
                    <NavItem href="/institutes" icon={<MapPin className="w-5 h-5 mr-2" />} active={isActive("/institutes")} onClick={handleItemClick} show={true}>위치 서비스</NavItem>
                    <NavItem href="/community" icon={<MessageSquare className="w-5 h-5 mr-2" />} active={isActive("/community")} onClick={handleItemClick} show={true}>커뮤니티</NavItem>
                    <NavItem href="/events" icon={<Calendar className="w-5 h-5 mr-2" />} active={isActive("/events")} onClick={handleItemClick} show={true}>이벤트</NavItem>
                  </>
                )}


                {/*  Features Menu -  remains largely unchanged */}
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
                      onClick={handleItemClick}
                      show={true}
                    >
                      영상 훈련
                    </NavItem>
                    <NavItem
                      href="/video-call"
                      icon={<VideoIcon className="w-5 h-5 mr-2" />}
                      active={isActive("/video-call")}
                      onClick={handleItemClick}
                      show={true}
                    >
                      화상 훈련
                    </NavItem>
                    <NavItem
                      href="/shop"
                      icon={<ShoppingBag className="w-5 h-5 mr-2" />}
                      active={isActive("/shop")}
                      onClick={handleItemClick}
                      show={true}
                    >
                      쇼핑
                    </NavItem>
                    <NavItem
                      href="/ai-analysis"
                      icon={<Sparkles className="w-5 h-5 mr-2" />}
                      active={isActive("/ai-analysis")}
                      onClick={handleItemClick}
                      show={true}
                    >
                      AI 분석
                    </NavItem>
                    <NavItem
                      href="/messages"
                      icon={<MessageSquare className="w-5 h-5 mr-2" />}
                      active={isActive("/messages")}
                      onClick={handleItemClick}
                      show={true}
                    >
                      메시지
                    </NavItem>
                    <NavItem
                      href="/notifications"
                      icon={<Bell className="w-5 h-5 mr-2" />}
                      active={isActive("/notifications") || isActive("/notifications/system") || isActive("/notifications/training") || isActive("/notifications/payment") || isActive("/notifications/event")}
                      onClick={handleItemClick}
                      show={true}
                    >
                      알림장
                    </NavItem>

                  </>
                )}

                {/* My Learning Menu - remains largely unchanged */}
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
                      onClick={handleItemClick}
                      show={true}
                    >
                      내 강의실
                    </NavItem>
                    <NavItem
                      href="/my-pets"
                      icon={<PawPrint className="w-5 h-5 mr-2" />}
                      active={isActive("/my-pets")}
                      onClick={handleItemClick}
                      show={true}
                    >
                      내 반려견
                    </NavItem>
                    <NavItem
                      href="/notebook/1"
                      icon={<Edit className="w-5 h-5 mr-2" />}
                      active={isActive("/notebook")}
                      onClick={handleItemClick}
                      show={showPetOwnerMenu}
                    >
                      알림장
                    </NavItem>
                    <NavItem
                      href="/calendar"
                      icon={<Calendar className="w-5 h-5 mr-2" />}
                      active={isActive("/calendar")}
                      onClick={handleItemClick}
                      show={true}
                    >
                      교육 일정
                    </NavItem>
                    <NavItem
                      href="/certificates"
                      icon={<Award className="w-5 h-5 mr-2" />}
                      active={isActive("/certificates")}
                      onClick={handleItemClick}
                      show={true}
                    >
                      자격증 및 수료증
                    </NavItem>
                  </>
                )}

                {/* Trainer Menu - remains largely unchanged */}
                {showTrainerMenu && (
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
                          onClick={handleItemClick}
                          show={true}
                        >
                          훈련사 대시보드
                        </NavItem>
                        <NavItem
                          href="/trainer/courses"
                          icon={<Edit className="w-5 h-5 mr-2" />}
                          active={isActive("/trainer/courses")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          강의 관리
                        </NavItem>
                        <NavItem
                          href="/trainer/students"
                          icon={<Users className="w-5 h-5 mr-2" />}
                          active={isActive("/trainer/students")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          수강생 관리
                        </NavItem>
                        <NavItem
                          href="/trainer/stats"
                          icon={<LineChart className="w-5 h-5 mr-2" />}
                          active={isActive("/trainer/stats")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          통계 및 수익
                        </NavItem>
                        <NavItem
                          href="/trainer-dashboard/referrals"
                          icon={<Users className="w-5 h-5 mr-2" />}
                          active={isActive("/trainer-dashboard/referrals")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          추천인 코드 관리
                        </NavItem>
                        <NavItem
                          href="/trainer-dashboard/product-referrals"
                          icon={<ShoppingBag className="w-5 h-5 mr-2" />}
                          active={isActive("/trainer-dashboard/product-referrals")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          제품 추천 관리
                        </NavItem>
                      </>
                    )}
                  </>
                )}

                {/* Institute Admin Menu - remains largely unchanged */}
                {showInstituteMenu && (
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
                          onClick={handleItemClick}
                          show={true}
                        >
                          기관 대시보드
                        </NavItem>
                        <NavItem
                          href="/institute/trainers"
                          icon={<UserRoundCheck className="w-5 h-5 mr-2" />}
                          active={isActive("/institute/trainers")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          훈련사 관리
                        </NavItem>
                        <NavItem
                          href="/institute/courses"
                          icon={<Edit className="w-5 h-5 mr-2" />}
                          active={isActive("/institute/courses")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          교육과정 관리
                        </NavItem>
                        <NavItem
                          href="/institute/students"
                          icon={<Users className="w-5 h-5 mr-2" />}
                          active={isActive("/institute/students")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          수강생 관리
                        </NavItem>
                        <NavItem
                          href="/institute/stats"
                          icon={<AreaChart className="w-5 h-5 mr-2" />}
                          active={isActive("/institute/stats")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          통계 및 수익
                        </NavItem>
                        <NavItem
                          href="/institute/pet-assignments"
                          icon={<PawPrint className="w-5 h-5 mr-2" />}
                          active={isActive("/institute/pet-assignments")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          반려견-훈련사 매칭
                        </NavItem>
                        <NavItem
                          href="/institute/settings"
                          icon={<Cog className="w-5 h-5 mr-2" />}
                          active={isActive("/institute/settings")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          기관 설정
                        </NavItem>
                      </>
                    )}
                  </>
                )}

                {/* Admin Menu - remains largely unchanged */}
                {showAdminMenu && (
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
                          onClick={handleItemClick}
                          show={true}
                        >
                          관리자 대시보드
                        </NavItem>
                        <NavItem
                          href="/admin/users"
                          icon={<UserCog className="w-5 h-5 mr-2" />}
                          active={isActive("/admin/users")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          사용자 관리
                        </NavItem>
                        <NavItem
                          href="/admin/institutes"
                          icon={<Building className="w-5 h-5 mr-2" />}
                          active={isActive("/admin/institutes")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          기관 관리
                        </NavItem>
                        <NavItem
                          href="/admin/courses"
                          icon={<Edit className="w-5 h-5 mr-2" />}
                          active={isActive("/admin/courses")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          강의 관리
                        </NavItem>
                        <NavItem
                          href="/admin/reports"
                          icon={<CheckSquare className="w-5 h-5 mr-2" />}
                          active={isActive("/admin/reports")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          신고 관리
                        </NavItem>
                        <NavItem
                          href="/admin/settings"
                          icon={<Wrench className="w-5 h-5 mr-2" />}
                          active={isActive("/admin/settings")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          시스템 설정
                        </NavItem>
                        <NavItem
                          href="/admin/shop"
                          icon={<Store className="w-5 h-5 mr-2" />}
                          active={isActive("/admin/shop")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          쇼핑몰 관리
                        </NavItem>
                        <NavItem
                          href="/admin/commission-settings"
                          icon={<DollarSign className="w-5 h-5 mr-2" />}
                          active={isActive("/admin/commission-settings")}
                          onClick={handleItemClick}
                          show={true}
                        >
                          커미션 설정
                        </NavItem>
                      </>
                    )}
                  </>
                )}
                
                {/* Help Menu for authenticated users */}
                {expanded ? (
                  <div
                    className="px-3 py-2 mt-6 flex items-center justify-between cursor-pointer"
                  >
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      도움말
                    </h3>
                  </div>
                ) : (
                  <div className="flex justify-center py-2 mt-6">
                    <HelpCircle className="h-4 w-4 text-gray-500" />
                  </div>
                )}
                
                <NavItem
                  href="/help/faq"
                  icon={<HelpCircle className="w-5 h-5 mr-2" />}
                  active={isActive("/help/faq")}
                  onClick={handleItemClick}
                  show={true}
                >
                  자주 묻는 질문
                </NavItem>
                
                <NavItem
                  href="/help/guide"
                  icon={<BookOpen className="w-5 h-5 mr-2" />}
                  active={isActive("/help/guide")}
                  onClick={handleItemClick}
                  show={true}
                >
                  이용 가이드
                </NavItem>
                
                <NavItem
                  href="/help/about"
                  icon={<Users className="w-5 h-5 mr-2" />}
                  active={isActive("/help/about")}
                  onClick={handleItemClick}
                  show={true}
                >
                  소개
                </NavItem>
                
                <NavItem
                  href="/help/contact"
                  icon={<MessageSquare className="w-5 h-5 mr-2" />}
                  active={isActive("/help/contact")}
                  onClick={handleItemClick}
                  show={true}
                >
                  문의하기
                </NavItem>
                
                {/* Service Statistics - moved to the bottom */}
                {expanded ? (
                  <div className="mt-auto mb-4 px-3">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">실시간 이용자</span>
                        <span className="font-semibold text-primary">2,458명</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-600 dark:text-gray-300">사용자 분포</span>
                        <span className="font-semibold text-blue-500">반려인 75%</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-600 dark:text-gray-300">평균 체류시간</span>
                        <span className="font-semibold text-green-500">32분</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-auto mb-4 px-2">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 flex justify-center">
                      <Activity className="w-5 h-5 text-primary" aria-label="서비스 현황" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

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
                    <span className="text-gray-600 dark:text-gray-300">사용자 분포</span>
                    <span className="font-semibold text-blue-500">반려인 75%</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600 dark:text-gray-300">평균 체류시간</span>
                    <span className="font-semibold text-green-500">32분</span>
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
      </div>
    </SidebarContext.Provider>
  );
}