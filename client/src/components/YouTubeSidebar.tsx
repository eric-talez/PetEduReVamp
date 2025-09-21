import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import {
  Home,
  GraduationCap,
  Users,
  MessageCircle,
  ShoppingCart,
  Calendar,
  Bell,
  User,
  Settings,
  Video,
  Heart,
  Building,
  BarChart3,
  BookOpen,
  UserCheck,
  Award,
  Shield,
  CreditCard,
  Menu,
  ChevronRight
} from "lucide-react";

interface YouTubeSidebarProps {
  open: boolean;
  onClose: () => void;
  userRole: string | null;
  isAuthenticated: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  roles?: string[];
  isPublic?: boolean;
  divider?: boolean;
}

const sidebarItems: SidebarItem[] = [
  // Main navigation
  { id: 'home', label: '홈', icon: <Home className="w-5 h-5" />, path: '/', isPublic: true },
  { id: 'courses', label: '강의', icon: <GraduationCap className="w-5 h-5" />, path: '/courses', isPublic: true },
  { id: 'trainers', label: '훈련사', icon: <Users className="w-5 h-5" />, path: '/trainers', isPublic: true },
  { id: 'institutes', label: '기관', icon: <Building className="w-5 h-5" />, path: '/institutes', isPublic: true },
  
  // Divider
  { id: 'divider1', label: '', icon: null, path: '', divider: true },
  
  // User-specific content
  { id: 'dashboard', label: '대시보드', icon: <BarChart3 className="w-5 h-5" />, path: '/dashboard', roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'] },
  { id: 'my-pets', label: '내 반려견', icon: <Heart className="w-5 h-5" />, path: '/my-pets', roles: ['pet-owner', 'admin'] },
  { id: 'notebook', label: '알림장', icon: <BookOpen className="w-5 h-5" />, path: '/notebook', roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'] },
  { id: 'messages', label: '메시지', icon: <MessageCircle className="w-5 h-5" />, path: '/messages', roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'] },
  { id: 'calendar', label: '일정', icon: <Calendar className="w-5 h-5" />, path: '/calendar', roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'] },
  
  // Divider
  { id: 'divider2', label: '', icon: null, path: '', divider: true },
  
  // Shopping & Services
  { id: 'shop', label: '쇼핑', icon: <ShoppingCart className="w-5 h-5" />, path: '/shop', isPublic: true },
  { id: 'video-training', label: '영상 훈련', icon: <Video className="w-5 h-5" />, path: '/video-training', isPublic: true },
  { id: 'community', label: '커뮤니티', icon: <MessageCircle className="w-5 h-5" />, path: '/community', isPublic: true },
  
  // Divider
  { id: 'divider3', label: '', icon: null, path: '', divider: true },
  
  // Admin sections
  { id: 'admin', label: '관리자', icon: <Shield className="w-5 h-5" />, path: '/admin', roles: ['admin'] },
  { id: 'trainer-dashboard', label: '훈련사 대시보드', icon: <UserCheck className="w-5 h-5" />, path: '/trainer', roles: ['trainer', 'admin'] },
  { id: 'institute-dashboard', label: '기관 관리', icon: <Building className="w-5 h-5" />, path: '/institute-admin', roles: ['institute-admin', 'admin'] },
];

export function YouTubeSidebar({ 
  open, 
  onClose, 
  userRole, 
  isAuthenticated,
  expanded,
  onToggleExpand
}: YouTubeSidebarProps) {
  const [location, setLocation] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const canAccessItem = (item: SidebarItem) => {
    if (item.isPublic) return true;
    if (!isAuthenticated) return false;
    if (!item.roles) return true;
    if (!userRole) return false;
    return item.roles.includes(userRole);
  };

  const handleItemClick = (path: string) => {
    if (path === '/shop') {
      window.open('https://replit.com/join/wshpfpjewg-hnblgkjw', '_blank', 'noopener,noreferrer');
      return;
    }
    
    setLocation(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-[#0f0f0f] transition-all duration-200 ease-in-out z-50 lg:z-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600",
          expanded ? "w-60" : "w-[72px]",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="py-2">
          {sidebarItems.map((item) => {
            if (item.divider) {
              return expanded ? (
                <div key={item.id} className="my-3 mx-6 border-t border-gray-200 dark:border-gray-700" />
              ) : (
                <div key={item.id} className="my-3 mx-3 border-t border-gray-200 dark:border-gray-700" />
              );
            }

            if (!canAccessItem(item)) return null;

            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.path)}
                className={cn(
                  "w-full flex items-center transition-all duration-150 ease-in-out group",
                  expanded ? "px-3 py-2 mx-3 rounded-lg" : "px-0 py-3 mx-0 flex-col justify-center",
                  active 
                    ? expanded 
                      ? "bg-gray-100 dark:bg-[#272727] text-gray-900 dark:text-white" 
                      : "text-gray-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#272727]"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center",
                  expanded ? "mr-6" : "mb-1",
                  active && !expanded ? "text-gray-900 dark:text-white" : ""
                )}>
                  {item.icon}
                </div>
                
                {expanded ? (
                  <span className="text-sm font-normal truncate">{item.label}</span>
                ) : (
                  <span className="text-xs text-center leading-tight max-w-[64px] truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Collapse/Expand button for desktop */}
        {expanded && (
          <div className="hidden lg:block absolute bottom-4 left-0 right-0 px-3">
            <button
              onClick={onToggleExpand}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-lg transition-colors"
            >
              <span>사이드바 접기</span>
              <Menu className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}