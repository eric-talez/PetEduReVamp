/**
 * Java Spring Boot 스타일의 UserService
 * Node.js/TypeScript로 구현된 Spring Boot 패턴
 */

import { storage } from '../storage';
import { User, InsertUser } from '@shared/schema';

export class UserService {
  
  /**
   * 모든 사용자 조회
   * @GetMapping("/api/users") 스타일
   */
  async findAll(): Promise<Omit<User, 'password'>[]> {
    console.log('[UserService] findAll() 호출됨');
    const users = Array.from((storage as any).users.values()) as User[];
    return users.map(({ password, ...user }) => user);
  }

  /**
   * ID로 사용자 조회
   * @GetMapping("/api/users/{id}") 스타일
   */
  async findById(id: number): Promise<Omit<User, 'password'> | null> {
    console.log(`[UserService] findById(${id}) 호출됨`);
    const user = await storage.getUser(id);
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * 사용자 생성
   * @PostMapping("/api/users") 스타일
   */
  async save(userData: InsertUser): Promise<Omit<User, 'password'>> {
    console.log('[UserService] save() 호출됨', userData);
    const newUser = await storage.createUser(userData);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  /**
   * 사용자명으로 사용자 조회
   * @GetMapping("/api/users/username/{username}") 스타일
   */
  async findByUsername(username: string): Promise<Omit<User, 'password'> | null> {
    console.log(`[UserService] findByUsername(${username}) 호출됨`);
    const user = await storage.getUserByUsername(username);
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * 헬스 체크
   * @GetMapping("/actuator/health") 스타일
   */
  health(): { status: string; service: string; timestamp: Date } {
    console.log('[UserService] health() 호출됨');
    return {
      status: 'UP',
      service: 'PetEdu User Service (Java Style)',
      timestamp: new Date()
    };
  }
}

// 싱글톤 패턴 (Spring Boot의 @Service Bean과 유사)
export const userService = new UserService();