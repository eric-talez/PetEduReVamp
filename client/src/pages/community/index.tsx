import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BoardTable } from '@/components/community/BoardTable';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pagination } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, Eye, Clock, Tag, Plus, ArrowLeft, MoreVertical, Edit, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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
import { PostModal } from './PostModal';

// 컴포넌트를 작은 단위로 분리하여 관리
const PostCard = ({ post, onPostClick }) => {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const formatDate = (date: string | Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko });
  };

  // 작성자 여부 확인 - 테스트를 위해 모든 사용자에게 권한 부여
  const isAuthor = true;
  
  console.log('PostCard - user:', user);
  console.log('PostCard - isAuthor:', isAuthor);

  const handleEdit = (e) => {
    e.stopPropagation();
    // 편집 모달 열기 (나중에 구현)
    console.log('편집:', post.id);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        console.log('게시글 삭제 시도:', post.id);
        const response = await fetch(`/api/community/posts/${post.id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          window.location.reload(); // 간단한 새로고침
        } else {
          console.error('삭제 실패:', response.status);
        }
      } catch (error) {
        console.error('삭제 오류:', error);
      }
    }
  };

  return (
    <Card 
      className="h-full hover:shadow-md transition-shadow cursor-pointer relative" 
      onClick={() => onPostClick(post)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2 flex-1 pr-2">{post.title}</CardTitle>
          <div className="flex items-center gap-2">
            {post.isPinned && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                공지
              </Badge>
            )}
            {isAuthor && (
              <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    수정
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <CardDescription className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Avatar className="h-5 w-5">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <span>{post.author.name}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          {post.category && (
            <>
              <span>•</span>
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {post.category}
              </Badge>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.tags.map((tag, index) => (
              <div key={index} className="inline-flex items-center text-xs text-blue-600">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{post.viewCount || 0}</span>
          </div>
          <button 
            className="flex items-center gap-1 hover:text-red-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // 좋아요 기능 구현 예정
              console.log('좋아요 클릭:', post.id);
            }}
          >
            <Heart className="h-3.5 w-3.5" />
            <span>{post.likes}</span>
          </button>
          <button 
            className="flex items-center gap-1 hover:text-blue-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onPostClick(post); // 댓글을 보기 위해 모달 열기
            }}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{post.comments}</span>
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

// 로딩 중 상태를 보여주는 스켈레톤 컴포넌트
const PostCardSkeleton = () => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="pb-2">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
    <CardFooter className="pt-2">
      <Skeleton className="h-4 w-1/3" />
    </CardFooter>
  </Card>
);

// 필터 옵션 컴포넌트
const FilterOptions = ({ activeCategory, setActiveCategory, categories }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant={activeCategory === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setActiveCategory('all')}
      >
        전체
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

// 메인 커뮤니티 페이지 컴포넌트
export default function CommunityPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('latest');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "일반",
    tags: ""
  });

  // 게시글 작성 뮤테이션
  const createPostMutation = useMutation({
    mutationFn: async (postData: typeof newPost) => {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: postData.title,
          content: postData.content,
          tag: postData.tags,
          category: postData.category
        }),
      });
      
      if (!response.ok) {
        throw new Error('게시글 작성에 실패했습니다.');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // 게시글 목록 캐시 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
      
      toast({
        title: "게시글 작성 완료",
        description: "새 게시글이 성공적으로 작성되었습니다.",
      });
      
      // 폼 초기화
      setNewPost({
        title: "",
        content: "",
        category: "일반",
        tags: ""
      });
      setIsCreatePostOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "작성 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // 게시글 작성 함수
  const handleSubmitPost = () => {
    if (!newPost.title || !newPost.content) {
      toast({
        title: "입력 오류",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("새 게시글 작성:", newPost);
    createPostMutation.mutate(newPost);
  };
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  // 카테고리 목록 (글쓰기 페이지와 동일하게 통일)
  const categories = ['일반', '훈련팁', '건강관리', '행동교정', '영양정보', '놀이활동', '질문답변', '후기공유'];

  // 게시글 목록 조회 API 호출
  const {
    data: postsData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['/api/community/posts', activeTab, activeCategory, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
      });

      if (activeCategory !== 'all') {
        params.append('category', activeCategory);
      }

      if (activeTab === 'popular') {
        params.append('sort', 'popular');
      }

      // 새로운 커뮤니티 API 경로 사용
      const response = await fetch(`/api/community/posts?${params.toString()}`);
      if (!response.ok) {
        throw new Error('게시글을 불러오는데 실패했습니다.');
      }
      return await response.json();
    }
  });

  // 기존 페이지 이동 핸들러 제거 (모달로 대체)

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 게시글 클릭 핸들러
  const handlePostClick = async (post: any) => {
    try {
      const response = await fetch(`/api/community/posts/${post.id}`);
      if (response.ok) {
        const postData = await response.json();
        setSelectedPost(postData.post);
        setIsModalOpen(true);
      } else {
        toast({
          title: "오류",
          description: "게시글을 불러올 수 없습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "게시글을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 게시글 삭제
  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await fetch(`/api/community/posts/${postId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('게시글 삭제에 실패했습니다.');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "성공",
        description: "게시글이 삭제되었습니다.",
      });
      setIsModalOpen(false);
      setDeleteAlertOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "삭제 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeletePost = () => {
    if (selectedPost) {
      deletePostMutation.mutate(selectedPost.id);
    }
  };

  return (
    <div className="container py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">커뮤니티</h1>
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              글쓰기
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 게시글 작성</DialogTitle>
              <DialogDescription>
                커뮤니티에 새로운 게시글을 작성해보세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="post-title" className="text-right">
                  제목 *
                </Label>
                <Input
                  id="post-title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="col-span-3"
                  placeholder="게시글 제목을 입력하세요"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="post-category" className="text-right">
                  카테고리
                </Label>
                <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="일반">일반</SelectItem>
                    <SelectItem value="훈련팁">훈련팁</SelectItem>
                    <SelectItem value="건강관리">건강관리</SelectItem>
                    <SelectItem value="행동교정">행동교정</SelectItem>
                    <SelectItem value="영양정보">영양정보</SelectItem>
                    <SelectItem value="놀이활동">놀이활동</SelectItem>
                    <SelectItem value="질문답변">질문답변</SelectItem>
                    <SelectItem value="후기공유">후기공유</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="post-tags" className="text-right">
                  태그
                </Label>
                <Input
                  id="post-tags"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  className="col-span-3"
                  placeholder="태그를 쉼표로 구분하여 입력 (예: 골든리트리버, 기본훈련)"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="post-content" className="text-right pt-2">
                  내용 *
                </Label>
                <Textarea
                  id="post-content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="col-span-3"
                  placeholder="게시글 내용을 작성하세요"
                  rows={8}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmitPost}>
                게시글 작성
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        defaultValue="latest"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="latest">최신순</TabsTrigger>
          <TabsTrigger value="popular">인기순</TabsTrigger>
        </TabsList>

        <FilterOptions
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categories={categories}
        />

        <TabsContent value="latest" className="mt-0">
          {isLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border">
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">게시글을 불러오는 중...</p>
              </div>
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-2">오류가 발생했습니다</p>
              <p className="text-muted-foreground">{error instanceof Error ? error.message : '게시글을 불러오는데 실패했습니다.'}</p>
            </div>
          ) : postsData.posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl mb-2">게시글이 없습니다</p>
              <p className="text-muted-foreground mb-4">첫 번째 게시글을 작성해보세요!</p>
              <Button onClick={handleCreatePost}>
                <Plus className="h-4 w-4 mr-1" />
                글쓰기
              </Button>
            </div>
          ) : (
            <>
              <BoardTable 
                posts={postsData.posts}
                currentPage={currentPage}
                itemsPerPage={12}
                onPostClick={handlePostClick}
              />

              {postsData.pagination.totalPages > 1 && (
                <Pagination
                  className="mt-6 flex justify-center"
                  currentPage={currentPage}
                  totalPages={postsData.pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="popular" className="mt-0">
          {isLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border">
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">인기 게시글을 불러오는 중...</p>
              </div>
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-2">오류가 발생했습니다</p>
              <p className="text-muted-foreground">{error instanceof Error ? error.message : '게시글을 불러오는데 실패했습니다.'}</p>
            </div>
          ) : postsData.posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl mb-2">게시글이 없습니다</p>
              <p className="text-muted-foreground mb-4">첫 번째 게시글을 작성해보세요!</p>
              <Button onClick={handleCreatePost}>
                <Plus className="h-4 w-4 mr-1" />
                글쓰기
              </Button>
            </div>
          ) : (
            <>
              <BoardTable 
                posts={postsData.posts}
                currentPage={currentPage}
                itemsPerPage={12}
                onPostClick={handlePostClick}
              />

              {postsData.pagination.totalPages > 1 && (
                <Pagination
                  className="mt-6 flex justify-center"
                  currentPage={currentPage}
                  totalPages={postsData.pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* 게시글 상세 모달 */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDelete={handleDeletePost}
        />
      )}
    </div>
  );
}