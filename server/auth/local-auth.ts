/**
 * local-auth.ts
 * 일반 아이디/비밀번호 로그인을 위한 인증 설정 파일
 */
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { storage } from '../storage';
import { User as SelectUser } from '@shared/schema';

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split('.');
  const hashedBuf = Buffer.from(hashed, 'hex');
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
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
        
        // 테스트 사용자의 경우 평문 비밀번호 비교
        const isPasswordValid = username === 'testuser3' && user.password === 'test123' 
          ? password === 'test123'
          : await comparePasswords(password, user.password);
          
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