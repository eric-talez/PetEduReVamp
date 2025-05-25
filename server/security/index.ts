import { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from '../config';

/**
 * 보안 설정 초기화
 */
export function setupSecurity(app: Express) {
  // Helmet을 사용하여 보안 관련 HTTP 헤더 설정
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://dapi.kakao.com", "https://t1.daumcdn.net", "https://developers.kakao.com", "https://maps.googleapis.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://*.kakao.com", "https://*.daumcdn.net", "https://*.naver.com", "https://maps.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://api.talez.co.kr", "https://kauth.kakao.com", "https://nid.naver.com"],
      },
    },
    // 개발 환경에서는 CSP를 비활성화할 수 있음
    ...(config.NODE_ENV === 'development' ? { contentSecurityPolicy: false } : {}),
  }));
  
  // CORS 설정
  app.use(cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://talez.co.kr',
        'https://www.talez.co.kr',
        'https://store.funnytalez.com'
      ];
      
      // 개발 환경에서는 모든 오리진 허용
      if (config.NODE_ENV === 'development' || !origin) {
        return callback(null, true);
      }
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy violation'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  
  // 쿠키 파서 설정
  app.use(cookieParser(config.SESSION_SECRET));
  
  // 요청 본문 크기 제한
  app.use(express.json({ limit: `${config.MAX_UPLOAD_SIZE_MB}mb` }));
  app.use(express.urlencoded({ extended: true, limit: `${config.MAX_UPLOAD_SIZE_MB}mb` }));
  
  // API 요청 속도 제한
  const apiLimiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS, // 제한 기간 (기본 15분)
    max: config.RATE_LIMIT_MAX, // 기간 내 최대 요청 수 (기본 100)
    standardHeaders: true, // `RateLimit-*` 헤더 포함
    legacyHeaders: false, // `X-RateLimit-*` 헤더 비활성화
    message: { error: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.' }
  });
  
  // API 경로에만 속도 제한 적용
  app.use('/api/', apiLimiter);
  
  // XSS 공격 보호를 위한 미들웨어
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
  
  // 요청 ID 미들웨어 (추적 및 로깅 목적)
  app.use((req: Request, res: Response, next: NextFunction) => {
    const requestId = Math.random().toString(36).substring(2, 15);
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
  });
  
  console.log('[Security] 보안 설정이 완료되었습니다.');
}