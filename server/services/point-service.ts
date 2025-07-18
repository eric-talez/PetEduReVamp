import { format } from 'date-fns';
import { storage } from '../storage';
import type { 
  PointRule, 
  InsertPointRule, 
  MonthlyPointSummary, 
  InsertMonthlyPointSummary, 
  PointTransaction, 
  InsertPointTransaction,
  TrainerActivityLog,
  InsertTrainerActivityLog,
  TrainerRanking,
  InsertTrainerRanking
} from '../../shared/schema';

export class PointService {
  // 기본 포인트 규칙 데이터
  private static defaultPointRules: InsertPointRule[] = [
    {
      activityType: 'video_upload',
      activityName: '영상 업로드',
      pointsPerAction: 5,
      maxDailyPoints: 50,
      maxMonthlyPoints: 500,
      description: '훈련 영상 업로드시 5점 획득 (일일 최대 50점, 월 최대 500점)',
      isActive: true
    },
    {
      activityType: 'comment',
      activityName: '댓글 작성',
      pointsPerAction: 1,
      maxDailyPoints: 10,
      maxMonthlyPoints: 100,
      description: '커뮤니티 댓글 작성시 1점 획득 (일일 최대 10점, 월 최대 100점)',
      isActive: true
    },
    {
      activityType: 'view',
      activityName: '조회수',
      pointsPerAction: 1,
      maxDailyPoints: 30,
      maxMonthlyPoints: 300,
      description: '강의 조회수 1회당 1점 획득 (일일 최대 30점, 월 최대 300점)',
      isActive: true
    },
    {
      activityType: 'member_recruitment',
      activityName: '회원 추천',
      pointsPerAction: 20,
      maxDailyPoints: 100,
      maxMonthlyPoints: 600,
      description: '새로운 회원 추천시 20점 획득 (일일 최대 100점, 월 최대 600점)',
      isActive: true
    },
    {
      activityType: 'certification',
      activityName: '자격증 취득',
      pointsPerAction: 100,
      maxDailyPoints: null,
      maxMonthlyPoints: null,
      description: '전문 자격증 취득시 100점 획득 (제한 없음)',
      isActive: true
    },
    {
      activityType: 'consultation',
      activityName: '상담 완료',
      pointsPerAction: 10,
      maxDailyPoints: 80,
      maxMonthlyPoints: 800,
      description: '화상 상담 완료시 10점 획득 (일일 최대 80점, 월 최대 800점)',
      isActive: true
    },
    {
      activityType: 'course_creation',
      activityName: '강의 생성',
      pointsPerAction: 50,
      maxDailyPoints: 150,
      maxMonthlyPoints: 1000,
      description: '새로운 강의 생성시 50점 획득 (일일 최대 150점, 월 최대 1000점)',
      isActive: true
    }
  ];

  // 포인트 규칙 초기화
  static async initializePointRules() {
    const existingRules = await storage.getAllPointRules();
    
    if (existingRules.length === 0) {
      for (const rule of this.defaultPointRules) {
        await storage.createPointRule(rule);
      }
      console.log('✅ 기본 포인트 규칙이 초기화되었습니다.');
    }
  }

