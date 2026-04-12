import { pgTable, serial, varchar, integer, numeric, timestamp, boolean, jsonb, text, json, unique, date, index, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const aiDailySummary = pgTable("ai_daily_summary", {
	id: serial().primaryKey().notNull(),
	date: varchar({ length: 10 }).notNull(),
	userId: integer("user_id"),
	provider: varchar({ length: 50 }).notNull(),
	totalRequests: integer("total_requests").default(0),
	totalTokens: integer("total_tokens").default(0),
	totalCost: numeric("total_cost", { precision: 10, scale:  2 }).default('0'),
	avgResponseTime: integer("avg_response_time"),
	errorCount: integer("error_count").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const aiUsageLimits = pgTable("ai_usage_limits", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	userRole: varchar("user_role", { length: 50 }).notNull(),
	dailyRequestLimit: integer("daily_request_limit").default(50),
	dailyCostLimit: numeric("daily_cost_limit", { precision: 10, scale:  2 }).default('5.00'),
	monthlyRequestLimit: integer("monthly_request_limit").default(1000),
	monthlyCostLimit: numeric("monthly_cost_limit", { precision: 10, scale:  2 }).default('100.00'),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const aiUsageLog = pgTable("ai_usage_log", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	provider: varchar({ length: 50 }).notNull(),
	model: varchar({ length: 100 }).notNull(),
	requestType: varchar("request_type", { length: 50 }).notNull(),
	inputTokens: integer("input_tokens").default(0),
	outputTokens: integer("output_tokens").default(0),
	totalTokens: integer("total_tokens").default(0),
	cost: numeric({ precision: 10, scale:  6 }).default('0'),
	requestData: jsonb("request_data"),
	responseStatus: varchar("response_status", { length: 20 }).default('success'),
	responseTime: integer("response_time"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const banners = pgTable("banners", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	imageUrl: text("image_url").notNull(),
	altText: text("alt_text"),
	linkUrl: text("link_url"),
	targetBlank: boolean("target_blank").default(true),
	type: text().default('main').notNull(),
	position: text().default('hero').notNull(),
	orderIndex: integer("order_index").default(0).notNull(),
	startDate: timestamp("start_date", { mode: 'string' }),
	endDate: timestamp("end_date", { mode: 'string' }),
	status: text().default('active').notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: integer("created_by"),
});

export const commissionPolicies = pgTable("commission_policies", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	rate: integer().notNull(),
	minAmount: integer("min_amount").default(0),
	maxAmount: integer("max_amount"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const commissionTransactions = pgTable("commission_transactions", {
	id: serial().primaryKey().notNull(),
	orderId: text("order_id").notNull(),
	amount: integer().notNull(),
	commissionRate: integer("commission_rate").notNull(),
	commissionAmount: integer("commission_amount").notNull(),
	status: text().default('pending').notNull(),
	userId: integer("user_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
	id: serial().primaryKey().notNull(),
	participantIds: json("participant_ids").notNull(),
	title: text(),
	type: text().default('direct').notNull(),
	lastMessageId: integer("last_message_id"),
	lastMessageAt: timestamp("last_message_at", { mode: 'string' }),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const courseEnrollments = pgTable("course_enrollments", {
	id: serial().primaryKey().notNull(),
	courseId: integer("course_id").notNull(),
	userId: integer("user_id").notNull(),
	petId: integer("pet_id"),
	enrolledAt: timestamp("enrolled_at", { mode: 'string' }).defaultNow().notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	progress: integer().default(0),
	status: text().default('active').notNull(),
});

export const courseSchedules = pgTable("course_schedules", {
	id: serial().primaryKey().notNull(),
	courseId: integer("course_id").notNull(),
	scheduledAt: timestamp("scheduled_at", { mode: 'string' }).notNull(),
	duration: integer().notNull(),
	maxParticipants: integer("max_participants").default(10),
	currentParticipants: integer("current_participants").default(0),
	location: text(),
	meetingUrl: text("meeting_url"),
	status: text().default('scheduled').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const environmentVariables = pgTable("environment_variables", {
	id: serial().primaryKey().notNull(),
	key: varchar({ length: 100 }).notNull(),
	value: text().notNull(),
	description: text(),
	category: varchar({ length: 50 }).default('general'),
	isSecret: boolean("is_secret").default(true),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	unique("environment_variables_key_key").on(table.key),
]);

export const eventAttendances = pgTable("event_attendances", {
	id: serial().primaryKey().notNull(),
	eventId: integer("event_id").notNull(),
	userId: integer("user_id").notNull(),
	attendedAt: timestamp("attended_at", { mode: 'string' }).defaultNow().notNull(),
});

export const eventLocations = pgTable("event_locations", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	address: text().notNull(),
	latitude: text(),
	longitude: text(),
	capacity: integer(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const events = pgTable("events", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	category: text().notNull(),
	date: timestamp({ mode: 'string' }).notNull(),
	location: text(),
	maxParticipants: integer("max_participants"),
	currentParticipants: integer("current_participants").default(0),
	price: integer().default(0),
	imageUrl: text("image_url"),
	organizerId: integer("organizer_id"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const follows = pgTable("follows", {
	id: serial().primaryKey().notNull(),
	followerId: integer("follower_id").notNull(),
	followingId: integer("following_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const healthCheckups = pgTable("health_checkups", {
	id: serial().primaryKey().notNull(),
	petId: integer("pet_id").notNull(),
	checkupDate: timestamp("checkup_date", { mode: 'string' }).notNull(),
	weight: integer(),
	temperature: text(),
	bloodPressure: text("blood_pressure"),
	heartRate: varchar("heart_rate", { length: 50 }),
	diagnosis: text(),
	treatment: text(),
	medication: text(),
	veterinarian: varchar({ length: 255 }),
	clinicName: varchar("clinic_name", { length: 255 }),
	notes: text(),
	nextCheckupDate: date("next_checkup_date"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const likes = pgTable("likes", {
	id: serial().primaryKey().notNull(),
	postId: integer("post_id").notNull(),
	userId: integer("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const logoSettings = pgTable("logo_settings", {
	id: serial().primaryKey().notNull(),
	logoUrl: text("logo_url").notNull(),
	logoPosition: varchar("logo_position", { length: 20 }).default('left'),
	logoSize: varchar("logo_size", { length: 20 }).default('medium'),
	altText: varchar("alt_text", { length: 200 }).default('로고'),
	linkUrl: varchar("link_url", { length: 500 }).default('/'),
	maxWidth: integer("max_width").default(200),
	maxHeight: integer("max_height").default(80),
	showOnMobile: boolean("show_on_mobile").default(true),
	showOnDesktop: boolean("show_on_desktop").default(true),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const matchingRequests = pgTable("matching_requests", {
	id: serial().primaryKey().notNull(),
	trainerId: integer("trainer_id"),
	trainerName: text("trainer_name"),
	petId: integer("pet_id"),
	petName: text("pet_name"),
	petOwnerId: integer("pet_owner_id"),
	petOwnerName: text("pet_owner_name"),
	status: text().default('pending'),
	response: text(),
	processedAt: timestamp("processed_at", { mode: 'string' }),
	processedBy: integer("processed_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const medicalAttachments = pgTable("medical_attachments", {
	id: serial().primaryKey().notNull(),
	petId: integer("pet_id").notNull(),
	recordType: text("record_type").notNull(),
	recordId: integer("record_id").notNull(),
	fileName: text("file_name").notNull(),
	filePath: text("file_path").notNull(),
	fileType: text("file_type"),
	uploadedAt: timestamp("uploaded_at", { mode: 'string' }).defaultNow().notNull(),
});

export const menuVisibilitySettings = pgTable("menu_visibility_settings", {
	id: serial().primaryKey().notNull(),
	role: varchar({ length: 50 }).notNull(),
	menuId: varchar("menu_id", { length: 100 }).notNull(),
	isVisible: boolean("is_visible").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("menu_visibility_settings_role_menu_id_key").on(table.role, table.menuId),
]);

export const messages = pgTable("messages", {
	id: serial().primaryKey().notNull(),
	conversationId: integer("conversation_id").notNull(),
	senderId: integer("sender_id").notNull(),
	content: text().notNull(),
	type: text().default('text').notNull(),
	metadata: json(),
	isRead: boolean("is_read").default(false).notNull(),
	isEdited: boolean("is_edited").default(false).notNull(),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const monetizationSettings = pgTable("monetization_settings", {
	id: serial().primaryKey().notNull(),
	key: varchar({ length: 50 }).notNull(),
	value: json().notNull(),
	description: text(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("monetization_settings_key_key").on(table.key),
]);

export const notifications = pgTable("notifications", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	type: text().notNull(),
	title: text().notNull(),
	message: text().notNull(),
	data: json(),
	isRead: boolean("is_read").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const petFacilities = pgTable("pet_facilities", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 200 }).notNull(),
	type: varchar({ length: 50 }).notNull(),
	latitude: text().notNull(),
	longitude: text().notNull(),
	address: text().notNull(),
	city: varchar({ length: 100 }),
	district: varchar({ length: 100 }),
	phone: varchar({ length: 20 }),
	rating: numeric({ precision: 3, scale:  2 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const registrationApplications = pgTable("registration_applications", {
	id: serial().primaryKey().notNull(),
	type: text().notNull(),
	applicantInfo: jsonb("applicant_info").notNull(),
	status: text().default('pending'),
	submittedAt: timestamp("submitted_at", { mode: 'string' }).defaultNow(),
	processedAt: timestamp("processed_at", { mode: 'string' }),
	processedBy: integer("processed_by"),
	rejectionReason: text("rejection_reason"),
});

export const session = pgTable("session", {
	sid: varchar().primaryKey().notNull(),
	sess: json().notNull(),
	expire: timestamp({ precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	index("IDX_session_expire").using("btree", table.expire.asc().nullsLast().op("timestamp_ops")),
]);

export const settlementReports = pgTable("settlement_reports", {
	id: serial().primaryKey().notNull(),
	period: text().notNull(),
	totalRevenue: integer("total_revenue").notNull(),
	totalCommission: integer("total_commission").notNull(),
	netAmount: integer("net_amount").notNull(),
	status: text().default('pending').notNull(),
	generatedAt: timestamp("generated_at", { mode: 'string' }).defaultNow().notNull(),
	approvedAt: timestamp("approved_at", { mode: 'string' }),
	paidAt: timestamp("paid_at", { mode: 'string' }),
});

export const shopCategories = pgTable("shop_categories", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	parentId: integer("parent_id"),
	isActive: boolean("is_active").default(true),
	sortOrder: integer("sort_order").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const trainingSessions = pgTable("training_sessions", {
	id: serial().primaryKey().notNull(),
	petId: integer("pet_id").notNull(),
	trainerId: integer("trainer_id"),
	skill: text().notNull(),
	progress: integer().default(0).notNull(),
	level: text().notNull(),
	sessionDate: timestamp("session_date", { mode: 'string' }).defaultNow().notNull(),
	duration: integer(),
	notes: text(),
	score: integer(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const vaccinations = pgTable("vaccinations", {
	id: serial().primaryKey().notNull(),
	petId: integer("pet_id").notNull(),
	vaccineName: text("vaccine_name").notNull(),
	vaccineType: text("vaccine_type"),
	vaccineDate: timestamp("vaccine_date", { mode: 'string' }).notNull(),
	nextDueDate: timestamp("next_due_date", { mode: 'string' }),
	veterinarian: text(),
	clinicName: text("clinic_name"),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const aiAnalyses = pgTable("ai_analyses", {
	id: serial().primaryKey().notNull(),
	petId: integer("pet_id").notNull(),
	userId: integer("user_id").notNull(),
	analysisType: text("analysis_type").notNull(),
	inputData: json("input_data"),
	results: json(),
	confidence: integer(),
	recommendations: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.petId],
			foreignColumns: [pets.id],
			name: "ai_analyses_pet_id_pets_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "ai_analyses_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: text().notNull(),
	password: text(),
	email: text().notNull(),
	name: text().notNull(),
	role: text().default('user').notNull(),
	avatar: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	bio: text(),
	location: text(),
	specialty: text(),
	isVerified: boolean("is_verified").default(false),
	instituteId: integer("institute_id"),
	ci: text(),
	verified: boolean().default(false),
	verifiedAt: timestamp("verified_at", { mode: 'string' }),
	verificationName: text("verification_name"),
	verificationBirth: text("verification_birth"),
	verificationPhone: text("verification_phone"),
	provider: text(),
	socialId: text("social_id"),
	stripeCustomerId: text("stripe_customer_id"),
	stripeSubscriptionId: text("stripe_subscription_id"),
	membershipTier: text("membership_tier"),
	membershipExpiresAt: timestamp("membership_expires_at", { mode: 'string' }),
	address: text(),
	latitude: text(),
	longitude: text(),
	workingArea: text("working_area"),
	isActive: boolean("is_active").default(true),
	phone: varchar({ length: 20 }),
	phoneNumber: varchar("phone_number", { length: 20 }),
	birthDate: varchar("birth_date", { length: 10 }),
	age: integer(),
	gender: varchar({ length: 10 }),
	profileImage: text("profile_image"),
	subscriptionTier: text("subscription_tier").default('free'),
	referralCode: text("referral_code"),
	aiUsage: integer("ai_usage").default(0),
	points: integer().default(0),
	fullName: varchar("full_name", { length: 200 }),
	zoomLink: text("zoom_link"),
	zoomPmi: varchar("zoom_pmi", { length: 20 }),
	zoomPmiPassword: varchar("zoom_pmi_password", { length: 50 }),
	zoomHostKey: varchar("zoom_host_key", { length: 20 }),
	videoCallPreference: varchar("video_call_preference", { length: 50 }).default('zoom'),
	emailVerified: boolean("email_verified").default(false),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	approvalStatus: varchar("approval_status", { length: 20 }).default('approved'),
	approvedAt: timestamp("approved_at", { mode: 'string' }),
	approvedBy: integer("approved_by"),
	rejectionReason: text("rejection_reason"),
}, (table) => [
	unique("users_username_unique").on(table.username),
	unique("users_email_unique").on(table.email),
	unique("users_ci_unique").on(table.ci),
]);

export const careLogs = pgTable("care_logs", {
	id: serial().primaryKey().notNull(),
	petId: integer("pet_id").notNull(),
	trainerId: integer("trainer_id"),
	logType: varchar("log_type", { length: 50 }).notNull(),
	title: varchar({ length: 200 }).notNull(),
	content: text(),
	careDate: timestamp("care_date", { mode: 'string' }).notNull(),
	durationMinutes: integer("duration_minutes"),
	moodRating: integer("mood_rating"),
	appetiteRating: integer("appetite_rating"),
	activityLevel: integer("activity_level"),
	notes: text(),
	attachments: text().array(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.petId],
			foreignColumns: [pets.id],
			name: "care_logs_pet_id_fkey"
		}),
	foreignKey({
			columns: [table.trainerId],
			foreignColumns: [users.id],
			name: "care_logs_trainer_id_fkey"
		}),
]);

export const products = pgTable("products", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	price: integer().notNull(),
	discountPrice: integer("discount_price"),
	categoryId: integer("category_id"),
	images: json(),
	tags: json(),
	stock: integer().default(0),
	isActive: boolean("is_active").default(true),
	rating: integer().default(0),
	reviewCount: integer("review_count").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	lowStockThreshold: integer("low_stock_threshold").default(10),
	autoReorderEnabled: boolean("auto_reorder_enabled").default(false),
	autoReorderQuantity: integer("auto_reorder_quantity").default(50),
	supplierId: integer("supplier_id"),
});

export const cartItems = pgTable("cart_items", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	productId: integer("product_id").notNull(),
	quantity: integer().default(1).notNull(),
	options: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "cart_items_product_id_products_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "cart_items_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const posts = pgTable("posts", {
	id: serial().primaryKey().notNull(),
	authorId: integer("author_id").notNull(),
	title: text().notNull(),
	content: text().notNull(),
	tag: text(),
	image: text(),
	likes: integer().default(0),
	comments: integer().default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	category: text().default('general').notNull(),
	views: integer().default(0),
	isDeleted: boolean("is_deleted").default(false),
	locationName: varchar("location_name", { length: 200 }),
	locationAddress: text("location_address"),
	locationLatitude: text("location_latitude"),
	locationLongitude: text("location_longitude"),
});

export const comments = pgTable("comments", {
	id: serial().primaryKey().notNull(),
	postId: integer("post_id").notNull(),
	userId: integer("user_id").notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	parentId: integer("parent_id"),
	likes: integer().default(0),
	isEdited: boolean("is_edited").default(false),
	isDeleted: boolean("is_deleted").default(false),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.id],
			name: "comments_post_id_posts_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "comments_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const contentApprovals = pgTable("content_approvals", {
	id: serial().primaryKey().notNull(),
	contentType: varchar("content_type", { length: 50 }).notNull(),
	contentId: integer("content_id").notNull(),
	submitterId: integer("submitter_id").notNull(),
	instituteId: integer("institute_id").notNull(),
	title: varchar({ length: 200 }).notNull(),
	description: text(),
	content: jsonb(),
	attachments: text().array(),
	trainerStatus: varchar("trainer_status", { length: 20 }).default('submitted'),
	instituteStatus: varchar("institute_status", { length: 20 }).default('pending'),
	adminStatus: varchar("admin_status", { length: 20 }).default('pending'),
	instituteReviewerId: integer("institute_reviewer_id"),
	adminReviewerId: integer("admin_reviewer_id"),
	instituteComment: text("institute_comment"),
	adminComment: text("admin_comment"),
	instituteReviewedAt: timestamp("institute_reviewed_at", { mode: 'string' }),
	adminReviewedAt: timestamp("admin_reviewed_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.adminReviewerId],
			foreignColumns: [users.id],
			name: "content_approvals_admin_reviewer_id_fkey"
		}),
	foreignKey({
			columns: [table.instituteId],
			foreignColumns: [institutes.id],
			name: "content_approvals_institute_id_fkey"
		}),
	foreignKey({
			columns: [table.instituteReviewerId],
			foreignColumns: [users.id],
			name: "content_approvals_institute_reviewer_id_fkey"
		}),
	foreignKey({
			columns: [table.submitterId],
			foreignColumns: [users.id],
			name: "content_approvals_submitter_id_fkey"
		}),
]);

export const institutes = pgTable("institutes", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	code: text().notNull(),
	address: text(),
	phone: text(),
	email: text(),
	website: text(),
	description: text(),
	logo: text(),
	isActive: boolean("is_active").default(true),
	businessNumber: text("business_number"),
	capacity: integer().default(50),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	latitude: text(),
	longitude: text(),
	rating: numeric({ precision: 3, scale:  2 }),
	featuresEnabled: jsonb("features_enabled"),
	certification: boolean().default(false),
}, (table) => [
	unique("institutes_code_unique").on(table.code),
]);

export const courses = pgTable("courses", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	image: text(),
	category: text().notNull(),
	level: text().notNull(),
	duration: integer(),
	price: integer().default(0),
	trainerId: integer("trainer_id"),
	instituteId: integer("institute_id"),
	isPopular: boolean("is_popular").default(false),
	isCertified: boolean("is_certified").default(false),
	maxParticipants: integer("max_participants").default(10),
	syllabus: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const courseProgress = pgTable("course_progress", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	courseId: integer("course_id").notNull(),
	lessonId: integer("lesson_id"),
	progressPercentage: numeric("progress_percentage", { precision: 5, scale:  2 }).default('0'),
	completedLessons: integer("completed_lessons").array().default([RAY]),
	currentLesson: integer("current_lesson"),
	totalWatchTime: integer("total_watch_time").default(0),
	lastAccessedAt: timestamp("last_accessed_at", { mode: 'string' }),
	startedAt: timestamp("started_at", { mode: 'string' }).defaultNow(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	status: varchar({ length: 20 }).default('in_progress'),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "course_progress_course_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "course_progress_user_id_fkey"
		}),
]);

export const coursePurchases = pgTable("course_purchases", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	courseId: integer("course_id").notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	paymentMethod: varchar("payment_method", { length: 50 }),
	paymentStatus: varchar("payment_status", { length: 50 }).default('pending'),
	transactionId: varchar("transaction_id", { length: 100 }),
	purchasedAt: timestamp("purchased_at", { mode: 'string' }).defaultNow(),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "course_purchases_course_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "course_purchases_user_id_fkey"
		}),
]);

export const curriculums = pgTable("curriculums", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 200 }).notNull(),
	description: text(),
	creatorId: integer("creator_id").notNull(),
	instituteId: integer("institute_id"),
	targetLevel: varchar("target_level", { length: 50 }),
	duration: integer(),
	sessions: jsonb(),
	prerequisites: text().array(),
	learningObjectives: text("learning_objectives").array(),
	materials: text().array(),
	assessmentMethods: text("assessment_methods").array(),
	isPublic: boolean("is_public").default(false),
	status: varchar({ length: 20 }).default('draft'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.creatorId],
			foreignColumns: [users.id],
			name: "curriculums_creator_id_fkey"
		}),
	foreignKey({
			columns: [table.instituteId],
			foreignColumns: [institutes.id],
			name: "curriculums_institute_id_fkey"
		}),
]);

export const educationCredits = pgTable("education_credits", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	amount: integer().default(1).notNull(),
	reason: varchar({ length: 100 }).notNull(),
	sourceId: integer("source_id"),
	isUsed: boolean("is_used").default(false),
	usedAt: timestamp("used_at", { mode: 'string' }),
	usedForCourseId: integer("used_for_course_id"),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.usedForCourseId],
			foreignColumns: [courses.id],
			name: "education_credits_used_for_course_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "education_credits_user_id_fkey"
		}),
]);

export const engagementEvents = pgTable("engagement_events", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	targetType: varchar("target_type", { length: 20 }).notNull(),
	targetId: integer("target_id"),
	eventType: varchar("event_type", { length: 30 }).notNull(),
	value: numeric({ precision: 10, scale:  2 }).default('1'),
	metadata: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "engagement_events_user_id_fkey"
		}),
]);

export const fcmTokens = pgTable("fcm_tokens", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	token: text().notNull(),
	deviceType: varchar("device_type", { length: 20 }),
	deviceInfo: jsonb("device_info"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "fcm_tokens_user_id_fkey"
		}),
	unique("fcm_tokens_token_key").on(table.token),
]);

export const friendInvitations = pgTable("friend_invitations", {
	id: serial().primaryKey().notNull(),
	inviterId: integer("inviter_id").notNull(),
	inviteeEmail: varchar("invitee_email", { length: 255 }),
	inviteeId: integer("invitee_id"),
	inviteCode: varchar("invite_code", { length: 50 }).notNull(),
	status: varchar({ length: 20 }).default('pending'),
	acceptedAt: timestamp("accepted_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.inviteeId],
			foreignColumns: [users.id],
			name: "friend_invitations_invitee_id_fkey"
		}),
	foreignKey({
			columns: [table.inviterId],
			foreignColumns: [users.id],
			name: "friend_invitations_inviter_id_fkey"
		}),
]);

export const trainerRankings = pgTable("trainer_rankings", {
	id: serial().primaryKey().notNull(),
	trainerId: integer("trainer_id").notNull(),
	period: varchar({ length: 20 }).notNull(),
	rank: integer().notNull(),
	totalPoints: numeric("total_points", { precision: 12, scale:  2 }).default('0'),
	totalSessions: integer("total_sessions").default(0),
	totalRevenue: numeric("total_revenue", { precision: 12, scale:  2 }).default('0'),
	tier: varchar({ length: 20 }).default('bronze'),
	badgeEarned: varchar("badge_earned", { length: 50 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.trainerId],
			foreignColumns: [users.id],
			name: "trainer_rankings_trainer_id_fkey"
		}),
]);

export const incentivePayments = pgTable("incentive_payments", {
	id: serial().primaryKey().notNull(),
	trainerId: integer("trainer_id").notNull(),
	rankingId: integer("ranking_id"),
	period: varchar({ length: 20 }).notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	paymentType: varchar("payment_type", { length: 50 }).notNull(),
	status: varchar({ length: 20 }).default('pending'),
	paidAt: timestamp("paid_at", { mode: 'string' }),
	description: text(),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.rankingId],
			foreignColumns: [trainerRankings.id],
			name: "incentive_payments_ranking_id_fkey"
		}),
	foreignKey({
			columns: [table.trainerId],
			foreignColumns: [users.id],
			name: "incentive_payments_trainer_id_fkey"
		}),
]);

export const instituteApplications = pgTable("institute_applications", {
	id: serial().primaryKey().notNull(),
	instituteName: varchar("institute_name", { length: 200 }).notNull(),
	representativeName: varchar("representative_name", { length: 100 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }).notNull(),
	businessNumber: varchar("business_number", { length: 50 }),
	address: text().notNull(),
	website: text(),
	description: text(),
	certificationDocuments: text("certification_documents"),
	facilities: text(),
	trainerCount: integer("trainer_count").default(0),
	capacity: integer().default(0),
	programs: text(),
	status: varchar({ length: 20 }).default('pending'),
	submittedAt: timestamp("submitted_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	reviewedAt: timestamp("reviewed_at", { mode: 'string' }),
	reviewedBy: integer("reviewed_by"),
	reviewNotes: text("review_notes"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.reviewedBy],
			foreignColumns: [users.id],
			name: "institute_applications_reviewed_by_fkey"
		}),
]);

export const liveStreams = pgTable("live_streams", {
	id: serial().primaryKey().notNull(),
	hostId: integer("host_id").notNull(),
	title: varchar({ length: 200 }).notNull(),
	description: text(),
	category: varchar({ length: 50 }).default('general'),
	streamKey: varchar("stream_key", { length: 100 }).notNull(),
	meetingUrl: text("meeting_url"),
	meetingCode: varchar("meeting_code", { length: 50 }),
	thumbnailUrl: text("thumbnail_url"),
	status: varchar({ length: 20 }).default('scheduled').notNull(),
	isPublic: boolean("is_public").default(true),
	maxViewers: integer("max_viewers").default(100),
	currentViewers: integer("current_viewers").default(0),
	peakViewers: integer("peak_viewers").default(0),
	totalViews: integer("total_views").default(0),
	scheduledStartTime: timestamp("scheduled_start_time", { mode: 'string' }),
	actualStartTime: timestamp("actual_start_time", { mode: 'string' }),
	endTime: timestamp("end_time", { mode: 'string' }),
	duration: integer().default(0),
	recordingUrl: text("recording_url"),
	chatEnabled: boolean("chat_enabled").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.hostId],
			foreignColumns: [users.id],
			name: "live_streams_host_id_fkey"
		}),
	unique("live_streams_stream_key_key").on(table.streamKey),
]);

export const monthlyPointSummary = pgTable("monthly_point_summary", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	month: varchar({ length: 7 }).notNull(),
	totalPoints: numeric("total_points", { precision: 12, scale:  2 }).default('0'),
	earnedPoints: numeric("earned_points", { precision: 12, scale:  2 }).default('0'),
	spentPoints: numeric("spent_points", { precision: 12, scale:  2 }).default('0'),
	bonusPoints: numeric("bonus_points", { precision: 12, scale:  2 }).default('0'),
	sessionCount: integer("session_count").default(0),
	courseCount: integer("course_count").default(0),
	revenueAmount: numeric("revenue_amount", { precision: 12, scale:  2 }).default('0'),
	rank: integer(),
	tier: varchar({ length: 20 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "monthly_point_summary_user_id_fkey"
		}),
]);

export const orders = pgTable("orders", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	orderNumber: varchar("order_number", { length: 100 }).notNull(),
	status: varchar({ length: 50 }).default('pending'),
	totalAmount: numeric("total_amount", { precision: 10, scale:  2 }).notNull(),
	shippingAddress: jsonb("shipping_address"),
	billingAddress: jsonb("billing_address"),
	paymentMethod: varchar("payment_method", { length: 50 }),
	paymentStatus: varchar("payment_status", { length: 50 }).default('pending'),
	shippingStatus: varchar("shipping_status", { length: 50 }).default('pending'),
	trackingNumber: varchar("tracking_number", { length: 100 }),
	notes: text(),
	orderedAt: timestamp("ordered_at", { mode: 'string' }).defaultNow(),
	shippedAt: timestamp("shipped_at", { mode: 'string' }),
	deliveredAt: timestamp("delivered_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "orders_user_id_fkey"
		}),
]);

export const orderItems = pgTable("order_items", {
	id: serial().primaryKey().notNull(),
	orderId: integer("order_id").notNull(),
	productId: integer("product_id").notNull(),
	quantity: integer().default(1).notNull(),
	unitPrice: numeric("unit_price", { precision: 10, scale:  2 }).notNull(),
	totalPrice: numeric("total_price", { precision: 10, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_items_order_id_fkey"
		}),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "order_items_product_id_fkey"
		}),
]);

export const monthlyRevenue = pgTable("monthly_revenue", {
	id: serial().primaryKey().notNull(),
	month: varchar({ length: 7 }).notNull(),
	totalAmount: numeric("total_amount", { precision: 15, scale:  2 }).notNull(),
	adRevenue: numeric("ad_revenue", { precision: 15, scale:  2 }).default('0'),
	subscriptionRevenue: numeric("subscription_revenue", { precision: 15, scale:  2 }).default('0'),
	courseRevenue: numeric("course_revenue", { precision: 15, scale:  2 }).default('0'),
	consultationRevenue: numeric("consultation_revenue", { precision: 15, scale:  2 }).default('0'),
	otherRevenue: numeric("other_revenue", { precision: 15, scale:  2 }).default('0'),
	stage: varchar({ length: 20 }).default('stage1').notNull(),
	platformShare: numeric("platform_share", { precision: 5, scale:  2 }).notNull(),
	trainerShare: numeric("trainer_share", { precision: 5, scale:  2 }).notNull(),
	isSettled: boolean("is_settled").default(false),
	settledAt: timestamp("settled_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const payouts = pgTable("payouts", {
	id: serial().primaryKey().notNull(),
	revenueId: integer("revenue_id"),
	userId: integer("user_id").notNull(),
	month: varchar({ length: 7 }).notNull(),
	grossAmount: numeric("gross_amount", { precision: 12, scale:  2 }).notNull(),
	platformFee: numeric("platform_fee", { precision: 12, scale:  2 }).notNull(),
	netAmount: numeric("net_amount", { precision: 12, scale:  2 }).notNull(),
	contributionScore: numeric("contribution_score", { precision: 10, scale:  2 }).notNull(),
	contributionRatio: numeric("contribution_ratio", { precision: 5, scale:  4 }).notNull(),
	status: varchar({ length: 20 }).default('pending'),
	paidAt: timestamp("paid_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.revenueId],
			foreignColumns: [monthlyRevenue.id],
			name: "payouts_revenue_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "payouts_user_id_fkey"
		}),
]);

export const pointRules = pgTable("point_rules", {
	id: serial().primaryKey().notNull(),
	ruleName: varchar("rule_name", { length: 100 }).notNull(),
	ruleType: varchar("rule_type", { length: 50 }).notNull(),
	points: integer().notNull(),
	description: text(),
	conditions: jsonb(),
	isActive: boolean("is_active").default(true),
	validFrom: timestamp("valid_from", { mode: 'string' }),
	validTo: timestamp("valid_to", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const pointTransactions = pgTable("point_transactions", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	ruleId: integer("rule_id"),
	referenceId: integer("reference_id"),
	transactionType: varchar("transaction_type", { length: 50 }).notNull(),
	points: numeric({ precision: 10, scale:  2 }).notNull(),
	description: text(),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.ruleId],
			foreignColumns: [pointRules.id],
			name: "point_transactions_rule_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "point_transactions_user_id_fkey"
		}),
]);

