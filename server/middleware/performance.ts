import { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// GZIP 압축 설정
export const compressionMiddleware = compression({
  filter: (req, res) => {
    // 이미 압축된 컨텐츠는 제외
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // 압축 레벨 (1-9, 6이 기본값)
  threshold: 1024 // 1KB 이상일 때만 압축
});

// Rate Limiting 설정
export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100 요청
  message: {
    error: '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.',
    resetTime: new Date(Date.now() + 15 * 60 * 1000).toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // 정적 파일은 제외
    return req.url.startsWith('/static') || req.url.startsWith('/assets');
  }
});

// API 전용 Rate Limiting (더 엄격)
export const apiRateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 50, // 최대 50 요청
  message: {
    error: 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
    resetTime: new Date(Date.now() + 15 * 60 * 1000).toISOString()
  }
});

// 응답 시간 측정 미들웨어
export const responseTimeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    // 느린 요청 로깅 (500ms 이상)
    if (responseTime > 500) {
      console.warn(`[SLOW REQUEST] ${req.method} ${req.url} - ${responseTime}ms`);
    }
    
    // 응답 헤더에 처리 시간 추가
    res.set('X-Response-Time', `${responseTime}ms`);
  });
  
  next();
};

// 캐시 제어 미들웨어
export const cacheControlMiddleware = (maxAge: number = 3600) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 정적 파일은 캐시
    if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
      res.set('Cache-Control', `public, max-age=${maxAge}`);
    } else {
      // API 응답은 캐시하지 않음
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
    }
    next();
  };
};

// 메모리 사용량 모니터링
export const memoryMonitorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const memUsage = process.memoryUsage();
  const memUsageMB = {
    rss: Math.round(memUsage.rss / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    external: Math.round(memUsage.external / 1024 / 1024)
  };
  
  // 메모리 사용량이 500MB를 초과하면 경고
  if (memUsageMB.heapUsed > 500) {
    console.warn(`[HIGH MEMORY USAGE] ${memUsageMB.heapUsed}MB used`);
  }
  
  // 응답 헤더에 메모리 정보 추가 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    res.set('X-Memory-Usage', JSON.stringify(memUsageMB));
  }
  
  next();
};

// 요청 로깅 미들웨어
export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - ${ip} - ${userAgent}`);
  
  next();
};