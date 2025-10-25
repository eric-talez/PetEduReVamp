import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, MapPin, Navigation, Calendar, Clock, Users, Star, Filter, ExternalLink, Heart, Share2, Trophy, Upload, Image, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMapService, MapServiceProvider, Place } from '@/hooks/useMapService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { apiRequest } from '@/lib/queryClient';
import { GoogleMapView } from '@/components/GoogleMapView';

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
  const [isSearching, setIsSearching] = useState(false);
  const { nearbyPlaces, setNearbyPlaces } = useMapService();
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
      // 실제 카카오맵 API 호출
      const response = await fetch(`/api/locations?search=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error(`검색 요청 실패: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('JSON이 아닌 응답:', text.substring(0, 200));
        throw new Error('잘못된 응답 형식');
      }
      
      const results = await response.json();
      
      // API 응답을 Place 형태로 변환
      const places: Place[] = results.map((item: any) => ({
        id: item.id,
        name: item.name,
        location: {
          latitude: item.latitude,
          longitude: item.longitude,
          address: item.address
        },
        type: item.type || 'shop',
        rating: item.rating,
        distance: item.distance,
        photo: item.photo,
        contact: item.phone,
        openingHours: item.openingHours,
        description: item.description || item.category_name,
        isCertified: item.certification || false,
        certificationLevel: item.certificationLevel || 'standard',
        petFriendlyLevel: 'medium',
        features: item.features || []
      }));
      
      setNearbyPlaces(places);
      
      console.log(`[위치 검색] 검색어: "${searchTerm}", 결과: ${results.length}개`);
      
      toast({
        title: "검색 완료",
        description: `${results.length}개의 장소를 찾았습니다.`,
      });
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
      ) : nearbyPlaces.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {nearbyPlaces.map(place => (
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

  // 이벤트 필터링 및 검색 상태
  const [eventSearchTerm, setEventSearchTerm] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState('all');
  const [eventStatusFilter, setEventStatusFilter] = useState('all');
  const [eventSortBy, setEventSortBy] = useState('date');
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  // 축제/이벤트 데이터 - API에서 가져오기
  const [eventData, setEventData] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // 썸네일 업데이트 핸들러
  const handleThumbnailUpdate = (eventId: number, thumbnailUrl: string) => {
    setEventData(prevData => 
      prevData.map(event => 
        event.id === eventId ? { ...event, thumbnailUrl } : event
      )
    );
  };
  
  // 이벤트 API 호출 함수
  const fetchEvents = async () => {
    try {
      setIsLoadingEvents(true);
      console.log('🔥 이벤트 API 호출 시작');
      
      // 직접 fetch 사용하여 API 호출
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🔥 API 응답 데이터:', data);
      console.log('🔥 API 응답 타입:', typeof data, Array.isArray(data));
      
      if (Array.isArray(data)) {
        setEventData(data);
        console.log('🔥 이벤트 데이터 설정 완료, 총 개수:', data.length);
      } else if (data && data.items && Array.isArray(data.items)) {
        // 페이지네이션 형태의 응답 처리
        setEventData(data.items);
        console.log('🔥 이벤트 데이터 설정 완료 (페이지네이션), 총 개수:', data.items.length);
      } else {
        console.error('🔥 API 응답이 배열이 아님:', data);
        setEventData([]);
      }
    } catch (error) {
      console.error('🔥 이벤트 조회 오류:', error);
      toast({
        title: "오류",
        description: "이벤트 정보를 불러오는데 실패했습니다.",
        variant: "destructive"
      });
      setEventData([]);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // 이벤트 탭 선택 시 데이터 로드
  useEffect(() => {
    if (activeTab === 'event') {
      fetchEvents();
    }
  }, [activeTab]);

  // 이벤트 필터링 및 검색 로직
  useEffect(() => {
    console.log('🔥 필터링 시작, 원본 데이터 개수:', eventData.length);
    let filtered = [...eventData];

    // 검색어 필터링
    if (eventSearchTerm) {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
        event.location.address.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(eventSearchTerm.toLowerCase()))
      );
    }

    // 카테고리 필터링
    if (eventCategoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === eventCategoryFilter);
    }

    // 상태 필터링
    if (eventStatusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === eventStatusFilter);
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (eventSortBy) {
        case 'date':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          const priceA = a.price === '무료' ? 0 : typeof a.price === 'number' ? a.price : parseInt(a.price.replace(/[^\d]/g, '')) || 0;
          const priceB = b.price === '무료' ? 0 : typeof b.price === 'number' ? b.price : parseInt(b.price.replace(/[^\d]/g, '')) || 0;
          return priceA - priceB;
        case 'attendees':
          return b.maxAttendees - a.maxAttendees;
        default:
          return 0;
      }
    });

    console.log('🔥 필터링 완료, 필터링된 데이터 개수:', filtered.length);
    setFilteredEvents(filtered);
  }, [eventData, eventSearchTerm, eventCategoryFilter, eventStatusFilter, eventSortBy]);

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

    // 선택된 유형의 장소 검색 (이벤트 탭 제외)
    if (activeTab !== 'event') {
      searchNearbyPlaces(activeTab as any);
    }
  };

  // 탭 변경 시 자동 검색 (축제/이벤트 탭 제외)
  useEffect(() => {
    if (currentLocation && activeTab !== 'event') {
      searchNearbyPlaces(activeTab as any);
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

      {/* 카테고리 구분 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">카테고리 선택</h3>
        <Tabs defaultValue="trainer" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="trainer" className="text-sm">훈련사</TabsTrigger>
            <TabsTrigger value="institute" className="text-sm">훈련소</TabsTrigger>
            <TabsTrigger value="clinic" className="text-sm">동물병원</TabsTrigger>
            <TabsTrigger value="shop" className="text-sm">용품점</TabsTrigger>
            <TabsTrigger value="event" className="text-sm">축제/이벤트</TabsTrigger>
          </TabsList>
          
          {/* 탭 컨텐츠 */}
          <TabsContent value="trainer" className="mt-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                주변 반려동물 훈련사를 찾아보세요. 전문적인 훈련 서비스를 제공합니다.
              </div>
              {isSearching ? (
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
          </TabsContent>

          <TabsContent value="institute" className="mt-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                주변 반려동물 훈련소를 찾아보세요. 체계적인 훈련 프로그램을 제공합니다.
              </div>
              {isSearching ? (
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
          </TabsContent>

          <TabsContent value="clinic" className="mt-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                주변 동물병원을 찾아보세요. 반려동물의 건강관리를 위한 전문 의료 서비스를 제공합니다.
              </div>
              {isSearching ? (
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
          </TabsContent>

          <TabsContent value="shop" className="mt-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                주변 반려동물 용품점을 찾아보세요. 사료, 간식, 장난감 등 다양한 용품을 만나보세요.
              </div>
              {isSearching ? (
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
          </TabsContent>

          <TabsContent value="event" className="mt-4">
            <div className="space-y-4">
              {/* 축제/이벤트 필터링 및 검색 UI */}
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="축제명, 지역, 태그로 검색..."
                      value={eventSearchTerm}
                      onChange={(e) => setEventSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={eventCategoryFilter} onValueChange={setEventCategoryFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="카테고리" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체 카테고리</SelectItem>
                        <SelectItem value="전시회">전시회</SelectItem>
                        <SelectItem value="지역축제">지역축제</SelectItem>
                        <SelectItem value="자연체험">자연체험</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={eventStatusFilter} onValueChange={setEventStatusFilter}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="상태" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체 상태</SelectItem>
                        <SelectItem value="예정">예정</SelectItem>
                        <SelectItem value="진행중">진행중</SelectItem>
                        <SelectItem value="완료">완료</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={eventSortBy} onValueChange={setEventSortBy}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="정렬" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">날짜순</SelectItem>
                        <SelectItem value="name">이름순</SelectItem>
                        <SelectItem value="price">가격순</SelectItem>
                        <SelectItem value="attendees">규모순</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span>총 {filteredEvents.length}개의 축제/이벤트</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        예정: {filteredEvents.filter(e => e.status === '예정').length}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        완료: {filteredEvents.filter(e => e.status === '완료').length}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEventSearchTerm('');
                        setEventCategoryFilter('all');
                        setEventStatusFilter('all');
                        setEventSortBy('date');
                      }}
                    >
                      <Filter className="h-4 w-4 mr-1" />
                      필터 초기화
                    </Button>
                  </div>
                </div>
              </div>

              {/* 축제/이벤트 목록 */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {isLoadingEvents ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">이벤트 정보를 불러오는 중...</span>
                  </div>
                ) : filteredEvents.length > 0 ? (
                  <>
                    <div className="text-sm text-muted-foreground mb-2">
                      {filteredEvents.length}개의 이벤트를 표시하고 있습니다.
                    </div>
                    {filteredEvents.map((event, index) => {
                      console.log(`🔥 이벤트 ${index + 1}/${filteredEvents.length}: ${event.name}`);
                      return <EventCard key={event.id} event={event} onThumbnailUpdate={handleThumbnailUpdate} />;
                    })}
                  </>
                ) : (
                  <Alert>
                    <AlertDescription>
                      검색 조건에 맞는 축제/이벤트가 없습니다.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 이벤트 상세 정보 다이얼로그 */}
      <EventDetailDialog 
        event={selectedEvent} 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </div>
  );
}

/**
 * 이벤트 상세 정보 다이얼로그
 */
function EventDetailDialog({ event, isOpen, onClose }: { event: any; isOpen: boolean; onClose: () => void }) {
  if (!event) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case '예정': return 'bg-blue-100 text-blue-800 border-blue-300';
      case '진행중': return 'bg-green-100 text-green-800 border-green-300';
      case '완료': return 'bg-gray-100 text-gray-800 border-gray-300';
      case '취소': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '전시회': return <Trophy className="h-5 w-5" />;
      case '지역축제': return <Star className="h-5 w-5" />;
      case '자연체험': return <MapPin className="h-5 w-5" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };

  const handleSourceLink = () => {
    if (event.sourceUrl) {
      window.open(event.sourceUrl, '_blank');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: event.description,
        url: event.sourceUrl
      });
    } else {
      navigator.clipboard.writeText(event.sourceUrl);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-primary">
              {getCategoryIcon(event.category)}
              <span className="ml-2 text-sm font-medium">{event.category}</span>
            </div>
            <Badge className={`text-xs ${getStatusColor(event.status)}`}>
              {event.status}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold mt-2">{event.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 썸네일 이미지 */}
          {event.thumbnailUrl && (
            <div className="relative h-64 overflow-hidden rounded-lg">
              <img 
                src={event.thumbnailUrl} 
                alt={event.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">일정:</span>
                <span className="ml-2">
                  {event.startDate === event.endDate ? 
                    event.startDate : 
                    `${event.startDate} ~ ${event.endDate}`
                  }
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">시간:</span>
                <span className="ml-2">{event.time}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">장소:</span>
                <span className="ml-2">{event.location?.address || event.location}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">참가자:</span>
                <span className="ml-2">
                  {event.attendees > 0 ? `${event.attendees}명 참여` : '참여 대기'} 
                  / 최대 {event.maxAttendees?.toLocaleString()}명
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium">참가비:</span>
                <span className="ml-2">
                  {event.price === '무료' ? (
                    <Badge className="bg-green-100 text-green-800">무료</Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-800">
                      {typeof event.price === 'number' ? `${event.price.toLocaleString()}원` : event.price}
                    </Badge>
                  )}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium">주최:</span>
                <span className="ml-2">{event.organizer}</span>
              </div>
            </div>
          </div>
          
          {/* 상세 설명 */}
          <div>
            <h4 className="font-semibold mb-2">상세 설명</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
          </div>
          
          {/* 태그 */}
          {event.tags && event.tags.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">태그</h4>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* 액션 버튼 */}
          <div className="flex space-x-2 pt-4 border-t">
            {event.sourceUrl && (
              <Button onClick={handleSourceLink} className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                원본 페이지 보기
              </Button>
            )}
            <Button onClick={handleShare} variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              공유하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 썸네일 업로드 컴포넌트
 */
function ThumbnailUpload({ eventId, onUploadSuccess }: { eventId: number; onUploadSuccess: (thumbnailUrl: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('thumbnail', file);
      
      const response = await fetch(`/api/events/${eventId}/thumbnail`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('업로드 실패');
      }
      
      const result = await response.json();
      
      toast({
        title: "썸네일 업로드 완료",
        description: "이벤트 썸네일이 성공적으로 업로드되었습니다.",
      });
      
      onUploadSuccess(result.thumbnailUrl);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('썸네일 업로드 오류:', error);
      toast({
        title: "업로드 실패",
        description: "썸네일 업로드에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          썸네일 업로드
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>이벤트 썸네일 업로드</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="space-y-2">
              <Image className="h-12 w-12 mx-auto text-gray-400" />
              <div className="space-y-1">
                <p className="text-sm font-medium">드래그 앤 드롭 또는 클릭하여 파일 선택</p>
                <p className="text-xs text-gray-500">JPG, PNG, GIF 파일 (최대 10MB)</p>
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                }}
                className="hidden"
                id="thumbnail-upload"
              />
              <label htmlFor="thumbnail-upload">
                <Button variant="outline" size="sm" disabled={isUploading} asChild>
                  <span className="cursor-pointer">
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        업로드 중...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        파일 선택
                      </>
                    )}
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 축제/이벤트 카드 컴포넌트
 */
function EventCard({ event, onThumbnailUpdate }: { event: any; onThumbnailUpdate?: (eventId: number, thumbnailUrl: string) => void }) {
  const { toast } = useToast();

  const handleEventClick = () => {
    // 이벤트 상세 정보 다이얼로그 열기
    console.log('이벤트 클릭:', event.name);
  };

  const handleSourceLink = () => {
    if (event.sourceUrl) {
      window.open(event.sourceUrl, '_blank');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: event.description,
        url: event.sourceUrl
      });
    } else {
      navigator.clipboard.writeText(event.sourceUrl);
      toast({
        title: "링크 복사됨",
        description: "이벤트 링크가 클립보드에 복사되었습니다.",
      });
    }
  };

  const handleThumbnailUploadSuccess = (thumbnailUrl: string) => {
    if (onThumbnailUpdate) {
      onThumbnailUpdate(event.id, thumbnailUrl);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '예정': return 'bg-blue-100 text-blue-800';
      case '진행중': return 'bg-green-100 text-green-800';
      case '완료': return 'bg-gray-100 text-gray-800';
      case '취소': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '전시회': return <Trophy className="h-4 w-4" />;
      case '지역축제': return <Star className="h-4 w-4" />;
      case '자연체험': return <MapPin className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary cursor-pointer hover:border-primary/50"
      onClick={handleEventClick}
    >
      {/* 썸네일 이미지 */}
      {event.thumbnailUrl && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={event.thumbnailUrl} 
            alt={event.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute top-2 right-2">
            <Badge className={`text-xs ${getStatusColor(event.status)}`}>
              {event.status}
            </Badge>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center text-primary">
                {getCategoryIcon(event.category)}
                <span className="ml-1 text-sm font-medium">{event.category}</span>
              </div>
              {!event.thumbnailUrl && (
                <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                  {event.status}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg leading-tight">{event.name}</CardTitle>
            <CardDescription className="mt-1 text-sm">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {event.location?.address || event.location}
              </div>
            </CardDescription>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {event.startDate === event.endDate ? 
                event.startDate : 
                `${event.startDate} ~ ${event.endDate}`
              }
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {event.time}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">
            {event.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {event.attendees > 0 ? `${event.attendees}명 참여` : '참여 대기'}
              </div>
              <div className="text-xs">
                최대 {event.maxAttendees?.toLocaleString()}명
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {event.price === '무료' ? (
                <Badge className="bg-green-100 text-green-800">무료</Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-800">
                  {typeof event.price === 'number' ? `${event.price.toLocaleString()}원` : event.price}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {event.tags?.slice(0, 3).map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {event.tags?.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{event.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            주최: {event.organizer}
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleEventClick();
              }}
              className="flex-1"
            >
              상세보기
            </Button>
            {event.sourceUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleSourceLink();
                }}
                className="px-3"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="px-3"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* 썸네일 업로드 버튼 */}
          <div className="flex justify-center pt-3 border-t" onClick={(e) => e.stopPropagation()}>
            <ThumbnailUpload 
              eventId={event.id} 
              onUploadSuccess={handleThumbnailUploadSuccess}
            />
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
  const mapService = useMapService();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetDirections = async () => {
    setIsLoading(true);
    try {
      // 길찾기 기능 (임시로 비활성화)
      console.log('길찾기 요청:', place.location);
      const directions = null;
      
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
  const { currentLocation, nearbyPlaces, selectedPlace, setSelectedPlace } = useMapService();
  
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
            주변 지역의 지도와 검색된 장소들을 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleMapView 
            center={{
              lat: currentLocation?.latitude || 37.5665,
              lng: currentLocation?.longitude || 126.978
            }}
            locations={nearbyPlaces.map((place: any) => ({
              id: place.id,
              name: place.name,
              address: place.location?.address || '',
              type: place.type,
              coordinates: {
                lat: place.location?.latitude || 0,
                lng: place.location?.longitude || 0
              }
            }))}
            onLocationSelect={(location) => {
              const place = nearbyPlaces.find(p => p.id === location.id);
              if (place) setSelectedPlace(place);
            }}
            height="500px"
          />
          <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Google Maps API를 통해 실시간 지도 서비스를 제공합니다.
            {currentLocation && (
              <span className="text-primary">
                현재 위치: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              </span>
            )}
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