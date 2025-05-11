import { users, type User, type InsertUser, type UserRole } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getInstituteByCode(code: string): Promise<any>;
  updateUserRole(userId: number, role: UserRole, trainerId?: number): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
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
      role,  // UserRole 타입 사용
      // trainerId는 User 타입에 없으므로 포함하지 않음
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();