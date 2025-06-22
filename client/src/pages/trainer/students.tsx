import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Users, 
  Search, 
  Calendar,
  Clock,
  Star,
  Eye,
  MessageSquare,
  Award,
  TrendingUp,
  BookOpen,
  FileText,
  Phone,
  Mail,
  MapPin,
  Heart,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'graduated';
  pet: {
    id: number;
    name: string;
    breed: string;
    age: number;
    weight: number;
    gender: string;
    healthStatus: string;
    specialNotes: string;
  };
  trainer: {
    id: number;
    name: string;
    email: string;
  };
  course: {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    progress: number;
  };
  attendance: {
    totalSessions: number;
    attendedSessions: number;
    attendanceRate: number;
    lastAttendance: string;
  };
  performance: {
    overallRating: number;
    behaviorScore: number;
    learningSpeed: number;
    socialSkills: number;
    notes: string;
  };
  payments: {
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    lastPayment: string;
  };
}

interface TrainerOverview {
  id: number;
  name: string;
  email: string;
  avatar: string;
  specialization: string[];
  totalStudents: number;
  activeStudents: number;
  completedCourses: number;
  averageRating: number;
  monthlyRevenue: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

export default function TrainerStudentsPage() {
  const { userRole, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedTrainer, setSelectedTrainer] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isStudentDetailOpen, setIsStudentDetailOpen] = useState(false);

  // 훈련사 목록 조회 (기관 관리자용)
  const { data: trainers, isLoading: trainersLoading } = useQuery({
    queryKey: ['/api/institute/trainers-overview'],
    queryFn: async () => {
      // 기관 관리자인 경우 모든 훈련사 조회
      if (userRole === 'institute-admin') {
        return [
          {
            id: 1,
            name: "김민수",
            email: "kim@example.com",
            avatar: "/avatars/trainer1.jpg",
            specialization: ["기초 복종", "어질리티", "사회화"],
            totalStudents: 15,
            activeStudents: 12,
            completedCourses: 8,
            averageRating: 4.8,
            monthlyRevenue: 2500000,
            joinDate: "2024-01-15",
            status: 'active'
          },
          {
            id: 2,
            name: "이준호",
            email: "lee@example.com",
            avatar: "/avatars/trainer2.jpg",
            specialization: ["어질리티", "운동 능력", "체력 단련"],
            totalStudents: 18,
            activeStudents: 16,
            completedCourses: 12,
            averageRating: 4.6,
            monthlyRevenue: 3200000,
            joinDate: "2023-11-20",
            status: 'active'
          },
          {
            id: 3,
            name: "박지혜",
            email: "park@example.com",
            avatar: "/avatars/trainer3.jpg",
            specialization: ["행동 교정", "문제 행동", "심리 치료"],
            totalStudents: 10,
            activeStudents: 8,
            completedCourses: 6,
            averageRating: 4.9,
            monthlyRevenue: 1800000,
            joinDate: "2024-03-10",
            status: 'active'
          }
        ] as TrainerOverview[];
      }
      // 개별 훈련사인 경우 자신의 정보만
      return [];
    },
    enabled: isAuthenticated
  });

