/**
 * 이벤트 핸들러 최적화 유틸리티
 * 
 * 자주 발생하는 이벤트(스크롤, 크기 조정 등)를 최적화하여 
 * 성능과 메모리 사용을 개선하는 함수들의 모음입니다.
 */

/**
 * 디바운스 함수
 * 
 * 함수 호출을 지연시키고 주어진 시간 내에 발생하는 
 * 연속적인 호출을 하나로 합칩니다.
 * 특히 검색 입력, 창 크기 조정 이벤트에 유용합니다.
 * 
 * @param fn 디바운스할 함수
 * @param delay 지연 시간 (밀리초)
 * @returns 디바운스된 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };
}

/**
 * 쓰로틀 함수
 * 
 * 주어진 시간 동안 함수 호출을 최대 한 번으로 제한합니다.
 * 스크롤, 마우스 이동과 같은 이벤트에 유용합니다.
 * 
 * @param fn 쓰로틀할 함수
 * @param limit 제한 시간 (밀리초)
 * @returns 쓰로틀된 함수
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timer: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    const now = Date.now();
    
    // 마지막 호출 이후 제한 시간이 지났는지 확인
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    } else {
      // 이전 타이머가 있으면 취소
      if (timer) clearTimeout(timer);
      
      // 다음 허용된 시간에 호출을 예약
      const timeUntilLimit = limit - (now - lastCall);
      timer = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
        timer = null;
      }, timeUntilLimit);
    }
  };
}

/**
 * 레이지 이벤트 로더
 * 
 * 이벤트 리스너를 지연 로드하여 초기 로드 시간을 개선합니다.
 * 
 * @param eventName 이벤트 이름
 * @param targetElement 이벤트를 적용할 요소
 * @param handler 이벤트 핸들러
 * @param delay 지연 시간 (밀리초)
 * @param options 이벤트 리스너 옵션
 */
export function lazyLoadEventListener(
  eventName: string,
  targetElement: Window | Document | HTMLElement,
  handler: EventListenerOrEventListenerObject,
  delay: number = 300,
  options?: AddEventListenerOptions
): () => void {
  // 페이지 로드 후 지연 시간이 지나면 이벤트 리스너 추가
  const timerId = setTimeout(() => {
    targetElement.addEventListener(eventName, handler, options);
  }, delay);
  
  // 정리 함수 반환
  return () => {
    clearTimeout(timerId);
    targetElement.removeEventListener(eventName, handler, options);
  };
}

/**
 * 한 번만 실행되는 함수
 * 
 * 함수가 여러 번 호출되더라도 한 번만 실행되도록 보장합니다.
 * 
 * @param fn 실행할 함수
 * @returns 한 번만 실행되는 함수
 */
export function once<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let called = false;
  let result: ReturnType<T> | undefined;
  
  return function(...args: Parameters<T>) {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

/**
 * 이벤트 위임 핸들러
 * 
 * 여러 자식 요소에 동일한 이벤트 핸들러를 적용할 때
 * 이벤트 버블링을 활용하여 부모 요소에만 이벤트 리스너를 추가합니다.
 * 
 * @param parentElement 부모 요소
 * @param selector 이벤트를 처리할 자식 요소의 CSS 선택자
 * @param eventName 이벤트 이름
 * @param handler 이벤트 핸들러
 * @param useCapture 캡처 단계에서 이벤트를 처리할지 여부
 * @returns 이벤트 리스너 제거 함수
 */
export function delegateEvent(
  parentElement: HTMLElement | Document,
  selector: string,
  eventName: string,
  handler: (event: Event, targetElement: HTMLElement) => void,
  useCapture: boolean = false
): () => void {
  const wrappedHandler = (event: Event) => {
    // 이벤트가 발생한 요소
    const target = event.target as HTMLElement;
    
    // 선택자와 일치하는 요소 찾기
    const targetElement = target.closest(selector) as HTMLElement;
    
    // 일치하는 요소가 있고 해당 요소가 부모 요소의 자식인 경우 핸들러 실행
    if (targetElement && parentElement.contains(targetElement)) {
      handler(event, targetElement);
    }
  };
  
  // 이벤트 리스너 등록
  parentElement.addEventListener(eventName, wrappedHandler, useCapture);
  
  // 이벤트 리스너 제거 함수 반환
  return () => {
    parentElement.removeEventListener(eventName, wrappedHandler, useCapture);
  };
}

/**
 * 배치 이벤트 처리기
 * 
 * 여러 이벤트를 배치로 그룹화하여 한 번에 처리합니다.
 * 특히 DOM 변경이 많은 경우 유용합니다.
 * 
 * @param fn 처리할 함수
 * @param wait 대기 시간 (밀리초)
 * @param maxItems 최대 항목 수
 * @returns 배치 처리 함수
 */
export function batchProcess<T, R>(
  fn: (items: T[]) => R,
  wait: number = 100,
  maxItems: number = 100
): (item: T) => void {
  const batch: T[] = [];
  let timeout: NodeJS.Timeout | null = null;
  
  const flush = () => {
    if (batch.length > 0) {
      fn([...batch]);
      batch.length = 0;
    }
    timeout = null;
  };
  
  return (item: T) => {
    batch.push(item);
    
    // 최대 항목 수에 도달하면 즉시 처리
    if (batch.length >= maxItems) {
      if (timeout) clearTimeout(timeout);
      flush();
      return;
    }
    
    // 대기 시간 후 처리
    if (!timeout) {
      timeout = setTimeout(flush, wait);
    }
  };
}