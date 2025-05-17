import { users, type User, type InsertUser, type UserRole } from "@shared/schema";

// 프로필 업데이트를 위한 인터페이스
export interface ProfileUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  location?: string; 
  avatar?: string;
}

export interface IStorage {
  // 사용자 관련
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByCi(ci: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(userId: number, role: UserRole, trainerId?: number): Promise<User>;
  updateUserProfile(userId: number, profileData: ProfileUpdateData): Promise<User>;
  updateUserVerification(userId: number, verificationData: {
    ci: string;
    verified: boolean;
    verifiedAt: Date;
    verificationName?: string;
    verificationBirth?: string;
    verificationPhone?: string;
  }): Promise<User>;
  
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
  private userCiMap: Map<string, number>; // CI 값으로 사용자 ID를 찾기 위한 맵
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
    this.userCiMap = new Map(); // CI 맵 초기화
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
    
    // 트레이너 샘플 데이터
    const trainer1 = {
      id: this.trainerId++,
      name: "김훈련",
      email: "trainer1@example.com",
      specialty: "반려견 기본 훈련",
      experience: 5,
      bio: "5년 경력의 전문 반려견 훈련사입니다.",
      status: "active",
      image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      certifications: ["KKF 공인 훈련사", "국제 반려동물 관리사"],
      location: "서울 강남구",
      rating: 4.9,
      reviewCount: 128
    };
    
    const trainer2 = {
      id: this.trainerId++,
      name: "이교육",
      email: "trainer2@example.com",
      specialty: "고양이 행동 교정",
      experience: 3,
      bio: "고양이 행동 전문가입니다.",
      status: "active",
      image: "https://images.unsplash.com/photo-1548535537-3cfaf1fc327c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      certifications: ["반려동물행동교정사", "고양이 전문 행동 상담사"],
      location: "서울 서초구",
      rating: 4.7,
      reviewCount: 86
    };
    
    this.trainers.set(trainer1.id, trainer1);
    this.trainers.set(trainer2.id, trainer2);
    
    // 기관 샘플 데이터
    const institute1 = {
      id: this.instituteId++,
      name: "행복한 펫 아카데미",
      code: "HAPPY",
      address: "서울시 강남구 역삼동 123",
      email: "happy@petacademy.com",
      phone: "02-1234-5678",
      status: "active",
      description: "반려동물 교육 전문 기관입니다."
    };
    
    const institute2 = {
      id: this.instituteId++,
      name: "스마트 펫 스쿨",
      code: "SMART",
      address: "서울시 서초구 서초동 456",
      email: "info@smartpet.com",
      phone: "02-9876-5432",
      status: "active",
      description: "최신 교육 방법론을 적용한 반려동물 교육 기관입니다."
    };
    
    this.institutes.set(institute1.id, institute1);
    this.institutes.set(institute2.id, institute2);
    
    // 수수료 거래 샘플 데이터
    const transaction1 = {
      id: this.transactionId++,
      type: "trainer",
      referenceId: trainer1.id,
      amount: 125000,
      commissionAmount: 12500,
      status: "completed",
      orderDetails: {
        productId: 101,
        productName: "프리미엄 강아지 사료",
        quantity: 5,
        unitPrice: 25000
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7일 전
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    };
    
    const transaction2 = {
      id: this.transactionId++,
      type: "institute",
      referenceId: institute1.id,
      amount: 200000,
      commissionAmount: 16000,
      status: "completed",
      orderDetails: {
        productId: 202,
        productName: "반려동물 행동 교정 키트",
        quantity: 2,
        unitPrice: 100000
      },
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5일 전
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    };
    
    const transaction3 = {
      id: this.transactionId++,
      type: "trainer",
      referenceId: trainer2.id,
      amount: 85000,
      commissionAmount: 8500,
      status: "completed",
      orderDetails: {
        productId: 303,
        productName: "고양이 장난감 세트",
        quantity: 1,
        unitPrice: 85000
      },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    };
    
    this.commissionTransactions.set(transaction1.id, transaction1);
    this.commissionTransactions.set(transaction2.id, transaction2);
    this.commissionTransactions.set(transaction3.id, transaction3);
    
    // 정산 보고서 샘플 데이터
    const settlementReport1 = {
      id: this.reportId++,
      type: "trainer",
      referenceId: trainer1.id,
      period: "2025-04",
      totalSales: 450000,
      totalCommission: 45000,
      transactionCount: 18,
      status: "completed",
      paymentDate: new Date(2025, 4, 5), // 2025년 5월 5일
      createdAt: new Date(2025, 4, 1),
      updatedAt: new Date(2025, 4, 5)
    };
    
    const settlementReport2 = {
      id: this.reportId++,
      type: "institute",
      referenceId: institute1.id,
      period: "2025-04",
      totalSales: 1250000,
      totalCommission: 100000,
      transactionCount: 25,
      status: "pending",
      createdAt: new Date(2025, 4, 1),
      updatedAt: new Date(2025, 4, 1)
    };
    
    this.settlementReports.set(settlementReport1.id, settlementReport1);
    this.settlementReports.set(settlementReport2.id, settlementReport2);
    
    // 강좌 샘플 데이터
    const course1 = {
      id: this.courseId++,
      title: "반려견 기본 훈련 과정",
      description: "반려견의 기본 훈련과 사회화에 대해 배우는 과정입니다.",
      category: "반려견 훈련",
      level: "입문",
      price: 150000,
      duration: "4주",
      image: "https://example.com/images/dog-training.jpg",
      trainerId: trainer1.id,
      instituteId: institute1.id,
      isPopular: true,
      isCertified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const course2 = {
      id: this.courseId++,
      title: "고양이 행동 교정 마스터",
      description: "문제 행동을 보이는 고양이의 행동을 이해하고 교정하는 방법을 배웁니다.",
      category: "고양이 훈련",
      level: "중급",
      price: 180000,
      duration: "6주",
      image: "https://example.com/images/cat-behavior.jpg",
      trainerId: trainer2.id,
      instituteId: institute2.id,
      isPopular: false,
      isCertified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.courses.set(course1.id, course1);
    this.courses.set(course2.id, course2);
    
    // 사용자 샘플 데이터
    const user1 = {
      id: this.currentId++,
      username: "petowner1",
      email: "petowner1@example.com",
      password: "password123",
      name: "김반려",
      role: "pet-owner" as UserRole,
      avatar: null,
      bio: "반려견을 사랑하는 견주입니다.",
      location: "서울시 강남구",
      specialty: null,
      isVerified: true,
      instituteId: null,
      createdAt: new Date()
    };
    
    const user2 = {
      id: this.currentId++,
      username: "petowner2",
      email: "petowner2@example.com",
      password: "password123",
      name: "이고양",
      role: "pet-owner" as UserRole,
      avatar: null,
      bio: "고양이 2마리를 키우고 있습니다.",
      location: "서울시 서초구",
      specialty: null,
      isVerified: true,
      instituteId: null,
      createdAt: new Date()
    };
    
    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    
    // 등록 샘플 데이터
    const enrollment1 = {
      id: this.enrollmentId++,
      userId: user1.id,
      courseId: course1.id,
      progress: 25,
      status: 'inProgress',
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2주 전
      completed: false,
      certificateIssued: false
    };
    
    this.enrollments.set(enrollment1.id, enrollment1);
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

  async getInstituteByCode(code: string): Promise<any> {
    return Array.from(this.institutes.values()).find(
      (institute) => institute.code === code
    );
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
  
  async updateUserProfile(userId: number, profileData: ProfileUpdateData): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // 수정할 필드만 업데이트
    const updatedUser: User = {
      ...user,
      name: profileData.name !== undefined ? profileData.name : user.name,
      email: profileData.email !== undefined ? profileData.email : user.email,
      bio: profileData.bio !== undefined ? profileData.bio : user.bio,
      location: profileData.location !== undefined ? profileData.location : user.location,
      avatar: profileData.avatar !== undefined ? profileData.avatar : user.avatar
    };
    
    // phone이 User 인터페이스에 없으므로 별도로 처리 (실제 구현에서는 스키마에 추가 필요)
    if (profileData.phone !== undefined) {
      (updatedUser as any).phone = profileData.phone;
    }
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // 본인인증 관련 메서드
  async getUserByCi(ci: string): Promise<User | undefined> {
    const userId = this.userCiMap.get(ci);
    if (userId) {
      return this.users.get(userId);
    }
    return undefined;
  }

  async updateUserVerification(userId: number, verificationData: {
    ci: string;
    verified: boolean;
    verifiedAt: Date;
    verificationName?: string;
    verificationBirth?: string;
    verificationPhone?: string;
  }): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // 기존 CI 매핑이 있다면 제거 (사용자가 CI를 변경하는 경우)
    if ((user as any).ci) {
      this.userCiMap.delete((user as any).ci);
    }
    
    // 새 CI 매핑 추가
    this.userCiMap.set(verificationData.ci, userId);
    
    // 사용자 정보 업데이트
    const updatedUser: User = {
      ...user,
      isVerified: verificationData.verified
    };
    
    // User 인터페이스에 직접 포함되지 않은 필드들 처리
    (updatedUser as any).ci = verificationData.ci;
    (updatedUser as any).verifiedAt = verificationData.verifiedAt;
    
    if (verificationData.verificationName) {
      (updatedUser as any).verificationName = verificationData.verificationName;
    }
    
    if (verificationData.verificationBirth) {
      (updatedUser as any).verificationBirth = verificationData.verificationBirth;
    }
    
    if (verificationData.verificationPhone) {
      (updatedUser as any).verificationPhone = verificationData.verificationPhone;
    }
    
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