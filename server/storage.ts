import { 
  users, type User, type InsertUser, type UserRole,
  events, type Event, type InsertEvent, 
  eventLocations, type EventLocation, type InsertEventLocation, 
  eventAttendances, type EventAttendance,
  courses, type Course, type InsertCourse,
  institutes, trainers, pets, vaccinations, checkups,
  commissionPolicies, commissionTransactions, settlementReports,
  shopCategories, products, cartItems,
  banners, type Banner, type InsertBanner
} from "@shared/schema";

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
  getUserBySocialId(provider: string, socialId: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
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
  getPetById(id: number): Promise<any>;
  getPetsByUserId(userId: number): Promise<any[]>;
  createPet(pet: any): Promise<any>;
  updatePet(id: number, pet: any): Promise<any>;
  deletePet(id: number): Promise<boolean>;

  // 강좌 관련
  getCourse(id: number): Promise<any>;
  getAllCourses(): Promise<any[]>;
  getCoursesByUserId(userId: number): Promise<any[]>;
  createCourse(course: any): Promise<any>;
  enrollUserInCourse(userId: number, courseId: number): Promise<any>;

  // 이벤트 관련
  getAllEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  getEventsByRegion(region: string): Promise<Event[]>;
  getEventsByCategory(category: string): Promise<Event[]>;
  checkEventAttendance(userId: number, eventId: number): Promise<boolean>;
  attendEvent(userId: number, eventId: number): Promise<EventAttendance>;
  getEventLocation(id: number): Promise<EventLocation | undefined>;
  createEventLocation(location: InsertEventLocation): Promise<EventLocation>;

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

  // Shop 관련
  getAllProducts(): Promise<any[]>;
  getProduct(id: number): Promise<any | undefined>;
  createProduct(product: any): Promise<any>;
  updateProduct(id: number, data: any): Promise<any>;
  getProductsByCategory(categoryId: number): Promise<any[]>;
  getAllShopCategories(): Promise<any[]>;
  getShopCategory(id: number): Promise<any | undefined>;
  createShopCategory(category: any): Promise<any>;
  getCartItems(userId: number): Promise<any[]>;
  addToCart(userId: number, productId: number, quantity: number, options?: any): Promise<any>;
  updateCartItem(id: number, quantity: number): Promise<any>;
  removeFromCart(id: number): Promise<boolean>;

  // Banner 관련
  getActiveBanners(type: string, position: string): Promise<Banner[]>;
  getAllBanners(): Promise<Banner[]>;
  createBanner(banner: InsertBanner & { createdBy: number }): Promise<Banner>;
  updateBanner(id: number, data: Partial<InsertBanner>): Promise<Banner | undefined>;
  deleteBanner(id: number): Promise<boolean>;
}

// 메모리 기반 데이터 저장소 (운영 환경용)
// 실제 운영에서는 데이터베이스를 사용하되, 초기 데이터용 임시 저장소

export class MemoryStorage implements IStorage{
  private users = new Map();
  private pets = new Map();
  private courses = new Map();
  private institutes = new Map();
  private trainers = new Map();
  private enrollments = new Map();
  private events = new Map();
  private eventLocations = new Map();
  private products = new Map();
  private cartItems = new Map();
  private notifications = new Map();
  private conversations = new Map();
  private messages = new Map();
  private checkups = new Map();
  private commissionPolicies = new Map();
  private commissionTiers = new Map();
  private commissionTransactions = new Map();
  private settlementReports = new Map();

  // ID 카운터들
  private userId = 1;
  private petId = 1;
  private courseId = 1;
  private instituteId = 1;
  private trainerId = 1;
  private enrollmentId = 1;
  private eventId = 1;
  private eventLocationId = 1;
  private productId = 1;
  private cartItemId = 1;
  private notificationId = 1;
  private conversationId = 1;
  private messageId = 1;
  private checkupId = 1;
  private policyId = 1;
  private tierId = 1;
  private transactionId = 1;
  private reportId = 1;

