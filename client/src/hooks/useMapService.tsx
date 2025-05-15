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
  distance?: number; // 미터 단위
  photo?: string;
  contact?: string;
  openingHours?: string;
  description?: string;
  isCertified?: boolean; // 테일즈 인증 여부
  certificationDate?: string; // 인증 날짜
  certificationLevel?: 'standard' | 'premium' | 'exclusive'; // 인증 레벨
  petFriendlyLevel?: 'low' | 'medium' | 'high'; // 반려동물 친화도 (낮음, 중간, 높음)
  features?: string[]; // 장소 특징 (예: 야외좌석, 반려동물 전용공간, 반려동물 음료 등)
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
  searchNearbyPlaces: (type: 'institute' | 'trainer' | 'clinic' | 'shop' | 'pension' | 'cafe' | 'camping' | 'park' | 'pethotel', radius?: number) => Promise<void>;
  setSelectedPlace: (place: Place | null) => void;
  setSearchRadius: (radius: number) => void;
  setFilterOptions: (options: FilterOptions) => void;
  getDirections: (destination: Location) => Promise<any>;
  searchPlacesByKeyword: (keyword: string) => Promise<Place[]>;
  geocodeAddress: (address: string) => Promise<Location | null>;
  getFilteredPlaces: () => Place[];
}

// 기본 컨텍스트 생성
const MapServiceContext = createContext<MapServiceContextType | null>(null);

