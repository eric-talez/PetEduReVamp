import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, MapPin, Navigation, Building, Phone, ChevronRight, Star, Map, Filter, PawPrint } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMapService, MapServiceProvider, Place, FilterOptions } from '@/hooks/useMapService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from "@/components/ui/badge";
import { useRef } from 'react';

// 카카오맵 타입 정의
declare global {
  interface Window {
    kakao: any;
  }
}

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
      const results = await searchPlacesByKeyword(searchTerm);
      setSearchResults(results);
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

  const handleBadgeClick = (keyword: string) => {
    setSearchTerm(keyword);
    setTimeout(() => {
      handleSearch();
    }, 100);
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

      <div className="flex flex-wrap gap-2 mt-2">
        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => handleBadgeClick("애견카페")}>
          애견카페
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => handleBadgeClick("애견호텔")}>
          애견호텔
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => handleBadgeClick("동물병원")}>
          동물병원
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => handleBadgeClick("애견유치원")}>
          애견유치원
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => handleBadgeClick("애견훈련소")}>
          애견훈련소
        </Badge>
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
 * 필터 메뉴 컴포넌트
 */
function FilterMenu() {
  const { filterOptions, setFilterOptions } = useMapService();
  const [isOpen, setIsOpen] = useState(false);
  
  // 필터 값 변경 핸들러
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilterOptions({ ...filterOptions, [key]: value });
  };
  
  // 특징 토글 핸들러
  const toggleFeature = (feature: string) => {
    const features = [...(filterOptions.features || [])];
    const index = features.indexOf(feature);
    
    if (index > -1) {
      features.splice(index, 1);
    } else {
      features.push(feature);
    }
    
    setFilterOptions({ ...filterOptions, features });
  };
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          필터 {isOpen ? '닫기' : '열기'}
          {filterOptions.certifiedOnly || filterOptions.petFriendlyLevel || (filterOptions.features && filterOptions.features.length > 0) ? (
            <Badge className="ml-2 bg-primary" variant="default">활성</Badge>
          ) : null}
        </Button>
        
        {(filterOptions.certifiedOnly || filterOptions.petFriendlyLevel || (filterOptions.features && filterOptions.features.length > 0)) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setFilterOptions({ certifiedOnly: false, petFriendlyLevel: null, features: [] })}
          >
            필터 초기화
          </Button>
        )}
      </div>
      
      {isOpen && (
        <div className="bg-card rounded-md p-4 mb-4 border">
          <div className="space-y-4">
            {/* 인증 필터 */}
            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="certified-only"
                  checked={filterOptions.certifiedOnly}
                  onChange={(e) => handleFilterChange('certifiedOnly', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="certified-only" className="ml-2 text-sm font-medium">
                  테일즈 인증 업체만 보기
                </label>
                <Badge className="ml-2 bg-blue-500 text-white">인증</Badge>
              </div>
            </div>
            
            {/* 반려동물 친화도 필터 */}
            <div>
              <h4 className="text-sm font-medium mb-2">반려동물 친화도</h4>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={filterOptions.petFriendlyLevel === 'high' ? 'default' : 'outline'} 
                  className={`cursor-pointer ${filterOptions.petFriendlyLevel === 'high' ? 'bg-green-500' : 'hover:bg-primary/10'}`}
                  onClick={() => handleFilterChange('petFriendlyLevel', filterOptions.petFriendlyLevel === 'high' ? null : 'high')}
                >
                  높음
                </Badge>
                <Badge 
                  variant={filterOptions.petFriendlyLevel === 'medium' ? 'default' : 'outline'} 
                  className={`cursor-pointer ${filterOptions.petFriendlyLevel === 'medium' ? 'bg-yellow-500' : 'hover:bg-primary/10'}`}
                  onClick={() => handleFilterChange('petFriendlyLevel', filterOptions.petFriendlyLevel === 'medium' ? null : 'medium')}
                >
                  중간
                </Badge>
                <Badge 
                  variant={filterOptions.petFriendlyLevel === 'low' ? 'default' : 'outline'} 
                  className={`cursor-pointer ${filterOptions.petFriendlyLevel === 'low' ? 'bg-orange-500' : 'hover:bg-primary/10'}`}
                  onClick={() => handleFilterChange('petFriendlyLevel', filterOptions.petFriendlyLevel === 'low' ? null : 'low')}
                >
                  낮음
                </Badge>
              </div>
            </div>
            
            {/* 특징 필터 */}
            <div>
              <h4 className="text-sm font-medium mb-2">특징</h4>
              <div className="grid grid-cols-2 gap-2">
                {['야외좌석', '실내좌석', '반려동물 전용공간', '반려동물 음료', '반려동물 간식', '반려동물 용품', '넓은 공간', '주차장'].map(feature => (
                  <div key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`feature-${feature}`}
                      checked={filterOptions.features?.includes(feature) || false}
                      onChange={() => toggleFeature(feature)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={`feature-${feature}`} className="ml-2 text-sm">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 근처 장소 찾기 컴포넌트
 */
function NearbyPlaces() {
  const [activeTab, setActiveTab] = useState<'institute' | 'trainer' | 'clinic' | 'shop' | 'pension' | 'cafe' | 'camping' | 'park' | 'pethotel'>('trainer');
  const { 
    currentLocation, 
    nearbyPlaces,
    isLoadingLocation, 
    isSearching, 
    getUserLocation, 
    searchNearbyPlaces,
    getFilteredPlaces
  } = useMapService();
  const { toast } = useToast();
  
  // 필터링된 장소 목록
  const filteredPlaces = getFilteredPlaces();

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

  // 탭 변경 시 자동 검색
  useEffect(() => {
    if (currentLocation) {
      searchNearbyPlaces(activeTab);
    }
  }, [activeTab, currentLocation, searchNearbyPlaces]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3">
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
        
        {/* 필터 메뉴 */}
        <FilterMenu />
      </div>

      <Tabs defaultValue="trainer" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid grid-cols-9 overflow-x-auto min-w-full">
          <TabsTrigger value="trainer">훈련사</TabsTrigger>
          <TabsTrigger value="institute">훈련소</TabsTrigger>
          <TabsTrigger value="clinic">동물병원</TabsTrigger>
          <TabsTrigger value="shop">용품점</TabsTrigger>
          <TabsTrigger value="pension">펜션</TabsTrigger>
          <TabsTrigger value="cafe">애견카페</TabsTrigger>
          <TabsTrigger value="camping">캠핑장</TabsTrigger>
          <TabsTrigger value="park">애견공원</TabsTrigger>
          <TabsTrigger value="pethotel">애견호텔</TabsTrigger>
        </TabsList>
      </Tabs>

      {isSearching ? (
        <div className="py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredPlaces.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {filteredPlaces.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      ) : nearbyPlaces.length > 0 && filteredPlaces.length === 0 ? (
        <Alert variant="default">
          <AlertDescription>
            인증된 {getTypeLabel(activeTab)}이(가) 없습니다. 모든 결과를 보려면 인증 필터를 해제하세요.
          </AlertDescription>
        </Alert>
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

  // 반려동물 친화도 표시 함수
  const renderPetFriendlyLevel = (level?: 'low' | 'medium' | 'high') => {
    if (!level) return null;
    
    const colors = {
      high: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-orange-100 text-orange-800 border-orange-300'
    };
    
    const labels = {
      high: '반려동물 친화도: 높음',
      medium: '반려동물 친화도: 중간',
      low: '반려동물 친화도: 낮음'
    };
    
    return (
      <div className={`text-xs py-1 px-2 rounded-md inline-flex items-center mt-1 ${colors[level]} border`}>
        <PawPrint className="h-3 w-3 mr-1" />
        {labels[level]}
      </div>
    );
  };
  
  // 특징 태그 표시 함수
  const renderFeatureTags = (features?: string[]) => {
    if (!features || features.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {features.slice(0, 3).map((feature, index) => (
          <div key={index} className="text-xs py-0.5 px-2 bg-gray-100 text-gray-800 rounded-full border border-gray-200">
            {feature}
          </div>
        ))}
        {features.length > 3 && (
          <div className="text-xs py-0.5 px-2 bg-gray-100 text-gray-800 rounded-full border border-gray-200">
            +{features.length - 3}
          </div>
        )}
      </div>
    );
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {Array(fullStars).fill(0).map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-gray-300" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            </div>
          </div>
        )}
        {Array(5 - fullStars - (hasHalfStar ? 1 : 0)).fill(0).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <CardTitle className="text-base mr-2">{place.name}</CardTitle>
              {place.isCertified && (
                <Badge className="bg-blue-500 text-white text-xs">
                  테일즈 인증
                </Badge>
              )}
            </div>
            <CardDescription>
              {place.location.address || "주소 정보 없음"}
            </CardDescription>
            {place.rating && renderStars(place.rating)}
            {place.isCertified && place.certificationLevel && (
              <div className="mt-1 text-xs text-blue-600">
                {place.certificationLevel === 'standard' ? '표준 인증' :
                 place.certificationLevel === 'premium' ? '프리미엄 인증' :
                 place.certificationLevel === 'exclusive' ? '특별 인증' : '인증됨'} 
                {place.certificationDate && `(${place.certificationDate})`}
              </div>
            )}
            {place.petFriendlyLevel && renderPetFriendlyLevel(place.petFriendlyLevel)}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            {place.distance ? `${(place.distance / 1000).toFixed(1)}km` : "거리 정보 없음"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              {place.description || getTypeLabel(place.type)}
              {place.contact && (
                <div className="text-xs text-muted-foreground mt-1">
                  <Phone className="h-3 w-3 inline mr-1" />
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
          {place.features && renderFeatureTags(place.features)}
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
    case 'pension': return '펜션';
    case 'cafe': return '애견카페';
    case 'camping': return '캠핑장';
    case 'park': return '애견공원';
    case 'pethotel': return '애견호텔';
    default: return '장소';
  }
}

/**
 * 카카오맵 컴포넌트
 */
function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    // API 키 확인 및 디버깅 로그
    const apiKey = import.meta.env.VITE_KAKAO_MAPS_API_KEY;
    console.log('Kakao Maps API Key in component:', apiKey);
    
    if (!apiKey) {
      console.error('Kakao Maps API 키가 없습니다');
      return;
    }
    
    try {
      const mapScript = document.createElement("script");
      mapScript.async = true;
      mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services,clusterer`;
      
      const onLoadKakaoMap = () => {
        console.log('카카오맵 스크립트 로드 성공');
        try {
          window.kakao.maps.load(() => {
            console.log('카카오맵 API 초기화 성공');
            try {
              if (mapRef.current) {
                const options = {
                  center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심점
                  level: 5,
                };
                const kakaoMap = new window.kakao.maps.Map(mapRef.current, options);
                console.log('카카오맵 생성 성공');
                setMapLoaded(true);
              }
            } catch (error) {
              console.error('지도 렌더링 중 오류:', error);
            }
          });
        } catch (error) {
          console.error('카카오맵 로드 중 오류:', error);
        }
      };
      
      // 로드 성공 및 실패 처리
      mapScript.addEventListener("load", onLoadKakaoMap);
      mapScript.addEventListener("error", (e) => {
        console.error('카카오맵 스크립트 로드 실패:', e);
      });
      
      document.head.appendChild(mapScript);
      
      return () => {
        mapScript.removeEventListener("load", onLoadKakaoMap);
        try {
          document.head.removeChild(mapScript);
        } catch (e) {
          console.error('스크립트 제거 중 오류:', e);
        }
      };
    } catch (error) {
      console.error('카카오맵 초기화 중 오류:', error);
    }
  }, []);

  return (
    <div className="relative h-64 bg-muted rounded-md overflow-hidden">
      <div ref={mapRef} className="w-full h-full"></div>
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="text-center p-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>지도를 불러오는 중...</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 메인 위치 검색 페이지 컨텐츠
 */
function LocationPageContent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Map className="mr-2 h-5 w-5 text-primary" />
            위치 기반 서비스
          </CardTitle>
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
          <CardTitle className="flex items-center">
            <Map className="mr-2 h-5 w-5 text-primary" />
            지도 보기
          </CardTitle>
          <CardDescription>
            주변 지역의 지도를 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KakaoMap />
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 위치 검색 페이지
 */
export default function Locations() {
  return (
    <div className="p-6 container mx-auto">
      <h1 className="text-3xl font-bold mb-6">위치 서비스</h1>
      <MapServiceProvider>
        <LocationPageContent />
      </MapServiceProvider>
    </div>
  );
}