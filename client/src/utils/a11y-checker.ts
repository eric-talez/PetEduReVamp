/**
 * 접근성 검사 유틸리티
 * 
 * 이 파일은 웹 애플리케이션의 접근성을 검사하는 다양한 함수를 제공합니다.
 * WCAG 2.1 지침을 기반으로 합니다.
 */

/**
 * 이미지 접근성 검사
 * - alt 속성 존재 여부 확인
 * - 장식용 이미지인 경우 alt=""로 적절히 설정되었는지 확인
 */
export function checkImageAccessibility() {
  const images = document.querySelectorAll('img');
  let issues: string[] = [];
  
  images.forEach((img, index) => {
    // alt 속성 확인
    if (!img.hasAttribute('alt')) {
      issues.push(`이미지 #${index + 1} (${img.src.split('/').pop() || 'unknown'})에 alt 속성이 없습니다.`);
    }
    
    // 대체 텍스트가 너무 긴 경우 (일반적으로 150자 이상은 longdesc 속성이나 다른 방법을 사용해야 함)
    if (img.alt && img.alt.length > 150) {
      issues.push(`이미지 #${index + 1}의 alt 텍스트가 너무 깁니다 (${img.alt.length}자). 간결하게 유지하세요.`);
    }
  });
  
  return {
    type: 'image',
    issues,
    count: images.length,
    issueCount: issues.length
  };
}

/**
 * 색상 대비 검사
 * - 텍스트와 배경 간의 색상 대비 확인
 * - WCAG AA 기준 (4.5:1)을 만족하는지 확인
 */
export function checkColorContrast() {
  // 브라우저 환경에서만 실행
  if (typeof window === 'undefined') return { type: 'color', issues: [], count: 0, issueCount: 0 };
  
  // 색상 대비 계산 함수
  function calculateContrast(color1: string, color2: string): number {
    // RGB를 상대 휘도로 변환
    function getLuminance(color: string): number {
      // 16진수 색상을 RGB로 변환
      let r, g, b;
      
      // RGB 형식 파싱 (rgb(r, g, b) 또는 rgba(r, g, b, a))
      if (color.startsWith('rgb')) {
        const rgbValues = color.match(/\d+/g);
        if (!rgbValues || rgbValues.length < 3) return 0;
        
        r = parseInt(rgbValues[0]) / 255;
        g = parseInt(rgbValues[1]) / 255;
        b = parseInt(rgbValues[2]) / 255;
      } 
      // HEX 형식 파싱 (#RRGGBB)
      else if (color.startsWith('#')) {
        color = color.slice(1);
        r = parseInt(color.slice(0, 2), 16) / 255;
        g = parseInt(color.slice(2, 4), 16) / 255;
        b = parseInt(color.slice(4, 6), 16) / 255;
      } else {
        return 0; // 지원되지 않는 형식
      }
      
      // sRGB 색상 공간의 상대 휘도 계산
      const channels = [r, g, b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    }
    
    // 두 색상의 상대 휘도 계산
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    
    // 대비율 계산: (L1 + 0.05) / (L2 + 0.05), 여기서 L1은 더 밝은 색의 상대 휘도
    const ratio = l1 > l2 
      ? (l1 + 0.05) / (l2 + 0.05) 
      : (l2 + 0.05) / (l1 + 0.05);
    
    return ratio;
  }
  
  // 텍스트 요소 검사
  const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, span, label, button');
  let issues: string[] = [];
  
  textElements.forEach((element, index) => {
    if (!element.textContent?.trim()) return; // 텍스트가 없는 요소는 건너뜀
    
    const styles = window.getComputedStyle(element);
    const textColor = styles.color;
    const bgColor = styles.backgroundColor;
    
    // 배경색이 투명한 경우 부모 요소의 배경색을 찾음
    let parentBgColor = bgColor;
    if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
      let parent = element.parentElement;
      while (parent) {
        const parentStyles = window.getComputedStyle(parent);
        if (parentStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
            parentStyles.backgroundColor !== 'transparent') {
          parentBgColor = parentStyles.backgroundColor;
          break;
        }
        parent = parent.parentElement;
      }
    }
    
    // 부모 요소에서도 배경색을 찾지 못한 경우 (기본 배경색 사용)
    if (parentBgColor === 'rgba(0, 0, 0, 0)' || parentBgColor === 'transparent') {
      parentBgColor = 'rgb(255, 255, 255)'; // 기본 배경색을 흰색으로 가정
    }
    
    const contrast = calculateContrast(textColor, parentBgColor);
    
    // WCAG AA 기준: 일반 텍스트 4.5:1, 큰 텍스트 3:1
    const fontSize = parseFloat(styles.fontSize);
    const isBold = parseInt(styles.fontWeight) >= 700;
    const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold);
    
    const requiredContrast = isLargeText ? 3 : 4.5;
    
    if (contrast < requiredContrast) {
      const elementType = element.tagName.toLowerCase();
      const textPreview = element.textContent!.slice(0, 20) + (element.textContent!.length > 20 ? '...' : '');
      
      issues.push(
        `${elementType} 요소 #${index + 1} "${textPreview}"의 색상 대비가 부족합니다. ` +
        `현재 ${contrast.toFixed(2)}:1, 필요한 비율: ${requiredContrast}:1`
      );
    }
  });
  
  return {
    type: 'color',
    issues,
    count: textElements.length,
    issueCount: issues.length
  };
}

