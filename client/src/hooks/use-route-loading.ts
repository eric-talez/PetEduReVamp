import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface RouteLoadingState {
  isLoading: boolean;
  progress: number;
  currentRoute: string;
  loadingMessage: string;
}

// 글로벌 로딩 상태 관리
let globalLoadingState: RouteLoadingState = {
  isLoading: false,
  progress: 0,
  currentRoute: '',
  loadingMessage: ''
};

const listeners: Array<(state: RouteLoadingState) => void> = [];

// 로딩 상태 변경 함수
export const setRouteLoading = (loading: boolean, route?: string, message?: string) => {
  globalLoadingState = {
    ...globalLoadingState,
    isLoading: loading,
    currentRoute: route || globalLoadingState.currentRoute,
    loadingMessage: message || '페이지 로딩 중...',
    progress: loading ? 30 : 100
  };
  
  // 모든 리스너에게 상태 변경 알림
  listeners.forEach(listener => listener(globalLoadingState));
  
  // 진행률 애니메이션
  if (loading) {
    simulateProgressAnimation();
  }
};

// 진행률 애니메이션 시뮬레이션
const simulateProgressAnimation = () => {
  let currentProgress = 30;
  const interval = setInterval(() => {
    currentProgress += Math.random() * 15;
    if (currentProgress >= 90) {
      currentProgress = 90;
      clearInterval(interval);
    }
    
    globalLoadingState.progress = currentProgress;
    listeners.forEach(listener => listener(globalLoadingState));
  }, 150);
};

// 로딩 상태 완료 처리
export const completeRouteLoading = () => {
  globalLoadingState.progress = 100;
  listeners.forEach(listener => listener(globalLoadingState));
  
  setTimeout(() => {
    setRouteLoading(false);
  }, 300);
};

// 로딩 상태 훅
export const useRouteLoading = () => {
  const [state, setState] = useState<RouteLoadingState>(globalLoadingState);
  
  useEffect(() => {
    const listener = (newState: RouteLoadingState) => {
      setState(newState);
    };
    
    listeners.push(listener);
    
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);
  
  return state;
};

// 페이지 로딩 자동 감지 훅
export const usePageLoadingDetector = () => {
  const [location] = useLocation();
  
  useEffect(() => {
    // 라우트 변경 시 로딩 시작
    const routeNames: Record<string, string> = {
      '/': '홈',
      '/dashboard': '대시보드',
      '/courses': '강의',
      '/trainers': '훈련사',
      '/community': '커뮤니티',
      '/admin': '관리자',
      '/messages': '메시지',
      '/my-pets': '내 펫',
      '/locations': '위치 찾기',
      '/shop': '쇼핑',
      '/settings': '설정'
    };
    
    const currentRouteName = routeNames[location] || '페이지';
    setRouteLoading(true, location, `${currentRouteName} 로딩 중...`);
    
    // 일정 시간 후 로딩 완료
    const timer = setTimeout(() => {
      completeRouteLoading();
    }, 800);
    
    return () => clearTimeout(timer);
  }, [location]);
};