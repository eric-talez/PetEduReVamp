
import { Express } from 'express';
import fs from 'fs';
import path from 'path';

interface SystemMetrics {
  uptime: number;
  memory: NodeJS.MemoryUsage;
  cpu: number;
  activeConnections: number;
  errorCount: number;
  requestCount: number;
  timestamp: number;
}

export class ProductionMonitor {
  private app: Express;
  private metrics: SystemMetrics;
  private errorCount = 0;
  private requestCount = 0;
  private startTime = Date.now();
  
  constructor(app: Express) {
    this.app = app;
    this.metrics = this.getSystemMetrics();
    this.setupRoutes();
    this.startPeriodicReports();
  }
  
  private getSystemMetrics(): SystemMetrics {
    return {
      uptime: Date.now() - this.startTime,
      memory: process.memoryUsage(),
      cpu: process.cpuUsage().user / 1000000, // CPU 사용률 (초)
      activeConnections: this.getActiveConnections(),
      errorCount: this.errorCount,
      requestCount: this.requestCount,
      timestamp: Date.now(),
    };
  }
  
  private getActiveConnections(): number {
    // 실제 환경에서는 더 정확한 연결 수 측정 로직 필요
    return 0;
  }
  
  private setupRoutes() {
    // 헬스 체크 엔드포인트
    this.app.get('/health', (req, res) => {
      this.requestCount++;
      const metrics = this.getSystemMetrics();
      
      const isHealthy = 
        metrics.memory.heapUsed < 500 * 1024 * 1024 && // 500MB 미만
        metrics.uptime > 0;
      
      res.status(isHealthy ? 200 : 503).json({
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: metrics.uptime,
        memory: {
          used: `${Math.round(metrics.memory.heapUsed / 1024 / 1024)}MB`,
          total: `${Math.round(metrics.memory.heapTotal / 1024 / 1024)}MB`,
        },
        requests: this.requestCount,
        errors: this.errorCount,
      });
    });
    
    // 상세 메트릭 엔드포인트 (관리자 전용)
    this.app.get('/metrics', (req, res) => {
      this.requestCount++;
      res.json(this.getSystemMetrics());
    });
  }
  
  public recordError() {
    this.errorCount++;
  }
  
  public recordRequest() {
    this.requestCount++;
  }
  
  private startPeriodicReports() {
    // 10분마다 시스템 상태 로그
    setInterval(() => {
      const metrics = this.getSystemMetrics();
      console.log('📊 시스템 상태:', {
        uptime: `${Math.round(metrics.uptime / 1000 / 60)}분`,
        memory: `${Math.round(metrics.memory.heapUsed / 1024 / 1024)}MB`,
        requests: metrics.requestCount,
        errors: metrics.errorCount,
      });
      
      // 메모리 사용량이 높을 때 경고
      if (metrics.memory.heapUsed > 400 * 1024 * 1024) {
        console.warn('⚠️ 높은 메모리 사용량 감지:', Math.round(metrics.memory.heapUsed / 1024 / 1024), 'MB');
      }
      
      // 에러율이 높을 때 경고
      const errorRate = metrics.errorCount / metrics.requestCount;
      if (errorRate > 0.05) { // 5% 이상
        console.warn('⚠️ 높은 에러율 감지:', Math.round(errorRate * 100), '%');
      }
    }, 10 * 60 * 1000); // 10분
  }
}
