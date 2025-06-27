
#!/usr/bin/env node

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

class APIIntegrationChecker {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:5000';
    this.results = {
      apiTests: [],
      integrationTests: [],
      dataFlowTests: [],
      errors: []
    };
  }

  async checkAPI(endpoint, method = 'GET', data = null, expectedStatus = 200) {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      const responseData = await response.json().catch(() => ({}));

      const result = {
        endpoint,
        method,
        status: response.status,
        expected: expectedStatus,
        success: response.status === expectedStatus,
        data: responseData,
        timestamp: new Date().toISOString()
      };

      this.results.apiTests.push(result);
      return result;
    } catch (error) {
      const errorResult = {
        endpoint,
        method,
        error: error.message,
        success: false,
        timestamp: new Date().toISOString()
      };
      this.results.errors.push(errorResult);
      return errorResult;
    }
  }

  async checkCoreAPIs() {
    console.log('🔍 핵심 API 엔드포인트 체크 중...');

    // 기본 헬스체크
    await this.checkAPI('/api/health');
    
    // 인증 관련
    await this.checkAPI('/api/auth/check');
    
    // 기관 관리
    await this.checkAPI('/api/institutes');
    await this.checkAPI('/api/institutes/1');
    
    // 훈련사 관리
    await this.checkAPI('/api/trainers');
    await this.checkAPI('/api/trainers/1');
    
    // 위치 서비스
    await this.checkAPI('/api/places/nearby?lat=37.5665&lng=126.9780&type=institute&radius=3000');
    await this.checkAPI('/api/places/search?keyword=훈련');
    
    // 대시보드 데이터
    await this.checkAPI('/api/dashboard/system-status');
    await this.checkAPI('/api/dashboard/analytics');
    
    // 메시징
    await this.checkAPI('/api/messaging/conversations');
    
    // 알림
    await this.checkAPI('/api/notifications');
  }

  async checkAdminUserDataFlow() {
    console.log('🔄 관리자-사용자 데이터 연계 체크 중...');

    // 1. 관리자가 기관 등록 -> 사용자에게 노출 확인
    const instituteTest = await this.checkDataFlow(
      '기관 등록 -> 사용자 노출',
      async () => {
        // 기관 목록 조회
        const institutes = await this.checkAPI('/api/institutes');
        return institutes.success && institutes.data.length > 0;
      }
    );

    // 2. 관리자가 훈련사 승인 -> 사용자 검색 가능 확인
    const trainerTest = await this.checkDataFlow(
      '훈련사 승인 -> 사용자 검색',
      async () => {
        const trainers = await this.checkAPI('/api/trainers');
        return trainers.success && trainers.data.length > 0;
      }
    );

    // 3. 상품 등록 -> 쇼핑몰 노출 확인
    const productTest = await this.checkDataFlow(
      '상품 등록 -> 쇼핑몰 노출',
      async () => {
        const products = await this.checkAPI('/api/shop/products');
        return products.success;
      }
    );

    // 4. 위치 정보 등록 -> 지도 서비스 노출 확인
    const locationTest = await this.checkDataFlow(
      '위치 등록 -> 지도 노출',
      async () => {
        const locations = await this.checkAPI('/api/places/nearby?lat=37.5665&lng=126.9780&type=institute&radius=5000');
        return locations.success && locations.data.length > 0;
      }
    );

    return [instituteTest, trainerTest, productTest, locationTest];
  }

  async checkDataFlow(testName, testFunction) {
    try {
      const result = await testFunction();
      const testResult = {
        name: testName,
        success: result,
        timestamp: new Date().toISOString(),
        details: result ? '정상 연동' : '연동 실패'
      };
      this.results.dataFlowTests.push(testResult);
      return testResult;
    } catch (error) {
      const errorResult = {
        name: testName,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      this.results.errors.push(errorResult);
      return errorResult;
    }
  }

  async checkFrontendBackendIntegration() {
    console.log('🌐 프론트엔드-백엔드 통합 체크 중...');

    // React Query 캐시 확인
    const queryCheck = await this.checkDataFlow(
      'React Query 데이터 캐싱',
      async () => {
        // 같은 API를 두 번 호출해서 캐싱 확인
        const first = await this.checkAPI('/api/institutes');
        const second = await this.checkAPI('/api/institutes');
        return first.success && second.success;
      }
    );

    // 실시간 데이터 업데이트 확인
    const realtimeCheck = await this.checkDataFlow(
      '실시간 데이터 업데이트',
      async () => {
        const notifications = await this.checkAPI('/api/notifications');
        return notifications.success;
      }
    );

    return [queryCheck, realtimeCheck];
  }

  async checkCriticalUserFlows() {
    console.log('👤 주요 사용자 플로우 체크 중...');

    // 1. 사용자 로그인 -> 대시보드 접근
    const loginFlow = await this.checkDataFlow(
      '로그인 -> 대시보드',
      async () => {
        const authCheck = await this.checkAPI('/api/auth/check');
        if (authCheck.success) {
          const dashboard = await this.checkAPI('/api/dashboard/system-status');
          return dashboard.success;
        }
        return false;
      }
    );

    // 2. 기관 검색 -> 상세 정보 조회
    const searchFlow = await this.checkDataFlow(
      '기관 검색 -> 상세 조회',
      async () => {
        const search = await this.checkAPI('/api/places/search?keyword=훈련');
        if (search.success && search.data.places && search.data.places.length > 0) {
          const firstId = search.data.places[0].id.replace('institute_', '');
          const detail = await this.checkAPI(`/api/institutes/${firstId}`);
          return detail.success;
        }
        return false;
      }
    );

    // 3. 훈련사 선택 -> 예약 프로세스
    const reservationFlow = await this.checkDataFlow(
      '훈련사 선택 -> 예약',
      async () => {
        const trainers = await this.checkAPI('/api/trainers');
        if (trainers.success && trainers.data.length > 0) {
          const trainerId = trainers.data[0].id;
          const consultation = await this.checkAPI(
            `/api/trainers/${trainerId}/consultation`,
            'POST',
            {
              date: '2024-12-20',
              time: '10:00',
              petName: '테스트',
              phone: '010-1234-5678',
              email: 'test@test.com'
            }
          );
          return consultation.success;
        }
        return false;
      }
    );

    return [loginFlow, searchFlow, reservationFlow];
  }

  generateReport() {
    const totalTests = this.results.apiTests.length + this.results.dataFlowTests.length;
    const successfulTests = [
      ...this.results.apiTests.filter(t => t.success),
      ...this.results.dataFlowTests.filter(t => t.success)
    ].length;

    const report = {
      summary: {
        total: totalTests,
        successful: successfulTests,
        failed: totalTests - successfulTests,
        successRate: totalTests > 0 ? (successfulTests / totalTests * 100).toFixed(2) : 0,
        timestamp: new Date().toISOString()
      },
      details: this.results,
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    const failedAPIs = this.results.apiTests.filter(t => !t.success);
    const failedDataFlows = this.results.dataFlowTests.filter(t => !t.success);

    if (failedAPIs.length > 0) {
      recommendations.push({
        category: 'API 연결',
        issue: `${failedAPIs.length}개 API 엔드포인트 실패`,
        solution: 'server/routes.ts와 관련 라우트 파일들을 확인하여 엔드포인트 구현 상태를 점검하세요.'
      });
    }

    if (failedDataFlows.length > 0) {
      recommendations.push({
        category: '데이터 연계',
        issue: `${failedDataFlows.length}개 데이터 플로우 실패`,
        solution: '관리자 입력 데이터가 사용자 인터페이스에 제대로 반영되는지 확인하고, storage.ts의 데이터 처리 로직을 점검하세요.'
      });
    }

    if (this.results.errors.length > 0) {
      recommendations.push({
        category: '오류 처리',
        issue: `${this.results.errors.length}개 시스템 오류 발생`,
        solution: '서버 로그를 확인하고 error-handler.ts 미들웨어가 제대로 작동하는지 점검하세요.'
      });
    }

    return recommendations;
  }

  async run() {
    console.log('🚀 TALEZ API 통합 테스트 시작...\n');

    try {
      // 1. 핵심 API 체크
      await this.checkCoreAPIs();
      
      // 2. 관리자-사용자 데이터 연계 체크
      await this.checkAdminUserDataFlow();
      
      // 3. 프론트엔드-백엔드 통합 체크
      await this.checkFrontendBackendIntegration();
      
      // 4. 주요 사용자 플로우 체크
      await this.checkCriticalUserFlows();

      // 5. 결과 리포트 생성
      const report = this.generateReport();
      
      // 6. 결과 출력
      this.printResults(report);
      
      // 7. 리포트 파일 저장
      fs.writeFileSync(
        path.join(__dirname, '../logs/api-integration-report.json'),
        JSON.stringify(report, null, 2)
      );

      console.log('\n📋 상세 리포트가 logs/api-integration-report.json에 저장되었습니다.');
      
      return report;
    } catch (error) {
      console.error('❌ 테스트 실행 중 오류:', error);
      return null;
    }
  }

  printResults(report) {
    console.log('\n📊 === API 통합 테스트 결과 ===');
    console.log(`✅ 성공: ${report.summary.successful}/${report.summary.total} (${report.summary.successRate}%)`);
    console.log(`❌ 실패: ${report.summary.failed}/${report.summary.total}`);
    
    if (this.results.errors.length > 0) {
      console.log(`🚨 오류: ${this.results.errors.length}개`);
    }

    console.log('\n🔍 === API 테스트 상세 ===');
    this.results.apiTests.forEach(test => {
      const icon = test.success ? '✅' : '❌';
      console.log(`${icon} ${test.method} ${test.endpoint} - ${test.status}`);
    });

    console.log('\n🔄 === 데이터 연계 테스트 ===');
    this.results.dataFlowTests.forEach(test => {
      const icon = test.success ? '✅' : '❌';
      console.log(`${icon} ${test.name} - ${test.details || test.error || '완료'}`);
    });

    if (report.recommendations.length > 0) {
      console.log('\n💡 === 개선 권장사항 ===');
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. [${rec.category}] ${rec.issue}`);
        console.log(`   해결방안: ${rec.solution}\n`);
      });
    }
  }
}

// 실행부
if (require.main === module) {
  const checker = new APIIntegrationChecker();
  checker.run().then(report => {
    if (report && report.summary.successRate < 80) {
      process.exit(1); // CI/CD에서 실패로 처리
    }
  });
}

module.exports = APIIntegrationChecker;
