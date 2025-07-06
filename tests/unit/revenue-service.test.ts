import { RevenueService } from '../../server/services/revenue-service';
import { storage } from '../../server/storage';

jest.mock('../../server/storage');

describe('RevenueService', () => {
  let revenueService: RevenueService;
  const mockStorage = storage as jest.Mocked<typeof storage>;

  beforeEach(() => {
    revenueService = new RevenueService();
    jest.clearAllMocks();
  });

  describe('getTrainerRevenue', () => {
    it('훈련사 수익 내역을 정상적으로 조회해야 함', async () => {
      const mockRevenues = [
        {
          courseId: 'course-1',
          courseName: '기초 훈련',
          trainerId: 'trainer-1',
          trainerName: '김훈련사',
          amount: 350000,
          commissionRate: 70,
          trainerRevenue: 245000,
          platformRevenue: 105000,
          date: '2025-01-15',
          status: 'completed' as const
        }
      ];

      mockStorage.getRevenueByTrainer.mockResolvedValue(mockRevenues);

      const result = await revenueService.getTrainerRevenue('trainer-1');

      expect(result).toEqual(mockRevenues);
      expect(mockStorage.getRevenueByTrainer).toHaveBeenCalledWith('trainer-1', undefined);
    });

    it('날짜 범위를 포함하여 수익 내역을 조회해야 함', async () => {
      const dateRange = { start: '2025-01-01', end: '2025-01-31' };
      const mockRevenues = [];

      mockStorage.getRevenueByTrainer.mockResolvedValue(mockRevenues);

      await revenueService.getTrainerRevenue('trainer-1', dateRange);

      expect(mockStorage.getRevenueByTrainer).toHaveBeenCalledWith('trainer-1', dateRange);
    });

    it('스토리지 오류 시 적절한 에러를 던져야 함', async () => {
      mockStorage.getRevenueByTrainer.mockRejectedValue(new Error('Database error'));

      await expect(revenueService.getTrainerRevenue('trainer-1'))
        .rejects.toThrow('수익 내역을 조회할 수 없습니다.');
    });
  });

  describe('getMonthlyRevenueSummary', () => {
    it('월별 수익 요약을 정상적으로 조회해야 함', async () => {
      const mockSummary = [
        {
          month: '2025-01',
          totalRevenue: 1000000,
          averageCommissionRate: 70,
          netEarnings: 700000,
          transactionCount: 5
        }
      ];

      mockStorage.getMonthlyRevenueSummary.mockResolvedValue(mockSummary);

      const result = await revenueService.getMonthlyRevenueSummary('trainer-1');

      expect(result).toEqual(mockSummary);
      expect(mockStorage.getMonthlyRevenueSummary).toHaveBeenCalledWith('trainer-1');
    });
  });

  describe('getCurriculumRevenueAnalysis', () => {
    it('커리큘럼 수익 분석을 정상적으로 조회해야 함', async () => {
      const mockAnalysis = {
        totalRevenue: 1000000,
        enrollmentCount: 25,
        averageRevenuePerStudent: 40000,
        growthRate: 15.5,
        lastMonthRevenue: 800000
      };

      mockStorage.getCurriculumRevenueAnalysis.mockResolvedValue(mockAnalysis);

      const result = await revenueService.getCurriculumRevenueAnalysis('curriculum-1');

      expect(result).toEqual(mockAnalysis);
      expect(mockStorage.getCurriculumRevenueAnalysis).toHaveBeenCalledWith('curriculum-1');
    });

    it('존재하지 않는 커리큘럼에 대해 오류를 던져야 함', async () => {
      mockStorage.getCurriculumRevenueAnalysis.mockRejectedValue(new Error('Curriculum not found'));

      await expect(revenueService.getCurriculumRevenueAnalysis('invalid-id'))
        .rejects.toThrow('커리큘럼 수익 분석을 조회할 수 없습니다.');
    });
  });

  describe('processRevenueSettlement', () => {
    it('수익 정산을 정상적으로 처리해야 함', async () => {
      mockStorage.processRevenueSettlement.mockResolvedValue();

      await expect(revenueService.processRevenueSettlement('trainer-1', '2025-01'))
        .resolves.not.toThrow();

      expect(mockStorage.processRevenueSettlement).toHaveBeenCalledWith('trainer-1', '2025-01');
    });

    it('정산 처리 중 오류 발생 시 적절한 에러를 던져야 함', async () => {
      mockStorage.processRevenueSettlement.mockRejectedValue(new Error('Settlement failed'));

      await expect(revenueService.processRevenueSettlement('trainer-1', '2025-01'))
        .rejects.toThrow('수익 정산을 처리할 수 없습니다.');
    });
  });

  describe('getPlatformRevenueStats', () => {
    it('플랫폼 수익 통계를 정상적으로 조회해야 함', async () => {
      const mockStats = {
        totalRevenue: 5000000,
        totalTrainerRevenue: 3500000,
        totalPlatformRevenue: 1500000,
        totalCourses: 50,
        averageCommissionRate: 70
      };

      mockStorage.getPlatformRevenueStats.mockResolvedValue(mockStats);

      const result = await revenueService.getPlatformRevenueStats();

      expect(result).toEqual(mockStats);
      expect(mockStorage.getPlatformRevenueStats).toHaveBeenCalled();
    });
  });
});