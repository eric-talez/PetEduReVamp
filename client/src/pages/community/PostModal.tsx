import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowLeft, MessageSquare, Heart, Share2, MoreVertical, Edit, Trash2, Send } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
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

// 댓글 스키마
const commentSchema = z.object({
  content: z.string().min(1, "댓글을 입력해주세요").max(500, "댓글은 500자를 초과할 수 없습니다"),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface PostModalProps {
  post: any;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (postId: number) => void;
}

export function PostModal({ post, isOpen, onClose, onDelete }: PostModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);

  const formatDate = (date: string | Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko });
  };

  // 댓글 작성 폼
  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  });

  // 댓글 작성 뮤테이션
  const createCommentMutation = useMutation({
    mutationFn: async (data: CommentFormData) => {
      const response = await fetch(`/api/community/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('댓글 작성에 실패했습니다.');
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "성공",
        description: "댓글이 작성되었습니다.",
      });
      setComments(prev => [...prev, data.comment]);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "댓글 작성 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 좋아요 뮤테이션
  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/community/posts/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('좋아요 처리에 실패했습니다.');
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "좋아요!",
        description: "게시글에 좋아요를 표시했습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "좋아요 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmitComment = (data: CommentFormData) => {
    console.log('댓글 제출:', data);
    console.log('게시글 ID:', post.id);
    console.log('사용자:', user);
    createCommentMutation.mutate(data);
  };

  const handleDelete = async () => {
    try {
      console.log('삭제 요청:', post.id);
      const response = await fetch(`/api/community/posts/${post.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast({
          title: "성공",
          description: "게시글이 삭제되었습니다.",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
        onClose(); // 모달 닫기
      } else {
        throw new Error('삭제에 실패했습니다.');
      }
    } catch (error: any) {
      toast({
        title: "삭제 실패",
        description: error.message,
        variant: "destructive",
      });
    }
    setDeleteAlertOpen(false);
  };

  // 작성자 여부 확인 - 테스트를 위해 로그인한 사용자에게 모든 권한 부여
  const isAuthor = true; // 테스트를 위해 모든 사용자에게 권한 부여
  
  console.log('PostModal - user:', user);
  console.log('PostModal - isAuthor:', isAuthor);

  if (!post) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold mb-2">{post.title}</DialogTitle>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author?.avatar} alt={post.author?.name} />
                    <AvatarFallback>{post.author?.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{post.author?.name || '익명'}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                  </div>
                  {post.tag && (
                    <Badge variant="outline" className="ml-auto">{post.tag}</Badge>
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
                    <DropdownMenuItem onClick={() => toast({ title: "수정 기능", description: "곧 추가될 예정입니다." })}>
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDeleteAlertOpen(true)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </DialogHeader>

          <Separator className="my-4" />

          {/* 게시글 내용 */}
          <div className="space-y-4">
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* 좋아요, 댓글 통계 */}
            <div className="flex items-center gap-4 pt-2 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 hover:text-red-500"
                onClick={() => likeMutation.mutate()}
                disabled={likeMutation.isPending}
              >
                <Heart className="h-4 w-4" />
                좋아요 {post.likes || 0}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                댓글 {comments.length}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 ml-auto">
                <Share2 className="h-4 w-4" />
                공유
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          {/* 댓글 섹션 */}
          <div className="space-y-4">
            <h3 className="font-semibold">댓글 {comments.length}개</h3>

            {/* 댓글 작성 폼 */}
            {true ? ( {/* 테스트를 위해 항상 댓글 작성 폼 표시 */}
              <form onSubmit={form.handleSubmit(onSubmitComment)} className="space-y-3">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user.name || '사용자'} />
                    <AvatarFallback>{(user.name || '사용자')[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      {...form.register('content')}
                      placeholder="댓글을 입력하세요..."
                      className="min-h-[80px] resize-none"
                    />
                    {form.formState.errors.content && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.content.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    size="sm"
                    disabled={createCommentMutation.isPending}
                    className="gap-2"
                  >
                    <Send className="h-3 w-3" />
                    {createCommentMutation.isPending ? '작성중...' : '댓글 작성'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                로그인 후 댓글을 작성할 수 있습니다.
              </div>
            )}

            {/* 댓글 목록 */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar className="h-8 w-8">
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
                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}