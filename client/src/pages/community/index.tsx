import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  DialogDescription
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
import { PostModal } from './PostModal';

// 컴포넌트를 작은 단위로 분리하여 관리
const PostCard = ({ post, onPostClick }) => {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const formatDate = (date: string | Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko });
  };

  // 작성자 여부 확인 - 테스트를 위해 로그인한 사용자에게 모든 권한 부여
  const isAuthor = !!user;

  const handleEdit = (e) => {
    e.stopPropagation();
    // 편집 모달 열기 (나중에 구현)
    console.log('편집:', post.id);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`/api/community/posts/${post.id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          window.location.reload(); // 간단한 새로고침
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
          <div className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{post.comments}</span>
          </div>
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
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  // 카테고리 목록 (실제로는 서버에서 가져오거나 설정에서 관리할 수 있음)
  const categories = ['공지사항', '자유게시판', '질문/답변', '정보공유', '자랑하기', '모임'];

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

  // 게시글 작성 페이지로 이동
  const handleCreatePost = () => {
    setLocation('/community/create');
  };

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
        <Button onClick={handleCreatePost} className="gap-1">
          <Plus className="h-4 w-4" />
          글쓰기
        </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(12).fill(0).map((_, index) => (
                <PostCardSkeleton key={index} />
              ))}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {postsData.posts.map((post) => (
                  <PostCard key={post.id} post={post} onPostClick={handlePostClick} />
                ))}
              </div>

              {postsData.pagination.totalPages > 1 && (
                <Pagination
                  className="mt-8 flex justify-center"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(12).fill(0).map((_, index) => (
                <PostCardSkeleton key={index} />
              ))}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {postsData.posts.map((post) => (
                  <PostCard key={post.id} post={post} onPostClick={handlePostClick} />
                ))}
              </div>

              {postsData.pagination.totalPages > 1 && (
                <Pagination
                  className="mt-8 flex justify-center"
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