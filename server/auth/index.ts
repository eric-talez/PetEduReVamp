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

// JWT 설정 - 프로덕션에서 반드시 환경 변수 필요
const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET: string = process.env.JWT_SECRET || (isProduction ? '' : 'dev-only-insecure-jwt-secret-do-not-use-in-production');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (isProduction && !process.env.JWT_SECRET) {
  console.error('❌ [프로덕션] JWT_SECRET 환경 변수가 설정되지 않았습니다.');
  console.error('   Replit Secrets에서 JWT_SECRET을 설정해주세요.');
  process.exit(1);
}

if (!isProduction && !process.env.JWT_SECRET) {
  console.warn('⚠️ [개발] JWT_SECRET이 설정되지 않아 임시 키를 사용합니다.');
  console.warn('   프로덕션 배포 전 반드시 Secrets에서 JWT_SECRET을 설정하세요.');
}

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
        
        // 세션에 사용자 정보 저장 (req.session.user로 접근 가능하도록)
        req.session.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          instituteId: user.instituteId
        };
        
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
  
  // 퀵로그인 API (테스트/데모 용도) - CSRF 보호 적용
  router.post('/quick-login', csrfProtection, async (req, res) => {
    try {
      const { role } = req.body;
      
      // 허용된 역할 확인
      const allowedRoles = ['pet-owner', 'trainer', 'institute-admin', 'admin'];
      if (!role || !allowedRoles.includes(role)) {
        return res.error(
          ApiErrorCode.VALIDATION_ERROR,
          '유효하지 않은 역할입니다.',
          { validRoles: allowedRoles }
        );
      }
      
      // 역할별 테스트 사용자 매핑
      const testUsernames: Record<string, string> = {
        'pet-owner': 'test_owner',
        'trainer': 'test_trainer',
        'institute-admin': 'institute01',
        'admin': 'admin'
      };
      
      const username = testUsernames[role];
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.error(
          ApiErrorCode.RESOURCE_NOT_FOUND,
          `테스트 사용자를 찾을 수 없습니다: ${username}`,
          { role, username }
        );
      }
      
      // 세션 생성
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error('[QuickLogin] 세션 생성 오류:', loginErr);
          return res.error(
            ApiErrorCode.INTERNAL_SERVER_ERROR,
            '로그인 세션 생성 중 오류가 발생했습니다'
          );
        }
        
        // 세션에 사용자 정보 저장 (req.session.user로 접근 가능하도록)
        req.session.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          instituteId: user.instituteId
        };
        
        // 세션 명시적 저장
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error('[QuickLogin] 세션 저장 오류:', saveErr);
            return res.error(
              ApiErrorCode.INTERNAL_SERVER_ERROR,
              '세션 저장 중 오류가 발생했습니다'
            );
          }
          
          console.log(`[QuickLogin] 퀵로그인 성공: ${user.username} (${user.role})`);
          console.log('[QuickLogin] 세션 저장 완료 - SessionID:', req.sessionID);
          
          // JWT 토큰 생성
          const token = generateJwtToken(user);
          
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
          }, `퀵로그인에 성공했습니다 (${user.role}).`);
        });
      });
    } catch (error) {
      console.error('[QuickLogin] 퀵로그인 오류:', error);
      return res.error(
        ApiErrorCode.INTERNAL_SERVER_ERROR,
        '퀵로그인 처리 중 오류가 발생했습니다'
      );
    }
  });
  
  // 회원가입 API (표준화 적용)
  router.post('/register', csrfProtection, async (req, res) => {
    try {
      const { username, password, email, name, phoneNumber, birthDate, gender, role } = req.body;
      
      // 소셜 로그인 정보 확인
      const socialSignup = req.session.socialSignup;
      
      // 필수 필드 검증
      if (!username || !email || !name) {
        return res.error(
          ApiErrorCode.MISSING_REQUIRED_FIELD,
          '모든 필수 정보를 입력해주세요'
        );
      }
      
      // 소셜 로그인이 아닌 경우 비밀번호 필수
      if (!socialSignup && !password) {
        return res.error(
          ApiErrorCode.MISSING_REQUIRED_FIELD,
          '비밀번호를 입력해주세요'
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
      
      // 비밀번호 처리
      let hashedPassword: string;
      if (socialSignup) {
        // 소셜 로그인: 랜덤 비밀번호 생성
        hashedPassword = await hashPassword(Math.random().toString(36).slice(2) + Date.now().toString(36));
      } else {
        // 일반 회원가입: 입력된 비밀번호 해싱
        hashedPassword = await hashPassword(password);
      }
      
      // 사용자 생성
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email,
        name,
        phoneNumber: phoneNumber || undefined,
        birthDate: birthDate || undefined,
        gender: gender || undefined,
        role: (role as UserRole) || 'pet-owner',
        provider: socialSignup?.provider,
        socialId: socialSignup?.socialId,
        verified: socialSignup ? true : false, // 소셜 로그인은 기본 인증됨
        verifiedAt: socialSignup ? new Date() : undefined
      });
      
      // 세션에서 소셜 가입 정보 제거
      if (socialSignup) {
        delete req.session.socialSignup;
      }
      
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
  
  // 소셜 로그인 가입 정보 조회 API
  router.get('/social-signup', (req, res) => {
    try {
      const socialSignup = req.session.socialSignup;
      
      if (!socialSignup) {
        return res.success(null, '소셜 로그인 가입 정보가 없습니다.');
      }
      
      return res.success(socialSignup, '소셜 로그인 가입 정보를 성공적으로 조회했습니다.');
    } catch (error) {
      console.error('소셜 가입 정보 조회 오류:', error);
      return res.error(
        ApiErrorCode.INTERNAL_SERVER_ERROR,
        '소셜 가입 정보 조회 중 오류가 발생했습니다'
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