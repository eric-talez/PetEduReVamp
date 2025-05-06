import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart } from '@/components/ui/chart';
import { Building2, Users, GraduationCap, DollarSign, Calendar, UserCheck, BarChart4, Layers } from 'lucide-react';

export default function InstituteDashboard() {
  // Mock data for institute dashboard
  const trainers = [
    {
      id: 1,
      name: "김훈련",
      image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      specialty: "기초 훈련, 행동 교정",
      courses: 5,
      students: 28,
      rating: 4.9
    },
    {
      id: 2,
      name: "박민첩",
      image: "https://images.unsplash.com/photo-1548535537-3cfaf1fc327c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      specialty: "어질리티, 도그 스포츠",
      courses: 3,
      students: 22,
      rating: 4.8
    },
    {
      id: 3,
      name: "이사회",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      specialty: "사회화 훈련, 퍼피 클래스",
      courses: 4,
      students: 18,
      rating: 4.7
    },
    {
      id: 4,
      name: "최행동",
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      specialty: "행동 교정, 분리불안",
      courses: 2,
      students: 10,
      rating: 5.0
    },
  ];

  const popularCourses = [
    {
      id: 1,
      title: "반려견 기초 훈련 마스터하기",
      students: 28,
      revenue: "3,360,000",
      completion: 92,
      rating: 4.9,
      trainer: "김훈련"
    },
    {
      id: 2,
      title: "반려견 어질리티 입문",
      students: 22,
      revenue: "3,300,000",
      completion: 85,
      rating: 4.8,
      trainer: "박민첩"
    },
    {
      id: 3,
      title: "반려견 사회화 훈련",
      students: 18,
      revenue: "1,800,000",
      completion: 88,
      rating: 4.7,
      trainer: "이사회"
    },
    {
      id: 4,
      title: "분리불안 극복하기",
      students: 10,
      revenue: "1,800,000",
      completion: 95,
      rating: 5.0,
      trainer: "최행동"
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "여름 특별 세미나: 반려견 열사병 예방",
      date: "2023년 6월 15일",
      time: "14:00 - 16:00",
      location: "대강당",
      trainer: "김훈련",
      registrations: 45
    },
    {
      id: 2,
      title: "신규 강사 오리엔테이션",
      date: "2023년 6월 20일",
      time: "10:00 - 12:00",
      location: "회의실",
      trainer: "관리자",
      registrations: 2
    },
    {
      id: 3,
      title: "견종별 맞춤 훈련 워크샵",
      date: "2023년 7월 5일",
      time: "13:00 - 17:00",
      location: "실습실",
      trainer: "박민첩, 이사회",
      registrations: 32
    }
  ];

  // Mock chart data
  const revenueByMonthData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [
      {
        label: '월별 매출 (만원)',
        data: [850, 920, 980, 1050, 1150, 1275],
        backgroundColor: 'hsl(var(--chart-1))',
      }
    ],
  };

  const trainerPerformanceData = {
    labels: trainers.map(trainer => trainer.name),
    datasets: [
      {
        label: '수강생 수',
        data: trainers.map(trainer => trainer.students),
        backgroundColor: 'hsl(var(--chart-2))',
      },
      {
        label: '강의 수',
        data: trainers.map(trainer => trainer.courses),
        backgroundColor: 'hsl(var(--chart-3))',
      }
    ],
  };

  const courseDistributionData = {
    labels: ['기초 훈련', '어질리티', '사회화', '행동 교정', '특수 훈련'],
    datasets: [
      {
        label: '분포',
        data: [35, 20, 25, 15, 5],
        backgroundColor: [
          'hsl(var(--chart-1))',
          'hsl(var(--chart-2))',
          'hsl(var(--chart-3))',
          'hsl(var(--chart-4))',
          'hsl(var(--chart-5))',
        ],
      }
    ],
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">기관 관리자 대시보드</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            퍼펙트 펫 아카데미의 운영 현황을 한눈에 확인하세요.
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            직원 관리
          </Button>
          <Button className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            일정 관리
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-full mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">총 수강생</p>
                <h3 className="text-2xl font-bold">178명</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="green" className="mr-2">+8%</Badge>
              <span className="text-gray-500 dark:text-gray-400">지난달 대비</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-full mr-4">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">소속 훈련사</p>
                <h3 className="text-2xl font-bold">8명</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="green" className="mr-2">+2</Badge>
              <span className="text-gray-500 dark:text-gray-400">지난 분기 대비</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-3 rounded-full mr-4">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">운영 강의</p>
                <h3 className="text-2xl font-bold">15개</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="green" className="mr-2">+3</Badge>
              <span className="text-gray-500 dark:text-gray-400">지난 분기 대비</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-full mr-4">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">이번 달 매출</p>
                <h3 className="text-2xl font-bold">1,275만원</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="green" className="mr-2">+11%</Badge>
              <span className="text-gray-500 dark:text-gray-400">지난달 대비</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>월별 매출</span>
              <Button variant="ghost" size="sm" className="flex items-center">
                <BarChart4 className="w-4 h-4 mr-2" />
                상세 분석
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={revenueByMonthData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>과정별 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={courseDistributionData} type="pie" />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="trainers">
        <TabsList>
          <TabsTrigger value="trainers">
            <UserCheck className="w-4 h-4 mr-2" />
            소속 훈련사
          </TabsTrigger>
          <TabsTrigger value="courses">
            <Layers className="w-4 h-4 mr-2" />
            인기 강의
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="w-4 h-4 mr-2" />
            예정된, 이벤트
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trainers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>소속 훈련사 현황</span>
                <Button>훈련사 추가</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trainers.map((trainer) => (
                  <div 
                    key={trainer.id} 
                    className="flex items-start p-4 rounded-lg border border-gray-100 dark:border-gray-800"
                  >
                    <Avatar 
                      src={trainer.image} 
                      alt={trainer.name}
                      size="md"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{trainer.name} 트레이너</h3>
                          <p className="text-sm text-primary mt-1">{trainer.specialty}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-1">{trainer.rating}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">강의</p>
                          <p className="font-medium">{trainer.courses}개</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">수강생</p>
                          <p className="font-medium">{trainer.students}명</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium mb-4">훈련사별 성과</h3>
                <BarChart data={trainerPerformanceData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>인기 강의</span>
                <Button>새 강의 등록</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="text-left py-3 px-4 font-medium">강의명</th>
                      <th className="text-left py-3 px-4 font-medium">수강생</th>
                      <th className="text-left py-3 px-4 font-medium">완료율</th>
                      <th className="text-left py-3 px-4 font-medium">평점</th>
                      <th className="text-left py-3 px-4 font-medium">매출</th>
                      <th className="text-left py-3 px-4 font-medium">담당 훈련사</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularCourses.map((course) => (
                      <tr key={course.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4 font-medium">{course.title}</td>
                        <td className="py-3 px-4">{course.students}명</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${course.completion}%` }}
                              ></div>
                            </div>
                            <span>{course.completion}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span>{course.rating}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{course.revenue}원</td>
                        <td className="py-3 px-4">{course.trainer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>예정된 이벤트</span>
                <Button>이벤트 추가</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{event.title}</h3>
                      <Badge>예정됨</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">일시</p>
                        <p className="text-sm">{event.date}, {event.time}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">장소</p>
                        <p className="text-sm">{event.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">담당자</p>
                        <p className="text-sm">{event.trainer}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">등록 인원</p>
                        <p className="text-sm font-medium">{event.registrations}명</p>
                      </div>
                      
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">상세 보기</Button>
                        <Button size="sm">등록 관리</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
