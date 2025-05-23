import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// 사용자 타입 정의
export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'user' | 'trainer' | 'institute-admin' | 'admin';
  avatar?: string;
  instituteId?: number;
  verified?: boolean;
  [key: string]: any;
}

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  login: (username: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<User>;
}

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType | null>(null);

// 인증 제공자 컴포넌트
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 현재 사용자 정보 가져오기
  const { 
    data: user, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분
    onSuccess: (data) => {
      if (data) {
        setIsAuthenticated(true);
        console.log('User authenticated:', data);
      }
    },
    onError: () => {
      setIsAuthenticated(false);
      console.log('User not authenticated');
    }
  });

  // 로그인 뮤테이션
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest('POST', '/api/auth/login', credentials);
      return await res.json();
    },
    onSuccess: (data) => {
      setIsAuthenticated(true);
      queryClient.setQueryData(['/api/auth/me'], data);
      toast({
        title: '로그인 성공',
        description: `${data.name}님, 환영합니다!`,
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: '로그인 실패',
        description: error.message || '로그인 중 오류가 발생했습니다',
        variant: 'destructive',
      });
    },
  });

  // 회원가입 뮤테이션
  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const res = await apiRequest('POST', '/api/auth/register', userData);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: '회원가입 성공',
        description: '회원가입이 완료되었습니다. 로그인해주세요!',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: '회원가입 실패',
        description: error.message || '회원가입 중 오류가 발생했습니다',
        variant: 'destructive',
      });
    },
  });

  // 로그아웃 뮤테이션
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/auth/logout');
    },
    onSuccess: () => {
      setIsAuthenticated(false);
      queryClient.setQueryData(['/api/auth/me'], null);
      // 모든 쿼리 캐시 무효화 (민감한 데이터 삭제)
      queryClient.clear();
      toast({
        title: '로그아웃',
        description: '성공적으로 로그아웃되었습니다',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: '로그아웃 실패',
        description: error.message || '로그아웃 중 오류가 발생했습니다',
        variant: 'destructive',
      });
    },
  });

  // 프로필 업데이트 뮤테이션
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const res = await apiRequest('PUT', '/api/user/profile', profileData);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/auth/me'], data);
      toast({
        title: '프로필 업데이트 성공',
        description: '프로필이 성공적으로 업데이트되었습니다',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: '프로필 업데이트 실패',
        description: error.message || '프로필 업데이트 중 오류가 발생했습니다',
        variant: 'destructive',
      });
    },
  });

  // 로그인 함수
  const login = async (username: string, password: string): Promise<User> => {
    return loginMutation.mutateAsync({ username, password });
  };

  // 회원가입 함수
  const register = async (userData: any): Promise<User> => {
    return registerMutation.mutateAsync(userData);
  };

  // 로그아웃 함수
  const logout = async (): Promise<void> => {
    return logoutMutation.mutateAsync();
  };

  // 프로필 업데이트 함수
  const updateProfile = async (profileData: any): Promise<User> => {
    return updateProfileMutation.mutateAsync(profileData);
  };

  // 컨텍스트 값
  const value: AuthContextType = {
    user: user || null,
    isLoading,
    isAuthenticated,
    error: error as Error | null,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 인증 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}