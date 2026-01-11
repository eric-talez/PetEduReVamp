import type { Express } from "express";
import { Request, Response } from "express";
import { z } from "zod";
import { fromError } from "zod-validation-error";
import bcrypt from "bcrypt";
import { insertResearcherSchema, insertDogSubjectSchema, insertVocalAnalysisSchema, insertBehavioralAnalysisSchema, insertUserProfileSchema } from "@shared/schema";
import { storage } from "./storage";
import { createServer } from "http";

const BCRYPT_ROUNDS = 12;

// Helper to get userId from session (works with both social and admin login)
function getUserIdFromSession(req: Request): string | null {
  const sessionUser = req.user as any;
  if (!sessionUser) return null;
  return sessionUser.claims?.sub || sessionUser.id || null;
}

// Helper to check if user is authenticated
function requireAuth(req: Request, res: Response): boolean {
  if (!req.isAuthenticated || typeof req.isAuthenticated !== 'function' || !req.isAuthenticated() || !req.user) {
    res.status(401).json({ error: "인증이 필요합니다" });
    return false;
  }
  return true;
}

// User Registration and Profile Routes
export async function registerUserProfile(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "인증이 필요합니다" });
    }

    const userId = getUserIdFromSession(req);
    if (!userId) {
      return res.status(401).json({ error: "사용자 정보를 찾을 수 없습니다" });
    }
    
    // Check if profile already exists
    const existingProfile = await storage.getUserProfile(userId);
    if (existingProfile) {
      return res.status(400).json({ error: "이미 프로필이 등록되어 있습니다" });
    }

    const validationResult = insertUserProfileSchema.safeParse({
      ...req.body,
      userId
    });
    
    if (!validationResult.success) {
      const validationError = fromError(validationResult.error);
      return res.status(400).json({ error: validationError.toString() });
    }

    const profile = await storage.createUserProfile(validationResult.data);
    
    // Mark registration as completed
    await storage.updateUserRegistrationCompleted(userId, 'true');
    
    res.status(201).json({ profile, message: "회원가입이 완료되었습니다. 관리자 승인을 기다려주세요." });
  } catch (error) {
    console.error("Error registering user profile:", error);
    res.status(500).json({ error: "회원가입 처리 중 오류가 발생했습니다" });
  }
}

export async function getUserProfile(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "인증이 필요합니다" });
    }

    const userId = getUserIdFromSession(req);
    if (!userId) {
      return res.status(401).json({ error: "사용자 정보를 찾을 수 없습니다" });
    }
    const profile = await storage.getUserProfile(userId);
    
    res.json({ profile: profile || null });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "프로필 조회 중 오류가 발생했습니다" });
  }
}

// Prefill contact info (unauthenticated - stored in session)
export async function savePrefillData(req: Request, res: Response) {
  try {
    const { name, email, phone } = req.body;
    
    // Store in session for use after login
    (req.session as any).prefillData = {
      name: name || "",
      email: email || "",
      phone: phone || ""
    };
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving prefill data:", error);
    res.status(500).json({ error: "데이터 저장 오류" });
  }
}

export async function getPrefillData(req: Request, res: Response) {
  try {
    const prefillData = (req.session as any).prefillData || null;
    
    // Clear after reading
    if (prefillData) {
      delete (req.session as any).prefillData;
    }
    
    res.json({ prefillData });
  } catch (error) {
    console.error("Error fetching prefill data:", error);
    res.status(500).json({ error: "데이터 조회 오류" });
  }
}

// Helper function to check admin status
async function isAdminUser(req: Request): Promise<boolean> {
  if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
    return false;
  }
  const sessionUser = req.user as any;
  const userId = sessionUser.claims?.sub || sessionUser.id;
  if (!userId) return false;
  
  const dbUser = await storage.getUser(userId);
  return dbUser?.role === 'admin';
}

// Admin Routes
export async function getPendingUsers(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "인증이 필요합니다" });
    }

    const isAdmin = await isAdminUser(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "관리자 권한이 필요합니다" });
    }

    const pendingUsers = await storage.getPendingUsers();
    
    // Get profiles for each pending user
    const usersWithProfiles = await Promise.all(
      pendingUsers.map(async (user) => {
        const profile = await storage.getUserProfile(user.id);
        return { ...user, profile };
      })
    );
    
    res.json(usersWithProfiles);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({ error: "대기 중인 사용자 조회 오류" });
  }
}

