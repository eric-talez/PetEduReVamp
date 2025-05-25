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
    // 소셜 로그인 정보
    ci: z.string().optional(),
    verified: z.boolean().optional().default(false),
    verifiedAt: z.date().optional(),
    verificationName: z.string().optional(),
    verificationBirth: z.string().optional(),
    verificationPhone: z.string().optional(),
    provider: z.string().optional(),
    socialId: z.string().optional(),
    // 반려동물 정보
    petInfo: z.object({
      name: z.string(),
      breed: z.string(),
      age: z.string(),
      gender: z.enum(['male', 'female']),
      weight: z.string(),
      neutered: z.boolean(),
      medicalHistory: z.string().optional(),
    }).optional(),
  });

// Pet types
export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  breed: text("breed").notNull(),
  age: text("age").notNull(),
  gender: text("gender").notNull(),
  weight: text("weight").notNull(),
  photo: text("photo"),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  health: text("health"),
  temperament: text("temperament"),
  allergies: text("allergies"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const createPetSchema = createInsertSchema(pets).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Course types
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  price: integer("price").notNull(),
  duration: text("duration").notNull(),
  level: text("level").notNull(),
  category: text("category").notNull(),
  trainerId: integer("trainer_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  instituteId: integer("institute_id").references(() => institutes.id, { onDelete: 'set null' }),
  isPopular: boolean("is_popular").default(false),
  isCertified: boolean("is_certified").default(false),
  syllabus: json("syllabus"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const createCourseSchema = createInsertSchema(courses).omit({
  id: true,
  trainerId: true,
  createdAt: true,
  updatedAt: true
});

// Institute types
export const institutes = pgTable("institutes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  location: text("location").notNull(),
  facilities: json("facilities").$type<string[]>(),
  openingHours: text("opening_hours").notNull(),
  category: text("category").notNull(),
  certification: boolean("certification").default(false),
  premium: boolean("premium").default(false),
  established: text("established"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const createInstituteSchema = createInsertSchema(institutes).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Enrollment types
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: 'cascade' }),
  progress: integer("progress").default(0),
  status: varchar("status", { length: 20 }).notNull().default('inProgress'),
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date"),
  completed: boolean("completed").default(false),
  certificateIssued: boolean("certificate_issued").default(false),
});

export const createEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  progress: true,
  completed: true,
  certificateIssued: true
});

// Vaccination types
export const vaccinations = pgTable("vaccinations", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").notNull().references(() => pets.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  nextDue: timestamp("next_due"),
  notes: text("notes"),
});

export const createVaccinationSchema = createInsertSchema(vaccinations).omit({
  id: true
});

// Training Session types
export const trainingSessions = pgTable("training_sessions", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").notNull().references(() => pets.id, { onDelete: 'cascade' }),
  courseId: integer("course_id").references(() => courses.id, { onDelete: 'set null' }),
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  notes: text("notes"),
});

export const createTrainingSessionSchema = createInsertSchema(trainingSessions).omit({
  id: true
});

// Achievement types
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").notNull().references(() => pets.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  description: text("description"),
});

export const createAchievementSchema = createInsertSchema(achievements).omit({
  id: true
});

// Community Post types
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  image: text("image"),
  tag: text("tag"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const createPostSchema = createInsertSchema(posts).omit({
  id: true,
  authorId: true,
  likes: true,
  comments: true,
  createdAt: true,
  updatedAt: true
});

export const insertPostSchema = createPostSchema;

// 게시글 댓글 테이블
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: 'cascade' }),
  authorId: integer("author_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  parentId: integer("parent_id").references(() => comments.id), // 대댓글 지원
  isEdited: boolean("is_edited").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const createCommentSchema = createInsertSchema(comments).omit({
  id: true,
  authorId: true,
  likes: true,
  isEdited: true,
  createdAt: true,
  updatedAt: true
});

// 좋아요 테이블
export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: integer("post_id").references(() => posts.id, { onDelete: 'cascade' }),
  commentId: integer("comment_id").references(() => comments.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    // 사용자는 게시글당 한 번만 좋아요 가능
    postUserUnique: uniqueIndex("post_user_unique").on(table.userId, table.postId),
    // 사용자는 댓글당 한 번만 좋아요 가능
    commentUserUnique: uniqueIndex("comment_user_unique").on(table.userId, table.commentId),
  }
});

// 팔로우 관계 테이블
export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  followingId: integer("following_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    // 팔로워와 팔로잉 조합은 고유해야 함
    followerFollowingUnique: uniqueIndex("follower_following_unique").on(table.followerId, table.followingId),
  }
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof createUserSchema>;

export type Pet = typeof pets.$inferSelect;
export type InsertPet = z.infer<typeof createPetSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof createCourseSchema>;

export type Institute = typeof institutes.$inferSelect;
export type InsertInstitute = z.infer<typeof createInstituteSchema>;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof createEnrollmentSchema>;

