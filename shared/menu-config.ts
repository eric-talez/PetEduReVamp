import { UserRole } from './schema';

// 메뉴 유형 정의
export type MenuType = 'internal' | 'external'; // 내부 링크 또는 외부 링크
export type MenuCategory = 'main' | 'features' | 'myLearning' | 'trainer' | 'institute' | 'admin' | 'shopping';

// 메뉴 아이템 인터페이스
export interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon: string; // 아이콘 이름 (Lucide 아이콘 등에서 사용)
  type: MenuType;
  category: MenuCategory;
  roles: UserRole[]; // 이 메뉴에 접근할 수 있는 역할 목록
  orderIndex: number; // 정렬 순서
  isActive: boolean; // 메뉴 활성화 여부
  isPublic: boolean; // 비로그인 사용자에게도 보이는지 여부
  openInNewWindow?: boolean; // 새 창에서 열기 여부
  instituteId?: number | null; // 특정 기관에만 표시되는 메뉴인 경우 해당 기관 ID
}

// 메뉴 그룹 정의
export interface MenuGroup {
  id: MenuCategory;
  title: string;
  icon: string;
  orderIndex: number;
  isActive: boolean;
  isPublic: boolean; // 비로그인 사용자에게도 보이는지 여부
  roles: UserRole[]; // 이 그룹에 접근할 수 있는 역할 목록
  isOpen: boolean; // 사이드바에서 확장 여부 (기본값)
  instituteId?: number | null; // 특정 기관에만 표시되는 메뉴인 경우 해당 기관 ID
}

// 전체 메뉴 구성 정의
export interface MenuConfiguration {
  groups: MenuGroup[];
  items: MenuItem[];
  lastUpdated: string; // ISO 문자열 형식의 마지막 업데이트 시간
  updatedBy: string; // 마지막으로 업데이트한 관리자 ID
}

