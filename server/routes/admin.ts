import type { Express } from "express";
import { storage } from "../storage";

// 임시 에러 핸들러
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const successResponse = (data: any) => ({ success: true, data });

export function registerAdminRoutes(app: Express) {
  // 승인 관리 API
  app.get('/api/admin/approvals', asyncHandler(async (req: any, res: any) => {
    try {
      console.log('[Admin] 승인 목록 요청받음');
      
      // 샘플 승인 데이터
      const approvals = [
        {
          id: 1,
          type: 'trainer',
          applicantName: '김훈련',
          applicantEmail: 'kim.trainer@example.com',
          appliedAt: '2025-01-25T10:30:00Z',
          status: 'pending',
          details: {
            title: '전문 반려견 훈련사 등록 신청',
            description: '10년 경력의 반려견 행동 교정 전문가입니다.',
            experience: '10년',
            certification: 'KKF 공인 훈련사, 동물행동학 석사'
          }
        },
        {
          id: 2,
          type: 'institute',
          applicantName: '박원장',
          applicantEmail: 'park.director@petschool.com',
          appliedAt: '2025-01-24T14:15:00Z',
          status: 'pending',
          details: {
            title: '해피펫 훈련소 등록 신청',
            instituteName: '해피펫 훈련소',
            businessNumber: '123-45-67890',
            address: '서울시 강남구 테헤란로 123',
            description: '종합 반려동물 교육 전문 기관입니다.'
          }
        }
      ];

      res.json(successResponse(approvals));
    } catch (error) {
      console.error('승인 목록 조회 오류:', error);
      res.status(500).json({ success: false, error: '승인 목록을 불러올 수 없습니다' });
    }
  }));

  // 승인 처리 API
  app.post('/api/admin/approvals/:id/action', asyncHandler(async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const { action, comment } = req.body; // action: 'approve' | 'reject'
      
      console.log(`[Admin] 승인 처리 요청: ID=${id}, Action=${action}`);
      
      // 실제 구현에서는 데이터베이스 업데이트
      // await storage.updateApprovalStatus(parseInt(id), action, comment);
      
      res.json(successResponse({ 
        message: `${action === 'approve' ? '승인' : '거부'}이 완료되었습니다.`,
        approvalId: id,
        action,
        comment 
      }));
    } catch (error) {
      console.error('승인 처리 오류:', error);
      res.status(500).json({ success: false, error: '승인 처리 중 오류가 발생했습니다' });
    }
  }));

  // 승인 상세 조회 API
  app.get('/api/admin/approvals/:id', asyncHandler(async (req: any, res: any) => {
    try {
      const { id } = req.params;
      
      console.log(`[Admin] 승인 상세 조회: ID=${id}`);
      
      // 샘플 상세 데이터
      const approval = {
        id: parseInt(id),
        type: 'trainer',
        applicantName: '김훈련',
        applicantEmail: 'kim.trainer@example.com',
        appliedAt: '2025-01-25T10:30:00Z',
        status: 'pending',
        details: {
          title: '전문 반려견 훈련사 등록 신청',
          description: '10년 경력의 반려견 행동 교정 전문가입니다.',
          experience: '10년',
          certification: 'KKF 공인 훈련사, 동물행동학 석사'
        },
        documents: [
          'trainer_certificate.pdf',
          'experience_letter.pdf'
        ]
      };

      res.json(successResponse(approval));
    } catch (error) {
      console.error('승인 상세 조회 오류:', error);
      res.status(500).json({ success: false, error: '승인 정보를 불러올 수 없습니다' });
    }
  }));
}