export type Vaccination = typeof vaccinations.$inferSelect;
export type InsertVaccination = z.infer<typeof createVaccinationSchema>;

export type TrainingSession = typeof trainingSessions.$inferSelect;
export type InsertTrainingSession = z.infer<typeof createTrainingSessionSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof createAchievementSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof createPostSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof createCommentSchema>;

export type Like = typeof likes.$inferSelect;

export type Follow = typeof follows.$inferSelect;

// 이벤트 위치 타입
export const eventLocations = pgTable("event_locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  lat: text("lat").notNull(),
  lng: text("lng").notNull(),
  region: text("region").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const createEventLocationSchema = createInsertSchema(eventLocations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// 이벤트 타입
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  date: text("date").notNull(),
  time: text("time").notNull(),
  locationId: integer("location_id").notNull().references(() => eventLocations.id, { onDelete: 'cascade' }),
  organizerId: integer("organizer_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  category: text("category").notNull(),
  price: json("price").$type<number | '무료'>().notNull(),
  attendees: integer("attendees").default(0),
  maxAttendees: integer("max_attendees"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const createEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  attendees: true
});

// 이벤트 참가 타입
export const eventAttendances = pgTable("event_attendances", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id, { onDelete: 'cascade' }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const createEventAttendanceSchema = createInsertSchema(eventAttendances).omit({
  id: true,
  createdAt: true
});

export type EventLocation = typeof eventLocations.$inferSelect;
export type InsertEventLocation = z.infer<typeof createEventLocationSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof createEventSchema>;

export type EventAttendance = typeof eventAttendances.$inferSelect;
export type InsertEventAttendance = z.infer<typeof createEventAttendanceSchema>;

// Commission Policy types
export const commissionPolicies = pgTable("commission_policies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  baseRate: integer("base_rate").notNull(),
  status: text("status").notNull().default('active'),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const createCommissionPolicySchema = createInsertSchema(commissionPolicies).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Commission Tier types
export const commissionTiers = pgTable("commission_tiers", {
  id: serial("id").primaryKey(),
  policyId: integer("policy_id").notNull().references(() => commissionPolicies.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  minSales: integer("min_sales").notNull(),
  rate: integer("rate").notNull(),
});

export const createCommissionTierSchema = createInsertSchema(commissionTiers).omit({
  id: true
});

// Commission Transaction types
export const commissionTransactions = pgTable("commission_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  orderNumber: text("order_number").notNull(),
  productName: text("product_name").notNull(),
  orderAmount: integer("order_amount").notNull(),
  commissionAmount: integer("commission_amount").notNull(),
  commissionRate: integer("commission_rate").notNull(),
  status: text("status").notNull().default('pending'),
  referralCode: text("referral_code"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  paidAt: timestamp("paid_at"),
});

export const createCommissionTransactionSchema = createInsertSchema(commissionTransactions).omit({
  id: true,
  createdAt: true,
  paidAt: true
});

// Settlement Report types
export const settlementReports = pgTable("settlement_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  totalCommission: integer("total_commission").notNull(),
  transactionCount: integer("transaction_count").notNull(),
  status: text("status").notNull().default('pending'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  paidAt: timestamp("paid_at"),
  paymentMethod: text("payment_method"),
  bankInfo: text("bank_info"),
});

export const createSettlementReportSchema = createInsertSchema(settlementReports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  paidAt: true
});

export type CommissionPolicy = typeof commissionPolicies.$inferSelect;
export type InsertCommissionPolicy = z.infer<typeof createCommissionPolicySchema>;

export type CommissionTier = typeof commissionTiers.$inferSelect;
export type InsertCommissionTier = z.infer<typeof createCommissionTierSchema>;

export type CommissionTransaction = typeof commissionTransactions.$inferSelect;
export type InsertCommissionTransaction = z.infer<typeof createCommissionTransactionSchema>;

export type SettlementReport = typeof settlementReports.$inferSelect;
export type InsertSettlementReport = z.infer<typeof createSettlementReportSchema>;

// 메뉴 구성 관련 테이블 정의
// 메인 메뉴 구성 테이블
export const menuConfigurations = pgTable("menu_configurations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // 메뉴 구성의 이름
  description: text("description"), // 메뉴 구성에 대한 설명
  configuration: json("configuration").notNull().$type<{
    groups: {
      id: string;
      title: string;
      icon: string;
      orderIndex: number;
      isActive: boolean;
      isPublic: boolean;
      roles: string[];
      isOpen: boolean;
      instituteId?: number | null;
    }[];
    items: {
      id: string;
      title: string;
      path: string;
      icon: string;
      type: string;
      category: string;
      roles: string[];
      orderIndex: number;
      isActive: boolean;
      isPublic: boolean;
      openInNewWindow?: boolean;
      instituteId?: number | null;
    }[];
    lastUpdated: string;
    updatedBy: string;
  }>(), // 더 구체적인 타입으로 JSON 구조화
  instituteId: integer("institute_id").references(() => institutes.id), // null이면 전체 시스템 메뉴 구성
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: integer("updated_by").references(() => users.id)
});

// 메뉴 구성 스키마
export const createMenuConfigurationSchema = createInsertSchema(menuConfigurations).omit({
  id: true,
  createdAt: true
});

export type MenuConfiguration = typeof menuConfigurations.$inferSelect;
export type InsertMenuConfiguration = z.infer<typeof createMenuConfigurationSchema>;

// 결제 및 구독 관련 테이블 정의
// 결제 플랜 테이블
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // 월 구독료 (원 단위)
  interval: text("interval").notNull(), // 'month', 'year'
  stripePriceId: text("stripe_price_id"), // Stripe의 가격 ID
  features: json("features").$type<string[]>(), // 플랜에 포함된 기능 목록
  isPopular: boolean("is_popular").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const createSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// 결제 내역 테이블
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: integer("amount").notNull(), // 결제 금액 (원 단위)
  status: text("status").notNull(), // 'succeeded', 'pending', 'failed'
  paymentMethod: text("payment_method").notNull(), // 'card', 'bank_transfer', 등
  paymentType: text("payment_type").notNull(), // 'subscription', 'one_time'
  stripePaymentId: text("stripe_payment_id"), // Stripe 결제 ID
  stripeCustomerId: text("stripe_customer_id"), // Stripe 고객 ID
  description: text("description"),
  receiptUrl: text("receipt_url"), // 영수증 URL
  paymentDate: timestamp("payment_date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const createPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true
});

// 구독 테이블
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  planId: integer("plan_id").notNull().references(() => subscriptionPlans.id),
  status: text("status").notNull(), // 'active', 'canceled', 'past_due', 'trialing'
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  canceledAt: timestamp("canceled_at"),
});

