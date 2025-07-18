import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  RefreshCw, 
  Gift, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Moon,
  Sun,
  Users,
  Star,
  Award,
  Coffee,
  Shield,
  Heart,
  MessageSquare,
  Phone,
  Mail
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface RestRequest {
  id: string;
  type: 'personal' | 'center';
  duration: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  substituteRequired: boolean;
  substituteAssigned?: string;
  rewardEligible: boolean;
  createdAt: string;
}

interface SubstituteRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  centerName: string;
  startDate: string;
  endDate: string;
  sessionType: string;
  compensation: number;
  status: 'pending' | 'accepted' | 'rejected';
  description: string;
}

interface RestStatistics {
  totalRestDays: number;
  thisMonthRest: number;
  yearlyQuota: number;
  remainingDays: number;
  burnoutRisk: 'low' | 'medium' | 'high';
  lastRest: string;
  substituteEarnings: number;
  rewardPoints: number;
}

export default function RestManagement() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [restDuration, setRestDuration] = useState(1);
  const [restReason, setRestReason] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: restData, isLoading } = useQuery<{
    statistics: RestStatistics;
    requests: RestRequest[];
    substituteRequests: SubstituteRequest[];
  }>({
    queryKey: ['/api/trainer/rest-management'],
    refetchInterval: 30000,
  });

  const defaultData = {
    statistics: {
      totalRestDays: 45,
      thisMonthRest: 3,
      yearlyQuota: 60,
      remainingDays: 15,
      burnoutRisk: 'medium' as const,
      lastRest: '2025-01-10',
      substituteEarnings: 180000,
      rewardPoints: 850
    },
    requests: [
      {
        id: '1',
        type: 'personal' as const,
        duration: 2,
        startDate: '2025-01-20',
        endDate: '2025-01-21',
        reason: '개인 휴식 및 재충전',
        status: 'approved' as const,
        substituteRequired: true,
        substituteAssigned: '김대체 훈련사',
        rewardEligible: false,
        createdAt: '2025-01-15'
      },
      {
        id: '2',
        type: 'personal' as const,
        duration: 1,
        startDate: '2025-01-25',
        endDate: '2025-01-25',
        reason: '병원 진료',
        status: 'pending' as const,
        substituteRequired: false,
        rewardEligible: true,
        createdAt: '2025-01-18'
      }
    ],
    substituteRequests: [
      {
        id: '1',
        requesterId: '2',
        requesterName: '박훈련사',
        centerName: '서울 반려견 교육센터',
        startDate: '2025-01-22',
        endDate: '2025-01-23',
        sessionType: '기초 훈련',
        compensation: 120000,
        status: 'pending' as const,
        description: '2일간 기초 훈련 세션 대체 요청'
      },
      {
        id: '2',
        requesterId: '3',
        requesterName: '이전문가',
        centerName: '부산 펫 아카데미',
        startDate: '2025-01-28',
        endDate: '2025-01-29',
        sessionType: '행동 교정',
        compensation: 150000,
        status: 'pending' as const,
        description: '행동 교정 전문 세션 대체 요청'
      }
    ]
  };

  const data = restData || defaultData;

  const getBurnoutRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '승인됨';
      case 'rejected': return '거부됨';
      case 'pending': return '대기중';
      case 'active': return '진행중';
      default: return '알 수 없음';
    }
  };

  const handleRestRequest = async () => {
    if (!selectedDate || !restReason.trim()) {
      return;
    }

    console.log('휴식 신청:', {
      startDate: selectedDate,
      duration: restDuration,
      reason: restReason
    });

    // API 호출 로직
    setIsDialogOpen(false);
    setRestReason('');
    setRestDuration(1);
  };

  const handleSubstituteResponse = async (requestId: string, action: 'accept' | 'reject') => {
    console.log('대체 요청 응답:', { requestId, action });
    // API 호출 로직
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">휴식 관리</h1>
          <p className="text-gray-600 dark:text-gray-400">건강한 훈련 환경을 위한 휴식 제도</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
              <Moon className="w-4 h-4 mr-2" />
              휴식 신청
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>휴식 신청</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="start-date">시작일</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ko}
                  className="rounded-md border"
                />
              </div>
              <div>
                <Label htmlFor="duration">기간 (일)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="7"
                  value={restDuration}
                  onChange={(e) => setRestDuration(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="reason">휴식 사유</Label>
                <Textarea
                  id="reason"
                  placeholder="휴식이 필요한 이유를 간단히 적어주세요"
                  value={restReason}
                  onChange={(e) => setRestReason(e.target.value)}
                />
              </div>
              <Button onClick={handleRestRequest} className="w-full">
                신청하기
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">총 휴식 일수</p>
                <p className="text-3xl font-bold">{data.statistics.totalRestDays}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">이번 달 휴식</p>
                <p className="text-2xl font-bold text-green-600">{data.statistics.thisMonthRest}일</p>
              </div>
              <Moon className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">남은 휴식 일수</p>
                <p className="text-2xl font-bold text-orange-600">{data.statistics.remainingDays}일</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">번아웃 위험도</p>
                <Badge className={getBurnoutRiskColor(data.statistics.burnoutRisk)}>
                  {data.statistics.burnoutRisk === 'low' ? '낮음' : 
                   data.statistics.burnoutRisk === 'medium' ? '보통' : '높음'}
                </Badge>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 플랫폼 보호 시스템 안내 */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            TALEZ 휴식 보호 시스템
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span className="text-sm">대체 훈련사 자동 연결</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-600" />
                <span className="text-sm">OFF 리워드 포인트 지급</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-sm">팬 자동 공지 시스템</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">대체 수익</span>
                <span className="font-medium">{data.statistics.substituteEarnings.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">리워드 포인트</span>
                <span className="font-medium">{data.statistics.rewardPoints.toLocaleString()}P</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 탭 섹션 */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">내 휴식 신청</TabsTrigger>
          <TabsTrigger value="substitute">대체 요청</TabsTrigger>
          <TabsTrigger value="statistics">통계</TabsTrigger>
        </TabsList>

        {/* 휴식 신청 내역 */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                내 휴식 신청 내역
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.requests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {request.type === 'personal' ? '개인 휴식' : '센터 휴식'}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusText(request.status)}
                        </Badge>
                        {request.rewardEligible && (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            <Gift className="w-3 h-3 mr-1" />
                            리워드 대상
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {request.duration}일
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">기간</span>
                        <span className="text-sm">
                          {format(new Date(request.startDate), 'yyyy.MM.dd', { locale: ko })} - 
                          {format(new Date(request.endDate), 'yyyy.MM.dd', { locale: ko })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">사유</span>
                        <span className="text-sm">{request.reason}</span>
                      </div>
                      {request.substituteAssigned && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">대체 훈련사</span>
                          <span className="text-sm text-blue-600 dark:text-blue-400">
                            {request.substituteAssigned}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 대체 요청 */}
        <TabsContent value="substitute" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                대체 훈련사 요청
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.substituteRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{request.requesterName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{request.centerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{request.compensation.toLocaleString()}원</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{request.sessionType}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">기간</span>
                        <span className="text-sm">
                          {format(new Date(request.startDate), 'yyyy.MM.dd', { locale: ko })} - 
                          {format(new Date(request.endDate), 'yyyy.MM.dd', { locale: ko })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">설명</span>
                        <span className="text-sm">{request.description}</span>
                      </div>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleSubstituteResponse(request.id, 'accept')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          수락
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSubstituteResponse(request.id, 'reject')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          거절
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 통계 */}
        <TabsContent value="statistics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  휴식 통계
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>연간 할당량</span>
                    <span className="font-medium">{data.statistics.yearlyQuota}일</span>
                  </div>
                  <div className="flex justify-between">
                    <span>사용한 일수</span>
                    <span className="font-medium">{data.statistics.totalRestDays}일</span>
                  </div>
                  <div className="flex justify-between">
                    <span>남은 일수</span>
                    <span className="font-medium text-green-600">{data.statistics.remainingDays}일</span>
                  </div>
                  <div className="flex justify-between">
                    <span>마지막 휴식</span>
                    <span className="font-medium">
                      {format(new Date(data.statistics.lastRest), 'yyyy.MM.dd', { locale: ko })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coffee className="w-5 h-5" />
                  건강 관리 팁
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Sun className="w-4 h-4 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">규칙적인 휴식</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        월 2-3일 정도의 정기적인 휴식을 권장합니다
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">번아웃 예방</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        연속 근무 일수를 줄이고 충분한 수면을 취하세요
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">네트워크 활용</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        대체 훈련사 시스템을 적극 활용하세요
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}