/**
 * 폼 접근성 검사
 * - 레이블이 적절히 연결되었는지 확인
 * - 필수 입력 필드가 적절히 표시되었는지 확인
 * - 오류 메시지가 적절히 연결되었는지 확인
 */
export function checkFormAccessibility() {
  const forms = document.querySelectorAll('form');
  let issues: string[] = [];
  let inputCount = 0;
  
  forms.forEach((form, formIndex) => {
    const inputs = form.querySelectorAll('input, select, textarea');
    inputCount += inputs.length;
    
    inputs.forEach((input, inputIndex) => {
      const inputElement = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      const inputId = inputElement.id;
      const inputType = inputElement.tagName.toLowerCase() === 'input' 
        ? (inputElement as HTMLInputElement).type 
        : inputElement.tagName.toLowerCase();
      
      // 히든 필드는 건너뜀
      if (inputType === 'hidden') return;
      
      // id 없는 입력 필드 확인
      if (!inputId) {
        issues.push(`폼 #${formIndex + 1}의 ${inputType} 필드에 id 속성이 없습니다.`);
      }
      
      // 레이블 연결 확인
      const associatedLabel = inputId 
        ? form.querySelector(`label[for="${inputId}"]`) 
        : null;
      
      if (!associatedLabel) {
        // aria-label이나 aria-labelledby 확인
        const hasAriaLabel = inputElement.hasAttribute('aria-label');
        const hasAriaLabelledBy = inputElement.hasAttribute('aria-labelledby');
        
        if (!hasAriaLabel && !hasAriaLabelledBy) {
          issues.push(`폼 #${formIndex + 1}의 ${inputType} 필드 #${inputIndex + 1}에 연결된 레이블이 없습니다.`);
        }
      }
      
      // 필수 필드 확인
      if (inputElement.hasAttribute('required')) {
        const hasAriaRequired = inputElement.getAttribute('aria-required') === 'true';
        
        if (!hasAriaRequired) {
          issues.push(`폼 #${formIndex + 1}의 필수 ${inputType} 필드 #${inputIndex + 1}에 aria-required="true" 속성이 없습니다.`);
        }
      }
      
      // 오류 메시지 연결 확인
      const hasAriaDescribedBy = inputElement.hasAttribute('aria-describedby');
      
      if (inputElement.hasAttribute('aria-invalid') && inputElement.getAttribute('aria-invalid') === 'true' && !hasAriaDescribedBy) {
        issues.push(`폼 #${formIndex + 1}의 유효하지 않은 ${inputType} 필드 #${inputIndex + 1}에 aria-describedby 속성이 없습니다.`);
      }
    });
    
    // 폼 제출 버튼 확인
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    
    if (!submitButton) {
      issues.push(`폼 #${formIndex + 1}에 제출 버튼이 없습니다.`);
    }
  });
  
  return {
    type: 'form',
    issues,
    count: inputCount,
    issueCount: issues.length
  };
}

