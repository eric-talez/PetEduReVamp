// 중앙 집중식 데이터 소스 - 모든 컴포넌트에서 일관된 데이터 사용
export interface TrainerData {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  students: number;
  totalCourses: number;
  location: string;
  phone: string;
  email: string;
  avatar: string;
  description: string;
  certifications: string[];
  specialties: string[];
  courses: {
    id: number;
    title: string;
    price: number;
    duration: string;
  }[];
  // TALEZ 인증 정보
  talezCertificationStatus?: 'pending' | 'verified' | 'rejected';
  talezCertificationDate?: string;
  talezCertificationLevel?: 'basic' | 'advanced' | 'expert';
  licenseNumber?: string;
}

export interface ProductData {
  id: number;
  name: string;
  description: string;
  price: number;
  discountRate?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  referralCommission?: number;
  brand?: string;
  sku?: string;
  stock?: number;
  totalSales?: number;
  tags?: string[];
}

export interface BusinessData {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  rating: number;
  reviewCount: number;
  category: string;
  operatingHours?: {
    weekday: { open: string; close: string };
    weekend: { open: string; close: string };
  };
  services: string[];
  facilities?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  images?: string[];
  isVerified?: boolean;
}

export interface InstituteData {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  rating: number;
  reviewCount: number;
  images: string[];
  facilities: string[];
  services: string[];
  operatingHours: {
    weekday: { open: string; close: string };
    weekend: { open: string; close: string };
  };
  trainers: TrainerData[];
  isVerified: boolean;
  establishedYear: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  maxMembers?: number;
  maxVideoHours?: number;
  maxAiAnalysis?: number;
  currentVideoUsage?: number;
  currentAiUsage?: number;
}

// 실제 훈련사 데이터
export const TRAINERS: TrainerData[] = [
  {
    id: 1,
    name: "김민수",
    specialty: "반려견 기본 훈련",
    experience: "10년",
    rating: 4.9,
    reviews: 156,
    students: 450,
    totalCourses: 12,
    location: "서울 강남구",
    phone: "010-1234-5678",
    email: "trainer1@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
    description: "10년 이상의 경험을 가진 전문 반려견 훈련사로, 특히 기본 순종 훈련과 문제 행동 교정에 탁월한 실력을 보유하고 있습니다.",
    certifications: ["KKF 공인 훈련사", "CCPDT-KA 자격증", "반려동물 행동분석사"],
    specialties: ["기본 순종 훈련", "문제 행동 교정", "사회화 훈련"],
    courses: [
      { id: 1, title: "기본 순종 훈련", price: 150000, duration: "4주" },
      { id: 2, title: "문제 행동 교정", price: 200000, duration: "6주" }
    ],
    talezCertificationStatus: 'verified',
    talezCertificationLevel: 'advanced',
    licenseNumber: 'TZ2023-ADV-001'
  },
  {
    id: 2,
    name: "이수진",
    specialty: "배변 훈련 전문",
    experience: "8년",
    rating: 4.8,
    reviews: 89,
    students: 320,
    totalCourses: 8,
    location: "서울 서초구",
    phone: "010-2345-6789",
    email: "trainer2@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
    description: "배변 훈련과 실내 훈련 전문가로, 어린 강아지부터 성견까지 효과적인 훈련 방법을 제공합니다.",
    certifications: ["IAABC 공인 훈련사", "반려동물 배변 전문가"],
    specialties: ["배변 훈련", "실내 훈련", "어린 강아지 훈련"],
    courses: [
      { id: 3, title: "실내 배변 훈련", price: 120000, duration: "3주" },
      { id: 4, title: "어린 강아지 기초 훈련", price: 180000, duration: "5주" }
    ],
    talezCertificationStatus: 'verified',
    talezCertificationLevel: 'basic',
    licenseNumber: 'TZ2023-BAS-002'
  },
  {
    id: 6,
    name: "강동훈",
    specialty: "반려견 행동 교정",
    experience: "12년",
    rating: 4.9,
    reviews: 234,
    students: 650,
    totalCourses: 15,
    location: "경북 구미시",
    phone: "054-123-4567",
    email: "dongkang@wangzzang.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=강동훈&backgroundColor=6366f1&textColor=ffffff",
    description: "12년 경력의 전문 반려견 훈련사로, 왕짱스쿨을 운영하며 행동 교정과 기초 복종 훈련에 특화되어 있습니다. 국가 공인 동물 행동 지도사 자격을 보유하고 있으며, 장애인 반려견 훈련 프로그램도 운영하고 있습니다.",
    certifications: ["국가 공인 동물 행동 지도사", "반려동물 행동 교정 전문가", "장애인 반려견 훈련 지도사"],
    specialties: ["행동 교정", "기초 복종 훈련", "강아지 사회화", "장애인 반려견 훈련"],
    courses: [
      { id: 5, title: "기초 복종훈련 완전정복", price: 450000, duration: "8주" },
      { id: 6, title: "강아지 사회화 프로그램", price: 280000, duration: "4주" },
      { id: 7, title: "문제 행동 교정 과정", price: 380000, duration: "6주" }
    ],
    talezCertificationStatus: 'verified',
    talezCertificationLevel: 'expert',
    licenseNumber: 'TZ2023-EXP-006'
  }
];