  // 활동 기록 및 포인트 적립
  static async recordActivity(trainerId: number, activityType: string, metadata: any = {}) {
    const pointRule = await storage.getPointRuleByType(activityType);
    
    if (!pointRule || !pointRule.isActive) {
      throw new Error('유효하지 않은 활동 타입입니다.');
    }

    const today = format(new Date(), 'yyyy-MM-dd');
    const month = format(new Date(), 'yyyy-MM');

    // 일일 포인트 제한 확인
    if (pointRule.maxDailyPoints) {
      const dailyPoints = await storage.getDailyPointsByType(trainerId, today, activityType);
      if (dailyPoints >= pointRule.maxDailyPoints) {
        throw new Error(`일일 ${pointRule.activityName} 포인트 한도(${pointRule.maxDailyPoints}점)를 초과했습니다.`);
      }
    }

    // 월별 포인트 제한 확인
    if (pointRule.maxMonthlyPoints) {
      const monthlyPoints = await storage.getMonthlyPointsByType(trainerId, month, activityType);
      if (monthlyPoints >= pointRule.maxMonthlyPoints) {
        throw new Error(`월별 ${pointRule.activityName} 포인트 한도(${pointRule.maxMonthlyPoints}점)를 초과했습니다.`);
      }
    }

    // 활동 로그 기록
    const activityLog: InsertTrainerActivityLog = {
      trainerId,
      activityType,
      activityTitle: pointRule.activityName,
      activityDescription: metadata.description || '',
      pointsEarned: pointRule.pointsPerAction,
      incentiveAmount: "0",
      metadata: JSON.stringify(metadata)
    };

    const savedLog = await storage.createTrainerActivityLog(activityLog);

    // 포인트 거래 기록
    const transaction: InsertPointTransaction = {
      trainerId,
      activityLogId: savedLog.id,
      pointRuleId: pointRule.id,
      transactionType: 'earned',
      points: pointRule.pointsPerAction,
      description: `${pointRule.activityName}로 ${pointRule.pointsPerAction}점 획득`,
      metadata: JSON.stringify(metadata)
    };

    await storage.createPointTransaction(transaction);

    // 월별 포인트 합산 업데이트
    await this.updateMonthlyPointSummary(trainerId, month, activityType, pointRule.pointsPerAction);

    return {
      pointsEarned: pointRule.pointsPerAction,
      totalPoints: await this.getTotalPoints(trainerId),
      monthlyPoints: await this.getMonthlyPoints(trainerId, month)
    };
  }

  // 월별 포인트 합산 업데이트
  static async updateMonthlyPointSummary(trainerId: number, month: string, activityType: string, points: number) {
    let summary = await storage.getMonthlyPointSummary(trainerId, month);
    
    if (!summary) {
      // 새로운 월별 요약 생성
      const newSummary: InsertMonthlyPointSummary = {
        trainerId,
        month,
        totalPoints: points,
        videoUploadPoints: activityType === 'video_upload' ? points : 0,
        commentPoints: activityType === 'comment' ? points : 0,
        viewPoints: activityType === 'view' ? points : 0,
        recruitmentPoints: activityType === 'member_recruitment' ? points : 0,
        certificationPoints: activityType === 'certification' ? points : 0,
        consultationPoints: activityType === 'consultation' ? points : 0,
        courseCreationPoints: activityType === 'course_creation' ? points : 0
      };
      
      await storage.createMonthlyPointSummary(newSummary);
    } else {
      // 기존 요약 업데이트
      const updates: Partial<MonthlyPointSummary> = {
        totalPoints: summary.totalPoints + points,
        lastCalculatedAt: new Date()
      };

      switch (activityType) {
        case 'video_upload':
          updates.videoUploadPoints = summary.videoUploadPoints + points;
          break;
        case 'comment':
          updates.commentPoints = summary.commentPoints + points;
          break;
        case 'view':
          updates.viewPoints = summary.viewPoints + points;
          break;
        case 'member_recruitment':
          updates.recruitmentPoints = summary.recruitmentPoints + points;
          break;
        case 'certification':
          updates.certificationPoints = summary.certificationPoints + points;
          break;
        case 'consultation':
          updates.consultationPoints = summary.consultationPoints + points;
          break;
        case 'course_creation':
          updates.courseCreationPoints = summary.courseCreationPoints + points;
          break;
      }

      await storage.updateMonthlyPointSummary(trainerId, month, updates);
    }
  }

