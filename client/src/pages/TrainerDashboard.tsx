import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, Star, TrendingUp, Calendar, Clock, Bell, List } from 'lucide-react';
import { BarChart } from '@/components/ui/chart';

export default function TrainerDashboard() {
  // Mock data for trainer dashboard
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
        image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      }
    }
  ];

  const upcomingSchedules = [
    {
      id: 1,
      title: "기본 훈련 12주차",
      time: "오늘 17:00",
      type: "수업",
      student: "김견주",
      pet: "몽이"
    },
    {
      id: 2,
      title: "어질리티 훈련 6주차",
      time: "내일 14:00",
      type: "수업",
      student: "박보호",
      pet: "까미"
    },
    {
      id: 3,
      title: "행동 교정 상담",
      time: "수요일 16:30",
      type: "상담",
      student: "최견주",
      pet: "콩이"
    }
  ];

  const recentReviews = [
    {
      id: 1,
      student: "김견주",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      course: "반려견 기초 훈련 마스터하기",
      review: "훈련사님 덕분에 우리 강아지가 정말 많이 달라졌어요. 체계적인 교육 방식과 따뜻한 접근법이 정말 좋았습니다.",
      rating: 5,
      date: "3일 전"
    },
    {
      id: 2,
      student: "이반려",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      course: "반려견 사회화 훈련",
      review: "사회화 훈련을 통해 우리 강아지가 다른 강아지들과 잘 어울리게 되었어요. 정말 감사합니다.",
      rating: 4,
      date: "1주일 전"
    }
  ];

  // Mock data for charts
  const coursePerformanceData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [
      {
        label: '수강생 수',
        data: [12, 15, 18, 22, 25, 28],
        backgroundColor: 'hsl(var(--chart-1))',
      },
      {
        label: '수료율',
        data: [85, 88, 90, 92, 94, 95],
        backgroundColor: 'hsl(var(--chart-2))',
      }
    ],
  };

  const earningsData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [
      {
        label: '월별 수익 (만원)',
        data: [182, 195, 210, 245, 268, 290],
        backgroundColor: 'hsl(var(--chart-3))',
      }
    ],
  };

  const studentSatisfactionData = {
    labels: ['매우 만족', '만족', '보통', '불만족', '매우 불만족'],
    datasets: [
      {
        label: '학생 만족도',
        data: [45, 35, 15, 4, 1],
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
          <h1 className="text-2xl font-bold">훈련사 대시보드</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            안녕하세요, 김훈련 트레이너님! 오늘도 좋은 하루 되세요.
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" className="flex items-center">
            <Bell className="w-4 h-4 mr-2" />
            알림
            <Badge variant="red" className="w-5 h-5 ml-2 rounded-full p-0 flex items-center justify-center">3</Badge>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            일정
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
                <h3 className="text-2xl font-bold">78명</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="green" className="mr-2">+12%</Badge>
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
              <Badge variant="green" className="mr-2">+1</Badge>
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
              <Badge variant="green" className="mr-2">+0.1</Badge>
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
              <Badge variant="green" className="mr-2">+8%</Badge>
              <span className="text-gray-500 dark:text-gray-400">지난달 대비</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>강의 퍼포먼스</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={coursePerformanceData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>다가오는 일정</span>
              <Button variant="ghost" size="sm">모두 보기</Button>
            </CardTitle>
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
                      <Badge variant={schedule.type === "수업" ? "blue" : "purple"} size="sm">
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
      </div>
      
      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">
            <Users className="w-4 h-4 mr-2" />
            최근 수강생
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <Star className="w-4 h-4 mr-2" />
            최근 리뷰
          </TabsTrigger>
          <TabsTrigger value="earnings">
            <TrendingUp className="w-4 h-4 mr-2" />
            수익 분석
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>최근 활동 수강생</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {recentStudents.map((student) => (
                  <div key={student.id} className="flex items-start">
                    <Avatar 
                      src={student.image} 
                      alt={student.name}
                      size="md"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{student.course}</div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          최근 활동: {student.lastActivity}
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-2">
                        <Avatar 
                          src={student.pet.image} 
                          alt={student.pet.name}
                          size="sm"
                        />
                        <span className="ml-2 text-sm">{student.pet.name}</span>
                      </div>
                      
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">진도율</span>
                          <span className="text-sm font-medium">{student.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>최근 리뷰</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <Avatar 
                          src={review.image} 
                          alt={review.student}
                          size="md"
                        />
                        <div className="ml-3">
                          <div className="font-medium">{review.student}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{review.course}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} 
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                      "{review.review}"
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="earnings" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>월별 수익</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={earningsData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>수강생 만족도</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={studentSatisfactionData} type="pie" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
