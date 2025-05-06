import { useEffect, useRef, useState } from "react";
import { Building, Search, Map, MapPin, Phone, ChevronRight, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// 카카오맵 타입 정의
declare global {
  interface Window {
    kakao: any;
  }
}

interface Place {
  id: string;
  place_name: string;
  address_name: string;
  category_name: string;
  phone: string;
  distance: string;
  place_url: string;
  rating: number;
  x: string;
  y: string;
}

export default function Locations() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState("");
  const [map, setMap] = useState<any>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mapScript = document.createElement("script");
    mapScript.async = true;
    mapScript.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAPS_API_KEY}&autoload=false&libraries=services,clusterer`;
    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        if (mapRef.current) {
          const options = {
            center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심점
            level: 5,
          };
          const kakaoMap = new window.kakao.maps.Map(mapRef.current, options);
          setMap(kakaoMap);
        }
      });
    };

    mapScript.addEventListener("load", onLoadKakaoMap);

    return () => {
      mapScript.removeEventListener("load", onLoadKakaoMap);
    };
  }, []);

  const searchPlaces = () => {
    if (!map || !keyword.trim()) return;

    setLoading(true);
    const ps = new window.kakao.maps.services.Places();
    
    ps.keywordSearch(keyword + " 애견", (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // 검색 결과를 처리하고 마커 생성
        const bounds = new window.kakao.maps.LatLngBounds();
        const mockPlaces: Place[] = data.map((item: any) => {
          bounds.extend(new window.kakao.maps.LatLng(item.y, item.x));
          
          // 실제 API에서는 평점 데이터가 없을 수 있으므로 테스트용 랜덤 평점 생성
          return {
            ...item,
            rating: parseFloat((3 + Math.random() * 2).toFixed(1)), // 3.0 ~ 5.0 사이 랜덤 평점
          };
        });
        
        setPlaces(mockPlaces);
        map.setBounds(bounds);

        // 마커 생성
        mockPlaces.forEach((place: Place) => {
          const marker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(place.y, place.x),
          });

          // 마커 클릭 이벤트
          window.kakao.maps.event.addListener(marker, "click", () => {
            setSelectedPlace(place);
          });
        });
      } else {
        setPlaces([]);
      }
      setLoading(false);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchPlaces();
  };

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
    if (map) {
      const moveLatLng = new window.kakao.maps.LatLng(place.y, place.x);
      map.setCenter(moveLatLng);
      map.setLevel(3);
    }
  };

  const renderStars = (rating: number) => {
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
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* 왼쪽 지도 섹션 */}
        <div className="w-full md:w-7/12 lg:w-8/12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold flex items-center">
                <Map className="mr-2 h-5 w-5 text-primary" />
                위치 기반 서비스
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                가까운 반려견 시설을 찾아보세요.
              </p>
              
              <form onSubmit={handleSearch} className="mt-4 flex">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="지역명 또는 시설명 검색..."
                    className="pl-10 pr-4 py-2 w-full"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="ml-2" disabled={loading}>
                  {loading ? "검색 중..." : "검색"}
                </Button>
              </form>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => setKeyword("애견카페")}>
                  애견카페
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => setKeyword("애견호텔")}>
                  애견호텔
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => setKeyword("동물병원")}>
                  동물병원
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => setKeyword("애견유치원")}>
                  애견유치원
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => setKeyword("애견훈련소")}>
                  애견훈련소
                </Badge>
              </div>
            </div>
            
            {/* 지도 표시 영역 */}
            <div ref={mapRef} className="w-full h-[500px]"></div>
          </div>
        </div>
        
        {/* 오른쪽 검색 결과 및 상세 정보 섹션 */}
        <div className="w-full md:w-5/12 lg:w-4/12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold flex items-center">
                <Building className="mr-2 h-5 w-5 text-primary" />
                {selectedPlace ? "상세 정보" : "검색 결과"}
              </h3>
            </div>
            
            <div className="flex-grow overflow-y-auto p-2">
              {selectedPlace ? (
                <div className="p-3">
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold">{selectedPlace.place_name}</h4>
                    {renderStars(selectedPlace.rating)}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex">
                      <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                      <span className="text-sm">{selectedPlace.address_name}</span>
                    </div>
                    
                    {selectedPlace.phone && (
                      <div className="flex">
                        <Phone className="w-5 h-5 mr-2 text-gray-500" />
                        <span className="text-sm">{selectedPlace.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex">
                      <Map className="w-5 h-5 mr-2 text-gray-500" />
                      <span className="text-sm">{selectedPlace.category_name}</span>
                    </div>
                    
                    {selectedPlace.distance && (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500">거리: 약 {(parseInt(selectedPlace.distance) / 1000).toFixed(1)}km</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <a
                      href={selectedPlace.place_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex items-center text-sm hover:underline"
                    >
                      카카오맵에서 보기 <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4" onClick={() => setSelectedPlace(null)}>
                    목록으로 돌아가기
                  </Button>
                </div>
              ) : (
                <div>
                  {places.length > 0 ? (
                    <div className="space-y-2 p-2">
                      {places.map((place) => (
                        <Card
                          key={place.id}
                          className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handlePlaceClick(place)}
                        >
                          <h4 className="font-medium">{place.place_name}</h4>
                          {renderStars(place.rating)}
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {place.address_name}
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-xs text-gray-500">{place.category_name}</span>
                            {place.distance && (
                              <span className="text-xs text-gray-500">{(parseInt(place.distance) / 1000).toFixed(1)}km</span>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <MapPin className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        {loading ? "검색 중..." : "검색 결과가 없습니다"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {loading
                          ? "잠시만 기다려주세요..."
                          : keyword
                          ? "다른 검색어로 다시 시도해보세요"
                          : "위의 검색창에 키워드를 입력해주세요"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}