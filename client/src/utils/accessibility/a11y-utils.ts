/**
 * 접근성(Accessibility) 관련 유틸리티 함수 모음
 * 
 * 웹 접근성 향상을 위한 다양한 헬퍼 함수들을 제공합니다.
 */

/**
 * 키보드 이벤트에서 Enter 또는 Space 키 입력 시 콜백 실행
 * 
 * 일반 div나 span 등의 비대화형 요소를 버튼처럼 사용할 때 키보드 접근성 제공
 * 
 * @param event 키보드 이벤트
 * @param callback 실행할 콜백 함수
 */
export function handleKeyboardAction(
  event: React.KeyboardEvent,
  callback: () => void
): void {
  // Enter 또는 Space 키 누를 때 액션 실행
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
}

/**
 * 스크린 리더 사용자를 위한 숨겨진 텍스트 클래스 반환
 * 
 * 시각적으로는 숨겨지지만 스크린 리더에는 읽히는 텍스트를 위한 CSS 클래스
 */
export const srOnly = "absolute w-px h-px p-0 m-[-1px] overflow-hidden clip whitespace-nowrap border-0";

/**
 * 포커스 가능한 요소인지 확인
 * 
 * @param element 확인할 DOM 요소
 * @returns 포커스 가능 여부
 */
export function isFocusable(element: HTMLElement): boolean {
  const nodeName = element.nodeName.toLowerCase();
  const tabIndex = element.getAttribute('tabindex');
  const tabIndexValue = tabIndex !== null ? parseInt(tabIndex, 10) : null;

  // 기본적으로 포커스 가능한 요소들
  if (
    nodeName === 'a' && element.hasAttribute('href') ||
    nodeName === 'button' && !element.hasAttribute('disabled') ||
    nodeName === 'input' && !element.hasAttribute('disabled') ||
    nodeName === 'select' && !element.hasAttribute('disabled') ||
    nodeName === 'textarea' && !element.hasAttribute('disabled') ||
    nodeName === 'audio' && element.hasAttribute('controls') ||
    nodeName === 'video' && element.hasAttribute('controls')
  ) {
    return true;
  }

  // tabIndex가 명시적으로 지정된 경우
  return tabIndexValue !== null && tabIndexValue >= 0;
}

/**
 * DOM 트리에서 특정 요소의 포커스 가능한 자식 요소들 찾기
 * 
 * @param rootElement 탐색 시작할 루트 요소
 * @returns 포커스 가능한 요소들의 배열
 */
export function getFocusableElements(rootElement: HTMLElement): HTMLElement[] {
  const elements = Array.from(
    rootElement.querySelectorAll('*')
  ) as HTMLElement[];
  
  return elements.filter(isFocusable);
}

/**
 * 색상 대비율 계산
 * 
 * WCAG 기준에 따른 두 색상 간의 대비율 계산 (최소 4.5:1 권장)
 * 
 * @param foreground 전경색 (RGB 헥스 코드)
 * @param background 배경색 (RGB 헥스 코드)
 * @returns 대비율 (높을수록 더 좋은 대비)
 */
export function calculateContrastRatio(foreground: string, background: string): number {
  // RGB 헥스 값을 휘도(luminance)로 변환하는 함수
  const getLuminance = (hexColor: string): number => {
    // 헥스 값에서 R, G, B 추출
    const rgb = hexColor.startsWith('#') 
      ? hexColor.substring(1) 
      : hexColor;
    
    const r = parseInt(rgb.substring(0, 2), 16) / 255;
    const g = parseInt(rgb.substring(2, 4), 16) / 255;
    const b = parseInt(rgb.substring(4, 6), 16) / 255;

    // sRGB 값을 상대 휘도로 변환
    const toLinear = (channel: number): number => {
      return channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4);
    };

    // 상대 휘도 계산 공식 (WCAG 2.0)
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };

  const foregroundLuminance = getLuminance(foreground);
  const backgroundLuminance = getLuminance(background);

  // 대비율 계산 (밝은 색 / 어두운 색)
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 이미지에 대체 텍스트가 제공되었는지 확인
 * 
 * @param imgElement 이미지 요소
 * @returns 적절한 alt 속성 존재 여부
 */
export function hasProperAltText(imgElement: HTMLImageElement): boolean {
  const alt = imgElement.getAttribute('alt');
  
  // alt 속성이 없거나 빈 문자열인 경우는 장식적인 이미지로 간주
  if (alt === null) {
    return false;
  }
  
  // 이미지 파일명이 그대로 alt로 사용된 경우는 부적절함
  const src = imgElement.getAttribute('src') || '';
  const fileName = src.split('/').pop()?.split('.')[0] || '';
  
  if (alt === fileName) {
    return false;
  }
  
  return true;
}

/**
 * 요소에 접근성 속성 추가
 * 
 * @param element DOM 요소
 * @param props 추가할 ARIA 속성들
 */
export function addA11yProps(
  element: HTMLElement, 
  props: Record<string, string>
): void {
  Object.entries(props).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}