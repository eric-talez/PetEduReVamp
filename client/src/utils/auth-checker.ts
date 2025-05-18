import { UserRole } from '@shared/schema';

/**
 * 역할별 권한 접근 검증 유틸리티
 * 
 * 각 사용자 역할이 특정 리소스에 접근할 수 있는지 검증합니다.
 * 역할 계층 구조:
 * - admin: 최고 관리자 (모든 접근 권한)
 * - institute-admin: 기관 관리자
 * - trainer: 훈련사
 * - pet-owner: 반려인 (일반 사용자)
 * - user: 미등록 사용자 (최소 권한)
 */

// 역할별 계층 구조 (상위 역할은 하위 역할의 모든 권한을 포함)
const roleHierarchy: Record<UserRole, number> = {
  'admin': 100,
  'institute-admin': 80,
  'trainer': 60,
  'pet-owner': 40,
  'user': 20
};

// 특정 기능에 필요한 최소 권한 레벨
export const minimumRoleForFeature: Record<string, UserRole> = {
  // 대시보드 기능
  'view-admin-dashboard': 'admin',
  'view-institute-dashboard': 'institute-admin',
  'view-trainer-dashboard': 'trainer',
  'view-pet-owner-dashboard': 'pet-owner',
  
  // 정산 관련 기능
  'manage-settlements': 'admin',
  'view-settlements': 'trainer',
  
  // 콘텐츠 관리 기능
  'manage-courses': 'trainer',
  'edit-all-courses': 'admin',
  
  // 커뮤니티 기능
  'create-community-post': 'user',
  'delete-any-post': 'admin',
  'pin-post': 'admin',
  
  // 계정/사용자 관리
  'manage-all-users': 'admin',
  'verify-trainers': 'admin',
  'manage-institute': 'institute-admin',
  
  // AI 분석 기능
  'view-ai-analysis': 'pet-owner',
  'use-advanced-ai': 'trainer'
};

/**
 * 사용자가 특정 기능에 접근할 수 있는지 확인합니다.
 * @param userRole 사용자 역할
 * @param feature 접근하려는 기능 ID
 * @returns 접근 가능 여부
 */
export function hasAccess(userRole: UserRole | null, feature: string): boolean {
  if (!userRole) return false;
  
  const requiredRole = minimumRoleForFeature[feature];
  if (!requiredRole) return false; // 정의되지 않은 기능은 접근 불가
  
  const userRoleLevel = roleHierarchy[userRole];
  const requiredRoleLevel = roleHierarchy[requiredRole];
  
  return userRoleLevel >= requiredRoleLevel;
}

/**
 * 사용자가 특정 역할 목록 중 하나라도 가지고 있는지 확인합니다.
 * @param userRole 사용자 역할
 * @param allowedRoles 허용되는 역할 목록
 * @returns 접근 가능 여부
 */
export function hasRole(userRole: UserRole | null, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  if (allowedRoles.includes(userRole)) return true;
  if (userRole === 'admin') return true; // 관리자는 항상 모든 접근 권한이 있음
  return false;
}

/**
 * 특정 메뉴 항목을 사용자에게 표시해야 하는지 결정합니다.
 * @param userRole 사용자 역할
 * @param menuRoles 메뉴 항목을 볼 수 있는 역할 배열
 * @param isPublic 공개 메뉴 여부 (비로그인도 접근 가능)
 * @returns 메뉴 표시 여부
 */
export function shouldShowMenuItem(
  userRole: UserRole | null, 
  menuRoles: UserRole[], 
  isPublic: boolean = false
): boolean {
  // 공개 메뉴는 항상 표시
  if (isPublic) return true;
  
  // 로그인하지 않은 경우 비공개 메뉴는 표시하지 않음
  if (!userRole) return false;
  
  // 관리자는 모든 메뉴에 접근 가능
  if (userRole === 'admin') return true;
  
  // 사용자 역할이 메뉴 역할에 포함되는지 확인
  return menuRoles.includes(userRole);
}

// 디버깅용 함수
export function printUserPermissions(userRole: UserRole): Record<string, boolean> {
  const permissions: Record<string, boolean> = {};
  
  Object.keys(minimumRoleForFeature).forEach(feature => {
    permissions[feature] = hasAccess(userRole, feature);
  });
  
  return permissions;
}