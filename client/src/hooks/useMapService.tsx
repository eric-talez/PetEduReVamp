import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// 지도 서비스 API 키가 있는지 확인
const KAKAO_MAPS_API_KEY = import.meta.env.VITE_KAKAO_MAPS_API_KEY;

// 위치 타입 정의
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// 장소 정보 타입 정의
export interface Place {
  id: string;
  name: string;
  location: Location;
  type: 'institute' | 'trainer' | 'clinic' | 'shop' | 'pension' | 'cafe' | 'camping' | 'park' | 'pethotel' | 'grooming' | 'restaurant';
  rating?: number;
  distance?: number;
  photo?: string;
  contact?: string;
  openingHours?: string;
  description?: string;
  isCertified?: boolean;
  certificationDate?: string;
  certificationLevel?: 'standard' | 'premium' | 'exclusive';
  petFriendlyLevel?: 'low' | 'medium' | 'high';
  features?: string[];
}

// 필터링 옵션 타입 정의
export interface FilterOptions {
  certifiedOnly?: boolean;
  petFriendlyLevel?: 'low' | 'medium' | 'high' | null;
  features?: string[];
}

// 지도 서비스 컨텍스트 타입 정의
interface MapServiceContextType {
  currentLocation: Location | null;
  isLoadingLocation: boolean;
  isMapLoaded: boolean;
  nearbyPlaces: Place[];
  selectedPlace: Place | null;
  searchRadius: number;
  isSearching: boolean;
  searchError: string | null;
  filterOptions: FilterOptions;
  getUserLocation: () => Promise<Location | null>;
  searchNearbyPlaces: (type: Place['type'], radius?: number) => Promise<void>;
  setSelectedPlace: (place: Place | null) => void;
  setSearchRadius: (radius: number) => void;
  setFilterOptions: (options: FilterOptions) => void;
  setNearbyPlaces: (places: Place[]) => void;
}

// 기본값
const defaultContext: MapServiceContextType = {
  currentLocation: null,
  isLoadingLocation: false,
  isMapLoaded: false,
  nearbyPlaces: [],
  selectedPlace: null,
  searchRadius: 3000,
  isSearching: false,
  searchError: null,
  filterOptions: {},
  getUserLocation: async () => null,
  searchNearbyPlaces: async () => {},
  setSelectedPlace: () => {},
  setSearchRadius: () => {},
  setFilterOptions: () => {},
  setNearbyPlaces: () => {},
};

// 컨텍스트 생성
const MapServiceContext = createContext<MapServiceContextType>(defaultContext);

