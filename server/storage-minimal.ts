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
      logoLight: "/images/logo-light.svg",
      logoDark: "/images/logo-dark.svg", 
      logoSymbolLight: "/images/logo-symbol-light.svg",
      logoSymbolDark: "/images/logo-symbol-dark.svg"
    };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
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
      logoLight: "/images/logo-light.svg",
      logoDark: "/images/logo-dark.svg", 
      logoSymbolLight: "/images/logo-symbol-light.svg",
      logoSymbolDark: "/images/logo-symbol-dark.svg"
    };
    return this.logoSettings;
  }

  // 추가 메서드들
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserStats(): Promise<any> {
    const users = Array.from(this.users.values());
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive !== false).length;
    const inactiveUsers = totalUsers - activeUsers;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      newUsersToday: 0, // 실제 구현에서는 날짜 체크 필요
      newUsersThisWeek: 0,
      newUsersThisMonth: 0
    };
  }

  async getSystemErrors(): Promise<any[]> {
    // 시스템 에러 로그 반환 (현재는 빈 배열)
    return [];
  }

  async getInstitutes(): Promise<any[]> {
    // 기관 목록 반환 (현재는 빈 배열)
    return [];
  }

  async getAllTrainers(): Promise<any[]> {
    // 훈련사 목록 반환 (현재는 기존 사용자 중 trainer 역할)
    return Array.from(this.users.values()).filter(user => user.role === 'trainer');
  }

  async getAllPets(): Promise<any[]> {
    // 펫 목록 반환
    return Array.from(this.pets.values());
  }

  getCurriculums() {
    return this.curriculums || [];
  }

  getUsers() {
    return this.users || [];
  }

  getPets() {
    return this.pets || [];
  }

  getInstitutes() {
    return this.institutes || [];
  }
}

// Export storage instance
const storage = new MemoryStorage();
export { storage };
export default MemoryStorage;