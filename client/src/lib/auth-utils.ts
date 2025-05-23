/**
 * 사용자 권한 관리 및 접근 제어를 위한 유틸리티 함수
 */

import { toast } from '@/hooks/use-toast';

// 사용자 역할 타입 정의
export type UserRole = 'user' | 'pet-owner' | 'trainer' | 'institute-admin' | 'admin';

// 각 역할별 권한 레벨 (숫자가 클수록 더 높은 권한)
export const ROLE_LEVELS: Record<UserRole, number> = {
  'user': 1,
  'pet-owner': 2,
  'trainer': 3,
  'institute-admin': 4,
  'admin': 5
};

/**
 * 사용자의 역할이 필요한 권한 수준에 도달하는지 확인
 * @param userRole 사용자 역할
 * @param requiredRole 필요한 역할
 * @returns 권한이 충분한지 여부
 */
export function hasRequiredRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole];
}

/**
 * 권한이 불충분할 때 알림 표시 및 리디렉션
 * @param isAuthenticated 로그인 상태
 * @param userRole 사용자 역할
 * @param requiredRole 필요한 역할
 * @param redirectPath 리디렉션할 경로
 * @returns 권한이 충분한지 여부
 */
export function checkAndHandlePermission(
  isAuthenticated: boolean,
  userRole: UserRole | undefined,
  requiredRole: UserRole,
  redirectPath: string = '/auth',
  featureName?: string
): boolean {
  // 기능 이름이 제공되었는지 확인
  const feature = featureName ? `'${featureName}'` : '이 기능';
  
  if (!isAuthenticated) {
    // 로그인 되지 않은 경우 - 좀 더 구체적인 메시지
    toast({
      title: "로그인 필요",
      description: `${feature}을(를) 사용하려면 로그인이 필요합니다. 로그인 페이지로 이동합니다.`,
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = redirectPath;
    }, 2000); // 메시지를 읽을 시간 제공
    return false;
  }
  
  // 사용자 친화적인 역할 이름 매핑
  const roleNames: Record<UserRole, string> = {
    'user': '일반 사용자',
    'pet-owner': '반려인',
    'trainer': '훈련사',
    'institute-admin': '기관 관리자',
    'admin': '시스템 관리자'
  };
  
  if (!hasRequiredRole(userRole, requiredRole)) {
    // 권한이 불충분한 경우 - 구체적인 권한 정보와 안내
    const currentRoleName = userRole ? roleNames[userRole] : '알 수 없음';
    const requiredRoleName = roleNames[requiredRole];
    
    toast({
      title: "권한 부족",
      description: `${feature}은(는) '${requiredRoleName}' 이상의 권한이 필요합니다. 현재 '${currentRoleName}' 권한으로 로그인되어 있습니다.`,
      variant: "destructive",
    });
    
    // 역할에 따른 가이드 제공
    if (requiredRole === 'trainer' && userRole === 'pet-owner') {
      // 반려인이 훈련사 권한 필요 시, 훈련사 신청 안내
      setTimeout(() => {
        toast({
          title: "안내",
          description: "훈련사로 등록하시려면 '마이페이지 > 훈련사 신청'을 이용해 주세요.",
          variant: "default",
        });
      }, 2000);
    } else if (requiredRole === 'institute-admin') {
      // 기관 관리자 권한 필요 시, 기관 신청 안내
      setTimeout(() => {
        toast({
          title: "안내",
          description: "교육 기관으로 등록하시려면 '기관 > 기관 등록'을 이용해 주세요.",
          variant: "default",
        });
      }, 2000);
    }
    
    setTimeout(() => {
      window.location.href = '/';
    }, 3500); // 추가 안내 메시지를 읽을 시간까지 고려
    
    return false;
  }
  
  return true;
}

/**
 * 로컬 스토리지에서 인증 상태를 가져옴
 * @returns 인증 상태 및 사용자 정보
 */
export function getAuthFromLocalStorage(): { 
  isAuthenticated: boolean; 
  userRole?: UserRole;
  userName?: string;
} {
  try {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userData = localStorage.getItem('userData');
    
    if (isAuthenticated && userData) {
      const parsed = JSON.parse(userData);
      return {
        isAuthenticated: true,
        userRole: parsed.role as UserRole,
        userName: parsed.name
      };
    }
    
    return { isAuthenticated: false };
  } catch (error) {
    console.error('로컬 스토리지 인증 정보 파싱 오류:', error);
    return { isAuthenticated: false };
  }
}

/**
 * API 요청에 인증 헤더 추가
 * @param headers 헤더 객체
 * @returns 인증 정보가 추가된 헤더 객체
 */
export function addAuthHeaders(headers: HeadersInit = {}): HeadersInit {
  const authData = getAuthFromLocalStorage();
  const newHeaders = { ...headers };
  
  if (authData.isAuthenticated) {
    // 실제 토큰 방식 인증의 경우 여기에 토큰을 추가
    // 예: newHeaders['Authorization'] = `Bearer ${localStorage.getItem('auth_token')}`;
    newHeaders['x-user-role'] = authData.userRole || '';
  }
  
  return newHeaders;
}

/**
 * 보안 API 요청 - 인증 헤더 자동 추가
 * @param url API 엔드포인트
 * @param options 요청 옵션
 * @returns fetch 응답
 */
export async function secureApiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = addAuthHeaders(options.headers);
  return fetch(url, { ...options, headers });
}