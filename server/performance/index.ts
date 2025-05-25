import { Express, Request, Response, NextFunction } from 'express';
import compression from 'compression';
import { logger } from '../monitoring/logger';
import config from '../config';

/**
 * 성능 최적화 설정을 초기화합니다.
 */
export function setupPerformance(app: Express) {
  // 응답 압축 미들웨어 설정
  app.use(compression({
    // 1KB 이상의 응답만 압축
    threshold: 1024,
    // 압축 레벨 (1-9, 높을수록 더 많이 압축되지만 CPU 사용량 증가)
    level: 6,
    // 압축하지 않을 MIME 타입
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      // 이미 압축된 형식은 제외
      const contentType = res.getHeader('Content-Type') as string || '';
      return !/^(image|audio|video|application\/(zip|gzip|x-compressed))/.test(contentType);
    }
  }));

  // 캐시 제어 미들웨어
  app.use((req: Request, res: Response, next: NextFunction) => {
    // 정적 자산에 대한 캐시 설정
    const url = req.url;
    if (url.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      // 1주일 동안 캐시
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    } else if (url.startsWith('/api/')) {
      // API 응답은 캐시하지 않음
      res.setHeader('Cache-Control', 'no-store');
    } else {
      // 다른 콘텐츠는 짧은 시간 동안 캐시
      res.setHeader('Cache-Control', 'public, max-age=60');
    }
    next();
  });

  // 성능 측정 미들웨어
  app.use((req: Request, res: Response, next: NextFunction) => {
    // 요청 시작 시간 기록
    const startTime = Date.now();
    
    // 응답 완료 이벤트에 리스너 추가
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const url = req.originalUrl || req.url;
      const method = req.method;
      const status = res.statusCode;
      
      // 느린 요청 로깅 (200ms 이상)
      if (duration > 200) {
        logger.warn(`느린 요청 감지: ${method} ${url} - ${status} - ${duration}ms`);
      }
      
      // 디버그 모드에서 모든 요청의 성능 로깅
      if (config.LOG_LEVEL === 'debug') {
        logger.debug(`요청 성능: ${method} ${url} - ${status} - ${duration}ms`);
      }
    });
    
    next();
  });

  console.log('[Performance] 성능 최적화 설정이 완료되었습니다.');
}

/**
 * 메모리 사용량 모니터링
 */
export function monitorMemoryUsage() {
  setInterval(() => {
    const memoryUsage = process.memoryUsage();
    const used = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const total = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    const rss = Math.round(memoryUsage.rss / 1024 / 1024);
    
    logger.info(`메모리 사용량: 사용=${used}MB, 힙=${total}MB, RSS=${rss}MB`);
    
    // 메모리 사용량이 높을 경우 경고
    if (used > 1024) { // 1GB 이상일 경우
      logger.warn(`높은 메모리 사용량 감지: ${used}MB`);
    }
  }, 5 * 60 * 1000); // 5분마다 체크
  
  console.log('[Performance] 메모리 사용량 모니터링이 시작되었습니다.');
}