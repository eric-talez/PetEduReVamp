import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GoogleMapView } from "@/components/GoogleMapView";
import { WeatherInfo } from "@/components/WeatherInfo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Filter, MapPin, Star, Users, Building, Calendar, 
  Shield, Sparkles, BookOpen, Coffee, Droplets, Tent, Home,
  Map, PawPrint, Scissors, Heart, Loader2, Award, X,
  ChevronLeft, ChevronRight, ExternalLink, Phone, Clock,
  Image as ImageIcon, MessageSquare, Info, Cloud
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

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
  
  // 리뷰 표시 설정 조회
  const { data: reviewsSettingData } = useQuery({
    queryKey: ['/api/settings', 'reviews_enabled'],
    queryFn: async () => {
      const response = await fetch('/api/settings?key=reviews_enabled');
      if (!response.ok) return { data: { value: 'true' } }; // 기본값: 표시
      return response.json();
    },
  });
  const reviewsEnabled = reviewsSettingData?.data?.value === 'true';
  const [breedFilter, setBreedFilter] = useState<DogBreed>("all");
  const [specialFilter, setSpecialFilter] = useState<string>("none"); // 'none', 'certification', 'premium'
  const [selectedInstitute, setSelectedInstitute] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailInstitute, setDetailInstitute] = useState<any | null>(null);
  const { toast} = useToast();
  
  // 실제 기관 데이터 가져오기
  const { data: institutesData, isLoading } = useQuery({
    queryKey: ['/api/institutes'],
  });
  
  // 로그인 상태 확인 함수
  const isAuthenticated = (): boolean => {
    const storedAuth = localStorage.getItem('petedu_auth');
    return storedAuth !== null;
  };
  
  // 로그인 유도 함수
  const promptLogin = () => {
    toast({
      title: "로그인이 필요합니다",
      description: "이 기능을 사용하려면 로그인이 필요합니다.",
      variant: "default",
    });
    
    // 3초 후 로그인 페이지로 이동
    setTimeout(() => {
      window.location.href = "/auth";
    }, 3000);
  };

  // 검색 처리 함수 - Google Maps 기반 검색
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "검색어를 입력하세요",
        description: "기관명, 지역 등으로 검색할 수 있습니다.",
        variant: "default",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      // 현재 위치 가져오기 (선택사항)
      let userLocation = { lat: 37.5665, lng: 126.9780 }; // 기본: 서울
      
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        } catch (err) {
          console.log('위치 정보를 가져올 수 없습니다. 기본 위치 사용');
        }
      }
      
      // Google Maps 기반 검색 API 호출
      const response = await fetch(
        `/api/locations/search?query=${encodeURIComponent(searchTerm)}&lat=${userLocation.lat}&lng=${userLocation.lng}`
      );
      
      if (!response.ok) {
        throw new Error('검색에 실패했습니다.');
      }
      
      const results = await response.json();
      
      // 검색 결과를 기관 형식으로 변환
      const formattedResults = results.map((place: any) => ({
        id: place.id,
        name: place.name,
        location: place.address,
        latitude: place.latitude.toString(),
        longitude: place.longitude.toString(),
        image: place.photo || '/images/institutes/default-institute.png',
        images: place.photos || (place.photo ? [place.photo] : ['/images/institutes/default-institute.png']), // 이미지 배열
        category: place.type === 'institute' ? '훈련소' : '교육 센터',
        rating: place.rating || 4.0,
        reviews: place.reviews || Math.floor(Math.random() * 50) + 10,
        established: place.established || '2020',
        trainers: place.trainers || Math.floor(Math.random() * 10) + 1,
        courses: place.courses || Math.floor(Math.random() * 20) + 5,
        description: place.description || '반려견 전문 교육 기관',
        facilities: place.facilities || ['실내 훈련장', '실외 훈련장', '주차장'],
        openingHours: place.openingHours || '평일 09:00-18:00',
        certification: place.certification || false,
        premium: false,
        isTalez: place.isTalez || false,
        sourceUrl: place.sourceUrl || null, // Google Maps URL
        phone: place.phone || '',
      }));
      
      setSearchResults(formattedResults);
      
      toast({
        title: "검색 완료",
        description: `${formattedResults.length}개의 결과를 찾았습니다.`,
      });
      
      // 첫 번째 결과를 선택하여 지도에 표시
      if (formattedResults.length > 0) {
        setSelectedInstitute(formattedResults[0]);
      }
      
    } catch (error) {
      console.error('검색 오류:', error);
      toast({
        title: "검색 실패",
        description: "검색 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }

    // 검색어로 지역 필터 자동 설정
    const lowerSearch = searchTerm.toLowerCase();
    if (lowerSearch.includes('서울')) setRegionFilter('서울');
    else if (lowerSearch.includes('경기')) setRegionFilter('경기');
    else if (lowerSearch.includes('부산') || lowerSearch.includes('경상')) setRegionFilter('경상');
    else if (lowerSearch.includes('인천')) setRegionFilter('인천');
    else if (lowerSearch.includes('강원')) setRegionFilter('강원');
    else if (lowerSearch.includes('충청')) setRegionFilter('충청');
    else if (lowerSearch.includes('전라')) setRegionFilter('전라');
    else if (lowerSearch.includes('제주')) setRegionFilter('제주');
  };
  
  // 위치 정보가 있는 기관만 필터링하고 표시 데이터 매핑
  const institutesArray = Array.isArray((institutesData as any)?.data) ? (institutesData as any).data : [];
  
  const institutes = institutesArray
    .filter((inst: any) => inst.latitude && inst.longitude)
    .map((inst: any) => {
      const defaultImage = "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450";
      const mainImage = inst.logo || defaultImage;
      
      return {
        id: inst.id,
        name: inst.name,
        description: inst.description || '반려동물 교육 기관',
        image: mainImage,
        images: [mainImage], // 이미지 배열 추가
        location: inst.address || '위치 정보 없음',
        rating: inst.rating ? parseFloat(inst.rating) : 4.5,
        reviews: 0,
        trainers: 0,
        courses: 0,
        facilities: [],
        openingHours: "평일 10:00 - 18:00",
        category: "훈련소",
        region: inst.address?.includes('서울') ? '서울' : inst.address?.includes('경기') ? '경기' : inst.address?.includes('부산') ? '경상' : '기타',
        breedSupport: ["소형견", "중형견", "대형견"],
        certification: true,
        premium: false,
        established: "2020년",
        latitude: inst.latitude,
        longitude: inst.longitude,
        isTalez: true, // DB 기관은 TALEZ 등록 기관
        sourceUrl: null,
        phone: inst.phone || '',
      };
    });

  // 지역, 견종, 카테고리, 검색어를 모두 고려한 필터링
  const filteredInstitutes = institutes
    .filter(institute => {
      // 서비스 타입 필터링
      const categoryMatch = filter === "all" || institute.category === filter;
      
      // 지역 필터링
      const regionMatch = regionFilter === "all" || institute.region === regionFilter;
      
      // 견종 필터링 (배열에 포함 여부) - 옵셔널 체이닝 사용
      const breedMatch = breedFilter === "all" || 
        institute.breedSupport?.includes(breedFilter) || 
        institute.breedSupport?.includes("반려견 전체") ||
        false;
      
      // 검색어 필터링 (기관명, 주소, 설명에서 검색)
      const searchMatch = !searchTerm.trim() || 
        institute.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institute.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institute.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 모든 조건을 만족해야 함
      return categoryMatch && regionMatch && breedMatch && searchMatch;
    });
  
  // 추가 필터링 (인증, 프리미엄) - 옵셔널 체이닝 사용
  // 검색 결과가 있으면 검색 결과를 우선 표시
  let baseInstitutes = searchResults.length > 0 ? searchResults : filteredInstitutes;
  
  const finalFilteredInstitutes = specialFilter === "certification" 
    ? baseInstitutes.filter(institute => institute.certification === true)
    : specialFilter === "premium"
      ? baseInstitutes.filter(institute => institute.premium === true)
      : baseInstitutes;

  // 위치 데이터를 지도용 형식으로 변환하는 함수
  const getLocationFromInstitute = (institute: any) => {
    // 실제 위치 정보 사용
    if (institute.latitude && institute.longitude) {
      return {
        lat: parseFloat(institute.latitude),
        lng: parseFloat(institute.longitude)
      };
    }
    
    // 백업: 기본 서울 좌표
    return {
      lat: 37.5665,
      lng: 126.9780
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
              placeholder="지역, 전문 분야로 위치 서비스 찾기 (예: 강남 애견훈련)" 
              className="flex-1 py-2 px-2 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              data-testid="input-search"
            />
            {searchResults.length > 0 && (
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchResults([]);
                  setSearchTerm("");
                  toast({
                    title: "검색 초기화",
                    description: "검색 결과가 초기화되었습니다.",
                  });
                }}
                className="mr-1"
                data-testid="button-clear-search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button 
              className="ml-2"
              onClick={handleSearch}
              disabled={isSearching}
              data-testid="button-search"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  검색 중...
                </>
              ) : (
                '검색'
              )}
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
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">기관 정보를 불러오는 중...</span>
            </div>
          ) : finalFilteredInstitutes.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">위치 정보가 등록된 기관이 없습니다.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 gap-6">
            {finalFilteredInstitutes.map((institute) => (
              <Card 
                key={institute.id} 
                className={`overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer transition-all ${selectedInstitute?.id === institute.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedInstitute(institute)}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5">
                    <div className="h-48 md:h-full relative group">
                      {/* 이미지 슬라이더 */}
                      {(() => {
                        const images = institute.images || [institute.image];
                        const currentIndex = imageIndices[institute.id] || 0;
                        
                        return (
                          <>
                            <img 
                              src={images[currentIndex]} 
                              alt={`${institute.name} - 이미지 ${currentIndex + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/images/institutes/default-institute.png';
                              }}
                            />
                            
                            {/* 이미지가 여러 개인 경우 슬라이더 컨트롤 표시 */}
                            {images.length > 1 && (
                              <>
                                {/* 이전 버튼 */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
                                    setImageIndices(prev => ({ ...prev, [institute.id]: newIndex }));
                                  }}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                  data-testid={`button-prev-image-${institute.id}`}
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </button>
                                
                                {/* 다음 버튼 */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
                                    setImageIndices(prev => ({ ...prev, [institute.id]: newIndex }));
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                  data-testid={`button-next-image-${institute.id}`}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                                
                                {/* 이미지 인디케이터 */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                  {images.map((_: any, idx: number) => (
                                    <button
                                      key={idx}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setImageIndices(prev => ({ ...prev, [institute.id]: idx }));
                                      }}
                                      className={`w-2 h-2 rounded-full transition-all ${
                                        idx === currentIndex 
                                          ? 'bg-white w-4' 
                                          : 'bg-white/50 hover:bg-white/75'
                                      }`}
                                      data-testid={`button-image-indicator-${institute.id}-${idx}`}
                                    />
                                  ))}
                                </div>
                                
                                {/* 이미지 카운터 */}
                                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                  {currentIndex + 1} / {images.length}
                                </div>
                              </>
                            )}
                          </>
                        );
                      })()}
                      
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
                          <div className="relative inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse-slow">
                            <Award className="h-4 w-4 mr-1.5 text-white drop-shadow-md" />
                            <span className="text-sm font-bold text-white drop-shadow-md tracking-wide">
                              테일즈 공식인증
                            </span>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-600 opacity-30 blur-sm"></div>
                          </div>
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
                      <Badge variant="outline" className="bg-primary/10 dark:bg-primary/5 text-primary-foreground flex items-center">
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
                      {/* 상세 정보 버튼 - 팝업으로 표시 */}
                      <Button 
                        variant="default"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailInstitute(institute);
                          setDetailDialogOpen(true);
                        }}
                        data-testid={`button-detail-${institute.id}`}
                      >
                        상세 정보
                      </Button>
                      
                      {/* 위치 보기 버튼 */}
                      <Button 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInstitute(institute);
                        }}
                        data-testid={`button-location-${institute.id}`}
                      >
                        위치 보기
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          )}
          
          {/* Pagination */}
          {!isLoading && finalFilteredInstitutes.length > 0 && (
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
          )}
        </div>
        
        {/* 오른쪽 열 - 탭 구조 */}
        <div className="w-full lg:w-1/3 sticky top-24 h-fit">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {selectedInstitute ? (
              <Tabs defaultValue="location" className="w-full">
                <div className="border-b border-gray-100 dark:border-gray-700">
                  <TabsList className="w-full grid grid-cols-5 h-auto p-0 bg-transparent">
                    <TabsTrigger 
                      value="location" 
                      className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                      data-testid="tab-location"
                    >
                      <MapPin className="h-4 w-4" />
                      <span className="text-xs">위치</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="weather" 
                      className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                      data-testid="tab-weather"
                    >
                      <Cloud className="h-4 w-4" />
                      <span className="text-xs">날씨</span>
                    </TabsTrigger>
                    {reviewsEnabled && (
                      <TabsTrigger 
                        value="reviews" 
                        className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                        data-testid="tab-reviews"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-xs">리뷰</span>
                      </TabsTrigger>
                    )}
                    <TabsTrigger 
                      value="info" 
                      className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                      data-testid="tab-info"
                    >
                      <Info className="h-4 w-4" />
                      <span className="text-xs">정보</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="images" 
                      className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                      data-testid="tab-images"
                    >
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-xs">이미지</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                {/* 위치 탭 */}
                <TabsContent value="location" className="p-4 m-0">
                  <GoogleMapView 
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
                  <div className="mt-3 space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{selectedInstitute.location}</span>
                    </div>
                    {selectedInstitute.sourceUrl && (
                      <Button 
                        variant="outline"
                        className="w-full"
                        size="sm"
                        onClick={() => window.open(selectedInstitute.sourceUrl, '_blank')}
                        data-testid="button-open-maps"
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        구글 맵에서 보기
                      </Button>
                    )}
                  </div>
                </TabsContent>
                
                {/* 날씨 탭 */}
                <TabsContent value="weather" className="p-4 m-0">
                  <WeatherInfo 
                    latitude={getLocationFromInstitute(selectedInstitute).lat}
                    longitude={getLocationFromInstitute(selectedInstitute).lng}
                    locationName={selectedInstitute.name}
                  />
                </TabsContent>
                
                {/* 리뷰 탭 */}
                {reviewsEnabled && (
                  <TabsContent value="reviews" className="p-4 m-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          <span className="text-2xl font-bold">{selectedInstitute.rating}</span>
                          <span className="text-gray-500">({selectedInstitute.reviews} 후기)</span>
                        </div>
                      </div>
                      
                      {/* 리뷰 목록 (데모) */}
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <Card key={i} className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">사용자 {i}</span>
                                  <div className="flex">
                                    {[...Array(5)].map((_, j) => (
                                      <Star key={j} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  훌륭한 훈련 프로그램과 친절한 강사진입니다. 우리 강아지가 많이 발전했어요!
                                </p>
                                <span className="text-xs text-gray-400 mt-1">2024.10.{20 + i}</span>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                )}
                
                {/* 업체 정보 탭 */}
                <TabsContent value="info" className="p-4 m-0">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">기본 정보</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300">설립: {selectedInstitute.established}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300">{selectedInstitute.openingHours}</span>
                        </div>
                        {selectedInstitute.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 dark:text-gray-300">{selectedInstitute.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">소개</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{selectedInstitute.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">시설</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedInstitute.facilities.map((facility: string, idx: number) => (
                          <Badge key={idx} variant="outline">{facility}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">서비스</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {selectedInstitute.trainers > 0 && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span>훈련사 {selectedInstitute.trainers}명</span>
                          </div>
                        )}
                        {selectedInstitute.courses > 0 && (
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-gray-500" />
                            <span>강의 {selectedInstitute.courses}개</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* 이미지 탭 */}
                <TabsContent value="images" className="p-4 m-0">
                  <div className="space-y-3">
                    {(() => {
                      const images = selectedInstitute.images || [selectedInstitute.image];
                      return images.map((img: string, idx: number) => (
                        <div key={idx} className="relative rounded-lg overflow-hidden">
                          <img 
                            src={img} 
                            alt={`${selectedInstitute.name} - 이미지 ${idx + 1}`}
                            className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => {
                              setImageIndices(prev => ({ ...prev, [selectedInstitute.id]: idx }));
                              setDetailInstitute(selectedInstitute);
                              setDetailDialogOpen(true);
                            }}
                            onError={(e) => {
                              e.currentTarget.src = '/images/institutes/default-institute.png';
                            }}
                          />
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            {idx + 1} / {images.length}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center p-4">
                <MapPin className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">위치 정보 없음</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  왼쪽 목록에서 위치 서비스를 선택하면<br />상세 정보가 표시됩니다.
                </p>
              </div>
            )}
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
              if (isAuthenticated()) {
                window.location.href = '/institutes/register';
              } else {
                // 비회원인 경우 로그인 필요함을 안내하고 로그인 페이지로 이동
                toast({
                  title: "로그인이 필요합니다",
                  description: "위치 서비스 등록은 로그인 후 이용 가능합니다.",
                  variant: "destructive",
                });
                // 3초 후 로그인 페이지로 이동
                setTimeout(() => {
                  window.location.href = '/auth';
                }, 2000);
              }
            }}
          >
            등록 요청하기
          </Button>
        </div>
      </div>
      
      {/* 상세 정보 팝업 다이얼로그 */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {detailInstitute && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  {detailInstitute.name}
                  {detailInstitute.certification && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-md">
                      <Award className="h-3 w-3 mr-1 text-white" />
                      <span className="text-xs font-bold text-white">테일즈 공식인증</span>
                    </div>
                  )}
                </DialogTitle>
                <DialogDescription>
                  {detailInstitute.category} · {detailInstitute.location}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* 이미지 슬라이더 */}
                <div className="relative group rounded-lg overflow-hidden">
                  {(() => {
                    const images = detailInstitute.images || [detailInstitute.image];
                    const currentIndex = imageIndices[detailInstitute.id] || 0;
                    
                    return (
                      <>
                        <img 
                          src={images[currentIndex]} 
                          alt={`${detailInstitute.name} - 이미지 ${currentIndex + 1}`}
                          className="w-full h-[400px] object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/images/institutes/default-institute.png';
                          }}
                        />
                        
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={() => {
                                const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
                                setImageIndices(prev => ({ ...prev, [detailInstitute.id]: newIndex }));
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            
                            <button
                              onClick={() => {
                                const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
                                setImageIndices(prev => ({ ...prev, [detailInstitute.id]: newIndex }));
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                            
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                              {images.map((_: any, idx: number) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setImageIndices(prev => ({ ...prev, [detailInstitute.id]: idx }));
                                  }}
                                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                                    idx === currentIndex 
                                      ? 'bg-white w-6' 
                                      : 'bg-white/50 hover:bg-white/75'
                                  }`}
                                />
                              ))}
                            </div>
                            
                            <div className="absolute top-4 left-4 bg-black/60 text-white text-sm px-3 py-1.5 rounded-lg">
                              {currentIndex + 1} / {images.length}
                            </div>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
                
                {/* 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{detailInstitute.rating}</span>
                      <span className="text-gray-500">({detailInstitute.reviews} 후기)</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{detailInstitute.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">{detailInstitute.openingHours}</span>
                    </div>
                    
                    {detailInstitute.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">{detailInstitute.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">설립: {detailInstitute.established}</span>
                    </div>
                    
                    {detailInstitute.trainers > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">훈련사 {detailInstitute.trainers}명</span>
                      </div>
                    )}
                    
                    {detailInstitute.courses > 0 && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">강의 {detailInstitute.courses}개</span>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-2">
                      <Building className="h-5 w-5 text-gray-500 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        시설: {detailInstitute.facilities.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* 설명 */}
                <div>
                  <h3 className="font-semibold mb-2">소개</h3>
                  <p className="text-gray-700 dark:text-gray-300">{detailInstitute.description}</p>
                </div>
                
                {/* 카테고리 배지 */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-primary/10 dark:bg-primary/5 text-primary-foreground">
                    {getCategoryIcon(detailInstitute.category)}
                    {detailInstitute.category}
                  </Badge>
                  {detailInstitute.premium && (
                    <Badge variant="warning">
                      <Sparkles className="h-3 w-3 mr-1" />
                      프리미엄
                    </Badge>
                  )}
                </div>
                
                {/* 구글 맵 */}
                <div>
                  <h3 className="font-semibold mb-3">위치 정보</h3>
                  <GoogleMapView 
                    locations={[{
                      id: detailInstitute.id,
                      name: detailInstitute.name,
                      address: detailInstitute.location,
                      coordinates: getLocationFromInstitute(detailInstitute)
                    }]}
                    center={getLocationFromInstitute(detailInstitute)}
                    height="400px"
                    zoom={15}
                  />
                </div>
                
                {/* 날씨 정보 */}
                <WeatherInfo 
                  latitude={getLocationFromInstitute(detailInstitute).lat}
                  longitude={getLocationFromInstitute(detailInstitute).lng}
                  locationName={detailInstitute.name}
                />
                
                {/* 구글 맵에서 보기 버튼 */}
                {detailInstitute.sourceUrl && (
                  <Button 
                    className="w-full"
                    onClick={() => {
                      window.open(detailInstitute.sourceUrl, '_blank');
                    }}
                    data-testid="button-open-google-maps"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    구글 맵에서 보기
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}