export const productCommissions = pgTable("product_commissions", {
	id: serial().primaryKey().notNull(),
	productId: integer("product_id").notNull(),
	commissionRate: numeric("commission_rate", { precision: 5, scale:  2 }).default('0').notNull(),
	effectiveFrom: timestamp("effective_from", { mode: 'string' }).defaultNow(),
	effectiveTo: timestamp("effective_to", { mode: 'string' }),
	channelType: varchar("channel_type", { length: 50 }).default('all'),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "product_commissions_product_id_fkey"
		}),
]);

export const pushCampaigns = pgTable("push_campaigns", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 200 }).notNull(),
	message: text().notNull(),
	status: varchar({ length: 20 }).default('draft'),
	targetType: varchar("target_type", { length: 30 }).notNull(),
	targetCriteria: jsonb("target_criteria"),
	scheduledAt: timestamp("scheduled_at", { mode: 'string' }),
	sentAt: timestamp("sent_at", { mode: 'string' }),
	totalRecipients: integer("total_recipients").default(0),
	successCount: integer("success_count").default(0),
	failureCount: integer("failure_count").default(0),
	data: jsonb(),
	createdBy: integer("created_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "push_campaigns_created_by_fkey"
		}),
]);

export const pushNotificationLogs = pgTable("push_notification_logs", {
	id: serial().primaryKey().notNull(),
	campaignId: integer("campaign_id"),
	userId: integer("user_id"),
	tokenId: integer("token_id"),
	title: varchar({ length: 200 }).notNull(),
	message: text().notNull(),
	status: varchar({ length: 20 }).notNull(),
	messageId: text("message_id"),
	errorCode: varchar("error_code", { length: 50 }),
	errorMessage: text("error_message"),
	sentAt: timestamp("sent_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.campaignId],
			foreignColumns: [pushCampaigns.id],
			name: "push_notification_logs_campaign_id_fkey"
		}),
	foreignKey({
			columns: [table.tokenId],
			foreignColumns: [fcmTokens.id],
			name: "push_notification_logs_token_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "push_notification_logs_user_id_fkey"
		}),
]);

