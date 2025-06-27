import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

// Fix for default markers
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
}

interface SimpleMapProps {
  locations: LocationData[];
  height?: string;
  onLocationClick?: (location: LocationData) => void;
}

export function SimpleMap({ locations, height = "400px", onLocationClick }: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    console.log('지도 초기화 중...');

    // Wait for container to be ready
    setTimeout(() => {
      if (!mapRef.current) return;

      // Create map with Seoul center
      const map = L.map(mapRef.current, {
        center: [37.5665, 126.9780],
        zoom: 11,
        zoomControl: true,
        attributionControl: true,
        preferCanvas: false
      });

      // Add multiple tile layer options for better reliability
      const tileOptions = {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        crossOrigin: true
      };

      // Try OpenStreetMap first
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', tileOptions);
      
      // Fallback to alternative tile server
      const altLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', tileOptions);
      
      osmLayer.on('tileerror', () => {
        console.log('OpenStreetMap 타일 오류, 대체 서버 사용');
        map.removeLayer(osmLayer);
        altLayer.addTo(map);
      });

      osmLayer.addTo(map);
      mapInstanceRef.current = map;

      // Force map resize after initialization
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          console.log('지도 크기 재조정 완료');
        }
      }, 100);

    // Add markers for locations
    locations.forEach(location => {
      const marker = L.marker([location.lat, location.lng]).addTo(map);
      
      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold">${location.name}</h3>
          <p class="text-sm text-gray-600">${location.address}</p>
          ${location.phone ? `<p class="text-sm">${location.phone}</p>` : ''}
          ${location.hours ? `<p class="text-sm">운영시간: ${location.hours}</p>` : ''}
        </div>
      `);

      marker.on('click', () => {
        console.log('위치 클릭:', location.name);
        onLocationClick?.(location);
      });
    });

    // Fit map to show all markers
    if (locations.length > 0) {
      const group = new L.FeatureGroup(locations.map(loc => L.marker([loc.lat, loc.lng])));
      map.fitBounds(group.getBounds().pad(0.1));
    }

    console.log('지도 초기화 완료');

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations, onLocationClick]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        height, 
        width: '100%',
        minHeight: height
      }}
      className="rounded-lg border overflow-hidden"
    />
  );
}