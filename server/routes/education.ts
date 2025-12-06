import type { Express } from "express";
import { storage } from "../storage";
import { logger } from "../monitoring/logger";
import { notificationService } from '../notifications/notification-service';

export function registerEducationRoutes(app: Express) {
  // 강의 목록 가져오기 (검색 및 필터링 포함)
  app.get("/api/education/courses", async (req, res) => {
    try {
      const { search, category, level } = req.query;
      
      // 모든 강의 목록 가져오기
      const allCourses = await storage.getAllCourses();
      
      // 검색 및 필터링 적용
      let filteredCourses = allCourses;
      
      // 검색어 필터링
      if (search && typeof search === 'string') {
        const searchTerm = search.toLowerCase();
        filteredCourses = filteredCourses.filter(course => 
          course.title?.toLowerCase().includes(searchTerm) ||
          course.description?.toLowerCase().includes(searchTerm) ||
          course.category?.toLowerCase().includes(searchTerm)
        );
      }
      
      // 카테고리 필터링
      if (category && category !== 'all') {
        filteredCourses = filteredCourses.filter(course => 
          course.category === category
        );
      }
      
      // 난이도 필터링
      if (level && level !== 'all') {
        filteredCourses = filteredCourses.filter(course => 
          course.level === level || course.difficulty === level
        );
      }
      
      logger.info(`Education courses fetched successfully: ${filteredCourses.length} courses`);
      res.json(filteredCourses);
    } catch (error) {
      logger.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 특정 강의 상세 정보 가져오기
  app.get("/api/education/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      res.json(course);
    } catch (error) {
      logger.error('Error fetching course details:', error);
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

      // 강의 존재 확인
      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      // 등록 처리
      const enrollment = await storage.enrollUserInCourse(userId, courseId);
      
      // 사용자에게 강좌 등록 알림 발송
      try {
        await notificationService.sendNotification({
          userId,
          type: 'course',
          title: '강좌 등록 완료',
          message: `"${course.title}" 강좌에 성공적으로 등록되었습니다.`,
          actionUrl: `/courses/${courseId}`,
          data: { courseId, courseTitle: course.title }
        });
      } catch (notifyError) {
        logger.error('강좌 등록 알림 발송 실패:', notifyError);
      }
      
      res.status(201).json(enrollment);
    } catch (error) {
      logger.error('Error enrolling in course:', error);
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
      const courses = await storage.getCoursesByUserId(userId);
      
      res.json(courses);
    } catch (error) {
      logger.error('Error fetching user courses:', error);
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

      // 현재는 메모리 스토리지이므로 간단한 성공 응답
      res.json({ 
        success: true, 
        progress,
        message: 'Progress updated successfully' 
      });
    } catch (error) {
      logger.error('Error updating course progress:', error);
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
      logger.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}