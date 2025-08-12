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
  type: 'institute' | 'trainer' | 'clinic' | 'shop' | 'pension' | 'cafe' | 'camping' | 'park' | 'pethotel';
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
      const response = await fetch(
        `/api/locations/nearby?type=${type}&lat=${currentLocation.latitude}&lng=${currentLocation.longitude}&radius=${radius}`
      );
      
      if (!response.ok) {
        throw new Error('장소 검색 실패');
      }
      
      const places = await response.json();
      setNearbyPlaces(places);
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