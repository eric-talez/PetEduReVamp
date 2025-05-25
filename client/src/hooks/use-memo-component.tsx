import React, { ComponentType, memo } from 'react';

/**
 * 커스텀 비교 함수를 사용하여 React.memo로 컴포넌트를 최적화하는 유틸리티 함수
 * 
 * @param Component 메모이제이션할 컴포넌트
 * @param propsAreEqual 이전 props와 새 props를 비교하는 함수 (선택 사항)
 * @returns 메모이제이션된 컴포넌트
 */
export function memoWithName<P extends object>(
  Component: ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
): React.MemoExoticComponent<ComponentType<P>> {
  // 원본 표시 이름 보존
  const memoizedComponent = memo(Component, propsAreEqual);
  
  // 디버깅을 위해 표시 이름 설정
  const displayName = Component.displayName || Component.name || 'Component';
  memoizedComponent.displayName = `Memo(${displayName})`;
  
  return memoizedComponent;
}

/**
 * 속성(props)의 심층 비교를 수행하는 비교 함수
 * 
 * React.memo의 두 번째 매개변수로 사용하여 복잡한 객체 속성이 있는 경우에도
 * 정확한 비교를 보장합니다.
 * 
 * @param prevProps 이전 props
 * @param nextProps 새 props
 * @returns props가 동일한지 여부
 */
export function deepPropsComparison<P>(
  prevProps: Readonly<P>,
  nextProps: Readonly<P>
): boolean {
  // props 키 목록 가져오기
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);
  
  // 키 수가 다르면 props가 변경된 것
  if (prevKeys.length !== nextKeys.length) {
    return false;
  }
  
  // 각 키와 값을 비교
  return prevKeys.every(key => {
    const prevValue = prevProps[key as keyof P];
    const nextValue = nextProps[key as keyof P];
    
    // 함수는 참조가 달라도 동일하다고 간주 (함수를 props로 받는 경우 최적화)
    if (typeof prevValue === 'function' && typeof nextValue === 'function') {
      return true;
    }
    
    // 날짜 객체 비교
    if (prevValue instanceof Date && nextValue instanceof Date) {
      return prevValue.getTime() === nextValue.getTime();
    }
    
    // 객체와 배열은 JSON 문자열로 변환하여 비교 (심층 비교)
    if (
      typeof prevValue === 'object' && 
      prevValue !== null && 
      typeof nextValue === 'object' && 
      nextValue !== null
    ) {
      try {
        return JSON.stringify(prevValue) === JSON.stringify(nextValue);
      } catch (e) {
        // 순환 참조 등으로 JSON 변환 실패 시 false 반환
        return false;
      }
    }
    
    // 기본 값 비교 (기본 타입)
    return prevValue === nextValue;
  });
}

/**
 * 특정 props만 비교하는 비교 함수 생성기
 * 
 * 컴포넌트가 많은 props를 받지만 일부 props만 리렌더링에 영향을 주는 경우 유용합니다.
 * 
 * @param keys 비교할 props 키 배열
 * @returns props 비교 함수
 */
export function createPropsComparator<P extends object>(
  keys: (keyof P)[]
): (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean {
  return (prevProps: Readonly<P>, nextProps: Readonly<P>): boolean => {
    return keys.every(key => {
      const prevValue = prevProps[key];
      const nextValue = nextProps[key];
      
      if (typeof prevValue === 'object' && prevValue !== null && 
          typeof nextValue === 'object' && nextValue !== null) {
        try {
          return JSON.stringify(prevValue) === JSON.stringify(nextValue);
        } catch (e) {
          return false;
        }
      }
      
      return prevValue === nextValue;
    });
  };
}

/**
 * 지정된 props 키를 제외한 모든 props를 비교하는 비교 함수 생성기
 * 
 * 특정 props(예: 이벤트 핸들러)가 자주 변경되지만 컴포넌트 렌더링에는 영향을 주지 않는 경우 유용합니다.
 * 
 * @param excludeKeys 비교에서 제외할 props 키 배열
 * @returns props 비교 함수
 */
export function createExcludePropsComparator<P extends object>(
  excludeKeys: (keyof P)[]
): (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean {
  return (prevProps: Readonly<P>, nextProps: Readonly<P>): boolean => {
    const keys = Object.keys(prevProps) as (keyof P)[];
    
    return keys.every(key => {
      // 제외할 키 목록에 있으면 무시
      if (excludeKeys.includes(key)) {
        return true;
      }
      
      const prevValue = prevProps[key];
      const nextValue = nextProps[key];
      
      if (typeof prevValue === 'object' && prevValue !== null && 
          typeof nextValue === 'object' && nextValue !== null) {
        try {
          return JSON.stringify(prevValue) === JSON.stringify(nextValue);
        } catch (e) {
          return false;
        }
      }
      
      return prevValue === nextValue;
    });
  };
}

/**
 * 사용 예시:
 * 
 * // 기본 메모이제이션
 * const MemoizedComponent = memoWithName(MyComponent);
 * 
 * // 심층 비교를 사용한 메모이제이션
 * const DeepMemoizedComponent = memoWithName(MyComponent, deepPropsComparison);
 * 
 * // 특정 props만 비교하는 메모이제이션
 * const SelectiveMemoizedComponent = memoWithName(
 *   MyComponent, 
 *   createPropsComparator(['id', 'name'])
 * );
 * 
 * // 특정 props를 제외한 메모이제이션
 * const ExcludingMemoizedComponent = memoWithName(
 *   MyComponent,
 *   createExcludePropsComparator(['onClick', 'onHover'])
 * );
 */