// 기본 메뉴 아이템
export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'home',
    title: '홈',
    path: '/',
    icon: 'Home',
    type: 'internal',
    category: 'main',
    roles: ['user', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 0,
    isActive: true,
    isPublic: true
  },
  {
    id: 'courses',
    title: '강의 탐색',
    path: '/courses',
    icon: 'GraduationCap',
    type: 'internal',
    category: 'main',
    roles: ['user', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 1,
    isActive: true,
    isPublic: true
  },
  {
    id: 'trainers',
    title: '훈련사 찾기',
    path: '/trainers',
    icon: 'UserRoundCheck',
    type: 'internal',
    category: 'main',
    roles: ['user', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 2,
    isActive: true,
    isPublic: true
  },
  {
    id: 'locations',
    title: '위치 서비스',
    path: '/locations',
    icon: 'MapPin',
    type: 'internal',
    category: 'main',
    roles: ['user', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 3,
    isActive: true,
    isPublic: true
  },
  {
    id: 'community',
    title: '커뮤니티',
    path: '/community',
    icon: 'MessageSquare',
    type: 'internal',
    category: 'main',
    roles: ['user', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 4,
    isActive: true,
    isPublic: true
  },
  {
    id: 'events',
    title: '이벤트',
    path: '/events',
    icon: 'Calendar',
    type: 'internal',
    category: 'main',
    roles: ['user', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 5,
    isActive: true,
    isPublic: true
  },
  {
    id: 'video-training',
    title: '영상 훈련',
    path: '/video-training',
    icon: 'Video',
    type: 'internal',
    category: 'main',
    roles: ['user', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 6,
    isActive: true,
    isPublic: true
  },
  {
    id: 'video-call',
    title: '화상 훈련',
    path: '/video-call',
    icon: 'VideoIcon',
    type: 'internal',
    category: 'main',
    roles: ['user', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 7,
    isActive: true,
    isPublic: true
  },
  {
    id: 'ai-analysis',
    title: 'AI 분석',
    path: '/ai-analysis',
    icon: 'Sparkles',
    type: 'internal',
    category: 'main',
    roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 8,
    isActive: true,
    isPublic: false
  },
  {
    id: 'ai-chatbot',
    title: 'AI 챗봇',
    path: '/ai-chatbot',
    icon: 'Sparkles',
    type: 'internal',
    category: 'main',
    roles: ['user', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 9,
    isActive: true,
    isPublic: true
  },
  {
    id: 'messages',
    title: '메시지',
    path: '/messages',
    icon: 'MessageSquare',
    type: 'internal',
    category: 'features',
    roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 0,
    isActive: true,
    isPublic: false
  },
  {
    id: 'alerts',
    title: '알림',
    path: '/alerts',
    icon: 'Bell',
    type: 'internal',
    category: 'features',
    roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 1,
    isActive: true,
    isPublic: false
  },
  {
    id: 'shopping',
    title: '쇼핑몰',
    path: 'https://replit.com/join/wshpfpjewg-hnblgkjw',
    icon: 'ShoppingBag',
    type: 'external',
    category: 'shopping',
    roles: ['user', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 0,
    isActive: true,
    isPublic: true,
    openInNewWindow: true
  },
  {
    id: 'dashboard',
    title: '대시보드',
    path: '/dashboard',
    icon: 'BarChart2',
    type: 'internal',
    category: 'myLearning',
    roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 0,
    isActive: true,
    isPublic: false
  },
  {
    id: 'my-courses',
    title: '내 강의',
    path: '/my-courses',
    icon: 'BookOpen',
    type: 'internal',
    category: 'myLearning',
    roles: ['pet-owner', 'admin'],
    orderIndex: 1,
    isActive: true,
    isPublic: false
  },
  {
    id: 'my-trainers',
    title: '담당 훈련사',
    path: '/my-trainers',
    icon: 'UserRoundCheck',
    type: 'internal',
    category: 'myLearning',
    roles: ['pet-owner', 'admin'],
    orderIndex: 2,
    isActive: true,
    isPublic: false
  },
  {
    id: 'my-pets',
    title: '내 반려견',
    path: '/my-pets',
    icon: 'PawPrint',
    type: 'internal',
    category: 'myLearning',
    roles: ['pet-owner', 'admin'],
    orderIndex: 3,
    isActive: true,
    isPublic: false
  },
  {
    id: 'pet-health',
    title: '반려견 건강관리',
    path: '/pet-care/health-record',
    icon: 'Activity',
    type: 'internal',
    category: 'myLearning',
    roles: ['pet-owner', 'admin'],
    orderIndex: 4,
    isActive: true,
    isPublic: false
  },
  {
    id: 'notebook',
    title: '알림장',
    path: '/notebook',
    icon: 'Edit',
    type: 'internal',
    category: 'myLearning',
    roles: ['pet-owner', 'trainer', 'admin'],
    orderIndex: 4,
    isActive: true,
    isPublic: false
  },
  {
    id: 'education-schedule',
    title: '교육 일정',
    path: '/education-schedule',
    icon: 'Calendar',
    type: 'internal',
    category: 'myLearning',
    roles: ['pet-owner', 'trainer', 'admin'],
    orderIndex: 5,
    isActive: true,
    isPublic: false
  },

  {
    id: 'analytics',
    title: '분석 및 보고서',
    path: '/analytics',
    icon: 'BarChart3',
    type: 'internal',
    category: 'myLearning',
    roles: ['pet-owner', 'trainer', 'admin'],
    orderIndex: 7,
    isActive: true,
    isPublic: false
  },

  {
    id: 'subscriptions',
    title: '구독 관리',
    path: '/subscriptions',
    icon: 'CreditCard',
    type: 'internal',
    category: 'myLearning',
    roles: ['user', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 7,
    isActive: true,
    isPublic: false
  },
  {
    id: 'trainer-dashboard',
    title: '훈련사 대시보드',
    path: '/trainer/dashboard',
    icon: 'BarChart2',
    type: 'internal',
    category: 'trainer',
    roles: ['trainer', 'admin'],
    orderIndex: 0,
    isActive: true,
    isPublic: false
  },
  {
    id: 'my-students',
    title: '수강생 관리',
    path: '/trainer/students',
    icon: 'Users',
    type: 'internal',
    category: 'trainer',
    roles: ['trainer', 'admin'],
    orderIndex: 1,
    isActive: true,
    isPublic: false
  },
  {
    id: 'create-course',
    title: '강의 관리',
    path: '/trainer/courses',
    icon: 'Presentation',
    type: 'internal',
    category: 'trainer',
    roles: ['trainer', 'admin'],
    orderIndex: 2,
    isActive: true,
    isPublic: false
  },
  {
    id: 'class-schedule',
    title: '수업 일정',
    path: '/trainer/classes',
    icon: 'Calendar',
    type: 'internal',
    category: 'trainer',
    roles: ['trainer', 'admin'],
    orderIndex: 3,
    isActive: true,
    isPublic: false
  },
  {
    id: 'create-notebook',
    title: '알림장 관리',
    path: '/trainer/notebook',
    icon: 'Edit',
    type: 'internal',
    category: 'trainer',
    roles: ['trainer', 'admin'],
    orderIndex: 4,
    isActive: true,
    isPublic: false
  },
  {
    id: 'income-stats',
    title: '수익 통계',
    path: '/trainer/earnings',
    icon: 'LineChart',
    type: 'internal',
    category: 'trainer',
    roles: ['trainer', 'admin'],
    orderIndex: 5,
    isActive: true,
    isPublic: false
  },
  {
    id: 'reviews-management',
    title: '리뷰 관리',
    path: '/trainer/reviews',
    icon: 'Star',
    type: 'internal',
    category: 'trainer',
    roles: ['trainer', 'admin'],
    orderIndex: 6,
    isActive: true,
    isPublic: false
  },
  {
    id: 'institute-dashboard',
    title: '기관 대시보드',
    path: '/institute/dashboard',
    icon: 'BarChart2',
    type: 'internal',
    category: 'institute',
    roles: ['institute-admin', 'admin'],
    orderIndex: 0,
    isActive: true,
    isPublic: false
  },
  {
    id: 'manage-trainers',
    title: '훈련사 관리',
    path: '/institute/trainers',
    icon: 'UserCog',
    type: 'internal',
    category: 'institute',
    roles: ['institute-admin', 'admin'],
    orderIndex: 1,
    isActive: true,
    isPublic: false
  },
  {
    id: 'institute-courses',
    title: '강의 관리',
    path: '/institute/courses',
    icon: 'BookOpen',
    type: 'internal',
    category: 'institute',
    roles: ['institute-admin', 'admin'],
    orderIndex: 2,
    isActive: true,
    isPublic: false
  },
  {
    id: 'institute-students',
    title: '회원 관리',
    path: '/institute/students',
    icon: 'Users',
    type: 'internal',
    category: 'institute',
    roles: ['institute-admin', 'admin'],
    orderIndex: 3,
    isActive: true,
    isPublic: false
  },
  {
    id: 'institute-facility',
    title: '시설 관리',
    path: '/institute/facility',
    icon: 'Calendar',
    type: 'internal',
    category: 'institute',
    roles: ['institute-admin', 'admin'],
    orderIndex: 4,
    isActive: true,
    isPublic: false
  },
  {
    id: 'institute-stats',
    title: '매출 관리',
    path: '/institute/stats',
    icon: 'TrendingUp',
    type: 'internal',
    category: 'institute',
    roles: ['institute-admin', 'admin'],
    orderIndex: 5,
    isActive: true,
    isPublic: false
  },
  {
    id: 'admin-dashboard',
    title: '관리자 대시보드',
    path: '/admin/dashboard',
    icon: 'BarChart2',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 0,
    isActive: true,
    isPublic: false
  },
  {
    id: 'manage-users',
    title: '사용자 관리',
    path: '/admin/users',
    icon: 'Users',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 1,
    isActive: true,
    isPublic: false
  },
  {
    id: 'manage-institutes',
    title: '기관 관리',
    path: '/admin/institutes',
    icon: 'Building',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 2,
    isActive: true,
    isPublic: false
  },
  {
    id: 'system-settings',
    title: '시스템 설정',
    path: '/admin/settings',
    icon: 'Cog',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 3,
    isActive: true,
    isPublic: false
  },
  {
    id: 'commission-settings',
    title: '수수료 관리',
    path: '/admin/commissions',
    icon: 'Percent',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 4,
    isActive: true,
    isPublic: false
  },
  {
    id: 'shop-management',
    title: '쇼핑몰 관리',
    path: '/admin/shop',
    icon: 'ShoppingBag',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 5,
    isActive: true,
    isPublic: false
  },
  {
    id: 'menu-management',
    title: '메뉴 관리',
    path: '/admin/menu-management',
    icon: 'Menu',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 6,
    isActive: true,
    isPublic: false
  },
  {
    id: 'banner-management',
    title: '배너 관리',
    path: '/admin/banner-management',
    icon: 'Image',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 7,
    isActive: true,
    isPublic: false
  },
  {
    id: 'invite-management',
    title: '초대장 관리',
    path: '/admin/invite-management',
    icon: 'UserPlus',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 8,
    isActive: true,
    isPublic: false
  },
  {
    id: 'course-management',
    title: '강좌 관리',
    path: '/admin/courses',
    icon: 'BookOpen',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 7,
    isActive: true,
    isPublic: false
  },
  {
    id: 'trainer-management',
    title: '훈련사 관리',
    path: '/admin/trainers',
    icon: 'UserRoundCheck',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 8,
    isActive: true,
    isPublic: false
  },
  {
    id: 'content-management',
    title: '콘텐츠 관리',
    path: '/admin/contents',
    icon: 'Image',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 9,
    isActive: true,
    isPublic: false
  }
];

// 기본 메뉴 그룹
export const DEFAULT_MENU_GROUPS: MenuGroup[] = [
  {
    id: 'main',
    title: '메인 메뉴',
    icon: 'Home',
    orderIndex: 0,
    isActive: true,
    isPublic: true,
    roles: ['user', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    isOpen: false
  },
  {
    id: 'features',
    title: '특별 기능',
    icon: 'Gift',
    orderIndex: 1,
    isActive: true,
    isPublic: false,
    roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'],
    isOpen: false
  },
  {
    id: 'shopping',
    title: '쇼핑',
    icon: 'ShoppingBag',
    orderIndex: 2,
    isActive: true,
    isPublic: true,
    roles: ['user', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    isOpen: false
  },
  {
    id: 'myLearning',
    title: '나의 학습',
    icon: 'BookOpen',
    orderIndex: 3,
    isActive: true,
    isPublic: false,
    roles: ['pet-owner', 'trainer', 'admin'],
    isOpen: false
  },
  {
    id: 'trainer',
    title: '훈련사 메뉴',
    icon: 'UserRoundCheck',
    orderIndex: 4,
    isActive: true,
    isPublic: false,
    roles: ['trainer', 'admin'],
    isOpen: false
  },
  {
    id: 'institute',
    title: '기관 관리',
    icon: 'Building',
    orderIndex: 5,
    isActive: true,
    isPublic: false,
    roles: ['institute-admin', 'admin'],
    isOpen: false
  },
  {
    id: 'admin',
    title: '관리자 메뉴',
    icon: 'Shield',
    orderIndex: 6,
    isActive: true,
    isPublic: false,
    roles: ['admin'],
    isOpen: false
  }
];

// 기본 메뉴 설정 생성
export const DEFAULT_MENU_CONFIGURATION: MenuConfiguration = {
  groups: DEFAULT_MENU_GROUPS,
  items: DEFAULT_MENU_ITEMS,
  lastUpdated: new Date().toISOString(),
  updatedBy: 'system'
};