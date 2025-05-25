import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory?: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
  loadTime: number;
  renderTime: number;
  interactionDelay: number;
}

type MetricsCallback = (metrics: PerformanceMetrics) => void;

/**
 * 애플리케이션 성능을 모니터링하는 커스텀 훅
 * 
 * FPS, 메모리 사용량, 로드 시간, 렌더링 시간, 상호작용 지연을 측정합니다.
 * 개발 모드에서 성능 병목을 식별하는 데 유용합니다.
 * 
 * @param onUpdate 성능 측정 결과를 받을 콜백 함수
 * @param enabled 모니터링 활성화 여부 (기본값: 개발 모드에서만 활성화)
 * @returns 현재 성능 지표
 */
export function usePerformanceMonitor(
  onUpdate?: MetricsCallback,
  enabled = process.env.NODE_ENV === 'development'
): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: undefined,
    loadTime: 0,
    renderTime: 0,
    interactionDelay: 0,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const interactionTimesRef = useRef<number[]>([]);
  const renderStartTimeRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  // 페이지 로드 시간 측정
  useEffect(() => {
    if (!enabled) return;

    // navigation timing API를 사용하여 페이지 로드 시간 측정
    const loadTime = 
      window.performance.timing.domContentLoadedEventEnd - 
      window.performance.timing.navigationStart;
    
    setMetrics(prev => ({ ...prev, loadTime }));
  }, [enabled]);

  // FPS 및 메모리 사용량 측정
  useEffect(() => {
    if (!enabled) return;
    if (isRunningRef.current) return;
    
    isRunningRef.current = true;
    
    // FPS 측정 함수
    const measureFPS = () => {
      frameCountRef.current += 1;
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;
      
      // 1초마다 FPS 계산
      if (elapsed >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / elapsed);
        
        // 메모리 사용량 측정 (Chrome 브라우저에서만 지원)
        let memory;
        if ((performance as any).memory) {
          memory = {
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          };
        }
        
        // 상호작용 지연 계산
        const interactionDelay = interactionTimesRef.current.length > 0
          ? interactionTimesRef.current.reduce((sum, time) => sum + time, 0) / interactionTimesRef.current.length
          : 0;
        
        // 지표 업데이트
        const newMetrics = { 
          ...metrics, 
          fps, 
          memory, 
          interactionDelay 
        };
        
        setMetrics(newMetrics);
        onUpdate?.(newMetrics);
        
        // 측정값 초기화
        frameCountRef.current = 0;
        lastTimeRef.current = now;
        interactionTimesRef.current = [];
      }
      
      // 다음 애니메이션 프레임에서 다시 측정
      requestAnimationFrame(measureFPS);
    };
    
    // 렌더링 시간 측정 시작
    renderStartTimeRef.current = performance.now();
    
    // FPS 측정 시작
    requestAnimationFrame(measureFPS);
    
    // 사용자 상호작용 이벤트 리스너 등록
    const trackInteractionDelay = () => {
      const interactionStartTime = performance.now();
      
      // 다음 프레임에서 지연 시간 측정
      requestAnimationFrame(() => {
        const delay = performance.now() - interactionStartTime;
        interactionTimesRef.current.push(delay);
      });
    };
    
    // 일반적인 상호작용 이벤트 감시
    const interactionEvents = ['click', 'keydown', 'touchstart', 'mousedown'];
    interactionEvents.forEach(event => {
      window.addEventListener(event, trackInteractionDelay, { passive: true });
    });
    
    // 컴포넌트 렌더링 완료 시간 측정
    const measureRenderTime = () => {
      if (renderStartTimeRef.current) {
        const renderTime = performance.now() - renderStartTimeRef.current;
        setMetrics(prev => ({ ...prev, renderTime }));
        renderStartTimeRef.current = null;
      }
    };
    
    // 렌더링 완료 후 측정
    requestAnimationFrame(() => {
      requestAnimationFrame(measureRenderTime);
    });
    
    // 클린업 함수
    return () => {
      isRunningRef.current = false;
      interactionEvents.forEach(event => {
        window.removeEventListener(event, trackInteractionDelay);
      });
    };
  }, [enabled, metrics, onUpdate]);
  
  return metrics;
}

/**
 * 컴포넌트 렌더링 시간을 측정하는 유틸리티 함수
 * 
 * 특정 컴포넌트나 함수의 실행 시간을 측정하여 콘솔에 출력합니다.
 * 
 * @param componentName 측정할 컴포넌트 또는 함수 이름
 * @param callback 측정할 함수
 * @returns 함수의 반환값
 */
export function measureRenderTime<T>(componentName: string, callback: () => T): T {
  if (process.env.NODE_ENV !== 'development') {
    return callback();
  }
  
  const startTime = performance.now();
  const result = callback();
  const endTime = performance.now();
  
  console.log(`[성능] ${componentName} 렌더링 시간: ${(endTime - startTime).toFixed(2)}ms`);
  
  return result;
}