// Production 환경 보안 설정
import { Express } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export function setupProductionSecurity(app: Express) {
  // Helmet 보안 헤더 설정
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://dapi.kakao.com", "https://developers.kakao.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "https://dapi.kakao.com", "wss:", "ws:"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        workerSrc: ["'self'", "blob:"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));

  // 강화된 Rate Limiting
  const strictRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 100, // IP당 최대 100개 요청
    message: {
      error: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
      retryAfter: "15분"
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // API별 세분화된 Rate Limiting
  const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 로그인 시도 제한
    skipSuccessfulRequests: true,
    message: {
      error: "로그인 시도가 너무 많습니다. 15분 후 다시 시도해주세요."
    }
  });

  const apiRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1분
    max: 60, // API 호출 제한
    message: {
      error: "API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
    }
  });

  // Rate Limiting 적용
  app.use('/api/auth', authRateLimit);
  app.use('/api', apiRateLimit);
  app.use(strictRateLimit);

  // 추가 보안 설정
  app.disable('x-powered-by');
  
  console.log('🛡️ Production 보안 설정이 완료되었습니다.');
}