export const referralProfiles = pgTable("referral_profiles", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	referralCode: varchar("referral_code", { length: 50 }).notNull(),
	profileType: varchar("profile_type", { length: 50 }).notNull(),
	defaultCommissionRate: numeric("default_commission_rate", { precision: 5, scale:  2 }).default('10').notNull(),
	lifetimeEarnings: numeric("lifetime_earnings", { precision: 12, scale:  2 }).default('0').notNull(),
	status: varchar({ length: 20 }).default('active').notNull(),
	bankAccount: jsonb("bank_account"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "referral_profiles_user_id_fkey"
		}),
	unique("referral_profiles_user_id_key").on(table.userId),
	unique("referral_profiles_referral_code_key").on(table.referralCode),
]);

export const referralEarnings = pgTable("referral_earnings", {
	id: serial().primaryKey().notNull(),
	referralProfileId: integer("referral_profile_id").notNull(),
	sourceType: varchar("source_type", { length: 50 }).notNull(),
	sourceId: integer("source_id").notNull(),
	sourceName: varchar("source_name", { length: 200 }),
	grossAmount: numeric("gross_amount", { precision: 10, scale:  2 }).notNull(),
	commissionAmount: numeric("commission_amount", { precision: 10, scale:  2 }).notNull(),
	commissionRate: numeric("commission_rate", { precision: 5, scale:  2 }).notNull(),
	currency: varchar({ length: 10 }).default('KRW'),
	status: varchar({ length: 20 }).default('pending').notNull(),
	settlementId: integer("settlement_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.referralProfileId],
			foreignColumns: [referralProfiles.id],
			name: "referral_earnings_referral_profile_id_fkey"
		}),
	foreignKey({
			columns: [table.settlementId],
			foreignColumns: [settlements.id],
			name: "referral_earnings_settlement_id_fkey"
		}),
]);

