import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { NewCourseDialog } from '@/components/NewCourseDialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Check, 
  X, 
  Search, 
  Plus, 
  Filter, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Loader2,
  Edit,
  Trash2,
  Eye,
  PlusCircle,
  Users,
  Clock,
  FileText,
  BarChart4,
  CheckCircle2,
  PawPrint
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// 교육 과정 인터페이스
interface Course {
  id: number;
  title: string;
  description: string;
  type: string;
  duration: number; // 주 단위
  status: 'active' | 'draft' | 'completed' | 'archived';
  studentCount: number;
  trainerCount: number;
  rating: number;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  completionRate: number;
  thumbnail?: string;
  tags: string[];
  maxStudents: number;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export default function InstituteCoursesPage() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseDetailsDialog, setShowCourseDetailsDialog] = useState(false);
  const [showNewCourseDialog, setShowNewCourseDialog] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<string | null>(null);
  
  // 임시 교육 과정 데이터
  const [courses, setCourses] = useState<Course[]>([]);
  
  // 교육 과정 데이터 로딩
  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        // 실제 API 구현 시 이 부분을 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 임시 데이터
        const mockCourses: Course[] = [
          {
            id: 1,
            title: '기초 복종 훈련 A반',
            description: '기본적인 복종 명령과 사회화 훈련을 포함한 초급 과정입니다.',
            type: '기초 훈련',
            duration: 8,
            status: 'active',
            studentCount: 15,
            trainerCount: 2,
            rating: 4.7,
            createdAt: '2023-01-10',
            startDate: '2023-02-01',
            endDate: '2023-03-28',
            completionRate: 65,
            tags: ['기초', '복종', '사회화'],
            maxStudents: 20,
            price: 350000,
            level: 'beginner'
          },
          {
            id: 2,
            title: '문제행동 교정 심화 과정',
            description: '공격성, 분리불안 등 다양한 문제행동을 교정하는 심화 과정입니다.',
            type: '문제행동 교정',
            duration: 12,
            status: 'active',
            studentCount: 8,
            trainerCount: 1,
            rating: 4.8,
            createdAt: '2023-02-15',
            startDate: '2023-03-10',
            endDate: '2023-06-02',
            completionRate: 42,
            tags: ['문제행동', '심화', '공격성', '분리불안'],
            maxStudents: 10,
            price: 480000,
            level: 'advanced'
          },
          {
            id: 3,
            title: '사회화 트레이닝',
            description: '여러 환경과 상황에서 안정적으로 행동할 수 있도록 사회화를 진행하는 과정입니다.',
            type: '사회화',
            duration: 6,
            status: 'draft',
            studentCount: 0,
            trainerCount: 1,
            rating: 0,
            createdAt: '2023-04-05',
            completionRate: 0,
            tags: ['사회화', '환경 적응', '스트레스 관리'],
            maxStudents: 15,
            price: 300000,
            level: 'intermediate'
          },
          {
            id: 4,
            title: '어질리티 기초 과정',
            description: '반려견 스포츠인 어질리티의 기초를 배우는 과정입니다.',
            type: '특수 훈련',
            duration: 10,
            status: 'completed',
            studentCount: 12,
            trainerCount: 1,
            rating: 4.6,
            createdAt: '2022-10-10',
            startDate: '2022-11-01',
            endDate: '2023-01-10',
            completionRate: 100,
            tags: ['어질리티', '스포츠', '신체 활동'],
            maxStudents: 12,
            price: 420000,
            level: 'intermediate'
          },
          {
            id: 5,
            title: '반려견 매너 교실',
            description: '일상생활에서 필요한 기본 예절과 매너를 가르치는 과정입니다.',
            type: '기초 훈련',
            duration: 4,
            status: 'active',
            studentCount: 18,
            trainerCount: 2,
            rating: 4.5,
            createdAt: '2023-03-20',
            startDate: '2023-04-15',
            endDate: '2023-05-13',
            completionRate: 80,
            tags: ['매너', '예절', '기초'],
            maxStudents: 20,
            price: 200000,
            level: 'beginner'
          }
        ];
        
        setCourses(mockCourses);
      } catch (error) {
        toast({
          title: "데이터 로딩 오류",
          description: "교육 과정 정보를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourses();
  }, [toast]);
  
  // 교육 과정 상태에 따른 필터링
  const getFilteredCourses = () => {
    let filtered = [...courses];
    
    // 탭에 따른 필터링
    if (activeTab === 'active') {
      filtered = filtered.filter(course => course.status === 'active');
    } else if (activeTab === 'draft') {
      filtered = filtered.filter(course => course.status === 'draft');
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(course => course.status === 'completed');
    } else if (activeTab === 'archived') {
      filtered = filtered.filter(course => course.status === 'archived');
    }
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(query) || 
        course.description.toLowerCase().includes(query) ||
        course.type.toLowerCase().includes(query)
      );
    }
    
    // 과정 유형 필터링
    if (filterType) {
      filtered = filtered.filter(course => course.type === filterType);
    }
    
    // 난이도 필터링
    if (filterLevel) {
      filtered = filtered.filter(course => course.level === filterLevel);
    }
    
    // 정렬
    filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return sortOrder === 'asc' 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'studentCount') {
        return sortOrder === 'asc' 
          ? a.studentCount - b.studentCount 
          : b.studentCount - a.studentCount;
      } else if (sortBy === 'rating') {
        return sortOrder === 'asc' 
          ? a.rating - b.rating 
          : b.rating - a.rating;
      }
      return 0;
    });
    
    return filtered;
  };
  
  // 페이지네이션 처리
  const filteredCourses = getFilteredCourses();
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  // 교육 과정 상태 변경 함수
  const updateCourseStatus = (courseId: number, newStatus: 'active' | 'draft' | 'completed' | 'archived') => {
    setCourses(prev => prev.map(course => 
      course.id === courseId ? { ...course, status: newStatus } : course
    ));
    
    toast({
      title: "교육 과정 상태 업데이트",
      description: `교육 과정 상태가 ${
        newStatus === 'active' ? '활성화' : 
        newStatus === 'draft' ? '초안' : 
        newStatus === 'completed' ? '완료' : 
        '보관'
      }로 변경되었습니다.`,
    });
  };
  
  // 교육 과정 상세 정보 보기
  const viewCourseDetails = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseDetailsDialog(true);
  };
  
  // 새 교육 과정 생성 핸들러
  const handleCreateCourse = () => {
    console.log('새 교육 과정 생성 버튼 클릭됨', new Date().toISOString());
    // 직접 DOM 엘리먼트에 접근하는 방식으로 버튼 클릭 확인
    document.getElementById('courseCreateDebug')?.setAttribute('data-clicked', 'true');
    setShowNewCourseDialog(true);
    console.log('Dialog 상태 변경 요청됨:', !showNewCourseDialog);
  };
  
  // 새로고침 핸들러
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "데이터 새로고침",
        description: "교육 과정 목록이 업데이트되었습니다.",
      });
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">교육 과정 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">교육 과정 관리</h1>
          <p className="text-muted-foreground mt-1">기관의 교육 과정을 관리하고 새로운 과정을 개설합니다.</p>
        </div>
        <Button 
          id="courseCreateButton"
          onClick={(e) => {
            e.preventDefault();
            console.log('강의 추가 버튼 직접 클릭됨', new Date().toISOString());
            handleCreateCourse();
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          강의 추가
        </Button>
        
        {/* 디버깅용 요소 */}
        <div id="courseCreateDebug" className="hidden" data-clicked="false"></div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">전체 ({courses.length})</TabsTrigger>
            <TabsTrigger value="active">활성 ({courses.filter(c => c.status === 'active').length})</TabsTrigger>
            <TabsTrigger value="draft">초안 ({courses.filter(c => c.status === 'draft').length})</TabsTrigger>
            <TabsTrigger value="completed">완료 ({courses.filter(c => c.status === 'completed').length})</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-md px-3 py-1">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <Input 
                placeholder="교육 과정 검색..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="border-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              />
            </div>
            
            <Select value={filterType || ''} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="과정 유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 유형</SelectItem>
                <SelectItem value="기초 훈련">기초 훈련</SelectItem>
                <SelectItem value="문제행동 교정">문제행동 교정</SelectItem>
                <SelectItem value="사회화">사회화</SelectItem>
                <SelectItem value="특수 훈련">특수 훈련</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="ghost" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-4 p-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>과정명</TableHead>
                    <TableHead className="hidden md:table-cell">유형</TableHead>
                    <TableHead className="hidden md:table-cell">기간</TableHead>
                    <TableHead className="hidden md:table-cell">수강생</TableHead>
                    <TableHead className="hidden md:table-cell">진행률</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCourses.length > 0 ? (
                    paginatedCourses.map((course, index) => (
                      <TableRow key={course.id} className="cursor-pointer hover:bg-muted/50" onClick={() => viewCourseDetails(course)}>
                        <TableCell className="font-medium w-[50px]">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-muted-foreground">{course.description.substring(0, 50)}...</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{course.type}</TableCell>
                        <TableCell className="hidden md:table-cell">{course.duration}주</TableCell>
                        <TableCell className="hidden md:table-cell">{course.studentCount}/{course.maxStudents}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Progress value={course.completionRate} className="h-2 w-16" />
                            <span className="text-sm">{course.completionRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            course.status === 'active' ? 'default' : 
                            course.status === 'draft' ? 'outline' : 
                            course.status === 'completed' ? 'secondary' :
                            'danger'
                          }>
                            {course.status === 'active' ? '진행중' : 
                             course.status === 'draft' ? '초안' : 
                             course.status === 'completed' ? '완료' : 
                             '보관'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => {
                                e.stopPropagation();
                                viewCourseDetails(course);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {course.status !== 'active' && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateCourseStatus(course.id, 'active');
                                }}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            {course.status !== 'completed' && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateCourseStatus(course.id, 'completed');
                                }}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-muted-foreground">표시할 교육 과정이 없습니다.</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleCreateCourse}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            새 교육 과정 만들기
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            {paginatedCourses.length > 0 && (
              <CardFooter className="flex items-center justify-between p-4">
                <div className="text-sm text-muted-foreground">
                  총 {filteredCourses.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredCourses.length)}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 교육 과정 상세 정보 다이얼로그 */}
      <Dialog open={showCourseDetailsDialog} onOpenChange={setShowCourseDetailsDialog}>
        <DialogContent className="max-w-3xl">
          {selectedCourse && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCourse.title}</DialogTitle>
                <DialogDescription>
                  {selectedCourse.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      수강생
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{selectedCourse.studentCount}/{selectedCourse.maxStudents}</div>
                    <p className="text-xs text-muted-foreground">정원의 {Math.round((selectedCourse.studentCount / selectedCourse.maxStudents) * 100)}%</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      교육 기간
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{selectedCourse.duration}주</div>
                    {selectedCourse.startDate && selectedCourse.endDate && (
                      <p className="text-xs text-muted-foreground">
                        {selectedCourse.startDate} ~ {selectedCourse.endDate}
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base flex items-center">
                      <BarChart4 className="h-4 w-4 mr-2" />
                      진행 상태
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{selectedCourse.completionRate}%</div>
                    <Progress value={selectedCourse.completionRate} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">교육 과정 정보</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">유형</p>
                      <p>{selectedCourse.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">난이도</p>
                      <p>{
                        selectedCourse.level === 'beginner' ? '초급' :
                        selectedCourse.level === 'intermediate' ? '중급' : '고급'
                      }</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">담당 훈련사</p>
                      <p>{selectedCourse.trainerCount}명</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">수강료</p>
                      <p>{selectedCourse.price.toLocaleString()}원</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">태그</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter className="gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    toast({
                      title: "기능 준비중",
                      description: "해당 기능은 준비 중입니다.",
                    });
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  수정하기
                </Button>
                <Button 
                  variant={selectedCourse.status === 'active' ? 'outline' : 'default'}
                  onClick={() => {
                    updateCourseStatus(selectedCourse.id, 'active');
                    setShowCourseDetailsDialog(false);
                  }}
                  disabled={selectedCourse.status === 'active'}
                >
                  <Check className="h-4 w-4 mr-2" />
                  활성화
                </Button>
                <DialogClose asChild>
                  <Button variant="ghost">
                    닫기
                  </Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* 새 교육 과정 생성 다이얼로그 - 외부 컴포넌트 사용 */}
      <NewCourseDialog 
        open={showNewCourseDialog} 
        onOpenChange={setShowNewCourseDialog} 
        onSuccess={() => {
          console.log('교육 과정 생성 성공');
          // 여기서 필요한 추가 작업 수행
        }}
      />
    </div>
  );
}