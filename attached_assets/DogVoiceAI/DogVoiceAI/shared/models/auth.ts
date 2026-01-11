import { sql } from "drizzle-orm";
import { index, jsonb, pgTable, timestamp, varchar, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // 'user' | 'admin'
  approvalStatus: varchar("approval_status").default("pending"), // 'pending' | 'approved' | 'rejected'
  registrationCompleted: varchar("registration_completed").default("false"), // 'true' | 'false'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Extended user profile for registration
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  fullName: varchar("full_name").notNull(),
  institution: varchar("institution"),
  researchFocus: text("research_focus"),
  phoneNumber: varchar("phone_number"),
  purpose: text("purpose"), // 사용 목적
  experience: varchar("experience"), // 연구 경력
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin credentials for ID/password login
export const adminCredentials = pgTable("admin_credentials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  username: varchar("username").notNull().unique(),
  passwordHash: varchar("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User credentials for email/password login (regular users)
export const userCredentials = pgTable("user_credentials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  email: varchar("email").notNull().unique(),
  passwordHash: varchar("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schema for user profile registration
export const insertUserProfileSchema = createInsertSchema(userProfiles, {
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const insertAdminCredentialsSchema = createInsertSchema(adminCredentials, {
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const insertUserCredentialsSchema = createInsertSchema(userCredentials, {
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type AdminCredential = typeof adminCredentials.$inferSelect;
export type InsertAdminCredential = z.infer<typeof insertAdminCredentialsSchema>;
export type UserCredential = typeof userCredentials.$inferSelect;
export type InsertUserCredential = z.infer<typeof insertUserCredentialsSchema>;
