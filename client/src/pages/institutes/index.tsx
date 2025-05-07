import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Search, Filter, MapPin, Star, Users, Building, Calendar, Shield, Sparkles, BookOpen } from "lucide-react";

export default function Institutes() {
  const [filter, setFilter] = useState("all");
  
  const institutes = [
    {
      id: 1,
      name: "행복한 반려견 교육 센터",
      description: "체계적인 커리큘럼과 전문 훈련사들의 1:1 맞춤형 교육으로 반려견의 행동 교정과 견주의 올바른 반려견 교육 방법을 안내합니다.",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      location: "서울시 강남구",
      rating: 4.9,
      reviews: 86,
      trainers: 8,
      courses: 12,
      facilities: ["실내 훈련장", "야외 훈련장", "대기실", "상담실"],
      openingHours: "평일 10:00 - 20:00, 주말 10:00 - 18:00",
      category: "종합 교육",
      certification: true,
      premium: true,
      established: "2015년"
    },
    {
      id: 2,
      name: "멍멍 아카데미",
      description: "반려견에게 즐거운 경험을 선사하는 놀이 중심의 교육 기관입니다. 스트레스 없는 교육 방식으로 반려견의 사회성과 기본 예절을 기릅니다.",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      location: "서울시 마포구",
      rating: 4.7,
      reviews: 64,
      trainers: 5,
      courses: 8,
      facilities: ["실내 훈련장", "놀이터", "카페"],
      openingHours: "매일 11:00 - 19:00",
      category: "사회화 중심",
      certification: true,
      established: "2018년"
    },
    {
      id: 3,
      name: "퍼피 트레이닝 센터",
      description: "어린 강아지를 위한 특화된 교육 프로그램을 제공합니다. 중요한 사회화 시기에 필요한 모든 훈련과 경험을 체계적으로 제공합니다.",
      image: "https://images.unsplash.com/photo-1601758177266-bc599de87707?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      location: "서울시 송파구",
      rating: 4.8,
      reviews: 52,
      trainers: 4,
      courses: 5,
      facilities: ["실내 훈련장", "놀이터", "그루밍실"],
      openingHours: "평일 09:00 - 18:00, 주말 10:00 - 17:00",
      category: "유견 특화",
      certification: true,
      established: "2019년"
    },
    {
      id: 4,
      name: "어질리티 스포츠 클럽",
      description: "반려견 스포츠와 어질리티 훈련을 전문으로 하는 센터입니다. 다양한 장애물과 전문 코치진으로 반려견의 활동성과 두뇌 발달을 돕습니다.",
      image: "https://images.unsplash.com/photo-1583336663277-620dc1996580?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      location: "경기도 고양시",
      rating: 4.6,
      reviews: 43,
      trainers: 3,
      courses: 4,
      facilities: ["실내 훈련장", "어질리티 코스", "휴게실"],
      openingHours: "평일 13:00 - 21:00, 주말 10:00 - 18:00",
      category: "운동 특화",
      certification: false,
      premium: true,
      established: "2017년"
    },
    {
      id: 5,
      name: "행동 교정 전문 센터",
      description: "문제 행동에 특화된 교정 프로그램을 운영합니다. 분리불안, 공격성, 짖음 등 다양한 문제 행동을 과학적인 방법으로 개선합니다.",
      image: "https://images.unsplash.com/photo-1583512603806-077998240c7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      location: "서울시 서초구",
      rating: 4.9,
      reviews: 71,
      trainers: 6,
      courses: 7,
      facilities: ["상담실", "개별 훈련실", "그룹 훈련장"],
      openingHours: "평일 10:00 - 19:00, 토요일 10:00 - 15:00",
      category: "행동 교정",
      certification: true,
      established: "2016년"
    },
    {
      id: 6,
      name: "도그 스쿨 플러스",
      description: "종합적인 반려견 교육을 제공하는 학교형 교육 기관입니다. 기초부터 고급 과정까지 단계별 커리큘럼으로 체계적인 교육을 받을 수 있습니다.",
      image: "https://images.unsplash.com/photo-1541599468348-e96984315921?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      location: "인천시 부평구",
      rating: 4.5,
      reviews: 38,
      trainers: 4,
      courses: 6,
      facilities: ["강의실", "실습장", "야외 훈련장"],
      openingHours: "평일 10:00 - 18:00, 토요일 10:00 - 14:00",
      category: "종합 교육",
      certification: false,
      established: "2020년"
    }
  ];

  const filteredInstitutes = filter === "all" 
    ? institutes 
    : filter === "certification" 
      ? institutes.filter(institute => institute.certification)
      : filter === "premium"
        ? institutes.filter(institute => institute.premium)
        : institutes.filter(institute => institute.category === filter);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Banner */}
      <div className="relative rounded-xl overflow-hidden h-48 md:h-64 mb-8 bg-gradient-to-r from-primary/80 to-accent/80 shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1580824456266-c577a6711dfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400" 
          alt="교육 기관"
          className="w-full h-full object-cover absolute mix-blend-overlay"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/30 mix-blend-multiply"></div>
        
        <div className="relative h-full flex flex-col justify-center px-6 md:px-10">
          <h1 className="text-white text-xl md:text-3xl font-bold mb-2 md:mb-4 max-w-xl">
            전문 반려견 교육 기관 찾기
          </h1>
          <p className="text-white text-sm md:text-base max-w-xl mb-4">
            다양한 시설과 프로그램을 갖춘 전문 교육 기관에서 체계적인 반려견 교육을 시작하세요.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-lg bg-white dark:bg-gray-800 rounded-lg flex items-center p-1">
            <div className="px-2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="지역, 전문 분야로 교육 기관 찾기" 
              className="flex-1 py-2 px-2 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
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
          인증 기관
        </Button>
        
        <Button
          variant={filter === "premium" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("premium")}
          className="text-xs"
        >
          프리미엄 기관
        </Button>
        
        <Button
          variant={filter === "종합 교육" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("종합 교육")}
          className="text-xs"
        >
          종합 교육
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
          variant={filter === "사회화 중심" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("사회화 중심")}
          className="text-xs"
        >
          사회화 중심
        </Button>
      </div>
      
      {/* Institutes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInstitutes.map((institute) => (
          <Card key={institute.id} hover className="overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5">
                <div className="h-48 md:h-full relative">
                  <img 
                    src={institute.image} 
                    alt={institute.name} 
                    className="w-full h-full object-cover"
                  />
                  
                  {institute.premium && (
                    <Badge variant="warning" className="absolute top-2 right-2">
                      <Sparkles className="h-3 w-3 mr-1" />
                      프리미엄
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="p-5 md:w-3/5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{institute.name}</h3>
                  
                  <div className="flex gap-1">
                    {institute.certification && (
                      <Badge variant="success" className="flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        인증
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{institute.location}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{institute.rating} ({institute.reviews} 후기)</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Building className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">설립: {institute.established}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="bg-primary/10 dark:bg-primary/5 text-primary-foreground">
                    {institute.category}
                  </Badge>
                  
                  <Badge variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    훈련사 {institute.trainers}명
                  </Badge>
                  
                  <Badge variant="outline">
                    <BookOpen className="h-3 w-3 mr-1" />
                    강의 {institute.courses}개
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {institute.description}
                </p>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-start mb-1">
                    <Calendar className="h-3.5 w-3.5 mr-1.5 mt-0.5" />
                    <span>{institute.openingHours}</span>
                  </div>
                  <div className="flex items-start">
                    <Building className="h-3.5 w-3.5 mr-1.5 mt-0.5" />
                    <span>시설: {institute.facilities.join(", ")}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => {
                    console.log("교육기관 상세 페이지 이동: ", institute.id);
                    window.location.href = `/institutes/${institute.id}`;
                  }}
                >
                  상세 정보
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
            다음
          </Button>
        </nav>
      </div>
      
      {/* 교육 기관 등록 요청 섹션 */}
      <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">교육 기관 등록 요청</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              반려견 교육 기관을 운영하고 계신가요? PetEdu 플랫폼에 등록하여 더 많은 반려인에게 교육 서비스를 제공해보세요.
            </p>
          </div>
          <Button 
            className="shrink-0"
            onClick={() => {
              console.log("교육기관 등록 요청 페이지 이동");
              window.location.href = '/institutes/register';
            }}
          >
            등록 요청하기
          </Button>
        </div>
      </div>
    </div>
  );
}
