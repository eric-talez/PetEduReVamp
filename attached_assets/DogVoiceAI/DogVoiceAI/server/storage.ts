import { eq } from "drizzle-orm";
import { users, userProfiles, adminCredentials, userCredentials, researchers, dogSubjects, researchSessions, behavioralAnalyses, vocalAnalyses } from "@shared/schema";
import type { User, UpsertUser, Researcher, InsertResearcher, UserProfile, InsertUserProfile, AdminCredential, InsertAdminCredential, UserCredential, InsertUserCredential } from "@shared/schema";
import type { DogSubject, InsertDogSubject, VocalAnalysis, InsertVocalAnalysis } from "@shared/schema";
import type { ResearchSession, InsertResearchSession, BehavioralAnalysis, InsertBehavioralAnalysis } from "@shared/schema";
import { db } from './db';

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getPendingUsers(): Promise<User[]>;
  updateUserApprovalStatus(id: string, status: string): Promise<User>;
  updateUserRole(id: string, role: string): Promise<User>;
  updateUserRegistrationCompleted(id: string, completed: string): Promise<User>;

  // User profile management
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, updates: Partial<InsertUserProfile>): Promise<UserProfile>;

  // Researcher management
  getResearcher(id: number): Promise<Researcher | undefined>;
  getAllResearchers(): Promise<Researcher[]>;
  createResearcher(insertResearcher: InsertResearcher): Promise<Researcher>;
  updateResearcher(id: number, updates: Partial<InsertResearcher>): Promise<Researcher>;
  deleteResearcher(id: number): Promise<void>;

  // Dog subjects management
  getDogSubject(id: number): Promise<DogSubject | undefined>;
  getAllDogSubjects(): Promise<DogSubject[]>;
  createDogSubject(insertDogSubject: InsertDogSubject): Promise<DogSubject>;
  updateDogSubject(id: number, updates: Partial<InsertDogSubject>): Promise<DogSubject>;
  deleteDogSubject(id: number): Promise<void>;

  // Research session management
  getResearchSession(id: number): Promise<ResearchSession | undefined>;
  getAllResearchSessions(): Promise<ResearchSession[]>;
  getResearchSessionsByDog(dogId: number): Promise<ResearchSession[]>;
  getResearchSessionsByResearcher(researcherId: number): Promise<ResearchSession[]>;
  createResearchSession(insertSession: InsertResearchSession): Promise<ResearchSession>;
  updateResearchSession(id: number, updates: Partial<InsertResearchSession>): Promise<ResearchSession>;
  deleteResearchSession(id: number): Promise<void>;

  // Behavioral analysis management
  getBehavioralAnalysis(id: number): Promise<BehavioralAnalysis | undefined>;
  getAllBehavioralAnalyses(): Promise<BehavioralAnalysis[]>;
  getBehavioralAnalysesByDog(dogId: number): Promise<BehavioralAnalysis[]>;
  getBehavioralAnalysesBySession(sessionId: number): Promise<BehavioralAnalysis[]>;
  createBehavioralAnalysis(insertAnalysis: InsertBehavioralAnalysis): Promise<BehavioralAnalysis>;
  updateBehavioralAnalysis(id: number, updates: Partial<InsertBehavioralAnalysis>): Promise<BehavioralAnalysis>;
  deleteBehavioralAnalysis(id: number): Promise<void>;

  // Vocal analysis management
  getVocalAnalysis(id: number): Promise<VocalAnalysis | undefined>;
  getAllVocalAnalyses(): Promise<VocalAnalysis[]>;
  getVocalAnalysesByDog(dogId: number): Promise<VocalAnalysis[]>;
  getVocalAnalysesBySession(sessionId: number): Promise<VocalAnalysis[]>;
  createVocalAnalysis(insertAnalysis: InsertVocalAnalysis): Promise<VocalAnalysis>;
  updateVocalAnalysis(id: number, updates: Partial<InsertVocalAnalysis>): Promise<VocalAnalysis>;
  deleteVocalAnalysis(id: number): Promise<void>;

  // Admin credentials management
  getAdminCredentialByUsername(username: string): Promise<AdminCredential | undefined>;
  getAdminCredentialByUserId(userId: string): Promise<AdminCredential | undefined>;
  createAdminCredential(credential: InsertAdminCredential): Promise<AdminCredential>;
  createAdminUser(username: string, passwordHash: string, email?: string): Promise<User>;

  // User credentials management (for email/password login)
  getUserCredentialByEmail(email: string): Promise<UserCredential | undefined>;
  getUserCredentialByUserId(userId: string): Promise<UserCredential | undefined>;
  createUserCredential(credential: InsertUserCredential): Promise<UserCredential>;
  createUserWithCredentials(email: string, passwordHash: string, fullName: string, phoneNumber?: string, institution?: string, researchFocus?: string, purpose?: string, experience?: string): Promise<User>;

  // Statistics and analytics
  getResearchStatistics(): Promise<{
    totalSubjects: number;
    totalSessions: number;
    totalAnalyses: number;
    recentAnalyses: any[];
  }>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getPendingUsers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.approvalStatus, 'pending'));
  }

  async updateUserApprovalStatus(id: string, status: string): Promise<User> {
    const [user] = await db.update(users)
      .set({ approvalStatus: status, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    const [user] = await db.update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserRegistrationCompleted(id: string, completed: string): Promise<User> {
    const [user] = await db.update(users)
      .set({ registrationCompleted: completed, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // User profile methods
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile || undefined;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [userProfile] = await db.insert(userProfiles).values(profile).returning();
    return userProfile;
  }

  async updateUserProfile(userId: string, updates: Partial<InsertUserProfile>): Promise<UserProfile> {
    const [profile] = await db.update(userProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return profile;
  }

  // Researcher methods
  async getResearcher(id: number): Promise<Researcher | undefined> {
    const [researcher] = await db.select().from(researchers).where(eq(researchers.id, id));
    return researcher || undefined;
  }

  async getAllResearchers(): Promise<Researcher[]> {
    return await db.select().from(researchers);
  }

  async createResearcher(insertResearcher: InsertResearcher): Promise<Researcher> {
    const [researcher] = await db.insert(researchers).values(insertResearcher).returning();
    return researcher;
  }

  async updateResearcher(id: number, updates: Partial<InsertResearcher>): Promise<Researcher> {
    const [researcher] = await db.update(researchers)
      .set(updates)
      .where(eq(researchers.id, id))
      .returning();
    return researcher;
  }

  async deleteResearcher(id: number): Promise<void> {
    await db.delete(researchers).where(eq(researchers.id, id));
  }

  // Dog subject methods
  async getDogSubject(id: number): Promise<DogSubject | undefined> {
    const [dog] = await db.select().from(dogSubjects).where(eq(dogSubjects.id, id));
    return dog || undefined;
  }

  async getAllDogSubjects(): Promise<DogSubject[]> {
    return await db.select().from(dogSubjects);
  }

  async createDogSubject(insertDogSubject: InsertDogSubject): Promise<DogSubject> {
    const [dog] = await db.insert(dogSubjects).values(insertDogSubject).returning();
    return dog;
  }

  async updateDogSubject(id: number, updates: Partial<InsertDogSubject>): Promise<DogSubject> {
    const [dog] = await db.update(dogSubjects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(dogSubjects.id, id))
      .returning();
    return dog;
  }

  async deleteDogSubject(id: number): Promise<void> {
    await db.delete(dogSubjects).where(eq(dogSubjects.id, id));
  }

  // Research session methods
  async getResearchSession(id: number): Promise<ResearchSession | undefined> {
    const [session] = await db.select().from(researchSessions).where(eq(researchSessions.id, id));
    return session || undefined;
  }

  async getAllResearchSessions(): Promise<ResearchSession[]> {
    return await db.select().from(researchSessions);
  }

  async getResearchSessionsByDog(dogId: number): Promise<ResearchSession[]> {
    return await db.select().from(researchSessions).where(eq(researchSessions.dogId, dogId));
  }

  async getResearchSessionsByResearcher(researcherId: number): Promise<ResearchSession[]> {
    return await db.select().from(researchSessions).where(eq(researchSessions.researcherId, researcherId));
  }

  async createResearchSession(insertSession: InsertResearchSession): Promise<ResearchSession> {
    const [session] = await db.insert(researchSessions).values(insertSession).returning();
    return session;
  }

  async updateResearchSession(id: number, updates: Partial<InsertResearchSession>): Promise<ResearchSession> {
    const [session] = await db.update(researchSessions)
      .set(updates)
      .where(eq(researchSessions.id, id))
      .returning();
    return session;
  }

  async deleteResearchSession(id: number): Promise<void> {
    await db.delete(researchSessions).where(eq(researchSessions.id, id));
  }

  // Behavioral analysis methods
  async getBehavioralAnalysis(id: number): Promise<BehavioralAnalysis | undefined> {
    const [analysis] = await db.select().from(behavioralAnalyses).where(eq(behavioralAnalyses.id, id));
    return analysis || undefined;
  }

  async getAllBehavioralAnalyses(): Promise<BehavioralAnalysis[]> {
    return await db.select().from(behavioralAnalyses);
  }

  async getBehavioralAnalysesByDog(dogId: number): Promise<BehavioralAnalysis[]> {
    return await db.select().from(behavioralAnalyses).where(eq(behavioralAnalyses.dogId, dogId));
  }

  async getBehavioralAnalysesBySession(sessionId: number): Promise<BehavioralAnalysis[]> {
    return await db.select().from(behavioralAnalyses).where(eq(behavioralAnalyses.sessionId, sessionId));
  }

  async createBehavioralAnalysis(insertAnalysis: InsertBehavioralAnalysis): Promise<BehavioralAnalysis> {
    const [analysis] = await db.insert(behavioralAnalyses).values(insertAnalysis).returning();
    return analysis;
  }

  async updateBehavioralAnalysis(id: number, updates: Partial<InsertBehavioralAnalysis>): Promise<BehavioralAnalysis> {
    const [analysis] = await db.update(behavioralAnalyses)
      .set(updates)
      .where(eq(behavioralAnalyses.id, id))
      .returning();
    return analysis;
  }

  async deleteBehavioralAnalysis(id: number): Promise<void> {
    await db.delete(behavioralAnalyses).where(eq(behavioralAnalyses.id, id));
  }

  // Vocal analysis methods
  async getVocalAnalysis(id: number): Promise<VocalAnalysis | undefined> {
    const [analysis] = await db.select().from(vocalAnalyses).where(eq(vocalAnalyses.id, id));
    return analysis || undefined;
  }

  async getAllVocalAnalyses(): Promise<VocalAnalysis[]> {
    return await db.select().from(vocalAnalyses);
  }

  async getVocalAnalysesByDog(dogId: number): Promise<VocalAnalysis[]> {
    return await db.select().from(vocalAnalyses).where(eq(vocalAnalyses.dogId, dogId));
  }

  async getVocalAnalysesBySession(sessionId: number): Promise<VocalAnalysis[]> {
    return await db.select().from(vocalAnalyses).where(eq(vocalAnalyses.sessionId, sessionId));
  }

  async createVocalAnalysis(insertAnalysis: InsertVocalAnalysis): Promise<VocalAnalysis> {
    const [analysis] = await db.insert(vocalAnalyses).values(insertAnalysis).returning();
    return analysis;
  }

  async updateVocalAnalysis(id: number, updates: Partial<InsertVocalAnalysis>): Promise<VocalAnalysis> {
    const [analysis] = await db.update(vocalAnalyses)
      .set(updates)
      .where(eq(vocalAnalyses.id, id))
      .returning();
    return analysis;
  }

  async deleteVocalAnalysis(id: number): Promise<void> {
    await db.delete(vocalAnalyses).where(eq(vocalAnalyses.id, id));
  }

  // Admin credentials methods
  async getAdminCredentialByUsername(username: string): Promise<AdminCredential | undefined> {
    const [credential] = await db.select().from(adminCredentials).where(eq(adminCredentials.username, username));
    return credential || undefined;
  }

  async getAdminCredentialByUserId(userId: string): Promise<AdminCredential | undefined> {
    const [credential] = await db.select().from(adminCredentials).where(eq(adminCredentials.userId, userId));
    return credential || undefined;
  }

  async createAdminCredential(credential: InsertAdminCredential): Promise<AdminCredential> {
    const [adminCred] = await db.insert(adminCredentials).values(credential).returning();
    return adminCred;
  }

  async createAdminUser(username: string, passwordHash: string, email?: string): Promise<User> {
    const [user] = await db.insert(users).values({
      email: email || `${username}@admin.local`,
      firstName: 'Admin',
      lastName: username,
      role: 'admin',
      approvalStatus: 'approved',
      registrationCompleted: 'true',
    }).returning();
    
    await db.insert(adminCredentials).values({
      userId: user.id,
      username,
      passwordHash,
    });
    
    return user;
  }

  // User credentials methods (for email/password login)
  async getUserCredentialByEmail(email: string): Promise<UserCredential | undefined> {
    const [credential] = await db.select().from(userCredentials).where(eq(userCredentials.email, email));
    return credential || undefined;
  }

  async getUserCredentialByUserId(userId: string): Promise<UserCredential | undefined> {
    const [credential] = await db.select().from(userCredentials).where(eq(userCredentials.userId, userId));
    return credential || undefined;
  }

  async createUserCredential(credential: InsertUserCredential): Promise<UserCredential> {
    const [userCred] = await db.insert(userCredentials).values(credential).returning();
    return userCred;
  }

  async createUserWithCredentials(
    email: string, 
    passwordHash: string, 
    fullName: string, 
    phoneNumber?: string, 
    institution?: string, 
    researchFocus?: string, 
    purpose?: string, 
    experience?: string
  ): Promise<User> {
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || fullName;
    const lastName = nameParts.slice(1).join(' ') || '';

    const [user] = await db.insert(users).values({
      email,
      firstName,
      lastName,
      role: 'user',
      approvalStatus: 'pending',
      registrationCompleted: 'true',
    }).returning();
    
    await db.insert(userCredentials).values({
      userId: user.id,
      email,
      passwordHash,
    });

    await db.insert(userProfiles).values({
      userId: user.id,
      fullName,
      phoneNumber: phoneNumber || null,
      institution: institution || null,
      researchFocus: researchFocus || null,
      purpose: purpose || null,
      experience: experience || null,
    });
    
    return user;
  }

  // Statistics methods
  // Comprehensive report methods
  async createComprehensiveReport(insertReport: any): Promise<any> {
    try {
      const { comprehensiveReports } = await import('@shared/schema');
      const [report] = await db.insert(comprehensiveReports).values(insertReport).returning();
      return report;
    } catch (error) {
      console.error('Create comprehensive report error:', error);
      throw error;
    }
  }

  async getComprehensiveReportsByDog(dogId: number): Promise<any[]> {
    try {
      const { comprehensiveReports } = await import('@shared/schema');
      return await db.select().from(comprehensiveReports).where(eq(comprehensiveReports.dogId, dogId));
    } catch (error) {
      console.error('Get comprehensive reports error:', error);
      return [];
    }
  }

  async getResearchStatistics() {
    const totalSubjects = await db.select().from(dogSubjects);
    const totalSessions = await db.select().from(researchSessions);
    const totalBehavioralAnalyses = await db.select().from(behavioralAnalyses);
    const totalVocalAnalyses = await db.select().from(vocalAnalyses);
    
    const recentAnalyses = await db.select()
      .from(behavioralAnalyses)
      .limit(5)
      .orderBy(behavioralAnalyses.createdAt);

    return {
      totalSubjects: totalSubjects.length,
      totalSessions: totalSessions.length,
      totalAnalyses: totalBehavioralAnalyses.length + totalVocalAnalyses.length,
      recentAnalyses
    };
  }
}

export const storage = new DatabaseStorage();