export async function getAllUsersAdmin(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "인증이 필요합니다" });
    }

    const isAdmin = await isAdminUser(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "관리자 권한이 필요합니다" });
    }

    const allUsers = await storage.getAllUsers();
    
    // Get profiles for each user
    const usersWithProfiles = await Promise.all(
      allUsers.map(async (user) => {
        const profile = await storage.getUserProfile(user.id);
        return { ...user, profile };
      })
    );
    
    res.json(usersWithProfiles);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "사용자 목록 조회 오류" });
  }
}

export async function approveUser(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "인증이 필요합니다" });
    }

    const isAdmin = await isAdminUser(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "관리자 권한이 필요합니다" });
    }

    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "사용자 ID가 필요합니다" });
    }

    const updatedUser = await storage.updateUserApprovalStatus(userId, 'approved');
    res.json({ user: updatedUser, message: "사용자가 승인되었습니다" });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ error: "사용자 승인 처리 중 오류가 발생했습니다" });
  }
}

export async function rejectUser(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "인증이 필요합니다" });
    }

    const isAdmin = await isAdminUser(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "관리자 권한이 필요합니다" });
    }

    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "사용자 ID가 필요합니다" });
    }

    const updatedUser = await storage.updateUserApprovalStatus(userId, 'rejected');
    res.json({ user: updatedUser, message: "사용자가 거절되었습니다" });
  } catch (error) {
    console.error("Error rejecting user:", error);
    res.status(500).json({ error: "사용자 거절 처리 중 오류가 발생했습니다" });
  }
}

export async function setUserRole(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "인증이 필요합니다" });
    }

    const isAdmin = await isAdminUser(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "관리자 권한이 필요합니다" });
    }

    const { userId } = req.params;
    const { role } = req.body;
    
    if (!userId || !role) {
      return res.status(400).json({ error: "사용자 ID와 역할이 필요합니다" });
    }

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: "올바른 역할이 아닙니다" });
    }

    const updatedUser = await storage.updateUserRole(userId, role);
    res.json({ user: updatedUser, message: "사용자 역할이 변경되었습니다" });
  } catch (error) {
    console.error("Error setting user role:", error);
    res.status(500).json({ error: "역할 변경 중 오류가 발생했습니다" });
  }
}

// API Routes for Research Platform

// Dog Subjects Routes
export async function getDogSubjects(req: Request, res: Response) {
  try {
    if (!requireAuth(req, res)) return;
    const dogSubjects = await storage.getAllDogSubjects();
    res.json(dogSubjects);
  } catch (error) {
    console.error("Error fetching dog subjects:", error);
    res.status(500).json({ error: "Failed to fetch dog subjects" });
  }
}

export async function createDogSubject(req: Request, res: Response) {
  try {
    if (!requireAuth(req, res)) return;
    const validationResult = insertDogSubjectSchema.safeParse(req.body);
    if (!validationResult.success) {
      const validationError = fromError(validationResult.error);
      return res.status(400).json({ error: validationError.toString() });
    }

    const dogSubject = await storage.createDogSubject(validationResult.data);
    res.status(201).json(dogSubject);
  } catch (error) {
    console.error("Error creating dog subject:", error);
    res.status(500).json({ error: "Failed to create dog subject" });
  }
}

