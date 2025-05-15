import React from 'react';
import { Loader2 } from 'lucide-react';

type DogLoadingSize = 'sm' | 'md' | 'lg';

interface DogLoadingProps {
  size?: DogLoadingSize;
  message?: string;
}

export const DogLoading: React.FC<DogLoadingProps> = ({ size = 'md', message = '로딩 중...' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const spinnerSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div className={`${sizeClasses[size]} relative`}>
          {/* Dog silhouette with tail animation */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path
              d="M86.9,25.8c-6.9,2.1-13.9,5.3-20,9.9c-6.2,4.7-11.4,10.4-14.4,17.5c-3,7.1-3.7,15.3-1.5,22.6c1.1,3.7,2.8,7.1,5.1,10.1c2.2,3,4.9,5.5,7.7,7.9c2.9,2.4,5.8,4.6,8.8,6.6c3,2.1,6.1,4,9.2,5.9c3.1,1.9,6.1,3.8,9.1,5.8c1.5,1,3,2,4.4,3.1c1.4,1.1,2.8,2.2,4.1,3.4"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className="dog-body"
            />
            {/* Animated tail */}
            <path
              d="M98.5,119.6c2.6,2.3,4.9,4.8,7.5,7.5c2.6,2.7,5.4,5.5,8.9,8c3.5,2.5,7.6,4.6,12,5.1c4.4,0.5,8.9-0.6,12.6-2.9c3.6-2.3,6.4-5.8,8.1-9.6c1.7-3.8,2.3-7.9,1.9-11.9c-0.4-4-1.8-7.8-3.4-11.4c-1.6-3.6-3.4-6.9-5.1-10.3"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className="dog-tail animate-wiggle"
            />
            {/* Head */}
            <path
              d="M86.9,25.8c5.5-1.8,11.7-1.5,17.2,0.2c5.6,1.7,10.6,5,14.9,8.9c4.3,3.9,8,8.3,11,13.2c3,4.9,5.2,10.1,6.4,15.6c1.2,5.5,1.4,11.2,0.4,16.8c-1,5.5-3.2,10.9-6.5,15.3c-3.3,4.4-7.8,7.9-12.7,9.8c-5,1.9-10.4,2.3-15.7,1.4"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className="dog-head"
            />
            {/* Left ear */}
            <path
              d="M106.9,52.3c3.3-4.5,6.9-8.9,11.3-12.3c4.4-3.4,9.6-5.9,15.1-6.1"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className="dog-ear"
            />
            {/* Right ear */}
            <path
              d="M124.1,55.6c2.5-3.1,5.2-6,8.3-8.4c3.1-2.4,6.7-4.2,10.4-4.8"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className="dog-ear"
            />
            {/* Eye */}
            <circle
              cx="115"
              cy="70"
              r="5"
              fill="currentColor"
              className="dog-eye"
            />
            {/* Nose */}
            <circle
              cx="130"
              cy="85"
              r="6"
              fill="currentColor"
              className="dog-nose"
            />
          </svg>
        </div>
        <div className="absolute bottom-1 right-1">
          <Loader2 className={`${spinnerSizes[size]} animate-spin text-primary`} />
        </div>
      </div>
      {message && <p className="mt-4 text-center text-muted-foreground">{message}</p>}
    </div>
  );
};

// Add animation to global CSS
if (typeof document !== 'undefined') {
  if (!document.getElementById('dog-loading-style')) {
    const style = document.createElement('style');
    style.id = 'dog-loading-style';
    style.innerHTML = `
      @keyframes wiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(10deg); }
        50% { transform: rotate(0deg); }
        75% { transform: rotate(-10deg); }
      }
      .animate-wiggle {
        animation: wiggle 1s ease-in-out infinite;
        transform-origin: 140px 100px;
      }
    `;
    document.head.appendChild(style);
  }
}