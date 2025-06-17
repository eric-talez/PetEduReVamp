
/**
 * WCAG 2.1 대비 비율 체크 유틸리티
 * 라이트 모드와 다크 모드에서 텍스트와 배경색의 접근성을 확인
 */

export interface ContrastResult {
  ratio: number;
  level: 'AAA' | 'AA' | 'AA Large' | 'Fail';
  isAccessible: boolean;
  recommendation?: string;
}

export interface ColorPair {
  foreground: string;
  background: string;
  description: string;
}

export interface ThemeColors {
  light: ColorPair[];
  dark: ColorPair[];
}

/**
 * RGB 색상을 상대 휘도로 변환
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * 16진수 색상을 RGB로 변환
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * CSS 색상을 RGB로 변환 (rgb, rgba, hsl 등 지원)
 */
function parseColor(color: string): { r: number; g: number; b: number } | null {
  // 16진수 색상
  if (color.startsWith('#')) {
    return hexToRgb(color);
  }
  
  // rgb/rgba 색상
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3])
    };
  }
  
  // hsl 색상을 RGB로 변환 (간단한 버전)
  const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1]) / 360;
    const s = parseInt(hslMatch[2]) / 100;
    const l = parseInt(hslMatch[3]) / 100;
    
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }
  
  return null;
}

/**
 * 두 색상 간의 대비 비율 계산
 */
export function getContrastRatio(foreground: string, background: string): number {
  const fg = parseColor(foreground);
  const bg = parseColor(background);
  
  if (!fg || !bg) return 0;
  
  const fgLuminance = getLuminance(fg.r, fg.g, fg.b);
  const bgLuminance = getLuminance(bg.r, bg.g, bg.b);
  
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 대비 비율을 기반으로 WCAG 등급 평가
 */
export function evaluateContrast(ratio: number, isLargeText: boolean = false): ContrastResult {
  let level: ContrastResult['level'];
  let isAccessible: boolean;
  let recommendation: string | undefined;
  
  if (ratio >= 7) {
    level = 'AAA';
    isAccessible = true;
  } else if (ratio >= 4.5) {
    level = isLargeText ? 'AAA' : 'AA';
    isAccessible = true;
  } else if (ratio >= 3 && isLargeText) {
    level = 'AA Large';
    isAccessible = true;
  } else {
    level = 'Fail';
    isAccessible = false;
    recommendation = `대비 비율을 ${isLargeText ? '3.0' : '4.5'} 이상으로 높이세요. 현재: ${ratio.toFixed(2)}`;
  }
  
  return { ratio, level, isAccessible, recommendation };
}

/**
 * 테마별 색상 조합 정의
 */
export const themeColorPairs: ThemeColors = {
  light: [
    { foreground: '#222222', background: '#ffffff', description: '기본 텍스트' },
    { foreground: '#ffffff', background: 'hsl(158, 54%, 79%)', description: '주요 버튼 텍스트' },
    { foreground: 'hsl(160, 50%, 20%)', background: 'hsl(158, 54%, 79%)', description: '주요 색상 전경' },
    { foreground: '#26830e', background: 'hsl(43, 100%, 72%)', description: '보조 버튼 텍스트' },
    { foreground: '#6b7280', background: '#ffffff', description: '보조 텍스트' },
    { foreground: '#374151', background: '#f9fafb', description: '카드 텍스트' },
    { foreground: '#ffffff', background: '#dc2626', description: '오류 버튼' },
    { foreground: '#ffffff', background: '#059669', description: '성공 버튼' },
  ],
  dark: [
    { foreground: '#f8fafc', background: 'hsl(222, 47%, 11%)', description: '기본 텍스트 (다크)' },
    { foreground: 'hsl(160, 50%, 20%)', background: 'hsl(158, 54%, 79%)', description: '주요 버튼 텍스트 (다크)' },
    { foreground: '#26830e', background: 'hsl(43, 100%, 72%)', description: '보조 버튼 텍스트 (다크)' },
    { foreground: '#9ca3af', background: 'hsl(222, 47%, 11%)', description: '보조 텍스트 (다크)' },
    { foreground: '#e5e7eb', background: 'hsl(217, 32%, 17%)', description: '카드 텍스트 (다크)' },
    { foreground: '#ffffff', background: '#dc2626', description: '오류 버튼 (다크)' },
    { foreground: '#ffffff', background: '#059669', description: '성공 버튼 (다크)' },
  ]
};

/**
 * 모든 테마 색상 조합 체크
 */
export function checkAllThemeContrasts(): { light: ContrastResult[]; dark: ContrastResult[] } {
  const results = {
    light: [] as ContrastResult[],
    dark: [] as ContrastResult[]
  };
  
  // 라이트 모드 체크
  themeColorPairs.light.forEach(pair => {
    const ratio = getContrastRatio(pair.foreground, pair.background);
    const result = evaluateContrast(ratio);
    results.light.push({
      ...result,
      ratio: Math.round(ratio * 100) / 100
    });
  });
  
  // 다크 모드 체크
  themeColorPairs.dark.forEach(pair => {
    const ratio = getContrastRatio(pair.foreground, pair.background);
    const result = evaluateContrast(ratio);
    results.dark.push({
      ...result,
      ratio: Math.round(ratio * 100) / 100
    });
  });
  
  return results;
}

/**
 * DOM 요소의 실제 대비 비율 체크
 */
export function checkElementContrast(element: HTMLElement): ContrastResult | null {
  const styles = window.getComputedStyle(element);
  const color = styles.color;
  const backgroundColor = styles.backgroundColor;
  
  // 투명한 배경색인 경우 부모 요소에서 배경색 찾기
  let actualBgColor = backgroundColor;
  if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
    let parent = element.parentElement;
    while (parent) {
      const parentStyles = window.getComputedStyle(parent);
      if (parentStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
          parentStyles.backgroundColor !== 'transparent') {
        actualBgColor = parentStyles.backgroundColor;
        break;
      }
      parent = parent.parentElement;
    }
  }
  
  if (actualBgColor === 'rgba(0, 0, 0, 0)' || actualBgColor === 'transparent') {
    actualBgColor = '#ffffff'; // 기본값
  }
  
  const ratio = getContrastRatio(color, actualBgColor);
  const fontSize = parseFloat(styles.fontSize);
  const fontWeight = styles.fontWeight;
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
  
  return evaluateContrast(ratio, isLargeText);
}

/**
 * 페이지의 모든 텍스트 요소 대비 체크
 */
export function checkPageContrasts(): Array<{
  element: HTMLElement;
  result: ContrastResult;
  selector: string;
}> {
  const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label, input, textarea');
  const results: Array<{
    element: HTMLElement;
    result: ContrastResult;
    selector: string;
  }> = [];
  
  textElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    const result = checkElementContrast(htmlElement);
    
    if (result && !result.isAccessible) {
      // CSS 선택자 생성
      let selector = element.tagName.toLowerCase();
      if (element.id) selector += `#${element.id}`;
      if (element.className) selector += `.${element.className.split(' ').join('.')}`;
      
      results.push({
        element: htmlElement,
        result,
        selector
      });
    }
  });
  
  return results;
}
