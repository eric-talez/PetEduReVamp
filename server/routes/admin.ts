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

  // 관리자 위치 등록
  app.post("/api/admin/locations", async (req, res) => {
    try {
      const locationData = req.body;
      
      // 위치 데이터 검증
      if (!locationData.name || !locationData.type || !locationData.address) {
        return res.status(400).json({ 
          message: '업체명, 유형, 주소는 필수 항목입니다.' 
        });
      }

      // 새 위치 생성
      const newLocation = {
        id: Date.now(),
        ...locationData,
        status: 'active',
        isVerified: true,
        isCertified: locationData.isCertified || false,
        certificationStatus: locationData.certificationStatus || 'verified',
        certificationDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
      // 샘플 데이터 반환 (실제로는 데이터베이스에서 조회)
      const locations = [
        {
          id: 1,
          name: '서울 펫 트레이닝 센터',
          type: 'training',
          address: '서울시 강남구 테헤란로 123',
          phone: '02-123-4567',
          description: '전문 반려견 훈련 및 행동 교정 전문 시설입니다.',
          status: 'active',
          isCertified: true,
          certificationStatus: 'verified',
          certificationDate: '2024-01-15',
          createdAt: '2024-01-15',
          updatedAt: '2024-06-20'
        }
      ];

      res.json(locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 위치 상태 업데이트
  app.patch("/api/admin/locations/:id", async (req, res) => {
    try {
      const locationId = parseInt(req.params.id);
      const updateData = req.body;

      // 실제로는 데이터베이스에서 업데이트
      console.log('위치 업데이트:', locationId, updateData);

      res.json({
        success: true,
        message: '위치 정보가 업데이트되었습니다.'
      });
    } catch (error) {
      console.error('Error updating location:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}