/**
 * 접근성 자동 테스트 유틸리티
 * 
 * 개발 환경에서 간단한 접근성 검사를 실행하고 문제점을 보고합니다.
 * 기본적인 접근성 문제를 식별하고 수정 방법을 제안합니다.
 */

// 접근성 검사 결과 타입
interface AccessibilityIssue {
  element: HTMLElement;
  type: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  helpUrl?: string;
  solution?: string;
}

// 접근성 검사 결과 요약
interface AccessibilityTestResult {
  passed: boolean;
  issues: AccessibilityIssue[];
  timestamp: Date;
  pageUrl: string;
}

/**
 * 이미지 대체 텍스트 검사
 * 
 * 이미지 요소에 적절한 alt 속성이 있는지 확인합니다.
 */
function checkImageAlternativeText(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  if (typeof document === 'undefined') return issues;
  
  // 모든 이미지 요소 선택
  const images = document.querySelectorAll('img');
  
  images.forEach((image) => {
    const alt = image.getAttribute('alt');
    
    // alt 속성이 없는 경우
    if (alt === null) {
      issues.push({
        element: image as HTMLElement,
        type: 'missing-alt',
        impact: 'serious',
        description: '이미지에 대체 텍스트(alt)가 없습니다.',
        solution: '의미 있는 이미지에 alt 속성을 추가하세요. 장식용 이미지는 alt=""를 사용하세요.'
      });
    }
    
    // alt 텍스트가 너무 긴 경우
    else if (alt && alt.length > 125) {
      issues.push({
        element: image as HTMLElement,
        type: 'long-alt',
        impact: 'moderate',
        description: '대체 텍스트가 너무 깁니다 (125자 초과).',
        solution: '대체 텍스트를 간결하게 줄이고, 필요하면 aria-describedby를 사용하여 상세 설명을 제공하세요.'
      });
    }
  });
  
  return issues;
}

/**
 * 색상 대비 검사
 * 
 * 텍스트 요소의 색상 대비가 WCAG 지침을 충족하는지 확인합니다.
 * 참고: 정확한 색상 대비 계산을 위해서는 외부 라이브러리가 필요할 수 있습니다.
 */
function checkColorContrast(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  if (typeof document === 'undefined') return issues;
  
  // 텍스트를 포함하는 요소 선택
  const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, label, button');
  
  textElements.forEach((element) => {
    const style = window.getComputedStyle(element);
    const fontSize = parseFloat(style.fontSize);
    const isBold = parseInt(style.fontWeight, 10) >= 700;
    const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold);
    
    // 실제 색상 대비 계산은 여기서 수행됩니다
    // 간단한 구현을 위해 매우 밝은 배경색과 매우 어두운 텍스트 색상을 검사합니다
    const backgroundColor = style.backgroundColor;
    const color = style.color;
    
    const bgLuminance = getLuminance(backgroundColor);
    const textLuminance = getLuminance(color);
    
    const contrastRatio = calculateContrastRatio(bgLuminance, textLuminance);
    
    const minRequiredContrast = isLargeText ? 3.0 : 4.5; // WCAG AA 기준
    
    if (contrastRatio < minRequiredContrast) {
      issues.push({
        element: element as HTMLElement,
        type: 'low-contrast',
        impact: 'serious',
        description: `텍스트 색상 대비가 부족합니다 (${contrastRatio.toFixed(2)}:1, 필요: ${minRequiredContrast}:1).`,
        solution: '텍스트 색상을 더 어둡게 하거나 배경색을 더 밝게 조정하여 대비를 높이세요.'
      });
    }
  });
  
  return issues;
}

/**
 * 헤딩 구조 검사
 * 
 * 헤딩(h1-h6)이 올바른 계층 구조를 가지고 있는지 확인합니다.
 */
function checkHeadingStructure(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  if (typeof document === 'undefined') return issues;
  
  // 모든 헤딩 요소 선택
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1), 10);
    
    // 페이지에 h1이 없는 경우
    if (headings.length > 0 && document.querySelectorAll('h1').length === 0) {
      issues.push({
        element: heading as HTMLElement,
        type: 'missing-h1',
        impact: 'serious',
        description: '페이지에 최상위 헤딩(h1)이 없습니다.',
        solution: '페이지의 주요 제목에 h1 태그를 사용하세요.'
      });
    }
    
    // 헤딩 레벨 건너뛰기 (예: h1 다음에 h3)
    if (lastLevel > 0 && level > lastLevel + 1) {
      issues.push({
        element: heading as HTMLElement,
        type: 'heading-level-skip',
        impact: 'moderate',
        description: `헤딩 레벨이 건너뛰었습니다 (h${lastLevel} 다음에 h${level}).`,
        solution: `h${lastLevel} 다음에 h${lastLevel + 1}을 사용하여 논리적인 계층 구조를 유지하세요.`
      });
    }
    
    lastLevel = level;
  });
  
  return issues;
}

