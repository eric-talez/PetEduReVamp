import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

function getSystemTheme(): Theme {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") as Theme | null;
      return storedTheme || "system";
    }
    return "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(() => {
    if (theme === "system") {
      return getSystemTheme();
    }
    return theme;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "system") {
      const systemTheme = getSystemTheme();
      setResolvedTheme(systemTheme);
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    } else {
      setResolvedTheme(theme);
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }

    // 로컬 스토리지에 테마 설정 저장
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 시스템 테마 변경 감지
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      const newTheme = getSystemTheme();
      setResolvedTheme(newTheme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return {
    theme,
    resolvedTheme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
    toggleTheme: () => {
      setTheme((prevTheme) => {
        // 시스템 테마를 명시적인 테마로 변환
        if (prevTheme === "system") {
          return resolvedTheme === "dark" ? "light" : "dark";
        }
        // 라이트/다크 모드 토글
        return prevTheme === "dark" ? "light" : "dark";
      });
    },
  };
}