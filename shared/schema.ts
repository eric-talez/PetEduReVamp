import { pgTable, text, serial, integer, boolean, timestamp, json, varchar, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User types
export type UserRole = 'user' | 'pet-owner' | 'trainer' | 'institute-admin' | 'admin';

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").$type<UserRole>().notNull().default('user'),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  bio: text("bio"),
  location: text("location"),
  specialty: text("specialty"),
  isVerified: boolean("is_verified").default(false),
  instituteId: integer("institute_id").references(() => institutes.id, { onDelete: 'set null' }),
  // 소셜 로그인 관련 필드
  ci: text("ci").unique(), // 사용자 식별 정보 (소셜 ID + 제공자)
  verified: boolean("verified").default(false),
  verifiedAt: timestamp("verified_at"),
  verificationName: text("verification_name"), // 실명 인증 이름
  verificationBirth: text("verification_birth"), // 생년월일
  verificationPhone: text("verification_phone"), // 인증 휴대폰
  // 소셜 로그인 제공자 정보
  provider: text("provider"), // 'kakao', 'naver' 등
  socialId: text("social_id"), // 소셜 서비스에서의 ID
  // 결제 관련 필드 추가
  stripeCustomerId: text("stripe_customer_id"), // Stripe 고객 ID
  stripeSubscriptionId: text("stripe_subscription_id"), // Stripe 구독 ID
  membershipTier: text("membership_tier"), // 'free', 'basic', 'premium' 등
  membershipExpiresAt: timestamp("membership_expires_at"), // 멤버십 만료일
});

