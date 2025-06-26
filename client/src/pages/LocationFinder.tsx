import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
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
  AlertCircle,
  Settings,
  Edit2
} from 'lucide-react';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { KakaoMapView } from '@/components/KakaoMapView';
import { LocationDetailModal } from '@/components/LocationDetailModal';

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
  status: 'active' | 'pending' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface Location {
  id: number;
  name: string;
  type: string;
  address: string;
  phone: string;
  description: string;
  services: string[];
  priceRange: string;
  operatingHours: { open: string; close: string };
  isPartner: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
}

export default function LocationFinder() {
  const { userRole } = useGlobalAuth();
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
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLocationItem, setEditingLocation] = useState<LocationItem | null>(null);
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

  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [showManagementDialog, setShowManagementDialog] = useState(false);
  const [managementSearchTerm, setManagementSearchTerm] = useState('');
  const [managementFilterType, setManagementFilterType] = useState('all');
  const [managedLocations, setManagedLocations] = useState<Location[]>([]);
  const [editingLocationInner, setEditingLocationInner] = useState<Location | null>(null);
  const [newLocationData, setNewLocationData] = useState({
    name: '',
    type: '',
    address: '',
    phone: '',
    description: '',
    services: [] as string[],
    priceRange: '',
    operatingHours: { open: '09:00', close: '18:00' },
    isPartner: true
  });

  console.log('LocationFinder 컴포넌트 렌더링됨');

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

  const handleLocationClick = (location: LocationItem) => {
    console.log('위치 클릭:', location.name);
    setSelectedLocation(location);
    setShowDetailModal(true);
  };

  const handleAddLocation = () => {
    const id = Math.max(...locations.map(l => l.id)) + 1;
    const location: LocationItem = {
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

  const handleEditLocationItem = (location: LocationItem) => {
    setEditingLocation(location);
  };

  const handleUpdateLocation = () => {
    if (!editingLocationItem) return;

    setLocations(locations.map(loc => 
      loc.id === editingLocationItem.id 
        ? { ...editingLocationItem, updatedAt: new Date().toISOString().split('T')[0] }
        : loc
    ));
    setEditingLocation(null);
    console.log('위치 정보 업데이트:', editingLocationItem);
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

  const handleAdminLocationSave = async () => {
    try {
      const response = await fetch('/api/admin/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLocationData)
      });

      if (response.ok) {
        const result = await response.json();
        const newLocation = result.location;

        // Add to managed locations
        setManagedLocations(prev => [...prev, newLocation]);

        // Add to main locations list
        setLocations(prev => [...prev, {
          ...newLocation,
          rating: 0,
          reviewCount: 0,
          distance: 0
        }]);

        useToast().toast({
          title: "업체 등록 완료",
          description: "새 업체가 성공적으로 등록되었습니다.",
        });

        // Reset form and close dialog
        setNewLocationData({
          name: '',
          type: '',
          address: '',
          phone: '',
          description: '',
          services: [],
          priceRange: '',
          operatingHours: { open: '09:00', close: '18:00' },
          isPartner: true
        });
        setShowAdminDialog(false);
      } else {
        throw new Error('업체 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('업체 등록 오류:', error);
      useToast().toast({
        title: "등록 실패",
        description: "업체 등록 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const loadManagedLocations = async () => {
    try {
      const response = await fetch('/api/admin/locations');
      if (response.ok) {
        const result = await response.json();
        setManagedLocations(result.locations || []);
      }
    } catch (error) {
      console.error('업체 목록 로딩 오류:', error);
    }
  };

  const getFilteredManagementLocations = () => {
    let filtered = managedLocations;

    if (managementSearchTerm) {
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(managementSearchTerm.toLowerCase()) ||
        location.address.toLowerCase().includes(managementSearchTerm.toLowerCase())
      );
    }

    if (managementFilterType !== 'all') {
      filtered = filtered.filter(location => location.type === managementFilterType);
    }

    return filtered;
  };

  const handleEditLocationInner = (location: Location) => {
    setEditingLocationInner(location);
    // 편집 모달을 여기서 구현하거나 별도 상태로 관리
  };

  const handleDeleteLocationInner = async (locationId: number) => {
    if (!confirm('정말로 이 업체를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/locations/${locationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setManagedLocations(prev => prev.filter(loc => loc.id !== locationId));
        setLocations(prev => prev.filter(loc => loc.id !== locationId));

        useToast().toast({
          title: "업체 삭제 완료",
          description: "업체가 성공적으로 삭제되었습니다.",
        });
      }
    } catch (error) {
      console.error('업체 삭제 오류:', error);
      useToast().toast({
        title: "삭제 실패",
        description: "업체 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleToggleLocationStatus = async (locationId: number) => {
    try {
      const location = managedLocations.find(loc => loc.id === locationId);
      if (!location) return;

      const newStatus = location.status === 'active' ? 'inactive' : 'active';

      const response = await fetch(`/api/admin/locations/${locationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setManagedLocations(prev =>
          prev.map(loc =>
            loc.id === locationId ? { ...loc, status: newStatus } : loc
          )
        );

        useToast().toast({
          title: "상태 변경 완료",
          description: `업체가 ${newStatus === 'active' ? '활성화' : '비활성화'}되었습니다.`,
        });
      }
    } catch (error) {
      console.error('상태 변경 오류:', error);
      useToast().toast({
        title: "상태 변경 실패",
        description: "상태 변경 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  // Load managed locations when management dialog opens
  useEffect(() => {
    if (showManagementDialog) {
      loadManagedLocations();
    }
  }, [showManagementDialog]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">위치 찾기</h1>
          <p className="text-gray-600 dark:text-gray-400">내 주변의 반려견 관련 시설을 찾아보세요</p>
        </div>

        {/* 관리자용 업체 등록 버튼 */}
        {userRole === 'admin' && (
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowAdminDialog(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                업체 등록
              </Button>
              <Button 
                onClick={() => setShowManagementDialog(true)}
                variant="outline"
              >
                <Settings className="h-4 w-4 mr-2" />
                업체 관리
              </Button>
            </div>
          )}
      </div>

      {/* 관리자용 통계 카드 */}
      {userRole === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">전체 업체</p>
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
                  <p className="text-sm text-gray-600">활성 업체</p>
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
                  <p className="text-sm text-gray-600">파트너 업체</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {locations.filter(l => l.isPartner).length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="업체명 또는 주소로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="업체 유형" />
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
            {userRole === 'admin' && (
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
            )}
          </div>
        </CardContent>
      </Card>

      {/* 위치 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLocations.map((location) => (
          <Card key={location.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative h-48" onClick={() => handleLocationClick(location)}>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLocationClick(location);
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  상세보기
                </Button>

                {userRole === 'admin' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditLocationItem(location);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      편집
                    </Button>
                    <Select onValueChange={(value) => handleStatusChange(location.id, value)}>
                      <SelectTrigger className="w-24">
                        <Settings className="h-3 w-3" />
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLocation(location.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>

              {userRole === 'admin' && (
                <div className="mt-3 text-xs text-gray-500">
                  등록: {location.createdAt} | 수정: {location.updatedAt}
                </div>
              )}
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

      {/* 상세 보기 모달 */}
      {selectedLocation && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-lg">{getTypeIcon(selectedLocation.type)}</span>
                {selectedLocation.name}
                {selectedLocation.isPartner && (
                  <Badge className="bg-blue-600">파트너</Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <img
                src={selectedLocation.image}
                alt={selectedLocation.name}
                className="w-full h-64 object-cover rounded-md"
              />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedLocation.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{selectedLocation.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>운영시간: {selectedLocation.operatingHours.open} - {selectedLocation.operatingHours.close}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{selectedLocation.rating} ({selectedLocation.reviewCount} 후기)</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">서비스</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedLocation.services.map((service, index) => (
                    <Badge key={index} variant="outline">{service}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">설명</h4>
                <p className="text-gray-600">{selectedLocation.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">가격대</h4>
                <p className="text-gray-600">{selectedLocation.priceRange}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 편집 모달 */}
      {editingLocationItem && (
        <Dialog open={!!editingLocationItem} onOpenChange={() => setEditingLocation(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>업체 정보 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">업체명</label>
                  <Input
                    value={editingLocationItem.name}
                    onChange={(e) => setEditingLocation({...editingLocationItem, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">업체 유형</label>
                  <Select
                    value={editingLocationItem.type}
                    onValueChange={(value) => setEditingLocation({...editingLocationItem, type: value as any})}
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
                  value={editingLocationItem.address}
                  onChange={(e) => setEditingLocation({...editingLocationItem, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">전화번호</label>
                  <Input
                    value={editingLocationItem.phone}
                    onChange={(e) => setEditingLocation({...editingLocationItem, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">가격대</label>
                  <Input
                    value={editingLocationItem.priceRange}
                    onChange={(e) => setEditingLocation({...editingLocationItem, priceRange: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">업체 설명</label>
                <Textarea
                  value={editingLocationItem.description}
                  onChange={(e) => setEditingLocation({...editingLocationItem, description: e.target.value})}
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
      
      
        {showAdminDialog && (
          <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>새 업체 등록</DialogTitle>
                <DialogDescription>
                  위치 찾기에 표시될 새로운 업체를 등록합니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">업체명 *</label>
                    <Input
                      placeholder="업체명을 입력하세요"
                      value={newLocationData.name}
                      onChange={(e) => setNewLocationData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">업체 유형 *</label>
                    <Select onValueChange={(value) => setNewLocationData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="업체 유형 선택" />
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
                    placeholder="업체 주소를 입력하세요"
                    value={newLocationData.address}
                    onChange={(e) => setNewLocationData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">전화번호</label>
                    <Input
                      placeholder="예: 02-1234-5678"
                      value={newLocationData.phone}
                      onChange={(e) => setNewLocationData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">가격대</label>
                    <Input
                      placeholder="예: 10만원-20만원"
                      value={newLocationData.priceRange}
                      onChange={(e) => setNewLocationData(prev => ({ ...prev, priceRange: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">업체 설명</label>
                  <Textarea
                    placeholder="업체에 대한 상세 설명을 입력하세요"
                    value={newLocationData.description}
                    onChange={(e) => setNewLocationData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">제공 서비스</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['기본 훈련', '행동 교정', '사회화 훈련', '아젤리티', '퍼피 클래스', '그루밍', '호텔링', '데이케어'].map((service) => (
                      <label key={service} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newLocationData.services.includes(service)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewLocationData(prev => ({
                                ...prev,
                                services: [...prev.services, service]
                              }));
                            } else {
                              setNewLocationData(prev => ({
                                ...prev,
                                services: prev.services.filter(s => s !== service)
                              }));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">운영 시간 (시작)</label>
                    <Input
                      type="time"
                      value={newLocationData.operatingHours.open}
                      onChange={(e) => setNewLocationData(prev => ({
                        ...prev,
                        operatingHours: { ...prev.operatingHours, open: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">운영 시간 (종료)</label>
                    <Input
                      type="time"
                      value={newLocationData.operatingHours.close}
                      onChange={(e) => setNewLocationData(prev => ({
                        ...prev,
                        operatingHours: { ...prev.operatingHours, close: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPartner"
                    checked={newLocationData.isPartner}
                    onChange={(e) => setNewLocationData(prev => ({ ...prev, isPartner: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="isPartner" className="text-sm font-medium">
                    공식 파트너 업체로 등록
                  </label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setShowAdminDialog(false)}>
                    취소
                  </Button>
                  <Button onClick={handleAdminLocationSave} disabled={!newLocationData.name || !newLocationData.type || !newLocationData.address}>
                    등록하기
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        
        {showManagementDialog && (
          <Dialog open={showManagementDialog} onOpenChange={setShowManagementDialog}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>등록된 업체 관리</DialogTitle>
                <DialogDescription>
                  등록된 업체들을 관리하고 수정할 수 있습니다.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="업체명으로 검색..."
                      value={managementSearchTerm}
                      onChange={(e) => setManagementSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select onValueChange={(value) => setManagementFilterType(value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="업체 유형" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="training">훈련소</SelectItem>
                      <SelectItem value="grooming">미용실</SelectItem>
                      <SelectItem value="hospital">동물병원</SelectItem>
                      <SelectItem value="hotel">펜션/호텔</SelectItem>
                      <SelectItem value="daycare">위탁관리</SelectItem>
                      <SelectItem value="park">놀이공원</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                
                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  {getFilteredManagementLocations().map((location) => (
                    <Card key={location.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{location.name}</h3>
                              <Badge variant={location.isPartner ? "default" : "secondary"}>
                                {location.isPartner ? "파트너" : "일반"}
                              </Badge>
                              <Badge variant={
                                location.status === 'active' ? "default" : 
                                location.status === 'pending' ? "secondary" : "destructive"
                              }>
                                {location.status === 'active' ? "활성" : 
                                 location.status === 'pending' ? "승인대기" : "비활성"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{location.address}</p>
                            <p className="text-sm text-gray-500">{location.phone}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {location.services.slice(0, 3).map((service, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                              {location.services.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{location.services.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditLocationInner(location)}
                            >
                              <Edit2 className="h-3 w-3 mr-1" />
                              수정
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleLocationStatus(location.id)}
                            >
                              {location.status === 'active' ? '비활성화' : '활성화'}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteLocationInner(location.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setShowManagementDialog(false)}>
                  닫기
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
    </div>
  );
}