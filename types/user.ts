export interface User {
  id: number;
  role: 'admin' | 'client' | 'freelancer' | 'pet-owner' | 'trainer' | 'institute-admin';
  points: number;
  email: string;
  password: string;
  username: string;
  fullName: string;
  name: string;
  phone: string;
  profileImage: string;
  bio: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: Date;
  subscriptionTier?: string;
  referralCode?: string;
  aiUsage?: number;
}

export interface ProjectType {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  postedDate: string;
  location: string;
  clientInfo: {
    name: string;
    rating: number;
    completedProjects: number;
  };
  createdAt: string;
  status: string;
  views: number;
}

export interface TestResult {
  valid: boolean;
  items?: any[];
}

export interface ButtonConfig {
  id?: string;
  className?: string;
  expectedPattern?: string;
  expectedDestination?: string;
}