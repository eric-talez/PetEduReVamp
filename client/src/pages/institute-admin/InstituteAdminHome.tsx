import { Link } from 'wouter';
import { useAuth } from "../../SimpleApp";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Clock, 
  Building2,
  Bell,
  BarChart3,
  Award,
  UserCheck,
  Settings,
  Pencil,
  DollarSign
} from 'lucide-react';
import { useEffect } from 'react';

// 기관 관리자 대시보드를 위한 목업 데이터
const instituteData = {
  name: "행복한 댕댕 아카데미",
  address: "서울시 강남구 강남대로 123",
  phone: "02-123-4567",
  website: "www.happy-doggy.com",
  enrollments: 85,
  trainers: 12,
  courses: 24,
  rating: 4.8,
  revenue: {
    thisMonth: 15800000,
    lastMonth: 14200000,
    growth: 11.3
  },
  status: "active"
};

const trainers = [
  {
    id: 1,
    name: "김훈련",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    role: "수석 훈련사",
    specialty: "기본 훈련, 행동 교정",
    students: 28,
    courses: 5,
    rating: 4.9
  },
  {
    id: 2,
    name: "이교정",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    role: "행동 교정 전문가",
    specialty: "문제행동 교정, 공격성 관리",
    students: 22,
    courses: 3,
    rating: 4.7
  },
  {
    id: 3,
    name: "박전문",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    role: "트레이너",
    specialty: "어질리티, 고급 훈련",
    students: 18,
    courses: 4,
    rating: 4.8
  }
];

const upcomingCourses = [
  {
    id: 1,
    title: "반려견 기초 훈련 마스터하기",
    start: "2025-05-15",
    end: "2025-06-30",
    trainer: "김훈련",
    students: 15,
    maxStudents: 20,
    status: "enrolling"
  },
  {
    id: 2,
    title: "문제행동 교정 전문과정",
    start: "2025-05-20",
    end: "2025-07-10",
    trainer: "이교정",
    students: 12,
    maxStudents: 15,
    status: "confirmed"
  },
  {
    id: 3,
    title: "고급 어질리티 훈련",
    start: "2025-06-01",
    end: "2025-07-15",
    trainer: "박전문",
    students: 8,
    maxStudents: 12,
    status: "enrolling"
  }
];

const notifications = [
  {
    id: 1,
    title: "신규 등록 요청",
    content: "김견주님이 '반려견 기초 훈련 마스터하기' 과정 등록을 요청했습니다.",
    time: "30분 전",
    type: "enrollment"
  },
  {
    id: 2,
    title: "신규 훈련사 지원",
    content: "최신입님이 훈련사 포지션에 지원했습니다. 이력서를 검토해주세요.",
    time: "2시간 전",
    type: "application"
  },
  {
    id: 3,
    title: "결제 완료",
    content: "이반려님이 '문제행동 교정 전문과정'의 수강료를 결제했습니다.",
    time: "3시간 전",
    type: "payment"
  }
];

