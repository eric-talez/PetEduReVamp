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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userCiMap: Map<string, number>; // CI 값으로 사용자 ID를 찾기 위한 맵
  private userSocialMap: Map<string, number>; // 소셜 ID + 제공자로 사용자 ID를 찾기 위한 맵 (형식: "provider:socialId")
  private commissionPolicies: Map<number, any>;
  private commissionTransactions: Map<number, any>;
  private settlementReports: Map<number, any>;
  private commissionTiers: Map<number, any>;
  private pets: Map<number, any>;
  private courses: Map<number, any>;
  private institutes: Map<number, any>;
  private trainers: Map<number, any>;
  private enrollments: Map<number, any>;
  private events: Map<number, Event> = new Map();
  private eventLocations: Map<number, EventLocation> = new Map();
  private eventAttendances: Map<number, EventAttendance[]> = new Map();
  private communityPosts: any[] = [];
  private comments: any[] = [];

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
  private eventId: number = 1;
  private eventLocationId: number = 1;
  private eventAttendanceId: number = 1;

  constructor() {
    this.users = new Map();
    this.userCiMap = new Map(); // CI 맵 초기화
    this.userSocialMap = new Map(); // 소셜 ID 맵 초기화
    this.commissionPolicies = new Map();
    this.commissionTransactions = new Map();
    this.settlementReports = new Map();
    this.commissionTiers = new Map();
    this.pets = new Map();
    this.courses = new Map();
    this.institutes = new Map();
    this.trainers = new Map();
    this.enrollments = new Map();
    this.events = new Map();
    this.eventLocations = new Map();
    this.eventAttendances = new Map();

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
    this.eventId = 1;
    this.eventLocationId = 1;

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

    // 초기 훈련사 데이터 (실제 운영 업체 포함)
const initialTrainers = [
  {
    id: 1,
    name: "김민수 전문 훈련사",
    email: "trainer1@talez.co.kr",
    phone: "010-1234-5678",
    bio: "10년 경력의 전문 반려동물 훈련사입니다. 행동교정과 기본훈련을 전문으로 합니다.",
    specialties: ["행동교정", "기본훈련", "분리불안"],
    certifications: ["KKF 공인 훈련사", "동물행동학 전문가"],
    experience: 10,
    rating: 4.8,
    reviewCount: 156,
    price: 80000,
    availability: true,
    photo: "/uploads/photo-1748800087482-304379439.png",
    avatar: "/uploads/photo-1748800087482-304379439.png",
    address: "서울시 강남구",
    latitude: 37.5172,
    longitude: 127.0473
  },
  {
    id: 10,
    name: "도그아카데미",
    email: "info@dogacademy.co.kr",
    phone: "02-123-4567",
    bio: "전문 반려견 교육 및 훈련 전문 업체입니다. 15년 이상의 노하우로 안전하고 효과적인 교육을 제공합니다.",
    specialties: ["기본훈련", "고급훈련", "어질리티", "사회화"],
    certifications: ["반려동물관리사", "애견훈련사 자격증"],
    experience: 15,
    rating: 4.9,
    reviewCount: 324,
    price: 120000,
    availability: true,
    photo: "/uploads/photo-1748800087482-304379439.png",
    avatar: "/uploads/photo-1748800087482-304379439.png",
    address: "서울시 송파구 방이동",
    latitude: 37.5103,
    longitude: 127.1138
  },
  {
    id: 11,
    name: "펫트레이닝센터",
    email: "contact@pettraining.co.kr",
    phone: "02-987-6543",
    bio: "개별 맞춤형 훈련 프로그램으로 반려견의 문제행동을 근본적으로 해결합니다.",
    specialties: ["문제행동교정", "공격성교정", "분리불안", "배변훈련"],
    certifications: ["KKF 공인 훈련사", "동물행동치료사"],
    experience: 12,
    rating: 4.7,
    reviewCount: 189,
    price: 100000,
    availability: true,
    photo: "/uploads/photo-1748800087482-304379439.png",
    avatar: "/uploads/photo-1748800087482-304379439.png",
    address: "서울시 마포구 상암동",
    latitude: 37.5794,
    longitude: 126.8895
  },
  {
    id: 12,
    name: "해피독스쿨",
    email: "hello@happydogschool.com",
    phone: "031-456-7890",
    bio: "즐겁고 안전한 환경에서 반려견과 보호자가 함께 배우는 교육 프로그램을 운영합니다.",
    specialties: ["퍼피클래스", "기본훈련", "사회화", "놀이훈련"],
    certifications: ["반려동물관리사", "애견미용사"],
    experience: 8,
    rating: 4.6,
    reviewCount: 267,
    price: 75000,
    availability: true,
    photo: "/uploads/photo-1748800087482-304379439.png",
    avatar: "/uploads/photo-1748800087482-304379439.png",
    address: "경기도 성남시 분당구",
    latitude: 37.3595,
    longitude: 127.1052
  },
  {
    id: 13,
    name: "골든리트리버클럽",
    email: "info@goldenclub.kr",
    phone: "010-8765-4321",
    bio: "대형견 전문 훈련사로 골든리트리버, 래브라도 등 대형견 훈련에 특화되어 있습니다.",
    specialties: ["대형견훈련", "리트리버훈련", "수영훈련", "어질리티"],
    certifications: ["대형견 전문 훈련사", "수영 훈련 전문가"],
    experience: 13,
    rating: 4.8,
    reviewCount: 143,
    price: 150000,
    availability: true,
    photo: "/uploads/photo-1748800087482-304379439.png",
    avatar: "/uploads/photo-1748800087482-304379439.png",
    address: "경기도 용인시 기흥구",
    latitude: 37.2636,
    longitude: 127.0286
  }
];

    this.trainers.clear();
    initialTrainers.forEach(trainer => {
      this.trainers.set(trainer.id, trainer);
    });

    // 초기 기관 데이터 (실제 운영 업체 포함)
const initialInstitutes = [
  {
    id: 1,
    name: "서울펫아카데미",
    type: "교육기관",
    address: "서울시 강남구 테헤란로 123",
    description: "전문적인 반려동물 교육을 제공하는 기관입니다.",
    phone: "02-1234-5678",
    email: "info@seoulpetacademy.com",
    website: "https://seoulpetacademy.com",
    rating: 4.5,
    reviewCount: 89,
    category: "종합교육",
    facilities: ["실내훈련장", "야외운동장", "수영장"],
    certifications: ["교육청 인가", "동물보호단체 인증"],
    founded: 2015,
    logo: null,
    latitude: 37.5017,
    longitude: 127.0396
  },
  {
    id: 10,
    name: "강동애견훈련소",
    type: "훈련기관",
    address: "서울시 강동구 천호대로 456",
    description: "25년 전통의 전문 애견훈련소입니다. 기본훈련부터 전문훈련까지 체계적인 교육과정을 운영합니다.",
    phone: "02-456-7890",
    email: "gangdong@dogtraining.co.kr",
    website: "https://gangdong-training.com",
    rating: 4.7,
    reviewCount: 234,
    category: "전문훈련",
    facilities: ["대형 실내훈련장", "야외훈련장", "숙박시설", "놀이터"],
    certifications: ["농림축산식품부 허가", "한국애견협회 인증"],
    founded: 1998,
    logo: null,
    latitude: 37.5492,
    longitude: 127.1464
  },
  {
    id: 11,
    name: "부산동물행동센터",
    type: "행동교정기관",
    address: "부산시 해운대구 센텀중앙로 97",
    description: "반려동물 행동 문제 전문 교정 기관입니다. 수의사와 행동전문가가 함께 운영합니다.",
    phone: "051-123-4567",
    email: "info@busanbehavior.com",
    website: "https://busan-behavior.co.kr",
    rating: 4.9,
    reviewCount: 187,
    category: "행동교정",
    facilities: ["행동분석실", "개별상담실", "재활훈련장"],
    certifications: ["동물병원 면허", "행동분석사 자격"],
    founded: 2010,
    logo: null,
    latitude: 35.1695,
    longitude: 129.1281
  },
  {
    id: 12,
    name: "인천펫플러스",
    type: "종합교육센터",
    address: "인천시 연수구 컨벤시아대로 165",
    description: "반려동물 교육, 미용, 호텔 서비스를 한 곳에서 제공하는 종합 펫서비스 센터입니다.",
    phone: "032-987-6543",
    email: "petplus@incheon.kr",
    website: "https://incheon-petplus.com",
    rating: 4.6,
    reviewCount: 156,
    category: "종합서비스",
    facilities: ["교육장", "미용실", "펜션", "카페", "놀이터"],
    certifications: ["사업자등록", "동물미용사 자격"],
    founded: 2018,
    logo: null,
    latitude: 37.4095,
    longitude: 126.7211
  },
  {
    id: 13,
    name: "대전반려동물교육원",
    type: "교육기관",
    address: "대전시 유성구 대덕대로 512",
    description: "체계적인 커리큘럼과 전문 강사진을 통해 반려동물과 보호자 모두를 교육합니다.",
    phone: "042-321-9876",
    email: "education@daejeonpet.ac.kr",
    website: "https://daejeon-pet-edu.kr",
    rating: 4.4,
    reviewCount: 98,
    category: "교육기관",
    facilities: ["강의실", "실습장", "도서관", "상담실"],
    certifications: ["교육부 인가", "반려동물교육협회 인증"],
    founded: 2012,
    logo: null,
    latitude: 36.3504,
    longitude: 127.3845
  }];

    this.institutes.clear();
    initialInstitutes.forEach(institute => {
      this.institutes.set(institute.id, institute);
    });

    // 수수료 거래 샘플 데이터
    const transaction1 = {
      id: this.transactionId++,
      type: "trainer",
      referenceId: 1,
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
      referenceId: 1,
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
      referenceId: 2,
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
      referenceId: 1,
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
      referenceId: 1,
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
      trainerId: 1,
      instituteId: 1,
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
      trainerId: 2,
      instituteId: 2,
      isPopular: false,
      isCertified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.courses.set(course1.id, course1);
    this.courses.set(course2.id, course2);

    // 사용자 샘플 데이터
    const user1: User = {
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
      createdAt: new Date(),
      // 추가 필수 필드
      ci: null,
      verified: false,
      verifiedAt: null,
      verificationName: null,
      verificationBirth: null, 
      verificationPhone: null,
      provider: null,
      socialId: null
    };

    const user2: User = {
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
      createdAt: new Date(),
      // 추가 필수 필드
      ci: null,
      verified: false,
      verifiedAt: null,
      verificationName: null,
      verificationBirth: null,
      verificationPhone: null,
      provider: null,
      socialId: null
    };

    // 테스트 사용자 추가 (비밀번호: test123을 암호화한 값)
    const user3: User = {
      id: this.currentId++,
      username: "testuser3",
      email: "testuser3@example.com",
      password: "test123", // 테스트용 평문 비밀번호
      name: "반려인",
      role: "pet-owner" as UserRole,
      avatar: null,
      bio: "테스트 반려인 계정입니다.",
      location: "서울시 강남구",
      specialty: null,
      isVerified: true,
      instituteId: null,
      createdAt: new Date(),
      // 추가 필수 필드
      ci: null,
      verified: false,
      verifiedAt: null,
      verificationName: null,
      verificationBirth: null,
      verificationPhone: null,
      provider: null,
      socialId: null
    };

    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    this.users.set(user3.id, user3);

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

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getAllPets(): Promise<any[]> {
    return Array.from(this.pets.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;

    // 필수 기본값 설정
    const user: User = {
      ...insertUser, 
      id, 
      role: (insertUser.role || 'user') as UserRole, // 기본 역할
      avatar: insertUser.avatar || null,
      bio: insertUser.bio || null,
      location: insertUser.location || null,
      specialty: insertUser.specialty || null,
      isVerified: insertUser.isVerified || false,
      instituteId: null,
      provider: insertUser.provider || null,
      socialId: insertUser.socialId || null,
      ci: insertUser.ci || null,
      verified: insertUser.verified || false,
      verifiedAt: insertUser.verifiedAt || null,
      verificationName: insertUser.verificationName || null,
      verificationBirth: insertUser.verificationBirth || null,
      verificationPhone: insertUser.verificationPhone || null,
      createdAt: new Date()
    };

    this.users.set(id, user);

    // CI 값이 있는 경우 CI 맵에 추가
    if (user.ci) {
      this.userCiMap.set(user.ci, id);
    }

    // 소셜 로그인 사용자인 경우 소셜 ID 맵에 추가
    if (user.provider && user.socialId) {
      const key = `${user.provider}:${user.socialId}`;
      this.userSocialMap.set(key, id);
      console.log(`소셜 계정 맵에 추가: ${key} -> ${id}`);
    }

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

    Adding deletePet method to the MemStorage class in storage.ts to enable pet deletion functionality.```text

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

  async getUserBySocialId(provider: string, socialId: string): Promise<User | undefined> {
    const key = `${provider}:${socialId}`;
    const userId = this.userSocialMap.get(key);
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

  async getPetById(id: number): Promise<any> {
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

  async updatePet(id: number, petData: any): Promise<any> {
    const existingPet = this.pets.get(id);
    if (!existingPet) {
      throw new Error("Pet not found");
    }

    const updatedPet = { 
      ...existingPet, 
      ...petData, 
      id, 
      updatedAt: new Date() 
    };
    this.pets.set(id, updatedPet);
    return updatedPet;
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

  // 이벤트 관련 메서드
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
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

  async getEventsByRegion(region: string): Promise<Event[]> {
    const events = Array.from(this.events.values());
    const locations = Array.from(this.eventLocations.values());

    return events.filter(event => {
      const location = locations.find(loc => loc.id === event.locationId);
      return location && location.region === region;
    });
  }

  async getEventsByCategory(category: string): Promise<Event[]> {
    const events = Array.from(this.events.values());
    return events.filter(event => event.category === category);
  }

  async checkEventAttendance(userId: number, eventId: number): Promise<boolean> {
    const attendances = this.eventAttendances.get(eventId) || [];
    return attendances.some(attendance => attendance.userId === userId);
  }

  async attendEvent(userId: number, eventId: number): Promise<EventAttendance> {
    const event = this.events.get(eventId);
    if (!event) {
      throw new Error('이벤트를 찾을 수 없습니다.');
    }

    const isAlreadyAttending = await this.checkEventAttendance(userId, eventId);
    if (isAlreadyAttending) {
      throw new Error('이미 참석 신청한 이벤트입니다.');
    }

    // 최대 참가자 수 확인
    if (event.maxAttendees !== null && (event.attendees || 0) >= event.maxAttendees) {
      throw new Error('이벤트 참가자 수가 최대치에 도달했습니다.');
    }

    // 참가자 수 증가
    event.attendees = (event.attendees || 0) + 1;
    this.events.set(eventId, event);

    // 참가 정보 추가
    const newAttendance: EventAttendance = {
      id: this.eventAttendanceId++,
      eventId,
      userId,
      createdAt: new Date()
    };

    const attendances = this.eventAttendances.get(eventId) || [];
    attendances.push(newAttendance);
    this.eventAttendances.set(eventId, attendances);

    return newAttendance;
  }

  async getEventLocation(id: number): Promise<EventLocation | undefined> {
    return this.eventLocations.get(id);
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

  // 커뮤니티 관련 메서드
  getPosts(category?: string, sort?: string) {
    let posts = [...this.communityPosts];

    if (category && category !== 'all') {
      posts = posts.filter(post => post.category === category);
    }

    if (sort === 'popular') {
      posts.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
    } else {
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return posts;
  }

  getPost(postId: number) {
    return this.communityPosts.find(post => post.id === postId);
  }

  addPost(post: any) {
    this.communityPosts.push(post);
    return post;
  }

  updatePost(postId: number, userId: number, updateData: any) {
    const postIndex = this.communityPosts.findIndex(post => post.id === postId && post.author.id === userId);
    if (postIndex === -1) return null;

    this.communityPosts[postIndex] = {
      ...this.communityPosts[postIndex],
      ...updateData,
      updatedAt: new Date()
    };
    return this.communityPosts[postIndex];
  }

  deletePost(postId: number, userId: number) {
    const postIndex = this.communityPosts.findIndex(post => post.id === postId && post.author.id === userId);
    if (postIndex === -1) return false;

    this.communityPosts.splice(postIndex, 1);
    return true;
  }

  toggleLike(postId: number, userId: number) {
    const post = this.getPost(postId);
    if (!post) return false;

    if (!post.likedBy) post.likedBy = [];

    const likedIndex = post.likedBy.indexOf(userId);
    if (likedIndex > -1) {
      post.likedBy.splice(likedIndex, 1);
      post.likes = Math.max(0, post.likes - 1);
      return false;
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
      return true;
    }
  }

  incrementCommentCount(postId: number) {
    const post = this.getPost(postId);
    if (post) {
      post.comments += 1;
    }
  }

  // 댓글 관련 메서드
  getCommentsByPostId(postId: number) {
    return this.comments.filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  getComment(commentId: number) {
    return this.comments.find(comment => comment.id === commentId);
  }

  addComment(comment: any) {
    this.comments.push(comment);
    return comment;
  }

  updateComment(commentId: number, userId: number, content: string) {
    const commentIndex = this.comments.findIndex(comment => 
      comment.id === commentId && comment.author.id === userId
    );
    if (commentIndex === -1) return null;

    this.comments[commentIndex].content = content;
    this.comments[commentIndex].updatedAt = new Date();
    return this.comments[commentIndex];
  }

  deleteComment(commentId: number, userId: number) {
    const commentIndex = this.comments.findIndex(comment => 
      comment.id === commentId && comment.author.id === userId
    );
    if (commentIndex === -1) return false;

    const comment = this.comments[commentIndex];
    this.comments.splice(commentIndex, 1);

    // 게시글의 댓글 수 감소
    const post = this.getPost(comment.postId);
    if (post) {
      post.comments = Math.max(0, post.comments - 1);
    }

    return true;
  }

  toggleCommentLike(commentId: number, userId: number) {
    const comment = this.getComment(commentId);
    if (!comment) return false;

    if (!comment.likedBy) comment.likedBy = [];
    if (!comment.likes) comment.likes = 0;

    const likedIndex = comment.likedBy.indexOf(userId);
    if (likedIndex > -1) {
      comment.likedBy.splice(likedIndex, 1);
      comment.likes = Math.max(0, comment.likes - 1);
      return false;
    } else {
      comment.likedBy.push(userId);
      comment.likes += 1;
      return true;
    }
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

  // 강좌 관련 메서드 - 임시로 빈 구현
  async getCourse(id: number): Promise<any> {
    return null;
  }

  async getAllCourses(): Promise<any[]> {
    return [];
  }

  async getCoursesByUserId(userId: number): Promise<any[]> {
    return [];
  }

  async createCourse(course: any): Promise<any> {
    return null;
  }

  async enrollUserInCourse(userId: number, courseId: number): Promise<any> {
    return null;
  }

  // 이벤트 관련 메서드 - 임시로 빈 구현
  async getAllEvents(): Promise<Event[]> {
    return [];
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return undefined;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    throw new Error("Not implemented");
  }

  async getEventsByRegion(region: string): Promise<Event[]> {
    return [];
  }

  async getEventsByCategory(category: string): Promise<Event[]> {
    return [];
  }

  async checkEventAttendance(userId: number, eventId: number): Promise<boolean> {
    return false;
  }

  async attendEvent(userId: number, eventId: number): Promise<EventAttendance> {
    throw new Error("Not implemented");
  }

  async getEventLocation(id: number): Promise<EventLocation | undefined> {
    return undefined;
  }

  async createEventLocation(location: InsertEventLocation): Promise<EventLocation> {
    throw new Error("Not implemented");
  }

  // 수수료 정책 관련 메서드 - 임시로 빈 구현
  async getCommissionPolicies(): Promise<any[]> {
    return [];
  }

  async getCommissionPolicy(id: number): Promise<any | undefined> {
    return undefined;
  }

  async createCommissionPolicy(policy: any): Promise<any> {
    return null;
  }

  async updateCommissionPolicy(id: number, data: any): Promise<any> {
    return null;
  }

  // 수수료 거래 관련 메서드 - 임시로 빈 구현
  async getCommissionTransactions(): Promise<any[]> {
    return [];
  }

  async getCommissionTransaction(id: number): Promise<any | undefined> {
    return undefined;
  }

  async createCommissionTransaction(transaction: any): Promise<any> {
    return null;
  }

  async updateCommissionTransaction(id: number, data: any): Promise<any> {
    return null;
  }

  // 정산 보고서 관련 메서드 - 임시로 빈 구현
  async getSettlementReports(): Promise<any[]> {
    return [];
  }

  async getSettlementReport(id: number): Promise<any | undefined> {
    return undefined;
  }

  async createSettlementReport(report: any): Promise<any> {
    return null;
  }

  async updateSettlementReport(id: number, data: any): Promise<any> {
    return null;
  }

  // Banner 관련 메서드 구현
  async getActiveBanners(type: string, position: string): Promise<Banner[]> {
    try {
      const { db } = await import('./db');
      const { eq, and, lte, gte, or, isNull } = await import('drizzle-orm');

      const now = new Date();

      const activeBanners = await db
        .select()
        .from(banners)
        .where(
          and(
            eq(banners.type, type),
            eq(banners.position, position),
            eq(banners.status, 'active'),
            eq(banners.isActive, true),
            or(
              isNull(banners.startDate),
              lte(banners.startDate, now)
            ),
            or(
              isNull(banners.endDate),
              gte(banners.endDate, now)
            )
          )
        )
        .orderBy(banners.orderIndex);

      return activeBanners;
    } catch (error) {
      console.error('배너 조회 오류:', error);
      return [];
    }
  }

  async getAllBanners(): Promise<Banner[]> {
    try {
      const { db } = await import('./db');

      const allBanners = await db
        .select()
        .from(banners)
        .orderBy(banners.createdAt);

      return allBanners;
    } catch (error) {
      console.error('전체 배너 조회 오류:', error);
      return [];
    }
  }

  async createBanner(banner: InsertBanner & { createdBy: number }): Promise<Banner> {
    try {
      const { db } = await import('./db');

      const [newBanner] = await db
        .insert(banners)
        .values({
          ...banner,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      return newBanner;
    } catch (error) {
      console.error('배너 생성 오류:', error);
      throw error;
    }
  }

  async updateBanner(id: number, data: Partial<InsertBanner>): Promise<Banner | undefined> {
    try {
      const { db } = await import('./db');
      const { eq } = await import('drizzle-orm');

      const [updatedBanner] = await db
        .update(banners)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(banners.id, id))
        .returning();

      return updatedBanner;
    } catch (error) {
      console.error('배너 수정 오류:', error);
      return undefined;
    }
  }

  async deleteBanner(id: number): Promise<boolean> {
    try {
      const { db } = await import('./db');
      const { eq } = await import('drizzle-orm');

      const result = await db
        .delete(banners)
        .where(eq(banners.id, id));

      return result.rowCount > 0;
    } catch (error) {
      console.error('배너 삭제 오류:', error);
      return false;
    }
  }

    async deletePet(id: number): Promise<boolean> {
        try {
            const { db } = await import('./db');
            const { eq } = await import('drizzle-orm');

            const result = await db
                .delete(pets)
                .where(eq(pets.id, id));

            return result.rowCount > 0;
        } catch (error) {
            console.error('반려동물 삭제 오류:', error);
            return false;
        }
    }
  async updatePet(id: number, pet: any): Promise<any> {
        try {
            const { db } = await import('./db');
            const { eq } = await import('drizzle-orm');

            const [updatedPet] = await db
                .update(pets)
                .set(pet)
                .where(eq(pets.id, id))
                .returning();

            return updatedPet;
        } catch (error) {
            console.error('반려동물 업데이트 오류:', error);
            return null;
        }
    }
}

export const storage = new DatabaseStorage();