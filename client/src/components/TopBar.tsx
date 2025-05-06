import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Search } from "lucide-react";
import { useState } from "react";
import { useClickAway } from "@/hooks/use-mobile";
import { useLocation } from "wouter";

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function TopBar({ sidebarOpen, onToggleSidebar }: TopBarProps) {
  // 임시 mock user 데이터 사용
  const user = {
    name: "관리자",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  };
  
  const [, setLocation] = useLocation();
  
  const handleLogout = () => {
    console.log("Logout clicked");
    // 임시 로그아웃 로직
    setLocation("/auth");
  };
  
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useClickAway<HTMLDivElement>(() => setUserMenuOpen(false));

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-sm z-20 transition-colors">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
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
            <a href="/" className="flex items-center">
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                PetEdu<span className="text-primary">Platform</span>
              </span>
            </a>
          </div>
          
          {/* Desktop - 로고와 검색 영역 */}
          <div className="hidden lg:flex items-center space-x-4 flex-1">
            {/* Logo */}
            <div className="flex items-center mr-4">
              <a href="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-800 dark:text-white">
                  PetEdu<span className="text-primary">Platform</span>
                </span>
              </a>
            </div>
            
            {/* Search */}
            <div className="flex-1">
              <div className="max-w-xl w-full">
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
            
            {/* Notifications */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  2
                </span>
              </Button>
            </div>
            
            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button 
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img 
                    src={user?.avatar} 
                    alt={user?.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="ml-2 text-sm font-medium hidden lg:block">
                  {user?.name || "사용자"}님
                </span>
                <svg className="w-4 h-4 ml-1 hidden lg:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                  <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                    내 프로필
                  </a>
                  <a href="/my-courses" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                    내 강의실
                  </a>
                  <a href="/my-pets" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                    내 반려견
                  </a>
                  <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                    설정
                  </a>
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
          </div>
        </div>
      </div>
    </header>
  );
}
