import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { 
  Bell, 
  Menu, 
  Search,
  MessageSquare,
  ShoppingCart,
  ChevronDown
} from "lucide-react";
import { useState, useEffect } from "react";
import { useClickAway } from "@/hooks/use-mobile";
import { Link, useLocation } from "wouter";
import { useAuth } from "../SimpleApp";

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function TopBar({ sidebarOpen, onToggleSidebar }: TopBarProps) {
  // 전역 상태에서 인증 정보 직접 확인
  const globalAuth = (window as any).__peteduAuthState;
  
  // 로컬 상태와 전역 상태 둘 다 확인
  const auth = useAuth();
  // 전역 상태가 있으면 우선 사용
  const authState = globalAuth || auth;
  
  // 상태 추출
  const userName = authState?.userName || auth?.userName;
  const userRole = authState?.userRole || auth?.userRole;
  const isAuthenticated = authState?.isAuthenticated || auth?.isAuthenticated;
  const logout = auth?.logout;
  const [location, setLocation] = useLocation();
  
  // 디버깅용 로그 (개발 완료 후 제거)
  useEffect(() => {
    console.log('TopBar rendered with auth state:', {
      isAuthenticated,
      userRole,
      userName
    });
    
    // 전역 상태 확인
    if ((window as any).__peteduAuthState) {
      console.log('TopBar global auth state:', (window as any).__peteduAuthState);
    }
  }, [isAuthenticated, userRole, userName]);

  const handleLogout = () => {
    console.log("Logout button clicked");
    logout();
  };

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useClickAway<HTMLDivElement>(() => setUserMenuOpen(false));

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-900 shadow-sm z-10 transition-colors">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:pl-6 lg:pr-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                console.log("햄버거 버튼 클릭");
                onToggleSidebar();
              }}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-12">
            <div className="w-full relative">
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

          {/* Action buttons - Grouped together for better layout */}
          <div className="flex items-center space-x-2">
            {/* Group message, notification and theme toggle together as requested */}
            <div className="flex items-center space-x-2 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => isAuthenticated ? setLocation("/messages") : setLocation("/auth")}
                className="relative"
                aria-label="메시지"
              >
                <MessageSquare className="h-5 w-5" />
                {isAuthenticated && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                    3
                  </span>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => isAuthenticated ? setLocation("/notifications") : setLocation("/auth")}
                className="relative"
                aria-label="알림"
              >
                <Bell className="h-5 w-5" />
                {isAuthenticated && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                    2
                  </span>
                )}
              </Button>
              
              <ThemeToggle />
            </div>

            {isAuthenticated ? (
              <>
                {/* Shopping Cart */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                  onClick={() => setLocation("/shop/cart")}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                    1
                  </span>
                </Button>

                {/* User menu */}
                <div className="relative" ref={userMenuRef}>
                  <button 
                    className="flex items-center space-x-2 focus:outline-none"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <Avatar 
                      className="h-8 w-8" 
                      fallback={userName ? userName.substring(0, 1).toUpperCase() : "U"} 
                    />
                    <span className="hidden lg:flex items-center space-x-1">
                      <span className="text-sm font-medium">{userName}</span>
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                      <div className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                        <div className="font-semibold">{userName}</div>
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
              </>
            ) : (
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