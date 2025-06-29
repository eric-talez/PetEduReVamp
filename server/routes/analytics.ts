import type { Express } from "express";
import { db } from "../db";
import { pets, users, courses, events } from "../../shared/schema";
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
      
      // Mock training progress data
      const trainingProgress = [
        {
          skill: "기본복종",
          progress: 75,
          level: "중급",
          sessionCount: 8,
          avgScore: 85,
          lastSession: new Date().toISOString()
        },
        {
          skill: "사회화",
          progress: 60,
          level: "초급",
          sessionCount: 5,
          avgScore: 78,
          lastSession: new Date(Date.now() - 24*60*60*1000).toISOString()
        }
      ];
      
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
      
      // Mock learning stats data
      const stats = {
        totalSessions: 25,
        completedCourses: 3,
        currentStreak: 7,
        averageScore: 85,
        totalHours: 12,
        achievements: 15
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
      
      // Mock monthly data
      const monthlyProgress = [
        { month: '1월', sessions: 15, avgScore: 82 },
        { month: '2월', sessions: 18, avgScore: 84 },
        { month: '3월', sessions: 22, avgScore: 86 },
        { month: '4월', sessions: 20, avgScore: 85 },
        { month: '5월', sessions: 25, avgScore: 87 },
        { month: '6월', sessions: 28, avgScore: 89 }
      ];
      
      res.json(monthlyProgress);
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