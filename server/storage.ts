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
} from "../shared/schema";

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

  // 위치 관련
  getAllLocations(): Promise<any[]>;

  // 반려동물 관련
  getPet(id: number): Promise<any>;
  getPetById(id: number): Promise<any>;
  getPetsByUserId(userId: number): Promise<any[]>;
  createPet(pet: any): Promise<any>;
  updatePet(id: number, pet: any): Promise<any>;
  deletePet(id: number): Promise<boolean>;

  // 건강 관리 관련
  getPetHealthRecords(petId: number): Promise<any[]>;
  createHealthRecord(record: any): Promise<any>;
  getPetVaccinations(petId: number): Promise<any[]>;
  getPetMedications(petId: number): Promise<any[]>;
  getPetTrainingSessions(petId: number): Promise<any[]>;
  getPetProgress(petId: number): Promise<any[]>;
  getPetAchievements(petId: number): Promise<any[]>;

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

  // 건강 관리 관련
  getVaccinations(petId: number): Promise<any[]>;
  createVaccination(vaccination: any): Promise<any>;
  updateVaccination(id: number, data: any): Promise<any>;
  deleteVaccination(id: number): Promise<boolean>;
  getCheckups(petId: number): Promise<any[]>;
  createCheckup(checkup: any): Promise<any>;
  updateCheckup(id: number, data: any): Promise<any>;
  deleteCheckup(id: number): Promise<boolean>;

  // 메시지 관련
  getMessages(userId: number): Promise<any[]>;
  getMessage(id: number): Promise<any | undefined>;
  createMessage(message: any): Promise<any>;
  updateMessage(id: number, data: any): Promise<any>;
  deleteMessage(id: number): Promise<boolean>;
  markMessageAsRead(id: number): Promise<any>;

  // 알림 관련
  getNotifications(userId: number): Promise<any[]>;
  getNotification(id: number): Promise<any | undefined>;
  createNotification(notification: any): Promise<any>;
  markNotificationAsRead(id: number): Promise<any>;
  deleteNotification(id: number): Promise<boolean>;

  // 화상 수업 관련
  getVideoClasses(): Promise<any[]>;
  getVideoClass(id: number): Promise<any | undefined>;
  createVideoClass(videoClass: any): Promise<any>;
  updateVideoClass(id: number, data: any): Promise<any>;
  deleteVideoClass(id: number): Promise<boolean>;

  // 예약 관련
  getReservations(userId?: number): Promise<any[]>;
  getReservation(id: number): Promise<any | undefined>;
  createReservation(reservation: any): Promise<any>;
  updateReservation(id: number, data: any): Promise<any>;
  cancelReservation(id: number): Promise<any>;

    // 커뮤니티 기능
    getCommunityPosts(options?: {
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
    }): Promise<{ posts: CommunityPost[]; total: number }>;
    createCommunityPost(postData: any): Promise<CommunityPost>;
    getCommunityPost(id: number): Promise<CommunityPost | null>;
    updateCommunityPost(id: number, updates: Partial<CommunityPost>): Promise<CommunityPost | null>;
    deleteCommunityPost(id: number): Promise<boolean>;
    incrementPostViews(id: number): Promise<void>;
    togglePostLike(postId: number, userId: number): Promise<any>;
    getPostComments(postId: number): Promise<any[]>;
    createComment(commentData: any): Promise<any>;
    sharePost(postId: number, userId: number): Promise<any>;
    toggleBookmark(postId: number, userId: number): Promise<any>;
    toggleFollow(followerId: number, followingId: number): Promise<any>;
    getUserFollowers(userId: number): Promise<any[]>;
    getUserFollowing(userId: number): Promise<any[]>;
    getPersonalizedFeed(userId: number): Promise<CommunityPost[]>;
    getTrendingPosts(): Promise<CommunityPost[]>;
    createReport(reportData: any): Promise<any>;
    moderatePost(postId: number, moderationData: any): Promise<any>;
    getReports(): Promise<any[]>;
}

// 메모리 기반 데이터 저장소 (운영 환경용)
// 실제 운영에서는 데이터베이스를 사용하되, 초기 데이터용 임시 저장소

export class MemoryStorage implements IStorage{
  // Storage maps for core data
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
  
  // Commission and settlement data stores
  private commissionPolicies = new Map();
  private commissionTiers = new Map();
  private commissionTransactions = new Map();
  private settlementReports = new Map();

  // Additional data stores (arrays)
  private communityPosts = new Map<number, CommunityPost>();
  private shoppingItems: ShoppingItem[] = [];
  private reservations = new Map();
  private consultations: Consultation[] = [];
  private notebookEntries: NotebookEntry[] = [];
  private commissions: Commission[] = [];
  private invoices: Invoice[] = [];
  private transactions: Transaction[] = [];
  private promotions: Promotion[] = [];

  // Health management data stores
  private healthRecords: HealthRecord[] = [];
  private vaccinations: Vaccination[] = [];
  private vaccinationRecords = new Map();
  private weightRecords: WeightRecord[] = [];
  private medications: Medication[] = [];
  private medicationRecords = new Map();
  private nutritionPlans: NutritionPlan[] = [];
  private healthReminders: HealthReminder[] = [];
  private healthSchedule = new Map();

  // Training management data stores
  private trainingSessions: any[] = [];
  private progressRecords = new Map();
  private achievements: any[] = [];

  // Community related data stores
  private postLikes: any[] = [];
  private comments: any[] = [];
  private postShares: any[] = [];
  private bookmarks: any[] = [];
  private follows: any[] = [];
  private reports: any[] = [];

  // ID counters
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
  private reservationId = 1;


  constructor() {
    console.log('🔄 운영 환경용 메모리 저장소 초기화...');
    this.initBasicData();
  }

  // 간소화된 기본 데이터만 초기화
  private initBasicData() {
    // 기본 관리자 계정들
    const adminUser = {
      id: this.userId++,
      username: 'admin',
      email: 'admin@talez.com',
      name: '관리자',
      role: 'admin',
      password: 'hashed_password_here',
      avatar: '/images/admin-avatar.png',
      createdAt: new Date(),
      isVerified: true,
      instituteId: null
    };

    const trainerUser = {
      id: this.userId++,
      username: 'trainer',
      email: 'trainer@example.com',
      name: '훈련사',
      role: 'trainer',
      password: 'hashed_password_here',
      avatar: '/images/trainer-avatar.png',
      createdAt: new Date(),
      isVerified: true,
      instituteId: null
    };

    // 강동훈 (기관관리자) - 왕짱스쿨 운영
    const donghoongUser = {
      id: 108, // 강동훈 사용자 ID (훈련사와 동일 ID)
      username: 'donghoong',
      email: 'donghoong@wangzzang.com',
      name: '강동훈',
      role: 'institute-admin', // 기관관리자 역할
      password: 'hashed_password_here',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      createdAt: new Date(),
      isVerified: true,
      instituteId: 1, // 왕짱스쿨 ID
      phone: '010-4765-1909',
      bio: '반려동물행동지도사 국가자격증 2급 보유. 이해와 신뢰 중심의 훈련 철학으로 반려견과 보호자가 함께 살아가는 법을 교육합니다.',
      certifications: [
        '반려동물행동지도사 국가자격증 2급',
        '경기대학교 대체의학대학원 동물매개자연치유전공 석사',
        '한국애견연맹 사회공헌위원회 위원',
        '펫헬스케어아카데미 협회 공동대표'
      ]
    };

    this.users.set(adminUser.id, adminUser);
    this.users.set(trainerUser.id, trainerUser);
    this.users.set(donghoongUser.id, donghoongUser);

    // 5명의 훈련사 데이터 (기존과 동일)
    this.initTrainerData();

    // 기관 데이터 초기화
    this.initInstituteData();

    // 견주 데이터 추가
    this.initPetOwnerData();

    // 실제 서비스 연결 데이터 생성 (예약, 알림장, 메시지 등)
    this.initSimpleServiceData();

    console.log('✅ 기본 데이터 초기화 완료');
    console.log(`   - 사용자: ${this.users.size}명`);
    console.log(`   - 훈련사: ${this.trainers.size}명`);
    console.log(`   - 반려동물: ${this.pets.size}마리`);
    console.log(`   - 예약: ${this.reservations.size}건`);
    console.log(`   - 메시지: ${this.messages.size}건`);
  }

