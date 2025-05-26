import { useState, useEffect } from 'react';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen,
  Search,
  Plus,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Course {
  id: number;
  title: string;
  description: string;
  trainerName: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'active' | 'inactive' | 'draft' | 'completed';
  startDate: string;
  endDate: string;
  duration: number; // 주 단위
  price: number;
  enrolledStudents: number;
  maxStudents: number;
  schedule: string[];
  location: string;
  createdAt: string;
}

export default function InstituteCourses() {
  const { userName } = useGlobalAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'draft' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = ['기본 훈련', '문제 행동 교정', '퍼피 훈련', '어질리티', '시니어견 케어'];

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockCourses: Course[] = [
          {
            id: 1,
            title: '반려견 기본 훈련 마스터하기',
            description: '반려견과의 기본적인 소통을 위한 필수 훈련 과정',
            trainerName: '김영수',
            category: '기본 훈련',
            level: 'beginner',
            status: 'active',
            startDate: '2024-06-01',
            endDate: '2024-07-13',
            duration: 6,
            price: 150000,
            enrolledStudents: 12,
            maxStudents: 15,
            schedule: ['토요일 10:00-11:30'],
            location: 'A동 1층 훈련장',
            createdAt: '2024-05-01'
          },
          {
            id: 2,
            title: '퍼피 사회화 클래스',
            description: '생후 3-6개월 강아지를 위한 사회화 훈련',
            trainerName: '이서연',
            category: '퍼피 훈련',
            level: 'beginner',
            status: 'active',
            startDate: '2024-05-15',
            endDate: '2024-06-19',
            duration: 5,
            price: 120000,
            enrolledStudents: 8,
            maxStudents: 10,
            schedule: ['수요일 15:00-16:00'],
            location: 'B동 2층 소강의실',
            createdAt: '2024-04-20'
          },
          {
            id: 3,
            title: '어질리티 중급 과정',
            description: '기본기를 익힌 반려견을 위한 어질리티 중급 훈련',
            trainerName: '박민준',
            category: '어질리티',
            level: 'intermediate',
            status: 'draft',
            startDate: '2024-07-01',
            endDate: '2024-08-12',
            duration: 6,
            price: 200000,
            enrolledStudents: 0,
            maxStudents: 8,
            schedule: ['일요일 14:00-16:00'],
            location: 'C동 야외 훈련장',
            createdAt: '2024-05-20'
          },
          {
            id: 4,
            title: '문제 행동 교정 프로그램',
            description: '짖음, 물기 등 문제 행동을 교정하는 전문 과정',
            trainerName: '김영수',
            category: '문제 행동 교정',
            level: 'advanced',
            status: 'active',
            startDate: '2024-05-20',
            endDate: '2024-07-01',
            duration: 8,
            price: 250000,
            enrolledStudents: 6,
            maxStudents: 8,
            schedule: ['화요일 19:00-20:30', '목요일 19:00-20:30'],
            location: 'A동 2층 상담실',
            createdAt: '2024-04-15'
          }
        ];
        
        setCourses(mockCourses);
        setFilteredCourses(mockCourses);
      } catch (error) {
        console.error('강좌 데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '강좌 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourses();
  }, [toast]);

  // 검색 및 필터링
  useEffect(() => {
    let filtered = courses;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => course.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(course => course.category === categoryFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.trainerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, statusFilter, categoryFilter]);

  const StatusBadge = ({ status }: { status: Course['status'] }) => {
    const config = {
      active: { label: '진행중', className: 'bg-green-100 text-green-700 border-green-200' },
      inactive: { label: '중단됨', className: 'bg-gray-100 text-gray-700 border-gray-200' },
      draft: { label: '준비중', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      completed: { label: '완료됨', className: 'bg-blue-100 text-blue-700 border-blue-200' }
    };

    return (
      <Badge variant="outline" className={config[status].className}>
        {config[status].label}
      </Badge>
    );
  };

  const LevelBadge = ({ level }: { level: Course['level'] }) => {
    const config = {
      beginner: { label: '초급', className: 'bg-green-50 text-green-600' },
      intermediate: { label: '중급', className: 'bg-yellow-50 text-yellow-600' },
      advanced: { label: '고급', className: 'bg-red-50 text-red-600' }
    };

    return (
      <Badge variant="secondary" className={config[level].className}>
        {config[level].label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <BookOpen className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">강좌 정보 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">강좌 관리</h1>
          <p className="text-muted-foreground">기관에서 운영하는 강좌들을 관리하고 모니터링하세요</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          새 강좌 개설
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">전체 강좌</p>
                <p className="text-2xl font-bold">{courses.length}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">진행 중</p>
                <p className="text-2xl font-bold">{courses.filter(c => c.status === 'active').length}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">총 수강생</p>
                <p className="text-2xl font-bold">{courses.reduce((sum, c) => sum + c.enrolledStudents, 0)}명</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">총 수익</p>
                <p className="text-2xl font-bold">
                  {(courses.reduce((sum, c) => sum + (c.price * c.enrolledStudents), 0) / 10000).toFixed(0)}만원
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
            placeholder="강좌명, 훈련사, 설명으로 검색..."
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
            <option value="active">진행중</option>
            <option value="draft">준비중</option>
            <option value="completed">완료됨</option>
            <option value="inactive">중단됨</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">전체 분야</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 강좌 목록 */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <LevelBadge level={course.level} />
                      <StatusBadge status={course.status} />
                    </div>
                    <CardTitle className="text-lg mb-1">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* 강좌 기본 정보 */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">담당 훈련사</p>
                    <p className="font-medium">{course.trainerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">분야</p>
                    <p className="font-medium">{course.category}</p>
                  </div>
                </div>

                {/* 수강 정보 */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">수강생</p>
                    <p className="font-medium">{course.enrolledStudents}/{course.maxStudents}명</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(course.enrolledStudents / course.maxStudents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">수강료</p>
                    <p className="font-medium text-green-600">{course.price.toLocaleString()}원</p>
                  </div>
                </div>

                {/* 일정 정보 */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">기간</span>
                    <span className="font-medium">
                      {format(new Date(course.startDate), 'MM.dd')} - {format(new Date(course.endDate), 'MM.dd')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">수업</span>
                    <span className="font-medium">{course.schedule.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">장소</span>
                    <span className="font-medium">{course.location}</span>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      보기
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      수정
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {course.duration}주 과정
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">검색 결과가 없습니다</h3>
          <p className="text-muted-foreground mb-4">다른 검색어나 필터를 사용해보세요.</p>
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setCategoryFilter('all');
          }}>
            필터 초기화
          </Button>
        </div>
      )}
    </div>
  );
}