export async function createAdvancedDogSubject(req: Request, res: Response) {
  try {
    if (!requireAuth(req, res)) return;
    
    const data = req.body;
    
    const breed = data.breed === "직접입력" && data.customBreed ? data.customBreed : data.breed;
    const gender = data.gender.includes("neutered") ? data.gender.replace("_neutered", "") : data.gender;
    const neutered = data.gender.includes("neutered");
    
    const healthScore = calculateHealthScore(data);
    const behaviorScore = calculateBehaviorScore(data);
    
    const dogSubjectData = {
      name: data.name,
      breed: breed,
      age: data.ageMonths,
      weight: data.weight,
      gender: gender,
      neutered: neutered,
      ownerName: "",
      ownerContact: "",
      environment: data.housingType === "apartment" ? "apartment" : "home",
      socialLevel: behaviorScore >= 7 ? "high" : behaviorScore >= 4 ? "medium" : "low",
      activityLevel: data.behaviorScores?.excitementLevel >= 3 ? "high" : data.behaviorScores?.excitementLevel >= 1 ? "medium" : "low",
      medicalHistory: data.healthHistory ? [data.healthHistory] : [],
      behavioralNotes: JSON.stringify({
        advancedEvaluation: true,
        guardianInfo: {
          petExperience: data.petExperience,
          trainingExperience: data.trainingExperience,
          absenceHours: data.absenceHours,
          adultCount: data.adultCount,
          childCount: data.childCount,
          trainingPreference: data.trainingPreference,
        },
        environmentInfo: {
          housingType: data.housingType,
          floorLevel: data.floorLevel,
          outdoorSpace: data.outdoorSpace,
          hasElevator: data.hasElevator,
          noiseSources: data.noiseSourcesArray,
        },
        healthEvaluation: {
          healthStatus: data.healthStatus,
          tactileSensitivity: data.tactileSensitivity,
          gaitPatterns: data.gaitPatterns,
          jointMobility: data.jointMobility,
          healthScore: healthScore,
        },
        behaviorEvaluation: {
          scores: data.behaviorScores,
          behaviorScore: behaviorScore,
          riskLevel: behaviorScore >= 7 ? "low" : behaviorScore >= 4 ? "medium" : "high",
        },
        problemBehavior: data.problemBehavior,
        uploadedFiles: {
          fileNames: data.uploadedFileNames || [],
          fileCount: data.uploadedFileCount || 0,
        },
      }),
    };

    const dogSubject = await storage.createDogSubject(dogSubjectData);
    res.status(201).json({
      ...dogSubject,
      healthScore,
      behaviorScore,
    });
  } catch (error) {
    console.error("Error creating advanced dog subject:", error);
    res.status(500).json({ error: "Failed to create advanced dog subject" });
  }
}

function calculateHealthScore(data: any): number {
  let score = 10;
  
  if (data.tactileSensitivity) {
    const { toes, ears, mouth } = data.tactileSensitivity;
    score -= (toes + ears + mouth) * 0.3;
  }
  
  if (data.gaitPatterns) {
    const gait = data.gaitPatterns;
    if (gait.walk !== "normal") score -= 1;
    if (gait.trot !== "normal") score -= 0.5;
    if (gait.canter !== "normal") score -= 0.5;
    if (gait.gallop !== "normal") score -= 0.5;
  }
  
  if (data.jointMobility) {
    const joint = data.jointMobility;
    if (joint.spineFlexibility !== "normal") score -= 1;
    if (!joint.shoulderNormal) score -= 0.5;
    if (!joint.elbowNormal) score -= 0.5;
    if (!joint.kneeNormal) score -= 0.5;
    if (!joint.ankleNormal) score -= 0.5;
  }
  
  return Math.max(1, Math.round(score * 10) / 10);
}

function calculateBehaviorScore(data: any): number {
  if (!data.behaviorScores) return 5;
  
  const scores = data.behaviorScores;
  const total = Object.values(scores).reduce((sum: number, val: any) => sum + (val || 0), 0);
  const maxTotal = 40;
  
  return Math.round((1 - total / maxTotal) * 10 * 10) / 10;
}

export async function getDogSubject(req: Request, res: Response) {
  try {
    if (!requireAuth(req, res)) return;
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid dog subject ID" });
    }

    const dogSubject = await storage.getDogSubject(id);
    if (!dogSubject) {
      return res.status(404).json({ error: "Dog subject not found" });
    }

    res.json(dogSubject);
  } catch (error) {
    console.error("Error fetching dog subject:", error);
    res.status(500).json({ error: "Failed to fetch dog subject" });
  }
}

export async function updateDogSubject(req: Request, res: Response) {
  try {
    if (!requireAuth(req, res)) return;
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid dog subject ID" });
    }

    const validationResult = insertDogSubjectSchema.partial().safeParse(req.body);
    if (!validationResult.success) {
      const validationError = fromError(validationResult.error);
      return res.status(400).json({ error: validationError.toString() });
    }

    const dogSubject = await storage.updateDogSubject(id, validationResult.data);
    res.json(dogSubject);
  } catch (error) {
    console.error("Error updating dog subject:", error);
    res.status(500).json({ error: "Failed to update dog subject" });
  }
}

