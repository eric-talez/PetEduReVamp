/**
 * local-auth.ts
 * 일반 아이디/비밀번호 로그인을 위한 인증 설정 파일
 */
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { storage } from '../storage';
import { User as SelectUser } from '@shared/schema';

export async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(supplied: string, stored: string) {
  return await bcrypt.compare(supplied, stored);
}

export function setupLocalAuth() {
  // 로컬 전략 설정
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          console.log(`로그인 실패: 사용자 '${username}' 없음`);
          return done(null, false, { message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }
        
        // bcrypt를 사용한 비밀번호 검증
        const isPasswordValid = await comparePasswords(password, user.password);
          
        if (!isPasswordValid) {
          console.log(`로그인 실패: '${username}' 비밀번호 불일치`);
          return done(null, false, { message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }
        
        console.log(`로그인 성공: '${username}'`);
        return done(null, user);
      } catch (error) {
        console.error('로컬 인증 오류:', error);
        return done(error as Error);
      }
    })
  );
}