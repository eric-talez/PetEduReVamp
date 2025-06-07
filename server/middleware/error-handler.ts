import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// 표준 API 응답 인터페이스
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

// 커스텀 에러 클래스
export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(statusCode: number, code: string, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'ApiError';
  }

  static badRequest(message: string, details?: any): ApiError {
    return new ApiError(400, 'BAD_REQUEST', message, details);
  }

  static unauthorized(message: string = '인증이 필요합니다'): ApiError {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message: string = '접근 권한이 없습니다'): ApiError {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(message: string = '요청한 리소스를 찾을 수 없습니다'): ApiError {
    return new ApiError(404, 'NOT_FOUND', message);
  }

  static conflict(message: string, details?: any): ApiError {
    return new ApiError(409, 'CONFLICT', message, details);
  }

  static validationError(message: string, details?: any): ApiError {
    return new ApiError(422, 'VALIDATION_ERROR', message, details);
  }

  static internalError(message: string = '서버 내부 오류가 발생했습니다'): ApiError {
    return new ApiError(500, 'INTERNAL_ERROR', message);
  }
}

// 성공 응답 헬퍼
export const successResponse = <T>(data: T, meta?: any): ApiResponse<T> => ({
  success: true,
  data,
  meta: {
    timestamp: new Date().toISOString(),
    ...meta
  }
});

// 에러 응답 헬퍼
export const errorResponse = (error: ApiError | Error, requestId?: string): ApiResponse => {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId
      }
    };
  }

  // 일반 에러인 경우
  return {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'development' ? error.message : '서버 내부 오류가 발생했습니다'
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId
    }
  };
};

// Zod 검증 에러 처리
export const handleZodError = (error: z.ZodError): ApiError => {
  const details = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));

  return ApiError.validationError('입력 데이터 검증에 실패했습니다', details);
};

// 글로벌 에러 핸들러 미들웨어
export const errorHandler = (err: any, req: any, res: any, next: any) => {
  const timestamp = new Date().toISOString();
  const requestId = req.headers['x-request-id'] || Math.random().toString(36).substr(2, 9);

  console.error(`[에러] ${timestamp} [${requestId}] ${req.method} ${req.url}:`, {
    message: err.message,
    stack: err.stack,
    body: req.body,
    query: req.query,
    headers: req.headers
  });

  // 특정 에러 타입별 처리
  let statusCode = 500;
  let message = '서버 내부 오류가 발생했습니다';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = '입력 데이터가 올바르지 않습니다';
  } else if (err.name === 'UnauthorizedError' || err.status === 401) {
    statusCode = 401;
    message = '인증이 필요합니다';
  } else if (err.name === 'ForbiddenError' || err.status === 403) {
    statusCode = 403;
    message = '접근 권한이 없습니다';
  } else if (err.name === 'NotFoundError' || err.status === 404) {
    statusCode = 404;
    message = '요청한 리소스를 찾을 수 없습니다';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = '데이터베이스 연결에 실패했습니다';
  } else if (err.code === 'ETIMEOUT') {
    statusCode = 504;
    message = '요청 시간이 초과되었습니다';
  }

  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(statusCode).json({
    error: message,
    requestId,
    timestamp,
    ...(isDevelopment && { 
      originalError: err.message,
      stack: err.stack 
    })
  });
};

// 비동기 핸들러 래퍼
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 핸들러
export const notFoundHandler = (req: Request, res: Response): void => {
  const apiError = ApiError.notFound(`경로 ${req.originalUrl}을 찾을 수 없습니다`);
  res.status(apiError.statusCode).json(errorResponse(apiError));
};

// 요청 ID 생성 미들웨어
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  req.id = Math.random().toString(36).substring(2, 15);
  res.setHeader('X-Request-ID', req.id);
  next();
};