import { posts, users, pets, products, orders, comments, notifications, type User, type Pet } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Community Post type for compatibility
export type CommunityPost = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  category?: string;
  tags?: string[];
  views: number;
  likes: number;
  commentsCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  linkInfo?: {
    url: string;
    title: string;
    description: string;
    image?: string;
  };
};

// Minimal interface for basic operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  
  // Pet operations
  getPetsByOwnerId(ownerId: number): Promise<Pet[]>;
  
  // Post operations
  getAllPosts(): Promise<CommunityPost[]>;
  getPostById(id: number): Promise<CommunityPost | undefined>;
  createPost(post: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<CommunityPost>;
  updatePost(id: number, post: Partial<CommunityPost>): Promise<CommunityPost>;
  deletePost(id: number): Promise<void>;
  searchPosts(query: string): Promise<CommunityPost[]>;
  
  // Logo operations
  uploadLogo(logoType: 'main' | 'compact' | 'favicon', filename: string, buffer: Buffer): Promise<string>;
  getLogo(logoType: 'main' | 'compact' | 'favicon'): Promise<string | null>;
  updateLogo(logoType: 'main' | 'compact' | 'favicon', filename: string): Promise<void>;
  deleteLogo(logoType: 'main' | 'compact' | 'favicon'): Promise<void>;
  
  // Logo settings operations
  getLogoSettings(): Promise<any>;
  updateLogoSettings(settings: any): Promise<any>;
  resetLogoSettings(): Promise<any>;
}

