import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from './error-handler';

// 요청 검증 미들웨어
export const validateRequest = (schema: {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Body 검증
      if (schema.body) {
        const result = schema.body.safeParse(req.body);
        if (!result.success) {
          const errors = result.error.errors.map(err => 
            `${err.path.join('.')}: ${err.message}`
          ).join(', ');
          throw new ValidationError(`요청 데이터 오류: ${errors}`);
        }
        req.body = result.data;
      }

      // Query 검증
      if (schema.query) {
        const result = schema.query.safeParse(req.query);
        if (!result.success) {
          const errors = result.error.errors.map(err => 
            `${err.path.join('.')}: ${err.message}`
          ).join(', ');
          throw new ValidationError(`쿼리 파라미터 오류: ${errors}`);
        }
        req.query = result.data;
      }

      // Params 검증
      if (schema.params) {
        const result = schema.params.safeParse(req.params);
        if (!result.success) {
          const errors = result.error.errors.map(err => 
            `${err.path.join('.')}: ${err.message}`
          ).join(', ');
          throw new ValidationError(`경로 파라미터 오류: ${errors}`);
        }
        req.params = result.data;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// 강좌 생성 검증 스키마
export const createCourseSchema = {
  body: z.object({
    title: z.string().min(1, '강좌 제목은 필수입니다.').max(100, '강좌 제목은 100자 이하여야 합니다.'),
    description: z.string().min(10, '강좌 설명은 최소 10자 이상이어야 합니다.'),
    category: z.string().min(1, '카테고리는 필수입니다.'),
    level: z.enum(['beginner', 'intermediate', 'advanced'], {
      errorMap: () => ({ message: '레벨은 beginner, intermediate, advanced 중 하나여야 합니다.' })
    }),
    duration: z.string().min(1, '기간은 필수입니다.'),
    maxStudents: z.number().min(1, '최대 수강생 수는 1명 이상이어야 합니다.').max(50, '최대 수강생 수는 50명 이하여야 합니다.'),
    price: z.number().min(0, '가격은 0원 이상이어야 합니다.'),
    objectives: z.array(z.string()).min(1, '학습 목표는 최소 1개 이상이어야 합니다.'),
    requirements: z.string().optional(),
    curriculum: z.array(z.object({
      week: z.number(),
      topic: z.string(),
      content: z.string(),
      objectives: z.array(z.string())
    })).optional()
  })
};

// 수익 조회 검증 스키마
export const getRevenueSchema = {
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.string().transform(val => parseInt(val) || 1).optional(),
    limit: z.string().transform(val => parseInt(val) || 10).optional()
  })
};

// 강좌 상태 업데이트 스키마
export const updateCourseStatusSchema = {
  body: z.object({
    status: z.enum(['approved', 'rejected'], {
      errorMap: () => ({ message: '상태는 approved 또는 rejected 중 하나여야 합니다.' })
    }),
    reason: z.string().optional()
  }),
  params: z.object({
    courseId: z.string().min(1, '강좌 ID는 필수입니다.')
  })
};