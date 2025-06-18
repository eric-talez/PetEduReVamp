
import { Express } from 'express';
import { logger } from './logger';
import { DatabaseOptimizer } from '../db/optimization';

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
  metadata?: any;
}

export class EnhancedMonitor {
  private app: Express;
  private alerts: Alert[] = [];
  private metrics: Map<string, any> = new Map();
  private healthChecks: Map<string, () => Promise<boolean>> = new Map();
  
  constructor(app: Express) {
    this.app = app;
    this.setupHealthChecks();
    this.setupRoutes();
    this.startMonitoring();
  }
  
  /**
   * 헬스체크 등록
   */
  private setupHealthChecks() {
    // 데이터베이스 연결 체크
    this.healthChecks.set('database', async () => {
      try {
        await DatabaseOptimizer.collectStatistics();
        return true;
      } catch {
        return false;
      }
    });
    
    // 메모리 사용량 체크
    this.healthChecks.set('memory', async () => {
      const memUsage = process.memoryUsage();
      const threshold = 500 * 1024 * 1024; // 500MB
      return memUsage.heapUsed < threshold;
    });
    
    // 디스크 공간 체크 (시뮬레이션)
    this.healthChecks.set('disk', async () => {
      // 실제 환경에서는 fs.statSync를 사용하여 디스크 공간 확인
      return true;
    });
  }
  
  /**
   * 모니터링 API 라우트 설정
   */
  private setupRoutes() {
    // 상세 헬스체크 엔드포인트
    this.app.get('/api/monitoring/health', async (req, res) => {
      const healthStatus: Record<string, any> = {};
      
      for (const [name, checkFn] of this.healthChecks.entries()) {
        try {
          const startTime = Date.now();
          const isHealthy = await checkFn();
          const responseTime = Date.now() - startTime;
          
          healthStatus[name] = {
            status: isHealthy ? 'healthy' : 'unhealthy',
            responseTime: `${responseTime}ms`,
            timestamp: new Date().toISOString()
          };
        } catch (error) {
          healthStatus[name] = {
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
          };
        }
      }
      
      const overallHealthy = Object.values(healthStatus)
        .every((status: any) => status.status === 'healthy');
      
      res.status(overallHealthy ? 200 : 503).json({
        overall: overallHealthy ? 'healthy' : 'unhealthy',
        checks: healthStatus,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      });
    });
    
    // 실시간 메트릭 엔드포인트
    this.app.get('/api/monitoring/metrics', (req, res) => {
      const metrics = Object.fromEntries(this.metrics);
      res.json({
        metrics,
        alerts: this.alerts.filter(alert => !alert.resolved).length,
        timestamp: new Date().toISOString()
      });
    });
    
    // 알림 목록 엔드포인트
    this.app.get('/api/monitoring/alerts', (req, res) => {
      const { resolved = 'false' } = req.query;
      const filteredAlerts = this.alerts.filter(alert => 
        resolved === 'true' ? alert.resolved : !alert.resolved
      );
      
      res.json({
        alerts: filteredAlerts.slice(-50), // 최근 50개
        total: filteredAlerts.length
      });
    });
    
    // 알림 해결 처리
    this.app.post('/api/monitoring/alerts/:id/resolve', (req, res) => {
      const { id } = req.params;
      const alert = this.alerts.find(a => a.id === id);
      
      if (alert) {
        alert.resolved = true;
        logger.info(`[알림해결] 알림 ${id} 해결됨`);
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Alert not found' });
      }
    });
  }
  
  /**
   * 모니터링 시작
   */
  private startMonitoring() {
    // 1분마다 시스템 메트릭 수집
    setInterval(async () => {
      await this.collectMetrics();
    }, 60 * 1000);
    
    // 5분마다 데이터베이스 상태 확인
    setInterval(async () => {
      await this.checkDatabaseHealth();
    }, 5 * 60 * 1000);
    
    // 10분마다 성능 분석
    setInterval(async () => {
      await this.analyzePerformance();
    }, 10 * 60 * 1000);
    
    logger.info('[향상된모니터링] 모니터링 시스템 시작됨');
  }
  
