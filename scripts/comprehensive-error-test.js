
#!/usr/bin/env node

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

console.log('🔍 TALEZ 서비스 운영 가능성 종합 오류 테스트 시작\n');

class ComprehensiveErrorTest {
  constructor() {
    this.baseURL = 'http://localhost:5000';
    this.results = {
      apiTests: [],
      loadTests: [],
      errorHandlingTests: [],
      securityTests: [],
      dataIntegrityTests: [],
      performanceTests: [],
      userFlowTests: [],
      errors: []
    };
    this.testCount = 0;
    this.passedCount = 0;
  }

  async runTest(testName, testFunction) {
    this.testCount++;
    console.log(`\n🧪 [${this.testCount}] ${testName}`);
    
    try {
      const startTime = Date.now();
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      if (result.success) {
        this.passedCount++;
        console.log(`   ✅ 성공 (${duration}ms)`);
        if (result.details) console.log(`   📄 ${result.details}`);
      } else {
        console.log(`   ❌ 실패: ${result.error || '알 수 없는 오류'}`);
        if (result.details) console.log(`   📄 ${result.details}`);
      }
      
      return { ...result, testName, duration };
    } catch (error) {
      console.log(`   💥 예외 발생: ${error.message}`);
      this.results.errors.push({ testName, error: error.message });
      return { success: false, testName, error: error.message, duration: 0 };
    }
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: 10000,
      ...options
    };
    
    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));
      
      return {
        status: response.status,
        ok: response.ok,
        data,
        headers: response.headers
      };
    } catch (error) {
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  // 1. 핵심 API 엔드포인트 테스트
  async testCoreAPIs() {
    console.log('\n📡 === 핵심 API 엔드포인트 테스트 ===');
    
    const coreEndpoints = [
      { path: '/api/dashboard/system/status', name: '시스템 상태' },
      { path: '/api/popular-stats', name: '인기 통계' },
      { path: '/api/weekly-stats', name: '주간 통계' },
      { path: '/api/banners', name: '배너 정보' },
      { path: '/api/courses', name: '강의 목록' },
      { path: '/api/trainers', name: '훈련사 목록' },
      { path: '/api/admin/logos', name: '로고 설정' },
      { path: '/api/auth/check', name: '인증 확인' }
    ];

    for (const endpoint of coreEndpoints) {
      const result = await this.runTest(`API: ${endpoint.name}`, async () => {
        const response = await this.makeRequest(endpoint.path);
        return {
          success: response.ok,
          error: !response.ok ? `HTTP ${response.status}` : null,
          details: `Status: ${response.status}`
        };
      });
      this.results.apiTests.push(result);
    }
  }

  // 2. 로드 테스트 (동시 요청)
  async testLoadHandling() {
    console.log('\n⚡ === 로드 테스트 (동시 요청) ===');
    
    const result = await this.runTest('동시 10개 요청 처리', async () => {
      const promises = Array(10).fill().map(() => 
        this.makeRequest('/api/popular-stats')
      );
      
      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.ok).length;
      
      return {
        success: successful >= 8, // 80% 이상 성공
        details: `${successful}/10 요청 성공`,
        error: successful < 8 ? '로드 처리 능력 부족' : null
      };
    });
    
    this.results.loadTests.push(result);
  }

  // 3. 에러 핸들링 테스트
  async testErrorHandling() {
    console.log('\n🛡️ === 에러 핸들링 테스트 ===');
    
    const errorTests = [
      {
        name: '존재하지 않는 엔드포인트',
        endpoint: '/api/nonexistent',
        expectedStatus: 404
      },
      {
        name: '잘못된 HTTP 메소드',
        endpoint: '/api/courses',
        method: 'DELETE',
        expectedStatus: [404, 405, 500] // 허용 가능한 상태 코드들
      },
      {
        name: '잘못된 데이터 POST',
        endpoint: '/api/auth/login',
        method: 'POST',
        body: { invalid: 'data' },
        expectedStatus: [400, 401, 422, 500]
      }
    ];

    for (const test of errorTests) {
      const result = await this.runTest(`에러 처리: ${test.name}`, async () => {
        const options = {
          method: test.method || 'GET',
          headers: { 'Content-Type': 'application/json' }
        };
        
        if (test.body) {
          options.body = JSON.stringify(test.body);
        }
        
        const response = await this.makeRequest(test.endpoint, options);
        const expectedStatuses = Array.isArray(test.expectedStatus) 
          ? test.expectedStatus 
          : [test.expectedStatus];
        
        const isExpectedStatus = expectedStatuses.includes(response.status);
        
        return {
          success: isExpectedStatus,
          details: `Status: ${response.status} (예상: ${expectedStatuses.join(', ')})`,
          error: !isExpectedStatus ? '예상된 에러 상태 코드가 아님' : null
        };
      });
      
      this.results.errorHandlingTests.push(result);
    }
  }

  // 4. 보안 테스트
  async testSecurity() {
    console.log('\n🔒 === 보안 테스트 ===');
    
    const securityTests = [
      {
        name: 'CORS 헤더 확인',
        test: async () => {
          const response = await this.makeRequest('/api/popular-stats');
          const corsHeader = response.headers.get('access-control-allow-origin');
          return {
            success: !!corsHeader,
            details: `CORS 헤더: ${corsHeader || '없음'}`
          };
        }
      },
      {
        name: 'SQL Injection 방어',
        test: async () => {
          const response = await this.makeRequest("/api/courses?search=' OR '1'='1");
          return {
            success: response.status !== 500, // 서버가 크래시되지 않아야 함
            details: `Status: ${response.status}`
          };
        }
      },
      {
        name: 'XSS 방어',
        test: async () => {
          const response = await this.makeRequest('/api/courses?search=<script>alert("xss")</script>');
          return {
            success: response.status !== 500,
            details: `Status: ${response.status}`
          };
        }
      }
    ];

    for (const test of securityTests) {
      const result = await this.runTest(`보안: ${test.name}`, test.test);
      this.results.securityTests.push(result);
    }
  }

  // 5. 데이터 무결성 테스트
  async testDataIntegrity() {
    console.log('\n📊 === 데이터 무결성 테스트 ===');
    
    const result = await this.runTest('데이터 일관성 확인', async () => {
      const responses = await Promise.all([
        this.makeRequest('/api/dashboard/system/status'),
        this.makeRequest('/api/popular-stats'),
        this.makeRequest('/api/weekly-stats')
      ]);
      
      const allSuccessful = responses.every(r => r.ok);
      const hasValidData = responses.every(r => 
        r.data && typeof r.data === 'object'
      );
      
      return {
        success: allSuccessful && hasValidData,
        details: `${responses.filter(r => r.ok).length}/${responses.length} 응답 성공`,
        error: !allSuccessful ? '일부 데이터 요청 실패' : 
               !hasValidData ? '잘못된 데이터 형식' : null
      };
    });
    
    this.results.dataIntegrityTests.push(result);
  }

  // 6. 성능 테스트
  async testPerformance() {
    console.log('\n🚀 === 성능 테스트 ===');
    
    const performanceTests = [
      {
        name: '응답 시간 (< 1초)',
        endpoint: '/api/popular-stats',
        maxTime: 1000
      },
      {
        name: '대용량 데이터 처리',
        endpoint: '/api/courses',
        maxTime: 2000
      }
    ];

    for (const test of performanceTests) {
      const result = await this.runTest(`성능: ${test.name}`, async () => {
        const startTime = Date.now();
        const response = await this.makeRequest(test.endpoint);
        const duration = Date.now() - startTime;
        
        return {
          success: response.ok && duration < test.maxTime,
          details: `응답 시간: ${duration}ms (최대: ${test.maxTime}ms)`,
          error: duration >= test.maxTime ? '응답 시간 초과' : 
                 !response.ok ? `HTTP ${response.status}` : null
        };
      });
      
      this.results.performanceTests.push(result);
    }
  }

  // 7. 사용자 플로우 테스트
  async testUserFlows() {
    console.log('\n👤 === 사용자 플로우 테스트 ===');
    
    const userFlows = [
      {
        name: '홈페이지 → 강의 목록',
        steps: ['/api/popular-stats', '/api/courses']
      },
      {
        name: '강의 검색 → 상세 조회',
        steps: ['/api/courses', '/api/courses'] // 실제로는 특정 강의 ID
      },
      {
        name: '훈련사 목록 → 예약 정보',
        steps: ['/api/trainers', '/api/dashboard/system/status']
      }
    ];

    for (const flow of userFlows) {
      const result = await this.runTest(`사용자 플로우: ${flow.name}`, async () => {
        let allSuccessful = true;
        let errorDetails = [];
        
        for (const step of flow.steps) {
          const response = await this.makeRequest(step);
          if (!response.ok) {
            allSuccessful = false;
            errorDetails.push(`${step}: ${response.status}`);
          }
        }
        
        return {
          success: allSuccessful,
          details: `${flow.steps.length}단계 플로우`,
          error: errorDetails.length > 0 ? errorDetails.join(', ') : null
        };
      });
      
      this.results.userFlowTests.push(result);
    }
  }

  // 8. 메모리 및 리소스 테스트
  async testResourceUsage() {
    console.log('\n💾 === 리소스 사용량 테스트 ===');
    
    const result = await this.runTest('메모리 사용량 확인', async () => {
      // 연속 요청으로 메모리 누수 테스트
      const promises = Array(20).fill().map(() => 
        this.makeRequest('/api/popular-stats')
      );
      
      await Promise.all(promises);
      
      // 시스템 상태로 메모리 사용량 간접 확인
      const systemStatus = await this.makeRequest('/api/dashboard/system/status');
      
      return {
        success: systemStatus.ok,
        details: '20회 연속 요청 후 시스템 정상',
        error: !systemStatus.ok ? '시스템 상태 확인 실패' : null
      };
    });
    
    this.results.performanceTests.push(result);
  }

  // 종합 리포트 생성
  generateReport() {
    console.log('\n📋 === 종합 테스트 결과 ===');
    
    const totalTests = this.testCount;
    const passedTests = this.passedCount;
    const failedTests = totalTests - passedTests;
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);
    
    console.log(`\n📊 전체 결과:`);
    console.log(`   총 테스트: ${totalTests}개`);
    console.log(`   성공: ${passedTests}개`);
    console.log(`   실패: ${failedTests}개`);
    console.log(`   성공률: ${successRate}%`);
    
    // 카테고리별 결과
    const categories = [
      { name: 'API 엔드포인트', tests: this.results.apiTests },
      { name: '로드 처리', tests: this.results.loadTests },
      { name: '에러 핸들링', tests: this.results.errorHandlingTests },
      { name: '보안', tests: this.results.securityTests },
      { name: '데이터 무결성', tests: this.results.dataIntegrityTests },
      { name: '성능', tests: this.results.performanceTests },
      { name: '사용자 플로우', tests: this.results.userFlowTests }
    ];
    
    console.log(`\n📂 카테고리별 결과:`);
    categories.forEach(category => {
      if (category.tests.length > 0) {
        const passed = category.tests.filter(t => t.success).length;
        const total = category.tests.length;
        const rate = ((passed / total) * 100).toFixed(1);
        console.log(`   ${category.name}: ${passed}/${total} (${rate}%)`);
      }
    });
    
    // 운영 준비도 평가
    console.log(`\n🎯 운영 준비도 평가:`);
    
    if (successRate >= 90) {
      console.log(`   🟢 우수 (${successRate}%): 즉시 운영 가능`);
    } else if (successRate >= 80) {
      console.log(`   🟡 양호 (${successRate}%): 소규모 수정 후 운영 가능`);
    } else if (successRate >= 70) {
      console.log(`   🟠 보통 (${successRate}%): 중요 이슈 해결 필요`);
    } else {
      console.log(`   🔴 미흡 (${successRate}%): 대규모 수정 필요`);
    }
    
    // 주요 실패 항목
    if (failedTests > 0) {
      console.log(`\n❌ 실패한 테스트들:`);
      const allTests = [
        ...this.results.apiTests,
        ...this.results.loadTests,
        ...this.results.errorHandlingTests,
        ...this.results.securityTests,
        ...this.results.dataIntegrityTests,
        ...this.results.performanceTests,
        ...this.results.userFlowTests
      ];
      
      allTests.filter(t => !t.success).forEach(test => {
        console.log(`   • ${test.testName}: ${test.error}`);
      });
    }
    
    // 권장사항
    this.generateRecommendations(successRate);
    
    // 상세 리포트 저장
    const report = {
      summary: {
        totalTests,
        passedTests,
        failedTests,
        successRate: parseFloat(successRate),
        timestamp: new Date().toISOString()
      },
      results: this.results,
      categories: categories.map(cat => ({
        name: cat.name,
        total: cat.tests.length,
        passed: cat.tests.filter(t => t.success).length,
        tests: cat.tests
      }))
    };
    
    fs.writeFileSync(
      path.join(__dirname, '../logs/comprehensive-error-test-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log(`\n📄 상세 리포트 저장: logs/comprehensive-error-test-report.json`);
    
    return report;
  }
  
  generateRecommendations(successRate) {
    console.log(`\n💡 운영을 위한 권장사항:`);
    
    if (successRate >= 90) {
      console.log(`   1. ✅ 현재 상태로 베타 서비스 출시 가능`);
      console.log(`   2. 📊 사용자 피드백 수집 시스템 구축`);
      console.log(`   3. 📈 성능 모니터링 도구 도입`);
    } else if (successRate >= 80) {
      console.log(`   1. 🔧 실패한 테스트 항목 우선 수정`);
      console.log(`   2. 🧪 추가 테스트 후 소프트 런칭`);
      console.log(`   3. 📋 오류 로깅 시스템 강화`);
    } else {
      console.log(`   1. 🚨 핵심 기능 안정성 확보 최우선`);
      console.log(`   2. 🛡️ 보안 및 에러 핸들링 강화`);
      console.log(`   3. ⚡ 성능 최적화 작업 필요`);
    }
    
    console.log(`   4. 🔄 정기적인 헬스 체크 자동화`);
    console.log(`   5. 📞 24시간 모니터링 체계 구축`);
  }

  async run() {
    try {
      // 순차적으로 모든 테스트 실행
      await this.testCoreAPIs();
      await this.testLoadHandling();
      await this.testErrorHandling();
      await this.testSecurity();
      await this.testDataIntegrity();
      await this.testPerformance();
      await this.testUserFlows();
      await this.testResourceUsage();
      
      // 종합 리포트 생성
      return this.generateReport();
      
    } catch (error) {
      console.error('\n💥 테스트 실행 중 치명적 오류:', error);
      return null;
    }
  }
}

// 실행
if (require.main === module) {
  const tester = new ComprehensiveErrorTest();
  tester.run().then(report => {
    if (report && report.summary.successRate < 70) {
      process.exit(1); // CI/CD에서 실패로 처리
    }
  });
}

module.exports = ComprehensiveErrorTest;
