import { pgTable, text, integer, boolean, timestamp, serial, decimal, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
import { z } from "zod";

// 사용자 테이블
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("pet-owner"),
  name: varchar("name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  phoneNumber: varchar("phone_number", { length: 20 }), // 새로운 휴대폰 번호 필드
  kakaoId: varchar("kakao_id", { length: 100 }), // 카카오톡 ID (알림장 전송용)
  birthDate: varchar("birth_date", { length: 10 }), // YYYY-MM-DD 형식
  age: integer("age"), // 연령
  gender: varchar("gender", { length: 10 }), // 성별 (male/female)
  profileImage: text("profile_image"),
  bio: text("bio"),
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // Missing columns from error report
  subscriptionTier: text("subscription_tier").default("free"),
  referralCode: text("referral_code"),
  aiUsage: integer("ai_usage").default(0),
  points: integer("points").default(0),
  fullName: varchar("full_name", { length: 200 }),
  // 훈련사 화상수업 관련 필드
  zoomLink: text("zoom_link"), // 개인 Zoom 링크
  videoCallPreference: varchar("video_call_preference", { length: 50 }).default("zoom"), // zoom, teams, webex 등
});

// 설문 질문 스키마 (surveyData JSON 구조)
export const surveyQuestionSchema = z.object({
  id: z.number(),
  question: z.string(),
  type: z.enum(["single_choice", "multiple_choice", "text_answer"]),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(true),
});

// 설문 응답 스키마
export const surveyResponseSchema = z.object({
  questionId: z.number(),
  answer: z.union([
    z.string(), // 텍스트 답변
    z.array(z.string()), // 다중 선택 답변
  ]),
});

// 설문 데이터 스키마
export const surveyDataSchema = z.object({
  questions: z.array(surveyQuestionSchema),
  endDate: z.string().optional(),
  anonymous: z.boolean().default(false),
});

// 강의 테이블
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  content: text("content"),
  price: decimal("price", { precision: 10, scale: 2 }),
  duration: integer("duration"),
  level: varchar("level", { length: 50 }),
  category: varchar("category", { length: 100 }),
  instructorId: integer("instructor_id").references(() => users.id),
  instituteId: integer("institute_id").references(() => institutes.id).notNull(), // Critical: Institute-scoped RBAC
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  isActive: boolean("is_active").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  enrollmentCount: integer("enrollment_count").default(0),
  // 화상 강의 관련 필드 추가
  courseType: varchar("course_type", { length: 50 }).default("regular"), // regular, video_lecture, hybrid
  isLiveClass: boolean("is_live_class").default(false), // 실시간 화상 수업 여부
  maxParticipants: integer("max_participants"), // 최대 참가자 수 (화상 강의용)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 화상 강의 세션 테이블 (줌 화상 수업)