/**
 * 폼 접근성 검사
 * 
 * 폼 요소에 레이블이 있고 적절한 ARIA 속성이 설정되어 있는지 확인합니다.
 */
function checkFormAccessibility(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  if (typeof document === 'undefined') return issues;
  
  // 모든 입력 요소 선택
  const inputs = document.querySelectorAll('input, select, textarea');
  
  inputs.forEach((input) => {
    const inputElement = input as HTMLInputElement;
    const inputId = inputElement.id;
    
    // id가 없는 경우
    if (!inputId) {
      issues.push({
        element: inputElement,
        type: 'input-missing-id',
        impact: 'serious',
        description: '입력 요소에 ID가 없어 레이블과 연결할 수 없습니다.',
        solution: '입력 요소에 고유한 ID를 추가하세요.'
      });
      return;
    }
    
    // 연결된 레이블이 없는 경우
    const hasLabel = document.querySelector(`label[for="${inputId}"]`);
    const hasAriaLabel = inputElement.getAttribute('aria-label');
    const hasAriaLabelledBy = inputElement.getAttribute('aria-labelledby');
    
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        element: inputElement,
        type: 'input-missing-label',
        impact: 'serious',
        description: '입력 요소에 연결된 레이블이 없습니다.',
        solution: '입력 요소에 label 요소를 연결하거나 aria-label 또는 aria-labelledby 속성을 추가하세요.'
      });
    }
  });
  
  return issues;
}

/**
 * 키보드 접근성 검사
 * 
 * 대화형 요소가 키보드로 접근 가능한지 확인합니다.
 */
function checkKeyboardAccessibility(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  if (typeof document === 'undefined') return issues;
  
  // 클릭 이벤트 리스너가 있지만 키보드 접근이 불가능한 요소 찾기
  const elements = document.querySelectorAll('div, span');
  
  elements.forEach((element) => {
    const hasClickListener = element.onclick !== null || 
      element.getAttribute('onclick') !== null;
    
    const isKeyboardAccessible = 
      element.getAttribute('tabindex') !== null || 
      element.tagName.toLowerCase() === 'button' || 
      element.tagName.toLowerCase() === 'a';
    
    if (hasClickListener && !isKeyboardAccessible) {
      issues.push({
        element: element as HTMLElement,
        type: 'keyboard-inaccessible',
        impact: 'critical',
        description: '클릭 이벤트가 있지만 키보드로 접근할 수 없습니다.',
        solution: 'tabindex="0" 속성을 추가하거나, 의미적으로 적절한 button 또는 a 태그를 사용하세요.'
      });
    }
  });
  
  return issues;
}

/**
 * 모든 접근성 검사 실행
 * 
 * 각 접근성 검사를 실행하고 결과를 종합합니다.
 */
export function runAccessibilityTests(): AccessibilityTestResult {
  const allIssues: AccessibilityIssue[] = [
    ...checkImageAlternativeText(),
    ...checkHeadingStructure(),
    ...checkFormAccessibility(),
    ...checkKeyboardAccessibility(),
  ];
  
  return {
    passed: allIssues.length === 0,
    issues: allIssues,
    timestamp: new Date(),
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
  };
}

/**
 * 색상 휘도 계산
 * 
 * WCAG 색상 대비 계산을 위한 상대 휘도 계산
 */
function getLuminance(color: string): number {
  // RGB 색상 추출
  const rgb = extractRGB(color);
  
  if (!rgb) return 1; // 기본값 (흰색)
  
  // sRGB 색상 공간에서 상대 휘도 계산
  const [r, g, b] = rgb.map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * 색상 문자열에서 RGB 값 추출
 */
function extractRGB(color: string): number[] | null {
  // rgb() 또는 rgba() 형식
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/i);
  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1], 10),
      parseInt(rgbMatch[2], 10),
      parseInt(rgbMatch[3], 10)
    ];
  }
  
  // hex 형식 (#fff 또는 #ffffff)
  if (color.startsWith('#')) {
    let hex = color.substring(1);
    
    // #fff 형식을 #ffffff 형식으로 확장
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    
    if (hex.length === 6) {
      return [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16)
      ];
    }
  }
  
  // 색상을 파싱할 수 없는 경우
  return null;
}

