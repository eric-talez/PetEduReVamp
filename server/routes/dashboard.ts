import type { Express } from "express";
import { storage } from "../storage";

// 임시 에러 핸들러 (middleware/error-handler.ts가 없는 경우)
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

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

const successResponse = (data: any) => ({ success: true, data });

export function registerDashboardRoutes(app: Express) {
  // 대시보드 통계 API
  app.get('/api/dashboard/stats', asyncHandler(async (req: any, res: any) => {
    console.log('[Dashboard] 대시보드 통계 요청받음');
    
    try {
      const stats = {
        totalUsers: 6,
        totalCourses: 15,
        totalInstitutes: 3,
        totalTrainers: 5,
        totalOrders: 42,
        totalRevenue: 2580000,
        activeUsers: 5,
        activeCourses: 12,
        pendingApplications: 8,
        recentActivity: [
          { type: 'user_registered', message: '새로운 사용자가 등록되었습니다', timestamp: new Date().toISOString() },
          { type: 'course_completed', message: '기본 순종 훈련 과정이 완료되었습니다', timestamp: new Date().toISOString() },
          { type: 'payment_received', message: '결제가 완료되었습니다', timestamp: new Date().toISOString() }
        ]
      };
      
      console.log('[Dashboard] 대시보드 통계 응답:', stats);
      res.json(stats);
    } catch (error) {
      console.error('[Dashboard] 대시보드 통계 오류:', error);
      res.status(500).json({ error: '대시보드 통계 조회 중 오류가 발생했습니다' });
    }
  }));

  // 관리자 대시보드 통계 API
  app.get('/api/admin/dashboard/stats', asyncHandler(async (req: any, res: any) => {
    console.log('[Dashboard] 관리자 대시보드 통계 요청받음');
    
    try {
      const stats = {
        totalUsers: 6,
        totalCourses: 15,
        totalInstitutes: 3,
        totalTrainers: 5,
        totalOrders: 42,
        totalRevenue: 2580000,
        activeUsers: 5,
        activeCourses: 12,
        pendingApplications: 8,
        recentActivity: [
          { type: 'user_registered', message: '새로운 사용자가 등록되었습니다', timestamp: new Date().toISOString() },
          { type: 'course_completed', message: '기본 순종 훈련 과정이 완료되었습니다', timestamp: new Date().toISOString() },
          { type: 'payment_received', message: '결제가 완료되었습니다', timestamp: new Date().toISOString() }
        ]
      };
      
      console.log('[Dashboard] 관리자 대시보드 통계 응답:', stats);
      res.json(stats);
    } catch (error) {
      console.error('[Dashboard] 관리자 대시보드 통계 오류:', error);
      res.status(500).json({ error: '관리자 대시보드 통계 조회 중 오류가 발생했습니다' });
    }
  }));

  // 시스템 상태 API (실시간 서비스 현황용)
  app.get('/api/dashboard/system/status', asyncHandler(async (req: any, res: any) => {
    console.log('[Dashboard] 시스템 상태 요청받음');

    try {
      // 실제 시스템 메트릭 수집
      // 샘플 데이터로 대체 (실제 구현에서는 데이터베이스 연결 필요)
      const allUsers = [
        { id: 1, name: '김반려', role: 'pet-owner', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
        { id: 2, name: '박훈련', role: 'trainer', isActive: true, createdAt: '2024-01-20', updatedAt: '2024-01-20' },
        { id: 3, name: '이기관', role: 'institute-admin', isActive: true, createdAt: '2024-02-01', updatedAt: '2024-02-01' },
        { id: 4, name: '최관리', role: 'admin', isActive: true, createdAt: '2024-01-10', updatedAt: '2024-01-10' },
        { id: 5, name: '정반려', role: 'pet-owner', isActive: false, createdAt: '2024-02-15', updatedAt: '2024-02-15' },
        { id: 6, name: '한훈련', role: 'trainer', isActive: true, createdAt: '2024-02-20', updatedAt: '2024-02-20' }
      ];
      
      const allCourses = [
        { id: 1, title: '기본 순종 훈련', isActive: true, createdAt: '2024-01-25' },
        { id: 2, title: '어질리티 훈련', isActive: true, createdAt: '2024-02-01' },
        { id: 3, title: '사회화 훈련', isActive: false, createdAt: '2024-02-10' }
      ];
      
      const allInstitutes = [
        { id: 1, name: '서울반려견센터', isVerified: true, createdAt: '2024-01-20' },
        { id: 2, name: '부산훈련소', isVerified: false, createdAt: '2024-02-05' }
      ];
      
      const allTrainers = [
        { id: 1, name: '박훈련', isVerified: true, createdAt: '2024-01-20' },
        { id: 2, name: '한훈련', isVerified: true, createdAt: '2024-02-20' }
      ];
      
      const allEvents = [
        { id: 1, title: '반려견 페스티벌', isActive: true, date: '2024-03-15', createdAt: '2024-02-01' },
        { id: 2, title: '훈련 워크샵', isActive: true, date: '2024-04-10', createdAt: '2024-02-10' }
      ];

      // 시스템 건강 상태 계산
      const systemHealth = {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        activeConnections: allUsers.filter((user: any) => user.isActive).length,
        errorRate: Math.random() * 0.01 // 실제 환경에서는 실제 에러율을 계산
      };

      const stats = {
        totalUsers: allUsers.length,
        totalCourses: allCourses.length,
        totalInstitutes: allInstitutes.length,
        totalTrainers: allTrainers.length,
        totalEvents: allEvents.length,
        activeUsers: systemHealth.activeConnections,
        systemHealth,
        timestamp: new Date().toISOString()
      };

      console.log('[Dashboard] 시스템 상태 응답:', {
        totalUsers: stats.totalUsers,
        activeUsers: stats.activeUsers,
        uptime: Math.round(systemHealth.uptime)
      });

      res.json(successResponse(stats));
    } catch (error: any) {
      console.error('[Dashboard] 시스템 상태 조회 실패:', error);
      res.status(500).json({ 
        success: false, 
        error: '시스템 상태를 가져오는데 실패했습니다.',
        details: error.message 
      });
    }
  }));

  // 관리자 대시보드 통계
  app.get('/api/dashboard/admin/stats', asyncHandler(async (req: any, res: any) => {
    // 임시로 인증 체크 생략 (세션 설정 없이 테스트)
    console.log('[Dashboard] 관리자 통계 요청받음');

    try {
      // 개발 환경에서 임시 사용자 ID 설정
      const adminUserId = req.user?.id || 'admin-1';
      
      // 실제 데이터 조회
      // 관리자 통계용 샘플 데이터
      const allUsers = [
        { id: 1, name: '김반려', role: 'pet-owner', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
        { id: 2, name: '박훈련', role: 'trainer', isActive: true, createdAt: '2024-01-20', updatedAt: '2024-01-20' },
        { id: 3, name: '이기관', role: 'institute-admin', isActive: true, createdAt: '2024-02-01', updatedAt: '2024-02-01' },
        { id: 4, name: '최관리', role: 'admin', isActive: true, createdAt: '2024-01-10', updatedAt: '2024-01-10' },
        { id: 5, name: '정반려', role: 'pet-owner', isActive: false, createdAt: '2024-02-15', updatedAt: '2024-02-15' },
        { id: 6, name: '한훈련', role: 'trainer', isActive: true, createdAt: '2024-02-20', updatedAt: '2024-02-20' }
      ];
      
      const allCourses = [
        { id: 1, title: '기본 순종 훈련', isActive: true, createdAt: '2024-01-25' },
        { id: 2, title: '어질리티 훈련', isActive: true, createdAt: '2024-02-01' },
        { id: 3, title: '사회화 훈련', isActive: false, createdAt: '2024-02-10' }
      ];
      
      const allInstitutes = [
        { id: 1, name: '서울반려견센터', isVerified: true, createdAt: '2024-01-20' },
        { id: 2, name: '부산훈련소', isVerified: false, createdAt: '2024-02-05' }
      ];
      
      const allTrainers = [
        { id: 1, name: '박훈련', isVerified: true, createdAt: '2024-01-20' },
        { id: 2, name: '한훈련', isVerified: true, createdAt: '2024-02-20' }
      ];
      
      const allEvents = [
        { id: 1, title: '반려견 페스티벌', isActive: true, date: '2024-03-15', createdAt: '2024-02-01' },
        { id: 2, title: '훈련 워크샵', isActive: true, date: '2024-04-10', createdAt: '2024-02-10' }
      ];
      
      const allProducts = [
        { id: 1, name: '프리미엄 사료', price: 50000, category: 'food', isActive: true },
        { id: 2, name: '훈련용 장난감', price: 15000, category: 'toy', isActive: true },
        { id: 3, name: '목줄', price: 25000, category: 'accessory', isActive: true }
      ];

      // 알림과 메시지는 임시로 빈 배열로 처리
      const allNotifications: any[] = [];
      const allMessages: any[] = [];

      // 알림과 메시지는 임시로 시뮬레이션 데이터로 처리
      // 실제 구현에서는 적절한 storage 메서드를 사용
      allNotifications.push(
        { id: 1, title: '새로운 승인 요청', message: '훈련사 승인 요청이 있습니다.', isRead: false },
        { id: 2, title: '시스템 알림', message: '정기 점검 완료', isRead: true }
      );
      
      allMessages.push(
        { id: 1, content: '관리자 메시지', isRead: false },
        { id: 2, content: '시스템 알림', isRead: true }
      );

      // 승인 대기 계산 (활성화되지 않은 사용자 + 기관)
      const pendingUsers = allUsers.filter(user => !user.isActive).length;
      const pendingInstitutes = allInstitutes.filter(institute => !institute.isVerified).length;
      const totalPendingApprovals = pendingUsers + pendingInstitutes;

      // 미읽은 알림/신고 계산
      const unreadNotifications = allNotifications.filter(n => !n.isRead).length;
      
      // 활성 사용자 계산 (최근 30일 내 활동)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeUsers = allUsers.filter(user => 
        user.isActive && new Date(user.updatedAt) > thirtyDaysAgo
      ).length;

      // 시스템 상태 계산
      const systemHealth = {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        activeConnections: activeUsers,
        errorRate: 0.02 // 시뮬레이션
      };

      const stats = {
        totalUsers: allUsers.length,
        totalCourses: allCourses.length,
        totalInstitutes: allInstitutes.length,
        totalTrainers: allTrainers.length,
        totalEvents: allEvents.length,
        totalProducts: allProducts.length,
        pendingApprovals: totalPendingApprovals,
        unreadReports: unreadNotifications,
        activeUsers,
        systemHealth,
        recentActivity: {
          newUsersToday: allUsers.filter(u => 
            new Date(u.createdAt).toDateString() === new Date().toDateString()
          ).length,
          newCoursesToday: allCourses.filter(c => 
            new Date(c.createdAt).toDateString() === new Date().toDateString()
          ).length,
          totalMessages: allMessages.length
        }
      };

      res.json(successResponse(stats));
    } catch (error) {
      console.error('관리자 대시보드 통계 조회 오류:', error);
      throw ApiError.internal('통계 데이터를 불러올 수 없습니다');
    }
  }));

  // 훈련사 대시보드 통계
  app.get('/api/dashboard/trainer/stats', asyncHandler(async (req: any, res: any) => {
    if (!req.user || req.user.role !== 'trainer') {
      throw ApiError.forbidden('훈련사 권한이 필요합니다');
    }

    try {
      const trainerId = req.user.id;
      
      // 훈련사 관련 데이터 조회
      const [
        trainerCourses,
        allReservations,
        trainerMessages,
        trainerNotifications
      ] = await Promise.all([
        storage.getCoursesByUserId(trainerId),
        storage.getReservations(),
        storage.getMessages(trainerId),
        storage.getNotifications(trainerId)
      ]);

      // 훈련사의 예약 필터링
      const trainerReservations = allReservations.filter(r => r.trainerId === trainerId);
      
      // 수강생 수 계산 (예약을 통해 계산)
      const uniqueStudents = new Set(trainerReservations.map(r => r.userId));
      const totalStudents = uniqueStudents.size;

      // 이번 달 수익 계산 (예약 기반)
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const thisMonthReservations = trainerReservations.filter(r => 
        new Date(r.createdAt) >= thisMonth && r.status === 'completed'
      );
      const monthlyRevenue = thisMonthReservations.reduce((sum, r) => 
        sum + (parseFloat(r.price) || 0), 0
      );

      // 평점 계산 (시뮬레이션)
      const rating = 4.7 + (Math.random() * 0.6); // 4.7-5.3 범위

      const stats = {
        activeCourses: trainerCourses.filter(c => c.isActive).length,
        totalStudents,
        monthlyRevenue: Math.round(monthlyRevenue),
        totalReservations: trainerReservations.length,
        pendingReservations: trainerReservations.filter(r => r.status === 'pending').length,
        completedReservations: trainerReservations.filter(r => r.status === 'completed').length,
        rating: Math.round(rating * 10) / 10,
        unreadMessages: trainerMessages.filter(m => !m.isRead).length,
        unreadNotifications: trainerNotifications.filter(n => !n.isRead).length,
        recentActivity: {
          newStudentsThisWeek: trainerReservations.filter(r => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(r.createdAt) > weekAgo;
          }).length,
          completedSessionsThisWeek: trainerReservations.filter(r => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return r.status === 'completed' && new Date(r.updatedAt) > weekAgo;
          }).length
        }
      };

      res.json(successResponse(stats));
    } catch (error) {
      console.error('훈련사 대시보드 통계 조회 오류:', error);
      throw ApiError.internal('통계 데이터를 불러올 수 없습니다');
    }
  }));

  // 기관 관리자 대시보드 통계
  app.get('/api/dashboard/institute-admin/stats', asyncHandler(async (req: any, res: any) => {
    if (!req.user || req.user.role !== 'institute-admin') {
      throw ApiError.forbidden('기관 관리자 권한이 필요합니다');
    }

    try {
      const adminId = req.user.id;
      
      // 기관 관련 데이터 조회
      const [
        allCourses,
        allReservations,
        allTrainers,
        adminMessages,
        adminNotifications
      ] = await Promise.all([
        storage.getAllCourses(),
        storage.getReservations(),
        storage.getAllTrainers(),
        storage.getMessages(adminId),
        storage.getNotifications(adminId)
      ]);

      // 기관 소속 강좌 및 훈련사 (실제로는 기관 ID로 필터링해야 함)
      const instituteCourses = allCourses.slice(0, Math.ceil(allCourses.length * 0.6));
      const instituteTrainers = allTrainers.slice(0, Math.ceil(allTrainers.length * 0.4));
      
      // 기관 예약 (실제로는 기관 ID로 필터링)
      const instituteReservations = allReservations.slice(0, Math.ceil(allReservations.length * 0.5));

      // 수익 계산
      const monthlyRevenue = instituteReservations
        .filter(r => {
          const thisMonth = new Date();
          thisMonth.setDate(1);
          return new Date(r.createdAt) >= thisMonth && r.status === 'completed';
        })
        .reduce((sum, r) => sum + (parseFloat(r.price) || 0), 0);

      const stats = {
        totalTrainers: instituteTrainers.length,
        activeCourses: instituteCourses.filter(c => c.isActive).length,
        totalReservations: instituteReservations.length,
        monthlyRevenue: Math.round(monthlyRevenue),
        pendingApprovals: instituteTrainers.filter(t => !t.isVerified || false).length,
        activeStudents: new Set(instituteReservations.map(r => r.userId)).size,
        facilityUtilization: Math.round(75 + Math.random() * 20), // 시뮬레이션
        unreadMessages: adminMessages.filter(m => !m.isRead).length,
        unreadNotifications: adminNotifications.filter(n => !n.isRead).length,
        recentActivity: {
          newEnrollmentsThisWeek: instituteReservations.filter(r => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(r.createdAt) > weekAgo;
          }).length,
          completedSessionsThisWeek: instituteReservations.filter(r => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return r.status === 'completed' && new Date(r.updatedAt) > weekAgo;
          }).length
        }
      };

      res.json(successResponse(stats));
    } catch (error) {
      console.error('기관 관리자 대시보드 통계 조회 오류:', error);
      throw ApiError.internal('통계 데이터를 불러올 수 없습니다');
    }
  }));

  // 반려인 대시보드 통계
  app.get('/api/dashboard/pet-owner/stats', asyncHandler(async (req: any, res: any) => {
    if (!req.user || req.user.role !== 'pet-owner') {
      throw ApiError.forbidden('반려인 권한이 필요합니다');
    }

    try {
      const userId = req.user.id;
      
      // 반려인 관련 데이터 조회
      const [
        userPets,
        userReservations,
        userMessages,
        userNotifications,
        allEvents
      ] = await Promise.all([
        storage.getPetsByUserId(userId),
        storage.getReservations(),
        storage.getMessages(userId),
        storage.getNotifications(userId),
        storage.getAllEvents()
      ]);

      // 사용자 예약 필터링
      const myReservations = userReservations.filter(r => r.userId === userId);
      
      // 수강 중인 강좌 (예약 기반)
      const enrolledCourses = new Set(myReservations.map(r => r.serviceType)).size;
      
      // 다음 예약
      const upcomingReservations = myReservations.filter(r => 
        new Date(r.scheduledAt) > new Date() && r.status === 'confirmed'
      );

      // 건강 관리 통계
      const healthStats = {
        totalVaccinations: 0,
        upcomingCheckups: 0,
        healthScore: 85 + Math.random() * 10 // 시뮬레이션
      };

      // 각 반려동물의 건강 데이터 수집
      for (const pet of userPets) {
        try {
          const [vaccinations, checkups] = await Promise.all([
            storage.getVaccinations(pet.id),
            storage.getCheckups(pet.id)
          ]);
          healthStats.totalVaccinations += vaccinations.length;
          healthStats.upcomingCheckups += checkups.filter(c => 
            new Date(c.nextCheckup) > new Date()
          ).length;
        } catch (error) {
          console.error(`반려동물 ${pet.id} 건강 데이터 조회 오류:`, error);
        }
      }

      const stats = {
        totalPets: userPets.length,
        enrolledCourses,
        completedSessions: myReservations.filter(r => r.status === 'completed').length,
        upcomingReservations: upcomingReservations.length,
        totalSpent: myReservations
          .filter(r => r.status === 'completed')
          .reduce((sum, r) => sum + (parseFloat(r.price) || 0), 0),
        healthStats,
        unreadMessages: userMessages.filter(m => !m.isRead).length,
        unreadNotifications: userNotifications.filter(n => !n.isRead).length,
        nearbyEvents: allEvents.filter(e => e.isActive).length,
        recentActivity: {
          sessionsThisMonth: myReservations.filter(r => {
            const thisMonth = new Date();
            thisMonth.setDate(1);
            return new Date(r.scheduledAt) >= thisMonth;
          }).length,
          newCoursesAvailable: allEvents.filter(e => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(e.createdAt) > weekAgo;
          }).length
        }
      };

      res.json(successResponse(stats));
    } catch (error) {
      console.error('반려인 대시보드 통계 조회 오류:', error);
      throw ApiError.internal('통계 데이터를 불러올 수 없습니다');
    }
  }));

  // 공통 대시보드 요약 통계
  app.get('/api/dashboard/summary', asyncHandler(async (req: any, res: any) => {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    try {
      const [
        allUsers,
        allCourses,
        allEvents,
        allReservations
      ] = await Promise.all([
        storage.getAllUsers(),
        storage.getAllCourses(),
        storage.getAllEvents(),
        storage.getReservations()
      ]);

      // 플랫폼 전체 통계
      const platformStats = {
        totalUsers: allUsers.length,
        totalCourses: allCourses.length,
        totalEvents: allEvents.length,
        totalReservations: allReservations.length,
        activeUsers: allUsers.filter(u => u.isActive).length,
        activeCourses: allCourses.filter(c => c.isActive).length,
        upcomingEvents: allEvents.filter(e => 
          new Date(e.date) > new Date() && e.isActive
        ).length,
        growth: {
          usersThisMonth: allUsers.filter(u => {
            const thisMonth = new Date();
            thisMonth.setDate(1);
            return new Date(u.createdAt) >= thisMonth;
          }).length,
          coursesThisMonth: allCourses.filter(c => {
            const thisMonth = new Date();
            thisMonth.setDate(1);
            return new Date(c.createdAt) >= thisMonth;
          }).length
        }
      };

      res.json(successResponse(platformStats));
    } catch (error) {
      console.error('대시보드 요약 통계 조회 오류:', error);
      throw ApiError.internal('요약 통계를 불러올 수 없습니다');
    }
  }));
}