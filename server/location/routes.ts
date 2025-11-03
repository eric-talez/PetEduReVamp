import { Router } from 'express';

const router = Router();

// 카카오 API 키
const KAKAO_REST_API_KEY = process.env.VITE_KAKAO_MAPS_API_KEY;

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

// 위치/장소 검색 API
router.get('/locations', async (req, res) => {
  const { search } = req.query;
  
  if (!search || typeof search !== 'string') {
    return res.status(400).json({ error: '검색어가 필요합니다.' });
  }

  if (!KAKAO_REST_API_KEY) {
    console.error('KAKAO_REST_API_KEY가 설정되지 않음');
    return res.status(500).json({ error: '카카오 API 키가 설정되지 않았습니다.' });
  }

  try {
    const params = new URLSearchParams({
      query: search,
      page: '1',
      size: '15',
      sort: 'accuracy'
    });

    const response = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?${params}`, {
      headers: {
        'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`카카오 API 오류: ${response.status} ${response.statusText}`);
    }

    const data: KakaoSearchResponse = await response.json();
    
    // 카카오 장소 데이터를 앱 형식으로 변환
    const places = data.documents.map(place => ({
      id: place.id,
      name: place.place_name,
      type: getCategoryType(place.category_group_code, place.category_name),
      latitude: parseFloat(place.y),
      longitude: parseFloat(place.x),
      address: place.road_address_name || place.address_name,
      phone: place.phone || '',
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0 랜덤 평점
      description: place.category_name,
      certification: Math.random() > 0.7, // 30% 확률로 인증
      distance: place.distance ? parseInt(place.distance) : undefined,
      sourceUrl: place.place_url
    }));

    console.log(`[위치 API] 검색어: "${search}", 결과: ${places.length}개`);
    res.json(places);
    
  } catch (error) {
    console.error('장소 검색 오류:', error);
    res.status(500).json({ 
      error: '장소 검색에 실패했습니다.',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// 통합 장소 검색 API (query 기반)
router.get('/locations/search', async (req, res) => {
  const { query, lat, lng } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: '검색어가 필요합니다.' });
  }

  if (!KAKAO_REST_API_KEY) {
    console.error('KAKAO_REST_API_KEY가 설정되지 않음');
    return res.status(500).json({ error: '카카오 API 키가 설정되지 않았습니다.' });
  }

  try {
    const params = new URLSearchParams({
      query: query,
      page: '1',
      size: '15',
      sort: lat && lng ? 'distance' : 'accuracy'
    });

    if (lat && lng) {
      params.append('x', lng as string);
      params.append('y', lat as string);
    }

    const response = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?${params}`, {
      headers: {
        'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`카카오 API 오류: ${response.status} ${response.statusText}`);
    }

    const data: KakaoSearchResponse = await response.json();
    
    const places = data.documents.map(place => ({
      id: place.id,
      name: place.place_name,
      type: getCategoryType(place.category_group_code, place.category_name),
      latitude: parseFloat(place.y),
      longitude: parseFloat(place.x),
      address: place.road_address_name || place.address_name,
      phone: place.phone || '',
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      description: place.category_name,
      certification: Math.random() > 0.7,
      distance: place.distance ? parseInt(place.distance) : undefined,
      sourceUrl: place.place_url
    }));

    console.log(`[장소 검색 API] 검색어: "${query}", 결과: ${places.length}개`);
    res.json(places);
    
  } catch (error) {
    console.error('장소 검색 오류:', error);
    res.status(500).json({ 
      error: '장소 검색에 실패했습니다.',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// 카테고리별 근처 장소 검색 API
router.get('/locations/nearby', async (req, res) => {
  const { type, lat, lng, radius = '3000' } = req.query;
  
  if (!type || !lat || !lng) {
    return res.status(400).json({ error: '타입, 위도, 경도가 필요합니다.' });
  }

  if (!KAKAO_REST_API_KEY) {
    return res.status(500).json({ error: '카카오 API 키가 설정되지 않았습니다.' });
  }

  try {
    // 타입별 키워드 매핑
    const typeKeywords: Record<string, string> = {
      'clinic': '동물병원',
      'shop': '애완동물용품',
      'cafe': '애견카페',
      'pension': '애견펜션',
      'park': '강아지놀이터',
      'trainer': '애견훈련',
      'institute': '애견훈련소',
      'event': '반려동물',
      'pethotel': '애견호텔'
    };

    const keyword = typeKeywords[type as string] || type;
    
    const params = new URLSearchParams({
      query: keyword,
      x: lng as string,
      y: lat as string,
      radius: radius as string,
      page: '1',
      size: '15',
      sort: 'distance'
    });

    const response = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?${params}`, {
      headers: {
        'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`카카오 API 오류: ${response.status} ${response.statusText}`);
    }

    const data: KakaoSearchResponse = await response.json();
    
    const places = data.documents.map(place => ({
      id: place.id,
      name: place.place_name,
      type: getCategoryType(place.category_group_code, place.category_name),
      latitude: parseFloat(place.y),
      longitude: parseFloat(place.x),
      address: place.road_address_name || place.address_name,
      phone: place.phone || '',
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      description: place.category_name,
      certification: Math.random() > 0.7,
      distance: place.distance ? parseInt(place.distance) : undefined,
      sourceUrl: place.place_url
    }));

    console.log(`[근처 장소 API] 타입: ${type}, 결과: ${places.length}개`);
    res.json(places);
    
  } catch (error) {
    console.error('근처 장소 검색 오류:', error);
    res.status(500).json({ 
      error: '근처 장소 검색에 실패했습니다.',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// 카카오 카테고리를 앱 타입으로 매핑
function getCategoryType(groupCode: string, categoryName: string): string {
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
      return 'shop';
    case 'CE7': // 카페
      return 'cafe';
    case 'AT4': // 관광명소
      return 'event';
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
        return 'event';
      }
      return 'shop';
  }
}

export default router;