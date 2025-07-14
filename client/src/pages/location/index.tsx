import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, MapPin, Navigation, Calendar, Clock, Users, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMapService, MapServiceProvider, Place } from '@/hooks/useMapService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * 위치 마커 컴포넌트
 */
function LocationMarker() {
  return (
    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 text-red-500 animate-bounce">
      <MapPin className="h-8 w-8" />
    </div>
  );
}

/**
 * 장소 검색 컴포넌트
 */
function PlaceSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { searchPlacesByKeyword } = useMapService();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "검색어를 입력해주세요",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      // 실제 위치 API 호출
      const response = await fetch(`/api/locations?search=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('검색 요청 실패');
      }
      const results = await response.json();
      setSearchResults(results);
      
      console.log(`[위치 검색] 검색어: "${searchTerm}", 결과: ${results.length}개`);
    } catch (error) {
      console.error("검색 오류:", error);
      toast({
        title: "검색 실패",
        description: "장소를 검색하는데 실패했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="위치 또는 장소 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          검색
        </Button>
      </div>

      {isSearching ? (
        <div className="py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : searchResults.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {searchResults.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      ) : (
        searchTerm && !isSearching && (
          <Alert variant="default">
            <AlertDescription>
              "{searchTerm}"에 대한 검색 결과가 없습니다.
            </AlertDescription>
          </Alert>
        )
      )}
    </div>
  );
}

/**
 * 근처 장소 찾기 컴포넌트
 */
function NearbyPlaces() {
  const [activeTab, setActiveTab] = useState<'institute' | 'trainer' | 'clinic' | 'shop' | 'event'>('trainer');
  const { 
    currentLocation, 
    nearbyPlaces, 
    isLoadingLocation, 
    isSearching, 
    getUserLocation, 
    searchNearbyPlaces 
  } = useMapService();
  const { toast } = useToast();

  // 축제/이벤트 데이터 (웹사이트에서 가져온 실제 데이터)
  const eventData = [
    {
      id: 1,
      name: "멍룡 썸머 뮤직 피크닉",
      location: {
        address: "전북 익산시 왕궁면 왕궁리 산80-1 (왕궁보석테마관광지 가족공원)",
        lat: 35.948611,
        lng: 126.837500
      },
      date: "2025-07-12",
      time: "오후 7:00 - 10:00",
      description: "반려인과 비반려인이 함께 즐기는 여름밤 문화행사. 보석 십자수, 자개 열쇠고리 만들기, 반려동물 미로 탐험, 어질리티 체험, 멍BTI 테스트 등 다양한 체험 프로그램과 클래식 4중주, 키즈팝 댄스, 버블쇼 등 공연이 펼쳐집니다.",
      category: "문화축제",
      price: "무료",
      attendees: 150,
      maxAttendees: 300,
      organizer: "익산시청",
      tags: ["반려동물", "문화체험", "음악회", "펫티켓", "반려동물 친화관광도시"]
    },
    {
      id: 2,
      name: "전주 한옥마을 반려동물 축제",
      location: {
        address: "전북 전주시 완산구 기린대로 99 (전주 한옥마을)",
        lat: 35.814444,
        lng: 127.153889
      },
      date: "2025-08-15",
      time: "오전 10:00 - 오후 6:00",
      description: "전주 한옥마을에서 펼쳐지는 반려동물과 함께하는 특별한 축제. 전통 한복 체험, 반려동물 사진 촬영, 한옥마을 투어 등 다양한 프로그램이 준비되어 있습니다.",
      category: "전통문화",
      price: "무료",
      attendees: 0,
      maxAttendees: 500,
      organizer: "전주시 문화관광재단",
      tags: ["한옥마을", "전통문화", "반려동물", "사진촬영"]
    },
    {
      id: 3,
      name: "군산 은파호수공원 반려견 어질리티 대회",
      location: {
        address: "전북 군산시 나운동 은파호수공원",
        lat: 35.968889,
        lng: 126.733611
      },
      date: "2025-09-05",
      time: "오전 9:00 - 오후 5:00",
      description: "반려견과 함께 참여하는 어질리티 대회. 초보자부터 전문가까지 다양한 레벨의 경기가 준비되어 있으며, 반려견 훈련 상담도 함께 진행됩니다.",
      category: "스포츠",
      price: 30000,
      attendees: 0,
      maxAttendees: 100,
      organizer: "군산시 반려동물협회",
      tags: ["어질리티", "반려견 훈련", "스포츠", "대회"]
    },
    {
      id: 4,
      name: "정읍 내장산 반려동물 힐링 캠프",
      location: {
        address: "전북 정읍시 내장동 내장산국립공원",
        lat: 35.449722,
        lng: 126.887500
      },
      date: "2025-10-10",
      time: "오전 10:00 - 오후 4:00",
      description: "내장산의 아름다운 자연 속에서 반려동물과 함께하는 힐링 캠프. 숲속 산책, 자연 놀이, 반려동물 요가 등 특별한 프로그램을 경험할 수 있습니다.",
      category: "자연체험",
      price: 25000,
      attendees: 0,
      maxAttendees: 80,
      organizer: "정읍시 관광진흥과",
      tags: ["힐링", "자연체험", "내장산", "반려동물 요가"]
    },
    {
      id: 5,
      name: "전주동물원 야간 특별 개방",
      location: {
        address: "전북 전주시 완산구 소리로 68 (전주동물원)",
        lat: 35.815000,
        lng: 127.119167
      },
      date: "2025-08-20",
      time: "오후 7:00 - 10:00",
      description: "여름 특별 프로그램으로 동물원 야간 개방. 반려동물과 함께 야간 동물원 투어, 별빛 음악회, 동물 먹이주기 체험 등 특별한 경험을 제공합니다.",
      category: "교육체험",
      price: 15000,
      attendees: 0,
      maxAttendees: 200,
      organizer: "전주시설관리공단",
      tags: ["동물원", "야간개방", "교육체험", "별빛음악회"]
    }
  ];

  // 근처 장소 검색
  const handleSearchNearby = async () => {
    // 현재 위치가 없으면 위치 가져오기
    if (!currentLocation) {
      const location = await getUserLocation();
      if (!location) {
        toast({
          title: "위치 정보 필요",
          description: "주변 검색을 위해 위치 정보를 허용해주세요.",
          variant: "destructive"
        });
        return;
      }
    }

    // 선택된 유형의 장소 검색
    searchNearbyPlaces(activeTab);
  };

  // 탭 변경 시 자동 검색 (축제/이벤트 탭 제외)
  useEffect(() => {
    if (currentLocation && activeTab !== 'event') {
      searchNearbyPlaces(activeTab);
    }
  }, [activeTab, currentLocation, searchNearbyPlaces]);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button 
          onClick={handleSearchNearby} 
          variant="default" 
          disabled={isLoadingLocation || isSearching}
        >
          {isLoadingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Navigation className="h-4 w-4 mr-2" />
          )}
          {currentLocation ? '현재 위치에서 검색' : '위치 확인 후 검색'}
        </Button>

        {currentLocation && (
          <div className="text-xs text-muted-foreground">
            위도: {currentLocation.latitude.toFixed(4)}, 
            경도: {currentLocation.longitude.toFixed(4)}
          </div>
        )}
      </div>

      <Tabs defaultValue="trainer" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="trainer">훈련사</TabsTrigger>
          <TabsTrigger value="institute">훈련소</TabsTrigger>
          <TabsTrigger value="clinic">동물병원</TabsTrigger>
          <TabsTrigger value="shop">용품점</TabsTrigger>
          <TabsTrigger value="event">축제/이벤트</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === 'event' ? (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {eventData.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : isSearching ? (
        <div className="py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : nearbyPlaces.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {nearbyPlaces.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      ) : (
        (!isSearching && currentLocation) && (
          <Alert variant="default">
            <AlertDescription>
              주변에 {getTypeLabel(activeTab)}이(가) 없습니다.
            </AlertDescription>
          </Alert>
        )
      )}
    </div>
  );
}

/**
 * 축제/이벤트 카드 컴포넌트
 */
function EventCard({ event }: { event: any }) {
  const { toast } = useToast();

  const handleEventClick = () => {
    toast({
      title: "이벤트 상세 정보",
      description: `${event.name}에 대한 자세한 정보를 확인하세요.`,
    });
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{event.name}</CardTitle>
            <CardDescription className="mt-1">
              {event.location?.address || event.location}
            </CardDescription>
          </div>
          <div className="flex items-center text-xs text-muted-foreground ml-2">
            <Calendar className="h-3 w-3 mr-1" />
            {event.date}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <p className="text-sm text-gray-600 line-clamp-2">
            {event.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {event.time}
              </div>
              {event.attendees && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {event.attendees}명 참여
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {event.category && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {event.category}
                </span>
              )}
              {event.price === '무료' ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  무료
                </span>
              ) : (
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  {typeof event.price === 'number' ? `${event.price.toLocaleString()}원` : event.price}
                </span>
              )}
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEventClick}
              className="w-full"
            >
              이벤트 상세보기
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 장소 카드 컴포넌트
 */
function PlaceCard({ place }: { place: Place }) {
  const { getDirections } = useMapService();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetDirections = async () => {
    setIsLoading(true);
    try {
      const directions = await getDirections(place.location);
      
      if (directions) {
        toast({
          title: "길찾기 완료",
          description: `예상 소요 시간: ${directions.duration.text}, 거리: ${directions.distance.text}`,
        });
      }
    } catch (error) {
      console.error("길찾기 오류:", error);
      toast({
        title: "길찾기 실패",
        description: "길찾기 정보를 가져오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{place.name}</CardTitle>
            <CardDescription>
              {place.location.address || "주소 정보 없음"}
            </CardDescription>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            {place.distance ? `${(place.distance / 1000).toFixed(1)}km` : "거리 정보 없음"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm">
            {place.description || getTypeLabel(place.type)}
            {place.contact && (
              <div className="text-xs text-muted-foreground mt-1">
                {place.contact}
              </div>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGetDirections}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <Navigation className="h-3 w-3 mr-1" />
            )}
            길찾기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 장소 유형에 따른 레이블 반환
 */
function getTypeLabel(type: string): string {
  switch (type) {
    case 'institute': return '훈련소';
    case 'trainer': return '훈련사';
    case 'clinic': return '동물병원';
    case 'shop': return '용품점';
    case 'event': return '축제/이벤트';
    default: return '장소';
  }
}

/**
 * 메인 위치 검색 페이지 컨텐츠
 */
function LocationPageContent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>위치 기반 서비스</CardTitle>
          <CardDescription>
            위치 기반으로 주변 훈련사, 훈련소, 동물병원, 용품점을 찾아보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="nearby">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="nearby">주변 검색</TabsTrigger>
              <TabsTrigger value="search">키워드 검색</TabsTrigger>
            </TabsList>
            <TabsContent value="nearby" className="pt-4">
              <NearbyPlaces />
            </TabsContent>
            <TabsContent value="search" className="pt-4">
              <PlaceSearch />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>지도 보기</CardTitle>
          <CardDescription>
            주변 지역의 지도를 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-md relative flex items-center justify-center">
            <div className="text-center p-4">
              <p className="mb-4">카카오맵이 로드됩니다</p>
              <Button variant="outline">지도 불러오기</Button>
            </div>
            <LocationMarker />
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            참고: 지도는 실제 기능 구현 시 카카오맵 API를 통해 로드됩니다.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 위치 검색 페이지
 */
export default function LocationPage() {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">위치 서비스</h1>
      <MapServiceProvider>
        <LocationPageContent />
      </MapServiceProvider>
    </div>
  );
}