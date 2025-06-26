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
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

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

    const map = L.map(mapRef.current).setView(center, zoom);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

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
          style={{ height, width: '100%' }}
          className="rounded-lg border border-gray-200 dark:border-gray-700"
        />
        
        {/* Map CSS for animations */}
        <style>{`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
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
                    
                    {location.distance && (
                      <div className="text-sm text-gray-500">
                        {location.distance < 1 ? 
                          `${Math.round(location.distance * 1000)}m` : 
                          `${location.distance.toFixed(1)}km`
                        }
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}