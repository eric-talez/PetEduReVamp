
import React, { useState, useEffect } from 'react';
import { NaverMap } from '@/components/map/NaverMap';
import { QuickReservationDialog } from '@/components/reservation/QuickReservationDialog';
import { BusinessCard } from '@/components/business/BusinessCard';
import { TrainerSelectionDialog } from '@/components/business/TrainerSelectionDialog';
import { TrainerProfileDialog } from '@/components/business/TrainerProfileDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, MapPin, Phone, Clock, Star, Navigation, Zap, Target, ChevronRight, Layers, List, Map as MapIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Trainer {
  id: string;
  name: string;
  specialties: string[];
  experience: number;
  rating: number;
  certifications: string[];
  availableSlots: string[];
  profileImage?: string;
  bio?: string;
  price?: number;
}

interface LocationData {
  id: string;
  name: string;
  type: 'training-center' | 'pet-store' | 'veterinary' | 'event' | 'hospital' | 'training' | 'grooming' | 'hotel' | 'cafe' | 'park';
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  rating?: number;
  hours?: string;
  description?: string;
  distance?: number;
  businessNumber?: string;
  certificationStatus?: 'pending' | 'verified' | 'rejected';
  certificationDate?: string;
  businessType?: string;
  trainers?: Trainer[];
  reviewCount?: number;
  services?: string[];
}

// Sample location data for Seoul area
const sampleLocations: LocationData[] = [
  {
    id: 'tc1',
    name: '서울 펫 트레이닝 센터',
    type: 'training-center',
    address: '서울특별시 강남구 테헤란로 123',
    lat: 37.5012,
    lng: 127.0396,
    phone: '02-1234-5678',
    rating: 4.8,
    hours: '09:00 - 18:00',
    description: '전문 반려동물 훈련 서비스를 제공하는 프리미엄 트레이닝 센터입니다.',
    businessNumber: '123-45-67890',
    certificationStatus: 'verified',
    certificationDate: '2024-01-15',
    businessType: '반려동물 훈련업',
    reviewCount: 156,
    services: ['기본 훈련', '행동 교정', '퍼피 클래스', '개인 레슨'],
    trainers: [
      {
        id: 't1',
        name: '김훈련',
        specialties: ['기본 훈련', '행동 교정', '퍼피 클래스'],
        experience: 8,
        rating: 4.9,
        certifications: ['반려동물행동교정사 1급', 'KKC 공인훈련사'],
        availableSlots: ['09:00', '11:00', '14:00', '16:00'],
        bio: '8년 경력의 전문 반려동물 훈련사로, 특히 문제행동 교정에 탁월한 실력을 보유하고 있습니다.',
        price: 80000
      },
      {
        id: 't2',
        name: '박전문',
        specialties: ['퍼피 클래스', '사회화 훈련', '기초 복종'],
        experience: 5,
        rating: 4.7,
        certifications: ['반려동물훈련사 2급', '애견미용사'],
        availableSlots: ['10:00', '13:00', '15:00', '17:00'],
        bio: '젊은 강아지 교육 전문가로, 사회화 훈련과 기초 복종 훈련을 전문으로 합니다.',
        price: 65000
      }
    ]
  },
  {
    id: 'tc2',
    name: '스마트독 교육센터',
    type: 'training-center',
    address: '서울특별시 서초구 강남대로 456',
    lat: 37.4979,
    lng: 127.0276,
    phone: '02-2345-6789',
    rating: 4.6,
    hours: '10:00 - 19:00',
    description: '행동교정 전문 훈련소',
    businessNumber: '234-56-78901',
    certificationStatus: 'verified',
    certificationDate: '2024-02-20',
    businessType: '반려동물 훈련업',
    reviewCount: 89,
    services: ['행동 교정', '공격성 훈련', '분리불안 해결', '사회화 훈련'],
    trainers: [
      {
        id: 't3',
        name: '이행동',
        specialties: ['행동 교정', '공격성 훈련', '분리불안'],
        experience: 10,
        rating: 4.8,
        certifications: ['동물행동학 박사', '반려동물행동교정사 1급'],
        availableSlots: ['09:00', '11:00', '14:00', '16:00'],
        bio: '동물행동학 전문가로 10년간 문제행동 교정에 전념해온 경험 많은 훈련사입니다.',
        price: 120000
      }
    ]
  },
  {
    id: 'ps1',
    name: '펫프렌즈 강남점',
    type: 'pet-store',
    address: '서울특별시 강남구 역삼동 789',
    lat: 37.4998,
    lng: 127.0364,
    phone: '02-3456-7890',
    rating: 4.5,
    hours: '10:00 - 22:00',
    description: '프리미엄 반려동물 용품'
  },
  {
    id: 'ps2',
    name: '애니멀킹덤',
    type: 'pet-store',
    address: '서울특별시 서초구 서초대로 321',
    lat: 37.4936,
    lng: 127.0306,
    phone: '02-4567-8901',
    rating: 4.3,
    hours: '09:00 - 21:00',
    description: '대형 펫샵 체인점'
  },
  {
    id: 'vet1',
    name: '서울동물병원',
    type: 'veterinary',
    address: '서울특별시 강남구 논현로 654',
    lat: 37.5087,
    lng: 127.0224,
    phone: '02-5678-9012',
    rating: 4.9,
    hours: '24시간 응급진료',
    description: '24시간 응급 동물병원'
  },
  {
    id: 'vet2',
    name: '케어펫 동물의료센터',
    type: 'veterinary',
    address: '서울특별시 서초구 효령로 987',
    lat: 37.4847,
    lng: 127.0251,
    phone: '02-6789-0123',
    rating: 4.7,
    hours: '09:00 - 20:00',
    description: '종합 동물의료센터'
  },
  {
    id: 'ev1',
    name: '반려견 어질리티 대회',
    type: 'event',
    address: '서울특별시 강남구 올림픽공원',
    lat: 37.5219,
    lng: 127.1213,
    phone: '02-7890-1234',
    rating: 4.4,
    hours: '2024.02.15 - 2024.02.16',
    description: '전국 반려견 어질리티 경기대회'
  },
  {
    id: 'ev2',
    name: '펫 박람회 2024',
    type: 'event',
    address: '서울특별시 강남구 코엑스',
    lat: 37.5125,
    lng: 127.0592,
    phone: '02-8901-2345',
    rating: 4.6,
    hours: '2024.03.01 - 2024.03.03',
    description: '아시아 최대 반려동물 박람회'
  }
];

