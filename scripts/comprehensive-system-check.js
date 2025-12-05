
#!/usr/bin/env node

const fetch = require('node-fetch');

class ComprehensiveSystemChecker {
  constructor() {
    this.baseURL = 'http://localhost:5000';
    this.results = {
      database: {},
      authentication: {},
      apis: {},
      performance: {},
      errors: []
    };
  }

  async checkDatabaseConnection() {
    console.log('\n🗄️ 데이터베이스 연결 체크...');
    try {
      const response = await fetch(`${this.baseURL}/api/test/database-test`);
      const data = await response.json();
      
      this.results.database = {
        status: data.success ? '정상' : '오류',
        connection: data.results?.connectionTest || false,
        schema: data.results?.schemaTest || false,
        data: data.results?.dataTest || false,
        tables: data.results?.tables || {},
        summary: data.summary || {}
      };

      if (data.success) {
        console.log('✅ 데이터베이스 연결 정상');
        console.log(`   - 총 테이블: ${data.summary?.totalTables || 0}개`);
        console.log(`   - 작동 테이블: ${data.summary?.workingTables || 0}개`);
        console.log(`   - 총 레코드: ${data.summary?.totalRecords || 0}개`);
      } else {
        console.log('❌ 데이터베이스 연결 오류');
        this.results.errors.push('데이터베이스 연결 실패');
      }
    } catch (error) {
      console.log('❌ 데이터베이스 테스트 실패:', error.message);
      this.results.errors.push(`데이터베이스 테스트 오류: ${error.message}`);
    }
  }

  async checkAuthenticationSystem() {
    console.log('\n🔐 인증 시스템 체크...');
    try {
      const response = await fetch(`${this.baseURL}/api/auth/me`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        this.results.authentication = {
          status: '정상',
          isAuthenticated: !!data.user,
          user: data.user || null
        };
        console.log('✅ 인증 시스템 정상');
        if (data.user) {
          console.log(`   - 로그인 사용자: ${data.user.name} (${data.user.role})`);
        }
      } else {
        this.results.authentication = {
          status: '미인증',
          isAuthenticated: false
        };
        console.log('ℹ️ 인증되지 않은 상태');
      }
    } catch (error) {
      console.log('❌ 인증 시스템 테스트 실패:', error.message);
      this.results.errors.push(`인증 시스템 오류: ${error.message}`);
    }
  }

