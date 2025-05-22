import { useToast, ToastProps } from '@/hooks/use-toast';
import { ReactNode } from 'react';

// ToastActionElement 타입 내부 정의
type ToastActionElement = React.ReactElement<any, string | React.JSXElementConstructor<any>>;

// 토스트 타입에 따른 기본 표시 시간 (ms)
const TOAST_DURATIONS = {
  default: 5000,      // 기본
  success: 3000,      // 성공
  error: 8000,        // 오류
  warning: 6000,      // 경고
  info: 4000,         // 정보
};

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title?: string;
  description?: ReactNode;
  action?: ToastActionElement;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
  type?: ToastType;
}

export function useEnhancedToast() {
  const { toast: originalToast, dismiss } = useToast();
  
  const getToastVariant = (type: ToastType) => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'destructive';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };
  
  const getDuration = (type: ToastType, customDuration?: number) => {
    if (customDuration !== undefined) return customDuration;
    return TOAST_DURATIONS[type];
  };
  
  const toast = (options: ToastOptions) => {
    const type = options.type || 'default';
    const variant = options.variant || getToastVariant(type);
    const duration = getDuration(type, options.duration);
    
    return originalToast({
      ...options,
      variant,
      duration,
    });
  };
  
  const success = (options: Omit<ToastOptions, 'type' | 'variant'>) => {
    return toast({
      ...options,
      type: 'success',
      variant: 'success',
    });
  };
  
  const error = (options: Omit<ToastOptions, 'type' | 'variant'>) => {
    return toast({
      ...options,
      type: 'error',
      variant: 'destructive',
    });
  };
  
  const warning = (options: Omit<ToastOptions, 'type' | 'variant'>) => {
    return toast({
      ...options,
      type: 'warning',
      variant: 'warning',
    });
  };
  
  const info = (options: Omit<ToastOptions, 'type' | 'variant'>) => {
    return toast({
      ...options,
      type: 'info',
      variant: 'info',
    });
  };
  
  return {
    toast,
    success,
    error,
    warning,
    info,
    dismiss,
  };
}