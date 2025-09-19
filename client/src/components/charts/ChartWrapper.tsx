import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Unified color theme for all charts
export const CHART_COLORS = {
  primary: '#3B82F6',      // Blue
  secondary: '#10B981',    // Green
  tertiary: '#8B5CF6',     // Purple
  quaternary: '#F59E0B',   // Amber
  success: '#059669',      // Emerald
  warning: '#D97706',      // Orange
  danger: '#DC2626',       // Red
  info: '#0891B2',         // Cyan
  neutral: '#6B7280',      // Gray
  
  // Gradient colors for areas
  gradients: {
    primary: ['#3B82F6', '#1D4ED8'],
    secondary: ['#10B981', '#047857'],
    tertiary: ['#8B5CF6', '#7C3AED'],
    success: ['#059669', '#065F46'],
    warning: ['#D97706', '#92400E'],
  },
  
  // Chart-specific color palettes
  pie: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'],
  bar: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'],
  line: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'],
};

// Common chart styling
export const CHART_STYLES = {
  grid: {
    strokeDasharray: '3 3',
    stroke: '#E5E7EB',
    opacity: 0.5,
  },
  axis: {
    tick: { fill: '#6B7280', fontSize: 12 },
    axisLine: { stroke: '#E5E7EB' },
    tickLine: { stroke: '#E5E7EB' },
  },
  tooltip: {
    contentStyle: {
      backgroundColor: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '12px',
    },
    cursor: { fill: 'rgba(59, 130, 246, 0.1)' },
  },
  legend: {
    wrapperStyle: {
      paddingTop: '20px',
      fontSize: '14px',
      color: '#374151',
    },
  },
};

// Chart container props
interface ChartWrapperProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  height?: number;
  className?: string;
  loading?: boolean;
  error?: string;
  actions?: React.ReactNode;
}

/**
 * Unified chart wrapper component for consistent styling across all charts
 * Provides standardized theming, responsive container, and loading/error states
 */
export function ChartWrapper({
  title,
  description,
  children,
  height = 300,
  className,
  loading = false,
  error,
  actions,
}: ChartWrapperProps) {
  return (
    <Card className={cn('w-full', className)}>
      {(title || description || actions) && (
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {title && (
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </CardTitle>
              )}
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div style={{ width: '100%', height: `${height}px` }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                차트 로딩 중...
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-red-500 mb-2">⚠️</div>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error || '차트를 불러올 수 없습니다'}
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <>{children}</>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Utility functions for chart data formatting
export const formatChartData = {
  currency: (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
    }).format(value);
  },
  
  percentage: (value: number) => {
    return `${value.toFixed(1)}%`;
  },
  
  number: (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value);
  },
  
  shortNumber: (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  },
};

// Common tooltip formatters
export const tooltipFormatters = {
  currency: (value: number) => [formatChartData.currency(value), ''],
  percentage: (value: number) => [formatChartData.percentage(value), ''],
  number: (value: number) => [formatChartData.number(value), ''],
};

// Chart theme configuration for dark mode
export const getChartTheme = (isDark: boolean) => ({
  colors: CHART_COLORS,
  grid: {
    ...CHART_STYLES.grid,
    stroke: isDark ? '#374151' : '#E5E7EB',
  },
  axis: {
    tick: { fill: isDark ? '#D1D5DB' : '#6B7280', fontSize: 12 },
    axisLine: { stroke: isDark ? '#374151' : '#E5E7EB' },
    tickLine: { stroke: isDark ? '#374151' : '#E5E7EB' },
  },
  tooltip: {
    contentStyle: {
      backgroundColor: isDark ? '#1F2937' : 'white',
      border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '12px',
      color: isDark ? '#F9FAFB' : '#111827',
    },
    cursor: { fill: 'rgba(59, 130, 246, 0.1)' },
  },
  legend: {
    wrapperStyle: {
      paddingTop: '20px',
      fontSize: '14px',
      color: isDark ? '#D1D5DB' : '#374151',
    },
  },
});

export default ChartWrapper;