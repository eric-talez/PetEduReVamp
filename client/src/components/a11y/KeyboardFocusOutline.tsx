import React, { useEffect } from 'react';

/**
 * 키보드 사용자를 위한 포커스 아웃라인 관리 컴포넌트
 * 
 * 마우스와 키보드 사용을 구분하여 키보드 사용자에게만 포커스 아웃라인을 표시합니다.
 * 이는 키보드 접근성을 개선하면서도 시각적으로 깔끔한 디자인을 유지합니다.
 */
export const KeyboardFocusOutline: React.FC = () => {
  useEffect(() => {
    // 사용자 입력 방식 감지
    let usingKeyboard = false;
    
    // 키보드 사용 감지
    const handleKeyDown = (event: KeyboardEvent) => {
      // Tab 키를 사용하는 경우 키보드 모드로 전환
      if (event.key === 'Tab') {
        document.body.classList.add('keyboard-user');
        usingKeyboard = true;
      }
    };
    
    // 마우스 사용 감지
    const handleMouseDown = () => {
      // 마우스 사용 시 키보드 모드 해제
      document.body.classList.remove('keyboard-user');
      usingKeyboard = false;
    };
    
    // 터치 사용 감지
    const handleTouchStart = () => {
      // 터치 사용 시 키보드 모드 해제
      document.body.classList.remove('keyboard-user');
      usingKeyboard = false;
    };
    
    // 포커스 이벤트 감지
    const handleFocus = (event: FocusEvent) => {
      // 키보드 사용 중인 경우에만 포커스 클래스 적용
      if (usingKeyboard && event.target instanceof HTMLElement) {
        event.target.classList.add('keyboard-focus');
      }
    };
    
    // 포커스 해제 이벤트 감지
    const handleBlur = (event: FocusEvent) => {
      // 포커스 클래스 제거
      if (event.target instanceof HTMLElement) {
        event.target.classList.remove('keyboard-focus');
      }
    };
    
    // 이벤트 리스너 등록
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('blur', handleBlur, true);
    
    // 초기 상태 설정 (페이지 로드 시 키보드 포커스가 있을 수 있음)
    if (document.activeElement && document.activeElement !== document.body) {
      document.body.classList.add('keyboard-user');
      usingKeyboard = true;
    }
    
    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('blur', handleBlur, true);
    };
  }, []);
  
  // 스타일 주입
  return (
    <style>{`
      /* 기본적으로 아웃라인 숨김 */
      :focus {
        outline: none;
      }
      
      /* 키보드 사용자를 위한 포커스 아웃라인 스타일 */
      .keyboard-user :focus,
      .keyboard-user .keyboard-focus {
        outline: 2px solid var(--focus-ring-color, #4c9aff);
        outline-offset: 2px;
      }
      
      /* 특정 대화형 요소에 대한 추가 스타일 */
      .keyboard-user button:focus,
      .keyboard-user a:focus,
      .keyboard-user input:focus,
      .keyboard-user select:focus,
      .keyboard-user textarea:focus {
        box-shadow: 0 0 0 3px rgba(76, 154, 255, 0.5);
      }
      
      /* 다크 모드에서의 포커스 스타일 */
      .dark .keyboard-user :focus,
      .dark .keyboard-user .keyboard-focus {
        outline-color: var(--focus-ring-color-dark, #7ab6ff);
      }
      
      /* 고대비 모드에서의 포커스 스타일 */
      @media (prefers-contrast: more) {
        .keyboard-user :focus,
        .keyboard-user .keyboard-focus {
          outline: 3px solid #0000FF !important;
          outline-offset: 3px !important;
        }
        
        .dark .keyboard-user :focus,
        .dark .keyboard-user .keyboard-focus {
          outline: 3px solid #FFFF00 !important;
          outline-offset: 3px !important;
        }
      }
    `}</style>
  );
};

export default KeyboardFocusOutline;