export const settlements = pgTable("settlements", {
	id: serial().primaryKey().notNull(),
	settlementType: varchar("settlement_type", { length: 50 }).notNull(),
	targetId: integer("target_id").notNull(),
	targetName: varchar("target_name", { length: 200 }).notNull(),
	periodStart: timestamp("period_start", { mode: 'string' }).notNull(),
	periodEnd: timestamp("period_end", { mode: 'string' }).notNull(),
	totalGrossAmount: numeric("total_gross_amount", { precision: 12, scale:  2 }).notNull(),
	totalFeeAmount: numeric("total_fee_amount", { precision: 12, scale:  2 }).notNull(),
	totalNetAmount: numeric("total_net_amount", { precision: 12, scale:  2 }).notNull(),
	transactionCount: integer("transaction_count").notNull(),
	status: varchar({ length: 20 }).default('pending'),
	bankAccount: jsonb("bank_account"),
	settlementDetails: jsonb("settlement_details"),
	approvedBy: integer("approved_by"),
	processedAt: timestamp("processed_at", { mode: 'string' }),
	paidAt: timestamp("paid_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	referralProfileId: integer("referral_profile_id"),
}, (table) => [
	foreignKey({
			columns: [table.referralProfileId],
			foreignColumns: [referralProfiles.id],
			name: "settlements_referral_profile_id_fkey"
		}),
]);

export const reservations = pgTable("reservations", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	trainerId: integer("trainer_id"),
	instituteId: integer("institute_id"),
	petId: integer("pet_id"),
	reservationType: varchar("reservation_type", { length: 50 }).notNull(),
	date: timestamp({ mode: 'string' }).notNull(),
	durationMinutes: integer("duration_minutes"),
	status: varchar({ length: 20 }).default('pending'),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.instituteId],
			foreignColumns: [institutes.id],
			name: "reservations_institute_id_fkey"
		}),
	foreignKey({
			columns: [table.petId],
			foreignColumns: [pets.id],
			name: "reservations_pet_id_fkey"
		}),
	foreignKey({
			columns: [table.trainerId],
			foreignColumns: [users.id],
			name: "reservations_trainer_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "reservations_user_id_fkey"
		}),
]);

