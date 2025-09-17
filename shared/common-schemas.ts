/**
 * 공통 스키마 정의
 * 프로젝트 전체에서 사용하는 공통 Zod 스키마들
 */
import { z } from 'zod';

// =============================================================================
// 페이지네이션 스키마
// =============================================================================

export const paginationQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, '페이지는 양의 정수여야 합니다')
    .transform(val => Math.max(1, parseInt(val)))
    .optional()
    .default('1'),
  limit: z
    .string()
    .regex(/^\d+$/, '한 페이지당 항목 수는 양의 정수여야 합니다')
    .transform(val => Math.min(100, Math.max(1, parseInt(val))))
    .optional()
    .default('20'),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

// =============================================================================
// 공통 필터 스키마
// =============================================================================

export const dateRangeSchema = z.object({
  startDate: z.string().datetime('잘못된 시작 날짜 형식입니다').optional(),
  endDate: z.string().datetime('잘못된 종료 날짜 형식입니다').optional(),
}).refine(
  data => !data.startDate || !data.endDate || data.startDate <= data.endDate,
  {
    message: '시작 날짜는 종료 날짜보다 이전이어야 합니다',
    path: ['startDate']
  }
);

export const statusFilterSchema = z.enum(['active', 'inactive', 'pending', 'completed', 'cancelled']);

// =============================================================================
// ID 스키마
// =============================================================================

export const idSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID는 양의 정수여야 합니다')
    .transform(val => parseInt(val))
});

export const optionalIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID는 양의 정수여야 합니다')
    .transform(val => parseInt(val))
    .optional()
});

// =============================================================================
// 공통 응답 스키마
// =============================================================================

export const successResponseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  message: z.string().optional(),
  meta: z.object({
    timestamp: z.string(),
    requestId: z.string().optional(),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }).optional(),
  }).optional(),
});

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
  meta: z.object({
    timestamp: z.string(),
    requestId: z.string().optional(),
  }).optional(),
});

// =============================================================================
// 검색 스키마
// =============================================================================

export const searchQuerySchema = z.object({
  q: z.string().min(1, '검색어는 최소 1자 이상이어야 합니다').optional(),
  category: z.string().optional(),
  tags: z.union([
    z.string().transform(val => val.split(',')),
    z.array(z.string())
  ]).optional(),
});

// =============================================================================
// 파일 업로드 스키마
// =============================================================================

export const fileUploadSchema = z.object({
  filename: z.string().min(1, '파일명이 필요합니다'),
  mimetype: z.string().min(1, '파일 타입이 필요합니다'),
  size: z.number().min(1, '파일 크기가 필요합니다').max(10485760, '파일 크기는 10MB 이하여야 합니다'), // 10MB
  path: z.string().min(1, '파일 경로가 필요합니다'),
});

export const multipleFilesUploadSchema = z.object({
  files: z.array(fileUploadSchema).min(1, '최소 1개의 파일이 필요합니다'),
});

// =============================================================================
// 공통 validation 메시지
// =============================================================================

export const COMMON_VALIDATION_MESSAGES = {
  REQUIRED: '필수 항목입니다',
  INVALID_EMAIL: '유효한 이메일 주소를 입력해주세요',
  INVALID_PHONE: '유효한 전화번호를 입력해주세요',
  TOO_SHORT: '너무 짧습니다',
  TOO_LONG: '너무 깁니다',
  INVALID_FORMAT: '형식이 올바르지 않습니다',
  INVALID_NUMBER: '유효한 숫자를 입력해주세요',
  INVALID_DATE: '유효한 날짜를 입력해주세요',
  PASSWORD_TOO_WEAK: '비밀번호는 최소 8자 이상이어야 하며, 영문, 숫자, 특수문자를 포함해야 합니다',
} as const;

// =============================================================================
// 개선된 검증 함수들
// =============================================================================

export const emailSchema = z
  .string()
  .min(1, COMMON_VALIDATION_MESSAGES.REQUIRED)
  .email(COMMON_VALIDATION_MESSAGES.INVALID_EMAIL);

export const phoneSchema = z
  .string()
  .min(1, COMMON_VALIDATION_MESSAGES.REQUIRED)
  .regex(/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/, COMMON_VALIDATION_MESSAGES.INVALID_PHONE);

export const strongPasswordSchema = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
  .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, COMMON_VALIDATION_MESSAGES.PASSWORD_TOO_WEAK);

export const nameSchema = z
  .string()
  .min(1, COMMON_VALIDATION_MESSAGES.REQUIRED)
  .min(2, '이름은 최소 2자 이상이어야 합니다')
  .max(50, '이름은 최대 50자까지 가능합니다');

export const urlSchema = z
  .string()
  .url('유효한 URL을 입력해주세요')
  .optional();

export const positiveIntegerSchema = z
  .number()
  .int('정수만 입력 가능합니다')
  .positive('양수만 입력 가능합니다');

export const nonNegativeIntegerSchema = z
  .number()
  .int('정수만 입력 가능합니다')
  .nonnegative('0 이상의 값만 입력 가능합니다');