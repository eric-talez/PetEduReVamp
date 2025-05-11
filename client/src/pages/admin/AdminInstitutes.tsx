import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  PlusCircle,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Building,
  BookOpen,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Copy,
  Eye,
  CreditCard,
  ClipboardCheck,
} from 'lucide-react';

// 기관 타입 정의
interface Institute {
  id: number;
  name: string;
  code: string;
  logo?: string;
  status: 'active' | 'pending' | 'inactive' | 'rejected';
  address: string;
  phone: string;
  email: string;
  website?: string;
  registerDate: string;
  trainerCount: number;
  studentCount: number;
  courseCount: number;
  adminName: string;
  adminEmail: string;
  description?: string;
  businessNumber?: string;
  verificationDocuments?: string[];
  paymentStatus?: 'free' | 'trial' | 'basic' | 'premium';
  expiryDate?: string;
}

export default function AdminInstitutes() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
  const [showInstituteModal, setShowInstituteModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add' | 'verify'>('view');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string | null>(null);

  // 기관 데이터 로드
  useEffect(() => {
    const loadInstitutes = async () => {
      setIsLoading(true);
      try {
        // 실제 구현 시 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 임시 데이터
        const mockInstitutes: Institute[] = [
          {
            id: 1,
            name: '알파 트레이닝 센터',
            code: 'ALPHA123',
            logo: '',
            status: 'active',
            address: '서울시 강남구 테헤란로 123',
            phone: '02-1234-5678',
            email: 'contact@alpha-training.com',
            website: 'www.alpha-training.com',
            registerDate: '2023-01-15',
            trainerCount: 38,
            studentCount: 215,
            courseCount: 42,
            adminName: '김지훈',
            adminEmail: 'admin@alpha-training.com',
            description: '반려견 전문 훈련 센터입니다.',
            businessNumber: '123-45-67890',
            paymentStatus: 'premium',
            expiryDate: '2025-01-14'
          },
          {
            id: 2,
            name: '베타 애견 학교',
            code: 'BETA456',
            status: 'active',
            address: '서울시 서초구 서초대로 456',
            phone: '02-2345-6789',
            email: 'info@beta-petschool.com',
            registerDate: '2023-02-20',
            trainerCount: 27,
            studentCount: 180,
            courseCount: 35,
            adminName: '이수진',
            adminEmail: 'admin@beta-petschool.com',
            businessNumber: '234-56-78901',
            paymentStatus: 'basic',
            expiryDate: '2024-08-19'
          },
          {
            id: 3,
            name: '감마 펫 아카데미',
            code: 'GAMMA789',
            status: 'active',
            address: '경기도 성남시 분당구 판교로 789',
            phone: '031-3456-7890',
            email: 'contact@gamma-academy.com',
            registerDate: '2023-03-10',
            trainerCount: 24,
            studentCount: 160,
            courseCount: 30,
            adminName: '박성민',
            adminEmail: 'admin@gamma-academy.com',
            paymentStatus: 'basic',
            expiryDate: '2024-09-09'
          },
          {
            id: 4,
            name: '오메가 훈련 학교',
            code: 'OMEGA012',
            status: 'pending',
            address: '서울시 송파구 올림픽로 101',
            phone: '02-4567-8901',
            email: 'omega-training@gmail.com',
            registerDate: '2023-04-05',
            trainerCount: 19,
            studentCount: 0,
            courseCount: 0,
            adminName: '최영희',
            adminEmail: 'admin@omega-training.com',
            description: '새롭게 오픈하는 반려동물 훈련 센터입니다.',
            businessNumber: '345-67-89012',
            paymentStatus: 'trial',
            expiryDate: '2024-05-19'
          },
          {
            id: 5,
            name: '델타 펫케어 센터',
            code: 'DELTA345',
            status: 'inactive',
            address: '경기도 고양시 일산동구 중앙로 234',
            phone: '031-5678-9012',
            email: 'info@delta-petcare.com',
            registerDate: '2023-05-15',
            trainerCount: 0,
            studentCount: 0,
            courseCount: 0,
            adminName: '정민우',
            adminEmail: 'admin@delta-petcare.com',
            paymentStatus: 'free'
          }
        ];
        
        setInstitutes(mockInstitutes);
      } catch (error) {
        console.error('기관 데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '기관 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInstitutes();
  }, [toast]);

  // 필터링된 기관 목록
  const getFilteredInstitutes = () => {
    let filtered = [...institutes];
    
    // 탭 필터링
    if (activeTab !== 'all') {
      filtered = filtered.filter(institute => institute.status === activeTab);
    }
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        institute => 
          institute.name.toLowerCase().includes(query) ||
          institute.email.toLowerCase().includes(query) ||
          institute.code.toLowerCase().includes(query) ||
          institute.adminName.toLowerCase().includes(query)
      );
    }
    
    // 결제 상태 필터링
    if (filterPaymentStatus) {
      filtered = filtered.filter(institute => institute.paymentStatus === filterPaymentStatus);
    }
    
    // 정렬
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'registerDate':
          comparison = new Date(a.registerDate).getTime() - new Date(b.registerDate).getTime();
          break;
        case 'trainerCount':
          comparison = a.trainerCount - b.trainerCount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  };

  // 페이지네이션 처리
  const filteredInstitutes = getFilteredInstitutes();
  const totalPages = Math.ceil(filteredInstitutes.length / itemsPerPage);
  const paginatedInstitutes = filteredInstitutes.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // 기관 상세 정보 보기
  const handleViewInstitute = (institute: Institute) => {
    setSelectedInstitute(institute);
    setModalMode('view');
    setShowInstituteModal(true);
  };

  // 기관 편집 모드
  const handleEditInstitute = (institute: Institute) => {
    setSelectedInstitute(institute);
    setModalMode('edit');
    setShowInstituteModal(true);
  };

  // 새 기관 추가 모드
  const handleAddInstitute = () => {
    setSelectedInstitute(null);
    setModalMode('add');
    setShowInstituteModal(true);
  };

  // 기관 상태 변경
  const handleChangeStatus = (instituteId: number, newStatus: 'active' | 'pending' | 'inactive' | 'rejected') => {
    setInstitutes(prev => prev.map(institute => 
      institute.id === instituteId ? { ...institute, status: newStatus } : institute
    ));
    
    const statusMap = {
      active: '활성',
      pending: '대기',
      inactive: '비활성',
      rejected: '거부'
    };
    
    toast({
      title: '기관 상태 변경',
      description: `기관 상태가 '${statusMap[newStatus]}'(으)로 변경되었습니다.`,
    });
    
    if (selectedInstitute && selectedInstitute.id === instituteId) {
      setSelectedInstitute({ ...selectedInstitute, status: newStatus });
    }
  };

  // 기관 삭제 처리
  const handleDeleteInstitute = (instituteId: number) => {
    if (window.confirm('정말로 이 기관을 삭제하시겠습니까?')) {
      setInstitutes(prev => prev.filter(institute => institute.id !== instituteId));
      setShowInstituteModal(false);
      
      toast({
        title: '기관 삭제',
        description: '기관이 성공적으로 삭제되었습니다.',
      });
    }
  };

  // 기관 코드 복사
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: '코드 복사',
      description: '기관 코드가 클립보드에 복사되었습니다.',
    });
  };

  // 상태별 배지 색상 및 아이콘
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            활성
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="outline" className="text-gray-500">
            <XCircle className="w-3 h-3 mr-1" />
            비활성
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-500">
            <AlertCircle className="w-3 h-3 mr-1" />
            대기
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500">
            <XCircle className="w-3 h-3 mr-1" />
            거부
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // 결제 상태별 배지
  const getPaymentStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    
    switch (status) {
      case 'premium':
        return <Badge className="bg-purple-500">프리미엄</Badge>;
      case 'basic':
        return <Badge className="bg-blue-500">베이직</Badge>;
      case 'trial':
        return <Badge className="bg-amber-500">무료 체험</Badge>;
      case 'free':
        return <Badge variant="outline">무료</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // 데이터 새로고침
  const handleRefresh = () => {
    setIsLoading(true);
    // 실제 구현 시 API 호출로 대체
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: '새로고침 완료',
        description: '기관 데이터가 업데이트되었습니다.',
      });
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">기관 관리</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddInstitute} variant="default">
            <PlusCircle className="mr-2 h-4 w-4" />
            기관 추가
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="active">활성</TabsTrigger>
            <TabsTrigger value="pending">대기</TabsTrigger>
            <TabsTrigger value="inactive">비활성</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="이름, 코드, 관리자 검색..."
                className="pl-8 h-9 md:w-[300px] w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterPaymentStatus || 'all'} onValueChange={setFilterPaymentStatus}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="결제 상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 결제 상태</SelectItem>
                <SelectItem value="premium">프리미엄</SelectItem>
                <SelectItem value="basic">베이직</SelectItem>
                <SelectItem value="trial">무료 체험</SelectItem>
                <SelectItem value="free">무료</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="ghost" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">No.</TableHead>
                  <TableHead>기관명</TableHead>
                  <TableHead>코드</TableHead>
                  <TableHead>위치</TableHead>
                  <TableHead className="text-center">훈련사</TableHead>
                  <TableHead>가입일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="flex justify-center">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">데이터를 불러오고 있습니다...</div>
                    </TableCell>
                  </TableRow>
                ) : paginatedInstitutes.length > 0 ? (
                  paginatedInstitutes.map((institute, index) => (
                    <TableRow key={institute.id}>
                      <TableCell className="font-medium">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={institute.logo} alt={institute.name} />
                            <AvatarFallback>{institute.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{institute.name}</div>
                            <div className="text-sm text-muted-foreground">{getPaymentStatusBadge(institute.paymentStatus)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span>{institute.code}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleCopyCode(institute.code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span className="truncate max-w-[200px]">{institute.address}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{institute.trainerCount}</TableCell>
                      <TableCell>{institute.registerDate}</TableCell>
                      <TableCell>{getStatusBadge(institute.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewInstitute(institute)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditInstitute(institute)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {institute.status === 'active' ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleChangeStatus(institute.id, 'inactive')}
                              className="text-amber-500"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleChangeStatus(institute.id, 'active')}
                              className="text-green-500"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="text-muted-foreground">검색 결과가 없습니다</div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          {!isLoading && totalPages > 1 && (
            <CardFooter className="flex justify-between py-4">
              <div className="text-sm text-muted-foreground">
                총 {filteredInstitutes.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredInstitutes.length)}개 표시
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage > 3 ? currentPage - 3 + i + 1 : i + 1;
                  if (pageNum <= totalPages) {
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                  return null;
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </Tabs>
      
      {/* 기관 상세 정보 모달 */}
      <Dialog open={showInstituteModal} onOpenChange={setShowInstituteModal}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {modalMode === 'add' ? '새 기관 추가' : 
               modalMode === 'edit' ? '기관 정보 수정' : 
               modalMode === 'verify' ? '기관 정보 검증' : 
               '기관 상세 정보'}
            </DialogTitle>
            <DialogDescription>
              {modalMode === 'add' ? '새로운 교육 기관을 시스템에 추가합니다.' : 
               modalMode === 'edit' ? '기관 정보를 수정합니다.' : 
               modalMode === 'verify' ? '기관 정보를 검증하고 승인합니다.' : 
               selectedInstitute ? `${selectedInstitute.name}의 상세 정보입니다.` : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInstitute && (modalMode === 'view' || modalMode === 'edit' || modalMode === 'verify') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={selectedInstitute.logo} alt={selectedInstitute.name} />
                    <AvatarFallback className="text-2xl">{selectedInstitute.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{selectedInstitute.name}</h3>
                    <div className="flex items-center justify-center space-x-2 mt-1">
                      <Badge variant="outline" className="font-mono">
                        {selectedInstitute.code}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4 ml-1 p-0" 
                          onClick={() => handleCopyCode(selectedInstitute.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </Badge>
                      {getStatusBadge(selectedInstitute.status)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground">기본 정보</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{selectedInstitute.address}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{selectedInstitute.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{selectedInstitute.email}</span>
                    </div>
                    {selectedInstitute.website && (
                      <div className="flex items-center text-sm">
                        <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{selectedInstitute.website}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>가입일: {selectedInstitute.registerDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground">관리자 정보</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>관리자: {selectedInstitute.adminName}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>관리자 이메일: {selectedInstitute.adminEmail}</span>
                    </div>
                  </div>
                </div>
                
                {selectedInstitute.description && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-muted-foreground">기관 소개</h4>
                    <p className="text-sm">{selectedInstitute.description}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground">통계</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-background rounded-lg border text-center">
                      <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-2xl font-bold">{selectedInstitute.trainerCount}</div>
                      <div className="text-xs text-muted-foreground">훈련사</div>
                    </div>
                    <div className="p-4 bg-background rounded-lg border text-center">
                      <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-2xl font-bold">{selectedInstitute.studentCount}</div>
                      <div className="text-xs text-muted-foreground">수강생</div>
                    </div>
                    <div className="p-4 bg-background rounded-lg border text-center">
                      <BookOpen className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-2xl font-bold">{selectedInstitute.courseCount}</div>
                      <div className="text-xs text-muted-foreground">강의</div>
                    </div>
                  </div>
                </div>
                
                {selectedInstitute.businessNumber && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-muted-foreground">사업자 정보</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <ClipboardCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>사업자 등록번호: {selectedInstitute.businessNumber}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground">결제 정보</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">결제 플랜:</span>
                      <div>
                        {getPaymentStatusBadge(selectedInstitute.paymentStatus)}
                      </div>
                    </div>
                    {selectedInstitute.expiryDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">만료일:</span>
                        <span className="text-sm font-medium">{selectedInstitute.expiryDate}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 모드별 버튼 */}
                {modalMode === 'view' && (
                  <div className="space-y-3 mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => { setModalMode('edit'); }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      기관 정보 수정
                    </Button>
                    {selectedInstitute.status === 'active' ? (
                      <Button 
                        variant="outline" 
                        className="w-full text-amber-500" 
                        onClick={() => { handleChangeStatus(selectedInstitute.id, 'inactive'); }}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        기관 비활성화
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full text-green-500" 
                        onClick={() => { handleChangeStatus(selectedInstitute.id, 'active'); }}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        기관 활성화
                      </Button>
                    )}
                    <Button 
                      variant="destructive" 
                      className="w-full" 
                      onClick={() => { handleDeleteInstitute(selectedInstitute.id); }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      기관 삭제
                    </Button>
                  </div>
                )}
                
                {modalMode === 'edit' && (
                  <div className="space-y-3 mt-6">
                    <Button 
                      className="w-full" 
                      onClick={() => { 
                        setModalMode('view');
                        toast({
                          title: '기관 정보 수정',
                          description: '기관 정보가 수정되었습니다.',
                        });
                      }}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      변경사항 저장
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => { setModalMode('view'); }}
                    >
                      취소
                    </Button>
                  </div>
                )}
                
                {modalMode === 'verify' && (
                  <div className="space-y-3 mt-6">
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600" 
                      onClick={() => { 
                        handleChangeStatus(selectedInstitute.id, 'active');
                        setModalMode('view');
                      }}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      승인하기
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full" 
                      onClick={() => { 
                        handleChangeStatus(selectedInstitute.id, 'rejected');
                        setModalMode('view');
                      }}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      거부하기
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => { setModalMode('view'); }}
                    >
                      검토 보류
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* 추가 모드 양식 */}
          {modalMode === 'add' && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm">기관명</label>
                <Input id="name" className="col-span-3" placeholder="기관 이름" autoFocus />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="code" className="text-right text-sm">코드</label>
                <div className="col-span-3 flex space-x-2">
                  <Input id="code" placeholder="고유 기관 코드" />
                  <Button variant="outline" size="sm">자동 생성</Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="address" className="text-right text-sm">주소</label>
                <Input id="address" className="col-span-3" placeholder="기관 주소" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phone" className="text-right text-sm">전화번호</label>
                <Input id="phone" className="col-span-3" placeholder="연락처" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right text-sm">이메일</label>
                <Input id="email" type="email" className="col-span-3" placeholder="이메일 주소" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="website" className="text-right text-sm">웹사이트</label>
                <Input id="website" className="col-span-3" placeholder="웹사이트 주소 (선택사항)" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="adminName" className="text-right text-sm">관리자 이름</label>
                <Input id="adminName" className="col-span-3" placeholder="관리자 이름" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="adminEmail" className="text-right text-sm">관리자 이메일</label>
                <Input id="adminEmail" type="email" className="col-span-3" placeholder="관리자 이메일" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="businessNumber" className="text-right text-sm">사업자 번호</label>
                <Input id="businessNumber" className="col-span-3" placeholder="사업자 등록번호 (선택사항)" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="status" className="text-right text-sm">상태</label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">활성</SelectItem>
                    <SelectItem value="pending">대기</SelectItem>
                    <SelectItem value="inactive">비활성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="paymentStatus" className="text-right text-sm">결제 플랜</label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="결제 플랜 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">프리미엄</SelectItem>
                    <SelectItem value="basic">베이직</SelectItem>
                    <SelectItem value="trial">무료 체험</SelectItem>
                    <SelectItem value="free">무료</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {modalMode === 'add' && (
              <Button 
                type="submit" 
                onClick={() => {
                  setShowInstituteModal(false);
                  toast({
                    title: '기관 추가',
                    description: '기관이 성공적으로 추가되었습니다.',
                  });
                }}
              >
                기관 추가
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}