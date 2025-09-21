import { QuickThemeToggle } from "@/components/ThemeSettings";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Menu, 
  Search,
  MessageSquare,
  ShoppingCart,
  User,
  Settings,
  LogOut,
  X,
  ArrowRight,
  Video,
  Plus
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useClickAway } from "@/hooks/use-mobile";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface YouTubeTopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  sidebarExpanded: boolean;
  onToggleSidebarExpanded: () => void;
}

export function YouTubeTopBar({ 
  sidebarOpen, 
  onToggleSidebar, 
  sidebarExpanded, 
  onToggleSidebarExpanded 
}: YouTubeTopBarProps) {
  const auth = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  // Refs
  const userMenuRef = useClickAway<HTMLDivElement>(() => setUserMenuOpen(false));
  const notificationRef = useClickAway<HTMLDivElement>(() => setNotificationOpen(false));
  const searchRef = useRef<HTMLInputElement>(null);

  // Logo data
  const { data: logoData } = useQuery({
    queryKey: ['/api/logo'],
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 30000
  });

  const getLogoUrl = () => {
    if (logoData && typeof logoData === 'object') {
      return (logoData as any).logoUrl || "/logo.svg";
    }
    return "/logo.svg";
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "검색어를 입력해주세요",
        variant: "destructive"
      });
      return;
    }
    
    if (location.startsWith('/community')) {
      setLocation(`/community?q=${encodeURIComponent(searchQuery)}`);
    } else {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
    setSearchQuery('');
    searchRef.current?.blur();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('petedu_auth');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    
    if (window.__peteduAuthState) {
      window.__peteduAuthState = {
        isAuthenticated: false,
        userRole: null,
        userName: null
      };
    }
    
    window.dispatchEvent(new CustomEvent('logout'));
    
    fetch('/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    }).catch(err => console.error('서버 로그아웃 API 호출 실패:', err));
    
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left section - Logo and Menu */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Menu */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Desktop Sidebar Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebarExpanded}
            className="hidden lg:flex p-2 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src={getLogoUrl()} 
              alt="TALEZ" 
              className="h-8 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = "/logo.svg";
              }}
            />
          </Link>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
          <div className="relative flex items-center">
            <div className={`
              flex items-center w-full bg-gray-100 dark:bg-[#1c1c1c] rounded-full border
              ${searchFocused ? 'border-blue-500 shadow-md' : 'border-gray-300 dark:border-gray-600'}
              transition-all duration-200
            `}>
              <input
                ref={searchRef}
                type="text"
                placeholder={location.startsWith('/community') ? "커뮤니티 검색" : "강의, 훈련사, 기관 검색"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 bg-transparent px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
              />
              <Button
                type="button"
                onClick={handleSearch}
                className="bg-gray-200 dark:bg-[#272727] hover:bg-gray-300 dark:hover:bg-[#3a3a3a] rounded-r-full px-6 py-2 border-l border-gray-300 dark:border-gray-600"
                disabled={!searchQuery.trim()}
              >
                <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right section - Actions and Profile */}
        <div className="flex items-center space-x-2">
          {/* Create/Upload button for authenticated users */}
          {auth?.isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/courses/create')}
              className="hidden sm:flex p-2 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full"
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}

          {/* Notifications */}
          {auth?.isAuthenticated && (
            <div className="relative" ref={notificationRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setUserMenuOpen(false);
                }}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full"
              >
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="danger"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  3
                </Badge>
              </Button>

              {/* Notifications Dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1c1c1c] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">알림</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-[#272727] cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">새로운 강의가 등록되었습니다</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5분 전</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-[#272727] cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">훈련 일정이 업데이트되었습니다</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1시간 전</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      variant="link" 
                      className="w-full text-blue-600 dark:text-blue-400"
                      onClick={() => {
                        setNotificationOpen(false);
                        setLocation('/notifications');
                      }}
                    >
                      모든 알림 보기
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Theme Toggle */}
          <QuickThemeToggle />

          {/* User Menu */}
          {auth?.isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setNotificationOpen(false);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-500 text-white text-sm">
                    {auth.userName?.substring(0, 1) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1c1c1c] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-500 text-white">
                          {auth.userName?.substring(0, 1) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{auth.userName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{auth.userRole}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setLocation('/profile');
                      }}
                      className="w-full justify-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#272727]"
                    >
                      <User className="h-4 w-4 mr-3" />
                      프로필
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setLocation('/settings');
                      }}
                      className="w-full justify-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#272727]"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      설정
                    </Button>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#272727] text-red-600 dark:text-red-400"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      로그아웃
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full">
                로그인
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-2">
        <div className="flex items-center bg-gray-100 dark:bg-[#1c1c1c] rounded-full border border-gray-300 dark:border-gray-600">
          <input
            type="text"
            placeholder="검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-transparent px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
          />
          <Button
            type="button"
            onClick={handleSearch}
            className="bg-gray-200 dark:bg-[#272727] hover:bg-gray-300 dark:hover:bg-[#3a3a3a] rounded-r-full px-4 py-2"
            disabled={!searchQuery.trim()}
          >
            <Search className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>
      </div>
    </header>
  );
}