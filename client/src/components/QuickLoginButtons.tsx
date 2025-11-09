import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

/**
 * 빠른 로그인 버튼 컴포넌트
 * 다양한 역할로 빠르게 로그인할 수 있는 버튼들을 제공합니다.
 * 배포 환경에서도 실제 세션을 생성하여 테스트/데모 용도로 사용 가능합니다.
 */
export function QuickLoginButtons() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // 테스트 계정으로 로그인 처리 함수
  const handleLoginAs = async (role: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      console.log('[QuickLogin] API 호출 시작:', role);
      
      // CSRF 토큰 조회
      const csrfRes = await fetch('/api/auth/csrf', { credentials: 'include' });
      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.csrfToken || csrfData.data?.token;
      
      if (!csrfToken) {
        console.error('[QuickLogin] CSRF 응답:', csrfData);
        throw new Error('CSRF 토큰을 가져올 수 없습니다.');
      }
      
      console.log('[QuickLogin] CSRF 토큰 획득:', csrfToken.substring(0, 16) + '...');
      
      // 퀵로그인 API 호출 (fetch 사용)
      const response = await fetch('/api/auth/quick-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ role }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '퀵로그인 실패');
      }
      
      const data = await response.json();
      console.log('[QuickLogin] API 응답:', data);
      
      // 성공 시 전역 인증 상태 업데이트
      const loginEvent = new CustomEvent('login', {
        detail: { 
          role: data.data.user.role,
          name: data.data.user.name,
          userName: data.data.user.name,
          userRole: data.data.user.role
        }
      });
      
      window.dispatchEvent(loginEvent);
      
      // 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      
      toast({
        title: '로그인 성공',
        description: `${data.data.user.name}(${data.data.user.role})로 로그인되었습니다.`,
      });
      
      // 페이지 새로고침 (세션 동기화)
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (error: any) {
      console.error('[QuickLogin] 로그인 실패:', error);
      toast({
        variant: 'destructive',
        title: '로그인 실패',
        description: error.message || '퀵로그인 처리 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 로그아웃 처리 함수
  const handleLogout = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // CSRF 토큰 조회
      const csrfRes = await fetch('/api/auth/csrf', { credentials: 'include' });
      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.csrfToken || csrfData.data?.token;
      
      if (!csrfToken) {
        console.error('[QuickLogin] Logout CSRF 응답:', csrfData);
        throw new Error('CSRF 토큰을 가져올 수 없습니다.');
      }
      
      console.log('[QuickLogin] Logout CSRF 토큰 획득:', csrfToken.substring(0, 16) + '...');
      
      // 로그아웃 API 호출 (fetch 사용)
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '로그아웃 실패');
      }
      
      // 로그아웃 이벤트 발생
      const logoutEvent = new CustomEvent('logout');
      window.dispatchEvent(logoutEvent);
      
      // 쿼리 캐시 초기화
      queryClient.clear();
      
      toast({
        title: '로그아웃 완료',
        description: '성공적으로 로그아웃되었습니다.',
      });
      
      // 페이지 새로고침
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (error: any) {
      console.error('[QuickLogin] 로그아웃 실패:', error);
      toast({
        variant: 'destructive',
        title: '로그아웃 실패',
        description: error.message || '로그아웃 처리 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // QuickLogin 버튼 표시 여부 제어
  // 환경 변수 VITE_ENABLE_QUICK_LOGIN이 'true'로 설정되어 있거나 개발 모드인 경우 표시
  const isDevEnv = import.meta.env.MODE === 'development';
  const enableQuickLogin = import.meta.env.VITE_ENABLE_QUICK_LOGIN === 'true';
  
  if (!isDevEnv && !enableQuickLogin) {
    return null; // 개발 모드가 아니고 VITE_ENABLE_QUICK_LOGIN이 활성화되지 않은 경우 숨김
  }
  
  return (
    <div className="grid grid-cols-2 gap-1 mt-1">
      <Button 
        variant="outline" 
        size="sm"
        className="bg-green-100 hover:bg-green-200 text-green-800 border-green-300 text-xs py-0.5 h-5 px-1"
        onClick={() => handleLoginAs('pet-owner')}
        disabled={isLoading}
        data-testid="quick-login-owner"
      >
        Owner
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300 text-xs py-0.5 h-5 px-1"
        onClick={() => handleLoginAs('trainer')}
        disabled={isLoading}
        data-testid="quick-login-trainer"
      >
        Trainer
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300 text-xs py-0.5 h-5 px-1"
        onClick={() => handleLoginAs('institute-admin')}
        disabled={isLoading}
        data-testid="quick-login-institute"
      >
        Institute
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300 text-xs py-0.5 h-5 px-1"
        onClick={() => handleLoginAs('admin')}
        disabled={isLoading}
        data-testid="quick-login-admin"
      >
        Admin
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="bg-red-100 hover:bg-red-200 text-red-800 border-red-300 text-xs py-0.5 h-5 px-1 col-span-2"
        onClick={handleLogout}
        disabled={isLoading}
        data-testid="quick-login-logout"
      >
        {isLoading ? '처리 중...' : 'Logout'}
      </Button>
    </div>
  );
}