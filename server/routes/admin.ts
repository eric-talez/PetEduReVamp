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
      const users = [
        { id: 1, role: 'pet-owner', name: '김반려', email: 'owner@test.com' },
        { id: 2, role: 'trainer', name: '박훈련', email: 'trainer@test.com' },
        { id: 3, role: 'institute-admin', name: '이기관', email: 'admin@test.com' }
      ];
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 관리자 위치 등록 API
  app.post("/api/admin/locations", async (req, res) => {
    try {
      const { name, type, address, latitude, longitude, description, certification } = req.body;
      
      const newLocation = {
        id: Date.now(),
        name,
        type, // 'institute', 'trainer', 'clinic', 'shop'
        address,
        coordinates: { latitude, longitude },
        description,
        certification: certification || false,
        status: 'active',
        createdAt: new Date().toISOString(),
        adminApproved: true
      };

      // 실제로는 데이터베이스에 저장
      console.log('새 위치 등록:', newLocation);

      res.status(201).json({
        success: true,
        location: newLocation,
        message: '위치가 성공적으로 등록되었습니다.'
      });
    } catch (error) {
      console.error('Error creating location:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 관리자 위치 목록 조회
  app.get("/api/admin/locations", async (req, res) => {
    try {
      const locations = [
        {
          id: 1,
          name: "서울반려견아카데미",
          type: "institute",
          address: "서울시 강남구 테헤란로 123",
          coordinates: { latitude: 37.5665, longitude: 126.9780 },
          description: "전문 반려견 교육 기관",
          certification: true,
          status: "active",
          createdAt: "2024-01-15T09:00:00Z",
          adminApproved: true
        },
        {
          id: 2,
          name: "김훈련사 개인 훈련소",
          type: "trainer",
          address: "서울시 마포구 홍대로 456",
          coordinates: { latitude: 37.5563, longitude: 126.9239 },
          description: "경력 10년 전문 훈련사",
          certification: true,
          status: "active",
          createdAt: "2024-02-20T10:30:00Z",
          adminApproved: true
        }
      ];

      res.json({
        success: true,
        locations,
        total: locations.length
      });
    } catch (error) {
      console.error('Error fetching admin locations:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 관리자 위치 승인/거부
  app.patch("/api/admin/locations/:id/approve", async (req, res) => {
    try {
      const locationId = parseInt(req.params.id);
      const { approved, reason } = req.body;

      // 실제로는 데이터베이스에서 업데이트
      const updatedLocation = {
        id: locationId,
        adminApproved: approved,
        approvalReason: reason,
        approvedAt: new Date().toISOString(),
        status: approved ? 'active' : 'rejected'
      };

      res.json({
        success: true,
        location: updatedLocation,
        message: approved ? '위치가 승인되었습니다.' : '위치가 거부되었습니다.'
      });
    } catch (error) {
      console.error('Error approving location:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}