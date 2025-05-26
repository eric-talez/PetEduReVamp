import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Users, FileText, Award, AlertTriangle, CheckCircle2, Zap, Calendar, Info, TrendingUp, ArrowUpRight, Check, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-compat';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// 차트 컴포넌트
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, TooltipProps } from 'recharts';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';

// API에서 가져올 코스 진행 상태 타입 정의
interface CourseProgressData {
  name: string;
  수료: number;
  진행중: number;
  trainers?: number;
  total?: number;
}

// 초기 차트 데이터
const initialCourseData: CourseProgressData[] = [
  { name: '기초 훈련', 수료: 0, 진행중: 0 },
  { name: '중급 훈련', 수료: 0, 진행중: 0 },
  { name: '고급 훈련', 수료: 0, 진행중: 0 },
  { name: '행동 교정', 수료: 0, 진행중: 0 },
  { name: '특수 훈련', 수료: 0, 진행중: 0 },
];

// 파이 차트 데이터
const revenueData = [
  { name: '기초 훈련', value: 1150000 },
  { name: '중급 훈련', value: 980000 },
  { name: '고급 훈련', value: 750000 },
  { name: '행동 교정', value: 850000 },
  { name: '특수 훈련', value: 550000 },
];

// 파이 차트 색상
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// 최근 알림 데이터
const recentNotifications = [
  { id: 1, type: 'approval', title: '코스 승인 요청', content: '김훈련님이 "반려견 행동 수정 고급 과정" 코스 승인을 요청했습니다.', time: '10분 전' },
  { id: 2, type: 'info', title: '신규 등록 완료', content: '박지민님이 "기초 훈련 과정"에 등록했습니다.', time: '30분 전' },
  { id: 3, type: 'warning', title: '수료증 발급 필요', content: '"중급 훈련 과정" 5명의 수료증 발급이 필요합니다.', time: '1시간 전' },
  { id: 4, type: 'info', title: '정산 완료', content: '5월 정산이 완료되었습니다. 정산 내역을 확인해주세요.', time: '2시간 전' },
];

// 대기 중인 승인 요청 데이터
const pendingApprovals = [
  { id: 1, type: '코스', title: '반려견 행동 수정 고급 과정', trainer: '김훈련', date: '2023-05-10' },
  { id: 2, type: '코스', title: '특수 상황 대처 훈련', trainer: '이강사', date: '2023-05-09' },
  { id: 3, type: '수료증', title: '기초 훈련 과정', students: 5, date: '2023-05-08' },
];

// 이번 달 주요 지표 데이터
const keyMetrics = [
  { name: '신규 등록', value: 45, change: '+12%', icon: Users, color: 'text-blue-500' },
  { name: '완료된 과정', value: 28, change: '+5%', icon: CheckCircle2, color: 'text-green-500' },
  { name: '발급 수료증', value: 65, change: '+18%', icon: Award, color: 'text-yellow-500' },
  { name: '운영 중 과정', value: 12, change: '+2%', icon: Zap, color: 'text-purple-500' },
];

