
/**
 * 서버 환경 변수 관리 모듈 (프로덕션 강화)
 */

export interface ServerConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  HOST: string;
  DATABASE_URL: string;
  SESSION_SECRET: string;
  SESSION_MAX_AGE_MS: number;
  
  // API 키들
  OPENAI_API_KEY?: string;
  OPENAI_API_TALEZ?: string;
  KAKAO_MAPS_API_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  SENTRY_DSN?: string;
  
  // 보안 설정
  CORS_ORIGIN: string;
  RATE_LIMIT_MAX: number;
  RATE_LIMIT_WINDOW_MS: number;
  MAX_UPLOAD_SIZE_MB: number;
  
  // 로깅 설정
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  LOG_FILE_PATH: string;
  
  // SSL/TLS 설정
  SSL_ENABLED: boolean;
  SSL_KEY_PATH?: string;
  SSL_CERT_PATH?: string;
}

const config: ServerConfig = {
  NODE_ENV: (process.env.NODE_ENV || 'development') as ServerConfig['NODE_ENV'],
  PORT: parseInt(process.env.PORT || '5000'),
  HOST: process.env.HOST || '0.0.0.0',
  
  DATABASE_URL: process.env.DATABASE_URL || '',
  SESSION_SECRET: process.env.SESSION_SECRET || generateSecureSecret(),
  SESSION_MAX_AGE_MS: parseInt(process.env.SESSION_MAX_AGE_MS || (24 * 60 * 60 * 1000).toString()),
  
  // API 키들
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || process.env.OPENAI_API_TALEZ,
  OPENAI_API_TALEZ: process.env.OPENAI_API_TALEZ,
  KAKAO_MAPS_API_KEY: process.env.KAKAO_MAPS_API_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  SENTRY_DSN: process.env.SENTRY_DSN,
  
  // 보안 설정
  CORS_ORIGIN: process.env.CORS_ORIGIN || (config.NODE_ENV === 'production' ? 'https://your-domain.com' : '*'),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || (15 * 60 * 1000).toString()),
  MAX_UPLOAD_SIZE_MB: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '10'),
  
  // 로깅
  LOG_LEVEL: (process.env.LOG_LEVEL || (config.NODE_ENV === 'production' ? 'warn' : 'info')) as ServerConfig['LOG_LEVEL'],
  LOG_FILE_PATH: process.env.LOG_FILE_PATH || './logs/application.log',
  
  // SSL
  SSL_ENABLED: process.env.SSL_ENABLED === 'true',
  SSL_KEY_PATH: process.env.SSL_KEY_PATH,
  SSL_CERT_PATH: process.env.SSL_CERT_PATH,
};

function generateSecureSecret(): string {
  if (config.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be set in production environment');
  }
  return 'development-secret-key-change-in-production';
}

function validateConfig() {
  const requiredVars: Array<keyof ServerConfig> = ['DATABASE_URL'];
  
  if (config.NODE_ENV === 'production') {
    requiredVars.push('SESSION_SECRET', 'CORS_ORIGIN');
  }
  
  const missingVars = requiredVars.filter(key => !config[key]);
  
  if (missingVars.length > 0) {
    const message = `Missing required environment variables: ${missingVars.join(', ')}`;
    
    if (config.NODE_ENV === 'production') {
      throw new Error(message);
    } else {
      console.warn(`⚠️ ${message}`);
    }
  }
  
  // 프로덕션 환경 특별 검증
  if (config.NODE_ENV === 'production') {
    if (config.SESSION_SECRET === 'development-secret-key-change-in-production') {
      throw new Error('Default session secret detected in production. Please set SESSION_SECRET environment variable.');
    }
    
    if (config.CORS_ORIGIN === '*') {
      console.warn('⚠️ CORS is set to allow all origins in production. Consider restricting it.');
    }
  }
}

validateConfig();

export default config;
