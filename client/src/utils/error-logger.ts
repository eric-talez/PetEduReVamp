
// 클라이언트 사이드 오류 자동 감지 및 리포팅
class ErrorLogger {
  private static instance: ErrorLogger;
  private enabled: boolean = true;
  private errorQueue: any[] = [];
  private maxQueueSize: number = 50;

  private constructor() {
    this.initializeErrorHandling();
  }

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  private initializeErrorHandling() {
    // JavaScript 오류 감지
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'javascript',
        severity: this.getSeverityFromError(event.error),
        message: event.message,
        url: window.location.href,
        stackTrace: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Promise rejection 감지
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'javascript',
        severity: 'high',
        message: `Unhandled Promise Rejection: ${event.reason}`,
        url: window.location.href,
        stackTrace: event.reason?.stack
      });
    });

    // API 호출 오류 감지
    this.interceptFetch();

    // 성능 이슈 감지
    this.monitorPerformance();

    // 주기적으로 큐 플러시
    setInterval(() => {
      this.flushErrorQueue();
    }, 5000);
  }

  private interceptFetch() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const startTime = performance.now();
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // API 응답 시간 모니터링
        if (duration > 5000) {
          this.logError({
            type: 'performance',
            severity: 'medium',
            message: `Slow API response: ${duration.toFixed(2)}ms`,
            url: typeof args[0] === 'string' ? args[0] : args[0].url
          });
        }
        
        // HTTP 오류 상태 감지
        if (!response.ok) {
          this.logError({
            type: 'api',
            severity: response.status >= 500 ? 'high' : 'medium',
            message: `HTTP ${response.status}: ${response.statusText}`,
            url: typeof args[0] === 'string' ? args[0] : args[0].url
          });
        }
        
        return response;
      } catch (error) {
        this.logError({
          type: 'network',
          severity: 'high',
          message: `Network error: ${error.message}`,
          url: typeof args[0] === 'string' ? args[0] : args[0].url,
          stackTrace: error.stack
        });
        throw error;
      }
    };
  }

  private monitorPerformance() {
    // 페이지 로드 성능 모니터링
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation.loadEventEnd - navigation.fetchStart > 5000) {
          this.logError({
            type: 'performance',
            severity: 'low',
            message: `Slow page load: ${(navigation.loadEventEnd - navigation.fetchStart).toFixed(2)}ms`,
            url: window.location.href
          });
        }
      }, 1000);
    });

    // 메모리 사용량 모니터링 (지원되는 브라우저에서만)
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > 100 * 1024 * 1024) { // 100MB
          this.logError({
            type: 'performance',
            severity: 'medium',
            message: `High memory usage: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
            url: window.location.href
          });
        }
      }, 30000);
    }
  }

  private getSeverityFromError(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    if (!error) return 'low';
    
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('network') || message.includes('fetch')) return 'high';
    if (message.includes('syntax') || message.includes('reference')) return 'medium';
    if (message.includes('type')) return 'medium';
    
    return 'low';
  }

  private logError(errorData: any) {
    if (!this.enabled) return;

    const enrichedError = {
      ...errorData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      path: window.location.pathname,
      search: window.location.search
    };

    this.errorQueue.push(enrichedError);

    // 큐 크기 제한
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // 심각한 오류는 즉시 전송
    if (errorData.severity === 'critical' || errorData.severity === 'high') {
      this.sendErrorToServer([enrichedError]);
    }

    console.warn('🔍 Error detected and logged:', enrichedError);
  }

  private async flushErrorQueue() {
    if (this.errorQueue.length === 0) return;

    const errorsToSend = [...this.errorQueue];
    this.errorQueue = [];

    await this.sendErrorToServer(errorsToSend);
  }

  private async sendErrorToServer(errors: any[]) {
    try {
      await fetch('/api/ai/error-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          errors: errors.length === 1 ? errors[0] : errors
        })
      });
    } catch (error) {
      console.error('Failed to send error logs to server:', error);
      // 전송 실패시 다시 큐에 추가
      this.errorQueue.unshift(...errors);
    }
  }

  public enable() {
    this.enabled = true;
  }

  public disable() {
    this.enabled = false;
  }

  public clearQueue() {
    this.errorQueue = [];
  }
}

// 전역 인스턴스 생성 및 초기화
export const errorLogger = ErrorLogger.getInstance();

// React 컴포넌트에서 사용할 수 있는 훅
export const useErrorLogger = () => {
  return {
    logError: (errorData: any) => errorLogger['logError'](errorData),
    enable: () => errorLogger.enable(),
    disable: () => errorLogger.disable(),
    clearQueue: () => errorLogger.clearQueue()
  };
};
