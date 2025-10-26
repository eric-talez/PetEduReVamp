import type { Express } from "express";
import { storage } from "../storage";

// 임시 에러 핸들러
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const successResponse = (data: any) => ({ success: true, data });

// ApiError 클래스 정의
class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }

  static forbidden(message: string) {
    return new ApiError(403, message);
  }

  static unauthorized() {
    return new ApiError(401, 'Unauthorized');
  }

  static internal(message: string) {
    return new ApiError(500, message);
  }
}

export function registerAdminRoutes(app: Express) {
  // 회원 현황 조회 API
  app.get('/api/admin/members-status', asyncHandler(async (req: any, res: any) => {
    console.log('[Admin] 회원 현황 조회 요청');

    try {
      // storage에서 데이터 가져오기
      const users = await storage.getAllUsers() || [];
      const pets = await storage.getAllPets ? await storage.getAllPets() : [];
      const institutes = await storage.getInstitutes ? await storage.getInstitutes() : [];

      console.log('[Admin] 데이터 현황:', {
        usersCount: users.length,
        petsCount: pets.length, 
        institutesCount: institutes.length
      });

      const membersByRole = {
        'pet-owner': users.filter((u: any) => u.role === 'pet-owner'),
        'trainer': users.filter((u: any) => u.role === 'trainer'), 
        'institute-admin': users.filter((u: any) => u.role === 'institute-admin'),
        'admin': users.filter((u: any) => u.role === 'admin')
      };

      const instituteMemberships = institutes.map(inst => ({
        userId: inst.trainerId,
        userName: inst.trainerName || '미지정',
        userRole: 'trainer',
        instituteName: inst.name,
        joinedAt: inst.createdAt || new Date().toISOString()
      })).filter(membership => membership.userId);

      const trainerConnections = institutes.filter(inst => inst.trainerId).map(inst => ({
        trainerId: inst.trainerId,
        trainerName: inst.trainerName || '미지정',
        connectedOwners: users
          .filter(u => u.role === 'pet-owner')
          .slice(0, 2) // 샘플 연결
          .map(owner => ({
            id: owner.id,
            name: owner.name,
            email: owner.email
          }))
      }));

      const summary = {
        totalUsers: users.length,
        totalTrainers: users.filter(u => u.role === 'trainer').length,
        totalInstitutes: institutes.length,
        totalPets: pets.length,
        petOwners: users.filter(u => u.role === 'pet-owner').length,
        instituteAdmins: users.filter(u => u.role === 'institute-admin').length,
        verifiedMembers: users.filter(u => u.isVerified).length
      };

      const result = {
        membersByRole,
        instituteMemberships,
        trainerConnections,
        summary
      };

      console.log('[Admin] 응답 데이터:', {
        summary,
        membersByRoleCount: Object.keys(membersByRole).reduce((acc, role) => {
          acc[role] = membersByRole[role].length;
          return acc;
        }, {} as any)
      });

      res.json(successResponse(result));
    } catch (error) {
      console.error('회원 현황 조회 오류:', error);
      throw ApiError.internal('회원 현황을 불러올 수 없습니다');
    }
  }));

  // 회원 상태 변경 API
  app.patch("/api/admin/members/:id/status", async (req, res) => {
    try {
      const memberId = parseInt(req.params.id);
      const { status, reason } = req.body;

      console.log(`[Admin] 회원 ${memberId} 상태 변경: ${status}`);

      // 실제로는 데이터베이스 업데이트
      const updatedMember = {
        id: memberId,
        status: status,
        statusReason: reason,
        updatedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        data: updatedMember,
        message: `회원 상태가 ${status}로 변경되었습니다.`
      });
    } catch (error) {
      console.error('회원 상태 변경 오류:', error);
      res.status(500).json({ 
        success: false,
        message: '회원 상태 변경 중 오류가 발생했습니다.' 
      });
    }
  });

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

  // 기관 관리 목록 조회
  app.get("/api/admin/institutes", async (req, res) => {
    try {
      console.log('[Admin] 기관 관리 목록 조회 요청');

      const institutes = [
        {
          id: 1,
          name: "왕짱스쿨",
          businessNumber: "123-45-67890",
          address: "경북 구미시 구평동 661",
          phone: "010-4765-1909",
          email: "donghoong@wangzzang.com",
          directorName: "강동훈",
          directorEmail: "donghoong@wangzzang.com",
          status: "active",
          isVerified: true,
          certification: "반려동물행동지도사 국가자격증 2급",
          establishedDate: "2020-01-01",
          registeredDate: "2024-01-15",
          trainersCount: 1,
          studentsCount: 87,
          coursesCount: 6,
          facilities: ["실내 훈련장", "야외 훈련장", "대기실", "상담실", "애견유치원"],
          operatingHours: "평일 09:00-18:00, 토요일 09:00-18:00, 일요일 휴무",
          description: "국가자격증 훈련부터 반려동물 교감 교육까지! 반려견과 보호자의 '진짜 관계'를 만들어 드리는 전문 교육기관입니다.",
          website: "https://wangzzang.com",
          specialPrograms: [
            "구미시 2025 미래교육지구 마을학교 '반려꿈터' 운영",
            "정신건강 및 특수교육 대상자를 위한 교감 활동",
            "경북소방본부, 교육기관 대상 강의 및 상담"
          ]
        },
        {
          id: 2,
          name: "서울반려견아카데미",
          businessNumber: "234-56-78901",
          address: "서울시 강남구 테헤란로 123",
          phone: "02-1234-5678",
          email: "info@seoul-pet-academy.com",
          directorName: "이기관",
          directorEmail: "lee.institute@example.com",
          status: "active",
          isVerified: true,
          certification: "교육부 인증",
          establishedDate: "2020-01-15",
          registeredDate: "2024-01-15",
          trainersCount: 8,
          studentsCount: 156,
          coursesCount: 12,
          facilities: ["실내 훈련장", "야외 운동장", "대기실", "상담실"],
          operatingHours: "평일 09:00-18:00, 주말 10:00-17:00",
          description: "전문 반려견 교육 및 훈련 서비스를 제공하는 종합 교육기관입니다."
        },
        {
          id: 3,
          name: "부산펫트레이닝센터",
          businessNumber: "345-67-89012",
          address: "부산시 해운대구 해운대로 456",
          phone: "051-2345-6789",
          email: "info@busan-pet-center.com",
          directorName: "박기관",
          directorEmail: "park.institute@example.com",
          status: "pending",
          isVerified: false,
          certification: "신청 중",
          establishedDate: "2023-06-01",
          registeredDate: "2024-02-20",
          trainersCount: 3,
          studentsCount: 45,
          coursesCount: 5,
          facilities: ["실내 훈련장", "놀이터"],
          operatingHours: "평일 10:00-19:00, 토요일 10:00-15:00",
          description: "개인 맞춤형 반려견 훈련 전문 센터입니다."
        },
        {
          id: 4,
          name: "대구애견학교",
          businessNumber: "456-78-90123",
          address: "대구시 중구 동성로 789",
          phone: "053-3456-7890",
          email: "info@daegu-pet-school.com",
          directorName: "최기관",
          directorEmail: "choi.institute@example.com",
          status: "suspended",
          isVerified: true,
          certification: "한국애견협회 인증",
          establishedDate: "2019-03-01",
          registeredDate: "2024-01-30",
          trainersCount: 5,
          studentsCount: 89,
          coursesCount: 8,
          facilities: ["실내 훈련장", "야외 운동장", "수영장"],
          operatingHours: "일시 운영 중단",
          description: "체계적인 교육 프로그램으로 유명한 반려견 교육 전문기관입니다.",
          suspendedReason: "시설 보수 공사로 인한 일시 중단"
        }
      ];

      const stats = {
        totalInstitutes: institutes.length,
        activeInstitutes: institutes.filter(i => i.status === 'active').length,
        pendingInstitutes: institutes.filter(i => i.status === 'pending').length,
        suspendedInstitutes: institutes.filter(i => i.status === 'suspended').length,
        verifiedInstitutes: institutes.filter(i => i.isVerified).length,
        totalTrainers: institutes.reduce((sum, i) => sum + i.trainersCount, 0),
        totalStudents: institutes.reduce((sum, i) => sum + i.studentsCount, 0),
        totalCourses: institutes.reduce((sum, i) => sum + i.coursesCount, 0)
      };

      res.json({
        success: true,
        data: {
          institutes,
          stats
        },
        message: '기관 목록을 성공적으로 조회했습니다.'
      });
    } catch (error) {
      console.error('기관 목록 조회 오류:', error);
      res.status(500).json({ 
        success: false,
        message: '기관 목록 조회 중 오류가 발생했습니다.' 
      });
    }
  });

  // 기관 상태 변경 API
  app.patch("/api/admin/institutes/:id/status", async (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);
      const { status, reason } = req.body;

      console.log(`[Admin] 기관 ${instituteId} 상태 변경: ${status}`);

      const updatedInstitute = {
        id: instituteId,
        status: status,
        statusReason: reason,
        updatedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        data: updatedInstitute,
        message: `기관 상태가 ${status}로 변경되었습니다.`
      });
    } catch (error) {
      console.error('기관 상태 변경 오류:', error);
      res.status(500).json({ 
        success: false,
        message: '기관 상태 변경 중 오류가 발생했습니다.' 
      });
    }
  });

  // 관리자 위치 목록 조회 (기존 유지)
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

  // 커리큘럼 목록 조회 API
  app.get('/api/admin/curriculums', asyncHandler(async (req: any, res: any) => {
    console.log('[Admin] 커리큘럼 목록 조회 요청');

    try {
      const curriculums = storage.getCurriculums() || [];

      console.log('[Admin] 커리큘럼 응답:', curriculums.length + '개');

      res.json({
        success: true,
        curriculums: curriculums,
        total: curriculums.length
      });
    } catch (error) {
      console.error('커리큘럼 목록 조회 오류:', error);
      res.status(500).json({ 
        success: false,
        message: '커리큘럼 목록을 불러올 수 없습니다.' 
      });
    }
  }));

  // 기관 목록 조회 API
  app.get('/api/institutes', asyncHandler(async (req: any, res: any) => {
    console.log('[Admin] 기관 목록 조회 요청');

    try {
      const institutes = await storage.getInstitutes();

      const institutesWithDetails = institutes.map(institute => ({
        ...institute,
        trainersCount: institute.trainerId ? 1 : (institute.trainersCount || 0),
        studentsCount: institute.studentsCount || 0,
        isActive: institute.isActive !== false // 기본값 true
      }));

      console.log('[Admin] 기관 목록 응답:', institutesWithDetails.length + '개');

      res.json(successResponse(institutesWithDetails));
    } catch (error) {
      console.error('기관 목록 조회 오류:', error);
      throw ApiError.internal('기관 목록을 불러올 수 없습니다');
    }
  }));

  // 훈련사 양성 프로그램 관리 API
  app.get('/api/trainer-programs', async (req, res) => {
    try {
      const programs = [
        {
          id: 1,
          name: "기초 반려견 훈련사 과정",
          duration: "8주",
          description: "반려견 기초 훈련 전문가 양성 과정",
          price: 500000,
          startDate: "2024-03-01",
          capacity: 20,
          enrolledCount: 15,
          status: 'active'
        },
        {
          id: 2,
          name: "고급 행동 교정사 과정",
          duration: "12주",
          description: "문제 행동 교정 전문가 양성 과정",
          price: 800000,
          startDate: "2024-03-15",
          capacity: 15,
          enrolledCount: 8,
          status: 'active'
        }
      ];
      
      res.json({
        success: true,
        programs
      });
    } catch (error) {
      console.error('훈련사 프로그램 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '훈련사 프로그램 조회 중 오류가 발생했습니다.'
      });
    }
  });

  // ※ 중복 라우트 제거됨 - 메인 routes.ts의 데이터베이스 연동 API 사용

  // 훈련사 인증 기록 API
  app.get('/api/trainer-certifications', async (req, res) => {
    try {
      const certifications = [
        {
          id: 1,
          trainerName: "김훈련",
          certificationType: "반려동물행동지도사 2급",
          issuedDate: "2024-01-15",
          expiryDate: "2026-01-15",
          status: "active",
          issuingOrganization: "한국반려동물협회"
        },
        {
          id: 2,
          trainerName: "이전문",
          certificationType: "반려동물행동지도사 1급",
          issuedDate: "2023-12-01",
          expiryDate: "2025-12-01",
          status: "active",
          issuingOrganization: "한국반려동물협회"
        }
      ];
      
      res.json({
        success: true,
        certifications
      });
    } catch (error) {
      console.error('훈련사 인증 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '훈련사 인증 조회 중 오류가 발생했습니다.'
      });
    }
  });

  return app;
}