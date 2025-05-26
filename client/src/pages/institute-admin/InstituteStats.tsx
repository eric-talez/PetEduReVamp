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
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Filter,
  MoreVertical,
  Eye,
  Edit
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  petName: string;
  petBreed: string;
  enrolledCourses: number;
  completedCourses: number;
  totalSpent: number;
  lastActivity: string;
}

export default function InstituteStats() {
  const { userName } = useGlobalAuth();
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');

  useEffect(() => {
    const loadMembers = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockMembers: Member[] = [
          {
            id: 1,
            name: '김철수',
            email: 'kim@example.com',
            phone: '010-1234-5678',
            joinDate: '2024-03-15',
            status: 'active',
            petName: '콩이',
            petBreed: '골든 리트리버',
            enrolledCourses: 2,
            completedCourses: 3,
            totalSpent: 450000,
            lastActivity: '2024-05-26T10:30:00Z'
          },
          {
            id: 2,
            name: '이영희',
            email: 'lee@example.com',
            phone: '010-2345-6789',
            joinDate: '2024-02-20',
            status: 'active',
            petName: '바둑이',
            petBreed: '웰시코기',
            enrolledCourses: 1,
            completedCourses: 2,
            totalSpent: 320000,
            lastActivity: '2024-05-25T14:20:00Z'
          },
          {
            id: 3,
            name: '박민수',
            email: 'park@example.com',
            phone: '010-3456-7890',
            joinDate: '2024-01-10',
            status: 'inactive',
            petName: '루비',
            petBreed: '포메라니안',
            enrolledCourses: 0,
            completedCourses: 1,
            totalSpent: 150000,
            lastActivity: '2024-04-15T09:00:00Z'
          },
          {
            id: 4,
            name: '정미영',
            email: 'jung@example.com',
            phone: '010-4567-8901',
            joinDate: '2023-12-05',
            status: 'active',
            petName: '초코',
            petBreed: '비숑 프리제',
            enrolledCourses: 3,
            completedCourses: 5,
            totalSpent: 780000,
            lastActivity: '2024-05-26T16:45:00Z'
          }
        ];
        
        setMembers(mockMembers);
        setFilteredMembers(mockMembers);
      } catch (error) {
        console.error('회원 데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '회원 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMembers();
  }, [toast]);

  // 검색 및 필터링
  useEffect(() => {
    let filtered = members;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.petName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMembers(filtered);
  }, [members, searchTerm, statusFilter]);

  const StatusBadge = ({ status }: { status: Member['status'] }) => {
    const config = {
      active: { label: '활성', className: 'bg-green-100 text-green-700 border-green-200' },
      inactive: { label: '비활성', className: 'bg-gray-100 text-gray-700 border-gray-200' },
      suspended: { label: '정지', className: 'bg-red-100 text-red-700 border-red-200' }
    };

    return (
      <Badge variant="outline" className={config[status].className}>
        {config[status].label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <Users className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">회원 정보 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">회원 관리</h1>
          <p className="text-muted-foreground">기관 회원들을 관리하고 현황을 확인하세요</p>
        </div>
        <Button>
          <Mail className="h-4 w-4 mr-2" />
          일괄 메시지
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">전체 회원</p>
                <p className="text-2xl font-bold">{members.length}명</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">활성 회원</p>
                <p className="text-2xl font-bold">{members.filter(m => m.status === 'active').length}명</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">이달 신규</p>
                <p className="text-2xl font-bold">5명</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">비활성 회원</p>
                <p className="text-2xl font-bold">{members.filter(m => m.status === 'inactive').length}명</p>
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
            placeholder="회원 이름, 이메일, 반려견 이름으로 검색..."
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
            <option value="suspended">정지</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            필터
          </Button>
        </div>
      </div>

      {/* 회원 목록 */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">🐕 {member.petName} ({member.petBreed})</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={member.status} />
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
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>가입일: {format(new Date(member.joinDate), 'yyyy.MM.dd')}</span>
                  </div>
                </div>

                {/* 수강 정보 */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">현재 수강</p>
                    <p className="font-semibold text-blue-600">{member.enrolledCourses}개</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">수료 완료</p>
                    <p className="font-semibold text-green-600">{member.completedCourses}개</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">총 결제</p>
                    <p className="font-semibold text-purple-600">{(member.totalSpent / 10000).toFixed(0)}만원</p>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex justify-between items-center pt-2">
                  <p className="text-xs text-muted-foreground">
                    마지막 활동: {format(new Date(member.lastActivity), 'MM월 dd일 HH:mm')}
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      보기
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      수정
                    </Button>
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