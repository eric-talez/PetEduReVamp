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
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  isActive: boolean("is_active").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  enrollmentCount: integer("enrollment_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 기관 테이블
export const institutes = pgTable("institutes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  website: text("website"),
  logoUrl: text("logo_url"),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  // 구독 플랜 관련 필드
  subscriptionPlan: varchar("subscription_plan", { length: 50 }).default("starter"),
  subscriptionStatus: varchar("subscription_status", { length: 20 }).default("active"),
  subscriptionStartDate: timestamp("subscription_start_date").defaultNow(),
  subscriptionEndDate: timestamp("subscription_end_date"),
  maxMembers: integer("max_members").default(50),
  maxVideoHours: integer("max_video_hours").default(10),
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
  weight: decimal("weight", { precision: 5, scale: 2 }),
  ownerId: integer("owner_id").references(() => users.id),
  profileImage: text("profile_image"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 커뮤니티 게시글 테이블
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
  is_active: boolean("is_active").default(true),
  rating: integer("rating").default(0),
  review_count: integer("review_count").default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
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
export const insertCourseSchema = createInsertSchema(courses);
export const selectCourseSchema = createSelectSchema(courses);
export const insertInstituteSchema = createInsertSchema(institutes);
export const selectInstituteSchema = createSelectSchema(institutes);
export const insertPetSchema = createInsertSchema(pets);
export const selectPetSchema = createSelectSchema(pets);

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
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
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

// Type definitions
export type UserRole = "admin" | "trainer" | "institute-admin" | "pet-owner";

export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = z.infer<typeof selectCourseSchema>;
export type NewCourse = z.infer<typeof insertCourseSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Institute = z.infer<typeof selectInstituteSchema>;
export type NewInstitute = z.infer<typeof insertInstituteSchema>;

export type Pet = z.infer<typeof selectPetSchema>;
export type NewPet = z.infer<typeof insertPetSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export type EventLocation = typeof eventLocations.$inferSelect;
export type InsertEventLocation = typeof eventLocations.$inferInsert;

export type EventAttendance = typeof eventAttendances.$inferSelect;

export type TrainingJournal = typeof trainingJournals.$inferSelect;
export type InsertTrainingJournal = typeof trainingJournals.$inferInsert;

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

export const pointTransactions = pgTable("point_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  transactionType: text("transaction_type"),
  createdAt: timestamp("created_at").defaultNow(),
});

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
export type InsertBanner = typeof banners.$inferInsert;

export type JournalComment = typeof journalComments.$inferSelect;
export type InsertJournalComment = typeof journalComments.$inferInsert;

export type JournalServiceRequest = typeof journalServiceRequests.$inferSelect;
export type InsertJournalServiceRequest = typeof journalServiceRequests.$inferInsert;

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
  status: varchar("status", { length: 20 }).default("draft"), // draft, pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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