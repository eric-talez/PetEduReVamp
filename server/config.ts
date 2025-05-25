/**
 * 서버 환경 변수 관리 모듈
 * 
 * 이 모듈은 서버의 환경 설정을 중앙 집중화하여 관리합니다.
 * - 타입 안전성: 모든 설정에 타입 정의
 * - 기본값: 환경 변수가 없을 때 사용할 기본값 제공
 * - 유효성 검사: 필수 환경 변수 확인
 */

// 서버 환경 설정 인터페이스
export interface ServerConfig {
  // 서버 기본 설정
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  HOST: string;
  
  // 데이터베이스 설정
  DATABASE_URL: string;
  
  // 세션 및 보안 설정
  SESSION_SECRET: string;
  SESSION_MAX_AGE_MS: number;
  
  // 외부 API 키
  OPENAI_API_KEY?: string;
  KAKAO_MAPS_API_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  SENTRY_DSN?: string;
  
  // 성능 및 제한 설정
  MAX_UPLOAD_SIZE_MB: number;
  RATE_LIMIT_MAX: number;
  RATE_LIMIT_WINDOW_MS: number;
  
  // 로깅 설정
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * 환경 변수와 기본값을 결합하여 서버 설정 생성
 */
const config: ServerConfig = {
  // 서버 기본 설정
  NODE_ENV: (process.env.NODE_ENV || 'development') as ServerConfig['NODE_ENV'],
  PORT: parseInt(process.env.PORT || '5000'),
  HOST: process.env.HOST || '0.0.0.0',
  
  // 데이터베이스 설정
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  // 세션 및 보안 설정
  SESSION_SECRET: process.env.SESSION_SECRET || 'talez-platform-secret-key',
  SESSION_MAX_AGE_MS: parseInt(process.env.SESSION_MAX_AGE_MS || (24 * 60 * 60 * 1000).toString()), // 기본 24시간
  
  // 외부 API 키
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  KAKAO_MAPS_API_KEY: process.env.KAKAO_MAPS_API_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  SENTRY_DSN: process.env.SENTRY_DSN,
  
  // 성능 및 제한 설정
  MAX_UPLOAD_SIZE_MB: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '50'),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || (15 * 60 * 1000).toString()), // 기본 15분
  
  // 로깅 설정
  LOG_LEVEL: (process.env.LOG_LEVEL || 'info') as ServerConfig['LOG_LEVEL'],
};

/**
 * 필수 환경 변수 검증
 * 개발 환경에서는 경고만 표시하고, 프로덕션 환경에서는 오류 발생
 */
function validateConfig() {
  const requiredVars: Array<keyof ServerConfig> = ['DATABASE_URL'];
  const missingVars = requiredVars.filter(key => !config[key]);
  
  if (missingVars.length > 0) {
    const message = `Missing required environment variables: ${missingVars.join(', ')}`;
    
    if (config.NODE_ENV === 'production') {
      throw new Error(message);
    } else {
      console.warn(`⚠️ ${message}`);
    }
  }
  
  // 외부 API 키 관련 경고 (개발 환경에서만)
  if (config.NODE_ENV === 'development') {
    const optionalApiKeys: Array<keyof ServerConfig> = ['OPENAI_API_KEY', 'KAKAO_MAPS_API_KEY', 'STRIPE_SECRET_KEY'];
    const missingApiKeys = optionalApiKeys.filter(key => !config[key]);
    
    if (missingApiKeys.length > 0) {
      console.warn(`⚠️ Missing optional API keys: ${missingApiKeys.join(', ')}`);
    }
  }
}

// 환경 변수 검증 실행
validateConfig();

export default config;