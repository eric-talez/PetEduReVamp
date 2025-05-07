import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getInstituteByCode(code: string): Promise<any>; // Added method signature
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Added method implementation
  async getInstituteByCode(code: string): Promise<any> {
    // Replace with your actual database query
    // This is a placeholder and requires a proper database connection and query mechanism.
    // Assuming 'db' is a database client and 'institutes' is a table with a 'code' column.
    return await db.query.institutes.findFirst({
      where: eq(institutes.code, code)
    });
  }
}

export const storage = new MemStorage();