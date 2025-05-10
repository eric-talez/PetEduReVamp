/**
 * auth-compat.ts
 * 
 * 역호환성을 위한 파일
 * 기존 코드에서 SimpleApp.tsx에서 import하던 useAuth 훅과 UserRole 타입을
 * 모듈화된 버전으로 대체하기 위한 호환성 레이어
 */

// 새 모듈에서 필요한 모든 항목 가져오기
import { useAuth, USER_ROLES } from '@/hooks/useAuth';
import type { AuthState, UserRole } from '@/hooks/useAuth';

// 모든 항목 재노출
export { 
  useAuth, 
  USER_ROLES,
  // 타입
  type AuthState,
  type UserRole
};

// 역호환성을 위한 UserRole enum (기존 코드에서 사용하는 경우)
export enum UserRoleEnum {
  USER = 'user',
  PET_OWNER = 'pet-owner',
  TRAINER = 'trainer',
  INSTITUTE_ADMIN = 'institute-admin',
  ADMIN = 'admin'
}