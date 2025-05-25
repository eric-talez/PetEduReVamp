import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Express, Request, Response, NextFunction } from 'express';
import config from '../config';
import * as SentryExpress from '@sentry/node';

/**
 * Sentry 초기화 및 설정
 */
export function setupSentry(app: Express) {
  // 개발 환경에서는 Sentry를 비활성화할 수 있음
  if (config.NODE_ENV === 'test') {
    console.log('[Monitoring] Sentry가 테스트 환경에서 비활성화되었습니다.');
    return;
  }

  // SENTRY_DSN이 설정되지 않은 경우 경고만 출력
  if (!process.env.SENTRY_DSN) {
    console.warn('[Monitoring] Sentry DSN이 설정되지 않았습니다. 오류 추적이 비활성화됩니다.');
    return;
  }

  // Sentry 초기화
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: config.NODE_ENV,
    integrations: [
      // 프로파일링 통합 활성화
      nodeProfilingIntegration(),
    ],
    // 성능 추적 샘플링 비율 (0.0 - 1.0)
    tracesSampleRate: config.NODE_ENV === 'production' ? 0.1 : 1.0,
    // 프로파일링 샘플링 비율
    profilesSampleRate: 0.1,
  });

  // 미들웨어 설정
  // 모든 요청에 대해 Sentry 컨텍스트 설정
  app.use(SentryExpress.Handlers.requestHandler());
  // 성능 모니터링을 위한 트랜잭션 미들웨어
  app.use(SentryExpress.Handlers.tracingHandler());

  console.log('[Monitoring] Sentry 설정이 완료되었습니다.');
}

/**
 * Sentry 오류 처리 미들웨어 설정
 * 이 함수는 모든 라우트 등록 후에 호출되어야 함
 */
export function setupSentryErrorHandler(app: Express) {
  // Sentry 오류 처리 미들웨어
  app.use(Sentry.Handlers.errorHandler());

  // Sentry 후 폴백 오류 처리기
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // 이미 응답이 전송된 경우
    if (res.headersSent) {
      return next(err);
    }

    const statusCode = err.statusCode || 500;
    
    // 개발 환경에서는 자세한 오류 정보 제공
    if (config.NODE_ENV === 'development') {
      return res.status(statusCode).json({
        error: {
          message: err.message,
          stack: err.stack,
          details: err
        }
      });
    }
    
    // 프로덕션 환경에서는 최소한의 정보만 제공
    res.status(statusCode).json({
      error: {
        message: statusCode === 500 ? '서버 오류가 발생했습니다.' : err.message
      }
    });
  });
}

/**
 * 사용자 정보를 Sentry 컨텍스트에 추가
 */
export function setUserContext(userId: number, username: string, role: string) {
  Sentry.setUser({
    id: userId.toString(),
    username,
    role
  });
}

/**
 * 사용자 컨텍스트 초기화
 */
export function clearUserContext() {
  Sentry.setUser(null);
}

/**
 * 추가 태그 설정
 */
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
}

/**
 * 사용자 정의 오류 캡처
 */
export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context
  });
}

/**
 * 사용자 정의 메시지 캡처
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) {
  Sentry.captureMessage(message, {
    level,
    extra: context
  });
}