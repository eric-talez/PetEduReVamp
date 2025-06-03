import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { TrendingUp, TrendingDown, Eye, Award, MoveUp, MapPin, Sparkles } from 'lucide-react';
import { Star, Users, Clock } from "lucide-react";
import { NewTrainerProfileModal, Trainer } from './NewTrainerProfileModal';

// 훈련사 데이터
const trendingTrainers = [
  {
    id: 1,
    name: '김민수',
    specialty: '문제행동 교정',
    rating: 4.9,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    views: 1283,
    location: '서울 강남구',
    advantages: ['10년+ 경력', '인증 전문가', '성공률 95%'],
    certifications: ['반려동물행동교정사 1급', 'KKC 공인 훈련사'],
    dailyData: [
      { hour: '00:00', views: 42 },
      { hour: '04:00', views: 35 },
      { hour: '08:00', views: 85 },
      { hour: '12:00', views: 210 },
      { hour: '16:00', views: 320 },
      { hour: '20:00', views: 420 },
      { hour: '현재', views: 171 },
    ],
    change: 32
  },
  {
    id: 2,
    name: '박지영',
    specialty: '기본 예절 교육',
    rating: 4.8,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    views: 986,
    location: '서울 송파구',
    advantages: ['맞춤형 교육', '견종별 전문', '온라인 상담'],
    certifications: ['KKC 공인 훈련사', '반려동물관리사 1급'],
    dailyData: [
      { hour: '00:00', views: 32 },
      { hour: '04:00', views: 25 },
      { hour: '08:00', views: 64 },
      { hour: '12:00', views: 150 },
      { hour: '16:00', views: 285 },
      { hour: '20:00', views: 310 },
      { hour: '현재', views: 120 },
    ],
    change: 24
  },
  {
    id: 3,
    name: '이준호',
    specialty: '어질리티 훈련',
    rating: 4.7,
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    views: 754,
    location: '경기 고양시',
    advantages: ['대회 수상 경력', '전문 시설', '단계별 프로그램'],
    certifications: ['국제 어질리티 지도사', 'KKC 공인 훈련사'],
    dailyData: [
      { hour: '00:00', views: 25 },
      { hour: '04:00', views: 18 },
      { hour: '08:00', views: 56 },
      { hour: '12:00', views: 120 },
      { hour: '16:00', views: 210 },
      { hour: '20:00', views: 260 },
      { hour: '현재', views: 65 },
    ],
    change: 15
  },
  {
    id: 4,
    name: '최예린',
    specialty: '사회화 훈련',
    rating: 4.6,
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    views: 623,
    location: '서울 마포구',
    advantages: ['퍼피 전문', '그룹 클래스', '사후 관리'],
    certifications: ['동물행동학 전문가', '반려동물 사회화 지도사'],
    dailyData: [
      { hour: '00:00', views: 18 },
      { hour: '04:00', views: 12 },
      { hour: '08:00', views: 43 },
      { hour: '12:00', views: 95 },
      { hour: '16:00', views: 180 },
      { hour: '20:00', views: 210 },
      { hour: '현재', views: 65 },
    ],
    change: 28
  },
  {
    id: 5,
    name: '장현우',
    specialty: '특수목적 훈련',
    rating: 4.5,
    avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
    views: 508,
    location: '경기 성남시',
    advantages: ['경찰견 출신', '특수 훈련', '개별 맞춤'],
    certifications: ['특수목적견 훈련사', '경찰견 훈련 전문가'],
    dailyData: [
      { hour: '00:00', views: 15 },
      { hour: '04:00', views: 10 },
      { hour: '08:00', views: 32 },
      { hour: '12:00', views: 78 },
      { hour: '16:00', views: 150 },
      { hour: '20:00', views: 180 },
      { hour: '현재', views: 43 },
    ],
    change: 20
  }
];