export const videoLectureSessions = pgTable("video_lecture_sessions", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  instructorId: integer("instructor_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  scheduledStartTime: timestamp("scheduled_start_time").notNull(),
  scheduledEndTime: timestamp("scheduled_end_time").notNull(),
  actualStartTime: timestamp("actual_start_time"),
  actualEndTime: timestamp("actual_end_time"),
  maxParticipants: integer("max_participants").default(50),
  currentParticipants: integer("current_participants").default(0),
  // 줌 관련 정보
  zoomMeetingId: varchar("zoom_meeting_id", { length: 100 }),
  zoomJoinUrl: text("zoom_join_url"),
  zoomStartUrl: text("zoom_start_url"),
  zoomMeetingPassword: varchar("zoom_meeting_password", { length: 50 }),
  // 세션 상태
  status: varchar("status", { length: 50 }).default("scheduled"), // scheduled, live, completed, cancelled
  recordingUrl: text("recording_url"), // 녹화본 URL (있는 경우)
  isRecorded: boolean("is_recorded").default(false),
  // 메타데이터
  sessionNotes: text("session_notes"),
  materials: text("materials").array().default([]), // 수업 자료 링크들
  tags: text("tags").array().default([]), // 태그
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 화상 강의 예약 테이블
export const videoLectureBookings = pgTable("video_lecture_bookings", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => videoLectureSessions.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  petId: integer("pet_id").references(() => pets.id), // 반려동물 관련 강의인 경우
  bookingStatus: varchar("booking_status", { length: 50 }).default("confirmed"), // confirmed, cancelled, no_show
  joinTime: timestamp("join_time"), // 실제 참가 시간
  leaveTime: timestamp("leave_time"), // 실제 퇴장 시간
  attendanceStatus: varchar("attendance_status", { length: 50 }).default("registered"), // registered, attended, absent
  feedback: text("feedback"), // 수강 후기
  rating: integer("rating"), // 1-5 평점
  specialRequests: text("special_requests"), // 특별 요청사항
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 기관 테이블
export const institutes = pgTable("institutes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  logo: text("logo"),
  businessNumber: text("business_number"),
  capacity: integer("capacity"),
  code: text("code"),
  isActive: boolean("is_active").default(true),
  featuresEnabled: jsonb("features_enabled"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 구독 플랜 테이블
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("KRW"),
  billingPeriod: varchar("billing_period", { length: 20 }).default("monthly"),
  maxMembers: integer("max_members").notNull(),
  maxVideoHours: integer("max_video_hours").notNull(),
  maxAiAnalysis: integer("max_ai_analysis").notNull(),
  features: jsonb("features").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 반려동물 테이블
export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  species: varchar("species", { length: 50 }).notNull(),
  breed: varchar("breed", { length: 100 }),
  age: integer("age"),
  gender: varchar("gender", { length: 10 }), // male, female
  weight: decimal("weight", { precision: 5, scale: 2 }),
  color: varchar("color", { length: 100 }),
  personality: text("personality"),
  medicalHistory: text("medical_history"),
  specialNotes: text("special_notes"),
  ownerId: integer("owner_id").references(() => users.id),
  profileImage: text("profile_image"),
  imageUrl: text("image_url"), // 추가 이미지 필드
  notes: text("notes"),
  // 훈련 관련 필드
  trainingStatus: varchar("training_status", { length: 50 }).default("not_assigned"), // not_assigned, assigned, in_progress, completed
  assignedTrainerId: integer("assigned_trainer_id").references(() => users.id),
  assignedTrainerName: varchar("assigned_trainer_name", { length: 100 }),
  trainingType: varchar("training_type", { length: 50 }), // basic, advanced, behavioral_correction
  notebookEnabled: boolean("notebook_enabled").default(false),
  trainingStartDate: timestamp("training_start_date"),
  lastNotebookEntry: text("last_notebook_entry"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 커뮤니티 게시글 테이블 (설문 기능 포함)
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => users.id),
  category: varchar("category", { length: 100 }),
  tags: jsonb("tags"),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  commentsCount: integer("comments_count").default(0),
  type: varchar("type", { length: 20 }).default("post"), // post, survey
  // 링크 관련 필드
  linkUrl: text("link_url"),
  linkTitle: text("link_title"),
  linkDescription: text("link_description"),
  linkImage: text("link_image"),
  // 설문 관련 필드
  surveyData: jsonb("survey_data"), // 설문 질문, 옵션, 설정 등
  surveyResponses: jsonb("survey_responses"), // 설문 응답 데이터
  endDate: timestamp("end_date"), // 설문 마감일
  anonymous: boolean("anonymous").default(false), // 익명 설문 여부
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 댓글 테이블
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  postId: integer("post_id").references(() => posts.id),
  authorId: integer("author_id").references(() => users.id),
  parentId: integer("parent_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 예약 테이블
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  trainerId: integer("trainer_id").references(() => users.id),
  petId: integer("pet_id").references(() => pets.id),
  serviceType: varchar("service_type", { length: 100 }).notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").default(60),
  status: varchar("status", { length: 50 }).default("pending"),
  notes: text("notes"),
  price: decimal("price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 상품 테이블 (실제 데이터베이스 구조에 맞게 수정)
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  discount_price: integer("discount_price"),
  category_id: integer("category_id"),
  images: jsonb("images"),
  tags: jsonb("tags"),
  stock: integer("stock").default(0),
  low_stock_threshold: integer("low_stock_threshold").default(10), // 재고 부족 알림 기준
  auto_reorder_enabled: boolean("auto_reorder_enabled").default(false), // 자동 재주문 활성화
  auto_reorder_quantity: integer("auto_reorder_quantity").default(50), // 자동 재주문 수량
  supplier_id: integer("supplier_id"), // 공급업체 ID
  is_active: boolean("is_active").default(true),
  rating: integer("rating").default(0),
  review_count: integer("review_count").default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 기관별 추천 상품 테이블
export const instituteProductRecommendations = pgTable("institute_product_recommendations", {
  id: serial("id").primaryKey(),
  instituteId: integer("institute_id").references(() => institutes.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  recommendationType: varchar("recommendation_type", { length: 50 }).notNull(), // 'featured', 'essential', 'popular', 'seasonal'
  priority: integer("priority").default(5), // 우선순위 (1-10)
  customMessage: text("custom_message"), // 기관별 맞춤 메시지
  discountRate: decimal("discount_rate", { precision: 5, scale: 2 }).default("0"), // 기관 전용 할인율
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  clickCount: integer("click_count").default(0),
  purchaseCount: integer("purchase_count").default(0),
  revenue: decimal("revenue", { precision: 12, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 커리큘럼-상품 매핑 테이블
export const curriculumProductMappings = pgTable("curriculum_product_mappings", {
  id: serial("id").primaryKey(),
  curriculumId: varchar("curriculum_id", { length: 100 }).notNull(), // 커리큘럼 ID
  moduleId: varchar("module_id", { length: 100 }), // 모듈 ID (선택적)
  productId: integer("product_id").references(() => products.id).notNull(),
  materialName: varchar("material_name", { length: 200 }).notNull(), // 준비물 이름
  quantity: integer("quantity").default(1), // 필요 수량
  isRequired: boolean("is_required").default(true), // 필수 여부
  isOptional: boolean("is_optional").default(false), // 선택 여부
  suggestedAlternatives: jsonb("suggested_alternatives"), // 대체 상품 목록
  usageDescription: text("usage_description"), // 사용법 설명
  estimatedUsage: integer("estimated_usage"), // 예상 사용량 (시간/회차)
  autoOrder: boolean("auto_order").default(false), // 자동 주문 설정
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 자동 재고 주문 내역 테이블
export const autoInventoryOrders = pgTable("auto_inventory_orders", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  triggerType: varchar("trigger_type", { length: 50 }).notNull(), // 'low_stock', 'curriculum_demand', 'seasonal'
  triggeredBy: varchar("triggered_by", { length: 100 }), // 트리거 원인 (커리큘럼 ID 등)
  requestedQuantity: integer("requested_quantity").notNull(),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 50 }).default("pending"), // 'pending', 'approved', 'ordered', 'received', 'cancelled'
  orderDate: timestamp("order_date"),
  expectedDelivery: timestamp("expected_delivery"),
  actualDelivery: timestamp("actual_delivery"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 상품 노출 연결 테이블
export const productExposures = pgTable("product_exposures", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  exposureType: varchar("exposure_type", { length: 50 }).notNull(), // homepage, category, search, promotion
  position: integer("position").default(0),
  priority: integer("priority").default(5),
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  targetAudience: varchar("target_audience", { length: 100 }),
  clickCount: integer("click_count").default(0),
  impressionCount: integer("impression_count").default(0),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 쇼핑 카트 테이블
export const shoppingCarts = pgTable("shopping_carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").default(1),
  price: decimal("price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 주문 테이블
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  orderNumber: varchar("order_number", { length: 50 }).unique().notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  shippingAmount: decimal("shipping_amount", { precision: 10, scale: 2 }).default("0"),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0"),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"),
  shippingAddress: jsonb("shipping_address"),
  billingAddress: jsonb("billing_address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 주문 아이템 테이블
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 알림 테이블
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  isRead: boolean("is_read").default(false),
  actionUrl: text("action_url"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 시스템 설정 테이블
export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  description: text("description"),
  category: varchar("category", { length: 50 }),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod 스키마 생성
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertInstituteSchema = createInsertSchema(institutes);
export const selectInstituteSchema = createSelectSchema(institutes);
// Basic Pet Zod Schemas
export const insertPetSchema = createInsertSchema(pets, {
  // 선택적 검증 규칙 추가 가능
}).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  assignedTrainerId: true, // 관리자만 설정 가능
  assignedTrainerName: true
} as const);

export const updatePetSchema = insertPetSchema.partial().omit({ 
  ownerId: true // 소유자는 변경 불가
} as const);

export const selectPetSchema = createSelectSchema(pets);

// Enhanced Pet validation schemas with custom rules
export const createPetSchema = z.object({
  name: z.string().min(1, "반려동물 이름은 필수입니다").max(100, "이름은 100자를 초과할 수 없습니다"),
  species: z.string().min(1, "종(Species)은 필수입니다").max(50, "종 이름은 50자를 초과할 수 없습니다"),
  breed: z.string().max(100, "품종 이름은 100자를 초과할 수 없습니다").optional().nullable(),
  age: z.number().int().min(0, "나이는 0 이상이어야 합니다").max(30, "나이는 30세를 초과할 수 없습니다").optional().nullable(),
  gender: z.enum(["male", "female"]).optional().nullable(),
  weight: z.coerce.number().min(0.1, "체중은 0.1kg 이상이어야 합니다").max(200, "체중은 200kg을 초과할 수 없습니다").optional().nullable(),
  color: z.string().max(100, "색상은 100자를 초과할 수 없습니다").optional().nullable(),
  personality: z.string().max(500, "성격 설명은 500자를 초과할 수 없습니다").optional().nullable(),
  medicalHistory: z.string().max(1000, "병력은 1000자를 초과할 수 없습니다").optional().nullable(),
  specialNotes: z.string().max(1000, "특이사항은 1000자를 초과할 수 없습니다").optional().nullable(),
  profileImage: z.string().url("올바른 URL 형식이 아닙니다").optional().nullable(),
  imageUrl: z.string().url("올바른 URL 형식이 아닙니다").optional().nullable(),
  notes: z.string().max(1000, "메모는 1000자를 초과할 수 없습니다").optional().nullable(),
  trainingStatus: z.enum(["not_assigned", "assigned", "in_progress", "completed"]).default("not_assigned"),
  trainingType: z.enum(["basic", "advanced", "behavioral_correction"]).optional().nullable(),
  notebookEnabled: z.boolean().default(false),
  ownerId: z.number().int().positive("올바른 사용자 ID가 필요합니다"),
  isActive: z.boolean().default(true)
});

export const updatePetValidationSchema = createPetSchema.partial().omit({
  ownerId: true // 소유자는 변경 불가
});

// Pet type definitions
export type InsertPet = z.infer<typeof insertPetSchema>;
export type UpdatePet = z.infer<typeof updatePetSchema>;
export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetValidationSchema>;
// 새로운 테이블들의 Zod 스키마는 하단에서 정의됨

// Missing schema tables required by storage.ts
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  location: text("location"),
  category: varchar("category", { length: 100 }),
  organizerId: integer("organizer_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 훈련사 활동 로그 테이블
export const trainerActivityLogs = pgTable("trainer_activity_logs", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").references(() => users.id).notNull(),
  activityType: varchar("activity_type", { length: 50 }).notNull(), // 'review_video', 'live_stream', 'comment', 'content_upload', 'consultation', 'course_creation'
  activityTitle: varchar("activity_title", { length: 200 }),
  activityDescription: text("activity_description"),
  pointsEarned: integer("points_earned").default(0),
  incentiveAmount: decimal("incentive_amount", { precision: 10, scale: 2 }).default("0"),
  metadata: jsonb("metadata"), // 추가 정보 저장
  createdAt: timestamp("created_at").defaultNow(),
});

// 인센티브 지급 내역 테이블
export const incentivePayments = pgTable("incentive_payments", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").references(() => users.id).notNull(),
  activityLogId: integer("activity_log_id").references(() => trainerActivityLogs.id),
  paymentType: varchar("payment_type", { length: 50 }).notNull(), // 'review_video', 'point_reward', 'priority_settlement'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("KRW"),
  status: varchar("status", { length: 30 }).default("pending"), // 'pending', 'approved', 'paid', 'rejected'
  paymentDate: timestamp("payment_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 훈련사 등급 시스템 테이블
export const trainerRankings = pgTable("trainer_rankings", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").references(() => users.id).notNull(),
  month: varchar("month", { length: 7 }).notNull(), // 'YYYY-MM' format
  totalPoints: integer("total_points").default(0),
  activityScore: decimal("activity_score", { precision: 10, scale: 2 }).default("0"),
  rankPosition: integer("rank_position"),
  isTopPerformer: boolean("is_top_performer").default(false), // 상위 10%
  prioritySettlement: boolean("priority_settlement").default(false),
  bonusMultiplier: decimal("bonus_multiplier", { precision: 3, scale: 2 }).default("1.0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 포인트 규칙 테이블
export const pointRules = pgTable("point_rules", {
  id: serial("id").primaryKey(),
  activityType: varchar("activity_type", { length: 50 }).notNull().unique(), // 활동 유형
  activityName: varchar("activity_name", { length: 100 }).notNull(), // 활동 이름
  pointsPerAction: integer("points_per_action").notNull(), // 기본 포인트
  maxDailyPoints: integer("max_daily_points"), // 일일 최대 포인트
  maxMonthlyPoints: integer("max_monthly_points"), // 월간 최대 포인트
  isActive: boolean("is_active").default(true),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 월별 포인트 합산 테이블
export const monthlyPointSummary = pgTable("monthly_point_summary", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").references(() => users.id).notNull(),
  month: varchar("month", { length: 7 }).notNull(), // 'YYYY-MM' format
  totalPoints: integer("total_points").default(0),
  videoUploadPoints: integer("video_upload_points").default(0),
  commentPoints: integer("comment_points").default(0),
  viewPoints: integer("view_points").default(0),
  recruitmentPoints: integer("recruitment_points").default(0),
  certificationPoints: integer("certification_points").default(0),
  consultationPoints: integer("consultation_points").default(0),
  courseCreationPoints: integer("course_creation_points").default(0),
  lastCalculatedAt: timestamp("last_calculated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 포인트 거래 내역 테이블
export const pointTransactions = pgTable("point_transactions", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").references(() => users.id).notNull(),
  activityLogId: integer("activity_log_id").references(() => trainerActivityLogs.id),
  pointRuleId: integer("point_rule_id").references(() => pointRules.id),
  transactionType: varchar("transaction_type", { length: 20 }).notNull(), // 'earned', 'deducted', 'bonus'
  points: integer("points").notNull(),
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventLocations = pgTable("event_locations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  address: text("address").notNull(),
  capacity: integer("capacity"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventAttendances = pgTable("event_attendances", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id),
  userId: integer("user_id").references(() => users.id),
  attendedAt: timestamp("attended_at").defaultNow(),
});

export const trainers = pgTable("trainers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  specialty: text("specialty"),
  experience: integer("experience"),
  certification: text("certification"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vaccinations = pgTable("vaccinations", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id),
  name: varchar("name", { length: 100 }).notNull(),
  date: timestamp("date").notNull(),
  nextDue: timestamp("next_due"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const checkups = pgTable("checkups", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id),
  date: timestamp("date").notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const commissionPolicies = pgTable("commission_policies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  rate: decimal("rate", { precision: 5, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// 강의 구매 테이블
export const coursePurchases = pgTable("course_purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  purchaseAmount: decimal("purchase_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentStatus: varchar("payment_status", { length: 50 }).default("completed"),
  accessGranted: boolean("access_granted").default(true),
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 강의 수강 진행 상황 테이블
export const courseProgress = pgTable("course_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  currentLesson: integer("current_lesson").default(1),
  completedLessons: integer("completed_lessons").default(0),
  totalLessons: integer("total_lessons").notNull(),
  progressPercentage: decimal("progress_percentage", { precision: 5, scale: 2 }).default("0"),
  timeSpent: integer("time_spent").default(0), // 분 단위
  averageScore: decimal("average_score", { precision: 5, scale: 2 }).default("0"),
  lastAccessedAt: timestamp("last_accessed_at"),
  completedAt: timestamp("completed_at"),
  status: varchar("status", { length: 50 }).default("active"), // active, completed, paused
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 강의 진행 상황 공유 테이블
export const progressSharing = pgTable("progress_sharing", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(), // 견주
  courseId: integer("course_id").references(() => courses.id).notNull(),
  trainerId: integer("trainer_id").references(() => users.id), // 훈련사
  instituteId: integer("institute_id").references(() => institutes.id), // 기관
  sharedAt: timestamp("shared_at").defaultNow(),
  shareType: varchar("share_type", { length: 50 }).notNull(), // "trainer", "institute", "both"
  permissions: jsonb("permissions"), // 공유 권한 설정
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 강의 세션 기록 테이블
export const lessonSessions = pgTable("lesson_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  lessonNumber: integer("lesson_number").notNull(),
  sessionStart: timestamp("session_start").notNull(),
  sessionEnd: timestamp("session_end"),
  watchTime: integer("watch_time").default(0), // 초 단위
  completionPercentage: decimal("completion_percentage", { precision: 5, scale: 2 }).default("0"),
  quiz_score: decimal("quiz_score", { precision: 5, scale: 2 }),
  notes: text("notes"),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const commissionTransactions = pgTable("commission_transactions", {
  id: serial("id").primaryKey(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const settlementReports = pgTable("settlement_reports", {
  id: serial("id").primaryKey(),
  period: varchar("period", { length: 20 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shopCategories = pgTable("shop_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});



export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  linkUrl: text("link_url"), // 클릭시 이동할 URL
  targetPosition: varchar("target_position", { length: 50 }).default("home-hero"), // home-hero, sidebar, footer 등
  displayOrder: integer("display_order").default(0), // 표시 순서
  targetUserGroup: varchar("target_user_group", { length: 50 }).default("all"), // all, pet-owners, trainers, admins
  startDate: timestamp("start_date"), // 표시 시작일
  endDate: timestamp("end_date"), // 표시 종료일
  clickCount: integer("click_count").default(0), // 클릭 수
  viewCount: integer("view_count").default(0), // 노출 수
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 알림장 테이블 - 훈련사가 견주에게 보내는 훈련 알림
export const trainingJournals = pgTable("training_journals", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").references(() => users.id).notNull(),
  petOwnerId: integer("pet_owner_id").references(() => users.id).notNull(),
  petId: integer("pet_id").references(() => pets.id).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  trainingDate: timestamp("training_date").notNull(),
  trainingDuration: integer("training_duration"), // 훈련 시간 (분)
  trainingType: varchar("training_type", { length: 100 }), // 훈련 유형
  progressRating: integer("progress_rating"), // 진행도 평가 (1-5)
  behaviorNotes: text("behavior_notes"), // 행동 관찰 노트
  homeworkInstructions: text("homework_instructions"), // 집에서 할 숙제
  nextGoals: text("next_goals"), // 다음 목표
  attachments: text("attachments").array(), // 첨부파일 URL 배열
  isRead: boolean("is_read").default(false), // 견주 읽음 여부
  readAt: timestamp("read_at"),
  status: varchar("status", { length: 20 }).default("sent"), // sent, read, replied
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 알림장 댓글 테이블 - 견주의 응답
export const journalComments: any = pgTable("journal_comments", {
  id: serial("id").primaryKey(),
  journalId: integer("journal_id").references(() => trainingJournals.id).notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  attachments: text("attachments").array(), // 첨부파일
  parentCommentId: integer("parent_comment_id"), // 대댓글 - 순환 참조 제거
  createdAt: timestamp("created_at").defaultNow(),
});

// 알림장 서비스 요청 테이블 - 견주가 추가 서비스 요청
export const journalServiceRequests = pgTable("journal_service_requests", {
  id: serial("id").primaryKey(),
  journalId: integer("journal_id").references(() => trainingJournals.id).notNull(),
  requesterId: integer("requester_id").references(() => users.id).notNull(),
  serviceType: varchar("service_type", { length: 50 }).notNull(), // consultation, message, booking
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  preferredDate: timestamp("preferred_date"),
  urgency: varchar("urgency", { length: 20 }).default("normal"), // low, normal, high, urgent
  status: varchar("status", { length: 20 }).default("pending"), // pending, approved, rejected, completed
  responseMessage: text("response_message"),
  respondedBy: integer("responded_by").references(() => users.id),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 휴식 신청 테이블 - 훈련사 개인 OFF 신청
export const restApplications = pgTable("rest_applications", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").references(() => users.id).notNull(),
  instituteId: integer("institute_id").references(() => institutes.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  reason: varchar("reason", { length: 100 }).notNull(), // personal, sick, family, vacation, etc.
  description: text("description"),
  substituteRequired: boolean("substitute_required").default(false),
  status: varchar("status", { length: 20 }).default("pending"), // pending, approved, rejected, completed
  approvedBy: integer("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectedReason: text("rejected_reason"),
  // 대체 훈련사 관련
  substituteTrainerId: integer("substitute_trainer_id").references(() => users.id),
  substituteStatus: varchar("substitute_status", { length: 20 }).default("none"), // none, requested, confirmed, declined
  // 보상 관련
  rewardEligible: boolean("reward_eligible").default(false),
  rewardAmount: decimal("reward_amount", { precision: 10, scale: 2 }),
  rewardStatus: varchar("reward_status", { length: 20 }).default("none"), // none, pending, approved, paid
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 대체 훈련사 요청 테이블 - 훈련소 관리자의 대체 인력 요청
export const substituteRequests = pgTable("substitute_requests", {
  id: serial("id").primaryKey(),
  restApplicationId: integer("rest_application_id").references(() => restApplications.id).notNull(),
  instituteId: integer("institute_id").references(() => institutes.id).notNull(),
  requestingTrainerId: integer("requesting_trainer_id").references(() => users.id).notNull(),
  requiredSkills: text("required_skills").array(), // 필요한 스킬/자격증
  requiredLevel: varchar("required_level", { length: 20 }).default("same"), // same, higher, lower
  workingHours: varchar("working_hours", { length: 100 }),
  compensation: decimal("compensation", { precision: 10, scale: 2 }),
  additionalNotes: text("additional_notes"),
  status: varchar("status", { length: 20 }).default("open"), // open, in_progress, filled, cancelled
  // 매칭된 대체 훈련사
  matchedTrainerId: integer("matched_trainer_id").references(() => users.id),
  matchedAt: timestamp("matched_at"),
  acceptedAt: timestamp("accepted_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 대체 훈련사 지원 테이블 - 다른 훈련사의 대체 근무 지원
export const substituteApplications = pgTable("substitute_applications", {
  id: serial("id").primaryKey(),
  substituteRequestId: integer("substitute_request_id").references(() => substituteRequests.id).notNull(),
  applicantTrainerId: integer("applicant_trainer_id").references(() => users.id).notNull(),
  availability: jsonb("availability"), // 근무 가능 시간/날짜
  experience: text("experience"), // 관련 경험
  certifications: text("certifications").array(), // 보유 자격증
  expectedCompensation: decimal("expected_compensation", { precision: 10, scale: 2 }),
  message: text("message"),
  status: varchar("status", { length: 20 }).default("pending"), // pending, accepted, rejected
  responseMessage: text("response_message"),
  respondedBy: integer("responded_by").references(() => users.id),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 훈련소 전체 휴무 테이블 - 훈련소 관리자의 센터 단위 휴무
export const instituteClosure = pgTable("institute_closure", {
  id: serial("id").primaryKey(),
  instituteId: integer("institute_id").references(() => institutes.id).notNull(),
  managerId: integer("manager_id").references(() => users.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  reason: varchar("reason", { length: 100 }).notNull(), // holiday, maintenance, event, etc.
  description: text("description"),
  notificationSent: boolean("notification_sent").default(false),
  customerNotice: text("customer_notice"),
  alternativeOptions: text("alternative_options"), // 대체 서비스 안내
  status: varchar("status", { length: 20 }).default("planned"), // planned, active, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 휴식 리워드 테이블 - 소규모 훈련소 휴식 보상
export const restRewards = pgTable("rest_rewards", {
  id: serial("id").primaryKey(),
  restApplicationId: integer("rest_application_id").references(() => restApplications.id).notNull(),
  recipientId: integer("recipient_id").references(() => users.id).notNull(),
  rewardType: varchar("reward_type", { length: 50 }).notNull(), // points, cash, credit, voucher
  rewardAmount: decimal("reward_amount", { precision: 10, scale: 2 }).notNull(),
  rewardReason: text("reward_reason"),
  eligibilityChecked: boolean("eligibility_checked").default(false),
  approvedBy: integer("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  paidAt: timestamp("paid_at"),
  status: varchar("status", { length: 20 }).default("pending"), // pending, approved, paid, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

// Type definitions
export type UserRole = "admin" | "trainer" | "institute-admin" | "pet-owner";

export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = z.infer<typeof selectCourseSchema>;
export type NewCourse = z.infer<typeof insertCourseSchema>;

export type Institute = z.infer<typeof selectInstituteSchema>;
export type NewInstitute = z.infer<typeof insertInstituteSchema>;

export type Pet = z.infer<typeof selectPetSchema>;
export type NewPet = z.infer<typeof insertPetSchema>;

// Posts 관련 스키마 (설문 기능 포함)
export const insertPostSchema = createInsertSchema(posts).extend({
  surveyData: surveyDataSchema.optional(),
});

export const selectPostSchema = createSelectSchema(posts);

// Missing type exports for storage.ts compatibility
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type NewPost = z.infer<typeof insertPostSchema>;
export type Reservation = typeof reservations.$inferSelect;

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export type EventLocation = typeof eventLocations.$inferSelect;
export type InsertEventLocation = typeof eventLocations.$inferInsert;

export type EventAttendance = typeof eventAttendances.$inferSelect;


// Missing tables from error report
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  deadline: timestamp("deadline"),
  status: varchar("status", { length: 50 }).default("active"),
  clientId: integer("client_id").references(() => users.id),
  freelancerId: integer("freelancer_id").references(() => users.id),
  category: text("category"),
  views: integer("views").default(0),
  expectedStartDate: timestamp("expected_start_date"),
  location: text("location"),
  postedDate: timestamp("posted_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const proposals = pgTable("proposals", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  freelancerId: integer("freelancer_id").references(() => users.id),
  title: text("title"),
  content: text("content"),
  proposedBudget: decimal("proposed_budget", { precision: 10, scale: 2 }),
  proposedTimeline: text("proposed_timeline"),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  contractId: integer("contract_id"),
  reviewerId: integer("reviewer_id").references(() => users.id),
  revieweeId: integer("reviewee_id").references(() => users.id),
  projectId: integer("project_id").references(() => projects.id),
  receiverId: integer("receiver_id").references(() => users.id),
  title: text("title"),
  content: text("content"),
  recommendation: text("recommendation"),
  status: text("status").default("pending"),
  reviewerRole: text("reviewer_role"),
  receiverRole: text("receiver_role"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  conversationId: integer("conversation_id"),
  recipientId: integer("recipient_id").references(() => users.id),
  messageType: text("message_type").default("text"),
  attachments: text("attachments"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  path: text("path"),
  isPublic: boolean("is_public").default(false),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  relatedEntity: text("related_entity"),
  relatedEntityId: integer("related_entity_id"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 기존 pointTransactions 제거됨 - 새로운 pointTransactions가 이미 위에 정의됨

export const forums = pgTable("forums", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),
  popularity: integer("popularity").default(0),
  weekday: text("weekday"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Banner = typeof banners.$inferSelect;

export type JournalComment = typeof journalComments.$inferSelect;
export type InsertJournalComment = typeof journalComments.$inferInsert;

export type JournalServiceRequest = typeof journalServiceRequests.$inferSelect;
export type InsertJournalServiceRequest = typeof journalServiceRequests.$inferInsert;

// 새로운 테이블들의 Zod 스키마
export const insertTrainerActivityLogSchema = createInsertSchema(trainerActivityLogs);
export const selectTrainerActivityLogSchema = createSelectSchema(trainerActivityLogs);
export const insertIncentivePaymentSchema = createInsertSchema(incentivePayments);
export const selectIncentivePaymentSchema = createSelectSchema(incentivePayments);
export const insertTrainerRankingSchema = createInsertSchema(trainerRankings);
export const selectTrainerRankingSchema = createSelectSchema(trainerRankings);
export const insertPointRuleSchema = createInsertSchema(pointRules);
export const selectPointRuleSchema = createSelectSchema(pointRules);
export const insertMonthlyPointSummarySchema = createInsertSchema(monthlyPointSummary);
export const selectMonthlyPointSummarySchema = createSelectSchema(monthlyPointSummary);
export const insertPointTransactionSchema = createInsertSchema(pointTransactions);
export const selectPointTransactionSchema = createSelectSchema(pointTransactions);

// 새로운 테이블들의 타입 정의
export type PointRule = typeof pointRules.$inferSelect;
export type InsertPointRule = typeof pointRules.$inferInsert;
export type MonthlyPointSummary = typeof monthlyPointSummary.$inferSelect;
export type InsertMonthlyPointSummary = typeof monthlyPointSummary.$inferInsert;
export type PointTransaction = typeof pointTransactions.$inferSelect;
export type InsertPointTransaction = typeof pointTransactions.$inferInsert;
export type TrainerActivityLog = typeof trainerActivityLogs.$inferSelect;
export type InsertTrainerActivityLog = typeof trainerActivityLogs.$inferInsert;
export type IncentivePayment = typeof incentivePayments.$inferSelect;
export type InsertIncentivePayment = typeof incentivePayments.$inferInsert;
export type TrainerRanking = typeof trainerRankings.$inferSelect;
export type InsertTrainerRanking = typeof trainerRankings.$inferInsert;

export type ContentApproval = typeof contentApprovals.$inferSelect;
export type InsertContentApproval = typeof contentApprovals.$inferInsert;

export type TrainerInstitute = typeof trainerInstitutes.$inferSelect;
export type InsertTrainerInstitute = typeof trainerInstitutes.$inferInsert;

export type Curriculum = typeof curriculums.$inferSelect;
export type InsertCurriculum = typeof curriculums.$inferInsert;

// 컨텐츠 승인 시스템 테이블
export const contentApprovals = pgTable("content_approvals", {
  id: serial("id").primaryKey(),
  contentType: varchar("content_type", { length: 50 }).notNull(), // course, curriculum, product
  contentId: integer("content_id").notNull(), // 해당 컨텐츠 ID
  submitterId: integer("submitter_id").references(() => users.id).notNull(), // 제출자 (훈련사)
  instituteId: integer("institute_id").references(() => institutes.id).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  content: jsonb("content"), // 컨텐츠 상세 정보
  attachments: text("attachments").array(),
  
  // 승인 단계별 상태
  trainerStatus: varchar("trainer_status", { length: 20 }).default("submitted"), // submitted
  instituteStatus: varchar("institute_status", { length: 20 }).default("pending"), // pending, approved, rejected
  adminStatus: varchar("admin_status", { length: 20 }).default("pending"), // pending, approved, rejected
  
  // 승인자 정보
  instituteReviewerId: integer("institute_reviewer_id").references(() => users.id),
  adminReviewerId: integer("admin_reviewer_id").references(() => users.id),
  
  // 승인/거부 메시지
  instituteComment: text("institute_comment"),
  adminComment: text("admin_comment"),
  
  // 승인 날짜
  instituteReviewedAt: timestamp("institute_reviewed_at"),
  adminReviewedAt: timestamp("admin_reviewed_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 훈련사-기관 관계 테이블
export const trainerInstitutes = pgTable("trainer_institutes", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").references(() => users.id).notNull(),
  instituteId: integer("institute_id").references(() => institutes.id).notNull(),
  role: varchar("role", { length: 50 }).default("trainer"), // trainer, head-trainer, supervisor
  status: varchar("status", { length: 20 }).default("active"), // active, inactive, suspended
  joinDate: timestamp("join_date").defaultNow(),
  permissions: text("permissions").array(), // 권한 배열
  createdAt: timestamp("created_at").defaultNow(),
});

// 커리큘럼 테이블
export const curriculums = pgTable("curriculums", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  instituteId: integer("institute_id").references(() => institutes.id),
  targetLevel: varchar("target_level", { length: 50 }), // beginner, intermediate, advanced
  duration: integer("duration"), // 총 소요 시간 (시간)
  sessions: jsonb("sessions"), // 세션별 상세 내용
  prerequisites: text("prerequisites").array(),
  learningObjectives: text("learning_objectives").array(),
  materials: text("materials").array(),
  assessmentMethods: text("assessment_methods").array(),
  isPublic: boolean("is_public").default(false),
  status: varchar("status", { length: 20 }).default("draft"), // draft, pending, published, rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 커리큘럼 Zod 스키마
export const insertCurriculumSchema = createInsertSchema(curriculums);
export const selectCurriculumSchema = createSelectSchema(curriculums);
export const updateCurriculumSchema = insertCurriculumSchema.partial().omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  creatorId: true, 
  instituteId: true  // Prevent ownership modification
} as const);

// 훈련사 인증 신청 테이블
export const trainerApplications = pgTable("trainer_applications", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  hasAffiliation: boolean("has_affiliation").default(false),
  affiliationName: varchar("affiliation_name", { length: 200 }),
  experience: text("experience"),
  education: text("education"),
  certifications: text("certifications"),
  motivation: text("motivation"),
  portfolioUrl: text("portfolio_url"),
  resume: text("resume"),
  status: varchar("status", { length: 20 }).default("pending"), // pending, approved, rejected, certified
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 훈련사 인증 기록 테이블
export const trainerCertifications = pgTable("trainer_certifications", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => trainerApplications.id),
  trainerId: integer("trainer_id").references(() => users.id),
  certificationLevel: varchar("certification_level", { length: 50 }).default("basic"), // basic, intermediate, advanced
  certificationNumber: varchar("certification_number", { length: 100 }).unique(),
  issuedAt: timestamp("issued_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  issuedBy: integer("issued_by").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 훈련사 양성 과정 테이블
export const trainerPrograms = pgTable("trainer_programs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  level: varchar("level", { length: 50 }).notNull(), // beginner, intermediate, advanced
  duration: integer("duration"), // in hours
  price: decimal("price", { precision: 10, scale: 2 }),
  maxParticipants: integer("max_participants").default(20),
  currentParticipants: integer("current_participants").default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  instructorId: integer("instructor_id").references(() => users.id),
  curriculum: jsonb("curriculum"),
  requirements: text("requirements"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 훈련사 양성 과정 등록 테이블
export const trainerProgramEnrollments = pgTable("trainer_program_enrollments", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").references(() => trainerPrograms.id),
  userId: integer("user_id").references(() => users.id),
  status: varchar("status", { length: 20 }).default("enrolled"), // enrolled, completed, dropped, failed
  progress: integer("progress").default(0), // percentage
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  finalScore: decimal("final_score", { precision: 5, scale: 2 }),
  certificate: text("certificate"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert/Select 타입 정의
export type TrainerApplication = typeof trainerApplications.$inferSelect;
export type InsertTrainerApplication = typeof trainerApplications.$inferInsert;

export type TrainerCertification = typeof trainerCertifications.$inferSelect;
export type InsertTrainerCertification = typeof trainerCertifications.$inferInsert;

export type TrainerProgram = typeof trainerPrograms.$inferSelect;
export type InsertTrainerProgram = typeof trainerPrograms.$inferInsert;

export type TrainerProgramEnrollment = typeof trainerProgramEnrollments.$inferSelect;
export type InsertTrainerProgramEnrollment = typeof trainerProgramEnrollments.$inferInsert;

// 휴식 관리 시스템 타입
export type RestApplication = typeof restApplications.$inferSelect;
export type InsertRestApplication = typeof restApplications.$inferInsert;

export type SubstituteRequest = typeof substituteRequests.$inferSelect;
export type InsertSubstituteRequest = typeof substituteRequests.$inferInsert;

export type SubstituteApplication = typeof substituteApplications.$inferSelect;
export type InsertSubstituteApplication = typeof substituteApplications.$inferInsert;

export type InstituteClosure = typeof instituteClosure.$inferSelect;
export type InsertInstituteClosure = typeof instituteClosure.$inferInsert;

export type RestReward = typeof restRewards.$inferSelect;
export type InsertRestReward = typeof restRewards.$inferInsert;

// 휴식 관리 시스템 Zod 스키마
export const insertRestApplicationSchema = createInsertSchema(restApplications);
export const selectRestApplicationSchema = createSelectSchema(restApplications);

export const insertSubstituteRequestSchema = createInsertSchema(substituteRequests);
export const selectSubstituteRequestSchema = createSelectSchema(substituteRequests);

export const insertSubstituteApplicationSchema = createInsertSchema(substituteApplications);
export const selectSubstituteApplicationSchema = createSelectSchema(substituteApplications);

export const insertInstituteClosureSchema = createInsertSchema(instituteClosure);
export const selectInstituteClosureSchema = createSelectSchema(instituteClosure);

export const insertRestRewardSchema = createInsertSchema(restRewards);
export const selectRestRewardSchema = createSelectSchema(restRewards);

// 상품 관련 타입 정의
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export type ProductExposure = typeof productExposures.$inferSelect;
export type InsertProductExposure = typeof productExposures.$inferInsert;

export type ShoppingCart = typeof shoppingCarts.$inferSelect;
export type InsertShoppingCart = typeof shoppingCarts.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

// 상품 관련 Zod 스키마
export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);

export const insertProductExposureSchema = createInsertSchema(productExposures);
export const selectProductExposureSchema = createSelectSchema(productExposures);

export const insertShoppingCartSchema = createInsertSchema(shoppingCarts);
export const selectShoppingCartSchema = createSelectSchema(shoppingCarts);

export const insertOrderSchema = createInsertSchema(orders);
export const selectOrderSchema = createSelectSchema(orders);

export const insertOrderItemSchema = createInsertSchema(orderItems);
export const selectOrderItemSchema = createSelectSchema(orderItems);

// 로고 관리 테이블
export const logoAssets = pgTable("logo_assets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(), // 'main_logo', 'compact_logo', 'symbol', 'favicon'
  fileUrl: text("file_url").notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  isActive: boolean("is_active").default(true),
  uploadedById: integer("uploaded_by_id").references(() => users.id),
  themeVariant: varchar("theme_variant", { length: 20 }).default("light"), // 'light', 'dark', 'auto'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 로고 관련 타입 정의
export type LogoAsset = typeof logoAssets.$inferSelect;
export type InsertLogoAsset = typeof logoAssets.$inferInsert;

// 로고 관련 Zod 스키마
export const insertLogoAssetSchema = createInsertSchema(logoAssets);
export const selectLogoAssetSchema = createSelectSchema(logoAssets);

// 훈련사 인증 등급 테이블
export const trainerTiers = pgTable("trainer_tiers", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").references(() => users.id).notNull(),
  tier: varchar("tier", { length: 50 }).notNull().default("general"), // general, semi_certified, certified
  classCount: integer("class_count").default(0), // 누적 수업 횟수
  contentCount: integer("content_count").default(0), // 제작 콘텐츠 수
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.0"), // 팬 평점
  lastClassDate: timestamp("last_class_date"),
  certificationExamPassed: boolean("certification_exam_passed").default(false),
  substituteAgreementSigned: boolean("substitute_agreement_signed").default(false),
  educationCompleted: boolean("education_completed").default(false),
  specializedFields: text("specialized_fields").array(), // 전문 분야 배열
  availableTimeSlots: jsonb("available_time_slots"), // 가능한 시간대
  regionCoverage: text("region_coverage").array(), // 담당 가능 지역
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 대체 수업 게시판 테이블
export const substituteClassPosts = pgTable("substitute_class_posts", {
  id: serial("id").primaryKey(),
  originalTrainerId: integer("original_trainer_id").references(() => users.id).notNull(),
  classId: integer("class_id").references(() => courses.id).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  requiredSkills: text("required_skills").array(), // 필요한 스킬
  classDate: timestamp("class_date").notNull(),
  classTime: varchar("class_time", { length: 20 }).notNull(), // 예: "14:00-15:30"
  location: text("location"),
  isOnline: boolean("is_online").default(false),
  compensation: decimal("compensation", { precision: 10, scale: 2 }).notNull(),
  maxApplicants: integer("max_applicants").default(3),
  currentApplicants: integer("current_applicants").default(0),
  status: varchar("status", { length: 20 }).default("open"), // open, in_progress, closed, completed
  urgency: varchar("urgency", { length: 20 }).default("normal"), // low, normal, high, urgent
  studentCount: integer("student_count").default(1),
  studentAgeRange: varchar("student_age_range", { length: 50 }), // 예: "성인반", "아동반"
  specialRequirements: text("special_requirements"), // 특별 요구사항
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 대체 수업 신청 테이블
export const substituteClassApplications = pgTable("substitute_class_applications", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => substituteClassPosts.id).notNull(),
  applicantId: integer("applicant_id").references(() => users.id).notNull(),
  message: text("message"), // 신청 메시지
  proposedCompensation: decimal("proposed_compensation", { precision: 10, scale: 2 }), // 제안 수수료
  availableFrom: timestamp("available_from"),
  availableTo: timestamp("available_to"),
  status: varchar("status", { length: 20 }).default("pending"), // pending, accepted, rejected, completed
  applicationDate: timestamp("application_date").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 대체 수업 배정 테이블
export const substituteClassAssignments = pgTable("substitute_class_assignments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => substituteClassPosts.id).notNull(),
  originalTrainerId: integer("original_trainer_id").references(() => users.id).notNull(),
  substituteTrainerId: integer("substitute_trainer_id").references(() => users.id).notNull(),
  classId: integer("class_id").references(() => courses.id).notNull(),
  agreedCompensation: decimal("agreed_compensation", { precision: 10, scale: 2 }).notNull(),
  classDate: timestamp("class_date").notNull(),
  classTime: varchar("class_time", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).default("assigned"), // assigned, in_progress, completed, cancelled
  assignedAt: timestamp("assigned_at").defaultNow(),
  classStartedAt: timestamp("class_started_at"),
  classCompletedAt: timestamp("class_completed_at"),
  originalTrainerNotes: text("original_trainer_notes"), // 원래 훈련사 전달사항
  substituteTrainerNotes: text("substitute_trainer_notes"), // 대체 훈련사 피드백
  studentFeedback: text("student_feedback"), // 학생 피드백
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"), // pending, paid, failed
  paymentDate: timestamp("payment_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 대체 수업 매칭 로그 테이블
export const substituteMatchingLogs = pgTable("substitute_matching_logs", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => substituteClassPosts.id).notNull(),
  candidateTrainerId: integer("candidate_trainer_id").references(() => users.id).notNull(),
  matchScore: decimal("match_score", { precision: 5, scale: 2 }), // 매칭 점수
  matchingCriteria: jsonb("matching_criteria"), // 매칭 기준별 점수
  isRecommended: boolean("is_recommended").default(false),
  recommendationReason: text("recommendation_reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 대체 수업 알림 테이블
export const substituteClassNotifications = pgTable("substitute_class_notifications", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => substituteClassPosts.id).notNull(),
  recipientId: integer("recipient_id").references(() => users.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // post_created, application_received, assignment_made, class_reminder, payment_complete
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  sentAt: timestamp("sent_at").defaultNow(),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 대체 훈련사 시스템 타입 정의
export type TrainerTier = typeof trainerTiers.$inferSelect;
export type InsertTrainerTier = typeof trainerTiers.$inferInsert;

export type SubstituteClassPost = typeof substituteClassPosts.$inferSelect;
export type InsertSubstituteClassPost = typeof substituteClassPosts.$inferInsert;

export type SubstituteClassApplication = typeof substituteClassApplications.$inferSelect;
export type InsertSubstituteClassApplication = typeof substituteClassApplications.$inferInsert;

export type SubstituteClassAssignment = typeof substituteClassAssignments.$inferSelect;
export type InsertSubstituteClassAssignment = typeof substituteClassAssignments.$inferInsert;

export type SubstituteMatchingLog = typeof substituteMatchingLogs.$inferSelect;
export type InsertSubstituteMatchingLog = typeof substituteMatchingLogs.$inferInsert;

export type SubstituteClassNotification = typeof substituteClassNotifications.$inferSelect;
export type InsertSubstituteClassNotification = typeof substituteClassNotifications.$inferInsert;

// 대체 훈련사 시스템 Zod 스키마
export const insertTrainerTierSchema = createInsertSchema(trainerTiers);
export const selectTrainerTierSchema = createSelectSchema(trainerTiers);

export const insertSubstituteClassPostSchema = createInsertSchema(substituteClassPosts);
export const selectSubstituteClassPostSchema = createSelectSchema(substituteClassPosts);

export const insertSubstituteClassApplicationSchema = createInsertSchema(substituteClassApplications);
export const selectSubstituteClassApplicationSchema = createSelectSchema(substituteClassApplications);

export const insertSubstituteClassAssignmentSchema = createInsertSchema(substituteClassAssignments);
export const selectSubstituteClassAssignmentSchema = createSelectSchema(substituteClassAssignments);

export const insertSubstituteMatchingLogSchema = createInsertSchema(substituteMatchingLogs);
export const selectSubstituteMatchingLogSchema = createSelectSchema(substituteMatchingLogs);

export const insertSubstituteClassNotificationSchema = createInsertSchema(substituteClassNotifications);
export const selectSubstituteClassNotificationSchema = createSelectSchema(substituteClassNotifications);

// 수수료 정책 테이블
export const feePolicies = pgTable("fee_policies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  feeType: varchar("fee_type", { length: 50 }).notNull(), // 'percentage', 'fixed', 'tiered'
  baseRate: decimal("base_rate", { precision: 5, scale: 2 }).notNull(), // 기본 수수료율 또는 금액
  minAmount: decimal("min_amount", { precision: 10, scale: 2 }), // 최소 수수료
  maxAmount: decimal("max_amount", { precision: 10, scale: 2 }), // 최대 수수료
  tierConfig: jsonb("tier_config"), // 차등 수수료 설정
  targetType: varchar("target_type", { length: 50 }).notNull(), // 'trainer', 'institute', 'all'
  targetId: integer("target_id"), // 특정 대상 ID (null이면 전체 적용)
  isActive: boolean("is_active").default(true),
  validFrom: timestamp("valid_from").defaultNow(),
  validTo: timestamp("valid_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 거래 내역 테이블
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(), // 'course_payment', 'consultation', 'product_sale'
  referenceId: integer("reference_id").notNull(), // 강의, 상담, 상품 등의 ID
  referenceType: varchar("reference_type", { length: 50 }).notNull(), // 'course', 'consultation', 'product'
  payerId: integer("payer_id").notNull(), // 결제자 ID
  payeeId: integer("payee_id").notNull(), // 수취인 ID (훈련사/기관)
  grossAmount: decimal("gross_amount", { precision: 10, scale: 2 }).notNull(), // 총 결제금액
  feeAmount: decimal("fee_amount", { precision: 10, scale: 2 }).notNull(), // 수수료
  netAmount: decimal("net_amount", { precision: 10, scale: 2 }).notNull(), // 실 지급액
  currency: varchar("currency", { length: 3 }).default("KRW"),
  paymentMethod: varchar("payment_method", { length: 50 }), // 'card', 'bank_transfer', 'virtual_account'
  paymentProvider: varchar("payment_provider", { length: 50 }), // 'stripe', 'toss', 'kakao_pay'
  externalTransactionId: varchar("external_transaction_id", { length: 100 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending', 'completed', 'failed', 'refunded'
  feePolicyId: integer("fee_policy_id").references(() => feePolicies.id),
  instituteId: integer("institute_id"), // 기관 거래인 경우
  metadata: jsonb("metadata"), // 추가 정보
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 정산 내역 테이블
export const settlements = pgTable("settlements", {
  id: serial("id").primaryKey(),
  settlementType: varchar("settlement_type", { length: 50 }).notNull(), // 'trainer', 'institute'
  targetId: integer("target_id").notNull(), // 훈련사 또는 기관 ID
  targetName: varchar("target_name", { length: 200 }).notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  totalGrossAmount: decimal("total_gross_amount", { precision: 12, scale: 2 }).notNull(),
  totalFeeAmount: decimal("total_fee_amount", { precision: 12, scale: 2 }).notNull(),
  totalNetAmount: decimal("total_net_amount", { precision: 12, scale: 2 }).notNull(),
  transactionCount: integer("transaction_count").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending', 'processing', 'completed', 'paid'
  bankAccount: jsonb("bank_account"), // 계좌 정보
  settlementDetails: jsonb("settlement_details"), // 상세 정산 내역
  approvedBy: integer("approved_by"), // 승인자 ID
  processedAt: timestamp("processed_at"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 정산 항목 테이블 (정산의 세부 항목들)
export const settlementItems = pgTable("settlement_items", {
  id: serial("id").primaryKey(),
  settlementId: integer("settlement_id").references(() => settlements.id).notNull(),
  transactionId: integer("transaction_id").references(() => transactions.id).notNull(),
  itemName: varchar("item_name", { length: 200 }).notNull(),
  itemType: varchar("item_type", { length: 50 }).notNull(), // 'course', 'consultation', 'product'
  quantity: integer("quantity").notNull().default(1),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  grossAmount: decimal("gross_amount", { precision: 10, scale: 2 }).notNull(),
  feeAmount: decimal("fee_amount", { precision: 10, scale: 2 }).notNull(),
  netAmount: decimal("net_amount", { precision: 10, scale: 2 }).notNull(),
  feeRate: decimal("fee_rate", { precision: 5, scale: 2 }), // 적용된 수수료율
  createdAt: timestamp("created_at").defaultNow(),
});

// 타입 추출 
export type FeePolicy = typeof feePolicies.$inferSelect;
export type InsertFeePolicy = typeof feePolicies.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;
export type Settlement = typeof settlements.$inferSelect;
export type InsertSettlement = typeof settlements.$inferInsert;
export type SettlementItem = typeof settlementItems.$inferSelect;
export type InsertSettlementItem = typeof settlementItems.$inferInsert;

// AI 사용량 추적 테이블
export const aiUsageLog = pgTable("ai_usage_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  provider: varchar("provider", { length: 50 }).notNull(), // openai, anthropic, gemini, perplexity
  model: varchar("model", { length: 100 }).notNull(), // gpt-4o, claude-3, gemini-1.5-pro 등
  requestType: varchar("request_type", { length: 50 }).notNull(), // chat, analysis, training, health 등
  inputTokens: integer("input_tokens").default(0),
  outputTokens: integer("output_tokens").default(0),
  totalTokens: integer("total_tokens").default(0),
  cost: decimal("cost", { precision: 10, scale: 6 }).default("0"), // 요청당 비용 (달러)
  requestData: jsonb("request_data"), // 요청 세부 정보
  responseStatus: varchar("response_status", { length: 20 }).default("success"), // success, error, timeout
  responseTime: integer("response_time"), // 밀리초
  createdAt: timestamp("created_at").defaultNow(),
});

// AI 사용량 일일 집계 테이블
export const aiDailySummary = pgTable("ai_daily_summary", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  userId: integer("user_id").references(() => users.id),
  provider: varchar("provider", { length: 50 }).notNull(),
  totalRequests: integer("total_requests").default(0),
  totalTokens: integer("total_tokens").default(0),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }).default("0"),
  avgResponseTime: integer("avg_response_time"), // 평균 응답시간 (밀리초)
  errorCount: integer("error_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI 사용량 제한 설정 테이블
export const aiUsageLimits = pgTable("ai_usage_limits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  userRole: varchar("user_role", { length: 50 }).notNull(), // pet-owner, trainer, institute-admin, admin
  dailyRequestLimit: integer("daily_request_limit").default(50),
  dailyCostLimit: decimal("daily_cost_limit", { precision: 10, scale: 2 }).default("5.00"),
  monthlyRequestLimit: integer("monthly_request_limit").default(1000),
  monthlyCostLimit: decimal("monthly_cost_limit", { precision: 10, scale: 2 }).default("100.00"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI 사용량 테이블 타입 추출
export type AiUsageLog = typeof aiUsageLog.$inferSelect;
export type InsertAiUsageLog = typeof aiUsageLog.$inferInsert;
export type AiDailySummary = typeof aiDailySummary.$inferSelect;
export type InsertAiDailySummary = typeof aiDailySummary.$inferInsert;
export type AiUsageLimits = typeof aiUsageLimits.$inferSelect;
export type InsertAiUsageLimits = typeof aiUsageLimits.$inferInsert;

// 알림 시스템 스키마 및 타입
export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
} as const);

export const updateNotificationSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다").max(200, "제목은 200자를 초과할 수 없습니다").optional(),
  message: z.string().min(1, "메시지는 필수입니다").max(1000, "메시지는 1000자를 초과할 수 없습니다").optional(),
  type: z.enum(["info", "success", "warning", "error", "course", "payment", "training", "reservation", "system", "marketing"], {
    errorMap: () => ({ message: "올바른 알림 타입을 선택해주세요" })
  }).optional(),
  isRead: z.boolean().optional(),
  actionUrl: z.string().url("올바른 URL 형식이 아닙니다").nullable().optional(),
  metadata: z.record(z.any()).nullable().optional(),
});

export const createNotificationSchema = z.object({
  userId: z.number().int().positive("올바른 사용자 ID가 필요합니다"),
  title: z.string().min(1, "제목은 필수입니다").max(200, "제목은 200자를 초과할 수 없습니다"),
  message: z.string().min(1, "메시지는 필수입니다").max(1000, "메시지는 1000자를 초과할 수 없습니다"),
  type: z.enum(["info", "success", "warning", "error", "course", "payment", "training", "reservation", "system", "marketing"], {
    errorMap: () => ({ message: "올바른 알림 타입을 선택해주세요" })
  }),
  isRead: z.boolean().default(false),
  actionUrl: z.string().url("올바른 URL 형식이 아닙니다").nullable().optional(),
  metadata: z.record(z.any()).nullable().optional(),
});

export const selectNotificationSchema = createSelectSchema(notifications);

// 알림 조회 쿼리 스키마
export const notificationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  type: z.enum(["info", "success", "warning", "error", "course", "payment", "training", "reservation", "system", "marketing"]).optional(),
  isRead: z.coerce.boolean().optional(),
  sortBy: z.enum(["createdAt", "title", "type"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// 다중 알림 업데이트 스키마
export const bulkNotificationUpdateSchema = z.object({
  notificationIds: z.array(z.number().int().positive()).min(1, "적어도 하나의 알림을 선택해주세요"),
  updates: updateNotificationSchema,
});

// 알림 타입 정의
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof createNotificationSchema>;
export type UpdateNotification = z.infer<typeof updateNotificationSchema>;
export type NotificationQuery = z.infer<typeof notificationQuerySchema>;
export type BulkNotificationUpdate = z.infer<typeof bulkNotificationUpdateSchema>;

// 훈련 일지 (알림장) Zod 스키마
export const insertTrainingJournalSchema = createInsertSchema(trainingJournals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  readAt: true,
  isRead: true,
  status: true, // 기본값 사용
} as const).extend({
  trainerId: z.number().int().positive("올바른 훈련사 ID가 필요합니다"),
  petOwnerId: z.number().int().positive("올바른 견주 ID가 필요합니다"),
  petId: z.number().int().positive("올바른 반려동물 ID가 필요합니다"),
  title: z.string().min(1, "제목은 필수입니다").max(200, "제목은 200자를 초과할 수 없습니다"),
  content: z.string().min(1, "내용은 필수입니다").max(5000, "내용은 5000자를 초과할 수 없습니다"),
  trainingDate: z.string().min(1, "훈련 날짜는 필수입니다"),
  trainingDuration: z.number().int().min(1, "훈련 시간은 1분 이상이어야 합니다").max(480, "훈련 시간은 8시간을 초과할 수 없습니다").optional().nullable(),
  trainingType: z.string().max(100, "훈련 유형은 100자를 초과할 수 없습니다").optional().nullable(),
  progressRating: z.number().int().min(1, "평가는 1~5 사이여야 합니다").max(5, "평가는 1~5 사이여야 합니다").optional().nullable(),
  behaviorNotes: z.string().max(2000, "행동 관찰 노트는 2000자를 초과할 수 없습니다").optional().nullable(),
  homeworkInstructions: z.string().max(2000, "숙제 내용은 2000자를 초과할 수 없습니다").optional().nullable(),
  nextGoals: z.string().max(2000, "다음 목표는 2000자를 초과할 수 없습니다").optional().nullable(),
  attachments: z.array(z.string().url("올바른 URL 형식이 아닙니다")).optional().nullable().default([])
});

export const updateTrainingJournalSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다").max(200, "제목은 200자를 초과할 수 없습니다").optional(),
  content: z.string().min(1, "내용은 필수입니다").max(5000, "내용은 5000자를 초과할 수 없습니다").optional(),
  trainingDate: z.string().min(1, "훈련 날짜는 필수입니다").optional(),
  trainingDuration: z.number().int().min(1, "훈련 시간은 1분 이상이어야 합니다").max(480, "훈련 시간은 8시간을 초과할 수 없습니다").optional().nullable(),
  trainingType: z.string().max(100, "훈련 유형은 100자를 초과할 수 없습니다").optional().nullable(),
  progressRating: z.number().int().min(1, "평가는 1~5 사이여야 합니다").max(5, "평가는 1~5 사이여야 합니다").optional().nullable(),
  behaviorNotes: z.string().max(2000, "행동 관찰 노트는 2000자를 초과할 수 없습니다").optional().nullable(),
  homeworkInstructions: z.string().max(2000, "숙제 내용은 2000자를 초과할 수 없습니다").optional().nullable(),
  nextGoals: z.string().max(2000, "다음 목표는 2000자를 초과할 수 없습니다").optional().nullable(),
  attachments: z.array(z.string().url("올바른 URL 형식이 아닙니다")).optional().nullable(),
  isRead: z.boolean().optional(),
  status: z.enum(["sent", "read", "replied"]).optional()
});

export const selectTrainingJournalSchema = createSelectSchema(trainingJournals);

// 훈련 일지 조회 쿼리 스키마
export const trainingJournalQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  petId: z.coerce.number().int().positive().optional(),
  trainerId: z.coerce.number().int().positive().optional(),
  petOwnerId: z.coerce.number().int().positive().optional(),
  trainingType: z.string().optional(),
  status: z.enum(["sent", "read", "replied"]).optional(),
  isRead: z.coerce.boolean().optional(),
  fromDate: z.string().optional(), // YYYY-MM-DD 형식
  toDate: z.string().optional(),   // YYYY-MM-DD 형식
  sortBy: z.enum(["trainingDate", "createdAt", "title", "progressRating"]).default("trainingDate"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// 미디어 업로드 스키마
export const trainingJournalMediaUploadSchema = z.object({
  journalId: z.number().int().positive("올바른 일지 ID가 필요합니다"),
  mediaType: z.enum(["image", "video"], {
    errorMap: () => ({ message: "이미지 또는 비디오만 업로드 가능합니다" })
  }),
  description: z.string().max(500, "설명은 500자를 초과할 수 없습니다").optional()
});

// 대량 일지 상태 업데이트 스키마
export const bulkTrainingJournalUpdateSchema = z.object({
  journalIds: z.array(z.number().int().positive()).min(1, "적어도 하나의 일지를 선택해주세요"),
  updates: z.object({
    isRead: z.boolean().optional(),
    status: z.enum(["sent", "read", "replied"]).optional()
  })
});

// 훈련 일지 타입 정의
export type TrainingJournal = typeof trainingJournals.$inferSelect;
export type InsertTrainingJournal = z.infer<typeof insertTrainingJournalSchema>;
export type UpdateTrainingJournal = z.infer<typeof updateTrainingJournalSchema>;
export type TrainingJournalQuery = z.infer<typeof trainingJournalQuerySchema>;
export type TrainingJournalMediaUpload = z.infer<typeof trainingJournalMediaUploadSchema>;
export type BulkTrainingJournalUpdate = z.infer<typeof bulkTrainingJournalUpdateSchema>;

// =============================================================================
// 배너 관련 스키마 및 타입 정의
// =============================================================================

// 배너 생성 스키마
export const insertBannerSchema = createInsertSchema(banners).omit({ 
  id: true, 
  clickCount: true, 
  viewCount: true, 
  createdAt: true, 
  updatedAt: true 
} as const);

// 배너 수정 스키마
export const updateBannerSchema = insertBannerSchema.partial().extend({
  id: z.number().int().positive()
});

// 배너 조회 스키마
export const selectBannerSchema = createSelectSchema(banners);

// 배너 쿼리 스키마
export const bannerQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  targetPosition: z.enum(["home-hero", "sidebar", "footer", "header", "content-top", "content-bottom"]).optional(),
  targetUserGroup: z.enum(["all", "pet-owners", "trainers", "admins"]).optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(["displayOrder", "createdAt", "title", "clickCount"]).default("displayOrder"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// 배너 순서 변경 스키마
export const bannerReorderSchema = z.object({
  bannerId: z.number().int().positive(),
  newOrder: z.number().int().min(0),
  targetPosition: z.enum(["home-hero", "sidebar", "footer", "header", "content-top", "content-bottom"]).optional()
});

// 배너 통계 스키마
export const bannerAnalyticsSchema = z.object({
  bannerId: z.number().int().positive(),
  actionType: z.enum(["view", "click"]),
  userAgent: z.string().optional(),
  referrer: z.string().optional()
});

// 배너 대량 업데이트 스키마
export const bulkBannerUpdateSchema = z.object({
  bannerIds: z.array(z.number().int().positive()).min(1, "적어도 하나의 배너를 선택해주세요"),
  updates: z.object({
    isActive: z.boolean().optional(),
    targetPosition: z.enum(["home-hero", "sidebar", "footer", "header", "content-top", "content-bottom"]).optional(),
    displayOrder: z.number().int().min(0).optional()
  })
});

// 배너 타입 정의 (이미 존재하는 것 확장)
export type UpdateBanner = z.infer<typeof updateBannerSchema>;
export type InsertBanner = z.infer<typeof insertBannerSchema>;
export type BannerQuery = z.infer<typeof bannerQuerySchema>;
export type BannerReorder = z.infer<typeof bannerReorderSchema>;
export type BannerAnalytics = z.infer<typeof bannerAnalyticsSchema>;
export type BulkBannerUpdate = z.infer<typeof bulkBannerUpdateSchema>;

// =============================================================================
// 로고 설정 테이블 - 전체 애플리케이션의 로고 표시 설정 관리
// =============================================================================

export const logoSettings = pgTable("logo_settings", {
  id: serial("id").primaryKey(),
  logoUrl: text("logo_url").notNull(),
  logoPosition: varchar("logo_position", { length: 20 }).notNull().default("left"), // left, center, right
  logoSize: varchar("logo_size", { length: 20 }).notNull().default("medium"), // small, medium, large
  altText: varchar("alt_text", { length: 200 }).notNull().default("로고"),
  linkUrl: text("link_url").default("/"), // 로고 클릭 시 이동할 URL
  maxWidth: integer("max_width").default(200), // 최대 너비 (px)
  maxHeight: integer("max_height").default(80), // 최대 높이 (px)
  showOnMobile: boolean("show_on_mobile").default(true),
  showOnDesktop: boolean("show_on_desktop").default(true),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 로고 설정 삽입 스키마
export const insertLogoSettingsSchema = createInsertSchema(logoSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
} as const);

// 로고 설정 업데이트 스키마 - 비즈니스 로직과 검증 포함
export const updateLogoSettingsSchema = z.object({
  logoUrl: z.string().url("올바른 URL 형식이어야 합니다").min(1, "로고 URL은 필수입니다")
    .refine(url => {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp'];
      return imageExtensions.some(ext => url.toLowerCase().includes(ext));
    }, "이미지 파일 형식만 허용됩니다 (jpg, png, gif, svg, webp, bmp)"),
  logoPosition: z.enum(["left", "center", "right"], {
    errorMap: () => ({ message: "로고 위치는 left, center, right 중 하나여야 합니다" })
  }).default("left"),
  logoSize: z.enum(["small", "medium", "large"], {
    errorMap: () => ({ message: "로고 크기는 small, medium, large 중 하나여야 합니다" })
  }).default("medium"),
  altText: z.string().min(1, "대체 텍스트는 필수입니다").max(200, "대체 텍스트는 200자를 초과할 수 없습니다").default("로고"),
  linkUrl: z.string().url("올바른 URL 형식이어야 합니다").optional().default("/"),
  maxWidth: z.number().int().min(50, "최소 너비는 50px입니다").max(800, "최대 너비는 800px입니다").default(200),
  maxHeight: z.number().int().min(20, "최소 높이는 20px입니다").max(200, "최대 높이는 200px입니다").default(80),
  showOnMobile: z.boolean().default(true),
  showOnDesktop: z.boolean().default(true),
  isActive: z.boolean().default(true)
});

// 로고 설정 조회 스키마
export const selectLogoSettingsSchema = createSelectSchema(logoSettings);

// 로고 설정 쿼리 스키마
export const logoSettingsQuerySchema = z.object({
  includeInactive: z.coerce.boolean().default(false),
});

// 로고 설정 타입 정의
export type LogoSettings = z.infer<typeof selectLogoSettingsSchema>;
export type InsertLogoSettings = z.infer<typeof insertLogoSettingsSchema>;
export type UpdateLogoSettings = z.infer<typeof updateLogoSettingsSchema>;
export type LogoSettingsQuery = z.infer<typeof logoSettingsQuerySchema>;

// =============================================================================
// 강의(Courses) 스키마 정의 - RBAC 보안 적용
// =============================================================================

// 강의 기본 스키마
export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  rating: true,
  enrollmentCount: true,
  createdAt: true,
  updatedAt: true
} as const).extend({
  title: z.string().min(1, "제목은 필수입니다").max(200, "제목은 200자를 초과할 수 없습니다"),
  description: z.string().max(5000, "설명은 5000자를 초과할 수 없습니다").optional().nullable(),
  content: z.string().max(10000, "내용은 10000자를 초과할 수 없습니다").optional().nullable(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "올바른 가격 형식이 아닙니다").optional().nullable(),
  duration: z.number().int().min(1, "강의 시간은 1분 이상이어야 합니다").optional().nullable(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional().nullable(),
  category: z.string().max(100, "카테고리는 100자를 초과할 수 없습니다").optional().nullable(),
  imageUrl: z.string().url("올바른 URL 형식이 아닙니다").optional().nullable(),
  videoUrl: z.string().url("올바른 URL 형식이 아닙니다").optional().nullable()
});

// 강의 수정 스키마 - 보안: instituteId, instructorId 보호
export const updateCourseSchema = insertCourseSchema.partial().omit({
  instituteId: true,    // 소유권 필드 보호 - RBAC Critical
  instructorId: true    // 소유권 필드 보호 - RBAC Critical
} as const);

// 강의 조회 스키마
export const selectCourseSchema = createSelectSchema(courses);

// Additional course type definitions (avoiding duplicates)
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type UpdateCourse = z.infer<typeof updateCourseSchema>;

// =============================================================================
// 화상 강의 세션 (줌 화상 수업) 스키마 정의
// =============================================================================

// 화상 강의 세션 생성 스키마
export const insertVideoLectureSessionSchema = createInsertSchema(videoLectureSessions).omit({
  id: true,
  actualStartTime: true,
  actualEndTime: true,
  currentParticipants: true,
  zoomMeetingId: true,
  zoomJoinUrl: true,
  zoomStartUrl: true,
  zoomMeetingPassword: true,
  createdAt: true,
  updatedAt: true
} as const).extend({
  courseId: z.number().int().positive("올바른 강의 ID가 필요합니다"),
  instructorId: z.number().int().positive("올바른 강사 ID가 필요합니다"),
  title: z.string().min(1, "제목은 필수입니다").max(200, "제목은 200자를 초과할 수 없습니다"),
  description: z.string().max(1000, "설명은 1000자를 초과할 수 없습니다").optional().nullable(),
  scheduledStartTime: z.string().datetime("올바른 날짜 시간 형식이 필요합니다"),
  scheduledEndTime: z.string().datetime("올바른 날짜 시간 형식이 필요합니다"),
  maxParticipants: z.number().int().min(1, "최소 1명 이상 참가 가능해야 합니다").max(500, "최대 500명까지 참가 가능합니다").default(50),
  sessionNotes: z.string().max(2000, "세션 노트는 2000자를 초과할 수 없습니다").optional().nullable(),
  materials: z.array(z.string().url("올바른 URL 형식이 아닙니다")).default([]),
  tags: z.array(z.string().max(50, "태그는 50자를 초과할 수 없습니다")).default([])
});

// 화상 강의 세션 수정 스키마
export const updateVideoLectureSessionSchema = insertVideoLectureSessionSchema.partial().omit({
  courseId: true,
  instructorId: true
} as const).extend({
  status: z.enum(["scheduled", "live", "completed", "cancelled"]).optional(),
  recordingUrl: z.string().url("올바른 URL 형식이 아닙니다").optional().nullable()
});

// 화상 강의 세션 조회 스키마
export const selectVideoLectureSessionSchema = createSelectSchema(videoLectureSessions);

// 화상 강의 예약 생성 스키마
export const insertVideoLectureBookingSchema = createInsertSchema(videoLectureBookings).omit({
  id: true,
  joinTime: true,
  leaveTime: true,
  createdAt: true,
  updatedAt: true
} as const).extend({
  sessionId: z.number().int().positive("올바른 세션 ID가 필요합니다"),
  userId: z.number().int().positive("올바른 사용자 ID가 필요합니다"),
  petId: z.number().int().positive().optional().nullable(),
  specialRequests: z.string().max(500, "특별 요청사항은 500자를 초과할 수 없습니다").optional().nullable()
});

// 화상 강의 예약 수정 스키마
export const updateVideoLectureBookingSchema = z.object({
  bookingStatus: z.enum(["confirmed", "cancelled", "no_show"]).optional(),
  attendanceStatus: z.enum(["registered", "attended", "absent"]).optional(),
  feedback: z.string().max(1000, "피드백은 1000자를 초과할 수 없습니다").optional().nullable(),
  rating: z.number().int().min(1, "평점은 1~5 사이여야 합니다").max(5, "평점은 1~5 사이여야 합니다").optional().nullable()
});

// 화상 강의 예약 조회 스키마
export const selectVideoLectureBookingSchema = createSelectSchema(videoLectureBookings);

// 화상 강의 세션 쿼리 스키마
export const videoLectureSessionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  courseId: z.coerce.number().int().positive().optional(),
  instructorId: z.coerce.number().int().positive().optional(),
  status: z.enum(["scheduled", "live", "completed", "cancelled"]).optional(),
  fromDate: z.string().optional(), // YYYY-MM-DD 형식
  toDate: z.string().optional(),   // YYYY-MM-DD 형식
  sortBy: z.enum(["scheduledStartTime", "createdAt", "title", "status"]).default("scheduledStartTime"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// 화상 강의 예약 쿼리 스키마
export const videoLectureBookingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sessionId: z.coerce.number().int().positive().optional(),
  userId: z.coerce.number().int().positive().optional(),
  bookingStatus: z.enum(["confirmed", "cancelled", "no_show"]).optional(),
  attendanceStatus: z.enum(["registered", "attended", "absent"]).optional(),
  sortBy: z.enum(["createdAt", "scheduledStartTime", "rating"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// 줌 미팅 생성 스키마
export const createZoomMeetingSchema = z.object({
  sessionId: z.number().int().positive("올바른 세션 ID가 필요합니다"),
  topic: z.string().min(1, "주제는 필수입니다").max(200, "주제는 200자를 초과할 수 없습니다"),
  startTime: z.string().datetime("올바른 날짜 시간 형식이 필요합니다"),
  duration: z.number().int().min(15, "최소 15분 이상이어야 합니다").max(480, "최대 8시간까지 가능합니다"),
  password: z.string().min(4, "비밀번호는 최소 4자 이상이어야 합니다").max(10, "비밀번호는 최대 10자까지 가능합니다").optional(),
  waitingRoom: z.boolean().default(true),
  joinBeforeHost: z.boolean().default(false),
  muteUponEntry: z.boolean().default(true),
  autoRecording: z.enum(["none", "local", "cloud"]).default("none")
});

// 화상 강의 타입 정의
export type VideoLectureSession = typeof videoLectureSessions.$inferSelect;
export type InsertVideoLectureSession = z.infer<typeof insertVideoLectureSessionSchema>;
export type UpdateVideoLectureSession = z.infer<typeof updateVideoLectureSessionSchema>;
export type VideoLectureSessionQuery = z.infer<typeof videoLectureSessionQuerySchema>;

export type VideoLectureBooking = typeof videoLectureBookings.$inferSelect;
export type InsertVideoLectureBooking = z.infer<typeof insertVideoLectureBookingSchema>;
export type UpdateVideoLectureBooking = z.infer<typeof updateVideoLectureBookingSchema>;
export type VideoLectureBookingQuery = z.infer<typeof videoLectureBookingQuerySchema>;

export type CreateZoomMeeting = z.infer<typeof createZoomMeetingSchema>;

// 확장된 강의 타입 (화상 강의 포함)
export type CourseType = "regular" | "video_lecture" | "hybrid";

// UserRole 타입 정의 (이미 정의되어 있지만 확실히 하기 위해)
export type UserRole = "user" | "pet-owner" | "trainer" | "institute-admin" | "admin";

// 카카오톡 메시지 전송 스키마
export const sendKakaoMessageSchema = z.object({
  studentId: z.coerce.number().int().positive("올바른 수강생 ID가 필요합니다"),
  notebookData: z.object({
    title: z.string().min(1, "제목은 필수입니다").max(200, "제목은 200자를 초과할 수 없습니다"),
    content: z.string().min(1, "내용은 필수입니다").max(2000, "내용은 2000자를 초과할 수 없습니다"),
    studentName: z.string().min(1, "수강생 이름은 필수입니다").max(100, "이름은 100자를 초과할 수 없습니다"),
    petName: z.string().min(1, "반려동물 이름은 필수입니다").max(100, "이름은 100자를 초과할 수 없습니다"),
    trainingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "올바른 날짜 형식이 필요합니다 (YYYY-MM-DD)"),
    progressRating: z.number().int().min(1, "평점은 1점 이상이어야 합니다").max(5, "평점은 5점 이하여야 합니다"),
    trainerName: z.string().min(1, "훈련사 이름은 필수입니다").max(100, "이름은 100자를 초과할 수 없습니다"),
  })
});

export type SendKakaoMessage = z.infer<typeof sendKakaoMessageSchema>;

