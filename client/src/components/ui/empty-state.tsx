import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * 데이터가 없는 상태를 표시하는 컴포넌트
 * 
 * 목록이나 검색 결과가 비어있을 때 사용자에게 친숙한 안내 메시지 제공
 * 접근성을 고려한 설계
 */
export function EmptyState({
  title = "데이터가 없습니다",
  message = "표시할 내용이 없습니다.",
  icon,
  action,
  className = ""
}: EmptyStateProps) {
  return (
    <div 
      className={`flex flex-col items-center justify-center py-10 px-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800/10 dark:border-gray-700 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800/50">
        {icon || <FileQuestion className="h-6 w-6 text-gray-500 dark:text-gray-400" aria-hidden="true" />}
      </div>
      
      <div className="text-center">
        <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
      </div>
      
      {action && (
        <Button 
          variant="outline" 
          size="sm"
          className="mt-4"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}