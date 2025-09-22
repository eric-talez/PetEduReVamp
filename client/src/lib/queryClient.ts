import { QueryClient, QueryFunction, QueryClientConfig } from "@tanstack/react-query";
import { getCSRFToken } from "./csrf";

// 오류 코드와 메시지 매핑
interface ApiError extends Error {
  statusCode?: number;
  errorCode?: string;
  fieldErrors?: Record<string, string[]>;
}

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

export const apiRequest = async (method: string, url: string, data?: any) => {
  const config: RequestInit = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  // POST, PUT, PATCH, DELETE 요청에는 CSRF 토큰 추가
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
    try {
      const csrfToken = await getCSRFToken();
      (config.headers as any)['X-CSRF-Token'] = csrfToken;
    } catch (error) {
      console.warn('[apiRequest] CSRF 토큰 가져오기 실패:', error);
    }
  }

  if (data && method.toUpperCase() !== 'GET') {
    config.body = JSON.stringify(data);
  }

  if (data && method.toUpperCase() === 'GET') {
    const params = new URLSearchParams(data);
    url += `?${params}`;
  }

  console.log(`[apiRequest] ${method.toUpperCase()} ${url}`, data ? { body: data } : {});

  try {
    const response = await fetch(url, config);

    console.log(`[apiRequest] Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorBody = await response.text();
        if (errorBody) {
          const errorData = JSON.parse(errorBody);
          errorMessage = errorData.message || errorData.error || errorMessage;
        }
      } catch (parseError) {
        console.warn('[apiRequest] 오류 응답 파싱 실패:', parseError);
      }

      throw new Error(errorMessage);
    }

    return response;
  } catch (networkError) {
    console.error(`[apiRequest] 네트워크 오류:`, networkError);
    throw new Error(`네트워크 오류: ${networkError instanceof Error ? networkError.message : String(networkError)}`);
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

// 환경별 캐시 설정
const isDevelopment = process.env.NODE_ENV === 'development';

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