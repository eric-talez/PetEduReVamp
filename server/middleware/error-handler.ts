
import { Request, Response, NextFunction } from 'express';

export interface StandardError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export class ApiError extends Error implements StandardError {
  statusCode: number;
  code: string;
  details?: any;

  constructor(statusCode: number, message: string, code: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'ApiError';
  }
}

// 표준 에러 응답 생성
export function createErrorResponse(error: StandardError, req: Request) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    success: false,
    message: error.message,
    code: error.code || 'UNKNOWN_ERROR',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    ...(isDevelopment && error.details && { details: error.details }),
    ...(isDevelopment && { stack: error.stack })
  };
}

// 글로벌 에러 핸들러
export function globalErrorHandler(
  error: StandardError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('API 에러:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    user: req.user?.id
  });

  const statusCode = error.statusCode || 500;
  const errorResponse = createErrorResponse(error, req);

  res.status(statusCode).json(errorResponse);
}

// 404 핸들러
export function notFoundHandler(req: Request, res: Response) {
  const error = new ApiError(
    404,
    `${req.method} ${req.originalUrl} 경로를 찾을 수 없습니다.`,
    'ROUTE_NOT_FOUND'
  );

  res.status(404).json(createErrorResponse(error, req));
}

// 입력값 검증 에러
export function createValidationError(message: string, details?: any) {
  return new ApiError(400, message, 'VALIDATION_ERROR', details);
}

// 인증 에러
export function createAuthError(message: string = '인증이 필요합니다.') {
  return new ApiError(401, message, 'AUTHENTICATION_REQUIRED');
}

// 권한 에러
export function createPermissionError(message: string = '접근 권한이 없습니다.') {
  return new ApiError(403, message, 'INSUFFICIENT_PERMISSIONS');
}

// 리소스 없음 에러
export function createNotFoundError(resource: string = '리소스') {
  return new ApiError(404, `${resource}를 찾을 수 없습니다.`, 'RESOURCE_NOT_FOUND');
}

// 중복 데이터 에러
export function createConflictError(message: string) {
  return new ApiError(409, message, 'RESOURCE_CONFLICT');
}
