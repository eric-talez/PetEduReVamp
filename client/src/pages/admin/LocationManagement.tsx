import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Phone,
  Clock,
  Star,
  Eye,
  Save,
  X,
  Building,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Location {
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
  status: 'active' | 'pending' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export default function LocationManagement() {
  const [locations, setLocations] = useState<Location[]>([
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
      image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=400',
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-06-20'
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
      image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400',
      status: 'active',
      createdAt: '2024-02-10',
      updatedAt: '2024-06-18'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [newLocation, setNewLocation] = useState({
    name: '',
    type: 'training' as const,
    address: '',
    phone: '',
    description: '',
    services: [] as string[],
    priceRange: '',
    operatingHours: { open: '09:00', close: '18:00' },
    isPartner: false,
    image: ''
  });

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || location.type === filterType;
    const matchesStatus = filterStatus === 'all' || location.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'training': return '🎓';
      case 'grooming': return '✂️';
      case 'hospital': return '🏥';
      case 'hotel': return '🏨';
      case 'daycare': return '💖';
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />활성</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500"><AlertCircle className="h-3 w-3 mr-1" />대기</Badge>;
      case 'inactive':
        return <Badge variant="secondary"><X className="h-3 w-3 mr-1" />비활성</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const handleAddLocation = () => {
    const id = Math.max(...locations.map(l => l.id)) + 1;
    const location: Location = {
      ...newLocation,
      id,
      rating: 0,
      reviewCount: 0,
      distance: 0,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setLocations([...locations, location]);
    setIsAddModalOpen(false);
    setNewLocation({
      name: '',
      type: 'training',
      address: '',
      phone: '',
      description: '',
      services: [],
      priceRange: '',
      operatingHours: { open: '09:00', close: '18:00' },
      isPartner: false,
      image: ''
    });

    console.log('새 위치 등록:', location);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
  };

  const handleUpdateLocation = () => {
    if (!editingLocation) return;

    setLocations(locations.map(loc => 
      loc.id === editingLocation.id 
        ? { ...editingLocation, updatedAt: new Date().toISOString().split('T')[0] }
        : loc
    ));
    setEditingLocation(null);
    console.log('위치 정보 업데이트:', editingLocation);
  };

  const handleDeleteLocation = (id: number) => {
    if (confirm('정말로 이 위치를 삭제하시겠습니까?')) {
      setLocations(locations.filter(loc => loc.id !== id));
      console.log('위치 삭제:', id);
    }
  };

  const handleStatusChange = (id: number, status: string) => {
    setLocations(locations.map(loc => 
      loc.id === id 
        ? { ...loc, status: status as 'active' | 'pending' | 'inactive', updatedAt: new Date().toISOString().split('T')[0] }
        : loc
    ));
    console.log('위치 상태 변경:', id, status);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">위치 관리</h1>
          <p className="text-gray-600">반려견 관련 시설 및 서비스 위치를 관리합니다</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              새 위치 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 위치 등록</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">시설명 *</label>
                  <Input
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                    placeholder="시설명을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">시설 유형 *</label>
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
                <label className="block text-sm font-medium mb-2">주소 *</label>
                <Input
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                  placeholder="주소를 입력하세요"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">전화번호</label>
                  <Input
                    value={newLocation.phone}
                    onChange={(e) => setNewLocation({...newLocation, phone: e.target.value})}
                    placeholder="02-000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">가격대</label>
                  <Input
                    value={newLocation.priceRange}
                    onChange={(e) => setNewLocation({...newLocation, priceRange: e.target.value})}
                    placeholder="예: 30,000원 - 80,000원"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">운영 시작 시간</label>
                  <Input
                    type="time"
                    value={newLocation.operatingHours.open}
                    onChange={(e) => setNewLocation({
                      ...newLocation, 
                      operatingHours: {...newLocation.operatingHours, open: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">운영 종료 시간</label>
                  <Input
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
                <label className="block text-sm font-medium mb-2">시설 설명</label>
                <Textarea
                  value={newLocation.description}
                  onChange={(e) => setNewLocation({...newLocation, description: e.target.value})}
                  placeholder="시설에 대한 자세한 설명을 입력하세요"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">이미지 URL</label>
                <Input
                  value={newLocation.image}
                  onChange={(e) => setNewLocation({...newLocation, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPartner"
                  checked={newLocation.isPartner}
                  onChange={(e) => setNewLocation({...newLocation, isPartner: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="isPartner" className="text-sm font-medium">
                  테일즈 파트너 시설
                </label>
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
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">전체 위치</p>
                <p className="text-2xl font-bold">{locations.length}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">활성 위치</p>
                <p className="text-2xl font-bold text-green-600">
                  {locations.filter(l => l.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">승인 대기</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {locations.filter(l => l.status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">파트너 시설</p>
                <p className="text-2xl font-bold text-purple-600">
                  {locations.filter(l => l.isPartner).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="시설명 또는 주소로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="시설 유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 유형</SelectItem>
                <SelectItem value="training">훈련소</SelectItem>
                <SelectItem value="grooming">미용실</SelectItem>
                <SelectItem value="hospital">동물병원</SelectItem>
                <SelectItem value="hotel">펜션/호텔</SelectItem>
                <SelectItem value="daycare">위탁관리</SelectItem>
                <SelectItem value="park">놀이공원</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="pending">대기</SelectItem>
                <SelectItem value="inactive">비활성</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Locations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLocations.map((location) => (
          <Card key={location.id} className="overflow-hidden">
            <div className="relative h-48">
              <img
                src={location.image}
                alt={location.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                {getStatusBadge(location.status)}
                {location.isPartner && (
                  <Badge className="bg-blue-600">파트너</Badge>
                )}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getTypeIcon(location.type)}</span>
                    <Badge variant="outline" className="text-xs">
                      {getTypeName(location.type)}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{location.name}</h3>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{location.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{location.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{location.operatingHours.open} - {location.operatingHours.close}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{location.rating} ({location.reviewCount} 후기)</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {location.description}
              </p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleEditLocation(location)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  편집
                </Button>
                <Select onValueChange={(value) => handleStatusChange(location.id, value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="상태 변경" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">활성화</SelectItem>
                    <SelectItem value="pending">대기</SelectItem>
                    <SelectItem value="inactive">비활성화</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteLocation(location.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                등록: {location.createdAt} | 수정: {location.updatedAt}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-500">
              다른 검색어나 필터를 시도해보세요.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      {editingLocation && (
        <Dialog open={!!editingLocation} onOpenChange={() => setEditingLocation(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>위치 정보 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">시설명</label>
                  <Input
                    value={editingLocation.name}
                    onChange={(e) => setEditingLocation({...editingLocation, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">시설 유형</label>
                  <Select
                    value={editingLocation.type}
                    onValueChange={(value) => setEditingLocation({...editingLocation, type: value as any})}
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
                <label className="block text-sm font-medium mb-2">주소</label>
                <Input
                  value={editingLocation.address}
                  onChange={(e) => setEditingLocation({...editingLocation, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">전화번호</label>
                  <Input
                    value={editingLocation.phone}
                    onChange={(e) => setEditingLocation({...editingLocation, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">가격대</label>
                  <Input
                    value={editingLocation.priceRange}
                    onChange={(e) => setEditingLocation({...editingLocation, priceRange: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">시설 설명</label>
                <Textarea
                  value={editingLocation.description}
                  onChange={(e) => setEditingLocation({...editingLocation, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditingLocation(null)}
                >
                  취소
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleUpdateLocation}
                >
                  <Save className="h-4 w-4 mr-2" />
                  저장하기
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
