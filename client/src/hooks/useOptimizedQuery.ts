import { useQuery, QueryKey, UseQueryOptions } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

// 최적화된 쿼리 훅
export function useOptimizedQuery<T = unknown>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const query = useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (failureCount < maxRetries) {
        setRetryCount(failureCount + 1);
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    ...options
  });

  // 에러 리셋 함수
  const resetError = useCallback(() => {
    setRetryCount(0);
    query.refetch();
  }, [query]);

  return {
    ...query,
    retryCount,
    resetError,
    isRetrying: query.isError && retryCount > 0
  };
}

// 인피니트 스크롤용 최적화된 훅
export function useOptimizedInfiniteQuery<T = unknown>(
  queryKey: QueryKey,
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<{
    data: T[];
    nextPage?: number;
    hasMore: boolean;
  }>,
  options?: any
) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const query = useQuery({
    queryKey,
    queryFn: () => queryFn({ pageParam: 1 }),
    staleTime: 2 * 60 * 1000, // 2분
    cacheTime: 5 * 60 * 1000, // 5분
    ...options
  });

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !query.data?.hasMore) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = query.data?.nextPage || 2;
      const newData = await queryFn({ pageParam: nextPage });
      
      // 데이터 병합 로직은 외부에서 처리
      return newData;
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, query.data, queryFn]);

  return {
    ...query,
    loadMore,
    isLoadingMore,
    hasMore: query.data?.hasMore || false
  };
}

// 실시간 데이터용 폴링 훅
export function useRealtimeQuery<T = unknown>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: {
    pollingInterval?: number;
    enabled?: boolean;
  }
) {
  const { pollingInterval = 30000, enabled = true } = options || {};

  return useQuery({
    queryKey,
    queryFn,
    refetchInterval: enabled ? pollingInterval : false,
    refetchIntervalInBackground: false,
    staleTime: 0, // 항상 최신 데이터 요청
    cacheTime: 1 * 60 * 1000, // 1분
    enabled
  });
}

// 조건부 쿼리 훅
export function useConditionalQuery<T = unknown>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  condition: boolean,
  options?: UseQueryOptions<T>
) {
  return useQuery({
    queryKey,
    queryFn,
    enabled: condition,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    ...options
  });
}

// 배치 쿼리 훅 (여러 쿼리를 한 번에 처리)
export function useBatchQueries<T = unknown>(
  queries: Array<{
    queryKey: QueryKey;
    queryFn: () => Promise<T>;
    options?: UseQueryOptions<T>;
  }>
) {
  const results = queries.map(({ queryKey, queryFn, options }) =>
    useOptimizedQuery(queryKey, queryFn, options)
  );

  const isLoading = results.some(result => result.isLoading);
  const isError = results.some(result => result.isError);
  const allSuccess = results.every(result => result.isSuccess);

  return {
    results,
    isLoading,
    isError,
    allSuccess,
    data: results.map(result => result.data)
  };
}