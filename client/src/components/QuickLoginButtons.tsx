import React from 'react';
import { Button } from '@/components/ui/button';

/**
 * 빠른 로그인 버튼 컴포넌트
 * 다양한 역할로 빠르게 로그인할 수 있는 버튼들을 제공합니다.
 */
export function QuickLoginButtons() {
  // 테스트 계정으로 로그인 처리 함수
  const handleLoginAs = (role: string) => {
    // 로그인 시뮬레이션을 위한 함수
    let mockUser = {
      id: 1,
      username: `demo-${role}`,
      name: role === 'pet-owner' ? '반려인' : 
            role === 'trainer' ? '훈련사' : 
            role === 'institute-admin' ? '기관 관리자' : 
            role === 'admin' ? '관리자' : `데모 사용자`,
      email: "test@example.com",
      role: role
    };
    
    // 로그인 이벤트 발생 (hooks/useAuth.tsx에서 이 이벤트를 감지함)
    const loginEvent = new CustomEvent('login', {
      detail: { 
        role: mockUser.role,
        name: mockUser.name,
        userName: mockUser.name,
        userRole: mockUser.role
      }
    });
    
    console.log('Login event dispatched as:', role);
    window.dispatchEvent(loginEvent);
  };
  
  // 로그아웃 처리 함수
  const handleLogout = () => {
    const logoutEvent = new CustomEvent('logout');
    window.dispatchEvent(logoutEvent);
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
      >
        Owner
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300 text-xs py-0.5 h-5 px-1"
        onClick={() => handleLoginAs('trainer')}
      >
        Trainer
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300 text-xs py-0.5 h-5 px-1"
        onClick={() => handleLoginAs('institute-admin')}
      >
        Institute
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300 text-xs py-0.5 h-5 px-1"
        onClick={() => handleLoginAs('admin')}
      >
        Admin
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="bg-red-100 hover:bg-red-200 text-red-800 border-red-300 text-xs py-0.5 h-5 px-1 col-span-2"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
}