
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Users, 
  Building, 
  PawPrint, 
  UserCheck, 
  UserX, 
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface MatchingStats {
  totalInstitutes: number;
  totalTrainers: number;
  totalPetOwners: number;
  totalPets: number;
  assignedTrainers: number;
  unassignedTrainers: number;
  assignedPets: number;
  unassignedPets: number;
  instituteStats: Array<{
    id: number;
    name: string;
    trainersCount: number;
    petsCount: number;
  }>;
}

interface MatchingRequest {
  id: number;
  petId: number;
  trainerId: number;
  ownerId: number;
  petName: string;
  trainerName: string;
  message: string;
  preferredDate: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedAt?: string;
  response?: string;
}

export default function MatchingSystemManagement() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<MatchingStats | null>(null);
  const [requests, setRequests] = useState<MatchingRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<MatchingRequest | null>(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);

  // 매칭 통계 데이터 로드
  const loadMatchingStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/matching/overview');
      if (!response.ok) {
        throw new Error('매칭 통계를 불러올 수 없습니다.');
      }
      
      const data = await response.json();
      setStats(data.data);
      
      console.log('매칭 통계 로드 완료:', data.data);
      
    } catch (error) {
      console.error('매칭 통계 로드 오류:', error);
      toast({
        title: "데이터 로딩 오류",
        description: "매칭 통계를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 매칭 요청 데이터 로드 (임시 - 실제로는 모든 요청 조회 API 필요)
  const loadMatchingRequests = async () => {
    try {
      // 임시 데이터 - 실제로는 API에서 모든 요청 조회
      const mockRequests: MatchingRequest[] = [
        {
          id: 1,
          petId: 1,
          trainerId: 2,
          ownerId: 3,
          petName: '맥스',
          trainerName: '강동훈',
          message: '기본 복종 훈련을 받고 싶습니다.',
          preferredDate: '2025-06-01',
          status: 'pending',
          createdAt: '2025-05-30T10:00:00Z'
        }
      ];
      
      setRequests(mockRequests);
      
    } catch (error) {
      console.error('매칭 요청 로드 오류:', error);
    }
  };

  useEffect(() => {
    loadMatchingStats();
    loadMatchingRequests();
  }, []);

  // 매칭 효율성 계산
  const getMatchingEfficiency = () => {
    if (!stats) return 0;
    const totalTrainers = stats.totalTrainers;
    const totalPets = stats.totalPets;
    if (totalTrainers === 0 || totalPets === 0) return 0;
    
    return Math.round((stats.assignedPets / Math.min(totalTrainers * 5, totalPets)) * 100); // 훈련사당 최대 5마리 가정
  };

  // 요청 상세 보기
  const viewRequestDetails = (request: MatchingRequest) => {
    setSelectedRequest(request);
    setShowRequestDialog(true);
  };

  // 새로고침
  const handleRefresh = () => {
    loadMatchingStats();
    loadMatchingRequests();
    toast({
      title: "데이터 새로고침",
      description: "매칭 시스템 데이터가 업데이트되었습니다.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">매칭 시스템 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">매칭 시스템 관리</h1>
          <p className="text-muted-foreground mt-1">견주, 훈련사, 기관의 매칭 현황을 모니터링하고 관리합니다.</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          새로고침
        </Button>
      </div>

      {/* 매칭 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 기관</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalInstitutes || 0}</div>
            <p className="text-xs text-muted-foreground">등록된 교육 기관</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 훈련사</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTrainers || 0}</div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-600">배정: {stats?.assignedTrainers || 0}</span>
              <span className="text-orange-600">미배정: {stats?.unassignedTrainers || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 반려견</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPets || 0}</div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-600">매칭: {stats?.assignedPets || 0}</span>
              <span className="text-red-600">대기: {stats?.unassignedPets || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">매칭 효율성</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getMatchingEfficiency()}%</div>
            <Progress value={getMatchingEfficiency()} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* 기관별 매칭 현황 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>기관별 매칭 현황</CardTitle>
          <CardDescription>각 기관의 훈련사 및 반려견 매칭 상태</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>기관명</TableHead>
                <TableHead>소속 훈련사</TableHead>
                <TableHead>담당 반려견</TableHead>
                <TableHead>매칭률</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats?.instituteStats.map((institute) => {
                const matchingRate = institute.trainersCount > 0 
                  ? Math.round((institute.petsCount / (institute.trainersCount * 5)) * 100)
                  : 0;
                
                return (
                  <TableRow key={institute.id}>
                    <TableCell className="font-medium">{institute.name}</TableCell>
                    <TableCell>{institute.trainersCount}명</TableCell>
                    <TableCell>{institute.petsCount}마리</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={Math.min(matchingRate, 100)} className="w-20" />
                        <span className="text-sm">{Math.min(matchingRate, 100)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          matchingRate >= 80 ? "default" :
                          matchingRate >= 50 ? "secondary" : "destructive"
                        }
                      >
                        {matchingRate >= 80 ? "우수" : matchingRate >= 50 ? "보통" : "개선필요"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 매칭 요청 현황 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            매칭 요청 현황
            <Badge variant="outline">{requests.length}건</Badge>
          </CardTitle>
          <CardDescription>견주들의 훈련사 매칭 요청 및 처리 상태</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>요청일</TableHead>
                <TableHead>반려견</TableHead>
                <TableHead>요청 훈련사</TableHead>
                <TableHead>희망일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      {new Date(request.createdAt).toLocaleDateString('ko-KR')}
                    </TableCell>
                    <TableCell className="font-medium">{request.petName}</TableCell>
                    <TableCell>{request.trainerName}</TableCell>
                    <TableCell>
                      {new Date(request.preferredDate).toLocaleDateString('ko-KR')}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          request.status === 'approved' ? "default" :
                          request.status === 'rejected' ? "destructive" : "secondary"
                        }
                      >
                        <div className="flex items-center gap-1">
                          {request.status === 'approved' && <CheckCircle className="h-3 w-3" />}
                          {request.status === 'rejected' && <UserX className="h-3 w-3" />}
                          {request.status === 'pending' && <Clock className="h-3 w-3" />}
                          {
                            request.status === 'approved' ? '승인됨' :
                            request.status === 'rejected' ? '거절됨' : '대기중'
                          }
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewRequestDetails(request)}
                      >
                        상세보기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    매칭 요청이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 요청 상세 다이얼로그 */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>매칭 요청 상세</DialogTitle>
            <DialogDescription>
              매칭 요청의 상세 정보를 확인합니다.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">반려견</label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.petName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">요청 훈련사</label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.trainerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">희망 시작일</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedRequest.preferredDate).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">요청일</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedRequest.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">요청 메시지</label>
                <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                  {selectedRequest.message}
                </p>
              </div>
              {selectedRequest.response && (
                <div>
                  <label className="text-sm font-medium">처리 결과</label>
                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                    {selectedRequest.response}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