// 콘텐츠 데이터
const trendingContents = [
  {
    id: 1,
    title: '반려견이 말을 안 들을 때 대처법',
    type: '가이드',
    thumbnail: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    views: 1456,
    dailyData: [
      { hour: '00:00', views: 45 },
      { hour: '04:00', views: 38 },
      { hour: '08:00', views: 95 },
      { hour: '12:00', views: 250 },
      { hour: '16:00', views: 350 },
      { hour: '20:00', views: 450 },
      { hour: '현재', views: 228 },
    ],
    change: 42
  },
  {
    id: 2,
    title: '강아지 분리불안 해결하기',
    type: '가이드',
    thumbnail: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    views: 1247,
    dailyData: [
      { hour: '00:00', views: 35 },
      { hour: '04:00', views: 28 },
      { hour: '08:00', views: 85 },
      { hour: '12:00', views: 220 },
      { hour: '16:00', views: 320 },
      { hour: '20:00', views: 390 },
      { hour: '현재', views: 169 },
    ],
    change: 38
  },
  {
    id: 3,
    title: '반려견 건강을 위한 영양 관리',
    type: '정보',
    thumbnail: 'https://images.unsplash.com/photo-1554456854-55a089fd4cb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    views: 986,
    dailyData: [
      { hour: '00:00', views: 30 },
      { hour: '04:00', views: 24 },
      { hour: '08:00', views: 75 },
      { hour: '12:00', views: 180 },
      { hour: '16:00', views: 250 },
      { hour: '20:00', views: 320 },
      { hour: '현재', views: 107 },
    ],
    change: 25
  },
  {
    id: 4,
    title: '초보 견주가 알아야 할 필수 명령어',
    type: '가이드',
    thumbnail: 'https://images.unsplash.com/photo-1625316708582-7c38734be31d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    views: 857,
    dailyData: [
      { hour: '00:00', views: 25 },
      { hour: '04:00', views: 20 },
      { hour: '08:00', views: 60 },
      { hour: '12:00', views: 160 },
      { hour: '16:00', views: 230 },
      { hour: '20:00', views: 280 },
      { hour: '현재', views: 82 },
    ],
    change: 22
  },
  {
    id: 5,
    title: '반려견 산책 시 주의사항',
    type: '정보',
    thumbnail: 'https://images.unsplash.com/photo-1551730459-92db2a308d6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    views: 743,
    dailyData: [
      { hour: '00:00', views: 22 },
      { hour: '04:00', views: 15 },
      { hour: '08:00', views: 45 },
      { hour: '12:00', views: 140 },
      { hour: '16:00', views: 200 },
      { hour: '20:00', views: 240 },
      { hour: '현재', views: 81 },
    ],
    change: 18
  }
];

// 커뮤니티 글 데이터
const trendingPosts = [
  {
    id: 1,
    title: '우리 강아지 첫 번째 훈련 성공 후기',
    author: '행복한견주',
    thumbnail: 'https://images.unsplash.com/photo-1601758174039-617983b8cdd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    likes: 242,
    comments: 57,
    views: 1689,
    dailyData: [
      { hour: '00:00', views: 58 },
      { hour: '04:00', views: 45 },
      { hour: '08:00', views: 105 },
      { hour: '12:00', views: 280 },
      { hour: '16:00', views: 420 },
      { hour: '20:00', views: 520 },
      { hour: '현재', views: 261 },
    ],
    change: 46
  },
  {
    id: 2,
    title: '분리불안 극복 과정 공유해요',
    author: '멍멍맘',
    thumbnail: 'https://images.unsplash.com/photo-1583511655826-05700442b31b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    likes: 198,
    comments: 43,
    views: 1356,
    dailyData: [
      { hour: '00:00', views: 42 },
      { hour: '04:00', views: 35 },
      { hour: '08:00', views: 95 },
      { hour: '12:00', views: 230 },
      { hour: '16:00', views: 340 },
      { hour: '20:00', views: 410 },
      { hour: '현재', views: 204 },
    ],
    change: 37
  },
  {
    id: 3,
    title: '반려견과 함께한 캠핑 이야기',
    author: '캠핑러버',
    thumbnail: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    likes: 176,
    comments: 39,
    views: 1128,
    dailyData: [
      { hour: '00:00', views: 35 },
      { hour: '04:00', views: 28 },
      { hour: '08:00', views: 85 },
      { hour: '12:00', views: 210 },
      { hour: '16:00', views: 290 },
      { hour: '20:00', views: 350 },
      { hour: '현재', views: 130 },
    ],
    change: 32
  },
  {
    id: 4,
    title: '우리집 강아지 훈련 질문이요',
    author: '초보견주',
    thumbnail: 'https://images.unsplash.com/photo-1581888227599-779811939961?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    likes: 134,
    comments: 68,
    views: 986,
    dailyData: [
      { hour: '00:00', views: 28 },
      { hour: '04:00', views: 22 },
      { hour: '08:00', views: 75 },
      { hour: '12:00', views: 180 },
      { hour: '16:00', views: 260 },
      { hour: '20:00', views: 320 },
      { hour: '현재', views: 101 },
    ],
    change: 28
  },
  {
    id: 5,
    title: '강아지 사료 추천 부탁드려요',
    author: '건강지킴이',
    thumbnail: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    likes: 112,
    comments: 54,
    views: 865,
    dailyData: [
      { hour: '00:00', views: 24 },
      { hour: '04:00', views: 18 },
      { hour: '08:00', views: 65 },
      { hour: '12:00', views: 160 },
      { hour: '16:00', views: 230 },
      { hour: '20:00', views: 280 },
      { hour: '현재', views: 88 },
    ],
    change: 26
  }
];