  // 월별 훈련사 순위 계산
  static async calculateMonthlyRankings(month: string = format(new Date(), 'yyyy-MM')) {
    const allSummaries = await storage.getAllMonthlyPointSummaries(month);
    
    // 포인트 기준으로 정렬
    const sortedSummaries = allSummaries.sort((a, b) => b.totalPoints - a.totalPoints);
    
    // 상위 10% 계산
    const top10PercentCount = Math.ceil(sortedSummaries.length * 0.1);
    
    for (let i = 0; i < sortedSummaries.length; i++) {
      const summary = sortedSummaries[i];
      const isTopPerformer = i < top10PercentCount;
      
      // 활동 점수 계산 (다양한 활동 참여도 고려)
      const activityScore = this.calculateActivityScore(summary);
      
      // 보너스 배수 계산
      const bonusMultiplier = isTopPerformer ? 1.5 : 1.0;
      
      const ranking: InsertTrainerRanking = {
        trainerId: summary.trainerId,
        month,
        totalPoints: summary.totalPoints,
        activityScore: activityScore.toString(),
        rankPosition: i + 1,
        isTopPerformer,
        prioritySettlement: isTopPerformer,
        bonusMultiplier: bonusMultiplier.toString()
      };
      
      await storage.createOrUpdateTrainerRanking(ranking);
    }
    
    return sortedSummaries.length;
  }

  // 활동 점수 계산 (다양성 고려)
  private static calculateActivityScore(summary: MonthlyPointSummary): number {
    const activities = [
      summary.videoUploadPoints,
      summary.commentPoints,
      summary.viewPoints,
      summary.recruitmentPoints,
      summary.certificationPoints,
      summary.consultationPoints,
      summary.courseCreationPoints
    ];
    
    const activeActivities = activities.filter(points => points > 0).length;
    const totalPoints = summary.totalPoints;
    
    // 다양성 보너스 (활동 종류가 많을수록 높은 점수)
    const diversityBonus = activeActivities * 0.1;
    
    // 기본 점수 + 다양성 보너스
    return totalPoints * (1 + diversityBonus);
  }

  // 인센티브 지급 계산
  static async calculateIncentives(trainerId: number, month: string) {
    const ranking = await storage.getTrainerRanking(trainerId, month);
    const summary = await storage.getMonthlyPointSummary(trainerId, month);
    
    if (!ranking || !summary) {
      return { incentiveAmount: 0, breakdown: {} };
    }
    
    const breakdown = {
      reviewVideoIncentive: 0,
      activityPointIncentive: 0,
      topPerformerBonus: 0,
      total: 0
    };
    
    // 리뷰 영상 인센티브 (30,000-50,000원)
    if (summary.videoUploadPoints > 0) {
      const videoCount = Math.floor(summary.videoUploadPoints / 5); // 영상 1개당 5점
      breakdown.reviewVideoIncentive = Math.min(videoCount * 35000, 50000);
    }
    
    // 활동 포인트 인센티브 (포인트당 100원)
    breakdown.activityPointIncentive = summary.totalPoints * 100;
    
    // 상위 10% 보너스
    if (ranking.isTopPerformer) {
      breakdown.topPerformerBonus = breakdown.activityPointIncentive * 0.5;
    }
    
    breakdown.total = breakdown.reviewVideoIncentive + breakdown.activityPointIncentive + breakdown.topPerformerBonus;
    
    return { incentiveAmount: breakdown.total, breakdown };
  }

  // 총 포인트 조회
  static async getTotalPoints(trainerId: number): Promise<number> {
    const summaries = await storage.getAllMonthlyPointSummariesByTrainer(trainerId);
    return summaries.reduce((total, summary) => total + summary.totalPoints, 0);
  }

  // 월별 포인트 조회
  static async getMonthlyPoints(trainerId: number, month: string): Promise<number> {
    const summary = await storage.getMonthlyPointSummary(trainerId, month);
    return summary ? summary.totalPoints : 0;
  }

  // 활동 통계 조회
  static async getActivityStats(trainerId: number, month: string) {
    const summary = await storage.getMonthlyPointSummary(trainerId, month);
    const ranking = await storage.getTrainerRanking(trainerId, month);
    const activities = await storage.getTrainerActivityLogsByMonth(trainerId, month);
    
    return {
      summary,
      ranking,
      activities,
      totalActivities: activities.length,
      uniqueActivityTypes: [...new Set(activities.map(a => a.activityType))].length
    };
  }
}