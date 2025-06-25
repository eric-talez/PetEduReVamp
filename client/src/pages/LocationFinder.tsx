import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LocationDetailModal } from '@/components/LocationDetailModal';
import { TrainerConsultationModal } from '@/components/TrainerConsultationModal';
import { NaverStyleReservationModal } from '@/components/NaverStyleReservationModal';
import { 
  MapPin, 
  Star, 
  Search, 
  SlidersHorizontal,
  GraduationCap,
  Scissors,
  Hospital,
  Home,
  Heart,
  TreePine,
  Phone,
  Clock,
  Eye
} from 'lucide-react';

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
  image: string;
}

export default function LocationFinder() {
  const [locations] = useState<LocationItem[]>([
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
      services: ['기본 순종 훈련', '행동 교정', '사회화 훈련'],
      priceRange: '50,000원 - 150,000원',
      isPartner: true,
      description: '전문 반려견 훈련 및 행동 교정 전문 시설입니다.',
      image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=400'
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
      description: '전문 그루머가 제공하는 프리미엄 미용 서비스입니다.',
      image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400'
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
      description: '24시간 응급 진료가 가능한 반려동물 전문 병원입니다.',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400'
    },
    {
      id: 4,
      name: '펫 리조트 펜션',
      type: 'hotel',
      address: '경기도 가평군 청평면',
      phone: '031-345-6789',
      rating: 4.9,
      reviewCount: 234,
      distance: 45.6,
      operatingHours: { open: '15:00', close: '11:00' },
      services: ['숙박', '반려견 용품 대여', '산책 서비스'],
      priceRange: '120,000원 - 300,000원',
      isPartner: false,
      description: '반려견과 함께 머물 수 있는 프리미엄 펜션입니다.',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400'
    },
    {
      id: 5,
      name: '도심 속 펫카페',
      type: 'daycare',
      address: '서울시 홍대입구역 근처',
      phone: '02-234-5678',
      rating: 4.5,
      reviewCount: 89,
      distance: 1.2,
      operatingHours: { open: '10:00', close: '22:00' },
      services: ['일일 돌봄', '사회화 훈련', '놀이 활동'],
      priceRange: '15,000원 - 40,000원',
      isPartner: true,
      description: '반려견이 다른 강아지들과 안전하게 놀 수 있는 공간입니다.',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'
    },
    {
      id: 6,
      name: '한강 반려견 공원',
      type: 'park',
      address: '서울시 마포구 한강공원 내',
      phone: '02-345-6789',
      rating: 4.4,
      reviewCount: 267,
      distance: 5.8,
      operatingHours: { open: '06:00', close: '22:00' },
      services: ['자유 운동', '산책로', '놀이 시설'],
      priceRange: '무료',
      isPartner: false,
      description: '넓은 공간에서 반려견이 자유롭게 뛰어놀 수 있는 공원입니다.',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400'
    }
  ]);

  const [filteredLocations, setFilteredLocations] = useState<LocationItem[]>(locations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTrainerConsultation, setShowTrainerConsultation] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showNaverReservation, setShowNaverReservation] = useState(false);

  console.log('LocationFinder 컴포넌트 렌더링됨');
  
  useEffect(() => {
    let filtered = locations;

    // 검색 필터링
    if (searchTerm) {
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 타입 필터링
    if (filter !== 'all') {
      filtered = filtered.filter(location => location.type === filter);
    }

    // 거리순 정렬
    filtered.sort((a, b) => a.distance - b.distance);
    setFilteredLocations(filtered);
  }, [locations, searchTerm, filter]);

  const handleLocationClick = (location: LocationItem) => {
    console.log('위치 클릭:', location.name);
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  const handleLocationDetail = (locationId: number) => {
    console.log('위치 상세보기 클릭:', locationId);
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
      setIsModalOpen(true);
    }
  };

  const handleReservation = (locationId: number) => {
    console.log('예약하기 클릭:', locationId);
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      // 훈련소인 경우 상담 예약으로 연결
      if (location.type === 'training') {
        setSelectedLocation(location);
        setIsModalOpen(true);
        // 모달이 열린 후 훈련사 탭으로 이동
        setTimeout(() => {
          const modal = document.querySelector('[data-state="open"]');
          if (modal) {
            const trainersTab = modal.querySelector('[value="trainers"]');
            if (trainersTab) {
              (trainersTab as HTMLElement).click();
            }
          }
        }, 100);
      } else {
        // 다른 시설들은 네이버 스타일 예약 시스템
        setSelectedLocation(location);
        setShowNaverReservation(true);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    console.log('검색어 변경:', e.target.value);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'training': return <GraduationCap className="h-4 w-4" />;
      case 'grooming': return <Scissors className="h-4 w-4" />;
      case 'hospital': return <Hospital className="h-4 w-4" />;
      case 'hotel': return <Home className="h-4 w-4" />;
      case 'daycare': return <Heart className="h-4 w-4" />;
      case 'park': return <TreePine className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
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
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Banner */}
      <div className="relative rounded-xl overflow-hidden h-48 md:h-64 mb-8 shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400" 
          alt="위치 찾기"
          className="w-full h-full object-cover absolute"
        />
        <div className="relative h-full flex flex-col justify-center px-6 md:px-10">
          <h1 className="text-primary dark:text-white text-xl md:text-3xl font-bold mb-2 md:mb-4 max-w-xl bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg">
            🐕 반려견 서비스 위치 찾기
          </h1>
          <p className="text-gray-800 dark:text-gray-200 text-sm md:text-base max-w-xl mb-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg">
            주변의 훈련소, 미용실, 병원, 펜션 등 반려견 관련 서비스를 쉽게 찾아보세요.
          </p>

          {/* Search Bar */}
          <div className="max-w-lg bg-white dark:bg-gray-800 rounded-lg flex items-center p-1">
            <div className="px-2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="지역명이나 업체명을 검색하세요" 
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 py-2 px-2 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
            />
            <Button className="ml-2">
              검색
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className="text-xs"
        >
          전체
        </Button>

        <Button
          variant={filter === "training" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("training")}
          className="text-xs"
        >
          🎓 훈련소
        </Button>

        <Button
          variant={filter === "grooming" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("grooming")}
          className="text-xs"
        >
          ✂️ 미용실
        </Button>

        <Button
          variant={filter === "hospital" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("hospital")}
          className="text-xs"
        >
          🏥 병원
        </Button>

        <Button
          variant={filter === "hotel" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("hotel")}
          className="text-xs"
        >
          🏨 펜션
        </Button>

        <Button
          variant={filter === "daycare" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("daycare")}
          className="text-xs"
        >
          💖 위탁관리
        </Button>

        <Button
          variant={filter === "park" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("park")}
          className="text-xs"
        >
          🌳 공원
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="ml-auto text-xs"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
          고급 필터
        </Button>
      </div>

      {/* Location Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {filteredLocations.map((location) => (
          <Card key={location.id} className="overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleLocationClick(location)}>
            <div className="relative h-40">
              <img 
                src={location.image} 
                alt={location.name} 
                className="w-full h-full object-cover"
              />
              {location.isPartner && (
                <Badge className="absolute top-2 right-2 bg-blue-600">
                  파트너
                </Badge>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                {getTypeIcon(location.type)}
                <Badge variant="outline" className="text-xs">
                  {getTypeName(location.type)}
                </Badge>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{location.name}</h3>

              <div className="flex items-center mb-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 mr-2">
                  {location.rating}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({location.reviewCount} 후기)
                </span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {location.distance}km
                </Badge>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {location.description}
              </p>

              <div className="space-y-2 mb-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>{location.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>{location.operatingHours.open} - {location.operatingHours.close}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>{location.phone}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLocationDetail(location.id);
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  상세보기
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReservation(location.id);
                  }}
                >
                  예약하기
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Map Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            지도에서 보기
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">지도 영역</p>
              <p className="text-sm">카카오맵 API 연동 예정</p>
              <p className="text-xs mt-2">현재는 목록 기반으로 위치를 확인할 수 있습니다</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Detail Modal */}
      {selectedLocation && (
        <LocationDetailModal
          location={selectedLocation}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onReservation={handleReservation}
        />
      )}

      {/* Pagination */}
      <div className="mt-10 flex justify-center">
        <nav className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="text-sm">
            이전
          </Button>
          <Button variant="default" size="sm" className="text-sm">
            1
          </Button>
          <Button variant="outline" size="sm" className="text-sm">
            2
          </Button>
          <Button variant="outline" size="sm" className="text-sm">
            3
          </Button>
          <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
          <Button variant="outline" size="sm" className="text-sm">
            다음
          </Button>
        </nav>
      </div>
      {/* 훈련사 상담 모달 */}
      <TrainerConsultationModal
        isOpen={showTrainerConsultation}
        onOpenChange={setShowTrainerConsultation}
        trainer={selectedTrainer}
        onConsultationBooked={(consultation) => {
          console.log('상담 예약 완료:', consultation);
          setShowTrainerConsultation(false);
        }}
      />

      {/* 네이버 스타일 예약 모달 */}
      {selectedLocation && (
        <NaverStyleReservationModal
          isOpen={showNaverReservation}
          onOpenChange={setShowNaverReservation}
          location={selectedLocation}
          onReservationComplete={(reservation) => {
            console.log('예약 완료:', reservation);
            setShowNaverReservation(false);
          }}
        />
      )}
    </div>
  );
}