// 커뮤니티 관련 타입 정의

export interface Author {
  id: number;
  name: string;
  image?: string;
}

export interface LinkInfo {
  url: string;
  title: string;
  description: string;
  image?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  tag?: string;
  author: Author;
  likes: number;
  comments: number | Comment[];
  views: number;
  createdAt: string;
  updatedAt: string;
  hidden: boolean;
  linkInfo?: LinkInfo;
}

export interface Comment {
  id: number;
  content: string;
  author: Author;
  createdAt: string;
  replies?: Comment[];
}

export interface SurveyQuestion {
  id: number;
  question: string;
  type: 'single_choice' | 'multiple_choice' | 'text_answer';
  options?: string[];
  required: boolean;
}

export interface SurveyForm {
  title: string;
  description: string;
  type: string;
  questions: SurveyQuestion[];
  endDate: string;
  anonymous: boolean;
}

export interface NewPost {
  title: string;
  content: string;
  category: string;
  tags: string;
  linkUrl: string;
  linkTitle: string;
  linkDescription: string;
  linkImage: string;
}

export type ViewType = 'card' | 'list';
export type TabValue = 'latest' | 'popular' | 'training' | 'survey' | 'info' | 'notices';