/**
 * 키보드 접근성 검사
 * - 포커스 가능한 요소가 키보드로 접근 가능한지 확인
 * - 포커스 표시가 시각적으로 명확한지 확인
 */
export function checkKeyboardAccessibility() {
  const focusableElements = document.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  let issues: string[] = [];
  
  focusableElements.forEach((element, index) => {
    const styles = window.getComputedStyle(element);
    
    // 요소가 화면에 표시되지 않는 경우 건너뜀
    if (styles.display === 'none' || styles.visibility === 'hidden') return;
    
    // 포커스 상태 스타일 확인 (직접 확인하기 어려움, 대신 outline 속성 확인)
    if (styles.outlineStyle === 'none' && !element.classList.contains('focus-visible')) {
      const elementType = element.tagName.toLowerCase();
      const elementText = element.textContent || '';
      const elementName = elementText ? `"${elementText.slice(0, 20)}${elementText.length > 20 ? '...' : ''}"` : `#${index + 1}`;
      
      issues.push(`${elementType} 요소 ${elementName}에 포커스 표시가 없을 수 있습니다. 키보드 사용자가 현재 포커스 위치를 식별할 수 있도록 하세요.`);
    }
    
    // 링크 텍스트 확인
    if (element.tagName.toLowerCase() === 'a') {
      const linkElement = element as HTMLAnchorElement;
      const linkText = linkElement.textContent?.trim() || '';
      
      if (!linkText) {
        const ariaLabel = linkElement.getAttribute('aria-label');
        const ariaLabelledBy = linkElement.getAttribute('aria-labelledby');
        const title = linkElement.getAttribute('title');
        
        if (!ariaLabel && !ariaLabelledBy && !title) {
          issues.push(`링크 #${index + 1}에 텍스트나 접근성 레이블이 없습니다.`);
        }
      } else if (linkText.toLowerCase() === 'click here' || linkText.toLowerCase() === '여기를 클릭' || linkText.toLowerCase() === '여기') {
        issues.push(`링크 #${index + 1}에 의미 없는 텍스트 "${linkText}"가 사용되었습니다. 더 설명적인 링크 텍스트를 사용하세요.`);
      }
    }
  });
  
  return {
    type: 'keyboard',
    issues,
    count: focusableElements.length,
    issueCount: issues.length
  };
}

/**
 * 헤딩 구조 검사
 * - 헤딩 순서가 적절한지 확인 (h1 -> h2 -> h3...)
 * - 제목 없는 섹션이 있는지 확인
 */
export function checkHeadingStructure() {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let issues: string[] = [];
  
  let previousLevel = 0;
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    const headingText = heading.textContent?.trim() || '';
    
    // 빈 헤딩 확인
    if (!headingText) {
      issues.push(`${heading.tagName} #${index + 1}에 텍스트가 없습니다.`);
    }
    
    // 헤딩 순서 확인 (한 번에 두 단계 이상 건너뛰지 않아야 함)
    if (previousLevel > 0 && level > previousLevel + 1) {
      issues.push(`헤딩 순서가 잘못되었습니다: ${heading.tagName} "${headingText}"가 ${previousLevel}에서 ${level}로 건너뜁니다.`);
    }
    
    previousLevel = level;
  });
  
  // h1이 없는지 확인
  if (headings.length > 0 && headings[0].tagName.toLowerCase() !== 'h1') {
    issues.push('페이지에 h1 요소가 첫 번째 헤딩으로 사용되지 않았습니다.');
  }
  
  return {
    type: 'heading',
    issues,
    count: headings.length,
    issueCount: issues.length
  };
}

/**
 * ARIA 역할 및 속성 검사
 * - ARIA 역할이 적절히 사용되었는지 확인
 * - 필수 ARIA 속성이 제공되었는지 확인
 */
