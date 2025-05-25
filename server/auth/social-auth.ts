/**
 * social-auth.ts
 * 소셜 로그인을 위한 인증 설정 파일
 */
import { Router } from 'express';
import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { Strategy as NaverStrategy } from 'passport-naver';
import { storage } from '../storage';
import { UserRole } from '@shared/schema';

// 리다이렉트 URL 설정
const CALLBACK_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://talez.co.kr'
  : 'http://localhost:5000';

export function setupSocialAuth() {
  // 카카오 로그인 전략 설정
  if (process.env.KAKAO_CLIENT_ID) {
    passport.use(new KakaoStrategy({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: `${CALLBACK_BASE_URL}/api/auth/kakao/callback`
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('카카오 인증 프로필:', profile);
        
        // 기존 사용자 확인
        const userId = `kakao:${profile.id}`;
        let user = await storage.getUserByCi(userId);
        
        if (!user) {
          // 새 사용자 생성
          const username = `user_${profile.id}`;
          const email = profile._json?.kakao_account?.email || '';
          const name = profile.displayName || profile._json?.properties?.nickname || username;
          
          // 기본 반려인(pet-owner) 역할로 생성
          user = await storage.createUser({
            username,
            // 소셜 로그인은 실제 비밀번호를 사용하지 않음
            password: `kakao_${accessToken.substring(0, 10)}`,
            email,
            name,
            role: 'pet-owner' as UserRole,
            ci: userId,
            verified: true,
            verifiedAt: new Date(),
            verificationPhone: profile._json?.kakao_account?.phone_number || '',
            avatar: profile._json?.properties?.profile_image || ''
          });
          
          console.log('카카오 로그인 - 새 사용자 생성:', user.username);
        } else {
          console.log('카카오 로그인 - 기존 사용자:', user.username);
        }
        
        return done(null, user);
      } catch (error) {
        console.error('카카오 인증 오류:', error);
        return done(error as Error);
      }
    }));
  }
  
  // 네이버 로그인 전략 설정
  if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET) {
    passport.use(new NaverStrategy({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: `${CALLBACK_BASE_URL}/api/auth/naver/callback`
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('네이버 인증 프로필:', profile);
        
        // 기존 사용자 확인
        const userId = `naver:${profile.id}`;
        let user = await storage.getUserByCi(userId);
        
        if (!user) {
          // 새 사용자 생성
          const username = `user_${profile.id}`;
          const email = profile._json?.email || '';
          const name = profile.displayName || profile._json?.name || username;
          
          // 기본 반려인(pet-owner) 역할로 생성
          user = await storage.createUser({
            username,
            // 소셜 로그인은 실제 비밀번호를 사용하지 않음
            password: `naver_${accessToken.substring(0, 10)}`,
            email,
            name,
            role: 'pet-owner' as UserRole,
            ci: userId,
            verified: true,
            verifiedAt: new Date(),
            verificationPhone: profile._json?.mobile || '',
            avatar: profile._json?.profile_image || ''
          });
          
          console.log('네이버 로그인 - 새 사용자 생성:', user.username);
        } else {
          console.log('네이버 로그인 - 기존 사용자:', user.username);
        }
        
        return done(null, user);
      } catch (error) {
        console.error('네이버 인증 오류:', error);
        return done(error as Error);
      }
    }));
  }
}

// 소셜 로그인 라우트 설정
export function setupSocialRoutes(app: Router) {
  // 카카오 로그인 라우트
  if (process.env.KAKAO_CLIENT_ID) {
    app.get('/auth/kakao', passport.authenticate('kakao'));
    
    app.get('/auth/kakao/callback',
      passport.authenticate('kakao', {
        successRedirect: '/',
        failureRedirect: '/auth?error=kakao-login-failed'
      })
    );
  }
  
  // 네이버 로그인 라우트
  if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET) {
    app.get('/auth/naver', passport.authenticate('naver'));
    
    app.get('/auth/naver/callback',
      passport.authenticate('naver', {
        successRedirect: '/',
        failureRedirect: '/auth?error=naver-login-failed'
      })
    );
  }
  
  // 테스트용 소셜 로그인 시뮬레이션
  app.get('/auth/social-test/:provider', (req, res) => {
    const { provider } = req.params;
    
    if (!['kakao', 'naver'].includes(provider)) {
      return res.status(400).json({ message: '지원하지 않는 소셜 로그인 제공자입니다.' });
    }
    
    // 세션에 소셜 로그인 정보 저장
    if (req.session) {
      req.session.social = {
        provider,
        id: `test_${Date.now()}`,
        name: `${provider} 테스트 사용자`
      };
    }
    
    // 홈으로 리다이렉트
    res.redirect('/');
  });
}