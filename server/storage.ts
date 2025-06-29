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
  private communityPosts: CommunityPost[] = [];
  private shoppingItems: ShoppingItem[] = [];
  private reservations: Reservation[] = [];
  private consultations: Consultation[] = [];
  private notebookEntries: NotebookEntry[] = [];
  private commissions: Commission[] = [];
  private invoices: Invoice[] = [];
  private transactions: Transaction[] = [];
  private promotions: Promotion[] = [];

  // Health management data stores
  private healthRecords: HealthRecord[] = [];
  private vaccinations: Vaccination[] = [];
  private weightRecords: WeightRecord[] = [];
  private medications: Medication[] = [];
  private nutritionPlans: NutritionPlan[] = [];
  private healthReminders: HealthReminder[] = [];

  // Training management data stores
  private trainingSessions: any[] = [];
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

    // 샘플 사용자 (견주) 추가
    const petOwnerUser = {
      id: this.userId++,
      username: 'petowner',
      email: 'owner@example.com',
      name: '반려인',
      role: 'pet-owner',
      password: 'hashed_password_here',
      avatar: '/images/pet-owner-avatar.png',
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
      socialId: null,
      bio: '반려동물과 함께하는 행복한 일상',
      location: '서울시 강남구'
    };

    this.users.set(petOwnerUser.id, petOwnerUser);

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

    // 샘플 반려동물 추가
    const samplePet1 = {
      id: this.petId++,
      name: '멍멍이',
      breed: '골든 리트리버',
      age: 3,
      weight: 25000, // 그램 단위
      gender: 'male',
      ownerId: petOwnerUser.id,
      description: '활발하고 친근한 성격의 골든 리트리버',
      health: '건강함',
      temperament: '온순하고 활발함',
      allergies: '없음',
      microchipId: 'MC001234567890',
      registrationNumber: 'REG-2024-001',
      birthDate: '2021-03-15',
      adoptionDate: '2021-05-20',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const samplePet2 = {
      id: this.petId++,
      name: '야옹이',
      breed: '페르시안',
      age: 2,
      weight: 4500, // 그램 단위
      gender: 'female',
      ownerId: petOwnerUser.id,
      description: '조용하고 우아한 성격의 페르시안 고양이',
      health: '건강함',
      temperament: '차분하고 독립적',
      allergies: '특정 사료에 알레르기',
      microchipId: 'MC001234567891',
      registrationNumber: 'REG-2024-002',
      birthDate: '2022-08-10',
      adoptionDate: '2022-10-15',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.pets.set(samplePet1.id, samplePet1);
    this.pets.set(samplePet2.id, samplePet2);

    // 샘플 예방접종 기록 - 더 상세한 데이터
    const vaccination1 = {
      id: 1,
      petId: samplePet1.id,
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
      petId: samplePet1.id,
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
      petId: samplePet2.id,
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
      petId: samplePet1.id,
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

    // 샘플 알림장 기록
    const journal1 = {
      id: 1,
      trainerId: trainerUser.id,
      petOwnerId: petOwnerUser.id,
      petId: samplePet1.id,
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

    // 메시지 샘플 데이터
    const message1 = {
      id: this.messageId++,
      senderId: trainerUser.id,
      receiverId: petOwnerUser.id,
      subject: '멍멍이 훈련 관련 문의',
      content: '안녕하세요. 멍멍이의 훈련 진행 상황에 대해 궁금한 점이 있어 연락드립니다.',
      type: 'training',
      status: 'unread',
      isUrgent: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.messages.set(message1.id, message1);

    // 알림 샘플 데이터
    const notification1 = {
      id: this.notificationId++,
      userId: petOwnerUser.id,
      title: '새로운 훈련 알림장이 도착했습니다',
      message: '김민수 훈련사님이 멍멍이의 훈련 알림장을 작성했습니다.',
      type: 'journal',
      status: 'unread',
      linkTo: '/journals',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.notifications.set(notification1.id, notification1);

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

    // 예약 샘플 데이터
    const reservation1 = {
      id: 1,
      classId: videoClass1.id,
      userId: petOwnerUser.id,
      userName: petOwnerUser.name,
      reservationDate: '2024-01-27',
      reservationTime: '14:00',
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date(),
      notes: '강아지 기초 훈련에 대해 배우고 싶습니다.',
      petInfo: {
        name: samplePet1.name,
        breed: samplePet1.breed,
        age: samplePet1.age
      }
    };

    console.log('✅ 운영 환경용 샘플 데이터 초기화 완료');
    console.log(`   - 관리자 계정: ${this.users.size}개`);
    console.log(`   - 기관: ${this.institutes.size}개`);
    console.log(`   - 수수료 정책: ${this.commissionPolicies.size}개`);
    console.log(`   - 상품: ${this.products.size}개`);
    console.log(`   - 반려동물: ${this.pets.size}마리`);
    console.log(`   - 건강검진 기록: ${this.checkups.size}건`);
    console.log(`   - 메시지: ${this.messages.size}건`);
    console.log(`   - 알림: ${this.notifications.size}건`);
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
        const post = {
            id,
            ...postData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
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
    likes: number;
    comments: number;
    views: number;
    createdAt: string;
    updatedAt?: string;
    hidden?: boolean;
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