import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, MapPin, Navigation, Building, Phone, ChevronRight, Star, Map } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMapService, MapServiceProvider, Place } from '@/hooks/useMapService';
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
 * 근처 장소 찾기 컴포넌트
 */
function NearbyPlaces() {
  const [activeTab, setActiveTab] = useState<'institute' | 'trainer' | 'clinic' | 'shop'>('trainer');
  const { 
    currentLocation, 
    nearbyPlaces, 
    isLoadingLocation, 
    isSearching, 
    getUserLocation, 
    searchNearbyPlaces 
  } = useMapService();
  const { toast } = useToast();

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
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="trainer">훈련사</TabsTrigger>
          <TabsTrigger value="institute">훈련소</TabsTrigger>
          <TabsTrigger value="clinic">동물병원</TabsTrigger>
          <TabsTrigger value="shop">용품점</TabsTrigger>
        </TabsList>
      </Tabs>

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
            <CardTitle className="text-base">{place.name}</CardTitle>
            <CardDescription>
              {place.location.address || "주소 정보 없음"}
            </CardDescription>
            {place.rating && renderStars(place.rating)}
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
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">위치 서비스</h1>
      <MapServiceProvider>
        <LocationPageContent />
      </MapServiceProvider>
    </div>
  );
}