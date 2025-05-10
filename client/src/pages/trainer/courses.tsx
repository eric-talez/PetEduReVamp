import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/Badge';
import { 
  ChevronRight, 
  Edit, 
  FileEdit, 
  Trash2, 
  Plus, 
  Users, 
  Calendar, 
  BookOpen
} from 'lucide-react';

// 모달 타입 정의
type ModalType = 'create' | 'edit' | 'delete' | 'details' | 'students' | null;

// 강의 인터페이스
interface Course {
  id: number;
  title: string;
  type: '그룹' | '1:1' | '온라인';
  startDate: string;
  endDate: string;
  students: number;
  maxStudents: number | null;
  status: '준비중' | '모집중' | '진행중' | '완료' | '취소';
  price: number;
  description: string;
}

export default function TrainerCourses() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('active');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // 샘플 강의 데이터
  const courses: Course[] = [
    {
      id: 1,
      title: '반려견 기초 훈련 마스터하기',
      type: '그룹',
      startDate: '2025.04.15',
      endDate: '2025.06.15',
      students: 12,
      maxStudents: 15,
      status: '진행중',
      price: 240000,
      description: '반려견의 기초 복종 훈련과 사회화 교육을 진행하는 그룹 강의입니다. 8주 과정으로 앉기, 기다리기, 엎드리기 등 기본 명령어를 학습합니다.'
    },
    {
      id: 2,
      title: '문제행동 교정 과정',
      type: '1:1',
      startDate: '2025.04.28',
      endDate: '2025.05.28',
      students: 5,
      maxStudents: null,
      status: '진행중',
      price: 280000,
      description: '짖음, 물기, 분리불안 등 반려견의 문제행동을 개선하는 1:1 맞춤형 과정입니다. 반려견의 특성과 환경을 고려한 맞춤형 솔루션을 제공합니다.'
    },
    {
      id: 3,
      title: '반려견 어질리티 입문',
      type: '그룹',
      startDate: '2025.05.20',
      endDate: '2025.07.20',
      students: 6,
      maxStudents: 10,
      status: '모집중',
      price: 320000,
      description: '어질리티 훈련의 기초를 배우는 과정입니다. 장애물 통과, 터널, 점프 등 기본 어질리티 과정을 훈련합니다.'
    },
    {
      id: 4,
      title: '반려견 트릭 트레이닝',
      type: '온라인',
      startDate: '2025.06.05',
      endDate: '2025.07.05',
      students: 0,
      maxStudents: 30,
      status: '준비중',
      price: 180000,
      description: '재미있는 트릭을 가르치는 온라인 과정입니다. 손 흔들기, 하이파이브, 돌기 등 다양한 트릭을 배웁니다.'
    }
  ];

  // 현재 탭에 따른 강의 필터링
  const filteredCourses = courses.filter(course => {
    switch (activeTab) {
      case 'active':
        return course.status === '진행중';
      case 'recruiting':
        return course.status === '모집중';
      case 'preparing':
        return course.status === '준비중';
      case 'completed':
        return course.status === '완료';
      case 'all':
        return true;
      default:
        return false;
    }
  });

  const openModal = (type: ModalType, course: Course | null = null) => {
    setSelectedCourse(course);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedCourse(null);
  };

  const handleDelete = (courseId: number) => {
    // 실제 구현에서는 API 호출
    console.log(`강의 ID ${courseId} 삭제 요청`);
    closeModal();
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">강의 관리</h1>
          <p className="text-gray-500 mt-1">모든 강의를 관리하고 새 강의를 등록하세요.</p>
        </div>
        <Button onClick={() => openModal('create')}>
          <Plus className="mr-2 h-4 w-4" /> 새 강의 등록
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-1">
          <CardTitle>강의 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="active">진행 중 ({courses.filter(c => c.status === '진행중').length})</TabsTrigger>
              <TabsTrigger value="recruiting">모집 중 ({courses.filter(c => c.status === '모집중').length})</TabsTrigger>
              <TabsTrigger value="preparing">준비 중 ({courses.filter(c => c.status === '준비중').length})</TabsTrigger>
              <TabsTrigger value="completed">완료 ({courses.filter(c => c.status === '완료').length})</TabsTrigger>
              <TabsTrigger value="all">전체 ({courses.length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>강의명</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>기간</TableHead>
                    <TableHead>수강생</TableHead>
                    <TableHead>가격</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>{course.type}</TableCell>
                        <TableCell>{course.startDate} ~ {course.endDate}</TableCell>
                        <TableCell>
                          {course.students}명
                          {course.maxStudents ? ` / ${course.maxStudents}명` : ''}
                        </TableCell>
                        <TableCell>{course.price.toLocaleString()}원</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              course.status === '진행중' ? 'success' :
                              course.status === '모집중' ? 'info' :
                              course.status === '준비중' ? 'warning' :
                              course.status === '완료' ? 'secondary' : 'outline'
                            }
                          >
                            {course.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openModal('details', course)}
                              title="상세보기"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openModal('edit', course)}
                              title="수정하기"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {course.status !== '진행중' && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openModal('delete', course)}
                                title="삭제하기"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                            {(course.status === '진행중' || course.status === '모집중') && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openModal('students', course)}
                                title="수강생 관리"
                              >
                                <Users className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        선택한 상태의 강의가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 강의 상세 모달 */}
      <Dialog open={activeModal === 'details'} onOpenChange={() => activeModal === 'details' && closeModal()}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>강의 상세 정보</DialogTitle>
            <DialogDescription>
              {selectedCourse?.title}의 상세 정보입니다.
            </DialogDescription>
          </DialogHeader>

          {selectedCourse && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md flex items-center">
                      <BookOpen className="mr-2 h-5 w-5" /> 강의 기본 정보
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">강의명:</dt>
                        <dd>{selectedCourse.title}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">강의 유형:</dt>
                        <dd>{selectedCourse.type}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">강의 기간:</dt>
                        <dd>{selectedCourse.startDate} ~ {selectedCourse.endDate}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">강의 가격:</dt>
                        <dd>{selectedCourse.price.toLocaleString()}원</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">현재 상태:</dt>
                        <dd>
                          <Badge
                            variant={
                              selectedCourse.status === '진행중' ? 'success' :
                              selectedCourse.status === '모집중' ? 'info' :
                              selectedCourse.status === '준비중' ? 'warning' :
                              selectedCourse.status === '완료' ? 'secondary' : 'outline'
                            }
                          >
                            {selectedCourse.status}
                          </Badge>
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md flex items-center">
                      <Users className="mr-2 h-5 w-5" /> 수강생 현황
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">현재 수강생:</dt>
                        <dd>{selectedCourse.students}명</dd>
                      </div>
                      {selectedCourse.maxStudents && (
                        <>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">최대 인원:</dt>
                            <dd>{selectedCourse.maxStudents}명</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">남은 자리:</dt>
                            <dd>{selectedCourse.maxStudents - selectedCourse.students}명</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">등록률:</dt>
                            <dd>{Math.round((selectedCourse.students / selectedCourse.maxStudents) * 100)}%</dd>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">예상 수익:</dt>
                        <dd>{(selectedCourse.price * selectedCourse.students).toLocaleString()}원</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center">
                    <FileEdit className="mr-2 h-5 w-5" /> 강의 설명
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{selectedCourse.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center">
                    <Calendar className="mr-2 h-5 w-5" /> 강의 일정
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>회차</TableHead>
                        <TableHead>날짜</TableHead>
                        <TableHead>시간</TableHead>
                        <TableHead>주제</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>1회차</TableCell>
                        <TableCell>2025.04.15</TableCell>
                        <TableCell>19:00-21:00</TableCell>
                        <TableCell>오리엔테이션 및 강의 소개</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2회차</TableCell>
                        <TableCell>2025.04.22</TableCell>
                        <TableCell>19:00-21:00</TableCell>
                        <TableCell>기초 복종 훈련 - 앉기, 기다리기</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>3회차</TableCell>
                        <TableCell>2025.04.29</TableCell>
                        <TableCell>19:00-21:00</TableCell>
                        <TableCell>기초 복종 훈련 - 엎드리기, 일어서기</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button onClick={closeModal}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 모달 */}
      <Dialog open={activeModal === 'delete'} onOpenChange={() => activeModal === 'delete' && closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>강의 삭제</DialogTitle>
            <DialogDescription>
              정말로 "{selectedCourse?.title}" 강의를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>취소</Button>
            <Button variant="destructive" onClick={() => selectedCourse && handleDelete(selectedCourse.id)}>삭제</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 수강생 관리 모달 */}
      <Dialog open={activeModal === 'students'} onOpenChange={() => activeModal === 'students' && closeModal()}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>수강생 관리</DialogTitle>
            <DialogDescription>
              {selectedCourse?.title}의 수강생 목록입니다.
            </DialogDescription>
          </DialogHeader>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>반려견</TableHead>
                <TableHead>등록일</TableHead>
                <TableHead>출석률</TableHead>
                <TableHead>액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">이지은</TableCell>
                <TableCell>010-1234-5678</TableCell>
                <TableCell>몽이 (말티즈)</TableCell>
                <TableCell>2025.04.10</TableCell>
                <TableCell>100%</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">상세</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">김민준</TableCell>
                <TableCell>010-2345-6789</TableCell>
                <TableCell>코코 (푸들)</TableCell>
                <TableCell>2025.04.12</TableCell>
                <TableCell>100%</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">상세</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <DialogFooter>
            <Button onClick={closeModal}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}