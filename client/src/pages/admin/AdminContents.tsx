import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-compat';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  PlusCircle,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Image,
  Video,
  FileText,
  Layout,
  LayoutGrid,
  ExternalLink,
  Link as LinkIcon,
  BarChart,
  Calendar
} from 'lucide-react';

// 콘텐츠 타입 정의
interface Content {
  id: number;
  title: string;
  type: 'banner' | 'image' | 'video' | 'article' | 'event';
  status: 'active' | 'inactive' | 'draft' | 'scheduled';
  publishDate: string;
  location: string;
  views: number;
  clicks?: number;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminContents() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');
  const [newContent, setNewContent] = useState({
    title: '',
    type: 'banner' as 'banner' | 'image' | 'video' | 'article' | 'event',
    status: 'draft' as 'active' | 'inactive' | 'draft' | 'scheduled',
    location: '',
    publishDate: '',
    description: '',
    url: '',
    tags: ''
  });

  // 콘텐츠 데이터 로드
  useEffect(() => {
    const loadContents = async () => {
      setIsLoading(true);
      try {
        // 실제 구현 시 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 임시 데이터
        const mockContents: Content[] = [
          {
            id: 1,
            title: '메인 배너 - 신규 강좌 홍보',
            type: 'banner',
            status: 'active',
            publishDate: '2024-05-01',
            location: '홈페이지 메인',
            views: 4521,
            clicks: 348,
            author: '관리자',
            createdAt: '2024-04-28',
            updatedAt: '2024-05-01'
          },
          {
            id: 2,
            title: '반려견 기초 훈련 가이드',
            type: 'article',
            status: 'active',
            publishDate: '2024-04-20',
            location: '블로그',
            views: 1250,
            author: '김훈련',
            createdAt: '2024-04-15',
            updatedAt: '2024-04-20'
          },
          {
            id: 3,
            title: '여름 맞이 반려견 수영 교실 안내',
            type: 'event',
            status: 'scheduled',
            publishDate: '2024-06-01',
            location: '이벤트 페이지',
            views: 0,
            author: '이벤트팀',
            createdAt: '2024-05-10',
            updatedAt: '2024-05-10'
          },
          {
            id: 4,
            title: '반려견 훈련 성공 사례 - 말라뮤트 구름이',
            type: 'video',
            status: 'active',
            publishDate: '2024-04-25',
            location: '성공 사례 갤러리',
            views: 832,
            author: '박트레이너',
            createdAt: '2024-04-23',
            updatedAt: '2024-04-25'
          },
          {
            id: 5,
            title: '강아지 장난감 추천 - 여름 특집',
            type: 'article',
            status: 'draft',
            publishDate: '',
            location: '블로그',
            views: 0,
            author: '최에디터',
            createdAt: '2024-05-08',
            updatedAt: '2024-05-08'
          }
        ];
        
        setContents(mockContents);
      } catch (error) {
        console.error('콘텐츠 데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '콘텐츠 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContents();
  }, [toast]);
  
  // 콘텐츠 타입에 따른 아이콘 표시
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'banner':
        return <Layout className="w-4 h-4 mr-1" />;
      case 'image':
        return <Image className="w-4 h-4 mr-1" />;
      case 'video':
        return <Video className="w-4 h-4 mr-1" />;
      case 'article':
        return <FileText className="w-4 h-4 mr-1" />;
      case 'event':
        return <Calendar className="w-4 h-4 mr-1" />;
      default:
        return <Image className="w-4 h-4 mr-1" />;
    }
  };
  
  // 상태에 따른 배지 표시
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">활성</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-gray-500">비활성</Badge>;
      case 'draft':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">초안</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500">예약됨</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // 필터링 및 검색 기능
  const getFilteredContents = () => {
    let filtered = [...contents];
    
    // 탭 필터링
    if (activeTab !== 'all') {
      filtered = filtered.filter(content => content.status === activeTab);
    }
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(content => 
        content.title.toLowerCase().includes(query) ||
        content.author.toLowerCase().includes(query) ||
        content.location.toLowerCase().includes(query)
      );
    }
    
    // 콘텐츠 타입 필터링
    if (filterType) {
      filtered = filtered.filter(content => content.type === filterType);
    }
    
    // 상태 필터링
    if (filterStatus) {
      filtered = filtered.filter(content => content.status === filterStatus);
    }
    
    return filtered;
  };
  
