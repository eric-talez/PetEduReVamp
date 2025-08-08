// 성능 최적화 유틸리티

interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Navigation Timing 관찰
    if ('PerformanceObserver' in window) {
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('page-load', navEntry.loadEventEnd - navEntry.fetchStart);
            this.recordMetric('dom-content-loaded', navEntry.domContentLoadedEventEnd - navEntry.fetchStart);
            this.recordMetric('first-paint', navEntry.loadEventEnd - navEntry.fetchStart);
          }
        }
      });

      try {
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (error) {
        console.warn('Navigation timing observer not supported:', error);
      }

      // Resource Timing 관찰
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            const duration = resourceEntry.responseEnd - resourceEntry.fetchStart;
            
            // 느린 리소스 로딩 감지 (2초 이상)
            if (duration > 2000) {
              console.warn(`Slow resource detected: ${resourceEntry.name} (${duration.toFixed(2)}ms)`);
            }
          }
        }
      });

      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (error) {
        console.warn('Resource timing observer not supported:', error);
      }
    }
  }

  recordMetric(name: string, duration: number) {
    const metric: PerformanceMetrics = {
      name,
      duration,
      timestamp: Date.now()
    };
    
    this.metrics.push(metric);
    
    // 메트릭이 100개를 초과하면 오래된 것부터 제거
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
    
    // 개발 환경에서 로깅
    if (import.meta.env.DEV) {
      console.log(`⚡ Performance: ${name} took ${duration.toFixed(2)}ms`);
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getAverageMetric(name: string): number {
    const namedMetrics = this.metrics.filter(m => m.name === name);
    if (namedMetrics.length === 0) return 0;
    
    const sum = namedMetrics.reduce((acc, metric) => acc + metric.duration, 0);
    return sum / namedMetrics.length;
  }

  clearMetrics() {
    this.metrics = [];
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
  }
}

// 성능 측정 유틸리티 함수들
export const performanceMonitor = new PerformanceMonitor();

export function measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  
  return fn().then(result => {
    const duration = performance.now() - start;
    performanceMonitor.recordMetric(name, duration);
    return result;
  }).catch(error => {
    const duration = performance.now() - start;
    performanceMonitor.recordMetric(`${name}-error`, duration);
    throw error;
  });
}

export function measureSync<T>(name: string, fn: () => T): T {
  const start = performance.now();
  try {
    const result = fn();
    const duration = performance.now() - start;
    performanceMonitor.recordMetric(name, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    performanceMonitor.recordMetric(`${name}-error`, duration);
    throw error;
  }
}

// Web Vitals 측정
export function measureWebVitals() {
  // CLS (Cumulative Layout Shift) 측정
  if ('PerformanceObserver' in window) {
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      performanceMonitor.recordMetric('cls', clsValue);
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('CLS measurement not supported:', error);
    }
  }

  // FID (First Input Delay) 측정
  if ('PerformanceObserver' in window) {
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = entry.processingStart - entry.startTime;
        performanceMonitor.recordMetric('fid', fid);
      }
    });

    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.warn('FID measurement not supported:', error);
    }
  }
}

// 메모리 사용량 모니터링
export function monitorMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    performanceMonitor.recordMetric('memory-used', memory.usedJSHeapSize);
    performanceMonitor.recordMetric('memory-total', memory.totalJSHeapSize);
    performanceMonitor.recordMetric('memory-limit', memory.jsHeapSizeLimit);
  }
}

// 이미지 로딩 최적화
export function optimizeImageLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach(img => {
      const image = img as HTMLImageElement;
      const src = image.dataset.src;
      if (src) {
        image.src = src;
        image.removeAttribute('data-src');
      }
    });
  }
}

// 컴포넌트 렌더링 시간 측정 훅
export function usePerformanceProfiler(componentName: string) {
  const startTime = performance.now();
  
  return () => {
    const duration = performance.now() - startTime;
    performanceMonitor.recordMetric(`component-${componentName}`, duration);
  };
}