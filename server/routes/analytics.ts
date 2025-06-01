import type { Express } from "express";
import { db } from "../db";
import { trainingSessions, pets, users, courses, courseEnrollments, events } from "@shared/schema";
import { eq, desc, and, gte, lte, count, avg, sum, inArray, isNotNull } from "drizzle-orm";

export function registerAnalyticsRoutes(app: Express) {
  // 훈련 진행도 데이터 가져오기
  app.get("/api/analytics/training-progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // 사용자의 반려동물들 가져오기
      const userPets = await db.select().from(pets).where(eq(pets.ownerId, userId));
      
      if (userPets.length === 0) {
        return res.json([]);
      }
      
      const petIds = userPets.map(pet => pet.id);
      
      // 각 스킬별 최신 진행도 가져오기
      const trainingProgress = await db
        .select({
          skill: trainingSessions.skill,
          progress: trainingSessions.progress,
          level: trainingSessions.level,
          sessionCount: count(trainingSessions.id),
          avgScore: avg(trainingSessions.score),
          lastSession: trainingSessions.sessionDate
        })
        .from(trainingSessions)
        .where(inArray(trainingSessions.petId, petIds))
        .groupBy(trainingSessions.skill)
        .orderBy(desc(trainingSessions.sessionDate));
      
      res.json(trainingProgress);
    } catch (error) {
      console.error('Error fetching training progress:', error);
      res.status(500).json({ error: 'Failed to fetch training progress' });
    }
  });

  // 학습 통계 데이터 가져오기
  app.get("/api/analytics/learning-stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // 사용자의 반려동물들 가져오기
      const userPets = await db.select().from(pets).where(eq(pets.ownerId, userId));
      const petIds = userPets.map(pet => pet.id);
      
      if (petIds.length === 0) {
        return res.json({
          totalSessions: 0,
          completedCourses: 0,
          currentStreak: 0,
          averageScore: 0,
          totalHours: 0,
          achievements: 0
        });
      }
      
      // 총 세션 수
      const totalSessionsResult = await db
        .select({ count: count() })
        .from(trainingSessions)
        .where(inArray(trainingSessions.petId, petIds));
      
      // 완료된 코스 수
      const completedCoursesResult = await db
        .select({ count: count() })
        .from(courseEnrollments)
        .where(and(
          eq(courseEnrollments.userId, userId),
          eq(courseEnrollments.status, 'completed')
        ));
      
      // 평균 점수
      const avgScoreResult = await db
        .select({ avgScore: avg(trainingSessions.score) })
        .from(trainingSessions)
        .where(and(
          inArray(trainingSessions.petId, petIds),
          isNotNull(trainingSessions.score)
        ));
      
      // 총 훈련 시간 (분 단위)
      const totalDurationResult = await db
        .select({ totalDuration: sum(trainingSessions.duration) })
        .from(trainingSessions)
        .where(and(
          inArray(trainingSessions.petId, petIds),
          isNotNull(trainingSessions.duration)
        ));
      
      const stats = {
        totalSessions: totalSessionsResult[0]?.count || 0,
        completedCourses: completedCoursesResult[0]?.count || 0,
        currentStreak: 7, // 연속 학습일 - 복잡한 계산이므로 일단 고정값
        averageScore: Math.round(Number(avgScoreResult[0]?.avgScore) || 0),
        totalHours: Math.round((Number(totalDurationResult[0]?.totalDuration) || 0) / 60),
        achievements: 15 // 업적 시스템이 구현되면 실제 데이터로 변경
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Error fetching learning stats:', error);
      res.status(500).json({ error: 'Failed to fetch learning stats' });
    }
  });

  // 월별 진행도 데이터 가져오기
  app.get("/api/analytics/monthly-progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // 사용자의 반려동물들 가져오기
      const userPets = await db.select().from(pets).where(eq(pets.ownerId, userId));
      const petIds = userPets.map(pet => pet.id);
      
      if (petIds.length === 0) {
        return res.json([]);
      }
      
      // 최근 6개월 데이터 가져오기
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const monthlyData = await db
        .select({
          month: trainingSessions.sessionDate,
          sessions: count(trainingSessions.id),
          avgScore: avg(trainingSessions.score)
        })
        .from(trainingSessions)
        .where(and(
          inArray(trainingSessions.petId, petIds),
          gte(trainingSessions.sessionDate, sixMonthsAgo)
        ))
        .groupBy(trainingSessions.sessionDate)
        .orderBy(trainingSessions.sessionDate);
      
      // 월별로 그룹핑
      const monthlyProgress = monthlyData.reduce((acc, session) => {
        const month = new Date(session.month).toLocaleDateString('ko-KR', { month: 'long' });
        
        if (!acc[month]) {
          acc[month] = {
            month,
            sessions: 0,
            totalScore: 0,
            sessionCount: 0
          };
        }
        
        acc[month].sessions += Number(session.sessions);
        acc[month].totalScore += Number(session.avgScore) || 0;
        acc[month].sessionCount++;
        
        return acc;
      }, {} as Record<string, any>);
      
      // 평균 점수 계산 및 배열로 변환
      const result = Object.values(monthlyProgress).map((data: any) => ({
        month: data.month,
        sessions: data.sessions,
        score: Math.round(data.sessionCount > 0 ? data.totalScore / data.sessionCount : 0)
      }));
      
      res.json(result);
    } catch (error) {
      console.error('Error fetching monthly progress:', error);
      res.status(500).json({ error: 'Failed to fetch monthly progress' });
    }
  });

  // 반려동물별 상세 진행도
  app.get("/api/analytics/pet-progress/:petId", async (req, res) => {
    try {
      const petId = parseInt(req.params.petId);
      
      const petProgress = await db
        .select({
          skill: trainingSessions.skill,
          progress: trainingSessions.progress,
          level: trainingSessions.level,
          score: trainingSessions.score,
          sessionDate: trainingSessions.sessionDate,
          duration: trainingSessions.duration,
          notes: trainingSessions.notes
        })
        .from(trainingSessions)
        .where(eq(trainingSessions.petId, petId))
        .orderBy(desc(trainingSessions.sessionDate));
      
      res.json(petProgress);
    } catch (error) {
      console.error('Error fetching pet progress:', error);
      res.status(500).json({ error: 'Failed to fetch pet progress' });
    }
  });

  // 새 훈련 세션 추가
  app.post("/api/analytics/training-session", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const sessionData = req.body;
      
      // 사용자 소유의 반려동물인지 확인
      const pet = await db.select().from(pets).where(eq(pets.id, sessionData.petId));
      if (!pet.length || pet[0].ownerId !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      const newSession = await db
        .insert(trainingSessions)
        .values({
          petId: sessionData.petId,
          trainerId: sessionData.trainerId || null,
          skill: sessionData.skill,
          progress: sessionData.progress,
          level: sessionData.level,
          duration: sessionData.duration,
          score: sessionData.score,
          notes: sessionData.notes
        })
        .returning();
      
      res.status(201).json(newSession[0]);
    } catch (error) {
      console.error('Error creating training session:', error);
      res.status(500).json({ error: 'Failed to create training session' });
    }
  });

  // Enhanced Dashboard Analytics
  app.get('/api/analytics/dashboard', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    try {
      const userId = req.user.id;

      // 사용자의 강의 수강 정보 조회
      const userCourses = await db.select({
        id: courses.id,
        status: courses.status,
        startDate: courses.startDate,
        endDate: courses.endDate
      })
      .from(courseEnrollments)
      .innerJoin(courses, eq(courses.id, courseEnrollments.courseId))
      .where(eq(courseEnrollments.userId, userId));

      // 예정된 이벤트 조회
      const upcomingEvents = await db.select()
        .from(events)
        .where(
          and(
            gte(events.date, new Date()),
            lte(events.date, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) // 일주일 내
          )
        );

      // 사용자의 반려동물들 조회
      const userPets = await db.select().from(pets).where(eq(pets.ownerId, userId));
      const petIds = userPets.map(pet => pet.id);

      // 훈련 세션 데이터 조회
      let recentSessions = [];
      let skillProgress = [];
      if (petIds.length > 0) {
        recentSessions = await db
          .select()
          .from(trainingSessions)
          .where(inArray(trainingSessions.petId, petIds))
          .orderBy(desc(trainingSessions.sessionDate))
          .limit(20);

        // 스킬별 진행도 계산
        const skillData = await db
          .select({
            skill: trainingSessions.skill,
            avgProgress: avg(trainingSessions.progress),
            maxLevel: trainingSessions.level
          })
          .from(trainingSessions)
          .where(inArray(trainingSessions.petId, petIds))
          .groupBy(trainingSessions.skill);

        skillProgress = skillData.map(skill => ({
          name: skill.skill,
          level: skill.maxLevel,
          progress: Math.round(Number(skill.avgProgress) || 0)
        }));
      }

      // 완료된 강의 수
      const completedCourses = userCourses.filter(course => 
        course.endDate && new Date(course.endDate) < new Date()
      ).length;

      // 학습 연속일 계산 (최근 세션 기반)
      const learningStreak = recentSessions.length > 0 ? 
        Math.min(recentSessions.length, 30) : 0;

      // 주간 진도율 계산
      const weeklyProgress = userCourses.length > 0 ? 
        Math.floor((completedCourses / userCourses.length) * 100) : 0;

      const analyticsData = {
        totalCourses: userCourses.length,
        completedCourses: completedCourses,
        upcomingEvents: upcomingEvents.length,
        learningStreak: learningStreak,
        weeklyProgress: weeklyProgress,
        monthlyGoals: {
          completed: Math.min(completedCourses, 5),
          total: 5
        },
        skillProgress: skillProgress.length > 0 ? skillProgress : [
          {
            name: "기초 복종 훈련",
            level: 1,
            progress: 25
          },
          {
            name: "행동 교정",
            level: 1,
            progress: 10
          }
        ],
        recentAchievements: [
          {
            id: 1,
            title: "플랫폼 가입 완료",
            date: new Date().toISOString().split('T')[0],
            type: "시작"
          },
          {
            id: 2,
            title: "첫 번째 로그인",
            date: new Date().toISOString().split('T')[0],
            type: "활동"
          }
        ]
      };

      res.json(analyticsData);
    } catch (error) {
      console.error('Dashboard analytics error:', error);
      res.status(500).json({ message: '분석 데이터를 가져오는 중 오류가 발생했습니다.' });
    }
  });
}

export default registerAnalyticsRoutes;