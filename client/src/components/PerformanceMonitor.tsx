import React, { useState, useEffect } from 'react';
import { usePerformanceMonitor } from '@/hooks/use-performance-monitor';
import { X, RefreshCw, PieChart } from 'lucide-react';

interface PerformanceMonitorProps {
  initiallyOpen?: boolean;
}

/**
 * 성능 모니터링 컴포넌트
 * 
 * 개발 환경에서 실시간으로 애플리케이션 성능을 모니터링합니다.
 * FPS, 메모리 사용량, 로드 시간 등의 지표를 시각적으로 표시합니다.
 * 성능 최적화 과정에서 참고할 수 있는 유용한 도구입니다.
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  initiallyOpen = false 
}) => {
  // 프로덕션 환경에서는 렌더링하지 않음
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const metrics = usePerformanceMonitor();
  const [memoryWarning, setMemoryWarning] = useState(false);
  const [fpsWarning, setFpsWarning] = useState(false);
  
  // 성능 지표 모니터링 및 경고 표시
  useEffect(() => {
    // 메모리 사용량 임계값 (70%)
    if (metrics.memory) {
      const memoryUsagePercent = (metrics.memory.usedJSHeapSize / metrics.memory.jsHeapSizeLimit) * 100;
      setMemoryWarning(memoryUsagePercent > 70);
    }
    
    // FPS 임계값 (30fps 미만)
    setFpsWarning(metrics.fps < 30);
  }, [metrics]);
  
  // 성능 지표 토글 핸들러
  const toggleMonitor = () => {
    setIsOpen(!isOpen);
  };
  
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <>
      {/* 토글 버튼 */}
      <button
        onClick={toggleMonitor}
        className="fixed bottom-4 left-4 z-50 flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all"
        title="성능 모니터 토글"
        aria-label="성능 모니터 토글"
      >
        <PieChart className="w-5 h-5" />
        {(memoryWarning || fpsWarning) && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        )}
      </button>
      
      {/* 성능 모니터 패널 */}
      {isOpen && (
        <div 
          className="fixed bottom-16 left-4 z-50 w-80 bg-background border rounded-lg shadow-lg overflow-hidden"
          role="dialog"
          aria-label="성능 모니터"
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between p-3 bg-muted">
            <h3 className="text-sm font-medium">성능 모니터</h3>
            <button
              onClick={toggleMonitor}
              className="text-muted-foreground hover:text-foreground"
              aria-label="성능 모니터 닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* 성능 지표 */}
          <div className="p-3 space-y-3 text-sm">
            {/* FPS */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">FPS</span>
                <span className={`font-mono ${fpsWarning ? 'text-red-500' : ''}`}>
                  {metrics.fps.toFixed(1)}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded overflow-hidden">
                <div
                  className={`h-full ${fpsWarning ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min((metrics.fps / 60) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            {/* 메모리 사용량 */}
            {metrics.memory && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">메모리 사용량</span>
                  <span className={`font-mono ${memoryWarning ? 'text-red-500' : ''}`}>
                    {formatBytes(metrics.memory.usedJSHeapSize)} / {formatBytes(metrics.memory.jsHeapSizeLimit)}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded overflow-hidden">
                  <div
                    className={`h-full ${memoryWarning ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ 
                      width: `${(metrics.memory.usedJSHeapSize / metrics.memory.jsHeapSizeLimit) * 100}%` 
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* 로드 시간 */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">페이지 로드 시간</span>
              <span className="font-mono">{metrics.loadTime.toFixed(2)} ms</span>
            </div>
            
            {/* 렌더링 시간 */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">렌더링 시간</span>
              <span className="font-mono">{metrics.renderTime.toFixed(2)} ms</span>
            </div>
            
            {/* 상호작용 지연 */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">상호작용 지연</span>
              <span className={`font-mono ${metrics.interactionDelay > 100 ? 'text-amber-500' : ''}`}>
                {metrics.interactionDelay.toFixed(2)} ms
              </span>
            </div>
          </div>
          
          {/* 하단 툴바 */}
          <div className="flex justify-end p-2 bg-muted border-t">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center text-xs text-muted-foreground hover:text-foreground"
              title="페이지 새로고침"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              새로고침
            </button>
          </div>
        </div>
      )}
    </>
  );
};