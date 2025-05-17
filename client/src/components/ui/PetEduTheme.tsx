import React from "react";

/**
 * 강아지 발자국 모양의 로딩 인디케이터
 */
export const PawprintLoading = ({ size = "medium", color = "primary" }: { size?: "small" | "medium" | "large", color?: "primary" | "secondary" | "gray" }) => {
  // 크기별 클래스 매핑
  const sizeClasses = {
    small: "h-5 w-5",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };
  
  // 색상별 클래스 매핑
  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    gray: "text-gray-400 dark:text-gray-600",
  };
  
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-bounce ${sizeClasses[size]} ${colorClasses[color]}`}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 13.5C9.32843 13.5 10 12.8284 10 12C10 11.1716 9.32843 10.5 8.5 10.5C7.67157 10.5 7 11.1716 7 12C7 12.8284 7.67157 13.5 8.5 13.5Z" fill="currentColor"/>
          <path d="M15.5 13.5C16.3284 13.5 17 12.8284 17 12C17 11.1716 16.3284 10.5 15.5 10.5C14.6716 10.5 14 11.1716 14 12C14 12.8284 14.6716 13.5 15.5 13.5Z" fill="currentColor"/>
          <path d="M12 7.5C12.8284 7.5 13.5 6.82843 13.5 6C13.5 5.17157 12.8284 4.5 12 4.5C11.1716 4.5 10.5 5.17157 10.5 6C10.5 6.82843 11.1716 7.5 12 7.5Z" fill="currentColor"/>
          <path d="M5.5 9.5C6.32843 9.5 7 8.82843 7 8C7 7.17157 6.32843 6.5 5.5 6.5C4.67157 6.5 4 7.17157 4 8C4 8.82843 4.67157 9.5 5.5 9.5Z" fill="currentColor"/>
          <path d="M18.5 9.5C19.3284 9.5 20 8.82843 20 8C20 7.17157 19.3284 6.5 18.5 6.5C17.6716 6.5 17 7.17157 17 8C17 8.82843 17.6716 9.5 18.5 9.5Z" fill="currentColor"/>
        </svg>
      </div>
    </div>
  );
};

/**
 * 강아지 모티프 페이지 타이틀 컴포넌트
 */
export const TalezPageTitle = ({ 
  title, 
  subtitle,
  icon
}: { 
  title: string, 
  subtitle?: string,
  icon?: React.ReactNode
}) => {
  return (
    <div className="flex items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      {icon && (
        <div className="mr-3 text-primary">{icon}</div>
      )}
      <div>
        <h1 className="text-title-large">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className="ml-auto text-primary">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 13.5C9.32843 13.5 10 12.8284 10 12C10 11.1716 9.32843 10.5 8.5 10.5C7.67157 10.5 7 11.1716 7 12C7 12.8284 7.67157 13.5 8.5 13.5Z" fill="currentColor"/>
          <path d="M15.5 13.5C16.3284 13.5 17 12.8284 17 12C17 11.1716 16.3284 10.5 15.5 10.5C14.6716 10.5 14 11.1716 14 12C14 12.8284 14.6716 13.5 15.5 13.5Z" fill="currentColor"/>
        </svg>
      </div>
    </div>
  );
};

/**
 * 강아지 테마 배지 컴포넌트
 */
export const PetEduBadge = ({ 
  text, 
  variant = "default" 
}: { 
  text: string, 
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline" 
}) => {
  // 변형별 클래스 매핑
  const variantClasses = {
    default: "bg-primary/10 text-primary border-primary/30",
    success: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
    error: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    info: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    outline: "bg-transparent border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]}`}>
      <span className="mr-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 13.5C9.32843 13.5 10 12.8284 10 12C10 11.1716 9.32843 10.5 8.5 10.5C7.67157 10.5 7 11.1716 7 12C7 12.8284 7.67157 13.5 8.5 13.5Z" fill="currentColor"/>
        </svg>
      </span>
      {text}
    </span>
  );
};

/**
 * 카드 컴포넌트 - 반려동물 테마 스타일링
 */
export const PetCard = ({ 
  children,
  className = "",
  onClick
}: { 
  children: React.ReactNode,
  className?: string,
  onClick?: () => void
}) => {
  return (
    <div 
      className={`pet-card ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 h-6 w-6 -mt-2 -mr-2 text-primary transform rotate-12">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 13.5C9.32843 13.5 10 12.8284 10 12C10 11.1716 9.32843 10.5 8.5 10.5C7.67157 10.5 7 11.1716 7 12C7 12.8284 7.67157 13.5 8.5 13.5Z" fill="currentColor"/>
        </svg>
      </div>
      {children}
    </div>
  );
};

/**
 * 브랜드 일관성을 위한 섹션 컴포넌트
 */
export const PetEduSection = ({
  title,
  description,
  children,
  className = ""
}: {
  title: string,
  description?: string,
  children: React.ReactNode,
  className?: string
}) => {
  return (
    <section className={`content-section ${className}`}>
      <div className="mb-4">
        <h2 className="text-title-small flex items-center">
          <span className="text-primary mr-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 7.5C12.8284 7.5 13.5 6.82843 13.5 6C13.5 5.17157 12.8284 4.5 12 4.5C11.1716 4.5 10.5 5.17157 10.5 6C10.5 6.82843 11.1716 7.5 12 7.5Z" fill="currentColor"/>
            </svg>
          </span>
          {title}
        </h2>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="mt-4">
        {children}
      </div>
    </section>
  );
};