  /**
   * 시스템 메트릭 수집
   */
  private async collectMetrics() {
    try {
      const memUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();
      
      this.metrics.set('memory', {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
        timestamp: new Date().toISOString()
      });
      
      this.metrics.set('cpu', {
        user: cpuUsage.user,
        system: cpuUsage.system,
        timestamp: new Date().toISOString()
      });
      
      this.metrics.set('uptime', {
        seconds: Math.floor(process.uptime()),
        human: this.formatUptime(process.uptime()),
        timestamp: new Date().toISOString()
      });
      
      // 메모리 사용량 임계값 체크
      const memoryThreshold = 400; // 400MB
      if (memUsage.heapUsed / 1024 / 1024 > memoryThreshold) {
        this.createAlert('warning', `높은 메모리 사용량: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`, {
          memoryUsage: memUsage
        });
      }
      
    } catch (error) {
      logger.error('[메트릭수집] 실패:', error);
    }
  }
  
  /**
   * 데이터베이스 상태 확인
   */
  private async checkDatabaseHealth() {
    try {
      const stats = await DatabaseOptimizer.collectStatistics();
      this.metrics.set('database', {
        ...stats,
        healthy: true,
        timestamp: new Date().toISOString()
      });
      
      // 데이터 무결성 검증
      const integrity = await DatabaseOptimizer.validateDataIntegrity();
      
      if (integrity.orphanedRecords.length > 0) {
        this.createAlert('warning', `고아 레코드 발견: ${integrity.orphanedRecords.length}개`, integrity);
      }
      
      if (integrity.duplicateEmails.length > 0) {
        this.createAlert('error', `중복 이메일 발견: ${integrity.duplicateEmails.length}개`, integrity);
      }
      
    } catch (error) {
      this.metrics.set('database', {
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      this.createAlert('error', '데이터베이스 연결 실패', { error: error.message });
    }
  }
  
  /**
   * 성능 분석
   */
  private async analyzePerformance() {
    try {
      const memory = this.metrics.get('memory');
      const uptime = this.metrics.get('uptime');
      
      // 성능 리포트 생성
      const performanceReport = {
        memoryTrend: this.analyzeMemoryTrend(),
        uptimeStatus: uptime?.seconds > 3600 ? 'stable' : 'starting',
        recommendedActions: this.getPerformanceRecommendations(),
        timestamp: new Date().toISOString()
      };
      
      this.metrics.set('performance', performanceReport);
      
      logger.info('[성능분석] 완료:', performanceReport);
      
    } catch (error) {
      logger.error('[성능분석] 실패:', error);
    }
  }
  
  /**
   * 알림 생성
   */
  private createAlert(type: Alert['type'], message: string, metadata?: any) {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      timestamp: new Date(),
      resolved: false,
      metadata
    };
    
    this.alerts.push(alert);
    
    // 최근 1000개 알림만 유지
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000);
    }
    
    logger.warn(`[알림생성] ${type.toUpperCase()}: ${message}`, metadata);
  }
  
  /**
   * 메모리 트렌드 분석
   */
  private analyzeMemoryTrend(): string {
    const memory = this.metrics.get('memory');
    if (!memory) return 'unknown';
    
    const heapUsed = memory.heapUsed;
    
    if (heapUsed < 100) return 'low';
    if (heapUsed < 300) return 'normal';
    if (heapUsed < 500) return 'high';
    return 'critical';
  }
  
  /**
   * 성능 권장사항 생성
   */
  private getPerformanceRecommendations(): string[] {
    const recommendations: string[] = [];
    const memory = this.metrics.get('memory');
    
    if (memory?.heapUsed > 300) {
      recommendations.push('메모리 사용량이 높습니다. 캐시 정리를 고려하세요.');
    }
    
    if (this.alerts.filter(a => !a.resolved && a.type === 'error').length > 5) {
      recommendations.push('에러가 지속적으로 발생하고 있습니다. 로그를 확인하세요.');
    }
    
    return recommendations;
  }
  
  /**
   * 업타임 포맷팅
   */
  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}일 ${hours}시간 ${minutes}분`;
  }
}
