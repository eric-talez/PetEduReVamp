/**
 * CSRF 토큰 관리 유틸리티
 * 프론트엔드에서 CSRF 보호를 위한 토큰 처리
 */

let csrfToken: string | null = null;

/**
 * CSRF 토큰을 서버에서 가져와서 캐시
 */
export async function getCSRFToken(): Promise<string> {
  if (csrfToken) {
    return csrfToken;
  }

  try {
    const response = await fetch('/api/auth/csrf', {
      credentials: 'include' // 세션 쿠키 포함
    });
    
    if (!response.ok) {
      throw new Error('CSRF 토큰을 가져올 수 없습니다');
    }
    
    const data = await response.json();
    csrfToken = data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('CSRF 토큰 가져오기 실패:', error);
    throw error;
  }
}

/**
 * CSRF 토큰을 포함한 fetch 요청
 */
export async function secureRequest(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getCSRFToken();
  
  const headers = new Headers(options.headers);
  headers.set('X-CSRF-Token', token);
  
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });
}

/**
 * CSRF 토큰 캐시 무효화 (로그아웃 시 호출)
 */
export function clearCSRFToken(): void {
  csrfToken = null;
}

/**
 * 폼 데이터에 CSRF 토큰 추가
 */
export async function addCSRFToFormData(formData: FormData): Promise<FormData> {
  const token = await getCSRFToken();
  formData.append('_csrf', token);
  return formData;
}

/**
 * JSON 요청 객체에 CSRF 토큰 추가
 */
export async function addCSRFToJSON(data: any): Promise<any> {
  const token = await getCSRFToken();
  return {
    ...data,
    _csrf: token
  };
}