export function checkAriaUsage() {
  const elementsWithRole = document.querySelectorAll('[role]');
  let issues: string[] = [];
  
  // ARIA 역할별 필수 속성 매핑
  const requiredAttributes: Record<string, string[]> = {
    'checkbox': ['aria-checked'],
    'combobox': ['aria-expanded', 'aria-controls'],
    'listbox': ['aria-orientation'],
    'slider': ['aria-valuemin', 'aria-valuemax', 'aria-valuenow'],
    'tablist': ['aria-orientation'],
    'tabpanel': ['aria-labelledby'],
    'textbox': ['aria-multiline'],
  };
  
  elementsWithRole.forEach((element, index) => {
    const role = element.getAttribute('role');
    if (!role) return;
    
    // 요소 유형에 맞는 역할인지 확인
    const isValidRoleForElement = isValidRole(element as HTMLElement, role);
    
    if (!isValidRoleForElement) {
      issues.push(`요소 #${index + 1}에 부적절한 role="${role}"이(가) 사용되었습니다.`);
    }
    
    // 필수 ARIA 속성 확인
    const required = requiredAttributes[role] || [];
    
    for (const attr of required) {
      if (!element.hasAttribute(attr)) {
        issues.push(`role="${role}" 요소 #${index + 1}에 필수 ${attr} 속성이 누락되었습니다.`);
      }
    }
  });
  
  return {
    type: 'aria',
    issues,
    count: elementsWithRole.length,
    issueCount: issues.length
  };
}

/**
 * 요소에 대한 역할이 유효한지 확인
 */
function isValidRole(element: HTMLElement, role: string): boolean {
  const tagName = element.tagName.toLowerCase();
  
  // 기본적으로 허용되지 않는 역할
  const invalidRoles = {
    'a': ['button', 'menuitem'],
    'button': ['link', 'menuitem'],
    'input': {
      'checkbox': ['button', 'link'],
      'radio': ['button', 'link'],
      'text': ['button', 'link']
    }
  };
  
  if (tagName === 'input') {
    const inputType = element.getAttribute('type') || 'text';
    return !(invalidRoles['input'] && 
             invalidRoles['input'][inputType as keyof typeof invalidRoles['input']] && 
             (invalidRoles['input'][inputType as keyof typeof invalidRoles['input']] as string[]).includes(role));
  }
  
  return !(invalidRoles[tagName as keyof typeof invalidRoles] && 
           (invalidRoles[tagName as keyof typeof invalidRoles] as string[]).includes(role));
}

/**
 * 모든 접근성 검사를 실행하고 결과를 반환
 */
export function runAccessibilityCheck() {
  const imageResults = checkImageAccessibility();
  const colorResults = checkColorContrast();
  const formResults = checkFormAccessibility();
  const keyboardResults = checkKeyboardAccessibility();
  const headingResults = checkHeadingStructure();
  const ariaResults = checkAriaUsage();
  
  const totalIssues = imageResults.issueCount + colorResults.issueCount + formResults.issueCount + 
                      keyboardResults.issueCount + headingResults.issueCount + ariaResults.issueCount;
  
  return {
    summary: {
      totalIssues,
      imageIssues: imageResults.issueCount,
      colorIssues: colorResults.issueCount,
      formIssues: formResults.issueCount,
      keyboardIssues: keyboardResults.issueCount,
      headingIssues: headingResults.issueCount,
      ariaIssues: ariaResults.issueCount
    },
    details: {
      image: imageResults.issues,
      color: colorResults.issues,
      form: formResults.issues,
      keyboard: keyboardResults.issues,
      heading: headingResults.issues,
      aria: ariaResults.issues
    }
  };
}

/**
 * 브라우저 콘솔에 접근성 검사 결과를 출력
 */
