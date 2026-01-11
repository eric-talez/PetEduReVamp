import { pgTable, text, integer, timestamp, boolean, real, json } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { relations } from 'drizzle-orm';

export * from "./models/auth";

export const researchers = pgTable('researchers', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  institution: text('institution').notNull(),
  specialization: text('specialization').notNull(),
  email: text('email').notNull(),
  phoneNumber: text('phone_number'),
  yearsOfExperience: integer('years_of_experience').notNull(),
  credentials: text('credentials').array(),
  researchFocus: text('research_focus').array(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const dogSubjects = pgTable('dog_subjects', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  breed: text('breed').notNull(),
  subBreed: text('sub_breed'),
  age: integer('age').notNull(), // months
  weight: real('weight').notNull(), // kg
  gender: text('gender').notNull(),
  neutered: boolean('neutered').default(false),
  ownerName: text('owner_name').notNull(),
  ownerContact: text('owner_contact').notNull(),
  medicalHistory: text('medical_history').array(),
  behavioralNotes: text('behavioral_notes'),
  environment: text('environment'), // home, shelter, kennel, etc.
  socialLevel: text('social_level'), // high, medium, low
  activityLevel: text('activity_level'), // high, medium, low
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const researchSessions = pgTable('research_sessions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  dogId: integer('dog_id').references(() => dogSubjects.id),
  researcherId: integer('researcher_id').references(() => researchers.id),
  sessionType: text('session_type').notNull(), // behavioral, vocal, physiological, combined
  duration: integer('duration').notNull(), // minutes
  environment: text('environment').notNull(),
  temperature: real('temperature'),
  humidity: real('humidity'),
  notes: text('notes'),
  sessionDate: timestamp('session_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const behavioralAnalyses = pgTable('behavioral_analyses', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  sessionId: integer('session_id').references(() => researchSessions.id),
  dogId: integer('dog_id').references(() => dogSubjects.id),
  researcherId: integer('researcher_id').references(() => researchers.id),
  behaviorType: text('behavior_type').notNull(), // play, aggression, submission, anxiety, etc.
  intensity: integer('intensity').notNull(), // 1-10 scale
  duration: real('duration').notNull(), // seconds
  triggers: text('triggers').array(),
  bodyLanguage: json('body_language'), // tail, ears, posture, etc.
  facialExpressions: json('facial_expressions'),
  vocalizations: json('vocalizations'),
  contextualFactors: text('contextual_factors').array(),
  confidence: real('confidence').notNull(),
  videoTimestamp: real('video_timestamp'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 견주 설문 조사
export const ownerSurveys = pgTable('owner_surveys', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  dogId: integer('dog_id').references(() => dogSubjects.id),
  surveyDate: timestamp('survey_date').defaultNow(),
  dailyRoutine: json('daily_routine'), // 일상 루틴
  feedingHabits: json('feeding_habits'), // 식습관
  exerciseLevel: text('exercise_level'), // 운동량
  sleepPattern: text('sleep_pattern'), // 수면 패턴
  socialInteraction: json('social_interaction'), // 사회적 상호작용
  behaviorConcerns: text('behavior_concerns').array(), // 행동 우려사항
  healthIssues: text('health_issues').array(), // 건강 문제
  stressFactors: text('stress_factors').array(), // 스트레스 요인
  environmentChanges: text('environment_changes').array(), // 환경 변화
  ownerObservations: text('owner_observations'), // 견주 관찰 내용
  createdAt: timestamp('created_at').defaultNow(),
});

// 종합 분석 리포트
export const comprehensiveReports = pgTable('comprehensive_reports', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  dogId: integer('dog_id').references(() => dogSubjects.id),
  surveyId: integer('survey_id').references(() => ownerSurveys.id),
  sessionId: integer('session_id').references(() => researchSessions.id),
  reportDate: timestamp('report_date').defaultNow(),
  motionAnalysisSummary: json('motion_analysis_summary'), // 모션 분석 요약
  behaviorAnalysisSummary: json('behavior_analysis_summary'), // 행동 분석 요약
  surveyInsights: json('survey_insights'), // 설문 인사이트
  correlationFindings: json('correlation_findings'), // 상관관계 발견사항
  aiRecommendations: text('ai_recommendations').array(), // AI 추천사항
  healthAlerts: text('health_alerts').array(), // 건강 경고
  trainingAdvice: text('training_advice').array(), // 훈련 조언
  overallScore: real('overall_score'), // 전체 점수
  wellbeingIndex: real('wellbeing_index'), // 웰빙 지수
  createdAt: timestamp('created_at').defaultNow(),
});

export type OwnerSurvey = typeof ownerSurveys.$inferSelect;
export type InsertOwnerSurvey = typeof ownerSurveys.$inferInsert;
export type ComprehensiveReport = typeof comprehensiveReports.$inferSelect;
export type InsertComprehensiveReport = typeof comprehensiveReports.$inferInsert;

export const vocalAnalyses = pgTable('vocal_analyses', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  sessionId: integer('session_id').references(() => researchSessions.id),
  dogId: integer('dog_id').references(() => dogSubjects.id),
  researcherId: integer('researcher_id').references(() => researchers.id),
  vocalizationType: text('vocalization_type').notNull(), // bark, whine, growl, howl, whimper
  frequency: real('frequency').notNull(), // Hz
  amplitude: real('amplitude').notNull(), // dB
  duration: real('duration').notNull(), // seconds
  pitch: real('pitch').notNull(),
  rhythm: text('rhythm'),
  emotionalState: text('emotional_state').notNull(),
  context: text('context').notNull(),
  audioFeatures: json('audio_features'),
  spectrogramData: json('spectrogram_data'),
  confidence: real('confidence').notNull(),
  audioTimestamp: real('audio_timestamp'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const physiologicalData = pgTable('physiological_data', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  sessionId: integer('session_id').references(() => researchSessions.id),
  dogId: integer('dog_id').references(() => dogSubjects.id),
  heartRate: real('heart_rate'),
  respiratoryRate: real('respiratory_rate'),
  bodyTemperature: real('body_temperature'),
  stressHormones: json('stress_hormones'), // cortisol, adrenaline levels
  bloodPressure: text('blood_pressure'),
  activityMetrics: json('activity_metrics'),
  timestamp: timestamp('timestamp').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const researchFindings = pgTable('research_findings', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  researcherId: integer('researcher_id').references(() => researchers.id),
  studyType: text('study_type').notNull(),
  sampleSize: integer('sample_size').notNull(),
  duration: integer('duration').notNull(), // days
  methodology: text('methodology'),
  keyFindings: text('key_findings').array(),
  statisticalSignificance: real('statistical_significance'),
  limitations: text('limitations').array(),
  futureResearch: text('future_research').array(),
  publicationStatus: text('publication_status'), // draft, submitted, published
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const researchersRelations = relations(researchers, ({ many }) => ({
  sessions: many(researchSessions),
  behavioralAnalyses: many(behavioralAnalyses),
  vocalAnalyses: many(vocalAnalyses),
  findings: many(researchFindings),
}));

export const dogSubjectsRelations = relations(dogSubjects, ({ many }) => ({
  sessions: many(researchSessions),
  behavioralAnalyses: many(behavioralAnalyses),
  vocalAnalyses: many(vocalAnalyses),
  physiologicalData: many(physiologicalData),
}));

export const researchSessionsRelations = relations(researchSessions, ({ one, many }) => ({
  dog: one(dogSubjects, {
    fields: [researchSessions.dogId],
    references: [dogSubjects.id],
  }),
  researcher: one(researchers, {
    fields: [researchSessions.researcherId],
    references: [researchers.id],
  }),
  behavioralAnalyses: many(behavioralAnalyses),
  vocalAnalyses: many(vocalAnalyses),
  physiologicalData: many(physiologicalData),
}));

export const behavioralAnalysesRelations = relations(behavioralAnalyses, ({ one }) => ({
  session: one(researchSessions, {
    fields: [behavioralAnalyses.sessionId],
    references: [researchSessions.id],
  }),
  dog: one(dogSubjects, {
    fields: [behavioralAnalyses.dogId],
    references: [dogSubjects.id],
  }),
  researcher: one(researchers, {
    fields: [behavioralAnalyses.researcherId],
    references: [researchers.id],
  }),
}));

export const vocalAnalysesRelations = relations(vocalAnalyses, ({ one }) => ({
  session: one(researchSessions, {
    fields: [vocalAnalyses.sessionId],
    references: [researchSessions.id],
  }),
  dog: one(dogSubjects, {
    fields: [vocalAnalyses.dogId],
    references: [dogSubjects.id],
  }),
  researcher: one(researchers, {
    fields: [vocalAnalyses.researcherId],
    references: [researchers.id],
  }),
}));

// Insert schemas
export const insertResearcherSchema = createInsertSchema(researchers, {
  createdAt: z.coerce.date().optional(),
}).omit({ id: true, createdAt: true });

export const insertDogSubjectSchema = createInsertSchema(dogSubjects, {
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const insertResearchSessionSchema = createInsertSchema(researchSessions, {
  sessionDate: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
}).omit({ id: true, createdAt: true });

export const insertBehavioralAnalysisSchema = createInsertSchema(behavioralAnalyses, {
  createdAt: z.coerce.date().optional(),
}).omit({ id: true, createdAt: true });

export const insertVocalAnalysisSchema = createInsertSchema(vocalAnalyses, {
  createdAt: z.coerce.date().optional(),
}).omit({ id: true, createdAt: true });

export const insertPhysiologicalDataSchema = createInsertSchema(physiologicalData, {
  timestamp: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
}).omit({ id: true, createdAt: true });

export const insertResearchFindingSchema = createInsertSchema(researchFindings, {
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type InsertResearcher = z.infer<typeof insertResearcherSchema>;
export type Researcher = typeof researchers.$inferSelect;
export type InsertDogSubject = z.infer<typeof insertDogSubjectSchema>;
export type DogSubject = typeof dogSubjects.$inferSelect;
export type InsertResearchSession = z.infer<typeof insertResearchSessionSchema>;
export type ResearchSession = typeof researchSessions.$inferSelect;
export type InsertBehavioralAnalysis = z.infer<typeof insertBehavioralAnalysisSchema>;
export type BehavioralAnalysis = typeof behavioralAnalyses.$inferSelect;
export type InsertVocalAnalysis = z.infer<typeof insertVocalAnalysisSchema>;
export type VocalAnalysis = typeof vocalAnalyses.$inferSelect;
export type InsertPhysiologicalData = z.infer<typeof insertPhysiologicalDataSchema>;
export type PhysiologicalData = typeof physiologicalData.$inferSelect;
export type InsertResearchFinding = z.infer<typeof insertResearchFindingSchema>;
export type ResearchFinding = typeof researchFindings.$inferSelect;

export * from "./models/chat";