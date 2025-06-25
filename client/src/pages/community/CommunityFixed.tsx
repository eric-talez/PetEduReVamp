import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

// 게시글 카드 컴포넌트
const PostCard = ({ post, onClick }: { post: any; onClick: (post: any) => void }) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ko });
    } catch {
      return post.user?.time || '방금 전';
    }
  };

  return (
    <Card className="h-full cursor-pointer hover:shadow-md transition-shadow" onClick={() => onClick(post)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
          {post.tag && (
            <Badge variant="secondary" className="ml-2 shrink-0">
              {post.tag.text || post.category}
            </Badge>
          )}
        </div>
        <CardDescription className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Avatar className="h-5 w-5">
              <AvatarImage src={post.user?.image} alt={post.user?.name} />
              <AvatarFallback>{post.user?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <span>{post.user?.name || '익명'}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>{post.likes || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{post.comments || 0}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

// 로딩 스켈레톤
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

// 메인 커뮤니티 페이지 컴포넌트
export default function CommunityPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "일반",
    tags: ""
  });

  // 게시글 목록 조회
  const { data: postsData = [], isLoading, error } = useQuery({
    queryKey: ['/api/community/posts'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/community/posts');
        if (!response.ok) {
          throw new Error('게시글을 불러올 수 없습니다');
        }
        const data = await response.json();
        console.log('API에서 받은 게시글 데이터:', data);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('게시글 조회 오류:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
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
          category: postData.category,
          tags: postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }),
      });

      if (!response.ok) {
        throw new Error('게시글 작성에 실패했습니다.');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
      
      toast({
        title: "게시글 작성 완료",
        description: "새 게시글이 성공적으로 작성되었습니다.",
      });

      setNewPost({
        title: "",
        content: "",
        category: "일반",
        tags: ""
      });
      setIsCreatePostOpen(false);
      setCurrentPage(1);
    },
    onError: (error: Error) => {
      toast({
        title: "작성 실패",
        description: error.message || "게시글 작성에 실패했습니다.",
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

    if (createPostMutation.isPending) {
      return;
    }

    createPostMutation.mutate(newPost);
  };

  // 검색 및 필터링
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 페이지네이션
  const itemsPerPage = 12;

  // 필터링된 게시글
  const filteredPosts = (Array.isArray(postsData) ? postsData : []).filter(post => {
    if (!post) return false;
    
    const matchesTab = activeTab === 'latest' ? true : 
                       activeTab === 'popular' ? (post.likes || 0) > 10 :
                       activeTab === 'notices' ? post.isNotice :
                       true;
    
    const matchesSearch = searchTerm === '' || 
      (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesTab && matchesSearch && matchesCategory;
  });

  // 페이지네이션 계산
  const totalItems = filteredPosts?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts?.slice(startIndex, startIndex + itemsPerPage) || [];

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 게시글 클릭 핸들러 (간단한 알림으로 처리)
  const handlePostClick = (post: any) => {
    toast({
      title: post.title,
      description: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
    });
  };

  const categories = ['일반', '훈련팁', '건강관리', '행동교정', '영양정보', '놀이활동', '질문답변', '후기공유'];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">커뮤니티</h1>
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              글쓰기
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 게시글 작성</DialogTitle>
              <DialogDescription>
                커뮤니티에 새로운 게시글을 작성하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="post-title" className="text-right">
                  제목
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
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="post-content" className="text-right pt-2">
                  내용
                </Label>
                <Textarea
                  id="post-content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="col-span-3 min-h-[120px]"
                  placeholder="게시글 내용을 입력하세요"
                />
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
                  placeholder="태그를 쉼표로 구분하여 입력하세요"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSubmitPost} disabled={createPostMutation.isPending}>
                {createPostMutation.isPending ? '작성 중...' : '게시'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="latest">최신 글</TabsTrigger>
          <TabsTrigger value="popular">인기 글</TabsTrigger>
          <TabsTrigger value="notices">공지사항</TabsTrigger>
        </TabsList>

        <TabsContent value="latest" className="mt-6">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="text-red-600 font-medium mb-2">게시글을 불러올 수 없습니다</div>
                <div className="text-red-500 text-sm">{error?.message || '알 수 없는 오류가 발생했습니다'}</div>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  새로고침
                </button>
              </div>
            </div>
          )}

          {!isLoading && !error && paginatedPosts && paginatedPosts.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPosts.map((post: any) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={handlePostClick}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!isLoading && !error && (!paginatedPosts || paginatedPosts.length === 0) && (
            <div className="text-center py-12">
              <p className="text-xl mb-2">게시글이 없습니다</p>
              <p className="text-muted-foreground mb-4">첫 번째 게시글을 작성해보세요!</p>
              <Button onClick={() => setIsCreatePostOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                글쓰기
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="popular" className="mt-6">
          <div className="text-center py-12">
            <p className="text-xl mb-2">인기 게시글</p>
            <p className="text-muted-foreground">좋아요가 많은 게시글들이 여기에 표시됩니다.</p>
          </div>
        </TabsContent>

        <TabsContent value="notices" className="mt-6">
          <div className="text-center py-12">
            <p className="text-xl mb-2">공지사항</p>
            <p className="text-muted-foreground">중요한 공지사항들이 여기에 표시됩니다.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}