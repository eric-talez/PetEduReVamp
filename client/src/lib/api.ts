/**
 * API 요청 헬퍼 함수
 * 서버에 API 요청을 보내는 표준화된 방법 제공
 */

// 사용 가능한 HTTP 메서드 타입
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * API 요청 함수
 * @param method HTTP 메서드
 * @param url 요청 URL (상대 경로, 예: '/api/user')
 * @param data 요청 바디 데이터 (객체)
 * @param customHeaders 추가 헤더 (기본 헤더 외에)
 * @returns Fetch Response 객체
 */
export async function apiRequest(
  method: HttpMethod,
  url: string,
  data?: any,
  customHeaders?: Record<string, string>
): Promise<Response> {
  // 기본 헤더 설정
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders
  };

  // 요청 옵션 구성
  const options: RequestInit = {
    method,
    headers,
    credentials: 'include', // 쿠키 포함 (세션 인증용)
  };

  // GET 요청이 아닐 경우 요청 바디 추가
  if (method !== 'GET' && data) {
    options.body = JSON.stringify(data);
  }

  // URL에 쿼리 파라미터 추가 (GET 요청)
  let finalUrl = url;
  if (method === 'GET' && data) {
    const queryParams = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    if (queryString) {
      finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
    }
  }

  try {
    // 실제 API 요청 수행
    const response = await fetch(finalUrl, options);
    
    // 인증 관련 오류 처리 (401, 403)
    if (response.status === 401 || response.status === 403) {
      console.error(`인증 오류: ${response.status}`, finalUrl);
      
      // 글로벌 이벤트 발생 (인증 상태 업데이트 용)
      const authEvent = new CustomEvent('auth:statusChange', { 
        detail: { authenticated: false, status: response.status } 
      });
      window.dispatchEvent(authEvent);
    }
    
    return response;
  } catch (error) {
    console.error(`API 요청 오류 (${method} ${finalUrl}):`, error);
    throw error;
  }
}

/**
 * 파일 업로드 요청 함수
 * @param url 업로드 URL
 * @param formData FormData 객체 (파일 및 기타 데이터 포함)
 * @param onProgress 진행 상태 콜백 (선택 사항)
 * @returns Fetch Response 객체
 */
export async function uploadFile(
  url: string,
  formData: FormData,
  onProgress?: (percent: number) => void
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // 진행 상태 이벤트 처리
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      });
    }
    
    // 요청 완료 이벤트 처리
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // 응답을 Fetch API의 Response 객체와 유사하게 만들어 반환
        const response = new Response(xhr.responseText, {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: new Headers({
            'Content-Type': xhr.getResponseHeader('Content-Type') || 'application/json'
          })
        });
        resolve(response);
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });
    
    // 오류 이벤트 처리
    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });
    
    // 요청 취소 이벤트 처리
    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });
    
    // 요청 실행
    xhr.open('POST', url);
    xhr.withCredentials = true; // 쿠키 포함 (세션 인증용)
    xhr.send(formData);
  });
}

/**
 * GET 요청 편의 함수
 */
export function get(url: string, data?: any, headers?: Record<string, string>) {
  return apiRequest('GET', url, data, headers);
}

/**
 * POST 요청 편의 함수
 */
export function post(url: string, data?: any, headers?: Record<string, string>) {
  return apiRequest('POST', url, data, headers);
}

/**
 * PUT 요청 편의 함수
 */
export function put(url: string, data?: any, headers?: Record<string, string>) {
  return apiRequest('PUT', url, data, headers);
}

/**
 * PATCH 요청 편의 함수
 */
export function patch(url: string, data?: any, headers?: Record<string, string>) {
  return apiRequest('PATCH', url, data, headers);
}

/**
 * DELETE 요청 편의 함수
 */
export function del(url: string, data?: any, headers?: Record<string, string>) {
  return apiRequest('DELETE', url, data, headers);
}