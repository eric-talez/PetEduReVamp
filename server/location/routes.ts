import { Request, Response, Express } from 'express';
import { z } from 'zod';
import { storage } from '../storage';

// Kakao Maps API 키 검증
if (!process.env.KAKAO_MAPS_API_KEY) {
  console.warn('KAKAO_MAPS_API_KEY 환경 변수가 설정되지 않았습니다. 위치 기반 서비스 기능이 제한됩니다.');
}

// 위치 스키마 정의
const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

// 필터 옵션 스키마
const filterOptionsSchema = z.object({
  certifiedOnly: z.string().optional().transform(val => val === 'true'),
  petFriendlyLevel: z.enum(['low', 'medium', 'high']).optional().nullable(),
  features: z.string().optional().transform(val => val ? val.split(',') : []),
});

// 근처 장소 검색 파라미터 스키마
const nearbySearchParamsSchema = z.object({
  lat: z.string().transform(Number),
  lng: z.string().transform(Number),
  type: z.enum(['institute', 'trainer', 'clinic', 'shop', 'pension', 'cafe', 'camping', 'park', 'pethotel']),
  radius: z.string().transform(Number).optional().default('3000'),
  certifiedOnly: z.string().optional().transform(val => val === 'true'),
  petFriendlyLevel: z.enum(['low', 'medium', 'high']).optional().nullable(),
  features: z.string().optional().transform(val => val ? val.split(',') : []),
});

// 키워드 검색 파라미터 스키마
const keywordSearchParamsSchema = z.object({
  keyword: z.string().min(1),
  page: z.string().transform(Number).optional().default('1'),
  size: z.string().transform(Number).optional().default('15'),
});

// 지오코딩 파라미터 스키마
const geocodeParamsSchema = z.object({
  address: z.string().min(1),
});

// 길찾기 요청 스키마
const directionsRequestSchema = z.object({
  origin: locationSchema,
  destination: locationSchema,
  waypoints: z.array(locationSchema).optional(),
});

