import React from 'react';

interface SimpleLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SimpleLoading: React.FC<SimpleLoadingProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`}
        aria-label="로딩중"
      />
    </div>
  );
};

export const SimpleLoadingInline: React.FC<SimpleLoadingProps> = ({ 
  size = 'sm', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-6 h-6 border-2'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`}
        aria-label="로딩중"
      />
    </div>
  );
};

export default SimpleLoading;