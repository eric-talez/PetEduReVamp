import { UserRole } from './schema';

export type MenuType = 'internal' | 'external';
export type MenuCategory = 'main' | 'learning' | 'management' | 'tools' | 'admin';

export interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  type: MenuType;
  category: MenuCategory;
  roles: UserRole[];
  orderIndex: number;
  isActive: boolean;
  isPublic: boolean;
  openInNewWindow?: boolean;
}

export interface MenuGroup {
  id: MenuCategory;
  title: string;
  icon: string;
  orderIndex: number;
  isActive: boolean;
  isPublic: boolean;
  roles: UserRole[];
  isOpen: boolean;
}

// 간소화된 메뉴 아이템 (중복 제거 및 통합)
export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  // 메인 메뉴 (모든 사용자)
  { id: 'home', title: '홈', path: '/', icon: 'Home', type: 'internal', category: 'main', roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'], orderIndex: 0, isActive: true, isPublic: true },
  { id: 'dashboard', title: '대시보드', path: '/dashboard', icon: 'BarChart2', type: 'internal', category: 'main', roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'], orderIndex: 1, isActive: true, isPublic: false },
  { id: 'courses', title: '강의', path: '/courses', icon: 'GraduationCap', type: 'internal', category: 'main', roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'], orderIndex: 2, isActive: true, isPublic: true },
  { id: 'trainers', title: '전문가 찾기', path: '/trainers', icon: 'UserRoundCheck', type: 'internal', category: 'main', roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'], orderIndex: 3, isActive: true, isPublic: true },
  { id: 'location-finder', title: '위치 찾기', path: '/locations', icon: 'MapPin', type: 'internal', category: 'main', roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'], orderIndex: 4, isActive: true, isPublic: true },
  { id: 'community', title: '커뮤니티', path: '/community', icon: 'MessageSquare', type: 'internal', category: 'main', roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'], orderIndex: 5, isActive: true, isPublic: true },
  { id: 'shop', title: '쇼핑몰', path: 'https://replit.com/join/wshpfpjewg-hnblgkjw', icon: 'ShoppingBag', type: 'external', category: 'main', roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'], orderIndex: 6, isActive: true, isPublic: true, openInNewWindow: true },

  // 학습 메뉴 (견주 전용)
  { id: 'my-courses', title: '나의 학습', path: '/my-courses', icon: 'BookOpen', type: 'internal', category: 'learning', roles: ['pet-owner', 'admin'], orderIndex: 0, isActive: true, isPublic: false },
  { id: 'my-pets', title: '반려견 관리', path: '/my-pets', icon: 'PawPrint', type: 'internal', category: 'learning', roles: ['pet-owner', 'admin'], orderIndex: 1, isActive: true, isPublic: false },
  { id: 'my-trainers', title: '내 전문가', path: '/my-trainers', icon: 'UserRoundCheck', type: 'internal', category: 'learning', roles: ['pet-owner', 'admin'], orderIndex: 2, isActive: true, isPublic: false },
  { id: 'pet-health', title: '건강 관리', path: '/pet-care/health-record', icon: 'Activity', type: 'internal', category: 'learning', roles: ['pet-owner', 'admin'], orderIndex: 3, isActive: true, isPublic: false },
  { id: 'notebook', title: '알림장', path: '/notebook', icon: 'Edit', type: 'internal', category: 'learning', roles: ['pet-owner', 'trainer', 'admin'], orderIndex: 4, isActive: true, isPublic: false },
  { id: 'schedule', title: '일정', path: '/education-schedule', icon: 'Calendar', type: 'internal', category: 'learning', roles: ['pet-owner', 'trainer', 'admin'], orderIndex: 5, isActive: true, isPublic: false },

  // 운영 관리 (훈련사/기관 - 통합)
  { id: 'students', title: '학생 관리', path: '/trainer/students', icon: 'Users', type: 'internal', category: 'management', roles: ['trainer', 'institute-admin', 'admin'], orderIndex: 0, isActive: true, isPublic: false },
  { id: 'course-mgmt', title: '강의 관리', path: '/trainer/courses', icon: 'Presentation', type: 'internal', category: 'management', roles: ['trainer', 'institute-admin', 'admin'], orderIndex: 1, isActive: true, isPublic: false },
  { id: 'earnings', title: '수익 관리', path: '/trainer/earnings', icon: 'DollarSign', type: 'internal', category: 'management', roles: ['trainer', 'institute-admin', 'admin'], orderIndex: 2, isActive: true, isPublic: false },
  { id: 'my-points', title: '포인트', path: '/trainer/my-points', icon: 'Star', type: 'internal', category: 'management', roles: ['trainer', 'institute-admin', 'admin'], orderIndex: 3, isActive: true, isPublic: false },

  // 기관 관리자 전용
  { id: 'trainer-mgmt', title: '훈련사 관리', path: '/institute/trainers', icon: 'UserCog', type: 'internal', category: 'management', roles: ['institute-admin', 'admin'], orderIndex: 4, isActive: true, isPublic: false },
  { id: 'facility-mgmt', title: '시설 관리', path: '/institute/facility', icon: 'Building', type: 'internal', category: 'management', roles: ['institute-admin', 'admin'], orderIndex: 5, isActive: true, isPublic: false },

  // 도구 (통합)
  { id: 'video-training', title: '영상 훈련', path: '/video-training', icon: 'Video', type: 'internal', category: 'tools', roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'], orderIndex: 0, isActive: true, isPublic: false },
  { id: 'video-call', title: '화상 수업', path: '/video-call', icon: 'VideoIcon', type: 'internal', category: 'tools', roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'], orderIndex: 1, isActive: true, isPublic: false },
  { id: 'ai-analysis', title: 'AI 분석', path: '/ai-analysis', icon: 'Brain', type: 'internal', category: 'tools', roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'], orderIndex: 2, isActive: true, isPublic: false },
  { id: 'messages', title: '메시지', path: '/messages', icon: 'MessageSquare', type: 'internal', category: 'tools', roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'], orderIndex: 3, isActive: true, isPublic: false },
  { id: 'alerts', title: '알림', path: '/alerts', icon: 'Bell', type: 'internal', category: 'tools', roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'], orderIndex: 4, isActive: true, isPublic: false },

  // 관리자 전용 (핵심만)
  { id: 'admin-dashboard', title: '관리자 대시보드', path: '/admin/dashboard', icon: 'BarChart3', type: 'internal', category: 'admin', roles: ['admin'], orderIndex: 0, isActive: true, isPublic: false },
  { id: 'user-mgmt', title: '사용자 관리', path: '/admin/users', icon: 'Users', type: 'internal', category: 'admin', roles: ['admin'], orderIndex: 1, isActive: true, isPublic: false },
  { id: 'institute-mgmt', title: '기관 관리', path: '/admin/institutes', icon: 'Building', type: 'internal', category: 'admin', roles: ['admin'], orderIndex: 2, isActive: true, isPublic: false },
  { id: 'content-mgmt', title: '콘텐츠 관리', path: '/admin/contents', icon: 'FileText', type: 'internal', category: 'admin', roles: ['admin'], orderIndex: 3, isActive: true, isPublic: false },
  { id: 'commission-mgmt', title: '가격 관리', path: '/admin/commissions', icon: 'Percent', type: 'internal', category: 'admin', roles: ['admin'], orderIndex: 4, isActive: true, isPublic: false },
  { id: 'system-settings', title: '시스템 설정', path: '/admin/settings', icon: 'Settings', type: 'internal', category: 'admin', roles: ['admin'], orderIndex: 5, isActive: true, isPublic: false },
];

// 간소화된 메뉴 그룹
export const DEFAULT_MENU_GROUPS: MenuGroup[] = [
  { id: 'main', title: '메인', icon: 'Home', orderIndex: 0, isActive: true, isPublic: true, roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'], isOpen: true },
  { id: 'learning', title: '학습', icon: 'BookOpen', orderIndex: 1, isActive: true, isPublic: false, roles: ['pet-owner', 'trainer', 'admin'], isOpen: false },
  { id: 'management', title: '운영', icon: 'UserCog', orderIndex: 2, isActive: true, isPublic: false, roles: ['trainer', 'institute-admin', 'admin'], isOpen: false },
  { id: 'tools', title: '도구', icon: 'Wrench', orderIndex: 3, isActive: true, isPublic: false, roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'], isOpen: false },
  { id: 'admin', title: '관리', icon: 'Shield', orderIndex: 4, isActive: true, isPublic: false, roles: ['admin'], isOpen: false },
];

export const DEFAULT_MENU_CONFIGURATION = {
  groups: DEFAULT_MENU_GROUPS,
  items: DEFAULT_MENU_ITEMS,
  lastUpdated: new Date().toISOString(),
  updatedBy: 'system'
};