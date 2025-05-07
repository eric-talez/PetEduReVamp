import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, CloudRain, MapPin, Sun, ThermometerSun, Wind } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

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
      <div 
        ref={mapContainerRef} 
        className="h-[350px] w-full rounded-lg bg-gray-100 dark:bg-gray-800 mb-4"
      />

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