import { useState, useEffect } from 'react';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  Search, 
  Filter,
  MessageSquare,
  Calendar,
  User,
  ThumbsUp,
  RefreshCw,
  Reply
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Review {
  id: number;
  studentName: string;
  studentAvatar?: string;
  courseName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  replied: boolean;
  replyContent?: string;
  replyDate?: string;
}

export default function TrainerReviews() {
  const { userName } = useGlobalAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // 리뷰 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockReviews: Review[] = [
          {
            id: 1,
            studentName: '김철수',
            courseName: '반려견 기본 훈련 마스터하기',
            rating: 5,
            title: '정말 도움이 많이 되었습니다!',
            content: '코코가 처음에는 말을 전혀 듣지 않았는데, 훈련사님의 체계적인 지도 덕분에 이제는 기본 명령어를 완벽하게 수행합니다. 특히 인내심을 가지고 끝까지 가르쳐주셔서 감사합니다.',
            date: '2024-05-14',
            helpful: 12,
            replied: true,
            replyContent: '코코와 함께 열심히 훈련해주셔서 감사합니다. 앞으로도 꾸준히 연습하시면 더욱 발전할 거예요!',
            replyDate: '2024-05-15'
          },
          {
            id: 2,
            studentName: '이영희',
            courseName: '문제행동 교정 특별과정',
            rating: 4,
            title: '짖음 문제가 많이 개선되었어요',
            content: '망고의 과도한 짖음 때문에 고민이 많았는데, 전문적인 교정 방법을 배워서 많이 나아졌습니다. 아직 완전하지는 않지만 꾸준히 노력하고 있습니다.',
            date: '2024-05-12',
            helpful: 8,
            replied: false
          },
          {
            id: 3,
            studentName: '정민수',
            courseName: '고급 트릭 훈련',
            rating: 5,
            title: '보리가 이렇게 똑똑한 줄 몰랐어요!',
            content: '어질리티 훈련을 통해 보리의 숨겨진 재능을 발견했습니다. 훈련사님의 창의적인 교육 방법이 인상적이었고, 보리도 즐겁게 참여했습니다.',
            date: '2024-05-10',
            helpful: 15,
            replied: true,
            replyContent: '보리는 정말 학습 능력이 뛰어나네요! 계속 도전적인 훈련을 해보세요.',
            replyDate: '2024-05-11'
          },
          {
            id: 4,
            studentName: '한소희',
            courseName: '퍼피 사회화 클래스',
            rating: 3,
            title: '조금 더 개별 지도가 있었으면...',
            content: '루나가 워낙 소극적인 성격이라 그룹 수업에서 잘 적응하지 못했습니다. 전반적으로는 도움이 되었지만, 개별적인 관심이 더 필요했던 것 같아요.',
            date: '2024-05-08',
            helpful: 5,
            replied: false
          },
          {
            id: 5,
            studentName: '장수현',
            courseName: '반려견 산책 에티켓',
            rating: 4,
            title: '실용적인 내용이 많았어요',
            content: '몽이와 산책할 때 늘 줄을 당겨서 힘들었는데, 실제 상황에 적용할 수 있는 팁들을 많이 배웠습니다. 조금씩 개선되고 있어요.',
            date: '2024-05-06',
            helpful: 9,
            replied: true,
            replyContent: '실전 연습이 중요해요. 다양한 환경에서 꾸준히 연습해보세요!',
            replyDate: '2024-05-07'
          }
        ];
        
        setReviews(mockReviews);
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
    
    loadData();
  }, [toast]);

  // 필터링된 리뷰 업데이트
  useEffect(() => {
    let result = [...reviews];
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        review => 
          review.studentName.toLowerCase().includes(query) ||
          review.courseName.toLowerCase().includes(query) ||
          review.title.toLowerCase().includes(query) ||
          review.content.toLowerCase().includes(query)
      );
    }
    
    // 평점 필터링
    if (selectedRating !== 'all') {
      const rating = parseInt(selectedRating);
      result = result.filter(review => review.rating === rating);
    }
    
    // 날짜 기준 내림차순 정렬
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredReviews(result);
  }, [reviews, searchQuery, selectedRating]);

  // 페이지네이션 처리
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 별점 표시
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
      </div>
    );
  };

  // 평균 평점 계산
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  // 데이터 새로고침
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: '새로고침 완료',
        description: '리뷰 데이터가 업데이트되었습니다.',
      });
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <Star className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">리뷰 정보 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">리뷰 관리</h1>
          <p className="text-muted-foreground">수강생들의 소중한 피드백을 확인하고 관리하세요</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">평균 평점</p>
                <p className="text-2xl font-bold">{averageRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">총 리뷰</p>
                <p className="text-2xl font-bold">{reviews.length}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Reply className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">답변 완료</p>
                <p className="text-2xl font-bold">{reviews.filter(r => r.replied).length}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ThumbsUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">도움됨</p>
                <p className="text-2xl font-bold">{reviews.reduce((sum, r) => sum + r.helpful, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="수강생명, 강의명, 리뷰 내용으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">모든 평점</option>
            <option value="5">★★★★★ (5점)</option>
            <option value="4">★★★★☆ (4점)</option>
            <option value="3">★★★☆☆ (3점)</option>
            <option value="2">★★☆☆☆ (2점)</option>
            <option value="1">★☆☆☆☆ (1점)</option>
          </select>
        </div>
      </div>

      {/* 리뷰 목록 */}
      {paginatedReviews.length > 0 ? (
        <div className="space-y-6">
          {paginatedReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.studentAvatar} />
                      <AvatarFallback>{review.studentName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{review.studentName}</span>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-muted-foreground">{review.courseName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(review.date), 'yyyy.MM.dd')}
                    </p>
                    {review.replied ? (
                      <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                        답변 완료
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        답변 대기
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{review.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {review.content}
                  </p>
                </div>
                
                {review.replied && review.replyContent && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Reply className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        훈련사 답변
                      </span>
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        {review.replyDate && format(new Date(review.replyDate), 'yyyy.MM.dd')}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {review.replyContent}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      도움됨 {review.helpful}
                    </span>
                  </div>
                  
                  {!review.replied && (
                    <Button variant="outline" size="sm">
                      <Reply className="h-4 w-4 mr-2" />
                      답변하기
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">리뷰가 없습니다</h3>
          <p className="text-muted-foreground mb-4">아직 등록된 리뷰가 없거나 검색 조건에 맞는 리뷰가 없습니다.</p>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              이전
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            
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
    </div>
  );
}