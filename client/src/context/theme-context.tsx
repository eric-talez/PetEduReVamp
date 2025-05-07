import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// 항상 함수 선언식을 사용하여 일관성 유지
export function useTheme() {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "petedu-theme",
  ...props
}: ThemeProviderProps) {
  // 성능 최적화된 버전
  const [theme, setTheme] = useState<Theme>(() => {
    // 초기화 시 한 번만 실행됨
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch (e) {}
    return defaultTheme;
  });

  useEffect(() => {
    // 최적화된 DOM 업데이트를 위해 requestAnimationFrame 활용
    requestAnimationFrame(() => {
      const root = window.document.documentElement;
      
      // 현재 활성화된 테마 클래스 확인
      const hasLightClass = root.classList.contains("light");
      const hasDarkClass = root.classList.contains("dark");
      
      // 적용할 실제 테마 결정
      let appliedTheme: "light" | "dark";
      if (theme === "system") {
        appliedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      } else {
        appliedTheme = theme as "light" | "dark";
      }
      
      // 필요한 경우에만 classList 조작 (성능 최적화)
      if (appliedTheme === "dark") {
        if (!hasDarkClass) {
          // classList.replace 메서드로 한 번의 리플로우만 발생
          if (hasLightClass) {
            root.classList.replace("light", "dark");
          } else {
            root.classList.add("dark");
          }
        }
      } else {
        if (!hasLightClass) {
          if (hasDarkClass) {
            root.classList.replace("dark", "light");
          } else {
            root.classList.add("light");
          }
        }
      }
      
      // 속성 업데이트 (스크린 리더 및 다른 API를 위한 접근성)
      root.setAttribute("data-theme", appliedTheme);
    });
  }, [theme]);

  // 메모이제이션된 값을 사용하여 불필요한 리렌더링 방지
  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // 동일한 테마로 전환하는 경우 작업 스킵
      if (theme === newTheme) return;
      
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (e) {}
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
