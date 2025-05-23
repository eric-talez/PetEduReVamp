import { useState, useEffect } from 'react';
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
import { 
  AlertCircle, 
  Calendar, 
  Clock, 
  Star, 
  Users, 
  Video, 
  X,
  User,
  MapPin,
  CheckCircle,
  ChevronRight,
  Search,
  Link as LinkIcon,
  ExternalLink
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  ClassStatus, 
  VideoClass as VideoClassType, 
  runAutoClassCancellationCheck 
} from '@/services/classManagement';

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
    image: "https://robohash.org/trainer1?set=set4&size=250x250&bgset=bg1",
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
    image: "https://robohash.org/trainer2?set=set4&size=250x250&bgset=bg1",
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
    image: "https://robohash.org/trainer3?set=set4&size=250x250&bgset=bg1",
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
    image: "https://robohash.org/trainer4?set=set4&size=250x250&bgset=bg1",
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
    image: "https://robohash.org/trainer5?set=set4&size=250x250&bgset=bg1",
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
    image: "https://robohash.org/trainer6?set=set4&size=250x250&bgset=bg1",
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
  },
  cancelled: {
    label: '취소됨',
    badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
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
  const [filter, setFilter] = useState("all"); // 필터 상태: all, 1on1, group
  // 선택된 수업 상태
  const [selectedClass, setSelectedClass] = useState<VideoClassType | null>(null);
  // 상세 보기 다이얼로그 상태
  const [showDetail, setShowDetail] = useState(false);
  // 수업 데이터 상태 (자동 취소 처리를 위해 상태로 관리)
  const [classesData, setClassesData] = useState<VideoClassType[]>(videoClasses as VideoClassType[]);
  
  // 자동 취소 처리를 위한 useEffect
  useEffect(() => {
    // 페이지 로드 시 자동으로 수업 취소 조건 체크
    // 실제 서비스에서는 서버에서 주기적으로 실행되어야 함
    const initializedClasses = videoClasses.map(cls => ({
      ...cls,
      // 테스트를 위해 일부 수업에 자동 취소 설정 추가
      isAutoCancelEnabled: cls.id === 1 || cls.id === 4,
      minParticipants: cls.id === 1 || cls.id === 4 ? 1 : null
    })) as VideoClassType[];
    
    // 초기 데이터 설정
    setClassesData(initializedClasses);
    
    // 3초 후 자동 취소 로직 실행 (데모 목적)
    const timer = setTimeout(() => {
      // 자동 취소 처리 적용
      const updatedClasses = runAutoClassCancellationCheck(initializedClasses);
      setClassesData(updatedClasses);
      
      console.log('자동 취소 처리 완료');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 로그인 상태를 localStorage에서 직접 확인
  const checkIsAuthenticated = () => {
    const authData = localStorage.getItem('petedu_auth');
    return !!authData; // authData가 존재하면 true, 없으면 false
  };

  // 필터링된 비디오 클래스
  const filteredClasses = classesData.filter(cls => {
    if (filter === "all") return true;
    if (filter === "1on1") return cls.tags.includes("1:1 훈련");
    if (filter === "group") return cls.tags.includes("그룹 클래스");
    return true;
  });

  // 로그인 필요 안내 토스트 상태
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  
  // 수업 클릭 시 상세 정보 표시
  const handleClassClick = (videoClass: VideoClassType) => {
    setSelectedClass(videoClass);
    setShowDetail(true);
  };
  
  // 상세 다이얼로그 닫기
  const handleCloseDetail = () => {
    setShowDetail(false);
  };
  
  const handleReservation = (classId: number) => {
    // 로그인 상태 확인
    const isAuthenticated = checkIsAuthenticated();
    
    if (!isAuthenticated) {
      // 비로그인 상태면 토스트 알림 표시
      toast({
        title: "로그인이 필요합니다",
        description: "화상 수업을 예약하려면 먼저 로그인해 주세요.",
        variant: "destructive",
      });
      
      // 알림 표시
      setShowLoginAlert(true);
      
      // 3초 후 알림 자동 닫기
      setTimeout(() => {
        setShowLoginAlert(false);
      }, 3000);
      
      return;
    }
    
    // 로그인 상태면 예약 페이지로 이동
    window.location.href = `/video-call/reserve/${classId}`;
  };

  return (
    <div className="py-8">
      {/* 로그인 필요 알림 */}
      {showLoginAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-amber-50 border border-amber-200 text-amber-800 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-medium">로그인이 필요한 서비스입니다.</p>
            <p className="text-sm">화상 수업을 예약하려면 먼저 로그인해 주세요.</p>
          </div>
          <button 
            onClick={() => setShowLoginAlert(false)}
            className="ml-auto text-amber-700 hover:text-amber-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* 상단 배너 */}
      <div 
        className="relative rounded-xl overflow-hidden h-48 md:h-64 mb-8 bg-gradient-to-r from-primary/80 to-accent/80 shadow-lg"
        role="banner" 
        aria-label="화상 수업 안내 배너"
      >
        <img 
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400" 
          alt="전문 훈련사와 반려견이 함께하는 실시간 화상 수업 - 개인 맞춤형 및 그룹 수업 제공"
          className="w-full h-full object-cover absolute"
          loading="eager"
          fetchpriority="high"
        />
        
        {/* 이미지 필터 제거하여 원본 이미지 표시 */}
        
        <div className="relative h-full flex flex-col justify-center px-6 md:px-10 container mx-auto">
          <h1 className="text-primary dark:text-white text-xl md:text-3xl font-bold mb-2 md:mb-4 max-w-xl bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg">
            실시간 화상 수업
          </h1>
          <p className="text-gray-800 dark:text-gray-200 text-sm md:text-base max-w-xl mb-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg">
            자격을 갖춘 전문 훈련사와 함께 실시간으로 소통하며 맞춤형 훈련 지도를 받으세요. 1:1 또는 그룹 수업 가능합니다.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="bg-white/90 text-primary hover:bg-white">
              1:1 개인 맞춤형
            </Badge>
            <Badge variant="secondary" className="bg-white/90 text-primary hover:bg-white">
              화상 그룹 수업
            </Badge>
            <Badge variant="secondary" className="bg-white/90 text-primary hover:bg-white">
              전문가 실시간 피드백
            </Badge>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-lg bg-white dark:bg-gray-800 rounded-lg flex items-center p-1">
            <div className="px-2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="화상 수업 검색" 
              className="flex-1 py-2 px-2 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
            />
            <Button className="ml-2">
              검색
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">예약 가능한 화상 수업</h2>
          <p className="text-gray-600 dark:text-gray-400">
            전문 훈련사와 실시간으로 소통하며 효과적인 반려견 훈련을 경험하세요
          </p>
        </div>

        {/* 필터 섹션 - 탭 스타일로 변경 */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <div className="bg-muted inline-flex h-10 items-center justify-center rounded-md p-1 text-muted-foreground">
              <Button 
                variant={filter === "all" ? "default" : "ghost"}
                onClick={() => setFilter("all")}
                className="rounded-sm h-8 px-3"
              >
                전체 클래스
              </Button>
              <Button 
                variant={filter === "1on1" ? "default" : "ghost"}
                onClick={() => setFilter("1on1")}
                className="rounded-sm h-8 px-3"
              >
                1:1 개인 수업
              </Button>
              <Button 
                variant={filter === "group" ? "default" : "ghost"}
                onClick={() => setFilter("group")}
                className="rounded-sm h-8 px-3"
              >
                그룹 수업
              </Button>
            </div>
          </div>
        </div>

        {/* 화상 수업 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((videoClass) => (
            <Card 
              key={videoClass.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleClassClick(videoClass)}
            >
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
                    onClick={(e) => {
                      e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
                      handleReservation(videoClass.id);
                    }}
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
        
        {/* 상세 보기 다이얼로그 */}
        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedClass && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedClass.title}</DialogTitle>
                  <DialogDescription className="flex items-center mt-2">
                    <div className="flex items-center">
                      <img 
                        src={selectedClass.trainerImage} 
                        alt={selectedClass.trainer} 
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                      />
                      <span className="font-medium">{selectedClass.trainer} 훈련사</span>
                    </div>
                    <div className="flex items-center ml-auto">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span>{selectedClass.rating} ({selectedClass.reviews})</span>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mt-4">
                  <div className="rounded-lg overflow-hidden mb-6 max-h-[400px]">
                    <img 
                      src={selectedClass.image} 
                      alt={selectedClass.title} 
                      className="w-full object-cover"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        수업 정보
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">진행 시간</span>
                          <span className="font-medium">{selectedClass.duration}분</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">가능 일정</span>
                          <span className="font-medium">{selectedClass.availability}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">다음 수업</span>
                          <span className="font-medium">
                            {new Date(selectedClass.nextSession).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long', 
                              day: 'numeric',
                              weekday: 'short'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        참여 정보
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">수업 방식</span>
                          <span className="font-medium">
                            {selectedClass.tags.includes("1:1 훈련") ? "1:1 개인 수업" : "그룹 수업"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">예약 현황</span>
                          <span className="font-medium">
                            {selectedClass.seatsBooked}/{selectedClass.seatsTotal} 명
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">수업 상태</span>
                          <Badge className={statusConfig[selectedClass.status].badgeClass}>
                            {statusConfig[selectedClass.status].label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        훈련사 정보
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">전문 분야</span>
                          <span className="font-medium truncate max-w-[120px]">
                            {allTrainers.find(t => t.name === selectedClass.trainer)?.specialty || "반려견 훈련"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">경력</span>
                          <span className="font-medium">
                            {allTrainers.find(t => t.name === selectedClass.trainer)?.experience || "5년+"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">수업 횟수</span>
                          <span className="font-medium">
                            {selectedClass.reviews}회+
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3">수업 설명</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedClass.description}
                    </p>
                  </div>
                  
                  <div className="mb-6 grid grid-cols-1 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                      <h3 className="font-bold mb-2">수업 진행 방식</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        화상 회의 플랫폼(Zoom)을 통해 실시간으로 진행됩니다. 예약 완료 후 이메일로 수업 링크가 발송됩니다. 
                        수업 시작 5분 전까지 접속해 주시기 바랍니다.
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                      <h3 className="font-bold mb-2">예약 및 결제 안내</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        원하는 수업을 선택하고 예약 버튼을 클릭하면 일정을 선택할 수 있습니다. 결제 후 바로 수업 접근 링크가 제공됩니다.
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                      <h3 className="font-bold mb-2">화상 수업 준비물</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        카메라와 마이크가 있는 기기(스마트폰, 태블릿, 노트북), 안정적인 인터넷 환경, 그리고 반려견이 편안히 있을 수 있는 공간이 필요합니다.
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                      <h3 className="font-bold mb-2">환불 정책</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        수업 시작 10분 전까지 취소 시 100% 환불이 가능합니다. 그 이후에는 취소 및 환불이 불가능합니다.
                      </p>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-4">
                  {selectedClass.status === 'open' && (
                    <Button 
                      onClick={() => handleReservation(selectedClass.id)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                      <Video className="h-4 w-4" />
                      수업 예약하기
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={handleCloseDetail} 
                    className="w-full sm:w-auto"
                  >
                    닫기
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}