/**
 * auth/index.ts
 * 인증 관련 모듈들을 통합
 */
import { Express, Router } from 'express';
import passport from 'passport';
import session from 'express-session';
import { hashPassword, setupLocalAuth } from './local-auth';
import { setupSocialAuth, setupSocialRoutes } from './social-auth';
import { storage } from '../storage';
import { User as SelectUser } from '@shared/schema';
import { UserRole } from '@shared/schema';

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
export function setupAuth(app: Express, sessionStore: session.Store) {
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
  setupSocialAuth();
  
  // API 라우트 설정
  setupAuthRoutes(app);
}

/**
 * 인증 관련 API 라우트 설정
 */
function setupAuthRoutes(app: Express) {
  const router = Router();
  
  // 사용자 인증 상태 확인
  router.get('/me', (req, res) => {
    console.log('세션 확인 - SessionID:', req.sessionID);
    console.log('세션 확인 - 전체 세션:', req.session);
    console.log('세션 확인 - 사용자:', req.user);
    
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        message: '인증이 필요합니다. 로그인 후 다시 시도해주세요.',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    return res.json(req.user);
  });
  
  // 로그인 API
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error('로그인 오류:', err);
        return res.status(500).json({
          message: '로그인 처리 중 오류가 발생했습니다',
          code: 'LOGIN_ERROR'
        });
      }
      
      if (!user) {
        return res.status(401).json({
          message: info?.message || '아이디 또는 비밀번호가 일치하지 않습니다',
          code: 'INVALID_CREDENTIALS'
        });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error('로그인 세션 생성 오류:', loginErr);
          return res.status(500).json({
            message: '로그인 세션 생성 중 오류가 발생했습니다',
            code: 'SESSION_ERROR'
          });
        }
        
        console.log('로그인 성공:', user.username);
        return res.json(user);
      });
    })(req, res, next);
  });
  
  // 로그아웃 API
  router.post('/logout', (req, res) => {
    const wasAuthenticated = req.isAuthenticated();
    
    req.logout((err) => {
      if (err) {
        console.error('로그아웃 오류:', err);
        return res.status(500).json({
          message: '로그아웃 처리 중 오류가 발생했습니다',
          code: 'LOGOUT_ERROR'
        });
      }
      
      return res.json({
        success: true,
        wasAuthenticated
      });
    });
  });
  
  // 회원가입 API
  router.post('/register', async (req, res) => {
    try {
      const { username, password, email, name } = req.body;
      
      // 필수 필드 검증
      if (!username || !password || !email || !name) {
        return res.status(400).json({
          message: '모든 필수 정보를 입력해주세요',
          code: 'MISSING_FIELDS'
        });
      }
      
      // 기존 사용자 확인
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({
          message: '이미 사용 중인 아이디입니다',
          code: 'USERNAME_EXISTS'
        });
      }
      
      // 비밀번호 해싱
      const hashedPassword = await hashPassword(password);
      
      // 사용자 생성
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email,
        name,
        role: 'pet-owner' as UserRole
      });
      
      // 자동 로그인
      req.login(user, (err) => {
        if (err) {
          console.error('회원가입 후 자동 로그인 오류:', err);
          return res.status(500).json({
            message: '회원가입은 완료되었으나 자동 로그인 중 오류가 발생했습니다',
            code: 'AUTO_LOGIN_ERROR'
          });
        }
        
        console.log('회원가입 및 자동 로그인 성공:', user.username);
        return res.status(201).json(user);
      });
    } catch (error) {
      console.error('회원가입 오류:', error);
      return res.status(500).json({
        message: '회원가입 처리 중 오류가 발생했습니다',
        code: 'REGISTRATION_ERROR'
      });
    }
  });
  
  // 소셜 로그인 라우트 설정
  setupSocialRoutes(router);
  
  // 라우터를 /api/auth 경로에 마운트
  app.use('/api/auth', router);
  
  console.log('[Auth] 인증 라우트 등록 완료');
}