export async function deleteDogSubject(req: Request, res: Response) {
  try {
    if (!requireAuth(req, res)) return;
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid dog subject ID" });
    }

    await storage.deleteDogSubject(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting dog subject:", error);
    res.status(500).json({ error: "Failed to delete dog subject" });
  }
}

// Researchers Routes
export async function getResearchers(req: Request, res: Response) {
  try {
    if (!requireAuth(req, res)) return;
    const researchers = await storage.getAllResearchers();
    res.json(researchers);
  } catch (error) {
    console.error("Error fetching researchers:", error);
    res.status(500).json({ error: "Failed to fetch researchers" });
  }
}

export async function createResearcher(req: Request, res: Response) {
  try {
    if (!requireAuth(req, res)) return;
    const validationResult = insertResearcherSchema.safeParse(req.body);
    if (!validationResult.success) {
      const validationError = fromError(validationResult.error);
      return res.status(400).json({ error: validationError.toString() });
    }

    const researcher = await storage.createResearcher(validationResult.data);
    res.status(201).json(researcher);
  } catch (error) {
    console.error("Error creating researcher:", error);
    res.status(500).json({ error: "Failed to create researcher" });
  }
}

// Research Sessions Routes
export async function getResearchSessions(req: Request, res: Response) {
  try {
    if (!requireAuth(req, res)) return;
    const sessions = await storage.getAllResearchSessions();
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching research sessions:", error);
    res.status(500).json({ error: "Failed to fetch research sessions" });
  }
}

export async function getResearchSessionsByDog(req: Request, res: Response) {
  try {
    if (!requireAuth(req, res)) return;
    const dogId = parseInt(req.params.dogId);
    if (isNaN(dogId)) {
      return res.status(400).json({ error: "Invalid dog ID" });
    }

    const sessions = await storage.getResearchSessionsByDog(dogId);
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching research sessions for dog:", error);
    res.status(500).json({ error: "Failed to fetch research sessions" });
  }
}

// Behavioral Analyses Routes
export async function getBehavioralAnalyses(req: Request, res: Response) {
  try {
    if (!requireAuth(req, res)) return;
    const dogId = req.query.dogId ? parseInt(req.query.dogId as string) : null;
    
    let analyses;
    if (dogId && !isNaN(dogId)) {
      analyses = await storage.getBehavioralAnalysesByDog(dogId);
    } else {
      analyses = await storage.getAllBehavioralAnalyses();
    }
    res.json(analyses);
  } catch (error) {
    console.error("Error fetching behavioral analyses:", error);
    res.status(500).json({ error: "Failed to fetch behavioral analyses" });
  }
}

export async function createBehavioralAnalysis(req: Request, res: Response) {
  try {
    if (!requireAuth(req, res)) return;
    const validationResult = insertBehavioralAnalysisSchema.safeParse(req.body);
    if (!validationResult.success) {
      const validationError = fromError(validationResult.error);
      return res.status(400).json({ error: validationError.toString() });
    }

    const analysis = await storage.createBehavioralAnalysis(validationResult.data);
    res.status(201).json(analysis);
  } catch (error) {
    console.error("Error creating behavioral analysis:", error);
    res.status(500).json({ error: "Failed to create behavioral analysis" });
  }
}

// Vocal Analyses Routes
export async function getVocalAnalyses(req: Request, res: Response) {
  try {
    if (!requireAuth(req, res)) return;
    const dogId = req.query.dogId ? parseInt(req.query.dogId as string) : null;
    
    let analyses;
    if (dogId && !isNaN(dogId)) {
      analyses = await storage.getVocalAnalysesByDog(dogId);
    } else {
      analyses = await storage.getAllVocalAnalyses();
    }
    res.json(analyses);
  } catch (error) {
    console.error("Error fetching vocal analyses:", error);
    res.status(500).json({ error: "Failed to fetch vocal analyses" });
  }
}

