import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  Star, 
  ThumbsUp, 
  MoreVertical, 
  Edit, 
  Trash2,
  Shield,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useViewCounter } from '@/hooks/useViewCounter';

interface Review {
  id: number;
  user: string;
  userId: number;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
  likes: number;
  isLiked: boolean;
  verified: boolean;
  images: string[];
}

interface ProductReviewSectionProps {
  productId: number;
  reviews: Review[];
  productRating: number;
  productReviewCount: number;
  onReviewUpdate: (reviews: Review[]) => void;
  currentUserId?: number;
}

export function ProductReviewSection({
  productId,
  reviews,
  productRating,
  productReviewCount,
  onReviewUpdate,
  currentUserId = 1
}: ProductReviewSectionProps) {
  const { toast } = useToast();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'helpful'>('newest');
  
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    content: '',
    images: [] as string[]
  });

  // 조회수 기록
  useViewCounter({
    itemId: productId,
    itemType: 'product',
    enabled: true,
    delay: 3
  });

  // 리뷰 정렬
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  // 별점 렌더링
  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    return Array(5).fill(0).map((_, idx) => (
      <Star 
        key={idx} 
        className={`${sizeClasses[size]} ${
          idx < rating 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300'
        }`} 
      />
    ));
  };

  // 리뷰 작성/수정 제출
  const handleSubmitReview = () => {
    if (!reviewForm.content.trim()) {
      toast({
        title: "리뷰 내용을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    const newReview: Review = {
      id: editingReview || Date.now(),
      user: '현재 사용자',
      userId: currentUserId,
      rating: reviewForm.rating,
      date: new Date().toISOString().split('T')[0],
      title: reviewForm.title,
      content: reviewForm.content,
      helpful: 0,
      likes: 0,
      isLiked: false,
      verified: true,
      images: reviewForm.images
    };

    let updatedReviews;
    if (editingReview) {
      updatedReviews = reviews.map(review => 
        review.id === editingReview ? newReview : review
      );
      toast({
        title: "리뷰가 수정되었습니다",
      });
    } else {
      updatedReviews = [newReview, ...reviews];
      toast({
        title: "리뷰가 작성되었습니다",
      });
    }

    onReviewUpdate(updatedReviews);
    setShowReviewForm(false);
    setEditingReview(null);
    setReviewForm({
      rating: 5,
      title: '',
      content: '',
      images: []
    });
  };

  // 리뷰 삭제
  const handleDeleteReview = (reviewId: number) => {
    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    onReviewUpdate(updatedReviews);
    toast({
      title: "리뷰가 삭제되었습니다",
    });
  };

  // 리뷰 좋아요
  const handleLikeReview = (reviewId: number) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            likes: review.isLiked ? review.likes - 1 : review.likes + 1,
            isLiked: !review.isLiked 
          }
        : review
    );
    onReviewUpdate(updatedReviews);
  };

  // 리뷰 도움됨
  const handleHelpfulReview = (reviewId: number) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    );
    onReviewUpdate(updatedReviews);
    toast({
      title: "도움이 되었다고 표시했습니다",
    });
  };

  return (
    <div className="space-y-6">
      {/* 리뷰 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold mb-2">고객 리뷰</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {renderStars(Math.floor(productRating), 'md')}
              <span className="text-lg font-bold">{productRating}</span>
            </div>
            <span className="text-gray-600">{productReviewCount}개 리뷰</span>
          </div>
        </div>
        
        <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
          <DialogTrigger asChild>
            <Button>리뷰 작성</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingReview ? '리뷰 수정' : '리뷰 작성'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* 별점 선택 */}
              <div>
                <label className="block text-sm font-medium mb-2">평점</label>
                <div className="flex gap-1">
                  {Array(5).fill(0).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setReviewForm(prev => ({...prev, rating: idx + 1}))}
                      className="p-1"
                    >
                      <Star 
                        className={`h-6 w-6 ${
                          idx < reviewForm.rating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300 hover:text-yellow-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium mb-2">제목</label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({...prev, title: e.target.value}))}
                  className="w-full p-2 border rounded-md"
                  placeholder="리뷰 제목을 입력해주세요"
                />
              </div>

              {/* 내용 */}
              <div>
                <label className="block text-sm font-medium mb-2">내용</label>
                <Textarea
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm(prev => ({...prev, content: e.target.value}))}
                  placeholder="상품에 대한 솔직한 후기를 남겨주세요"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <DialogFooter className="sticky bottom-0 bg-white pt-4">
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                취소
              </Button>
              <Button onClick={handleSubmitReview}>
                <Send className="h-4 w-4 mr-2" />
                {editingReview ? '수정' : '작성'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 정렬 옵션 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">정렬:</span>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">최신순</SelectItem>
            <SelectItem value="oldest">오래된순</SelectItem>
            <SelectItem value="rating">평점순</SelectItem>
            <SelectItem value="helpful">도움순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* 리뷰 목록 */}
      <div className="space-y-6">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{review.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.user}</span>
                      {review.verified && (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          <Shield className="h-3 w-3 mr-1" />
                          구매확인
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    {review.title && (
                      <h4 className="font-medium mb-2">{review.title}</h4>
                    )}
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      {review.content}
                    </p>
                    
                    {/* 리뷰 액션 */}
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikeReview(review.id)}
                        className={`h-8 px-2 ${review.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                      >
                        <ThumbsUp className={`h-4 w-4 mr-1 ${review.isLiked ? 'fill-current' : ''}`} />
                        {review.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpfulReview(review.id)}
                        className="h-8 px-2 text-gray-500"
                      >
                        도움됨 {review.helpful}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 수정/삭제 메뉴 */}
                {review.userId === currentUserId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingReview(review.id);
                          setReviewForm({
                            rating: review.rating,
                            title: review.title,
                            content: review.content,
                            images: review.images
                          });
                          setShowReviewForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        수정
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">아직 리뷰가 없습니다</h3>
            <p className="text-sm">첫 번째 리뷰를 작성해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}