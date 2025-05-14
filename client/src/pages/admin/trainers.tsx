import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, Users, Award, Star, Filter, ChevronRight, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// 데이터 타입 정의
interface Trainer {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
  specialty: string[];
  experience: number;
  status: 'active' | 'pending' | 'inactive';
  rating: number;
  instituteName?: string;
  instituteId?: number;
  reviewCount: number;
  studentCount: number;
  joinDate: string;
  lastActive: string;
}

// 샘플 데이터
const SAMPLE_TRAINERS: Trainer[] = [
  {
    id: 1,
    name: '김훈련',
    email: 'trainer1@example.com',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    specialty: ['행동 교정', '기본 훈련'],
    experience: 5,
    status: 'active',
    rating: 4.8,
    instituteName: '멍멍 트레이닝 센터',
    instituteId: 1,
    reviewCount: 48,
    studentCount: 120,
    joinDate: '2022-03-15',
    lastActive: '2023-05-11'
  },
  {
    id: 2,
    name: '박트레이너',
    email: 'trainer2@example.com',
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    specialty: ['어질리티', '펫 케어'],
    experience: 3,
    status: 'active',
    rating: 4.5,
    instituteName: '러브펫 아카데미',
    instituteId: 2,
    reviewCount: 32,
    studentCount: 85,
    joinDate: '2022-06-22',
    lastActive: '2023-05-10'
  },
  {
    id: 3,
    name: '최트레이너',
    email: 'trainer3@example.com',
    specialty: ['행동 교정', '문제 해결'],
    experience: 7,
    status: 'inactive',
    rating: 4.9,
    reviewCount: 65,
    studentCount: 150,
    joinDate: '2021-08-10',
    lastActive: '2023-04-28'
  },
  {
    id: 4,
    name: '이훈련사',
    email: 'trainer4@example.com',
    profileImage: 'https://randomuser.me/api/portraits/men/67.jpg',
    specialty: ['어질리티', '고급 훈련'],
    experience: 4,
    status: 'pending',
    rating: 0,
    reviewCount: 0,
    studentCount: 0,
    joinDate: '2023-05-01',
    lastActive: '2023-05-01'
  }
];

