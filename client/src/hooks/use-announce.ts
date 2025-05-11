import { useCallback, useEffect, useRef } from 'react';

interface AnnounceOptions {
  /** 즉시(polite) 또는 중요(assertive) 메시지 설정 */
  ariaLive?: 'polite' | 'assertive';
  /** 메시지 지속 시간 (밀리초) */
  duration?: number;
  /** 중복 메시지도 발표할지 여부 */
  announceRepeats?: boolean;
}

/**
 * 스크린 리더 사용자를 위한 동적 메시지 발표 훅
 * 
 * 페이지 변경, 데이터 로딩 완료, 오류 발생 등의 상태 변화를 
 * 스크린 리더 사용자에게 알리는 데 사용할 수 있습니다.
 */
export function useAnnounce(options: AnnounceOptions = {}) {
  const {
    ariaLive = 'polite',
    duration = 500,
    announceRepeats = false,
  } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const messageRef = useRef<string>('');

  useEffect(() => {
    // 컴포넌트 마운트 시 announcer 요소 생성
    if (!containerRef.current) {
      const container = document.createElement('div');
      container.setAttribute('aria-live', ariaLive);
      container.setAttribute('aria-atomic', 'true');
      container.setAttribute('role', 'status');
      container.className = 'sr-only';  // 시각적으로 숨김
      document.body.appendChild(container);
      containerRef.current = container;
    }

    // 컴포넌트 언마운트 시 announcer 요소 제거
    return () => {
      if (containerRef.current) {
        document.body.removeChild(containerRef.current);
        containerRef.current = null;
      }
    };
  }, [ariaLive]);

  /**
   * 스크린 리더에 메시지 발표
   * 
   * @param message 발표할 메시지
   */
  const announce = useCallback(
    (message: string) => {
      // 컨테이너가 없거나 메시지가 비어있으면 종료
      if (!containerRef.current || !message) return;
      
      // 중복 메시지 처리
      if (!announceRepeats && message === messageRef.current) return;
      messageRef.current = message;

      // 메시지를 발표하기 위해 컨테이너 내용 업데이트
      containerRef.current.textContent = '';
      
      // 약간의 지연 후 메시지 설정 (스크린 리더가 변경 감지하도록)
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.textContent = message;
        }
      }, 10);

      // 지정된 시간 후 메시지 제거
      if (duration > 0) {
        setTimeout(() => {
          if (containerRef.current && containerRef.current.textContent === message) {
            containerRef.current.textContent = '';
          }
        }, duration);
      }
    },
    [announceRepeats, duration]
  );

  return { announce };
}

export default useAnnounce;