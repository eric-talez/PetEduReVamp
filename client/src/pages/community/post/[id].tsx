import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { 
  Eye, MessageSquare, Heart, Share2, Clock, Tag, 
  ChevronLeft, MoreHorizontal, ThumbsUp, Reply
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';

// 댓글 컴포넌트
const Comment = ({ comment, isReply = false, onReply, onDelete, onLike }) => {
  const { user } = useAuth();
  const formatDate = (date) => {
    return format(new Date(date), 'yyyy년 M월 d일 HH:mm', { locale: ko });
  };

  const canDelete = user && (user.id === comment.author.id || user.role === 'admin');

  return (
    <div className={`p-4 ${isReply ? 'ml-12 mt-2 bg-slate-50 dark:bg-slate-900 rounded-lg' : 'border-b'}`}>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{comment.author.name}</div>
            <div className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</div>
          </div>
        </div>
        {canDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDelete(comment.id)}>
                삭제하기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="mt-2 text-sm">
        {comment.isEdited && <span className="text-xs text-muted-foreground mr-1">(수정됨)</span>}
        {comment.content}
      </div>
      <div className="mt-2 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-xs gap-1"
          onClick={() => onLike(comment.id)}
        >
          <ThumbsUp className={`h-3.5 w-3.5 ${comment.userLiked ? 'fill-primary' : ''}`} />
          <span>{comment.likes || 0}</span>
        </Button>
        {!isReply && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs gap-1"
            onClick={() => onReply(comment.id)}
          >
            <Reply className="h-3.5 w-3.5" />
            <span>답글</span>
          </Button>
        )}
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <Comment 
              key={reply.id} 
              comment={reply} 
              isReply={true} 
              onDelete={onDelete}
              onLike={onLike}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 댓글 입력 컴포넌트
const CommentForm = ({ postId, parentId = null, onCancel = null }) => {
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest('POST', `/api/social/posts/${postId}/comments`, data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '댓글 작성 중 오류가 발생했습니다.');
      }
      return response.json();
    },
    onSuccess: () => {
      setContent('');
      if (onCancel) onCancel();
      queryClient.invalidateQueries({ queryKey: [`/api/social/posts/${postId}`] });
      toast({
        title: '댓글이 등록되었습니다.',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: '댓글 등록 실패',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: '로그인이 필요합니다',
        description: '댓글을 작성하려면 먼저 로그인해주세요.',
        variant: 'destructive'
      });
      setLocation('/auth');
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: '댓글 내용을 입력해주세요',
        variant: 'destructive'
      });
      return;
    }
    
    mutate({ content, parentId });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Textarea 
        placeholder={parentId ? "답글을 작성하세요..." : "댓글을 작성하세요..."} 
        value={content} 
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[80px]"
      />
      <div className="flex justify-end gap-2 mt-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isPending}
          >
            취소
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? '등록 중...' : '등록하기'}
        </Button>
      </div>
    </form>
  );
};