export async function createVocalAnalysis(req: Request, res: Response) {
  try {
    if (!requireAuth(req, res)) return;
    const validationResult = insertVocalAnalysisSchema.safeParse(req.body);
    if (!validationResult.success) {
      const validationError = fromError(validationResult.error);
      return res.status(400).json({ error: validationError.toString() });
    }

    const analysis = await storage.createVocalAnalysis(validationResult.data);
    res.status(201).json(analysis);
  } catch (error) {
    console.error("Error creating vocal analysis:", error);
    res.status(500).json({ error: "Failed to create vocal analysis" });
  }
}

// Statistics Routes
export async function getResearchStatistics(req: Request, res: Response) {
  try {
    if (!requireAuth(req, res)) return;
    const stats = await storage.getResearchStatistics();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching research statistics:", error);
    res.status(500).json({ error: "Failed to fetch research statistics" });
  }
}

// Admin Usage Statistics
export async function getAdminUsageStats(req: Request, res: Response) {
  try {
    if (!requireAuth(req, res)) return;
    const isAdmin = await isAdminUser(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "관리자 권한이 필요합니다" });
    }

    const stats = await storage.getResearchStatistics();
    const allUsers = await storage.getAllUsers();
    
    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUsers = allUsers.filter(u => {
      if (!u.createdAt) return false;
      return new Date(u.createdAt) >= sevenDaysAgo;
    });

    // Get user activity summary
    const approvedUsers = allUsers.filter(u => u.approvalStatus === 'approved');
    const pendingUsers = allUsers.filter(u => u.approvalStatus === 'pending');
    const rejectedUsers = allUsers.filter(u => u.approvalStatus === 'rejected');
    const adminUsers = allUsers.filter(u => u.role === 'admin');

    // Calculate daily registrations for the last 7 days
    const dailyRegistrations: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = allUsers.filter(u => {
        if (!u.createdAt) return false;
        return new Date(u.createdAt).toISOString().split('T')[0] === dateStr;
      }).length;
      dailyRegistrations.push({ date: dateStr, count });
    }

    res.json({
      users: {
        total: allUsers.length,
        approved: approvedUsers.length,
        pending: pendingUsers.length,
        rejected: rejectedUsers.length,
        admins: adminUsers.length,
        recentWeek: recentUsers.length,
      },
      research: {
        totalSubjects: stats.totalSubjects || 0,
        totalSessions: stats.totalSessions || 0,
        totalBehavioralAnalyses: stats.totalAnalyses || 0,
        totalVocalAnalyses: 0,
      },
      recentUsers: recentUsers.slice(0, 10).map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        approvalStatus: u.approvalStatus,
        createdAt: u.createdAt,
      })),
      dailyRegistrations,
    });
  } catch (error) {
    console.error("Error fetching admin usage stats:", error);
    res.status(500).json({ error: "Failed to fetch usage statistics" });
  }
}

// Admin Login Routes
const adminLoginSchema = z.object({
  username: z.string().min(3, "아이디는 3자 이상이어야 합니다"),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
});

export async function adminLogin(req: Request, res: Response) {
  try {
    const validationResult = adminLoginSchema.safeParse(req.body);
    if (!validationResult.success) {
      const validationError = fromError(validationResult.error);
      return res.status(400).json({ error: validationError.toString() });
    }

    const { username, password } = validationResult.data;
    
    // Find admin credential by username
    const credential = await storage.getAdminCredentialByUsername(username);
    if (!credential) {
      return res.status(401).json({ error: "아이디 또는 비밀번호가 일치하지 않습니다" });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, credential.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "아이디 또는 비밀번호가 일치하지 않습니다" });
    }
    
    // Get the associated user
    const user = await storage.getUser(credential.userId);
    if (!user) {
      return res.status(401).json({ error: "사용자를 찾을 수 없습니다" });
    }
    
    // Login the user by setting session with compatible format
    const sessionUser = {
      claims: {
        sub: user.id,
        email: user.email,
        first_name: user.firstName || 'Admin',
        last_name: user.lastName || username,
      },
      expires_at: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 1 week
    };
    
    (req as any).login(sessionUser, (err: any) => {
      if (err) {
        console.error("Admin login session error:", err);
        return res.status(500).json({ error: "로그인 처리 중 오류가 발생했습니다" });
      }
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        }
      });
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "로그인 처리 중 오류가 발생했습니다" });
  }
}

