import { type Express, Request as ExpressRequest, Response } from "express";
import { db } from "../db";
import { menuConfigurations } from "@shared/schema";
import { eq, isNull, and } from "drizzle-orm";
import { DEFAULT_MENU_CONFIGURATION } from "@shared/menu-config";

// Express 타입 확장 및 세션 타입 확장
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      role: string;
      [key: string]: any;
    };
  }
}

// 세션 포함된 요청 타입 정의
interface Request extends ExpressRequest {
  session: any;
  isAuthenticated(): boolean;
  user?: {
    id: number;
    username: string;
    role: string;
    [key: string]: any;
  };
}

export function registerMenuRoutes(app: Express) {
  // 메뉴 설정 가져오기
  app.get('/api/menu-configuration', async (req: Request, res: Response) => {
    try {
      console.log('[DEBUG] GET /api/menu-configuration 요청 받음');
      console.log('[DEBUG] 쿼리 파라미터:', req.query);
      
      const instituteId = req.query.instituteId 
        ? parseInt(req.query.instituteId as string) 
        : null;
      
      console.log('[DEBUG] Institute ID:', instituteId);
      
      // 기관별 설정이 요청된 경우
      if (instituteId) {
        console.log('[DEBUG] 기관별 메뉴 설정 조회 시도');
        const [config] = await db
          .select()
          .from(menuConfigurations)
          .where(and(
            eq(menuConfigurations.instituteId, instituteId),
            eq(menuConfigurations.isActive, true)
          ));
        
        console.log('[DEBUG] 기관별 설정 조회 결과:', config ? '설정 있음' : '설정 없음');
        
        if (config) {
          return res.json(config.configuration);
        }
      }
      
      console.log('[DEBUG] 전체 시스템 메뉴 설정 조회 시도');
      // 전체 시스템 메뉴 설정 가져오기
      const [config] = await db
        .select()
        .from(menuConfigurations)
        .where(and(
          isNull(menuConfigurations.instituteId),
          eq(menuConfigurations.isActive, true)
        ));
      
      console.log('[DEBUG] 전체 설정 조회 결과:', config ? '설정 있음' : '설정 없음');
      
      if (config) {
        return res.json(config.configuration);
      }
      
      console.log('[DEBUG] 기본 메뉴 구성 반환');
      // 기본 메뉴 구성 반환
      return res.json(DEFAULT_MENU_CONFIGURATION);
    } catch (error) {
      console.error('메뉴 설정 조회 오류:', error);
      res.status(500).json({ error: '메뉴 설정을 가져오는데 실패했습니다.' });
    }
  });
  
  // 메뉴 설정 저장
  app.post('/api/menu-configuration', async (req: Request, res: Response) => {
    try {
      // 관리자 권한 확인
      if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).json({ error: '권한이 없습니다.' });
      }
      
      const { configuration, instituteId, isActive, updatedAt } = req.body;
      
      // 기존 설정 확인
      let existing;
      
      if (instituteId) {
        [existing] = await db
          .select()
          .from(menuConfigurations)
          .where(eq(menuConfigurations.instituteId, instituteId));
      } else {
        [existing] = await db
          .select()
          .from(menuConfigurations)
          .where(isNull(menuConfigurations.instituteId));
      }
      
      if (existing) {
        // 기존 설정 업데이트
        const [updated] = await db
          .update(menuConfigurations)
          .set({
            configuration,
            isActive,
            updatedAt: new Date(),
            updatedBy: req.user.id
          })
          .where(eq(menuConfigurations.id, existing.id))
          .returning();
        
        return res.json(updated);
      } else {
        // 새 설정 생성
        const [created] = await db
          .insert(menuConfigurations)
          .values({
            configuration,
            instituteId: instituteId || null,
            isActive,
            updatedAt: new Date(),
            updatedBy: req.user.id
          })
          .returning();
        
        return res.status(201).json(created);
      }
    } catch (error) {
      console.error('메뉴 설정 저장 오류:', error);
      res.status(500).json({ error: '메뉴 설정 저장에 실패했습니다.' });
    }
  });
  
  // 기관별 메뉴 설정 목록 조회
  app.get('/api/menu-configurations/institutes', async (req: Request, res: Response) => {
    try {
      // 관리자 권한 확인
      if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).json({ error: '권한이 없습니다.' });
      }
      
      const configs = await db
        .select()
        .from(menuConfigurations)
        .where(eq(menuConfigurations.isActive, true));
      
      return res.json(configs);
    } catch (error) {
      console.error('메뉴 설정 목록 조회 오류:', error);
      res.status(500).json({ error: '메뉴 설정 목록을 가져오는데 실패했습니다.' });
    }
  });
  
  // 메뉴 설정 삭제 (비활성화)
  app.delete('/api/menu-configuration/:id', async (req: Request, res: Response) => {
    try {
      // 관리자 권한 확인
      if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).json({ error: '권한이 없습니다.' });
      }
      
      const id = parseInt(req.params.id);
      
      const [updated] = await db
        .update(menuConfigurations)
        .set({ 
          isActive: false,
          updatedAt: new Date(),
          updatedBy: req.user.id
        })
        .where(eq(menuConfigurations.id, id))
        .returning();
      
      if (!updated) {
        return res.status(404).json({ error: '해당 메뉴 설정을 찾을 수 없습니다.' });
      }
      
      return res.json({ success: true });
    } catch (error) {
      console.error('메뉴 설정 삭제 오류:', error);
      res.status(500).json({ error: '메뉴 설정 삭제에 실패했습니다.' });
    }
  });
}