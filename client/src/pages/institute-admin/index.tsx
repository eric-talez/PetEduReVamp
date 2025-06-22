import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Users, 
  FileText, 
  Package, 
  BookOpen, 
  Check, 
  X, 
  Clock, 
  Eye, 
  UserPlus,
  Settings,
  Shield,
  MessageSquare,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Filter,
  Search,
  Download,
  Send,
  Star,
  Award
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { queryClient } from '@/lib/queryClient';

interface ContentApproval {
  id: number;
  contentType: 'course' | 'curriculum' | 'product';
  title: string;
  description: string;
  content: any;
  attachments: string[];
  trainerStatus: string;
  instituteStatus: 'pending' | 'approved' | 'rejected';
  adminStatus: 'pending' | 'approved' | 'rejected';
  instituteComment: string | null;
  createdAt: string;
  updatedAt: string;
  submitter: {
    id: number;
    name: string;
    avatar?: string;
  };
}

interface TrainerInfo {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  permissions: string[];
  specializations: string[];
  totalStudents: number;
  totalHours: number;
  rating: number;
  contentSubmissions: number;
  pendingApprovals: number;
}

interface InstituteStats {
  totalTrainers: number;
  activeTrainers: number;
  pendingApprovals: number;
  approvedContent: number;
  rejectedContent: number;
  totalStudents: number;
  monthlyRevenue: number;
  avgRating: number;
}

