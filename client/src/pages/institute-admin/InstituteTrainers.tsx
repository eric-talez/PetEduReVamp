import { useState, useEffect } from 'react';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Search,
  Plus,
  UserCheck,
  UserX,
  Star,
  Phone,
  Mail,
  Calendar,
  Award,
  Filter,
  MoreVertical
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Trainer {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  specialties: string[];
  rating: number;
  totalStudents: number;
  activeCourses: number;
  completedCourses: number;
  profileImage?: string;
  certification: string[];
  experience: number; // 경력 년수
  lastActive: string;
}

export default function InstituteTrainers() {
  const { userName } = useGlobalAuth();
  const { toast } = useToast();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [filteredTrainers, setFilteredTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');

  // 훈련사 데이터 로드
  useEffect(() => {
    const loadTrainers = async () => {
      setIsLoading(true);
      try {
        console.log('[InstituteTrainers] API 호출 시작');
        
        // 기관 ID 1 (왕짱스쿨)의 훈련사 데이터 조회
        const response = await fetch('/api/institutes/1/trainers', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('[InstituteTrainers] API 응답 상태:', response.status);

        if (!response.ok) {
          throw new Error(`API 호출 실패: ${response.status}`);
        }

        const trainersData = await response.json();
        console.log('[InstituteTrainers] API 응답 데이터:', trainersData);
        
        setTrainers(trainersData);
        setFilteredTrainers(trainersData);
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

  // 검색 및 필터링
  useEffect(() => {
    let filtered = trainers;

    // 상태 필터
    if (statusFilter !== 'all') {
      filtered = filtered.filter(trainer => trainer.status === statusFilter);
    }

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(trainer =>
        trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredTrainers(filtered);
  }, [trainers, searchTerm, statusFilter]);

  // 상태 배지 컴포넌트
  const StatusBadge = ({ status }: { status: Trainer['status'] }) => {
    const config = {
      active: { label: '활성', className: 'bg-green-100 text-green-700 border-green-200' },
      inactive: { label: '비활성', className: 'bg-gray-100 text-gray-700 border-gray-200' },
      pending: { label: '승인 대기', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
    };

    return (
      <Badge variant="outline" className={config[status].className}>
        {config[status].label}
      </Badge>
    );
  };

  // 훈련사 상태 변경
  const handleStatusChange = (trainerId: number, newStatus: Trainer['status']) => {
    setTrainers(prev => prev.map(trainer => 
      trainer.id === trainerId ? {...trainer, status: newStatus} : trainer
    ));
    toast({
      title: '상태 변경됨',
      description: '훈련사 상태가 성공적으로 변경되었습니다.',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <Users className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">훈련사 정보 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">훈련사 관리</h1>
          <p className="text-muted-foreground">기관 소속 훈련사들을 관리하고 모니터링하세요</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          새 훈련사 초대
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">전체 훈련사</p>
                <p className="text-2xl font-bold">{trainers.length}명</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">활성 훈련사</p>
                <p className="text-2xl font-bold">{trainers.filter(t => t.status === 'active').length}명</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">승인 대기</p>
                <p className="text-2xl font-bold">{trainers.filter(t => t.status === 'pending').length}명</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">평균 평점</p>
                <p className="text-2xl font-bold">
                  {trainers.length > 0 
                    ? (trainers.reduce((sum, t) => sum + t.rating, 0) / trainers.length).toFixed(1)
                    : '0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="훈련사 이름, 이메일, 전문 분야로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">전체 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
            <option value="pending">승인 대기</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            필터
          </Button>
        </div>
      </div>

      {/* 훈련사 목록 */}
      {filteredTrainers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTrainers.map((trainer) => (
            <Card key={trainer.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{trainer.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{trainer.experience}년 경력</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={trainer.status} />
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* 연락처 정보 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{trainer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{trainer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>가입일: {format(new Date(trainer.joinDate), 'yyyy.MM.dd')}</span>
                  </div>
                </div>

                {/* 전문 분야 */}
                <div>
                  <p className="text-sm font-medium mb-2">전문 분야</p>
                  <div className="flex flex-wrap gap-1">
                    {trainer.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 자격증 */}
                <div>
                  <p className="text-sm font-medium mb-2">자격증</p>
                  <div className="flex flex-wrap gap-1">
                    {trainer.certification.map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 통계 */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">평점</p>
                    <p className="font-semibold text-yellow-600">★ {trainer.rating}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">총 수강생</p>
                    <p className="font-semibold">{trainer.totalStudents}명</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">활성 강좌</p>
                    <p className="font-semibold">{trainer.activeCourses}개</p>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex justify-between items-center pt-2">
                  <p className="text-xs text-muted-foreground">
                    마지막 활동: {format(new Date(trainer.lastActive), 'MM월 dd일 HH:mm')}
                  </p>
                  <div className="flex space-x-2">
                    {trainer.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(trainer.id, 'active')}
                        >
                          승인
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(trainer.id, 'inactive')}
                        >
                          거절
                        </Button>
                      </>
                    )}
                    {trainer.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(trainer.id, 'inactive')}
                      >
                        비활성화
                      </Button>
                    )}
                    {trainer.status === 'inactive' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(trainer.id, 'active')}
                      >
                        활성화
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">검색 결과가 없습니다</h3>
          <p className="text-muted-foreground mb-4">다른 검색어나 필터를 사용해보세요.</p>
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
          }}>
            필터 초기화
          </Button>
        </div>
      )}
    </div>
  );
}