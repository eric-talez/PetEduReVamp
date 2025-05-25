import { useState, useEffect } from 'react';

type MediaQueryCallback = (matches: boolean) => void;

/**
 * 반응형 디자인에 유용한 미디어 쿼리 훅
 * 
 * 미디어 쿼리의 일치 여부를 감지하고 상태로 관리합니다.
 * 브라우저 창 크기 변경 등에 반응하여 컴포넌트를 자동으로 업데이트합니다.
 * 
 * @param query CSS 미디어 쿼리 문자열 (예: '(min-width: 768px)')
 * @param defaultValue 초기 기본값 (선택 사항)
 * @returns 미디어 쿼리 일치 여부
 */
export function useMediaQuery(
  query: string,
  defaultValue: boolean = false
): boolean {
  // SSR 환경을 위한 처리
  const getMatches = (): boolean => {
    // window 객체가 없는 환경 (SSR)에서는 기본값 반환
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return defaultValue;
  };

  const [matches, setMatches] = useState<boolean>(getMatches());

  useEffect(() => {
    // 현재 일치 여부 확인 후 상태 업데이트
    const updateMatches = () => {
      setMatches(getMatches());
    };

    // 초기화 시 업데이트
    updateMatches();

    // 미디어 쿼리 일치 여부 변경 시 이벤트 리스너
    const mediaQueryList = window.matchMedia(query);

    // 이벤트 리스너 등록 (최신 API와 레거시 API 모두 지원)
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', updateMatches);
    } else {
      // Safari, IE 등 이전 브라우저용 지원
      mediaQueryList.addListener(updateMatches);
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', updateMatches);
      } else {
        // Safari, IE 등 이전 브라우저용 지원
        mediaQueryList.removeListener(updateMatches);
      }
    };
  }, [query]);

  return matches;
}

/**
 * 다양한 반응형 브레이크포인트에 맞춘 미디어 쿼리 훅
 * 
 * Tailwind CSS 기본 브레이크포인트를 따르는 간편한 반응형 훅
 * 
 * @returns 다양한 화면 크기 일치 여부 객체
 */
export function useResponsive() {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isSm = useMediaQuery('(min-width: 640px)');
  const isMd = useMediaQuery('(min-width: 768px)');
  const isLg = useMediaQuery('(min-width: 1024px)');
  const isXl = useMediaQuery('(min-width: 1280px)');
  const is2xl = useMediaQuery('(min-width: 1536px)');
  
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const isPortrait = useMediaQuery('(orientation: portrait)');
  
  const isPrefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isPrefersColorSchemeDark = useMediaQuery('(prefers-color-scheme: dark)');
  const isPrefersColorSchemeLight = useMediaQuery('(prefers-color-scheme: light)');
  
  return {
    isMobile,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    isLandscape,
    isPortrait,
    isPrefersReducedMotion,
    isPrefersColorSchemeDark,
    isPrefersColorSchemeLight,
    // 편의 메서드
    isTablet: isSm && !isLg,
    isDesktop: isLg,
    isTouch: isMobile || (isSm && !isLg),
  };
}

/**
 * 미디어 쿼리 변경 시 콜백 실행 훅
 * 
 * 미디어 쿼리의 일치 여부가 변경될 때 특정 콜백 함수를 실행합니다.
 * 
 * @param query CSS 미디어 쿼리 문자열
 * @param callback 일치 여부 변경 시 실행할 콜백
 */
export function useMediaQueryCallback(
  query: string,
  callback: MediaQueryCallback
): void {
  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    
    // 콜백 래퍼 함수
    const handleChange = (event: MediaQueryListEvent) => {
      callback(event.matches);
    };
    
    // 초기 콜백 실행
    callback(mediaQueryList.matches);
    
    // 이벤트 리스너 등록 (최신 API와 레거시 API 모두 지원)
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // Safari, IE 등 이전 브라우저용 지원
      mediaQueryList.addListener(handleChange);
    }
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        // Safari, IE 등 이전 브라우저용 지원
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query, callback]);
}

/**
 * 사용 예시:
 * 
 * // 기본 사용법
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * 
 * // 반응형 스타일 적용
 * const styles = {
 *   fontSize: isMobile ? '14px' : '16px'
 * };
 * 
 * // 반응형 훅 사용
 * const { isMobile, isTablet, isDesktop } = useResponsive();
 * 
 * // 미디어 쿼리 변경 시 콜백 실행
 * useMediaQueryCallback('(prefers-color-scheme: dark)', (isDarkMode) => {
 *   if (isDarkMode) {
 *     // 다크 모드 활성화 시 실행할 코드
 *   } else {
 *     // 라이트 모드 활성화 시 실행할 코드
 *   }
 * });
 */