
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
    <circle cx="32" cy="32" r="20" fill="var(--tile-emerald)" />
    <path d="M20 28c2 0 4-2 4-4s-2-4-4-4-4 2-4 4 2 4 4 4zm8 0c2 0 4-2 4-4s-2-4-4-4-4 2-4 4 2 4 4 4zm8 0c2 0 4-2 4-4s-2-4-4-4-4 2-4 4 2 4 4 4zm8 0c2 0 4-2 4-4s-2-4-4-4-4 2-4 4 2 4 4 4z" fill="hsl(var(--talez-primary))" />
    <path d="M32 40c6 0 10-4 10-8H22c0 4 4 8 10 8z" fill="hsl(var(--talez-primary))" />
  </svg>
);

export const IconTraining = () => (
  <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
    <rect x="8" y="24" width="48" height="24" rx="12" fill="var(--tile-blue)" />
    <circle cx="20" cy="36" r="6" fill="hsl(var(--talez-primary))" />
    <circle cx="44" cy="36" r="6" fill="hsl(var(--talez-primary))" />
    <path d="M32 28v16" stroke="hsl(var(--talez-primary))" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const IconCertificate = () => (
  <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
    <rect x="12" y="8" width="40" height="32" rx="6" fill="var(--tile-yellow)" />
    <circle cx="32" cy="24" r="8" fill="hsl(var(--talez-secondary))" />
    <path d="M24 48l8-6 8 6V40H24v8z" fill="hsl(var(--talez-secondary))" />
    <path d="M26 22l3 3 6-6" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

export const IconLocation = () => (
  <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
    <circle cx="32" cy="28" r="16" fill="var(--tile-pink)" />
    <circle cx="32" cy="28" r="8" fill="hsl(var(--talez-primary))" />
    <path d="M32 44c-8-8-16-12-16-16 0-8.8 7.2-16 16-16s16 7.2 16 16c0 4-8 8-16 16z" fill="hsl(var(--talez-primary))" />
  </svg>
);

export const IconVideoCall = () => (
  <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
    <rect x="8" y="20" width="32" height="24" rx="6" fill="var(--tile-purple)" />
    <path d="M40 26l12-6v24l-12-6V26z" fill="hsl(var(--talez-accent))" />
    <circle cx="20" cy="28" r="4" fill="hsl(var(--talez-primary))" />
    <circle cx="32" cy="36" r="2" fill="hsl(var(--talez-primary))" />
  </svg>
);

export const IconShield = () => (
  <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
    <path d="M32 6l18 6v14c0 12-7.6 22.5-18 26C21.6 48.5 14 38 14 26V12l18-6z" fill="var(--tile-blue)" />
    <path d="M32 14l10 3v9c0 8-4.8 15-10 17-5.2-2-10-9-10-17v-9l10-3z" fill="hsl(var(--talez-primary))" />
    <path d="M26 28l4 4 8-8" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
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