export function logAccessibilityReport() {
  const results = runAccessibilityCheck();
  
  console.group('접근성 검사 보고서');
  console.log(`총 발견된 문제: ${results.summary.totalIssues}`);
  console.log(`이미지 관련 문제: ${results.summary.imageIssues}`);
  console.log(`색상 대비 문제: ${results.summary.colorIssues}`);
  console.log(`폼 접근성 문제: ${results.summary.formIssues}`);
  console.log(`키보드 접근성 문제: ${results.summary.keyboardIssues}`);
  console.log(`헤딩 구조 문제: ${results.summary.headingIssues}`);
  console.log(`ARIA 사용 문제: ${results.summary.ariaIssues}`);
  
  if (results.summary.totalIssues > 0) {
    console.group('상세 문제');
    
    if (results.details.image.length > 0) {
      console.group('이미지 접근성');
      results.details.image.forEach(issue => console.log(issue));
      console.groupEnd();
    }
    
    if (results.details.color.length > 0) {
      console.group('색상 대비');
      results.details.color.forEach(issue => console.log(issue));
      console.groupEnd();
    }
    
    if (results.details.form.length > 0) {
      console.group('폼 접근성');
      results.details.form.forEach(issue => console.log(issue));
      console.groupEnd();
    }
    
    if (results.details.keyboard.length > 0) {
      console.group('키보드 접근성');
      results.details.keyboard.forEach(issue => console.log(issue));
      console.groupEnd();
    }
    
    if (results.details.heading.length > 0) {
      console.group('헤딩 구조');
      results.details.heading.forEach(issue => console.log(issue));
      console.groupEnd();
    }
    
    if (results.details.aria.length > 0) {
      console.group('ARIA 사용');
      results.details.aria.forEach(issue => console.log(issue));
      console.groupEnd();
    }
    
    console.groupEnd();
  }
  
  console.groupEnd();
  
  return results;
}

/**
 * 포커스 가능한 요소 강조 토글
 * - 키보드 사용자를 위한 포커스 가능한 요소를 시각적으로 강조
 */
export function toggleFocusableHighlight() {
  const styleId = 'a11y-focusable-highlight';
  let styleElement = document.getElementById(styleId) as HTMLStyleElement;
  
  if (styleElement) {
    // 이미 활성화된 경우 제거
    styleElement.remove();
    console.log('포커스 가능한 요소 강조 기능이 비활성화되었습니다.');
    return false;
  } else {
    // 활성화
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = `
      a:focus, button:focus, input:focus, select:focus, textarea:focus, [tabindex]:not([tabindex="-1"]):focus,
      a:not([tabindex="-1"]), button:not([disabled]), input:not([disabled]), select:not([disabled]), 
      textarea:not([disabled]), [tabindex]:not([tabindex="-1"]) {
        outline: 2px solid #4d90fe !important;
        outline-offset: 2px !important;
      }
      
      a:not([tabindex="-1"]), button:not([disabled]), input:not([disabled]), select:not([disabled]), 
      textarea:not([disabled]), [tabindex]:not([tabindex="-1"]) {
        position: relative;
      }
      
      a:not([tabindex="-1"])::after, button:not([disabled])::after, input:not([disabled])::after, 
      select:not([disabled])::after, textarea:not([disabled])::after, [tabindex]:not([tabindex="-1"])::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px dashed rgba(77, 144, 254, 0.5);
        pointer-events: none;
      }
    `;
    document.head.appendChild(styleElement);
    console.log('포커스 가능한 요소 강조 기능이 활성화되었습니다.');
    return true;
  }
}

/**
 * 접근성 검사 도구를 DOM에 추가
 * - 페이지에 오버레이 형태로 접근성 검사 도구를 표시
 */
