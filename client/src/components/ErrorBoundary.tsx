import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';
import { DogLoading } from './DogLoading';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDogLoading?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 에러 바운더리 컴포넌트
 * 
 * React 컴포넌트 트리에서 발생하는 JavaScript 에러를 캐치하고,
 * 에러 발생 시 폴백 UI를 렌더링하여 전체 애플리케이션이 중단되는 것을 방지
 * 
 * 접근성을 고려한 aria-* 속성 추가
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 에러 로깅 또는 에러 보고 서비스에 에러 정보 전송
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 상위 컴포넌트에 에러 전달 (선택적)
    this.props.onError?.(error, errorInfo);
  }

  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: null });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // 사용자 정의 폴백이 제공된 경우 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return (
        <div 
          className="flex flex-col items-center justify-center min-h-[300px] p-6 space-y-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10 dark:border-red-800"
          role="alert"
          aria-live="assertive"
        >
          {this.props.showDogLoading && <DogLoading size="small" message="문제 확인 중..." showTips={false} />}
          
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" aria-hidden="true" />
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">
              문제가 발생했습니다
            </h3>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              {this.state.error?.message || '알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.'}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
              onClick={this.resetErrorBoundary}
            >
              다시 시도
            </Button>
            
            <Button 
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
              onClick={() => window.location.reload()}
            >
              페이지 새로고침
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
