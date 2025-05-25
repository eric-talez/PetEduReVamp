import React from 'react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface CardGridProps {
  children: React.ReactNode;
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * 반응형 카드 그리드 컴포넌트
 * 
 * 다양한 화면 크기에 맞춰 자동으로 조정되는 카드 그리드 레이아웃입니다.
 * 열 수, 간격 등을 손쉽게 조정할 수 있습니다.
 */
export const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md',
  className,
}) => {
  const isSm = useMediaQuery('(min-width: 640px)');
  const isMd = useMediaQuery('(min-width: 768px)');
  const isLg = useMediaQuery('(min-width: 1024px)');
  const isXl = useMediaQuery('(min-width: 1280px)');
  
  // 화면 크기에 따른 열 수 결정
  let activeColumns = 1;
  
  if (typeof columns === 'number') {
    activeColumns = columns;
  } else {
    if (isXl && columns.xl) activeColumns = columns.xl;
    else if (isLg && columns.lg) activeColumns = columns.lg;
    else if (isMd && columns.md) activeColumns = columns.md;
    else if (isSm && columns.sm) activeColumns = columns.sm;
  }
  
  // 간격 크기에 따른 클래스 매핑
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };
  
  return (
    <div
      className={cn(
        'grid',
        `grid-cols-1 sm:grid-cols-${Math.min(columns.sm || 1, 12)} md:grid-cols-${Math.min(columns.md || 2, 12)} lg:grid-cols-${Math.min(columns.lg || 3, 12)} xl:grid-cols-${Math.min(columns.xl || 4, 12)}`,
        gapClasses[gap],
        className
      )}
      style={{
        // Tailwind의 동적 클래스가 작동하지 않을 경우를 위한 인라인 스타일 백업
        gridTemplateColumns: `repeat(${activeColumns}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  clickable?: boolean;
  selected?: boolean;
  bordered?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

/**
 * 다용도 카드 컴포넌트
 * 
 * 콘텐츠를 구분하여 표시하는 카드 컴포넌트입니다.
 * 호버, 클릭, 선택 상태 등 다양한 상호작용 효과를 지원합니다.
 */
export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  clickable = false,
  selected = false,
  bordered = true,
  padding = 'md',
  className,
  onClick,
}) => {
  // 패딩 크기에 따른 클래스 매핑
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };
  
  return (
    <div
      className={cn(
        'bg-card text-card-foreground rounded-lg shadow-sm',
        bordered && 'border',
        hover && 'transition-transform duration-200 hover:scale-[1.02] hover:shadow-md',
        clickable && 'cursor-pointer',
        selected && 'ring-2 ring-primary',
        paddingClasses[padding],
        className
      )}
      onClick={clickable ? onClick : undefined}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      onKeyDown={clickable && onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
};

interface CardMediaProps {
  src: string;
  alt: string;
  aspectRatio?: '1/1' | '4/3' | '16/9' | '21/9';
  position?: 'top' | 'bottom';
  overlay?: React.ReactNode;
  className?: string;
}

/**
 * 카드 미디어 컴포넌트
 * 
 * 카드 내에 이미지를 표시하기 위한 컴포넌트입니다.
 * 다양한 종횡비와 오버레이 효과를 지원합니다.
 */
export const CardMedia: React.FC<CardMediaProps> = ({
  src,
  alt,
  aspectRatio = '16/9',
  position = 'top',
  overlay,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        position === 'top' ? 'rounded-t-lg -mt-4 -mx-4 mb-4' : 'rounded-b-lg -mb-4 -mx-4 mt-4',
        className
      )}
      style={{ aspectRatio }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      
      {overlay && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          {overlay}
        </div>
      )}
    </div>
  );
};

interface CardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/**
 * 카드 헤더 컴포넌트
 * 
 * 카드 상단에 제목, 부제목, 아이콘, 액션 버튼 등을 배치하는 컴포넌트입니다.
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div className="flex items-center space-x-3">
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            {title}
          </h3>
          
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}

/**
 * 카드 푸터 컴포넌트
 * 
 * 카드 하단에 버튼, 정보 등을 배치하는 컴포넌트입니다.
 */
export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
  bordered = true,
}) => {
  return (
    <div
      className={cn(
        'mt-4 pt-4',
        bordered && 'border-t',
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 카드 콘텐츠 컴포넌트
 * 
 * 카드 내용을 담는 컴포넌트입니다.
 */
export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

// 컴포넌트들은 이미 기본 및 명명된 내보내기로 선언되었습니다