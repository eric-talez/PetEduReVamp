import { useCallback, useRef, useEffect } from 'react';

/**
 * useCallback의 향상된 버전으로, 이전 결과를 캐싱하는 메모이제이션 콜백 훅
 * 
 * 일반 useCallback과 달리 함수 실행 결과도 캐싱하여 동일한 입력에 대해 
 * 불필요한 재계산을 방지합니다. 무거운 계산이 필요한 함수에 유용합니다.
 * 
 * @param callback 메모이제이션할 콜백 함수
 * @param dependencies 의존성 배열
 * @returns 메모이제이션된 콜백 함수
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList
): T {
  // 마지막 입력값과 결과를 저장할 참조
  const cacheRef = useRef<{
    args: any[] | null;
    result: ReturnType<T> | null;
  }>({
    args: null,
    result: null,
  });

  // 의존성이 변경되면 캐시 초기화
  useEffect(() => {
    cacheRef.current = {
      args: null,
      result: null,
    };
  }, dependencies);

  // 메모이제이션된 콜백 함수 생성
  return useCallback(
    ((...args: any[]) => {
      const cache = cacheRef.current;

      // 입력 인수가 이전과 동일한지 확인
      const argsEqual =
        cache.args &&
        args.length === cache.args.length &&
        args.every((arg, index) => arg === cache.args![index]);

      // 인수가 같으면 캐시된 결과 반환
      if (argsEqual) {
        return cache.result;
      }

      // 그렇지 않으면 함수 실행 및 결과 캐싱
      const result = callback(...args);
      cacheRef.current = {
        args,
        result,
      };
      return result;
    }) as T,
    dependencies
  );
}