export default function PostDetailPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [replyingTo, setReplyingTo] = useState(null);
  
  // 게시글 상세 조회
  const { 
    data: post, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: [`/api/social/posts/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/social/posts/${id}`);
      if (!response.ok) {
        throw new Error('게시글을 불러오는데 실패했습니다.');
      }
      return response.json();
    }
  });

  // 게시글 좋아요 뮤테이션
  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/social/posts/${id}/like`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '좋아요 처리 중 오류가 발생했습니다.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/social/posts/${id}`] });
    },
    onError: (error) => {
      toast({
        title: '좋아요 실패',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // 댓글 좋아요 뮤테이션
  const commentLikeMutation = useMutation({
    mutationFn: async (commentId) => {
      const response = await apiRequest('POST', `/api/social/comments/${commentId}/like`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '좋아요 처리 중 오류가 발생했습니다.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/social/posts/${id}`] });
    },
    onError: (error) => {
      toast({
        title: '좋아요 실패',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // 댓글 삭제 뮤테이션
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const response = await apiRequest('DELETE', `/api/social/comments/${commentId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '댓글 삭제 중 오류가 발생했습니다.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/social/posts/${id}`] });
      toast({
        title: '댓글이 삭제되었습니다.',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: '댓글 삭제 실패',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleLike = () => {
    if (!user) {
      toast({
        title: '로그인이 필요합니다',
        description: '좋아요를 누르려면 먼저 로그인해주세요.',
        variant: 'destructive'
      });
      setLocation('/auth');
      return;
    }
    
    likeMutation.mutate();
  };

  const handleCommentLike = (commentId) => {
    if (!user) {
      toast({
        title: '로그인이 필요합니다',
        description: '좋아요를 누르려면 먼저 로그인해주세요.',
        variant: 'destructive'
      });
      setLocation('/auth');
      return;
    }
    
    commentLikeMutation.mutate(commentId);
  };

  const handleCommentDelete = (commentId) => {
    if (!user) return;
    
    if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.content?.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast({
            title: '공유하기 실패',
            description: '공유하기 기능을 사용할 수 없습니다.',
            variant: 'destructive',
          });
        }
      }
    } else {
      // 클립보드에 복사
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: '링크가 복사되었습니다',
          description: '원하는 곳에 붙여넣기 하세요.',
          variant: 'default',
        });
      } catch (error) {
        toast({
          title: '링크 복사 실패',
          description: '클립보드 접근 권한이 없습니다.',
          variant: 'destructive',
        });
      }
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), 'yyyy년 M월 d일 HH:mm', { locale: ko });
  };

  if (isLoading) {
    return (
      <div className="container py-6 max-w-4xl">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            뒤로
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-64 w-full rounded-lg mb-4" />
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full">
              <div className="flex gap-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-24 w-full mb-4" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-6 max-w-4xl">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => setLocation('/community')}
          >
            <ChevronLeft className="h-4 w-4" />
            뒤로
          </Button>
        </div>
        
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">게시글을 불러올 수 없습니다</h2>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : '게시글을 불러오는데 실패했습니다.'}
          </p>
          <Button onClick={() => setLocation('/community')}>
            게시글 목록으로 돌아가기
          </Button>
        </Card>
      </div>
    );
  }

  const canEdit = user && (user.id === post.author.id || user.role === 'admin');

  return (
    <div className="container py-6 max-w-4xl">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1"
          onClick={() => setLocation('/community')}
        >
          <ChevronLeft className="h-4 w-4" />
          뒤로
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            {canEdit && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLocation(`/community/edit/${id}`)}>
                    수정하기
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-500 focus:text-red-500"
                    onClick={() => {
                      if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
                        // 삭제 로직 구현
                      }
                    }}
                  >
                    삭제하기
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
            </div>
            
            {post.category && (
              <Badge variant="secondary">
                {post.category}
              </Badge>
            )}
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{post.viewCount || 0}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p>{post.content}</p>
            
            {post.image && (
              <img 
                src={post.image} 
                alt={post.title} 
                className="mt-4 rounded-lg max-h-[500px] object-contain"
              />
            )}
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag, index) => (
                <div key={index} className="inline-flex items-center text-sm text-blue-600">
                  <Tag className="h-4 w-4 mr-1" />
                  {tag}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <div className="flex justify-between w-full">
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 ${post.userLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{post.likes}</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={() => document.getElementById('comments-section').scrollIntoView({ behavior: 'smooth' })}
              >
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments}</span>
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              <span>공유하기</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <div id="comments-section" className="mt-8">
        <h2 className="text-xl font-bold mb-4">댓글 {post.comments || 0}개</h2>
        
        <Card>
          <CommentForm postId={id} />
          
          <Separator className="my-4" />
          
          {post.comments === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <MessageSquare className="mx-auto h-12 w-12 mb-2 opacity-20" />
              <p>아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
            </div>
          ) : (
            <div>
              {post.comments.map((comment) => (
                <div key={comment.id}>
                  <Comment 
                    comment={comment} 
                    onReply={(commentId) => setReplyingTo(commentId)}
                    onDelete={handleCommentDelete}
                    onLike={handleCommentLike}
                  />
                  
                  {replyingTo === comment.id && (
                    <div className="px-4 pb-4 ml-12">
                      <CommentForm 
                        postId={id} 
                        parentId={comment.id}
                        onCancel={() => setReplyingTo(null)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}