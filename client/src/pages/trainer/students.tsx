import { useState } from 'react';
import { useAuth } from '../../SimpleApp';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/Badge';
import { 
  ChevronRight, 
  MessageSquare, 
  Calendar, 
  BookOpen,
  UserRoundCheck,
  FileText,
  Award,
  Trash2,
  User,
  PawPrint
} from 'lucide-react';

// 모달 타입 정의
type ModalType = 'details' | 'message' | 'schedule' | 'notes' | 'assignments' | 'remove' | null;

// 수강생 인터페이스
interface Student {
  id: number;
  name: string;
  contact: string;
  email: string;
  petName: string;
  petBreed: string;
  petAge: number;
  petGender: '수컷' | '암컷';
  petNeutered: boolean;
  status: '수강중' | '일시중지' | '수료' | '중도포기';
  joinDate: string;
  courseId: number;
  courseName: string;
  courseType: '그룹' | '1:1' | '온라인';
  progress: number;
  attendance: number;
  lastAttendance: string;
  note?: string;
}

export default function TrainerStudents() {
  const auth = useAuth();
  const isAuthenticated = auth.isAuthenticated;
  const user = { name: auth.userName };
  const [activeTab, setActiveTab] = useState<string>('active');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // 샘플 수강생 데이터
  const students: Student[] = [
    {
      id: 1,
      name: '이지은',
      contact: '010-1234-5678',
      email: 'jieun@example.com',
      petName: '몽이',
      petBreed: '말티즈',
      petAge: 2,
      petGender: '수컷',
      petNeutered: true,
      status: '수강중',
      joinDate: '2025.04.10',
      courseId: 1,
      courseName: '반려견 기초 훈련 마스터하기',
      courseType: '그룹',
      progress: 35,
      attendance: 100,
      lastAttendance: '2025.04.29',
      note: '낯가림이 심한 편, 소음에 민감하게 반응'
    },
    {
      id: 2,
      name: '김민준',
      contact: '010-2345-6789',
      email: 'minjun@example.com',
      petName: '코코',
      petBreed: '푸들',
      petAge: 3,
      petGender: '암컷',
      petNeutered: true,
      status: '수강중',
      joinDate: '2025.04.12',
      courseId: 1,
      courseName: '반려견 기초 훈련 마스터하기',
      courseType: '그룹',
      progress: 40,
      attendance: 100,
      lastAttendance: '2025.04.29'
    },
    {
      id: 3,
      name: '박서현',
      contact: '010-3456-7890',
      email: 'seohyun@example.com',
      petName: '해피',
      petBreed: '포메라니안',
      petAge: 1,
      petGender: '수컷',
      petNeutered: false,
      status: '일시중지',
      joinDate: '2025.03.20',
      courseId: 2,
      courseName: '문제행동 교정 과정',
      courseType: '1:1',
      progress: 50,
      attendance: 80,
      lastAttendance: '2025.04.15',
      note: '주인의 출장으로 인해 일시 중지 상태'
    },
    {
      id: 4,
      name: '최유진',
      contact: '010-4567-8901',
      email: 'youjin@example.com',
      petName: '루시',
      petBreed: '골든 리트리버',
      petAge: 2,
      petGender: '암컷',
      petNeutered: true,
      status: '수료',
      joinDate: '2024.12.10',
      courseId: 1,
      courseName: '반려견 기초 훈련 마스터하기',
      courseType: '그룹',
      progress: 100,
      attendance: 95,
      lastAttendance: '2025.02.15'
    },
    {
      id: 5,
      name: '정우진',
      contact: '010-5678-9012',
      email: 'woojin@example.com',
      petName: '뭉치',
      petBreed: '비숑 프리제',
      petAge: 4,
      petGender: '수컷',
      petNeutered: true,
      status: '중도포기',
      joinDate: '2025.03.05',
      courseId: 2,
      courseName: '문제행동 교정 과정',
      courseType: '1:1',
      progress: 20,
      attendance: 60,
      lastAttendance: '2025.03.25',
      note: '이사로 인한 중도 포기'
    }
  ];

  // 현재 탭에 따른 수강생 필터링
  const filteredStudents = students.filter(student => {
    switch (activeTab) {
      case 'active':
        return student.status === '수강중';
      case 'paused':
        return student.status === '일시중지';
      case 'completed':
        return student.status === '수료';
      case 'dropped':
        return student.status === '중도포기';
      case 'all':
        return true;
      default:
        return false;
    }
  });

  const openModal = (type: ModalType, student: Student | null = null) => {
    setSelectedStudent(student);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedStudent(null);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case '수강중':
        return 'success';
      case '일시중지':
        return 'warning';
      case '수료':
        return 'secondary';
      case '중도포기':
        return 'danger';
      default:
        return 'outline';
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">수강생 관리</h1>
          <p className="text-gray-500 mt-1">수강생 정보와 진행 상황을 관리하세요.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-1">
          <CardTitle>수강생 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="active">수강중 ({students.filter(s => s.status === '수강중').length})</TabsTrigger>
              <TabsTrigger value="paused">일시중지 ({students.filter(s => s.status === '일시중지').length})</TabsTrigger>
              <TabsTrigger value="completed">수료 ({students.filter(s => s.status === '수료').length})</TabsTrigger>
              <TabsTrigger value="dropped">중도포기 ({students.filter(s => s.status === '중도포기').length})</TabsTrigger>
              <TabsTrigger value="all">전체 ({students.length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>반려견</TableHead>
                    <TableHead>강의</TableHead>
                    <TableHead>진도율</TableHead>
                    <TableHead>출석률</TableHead>
                    <TableHead>마지막 출석</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.petName} ({student.petBreed})</TableCell>
                        <TableCell>{student.courseName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{student.progress}%</span>
                            <div className="bg-gray-200 dark:bg-gray-700 h-2 w-20 rounded-full overflow-hidden">
                              <div 
                                className="bg-primary h-full rounded-full" 
                                style={{ width: `${student.progress}%` }} 
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{student.attendance}%</TableCell>
                        <TableCell>{student.lastAttendance}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(student.status)}>
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openModal('details', student)}
                              title="상세보기"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openModal('message', student)}
                              title="메시지 보내기"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openModal('notes', student)}
                              title="알림장"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        선택한 상태의 수강생이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 수강생 상세 모달 */}
      <Dialog open={activeModal === 'details'} onOpenChange={() => activeModal === 'details' && closeModal()}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>수강생 상세 정보</DialogTitle>
            <DialogDescription>
              {selectedStudent?.name}님의 상세 정보입니다.
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md flex items-center">
                      <User className="mr-2 h-5 w-5" /> 수강생 정보
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">이름:</dt>
                        <dd>{selectedStudent.name}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">연락처:</dt>
                        <dd>{selectedStudent.contact}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">이메일:</dt>
                        <dd>{selectedStudent.email}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">가입일:</dt>
                        <dd>{selectedStudent.joinDate}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">상태:</dt>
                        <dd>
                          <Badge variant={getStatusBadgeVariant(selectedStudent.status)}>
                            {selectedStudent.status}
                          </Badge>
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md flex items-center">
                      <PawPrint className="mr-2 h-5 w-5" /> 반려견 정보
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">이름:</dt>
                        <dd>{selectedStudent.petName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">품종:</dt>
                        <dd>{selectedStudent.petBreed}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">나이:</dt>
                        <dd>{selectedStudent.petAge}살</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">성별:</dt>
                        <dd>{selectedStudent.petGender}{selectedStudent.petNeutered ? ' (중성화)' : ''}</dd>
                      </div>
                      {selectedStudent.note && (
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">특이사항:</dt>
                          <dd>{selectedStudent.note}</dd>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" /> 강의 정보
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">강의명:</dt>
                      <dd>{selectedStudent.courseName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">강의 유형:</dt>
                      <dd>{selectedStudent.courseType}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">진도율:</dt>
                      <dd className="flex items-center gap-2">
                        <span>{selectedStudent.progress}%</span>
                        <div className="bg-gray-200 dark:bg-gray-700 h-2 w-20 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full" 
                            style={{ width: `${selectedStudent.progress}%` }} 
                          />
                        </div>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">출석률:</dt>
                      <dd>{selectedStudent.attendance}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">마지막 출석:</dt>
                      <dd>{selectedStudent.lastAttendance}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center">
                    <Calendar className="mr-2 h-5 w-5" /> 출석 기록
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>회차</TableHead>
                        <TableHead>날짜</TableHead>
                        <TableHead>출석 여부</TableHead>
                        <TableHead>참여도</TableHead>
                        <TableHead>과제 제출</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>1회차</TableCell>
                        <TableCell>2025.04.15</TableCell>
                        <TableCell>O</TableCell>
                        <TableCell>상</TableCell>
                        <TableCell>O</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2회차</TableCell>
                        <TableCell>2025.04.22</TableCell>
                        <TableCell>O</TableCell>
                        <TableCell>중</TableCell>
                        <TableCell>O</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>3회차</TableCell>
                        <TableCell>2025.04.29</TableCell>
                        <TableCell>O</TableCell>
                        <TableCell>상</TableCell>
                        <TableCell>X</TableCell>
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

      {/* 메시지 보내기 모달 */}
      <Dialog open={activeModal === 'message'} onOpenChange={() => activeModal === 'message' && closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>메시지 보내기</DialogTitle>
            <DialogDescription>
              {selectedStudent?.name}님에게 메시지를 보냅니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">제목</label>
              <input 
                id="subject" 
                className="w-full p-2 border rounded-md" 
                placeholder="메시지 제목을 입력하세요" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">내용</label>
              <textarea 
                id="message" 
                rows={5} 
                className="w-full p-2 border rounded-md" 
                placeholder="메시지 내용을 입력하세요"
              ></textarea>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>취소</Button>
            <Button onClick={closeModal}>보내기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 알림장 모달 */}
      <Dialog open={activeModal === 'notes'} onOpenChange={() => activeModal === 'notes' && closeModal()}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>알림장</DialogTitle>
            <DialogDescription>
              {selectedStudent?.name}님의 알림장입니다.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="write">
            <TabsList>
              <TabsTrigger value="write">새 알림장 작성</TabsTrigger>
              <TabsTrigger value="history">알림장 내역</TabsTrigger>
            </TabsList>
            
            <TabsContent value="write" className="pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="note-title" className="text-sm font-medium">제목</label>
                  <input 
                    id="note-title" 
                    className="w-full p-2 border rounded-md" 
                    placeholder="알림장 제목" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="note-content" className="text-sm font-medium">내용</label>
                  <textarea 
                    id="note-content" 
                    rows={8} 
                    className="w-full p-2 border rounded-md" 
                    placeholder="오늘의 교육 내용 및 반려견 행동 개선 사항"
                  ></textarea>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">첨부파일</label>
                  <input 
                    type="file" 
                    className="w-full" 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="pt-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">2025.04.29 - 3회차 수업 알림장</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>오늘 수업에서는 엎드리기와 일어서기 명령어를 배웠습니다. 몽이는 특히 엎드리기 동작을 빠르게 습득했으며, 반복 훈련을 통해 점차 안정적으로 수행할 수 있게 되었습니다.</p>
                    <p className="mt-2">다음 수업까지 다음 과제를 수행해주세요:</p>
                    <ul className="list-disc pl-5 mt-1">
                      <li>하루 10분씩 엎드리기, 일어서기 반복 훈련</li>
                      <li>다양한 장소에서 명령어 시도해보기</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">2025.04.22 - 2회차 수업 알림장</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>오늘은 앉기와 기다리기 명령어를 배웠습니다. 몽이는 앉기는 잘 따라했지만, 기다리기는 아직 집중력이 필요해 보입니다. 낯선 환경에서 약간의 불안 증세를 보였으나 점차 적응하는 모습이었습니다.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>취소</Button>
            <Button onClick={closeModal}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}