
/**
 * 색상 유틸리티 함수들
 */

/**
 * HSL 색상을 RGB로 변환
 */
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 1/6) {
    r = c; g = x; b = 0;
  } else if (1/6 <= h && h < 1/3) {
    r = x; g = c; b = 0;
  } else if (1/3 <= h && h < 1/2) {
    r = 0; g = c; b = x;
  } else if (1/2 <= h && h < 2/3) {
    r = 0; g = x; b = c;
  } else if (2/3 <= h && h < 5/6) {
    r = x; g = 0; b = c;
  } else if (5/6 <= h && h < 1) {
    r = c; g = 0; b = x;
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

/**
 * 색상의 밝기를 계산 (0-255)
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * 두 색상 간의 대비율 계산
 */
export function getContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const lum1 = getLuminance(...rgb1);
  const lum2 = getLuminance(...rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * 색상이 접근성 기준을 만족하는지 확인
 */
export function isAccessibleColor(
  foreground: [number, number, number], 
  background: [number, number, number],
  level: 'AA' | 'AAA' = 'AA',
  largeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return largeText ? ratio >= 4.5 : ratio >= 7;
  }
  return largeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * CSS 변수에서 색상 값 추출
 */
export function getCSSVariableValue(variable: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

/**
 * 색상 테마 검증
 */
export function validateColorTheme(): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // 주요 색상 조합 검사
  const colorCombinations = [
    { fg: '--foreground', bg: '--background', name: '기본 텍스트' },
    { fg: '--primary-foreground', bg: '--primary', name: '주요 버튼' },
    { fg: '--secondary-foreground', bg: '--secondary', name: '보조 버튼' },
    { fg: '--muted-foreground', bg: '--muted', name: '뮤트 텍스트' },
  ];
  
  colorCombinations.forEach(({ fg, bg, name }) => {
    const fgValue = getCSSVariableValue(fg);
    const bgValue = getCSSVariableValue(bg);
    
    if (!fgValue || !bgValue) {
      issues.push(`${name}: CSS 변수를 찾을 수 없습니다 (${fg}, ${bg})`);
      return;
    }
    
    // HSL 값 파싱 및 RGB 변환 로직 추가 필요
    // 실제 구현에서는 더 정교한 파싱이 필요
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}
