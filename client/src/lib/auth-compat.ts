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
import type { UserRole } from '@shared/schema';

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
  const auth = useGlobalAuth();

  // 기존 글로벌 인증 상태와 함께 프로필 업데이트 함수 제공
  return {
    ...auth,
    // 사용자 정보 업데이트 함수
    updateUserInfo: (userInfo: { name?: string; email?: string }) => {
      // 전역 상태 업데이트 (현재는 간단한 콘솔 로그만 추가)
      console.log('사용자 정보 업데이트:', userInfo);
      
      // 나중에 전역 상태를 업데이트하는 로직을 추가할 수 있습니다
      // 현재는 UI 갱신을 위한 페이지 새로고침
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };
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