// 기관 정보 테이블
export const institutes = pgTable("institutes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  description: text("description"),
  logo: text("logo"),
  isActive: boolean("is_active").default(true),
  businessNumber: text("business_number"),
  capacity: integer("capacity").default(50),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 반려동물 정보 테이블
export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  breed: text("breed").notNull(),
  age: integer("age").notNull(),
  weight: integer("weight"), // 그램 단위
  gender: text("gender"), // 'male', 'female'
  description: text("description"),
  avatar: text("avatar"),
  ownerId: integer("owner_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  health: text("health"),
  temperament: text("temperament"),
  allergies: text("allergies"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 훈련 세션 테이블
export const trainingSessions = pgTable("training_sessions", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id, { onDelete: 'cascade' }).notNull(),
  trainerId: integer("trainer_id").references(() => users.id, { onDelete: 'set null' }),
  skill: text("skill").notNull(),
  progress: integer("progress").notNull().default(0), // 0-100
  level: text("level").notNull(), // 'beginner', 'intermediate', 'advanced', 'master'
  sessionDate: timestamp("session_date").notNull().defaultNow(),
  duration: integer("duration"), // 분 단위
  notes: text("notes"),
  score: integer("score"), // 0-100
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 강의/코스 테이블
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  image: text("image"),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(), // 'beginner', 'intermediate', 'advanced'
  duration: integer("duration"), // 분 단위
  price: integer("price").default(0), // 원 단위
  trainerId: integer("trainer_id").references(() => users.id, { onDelete: 'set null' }),
  instituteId: integer("institute_id").references(() => institutes.id, { onDelete: 'set null' }),
  isActive: boolean("is_active").default(true),
  isPopular: boolean("is_popular").default(false),
  isCertified: boolean("is_certified").default(false),
  maxParticipants: integer("max_participants").default(10),
  syllabus: json("syllabus"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 강의 등록 테이블
export const courseEnrollments = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  petId: integer("pet_id").references(() => pets.id, { onDelete: 'cascade' }),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  progress: integer("progress").default(0), // 0-100
  status: text("status").notNull().default('active'), // 'active', 'completed', 'cancelled'
});

// 강의 스케줄 테이블
export const courseSchedules = pgTable("course_schedules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").notNull(), // 분 단위
  maxParticipants: integer("max_participants").default(10),
  currentParticipants: integer("current_participants").default(0),
  location: text("location"),
  meetingUrl: text("meeting_url"), // 온라인 강의용
  status: text("status").notNull().default('scheduled'), // 'scheduled', 'ongoing', 'completed', 'cancelled'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// AI 분석 결과 테이블
export const aiAnalyses = pgTable("ai_analyses", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id, { onDelete: 'cascade' }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  analysisType: text("analysis_type").notNull(), // 'behavior', 'health', 'training'
  inputData: json("input_data"), // 분석에 사용된 입력 데이터
  results: json("results"), // AI 분석 결과
  confidence: integer("confidence"), // 0-100
  recommendations: json("recommendations"), // 추천 사항
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 쇼핑 카테고리 테이블
export const shopCategories = pgTable("shop_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  parentId: integer("parent_id"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 상품 테이블
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // 원 단위
  discountPrice: integer("discount_price"),
  categoryId: integer("category_id").references(() => shopCategories.id, { onDelete: 'set null' }),
  images: json("images").$type<string[]>(), // 이미지 URL 배열
  tags: json("tags").$type<string[]>(), // 태그 배열
  stock: integer("stock").default(0),
  isActive: boolean("is_active").default(true),
  rating: integer("rating").default(0), // 0-500 (5.0 = 500)
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 장바구니 테이블
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  productId: integer("product_id").references(() => products.id, { onDelete: 'cascade' }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  options: json("options"), // 색상, 크기 등 옵션
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 이벤트 관련 테이블
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  date: timestamp("date").notNull(),
  location: text("location"),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  price: integer("price").default(0),
  imageUrl: text("image_url"),
  organizerId: integer("organizer_id").references(() => users.id, { onDelete: 'set null' }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const eventLocations = pgTable("event_locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  capacity: integer("capacity"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const eventAttendances = pgTable("event_attendances", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id, { onDelete: 'cascade' }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  attendedAt: timestamp("attended_at").notNull().defaultNow(),
});

// 수수료 정책 테이블
export const commissionPolicies = pgTable("commission_policies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  rate: integer("rate").notNull(), // 백분율 * 100 (예: 15% = 1500)
  minAmount: integer("min_amount").default(0),
  maxAmount: integer("max_amount"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 수수료 거래 테이블
export const commissionTransactions = pgTable("commission_transactions", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").notNull(),
  amount: integer("amount").notNull(),
  commissionRate: integer("commission_rate").notNull(),
  commissionAmount: integer("commission_amount").notNull(),
  status: text("status").notNull().default('pending'),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 정산 보고서 테이블
export const settlementReports = pgTable("settlement_reports", {
  id: serial("id").primaryKey(),
  period: text("period").notNull(), // 'YYYY-MM' 형식
  totalRevenue: integer("total_revenue").notNull(),
  totalCommission: integer("total_commission").notNull(),
  netAmount: integer("net_amount").notNull(),
  status: text("status").notNull().default('pending'), // 'pending', 'approved', 'paid'
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
  approvedAt: timestamp("approved_at"),
  paidAt: timestamp("paid_at"),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Pet = typeof pets.$inferSelect;
export type InsertPet = typeof pets.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;
export type TrainingSession = typeof trainingSessions.$inferSelect;
export type InsertTrainingSession = typeof trainingSessions.$inferInsert;
export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;
export type EventLocation = typeof eventLocations.$inferSelect;
export type InsertEventLocation = typeof eventLocations.$inferInsert;
export type EventAttendance = typeof eventAttendances.$inferSelect;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

// Schema exports for validation
export const createUserSchema = createInsertSchema(users)
  .omit({
    id: true,
    createdAt: true,
    instituteId: true,
    verified: true,
    verifiedAt: true,
    provider: true,
    socialId: true
  })
  .extend({
    instituteCode: z.string().optional(),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
    ci: z.string().optional(),
    verificationData: z.object({
      name: z.string(),
      birth: z.string(),
      phone: z.string(),
      medicalHistory: z.string().optional(),
    }).optional(),
  });

export const createPetSchema = createInsertSchema(pets).omit({
  id: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true
});

export const createCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const createEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const createProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// 수수료 관련 스키마
export const createCommissionPolicySchema = createInsertSchema(commissionPolicies).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const createCommissionTransactionSchema = createInsertSchema(commissionTransactions).omit({
  id: true,
  createdAt: true
});

export const createSettlementReportSchema = createInsertSchema(settlementReports).omit({
  id: true,
  generatedAt: true,
  approvedAt: true,
  paidAt: true
});

export const createTrainingSessionSchema = createInsertSchema(trainingSessions).omit({
  id: true,
  createdAt: true
});

export const createCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true
});