export const scheduledPushNotifications = pgTable("scheduled_push_notifications", {
	id: serial().primaryKey().notNull(),
	campaignId: integer("campaign_id"),
	userId: integer("user_id").notNull(),
	title: varchar({ length: 200 }).notNull(),
	message: text().notNull(),
	data: jsonb(),
	scheduledAt: timestamp("scheduled_at", { mode: 'string' }).notNull(),
	status: varchar({ length: 20 }).default('pending'),
	sentAt: timestamp("sent_at", { mode: 'string' }),
	errorMessage: text("error_message"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.campaignId],
			foreignColumns: [pushCampaigns.id],
			name: "scheduled_push_notifications_campaign_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "scheduled_push_notifications_user_id_fkey"
		}),
]);

export const settlementItems = pgTable("settlement_items", {
	id: serial().primaryKey().notNull(),
	settlementId: integer("settlement_id").notNull(),
	transactionId: integer("transaction_id").notNull(),
	itemName: varchar("item_name", { length: 200 }).notNull(),
	itemType: varchar("item_type", { length: 50 }).notNull(),
	quantity: integer().default(1).notNull(),
	unitPrice: numeric("unit_price", { precision: 10, scale:  2 }).notNull(),
	grossAmount: numeric("gross_amount", { precision: 10, scale:  2 }).notNull(),
	feeAmount: numeric("fee_amount", { precision: 10, scale:  2 }).notNull(),
	netAmount: numeric("net_amount", { precision: 10, scale:  2 }).notNull(),
	feeRate: numeric("fee_rate", { precision: 5, scale:  2 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.settlementId],
			foreignColumns: [settlements.id],
			name: "settlement_items_settlement_id_fkey"
		}),
	foreignKey({
			columns: [table.transactionId],
			foreignColumns: [transactions.id],
			name: "settlement_items_transaction_id_fkey"
		}),
]);

