import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit2, Trash2, Eye, Search, Filter } from 'lucide-react';

// 타입 정의
type BannerType = 'main' | 'event' | 'shop' | 'course' | 'trainer';
type BannerPosition = 'hero' | 'sidebar' | 'footer' | 'popup';
type BannerStatus = 'active' | 'inactive' | 'scheduled';

interface Banner {
  id: number;
  title: string;
  description?: string | null;
  imageUrl: string;
  altText: string;
  linkUrl?: string | null;
  targetBlank?: boolean;
  type: BannerType;
  position: BannerPosition;
  order: number;
  startDate?: string | null;
  endDate?: string | null;
  status: BannerStatus;
  createdAt: string;
  updatedAt: string;
}

interface BannerFormData {
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
  linkUrl: string;
  targetBlank: boolean;
  type: BannerType;
  position: BannerPosition;
  order: number;
  startDate: string | null;
  endDate: string | null;
  status: BannerStatus;
}

export default function BannerManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<BannerType>('main');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showBannerDialog, setShowBannerDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  
  // 배너 폼 상태
  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    description: '',
    imageUrl: '',
    altText: '',
    linkUrl: '',
    targetBlank: true,
    type: 'main',
    position: 'hero',
    order: 1,
    startDate: null,
    endDate: null,
    status: 'active'
  });
  
  // 배너 데이터 조회
  const { data: banners = [], isLoading, isError } = useQuery({
    queryKey: ['/api/admin/banners'],
    queryFn: async () => {
      const response = await fetch('/api/admin/banners', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('배너 데이터를 불러오는데 실패했습니다');
      }
      return response.json();
    }
  });
  
  // 배너 생성 뮤테이션
  const createBannerMutation = useMutation({
    mutationFn: async (data: BannerFormData) => {
      const response = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          orderIndex: data.order
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '배너 생성에 실패했습니다');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['/api/admin/banners']});
      setShowBannerDialog(false);
      resetForm();
      toast({
        title: '배너 생성 완료',
        description: '새로운 배너가 성공적으로 생성되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        title: '배너 생성 실패',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // 배너 수정 뮤테이션
  const updateBannerMutation = useMutation({
    mutationFn: async (data: BannerFormData & { id: number }) => {
      const response = await fetch(`/api/admin/banners/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          orderIndex: data.order
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '배너 수정에 실패했습니다');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['/api/admin/banners']});
      setShowBannerDialog(false);
      resetForm();
      toast({
        title: '배너 수정 완료',
        description: '배너가 성공적으로 수정되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        title: '배너 수정 실패',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // 배너 삭제 뮤테이션
  const deleteBannerMutation = useMutation({
    mutationFn: async (bannerId: number) => {
      const response = await fetch(`/api/admin/banners/${bannerId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '배너 삭제에 실패했습니다');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['/api/admin/banners']});
      toast({
        title: '배너 삭제 완료',
        description: '배너가 성공적으로 삭제되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        title: '배너 삭제 실패',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // 필터링된 배너 목록
  const filteredBanners = banners.filter(banner => {
    if (banner.type !== activeTab) return false;
    
    if (searchTerm && !banner.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !(banner.description && banner.description.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    if (filterPosition && filterPosition !== 'all' && banner.position !== filterPosition) {
      return false;
    }
    
    if (filterStatus && filterStatus !== 'all' && banner.status !== filterStatus) {
      return false;
    }
    
    return true;
  });
  
  // 페이지네이션 처리
  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);
  const paginatedBanners = filteredBanners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // 폼 초기화
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      altText: '',
      linkUrl: '',
      targetBlank: true,
      type: activeTab,
      position: 'hero',
      order: 1,
      startDate: null,
      endDate: null,
      status: 'active'
    });
    setSelectedBanner(null);
  };

  // 배너 편집
  const handleEditBanner = (banner: Banner) => {
    setDialogMode('edit');
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      imageUrl: banner.imageUrl,
      altText: banner.altText,
      linkUrl: banner.linkUrl || '',
      targetBlank: banner.targetBlank || false,
      type: banner.type,
      position: banner.position,
      order: banner.order,
      startDate: banner.startDate,
      endDate: banner.endDate,
      status: banner.status
    });
    setShowBannerDialog(true);
  };

  // 새 배너 추가
  const handleAddBanner = () => {
    setDialogMode('add');
    resetForm();
    setShowBannerDialog(true);
  };

  // 배너 삭제
  const handleDeleteBanner = (bannerId: number) => {
    if (confirm('정말로 이 배너를 삭제하시겠습니까?')) {
      deleteBannerMutation.mutate(bannerId);
    }
  };

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.imageUrl || !formData.altText) {
      toast({
        title: '필수 정보 누락',
        description: '제목, 이미지 URL, 대체 텍스트는 필수 입력 항목입니다.',
        variant: 'destructive',
      });
      return;
    }

    if (dialogMode === 'add') {
      createBannerMutation.mutate(formData);
    } else if (selectedBanner) {
      updateBannerMutation.mutate({ ...formData, id: selectedBanner.id });
    }
  };

  const StatusBadge = ({ status }: { status: BannerStatus }) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', text: '활성' },
      inactive: { color: 'bg-gray-100 text-gray-800', text: '비활성' },
      scheduled: { color: 'bg-blue-100 text-blue-800', text: '예약' }
    };
    
    const config = statusConfig[status];
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-600">
        배너 데이터를 불러오는데 실패했습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">배너 관리</h1>
        <Button onClick={handleAddBanner}>
          <Plus className="w-4 h-4 mr-2" />
          새 배너 추가
        </Button>
      </div>

      {/* 탭과 필터 */}
      <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as BannerType)}>
        <TabsList>
          <TabsTrigger value="main">메인</TabsTrigger>
          <TabsTrigger value="event">이벤트</TabsTrigger>
          <TabsTrigger value="shop">쇼핑</TabsTrigger>
          <TabsTrigger value="course">강의</TabsTrigger>
          <TabsTrigger value="trainer">훈련사</TabsTrigger>
        </TabsList>

        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <Input
              placeholder="배너 제목 또는 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterPosition || ''} onValueChange={setFilterPosition}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="위치 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 위치</SelectItem>
              <SelectItem value="hero">히어로</SelectItem>
              <SelectItem value="sidebar">사이드바</SelectItem>
              <SelectItem value="footer">푸터</SelectItem>
              <SelectItem value="popup">팝업</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus || ''} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="상태 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 상태</SelectItem>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="inactive">비활성</SelectItem>
              <SelectItem value="scheduled">예약</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4">
            {paginatedBanners.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  등록된 배너가 없습니다.
                </CardContent>
              </Card>
            ) : (
              paginatedBanners.map((banner) => (
                <Card key={banner.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={banner.imageUrl}
                        alt={banner.altText}
                        className="w-24 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{banner.title}</h3>
                            {banner.description && (
                              <p className="text-gray-600 mt-1">{banner.description}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>위치: {banner.position}</span>
                              <span>순서: {banner.order}</span>
                              {banner.linkUrl && <span>링크: {banner.linkUrl}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={banner.status} />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditBanner(banner)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteBanner(banner.id)}
                              disabled={deleteBannerMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 배너 등록/수정 다이얼로그 */}
      <Dialog open={showBannerDialog} onOpenChange={setShowBannerDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'add' ? '새 배너 추가' : '배너 수정'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="altText">대체 텍스트 *</Label>
                <Input
                  id="altText"
                  value={formData.altText}
                  onChange={(e) => setFormData(prev => ({ ...prev, altText: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="imageUrl">이미지 URL *</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="linkUrl">링크 URL</Label>
              <Input
                id="linkUrl"
                type="url"
                value={formData.linkUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="type">타입</Label>
                <Select value={formData.type} onValueChange={(value: BannerType) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">메인</SelectItem>
                    <SelectItem value="event">이벤트</SelectItem>
                    <SelectItem value="shop">쇼핑</SelectItem>
                    <SelectItem value="course">강의</SelectItem>
                    <SelectItem value="trainer">훈련사</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="position">위치</Label>
                <Select value={formData.position} onValueChange={(value: BannerPosition) => setFormData(prev => ({ ...prev, position: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">히어로</SelectItem>
                    <SelectItem value="sidebar">사이드바</SelectItem>
                    <SelectItem value="footer">푸터</SelectItem>
                    <SelectItem value="popup">팝업</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="order">순서</Label>
                <Input
                  id="order"
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status">상태</Label>
                <Select value={formData.status} onValueChange={(value: BannerStatus) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">활성</SelectItem>
                    <SelectItem value="inactive">비활성</SelectItem>
                    <SelectItem value="scheduled">예약</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate">시작일</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value || null }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">종료일</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value || null }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="targetBlank"
                checked={formData.targetBlank}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, targetBlank: checked }))}
              />
              <Label htmlFor="targetBlank">새 창에서 열기</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowBannerDialog(false)}>
                취소
              </Button>
              <Button 
                type="submit" 
                disabled={createBannerMutation.isPending || updateBannerMutation.isPending}
              >
                {dialogMode === 'add' ? '배너 추가' : '배너 수정'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}