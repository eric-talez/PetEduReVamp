// 실제 카카오맵 API를 사용한 위치 검색 서비스

export interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  category_group_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string; // 경도
  y: string; // 위도
  place_url: string;
  distance?: string;
}

export interface PlaceSearchResult {
  id: string;
  name: string;
  type: 'clinic' | 'shop' | 'pension' | 'cafe' | 'camping' | 'park' | 'pethotel' | 'trainer' | 'institute';
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  rating?: number;
  description?: string;
  certification?: boolean;
  distance?: number;
  sourceUrl?: string;
  features?: string[];
}

export class KakaoLocationService {
  
  /**
   * 키워드로 장소 검색
   */
  static async searchByKeyword(
    keyword: string, 
    options: {
      page?: number;
      size?: number;
      category?: string;
      x?: number; // 경도 (중심좌표)
      y?: number; // 위도 (중심좌표)
      radius?: number; // 검색 반경(미터)
      sort?: 'accuracy' | 'distance';
    } = {}
  ): Promise<PlaceSearchResult[]> {
    
    const params = new URLSearchParams({
      search: keyword,
      ...options
    } as any);

    try {
      const response = await fetch(`/api/locations?${params}`);
      
      if (!response.ok) {
        throw new Error(`검색 실패: ${response.status}`);
      }

      const places = await response.json();
      return places;
    } catch (error) {
      console.error('장소 검색 오류:', error);
      throw error;
    }
  }

  /**
   * 카테고리별 장소 검색
   */
  static async searchByCategory(
    category: string,
    options: {
      x?: number;
      y?: number;
      radius?: number;
      page?: number;
      size?: number;
    } = {}
  ): Promise<PlaceSearchResult[]> {
    
    // 카테고리에 맞는 검색어 매핑
    const categoryKeywords: { [key: string]: string } = {
      'clinic': '동물병원',
      'shop': '반려동물용품',
      'pension': '펜션 애견',
      'cafe': '애견카페',
      'camping': '애견캠핑',
      'park': '공원',
      'pethotel': '애견호텔',
      'trainer': '애견훈련소',
      'institute': '애견학원'
    };

    const keyword = categoryKeywords[category] || category;
    return this.searchByKeyword(keyword, options);
  }

  /**
   * 주소를 좌표로 변환
   */
  static async geocodeAddress(address: string): Promise<{latitude: number, longitude: number} | null> {
    try {
      const response = await fetch(`/api/locations/geocode?address=${encodeURIComponent(address)}`);
      
      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return {
        latitude: parseFloat(result.y),
        longitude: parseFloat(result.x)
      };
    } catch (error) {
      console.error('주소 지오코딩 오류:', error);
      return null;
    }
  }

  /**
   * 현재 위치 주변 장소 검색
   */
  static async searchNearby(
    latitude: number,
    longitude: number,
    category?: string,
    radius: number = 3000
  ): Promise<PlaceSearchResult[]> {
    
    const keyword = category ? this.getCategoryKeyword(category) : '반려동물';
    
    return this.searchByKeyword(keyword, {
      x: longitude,
      y: latitude,
      radius,
      sort: 'distance',
      size: 15
    });
  }

  /**
   * 카테고리 키워드 변환
   */
  private static getCategoryKeyword(category: string): string {
    const keywords: { [key: string]: string } = {
      'clinic': '동물병원',
      'shop': '반려동물용품',
      'pension': '펜션 애견',
      'cafe': '애견카페',
      'camping': '애견캠핑장',
      'park': '애견공원',
      'pethotel': '애견호텔',
      'trainer': '애견훈련소',
      'institute': '반려동물교육'
    };
    
    return keywords[category] || '반려동물';
  }

  /**
   * 카카오맵 링크 생성
   */
  static createKakaoMapLink(place: PlaceSearchResult): string {
    return `https://map.kakao.com/link/map/${place.name},${place.latitude},${place.longitude}`;
  }

  /**
   * 길찾기 링크 생성
   */
  static createDirectionsLink(place: PlaceSearchResult, from?: {lat: number, lng: number, name?: string}): string {
    if (from) {
      return `https://map.kakao.com/link/from/${from.name || '현재위치'},${from.lat},${from.lng}/to/${place.name},${place.latitude},${place.longitude}`;
    }
    return `https://map.kakao.com/link/to/${place.name},${place.latitude},${place.longitude}`;
  }

  /**
   * 검색 결과 필터링
   */
  static filterResults(
    places: PlaceSearchResult[], 
    filters: {
      certifiedOnly?: boolean;
      minRating?: number;
      maxDistance?: number;
      petFriendlyLevel?: 'low' | 'medium' | 'high';
      features?: string[];
    }
  ): PlaceSearchResult[] {
    return places.filter(place => {
      // 인증 필터
      if (filters.certifiedOnly && !place.certification) {
        return false;
      }

      // 평점 필터
      if (filters.minRating && place.rating && place.rating < filters.minRating) {
        return false;
      }

      // 거리 필터
      if (filters.maxDistance && place.distance && place.distance > filters.maxDistance) {
        return false;
      }

      // 기능 필터
      if (filters.features && filters.features.length > 0) {
        const placeFeatures = place.features || [];
        const hasRequiredFeature = filters.features.some(feature => 
          placeFeatures.includes(feature)
        );
        if (!hasRequiredFeature) {
          return false;
        }
      }

      return true;
    });
  }
}