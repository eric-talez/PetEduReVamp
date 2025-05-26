// 라우터 설정 및 페이지 전환 최적화
export const routerConfig = {
  // 페이지 전환 시 스크롤 위치 복원
  restoreScrollPosition: true,
  
  // 페이지 전환 애니메이션 지연 시간
  transitionDelay: 100,
  
  // 프리로딩 설정
  enablePreloading: true,
};

// 페이지 전환 시 로딩 상태 관리
export class PageTransitionManager {
  private static isTransitioning = false;
  
  static startTransition() {
    this.isTransitioning = true;
    document.body.style.cursor = 'wait';
  }
  
  static endTransition() {
    this.isTransitioning = false;
    document.body.style.cursor = '';
    
    // 스크롤 위치 복원
    if (routerConfig.restoreScrollPosition) {
      window.scrollTo(0, 0);
    }
  }
  
  static isPageTransitioning() {
    return this.isTransitioning;
  }
}

// 페이지 프리로딩 함수
export const preloadRoute = (path: string) => {
  if (!routerConfig.enablePreloading) return;
  
  // 동적 import를 통한 페이지 프리로딩
  const routeMap: Record<string, () => Promise<any>> = {
    '/dashboard': () => import('../pages/dashboard/index'),
    '/trainers': () => import('../pages/trainers/index'),
    '/locations': () => import('../pages/locations/index'),
    '/shop': () => import('../pages/shop/index'),
    '/community': () => import('../pages/community/index'),
    '/events': () => import('../pages/events/index'),
    '/profile': () => import('../pages/profile/index'),
  };
  
  const loader = routeMap[path];
  if (loader) {
    loader().catch(() => {
      // 프리로딩 실패는 무시 (실제 네비게이션 시 다시 시도)
    });
  }
};