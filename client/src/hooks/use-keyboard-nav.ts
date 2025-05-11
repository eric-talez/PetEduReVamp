import { useState, useRef, useEffect, KeyboardEvent, RefObject } from 'react';
import { getFocusableElements } from '@/utils/accessibility/a11y-utils';

interface UseKeyboardNavOptions {
  /** 키보드 탐색을 적용할 루트 요소 */
  containerRef: RefObject<HTMLElement>;
  /** 요소간 이동 방향 ('horizontal' | 'vertical' | 'both') */
  direction?: 'horizontal' | 'vertical' | 'both';
  /** 첫 번째와 마지막 요소를 순환할지 여부 */
  wrap?: boolean;
  /** 활성화 여부 */
  enabled?: boolean;
  /** 초기 포커스 인덱스 */
  initialFocusIndex?: number;
  /** 포커스 변경 시 호출될 콜백 */
  onFocusChange?: (index: number) => void;
}

/**
 * 키보드 탐색을 위한 커스텀 훅
 * 
 * 메뉴, 탭, 리스트 등의 컴포넌트에서 화살표 키로 요소 간 탐색 기능 제공
 */
export function useKeyboardNav({
  containerRef,
  direction = 'both',
  wrap = true,
  enabled = true,
  initialFocusIndex = -1,
  onFocusChange,
}: UseKeyboardNavOptions) {
  const [focusIndex, setFocusIndex] = useState(initialFocusIndex);
  const elements = useRef<HTMLElement[]>([]);

  // 컨테이너 내부의 포커스 가능한 요소들 캐시
  useEffect(() => {
    if (containerRef.current && enabled) {
      elements.current = getFocusableElements(containerRef.current);
    }
  }, [containerRef, enabled]);

  // 포커스 인덱스 변경 시 해당 요소에 포커스 및 콜백 호출
  useEffect(() => {
    if (focusIndex >= 0 && focusIndex < elements.current.length) {
      elements.current[focusIndex].focus();
      onFocusChange?.(focusIndex);
    }
  }, [focusIndex, onFocusChange]);

  /**
   * 키보드 이벤트 핸들러
   * 화살표 키 및 Home/End 키 처리
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!enabled || elements.current.length === 0) return;

    let newIndex = focusIndex;

    switch (event.key) {
      // 왼쪽 방향키
      case 'ArrowLeft':
        if (direction === 'horizontal' || direction === 'both') {
          event.preventDefault();
          newIndex = focusIndex > 0 ? focusIndex - 1 : (wrap ? elements.current.length - 1 : focusIndex);
        }
        break;

      // 오른쪽 방향키
      case 'ArrowRight':
        if (direction === 'horizontal' || direction === 'both') {
          event.preventDefault();
          newIndex = focusIndex < elements.current.length - 1 ? focusIndex + 1 : (wrap ? 0 : focusIndex);
        }
        break;

      // 위쪽 방향키
      case 'ArrowUp':
        if (direction === 'vertical' || direction === 'both') {
          event.preventDefault();
          newIndex = focusIndex > 0 ? focusIndex - 1 : (wrap ? elements.current.length - 1 : focusIndex);
        }
        break;

      // 아래쪽 방향키
      case 'ArrowDown':
        if (direction === 'vertical' || direction === 'both') {
          event.preventDefault();
          newIndex = focusIndex < elements.current.length - 1 ? focusIndex + 1 : (wrap ? 0 : focusIndex);
        }
        break;

      // Home 키 (첫 요소로 이동)
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;

      // End 키 (마지막 요소로 이동)
      case 'End':
        event.preventDefault();
        newIndex = elements.current.length - 1;
        break;

      default:
        return; // 다른 키는 처리하지 않음
    }

    if (newIndex !== focusIndex) {
      setFocusIndex(newIndex);
    }
  };

  /**
   * 특정 인덱스의 요소에 포커스 설정
   */
  const setFocus = (index: number) => {
    if (index >= -1 && index < elements.current.length) {
      setFocusIndex(index);
    }
  };

  /**
   * 첫 번째 요소에 포커스 설정
   */
  const focusFirst = () => {
    if (elements.current.length > 0) {
      setFocusIndex(0);
    }
  };

  /**
   * 마지막 요소에 포커스 설정
   */
  const focusLast = () => {
    if (elements.current.length > 0) {
      setFocusIndex(elements.current.length - 1);
    }
  };

  /**
   * 포커스 제거
   */
  const clearFocus = () => {
    setFocusIndex(-1);
  };

  return {
    focusIndex,
    handleKeyDown,
    setFocus,
    focusFirst,
    focusLast,
    clearFocus,
    elementsCount: elements.current.length,
  };
}

export default useKeyboardNav;