// 위치 관련 라우트 등록
export function registerLocationRoutes(app: Express) {
  // 관리자가 등록한 위치들을 일반 사용자가 검색할 수 있도록 연동
  app.get("/api/locations/search", async (req, res) => {
    try {
      const { keyword, type, certification } = req.query;

      // 관리자 등록 위치와 일반 검색 결과 통합
      const adminLocationsResponse = await fetch(`${process.env.BASE_URL || 'http://localhost:5000'}/api/admin/locations`);
      let adminLocations = [];

      if (adminLocationsResponse.ok) {
        const adminData = await adminLocationsResponse.json();
        adminLocations = adminData.success ? adminData.locations : [];
      }

      // 활성 상태이고 승인된 위치만 필터링
      let filteredLocations = adminLocations.filter(location => 
        location.status === 'active' && location.adminApproved
      );

      // 키워드 검색
      if (keyword) {
        filteredLocations = filteredLocations.filter(location =>
          location.name.toLowerCase().includes(keyword.toString().toLowerCase()) ||
          location.address.toLowerCase().includes(keyword.toString().toLowerCase()) ||
          location.description.toLowerCase().includes(keyword.toString().toLowerCase())
        );
      }

      // 타입 필터
      if (type && type !== 'all') {
        filteredLocations = filteredLocations.filter(location => location.type === type);
      }

      // 인증 필터
      if (certification === 'true') {
        filteredLocations = filteredLocations.filter(location => location.certification);
      }

      res.json({
        success: true,
        locations: filteredLocations,
        total: filteredLocations.length
      });
    } catch (error) {
      console.error('위치 검색 오류:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  });
  // 1. 근처 장소 검색 API
  app.get('/api/places/nearby', async (req: Request, res: Response) => {
    try {
      const { lat, lng, type, radius } = nearbySearchParamsSchema.parse(req.query);

      // 파라미터에서 필터 옵션 추출
      const { certifiedOnly, petFriendlyLevel, features } = req.query;

      // 데이터베이스에서 데이터 가져오기 시도
      let results: Array<{
        id: string;
        name: string;
        type: string;
        location: {
          latitude: number;
          longitude: number;
          address: string;
        };
        contact: string | null;
        distance: number;
        photo: string | null;
        description: string;
        isCertified?: boolean;
        certificationDate?: string;
        certificationLevel?: 'standard' | 'premium' | 'exclusive';
        petFriendlyLevel?: 'low' | 'medium' | 'high';
        features?: string[];
      }> = [];

      if (type === 'institute') {
        // 기관 데이터 가져오기
        const institutes = await storage.getAllInstitutes();
        results = institutes.map(institute => ({
          id: `institute_${institute.id}`,
          name: institute.name,
          type: 'institute',
          location: {
            latitude: institute.latitude || 37.5665, // 기본값: 서울 중심
            longitude: institute.longitude || 126.9780,
            address: institute.address || '',
          },
          contact: institute.phone || null,
          distance: calculateDistance(lat, lng, institute.latitude || 37.5665, institute.longitude || 126.9780),
          photo: institute.logo || null,
          description: institute.description || '',
          isCertified: institute.isVerified || false,
          certificationDate: institute.verifiedAt ? new Date(institute.verifiedAt).toLocaleDateString() : undefined,
          certificationLevel: institute.certLevel || 'standard',
        }));
      } else if (type === 'trainer') {
        // 트레이너 데이터 가져오기
        const trainers = await storage.getAllTrainers();
        results = trainers.map(trainer => ({
          id: `trainer_${trainer.id}`,
          name: trainer.name,
          type: 'trainer',
          location: {
            latitude: trainer.latitude || 37.5665, // 기본값: 서울 중심
            longitude: trainer.longitude || 126.9780,
            address: trainer.address || '',
          },
          contact: trainer.phone || null,
          distance: calculateDistance(lat, lng, trainer.latitude || 37.5665, trainer.longitude || 126.9780),
          photo: trainer.photo || null,
          description: trainer.bio || '',
          isCertified: trainer.isVerified || false,
          certificationDate: trainer.verifiedAt ? new Date(trainer.verifiedAt).toLocaleDateString() : undefined,
          certificationLevel: trainer.certLevel || 'standard',
        }));
      } else {
        // 그 외의 경우 샘플 데이터 반환
        console.warn(`외부 API 키가 없어 ${type} 유형에 대한 샘플 데이터를 반환합니다.`);
        // 빈 배열 반환 (실제 구현 시 API 키 필요)
        results = [];
      }

      // 샘플 데이터를 위한 장소별 특징과 반려동물 친화도 추가
      results.forEach(place => {
        // 장소 유형에 따라 적절한 특징과 친화도 할당
        if (place.type === 'cafe') {
          place.features = ['야외좌석', '반려동물 음료', '반려동물 간식'].filter(() => Math.random() > 0.3);
          place.petFriendlyLevel = Math.random() > 0.7 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low';
        } else if (place.type === 'pension' || place.type === 'camping') {
          place.features = ['넓은 공간', '반려동물 전용공간', '주차장'].filter(() => Math.random() > 0.3);
          place.petFriendlyLevel = Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low';
        } else if (place.type === 'shop') {
          place.features = ['반려동물 용품', '반려동물 간식', '주차장'].filter(() => Math.random() > 0.3);
          place.petFriendlyLevel = Math.random() > 0.5 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low';
        } else {
          place.features = ['주차장', '실내좌석'].filter(() => Math.random() > 0.4);
          place.petFriendlyLevel = Math.random() > 0.5 ? 'medium' : Math.random() > 0.3 ? 'low' : 'high';
        }
      });

      // 필터링 추가
      results = results
        // 거리 필터
        .filter(place => place.distance <= radius)
        // 인증 필터
        .filter(place => certifiedOnly === 'true' ? place.isCertified === true : true)
        // 반려동물 친화도 필터
        .filter(place => {
          if (!petFriendlyLevel) return true;
          return place.petFriendlyLevel === petFriendlyLevel;
        })
        // 특징 필터
        .filter(place => {
          if (!features || (features as string).length === 0) return true;
          const featureList = (features as string).split(',');
          if (featureList.length === 0) return true;
          return featureList.some(feature => place.features?.includes(feature));
        })
        // 거리 기준 정렬
        .sort((a, b) => a.distance - b.distance);

      // 결과 반환
      res.status(200).json(results);
    } catch (error) {
      console.error('근처 장소 검색 처리 중 오류:', error);
      res.status(400).json({ error: '잘못된 요청 형식입니다.' });
    }
  });

  // 2. 키워드 기반 장소 검색 API
  app.get('/api/places/search', async (req: Request, res: Response) => {
    try {
      const { keyword, page, size } = keywordSearchParamsSchema.parse(req.query);

      // 검색 구현 - 트레이너와 기관 데이터에서 검색
      let results: Array<{
        id: string;
        name: string;
        type: string;
        location: {
          latitude: number;
          longitude: number;
          address: string;
        };
        contact: string | null;
        photo: string | null;
        description: string;
      }> = [];

      // 트레이너 데이터 검색
      const trainers = await storage.getAllTrainers();
      const matchedTrainers = trainers
        .filter(trainer => 
          trainer.name.includes(keyword) || 
          (trainer.bio && trainer.bio.includes(keyword)) ||
          (trainer.specialties && trainer.specialties.includes(keyword))
        )
        .map(trainer => ({
          id: `trainer_${trainer.id}`,
          name: trainer.name,
          type: 'trainer',
          location: {
            latitude: trainer.latitude || 37.5665,
            longitude: trainer.longitude || 126.9780,
            address: trainer.address || '',
          },
          contact: trainer.phone || null,
          photo: trainer.photo || null,
          description: trainer.bio || '',
        }));

      // 기관 데이터 검색
      const institutes = await storage.getAllInstitutes();
      const matchedInstitutes = institutes
        .filter(institute => 
          institute.name.includes(keyword) || 
          (institute.description && institute.description.includes(keyword))
        )
        .map(institute => ({
          id: `institute_${institute.id}`,
          name: institute.name,
          type: 'institute',
          location: {
            latitude: institute.latitude || 37.5665,
            longitude: institute.longitude || 126.9780,
            address: institute.address || '',
          },
          contact: institute.phone || null,
          photo: institute.logo || null,
          description: institute.description || '',
        }));

      // 결과 병합
      results = [...matchedTrainers, ...matchedInstitutes];

      // 페이지네이션
      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const paginatedResults = results.slice(startIndex, endIndex);

      // 결과 반환
      res.status(200).json({
        meta: {
          total_count: results.length,
          pageable_count: Math.min(results.length, size),
          is_end: endIndex >= results.length,
          current_page: page,
        },
        places: paginatedResults,
      });
    } catch (error) {
      console.error('키워드 검색 처리 중 오류:', error);
      res.status(400).json({ error: '잘못된 요청 형식입니다.' });
    }
  });

  // 3. 주소 지오코딩 API (주소 -> 좌표)
  app.get('/api/geocode', async (req: Request, res: Response) => {
    try {
      const { address } = geocodeParamsSchema.parse(req.query);

      // 참고: 실제 구현에는 Kakao API 또는 다른 지오코딩 서비스 필요
      // 현재는 샘플 응답 반환
      if (!process.env.KAKAO_MAPS_API_KEY) {
        console.warn('지오코딩 API 키가 없어 기본 데이터를 반환합니다.');

        // 기본 응답 (서울 시청)
        res.status(200).json({
          latitude: 37.5665,
          longitude: 126.9780,
          address: address,
          road_address: address,
        });
        return;
      }

      // API 키가 있으면 실제 구현 필요
      res.status(501).json({ error: '기능 구현 중입니다.' });
    } catch (error) {
      console.error('지오코딩 처리 중 오류:', error);
      res.status(400).json({ error: '잘못된 요청 형식입니다.' });
    }
  });

  // 4. 길찾기 API
  app.post('/api/directions', async (req: Request, res: Response) => {
    try {
      const { origin, destination } = directionsRequestSchema.parse(req.body);

      // 거리 계산
      const distance = calculateDistance(
        origin.latitude, origin.longitude,
        destination.latitude, destination.longitude
      );

      // 결과 반환
      res.status(200).json({
        distance: {
          value: distance,
          text: `${Math.round(distance / 1000)} km`
        },
        duration: {
          value: Math.round(distance / 13.8), // 평균 이동 속도 50km/h 가정 (13.8m/s)
          text: `${Math.round(distance / 13.8 / 60)} 분`
        },
        route: [
          [origin.longitude, origin.latitude],
          [destination.longitude, destination.latitude]
        ]
      });
    } catch (error) {
      console.error('길찾기 처리 중 오류:', error);
      res.status(400).json({ error: '잘못된 요청 형식입니다.' });
    }
  });
}

// 두 좌표 사이의 거리 계산 (Haversine 공식)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // 지구 반경 (미터)
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 미터 단위 거리
}