import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

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
}

interface WorkingMapProps {
  locations: LocationData[];
  height?: string;
  onLocationClick?: (location: LocationData) => void;
}

export function WorkingMap({ locations, height = "400px", onLocationClick }: WorkingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    console.log('지도 초기화 시작...');

    // Initialize map after a brief delay to ensure container is ready
    const timer = setTimeout(() => {
      if (!mapRef.current) return;

      try {
        // Create map instance
        const map = L.map(mapRef.current, {
          center: [37.5665, 126.9780], // Seoul center
          zoom: 11,
          zoomControl: true,
          attributionControl: true
        });

        console.log('지도 객체 생성 완료');

        // Add tile layer with error handling
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        });

        tileLayer.on('loading', () => console.log('타일 로딩 시작'));
        tileLayer.on('load', () => console.log('타일 로딩 완료'));
        tileLayer.on('tileerror', (e) => console.error('타일 에러:', e));

        tileLayer.addTo(map);
        mapInstanceRef.current = map;

        // Add markers for each location
        locations.forEach(location => {
          const marker = L.marker([location.lat, location.lng]).addTo(map);
          
          // Create popup content
          const popupContent = `
            <div style="font-family: system-ui, sans-serif;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${location.name}</h3>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #666;">${location.address}</p>
              ${location.phone ? `<p style="margin: 0 0 4px 0; font-size: 14px;">📞 ${location.phone}</p>` : ''}
              ${location.hours ? `<p style="margin: 0 0 4px 0; font-size: 14px;">🕒 ${location.hours}</p>` : ''}
              ${location.rating ? `<p style="margin: 0; font-size: 14px;">⭐ ${location.rating}</p>` : ''}
            </div>
          `;

          marker.bindPopup(popupContent);

          // Handle marker click
          marker.on('click', () => {
            console.log('마커 클릭:', location.name);
            onLocationClick?.(location);
          });
        });

        // Fit bounds to show all markers if locations exist
        if (locations.length > 0) {
          const group = new L.FeatureGroup(locations.map(loc => L.marker([loc.lat, loc.lng])));
          map.fitBounds(group.getBounds(), { padding: [20, 20] });
        }

        // Force resize after initialization
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
            console.log('지도 크기 조정 완료');
          }
        }, 100);

        console.log('지도 초기화 완료');

      } catch (error) {
        console.error('지도 초기화 오류:', error);
      }
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations, onLocationClick]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ 
          height,
          width: '100%',
          minHeight: height,
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#f1f5f9'
        }}
        className="border border-gray-200"
      />
      {/* Loading indicator */}
      <div 
        className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ 
          display: mapInstanceRef.current ? 'none' : 'flex',
          zIndex: 1000
        }}
      >
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">지도를 불러오는 중...</p>
        </div>
      </div>
    </div>
  );
}