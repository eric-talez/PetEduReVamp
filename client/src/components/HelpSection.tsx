import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, HelpCircle, MessageSquare, Users } from 'lucide-react';
import { useLocation } from 'wouter';

interface HelpSectionProps {
  expanded: boolean;
  handleItemClick: (path: string) => void;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  onClick?: (path: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, children, active, onClick }) => {
  return (
    <a
      href={href}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-primary/10 text-primary'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
      }`}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick(href);
      }}
    >
      {icon}
      <span>{children}</span>
    </a>
  );
};

export function HelpSection({ expanded, handleItemClick }: HelpSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  if (!expanded) {
    return (
      <div className="mt-6 px-2">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 flex justify-center">
          <HelpCircle className="w-5 h-5 text-primary" aria-label="도움말" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className="px-3 py-2 mt-6 flex items-center justify-between cursor-pointer bg-gray-100 dark:bg-gray-700 mx-2 rounded"
        onClick={() => {
          console.log('도움말 섹션 토글:', !isOpen);
          setIsOpen(!isOpen);
        }}
      >
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          도움말
        </h3>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-primary" />
        ) : (
          <ChevronRight className="h-4 w-4 text-primary" />
        )}
      </div>

      {isOpen && (
        <>
          <NavItem
            href="/help/faq"
            icon={<HelpCircle className="w-5 h-5 mr-2" />}
            active={isActive('/help/faq')}
            onClick={handleItemClick}
          >
            자주 묻는 질문
          </NavItem>

          <NavItem
            href="/help/guide"
            icon={<BookOpen className="w-5 h-5 mr-2" />}
            active={isActive('/help/guide')}
            onClick={handleItemClick}
          >
            이용 가이드
          </NavItem>

          <NavItem
            href="/help/about"
            icon={<Users className="w-5 h-5 mr-2" />}
            active={isActive('/help/about')}
            onClick={handleItemClick}
          >
            소개
          </NavItem>

          <NavItem
            href="/help/contact"
            icon={<MessageSquare className="w-5 h-5 mr-2" />}
            active={isActive('/help/contact')}
            onClick={handleItemClick}
          >
            문의하기
          </NavItem>
        </>
      )}
    </div>
  );
}