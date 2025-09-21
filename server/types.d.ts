import { UserRole } from '@shared/schema';

// express-session에 사용자 정보를 저장하기 위한 타입 선언
declare module 'express-session' {
  interface Session {
    user?: {
      id: number;
      username: string;
      email: string;
      name: string;
      role: UserRole;
      instituteId?: number;
      [key: string]: any;
    };
  }
}