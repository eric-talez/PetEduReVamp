import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Search, 
  Eye, 
  ImagePlus,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePicker } from '@/components/ui/datepicker';
import { Pagination } from "@/components/ui/pagination";
import { apiRequest, queryClient } from '@/lib/queryClient';
import { FileUpload } from '@/components/ui/file-upload';
import { Banner } from '@/components/ui/banner';

// 배너 유형 정의
type BannerType = 'main' | 'event' | 'shop' | 'course' | 'trainer';
type BannerPosition = 'hero' | 'sidebar' | 'footer' | 'popup';
type BannerStatus = 'active' | 'inactive' | 'scheduled';

// 배너 인터페이스
interface Banner {
  id: number;
  title: string;
  description?: string | null;
  imageUrl: string;
  altText: string; // 접근성을 위한 대체 텍스트
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

// 배너 생성/수정을 위한 폼 데이터 인터페이스
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
  const [activeTab, setActiveTab] = useState<BannerType>('main');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showBannerDialog, setShowBannerDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  
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
      // 실제 환경에서는 API 호출로 대체
      // 현재는 테스트 데이터 반환
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 테스트 데이터
      const mockBanners: Banner[] = [
        {
          id: 1,
          title: '여름 특별 훈련 프로그램',
          description: '여름 시즌 반려견 수영 및 야외 활동 특별 프로그램을 소개합니다.',
          imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=750&q=80',
          altText: '반려견들이 함께 뛰어놀고 있는 모습 - 다양한 반려동물 이벤트와 행사 정보를 찾아볼 수 있는 페이지',
          linkUrl: '/events',
          targetBlank: false,
          type: 'main',
          position: 'hero',
          order: 1,
          startDate: '2024-05-01',
          endDate: '2024-09-30',
          status: 'active',
          createdAt: '2024-04-15 09:30:00',
          updatedAt: '2024-04-15 09:30:00'
        },
        {
          id: 2,
          title: '프리미엄 사료 할인전',
          description: '건강한 영양을 위한 최고급 사료 모음. 회원 전용 특별 할인!',
          imageUrl: 'https://images.unsplash.com/photo-1583511666372-62fc211f8377?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=750&q=80',
          altText: '신선한 재료로 만든 고품질 프리미엄 반려동물 사료 - 할인된 가격으로 만나보세요',
          linkUrl: '/shop/category/food',
          targetBlank: true,
          type: 'shop',
          position: 'hero',
          order: 1,
          startDate: '2024-05-10',
          endDate: '2024-06-10',
          status: 'active',
          createdAt: '2024-05-01 14:20:00',
          updatedAt: '2024-05-01 14:20:00'
        },
        {
          id: 3,
          title: '실시간 화상 수업 오픈',
          description: '자격을 갖춘 전문 훈련사와 함께 실시간으로 소통하며 맞춤형 훈련 지도를 받으세요.',
          imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400',
          altText: '전문 훈련사와 반려견이 함께하는 실시간 화상 수업 - 개인 맞춤형 및 그룹 수업 제공',
          linkUrl: '/video-call',
          targetBlank: false,
          type: 'course',
          position: 'hero',
          order: 1,
          startDate: null,
          endDate: null,
          status: 'active',
          createdAt: '2024-04-20 11:30:45',
          updatedAt: '2024-04-20 11:30:45'
        },
        {
          id: 4,
          title: '훈련사 전문 과정 안내',
          description: '전문 훈련사 양성 과정에 관심이 있으신가요? 자격증 취득 및 취업 정보를 확인하세요.',
          imageUrl: 'https://images.unsplash.com/photo-1592754862816-1a21a4ea2281?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=750&q=80',
          altText: '전문성을 갖춘 훈련사와 반려견의 훈련 장면 - 훈련사 양성 과정 안내',
          linkUrl: '/trainer/courses',
          targetBlank: false,
          type: 'trainer',
          position: 'hero',
          order: 1,
          startDate: null,
          endDate: null,
          status: 'active',
          createdAt: '2024-03-15 16:40:20',
          updatedAt: '2024-03-15 16:40:20'
        },
        {
          id: 5,
          title: '반려동물 페스티벌 안내',
          description: '다양한 체험과 이벤트가 준비된 대규모 반려동물 페스티벌에 참가하세요!',
          imageUrl: 'https://images.unsplash.com/photo-1508948956644-0017be98e1bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=750&q=80',
          altText: '다양한 반려동물과 보호자들이 참여하는 야외 페스티벌 현장 - 체험 및 이벤트 정보',
          linkUrl: '/events/festival-2024',
          targetBlank: false,
          type: 'event',
          position: 'hero',
          order: 1,
          startDate: '2024-06-01',
          endDate: '2024-06-30',
          status: 'scheduled',
          createdAt: '2024-05-01 09:15:30',
          updatedAt: '2024-05-01 09:15:30'
        }
      ];
      