  async checkCoreAPIs() {
    console.log('\n🔌 핵심 API 엔드포인트 체크...');
    
    const endpoints = [
      { name: '시스템 상태', url: '/api/dashboard/system/status' },
      { name: '로고 설정', url: '/api/logo' },
      { name: '배너 목록', url: '/api/banners' },
      { name: '주간 통계', url: '/api/weekly-stats' },
      { name: '인기 통계', url: '/api/popular-stats' },
      { name: '강의 목록', url: '/api/courses' },
      { name: '훈련사 목록', url: '/api/trainers' },
      { name: '기관 목록', url: '/api/institutes' }
    ];

    const apiResults = [];

    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const response = await fetch(`${this.baseURL}${endpoint.url}`);
        const responseTime = Date.now() - startTime;
        
        const result = {
          name: endpoint.name,
          url: endpoint.url,
          status: response.status,
          statusText: response.statusText,
          responseTime: `${responseTime}ms`,
          success: response.ok
        };

        apiResults.push(result);

        const icon = response.ok ? '✅' : '❌';
        const perfIcon = responseTime > 500 ? '🐌' : responseTime > 200 ? '⚠️' : '⚡';
        console.log(`   ${icon} ${perfIcon} ${endpoint.name}: ${response.status} (${responseTime}ms)`);

        if (responseTime > 500) {
          this.results.errors.push(`느린 응답: ${endpoint.name} - ${responseTime}ms`);
        }
      } catch (error) {
        apiResults.push({
          name: endpoint.name,
          url: endpoint.url,
          error: error.message,
          success: false
        });
        console.log(`   ❌ ${endpoint.name}: 오류 - ${error.message}`);
        this.results.errors.push(`API 오류: ${endpoint.name}`);
      }
    }

    this.results.apis = {
      total: endpoints.length,
      successful: apiResults.filter(r => r.success).length,
      failed: apiResults.filter(r => !r.success).length,
      details: apiResults
    };
  }

  async checkPerformance() {
    console.log('\n⚡ 성능 체크...');
    
    const performanceTests = [
      { name: '홈페이지', url: '/' },
      { name: '대시보드', url: '/api/dashboard/system/status' },
      { name: '로고 로딩', url: '/api/logo' }
    ];

    const perfResults = [];

    for (const test of performanceTests) {
      try {
        const startTime = Date.now();
        await fetch(`${this.baseURL}${test.url}`);
        const responseTime = Date.now() - startTime;
        
        perfResults.push({
          name: test.name,
          responseTime,
          rating: responseTime < 200 ? 'excellent' : 
                  responseTime < 500 ? 'good' : 
                  responseTime < 1000 ? 'fair' : 'poor'
        });

        const icon = responseTime < 200 ? '⚡' : 
                     responseTime < 500 ? '✅' : 
                     responseTime < 1000 ? '⚠️' : '🐌';
        console.log(`   ${icon} ${test.name}: ${responseTime}ms`);
      } catch (error) {
        console.log(`   ❌ ${test.name}: 오류`);
      }
    }

    this.results.performance = perfResults;
  }

  async checkDataIntegrity() {
    console.log('\n🔍 데이터 무결성 체크...');
    
    try {
      // 사용자 데이터
      const usersRes = await fetch(`${this.baseURL}/api/dashboard/system/status`);
      const systemData = await usersRes.json();
      
      console.log('✅ 시스템 데이터:');
      console.log(`   - 총 사용자: ${systemData.data?.totalUsers || 0}명`);
      console.log(`   - 활성 사용자: ${systemData.data?.activeUsers || 0}명`);
      console.log(`   - 업타임: ${systemData.data?.uptime || 0}초`);

      // 강의 데이터
      const coursesRes = await fetch(`${this.baseURL}/api/courses`);
      if (coursesRes.ok) {
        const courses = await coursesRes.json();
        console.log(`   - 총 강의: ${courses.length || 0}개`);
      }

      // 훈련사 데이터
      const trainersRes = await fetch(`${this.baseURL}/api/trainers`);
      if (trainersRes.ok) {
        const trainers = await trainersRes.json();
        console.log(`   - 총 훈련사: ${trainers.length || 0}명`);
      }

      // 기관 데이터
      const institutesRes = await fetch(`${this.baseURL}/api/institutes`);
      if (institutesRes.ok) {
        const institutes = await institutesRes.json();
        console.log(`   - 총 기관: ${institutes.length || 0}개`);
      }

    } catch (error) {
      console.log('❌ 데이터 무결성 체크 실패:', error.message);
      this.results.errors.push(`데이터 무결성 오류: ${error.message}`);
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 종합 점검 결과 리포트');
    console.log('='.repeat(60));

    // 데이터베이스 상태
    console.log('\n🗄️ 데이터베이스:');
    console.log(`   상태: ${this.results.database.status || '미확인'}`);
    if (this.results.database.summary) {
      console.log(`   총 테이블: ${this.results.database.summary.totalTables || 0}개`);
      console.log(`   작동 테이블: ${this.results.database.summary.workingTables || 0}개`);
      console.log(`   총 레코드: ${this.results.database.summary.totalRecords || 0}개`);
    }

    // 인증 시스템
    console.log('\n🔐 인증 시스템:');
    console.log(`   상태: ${this.results.authentication.status || '미확인'}`);
    console.log(`   인증 여부: ${this.results.authentication.isAuthenticated ? '예' : '아니오'}`);

    // API 상태
    console.log('\n🔌 API 엔드포인트:');
    console.log(`   총 테스트: ${this.results.apis.total || 0}개`);
    console.log(`   성공: ${this.results.apis.successful || 0}개`);
    console.log(`   실패: ${this.results.apis.failed || 0}개`);
    console.log(`   성공률: ${this.results.apis.total > 0 ? Math.round((this.results.apis.successful / this.results.apis.total) * 100) : 0}%`);

    // 성능
    console.log('\n⚡ 성능:');
    if (this.results.performance.length > 0) {
      const avgTime = this.results.performance.reduce((sum, p) => sum + p.responseTime, 0) / this.results.performance.length;
      console.log(`   평균 응답 시간: ${Math.round(avgTime)}ms`);
    }

    // 오류
    if (this.results.errors.length > 0) {
      console.log('\n⚠️ 발견된 문제:');
      this.results.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    } else {
      console.log('\n✅ 발견된 문제 없음');
    }

    // 전체 상태
    const overallHealth = this.results.errors.length === 0 && 
                         this.results.database.status === '정상' &&
                         (this.results.apis.successful || 0) >= (this.results.apis.total || 0) * 0.8;

    console.log('\n' + '='.repeat(60));
    console.log(`전체 시스템 상태: ${overallHealth ? '✅ 정상' : '⚠️ 주의 필요'}`);
    console.log('='.repeat(60));

    return {
      overallHealth,
      timestamp: new Date().toISOString(),
      ...this.results
    };
  }

  async run() {
    console.log('🚀 TALEZ 시스템 종합 점검 시작...');
    console.log('='.repeat(60));

    await this.checkDatabaseConnection();
    await this.checkAuthenticationSystem();
    await this.checkCoreAPIs();
    await this.checkPerformance();
    await this.checkDataIntegrity();

    const report = this.generateReport();

    // 리포트 파일 저장
    const fs = require('fs');
    const path = require('path');
    
    if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs');
    }

    fs.writeFileSync(
      path.join('logs', 'system-check-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('\n📄 상세 리포트가 logs/system-check-report.json에 저장되었습니다.');

    return report;
  }
}

// 실행
if (require.main === module) {
  const checker = new ComprehensiveSystemChecker();
  checker.run()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ 점검 실행 오류:', error);
      process.exit(1);
    });
}

module.exports = ComprehensiveSystemChecker;
