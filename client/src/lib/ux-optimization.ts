// 사용자 경험(UX) 최적화 설정

export const uxOptimization = {
  // 로딩 상태 최적화
  loading: {
    minLoadingTime: 300, // 최소 로딩 시간 (너무 빠른 깜빡임 방지)
    maxLoadingTime: 5000, // 최대 로딩 시간 (타임아웃)
    showSkeletonUI: true, // 스켈레톤 UI 표시
  },

  // 폼 사용성 개선
  forms: {
    autoSave: true, // 자동 저장
    autoSaveInterval: 30000, // 30초마다 자동 저장
    showCharacterCount: true, // 글자 수 표시
    showProgressIndicator: true, // 진행 상태 표시
    enableRealTimeValidation: true, // 실시간 유효성 검사
  },

  // 네비게이션 최적화
  navigation: {
    enableBreadcrumbs: true, // 브레드크럼 표시
    showBackButton: true, // 뒤로가기 버튼
    enableSwipeGestures: true, // 모바일 스와이프
    rememberScrollPosition: true, // 스크롤 위치 기억
  },

  // 검색 경험 개선
  search: {
    enableAutoComplete: true, // 자동완성
    enableSearchHistory: true, // 검색 기록
    showRecentSearches: true, // 최근 검색어
    enableVoiceSearch: false, // 음성 검색 (API 키 필요시)
  },

  // 오류 처리 개선
  errorHandling: {
    showFriendlyMessages: true, // 사용자 친화적 오류 메시지
    enableRetryButton: true, // 재시도 버튼
    showErrorDetails: false, // 기술적 오류 상세 숨김
    enableOfflineSupport: true, // 오프라인 지원
  }
};

// 사용자 행동 분석을 위한 이벤트 추적
export const userAnalytics = {
  trackPageView: (pageName: string) => {
    // 실제 구현시 Google Analytics 등과 연동
    console.log(`페이지 조회: ${pageName}`);
  },

  trackUserAction: (action: string, category: string, label?: string) => {
    // 사용자 행동 추적
    console.log(`사용자 행동: ${action} - ${category}${label ? ` - ${label}` : ''}`);
  },

  trackError: (error: string, page: string) => {
    // 오류 추적
    console.log(`오류 발생: ${error} - ${page}`);
  }
};

// 접근성 및 사용성 검사
export const accessibilityChecker = {
  checkColorContrast: () => {
    // 색상 대비 검사
    return true;
  },

  checkKeyboardNavigation: () => {
    // 키보드 네비게이션 가능 여부 검사
    return true;
  },

  checkScreenReaderSupport: () => {
    // 스크린 리더 지원 검사
    return true;
  },

  checkMobileResponsiveness: () => {
    // 모바일 반응형 검사
    const isMobile = window.innerWidth < 768;
    const hasViewportMeta = document.querySelector('meta[name="viewport"]');
    return { isMobile, hasViewportMeta: !!hasViewportMeta };
  }
};