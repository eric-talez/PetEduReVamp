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
  const auth = useGlobalAuth();
  const { toast } = useToast();

  // 기존 글로벌 인증 상태와 함께 프로필 업데이트 함수 제공
  return {
    ...auth,
    // 사용자 정보 업데이트 함수
    updateUserInfo: async (userInfo: { 
      name?: string; 
      email?: string;
      phone?: string;
      bio?: string;
      location?: string;
      avatar?: string;
    }): Promise<boolean> => {
      console.log('사용자 정보 업데이트 요청:', userInfo);
      
      try {
        // API 요청을 통해 프로필 정보를 업데이트
        const response = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userInfo),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '프로필 업데이트 중 오류가 발생했습니다.');
        }
        
        const updatedUser = await response.json();
        console.log('사용자 정보 업데이트 성공:', updatedUser);
        
        // 이름이 업데이트되었으면 전역 상태도 업데이트
        if (userInfo.name && userInfo.name !== auth.userName) {
          // 인증 상태 부분 업데이트 (이름만 변경)
          if (auth.userRole) {
            authStore.login(auth.userRole, userInfo.name);
          }
        }
        
        // 토스트 메시지 표시
        toast({
          title: "프로필 업데이트 완료",
          description: "프로필 정보가 성공적으로 업데이트되었습니다.",
        });
        
        return true;
      } catch (error) {
        console.error('프로필 업데이트 오류:', error);
        
        // 토스트 메시지 표시
        toast({
          title: "업데이트 실패",
          description: error instanceof Error ? error.message : "프로필을 업데이트하는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        
        return false;
      }
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