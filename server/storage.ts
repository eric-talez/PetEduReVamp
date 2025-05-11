import { users, type User, type InsertUser, type UserRole } from "@shared/schema";

export interface IStorage {
  // 사용자 관련
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(userId: number, role: UserRole, trainerId?: number): Promise<User>;
  
  // 기관 관련
  getInstituteByCode(code: string): Promise<any>;
  getInstitute(id: number): Promise<any>;
  getAllInstitutes(): Promise<any[]>;
  
  // 훈련사 관련
  getTrainer(id: number): Promise<any>;
  getAllTrainers(): Promise<any[]>;
  
  // 반려동물 관련
  getPet(id: number): Promise<any>;
  getPetsByUserId(userId: number): Promise<any[]>;
  createPet(pet: any): Promise<any>;
  
  // 강좌 관련
  getCourse(id: number): Promise<any>;
  getAllCourses(): Promise<any[]>;
  getCoursesByUserId(userId: number): Promise<any[]>;
  createCourse(course: any): Promise<any>;
  enrollUserInCourse(userId: number, courseId: number): Promise<any>;
  
  // 수수료 정책 관련
  getCommissionPolicies(): Promise<any[]>;
  getCommissionPolicy(id: number): Promise<any | undefined>;
  createCommissionPolicy(policy: any): Promise<any>;
  updateCommissionPolicy(id: number, data: any): Promise<any>;
  
  // 수수료 거래 관련
  getCommissionTransactions(): Promise<any[]>;
  getCommissionTransaction(id: number): Promise<any | undefined>;
  createCommissionTransaction(transaction: any): Promise<any>;
  updateCommissionTransaction(id: number, data: any): Promise<any>;
  
