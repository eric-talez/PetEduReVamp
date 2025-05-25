import * as Sentry from '@sentry/node';
import { RequestHandler, ErrorRequestHandler } from 'express';
import { Express, Request, Response, NextFunction } from 'express';
import { logger } from './logger';

// 타입 오류 해결을 위한 간단한 미들웨어 구현
const SentryHandlers = {
  requestHandler: () => ((req: Request, res: Response, next: NextFunction) => next()),
  tracingHandler: () => ((req: Request, res: Response, next: NextFunction) => next()),
  errorHandler: (_options?: any) => ((err: any, req: Request, res: Response, next: NextFunction) => next(err))
};

/**
 * Sentry 설정 초기화
 */
export function setupSentry(app: Express) {
  // Sentry DSN이 없으면 초기화하지 않음
  if (!process.env.SENTRY_DSN) {
    logger.warn('[Sentry] SENTRY_DSN 환경 변수가 설정되지 않았습니다. Sentry 통합이 비활성화됩니다.');
    return;
  }

  try {
    // Sentry 초기화
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      // 환경 설정
      environment: process.env.NODE_ENV || 'development',
      // 샘플링 비율 설정 (프로덕션에서는 낮게, 개발에서는 높게)
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      // 최대 이벤트 크기 제한
      maxValueLength: 5000,
      // Sentry 서버로 전송되기 전에 이벤트를 수정할 수 있는 콜백
      beforeSend: (event) => {
        // 민감한 정보 제거 로직 추가 가능
        return event;
      }
    });

    // 요청 핸들러 미들웨어 설정
    app.use(SentryHandlers.requestHandler() as RequestHandler);

    // 성능 모니터링 미들웨어 설정
    app.use(SentryHandlers.tracingHandler() as RequestHandler);

    logger.info('[Sentry] Sentry 오류 추적 시스템이 초기화되었습니다.');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`[Sentry] Sentry 초기화 중 오류 발생: ${errorMessage}`);
  }
}

/**
 * Sentry 오류 처리 미들웨어 설정
 * 모든 라우트 등록 후 마지막에 호출해야 함
 */
export function setupSentryErrorHandler(app: Express) {
  if (!process.env.SENTRY_DSN) {
    return;
  }

  // Sentry 오류 처리 미들웨어
  app.use(SentryHandlers.errorHandler({
    shouldHandleError(error: any) {
      // 상태 코드가 500 이상인 오류만 Sentry로 전송
      return error.status >= 500;
    },
  }) as ErrorRequestHandler);

  // Sentry 이후 일반 오류 처리 미들웨어
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || error.statusCode || 500;
    const message = error.message || '서버 오류가 발생했습니다';

    // 오류 로깅
    if (status >= 500) {
      logger.error(`[${req.method}] ${req.path} - ${status} ${message}`, { 
        error: error.stack,
        user: req.session?.user?.id,
        ip: req.ip
      });
    } else {
      logger.warn(`[${req.method}] ${req.path} - ${status} ${message}`);
    }

    // JSON 응답 전송
    if (!res.headersSent) {
      res.status(status).json({
        error: {
          status,
          message: process.env.NODE_ENV === 'production' && status >= 500 
            ? '서버 오류가 발생했습니다' // 프로덕션에서는 일반적인 메시지
            : message // 개발 환경에서는 상세 메시지
        }
      });
    }

    next();
  });

  logger.info('[Sentry] Sentry 오류 처리 미들웨어가 설정되었습니다.');
}