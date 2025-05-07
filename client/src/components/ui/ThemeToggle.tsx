import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<string>("light");
  
  // 초기 테마 로드
  useEffect(() => {
    // 로컬 스토리지에서 테마 가져오기
    const savedTheme = localStorage.getItem("petedu-theme");
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);
  
  // 테마 적용 함수
  const applyTheme = (newTheme: string) => {
    const root = document.documentElement;
    
    if (newTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  };
  
  // 테마 토글 함수
  const toggleTheme = () => {
    console.log("테마 토글 버튼 클릭됨");
    const newTheme = theme === "light" ? "dark" : "light";
    console.log(`테마 변경: ${theme} -> ${newTheme}`);
    
    // 상태 업데이트
    setTheme(newTheme);
    
    // DOM 업데이트
    applyTheme(newTheme);
    
    // 로컬 스토리지에 저장
    localStorage.setItem("petedu-theme", newTheme);
  };
  
  return (
    <button
      onClick={toggleTheme}
      className="relative rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5 text-amber-400" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-400" />
      )}
    </button>
  );
}