// In-memory storage implementation
export class MemoryStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private pets: Map<number, Pet> = new Map();
  private posts: Map<number, CommunityPost> = new Map();
  private logos: Map<string, string> = new Map();
  private logoSettings: any = null;
  private nextId = 1;

  constructor() {
    this.initializeSampleData();
    this.initializeLogoSettings();
  }

  private initializeSampleData() {
    // Create sample users
    const sampleUsers = [
      {
        id: 1,
        username: "admin",
        email: "admin@talez.com",
        password: "hashed_password",
        role: "admin",
        name: "관리자",
        phone: "010-1234-5678",
        profileImage: null,
        bio: "시스템 관리자입니다.",
        isActive: true,
        emailVerified: true,
        subscriptionTier: "premium",
        referralCode: "ADMIN001",
        aiUsage: 0,
        points: 1000,
        fullName: "시스템 관리자",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        username: "trainer1",
        email: "trainer@talez.com",
        password: "hashed_password",
        role: "trainer",
        name: "강동훈",
        phone: "010-2345-6789",
        profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=trainer1",
        bio: "전문 반려동물 훈련사입니다.",
        isActive: true,
        emailVerified: true,
        subscriptionTier: "professional",
        referralCode: "TRAINER001",
        aiUsage: 50,
        points: 500,
        fullName: "강동훈 훈련사",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        username: "petowner1",
        email: "owner@talez.com",
        password: "hashed_password",
        role: "pet-owner",
        name: "김지영",
        phone: "010-3456-7890",
        profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=petowner1",
        bio: "골든리트리버 맥스의 엄마입니다.",
        isActive: true,
        emailVerified: true,
        subscriptionTier: "free",
        referralCode: "OWNER001",
        aiUsage: 10,
        points: 100,
        fullName: "김지영",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Create sample pets
    const samplePets = [
      {
        id: 1,
        name: "맥스",
        species: "dog",
        breed: "골든리트리버",
        age: 3,
        weight: 30.5,
        ownerId: 3,
        profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=max",
        notes: "활발하고 친근한 성격",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "루나",
        species: "dog",
        breed: "보더콜리",
        age: 2,
        weight: 22.0,
        ownerId: 3,
        profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=luna",
        notes: "똑똑하고 학습능력이 뛰어남",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Create sample posts with Korean search terms
    const samplePosts = [
      {
        id: 1,
        title: "펫로스 극복하기 - 반려동물을 잃은 슬픔을 이겨내는 방법",
        content: "반려동물을 잃은 슬픔은 매우 깊고 복잡한 감정입니다. 이 글에서는 펫로스 극복을 위한 실질적인 방법들을 소개합니다.",
        authorId: 2,
        category: "건강관리",
        tags: ["펫로스", "반려동물", "슬픔", "극복"],
        views: 128,
        likes: 45,
        commentsCount: 12,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        linkInfo: {
          url: "https://example.com/petloss-guide",
          title: "펫로스 극복 가이드",
          description: "반려동물을 잃은 슬픔을 건강하게 극복하는 방법",
          image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=200&fit=crop"
        }
      },
      {
        id: 2,
        title: "반려동물 관련 법률정보 총정리",
        content: "반려동물 등록제, 동물보호법, 손해배상책임 등 반려동물과 관련된 법률정보를 정리했습니다.",
        authorId: 1,
        category: "법률정보",
        tags: ["법률정보", "동물보호법", "반려동물등록", "법률"],
        views: 89,
        likes: 23,
        commentsCount: 8,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        linkInfo: {
          url: "https://example.com/pet-law",
          title: "반려동물 법률 가이드",
          description: "반려동물 관련 법률과 규정 안내",
          image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&h=200&fit=crop"
        }
      },
      {
        id: 3,
        title: "반려동물과 함께하는 여행정보",
        content: "반려동물과 함께 여행할 때 필요한 준비사항과 애완동물 동반 가능한 숙소 정보를 공유합니다.",
        authorId: 3,
        category: "여행정보",
        tags: ["여행정보", "반려동물여행", "펜션", "호텔"],
        views: 156,
        likes: 67,
        commentsCount: 15,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        linkInfo: {
          url: "https://example.com/pet-travel",
          title: "반려동물 여행 가이드",
          description: "펫과 함께하는 안전하고 즐거운 여행 팁",
          image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=200&fit=crop"
        }
      }
    ];

    // Initialize data
    sampleUsers.forEach(user => this.users.set(user.id, user as User));
    samplePets.forEach(pet => this.pets.set(pet.id, pet as Pet));
    samplePosts.forEach(post => this.posts.set(post.id, post));
    
    this.nextId = Math.max(...sampleUsers.map(u => u.id), ...samplePets.map(p => p.id), ...samplePosts.map(p => p.id)) + 1;
  }

  private initializeLogoSettings() {
    // Initialize with default logo settings
    this.logoSettings = {
      main: "/images/logo-light.svg",
      mainDark: "/images/logo-dark.svg", 
      compact: "/images/logo-symbol-light.svg",
      compactDark: "/images/logo-symbol-dark.svg",
      favicon: "/images/favicon.svg"
    };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser = {
      ...user,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getPetsByOwnerId(ownerId: number): Promise<Pet[]> {
    return Array.from(this.pets.values()).filter(pet => pet.ownerId === ownerId);
  }

  async getAllPosts(): Promise<CommunityPost[]> {
    return Array.from(this.posts.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPostById(id: number): Promise<CommunityPost | undefined> {
    return this.posts.get(id);
  }

  async createPost(post: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<CommunityPost> {
    const newPost = {
      ...post,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.posts.set(newPost.id, newPost);
    return newPost;
  }

  async updatePost(id: number, post: Partial<CommunityPost>): Promise<CommunityPost> {
    const existingPost = this.posts.get(id);
    if (!existingPost) {
      throw new Error(`Post with id ${id} not found`);
    }
    const updatedPost = {
      ...existingPost,
      ...post,
      updatedAt: new Date(),
    };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<void> {
    this.posts.delete(id);
  }

  async searchPosts(query: string): Promise<CommunityPost[]> {
    const decodedQuery = decodeURIComponent(query).toLowerCase();
    return Array.from(this.posts.values()).filter(post => 
      post.title.toLowerCase().includes(decodedQuery) ||
      post.content.toLowerCase().includes(decodedQuery) ||
      post.category?.toLowerCase().includes(decodedQuery) ||
      post.tags?.some(tag => tag.toLowerCase().includes(decodedQuery))
    );
  }

  // Logo operations
  async uploadLogo(logoType: 'main' | 'compact' | 'favicon', filename: string, buffer: Buffer): Promise<string> {
    const logoPath = `/uploads/logos/${logoType}-${filename}`;
    this.logos.set(logoType, logoPath);
    return logoPath;
  }

  async getLogo(logoType: 'main' | 'compact' | 'favicon'): Promise<string | null> {
    return this.logos.get(logoType) || null;
  }

  async updateLogo(logoType: 'main' | 'compact' | 'favicon', filename: string): Promise<void> {
    const logoPath = `/uploads/logos/${logoType}-${filename}`;
    this.logos.set(logoType, logoPath);
  }

  async deleteLogo(logoType: 'main' | 'compact' | 'favicon'): Promise<void> {
    this.logos.delete(logoType);
  }

  // Logo settings methods
  async getLogoSettings(): Promise<any> {
    return this.logoSettings;
  }

  async updateLogoSettings(settings: any): Promise<any> {
    this.logoSettings = { ...this.logoSettings, ...settings };
    return this.logoSettings;
  }

  async resetLogoSettings(): Promise<any> {
    this.logoSettings = {
      main: "/images/logo-light.svg",
      mainDark: "/images/logo-dark.svg", 
      compact: "/images/logo-symbol-light.svg",
      compactDark: "/images/logo-symbol-dark.svg",
      favicon: "/images/favicon.svg"
    };
    return this.logoSettings;
  }

  // Course operations (필요한 메서드들 추가)
  async getAllCourses(): Promise<any[]> {
    // 샘플 강의 데이터 반환
    return [
      {
        id: 1,
        title: "기초 반려견 훈련",
        description: "반려견 기본 훈련 강의",
        instructor: "김훈련사",
        price: 150000,
        duration: "4주",
        level: "초급",
        enrollments: 45,
        rating: 4.8,
        status: "active"
      },
      {
        id: 2,
        title: "고급 행동 교정",
        description: "문제 행동 교정 전문 강의",
        instructor: "이전문가",
        price: 280000,
        duration: "6주",
        level: "고급",
        enrollments: 23,
        rating: 4.9,
        status: "active"
      }
    ];
  }

  // Pet operations (필요한 메서드들 추가)
  async getAllPets(): Promise<Pet[]> {
    return Array.from(this.pets.values());
  }

  // Statistics operations (대시보드용)
  async getSystemStats(): Promise<any> {
    return {
      totalUsers: this.users.size,
      totalPets: this.pets.size,
      totalPosts: this.posts.size,
      totalCourses: 2,
      activeUsers: Math.floor(this.users.size * 0.3),
      newUsers: Math.floor(this.users.size * 0.1),
      serverUptime: "99.8%",
      responseTime: "180ms",
      memoryUsage: "45%",
      diskUsage: "23%"
    };
  }

  // Trainer operations (훈련사 관리용)
  async getAllTrainers(): Promise<any[]> {
    return [
      {
        id: 1,
        name: "강동훈",
        specialty: "기본 훈련",
        certifications: ["국가공인 동물훈련사"],
        rating: 4.9,
        experience: "8년",
        location: "경북 구미시",
        status: "active"
      }
    ];
  }

  // Institute operations (기관 관리용)
  async getAllInstitutes(): Promise<any[]> {
    return [
      {
        id: 1,
        name: "왕짱스쿨",
        type: "전문 훈련소",
        location: "경북 구미시",
        certification: "인증 완료",
        students: 150,
        courses: 8,
        status: "active"
      }
    ];
  }

  // Event operations (이벤트 관리용)
  async getAllEvents(): Promise<any[]> {
    return [
      {
        id: 1,
        title: "반려견 건강 관리 세미나",
        description: "전문 수의사와 함께하는 건강 관리 교육",
        date: "2025-01-15",
        location: "서울 강남구",
        participants: 45,
        maxParticipants: 100,
        status: "active"
      },
      {
        id: 2,
        title: "펫 트레이닝 워크샵",
        description: "기본적인 펫 트레이닝 방법론 워크샵",
        date: "2025-01-20",
        location: "경기 수원시",
        participants: 23,
        maxParticipants: 50,
        status: "active"
      }
    ];
  }

  // Curriculum operations (커리큘럼 관리용)
  async getAllCurricula(): Promise<any[]> {
    return [
      {
        id: 1,
        title: "기초 반려견 훈련 커리큘럼",
        description: "초보자를 위한 기본 훈련 과정",
        modules: [
          { id: 1, title: "기본 명령어", duration: "2시간" },
          { id: 2, title: "산책 훈련", duration: "1.5시간" },
          { id: 3, title: "사회화 훈련", duration: "2시간" }
        ],
        instructor: "강동훈",
        price: 450000,
        duration: "4주",
        level: "초급",
        status: "published"
      }
    ];
  }

  // Member operations (회원 관리용)
  async getAllMembers(): Promise<any[]> {
    return Array.from(this.users.values()).map(user => ({
      ...user,
      status: "active",
      joinDate: user.createdAt,
      lastLogin: new Date(),
      plan: "basic"
    }));
  }

  // Registration operations (등록 관리용)
  async getAllRegistrations(): Promise<any[]> {
    return [
      {
        id: 1,
        type: "business",
        applicantName: "김사업자",
        businessName: "펫케어센터",
        status: "pending",
        submittedAt: new Date(),
        documents: ["사업자등록증", "자격증"],
        location: "서울 강남구"
      }
    ];
  }

  // Review operations (리뷰 관리용)
  async getAllReviews(): Promise<any[]> {
    return [
      {
        id: 1,
        userId: 1,
        userName: "김지영",
        serviceType: "training",
        serviceName: "기초 훈련",
        rating: 5,
        content: "정말 유용한 훈련이었습니다!",
        createdAt: new Date(),
        status: "published"
      }
    ];
  }

  // Content operations (컨텐츠 관리용)
  async getAllContents(): Promise<any[]> {
    return [
      {
        id: 1,
        title: "반려견 건강 관리 가이드",
        type: "article",
        author: "전문가",
        status: "published",
        views: 1250,
        likes: 89,
        createdAt: new Date(),
        category: "health"
      }
    ];
  }

  // Info correction request operations (정보 수정 요청 관리용)
  async getAllInfoCorrectionRequests(): Promise<any[]> {
    return [
      {
        id: 1,
        requesterId: 1,
        requesterName: "김지영",
        type: "profile",
        originalData: { name: "김지영", phone: "010-1234-5678" },
        requestedData: { name: "김지영", phone: "010-9876-5432" },
        reason: "전화번호 변경",
        status: "pending",
        submittedAt: new Date()
      }
    ];
  }
}

// Export storage instance
export const storage = new MemoryStorage();