import { useState, useEffect, useCallback } from 'react';

interface IdleDetectionOptions {
  timeout: number; // 밀리초 단위의 유휴 시간 제한
  events?: string[]; // 감지할 이벤트 목록
  onIdle?: () => void; // 유휴 상태가 되었을 때 실행할 콜백
  onActive?: () => void; // 활성 상태로 돌아왔을 때 실행할 콜백
  debounce?: number; // 활동 이벤트 디바운스 시간 (밀리초)
}

/**
 * 사용자 유휴 상태를 감지하는 훅
 * 
 * 일정 시간 동안 사용자 활동이 없으면 유휴 상태로 전환합니다.
 * 자동 로그아웃, 화면 잠금, 리소스 절약 등에 유용합니다.
 * 
 * @param options 유휴 감지 옵션
 * @returns [isIdle, resetTimer] - 유휴 상태 여부와 타이머 재설정 함수
 */
export function useIdleDetection({
  timeout,
  events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'wheel'],
  onIdle,
  onActive,
  debounce = 200,
}: IdleDetectionOptions): [boolean, () => void] {
  const [isIdle, setIsIdle] = useState<boolean>(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [debounceTimerId, setDebounceTimerId] = useState<NodeJS.Timeout | null>(null);

  // 타이머 재설정 함수
  const resetTimer = useCallback(() => {
    const now = Date.now();
    
    // 마지막 활동 시간 업데이트
    setLastActivity(now);
    
    // 이미 유휴 상태였다면 활성 상태로 변경
    if (isIdle) {
      setIsIdle(false);
      onActive?.();
    }
    
    // 기존 타이머 제거
    if (timerId) {
      clearTimeout(timerId);
    }
    
    // 새 타이머 설정
    const newTimerId = setTimeout(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      
      // 마지막 활동 이후 타임아웃보다 더 많은 시간이 지났다면 유휴 상태로 전환
      if (timeSinceLastActivity >= timeout) {
        setIsIdle(true);
        onIdle?.();
      }
    }, timeout);
    
    setTimerId(newTimerId);
  }, [isIdle, lastActivity, onActive, onIdle, timeout, timerId]);

  // 사용자 활동 처리 함수 (디바운스 적용)
  const handleActivity = useCallback(() => {
    // 디바운스 적용: 이전 디바운스 타이머 취소
    if (debounceTimerId) {
      clearTimeout(debounceTimerId);
    }
    
    // 새 디바운스 타이머 설정
    const newDebounceTimerId = setTimeout(() => {
      resetTimer();
    }, debounce);
    
    setDebounceTimerId(newDebounceTimerId);
  }, [debounce, resetTimer]);

  // 이벤트 리스너 설정 및 초기 타이머 설정
  useEffect(() => {
    // 활동 이벤트 리스너 등록
    events.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity);
    });
    
    // 초기 타이머 설정
    resetTimer();

    // 클린업: 이벤트 리스너 및 타이머 제거
    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      
      if (timerId) {
        clearTimeout(timerId);
      }
      
      if (debounceTimerId) {
        clearTimeout(debounceTimerId);
      }
    };
  }, [events, handleActivity, resetTimer, timerId, debounceTimerId]);

  return [isIdle, resetTimer];
}