/**
 * Java Spring Boot 스타일의 CourseService
 * Node.js/TypeScript로 구현된 Spring Boot 패턴
 */

import { storage } from '../storage';

export class CourseService {
  
  /**
   * 모든 강좌 조회
   * @GetMapping("/api/courses") 스타일
   */
  async findAll(): Promise<any[]> {
    console.log('[CourseService] findAll() 호출됨');
    return await storage.getAllCourses();
  }

  /**
   * ID로 강좌 조회
   * @GetMapping("/api/courses/{id}") 스타일
   */
  async findById(id: number): Promise<any | null> {
    console.log(`[CourseService] findById(${id}) 호출됨`);
    return await storage.getCourse(id);
  }

  /**
   * 강좌 생성
   * @PostMapping("/api/courses") 스타일
   */
  async save(courseData: any): Promise<any> {
    console.log('[CourseService] save() 호출됨', courseData);
    return await storage.createCourse(courseData);
  }

  /**
   * 사용자의 강좌 조회
   * @GetMapping("/api/courses/user/{userId}") 스타일
   */
  async findByUserId(userId: number): Promise<any[]> {
    console.log(`[CourseService] findByUserId(${userId}) 호출됨`);
    return await storage.getCoursesByUserId(userId);
  }

  /**
   * 강좌 등록
   * @PostMapping("/api/courses/{courseId}/enroll") 스타일
   */
  async enrollUser(userId: number, courseId: number): Promise<any> {
    console.log(`[CourseService] enrollUser(${userId}, ${courseId}) 호출됨`);
    return await storage.enrollUserInCourse(userId, courseId);
  }

  /**
   * 강좌 서비스 헬스 체크
   */
  health(): { status: string; service: string; timestamp: Date } {
    console.log('[CourseService] health() 호출됨');
    return {
      status: 'UP',
      service: 'PetEdu Course Service (Java Style)',
      timestamp: new Date()
    };
  }
}

// 싱글톤 패턴 (Spring Boot의 @Service Bean과 유사)
export const courseService = new CourseService();