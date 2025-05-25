import { useState, useEffect, useCallback } from 'react';
import { announceToScreenReader } from '@/components/a11y/AnnouncementRegion';

interface OfflineDetectionOptions {
  /**
   * 네트워크 상태 변경 시 알림 표시 여부
   */
  showNotifications?: boolean;
  
  /**
   * 스크린 리더에 상태 변경 알림 여부
   */
  announceToScreenReader?: boolean;
  
  /**
   * 오프라인 상태 감지 시 호출할 콜백 함수
   */
  onOffline?: () => void;
  
  /**
   * 온라인 상태 감지 시 호출할 콜백 함수
   */
  onOnline?: () => void;
}

/**
 * 오프라인 상태 감지 훅
 * 
 * 네트워크 연결 상태를 감지하고 오프라인 모드를 처리하는 훅입니다.
 * 오프라인 시 사용자에게 알림을 제공하고 온라인으로 돌아왔을 때 자동으로 데이터를 다시 로드할 수 있습니다.
 * 
 * @param options 오프라인 감지 옵션
 * @returns [isOffline, checkConnectivity] - 오프라인 상태 여부와 연결 상태 수동 확인 함수
 */
export function useOfflineDetection({
  showNotifications = true,
  announceToScreenReader: shouldAnnounce = true,
  onOffline,
  onOnline,
}: OfflineDetectionOptions = {}): [boolean, () => Promise<boolean>] {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  
  // 네트워크 상태 감지 및 처리
  const handleOnlineStatus = useCallback(
    (online: boolean) => {
      setIsOffline(!online);
      
      if (online) {
        // 온라인 상태로 전환
        if (showNotifications) {
          // 토스트 알림 표시 (토스트 컴포넌트가 구현되어 있다고 가정)
          if (typeof window !== 'undefined' && (window as any).toast) {
            (window as any).toast({
              title: '인터넷 연결 복원',
              description: '온라인 상태로 돌아왔습니다. 자동으로 데이터를 새로고침합니다.',
              variant: 'success',
              duration: 3000,
            });
          }
        }
        
        if (shouldAnnounce) {
          // 스크린 리더 알림
          announceToScreenReader('인터넷 연결이 복원되었습니다. 데이터를 새로고침합니다.', 'polite');
        }
        
        // 온라인 콜백 호출
        onOnline?.();
      } else {
        // 오프라인 상태로 전환
        if (showNotifications) {
          // 토스트 알림 표시
          if (typeof window !== 'undefined' && (window as any).toast) {
            (window as any).toast({
              title: '인터넷 연결 끊김',
              description: '오프라인 상태입니다. 일부 기능이 제한될 수 있습니다.',
              variant: 'destructive',
              duration: 5000,
            });
          }
        }
        
        if (shouldAnnounce) {
          // 스크린 리더 알림
          announceToScreenReader('인터넷 연결이 끊어졌습니다. 오프라인 모드로 전환합니다.', 'assertive');
        }
        
        // 오프라인 콜백 호출
        onOffline?.();
      }
    },
    [showNotifications, shouldAnnounce, onOffline, onOnline]
  );
  
  // 온라인 이벤트 핸들러
  const handleOnline = useCallback(() => {
    handleOnlineStatus(true);
  }, [handleOnlineStatus]);
  
  // 오프라인 이벤트 핸들러
  const handleOffline = useCallback(() => {
    handleOnlineStatus(false);
  }, [handleOnlineStatus]);
  
  // 네트워크 연결 상태 수동 확인 함수
  const checkConnectivity = useCallback(async (): Promise<boolean> => {
    try {
      // 간단한 헤더 요청으로 연결 확인
      const response = await fetch('/api/health-check', {
        method: 'HEAD',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      
      const online = response.ok;
      handleOnlineStatus(online);
      return online;
    } catch (error) {
      // 요청 실패 시 오프라인으로 간주
      handleOnlineStatus(false);
      return false;
    }
  }, [handleOnlineStatus]);
  
  // 이벤트 리스너 등록 및 초기 상태 설정
  useEffect(() => {
    // 브라우저 온라인/오프라인 이벤트 리스너 등록
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // 초기 연결 상태 확인
    const initialCheck = async () => {
      // navigator.onLine만으로는 정확하지 않을 수 있으므로 실제 요청으로 확인
      if (navigator.onLine) {
        await checkConnectivity();
      } else {
        setIsOffline(true);
      }
    };
    
    initialCheck();
    
    // 주기적인 연결 상태 확인 (60초마다)
    const intervalId = setInterval(() => {
      if (navigator.onLine) {
        checkConnectivity();
      }
    }, 60000);
    
    // 정리 함수
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [handleOnline, handleOffline, checkConnectivity]);
  
  return [isOffline, checkConnectivity];
}

/**
 * 오프라인 상태 표시 컴포넌트용 훅
 * 
 * 오프라인 상태와 함께 오프라인 지속 시간을 제공합니다.
 * 
 * @param options 오프라인 감지 옵션
 * @returns [isOffline, offlineDuration, checkConnectivity] - 오프라인 상태, 지속 시간(초), 연결 확인 함수
 */
export function useOfflineStatus(
  options: OfflineDetectionOptions = {}
): [boolean, number, () => Promise<boolean>] {
  const [isOffline, checkConnectivity] = useOfflineDetection(options);
  const [offlineStartTime, setOfflineStartTime] = useState<number | null>(null);
  const [offlineDuration, setOfflineDuration] = useState<number>(0);
  
  // 오프라인 지속 시간 추적
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isOffline) {
      // 오프라인 시작 시간 기록
      if (offlineStartTime === null) {
        setOfflineStartTime(Date.now());
      }
      
      // 1초마다 지속 시간 업데이트
      intervalId = setInterval(() => {
        if (offlineStartTime !== null) {
          const duration = Math.floor((Date.now() - offlineStartTime) / 1000);
          setOfflineDuration(duration);
        }
      }, 1000);
    } else {
      // 온라인 상태로 돌아오면 타이머 초기화
      setOfflineStartTime(null);
      setOfflineDuration(0);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isOffline, offlineStartTime]);
  
  return [isOffline, offlineDuration, checkConnectivity];
}