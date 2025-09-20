import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { AppLayout } from '@/layout/AppLayout';
import { LoadingErrorWrapper } from '@/components/ui/loading-error-wrapper';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

// 컴포넌트 import
import TabNavigation from '@/components/community/TabNavigation';
import SearchSection from '@/components/community/SearchSection';
import PostsGrid from '@/components/community/PostsGrid';
import Pagination from '@/components/community/Pagination';
import CreatePostForm from '@/components/community/CreatePostForm';

// 훅과 유틸리티 import
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { calculatePagination, updateSearchUrl, getSearchQueryFromUrl } from '@/utils/communityHelpers';

// 타입 import
import { TabValue, ViewType, Post, NewPost } from '@/types/community';
import { getStatusCodeFromError } from '@/lib/errorHelpers';
// import { apiRequest } from '@/lib/queryClient'; // 제거됨

const ITEMS_PER_PAGE = 8;
const CATEGORIES = ['일반', '훈련팁', '건강', '행동교정', '사회화', '질문', '후기'];

const CommunityPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 상태 관리
  const [activeTab, setActiveTab] = useState<TabValue>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState<ViewType>('card');
  const [searchQuery, setSearchQuery] = useState(getSearchQueryFromUrl());
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);

  // 새 게시글 상태
  const [newPost, setNewPost] = useState<NewPost>({
    title: "",
    content: "",
    category: "일반",
    tags: "",
    linkUrl: "",
    linkTitle: "",
    linkDescription: "",
    linkImage: ""
  });

  // URL 파라미터 변경 감지
  useEffect(() => {
    const newSearchQuery = getSearchQueryFromUrl();
    if (newSearchQuery !== searchQuery) {
      setSearchQuery(newSearchQuery);
    }
  }, []);

  // 탭 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // 데이터 fetch
  const { data: postsData = [], isLoading, error } = useCommunityPosts({
    activeTab,
    searchQuery
  });

  // 페이지네이션 계산
  const { totalPages, paginatedPosts } = useMemo(() => 
    calculatePagination(postsData, currentPage, ITEMS_PER_PAGE),
    [postsData, currentPage]
  );

  // 게시글 생성 mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: NewPost) => {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        throw new Error('게시글 작성에 실패했습니다.');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "게시글이 성공적으로 작성되었습니다.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
      setIsCreatePostOpen(false);
      setNewPost({
        title: "",
        content: "",
        category: "일반",
        tags: "",
        linkUrl: "",
        linkTitle: "",
        linkDescription: "",
        linkImage: ""
      });
    },
    onError: (error) => {
      const statusCode = getStatusCodeFromError(error);
      toast({
        title: "게시글 작성에 실패했습니다.",
        description: statusCode === 401 ? "로그인이 필요합니다." : "다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  // 이벤트 핸들러
  const handleTabChange = useCallback((tab: TabValue) => {
    setActiveTab(tab);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSearch = useCallback(() => {
    updateSearchUrl(searchQuery);
    setCurrentPage(1);
  }, [searchQuery]);

  const handleViewTypeChange = useCallback((type: ViewType) => {
    setViewType(type);
  }, []);

  const handleCreatePost = useCallback(() => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다.",
        description: "게시글을 작성하려면 로그인해주세요.",
        variant: "destructive",
      });
      return;
    }
    setIsCreatePostOpen(true);
  }, [user, toast]);

  const handleSubmitPost = useCallback(() => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "필수 정보가 누락되었습니다.",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    createPostMutation.mutate(newPost);
  }, [newPost, createPostMutation, toast]);

  const handlePostClick = useCallback((post: Post) => {
    setSelectedPost(post);
    setIsPostDetailOpen(true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">커뮤니티</h1>
        </div>

        {/* 탭 네비게이션 */}
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* 검색 및 뷰 설정 */}
        <SearchSection
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          viewType={viewType}
          onViewTypeChange={handleViewTypeChange}
          onCreatePost={handleCreatePost}
          isAuthenticated={!!user}
        />

        {/* 게시글 목록 */}
        <LoadingErrorWrapper 
          isLoading={isLoading} 
          isError={!!error}
          error={error}
          loadingMessage="게시글을 불러오는 중..."
          errorMessage="게시글을 불러올 수 없습니다."
        >
          <PostsGrid
            posts={paginatedPosts}
            viewType={viewType}
            onPostClick={handlePostClick}
            isLoading={isLoading}
          />
        </LoadingErrorWrapper>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-8"
          />
        )}

        {/* 게시글 작성 다이얼로그 */}
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 게시글 작성</DialogTitle>
            </DialogHeader>
            <CreatePostForm
              post={newPost}
              onPostChange={setNewPost}
              onSubmit={handleSubmitPost}
              onCancel={() => setIsCreatePostOpen(false)}
              isLoading={createPostMutation.isPending}
              categories={CATEGORIES}
            />
          </DialogContent>
        </Dialog>

        {/* 게시글 상세 다이얼로그 (기본 구현) */}
        <Dialog open={isPostDetailOpen} onOpenChange={setIsPostDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPost?.title}</DialogTitle>
            </DialogHeader>
            {selectedPost && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{selectedPost.author?.name}</span>
                  <span>•</span>
                  <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="prose max-w-none">
                  <p>{selectedPost.content}</p>
                </div>
                {selectedPost.linkInfo && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium">{selectedPost.linkInfo.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{selectedPost.linkInfo.description}</p>
                    <a 
                      href={selectedPost.linkInfo.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      {selectedPost.linkInfo.url}
                    </a>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default CommunityPage;