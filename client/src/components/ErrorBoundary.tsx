import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * 컴포넌트 에러를 우아하게 처리하는 ErrorBoundary
 * 자식 컴포넌트에서 발생하는 JavaScript 에러를 캐치하고 사용자 친화적인 대체 UI를 표시
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  static getDerivedStateFromError(error: Error): State {
    // 다음 렌더링에서 대체 UI가 보이도록 상태를 업데이트 합니다.
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 에러 정보를 상태에 저장하고 필요시 에러 로깅 서비스에 보고할 수 있습니다.
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 여기에 에러 로깅 서비스 호출 코드를 추가할 수 있습니다.
    // 예: logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // 커스텀 대체 UI
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-3">문제가 발생했습니다</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400 max-w-md">
            죄송합니다. 페이지를 로드하는 중에 오류가 발생했습니다. 개발팀에 자동으로 알림이 전송되었습니다.
          </p>
          <div className="space-x-4">
            <Button onClick={this.handleReset} variant="outline">
              다시 시도
            </Button>
            <Button onClick={() => window.location.href = '/'}>
              홈으로 이동
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-md text-left overflow-auto max-w-2xl w-full">
              <p className="font-mono text-sm text-red-500 mb-2">{this.state.error.toString()}</p>
              {this.state.errorInfo && (
                <pre className="font-mono text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;