// 강좌 데이터
const trendingCourses = [
  {
    id: 1,
    title: '반려견 기본 예절 마스터하기',
    instructor: '김민수 훈련사',
    price: 129000,
    rating: 4.9,
    students: 1258,
    thumbnail: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    views: 2347,
    dailyData: [
      { hour: '00:00', views: 68 },
      { hour: '04:00', views: 52 },
      { hour: '08:00', views: 135 },
      { hour: '12:00', views: 380 },
      { hour: '16:00', views: 580 },
      { hour: '20:00', views: 720 },
      { hour: '현재', views: 412 },
    ],
    change: 58
  },
  {
    id: 2,
    title: '문제행동 교정 전문가 과정',
    instructor: '박지영 훈련사',
    price: 189000,
    rating: 4.8,
    students: 976,
    thumbnail: 'https://images.unsplash.com/photo-1558929996-da64ba858215?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    views: 1897,
    dailyData: [
      { hour: '00:00', views: 54 },
      { hour: '04:00', views: 48 },
      { hour: '08:00', views: 115 },
      { hour: '12:00', views: 320 },
      { hour: '16:00', views: 480 },
      { hour: '20:00', views: 580 },
      { hour: '현재', views: 300 },
    ],
    change: 42
  },
  {
    id: 3,
    title: '어질리티 훈련 기초부터 실전까지',
    instructor: '이준호 훈련사',
    price: 159000,
    rating: 4.7,
    students: 823,
    thumbnail: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    views: 1562,
    dailyData: [
      { hour: '00:00', views: 45 },
      { hour: '04:00', views: 38 },
      { hour: '08:00', views: 95 },
      { hour: '12:00', views: 280 },
      { hour: '16:00', views: 420 },
      { hour: '20:00', views: 490 },
      { hour: '현재', views: 194 },
    ],
    change: 36
  },
  {
    id: 4,
    title: '반려견 사회화 트레이닝',
    instructor: '최예린 훈련사',
    price: 139000,
    rating: 4.8,
    students: 765,
    thumbnail: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    views: 1320,
    dailyData: [
      { hour: '00:00', views: 38 },
      { hour: '04:00', views: 32 },
      { hour: '08:00', views: 85 },
      { hour: '12:00', views: 240 },
      { hour: '16:00', views: 360 },
      { hour: '20:00', views: 420 },
      { hour: '현재', views: 145 },
    ],
    change: 32
  },
  {
    id: 5,
    title: '반려견 특수목적 훈련',
    instructor: '장현우 훈련사',
    price: 219000,
    rating: 4.9,
    students: 642,
    thumbnail: 'https://images.unsplash.com/photo-1559190394-df5a28aab5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    views: 1180,
    dailyData: [
      { hour: '00:00', views: 35 },
      { hour: '04:00', views: 28 },
      { hour: '08:00', views: 75 },
      { hour: '12:00', views: 210 },
      { hour: '16:00', views: 320 },
      { hour: '20:00', views: 380 },
      { hour: '현재', views: 132 },
    ],
    change: 29
  }
];

// 차트 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-md">
        <p className="text-sm">{`${label} : ${payload[0].value} 조회`}</p>
      </div>
    );
  }
  return null;
};

