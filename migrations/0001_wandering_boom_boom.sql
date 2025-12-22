CREATE TABLE "engagement_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"target_type" varchar(20) NOT NULL,
	"target_id" integer,
	"event_type" varchar(30) NOT NULL,
	"value" numeric(10, 2) DEFAULT '1',
	"metadata" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "follows" (
	"id" serial PRIMARY KEY NOT NULL,
	"follower_id" integer NOT NULL,
	"following_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "monetization_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(50) NOT NULL,
	"value" json NOT NULL,
	"description" text,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "monetization_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "monthly_revenue" (
	"id" serial PRIMARY KEY NOT NULL,
	"month" varchar(7) NOT NULL,
	"total_amount" numeric(15, 2) NOT NULL,
	"ad_revenue" numeric(15, 2) DEFAULT '0',
	"subscription_revenue" numeric(15, 2) DEFAULT '0',
	"course_revenue" numeric(15, 2) DEFAULT '0',
	"consultation_revenue" numeric(15, 2) DEFAULT '0',
	"other_revenue" numeric(15, 2) DEFAULT '0',
	"stage" varchar(20) DEFAULT 'stage1' NOT NULL,
	"platform_share" numeric(5, 2) NOT NULL,
	"trainer_share" numeric(5, 2) NOT NULL,
	"is_settled" boolean DEFAULT false,
	"settled_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"revenue_id" integer,
	"user_id" integer NOT NULL,
	"month" varchar(7) NOT NULL,
	"gross_amount" numeric(12, 2) NOT NULL,
	"platform_fee" numeric(12, 2) NOT NULL,
	"net_amount" numeric(12, 2) NOT NULL,
	"contribution_score" numeric(10, 2) NOT NULL,
	"contribution_ratio" numeric(5, 4) NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "push_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"status" varchar(20) DEFAULT 'draft',
	"target_type" varchar(30) NOT NULL,
	"target_criteria" jsonb,
	"scheduled_at" timestamp,
	"sent_at" timestamp,
	"total_recipients" integer DEFAULT 0,
	"success_count" integer DEFAULT 0,
	"failure_count" integer DEFAULT 0,
	"data" jsonb,
	"created_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "push_notification_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_id" integer,
	"user_id" integer,
	"token_id" integer,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"status" varchar(20) NOT NULL,
	"message_id" text,
	"error_code" varchar(50),
	"error_message" text,
	"sent_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scheduled_push_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_id" integer,
	"user_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"data" jsonb,
	"scheduled_at" timestamp NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"sent_at" timestamp,
	"error_message" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "talez_score_cache" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"owner_score" numeric(10, 2) DEFAULT '0',
	"trainer_score" numeric(10, 2) DEFAULT '0',
	"total_watch_seconds" numeric(12, 2) DEFAULT '0',
	"total_views" integer DEFAULT 0,
	"total_likes" integer DEFAULT 0,
	"total_comments" integer DEFAULT 0,
	"follower_count" integer DEFAULT 0,
	"violation_count" integer DEFAULT 0,
	"monetization_level" integer DEFAULT 0,
	"monetization_enabled" boolean DEFAULT false,
	"last_calculated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "engagement_events" ADD CONSTRAINT "engagement_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_users_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_revenue_id_monthly_revenue_id_fk" FOREIGN KEY ("revenue_id") REFERENCES "public"."monthly_revenue"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_campaigns" ADD CONSTRAINT "push_campaigns_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_notification_logs" ADD CONSTRAINT "push_notification_logs_campaign_id_push_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."push_campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_notification_logs" ADD CONSTRAINT "push_notification_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_notification_logs" ADD CONSTRAINT "push_notification_logs_token_id_fcm_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."fcm_tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_push_notifications" ADD CONSTRAINT "scheduled_push_notifications_campaign_id_push_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."push_campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_push_notifications" ADD CONSTRAINT "scheduled_push_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talez_score_cache" ADD CONSTRAINT "talez_score_cache_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;