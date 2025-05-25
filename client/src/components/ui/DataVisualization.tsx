import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { announceToScreenReader } from '@/components/a11y/AnnouncementRegion';

interface ProgressBarProps {
  value: number;
  max?: number;
  showValue?: boolean;
  valueFormat?: (value: number, max: number) => string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  animated?: boolean;
  thickness?: 'thin' | 'normal' | 'thick';
  label?: string;
  className?: string;
}

/**
 * 시각적 진행 상태 표시 컴포넌트
 * 
 * 진행 상태를 직관적으로 표시하는 프로그레스 바 컴포넌트입니다.
 * 접근성을 고려하여 스크린 리더에도 정보를 제공합니다.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showValue = true,
  valueFormat,
  size = 'md',
  color = 'primary',
  animated = false,
  thickness = 'normal',
  label,
  className,
}) => {
  // 값 범위 제한 (0 ~ max)
  const normalizedValue = Math.max(0, Math.min(value, max));
  const percentage = (normalizedValue / max) * 100;
  
  // 퍼센트 또는 커스텀 포맷으로 값 표시
  const formattedValue = valueFormat 
    ? valueFormat(normalizedValue, max)
    : `${Math.round(percentage)}%`;
  
  // 크기별 클래스 매핑
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };
  
  // 두께별 클래스 매핑
  const thicknessClasses = {
    thin: 'h-1',
    normal: '',
    thick: 'h-5',
  };
  
  // 색상별 클래스 매핑
  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
  };
  
  return (
    <div className={cn('w-full space-y-1', className)}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">{label}</label>
          {showValue && (
            <span className="text-sm text-muted-foreground">{formattedValue}</span>
          )}
        </div>
      )}
      
      <div 
        className={cn(
          'w-full bg-muted rounded-full overflow-hidden',
          sizeClasses[size],
          thicknessClasses[thickness]
        )}
        role="progressbar"
        aria-valuenow={normalizedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={formattedValue}
        aria-label={label || '진행 상태'}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            colorClasses[color],
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  className?: string;
}

/**
 * 주요 지표 표시 카드 컴포넌트
 * 
 * 중요한 수치 데이터를 시각적으로 강조하여 표시하는 카드 컴포넌트입니다.
 * 추세 표시 기능을 통해 데이터의 변화 방향을 직관적으로 파악할 수 있습니다.
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}) => {
  return (
    <div 
      className={cn(
        'rounded-lg border bg-card p-6 text-card-foreground shadow-sm',
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          
          {trend && (
            <div className="flex items-center mt-4">
              {trend.direction === 'up' && (
                <span className="flex items-center text-green-500 text-sm font-medium">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  {trend.value}%
                </span>
              )}
              
              {trend.direction === 'down' && (
                <span className="flex items-center text-red-500 text-sm font-medium">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {trend.value}%
                </span>
              )}
              
              {trend.direction === 'neutral' && (
                <span className="flex items-center text-gray-500 text-sm font-medium">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                  </svg>
                  {trend.value}%
                </span>
              )}
              
              {trend.label && (
                <span className="text-sm text-muted-foreground ml-2">
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

interface RadialProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  thickness?: number;
  showValue?: boolean;
  label?: string;
  className?: string;
}

/**
 * 원형 진행 상태 표시 컴포넌트
 * 
 * 동그란 형태로 진행 상태를 표시하는 컴포넌트입니다.
 * 직관적인 시각 효과와 애니메이션을 통해 사용자 경험을 향상시킵니다.
 */
export const RadialProgress: React.FC<RadialProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  thickness = 4,
  showValue = true,
  label,
  className,
}) => {
  // 값 범위 제한 (0 ~ max)
  const normalizedValue = Math.max(0, Math.min(value, max));
  const percentage = (normalizedValue / max) * 100;
  
  // 원형 진행 표시기 계산
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // 크기별 클래스 매핑
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };
  
  // 색상별 클래스 매핑
  const colorClasses = {
    primary: 'stroke-primary',
    secondary: 'stroke-secondary',
    success: 'stroke-green-500',
    warning: 'stroke-amber-500',
    danger: 'stroke-red-500',
  };
  
  const [isVisible, setIsVisible] = useState(false);
  
  // 애니메이션 효과
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      className={cn(
        'relative flex flex-col items-center justify-center',
        sizeClasses[size],
        className
      )}
      role="progressbar"
      aria-valuenow={normalizedValue}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={`${Math.round(percentage)}%`}
      aria-label={label || '진행 상태'}
    >
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* 배경 원 */}
        <circle
          className="stroke-muted fill-none"
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={thickness}
        />
        
        {/* 진행 원 */}
        <circle
          className={cn(
            'fill-none transition-all duration-1000 ease-in-out',
            colorClasses[color]
          )}
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={isVisible ? strokeDashoffset : circumference}
          transform="rotate(-90 50 50)"
        />
      </svg>
      
      {/* 중앙 텍스트 */}
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-semibold">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      {/* 레이블 */}
      {label && (
        <span className="mt-2 text-sm text-center font-medium">
          {label}
        </span>
      )}
    </div>
  );
};

interface DataStatusProps {
  data: any;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  children: React.ReactNode;
  errorComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  retry?: () => void;
}

/**
 * 데이터 상태 관리 및 시각화 컴포넌트
 * 
 * 데이터 로딩, 오류, 빈 상태를 처리하고 적절한 UI를 표시합니다.
 * 상태 변경 시 스크린 리더에 알림을 제공하여 접근성을 향상시킵니다.
 */
export const DataStatus: React.FC<DataStatusProps> = ({
  data,
  isLoading,
  isError,
  error,
  children,
  errorComponent,
  loadingComponent,
  emptyComponent,
  retry,
}) => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  useEffect(() => {
    // 상태 변경 시 스크린 리더에 알림
    if (isLoading) {
      announceToScreenReader('데이터를 로딩 중입니다.');
    } else if (isError) {
      announceToScreenReader('데이터 로딩 중 오류가 발생했습니다.', 'assertive');
    } else if (!data || (Array.isArray(data) && data.length === 0)) {
      announceToScreenReader('표시할 데이터가 없습니다.');
    } else {
      announceToScreenReader('데이터가 로드되었습니다.');
    }
  }, [isLoading, isError, data]);
  
  if (isLoading) {
    return (
      <div 
        className="flex flex-col items-center justify-center p-8 space-y-4"
        role="status"
        aria-label="데이터 로딩 중"
      >
        {loadingComponent || (
          <>
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
            <p className="text-muted-foreground text-center">
              {isMobile ? '로딩 중...' : '데이터를 불러오는 중입니다...'}
            </p>
          </>
        )}
      </div>
    );
  }
  
  if (isError) {
    return (
      <div 
        className="flex flex-col items-center justify-center p-8 space-y-4"
        role="alert"
        aria-live="assertive"
      >
        {errorComponent || (
          <>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-800">오류가 발생했습니다</h3>
              <p className="mt-2 text-sm text-red-600">
                {error?.message || '데이터를 불러오는 중 문제가 발생했습니다.'}
              </p>
            </div>
            {retry && (
              <button
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                onClick={retry}
              >
                다시 시도
              </button>
            )}
          </>
        )}
      </div>
    );
  }
  
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div 
        className="flex flex-col items-center justify-center p-8 space-y-4"
        role="status"
        aria-label="데이터 없음"
      >
        {emptyComponent || (
          <>
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">데이터가 없습니다</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                표시할 내용이 없습니다.
              </p>
            </div>
          </>
        )}
      </div>
    );
  }
  
  return <>{children}</>;
};