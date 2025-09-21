import { createRoot } from "react-dom/client";
import SimpleApp from "./SimpleApp";
import { AuthProvider } from "./hooks/useAuth";
import "./index.css";
import { ThemeProvider } from "./context/theme-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import './debug.js';

console.log('ENV VAR CHECK in main:', import.meta.env.VITE_KAKAO_MAPS_API_KEY);

// Enhanced global error handlers
window.addEventListener('unhandledrejection', (event) => {
  // 개발 환경에서만 상세 로깅
  if (import.meta.env.DEV) {
    console.warn('Unhandled promise rejection:', event.reason);
  }

  // 네트워크 에러나 중요하지 않은 에러는 무시
  const reason = event.reason;
  if (reason?.name === 'AbortError' || 
      reason?.message?.includes('fetch') ||
      reason?.message?.includes('Network Error')) {
    event.preventDefault();
    return;
  }

  // 중요한 에러만 로깅
  console.error('Critical unhandled rejection:', reason);
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  // 스크립트 에러나 리소스 로딩 에러만 처리
  if (event.error || event.message) {
    console.error('Global error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      error: event.error
    });
  }

  // 메뉴 관련 오류 자동 감지
  if (event.error?.message?.includes('menu') || event.error?.stack?.includes('menu')) {
    import('./utils/error-logger').then(({ errorLogger }) => {
      errorLogger.triggerMenuAutoFix();
    });
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('처리되지 않은 Promise 거부:', event.reason);
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <SimpleApp />
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);