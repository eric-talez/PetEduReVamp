import { useEffect, useRef } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface UseViewCounterOptions {
  itemId: string | number;
  itemType: 'post' | 'video' | 'profile' | 'product' | 'course';
  enabled?: boolean;
  delay?: number; // 조회수 증가까지의 지연시간 (초)
}

export function useViewCounter({ 
  itemId, 
  itemType, 
  enabled = true, 
  delay = 3 
}: UseViewCounterOptions) {
  const viewedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !itemId || viewedRef.current) return;

    // 세션 스토리지에서 중복 조회 확인
    const viewKey = `viewed_${itemType}_${itemId}`;
    const hasViewed = sessionStorage.getItem(viewKey);
    
    if (hasViewed) {
      viewedRef.current = true;
      return;
    }

    // 지연 후 조회수 증가
    timerRef.current = setTimeout(async () => {
      try {
        await apiRequest('POST', `/api/${itemType}s/${itemId}/view`, {});
        
        // 중복 조회 방지를 위해 세션에 기록
        sessionStorage.setItem(viewKey, 'true');
        viewedRef.current = true;
        
        console.log(`View recorded for ${itemType} ${itemId}`);
      } catch (error) {
        console.error('Failed to record view:', error);
      }
    }, delay * 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [itemId, itemType, enabled, delay]);

  // 컴포넌트 언마운트시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
}

// 조회수 포맷팅 유틸리티
export function formatViewCount(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
}