  constructor() {
    console.log('🔄 운영 환경용 메모리 저장소 초기화...');
    this.initProductionSampleData();
  }

  // 운영 환경용 최소 샘플 데이터 초기화
  private initProductionSampleData() {
    // 기본 관리자 계정만 생성
    const adminUser = {
      id: this.userId++,
      username: 'admin',
      email: 'admin@talez.co.kr',
      name: '시스템 관리자',
      role: 'admin',
      password: 'hashed_password_here', // 실제 운영시 변경 필요
      avatar: '/images/admin-avatar.png',
      createdAt: new Date(),
      isVerified: true,
      instituteId: null,
      ci: null,
      verified: false,
      verifiedAt: null,
      verificationName: null,
      verificationBirth: null,
      verificationPhone: null,
      provider: null,
      socialId: null
    };

    this.users.set(adminUser.id, adminUser);

    // 기본 기관 생성
    const defaultInstitute = {
      id: this.instituteId++,
      name: '테일즈 본사',
      code: 'TALEZ_HQ',
      address: '서울시 강남구',
      phone: '02-1234-5678',
      email: 'contact@talez.co.kr',
      description: '테일즈 서비스 본사',
      isActive: true,
      createdAt: new Date()
    };

    this.institutes.set(defaultInstitute.id, defaultInstitute);

    // 기본 수수료 정책
    const defaultPolicy = {
      id: this.policyId++,
      name: '기본 수수료 정책',
      type: 'default',
      baseRate: 10,
      status: 'active',
      description: '표준 수수료 정책입니다.',
      createdAt: new Date(),
      updatedAt: new Date(),
      tiers: []
    };

    this.commissionPolicies.set(defaultPolicy.id, defaultPolicy);

    // 기본 상품 (샘플)
    const sampleProduct = {
      id: this.productId++,
      name: '프리미엄 반려동물 사료',
      description: '영양 균형이 잡힌 프리미엄 사료입니다.',
      price: 50000,
      category: '사료',
      image: '/images/sample-food.jpg',
      inStock: true,
      rating: 4.5,
      reviewCount: 1,
      isActive: true,
      createdAt: new Date()
    };

    this.products.set(sampleProduct.id, sampleProduct);

    console.log('✅ 운영 환경용 샘플 데이터 초기화 완료');
    console.log(`   - 관리자 계정: ${this.users.size}개`);
    console.log(`   - 기관: ${this.institutes.size}개`);
    console.log(`   - 수수료 정책: ${this.commissionPolicies.size}개`);
    console.log(`   - 상품: ${this.products.size}개`);
  }

  // Getter 메서드들
  getUsers() { return Array.from(this.users.values()); }
  getPets() { return Array.from(this.pets.values()); }
  getCourses() { return Array.from(this.courses.values()); }
  getInstitutes() { return Array.from(this.institutes.values()); }
  getTrainers() { return Array.from(this.trainers.values()); }
  getProducts() { return Array.from(this.products.values()); }
  getNotifications() { return Array.from(this.notifications.values()); }
  getConversations() { return Array.from(this.conversations.values()); }
  getMessages() { return Array.from(this.messages.values()); }
  getCommissionPolicies() { return Array.from(this.commissionPolicies.values()); }
  getCommissionTransactions() { return Array.from(this.commissionTransactions.values()); }

  // 특정 데이터 조회
  getUserById(id: number) { return this.users.get(id); }
  getPetById(id: number) { return this.pets.get(id); }
  getCourseById(id: number) { return this.courses.get(id); }
  getInstituteById(id: number) { return this.institutes.get(id); }
  getProductById(id: number) { return this.products.get(id); }