/**
 * 색상 대비 비율 계산
 * 
 * WCAG 2.0 지침에 따른 색상 대비 비율 계산
 */
function calculateContrastRatio(luminance1: number, luminance2: number): number {
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 접근성 테스트 결과 콘솔에 출력
 * 
 * 개발 모드에서 접근성 테스트 결과를 포맷팅하여 콘솔에 출력
 */
export function logAccessibilityResults(results: AccessibilityTestResult): void {
  if (typeof console === 'undefined') return;
  
  console.group('접근성 테스트 결과');
  console.log(`검사 시간: ${results.timestamp.toLocaleString()}`);
  console.log(`페이지: ${results.pageUrl}`);
  console.log(`결과: ${results.passed ? '통과 ✅' : '실패 ❌'}`);
  console.log(`총 문제 수: ${results.issues.length}`);
  
  if (results.issues.length > 0) {
    console.group('접근성 문제');
    
    // 심각도별 그룹화
    const byImpact = results.issues.reduce((acc, issue) => {
      acc[issue.impact] = acc[issue.impact] || [];
      acc[issue.impact].push(issue);
      return acc;
    }, {} as Record<string, AccessibilityIssue[]>);
    
    // 심각도 순서
    const impactOrder = ['critical', 'serious', 'moderate', 'minor'];
    
    impactOrder.forEach(impact => {
      const issues = byImpact[impact];
      
      if (issues?.length) {
        console.group(`${impact} (${issues.length})`);
        
        issues.forEach((issue, index) => {
          console.group(`문제 #${index + 1}: ${issue.type}`);
          console.log(`설명: ${issue.description}`);
          console.log(`해결 방법: ${issue.solution}`);
          console.log('요소:', issue.element);
          console.groupEnd();
        });
        
        console.groupEnd();
      }
    });
    
    console.groupEnd();
  }
  
  console.groupEnd();
}

/**
 * 페이지 로드 후 접근성 테스트 자동 실행
 * 
 * 개발 모드에서만 실행되는 자동 접근성 테스트
 */
export function initializeAccessibilityTesting(): void {
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
    return;
  }
  
  // 페이지 로드 후 접근성 테스트 실행
  window.addEventListener('load', () => {
    // 페이지가 완전히 로드된 후 약간의 지연 추가 (동적 콘텐츠 로드 대기)
    setTimeout(() => {
      const results = runAccessibilityTests();
      logAccessibilityResults(results);
      
      // 접근성 문제가 있는 요소 시각적으로 강조 표시 (개발 모드에서만)
      highlightAccessibilityIssues(results.issues);
    }, 1000);
  });
}

/**
 * 접근성 문제가 있는 요소 시각적으로 강조 표시
 * 
 * 개발 모드에서 접근성 문제가 있는 요소를 표시하여 쉽게 식별할 수 있게 함
 */
function highlightAccessibilityIssues(issues: AccessibilityIssue[]): void {
  if (typeof document === 'undefined') return;
  
  // 기존 강조 표시 제거
  const existingHighlights = document.querySelectorAll('.a11y-issue-highlight');
  existingHighlights.forEach(el => el.remove());
  
  // 각 문제에 대한 강조 표시 추가
  issues.forEach(issue => {
    try {
      const element = issue.element;
      const rect = element.getBoundingClientRect();
      
      // 강조 표시 요소 생성
      const highlight = document.createElement('div');
      highlight.className = 'a11y-issue-highlight';
      highlight.style.position = 'absolute';
      highlight.style.zIndex = '9999';
      highlight.style.pointerEvents = 'none';
      highlight.style.boxSizing = 'border-box';
      highlight.style.top = `${window.scrollY + rect.top}px`;
      highlight.style.left = `${window.scrollX + rect.left}px`;
      highlight.style.width = `${rect.width}px`;
      highlight.style.height = `${rect.height}px`;
      
      // 심각도에 따른 색상
      const colors = {
        critical: 'rgba(255, 0, 0, 0.5)',
        serious: 'rgba(255, 165, 0, 0.5)',
        moderate: 'rgba(255, 255, 0, 0.5)',
        minor: 'rgba(0, 0, 255, 0.3)'
      };
      
      highlight.style.border = `3px solid ${colors[issue.impact]}`;
      highlight.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      
      // 툴팁 추가
      highlight.title = `${issue.type}: ${issue.description}\n해결 방법: ${issue.solution}`;
      
      // 페이지에 추가
      document.body.appendChild(highlight);
    } catch (error) {
      console.error('접근성 문제 강조 표시 중 오류:', error);
    }
  });
}