// 실제 상품 데이터
export const PRODUCTS: ProductData[] = [
  {
    id: 1,
    name: "프리미엄 반려견 훈련용 클리커",
    description: "훈련사들이 추천하는 고품질 클리커. 명확한 소리로 반려견 훈련 효과를 높여줍니다.",
    price: 15000,
    category: "training",
    rating: 4.8,
    reviewCount: 126,
    image: "https://images.unsplash.com/photo-1598875384021-4a23470c7997?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    inStock: true,
    isBestseller: true,
    referralCommission: 10,
    brand: "PetTrainer Pro",
    sku: "PT-CLK-001",
    stock: 150,
    totalSales: 2450,
    tags: ["훈련", "클리커", "프리미엄"]
  },
  {
    id: 2,
    name: "반려견 지능 개발 장난감 세트",
    description: "반려견의 지능 개발을 돕는 다양한 퍼즐 장난감 세트. 지루함 해소와 두뇌 발달에 효과적입니다.",
    price: 35000,
    discountRate: 15,
    category: "toys",
    rating: 4.6,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    inStock: true,
    isNew: true,
    referralCommission: 15,
    brand: "SmartPet",
    sku: "SP-TOY-002",
    stock: 75,
    totalSales: 1200,
    tags: ["장난감", "지능개발", "퍼즐"]
  },
  {
    id: 3,
    name: "프리미엄 가죽 리드줄",
    description: "고급 이탈리안 가죽으로 제작된 내구성 강한 리드줄. 편안한 그립감과 세련된 디자인.",
    price: 45000,
    category: "accessories",
    rating: 4.9,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1581434271564-7e273485524c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    inStock: true,
    isBestseller: true,
    referralCommission: 12,
    brand: "LeatherCraft",
    sku: "LC-LED-003",
    stock: 100,
    totalSales: 3200,
    tags: ["리드줄", "가죽", "프리미엄"]
  },
  {
    id: 4,
    name: "유기농 강아지 간식 모음",
    description: "100% 유기농 재료로 만든 건강한 간식 모음. 알레르기가 있는 반려견에게도 안전합니다.",
    price: 28000,
    category: "food",
    rating: 4.7,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    inStock: true,
    isNew: true,
    referralCommission: 20,
    brand: "OrganicPet",
    sku: "OP-SNK-004",
    stock: 200,
    totalSales: 850,
    tags: ["간식", "유기농", "건강"]
  }
];