  // 사용자 관련 메서드
  getUserByEmail(email: string) {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  createUser(userData: any) {
    const user = {
      id: this.userId++,
      ...userData,
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  // 데이터 초기화 메서드 (운영 환경에서 필요시 사용)
  clearAllData() {
    this.users.clear();
    this.pets.clear();
    this.courses.clear();
    this.institutes.clear();
    this.trainers.clear();
    this.products.clear();
    console.log('🧹 모든 메모리 데이터가 초기화되었습니다.');
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getAllPets(): Promise<any[]> {
    return Array.from(this.pets.values());
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
    const userId = this.users.get(ci);
    if (userId) {
      return this.users.get(userId);
    }
    return undefined;
  }

  async getUserBySocialId(provider: string, socialId: string): Promise<User | undefined> {
    const userId = this.users.get(`${provider}:${socialId}`);
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
    // 새 CI 매핑 추가
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

    async createEventLocation(location: InsertEventLocation): Promise<EventLocation> {
        const newLocation: EventLocation = {
            ...location,
            id: this.eventLocationId++,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.eventLocations.set(newLocation.id, newLocation);
        return newLocation;
    }
    async getEventLocation(id: number): Promise<EventLocation | undefined> {
        return this.eventLocations.get(id);
    }
  async createEvent(event: InsertEvent): Promise<Event> {
      const newEvent: Event = {
          ...event,
          id: this.eventId++,
          attendees: 0,
          maxAttendees: event.maxAttendees !== undefined ? event.maxAttendees : null,
          image: event.image || null,
          price: typeof event.price === 'number' || event.price === '무료'
              ? event.price
              : '무료',
          createdAt: new Date(),
          updatedAt: new Date()
      };
      this.events.set(newEvent.id, newEvent);
      return newEvent;
  }
  async getEvent(id: number): Promise<Event | undefined> {
        return this.events.get(id);
  }
  async getAllEvents(): Promise<Event[]> {
        return Array.from(this.events.values());
  }
  async createCommissionPolicy(policy: any): Promise<any> {
        const id = this.policyId++;
        const newPolicy = { ...policy, id, createdAt: new Date(), updatedAt: new Date() };
        this.commissionPolicies.set(id, newPolicy);
        return newPolicy;
  }
  async getCommissionPolicy(id: number): Promise<any | undefined> {
        return this.commissionPolicies.get(id);
  }
  async getCommissionPolicies(): Promise<any[]> {
        return Array.from(this.commissionPolicies.values());
  }
  async enrollUserInCourse(userId: number, courseId: number): Promise<any> {
       const user = this.getUserById(userId);
       const course = this.getCourseById(courseId);
        if (!user) {
            throw new Error("User not found");
        }
        if (!course) {
            throw new Error("Course not found");
        }
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
  async createCourse(course: any): Promise<any> {
        const id = this.courseId++;
        const newCourse = { ...course, id, createdAt: new Date(), updatedAt: new Date() };
        this.courses.set(id, newCourse);
        return newCourse;
  }
    async getCourse(id: number): Promise<any> {
        return this.courses.get(id);
    }

  async getAllCourses(): Promise<any[]> {
        return Array.from(this.courses.values());
  }
    async createPet(pet: any): Promise<any> {
        const id = this.petId++;
        const newPet = { ...pet, id, createdAt: new Date(), updatedAt: new Date() };
        this.pets.set(id, newPet);
        return newPet;
    }
    async getAllInstitutes(): Promise<any[]> {
        return Array.from(this.institutes.values());
    }
    async getTrainer(id: number): Promise<any> {
        return this.trainers.get(id);
    }

    async getAllTrainers(): Promise<any[]> {
        return Array.from(this.trainers.values());
    }

    async getInstitute(id: number): Promise<any> {
        return this.institutes.get(id);
    }
}

import { db } from "./db";
import { eq, and, ilike, sql } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  // Events - Real Database Implementation
  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.isActive, true));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async getEventsByRegion(region: string): Promise<Event[]> {
    return await db.select().from(events).where(and(
      eq(events.isActive, true),
      ilike(events.location, `%${region}%`)
    ));
  }

  async getEventsByCategory(category: string): Promise<Event[]> {
    return await db.select().from(events).where(and(
      eq(events.isActive, true),
      eq(events.category, category)
    ));
  }

  async checkEventAttendance(userId: number, eventId: number): Promise<boolean> {
    const [attendance] = await db.select().from(eventAttendances).where(and(
      eq(eventAttendances.userId, userId),
      eq(eventAttendances.eventId, eventId)
    ));
    return !!attendance;
  }

  async attendEvent(userId: number, eventId: number): Promise<EventAttendance> {
    const [attendance] = await db.insert(eventAttendances).values({
      userId,
      eventId,
      attendedAt: new Date()
    }).returning();

    // Update participant count
    await db.update(events)
      .set({ currentParticipants: sql`${events.currentParticipants} + 1` })
      .where(eq(events.id, eventId));

    return attendance;
  }

  async getEventLocation(id: number): Promise<EventLocation | undefined> {
    const [location] = await db.select().from(eventLocations).where(eq(eventLocations.id, id));
    return location || undefined;
  }

  async createEventLocation(location: InsertEventLocation): Promise<EventLocation> {
    const [newLocation] = await db.insert(eventLocations).values(location).returning();
    return newLocation;
  }

  // Courses - Real Database Implementation
  async getCourse(id: number): Promise<any> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async getAllCourses(): Promise<any[]> {
    return await db.select().from(courses).where(eq(courses.isActive, true));
  }

  async getCoursesByUserId(userId: number): Promise<any[]> {
    // This would require a join with enrollment table when implemented
    return await db.select().from(courses).where(eq(courses.instructorId, userId));
  }

  async createCourse(course: any): Promise<any> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async enrollUserInCourse(userId: number, courseId: number): Promise<any> {
    // This would use enrollment table when schema is updated
    // For now, we'll update course enrollment count
    await db.update(courses)
      .set({ enrolledCount: sql`${courses.enrolledCount} + 1` })
      .where(eq(courses.id, courseId));
    return { userId, courseId, enrolledAt: new Date() };
  }

  // Commission Policies - Real Database Implementation
  async getCommissionPolicies(): Promise<any[]> {
    return await db.select().from(commissionPolicies).where(eq(commissionPolicies.isActive, true));
  }

  async getCommissionPolicy(id: number): Promise<any | undefined> {
    const [policy] = await db.select().from(commissionPolicies).where(eq(commissionPolicies.id, id));
    return policy || undefined;
  }

  async createCommissionPolicy(policy: any): Promise<any> {
    const [newPolicy] = await db.insert(commissionPolicies).values(policy).returning();
    return newPolicy;
  }

  async updateCommissionPolicy(id: number, data: any): Promise<any> {
    const [updatedPolicy] = await db.update(commissionPolicies)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(commissionPolicies.id, id))
      .returning();
    return updatedPolicy;
  }

  // Commission Transactions - Real Database Implementation
  async getCommissionTransactions(): Promise<any[]> {
    return await db.select().from(commissionTransactions);
  }

  async getCommissionTransaction(id: number): Promise<any | undefined> {
    const [transaction] = await db.select().from(commissionTransactions).where(eq(commissionTransactions.id, id));
    return transaction || undefined;
  }

  async createCommissionTransaction(transaction: any): Promise<any> {
    const [newTransaction] = await db.insert(commissionTransactions).values(transaction).returning();
    return newTransaction;
  }

  async updateCommissionTransaction(id: number, data: any): Promise<any> {
    const [updatedTransaction] = await db.update(commissionTransactions)
      .set(data)
      .where(eq(commissionTransactions.id, id))
      .returning();
    return updatedTransaction;
  }

  // Settlement Reports - Real Database Implementation
  async getSettlementReports(): Promise<any[]> {
    return await db.select().from(settlementReports);
  }

  async getSettlementReport(id: number): Promise<any | undefined> {
    const [report] = await db.select().from(settlementReports).where(eq(settlementReports.id, id));
    return report || undefined;
  }

  async createSettlementReport(report: any): Promise<any> {
    const [newReport] = await db.insert(settlementReports).values(report).returning();
    return newReport;
  }

  async updateSettlementReport(id: number, data: any): Promise<any> {
    const [updatedReport] = await db.update(settlementReports)
      .set(data)
      .where(eq(settlementReports.id, id))
      .returning();
    return updatedReport;
  }

  // Shop Products - Real Database Implementation
  async getAllProducts(): Promise<any[]> {
    return await db.select().from(products).where(eq(products.isActive, true));
  }

  async getProduct(id: number): Promise<any | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(product: any): Promise<any> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, data: any): Promise<any> {
    const [updatedProduct] = await db.update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async getProductsByCategory(categoryId: number): Promise<any[]> {
    return await db.select().from(products).where(and(
      eq(products.isActive, true),
      eq(products.categoryId, categoryId)
    ));
  }

  // Shop Categories - Real Database Implementation
  async getAllShopCategories(): Promise<any[]> {
    return await db.select().from(shopCategories).where(eq(shopCategories.isActive, true));
  }

  async getShopCategory(id: number): Promise<any | undefined> {
    const [category] = await db.select().from(shopCategories).where(eq(shopCategories.id, id));
    return category || undefined;
  }

  async createShopCategory(category: any): Promise<any> {
    const [newCategory] = await db.insert(shopCategories).values(category).returning();
    return newCategory;
  }

  // Cart Items - Real Database Implementation
  async getCartItems(userId: number): Promise<any[]> {
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async addToCart(userId: number, productId: number, quantity: number, options?: any): Promise<any> {
    const [cartItem] = await db.insert(cartItems).values({
      userId,
      productId,
      quantity,
      options
    }).returning();
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<any> {
    const [updatedItem] = await db.update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
    return true;
  }

  async getUserByCi(ci: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.ci, ci));
    return user || undefined;
  }

  async getUserBySocialId(provider: string, socialId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users)
      .where(eq(users.provider, provider))
      .where(eq(users.socialId, socialId));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserRole(userId: number, role: UserRole, trainerId?: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserProfile(userId: number, profileData: ProfileUpdateData): Promise<User> {
    const [user] = await db
      .update(users)
      .set(profileData)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserVerification(userId: number, verificationData: {
    ci: string;
    verified: boolean;
    verifiedAt: Date;
    verificationName?: string;
    verificationBirth?: string;
    verificationPhone?: string;
  }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ci: verificationData.ci,
        verified: verificationData.verified,
        verifiedAt: verificationData.verifiedAt,
        verificationName: verificationData.verificationName,
        verificationBirth: verificationData.verificationBirth,
        verificationPhone: verificationData.verificationPhone
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // 기관 관련 메서드 - 임시로 빈 구현
  async getInstituteByCode(code: string): Promise<any> {
    return null;
  }

  async getInstitute(id: number): Promise<any> {
    return null;
  }

  async getAllInstitutes(): Promise<any[]> {
    return [];
  }

  // 훈련사 관련 메서드 - 임시로 빈 구현
  async getTrainer(id: number): Promise<any> {
    return null;
  }

  async getAllTrainers(): Promise<any[]> {
    return [];
  }

  // 반려동물 관련 메서드 - 임시로 빈 구현
  async getPet(id: number): Promise<any> {
    return null;
  }

  async getPetById(id: number): Promise<any> {
    return null;
  }

  async getPetsByUserId(userId: number): Promise<any[]> {
    return [];
  }

  async createPet(pet: any): Promise<any> {
    return null;
  }

  async updatePet(id: number, pet: any): Promise<any> {
    return null;
  }

    async deletePet(id: number): Promise<boolean> {
        return false;
    }
}

// Export the storage instance
export const storage = new MemoryStorage();