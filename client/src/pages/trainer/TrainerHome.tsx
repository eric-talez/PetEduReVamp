import { useAuth } from '@/lib/auth-compat';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// Avatar 컴포넌트 대신 직접 이미지 태그 사용
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Star, TrendingUp, Calendar, Clock, Bell, List, 
  ChevronRight, MessageCircle, BookOpen, Clipboard, Award
} from 'lucide-react';
import { Link } from 'wouter';

export default function TrainerHome() {
  const { userName } = useAuth();
  
  // 수강생 데이터 모의 
  const recentStudents = [
    {
      id: 1,
      name: "김시현",
      image: null,
      course: "반려견 기초 훈련 마스터하기",
      progress: 65,
      lastActivity: "오늘",
      pet: {
        name: "몽이",
        image: null
      }
    },
    {
      id: 2,
      name: "이현준",
      image: null,
      course: "반려견 사회화 훈련",
      progress: 45,
      lastActivity: "어제",
      pet: {
        name: "콩이",
        image: null
      }
    },
    {
      id: 3,
      name: "박민지",
      image: null,
      course: "반려견 어질리티 입문",
      progress: 30,
      lastActivity: "3일 전",
      pet: {
        name: "까미",
        image: null
      }
    }
  ];

  // 다가오는 일정 데이터 모의
  const upcomingSchedules = [
    {
      id: 1,
      title: "기본 훈련 12주차",
      time: "오늘 17:00",
      type: "수업",
      student: "김시현",
      pet: "몽이"
    },
    {
      id: 2,
      title: "어질리티 훈련 6주차",
      time: "내일 14:00",
      type: "수업",
      student: "박민지",
      pet: "까미"
    },
    {
      id: 3,
      title: "행동 교정 상담",
      time: "수요일 16:30",
      type: "상담",
      student: "최도윤",
      pet: "콩이"
    }
  ];
  
  // 알림장 최근 활동
  const recentNotebooks = [
    {
      id: 1,
      pet: "몽이",
      owner: "김시현",
      date: "오늘",
      content: "오늘 몽이가 '앉아' 명령에 잘 반응했습니다. 지속적인 연습이 필요합니다.",
      hasImage: true
    },
    {
      id: 2,
      pet: "까미",
      owner: "박민지",
      date: "어제",
      content: "까미의 사회화 과정에서 큰 진전이 있었습니다. 다른 강아지와의 만남에서 긍정적인 행동을 보였습니다.",
      hasImage: false
    }
  ];
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* 상단 헤더 영역 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">훈련사 대시보드</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            안녕하세요, {userName}님! 오늘도 좋은 하루 되세요.
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={() => window.location.href = '/notifications'}
          >
            <Bell className="w-4 h-4 mr-2" />
            알림
            <Badge variant="danger" className="w-5 h-5 ml-2 rounded-full p-0 flex items-center justify-center">3</Badge>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={() => window.location.href = '/calendar'}
          >
            <Calendar className="w-4 h-4 mr-2" />
            일정
          </Button>
          <Link href="/trainer/earnings">
            <Button variant="outline" size="sm" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              수익 관리
            </Button>
          </Link>
          <Link href="/trainer/students">
            <Button variant="outline" size="sm" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              학생 관리
            </Button>
          </Link>
          <Link href="/trainer/profile">
            <Button variant="outline" size="sm" className="flex items-center">
              <Award className="w-4 h-4 mr-2" />
              프로필 관리
            </Button>
          </Link>
        </div>
      </div>
      
      {/* 통계 카드 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-full mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">총 수강생</p>
                <h3 className="text-2xl font-bold">78명</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="outline" className="mr-2 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">+12%</Badge>
              <span className="text-gray-500 dark:text-gray-400">지난달 대비</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-full mr-4">
                <List className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">운영 강의</p>
                <h3 className="text-2xl font-bold">5개</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="outline" className="mr-2 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">+1</Badge>
              <span className="text-gray-500 dark:text-gray-400">지난달 신규 강의</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-3 rounded-full mr-4">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">평균 평점</p>
                <h3 className="text-2xl font-bold">4.8/5</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="outline" className="mr-2 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">+0.1</Badge>
              <span className="text-gray-500 dark:text-gray-400">지난 3개월 대비</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-full mr-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">이번 달 수익</p>
                <h3 className="text-2xl font-bold">290만원</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="outline" className="mr-2 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">+8%</Badge>
              <span className="text-gray-500 dark:text-gray-400">지난달 대비</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 빠른 액세스 메뉴 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/trainer/earnings">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">수익 관리</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">수익 내역과 정산 현황을 확인하세요</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">이번 달 순수익</span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">1,850만원</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/trainer/students">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">학생 관리</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">수강생 현황과 진도를 관리하세요</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">활성 학생</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">23명</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/trainer/profile">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">프로필 관리</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">프로필과 자격증을 관리하세요</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">프로필 완성도</span>
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">95%</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      {/* 메인 콘텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 다가오는 일정 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">다가오는 일정</CardTitle>
              <Link href="/trainer-schedule">
                <Button variant="ghost" size="sm" className="font-normal text-xs">
                  모두 보기 <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSchedules.map((schedule) => (
                <div key={schedule.id} className="flex items-start">
                  <div className="bg-primary/20 text-primary w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">{schedule.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <span className="mr-2">{schedule.time}</span>
                      <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${schedule.type === "수업" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800" : "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800"}`}>
                        {schedule.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {schedule.student} (반려견: {schedule.pet})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* 알림장 최근 활동 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">알림장 최근 활동</CardTitle>
              <Link href="/notebook">
                <Button variant="ghost" size="sm" className="font-normal text-xs">
                  모두 보기 <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotebooks.map((notebook) => (
                <div key={notebook.id} className="flex items-start">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-full mr-3">
                    <Clipboard className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{notebook.pet} ({notebook.owner})</span>
                      <span className="text-xs text-gray-500">{notebook.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {notebook.content}
                    </p>
                    {notebook.hasImage && (
                      <Badge variant="outline" className="mt-2 text-xs bg-gray-50 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400">
                        이미지 첨부됨
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2">
                <MessageCircle className="w-4 h-4 mr-2" />
                알림장 작성하기
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* 최근 수강생 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">최근 수강생</CardTitle>
              <Link href="/trainer-students">
                <Button variant="ghost" size="sm" className="font-normal text-xs">
                  모두 보기 <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentStudents.map((student) => (
                <div key={student.id} className="pb-4 border-b border-gray-100 dark:border-gray-800 last:border-none last:pb-0">
                  <div className="flex items-center mb-2">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border border-gray-200 dark:border-gray-800 shadow-sm">
                      {student.image ? (
                        <img 
                          src={student.image} 
                          alt={student.name} 
                          className="h-full w-full object-cover filter brightness-110 contrast-110"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-sm font-bold">
                          {student.name.substring(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className="ml-2">
                      <div className="font-medium text-sm">{student.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        반려견: {student.pet.name}
                      </div>
                    </div>
                    <div className="ml-auto text-xs text-gray-500">
                      {student.lastActivity}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {student.course}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs mt-1 mb-1">
                    <span className="text-gray-600 dark:text-gray-400">진도율</span>
                    <span className="font-medium">{student.progress}%</span>
                  </div>
                  <Progress value={student.progress} className="h-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 액션 버튼 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:bg-primary-50 dark:hover:bg-primary-950/10 cursor-pointer transition-colors">
          <Link href="/trainer-courses">
            <CardContent className="p-6 flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-full mr-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-base">강의 관리</CardTitle>
                <CardDescription className="mt-1 text-xs">강의 등록 및 관리를 합니다</CardDescription>
              </div>
            </CardContent>
          </Link>
        </Card>
        
        <Card className="hover:bg-primary-50 dark:hover:bg-primary-950/10 cursor-pointer transition-colors">
          <Link href="/trainer-reviews">
            <CardContent className="p-6 flex items-center">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-3 rounded-full mr-4">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-base">리뷰 관리</CardTitle>
                <CardDescription className="mt-1 text-xs">수강생 리뷰를 확인합니다</CardDescription>
              </div>
            </CardContent>
          </Link>
        </Card>
        
        <Card className="hover:bg-primary-50 dark:hover:bg-primary-950/10 cursor-pointer transition-colors">
          <Link href="/trainer-earnings">
            <CardContent className="p-6 flex items-center">
              <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-full mr-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-base">수익 관리</CardTitle>
                <CardDescription className="mt-1 text-xs">수익 현황을 확인합니다</CardDescription>
              </div>
            </CardContent>
          </Link>
        </Card>
        
        <Card className="hover:bg-primary-50 dark:hover:bg-primary-950/10 cursor-pointer transition-colors">
          <Link href="/trainer-referrals">
            <CardContent className="p-6 flex items-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-full mr-4">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-base">추천 코드</CardTitle>
                <CardDescription className="mt-1 text-xs">추천 코드를 관리합니다</CardDescription>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}