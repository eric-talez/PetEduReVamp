CREATE TABLE "ai_analyses" (
	"id" serial PRIMARY KEY NOT NULL,
	"pet_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"input_log_ids" jsonb NOT NULL,
	"selected_signals" jsonb NOT NULL,
	"time_range" text,
	"model" varchar(50) DEFAULT 'gpt-4o-mini',
	"result_json" jsonb NOT NULL,
	"tokens_in" integer,
	"tokens_out" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_daily_summary" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" varchar(10) NOT NULL,
	"user_id" integer,
	"provider" varchar(50) NOT NULL,
	"total_requests" integer DEFAULT 0,
	"total_tokens" integer DEFAULT 0,
	"total_cost" numeric(10, 2) DEFAULT '0',
	"avg_response_time" integer,
	"error_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_usage_limits" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"user_role" varchar(50) NOT NULL,
	"daily_request_limit" integer DEFAULT 50,
	"daily_cost_limit" numeric(10, 2) DEFAULT '5.00',
	"monthly_request_limit" integer DEFAULT 1000,
	"monthly_cost_limit" numeric(10, 2) DEFAULT '100.00',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_usage_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"provider" varchar(50) NOT NULL,
	"model" varchar(100) NOT NULL,
	"request_type" varchar(50) NOT NULL,
	"input_tokens" integer DEFAULT 0,
	"output_tokens" integer DEFAULT 0,
	"total_tokens" integer DEFAULT 0,
	"cost" numeric(10, 6) DEFAULT '0',
	"request_data" jsonb,
	"response_status" varchar(20) DEFAULT 'success',
	"response_time" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "auto_inventory_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"trigger_type" varchar(50) NOT NULL,
	"triggered_by" varchar(100),
	"requested_quantity" integer NOT NULL,
	"estimated_cost" numeric(10, 2),
	"status" varchar(50) DEFAULT 'pending',
	"order_date" timestamp,
	"expected_delivery" timestamp,
	"actual_delivery" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "banners" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text,
	"image_url" text,
	"action_text" varchar(100),
	"action_url" text,
	"link_url" text,
	"position" varchar(50) DEFAULT 'hero',
	"type" varchar(50) DEFAULT 'main',
	"target_position" varchar(50) DEFAULT 'home-hero',
	"display_order" integer DEFAULT 0,
	"priority" integer DEFAULT 5,
	"target_user_group" varchar(50) DEFAULT 'all',
	"start_date" timestamp,
	"end_date" timestamp,
	"click_count" integer DEFAULT 0,
	"view_count" integer DEFAULT 0,
	"impression_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "care_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"pet_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"date" date NOT NULL,
	"note" text,
	"poop_status" varchar(20),
	"meal_status" varchar(20),
	"walk_status" varchar(20),
	"mood" varchar(20),
	"energy_level" integer,
	"media" jsonb,
	"tags" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"product_id" integer,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "checkups" (
	"id" serial PRIMARY KEY NOT NULL,
	"pet_id" integer,
	"date" timestamp NOT NULL,
	"weight" numeric(5, 2),
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"post_id" integer,
	"user_id" integer,
	"parent_id" integer,
	"likes" integer DEFAULT 0,
	"is_edited" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "commission_policies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"rate" numeric(5, 2) NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "commission_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"type" varchar(50) NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_approvals" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_type" varchar(50) NOT NULL,
	"content_id" integer NOT NULL,
	"submitter_id" integer NOT NULL,
	"institute_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"content" jsonb,
	"attachments" text[],
	"trainer_status" varchar(20) DEFAULT 'submitted',
	"institute_status" varchar(20) DEFAULT 'pending',
	"admin_status" varchar(20) DEFAULT 'pending',
	"institute_reviewer_id" integer,
	"admin_reviewer_id" integer,
	"institute_comment" text,
	"admin_comment" text,
	"institute_reviewed_at" timestamp,
	"admin_reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"participant1_id" integer NOT NULL,
	"participant2_id" integer NOT NULL,
	"last_message_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "course_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"current_lesson" integer DEFAULT 1,
	"completed_lessons" integer DEFAULT 0,
	"total_lessons" integer NOT NULL,
	"progress_percentage" numeric(5, 2) DEFAULT '0',
	"time_spent" integer DEFAULT 0,
	"average_score" numeric(5, 2) DEFAULT '0',
	"last_accessed_at" timestamp,
	"completed_at" timestamp,
	"status" varchar(50) DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "course_purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"purchase_amount" numeric(10, 2) NOT NULL,
	"payment_method" varchar(50),
	"payment_status" varchar(50) DEFAULT 'completed',
	"access_granted" boolean DEFAULT true,
	"expiry_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"content" text,
	"price" numeric(10, 2),
	"duration" integer,
	"level" varchar(50),
	"category" varchar(100),
	"instructor_id" integer,
	"institute_id" integer NOT NULL,
	"image_url" text,
	"video_url" text,
	"is_active" boolean DEFAULT true,
	"rating" numeric(3, 2),
	"enrollment_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "curriculum_product_mappings" (
	"id" serial PRIMARY KEY NOT NULL,
	"curriculum_id" varchar(100) NOT NULL,
	"module_id" varchar(100),
	"product_id" integer NOT NULL,
	"material_name" varchar(200) NOT NULL,
	"quantity" integer DEFAULT 1,
	"is_required" boolean DEFAULT true,
	"is_optional" boolean DEFAULT false,
	"suggested_alternatives" jsonb,
	"usage_description" text,
	"estimated_usage" integer,
	"auto_order" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "curriculums" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"creator_id" integer NOT NULL,
	"institute_id" integer,
	"target_level" varchar(50),
	"duration" integer,
	"sessions" jsonb,
	"prerequisites" text[],
	"learning_objectives" text[],
	"materials" text[],
	"assessment_methods" text[],
	"is_public" boolean DEFAULT false,
	"status" varchar(20) DEFAULT 'draft',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "event_attendances" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"user_id" integer,
	"attended_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "event_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"address" text NOT NULL,
	"capacity" integer,
	"latitude" text,
	"longitude" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"date" timestamp NOT NULL,
	"location" text,
	"category" varchar(100),
	"organizer_id" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fcm_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" text NOT NULL,
	"device_type" varchar(20),
	"device_info" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "fcm_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "fee_policies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"fee_type" varchar(50) NOT NULL,
	"base_rate" numeric(5, 2) NOT NULL,
	"min_amount" numeric(10, 2),
	"max_amount" numeric(10, 2),
	"tier_config" jsonb,
	"target_type" varchar(50) NOT NULL,
	"target_id" integer,
	"is_active" boolean DEFAULT true,
	"valid_from" timestamp DEFAULT now(),
	"valid_to" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"filename" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" integer NOT NULL,
	"path" text,
	"is_public" boolean DEFAULT false,
	"uploaded_by" integer,
	"related_entity" text,
	"related_entity_id" integer,
	"uploaded_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "forums" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text,
	"popularity" integer DEFAULT 0,
	"weekday" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "incentive_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"trainer_id" integer NOT NULL,
	"activity_log_id" integer,
	"payment_type" varchar(50) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'KRW',
	"status" varchar(30) DEFAULT 'pending',
	"payment_date" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "institute_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"institute_name" varchar(200) NOT NULL,
	"representative_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"business_number" varchar(50),
	"address" text NOT NULL,
	"website" text,
	"description" text,
	"certification_documents" text,
	"facilities" text,
	"trainer_count" integer DEFAULT 0,
	"capacity" integer DEFAULT 0,
	"programs" text,
	"status" varchar(20) DEFAULT 'pending',
	"submitted_at" timestamp DEFAULT now(),
	"reviewed_at" timestamp,
	"reviewed_by" integer,
	"review_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "institute_closure" (
	"id" serial PRIMARY KEY NOT NULL,
	"institute_id" integer NOT NULL,
	"manager_id" integer NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"reason" varchar(100) NOT NULL,
	"description" text,
	"notification_sent" boolean DEFAULT false,
	"customer_notice" text,
	"alternative_options" text,
	"status" varchar(20) DEFAULT 'planned',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "institute_product_recommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"institute_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"recommendation_type" varchar(50) NOT NULL,
	"priority" integer DEFAULT 5,
	"custom_message" text,
	"discount_rate" numeric(5, 2) DEFAULT '0',
	"is_active" boolean DEFAULT true,
	"start_date" timestamp,
	"end_date" timestamp,
	"click_count" integer DEFAULT 0,
	"purchase_count" integer DEFAULT 0,
	"revenue" numeric(12, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "institutes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"address" text,
	"phone" text,
	"email" text,
	"website" text,
	"logo" text,
	"business_number" text,
	"capacity" integer,
	"code" text,
	"latitude" text,
	"longitude" text,
	"rating" numeric(3, 2),
	"certification" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"features_enabled" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "journal_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"journal_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"content" text NOT NULL,
	"attachments" text[],
	"parent_comment_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "journal_service_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"journal_id" integer NOT NULL,
	"requester_id" integer NOT NULL,
	"service_type" varchar(50) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"preferred_date" timestamp,
	"urgency" varchar(20) DEFAULT 'normal',
	"status" varchar(20) DEFAULT 'pending',
	"response_message" text,
	"responded_by" integer,
	"responded_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lesson_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"lesson_number" integer NOT NULL,
	"session_start" timestamp NOT NULL,
	"session_end" timestamp,
	"watch_time" integer DEFAULT 0,
	"completion_percentage" numeric(5, 2) DEFAULT '0',
	"quiz_score" numeric(5, 2),
	"notes" text,
	"is_completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "live_streams" (
	"id" serial PRIMARY KEY NOT NULL,
	"host_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"category" varchar(50) DEFAULT 'general',
	"stream_key" varchar(100) NOT NULL,
	"meeting_url" text,
	"meeting_code" varchar(50),
	"thumbnail_url" text,
	"status" varchar(20) DEFAULT 'scheduled' NOT NULL,
	"is_public" boolean DEFAULT true,
	"max_viewers" integer DEFAULT 100,
	"current_viewers" integer DEFAULT 0,
	"peak_viewers" integer DEFAULT 0,
	"total_views" integer DEFAULT 0,
	"scheduled_start_time" timestamp,
	"actual_start_time" timestamp,
	"end_time" timestamp,
	"duration" integer DEFAULT 0,
	"recording_url" text,
	"chat_enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "live_streams_stream_key_unique" UNIQUE("stream_key")
);
--> statement-breakpoint
CREATE TABLE "logo_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"type" varchar(50) NOT NULL,
	"file_url" text NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_size" integer,
	"mime_type" varchar(100),
	"is_active" boolean DEFAULT true,
	"uploaded_by_id" integer,
	"theme_variant" varchar(20) DEFAULT 'light',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "logo_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"logo_url" text NOT NULL,
	"logo_position" varchar(20) DEFAULT 'left' NOT NULL,
	"logo_size" varchar(20) DEFAULT 'medium' NOT NULL,
	"alt_text" varchar(200) DEFAULT '로고' NOT NULL,
	"link_url" text DEFAULT '/',
	"max_width" integer DEFAULT 200,
	"max_height" integer DEFAULT 80,
	"show_on_mobile" boolean DEFAULT true,
	"show_on_desktop" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "matching_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"trainer_id" integer,
	"trainer_name" text,
	"pet_id" integer,
	"pet_name" text,
	"pet_owner_id" integer,
	"pet_owner_name" text,
	"status" text DEFAULT 'pending',
	"response" text,
	"processed_at" timestamp,
	"processed_by" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" integer NOT NULL,
	"receiver_id" integer NOT NULL,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"conversation_id" integer,
	"recipient_id" integer,
	"message_type" text DEFAULT 'text',
	"attachments" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "monthly_point_summary" (
	"id" serial PRIMARY KEY NOT NULL,
	"trainer_id" integer NOT NULL,
	"month" varchar(7) NOT NULL,
	"total_points" integer DEFAULT 0,
	"video_upload_points" integer DEFAULT 0,
	"comment_points" integer DEFAULT 0,
	"view_points" integer DEFAULT 0,
	"recruitment_points" integer DEFAULT 0,
	"certification_points" integer DEFAULT 0,
	"consultation_points" integer DEFAULT 0,
	"course_creation_points" integer DEFAULT 0,
	"last_calculated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"is_read" boolean DEFAULT false,
	"action_url" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"product_id" integer,
	"quantity" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"order_number" varchar(50) NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"total_amount" numeric(12, 2) NOT NULL,
	"shipping_amount" numeric(10, 2) DEFAULT '0',
	"tax_amount" numeric(10, 2) DEFAULT '0',
	"discount_amount" numeric(10, 2) DEFAULT '0',
	"payment_method" varchar(50),
	"payment_status" varchar(50) DEFAULT 'pending',
	"shipping_address" jsonb,
	"billing_address" jsonb,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "pet_facilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"type" varchar(50) NOT NULL,
	"latitude" text NOT NULL,
	"longitude" text NOT NULL,
	"address" text NOT NULL,
	"city" varchar(100),
	"district" varchar(100),
	"phone" varchar(20),
	"rating" numeric(3, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pet_media_analyses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"pet_id" integer NOT NULL,
	"media_asset_id" integer NOT NULL,
	"model" varchar(50) DEFAULT 'gpt-4o' NOT NULL,
	"memo" text,
	"result_json" jsonb NOT NULL,
	"tokens_in" integer,
	"tokens_out" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pet_media_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"pet_id" integer NOT NULL,
	"file_url" text NOT NULL,
	"file_type" varchar(20) NOT NULL,
	"file_size" integer,
	"width" integer,
	"height" integer,
	"duration" integer,
	"thumbnail_url" text,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"species" varchar(50) NOT NULL,
	"breed" varchar(100),
	"age" integer,
	"gender" varchar(10),
	"weight" numeric(5, 2),
	"color" varchar(100),
	"personality" text,
	"medical_history" text,
	"special_notes" text,
	"owner_id" integer,
	"profile_image" text,
	"image_url" text,
	"notes" text,
	"training_status" varchar(50) DEFAULT 'not_assigned',
	"assigned_trainer_id" integer,
	"assigned_trainer_name" varchar(100),
	"training_type" varchar(50),
	"notebook_enabled" boolean DEFAULT false,
	"training_start_date" timestamp,
	"last_notebook_entry" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "point_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"activity_type" varchar(50) NOT NULL,
	"activity_name" varchar(100) NOT NULL,
	"points_per_action" integer NOT NULL,
	"max_daily_points" integer,
	"max_monthly_points" integer,
	"is_active" boolean DEFAULT true,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "point_rules_activity_type_unique" UNIQUE("activity_type")
);
--> statement-breakpoint
CREATE TABLE "point_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"trainer_id" integer NOT NULL,
	"activity_log_id" integer,
	"point_rule_id" integer,
	"transaction_type" varchar(20) NOT NULL,
	"points" integer NOT NULL,
	"description" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"author_id" integer,
	"category" text,
	"tag" text,
	"image" text,
	"views" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"comments" integer DEFAULT 0,
	"location_name" varchar(200),
	"location_address" text,
	"location_latitude" text,
	"location_longitude" text,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_commissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"commission_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"effective_from" timestamp DEFAULT now(),
	"effective_to" timestamp,
	"channel_type" varchar(50) DEFAULT 'all',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_exposures" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"exposure_type" varchar(50) NOT NULL,
	"position" integer DEFAULT 0,
	"priority" integer DEFAULT 5,
	"is_active" boolean DEFAULT true,
	"start_date" timestamp,
	"end_date" timestamp,
	"target_audience" varchar(100),
	"click_count" integer DEFAULT 0,
	"impression_count" integer DEFAULT 0,
	"conversion_rate" numeric(5, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"discount_price" integer,
	"category_id" integer,
	"images" jsonb,
	"tags" jsonb,
	"stock" integer DEFAULT 0,
	"low_stock_threshold" integer DEFAULT 10,
	"auto_reorder_enabled" boolean DEFAULT false,
	"auto_reorder_quantity" integer DEFAULT 50,
	"supplier_id" integer,
	"is_active" boolean DEFAULT true,
	"rating" integer DEFAULT 0,
	"review_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "progress_sharing" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"trainer_id" integer,
	"institute_id" integer,
	"shared_at" timestamp DEFAULT now(),
	"share_type" varchar(50) NOT NULL,
	"permissions" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"budget" numeric(10, 2),
	"deadline" timestamp,
	"status" varchar(50) DEFAULT 'active',
	"client_id" integer,
	"freelancer_id" integer,
	"category" text,
	"views" integer DEFAULT 0,
	"expected_start_date" timestamp,
	"location" text,
	"posted_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "proposals" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer,
	"freelancer_id" integer,
	"title" text,
	"content" text,
	"proposed_budget" numeric(10, 2),
	"proposed_timeline" text,
	"status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "referral_earnings" (
	"id" serial PRIMARY KEY NOT NULL,
	"referral_profile_id" integer NOT NULL,
	"source_type" varchar(50) NOT NULL,
	"source_id" integer NOT NULL,
	"source_name" varchar(200),
	"gross_amount" numeric(10, 2) NOT NULL,
	"commission_amount" numeric(10, 2) NOT NULL,
	"commission_rate" numeric(5, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'KRW',
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"settlement_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "referral_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"referral_code" varchar(50) NOT NULL,
	"profile_type" varchar(50) NOT NULL,
	"default_commission_rate" numeric(5, 2) DEFAULT '10' NOT NULL,
	"lifetime_earnings" numeric(12, 2) DEFAULT '0' NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"bank_account" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "referral_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "referral_profiles_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "registration_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"applicant_info" jsonb NOT NULL,
	"status" text DEFAULT 'pending',
	"submitted_at" timestamp DEFAULT now(),
	"processed_at" timestamp,
	"processed_by" integer,
	"rejection_reason" text
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"trainer_id" integer,
	"pet_id" integer,
	"service_type" varchar(100) NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"duration" integer DEFAULT 60,
	"status" varchar(50) DEFAULT 'pending',
	"notes" text,
	"price" numeric(10, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rest_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"trainer_id" integer NOT NULL,
	"institute_id" integer,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"reason" varchar(100) NOT NULL,
	"description" text,
	"substitute_required" boolean DEFAULT false,
	"status" varchar(20) DEFAULT 'pending',
	"approved_by" integer,
	"approved_at" timestamp,
	"rejected_reason" text,
	"substitute_trainer_id" integer,
	"substitute_status" varchar(20) DEFAULT 'none',
	"reward_eligible" boolean DEFAULT false,
	"reward_amount" numeric(10, 2),
	"reward_status" varchar(20) DEFAULT 'none',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rest_rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"rest_application_id" integer NOT NULL,
	"recipient_id" integer NOT NULL,
	"reward_type" varchar(50) NOT NULL,
	"reward_amount" numeric(10, 2) NOT NULL,
	"reward_reason" text,
	"eligibility_checked" boolean DEFAULT false,
	"approved_by" integer,
	"approved_at" timestamp,
	"paid_at" timestamp,
	"status" varchar(20) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"contract_id" integer,
	"reviewer_id" integer,
	"reviewee_id" integer,
	"project_id" integer,
	"receiver_id" integer,
	"title" text,
	"content" text,
	"recommendation" text,
	"status" text DEFAULT 'pending',
	"reviewer_role" text,
	"receiver_role" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "settlement_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"settlement_id" integer NOT NULL,
	"transaction_id" integer NOT NULL,
	"item_name" varchar(200) NOT NULL,
	"item_type" varchar(50) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"gross_amount" numeric(10, 2) NOT NULL,
	"fee_amount" numeric(10, 2) NOT NULL,
	"net_amount" numeric(10, 2) NOT NULL,
	"fee_rate" numeric(5, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "settlement_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"period" varchar(20) NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'draft',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "settlements" (
	"id" serial PRIMARY KEY NOT NULL,
	"settlement_type" varchar(50) NOT NULL,
	"target_id" integer NOT NULL,
	"target_name" varchar(200) NOT NULL,
	"referral_profile_id" integer,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"total_gross_amount" numeric(12, 2) NOT NULL,
	"total_fee_amount" numeric(12, 2) NOT NULL,
	"total_net_amount" numeric(12, 2) NOT NULL,
	"transaction_count" integer NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"bank_account" jsonb,
	"settlement_details" jsonb,
	"approved_by" integer,
	"processed_at" timestamp,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "shop_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "shopping_carts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"product_id" integer,
	"quantity" integer DEFAULT 1,
	"price" numeric(10, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stream_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"stream_id" integer NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"user_id" integer,
	"metadata" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stream_chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"stream_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"message" text NOT NULL,
	"is_highlighted" boolean DEFAULT false,
	"is_pinned" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stream_peers" (
	"id" serial PRIMARY KEY NOT NULL,
	"stream_id" integer NOT NULL,
	"peer_id" varchar(100) NOT NULL,
	"user_id" integer,
	"role" varchar(20) DEFAULT 'viewer' NOT NULL,
	"is_connected" boolean DEFAULT true,
	"connection_quality" varchar(20) DEFAULT 'good',
	"joined_at" timestamp DEFAULT now(),
	"last_seen" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stream_recordings" (
	"id" serial PRIMARY KEY NOT NULL,
	"stream_id" integer NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_url" text,
	"file_size" integer DEFAULT 0,
	"duration" integer DEFAULT 0,
	"format" varchar(20) DEFAULT 'webm',
	"status" varchar(20) DEFAULT 'processing',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stream_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"host_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"category" varchar(50) DEFAULT 'general',
	"scheduled_at" timestamp NOT NULL,
	"reminder_sent" boolean DEFAULT false,
	"stream_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stream_viewers" (
	"id" serial PRIMARY KEY NOT NULL,
	"stream_id" integer NOT NULL,
	"user_id" integer,
	"session_id" varchar(100) NOT NULL,
	"joined_at" timestamp DEFAULT now(),
	"left_at" timestamp,
	"watch_time" integer DEFAULT 0,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"discount_rate" numeric(5, 2) DEFAULT '0',
	"final_price" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'KRW',
	"billing_period" varchar(20) DEFAULT 'monthly',
	"max_members" integer NOT NULL,
	"max_video_hours" integer NOT NULL,
	"max_ai_analysis" integer NOT NULL,
	"features" jsonb NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "subscription_plans_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "substitute_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"substitute_request_id" integer NOT NULL,
	"applicant_trainer_id" integer NOT NULL,
	"availability" jsonb,
	"experience" text,
	"certifications" text[],
	"expected_compensation" numeric(10, 2),
	"message" text,
	"status" varchar(20) DEFAULT 'pending',
	"response_message" text,
	"responded_by" integer,
	"responded_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "substitute_class_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"applicant_id" integer NOT NULL,
	"message" text,
	"proposed_compensation" numeric(10, 2),
	"available_from" timestamp,
	"available_to" timestamp,
	"status" varchar(20) DEFAULT 'pending',
	"application_date" timestamp DEFAULT now(),
	"reviewed_at" timestamp,
	"review_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "substitute_class_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"original_trainer_id" integer NOT NULL,
	"substitute_trainer_id" integer NOT NULL,
	"class_id" integer NOT NULL,
	"agreed_compensation" numeric(10, 2) NOT NULL,
	"class_date" timestamp NOT NULL,
	"class_time" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'assigned',
	"assigned_at" timestamp DEFAULT now(),
	"class_started_at" timestamp,
	"class_completed_at" timestamp,
	"original_trainer_notes" text,
	"substitute_trainer_notes" text,
	"student_feedback" text,
	"payment_status" varchar(20) DEFAULT 'pending',
	"payment_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "substitute_class_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"recipient_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"sent_at" timestamp DEFAULT now(),
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "substitute_class_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_trainer_id" integer NOT NULL,
	"class_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"required_skills" text[],
	"class_date" timestamp NOT NULL,
	"class_time" varchar(20) NOT NULL,
	"location" text,
	"is_online" boolean DEFAULT false,
	"compensation" numeric(10, 2) NOT NULL,
	"max_applicants" integer DEFAULT 3,
	"current_applicants" integer DEFAULT 0,
	"status" varchar(20) DEFAULT 'open',
	"urgency" varchar(20) DEFAULT 'normal',
	"student_count" integer DEFAULT 1,
	"student_age_range" varchar(50),
	"special_requirements" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "substitute_matching_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"candidate_trainer_id" integer NOT NULL,
	"match_score" numeric(5, 2),
	"matching_criteria" jsonb,
	"is_recommended" boolean DEFAULT false,
	"recommendation_reason" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "substitute_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"rest_application_id" integer NOT NULL,
	"institute_id" integer NOT NULL,
	"requesting_trainer_id" integer NOT NULL,
	"required_skills" text[],
	"required_level" varchar(20) DEFAULT 'same',
	"working_hours" varchar(100),
	"compensation" numeric(10, 2),
	"additional_notes" text,
	"status" varchar(20) DEFAULT 'open',
	"matched_trainer_id" integer,
	"matched_at" timestamp,
	"accepted_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text,
	"description" text,
	"category" varchar(50),
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "system_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "trainer_activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"trainer_id" integer NOT NULL,
	"activity_type" varchar(50) NOT NULL,
	"activity_title" varchar(200),
	"activity_description" text,
	"points_earned" integer DEFAULT 0,
	"incentive_amount" numeric(10, 2) DEFAULT '0',
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trainer_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"has_affiliation" boolean DEFAULT false,
	"affiliation_name" varchar(200),
	"experience" text,
	"education" text,
	"certifications" text,
	"motivation" text,
	"portfolio_url" text,
	"resume" text,
	"status" varchar(20) DEFAULT 'pending',
	"submitted_at" timestamp DEFAULT now(),
	"reviewed_at" timestamp,
	"reviewed_by" integer,
	"review_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trainer_certifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" integer,
	"trainer_id" integer,
	"certification_level" varchar(50) DEFAULT 'basic',
	"certification_number" varchar(100),
	"issued_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	"issued_by" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "trainer_certifications_certification_number_unique" UNIQUE("certification_number")
);
--> statement-breakpoint
CREATE TABLE "trainer_institutes" (
	"id" serial PRIMARY KEY NOT NULL,
	"trainer_id" integer NOT NULL,
	"institute_id" integer NOT NULL,
	"role" varchar(50) DEFAULT 'trainer',
	"status" varchar(20) DEFAULT 'active',
	"join_date" timestamp DEFAULT now(),
	"permissions" text[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trainer_program_enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"program_id" integer,
	"user_id" integer,
	"status" varchar(20) DEFAULT 'enrolled',
	"progress" integer DEFAULT 0,
	"enrolled_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"final_score" numeric(5, 2),
	"certificate" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trainer_programs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"level" varchar(50) NOT NULL,
	"duration" integer,
	"price" numeric(10, 2),
	"max_participants" integer DEFAULT 20,
	"current_participants" integer DEFAULT 0,
	"start_date" timestamp,
	"end_date" timestamp,
	"instructor_id" integer,
	"curriculum" jsonb,
	"requirements" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trainer_rankings" (
	"id" serial PRIMARY KEY NOT NULL,
	"trainer_id" integer NOT NULL,
	"month" varchar(7) NOT NULL,
	"total_points" integer DEFAULT 0,
	"activity_score" numeric(10, 2) DEFAULT '0',
	"rank_position" integer,
	"is_top_performer" boolean DEFAULT false,
	"priority_settlement" boolean DEFAULT false,
	"bonus_multiplier" numeric(3, 2) DEFAULT '1.0',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trainer_tiers" (
	"id" serial PRIMARY KEY NOT NULL,
	"trainer_id" integer NOT NULL,
	"tier" varchar(50) DEFAULT 'general' NOT NULL,
	"class_count" integer DEFAULT 0,
	"content_count" integer DEFAULT 0,
	"rating" numeric(3, 2) DEFAULT '0.0',
	"last_class_date" timestamp,
	"certification_exam_passed" boolean DEFAULT false,
	"substitute_agreement_signed" boolean DEFAULT false,
	"education_completed" boolean DEFAULT false,
	"specialized_fields" text[],
	"available_time_slots" jsonb,
	"region_coverage" text[],
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trainers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" varchar(100),
	"email" varchar(255),
	"phone" varchar(20),
	"bio" text,
	"specialty" text,
	"specialties" jsonb,
	"experience" integer,
	"certification" text,
	"certifications" jsonb,
	"price" numeric(10, 2),
	"location" text,
	"address" text,
	"profile_image" text,
	"avatar" text,
	"background" text,
	"rating" numeric(3, 2) DEFAULT '0',
	"review_count" integer DEFAULT 0,
	"reviews" integer DEFAULT 0,
	"courses_count" integer DEFAULT 0,
	"students_count" integer DEFAULT 0,
	"featured" boolean DEFAULT false,
	"verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"status" varchar(50) DEFAULT 'active',
	"institute" text,
	"institute_id" integer,
	"category" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "training_journals" (
	"id" serial PRIMARY KEY NOT NULL,
	"trainer_id" integer NOT NULL,
	"pet_owner_id" integer NOT NULL,
	"pet_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"training_date" timestamp NOT NULL,
	"training_duration" integer,
	"training_type" varchar(100),
	"progress_rating" integer,
	"behavior_notes" text,
	"homework_instructions" text,
	"next_goals" text,
	"attachments" text[],
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"status" varchar(20) DEFAULT 'sent',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_type" varchar(50) NOT NULL,
	"reference_id" integer NOT NULL,
	"reference_type" varchar(50) NOT NULL,
	"payer_id" integer NOT NULL,
	"payee_id" integer NOT NULL,
	"gross_amount" numeric(10, 2) NOT NULL,
	"fee_amount" numeric(10, 2) NOT NULL,
	"net_amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'KRW',
	"payment_method" varchar(50),
	"payment_provider" varchar(50),
	"external_transaction_id" varchar(100),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"fee_policy_id" integer,
	"institute_id" integer,
	"metadata" jsonb,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text,
	"role" varchar(50) DEFAULT 'pet-owner' NOT NULL,
	"name" varchar(100),
	"phone" varchar(20),
	"phone_number" varchar(20),
	"birth_date" varchar(10),
	"age" integer,
	"gender" varchar(10),
	"avatar" text,
	"profile_image" text,
	"bio" text,
	"specialty" text,
	"location" text,
	"is_active" boolean DEFAULT true,
	"email_verified" boolean DEFAULT false,
	"is_verified" boolean DEFAULT false,
	"institute_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"subscription_tier" text DEFAULT 'free',
	"referral_code" text,
	"ai_usage" integer DEFAULT 0,
	"points" integer DEFAULT 0,
	"full_name" varchar(200),
	"zoom_link" text,
	"zoom_pmi" varchar(20),
	"zoom_pmi_password" varchar(50),
	"zoom_host_key" varchar(20),
	"video_call_preference" varchar(50) DEFAULT 'zoom',
	"address" text,
	"latitude" text,
	"longitude" text,
	"working_area" text,
	"provider" varchar(20),
	"social_id" varchar(255),
	"ci" text,
	"verified" boolean DEFAULT false,
	"verified_at" timestamp,
	"verification_name" text,
	"verification_birth" text,
	"verification_phone" text,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"membership_tier" text,
	"membership_expires_at" timestamp,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vaccinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"pet_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"vaccine_name" varchar(100) NOT NULL,
	"vaccine_date" date NOT NULL,
	"status" varchar(20) DEFAULT 'scheduled',
	"hospital_name" varchar(200),
	"hospital_address" text,
	"hospital_latitude" text,
	"hospital_longitude" text,
	"hospital_phone" varchar(20),
	"notes" text,
	"next_due_date" date,
	"reminder_enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ai_analyses" ADD CONSTRAINT "ai_analyses_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_analyses" ADD CONSTRAINT "ai_analyses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_daily_summary" ADD CONSTRAINT "ai_daily_summary_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_usage_limits" ADD CONSTRAINT "ai_usage_limits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_usage_log" ADD CONSTRAINT "ai_usage_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auto_inventory_orders" ADD CONSTRAINT "auto_inventory_orders_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_logs" ADD CONSTRAINT "care_logs_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_logs" ADD CONSTRAINT "care_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkups" ADD CONSTRAINT "checkups_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_approvals" ADD CONSTRAINT "content_approvals_submitter_id_users_id_fk" FOREIGN KEY ("submitter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_approvals" ADD CONSTRAINT "content_approvals_institute_id_institutes_id_fk" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_approvals" ADD CONSTRAINT "content_approvals_institute_reviewer_id_users_id_fk" FOREIGN KEY ("institute_reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_approvals" ADD CONSTRAINT "content_approvals_admin_reviewer_id_users_id_fk" FOREIGN KEY ("admin_reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_participant1_id_users_id_fk" FOREIGN KEY ("participant1_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_participant2_id_users_id_fk" FOREIGN KEY ("participant2_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_purchases" ADD CONSTRAINT "course_purchases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_purchases" ADD CONSTRAINT "course_purchases_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_instructor_id_users_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_institute_id_institutes_id_fk" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curriculum_product_mappings" ADD CONSTRAINT "curriculum_product_mappings_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curriculums" ADD CONSTRAINT "curriculums_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curriculums" ADD CONSTRAINT "curriculums_institute_id_institutes_id_fk" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendances" ADD CONSTRAINT "event_attendances_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendances" ADD CONSTRAINT "event_attendances_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fcm_tokens" ADD CONSTRAINT "fcm_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incentive_payments" ADD CONSTRAINT "incentive_payments_trainer_id_users_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incentive_payments" ADD CONSTRAINT "incentive_payments_activity_log_id_trainer_activity_logs_id_fk" FOREIGN KEY ("activity_log_id") REFERENCES "public"."trainer_activity_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institute_applications" ADD CONSTRAINT "institute_applications_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institute_closure" ADD CONSTRAINT "institute_closure_institute_id_institutes_id_fk" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institute_closure" ADD CONSTRAINT "institute_closure_manager_id_users_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institute_product_recommendations" ADD CONSTRAINT "institute_product_recommendations_institute_id_institutes_id_fk" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institute_product_recommendations" ADD CONSTRAINT "institute_product_recommendations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_comments" ADD CONSTRAINT "journal_comments_journal_id_training_journals_id_fk" FOREIGN KEY ("journal_id") REFERENCES "public"."training_journals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_comments" ADD CONSTRAINT "journal_comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_service_requests" ADD CONSTRAINT "journal_service_requests_journal_id_training_journals_id_fk" FOREIGN KEY ("journal_id") REFERENCES "public"."training_journals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_service_requests" ADD CONSTRAINT "journal_service_requests_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_service_requests" ADD CONSTRAINT "journal_service_requests_responded_by_users_id_fk" FOREIGN KEY ("responded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_sessions" ADD CONSTRAINT "lesson_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_sessions" ADD CONSTRAINT "lesson_sessions_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "live_streams" ADD CONSTRAINT "live_streams_host_id_users_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logo_assets" ADD CONSTRAINT "logo_assets_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_point_summary" ADD CONSTRAINT "monthly_point_summary_trainer_id_users_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_media_analyses" ADD CONSTRAINT "pet_media_analyses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_media_analyses" ADD CONSTRAINT "pet_media_analyses_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_media_analyses" ADD CONSTRAINT "pet_media_analyses_media_asset_id_pet_media_assets_id_fk" FOREIGN KEY ("media_asset_id") REFERENCES "public"."pet_media_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_media_assets" ADD CONSTRAINT "pet_media_assets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_media_assets" ADD CONSTRAINT "pet_media_assets_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_assigned_trainer_id_users_id_fk" FOREIGN KEY ("assigned_trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_trainer_id_users_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_activity_log_id_trainer_activity_logs_id_fk" FOREIGN KEY ("activity_log_id") REFERENCES "public"."trainer_activity_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_point_rule_id_point_rules_id_fk" FOREIGN KEY ("point_rule_id") REFERENCES "public"."point_rules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_commissions" ADD CONSTRAINT "product_commissions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_exposures" ADD CONSTRAINT "product_exposures_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress_sharing" ADD CONSTRAINT "progress_sharing_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress_sharing" ADD CONSTRAINT "progress_sharing_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress_sharing" ADD CONSTRAINT "progress_sharing_trainer_id_users_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress_sharing" ADD CONSTRAINT "progress_sharing_institute_id_institutes_id_fk" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_freelancer_id_users_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_freelancer_id_users_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_earnings" ADD CONSTRAINT "referral_earnings_referral_profile_id_referral_profiles_id_fk" FOREIGN KEY ("referral_profile_id") REFERENCES "public"."referral_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_earnings" ADD CONSTRAINT "referral_earnings_settlement_id_settlements_id_fk" FOREIGN KEY ("settlement_id") REFERENCES "public"."settlements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_profiles" ADD CONSTRAINT "referral_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_trainer_id_users_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rest_applications" ADD CONSTRAINT "rest_applications_trainer_id_users_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rest_applications" ADD CONSTRAINT "rest_applications_institute_id_institutes_id_fk" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rest_applications" ADD CONSTRAINT "rest_applications_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rest_applications" ADD CONSTRAINT "rest_applications_substitute_trainer_id_users_id_fk" FOREIGN KEY ("substitute_trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rest_rewards" ADD CONSTRAINT "rest_rewards_rest_application_id_rest_applications_id_fk" FOREIGN KEY ("rest_application_id") REFERENCES "public"."rest_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rest_rewards" ADD CONSTRAINT "rest_rewards_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rest_rewards" ADD CONSTRAINT "rest_rewards_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewee_id_users_id_fk" FOREIGN KEY ("reviewee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlement_items" ADD CONSTRAINT "settlement_items_settlement_id_settlements_id_fk" FOREIGN KEY ("settlement_id") REFERENCES "public"."settlements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlement_items" ADD CONSTRAINT "settlement_items_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_referral_profile_id_referral_profiles_id_fk" FOREIGN KEY ("referral_profile_id") REFERENCES "public"."referral_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_carts" ADD CONSTRAINT "shopping_carts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_carts" ADD CONSTRAINT "shopping_carts_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stream_analytics" ADD CONSTRAINT "stream_analytics_stream_id_live_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."live_streams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stream_analytics" ADD CONSTRAINT "stream_analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stream_chat_messages" ADD CONSTRAINT "stream_chat_messages_stream_id_live_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."live_streams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stream_chat_messages" ADD CONSTRAINT "stream_chat_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stream_peers" ADD CONSTRAINT "stream_peers_stream_id_live_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."live_streams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stream_peers" ADD CONSTRAINT "stream_peers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stream_recordings" ADD CONSTRAINT "stream_recordings_stream_id_live_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."live_streams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stream_schedules" ADD CONSTRAINT "stream_schedules_host_id_users_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stream_schedules" ADD CONSTRAINT "stream_schedules_stream_id_live_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."live_streams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stream_viewers" ADD CONSTRAINT "stream_viewers_stream_id_live_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."live_streams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stream_viewers" ADD CONSTRAINT "stream_viewers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_applications" ADD CONSTRAINT "substitute_applications_substitute_request_id_substitute_requests_id_fk" FOREIGN KEY ("substitute_request_id") REFERENCES "public"."substitute_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_applications" ADD CONSTRAINT "substitute_applications_applicant_trainer_id_users_id_fk" FOREIGN KEY ("applicant_trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_applications" ADD CONSTRAINT "substitute_applications_responded_by_users_id_fk" FOREIGN KEY ("responded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_class_applications" ADD CONSTRAINT "substitute_class_applications_post_id_substitute_class_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."substitute_class_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_class_applications" ADD CONSTRAINT "substitute_class_applications_applicant_id_users_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_class_assignments" ADD CONSTRAINT "substitute_class_assignments_post_id_substitute_class_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."substitute_class_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_class_assignments" ADD CONSTRAINT "substitute_class_assignments_original_trainer_id_users_id_fk" FOREIGN KEY ("original_trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_class_assignments" ADD CONSTRAINT "substitute_class_assignments_substitute_trainer_id_users_id_fk" FOREIGN KEY ("substitute_trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_class_assignments" ADD CONSTRAINT "substitute_class_assignments_class_id_courses_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_class_notifications" ADD CONSTRAINT "substitute_class_notifications_post_id_substitute_class_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."substitute_class_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_class_notifications" ADD CONSTRAINT "substitute_class_notifications_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_class_posts" ADD CONSTRAINT "substitute_class_posts_original_trainer_id_users_id_fk" FOREIGN KEY ("original_trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_class_posts" ADD CONSTRAINT "substitute_class_posts_class_id_courses_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_matching_logs" ADD CONSTRAINT "substitute_matching_logs_post_id_substitute_class_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."substitute_class_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_matching_logs" ADD CONSTRAINT "substitute_matching_logs_candidate_trainer_id_users_id_fk" FOREIGN KEY ("candidate_trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_requests" ADD CONSTRAINT "substitute_requests_rest_application_id_rest_applications_id_fk" FOREIGN KEY ("rest_application_id") REFERENCES "public"."rest_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_requests" ADD CONSTRAINT "substitute_requests_institute_id_institutes_id_fk" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_requests" ADD CONSTRAINT "substitute_requests_requesting_trainer_id_users_id_fk" FOREIGN KEY ("requesting_trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitute_requests" ADD CONSTRAINT "substitute_requests_matched_trainer_id_users_id_fk" FOREIGN KEY ("matched_trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainer_activity_logs" ADD CONSTRAINT "trainer_activity_logs_trainer_id_users_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainer_applications" ADD CONSTRAINT "trainer_applications_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainer_certifications" ADD CONSTRAINT "trainer_certifications_application_id_trainer_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."trainer_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainer_certifications" ADD CONSTRAINT "trainer_certifications_trainer_id_users_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainer_certifications" ADD CONSTRAINT "trainer_certifications_issued_by_users_id_fk" FOREIGN KEY ("issued_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainer_institutes" ADD CONSTRAINT "trainer_institutes_trainer_id_users_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainer_institutes" ADD CONSTRAINT "trainer_institutes_institute_id_institutes_id_fk" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainer_program_enrollments" ADD CONSTRAINT "trainer_program_enrollments_program_id_trainer_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."trainer_programs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainer_program_enrollments" ADD CONSTRAINT "trainer_program_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainer_programs" ADD CONSTRAINT "trainer_programs_instructor_id_users_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainer_rankings" ADD CONSTRAINT "trainer_rankings_trainer_id_users_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainer_tiers" ADD CONSTRAINT "trainer_tiers_trainer_id_users_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainers" ADD CONSTRAINT "trainers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainers" ADD CONSTRAINT "trainers_institute_id_institutes_id_fk" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_journals" ADD CONSTRAINT "training_journals_trainer_id_users_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_journals" ADD CONSTRAINT "training_journals_pet_owner_id_users_id_fk" FOREIGN KEY ("pet_owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_journals" ADD CONSTRAINT "training_journals_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fee_policy_id_fee_policies_id_fk" FOREIGN KEY ("fee_policy_id") REFERENCES "public"."fee_policies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_institute_id_institutes_id_fk" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;