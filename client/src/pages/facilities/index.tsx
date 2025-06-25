import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Star, 
  Phone, 
  Clock, 
  Car,
  Coffee,
  Home,
  Building,
  Search,
  Filter,
  Navigation
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Facility {
  id: number;
  name: string;
  type: 'training' | 'cafe' | 'pension' | 'hospital' | 'grooming';
  description: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  distance: number;
  operatingHours: {
    open: string;
    close: string;
  };
  amenities: string[];
  images: string[];
  services: string[];
  priceRange: string;
  isPartner: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const { toast } = useToast();

  // 샘플 시설 데이터
  const sampleFacilities: Facility[] = [
    {
      id: 1,
      name: '서울 펫 트레이닝 센터',
      type: 'training',
      description: '전문 반려견 훈련 및 행동 교정 전문 시설입니다.',
      address: '서울시 강남구 테헤란로 123',
      phone: '02-123-4567',
      rating: 4.8,
      reviewCount: 156,
      distance: 0.8,
      operatingHours: { open: '09:00', close: '19:00' },
      amenities: ['주차장', '실내훈련장', '야외운동장', 'CCTV'],
      images: ['https://images.unsplash.com/photo-1544568100-847a948585b9?w=400'],
      services: ['기본 순종 훈련', '행동 교정', '사회화 훈련', '어질리티'],
      priceRange: '50,000원 - 150,000원',
      isPartner: true,
      coordinates: { lat: 37.5665, lng: 126.9780 }
    },
    {
      id: 2,
      name: '해피독 카페',
      type: 'cafe',
      description: '반려견과 함께 즐길 수 있는 아늑한 카페입니다.',
      address: '서울시 홍대입구역 근처',
      phone: '02-234-5678',
      rating: 4.5,
      reviewCount: 89,
      distance: 1.2,
      operatingHours: { open: '10:00', close: '22:00' },
      amenities: ['반려견 놀이터', 'Wi-Fi', '주차장', '테라스'],
      images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400'],
      services: ['반려견 메뉴', '생일파티', '사진촬영', '놀이시설'],
      priceRange: '8,000원 - 25,000원',
      isPartner: true,
      coordinates: { lat: 37.5563, lng: 126.9236 }
    },
    {
      id: 3,
      name: '펫 리조트 펜션',
      type: 'pension',
      description: '반려견과 함께 머물 수 있는 프리미엄 펜션입니다.',
      address: '경기도 가평군 청평면',
      phone: '031-345-6789',
      rating: 4.9,
      reviewCount: 234,
      distance: 45.6,
      operatingHours: { open: '15:00', close: '11:00' },
      amenities: ['개별 정원', '수영장', '바베큐장', '산책로'],
      images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400'],
      services: ['숙박', '반려견 용품 대여', '산책 서비스', '케어 서비스'],
      priceRange: '120,000원 - 300,000원',
      isPartner: false,
      coordinates: { lat: 37.7556, lng: 127.4306 }
    },
    {
      id: 4,
      name: '24시 반려동물 병원',
      type: 'hospital',
      description: '24시간 응급 진료가 가능한 반려동물 전문 병원입니다.',
      address: '서울시 서초구 반포대로 45',
      phone: '02-456-7890',
      rating: 4.7,
      reviewCount: 312,
      distance: 2.3,
      operatingHours: { open: '24시간', close: '24시간' },
      amenities: ['응급실', 'CT/MRI', '입원실', '주차장'],
      images: ['https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400'],
      services: ['응급 진료', '건강검진', '수술', '입원 치료'],
      priceRange: '30,000원 - 500,000원',
      isPartner: true,
      coordinates: { lat: 37.5047, lng: 127.0051 }
    },
    {
      id: 5,
      name: '프리미엄 펫 그루밍',
      type: 'grooming',
      description: '전문 그루머가 제공하는 프리미엄 미용 서비스입니다.',
      address: '서울시 마포구 연남동 123-45',
      phone: '02-567-8901',
      rating: 4.6,
      reviewCount: 178,
      distance: 3.1,
      operatingHours: { open: '09:30', close: '20:00' },
      amenities: ['개별 미용실', '스파', '네일케어', '주차 가능'],
      images: ['https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400'],
      services: ['기본 미용', '스타일링', '스파', '네일 케어'],
      priceRange: '25,000원 - 80,000원',
      isPartner: true,
      coordinates: { lat: 37.5636, lng: 126.9253 }
    }
  ];

  useEffect(() => {
    loadFacilities();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    filterAndSortFacilities();
  }, [facilities, searchTerm, typeFilter, sortBy, userLocation]);

  const loadFacilities = async () => {
    try {
      setIsLoading(true);
      // 시뮬레이션 지연
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFacilities(sampleFacilities);
    } catch (error) {
      console.error('시설 목록 로딩 실패:', error);
      toast({
        title: "데이터 로딩 실패",
        description: "시설 목록을 불러올 수 없습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('위치 정보를 가져올 수 없습니다:', error);
          // 서울 시청 좌표를 기본값으로 설정
          setUserLocation({ lat: 37.5665, lng: 126.9780 });
        }
      );
    } else {
      setUserLocation({ lat: 37.5665, lng: 126.9780 });
    }
  };

  const filterAndSortFacilities = () => {
    let filtered = facilities;

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(facility =>
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 타입 필터
    if (typeFilter !== 'all') {
      filtered = filtered.filter(facility => facility.type === typeFilter);
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredFacilities(filtered);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'training': return <Building className="h-5 w-5" />;
      case 'cafe': return <Coffee className="h-5 w-5" />;
      case 'pension': return <Home className="h-5 w-5" />;
      case 'hospital': return <Building className="h-5 w-5 text-red-500" />;
      case 'grooming': return <Star className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'training': return '훈련소';
      case 'cafe': return '카페';
      case 'pension': return '펜션';
      case 'hospital': return '병원';
      case 'grooming': return '미용실';
      default: return '기타';
    }
  };

  const handleNavigate = (facility: Facility) => {
    const url = `https://map.kakao.com/link/to/${facility.name},${facility.coordinates.lat},${facility.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const handleReservation = (facilityId: number) => {
    // 예약 페이지로 이동 또는 모달 열기
    window.location.href = `/reservation/${facilityId}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">주변 시설 찾기</h1>
        <p className="text-gray-600">내 위치 기반으로 훈련소, 카페, 펜션 등 반려견 친화 시설을 찾아보세요.</p>
      </div>

      {/* 필터 및 검색 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="시설명, 주소로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="시설 유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 시설</SelectItem>
                <SelectItem value="training">훈련소</SelectItem>
                <SelectItem value="cafe">카페</SelectItem>
                <SelectItem value="pension">펜션</SelectItem>
                <SelectItem value="hospital">병원</SelectItem>
                <SelectItem value="grooming">미용실</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">거리순</SelectItem>
                <SelectItem value="rating">평점순</SelectItem>
                <SelectItem value="name">이름순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 시설 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))
        ) : filteredFacilities.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">검색 조건에 맞는 시설이 없습니다.</p>
          </div>
        ) : (
          filteredFacilities.map((facility) => (
            <Card key={facility.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={facility.images[0]}
                  alt={facility.name}
                  className="w-full h-48 object-cover"
                />
                {facility.isPartner && (
                  <Badge className="absolute top-2 right-2 bg-blue-600">인증 파트너</Badge>
                )}
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="bg-white/90">
                    {getTypeName(facility.type)}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(facility.type)}
                    <h3 className="font-semibold text-lg">{facility.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{facility.rating}</span>
                    <span className="text-xs text-gray-500">({facility.reviewCount})</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {facility.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{facility.address}</span>
                    <span className="text-blue-600 font-medium">{facility.distance}km</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{facility.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {facility.operatingHours.open} - {facility.operatingHours.close}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {facility.amenities.slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {facility.amenities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{facility.amenities.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <strong>가격대:</strong> {facility.priceRange}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigate(facility)}
                    className="flex-1"
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    길찾기
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleReservation(facility.id)}
                    className="flex-1"
                  >
                    예약하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}