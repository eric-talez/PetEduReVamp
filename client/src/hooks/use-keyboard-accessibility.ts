import { useCallback, useEffect } from 'react';

interface KeyboardHandler {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  handler: (event: KeyboardEvent) => void;
}

/**
 * 키보드 접근성을 개선하는 커스텀 훅
 * 
 * 전역 또는 컴포넌트 수준에서 키보드 단축키를 쉽게 관리할 수 있습니다.
 * 스크린 리더 사용자 및 키보드만 사용하는 사용자의 접근성을 향상시킵니다.
 * 
 * @param handlers 키보드 이벤트 핸들러 배열
 * @param enabled 훅 활성화 여부 (기본값: true)
 */
export function useKeyboardAccessibility(handlers: KeyboardHandler[], enabled = true): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // 훅이 비활성화되어 있으면 무시
      if (!enabled) return;
      
      // 텍스트 입력 요소에서 발생한 이벤트는 무시 (기본 동작 유지)
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable
      ) {
        return;
      }

      // 등록된 모든 핸들러 확인
      for (const { key, ctrlKey, shiftKey, altKey, handler } of handlers) {
        // 키 조합이 일치하는지 확인
        const keyMatch = event.key === key || event.code === key;
        const ctrlMatch = ctrlKey === undefined || event.ctrlKey === ctrlKey;
        const shiftMatch = shiftKey === undefined || event.shiftKey === shiftKey;
        const altMatch = altKey === undefined || event.altKey === altKey;

        // 모든 조건이 일치하면 핸들러 실행
        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          handler(event);
          break;
        }
      }
    },
    [handlers, enabled]
  );

  // 이벤트 리스너 등록 및 제거
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * 모달 또는 드롭다운에서 키보드 포커스 트랩을 생성하는 훅
 * 
 * Tab 키를 사용할 때 포커스가 모달 내부에 유지되도록 하여
 * 접근성을 향상시킵니다.
 * 
 * @param containerRef 포커스를 가둘 컨테이너 요소의 ref
 * @param isActive 포커스 트랩 활성화 여부
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  isActive = true
): void {
  const handleTabKey = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive || !containerRef.current || event.key !== 'Tab') return;

      // 컨테이너 내부의 포커스 가능한 요소 찾기
      const focusableElements = containerRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      // 첫 번째와 마지막 요소
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      // Shift+Tab을 누르면 마지막 요소로 이동
      if (event.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      } 
      // Tab을 누르면 첫 번째 요소로 이동
      else if (!event.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    },
    [containerRef, isActive]
  );

  // 컴포넌트 마운트 시 첫 번째 요소로 자동 포커스
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // 이전 포커스 저장
    const previousActiveElement = document.activeElement as HTMLElement;

    // 포커스 가능한 첫 번째 요소 찾기
    const focusableElement = containerRef.current.querySelector(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;

    // 요소가 있으면 포커스
    if (focusableElement) {
      focusableElement.focus();
    }

    // 컴포넌트 언마운트 시 이전 포커스 복원
    return () => {
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [containerRef, isActive]);

  // 탭 키 이벤트 리스너 등록
  useEffect(() => {
    document.addEventListener('keydown', handleTabKey);
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [handleTabKey]);
}