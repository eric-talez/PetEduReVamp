import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Progress } from '@/components/ui/enhanced-progress';

/**
 * 페이지 이동 시 프로그레스바를 표시하는 컴포넌트
 */
export const NavigationProgress: React.FC = () => {
  const [location] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('페이지 로딩 중...');
  const [previousLocation, setPreviousLocation] = useState(location);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // 초기 로드 시에는 프로그레스 바를 표시하지 않음
    if (isInitialLoad) {
      setIsInitialLoad(false);
      setPreviousLocation(location);
      return;
    }

    // 같은 페이지면 프로그레스바를 표시하지 않음
    if (location === previousLocation) {
      return;
    }

    // 모달이나 팝업 관련 경로 변경은 무시
    const ignoredRoutes = ['#', 'javascript:', 'mailto:', 'tel:'];
    if (ignoredRoutes.some(route => location.startsWith(route))) {
      return;
    }

    // URL 해시 변경만 일어난 경우는 무시 (같은 페이지 내 스크롤)
    const prevBase = previousLocation.split('#')[0];
    const currentBase = location.split('#')[0];
    if (prevBase === currentBase) {
      setPreviousLocation(location);
      return;
    }

    // 실제 페이지 이동에 대해서만 프로그레스 시작
    console.log('Navigation Progress: 실제 페이지 이동 감지', previousLocation, '->', location);
    setIsLoading(true);
    setProgress(0);
    setPreviousLocation(location);
    
    // 로딩 텍스트 설정
    const pathTexts: Record<string, string> = {
      '/dashboard': '대시보드 로딩 중...',
      '/admin': '관리자 페이지 로딩 중...',
      '/trainer': '훈련사 페이지 로딩 중...',
      '/institute': '기관 페이지 로딩 중...',
      '/courses': '강의 목록 로딩 중...',
      '/shop': '쇼핑몰 로딩 중...',
      '/community': '커뮤니티 로딩 중...',
      '/trainers': '훈련사 목록 로딩 중...',
      '/events': '이벤트 페이지 로딩 중...',
      '/video-call': '화상상담 페이지 로딩 중...',
      '/auth': '인증 페이지 로딩 중...',
    };
    
    const currentText = Object.keys(pathTexts).find(path => location.startsWith(path));
    setLoadingText(currentText ? pathTexts[currentText] : '페이지 로딩 중...');

    // 프로그레스 애니메이션 - 더 자연스러운 진행
    const progressSteps = [
      { progress: 15, delay: 50 },
      { progress: 35, delay: 150 },
      { progress: 60, delay: 300 },
      { progress: 85, delay: 500 },
      { progress: 95, delay: 700 },
      { progress: 100, delay: 900 }
    ];

    const timeouts: NodeJS.Timeout[] = [];
    
    progressSteps.forEach(({ progress: targetProgress, delay }) => {
      const timeout = setTimeout(() => {
        setProgress(targetProgress);
      }, delay);
      timeouts.push(timeout);
    });

    // 페이지 로딩 완료 - 짧은 지연시간으로 실제 네비게이션인지 확인
    const completeTimeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 150);
    }, 600);

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      clearTimeout(completeTimeout);
    };
  }, [location, previousLocation]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* 프로그레스바 */}
      <div className="relative">
        <div 
          className="h-1 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"
          style={{ width: '100%' }}
        />
        <div
          className="absolute top-0 h-1 bg-gradient-to-r from-primary via-primary/90 to-primary/60 transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            boxShadow: '0 0 8px rgba(43, 170, 97, 0.6)',
          }}
        />
        {/* 글리터 효과 */}
        {progress > 10 && progress < 100 && (
          <div
            className="absolute top-0 h-1 w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
            style={{
              left: `${Math.max(0, progress - 8)}%`,
              animation: 'shimmer 1.5s infinite',
            }}
          />
        )}
      </div>
      
      {/* 로딩 텍스트는 제거하여 더 깔끔한 UI 제공 */}
    </div>
  );
};

/**
 * 글로벌 네비게이션 프로그레스 훅
 */
export const useNavigationProgress = () => {
  const [isNavigating, setIsNavigating] = useState(false);

  const startProgress = () => setIsNavigating(true);
  const stopProgress = () => setIsNavigating(false);

  return {
    isNavigating,
    startProgress,
    stopProgress,
  };
};

/**
 * 수동으로 프로그레스바를 제어할 수 있는 컴포넌트
 */
export const ManualNavigationProgress: React.FC<{
  isLoading: boolean;
  progress?: number;
}> = ({ isLoading, progress = 0 }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Progress
        value={Math.min(progress, 100)}
        variant="default"
        size="sm"
        animated={progress < 90}
        className="rounded-none bg-transparent h-1"
        style={{
          background: 'linear-gradient(90deg, rgba(43, 170, 97, 0.1) 0%, rgba(43, 170, 97, 0.2) 100%)',
        }}
      />
    </div>
  );
};

export default NavigationProgress;