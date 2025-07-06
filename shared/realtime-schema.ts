import { z } from 'zod';

// 실시간 채팅 스키마
export const chatMessageSchema = z.object({
  id: z.string().uuid(),
  senderId: z.string(),
  receiverId: z.string(),
  message: z.string().min(1).max(1000),
  timestamp: z.string().datetime(),
  type: z.enum(['text', 'image', 'file']),
  isRead: z.boolean().default(false),
  metadata: z.object({
    fileUrl: z.string().optional(),
    fileName: z.string().optional(),
    fileSize: z.number().optional()
  }).optional()
});

// 알림 스키마
export const notificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  type: z.enum(['course_approval', 'new_enrollment', 'payment_received', 'message_received']),
  title: z.string(),
  message: z.string(),
  isRead: z.boolean().default(false),
  createdAt: z.string().datetime(),
  data: z.record(z.any()).optional()
});

// 수강 신청 스키마
export const enrollmentSchema = z.object({
  id: z.string().uuid(),
  courseId: z.string(),
  studentId: z.string(),
  status: z.enum(['pending', 'approved', 'rejected', 'completed']),
  enrolledAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  progress: z.number().min(0).max(100).default(0),
  paymentStatus: z.enum(['pending', 'completed', 'failed', 'refunded']),
  paymentAmount: z.number().min(0)
});

// 강좌 리뷰 스키마
export const reviewSchema = z.object({
  id: z.string().uuid(),
  courseId: z.string(),
  studentId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500),
  createdAt: z.string().datetime(),
  isVisible: z.boolean().default(true)
});

// 결제 스키마
export const paymentSchema = z.object({
  id: z.string().uuid(),
  courseId: z.string(),
  studentId: z.string(),
  amount: z.number().min(0),
  currency: z.string().default('KRW'),
  paymentMethod: z.enum(['card', 'transfer', 'virtual_account']),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled', 'refunded']),
  stripePaymentIntentId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().optional()
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type Enrollment = z.infer<typeof enrollmentSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type Payment = z.infer<typeof paymentSchema>;