import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface PerformanceInfoProps {
  showDetails?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

/**
 * 성능 모니터링 컴포넌트
 * 
 * 애플리케이션의 실시간 성능 정보를 표시합니다.
 * 개발 모드에서 성능 병목 현상을 식별하는 데 도움이 됩니다.
 */
export function PerformanceInfo({
  showDetails = false,
  position = 'bottom-right',
  theme = 'auto',
  className,
}: PerformanceInfoProps) {
  const [fps, setFps] = useState<number>(0);
  const [memory, setMemory] = useState<number | null>(null);
  const [renderTime, setRenderTime] = useState<number>(0);
  const [networkRequests, setNetworkRequests] = useState<number>(0);
  
  const frames = useRef(0);
  const lastFrameTime = useRef(performance.now());
  const requestCount = useRef(0);
  
  // 포지션에 따른 클래스 매핑
  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };
  
  // 테마에 따른 클래스 매핑
  const getThemeClasses = () => {
    if (theme === 'auto') {
      return 'bg-background/80 text-foreground border-border';
    } else if (theme === 'dark') {
      return 'bg-black/80 text-white border-gray-700';
    } else {
      return 'bg-white/80 text-black border-gray-300';
    }
  };
  
  // FPS 계산
  useEffect(() => {
    let animationFrameId: number;
    
    const updateFps = () => {
      frames.current += 1;
      const currentTime = performance.now();
      const elapsed = currentTime - lastFrameTime.current;
      
      if (elapsed >= 1000) {
        setFps(Math.round((frames.current * 1000) / elapsed));
        frames.current = 0;
        lastFrameTime.current = currentTime;
        
        // 메모리 사용량 (지원되는 브라우저만)
        if (performance && 'memory' in performance) {
          // @ts-ignore: 브라우저 지원 여부 확인
          const memoryInfo = performance.memory;
          if (memoryInfo) {
            setMemory(Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024)));
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(updateFps);
    };
    
    animationFrameId = requestAnimationFrame(updateFps);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  // 렌더링 시간 측정
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      setRenderTime(endTime - startTime);
    };
  }, [fps]); // fps가 변경될 때마다 렌더링 시간 측정
  
  // 네트워크 요청 모니터링
  useEffect(() => {
    const originalFetch = window.fetch;
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;
    
    // Fetch API 모니터링
    window.fetch = function(...args) {
      requestCount.current += 1;
      setNetworkRequests(requestCount.current);
      return originalFetch.apply(this, args);
    };
    
    // XMLHttpRequest 모니터링
    XMLHttpRequest.prototype.open = function(...args) {
      originalXhrOpen.apply(this, args);
    };
    
    XMLHttpRequest.prototype.send = function(...args) {
      requestCount.current += 1;
      setNetworkRequests(requestCount.current);
      originalXhrSend.apply(this, args);
    };
    
    return () => {
      // 원래의 함수로 복원
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXhrOpen;
      XMLHttpRequest.prototype.send = originalXhrSend;
    };
  }, []);
  
  // 개발 모드에서만 표시
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div
      className={cn(
        'fixed z-50 p-2 rounded-lg border backdrop-blur-sm font-mono text-xs',
        positionClasses[position],
        getThemeClasses(),
        className
      )}
    >
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${fps > 50 ? 'bg-green-500' : fps > 30 ? 'bg-yellow-500' : 'bg-red-500'}`} />
        <span>{fps} FPS</span>
      </div>
      
      {showDetails && (
        <div className="mt-1 space-y-1 text-xs">
          {memory !== null && (
            <div>Memory: {memory} MB</div>
          )}
          <div>Render: {renderTime.toFixed(2)} ms</div>
          <div>Network: {networkRequests} req</div>
        </div>
      )}
    </div>
  );
}

interface HighlightUpdatesProps {
  enabled?: boolean;
  color?: string;
  duration?: number;
  className?: string;
}

/**
 * 컴포넌트 렌더링 하이라이트
 * 
 * 리렌더링되는 컴포넌트를 시각적으로 표시합니다.
 * 불필요한 리렌더링을 식별하고 최적화하는 데 유용합니다.
 */
export function HighlightUpdates({
  enabled = true,
  color = 'rgba(0, 255, 0, 0.3)',
  duration = 500,
  className,
}: HighlightUpdatesProps) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }
    
    // style 요소 생성
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.innerHTML = `
      .render-highlight {
        position: relative;
      }
      .render-highlight::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        animation: highlight-fade-out ${duration}ms ease-out forwards;
        z-index: 9999;
      }
      @keyframes highlight-fade-out {
        0% { background-color: ${color}; }
        100% { background-color: transparent; }
      }
    `;
    
    // React 개발 도구 API 사용 (개발 모드에서만 작동)
    // @ts-ignore
    if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined') {
      // @ts-ignore
      const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      const oldInject = hook.inject;
      
      hook.inject = function(renderer) {
        const oldOnCommitFiberRoot = hook.onCommitFiberRoot;
        
        hook.onCommitFiberRoot = (...args) => {
          const root = args[1];
          
          // 변경된 요소 하이라이트
          setTimeout(() => {
            try {
              highlightUpdatedNodes(root);
            } catch (error) {
              console.error('Failed to highlight updates:', error);
            }
          }, 0);
          
          return oldOnCommitFiberRoot.apply(this, args);
        };
        
        return oldInject.call(this, renderer);
      };
    }
    
    function highlightUpdatedNodes(root: any) {
      // 깊이 우선 탐색으로 DOM 노드 찾기
      function findDOMNodes(fiber: any): HTMLElement[] {
        const nodes: HTMLElement[] = [];
        
        if (!fiber) return nodes;
        
        // 실제 DOM 노드가 있는 경우 추가
        if (fiber.stateNode instanceof HTMLElement) {
          nodes.push(fiber.stateNode);
        }
        
        // 자식 노드 탐색
        if (fiber.child) {
          nodes.push(...findDOMNodes(fiber.child));
        }
        
        // 형제 노드 탐색
        if (fiber.sibling) {
          nodes.push(...findDOMNodes(fiber.sibling));
        }
        
        return nodes;
      }
      
      // 변경된 노드 하이라이트
      function highlightNode(node: HTMLElement) {
        // 이미 하이라이트 중인 요소는 건너뜀
        if (node.classList.contains('render-highlight')) {
          node.classList.remove('render-highlight');
          // 리플로우 강제
          void node.offsetWidth;
        }
        
        node.classList.add('render-highlight');
        
        // 일정 시간 후 클래스 제거
        setTimeout(() => {
          node.classList.remove('render-highlight');
        }, duration);
      }
      
      // 변경된 노드 찾기
      const current = root.current;
      if (current.firstEffect) {
        let effectNode = current.firstEffect;
        
        while (effectNode) {
          // DOM 노드 탐색 및 하이라이트
          const nodes = findDOMNodes(effectNode);
          nodes.forEach(highlightNode);
          
          effectNode = effectNode.nextEffect;
        }
      }
    }
    
    return () => {
      // 정리
      document.head.removeChild(style);
    };
  }, [enabled, color, duration]);
  
  // 개발 모드에서만 작동
  if (process.env.NODE_ENV !== 'development' || !enabled) {
    return null;
  }
  
  return (
    <div className={cn('fixed bottom-0 left-0 z-50 p-1 bg-black/30 text-white text-xs rounded-tr-md', className)}>
      렌더링 하이라이트 활성화됨
    </div>
  );
}

/**
 * 개발 도구 컴포넌트
 * 
 * 개발 모드에서 다양한 개발 도구를 제공하는 통합 컴포넌트입니다.
 * 성능 모니터링, 렌더링 하이라이트, 접근성 검사 등을 포함합니다.
 */
export function DevTools() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTools, setActiveTools] = useState({
    performanceInfo: true,
    highlightUpdates: false,
    accessibilityCheck: false,
  });
  
  // 개발 모드에서만 표시
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <>
      {/* 토글 버튼 */}
      <button
        className="fixed bottom-2 left-2 z-50 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full shadow-lg"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="개발 도구 토글"
      >
        {isExpanded ? '×' : '⚙️'}
      </button>
      
      {/* 도구 패널 */}
      {isExpanded && (
        <div className="fixed bottom-12 left-2 z-50 w-64 bg-background border rounded-lg shadow-lg p-3 text-sm">
          <h3 className="font-medium mb-2">개발 도구</h3>
          
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={activeTools.performanceInfo}
                onChange={() => setActiveTools({
                  ...activeTools,
                  performanceInfo: !activeTools.performanceInfo
                })}
                className="mr-2"
              />
              성능 정보
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={activeTools.highlightUpdates}
                onChange={() => setActiveTools({
                  ...activeTools,
                  highlightUpdates: !activeTools.highlightUpdates
                })}
                className="mr-2"
              />
              렌더링 하이라이트
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={activeTools.accessibilityCheck}
                onChange={() => setActiveTools({
                  ...activeTools,
                  accessibilityCheck: !activeTools.accessibilityCheck
                })}
                className="mr-2"
              />
              접근성 검사
            </label>
          </div>
          
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
            성능 최적화 및 디버깅을 위한 도구입니다.
          </div>
        </div>
      )}
      
      {/* 활성화된 도구들 */}
      {activeTools.performanceInfo && (
        <PerformanceInfo showDetails={true} />
      )}
      
      {activeTools.highlightUpdates && (
        <HighlightUpdates />
      )}
      
      {activeTools.accessibilityCheck && (
        <AccessibilityChecker />
      )}
    </>
  );
}

interface AccessibilityCheckerProps {
  className?: string;
}

/**
 * 접근성 검사 컴포넌트
 * 
 * 실시간으로 접근성 문제를 감지하고 표시합니다.
 * 웹 콘텐츠 접근성 지침(WCAG)에 따른 검사를 수행합니다.
 */
function AccessibilityChecker({ className }: AccessibilityCheckerProps) {
  const [issues, setIssues] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  
  useEffect(() => {
    if (!isRunning) return;
    
    // 접근성 검사 실행
    const runCheck = () => {
      try {
        // 간단한 접근성 검사 수행
        const foundIssues: any[] = [];
        
        // 이미지에 alt 속성 검사
        document.querySelectorAll('img').forEach((img) => {
          if (!img.hasAttribute('alt')) {
            foundIssues.push({
              element: img,
              type: 'missing-alt',
              message: '이미지에 대체 텍스트(alt)가 없습니다.'
            });
          }
        });
        
        // 폼 요소에 레이블 검사
        document.querySelectorAll('input, select, textarea').forEach((input) => {
          const inputElement = input as HTMLInputElement;
          const id = inputElement.id;
          
          if (id && !document.querySelector(`label[for="${id}"]`)) {
            const hasAriaLabel = inputElement.hasAttribute('aria-label') || 
                               inputElement.hasAttribute('aria-labelledby');
            
            if (!hasAriaLabel) {
              foundIssues.push({
                element: inputElement,
                type: 'missing-label',
                message: '입력 요소에 연결된 레이블이 없습니다.'
              });
            }
          }
        });
        
        // 색상 대비 검사 (간단 버전)
        document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a').forEach((element) => {
          const style = window.getComputedStyle(element);
          const bgColor = style.backgroundColor;
          const color = style.color;
          
          if (bgColor === 'rgba(0, 0, 0, 0)' || color === 'rgba(0, 0, 0, 0)') {
            return; // 투명 배경 또는 텍스트는 건너뜀
          }
          
          // 간단한 대비 검사 (정확한 계산은 더 복잡함)
          const isBgDark = bgColor.includes('rgb(0, 0, 0)') || bgColor.includes('rgba(0, 0, 0,');
          const isTextDark = color.includes('rgb(0, 0, 0)') || color.includes('rgba(0, 0, 0,');
          
          if (isBgDark === isTextDark) {
            foundIssues.push({
              element,
              type: 'contrast',
              message: '텍스트와 배경의 대비가 충분하지 않을 수 있습니다.'
            });
          }
        });
        
        // 결과 업데이트
        setIssues(foundIssues);
      } catch (error) {
        console.error('접근성 검사 중 오류:', error);
      }
    };
    
    // 초기 검사 실행
    runCheck();
    
    // 주기적으로 검사 실행
    const intervalId = setInterval(runCheck, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);
  
  // 개발 모드에서만 표시
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className={cn('fixed top-2 right-2 z-50 max-w-xs p-3 bg-background/90 border rounded-lg shadow-lg text-xs', className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">접근성 검사</h3>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="text-xs px-2 py-1 bg-muted rounded-md"
        >
          {isRunning ? '중지' : '시작'}
        </button>
      </div>
      
      {issues.length === 0 ? (
        <div className="text-green-500">감지된 문제 없음</div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          <div className="text-amber-500">발견된 문제: {issues.length}개</div>
          
          {issues.slice(0, 5).map((issue, index) => (
            <div key={index} className="p-2 bg-muted rounded-md">
              <div className="font-medium">{issue.type}</div>
              <div>{issue.message}</div>
            </div>
          ))}
          
          {issues.length > 5 && (
            <div className="text-muted-foreground">
              외 {issues.length - 5}개 더...
            </div>
          )}
        </div>
      )}
    </div>
  );
}