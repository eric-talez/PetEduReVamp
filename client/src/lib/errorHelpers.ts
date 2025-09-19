import { ErrorType } from '@/components/ui/error-state';

export interface ApiError extends Error {
  statusCode?: number;
  errorCode?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Centralized helper function to extract status code from various error types
 * Prevents code drift across different components and ensures consistent error handling
 */
export function getStatusCodeFromError(error: unknown): number | undefined {
  // Handle ApiError interface (custom error from queryClient)
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const apiError = error as ApiError;
    return apiError.statusCode;
  }

  // Handle standard Response objects
  if (error && typeof error === 'object' && 'status' in error) {
    const response = error as Response;
    return response.status;
  }

  // Handle fetch errors with status property
  if (error && typeof error === 'object' && 'message' in error) {
    const errorMessage = (error as Error).message;
    
    // Extract status code from error messages like "400: Bad Request"
    const statusMatch = errorMessage.match(/^(\d{3}):/);
    if (statusMatch) {
      return parseInt(statusMatch[1], 10);
    }
  }

  // Handle network errors or other cases
  return undefined;
}

/**
 * Determines the appropriate error type based on status code and error context
 * Used by LoadingErrorWrapper and other error handling components
 */
export function getErrorTypeFromStatusCode(statusCode?: number, error?: unknown): ErrorType {
  if (!statusCode) {
    // Check for network-related errors
    if (error && typeof error === 'object' && 'message' in error) {
      const message = (error as Error).message.toLowerCase();
      if (message.includes('network') || message.includes('fetch') || message.includes('offline')) {
        return 'network';
      }
    }
    return 'generic';
  }

  // Map status codes to error types
  switch (statusCode) {
    case 404:
      return '404';
    case 401:
    case 403:
      return 'permission';
    case 408:
    case 504:
      return 'timeout';
    case 500:
    case 502:
    case 503:
      return 'server';
    case 400:
    case 422:
      return 'loading-failed';
    default:
      if (statusCode >= 500) return 'server';
      if (statusCode >= 400) return 'loading-failed';
      return 'generic';
  }
}

/**
 * Gets user-friendly error message based on status code
 * Provides consistent messaging across the application
 */
export function getErrorMessage(statusCode?: number, customMessage?: string): string {
  if (customMessage) return customMessage;

  if (!statusCode) {
    return '예상치 못한 오류가 발생했습니다. 다시 시도해 주세요.';
  }

  switch (statusCode) {
    case 400:
      return '잘못된 요청입니다. 입력 정보를 확인해 주세요.';
    case 401:
      return '로그인이 필요하거나 세션이 만료되었습니다.';
    case 403:
      return '이 콘텐츠에 접근할 권한이 없습니다.';
    case 404:
      return '요청하신 정보를 찾을 수 없습니다.';
    case 408:
      return '요청 시간이 초과되었습니다. 다시 시도해 주세요.';
    case 429:
      return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.';
    case 500:
      return '서버 내부 오류가 발생했습니다.';
    case 502:
      return '서버 게이트웨이 오류가 발생했습니다.';
    case 503:
      return '서비스를 일시적으로 사용할 수 없습니다.';
    case 504:
      return '서버 응답 시간이 초과되었습니다.';
    default:
      if (statusCode >= 500) {
        return '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';
      } else if (statusCode >= 400) {
        return '요청을 처리하는 중 오류가 발생했습니다. 다시 시도해 주세요.';
      }
      return '예상치 못한 오류가 발생했습니다. 다시 시도해 주세요.';
  }
}

/**
 * Checks if an error indicates a network/connectivity issue
 * Useful for showing appropriate retry strategies
 */
export function isNetworkError(error: unknown): boolean {
  if (!error) return false;

  // Check for fetch errors or network-related error codes
  if (typeof error === 'object' && 'statusCode' in error) {
    const statusCode = (error as ApiError).statusCode;
    return statusCode === 0 || !statusCode;
  }

  if (typeof error === 'object' && 'message' in error) {
    const message = (error as Error).message.toLowerCase();
    return message.includes('network') || 
           message.includes('fetch') || 
           message.includes('offline') ||
           message.includes('connection');
  }

  return false;
}

/**
 * Checks if an error is retryable based on its type and status code
 * Helps determine whether to show retry actions to users
 */
export function isRetryableError(error: unknown): boolean {
  const statusCode = getStatusCodeFromError(error);
  
  // Don't retry client errors (400-499) except for specific cases
  if (statusCode && statusCode >= 400 && statusCode < 500) {
    // Retry timeout errors and rate limiting
    return statusCode === 408 || statusCode === 429;
  }

  // Retry server errors (500-599) and network errors
  if (statusCode && statusCode >= 500) {
    return true;
  }

  // Retry network errors
  if (isNetworkError(error)) {
    return true;
  }

  return false;
}

