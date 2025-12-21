import { useCallback, useRef, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

type EventType = 'view' | 'watch' | 'like' | 'comment' | 'follow' | 'share';
type TargetType = 'course' | 'video' | 'trainer' | 'content';

interface TrackingOptions {
  userId?: number;
  targetType: TargetType;
  targetId?: number | string;
}

export function useEngagementTracking(options: TrackingOptions) {
  const { targetType, targetId } = options;
  const watchTimeRef = useRef(0);
  const lastUpdateRef = useRef(0);
  const isTrackingRef = useRef(false);
  const hasRecordedViewRef = useRef(false);

  const recordEvent = useCallback(async (eventType: EventType, value?: number) => {
    try {
      await apiRequest('POST', '/api/monetization/events', {
        targetType,
        targetId: targetId ? Number(targetId) : null,
        eventType,
        value: value ?? 1,
      });
    } catch (error) {
      console.error('Failed to record event:', error);
    }
  }, [targetType, targetId]);

  const recordView = useCallback(async () => {
    if (hasRecordedViewRef.current) return;
    hasRecordedViewRef.current = true;
    await recordEvent('view');
  }, [recordEvent]);

  const recordLike = useCallback(async () => {
    await recordEvent('like');
  }, [recordEvent]);

  const recordComment = useCallback(async () => {
    await recordEvent('comment');
  }, [recordEvent]);

  const recordShare = useCallback(async () => {
    await recordEvent('share');
  }, [recordEvent]);

  const startWatchTracking = useCallback(() => {
    if (isTrackingRef.current) return;
    isTrackingRef.current = true;
    lastUpdateRef.current = Date.now();
  }, []);

  const pauseWatchTracking = useCallback(async () => {
    if (!isTrackingRef.current) return;
    
    const now = Date.now();
    const elapsed = Math.floor((now - lastUpdateRef.current) / 1000);
    watchTimeRef.current += elapsed;
    isTrackingRef.current = false;

    if (watchTimeRef.current > 0) {
      await recordEvent('watch', watchTimeRef.current);
      watchTimeRef.current = 0;
    }
  }, [recordEvent]);

  const updateWatchTime = useCallback(async () => {
    if (!isTrackingRef.current) return;
    
    const now = Date.now();
    const elapsed = Math.floor((now - lastUpdateRef.current) / 1000);
    
    if (elapsed >= 30) {
      watchTimeRef.current += elapsed;
      lastUpdateRef.current = now;
      
      if (watchTimeRef.current >= 30) {
        await recordEvent('watch', watchTimeRef.current);
        watchTimeRef.current = 0;
      }
    }
  }, [recordEvent]);

  useEffect(() => {
    const interval = setInterval(updateWatchTime, 30000);
    
    return () => {
      clearInterval(interval);
      if (isTrackingRef.current && watchTimeRef.current > 0) {
        recordEvent('watch', watchTimeRef.current);
      }
    };
  }, [updateWatchTime, recordEvent]);

  useEffect(() => {
    hasRecordedViewRef.current = false;
    watchTimeRef.current = 0;
    isTrackingRef.current = false;
  }, [targetId]);

  return {
    recordView,
    recordLike,
    recordComment,
    recordShare,
    startWatchTracking,
    pauseWatchTracking,
  };
}
