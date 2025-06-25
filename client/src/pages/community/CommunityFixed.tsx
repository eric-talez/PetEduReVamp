import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, Eye, Clock, Tag, Plus, ArrowLeft, MoreVertical, Edit, Trash2, X, Search, Grid, List } from 'lucide-react';
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
function CommunityPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [viewType, setViewType] = useState<'card' | 'list'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
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
    onSuccess: (newPostData) => {
      console.log('새 게시글 데이터:', newPostData);
      
      // 즉시 캐시 업데이트 - 새 게시글을 기존 목록 앞에 추가
      queryClient.setQueryData(['/api/community/posts'], (oldData: any) => {
        console.log('기존 캐시 데이터:', oldData);
        if (Array.isArray(oldData)) {
          const updatedData = [newPostData, ...oldData];
          console.log('업데이트된 캐시 데이터:', updatedData);
          return updatedData;
        }
        return [newPostData];
      });
      
      // 캐시 무효화를 제거하고 수동 업데이트만 사용
      // queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
      
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
                       activeTab === 'training' ? post.category === '훈련팁' :
                       activeTab === 'survey' ? post.category === '설문' :
                       activeTab === 'info' ? post.category === '정보공유' :
                       true;
    
    const matchesSearch = searchQuery === '' || 
      (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.user?.name && post.user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
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

  // 게시글 클릭 핸들러 (상세보기 모달 열기)
  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setIsPostDetailOpen(true);
    
    // 샘플 댓글 데이터 설정
    setComments([
      {
        id: 1,
        user: {
          name: "댓글러",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
        },
        content: "좋은 정보 감사합니다! 우리 강아지에게도 적용해봐야겠어요.",
        likes: 3,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
        replies: []
      }
    ]);
  };

  // 댓글 작성 핸들러
  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      toast({
        title: "댓글 내용을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    // 새 댓글 객체 생성
    const newCommentObj = {
      id: Date.now(),
      user: {
        name: user?.name || "반려인",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
      },
      content: newComment,
      likes: 0,
      createdAt: new Date().toISOString(),
      replies: []
    };

    // 댓글 목록에 추가
    setComments(prev => [newCommentObj, ...prev]);

    // 선택된 게시글의 댓글 수 증가
    if (selectedPost) {
      const updatedPost = {
        ...selectedPost,
        comments: (selectedPost.comments || 0) + 1
      };
      setSelectedPost(updatedPost);

      // 캐시도 업데이트
      queryClient.setQueryData(['/api/community/posts'], (oldData: any) => {
        if (Array.isArray(oldData)) {
          return oldData.map(post => 
            post.id === selectedPost.id ? updatedPost : post
          );
        }
        return oldData;
      });
    }

    toast({
      title: "댓글 작성 완료",
      description: "댓글이 성공적으로 작성되었습니다.",
    });
    
    setNewComment('');
  };

  // 좋아요 토글 핸들러
  const handleLikeToggle = (postId: number) => {
    if (selectedPost) {
      const updatedPost = {
        ...selectedPost,
        likes: (selectedPost.likes || 0) + 1
      };
      setSelectedPost(updatedPost);

      // 캐시도 업데이트
      queryClient.setQueryData(['/api/community/posts'], (oldData: any) => {
        if (Array.isArray(oldData)) {
          return oldData.map(post => 
            post.id === postId ? updatedPost : post
          );
        }
        return oldData;
      });

      toast({
        title: "좋아요",
        description: "좋아요가 반영되었습니다.",
      });
    }
  };

  const categories = ['일반', '훈련팁', '설문', '정보공유', '건강관리', '행동교정', '영양정보', '놀이활동', '질문답변', '후기공유'];

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

      {/* 검색 및 뷰 컨트롤 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="게시글 제목, 내용, 작성자로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewType === 'card' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('card')}
          >
            <Grid className="h-4 w-4 mr-2" />
            카드형
          </Button>
          <Button
            variant={viewType === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('list')}
          >
            <List className="h-4 w-4 mr-2" />
            리스트
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="latest">최신 글</TabsTrigger>
          <TabsTrigger value="popular">인기 글</TabsTrigger>
          <TabsTrigger value="training">훈련팁</TabsTrigger>
          <TabsTrigger value="survey">설문</TabsTrigger>
          <TabsTrigger value="info">정보공유</TabsTrigger>
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
              {viewType === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedPosts.map((post: any) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onClick={handlePostClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedPosts.map((post: any) => (
                    <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePostClick(post)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {post.tag?.text || post.category}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {post.user?.name || '익명'} • {post.user?.time || '방금 전'}
                              </span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{post.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                <span>{post.likes || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>{post.comments || 0}</span>
                              </div>
                            </div>
                          </div>
                          <Avatar className="h-10 w-10 ml-4">
                            <AvatarImage src={post.user?.image} alt={post.user?.name} />
                            <AvatarFallback>{post.user?.name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

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
          {/* 인기 게시글 탭 내용 - 동일한 구조 사용 */}
          {!isLoading && !error && paginatedPosts && paginatedPosts.length > 0 ? (
            <>
              {viewType === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedPosts.map((post: any) => (
                    <PostCard key={post.id} post={post} onClick={handlePostClick} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedPosts.map((post: any) => (
                    <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePostClick(post)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {post.tag?.text || post.category}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {post.user?.name || '익명'} • {post.user?.time || '방금 전'}
                              </span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{post.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                <span>{post.likes || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>{post.comments || 0}</span>
                              </div>
                            </div>
                          </div>
                          <Avatar className="h-10 w-10 ml-4">
                            <AvatarImage src={post.user?.image} alt={post.user?.name} />
                            <AvatarFallback>{post.user?.name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl mb-2">인기 게시글이 없습니다</p>
              <p className="text-muted-foreground">좋아요가 10개 이상인 게시글이 여기에 표시됩니다.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="training" className="mt-6">
          {!isLoading && !error && paginatedPosts && paginatedPosts.length > 0 ? (
            <>
              {viewType === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedPosts.map((post: any) => (
                    <PostCard key={post.id} post={post} onClick={handlePostClick} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedPosts.map((post: any) => (
                    <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePostClick(post)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">훈련팁</Badge>
                              <span className="text-xs text-gray-500">
                                {post.user?.name || '익명'} • {post.user?.time || '방금 전'}
                              </span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{post.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                <span>{post.likes || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>{post.comments || 0}</span>
                              </div>
                            </div>
                          </div>
                          <Avatar className="h-10 w-10 ml-4">
                            <AvatarImage src={post.user?.image} alt={post.user?.name} />
                            <AvatarFallback>{post.user?.name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl mb-2">훈련팁이 없습니다</p>
              <p className="text-muted-foreground">펫 훈련 관련 팁과 노하우를 공유해주세요!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="survey" className="mt-6">
          {!isLoading && !error && paginatedPosts && paginatedPosts.length > 0 ? (
            <>
              {viewType === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedPosts.map((post: any) => (
                    <PostCard key={post.id} post={post} onClick={handlePostClick} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedPosts.map((post: any) => (
                    <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePostClick(post)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">설문</Badge>
                              <span className="text-xs text-gray-500">
                                {post.user?.name || '익명'} • {post.user?.time || '방금 전'}
                              </span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{post.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                <span>{post.likes || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>{post.comments || 0}</span>
                              </div>
                            </div>
                          </div>
                          <Avatar className="h-10 w-10 ml-4">
                            <AvatarImage src={post.user?.image} alt={post.user?.name} />
                            <AvatarFallback>{post.user?.name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl mb-2">설문이 없습니다</p>
              <p className="text-muted-foreground">커뮤니티 의견을 묻는 설문을 만들어보세요!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="info" className="mt-6">
          {!isLoading && !error && paginatedPosts && paginatedPosts.length > 0 ? (
            <>
              {viewType === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedPosts.map((post: any) => (
                    <PostCard key={post.id} post={post} onClick={handlePostClick} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedPosts.map((post: any) => (
                    <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePostClick(post)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">정보공유</Badge>
                              <span className="text-xs text-gray-500">
                                {post.user?.name || '익명'} • {post.user?.time || '방금 전'}
                              </span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{post.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                <span>{post.likes || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>{post.comments || 0}</span>
                              </div>
                            </div>
                          </div>
                          <Avatar className="h-10 w-10 ml-4">
                            <AvatarImage src={post.user?.image} alt={post.user?.name} />
                            <AvatarFallback>{post.user?.name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl mb-2">정보공유 게시글이 없습니다</p>
              <p className="text-muted-foreground">유용한 정보와 지식을 커뮤니티와 공유해주세요!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="notices" className="mt-6">
          {!isLoading && !error && paginatedPosts && paginatedPosts.length > 0 ? (
            <>
              {viewType === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedPosts.map((post: any) => (
                    <PostCard key={post.id} post={post} onClick={handlePostClick} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedPosts.map((post: any) => (
                    <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePostClick(post)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="destructive" className="text-xs">공지사항</Badge>
                              <span className="text-xs text-gray-500">
                                {post.user?.name || '관리자'} • {post.user?.time || '방금 전'}
                              </span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{post.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                <span>{post.likes || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>{post.comments || 0}</span>
                              </div>
                            </div>
                          </div>
                          <Avatar className="h-10 w-10 ml-4">
                            <AvatarImage src={post.user?.image} alt={post.user?.name} />
                            <AvatarFallback>{post.user?.name?.[0] || 'A'}</AvatarFallback>
                          </Avatar>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl mb-2">공지사항이 없습니다</p>
              <p className="text-muted-foreground">중요한 공지사항들이 여기에 표시됩니다.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 게시글 상세보기 모달 */}
      <Dialog open={isPostDetailOpen} onOpenChange={setIsPostDetailOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogDescription className="sr-only">
            게시글 상세 내용을 확인하고 댓글을 작성할 수 있습니다.
          </DialogDescription>
          {selectedPost && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {selectedPost.tag?.text || selectedPost.category}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {selectedPost.user?.time || '방금 전'}
                  </span>
                </div>
                <DialogTitle className="text-xl font-bold leading-tight">
                  {selectedPost.title}
                </DialogTitle>
                <div className="flex items-center gap-2 pt-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedPost.user?.image} alt={selectedPost.user?.name} />
                    <AvatarFallback>{selectedPost.user?.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{selectedPost.user?.name || '익명'}</p>
                    <p className="text-xs text-gray-500">
                      {selectedPost.createdAt ? new Date(selectedPost.createdAt).toLocaleDateString('ko-KR') : '날짜 정보 없음'}
                    </p>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="mt-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedPost.content}
                  </p>
                </div>
                
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600 hover:text-red-500"
                      onClick={() => handleLikeToggle(selectedPost.id)}
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      좋아요 {selectedPost.likes || 0}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-500">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      댓글 {selectedPost.comments || 0}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      공유
                    </Button>
                    <Button variant="outline" size="sm">
                      신고
                    </Button>
                  </div>
                </div>
                
                {/* 댓글 섹션 */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium mb-4">댓글 {selectedPost.comments || 0}개</h4>
                  
                  {/* 댓글 작성 */}
                  <div className="mb-4">
                    <Textarea 
                      placeholder="댓글을 작성해주세요..." 
                      className="mb-2"
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button size="sm" onClick={handleCommentSubmit}>댓글 작성</Button>
                    </div>
                  </div>
                  
                  {/* 댓글 목록 */}
                  <div className="space-y-4">
                    {comments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>아직 댓글이 없습니다.</p>
                        <p className="text-sm">첫 번째 댓글을 작성해보세요!</p>
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={comment.user.image} />
                              <AvatarFallback>{comment.user.name?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{comment.user.name}</span>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ko })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs h-6 px-2 hover:text-red-500"
                              onClick={() => {
                                // 댓글 좋아요 기능
                                const updatedComments = comments.map(c => 
                                  c.id === comment.id ? { ...c, likes: (c.likes || 0) + 1 } : c
                                );
                                setComments(updatedComments);
                                toast({
                                  title: "댓글 좋아요",
                                  description: "댓글에 좋아요를 눌렀습니다.",
                                });
                              }}
                            >
                              <Heart className="h-3 w-3 mr-1" />
                              {comment.likes || 0}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs h-6 px-2"
                              onClick={() => {
                                setReplyingTo(replyingTo === comment.id ? null : comment.id);
                                setReplyText('');
                              }}
                            >
                              답글
                            </Button>
                          </div>
                          
                          {/* 답글 작성 폼 */}
                          {replyingTo === comment.id && (
                            <div className="mt-3 ml-6 p-3 bg-white rounded-lg border">
                              <Textarea
                                placeholder="답글을 작성해주세요..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={2}
                                className="mb-2"
                              />
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText('');
                                  }}
                                >
                                  취소
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleReplySubmit(comment.id)}
                                >
                                  답글 작성
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {/* 답글 목록 */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-3 ml-6 space-y-3">
                              {comment.replies.map((reply: any) => (
                                <div key={reply.id} className="bg-white rounded-lg p-3 border-l-2 border-blue-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Avatar className="h-5 w-5">
                                      <AvatarImage src={reply.user.image} />
                                      <AvatarFallback>{reply.user.name?.[0] || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">{reply.user.name}</span>
                                    <span className="text-xs text-gray-500">
                                      {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: ko })}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {reply.content}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-xs h-5 px-2 hover:text-red-500"
                                      onClick={() => {
                                        // 답글 좋아요 기능
                                        setComments(prev => prev.map(c => 
                                          c.id === comment.id ? {
                                            ...c,
                                            replies: c.replies.map((r: any) => 
                                              r.id === reply.id ? { ...r, likes: (r.likes || 0) + 1 } : r
                                            )
                                          } : c
                                        ));
                                        toast({
                                          title: "답글 좋아요",
                                          description: "답글에 좋아요를 눌렀습니다.",
                                        });
                                      }}
                                    >
                                      <Heart className="h-3 w-3 mr-1" />
                                      {reply.likes || 0}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CommunityPage;