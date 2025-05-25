import { Router } from 'express';
import { db } from '../db';
import { 
  userActivityLogs, 
  petHealthLogs, 
  trainingProgressLogs, 
  reportTemplates, 
  generatedReports,
  users,
  pets,
  courses,
  enrollments
} from '@shared/schema';
import { eq, and, desc, between, sql, gte, lte } from 'drizzle-orm';
import { createPetHealthLogSchema } from '@shared/schema';
import { z } from 'zod';

const router = Router();

// 인증 확인 미들웨어
const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  next();
};

// 관리자 권한 확인 미들웨어
const isAdmin = (req, res, next) => {
  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
  next();
};

// 사용자 활동 로그 추가 - 내부용 함수
export const logUserActivity = async (userId: number, activityType: string, metadata?: any, req?: any) => {
  try {
    const ipAddress = req?.ip || null;
    const userAgent = req?.headers['user-agent'] || null;
    
    await db.insert(userActivityLogs).values({
      userId,
      activityType,
      metadata: metadata || null,
      ipAddress,
      userAgent
    });
    
    return true;
  } catch (error) {
    console.error('사용자 활동 로그 저장 오류:', error);
    return false;
  }
};

// 사용자 활동 로그 조회
router.get('/activity-logs', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);
    
    let query = db.select()
      .from(userActivityLogs)
      .where(eq(userActivityLogs.userId, userId))
      .orderBy(desc(userActivityLogs.createdAt))
      .limit(Number(limit))
      .offset(offset);
    
    // 활동 유형 필터링
    if (type) {
      query = query.where(eq(userActivityLogs.activityType, String(type)));
    }
    
    // 날짜 범위 필터링
    if (startDate && endDate) {
      query = query.where(
        between(
          userActivityLogs.createdAt, 
          new Date(String(startDate)), 
          new Date(String(endDate))
        )
      );
    } else if (startDate) {
      query = query.where(gte(userActivityLogs.createdAt, new Date(String(startDate))));
    } else if (endDate) {
      query = query.where(lte(userActivityLogs.createdAt, new Date(String(endDate))));
    }
    
    const logs = await query;
    
    // 총 로그 수 조회
    let countQuery = db.select({ count: sql<number>`count(*)` })
      .from(userActivityLogs)
      .where(eq(userActivityLogs.userId, userId));
    
    if (type) {
      countQuery = countQuery.where(eq(userActivityLogs.activityType, String(type)));
    }
    
    if (startDate && endDate) {
      countQuery = countQuery.where(
        between(
          userActivityLogs.createdAt, 
          new Date(String(startDate)), 
          new Date(String(endDate))
        )
      );
    } else if (startDate) {
      countQuery = countQuery.where(gte(userActivityLogs.createdAt, new Date(String(startDate))));
    } else if (endDate) {
      countQuery = countQuery.where(lte(userActivityLogs.createdAt, new Date(String(endDate))));
    }
    
    const [{ count }] = await countQuery;
    
    res.json({
      logs,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('사용자 활동 로그 조회 오류:', error);
    res.status(500).json({ message: '활동 로그를 불러오는 중 오류가 발생했습니다.' });
  }
});

// 반려동물 건강 로그 추가
router.post('/pets/:petId/health-logs', isAuthenticated, async (req, res) => {
  try {
    const { petId } = req.params;
    const healthLogData = createPetHealthLogSchema.parse(req.body);
    
    // 반려동물 소유자 확인
    const [pet] = await db.select()
      .from(pets)
      .where(and(
        eq(pets.id, parseInt(petId)),
        eq(pets.ownerId, req.user.id)
      ));
    
    if (!pet) {
      return res.status(403).json({ message: '해당 반려동물의 건강 로그를 추가할 권한이 없습니다.' });
    }
    
    const [healthLog] = await db.insert(petHealthLogs)
      .values({
        ...healthLogData,
        petId: parseInt(petId)
      })
      .returning();
    
    // 사용자 활동 로그 추가
    await logUserActivity(req.user.id, 'pet_health_log_create', { petId, healthLogId: healthLog.id }, req);
    
    res.status(201).json(healthLog);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다.',
        errors: error.errors 
      });
    }
    
    console.error('반려동물 건강 로그 추가 오류:', error);
    res.status(500).json({ message: '건강 로그 추가 중 오류가 발생했습니다.' });
  }
});