  // 학생 목록 조회
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['/api/trainer/students', selectedTrainer],
    queryFn: async () => {
      const mockStudents: Student[] = [
        {
          id: 1,
          name: "홍길동",
          email: "hong@example.com",
          phone: "010-1234-5678",
          address: "서울시 강남구",
          joinDate: "2025-01-15",
          status: 'active',
          pet: {
            id: 1,
            name: "멍멍이",
            breed: "골든 리트리버",
            age: 2,
            weight: 28.5,
            gender: "수컷",
            healthStatus: "양호",
            specialNotes: "활발한 성격, 사람을 좋아함"
          },
          trainer: { id: 1, name: "김민수", email: "kim@example.com" },
          course: {
            id: 1,
            title: "기초 복종 훈련",
            startDate: "2025-01-15",
            endDate: "2025-03-15",
            progress: 65
          },
          attendance: {
            totalSessions: 8,
            attendedSessions: 7,
            attendanceRate: 87.5,
            lastAttendance: "2025-01-21"
          },
          performance: {
            overallRating: 4.2,
            behaviorScore: 85,
            learningSpeed: 78,
            socialSkills: 92,
            notes: "매우 적극적이고 학습 의욕이 높음"
          },
          payments: {
            totalAmount: 400000,
            paidAmount: 300000,
            pendingAmount: 100000,
            lastPayment: "2025-01-20"
          }
        },
        {
          id: 2,
          name: "김영희",
          email: "kim@example.com",
          phone: "010-9876-5432",
          address: "서울시 서초구",
          joinDate: "2025-01-10",
          status: 'active',
          pet: {
            id: 2,
            name: "바둑이",
            breed: "보더 콜리",
            age: 3,
            weight: 22.0,
            gender: "암컷",
            healthStatus: "양호",
            specialNotes: "매우 영리하고 에너지가 많음"
          },
          trainer: { id: 2, name: "이준호", email: "lee@example.com" },
          course: {
            id: 2,
            title: "어질리티 기초",
            startDate: "2025-01-10",
            endDate: "2025-02-28",
            progress: 80
          },
          attendance: {
            totalSessions: 6,
            attendedSessions: 6,
            attendanceRate: 100,
            lastAttendance: "2025-01-20"
          },
          performance: {
            overallRating: 4.8,
            behaviorScore: 95,
            learningSpeed: 90,
            socialSkills: 88,
            notes: "뛰어난 신체 능력과 빠른 학습력"
          },
          payments: {
            totalAmount: 350000,
            paidAmount: 350000,
            pendingAmount: 0,
            lastPayment: "2025-01-15"
          }
        }
      ];

      // 선택된 훈련사에 따라 필터링
      if (selectedTrainer) {
        return mockStudents.filter(student => student.trainer.id === selectedTrainer);
      }
      
      // 기관 관리자는 모든 학생 조회 가능
      if (userRole === 'institute-admin') {
        return mockStudents;
      }
      
      // 개별 훈련사는 자신의 학생만
      return mockStudents.filter(student => student.trainer.id === 1); // 현재 로그인한 훈련사 ID
    },
    enabled: isAuthenticated
  });

  // 필터링된 학생 목록
  const filteredStudents = students?.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.pet.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsStudentDetailOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">수강생 관리</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {userRole === 'institute-admin' 
              ? '기관 전체 수강생 현황 및 관리' 
              : '담당 수강생 현황 및 관리'}
          </p>
        </div>
      </div>

      {/* 기관 관리자용 훈련사 선택 */}
      {userRole === 'institute-admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              훈련사 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trainersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {trainers?.map((trainer: TrainerOverview) => (
                  <Card 
                    key={trainer.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTrainer === trainer.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTrainer(selectedTrainer === trainer.id ? null : trainer.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={trainer.avatar} />
                          <AvatarFallback>{trainer.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{trainer.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400" />
                            <span className="text-sm text-gray-600">{trainer.averageRating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">활성 학생:</span>
                          <span className="font-medium ml-1">{trainer.activeStudents}명</span>
                        </div>
                        <div>
                          <span className="text-gray-500">완료 과정:</span>
                          <span className="font-medium ml-1">{trainer.completedCourses}개</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">월 수익:</span>
                          <span className="font-medium ml-1">{trainer.monthlyRevenue.toLocaleString()}원</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant={selectedTrainer ? "outline" : "default"}
                onClick={() => setSelectedTrainer(null)}
              >
                전체 보기
              </Button>
              {selectedTrainer && (
                <Badge variant="secondary">
                  {trainers?.find(t => t.id === selectedTrainer)?.name} 훈련사 선택됨
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="학생명 또는 반려동물명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="active">수강중</SelectItem>
                <SelectItem value="inactive">휴강중</SelectItem>
                <SelectItem value="graduated">수료</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 수강생 목록 */}
      <div className="grid gap-4">
        {studentsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredStudents && filteredStudents.length > 0 ? (
          filteredStudents.map((student: Student) => (
            <Card 
              key={student.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleStudentClick(student)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{student.name}</h3>
                        <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                          {student.status === 'active' ? '수강중' : 
                           student.status === 'inactive' ? '휴강중' : '수료'}
                        </Badge>
                        {userRole === 'institute-admin' && (
                          <Badge variant="outline" className="text-xs">
                            {student.trainer.name} 담당
                          </Badge>
                        )}
                      </div>
                      
                      {/* 담당 훈련사 정보 (기관 관리자용) */}
                      {userRole === 'institute-admin' && (
                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                            <User className="h-4 w-4" />
                            담당 훈련사 정보
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">이름:</span>
                              <span className="font-medium ml-1">{student.trainer.name}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">연락처:</span>
                              <span className="font-medium ml-1">{student.trainer.email}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">전문분야:</span>
                              <span className="font-medium ml-1">
                                {trainers?.find(t => t.id === student.trainer.id)?.specialization.join(', ') || '기초 훈련'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">평점:</span>
                              <span className="font-medium ml-1 flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-400" />
                                {trainers?.find(t => t.id === student.trainer.id)?.averageRating || 4.5}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3">
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">반려동물:</span>
                          <div className="font-medium">{student.pet.name} ({student.pet.breed})</div>
                        </div>
                        <div>
                          <span className="text-gray-500">수강 과정:</span>
                          <div className="font-medium">{student.course.title}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">출석률:</span>
                          <div className="font-medium flex items-center gap-1">
                            {student.attendance.attendanceRate}%
                            {student.attendance.attendanceRate >= 90 ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : student.attendance.attendanceRate >= 70 ? (
                              <AlertCircle className="h-3 w-3 text-yellow-500" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-red-500" />
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">진도율:</span>
                          <div className="font-medium">{student.course.progress}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600 mb-1">
                      {student.performance.overallRating.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">종합 평점</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        가입: {student.joinDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        최근 출석: {student.attendance.lastAttendance}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      상세보기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchTerm || statusFilter !== 'all' ? 
                  '검색 조건에 맞는 수강생이 없습니다' : 
                  '등록된 수강생이 없습니다'
                }
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' ? 
                  '다른 검색어나 필터를 시도해보세요' : 
                  '새로운 수강생 등록을 기다리고 있습니다'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 학생 상세 정보 모달 */}
      <Dialog open={isStudentDetailOpen} onOpenChange={setIsStudentDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <GraduationCap className="h-6 w-6" />
                  {selectedStudent.name} 상세 정보
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">기본 정보</TabsTrigger>
                  <TabsTrigger value="progress">학습 진도</TabsTrigger>
                  <TabsTrigger value="attendance">출석 현황</TabsTrigger>
                  <TabsTrigger value="payments">결제 정보</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">학생 정보</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{selectedStudent.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{selectedStudent.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{selectedStudent.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{selectedStudent.address}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">반려동물 정보</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          <span>{selectedStudent.pet.name} ({selectedStudent.pet.breed})</span>
                        </div>
                        <div><span className="font-medium">나이:</span> {selectedStudent.pet.age}살</div>
                        <div><span className="font-medium">체중:</span> {selectedStudent.pet.weight}kg</div>
                        <div><span className="font-medium">성별:</span> {selectedStudent.pet.gender}</div>
                        <div><span className="font-medium">건강상태:</span> {selectedStudent.pet.healthStatus}</div>
                        <div className="mt-2">
                          <span className="font-medium">특이사항:</span>
                          <p className="text-gray-600 mt-1">{selectedStudent.pet.specialNotes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="progress" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">수강 과정 정보</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{selectedStudent.course.title}</span>
                        <Badge variant="outline">{selectedStudent.course.progress}% 완료</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${selectedStudent.course.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>시작: {selectedStudent.course.startDate}</span>
                        <span>종료: {selectedStudent.course.endDate}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">성과 평가</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>종합 평점</span>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(selectedStudent.performance.overallRating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{selectedStudent.performance.overallRating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>행동 점수</span>
                        <span className="font-medium">{selectedStudent.performance.behaviorScore}점</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>학습 속도</span>
                        <span className="font-medium">{selectedStudent.performance.learningSpeed}점</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>사회성</span>
                        <span className="font-medium">{selectedStudent.performance.socialSkills}점</span>
                      </div>
                      <div className="mt-4">
                        <span className="font-medium">훈련사 의견:</span>
                        <p className="text-gray-600 mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          {selectedStudent.performance.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="attendance" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedStudent.attendance.totalSessions}
                      </div>
                      <div className="text-sm text-gray-600">총 수업</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedStudent.attendance.attendedSessions}
                      </div>
                      <div className="text-sm text-gray-600">출석</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {selectedStudent.attendance.attendanceRate}%
                      </div>
                      <div className="text-sm text-gray-600">출석률</div>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">최근 출석:</span>
                    <span className="ml-2">{selectedStudent.attendance.lastAttendance}</span>
                  </div>
                </TabsContent>

                <TabsContent value="payments" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-bold">
                        {selectedStudent.payments.totalAmount.toLocaleString()}원
                      </div>
                      <div className="text-sm text-gray-600">총 수강료</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {selectedStudent.payments.paidAmount.toLocaleString()}원
                      </div>
                      <div className="text-sm text-gray-600">납부 완료</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="text-lg font-bold text-red-600">
                        {selectedStudent.payments.pendingAmount.toLocaleString()}원
                      </div>
                      <div className="text-sm text-gray-600">미납금</div>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">최근 결제:</span>
                    <span className="ml-2">{selectedStudent.payments.lastPayment}</span>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsStudentDetailOpen(false)}>
                  닫기
                </Button>
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  알림장 작성
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}