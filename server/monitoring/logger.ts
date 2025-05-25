import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { config } from '../config';
import fs from 'fs';

// 로그 디렉토리 생성
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 로그 포맷 정의
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// 콘솔 출력용 포맷
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(
    info => `${info.timestamp} ${info.level}: ${info.message} ${info.stack || ''}`
  )
);

// 로거 생성
export const logger = createLogger({
  level: config.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'talez-api' },
  transports: [
    // 콘솔 출력
    new transports.Console({
      format: consoleFormat,
    }),
    // 일별 로테이션 파일 (모든 로그)
    new transports.DailyRotateFile({
      filename: path.join(logDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
    // 오류 로그만 별도 파일에 저장
    new transports.DailyRotateFile({
      filename: path.join(logDir, 'errors-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
    }),
  ],
  // 예외 로그 처리
  exceptionHandlers: [
    new transports.DailyRotateFile({
      filename: path.join(logDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
  // 처리되지 않은 거부(reject) 처리
  rejectionHandlers: [
    new transports.DailyRotateFile({
      filename: path.join(logDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
});

// 테스트 환경에서는 콘솔만 사용
if (config.NODE_ENV === 'test') {
  logger.clear();
  logger.add(
    new transports.Console({
      format: consoleFormat,
      level: 'debug',
    })
  );
}

// 로그 미들웨어
export function loggerMiddleware(req: any, res: any, next: any) {
  // 요청 시작 시간
  const startTime = new Date();
  
  // 응답 완료 시 로그 기록
  res.on('finish', () => {
    const responseTime = new Date().getTime() - startTime.getTime();
    
    // 사용자 정보 (인증된 경우)
    const user = req.user ? { id: req.user.id, username: req.user.username } : null;
    
    // 로그 메시지
    const logMessage = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      user: user,
      referer: req.get('referer') || '-',
    };
    
    // 상태 코드에 따라 로그 레벨 결정
    if (res.statusCode >= 500) {
      logger.error('API 요청 오류', logMessage);
    } else if (res.statusCode >= 400) {
      logger.warn('API 요청 경고', logMessage);
    } else {
      logger.info('API 요청 완료', logMessage);
    }
  });
  
  next();
}

export default logger;