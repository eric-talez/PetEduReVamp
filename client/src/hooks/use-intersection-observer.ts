import { useState, useEffect, useRef } from 'react';

interface IntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * Intersection Observer API를 사용한 커스텀 훅
 * 
 * 요소가 뷰포트에 들어왔는지 감지하는 데 사용됩니다.
 * 지연 로딩, 무한 스크롤, 뷰포트 내 애니메이션 트리거 등에 유용합니다.
 * 
 * @param options IntersectionObserver 옵션 및 추가 옵션
 * @returns [ref, isIntersecting, entry] 관찰할 요소의 ref, 교차 여부, IntersectionObserverEntry
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>({
  threshold = 0,
  root = null,
  rootMargin = '0%',
  freezeOnceVisible = false,
}: IntersectionObserverOptions = {}): [React.RefObject<T>, boolean, IntersectionObserverEntry | null] {
  const observerRef = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  const frozen = isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const node = observerRef.current;
    
    // 참조할 요소가 없거나 이미 고정된 상태라면 관찰하지 않음
    if (!node || frozen) return;
    
    // 관찰자 콜백 함수
    const observerCallback = ([newEntry]: IntersectionObserverEntry[]): void => {
      setEntry(newEntry);
      setIsIntersecting(newEntry.isIntersecting);
    };

    // IntersectionObserver 인스턴스 생성
    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      root,
      rootMargin,
    });

    // 요소 관찰 시작
    observer.observe(node);

    // 컴포넌트 언마운트 또는 의존성 변경 시 정리
    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, frozen]);

  return [observerRef, isIntersecting, entry];
}