import { Express, Request, Response, NextFunction } from 'express';
import compression from 'compression';
import { logger } from '../monitoring/logger';

/**
 * 성능 최적화 설정을 초기화합니다.
 */
export function setupPerformance(app: Express) {
  // 응답 압축 설정
  app.use(compression({
    filter: (req, res) => {
      // 작은 응답이나 이미지/비디오는 압축하지 않음
      if (req.headers['x-no-compression'] || res.getHeader('Content-Type')?.toString().includes('image/') || res.getHeader('Content-Type')?.toString().includes('video/')) {
        return false;
      }
      return compression.filter(req, res);
    },
    threshold: 1024 // 1KB 이상인 응답만 압축
  }));

  // 요청 지연 시간 측정 미들웨어
  app.use((req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    // 응답 완료 시 지연 시간 기록
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      
      // API 요청만 로깅
      if (req.path.startsWith('/api/')) {
        // 200ms 이상 걸린 요청만 로깅
        if (duration > 200) {
          logger.warn(`[성능] 느린 요청 감지: ${req.method} ${req.path} - ${duration}ms`);
        } else {
          logger.debug(`[성능] 요청 처리 시간: ${req.method} ${req.path} - ${duration}ms`);
        }
      }
    });
    
    next();
  });

  // 캐시 제어 헤더 설정
  app.use((req: Request, res: Response, next: NextFunction) => {
    // 정적 자산에 대한 캐시 설정
    if (req.path.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      // 30일 캐싱
      res.setHeader('Cache-Control', 'public, max-age=2592000');
    } else if (req.path.startsWith('/api/')) {
      // API 응답은 캐싱하지 않음
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    
    next();
  });
  
  logger.info('[Performance] 성능 최적화 설정이 초기화되었습니다.');
}

/**
 * 메모리 사용량 모니터링
 */
export function monitorMemoryUsage() {
  const CHECK_INTERVAL = 5 * 60 * 1000; // 5분마다 체크
  const WARNING_THRESHOLD = 80; // 80% 이상 사용 시 경고
  const CRITICAL_THRESHOLD = 90; // 90% 이상 사용 시 위험
  
  setInterval(() => {
    const memoryUsage = process.memoryUsage();
    const usedHeapRatio = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    
    if (usedHeapRatio > CRITICAL_THRESHOLD) {
      logger.error(`[성능] 메모리 사용량 위험 수준: ${usedHeapRatio.toFixed(2)}% (${formatBytes(memoryUsage.heapUsed)} / ${formatBytes(memoryUsage.heapTotal)})`);
      // 가비지 컬렉션 강제 실행 시도
      if (global.gc) {
        global.gc();
        logger.info('[성능] 가비지 컬렉션 강제 실행');
      }
    } else if (usedHeapRatio > WARNING_THRESHOLD) {
      logger.warn(`[성능] 메모리 사용량 경고 수준: ${usedHeapRatio.toFixed(2)}% (${formatBytes(memoryUsage.heapUsed)} / ${formatBytes(memoryUsage.heapTotal)})`);
    } else {
      logger.debug(`[성능] 메모리 사용량 정상: ${usedHeapRatio.toFixed(2)}% (${formatBytes(memoryUsage.heapUsed)} / ${formatBytes(memoryUsage.heapTotal)})`);
    }
  }, CHECK_INTERVAL);
  
  logger.info('[Performance] 메모리 사용량 모니터링이 시작되었습니다.');
}

/**
 * 바이트 단위를 읽기 쉬운 형식으로 변환
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}