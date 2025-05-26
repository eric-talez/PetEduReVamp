// 웹 접근성 (WCAG 2.1 AA) 준수를 위한 유틸리티

export const accessibilityConfig = {
  // 키보드 네비게이션 지원
  enableKeyboardNavigation: true,
  
  // 스크린 리더 지원
  enableScreenReader: true,
  
  // 고대비 모드 지원
  enableHighContrast: true,
  
  // 포커스 표시 강화
  enhancedFocus: true,
};

// ARIA 레이블 및 역할 설정
export const ariaLabels = {
  navigation: {
    main: "메인 네비게이션",
    breadcrumb: "현재 위치",
    pagination: "페이지 네비게이션",
    search: "검색",
  },
  buttons: {
    close: "닫기",
    menu: "메뉴 열기",
    submit: "제출",
    edit: "편집",
    delete: "삭제",
    save: "저장",
  },
  forms: {
    required: "필수 입력 항목",
    optional: "선택 입력 항목",
    error: "입력 오류",
    success: "입력 완료",
  },
  status: {
    loading: "로딩 중",
    success: "성공",
    error: "오류 발생",
    warning: "주의",
  }
};

// 키보드 네비게이션 핸들러
export const keyboardNavigation = {
  handleEnterKey: (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  },
  
  handleEscapeKey: (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      callback();
    }
  },
  
  handleArrowKeys: (onUp: () => void, onDown: () => void, onLeft: () => void, onRight: () => void) => 
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          onUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          onDown();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onRight();
          break;
      }
    }
};

// 포커스 관리
export const focusManagement = {
  trapFocus: (containerRef: React.RefObject<HTMLElement>) => {
    const focusableElements = containerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (!focusableElements || focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    return (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
  },
  
  restoreFocus: (previousElement: HTMLElement | null) => {
    if (previousElement) {
      previousElement.focus();
    }
  }
};

// 색상 대비 검사
export const colorContrast = {
  checkContrast: (foreground: string, background: string): boolean => {
    // 간단한 색상 대비 검사 (실제로는 더 정교한 알고리즘 필요)
    // WCAG AA 기준: 4.5:1 이상의 대비율 필요
    return true; // 실제 구현시 색상 대비 계산 로직 추가
  }
};

// 텍스트 크기 조절
export const textSizing = {
  scaleText: (scale: number) => {
    document.documentElement.style.fontSize = `${16 * scale}px`;
  },
  
  resetTextSize: () => {
    document.documentElement.style.fontSize = '16px';
  }
};