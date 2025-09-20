import { useQuery } from '@tanstack/react-query';
import { TabValue, Post } from '@/types/community';

interface UseCommunityPostsProps {
  activeTab: TabValue;
  searchQuery: string;
}

export const useCommunityPosts = ({ activeTab, searchQuery }: UseCommunityPostsProps) => {
  return useQuery({
    queryKey: ['/api/community/posts', activeTab, searchQuery],
    queryFn: async (): Promise<Post[]> => {
      try {
        let url = '/api/community/posts';
        const params = new URLSearchParams();
        
        // 검색 쿼리 추가
        if (searchQuery) {
          params.append('q', searchQuery);
        }
        
        // 탭별 카테고리 필터링
        if (activeTab === 'training') {
          params.append('category', '훈련팁');
        } else if (activeTab === 'survey') {
          params.append('category', '설문');
        } else if (activeTab === 'info') {
          params.append('category', '정보공유');
        } else if (activeTab === 'notices') {
          params.append('category', '공지사항');
        } else if (activeTab === 'popular') {
          params.append('sort', 'popular');
        }
        
        if (params.toString()) {
          url += '?' + params.toString();
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('게시글을 불러올 수 없습니다');
        }
        const data = await response.json();
        
        // 개발 모드에서만 API 데이터 로깅
        if (import.meta.env.DEV) {
          console.log(`API에서 받은 게시글 데이터 (${activeTab}):`, data);
        }
        
        // API 응답의 posts 배열을 반환
        return Array.isArray(data.posts) ? data.posts : [];
      } catch (error) {
        console.error('게시글 조회 오류:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
};