// 지도 서비스 제공자 컴포넌트
export function MapServiceProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchRadius, setSearchRadius] = useState(3000); // 기본 검색 반경 3km
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    certifiedOnly: false,
    petFriendlyLevel: null,
    features: []
  });

  // Kakao Maps API 로드
  useEffect(() => {
    if (typeof window === 'undefined' || isMapLoaded) return;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAPS_API_KEY}&libraries=services,clusterer,drawing&autoload=false`;
    
    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsMapLoaded(true);
        console.log('Kakao Maps API 로드 완료');
      });
    };
    
    script.onerror = () => {
      toast({
        title: "지도 서비스 로드 실패",
        description: "지도 서비스를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.",
        variant: "destructive"
      });
    };
    
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [toast]);

  // 사용자 위치 가져오기
  const getUserLocation = useCallback(async (): Promise<Location | null> => {
    setIsLoadingLocation(true);
    setSearchError(null);
    
    try {
      // Geolocation API를 사용하여 사용자 위치 가져오기
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
      
      const { latitude, longitude } = position.coords;
      const userLocation = { latitude, longitude };
      
      // 지오코딩으로 주소 변환 (API가 로드된 경우)
      if (isMapLoaded && window.kakao?.maps) {
        try {
          const geocoder = new window.kakao.maps.services.Geocoder();
          
          const result = await new Promise<any>((resolve, reject) => {
            geocoder.coord2Address(longitude, latitude, (result: any, status: any) => {
              if (status === window.kakao.maps.services.Status.OK) {
                resolve(result);
              } else {
                reject(new Error('주소 변환 실패'));
              }
            });
          });
          
          if (result && result[0]) {
            const address = result[0].address?.address_name || '';
            (userLocation as Location).address = address;
          }
        } catch (error) {
          console.error('주소 변환 중 오류:', error);
        }
      }
      
      setCurrentLocation(userLocation);
      setIsLoadingLocation(false);
      return userLocation;
    } catch (error: any) {
      console.error('위치 정보 가져오기 실패:', error);
      
      setIsLoadingLocation(false);
      setSearchError('위치 정보를 가져오는데 실패했습니다.');
      
      toast({
        title: "위치 정보 접근 실패",
        description: error.message || "위치 정보를 가져오는데 실패했습니다. 위치 접근 권한을 확인해주세요.",
        variant: "destructive"
      });
      
      return null;
    }
  }, [isMapLoaded, toast]);

  // 주변 장소 검색
  const searchNearbyPlaces = useCallback(async (
    type: 'institute' | 'trainer' | 'clinic' | 'shop' | 'pension' | 'cafe' | 'camping' | 'park' | 'pethotel',
    radius: number = searchRadius
  ) => {
    if (!isMapLoaded || !currentLocation) {
      toast({
        title: "검색 불가",
        description: "지도가 로드되지 않았거나 현재 위치를 알 수 없습니다.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      // 실제 API 호출 (서버에서 처리하는 방식으로 구현)
      const response = await fetch(`/api/places/nearby?type=${type}&lat=${currentLocation.latitude}&lng=${currentLocation.longitude}&radius=${radius}`);
      
      if (!response.ok) {
        throw new Error('장소 검색 실패');
      }
      
      const data = await response.json();
      
      // 결과 처리
      const places: Place[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        location: {
          latitude: item.latitude,
          longitude: item.longitude,
          address: item.address
        },
        type: item.type,
        rating: item.rating,
        distance: item.distance,
        photo: item.photo,
        contact: item.contact,
        openingHours: item.openingHours,
        description: item.description
      }));
      
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
  }, [currentLocation, isMapLoaded, searchRadius, toast]);

  // 키워드 기반 장소 검색
  const searchPlacesByKeyword = useCallback(async (keyword: string): Promise<Place[]> => {
    if (!isMapLoaded) {
      toast({
        title: "검색 불가",
        description: "지도 서비스가 아직 로드되지 않았습니다.",
        variant: "destructive"
      });
      return [];
    }
    
    try {
      // 실제 API 호출 (서버에서 처리하는 방식으로 구현)
      const response = await fetch(`/api/places/search?keyword=${encodeURIComponent(keyword)}`);
      
      if (!response.ok) {
        throw new Error('장소 검색 실패');
      }
      
      const data = await response.json();
      
      // 결과 처리
      const places: Place[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        location: {
          latitude: item.latitude,
          longitude: item.longitude,
          address: item.address
        },
        type: item.type,
        rating: item.rating,
        photo: item.photo,
        contact: item.contact,
        openingHours: item.openingHours,
        description: item.description
      }));
      
      return places;
    } catch (error) {
      console.error('장소 검색 실패:', error);
      
      toast({
        title: "검색 실패",
        description: "장소를 검색하는데 실패했습니다. 나중에 다시 시도해주세요.",
        variant: "destructive"
      });
      
      return [];
    }
  }, [isMapLoaded, toast]);

  // 주소 지오코딩 (주소 -> 좌표)
  const geocodeAddress = useCallback(async (address: string): Promise<Location | null> => {
    if (!isMapLoaded) {
      toast({
        title: "지오코딩 불가",
        description: "지도 서비스가 아직 로드되지 않았습니다.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      // 실제 API 호출 (서버에서 처리하는 방식으로 구현)
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
      
      if (!response.ok) {
        throw new Error('지오코딩 실패');
      }
      
      const data = await response.json();
      
      if (!data.latitude || !data.longitude) {
        throw new Error('유효한 좌표를 찾을 수 없습니다.');
      }
      
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address || address
      };
    } catch (error) {
      console.error('지오코딩 실패:', error);
      
      toast({
        title: "주소 변환 실패",
        description: "주소를 좌표로 변환하는데 실패했습니다.",
        variant: "destructive"
      });
      
      return null;
    }
  }, [isMapLoaded, toast]);

  // 길찾기 기능
  const getDirections = useCallback(async (destination: Location) => {
    if (!isMapLoaded || !currentLocation) {
      toast({
        title: "길찾기 불가",
        description: "지도가 로드되지 않았거나 현재 위치를 알 수 없습니다.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      // 실제 API 호출 (서버에서 처리하는 방식으로 구현)
      const response = await fetch('/api/directions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          origin: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
          },
          destination: {
            latitude: destination.latitude,
            longitude: destination.longitude
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('길찾기 실패');
      }
      
      return await response.json();
    } catch (error) {
      console.error('길찾기 실패:', error);
      
      toast({
        title: "길찾기 실패",
        description: "길찾기 정보를 가져오는데 실패했습니다.",
        variant: "destructive"
      });
      
      return null;
    }
  }, [currentLocation, isMapLoaded, toast]);

  // 필터링된 장소 목록 반환
  const getFilteredPlaces = useCallback(() => {
    if (!filterOptions.certifiedOnly && !filterOptions.petFriendlyLevel && filterOptions.features?.length === 0) {
      return nearbyPlaces; // 필터링 옵션이 없으면 모든 장소 반환
    }
    
    return nearbyPlaces.filter(place => {
      // 인증 필터
      if (filterOptions.certifiedOnly && !place.isCertified) {
        return false;
      }
      
      // 반려동물 친화도 필터
      if (filterOptions.petFriendlyLevel && place.petFriendlyLevel !== filterOptions.petFriendlyLevel) {
        return false;
      }
      
      // 특징 필터
      if (filterOptions.features && filterOptions.features.length > 0) {
        // 장소에 특징이 없거나, 선택한 특징 중 하나라도 없으면 필터링
        if (!place.features || !filterOptions.features.some(feature => place.features?.includes(feature))) {
          return false;
        }
      }
      
      return true;
    });
  }, [nearbyPlaces, filterOptions]);
  
  return (
    <MapServiceContext.Provider
      value={{
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
        getDirections,
        searchPlacesByKeyword,
        geocodeAddress,
        getFilteredPlaces
      }}
    >
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