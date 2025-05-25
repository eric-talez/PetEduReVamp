import { useState, useEffect } from 'react';

/**
 * 입력값에 디바운스 효과를 적용하는 커스텀 훅
 * 
 * 연속된 빠른 입력(타이핑 등)에서 마지막 입력 후 지정된 지연 시간이 지난 후에만 
 * 값을 업데이트하여 성능을 최적화합니다.
 * 
 * @param value 원본 값
 * @param delay 디바운스 지연 시간 (밀리초)
 * @returns 디바운스된 값
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 지정된 지연 시간 후에 값 업데이트
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 클린업 함수에서 이전 타이머 취소
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}