import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { 
  Home,
  Search,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  Download,
  Settings,
  HelpCircle,
  MessageSquare,
  GraduationCap,
  Users,
  Building,
  User,
  BookOpen,
  Calendar,
  PawPrint,
  Video,
  Award,
  Monitor,
  UserCheck,
  Shield,
  Wrench,
  Bell,
  Folder,
  History
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onClose?: () => void;
  userRole: string | null;
  isAuthenticated: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  roles?: string[];
  divider?: boolean;
  external?: boolean;
}

// YouTube 스타일 Sidebar 컴포넌트
export function Sidebar({ 
  open, 
  expanded, 
  onToggleExpand,
  onClose,
  userRole, 
  isAuthenticated 
}: SidebarProps) {
  const [location] = useLocation();
  
  // 메뉴 아이템 정의 (YouTube 스타일)
  const menuItems: MenuItem[] = [
    // 메인 섹션 - YouTube 홈 영역
    { id: 'home', label: '홈', icon: <Home className="w-6 h-6" />, href: '/' },
    { id: 'courses', label: '강의', icon: <PlaySquare className="w-6 h-6" />, href: '/courses' },
    { id: 'video-training', label: '영상 훈련', icon: <Video className="w-6 h-6" />, href: '/video-training' },
    { id: 'video-call', label: '화상 수업', icon: <Monitor className="w-6 h-6" />, href: '/video-call' },
    
    // 구분선
    { id: 'divider1', label: '', icon: null, href: '', divider: true },
    
    // 구독 및 탐색
    { id: 'subscriptions', label: '구독', icon: <Bell className="w-6 h-6" />, href: '/subscriptions', roles: ['authenticated'] },
    { id: 'explore', label: '탐색', icon: <Compass className="w-6 h-6" />, href: '/explore' },
    { id: 'trainers', label: '훈련사', icon: <Users className="w-6 h-6" />, href: '/trainers' },
    
    // 구분선
    { id: 'divider2', label: '', icon: null, href: '', divider: true, roles: ['authenticated'] },
    
    // 라이브러리 (로그인 시)
    { id: 'library', label: '라이브러리', icon: <Folder className="w-6 h-6" />, href: '/library', roles: ['authenticated'] },
    { id: 'history', label: '시청 기록', icon: <History className="w-6 h-6" />, href: '/history', roles: ['authenticated'] },
    { id: 'liked', label: '좋아요', icon: <ThumbsUp className="w-6 h-6" />, href: '/liked', roles: ['authenticated'] },
    { id: 'saved', label: '저장됨', icon: <Download className="w-6 h-6" />, href: '/saved', roles: ['authenticated'] },
    
    // 구분선
    { id: 'divider3', label: '', icon: null, href: '', divider: true, roles: ['authenticated'] },
    
    // 펫 관련 메뉴
    { id: 'my-pets', label: '내 반려견', icon: <PawPrint className="w-6 h-6" />, href: '/my-pets', roles: ['pet-owner', 'trainer'] },
    
    // 구분선
    { id: 'divider4', label: '', icon: null, href: '', divider: true },
    
    // 훈련사 도구
    { id: 'trainer-dashboard', label: '훈련사 대시보드', icon: <User className="w-6 h-6" />, href: '/trainer-dashboard', roles: ['trainer'] },
    { id: 'certifications', label: '자격 관리', icon: <Award className="w-6 h-6" />, href: '/certifications', roles: ['trainer'] },
    { id: 'schedule', label: '일정 관리', icon: <Calendar className="w-6 h-6" />, href: '/schedule', roles: ['trainer'] },
    
    // 기관 관리
    { id: 'institute-dashboard', label: '기관 대시보드', icon: <Building className="w-6 h-6" />, href: '/institute-dashboard', roles: ['institute-admin'] },
    { id: 'trainer-management', label: '훈련사 관리', icon: <UserCheck className="w-6 h-6" />, href: '/trainer-management', roles: ['institute-admin'] },
    
    // 시스템 관리
    { id: 'admin-dashboard', label: '관리자 대시보드', icon: <Shield className="w-6 h-6" />, href: '/admin', roles: ['admin'] },
    { id: 'system-settings', label: '시스템 설정', icon: <Wrench className="w-6 h-6" />, href: '/admin/settings', roles: ['admin'] },
    
    // 구분선
    { id: 'divider5', label: '', icon: null, href: '', divider: true },
    
    // 하단 메뉴
    { id: 'settings', label: '설정', icon: <Settings className="w-6 h-6" />, href: '/settings', roles: ['authenticated'] },
    { id: 'help', label: '도움말', icon: <HelpCircle className="w-6 h-6" />, href: '/help' },
    { id: 'feedback', label: '의견 보내기', icon: <MessageSquare className="w-6 h-6" />, href: '/feedback' },
  ];

  // 역할 기반 메뉴 필터링
  const getVisibleItems = (): MenuItem[] => {
    return menuItems.filter(item => {
      // 구분선은 항상 포함
      if (item.divider) return true;
      
      // 역할 제한이 없는 항목은 항상 표시
      if (!item.roles) return true;
      
      // authenticated 역할 체크 - 로그인 사용자면 허용
      if (item.roles.includes('authenticated')) {
        return isAuthenticated;
      }
      
      // 관리자는 모든 메뉴 접근 가능
      if (userRole === 'admin') return true;
      
      // 특정 역할 체크
      if (userRole && item.roles.includes(userRole)) return true;
      
      // 조건에 맞지 않으면 숨김
      return false;
    });
  };

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  // 메뉴 아이템 렌더링
  const renderMenuItem = (item: MenuItem) => {
    // 구분선
    if (item.divider) {
      return (
        <div key={item.id} className="my-3">
          <div className="border-t border-gray-200 dark:border-zinc-700" />
        </div>
      );
    }

    const active = isActive(item.href);

    // 축소된 상태 (아이콘만)
    if (!expanded) {
      return (
        <TooltipProvider key={item.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={item.href}>
                <div 
                  className={cn(
                    "flex items-center justify-center h-12 mx-2 rounded-lg cursor-pointer transition-all duration-200 min-h-[44px] min-w-[44px]",
                    active 
                      ? "bg-gray-100 dark:bg-zinc-800 text-red-600" 
                      : "hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200"
                  )}
                  onClick={() => onClose?.()} // 모바일에서 메뉴 클릭 시 사이드바 자동 닫기
                >
                  {item.icon}
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // 확장된 상태 (아이콘 + 텍스트)
    return (
      <Link key={item.id} href={item.href}>
        <div 
          className={cn(
            "flex items-center h-11 px-3 mx-3 rounded-lg cursor-pointer transition-all duration-200 group min-h-[44px]",
            active 
              ? "bg-gray-100 dark:bg-zinc-800 text-red-600 font-medium" 
              : "hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200"
          )}
          onClick={() => onClose?.()} // 모바일에서 메뉴 클릭 시 사이드바 자동 닫기
        >
          <div className="flex-shrink-0 mr-6">
            {item.icon}
          </div>
          <span className="text-sm">{item.label}</span>
        </div>
      </Link>
    );
  };

  const visibleItems = getVisibleItems();

  return (
    <div className={cn(
      "fixed left-0 top-16 h-[calc(100vh-64px)] bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 transition-all duration-200 z-40",
      expanded ? "w-64" : "w-[72px]",
      // 모바일에서는 open prop에 따라 표시/숨김
      "lg:translate-x-0",
      open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      {/* 사이드바 토글 버튼 (데스크톱에서만 표시) */}
      <div className="hidden lg:flex items-center justify-end p-2 border-b border-gray-200 dark:border-zinc-800">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleExpand}
          className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-zinc-800"
          aria-label={expanded ? "사이드바 축소" : "사이드바 확장"}
        >
          {expanded ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          )}
        </Button>
      </div>
      {/* 스크롤 영역 */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {/* 로그인되지 않은 사용자를 위한 안내 - YouTube 스타일 */}
          {!isAuthenticated && expanded && (
            <div className="px-6 py-4 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                로그인하여 더 많은 기능을 이용하세요.
              </p>
              <Link href="/auth">
                <Button className="w-full text-sm bg-red-600 hover:bg-red-700 text-white">
                  로그인
                </Button>
              </Link>
            </div>
          )}

          {/* 메뉴 아이템들 */}
          {visibleItems.map(renderMenuItem)}
          
          {/* 하단 여백 */}
          <div className="h-4" />
        </div>
      </ScrollArea>
    </div>
  );
}