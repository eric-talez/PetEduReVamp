import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  // 현재 테마 상태를 React state로 관리
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // 컴포넌트 마운트 시 현재 테마 확인
  useEffect(() => {
    // 초기 테마 상태 설정
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    // 테마 변경 감지를 위한 MutationObserver 설정
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    // 컴포넌트 언마운트 시 observer 해제
    return () => observer.disconnect();
  }, []);
  
  function handleClick() {
    // 테마 변경 시 로그 출력
    console.log("테마 토글 버튼 클릭됨");
    
    // document.documentElement에 직접 다크 모드 클래스를 토글
    const newIsDark = !isDarkMode;
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // React 상태 업데이트
    setIsDarkMode(newIsDark);
    
    // 로컬 스토리지에 저장
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
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