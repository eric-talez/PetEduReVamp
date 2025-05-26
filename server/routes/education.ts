import type { Express } from "express";
import { db } from "../db";
import { courses, courseEnrollments, users, pets } from "@shared/schema";
import { eq, desc, and, gte, lte, count, like, or } from "drizzle-orm";

export function registerEducationRoutes(app: Express) {
  // 강의 목록 가져오기 (검색 및 필터링 포함)
  app.get("/api/education/courses", async (req, res) => {
    try {
      const { search, category, level } = req.query;
      
      let whereConditions: any[] = [];
      
      // 검색 조건 추가
      if (search) {
        whereConditions.push(
          or(
            like(courses.title, `%${search}%`),
            like(courses.description, `%${search}%`)
          )
        );
      }
      
      // 카테고리 필터
      if (category && category !== 'all') {
        whereConditions.push(eq(courses.category, category as string));
      }
      
      // 난이도 필터
      if (level && level !== 'all') {
        whereConditions.push(eq(courses.difficulty, level as string));
      }
      
      const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;
      
      // 강의 목록 조회 - 기본 필드만 사용
      const courseList = await db
        .select()
        .from(courses)
        .where(whereClause)
        .orderBy(desc(courses.createdAt));
      
      res.json(courseList);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 특정 강의 상세 정보 가져오기
  app.get("/api/education/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      
      const course = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1);
      
      if (!course[0]) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      res.json(course[0]);
    } catch (error) {
      console.error('Error fetching course details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 강의 등록하기
  app.post("/api/education/enroll/:courseId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const courseId = parseInt(req.params.courseId);
      const userId = req.user!.id;
      const { petId } = req.body;

      // 강의 존재 확인
      const course = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1);

      if (!course[0]) {
        return res.status(404).json({ message: 'Course not found' });
      }

      // 이미 등록되어 있는지 확인
      const existingEnrollment = await db
        .select()
        .from(courseEnrollments)
        .where(and(
          eq(courseEnrollments.userId, userId),
          eq(courseEnrollments.courseId, courseId)
        ))
        .limit(1);

      if (existingEnrollment[0]) {
        return res.status(400).json({ message: 'Already enrolled in this course' });
      }

      // 수강 정원 확인 (courseSchedules 테이블과 연동해야 하지만 기본 강의 정원으로 체크)
      if (course[0].maxParticipants && course[0].maxParticipants > 0) {
        // 현재 등록된 학생 수 확인
        const enrollmentCount = await db
          .select({ count: count() })
          .from(courseEnrollments)
          .where(eq(courseEnrollments.courseId, courseId));

        if (enrollmentCount[0]?.count >= course[0].maxParticipants) {
          return res.status(400).json({ message: 'Course is full' });
        }
      }

      // 등록 생성
      const enrollment = await db
        .insert(courseEnrollments)
        .values({
          userId,
          courseId,
          petId: petId || null,
          status: 'enrolled',
          progress: 0,
          enrolledAt: new Date()
        })
        .returning();

      // 스키마에 currentParticipants 필드가 없으므로 제거

      res.status(201).json(enrollment[0]);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 사용자의 등록된 강의 목록 가져오기
  app.get("/api/education/my-courses", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const userId = req.user!.id;

      const enrollments = await db
        .select({
          id: courseEnrollments.id,
          status: courseEnrollments.status,
          progress: courseEnrollments.progress,
          enrolledAt: courseEnrollments.enrolledAt,
          completedAt: courseEnrollments.completedAt,
          course: {
            id: courses.id,
            title: courses.title,
            description: courses.description,
            category: courses.category,
            difficulty: courses.difficulty,
            duration: courses.duration,
            trainerId: courses.trainerId,
            instituteId: courses.instituteId,
            image: courses.image,
            price: courses.price
          }
        })
        .from(courseEnrollments)
        .innerJoin(courses, eq(courseEnrollments.courseId, courses.id))
        .where(eq(courseEnrollments.userId, userId))
        .orderBy(desc(courseEnrollments.enrolledAt));

      res.json(enrollments);
    } catch (error) {
      console.error('Error fetching user courses:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 강의 진행도 업데이트
  app.patch("/api/education/courses/:courseId/progress", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const courseId = parseInt(req.params.courseId);
      const userId = req.user!.id;
      const { progress } = req.body;

      // 진행도 유효성 검사
      if (progress < 0 || progress > 100) {
        return res.status(400).json({ message: 'Progress must be between 0 and 100' });
      }

      const updateData: any = { progress };
      
      // 100% 완료시 완료 날짜 설정
      if (progress === 100) {
        updateData.status = 'completed';
        updateData.completedAt = new Date();
      }

      const enrollment = await db
        .update(courseEnrollments)
        .set(updateData)
        .where(and(
          eq(courseEnrollments.userId, userId),
          eq(courseEnrollments.courseId, courseId)
        ))
        .returning();

      if (!enrollment[0]) {
        return res.status(404).json({ message: 'Enrollment not found' });
      }

      res.json(enrollment[0]);
    } catch (error) {
      console.error('Error updating course progress:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 강의 카테고리 목록 가져오기
  app.get("/api/education/categories", async (req, res) => {
    try {
      const categories = [
        { id: 'basic', name: '기초 훈련', description: '반려동물의 기본적인 훈련 과정' },
        { id: 'advanced', name: '고급 훈련', description: '전문적인 훈련 기법과 스킬' },
        { id: 'behavior', name: '행동 교정', description: '문제 행동 개선 및 교정' },
        { id: 'agility', name: '민첩성 훈련', description: '운동 능력과 민첩성 향상' },
        { id: 'therapy', name: '치료 보조', description: '치료 보조견 훈련 과정' },
        { id: 'social', name: '사회화', description: '다른 동물 및 사람과의 사회화' }
      ];
      
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}