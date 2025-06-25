import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationItem {
  id: number;
  name: string;
  type: 'training' | 'grooming' | 'hospital' | 'hotel' | 'daycare' | 'park';
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  distance: number;
  operatingHours: {
    open: string;
    close: string;
  };
  services: string[];
  priceRange: string;
  isPartner: boolean;
  description: string;
}

export default function LocationFinder() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<LocationItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(['training', 'grooming', 'hospital', 'hotel', 'daycare', 'park']);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
      operatingHours: { open: '09:00', close: '19:00' },
      services: ['기본 순종 훈련', '행동 교정', '사회화 훈련', '어질리티'],
      priceRange: '50,000원 - 150,000원',
      isPartner: true,
      description: '전문 반려견 훈련 및 행동 교정 전문 시설입니다.'
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
      operatingHours: { open: '09:30', close: '20:00' },
      services: ['기본 미용', '스타일링', '스파', '네일 케어'],
      priceRange: '25,000원 - 80,000원',
      isPartner: true,
      description: '전문 그루머가 제공하는 프리미엄 미용 서비스입니다.'
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
      operatingHours: { open: '24시간', close: '24시간' },
      services: ['응급 진료', '건강검진', '수술', '입원 치료'],
      priceRange: '30,000원 - 500,000원',
      isPartner: true,
      description: '24시간 응급 진료가 가능한 반려동물 전문 병원입니다.'
    }
  ];

  useEffect(() => {
    console.log('LocationFinder 컴포넌트 마운트됨');
    loadLocations();
  }, []);

  useEffect(() => {
    filterLocations();
  }, [locations, searchTerm, activeFilters]);

  const loadLocations = async () => {
    try {
      setIsLoading(true);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'training': return '🎓';
      case 'grooming': return '✂️';
      case 'hospital': return '🏥';
      case 'hotel': return '🏨';
      case 'daycare': return '🏠';
      case 'park': return '🌳';
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
      default: return '기타';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🐕 반려견 서비스 지도
          </h1>
          <p className="text-gray-600 text-lg">
            훈련소, 미용실, 병원, 호텔 등 반려견 관련 서비스를 한눈에 찾아보세요
          </p>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
            {/* 검색 */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="지역명이나 업체명을 검색하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3"
              />
            </div>

            {/* 필터 섹션 */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                서비스 종류
              </h3>
              <div className="space-y-3">
                {[
                  { type: 'training', label: '🎓 훈련소' },
                  { type: 'grooming', label: '✂️ 미용실' },
                  { type: 'hospital', label: '🏥 동물병원' },
                  { type: 'hotel', label: '🏨 펜션/호텔' },
                  { type: 'daycare', label: '🏠 위탁관리' },
                  { type: 'park', label: '🌳 놀이공원' }
                ].map(({ type, label }) => (
                  <div key={type} className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100">
                    <Checkbox
                      id={type}
                      checked={activeFilters.includes(type)}
                      onCheckedChange={(checked) => handleFilterChange(type, checked as boolean)}
                      className="mr-3"
                    />
                    <label htmlFor={type} className="cursor-pointer font-medium">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 주변 업체 목록 */}
            <div>
              <h3 className="font-bold text-lg mb-4">
                📍 주변 업체 ({filteredLocations.length}개)
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
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
                      className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                        selectedLocation?.id === location.id
                          ? 'bg-blue-50 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-transparent'
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

          {/* 지도 및 상세 정보 영역 */}
          <div className="lg:col-span-3">
            {/* 지도 영역 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="h-96 bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">지도 영역</p>
                  <p className="text-sm">카카오맵 API 연동 예정</p>
                </div>
              </div>
            </div>

            {/* 선택된 위치 상세 정보 */}
            {selectedLocation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{getTypeIcon(selectedLocation.type)}</span>
                    {selectedLocation.name}
                  </CardTitle>
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
                </CardHeader>
                <CardContent>
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
                      onClick={() => window.open(`https://map.kakao.com/link/to/${selectedLocation.name}`, '_blank')}
                      className="flex-1"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      길찾기
                    </Button>
                    <Button
                      onClick={() => handleReservation(selectedLocation.id)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                    >
                      예약하기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}