export const createSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  canceledAt: true
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof createSubscriptionPlanSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof createPaymentSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof createSubscriptionSchema>;

// 분석 및 보고서 관련 테이블 정의
// 사용자 활동 로그 테이블
export const userActivityLogs = pgTable("user_activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  activityType: text("activity_type").notNull(), // 'login', 'course_view', 'video_watch', 'post_create', etc.
  metadata: json("metadata"), // 활동 관련 추가 정보를 JSON으로 저장
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 반려동물 건강 로그 테이블
export const petHealthLogs = pgTable("pet_health_logs", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").notNull().references(() => pets.id, { onDelete: 'cascade' }),
  recordType: text("record_type").notNull(), // 'weight', 'meal', 'medication', 'symptom', 'exercise', etc.
  value: text("value"), // 기록 값 (예: 무게, 약 이름 등)
  unit: text("unit"), // 단위 (예: kg, ml 등)
  notes: text("notes"),
  recordedAt: timestamp("recorded_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const createPetHealthLogSchema = createInsertSchema(petHealthLogs).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// 훈련 진행 로그 테이블
export const trainingProgressLogs = pgTable("training_progress_logs", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id").notNull().references(() => enrollments.id, { onDelete: 'cascade' }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: 'cascade' }),
  lessonId: integer("lesson_id"), // 강의 ID (별도 테이블이 필요할 수 있음)
  progressType: text("progress_type").notNull(), // 'lesson_complete', 'quiz_complete', 'assignment_submit', etc.
  score: integer("score"), // 점수 (있는 경우)
  duration: integer("duration"), // 소요 시간 (초 단위)
  metadata: json("metadata"), // 추가 정보
  completedAt: timestamp("completed_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 분석 보고서 템플릿 테이블
export const reportTemplates = pgTable("report_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  reportType: text("report_type").notNull(), // 'user_activity', 'pet_health', 'training_progress', etc.
  config: json("config").notNull(), // 보고서 구성 설정
  isPublic: boolean("is_public").default(false),
  createdById: integer("created_by_id").references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 생성된 보고서 테이블
export const generatedReports = pgTable("generated_reports", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").references(() => reportTemplates.id, { onDelete: 'set null' }),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
  petId: integer("pet_id").references(() => pets.id, { onDelete: 'set null' }),
  name: text("name").notNull(),
  description: text("description"),
  reportType: text("report_type").notNull(),
  dateRange: json("date_range").$type<{ start: Date, end: Date }>(),
  data: json("data"), // 보고서 데이터
  pdfUrl: text("pdf_url"), // 생성된 PDF URL (있는 경우)
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  accessCount: integer("access_count").default(0),
});

export type UserActivityLog = typeof userActivityLogs.$inferSelect;
export type PetHealthLog = typeof petHealthLogs.$inferSelect;
export type InsertPetHealthLog = z.infer<typeof createPetHealthLogSchema>;
export type TrainingProgressLog = typeof trainingProgressLogs.$inferSelect;
export type ReportTemplate = typeof reportTemplates.$inferSelect;
export type GeneratedReport = typeof generatedReports.$inferSelect;
