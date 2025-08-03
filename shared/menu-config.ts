import { UserRole } from './schema';

// 메뉴 유형 정의
export type MenuType = 'internal' | 'external';
export type MenuCategory = 'main' | 'learning' | 'management' | 'tools' | 'admin';

// 메뉴 아이템 인터페이스
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
  instituteId?: number | null;
}

// 메뉴 그룹 정의
export interface MenuGroup {
  id: MenuCategory;
  title: string;
  icon: string;
  orderIndex: number;
  isActive: boolean;
  isPublic: boolean;
  roles: UserRole[];
  isOpen: boolean;
  instituteId?: number | null;
}

// 전체 메뉴 구성 정의
export interface MenuConfiguration {
  groups: MenuGroup[];
  items: MenuItem[];
  lastUpdated: string;
  updatedBy: string;
}

// 간소화된 메뉴 아이템
export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  // === 메인 메뉴 (모든 사용자) ===
  {
    id: 'home',
    title: '홈',
    path: '/',
    icon: 'Home',
    type: 'internal',
    category: 'main',
    roles: ['pet-owner', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 0,
    isActive: true,
    isPublic: true
  },
  {
    id: 'dashboard',
    title: '대시보드',
    path: '/dashboard',
    icon: 'BarChart2',
    type: 'internal',
    category: 'main',
    roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 1,
    isActive: true,
    isPublic: false
  },
  {
    id: 'courses',
    title: '강의 찾기',
    path: '/courses',
    icon: 'GraduationCap',
    type: 'internal',
    category: 'main',
    roles: ['pet-owner', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 2,
    isActive: true,
    isPublic: true
  },
  {
    id: 'location-finder',
    title: '위치 찾기',
    path: '/location-finder',
    icon: 'MapPin',
    type: 'internal',
    category: 'main',
    roles: ['pet-owner', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 3,
    isActive: true,
    isPublic: true
  },
  {
    id: 'trainers',
    title: '전문가 찾기',
    path: '/trainers',
    icon: 'UserRoundCheck',
    type: 'internal',
    category: 'main',
    roles: ['pet-owner', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
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
    roles: ['pet-owner', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 4,
    isActive: true,
    isPublic: true
  },
  {
    id: 'shop',
    title: '쇼핑몰',
    path: 'https://replit.com/join/wshpfpjewg-hnblgkjw',
    icon: 'ShoppingBag',
    type: 'external',
    category: 'main',
    roles: ['pet-owner', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 5,
    isActive: true,
    isPublic: true,
    openInNewWindow: true
  },

  // === 학습 관리 (견주/훈련사) ===
  {
    id: 'my-learning',
    title: '수강 중인 강의',
    path: '/my-courses',
    icon: 'BookOpen',
    type: 'internal',
    category: 'learning',
    roles: ['pet-owner', 'admin'],
    orderIndex: 0,
    isActive: true,
    isPublic: false
  },
  {
    id: 'my-pets',
    title: '우리 아이 프로필',
    path: '/my-pets',
    icon: 'PawPrint',
    type: 'internal',
    category: 'learning',
    roles: ['pet-owner', 'admin'],
    orderIndex: 1,
    isActive: true,
    isPublic: false
  },
  {
    id: 'my-trainers',
    title: '담당 전문가',
    path: '/my-trainers',
    icon: 'UserRoundCheck',
    type: 'internal',
    category: 'learning',
    roles: ['pet-owner', 'admin'],
    orderIndex: 2,
    isActive: true,
    isPublic: false
  },
  {
    id: 'pet-health',
    title: '건강 관리',
    path: '/pet-care/health-record',
    icon: 'Activity',
    type: 'internal',
    category: 'learning',
    roles: ['pet-owner', 'trainer', 'admin'],
    orderIndex: 3,
    isActive: true,
    isPublic: false
  },
  {
    id: 'notebook',
    title: '알림장',
    path: '/notebook',
    icon: 'Edit',
    type: 'internal',
    category: 'learning',
    roles: ['pet-owner', 'trainer', 'admin'],
    orderIndex: 4,
    isActive: true,
    isPublic: false
  },
  {
    id: 'schedule',
    title: '일정 관리',
    path: '/education-schedule',
    icon: 'Calendar',
    type: 'internal',
    category: 'learning',
    roles: ['pet-owner', 'trainer', 'admin'],
    orderIndex: 5,
    isActive: true,
    isPublic: false
  },
  {
    id: 'consultation-status',
    title: '내 상담 현황',
    path: '/consultation',
    icon: 'MessageSquare',
    type: 'internal',
    category: 'learning',
    roles: ['pet-owner', 'trainer', 'admin'],
    orderIndex: 6,
    isActive: true,
    isPublic: false
  },
  {
    id: 'my-consultation-requests',
    title: '상담 신청 내역',
    path: '/consultation/requests',
    icon: 'Calendar',
    type: 'internal',
    category: 'learning',
    roles: ['pet-owner'],
    orderIndex: 7,
    isActive: true,
    isPublic: false
  },

  // === 운영 관리 (훈련사/기관) ===
  {
    id: 'student-management',
    title: '수강생 관리',
    path: '/trainer/students',
    icon: 'Users',
    type: 'internal',
    category: 'management',
    roles: ['trainer', 'institute-admin', 'admin'],
    orderIndex: 0,
    isActive: true,
    isPublic: false
  },
  {
    id: 'course-management',
    title: '내 강의 관리',
    path: '/trainer/courses',
    icon: 'Presentation',
    type: 'internal',
    category: 'management',
    roles: ['trainer', 'institute-admin', 'admin'],
    orderIndex: 1,
    isActive: true,
    isPublic: false
  },
  {
    id: 'class-schedule',
    title: '수업 스케줄',
    path: '/trainer/classes',
    icon: 'Calendar',
    type: 'internal',
    category: 'management',
    roles: ['trainer', 'institute-admin', 'admin'],
    orderIndex: 2,
    isActive: true,
    isPublic: false
  },
  {
    id: 'financial-management',
    title: '정산 관리',
    path: '/trainer/earnings',
    icon: 'DollarSign',
    type: 'internal',
    category: 'management',
    roles: ['trainer', 'institute-admin', 'admin'],
    orderIndex: 3,
    isActive: true,
    isPublic: false
  },
  {
    id: 'trainer-management',
    title: '훈련사 관리',
    path: '/institute/trainers',
    icon: 'UserCog',
    type: 'internal',
    category: 'management',
    roles: ['institute-admin', 'admin'],
    orderIndex: 4,
    isActive: true,
    isPublic: false
  },
  {
    id: 'facility-management',
    title: '시설 관리',
    path: '/institute/facility',
    icon: 'Building',
    type: 'internal',
    category: 'management',
    roles: ['institute-admin', 'admin'],
    orderIndex: 5,
    isActive: true,
    isPublic: false
  },
  {
    id: 'trainer-my-points',
    title: '내 포인트',
    path: '/trainer/my-points',
    icon: 'Star',
    type: 'internal',
    category: 'management',
    roles: ['trainer'],
    orderIndex: 6,
    isActive: true,
    isPublic: false
  },
  {
    id: 'institute-my-points',
    title: '내 포인트',
    path: '/institute/my-points',
    icon: 'Star',
    type: 'internal',
    category: 'management',
    roles: ['institute-admin'],
    orderIndex: 7,
    isActive: true,
    isPublic: false
  },

  // === 도구 및 기능 ===
  {
    id: 'video-training',
    title: '동영상 교육',
    path: '/video-training',
    icon: 'Video',
    type: 'internal',
    category: 'tools',
    roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 0,
    isActive: true,
    isPublic: false
  },
  {
    id: 'video-call',
    title: '화상 상담',
    path: '/video-call',
    icon: 'VideoIcon',
    type: 'internal',
    category: 'tools',
    roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 1,
    isActive: true,
    isPublic: false
  },
  {
    id: 'ai-assistant',
    title: 'AI 행동 분석',
    path: '/ai-analysis',
    icon: 'Sparkles',
    type: 'internal',
    category: 'tools',
    roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 2,
    isActive: true,
    isPublic: false
  },
  {
    id: 'messaging',
    title: '대화하기',
    path: '/messages',
    icon: 'MessageSquare',
    type: 'internal',
    category: 'tools',
    roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 3,
    isActive: true,
    isPublic: false
  },
  {
    id: 'notifications',
    title: '알림센터',
    path: '/alerts',
    icon: 'Bell',
    type: 'internal',
    category: 'tools',
    roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 4,
    isActive: true,
    isPublic: false
  },
  {
    id: 'analytics',
    title: '분석 리포트',
    path: '/analytics',
    icon: 'BarChart3',
    type: 'internal',
    category: 'tools',
    roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'],
    orderIndex: 5,
    isActive: true,
    isPublic: false
  },

  // === 관리자 전용 (사용 빈도 순) ===
  {
    id: 'admin-dashboard',
    title: '관리자 대시보드',
    path: '/admin/dashboard',
    icon: 'BarChart3',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 0,
    isActive: true,
    isPublic: false
  },
  {
    id: 'system-management',
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
    id: 'institute-management',
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
    id: 'trainer-management',
    title: '훈련사 관리',
    path: '/admin/trainers',
    icon: 'UserCheck',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 3,
    isActive: true,
    isPublic: false
  },
  {
    id: 'trainer-activity-logs',
    title: '훈련사 활동 로그',
    path: '/admin/trainer-activity-logs',
    icon: 'Activity',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 4,
    isActive: true,
    isPublic: false
  },
  {
    id: 'point-management',
    title: '포인트 관리',
    path: '/admin/point-management',
    icon: 'Award',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 5,
    isActive: true,
    isPublic: false
  },
  {
    id: 'content-management',
    title: '콘텐츠 관리',
    path: '/admin/contents',
    icon: 'FileText',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 5,
    isActive: true,
    isPublic: false
  },
  {
    id: 'financial-admin',
    title: '수수료 관리',
    path: '/admin/commissions',
    icon: 'Percent',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 5,
    isActive: true,
    isPublic: false
  },
  {
    id: 'shop-admin',
    title: '쇼핑몰 관리',
    path: '/admin/shop',
    icon: 'ShoppingBag',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 6,
    isActive: true,
    isPublic: false
  },
  {
    id: 'service-monitoring',
    title: '서비스 모니터링',
    path: '/admin/review-management',
    icon: 'Monitor',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 7,
    isActive: true,
    isPublic: false
  },
  {
    id: 'event-management',
    title: '이벤트 관리',
    path: '/admin/event-management',
    icon: 'Calendar',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 8,
    isActive: true,
    isPublic: false
  },
  {
    id: 'point-management',
    title: '포인트 관리',
    path: '/admin/point-management',
    icon: 'Star',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 9,
    isActive: true,
    isPublic: false
  },
  {
    id: 'trainer-activity-logs',
    title: '훈련사 활동 로그',
    path: '/admin/trainer-activity-logs',
    icon: 'Activity',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 10,
    isActive: true,
    isPublic: false
  },
  {
    id: 'payment-management',
    title: '결제연동 관리',
    path: '/admin/payment',
    icon: 'CreditCard',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 11,
    isActive: true,
    isPublic: false
  },
  {
    id: 'ai-error-autofix',
    title: 'AI 에러 자동수정',
    path: '/admin/ai-error-autofix',
    icon: 'Sparkles',
    type: 'internal',
    category: 'admin',
    roles: ['admin'],
    orderIndex: 12,
    isActive: true,
    isPublic: false
  }
];

// 간소화된 메뉴 그룹
export const DEFAULT_MENU_GROUPS: MenuGroup[] = [
  {
    id: 'main',
    title: '메인',
    icon: 'Home',
    orderIndex: 0,
    isActive: true,
    isPublic: true,
    roles: ['pet-owner', 'pet-owner', 'trainer', 'institute-admin', 'admin'],
    isOpen: true
  },
  {
    id: 'learning',
    title: '학습',
    icon: 'BookOpen',
    orderIndex: 1,
    isActive: true,
    isPublic: false,
    roles: ['pet-owner', 'trainer', 'admin'],
    isOpen: false
  },
  {
    id: 'management',
    title: '운영 관리',
    icon: 'UserCog',
    orderIndex: 2,
    isActive: true,
    isPublic: false,
    roles: ['trainer', 'institute-admin', 'admin'],
    isOpen: false
  },
  {
    id: 'tools',
    title: '도구',
    icon: 'Wrench',
    orderIndex: 3,
    isActive: true,
    isPublic: false,
    roles: ['pet-owner', 'trainer', 'institute-admin', 'admin'],
    isOpen: false
  },
  {
    id: 'admin',
    title: '시스템 관리',
    icon: 'Shield',
    orderIndex: 4,
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