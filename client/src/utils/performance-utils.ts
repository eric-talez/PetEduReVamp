/**
 * 성능 최적화 유틸리티 함수 모음
 */

/**
 * 디바운스 함수 - 짧은 시간 내에 여러 번 호출되는 함수를 제한하여 성능 향상
 * @param fn 실행할 함수
 * @param delay 지연 시간(ms)
 * @returns 디바운스된 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * 쓰로틀 함수 - 일정 시간 간격으로 함수 호출을 제한하여 성능 향상
 * @param fn 실행할 함수
 * @param delay 제한 간격(ms)
 * @returns 쓰로틀된 함수
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let shouldWait = false;
  let waitingArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  
  const timeoutFunc = () => {
    if (waitingArgs === null) {
      shouldWait = false;
    } else {
      fn.apply(lastThis, waitingArgs);
      waitingArgs = null;
      setTimeout(timeoutFunc, delay);
    }
  };
  
  return function(this: any, ...args: Parameters<T>) {
    if (shouldWait) {
      waitingArgs = args;
      lastThis = this;
      return;
    }
    
    fn.apply(this, args);
    shouldWait = true;
    
    setTimeout(timeoutFunc, delay);
  };
}

/**
 * 메모이제이션 함수 - 동일한 인자로 호출된 함수의 결과를 캐싱하여 재계산 방지
 * @param fn 캐싱할 함수
 * @returns 메모이제이션된 함수
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    
    return result;
  } as T;
}

/**
 * 리소스 미리 로드 함수 - 이미지, 스크립트 등을 미리 로드하여 UX 향상
 * @param url 미리 로드할 리소스 URL
 * @param type 리소스 유형 ('image' | 'script' | 'style')
 */
export function preload(url: string, type: 'image' | 'script' | 'style' = 'image'): void {
  if (!url) return;
  
  switch (type) {
    case 'image': {
      const img = new Image();
      img.src = url;
      break;
    }
    case 'script': {
      const script = document.createElement('link');
      script.rel = 'preload';
      script.as = 'script';
      script.href = url;
      document.head.appendChild(script);
      break;
    }
    case 'style': {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = url;
      document.head.appendChild(link);
      break;
    }
  }
}

/**
 * 성능 측정 데코레이터 (개발 환경용)
 * @param target 대상 객체
 * @param propertyKey 메서드 이름
 * @param descriptor 메서드 descriptor
 * @returns 수정된 descriptor
 */
export function measurePerformance(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    if (process.env.NODE_ENV !== 'development') {
      return originalMethod.apply(this, args);
    }
    
    console.time(`${propertyKey} 함수 실행 시간`);
    const result = originalMethod.apply(this, args);
    console.timeEnd(`${propertyKey} 함수 실행 시간`);
    
    return result;
  };
  
  return descriptor;
}

/**
 * chunk 처리 함수 - 대용량 데이터 처리 시 작업을 여러 청크로 나누어 처리
 * @param array 처리할 배열
 * @param chunkSize 청크 크기
 * @param processor 각 항목을 처리할 함수
 * @param onChunkComplete 각 청크 처리 완료 시 호출될 콜백
 * @param onComplete 모든 처리 완료 시 호출될 콜백
 */
export function processInChunks<T, R>(
  array: T[],
  chunkSize: number,
  processor: (item: T) => R,
  onChunkComplete?: (results: R[]) => void,
  onComplete?: (allResults: R[]) => void
): void {
  let index = 0;
  const allResults: R[] = [];
  
  function processNextChunk() {
    const chunkEnd = Math.min(index + chunkSize, array.length);
    const chunkResults: R[] = [];
    
    for (let i = index; i < chunkEnd; i++) {
      const result = processor(array[i]);
      chunkResults.push(result);
      allResults.push(result);
    }
    
    onChunkComplete?.(chunkResults);
    
    index = chunkEnd;
    
    if (index < array.length) {
      // 다음 청크 처리를 요청 애니메이션 프레임 또는 timeout으로 지연
      window.requestAnimationFrame(processNextChunk);
    } else {
      onComplete?.(allResults);
    }
  }
  
  processNextChunk();
}