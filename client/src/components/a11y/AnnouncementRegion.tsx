import React, { useState, useEffect, useRef, useCallback } from 'react';

type AnnouncementLevel = 'polite' | 'assertive';

interface AnnouncementRegionProps {
  level?: AnnouncementLevel;
  clearDelay?: number;
}

/**
 * 스크린 리더를 위한 실시간 알림 영역 컴포넌트
 * 
 * 화면 업데이트와 상태 변경을 스크린 리더 사용자에게 알리는 접근성 컴포넌트입니다.
 * 시각적으로는 보이지 않지만 보조 기술에 의해 감지되어 콘텐츠 변경 사항을 사용자에게 알립니다.
 * 
 * @param level 알림 수준 ('polite' 또는 'assertive')
 * @param clearDelay 알림 텍스트 자동 제거 시간 (밀리초)
 */
export const AnnouncementRegion: React.FC<AnnouncementRegionProps> = ({
  level = 'polite',
  clearDelay = 5000,
}) => {
  const [message, setMessage] = useState<string>('');
  const regionRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 알림 메시지 설정 함수
   * 외부에서 메시지를 설정할 수 있도록 window 객체에 등록
   */
  const announce = useCallback((text: string, announcementLevel?: AnnouncementLevel) => {
    // 빈 메시지 무시
    if (!text.trim()) return;
    
    // 알림 수준 설정
    const newLevel = announcementLevel || level;
    
    // 이전 타이머 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // 메시지 설정
    setMessage(text);
    
    // ARIA 속성 업데이트
    if (regionRef.current) {
      regionRef.current.setAttribute('aria-live', newLevel);
    }
    
    // 일정 시간 후 메시지 제거
    timeoutRef.current = setTimeout(() => {
      setMessage('');
    }, clearDelay);
  }, [level, clearDelay]);

  // 컴포넌트 마운트 시 announce 함수를 전역으로 등록
  useEffect(() => {
    (window as any).announceToScreenReader = announce;
    
    return () => {
      // 컴포넌트 언마운트 시 타이머 정리 및 전역 함수 제거
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      delete (window as any).announceToScreenReader;
    };
  }, [announce]);

  return (
    <div
      ref={regionRef}
      className="sr-only"
      aria-live={level}
      aria-atomic="true"
      aria-relevant="additions"
    >
      {message}
    </div>
  );
};

/**
 * 스크린 리더에 알림을 전달하는 유틸리티 함수
 * 
 * @param message 스크린 리더에 전달할 메시지
 * @param level 알림 수준 ('polite' 또는 'assertive')
 */
export function announceToScreenReader(message: string, level: AnnouncementLevel = 'polite'): void {
  // 전역 함수가 있는지 확인하고 호출
  if (typeof window !== 'undefined' && (window as any).announceToScreenReader) {
    (window as any).announceToScreenReader(message, level);
  } else {
    console.warn('AnnouncementRegion 컴포넌트가 마운트되지 않았습니다.');
  }
}

export default AnnouncementRegion;