const trendingCourses2 = [
  {
    title: "기초 복종 훈련 마스터하기",
    trainer: "김철수 훈련사",
    rating: 4.8,
    students: 128,
    duration: "4주 과정",
    tags: ["기초훈련", "복종훈련"],
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb"
  },
  {
    title: "분리불안 극복하기",
    trainer: "박영희 훈련사",
    rating: 4.9,
    students: 95,
    duration: "6주 과정",
    tags: ["행동교정", "분리불안"],
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1"
  },
  {
    title: "사회화 트레이닝",
    trainer: "이지훈 훈련사",
    rating: 4.7,
    students: 156,
    duration: "8주 과정",
    tags: ["사회화", "행동교정"],
    image: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01"
  }
];

// 트레이너 상세 정보를 위한 확장된 정보
const trainerDetails: { [key: number]: Trainer } = {
  1: {
    id: 1,
    name: '김민수',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    specialty: '문제행동 교정',
    description: '10년 이상의 반려견 훈련 경력을 가진 문제행동 교정 전문가입니다. 특히 공격성, 분리불안, 과잉행동 등 난이도 높은 행동 문제 해결에 전문성을 갖추고 있습니다.',
    rating: 4.9,
    reviewCount: 247,
    certifications: ['반려동물행동교정사 1급', 'KKC 공인 훈련사', '동물매개심리상담사'],
    coursesCount: 12,
    location: '서울 강남구',
    experience: '서울 반려동물 문제행동 클리닉 대표 (현재)\n서울대학교 수의과대학 반려동물행동학 외래교수 (2022-현재)\n한국애견협회 전문 훈련사 (2015-2021)',
    education: ['서울대학교 수의학과 석사', '한국반려동물관리협회 전문과정 수료'],
    languages: ['한국어', '영어'],
    availableHours: '평일 10:00~19:00, 주말 12:00~18:00',
    contactInfo: {
      phone: '010-1234-5678',
      email: 'trainer@example.com'
    }
  },
  2: {
    id: 2,
    name: '박지영',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    specialty: '기본 예절 교육',
    description: '반려견과 보호자의 행복한 공존을 위한 기본 예절 교육을 전문으로 합니다. 특히 견종별 특성을 고려한 맞춤형 교육 프로그램을 제공합니다.',
    rating: 4.8,
    reviewCount: 183,
    certifications: ['KKC 공인 훈련사', '반려동물관리사 1급', '유기견 재활훈련 전문가'],
    coursesCount: 8,
    location: '서울 송파구',
    experience: '펫에듀 훈련센터 수석 트레이너 (현재)\n농림축산식품부 반려동물 교육 프로그램 자문위원 (2021-현재)',
    education: ['중앙대학교 동물자원학과', '한국반려동물훈련원 전문가과정 수료'],
    languages: ['한국어'],
    availableHours: '평일 11:00~20:00, 토요일 10:00~15:00',
    contactInfo: {
      phone: '010-2345-6789',
      email: 'trainer2@example.com'
    }
  },
  3: {
    id: 3,
    name: '이준호',
    image: 'https://randomuser.me/api/portraits/men/55.jpg',
    specialty: '어질리티 훈련',
    description: '반려견의 신체적, 정신적 발달을 돕는 어질리티 훈련 전문가입니다. 국내외 어질리티 대회에서 다수의 수상 경력이 있으며, 모든 크기와 나이의 반려견에게 적합한 프로그램을 제공합니다.',
    rating: 4.7,
    reviewCount: 156,
    certifications: ['국제 어질리티 지도사', 'KKC 공인 훈련사', '반려동물 스포츠 지도사'],
    coursesCount: 6,
    location: '경기 고양시',
    experience: '퍼피 어질리티 클럽 대표 (현재)\n한국어질리티협회 이사 (2020-현재)\n2022 아시아 어질리티 챔피언십 코치',
    education: ['한경대학교 애완동물학과', '영국 IAA 어질리티 전문가 과정 수료'],
    languages: ['한국어', '영어'],
    availableHours: '평일 13:00~21:00, 주말 10:00~18:00',
    contactInfo: {
      phone: '010-3456-7890',
      email: 'trainer3@example.com'
    }
  },
  4: {
    id: 4,
    name: '최예린',
    image: 'https://randomuser.me/api/portraits/women/22.jpg',
    specialty: '사회화 훈련',
    description: '강아지의 건강한 사회성 발달을 위한 전문 훈련사입니다. 특히 퍼피 시기의 사회화 교육과 다중 반려견 가정의 관계 개선에 전문성을 가지고 있습니다.',
    rating: 4.6,
    reviewCount: 129,
    certifications: ['동물행동학 전문가', '반려동물 사회화 지도사', '유기견 재활훈련사'],
    coursesCount: 7,
    location: '서울 마포구',
    experience: '해피독 트레이닝 센터 수석 트레이너 (현재)\n서울시 유기견 재활 프로그램 진행 (2019-2022)',
    education: ['건국대학교 축산학과', '미국 CPDT 사회화 전문가 과정 수료'],
    languages: ['한국어', '영어'],
    availableHours: '평일 10:00~18:00, 토요일 10:00~15:00',
    contactInfo: {
      phone: '010-4567-8901',
      email: 'trainer4@example.com'
    }
  },
  5: {
    id: 5,
    name: '장현우',
    image: 'https://randomuser.me/api/portraits/men/76.jpg',
    specialty: '특수목적 훈련',
    description: '서비스 독, 탐지견 등 특수 목적 훈련을 전문으로 하는 훈련사입니다. 경찰견 훈련 경력을 바탕으로 반려견의 잠재력을 최대한 이끌어내는 훈련을 제공합니다.',
    rating: 4.5,
    reviewCount: 112,
    certifications: ['특수목적견 훈련사', '경찰견 훈련 전문가', 'KKC 공인 훈련사 1급'],
    coursesCount: 5,
    location: '경기 성남시',
    experience: 'K9 트레이닝 센터 대표 (현재)\n경찰청 탐지견 훈련 자문위원 (2018-현재)\n전 경찰견 훈련소 교관 (2015-2018)',
    education: ['경찰대학 특수견 훈련과정', '독일 SVV 특수견 핸들러 자격증'],
    languages: ['한국어', '독일어'],
    availableHours: '평일 09:00~18:00, 토요일 10:00~15:00',
    contactInfo: {
      phone: '010-5678-9012',
      email: 'trainer5@example.com'
    }
  }
};

