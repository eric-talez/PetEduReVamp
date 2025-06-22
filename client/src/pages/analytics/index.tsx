import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  Star,
  Award,
  Clock,
  CheckCircle,
  Eye,
  Filter,
  Download,
  RefreshCw,
  Search,
  User,
  GraduationCap,
  Target,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface TrainingSession {
  id: number;
  date: string;
  trainer: {
    id: number;
    name: string;
    avatar?: string;
  };
  student: {
    id: number;
    name: string;
    pet: {
      name: string;
      breed: string;
    };
  };
  course: {
    id: number;
    title: string;
    category: string;
  };
  duration: number;
  status: 'completed' | 'cancelled' | 'no-show';
  rating?: number;
  revenue: number;
  location: string;
}

interface CompletedCourse {
  id: number;
  title: string;
  category: string;
  trainer: {
    id: number;
    name: string;
    avatar?: string;
  };
  student: {
    id: number;
    name: string;
    pet: {
      name: string;
      breed: string;
    };
  };
  startDate: string;
  endDate: string;
  totalSessions: number;
  completedSessions: number;
  finalRating: number;
  totalRevenue: number;
  achievements: string[];
}

interface Trainer {
  id: number;
  name: string;
  avatar?: string;
  specialization: string[];
  totalSessions: number;
  completedCourses: number;
  averageRating: number;
  totalRevenue: number;
  activeStudents: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

interface Student {
  id: number;
  name: string;
  email: string;
  pet: {
    id: number;
    name: string;
    breed: string;
    age: number;
  };
  enrolledCourses: number;
  completedCourses: number;
  totalSessions: number;
  averageRating: number;
  totalSpent: number;
  joinDate: string;
  lastActivity: string;
  status: 'active' | 'inactive' | 'graduated';
}

export default function AnalyticsPage() {
  const { userRole, isAuthenticated } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  
  // 모달 상태
  const [isTrainingSessionsOpen, setIsTrainingSessionsOpen] = useState(false);
  const [isCompletedCoursesOpen, setIsCompletedCoursesOpen] = useState(false);
  const [isTopTrainersOpen, setIsTopTrainersOpen] = useState(false);
  const [isActiveStudentsOpen, setIsActiveStudentsOpen] = useState(false);

  // 분석 데이터 조회
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/analytics/overview', selectedPeriod],
    queryFn: async () => {
      return {
        totalSessions: 156,
        completedCourses: 23,
        activeTrainers: 8,
        activeStudents: 45,
        totalRevenue: 12500000,
        averageRating: 4.7,
        growth: {
          sessions: 15.3,
          revenue: 22.1,
          students: 8.7,
          rating: 2.1
        }
      };
    },
    enabled: isAuthenticated
  });

  // 훈련 세션 데이터
  const { data: trainingSessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/analytics/training-sessions', selectedPeriod],
    queryFn: async () => {
      return [
        {
          id: 1,
          date: "2025-01-21",
          trainer: { id: 1, name: "김민수", avatar: "/avatars/trainer1.jpg" },
          student: { 
            id: 1, 
            name: "홍길동", 
            pet: { name: "멍멍이", breed: "골든 리트리버" }
          },
          course: { id: 1, title: "기초 복종 훈련", category: "기초훈련" },
          duration: 60,
          status: 'completed',
          rating: 5,
          revenue: 50000,
          location: "메인 훈련장 A"
        },
        {
          id: 2,
          date: "2025-01-21",
          trainer: { id: 2, name: "이준호" },
          student: { 
            id: 2, 
            name: "김영희", 
            pet: { name: "바둑이", breed: "보더 콜리" }
          },
          course: { id: 2, title: "어질리티 기초", category: "운동훈련" },
          duration: 90,
          status: 'completed',
          rating: 4,
          revenue: 45000,
          location: "야외 운동장"
        },
        {
          id: 3,
          date: "2025-01-20",
          trainer: { id: 3, name: "박지혜" },
          student: { 
            id: 3, 
            name: "박철수", 
            pet: { name: "초코", breed: "시바견" }
          },
          course: { id: 3, title: "문제행동 교정", category: "행동교정" },
          duration: 120,
          status: 'completed',
          rating: 4,
          revenue: 80000,
          location: "상담실 1"
        },
        {
          id: 4,
          date: "2025-01-20",
          trainer: { id: 1, name: "김민수" },
          student: { 
            id: 4, 
            name: "최미영", 
            pet: { name: "코코", breed: "푸들" }
          },
          course: { id: 4, title: "사회화 훈련", category: "사회화" },
          duration: 60,
          status: 'cancelled',
          rating: undefined,
          revenue: 0,
          location: "메인 훈련장 B"
        }
      ] as TrainingSession[];
    },
    enabled: isAuthenticated
  });

  // 완료된 코스 데이터
  const { data: completedCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/analytics/completed-courses', selectedPeriod],
    queryFn: async () => {
      return [
        {
          id: 1,
          title: "기초 복종 훈련",
          category: "기초훈련",
          trainer: { id: 1, name: "김민수", avatar: "/avatars/trainer1.jpg" },
          student: { 
            id: 5, 
            name: "정수민", 
            pet: { name: "루루", breed: "말티즈" }
          },
          startDate: "2024-12-01",
          endDate: "2025-01-15",
          totalSessions: 8,
          completedSessions: 8,
          finalRating: 5,
          totalRevenue: 400000,
          achievements: ["기본 명령어 숙달", "집중력 향상", "사회성 개선"]
        },
        {
          id: 2,
          title: "어질리티 기초",
          category: "운동훈련",
          trainer: { id: 2, name: "이준호" },
          student: { 
            id: 6, 
            name: "강지훈", 
            pet: { name: "맥스", breed: "비글" }
          },
          startDate: "2024-11-15",
          endDate: "2025-01-10",
          totalSessions: 6,
          completedSessions: 6,
          finalRating: 4,
          totalRevenue: 280000,
          achievements: ["점프 기술 습득", "균형감 개선", "자신감 향상"]
        },
        {
          id: 3,
          title: "문제행동 교정",
          category: "행동교정",
          trainer: { id: 3, name: "박지혜" },
          student: { 
            id: 7, 
            name: "윤서현", 
            pet: { name: "보리", breed: "진돗개" }
          },
          startDate: "2024-10-01",
          endDate: "2025-01-20",
          totalSessions: 12,
          completedSessions: 12,
          finalRating: 5,
          totalRevenue: 960000,
          achievements: ["공격성 해결", "분리불안 완화", "사회화 성공"]
        }
      ] as CompletedCourse[];
    },
    enabled: isAuthenticated
  });

  // 상위 훈련사 데이터
  const { data: topTrainers, isLoading: trainersLoading } = useQuery({
    queryKey: ['/api/analytics/top-trainers', selectedPeriod],
    queryFn: async () => {
      return [
        {
          id: 1,
          name: "김민수",
          avatar: "/avatars/trainer1.jpg",
          specialization: ["기초 복종", "어질리티", "사회화"],
          totalSessions: 45,
          completedCourses: 8,
          averageRating: 4.8,
          totalRevenue: 2250000,
          activeStudents: 12,
          joinDate: "2024-01-15",
          status: 'active'
        },
        {
          id: 2,
          name: "이준호",
          avatar: "/avatars/trainer2.jpg",
          specialization: ["어질리티", "운동 능력", "체력 단련"],
          totalSessions: 38,
          completedCourses: 6,
          averageRating: 4.6,
          totalRevenue: 1900000,
          activeStudents: 10,
          joinDate: "2023-11-20",
          status: 'active'
        },
        {
          id: 3,
          name: "박지혜",
          avatar: "/avatars/trainer3.jpg",
          specialization: ["행동 교정", "문제 행동", "심리 치료"],
          totalSessions: 32,
          completedCourses: 5,
          averageRating: 4.9,
          totalRevenue: 2560000,
          activeStudents: 8,
          joinDate: "2024-03-10",
          status: 'active'
        }
      ] as Trainer[];
    },
    enabled: isAuthenticated
  });

  // 활성 학생 데이터
  const { data: activeStudents, isLoading: studentsLoading } = useQuery({
    queryKey: ['/api/analytics/active-students', selectedPeriod],
    queryFn: async () => {
      return [
        {
          id: 1,
          name: "홍길동",
          email: "hong@example.com",
          pet: { id: 1, name: "멍멍이", breed: "골든 리트리버", age: 2 },
          enrolledCourses: 2,
          completedCourses: 1,
          totalSessions: 15,
          averageRating: 4.7,
          totalSpent: 750000,
          joinDate: "2024-11-15",
          lastActivity: "2025-01-21",
          status: 'active'
        },
        {
          id: 2,
          name: "김영희",
          email: "kim@example.com",
          pet: { id: 2, name: "바둑이", breed: "보더 콜리", age: 3 },
          enrolledCourses: 1,
          completedCourses: 0,
          totalSessions: 8,
          averageRating: 4.5,
          totalSpent: 480000,
          joinDate: "2025-01-01",
          lastActivity: "2025-01-20",
          status: 'active'
        }
      ] as Student[];
    },
    enabled: isAuthenticated
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">완료</Badge>;
      case 'cancelled':
        return <Badge variant="danger">취소</Badge>;
      case 'no-show':
        return <Badge variant="warning">노쇼</Badge>;
      case 'active':
        return <Badge variant="success">활성</Badge>;
      case 'inactive':
        return <Badge variant="secondary">비활성</Badge>;
      case 'graduated':
        return <Badge variant="info">수료</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">분석 리포트</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            종합적인 성과 지표와 상세 분석을 확인하세요
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">이번 주</SelectItem>
              <SelectItem value="month">이번 달</SelectItem>
              <SelectItem value="quarter">분기</SelectItem>
              <SelectItem value="year">올해</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            리포트 다운로드
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">종합 현황</TabsTrigger>
          <TabsTrigger value="performance">성과 분석</TabsTrigger>
          <TabsTrigger value="revenue">수익 분석</TabsTrigger>
          <TabsTrigger value="trends">트렌드 분석</TabsTrigger>
        </TabsList>

        {/* 종합 현황 */}
        <TabsContent value="overview" className="space-y-6">
          {/* 주요 지표 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setIsTrainingSessionsOpen(true)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">총 훈련 세션</p>
                    <p className="text-2xl font-bold">{analytics?.totalSessions || 0}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{analytics?.growth.sessions || 0}% 증가
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setIsCompletedCoursesOpen(true)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">완료된 코스</p>
                    <p className="text-2xl font-bold">{analytics?.completedCourses || 0}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      신규 수료생 증가
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setIsTopTrainersOpen(true)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">활성 훈련사</p>
                    <p className="text-2xl font-bold">{analytics?.activeTrainers || 0}</p>
                    <p className="text-xs text-blue-600 flex items-center mt-1">
                      평균 평점 {analytics?.averageRating || 0}점
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setIsActiveStudentsOpen(true)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">활성 학생</p>
                    <p className="text-2xl font-bold">{analytics?.activeStudents || 0}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{analytics?.growth.students || 0}% 증가
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 수익 및 평점 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  총 수익
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency(analytics?.totalRevenue || 0)}
                </div>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  전월 대비 +{analytics?.growth.revenue || 0}% 증가
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  평균 평점
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-3xl font-bold">{analytics?.averageRating || 0}</div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(analytics?.averageRating || 0) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  전월 대비 +{analytics?.growth.rating || 0}% 향상
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 성과 분석 */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>성과 분석</CardTitle>
              <CardDescription>훈련사별 성과 및 학습자 만족도 분석</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                성과 분석 차트 (향후 구현)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 수익 분석 */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>수익 분석</CardTitle>
              <CardDescription>월별/분기별 수익 추이 및 분석</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                수익 분석 차트 (향후 구현)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 트렌드 분석 */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>트렌드 분석</CardTitle>
              <CardDescription>시간대별 이용 패턴 및 인기 강좌 분석</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                트렌드 분석 차트 (향후 구현)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 훈련 세션 상세 모달 */}
      <Dialog open={isTrainingSessionsOpen} onOpenChange={setIsTrainingSessionsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-6 w-6" />
              총 훈련 세션 상세 ({trainingSessions?.length || 0}건)
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="훈련사명, 학생명, 강좌명으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sessionsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-200 h-16 rounded"></div>
                  ))}
                </div>
              ) : (
                trainingSessions?.map((session: TrainingSession) => (
                  <Card key={session.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{session.course.title}</h4>
                          {getStatusBadge(session.status)}
                          <Badge variant="outline">{session.course.category}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">훈련사:</span> {session.trainer.name}
                          </div>
                          <div>
                            <span className="font-medium">학생:</span> {session.student.name}
                          </div>
                          <div>
                            <span className="font-medium">반려동물:</span> {session.student.pet.name} ({session.student.pet.breed})
                          </div>
                          <div>
                            <span className="font-medium">날짜:</span> {session.date}
                          </div>
                          <div>
                            <span className="font-medium">시간:</span> {session.duration}분
                          </div>
                          <div>
                            <span className="font-medium">장소:</span> {session.location}
                          </div>
                          <div>
                            <span className="font-medium">수익:</span> {formatCurrency(session.revenue)}
                          </div>
                          {session.rating && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">평점:</span>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < session.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTrainingSessionsOpen(false)}>
              닫기
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              세션 데이터 다운로드
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 완료된 코스 상세 모달 */}
      <Dialog open={isCompletedCoursesOpen} onOpenChange={setIsCompletedCoursesOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              완료된 코스 상세 ({completedCourses?.length || 0}건)
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {coursesLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-200 h-20 rounded"></div>
                  ))}
                </div>
              ) : (
                completedCourses?.map((course: CompletedCourse) => (
                  <Card key={course.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-lg">{course.title}</h4>
                          <Badge variant="success">완료</Badge>
                          <Badge variant="outline">{course.category}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">훈련사:</span> {course.trainer.name}
                          </div>
                          <div>
                            <span className="font-medium">학생:</span> {course.student.name}
                          </div>
                          <div>
                            <span className="font-medium">반려동물:</span> {course.student.pet.name} ({course.student.pet.breed})
                          </div>
                          <div>
                            <span className="font-medium">기간:</span> {course.startDate} ~ {course.endDate}
                          </div>
                          <div>
                            <span className="font-medium">세션:</span> {course.completedSessions}/{course.totalSessions}회
                          </div>
                          <div>
                            <span className="font-medium">총 수익:</span> {formatCurrency(course.totalRevenue)}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">최종 평점:</span>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < course.finalRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm">({course.finalRating}/5)</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-gray-600">달성 성과:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {course.achievements.map((achievement, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompletedCoursesOpen(false)}>
              닫기
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              코스 데이터 다운로드
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 상위 훈련사 상세 모달 */}
      <Dialog open={isTopTrainersOpen} onOpenChange={setIsTopTrainersOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              활성 훈련사 상세 ({topTrainers?.length || 0}명)
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {trainersLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-200 h-16 rounded"></div>
                  ))}
                </div>
              ) : (
                topTrainers?.map((trainer: Trainer) => (
                  <Card key={trainer.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={trainer.avatar} />
                        <AvatarFallback>{trainer.name[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-lg">{trainer.name}</h4>
                          {getStatusBadge(trainer.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">총 세션:</span> {trainer.totalSessions}회
                          </div>
                          <div>
                            <span className="font-medium">완료 코스:</span> {trainer.completedCourses}개
                          </div>
                          <div>
                            <span className="font-medium">활성 학생:</span> {trainer.activeStudents}명
                          </div>
                          <div>
                            <span className="font-medium">총 수익:</span> {formatCurrency(trainer.totalRevenue)}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">평점:</span>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(trainer.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm">({trainer.averageRating})</span>
                          </div>
                          
                          <div>
                            <span className="text-sm font-medium">전문분야:</span>
                            <div className="flex flex-wrap gap-1 ml-2">
                              {trainer.specialization.map((spec, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">{spec}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTopTrainersOpen(false)}>
              닫기
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              훈련사 데이터 다운로드
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 활성 학생 상세 모달 */}
      <Dialog open={isActiveStudentsOpen} onOpenChange={setIsActiveStudentsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              활성 학생 상세 ({activeStudents?.length || 0}명)
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {studentsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-200 h-16 rounded"></div>
                  ))}
                </div>
              ) : (
                activeStudents?.map((student: Student) => (
                  <Card key={student.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-lg">{student.name}</h4>
                          {getStatusBadge(student.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                          <div>
                            <span className="font-medium">반려동물:</span> {student.pet.name} ({student.pet.breed})
                          </div>
                          <div>
                            <span className="font-medium">나이:</span> {student.pet.age}살
                          </div>
                          <div>
                            <span className="font-medium">수강 코스:</span> {student.enrolledCourses}개
                          </div>
                          <div>
                            <span className="font-medium">완료 코스:</span> {student.completedCourses}개
                          </div>
                          <div>
                            <span className="font-medium">총 세션:</span> {student.totalSessions}회
                          </div>
                          <div>
                            <span className="font-medium">총 지출:</span> {formatCurrency(student.totalSpent)}
                          </div>
                          <div>
                            <span className="font-medium">가입일:</span> {student.joinDate}
                          </div>
                          <div>
                            <span className="font-medium">최근 활동:</span> {student.lastActivity}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">평균 평점:</span>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(student.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm">({student.averageRating})</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActiveStudentsOpen(false)}>
              닫기
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              학생 데이터 다운로드
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}