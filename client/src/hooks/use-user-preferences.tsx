import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// 사용자 선호도 타입 정의
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  language: 'ko' | 'en';
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
  lastVisitedPages: string[];
}

// 기본 선호도 설정
const defaultPreferences: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  language: 'ko',
  animationsEnabled: true,
  notificationsEnabled: true,
  lastVisitedPages: [],
};

// 컨텍스트 생성
type UserPreferencesContextType = {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  resetPreferences: () => void;
  addVisitedPage: (path: string) => void;
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

// 프로바이더 컴포넌트
export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const savedPrefs = localStorage.getItem('userPreferences');
    return savedPrefs ? JSON.parse(savedPrefs) : defaultPreferences;
  });

  // 선호도 변경시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  // 특정 선호도 업데이트
  const updatePreference = <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  // 모든 선호도 초기화
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  // 방문 페이지 추가 (최대 10개 유지)
  const addVisitedPage = (path: string) => {
    setPreferences(prev => {
      const newPages = prev.lastVisitedPages.filter(p => p !== path);
      newPages.unshift(path); // 최근 방문 페이지를 맨 앞에 추가
      return {
        ...prev,
        lastVisitedPages: newPages.slice(0, 10), // 최대 10개 유지
      };
    });
  };

  return (
    <UserPreferencesContext.Provider 
      value={{ preferences, updatePreference, resetPreferences, addVisitedPage }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

// 커스텀 훅
export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}