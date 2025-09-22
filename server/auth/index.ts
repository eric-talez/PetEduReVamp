/**
 * auth/index.ts
 * 인증 관련 모듈들을 통합
 */
import { Express, Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import { hashPassword, setupLocalAuth } from './local-auth';
import { setupSocialAuth } from './social-auth';
import { storage } from '../storage';
import { User as SelectUser } from '@shared/schema';
import { UserRole } from '@shared/schema';
import { csrfProtection, getCSRFToken } from '../middleware/csrf';
import { 
  ApiErrorCode, 
  createSuccessResponse,
  UnauthorizedApiError,
  ValidationApiError,
  HTTP_STATUS,
  extendResponse
} from '../middleware/api-standards';

// JWT 설정
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// JWT 토큰 생성
export function generateJwtToken(user: SelectUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// JWT 토큰 검증 미들웨어 (표준화 적용)
export function verifyJwtToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.error(
      ApiErrorCode.AUTHENTICATION_REQUIRED,
      '인증 토큰이 필요합니다.',
      undefined,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.error(
      ApiErrorCode.TOKEN_INVALID,
      '유효하지 않은 토큰입니다.',
      undefined,
      HTTP_STATUS.UNAUTHORIZED
    );
  }
}

// 역할별 권한 체크 미들웨어
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다.',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '접근 권한이 없습니다.',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
}

// Express 애플리케이션에 타입 확장
declare global {
  namespace Express {
    interface User extends SelectUser {}
    interface Session {
      social?: {
        provider: string;
        id: string;
        name: string;
      };
    }
  }
}

/**
 * 인증 관련 설정과 라우트를 등록
 */
export function setupAuth(app: Express, sessionStore?: session.Store) {
  console.log('[Auth] 인증 설정 초기화');
  
  // Passport 초기화
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Passport 직렬화/역직렬화 설정
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });
  
  // 인증 전략 설정
  setupLocalAuth();
  setupSocialAuth(app);
  
  // API 라우트 설정
  setupAuthRoutes(app);
}

/**
 * 인증 관련 API 라우트 설정
 */
function setupAuthRoutes(app: Express) {
  const router = Router();
  
  // API 표준화 미들웨어 적용
  router.use(extendResponse);
  
  // CSRF 토큰 조회 엔드포인트
  router.get('/csrf', getCSRFToken);
  
  // 사용자 인증 상태 확인 (표준화 적용)
  router.get('/me', (req, res) => {
    console.log('세션 확인 - SessionID:', req.sessionID);
    console.log('세션 확인 - 전체 세션:', req.session);
    console.log('세션 확인 - 사용자:', req.user);
    
    if (!req.isAuthenticated()) {
      return res.error(
        ApiErrorCode.AUTHENTICATION_REQUIRED,
        '인증이 필요합니다. 로그인 후 다시 시도해주세요.'
      );
    }
    
    return res.success(req.user, '사용자 정보를 조회했습니다.');
  });
  
  // JWT 로그인 API (CSRF 보호 적용)
  router.post('/login', csrfProtection, (req, res, next) => {
    passport.authenticate('local', (err: Error, user: any, info: { message?: string }) => {
      if (err) {
        console.error('로그인 오류:', err);
        return res.error(
          ApiErrorCode.INTERNAL_SERVER_ERROR,
          '로그인 처리 중 오류가 발생했습니다'
        );
      }
      
      if (!user) {
        return res.error(
          ApiErrorCode.INVALID_CREDENTIALS,
          info?.message || '아이디 또는 비밀번호가 일치하지 않습니다'
        );
      }
      
      // JWT 토큰 생성
      const token = generateJwtToken(user);
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error('로그인 세션 생성 오류:', loginErr);
          return res.error(
            ApiErrorCode.INTERNAL_SERVER_ERROR,
            '로그인 세션 생성 중 오류가 발생했습니다'
          );
        }
        
        // 세션 명시적 저장
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error('세션 저장 오류:', saveErr);
            return res.error(
              ApiErrorCode.INTERNAL_SERVER_ERROR,
              '세션 저장 중 오류가 발생했습니다'
            );
          }
          
          console.log('로그인 성공:', user.username);
          console.log('세션 저장 완료 - SessionID:', req.sessionID);
          return res.success({
            user: {
              id: user.id,
              username: user.username,
              name: user.name,
              email: user.email,
              role: user.role
            },
            token,
            expiresIn: JWT_EXPIRES_IN
          }, '로그인에 성공했습니다.');
        });
      });
    })(req, res, next);
  });
  
  // 로그아웃 API (표준화 적용)
  router.post('/logout', csrfProtection, (req, res) => {
    const wasAuthenticated = req.isAuthenticated();
    
    req.logout((err) => {
      if (err) {
        console.error('로그아웃 오류:', err);
        return res.error(
          ApiErrorCode.INTERNAL_SERVER_ERROR,
          '로그아웃 처리 중 오류가 발생했습니다'
        );
      }
      
      return res.success(
        { wasAuthenticated },
        '로그아웃되었습니다.'
      );
    });
  });
  
  // 회원가입 API (표준화 적용)
  router.post('/register', csrfProtection, async (req, res) => {
    try {
      const { username, password, email, name } = req.body;
      
      // 필수 필드 검증
      if (!username || !password || !email || !name) {
        return res.error(
          ApiErrorCode.MISSING_REQUIRED_FIELD,
          '모든 필수 정보를 입력해주세요'
        );
      }
      
      // 기존 사용자 확인
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.error(
          ApiErrorCode.RESOURCE_ALREADY_EXISTS,
          '이미 사용 중인 아이디입니다'
        );
      }
      
      // 비밀번호 해싱
      const hashedPassword = await hashPassword(password);
      
      // 사용자 생성
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email,
        name,
        role: 'pet-owner' as UserRole,
        verified: false // 이메일 인증 등을 통해 나중에 true로 설정
      });
      
      // 자동 로그인
      req.login(user, (err) => {
        if (err) {
          console.error('회원가입 후 자동 로그인 오류:', err);
          return res.error(
            ApiErrorCode.INTERNAL_SERVER_ERROR,
            '회원가입은 완료되었으나 자동 로그인 중 오류가 발생했습니다'
          );
        }
        
        console.log('회원가입 및 자동 로그인 성공:', user.username);
        return res.success(user, '회원가입에 성공했습니다.', HTTP_STATUS.CREATED);
      });
    } catch (error) {
      console.error('회원가입 오류:', error);
      return res.error(
        ApiErrorCode.INTERNAL_SERVER_ERROR,
        '회원가입 처리 중 오류가 발생했습니다'
      );
    }
  });
  
  // CSRF 토큰 조회 API
  router.get('/csrf', (req, res) => {
    try {
      getCSRFToken(req, res);
    } catch (error) {
      console.error('CSRF 토큰 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: 'CSRF 토큰 조회 중 오류가 발생했습니다.'
      });
    }
  });
  
  // 소셜 로그인 라우트는 setupSocialAuth에서 설정됨
  
  // 라우터를 /api/auth 경로에 마운트
  app.use('/api/auth', router);
  
  console.log('[Auth] 인증 라우트 등록 완료');
}