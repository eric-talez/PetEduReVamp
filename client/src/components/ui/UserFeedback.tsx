import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { announceToScreenReader } from '@/components/a11y/AnnouncementRegion';

interface RatingProps {
  value: number;
  onChange: (value: number) => void;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  icon?: 'star' | 'heart' | 'thumbs';
  label?: string;
  showValue?: boolean;
  className?: string;
}

/**
 * 별점 평가 컴포넌트
 * 
 * 사용자 피드백을 수집하는 대화형 평점 컴포넌트입니다.
 * 접근성을 고려하여 키보드 탐색 및 스크린 리더를 지원합니다.
 */
export const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  count = 5,
  size = 'md',
  interactive = true,
  icon = 'star',
  label = '평점',
  showValue = true,
  className,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  // 마우스 호버 핸들러
  const handleMouseEnter = (index: number) => {
    if (interactive) setHoverValue(index);
  };
  
  const handleMouseLeave = () => {
    if (interactive) setHoverValue(null);
  };
  
  // 클릭 핸들러
  const handleClick = (index: number) => {
    if (interactive) {
      onChange(index);
      announceToScreenReader(`${count}점 만점에 ${index}점으로 평가했습니다.`);
    }
  };
  
  // 키보드 핸들러
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (!interactive) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(index);
      announceToScreenReader(`${count}점 만점에 ${index}점으로 평가했습니다.`);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const newValue = Math.max(1, value - 1);
      onChange(newValue);
      announceToScreenReader(`${count}점 만점에 ${newValue}점으로 평가했습니다.`);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const newValue = Math.min(count, value + 1);
      onChange(newValue);
      announceToScreenReader(`${count}점 만점에 ${newValue}점으로 평가했습니다.`);
    }
  };
  
  // 아이콘 선택
  const getIcon = (filled: boolean) => {
    if (icon === 'star') {
      return filled ? (
        <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ) : (
        <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
          <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
        </svg>
      );
    } else if (icon === 'heart') {
      return filled ? (
        <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
          <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
        </svg>
      );
    } else if (icon === 'thumbs') {
      return filled ? (
        <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
        </svg>
      ) : (
        <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
          <path d="M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z" />
        </svg>
      );
    }
    
    return null;
  };
  
  // 크기에 따른 클래스 매핑
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  
  // 현재 표시 값 (호버 또는 선택된 값)
  const displayValue = hoverValue !== null ? hoverValue : value;
  
  return (
    <div className={className}>
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium">{label}</label>
          {showValue && (
            <span className="text-sm text-muted-foreground">
              {displayValue}/{count}
            </span>
          )}
        </div>
      )}
      
      <div 
        className="flex items-center space-x-1"
        role="radiogroup"
        aria-label={label || '평점'}
      >
        {Array.from({ length: count }).map((_, index) => {
          const ratingValue = index + 1;
          const isActive = ratingValue <= displayValue;
          
          return (
            <div
              key={index}
              className={cn(
                'cursor-pointer transition-all duration-100',
                isActive ? 'text-amber-500' : 'text-muted',
                interactive && 'hover:scale-110',
                sizeClasses[size]
              )}
              onMouseEnter={() => handleMouseEnter(ratingValue)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(ratingValue)}
              onKeyDown={(e) => handleKeyDown(e, ratingValue)}
              tabIndex={interactive ? 0 : -1}
              role="radio"
              aria-checked={ratingValue === value}
              aria-label={`${ratingValue}점`}
            >
              {getIcon(isActive)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface FeedbackFormProps {
  onSubmit: (data: {
    rating: number;
    comment: string;
  }) => void;
  title?: string;
  ratingLabel?: string;
  commentLabel?: string;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  className?: string;
}

/**
 * 사용자 피드백 폼 컴포넌트
 * 
 * 평점과 댓글을 수집하는 통합 피드백 폼입니다.
 */
export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  title = '피드백을 남겨주세요',
  ratingLabel = '만족도',
  commentLabel = '의견을 자유롭게 작성해 주세요',
  submitLabel = '제출하기',
  cancelLabel = '취소',
  onCancel,
  className,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      announceToScreenReader('평점을 선택해 주세요.', 'assertive');
      return;
    }
    
    onSubmit({ rating, comment });
    setSubmitted(true);
    announceToScreenReader('피드백이 성공적으로 제출되었습니다. 감사합니다.');
  };
  
  if (submitted) {
    return (
      <div className={cn('p-6 text-center space-y-4', className)}>
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">감사합니다!</h3>
          <p className="text-sm text-muted-foreground mt-1">
            소중한 의견을 보내주셔서 감사합니다.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      {title && (
        <h3 className="text-lg font-medium">{title}</h3>
      )}
      
      <div>
        <Rating
          value={rating}
          onChange={setRating}
          label={ratingLabel}
          icon="star"
          size="lg"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium" htmlFor="feedback-comment">
          {commentLabel}
        </label>
        <textarea
          id="feedback-comment"
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
        )}
        
        <Button type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

interface LikeDislikeProps {
  onVote: (type: 'like' | 'dislike') => void;
  likes?: number;
  dislikes?: number;
  showCounts?: boolean;
  userVote?: 'like' | 'dislike' | null;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * 좋아요/싫어요 버튼 컴포넌트
 * 
 * 간단한 이진 피드백을 수집하는 컴포넌트입니다.
 * 사용자가 콘텐츠에 대해 빠르게 의견을 표현할 수 있습니다.
 */
export const LikeDislike: React.FC<LikeDislikeProps> = ({
  onVote,
  likes = 0,
  dislikes = 0,
  showCounts = true,
  userVote = null,
  disabled = false,
  size = 'md',
  className,
}) => {
  // 크기에 따른 클래스 매핑
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };
  
  // 아이콘 크기
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  const handleVote = (type: 'like' | 'dislike') => {
    if (disabled) return;
    
    onVote(type);
    announceToScreenReader(
      type === 'like' 
        ? '좋아요를 선택했습니다.' 
        : '싫어요를 선택했습니다.'
    );
  };
  
  return (
    <div className={cn('flex items-center space-x-2', sizeClasses[size], className)}>
      <button
        type="button"
        className={cn(
          'flex items-center space-x-1 px-2 py-1 rounded-md transition-colors',
          userVote === 'like'
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-muted',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => handleVote('like')}
        disabled={disabled}
        aria-label="좋아요"
        aria-pressed={userVote === 'like'}
      >
        <svg
          className={cn(iconSizes[size])}
          fill={userVote === 'like' ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={userVote === 'like' ? 0 : 2}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
        {showCounts && <span>{likes}</span>}
      </button>
      
      <button
        type="button"
        className={cn(
          'flex items-center space-x-1 px-2 py-1 rounded-md transition-colors',
          userVote === 'dislike'
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-muted',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => handleVote('dislike')}
        disabled={disabled}
        aria-label="싫어요"
        aria-pressed={userVote === 'dislike'}
      >
        <svg
          className={cn(iconSizes[size])}
          fill={userVote === 'dislike' ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={userVote === 'dislike' ? 0 : 2}
            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5 8h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2.5"
          />
        </svg>
        {showCounts && <span>{dislikes}</span>}
      </button>
    </div>
  );
};