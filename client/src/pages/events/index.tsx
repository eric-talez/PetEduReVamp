import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Filter, 
  Clock, 
  Users,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Tabs 컴포넌트는 현재 사용하지 않으므로 임포트 제거
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KakaoMapView } from '@/components/KakaoMapView';

// 임시 데이터 타입 정의
interface EventLocation {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  region: string;
}

interface EventItem {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: EventLocation;
  organizer: {
    name: string;
    avatar: string;
  };
  category: string;
  price: number | '무료';
  attendees: number;
  maxAttendees?: number;
}

// 임시 데이터
const MOCK_EVENTS: EventItem[] = [
  {
    id: 1,
    title: "강아지 사회화 모임",
    description: "다양한 강아지들과 함께하는 사회화 모임입니다. 반려견의 사회성 향상을 위한 최고의 기회!",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    date: "2025-05-15",
    time: "14:00 - 16:00",
    location: {
      id: 1,
      name: "강남 애견공원",
      address: "서울 강남구 삼성동 159",
      lat: 37.508796,
      lng: 127.061359,
      region: "서울"
    },
    organizer: {
      name: "김훈련",
      avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    category: "소셜",
    price: '무료',
    attendees: 15,
    maxAttendees: 20
  },
  {
    id: 2,
    title: "반려견 건강 세미나",
    description: "반려견의 건강을 위한 영양과 운동에 대한 전문가 세미나입니다.",
    image: "https://images.unsplash.com/photo-1597633425046-08f5110420b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    date: "2025-05-20",
    time: "19:00 - 21:00",
    location: {
      id: 2,
      name: "펫케어 센터",
      address: "서울 서초구 서초동 1445-3",
      lat: 37.491632,
      lng: 127.007358,
      region: "서울"
    },
    organizer: {
      name: "박수의",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    category: "교육",
    price: 15000,
    attendees: 28,
    maxAttendees: 40
  },
  {
    id: 3,
    title: "반려동물 페스티벌",
    description: "다양한 반려동물 용품과 먹거리, 체험 부스가 준비된 대규모 페스티벌입니다.",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    date: "2025-06-05",
    time: "10:00 - 18:00",
    location: {
      id: 3,
      name: "올림픽공원",
      address: "서울 송파구 방이동 88",
      lat: 37.520847,
      lng: 127.121674,
      region: "서울"
    },
    organizer: {
      name: "동물사랑협회",
      avatar: "https://images.unsplash.com/photo-1551887196-72e32bfc7bf3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    category: "축제",
    price: 20000,
    attendees: 120
  },
  {
    id: 4,
    title: "강아지 훈련 워크샵",
    description: "기본 훈련부터 고급 훈련까지, 실전 강아지 훈련 워크샵입니다.",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    date: "2025-05-25",
    time: "13:00 - 17:00",
    location: {
      id: 4,
      name: "부산 반려동물 교육센터",
      address: "부산 해운대구 우동 1411",
      lat: 35.162844,
      lng: 129.159608,
      region: "부산"
    },
    organizer: {
      name: "최트레이너",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    category: "교육",
    price: 50000,
    attendees: 8,
    maxAttendees: 10
  },
  {
    id: 5,
    title: "반려동물 입양 행사",
    description: "새로운 가족을 찾고 있는 유기동물들을 만나볼 수 있는 입양 행사입니다.",
    image: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    date: "2025-06-10",
    time: "11:00 - 16:00",
    location: {
      id: 5,
      name: "대구 반려동물 문화센터",
      address: "대구 수성구 범어동 178-1",
      lat: 35.859971,
      lng: 128.631049,
      region: "대구"
    },
    organizer: {
      name: "하트펫구조협회",
      avatar: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    category: "입양",
    price: '무료',
    attendees: 35
  }
];

// 지역 목록
const REGIONS = ["전체", "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

// 카테고리 목록
const CATEGORIES = ["전체", "소셜", "교육", "축제", "입양", "훈련", "건강", "기타"];

// 요금 필터 옵션
const PRICE_OPTIONS = ["전체", "무료", "유료"];

export default function EventsPage() {
  const [, setLocation] = useLocation();
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedPrice, setSelectedPrice] = useState("전체");
  const [selectedLocation, setSelectedLocation] = useState<EventLocation | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMap, setShowMap] = useState(true);
  
  // 모바일 화면 감지
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowMap(false);
      }
    };
    
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);
  
  // 필터링 로직
  useEffect(() => {
    let filtered = [...MOCK_EVENTS];
    
    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(
        event => event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 지역 필터링
    if (selectedRegion !== "전체") {
      filtered = filtered.filter(event => event.location.region === selectedRegion);
    }
    
    // 카테고리 필터링
    if (selectedCategory !== "전체") {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }
    
    // 요금 필터링
    if (selectedPrice !== "전체") {
      if (selectedPrice === "무료") {
        filtered = filtered.filter(event => event.price === "무료");
      } else {
        filtered = filtered.filter(event => event.price !== "무료");
      }
    }
    
    setFilteredEvents(filtered);
  }, [searchTerm, selectedRegion, selectedCategory, selectedPrice]);
  
  // 위치 기반 정렬 (선택한 위치에 가까운 순)
  const sortByLocation = (events: EventItem[], location: EventLocation) => {
    return [...events].sort((a, b) => {
      const distA = calculateDistance(a.location.lat, a.location.lng, location.lat, location.lng);
      const distB = calculateDistance(b.location.lat, b.location.lng, location.lat, location.lng);
      return distA - distB;
    });
  };
  
  // 거리 계산 함수 (Haversine 공식)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // 지구 반경 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  
  // 지도 마커 클릭 핸들러
  const handleMapMarkerClick = (location: EventLocation) => {
    setSelectedLocation(location);
    
    // 선택한 위치에 가까운 이벤트 정렬
    const sortedEvents = sortByLocation(filteredEvents, location);
    setFilteredEvents(sortedEvents);
  };
  
  // 날짜 포맷팅
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    
    const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return "종료됨";
    } else if (diffDays === 0) {
      return "오늘";
    } else if (diffDays === 1) {
      return "내일";
    } else if (diffDays < 7) {
      return `${diffDays}일 후`;
    } else {
      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* 배너 영역 */}
      <div className="mb-8">
        <div className="rounded-lg relative overflow-hidden">
          {/* 배경 이미지 */}
          <div className="absolute inset-0">
            <img 
              src="https://i.imgur.com/MGCN7Yx.jpg" 
              alt="반려동물 이벤트 배경" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
          </div>
          
          {/* 콘텐츠 영역 */}
          <div className="relative z-10 p-6">
            <h1 className="text-3xl font-bold mb-2 text-white dark:text-white bg-primary/80 dark:bg-primary/80 p-2 rounded inline-block">반려동물 이벤트</h1>
            <p className="text-white dark:text-white mb-4 bg-black/30 dark:bg-black/50 p-2 rounded max-w-lg">
              다양한 반려동물 행사와 만남의 장을 찾아보세요. 지역별, 테마별 이벤트를 한눈에!
            </p>
            
            {/* 배너 버튼 */}
            <div className="flex space-x-2 mt-4">
              <Button 
                variant="secondary"
                className="bg-white/80 hover:bg-white text-primary"
                onClick={() => document.getElementById('event-search')?.focus()}
              >
                <Search className="h-4 w-4 mr-2" />
                이벤트 찾기
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 필터 및 검색 */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="event-search"
              className="pl-10"
              placeholder="이벤트 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {selectedRegion === "전체" ? "지역" : selectedRegion}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 max-h-64 overflow-y-auto">
                <DropdownMenuLabel>지역 선택</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {REGIONS.map((region) => (
                  <DropdownMenuCheckboxItem
                    key={region}
                    checked={selectedRegion === region}
                    onCheckedChange={() => setSelectedRegion(region)}
                  >
                    {region}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedCategory === "전체" ? "카테고리" : selectedCategory}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>카테고리 선택</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {CATEGORIES.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={selectedCategory === category}
                    onCheckedChange={() => setSelectedCategory(category)}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  {selectedPrice === "전체" ? "요금" : selectedPrice}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>요금 선택</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {PRICE_OPTIONS.map((price) => (
                  <DropdownMenuCheckboxItem
                    key={price}
                    checked={selectedPrice === price}
                    onCheckedChange={() => setSelectedPrice(price)}
                  >
                    {price}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* 메인 컨텐츠 */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* 이벤트 목록 */}
        <div className={`${showMap ? 'md:w-7/12 lg:w-8/12' : 'w-full'}`}>
          {filteredEvents.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                다른 검색어나 필터 조건을 시도해보세요.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRegion("전체");
                  setSelectedCategory("전체");
                  setSelectedPrice("전체");
                }}
              >
                필터 초기화
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card 
                  key={event.id}
                  className="overflow-hidden h-full flex flex-col hover:shadow-md transition cursor-pointer"
                  onClick={() => setLocation(`/events/${event.id}`)}
                >
                  <div className="relative h-48">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary text-white">
                        {event.category}
                      </Badge>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline" className="bg-white text-black dark:bg-black dark:text-white">
                        {formatDate(event.date)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="mt-auto space-y-2 text-sm">
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-500">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{event.location.name}, {event.location.region}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500">
                          <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>
                            {event.attendees}명
                            {event.maxAttendees && ` / ${event.maxAttendees}명`}
                          </span>
                        </div>
                        
                        <Badge variant={event.price === '무료' ? "outline" : "secondary"}>
                          {event.price === '무료' ? '무료' : `${event.price.toLocaleString()}원`}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* 지도 영역 */}
        {showMap && (
          <div className="md:w-5/12 lg:w-4/12">
            <div className="sticky top-20">
              <Card className="overflow-hidden">
                <div className="h-[calc(100vh-180px)] min-h-[400px]">
                  <KakaoMapView 
                    selectedLocation={selectedLocation}
                  />
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}