export const transactions = pgTable("transactions", {
	id: serial().primaryKey().notNull(),
	transactionType: varchar("transaction_type", { length: 50 }).notNull(),
	referenceId: integer("reference_id").notNull(),
	referenceType: varchar("reference_type", { length: 50 }).notNull(),
	payerId: integer("payer_id").notNull(),
	payeeId: integer("payee_id").notNull(),
	grossAmount: numeric("gross_amount", { precision: 10, scale:  2 }).notNull(),
	feeAmount: numeric("fee_amount", { precision: 10, scale:  2 }).notNull(),
	netAmount: numeric("net_amount", { precision: 10, scale:  2 }).notNull(),
	currency: varchar({ length: 3 }).default('KRW'),
	paymentMethod: varchar("payment_method", { length: 50 }),
	paymentProvider: varchar("payment_provider", { length: 50 }),
	externalTransactionId: varchar("external_transaction_id", { length: 100 }),
	status: varchar({ length: 20 }).default('pending'),
	feePolicyId: integer("fee_policy_id"),
	instituteId: integer("institute_id"),
	metadata: jsonb(),
	processedAt: timestamp("processed_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.feePolicyId],
			foreignColumns: [feePolicies.id],
			name: "transactions_fee_policy_id_fkey"
		}),
]);

