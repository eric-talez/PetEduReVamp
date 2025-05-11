import { useRef, useEffect, RefObject } from 'react';
import { getFocusableElements } from '@/utils/accessibility/a11y-utils';

interface UseFocusTrapOptions {
  /** 활성화 여부 */
  enabled?: boolean;
  /** 초기 포커스 요소 지정 (기본값: 첫 번째 포커스 가능한 요소) */
  initialFocus?: RefObject<HTMLElement> | null;
  /** 닫을 때 포커스를 반환할 요소 (기본값: 폴백 요소 사용) */
  returnFocusRef?: RefObject<HTMLElement> | null;
  /** 탭 키 루프 활성화 여부 */
  enableTabLoop?: boolean;
  /** Escape 키로 닫기 활성화 여부 */
  enableEscapeKey?: boolean;
  /** Escape 키 눌렀을 때 콜백 */
  onEscapeKey?: () => void;
}

/**
 * 포커스 트랩 훅
 * 
 * 모달, 다이얼로그, 드롭다운 메뉴와 같은 컴포넌트에서 
 * 키보드 포커스를 특정 영역 내로 제한하는 기능 제공
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement>,
  options: UseFocusTrapOptions = {}
) {
  const {
    enabled = true,
    initialFocus = null,
    returnFocusRef = null,
    enableTabLoop = true,
    enableEscapeKey = true,
    onEscapeKey,
  } = options;

  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // 컴포넌트가 마운트될 때 이전 포커스 요소를 저장하고
  // 언마운트될 때 포커스 복원
  useEffect(() => {
    if (!enabled) return;

    // 현재 포커스된 요소 저장
    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    return () => {
      // 컴포넌트 언마운트 시 이전 포커스 요소 또는 지정된 returnFocusRef로 포커스 복원
      if (returnFocusRef?.current) {
        returnFocusRef.current.focus();
      } else if (previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [enabled, returnFocusRef]);

  // 초기 포커스 설정
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    // 지정된 initialFocus 요소가 있으면 해당 요소에 포커스
    if (initialFocus?.current) {
      initialFocus.current.focus();
      return;
    }

    // 지정된 initialFocus가 없으면 컨테이너 내 첫 번째 포커스 가능한 요소에 포커스
    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      // 포커스 가능한 요소가 없으면 컨테이너 자체에 포커스 설정
      containerRef.current.setAttribute('tabindex', '-1');
      containerRef.current.focus();
    }
  }, [enabled, containerRef, initialFocus]);

  // 키보드 이벤트 핸들러 설정 (Tab 키 및 Escape 키)
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape 키 처리
      if (enableEscapeKey && event.key === 'Escape') {
        event.preventDefault();
        onEscapeKey?.();
        return;
      }

      // Tab 키 루프 처리
      if (enableTabLoop && event.key === 'Tab' && containerRef.current) {
        const focusableElements = getFocusableElements(containerRef.current);
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const { activeElement } = document;

        // Shift+Tab을 누르고 첫 번째 요소에 포커스되어 있는 경우 마지막 요소로 포커스 이동
        if (event.shiftKey && activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
        // Tab을 누르고 마지막 요소에 포커스되어 있는 경우 첫 번째 요소로 포커스 이동
        else if (!event.shiftKey && activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener('keydown', handleKeyDown);

    // 정리 함수
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, containerRef, enableTabLoop, enableEscapeKey, onEscapeKey]);

  // 외부 클릭 방지 설정
  useEffect(() => {
    if (!enabled) return;

    // 다른 요소에 의해 포커스가 빠져나가는 것을 방지하는 함수
    const preventFocusEscape = (event: FocusEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        event.preventDefault();
        
        // 포커스가 빠져나간 경우 컨테이너 내부로 포커스 되돌림
        const focusableElements = getFocusableElements(containerRef.current);
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          containerRef.current.focus();
        }
      }
    };

    // 이벤트 리스너 등록 (캡처 단계에서 이벤트 처리)
    document.addEventListener('focusin', preventFocusEscape, true);

    // 정리 함수
    return () => {
      document.removeEventListener('focusin', preventFocusEscape, true);
    };
  }, [enabled, containerRef]);
}

export default useFocusTrap;