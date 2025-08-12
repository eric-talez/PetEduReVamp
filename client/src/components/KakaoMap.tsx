import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Phone, Clock, Star, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Place, Location } from '@/hooks/useMapService';

interface KakaoMapProps {
  center?: Location;
  places?: Place[];
  onPlaceSelect?: (place: Place) => void;
  height?: string;
  showControls?: boolean;
  className?: string;
}

interface KakaoMapInstance {
  setCenter: (latlng: any) => void;
  getLevel: () => number;
  setLevel: (level: number) => void;
  panTo: (latlng: any) => void;
  setBounds: (bounds: any) => void;
}

interface KakaoMarker {
  setMap: (map: KakaoMapInstance | null) => void;
  setPosition: (latlng: any) => void;
}

interface KakaoInfoWindow {
  setContent: (content: string) => void;
  open: (map: KakaoMapInstance, marker: KakaoMarker) => void;
  close: () => void;
}

declare global {
  interface Window {
    kakao: any;
  }
}

const KAKAO_MAPS_API_KEY = import.meta.env.VITE_KAKAO_MAPS_API_KEY;

export const KakaoMap: React.FC<KakaoMapProps> = ({
  center = { latitude: 37.5665, longitude: 126.978 }, // 기본값: 서울 시청
  places = [],
  onPlaceSelect,
  height = "400px",
  showControls = true,
  className = ""
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<KakaoMapInstance | null>(null);
  const [markers, setMarkers] = useState<KakaoMarker[]>([]);
  const [infoWindow, setInfoWindow] = useState<KakaoInfoWindow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const { toast } = useToast();

  // Kakao Maps API 로드 및 지도 초기화
  useEffect(() => {
    if (!KAKAO_MAPS_API_KEY) {
      toast({
        title: "카카오맵 API 키 오류",
        description: "카카오맵 API 키가 설정되지 않았습니다.",
        variant: "destructive"
      });
      return;
    }

    const initializeMap = () => {
      if (!window.kakao?.maps) return;

      window.kakao.maps.load(() => {
        if (!mapContainer.current) return;

        const options = {
          center: new window.kakao.maps.LatLng(center.latitude, center.longitude),
          level: 3, // 확대 레벨
        };

        const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
        setMap(kakaoMap);

        // 정보창 생성
        const kakaoInfoWindow = new window.kakao.maps.InfoWindow({
          zIndex: 1,
        });
        setInfoWindow(kakaoInfoWindow);

        setIsLoading(false);
        console.log('Kakao Maps 초기화 완료');
      });
    };

    // 이미 로드되어 있는 경우
    if (window.kakao?.maps) {
      initializeMap();
    } else {
      // 스크립트 동적 로드
      const script = document.createElement('script');
      script.async = true;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAPS_API_KEY}&libraries=services&autoload=false`;
      
      script.onload = initializeMap;
      script.onerror = () => {
        setIsLoading(false);
        toast({
          title: "지도 로드 실패",
          description: "카카오맵을 불러오는데 실패했습니다.",
          variant: "destructive"
        });
      };
      
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [KAKAO_MAPS_API_KEY, center.latitude, center.longitude, toast]);

  // 장소 마커 표시
  useEffect(() => {
    if (!map || !window.kakao?.maps) return;

    // 기존 마커 제거
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    if (places.length === 0) return;

    const newMarkers: KakaoMarker[] = [];

    places.forEach((place) => {
      const markerPosition = new window.kakao.maps.LatLng(
        place.location.latitude,
        place.location.longitude
      );

      // 장소 타입별 마커 이미지 설정
      const getMarkerImage = (type: string) => {
        const markerImageSrc = getMarkerImageSrc(type);
        const imageSize = new window.kakao.maps.Size(24, 35);
        const imageOption = { offset: new window.kakao.maps.Point(12, 35) };
        
        return new window.kakao.maps.MarkerImage(markerImageSrc, imageSize, imageOption);
      };

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: getMarkerImage(place.type),
        title: place.name
      });

      marker.setMap(map);

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        if (infoWindow) {
          const content = createInfoWindowContent(place);
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
          setSelectedPlace(place);
          onPlaceSelect?.(place);
        }
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // 모든 마커가 보이도록 지도 범위 조정
    if (places.length > 1) {
      const bounds = new window.kakao.maps.LatLngBounds();
      places.forEach(place => {
        bounds.extend(new window.kakao.maps.LatLng(place.location.latitude, place.location.longitude));
      });
      map.setBounds(bounds);
    } else if (places.length === 1) {
      map.setCenter(new window.kakao.maps.LatLng(places[0].location.latitude, places[0].location.longitude));
      map.setLevel(3);
    }
  }, [map, places, infoWindow, onPlaceSelect]);

  // 중심 위치 변경
  useEffect(() => {
    if (!map) return;
    
    const newCenter = new window.kakao.maps.LatLng(center.latitude, center.longitude);
    map.panTo(newCenter);
  }, [map, center.latitude, center.longitude]);

  // 마커 이미지 소스 반환
  const getMarkerImageSrc = (type: string): string => {
    const baseUrl = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
    
    switch (type) {
      case 'institute':
        return 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';
      case 'trainer':
        return 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';
      case 'clinic':
        return 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_blue.png';
      case 'shop':
        return 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_green.png';
      default:
        return baseUrl;
    }
  };

  // 정보창 콘텐츠 생성
  const createInfoWindowContent = (place: Place): string => {
    const typeLabel = getTypeLabel(place.type);
    const rating = place.rating ? `⭐ ${place.rating}` : '';
    const distance = place.distance ? `📍 ${(place.distance / 1000).toFixed(1)}km` : '';
    
    return `
      <div style="padding: 12px; min-width: 250px; font-family: 'Malgun Gothic', sans-serif;">
        <div style="font-weight: bold; font-size: 14px; margin-bottom: 6px; color: #333;">
          ${place.name}
        </div>
        <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
          ${typeLabel} ${rating} ${distance}
        </div>
        <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
          ${place.location.address || '주소 정보 없음'}
        </div>
        ${place.contact ? `<div style="font-size: 12px; color: #666; margin-bottom: 4px;">📞 ${place.contact}</div>` : ''}
        ${place.openingHours ? `<div style="font-size: 12px; color: #666; margin-bottom: 8px;">🕒 ${place.openingHours}</div>` : ''}
        <div style="text-align: center; margin-top: 8px;">
          <button 
            onclick="window.open('https://map.kakao.com/link/map/${place.name},${place.location.latitude},${place.location.longitude}', '_blank')"
            style="background: #FEE500; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">
            카카오맵에서 보기
          </button>
        </div>
      </div>
    `;
  };

  // 타입별 레이블 반환
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'institute':
        return '🎓 훈련소';
      case 'trainer':
        return '👨‍🏫 훈련사';
      case 'clinic':
        return '🏥 동물병원';
      case 'shop':
        return '🏪 용품점';
      case 'pension':
        return '🏨 펜션';
      case 'cafe':
        return '☕ 카페';
      case 'park':
        return '🌳 공원';
      default:
        return '📍 장소';
    }
  };

  // 현재 위치로 이동
  const moveToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const moveLatLon = new window.kakao.maps.LatLng(latitude, longitude);
          map?.panTo(moveLatLon);
          
          toast({
            title: "위치 이동 완료",
            description: "현재 위치로 지도를 이동했습니다.",
          });
        },
        (error) => {
          toast({
            title: "위치 정보 오류",
            description: "현재 위치를 가져올 수 없습니다.",
            variant: "destructive"
          });
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted rounded-lg ${className}`} 
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-sm text-muted-foreground">카카오맵을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* 지도 컨테이너 */}
      <div 
        ref={mapContainer} 
        className="w-full rounded-lg overflow-hidden" 
        style={{ height }}
      />
      
      {/* 지도 컨트롤 버튼들 */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={moveToCurrentLocation}
            className="bg-white/90 hover:bg-white shadow-md"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* 선택된 장소 정보 카드 */}
      {selectedPlace && (
        <Card className="absolute bottom-4 left-4 right-4 max-w-sm bg-white/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-sm">{selectedPlace.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {getTypeLabel(selectedPlace.type)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {selectedPlace.rating && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    {selectedPlace.rating}
                  </Badge>
                )}
                {selectedPlace.isCertified && (
                  <Badge variant="default" className="text-xs">
                    인증
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground mb-3">
              {selectedPlace.location.address}
            </div>
            
            <div className="flex gap-2">
              {selectedPlace.contact && (
                <Button size="sm" variant="outline" className="text-xs flex-1">
                  <Phone className="h-3 w-3 mr-1" />
                  전화
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs flex-1"
                onClick={() => {
                  const url = `https://map.kakao.com/link/map/${selectedPlace.name},${selectedPlace.location.latitude},${selectedPlace.location.longitude}`;
                  window.open(url, '_blank');
                }}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                카카오맵
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 범례 */}
      {places.length > 0 && (
        <Card className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="text-xs font-medium mb-2">범례</div>
            <div className="flex flex-col gap-1">
              {Array.from(new Set(places.map(p => p.type))).map(type => (
                <div key={type} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  {getTypeLabel(type)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KakaoMap;