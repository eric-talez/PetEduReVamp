import { useState } from 'react';
import { Link } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Star, Users, Video } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// 모든 훈련사 데이터
const allTrainers = [
  {
    id: 1,
    name: "김훈련",
    specialty: "반려견 문제행동 교정",
    experience: "8년",
    rating: 4.8,
    reviewCount: 128,
    certifications: ["국제 반려동물 훈련사 자격증", "동물행동심리 전문가"],
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    description: "8년 경력의 전문 훈련사로, 특히 문제행동 교정과 기초 훈련에 전문성을 가지고 있습니다.",
    offersVideoClasses: true // 화상 수업 제공 여부
  },
  {
    id: 2,
    name: "박훈련",
    specialty: "그룹 클래스 및 사회화 훈련",
    experience: "6년",
    rating: 4.6,
    reviewCount: 96,
    certifications: ["전문 반려동물 훈련사", "유기견 재활 전문가"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    description: "그룹 수업과 사회화 훈련을 전문으로 하는 훈련사입니다. 다양한 견종의 특성을 고려한 맞춤형 훈련 방법을 제공합니다.",
    offersVideoClasses: true // 화상 수업 제공 여부
  },
  {
    id: 3,
    name: "이훈련",
    specialty: "고급 트릭 훈련 및 도그 스포츠",
    experience: "10년",
    rating: 4.9,
    reviewCount: 75,
    certifications: ["국제 도그 스포츠 코치", "고급 트릭 훈련 스페셜리스트"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    description: "10년 경력의 고급 트릭 훈련 및 도그 스포츠 전문가입니다. 다수의 도그쇼 수상 경력을 보유하고 있습니다.",
    offersVideoClasses: true // 화상 수업 제공 여부
  },
  {
    id: 4,
    name: "최행동",
    specialty: "공격성 및 분리불안 치료",
    experience: "12년",
    rating: 4.7,
    reviewCount: 112,
    certifications: ["반려동물 행동 심리 전문가", "문제행동 교정 스페셜리스트"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    description: "공격성, 분리불안 등 심각한 문제행동 교정에 특화된 전문가입니다. 동물병원과 협력하여 치료적 접근을 제공합니다.",
    offersVideoClasses: true // 화상 수업 제공 여부
  },
  {
    id: 5,
    name: "정시니어",
    specialty: "노령견 케어 및 훈련",
    experience: "9년",
    rating: 4.9,
    reviewCount: 64,
    certifications: ["노령견 케어 전문가", "동물 재활 치료사"],
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    description: "노령견의 신체적, 정신적 건강을 고려한 맞춤형 훈련과 케어 프로그램을 제공합니다.",
    offersVideoClasses: true // 화상 수업 제공 여부
  },
  {
    id: 6,
    name: "한퍼피",
    specialty: "퍼피 훈련 및 조기 사회화",
    experience: "7년",
    rating: 4.8,
    reviewCount: 89,
    certifications: ["퍼피 트레이닝 전문가", "반려견 유치원 교육 자격증"],
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    description: "어린 반려견의 건강한 성장과 사회화를 위한 특화된 프로그램을 제공합니다.",
    offersVideoClasses: true // 화상 수업 제공 여부
  },
  {
    id: 7,
    name: "송훈련",
    specialty: "도그 스포츠 및 어질리티",
    experience: "8년",
    rating: 4.7,
    reviewCount: 58,
    certifications: ["어질리티 코치", "도그스포츠 트레이너"],
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    description: "활동적인 반려견과 보호자를 위한 어질리티, 플라이볼 등 다양한 도그 스포츠를 교육합니다.",
    offersVideoClasses: false // 화상 수업 제공하지 않음
  },
  {
    id: 8,
    name: "윤훈련",
    specialty: "맞춤형 가정 훈련",
    experience: "5년",
    rating: 4.5,
    reviewCount: 42,
    certifications: ["가정견 훈련 전문가"],
    image: "https://images.unsplash.com/photo-1543132220-3ec99c6094dc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    description: "각 가정환경에 맞춘 실용적인 훈련 방법을 제공하여 반려견과의 조화로운 생활을 돕습니다.",
    offersVideoClasses: false // 화상 수업 제공하지 않음
  }
];

// 화상 수업을 제공하는 훈련사만 필터링
const trainersWithVideoClasses = allTrainers.filter(trainer => trainer.offersVideoClasses);

// 수업 상태 타입 정의
type ClassStatus = 'open' | 'full' | 'closed' | 'completed';

// 수업 상태에 따른 라벨과 스타일
const statusConfig: Record<ClassStatus, { label: string, badgeClass: string }> = {
  open: { 
    label: '예약 가능', 
    badgeClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
  },
  full: { 
    label: '정원 마감', 
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100' 
  },
  closed: { 
    label: '접수 마감', 
    badgeClass: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' 
  },
  completed: { 
    label: '종료됨', 
    badgeClass: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' 
  }
};

// 가상 화상 수업 데이터 - 화상 수업을 제공하는 훈련사만
const videoClasses = [
  {
    id: 1,
    title: "1:1 맞춤형 반려견 훈련 컨설팅",
    trainer: trainersWithVideoClasses[0].name,
    trainerId: trainersWithVideoClasses[0].id,
    price: 35000,
    duration: 30,
    rating: trainersWithVideoClasses[0].rating,
    reviews: trainersWithVideoClasses[0].reviewCount,
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    tags: ["1:1 훈련", "맞춤형", "문제행동"],
    description: "반려견의 문제행동 및 기본 훈련에 대한 1:1 맞춤형 화상 컨설팅 서비스입니다. 전문 훈련사가 당신의 반려견에 맞는 훈련 방법을 제시합니다.",
    availability: "평일 10AM-6PM",
    trainerImage: trainersWithVideoClasses[0].image,
    status: 'open' as ClassStatus,
    seatsTotal: 1,
    seatsBooked: 0,
    nextSession: '2025-05-10'
  },
  {
    id: 2,
    title: "그룹 화상 반려견 기초 훈련 클래스",
    trainer: trainersWithVideoClasses[1].name,
    trainerId: trainersWithVideoClasses[1].id,
    price: 25000,
    duration: 45,
    rating: trainersWithVideoClasses[1].rating,
    reviews: trainersWithVideoClasses[1].reviewCount,
    image: "https://images.unsplash.com/photo-1541599468348-e96984315921?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    tags: ["그룹 클래스", "기초 훈련", "사회화"],
    description: "최대 5명의 반려인과 함께하는 그룹 화상 훈련 클래스입니다. 기본 복종 훈련과 사회화 훈련을 배울 수 있습니다.",
    availability: "주말 클래스",
    trainerImage: trainersWithVideoClasses[1].image,
    status: 'open' as ClassStatus,
    seatsTotal: 5,
    seatsBooked: 3,
    nextSession: '2025-05-15'
  },
  {
    id: 3,
    title: "고급 반려견 트릭 훈련 마스터 클래스",
    trainer: trainersWithVideoClasses[2].name,
    trainerId: trainersWithVideoClasses[2].id,
    price: 45000,
    duration: 60,
    rating: trainersWithVideoClasses[2].rating,
    reviews: trainersWithVideoClasses[2].reviewCount,
    image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    tags: ["고급 훈련", "트릭", "쇼 훈련"],
    description: "이미 기본 훈련이 되어 있는 반려견을 위한 고급 트릭 훈련 클래스입니다. 전문적인 쇼 훈련사가 직접 지도합니다.",
    availability: "월 2회 (격주 토요일)",
    trainerImage: trainersWithVideoClasses[2].image,
    status: 'full' as ClassStatus,
    seatsTotal: 4,
    seatsBooked: 4,
    nextSession: '2025-05-17'
  },
  {
    id: 4,
    title: "문제행동 집중 개선 프로그램",
    trainer: trainersWithVideoClasses[3].name,
    trainerId: trainersWithVideoClasses[3].id,
    price: 50000,
    duration: 40,
    rating: trainersWithVideoClasses[3].rating,
    reviews: trainersWithVideoClasses[3].reviewCount,
    image: "https://images.unsplash.com/photo-1477884143921-51d0a574ee09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    tags: ["문제행동", "분리불안", "공격성"],
    description: "짖음, 분리불안, 공격성 등 다양한 문제행동을 개선하기 위한 전문적인 화상 훈련 프로그램입니다.",
    availability: "상시 예약 가능",
    trainerImage: trainersWithVideoClasses[3].image,
    status: 'open' as ClassStatus,
    seatsTotal: 1,
    seatsBooked: 0,
    nextSession: '2025-05-11'
  },
  {
    id: 5,
    title: "노령견 케어 & 훈련 특별 클래스",
    trainer: trainersWithVideoClasses[4].name,
    trainerId: trainersWithVideoClasses[4].id,
    price: 40000,
    duration: 30,
    rating: trainersWithVideoClasses[4].rating,
    reviews: trainersWithVideoClasses[4].reviewCount,
    image: "https://images.unsplash.com/photo-1559190394-df5a28aab5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    tags: ["노령견", "케어", "건강"],
    description: "시니어 반려견을 위한 특별 훈련 및 케어 프로그램입니다. 노령견의 신체적, 정신적 건강을 고려한 맞춤형 훈련을 제공합니다.",
    availability: "화, 목 오후 2-5시",
    trainerImage: trainersWithVideoClasses[4].image,
    status: 'closed' as ClassStatus,
    seatsTotal: 3,
    seatsBooked: 2,
    nextSession: '2025-05-14'
  },
  {
    id: 6,
    title: "퍼피 사회화 & 기초 훈련 클래스",
    trainer: trainersWithVideoClasses[5].name,
    trainerId: trainersWithVideoClasses[5].id,
    price: 30000,
    duration: 40,
    rating: trainersWithVideoClasses[5].rating,
    reviews: trainersWithVideoClasses[5].reviewCount,
    image: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    tags: ["퍼피", "사회화", "기초 훈련"],
    description: "8주-6개월 퍼피를 위한 초기 사회화 및 기초 훈련 클래스입니다. 올바른 행동 습관 형성에 중점을 둡니다.",
    availability: "월, 수, 금 오전 10-12시",
    trainerImage: trainersWithVideoClasses[5].image,
    status: 'completed' as ClassStatus,
    seatsTotal: 5,
    seatsBooked: 5,
    nextSession: '2025-04-30'
  }
];

export default function VideoCallPage() {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState("all"); // 필터 상태: all, 1on1, group

  // 필터링된 비디오 클래스
  const filteredClasses = videoClasses.filter(cls => {
    if (filter === "all") return true;
    if (filter === "1on1") return cls.tags.includes("1:1 훈련");
    if (filter === "group") return cls.tags.includes("그룹 클래스");
    return true;
  });

  const handleReservation = (classId: number) => {
    if (!isAuthenticated) {
      // 로그인이 필요한 경우 로그인 페이지로 리다이렉트
      window.location.href = "/auth"; // 또는 모달로 로그인 유도
      return;
    }
    
    // 로그인된 경우 예약 페이지로 이동
    window.location.href = `/video-call/reserve/${classId}`;
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">화상 수업 프로그램</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          전문 훈련사와 실시간으로 소통하며 효과적인 반려견 훈련을 경험하세요
        </p>
      </div>

      {/* 필터 섹션 */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        <Button 
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className="rounded-full"
        >
          전체 클래스
        </Button>
        <Button 
          variant={filter === "1on1" ? "default" : "outline"}
          onClick={() => setFilter("1on1")}
          className="rounded-full"
        >
          1:1 개인 수업
        </Button>
        <Button 
          variant={filter === "group" ? "default" : "outline"}
          onClick={() => setFilter("group")}
          className="rounded-full"
        >
          그룹 수업
        </Button>
      </div>

      {/* 화상 수업 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((videoClass) => (
          <Card key={videoClass.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img 
                src={videoClass.image} 
                alt={videoClass.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                {videoClass.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-100">
                    {tag}
                  </Badge>
                ))}
              </div>
              <CardTitle className="line-clamp-2">{videoClass.title}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">{videoClass.trainer} 훈련사</span>
                <div className="flex items-center ml-auto">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="text-sm">{videoClass.rating} ({videoClass.reviews})</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                {videoClass.description}
              </p>
              <div className="flex justify-between items-center mb-3">
                <Badge className={statusConfig[videoClass.status].badgeClass}>
                  {statusConfig[videoClass.status].label}
                </Badge>
                {videoClass.status === 'open' && (
                  <span className="text-xs text-gray-500">
                    {videoClass.seatsBooked}/{videoClass.seatsTotal} 예약됨
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center w-full sm:w-auto sm:mr-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{videoClass.duration}분</span>
                </div>
                <div className="flex items-center w-full sm:w-auto sm:mr-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {videoClass.status !== 'completed' 
                      ? `다음 일정: ${new Date(videoClass.nextSession).toLocaleDateString('ko-KR', {
                          month: 'long', 
                          day: 'numeric',
                          weekday: 'short'
                        })}` 
                      : '진행 완료'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-4">
              <div className="text-lg font-bold text-primary">
                {videoClass.price.toLocaleString()}원
              </div>
              {videoClass.status === 'open' ? (
                <Button 
                  onClick={() => handleReservation(videoClass.id)}
                  className="flex items-center gap-1"
                >
                  <Video className="h-4 w-4" />
                  수업 예약
                </Button>
              ) : videoClass.status === 'full' ? (
                <Button 
                  variant="outline"
                  className="flex items-center gap-1 text-amber-600 border-amber-600"
                  disabled
                >
                  <Calendar className="h-4 w-4" />
                  정원 마감
                </Button>
              ) : videoClass.status === 'closed' ? (
                <Button 
                  variant="outline"
                  className="flex items-center gap-1"
                  disabled
                >
                  <Calendar className="h-4 w-4" />
                  접수 마감
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  className="flex items-center gap-1"
                  disabled
                >
                  <Calendar className="h-4 w-4" />
                  종료됨
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* 안내 섹션 */}
      <div className="mt-12 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">화상 수업 안내</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">예약 방법</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              원하는 수업을 선택하고 예약 버튼을 클릭하면 일정을 선택할 수 있습니다. 결제 후 바로 수업 접근 링크가 제공됩니다.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">화상 수업 준비물</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              카메라와 마이크가 있는 기기(스마트폰, 태블릿, 노트북), 안정적인 인터넷 환경, 그리고 반려견이 편안히 있을 수 있는 공간이 필요합니다.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">환불 정책</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              수업 시작 24시간 전까지 취소 시 100% 환불, 12시간 전까지 50% 환불이 가능합니다. 그 이후에는 환불이 불가능합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}