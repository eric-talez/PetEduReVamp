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
  Bell,
  MessageSquare,
  Heart,
  Award,
  Activity,
  ShoppingBag
} from 'lucide-react';
import { useEffect } from 'react';

// 견주 대시보드를 위한 목업 데이터
const myPets = [
  {
    id: 1,
    name: "몽이",
    breed: "포메라니안",
    age: 3,
    image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    healthStatus: "양호",
    vaccinations: [
      { name: "종합백신", date: "2025-02-15", nextDue: "2026-02-15" },
      { name: "광견병", date: "2025-03-10", nextDue: "2026-03-10" }
    ]
  },
  {
    id: 2,
    name: "까미",
    breed: "말티즈",
    age: 2,
    image: "https://images.unsplash.com/photo-1518378188025-22bd89516ee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    healthStatus: "양호",
    vaccinations: [
      { name: "종합백신", date: "2025-01-20", nextDue: "2026-01-20" },
      { name: "광견병", date: "2025-02-05", nextDue: "2026-02-05" }
    ]
  }
];

const upcomingLessons = [
  {
    id: 1,
    title: "반려견 기초 훈련 마스터하기",
    type: "일대일 비대면",
    date: "2025-05-12",
    time: "오후 3:00 - 4:00",
    trainer: "김훈련",
    pet: "몽이",
    status: "confirmed"
  },
  {
    id: 2,
    title: "반려견 사회화 훈련",
    type: "그룹 레슨",
    date: "2025-05-15",
    time: "오후 5:00 - 6:30",
    trainer: "이트레이너",
    pet: "까미",
    status: "confirmed"
  },
  {
    id: 3,
    title: "문제행동 교정 상담",
    type: "일대일 비대면",
    date: "2025-05-20",
    time: "오전 11:00 - 12:00",
    trainer: "박교정",
    pet: "몽이",
    status: "pending"
  }
];

const recentActivities = [
  {
    id: 1,
    type: "training",
    title: "기본 훈련 완료",
    description: "앉아, 기다려 명령 훈련 완료",
    date: "오늘",
    pet: "몽이"
  },
  {
    id: 2,
    type: "health",
    title: "건강검진 기록",
    description: "정기 건강검진 - 모든 수치 정상",
    date: "어제",
    pet: "까미"
  },
  {
    id: 3,
    type: "meal",
    title: "식사 기록",
    description: "아침/저녁 사료 급여, 간식 1회",
    date: "오늘",
    pet: "몽이"
  }
];

const healthAlerts = [
  {
    id: 1,
    title: "백신 접종 예정",
    description: "몽이 광견병 백신 접종 일정이 2주 후로 예정되어 있습니다.",
    urgency: "medium",
    date: "2025-05-24"
  },
  {
    id: 2,
    title: "정기 건강검진 예정",
    description: "까미 정기 건강검진이 1달 후로 예정되어 있습니다.",
    urgency: "low",
    date: "2025-06-10"
  }
];