export const shoppingCarts = pgTable("shopping_carts", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	productId: integer("product_id").notNull(),
	quantity: integer().default(1).notNull(),
	price: numeric({ precision: 10, scale:  2 }),
	addedAt: timestamp("added_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "shopping_carts_product_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "shopping_carts_user_id_fkey"
		}),
]);

export const streamChatMessages = pgTable("stream_chat_messages", {
	id: serial().primaryKey().notNull(),
	streamId: integer("stream_id").notNull(),
	userId: integer("user_id").notNull(),
	message: text().notNull(),
	isHighlighted: boolean("is_highlighted").default(false),
	isPinned: boolean("is_pinned").default(false),
	isDeleted: boolean("is_deleted").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.streamId],
			foreignColumns: [liveStreams.id],
			name: "stream_chat_messages_stream_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "stream_chat_messages_user_id_fkey"
		}),
]);

export const streamViewers = pgTable("stream_viewers", {
	id: serial().primaryKey().notNull(),
	streamId: integer("stream_id").notNull(),
	userId: integer("user_id"),
	sessionId: varchar("session_id", { length: 100 }).notNull(),
	joinedAt: timestamp("joined_at", { mode: 'string' }).defaultNow(),
	leftAt: timestamp("left_at", { mode: 'string' }),
	watchTime: integer("watch_time").default(0),
	isActive: boolean("is_active").default(true),
}, (table) => [
	foreignKey({
			columns: [table.streamId],
			foreignColumns: [liveStreams.id],
			name: "stream_viewers_stream_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "stream_viewers_user_id_fkey"
		}),
]);

export const talezScoreCache = pgTable("talez_score_cache", {
	userId: integer("user_id").primaryKey().notNull(),
	ownerScore: numeric("owner_score", { precision: 10, scale:  2 }).default('0'),
	trainerScore: numeric("trainer_score", { precision: 10, scale:  2 }).default('0'),
	totalWatchSeconds: numeric("total_watch_seconds", { precision: 12, scale:  2 }).default('0'),
	totalViews: integer("total_views").default(0),
	totalLikes: integer("total_likes").default(0),
	totalComments: integer("total_comments").default(0),
	followerCount: integer("follower_count").default(0),
	violationCount: integer("violation_count").default(0),
	monetizationLevel: integer("monetization_level").default(0),
	monetizationEnabled: boolean("monetization_enabled").default(false),
	lastCalculatedAt: timestamp("last_calculated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "talez_score_cache_user_id_fkey"
		}),
]);

export const trainerActivityLogs = pgTable("trainer_activity_logs", {
	id: serial().primaryKey().notNull(),
	trainerId: integer("trainer_id").notNull(),
	activityType: varchar("activity_type", { length: 50 }).notNull(),
	activityDate: timestamp("activity_date", { mode: 'string' }).notNull(),
	pointsEarned: numeric("points_earned", { precision: 10, scale:  2 }).default('0'),
	description: text(),
	metadata: jsonb(),
	status: varchar({ length: 20 }).default('pending'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.trainerId],
			foreignColumns: [users.id],
			name: "trainer_activity_logs_trainer_id_fkey"
		}),
]);

export const trainerApplications = pgTable("trainer_applications", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }).notNull(),
	hasAffiliation: boolean("has_affiliation").default(false),
	affiliationName: varchar("affiliation_name", { length: 200 }),
	experience: text(),
	education: text(),
	certifications: text(),
	motivation: text(),
	portfolioUrl: text("portfolio_url"),
	resume: text(),
	status: varchar({ length: 20 }).default('pending'),
	submittedAt: timestamp("submitted_at", { mode: 'string' }).defaultNow(),
	reviewedAt: timestamp("reviewed_at", { mode: 'string' }),
	reviewedBy: integer("reviewed_by"),
	reviewNotes: text("review_notes"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.reviewedBy],
			foreignColumns: [users.id],
			name: "trainer_applications_reviewed_by_fkey"
		}),
]);

