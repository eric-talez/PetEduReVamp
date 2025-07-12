
import { memo, useMemo, useCallback, useEffect, useRef } from 'react';

/**
 * React 성능 최적화 유틸리티
 */

// 메모화된 컴포넌트 생성 헬퍼
export function createMemoComponent<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  areEqual?: (prevProps: T, nextProps: T) => boolean
) {
  return memo(Component, areEqual);
}

// 안전한 useCallback (의존성 배열 자동 최적화)
export function useSafeCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps);
}

// 안전한 useMemo (의존성 배열 자동 최적화)
export function useSafeMemo<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps);
}

// 컴포넌트 언마운트 감지 훅
export function useUnmountEffect(effect: () => void) {
  const effectRef = useRef(effect);
  effectRef.current = effect;

  useEffect(() => {
    return () => {
      effectRef.current();
    };
  }, []);
}

// 메모리 누수 방지를 위한 이벤트 리스너 훅
export function useSafeEventListener(
  target: EventTarget | null,
  type: string,
  listener: EventListener,
  options?: AddEventListenerOptions
) {
  useEffect(() => {
    if (!target) return;

    target.addEventListener(type, listener, options);
    
    return () => {
      target.removeEventListener(type, listener, options);
    };
  }, [target, type, listener, options]);
}

// 디바운스된 값 훅 (메모리 최적화)
export function useOptimizedDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
