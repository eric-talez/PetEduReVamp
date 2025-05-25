import React from 'react';
import { DogLoading } from '../DogLoading';
import { ApiError } from './api-error';
import { EmptyState } from './empty-state';

interface LoadingErrorWrapperProps<T> {
  isLoading: boolean;
  isError: boolean;
  isEmpty?: boolean;
  error?: Error | null;
  data?: T;
  children: React.ReactNode;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  emptyTitle?: string;
  retry?: () => void;
  statusCode?: number;
}

/**
 * 로딩, 오류, 빈 상태를 처리하는 통합 래퍼 컴포넌트
 * 
 * @tanstack/react-query와 함께 사용하기 좋은 컴포넌트로,
 * 데이터 로딩, 오류 처리, 빈 상태 등을 일관되게 처리합니다.
 */
export function LoadingErrorWrapper<T>({
  isLoading,
  isError,
  isEmpty = false,
  error,
  data,
  children,
  loadingMessage = "데이터를 로딩 중입니다...",
  errorMessage,
  emptyMessage = "표시할 데이터가 없습니다.",
  emptyTitle = "데이터가 없습니다",
  retry,
  statusCode
}: LoadingErrorWrapperProps<T>) {
  // 로딩 상태
  if (isLoading) {
    return <DogLoading message={loadingMessage} size="medium" />;
  }

  // 오류 상태
  if (isError) {
    return (
      <ApiError
        message={errorMessage || (error?.message || "데이터를 불러오는 중 오류가 발생했습니다.")}
        retryFn={retry}
        statusCode={statusCode}
      />
    );
  }

  // 빈 상태
  if (isEmpty || (!data || (Array.isArray(data) && data.length === 0))) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        action={retry ? { label: "새로고침", onClick: retry } : undefined}
      />
    );
  }

  // 정상 상태: 자식 컴포넌트 렌더링
  return <>{children}</>;
}