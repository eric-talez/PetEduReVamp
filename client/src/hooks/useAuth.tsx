import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export type UserRole = 'user' | 'pet-owner' | 'trainer' | 'institute-admin' | 'admin';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 테스트용 사용자 데이터 (실제 구현에서는 API로 교체 필요)
const mockUser: User = {
  id: 1,
  username: "admin",
  name: "관리자",
  email: "admin@example.com",
  role: "admin",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser); // 개발을 위해 기본 사용자 설정
  const [isLoading, setIsLoading] = useState(false);

  // 실제 구현에서는 아래 주석을 해제하고 mockUser 대신 실제 API 호출 사용
  /*
  const { data, isLoading, refetch } = useQuery<User | null>({
    queryKey: ['/api/auth/me'],
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);
  */

  const login = async (username: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      // 실제 구현에서는 아래 주석을 해제하고 위의 mockUser 관련 코드 제거
      /*
      const response = await apiRequest("POST", "/api/auth/login", { username, password });
      const userData = await response.json();
      setUser(userData);
      await refetch();
      return userData;
      */
      
      // 테스트용 코드
      return new Promise((resolve) => {
        setTimeout(() => {
          setUser(mockUser);
          setIsLoading(false);
          resolve(mockUser);
        }, 500);
      });
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // 실제 구현에서는 아래 주석을 해제
      /*
      await apiRequest("POST", "/api/auth/logout", {});
      setUser(null);
      await refetch();
      */
      
      // 테스트용 코드
      return new Promise((resolve) => {
        setTimeout(() => {
          setUser(null);
          setIsLoading(false);
          resolve();
        }, 500);
      });
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
