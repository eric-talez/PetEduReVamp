import type { Express } from "express";
import { storage } from "../storage";

// 임시 에러 핸들러
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const successResponse = (data: any) => ({ success: true, data });

export function registerAdminRoutes(app: Express, storage: IStorage) {
  // 관리자 승인 대기 목록 조회
  app.get("/api/admin/approvals", async (req, res) => {
    try {
      const approvals = [
        { id: 1, type: 'trainer', name: '김훈련', status: 'pending', requestDate: '2024-12-15' },
        { id: 2, type: 'institute', name: '펫 아카데미', status: 'pending', requestDate: '2024-12-16' }
      ];
      res.json(approvals);
    } catch (error) {
      console.error('Error fetching approvals:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Spring Boot 연동 사용자 관리
  app.get("/api/spring/users", async (req, res) => {
    try {

    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}