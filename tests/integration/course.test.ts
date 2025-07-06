import request from 'supertest';
import { app } from '../../server/index';
import { storage } from '../../server/storage';

describe('Course API Integration Tests', () => {
  let authToken: string;
  let trainerId: string;
  let courseId: string;

  beforeAll(async () => {
    // 테스트용 훈련사 계정 생성 및 로그인
    const trainerData = {
      email: 'test-trainer@example.com',
      password: 'testpassword123',
      name: '테스트 훈련사',
      role: 'trainer'
    };
    
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(trainerData);
    
    trainerId = registerResponse.body.data.id;

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: trainerData.email,
        password: trainerData.password
      });
    
    authToken = loginResponse.body.data.token;
  });

  afterAll(async () => {
    // 테스트 데이터 정리
    await storage.deleteUser(trainerId);
    if (courseId) {
      await storage.deleteCourse(courseId);
    }
  });

  describe('POST /api/courses', () => {
    it('강좌를 성공적으로 생성해야 함', async () => {
      const courseData = {
        title: '테스트 강좌',
        description: '테스트용 강좌 설명입니다. 최소 10자 이상의 설명이 필요합니다.',
        category: '기초훈련',
        level: 'beginner',
        duration: '8주',
        maxStudents: 10,
        price: 350000,
        objectives: ['기본 명령어 학습', '사회성 향상'],
        requirements: '건강한 반려견'
      };

      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(courseData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(courseData.title);
      expect(response.body.data.status).toBe('draft');
      
      courseId = response.body.data.id;
    });

    it('잘못된 데이터로 강좌 생성 시 400 오류 반환', async () => {
      const invalidCourseData = {
        title: '', // 빈 제목
        description: '짧음', // 너무 짧은 설명
        level: 'invalid_level' // 잘못된 레벨
      };

      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidCourseData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('요청 데이터 오류');
    });

    it('인증 없이 강좌 생성 시 401 오류 반환', async () => {
      const courseData = {
        title: '무인가 강좌',
        description: '인증 없이 생성하려는 강좌'
      };

      await request(app)
        .post('/api/courses')
        .send(courseData)
        .expect(401);
    });
  });

  describe('GET /api/courses/trainer/:trainerId', () => {
    it('훈련사의 강좌 목록을 조회해야 함', async () => {
      const response = await request(app)
        .get(`/api/courses/trainer/${trainerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/courses/:courseId/status', () => {
    it('관리자가 강좌 상태를 승인으로 변경해야 함', async () => {
      // 관리자 토큰 필요 (실제 구현에서는 관리자 계정 생성)
      const adminToken = authToken; // 임시로 사용

      const response = await request(app)
        .put(`/api/courses/${courseId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'approved' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/courses/:courseId/enroll', () => {
    it('학생이 강좌에 수강 신청해야 함', async () => {
      // 학생 계정 생성 및 로그인
      const studentData = {
        email: 'test-student@example.com',
        password: 'testpassword123',
        name: '테스트 학생',
        role: 'student'
      };

      await request(app)
        .post('/api/auth/register')
        .send(studentData);

      const studentLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: studentData.email,
          password: studentData.password
        });

      const studentToken = studentLogin.body.data.token;

      const response = await request(app)
        .post(`/api/courses/${courseId}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          paymentMethod: 'card',
          paymentAmount: 350000
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('pending');
    });
  });

  describe('GET /api/courses/:courseId/revenue', () => {
    it('강좌 수익 정보를 조회해야 함', async () => {
      const response = await request(app)
        .get(`/api/courses/${courseId}/revenue`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalRevenue');
      expect(response.body.data).toHaveProperty('trainerRevenue');
      expect(response.body.data).toHaveProperty('enrollmentCount');
    });
  });
});