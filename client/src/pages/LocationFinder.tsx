import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  MapPin, 
  Search,
  Filter,
  Star,
  Clock,
  Phone,
  Navigation,
  Heart,
  Share2,
  Plus,
  Building,
  Save
} from 'lucide-react';
import { KakaoMapView } from '@/components/KakaoMapView';
import { LocationDetailModal } from '@/components/LocationDetailModal';
import { useAuth } from '../SimpleApp';
import { toast } from '@/hooks/use-toast';

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
  const [locations, setLocations] = useState<LocationItem[]>([
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
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string; address: string } | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<LocationItem[]>(locations);
  const [showModal, setShowModal] = useState(false);
  const [selectedLocationForModal, setSelectedLocationForModal] = useState<LocationItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: '',
    type: 'training' as const,
    address: '',
    phone: '',
    description: '',
    services: [] as string[],
    priceRange: '',
    operatingHours: { open: '09:00', close: '18:00' },
    image: '',
    latitude: 37.5665,
    longitude: 126.9780
  });

  const { userRole } = useAuth();

  const handleLocationClick = (location: LocationItem) => {
    console.log('위치 클릭:', location.name);
    setSelectedLocation({
      lat: 37.5665 + (Math.random() - 0.5) * 0.01,
      lng: 126.9780 + (Math.random() - 0.5) * 0.01,
      name: location.name,
      address: location.address
    });
  };

  const handleAddLocation = async () => {
    try {
      // 새 업체 등록 API 호출
      const response = await fetch('/api/admin/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newLocation,
          isPartner: true, // 관리자가 등록하는 업체는 파트너로 설정
          status: 'active'
        }),
      });

      if (response.ok) {
        const addedLocation = await response.json();

        // 새로운 ID 생성
        const newId = Math.max(...locations.map(l => l.id)) + 1;
        const locationToAdd: LocationItem = {
          id: newId,
          name: newLocation.name,
          type: newLocation.type,
          address: newLocation.address,
          phone: newLocation.phone,
          rating: 0,
          reviewCount: 0,
          distance: 0,
          operatingHours: newLocation.operatingHours,
          services: newLocation.services,
          priceRange: newLocation.priceRange,
          isPartner: true,
          description: newLocation.description,
          image: newLocation.image || 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400'
        };

        // 로컬 상태 업데이트 (실제로는 서버에서 받은 데이터 사용)
        setLocations([...locations, locationToAdd]);
        setFilteredLocations([...filteredLocations, locationToAdd]);

        // 폼 초기화
        setNewLocation({
          name: '',
          type: 'training',
          address: '',
          phone: '',
          description: '',
          services: [],
          priceRange: '',
          operatingHours: { open: '09:00', close: '18:00' },
          image: '',
          latitude: 37.5665,
          longitude: 126.9780
        });

        setIsAddModalOpen(false);

        toast({
          title: "업체 등록 완료",
          description: `${newLocation.name}이(가) 성공적으로 등록되었습니다.`,
        });
      } else {
        throw new Error('업체 등록 실패');
      }
    } catch (error) {
      console.error('업체 등록 오류:', error);
      toast({
        title: "등록 실패",
        description: "업체 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    }
  };

  return (
    
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">위치 찾기</h1>
          <p className="text-gray-600 dark:text-gray-400">내 주변의 반려견 관련 시설을 찾아보세요</p>
        </div>

        {/* 관리자 권한 업체 등록 버튼 */}
        {userRole === 'admin' && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                업체 등록
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  새 업체 등록
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">업체명 *</Label>
                    <Input
                      id="name"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                      placeholder="업체명을 입력하세요"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">업체 유형 *</Label>
                    <Select
                      value={newLocation.type}
                      onValueChange={(value) => setNewLocation({...newLocation, type: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="training">훈련소</SelectItem>
                        <SelectItem value="grooming">미용실</SelectItem>
                        <SelectItem value="hospital">동물병원</SelectItem>
                        <SelectItem value="hotel">펜션/호텔</SelectItem>
                        <SelectItem value="daycare">위탁관리</SelectItem>
                        <SelectItem value="park">놀이공원</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">주소 *</Label>
                  <Input
                    id="address"
                    value={newLocation.address}
                    onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                    placeholder="주소를 입력하세요"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">전화번호</Label>
                    <Input
                      id="phone"
                      value={newLocation.phone}
                      onChange={(e) => setNewLocation({...newLocation, phone: e.target.value})}
                      placeholder="02-000-0000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priceRange">가격대</Label>
                    <Input
                      id="priceRange"
                      value={newLocation.priceRange}
                      onChange={(e) => setNewLocation({...newLocation, priceRange: e.target.value})}
                      placeholder="예: 30,000원 - 80,000원"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="openTime">운영 시작 시간</Label>
                    <Input
                      id="openTime"
                      type="time"
                      value={newLocation.operatingHours.open}
                      onChange={(e) => setNewLocation({
                        ...newLocation, 
                        operatingHours: {...newLocation.operatingHours, open: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="closeTime">운영 종료 시간</Label>
                    <Input
                      id="closeTime"
                      type="time"
                      value={newLocation.operatingHours.close}
                      onChange={(e) => setNewLocation({
                        ...newLocation, 
                        operatingHours: {...newLocation.operatingHours, close: e.target.value}
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">업체 설명</Label>
                  <Textarea
                    id="description"
                    value={newLocation.description}
                    onChange={(e) => setNewLocation({...newLocation, description: e.target.value})}
                    placeholder="업체에 대한 자세한 설명을 입력하세요"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="image">이미지 URL</Label>
                  <Input
                    id="image"
                    value={newLocation.image}
                    onChange={(e) => setNewLocation({...newLocation, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    취소
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleAddLocation}
                    disabled={!newLocation.name || !newLocation.address}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    등록하기
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    
  );
}