import { Link, useLocation } from 'wouter';
import { useAuth } from "../../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
// Avatar 컴포넌트 대신 기본 div 요소 사용
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Clock, 
  TrendingUp,
  Bell,
  MessageSquare,
  Sparkles,
  Award
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 모달 상태 타입 정의
type StatsModalType = 'students' | 'courses' | 'schedule' | 'income' | null;

// 페이지 이동 핸들러 함수 - wouter의 useLocation 활용
const handleNavigation = (path: string, userRole: string | null) => {
  const [, setLocation] = useLocation();
  
  // 훈련사 전용 페이지 권한 확인
  if (path.startsWith('/trainer/') && userRole !== 'trainer' && userRole !== 'admin') {
    // 권한 없음 페이지로 리다이렉트할 수도 있지만 
    // 여기선 간단히 콘솔 경고만 표시 (이미 상위 컴포넌트에서 권한 검증함)
    console.warn('권한 부족: 해당 페이지에 접근할 수 없습니다.');
    return false;
  }
  
  // 정상 이동 처리 - Wouter 라우터 사용
  setLocation(path);
  return true;
};

// 훈련사 대시보드를 위한 목업 데이터
const recentStudents = [
  {
    id: 1,
    name: "김견주",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    course: "반려견 기초 훈련 마스터하기",
    progress: 65,
    lastActivity: "오늘",
    pet: {
      name: "몽이",
      breed: "포메라니안",
      image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  },
  {
    id: 2,
    name: "이반려",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    course: "반려견 사회화 훈련",
    progress: 45,
    lastActivity: "어제",
    pet: {
      name: "콩이",
      breed: "골든 리트리버",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  },
  {
    id: 3,
    name: "박보호",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    course: "반려견 어질리티 입문",
    progress: 30,
    lastActivity: "3일 전",
    pet: {
      name: "까미",
      breed: "보더 콜리",
      image: "https://images.unsplash.com/photo-1583512603806-077998240c7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  }
];

const upcomingClasses = [
  {
    id: 1,
    title: "반려견 기초 훈련 마스터하기",
    type: "일대일 비대면",
    date: "2025-05-12",
    time: "오후 3:00 - 4:00",
    student: "김견주",
    pet: "몽이",
    status: "confirmed"
  },
  {
    id: 2,
    title: "반려견 사회화 훈련",
    type: "그룹 레슨",
    date: "2025-05-12",
    time: "오후 5:00 - 6:30",
    student: "다수",
    pet: "다수",
    status: "confirmed"
  },
  {
    id: 3,
    title: "문제행동 교정 상담",
    type: "일대일 비대면",
    date: "2025-05-13",
    time: "오전 11:00 - 12:00",
    student: "이반려",
    pet: "콩이",
    status: "pending"
  }
];

const notifications = [
  {
    id: 1,
    title: "새로운 수강생이 등록했습니다",
    time: "1시간 전",
    type: "student"
  },
  {
    id: 2,
    title: "상담 요청이 있습니다",
    time: "3시간 전",
    type: "consultation"
  },
  {
    id: 3,
    title: "오늘 수업 30분 전입니다",
    time: "30분 전",
    type: "reminder"
  }
];

const messages = [
  {
    id: 1,
    sender: "김견주",
    content: "수업 시간 변경 가능할까요?",
    time: "10:30 AM",
    unread: true
  },
  {
    id: 2,
    sender: "이반려",
    content: "훈련 영상 확인했습니다",
    time: "어제",
    unread: false
  }
];

export default function TrainerHome() {
  const { isAuthenticated, userRole, userName } = useAuth();
  // 모달 상태
  const [activeModal, setActiveModal] = useState<StatsModalType>(null);
  const [activeTab, setActiveTab] = useState("current"); // 기본 탭 설정

  // 모달 열기
  const openModal = (type: StatsModalType) => {
    console.log(`${type} 모달 열기`);
    setActiveModal(type);
  };

  // 모달 닫기
  const closeModal = () => {
    setActiveModal(null);
  };

  useEffect(() => {
    // 권한 체크 (훈련사 전용 페이지 접근 권한 검증)
    if (!isAuthenticated || (userRole !== 'trainer' && userRole !== 'admin')) {
      // 인증되지 않았거나 훈련사 또는 관리자가 아닌 경우, 
      // 이 부분은 상위 라우트에서 처리하는 것이 더 좋음
      // 여기서는 페이지 내부 콘텐츠 숨김 정도로만 처리
    }
  }, [isAuthenticated, userRole]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 훈련사 프로필 및 주요 통계 */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="relative h-16 w-16 mr-4 flex shrink-0 overflow-hidden rounded-full bg-primary/20">
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-lg font-bold text-primary">{userName?.charAt(0) || "T"}</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{userName || '훈련사'} 님, 안녕하세요!</h1>
                  <div className="flex items-center mt-1">
                    <Badge className="mr-2 bg-primary/10 text-primary hover:bg-primary/20">훈련사</Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">최근 접속: 오늘</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleNavigation('/trainer/profile', userRole)}
                >
                  프로필 관리
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleNavigation('/trainer/courses/new', userRole)}
                >
                  강의 개설하기
                </Button>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 pt-0">
            <div 
              className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors cursor-pointer"
              onClick={() => openModal('students')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-full mr-3">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">수강생</p>
                  <p className="text-xl font-bold">78명</p>
                </div>
              </div>
            </div>

            <div 
              className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors cursor-pointer"
              onClick={() => openModal('courses')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 dark:bg-amber-800/30 rounded-full mr-3">
                  <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">강의</p>
                  <p className="text-xl font-bold">12개</p>
                </div>
              </div>
            </div>

            <div 
              className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/40 transition-colors cursor-pointer"
              onClick={() => openModal('schedule')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-full mr-3">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">이번 주 일정</p>
                  <p className="text-xl font-bold">8회</p>
                </div>
              </div>
            </div>

            <div 
              className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/40 transition-colors cursor-pointer"
              onClick={() => openModal('income')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded-full mr-3">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">월 수익</p>
                  <p className="text-xl font-bold">₩1,250,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 수강생 목록 및 실적 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 오늘의 일정 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  다가오는 일정
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleNavigation('/trainer/schedule', userRole)}
                >
                  전체 보기
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.map(session => (
                  <div key={session.id} className="flex items-start p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{session.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {session.date.replace(/-/g, '.')} {session.time}
                          </p>
                        </div>
                        <Badge variant={session.status === 'confirmed' ? 'default' : 'outline'}>
                          {session.status === 'confirmed' ? '확정' : '대기중'}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-2">
                        <Badge variant="outline" className="mr-2">{session.type}</Badge>
                        <span className="text-sm">
                          {session.student} / {session.pet}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {upcomingClasses.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">예정된 일정이 없습니다</p>
                  </div>
                )}

                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleNavigation('/trainer/schedule/new', userRole)}
                  >
                    새 일정 등록하기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 최근 수강생 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  최근 수강생
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleNavigation('/trainer/students', userRole)}
                >
                  전체 보기
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentStudents.map(student => (
                  <div key={student.id} className="flex items-start p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="relative h-10 w-10 flex shrink-0 overflow-hidden rounded-full bg-primary/20">
                      {student.image ? (
                        <img src={student.image} alt={student.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-sm font-bold text-primary">{student.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{student.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{student.course}</p>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {student.lastActivity}
                        </div>
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          <div className="relative h-6 w-6 mr-2 flex shrink-0 overflow-hidden rounded-full bg-primary/20">
                            {student.pet.image ? (
                              <img src={student.pet.image} alt={student.pet.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <span className="text-xs font-bold text-primary">{student.pet.name.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-sm">{student.pet.name} ({student.pet.breed})</span>
                        </div>
                        <div className="ml-auto">
                          <div className="text-xs flex items-center">
                            <span className="mr-2">진도율: {student.progress}%</span>
                            <div className="bg-gray-200 dark:bg-gray-700 h-1.5 w-20 rounded-full overflow-hidden">
                              <div 
                                className="bg-primary h-full rounded-full" 
                                style={{ width: `${student.progress}%` }} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {recentStudents.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">아직 수강생이 없습니다</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 자격증 및 성과 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  자격증 및 성과
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleNavigation('/trainer/profile/certificates', userRole)}
                >
                  관리하기
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full mr-3">
                        <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">반려동물행동교정사</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">한국반려동물협회</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3">
                        <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">반려견 훈련사 2급</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">한국애견협회</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full mr-3">
                        <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">최우수 훈련사상</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2024 펫에듀 어워드</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center">
                    <Link href="/trainer/profile/certificates/new">
                      <Button variant="ghost" size="sm" className="flex items-center">
                        <span className="text-xl mr-1">+</span> 자격증 추가하기
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽 사이드바: 알림 및 빠른 액세스 */}
        <div className="space-y-6">
          {/* 빠른 액세스 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">빠른 액세스</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/trainer/courses/new">
                  <Button variant="outline" className="w-full justify-start h-auto py-3">
                    <BookOpen className="h-5 w-5 mr-2" />
                    <span>강의 개설</span>
                  </Button>
                </Link>
                <Link href="/trainer/students">
                  <Button variant="outline" className="w-full justify-start h-auto py-3">
                    <Users className="h-5 w-5 mr-2" />
                    <span>수강생 관리</span>
                  </Button>
                </Link>
                <Link href="/trainer/schedule">
                  <Button variant="outline" className="w-full justify-start h-auto py-3">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>일정 관리</span>
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button variant="outline" className="w-full justify-start h-auto py-3">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    <span>메시지</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 알림 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-primary" />
                  알림
                </CardTitle>
                <Link href="/notifications">
                  <Button variant="ghost" size="sm">모두 보기</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full mr-3 ${
                        notification.type === 'student' 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : notification.type === 'consultation' 
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                      }`}>
                        {notification.type === 'student' ? (
                          <Users className="h-4 w-4" />
                        ) : notification.type === 'consultation' ? (
                          <MessageSquare className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {notifications.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400">새로운 알림이 없습니다</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 메시지 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                  메시지
                </CardTitle>
                <Link href="/messages">
                  <Button variant="ghost" size="sm">모두 보기</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`p-3 rounded-lg border ${message.unread 
                      ? 'border-primary/20 bg-primary/5 dark:border-primary/30 dark:bg-primary/10' 
                      : 'border-gray-100 dark:border-gray-800'} 
                      hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">
                        {message.sender}
                        {message.unread && <span className="inline-block ml-2 w-2 h-2 rounded-full bg-primary"></span>}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{message.time}</span>
                    </div>
                    <p className="text-sm mt-1 truncate">{message.content}</p>
                  </div>
                ))}
                
                {messages.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400">새로운 메시지가 없습니다</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 수강생 모달 */}
      <Dialog open={activeModal === 'students'} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> 수강생 현황
            </DialogTitle>
            <DialogDescription>
              현재 등록된 수강생 목록과 진행 상황을 확인하세요.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">현재 수강생</TabsTrigger>
              <TabsTrigger value="graduated">수료 완료</TabsTrigger>
            </TabsList>
            <TabsContent value="current" className="mt-4">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead>반려견</TableHead>
                      <TableHead>강의</TableHead>
                      <TableHead>진도율</TableHead>
                      <TableHead>최근 활동</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentStudents.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.pet.name} ({student.pet.breed})</TableCell>
                        <TableCell>{student.course}</TableCell>
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
                        <TableCell>{student.lastActivity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="graduated" className="mt-4">
              <div className="text-center py-8 text-gray-500">
                <p>수료 완료된 수강생이 없습니다.</p>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button onClick={closeModal} variant="ghost">닫기</Button>
            <Button onClick={() => handleNavigation('/trainer/students', userRole)}>모든 수강생 보기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 강의 모달 */}
      <Dialog open={activeModal === 'courses'} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> 강의 현황
            </DialogTitle>
            <DialogDescription>
              현재 운영 중인 강의와 예정된 강의 목록입니다.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">진행 중</TabsTrigger>
              <TabsTrigger value="upcoming">예정</TabsTrigger>
              <TabsTrigger value="completed">완료</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>강의명</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>수강생 수</TableHead>
                      <TableHead>시작일</TableHead>
                      <TableHead>평점</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">반려견 기초 훈련 마스터하기</TableCell>
                      <TableCell>그룹</TableCell>
                      <TableCell>12명</TableCell>
                      <TableCell>2025.04.15</TableCell>
                      <TableCell>4.8/5.0</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">문제행동 교정 과정</TableCell>
                      <TableCell>1:1</TableCell>
                      <TableCell>5명</TableCell>
                      <TableCell>2025.04.28</TableCell>
                      <TableCell>4.9/5.0</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="upcoming" className="mt-4">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>강의명</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>예정 인원</TableHead>
                      <TableHead>시작일</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">반려견 어질리티 입문</TableCell>
                      <TableCell>그룹</TableCell>
                      <TableCell>6명</TableCell>
                      <TableCell>2025.05.20</TableCell>
                      <TableCell>모집 중</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              <div className="text-center py-8 text-gray-500">
                <p>지난 3개월 내 완료된 강의가 없습니다.</p>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button onClick={closeModal} variant="ghost">닫기</Button>
            <Button onClick={() => handleNavigation('/trainer/courses', userRole)}>모든 강의 보기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 일정 모달 */}
      <Dialog open={activeModal === 'schedule'} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> 주간 일정
            </DialogTitle>
            <DialogDescription>
              이번 주 및 다음 주 예정된 일정입니다.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="thisWeek" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="thisWeek">이번 주</TabsTrigger>
              <TabsTrigger value="nextWeek">다음 주</TabsTrigger>
            </TabsList>
            <TabsContent value="thisWeek" className="mt-4">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>일정</TableHead>
                      <TableHead>날짜</TableHead>
                      <TableHead>시간</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>수강생</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingClasses.map(session => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.title}</TableCell>
                        <TableCell>{session.date.replace(/-/g, '.')}</TableCell>
                        <TableCell>{session.time}</TableCell>
                        <TableCell>{session.type}</TableCell>
                        <TableCell>{session.student}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="nextWeek" className="mt-4">
              <div className="text-center py-8 text-gray-500">
                <p>다음 주 예정된 일정이 없습니다.</p>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="flex justify-between">
            <Button onClick={() => handleNavigation('/trainer/schedule/new', userRole)} variant="outline">새 일정 등록</Button>
            <div>
              <Button onClick={closeModal} variant="ghost" className="mr-2">닫기</Button>
              <Button onClick={() => handleNavigation('/trainer/schedule', userRole)}>일정 관리</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 수익 모달 */}
      <Dialog open={activeModal === 'income'} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> 수익 현황
            </DialogTitle>
            <DialogDescription>
              월별 수익 및 수강료 정산 현황입니다.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="monthly" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="monthly">월별 수익</TabsTrigger>
              <TabsTrigger value="courses">강의별 수익</TabsTrigger>
              <TabsTrigger value="payments">정산 현황</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly" className="mt-4">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>월</TableHead>
                      <TableHead>총 수익</TableHead>
                      <TableHead>강의 수</TableHead>
                      <TableHead>수강생 수</TableHead>
                      <TableHead>증감률</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">2025년 5월</TableCell>
                      <TableCell>₩1,250,000</TableCell>
                      <TableCell>3개</TableCell>
                      <TableCell>17명</TableCell>
                      <TableCell className="text-green-600">+15%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">2025년 4월</TableCell>
                      <TableCell>₩1,080,000</TableCell>
                      <TableCell>3개</TableCell>
                      <TableCell>15명</TableCell>
                      <TableCell className="text-green-600">+8%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">2025년 3월</TableCell>
                      <TableCell>₩1,000,000</TableCell>
                      <TableCell>2개</TableCell>
                      <TableCell>12명</TableCell>
                      <TableCell className="text-gray-400">-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="courses" className="mt-4">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>강의명</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>수강생 수</TableHead>
                      <TableHead>월 수익</TableHead>
                      <TableHead>비율</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">반려견 기초 훈련 마스터하기</TableCell>
                      <TableCell>그룹</TableCell>
                      <TableCell>12명</TableCell>
                      <TableCell>₩600,000</TableCell>
                      <TableCell>48%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">문제행동 교정 과정</TableCell>
                      <TableCell>1:1</TableCell>
                      <TableCell>5명</TableCell>
                      <TableCell>₩650,000</TableCell>
                      <TableCell>52%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="payments" className="mt-4">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>정산 예정일</TableHead>
                      <TableHead>금액</TableHead>
                      <TableHead>공제액</TableHead>
                      <TableHead>실 수령액</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">2025.05.25</TableCell>
                      <TableCell>₩1,250,000</TableCell>
                      <TableCell>₩125,000</TableCell>
                      <TableCell>₩1,125,000</TableCell>
                      <TableCell>정산 예정</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">2025.04.25</TableCell>
                      <TableCell>₩1,080,000</TableCell>
                      <TableCell>₩108,000</TableCell>
                      <TableCell>₩972,000</TableCell>
                      <TableCell>정산 완료</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button onClick={closeModal} variant="ghost">닫기</Button>
            <Button onClick={() => handleNavigation('/trainer/income', userRole)}>상세 수익 보기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}