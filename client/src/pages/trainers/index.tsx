import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, MapPin, Star, Briefcase, Award, Sparkles, X, AlertCircle, Loader2 } from "lucide-react";
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
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth(); // useAuth 훅을 사용하여 로그인 상태 확인

  // API에서 훈련사 데이터 로드
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (filter !== "all") {
          if (filter === "certification") {
            params.append('certification', 'true');
          } else if (filter === "featured") {
            params.append('featured', 'true');
          } else {
            params.append('specialty', filter);
          }
        }
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        const response = await fetch(`/api/trainers?${params.toString()}`);
        if (!response.ok) {
          throw new Error('훈련사 데이터를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        setTrainers(data.trainers || []);
      } catch (err) {
        console.error('훈련사 데이터 로드 오류:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        // 오류 시 기본 데이터 사용
        setTrainers(getDefaultTrainers());
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, [filter, searchTerm]);

  // 기본 훈련사 데이터 (API 오류 시 사용)
  const getDefaultTrainers = () => [
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
      bio: "10년 이상의 경력을 가진 전문 훈련사로서 수천 마리의 반려견을 교육했습니다."
    }
  ];
  
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
  
  const handleBookConsultation = async (trainerId: number) => {
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
    
    try {
      // 실제 상담 예약 API 호출
      const response = await fetch(`/api/trainers/${trainerId}/consultation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1, // 실제로는 현재 로그인한 사용자 ID
          date: new Date().toISOString().split('T')[0],
          time: "14:00",
          message: "상담 예약 요청입니다."
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('상담 예약 성공:', data);
        closeTrainerModal();
        setLocation(`/video-call?trainer=${trainerId}&consultation=${data.consultation.id}`);
      } else {
        console.error('상담 예약 실패');
        closeTrainerModal();
        setLocation(`/video-call?trainer=${trainerId}`);
      }
    } catch (error) {
      console.error('상담 예약 오류:', error);
      closeTrainerModal();
      setLocation(`/video-call?trainer=${trainerId}`);
    }
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
  
  // 로딩 상태 처리
  if (loading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600 dark:text-gray-400">훈련사 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              다시 시도
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 검색 기능
  const handleSearch = () => {
    console.log('훈련사 검색 실행:', searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    console.log('검색어 변경:', e.target.value);
  };

  // 검색 결과 표시 (API에서 이미 필터링된 데이터 사용)
  const filteredTrainers = trainers;

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
                className="w-full h-full object-cover light-mode"
                style={{ 
                  filter: 'none !important', 
                  WebkitFilter: 'none !important',
                  mixBlendMode: 'normal',
                  opacity: '0.8'
                }}
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
                    className="w-full h-full object-cover light-mode" 
                    style={{ 
                      filter: 'none !important', 
                      WebkitFilter: 'none !important',
                      brightness: '1',
                      contrast: '1'
                    }}
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
