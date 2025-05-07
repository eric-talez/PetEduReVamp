import { pgTable, text, serial, integer, boolean, timestamp, json, varchar } from "drizzle-orm/pg-core";
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
});

export const createUserSchema = createInsertSchema(users)
  .omit({
    id: true,
    createdAt: true,
    instituteId: true
  })
  .extend({
    instituteCode: z.string().optional(),
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
