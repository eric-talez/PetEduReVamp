import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ApiErrorProps {
  title?: string;
  message?: string;
  retryFn?: () => void;
  className?: string;
  statusCode?: number;
}

/**
 * API 오류 상태를 표시하는 컴포넌트
 * 
 * API 호출 실패 시 사용자에게 친숙한 오류 메시지 제공
 * 접근성을 고려한 설계
 */
export function ApiError({
  title = "데이터를 불러올 수 없습니다",
  message = "서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.",
  retryFn,
  className = "",
  statusCode
}: ApiErrorProps) {
  // 상태 코드별 맞춤 메시지
  const getStatusMessage = (code: number): string => {
    switch(code) {
      case 401:
        return "로그인이 필요하거나 세션이 만료되었습니다.";
      case 403:
        return "이 콘텐츠에 접근할 권한이 없습니다.";
      case 404:
        return "요청하신 정보를 찾을 수 없습니다.";
      case 500:
        return "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
      default:
        return message;
    }
  };

  const finalMessage = statusCode ? getStatusMessage(statusCode) : message;

  return (
    <div 
      className={`flex flex-col items-center justify-center p-6 space-y-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20">
        <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />
      </div>
      
      <div className="text-center">
        <h3 className="text-base font-medium text-amber-800 dark:text-amber-400">
          {title}
        </h3>
        <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
          {finalMessage}
        </p>
        {statusCode && (
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
            오류 코드: {statusCode}
          </p>
        )}
      </div>
      
      {retryFn && (
        <Button 
          variant="outline" 
          size="sm"
          className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/30"
          onClick={retryFn}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          다시 시도
        </Button>
      )}
    </div>
  );
}