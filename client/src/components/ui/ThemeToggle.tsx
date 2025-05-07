import { Button } from "./Button";
import { useTheme } from "@/context/theme-context";
import { Moon, Sun } from "lucide-react";
import { memo, useEffect, useState } from "react";

// 성능 최적화를 위해 memo로 컴포넌트 래핑
export const ThemeToggle = memo(function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 컴포넌트가 마운트된 후에만 테마 토글을 허용
  // 이는 hydration 오류를 방지하고 SSR 호환성을 보장합니다
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    console.log("Current theme:", theme);
    const newTheme = theme === "light" ? "dark" : "light";
    console.log("Changing to:", newTheme);
    setTheme(newTheme);
  };

  // 마운트되기 전까지는 버튼을 숨겨 깜빡임을 방지합니다
  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5 text-amber-400 animate-fade-in" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-400 animate-fade-in" />
      )}
    </Button>
  );
});