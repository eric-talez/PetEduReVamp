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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Star,
  StarHalf,
  Search,
  Filter,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  MoreVertical,
  Users,
  CalendarClock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Review {
  id: number;
  studentId: number;
  studentName: string;
  studentAvatar?: string;
  courseId: number;
  courseName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'published' | 'pending' | 'rejected';
  hasReply: boolean;
  reply?: string;
  replyDate?: string;
}

export default function TrainerReviews() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterRating, setFilterRating] = useState<string | null>(null);
  const [filterCourse, setFilterCourse] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [courses, setCourses] = useState<{id: number, name: string}[]>([]);

  // 리뷰 데이터 로드
  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      try {
        // 실제 구현 시 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 임시 리뷰 데이터
        const mockReviews: Review[] = [
          {
            id: 1,
            studentId: 101,
            studentName: '김철수',
            studentAvatar: '',
            courseId: 1,
            courseName: '반려견 기본 훈련 과정',
            rating: 5,
            comment: '매우 유익한 훈련 과정이었습니다. 우리 강아지가 많이 발전했어요! 훈련사님의 친절한 설명과 꼼꼼한 지도 덕분입니다.',
            date: '2024-05-02',
            status: 'published',
            hasReply: true,
            reply: '수업에 만족해주셔서 감사합니다. 앞으로도 김철수님과 반려견의 성장을 응원하겠습니다!',
            replyDate: '2024-05-03'
          },
          {
            id: 2,
            studentId: 102,
            studentName: '이영희',
            studentAvatar: '',
            courseId: 2,
            courseName: '문제행동 교정 특별과정',
            rating: 4,
            comment: '우리 강아지의 짖음 문제가 많이 개선되었어요. 다만 분리불안은 아직 완전히 해결되지 않았네요.',
            date: '2024-05-05',
            status: 'published',
            hasReply: false
          },
          {
            id: 3,
            studentId: 103,
            studentName: '박지민',
            studentAvatar: '',
            courseId: 1,
            courseName: '반려견 기본 훈련 과정',
            rating: 3.5,
            comment: '수업 내용은 좋았으나 강의 시간이 조금 짧은 느낌이었습니다. 더 많은 실습 시간이 있었으면 좋겠어요.',
            date: '2024-05-10',
            status: 'published',
            hasReply: false
          },
          {
            id: 4,
            studentId: 104,
            studentName: '정민수',
            studentAvatar: '',
            courseId: 3,
            courseName: '고급 트릭 훈련',
            rating: 5,
            comment: '정말 놀라운 경험이었습니다! 제 푸들이 이렇게 많은 트릭을 배울 수 있을 거라고 상상도 못했어요.',
            date: '2024-05-08',
            status: 'published',
            hasReply: true,
            reply: '정민수님의 푸들은 정말 재능있는 아이예요! 앞으로도 지속적인 훈련으로 더 많은 발전이 기대됩니다.',
            replyDate: '2024-05-09'
          },
          {
            id: 5,
            studentId: 105,
            studentName: '한소희',
            studentAvatar: '',
            courseId: 2,
            courseName: '문제행동 교정 특별과정',
            rating: 2,
            comment: '기대했던 것보다 효과가 크지 않았습니다. 더 체계적인 접근이 필요해 보여요.',
            date: '2024-05-12',
            status: 'pending',
            hasReply: false
          }
        ];
        
        // 임시 강좌 데이터
        const mockCourses = [
          { id: 1, name: '반려견 기본 훈련 과정' },
          { id: 2, name: '문제행동 교정 특별과정' },
          { id: 3, name: '고급 트릭 훈련' },
          { id: 4, name: '퍼피 사회화 클래스' }
        ];
        
        setReviews(mockReviews);
        setCourses(mockCourses);
      } catch (error) {
        console.error('리뷰 데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '리뷰 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReviews();
  }, [toast]);
  
  // 필터링된 리뷰 목록 업데이트
  useEffect(() => {
    let result = [...reviews];
    
    // 탭 필터링
    if (activeTab === 'pending') {
      result = result.filter(review => review.status === 'pending');
    } else if (activeTab === 'published') {
      result = result.filter(review => review.status === 'published');
    } else if (activeTab === 'replied') {
      result = result.filter(review => review.hasReply);
    } else if (activeTab === 'unreplied') {
      result = result.filter(review => review.status === 'published' && !review.hasReply);
    }
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        review => 
          review.studentName.toLowerCase().includes(query) ||
          review.courseName.toLowerCase().includes(query) ||
          review.comment.toLowerCase().includes(query)
      );
    }
    
    // 별점 필터링
    if (filterRating) {
      const rating = parseInt(filterRating);
      result = result.filter(review => 
        rating === 5 ? review.rating === 5 :
        Math.floor(review.rating) === rating
      );
    }
    
    // 코스 필터링
    if (filterCourse && filterCourse !== 'all') {
      const courseId = parseInt(filterCourse);
      result = result.filter(review => review.courseId === courseId);
    }
    
    // 정렬
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        default:
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredReviews(result);
  }, [reviews, activeTab, searchQuery, filterRating, filterCourse, sortBy, sortOrder]);
  
  // 페이지네이션 처리
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // 별점 표시 컴포넌트
  const RatingStars = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    );
  };
  
  // 리뷰 상세 보기
  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setShowDetailModal(true);
  };
  
  // 리뷰 답변 모달 표시
  const handleReplyReview = (review: Review) => {
    setSelectedReview(review);
    setReplyText(review.reply || '');
    setShowReplyModal(true);
  };
  
  // 리뷰 답변 저장
  const handleSaveReply = () => {
    if (!selectedReview) return;
    
    const updatedReview = {
      ...selectedReview,
      hasReply: true,
      reply: replyText,
      replyDate: new Date().toISOString().split('T')[0]
    };
    
    setReviews(prev => prev.map(r => 
      r.id === selectedReview.id ? updatedReview : r
    ));
    
    setShowReplyModal(false);
    
    toast({
      title: '답변 저장 완료',
      description: '리뷰에 대한 답변이 저장되었습니다.',
    });
  };
  
  // 리뷰 승인/거절
  const handleChangeReviewStatus = (reviewId: number, newStatus: 'published' | 'rejected') => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, status: newStatus } : review
    ));
    
    toast({
      title: newStatus === 'published' ? '리뷰 승인됨' : '리뷰 거절됨',
      description: `리뷰가 ${newStatus === 'published' ? '승인' : '거절'}되었습니다.`,
    });
  };
  
  // 데이터 새로고침
  const handleRefresh = () => {
    setIsLoading(true);
    
    // 실제 구현 시 API 호출로 대체
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: '새로고침 완료',
        description: '리뷰 데이터가 업데이트되었습니다.',
      });
    }, 1000);
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* 리뷰 상세 모달 */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          {selectedReview && (
            <>
              <DialogHeader>
                <DialogTitle>리뷰 상세</DialogTitle>
                <DialogDescription>
                  {selectedReview.courseName} 수업에 대한 리뷰
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedReview.studentAvatar} alt={selectedReview.studentName} />
                    <AvatarFallback>{selectedReview.studentName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{selectedReview.studentName}</h4>
                      <RatingStars rating={selectedReview.rating} />
                      <span className="text-sm text-muted-foreground">
                        {selectedReview.date}
                      </span>
                    </div>
                    <p className="text-sm">
                      {selectedReview.comment}
                    </p>
                  </div>
                </div>
                
                {selectedReview.hasReply && selectedReview.reply && (
                  <div className="pl-14 space-y-1 pt-3 border-t">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">내 답변</h4>
                      <span className="text-sm text-muted-foreground">
                        {selectedReview.replyDate}
                      </span>
                    </div>
                    <p className="text-sm">
                      {selectedReview.reply}
                    </p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                {!selectedReview.hasReply ? (
                  <Button onClick={() => {
                    setShowDetailModal(false);
                    handleReplyReview(selectedReview);
                  }}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    답변 작성
                  </Button>
                ) : (
                  <Button onClick={() => {
                    setShowDetailModal(false);
                    handleReplyReview(selectedReview);
                  }} variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    답변 수정
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* 답변 작성/수정 모달 */}
      <Dialog open={showReplyModal} onOpenChange={setShowReplyModal}>
        <DialogContent className="max-w-2xl">
          {selectedReview && (
            <>
              <DialogHeader>
                <DialogTitle>리뷰 답변 {selectedReview.hasReply ? '수정' : '작성'}</DialogTitle>
                <DialogDescription>
                  {selectedReview.studentName}님의 리뷰에 대한 답변을 {selectedReview.hasReply ? '수정' : '작성'}합니다
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium">{selectedReview.studentName}</h4>
                    <RatingStars rating={selectedReview.rating} />
                    <span className="text-sm text-muted-foreground">
                      {selectedReview.date}
                    </span>
                  </div>
                  <p className="text-sm">
                    {selectedReview.comment}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="reply" className="text-sm font-medium">
                    답변
                  </label>
                  <Textarea
                    id="reply"
                    placeholder="학생의 리뷰에 대한 답변을 작성해주세요..."
                    rows={5}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">취소</Button>
                </DialogClose>
                <Button 
                  onClick={handleSaveReply}
                  disabled={!replyText.trim()}
                >
                  저장
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">리뷰 관리</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            새로고침
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="published">승인됨</TabsTrigger>
            <TabsTrigger value="pending">승인 대기</TabsTrigger>
            <TabsTrigger value="replied">답변 완료</TabsTrigger>
            <TabsTrigger value="unreplied">미답변</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="리뷰 검색..."
                className="pl-8 h-9 md:w-[200px] w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterRating || 'all'} onValueChange={setFilterRating}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="별점" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 별점</SelectItem>
                <SelectItem value="5">5점</SelectItem>
                <SelectItem value="4">4점</SelectItem>
                <SelectItem value="3">3점</SelectItem>
                <SelectItem value="2">2점</SelectItem>
                <SelectItem value="1">1점</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterCourse || 'all'} onValueChange={setFilterCourse}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="강좌" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 강좌</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : paginatedReviews.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                조건에 맞는 리뷰가 없습니다
              </div>
            ) : (
              <div className="divide-y">
                {paginatedReviews.map((review) => (
                  <div key={review.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={review.studentAvatar} alt={review.studentName} />
                              <AvatarFallback>{review.studentName.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium mr-2">{review.studentName}</span>
                          </div>
                          <div className="flex items-center">
                            <RatingStars rating={review.rating} />
                            <span className="text-sm text-muted-foreground ml-2">
                              {review.date}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          <CalendarClock className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{review.courseName}</span>
                        </div>
                        <p className="text-sm line-clamp-2">
                          {review.comment}
                        </p>
                        <div className="flex items-center mt-2">
                          {review.hasReply ? (
                            <Badge variant="outline" className="border-green-500 text-green-500">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              답변 완료
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-amber-500 text-amber-500">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              답변 필요
                            </Badge>
                          )}
                          {review.status === 'pending' && (
                            <Badge variant="outline" className="ml-2 border-blue-500 text-blue-500">
                              승인 대기
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewReview(review)}
                        >
                          상세 보기
                        </Button>
                        {review.status === 'published' ? (
                          <Button 
                            variant={review.hasReply ? "outline" : "default"} 
                            size="sm"
                            onClick={() => handleReplyReview(review)}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            {review.hasReply ? '답변 수정' : '답변 작성'}
                          </Button>
                        ) : review.status === 'pending' ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleChangeReviewStatus(review.id, 'published')}>
                                <ThumbsUp className="h-4 w-4 mr-2 text-green-500" />
                                승인
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeReviewStatus(review.id, 'rejected')}>
                                <ThumbsDown className="h-4 w-4 mr-2 text-red-500" />
                                거절
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center p-4 border-t">
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    이전
                  </Button>
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
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
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    다음
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}