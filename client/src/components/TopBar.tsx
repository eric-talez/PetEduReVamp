import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { 
  Bell, 
  Menu, 
  Search, 
  GraduationCap, 
  UserRoundCheck, 
  Building, 
  MessageSquare,
  Video,
  ShoppingBag
} from "lucide-react";
import { useState } from "react";
import { useClickAway } from "@/hooks/use-mobile";
import { Link, useLocation } from "wouter";
import { useAuth } from "../SimpleApp";

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function TopBar({ sidebarOpen, onToggleSidebar }: TopBarProps) {
  const { userName, userRole, logout, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  
  const handleLogout = () => {
    console.log("Logout button clicked");
    logout();
  };
  
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useClickAway<HTMLDivElement>(() => setUserMenuOpen(false));
  
  // 메인 네비게이션 아이템
  const mainNavItems = [
    { href: "/courses", label: "강의", icon: <GraduationCap className="h-4 w-4 mr-1" /> },
    { href: "/trainers", label: "훈련사", icon: <UserRoundCheck className="h-4 w-4 mr-1" /> },
    { href: "/institutes", label: "교육기관", icon: <Building className="h-4 w-4 mr-1" /> },
    { href: "/community", label: "커뮤니티", icon: <MessageSquare className="h-4 w-4 mr-1" /> },
    { href: "/video-call", label: "화상교육", icon: <Video className="h-4 w-4 mr-1" /> },
    { href: "/shop", label: "쇼핑", icon: <ShoppingBag className="h-4 w-4 mr-1" /> },
  ];

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-900 shadow-sm z-10 transition-colors">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:pl-6 lg:pr-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleSidebar} 
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Mobile logo - 모바일에서만 표시 */}
          <div className="flex items-center lg:hidden ml-2">
            <Link href="/" className="flex items-center">
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                PetEdu<span className="text-primary">Platform</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop - 메인 내비게이션 */}
          <div className="hidden lg:flex items-center space-x-1 flex-1">
            {/* 메인 홈 로고 */}
            <Link href="/" className="flex items-center mr-6">
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                PetEdu<span className="text-primary">Platform</span>
              </span>
            </Link>
            
            {/* 메인 네비게이션 */}
            {isAuthenticated && (
              <div className="flex space-x-1">
                {mainNavItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.startsWith(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
            
            {/* Search */}
            <div className="flex-1 flex justify-end">
              <div className="max-w-xl w-full max-w-sm">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary" 
                    placeholder="강의, 훈련사, 기관 검색" 
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Notifications - 로그인한 경우만 표시 */}
            {isAuthenticated && (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                  onClick={() => setLocation("/notifications")}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                    2
                  </span>
                </Button>
              </div>
            )}
            
            {/* User menu - 로그인한 경우만 표시 */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white">
                      {userName ? userName.substring(0, 1).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-sm font-medium hidden lg:block">
                    {userName || "사용자"}님
                    {userRole && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                        {userRole === 'admin' && '관리자'}
                        {userRole === 'trainer' && '훈련사'}
                        {userRole === 'institute-admin' && '기관 관리자'}
                        {userRole === 'pet-owner' && '견주'}
                        {userRole === 'user' && '일반회원'}
                      </span>
                    )}
                  </span>
                  <svg className="w-4 h-4 ml-1 hidden lg:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                      <div className="font-semibold">{userName || "사용자"}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {userRole === 'admin' && '시스템 관리자'}
                        {userRole === 'trainer' && '훈련사'}
                        {userRole === 'institute-admin' && '기관 관리자'}
                        {userRole === 'pet-owner' && '견주 회원'}
                        {userRole === 'user' && '일반 회원'}
                      </div>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                      내 프로필
                    </Link>
                    <Link href="/my-courses" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                      내 강의실
                    </Link>
                    <Link href="/my-pets" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                      내 반려견
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                      설정
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // 로그인이 안된 경우 로그인/회원가입 버튼 표시
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <Link href="/auth">로그인</Link>
                </Button>
                <Button variant="default" size="sm">
                  <Link href="/auth?tab=register">회원가입</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
