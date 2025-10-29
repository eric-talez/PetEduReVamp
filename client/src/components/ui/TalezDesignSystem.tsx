
import React from 'react';
import { cn } from '@/lib/utils';
import { Dog, BookOpen, Award, MapPin, Video, Shield } from 'lucide-react';

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
  <Dog className="h-8 w-8 text-primary" aria-hidden />
);

export const IconTraining = () => (
  <BookOpen className="h-8 w-8 text-primary" aria-hidden />
);

export const IconCertificate = () => (
  <Award className="h-8 w-8 text-primary" aria-hidden />
);

export const IconLocation = () => (
  <MapPin className="h-8 w-8 text-primary" aria-hidden />
);

export const IconVideoCall = () => (
  <Video className="h-8 w-8 text-primary" aria-hidden />
);

export const IconShield = () => (
  <Shield className="h-8 w-8 text-primary" aria-hidden />
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
