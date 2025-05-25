import { useState, useEffect } from 'react';

/**
 * SSR 호환 useState 훅
 * 
 * 서버 사이드 렌더링과 호환되는 useState 훅을 제공합니다.
 * 초기 렌더링 시 기본값을 사용하고, 브라우저에서 마운트 후 클라이언트 값으로 업데이트합니다.
 * 
 * @param clientValueFn 클라이언트에서만 실행되는 값 생성 함수
 * @param defaultValue 서버에서 사용할 기본값
 * @returns [상태, 상태 설정 함수]와 마운트 여부를 포함한 배열
 */
export function useSSRCompatible<T>(
  clientValueFn: () => T,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  // 기본값으로 초기화
  const [value, setValue] = useState<T>(defaultValue);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트에서 마운트 시 값 업데이트
  useEffect(() => {
    // window 객체가 존재하는지 확인 (클라이언트 환경)
    if (typeof window !== 'undefined') {
      try {
        const clientValue = clientValueFn();
        setValue(clientValue);
      } catch (error) {
        console.error('Error getting client value:', error);
      }
      setIsMounted(true);
    }
  }, [clientValueFn]);

  return [value, setValue, isMounted];
}

/**
 * SSR 호환 로컬 스토리지 훅
 * 
 * 서버 사이드 렌더링과 호환되는 로컬 스토리지 기반 상태 관리 훅을 제공합니다.
 * 서버에서는 기본값을 사용하고, 클라이언트에서는 로컬 스토리지의 값을 사용합니다.
 * 
 * @param key 로컬 스토리지 키
 * @param defaultValue 기본값
 * @returns [상태, 상태 설정 함수]와 마운트 여부를 포함한 배열
 */
export function useSSRLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  // 로컬 스토리지에서 값을 가져오는 함수
  const getValueFromLocalStorage = (): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  };

  // SSR 호환 훅 사용
  const [value, setValue, isMounted] = useSSRCompatible<T>(
    getValueFromLocalStorage,
    defaultValue
  );

  // 값이 변경될 때 로컬 스토리지 업데이트
  const setValueAndStore = (newValue: T | ((prev: T) => T)) => {
    setValue((prevValue) => {
      const resolvedValue = newValue instanceof Function ? newValue(prevValue) : newValue;
      
      // 클라이언트에서만 로컬 스토리지 업데이트
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(key, JSON.stringify(resolvedValue));
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      }
      
      return resolvedValue;
    });
  };

  return [value, setValueAndStore, isMounted];
}

/**
 * SSR 호환 미디어 쿼리 훅
 * 
 * 서버 사이드 렌더링과 호환되는 미디어 쿼리 훅을 제공합니다.
 * 서버에서는 기본값을 사용하고, 클라이언트에서는 실제 미디어 쿼리 결과를 사용합니다.
 * 
 * @param query 미디어 쿼리 문자열
 * @param defaultValue 서버에서 사용할 기본값
 * @returns 미디어 쿼리 일치 여부와 마운트 여부를 포함한 배열
 */
export function useSSRMediaQuery(
  query: string,
  defaultValue: boolean = false
): [boolean, boolean] {
  // 미디어 쿼리 일치 여부를 확인하는 함수
  const getIsMatching = (): boolean => {
    return window.matchMedia(query).matches;
  };

  // SSR 호환 훅 사용
  const [isMatching, setIsMatching, isMounted] = useSSRCompatible<boolean>(
    getIsMatching,
    defaultValue
  );

  // 미디어 쿼리 변경 감지
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);
    
    // 변경 핸들러
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMatching(event.matches);
    };

    // 이벤트 리스너 등록
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // 이전 브라우저 지원
      mediaQueryList.addListener(handleChange);
    }

    // 초기 상태 설정
    setIsMatching(mediaQueryList.matches);

    // 클린업
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        // 이전 브라우저 지원
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query, setIsMatching]);

  return [isMatching, isMounted];
}

/**
 * 사용 예시:
 * 
 * // 기본 사용법
 * const [value, setValue, isMounted] = useSSRCompatible(
 *   () => window.innerWidth,
 *   0
 * );
 * 
 * // 컴포넌트에서 사용
 * return (
 *   <div>
 *     {isMounted ? `Window width: ${value}px` : 'Loading...'}
 *   </div>
 * );
 * 
 * // 로컬 스토리지 사용
 * const [theme, setTheme, isMounted] = useSSRLocalStorage('theme', 'light');
 * 
 * // 미디어 쿼리 사용
 * const [isMobile, isMounted] = useSSRMediaQuery('(max-width: 768px)', false);
 */