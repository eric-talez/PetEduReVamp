/**
 * auth-compat.ts
 * 
 * 역호환성을 위한 파일
 * 기존 코드에서 SimpleApp.tsx에서 import하던 useAuth 훅과 UserRole 타입을
 * 모듈화된 버전으로 대체하기 위한 호환성 레이어
 */

// 전역 인증 상태 관리 기능 사용
import { useGlobalAuth, initGlobalAuthListener } from '@/hooks/useGlobalAuth';
import type { AuthState } from '@/lib/global-auth-store';
import type { UserRole } from '../../../shared/schema';
import { useToast } from '@/hooks/use-toast';
import { authStore } from '@/lib/global-auth-store';

// 초기화 함수 호출
initGlobalAuthListener();

// 역호환성을 위한 상수
export const USER_ROLES = {
  USER: 'user' as UserRole,
  PET_OWNER: 'pet-owner' as UserRole,
  TRAINER: 'trainer' as UserRole,
  INSTITUTE_ADMIN: 'institute-admin' as UserRole,
  ADMIN: 'admin' as UserRole
};

// 확장된 useAuth 훅 정의
export function useAuth() {
  // 글로벌 인증 훅 사용 (이미 모든 필요한 함수 포함)
  const auth = useGlobalAuth();

  // 기존 컴포넌트와의 호환성을 위해 그대로 반환
  return auth;
}

// 타입도 노출
export { type AuthState, type UserRole };

// 역호환성을 위한 UserRole enum (기존 코드에서 사용하는 경우)
export enum UserRoleEnum {
  USER = 'user',
  PET_OWNER = 'pet-owner',
  TRAINER = 'trainer',
  INSTITUTE_ADMIN = 'institute-admin',
  ADMIN = 'admin'
}