// 실제 업체 데이터
export const BUSINESSES: BusinessData[] = [
  {
    id: 1,
    name: "왕짱스쿨 구평점",
    description: "전문 반려견 훈련 및 행동 교정 서비스를 제공하는 왕짱스쿨의 구평점입니다.",
    address: "경북 구미시 구평동",
    phone: "054-123-4567",
    email: "gupeong@wangzzang.com",
    rating: 4.9,
    reviewCount: 87,
    category: "training",
    services: ["기초 복종 훈련", "행동 교정", "사회화 훈련", "장애인 반려견 훈련"],
    facilities: ["실내 훈련장", "야외 운동장", "상담실"],
    coordinates: { lat: 36.1184, lng: 128.3442 },
    isVerified: true,
    operatingHours: {
      weekday: { open: "09:00", close: "18:00" },
      weekend: { open: "09:00", close: "18:00" }
    }
  },
  {
    id: 2,
    name: "왕짱스쿨 석적점",
    description: "전문 반려견 훈련 및 행동 교정 서비스를 제공하는 왕짱스쿨의 석적점입니다.",
    address: "경북 칠곡군 석적읍",
    phone: "054-123-4568",
    email: "seokjeok@wangzzang.com",
    rating: 4.8,
    reviewCount: 65,
    category: "training",
    services: ["기초 복종 훈련", "행동 교정", "사회화 훈련", "장애인 반려견 훈련"],
    facilities: ["실내 훈련장", "야외 운동장", "상담실"],
    coordinates: { lat: 36.0345, lng: 128.4012 },
    isVerified: true,
    operatingHours: {
      weekday: { open: "09:00", close: "18:00" },
      weekend: { open: "09:00", close: "18:00" }
    }
  }
];

// 실제 기관 데이터
export const INSTITUTES: InstituteData[] = [
  {
    id: 1,
    name: "왕짱스쿨",
    description: "전문 반려견 훈련사 강동훈이 운영하는 반려견 전문 교육 기관입니다. 기초 복종 훈련부터 문제 행동 교정까지 체계적인 교육 프로그램을 제공합니다.",
    address: "경북 구미시 구평동",
    phone: "054-123-4567",
    email: "info@wangzzang.com",
    website: "https://wangzzang.com",
    rating: 4.9,
    reviewCount: 152,
    images: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60"
    ],
    facilities: ["실내 훈련장", "야외 운동장", "상담실", "주차장"],
    services: ["기초 복종 훈련", "행동 교정", "사회화 훈련", "장애인 반려견 훈련", "개인 상담"],
    operatingHours: {
      weekday: { open: "09:00", close: "18:00" },
      weekend: { open: "09:00", close: "18:00" }
    },
    trainers: [TRAINERS[2]], // 강동훈 훈련사
    isVerified: true,
    establishedYear: 2018,
    coordinates: { lat: 36.1184, lng: 128.3442 },
    subscriptionPlan: "professional",
    subscriptionStatus: "active",
    maxMembers: 200,
    maxVideoHours: 50,
    maxAiAnalysis: 100,
    currentVideoUsage: 12,
    currentAiUsage: 35
  }
];

// 데이터 조회 함수들
export const getTrainerById = (id: number): TrainerData | undefined => {
  return TRAINERS.find(trainer => trainer.id === id);
};

export const getProductById = (id: number): ProductData | undefined => {
  return PRODUCTS.find(product => product.id === id);
};

export const getBusinessById = (id: number): BusinessData | undefined => {
  return BUSINESSES.find(business => business.id === id);
};

export const getInstituteById = (id: number): InstituteData | undefined => {
  return INSTITUTES.find(institute => institute.id === id);
};

export const getAllTrainers = (): TrainerData[] => {
  return TRAINERS;
};

export const getAllProducts = (): ProductData[] => {
  return PRODUCTS;
};

export const getAllBusinesses = (): BusinessData[] => {
  return BUSINESSES;
};

export const getAllInstitutes = (): InstituteData[] => {
  return INSTITUTES;
};