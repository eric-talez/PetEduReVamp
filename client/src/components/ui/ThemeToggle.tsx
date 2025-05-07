import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  // 기본 이벤트 핸들러로 전환 - 모든 React 의존성 제거
  function handleClick() {
    // 직접 콘솔에 로그를 출력하여 이벤트 발생 확인
    alert("테마 토글 버튼이 클릭되었습니다");
    console.log("테마 토글 버튼 클릭됨");
    
    // document.body에 직접 다크 모드 클래스를 토글
    const isDark = document.documentElement.classList.toggle('dark');
    
    // 로컬 스토리지에 저장
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
  
  // 현재 테마 확인 (초기 렌더링용)
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  return (
    <button
      type="button"
      onClick={handleClick}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
    >
      {isDarkMode ? (
        <Moon className="h-5 w-5 text-indigo-400" />
      ) : (
        <Sun className="h-5 w-5 text-amber-400" />
      )}
    </button>
  );
}