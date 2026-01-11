import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Users, UserCheck, UserX, Shield, Clock, CheckCircle, XCircle, ArrowLeft, ChevronDown, Activity, BarChart3, TrendingUp, Calendar, Dog, Mic, Video } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface UserWithProfile {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  role: string | null;
  approvalStatus: string | null;
  registrationCompleted: string | null;
  createdAt: Date | null;
  profile: {
    fullName: string;
    institution: string | null;
    researchFocus: string | null;
    phoneNumber: string | null;
    purpose: string | null;
    experience: string | null;
  } | null;
}

interface UsageStats {
  users: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    admins: number;
    recentWeek: number;
  };
  research: {
    totalSubjects: number;
    totalSessions: number;
    totalBehavioralAnalyses: number;
    totalVocalAnalyses: number;
  };
  recentUsers: {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    role: string | null;
    approvalStatus: string | null;
    createdAt: Date | null;
  }[];
  dailyRegistrations: { date: string; count: number }[];
}

interface BehavioralAnalysis {
  id: number;
  sessionId: number | null;
  dogId: number | null;
  researcherId: number | null;
  behaviorType: string;
  intensity: number;
  duration: number;
  triggers: string[] | null;
  bodyLanguage: Record<string, unknown> | null;
  facialExpressions: Record<string, unknown> | null;
  vocalizations: Record<string, unknown> | null;
  contextualFactors: string[] | null;
  confidence: number;
  videoTimestamp: number | null;
  createdAt: Date | null;
}

interface VocalAnalysis {
  id: number;
  sessionId: number | null;
  dogId: number | null;
  researcherId: number | null;
  vocalizationType: string;
  frequency: number;
  amplitude: number;
  duration: number;
  pitch: number;
  rhythm: string | null;
  emotionalState: string;
  context: string;
  audioFeatures: Record<string, unknown> | null;
  spectrogramData: Record<string, unknown> | null;
  confidence: number;
  audioTimestamp: number | null;
  createdAt: Date | null;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("usage");

  const { data: pendingUsers = [], isLoading: pendingLoading } = useQuery<UserWithProfile[]>({
    queryKey: ["/api/admin/pending-users"],
    enabled: user?.role === "admin",
  });

  const { data: allUsers = [], isLoading: allLoading } = useQuery<UserWithProfile[]>({
    queryKey: ["/api/admin/users"],
    enabled: user?.role === "admin",
  });

