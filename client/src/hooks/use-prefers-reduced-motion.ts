import { useState, useEffect } from 'react';

/**
 * 동작 감소 선호도 훅
 * 
 * 사용자의 시스템 설정에서 동작 감소 선호도를 감지하여 반환
 * 이 설정은 전정기관 장애, 주의력 결핍 또는 동작 멀미를 경험하는 사용자에게 도움이 됨
 * 
 * @returns {boolean} 사용자가 동작 감소를 선호하는지 여부
 */
export function usePrefersReducedMotion(): boolean {
  // 사용자의 동작 감소 선호도를 확인하는 미디어 쿼리
  const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  
  // 기본값은 설정이 없거나 지원되지 않는 경우를 위한 안전한 값
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    mediaQuery ? mediaQuery.matches : false
  );

  useEffect(() => {
    if (!mediaQuery) {
      // matchMedia가 지원되지 않는 환경에서는 기본값 유지
      return;
    }

    // 선호도 변경 시 상태 업데이트
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // 변경 이벤트 리스너 등록
    mediaQuery.addEventListener('change', handleChange);

    // 언마운트 시 이벤트 리스너 제거
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [mediaQuery]);

  return prefersReducedMotion;
}

export default usePrefersReducedMotion;