// 지도 서비스 프로바이더
export function MapServiceProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchRadius, setSearchRadius] = useState(3000);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    certifiedOnly: false,
    petFriendlyLevel: null,
    features: []
  });

  const { toast } = useToast();

  // Kakao Maps API 로드
  useEffect(() => {
    if (typeof window === 'undefined' || isMapLoaded) return;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAPS_API_KEY}&libraries=services,clusterer,drawing&autoload=false`;
    
    script.onload = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => {
          setIsMapLoaded(true);
          console.log('Kakao Maps API 로드 완료');
        });
      }
    };
    
    script.onerror = () => {
      console.error('Kakao Maps API 로드 실패');
    };
    
    document.head.appendChild(script);
    
    return () => {
      try {
        document.head.removeChild(script);
      } catch (e) {
        // 스크립트가 이미 제거된 경우 무시
      }
    };
  }, []);

  // 사용자 위치 가져오기
  const getUserLocation = useCallback(async (): Promise<Location | null> => {
    setIsLoadingLocation(true);
    setSearchError(null);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
      
      const { latitude, longitude } = position.coords;
      const userLocation = { latitude, longitude };
      
      setCurrentLocation(userLocation);
      setIsLoadingLocation(false);
      return userLocation;
    } catch (error: any) {
      console.error('위치 정보 가져오기 실패:', error);
      setIsLoadingLocation(false);
      setSearchError('위치 정보를 가져오는데 실패했습니다.');
      
      toast({
        title: "위치 정보 접근 실패",
        description: "위치 정보를 가져오는데 실패했습니다. 위치 접근 권한을 확인해주세요.",
        variant: "destructive"
      });
      
      return null;
    }
  }, [toast]);

  // 주변 장소 검색
  const searchNearbyPlaces = useCallback(async (
    type: Place['type'],
    radius: number = searchRadius
  ) => {
    if (!currentLocation) {
      toast({
        title: "검색 불가",
        description: "현재 위치를 알 수 없습니다.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      // 타입별 Pet Facilities API 필터 매핑
      const petFacilityTypeMap: Record<string, string | null> = {
        'clinic': 'hospital',
        'cafe': 'cafe',
        'park': 'park',
        'pethotel': 'hotel',
        'institute': 'training',
        'grooming': 'grooming',
        'restaurant': 'restaurant',
        'shop': null, // shop은 Pet Facilities에 없음
        'trainer': null, // trainer는 TALEZ 전용
        'pension': null, // pension은 Pet Facilities에 없음
      };

      // 병렬로 두 API 호출
      const [talezResponse, petFacilitiesResponse] = await Promise.all([
        // TALEZ 데이터 (trainers, institutes)
        fetch(
          `/api/locations/nearby?type=${type}&lat=${currentLocation.latitude}&lng=${currentLocation.longitude}&radius=${radius}`
        ).catch(() => null),
        
        // Pet Facilities 데이터
        petFacilityTypeMap[type] 
          ? fetch(`/api/pet-facilities?type=${petFacilityTypeMap[type]}`).catch(() => null)
          : null
      ]);

      let allPlaces: Place[] = [];

      // TALEZ 데이터 처리
      if (talezResponse && talezResponse.ok) {
        const talezPlaces = await talezResponse.json();
        allPlaces = talezPlaces;
      }

      // Pet Facilities 데이터 처리 및 병합
      if (petFacilitiesResponse && petFacilitiesResponse.ok) {
        const petFacilitiesData = await petFacilitiesResponse.json();
        
        if (petFacilitiesData.success && Array.isArray(petFacilitiesData.facilities)) {
          const petFacilityPlaces: Place[] = petFacilitiesData.facilities.map((facility: any) => {
            // 거리 계산 (Haversine formula)
            const R = 6371e3; // 지구 반지름 (미터)
            const φ1 = currentLocation.latitude * Math.PI / 180;
            const φ2 = parseFloat(facility.latitude) * Math.PI / 180;
            const Δφ = (parseFloat(facility.latitude) - currentLocation.latitude) * Math.PI / 180;
            const Δλ = (parseFloat(facility.longitude) - currentLocation.longitude) * Math.PI / 180;
            
            const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                      Math.cos(φ1) * Math.cos(φ2) *
                      Math.sin(Δλ/2) * Math.sin(Δλ/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c;

            return {
              id: `pet-facility-${facility.id}`,
              name: facility.name,
              location: {
                latitude: parseFloat(facility.latitude),
                longitude: parseFloat(facility.longitude),
                address: facility.address
              },
              type: type,
              rating: facility.rating ? parseFloat(facility.rating) : undefined,
              distance: Math.round(distance),
              contact: facility.phone,
              description: facility.district ? `${facility.city} ${facility.district}` : facility.city,
              isCertified: false,
              petFriendlyLevel: 'high' as const,
              features: []
            };
          });

          // 반경 내의 시설만 필터링
          const nearbyPetFacilities = petFacilityPlaces.filter(place => 
            place.distance && place.distance <= radius
          );

          allPlaces = [...allPlaces, ...nearbyPetFacilities];
        }
      }

      // 거리순 정렬
      allPlaces.sort((a, b) => (a.distance || 999999) - (b.distance || 999999));

      setNearbyPlaces(allPlaces);
      setIsSearching(false);
    } catch (error) {
      console.error('주변 장소 검색 실패:', error);
      setIsSearching(false);
      setSearchError('주변 장소를 검색하는데 실패했습니다.');
      
      toast({
        title: "검색 실패",
        description: "주변 장소를 검색하는데 실패했습니다. 나중에 다시 시도해주세요.",
        variant: "destructive"
      });
    }
  }, [currentLocation, searchRadius, toast]);
  
  const contextValue = {
    currentLocation,
    isLoadingLocation,
    isMapLoaded,
    nearbyPlaces,
    selectedPlace,
    searchRadius,
    isSearching,
    searchError,
    filterOptions,
    getUserLocation,
    searchNearbyPlaces,
    setSelectedPlace,
    setSearchRadius,
    setFilterOptions,
    setNearbyPlaces,
  };

  return (
    <MapServiceContext.Provider value={contextValue}>
      {children}
    </MapServiceContext.Provider>
  );
}

// 지도 서비스 훅
export function useMapService() {
  const context = useContext(MapServiceContext);
  
  if (!context) {
    throw new Error('useMapService must be used within a MapServiceProvider');
  }
  
  return context;
}