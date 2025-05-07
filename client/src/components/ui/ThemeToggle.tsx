import { Button } from "./Button";
import { useTheme } from "@/context/theme-context";
import { Moon, Sun } from "lucide-react";
import { memo } from "react";

// 성능 최적화를 위해 memo로 컴포넌트 래핑
export const ThemeToggle = memo(function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // 직접 컨텍스트의 theme 상태를 사용하여 불필요한 로컬 상태 제거
  const toggleTheme = () => {
    // 즉시 테마 전환으로 인지된 성능 향상
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="theme-toggle-button relative rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {/* 테마에 따라 아이콘 조건부 렌더링 - 불필요한 DOM 관리 최소화 */}
      {theme === "light" ? (
        <Sun className="theme-toggle-icon h-5 w-5 text-amber-400 animate-fade-in" />
      ) : (
        <Moon className="theme-toggle-icon h-5 w-5 text-indigo-400 animate-fade-in" />
      )}
    </Button>
  );
});