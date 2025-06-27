import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Phone, Clock, Star } from 'lucide-react';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LocationData {
  id: string;
  name: string;
  type: 'training-center' | 'pet-store' | 'veterinary' | 'event';
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  rating?: number;
  hours?: string;
  description?: string;
  distance?: number;
}

interface LocationMapProps {
  locations?: LocationData[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  showLocationList?: boolean;
  onLocationSelect?: (location: LocationData) => void;
}

export function LocationMap({ 
  locations = [], 
  center = [37.5665, 126.9780], // Seoul coordinates
  zoom = 12,
  height = "400px",
  showLocationList = true,
  onLocationSelect 
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Custom icons for different location types
  const getLocationIcon = (type: string) => {
    const iconColors = {
      'training-center': '#2BAA61',
      'pet-store': '#FFA726', 
      'veterinary': '#E74D3C',
      'event': '#29B5F6'
    };

    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="
        background-color: ${iconColors[type as keyof typeof iconColors] || '#6B7280'};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    console.log('지도 초기화 시작...');

    // Delay initialization to ensure container is properly sized
    const initMap = () => {
      try {
        console.log('지도 컨테이너 생성 중...');
        const map = L.map(mapRef.current!, {
          center: center,
          zoom: zoom,
          zoomControl: true,
          attributionControl: true,
          preferCanvas: false
        });
        
        console.log('타일 레이어 추가 중...');
        // Add tile layer with error handling
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
          crossOrigin: true
        });
        
        tileLayer.on('tileerror', (e) => {
          console.error('타일 로드 오류:', e);
        });
        
        tileLayer.on('tileloadstart', () => {
          console.log('타일 로드 시작');
        });
        
        tileLayer.on('tileload', () => {
          console.log('타일 로드 완료');
        });
        
        tileLayer.addTo(map);

        mapInstanceRef.current = map;
        console.log('지도 초기화 완료');

        // Force resize to fix display issues
        setTimeout(() => {
          if (mapInstanceRef.current) {
            console.log('지도 크기 조정 중...');
            mapInstanceRef.current.invalidateSize();
          }
        }, 200);
      } catch (error) {
        console.error('지도 초기화 오류:', error);
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      setTimeout(initMap, 100);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setUserLocation(coords);
          
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView(coords, 15);
            
            // Add user location marker
            L.marker(coords, {
              icon: L.divIcon({
                className: 'user-location-icon',
                html: `<div style="
                  background-color: #3B82F6;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
                  animation: pulse 2s infinite;
                "></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })
            }).addTo(mapInstanceRef.current);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Add locations to map
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    locations.forEach(location => {
      const marker = L.marker([location.lat, location.lng], {
        icon: getLocationIcon(location.type)
      }).addTo(mapInstanceRef.current!);

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold;">${location.name}</h3>
          <p style="margin: 4px 0; color: #666;">${location.address}</p>
          ${location.phone ? `<p style="margin: 4px 0;"><strong>전화:</strong> ${location.phone}</p>` : ''}
          ${location.hours ? `<p style="margin: 4px 0;"><strong>운영시간:</strong> ${location.hours}</p>` : ''}
          ${location.rating ? `<p style="margin: 4px 0;"><strong>평점:</strong> ⭐ ${location.rating}/5</p>` : ''}
        </div>
      `);

      marker.on('click', () => {
        setSelectedLocation(location);
        onLocationSelect?.(location);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (locations.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [locations, onLocationSelect]);

  const getLocationTypeLabel = (type: string) => {
    const labels = {
      'training-center': '훈련소',
      'pet-store': '펫샵',
      'veterinary': '동물병원',
      'event': '이벤트'
    };
    return labels[type as keyof typeof labels] || type;
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get locations with distances if user location is available
  const locationsWithDistance = userLocation 
    ? locations.map(location => ({
        ...location,
        distance: calculateDistance(userLocation[0], userLocation[1], location.lat, location.lng)
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0))
    : locations;

  const getLocationTypeBadgeColor = (type: string) => {
    const colors = {
      'training-center': 'bg-green-100 text-green-800',
      'pet-store': 'bg-orange-100 text-orange-800',
      'veterinary': 'bg-red-100 text-red-800',
      'event': 'bg-blue-100 text-blue-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="w-full space-y-4">
      {/* Map Controls */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">주변 위치</h3>
        <Button onClick={getUserLocation} variant="outline" size="sm">
          <Navigation className="w-4 h-4 mr-2" />
          내 위치 찾기
        </Button>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div 
          ref={mapRef} 
          style={{ 
            height, 
            width: '100%',
            minHeight: '400px',
            backgroundColor: '#f8f9fa'
          }}
          className="rounded-lg border border-gray-200 dark:border-gray-700 leaflet-container"
        />
        
        {/* Loading indicator */}
        {!mapInstanceRef.current && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">지도를 불러오는 중...</p>
            </div>
          </div>
        )}
        
        {/* Map CSS for animations */}
        <style>{`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          }
          
          .leaflet-container {
            background: #f8f9fa !important;
          }
        `}</style>
      </div>

      {/* Location List */}
      {showLocationList && locations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">주변 장소 ({locations.length}개)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    selectedLocation?.id === location.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => {
                    setSelectedLocation(location);
                    onLocationSelect?.(location);
                    
                    // Center map on selected location
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.setView([location.lat, location.lng], 16);
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{location.name}</h4>
                        <Badge className={getLocationTypeBadgeColor(location.type)}>
                          {getLocationTypeLabel(location.type)}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{location.address}</span>
                        </div>
                        
                        {location.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{location.phone}</span>
                          </div>
                        )}
                        
                        {location.hours && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{location.hours}</span>
                          </div>
                        )}
                        
                        {location.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{location.rating}/5</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {location.distance && (
                        <div className="text-sm font-medium text-primary">
                          {location.distance < 1 
                            ? `${Math.round(location.distance * 1000)}m`
                            : `${location.distance.toFixed(1)}km`
                          }
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {location.description && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {location.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {showLocationList && locations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">표시할 위치가 없습니다.</p>
            <p className="text-sm text-gray-400 mt-1">
              내 위치를 설정하면 주변 장소를 찾을 수 있습니다.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}