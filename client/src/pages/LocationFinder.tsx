import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MapPin, 
  Star, 
  Phone, 
  Clock, 
  Navigation,
  Search,
  Filter,
  GraduationCap,
  Scissors,
  Hospital,
  Home,
  Heart,
  TreePine,
  Coffee,
  Users,
  Calendar,
  MessageCircle,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationItem {
  id: number;
  name: string;
  type: 'training' | 'grooming' | 'hospital' | 'hotel' | 'daycare' | 'park' | 'cafe';
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  distance: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  operatingHours: {
    open: string;
    close: string;
  };
  services: string[];
  amenities: string[];
  priceRange: string;
  isPartner: boolean;
  description: string;
  images: string[];
  specialFeatures?: string[];
}

export default function LocationFinder() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<LocationItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(['training', 'grooming', 'hospital', 'hotel', 'daycare', 'park']);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const { toast } = useToast();

  console.log('LocationFinder 컴포넌트 마운트됨');

  // 샘플 위치 데이터
  const sampleLocations: LocationItem[] = [
    {
      id: 1,
      name: '서울 펫 트레이닝 센터',
      type: 'training',
      address: '서울시 강남구 테헤란로 123',
      phone: '02-123-4567',
      rating: 4.8,
      reviewCount: 156,
      distance: 0.8,
      coordinates: { lat: 37.5013, lng: 127.0396 },
      operatingHours: { open: '09:00', close: '19:00' },
      services: ['기본 순종 훈련', '행동 교정', '사회화 훈련', '어질리티'],
      amenities: ['주차장', '실내훈련장', '야외운동장', 'CCTV'],
      priceRange: '50,000원 - 150,000원',
      isPartner: true,
      description: '전문 반려견 훈련 및 행동 교정 전문 시설입니다.',
      images: ['https://images.unsplash.com/photo-1544568100-847a948585b9?w=400'],
      specialFeatures: ['1:1 전담 트레이너', '주말 특별 프로그램']
    },
    {
      id: 2,
      name: '프리미엄 펫 그루밍',
      type: 'grooming',
      address: '서울시 마포구 연남동 123-45',
      phone: '02-567-8901',
      rating: 4.6,
      reviewCount: 178,
      distance: 3.1,
      coordinates: { lat: 37.5636, lng: 126.9253 },
      operatingHours: { open: '09:30', close: '20:00' },
      services: ['기본 미용', '스타일링', '스파', '네일 케어'],
      amenities: ['개별 미용실', '스파', '네일케어', '주차 가능'],
      priceRange: '25,000원 - 80,000원',
      isPartner: true,
      description: '전문 그루머가 제공하는 프리미엄 미용 서비스입니다.',
      images: ['https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400'],
      specialFeatures: ['친환경 제품 사용', '스트레스 완화 아로마']
    },
    {
      id: 3,
      name: '24시 반려동물 병원',
      type: 'hospital',
      address: '서울시 서초구 반포대로 45',
      phone: '02-456-7890',
      rating: 4.7,
      reviewCount: 312,
      distance: 2.3,
      coordinates: { lat: 37.5047, lng: 127.0051 },
      operatingHours: { open: '24시간', close: '24시간' },
      services: ['응급 진료', '건강검진', '수술', '입원 치료'],
      amenities: ['응급실', 'CT/MRI', '입원실', '주차장'],
      priceRange: '30,000원 - 500,000원',
      isPartner: true,
      description: '24시간 응급 진료가 가능한 반려동물 전문 병원입니다.',
      images: ['https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400'],
      specialFeatures: ['24시간 응급실', '전문의 상주']
    }
  ];

  useEffect(() => {
    loadLocations();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    filterLocations();
  }, [locations, searchTerm, activeFilters]);

  const loadLocations = async () => {
    try {
      setIsLoading(true);
      console.log('위치 데이터 로딩 시작');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLocations(sampleLocations);
      console.log('위치 데이터 로딩 완료:', sampleLocations.length, '개');
    } catch (error) {
      console.error('위치 데이터 로딩 실패:', error);
      toast({
        title: "데이터 로딩 실패",
        description: "위치 정보를 불러올 수 없습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    console.log('사용자 위치 가져오기 시도');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          console.log('사용자 위치 설정:', userPos);
        },
        (error) => {
          console.log('위치 정보를 가져올 수 없습니다:', error);
          const defaultPos = { lat: 37.5665, lng: 126.9780 };
          setUserLocation(defaultPos);
          console.log('기본 위치 설정:', defaultPos);
        }
      );
    } else {
      const defaultPos = { lat: 37.5665, lng: 126.9780 };
      setUserLocation(defaultPos);
      console.log('Geolocation 미지원, 기본 위치 설정:', defaultPos);
    }
  };

  const filterLocations = () => {
    let filtered = locations;

    if (searchTerm) {
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilters.length > 0) {
      filtered = filtered.filter(location => activeFilters.includes(location.type));
    }

    filtered.sort((a, b) => a.distance - b.distance);
    setFilteredLocations(filtered);
    console.log('필터링된 위치:', filtered.length, '개');
  };

  const handleFilterChange = (type: string, checked: boolean) => {
    console.log('필터 변경:', type, checked);
    if (checked) {
      setActiveFilters(prev => [...prev, type]);
    } else {
      setActiveFilters(prev => prev.filter(filter => filter !== type));
    }
  };

  const handleLocationClick = (location: LocationItem) => {
    console.log('위치 클릭:', location.name);
    setSelectedLocation(location);
  };

  const handleLocationDetail = (locationId: number) => {
    console.log('위치 상세보기 클릭:', locationId);
    window.location.href = `/location/${locationId}`;
  };

  const handleReservation = (locationId: number) => {
    console.log('예약하기 클릭:', locationId);
    window.location.href = `/reservation/${locationId}`;
  };

  const handleNavigation = (location: LocationItem) => {
    console.log('길찾기 클릭:', location.name);
    const url = `https://map.kakao.com/link/to/${location.name},${location.coordinates.lat},${location.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'training': return '🎓';
      case 'grooming': return '✂️';
      case 'hospital': return '🏥';
      case 'hotel': return '🏨';
      case 'daycare': return '🏠';
      case 'park': return '🌳';
      case 'cafe': return '☕';
      default: return '📍';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'training': return '훈련소';
      case 'grooming': return '미용실';
      case 'hospital': return '동물병원';
      case 'hotel': return '펜션/호텔';
      case 'daycare': return '위탁관리';
      case 'park': return '놀이공원';
      case 'cafe': return '카페';
      default: return '기타';
    }
  };

  const getStats = () => {
    return {
      training: filteredLocations.filter(l => l.type === 'training').length,
      grooming: filteredLocations.filter(l => l.type === 'grooming').length,
      hospital: filteredLocations.filter(l => l.type === 'hospital').length,
      hotel: filteredLocations.filter(l => l.type === 'hotel').length,
      daycare: filteredLocations.filter(l => l.type === 'daycare').length,
      park: filteredLocations.filter(l => l.type === 'park').length,
      total: filteredLocations.length
    };
  };

  const stats = getStats();

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 헤더 */}
        <div 
          className="backdrop-blur-md bg-white/95 rounded-2xl shadow-xl p-8 mb-6 text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🐕 반려견 서비스 지도
          </h1>
          <p className="text-gray-600 text-lg">
            훈련소, 미용실, 병원, 호텔 등 반려견 관련 서비스를 한눈에 찾아보세요
          </p>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
          {/* 사이드바 */}
          <div className="lg:col-span-1 backdrop-blur-md bg-white/95 rounded-2xl shadow-xl p-6 overflow-y-auto">
            {/* 검색 */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="지역명이나 업체명을 검색하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
              />
            </div>

            {/* 필터 섹션 */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                🎯 서비스 종류
              </h3>
              <div className="space-y-3">
                {[
                  { type: 'training', label: '🎓 훈련소', icon: GraduationCap },
                  { type: 'grooming', label: '✂️ 미용실', icon: Scissors },
                  { type: 'hospital', label: '🏥 동물병원', icon: Hospital },
                  { type: 'hotel', label: '🏨 펜션/호텔', icon: Home },
                  { type: 'daycare', label: '🏠 위탁관리', icon: Heart },
                  { type: 'park', label: '🌳 놀이공원', icon: TreePine }
                ].map(({ type, label, icon: Icon }) => (
                  <div 
                    key={type}
                    className={`flex items-center p-3 rounded-xl cursor-pointer transition-all ${
                      activeFilters.includes(type) 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <Checkbox
                      id={type}
                      checked={activeFilters.includes(type)}
                      onCheckedChange={(checked) => handleFilterChange(type, checked as boolean)}
                      className="mr-3"
                    />
                    <label htmlFor={type} className="cursor-pointer font-medium flex items-center gap-2">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 주변 업체 목록 */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                📍 주변 업체 ({filteredLocations.length}개)
              </h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-20 rounded-xl"></div>
                    </div>
                  ))
                ) : filteredLocations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>검색 조건에 맞는 업체가 없습니다</p>
                  </div>
                ) : (
                  filteredLocations.map((location) => (
                    <div 
                      key={location.id}
                      className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                        selectedLocation?.id === location.id
                          ? 'bg-blue-100 border-blue-500 shadow-md transform -translate-y-1'
                          : 'bg-gray-50 hover:bg-gray-100 border-transparent hover:shadow-md hover:transform hover:-translate-y-1'
                      }`}
                      onClick={() => handleLocationClick(location)}
                    >
                      <div className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(location.type)}</span>
                        {location.name}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{location.address}</div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{location.rating}</span>
                            <span className="text-xs text-gray-500">({location.reviewCount})</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {location.distance}km
                          </Badge>
                        </div>
                        {location.isPartner && (
                          <Badge className="bg-blue-600 text-xs">파트너</Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 지도 영역 */}
          <div className="lg:col-span-3 backdrop-blur-md bg-white/95 rounded-2xl shadow-xl overflow-hidden">
            <div
              ref={mapRef}
              className="w-full h-full flex items-center justify-center"
              style={{ minHeight: '700px', background: '#f0f0f0' }}
            >
              <div className="text-center text-gray-500">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">지도 영역</p>
                <p className="text-sm">카카오맵 API 연동 예정</p>
                <p className="text-xs mt-2">현재는 목록 기반으로 위치를 확인할 수 있습니다</p>
              </div>
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-6">
          {[
            { label: '훈련소', count: stats.training, color: 'from-blue-500 to-blue-600' },
            { label: '미용실', count: stats.grooming, color: 'from-pink-500 to-pink-600' },
            { label: '동물병원', count: stats.hospital, color: 'from-red-500 to-red-600' },
            { label: '펜션/호텔', count: stats.hotel, color: 'from-green-500 to-green-600' },
            { label: '위탁관리', count: stats.daycare, color: 'from-purple-500 to-purple-600' },
            { label: '놀이공원', count: stats.park, color: 'from-emerald-500 to-emerald-600' },
            { label: '전체', count: stats.total, color: 'from-gray-500 to-gray-600' }
          ].map(({ label, count, color }) => (
            <div key={label} className="backdrop-blur-md bg-white/95 rounded-2xl shadow-xl p-6 text-center hover:transform hover:-translate-y-1 transition-all">
              <div className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}>
                {count}
              </div>
              <div className="text-gray-600 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* 선택된 위치 상세 정보 */}
        {selectedLocation && (
          <div className="mt-6 backdrop-blur-md bg-white/95 rounded-2xl shadow-xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-2xl">{getTypeIcon(selectedLocation.type)}</span>
                      {selectedLocation.name}
                    </h3>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{getTypeName(selectedLocation.type)}</Badge>
                      {selectedLocation.isPartner && (
                        <Badge className="bg-blue-600">테일즈 파트너</Badge>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{selectedLocation.rating}</span>
                        <span className="text-gray-500">({selectedLocation.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{selectedLocation.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{selectedLocation.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{selectedLocation.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">
                        {selectedLocation.operatingHours.open} - {selectedLocation.operatingHours.close}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">제공 서비스</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocation.services.map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleLocationDetail(selectedLocation.id)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    상세보기
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleNavigation(selectedLocation)}
                    className="flex-1"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    길찾기
                  </Button>
                  <Button
                    onClick={() => handleReservation(selectedLocation.id)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    예약하기
                  </Button>
                </div>
              </div>

              <div>
                <img
                  src={selectedLocation.images[0]}
                  alt={selectedLocation.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">가격대</h4>
                    <p className="text-gray-700">{selectedLocation.priceRange}</p>
                  </div>
                  {selectedLocation.specialFeatures && (
                    <div>
                      <h4 className="font-semibold mb-2">특별 서비스</h4>
                      <div className="space-y-1">
                        {selectedLocation.specialFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}