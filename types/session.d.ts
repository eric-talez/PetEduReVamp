declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      role: 'admin' | 'client' | 'freelancer' | 'pet-owner' | 'trainer' | 'institute-admin';
      email: string;
      username: string;
    };
    csrfToken?: string;
    lastActivity?: number;
    aiUsage?: number;
  }
}