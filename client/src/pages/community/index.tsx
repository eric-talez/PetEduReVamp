import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pagination } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, Eye, Clock, Tag, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

// 컴포넌트를 작은 단위로 분리하여 관리
const PostCard = ({ post }) => {
  const formatDate = (date: string | Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko });
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
          {post.isPinned && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              공지
            </Badge>
          )}
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

  // 카테고리 목록 (실제로는 서버에서 가져오거나 설정에서 관리할 수 있음)
  const categories = ['공지사항', '자유게시판', '질문/답변', '정보공유', '자랑하기', '모임'];

  // 게시글 목록 조회 API 호출
  const {
    data: postsData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['/api/test/posts', activeTab, activeCategory, currentPage],
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

      // 테스트 API 사용
      const backendUrl = window.location.origin.includes('replit') 
        ? window.location.origin.replace(':5173', '') 
        : 'http://localhost:5000';
      
      const response = await fetch(`${backendUrl}/api/test/posts?${params.toString()}`);
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
                  <Link key={post.id} href={`/community/post/${post.id}`}>
                    <a className="block h-full">
                      <PostCard post={post} />
                    </a>
                  </Link>
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
                  <Link key={post.id} href={`/community/post/${post.id}`}>
                    <a className="block h-full">
                      <PostCard post={post} />
                    </a>
                  </Link>
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
    </div>
  );
}