// 반려동물 건강 로그 조회
router.get('/pets/:petId/health-logs', isAuthenticated, async (req, res) => {
  try {
    const { petId } = req.params;
    const { recordType, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    // 반려동물 소유자 확인
    const [pet] = await db.select()
      .from(pets)
      .where(and(
        eq(pets.id, parseInt(petId)),
        eq(pets.ownerId, req.user.id)
      ));
    
    if (!pet) {
      return res.status(403).json({ message: '해당 반려동물의 건강 로그를 조회할 권한이 없습니다.' });
    }
    
    const offset = (Number(page) - 1) * Number(limit);
    
    let query = db.select()
      .from(petHealthLogs)
      .where(eq(petHealthLogs.petId, parseInt(petId)))
      .orderBy(desc(petHealthLogs.recordedAt))
      .limit(Number(limit))
      .offset(offset);
    
    // 기록 유형 필터링
    if (recordType) {
      query = query.where(eq(petHealthLogs.recordType, String(recordType)));
    }
    
    // 날짜 범위 필터링
    if (startDate && endDate) {
      query = query.where(
        between(
          petHealthLogs.recordedAt, 
          new Date(String(startDate)), 
          new Date(String(endDate))
        )
      );
    } else if (startDate) {
      query = query.where(gte(petHealthLogs.recordedAt, new Date(String(startDate))));
    } else if (endDate) {
      query = query.where(lte(petHealthLogs.recordedAt, new Date(String(endDate))));
    }
    
    const logs = await query;
    
    // 총 로그 수 조회
    let countQuery = db.select({ count: sql<number>`count(*)` })
      .from(petHealthLogs)
      .where(eq(petHealthLogs.petId, parseInt(petId)));
    
    if (recordType) {
      countQuery = countQuery.where(eq(petHealthLogs.recordType, String(recordType)));
    }
    
    if (startDate && endDate) {
      countQuery = countQuery.where(
        between(
          petHealthLogs.recordedAt, 
          new Date(String(startDate)), 
          new Date(String(endDate))
        )
      );
    } else if (startDate) {
      countQuery = countQuery.where(gte(petHealthLogs.recordedAt, new Date(String(startDate))));
    } else if (endDate) {
      countQuery = countQuery.where(lte(petHealthLogs.recordedAt, new Date(String(endDate))));
    }
    
    const [{ count }] = await countQuery;
    
    res.json({
      logs,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('반려동물 건강 로그 조회 오류:', error);
    res.status(500).json({ message: '건강 로그를 불러오는 중 오류가 발생했습니다.' });
  }
});

// 훈련 진행 로그 조회 (학습자 전용)
router.get('/training-progress', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, page = 1, limit = 20 } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);
    
    let query = db.select({
      log: trainingProgressLogs,
      course: {
        id: courses.id,
        title: courses.title,
        imageUrl: courses.imageUrl
      }
    })
    .from(trainingProgressLogs)
    .leftJoin(courses, eq(trainingProgressLogs.courseId, courses.id))
    .where(eq(trainingProgressLogs.userId, userId))
    .orderBy(desc(trainingProgressLogs.completedAt))
    .limit(Number(limit))
    .offset(offset);
    
    // 코스 ID로 필터링
    if (courseId) {
      query = query.where(eq(trainingProgressLogs.courseId, parseInt(String(courseId))));
    }
    
    const result = await query;
    
    // 총 로그 수 조회
    let countQuery = db.select({ count: sql<number>`count(*)` })
      .from(trainingProgressLogs)
      .where(eq(trainingProgressLogs.userId, userId));
    
    if (courseId) {
      countQuery = countQuery.where(eq(trainingProgressLogs.courseId, parseInt(String(courseId))));
    }
    
    const [{ count }] = await countQuery;
    
    // 결과 데이터 구조 변환
    const formattedLogs = result.map(({ log, course }) => ({
      ...log,
      course
    }));
    
    res.json({
      logs: formattedLogs,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('훈련 진행 로그 조회 오류:', error);
    res.status(500).json({ message: '훈련 진행 로그를 불러오는 중 오류가 발생했습니다.' });
  }
});

// 코스별 훈련 진행 통계 (훈련사 전용)
router.get('/courses/:courseId/progress-stats', isAuthenticated, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    
    // 훈련사 권한 확인
    if (req.user.role !== 'trainer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: '훈련사 권한이 필요합니다.' });
    }
    
    // 코스 소유자 확인
    const [course] = await db.select()
      .from(courses)
      .where(and(
        eq(courses.id, parseInt(courseId)),
        eq(courses.trainerId, userId)
      ));
    
    if (!course && req.user.role !== 'admin') {
      return res.status(403).json({ message: '해당 코스의 통계를 조회할 권한이 없습니다.' });
    }
    
    // 코스 등록 현황 통계
    const [enrollmentStats] = await db.select({
      total: sql<number>`count(*)`,
      active: sql<number>`count(case when ${enrollments.status} = 'active' then 1 end)`,
      completed: sql<number>`count(case when ${enrollments.status} = 'completed' then 1 end)`,
      cancelled: sql<number>`count(case when ${enrollments.status} = 'cancelled' then 1 end)`
    })
    .from(enrollments)
    .where(eq(enrollments.courseId, parseInt(courseId)));
    
    // 진행률 통계 계산
    const progressStats = await db.select({
      userId: trainingProgressLogs.userId,
      username: users.username,
      name: users.name,
      completedLessons: sql<number>`count(case when ${trainingProgressLogs.progressType} = 'lesson_complete' then 1 end)`,
      averageScore: sql<number>`avg(case when ${trainingProgressLogs.score} is not null then ${trainingProgressLogs.score} end)`,
      totalDuration: sql<number>`sum(${trainingProgressLogs.duration})`,
      lastActivity: sql<Date>`max(${trainingProgressLogs.completedAt})`
    })
    .from(trainingProgressLogs)
    .leftJoin(users, eq(trainingProgressLogs.userId, users.id))
    .where(eq(trainingProgressLogs.courseId, parseInt(courseId)))
    .groupBy(trainingProgressLogs.userId, users.username, users.name);
    
    res.json({
      courseId: parseInt(courseId),
      enrollmentStats,
      userProgress: progressStats
    });
  } catch (error) {
    console.error('코스 진행 통계 조회 오류:', error);
    res.status(500).json({ message: '코스 진행 통계를 불러오는 중 오류가 발생했습니다.' });
  }
});

