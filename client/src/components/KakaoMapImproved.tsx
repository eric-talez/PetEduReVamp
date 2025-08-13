import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Phone, Clock, Star, ExternalLink } from 'lucide-react';
import type { Place, Location } from '@/hooks/useMapService';
import MapFallback from './MapFallback';

interface KakaoMapProps {
  center?: Location;
  places?: Place[];
  onPlaceSelect?: (place: Place) => void;
  height?: string;
  showControls?: boolean;
  className?: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}

const KAKAO_MAPS_API_KEY = import.meta.env.VITE_KAKAO_MAPS_API_KEY;

export const KakaoMapImproved: React.FC<KakaoMapProps> = ({
  center = { latitude: 37.5665, longitude: 126.978 }, // 기본값: 서울 시청
  places = [],
  onPlaceSelect,
  height = "400px",
  showControls = true,
  className = ""
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infoWindow, setInfoWindow] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 카카오맵 API 로드 및 지도 초기화
  useEffect(() => {
    if (!KAKAO_MAPS_API_KEY) {
      console.log('카카오맵 API 키가 없습니다. 폴백 모드로 전환합니다.');
      setIsLoading(false);
      setHasError(true);
      return;
    }

    const initializeMap = () => {
      if (!mapContainer.current || !window.kakao?.maps) return;

      try {
        // Kakao Maps API 로드
        window.kakao.maps.load(() => {
          console.log('Kakao Maps SDK 로드 대기 중...');
          
          const options = {
            center: new window.kakao.maps.LatLng(center.latitude, center.longitude),
            level: 3
          };

          const kakaoMap = new window.kakao.maps.Map(mapContainer.current!, options);
          setMap(kakaoMap);

          // 인포윈도우 생성
          const kakaoInfoWindow = new window.kakao.maps.InfoWindow({
            zIndex: 1,
          });
          setInfoWindow(kakaoInfoWindow);

          setIsLoading(false);
          console.log('카카오맵 초기화 성공');
        });
      } catch (error) {
        console.error('카카오맵 초기화 실패:', error);
        setIsLoading(false);
        setHasError(true);
        setErrorMessage('카카오맵 초기화에 실패했습니다.');
      }
    };

    // 스크립트가 이미 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      initializeMap();
      return;
    }

    // 스크립트 로드
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAPS_API_KEY}&libraries=services,clusterer,drawing&autoload=false`;
    
    script.onload = () => {
      console.log('카카오맵 스크립트 로드 완료');
      setTimeout(initializeMap, 100);
    };

    script.onerror = () => {
      console.error('카카오맵 API 로드 실패');
      setIsLoading(false);
      setHasError(true);
      setErrorMessage('카카오맵 스크립트 로드에 실패했습니다.');
    };

    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 정리
      try {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      } catch (e) {
        // 이미 제거된 경우 무시
      }
    };
  }, [center.latitude, center.longitude]);

  // 마커 업데이트
  useEffect(() => {
    if (!map || !window.kakao?.maps) return;

    // 기존 마커 제거
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    // 새로운 마커 생성
    const newMarkers = places.map(place => {
      const markerPosition = new window.kakao.maps.LatLng(
        place.location.latitude,
        place.location.longitude
      );

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        title: place.name
      });

      marker.setMap(map);

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        if (infoWindow) {
          const content = createInfoWindowContent(place);
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
        }
        
        setSelectedPlace(place);
        if (onPlaceSelect) {
          onPlaceSelect(place);
        }
      });

      return marker;
    });

    setMarkers(newMarkers);

    // 모든 마커를 포함하는 영역으로 지도 조정
    if (newMarkers.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      places.forEach(place => {
        bounds.extend(new window.kakao.maps.LatLng(
          place.location.latitude,
          place.location.longitude
        ));
      });
      map.setBounds(bounds);
    }
  }, [map, places, infoWindow, onPlaceSelect]);

  // 인포윈도우 내용 생성
  const createInfoWindowContent = (place: Place): string => {
    return `
      <div style="padding: 12px; min-width: 200px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #2BAA61;">
          ${place.name}
        </div>
        <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
          ${place.location.address || '주소 정보 없음'}
        </div>
        ${place.contact ? `<div style="font-size: 12px; color: #666; margin-bottom: 4px;">📞 ${place.contact}</div>` : ''}
        ${place.rating ? `<div style="font-size: 12px; color: #666; margin-bottom: 8px;">⭐ ${place.rating}/5.0</div>` : ''}
        <div style="text-align: center;">
          <button onclick="window.open('https://map.kakao.com/link/map/${place.name},${place.location.latitude},${place.location.longitude}', '_blank')" 
                  style="background: #2BAA61; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer;">
            카카오맵에서 보기
          </button>
        </div>
      </div>
    `;
  };

  // 현재 위치로 이동
  const moveToCurrentLocation = () => {
    if (!map) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
          map.setCenter(moveLatLng);
        },
        (error) => {
          console.error('위치 정보를 가져오는데 실패했습니다:', error);
        }
      );
    }
  };

  // 에러 발생 시 폴백 컴포넌트 표시
  if (hasError || !KAKAO_MAPS_API_KEY) {
    return (
      <div className={className}>
        <MapFallback 
          places={places}
          center={center}
          height={height}
          errorMessage={errorMessage}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapContainer}
        style={{ width: '100%', height }}
        className="rounded-lg overflow-hidden border shadow-sm"
      />
      
      {/* 지도 컨트롤 */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <Button
            onClick={moveToCurrentLocation}
            size="sm"
            variant="outline"
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">지도를 불러오는 중...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KakaoMapImproved;