export default function PetOwnerHome() {
  const { isAuthenticated, userRole, userName } = useAuth();

  useEffect(() => {
    console.log("견주 홈 페이지 로드됨");
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 견주 프로필 및 주요 통계 */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="relative h-16 w-16 mr-4 flex shrink-0 overflow-hidden rounded-full bg-primary/20">
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-lg font-bold text-primary">{userName?.charAt(0) || "P"}</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{userName || '견주'} 님, 안녕하세요!</h1>
                  <div className="flex items-center mt-1">
                    <Badge className="mr-2 bg-primary/10 text-primary hover:bg-primary/20">견주</Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">최근 접속: 오늘</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href="/my-pets">
                  <Button variant="outline" size="sm">내 반려동물 관리</Button>
                </Link>
                <Link href="/trainers">
                  <Button size="sm">훈련사 찾기</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 pt-0">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">내 반려동물</p>
                  <p className="text-xl font-bold">{myPets.length}마리</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 dark:bg-amber-800/30 rounded-full mr-3">
                  <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">수강중인 강의</p>
                  <p className="text-xl font-bold">3개</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-full mr-3">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">예정된 일정</p>
                  <p className="text-xl font-bold">{upcomingLessons.length}건</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded-full mr-3">
                  <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">건강상태</p>
                  <p className="text-xl font-bold">양호</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 반려동물 목록 및 건강상태 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 내 반려동물 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                  </svg>
                  내 반려동물
                </CardTitle>
                <Link href="/my-pets">
                  <Button variant="ghost" size="sm">전체 보기</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myPets.map(pet => (
                  <div key={pet.id} className="flex items-start p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="relative h-14 w-14 flex shrink-0 overflow-hidden rounded-full bg-primary/10">
                      {pet.image ? (
                        <img src={pet.image} alt={pet.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-sm font-bold text-primary">{pet.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium flex items-center">
                            {pet.name}
                            <Badge variant="outline" className="ml-2">{pet.breed}</Badge>
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            나이: {pet.age}세 | 건강상태: {pet.healthStatus}
                          </p>
                        </div>
                        <Link href={`/my-pets/${pet.id}`}>
                          <Button variant="ghost" size="sm">관리</Button>
                        </Link>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-semibold mb-1">다음 예방접종</p>
                        <div className="flex flex-wrap gap-2">
                          {pet.vaccinations.map((vacc, idx) => (
                            <div key={idx} className="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded-full">
                              {vacc.name}: {new Date(vacc.nextDue).toLocaleDateString()}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <Link href="/my-pets/new">
                    <Button variant="outline" size="sm" className="w-full">
                      새 반려동물 등록하기
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 수업 일정 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  다가오는 훈련 일정
                </CardTitle>
                <Link href="/calendar">
                  <Button variant="ghost" size="sm">전체 일정</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingLessons.map(lesson => (
                  <div key={lesson.id} className="flex items-start p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{lesson.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {lesson.date.replace(/-/g, '.')} {lesson.time}
                          </p>
                        </div>
                        <Badge variant={lesson.status === 'confirmed' ? 'default' : 'outline'}>
                          {lesson.status === 'confirmed' ? '확정' : '대기중'}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-2">
                        <Badge variant="outline" className="mr-2">{lesson.type}</Badge>
                        <span className="text-sm">
                          훈련사: {lesson.trainer} | 반려동물: {lesson.pet}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {upcomingLessons.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">예정된 일정이 없습니다</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 최근 활동 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-primary" />
                  최근 활동
                </CardTitle>
                <Link href="/notebook">
                  <Button variant="ghost" size="sm">전체 보기</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                      {activity.type === 'training' ? (
                        <BookOpen className="h-4 w-4 text-indigo-500" />
                      ) : activity.type === 'health' ? (
                        <Heart className="h-4 w-4 text-red-500" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium">{activity.title}</h3>
                        <span className="text-xs text-gray-500">{activity.date}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                      <div className="mt-1 text-xs">
                        <Badge variant="outline" className="text-xs">{activity.pet}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽 사이드바: 알림, 건강 알림, 쇼핑 등 */}
        <div className="space-y-6">
          {/* 건강 알림 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                건강 알림
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {healthAlerts.map(alert => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${
                    alert.urgency === 'high' ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20' :
                    alert.urgency === 'medium' ? 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20' :
                    'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20'
                  }`}>
                    <div className="flex justify-between">
                      <h3 className={`text-sm font-medium ${
                        alert.urgency === 'high' ? 'text-red-700 dark:text-red-400' :
                        alert.urgency === 'medium' ? 'text-amber-700 dark:text-amber-400' :
                        'text-blue-700 dark:text-blue-400'
                      }`}>{alert.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {new Date(alert.date).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">{alert.description}</p>
                  </div>
                ))}

                {healthAlerts.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">알림이 없습니다</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 추천 상품 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                추천 상품
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-2">
                    <img 
                      src="https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
                      alt="강아지 장난감" 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary">인기</Badge>
                    </div>
                  </div>
                  <h3 className="font-medium">프리미엄 반려견 장난감 세트</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm font-bold">₩29,800</p>
                    <Badge variant="outline">무료배송</Badge>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-2">
                    <img 
                      src="https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
                      alt="강아지 사료" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="font-medium">자연주의 반려견 사료 5kg</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm font-bold">₩35,000</p>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 line-through mr-1">₩45,000</span>
                      <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">20%↓</Badge>
                    </div>
                  </div>
                </div>

                <Link href="/shop">
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    쇼핑몰 방문하기
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
              <Link href="/trainers">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  훈련사 찾기
                </Button>
              </Link>
              <Link href="/notebook/new">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  반려견 일지
                </Button>
              </Link>
              <Link href="/calendar">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  일정 관리
                </Button>
              </Link>
              <Link href="/pet-care">
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  건강 관리
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}