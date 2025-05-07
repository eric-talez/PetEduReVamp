import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Calendar, MapPin, Filter, ChevronRight, Search } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KakaoMapView } from '@/components/KakaoMapView';
import { Avatar } from '@/components/ui/Avatar';

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

// 지역 리스트
const REGIONS = ["전체", "서울", "부산", "대구", "인천", "광주", "대전", "울산", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

// 카테고리 리스트
const CATEGORIES = ["전체", "소셜", "교육", "축제", "입양", "건강", "트레이닝", "경연대회"];

export default function EventsPage() {
  const [, setLocation] = useLocation();
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<"list" | "map" | "calendar">("list");
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [selectedLocation, setSelectedLocation] = useState<EventLocation | null>(null);

  // 모든 필터 적용
  useEffect(() => {
    let result = MOCK_EVENTS;
    
    // 지역 필터링
    if (selectedRegion !== "전체") {
      result = result.filter(event => event.location.region === selectedRegion);
    }
    
    // 카테고리 필터링
    if (selectedCategory !== "전체") {
      result = result.filter(event => event.category === selectedCategory);
    }
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        event => 
          event.title.toLowerCase().includes(query) || 
          event.description.toLowerCase().includes(query) ||
          event.location.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredEvents(result);
  }, [selectedRegion, selectedCategory, searchQuery]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const handleEventClick = (eventId: number) => {
    setLocation(`/events/${eventId}`);
  };

  const handleMapMarkerClick = (location: EventLocation) => {
    setSelectedLocation(location);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">반려동물 이벤트</h1>
          <p className="text-gray-500 mt-1">다가오는 반려동물 관련 이벤트와 모임을 찾아보세요</p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0">
          <Tabs value={viewType} onValueChange={(v) => setViewType(v as any)} className="w-[400px]">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="list">목록</TabsTrigger>
              <TabsTrigger value="map">지도</TabsTrigger>
              <TabsTrigger value="calendar">캘린더</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* 검색 및 필터 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="이벤트, 장소 검색..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-[200px]">
              <select
                className="w-full h-10 px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {REGIONS.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
            
            <div className="relative min-w-[200px]">
              <select
                className="w-full h-10 px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      
      {/* 뷰 타입에 따른 내용 표시 */}
      <TabsContent value="list" className="m-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <Card 
                key={event.id} 
                className="overflow-hidden hover:shadow-md transition cursor-pointer"
                onClick={() => handleEventClick(event.id)}
              >
                <div className="relative h-48">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary text-white">
                      {event.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                  
                  <div className="flex items-center text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(event.date)} · {event.time}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <Avatar
                        className="w-8 h-8 mr-2"
                      >
                        <img
                          src={event.organizer.avatar}
                          alt={event.organizer.name}
                          className="h-full w-full object-cover"
                        />
                      </Avatar>
                      <span className="text-sm">{event.organizer.name}</span>
                    </div>
                    
                    <div>
                      <Badge variant={event.price === '무료' ? "outline" : "secondary"}>
                        {event.price === '무료' ? '무료' : `${event.price.toLocaleString()}원`}
                      </Badge>
                    </div>
                  </div>
                  
                  {event.maxAttendees && (
                    <div className="mt-3 text-sm text-gray-500">
                      참가자: {event.attendees}/{event.maxAttendees}명
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10">
              <p className="text-gray-500 mb-4">검색 조건에 맞는 이벤트가 없습니다.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedRegion("전체");
                  setSelectedCategory("전체");
                  setSearchQuery("");
                }}
              >
                필터 초기화
              </Button>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="map" className="m-0">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/3 h-[calc(100vh-350px)] overflow-y-auto pr-2">
            {filteredEvents.map(event => (
              <Card 
                key={event.id} 
                className="mb-4 overflow-hidden hover:shadow-md transition cursor-pointer"
                onClick={() => {
                  handleMapMarkerClick(event.location);
                  handleEventClick(event.id);
                }}
              >
                <div className="p-4 flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-base font-semibold mb-1 line-clamp-1">{event.title}</h3>
                    
                    <div className="flex items-center text-gray-500 text-xs mb-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-xs mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="line-clamp-1">{event.location.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant={event.price === '무료' ? "outline" : "secondary"} className="text-xs">
                        {event.price === '무료' ? '무료' : `${event.price.toLocaleString()}원`}
                      </Badge>
                      
                      <Badge className="bg-primary text-white text-xs">
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="w-full lg:w-2/3 h-[calc(100vh-350px)] rounded-lg overflow-hidden">
            <KakaoMapView selectedLocation={selectedLocation} />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="calendar" className="m-0">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold">이벤트 캘린더</h2>
            <p className="text-gray-500">현재 준비 중입니다. 곧 업데이트될 예정입니다.</p>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {["일", "월", "화", "수", "목", "금", "토"].map(day => (
              <div key={day} className="text-center font-medium py-2 border-b">
                {day}
              </div>
            ))}
            
            {/* 임시 캘린더 더미 UI */}
            {Array.from({ length: 35 }).map((_, i) => {
              const hasEvent = [3, 8, 15, 20, 27].includes(i);
              return (
                <div 
                  key={i} 
                  className={`
                    h-24 border rounded-md p-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition 
                    ${hasEvent ? 'border-primary/30' : 'border-gray-200 dark:border-gray-700'}
                  `}
                >
                  <div className="text-right text-sm font-medium">
                    {i + 1}
                  </div>
                  {hasEvent && (
                    <div className="mt-1">
                      <div className="bg-primary/10 text-primary text-xs p-1 rounded mb-1 truncate">
                        이벤트 {i}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </TabsContent>
    </div>
  );
}