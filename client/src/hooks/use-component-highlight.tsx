import React, { useRef, useEffect, useState, ComponentType } from 'react';
import { cn } from '@/lib/utils';

/**
 * 개발 모드에서 컴포넌트 리렌더링을 시각적으로 강조하는 HOC (고차 컴포넌트)
 * 
 * 컴포넌트가 리렌더링될 때마다 시각적 표시기를 나타내어 불필요한 리렌더링을 식별하는 데 도움이 됩니다.
 * 개발 환경에서만 작동하며 프로덕션 환경에서는 원본 컴포넌트를 그대로 반환합니다.
 * 
 * @param Component 래핑할 컴포넌트
 * @param options 강조 옵션 (강조 색상, 지속 시간 등)
 * @returns 강조 효과가 있는 컴포넌트
 */
export function withRenderHighlight<P extends object>(
  Component: ComponentType<P>,
  options: {
    color?: string;
    duration?: number;
    showCount?: boolean;
    label?: string;
    disabled?: boolean;
  } = {}
): React.FC<P> {
  // 프로덕션 환경에서는 원본 컴포넌트 반환
  if (process.env.NODE_ENV === 'production' || options.disabled) {
    return Component as React.FC<P>;
  }

  // 기본 옵션 설정
  const {
    color = 'rgba(255, 0, 0, 0.2)',
    duration = 500,
    showCount = true,
    label = Component.displayName || Component.name || 'Component'
  } = options;

  // 강조 표시 래퍼 컴포넌트
  const HighlightedComponent: React.FC<P> = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [highlight, setHighlight] = useState(false);
    const renderCountRef = useRef(0);
    const [renderCount, setRenderCount] = useState(0);

    // 컴포넌트가 렌더링될 때마다 실행
    useEffect(() => {
      // 리렌더링 횟수 증가
      renderCountRef.current += 1;
      setRenderCount(renderCountRef.current);

      // 강조 효과 표시
      setHighlight(true);

      // 일정 시간 후 강조 효과 제거
      const timer = setTimeout(() => {
        setHighlight(false);
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    });

    // 개발 모드에서 콘솔 로그 출력
    useEffect(() => {
      console.log(`[개발] 컴포넌트 리렌더링: ${label} (${renderCountRef.current}회)`);
    });

    return (
      <div 
        ref={containerRef}
        className={cn(
          'relative',
          highlight ? 'dev-highlight' : ''
        )}
        style={{
          // 강조 효과 스타일
          '--highlight-color': highlight ? color : 'transparent'
        } as React.CSSProperties}
      >
        {/* 원본 컴포넌트 렌더링 */}
        <Component {...props} />
        
        {/* 리렌더링 횟수 표시기 (개발 모드에서만 표시) */}
        {showCount && (
          <div 
            className="absolute top-0 right-0 px-1 text-xs font-mono bg-black bg-opacity-70 text-white rounded z-50"
            style={{ fontSize: '10px' }}
          >
            {label}: {renderCount}
          </div>
        )}
        
        {/* 강조 효과용 오버레이 */}
        <style>{`
          .dev-highlight::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--highlight-color);
            pointer-events: none;
            z-index: 9999;
            transition: background-color 0.3s ease;
          }
        `}</style>
      </div>
    );
  };

  // 컴포넌트 표시 이름 설정 (디버깅용)
  HighlightedComponent.displayName = `Highlighted(${label})`;

  return HighlightedComponent;
}

/**
 * 사용 예시:
 * 
 * // 기본 사용법
 * const HighlightedButton = withRenderHighlight(Button);
 * 
 * // 커스텀 옵션 적용
 * const HighlightedCard = withRenderHighlight(Card, {
 *   color: 'rgba(0, 255, 0, 0.2)',
 *   duration: 1000,
 *   label: 'ProductCard'
 * });
 * 
 * // 리렌더링 표시기 비활성화
 * const HighlightedNav = withRenderHighlight(Navigation, { showCount: false });
 */