// 보고서 템플릿 목록 조회
router.get('/report-templates', isAuthenticated, async (req, res) => {
  try {
    const { reportType, page = 1, limit = 20 } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);
    
    let query = db.select({
      template: reportTemplates,
      creator: {
        id: users.id,
        username: users.username,
        name: users.name
      }
    })
    .from(reportTemplates)
    .leftJoin(users, eq(reportTemplates.createdById, users.id))
    .where(sql`${reportTemplates.isPublic} = true OR ${reportTemplates.createdById} = ${req.user.id}`)
    .orderBy(desc(reportTemplates.createdAt))
    .limit(Number(limit))
    .offset(offset);
    
    // 보고서 유형 필터링
    if (reportType) {
      query = query.where(eq(reportTemplates.reportType, String(reportType)));
    }
    
    const result = await query;
    
    // 총 템플릿 수 조회
    let countQuery = db.select({ count: sql<number>`count(*)` })
      .from(reportTemplates)
      .where(sql`${reportTemplates.isPublic} = true OR ${reportTemplates.createdById} = ${req.user.id}`);
    
    if (reportType) {
      countQuery = countQuery.where(eq(reportTemplates.reportType, String(reportType)));
    }
    
    const [{ count }] = await countQuery;
    
    // 결과 데이터 구조 변환
    const formattedTemplates = result.map(({ template, creator }) => ({
      ...template,
      creator
    }));
    
    res.json({
      templates: formattedTemplates,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('보고서 템플릿 목록 조회 오류:', error);
    res.status(500).json({ message: '보고서 템플릿을 불러오는 중 오류가 발생했습니다.' });
  }
});

// 보고서 생성
router.post('/reports/generate', isAuthenticated, async (req, res) => {
  try {
    const { templateId, name, description, reportType, dateRange, petId } = req.body;
    
    if (!templateId && !reportType) {
      return res.status(400).json({ message: '템플릿 ID 또는 보고서 유형이 필요합니다.' });
    }
    
    if (!name) {
      return res.status(400).json({ message: '보고서 이름은 필수입니다.' });
    }
    
    // 템플릿 정보 가져오기 (있는 경우)
    let templateConfig = null;
    let resolvedReportType = reportType;
    
    if (templateId) {
      const [template] = await db.select()
        .from(reportTemplates)
        .where(eq(reportTemplates.id, parseInt(templateId)));
      
      if (!template) {
        return res.status(404).json({ message: '템플릿을 찾을 수 없습니다.' });
      }
      
      templateConfig = template.config;
      resolvedReportType = template.reportType;
    }
    
    // 보고서 데이터 생성
    let reportData = null;
    
    // 날짜 범위 파싱
    const parsedDateRange = dateRange ? {
      start: new Date(dateRange.start),
      end: new Date(dateRange.end)
    } : null;
    
    // 보고서 유형에 따라 데이터 생성 로직 구현
    if (resolvedReportType === 'user_activity') {
      // 사용자 활동 보고서 생성 로직
      const activityLogs = await db.select()
        .from(userActivityLogs)
        .where(eq(userActivityLogs.userId, req.user.id))
        .orderBy(desc(userActivityLogs.createdAt));
      
      // 활동 유형별 통계
      const activityTypeCounts = {};
      for (const log of activityLogs) {
        activityTypeCounts[log.activityType] = (activityTypeCounts[log.activityType] || 0) + 1;
      }
      
      reportData = {
        totalActivities: activityLogs.length,
        activityTypeCounts,
        recentActivities: activityLogs.slice(0, 10),
        generatedAt: new Date()
      };
    } else if (resolvedReportType === 'pet_health' && petId) {
      // 반려동물 건강 보고서 생성 로직
      const [pet] = await db.select()
        .from(pets)
        .where(and(
          eq(pets.id, parseInt(petId)),
          eq(pets.ownerId, req.user.id)
        ));
      
      if (!pet) {
        return res.status(403).json({ message: '해당 반려동물의 보고서를 생성할 권한이 없습니다.' });
      }
      
      const healthLogs = await db.select()
        .from(petHealthLogs)
        .where(eq(petHealthLogs.petId, parseInt(petId)))
        .orderBy(desc(petHealthLogs.recordedAt));
      
      // 건강 기록 유형별 통계
      const recordTypeCounts = {};
      for (const log of healthLogs) {
        recordTypeCounts[log.recordType] = (recordTypeCounts[log.recordType] || 0) + 1;
      }
      
      // 체중 변화 추이 (체중 기록만 필터링)
      const weightLogs = healthLogs
        .filter(log => log.recordType === 'weight')
        .map(log => ({
          date: log.recordedAt,
          value: parseFloat(log.value),
          unit: log.unit
        }));
      
      reportData = {
        pet: {
          id: pet.id,
          name: pet.name,
          breed: pet.breed,
          age: pet.age
        },
        totalRecords: healthLogs.length,
        recordTypeCounts,
        weightTrend: weightLogs,
        recentRecords: healthLogs.slice(0, 10),
        generatedAt: new Date()
      };
    } else if (resolvedReportType === 'training_progress') {
      // 훈련 진행 보고서 생성 로직
      const progressLogs = await db.select({
        log: trainingProgressLogs,
        course: {
          id: courses.id,
          title: courses.title
        }
      })
      .from(trainingProgressLogs)
      .leftJoin(courses, eq(trainingProgressLogs.courseId, courses.id))
      .where(eq(trainingProgressLogs.userId, req.user.id))
      .orderBy(desc(trainingProgressLogs.completedAt));
      
      // 코스별 진행 통계
      const courseProgress = {};
      for (const { log, course } of progressLogs) {
        if (!courseProgress[log.courseId]) {
          courseProgress[log.courseId] = {
            courseId: log.courseId,
            courseTitle: course.title,
            lessonCompleted: 0,
            quizCompleted: 0,
            assignmentCompleted: 0,
            totalDuration: 0,
            averageScore: 0,
            scoresCount: 0,
            scoreSum: 0
          };
        }
        
        const progress = courseProgress[log.courseId];
        
        if (log.progressType === 'lesson_complete') {
          progress.lessonCompleted++;
        } else if (log.progressType === 'quiz_complete') {
          progress.quizCompleted++;
        } else if (log.progressType === 'assignment_submit') {
          progress.assignmentCompleted++;
        }
        
        if (log.duration) {
          progress.totalDuration += log.duration;
        }
        
        if (log.score !== null) {
          progress.scoreSum += log.score;
          progress.scoresCount++;
        }
      }
      
      // 평균 점수 계산
      for (const courseId in courseProgress) {
        const progress = courseProgress[courseId];
        if (progress.scoresCount > 0) {
          progress.averageScore = progress.scoreSum / progress.scoresCount;
        }
        delete progress.scoreSum;
        delete progress.scoresCount;
      }
      
      reportData = {
        totalLogs: progressLogs.length,
        courseProgress: Object.values(courseProgress),
        recentProgress: progressLogs.slice(0, 10).map(({ log, course }) => ({
          ...log,
          courseTitle: course.title
        })),
        generatedAt: new Date()
      };
    } else {
      return res.status(400).json({ message: '지원되지 않는 보고서 유형입니다.' });
    }
    
    // 보고서 저장
    const [report] = await db.insert(generatedReports)
      .values({
        templateId: templateId ? parseInt(templateId) : null,
        userId: req.user.id,
        petId: petId ? parseInt(petId) : null,
        name,
        description: description || null,
        reportType: resolvedReportType,
        dateRange: parsedDateRange,
        data: reportData,
        isPublic: false
      })
      .returning();
    
    // 사용자 활동 로그 추가
    await logUserActivity(req.user.id, 'report_generate', { reportId: report.id, reportType: resolvedReportType }, req);
    
    res.status(201).json(report);
  } catch (error) {
    console.error('보고서 생성 오류:', error);
    res.status(500).json({ message: '보고서 생성 중 오류가 발생했습니다.' });
  }
});

// 생성된 보고서 목록 조회
router.get('/reports', isAuthenticated, async (req, res) => {
  try {
    const { reportType, page = 1, limit = 20 } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);
    
    let query = db.select()
      .from(generatedReports)
      .where(eq(generatedReports.userId, req.user.id))
      .orderBy(desc(generatedReports.createdAt))
      .limit(Number(limit))
      .offset(offset);
    
    // 보고서 유형 필터링
    if (reportType) {
      query = query.where(eq(generatedReports.reportType, String(reportType)));
    }
    
    const reports = await query;
    
    // 총 보고서 수 조회
    let countQuery = db.select({ count: sql<number>`count(*)` })
      .from(generatedReports)
      .where(eq(generatedReports.userId, req.user.id));
    
    if (reportType) {
      countQuery = countQuery.where(eq(generatedReports.reportType, String(reportType)));
    }
    
    const [{ count }] = await countQuery;
    
    res.json({
      reports,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('보고서 목록 조회 오류:', error);
    res.status(500).json({ message: '보고서 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

// 보고서 상세 조회
router.get('/reports/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [report] = await db.select()
      .from(generatedReports)
      .where(eq(generatedReports.id, parseInt(id)));
    
    if (!report) {
      return res.status(404).json({ message: '보고서를 찾을 수 없습니다.' });
    }
    
    // 보고서 소유자 또는 공개 보고서 확인
    if (report.userId !== req.user.id && !report.isPublic) {
      return res.status(403).json({ message: '해당 보고서를 조회할 권한이 없습니다.' });
    }
    
    // 조회수 증가
    await db.update(generatedReports)
      .set({ accessCount: report.accessCount + 1 })
      .where(eq(generatedReports.id, parseInt(id)));
    
    // 템플릿 정보 조회 (있는 경우)
    let template = null;
    if (report.templateId) {
      const [templateResult] = await db.select()
        .from(reportTemplates)
        .where(eq(reportTemplates.id, report.templateId));
      
      template = templateResult;
    }
    
    res.json({
      ...report,
      template
    });
  } catch (error) {
    console.error('보고서 상세 조회 오류:', error);
    res.status(500).json({ message: '보고서 정보를 불러오는 중 오류가 발생했습니다.' });
  }
});

// 대시보드 요약 통계 (관리자 전용)
router.get('/dashboard/stats', isAdmin, async (req, res) => {
  try {
    // 전체 사용자 수
    const [userCount] = await db.select({ count: sql<number>`count(*)` })
      .from(users);
    
    // 역할별 사용자 수
    const roleCounts = await db.select({
      role: users.role,
      count: sql<number>`count(*)`
    })
    .from(users)
    .groupBy(users.role);
    
    // 최근 가입자 수 (지난 30일)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const [recentUserCount] = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo));
    
    // 전체 반려동물 수
    const [petCount] = await db.select({ count: sql<number>`count(*)` })
      .from(pets);
    
    // 전체 코스 수
    const [courseCount] = await db.select({ count: sql<number>`count(*)` })
      .from(courses);
    
    // 전체 등록 수
    const [enrollmentCount] = await db.select({ count: sql<number>`count(*)` })
      .from(enrollments);
    
    // 최근 활동 로그 (최근 100개)
    const recentActivities = await db.select({
      log: userActivityLogs,
      user: {
        id: users.id,
        username: users.username,
        name: users.name
      }
    })
    .from(userActivityLogs)
    .leftJoin(users, eq(userActivityLogs.userId, users.id))
    .orderBy(desc(userActivityLogs.createdAt))
    .limit(100);
    
    // 결과 데이터 구조 변환
    const formattedActivities = recentActivities.map(({ log, user }) => ({
      ...log,
      user
    }));
    
    res.json({
      users: {
        total: userCount.count,
        byRole: roleCounts.reduce((acc, { role, count }) => {
          acc[role] = count;
          return acc;
        }, {}),
        recentSignups: recentUserCount.count
      },
      pets: {
        total: petCount.count
      },
      courses: {
        total: courseCount.count
      },
      enrollments: {
        total: enrollmentCount.count
      },
      recentActivities: formattedActivities
    });
  } catch (error) {
    console.error('대시보드 통계 조회 오류:', error);
    res.status(500).json({ message: '대시보드 통계를 불러오는 중 오류가 발생했습니다.' });
  }
});

export default router;