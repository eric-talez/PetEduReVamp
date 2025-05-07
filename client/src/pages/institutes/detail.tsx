import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Star,
  Users,
  Calendar,
  Clock,
  Building,
  Phone,
  Mail,
  Globe,
  Shield,
  BookOpen,
  CheckCircle,
  Info,
  Camera,
  FileBadge,
  Map,
  Award,
  DogBowl,
  Sparkles
} from "lucide-react";

// 교육 기관 데이터
const institutesData = [
  {
    id: 1,
    name: "행복한 반려견 교육 센터",
    description: "체계적인 커리큘럼과 전문 훈련사들의 1:1 맞춤형 교육으로 반려견의 행동 교정과 견주의 올바른 반려견 교육 방법을 안내합니다.",
    longDescription: "행복한 반려견 교육 센터는 2015년 설립된 반려견 교육 전문 기관으로, 개별 맞춤형 교육과 과학적인 훈련 방법을 통해 반려견의 행동 개선을 돕고 견주와 반려견 간의 건강한 관계 형성을 지원합니다. 저희 센터는 다양한 교육 프로그램을 제공하며, 모든 훈련사는 국내외 공인 자격증을 보유하고 있습니다. 반려견의 행동 문제로 고민이시라면 언제든지 저희 센터를 방문해 상담받으실 수 있습니다.",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
    galleryImages: [
      "https://images.unsplash.com/photo-1541599468348-e96984315921?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    location: "서울시 강남구 선릉로 123",
    detailedLocation: "지하철 2호선 선릉역 3번 출구에서 도보 5분 거리 위치. 주차 가능(2시간 무료)",
    coordinates: { lat: 37.504395, lng: 127.048829 },
    rating: 4.9,
    reviews: 86,
    trainers: [
      {
        id: 1,
        name: "김훈련",
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        specialty: "반려견 문제행동 교정",
        certifications: ["반려동물행동교정사 1급", "국제 반려견 트레이너 자격증"],
        experience: "8년"
      },
      {
        id: 2,
        name: "박훈련",
        image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        specialty: "퍼피 사회화 훈련",
        certifications: ["반려동물관리사 자격증", "유기견 재활 전문가"],
        experience: "6년"
      }
    ],
    courses: [
      {
        id: 1,
        title: "기본 복종 훈련 코스",
        description: "앉아, 엎드려, 기다려 등 기본적인 명령에 대한 훈련 과정",
        duration: "4주",
        sessions: "주 2회, 회당 1시간",
        price: 350000,
        maxParticipants: 5
      },
      {
        id: 2,
        title: "문제행동 교정 1:1 맞춤 코스",
        description: "짖음, 분리불안, 공격성 등 문제행동에 대한 맞춤형 교정 프로그램",
        duration: "8주",
        sessions: "주 1회, 회당 1시간",
        price: 550000,
        maxParticipants: 1
      },
      {
        id: 3,
        title: "어질리티 입문 코스",
        description: "반려견 스포츠의 기초가 되는 어질리티 입문 훈련",
        duration: "6주",
        sessions: "주 1회, 회당 1시간 30분",
        price: 420000,
        maxParticipants: 4
      }
    ],
    facilities: ["실내 훈련장", "야외 훈련장", "대기실", "상담실"],
    amenities: ["무료 와이파이", "반려견용 식수대", "휴게 공간", "반려견 놀이터"],
    openingHours: "평일 10:00 - 20:00, 주말 10:00 - 18:00",
    contact: {
      phone: "02-123-4567",
      email: "info@happydog.kr",
      website: "www.happydog.kr"
    },
    category: "종합 교육",
    certification: true,
    certificationDetails: ["한국반려동물협회 인증", "서울시 동물보호 교육기관 지정"],
    premium: true,
    established: "2015년",
    faq: [
      {
        question: "어떤 연령대의 반려견이 교육 받을 수 있나요?",
        answer: "모든 연령대의 반려견이 참여 가능합니다. 특히 퍼피(~1살)는 조기 사회화 교육이 중요하며, 성견과 노령견을 위한 특별 프로그램도 운영하고 있습니다."
      },
      {
        question: "교육 비용은 어떻게 지불하나요?",
        answer: "현금, 카드 결제가 모두 가능하며, 분할 납부도 상담 가능합니다. 교육 등록 시 계약서를 작성하고 50%를 선납하며, 나머지는 교육 중간에 납부하시면 됩니다."
      },
      {
        question: "교육 효과가 없으면 환불이 가능한가요?",
        answer: "교육 시작 후 2주 이내에 교육 효과에 만족하지 못하시면 남은 기간에 대한 비용을 환불해 드립니다. 단, 교육에 성실히 참여하셨음을 전제로 합니다."
      }
    ]
  },
  {
    id: 2,
    name: "멍멍 아카데미",
    description: "반려견에게 즐거운 경험을 선사하는 놀이 중심의 교육 기관입니다. 스트레스 없는 교육 방식으로 반려견의 사회성과 기본 예절을 기릅니다.",
    longDescription: "멍멍 아카데미는 반려견이 즐겁게 배울 수 있는 놀이 중심의 교육 철학을 바탕으로 합니다. 스트레스와 강압 없이 긍정 강화 훈련 방식을 통해 반려견의 자발적인 참여를 유도하고, 견주와 반려견 모두가 즐겁게 교육에 임할 수 있는 환경을 제공합니다. 특히 반려견의 사회화에 중점을 두어 다양한 환경과 자극에 적응할 수 있도록 도와드립니다.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
    galleryImages: [
      "https://images.unsplash.com/photo-1601758177266-bc599de87707?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    location: "서울시 마포구 월드컵로 456",
    detailedLocation: "지하철 6호선 월드컵경기장역 1번 출구에서 도보 8분 거리. 건물 내 주차 가능(유료)",
    coordinates: { lat: 37.569512, lng: 126.897631 },
    rating: 4.7,
    reviews: 64,
    trainers: [
      {
        id: 3,
        name: "이사회화",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        specialty: "반려견 사회화",
        certifications: ["반려동물행동상담사", "그룹 클래스 전문가"],
        experience: "5년"
      }
    ],
    courses: [
      {
        id: 4,
        title: "퍼피 사회화 클래스",
        description: "12개월 미만의 강아지를 위한 사회화 훈련 및 기본 예절 교육",
        duration: "6주",
        sessions: "주 1회, 회당 1시간",
        price: 280000,
        maxParticipants: 6
      },
      {
        id: 5,
        title: "도시 적응 훈련 코스",
        description: "도시 환경(소음, 사람, 차량 등)에 대한 적응 훈련",
        duration: "4주",
        sessions: "주 1회, 회당 2시간",
        price: 320000,
        maxParticipants: 4
      }
    ],
    facilities: ["실내 훈련장", "놀이터", "카페"],
    amenities: ["반려견 간식 제공", "견주용 음료 제공", "쉼터"],
    openingHours: "매일 11:00 - 19:00",
    contact: {
      phone: "02-234-5678",
      email: "hello@woofahcademy.kr",
      website: "www.woofahcademy.kr"
    },
    category: "사회화 중심",
    certification: true,
    certificationDetails: ["한국반려동물협회 인증"],
    premium: false,
    established: "2018년",
    faq: [
      {
        question: "다른 반려견들과 잘 어울리지 못하는데 참여 가능한가요?",
        answer: "물론입니다. 사회화 클래스는 다른 반려견들과 적절하게 상호작용하는 법을 배우는 과정입니다. 처음에는 개별 평가를 통해 반려견의 성향을 파악하고, 단계적으로 사회화를 진행합니다."
      },
      {
        question: "사회화 훈련은 몇 살까지 효과가 있나요?",
        answer: "어린 강아지일수록 사회화 효과가 좋지만, 성견도 충분히 사회화 훈련을 통해 개선될 수 있습니다. 나이에 맞는 맞춤형 클래스를 제공하고 있으니 상담을 통해 결정하시는 것을 추천드립니다."
      }
    ]
  },
  {
    id: 3,
    name: "퍼피 트레이닝 센터",
    description: "어린 강아지를 위한 특화된 교육 프로그램을 제공합니다. 중요한 사회화 시기에 필요한 모든 훈련과 경험을 체계적으로 제공합니다.",
    longDescription: "퍼피 트레이닝 센터는 어린 강아지의 중요한 발달 시기에 필요한 모든 경험과 훈련을 제공하는 전문 교육 기관입니다. 생후 8주부터 1년까지의 강아지들을 위한 다양한 프로그램을 통해 건강하고 균형 잡힌 성장을 돕습니다. 특히 초기 사회화와 기본 예절 교육에 중점을 두어, 성견이 되었을 때 발생할 수 있는 행동 문제를 예방합니다.",
    image: "https://images.unsplash.com/photo-1601758177266-bc599de87707?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
    galleryImages: [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    location: "서울시 송파구 올림픽로 789",
    detailedLocation: "지하철 8호선 잠실역 10번 출구에서 도보 10분 거리. 인근 공영주차장 이용 가능",
    coordinates: { lat: 37.513498, lng: 127.102570 },
    rating: 4.8,
    reviews: 52,
    trainers: [
      {
        id: 4,
        name: "한퍼피",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        specialty: "퍼피 트레이닝",
        certifications: ["퍼피 전문 트레이너", "반려동물행동교정사"],
        experience: "7년"
      }
    ],
    courses: [
      {
        id: 6,
        title: "퍼피 기초 교육 코스",
        description: "어린 강아지를 위한 기본 명령어 및 배변 훈련",
        duration: "4주",
        sessions: "주 2회, 회당 45분",
        price: 240000,
        maxParticipants: 6
      },
      {
        id: 7,
        title: "퍼피 사회화 종합 패키지",
        description: "다양한 환경, 소리, 사람, 동물과의 만남을 포함한 종합 사회화 프로그램",
        duration: "8주",
        sessions: "주 1회, 회당 1시간 30분",
        price: 480000,
        maxParticipants: 5
      }
    ],
    facilities: ["실내 훈련장", "놀이터", "그루밍실"],
    amenities: ["강아지 장난감 대여", "간식 제공", "소형 수영장(여름)"],
    openingHours: "평일 09:00 - 18:00, 주말 10:00 - 17:00",
    contact: {
      phone: "02-345-6789",
      email: "hello@puppytraining.co.kr",
      website: "www.puppytraining.co.kr"
    },
    category: "유견 특화",
    certification: true,
    certificationDetails: ["한국애견협회 공인", "국제 퍼피 트레이너 협회 인증"],
    premium: false,
    established: "2019년",
    faq: [
      {
        question: "몇 개월부터 교육이 가능한가요?",
        answer: "백신 접종이 완료된 8주령 이상의 강아지부터 교육이 가능합니다. 단, 건강 상태에 따라 참여 가능 여부가 달라질 수 있으니 사전 상담을 권장드립니다."
      },
      {
        question: "다른 강아지들과 함께 수업을 받아도 질병 감염 위험은 없나요?",
        answer: "모든 강아지는 필수 예방접종 완료 증명서를 확인한 후에만 수업 참여가 가능합니다. 또한 매일 철저한 소독과 청소를 실시하여 위생적인 환경을 유지합니다."
      }
    ]
  },
  {
    id: 4,
    name: "어질리티 스포츠 클럽",
    description: "반려견 스포츠와 어질리티 훈련을 전문으로 하는 센터입니다. 다양한 장애물과 전문 코치진으로 반려견의 활동성과 두뇌 발달을 돕습니다.",
    longDescription: "어질리티 스포츠 클럽은 활동적인 반려견을 위한 전문 스포츠 훈련 센터입니다. 국제 규격의 어질리티 코스와 다양한 장애물을 갖추고 있으며, 전문 코치진의 지도 아래 반려견의 신체적, 정신적 발달을 도모합니다. 초보부터 대회 출전 준비까지 다양한 레벨의 클래스를 제공하며, 정기적인 소규모 대회도 개최하고 있습니다.",
    image: "https://images.unsplash.com/photo-1583336663277-620dc1996580?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
    galleryImages: [
      "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1592754862816-1a21a4ea2281?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    location: "경기도 고양시 덕양구 고양대로 123",
    detailedLocation: "백석역에서 버스 환승 후 10분 거리. 넓은 주차장 완비",
    coordinates: { lat: 37.619002, lng: 126.831273 },
    rating: 4.6,
    reviews: 43,
    trainers: [
      {
        id: 5,
        name: "정어질리티",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        specialty: "어질리티 & 도그 스포츠",
        certifications: ["국제 어질리티 코치 자격증", "반려동물 스포츠 지도사"],
        experience: "9년"
      }
    ],
    courses: [
      {
        id: 8,
        title: "어질리티 입문 과정",
        description: "기본적인 장애물 극복 기술과 핸들링 방법 학습",
        duration: "6주",
        sessions: "주 1회, 회당 1시간",
        price: 350000,
        maxParticipants: 4
      },
      {
        id: 9,
        title: "어질리티 중급 과정",
        description: "복합적인 코스 주행과 시간 단축 기법 학습",
        duration: "8주",
        sessions: "주 1회, 회당 1시간 30분",
        price: 450000,
        maxParticipants: 3
      },
      {
        id: 10,
        title: "플라이볼 입문 과정",
        description: "속도와 민첩성을 요구하는 플라이볼 스포츠 기초 학습",
        duration: "4주",
        sessions: "주 1회, 회당 1시간",
        price: 280000,
        maxParticipants: 4
      }
    ],
    facilities: ["실내 훈련장", "어질리티 코스", "휴게실"],
    amenities: ["탈의실", "샤워 시설(반려견/견주)", "물품 보관함"],
    openingHours: "평일 13:00 - 21:00, 주말 10:00 - 18:00",
    contact: {
      phone: "031-456-7890",
      email: "info@agilityclub.kr",
      website: "www.agilityclub.kr"
    },
    category: "운동 특화",
    certification: false,
    premium: true,
    established: "2017년",
    faq: [
      {
        question: "어질리티 훈련을 위한 최소 나이나 조건이 있나요?",
        answer: "반려견은 최소 1년 이상, 기본적인 복종 훈련이 되어 있어야 합니다. 또한 신체적으로 건강해야 하며, 처음 등록 시 건강 확인서를 제출해 주셔야 합니다."
      },
      {
        question: "대회 출전도 가능한가요?",
        answer: "네, 중급 이상의 과정을 수료하신 분들은 저희 클럽에서 주최하는 소규모 대회나 지역 대회에 출전하실 수 있습니다. 별도의 대회 준비 특별 클래스도 운영하고 있습니다."
      }
    ]
  },
  {
    id: 5,
    name: "행동 교정 전문 센터",
    description: "문제 행동에 특화된 교정 프로그램을 운영합니다. 분리불안, 공격성, 짖음 등 다양한 문제 행동을 과학적인 방법으로 개선합니다.",
    longDescription: "행동 교정 전문 센터는 반려견의 다양한 문제 행동을 과학적이고 체계적인 방법으로 개선하는 전문 기관입니다. 동물 행동학과 심리학에 기반한 분석을 통해 문제의 원인을 파악하고 개별 맞춤형 솔루션을 제공합니다. 특히 공격성, 분리불안, 과도한 짖음, 파괴적 행동 등 심각한 문제 행동에 대한 전문적인 접근으로 높은 성공률을 자랑합니다.",
    image: "https://images.unsplash.com/photo-1583512603806-077998240c7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
    galleryImages: [
      "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1558929996-da64ba858215?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1594590149898-7c64ca48a8d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    location: "서울시 서초구 서초대로 456",
    detailedLocation: "지하철 2호선 강남역 11번 출구에서 도보 7분 거리. 유료 주차 가능",
    coordinates: { lat: 37.503051, lng: 127.024550 },
    rating: 4.9,
    reviews: 71,
    trainers: [
      {
        id: 6,
        name: "김행동",
        image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        specialty: "공격성 & 분리불안",
        certifications: ["반려동물행동심리전문가", "수의학 행동치료 전문가"],
        experience: "12년"
      },
      {
        id: 7,
        name: "박치료",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        specialty: "강박 행동 & 과잉행동",
        certifications: ["동물행동분석사", "반려견 심리상담사"],
        experience: "8년"
      }
    ],
    courses: [
      {
        id: 11,
        title: "분리불안 집중 치료 프로그램",
        description: "혼자 있을 때 나타나는 불안과 파괴적 행동을 개선하는 맞춤형 치료",
        duration: "8주",
        sessions: "주 1회, 회당 1시간 + 가정 훈련",
        price: 600000,
        maxParticipants: 1
      },
      {
        id: 12,
        title: "공격성 교정 프로그램",
        description: "다른 개나 사람에 대한 공격적 행동을 안전하게 교정하는 전문 치료",
        duration: "12주",
        sessions: "주 1회, 회당 1시간 + 환경 관리",
        price: 720000,
        maxParticipants: 1
      },
      {
        id: 13,
        title: "과도한 짖음 교정 프로그램",
        description: "상황별 과도한 짖음 행동을 효과적으로 관리하는 방법 학습",
        duration: "6주",
        sessions: "주 1회, 회당 1시간",
        price: 480000,
        maxParticipants: 1
      }
    ],
    facilities: ["상담실", "개별 훈련실", "그룹 훈련장"],
    amenities: ["조용한 치료 환경", "행동 분석 장비", "스트레스 감소 공간"],
    openingHours: "평일 10:00 - 19:00, 토요일 10:00 - 15:00",
    contact: {
      phone: "02-567-8901",
      email: "help@behavioralclinic.kr",
      website: "www.behavioralclinic.kr"
    },
    category: "행동 교정",
    certification: true,
    certificationDetails: ["한국동물매개심리치료학회 인증", "국제 반려동물 행동 협회 회원"],
    premium: true,
    established: "2016년",
    faq: [
      {
        question: "약물 치료도 병행하나요?",
        answer: "심각한 행동 문제의 경우 협력 수의사와 상담 후 필요에 따라 약물 치료를 병행할 수 있습니다. 하지만 기본적으로는 비약물적 접근을 우선으로 하며, 약물은 보조적 수단으로만 활용합니다."
      },
      {
        question: "몇 회기 정도 받아야 효과가 있나요?",
        answer: "행동 문제의 종류와 심각도에 따라 다르지만, 일반적으로 최소 6~8회기의 치료가 필요합니다. 분리불안이나 공격성과 같은 심각한 문제는 더 긴 치료 기간이 필요할 수 있습니다."
      },
      {
        question: "견주도 함께 교육에 참여해야 하나요?",
        answer: "반드시 그렇습니다. 행동 교정은 견주와 반려견이 함께 변화해야 효과적입니다. 모든 세션에 견주가 참여하여 훈련 방법을 배우고 가정에서도 일관되게 적용하는 것이 중요합니다."
      }
    ]
  },
  {
    id: 6,
    name: "도그 스쿨 플러스",
    description: "종합적인 반려견 교육을 제공하는 학교형 교육 기관입니다. 기초부터 고급 과정까지 단계별 커리큘럼으로 체계적인 교육을 받을 수 있습니다.",
    longDescription: "도그 스쿨 플러스는 반려견 교육의 모든 측면을 다루는 종합 교육 기관입니다. 기초 훈련부터 특수 목적 훈련까지 체계적인 커리큘럼을 바탕으로 단계별 교육을 제공합니다. 교실 환경에서의 이론 교육과 실습장에서의 실전 훈련을 병행하여 효과적인 학습이 이루어지도록 설계되었습니다. 모든 연령과 모든 견종을 위한 맞춤형 프로그램을 운영합니다.",
    image: "https://images.unsplash.com/photo-1541599468348-e96984315921?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
    galleryImages: [
      "https://images.unsplash.com/photo-1601758177266-bc599de87707?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    location: "인천시 부평구 부평대로 789",
    detailedLocation: "지하철 1호선 부평역 4번 출구에서 도보 12분 거리. 인근 공영주차장 이용 가능",
    coordinates: { lat: 37.503690, lng: 126.722131 },
    rating: 4.5,
    reviews: 38,
    trainers: [
      {
        id: 8,
        name: "최전문",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        specialty: "기본 훈련 & 가정 예절",
        certifications: ["반려동물 훈련사 자격증"],
        experience: "4년"
      }
    ],
    courses: [
      {
        id: 14,
        title: "기초 복종 훈련 1단계",
        description: "기본 명령어와 리드줄 훈련, 사회화 기초",
        duration: "4주",
        sessions: "주 1회, 회당 1시간",
        price: 200000,
        maxParticipants: 8
      },
      {
        id: 15,
        title: "기초 복종 훈련 2단계",
        description: "고급 명령어와 거리 조절, 방해 요소 속 집중력 훈련",
        duration: "4주",
        sessions: "주 1회, 회당 1시간",
        price: 220000,
        maxParticipants: 6
      },
      {
        id: 16,
        title: "반려견 가정 예절 과정",
        description: "집 안에서의 규칙 설정과 올바른 행동 습관 형성",
        duration: "3주",
        sessions: "주 1회, 회당 1시간 30분",
        price: 180000,
        maxParticipants: 5
      }
    ],
    facilities: ["강의실", "실습장", "야외 훈련장"],
    amenities: ["교재 제공", "훈련 도구 대여", "수료증 발급"],
    openingHours: "평일 10:00 - 18:00, 토요일 10:00 - 14:00",
    contact: {
      phone: "032-678-9012",
      email: "contact@dogschoolplus.kr",
      website: "www.dogschoolplus.kr"
    },
    category: "종합 교육",
    certification: false,
    premium: false,
    established: "2020년",
    faq: [
      {
        question: "수업을 결석하면 보강이 가능한가요?",
        answer: "같은 주차 내 다른 요일의 동일한 수업이 있다면 보강이 가능합니다. 단, 사전에 연락을 주셔야 하며, 정원이 찬 경우 보강이 어려울 수 있습니다."
      },
      {
        question: "교육 도구는 직접 준비해야 하나요?",
        answer: "기본적인 훈련 도구는 저희가 수업 시간에 제공합니다. 필요한 경우 구매 상담도 해드리며, 추천 제품 목록도 안내해 드립니다."
      }
    ]
  }
];

export default function InstituteDetail() {
  const [, params] = useRoute('/institutes/:id');
  const [institute, setInstitute] = useState<typeof institutesData[0] | null>(null);
  const [activeTab, setActiveTab] = useState('info');
  
  useEffect(() => {
    if (params && params.id) {
      // 단순화를 위해 데이터 배열에서 ID로 찾기
      const foundInstitute = institutesData.find(i => i.id === parseInt(params.id));
      setInstitute(foundInstitute || null);
    }
  }, [params]);

  if (!institute) {
    return (
      <div className="container py-16 text-center">
        <div className="flex flex-col items-center justify-center">
          <Info className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">교육 기관 정보를 찾을 수 없습니다</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">요청하신 교육 기관 정보가 없거나 삭제되었습니다.</p>
          <Button onClick={() => window.location.href = '/institutes'}>
            모든 교육 기관 보기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* 헤더 섹션 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
        <div className="relative h-64 md:h-80">
          <img 
            src={institute.image} 
            alt={institute.name} 
            className="w-full h-full object-cover"
          />
          
          {/* 프리미엄 배지 */}
          {institute.premium && (
            <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Sparkles className="h-4 w-4 mr-1" />
              프리미엄 기관
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{institute.name}</h1>
                {institute.certification && (
                  <Badge variant="success" className="flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    인증기관
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {institute.category}
                </Badge>
                <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span>{institute.rating} ({institute.reviews} 후기)</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                  <Building className="h-4 w-4 mr-1" />
                  <span>설립 {institute.established}</span>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-3xl">
                {institute.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">위치</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{institute.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">운영 시간</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{institute.openingHours}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">연락처</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{institute.contact.phone}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 flex flex-col gap-3 w-full md:w-auto">
              <Button 
                className="w-full md:w-auto" 
                onClick={() => window.open(`tel:${institute.contact.phone.replace(/-/g, '')}`)}
              >
                <Phone className="h-4 w-4 mr-2" />
                전화 문의
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full md:w-auto"
                onClick={() => window.open(`mailto:${institute.contact.email}`)}
              >
                <Mail className="h-4 w-4 mr-2" />
                이메일 문의
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full md:w-auto"
                onClick={() => window.open(`https://${institute.contact.website}`, '_blank')}
              >
                <Globe className="h-4 w-4 mr-2" />
                웹사이트
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 탭 섹션 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="w-full border-b justify-start mb-6 rounded-none bg-transparent p-0 space-x-6">
          <TabsTrigger value="info" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            상세 정보
          </TabsTrigger>
          <TabsTrigger value="courses" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            교육 과정
          </TabsTrigger>
          <TabsTrigger value="trainers" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            훈련사 소개
          </TabsTrigger>
          <TabsTrigger value="gallery" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            시설 갤러리
          </TabsTrigger>
          <TabsTrigger value="faq" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            자주 묻는 질문
          </TabsTrigger>
        </TabsList>
        
        {/* 상세 정보 탭 */}
        <TabsContent value="info" className="pt-2 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold mb-4">교육 기관 소개</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line">
                {institute.longDescription}
              </p>
              
              <h3 className="text-lg font-semibold mb-3">위치 정보</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">{institute.detailedLocation}</p>
              
              {/* 여기에 지도 영역이 들어갈 수 있습니다 */}
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center">
                <Map className="h-8 w-8 text-gray-400 dark:text-gray-500 mr-2" />
                <span className="text-gray-500 dark:text-gray-400">지도 영역</span>
              </div>
              
              {institute.certification && (
                <>
                  <h3 className="text-lg font-semibold mb-3">인증 정보</h3>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
                    <div className="flex items-center mb-2">
                      <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      <span className="font-medium text-green-800 dark:text-green-300">공식 인증 기관</span>
                    </div>
                    <ul className="list-disc list-inside text-green-700 dark:text-green-400 text-sm">
                      {institute.certificationDetails?.map((cert, index) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">시설 및 편의사항</h3>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">교육 시설</h4>
                    <div className="space-y-2">
                      {institute.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-gray-700 dark:text-gray-300">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">편의 시설</h4>
                    <div className="space-y-2">
                      {institute.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-gray-700 dark:text-gray-300">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">센터 정보</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">설립년도</span>
                      <span className="font-medium">{institute.established}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">전문 훈련사</span>
                      <span className="font-medium">{institute.trainers.length}명</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">교육 과정</span>
                      <span className="font-medium">{institute.courses.length}개</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">전문 분야</span>
                      <span className="font-medium">{institute.category}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* 교육 과정 탭 */}
        <TabsContent value="courses" className="pt-2 pb-4">
          <h2 className="text-xl font-bold mb-6">제공 교육 과정</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {institute.courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <Badge variant="secondary">{course.maxParticipants === 1 ? '1:1 맞춤' : `최대 ${course.maxParticipants}명`}</Badge>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {course.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{course.duration}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{course.sessions}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-primary">
                      {course.price.toLocaleString()}원
                    </div>
                    
                    <Button>상세 정보</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">교육 과정 안내</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  모든 교육 과정은 사전 상담을 통해 반려견의 성격과 상태를 평가한 후 참여 가능 여부가 결정됩니다. 
                  특별한 건강 상태나 행동 문제가 있는 경우 반드시 상담 시 알려주셔야 합니다.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* 훈련사 소개 탭 */}
        <TabsContent value="trainers" className="pt-2 pb-4">
          <h2 className="text-xl font-bold mb-6">전문 훈련사 소개</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institute.trainers.map((trainer) => (
              <Card key={trainer.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-16 w-16 mr-4">
                      <img 
                        src={trainer.image} 
                        alt={trainer.name} 
                        className="h-full w-full object-cover rounded-full"
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">{trainer.name} 훈련사</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        경력 {trainer.experience}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">전문 분야</div>
                    <p className="text-gray-800 dark:text-gray-200">{trainer.specialty}</p>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">보유 자격증</div>
                    <ul className="space-y-1">
                      {trainer.certifications.map((cert, index) => (
                        <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                          <Award className="h-3.5 w-3.5 text-primary mr-2" />
                          <span className="text-sm">{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* 시설 갤러리 탭 */}
        <TabsContent value="gallery" className="pt-2 pb-4">
          <h2 className="text-xl font-bold mb-6">시설 갤러리</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {institute.galleryImages.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg h-64 relative group">
                <img 
                  src={image} 
                  alt={`${institute.name} 시설 ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button variant="outline" className="text-white border-white">
                    <Camera className="h-5 w-5 mr-2" />
                    크게 보기
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* 자주 묻는 질문 탭 */}
        <TabsContent value="faq" className="pt-2 pb-4">
          <h2 className="text-xl font-bold mb-6">자주 묻는 질문</h2>
          
          <div className="space-y-4">
            {institute.faq.map((item, index) => (
              <div key={index} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 p-4">
                  <h3 className="font-semibold flex items-center">
                    <FileBadge className="h-5 w-5 text-primary mr-2" />
                    {item.question}
                  </h3>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900">
                  <p className="text-gray-700 dark:text-gray-300">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <div className="max-w-md text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                다른 궁금한 점이 있으신가요? 언제든지 문의해 주세요.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => window.open(`tel:${institute.contact.phone.replace(/-/g, '')}`)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  전화 문의
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.open(`mailto:${institute.contact.email}`)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  이메일 문의
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}