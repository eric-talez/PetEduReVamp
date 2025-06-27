import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Star, Navigation, Calendar } from 'lucide-react';

interface LocationData {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: 'hospital' | 'training' | 'grooming' | 'hotel' | 'cafe' | 'park' | 'training-center' | 'pet-store' | 'veterinary' | 'event';
  phone?: string;
  hours?: string;
  rating?: number;
  description?: string;
  services?: string[];
}

interface NaverMapProps {
  locations: any[];
  height?: string;
  onLocationClick?: (location: any) => void;
  onReservationClick?: (location: any) => void;
}

// 위치 타입별 한글 라벨
const getLocationTypeLabel = (type: LocationData['type']): string => {
  const typeLabels = {
    hospital: '동물병원',
    training: '훈련소',
    grooming: '미용실',
    hotel: '호텔',
    cafe: '펫카페',
    park: '공원',
    'training-center': '훈련센터',
    'pet-store': '펫샵',
    'veterinary': '동물병원',
    'event': '이벤트'
  };
  return typeLabels[type as keyof typeof typeLabels] || type;
};

// 위치 타입별 색상
const getLocationTypeColor = (type: LocationData['type']): string => {
  const typeColors = {
    hospital: '#e74c3c',
    training: '#3498db', 
    grooming: '#9b59b6',
    hotel: '#e67e22',
    cafe: '#f39c12',
    park: '#27ae60',
    'training-center': '#3498db',
    'pet-store': '#f39c12',
    'veterinary': '#e74c3c',
    'event': '#9b59b6'
  };
  return typeColors[type as keyof typeof typeColors] || '#95a5a6';
};

export function NaverMap({ locations, height = "400px", onLocationClick, onReservationClick }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [naverMap, setNaverMap] = useState<any>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [showMapView, setShowMapView] = useState(false);

  // Seoul center coordinates
  const seoulCenter = { lat: 37.5665, lng: 126.9780 };

  // 네이버 지도 초기화
  useEffect(() => {
    if (!showMapView || !mapRef.current) return;

    // 네이버 지도 API 로드
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID || 'YOUR_CLIENT_ID'}`;
    script.onload = () => {
      if (window.naver && window.naver.maps) {
        const mapOptions = {
          center: new window.naver.maps.LatLng(seoulCenter.lat, seoulCenter.lng),
          zoom: 11,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: window.naver.maps.MapTypeControlStyle.BUTTON,
            position: window.naver.maps.Position.TOP_RIGHT
          },
          zoomControl: true,
          zoomControlOptions: {
            style: window.naver.maps.ZoomControlStyle.SMALL,
            position: window.naver.maps.Position.RIGHT_CENTER
          }
        };

        const map = new window.naver.maps.Map(mapRef.current, mapOptions);
        setNaverMap(map);

        // 마커 추가
        locations.forEach(location => {
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(location.lat, location.lng),
            map: map,
            title: location.name,
            icon: {
              content: `<div style="
                background: ${getLocationTypeColor(location.type)};
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
                white-space: nowrap;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              ">${location.name}</div>`,
              size: new window.naver.maps.Size(22, 35),
              anchor: new window.naver.maps.Point(11, 35)
            }
          });

          // 마커 클릭 이벤트
          window.naver.maps.Event.addListener(marker, 'click', () => {
            handleLocationClick(location);
          });
        });
      }
    };
    
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [showMapView, locations]);

  const handleLocationClick = (location: LocationData) => {
    console.log('위치 클릭:', location.name);
    setSelectedLocationId(location.id === selectedLocationId ? null : location.id);
    onLocationClick?.(location);
  };

  const handleReservationClick = (location: LocationData) => {
    onReservationClick?.(location);
  };

  // 거리 계산 함수
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number): number => {
    return value * Math.PI / 180;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            펫 서비스 위치
          </CardTitle>
          <Button
            onClick={() => setShowMapView(!showMapView)}
            variant={showMapView ? "default" : "outline"}
            className={showMapView ? 
              "bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600" : 
              "border-blue-500 text-blue-500 hover:bg-blue-50"
            }
          >
            <Navigation className="h-4 w-4 mr-2" />
            {showMapView ? '목록 보기' : '지도 보기'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ height }} className="relative">
          {showMapView ? (
            /* 네이버 지도 뷰 */
            <div className="h-full relative">
              <div ref={mapRef} className="w-full h-full" />
              
              {/* 지도 위 정보 패널 */}
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
                <h4 className="font-semibold text-sm mb-2">주변 업체 ({locations.length}개)</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {locations.slice(0, 5).map(location => (
                    <div
                      key={location.id}
                      className="text-xs p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleLocationClick(location)}
                    >
                      <div className="font-medium">{location.name}</div>
                      <div className="text-gray-600">{getLocationTypeLabel(location.type)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* 위치 목록 뷰 */
            <div className="h-full bg-gradient-to-br from-blue-50 to-green-50 p-4 overflow-y-auto">
              <div className="text-center mb-4">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-800">서울 펫 서비스 위치</h3>
                <p className="text-sm text-gray-600">{locations.length}개 장소</p>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {locations.map(location => {
                  const distance = calculateDistance(
                    seoulCenter.lat, seoulCenter.lng, 
                    location.lat, location.lng
                  );
                  
                  return (
                    <div
                      key={location.id}
                      className={`bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-all cursor-pointer ${
                        selectedLocationId === location.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => handleLocationClick(location)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{location.name}</h4>
                          <span 
                            className="inline-block px-2 py-1 rounded text-xs font-medium text-white mt-1"
                            style={{ backgroundColor: getLocationTypeColor(location.type) }}
                          >
                            {getLocationTypeLabel(location.type)}
                          </span>
                        </div>
                        {location.rating && (
                          <div className="flex items-center text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm ml-1">{location.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                      <p className="text-xs text-gray-500 mb-3">
                        중심가에서 약 {distance.toFixed(1)}km
                      </p>
                      
                      {location.description && (
                        <p className="text-sm text-gray-700 mb-3">{location.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3">
                          {location.phone && (
                            <div className="flex items-center text-gray-600">
                              <Phone className="h-3 w-3 mr-1" />
                              <span className="text-xs">{location.phone}</span>
                            </div>
                          )}
                          {location.hours && (
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-3 w-3 mr-1" />
                              <span className="text-xs">{location.hours}</span>
                            </div>
                          )}
                        </div>
                        
                        {(location.type === 'hospital' || location.type === 'training' || location.type === 'veterinary' || location.type === 'training-center') && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 py-1 h-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReservationClick(location);
                            }}
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            예약
                          </Button>
                        )}
                      </div>
                      
                      {selectedLocationId === location.id && location.services && (
                        <div className="mt-3 pt-3 border-t">
                          <h5 className="text-sm font-medium text-gray-800 mb-2">제공 서비스</h5>
                          <div className="flex flex-wrap gap-1">
                            {location.services.map((service, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// 전역 타입 선언
declare global {
  interface Window {
    naver: any;
  }
}