  // 페이지네이션 구현
  const filteredContents = getFilteredContents();
  const totalPages = Math.ceil(filteredContents.length / itemsPerPage);
  const paginatedContents = filteredContents.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  // 콘텐츠 상세 보기
  const handleViewContent = (content: Content) => {
    setSelectedContent(content);
    setModalMode('view');
    setShowContentModal(true);
  };
  
  // 콘텐츠 편집 모드
  const handleEditContent = (content: Content) => {
    setSelectedContent(content);
    setModalMode('edit');
    setShowContentModal(true);
  };
  
  // 새 콘텐츠 추가 모드
  const handleAddContent = () => {
    setSelectedContent(null);
    setModalMode('add');
    // 폼 초기화
    setNewContent({
      title: '',
      type: 'banner',
      status: 'draft',
      location: '',
      publishDate: '',
      description: '',
      url: '',
      tags: ''
    });
    setShowContentModal(true);
  };

  // 콘텐츠 저장 함수
  const handleSaveContent = () => {
    if (!newContent.title || !newContent.location) {
      toast({
        title: "입력 오류",
        description: "제목과 위치는 필수 입력 항목입니다.",
        variant: "destructive",
      });
      return;
    }

    // 새 콘텐츠 생성
    const contentToSave = {
      id: contents.length + 1,
      title: newContent.title,
      type: newContent.type,
      status: newContent.status,
      location: newContent.location,
      publishDate: newContent.publishDate || new Date().toISOString().split('T')[0],
      views: 0,
      clicks: 0,
      author: userName || '관리자',
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString()
    };

    // 콘텐츠 목록에 추가
    setContents([...contents, contentToSave]);
    
    toast({
      title: "콘텐츠 추가 완료",
      description: "새 콘텐츠가 성공적으로 추가되었습니다.",
    });
    
    setShowContentModal(false);
  };
  
