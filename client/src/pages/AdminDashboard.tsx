import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart } from '@/components/ui/chart';
import { 
  Users, Settings, CheckSquare, BarChart4, ShieldAlert, 
  UserPlus, Building, UserCheck, AlertTriangle, Info, 
  Feather, Check, X, Lock 
} from 'lucide-react';

export default function AdminDashboard() {
  // Mock data for admin dashboard
  const pendingApprovals = [
    {
      id: 1,
      type: "trainer",
      name: "정훈련",
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      application: "훈련사 자격 승인 요청",
      date: "2023-06-10",
      status: "pending",
      credentials: "KKF 인증 훈련사, 동물행동학 석사"
    },
    {
      id: 2,
      type: "trainer",
      name: "한교육",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      application: "훈련사 자격 승인 요청",
      date: "2023-06-08",
      status: "pending",
      credentials: "반려동물 훈련사 2급, 특수목적견 훈련 전문가"
    },
    {
      id: 3,
      type: "institute",
      name: "멍멍 아카데미",
      application: "교육 기관 등록 승인 요청",
      date: "2023-06-05",
      status: "pending",
      representative: "김대표",
      location: "서울 강남구"
    }
  ];

  const recentUsers = [
    {
      id: 1,
      name: "신민주",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      role: "pet-owner",
      joinDate: "2023-06-12",
      pets: 1,
      courses: 2
    },
    {
      id: 2,
      name: "이진수",
      image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      role: "pet-owner",
      joinDate: "2023-06-11",
      pets: 2,
      courses: 1
    },
    {
      id: 3,
      name: "박혜리",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      role: "pet-owner",
      joinDate: "2023-06-10",
      pets: 1,
      courses: 0
    },
    {
      id: 4,
      name: "지성현",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      role: "trainer",
      joinDate: "2023-06-09",
      specialty: "기초 훈련",
      courses: 1
    }
  ];

  const reportedIssues = [
    {
      id: 1,
      title: "부적절한 콘텐츠 신고",
      reporter: "김견주",
      reportedUser: "익명 사용자",
      date: "2023-06-12",
      type: "community",
      status: "investigating",
      severity: "medium"
    },
    {
      id: 2,
      title: "훈련사 자격 허위 표기 의심",
      reporter: "관리자",
      reportedUser: "조훈련",
      date: "2023-06-11",
      type: "credentials",
      status: "investigating",
      severity: "high"
    },
    {
      id: 3,
      title: "수강료 환불 분쟁",
      reporter: "박견주",
      reportedUser: "퍼펙트 펫 아카데미",
      date: "2023-06-10",
      type: "payment",
      status: "resolved",
      severity: "medium"
    }
  ];

  // Mock chart data
  const userGrowthData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [
      {
        label: '견주 회원',
        data: [120, 148, 178, 205, 242, 280],
        backgroundColor: 'hsl(var(--chart-1))',
      },
      {
        label: '훈련사',
        data: [8, 12, 15, 22, 28, 35],
        backgroundColor: 'hsl(var(--chart-2))',
      },
      {
        label: '기관',
        data: [2, 3, 4, 5, 6, 8],
        backgroundColor: 'hsl(var(--chart-3))',
      }
    ],
  };

  const courseStatisticsData = {
    labels: ['기초 훈련', '사회화', '어질리티', '행동 교정', '특수 훈련', '퍼피 클래스'],
    datasets: [
      {
        label: '개설 강의 수',
        data: [28, 22, 15, 12, 8, 18],
        backgroundColor: [
          'hsl(var(--chart-1))',
          'hsl(var(--chart-2))',
          'hsl(var(--chart-3))',
          'hsl(var(--chart-4))',
          'hsl(var(--chart-5))',
          'hsl(var(--chart-2))'
        ],
      }
    ],
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">관리자 대시보드</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            안녕하세요, 관리자님! 오늘 플랫폼의 현황입니다.
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            사용자 관리
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            시스템 설정
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
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">총 사용자</p>
                <h3 className="text-2xl font-bold">2,356명</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="green" className="mr-2">+5.6%</Badge>
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
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">인증된 훈련사</p>
                <h3 className="text-2xl font-bold">35명</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="green" className="mr-2">+3</Badge>
              <span className="text-gray-500 dark:text-gray-400">이번달 신규</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-3 rounded-full mr-4">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">등록 기관</p>
                <h3 className="text-2xl font-bold">8개</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="green" className="mr-2">+1</Badge>
              <span className="text-gray-500 dark:text-gray-400">이번달 신규</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-full mr-4">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">승인 대기</p>
                <h3 className="text-2xl font-bold">18건</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="red" className="mr-2">긴급</Badge>
              <span className="text-gray-500 dark:text-gray-400">3건의 우선 처리 항목</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>사용자 증가 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={userGrowthData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>강의 통계</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={courseStatisticsData} type="pie" />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="approvals">
        <TabsList>
          <TabsTrigger value="approvals">
            <CheckSquare className="w-4 h-4 mr-2" />
            승인 대기 항목
          </TabsTrigger>
          <TabsTrigger value="users">
            <UserPlus className="w-4 h-4 mr-2" />
            최근 가입자
          </TabsTrigger>
          <TabsTrigger value="issues">
            <AlertTriangle className="w-4 h-4 mr-2" />
            신고된 이슈
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="approvals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>승인 대기 항목</span>
                <Button variant="outline" size="sm" className="flex items-center">
                  <CheckSquare className="w-4 h-4 mr-2" />
                  일괄 처리
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pendingApprovals.map((item) => (
                  <div key={item.id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        {item.type === "trainer" && (
                          <Avatar 
                            src={item.image} 
                            alt={item.name}
                            size="md"
                          />
                        )}
                        {item.type === "institute" && (
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Building className="w-5 h-5 text-primary" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="font-medium">{item.name}</h3>
                            <Badge 
                              variant={item.type === "trainer" ? "blue" : "yellow"} 
                              className="ml-2"
                            >
                              {item.type === "trainer" ? "훈련사" : "기관"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.application}</p>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">신청일: {item.date}</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Info className="w-4 h-4 mr-1" />
                          상세
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 dark:border-green-800 dark:hover:border-green-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          승인
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700"
                        >
                          <X className="w-4 h-4 mr-1" />
                          거부
                        </Button>
                      </div>
                    </div>
                    
                    {item.type === "trainer" && (
                      <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md text-sm">
                        <p>
                          <span className="font-medium">자격 증명: </span>
                          {item.credentials}
                        </p>
                      </div>
                    )}
                    
                    {item.type === "institute" && (
                      <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md text-sm">
                        <p>
                          <span className="font-medium">대표자: </span>
                          {item.representative}
                        </p>
                        <p className="mt-1">
                          <span className="font-medium">위치: </span>
                          {item.location}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button variant="outline" className="w-full md:w-auto">모든 대기 항목 보기</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>최근 가입자</span>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  모든 사용자
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="text-left py-3 px-4 font-medium">사용자</th>
                      <th className="text-left py-3 px-4 font-medium">권한</th>
                      <th className="text-left py-3 px-4 font-medium">가입일</th>
                      <th className="text-left py-3 px-4 font-medium">상태</th>
                      <th className="text-left py-3 px-4 font-medium">액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Avatar 
                              src={user.image} 
                              alt={user.name}
                              size="sm"
                            />
                            <div className="ml-3">
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {user.role === "pet-owner" ? (
                                  <span>{user.pets}마리 반려견, {user.courses}개 강의</span>
                                ) : (
                                  <span>{user.specialty} 전문, {user.courses}개 강의</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={user.role === "pet-owner" ? "green" : "blue"}>
                            {user.role === "pet-owner" ? "견주" : "훈련사"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{user.joinDate}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            활성
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Feather className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Lock className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="issues" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>신고된 이슈</span>
                <Button variant="outline" size="sm" className="flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  모든 이슈
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportedIssues.map((issue) => (
                  <div key={issue.id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{issue.title}</h3>
                          <Badge 
                            variant={
                              issue.severity === "high" ? "red" : 
                              issue.severity === "medium" ? "yellow" : "blue"
                            } 
                            className="ml-2"
                          >
                            {issue.severity === "high" ? "높음" : 
                             issue.severity === "medium" ? "중간" : "낮음"}
                          </Badge>
                          <Badge 
                            variant={issue.status === "resolved" ? "green" : "outline"} 
                            className="ml-2"
                          >
                            {issue.status === "resolved" ? "해결됨" : "조사 중"}
                          </Badge>
                        </div>
                        
                        <div className="text-sm mt-2">
                          <span className="text-gray-500 dark:text-gray-400">신고자: </span>
                          <span className="text-gray-900 dark:text-gray-200">{issue.reporter}</span>
                          <span className="text-gray-500 dark:text-gray-400 ml-4">대상: </span>
                          <span className="text-gray-900 dark:text-gray-200">{issue.reportedUser}</span>
                        </div>
                        
                        <div className="text-sm mt-1">
                          <span className="text-gray-500 dark:text-gray-400">유형: </span>
                          <Badge variant="outline" size="sm">
                            {issue.type === "community" ? "커뮤니티" : 
                             issue.type === "credentials" ? "자격증명" : "결제"}
                          </Badge>
                          <span className="text-gray-500 dark:text-gray-400 ml-4">신고일: </span>
                          <span className="text-gray-900 dark:text-gray-200">{issue.date}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">상세보기</Button>
                        {issue.status !== "resolved" && (
                          <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                            해결 표시
                          </Button>
                        )}
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
