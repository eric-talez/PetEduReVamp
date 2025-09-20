import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Post } from '@/types/community';

/**
 * 날짜를 상대적 시간으로 포맷
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ko });
  } catch {
    return '방금 전';
  }
};

/**
 * 댓글 수 계산
 */
export const getCommentsCount = (comments: number | any[]): number => {
  return Array.isArray(comments) ? comments.length : (comments || 0);
};

/**
 * 페이지네이션 계산
 */
export const calculatePagination = (
  posts: Post[], 
  currentPage: number, 
  itemsPerPage: number
) => {
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  return {
    totalPages,
    paginatedPosts,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

/**
 * 검색 쿼리를 URL에 반영
 */
export const updateSearchUrl = (searchQuery: string) => {
  const url = new URL(window.location.href);
  if (searchQuery) {
    url.searchParams.set('q', searchQuery);
  } else {
    url.searchParams.delete('q');
  }
  window.history.replaceState({}, '', url.toString());
};

/**
 * URL에서 검색 쿼리 추출
 */
export const getSearchQueryFromUrl = (): string => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('q') || '';
};