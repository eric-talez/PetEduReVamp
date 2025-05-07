import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, CloudRain, MapPin, Sun, ThermometerSun, Wind, Locate, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    kakao: any;
  }
}

interface Location {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

interface Weather {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | string;
  humidity: number;
  windSpeed: number;
  description: string;
}

interface KakaoMapViewProps {
  selectedLocation?: Location | null;
}

export function KakaoMapView({ selectedLocation }: KakaoMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [myLocation, setMyLocation] = useState<{lat: number, lng: number} | null>(null);

  // 맵 초기화 
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initializeMap = () => {
      if (!window.kakao) {
        console.error('카카오 맵 API가 로드되지 않았습니다.');
        return;
      }

      // 서울 시청 좌표를 기본 중심점으로 사용
      const defaultCenter = new window.kakao.maps.LatLng(37.5665, 126.9780);
      
      const options = {
        center: defaultCenter,
        level: 5
      };

      const newMap = new window.kakao.maps.Map(mapContainerRef.current, options);
      setMap(newMap);
    };

    // 카카오맵 스크립트 로드 확인
    if (window.kakao && window.kakao.maps) {
      initializeMap();
    } else {
      console.log('카카오맵 로딩 중...');
      const checkKakaoMapInterval = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkKakaoMapInterval);
          initializeMap();
        }
      }, 300);
    }
  }, []);

  // 위치 변경 시 지도 중심점 변경
  useEffect(() => {
    if (!map || !selectedLocation) return;

    // 기존 마커 제거
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    // 새 마커 생성
    const position = new window.kakao.maps.LatLng(selectedLocation.lat, selectedLocation.lng);
    const marker = new window.kakao.maps.Marker({
      position,
      map,
    });

    // 정보 윈도우 생성
    const infoContent = `<div style="padding:5px;width:150px;text-align:center;">${selectedLocation.name}</div>`;
    const infoWindow = new window.kakao.maps.InfoWindow({
      content: infoContent,
    });
    infoWindow.open(map, marker);

    // 마커 저장
    setMarkers([marker]);

    // 지도 중심점 이동
    map.setCenter(position);
    map.setLevel(3); // 줌 레벨 조정
    
    // 날씨 정보 가져오기 (실제로는 API 호출이 필요하나 여기서는 모의 데이터 사용)
    fetchMockWeather(selectedLocation);
  }, [map, selectedLocation]);

  // 모의 날씨 데이터 가져오기 (실제 구현에서는 외부 날씨 API 사용)
  const fetchMockWeather = (location: Location) => {
    // 간단한 난수를 사용해 날씨 랜덤 생성
    const randNum = Math.floor(Math.random() * 4);
    const conditions = ['sunny', 'cloudy', 'rainy', 'cloudy'];
    const descriptions = ['맑음', '구름 많음', '비', '흐림'];
    
    // 모의 날씨 데이터
    const mockWeather: Weather = {
      temperature: Math.floor(Math.random() * 15) + 10, // 10~25도
      condition: conditions[randNum],
      humidity: Math.floor(Math.random() * 40) + 30, // 30~70%
      windSpeed: Math.floor(Math.random() * 10) + 1, // 1~10 m/s
      description: descriptions[randNum]
    };
    
    setWeather(mockWeather);
  };

  // 내 위치 찾기 함수
  const findMyLocation = () => {
    setIsLocating(true);
    
    if (!map) {
      toast({
        title: "오류",
        description: "지도가 로드되지 않았습니다. 페이지를 새로고침 해주세요.",
        variant: "destructive"
      });
      setIsLocating(false);
      return;
    }
    
    if (!navigator.geolocation) {
      toast({
        title: "위치 정보를 사용할 수 없습니다",
        description: "브라우저가 위치 정보 서비스를 지원하지 않습니다.",
        variant: "destructive"
      });
      setIsLocating(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        const lat = geoPosition.coords.latitude;
        const lng = geoPosition.coords.longitude;
        setMyLocation({ lat, lng });
        
        // 기존 마커 제거
        markers.forEach(marker => marker.setMap(null));
        setMarkers([]);
        
        // 내 위치에 마커 생성
        const myPosition = new window.kakao.maps.LatLng(lat, lng);
        const marker = new window.kakao.maps.Marker({
          position: myPosition,
          map,
        });
        
        // 정보 윈도우 생성
        const infoContent = `<div style="padding:5px;width:150px;text-align:center;">내 위치</div>`;
        const infoWindow = new window.kakao.maps.InfoWindow({
          content: infoContent,
        });
        infoWindow.open(map, marker);
        
        // 마커 저장
        setMarkers([marker]);
        
        // 지도 중심점 이동
        map.setCenter(myPosition);
        map.setLevel(3); // 줌 레벨 조정
        
        // 내 위치 근처 약식 좌표로 날씨 정보 조회
        const myCurrentLocation = {
          lat, 
          lng,
          name: "내 위치",
          address: "현재 위치"
        };
        fetchMockWeather(myCurrentLocation);
        
        toast({
          title: "위치 확인 성공",
          description: "현재 위치를 중심으로 지도를 이동했습니다.",
        });
        
        setIsLocating(false);
      },
      (error) => {
        let errorMessage = "알 수 없는 오류가 발생했습니다.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 정보 접근 권한이 거부되었습니다.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
            break;
        }
        
        toast({
          title: "위치 확인 실패",
          description: errorMessage,
          variant: "destructive"
        });
        
        setIsLocating(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );
  };

  // 날씨 아이콘 선택
  const getWeatherIcon = () => {
    if (!weather) return <Sun className="h-8 w-8 text-yellow-500" />;

    switch (weather.condition) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 지도 영역 */}
      <div className="relative">
        <div 
          ref={mapContainerRef} 
          className="h-[350px] w-full rounded-lg bg-gray-100 dark:bg-gray-800 mb-4"
        />
        
        {/* 내 위치 찾기 버튼 */}
        <div className="absolute bottom-4 right-4 z-10">
          <Button
            variant="default"
            size="sm"
            className="flex items-center space-x-1 bg-white/90 hover:bg-white text-black shadow-md"
            onClick={findMyLocation}
            disabled={isLocating}
          >
            {isLocating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Locate className="h-4 w-4 mr-1" />
            )}
            <span>{isLocating ? "위치 찾는 중..." : "내 위치 찾기"}</span>
          </Button>
        </div>
      </div>
      
      {/* 위치 및 날씨 정보 */}
      {selectedLocation && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-start mb-4">
              <MapPin className="h-5 w-5 text-primary mt-1 mr-2" />
              <div>
                <h3 className="font-semibold text-lg">{selectedLocation.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedLocation.address}
                </p>
              </div>
            </div>

            {weather && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="bg-white dark:bg-gray-700">현재 날씨</Badge>
                  <span className="text-sm">{new Date().toLocaleDateString('ko-KR')} {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    {getWeatherIcon()}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center mb-1">
                      <ThermometerSun className="h-4 w-4 mr-1 text-red-500" />
                      <span className="font-semibold">{weather.temperature}°C</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{weather.description}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <Cloud className="h-4 w-4 mr-1 text-blue-500" />
                        <span>습도: {weather.humidity}%</span>
                      </div>
                      <div className="flex items-center">
                        <Wind className="h-4 w-4 mr-1 text-blue-400" />
                        <span>바람: {weather.windSpeed}m/s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}