      return mockBanners;
    }
  });
  
  // 배너 생성 뮤테이션
  const createBannerMutation = useMutation({
    mutationFn: async (data: BannerFormData) => {
      // 실제 환경에서는 API 호출로 대체
      console.log('배너 생성 요청:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 모의 응답
      return {
        ...data,
        id: Math.floor(Math.random() * 1000) + 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
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
      console.error('배너 생성 오류:', error);
      toast({
        title: '배너 생성 실패',
        description: '배너를 생성하는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  });
  
  // 배너 수정 뮤테이션
  const updateBannerMutation = useMutation({
    mutationFn: async (data: BannerFormData & { id: number }) => {
      // 실제 환경에서는 API 호출로 대체
      console.log('배너 수정 요청:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 모의 응답
      return {
        ...data,
        updatedAt: new Date().toISOString()
      };
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
      console.error('배너 수정 오류:', error);
      toast({
        title: '배너 수정 실패',
        description: '배너를 수정하는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  });
  
  // 배너 삭제 뮤테이션
  const deleteBannerMutation = useMutation({
    mutationFn: async (bannerId: number) => {
      // 실제 환경에서는 API 호출로 대체
      console.log('배너 삭제 요청:', bannerId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['/api/admin/banners']});
      toast({
        title: '배너 삭제 완료',
        description: '배너가 성공적으로 삭제되었습니다.',
      });
    },
    onError: (error) => {
      console.error('배너 삭제 오류:', error);
      toast({
        title: '배너 삭제 실패',
        description: '배너를 삭제하는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  });
  
  // 필터링된 배너 목록
  const filteredBanners = banners.filter(banner => {
    // 탭 필터링
    if (banner.type !== activeTab) return false;
    
    // 검색어 필터링
    if (searchTerm && !banner.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !(banner.description && banner.description.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // 위치 필터링
    if (filterPosition && filterPosition !== 'all' && banner.position !== filterPosition) {
      return false;
    }
    
    // 상태 필터링
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
  
  // 배너 추가 다이얼로그 열기
  const handleAddBanner = () => {
    setDialogMode('add');
    resetForm();
    setFormData(prev => ({
      ...prev,
      type: activeTab
    }));
    setShowBannerDialog(true);
  };
  
  // 배너 수정 다이얼로그 열기
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
      startDate: banner.startDate || null,
      endDate: banner.endDate || null,
      status: banner.status
    });
    setShowBannerDialog(true);
  };
  
  // 프리뷰 모드 전환
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };
  
  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.title || !formData.imageUrl || !formData.altText) {
      toast({
        title: '필수 항목 확인',
        description: '제목, 이미지 URL, 대체 텍스트는 필수 항목입니다.',
        variant: 'destructive',
      });
      return;
    }
    
    if (dialogMode === 'add') {
      createBannerMutation.mutate(formData);
    } else if (dialogMode === 'edit' && selectedBanner) {
      updateBannerMutation.mutate({
        ...formData,
        id: selectedBanner.id
      });
    }
  };
  
  // 배너 삭제 처리
  const handleDeleteBanner = (bannerId: number) => {
    if (confirm('정말 이 배너를 삭제하시겠습니까?')) {
      deleteBannerMutation.mutate(bannerId);
    }
  };
  
  // 입력 필드 변경 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 선택 필드 변경 처리
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 토글 필드 변경 처리
  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // 이미지 업로드 처리
  const handleImageUpload = (imageBase64: string | null) => {
    if (imageBase64) {
      setFormData(prev => ({
        ...prev,
        imageUrl: imageBase64
      }));
    }
  };
  
  // 상태 표시 배지
  const StatusBadge = ({ status }: { status: BannerStatus }) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">활성</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">비활성</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">예약됨</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">배너 관리</h1>
        
        <Button onClick={handleAddBanner}>
          <PlusCircle className="h-4 w-4 mr-2" />
          새 배너 추가
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BannerType)} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="main">메인 배너</TabsTrigger>
              <TabsTrigger value="event">이벤트 배너</TabsTrigger>
              <TabsTrigger value="shop">쇼핑 배너</TabsTrigger>
              <TabsTrigger value="course">수업 배너</TabsTrigger>
              <TabsTrigger value="trainer">훈련사 배너</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="배너 검색..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Select value={filterPosition || 'all'} onValueChange={(value) => setFilterPosition(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="위치별 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 위치</SelectItem>
                  <SelectItem value="hero">히어로 영역</SelectItem>
                  <SelectItem value="sidebar">사이드바</SelectItem>
                  <SelectItem value="footer">푸터</SelectItem>
                  <SelectItem value="popup">팝업</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus || 'all'} onValueChange={(value) => setFilterStatus(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="상태별 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                  <SelectItem value="scheduled">예약됨</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={togglePreviewMode}>
                {previewMode ? '목록 보기' : '미리보기'}
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : isError ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center text-red-500">
                  <p className="text-xl font-semibold">데이터를 불러오는 중 오류가 발생했습니다</p>
                  <p>잠시 후 다시 시도해주세요</p>
                </div>
              </div>
            ) : (
              <>
                {previewMode ? (
                  // 미리보기 모드
                  <div className="grid grid-cols-1 gap-8">
                    {paginatedBanners.map(banner => (
                      <div key={banner.id} className="relative">
                        <Badge className="absolute top-2 right-2 z-10">
                          {banner.position} / {banner.status}
                        </Badge>
                        
                        <Banner
                          imageUrl={banner.imageUrl}
                          title={banner.title}
                          description={banner.description || undefined}
                          altText={banner.altText}
                          ariaLabel={`${banner.type} 배너 - ${banner.title}`}
                        >
                          {banner.linkUrl && (
                            <Button variant="default" asChild>
                              <a href={banner.linkUrl} target={banner.targetBlank ? "_blank" : "_self"} rel="noopener noreferrer">
                                자세히 보기
                              </a>
                            </Button>
                          )}
                        </Banner>
                        
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditBanner(banner)}>
                            <Pencil className="h-4 w-4 mr-1" /> 수정
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteBanner(banner.id)}>
                            <Trash2 className="h-4 w-4 mr-1" /> 삭제
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // 목록 모드
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>미리보기</TableHead>
                        <TableHead>제목</TableHead>
                        <TableHead>위치</TableHead>
                        <TableHead>순서</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>게시 기간</TableHead>
                        <TableHead>작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedBanners.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            해당 조건에 맞는 배너가 없습니다
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedBanners.map(banner => (
                          <TableRow key={banner.id}>
                            <TableCell>{banner.id}</TableCell>
                            <TableCell>
                              <div className="relative w-16 h-9 rounded overflow-hidden">
                                <img 
                                  src={banner.imageUrl} 
                                  alt={banner.altText}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{banner.title}</div>
                              {banner.linkUrl && (
                                <div className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
                                  {banner.linkUrl}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{banner.position}</TableCell>
                            <TableCell>{banner.order}</TableCell>
                            <TableCell>
                              <StatusBadge status={banner.status} />
                            </TableCell>
                            <TableCell>
                              {banner.startDate || banner.endDate ? (
                                <span className="text-xs">
                                  {banner.startDate ? new Date(banner.startDate).toLocaleDateString() : '무기한'} ~ {banner.endDate ? new Date(banner.endDate).toLocaleDateString() : '무기한'}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">무기한</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleEditBanner(banner)}>
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">수정</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteBanner(banner.id)}>
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">삭제</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
                
                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
      
      {/* 배너 추가/수정 다이얼로그 */}
      <Dialog open={showBannerDialog} onOpenChange={setShowBannerDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'add' ? '새 배너 추가' : '배너 수정'}</DialogTitle>
            <DialogDescription>
              {dialogMode === 'add' ? 
                '새로운 배너를 추가합니다. 필수 항목을 모두 입력해주세요.' : 
                '기존 배너 정보를 수정합니다.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="altText">대체 텍스트 (접근성) *</Label>
                  <Textarea
                    id="altText"
                    name="altText"
                    value={formData.altText}
                    onChange={handleInputChange}
                    placeholder="시각 장애인을 위한 이미지 설명을 상세히 입력하세요"
                    required
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    시각 장애인이 이미지를 볼 수 없을 때 스크린 리더가 읽어주는 텍스트입니다. 
                    이미지의 내용과 맥락을 명확하게, 그리고 간결하게 설명해주세요.
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="linkUrl">링크 URL</Label>
                  <Input
                    id="linkUrl"
                    name="linkUrl"
                    value={formData.linkUrl}
                    onChange={handleInputChange}
                    placeholder="예: /events, https://example.com"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="targetBlank"
                    checked={formData.targetBlank}
                    onCheckedChange={(checked) => handleToggleChange('targetBlank', checked)}
                  />
                  <Label htmlFor="targetBlank">새 창에서 열기</Label>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>배너 이미지 *</Label>
                  <FileUpload
                    value={formData.imageUrl || null}
                    onChange={handleImageUpload}
                    accept="image/*"
                    maxSizeMB={5}
                    previewWidth={300}
                    previewHeight={150}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">배너 유형</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">메인 배너</SelectItem>
                        <SelectItem value="event">이벤트 배너</SelectItem>
                        <SelectItem value="shop">쇼핑 배너</SelectItem>
                        <SelectItem value="course">수업 배너</SelectItem>
                        <SelectItem value="trainer">훈련사 배너</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="position">배너 위치</Label>
                    <Select 
                      value={formData.position} 
                      onValueChange={(value) => handleSelectChange('position', value as BannerPosition)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hero">히어로 영역</SelectItem>
                        <SelectItem value="sidebar">사이드바</SelectItem>
                        <SelectItem value="footer">푸터</SelectItem>
                        <SelectItem value="popup">팝업</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">상태</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => handleSelectChange('status', value as BannerStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">활성</SelectItem>
                        <SelectItem value="inactive">비활성</SelectItem>
                        <SelectItem value="scheduled">예약됨</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="order">순서</Label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      min="1"
                      value={formData.order}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">시작일</Label>
                    <DatePicker
                      date={formData.startDate ? new Date(formData.startDate) : undefined} 
                      onSelect={(date) => handleSelectChange('startDate', date ? date.toISOString().split('T')[0] : null)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endDate">종료일</Label>
                    <DatePicker
                      date={formData.endDate ? new Date(formData.endDate) : undefined}
                      onSelect={(date) => handleSelectChange('endDate', date ? date.toISOString().split('T')[0] : null)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowBannerDialog(false)}>
                취소
              </Button>
              <Button type="submit" disabled={createBannerMutation.isPending || updateBannerMutation.isPending}>
                {createBannerMutation.isPending || updateBannerMutation.isPending ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    처리 중...
                  </>
                ) : (
                  dialogMode === 'add' ? '배너 추가' : '배너 수정'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}