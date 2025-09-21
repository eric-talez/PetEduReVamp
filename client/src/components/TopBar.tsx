import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Menu, 
  Search, 
  Bell
} from "lucide-react";
import { useState } from "react";
import { useClickAway } from "@/hooks/use-mobile";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

// YouTube 스타일 TopBar 컴포넌트
export function TopBar({ sidebarOpen, onToggleSidebar }: TopBarProps) {
  const auth = useAuth();
  const [location, setLocation] = useLocation();
  
  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
  // 팝업 메뉴 상태
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationPopupOpen, setNotificationPopupOpen] = useState(false);
  
  // 외부 클릭 감지
  const userMenuRef = useClickAway<HTMLDivElement>(() => setUserMenuOpen(false));
  const notificationPopupRef = useClickAway<HTMLDivElement>(() => setNotificationPopupOpen(false));
  
  // 알림 데이터
  const [notifications, setNotifications] = useState([
    {
      id: "notif1",
      title: "새로운 알림",
      content: "새로운 강의가 등록되었습니다.",
      timestamp: "2024-02-15T14:30:00",
      type: "info" as const,
      read: false
    }
  ]);
  
  // 로그아웃 처리
  const handleLogout = () => {
    if (auth?.logout) {
      auth.logout();
    }
    setLocation('/');
  };
  
  // 검색 처리
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  console.log('TopBar rendered with auth state:', auth);
  console.log('TopBar global auth state:', (window as any).__peteduAuthState);

  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-0 w-full z-50">
      <div className="h-14 px-4 flex items-center justify-between">
        {/* 왼쪽: 햄버거 메뉴 + 로고 */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleSidebar}
            className="h-11 w-11 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full min-h-[44px] min-w-[44px] focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="메뉴 토글"
            aria-expanded={sidebarOpen}
            data-testid="menu-toggle-button"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>
          
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-xl lg:text-xl font-bold text-red-600 dark:text-red-500">
              TALEZ
            </div>
          </Link>
        </div>
        
        {/* 중앙: 검색바 */}
        <div className="flex-1 max-w-2xl mx-8 hidden lg:block">
          <div className="flex items-center">
            <div className="flex-1 flex border border-gray-300 dark:border-zinc-600 rounded-l-full bg-white dark:bg-zinc-900">
              <input
                type="text"
                placeholder="강의, 훈련사, 기관 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-6 py-2 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="px-6 py-2 bg-gray-50 dark:bg-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-600 border border-l-0 border-gray-300 dark:border-zinc-600 rounded-r-full"
              variant="ghost"
            >
              <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        </div>
        
        {/* 오른쪽: 모바일 검색 + 알림 + 사용자 메뉴 */}
        <div className="flex items-center space-x-2">
          {/* 모바일 검색 버튼 - YouTube 스타일 */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="h-10 w-10 lg:hidden hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full min-h-[44px] min-w-[44px]"
            aria-label="검색"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          {/* 알림 */}
          {auth.isAuthenticated && (
            <div className="relative" ref={notificationPopupRef}>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setNotificationPopupOpen(!notificationPopupOpen)}
                className="h-11 w-11 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full relative min-h-[44px] min-w-[44px]"
                aria-label="알림"
              >
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </div>
                )}
              </Button>
              
              {/* 알림 팝업 */}
              {notificationPopupOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
                    <h3 className="text-sm font-semibold">알림</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => {
                            setNotifications(prev => 
                              prev.map(n => n.id === notification.id ? {...n, read: true} : n)
                            );
                            setNotificationPopupOpen(false);
                          }}
                        >
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notification.content}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">알림이 없습니다</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* 사용자 메뉴 */}
          {auth.isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="h-11 w-11 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full min-h-[44px] min-w-[44px]"
                aria-label="사용자 메뉴"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-red-600 text-white text-sm">
                    {auth.userName ? auth.userName.substring(0, 1) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
              
              {/* 사용자 메뉴 드롭다운 */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
                    <p className="text-sm font-semibold">{auth.userName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{auth.userRole}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      내 프로필
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      설정
                    </Link>
                    <div className="border-t border-gray-200 dark:border-zinc-700 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/auth')}
                className="hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                로그인
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setLocation('/auth?tab=register')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                회원가입
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* 모바일 검색 오버레이 - YouTube 스타일 */}
      {mobileSearchOpen && (
        <div className="absolute top-0 left-0 w-full h-14 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 z-50 lg:hidden">
          <div className="h-full px-4 flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileSearchOpen(false)}
              className="h-10 w-10 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full mr-3 min-h-[44px] min-w-[44px]"
              aria-label="검색 닫기"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            
            <div className="flex-1 flex">
              <input
                type="text"
                placeholder="검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 text-base bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-l-full focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[44px]"
                autoFocus
              />
              <Button
                onClick={() => {
                  handleSearch();
                  setMobileSearchOpen(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 border border-red-600 rounded-r-full min-h-[44px]"
              >
                <Search className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}