  // 데이터 새로고침
  const handleRefresh = () => {
    setIsLoading(true);
    // 실제 구현 시 API 호출로 대체
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: '새로고침 완료',
        description: '콘텐츠 데이터가 업데이트되었습니다.',
      });
    }, 1000);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">콘텐츠 관리</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddContent} variant="default">
            <PlusCircle className="mr-2 h-4 w-4" />
            콘텐츠 추가
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="active">활성</TabsTrigger>
            <TabsTrigger value="draft">초안</TabsTrigger>
            <TabsTrigger value="scheduled">예약됨</TabsTrigger>
            <TabsTrigger value="inactive">비활성</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="제목, 작성자, 위치 검색..."
                className="pl-8 h-9 md:w-[300px] w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterType || 'all'} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="콘텐츠 타입" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 타입</SelectItem>
                <SelectItem value="banner">배너</SelectItem>
                <SelectItem value="image">이미지</SelectItem>
                <SelectItem value="video">비디오</SelectItem>
                <SelectItem value="article">아티클</SelectItem>
                <SelectItem value="event">이벤트</SelectItem>
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
                  <TableHead className="w-[60px]">ID</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead>타입</TableHead>
                  <TableHead>위치</TableHead>
                  <TableHead>게시일</TableHead>
                  <TableHead className="text-center">조회수</TableHead>
                  <TableHead className="text-center">상태</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="flex justify-center">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        콘텐츠 데이터 로딩 중...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedContents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="text-muted-foreground">
                        {searchQuery 
                          ? '검색 조건에 맞는 콘텐츠가 없습니다.' 
                          : '콘텐츠가 없습니다.'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedContents.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell className="font-medium">{content.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{content.title}</div>
                        <div className="text-xs text-muted-foreground">
                          작성자: {content.author}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getContentTypeIcon(content.type)}
                          <span className="capitalize">
                            {content.type === 'banner' && '배너'}
                            {content.type === 'image' && '이미지'}
                            {content.type === 'video' && '비디오'}
                            {content.type === 'article' && '아티클'}
                            {content.type === 'event' && '이벤트'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{content.location}</TableCell>
                      <TableCell>
                        {content.publishDate || 
                          <span className="text-muted-foreground">미설정</span>}
                      </TableCell>
                      <TableCell className="text-center">{content.views.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(content.status)}
                      </TableCell>
                      <TableCell className="flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewContent(content)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditContent(content)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (window.confirm('이 콘텐츠를 삭제하시겠습니까?')) {
                              // 실제 구현 시 API 호출로 대체
                              setContents(prev => prev.filter(c => c.id !== content.id));
                              toast({
                                title: '콘텐츠 삭제',
                                description: '콘텐츠가 삭제되었습니다.',
                              });
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          {filteredContents.length > 0 && (
            <CardFooter className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                {filteredContents.length}개 콘텐츠 중 {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredContents.length)} 표시
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </Tabs>
      
      {/* 콘텐츠 세부 정보 모달 */}
      {selectedContent && (
        <Dialog open={showContentModal} onOpenChange={setShowContentModal}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {modalMode === 'view' && '콘텐츠 세부 정보'}
                {modalMode === 'edit' && '콘텐츠 편집'}
                {modalMode === 'add' && '새 콘텐츠 추가'}
              </DialogTitle>
              <DialogDescription>
                {modalMode === 'view' && '콘텐츠의 세부 정보를 확인합니다.'}
                {modalMode === 'edit' && '콘텐츠 정보를 수정합니다.'}
                {modalMode === 'add' && '새로운 콘텐츠를 추가합니다.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-1">제목</div>
                <div className="text-lg font-semibold">{selectedContent.title}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">타입</div>
                <div className="flex items-center">
                  {getContentTypeIcon(selectedContent.type)}
                  <span className="capitalize">
                    {selectedContent.type === 'banner' && '배너'}
                    {selectedContent.type === 'image' && '이미지'}
                    {selectedContent.type === 'video' && '비디오'}
                    {selectedContent.type === 'article' && '아티클'}
                    {selectedContent.type === 'event' && '이벤트'}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">상태</div>
                <div>{getStatusBadge(selectedContent.status)}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">위치</div>
                <div>{selectedContent.location}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">게시일</div>
                <div>
                  {selectedContent.publishDate || 
                    <span className="text-muted-foreground">미설정</span>}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">작성자</div>
                <div>{selectedContent.author}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">조회수</div>
                <div>{selectedContent.views.toLocaleString()}</div>
              </div>
              
              {selectedContent.clicks !== undefined && (
                <div>
                  <div className="text-sm font-medium mb-1">클릭수</div>
                  <div>{selectedContent.clicks.toLocaleString()}</div>
                </div>
              )}
              
              <div>
                <div className="text-sm font-medium mb-1">생성일</div>
                <div>{selectedContent.createdAt}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">수정일</div>
                <div>{selectedContent.updatedAt}</div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowContentModal(false)}>
                닫기
              </Button>
              {modalMode === 'add' && (
                <Button onClick={handleSaveContent}>
                  콘텐츠 추가
                </Button>
              )}
              {modalMode === 'edit' && (
                <Button onClick={() => {
                  toast({
                    title: '수정 완료',
                    description: '콘텐츠 정보가 수정되었습니다.',
                  });
                  setShowContentModal(false);
                }}>
                  수정 저장
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}