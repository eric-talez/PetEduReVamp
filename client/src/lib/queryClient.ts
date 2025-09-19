import { QueryClient, QueryFunction, QueryClientConfig } from "@tanstack/react-query";
import { ApiError } from "@/lib/errorHelpers";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    // 응답이 JSON인지 확인
    const contentType = res.headers.get("content-type");
    let errorMessage: string;
    let errorCode: string | undefined;
    let fieldErrors: Record<string, string[]> | undefined;

    if (contentType && contentType.includes("application/json")) {
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || res.statusText;
        errorCode = errorData.code;
        fieldErrors = errorData.fieldErrors;
      } catch (e) {
        errorMessage = await res.text() || res.statusText;
      }
    } else {
      errorMessage = await res.text() || res.statusText;
    }

    const error = new Error(`${res.status}: ${errorMessage}`) as ApiError;
    error.statusCode = res.status;
    error.errorCode = errorCode;
    error.fieldErrors = fieldErrors;

    throw error;
  }
}

// Helper function to redact sensitive data from logs
const redactSensitiveData = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  
  const sensitiveFields = [
    'password', 'token', 'accessToken', 'refreshToken', 'apiKey', 'secret',
    'authorization', 'auth', 'key', 'credential', 'sessionId', 'ssn', 'sin',
    'cardNumber', 'cvv', 'pin', 'otp', 'privateKey'
  ];
  
  const redacted = { ...data };
  
  for (const field of sensitiveFields) {
    const lowerField = field.toLowerCase();
    for (const key in redacted) {
      if (key.toLowerCase().includes(lowerField)) {
        redacted[key] = '[REDACTED]';
      }
    }
  }
  
  return redacted;
};

// Development environment check - use Vite's built-in environment variables
const isDevelopment = import.meta.env.DEV;

// Production error telemetry (simplified for now, can be extended)
const reportError = (error: ApiError, context: { method: string; url: string; statusCode?: number }) => {
  if (!isDevelopment) {
    // In production, send structured error data to monitoring service
    // This is a placeholder for actual telemetry service integration
    const telemetryData = {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        statusCode: error.statusCode,
        errorCode: error.errorCode,
      },
      context: {
        method: context.method,
        url: context.url.replace(/\/\d+/g, '/:id'), // Replace IDs with placeholders for privacy
        userAgent: navigator.userAgent.substring(0, 100), // Truncate for privacy
      }
    };
    
    // TODO: Send to actual monitoring service (Sentry, DataDog, etc.)
    console.error('[TELEMETRY]', JSON.stringify(telemetryData));
  }
};

export const apiRequest = async (method: string, url: string, data?: any) => {
  const config: RequestInit = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (data && method.toUpperCase() !== 'GET') {
    config.body = JSON.stringify(data);
  }

  if (data && method.toUpperCase() === 'GET') {
    const params = new URLSearchParams(data);
    url += `?${params}`;
  }

  // Gate debugging logs behind development environment
  if (isDevelopment) {
    console.log(`[apiRequest] ${method.toUpperCase()} ${url}`, data ? { body: redactSensitiveData(data) } : {});
  }

  try {
    const response = await fetch(url, config);

    // Development-only response logging
    if (isDevelopment) {
      console.log(`[apiRequest] Response: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorCode: string | undefined;
      let fieldErrors: Record<string, string[]> | undefined;

      try {
        const errorBody = await response.text();
        if (errorBody) {
          const errorData = JSON.parse(errorBody);
          errorMessage = errorData.message || errorData.error || errorMessage;
          errorCode = errorData.code;
          fieldErrors = errorData.fieldErrors;
        }
      } catch (parseError) {
        if (isDevelopment) {
          console.warn('[apiRequest] 오류 응답 파싱 실패:', parseError);
        }
      }

      const error = new Error(errorMessage) as ApiError;
      error.statusCode = response.status;
      error.errorCode = errorCode;
      error.fieldErrors = fieldErrors;

      // Report error to telemetry system
      reportError(error, { method, url, statusCode: response.status });

      throw error;
    }

    return response;
  } catch (networkError) {
    const errorMessage = `네트워크 오류: ${networkError instanceof Error ? networkError.message : String(networkError)}`;
    
    // 네트워크 오류도 ApiError 타입으로 생성
    const error = new Error(errorMessage) as ApiError;
    error.statusCode = 0;
    error.errorCode = 'NETWORK_ERROR';
    
    // Report network error to telemetry
    reportError(error, { method, url });
    
    // Always log network errors but redact sensitive context in production
    if (isDevelopment) {
      console.error(`[apiRequest] 네트워크 오류:`, networkError);
    } else {
      console.error(`[apiRequest] 네트워크 오류: ${error.message}`);
    }
    
    throw error;
  }
};

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// 확장된 QueryClient 설정
const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      // 개발 환경에서는 창 포커스 시 새로고침 비활성화, 프로덕션에서는 활성화
      refetchOnWindowFocus: !isDevelopment,
      // 기본 staleTime을 5분으로 설정하여 불필요한 재요청 감소
      staleTime: 5 * 60 * 1000,
      // 캐시 유지 시간을 30분으로 설정 (gc 타이밍)
      gcTime: 30 * 60 * 1000,
      // 네트워크 오류 시 최대 2번 재시도
      retry: (failureCount, error: any) => {
        // 401/403/404 같은 인증/권한/리소스 없음 오류는 재시도하지 않음
        if (error?.statusCode === 401 || error?.statusCode === 403 || error?.statusCode === 404) {
          return false;
        }
        // 네트워크 오류 등의 일시적 문제는 최대 2번까지 재시도
        return failureCount < 2;
      },
      // 콘텐츠 중복 방지 위해 쿼리 키 변형
      queryKeyHashFn: (queryKey) => JSON.stringify(queryKey),
    },
    mutations: {
      // 변경 작업은 재시도하지 않음
      retry: false,
      // 변경 작업 실패 시 자동으로 롤백할 수 있는 onMutate 함수 추가 권장
    },
  },
};

export const queryClient = new QueryClient(queryClientConfig);