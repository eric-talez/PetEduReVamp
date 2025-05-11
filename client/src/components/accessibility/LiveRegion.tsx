import React, { useEffect, useRef } from 'react';

interface LiveRegionProps {
  /** 표시할 메시지 */
  message: string;
  /** ARIA 라이브 모드 */
  ariaLive?: 'polite' | 'assertive';
  /** 메시지가 한 번만 발표되어야 하는지 여부 */
  once?: boolean;
  /** 메시지가 발표된 후 지워야 하는지 여부 */
  clearAfter?: number;
  /** 시각적으로 숨기지 않을지 여부 */
  visible?: boolean;
}

/**
 * 라이브 리전 컴포넌트
 * 
 * 스크린 리더에 실시간으로 정보를 전달하는 ARIA 라이브 리전을 생성
 * 상태 업데이트, 오류 메시지, 비동기 작업 완료 등을 스크린 리더 사용자에게 알리는 데 사용
 */
const LiveRegion: React.FC<LiveRegionProps> = ({
  message,
  ariaLive = 'polite',
  once = false,
  clearAfter = 0,
  visible = false,
}) => {
  const regionRef = useRef<HTMLDivElement>(null);
  const announcedRef = useRef(false);

  useEffect(() => {
    // 메시지가 없거나, 한 번만 발표해야 하는데 이미 발표한 경우
    if (!message || (once && announcedRef.current)) {
      return;
    }

    // 메시지 설정
    if (regionRef.current) {
      regionRef.current.textContent = message;
      announcedRef.current = true;
    }

    // 지정된 시간 후 메시지 지우기
    if (clearAfter > 0) {
      const timeoutId = setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = '';
        }
      }, clearAfter);

      return () => clearTimeout(timeoutId);
    }
  }, [message, once, clearAfter]);

  // message가 변경될 때 현재 내용을 지우고 새 내용 설정을 위한 약간의 지연
  useEffect(() => {
    if (!regionRef.current || !message) return;

    // 메시지 변경 시 기존 내용 삭제
    regionRef.current.textContent = '';

    // 약간 지연 후 새 메시지 설정 (스크린 리더가 변경 감지하도록)
    const timeoutId = setTimeout(() => {
      if (regionRef.current) {
        regionRef.current.textContent = message;
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [message]);

  return (
    <div
      ref={regionRef}
      role="status"
      aria-live={ariaLive}
      aria-atomic="true"
      className={visible ? undefined : 'sr-only'}
    />
  );
};

export default LiveRegion;