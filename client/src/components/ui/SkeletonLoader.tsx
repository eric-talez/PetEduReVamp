import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  circle?: boolean;
  width?: string | number;
  height?: string | number;
}

/**
 * 기본 스켈레톤 컴포넌트
 * 
 * 콘텐츠 로딩 중에 표시되는 스켈레톤 UI 요소입니다.
 * 다양한 형태와 크기로 조정 가능합니다.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  circle = false,
  width,
  height,
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-muted rounded-md',
        circle && 'rounded-full',
        className
      )}
      style={{
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }}
      aria-hidden="true"
      role="presentation"
    />
  );
};

interface SkeletonTextProps {
  lines?: number;
  width?: string | (string | number)[];
  className?: string;
  lineClassName?: string;
}

/**
 * 텍스트 스켈레톤 컴포넌트
 * 
 * 여러 줄의 텍스트 콘텐츠를 로딩 중에 표시하는 스켈레톤 UI입니다.
 * 각 줄의 너비를 개별적으로 조정할 수 있습니다.
 */
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  width = ['100%', '80%', '60%'],
  className,
  lineClassName,
}) => {
  const getLineWidth = (index: number) => {
    if (typeof width === 'string' || typeof width === 'number') {
      return width;
    }
    return width[index % width.length];
  };

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn('h-4', lineClassName)}
          width={getLineWidth(index)}
        />
      ))}
    </div>
  );
};

interface SkeletonCardProps {
  header?: boolean;
  footer?: boolean;
  image?: boolean;
  imageHeight?: string | number;
  lines?: number;
  className?: string;
}

/**
 * 카드 스켈레톤 컴포넌트
 * 
 * 카드 형태의 콘텐츠를 로딩 중에 표시하는 스켈레톤 UI입니다.
 * 헤더, 이미지, 본문, 푸터 등 다양한 구성 요소를 포함할 수 있습니다.
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  header = true,
  footer = true,
  image = true,
  imageHeight = 200,
  lines = 3,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden',
        className
      )}
      aria-hidden="true"
      role="presentation"
    >
      {header && (
        <div className="p-4 border-b">
          <div className="flex items-center space-x-4">
            <Skeleton circle width={40} height={40} />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </div>
        </div>
      )}

      {image && (
        <Skeleton
          className="w-full"
          height={imageHeight}
        />
      )}

      <div className="p-4">
        <SkeletonText lines={lines} />
      </div>

      {footer && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center">
            <Skeleton className="h-9 w-[80px]" />
            <Skeleton className="h-9 w-[120px]" />
          </div>
        </div>
      )}
    </div>
  );
};

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

/**
 * 테이블 스켈레톤 컴포넌트
 * 
 * 테이블 형태의 콘텐츠를 로딩 중에 표시하는 스켈레톤 UI입니다.
 * 행과 열 수를 지정하여 다양한 테이블 크기를 표현할 수 있습니다.
 */
export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  className,
}) => {
  return (
    <div
      className={cn('w-full overflow-hidden rounded-lg border', className)}
      aria-hidden="true"
      role="presentation"
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full caption-bottom">
          {showHeader && (
            <thead className="border-b bg-muted/50">
              <tr>
                {Array.from({ length: columns }).map((_, index) => (
                  <th key={`header-${index}`} className="p-3">
                    <Skeleton className="h-5 w-full max-w-[120px]" />
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
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 모든 컴포넌트는 이미 기본 및 명명된 내보내기로 선언되었습니다