import { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { logger } from '../monitoring/logger';

/**
 * 보안 설정 초기화
 */
export function setupSecurity(app: Express) {
  // Helmet 보안 헤더 설정 - Google Maps API 지원
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'", 
          "'unsafe-inline'", 
          "'unsafe-eval'",
          "https://ka-f.fontawesome.com",
          "https://static.nid.naver.com",
          "https://developers.kakao.com",
          "https://dapi.kakao.com",
          "https://maps.googleapis.com",
          "https://maps.gstatic.com",
          "https://*.googleapis.com",
          "https://replit.com",
          "https://*.replit.com",
          "https://*.replit.app"
        ],
        styleSrc: [
          "'self'", 
          "'unsafe-inline'", 
          "https://fonts.googleapis.com",
          "https://cdn.jsdelivr.net"
        ],
        imgSrc: [
          "'self'", 
          "data:", 
          "https:", 
          "blob:",
          "https://maps.googleapis.com",
          "https://maps.gstatic.com",
          "https://*.gstatic.com",
          "https://*.googleapis.com"
        ],
        fontSrc: [
          "'self'", 
          "https://fonts.gstatic.com", 
          "https://ka-f.fontawesome.com",
          "https://cdn.jsdelivr.net"
        ],
        connectSrc: [
          "'self'", 
          "https://api.openai.com", 
          "https://kauth.kakao.com", 
          "https://nid.naver.com",
          "https://maps.googleapis.com",
          "https://*.googleapis.com",
          "wss:", 
          "ws:"
        ],
        frameSrc: [
          "'self'", 
          "https://drive.google.com", 
          "https://youtube.com", 
          "https://www.youtube.com"
        ]
      }
    },
    crossOriginEmbedderPolicy: false // iframe 사용을 위해 필요
  }));

  // 쿠키 파서 설정
  app.use(cookieParser());

  // CSRF 토큰 확인 미들웨어
  app.use((req: Request, res: Response, next: NextFunction) => {
    // POST 요청에만 CSRF 보호 적용 (GET 요청은 제외)
    // API 요청에는 적용, 내부 관리자 경로에는 추가 검증
    if (req.method === 'POST' && req.path.startsWith('/api/admin')) {
      const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;
      const storedToken = req.cookies['csrf-token'];

      if (!csrfToken || !storedToken || csrfToken !== storedToken) {
        logger.warn(`CSRF 토큰 검증 실패: ${req.path}`);
        return res.status(403).json({ message: '유효하지 않은 CSRF 토큰' });
      }
    }
    next();
  });

  // Rate limiting 설정
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 100, // IP당 최대 요청 수
    standardHeaders: true,
    legacyHeaders: false,
    message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
  });

  // API 요청에 rate limiting 적용
  app.use('/api/', apiLimiter);

  // 로그인 요청에 더 엄격한 rate limiting 적용
  const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1시간
    max: 10, // IP당 최대 요청 수
    standardHeaders: true,
    legacyHeaders: false,
    message: '너무 많은 로그인 시도가 발생했습니다. 1시간 후 다시 시도해주세요.'
  });

  app.use('/api/login', loginLimiter);
  app.use('/api/auth/kakao/callback', loginLimiter);
  app.use('/api/auth/naver/callback', loginLimiter);

  // XSS 방지를 위한 응답 헤더 설정
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });

  logger.info('[Security] 보안 설정이 초기화되었습니다.');
}