export function TrendingSection() {
  const [selectedTab, setSelectedTab] = useState('trainers');
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderGraphCard = (item: any) => (
    <ResponsiveContainer width="100%" height={80}>
      <LineChart data={item.dailyData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <Line
          type="monotone"
          dataKey="views"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  );

  const handleTrainerClick = (trainerId: number) => {
    const trainerDetail = trainerDetails[trainerId];
    if (trainerDetail) {
      console.log('트레이너 클릭:', trainerDetail.name);
      setSelectedTrainer(trainerDetail);
      setIsModalOpen(true);
    }
  };

  const renderTrainerItem = (trainer: any, index: number) => (
    <div 
      key={trainer.id} 
      className="border-b border-gray-100 dark:border-gray-800 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-lg px-2"
      onClick={() => handleTrainerClick(trainer.id)}
    >
      <div className="flex items-start">
        <span className="text-lg font-bold w-6 text-gray-400 mt-1">{index + 1}</span>
        <div className="h-12 w-12 rounded-full overflow-hidden mr-3 ring-2 ring-primary/20">
          <img src={trainer.avatar} alt={trainer.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          {/* 상단: 이름, 인증 배지, 지역, 조회수를 가로로 배열 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-gray-900 dark:text-white">{trainer.name}</h4>
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1">
                <Award size={10} className="mr-1" />
                인증 훈련사
              </Badge>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <MapPin size={12} className="mr-1" />
                <span>{trainer.location}</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500 ml-4">
              <Eye size={14} className="mr-1" /> {trainer.views.toLocaleString()}
            </div>
          </div>
          
          {/* 중단: 전문분야와 통계를 가로로 배열 */}
          <div className="flex items-center gap-4 mb-2 flex-wrap">
            <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20">
              {trainer.specialty}
            </Badge>
            <div className="flex items-center space-x-2">
              <div className={`text-xs flex items-center ${trainer.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trainer.change >= 0 ? (
                  <TrendingUp size={12} className="mr-1" />
                ) : (
                  <TrendingDown size={12} className="mr-1" />
                )}
                {Math.abs(trainer.change)}%
              </div>
              <Badge variant={trainer.change >= 0 ? "default" : "destructive"} className="text-xs">
                {trainer.change >= 0 ? `${trainer.rankChange || 0}위 ▲` : `${Math.abs(trainer.rankChange || 0)}위 ▼`}
              </Badge>
            </div>
          </div>

          {/* 하단: 장점과 자격증을 가로로 배열 */}
          <div className="flex items-start gap-4 flex-wrap">
            {/* 장점 표시 */}
            <div className="flex flex-wrap gap-1">
              {trainer.advantages?.slice(0, 2).map((advantage: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-xs px-2 py-1 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700">
                  <Sparkles size={8} className="mr-1" />
                  {advantage}
                </Badge>
              ))}
            </div>

            {/* 자격증 표시 */}
            <div className="flex flex-wrap gap-1">
              {trainer.certifications?.slice(0, 2).map((cert: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700">
                  <Award size={8} className="mr-1" />
                  {cert.length > 10 ? `${cert.substring(0, 10)}...` : cert}
                </Badge>
              ))}
              {trainer.certifications?.length > 2 && (
                <Badge variant="outline" className="text-xs">+{trainer.certifications.length - 2}</Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContentItem = (content: any, index: number) => (
    <div key={content.id} className="flex border-b border-gray-100 dark:border-gray-800 py-3">
      <span className="text-lg font-bold w-6 text-gray-400">{index + 1}</span>
      <div className="h-12 w-20 rounded overflow-hidden mr-3">
        <img src={content.thumbnail} alt={content.title} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium line-clamp-1">{content.title}</h4>
          <div className="flex items-center text-sm text-gray-500">
            <Eye size={14} className="mr-1" /> {content.views.toLocaleString()}
          </div>
        </div>
        <div className="flex items-center">
          <Badge variant="outline" className="text-xs mr-2">{content.type}</Badge>
          <div className="flex items-center space-x-2">
            <div className={`text-xs flex items-center ${content.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {content.change >= 0 ? (
                <TrendingUp size={12} className="mr-1" />
              ) : (
                <TrendingDown size={12} className="mr-1" />
              )}
              {Math.abs(content.change)}%
            </div>
            <Badge variant={content.change >= 0 ? "success" : "destructive"} className="text-xs">
              {content.change >= 0 ? `${content.rankChange || 0}위 ▲` : `${Math.abs(content.rankChange || 0)}위 ▼`}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPostItem = (post: any, index: number) => (
    <div key={post.id} className="flex border-b border-gray-100 dark:border-gray-800 py-3">
      <span className="text-lg font-bold w-6 text-gray-400">{index + 1}</span>
      <div className="h-12 w-20 rounded overflow-hidden mr-3">
        <img src={post.thumbnail} alt={post.title} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium line-clamp-1">{post.title}</h4>
          <div className="flex items-center text-sm text-gray-500">
            <Eye size={14} className="mr-1" /> {post.views.toLocaleString()}
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">{post.author}</span>
          <div className="flex items-center space-x-2">
            <div className={`text-xs flex items-center ${post.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {post.change >= 0 ? (
                <TrendingUp size={12} className="mr-1" />
              ) : (
                <TrendingDown size={12} className="mr-1" />
              )}
              {Math.abs(post.change)}%
            </div>
            <Badge variant={post.change >= 0 ? "success" : "destructive"} className="text-xs">
              {post.change >= 0 ? `${post.rankChange || 0}위 ▲` : `${Math.abs(post.rankChange || 0)}위 ▼`}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourseItem = (course: any, index: number) => (
    <div key={course.id} className="flex border-b border-gray-100 dark:border-gray-800 py-3">
      <span className="text-lg font-bold w-6 text-gray-400">{index + 1}</span>
      <div className="h-12 w-20 rounded overflow-hidden mr-3">
        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium line-clamp-1">{course.title}</h4>
          <div className="flex items-center text-sm text-gray-500">
            <Eye size={14} className="mr-1" /> {course.views.toLocaleString()}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{course.instructor}</span>
          <div className="flex items-center space-x-2">
            <div className={`text-xs flex items-center ${course.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {course.change >= 0 ? (
                <TrendingUp size={12} className="mr-1" />
              ) : (
                <TrendingDown size={12} className="mr-1" />
              )}
              {Math.abs(course.change)}%
            </div>
            <Badge variant={course.change >= 0 ? "success" : "destructive"} className="text-xs">
              {course.change >= 0 ? `${course.rankChange || 0}위 ▲` : `${Math.abs(course.rankChange || 0)}위 ▼`}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourseItem2 = (course: any, index: number) => (
    <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card key={index} className="overflow-hidden">
          <div className="aspect-video relative">
            <img
              src={course.image}
              alt={course.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex gap-2 mb-2">
              {course.tags.map((tag, i) => (
                <Badge key={i} variant="secondary">{tag}</Badge>
              ))}
            </div>
            <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {course.trainer}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{course.students}명</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
            </div>
          </div>
        </Card>
    </div>
  );


  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <h3 className="font-bold text-lg flex items-center">
          <Award className="mr-2 text-primary" /> 실시간 인기 차트
        </h3>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-4 h-auto p-0">
          <TabsTrigger value="trainers" className="py-3 rounded-nonedata-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800">
            인기 훈련사
          </TabsTrigger>
          <TabsTrigger value="contents" className="py-3 rounded-none data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800">
            인기 컨텐츠
          </TabsTrigger>
          <TabsTrigger value="posts" className="py-3 rounded-none data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800">
            인기 게시글
          </TabsTrigger>
          <TabsTrigger value="courses" className="py-3 rounded-none data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800">
            인기 강좌
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trainers" className="m-0 p-4 bg-white dark:bg-gray-950">
          <div className="space-y-1">
            {trendingTrainers.map((trainer, index) => renderTrainerItem(trainer, index))}
          </div>
          <Button variant="ghost" className="w-full mt-4">
            <Link href="/trainers" className="flex items-center justify-center w-full">
              <span>모든 훈련사 보기</span>
              <MoveUp size={16} className="ml-1 rotate-45" />
            </Link>
          </Button>
        </TabsContent>

        <TabsContent value="contents" className="m-0 p-4 bg-white dark:bg-gray-950">
          <div className="space-y-1">
            {trendingContents.map((content, index) => renderContentItem(content, index))}
          </div>
          <Button variant="ghost" className="w-full mt-4">
            <Link href="/contents" className="flex items-center justify-center w-full">
              <span>모든 컨텐츠 보기</span>
              <MoveUp size={16} className="ml-1 rotate-45" />
            </Link>
          </Button>
        </TabsContent>

        <TabsContent value="posts" className="m-0 p-4 bg-white dark:bg-gray-950">
          <div className="space-y-1">
            {trendingPosts.map((post, index) => renderPostItem(post, index))}
          </div>
          <Button variant="ghost" className="w-full mt-4">
            <Link href="/community" className="flex items-center justify-center w-full">
              <span>모든 게시글 보기</span>
              <MoveUp size={16} className="ml-1 rotate-45" />
            </Link>
          </Button>
        </TabsContent>

        <TabsContent value="courses" className="m-0 p-4 bg-white dark:bg-gray-950">
          <div className="space-y-1">
            {trendingCourses.map((course, index) => renderCourseItem(course, index))}
          </div>
          <Button variant="ghost" className="w-full mt-4">
            <Link href="/courses" className="flex items-center justify-center w-full">
              <span>모든 강좌 보기</span>
              <MoveUp size={16} className="ml-1 rotate-45" />
            </Link>
          </Button>
        </TabsContent>
        <TabsContent value="courses2" className="m-0 p-4 bg-white dark:bg-gray-950">
          {trendingCourses2.map((course, index) => renderCourseItem2(course, index))}
        </TabsContent>
      </Tabs>

      {/* 트레이너 프로필 모달 */}
      {selectedTrainer && (
        <NewTrainerProfileModal
          trainer={selectedTrainer}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            // 모달이 닫히고 애니메이션이 끝난 후에 선택된 트레이너 정보 초기화
            setTimeout(() => setSelectedTrainer(null), 300);
          }}
        />
      )}
    </Card>
  );
}