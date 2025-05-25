import { useState, useEffect } from 'react';

type SetValue<T> = T | ((val: T) => T);

/**
 * 로컬 스토리지와 동기화되는 상태를 관리하는 커스텀 훅
 * 
 * useState와 유사하게 작동하지만 상태가 로컬 스토리지에 자동으로 저장되고
 * 앱을 다시 로드하거나 새로 고침해도 상태가 유지됩니다.
 * 
 * @param key 로컬 스토리지 키
 * @param initialValue 초기값
 * @returns [storedValue, setValue] - useState와 동일한 패턴의 반환값
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: SetValue<T>) => void] {
  // 로컬 스토리지에서 초기값 읽기 시도
  const readValue = (): T => {
    // SSR이나 특정 환경에서는 window가 없을 수 있음
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      // 저장된 값이 있으면 파싱하여 반환, 없으면 초기값 반환
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // 실제 상태 값을 저장하는 useState 훅
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 스토리지에 값을 저장하는 함수
  const setValue = (value: SetValue<T>): void => {
    try {
      // 함수인 경우 기존 값을 기반으로 새 값 계산
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // 상태 업데이트
      setStoredValue(valueToStore);
      
      // 로컬 스토리지에 저장
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // 스토리지 이벤트 발생시켜 다른 탭/창에 알림
        const event = new Event('local-storage');
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // 다른 탭/창에서의 변경사항 감지
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue));
      }
    };

    // 일반 스토리지 이벤트 리스너
    window.addEventListener('storage', handleStorageChange);
    // 커스텀 이벤트 리스너 (같은 탭/창 내에서의 변경 감지)
    window.addEventListener('local-storage', () => setStoredValue(readValue()));

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', () => setStoredValue(readValue()));
    };
  }, [key]);

  return [storedValue, setValue];
}