import { Link, useLocation } from "wouter";
// import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
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
  Store
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const [location] = useLocation();
  
  // Mock user data for development
  const user = {
    id: 1,
    name: "관리자",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  };
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 bg-white dark:bg-gray-900 w-64 transform transition-transform duration-300 ease-in-out shadow-md z-50",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* 사이드바 상단 여백 */}
      <div className="h-16"></div>
      
      {/* Navigation */}
      <div className="px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              메인 메뉴
            </h3>
          </div>
          
          <NavItem 
            href="/dashboard" 
            icon={<Home className="w-5 h-5 mr-2" />}
            active={isActive("/dashboard") || isActive("/")}
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

          <div className="px-3 py-2 mt-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              주요 기능
            </h3>
          </div>
          
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
          
          <div className="px-3 py-2 mt-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              내 학습
            </h3>
          </div>
          
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
          
          {/* Conditional role-based menus */}
          {(user?.role === "trainer" || user?.role === "pet-owner" || user?.role === "institute-admin" || user?.role === "admin") && (
            <>
              <div className="px-3 py-2 mt-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  훈련사 메뉴
                </h3>
              </div>
              
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
                href="/trainer/earnings" 
                icon={<LineChart className="w-5 h-5 mr-2" />}
                active={isActive("/trainer/earnings")}
                onClick={onClose}
              >
                수익 관리
              </NavItem>
              
              <NavItem 
                href="/trainer/video-content" 
                icon={<Video className="w-5 h-5 mr-2" />}
                active={isActive("/trainer/video-content")}
                onClick={onClose}
              >
                영상 콘텐츠 관리
              </NavItem>
              
              <NavItem 
                href="/trainer/video-sessions" 
                icon={<VideoIcon className="w-5 h-5 mr-2" />}
                active={isActive("/trainer/video-sessions")}
                onClick={onClose}
              >
                화상 세션 일정
              </NavItem>
            </>
          )}
          
          {(user?.role === "institute-admin" || user?.role === "admin") && (
            <>
              <div className="px-3 py-2 mt-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  기관 관리
                </h3>
              </div>
              
              <NavItem 
                href="/institute/dashboard" 
                icon={<Building className="w-5 h-5 mr-2" />}
                active={isActive("/institute/dashboard")}
                onClick={onClose}
              >
                기관 대시보드
              </NavItem>
              
              <NavItem 
                href="/institute/courses" 
                icon={<BookOpen className="w-5 h-5 mr-2" />}
                active={isActive("/institute/courses")}
                onClick={onClose}
              >
                기관 강의 관리
              </NavItem>
              
              <NavItem 
                href="/institute/trainers" 
                icon={<UserRoundCheck className="w-5 h-5 mr-2" />}
                active={isActive("/institute/trainers")}
                onClick={onClose}
              >
                소속 훈련사 관리
              </NavItem>
              
              <NavItem 
                href="/institute/analytics" 
                icon={<AreaChart className="w-5 h-5 mr-2" />}
                active={isActive("/institute/analytics")}
                onClick={onClose}
              >
                기관 분석
              </NavItem>
              
              <NavItem 
                href="/institute/products" 
                icon={<Store className="w-5 h-5 mr-2" />}
                active={isActive("/institute/products")}
                onClick={onClose}
              >
                기관 상품 관리
              </NavItem>
              
              <NavItem 
                href="/institute/locations" 
                icon={<MapPin className="w-5 h-5 mr-2" />}
                active={isActive("/institute/locations")}
                onClick={onClose}
              >
                기관 위치 관리
              </NavItem>
            </>
          )}
          
          {user?.role === "admin" && (
            <>
              <div className="px-3 py-2 mt-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  관리자
                </h3>
              </div>
              
              <NavItem 
                href="/admin/dashboard" 
                icon={<Cog className="w-5 h-5 mr-2" />}
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
                href="/admin/trainers" 
                icon={<UserRoundCheck className="w-5 h-5 mr-2" />}
                active={isActive("/admin/trainers")}
                onClick={onClose}
              >
                훈련사 관리
              </NavItem>
              
              <NavItem 
                href="/admin/approvals" 
                icon={<CheckSquare className="w-5 h-5 mr-2" />}
                active={isActive("/admin/approvals")}
                onClick={onClose}
              >
                승인 관리
              </NavItem>
              
              <NavItem 
                href="/admin/commission" 
                icon={<LineChart className="w-5 h-5 mr-2" />}
                active={isActive("/admin/commission")}
                onClick={onClose}
              >
                수수료 관리
              </NavItem>
              
              <NavItem 
                href="/admin/referral" 
                icon={<Users className="w-5 h-5 mr-2" />}
                active={isActive("/admin/referral")}
                onClick={onClose}
              >
                추천인 시스템
              </NavItem>
              
              <NavItem 
                href="/admin/menu-config" 
                icon={<Wrench className="w-5 h-5 mr-2" />}
                active={isActive("/admin/menu-config")}
                onClick={onClose}
              >
                기관별 메뉴 설정
              </NavItem>
              
              <NavItem 
                href="/admin/settlement" 
                icon={<LineChart className="w-5 h-5 mr-2" />}
                active={isActive("/admin/settlement")}
                onClick={onClose}
              >
                기관별 정산 관리
              </NavItem>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ href, icon, children, active, onClick }: NavItemProps) {
  return (
    <Link href={href}>
      <a 
        className={cn(
          "sidebar-link flex items-center px-3 py-2 text-sm font-medium rounded-md",
          active 
            ? "bg-primary/10 text-primary" 
            : "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
        )}
        onClick={onClick}
      >
        {icon}
        <span>{children}</span>
      </a>
    </Link>
  );
}