export default function AdminTrainersPage() {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [instituteFilter, setInstituteFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [isLoading, setIsLoading] = useState(true);
  
  // 기관 목록 (중복 제거)
  const institutes = Array.from(
    new Set(
      SAMPLE_TRAINERS
        .filter(trainer => trainer.instituteName)
        .map(trainer => trainer.instituteName)
    )
  );

  // 데이터 로드
  useEffect(() => {
    // 실제 구현 시에는 API 호출로 대체
    const loadTrainers = async () => {
      setIsLoading(true);
      try {
        // API 로직 대신 샘플 데이터 사용
        setTrainers(SAMPLE_TRAINERS);
      } catch (error) {
        console.error('훈련사 데이터 로드 실패:', error);
        toast({
          title: '데이터 로드 실패',
          description: '훈련사 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTrainers();
  }, [toast]);

  // 필터링된 훈련사 목록
  const filteredTrainers = trainers.filter(trainer => {
    // 검색어 필터
    if (searchTerm && !trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !trainer.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // 상태 필터
    if (statusFilter !== 'all' && trainer.status !== statusFilter) {
      return false;
    }
    
    // 기관 필터
    if (instituteFilter !== 'all' && trainer.instituteName !== instituteFilter) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // 정렬
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'experience') {
      return b.experience - a.experience;
    } else if (sortBy === 'students') {
      return b.studentCount - a.studentCount;
    } else if (sortBy === 'recent') {
      return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
    }
    return 0;
  });

  // 훈련사 상태 변경
  const changeTrainerStatus = (id: number, newStatus: 'active' | 'pending' | 'inactive') => {
    setTrainers(prev => 
      prev.map(trainer => 
        trainer.id === id ? { ...trainer, status: newStatus } : trainer
      )
    );
    
    toast({
      title: '상태 변경 완료',
      description: `훈련사 상태가 ${newStatus === 'active' ? '활성화' : newStatus === 'inactive' ? '비활성화' : '대기 중'}로 변경되었습니다.`,
      variant: 'default'
    });
  };

  // 훈련사 삭제
  const deleteTrainer = (id: number) => {
    if (confirm('정말로 이 훈련사를 삭제하시겠습니까?')) {
      setTrainers(prev => prev.filter(trainer => trainer.id !== id));
      
      toast({
        title: '삭제 완료',
        description: '훈련사가 삭제되었습니다.',
        variant: 'default'
      });
    }
  };

  // 훈련사 상세 보기
  const viewTrainerDetail = (id: number) => {
    // 실제 구현에서는 상세 페이지로 이동 또는 모달 표시
    window.location.href = `/trainers/${id}`;
  };

  // 권한 검사
  if (userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-500">접근 권한이 없습니다</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">훈련사 관리</h1>
        <Button className="gap-2">
          <Plus size={20} />
          새 훈련사 등록
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>훈련사 목록</CardTitle>
          <CardDescription>
            시스템의 모든 훈련사를 관리하고, 상태를 변경하거나 삭제할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Input
                placeholder="이름 또는 이메일 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="active">활성화</SelectItem>
                  <SelectItem value="pending">승인 대기</SelectItem>
                  <SelectItem value="inactive">비활성화</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={instituteFilter} onValueChange={setInstituteFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="기관 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 기관</SelectItem>
                  {institutes.map((institute, index) => (
                    <SelectItem key={index} value={institute || ''}>
                      {institute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">이름순</SelectItem>
                  <SelectItem value="rating">평점순</SelectItem>
                  <SelectItem value="experience">경력순</SelectItem>
                  <SelectItem value="students">학생 수</SelectItem>
                  <SelectItem value="recent">최근 활동순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>훈련사</TableHead>
                  <TableHead>전문 분야</TableHead>
                  <TableHead>경력</TableHead>
                  <TableHead>평점</TableHead>
                  <TableHead>기관</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      <div className="flex justify-center items-center">
                        <svg className="animate-spin h-5 w-5 mr-3 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        데이터 로딩 중...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredTrainers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">일치하는 훈련사가 없습니다.</TableCell>
                  </TableRow>
                ) : (
                  filteredTrainers.map((trainer) => (
                    <TableRow key={trainer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={trainer.profileImage} />
                            <AvatarFallback>{trainer.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{trainer.name}</div>
                            <div className="text-sm text-muted-foreground">{trainer.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {trainer.specialty.map((spec, index) => (
                            <Badge key={index} variant="outline">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{trainer.experience}년</TableCell>
                      <TableCell>
                        {trainer.rating > 0 ? (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>{trainer.rating}</span>
                            <span className="text-muted-foreground text-xs ml-1">({trainer.reviewCount})</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">평가 없음</span>
                        )}
                      </TableCell>
                      <TableCell>{trainer.instituteName || '개인 훈련사'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            trainer.status === 'active' ? 'default' : 
                            trainer.status === 'pending' ? 'secondary' : 'outline'
                          }
                        >
                          {trainer.status === 'active' ? '활성화' : 
                           trainer.status === 'pending' ? '승인 대기' : '비활성화'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="mr-1"
                          onClick={() => viewTrainerDetail(trainer.id)}
                        >
                          <Eye size={18} />
                        </Button>
                        {trainer.status === 'pending' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="mr-1 text-green-500"
                            onClick={() => changeTrainerStatus(trainer.id, 'active')}
                          >
                            <Check size={18} />
                          </Button>
                        )}
                        {trainer.status === 'active' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="mr-1 text-amber-500"
                            onClick={() => changeTrainerStatus(trainer.id, 'inactive')}
                          >
                            <X size={18} />
                          </Button>
                        )}
                        {trainer.status === 'inactive' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="mr-1 text-green-500"
                            onClick={() => changeTrainerStatus(trainer.id, 'active')}
                          >
                            <Check size={18} />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500"
                          onClick={() => deleteTrainer(trainer.id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}