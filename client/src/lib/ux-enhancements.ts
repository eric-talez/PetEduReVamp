// 사용자 경험 개선을 위한 핵심 설정

export const uxEnhancements = {
  // 페이지 이동 개선
  navigation: {
    // 부드러운 페이지 전환
    enableSmoothTransitions: true,
    transitionDuration: 200,
    
    // 로딩 상태 개선
    showProgressBar: true,
    minLoadingTime: 200, // 너무 빠른 깜빡임 방지
    
    // 브레드크럼 표시
    showBreadcrumbs: true,
    
    // 뒤로가기 버튼 강화
    enhanceBackButton: true
  },

  // 폼 입력 경험 개선
  forms: {
    // 실시간 유효성 검사
    enableRealTimeValidation: true,
    
    // 자동 저장 기능
    enableAutoSave: true,
    autoSaveInterval: 30000, // 30초
    
    // 입력 도움말
    showInputHints: true,
    
    // 진행 상태 표시
    showFormProgress: true,
    
    // 글자 수 카운터
    showCharacterCount: true
  },

  // 검색 및 필터링 개선
  search: {
    // 실시간 검색 결과
    enableLiveSearch: true,
    searchDebounceMs: 300,
    
    // 검색 기록
    saveSearchHistory: true,
    maxHistoryItems: 10,
    
    // 자동완성
    enableAutoComplete: true,
    
    // 고급 필터
    enableAdvancedFilters: true
  },

  // 알림 및 피드백 개선
  feedback: {
    // 성공/오류 메시지
    showToastNotifications: true,
    toastDuration: 4000,
    
    // 진행 상태 표시
    showProgressIndicators: true,
    
    // 확인 대화상자
    enableConfirmDialogs: true,
    
    // 도움말 툴팁
    enableHelpTooltips: true
  }
};

// 사용자 친화적 메시지
export const userFriendlyMessages = {
  loading: [
    "잠시만 기다려주세요...",
    "데이터를 불러오고 있습니다",
    "처리 중입니다",
    "곧 완료됩니다"
  ],
  
  success: [
    "성공적으로 완료되었습니다!",
    "저장되었습니다",
    "업데이트가 완료되었습니다",
    "작업이 성공했습니다"
  ],
  
  error: [
    "문제가 발생했습니다. 다시 시도해주세요",
    "네트워크 연결을 확인해주세요",
    "잠시 후 다시 시도해주세요",
    "오류가 발생했습니다"
  ],
  
  validation: {
    required: "필수 입력 항목입니다",
    email: "올바른 이메일 주소를 입력해주세요",
    password: "비밀번호는 8자 이상이어야 합니다",
    phone: "올바른 전화번호를 입력해주세요"
  }
};

// 접근성 개선
export const accessibilityImprovements = {
  // 키보드 네비게이션
  keyboard: {
    enableTabNavigation: true,
    enableArrowKeyNavigation: true,
    enableEnterKeyActivation: true,
    enableEscapeKeyClosing: true
  },
  
  // 스크린 리더 지원
  screenReader: {
    enableAriaLabels: true,
    enableAriaDescriptions: true,
    enableLiveRegions: true,
    enableLandmarkRoles: true
  },
  
  // 시각적 개선
  visual: {
    enableHighContrast: true,
    enableFocusIndicators: true,
    enableReducedMotion: true,
    minimumClickTargetSize: 44 // px
  }
};