export const trainerClientAssignments = pgTable("trainer_client_assignments", {
	id: serial().primaryKey().notNull(),
	trainerId: integer("trainer_id").notNull(),
	clientId: integer("client_id").notNull(),
	status: varchar({ length: 50 }).default('active'),
	serviceType: varchar("service_type", { length: 100 }),
	notes: text(),
	assignedBy: integer("assigned_by"),
	assignedAt: timestamp("assigned_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	startedAt: timestamp("started_at", { mode: 'string' }),
	endedAt: timestamp("ended_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.assignedBy],
			foreignColumns: [users.id],
			name: "trainer_client_assignments_assigned_by_fkey"
		}),
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [users.id],
			name: "trainer_client_assignments_client_id_fkey"
		}),
	foreignKey({
			columns: [table.trainerId],
			foreignColumns: [users.id],
			name: "trainer_client_assignments_trainer_id_fkey"
		}),
]);

export const trainerInstituteApplications = pgTable("trainer_institute_applications", {
	id: serial().primaryKey().notNull(),
	trainerId: integer("trainer_id").notNull(),
	instituteId: integer("institute_id").notNull(),
	status: varchar({ length: 50 }).default('pending'),
	message: text(),
	appliedAt: timestamp("applied_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	reviewedAt: timestamp("reviewed_at", { mode: 'string' }),
	reviewedBy: integer("reviewed_by"),
	rejectionReason: text("rejection_reason"),
}, (table) => [
	foreignKey({
			columns: [table.instituteId],
			foreignColumns: [institutes.id],
			name: "trainer_institute_applications_institute_id_fkey"
		}),
	foreignKey({
			columns: [table.reviewedBy],
			foreignColumns: [users.id],
			name: "trainer_institute_applications_reviewed_by_fkey"
		}),
	foreignKey({
			columns: [table.trainerId],
			foreignColumns: [users.id],
			name: "trainer_institute_applications_trainer_id_fkey"
		}),
]);

export const trainers = pgTable("trainers", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	name: varchar({ length: 100 }),
	email: varchar({ length: 255 }),
	phone: varchar({ length: 20 }),
	bio: text(),
	specialty: text(),
	specialties: jsonb(),
	experience: integer(),
	certification: text(),
	certifications: jsonb(),
	price: numeric({ precision: 10, scale:  2 }),
	location: text(),
	address: text(),
	profileImage: text("profile_image"),
	avatar: text(),
	background: text(),
	rating: numeric({ precision: 3, scale:  2 }).default('0'),
	reviewCount: integer("review_count").default(0),
	reviews: integer().default(0),
	coursesCount: integer("courses_count").default(0),
	studentsCount: integer("students_count").default(0),
	featured: boolean().default(false),
	verified: boolean().default(false),
	isActive: boolean("is_active").default(true),
	status: varchar({ length: 50 }).default('active'),
	institute: text(),
	instituteId: integer("institute_id"),
	category: varchar({ length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.instituteId],
			foreignColumns: [institutes.id],
			name: "trainers_institute_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "trainers_user_id_fkey"
		}),
]);

export const trainingJournals = pgTable("training_journals", {
	id: serial().primaryKey().notNull(),
	trainerId: integer("trainer_id").notNull(),
	petOwnerId: integer("pet_owner_id").notNull(),
	petId: integer("pet_id").notNull(),
	title: varchar({ length: 200 }).notNull(),
	content: text().notNull(),
	trainingDate: timestamp("training_date", { mode: 'string' }).notNull(),
	trainingDuration: integer("training_duration"),
	trainingType: varchar("training_type", { length: 100 }),
	progressRating: integer("progress_rating"),
	behaviorNotes: text("behavior_notes"),
	homeworkInstructions: text("homework_instructions"),
	nextGoals: text("next_goals"),
	attachments: text().array(),
	isRead: boolean("is_read").default(false),
	readAt: timestamp("read_at", { mode: 'string' }),
	status: varchar({ length: 20 }).default('sent'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.petId],
			foreignColumns: [pets.id],
			name: "training_journals_pet_id_fkey"
		}),
	foreignKey({
			columns: [table.petOwnerId],
			foreignColumns: [users.id],
			name: "training_journals_pet_owner_id_fkey"
		}),
	foreignKey({
			columns: [table.trainerId],
			foreignColumns: [users.id],
			name: "training_journals_trainer_id_fkey"
		}),
]);

export const feePolicies = pgTable("fee_policies", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	feeType: varchar("fee_type", { length: 50 }).notNull(),
	baseRate: numeric("base_rate", { precision: 5, scale:  2 }).notNull(),
	minAmount: numeric("min_amount", { precision: 10, scale:  2 }),
	maxAmount: numeric("max_amount", { precision: 10, scale:  2 }),
	tierConfig: jsonb("tier_config"),
	targetType: varchar("target_type", { length: 50 }).notNull(),
	targetId: integer("target_id"),
	isActive: boolean("is_active").default(true),
	validFrom: timestamp("valid_from", { mode: 'string' }).defaultNow(),
	validTo: timestamp("valid_to", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const consultationRecords = pgTable("consultation_records", {
	id: serial().primaryKey().notNull(),
	petId: integer("pet_id").notNull(),
	ownerId: integer("owner_id").notNull(),
	trainerId: integer("trainer_id").notNull(),
	instituteId: integer("institute_id"),
	visitPurpose: text("visit_purpose").notNull(),
	mainProblemBehavior: text("main_problem_behavior").notNull(),
	behaviorTiming: text("behavior_timing"),
	behaviorTarget: text("behavior_target"),
	recentChanges: text("recent_changes"),
	walkDuration: varchar("walk_duration", { length: 100 }),
	mealPattern: text("meal_pattern"),
	ownerReactionStyle: text("owner_reaction_style"),
	previousTrainingExperience: text("previous_training_experience"),
	desiredGoal: text("desired_goal"),
	temperamentLevel: varchar("temperament_level", { length: 1 }),
	additionalNotes: text("additional_notes"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.instituteId],
			foreignColumns: [institutes.id],
			name: "consultation_records_institute_id_fkey"
		}),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [users.id],
			name: "consultation_records_owner_id_fkey"
		}),
	foreignKey({
			columns: [table.petId],
			foreignColumns: [pets.id],
			name: "consultation_records_pet_id_fkey"
		}),
	foreignKey({
			columns: [table.trainerId],
			foreignColumns: [users.id],
			name: "consultation_records_trainer_id_fkey"
		}),
]);

export const pets = pgTable("pets", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	breed: text().notNull(),
	age: integer().notNull(),
	weight: integer(),
	gender: text(),
	description: text(),
	avatar: text(),
	ownerId: integer("owner_id").notNull(),
	health: text(),
	temperament: text(),
	allergies: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	temperamentLevel: varchar("temperament_level", { length: 1 }),
});