const adminRegisterSchema = z.object({
  username: z.string().min(3, "아이디는 3자 이상이어야 합니다"),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
  email: z.string().email("유효한 이메일을 입력해주세요").optional(),
  setupKey: z.string().optional(),
});

export async function adminRegister(req: Request, res: Response) {
  try {
    const validationResult = adminRegisterSchema.safeParse(req.body);
    if (!validationResult.success) {
      const validationError = fromError(validationResult.error);
      return res.status(400).json({ error: validationError.toString() });
    }

    const { username, password, email, setupKey } = validationResult.data;
    
    // Check if any admin exists (first admin doesn't need key)
    const existingCredential = await storage.getAdminCredentialByUsername(username);
    if (existingCredential) {
      return res.status(400).json({ error: "이미 존재하는 아이디입니다" });
    }
    
    // For security: require setupKey for additional admins or check if it's first admin
    // Require an existing admin to be logged in, or use a secret setup key from environment
    if (req.isAuthenticated && req.isAuthenticated()) {
      const isAdmin = await isAdminUser(req);
      if (!isAdmin) {
        return res.status(403).json({ error: "관리자만 새 관리자를 등록할 수 있습니다" });
      }
    } else {
      // Allow admin creation with a secret setup key (MUST be set in environment)
      const ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_KEY;
      if (!ADMIN_SETUP_KEY) {
        return res.status(403).json({ error: "관리자 등록이 비활성화되어 있습니다. 환경 변수 설정이 필요합니다." });
      }
      if (!setupKey || setupKey !== ADMIN_SETUP_KEY) {
        return res.status(403).json({ error: "관리자 등록 권한이 없습니다. 올바른 설정 키가 필요합니다." });
      }
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    
    // Create admin user
    const user = await storage.createAdminUser(username, passwordHash, email);
    
    res.status(201).json({ 
      success: true, 
      message: "관리자 계정이 생성되었습니다",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Admin register error:", error);
    res.status(500).json({ error: "관리자 등록 중 오류가 발생했습니다" });
  }
}

// Public user registration (unauthenticated)
const publicRegisterSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
  fullName: z.string().min(2, "이름은 2자 이상 입력해주세요"),
  phoneNumber: z.string().optional(),
  institution: z.string().optional(),
  researchFocus: z.string().optional(),
  purpose: z.string().min(10, "사용 목적을 10자 이상 입력해주세요"),
  experience: z.string().optional(),
});

export async function publicRegister(req: Request, res: Response) {
  try {
    const validationResult = publicRegisterSchema.safeParse(req.body);
    if (!validationResult.success) {
      const validationError = fromError(validationResult.error);
      return res.status(400).json({ error: validationError.toString() });
    }

    const { email, password, fullName, phoneNumber, institution, researchFocus, purpose, experience } = validationResult.data;
    
    // Check if email already exists
    const existingCredential = await storage.getUserCredentialByEmail(email);
    if (existingCredential) {
      return res.status(400).json({ error: "이미 등록된 이메일입니다" });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    
    // Create user with credentials and profile
    const user = await storage.createUserWithCredentials(
      email, 
      passwordHash, 
      fullName, 
      phoneNumber, 
      institution, 
      researchFocus, 
      purpose, 
      experience
    );
    
    res.status(201).json({ 
      success: true, 
      message: "회원가입이 완료되었습니다. 관리자 승인을 기다려주세요.",
      user: {
        id: user.id,
        email: user.email,
        fullName,
        approvalStatus: user.approvalStatus,
      }
    });
  } catch (error) {
    console.error("Public register error:", error);
    res.status(500).json({ error: "회원가입 처리 중 오류가 발생했습니다" });
  }
}

// User login (email/password)
const userLoginSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export async function userLogin(req: Request, res: Response) {
  try {
    const validationResult = userLoginSchema.safeParse(req.body);
    if (!validationResult.success) {
      const validationError = fromError(validationResult.error);
      return res.status(400).json({ error: validationError.toString() });
    }

    const { email, password } = validationResult.data;
    
    // Find user credential by email
    const credential = await storage.getUserCredentialByEmail(email);
    if (!credential) {
      return res.status(401).json({ error: "이메일 또는 비밀번호가 일치하지 않습니다" });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, credential.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "이메일 또는 비밀번호가 일치하지 않습니다" });
    }
    
    // Get the associated user
    const user = await storage.getUser(credential.userId);
    if (!user) {
      return res.status(401).json({ error: "사용자를 찾을 수 없습니다" });
    }

    // Check approval status
    if (user.approvalStatus === 'pending') {
      return res.status(403).json({ 
        error: "관리자 승인 대기 중입니다",
        approvalStatus: 'pending'
      });
    }
    
    if (user.approvalStatus === 'rejected') {
      return res.status(403).json({ 
        error: "가입이 거절되었습니다. 관리자에게 문의해주세요.",
        approvalStatus: 'rejected'
      });
    }
    
    // Login the user by setting session
    const sessionUser = {
      claims: {
        sub: user.id,
        email: user.email,
        first_name: user.firstName || '',
        last_name: user.lastName || '',
      },
      expires_at: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 1 week
    };
    
    (req as any).login(sessionUser, (err: any) => {
      if (err) {
        console.error("User login session error:", err);
        return res.status(500).json({ error: "로그인 처리 중 오류가 발생했습니다" });
      }
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          approvalStatus: user.approvalStatus,
        }
      });
    });
  } catch (error) {
    console.error("User login error:", error);
    res.status(500).json({ error: "로그인 처리 중 오류가 발생했습니다" });
  }
}