export default function InstituteAdminHome() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoadingCourseData, setIsLoadingCourseData] = useState(false);
  const [courseData, setCourseData] = useState<CourseProgressData[]>(initialCourseData);
  const [courseError, setCourseError] = useState<string | null>(null);
  
  // 일정 알림 상태
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);
  // 승인 요청 대화상자 상태
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  // 현재 선택된 승인 요청
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  
  // 일정 관리 버튼 클릭 핸들러
  const handleScheduleClick = () => {
    toast({
      title: "일정 관리 페이지로 이동합니다",
      description: "일정 및 캘린더를 관리할 수 있는 페이지로 이동합니다.",
    });
    setLocation("/institute/calendar");
  };
  
  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    console.log("탭 변경:", value);
    setActiveTab(value);
  };
  
  // 승인 요청 검토 핸들러
  const handleApprovalReview = (approval: any) => {
    console.log("승인 요청 검토:", approval);
    setSelectedApproval(approval);
    setApprovalDialogOpen(true);
  };
  
  // 승인 처리 핸들러
  const handleApproveRequest = () => {
    console.log("승인 요청 승인:", selectedApproval);
    toast({
      title: "승인 완료",
      description: `${selectedApproval.title} ${selectedApproval.type === '코스' ? '코스가' : '수료증이'} 승인되었습니다.`,
      variant: "default",
    });
    setApprovalDialogOpen(false);
  };
  
  // 거부 처리 핸들러
  const handleRejectRequest = () => {
    console.log("승인 요청 거부:", selectedApproval);
    toast({
      title: "승인 거부",
      description: `${selectedApproval.title} ${selectedApproval.type === '코스' ? '코스가' : '수료증이'} 거부되었습니다.`,
      variant: "destructive",
    });
    setApprovalDialogOpen(false);
  };
  
  // 훈련사 상세 정보 보기 핸들러
  const handleViewTrainerDetails = (trainerId: number) => {
    console.log("훈련사 상세 정보 보기:", trainerId);
    toast({
      title: "훈련사 정보",
      description: `훈련사 ${trainerId}의 상세 정보 페이지로 이동합니다.`,
    });
    setLocation(`/trainers/${trainerId}`);
  };
  
  // 코스 진행 상태 데이터 가져오기
  const fetchCourseProgressData = async () => {
    setIsLoadingCourseData(true);
    setCourseError(null);
    
    try {
      // API 호출 시뮬레이션
      console.log("코스 진행 상태 데이터 요청 중...");
      
      // 실제 API 구현 전 임시 데이터 로딩 시뮬레이션
      // 실제 구현 시 아래 코드를 실제 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // 실제 API 호출 코드는 다음과 같이 구현 (현재는 주석 처리)
      /*
      const response = await fetch('/api/institute/course-progress', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('코스 진행 상태 데이터를 가져오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setCourseData(data);
      */
      
      // 임시 데이터로 설정 (API 연동 전)
      const mockData: CourseProgressData[] = [
        { name: '기초 훈련', 수료: 75, 진행중: 25, trainers: 4, total: 100 },
        { name: '중급 훈련', 수료: 60, 진행중: 40, trainers: 3, total: 100 },
        { name: '고급 훈련', 수료: 45, 진행중: 55, trainers: 2, total: 100 },
        { name: '행동 교정', 수료: 70, 진행중: 30, trainers: 5, total: 100 },
        { name: '특수 훈련', 수료: 35, 진행중: 65, trainers: 1, total: 100 },
      ];
      
      setCourseData(mockData);
      console.log("코스 진행 상태 데이터 로드 완료:", mockData);
      
    } catch (error) {
      console.error("코스 진행 상태 데이터 로딩 오류:", error);
      setCourseError(error instanceof Error ? error.message : '데이터 로딩 중 오류가 발생했습니다.');
      toast({
        title: "데이터 로딩 오류",
        description: "코스 진행 상태 데이터를 불러오는 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCourseData(false);
    }
  };
  
  useEffect(() => {
    // 데이터 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoaded(true);
      // 컴포넌트가 로드된 후 코스 데이터 가져오기
      fetchCourseProgressData();
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 데이터 새로고침 핸들러
  const handleRefreshCourseData = () => {
    toast({
      title: "데이터 새로고침",
      description: "코스 진행 상태 데이터를 새로고침합니다.",
    });
    fetchCourseProgressData();
  };
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-6 mx-auto">
      {/* 인사말 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">안녕하세요, {userName}님!</h1>
          <p className="text-muted-foreground">
            금일 운영 현황과 관리가 필요한 항목을 확인하세요.
          </p>
        </div>
        <Button onClick={handleScheduleClick} className="relative">
          <Calendar className="h-4 w-4 mr-2" />
          일정 관리
          {showNotificationBadge && (
            <span className="w-2 h-2 bg-red-500 rounded-full absolute -top-1 -right-1"></span>
          )}
        </Button>
      </div>
      
      {/* 주요 지표 카드 - 4칸 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs font-medium text-green-500">{metric.change}</span>
                  </div>
                </div>
                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${metric.color}`}>
                  <metric.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* 탭 컴포넌트 */}
      <Tabs defaultValue="overview" className="mb-6" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
          <TabsTrigger value="overview">운영 현황</TabsTrigger>
          <TabsTrigger value="approvals">승인 요청</TabsTrigger>
          <TabsTrigger value="trainers">소속 훈련사</TabsTrigger>
        </TabsList>
        
        {/* 운영 현황 탭 */}
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 현재 운영 중인 과정 */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">과정별 수료 현황</CardTitle>
                    <CardDescription>기관 소속 훈련사와 견주 간 교육 현황</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefreshCourseData}
                    disabled={isLoadingCourseData}
                  >
                    {isLoadingCourseData ? (
                      <>
                        <div className="w-4 h-4 mr-2 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                        새로고침
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        새로고침
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {courseError ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                    <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
                    <p className="text-lg font-medium">데이터 로딩 오류</p>
                    <p className="text-sm text-muted-foreground">{courseError}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={handleRefreshCourseData}
                    >
                      다시 시도
                    </Button>
                  </div>
                ) : (
                  <div className="h-64 w-full">
                    {isLoadingCourseData && (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                          <p className="text-sm text-muted-foreground">데이터 로딩 중...</p>
                        </div>
                      </div>
                    )}
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={courseData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip 
                          formatter={(value, name) => {
                            return [`${value}명`, name === '수료' ? '수료 완료' : '진행 중'];
                          }}
                        />
                        <Legend 
                          formatter={(value) => {
                            return value === '수료' ? '수료 완료' : '진행 중';
                          }}
                        />
                        <Bar 
                          dataKey="수료" 
                          fill="#8884d8" 
                          stackId="a" 
                          name="수료" 
                        />
                        <Bar 
                          dataKey="진행중" 
                          fill="#82ca9d" 
                          stackId="a" 
                          name="진행중" 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-[#8884d8] rounded"></span>
                      <span>수료 완료</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-[#82ca9d] rounded"></span>
                      <span>진행 중</span>
                    </div>
                    <div className="flex items-center gap-1 justify-self-end">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">총 {courseData.reduce((acc, curr) => acc + (curr.trainers || 0), 0)}명 훈련사</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* 매출 현황 */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">과정별 매출 현황</CardTitle>
                <CardDescription>5월 과정별 매출 분포</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {revenueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => {
                        // value 타입 검사 추가
                        const numValue = typeof value === 'number' ? value : 
                          typeof value === 'string' ? parseFloat(value) : 0;
                        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(numValue);
                      }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-sm text-muted-foreground">
                  총 매출: {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(
                    revenueData.reduce((sum, item) => sum + item.value, 0)
                  )}
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* 승인 요청 탭 */}
        <TabsContent value="approvals" className="mt-0">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">승인 대기 항목</CardTitle>
              <CardDescription>처리가 필요한 승인 요청 {pendingApprovals.length}건</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <div key={approval.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                        {approval.type === '코스' ? <FileText className="h-5 w-5 text-orange-500" /> : <Award className="h-5 w-5 text-orange-500" />}
                      </div>
                      <div>
                        <p className="font-medium">{approval.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {approval.type === '코스' 
                            ? `${approval.trainer} 훈련사의 요청`
                            : `${approval.students}명 수료 대기`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{approval.date}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleApprovalReview(approval)}
                      >
                        검토
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">모든 요청은 48시간 내에 처리해주세요</p>
              <Link href="/institute/approvals" className="text-sm font-medium flex items-center text-primary">
                모든 요청 보기 <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* 소속 훈련사 탭 */}
        <TabsContent value="trainers" className="mt-0">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">소속 훈련사 현황</CardTitle>
              <CardDescription>총 12명의 훈련사가 활동 중입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 훈련사 목록 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* 훈련사 카드 샘플 */}
                  {[1, 2, 3, 4, 5, 6].map((trainer) => (
                    <div 
                      key={trainer} 
                      className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleViewTrainerDetails(trainer)}
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg font-semibold">
                        {`T${trainer}`}
                      </div>
                      <div>
                        <p className="font-medium">훈련사 {trainer}</p>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <span>과정 {Math.floor(Math.random() * 5) + 1}개</span>
                          <span>•</span>
                          <span>학생 {Math.floor(Math.random() * 20) + 5}명</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 py-0.5 px-1.5 rounded-full">
                            활성
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">최근 업데이트: 2023년 5월 10일</p>
              <Link href="/institute/trainers" className="text-sm font-medium flex items-center text-primary">
                훈련사 관리 <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 최근 알림 */}
      <Card className="shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-xl">최근 알림</CardTitle>
          <CardDescription>지난 24시간 동안의 알림</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className={`p-2 rounded-full flex-shrink-0 ${
                  notification.type === 'approval' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  notification.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' :
                  'bg-gray-100 dark:bg-gray-800'
                }`}>
                  {notification.type === 'approval' ? (
                    <FileText className="h-5 w-5 text-blue-500" />
                  ) : notification.type === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Info className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{notification.title}</p>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.content}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">모든 알림은 7일간 유지됩니다</p>
          <Link href="/institute/notifications" className="text-sm font-medium flex items-center text-primary">
            모든 알림 보기 <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </CardFooter>
      </Card>
      
      {/* 바로가기 버튼 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="w-full justify-start" onClick={() => setLocation("/institute/courses")}>
          <FileText className="h-5 w-5 mr-2" />
          코스 관리
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => setLocation("/institute/trainers")}>
          <Users className="h-5 w-5 mr-2" />
          훈련사 관리
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => setLocation("/institute/certificates")}>
          <Award className="h-5 w-5 mr-2" />
          수료증 발급
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => setLocation("/institute/calendar")}>
          <Calendar className="h-5 w-5 mr-2" />
          일정 관리
        </Button>
      </div>
      
      {/* 승인 요청 검토 대화상자 */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>승인 요청 검토</DialogTitle>
            <DialogDescription>
              {selectedApproval?.type === '코스' 
                ? `${selectedApproval?.trainer} 훈련사의 "${selectedApproval?.title}" 코스 승인 요청을 검토합니다.`
                : `"${selectedApproval?.title}" 과정의 수료증 발급 요청 (${selectedApproval?.students}명)을 검토합니다.`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${selectedApproval?.type === '코스' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                  {selectedApproval?.type === '코스' 
                    ? <FileText className="h-5 w-5 text-blue-500" /> 
                    : <Award className="h-5 w-5 text-amber-500" />
                  }
                </div>
                <div>
                  <h4 className="font-medium">{selectedApproval?.title}</h4>
                  <p className="text-sm text-muted-foreground">요청일: {selectedApproval?.date}</p>
                  {selectedApproval?.type === '코스' ? (
                    <p className="text-sm mt-2">
                      코스 승인 시 소속 훈련사인 {selectedApproval?.trainer}님이 해당 코스를 운영할 수 있게 됩니다.
                    </p>
                  ) : (
                    <p className="text-sm mt-2">
                      수료증 발급 승인 시 {selectedApproval?.students}명의 학생에게 수료증이 발급됩니다.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="destructive" onClick={handleRejectRequest} className="flex items-center">
              <X className="h-4 w-4 mr-2" />
              거부
            </Button>
            <Button onClick={handleApproveRequest} className="flex items-center">
              <Check className="h-4 w-4 mr-2" />
              승인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}