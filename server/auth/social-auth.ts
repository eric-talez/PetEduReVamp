import { Strategy as KakaoStrategy } from 'passport-kakao';
import { Strategy as NaverStrategy } from 'passport-naver';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserRole } from '@shared/schema';
import { storage } from '../storage';
import { Express, Request, Response, NextFunction } from 'express';
import passport from 'passport';

/**
 * 소셜 로그인 전략 설정
 */
export function setupSocialAuth(app: Express) {
  // 카카오 로그인 전략 설정
  if (process.env.KAKAO_CLIENT_ID) {
    passport.use(
      new KakaoStrategy(
        {
          clientID: process.env.KAKAO_CLIENT_ID,
          callbackURL: process.env.REPLIT_DEV_DOMAIN 
            ? `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/kakao/callback`
            : 'http://localhost:5000/api/auth/kakao/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // profile.id는 카카오에서 제공하는 고유 ID입니다
            const kakaoId = profile.id;
            const email = profile._json?.kakao_account?.email || '';
            const nickname = profile.displayName || profile._json?.properties?.nickname || '';
            
            console.log('카카오 로그인 정보:', { kakaoId, email, nickname });
            
            // 기존 사용자 확인 (소셜 ID로)
            let user = await storage.getUserBySocialId('kakao', kakaoId);
            
            if (!user) {
              // 신규 사용자 생성
              user = await storage.createUser({
                username: `kakao_${kakaoId}`,
                password: Math.random().toString(36).slice(2) + Date.now().toString(36), // 랜덤 비밀번호
                email: email,
                name: nickname,
                provider: 'kakao',
                socialId: kakaoId,
                role: 'pet-owner', // 기본 역할은 반려인
                verified: true, // 소셜 로그인은 기본적으로 인증됨
                verifiedAt: new Date()
              });
              
              console.log('새 사용자 생성 완료:', user.id);
            } else {
              console.log('기존 사용자 확인:', user.id);
            }
            
            return done(null, user);
          } catch (error) {
            console.error('카카오 로그인 오류:', error);
            return done(error as Error);
          }
        }
      )
    );
    
    // 카카오 로그인 라우트
    app.get('/api/auth/kakao', passport.authenticate('kakao'));
    
    // 카카오 로그인 콜백 라우트
    app.get(
      '/api/auth/kakao/callback',
      passport.authenticate('kakao', {
        failureRedirect: '/auth?error=social-login-failed',
      }),
      (req, res) => {
        // 성공 시 대시보드로 리다이렉트
        res.redirect('/dashboard');
      }
    );
    
    console.log('[SocialAuth] 카카오 로그인 설정 완료');
  } else {
    console.warn('[SocialAuth] KAKAO_CLIENT_ID가 설정되지 않아 카카오 로그인 기능이 비활성화됩니다.');
  }
  
  // 네이버 로그인 전략 설정
  if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET) {
    passport.use(
      new NaverStrategy(
        {
          clientID: process.env.NAVER_CLIENT_ID,
          clientSecret: process.env.NAVER_CLIENT_SECRET,
          callbackURL: process.env.REPLIT_DEV_DOMAIN 
            ? `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/naver/callback`
            : 'http://localhost:5000/api/auth/naver/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // profile.id는 네이버에서 제공하는 고유 ID입니다
            const naverId = profile.id;
            const email = profile._json?.email || '';
            const nickname = profile.displayName || profile._json?.nickname || '';
            
            console.log('네이버 로그인 정보:', { naverId, email, nickname });
            
            // 기존 사용자 확인 (소셜 ID로)
            let user = await storage.getUserBySocialId('naver', naverId);
            
            if (!user) {
              // 신규 사용자 생성
              user = await storage.createUser({
                username: `naver_${naverId}`,
                password: Math.random().toString(36).slice(2) + Date.now().toString(36), // 랜덤 비밀번호
                email: email,
                name: nickname,
                provider: 'naver',
                socialId: naverId,
                role: 'pet-owner', // 기본 역할은 반려인
                verified: true, // 소셜 로그인은 기본적으로 인증됨
                verifiedAt: new Date()
              });
              
              console.log('새 사용자 생성 완료:', user.id);
            } else {
              console.log('기존 사용자 확인:', user.id);
            }
            
            return done(null, user);
          } catch (error) {
            console.error('네이버 로그인 오류:', error);
            return done(error as Error);
          }
        }
      )
    );
    
    // 네이버 로그인 라우트
    app.get('/api/auth/naver', passport.authenticate('naver'));
    
    // 네이버 로그인 콜백 라우트
    app.get(
      '/api/auth/naver/callback',
      passport.authenticate('naver', {
        failureRedirect: '/auth?error=social-login-failed',
      }),
      (req, res) => {
        // 성공 시 대시보드로 리다이렉트
        res.redirect('/dashboard');
      }
    );
    
    console.log('[SocialAuth] 네이버 로그인 설정 완료');
  } else {
    console.warn('[SocialAuth] NAVER_CLIENT_ID 또는 NAVER_CLIENT_SECRET이 설정되지 않아 네이버 로그인 기능이 비활성화됩니다.');
  }
  
  // 구글 로그인 전략 설정
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // profile.id는 구글에서 제공하는 고유 ID입니다
            const googleId = profile.id;
            const email = profile.emails?.[0]?.value || '';
            const name = profile.displayName || '';
            
            console.log('구글 로그인 정보:', { googleId, email, name });
            
            // 기존 사용자 확인 (소셜 ID로)
            let user = await storage.getUserBySocialId('google', googleId);
            
            if (!user) {
              // 신규 사용자 생성
              user = await storage.createUser({
                username: `google_${googleId}`,
                password: Math.random().toString(36).slice(2) + Date.now().toString(36), // 랜덤 비밀번호
                email: email,
                name: name,
                provider: 'google',
                socialId: googleId,
                role: 'pet-owner', // 기본 역할은 반려인
                verified: true, // 소셜 로그인은 기본적으로 인증됨
                verifiedAt: new Date()
              });
              
              console.log('새 사용자 생성 완료:', user.id);
            } else {
              console.log('기존 사용자 확인:', user.id);
            }
            
            return done(null, user);
          } catch (error) {
            console.error('구글 로그인 오류:', error);
            return done(error as Error);
          }
        }
      )
    );
    
    // 구글 로그인 라우트
    app.get('/api/auth/google', passport.authenticate('google', {
      scope: ['profile', 'email']
    }));
    
    // 구글 로그인 콜백 라우트
    app.get(
      '/api/auth/google/callback',
      passport.authenticate('google', {
        failureRedirect: '/auth?error=social-login-failed',
      }),
      (req, res) => {
        // 성공 시 대시보드로 리다이렉트
        res.redirect('/dashboard');
      }
    );
    
    console.log('[SocialAuth] 구글 로그인 설정 완료');
  } else {
    console.warn('[SocialAuth] GOOGLE_CLIENT_ID 또는 GOOGLE_CLIENT_SECRET이 설정되지 않아 구글 로그인 기능이 비활성화됩니다.');
  }
  
  // 소셜 로그인 정보를 세션에 추가하는 미들웨어
  app.use((req, res, next) => {
    if (req.isAuthenticated() && req.user) {
      // 소셜 로그인 정보가 있으면 세션에 추가
      if (req.user.provider && req.user.socialId) {
        // @ts-ignore
        req.session.social = {
          provider: req.user.provider,
          socialId: req.user.socialId
        };
      }
    }
    next();
  });
}