import type { Place, Location } from '@/hooks/useMapService';

interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  category_group_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string; // longitude
  y: string; // latitude
  place_url: string;
  distance: string;
}

interface KakaoSearchResponse {
  documents: KakaoPlace[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_MAPS_API_KEY;

export class KakaoMapService {
  private readonly baseUrl = 'https://dapi.kakao.com/v2/local';

  // 키워드로 장소 검색
  async searchByKeyword(
    query: string,
    options?: {
      x?: number; // longitude
      y?: number; // latitude
      radius?: number;
      page?: number;
      size?: number;
      sort?: 'accuracy' | 'distance';
      category_group_code?: string;
    }
  ): Promise<Place[]> {
    if (!KAKAO_REST_API_KEY) {
      throw new Error('카카오 API 키가 설정되지 않았습니다.');
    }

    try {
      const params = new URLSearchParams({
        query,
        page: (options?.page || 1).toString(),
        size: (options?.size || 15).toString(),
        sort: options?.sort || 'accuracy'
      });

      if (options?.x && options?.y) {
        params.append('x', options.x.toString());
        params.append('y', options.y.toString());
      }

      if (options?.radius) {
        params.append('radius', options.radius.toString());
      }

      if (options?.category_group_code) {
        params.append('category_group_code', options.category_group_code);
      }

      const response = await fetch(`${this.baseUrl}/search/keyword.json?${params}`, {
        headers: {
          'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`카카오 API 오류: ${response.status} ${response.statusText}`);
      }

      const data: KakaoSearchResponse = await response.json();
      return this.convertKakaoPlacesToPlaces(data.documents);
    } catch (error) {
      console.error('카카오 장소 검색 오류:', error);
      throw error;
    }
  }

  // 카테고리별 장소 검색
  async searchByCategory(
    categoryCode: string,
    location: Location,
    options?: {
      radius?: number;
      page?: number;
      size?: number;
      sort?: 'accuracy' | 'distance';
    }
  ): Promise<Place[]> {
    if (!KAKAO_REST_API_KEY) {
      throw new Error('카카오 API 키가 설정되지 않았습니다.');
    }

    try {
      const params = new URLSearchParams({
        category_group_code: categoryCode,
        x: location.longitude.toString(),
        y: location.latitude.toString(),
        radius: (options?.radius || 3000).toString(),
        page: (options?.page || 1).toString(),
        size: (options?.size || 15).toString(),
        sort: options?.sort || 'distance'
      });

      const response = await fetch(`${this.baseUrl}/search/category.json?${params}`, {
        headers: {
          'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`카카오 API 오류: ${response.status} ${response.statusText}`);
      }

      const data: KakaoSearchResponse = await response.json();
      return this.convertKakaoPlacesToPlaces(data.documents);
    } catch (error) {
      console.error('카카오 카테고리 검색 오류:', error);
      throw error;
    }
  }

  // 주소로 좌표 검색
  async addressToCoordinates(address: string): Promise<Location | null> {
    if (!KAKAO_REST_API_KEY) {
      throw new Error('카카오 API 키가 설정되지 않았습니다.');
    }

    try {
      const params = new URLSearchParams({
        query: address
      });

      const response = await fetch(`${this.baseUrl}/search/address.json?${params}`, {
        headers: {
          'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`카카오 API 오류: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.documents && data.documents.length > 0) {
        const doc = data.documents[0];
        return {
          latitude: parseFloat(doc.y),
          longitude: parseFloat(doc.x),
          address: doc.address_name
        };
      }
      return null;
    } catch (error) {
      console.error('카카오 주소 검색 오류:', error);
      throw error;
    }
  }

  // 카카오 장소 데이터를 내부 Place 형식으로 변환
  private convertKakaoPlacesToPlaces(kakaoPlaces: KakaoPlace[]): Place[] {
    return kakaoPlaces.map(place => ({
      id: place.id,
      name: place.place_name,
      type: this.getCategoryType(place.category_group_code, place.category_name),
      location: {
        latitude: parseFloat(place.y),
        longitude: parseFloat(place.x),
        address: place.road_address_name || place.address_name
      },
      contact: place.phone || undefined,
      distance: place.distance ? parseInt(place.distance) : undefined,
      rating: Math.random() * 2 + 3, // 임시 평점 (카카오 API에서 평점을 제공하지 않음)
      isCertified: Math.random() > 0.7, // 임시 인증 상태
      sourceUrl: place.place_url,
      category: place.category_name
    }));
  }

  // 카카오 카테고리를 내부 타입으로 매핑
  private getCategoryType(groupCode: string, categoryName: string): Place['type'] {
    // 카카오 카테고리 그룹 코드 매핑
    switch (groupCode) {
      case 'HP8': // 병원
        return 'clinic';
      case 'MT1': // 대형마트
      case 'CS2': // 편의점
        return 'shop';
      case 'AD5': // 숙박
        return 'pension';
      case 'FD6': // 음식점
        if (categoryName.includes('카페') || categoryName.includes('커피')) {
          return 'cafe';
        }
        return 'restaurant';
      case 'CE7': // 카페
        return 'cafe';
      case 'AT4': // 관광명소
        return 'park';
      default:
        // 키워드 기반 분류
        if (categoryName.includes('동물병원') || categoryName.includes('수의')) {
          return 'clinic';
        } else if (categoryName.includes('훈련') || categoryName.includes('애견')) {
          return 'trainer';
        } else if (categoryName.includes('펜션') || categoryName.includes('호텔')) {
          return 'pension';
        } else if (categoryName.includes('카페') || categoryName.includes('커피')) {
          return 'cafe';
        } else if (categoryName.includes('공원')) {
          return 'park';
        }
        return 'shop'; // 기본값을 valid type으로 설정
    }
  }

  // 애완동물 관련 카테고리 코드들
  static readonly PET_CATEGORIES = {
    ANIMAL_HOSPITAL: 'HP8', // 병원 > 동물병원
    PET_SHOP: 'MT1', // 대형마트 (펫샵 포함)
    CAFE: 'CE7', // 카페 (애견카페 등)
    PENSION: 'AD5', // 숙박업소 (펜션 등)
    PARK: 'AT4' // 관광명소 (공원 등)
  };

  // 애완동물 친화적 장소 검색을 위한 키워드들
  static readonly PET_KEYWORDS = {
    ANIMAL_HOSPITAL: '동물병원',
    TRAINER: '애견훈련',
    PET_SHOP: '애완동물용품',
    PENSION: '애견펜션',
    CAFE: '애견카페',
    PARK: '강아지놀이터'
  };
}

export const kakaoMapService = new KakaoMapService();