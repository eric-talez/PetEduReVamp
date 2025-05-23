/**
 * 환경 변수 관리 모듈
 * 
 * 이 모듈은 환경 변수 접근을 중앙 집중화하여 다음과 같은 이점을 제공합니다:
 * 1. 타입 안전성 - 모든 환경 변수에 대한 타입 정의
 * 2. 기본값 - 환경 변수가 없을 때의 기본값 제공
 * 3. 유효성 검사 - 필수 환경 변수 확인 및 형식 검증
 * 4. 문서화 - 각 환경 변수의 목적과 요구사항 문서화
 */

/**
 * 애플리케이션 환경 설정 인터페이스
 */
export interface AppConfig {
  // 기본 설정
  NODE_ENV: 'development' | 'production' | 'test';
  API_BASE_URL: string;
  
  // API 키 및 외부 서비스 설정
  STRIPE_PUBLIC_KEY?: string;
  KAKAO_MAPS_API_KEY?: string;
  
  // 앱 설정
  MAX_UPLOAD_SIZE_MB: number;
  DEFAULT_PAGE_SIZE: number;
  ENABLE_ANALYTICS: boolean;
  
  // 인증 관련 설정
  AUTH_COOKIE_NAME: string;
  
  // 캐시 관련 설정
  CACHE_STALE_TIME_MS: number;
  CACHE_GC_TIME_MS: number;
}

/**
 * 환경 변수와 기본값을 결합하여 애플리케이션 설정 생성
 */
const config: AppConfig = {
  // 기본 설정
  NODE_ENV: (import.meta.env.MODE || 'development') as AppConfig['NODE_ENV'],
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  
  // API 키 및 외부 서비스 설정
  STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
  KAKAO_MAPS_API_KEY: import.meta.env.VITE_KAKAO_MAPS_API_KEY,
  
  // 앱 설정
  MAX_UPLOAD_SIZE_MB: parseInt(import.meta.env.VITE_MAX_UPLOAD_SIZE_MB || '5'),
  DEFAULT_PAGE_SIZE: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || '10'),
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  
  // 인증 관련 설정
  AUTH_COOKIE_NAME: import.meta.env.VITE_AUTH_COOKIE_NAME || 'talez.sid',
  
  // 캐시 관련 설정
  CACHE_STALE_TIME_MS: parseInt(import.meta.env.VITE_CACHE_STALE_TIME_MS || (5 * 60 * 1000).toString()), // 기본 5분
  CACHE_GC_TIME_MS: parseInt(import.meta.env.VITE_CACHE_GC_TIME_MS || (30 * 60 * 1000).toString()), // 기본 30분
};

/**
 * 필수 환경 변수 검증
 * 개발 환경에서만 콘솔 경고를 표시합니다.
 */
function validateConfig() {
  if (config.NODE_ENV === 'development') {
    // KAKAO_MAPS_API_KEY가 없으면 지도 기능에 문제가 발생할 수 있음
    if (!config.KAKAO_MAPS_API_KEY) {
      console.warn('⚠️ Missing environment variable: VITE_KAKAO_MAPS_API_KEY');
    }
    
    // 결제 기능을 사용하는 경우 STRIPE_PUBLIC_KEY가 필요함
    if (!config.STRIPE_PUBLIC_KEY) {
      console.warn('⚠️ Missing environment variable: VITE_STRIPE_PUBLIC_KEY');
    }
  }
}

// 개발 환경에서만 환경 변수 검증 실행
if (config.NODE_ENV === 'development') {
  validateConfig();
}

export default config;