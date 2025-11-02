import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NaverMapView } from "@/components/NaverMapView";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, Filter, MapPin, Star, Users, Building, Calendar, 
  Shield, Sparkles, BookOpen, Coffee, Droplets, Tent, Home,
  Map, PawPrint, Scissors, Heart
} from "lucide-react";

// 위치 서비스 타입 정의
type LocationType = 
  | "all" 
  | "교육 센터" 
  | "훈련소" 
  | "펜션" 
  | "카페" 
  | "수영장" 
  | "캠핑장" 
  | "병원" 
  | "미용";

// 견종 카테고리
type DogBreed = 
  | "all" 
  | "소형견" 
  | "중형견" 
  | "대형견" 
  | "특수견" 
  | "반려견 전체";

// 지역 카테고리
type Region = 
  | "all" 
  | "서울" 
  | "경기" 
  | "인천" 
  | "강원" 
  | "충청" 
  | "전라" 
  | "경상" 
  | "제주";

export default function LocationServices() {
  const [filter, setFilter] = useState<LocationType>("all");
  const [regionFilter, setRegionFilter] = useState<Region>("all");
  const [breedFilter, setBreedFilter] = useState<DogBreed>("all");
  const [specialFilter, setSpecialFilter] = useState<string>("none"); // 'none', 'certification', 'premium'
  const [selectedInstitute, setSelectedInstitute] = useState<typeof institutes[0] | null>(null);
  
  // 업데이트된 데이터: 교육 시설 + 다양한 반려견 서비스 위치 포함
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
      category: "교육 센터",
      region: "서울",
      breedSupport: ["소형견", "중형견", "대형견"],
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
      category: "훈련소",
      region: "서울",
      breedSupport: ["소형견", "중형견"],
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
      category: "훈련소",
      region: "서울",
      breedSupport: ["소형견"],
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
      category: "교육 센터",
      region: "경기",
      breedSupport: ["중형견", "대형견"],
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
      category: "훈련소",
      region: "서울",
      breedSupport: ["소형견", "중형견", "대형견", "특수견"],
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
      category: "교육 센터",
      region: "인천",
      breedSupport: ["소형견", "중형견", "대형견"],
      certification: false,
      established: "2020년"
    },
    // 신규 위치 서비스 데이터
    {
      id: 7,
      name: "멍멍 펜션",
      description: "반려견과 함께 쉴 수 있는 프라이빗한 공간을 제공합니다. 넓은 운동장과 수영장을 갖추고 있어 반려견과 즐거운 시간을 보낼 수 있습니다.",
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      location: "강원도 춘천시",
      rating: 4.8,
      reviews: 92,
      trainers: 0,
      courses: 0,
      facilities: ["개별 객실", "운동장", "수영장", "바베큐장"],
      openingHours: "연중무휴 (체크인 15:00, 체크아웃 11:00)",
      category: "펜션",
      region: "강원",
      breedSupport: ["반려견 전체"],
      certification: false,
      premium: true,
      established: "2018년"
    },
    {
      id: 8,
      name: "댕댕 카페",
      description: "반려견과 함께할 수 있는 애견 카페입니다. 다양한 수제 간식과 음료를 즐기며 반려견도 놀 수 있는 공간이 마련되어 있습니다.",
      image: "https://images.unsplash.com/photo-1592921870583-aeafb0639ffe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      location: "서울시 강남구",
      rating: 4.6,
      reviews: 124,
      trainers: 0,
      courses: 0,
      facilities: ["카페", "놀이터", "간식 판매"],
      openingHours: "매일 10:00 - 22:00",
      category: "카페",
      region: "서울",
      breedSupport: ["소형견", "중형견"],
      certification: false,
      established: "2019년"
    },
    {
      id: 9,
      name: "도그 수영장",
      description: "반려견 전용 수영장으로, 깨끗하고 안전한 환경에서 반려견이 물놀이를 즐길 수 있습니다. 전문 수상안전 강사가 상주합니다.",
      image: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      location: "경기도 용인시",
      rating: 4.7,
      reviews: 56,
      trainers: 2,
      courses: 3,
      facilities: ["실내 수영장", "샤워실", "휴게실"],
      openingHours: "평일 12:00 - 20:00, 주말 10:00 - 18:00",
      category: "수영장",
      region: "경기",
      breedSupport: ["소형견", "중형견", "대형견"],
      certification: true,
      established: "2020년"
    },
    {
      id: 10,
      name: "반려견 캠핑장",
      description: "반려견과 함께 캠핑을 즐길 수 있는 특별한 공간입니다. 전용 놀이시설과 안전한 울타리가 설치되어 있어 안심하고 이용할 수 있습니다.",
      image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      location: "충청남도 태안군",
      rating: 4.5,
      reviews: 78,
      trainers: 0,
      courses: 0,
      facilities: ["캠핑사이트", "놀이터", "샤워시설", "매점"],
      openingHours: "연중무휴 (체크인 14:00, 체크아웃 12:00)",
      category: "캠핑장",
      region: "충청",
      breedSupport: ["반려견 전체"],
      certification: false,
      premium: true,
      established: "2019년"
    },
    {
      id: 11,
      name: "강아지 병원 24시",
      description: "24시간 응급 진료가 가능한 반려견 전문 병원입니다. 최신 의료 장비와 전문 의료진이 상주하여 신속하고 정확한 진료를 제공합니다.",
      image: "https://images.unsplash.com/photo-1584794171574-fe3f84b43838?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      location: "서울시 송파구",
      rating: 4.9,
      reviews: 183,
      trainers: 0,
      courses: 0,
      facilities: ["진료실", "입원실", "수술실", "약국"],
      openingHours: "24시간 영업",
      category: "병원",
      region: "서울",
      breedSupport: ["반려견 전체"],
      certification: true,
      established: "2015년"
    },
    {
      id: 12,
      name: "럭셔리 애견 미용실",
      description: "최고급 미용 용품과 전문 그루머가 반려견의 품종별 특성에 맞는 맞춤형 미용 서비스를 제공합니다.",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      location: "서울시 강남구",
      rating: 4.8,
      reviews: 142,
      trainers: 0,
      courses: 0,
      facilities: ["미용실", "대기실", "목욕실"],
      openingHours: "평일 10:00 - 19:00, 토요일 10:00 - 17:00",
      category: "미용",
      region: "서울",
      breedSupport: ["소형견", "중형견", "특수견"],
      certification: false,
      premium: true,
      established: "2017년"
    }
  ];

  // 지역, 견종, 카테고리를 모두 고려한 필터링
  const filteredInstitutes = institutes
    .filter(institute => {
      // 서비스 타입 필터링
      const categoryMatch = filter === "all" || institute.category === filter;
      
      // 지역 필터링
      const regionMatch = regionFilter === "all" || institute.region === regionFilter;
      
      // 견종 필터링 (배열에 포함 여부)
      const breedMatch = breedFilter === "all" || 
        institute.breedSupport.includes(breedFilter) || 
        institute.breedSupport.includes("반려견 전체");
      
      // 모든 조건을 만족해야 함
      return categoryMatch && regionMatch && breedMatch;
    });
  
  // 추가 필터링 (인증, 프리미엄)
  const finalFilteredInstitutes = specialFilter === "certification" 
    ? filteredInstitutes.filter(institute => institute.certification)
    : specialFilter === "premium"
      ? filteredInstitutes.filter(institute => institute.premium)
      : filteredInstitutes;

  // 위치 데이터를 지도용 형식으로 변환하는 함수
  const getLocationFromInstitute = (institute: typeof institutes[0]) => {
    // 실제 API에서는 정확한 좌표 사용 필요
    // 여기서는 기관마다 서울 시내 랜덤 좌표 생성
    const baseLat = 37.5665;
    const baseLng = 126.9780;
    
    // 기관 ID를 시드로 사용하여 일관된 좌표 생성
    const latOffset = (institute.id * 0.01) % 0.1;
    const lngOffset = (institute.id * 0.015) % 0.15;
    
    return {
      lat: baseLat + latOffset,
      lng: baseLng + lngOffset,
      name: institute.name,
      address: institute.location
    };
  };

  // 카테고리별 아이콘
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "교육 센터": return <Building className="h-4 w-4 mr-1" />;
      case "훈련소": return <PawPrint className="h-4 w-4 mr-1" />;
      case "펜션": return <Home className="h-4 w-4 mr-1" />;
      case "카페": return <Coffee className="h-4 w-4 mr-1" />;
      case "수영장": return <Droplets className="h-4 w-4 mr-1" />;
      case "캠핑장": return <Tent className="h-4 w-4 mr-1" />;
      case "병원": return <Heart className="h-4 w-4 mr-1" />;
      case "미용": return <Scissors className="h-4 w-4 mr-1" />;
      default: return <Building className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="relative h-72 rounded-2xl overflow-hidden mb-8 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534551767192-78b8dd45b51b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80")' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/30 mix-blend-multiply"></div>
        
        <div className="relative h-full flex flex-col justify-center px-6 md:px-10">
          <h1 className="text-white text-xl md:text-3xl font-bold mb-2 md:mb-4 max-w-xl">
            반려견 교육 및 서비스 위치 찾기
          </h1>
          <p className="text-white text-sm md:text-base max-w-xl mb-4">
            내 주변의 반려견 교육 시설, 전문 훈련소, 관련 서비스 위치 정보를 확인하세요.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-lg bg-white dark:bg-gray-800 rounded-lg flex items-center p-1">
            <div className="px-2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="지역, 전문 분야로 위치 서비스 찾기" 
              className="flex-1 py-2 px-2 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
            />
            <Button className="ml-2">
              검색
            </Button>
          </div>
        </div>
      </div>
      
      {/* Advanced Filters Section */}
      <div className="mb-8 flex flex-col gap-4">
        {/* 주요 필터 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* 서비스 종류 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">서비스 종류</label>
            <Select
              value={filter}
              onValueChange={(value: LocationType) => {
                setFilter(value);
                setSpecialFilter("none"); // 특수 필터 초기화
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="모든 서비스" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 서비스</SelectItem>
                <SelectItem value="교육 센터">교육 센터</SelectItem>
                <SelectItem value="훈련소">훈련소</SelectItem>
                <SelectItem value="펜션">펜션</SelectItem>
                <SelectItem value="카페">카페</SelectItem>
                <SelectItem value="수영장">수영장</SelectItem>
                <SelectItem value="캠핑장">캠핑장</SelectItem>
                <SelectItem value="병원">병원</SelectItem>
                <SelectItem value="미용">미용</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* 지역 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">지역</label>
            <Select
              value={regionFilter}
              onValueChange={(value: Region) => setRegionFilter(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="모든 지역" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 지역</SelectItem>
                <SelectItem value="서울">서울</SelectItem>
                <SelectItem value="경기">경기</SelectItem>
                <SelectItem value="인천">인천</SelectItem>
                <SelectItem value="강원">강원</SelectItem>
                <SelectItem value="충청">충청</SelectItem>
                <SelectItem value="전라">전라</SelectItem>
                <SelectItem value="경상">경상</SelectItem>
                <SelectItem value="제주">제주</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* 견종 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">견종 지원</label>
            <Select
              value={breedFilter}
              onValueChange={(value: DogBreed) => setBreedFilter(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="모든 견종" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 견종</SelectItem>
                <SelectItem value="소형견">소형견</SelectItem>
                <SelectItem value="중형견">중형견</SelectItem>
                <SelectItem value="대형견">대형견</SelectItem>
                <SelectItem value="특수견">특수견</SelectItem>
                <SelectItem value="반려견 전체">무관</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* 인증/프리미엄 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">특별 조건</label>
            <Select
              value={specialFilter}
              onValueChange={(value) => setSpecialFilter(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">조건 없음</SelectItem>
                <SelectItem value="certification">인증 기관</SelectItem>
                <SelectItem value="premium">프리미엄 기관</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* 빠른 필터 버튼 */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mr-4">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-2 mr-1" />
            <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">빠른 선택:</span>
          </div>
          
          <Button
            variant={filter === "교육 센터" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFilter("교육 센터"); 
              setSpecialFilter("none");
            }}
            className="text-xs"
          >
            <Building className="h-3 w-3 mr-1" />
            교육 센터
          </Button>
          
          <Button
            variant={filter === "훈련소" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFilter("훈련소");
              setSpecialFilter("none");
            }}
            className="text-xs"
          >
            <PawPrint className="h-3 w-3 mr-1" />
            훈련소
          </Button>
          
          <Button
            variant={filter === "펜션" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFilter("펜션");
              setSpecialFilter("none");
            }}
            className="text-xs"
          >
            <Home className="h-3 w-3 mr-1" />
            펜션
          </Button>
          
          <Button
            variant={filter === "카페" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFilter("카페");
              setSpecialFilter("none");
            }}
            className="text-xs"
          >
            <Coffee className="h-3 w-3 mr-1" />
            카페
          </Button>
          
          <Button
            variant={filter === "수영장" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFilter("수영장");
              setSpecialFilter("none");
            }}
            className="text-xs"
          >
            <Droplets className="h-3 w-3 mr-1" />
            수영장
          </Button>
          
          <Button
            variant={filter === "캠핑장" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFilter("캠핑장");
              setSpecialFilter("none");
            }}
            className="text-xs"
          >
            <Tent className="h-3 w-3 mr-1" />
            캠핑장
          </Button>
          
          <Button
            variant={filter === "병원" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFilter("병원");
              setSpecialFilter("none");
            }}
            className="text-xs"
          >
            <Heart className="h-3 w-3 mr-1" />
            병원
          </Button>
          
          <Button
            variant={filter === "미용" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFilter("미용");
              setSpecialFilter("none");
            }}
            className="text-xs"
          >
            <Scissors className="h-3 w-3 mr-1" />
            미용
          </Button>
          
          <Button
            variant={specialFilter === "certification" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSpecialFilter("certification");
              setFilter("all");
            }}
            className="text-xs"
          >
            <Shield className="h-3 w-3 mr-1" />
            인증 기관
          </Button>
          
          <Button
            variant={specialFilter === "premium" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSpecialFilter("premium");
              setFilter("all");
            }}
            className="text-xs"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            프리미엄 기관
          </Button>
        </div>
      </div>
      
      {/* Two Column Layout: 리스트 + 지도 */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 왼쪽 열 - 위치 서비스 목록 */}
        <div className="w-full lg:w-2/3">
          <div className="grid grid-cols-1 gap-6">
            {finalFilteredInstitutes.map((institute) => (
              <Card 
                key={institute.id} 
                hover 
                className={`overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer transition-all ${selectedInstitute?.id === institute.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedInstitute(institute)}
              >
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
                      <Badge variant="outline" className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground flex items-center">
                        {getCategoryIcon(institute.category)}
                        {institute.category}
                      </Badge>
                      
                      {institute.trainers > 0 && (
                        <Badge variant="outline">
                          <Users className="h-3 w-3 mr-1" />
                          훈련사 {institute.trainers}명
                        </Badge>
                      )}
                      
                      {institute.courses > 0 && (
                        <Badge variant="outline">
                          <BookOpen className="h-3 w-3 mr-1" />
                          강의 {institute.courses}개
                        </Badge>
                      )}
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
                    
                    <div className="flex gap-3">
                      {/* 상세 정보 버튼 */}
                      <Button 
                        variant="default"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation(); // 부모 클릭 이벤트 전파 중지
                          console.log("위치 서비스 상세 페이지 이동: ", institute.id);
                          window.location.href = `/institutes/${institute.id}`;
                        }}
                      >
                        상세 정보
                      </Button>
                      
                      {/* 위치 보기 버튼 */}
                      <Button 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation(); // 부모 클릭 이벤트 전파 중지
                          setSelectedInstitute(institute);
                        }}
                      >
                        위치 보기
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-8 flex justify-center">
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
        </div>
        
        {/* 오른쪽 열 - 지도 & 날씨 */}
        <div className="w-full lg:w-1/3 sticky top-24 h-fit">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">위치 및 날씨 정보</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">위치 서비스를 선택하면 지도와 현재 날씨를 확인할 수 있습니다.</p>
            </div>
            
            <div className="p-4">
              {/* Map & Weather Component */}
              {selectedInstitute ? (
                <NaverMapView 
                  locations={[{
                    id: selectedInstitute.id,
                    name: selectedInstitute.name,
                    address: selectedInstitute.location,
                    coordinates: getLocationFromInstitute(selectedInstitute)
                  }]}
                  center={getLocationFromInstitute(selectedInstitute)}
                  height="400px"
                  zoom={15}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <MapPin className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">위치 정보 없음</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    왼쪽 목록에서 위치 서비스를 선택하면<br />지도와 날씨 정보가 표시됩니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 위치 서비스 등록 요청 섹션 */}
      <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">위치 서비스 등록 요청</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              반려견 교육 기관이나 서비스를 운영하고 계신가요? Talez에 등록하여 더 많은 반려인에게 서비스를 제공해보세요.
            </p>
          </div>
          <Button 
            className="shrink-0"
            onClick={() => {
              console.log("위치 서비스 등록 요청 페이지 이동");
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