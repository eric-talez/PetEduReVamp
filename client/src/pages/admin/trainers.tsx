import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search,
  PlusCircle,
  RefreshCw,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

/**
 * 관리자용 훈련사 관리 페이지
 * 이 컴포넌트는 /admin/trainers 경로에서 렌더링됩니다.
 */
export default function AdminTrainers() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // 훈련사 데이터 로드
  useEffect(() => {
    const loadTrainers = async () => {
      setIsLoading(true);
      try {
        // 실제 구현 시 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 임시 데이터
        const mockTrainers = [
          {
            id: 1,
            name: '김영수',
            specialty: '기초 훈련',
            email: 'youngsoo.kim@example.com',
            status: 'active',
            verified: true,
            rating: 4.8,
            reviewCount: 152,
            instituteName: '알파 트레이닝 센터',
            studentCount: 45,
          },
          {
            id: 2,
            name: '이하은',
            specialty: '문제행동 교정',
            email: 'haeun.lee@example.com',
            status: 'active',
            verified: true,
            rating: 4.9,
            reviewCount: 98,
            instituteName: '베타 애견 학교',
            studentCount: 32,
          },
          {
            id: 3,
            name: '박지민',
            specialty: '사회화',
            email: 'jimin.park@example.com',
            status: 'active',
            verified: true,
            rating: 4.7,
            reviewCount: 85,
            instituteName: '감마 펫 아카데미',
            studentCount: 28,
          },
          {
            id: 4,
            name: '최민준',
            specialty: '고급 훈련',
            email: 'minjun.choi@example.com',
            status: 'pending',
            verified: false,
            rating: 0,
            reviewCount: 0,
            instituteName: '오메가 훈련 학교',
            studentCount: 0,
          },
          {
            id: 5,
            name: '정서연',
            specialty: '재활 훈련',
            email: 'seoyeon.jung@example.com',
            status: 'inactive',
            verified: true,
            rating: 4.6,
            reviewCount: 45,
            studentCount: 12,
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
    
    return filtered;
  };

  // 상태별 배지 색상 및 아이콘
  const getStatusBadge = (status) => {
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">훈련사 관리</h1>
        <div className="flex items-center space-x-2">
          <Button variant="default">
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
            
            <Button variant="ghost" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="p-4">
            <CardTitle>훈련사 목록</CardTitle>
          </CardHeader>
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
                      <div className="mt-2 text-sm text-muted-foreground">훈련사 데이터 로딩 중...</div>
                    </TableCell>
                  </TableRow>
                ) : getFilteredTrainers().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="text-muted-foreground">데이터가 없습니다</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  getFilteredTrainers().map((trainer, index) => (
                    <TableRow key={trainer.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={trainer.image} />
                            <AvatarFallback>{trainer.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{trainer.name}</div>
                            <div className="text-sm text-muted-foreground">{trainer.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{trainer.specialty}</TableCell>
                      <TableCell>{trainer.instituteName || '-'}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
                          <span>{trainer.rating.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground ml-1">({trainer.reviewCount})</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{trainer.studentCount}</TableCell>
                      <TableCell>{getStatusBadge(trainer.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}