  // 훈련사 데이터 초기화
  private initTrainerData() {
    const trainer1 = {
      id: 1,
      userId: 3,
      name: '김민수',
      specialty: '기본훈련 및 행동교정',
      specialties: ['기본훈련', '행동교정', '어질리티'],
      experience: 10,
      rating: 4.8,
      reviewCount: 156,
      description: '10년 경력의 전문 반려동물 훈련사입니다. 개별 맞춤 훈련과 행동 교정을 전문으로 합니다.',
      bio: '10년 경력의 전문 반려동물 훈련사',
      location: '서울시 강남구',
      address: '서울시 강남구 테헤란로 123',
      phone: '010-1234-5678',
      email: 'trainer@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      certifications: ['반려동물행동교정사 1급', 'KKF 공인 훈련사'],
      talezCertificationStatus: 'verified',
      talezCertificationLevel: 'professional',
      licenseNumber: 'TAL-2024-001',
      price: 80000,
      featured: true,
      isActive: true,
      availableSlots: ['09:00', '10:00', '14:00', '15:00', '16:00'],
      workingHours: { start: '09:00', end: '18:00' },
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      services: [
        { name: '기본 훈련', duration: 60, price: 80000 },
        { name: '행동 교정', duration: 90, price: 120000 },
        { name: '어질리티 훈련', duration: 60, price: 100000 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const trainer2 = {
      id: 2,
      userId: 104,
      name: '박지혜',
      specialty: '퍼피 교육 및 사회화',
      specialties: ['퍼피교육', '사회화훈련', '기본훈련'],
      experience: 7,
      rating: 4.9,
      reviewCount: 89,
      description: '어린 강아지 전문 교육과 사회화 훈련을 전문으로 하는 7년 경력의 훈련사입니다.',
      bio: '퍼피 교육 전문가',
      location: '서울시 서초구',
      address: '서울시 서초구 강남대로 456',
      phone: '010-2345-6789',
      email: 'park.trainer@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332b1b3?w=300',
      certifications: ['동물행동학 석사', 'KKF 공인 훈련사'],
      talezCertificationStatus: 'verified',
      talezCertificationLevel: 'expert',
      licenseNumber: 'TAL-2024-002',
      price: 75000,
      featured: true,
      isActive: true,
      availableSlots: ['10:00', '11:00', '15:00', '16:00', '17:00'],
      workingHours: { start: '10:00', end: '19:00' },
      workingDays: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      services: [
        { name: '퍼피 교육', duration: 45, price: 75000 },
        { name: '사회화 훈련', duration: 60, price: 85000 },
        { name: '기본 복종 훈련', duration: 60, price: 80000 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const trainer3 = {
      id: 3,
      userId: 105,
      name: '이준호',
      specialty: '어질리티 및 스포츠 훈련',
      specialties: ['어질리티', '스포츠훈련', '고급훈련'],
      experience: 12,
      rating: 4.7,
      reviewCount: 203,
      description: '어질리티와 반려견 스포츠 분야의 베테랑 훈련사입니다. 경쟁 대회 출전까지 도와드립니다.',
      bio: '어질리티 전문 베테랑 훈련사',
      location: '경기도 성남시',
      address: '경기도 성남시 분당구 정자로 789',
      phone: '010-3456-7890',
      email: 'lee.trainer@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      certifications: ['국제 어질리티 심사위원', 'KKF 공인 훈련사'],
      talezCertificationStatus: 'verified',
      talezCertificationLevel: 'master',
      licenseNumber: 'TAL-2024-003',
      price: 120000,
      featured: false,
      isActive: true,
      availableSlots: ['08:00', '09:00', '14:00', '15:00'],
      workingHours: { start: '08:00', end: '17:00' },
      workingDays: ['monday', 'wednesday', 'friday', 'saturday', 'sunday'],
      services: [
        { name: '어질리티 기초', duration: 60, price: 120000 },
        { name: '어질리티 고급', duration: 90, price: 150000 },
        { name: '경쟁 대회 준비', duration: 120, price: 200000 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const trainer4 = {
      id: 4,
      userId: 106,
      name: '최예린',
      specialty: '행동 분석 및 문제행동 교정',
      specialties: ['행동분석', '문제행동교정', '심리치료'],
      experience: 8,
      rating: 4.9,
      reviewCount: 134,
      description: '동물 행동학 전문가로서 문제 행동의 근본 원인을 찾아 해결하는 전문 훈련사입니다.',
      bio: '동물 행동학 전문가',
      location: '서울시 마포구',
      address: '서울시 마포구 월드컵로 321',
      phone: '010-4567-8901',
      email: 'choi.trainer@example.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
      certifications: ['동물행동학 박사', '임상동물행동학자'],
      talezCertificationStatus: 'verified',
      talezCertificationLevel: 'expert',
      licenseNumber: 'TAL-2024-004',
      price: 150000,
      featured: true,
      isActive: true,
      availableSlots: ['11:00', '13:00', '15:00', '17:00'],
      workingHours: { start: '10:00', end: '18:00' },
      workingDays: ['monday', 'tuesday', 'thursday', 'friday', 'saturday'],
      services: [
        { name: '행동 분석', duration: 90, price: 150000 },
        { name: '공격성 교정', duration: 120, price: 200000 },
        { name: '분리불안 치료', duration: 90, price: 180000 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const trainer5 = {
      id: 5,
      userId: 107,
      name: '정현우',
      specialty: 'K9 및 전문견 훈련',
      specialties: ['K9훈련', '경찰견훈련', '전문견양성'],
      experience: 15,
      rating: 4.8,
      reviewCount: 67,
      description: '전직 경찰견 훈련관 출신으로 전문적이고 체계적인 훈련을 제공합니다.',
      bio: '전직 경찰견 훈련관',
      location: '인천시 연수구',
      address: '인천시 연수구 컨벤시아대로 654',
      phone: '010-5678-9012',
      email: 'jung.trainer@example.com',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300',
      certifications: ['경찰견 훈련 자격증', 'K9 전문 훈련사'],
      talezCertificationStatus: 'verified',
      talezCertificationLevel: 'professional',
      licenseNumber: 'TAL-2024-005',
      price: 100000,
      featured: false,
      isActive: true,
      availableSlots: ['07:00', '08:00', '13:00', '14:00'],
      workingHours: { start: '07:00', end: '16:00' },
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      services: [
        { name: '기초 복종 훈련', duration: 60, price: 100000 },
        { name: '보호 훈련', duration: 90, price: 140000 },
        { name: '전문견 양성', duration: 120, price: 180000 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 강동훈 훈련사 (실제 왕짱스쿨 데이터)
    const trainer6 = {
      id: 6,
      userId: 108, // 강동훈 사용자 ID
      name: '강동훈',
      specialty: '국가자격증 훈련 및 반려동물 교감 교육',
      specialties: ['국가자격증 훈련', '정서안정 교육', '문제행동 교정', '퍼피 사회화 교육'],
      experience: 10,
      rating: 4.9,
      reviewCount: 87,
      description: '국가자격증 훈련부터 반려동물 교감 교육까지! 반려견과 보호자의 "진짜 관계"를 만들어 드립니다.',
      bio: '반려동물행동지도사 국가자격증 2급 보유. 이해와 신뢰 중심의 훈련 철학으로 반려견과 보호자가 함께 살아가는 법을 교육합니다.',
      location: '경북 구미시',
      address: '경북 구미시 구평동 661 (왕짱 스쿨)',
      phone: '010-4765-1909',
      email: 'donghoong@wangzzang.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      certifications: [
        '반려동물행동지도사 국가자격증 2급',
        '경기대학교 대체의학대학원 동물매개자연치유전공 석사',
        '한국애견연맹 사회공헌위원회 위원',
        '펫헬스케어아카데미 협회 공동대표'
      ],
      talezCertificationStatus: 'verified',
      talezCertificationLevel: 'expert',
      licenseNumber: 'TAL-2024-006',
      price: 70000,
      featured: true,
      isActive: true,
      availableSlots: ['09:00', '10:00', '13:00', '14:00', '15:00', '16:00'],
      workingHours: { start: '09:00', end: '18:00' },
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      services: [
        { name: '국가자격증 훈련 (오비디언스)', duration: 60, price: 70000 },
        { name: '정서안정 및 동물교감 교육', duration: 90, price: 90000 },
        { name: '문제행동 교정', duration: 75, price: 80000 },
        { name: '퍼피 사회화 교육', duration: 45, price: 60000 }
      ],
      businessLocations: [
        '경북 구미시 구평동 661 (왕짱 스쿨)',
        '경북 칠곡군 석적읍 북중리 10길 17 (왕짱애견유치원)'
      ],
      specialPrograms: [
        '구미시 2025 미래교육지구 마을학교 "반려꿈터" 운영',
        '정신건강 및 특수교육 대상자를 위한 교감 활동',
        '경북소방본부, 교육기관 대상 강의 및 상담',
        '수제간식 교육 및 반려견 건강식 제안'
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.trainers.set(trainer1.id, trainer1);
    this.trainers.set(trainer2.id, trainer2);
    this.trainers.set(trainer3.id, trainer3);
    this.trainers.set(trainer4.id, trainer4);
    this.trainers.set(trainer5.id, trainer5);
    this.trainers.set(trainer6.id, trainer6);
  }

  // 기관 데이터 초기화
  private initInstituteData() {
    // 왕짱스쿨 기관 데이터 (강동훈 훈련사 연결)
    const wangzzangSchool = {
      id: 1,
      name: '왕짱스쿨',
      code: 'WANGZZANG001',
      type: 'training-center',
      description: '국가자격증 훈련부터 반려동물 교감 교육까지! 반려견과 보호자의 "진짜 관계"를 만들어 드립니다.',
      address: '경북 구미시 구평동 661',
      phone: '010-4765-1909',
      email: 'donghoong@wangzzang.com',
      website: 'https://wangzzang.com',
      logo: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300',
      capacity: 30,
      establishedYear: 2020,
      latitude: 36.1184,
      longitude: 128.3445,
      isVerified: true,
      verifiedAt: new Date('2024-01-15'),
      certLevel: 'premium',
      rating: 4.9,
      reviewCount: 87,
      featured: true,
      isActive: true,
      operatingHours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '09:00', close: '18:00' },
        sunday: { closed: true }
      },
      facilities: [
        '실내 훈련장 (50평)',
        '실외 운동장 (100평)',
        '개별 훈련실 (3개)',
        '그루밍 시설',
        '대기실 및 상담실',
        '주차장 (10대)'
      ],
      specialPrograms: [
        '구미시 2025 미래교육지구 마을학교 "반려꿈터" 운영',
        '정신건강 및 특수교육 대상자를 위한 교감 활동',
        '경북소방본부, 교육기관 대상 강의 및 상담',
        '수제간식 교육 및 반려견 건강식 제안'
      ],
      trainerId: 6, // 강동훈 훈련사 ID
      trainerName: '강동훈',
      certifications: [
        '반려동물행동지도사 국가자격증 2급',
        '동물매개자연치유전공 석사',
        '한국애견연맹 사회공헌위원회 위원'
      ],
      courses: [
        {
          id: 1,
          name: '국가자격증 훈련 (오비디언스)',
          duration: 60,
          price: 70000,
          description: '기본 복종 훈련부터 고급 오비디언스까지'
        },
        {
          id: 2,
          name: '정서안정 및 동물교감 교육',
          duration: 90,
          price: 90000,
          description: '반려견과 보호자의 정서적 유대감 형성'
        },
        {
          id: 3,
          name: '문제행동 교정',
          duration: 75,
          price: 80000,
          description: '짖음, 공격성, 분리불안 등 문제행동 교정'
        },
        {
          id: 4,
          name: '퍼피 사회화 교육',
          duration: 45,
          price: 60000,
          description: '어린 강아지 사회화 및 기본 예절 교육'
        }
      ],
      additionalLocations: [
        {
          name: '왕짱애견유치원',
          address: '경북 칠곡군 석적읍 북중리 10길 17',
          phone: '010-4765-1909',
          type: 'daycare',
          latitude: 36.0089,
          longitude: 128.4014
        }
      ],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date()
    };

    this.institutes.set(wangzzangSchool.id, wangzzangSchool);

    // 강동훈 훈련사에 기관 ID 연결
    const trainer6 = this.trainers.get(6);
    if (trainer6) {
      trainer6.instituteId = 1;
      trainer6.instituteName = '왕짱스쿨';
      this.trainers.set(6, trainer6);
    }
  }

  // 견주 데이터 초기화
  private initPetOwnerData() {
    // 견주 사용자들
    const owner1 = {
      id: this.userId++,
      username: 'petowner1',
      email: 'owner1@example.com',
      name: '김지영',
      role: 'pet-owner',
      password: 'hashed_password_here',
      avatar: 'https://images.unsplash.com/photo-1580518337843-f959e992563b?w=300',
      createdAt: new Date(),
      isVerified: true,
      instituteId: null
    };

    const owner2 = {
      id: this.userId++,
      username: 'petowner2',
      email: 'owner2@example.com',
      name: '박민호',
      role: 'pet-owner',
      password: 'hashed_password_here',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      createdAt: new Date(),
      isVerified: true,
      instituteId: null
    };

    const owner3 = {
      id: this.userId++,
      username: 'petowner3',
      email: 'owner3@example.com',
      name: '이수진',
      role: 'pet-owner',
      password: 'hashed_password_here',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
      createdAt: new Date(),
      isVerified: true,
      instituteId: null
    };

    this.users.set(owner1.id, owner1);
    this.users.set(owner2.id, owner2);
    this.users.set(owner3.id, owner3);

    // 반려동물 데이터
    const pet1 = {
      id: this.petId++,
      ownerId: owner1.id,
      name: '맥스',
      breed: '골든 리트리버',
      age: 3,
      gender: 'male',
      weight: 28.5,
      color: '황금색',
      description: '활발하고 사람을 좋아하는 성격',
      profileImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300',
      isNeutered: true,
      vaccinated: true,
      healthIssues: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const pet2 = {
      id: this.petId++,
      ownerId: owner2.id,
      name: '루나',
      breed: '보더 콜리',
      age: 2,
      gender: 'female',
      weight: 18.2,
      color: '흑백',
      description: '똑똑하고 에너지가 넘치는 활동적인 성격',
      profileImage: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=300',
      isNeutered: true,
      vaccinated: true,
      healthIssues: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const pet3 = {
      id: this.petId++,
      ownerId: owner3.id,
      name: '초코',
      breed: '프렌치 불독',
      age: 1,
      gender: 'male',
      weight: 12.8,
      color: '갈색',
      description: '호기심이 많고 애교가 많은 어린 강아지',
      profileImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300',
      isNeutered: false,
      vaccinated: true,
      healthIssues: ['호흡기 주의'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.pets.set(pet1.id, pet1);
    this.pets.set(pet2.id, pet2);
    this.pets.set(pet3.id, pet3);
  }

  // 실제 서비스 연결 데이터 초기화
  private initServiceConnectionData() {
    // 예약 데이터 생성
    const reservation1 = {
      id: this.reservationId++,
      userId: 108, // 김지영 (owner1)
      trainerId: 1, // 김민수 훈련사
      petId: this.petId - 3, // 맥스
      serviceType: '기본 훈련',
      scheduledDate: new Date('2025-01-05 10:00:00'),
      duration: 60,
      status: 'confirmed',
      price: 80000,
      notes: '기본 복종 훈련 중점으로 진행 요청',
      meetingType: 'video',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const reservation2 = {
      id: this.reservationId++,
      userId: 109, // 박민호 (owner2)
      trainerId: 2, // 박지혜 훈련사
      petId: this.petId - 2, // 루나
      serviceType: '사회화 훈련',
      scheduledDate: new Date('2025-01-06 15:00:00'),
      duration: 60,
      status: 'confirmed',
      price: 85000,
      notes: '다른 개와의 사회화 훈련 필요',
      meetingType: 'video',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const reservation3 = {
      id: this.reservationId++,
      userId: 110, // 이수진 (owner3)
      trainerId: 4, // 최예린 훈련사
      petId: this.petId - 1, // 초코
      serviceType: '행동 분석',
      scheduledDate: new Date('2025-01-07 13:00:00'),
      duration: 90,
      status: 'pending',
      price: 150000,
      notes: '밤에 짖는 문제 해결 상담',
      meetingType: 'video',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.reservations.set(reservation1.id, reservation1);
    this.reservations.set(reservation2.id, reservation2);
    this.reservations.set(reservation3.id, reservation3);

    // 메시지 데이터 생성
    const message1 = {
      id: this.messageId++,
      senderId: 108, // 김지영
      receiverId: 1, // 김민수 훈련사 (userId: 3)
      content: '안녕하세요! 맥스의 기본 훈련 상담 받고 싶습니다.',
      timestamp: new Date('2025-01-02 14:30:00'),
      isRead: true,
      messageType: 'text',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const message2 = {
      id: this.messageId++,
      senderId: 3, // 김민수 훈련사
      receiverId: 108, // 김지영
      content: '안녕하세요! 맥스의 나이와 현재 훈련 상태를 알려주시면 맞춤 훈련 계획을 제안해드리겠습니다.',
      timestamp: new Date('2025-01-02 15:00:00'),
      isRead: true,
      messageType: 'text',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const message3 = {
      id: this.messageId++,
      senderId: 109, // 박민호
      receiverId: 2, // 박지혜 훈련사 (userId: 104)
      content: '루나가 다른 개들과 잘 어울리지 못하고 있어요. 사회화 훈련이 필요할 것 같습니다.',
      timestamp: new Date('2025-01-03 09:15:00'),
      isRead: false,
      messageType: 'text',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.messages.set(message1.id, message1);
    this.messages.set(message2.id, message2);
    this.messages.set(message3.id, message3);

    // 알림 데이터 생성
    const notification1 = {
      id: this.notificationId++,
      userId: 108, // 김지영
      type: 'reservation_confirmed',
      title: '예약 확정',
      message: '김민수 훈련사와의 기본 훈련이 1월 5일 10시에 확정되었습니다.',
      isRead: false,
      createdAt: new Date('2025-01-03 16:00:00'),
      updatedAt: new Date()
    };

    const notification2 = {
      id: this.notificationId++,
      userId: 109, // 박민호
      type: 'new_message',
      title: '새 메시지',
      message: '박지혜 훈련사로부터 새 메시지가 도착했습니다.',
      isRead: false,
      createdAt: new Date('2025-01-03 10:30:00'),
      updatedAt: new Date()
    };

    const notification3 = {
      id: this.notificationId++,
      userId: 110, // 이수진
      type: 'training_reminder',
      title: '훈련 알림',
      message: '초코의 행동 분석 상담이 내일 오후 1시에 예정되어 있습니다.',
      isRead: false,
      createdAt: new Date('2025-01-06 09:00:00'),
      updatedAt: new Date()
    };

    this.notifications.set(notification1.id, notification1);
    this.notifications.set(notification2.id, notification2);
    this.notifications.set(notification3.id, notification3);
  }

  // 간단한 서비스 연결 데이터
  private initSimpleServiceData() {
    // 몇 개의 간단한 메시지만 추가
    const message1 = {
      id: this.messageId++,
      senderId: 108, // 김지영 견주
      receiverId: 3, // 김민수 훈련사
      content: '안녕하세요! 맥스의 기본 훈련 상담받고 싶습니다.',
      timestamp: new Date(),
      isRead: false,
      messageType: 'text',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const message2 = {
      id: this.messageId++,
      senderId: 3, // 김민수 훈련사
      receiverId: 108, // 김지영 견주
      content: '네, 기본 훈련 상담 도와드리겠습니다. 맥스의 나이와 현재 상태를 알려주세요.',
      timestamp: new Date(),
      isRead: true,
      messageType: 'text',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.messages.set(message1.id, message1);
    this.messages.set(message2.id, message2);

    console.log('✅ 서비스 연결 데이터 초기화 완료');
    console.log(`   - 메시지: ${this.messages.size}건`);
  }

  // 기존 복잡한 데이터 초기화 함수 (사용 안 함)
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

    // 샘플 사용자들 (견주) 추가 - 다양한 프로필
    const petOwner1 = {
      id: this.userId++,
      username: 'petowner1',
      email: 'owner1@example.com',
      name: '김혜진',
      role: 'pet-owner',
      password: 'hashed_password_here',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332b1b3?w=300',
      createdAt: new Date(),
      isVerified: true,
      instituteId: null,
      ci: null,
      verified: true,
      verifiedAt: new Date(),
      verificationName: '김혜진',
      verificationBirth: '1990-05-15',
      verificationPhone: '010-1111-2222',
      provider: null,
      socialId: null,
      bio: '3년차 골든 리트리버 반려인입니다. 멍멍이와 함께 행복한 일상을 보내고 있어요!',
      location: '서울시 강남구'
    };

    const petOwner2 = {
      id: this.userId++,
      username: 'petowner2',
      email: 'owner2@example.com',
      name: '박진우',
      role: 'pet-owner',
      password: 'hashed_password_here',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      createdAt: new Date(),
      isVerified: true,
      instituteId: null,
      ci: null,
      verified: true,
      verifiedAt: new Date(),
      verificationName: '박진우',
      verificationBirth: '1985-12-08',
      verificationPhone: '010-3333-4444',
      provider: null,
      socialId: null,
      bio: '초보 견주입니다. 코코의 훈련에 대해 많이 배우고 싶어요.',
      location: '서울시 서초구'
    };

    const petOwner3 = {
      id: this.userId++,
      username: 'petowner3',
      email: 'owner3@example.com',
      name: '이수정',
      role: 'pet-owner',
      password: 'hashed_password_here',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
      createdAt: new Date(),
      isVerified: true,
      instituteId: null,
      ci: null,
      verified: true,
      verifiedAt: new Date(),
      verificationName: '이수정',
      verificationBirth: '1992-03-22',
      verificationPhone: '010-5555-6666',
      provider: null,
      socialId: null,
      bio: '보더콜리 초코와 함께 어질리티에 도전하고 있습니다!',
      location: '경기도 성남시'
    };

    const petOwner4 = {
      id: this.userId++,
      username: 'petowner4',
      email: 'owner4@example.com',
      name: '정민호',
      role: 'pet-owner',
      password: 'hashed_password_here',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      createdAt: new Date(),
      isVerified: true,
      instituteId: null,
      ci: null,
      verified: true,
      verifiedAt: new Date(),
      verificationName: '정민호',
      verificationBirth: '1987-09-14',
      verificationPhone: '010-7777-8888',
      provider: null,
      socialId: null,
      bio: '문제행동이 있는 둘리와 함께 교정 훈련 중입니다.',
      location: '서울시 마포구'
    };

    // 기관 관리자 추가
    const instituteAdmin = {
      id: this.userId++,
      username: 'institute_admin',
      email: 'institute@talez.com',
      name: '강민서',
      role: 'institute-admin',
      password: 'hashed_password_here',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300',
      createdAt: new Date(),
      isVerified: true,
      instituteId: 1,
      ci: null,
      verified: true,
      verifiedAt: new Date(),
      verificationName: '강민서',
      verificationBirth: '1988-07-30',
      verificationPhone: '010-9999-0000',
      provider: null,
      socialId: null,
      bio: '테일즈 서울 강남센터 관리자입니다.',
      location: '서울시 강남구'
    };

    this.users.set(petOwner1.id, petOwner1);
    this.users.set(petOwner2.id, petOwner2);
    this.users.set(petOwner3.id, petOwner3);
    this.users.set(petOwner4.id, petOwner4);
    this.users.set(instituteAdmin.id, instituteAdmin);

    // 샘플 훈련사 추가
    const trainerUser = {
      id: this.userId++,
      username: 'trainer',
      email: 'trainer@example.com',
      name: '김민수',
      role: 'trainer',
      password: 'hashed_password_here',
      avatar: '/images/trainer-avatar.png',
      createdAt: new Date(),
      isVerified: true,
      instituteId: 1,
      ci: null,
      verified: false,
      verifiedAt: null,
      verificationName: null,
      verificationBirth: null,
      verificationPhone: null,
      provider: null,
      socialId: null,
      bio: '10년 경력의 전문 반려동물 훈련사',
      location: '서울시 강남구',
      specializations: ['기본훈련', '행동교정', '어질리티'],
      certification: '반려동물행동교정사 1급'
    };

    this.users.set(trainerUser.id, trainerUser);

    // 강동훈 훈련사 사용자 계정 생성
    const 강동훈UserAccount = {
      id: this.userId++,
      username: 'trainer_kangdonghoon',
      email: 'wangjjang.school@gmail.com',
      name: '강동훈',
      role: 'trainer',
      password: 'hashed_password_here',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      createdAt: new Date(),
      isVerified: true,
      instituteId: null,
      ci: null,
      verified: true,
      verifiedAt: new Date(),
      verificationName: '강동훈',
      verificationBirth: '1985-03-20',
      verificationPhone: '010-4765-1909',
      provider: null,
      socialId: null,
      bio: '국가자격증 훈련부터 반려동물 교감 교육까지 전문가',
      location: '경북 구미시',
      specializations: ['국가자격증 훈련', '정서안정 교육', '문제행동 교정'],
      certification: '반려동물행동지도사 국가자격증 2급'
    };

    this.users.set(강동훈UserAccount.id, 강동훈UserAccount);

    // 강동훈 훈련사 프로필 생성 (실제 왕짱스쿨 데이터)
    const realTrainer_강동훈 = {
      id: this.trainerId++,
      userId: 강동훈UserAccount.id,
      name: '강동훈',
      specialty: '반려동물 행동교정 및 전문 훈련',
      specialties: ['행동교정', '사회화훈련', '퍼피트레이닝', '장애반려인 전문훈련'],
      experience: 15,
      rating: 4.9,
      reviewCount: 89,
      description: '국가공인 동물행동교정사 자격증을 보유한 전문 훈련사입니다. 왕짱스쿨을 운영하며 구미시와 칠곡군에서 반려동물 전문 교육을 제공합니다.',
      bio: '국가공인 동물행동교정사 자격증 보유, 왕짱스쿠를 운영하며 15년 경력',
      location: '경상북도 구미시',
      address: '경상북도 구미시 구평동 (구평점) / 경상북도 칠곡군 석적읍 (석적점)',
      phone: '054-123-4567',
      email: 'wangjjang.school@gmail.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=강동훈&backgroundColor=2563eb,16a34a,dc2626,9333ea&radius=50',
      certifications: ['국가공인 동물행동교정사', '반려동물행동교정사 1급', '사회복지사'],
      talezCertificationStatus: 'verified',
      talezCertificationLevel: 'expert',
      licenseNumber: 'TAL-2024-KDH',
      price: 120000,
      featured: true,
      isActive: true,
      availableSlots: ['09:00', '10:00', '14:00', '15:00', '16:00'],
      workingHours: { start: '09:00', end: '18:00' },
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      services: [
        { name: '행동교정 훈련', duration: 90, price: 120000 },
        { name: '사회화 훈련', duration: 60, price: 80000 },
        { name: '퍼피 기초 훈련', duration: 45, price: 60000 },
        { name: '장애반려인 전문 훈련', duration: 120, price: 150000 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.trainers.set(realTrainer_강동훈.id, realTrainer_강동훈);

    // 훈련사 프로필 데이터 별도 저장
    const trainerProfile = {
      id: this.trainerId++,
      userId: trainerUser.id,
      name: '김민수',
      specialty: '기본훈련 및 행동교정',
      specialties: ['기본훈련', '행동교정', '어질리티'],
      experience: 10,
      rating: 4.8,
      reviewCount: 156,
      description: '10년 경력의 전문 반려동물 훈련사입니다. 개별 맞춤 훈련과 행동 교정을 전문으로 합니다.',
      bio: '10년 경력의 전문 반려동물 훈련사',
      location: '서울시 강남구',
      address: '서울시 강남구 테헤란로 123',
      phone: '010-1234-5678',
      email: 'trainer@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      certifications: ['반려동물행동교정사 1급', 'KKF 공인 훈련사'],
      talezCertificationStatus: 'verified',
      talezCertificationLevel: 'professional',
      licenseNumber: 'TAL-2024-001',
      price: 80000,
      featured: true,
      isActive: true,
      availableSlots: ['09:00', '10:00', '14:00', '15:00', '16:00'],
      workingHours: { start: '09:00', end: '18:00' },
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      services: [
        { name: '기본 훈련', duration: 60, price: 80000 },
        { name: '행동 교정', duration: 90, price: 120000 },
        { name: '어질리티 훈련', duration: 60, price: 100000 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 추가 훈련사들
    const trainer2 = {
      id: this.trainerId++,
      userId: this.userId + 100, // 임시 ID
      name: '박지혜',
      specialty: '퍼피 교육 및 사회화',
      specialties: ['퍼피교육', '사회화훈련', '기본훈련'],
      experience: 7,
      rating: 4.9,
      reviewCount: 89,
      description: '어린 강아지 전문 교육과 사회화 훈련을 전문으로 하는 7년 경력의 훈련사입니다.',
      bio: '퍼피 교육 전문가',
      location: '서울시 서초구',
      address: '서울시 서초구 강남대로 456',
      phone: '010-2345-6789',
      email: 'park.trainer@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332b1b3?w=300',
      certifications: ['동물행동학 석사', 'KKF 공인 훈련사'],
      talezCertificationStatus: 'verified',
      talezCertificationLevel: 'expert',
      licenseNumber: 'TAL-2024-002',
      price: 75000,
      featured: true,
      isActive: true,
      availableSlots: ['10:00', '11:00', '15:00', '16:00', '17:00'],
      workingHours: { start: '10:00', end: '19:00' },
      workingDays: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      services: [
        { name: '퍼피 교육', duration: 45, price: 75000 },
        { name: '사회화 훈련', duration: 60, price: 85000 },
        { name: '기본 복종 훈련', duration: 60, price: 80000 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const trainer3 = {
      id: this.trainerId++,
      userId: this.userId + 101, // 임시 ID
      name: '이준호',
      specialty: '어질리티 및 스포츠 훈련',
      specialties: ['어질리티', '스포츠훈련', '고급훈련'],
      experience: 12,
      rating: 4.7,
      reviewCount: 203,
      description: '어질리티와 반려견 스포츠 분야의 베테랑 훈련사입니다. 경쟁 대회 출전까지 도와드립니다.',
      bio: '어질리티 전문 베테랑 훈련사',
      location: '경기도 성남시',
      address: '경기도 성남시 분당구 정자로 789',
      phone: '010-3456-7890',
      email: 'lee.trainer@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      certifications: ['국제 어질리티 심사위원', 'KKF 공인 훈련사'],
      talezCertificationStatus: 'verified',
      talezCertificationLevel: 'master',
      licenseNumber: 'TAL-2024-003',
      price: 120000,
      featured: false,
      isActive: true,
      availableSlots: ['08:00', '09:00', '14:00', '15:00'],
      workingHours: { start: '08:00', end: '17:00' },
      workingDays: ['monday', 'wednesday', 'friday', 'saturday', 'sunday'],
      services: [
        { name: '어질리티 기초', duration: 60, price: 120000 },
        { name: '어질리티 고급', duration: 90, price: 150000 },
        { name: '경쟁 대회 준비', duration: 120, price: 200000 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const trainer4 = {
      id: this.trainerId++,
      userId: this.userId + 102, // 임시 ID
      name: '최예린',
      specialty: '행동 분석 및 문제행동 교정',
      specialties: ['행동분석', '문제행동교정', '심리치료'],
      experience: 8,
      rating: 4.9,
      reviewCount: 134,
      description: '동물 행동학 전문가로서 문제 행동의 근본 원인을 찾아 해결하는 전문 훈련사입니다.',
      bio: '동물 행동학 전문가',
      location: '서울시 마포구',
      address: '서울시 마포구 월드컵로 321',
      phone: '010-4567-8901',
      email: 'choi.trainer@example.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
      certifications: ['동물행동학 박사', '임상동물행동학자'],
      talezCertificationStatus: 'verified',
      talezCertificationLevel: 'expert',
      licenseNumber: 'TAL-2024-004',
      price: 150000,
      featured: true,
      isActive: true,
      availableSlots: ['11:00', '13:00', '15:00', '17:00'],
      workingHours: { start: '10:00', end: '18:00' },
      workingDays: ['monday', 'tuesday', 'thursday', 'friday', 'saturday'],
      services: [
        { name: '행동 분석', duration: 90, price: 150000 },
        { name: '공격성 교정', duration: 120, price: 200000 },
        { name: '분리불안 치료', duration: 90, price: 180000 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const trainer5 = {
      id: this.trainerId++,
      userId: this.userId + 103, // 임시 ID
      name: '정현우',
      specialty: 'K9 및 전문견 훈련',
      specialties: ['K9훈련', '경찰견훈련', '전문견양성'],
      experience: 15,
      rating: 4.8,
      reviewCount: 67,
      description: '전직 경찰견 훈련관 출신으로 전문적이고 체계적인 훈련을 제공합니다.',
      bio: '전직 경찰견 훈련관',
      location: '인천시 연수구',
      address: '인천시 연수구 컨벤시아대로 654',
      phone: '010-5678-9012',
      email: 'jung.trainer@example.com',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300',
      certifications: ['경찰견 훈련 자격증', 'K9 전문 훈련사'],
      talezCertificationStatus: 'verified',
      talezCertificationLevel: 'professional',
      licenseNumber: 'TAL-2024-005',
      price: 100000,
      featured: false,
      isActive: true,
      availableSlots: ['07:00', '08:00', '13:00', '14:00'],
      workingHours: { start: '07:00', end: '16:00' },
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      services: [
        { name: '기초 복종 훈련', duration: 60, price: 100000 },
        { name: '보호 훈련', duration: 90, price: 140000 },
        { name: '전문견 양성', duration: 120, price: 180000 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 훈련사 데이터를 trainers Map에 저장
    this.trainers.set(trainerProfile.id, trainerProfile);
    this.trainers.set(securityTrainer.id, securityTrainer);
    this.trainers.set(trainer2.id, trainer2);
    this.trainers.set(trainer3.id, trainer3);
    this.trainers.set(trainer4.id, trainer4);
    this.trainers.set(trainer5.id, trainer5);
    this.trainers.set(realTrainer_강동훈.id, realTrainer_강동훈);

    // 견주별 반려동물들 추가
    const pet1_멍멍이 = {
      id: this.petId++,
      name: '멍멍이',
      breed: '골든 리트리버',
      age: 3,
      weight: 25000,
      gender: 'male',
      ownerId: petOwner1.id,
      description: '활발하고 친근한 성격의 골든 리트리버',
      health: '건강함',
      temperament: '온순하고 활발함',
      allergies: '없음',
      microchipId: 'MC001234567890',
      registrationNumber: 'REG-2024-001',
      birthDate: '2021-03-15',
      adoptionDate: '2021-05-20',
      trainingStatus: '진행중',
      assignedTrainerId: trainerUser.id, // 김민수 훈련사와 연결
      trainingStartDate: '2024-01-15',
      trainingGoals: ['기본 복종 훈련', '산책 매너', '사회화'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const pet2_코코 = {
      id: this.petId++,
      name: '코코',
      breed: '웰시코기',
      age: 1,
      weight: 12000,
      gender: 'female',
      ownerId: petOwner2.id,
      description: '호기심 많고 장난기 넘치는 어린 웰시코기',
      health: '건강함',
      temperament: '활발하고 호기심 많음',
      allergies: '없음',
      microchipId: 'MC001234567891',
      registrationNumber: 'REG-2024-002',
      birthDate: '2023-06-20',
      adoptionDate: '2023-08-15',
      trainingStatus: '진행중',
      assignedTrainerId: 442, // 박지혜 훈련사와 연결 (trainer2)
      trainingStartDate: '2024-02-01',
      trainingGoals: ['퍼피 기초 교육', '하우스 트레이닝', '사회화'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const pet3_초코 = {
      id: this.petId++,
      name: '초코',
      breed: '보더콜리',
      age: 2,
      weight: 18000,
      gender: 'male',
      ownerId: petOwner3.id,
      description: '똑똑하고 운동 능력이 뛰어난 보더콜리',
      health: '건강함',
      temperament: '지능적이고 활동적',
      allergies: '없음',
      microchipId: 'MC001234567892',
      registrationNumber: 'REG-2024-003',
      birthDate: '2022-04-10',
      adoptionDate: '2022-06-05',
      trainingStatus: '진행중',
      assignedTrainerId: 444, // 이준호 훈련사와 연결 (trainer3)
      trainingStartDate: '2024-01-20',
      trainingGoals: ['어질리티 기초', '고급 복종 훈련', '스포츠 훈련'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const pet4_둘리 = {
      id: this.petId++,
      name: '둘리',
      breed: '진돗개',
      age: 4,
      weight: 22000,
      gender: 'male',
      ownerId: petOwner4.id,
      description: '영리하지만 경계심이 강한 진돗개',
      health: '건강함',
      temperament: '독립적이고 경계심 강함',
      allergies: '없음',
      microchipId: 'MC001234567893',
      registrationNumber: 'REG-2024-004',
      birthDate: '2020-11-25',
      adoptionDate: '2021-01-10',
      trainingStatus: '진행중',
      assignedTrainerId: 445, // 최예린 훈련사와 연결 (trainer4)
      trainingStartDate: '2024-02-15',
      trainingGoals: ['공격성 교정', '사회화 훈련', '행동 분석'],
      behaviorIssues: ['낯선 사람에 대한 경계', '다른 개와의 갈등'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const pet5_별이 = {
      id: this.petId++,
      name: '별이',
      breed: '셰퍼드',
      age: 3,
      weight: 30000,
      gender: 'female',
      ownerId: petOwner1.id, // 김혜진이 두 마리 키움
      description: '차분하고 충성심 강한 셰퍼드',
      health: '건강함',
      temperament: '차분하고 충성적',
      allergies: '없음',
      microchipId: 'MC001234567894',
      registrationNumber: 'REG-2024-005',
      birthDate: '2021-08-15',
      adoptionDate: '2021-10-20',
      trainingStatus: '진행중',
      assignedTrainerId: 446, // 정현우 훈련사와 연결 (trainer5)
      trainingStartDate: '2024-01-10',
      trainingGoals: ['전문 훈련', '보호 훈련', 'K9 기초'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.pets.set(pet1_멍멍이.id, pet1_멍멍이);
    this.pets.set(pet2_코코.id, pet2_코코);
    this.pets.set(pet3_초코.id, pet3_초코);
    this.pets.set(pet4_둘리.id, pet4_둘리);
    this.pets.set(pet5_별이.id, pet5_별이);

    // 샘플 예방접종 기록 - 더 상세한 데이터
    const vaccination1 = {
      id: 1,
      petId: pet1_멍멍이.id,
      vaccineName: 'DHPPL (5종 종합백신)',
      vaccineType: '종합백신',
      vaccineDate: '2024-01-15',
      nextDueDate: '2025-01-15',
      veterinarian: '박수의사',
      clinicName: '강남동물병원',
      notes: '정상적으로 접종 완료. 부작용 없음. 체중 25kg 상태 양호',
      batchNumber: 'VX240115001',
      manufacturer: '한국백신(주)',
      dosage: '1ml',
      injectionSite: '목 뒤쪽 피하',
      temperature: '38.1°C (정상)',
      cost: 45000,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    };

    const vaccination2 = {
      id: 2,
      petId: pet2_코코.id,
      vaccineName: '광견병 백신 (Rabisin)',
      vaccineType: '광견병',
      vaccineDate: '2024-01-15',
      nextDueDate: '2025-01-15',
      veterinarian: '박수의사',
      clinicName: '강남동물병원',
      notes: '광견병 예방접종 완료. 이상 반응 없음',
      batchNumber: 'RAB240115002',
      manufacturer: '메리알코리아',
      dosage: '1ml',
      injectionSite: '왼쪽 어깨 피하',
      temperature: '38.2°C (정상)',
      cost: 35000,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    };

    const vaccination3 = {
      id: 3,
      petId: pet3_초코.id,
      vaccineName: 'FVRCP (고양이 3종)',
      vaccineType: '종합백신',
      vaccineDate: '2024-02-10',
      nextDueDate: '2025-02-10',
      veterinarian: '이수의사',
      clinicName: '서초동물병원',
      notes: '고양이 종합백신 접종 완료. 스트레스 반응 최소화',
      batchNumber: 'CAT240210001',
      manufacturer: '조에티스코리아',
      dosage: '1ml',
      injectionSite: '목 뒤쪽 피하',
      temperature: '38.4°C (정상)',
      cost: 42000,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10')
    };

    const vaccination4 = {
      id: 4,
      petId: pet4_둘리.id,
      vaccineName: '켄넬코프 백신',
      vaccineType: '켄넬코프',
      vaccineDate: '2024-03-01',
      nextDueDate: '2025-03-01',
      veterinarian: '김영희수의사',
      clinicName: '강남동물병원',
      notes: '켄넬코프 예방접종 완료. 기침 예방을 위한 추가 접종',
      batchNumber: 'KC240301001',
      manufacturer: '한국백신(주)',
      dosage: '1ml',
      injectionSite: '코 분무',
      temperature: '37.9°C (정상)',
      cost: 38000,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01')
    };

    const vaccination5 = {
      id: 5,
      petId: samplePet2.id,
      vaccineName: '고양이 백혈병 백신',
      vaccineType: '백혈병',
      vaccineDate: '2024-03-15',
      nextDueDate: '2025-03-15',
      veterinarian: '이수의사',
      clinicName: '서초동물병원',
      notes: '고양이 백혈병 예방접종 완료. 실외 활동 대비 접종',
      batchNumber: 'FLV240315001',
      manufacturer: '조에티스코리아',
      dosage: '1ml',
      injectionSite: '왼쪽 어깨 피하',
      temperature: '38.3°C (정상)',
      cost: 55000,
      createdAt: new Date('2024-03-15'),
      updatedAt: new Date('2024-03-15')
    };

    // 예방접종 기록 저장
    const vaccinations = new Map();
    vaccinations.set(vaccination1.id, vaccination1);
    vaccinations.set(vaccination2.id, vaccination2);
    vaccinations.set(vaccination3.id, vaccination3);
    vaccinations.set(vaccination4.id, vaccination4);
    vaccinations.set(vaccination5.id, vaccination5);

    // 샘플 건강검진 기록 - 상세한 의료 데이터
    const checkup1 = {
      id: this.checkupId++,
      petId: samplePet1.id,
      checkupDate: '2024-01-20',
      weight: 25000, // 그램 단위
      temperature: '38.2°C',
      diagnosis: '정상 - 우수한 건강 상태',
      treatment: '정기검진, 특별한 치료 불필요. 예방 관리 지속',
      veterinarian: '박수의사',
      clinicName: '강남동물병원',
      notes: '전반적으로 건강상태 양호. 다음 검진까지 현재 사료 유지. 운동량 적절',
      nextCheckupDate: '2024-07-20',
      bloodPressure: '정상 (120/80 mmHg)',
      heartRate: '80bpm',
      respiratoryRate: '24회/분',
      eyeExam: '정상 - 결막 깨끗, 각막 투명',
      dentalCheck: '치석 약간 있음, 일주일에 2-3회 양치 권장',
      earExam: '정상 - 이물질 없음',
      skinCondition: '양호 - 피부 탄력성 좋음',
      abdominalPalpation: '정상 - 이상 종괴 없음',
      lymphNodes: '정상 크기',
      urinalysis: 'SG: 1.025, 단백질(-), 당(-), 케톤(-)',
      bloodWork: {
        RBC: '6.8 M/μL',
        WBC: '7.2 K/μL',
        HCT: '45%',
        PLT: '350 K/μL',
        ALT: '32 U/L',
        BUN: '18 mg/dL',
        CREA: '1.0 mg/dL'
      },
      vaccineStatus: '최신 상태',
      parasiteCheck: '음성',
      recommendations: [
        '정기적인 운동 지속',
        '체중 관리 유지',
        '치석 제거를 위한 스케일링 고려',
        '6개월 후 정기검진'
      ],
      cost: 180000,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    };

    const checkup2 = {
      id: this.checkupId++,
      petId: samplePet2.id,
      checkupDate: '2024-02-15',
      weight: 4500, // 그램 단위
      temperature: '38.5°C',
      diagnosis: '정상 - 건강 상태 우수',
      treatment: '정기검진, 털갈이 관리 및 스트레스 관리 권장',
      veterinarian: '이수의사',
      clinicName: '서초동물병원',
      notes: '건강상태 우수. 털갈이 시기로 브러싱 자주 해주세요. 실내 환경 관리 중요',
      nextCheckupDate: '2024-08-15',
      bloodPressure: '정상 (110/75 mmHg)',
      heartRate: '120bpm',
      respiratoryRate: '30회/분',
      eyeExam: '정상 - 눈물량 적절, 각막 깨끗',
      dentalCheck: '양호 - 치아 상태 깨끗',
      earExam: '정상 - 귀지 적당량',
      skinCondition: '건조 - 털갈이로 인한 일시적 현상',
      abdominalPalpation: '정상 - 이상 없음',
      lymphNodes: '정상 크기',
      urinalysis: 'SG: 1.030, 단백질(-), 당(-), 케톤(-)',
      bloodWork: {
        RBC: '7.2 M/μL',
        WBC: '6.8 K/μL',
        HCT: '42%',
        PLT: '380 K/μL',
        ALT: '28 U/L',
        BUN: '20 mg/dL',
        CREA: '1.2 mg/dL'
      },
      vaccineStatus: '최신 상태',
      parasiteCheck: '음성',
      recommendations: [
        '털갈이 시기 브러싱 강화',
        '습도 조절 (40-60%)',
        '스트레스 관리',
        '고품질 단백질 사료 급여'
      ],
      cost: 165000,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15')
    };

    // 추가 건강검진 기록들
    const checkup3 = {
      id: this.checkupId++,
      petId: samplePet1.id,
      checkupDate: '2023-07-15',
      weight: 24500,
      temperature: '38.0°C',
      diagnosis: '경미한 위장 불편감',
      treatment: '처방식 사료 2주간 급여, 소화제 투약',
      veterinarian: '김영희수의사',
      clinicName: '강남동물병원',
      notes: '일시적인 소화불량. 새로운 간식 급여 후 증상 발생. 기존 사료로 복귀',
      nextCheckupDate: '2023-08-01',
      bloodPressure: '정상',
      heartRate: '85bpm',
      eyeExam: '정상',
      dentalCheck: '양호',
      treatment_outcome: '완전 회복',
      medications: ['소화제 (7일간)', '프로바이오틱스 (14일간)'],
      cost: 95000,
      createdAt: new Date('2023-07-15'),
      updatedAt: new Date('2023-07-15')
    };

    const checkup4 = {
      id: this.checkupId++,
      petId: samplePet2.id,
      checkupDate: '2023-12-10',
      weight: 4200,
      temperature: '38.8°C',
      diagnosis: '상기도 감염 (경미)',
      treatment: '항생제 치료 5일간, 면역력 강화제',
      veterinarian: '정철수수의사',
      clinicName: '서초동물병원',
      notes: '계절 변화로 인한 경미한 감기 증상. 치료 후 빠른 회복',
      nextCheckupDate: '2023-12-20',
      bloodPressure: '정상',
      heartRate: '130bpm',
      eyeExam: '약간의 눈물',
      dentalCheck: '양호',
      treatment_outcome: '완전 회복',
      medications: ['아목시실린 (5일간)', '면역 강화제 (10일간)'],
      cost: 125000,
      createdAt: new Date('2023-12-10'),
      updatedAt: new Date('2023-12-10')
    };

    // 건강검진 기록 저장
    this.checkups.set(checkup1.id, checkup1);
    this.checkups.set(checkup2.id, checkup2);
    this.checkups.set(checkup3.id, checkup3);
    this.checkups.set(checkup4.id, checkup4);

    // 의료 이력 및 알레르기 정보 업데이트 (주석 처리 - 스키마에 없는 필드)
    // samplePet1.medicalHistory = [...];
    // samplePet2.medicalHistory = [...];

    // 건강 관리 일정 추가
    const healthSchedule = new Map();
    healthSchedule.set(1, {
      petId: samplePet1.id,
      type: 'vaccination',
      dueDate: '2025-01-15',
      description: 'DHPPL 종합백신 재접종',
      priority: 'high'
    });
    healthSchedule.set(2, {
      petId: samplePet1.id,
      type: 'checkup',
      dueDate: '2024-07-20',
      description: '정기 건강검진',
      priority: 'medium'
    });
    healthSchedule.set(3, {
      petId: samplePet2.id,
      type: 'vaccination',
      dueDate: '2025-02-10',
      description: 'FVRCP 고양이 종합백신',
      priority: 'high'
    });

    // 체중 추적 기록 생성
    const weightRecords = new Map();
    const weightData = [
      // 멍멍이(강아지) 체중 기록
      { date: '2023-01-15', weight: 23500, note: '겨울철 약간 증가' },
      { date: '2023-03-15', weight: 24000, note: '봄철 운동량 증가로 근육량 향상' },
      { date: '2023-06-15', weight: 24800, note: '여름철 활동적' },
      { date: '2023-09-15', weight: 25200, note: '가을철 식욕 증가' },
      { date: '2023-12-15', weight: 24500, note: '겨울철 운동 부족' },
      { date: '2024-01-20', weight: 25000, note: '건강검진 시 측정' },
      { date: '2024-03-01', weight: 25100, note: '현재 이상적 체중 유지' }
    ];

    weightData.forEach((record, index) => {
      weightRecords.set(index + 1, {
        id: index + 1,
        petId: samplePet1.id,
        date: record.date,
        weight: record.weight,
        bodyConditionScore: record.weight > 25000 ? 4 : 3.5, // 1-5 스케일
        muscleCondition: 'good',
        notes: record.note,
        measuredBy: '박수의사',
        location: '강남동물병원'
      });
    });

    // 나비(고양이) 체중 기록
    const catWeightData = [
      { date: '2023-02-10', weight: 4100, note: '겨울철 털 두껍다' },
      { date: '2023-05-10', weight: 4300, note: '털갈이 후 체중 증가' },
      { date: '2023-08-10', weight: 4400, note: '여름철 활동량 감소' },
      { date: '2023-11-10', weight: 4200, note: '가을 털갈이 시기' },
      { date: '2024-02-15', weight: 4500, note: '건강검진 시 측정' },
      { date: '2024-04-01', weight: 4450, note: '현재 적정 체중' }
    ];

    catWeightData.forEach((record, index) => {
      weightRecords.set(weightData.length + index + 1, {
        id: weightData.length + index + 1,
        petId: samplePet2.id,
        date: record.date,
        weight: record.weight,
        bodyConditionScore: 3.5, // 고양이 이상적 점수
        muscleCondition: 'excellent',
        notes: record.note,
        measuredBy: '이수의사',
        location: '서초동물병원'
      });
    });

    // 약물 복용 기록
    const medicationRecords = new Map();
    medicationRecords.set(1, {
      id: 1,
      petId: samplePet1.id,
      medicationName: '관절영양제 (글루코사민)',
      dosage: '1정',
      frequency: '1일 1회',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      purpose: '관절 건강 유지',
      prescribedBy: '박수의사',
      instructions: '식후 30분 이내 복용',
      sideEffects: '없음',
      status: 'active',
      notes: '대형견 관절 예방 차원에서 복용'
    });

    medicationRecords.set(2, {
      id: 2,
      petId: samplePet1.id,
      medicationName: '심장사상충 예방약 (하트가드)',
      dosage: '1정',
      frequency: '월 1회',
      startDate: '2024-03-01',
      endDate: '2024-11-30',
      purpose: '심장사상충 예방',
      prescribedBy: '박수의사',
      instructions: '매월 1일 복용',
      sideEffects: '없음',
      status: 'active',
      notes: '모기 활동 시기 예방'
    });

    medicationRecords.set(3, {
      id: 3,
      petId: samplePet2.id,
      medicationName: '헤어볼 제거제',
      dosage: '2-3cm',
      frequency: '주 2회',
      startDate: '2024-02-01',
      endDate: null,
      purpose: '헤어볼 예방 및 제거',
      prescribedBy: '이수의사',
      instructions: '간식처럼 급여',
      sideEffects: '없음',
      status: 'active',
      notes: '장모 고양이 필수 관리'
    });

    medicationRecords.set(4, {
      id: 4,
      petId: samplePet2.id,
      medicationName: '아목시실린',
      dosage: '62.5mg',
      frequency: '1일 2회',
      startDate: '2023-12-10',
      endDate: '2023-12-15',
      purpose: '상기도 감염 치료',
      prescribedBy: '정철수수의사',
      instructions: '12시간 간격 복용',
      sideEffects: '없음',
      status: 'completed',
      notes: '5일간 완료 치료'
    });

    // 영양 관리 계획
    const nutritionPlans = new Map();
    nutritionPlans.set(1, {
      id: 1,
      petId: samplePet1.id,
      planName: '대형견 성견 표준 식단',
      dailyCalories: 1800,
      mealFrequency: 2,
      mainFood: {
        brand: '로얄캐닌',
        product: '맥시 어덜트',
        dailyAmount: '300g',
        mealAmount: '150g × 2회'
      },
      treats: [
        { name: '덴탈껌', amount: '1개', frequency: '주 3회' },
        { name: '동결건조 간', amount: '10g', frequency: '주 2회' }
      ],
      supplements: [
        { name: '글루코사민', amount: '1정', frequency: '1일 1회' },
        { name: '오메가3', amount: '1캡슐', frequency: '1일 1회' }
      ],
      restrictions: ['초콜릿', '양파', '포도', '마카다미아'],
      feedingSchedule: ['오전 8시', '오후 6시'],
      waterIntake: '1.5-2L/일',
      specialNotes: '운동 후 30분 뒤 급여, 체중 관리 중요',
      createdBy: '박수의사',
      createdDate: '2024-01-15',
      reviewDate: '2024-07-15'
    });

    nutritionPlans.set(2, {
      id: 2,
      petId: samplePet2.id,
      planName: '중형 성묘 헤어볼 관리 식단',
      dailyCalories: 300,
      mealFrequency: 3,
      mainFood: {
        brand: '힐스',
        product: '사이언스 다이어트 헤어볼',
        dailyAmount: '70g',
        mealAmount: '25g × 3회'
      },
      treats: [
        { name: '참치 간식', amount: '5g', frequency: '주 2회' },
        { name: '캣그라스', amount: '자유롭게', frequency: '매일' }
      ],
      supplements: [
        { name: '헤어볼 젤', amount: '2-3cm', frequency: '주 2회' },
        { name: '프로바이오틱스', amount: '1/2티스푼', frequency: '주 3회' }
      ],
      restrictions: ['우유', '생선뼈', '양파', '마늘'],
      feedingSchedule: ['오전 7시', '오후 1시', '오후 7시'],
      waterIntake: '200-300ml/일',
      specialNotes: '털갈이 시기 브러싱 강화, 물 섭취량 확인',
      createdBy: '이수의사',
      createdDate: '2024-02-15',
      reviewDate: '2024-08-15'
    });

    // 건강 알림 및 리마인더
    const healthReminders = new Map();
    healthReminders.set(1, {
      id: 1,
      petId: samplePet1.id,
      type: 'vaccination',
      title: 'DHPPL 백신 접종 예정',
      description: '연간 종합백신 접종이 다가왔습니다',
      dueDate: '2025-01-15',
      isCompleted: false,
      priority: 'high',
      reminderDays: [30, 14, 7, 1]
    });

    healthReminders.set(2, {
      id: 2,
      petId: samplePet1.id,
      type: 'medication',
      title: '심장사상충 예방약 복용',
      description: '월간 심장사상충 예방약 복용 시기입니다',
      dueDate: '2024-07-01',
      isCompleted: false,
      priority: 'medium',
      reminderDays: [3, 1]
    });

    healthReminders.set(3, {
      id: 3,
      petId: samplePet2.id,
      type: 'grooming',
      title: '털갈이 시즌 브러싱',
      description: '털갈이 시즌 집중 브러싱이 필요합니다',
      dueDate: '2024-06-30',
      isCompleted: false,
      priority: 'low',
      reminderDays: [7, 3]
    });

    // 예방접종 기록을 vaccinations 맵에 저장
    vaccinations.set(vaccination1.id, vaccination1);
    vaccinations.set(vaccination2.id, vaccination2);
    vaccinations.set(vaccination3.id, vaccination3);
    vaccinations.set(vaccination4.id, vaccination4);
    vaccinations.set(vaccination5.id, vaccination5);

    // 모든 샘플 데이터를 인스턴스 변수에 저장
    this.vaccinations = vaccinations;
    this.weightRecords = weightRecords;
    this.medicationRecords = medicationRecords;
    this.nutritionPlans = nutritionPlans;
    this.healthReminders = healthReminders;
    this.healthSchedule = healthSchedule;

    console.log('✅ 건강관리 샘플 데이터 초기화 완료');
    console.log(`   - 예방접종 기록: ${this.vaccinations.size}건`);
    console.log(`   - 건강검진 기록: ${this.checkups.size}건`);
    console.log(`   - 체중 기록: ${this.weightRecords.size}개`);
    console.log(`   - 약물 기록: ${this.medicationRecords.size}개`);
    console.log(`   - 영양 계획: ${this.nutritionPlans.size}개`);
    console.log(`   - 건강 리마인더: ${this.healthReminders.size}개`);

    // 견주-훈련사별 알림장 기록들
    const journal1 = {
      id: 1,
      trainerId: trainerUser.id, // 김민수 훈련사
      petOwnerId: petOwner1.id, // 김혜진 견주
      petId: pet1_멍멍이.id,
      title: '멍멍이 기본 훈련 1회차',
      content: '오늘은 기본적인 앉기와 기다리기 훈련을 진행했습니다. 멍멍이가 처음에는 산만했지만 점차 집중력이 향상되었습니다. 간식을 이용한 긍정적 강화 훈련이 효과적이었습니다.',
      trainingDate: '2024-01-21',
      trainingDuration: 60,
      trainingType: '기본 훈련',
      progressRating: 4,
      behaviorNotes: '활발하고 호기심이 많음. 간식에 대한 반응이 좋음. 집중 시간이 5분 정도로 짧지만 점진적으로 늘어나고 있음.',
      homeworkInstructions: '집에서 하루 2번, 5분씩 앉기 연습을 해주세요. 간식은 작은 크기로 나누어 주시고, 성공할 때마다 칭찬과 함께 주세요.',
      nextGoals: '다음 시간에는 눕기와 손 흔들기를 배워보겠습니다. 산책 시 리드줄 훈련도 시작할 예정입니다.',
      isRead: false,
      readAt: null,
      status: 'sent',
      createdAt: new Date('2024-01-21T14:30:00Z'),
      updatedAt: new Date('2024-01-21T14:30:00Z')
    };

    const journal2 = {
      id: 2,
      trainerId: 442, // 박지혜 훈련사
      petOwnerId: petOwner2.id, // 박진우 견주
      petId: pet2_코코.id,
      title: '코코 퍼피 사회화 훈련 1회차',
      content: '첫 수업이었지만 코코가 정말 영리하네요! 다른 강아지들과의 첫 만남에서 약간 긴장했지만 금세 적응했습니다. 기본적인 앉기 명령을 잘 따르고 있어요.',
      trainingDate: '2024-02-01',
      trainingDuration: 45,
      trainingType: '퍼피 사회화',
      progressRating: 5,
      behaviorNotes: '호기심이 많고 학습 의욕이 높음. 다른 강아지들에게 관심이 많지만 공격적이지 않음. 사람을 좋아함.',
      homeworkInstructions: '매일 10분씩 다양한 소리(청소기, 차 소리 등)에 노출시켜 주세요. 간식과 함께 긍정적인 경험을 만들어주세요.',
      nextGoals: '다음 시간에는 리드줄 착용 연습과 기본 명령어 확장 훈련을 진행하겠습니다.',
      isRead: true,
      readAt: new Date('2024-02-01T18:20:00Z'),
      status: 'read',
      createdAt: new Date('2024-02-01T15:30:00Z'),
      updatedAt: new Date('2024-02-01T15:30:00Z')
    };

    const journal3 = {
      id: 3,
      trainerId: 444, // 이준호 훈련사
      petOwnerId: petOwner3.id, // 이수정 견주
      petId: pet3_초코.id,
      title: '초코 어질리티 기초 평가',
      content: '초코의 운동 능력이 정말 뛰어나네요! 점프와 터널 통과에 자연스러운 재능을 보입니다. 보더콜리 특유의 지능과 집중력이 돋보였습니다.',
      trainingDate: '2024-01-20',
      trainingDuration: 90,
      trainingType: '어질리티 기초',
      progressRating: 5,
      behaviorNotes: '매우 높은 집중력과 학습 능력. 운동에 대한 열정이 높음. 지시를 정확히 이해하고 실행함.',
      homeworkInstructions: '집에서 간단한 장애물(방석, 상자 등)을 이용해 놀이 형태로 연습해주세요. 하루 15분 정도가 적당합니다.',
      nextGoals: '정식 어질리티 장비를 이용한 훈련을 시작하겠습니다. 위버폴과 시소 연습을 계획하고 있어요.',
      isRead: false,
      readAt: null,
      status: 'sent',
      createdAt: new Date('2024-01-20T16:45:00Z'),
      updatedAt: new Date('2024-01-20T16:45:00Z')
    };

    const journal4 = {
      id: 4,
      trainerId: 445, // 최예린 훈련사
      petOwnerId: petOwner4.id, // 정민호 견주
      petId: pet4_둘리.id,
      title: '둘리 행동 분석 및 교정 1회차',
      content: '둘리의 행동 패턴을 자세히 관찰했습니다. 경계심은 강하지만 공격적이지는 않고, 주인에 대한 애착이 매우 강해요. 점진적 둔감화 훈련이 효과적일 것 같습니다.',
      trainingDate: '2024-02-15',
      trainingDuration: 120,
      trainingType: '행동 분석',
      progressRating: 3,
      behaviorNotes: '낯선 사람에 대한 경계심 강함. 하지만 시간을 두고 접근하면 받아들임. 영리하고 주인의 지시를 잘 따름.',
      homeworkInstructions: '매일 5분씩 낯선 사람(가족이 아닌 사람)과의 거리 두기 연습을 해주세요. 강제하지 말고 둘리가 편안해할 때까지 기다려주세요.',
      nextGoals: '사회화 훈련을 단계별로 진행하겠습니다. 먼저 집 근처에서 다른 사람들과의 거리 두기 연습부터 시작하겠습니다.',
      isRead: true,
      readAt: new Date('2024-02-15T20:30:00Z'),
      status: 'read',
      createdAt: new Date('2024-02-15T17:00:00Z'),
      updatedAt: new Date('2024-02-15T17:00:00Z')
    };

    // 견주-훈련사 간 메시지들
    const message1 = {
      id: this.messageId++,
      senderId: trainerUser.id, // 김민수 훈련사
      receiverId: petOwner1.id, // 김혜진 견주
      subject: '멍멍이 훈련 진행 상황 공유',
      content: '안녕하세요, 김혜진님! 멍멍이의 훈련이 순조롭게 진행되고 있습니다. 오늘 알림장을 확인해보시고, 궁금한 점이 있으시면 언제든 연락주세요.',
      type: 'training',
      status: 'read',
      isUrgent: false,
      createdAt: new Date('2024-01-21T15:00:00Z'),
      updatedAt: new Date('2024-01-21T15:00:00Z')
    };

    const message2 = {
      id: this.messageId++,
      senderId: petOwner2.id, // 박진우 견주
      receiverId: 442, // 박지혜 훈련사
      subject: '코코 훈련 관련 질문',
      content: '박지혜 선생님, 안녕하세요! 코코가 집에서 하우스 트레이닝을 할 때 조금 어려워하는 것 같은데, 추가 팁이 있을까요?',
      type: 'training',
      status: 'unread',
      isUrgent: false,
      createdAt: new Date('2024-02-02T09:30:00Z'),
      updatedAt: new Date('2024-02-02T09:30:00Z')
    };

    const message3 = {
      id: this.messageId++,
      senderId: 444, // 이준호 훈련사
      receiverId: petOwner3.id, // 이수정 견주
      subject: '초코 어질리티 대회 참가 제안',
      content: '이수정님, 초코의 실력이 정말 뛰어납니다! 다음 달 초급자 어질리티 대회에 참가해보시는 것은 어떨까요? 충분히 좋은 성과를 낼 수 있을 것 같아요.',
      type: 'training',
      status: 'read',
      isUrgent: false,
      createdAt: new Date('2024-01-25T14:20:00Z'),
      updatedAt: new Date('2024-01-25T14:20:00Z')
    };

    const message4 = {
      id: this.messageId++,
      senderId: petOwner4.id, // 정민호 견주
      receiverId: 445, // 최예린 훈련사
      subject: '둘리 행동 변화 보고',
      content: '최예린 선생님, 둘리가 지난 훈련 이후로 낯선 사람을 보면 조금 더 차분해진 것 같아요. 정말 감사합니다!',
      type: 'training',
      status: 'unread',
      isUrgent: false,
      createdAt: new Date('2024-02-18T16:45:00Z'),
      updatedAt: new Date('2024-02-18T16:45:00Z')
    };

    // 기관 관리자와의 메시지
    const message5 = {
      id: this.messageId++,
      senderId: petOwner1.id, // 김혜진 견주
      receiverId: instituteAdmin.id, // 강민서 기관 관리자
      subject: '테일즈 센터 시설 이용 문의',
      content: '안녕하세요! 멍멍이와 별이를 위한 그룹 클래스가 있는지 궁금합니다. 시설 견학도 가능한가요?',
      type: 'facility',
      status: 'read',
      isUrgent: false,
      createdAt: new Date('2024-01-10T11:00:00Z'),
      updatedAt: new Date('2024-01-10T11:00:00Z')
    };

    this.messages.set(message1.id, message1);
    this.messages.set(message2.id, message2);
    this.messages.set(message3.id, message3);
    this.messages.set(message4.id, message4);
    this.messages.set(message5.id, message5);

    // 견주별 알림들
    const notification1 = {
      id: this.notificationId++,
      userId: petOwner1.id, // 김혜진 견주
      title: '새로운 훈련 알림장이 도착했습니다',
      message: '김민수 훈련사님이 멍멍이의 훈련 알림장을 작성했습니다.',
      type: 'journal',
      status: 'unread',
      linkTo: '/journals',
      createdAt: new Date('2024-01-21T14:35:00Z'),
      updatedAt: new Date('2024-01-21T14:35:00Z')
    };

    const notification2 = {
      id: this.notificationId++,
      userId: petOwner2.id, // 박진우 견주
      title: '코코 훈련 일정 알림',
      message: '내일 오후 2시 박지혜 훈련사님과의 수업이 예정되어 있습니다.',
      type: 'schedule',
      status: 'read',
      linkTo: '/schedule',
      createdAt: new Date('2024-02-01T18:00:00Z'),
      updatedAt: new Date('2024-02-01T18:00:00Z')
    };

    const notification3 = {
      id: this.notificationId++,
      userId: petOwner3.id, // 이수정 견주
      title: '어질리티 대회 참가 제안',
      message: '이준호 훈련사님이 초코의 어질리티 대회 참가를 제안했습니다.',
      type: 'message',
      status: 'unread',
      linkTo: '/messages',
      createdAt: new Date('2024-01-25T14:25:00Z'),
      updatedAt: new Date('2024-01-25T14:25:00Z')
    };

    const notification4 = {
      id: this.notificationId++,
      userId: petOwner4.id, // 정민호 견주
      title: '둘리 행동 개선 확인',
      message: '최예린 훈련사님이 둘리의 행동 개선 상황을 문의했습니다.',
      type: 'message',
      status: 'read',
      linkTo: '/messages',
      createdAt: new Date('2024-02-18T17:00:00Z'),
      updatedAt: new Date('2024-02-18T17:00:00Z')
    };

    const notification5 = {
      id: this.notificationId++,
      userId: petOwner1.id, // 김혜진 견주 (추가 알림)
      title: '별이 전문 훈련 시작',
      message: '정현우 훈련사님과 별이의 K9 전문 훈련이 시작되었습니다.',
      type: 'training',
      status: 'unread',
      linkTo: '/trainings',
      createdAt: new Date('2024-01-10T10:00:00Z'),
      updatedAt: new Date('2024-01-10T10:00:00Z')
    };

    this.notifications.set(notification1.id, notification1);
    this.notifications.set(notification2.id, notification2);
    this.notifications.set(notification3.id, notification3);
    this.notifications.set(notification4.id, notification4);
    this.notifications.set(notification5.id, notification5);

    // 화상 수업 샘플 데이터
    const videoClass1 = {
      id: 1,
      title: '강아지 기초 훈련 마스터 클래스',
      trainer: '김민수',
      trainerId: trainerUser.id,
      price: 45000,
      duration: 60,
      rating: 4.8,
      reviews: 24,
      image: '/images/video-class-basic-training.jpg',
      trainerImage: '/images/trainer-kim-profile.jpg',
      tags: ['기초훈련', '신규견주', '온라인'],
      description: '반려견의 기본적인 훈련 방법을 배우는 실시간 화상 수업입니다. 앉기, 기다리기, 오기 등의 기본 명령어부터 시작합니다.',
      availability: '매주 토요일 14:00-15:00',
      status: 'open',
      seatsTotal: 8,
      seatsBooked: 3,
      nextSession: '2024-01-27T14:00:00Z',
      createdAt: new Date(),
      updatedAt: new Date(),
      minParticipants: 2,
      cancellationDeadline: '24시간 전',
      isAutoCancelEnabled: true,
      curriculum: [
        '1주차: 기본 명령어 (앉기, 기다리기)',
        '2주차: 오기 훈련과 리드줄 훈련',
        '3주차: 문제 행동 교정',
        '4주차: 고급 명령어와 트릭'
      ],
      materials: [
        '간식 (작은 크기)',
        '리드줄',
        '장난감 1-2개',
        '매트 또는 수건'
      ]
    };

    // 견주별 예약 데이터
    const reservation1 = {
      id: 1,
      classId: videoClass1.id,
      userId: petOwner1.id, // 김혜진 견주
      userName: petOwner1.name,
      reservationDate: '2024-01-27',
      reservationTime: '14:00',
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date('2024-01-20T10:00:00Z'),
      notes: '멍멍이 기초 훈련에 대해 배우고 싶습니다.',
      petInfo: {
        name: pet1_멍멍이.name,
        breed: pet1_멍멍이.breed,
        age: pet1_멍멍이.age
      }
    };

    const reservation2 = {
      id: 2,
      classId: videoClass1.id,
      userId: petOwner2.id, // 박진우 견주
      userName: petOwner2.name,
      reservationDate: '2024-02-03',
      reservationTime: '14:00',
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date('2024-01-28T15:30:00Z'),
      notes: '퍼피 사회화에 관심이 있습니다.',
      petInfo: {
        name: pet2_코코.name,
        breed: pet2_코코.breed,
        age: pet2_코코.age
      }
    };

    const reservation3 = {
      id: 3,
      classId: videoClass1.id,
      userId: petOwner3.id, // 이수정 견주
      userName: petOwner3.name,
      reservationDate: '2024-02-10',
      reservationTime: '14:00',
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date('2024-02-05T12:00:00Z'),
      notes: '어질리티 기초 과정에 참여하고 싶습니다.',
      petInfo: {
        name: pet3_초코.name,
        breed: pet3_초코.breed,
        age: pet3_초코.age
      }
    };

    console.log('✅ 운영 환경용 샘플 데이터 초기화 완료');
    console.log(`   - 사용자 계정: ${this.users.size}개 (견주 4명, 기관관리자 1명, 관리자 3명)`);
    console.log(`   - 훈련사: ${this.trainers.size}명`);
    console.log(`   - 반려동물: ${this.pets.size}마리 (견주별 1-2마리)`);
    console.log(`   - 알림장: 4개 (훈련사-견주 연결)`);
    console.log(`   - 메시지: ${this.messages.size}건 (견주-훈련사-기관 간)`);
    console.log(`   - 알림: ${this.notifications.size}건 (각 견주별)`);
    console.log(`   - 예약: 3건 (화상수업)`);
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
  getNotificationsArray() { return Array.from(this.notifications.values()); }
  getConversations() { return Array.from(this.conversations.values()); }
  getMessagesArray() { return Array.from(this.messages.values()); }
  getCommissionPoliciesArray() { return Array.from(this.commissionPolicies.values()); }
  getCommissionTransactionsArray() { return Array.from(this.commissionTransactions.values()); }

  // 특정 데이터 조회
  getUserById(id: number) { return this.users.get(id); }
  getPetById(id: number) { return this.pets.get(id); }
  getPet(id: number) { return this.pets.get(id); }
  getCourseById(id: number) { return this.courses.get(id); }
  getInstituteById(id: number) { return this.institutes.get(id); }
  getProductById(id: number) { return this.products.get(id); }

  // Pet management methods
  async getPetsByUserId(userId: number) {
    return Array.from(this.pets.values()).filter(pet => pet.ownerId === userId);
  }

  // Health record methods
  async getPetHealthRecords(petId: number) {
    return Array.from(this.checkups.values()).filter(record => record.petId === petId);
  }

  async createHealthRecord(record: any) {
    const newRecord = {
      id: this.checkupId++,
      ...record,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.checkups.set(newRecord.id, newRecord);
    return newRecord;
  }

  // Vaccination methods
  async getPetVaccinations(petId: number) {
    return Array.from(this.vaccinationRecords.values()).filter((record: any) => record.petId === petId);
  }

  // Medication methods
  async getPetMedications(petId: number) {
    return Array.from(this.medicationRecords.values()).filter((record: any) => record.petId === petId);
  }

  // Training session methods
  async getPetTrainingSessions(petId: number) {
    return Array.from(this.trainingSessions).filter((session: any) => session.petId === petId);
  }

  // Progress methods
  async getPetProgress(petId: number) {
    return Array.from(this.progressRecords.values()).filter((progress: any) => progress.petId === petId);
  }

  // Achievement methods
  async getPetAchievements(petId: number) {
    return Array.from(this.achievements).filter((achievement: any) => achievement.petId === petId);
  }

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

    async getAllLocations(): Promise<any[]> {
        // 기본 위치 데이터 반환
        return [
            {
                id: 1,
                name: '왕짱스쿨 구평센터',
                type: 'training-center',
                address: '경북 구미시 구평동 123-45',
                description: '전문 반려동물 훈련 센터',
                services: ['기본 훈련', '행동 교정', '사회화 훈련'],
                phone: '054-123-4567',
                rating: 4.8,
                reviewCount: 25,
                certification: true,
                latitude: 36.1195,
                longitude: 128.3444,
                isActive: true
            },
            {
                id: 2,
                name: '왕짱스쿨 석적센터',
                type: 'training-center',
                address: '경북 칠곡군 석적읍 456-78',
                description: '전문 반려동물 훈련 센터',
                services: ['기본 훈련', '행동 교정', '사회화 훈련'],
                phone: '054-234-5678',
                rating: 4.9,
                reviewCount: 18,
                certification: true,
                latitude: 36.0123,
                longitude: 128.4567,
                isActive: true
            }
        ];
    }

    async getInstitute(id: number): Promise<any> {
        return this.institutes.get(id);
    }
    
  async updatePet(id: number, updates: Partial<Pet>): Promise<Pet | null> {
    const pet = this.pets.get(id);
    if (!pet) return null;

    const updatedPet = {
      ...pet,
      ...updates,
      updatedAt: new Date()
    };
    this.pets.set(id, updatedPet);
    return updatedPet;
  }

  async deletePet(id: number): Promise<boolean> {
    return this.pets.delete(id);
  }
    // 커뮤니티 기능 - 완성된 버전
    async getCommunityPosts(options?: {
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
    }): Promise<{ posts: CommunityPost[]; total: number }> {
        let posts = Array.from(this.communityPosts.values());

        // 검색 필터
        if (options?.search) {
            const searchTerm = options.search.toLowerCase();
            posts = posts.filter(post =>
                post.title.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm)
            );
        }

        // 카테고리 필터
        if (options?.category) {
            posts = posts.filter(post => post.tag === options.category);
        }

        // 정렬
        posts.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const total = posts.length;

        // 페이지네이션
        if (options?.page && options?.limit) {
            const startIndex = (options.page - 1) * options.limit;
            posts = posts.slice(startIndex, startIndex + options.limit);
        }

        return { posts, total };
    }

    async createCommunityPost(postData: any): Promise<CommunityPost> {
        const id = this.messageId++;
        
        // 링크 정보 처리
        let linkInfo = undefined;
        if (postData.linkUrl) {
            linkInfo = {
                url: postData.linkUrl,
                title: postData.linkTitle || '',
                description: postData.linkDescription || '',
                image: postData.linkImage || undefined
            };
        }
        
        const post: CommunityPost = {
            id,
            title: postData.title || '',
            content: postData.content || '',
            tag: postData.tag || postData.category || '일반',
            author: {
                id: postData.authorId || 1,
                name: postData.author || '익명 사용자'
            },
            authorId: postData.authorId || 1,
            likes: 0,
            comments: 0,
            views: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            hidden: false,
            linkInfo: linkInfo
        };
        
        console.log('링크 정보 처리 완료:', linkInfo);
        this.communityPosts.set(id, post);
        return post;
    }

    async getCommunityPost(id: number): Promise<CommunityPost | null> {
        return this.communityPosts.get(id);
    }

    async updateCommunityPost(id: number, updates: Partial<CommunityPost>): Promise<CommunityPost | null> {
        const post = this.communityPosts.get(id);
        if (!post) return null;

        const updatedPost = {
            ...post,
            ...updates,
            updatedAt: new Date()
        };
        this.communityPosts.set(id, updatedPost);
        return updatedPost;
    }

    async deleteCommunityPost(id: number): Promise<boolean> {
        return this.communityPosts.delete(id);
    }

    async incrementPostViews(id: number): Promise<void> {
        const post = this.communityPosts.get(id);
        if (post) {
            post.views = (post.views || 0) + 1;
        }
    }

    async togglePostLike(postId: number, userId: number): Promise<any> {
        // 간단한 좋아요 토글 구현
        return null;
    }

    async getPostComments(postId: number): Promise<any[]> {
        return null;
    }

    async createComment(commentData: any): Promise<any> {
        return null;
    }

    async sharePost(postId: number, userId: number): Promise<any> {
        // 공유 기록 추가
        return null;
    }

    async toggleBookmark(postId: number, userId: number): Promise<any> {
        return null;
    }

    async toggleFollow(followerId: number, followingId: number): Promise<any> {
        return null;
    }

    async getUserFollowers(userId: number): Promise<any[]> {
        return null;
    }

    async getUserFollowing(userId: number): Promise<any[]> {
        return null;
    }

    async getPersonalizedFeed(userId: number): Promise<CommunityPost[]> {
        return null;
    }

    async getTrendingPosts(): Promise<CommunityPost[]> {
        return null;
    }

    async createReport(reportData: any): Promise<any> {
        return null;
    }

    async moderatePost(postId: number, moderationData: any): Promise<any> {
        return null;
    }

    async getReports(): Promise<any[]> {
        return null;
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
    return Array.from(this.trainers.values());
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

    async getTrainersByInstitute(instituteId: number): Promise<any[]> {
        return [];
    }

  // 건강 관리 메서드 구현
  async getVaccinations(petId: number): Promise<any[]> {
    // 메모리에서 해당 반려동물의 예방접종 기록 조회
    const vaccinations = Array.from(this.vaccinations.values()).filter(
      (v: any) => v.petId === petId
    );

    // 샘플 예방접종 데이터 반환
    return [
      {
        id: 1,
        petId: petId,
        vaccineName: 'DHPPL',
        vaccineType: '종합백신',
        vaccineDate: '2024-01-15',
        nextDueDate: '2025-01-15',
        veterinarian: '박수의사',
        clinicName: '강남동물병원',
        notes: '정상적으로 접종 완료. 부작용 없음'
      },
      {
        id: 2,
        petId: petId,
        vaccineName: '광견병 백신',
        vaccineType: '광견병',
        vaccineDate: '2024-01-15',
        nextDueDate: '2025-01-15',
        veterinarian: '박수의사',
        clinicName: '강남동물병원',
        notes: '광견병 예방접종 완료'
      }
    ];
  }

  async createVaccination(vaccination: any): Promise<any> {
    const newVaccination = {
      id: Date.now(),
      ...vaccination,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return newVaccination;
  }

  async updateVaccination(id: number, data: any): Promise<any> {
    return { id, ...data, updatedAt: new Date() };
  }

  async deleteVaccination(id: number): Promise<boolean> {
    return true;
  }

  async getCheckups(petId: number): Promise<any[]> {
    // 해당 반려동물의 건강검진 기록 조회
    return Array.from(this.checkups.values()).filter(
      (checkup: any) => checkup.petId === petId
    );
  }

  async createCheckup(checkup: any): Promise<any> {
    const newCheckup = {
      id: this.checkupId++,
      ...checkup,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.checkups.set(newCheckup.id, newCheckup);
    return newCheckup;
  }

  async updateCheckup(id: number, data: any): Promise<any> {
    const checkup = this.checkups.get(id);
    if (checkup) {
      const updatedCheckup = { ...checkup, ...data, updatedAt: new Date() };
      this.checkups.set(id, updatedCheckup);
      return updatedCheckup;
    }
    return null;
  }

  async deleteCheckup(id: number): Promise<boolean> {
    return this.checkups.delete(id);
  }

  // 메시지 관련 메서드 구현
  async getMessages(userId: number): Promise<any[]> {
    return Array.from(this.messages.values()).filter(
      (message: any) => message.receiverId === userId || message.senderId === userId
    );
  }

  async getMessage(id: number): Promise<any | undefined> {
    return this.messages.get(id);
  }

  async createMessage(message: any): Promise<any> {
    const newMessage = {
      id: this.messageId++,
      ...message,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.messages.set(newMessage.id, newMessage);
    return newMessage;
  }

  async updateMessage(id: number, data: any): Promise<any> {
    const message = this.messages.get(id);
    if (message) {
      const updatedMessage = { ...message, ...data, updatedAt: new Date() };
      this.messages.set(id, updatedMessage);
      return updatedMessage;
    }
    return null;
  }

  async deleteMessage(id: number): Promise<boolean> {
    return this.messages.delete(id);
  }

  async markMessageAsRead(id: number): Promise<any> {
    const message = this.messages.get(id);
    if (message) {
      message.status = 'read';
      message.readAt = new Date();
      this.messages.set(id, message);
      return message;
    }
    return null;
  }

  // 알림 관련 메서드 구현
  async getNotifications(userId: number): Promise<any[]> {
    return Array.from(this.notifications.values()).filter(
      (notification: any) => notification.userId === userId
    );
  }

  async getNotification(id: number): Promise<any | undefined> {
    return this.notifications.get(id);
  }

  async createNotification(notification: any): Promise<any> {
    const newNotification = {
      id: this.notificationId++,
      ...notification,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.notifications.set(newNotification.id, newNotification);
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<any> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.status = 'read';
      notification.readAt = new Date();
      this.notifications.set(id, notification);
      return notification;
    }
    return null;
  }

  async deleteNotification(id: number): Promise<boolean> {
    return this.notifications.delete(id);
  }

  // 화상 수업 관련 메서드 구현
  async getVideoClasses(): Promise<any[]> {
    // 샘플 화상 수업 데이터 반환
    return [
      {
        id: 1,
        title: '강아지 기초 훈련 마스터 클래스',
        trainer: '김민수',
        trainerId: 3,
        price: 45000,
        duration: 60,
        rating: 4.8,
        reviews: 24,
        image: '/images/video-class-basic-training.jpg',
        trainerImage: '/images/trainer-kim-profile.jpg',
        tags: ['기초훈련', '신규견주', '온라인'],
        description: '반려견의 기본적인 훈련 방법을 배우는 실시간 화상 수업입니다.',
        availability: '매주 토요일 14:00-15:00',
        status: 'open',
        seatsTotal: 8,
        seatsBooked: 3,
        nextSession: '2024-01-27T14:00:00Z'
      },
      {
        id: 2,
        title: '고양이 행동 교정 클래스',
        trainer: '이준호',
        trainerId: 4,
        price: 38000,
        duration: 45,
        rating: 4.6,
        reviews: 18,
        image: '/images/video-class-cat-behavior.jpg',
        trainerImage: '/images/trainer-lee-profile.jpg',
        tags: ['행동교정', '고양이', '온라인'],
        description: '고양이의 문제 행동을 이해하고 교정하는 방법을 배웁니다.',
        availability: '매주 일요일 15:00-15:45',
        status: 'open',
        seatsTotal: 6,
        seatsBooked: 2,
        nextSession: '2024-01-28T15:00:00Z'
      }
    ];
  }

  async getVideoClass(id: number): Promise<any | undefined> {
    const classes = await this.getVideoClasses();
    return classes.find((cls: any) => cls.id === id);
  }

  async createVideoClass(videoClass: any): Promise<any> {
    const newClass = {
      id: Date.now(),
      ...videoClass,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return newClass;
  }

  async updateVideoClass(id: number, data: any): Promise<any> {
    return { id, ...data, updatedAt: new Date() };
  }

  async deleteVideoClass(id: number): Promise<boolean> {
    return true;
  }

  // 예약 관련 메서드 구현
  async getReservations(userId?: number): Promise<any[]> {
    // 샘플 예약 데이터 반환
    const reservations = [
      {
        id: 1,
        classId: 1,
        userId: 2,
        userName: '반려인',
        reservationDate: '2024-01-27',
        reservationTime: '14:00',
        status: 'confirmed',
        paymentStatus: 'paid',
        createdAt: new Date(),
        notes: '강아지 기초 훈련에 대해 배우고 싶습니다.',
        petInfo: {
          name: '멍멍이',
          breed: '골든 리트리버',
          age: 3
        }
      },
      {
        id: 2,
        classId: 2,
        userId: 2,
        userName: '반려인',
        reservationDate: '2024-01-28',
        reservationTime: '15:00',
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date(),
        notes: '고양이 행동 교정이 필요합니다.',
        petInfo: {
          name: '야옹이',
          breed: '페르시안',
          age: 2
        }
      }
    ];

    if (userId) {
      return reservations.filter((reservation: any) => reservation.userId === userId);
    }
    return reservations;
  }

  async getReservation(id: number): Promise<any | undefined> {
    const reservations = await this.getReservations();
    return reservations.find((reservation: any) => reservation.id === id);
  }

  async createReservation(reservation: any): Promise<any> {
    const newReservation = {
      id: Date.now(),
      ...reservation,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return newReservation;
  }

  async updateReservation(id: number, data: any): Promise<any> {
    return { id, ...data, updatedAt: new Date() };
  }

  async cancelReservation(id: number): Promise<any> {
    return { id, status: 'cancelled', updatedAt: new Date() };
  }
}

// Export the storage instance
export const storage = new MemoryStorage();
interface Pet {
    id: number;
    userId: number;
    name: string;
    breed: string;
    age: number;
    weight: number;
    gender: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

interface CommunityPost {
    id: number;
    title: string;
    content: string;
    tag: string;
    author: { id: number; name: string };
    authorId: number;
    likes: number;
    comments: number;
    views: number;
    createdAt: string | Date;
    updatedAt?: string | Date;
    hidden?: boolean;
    linkInfo?: {
        url: string;
        title: string;
        description: string;
        image?: string;
    };
}

interface ShoppingItem {
    id: number;
    name: string;
    price: number;
    description: string;
}

interface Course {
    id: number;
    name: string;
    description: string;
}

interface Reservation {
    id: number;
    courseId: number;
    userId: number;
    date: string;
}

interface Consultation {
    id: number;
    trainerId: number;
    petId: number;
    date: string;
}

interface Trainer {
    id: number;
    name: string;
    specialty: string;
}

interface Institute {
    id: number;
    name: string;
    location: string;
}

interface NotebookEntry {
    id: number;
    petId: number;
    content: string;
}

interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
}

interface Notification {
    id: number;
    userId: number;
    message: string;
}

interface Commission {
    id: number;
    rate: number;
}

interface Invoice {
    id: number;
    userId: number;
    amount: number;
}

interface Transaction {
    id: number;
    userId: number;
    amount: number;
}

interface Event {
    id: number;
    name: string;
    location: string;
}

interface Promotion {
    id: number;
    name: string;
    discount: number;
}

interface HealthRecord {
    id: number;
    petId: number;
    date: string;
    notes: string;
}

interface Vaccination {
    id: number;
    petId: number;
    name: string;
    date: string;
}

interface WeightRecord {
    id: number;
    petId: number;
    date: string;
    weight: number;
}

interface Medication {
    id: number;
    petId: number;
    name: string;
    dosage: string;
}

interface NutritionPlan {
    id: number;
    petId: number;
    plan: string;
}

interface HealthReminder {
    id: number;
    petId: number;
    text: string;
    dueDate: string;
}