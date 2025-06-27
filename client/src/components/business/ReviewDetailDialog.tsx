import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Star, ThumbsUp, MessageCircle, Send, Reply, MoreVertical, Flag, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Review {
  id: string;
  authorName: string;
  authorImage?: string;
  rating: number;
  comment: string;
  date: string;
  helpful?: number;
  photos?: string[];
  isVerifiedPurchase?: boolean;
  businessResponse?: {
    content: string;
    date: string;
    author: string;
  };
}

interface Comment {
  id: string;
  author: string;
  authorImage?: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  replies: Reply[];
}

interface Reply {
  id: string;
  author: string;
  authorImage?: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
}

interface ReviewDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
  businessName: string;
}

export function ReviewDetailDialog({ 
  isOpen, 
  onClose, 
  review, 
  businessName 
}: ReviewDetailDialogProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      author: '박반려',
      authorImage: undefined,
      content: '정말 좋은 리뷰네요! 저도 같은 경험이 있었어요.',
      date: '2024-06-25T10:30:00Z',
      likes: 3,
      isLiked: false,
      replies: [
        {
          id: 'r1',
          author: '김고객',
          content: '맞아요! 정말 친절하게 설명해주시더라고요.',
          date: '2024-06-25T14:20:00Z',
          likes: 1,
          isLiked: true
        }
      ]
    },
    {
      id: 'c2',
      author: '이애견',
      content: '혹시 어떤 훈련 프로그램을 받으셨나요?',
      date: '2024-06-24T16:45:00Z',
      likes: 2,
      isLiked: true,
      replies: []
    }
  ]);
  
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isHelpful, setIsHelpful] = useState(false);
  const { toast } = useToast();

  if (!review) return null;

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c${Date.now()}`,
      author: '현재 사용자',
      content: newComment,
      date: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
    
    toast({
      title: "댓글 작성 완료",
      description: "댓글이 성공적으로 등록되었습니다."
    });
  };

  const handleAddReply = (commentId: string) => {
    if (!replyContent.trim()) return;

    const reply: Reply = {
      id: `r${Date.now()}`,
      author: '현재 사용자',
      content: replyContent,
      date: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ));

    setReplyContent('');
    setReplyingTo(null);
    
    toast({
      title: "답글 작성 완료",
      description: "답글이 성공적으로 등록되었습니다."
    });
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  const handleLikeReply = (commentId: string, replyId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? {
            ...comment,
            replies: comment.replies.map(reply =>
              reply.id === replyId
                ? {
                    ...reply,
                    isLiked: !reply.isLiked,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
                  }
                : reply
            )
          }
        : comment
    ));
  };

  const handleMarkHelpful = () => {
    setIsHelpful(!isHelpful);
    toast({
      title: isHelpful ? "도움이 안됨으로 표시" : "도움이 됨으로 표시",
      description: "피드백이 반영되었습니다."
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            리뷰 상세 - {businessName}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* 원본 리뷰 */}
            <div className="border-b pb-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={review.authorImage} />
                  <AvatarFallback>{review.authorName[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{review.authorName}</span>
                    {review.isVerifiedPurchase && (
                      <Badge variant="secondary" className="text-xs">
                        인증된 구매
                      </Badge>
                    )}
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.date), { 
                        addSuffix: true, 
                        locale: ko 
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm font-medium">{review.rating}.0</span>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {review.comment}
                  </p>
                  
                  {/* 리뷰 사진 */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                      {review.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`리뷰 사진 ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* 리뷰 액션 */}
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkHelpful}
                      className={`gap-2 ${isHelpful ? 'text-blue-600' : ''}`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${isHelpful ? 'fill-current' : ''}`} />
                      도움됨 {(review.helpful || 0) + (isHelpful ? 1 : 0)}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Flag className="w-4 h-4" />
                      신고
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* 업체 답변 */}
              {review.businessResponse && (
                <div className="mt-4 ml-16 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-600">업체 답변</Badge>
                    <span className="text-sm text-gray-600">{review.businessResponse.author}</span>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.businessResponse.date), { 
                        addSuffix: true, 
                        locale: ko 
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.businessResponse.content}</p>
                </div>
              )}
            </div>

            {/* 댓글 섹션 */}
            <div>
              <h3 className="font-semibold text-lg mb-4">
                댓글 {comments.length}개
              </h3>
              
              {/* 새 댓글 작성 */}
              <div className="flex gap-3 mb-6">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>나</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="댓글을 입력하세요..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="mb-2"
                  />
                  <div className="flex justify-end">
                    <Button 
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      댓글 작성
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="mb-4" />

              {/* 댓글 목록 */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    {/* 댓글 */}
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.authorImage} />
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(comment.date), { 
                              addSuffix: true, 
                              locale: ko 
                            })}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2">
                          {comment.content}
                        </p>
                        
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeComment(comment.id)}
                            className={`h-auto p-1 gap-1 ${comment.isLiked ? 'text-red-500' : ''}`}
                          >
                            <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                            <span className="text-xs">{comment.likes}</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="h-auto p-1 gap-1"
                          >
                            <Reply className="w-3 h-3" />
                            <span className="text-xs">답글</span>
                          </Button>
                        </div>
                        
                        {/* 답글 작성 */}
                        {replyingTo === comment.id && (
                          <div className="mt-3 flex gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">나</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <Input
                                placeholder="답글을 입력하세요..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="mb-2"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAddReply(comment.id);
                                  }
                                }}
                              />
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setReplyingTo(null)}
                                >
                                  취소
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleAddReply(comment.id)}
                                  disabled={!replyContent.trim()}
                                >
                                  답글 작성
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 답글 목록 */}
                    {comment.replies.length > 0 && (
                      <div className="ml-8 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={reply.authorImage} />
                              <AvatarFallback className="text-xs">{reply.author[0]}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{reply.author}</span>
                                <span className="text-xs text-gray-500">
                                  {formatDistanceToNow(new Date(reply.date), { 
                                    addSuffix: true, 
                                    locale: ko 
                                  })}
                                </span>
                              </div>
                              
                              <p className="text-sm text-gray-700 mb-2">
                                {reply.content}
                              </p>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLikeReply(comment.id, reply.id)}
                                className={`h-auto p-1 gap-1 ${reply.isLiked ? 'text-red-500' : ''}`}
                              >
                                <Heart className={`w-3 h-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                                <span className="text-xs">{reply.likes}</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}