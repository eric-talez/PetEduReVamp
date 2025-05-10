import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
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
type ModalType = 'details' | 'message' | 'schedule' | 'notes' | 'assignments' | 'remove' | 'register' | 'match' | null;

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
  instituteId?: number;
  instituteName?: string;
  instituteCode?: string;
  matchStatus?: '미지정' | '대기중' | '매치완료';
  matchedTrainerId?: number;
  matchedTrainerName?: string;
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
      note: '낯가림이 심한 편, 소음에 민감하게 반응',
      instituteId: 1,
      instituteName: '행복한 애견 교실',
      matchStatus: '매치완료',
      matchedTrainerId: 101,
      matchedTrainerName: '김훈련'
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
      lastAttendance: '2025.04.29',
      instituteId: 1,
      instituteName: '행복한 애견 교실',
      matchStatus: '매치완료',
      matchedTrainerId: 101,
      matchedTrainerName: '김훈련'
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
      note: '주인의 출장으로 인해 일시 중지 상태',
      instituteId: 2,
      instituteName: '도그 아카데미',
      matchStatus: '대기중'
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
      lastAttendance: '2025.02.15',
      instituteId: 1,
      instituteName: '행복한 애견 교실',
      matchStatus: '매치완료',
      matchedTrainerId: 102,
      matchedTrainerName: '이트레이너'
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
      note: '이사로 인한 중도 포기',
      instituteId: 2,
      instituteName: '도그 아카데미',
      matchStatus: '매치완료',
      matchedTrainerId: 103,
      matchedTrainerName: '박트레이너'
    },
    {
      id: 6,
      name: '장나라',
      contact: '010-9876-5432',
      email: 'nara@example.com',
      petName: '보리',
      petBreed: '웰시코기',
      petAge: 1,
      petGender: '암컷',
      petNeutered: false,
      status: '수강중',
      joinDate: '2025.04.20',
      courseId: 3,
      courseName: '반려견 어질리티 입문',
      courseType: '그룹',
      progress: 10,
      attendance: 100,
      lastAttendance: '2025.04.27',
      instituteCode: 'HAPPY2025',
      note: '기관 코드 등록 완료, 기관 승인 대기 중'
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
        <div className="flex space-x-2">
          <Button onClick={() => openModal('register')}>
            기관 코드 등록
          </Button>
          <Button onClick={() => openModal('match')}>
            훈련사 매칭
          </Button>
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
                    <TableHead>기관</TableHead>
                    <TableHead>매칭상태</TableHead>
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
                        <TableCell>
                          {student.instituteName || (student.instituteCode ? 
                            <Badge variant="warning">코드: {student.instituteCode}</Badge> : 
                            <Badge variant="outline">미소속</Badge>)}
                        </TableCell>
                        <TableCell>
                          {student.matchStatus ? (
                            <Badge
                              variant={
                                student.matchStatus === '매치완료' ? 'success' :
                                student.matchStatus === '대기중' ? 'warning' :
                                'outline'
                              }
                            >
                              {student.matchStatus}
                              {student.matchStatus === '매치완료' && student.matchedTrainerName && 
                                ` (${student.matchedTrainerName})`}
                            </Badge>
                          ) : (
                            <Badge variant="outline">미지정</Badge>
                          )}
                        </TableCell>
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
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">소속기관:</dt>
                        <dd>
                          {selectedStudent.instituteName || 
                            (selectedStudent.instituteCode ? 
                              <Badge variant="warning">코드: {selectedStudent.instituteCode}</Badge> : 
                              <Badge variant="outline">미소속</Badge>
                            )
                          }
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">매칭상태:</dt>
                        <dd>
                          {selectedStudent.matchStatus ? (
                            <Badge
                              variant={
                                selectedStudent.matchStatus === '매치완료' ? 'success' :
                                selectedStudent.matchStatus === '대기중' ? 'warning' :
                                'outline'
                              }
                            >
                              {selectedStudent.matchStatus}
                            </Badge>
                          ) : (
                            <Badge variant="outline">미지정</Badge>
                          )}
                        </dd>
                      </div>
                      {selectedStudent.matchedTrainerName && (
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">매칭된 훈련사:</dt>
                          <dd>{selectedStudent.matchedTrainerName}</dd>
                        </div>
                      )}
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

      {/* 기관 코드 등록 모달 */}
      <Dialog open={activeModal === 'register'} onOpenChange={() => activeModal === 'register' && closeModal()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>기관 코드 등록</DialogTitle>
            <DialogDescription>
              기관 코드를 등록하여 소속 기관에 연결하세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="institute-code" className="text-sm font-medium">기관 코드</label>
              <div className="flex space-x-2">
                <input
                  id="institute-code"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="기관에서 제공받은 코드를 입력하세요"
                  type="password"
                />
                <Button variant="outline">확인</Button>
              </div>
              <p className="text-sm text-gray-500">
                기관 코드는 소속 기관의 관리자에게만 제공되며 보안을 위해 공개되지 않습니다.
              </p>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">기관 코드 등록 절차</h3>
              <ol className="space-y-2 list-decimal list-inside text-sm text-gray-600">
                <li>반려동물 소유자는 <strong>기관에서 직접 제공받은</strong> 코드를 입력합니다.</li>
                <li>기관 코드는 <strong>각 기관의 관리자만 발급</strong>할 수 있으며 엄격하게 관리됩니다.</li>
                <li>코드 확인 후 기관 관리자가 등록 요청을 검토하고 승인합니다.</li>
                <li>승인이 완료되면 기관 소속 견주로 등록됩니다.</li>
                <li>기관 관리자가 적합한 훈련사와 매칭을 진행합니다.</li>
              </ol>
              <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-200">
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  기관 코드는 절대 공유되지 않으며, 타 기관에서는 접근할 수 없습니다.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>취소</Button>
            <Button onClick={() => {
              console.log('기관 코드 등록 요청');
              closeModal();
            }}>등록 요청</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 훈련사 매칭 모달 */}
      <Dialog open={activeModal === 'match'} onOpenChange={() => activeModal === 'match' && closeModal()}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>훈련사 매칭 관리</DialogTitle>
            <DialogDescription>
              견주와 훈련사를 매칭하여 훈련 과정을 시작하세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">매칭 권한 안내</h3>
              <p className="text-sm text-gray-600 mb-2">
                훈련사 매칭은 <strong>각 기관의 관리자만</strong> 수행할 수 있는 작업입니다. 
                훈련사는 자신에게 매칭된 견주와 반려견만 확인할 수 있습니다.
              </p>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200 mb-2">
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  다른 기관에 소속된 견주는 표시되지 않으며, 각 기관은 자신의 소속 견주만 관리합니다.
                </p>
              </div>
            </div>

            <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium mb-2">내게 매칭된 견주</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>반려견</TableHead>
                    <TableHead>기관</TableHead>
                    <TableHead>매칭 날짜</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students
                    .filter(s => s.matchStatus === '매치완료' && s.matchedTrainerId === 101) // 101은 현재 훈련사 ID
                    .map(student => (
                      <TableRow key={`matched-${student.id}`}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.petName} ({student.petBreed})</TableCell>
                        <TableCell>{student.instituteName}</TableCell>
                        <TableCell>2025.04.01</TableCell>
                        <TableCell>
                          <Badge variant="success">매칭 완료</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  {students.filter(s => s.matchStatus === '매치완료' && s.matchedTrainerId === 101).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        매칭된 견주가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="border rounded-md p-4 bg-yellow-50 dark:bg-yellow-900/20">
              <h3 className="font-medium mb-2">기관 관리자 기능</h3>
              <p className="text-sm text-gray-600 mb-4">
                아래 기능은 <strong>기관 관리자만</strong> 사용할 수 있습니다. 훈련사는 조회만 가능합니다.
              </p>
              
              <div className="border-t pt-2 opacity-60">
                <h4 className="font-medium text-sm mb-2">매칭 대기 중인 견주</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead>반려견</TableHead>
                      <TableHead>기관</TableHead>
                      <TableHead>액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-gray-500 italic">
                        기관 관리자 권한 필요
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="border-t pt-2 mt-4 opacity-60">
                <h4 className="font-medium text-sm mb-2">수동 매칭</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="student-select" className="text-sm font-medium block mb-1">견주 선택</label>
                    <select
                      id="student-select"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      disabled
                    >
                      <option value="">기관 관리자 권한 필요</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="trainer-select" className="text-sm font-medium block mb-1">훈련사 선택</label>
                    <select
                      id="trainer-select"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      disabled
                    >
                      <option value="">기관 관리자 권한 필요</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}