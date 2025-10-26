
import React from 'react';
import { cn } from '@/lib/utils';

// =====================
// TALEZ 듀오톤 아이콘 시스템
// =====================

export const TalezIcon: React.FC<{ 
  bg?: string; 
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}> = ({ bg = 'var(--tile-emerald)', size = 'md', children, className }) => {
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16', 
    lg: 'h-20 w-20'
  };

  return (
    <div
      className={cn('talez-icon-wrap', sizeClasses[size], className)}
      style={{ background: bg }}
    >
      {children}
    </div>
  );
};

export const IconPetCare = () => (
  <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
    {/* 강아지 얼굴 */}
    <circle cx="32" cy="32" r="18" fill="var(--tile-emerald)" />
    {/* 왼쪽 귀 */}
    <ellipse cx="20" cy="20" rx="6" ry="10" fill="hsl(var(--talez-primary))" />
    {/* 오른쪽 귀 */}
    <ellipse cx="44" cy="20" rx="6" ry="10" fill="hsl(var(--talez-primary))" />
    {/* 왼쪽 눈 */}
    <circle cx="26" cy="30" r="3" fill="hsl(var(--talez-primary))" />
    {/* 오른쪽 눈 */}
    <circle cx="38" cy="30" r="3" fill="hsl(var(--talez-primary))" />
    {/* 코 */}
    <ellipse cx="32" cy="38" rx="4" ry="3" fill="hsl(var(--talez-primary))" />
    {/* 입 */}
    <path d="M32 38 Q26 42 22 40 M32 38 Q38 42 42 40" stroke="hsl(var(--talez-primary))" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

export const IconTraining = () => (
  <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
    {/* 책 */}
    <rect x="12" y="16" width="40" height="32" rx="2" fill="var(--tile-purple)" />
    <path d="M32 16v32" stroke="hsl(var(--talez-primary))" strokeWidth="2" />
    {/* 책갈피 */}
    <path d="M28 16v10l4-3 4 3V16" fill="hsl(var(--talez-secondary))" />
    {/* 텍스트 라인 */}
    <line x1="18" y1="28" x2="28" y2="28" stroke="hsl(var(--talez-primary))" strokeWidth="2" strokeLinecap="round" />
    <line x1="18" y1="34" x2="28" y2="34" stroke="hsl(var(--talez-primary))" strokeWidth="2" strokeLinecap="round" />
    <line x1="18" y1="40" x2="26" y2="40" stroke="hsl(var(--talez-primary))" strokeWidth="2" strokeLinecap="round" />
    <line x1="36" y1="28" x2="46" y2="28" stroke="hsl(var(--talez-primary))" strokeWidth="2" strokeLinecap="round" />
    <line x1="36" y1="34" x2="46" y2="34" stroke="hsl(var(--talez-primary))" strokeWidth="2" strokeLinecap="round" />
    <line x1="36" y1="40" x2="44" y2="40" stroke="hsl(var(--talez-primary))" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconCertificate = () => (
  <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
    {/* 메달 */}
    <circle cx="32" cy="38" r="14" fill="var(--tile-yellow)" />
    <circle cx="32" cy="38" r="10" fill="hsl(var(--talez-secondary))" />
    {/* 별 */}
    <path d="M32 30l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" fill="#fff" />
    {/* 리본 왼쪽 */}
    <path d="M20 24l12 14-4 8-8-16V24z" fill="hsl(var(--talez-primary))" />
    {/* 리본 오른쪽 */}
    <path d="M44 24l-12 14 4 8 8-16V24z" fill="hsl(var(--talez-primary))" />
  </svg>
);

export const IconLocation = () => (
  <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
    {/* 위치 핀 */}
    <path d="M32 8C23 8 16 15 16 24c0 12 16 28 16 28s16-16 16-28c0-9-7-16-16-16z" fill="var(--tile-pink)" />
    {/* 건물 */}
    <rect x="26" y="20" width="12" height="12" rx="1" fill="hsl(var(--talez-primary))" />
    {/* 창문들 */}
    <rect x="28" y="22" width="3" height="3" fill="#fff" opacity="0.8" />
    <rect x="33" y="22" width="3" height="3" fill="#fff" opacity="0.8" />
    <rect x="28" y="27" width="3" height="3" fill="#fff" opacity="0.8" />
    <rect x="33" y="27" width="3" height="3" fill="#fff" opacity="0.8" />
  </svg>
);

export const IconVideoCall = () => (
  <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
    {/* 모니터 */}
    <rect x="10" y="14" width="44" height="30" rx="3" fill="var(--tile-blue)" />
    <rect x="14" y="18" width="36" height="22" rx="2" fill="hsl(var(--talez-primary))" />
    {/* 사람 실루엣 */}
    <circle cx="32" cy="26" r="4" fill="#fff" opacity="0.9" />
    <path d="M22 36c0-5 4-7 10-7s10 2 10 7" fill="#fff" opacity="0.9" />
    {/* 비디오 아이콘 */}
    <circle cx="44" cy="24" r="4" fill="hsl(var(--talez-secondary))" />
    <path d="M46 24l4-2v4z" fill="hsl(var(--talez-secondary))" />
    {/* 스탠드 */}
    <rect x="28" y="44" width="8" height="4" rx="1" fill="var(--tile-blue)" />
    <rect x="22" y="48" width="20" height="2" rx="1" fill="var(--tile-blue)" />
  </svg>
);

export const IconShield = () => (
  <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
    {/* 방패 */}
    <path d="M32 8l18 6v14c0 12-7.6 22.5-18 26C21.6 48.5 14 38 14 26V12l18-6z" fill="var(--tile-gray)" />
    <path d="M32 14l12 4v10c0 8-5 15-12 18-7-3-12-10-12-18V18l12-4z" fill="hsl(var(--talez-primary))" />
    {/* 체크마크 */}
    <path d="M26 28l4 4 8-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* 하트 (안전/사랑) */}
    <path d="M32 38c-3-3-6-5-6-7 0-1.7 1.3-3 3-3 1 0 2 .5 3 1.5 1-1 2-1.5 3-1.5 1.7 0 3 1.3 3 3 0 2-3 4-6 7z" fill="#fff" opacity="0.3" />
  </svg>
);

// =====================
// TALEZ 버튼 컴포넌트
// =====================

export const TalezButton: React.FC<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className, 
  onClick, 
  disabled = false 
}) => {
  const baseClasses = 'talez-btn';
  const variantClasses = {
    primary: 'talez-btn-primary',
    secondary: 'talez-btn-secondary', 
    ghost: 'talez-btn-ghost',
    outline: 'talez-btn-outline'
  };
  
  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    md: 'text-base px-5 py-3',
    lg: 'text-lg px-6 py-4'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// =====================
// TALEZ 카드 컴포넌트
// =====================

export const TalezCard: React.FC<{
  variant?: 'default' | 'feature' | 'pricing';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ variant = 'default', children, className, onClick }) => {
  const variantClasses = {
    default: 'talez-tile',
    feature: 'talez-feature-card',
    pricing: 'talez-pricing-card'
  };

  return (
    <div
      className={cn(variantClasses[variant], onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// =====================
// TALEZ 상태 배지
// =====================

export const TalezBadge: React.FC<{
  variant?: 'success' | 'info' | 'warning' | 'default';
  children: React.ReactNode;
  className?: string;
}> = ({ variant = 'default', children, className }) => {
  const variantClasses = {
    default: 'talez-status-badge',
    success: 'talez-status-badge talez-status-success',
    info: 'talez-status-badge talez-status-info', 
    warning: 'talez-status-badge talez-status-warning'
  };

  return (
    <span className={cn(variantClasses[variant], className)}>
      {children}
    </span>
  );
};

// =====================
// TALEZ 그리드 시스템
// =====================

export const TalezGrid: React.FC<{
  cols?: 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}> = ({ cols = 3, children, className }) => {
  const colClasses = {
    2: 'talez-grid-2',
    3: 'talez-grid-3', 
    4: 'talez-grid-4'
  };

  return (
    <div className={cn(colClasses[cols], className)}>
      {children}
    </div>
  );
};

// =====================
// TALEZ 페이지 헤더
// =====================

export const TalezPageHeader: React.FC<{
  title: string;
  subtitle?: string;
  badge?: string;
  children?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, badge, children, className }) => {
  return (
    <div className={cn('mb-8', className)}>
      {badge && (
        <TalezBadge variant="info" className="mb-4">
          {badge}
        </TalezBadge>
      )}
      <h1 className="text-4xl font-extrabold text-[var(--txt-strong)] md:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-lg text-[var(--txt-secondary)]">
          {subtitle}
        </p>
      )}
      {children && (
        <div className="mt-6">
          {children}
        </div>
      )}
    </div>
  );
};

// =====================
// TALEZ 섹션 컨테이너
// =====================

export const TalezSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  background?: 'default' | 'glass' | 'gradient';
}> = ({ children, className, background = 'default' }) => {
  const bgClasses = {
    default: '',
    glass: 'talez-glass',
    gradient: 'talez-bg-gradient text-white'
  };

  return (
    <section className={cn('py-16 px-4', bgClasses[background], className)}>
      <div className="mx-auto max-w-6xl">
        {children}
      </div>
    </section>
  );
};
