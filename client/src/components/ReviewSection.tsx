import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Star, ThumbsUp, MessageCircle, MoreHorizontal, Send } from 'lucide-react';

interface Review {
  id: number;
  rating: number;
  title: string;
  content: string;
  tags: string[];
  authorName: string;
  createdAt: string;
  helpful: number;
  verified: boolean;
  consultationId?: string;
}

interface Comment {
  id: number;
  content: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  likes: number;
  replies: Comment[];
}

interface ReviewSectionProps {
  parentType: string;
  parentId: string;
  showWriteReview?: boolean;
}

export function ReviewSection({ parentType, parentId, showWriteReview = false }: ReviewSectionProps) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

  // 리뷰 목록 로딩
  useEffect(() => {
    loadReviews();
  }, [parentType, parentId]);

  const loadReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?${parentType}=${parentId}`);
      const result = await response.json();
      
      if (result.success) {
        setReviews(result.reviews);
        
        // 각 리뷰에 대한 댓글 로딩
        for (const review of result.reviews) {
          loadComments(review.id.toString());
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('리뷰 로딩 오류:', error);
      setLoading(false);
    }
  };

  const loadComments = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/comments?parentType=review&parentId=${reviewId}`);
      const result = await response.json();
      
      if (result.success) {
        setComments(prev => ({
          ...prev,
          [reviewId]: result.comments
        }));
      }
    } catch (error) {
      console.error('댓글 로딩 오류:', error);
    }
  };

  const handleAddComment = async (reviewId: string) => {
    const content = newComment[reviewId];
    if (!content?.trim()) {
      toast({
        title: "댓글 내용을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentType: 'review',
          parentId: reviewId,
          content: content
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "댓글이 작성되었습니다",
        });
        
        // 댓글 목록 새로고침
        loadComments(reviewId);
        
        // 입력창 초기화
        setNewComment(prev => ({
          ...prev,
          [reviewId]: ''
        }));
      } else {
        throw new Error(result.error || '댓글 작성 실패');
      }
    } catch (error) {
      toast({
        title: "댓글 작성 실패",
        description: "댓글 작성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const toggleComments = (reviewId: string) => {
    setShowComments(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">리뷰를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 리뷰 통계 */}
      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              사용자 후기 ({reviews.length}개)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold">
                {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
              </div>
              <div className="flex">
                {renderStars(Math.round(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length))}
              </div>
              <div className="text-sm text-muted-foreground">
                {reviews.length}개 리뷰 기준
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 리뷰 목록 */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* 리뷰 헤더 */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          인증된 리뷰
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{review.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{review.authorName}</span>
                      <span>•</span>
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* 리뷰 내용 */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {review.content}
                </p>

                {/* 태그 */}
                {review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {review.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* 리뷰 액션 */}
                <div className="flex items-center gap-4 pt-2 border-t">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ThumbsUp className="w-4 h-4" />
                    도움됨 ({review.helpful})
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => toggleComments(review.id.toString())}
                  >
                    <MessageCircle className="w-4 h-4" />
                    댓글 ({comments[review.id]?.length || 0})
                  </Button>
                </div>

                {/* 댓글 섹션 */}
                {showComments[review.id] && (
                  <div className="space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    {/* 기존 댓글 */}
                    {comments[review.id]?.map((comment) => (
                      <div key={comment.id} className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{comment.authorName}</span>
                          <Badge variant="outline" className="text-xs">
                            {comment.authorRole === 'trainer' ? '훈련사' : '견주'}
                          </Badge>
                          <span className="text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-xs h-6">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {comment.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs h-6">
                            답글
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* 댓글 작성 */}
                    <div className="space-y-2">
                      <Textarea
                        placeholder="댓글을 입력하세요..."
                        value={newComment[review.id] || ''}
                        onChange={(e) => setNewComment(prev => ({
                          ...prev,
                          [review.id]: e.target.value
                        }))}
                        rows={2}
                        className="text-sm"
                      />
                      <div className="flex justify-end">
                        <Button 
                          size="sm" 
                          onClick={() => handleAddComment(review.id.toString())}
                        >
                          <Send className="w-3 h-3 mr-1" />
                          댓글 작성
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 리뷰 없음 상태 */}
      {reviews.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              아직 리뷰가 없습니다
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              첫 번째 리뷰를 남겨보세요!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}