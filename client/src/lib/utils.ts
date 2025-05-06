import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type UserRole = 'general' | 'pet-owner' | 'trainer' | 'institute-admin' | 'admin';

// Mock authentication related helper functions - in a real app these would be implemented with proper auth
export const getCurrentUser = (): { id: number; name: string; role: UserRole } | null => {
  // For demo purposes, assuming we have a logged-in user
  return {
    id: 1,
    name: '김견주',
    role: 'pet-owner'
  };
};

export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};

export const getUserRole = (): UserRole => {
  const user = getCurrentUser();
  return user?.role || 'general';
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const getInitials = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};