  // 정산 보고서 관련
  getSettlementReports(): Promise<any[]>;
  getSettlementReport(id: number): Promise<any | undefined>;
  createSettlementReport(report: any): Promise<any>;
  updateSettlementReport(id: number, data: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private commissionPolicies: Map<number, any>;
  private commissionTransactions: Map<number, any>;
  private settlementReports: Map<number, any>;
  private commissionTiers: Map<number, any>;
  private pets: Map<number, any>;
  private courses: Map<number, any>;
  private institutes: Map<number, any>;
  private trainers: Map<number, any>;
  private enrollments: Map<number, any>;
  
  currentId: number;
  private policyId: number;
  private transactionId: number;
  private reportId: number;
  private tierId: number;
  private petId: number;
  private courseId: number;
  private instituteId: number;
  private trainerId: number;
  private enrollmentId: number;

  constructor() {
    this.users = new Map();
    this.commissionPolicies = new Map();
    this.commissionTransactions = new Map();
    this.settlementReports = new Map();
    this.commissionTiers = new Map();
    this.pets = new Map();
    this.courses = new Map();
    this.institutes = new Map();
    this.trainers = new Map();
    this.enrollments = new Map();
    
    this.currentId = 1;
    this.policyId = 1;
    this.transactionId = 1;
    this.reportId = 1;
    this.tierId = 1;
    this.petId = 1;
    this.courseId = 1;
    this.instituteId = 1;
    this.trainerId = 1;
    this.enrollmentId = 1;
    
    // 샘플 데이터 초기화
    this.initSampleData();
  }
  
  // 샘플 데이터 초기화
  private initSampleData() {
    // 수수료 정책 샘플 데이터
    const trainerPolicy = {
      id: this.policyId++,
      name: '훈련사 수수료 정책',
      type: 'trainer',
      baseRate: 10, // 기본 수수료율 10%
      status: 'active',
      description: '훈련사에게 적용되는 기본 수수료 정책입니다.',
      createdAt: new Date(),
      updatedAt: new Date(),
      tiers: [] as any[]
    };
    
    // 수수료 티어 추가
    const tier1 = {
      id: this.tierId++,
      policyId: trainerPolicy.id,
      name: '기본 등급',
      minSales: 0,
      rate: 10
    };
    
    const tier2 = {
      id: this.tierId++,
      policyId: trainerPolicy.id,
      name: '실버 등급',
      minSales: 1000000,
      rate: 15
    };
    
    const tier3 = {
      id: this.tierId++,
      policyId: trainerPolicy.id,
      name: '골드 등급',
      minSales: 5000000,
      rate: 20
    };
    
    trainerPolicy.tiers = [tier1, tier2, tier3];
    this.commissionPolicies.set(trainerPolicy.id, trainerPolicy);
    this.commissionTiers.set(tier1.id, tier1);
    this.commissionTiers.set(tier2.id, tier2);
    this.commissionTiers.set(tier3.id, tier3);
    
    // 기관 수수료 정책
    const institutePolicy = {
      id: this.policyId++,
      name: '기관 수수료 정책',
      type: 'institute',
      baseRate: 8, // 기본 수수료율 8%
      status: 'active',
      description: '교육 기관에 적용되는 기본 수수료 정책입니다.',
      createdAt: new Date(),
      updatedAt: new Date(),
      tiers: [] as any[]
    };
    
    // 수수료 티어 추가
    const instituteTier1 = {
      id: this.tierId++,
      policyId: institutePolicy.id,
      name: '기본 등급',
      minSales: 0,
      rate: 8
    };
    
    const instituteTier2 = {
      id: this.tierId++,
      policyId: institutePolicy.id,
      name: '프리미엄 등급',
      minSales: 10000000,
      rate: 12
    };
    
    institutePolicy.tiers = [instituteTier1, instituteTier2];
    this.commissionPolicies.set(institutePolicy.id, institutePolicy);
    this.commissionTiers.set(instituteTier1.id, instituteTier1);
    this.commissionTiers.set(instituteTier2.id, instituteTier2);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    
    // 필수 기본값 설정
    const user: User = { 
      ...insertUser, 
      id, 
      role: 'user', // 기본 역할
      avatar: insertUser.avatar || null,
      bio: insertUser.bio || null,
      location: insertUser.location || null,
      specialty: insertUser.specialty || null,
      isVerified: insertUser.isVerified || false,
      instituteId: null,
      createdAt: new Date()
    };
    
    this.users.set(id, user);
    return user;
  }

  // Temporary implementation for institute code lookup
  async getInstituteByCode(code: string): Promise<any> {
    // Mock implementation until proper database is connected
    if (code === "PETEDU") {
      return {
        id: 1,
        name: "PetEdu Institute",
        code: "PETEDU",
        description: "Main pet training institute"
      };
    }
    return null;
  }

  async updateUserRole(userId: number, role: UserRole, trainerId?: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    // 사용자 업데이트 시 타입 보존
    const updatedUser: User = { 
      ...user, 
      role  // UserRole 타입 사용
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // 기관 관련 메서드
  async getInstitute(id: number): Promise<any> {
    return this.institutes.get(id);
  }
  
  async getAllInstitutes(): Promise<any[]> {
    return Array.from(this.institutes.values());
  }
  
  // 훈련사 관련 메서드
  async getTrainer(id: number): Promise<any> {
    return this.trainers.get(id);
  }
  
  async getAllTrainers(): Promise<any[]> {
    return Array.from(this.trainers.values());
  }
  
  // 반려동물 관련 메서드
  async getPet(id: number): Promise<any> {
    return this.pets.get(id);
  }
  
  async getPetsByUserId(userId: number): Promise<any[]> {
    return Array.from(this.pets.values()).filter(pet => pet.userId === userId);
  }
  
  async createPet(pet: any): Promise<any> {
    const id = this.petId++;
    const newPet = { ...pet, id, createdAt: new Date(), updatedAt: new Date() };
    this.pets.set(id, newPet);
    return newPet;
  }
  
  // 강좌 관련 메서드
  async getCourse(id: number): Promise<any> {
    return this.courses.get(id);
  }
  
  async getAllCourses(): Promise<any[]> {
    return Array.from(this.courses.values());
  }
  
  async getCoursesByUserId(userId: number): Promise<any[]> {
    // 사용자가 등록한 강좌 찾기
    const userEnrollments = Array.from(this.enrollments.values())
      .filter(enrollment => enrollment.userId === userId);
    
    // 등록된 강좌 ID 목록
    const enrolledCourseIds = userEnrollments.map(enrollment => enrollment.courseId);
    
    // 해당 강좌들 반환
    return Array.from(this.courses.values())
      .filter(course => enrolledCourseIds.includes(course.id));
  }
  
  async createCourse(course: any): Promise<any> {
    const id = this.courseId++;
    const newCourse = { ...course, id, createdAt: new Date(), updatedAt: new Date() };
    this.courses.set(id, newCourse);
    return newCourse;
  }
  
  async enrollUserInCourse(userId: number, courseId: number): Promise<any> {
    // 사용자와 강좌 존재 확인
    const user = await this.getUser(userId);
    const course = await this.getCourse(courseId);
    
    if (!user) {
      throw new Error("User not found");
    }
    if (!course) {
      throw new Error("Course not found");
    }
    
    // 등록 생성
    const id = this.enrollmentId++;
    const enrollment = {
      id,
      userId,
      courseId,
      progress: 0,
      status: 'inProgress',
      startDate: new Date(),
      completed: false,
      certificateIssued: false
    };
    
    this.enrollments.set(id, enrollment);
    return enrollment;
  }

  // 수수료 정책 관련 메서드
  async getCommissionPolicies(): Promise<any[]> {
    return Array.from(this.commissionPolicies.values());
  }
  
  async getCommissionPolicy(id: number): Promise<any | undefined> {
    return this.commissionPolicies.get(id);
  }
  
  async createCommissionPolicy(policy: any): Promise<any> {
    const id = this.policyId++;
    const newPolicy = { ...policy, id, createdAt: new Date(), updatedAt: new Date() };
    this.commissionPolicies.set(id, newPolicy);
    return newPolicy;
  }
  
  async updateCommissionPolicy(id: number, data: any): Promise<any> {
    const policy = this.commissionPolicies.get(id);
    if (!policy) {
      throw new Error("수수료 정책을 찾을 수 없습니다");
    }
    
    const updatedPolicy = { ...policy, ...data, updatedAt: new Date() };
    this.commissionPolicies.set(id, updatedPolicy);
    return updatedPolicy;
  }
  
  // 수수료 거래 관련 메서드
  async getCommissionTransactions(): Promise<any[]> {
    return Array.from(this.commissionTransactions.values());
  }
  
  async getCommissionTransaction(id: number): Promise<any | undefined> {
    return this.commissionTransactions.get(id);
  }
  
  async createCommissionTransaction(transaction: any): Promise<any> {
    const id = this.transactionId++;
    const newTransaction = { ...transaction, id, createdAt: new Date() };
    this.commissionTransactions.set(id, newTransaction);
    return newTransaction;
  }
  
  async updateCommissionTransaction(id: number, data: any): Promise<any> {
    const transaction = this.commissionTransactions.get(id);
    if (!transaction) {
      throw new Error("수수료 거래를 찾을 수 없습니다");
    }
    
    const updatedTransaction = { ...transaction, ...data };
    this.commissionTransactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
  
  // 정산 보고서 관련 메서드
  async getSettlementReports(): Promise<any[]> {
    return Array.from(this.settlementReports.values());
  }
  
  async getSettlementReport(id: number): Promise<any | undefined> {
    return this.settlementReports.get(id);
  }
  
  async createSettlementReport(report: any): Promise<any> {
    const id = this.reportId++;
    const newReport = { ...report, id, createdAt: new Date() };
    this.settlementReports.set(id, newReport);
    return newReport;
  }
  
  async updateSettlementReport(id: number, data: any): Promise<any> {
    const report = this.settlementReports.get(id);
    if (!report) {
      throw new Error("정산 보고서를 찾을 수 없습니다");
    }
    
    const updatedReport = { ...report, ...data, updatedAt: new Date() };
    this.settlementReports.set(id, updatedReport);
    return updatedReport;
  }
}

export const storage = new MemStorage();