export default function LocationsPage() {
  const [locations, setLocations] = useState<LocationData[]>(sampleLocations);
  const [filteredLocations, setFilteredLocations] = useState<LocationData[]>(sampleLocations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const [reservationLocation, setReservationLocation] = useState<LocationData | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [trainerDialogOpen, setTrainerDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<LocationData | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [trainerProfileOpen, setTrainerProfileOpen] = useState(false);
  const [selectedTrainerProfile, setSelectedTrainerProfile] = useState<Trainer | null>(null);
  const [showMapView, setShowMapView] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');
  const [isSmartSearchEnabled, setIsSmartSearchEnabled] = useState(false);

  const { toast } = useToast();

  // Calculate distances when user location is available
  useEffect(() => {
    if (userLocation) {
      const locationsWithDistance = locations.map(location => ({
        ...location,
        distance: calculateDistance(
          userLocation[0], userLocation[1],
          location.lat, location.lng
        )
      }));

      // Sort by distance
      locationsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      setLocations(locationsWithDistance);
    }
  }, [userLocation]);

  // Filter locations based on search and type
  useEffect(() => {
    let filtered = locations;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(location => location.type === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by selected criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredLocations(filtered);
  }, [locations, searchTerm, selectedType, sortBy]);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number): number => {
    return value * Math.PI / 180;
  };

  const getLocationTypeLabel = (type: string) => {
    const labels = {
      'training-center': '훈련소',
      'training': '훈련소',
      'pet-store': '펫샵',
      'veterinary': '동물병원',
      'hospital': '동물병원',
      'event': '이벤트',
      'grooming': '미용실',
      'hotel': '펫호텔',
      'cafe': '펫카페',
      'park': '공원'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getLocationTypeBadgeColor = (type: string) => {
    const colors = {
      'training-center': 'bg-green-100 text-green-800',
      'training': 'bg-green-100 text-green-800',
      'pet-store': 'bg-orange-100 text-orange-800',
      'veterinary': 'bg-red-100 text-red-800',
      'hospital': 'bg-red-100 text-red-800',
      'event': 'bg-blue-100 text-blue-800',
      'grooming': 'bg-purple-100 text-purple-800',
      'hotel': 'bg-yellow-100 text-yellow-800',
      'cafe': 'bg-pink-100 text-pink-800',
      'park': 'bg-green-100 text-green-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);

    if (isSmartSearchEnabled) {
      toast({
        title: `${location.name} 선택됨`,
        description: `${location.distance ? `${location.distance.toFixed(1)}km 거리` : ''}에 위치한 ${getLocationTypeLabel(location.type)}입니다.`,
      });
    }
  };

  const handleReservationClick = (location: LocationData) => {
    setReservationLocation(location);
    setReservationDialogOpen(true);

    if (isSmartSearchEnabled) {
      toast({
        title: "스마트 예약 모드",
        description: "현재 위치와 교통 상황을 고려한 최적 예약 시간을 제안합니다.",
      });
    }
  };

  const handleReservationSubmit = async (reservationData: any) => {
    try {
      console.log('예약 데이터:', reservationData);
      alert(`${reservationData.locationName}에 ${reservationData.date} ${reservationData.time} 예약이 완료되었습니다.`);
    } catch (error) {
      console.error('예약 실패:', error);
      throw error;
    }
  };

  const handleTrainerSelect = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setTrainerDialogOpen(false);
    setReservationLocation(selectedBusiness);
    setReservationDialogOpen(true);
  };

  const handleTrainerProfileClick = (trainer: Trainer) => {
    setSelectedTrainerProfile(trainer);
    setTrainerProfileOpen(true);
  };

  const handleTrainerReservation = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setReservationLocation(selectedLocation);
    setReservationDialogOpen(true);
  };



  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setUserLocation(coords);
          toast({
            title: "위치 확인 완료",
            description: "현재 위치를 찾았습니다.",
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "위치 확인 실패",
            description: "위치 정보를 가져올 수 없습니다.",
            variant: "destructive"
          });
        }
      );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 네이버 지도 스타일 상단 검색바 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {/* 로고/타이틀 */}
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h1 className="text-lg font-bold text-gray-900 hidden sm:block">TALEZ 위치찾기</h1>
            </div>

            {/* 검색바 */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="장소명, 주소를 검색하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 필터 및 설정 */}
            <div className="flex items-center gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="training-center">훈련소</SelectItem>
                  <SelectItem value="pet-store">펫샵</SelectItem>
                  <SelectItem value="veterinary">동물병원</SelectItem>
                  <SelectItem value="event">이벤트</SelectItem>
                  <SelectItem value="grooming">미용실</SelectItem>
                  <SelectItem value="hotel">펫호텔</SelectItem>
                  <SelectItem value="cafe">펫카페</SelectItem>
                  <SelectItem value="park">공원</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={getUserLocation} variant="outline" size="sm">
                <Navigation className="w-4 h-4 mr-2" />
                내 위치
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨테이너 - 네이버 지도 스타일 좌우 분할 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 좌측 사이드바 - 검색 결과 및 목록 */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* 검색 결과 헤더 */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">검색결과</span>
                <Badge variant="secondary">{filteredLocations.length}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                  <SelectTrigger className="w-24 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">거리순</SelectItem>
                    <SelectItem value="rating">평점순</SelectItem>
                    <SelectItem value="name">이름순</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border rounded">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 px-2"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    className="h-8 px-2"
                  >
                    <MapIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 카테고리 필터 */}
            <div className="flex flex-wrap gap-1">
              {['training-center', 'pet-store', 'veterinary', 'event'].map(type => {
                const count = filteredLocations.filter(loc => loc.type === type).length;
                return count > 0 ? (
                  <Badge 
                    key={type} 
                    variant={selectedType === type ? "default" : "outline"}
                    className="text-xs cursor-pointer"
                    onClick={() => setSelectedType(selectedType === type ? 'all' : type)}
                  >
                    {getLocationTypeLabel(type)} {count}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>

          {/* 위치 목록 */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredLocations.length > 0 ? (
                <div className="space-y-2">
                  {filteredLocations.map((location, index) => (
                    <div
                      key={location.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 border ${
                        selectedLocation?.id === location.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100'
                      }`}
                      onClick={() => handleLocationSelect(location)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-blue-600">
                              {index + 1}
                            </span>
                            <h4 className="font-medium text-gray-900 truncate">{location.name}</h4>
                            <Badge className={`${getLocationTypeBadgeColor(location.type)} text-xs`}>
                              {getLocationTypeLabel(location.type)}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{location.address}</span>
                            </div>
                            
                            {location.phone && (
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Phone className="w-3 h-3" />
                                <span>{location.phone}</span>
                              </div>
                            )}
                            
                            {location.hours && (
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Clock className="w-3 h-3" />
                                <span>{location.hours}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              {location.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs font-medium">{location.rating}</span>
                                  {location.reviewCount && (
                                    <span className="text-xs text-gray-500">({location.reviewCount})</span>
                                  )}
                                </div>
                              )}
                              
                              {location.distance && (
                                <span className="text-xs font-medium text-blue-600">
                                  {location.distance < 1 
                                    ? `${Math.round(location.distance * 1000)}m`
                                    : `${location.distance.toFixed(1)}km`
                                  }
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <ChevronRight className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                      </div>
                      
                      {location.description && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                          {location.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs h-7 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLocationSelect(location);
                          }}
                        >
                          상세보기
                        </Button>
                        
                        {(location.type === 'training-center' || location.type === 'training' || location.type === 'hospital' || location.type === 'veterinary') && (
                          <Button 
                            size="sm"
                            className="text-xs h-7 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReservationClick(location);
                            }}
                          >
                            예약
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 font-medium">검색 결과가 없습니다</p>
                  <p className="text-sm text-gray-400 mt-1">
                    다른 검색어나 필터를 시도해보세요
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* 우측 지도 영역 */}
        <div className="flex-1 relative">
          {viewMode === 'map' ? (
            <NaverMap
              locations={filteredLocations}
              height="400px"
              onLocationClick={handleLocationSelect}
              onReservationClick={handleReservationClick}
            />
          ) : (
            /* 상세 정보 패널 */
            <div className="h-full bg-white">
              {selectedLocation ? (
                <div className="h-full flex flex-col">
                  {/* 헤더 */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedLocation.name}</h2>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getLocationTypeBadgeColor(selectedLocation.type)}>
                            {getLocationTypeLabel(selectedLocation.type)}
                          </Badge>
                          {selectedLocation.certificationStatus === 'verified' && (
                            <Badge className="bg-green-100 text-green-800">
                              TALEZ 인증
                            </Badge>
                          )}
                        </div>
                      </div>
                      {selectedLocation.rating && (
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="text-xl font-bold">{selectedLocation.rating}</span>
                            <span className="text-gray-500">/5</span>
                          </div>
                          {selectedLocation.reviewCount && (
                            <span className="text-sm text-gray-500">리뷰 {selectedLocation.reviewCount}개</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 내용 */}
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                      {/* 기본 정보 */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                          <span className="text-gray-900">{selectedLocation.address}</span>
                        </div>

                        {selectedLocation.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-900">{selectedLocation.phone}</span>
                          </div>
                        )}

                        {selectedLocation.hours && (
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-900">{selectedLocation.hours}</span>
                          </div>
                        )}

                        {selectedLocation.distance && (
                          <div className="flex items-center gap-3">
                            <Navigation className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-900">
                              현재 위치에서 {selectedLocation.distance < 1 ? 
                                `${Math.round(selectedLocation.distance * 1000)}m` : 
                                `${selectedLocation.distance.toFixed(1)}km`}
                            </span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* 설명 */}
                      {selectedLocation.description && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">소개</h3>
                          <p className="text-gray-700 leading-relaxed">{selectedLocation.description}</p>
                        </div>
                      )}

                      {/* 서비스 목록 */}
                      {selectedLocation.services && selectedLocation.services.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">제공 서비스</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedLocation.services.map((service, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <span className="text-sm text-gray-700">{service}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 훈련사 정보 */}
                      {selectedLocation.trainers && selectedLocation.trainers.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">전문 훈련사</h3>
                          <div className="space-y-3">
                            {selectedLocation.trainers.map((trainer, index) => (
                              <div 
                                key={index} 
                                className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleTrainerProfileClick(trainer)}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-gray-900">{trainer.name}</h4>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">{trainer.rating}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{trainer.experience}년 경력</p>
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {trainer.specialties.slice(0, 3).map((specialty, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {specialty}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-xs h-7 px-2 flex-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTrainerProfileClick(trainer);
                                    }}
                                  >
                                    프로필 보기
                                  </Button>
                                  <Button 
                                    size="sm"
                                    className="text-xs h-7 px-2 flex-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTrainerReservation(trainer);
                                    }}
                                  >
                                    예약하기
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* 하단 액션 버튼 */}
                  <div className="p-6 border-t border-gray-200 bg-white">
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1"
                        onClick={() => handleReservationClick(selectedLocation)}
                      >
                        예약하기
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          const url = `https://map.kakao.com/link/to/${selectedLocation.name},${selectedLocation.lat},${selectedLocation.lng}`;
                          window.open(url, '_blank');
                        }}
                      >
                        길찾기
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      위치를 선택해주세요
                    </h3>
                    <p className="text-gray-600">
                      좌측 목록에서 장소를 클릭하면<br />
                      자세한 정보를 볼 수 있습니다
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 다이얼로그들 */}
      <TrainerSelectionDialog
        isOpen={trainerDialogOpen}
        onClose={() => setTrainerDialogOpen(false)}
        trainers={selectedBusiness?.trainers || []}
        businessName={selectedBusiness?.name || ''}
        onTrainerSelect={handleTrainerSelect}
      />

      {/* 훈련사 프로필 다이얼로그 */}
      <TrainerProfileDialog
        isOpen={trainerProfileOpen}
        onClose={() => setTrainerProfileOpen(false)}
        trainer={selectedTrainerProfile}
        businessName={selectedLocation?.name || ''}
        onReservationClick={handleTrainerReservation}
      />

      <QuickReservationDialog
        isOpen={reservationDialogOpen}
        onClose={() => setReservationDialogOpen(false)}
        location={reservationLocation as any}
        trainer={selectedTrainer}
        onReservationSubmit={handleReservationSubmit}
      />
    </div>
  );
}
