import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Star, MapPin, Search, Filter, Briefcase, Award, Sparkles } from 'lucide-react';
import { SimpleTrainerProfileModal, type Trainer } from '@/components/SimpleTrainerProfileModal';

export default function Trainers() {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // 상태 변경 감지
  useEffect(() => {
    console.log("Trainers - 상태 변경:", { selectedTrainer: selectedTrainer?.name, isProfileOpen });
  }, [selectedTrainer, isProfileOpen]);

  // Mock trainers data
  const trainers: Trainer[] = [
    {
      id: 1,
      name: "김훈련",
      image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      specialty: "기초 훈련, 행동 교정",
      description: "10년 경력의 반려견 훈련 전문가. 특히 문제행동 교정에 특화된 훈련 프로그램을 진행합니다.",
      rating: 4.9,
      reviewCount: 128,
      certifications: ["KKF 공인 훈련사", "국제 반려동물 관리사"],
      coursesCount: 5,
      location: "서울 강남구",
      experience: "반려견 훈련 10년, 대형견 전문 훈련사 5년, 경찰견 훈련 참여 2년",
      education: [
        "서울대학교 수의학과 학사",
        "국제 반려동물 훈련사 자격증 취득",
        "문제행동 교정 전문가 과정 수료"
      ],
      languages: ["한국어", "영어"],
      availableHours: "평일 10:00 - 18:00, 주말 12:00 - 17:00"
    },
    {
      id: 2,
      name: "박민첩",
      image: "https://images.unsplash.com/photo-1548535537-3cfaf1fc327c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      specialty: "어질리티, 도그 스포츠",
      description: "국내 최고의 어질리티 전문 훈련사. 다수의 국제 대회 수상 경력이 있으며 즐겁게 배우는 훈련을 지향합니다.",
      rating: 4.8,
      reviewCount: 92,
      certifications: ["국제 어질리티 심판", "반려동물행동교정사"],
      coursesCount: 3,
      location: "서울 송파구",
      experience: "어질리티 대회 참가 8년, 국제 대회 우승 3회, 도그스포츠 지도 6년",
      education: [
        "한국체육대학교 체육학과",
        "국제 어질리티 코치 자격증",
        "스포츠 트레이닝 전문가 과정"
      ],
      languages: ["한국어", "일본어"],
      availableHours: "평일 13:00 - 21:00, 주말 09:00 - 18:00"
    },
    {
      id: 3,
      name: "이사회",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      specialty: "사회화 훈련, 퍼피 클래스",
      description: "어린 강아지 사회화 전문가. 올바른 성장 습관을 기르고 건강한 사회성을 발달시키는 프로그램을 운영합니다.",
      rating: 4.7,
      reviewCount: 83,
      certifications: ["동물행동학 석사", "유아견 전문 훈련사"],
      coursesCount: 4,
      location: "인천 연수구",
      experience: "퍼피 클래스 운영 7년, 아동-반려견 사회화 프로그램 개발 및 운영",
      education: [
        "동국대학교 동물자원학과",
        "유아견 사회화 전문가 과정",
        "아동심리학 수료"
      ],
      languages: ["한국어"],
      availableHours: "평일 10:00 - 16:00"
    },
    {
      id: 4,
      name: "최행동",
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      specialty: "행동 교정, 분리불안",
      description: "문제행동 교정 전문가. 특히 분리불안, 공격성, 과잉행동과 같은 심리적 문제를 과학적 접근으로 해결합니다.",
      rating: 5.0,
      reviewCount: 76,
      certifications: ["동물심리상담사", "수의행동학 전문가"],
      coursesCount: 2,
      location: "경기 분당구",
      experience: "반려동물 행동교정 센터 운영 9년, 분리불안 특화 훈련 개발",
      education: [
        "건국대학교 수의학 박사",
        "동물행동학 연구소 연구원",
        "해외 문제행동 클리닉 연수"
      ],
      languages: ["한국어", "영어", "독일어"],
      availableHours: "상담 예약제 운영"
    },
    {
      id: 5,
      name: "정특수",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      specialty: "특수 목적 훈련, 노즈워크",
      description: "노즈워크와 특수 목적 훈련 전문가. 반려견의 뛰어난 후각을 활용한 다양한 활동을 통해 두뇌 발달을 돕습니다.",
      rating: 4.9,
      reviewCount: 62,
      certifications: ["노즈워크 국제 인증 트레이너", "수색견 훈련 전문가"],
      coursesCount: 3,
      location: "경기 고양시",
      experience: "군용견 훈련 5년, 노즈워크 대회 심사위원, 수색견 훈련 컨설팅",
      education: [
        "호서대학교 애완동물학과",
        "유럽 노즈워크 아카데미 수료",
        "특수 목적견 훈련 자격증"
      ],
      languages: ["한국어", "영어"],
      availableHours: "평일/주말 09:00 - 18:00"
    },
    {
      id: 6,
      name: "한치료",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      specialty: "반려견 심리 치료, 노령견 케어",
      description: "반려견 심리 치료 전문가. 특히 노령견의 인지 기능 향상과 심리적 안정을 돕는 프로그램을 진행합니다.",
      rating: 4.8,
      reviewCount: 54,
      certifications: ["동물 심리치료사", "노령견 케어 전문가"],
      coursesCount: 2,
      location: "서울 마포구",
      experience: "노령견 케어 센터 운영 6년, 치료견 프로그램 개발, 병원 연계 치료 프로그램 운영",
      education: [
        "이화여자대학교 심리학과",
        "반려동물 심리상담사 자격증",
        "노인심리학 전공"
      ],
      languages: ["한국어"],
      availableHours: "평일 10:00 - 17:00"
    }
  ];

  // 훈련사 프로필 열기
  const openTrainerProfile = (trainer: Trainer) => {
    console.log("프로필 열기 클릭", trainer.name);
    setSelectedTrainer(trainer);
    setIsProfileOpen(true);
    console.log("isProfileOpen 값:", true);
  };

  // 필터된 훈련사 목록
  const getFilteredTrainers = () => {
    let filtered = [...trainers];
    
    // 검색어 필터링
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trainer => 
        trainer.name.toLowerCase().includes(query) ||
        trainer.specialty.toLowerCase().includes(query) ||
        trainer.location?.toLowerCase().includes(query) ||
        trainer.description.toLowerCase().includes(query)
      );
    }
    
    // 카테고리 필터링
    if (filter !== "all") {
      filtered = filtered.filter(trainer => {
        if (filter === "certification") {
          return trainer.certifications.some(cert => cert.includes("공인") || cert.includes("인증"));
        } else if (filter === "featured") {
          return trainer.rating >= 4.8;
        } else {
          return trainer.specialty.includes(filter);
        }
      });
    }
    
    return filtered;
  };
  
  const filteredTrainers = getFilteredTrainers();

  return (
    <div className="py-8 px-4 sm:px-6">
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
              className="flex-1 py-2 px-2 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="ml-2">
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
          variant={filter === "기초 훈련" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("기초 훈련")}
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
      
      {/* 검색 결과 카운트 */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          총 <span className="font-medium">{filteredTrainers.length}</span>명의 훈련사가 검색되었습니다.
        </p>
      </div>
      
      {/* Trainers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainers.map((trainer) => (
          <Card key={trainer.id} className="overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="relative h-32 bg-gradient-to-r from-primary/20 to-accent/20">
              {trainer.rating >= 4.8 && (
                <Badge variant="warning" className="absolute top-2 right-2">
                  <Sparkles className="h-3 w-3 mr-1" />
                  추천 훈련사
                </Badge>
              )}
            </div>
            
            <CardContent className="pt-0 p-5">
              <div className="flex flex-col">
                <div className="flex items-end -mt-10 mb-4">
                  <Avatar 
                    src={trainer.image} 
                    alt={trainer.name} 
                    size="lg"
                    bordered
                    className="border-4 border-white dark:border-gray-800"
                  />
                  <div className="ml-4 pb-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{trainer.name}</h3>
                    <p className="text-sm text-primary">{trainer.specialty}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  {trainer.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{trainer.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{trainer.rating} ({trainer.reviewCount} 후기)</span>
                  </div>
                  
                  {trainer.experience && (
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">경력 {trainer.experience.split(',')[0]}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {trainer.certifications.slice(0, 2).map((cert, idx) => (
                    <Badge key={idx} variant="outline" size="sm" className="bg-primary/10 dark:bg-primary/5">
                      {cert.length > 15 ? `${cert.substring(0, 15)}...` : cert}
                    </Badge>
                  ))}
                  
                  {trainer.certifications.length > 2 && (
                    <Badge variant="outline" size="sm">+{trainer.certifications.length - 2}</Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {trainer.description}
                </p>
                
                <div className="flex justify-between items-center mt-auto">
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">강의 </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{trainer.coursesCount}개</span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openTrainerProfile(trainer)}
                  >
                    프로필 보기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Empty State */}
      {filteredTrainers.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            다른 검색어나 필터를 사용해 보세요. 더 많은 훈련사를 찾을 수 있을 거예요.
          </p>
          <Button onClick={() => {setFilter("all"); setSearchQuery("");}}>
            모든 훈련사 보기
          </Button>
        </div>
      )}
      
      {/* Pagination */}
      {filteredTrainers.length > 0 && (
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
      )}
      
      {/* 훈련사 프로필 모달 */}
      {selectedTrainer && (
        <SimpleTrainerProfileModal
          trainer={selectedTrainer}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}
