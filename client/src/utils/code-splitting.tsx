import React, { Suspense, lazy, ComponentType } from 'react';
import { DogLoading } from '@/components/DogLoading';

/**
 * 비동기적으로 컴포넌트를 로드하는 유틸리티 함수
 * 
 * @param importFn 컴포넌트를 동적으로 임포트하는 함수
 * @param fallback 로딩 중 표시할 컴포넌트
 * @returns 지연 로딩된 컴포넌트
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <DogLoading />
) {
  const LazyComponent = lazy(importFn);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * 특정 조건이 충족될 때만 컴포넌트를 로드하는 함수
 * 
 * @param importFn 컴포넌트를 동적으로 임포트하는 함수
 * @param condition 로드 조건
 * @param fallback 조건이 충족되지 않을 때 표시할 컴포넌트
 * @returns 조건부로 로드되는 컴포넌트
 */
export function conditionalLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  condition: boolean,
  fallback: React.ReactNode = null
) {
  if (!condition) return () => <>{fallback}</>;
  return lazyLoad(importFn);
}

/**
 * 특정 역할이 있는 사용자에게만 컴포넌트를 로드하는 함수
 * 
 * @param importFn 컴포넌트를 동적으로 임포트하는 함수
 * @param requiredRoles 필요한 역할 목록
 * @param userRole 현재 사용자 역할
 * @param fallback 권한이 없을 때 표시할 컴포넌트
 * @returns 역할 기반으로 로드되는 컴포넌트
 */
export function roleBasedLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  requiredRoles: string[],
  userRole: string | null,
  fallback: React.ReactNode = <div className="p-8">접근 권한이 없습니다.</div>
) {
  const hasAccess = userRole !== null && requiredRoles.includes(userRole);
  return conditionalLoad(importFn, hasAccess, fallback);
}

/**
 * 인증된 사용자에게만 컴포넌트를 로드하는 함수
 * 
 * @param importFn 컴포넌트를 동적으로 임포트하는 함수
 * @param isAuthenticated 인증 여부
 * @param fallback 인증되지 않았을 때 표시할 컴포넌트
 * @returns 인증 기반으로 로드되는 컴포넌트
 */
export function authProtectedLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  isAuthenticated: boolean,
  fallback: React.ReactNode = <div className="p-8">로그인이 필요합니다.</div>
) {
  return conditionalLoad(importFn, isAuthenticated, fallback);
}