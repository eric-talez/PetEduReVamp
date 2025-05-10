import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronRight, 
  HelpCircle, 
  MessageSquare, 
  Home,
  Settings,
  CreditCard,
  Star,
  Rocket,
  UserCheck,
  Building,
  Target,
  Users
} from 'lucide-react';
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

// 서브메뉴 항목 컴포넌트
interface SubMenuItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  onClick?: (path: string) => void;
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({ href, icon, children, active, onClick }) => {
  return (
    <a
      href={href}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ml-5 ${
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

// 메인 메뉴 그룹 컴포넌트
interface MenuGroupProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const MenuGroup: React.FC<MenuGroupProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-2">
      <div
        className="flex items-center justify-between cursor-pointer px-3 py-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-2 text-sm font-medium">{title}</span>
        </div>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </div>
      {isOpen && <div className="mt-1">{children}</div>}
    </div>
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
      {/* 도움말 섹션 헤더 */}
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

      {/* 도움말 메뉴 컨텐츠 */}
      {isOpen && (
        <div className="mt-2 ml-2">
          {/* FAQ 메뉴 그룹 */}
          <MenuGroup 
            title="자주 묻는 질문" 
            icon={<HelpCircle className="w-4 h-4 text-primary" />}
            defaultOpen={isActive('/help/faq')}
          >
            <SubMenuItem
              href="/help/faq/pet-training"
              icon={<Star className="w-4 h-4 mr-2 text-gray-400" />}
              active={isActive('/help/faq/pet-training')}
              onClick={handleItemClick}
            >
              반려동물 훈련
            </SubMenuItem>
            <SubMenuItem
              href="/help/faq/account"
              icon={<Settings className="w-4 h-4 mr-2 text-gray-400" />}
              active={isActive('/help/faq/account')}
              onClick={handleItemClick}
            >
              계정 관리
            </SubMenuItem>
            <SubMenuItem
              href="/help/faq/payment"
              icon={<CreditCard className="w-4 h-4 mr-2 text-gray-400" />}
              active={isActive('/help/faq/payment')}
              onClick={handleItemClick}
            >
              결제 관련
            </SubMenuItem>
          </MenuGroup>

          {/* 이용 가이드 메뉴 그룹 */}
          <MenuGroup 
            title="이용 가이드" 
            icon={<BookOpen className="w-4 h-4 text-blue-500" />}
            defaultOpen={isActive('/help/guide')}
          >
            <SubMenuItem
              href="/help/guide/getting-started"
              icon={<Star className="w-4 h-4 mr-2 text-gray-400" />}
              active={isActive('/help/guide/getting-started')}
              onClick={handleItemClick}
            >
              시작하기
            </SubMenuItem>
            <SubMenuItem
              href="/help/guide/features"
              icon={<Rocket className="w-4 h-4 mr-2 text-gray-400" />}
              active={isActive('/help/guide/features')}
              onClick={handleItemClick}
            >
              주요 기능
            </SubMenuItem>
            <SubMenuItem
              href="/help/guide/trainers"
              icon={<UserCheck className="w-4 h-4 mr-2 text-gray-400" />}
              active={isActive('/help/guide/trainers')}
              onClick={handleItemClick}
            >
              훈련사 활용하기
            </SubMenuItem>
          </MenuGroup>

          {/* 소개 메뉴 */}
          <MenuGroup 
            title="소개" 
            icon={<Users className="w-4 h-4 text-green-500" />}
            defaultOpen={isActive('/help/about')}
          >
            <SubMenuItem
              href="/help/about/company"
              icon={<Building className="w-4 h-4 mr-2 text-gray-400" />}
              active={isActive('/help/about/company')}
              onClick={handleItemClick}
            >
              회사 소개
            </SubMenuItem>
            <SubMenuItem
              href="/help/about/mission"
              icon={<Target className="w-4 h-4 mr-2 text-gray-400" />}
              active={isActive('/help/about/mission')}
              onClick={handleItemClick}
            >
              미션과 비전
            </SubMenuItem>
            <SubMenuItem
              href="/help/about/team"
              icon={<Users className="w-4 h-4 mr-2 text-gray-400" />}
              active={isActive('/help/about/team')}
              onClick={handleItemClick}
            >
              팀원 소개
            </SubMenuItem>
          </MenuGroup>

          {/* 문의하기 메뉴 */}
          <div className="px-3 py-2">
            <a
              href="/help/contact"
              className={`flex items-center rounded-md text-sm font-medium transition-colors ${
                isActive('/help/contact')
                  ? 'text-primary'
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleItemClick('/help/contact');
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              <span>문의하기</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}