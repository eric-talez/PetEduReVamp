/**
 * 성능 모니터링 유틸리티
 * 클라이언트 사이드 성능 측정 및 최적화
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  category: 'navigation' | 'resource' | 'measure' | 'paint' | 'layout';
}

export interface VitalsMetric {
  name: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetric[] = [];
  private static vitals: VitalsMetric[] = [];
  private static observers: Map<string, PerformanceObserver> = new Map();

  /**
   * 성능 모니터링 초기화
   */
  static initialize(): void {
    if (typeof window === 'undefined') return;

    // Navigation Timing API
    this.observeNavigation();
    
    // Resource Timing API
    this.observeResources();
    
    // User Timing API
    this.observeUserTiming();
    
    // Paint Timing API
    this.observePaintTiming();
    
    // Layout Shift API
    this.observeLayoutShift();

    // Web Vitals 측정
    this.measureWebVitals();

    // 페이지 언로드 시 데이터 전송
    this.setupBeaconReporting();
  }

  /**
   * Navigation Timing 관찰
   */
  private static observeNavigation(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            
            this.addMetric({
              name: 'DOM Content Loaded',
              value: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              timestamp: Date.now(),
              category: 'navigation'
            });

            this.addMetric({
              name: 'Load Complete',
              value: navEntry.loadEventEnd - navEntry.loadEventStart,
              timestamp: Date.now(),
              category: 'navigation'
            });

            this.addMetric({
              name: 'DNS Lookup',
              value: navEntry.domainLookupEnd - navEntry.domainLookupStart,
              timestamp: Date.now(),
              category: 'navigation'
            });

            this.addMetric({
              name: 'TCP Connection',
              value: navEntry.connectEnd - navEntry.connectStart,
              timestamp: Date.now(),
              category: 'navigation'
            });
          }
        }
      });

      observer.observe({ entryTypes: ['navigation'] });
      this.observers.set('navigation', observer);
    } catch (error) {
      console.warn('Navigation timing observation failed:', error);
    }
  }

  /**
   * Resource Timing 관찰
   */
  private static observeResources(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            
            // 큰 리소스나 느린 로딩 리소스만 기록
            if (resourceEntry.duration > 100 || resourceEntry.transferSize > 100000) {
              this.addMetric({
                name: `Resource: ${resourceEntry.name.split('/').pop() || 'unknown'}`,
                value: resourceEntry.duration,
                timestamp: Date.now(),
                category: 'resource'
              });
            }
          }
        }
      });

      observer.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', observer);
    } catch (error) {
      console.warn('Resource timing observation failed:', error);
    }
  }

  /**
   * User Timing 관찰
   */
  private static observeUserTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            this.addMetric({
              name: entry.name,
              value: entry.duration,
              timestamp: Date.now(),
              category: 'measure'
            });
          }
        }
      });

      observer.observe({ entryTypes: ['measure'] });
      this.observers.set('measure', observer);
    } catch (error) {
      console.warn('User timing observation failed:', error);
    }
  }

  /**
   * Paint Timing 관찰
   */
  private static observePaintTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint') {
            this.addMetric({
              name: entry.name,
              value: entry.startTime,
              timestamp: Date.now(),
              category: 'paint'
            });
          }
        }
      });

      observer.observe({ entryTypes: ['paint'] });
      this.observers.set('paint', observer);
    } catch (error) {
      console.warn('Paint timing observation failed:', error);
    }
  }

  /**
   * Layout Shift 관찰
   */
  private static observeLayoutShift(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      let clsValue = 0;
      let clsEntries: LayoutShift[] = [];

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            clsEntries.push(entry as any);

            this.addMetric({
              name: 'Layout Shift',
              value: (entry as any).value,
              timestamp: Date.now(),
              category: 'layout'
            });
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('layout-shift', observer);
    } catch (error) {
      console.warn('Layout shift observation failed:', error);
    }
  }

  /**
   * Web Vitals 측정
   */
  private static measureWebVitals(): void {
    // First Contentful Paint (FCP)
    this.measureFCP();
    
    // Largest Contentful Paint (LCP)
    this.measureLCP();
    
    // First Input Delay (FID)
    this.measureFID();
    
    // Cumulative Layout Shift (CLS)
    this.measureCLS();
    
    // Time to First Byte (TTFB)
    this.measureTTFB();
  }

  /**
   * First Contentful Paint 측정
   */
  private static measureFCP(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            const fcp = entry.startTime;
            this.addVital({
              name: 'FCP',
              value: fcp,
              rating: fcp < 1800 ? 'good' : fcp < 3000 ? 'needs-improvement' : 'poor'
            });
          }
        }
      });

      observer.observe({ entryTypes: ['paint'] });
    } catch (error) {
      console.warn('FCP measurement failed:', error);
    }
  }

  /**
   * Largest Contentful Paint 측정
   */
  private static measureLCP(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry) {
          const lcp = lastEntry.startTime;
          this.addVital({
            name: 'LCP',
            value: lcp,
            rating: lcp < 2500 ? 'good' : lcp < 4000 ? 'needs-improvement' : 'poor'
          });
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.warn('LCP measurement failed:', error);
    }
  }

  /**
   * First Input Delay 측정
   */
  private static measureFID(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = entry.processingStart - entry.startTime;
          this.addVital({
            name: 'FID',
            value: fid,
            rating: fid < 100 ? 'good' : fid < 300 ? 'needs-improvement' : 'poor'
          });
        }
      });

      observer.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.warn('FID measurement failed:', error);
    }
  }

  /**
   * Cumulative Layout Shift 측정
   */
  private static measureCLS(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        
        this.addVital({
          name: 'CLS',
          value: clsValue,
          rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor'
        });
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('CLS measurement failed:', error);
    }
  }

  /**
   * Time to First Byte 측정
   */
  private static measureTTFB(): void {
    if (typeof window === 'undefined') return;

    try {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        const ttfb = navEntry.responseStart - navEntry.requestStart;
        this.addVital({
          name: 'TTFB',
          value: ttfb,
          rating: ttfb < 800 ? 'good' : ttfb < 1800 ? 'needs-improvement' : 'poor'
        });
      }
    } catch (error) {
      console.warn('TTFB measurement failed:', error);
    }
  }

  /**
   * 메트릭 추가
   */
  private static addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // 메트릭 수 제한 (메모리 사용량 관리)
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-50);
    }

    // 임계값 초과 시 경고
    this.checkThresholds(metric);
  }

  /**
   * Vital 메트릭 추가
   */
  private static addVital(vital: VitalsMetric): void {
    // 기존 같은 이름의 vital 업데이트
    const existingIndex = this.vitals.findIndex(v => v.name === vital.name);
    if (existingIndex >= 0) {
      this.vitals[existingIndex] = vital;
    } else {
      this.vitals.push(vital);
    }
  }

  /**
   * 임계값 확인 및 경고
   */
  private static checkThresholds(metric: PerformanceMetric): void {
    const thresholds = {
      'DOM Content Loaded': 1500,
      'Load Complete': 3000,
      'Layout Shift': 0.1,
      'first-contentful-paint': 1800,
      'largest-contentful-paint': 2500
    };

    const threshold = thresholds[metric.name as keyof typeof thresholds];
    if (threshold && metric.value > threshold) {
      console.warn(`⚠️ 성능 경고: ${metric.name} (${metric.value.toFixed(2)}ms) 임계값 초과`);
    }
  }

  /**
   * Beacon API를 사용한 리포팅 설정
   */
  private static setupBeaconReporting(): void {
    if (typeof window === 'undefined' || !('navigator' in window) || !('sendBeacon' in navigator)) return;

    const sendMetrics = () => {
      const data = {
        metrics: this.metrics.slice(-20), // 최근 20개만 전송
        vitals: this.vitals,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      };

      try {
        navigator.sendBeacon('/api/performance/metrics', JSON.stringify(data));
      } catch (error) {
        console.warn('Performance metrics beacon failed:', error);
      }
    };

    // 페이지 언로드 시 메트릭 전송
    window.addEventListener('beforeunload', sendMetrics);
    
    // 주기적으로 메트릭 전송 (5분마다)
    setInterval(sendMetrics, 5 * 60 * 1000);
  }

  /**
   * 커스텀 측정 시작
   */
  static startMeasure(name: string): () => void {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return () => {};
    }

    const startTime = performance.now();
    performance.mark(`${name}-start`);

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);

      this.addMetric({
        name,
        value: duration,
        timestamp: Date.now(),
        category: 'measure'
      });
    };
  }

  /**
   * 메트릭 조회
   */
  static getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Vitals 조회
   */
  static getVitals(): VitalsMetric[] {
    return [...this.vitals];
  }

  /**
   * 성능 리포트 생성
   */
  static generateReport(): {
    summary: { [key: string]: number };
    vitals: VitalsMetric[];
    metrics: PerformanceMetric[];
    recommendations: string[];
  } {
    const summary: { [key: string]: number } = {};
    const recommendations: string[] = [];

    // 메트릭 요약
    for (const metric of this.metrics) {
      if (!summary[metric.category]) {
        summary[metric.category] = 0;
      }
      summary[metric.category] += metric.value;
    }

    // 권장사항 생성
    const poorVitals = this.vitals.filter(v => v.rating === 'poor');
    for (const vital of poorVitals) {
      switch (vital.name) {
        case 'FCP':
          recommendations.push('이미지 최적화 및 CSS 최적화를 통해 첫 콘텐츠 렌더링을 개선하세요.');
          break;
        case 'LCP':
          recommendations.push('가장 큰 콘텐츠 요소의 로딩 시간을 줄이기 위해 이미지 압축과 지연 로딩을 적용하세요.');
          break;
        case 'FID':
          recommendations.push('JavaScript 실행 시간을 줄이고 코드 스플리팅을 적용하세요.');
          break;
        case 'CLS':
          recommendations.push('레이아웃 변경을 최소화하기 위해 이미지와 광고에 크기를 명시하세요.');
          break;
        case 'TTFB':
          recommendations.push('서버 응답 시간을 개선하거나 CDN을 사용하세요.');
          break;
      }
    }

    return {
      summary,
      vitals: this.vitals,
      metrics: this.metrics,
      recommendations
    };
  }

  /**
   * 정리
   */
  static cleanup(): void {
    for (const observer of this.observers.values()) {
      observer.disconnect();
    }
    this.observers.clear();
    this.metrics.length = 0;
    this.vitals.length = 0;
  }
}

// 자동 초기화 (브라우저 환경에서만)
if (typeof window !== 'undefined') {
  PerformanceMonitor.initialize();
}