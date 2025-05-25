import { Express } from 'express';
import { setupSentry, setupSentryErrorHandler } from './sentry';
import { loggerMiddleware } from './logger';

/**
 * 모니터링 및 로깅 시스템 설정
 */
export function setupMonitoring(app: Express) {
  // Sentry 오류 추적 설정
  setupSentry(app);
  
  // 로깅 미들웨어 추가
  app.use(loggerMiddleware);
  
  console.log('[Monitoring] 모니터링 및 로깅 시스템이 초기화되었습니다.');
}

/**
 * 오류 처리 미들웨어 설정
 * 모든 라우트 등록 후 마지막에 호출해야 함
 */
export function setupErrorHandling(app: Express) {
  // Sentry 오류 처리 미들웨어 설정
  setupSentryErrorHandler(app);
  
  console.log('[Monitoring] 오류 처리 미들웨어가 설정되었습니다.');
}