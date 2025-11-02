import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/theme-context";

export function ThemeToggle() {
  // ThemeProvider의 테마 상태 사용
  const { theme, setTheme } = useTheme();
  
  // 현재 다크 모드 여부 계산 (system 테마 고려)
  const isDarkMode = theme === "dark" || 
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  
  function handleClick() {
    // 테마 변경 시 로그 출력
    console.log("테마 토글 버튼 클릭됨");
    
    // ThemeProvider를 통해 테마 변경
    setTheme(isDarkMode ? "light" : "dark");
  }
  
  return (
    <button
      type="button"
      onClick={handleClick}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
      aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {isDarkMode ? (
        <Moon className="h-5 w-5 text-primary" />
      ) : (
        <Sun className="h-5 w-5 text-primary" />
      )}
    </button>
  );
}