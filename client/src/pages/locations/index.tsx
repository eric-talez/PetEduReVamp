import React, { useState, useEffect } from 'react';
import { NaverMap } from '@/components/map/NaverMap';
import { QuickReservationDialog } from '@/components/reservation/QuickReservationDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, MapPin, Phone, Clock, Star, Navigation } from 'lucide-react';

interface LocationData {
  id: string;
  name: string;
  type: 'training-center' | 'pet-store' | 'veterinary' | 'event';
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  rating?: number;
  hours?: string;
  description?: string;
  distance?: number;
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
    description: '전문 반려동물 훈련 서비스를 제공하는 프리미엄 트레이닝 센터입니다.'
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
    description: '행동교정 전문 훈련소'
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
  const [showMapView, setShowMapView] = useState(false);

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

    setFilteredLocations(filtered);
  }, [locations, searchTerm, selectedType]);

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
      'pet-store': '펫샵',
      'veterinary': '동물병원',
      'event': '이벤트'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getLocationTypeBadgeColor = (type: string) => {
    const colors = {
      'training-center': 'bg-green-100 text-green-800',
      'pet-store': 'bg-orange-100 text-orange-800',
      'veterinary': 'bg-red-100 text-red-800',
      'event': 'bg-blue-100 text-blue-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
  };

  const handleReservationClick = (location: LocationData) => {
    setReservationLocation(location);
    setReservationDialogOpen(true);
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

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setUserLocation(coords);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          주변 위치 찾기
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          가까운 훈련소, 펫샵, 동물병원, 이벤트를 찾아보세요
        </p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            검색 및 필터
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="장소명, 주소로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 장소</SelectItem>
                <SelectItem value="training-center">훈련소</SelectItem>
                <SelectItem value="pet-store">펫샵</SelectItem>
                <SelectItem value="veterinary">동물병원</SelectItem>
                <SelectItem value="event">이벤트</SelectItem>
              </SelectContent>
            </Select>

            {/* Location Button */}
            <Button onClick={getUserLocation} variant="outline" className="w-full">
              <Navigation className="w-4 h-4 mr-2" />
              내 위치에서 찾기
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredLocations.length}개의 장소를 찾았습니다
            </span>
            {userLocation && (
              <Badge variant="outline" className="text-blue-600">
                <MapPin className="w-3 h-3 mr-1" />
                현재 위치 기준 정렬
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            {['training-center', 'pet-store', 'veterinary', 'event'].map(type => {
              const count = filteredLocations.filter(loc => loc.type === type).length;
              return count > 0 ? (
                <Badge key={type} className={getLocationTypeBadgeColor(type)}>
                  {getLocationTypeLabel(type)} {count}
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      </div>

      {/* Map View Toggle */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">지도에서 위치 보기</h3>
              <p className="text-sm text-gray-600">업체 위치를 지도에서 확인하세요</p>
            </div>
          </div>
          <button
            onClick={() => setShowMapView(!showMapView)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-md transition-colors"
          >
            <Navigation className="w-5 h-5" />
            {showMapView ? '목록으로 돌아가기' : '지도 보기'}
          </button>
        </div>
      </div>

      {/* Map and Location Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <div className="lg:col-span-1">
          {showMapView ? (
            <NaverMap 
              locations={filteredLocations}
              height="600px"
              onLocationClick={handleLocationSelect}
              onReservationClick={handleReservationClick}
            />
          ) : (
            <NaverMap
              locations={filteredLocations}
              height="600px"
              onLocationClick={handleLocationSelect}
              onReservationClick={handleReservationClick}
            />
          )}
        </div>

        {/* Location Details */}
        <div className="lg:col-span-1">
          {selectedLocation ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedLocation.name}</CardTitle>
                    <Badge className={getLocationTypeBadgeColor(selectedLocation.type)}>
                      {getLocationTypeLabel(selectedLocation.type)}
                    </Badge>
                  </div>
                  {selectedLocation.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedLocation.rating}</span>
                      <span className="text-sm text-gray-500">/5</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 text-gray-500" />
                  <span className="text-sm">{selectedLocation.address}</span>
                </div>
                
                {selectedLocation.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedLocation.phone}</span>
                  </div>
                )}
                
                {selectedLocation.hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedLocation.hours}</span>
                  </div>
                )}
                
                {selectedLocation.distance && (
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      현재 위치에서 {selectedLocation.distance < 1 ? 
                        `${Math.round(selectedLocation.distance * 1000)}m` : 
                        `${selectedLocation.distance.toFixed(1)}km`}
                    </span>
                  </div>
                )}
                
                {selectedLocation.description && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedLocation.description}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">
                    예약하기
                  </Button>
                  <Button variant="outline" className="flex-1">
                    길찾기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  위치를 선택해주세요
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  지도나 목록에서 장소를 클릭하면 자세한 정보를 볼 수 있습니다
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Location List */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>장소 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedLocation?.id === location.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleLocationSelect(location)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{location.name}</h4>
                    <Badge className={getLocationTypeBadgeColor(location.type)}>
                      {getLocationTypeLabel(location.type)}
                    </Badge>
                  </div>
                  {location.distance && (
                    <span className="text-sm text-gray-500">
                      {location.distance < 1 ? 
                        `${Math.round(location.distance * 1000)}m` : 
                        `${location.distance.toFixed(1)}km`}
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{location.address}</span>
                  </div>
                  
                  {location.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{location.rating}/5</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 예약 다이얼로그 */}
      <QuickReservationDialog
        isOpen={reservationDialogOpen}
        onClose={() => setReservationDialogOpen(false)}
        location={reservationLocation as any}
        onReservationSubmit={handleReservationSubmit}
      />
    </div>
  );
}