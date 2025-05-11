import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  Flag,
  Check,
  X,
  AlertTriangle,
  MessageSquare,
  MoreVertical,
  Shield,
  Ban,
  Clock,
  FileText
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 신고 타입 정의
interface Report {
  id: number;
  type: 'user' | 'content' | 'review' | 'comment' | 'message';
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  reporterId: number;
  reporterName: string;
  reporterAvatar?: string;
  targetId: number;
  targetType: string;
  targetName: string;
  targetAvatar?: string;
  reason: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  moderatorId?: number;
  moderatorName?: string;
  moderatorNotes?: string;
  actionTaken?: string;
  evidence?: string[];
  priority: 'low' | 'medium' | 'high';
}

export default function AdminReports() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  // 신고 데이터 로드
  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      try {
        // 실제 구현 시 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 임시 신고 데이터
        const mockReports: Report[] = [
          {
            id: 1,
            type: 'user',
            status: 'pending',
            reporterId: 4,
            reporterName: '최견주',
            targetId: 101,
            targetType: '사용자',
            targetName: '불량사용자',
            reason: '불쾌한 언어 사용',
            description: '훈련 커뮤니티에서 부적절한 언어를 사용하여 다른 견주들에게 불편함을 주었습니다.',
            createdAt: '2024-05-08 15:12:34',
            updatedAt: '2024-05-08 15:12:34',
            priority: 'medium'
          },
          {
            id: 2,
            type: 'content',
            status: 'investigating',
            reporterId: 5,
            reporterName: '김슬기',
            targetId: 202,
            targetType: '강의',
            targetName: '문제 강의',
            reason: '부적절한 콘텐츠',
            description: '강의 내용 중 반려동물에게 부적절하고 위험한 훈련 방법이 포함되어 있습니다.',
            createdAt: '2024-05-07 09:45:22',
            updatedAt: '2024-05-09 11:30:15',
            moderatorId: 1,
            moderatorName: '김관리자',
            moderatorNotes: '해당 콘텐츠 확인 중, 확인되면 강의 삭제 조치 필요',
            priority: 'high'
          },
          {
            id: 3,
            type: 'review',
            status: 'resolved',
            reporterId: 3,
            reporterName: '박훈련',
            targetId: 303,
            targetType: '리뷰',
            targetName: '부정적 리뷰',
            reason: '명예훼손',
            description: '허위 사실을 기반으로 한 악의적인 리뷰로 훈련사의 평판을 손상시키고 있습니다.',
            createdAt: '2024-05-05 14:20:11',
            updatedAt: '2024-05-10 16:45:30',
            moderatorId: 1,
            moderatorName: '김관리자',
            moderatorNotes: '확인 결과 허위 사실 포함, 해당 리뷰 삭제 조치 완료',
            actionTaken: '리뷰 삭제',
            priority: 'medium'
          },
          {
            id: 4,
            type: 'message',
            status: 'dismissed',
            reporterId: 4,
            reporterName: '최견주',
            targetId: 404,
            targetType: '메시지',
            targetName: '스팸 메시지',
            reason: '스팸/광고',
            description: '훈련과 무관한 상업적 광고를 계속 보내고 있습니다.',
            createdAt: '2024-05-01 10:11:23',
            updatedAt: '2024-05-02 09:30:15',
            moderatorId: 1,
            moderatorName: '김관리자',
            moderatorNotes: '조사 결과 교육 관련 서비스 안내로 규정에 위배되지 않음',
            actionTaken: '신고 거부',
            priority: 'low'
          },
          {
            id: 5,
            type: 'comment',
            status: 'pending',
            reporterId: 3,
            reporterName: '박훈련',
            targetId: 505,
            targetType: '댓글',
            targetName: '공격적 댓글',
            reason: '공격적 행동',
            description: '특정 훈련사에 대한 인신공격성 댓글을 계속 작성하고 있습니다.',
            createdAt: '2024-05-09 17:22:33',
            updatedAt: '2024-05-09 17:22:33',
            priority: 'high'
          }
        ];
        
        setReports(mockReports);
      } catch (error) {
        console.error('신고 데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '신고 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReports();
  }, [toast]);
  
  // 필터링된 신고 목록 업데이트
  useEffect(() => {
    let result = [...reports];
    
    // 탭 필터링
    if (activeTab !== 'all') {
      result = result.filter(report => report.status === activeTab);
    }
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        report => 
          report.reporterName.toLowerCase().includes(query) ||
          report.targetName.toLowerCase().includes(query) ||
          report.reason.toLowerCase().includes(query) ||
          report.description.toLowerCase().includes(query)
      );
    }
    
    // 우선순위 필터링
    if (filterPriority) {
      result = result.filter(report => report.priority === filterPriority);
    }
    
    // 유형 필터링
    if (filterType) {
      result = result.filter(report => report.type === filterType);
    }
    
    // 정렬
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'priority':
          const priorityValue = { high: 3, medium: 2, low: 1 };
          comparison = priorityValue[a.priority] - priorityValue[b.priority];
          break;
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredReports(result);
  }, [reports, activeTab, searchQuery, filterPriority, filterType, sortBy, sortOrder]);
  
  // 페이지네이션 처리
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  // 신고 상세 정보 보기
  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setModalMode('view');
    setShowReportModal(true);
  };
  
  // 신고 편집/처리 모드
  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setModalMode('edit');
    setShowReportModal(true);
  };
  
  // 신고 상태 변경
  const handleChangeStatus = (reportId: number, newStatus: 'pending' | 'investigating' | 'resolved' | 'dismissed') => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? 
      { 
        ...report, 
        status: newStatus, 
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        moderatorId: 1,
        moderatorName: '김관리자'
      } : 
      report
    ));
    
    const statusMap = {
      pending: '대기',
      investigating: '조사 중',
      resolved: '해결됨',
      dismissed: '기각됨'
    };
    
    toast({
      title: '신고 상태 변경',
      description: `신고 상태가 '${statusMap[newStatus]}'(으)로 변경되었습니다.`,
    });
    
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({
        ...selectedReport,
        status: newStatus,
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        moderatorId: 1,
        moderatorName: '김관리자'
      });
    }
  };
  
  // 신고 처리 저장
  const handleSaveReport = (notes: string, action: string) => {
    if (!selectedReport) return;
    
    const updatedReport = {
      ...selectedReport,
      moderatorNotes: notes,
      actionTaken: action,
      status: 'resolved' as const, // 처리 완료로 상태 변경
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      moderatorId: 1,
      moderatorName: '김관리자'
    };
    
    setReports(prev => prev.map(report => 
      report.id === selectedReport.id ? updatedReport : report
    ));
    
    setSelectedReport(updatedReport);
    setModalMode('view');
    
    toast({
      title: '신고 처리 완료',
      description: '신고 처리 내용이 저장되었습니다.',
    });
  };
  
  // 신고 기각
  const handleDismissReport = (reportId: number) => {
    const notes = "검토 결과 신고 내용이 정책 위반에 해당하지 않습니다.";
    const action = "신고 기각";
    
    setReports(prev => prev.map(report => 
      report.id === reportId ? 
      { 
        ...report, 
        status: 'dismissed',
        moderatorNotes: notes,
        actionTaken: action,
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        moderatorId: 1,
        moderatorName: '김관리자'
      } : 
      report
    ));
    
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({
        ...selectedReport,
        status: 'dismissed',
        moderatorNotes: notes,
        actionTaken: action,
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        moderatorId: 1,
        moderatorName: '김관리자'
      });
    }
    
    toast({
      title: '신고 기각',
      description: '신고가 기각 처리되었습니다.',
    });
    
    setShowReportModal(false);
  };
  
  // 사용자 제재 처리
  const handleTakeAction = (userId: number, action: string) => {
    // 실제 구현 시 API 호출로 대체
    
    toast({
      title: '제재 조치 완료',
      description: `사용자에 대한 ${action} 조치가 완료되었습니다.`,
    });
  };
  
  // 상태별 배지 색상 및 아이콘
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-amber-500">
            <Clock className="w-3 h-3 mr-1" />
            대기
          </Badge>
        );
      case 'investigating':
        <Badge className="bg-blue-500">
          <Search className="w-3 h-3 mr-1" />
          조사 중
        </Badge>
      case 'resolved':
        return (
          <Badge className="bg-green-500">
            <Check className="w-3 h-3 mr-1" />
            해결됨
          </Badge>
        );
      case 'dismissed':
        return (
          <Badge variant="outline" className="text-gray-500">
            <X className="w-3 h-3 mr-1" />
            기각됨
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // 신고 유형별 배지 색상
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'user':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">사용자</Badge>;
      case 'content':
        return <Badge variant="outline" className="border-purple-500 text-purple-500">콘텐츠</Badge>;
      case 'review':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">리뷰</Badge>;
      case 'comment':
        return <Badge variant="outline" className="border-green-500 text-green-500">댓글</Badge>;
      case 'message':
        return <Badge variant="outline" className="border-cyan-500 text-cyan-500">메시지</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  // 우선순위별 배지 색상
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">높음</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">중간</Badge>;
      case 'low':
        return <Badge className="bg-green-500">낮음</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };
  
  // 데이터 새로고침
  const handleRefresh = () => {
    setIsLoading(true);
    
    // 실제 구현 시 API 호출로 대체
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: '새로고침 완료',
        description: '신고 데이터가 업데이트되었습니다.',
      });
    }, 1000);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">신고 관리</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            새로고침
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="pending">대기</TabsTrigger>
            <TabsTrigger value="investigating">조사 중</TabsTrigger>
            <TabsTrigger value="resolved">해결됨</TabsTrigger>
            <TabsTrigger value="dismissed">기각됨</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="신고자, 대상, 이유 검색..."
                className="pl-8 h-9 md:w-[300px] w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterType || 'all'} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="신고 유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 유형</SelectItem>
                <SelectItem value="user">사용자</SelectItem>
                <SelectItem value="content">콘텐츠</SelectItem>
                <SelectItem value="review">리뷰</SelectItem>
                <SelectItem value="comment">댓글</SelectItem>
                <SelectItem value="message">메시지</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterPriority || 'all'} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="우선순위" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 우선순위</SelectItem>
                <SelectItem value="high">높음</SelectItem>
                <SelectItem value="medium">중간</SelectItem>
                <SelectItem value="low">낮음</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="ghost" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>신고자</TableHead>
                  <TableHead>대상</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>이유</TableHead>
                  <TableHead>우선순위</TableHead>
                  <TableHead>신고일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10">
                      <div className="flex justify-center">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">데이터를 불러오고 있습니다...</div>
                    </TableCell>
                  </TableRow>
                ) : paginatedReports.length > 0 ? (
                  paginatedReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={report.reporterAvatar} alt={report.reporterName} />
                            <AvatarFallback>{report.reporterName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{report.reporterName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-muted-foreground text-xs">{report.targetType}</span>
                          <span>{report.targetName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(report.type)}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={report.reason}>
                          {report.reason}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(report.priority)}
                      </TableCell>
                      <TableCell>
                        <div className="whitespace-nowrap">
                          {report.createdAt.split(' ')[0]}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(report.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewReport(report)}>
                                <Search className="h-4 w-4 mr-2" />
                                상세 보기
                              </DropdownMenuItem>
                              {report.status !== 'resolved' && report.status !== 'dismissed' && (
                                <>
                                  <DropdownMenuItem onClick={() => handleEditReport(report)}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    처리하기
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {report.status !== 'investigating' && (
                                    <DropdownMenuItem onClick={() => handleChangeStatus(report.id, 'investigating')}>
                                      <Search className="h-4 w-4 mr-2 text-blue-500" />
                                      조사 시작
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => handleDismissReport(report.id)}>
                                    <X className="h-4 w-4 mr-2 text-gray-500" />
                                    신고 기각
                                  </DropdownMenuItem>
                                </>
                              )}
                              
                              {report.type === 'user' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleTakeAction(report.targetId, '계정 일시 정지')}>
                                    <Ban className="h-4 w-4 mr-2 text-amber-500" />
                                    계정 일시 정지
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleTakeAction(report.targetId, '계정 영구 정지')} className="text-red-500">
                                    <Shield className="h-4 w-4 mr-2" />
                                    계정 영구 정지
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10">
                      <div className="text-muted-foreground">검색 결과가 없습니다</div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          {!isLoading && totalPages > 1 && (
            <CardFooter className="flex justify-between py-4">
              <div className="text-sm text-muted-foreground">
                총 {filteredReports.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredReports.length)}개 표시
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage > 3 ? currentPage - 3 + i + 1 : i + 1;
                  if (pageNum <= totalPages) {
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                  return null;
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </Tabs>
      
      {/* 신고 상세 정보 모달 */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {modalMode === 'view' ? '신고 상세 정보' : '신고 처리'}
            </DialogTitle>
            <DialogDescription>
              {modalMode === 'view' 
                ? selectedReport ? `신고 ID ${selectedReport.id}의 상세 정보입니다.` : ''
                : '이 신고에 대한 처리를 진행합니다.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">신고 정보</h3>
                    <div className="bg-secondary/50 p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Flag className="h-4 w-4 text-red-500" />
                          <span className="font-medium">{selectedReport.reason}</span>
                        </div>
                        <div>
                          {getStatusBadge(selectedReport.status)}
                        </div>
                      </div>
                      <div className="mt-2 text-sm">{selectedReport.description}</div>
                      <div className="mt-4 text-xs text-muted-foreground">
                        {getTypeBadge(selectedReport.type)} {getPriorityBadge(selectedReport.priority)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">신고자</h3>
                    <div className="flex items-center space-x-3 bg-secondary/50 p-3 rounded-md">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedReport.reporterAvatar} alt={selectedReport.reporterName} />
                        <AvatarFallback>{selectedReport.reporterName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedReport.reporterName}</div>
                        <div className="text-xs text-muted-foreground">ID: {selectedReport.reporterId}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">신고 대상</h3>
                    <div className="flex items-center justify-between bg-secondary/50 p-3 rounded-md">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedReport.targetAvatar} alt={selectedReport.targetName} />
                          <AvatarFallback>{selectedReport.targetName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{selectedReport.targetName}</div>
                          <div className="text-xs text-muted-foreground">
                            {selectedReport.targetType} ID: {selectedReport.targetId}
                          </div>
                        </div>
                      </div>
                      
                      {selectedReport.type === 'user' && (
                        <Button variant="outline" size="sm">
                          <User className="h-4 w-4 mr-2" />
                          프로필 보기
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">처리 정보</h3>
                    
                    {modalMode === 'view' ? (
                      selectedReport.moderatorId ? (
                        <div className="bg-secondary/50 p-3 rounded-md space-y-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback>{selectedReport.moderatorName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{selectedReport.moderatorName}</div>
                              <div className="text-xs text-muted-foreground">
                                최종 업데이트: {selectedReport.updatedAt}
                              </div>
                            </div>
                          </div>
                          
                          {selectedReport.actionTaken && (
                            <div className="space-y-1">
                              <div className="text-sm font-medium">처리 결과</div>
                              <div className="text-sm">{selectedReport.actionTaken}</div>
                            </div>
                          )}
                          
                          {selectedReport.moderatorNotes && (
                            <div className="space-y-1">
                              <div className="text-sm font-medium">관리자 메모</div>
                              <div className="text-sm">{selectedReport.moderatorNotes}</div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-secondary/50 p-3 rounded-md flex items-center justify-center h-20">
                          <div className="text-center text-muted-foreground">
                            <AlertTriangle className="h-5 w-5 mx-auto mb-1" />
                            <div className="text-sm">아직 처리되지 않은 신고입니다</div>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="action">처리 결과</Label>
                          <Select defaultValue="신고 인정 및 조치">
                            <SelectTrigger>
                              <SelectValue placeholder="처리 결과 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="신고 인정 및 조치">신고 인정 및 조치</SelectItem>
                              <SelectItem value="신고 기각">신고 기각</SelectItem>
                              <SelectItem value="사용자 경고">사용자 경고</SelectItem>
                              <SelectItem value="콘텐츠 삭제">콘텐츠 삭제</SelectItem>
                              <SelectItem value="사용자 일시 정지">사용자 일시 정지</SelectItem>
                              <SelectItem value="사용자 영구 정지">사용자 영구 정지</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">관리자 메모</Label>
                          <Textarea 
                            id="notes"
                            placeholder="처리 과정 및 결정에 대한 설명을 작성하세요"
                            defaultValue={selectedReport.moderatorNotes}
                            rows={5}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">시간</h3>
                    <div className="bg-secondary/50 p-3 rounded-md space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">신고 접수일</span>
                        <span>{selectedReport.createdAt}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">최종 업데이트</span>
                        <span>{selectedReport.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                  
                  {modalMode === 'view' ? (
                    <div className="pt-4 space-y-2">
                      {(selectedReport.status === 'pending' || selectedReport.status === 'investigating') && (
                        <Button
                          className="w-full"
                          onClick={() => setModalMode('edit')}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          이 신고 처리하기
                        </Button>
                      )}
                      
                      {selectedReport.type === 'user' && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleTakeAction(selectedReport.targetId, '계정 일시 정지')}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            사용자 일시 정지
                          </Button>
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleTakeAction(selectedReport.targetId, '계정 영구 정지')}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            영구 정지
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="pt-4 flex space-x-2">
                      <Button
                        className="flex-1"
                        onClick={() => {
                          const notes = (document.getElementById('notes') as HTMLTextAreaElement)?.value || '';
                          const action = (document.querySelector('[data-value]') as HTMLElement)?.getAttribute('data-value') || '신고 인정 및 조치';
                          handleSaveReport(notes, action);
                        }}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        처리 완료
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setModalMode('view')}
                      >
                        취소
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}