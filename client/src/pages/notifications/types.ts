import React from 'react';

// 알림장 항목 타입 정의
export interface NotebookEntry {
  id: string;
  date: string;
  petId: number;
  petName: string;
  content: string;
  author: {
    id: number;
    name: string;
    role: 'trainer' | 'pet-owner' | 'admin';
    avatar?: string;
  };
  activities: string[];
  status: 'completed' | 'in-progress' | 'planned';
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  tags: string[];
  isImportant: boolean;
  reactions?: {
    likes: number;
    hasLiked: boolean;
    comments: number | undefined;
  };
  createdAt: string;
  updatedAt?: string;
  isFavorite: boolean;
}

// 반려동물 타입 정의
export interface Pet {
  id: number;
  name: string;
  type: 'dog' | 'cat' | 'other';
  breed: string;
  age: number;
  avatar?: string;
}

// 훈련사 타입 정의
export interface Trainer {
  id: number;
  name: string;
  specialty: string;
  avatar?: string;
}

// 활동 타입 정의
export interface Activity {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'training' | 'care' | 'play' | 'health';
}

// 템플릿 타입 정의
export interface Template {
  id: string;
  title: string;
  content: string;
  activities: string[];
}