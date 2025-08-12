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
    
    // 로딩 텍스트 제거 - 프로그레스바만 표시

    // 더 빠르고 부드러운 프로그레스 애니메이션
    const progressSteps = [
      { progress: 20, delay: 30 },
      { progress: 45, delay: 100 },
      { progress: 70, delay: 200 },
      { progress: 90, delay: 300 }
    ];

    const timeouts: NodeJS.Timeout[] = [];
    
    progressSteps.forEach(({ progress: targetProgress, delay }) => {
      const timeout = setTimeout(() => {
        setProgress(targetProgress);
      }, delay);
      timeouts.push(timeout);
    });

    // 빠른 완료 애니메이션
    const completeTimeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 100);
    }, 380);

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      clearTimeout(completeTimeout);
    };
  }, [location, previousLocation]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* 심플한 프로그레스바 - 로딩 텍스트 없이 */}
      <div className="relative">
        <div
          className="h-0.5 bg-gradient-to-r from-primary via-primary/80 to-primary/40 transition-all duration-200 ease-out"
          style={{
            width: `${progress}%`,
            boxShadow: '0 0 4px rgba(43, 170, 97, 0.4)',
          }}
        />
      </div>
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