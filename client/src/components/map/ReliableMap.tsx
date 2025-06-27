import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Clock, Star, Search, Navigation, Filter } from 'lucide-react';

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
}

interface ReliableMapProps {
  locations: LocationData[];
  height?: string;
  onLocationClick?: (location: LocationData) => void;
}

export function ReliableMap({ locations, height = "400px", onLocationClick }: ReliableMapProps) {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [showMapView, setShowMapView] = useState(false);

  // Seoul center coordinates
  const seoulCenter = { lat: 37.5665, lng: 126.9780 };

  const getLocationTypeColor = (type: string) => {
    const colors = {
      'training-center': '#2BAA61',
      'pet-store': '#FFA726',
      'veterinary': '#E74D3C',
      'event': '#29B5F6'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  const getLocationTypeLabel = (type: string) => {
    const labels = {
      'training-center': '훈련소',
      'pet-store': '펫샵',
      'veterinary': '동물병원',
      'event': '이벤트'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
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

  const handleLocationClick = (location: LocationData) => {
    console.log('위치 클릭:', location.name);
    setSelectedLocationId(location.id === selectedLocationId ? null : location.id);
    onLocationClick?.(location);
  };

  // Create Google Maps embed URL for the area
  const createMapUrl = () => {
    const markers = locations.map(loc => `${loc.lat},${loc.lng}`).join('|');
    return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dw7BzKRAg8Y2Jw&center=${seoulCenter.lat},${seoulCenter.lng}&zoom=11&maptype=roadmap`;
  };

  return (
    <div className="space-y-4">
      {/* Map View Toggle - Always Visible */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          위치 찾기
        </h2>
        <button
          onClick={() => setShowMapView(!showMapView)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 font-medium"
        >
          <Navigation className="w-4 h-4" />
          {showMapView ? '목록 보기' : '지도 보기'}
        </button>
      </div>



      {/* Map Container with Interactive Location List */}
      <Card>
        <CardContent className="p-0">
          <div style={{ height, overflow: 'hidden', borderRadius: '8px' }}>
            {showMapView ? (
              /* Real Map View */
              <div className="h-full relative">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dw7BzKRAg8Y2Jw&q=pet+services+seoul+korea&center=37.5665,126.9780&zoom=11`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                {/* Overlay with location markers */}
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 max-w-xs">
                  <h4 className="font-semibold text-sm mb-2">주변 업체 ({locations.length}개)</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {locations.slice(0, 5).map(location => (
                      <div
                        key={location.id}
                        className="text-xs p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
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
              /* Interactive Location List */
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
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                          selectedLocationId === location.id 
                            ? 'border-blue-400 bg-blue-50' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                        onClick={() => handleLocationClick(location)}
                      >
                        <div className="flex items-start space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                            style={{ backgroundColor: getLocationTypeColor(location.type) }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-900 truncate">{location.name}</h4>
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                {getLocationTypeLabel(location.type)}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{distance.toFixed(1)}km</span>
                              {location.rating && (
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 text-yellow-400 mr-1" />
                                  <span>{location.rating}</span>
                                </div>
                              )}
                            </div>
                            
                            {selectedLocationId === location.id && (
                              <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                                {location.phone && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {location.phone}
                                  </div>
                                )}
                                {location.hours && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {location.hours}
                                  </div>
                                )}
                                {location.description && (
                                  <p className="text-sm text-gray-700 mt-2">{location.description}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}