  const { data: usageStats, isLoading: usageLoading } = useQuery<UsageStats>({
    queryKey: ["/api/admin/usage-stats"],
    enabled: user?.role === "admin",
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: behavioralAnalyses = [], isLoading: behavioralLoading } = useQuery<BehavioralAnalysis[]>({
    queryKey: ["/api/research/behavioral-analyses"],
    enabled: user?.role === "admin",
  });

  const { data: vocalAnalyses = [], isLoading: vocalLoading } = useQuery<VocalAnalysis[]>({
    queryKey: ["/api/research/vocal-analyses"],
    enabled: user?.role === "admin",
  });

  const approveMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${userId}/approve`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "승인 완료", description: "사용자가 승인되었습니다" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: () => {
      toast({ title: "오류", description: "승인 처리 중 오류가 발생했습니다", variant: "destructive" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${userId}/reject`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "거절 완료", description: "사용자가 거절되었습니다" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: () => {
      toast({ title: "오류", description: "거절 처리 중 오류가 발생했습니다", variant: "destructive" });
    },
  });

  const setRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${userId}/role`, { role });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "역할 변경", description: "사용자 역할이 변경되었습니다" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: () => {
      toast({ title: "오류", description: "역할 변경 중 오류가 발생했습니다", variant: "destructive" });
    },
  });

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />승인됨</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700"><XCircle className="w-3 h-3 mr-1" />거절됨</Badge>;
      case "pending":
      default:
        return <Badge className="bg-amber-100 text-amber-700"><Clock className="w-3 h-3 mr-1" />대기중</Badge>;
    }
  };

  const getRoleBadge = (role: string | null) => {
    if (role === "admin") {
      return <Badge className="bg-purple-100 text-purple-700"><Shield className="w-3 h-3 mr-1" />관리자</Badge>;
    }
    return <Badge variant="outline">일반 사용자</Badge>;
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="w-16 h-16 mx-auto text-red-400 mb-4" />
            <h2 className="text-xl font-bold mb-2">접근 권한 없음</h2>
            <p className="text-gray-600 mb-4">이 페이지는 관리자만 접근할 수 있습니다.</p>
            <Button onClick={() => setLocation("/")} data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#8BC34A]" />
              관리자 페이지
            </h1>
            <p className="text-gray-600">사용자 승인 및 관리</p>
          </div>
          <Button variant="outline" onClick={() => setLocation("/dashboard")} data-testid="button-back-dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            대시보드로 돌아가기
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingUsers.filter(u => u.registrationCompleted === 'true').length}</p>
                  <p className="text-sm text-gray-600">승인 대기</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{allUsers.filter(u => u.approvalStatus === 'approved').length}</p>
                  <p className="text-sm text-gray-600">승인된 사용자</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{allUsers.length}</p>
                  <p className="text-sm text-gray-600">전체 사용자</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 flex-wrap">
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              이용 현황
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              승인 대기 ({pendingUsers.filter(u => u.registrationCompleted === 'true').length})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              전체 사용자
            </TabsTrigger>
            <TabsTrigger value="behavioral" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              행동 분석 ({behavioralAnalyses.length})
            </TabsTrigger>
            <TabsTrigger value="vocal" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              음성 분석 ({vocalAnalyses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usage">
            <div className="space-y-6">
              {usageLoading ? (
                <div className="text-center py-8 text-gray-500">로딩 중...</div>
              ) : usageStats ? (
                <>
                  {/* 사용자 현황 카드 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        사용자 현황
                      </CardTitle>
                      <CardDescription>서비스 이용자 통계</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-700">{usageStats.users.total}</div>
                          <div className="text-sm text-gray-600">전체</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-700">{usageStats.users.approved}</div>
                          <div className="text-sm text-gray-600">승인됨</div>
                        </div>
                        <div className="text-center p-4 bg-amber-50 rounded-lg">
                          <div className="text-2xl font-bold text-amber-700">{usageStats.users.pending}</div>
                          <div className="text-sm text-gray-600">대기중</div>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-700">{usageStats.users.rejected}</div>
                          <div className="text-sm text-gray-600">거절됨</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-700">{usageStats.users.admins}</div>
                          <div className="text-sm text-gray-600">관리자</div>
                        </div>
                        <div className="text-center p-4 bg-indigo-50 rounded-lg">
                          <div className="text-2xl font-bold text-indigo-700">{usageStats.users.recentWeek}</div>
                          <div className="text-sm text-gray-600">최근 7일</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 연구 데이터 현황 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-green-600" />
                        연구 데이터 현황
                      </CardTitle>
                      <CardDescription>분석 및 연구 활동 통계</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                          <div className="text-3xl font-bold text-blue-700">{usageStats.research.totalSubjects}</div>
                          <div className="text-sm text-gray-600 mt-1">연구 대상</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
                          <div className="text-3xl font-bold text-green-700">{usageStats.research.totalSessions}</div>
                          <div className="text-sm text-gray-600 mt-1">연구 세션</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg">
                          <div className="text-3xl font-bold text-purple-700">{usageStats.research.totalBehavioralAnalyses}</div>
                          <div className="text-sm text-gray-600 mt-1">행동 분석</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg">
                          <div className="text-3xl font-bold text-orange-700">{usageStats.research.totalVocalAnalyses}</div>
                          <div className="text-sm text-gray-600 mt-1">음성 분석</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 일별 가입자 추이 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        최근 7일 가입 추이
                      </CardTitle>
                      <CardDescription>일별 신규 가입자 수</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end justify-between gap-2 h-32">
                        {usageStats.dailyRegistrations.map((day) => {
                          const maxCount = Math.max(...usageStats.dailyRegistrations.map(d => d.count), 1);
                          const height = (day.count / maxCount) * 100;
                          const dateObj = new Date(day.date);
                          const dayName = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()];
                          return (
                            <div key={day.date} className="flex-1 flex flex-col items-center">
                              <div className="text-xs font-medium text-gray-700 mb-1">{day.count}</div>
                              <div 
                                className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg transition-all"
                                style={{ height: `${Math.max(height, 5)}%`, minHeight: '4px' }}
                              />
                              <div className="text-xs text-gray-500 mt-1">{dayName}</div>
                              <div className="text-xs text-gray-400">{day.date.slice(5)}</div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 최근 가입자 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-teal-600" />
                        최근 가입자
                      </CardTitle>
                      <CardDescription>최근 7일 내 가입한 사용자</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {usageStats.recentUsers.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">최근 가입자가 없습니다</div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>이름</TableHead>
                              <TableHead>이메일</TableHead>
                              <TableHead>상태</TableHead>
                              <TableHead>가입일</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {usageStats.recentUsers.map((u) => (
                              <TableRow key={u.id}>
                                <TableCell className="font-medium">
                                  {u.firstName || u.email || "이름 없음"}
                                </TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>{getStatusBadge(u.approvalStatus)}</TableCell>
                                <TableCell>
                                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString('ko-KR') : '-'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">데이터를 불러올 수 없습니다</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>승인 대기 중인 사용자</CardTitle>
                <CardDescription>회원가입을 완료한 사용자들의 승인을 처리합니다</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingLoading ? (
                  <div className="text-center py-8 text-gray-500">로딩 중...</div>
                ) : pendingUsers.filter(u => u.registrationCompleted === 'true').length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    승인 대기 중인 사용자가 없습니다
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>이름</TableHead>
                        <TableHead>이메일</TableHead>
                        <TableHead>소속</TableHead>
                        <TableHead>사용 목적</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingUsers.filter(u => u.registrationCompleted === 'true').map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.profile?.fullName || user.firstName || "이름 없음"}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.profile?.institution || "-"}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {user.profile?.purpose || "-"}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="sm"
                              onClick={() => approveMutation.mutate(user.id)}
                              disabled={approveMutation.isPending}
                              className="bg-green-600 hover:bg-green-700"
                              data-testid={`button-approve-${user.id}`}
                            >
                              <UserCheck className="w-4 h-4 mr-1" />
                              승인
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rejectMutation.mutate(user.id)}
                              disabled={rejectMutation.isPending}
                              data-testid={`button-reject-${user.id}`}
                            >
                              <UserX className="w-4 h-4 mr-1" />
                              거절
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>전체 사용자 목록</CardTitle>
                <CardDescription>모든 등록된 사용자를 관리합니다</CardDescription>
              </CardHeader>
              <CardContent>
                {allLoading ? (
                  <div className="text-center py-8 text-gray-500">로딩 중...</div>
                ) : allUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    등록된 사용자가 없습니다
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>이름</TableHead>
                        <TableHead>이메일</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>역할</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">
                            {u.profile?.fullName || u.firstName || u.email || "이름 없음"}
                          </TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>{getStatusBadge(u.approvalStatus)}</TableCell>
                          <TableCell>{getRoleBadge(u.role)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" data-testid={`button-actions-${u.id}`}>
                                  작업 <ChevronDown className="w-4 h-4 ml-1" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {u.approvalStatus !== "approved" && (
                                  <DropdownMenuItem onClick={() => approveMutation.mutate(u.id)}>
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    승인
                                  </DropdownMenuItem>
                                )}
                                {u.approvalStatus !== "rejected" && (
                                  <DropdownMenuItem onClick={() => rejectMutation.mutate(u.id)}>
                                    <UserX className="w-4 h-4 mr-2" />
                                    거절
                                  </DropdownMenuItem>
                                )}
                                {u.role !== "admin" && (
                                  <DropdownMenuItem onClick={() => setRoleMutation.mutate({ userId: u.id, role: "admin" })}>
                                    <Shield className="w-4 h-4 mr-2" />
                                    관리자로 설정
                                  </DropdownMenuItem>
                                )}
                                {u.role === "admin" && u.id !== user?.id && (
                                  <DropdownMenuItem onClick={() => setRoleMutation.mutate({ userId: u.id, role: "user" })}>
                                    <Users className="w-4 h-4 mr-2" />
                                    일반 사용자로 설정
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavioral">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-600" />
                  행동 분석 데이터
                </CardTitle>
                <CardDescription>사용자들이 수행한 모든 행동 분석 결과</CardDescription>
              </CardHeader>
              <CardContent>
                {behavioralLoading ? (
                  <div className="text-center py-8 text-gray-500">로딩 중...</div>
                ) : behavioralAnalyses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Video className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    행동 분석 데이터가 없습니다
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>행동 유형</TableHead>
                          <TableHead>강도</TableHead>
                          <TableHead>지속시간</TableHead>
                          <TableHead>신뢰도</TableHead>
                          <TableHead>분석일</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {behavioralAnalyses.map((analysis) => (
                          <TableRow key={analysis.id}>
                            <TableCell className="font-medium">{analysis.id}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{analysis.behaviorType}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-purple-500 h-2 rounded-full"
                                    style={{ width: `${analysis.intensity * 10}%` }}
                                  />
                                </div>
                                <span className="text-sm">{analysis.intensity}/10</span>
                              </div>
                            </TableCell>
                            <TableCell>{analysis.duration.toFixed(1)}초</TableCell>
                            <TableCell>
                              <Badge variant={analysis.confidence >= 0.8 ? "default" : analysis.confidence >= 0.5 ? "secondary" : "outline"}>
                                {(analysis.confidence * 100).toFixed(0)}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString('ko-KR') : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vocal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-orange-600" />
                  음성 분석 데이터
                </CardTitle>
                <CardDescription>사용자들이 수행한 모든 음성 분석 결과</CardDescription>
              </CardHeader>
              <CardContent>
                {vocalLoading ? (
                  <div className="text-center py-8 text-gray-500">로딩 중...</div>
                ) : vocalAnalyses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Mic className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    음성 분석 데이터가 없습니다
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>발성 유형</TableHead>
                          <TableHead>감정 상태</TableHead>
                          <TableHead>주파수</TableHead>
                          <TableHead>지속시간</TableHead>
                          <TableHead>신뢰도</TableHead>
                          <TableHead>분석일</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vocalAnalyses.map((analysis) => (
                          <TableRow key={analysis.id}>
                            <TableCell className="font-medium">{analysis.id}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{analysis.vocalizationType}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                                {analysis.emotionalState}
                              </Badge>
                            </TableCell>
                            <TableCell>{analysis.frequency.toFixed(0)} Hz</TableCell>
                            <TableCell>{analysis.duration.toFixed(1)}초</TableCell>
                            <TableCell>
                              <Badge variant={analysis.confidence >= 0.8 ? "default" : analysis.confidence >= 0.5 ? "secondary" : "outline"}>
                                {(analysis.confidence * 100).toFixed(0)}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString('ko-KR') : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