export function injectAccessibilityTool() {
  const toolId = 'a11y-checker-tool';
  
  // 이미 존재하는 경우 제거
  const existingTool = document.getElementById(toolId);
  if (existingTool) {
    existingTool.remove();
    return;
  }
  
  // 도구 컨테이너 생성
  const toolContainer = document.createElement('div');
  toolContainer.id = toolId;
  toolContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    padding: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    max-width: 400px;
    min-width: 300px;
    max-height: 500px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  `;
  
  // 헤더 생성
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
  `;
  
  const title = document.createElement('h3');
  title.textContent = '접근성 검사 도구';
  title.style.cssText = `
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  `;
  
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.style.cssText = `
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #666;
  `;
  closeButton.onclick = () => toolContainer.remove();
  
  header.appendChild(title);
  header.appendChild(closeButton);
  
  // 버튼 그룹 생성
  const buttonGroup = document.createElement('div');
  buttonGroup.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  `;
  
  // 검사 실행 버튼
  const runCheckButton = document.createElement('button');
  runCheckButton.textContent = '접근성 검사 실행';
  runCheckButton.style.cssText = `
    background: #4285F4;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    flex: 1;
  `;
  
  // 포커스 요소 강조 버튼
  const highlightButton = document.createElement('button');
  highlightButton.textContent = '포커스 요소 강조';
  highlightButton.style.cssText = `
    background: #F5F5F5;
    color: #333;
    border: 1px solid #DDD;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    flex: 1;
  `;
  
  // 결과 컨테이너
  const resultsContainer = document.createElement('div');
  resultsContainer.style.cssText = `
    margin-top: 10px;
    font-size: 14px;
  `;
  
  // 이벤트 핸들러
  runCheckButton.onclick = () => {
    const results = runAccessibilityCheck();
    
    // 결과 표시
    resultsContainer.innerHTML = '';
    
    const summary = document.createElement('div');
    summary.style.cssText = `
      background: ${results.summary.totalIssues > 0 ? '#FFF3CD' : '#D4EDDA'};
      color: ${results.summary.totalIssues > 0 ? '#856404' : '#155724'};
      padding: 8px;
      border-radius: 4px;
      margin-bottom: 10px;
    `;
    summary.textContent = results.summary.totalIssues > 0 
      ? `발견된 접근성 문제: ${results.summary.totalIssues}개` 
      : '접근성 문제가 발견되지 않았습니다!';
    
    resultsContainer.appendChild(summary);
    
    if (results.summary.totalIssues > 0) {
      const categories = [
        { name: '이미지 접근성', issues: results.details.image, count: results.summary.imageIssues },
        { name: '색상 대비', issues: results.details.color, count: results.summary.colorIssues },
        { name: '폼 접근성', issues: results.details.form, count: results.summary.formIssues },
        { name: '키보드 접근성', issues: results.details.keyboard, count: results.summary.keyboardIssues },
        { name: '헤딩 구조', issues: results.details.heading, count: results.summary.headingIssues },
        { name: 'ARIA 사용', issues: results.details.aria, count: results.summary.ariaIssues }
      ];
      
      categories.forEach(category => {
        if (category.count > 0) {
          const categoryElement = document.createElement('details');
          categoryElement.style.cssText = `
            margin-bottom: 8px;
          `;
          
          const summary = document.createElement('summary');
          summary.style.cssText = `
            font-weight: 600;
            cursor: pointer;
            padding: 4px 0;
          `;
          summary.textContent = `${category.name} (${category.count})`;
          
          const issuesList = document.createElement('ul');
          issuesList.style.cssText = `
            margin: 8px 0;
            padding-left: 20px;
            color: #555;
          `;
          
          category.issues.forEach(issue => {
            const issueItem = document.createElement('li');
            issueItem.textContent = issue;
            issueItem.style.marginBottom = '4px';
            issuesList.appendChild(issueItem);
          });
          
          categoryElement.appendChild(summary);
          categoryElement.appendChild(issuesList);
          resultsContainer.appendChild(categoryElement);
        }
      });
    }
  };
  
  highlightButton.onclick = () => {
    const isActive = toggleFocusableHighlight();
    highlightButton.textContent = isActive ? '포커스 강조 끄기' : '포커스 요소 강조';
    highlightButton.style.background = isActive ? '#E0E0E0' : '#F5F5F5';
  };
  
  // 요소 조합
  buttonGroup.appendChild(runCheckButton);
  buttonGroup.appendChild(highlightButton);
  
  toolContainer.appendChild(header);
  toolContainer.appendChild(buttonGroup);
  toolContainer.appendChild(resultsContainer);
  
  document.body.appendChild(toolContainer);
}

// 브라우저 환경에서만 전역으로 노출
if (typeof window !== 'undefined') {
  (window as any).a11yChecker = {
    runCheck: runAccessibilityCheck,
    logReport: logAccessibilityReport,
    toggleFocusable: toggleFocusableHighlight,
    injectTool: injectAccessibilityTool
  };
  
  console.log('접근성 검사 도구가 로드되었습니다. window.a11yChecker를 통해 접근할 수 있습니다.');
}