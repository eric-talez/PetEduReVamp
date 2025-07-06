import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

// 로깅 설정
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// 커스텀 에러 클래스
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 비즈니스 로직 에러
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource}을(를) 찾을 수 없습니다.`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = '인증이 필요합니다.') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = '접근 권한이 없습니다.') {
    super(message, 403);
  }
}

// 글로벌 에러 핸들러
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode = 500, message } = error as any;

  // 개발 환경에서는 스택 트레이스 포함
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // 에러 로깅
  logger.error({
    message: error.message,
    stack: error.stack,
    statusCode,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // 데이터베이스 에러 처리
  if (error.name === 'MongoError' || error.name === 'ValidationError') {
    statusCode = 400;
    message = '데이터 처리 중 오류가 발생했습니다.';
  }

  // JWT 에러 처리
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = '유효하지 않은 토큰입니다.';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = '토큰이 만료되었습니다.';
  }

  // 응답 전송
  res.status(statusCode).json({
    success: false,
    message,
    ...(isDevelopment && { stack: error.stack })
  });
};

// 404 핸들러
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `요청하신 경로 ${req.originalUrl}을 찾을 수 없습니다.`
  });
};

// 비동기 함수 래퍼
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};