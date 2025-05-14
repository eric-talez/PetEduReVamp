import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-compat';
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
  User,
  Users,
  Building,
  BookOpen,
  Award,
  Star,
  Clipboard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone
} from 'lucide-react';

// 훈련사 타입 정의
interface Trainer {
  id: number;
  name: string;
  image?: string;
  specialty: string;
  bio?: string;
  email: string;
  phone?: string;
  status: 'active' | 'pending' | 'inactive' | 'suspended';
  verified: boolean;
  rating: number;
  reviewCount: number;
  instituteName?: string;
  instituteId?: number;
  courseCount: number;
  studentCount: number;
  completionRate: number;
  joinDate: string;
  certifications: string[];
  skills?: string[];
  availability?: {
    monday?: string[];
    tuesday?: string[];
    wednesday?: string[];
    thursday?: string[];
    friday?: string[];
    saturday?: string[];
    sunday?: string[];
  };
}

export default function AdminTrainers() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add' | 'verify'>('view');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterSpecialty, setFilterSpecialty] = useState<string | null>(null);
  const [filterInstitute, setFilterInstitute] = useState<string | null>(null);

  // 훈련사 데이터 로드
  useEffect(() => {
    const loadTrainers = async () => {
      setIsLoading(true);
      try {
        // 실제 구현 시 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 임시 데이터
        const mockTrainers: Trainer[] = [
          {
            id: 1,
            name: '김영수',
            specialty: '기초 훈련',
            bio: '10년 경력의 반려견 전문 훈련사입니다. 온순한 성격의 모든 견종 훈련이 가능합니다.',
            email: 'youngsoo.kim@example.com',
            phone: '010-1234-5678',
            status: 'active',
            verified: true,
            rating: 4.8,
            reviewCount: 152,
            instituteName: '알파 트레이닝 센터',
            instituteId: 1,
            courseCount: 8,
            studentCount: 45,
            completionRate: 92,
            joinDate: '2023-01-15',
            certifications: ['KKC 공인 훈련사', '반려동물행동교정사 1급'],
            skills: ['기초 복종 훈련', '공격성 관리', '사회화']
          },
          {
            id: 2,
            name: '이하은',
            specialty: '문제행동 교정',
            bio: '공격성, 분리불안, 과도한 짖음 등 다양한 문제행동을 교정합니다.',
            email: 'haeun.lee@example.com',
            phone: '010-2345-6789',
            status: 'active',
            verified: true,
            rating: 4.9,
            reviewCount: 98,
            instituteName: '베타 애견 학교',
            instituteId: 2,
            courseCount: 5,
            studentCount: 32,
            completionRate: 95,
            joinDate: '2023-02-20',
            certifications: ['동물행동전문가', '반려동물훈련사 자격증']
          },
          {
            id: 3,
            name: '박지민',
            specialty: '사회화',
            bio: '어린 강아지부터 성견까지 건강한 사회화를 돕습니다.',
            email: 'jimin.park@example.com',
            phone: '010-3456-7890',
            status: 'active',
            verified: true,
            rating: 4.7,
            reviewCount: 85,
            instituteName: '감마 펫 아카데미',
            instituteId: 3,
            courseCount: 6,
            studentCount: 28,
            completionRate: 89,
            joinDate: '2023-03-10',
            certifications: ['반려동물행동교정사', '애견사회화지도사']
          },
          {
            id: 4,
            name: '최민준',
            specialty: '고급 훈련',
            bio: '경비견, 안내견 등 특수목적 견종 훈련 전문가입니다.',
            email: 'minjun.choi@example.com',
            phone: '010-4567-8901',
            status: 'pending',
            verified: false,
            rating: 0,
            reviewCount: 0,
            instituteName: '오메가 훈련 학교',
            instituteId: 4,
            courseCount: 0,
            studentCount: 0,
            completionRate: 0,
            joinDate: '2023-04-05',
            certifications: ['국제애견훈련사', '특수목적견 훈련사']
          },
          {
            id: 5,
            name: '정서연',
            specialty: '재활 훈련',
            bio: '트라우마가 있는 유기견, 학대견 재활훈련을 전문으로 합니다.',
            email: 'seoyeon.jung@example.com',
            phone: '010-5678-9012',
            status: 'inactive',
            verified: true,
            rating: 4.6,
            reviewCount: 45,
            courseCount: 3,
            studentCount: 12,
            completionRate: 83,
            joinDate: '2023-05-15',
            certifications: ['반려동물심리상담사', '동물매개치료사']
          }
        ];
        
        setTrainers(mockTrainers);
      } catch (error) {
        console.error('훈련사 데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '훈련사 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTrainers();
  }, [toast]);

  // 필터링된 훈련사 목록
  const getFilteredTrainers = () => {
    let filtered = [...trainers];
    
    // 탭 필터링
    if (activeTab !== 'all') {
      filtered = filtered.filter(trainer => trainer.status === activeTab);
    }
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        trainer => 
          trainer.name.toLowerCase().includes(query) ||
          trainer.email.toLowerCase().includes(query) ||
          trainer.specialty.toLowerCase().includes(query) ||
          (trainer.instituteName && trainer.instituteName.toLowerCase().includes(query))
      );
    }
    
    // 전문 분야 필터링
    if (filterSpecialty) {
      filtered = filtered.filter(trainer => trainer.specialty === filterSpecialty);
    }
    
    // 기관 필터링
    if (filterInstitute) {
      filtered = filtered.filter(trainer => trainer.instituteName === filterInstitute);
    }
    
    // 정렬
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rating':
          comparison = b.rating - a.rating;
          break;
        case 'reviewCount':
          comparison = b.reviewCount - a.reviewCount;
          break;
        case 'studentCount':
          comparison = b.studentCount - a.studentCount;
          break;
        case 'joinDate':
          comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  };

  // 페이지네이션 처리
  const filteredTrainers = getFilteredTrainers();
  const totalPages = Math.ceil(filteredTrainers.length / itemsPerPage);
  const paginatedTrainers = filteredTrainers.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // 고유한 전문 분야 목록
  const specialties = Array.from(new Set(trainers.map(trainer => trainer.specialty)));
  
  // 고유한 기관 목록
  const institutes = Array.from(new Set(
    trainers
      .filter(trainer => trainer.instituteName)
      .map(trainer => trainer.instituteName)
  )) as string[];

  // 훈련사 상세 정보 보기
  const handleViewTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setModalMode('view');
    setShowTrainerModal(true);
  };

  // 훈련사 편집 모드
  const handleEditTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setModalMode('edit');
    setShowTrainerModal(true);
  };

  // 새 훈련사 추가 모드
  const handleAddTrainer = () => {
    setSelectedTrainer(null);
    setModalMode('add');
    setShowTrainerModal(true);
  };

  // 훈련사 상태 변경
  const handleChangeStatus = (trainerId: number, newStatus: 'active' | 'pending' | 'inactive' | 'suspended') => {
    setTrainers(prev => prev.map(trainer => 
      trainer.id === trainerId ? { ...trainer, status: newStatus } : trainer
    ));
    
    const statusMap = {
      active: '활성',
      pending: '대기',
      inactive: '비활성',
      suspended: '정지'
    };
    
    toast({
      title: '훈련사 상태 변경',
      description: `훈련사 상태가 '${statusMap[newStatus]}'(으)로 변경되었습니다.`,
    });
    
    if (selectedTrainer && selectedTrainer.id === trainerId) {
      setSelectedTrainer({ ...selectedTrainer, status: newStatus });
    }
  };

  // 훈련사 삭제 처리
  const handleDeleteTrainer = (trainerId: number) => {
    if (window.confirm('정말로 이 훈련사를 삭제하시겠습니까?')) {
      setTrainers(prev => prev.filter(trainer => trainer.id !== trainerId));
      setShowTrainerModal(false);
      
      toast({
        title: '훈련사 삭제',
        description: '훈련사가 성공적으로 삭제되었습니다.',
      });
    }
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
      case 'suspended':
        return (
          <Badge className="bg-red-500">
            <XCircle className="w-3 h-3 mr-1" />
            정지
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // 검증 상태 배지
  const getVerifiedBadge = (verified: boolean) => {
    if (verified) {
      return (
        <Badge variant="outline" className="border-green-500 text-green-500">
          <CheckCircle className="w-3 h-3 mr-1" />
          검증됨
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="border-amber-500 text-amber-500">
        <AlertCircle className="w-3 h-3 mr-1" />
        미검증
      </Badge>
    );
  };

  // 데이터 새로고침
  const handleRefresh = () => {
    setIsLoading(true);
    // 실제 구현 시 API 호출로 대체
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: '새로고침 완료',
        description: '훈련사 데이터가 업데이트되었습니다.',
      });
    }, 1000);
  };

  // 별점 표시
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 > 0.3;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {Array(fullStars).fill(0).map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-amber-500 text-amber-500" />
        ))}
        {halfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-amber-500" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
        )}
        {Array(emptyStars).fill(0).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground" />
        ))}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
        <span className="ml-1 text-xs text-muted-foreground">({selectedTrainer?.reviewCount})</span>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">훈련사 관리</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddTrainer} variant="default">
            <PlusCircle className="mr-2 h-4 w-4" />
            훈련사 추가
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
                placeholder="이름, 이메일, 전문분야 검색..."
                className="pl-8 h-9 md:w-[300px] w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterSpecialty || 'all'} onValueChange={setFilterSpecialty}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="전문 분야" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 분야</SelectItem>
                {specialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                ))}
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
                  <TableHead>훈련사</TableHead>
                  <TableHead>전문 분야</TableHead>
                  <TableHead>소속</TableHead>
                  <TableHead className="text-center">평점</TableHead>
                  <TableHead className="text-center">수강생</TableHead>
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
                ) : paginatedTrainers.length > 0 ? (
                  paginatedTrainers.map((trainer, index) => (
                    <TableRow key={trainer.id}>
                      <TableCell className="font-medium">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={trainer.image} alt={trainer.name} />
                            <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{trainer.name}</div>
                            <div className="text-sm text-muted-foreground">{trainer.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{trainer.specialty}</TableCell>
                      <TableCell>
                        {trainer.instituteName ? (
                          <div className="flex items-center">
                            <Building className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>{trainer.instituteName}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">독립 훈련사</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Star className="w-3.5 h-3.5 mr-1 fill-amber-500 text-amber-500" />
                          <span>{trainer.rating.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground ml-1">({trainer.reviewCount})</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{trainer.studentCount}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(trainer.status)}
                          {getVerifiedBadge(trainer.verified)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewTrainer(trainer)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTrainer(trainer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {trainer.status === 'active' ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleChangeStatus(trainer.id, 'inactive')}
                              className="text-amber-500"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleChangeStatus(trainer.id, 'active')}
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
                총 {filteredTrainers.length}명 중 {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredTrainers.length)}명 표시
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
      
      {/* 훈련사 상세 정보 모달 */}
      <Dialog open={showTrainerModal} onOpenChange={setShowTrainerModal}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {modalMode === 'add' ? '새 훈련사 추가' : 
               modalMode === 'edit' ? '훈련사 정보 수정' : 
               modalMode === 'verify' ? '훈련사 정보 검증' : 
               '훈련사 상세 정보'}
            </DialogTitle>
            <DialogDescription>
              {modalMode === 'add' ? '새로운 훈련사를 시스템에 추가합니다.' : 
               modalMode === 'edit' ? '훈련사 정보를 수정합니다.' : 
               modalMode === 'verify' ? '훈련사 정보를 검증하고 승인합니다.' : 
               selectedTrainer ? `${selectedTrainer.name} 훈련사의 상세 정보입니다.` : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTrainer && (modalMode === 'view' || modalMode === 'edit' || modalMode === 'verify') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={selectedTrainer.image} alt={selectedTrainer.name} />
                    <AvatarFallback className="text-2xl">{selectedTrainer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{selectedTrainer.name}</h3>
                    <div className="flex items-center justify-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-blue-500 border-blue-500">
                        {selectedTrainer.specialty}
                      </Badge>
                      {getStatusBadge(selectedTrainer.status)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground">기본 정보</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{selectedTrainer.email}</span>
                    </div>
                    {selectedTrainer.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{selectedTrainer.phone}</span>
                      </div>
                    )}
                    {selectedTrainer.instituteName && (
                      <div className="flex items-center text-sm">
                        <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>소속: {selectedTrainer.instituteName}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedTrainer.bio && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-muted-foreground">소개</h4>
                    <p className="text-sm">{selectedTrainer.bio}</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground">자격 증명</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainer.certifications.map((cert, idx) => (
                      <Badge key={idx} variant="outline" className="flex items-center">
                        <Award className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {selectedTrainer.skills && selectedTrainer.skills.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-muted-foreground">주요 스킬</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTrainer.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground">평가</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">평점:</span>
                      <div>
                        {renderStars(selectedTrainer.rating)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground">강의 정보</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-background rounded-lg border text-center">
                      <BookOpen className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-2xl font-bold">{selectedTrainer.courseCount}</div>
                      <div className="text-xs text-muted-foreground">강의</div>
                    </div>
                    <div className="p-4 bg-background rounded-lg border text-center">
                      <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-2xl font-bold">{selectedTrainer.studentCount}</div>
                      <div className="text-xs text-muted-foreground">수강생</div>
                    </div>
                    <div className="p-4 bg-background rounded-lg border text-center">
                      <Clipboard className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-2xl font-bold">{selectedTrainer.completionRate}%</div>
                      <div className="text-xs text-muted-foreground">수료율</div>
                    </div>
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
                      훈련사 정보 수정
                    </Button>
                    
                    {!selectedTrainer.verified && (
                      <Button 
                        variant="outline" 
                        className="w-full text-green-500" 
                        onClick={() => { 
                          setTrainers(prev => prev.map(t => 
                            t.id === selectedTrainer.id ? { ...t, verified: true } : t
                          ));
                          setSelectedTrainer({ ...selectedTrainer, verified: true });
                          toast({
                            title: '훈련사 검증',
                            description: '훈련사가 성공적으로 검증되었습니다.',
                          });
                        }}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        훈련사 검증
                      </Button>
                    )}
                    
                    {selectedTrainer.status === 'active' ? (
                      <Button 
                        variant="outline" 
                        className="w-full text-amber-500" 
                        onClick={() => { handleChangeStatus(selectedTrainer.id, 'inactive'); }}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        훈련사 비활성화
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full text-green-500" 
                        onClick={() => { handleChangeStatus(selectedTrainer.id, 'active'); }}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        훈련사 활성화
                      </Button>
                    )}
                    
                    <Button 
                      variant="destructive" 
                      className="w-full" 
                      onClick={() => { handleDeleteTrainer(selectedTrainer.id); }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      훈련사 삭제
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
                          title: '훈련사 정보 수정',
                          description: '훈련사 정보가 수정되었습니다.',
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
                        setTrainers(prev => prev.map(t => 
                          t.id === selectedTrainer.id ? { ...t, verified: true, status: 'active' } : t
                        ));
                        setModalMode('view');
                        toast({
                          title: '훈련사 검증',
                          description: '훈련사가 성공적으로 검증되었습니다.',
                        });
                      }}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      검증 및 승인
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
                <label htmlFor="name" className="text-right text-sm">이름</label>
                <Input id="name" className="col-span-3" placeholder="훈련사 이름" autoFocus />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right text-sm">이메일</label>
                <Input id="email" type="email" className="col-span-3" placeholder="이메일 주소" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phone" className="text-right text-sm">연락처</label>
                <Input id="phone" className="col-span-3" placeholder="전화번호" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="specialty" className="text-right text-sm">전문 분야</label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="전문 분야 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="기초 훈련">기초 훈련</SelectItem>
                    <SelectItem value="문제행동 교정">문제행동 교정</SelectItem>
                    <SelectItem value="사회화">사회화</SelectItem>
                    <SelectItem value="고급 훈련">고급 훈련</SelectItem>
                    <SelectItem value="재활 훈련">재활 훈련</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="institute" className="text-right text-sm">소속 기관</label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="소속 기관 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutes.map(institute => (
                      <SelectItem key={institute} value={institute}>{institute}</SelectItem>
                    ))}
                    <SelectItem value="independent">독립 훈련사</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="bio" className="text-right text-sm">소개</label>
                <Input id="bio" className="col-span-3" placeholder="훈련사 소개" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="certifications" className="text-right text-sm">자격증</label>
                <Input id="certifications" className="col-span-3" placeholder="자격증 (쉼표로 구분)" />
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
            </div>
          )}
          
          <DialogFooter>
            {modalMode === 'add' && (
              <Button 
                type="submit" 
                onClick={() => {
                  setShowTrainerModal(false);
                  toast({
                    title: '훈련사 추가',
                    description: '훈련사가 성공적으로 추가되었습니다.',
                  });
                }}
              >
                훈련사 추가
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}