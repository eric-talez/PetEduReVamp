
import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  MessageSquare, 
  Eye, 
  Clock, 
  Tag,
  ThumbsUp,
  Reply,
  MoreVertical,
  Edit,
  Trash2,
  Send
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { queryClient } from '@/lib/queryClient';

interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  viewCount: number;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isPinned?: boolean;
}

interface PostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
}

export const PostModal: React.FC<PostModalProps> = ({ 
  post, 
  isOpen, 
  onClose, 
  onDelete 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // 댓글 목록 조회
  const { data: commentsData, isLoading: isCommentsLoading } = useQuery({
    queryKey: [`/api/community/posts/${post?.id}/comments`],
    enabled: !!post?.id && isOpen,
    queryFn: async () => {
      const response = await fetch(`/api/community/posts/${post?.id}/comments`);
      if (!response.ok) throw new Error('댓글을 불러올 수 없습니다.');
      return await response.json();
    }
  });

  // 좋아요 토글
  const likeMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('좋아요 처리에 실패했습니다.');
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "오류",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // 댓글 작성
  const commentMutation = useMutation({
    mutationFn: async (commentData: { postId: number; content: string }) => {
      const response = await fetch(`/api/community/posts/${commentData.postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentData.content })
      });
      if (!response.ok) throw new Error('댓글 작성에 실패했습니다.');
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/community/posts/${post?.id}/comments`] });
      setNewComment('');
      toast({
        title: "성공",
        description: "댓글이 작성되었습니다.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "댓글 작성 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const formatDate = (date: string | Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko });
  };

  const handleLike = () => {
    if (!post) return;
    likeMutation.mutate(post.id);
  };

  const handleSubmitComment = async () => {
    if (!post || !newComment.trim()) return;
    
    setIsSubmittingComment(true);
    try {
      await commentMutation.mutateAsync({
        postId: post.id,
        content: newComment.trim()
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const isAuthor = user && post && user.id === post.author.id;

  if (!post) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold leading-tight pr-4">
                  {post.title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  {post.isPinned && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      공지
                    </Badge>
                  )}
                </div>
              </div>
              {isAuthor && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      수정
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setShowDeleteAlert(true)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4">
            {/* 작성자 정보 */}
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {formatDate(post.createdAt)}
                  {post.updatedAt && post.updatedAt !== post.createdAt && (
                    <span>(수정됨)</span>
                  )}
                </div>
              </div>
            </div>

            {/* 게시글 내용 */}
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {post.content}
              </div>
            </div>

            {/* 태그 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <div key={index} className="inline-flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {/* 게시글 통계 및 액션 */}
            <div className="flex items-center justify-between py-3 border-t border-b">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>조회 {post.viewCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>댓글 {post.comments}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`flex items-center gap-1 ${post.isLiked ? 'text-red-500' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </Button>
              </div>
            </div>

            {/* 댓글 섹션 */}
            <div className="space-y-4">
              <h3 className="font-semibold">댓글 {commentsData?.comments?.length || 0}개</h3>
              
              {/* 댓글 작성 */}
              {user && (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={user.avatar} alt={user.userName} />
                      <AvatarFallback>{user.userName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="댓글을 작성해주세요..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim() || isSubmittingComment}
                      size="sm"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      {isSubmittingComment ? '작성 중...' : '댓글 작성'}
                    </Button>
                  </div>
                  <Separator />
                </div>
              )}

              {/* 댓글 목록 */}
              <div className="space-y-4">
                {isCommentsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : commentsData?.comments?.length > 0 ? (
                  commentsData.comments.map((comment: Comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                        <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.author.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <div className="text-sm leading-relaxed mb-2">
                          {comment.content}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {comment.likes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <Reply className="h-3 w-3 mr-1" />
                            답글
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete?.();
                setShowDeleteAlert(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
