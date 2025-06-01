import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, MapPin, Star, Briefcase, Award, Sparkles, X, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth"; // 모듈화된 useAuth 훅 사용

export default function Trainers() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMemberAlert, setShowMemberAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: "", description: "" });
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth(); // useAuth 훅을 사용하여 로그인 상태 확인
  
  const openTrainerModal = (trainer: any) => {
    console.log("훈련사 프로필 열기:", trainer.name);
    setSelectedTrainer(trainer);
    setIsModalOpen(true);
  };

  const closeTrainerModal = () => {
    console.log("훈련사 프로필 닫기");
    setIsModalOpen(false);
  };
  
  const handleViewCourses = (trainerId: number) => {
    console.log(`${trainerId}번 훈련사의 강의 목록 보기`);
    closeTrainerModal();
    setLocation(`/courses?trainer=${trainerId}`);
  };
  
  const handleBookConsultation = (trainerId: number) => {
    console.log(`${trainerId}번 훈련사와 상담 예약하기`);
    
    if (!isAuthenticated) {
      closeTrainerModal();
      setAlertMessage({
        title: "회원 전용 서비스",
        description: "상담 예약은 로그인 후 이용 가능합니다. 로그인 페이지로 이동하시겠습니까?"
      });
      setShowMemberAlert(true);
      return;
    }
    
    closeTrainerModal();
    setLocation(`/video-call?trainer=${trainerId}`);
  };
  
  const handleCourseReservation = (trainerId: number) => {
    console.log(`${trainerId}번 훈련사의 화상수업 예약하기`);
    
    if (!isAuthenticated) {
      closeTrainerModal();
      setAlertMessage({
        title: "회원 전용 서비스",
        description: "화상수업 예약은 로그인 후 이용 가능합니다. 로그인 페이지로 이동하시겠습니까?"
      });
      setShowMemberAlert(true);
      return;
    }
    
    closeTrainerModal();
    setLocation(`/course-reservation?trainer=${trainerId}`);
  };
  
  const handleLoginRedirect = () => {
    setShowMemberAlert(false);
    setLocation('/auth');
  };
  
  const trainers = [
    {
      id: 1,
      name: "김훈련",
      title: "수석 훈련사",
      specialty: "반려견 기본 훈련",
      avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      background: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      location: "서울시 강남구",
      rating: 4.9,
      reviews: 56,
      courses: 5,
      experience: "10년+",
      category: "기본 훈련",
      certification: true,
      featured: true,
      bio: "10년 이상의 경력을 가진 전문 훈련사로서 수천 마리의 반려견을 교육했습니다. 문제 행동 교정, 기본 훈련에 특화되어 있으며 개별 맞춤형 훈련 프로그램을 제공합니다."
    },
    {
      id: 2,
      name: "박민첩",
      title: "어질리티 전문 훈련사",
      specialty: "반려견 어질리티",
      avatar: "https://images.unsplash.com/photo-1548535537-3cfaf1fc327c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      background: "https://images.unsplash.com/photo-1583336663277-620dc1996580?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      location: "서울시 송파구",
      rating: 4.7,
      reviews: 38,
      courses: 3,
      experience: "7년",
      category: "활동 훈련",
      certification: true,
      bio: "어질리티 대회에서 여러 차례 수상한 경력을 가진 전문 훈련사입니다. 반려견의 신체 능력을 향상시키고 집중력과 민첩성을 키울 수 있는 다양한 훈련법을 제공합니다."
    },
    {
      id: 3,
      name: "이사회",
      title: "사회화 전문 훈련사",
      specialty: "반려견 사회화 훈련",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      background: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      location: "서울시 마포구",
      rating: 4.8,
      reviews: 44,
      courses: 2,
      experience: "6년",
      category: "사회화",
      certification: true,
      bio: "반려견이 다른 동물, 사람, 환경에 적응할 수 있도록 도와주는 사회화 훈련 전문가입니다. 동물 행동학을 전공하여 과학적인 접근법으로 훈련을 진행합니다."
    },
    {
      id: 4,
      name: "최행동",
      title: "행동 교정 전문가",
      specialty: "문제 행동 교정",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      background: "https://images.unsplash.com/photo-1583512603806-077998240c7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      location: "경기도 고양시",
      rating: 4.7,
      reviews: 31,
      courses: 4,
      experience: "8년",
      category: "행동 교정",
      certification: true,
      featured: true,
      bio: "분리불안, 공격성, 짖음 등 다양한 문제 행동을 전문적으로 교정합니다. 개별 상담을 통해 반려견의 특성을 파악하고 맞춤형 솔루션을 제공합니다."
    },
    {
      id: 5,
      name: "박재미",
      title: "트릭 훈련 전문가",
      specialty: "재미있는 트릭 훈련",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      background: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      location: "인천시 부평구",
      rating: 4.5,
      reviews: 27,
      courses: 2,
      experience: "5년",
      category: "트릭 훈련",
      certification: false,
      bio: "반려견과 재미있게 교감할 수 있는 다양한 트릭 훈련을 제공합니다. 하이파이브부터 점프, 회전까지 반려견의 두뇌를 자극하고 견주와의 유대감을 강화하는 훈련법을 알려드립니다."
    },
    {
      id: 6,
      name: "김심리",
      title: "반려견 심리 상담사",
      specialty: "반려견 심리 케어",
      avatar: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      background: "https://images.unsplash.com/photo-1601758177266-bc599de87707?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      location: "서울시 서초구",
      rating: 4.8,
      reviews: 35,
      courses: 3,
      experience: "9년",
      category: "심리 케어",
      certification: true,
      bio: "반려견의 심리 상태를 분석하고 정서적 안정을 돕는 전문가입니다. 애착 형성, 트라우마 극복, 자신감 향상 등 심리적 측면에서 접근하는 훈련 프로그램을 제공합니다."
    },
    {
      id: 7,
      name: "이산책",
      title: "산책 훈련 전문가",
      specialty: "산책 예절 마스터",
      avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      background: "https://images.unsplash.com/photo-1551730459-92db2a308d6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      location: "경기도 성남시",
      rating: 4.6,
      reviews: 29,
      courses: 1,
      experience: "6년",
      category: "기본 훈련",
      certification: true,
      bio: "끌기, 짖기 없이 즐거운 산책을 위한 전문 훈련사입니다. 리드 훈련과 외부 환경 적응법을 통해 반려견의 산책 스트레스를 줄이고 견주가 편안하게 산책할 수 있도록 도와드립니다."
    },
    {
      id: 8,
      name: "박후각",
      title: "노즈워크 전문가",
      specialty: "반려견 노즈워크",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      background: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      location: "서울시 강서구",
      rating: 4.7,
      reviews: 22,
      courses: 2,
      experience: "4년",
      category: "특수 훈련",
      certification: false,
      featured: true,
      bio: "반려견의 뛰어난 후각을 활용한 노즈워크 전문 훈련사입니다. 후각을 통한 놀이와 훈련으로 반려견의 지능 발달과 스트레스 해소에 도움을 드립니다."
    }
  ];

  // 검색 기능
  const handleSearch = () => {
    console.log('훈련사 검색 실행:', searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    console.log('검색어 변경:', e.target.value);
  };

  // 실시간 검색 및 필터링
  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = !searchTerm || 
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
      (filter === 'certification' && trainer.certification) ||
      (filter === 'featured' && trainer.featured) ||
      trainer.category === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Banner */}
      <div className="relative rounded-xl overflow-hidden h-48 md:h-64 mb-8 bg-gradient-to-r from-primary/80 to-accent/80 shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400" 
          alt="훈련사 찾기"
          className="w-full h-full object-cover absolute mix-blend-overlay"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/30 mix-blend-multiply"></div>
        
        <div className="relative h-full flex flex-col justify-center px-6 md:px-10">
          <h1 className="text-white text-xl md:text-3xl font-bold mb-2 md:mb-4 max-w-xl">
            전문 반려견 훈련사를 만나보세요
          </h1>
          <p className="text-white text-sm md:text-base max-w-xl mb-4">
            경험이 풍부한 훈련사들이 당신과 반려견의 행복한 생활을 도와드립니다.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-lg bg-white dark:bg-gray-800 rounded-lg flex items-center p-1">
            <div className="px-2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="지역, 전문 분야로 훈련사 찾기" 
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 py-2 px-2 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
            />
            <Button className="ml-2" onClick={handleSearch}>
              검색
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mr-4">
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-2 mr-1" />
          <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">필터:</span>
        </div>
        
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className="text-xs"
        >
          전체
        </Button>
        
        <Button
          variant={filter === "certification" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("certification")}
          className="text-xs"
        >
          인증 훈련사
        </Button>
        
        <Button
          variant={filter === "featured" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("featured")}
          className="text-xs"
        >
          추천 훈련사
        </Button>
        
        <Button
          variant={filter === "기본 훈련" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("기본 훈련")}
          className="text-xs"
        >
          기본 훈련
        </Button>
        
        <Button
          variant={filter === "행동 교정" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("행동 교정")}
          className="text-xs"
        >
          행동 교정
        </Button>
        
        <Button
          variant={filter === "특수 훈련" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("특수 훈련")}
          className="text-xs"
        >
          특수 훈련
        </Button>
      </div>
      
      {/* Trainers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainers.map((trainer) => (
          <Card 
            key={trainer.id} 
            className="overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="relative h-32 bg-gradient-to-r from-primary/60 to-accent/60">
              <img 
                src={trainer.background} 
                alt={trainer.name} 
                className="w-full h-full object-cover mix-blend-overlay"
                style={{ filter: 'none' }}
              />
              
              {trainer.featured && (
                <Badge variant="warning" className="absolute top-2 right-2">
                  <Sparkles className="h-3 w-3 mr-1" />
                  추천 훈련사
                </Badge>
              )}
            </div>
            
            <div className="pt-0 p-5">
              <div className="flex items-end -mt-12 mb-4">
                <div className="w-20 h-20 border-4 border-white dark:border-gray-800 rounded-full overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300&auto=format&fit=crop&sharp=100" 
                    alt={trainer.name} 
                    className="w-full h-full object-cover brightness-105 contrast-105" 
                    style={{ filter: 'none' }}
                  />
                </div>
                <div className="ml-4 pb-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{trainer.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{trainer.title}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{trainer.location}</span>
                </div>
                
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{trainer.rating} ({trainer.reviews} 후기)</span>
                </div>
                
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">경력 {trainer.experience}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-primary/10 dark:bg-primary/5 text-primary-foreground">
                  {trainer.specialty}
                </Badge>
                
                {trainer.certification && (
                  <Badge variant="success" className="flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    인증
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {trainer.bio}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">강의 </span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{trainer.courses}개</span>
                </div>
                
                <Button
                  onClick={() => {
                    console.log("프로필 보기 버튼 클릭:", trainer.name);
                    openTrainerModal(trainer);
                  }}
                >
                  프로필 보기
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="mt-10 flex justify-center">
        <nav className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="text-sm">
            이전
          </Button>
          <Button variant="default" size="sm" className="text-sm">
            1
          </Button>
          <Button variant="outline" size="sm" className="text-sm">
            2
          </Button>
          <Button variant="outline" size="sm" className="text-sm">
            3
          </Button>
          <Button variant="outline" size="sm" className="text-sm">
            다음
          </Button>
        </nav>
      </div>
      
      {/* 회원 전용 서비스 알림 */}
      <AlertDialog open={showMemberAlert} onOpenChange={setShowMemberAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
              {alertMessage.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowMemberAlert(false)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLoginRedirect}>
              로그인 페이지로 이동
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* 트레이너 프로필 모달 */}
      {isModalOpen && selectedTrainer && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closeTrainerModal}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-2xl w-full overflow-y-auto max-h-[90vh] p-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={selectedTrainer.background}
                alt={`${selectedTrainer.name} 배경`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              <button 
                onClick={closeTrainerModal}
                className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors"
                type="button"
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* 모달 본문 */}
            <div className="p-6">
              {/* 기본 정보 섹션 */}
              <div className="flex flex-col sm:flex-row mb-6 -mt-16 relative">
                <div className="w-24 h-24 border-4 border-white dark:border-gray-900 rounded-full overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300&auto=format&fit=crop&sharp=100" 
                    alt={selectedTrainer.name} 
                    className="w-full h-full object-cover brightness-110 contrast-110" 
                  />
                </div>
                
                <div className="mt-4 sm:mt-6 sm:ml-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedTrainer.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedTrainer.title}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-primary/10 dark:bg-primary/5 text-primary-foreground">
                      {selectedTrainer.specialty}
                    </Badge>
                    
                    {selectedTrainer.certification && (
                      <Badge variant="success" className="flex items-center">
                        <Award className="h-3 w-3 mr-1" />
                        인증
                      </Badge>
                    )}
                    
                    {selectedTrainer.featured && (
                      <Badge variant="warning" className="flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        추천
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 상세 정보 */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <div>
                      <div className="text-sm font-medium">{selectedTrainer.rating} / 5.0</div>
                      <div className="text-xs text-gray-500">{selectedTrainer.reviews} 후기</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Briefcase className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">경력 {selectedTrainer.experience}</div>
                      <div className="text-xs text-gray-500">전문 훈련사</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">{selectedTrainer.location}</div>
                      <div className="text-xs text-gray-500">활동 지역</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">훈련사 소개</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedTrainer.bio}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">강의 및 예약</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {selectedTrainer.name} 훈련사는 총 {selectedTrainer.courses}개의 강의를 진행하고 있습니다.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button 
                      onClick={() => handleViewCourses(selectedTrainer.id)}
                    >
                      강의 보기
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleBookConsultation(selectedTrainer.id)}
                    >
                      상담 예약
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleCourseReservation(selectedTrainer.id)}
                    >
                      화상수업 예약
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
