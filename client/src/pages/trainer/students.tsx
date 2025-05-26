import { useState, useEffect } from 'react';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  Filter,
  Phone,
  Mail,
  Calendar,
  Dog,
  MessageCircle,
  BookOpen,
  Trophy,
  RefreshCw,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  petName: string;
  petBreed: string;
  petAge: number;
  activeCourses: number;
  completedCourses: number;
  totalLessons: number;
  progress: 'excellent' | 'good' | 'average' | 'needs_attention';
  lastLessonDate?: string;
  avatar?: string;
  notes?: string;
}

export default function TrainerStudents() {
  const { userName } = useGlobalAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgress, setSelectedProgress] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // 수강생 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockStudents: Student[] = [
          {
            id: 1,
            name: '김철수',
            email: 'kim.cs@email.com',
            phone: '010-1234-5678',
            joinDate: '2024-03-15',
            petName: '코코',
            petBreed: '골든 리트리버',
            petAge: 2,
            activeCourses: 2,
            completedCourses: 3,
            totalLessons: 15,
            progress: 'excellent',
            lastLessonDate: '2024-05-14',
            notes: '매우 적극적이고 훈련에 잘 따라옵니다.'
          },
          {
            id: 2,
            name: '이영희',
            email: 'lee.yh@email.com',
            phone: '010-2345-6789',
            joinDate: '2024-02-20',
            petName: '망고',
            petBreed: '비글',
            petAge: 3,
            activeCourses: 1,
            completedCourses: 1,
            totalLessons: 8,
            progress: 'good',
            lastLessonDate: '2024-05-13',
            notes: '차분하고 꾸준히 발전하고 있습니다.'
          },
          {
            id: 3,
            name: '정민수',
            email: 'jung.ms@email.com',
            phone: '010-3456-7890',
            joinDate: '2024-04-01',
            petName: '보리',
            petBreed: '보더 콜리',
            petAge: 1,
            activeCourses: 3,
            completedCourses: 0,
            totalLessons: 12,
            progress: 'excellent',
            lastLessonDate: '2024-05-12',
            notes: '매우 영리하고 빠르게 학습합니다.'
          },
          {
            id: 4,
            name: '한소희',
            email: 'han.sh@email.com',
            phone: '010-4567-8901',
            joinDate: '2024-01-10',
            petName: '루나',
            petBreed: '포메라니안',
            petAge: 4,
            activeCourses: 1,
            completedCourses: 2,
            totalLessons: 10,
            progress: 'average',
            lastLessonDate: '2024-05-11',
            notes: '소극적이지만 천천히 발전하고 있습니다.'
          },
          {
            id: 5,
            name: '장수현',
            email: 'jang.sh@email.com',
            phone: '010-5678-9012',
            joinDate: '2024-03-25',
            petName: '몽이',
            petBreed: '시바견',
            petAge: 5,
            activeCourses: 2,
            completedCourses: 1,
            totalLessons: 9,
            progress: 'good',
            lastLessonDate: '2024-05-10',
            notes: '독립적인 성격이지만 훈련에 잘 참여합니다.'
          },
          {
            id: 6,
            name: '김민준',
            email: 'kim.mj@email.com',
            phone: '010-6789-0123',
            joinDate: '2024-04-15',
            petName: '초코',
            petBreed: '로트와일러',
            petAge: 3,
            activeCourses: 1,
            completedCourses: 0,
            totalLessons: 5,
            progress: 'needs_attention',
            lastLessonDate: '2024-05-09',
            notes: '공격성 문제로 특별한 주의가 필요합니다.'
          }
        ];
        
        setStudents(mockStudents);
      } catch (error) {
        console.error('수강생 데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '수강생 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  // 필터링된 수강생 업데이트
  useEffect(() => {
    let result = [...students];
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        student => 
          student.name.toLowerCase().includes(query) ||
          student.petName.toLowerCase().includes(query) ||
          student.petBreed.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query)
      );
    }
    
    // 진행 상태 필터링
    if (selectedProgress !== 'all') {
      result = result.filter(student => student.progress === selectedProgress);
    }
    
    // 가입일 기준 내림차순 정렬
    result.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
    
    setFilteredStudents(result);
  }, [students, searchQuery, selectedProgress]);

  // 페이지네이션 처리
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 진행 상태에 따른 배지 스타일
  const getProgressBadge = (progress: Student['progress']) => {
    switch(progress) {
      case 'excellent':
        return <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">우수</Badge>;
      case 'good':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">양호</Badge>;
      case 'average':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">보통</Badge>;
      case 'needs_attention':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">주의 필요</Badge>;
      default:
        return <Badge variant="outline">미정</Badge>;
    }
  };

  // 데이터 새로고침
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: '새로고침 완료',
        description: '수강생 데이터가 업데이트되었습니다.',
      });
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <Users className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">수강생 정보 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">수강생 관리</h1>
          <p className="text-muted-foreground">담당 수강생들의 학습 현황을 관리하세요</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">총 수강생</p>
                <p className="text-2xl font-bold">{students.length}명</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">활성 강의</p>
                <p className="text-2xl font-bold">{students.reduce((sum, s) => sum + s.activeCourses, 0)}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">완료 강의</p>
                <p className="text-2xl font-bold">{students.reduce((sum, s) => sum + s.completedCourses, 0)}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">총 수업</p>
                <p className="text-2xl font-bold">{students.reduce((sum, s) => sum + s.totalLessons, 0)}회</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="수강생명, 반려견명, 견종, 이메일로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedProgress}
            onChange={(e) => setSelectedProgress(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">모든 진행 상태</option>
            <option value="excellent">우수</option>
            <option value="good">양호</option>
            <option value="average">보통</option>
            <option value="needs_attention">주의 필요</option>
          </select>
        </div>
      </div>

      {/* 수강생 목록 */}
      {paginatedStudents.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Dog className="h-4 w-4" />
                        {student.petName} ({student.petBreed})
                      </p>
                    </div>
                  </div>
                  {getProgressBadge(student.progress)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">활성 강의</p>
                    <p className="font-medium">{student.activeCourses}개</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">완료 강의</p>
                    <p className="font-medium">{student.completedCourses}개</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">총 수업</p>
                    <p className="font-medium">{student.totalLessons}회</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">반려견 나이</p>
                    <p className="font-medium">{student.petAge}세</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{student.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      가입: {format(new Date(student.joinDate), 'yyyy.MM.dd')}
                    </span>
                  </div>
                  {student.lastLessonDate && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        최근: {format(new Date(student.lastLessonDate), 'yyyy.MM.dd')}
                      </span>
                    </div>
                  )}
                </div>

                {student.notes && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">{student.notes}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    상세보기
                  </Button>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
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
          <h3 className="text-lg font-semibold">수강생이 없습니다</h3>
          <p className="text-muted-foreground mb-4">검색 조건을 변경하거나 새로운 수강생을 등록해보세요.</p>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              이전
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              다음
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}