export default function InstituteAdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedApproval, setSelectedApproval] = useState<ContentApproval | null>(null);
  const [isApprovalDetailOpen, setIsApprovalDetailOpen] = useState(false);
  const [isAddTrainerOpen, setIsAddTrainerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  // 기관 통계 조회
  const { data: stats } = useQuery({
    queryKey: ['/api/institute/stats'],
    queryFn: async () => {
      const response = await fetch('/api/institute/stats');
      if (!response.ok) throw new Error('통계를 불러올 수 없습니다.');
      return await response.json();
    }
  });

  // 소속 훈련사 목록 조회
  const { data: trainers, isLoading: trainersLoading } = useQuery({
    queryKey: ['/api/institute/trainers'],
    queryFn: async () => {
      const response = await fetch('/api/institute/trainers');
      if (!response.ok) throw new Error('훈련사 목록을 불러올 수 없습니다.');
      return await response.json();
    }
  });

  // 승인 대기 중인 컨텐츠 조회
  const { data: pendingApprovals, isLoading: approvalsLoading } = useQuery({
    queryKey: ['/api/institute/content-approvals', filterStatus, filterType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterType !== 'all') params.append('type', filterType);
      
      const response = await fetch(`/api/institute/content-approvals?${params}`);
      if (!response.ok) throw new Error('승인 목록을 불러올 수 없습니다.');
      return await response.json();
    }
  });

  // 컨텐츠 승인/거부
  const approveContentMutation = useMutation({
    mutationFn: async ({ id, action, comment }: { id: number; action: 'approve' | 'reject'; comment: string }) => {
      const response = await fetch(`/api/institute/content-approvals/${id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment })
      });
      if (!response.ok) throw new Error('승인 처리에 실패했습니다.');
      return await response.json();
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/institute/content-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/institute/stats'] });
      setIsApprovalDetailOpen(false);
      setReviewComment('');
      toast({
        title: action === 'approve' ? "승인 완료" : "거부 완료",
        description: `컨텐츠가 성공적으로 ${action === 'approve' ? '승인' : '거부'}되었습니다.`
      });
    }
  });

  // 훈련사 상태 변경
  const updateTrainerStatusMutation = useMutation({
    mutationFn: async ({ trainerId, status }: { trainerId: number; status: string }) => {
      const response = await fetch(`/api/institute/trainers/${trainerId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('상태 변경에 실패했습니다.');
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/institute/trainers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/institute/stats'] });
      toast({
        title: "상태 변경 완료",
        description: "훈련사 상태가 성공적으로 변경되었습니다."
      });
    }
  });

  const handleApprovalClick = (approval: ContentApproval) => {
    setSelectedApproval(approval);
    setIsApprovalDetailOpen(true);
  };

  const handleApprove = () => {
    if (!selectedApproval) return;
    approveContentMutation.mutate({
      id: selectedApproval.id,
      action: 'approve',
      comment: reviewComment
    });
  };

  const handleReject = () => {
    if (!selectedApproval || !reviewComment.trim()) {
      toast({
        title: "입력 오류",
        description: "거부 사유를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    approveContentMutation.mutate({
      id: selectedApproval.id,
      action: 'reject',
      comment: reviewComment
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600">대기중</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600">승인됨</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600">거부됨</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-4 w-4" />;
      case 'curriculum':
        return <FileText className="h-4 w-4" />;
      case 'product':
        return <Package className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getContentTypeName = (type: string) => {
    switch (type) {
      case 'course':
        return '강의';
      case 'curriculum':
        return '커리큘럼';
      case 'product':
        return '상품';
      default:
        return type;
    }
  };

  const filteredApprovals = pendingApprovals?.filter((approval: ContentApproval) =>
    approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    approval.submitter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">기관 관리</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            소속 훈련사와 컨텐츠 승인을 관리하세요
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            보고서 다운로드
          </Button>
          <Dialog open={isAddTrainerOpen} onOpenChange={setIsAddTrainerOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                훈련사 추가
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* 통계 대시보드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 훈련사</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTrainers || 0}</div>
            <p className="text-xs text-muted-foreground">
              활성: {stats?.activeTrainers || 0}명
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">승인 대기</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.pendingApprovals || 0}</div>
            <p className="text-xs text-muted-foreground">
              검토 필요
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">승인된 컨텐츠</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.approvedContent || 0}</div>
            <p className="text-xs text-muted-foreground">
              이번 달
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 평점</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avgRating?.toFixed(1) || '0.0'}</div>
            <p className="text-xs text-muted-foreground">
              5점 만점
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="approvals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="approvals">
            승인 관리 ({stats?.pendingApprovals || 0})
          </TabsTrigger>
          <TabsTrigger value="trainers">
            훈련사 관리 ({stats?.totalTrainers || 0})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            분석 리포트
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="approvals" className="space-y-4">
          {/* 필터 및 검색 */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="제목 또는 제출자로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="pending">대기중</SelectItem>
                <SelectItem value="approved">승인됨</SelectItem>
                <SelectItem value="rejected">거부됨</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="유형 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 유형</SelectItem>
                <SelectItem value="course">강의</SelectItem>
                <SelectItem value="curriculum">커리큘럼</SelectItem>
                <SelectItem value="product">상품</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 승인 목록 */}
          <div className="space-y-3">
            {approvalsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              filteredApprovals?.map((approval: ContentApproval) => (
                <Card 
                  key={approval.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary"
                  onClick={() => handleApprovalClick(approval)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getContentTypeIcon(approval.contentType)}
                          <CardTitle className="text-lg">{approval.title}</CardTitle>
                          <Badge variant="outline">{getContentTypeName(approval.contentType)}</Badge>
                          {getStatusBadge(approval.instituteStatus)}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={approval.submitter.avatar} />
                              <AvatarFallback>{approval.submitter.name[0]}</AvatarFallback>
                            </Avatar>
                            <span>{approval.submitter.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDistanceToNow(new Date(approval.createdAt), { 
                              addSuffix: true, 
                              locale: ko 
                            })}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {approval.instituteStatus === 'pending' && (
                          <Badge variant="danger" className="text-xs">검토 필요</Badge>
                        )}
                        <Eye className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                      {approval.description}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="trainers" className="space-y-4">
          <div className="grid gap-4">
            {trainersLoading ? (
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
            ) : (
              trainers?.map((trainer: TrainerInfo) => (
                <Card key={trainer.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={trainer.avatar} />
                          <AvatarFallback>{trainer.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{trainer.name}</h3>
                            <Badge 
                              variant={trainer.status === 'active' ? 'default' : 'secondary'}
                              className={trainer.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {trainer.status === 'active' ? '활성' : 
                               trainer.status === 'inactive' ? '비활성' : '정지'}
                            </Badge>
                            {trainer.pendingApprovals > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                승인대기 {trainer.pendingApprovals}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {trainer.email} • {trainer.phone}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>학생 {trainer.totalStudents}명</span>
                            <span>총 {trainer.totalHours}시간</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{trainer.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Select 
                          value={trainer.status}
                          onValueChange={(status) => updateTrainerStatusMutation.mutate({ 
                            trainerId: trainer.id, 
                            status 
                          })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">활성</SelectItem>
                            <SelectItem value="inactive">비활성</SelectItem>
                            <SelectItem value="suspended">정지</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>월별 승인 현황</CardTitle>
                <CardDescription>최근 6개월간 컨텐츠 승인 통계</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  차트 영역 (향후 구현)
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>훈련사 성과</CardTitle>
                <CardDescription>훈련사별 활동 및 평가 지표</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  성과 지표 (향후 구현)
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 승인 상세 모달 */}
      <Dialog open={isApprovalDetailOpen} onOpenChange={setIsApprovalDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedApproval && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-xl flex items-center gap-2">
                      {getContentTypeIcon(selectedApproval.contentType)}
                      {selectedApproval.title}
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{getContentTypeName(selectedApproval.contentType)}</Badge>
                      {getStatusBadge(selectedApproval.instituteStatus)}
                      {selectedApproval.adminStatus === 'pending' && (
                        <Badge variant="outline" className="text-blue-600">최종 승인 대기</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">제출자</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={selectedApproval.submitter.avatar} />
                          <AvatarFallback>{selectedApproval.submitter.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{selectedApproval.submitter.name}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">제출일</Label>
                      <p className="font-medium mt-1">
                        {new Date(selectedApproval.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="font-medium">설명</Label>
                  <p className="text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {selectedApproval.description}
                  </p>
                </div>
                
                {selectedApproval.content && (
                  <div>
                    <Label className="font-medium">상세 내용</Label>
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {JSON.stringify(selectedApproval.content, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
                
                {selectedApproval.attachments && selectedApproval.attachments.length > 0 && (
                  <div>
                    <Label className="font-medium">첨부파일</Label>
                    <div className="mt-2 space-y-2">
                      {selectedApproval.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{attachment}</span>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedApproval.instituteStatus === 'pending' && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <Label className="font-medium">검토 의견</Label>
                      <Textarea
                        placeholder="승인 또는 거부 사유를 입력하세요..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </>
                )}
                
                {selectedApproval.instituteComment && (
                  <div>
                    <Label className="font-medium">기관 검토 의견</Label>
                    <p className="text-gray-700 dark:text-gray-300 mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {selectedApproval.instituteComment}
                    </p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsApprovalDetailOpen(false)}>
                  닫기
                </Button>
                {selectedApproval.instituteStatus === 'pending' && (
                  <>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <X className="h-4 w-4 mr-2" />
                          거부
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>컨텐츠 거부</AlertDialogTitle>
                          <AlertDialogDescription>
                            이 컨텐츠를 거부하시겠습니까? 거부 사유가 제출자에게 전달됩니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction onClick={handleReject}>
                            거부
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button onClick={handleApprove} disabled={approveContentMutation.isPending}>
                      <Check className="h-4 w-4 mr-2" />
                      승인
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}