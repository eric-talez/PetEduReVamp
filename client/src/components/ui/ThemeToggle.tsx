import { Button } from "./Button";
import { useTheme } from "@/context/theme-context";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // 로컬 state를 사용하여 UI를 직접 제어
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
  
  // 브라우저 DOM에 직접 테마 클래스 적용
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(currentTheme);
  }, [currentTheme]);

  // 컴포넌트 마운트 시 기본 테마 설정
  useEffect(() => {
    // localStorage에서 테마 확인
    const savedTheme = localStorage.getItem("petedu-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setCurrentTheme(savedTheme);
    } else {
      // 저장된 테마가 없으면 기본값 사용
      setCurrentTheme("light");
    }
  }, []);
  
  const toggleTheme = () => {
    // 새 테마 계산
    const newTheme = currentTheme === "light" ? "dark" : "light";
    
    // localStorage에 테마 저장
    localStorage.setItem("petedu-theme", newTheme);
    
    // 로컬 상태 및 context 상태 업데이트
    setCurrentTheme(newTheme);
    setTheme(newTheme);
    
    console.log("Toggling theme from", currentTheme, "to", newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
      aria-label="Toggle theme"
    >
      {currentTheme === "dark" ? (
        <Moon className="h-5 w-5 text-primary" />
      ) : (
        <Sun className="h-5 w-5 text-accent" />
      )}
    </Button>
  );
}
