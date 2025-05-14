import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // 로컬 스토리지에서 테마 가져오기
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('pet-edu-theme') as Theme;
      if (storedTheme) {
        return storedTheme;
      }

      // 시스템 선호 테마 확인
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemPrefersDark ? 'dark' : 'light';
    }

    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // 이전 테마 클래스 제거
    root.classList.remove('light', 'dark');
    
    // 현재 테마 적용
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemPrefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
    
    // 로컬 스토리지에 테마 저장
    localStorage.setItem('pet-edu-theme', theme);
  }, [theme]);

  const setThemeValue = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return { theme, setTheme: setThemeValue };
}