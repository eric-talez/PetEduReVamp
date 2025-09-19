import React from 'react';
import { cn } from '@/lib/utils';

interface BaseSkeletonProps {
  className?: string;
  'data-testid'?: string;
}

interface SkeletonProps extends BaseSkeletonProps {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

/**
 * Base skeleton component for creating loading placeholders
 * Supports custom dimensions and circular variants
 */
export function Skeleton({ 
  className, 
  width, 
  height, 
  circle = false,
  'data-testid': testId,
  ...props 
}: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted rounded-md",
        circle && "rounded-full",
        className
      )}
      style={{
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }}
      aria-hidden="true"
      role="presentation"
      data-testid={testId || "skeleton-base"}
      {...props}
    />
  );
}

interface LoadingSkeletonProps extends BaseSkeletonProps {
  variant: 'text' | 'card' | 'table' | 'profile' | 'list' | 'dashboard' | 'course' | 'product' | 'notification';
  lines?: number;
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  showImage?: boolean;
  showAvatar?: boolean;
  imageHeight?: string | number;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Comprehensive loading skeleton component with multiple variants
 * Provides consistent loading states across the TALEZ platform
 * Enhanced with accessibility features for screen readers
 */
export function LoadingSkeleton({
  variant,
  lines = 3,
  rows = 5,
  columns = 4,
  showHeader = true,
  showImage = true,
  showAvatar = true,
  imageHeight = 200,
  size = 'md',
  className,
  'data-testid': testId,
}: LoadingSkeletonProps) {
  const baseTestId = testId || `loading-skeleton-${variant}`;

  // Wrapper component with accessibility attributes
  const SkeletonWrapper = ({ children, ariaLabel }: { children: React.ReactNode; ariaLabel: string }) => (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      data-testid={`${baseTestId}-wrapper`}
    >
      {children}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );

  // Text skeleton variant
  if (variant === 'text') {
    const widths = ['100%', '80%', '60%', '90%', '70%'];
    return (
      <SkeletonWrapper ariaLabel={`텍스트 콘텐츠 로딩 중 (${lines}줄)`}>
        <div className={cn('space-y-2', className)} data-testid={`${baseTestId}-text`}>
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-4"
              width={widths[index % widths.length]}
              data-testid={`${baseTestId}-text-line-${index}`}
            />
          ))}
        </div>
      </SkeletonWrapper>
    );
  }

  // Card skeleton variant
  if (variant === 'card') {
    return (
      <SkeletonWrapper ariaLabel="카드 콘텐츠 로딩 중">
        <div
          className={cn(
            'rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden',
            className
          )}
          data-testid={`${baseTestId}-card`}
        >
        {showHeader && (
          <div className="p-4 border-b">
            <div className="flex items-center space-x-4">
              <Skeleton circle width={40} height={40} data-testid={`${baseTestId}-card-avatar`} />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[120px]" data-testid={`${baseTestId}-card-title`} />
                <Skeleton className="h-3 w-[80px]" data-testid={`${baseTestId}-card-subtitle`} />
              </div>
            </div>
          </div>
        )}

        {showImage && (
          <Skeleton
            className="w-full"
            height={imageHeight}
            data-testid={`${baseTestId}-card-image`}
          />
        )}

        <div className="p-4">
          <LoadingSkeleton variant="text" lines={lines} data-testid={`${baseTestId}-card-content`} />
        </div>

        <div className="p-4 border-t">
          <div className="flex justify-between items-center">
            <Skeleton className="h-9 w-[80px]" data-testid={`${baseTestId}-card-action-1`} />
            <Skeleton className="h-9 w-[120px]" data-testid={`${baseTestId}-card-action-2`} />
          </div>
        </div>
      </div>
    </SkeletonWrapper>
    );
  }

  // Table skeleton variant
  if (variant === 'table') {
    return (
      <SkeletonWrapper ariaLabel="테이블 콘텐츠 로딩 중">
        <div
          className={cn('w-full overflow-hidden rounded-lg border', className)}
          data-testid={`${baseTestId}-table`}
        >
          <div className="w-full overflow-x-auto">
            <table className="w-full caption-bottom">
              {showHeader && (
                <thead className="border-b bg-muted/50">
                  <tr>
                    {Array.from({ length: columns }).map((_, index) => (
                      <th key={`header-${index}`} className="p-3">
                        <Skeleton 
                          className="h-5 w-full max-w-[120px]" 
                          data-testid={`${baseTestId}-table-header-${index}`}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                  <tr
                    key={`row-${rowIndex}`}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    {Array.from({ length: columns }).map((_, colIndex) => (
                      <td key={`cell-${rowIndex}-${colIndex}`} className="p-3">
                        <Skeleton
                          className="h-5"
                          width={`${Math.floor(Math.random() * 50) + 50}%`}
                          data-testid={`${baseTestId}-table-cell-${rowIndex}-${colIndex}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SkeletonWrapper>
    );
  }

  // Profile skeleton variant
  if (variant === 'profile') {
    const sizeMap = {
      sm: { avatar: 32, titleH: 'h-4', titleW: 'w-24', subtitleH: 'h-3', subtitleW: 'w-16' },
      md: { avatar: 48, titleH: 'h-5', titleW: 'w-32', subtitleH: 'h-4', subtitleW: 'w-24' },
      lg: { avatar: 64, titleH: 'h-6', titleW: 'w-40', subtitleH: 'h-4', subtitleW: 'w-32' }
    };

    const sizes = sizeMap[size];

    return (
      <div 
        className={cn('flex items-center space-x-4', className)}
        data-testid={`${baseTestId}-profile`}
      >
        <Skeleton
          circle
          width={sizes.avatar}
          height={sizes.avatar}
          data-testid={`${baseTestId}-profile-avatar`}
        />
        <div className="space-y-2">
          <Skeleton 
            className={cn(sizes.titleH, sizes.titleW)} 
            data-testid={`${baseTestId}-profile-name`}
          />
          <Skeleton 
            className={cn(sizes.subtitleH, sizes.subtitleW)} 
            data-testid={`${baseTestId}-profile-subtitle`}
          />
        </div>
      </div>
    );
  }

  // List skeleton variant
  if (variant === 'list') {
    return (
      <div className={cn('space-y-3', className)} data-testid={`${baseTestId}-list`}>
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 rounded-lg border">
            {showAvatar && (
              <Skeleton 
                circle 
                width={40} 
                height={40} 
                data-testid={`${baseTestId}-list-item-${index}-avatar`}
              />
            )}
            <div className="flex-1 space-y-2">
              <Skeleton 
                className="h-4 w-3/4" 
                data-testid={`${baseTestId}-list-item-${index}-title`}
              />
              <Skeleton 
                className="h-3 w-1/2" 
                data-testid={`${baseTestId}-list-item-${index}-subtitle`}
              />
            </div>
            <Skeleton 
              className="h-6 w-16" 
              data-testid={`${baseTestId}-list-item-${index}-action`}
            />
          </div>
        ))}
      </div>
    );
  }

  // Dashboard skeleton variant
  if (variant === 'dashboard') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)} data-testid={`${baseTestId}-dashboard`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="p-6 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-24" data-testid={`${baseTestId}-dashboard-tile-${index}-title`} />
              <Skeleton className="h-8 w-8 rounded-md" data-testid={`${baseTestId}-dashboard-tile-${index}-icon`} />
            </div>
            <Skeleton className="h-8 w-20 mb-2" data-testid={`${baseTestId}-dashboard-tile-${index}-value`} />
            <Skeleton className="h-4 w-32" data-testid={`${baseTestId}-dashboard-tile-${index}-label`} />
          </div>
        ))}
      </div>
    );
  }

  // Course skeleton variant
  if (variant === 'course') {
    return (
      <div className={cn('rounded-lg border bg-card overflow-hidden', className)} data-testid={`${baseTestId}-course`}>
        <Skeleton className="w-full h-48" data-testid={`${baseTestId}-course-thumbnail`} />
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-20" data-testid={`${baseTestId}-course-category`} />
            <Skeleton className="h-4 w-16" data-testid={`${baseTestId}-course-duration`} />
          </div>
          <Skeleton className="h-6 w-full mb-2" data-testid={`${baseTestId}-course-title`} />
          <Skeleton className="h-4 w-3/4 mb-4" data-testid={`${baseTestId}-course-description`} />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton circle width={24} height={24} data-testid={`${baseTestId}-course-instructor-avatar`} />
              <Skeleton className="h-4 w-20" data-testid={`${baseTestId}-course-instructor-name`} />
            </div>
            <Skeleton className="h-5 w-16" data-testid={`${baseTestId}-course-price`} />
          </div>
        </div>
      </div>
    );
  }

  // Product skeleton variant
  if (variant === 'product') {
    return (
      <div className={cn('rounded-lg border bg-card overflow-hidden', className)} data-testid={`${baseTestId}-product`}>
        <Skeleton className="w-full h-56" data-testid={`${baseTestId}-product-image`} />
        <div className="p-4">
          <Skeleton className="h-5 w-full mb-2" data-testid={`${baseTestId}-product-name`} />
          <Skeleton className="h-4 w-2/3 mb-3" data-testid={`${baseTestId}-product-description`} />
          
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-6 w-20" data-testid={`${baseTestId}-product-price`} />
            <Skeleton className="h-4 w-12" data-testid={`${baseTestId}-product-rating`} />
          </div>
          
          <Skeleton className="h-10 w-full" data-testid={`${baseTestId}-product-button`} />
        </div>
      </div>
    );
  }

  // Notification skeleton variant
  if (variant === 'notification') {
    return (
      <div className={cn('space-y-3', className)} data-testid={`${baseTestId}-notification`}>
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
            <Skeleton circle width={32} height={32} data-testid={`${baseTestId}-notification-${index}-icon`} />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" data-testid={`${baseTestId}-notification-${index}-title`} />
              <Skeleton className="h-3 w-full" data-testid={`${baseTestId}-notification-${index}-message`} />
              <Skeleton className="h-3 w-24" data-testid={`${baseTestId}-notification-${index}-time`} />
            </div>
            <Skeleton className="h-2 w-2 rounded-full" data-testid={`${baseTestId}-notification-${index}-indicator`} />
          </div>
        ))}
      </div>
    );
  }

  // Default fallback
  return (
    <Skeleton 
      className={className} 
      data-testid={`${baseTestId}-default`}
    />
  );
}

// Export individual skeleton components for backward compatibility
export { Skeleton as SkeletonBase };

// Convenient preset components
export function SkeletonCard(props: Omit<LoadingSkeletonProps, 'variant'>) {
  return <LoadingSkeleton variant="card" {...props} />;
}

export function SkeletonTable(props: Omit<LoadingSkeletonProps, 'variant'>) {
  return <LoadingSkeleton variant="table" {...props} />;
}

export function SkeletonText(props: Omit<LoadingSkeletonProps, 'variant'>) {
  return <LoadingSkeleton variant="text" {...props} />;
}

export function SkeletonProfile(props: Omit<LoadingSkeletonProps, 'variant'>) {
  return <LoadingSkeleton variant="profile" {...props} />;
}

export function SkeletonList(props: Omit<LoadingSkeletonProps, 'variant'>) {
  return <LoadingSkeleton variant="list" {...props} />;
}

export function SkeletonDashboard(props: Omit<LoadingSkeletonProps, 'variant'>) {
  return <LoadingSkeleton variant="dashboard" {...props} />;
}

export function SkeletonCourse(props: Omit<LoadingSkeletonProps, 'variant'>) {
  return <LoadingSkeleton variant="course" {...props} />;
}

export function SkeletonProduct(props: Omit<LoadingSkeletonProps, 'variant'>) {
  return <LoadingSkeleton variant="product" {...props} />;
}

export function SkeletonNotification(props: Omit<LoadingSkeletonProps, 'variant'>) {
  return <LoadingSkeleton variant="notification" {...props} />;
}