export async function registerRoutes(app: Express) {
  const server = createServer(app);

  // Setup auth (must be before other routes)
  const { setupAuth, registerAuthRoutes } = await import("./replit_integrations/auth");
  await setupAuth(app);
  registerAuthRoutes(app);

  // Prefill routes (unauthenticated)
  app.post("/api/auth/prefill", savePrefillData);
  app.get("/api/auth/prefill", getPrefillData);

  // Public registration (unauthenticated) - email/password signup
  app.post("/api/public/register", publicRegister);
  app.post("/api/public/login", userLogin);

  // User Registration and Profile routes (for social login users)
  app.post("/api/auth/register", registerUserProfile);
  app.get("/api/auth/profile", getUserProfile);

  // Admin login routes (unauthenticated)
  app.post("/api/admin/login", adminLogin);
  app.post("/api/admin/register", adminRegister);

  // Admin routes
  app.get("/api/admin/pending-users", getPendingUsers);
  app.get("/api/admin/users", getAllUsersAdmin);
  app.get("/api/admin/usage-stats", getAdminUsageStats);
  app.patch("/api/admin/users/:userId/approve", approveUser);
  app.patch("/api/admin/users/:userId/reject", rejectUser);
  app.patch("/api/admin/users/:userId/role", setUserRole);

  // Research API routes
  app.get("/api/research/dog-subjects", getDogSubjects);
  app.post("/api/research/dog-subjects", createDogSubject);
  app.post("/api/research/dog-subjects/advanced", createAdvancedDogSubject);
  app.get("/api/research/dog-subjects/:id", getDogSubject);
  app.put("/api/research/dog-subjects/:id", updateDogSubject);
  app.delete("/api/research/dog-subjects/:id", deleteDogSubject);

  app.get("/api/research/researchers", getResearchers);
  app.post("/api/research/researchers", createResearcher);

  app.get("/api/research/sessions", getResearchSessions);
  app.get("/api/research/sessions/dog/:dogId", getResearchSessionsByDog);

  app.get("/api/research/behavioral-analyses", getBehavioralAnalyses);
  app.post("/api/research/behavioral-analyses", createBehavioralAnalysis);

  app.get("/api/research/vocal-analyses", getVocalAnalyses);
  app.post("/api/research/vocal-analyses", createVocalAnalysis);

  app.get("/api/research/statistics", getResearchStatistics);

  // AI Analysis Routes
  const aiAnalysisRoutes = await import("./routes/ai-analysis");
  app.use("/api/ai-analysis", aiAnalysisRoutes.default);

  // Comprehensive Report Routes
  const comprehensiveReportRoutes = await import("./routes/comprehensive-report");
  app.use("/api/comprehensive-report", comprehensiveReportRoutes.default);

  return server;
}