export default function InstituteAdminHome() {
  const { isAuthenticated, userRole, userName } = useAuth();

  useEffect(() => {
    console.log("기관 관리자 홈 페이지 로드됨");
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 기관 정보 및 주요 통계 */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="relative h-16 w-16 mr-4 flex shrink-0 overflow-hidden rounded-full bg-primary/20">
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-lg font-bold text-primary">{instituteData.name.charAt(0)}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold">{instituteData.name}</h1>
                    <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">{instituteData.status === 'active' ? '운영중' : '준비중'}</Badge>
                  </div>
                  <div className="flex items-center mt-1">
                    <Badge className="mr-2 bg-primary/10 text-primary hover:bg-primary/20">기관 관리자</Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{userName || '관리자'} 님</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href="/institute-dashboard/settings">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Settings className="h-4 w-4 mr-1" />
                    기관 관리
                  </Button>
                </Link>
                <Link href="/institute-dashboard/courses/new">
                  <Button size="sm" className="flex items-center">
                    <Pencil className="h-4 w-4 mr-1" />
                    강의 개설
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 pt-0">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-full mr-3">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">총 수강생</p>
                  <p className="text-xl font-bold">{instituteData.enrollments}명</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 dark:bg-amber-800/30 rounded-full mr-3">
                  <UserCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">훈련사</p>
                  <p className="text-xl font-bold">{instituteData.trainers}명</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-full mr-3">
                  <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">개설 강의</p>
                  <p className="text-xl font-bold">{instituteData.courses}개</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded-full mr-3">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">이번 달 매출</p>
                  <div className="flex items-center">
                    <p className="text-xl font-bold">{(instituteData.revenue.thisMonth / 10000).toFixed(0)}만원</p>
                    <span className={`text-xs ml-2 ${instituteData.revenue.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {instituteData.revenue.growth > 0 ? '+' : ''}{instituteData.revenue.growth}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 훈련사 목록 및 강의 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 훈련사 목록 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  훈련사 관리
                </CardTitle>
                <Link href="/institute-dashboard/trainers">
                  <Button variant="ghost" size="sm">전체 보기</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainers.map(trainer => (
                  <div key={trainer.id} className="flex items-start p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="relative h-12 w-12 flex shrink-0 overflow-hidden rounded-full bg-primary/20">
                      {trainer.image ? (
                        <img src={trainer.image} alt={trainer.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-sm font-bold text-primary">{trainer.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{trainer.name}</h3>
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">{trainer.role}</Badge>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{trainer.specialty}</p>
                          </div>
                        </div>
                        <Link href={`/institute-dashboard/trainers/${trainer.id}`}>
                          <Button variant="ghost" size="sm">관리</Button>
                        </Link>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="text-xs">
                          <span className="text-gray-500 dark:text-gray-400">수강생:</span> {trainer.students}명
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500 dark:text-gray-400">강의:</span> {trainer.courses}개
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500 dark:text-gray-400">평점:</span> {trainer.rating}/5.0
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <Link href="/institute-dashboard/trainers/invite">
                    <Button variant="outline" size="sm" className="w-full">
                      새 훈련사 초대하기
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 강의 관리 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  강의 관리
                </CardTitle>
                <Link href="/institute-dashboard/courses">
                  <Button variant="ghost" size="sm">전체 보기</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingCourses.map(course => (
                  <div key={course.id} className="flex flex-col p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{course.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {course.start.replace(/-/g, '.')} ~ {course.end.replace(/-/g, '.')}
                        </p>
                      </div>
                      <Badge variant={course.status === 'confirmed' ? 'default' : 'outline'}>
                        {course.status === 'confirmed' ? '확정' : '모집중'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center">
                        <span className="text-sm">훈련사: {course.trainer}</span>
                        <div className="mx-2 h-3 w-px bg-gray-300 dark:bg-gray-600"></div>
                        <span className="text-sm">수강생: {course.students}/{course.maxStudents}명</span>
                      </div>
                      <Link href={`/institute-dashboard/courses/${course.id}`}>
                        <Button variant="ghost" size="sm">관리</Button>
                      </Link>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center">
                        <p className="text-xs font-medium mr-2">수강 신청률: {Math.round(course.students / course.maxStudents * 100)}%</p>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full" 
                            style={{ width: `${Math.round(course.students / course.maxStudents * 100)}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <Link href="/institute-dashboard/courses/new">
                    <Button variant="outline" size="sm" className="w-full">
                      새 강의 개설하기
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 기관 통계 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  기관 통계
                </CardTitle>
                <Link href="/institute-dashboard/analytics">
                  <Button variant="ghost" size="sm">상세 분석</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-3">강의별 수강생 비율</h3>
                  <div className="aspect-square bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">여기에 차트가 표시됩니다</p>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-3">월별 매출 추이</h3>
                  <div className="aspect-square bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">여기에 차트가 표시됩니다</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽 사이드바: 알림, 기관 정보 등 */}
        <div className="space-y-6">
          {/* 알림 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                알림
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div key={notification.id} className="p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full mr-3 ${
                        notification.type === 'enrollment' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        notification.type === 'application' ? 'bg-amber-100 dark:bg-amber-900/30' :
                        'bg-green-100 dark:bg-green-900/30'
                      }`}>
                        {notification.type === 'enrollment' ? (
                          <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        ) : notification.type === 'application' ? (
                          <UserCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-medium">{notification.title}</h3>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{notification.content}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">알림이 없습니다</p>
                  </div>
                )}

                <Link href="/institute-dashboard/notifications">
                  <Button variant="ghost" size="sm" className="w-full mt-2">
                    모든 알림 보기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 기관 정보 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-primary" />
                기관 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">주소</p>
                    <p className="text-sm font-medium">{instituteData.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">연락처</p>
                    <p className="text-sm font-medium">{instituteData.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">웹사이트</p>
                    <p className="text-sm font-medium">{instituteData.website}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">평점</p>
                    <p className="text-sm font-medium">{instituteData.rating}/5.0</p>
                  </div>
                </div>

                <Link href="/institute-dashboard/settings">
                  <Button variant="outline" size="sm" className="w-full">
                    기관 정보 수정
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 빠른 액션 버튼 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">빠른 액션</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Link href="/institute-dashboard/enrollments">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  수강 신청 관리
                </Button>
              </Link>
              <Link href="/institute-dashboard/schedule">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  일정 관리
                </Button>
              </Link>
              <Link href="/institute-dashboard/finances">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  재정 관리
                </Button>
              </Link>
              <Link href="/institute-dashboard/messages">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  메시지
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 신규 등록 요약 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">신규 등록 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm">신규 수강생</p>
                  <Badge>+12명</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">신규 강의</p>
                  <Badge>+3개</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">신규 문의</p>
                  <Badge>+5건</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}