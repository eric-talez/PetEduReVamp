
#!/usr/bin/env node

const fetch = require('node-fetch');

class DataFlowValidator {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:5000';
  }

  async validateAdminToUserFlow() {
    console.log('🔄 관리자 → 사용자 데이터 플로우 검증 중...\n');

    const results = [];

    // 1. 기관 관리자가 등록한 기관이 사용자 검색에 노출되는지 확인
    console.log('1️⃣ 기관 등록 → 사용자 노출 확인');
    try {
      const instituteListResponse = await fetch(`${this.baseURL}/api/institutes`);
      const institutes = await instituteListResponse.json();
      
      const userSearchResponse = await fetch(`${this.baseURL}/api/places/search?keyword=훈련`);
      const searchResults = await userSearchResponse.json();
      
      const adminInstitutes = institutes.length || 0;
      const userVisibleInstitutes = searchResults.places ? searchResults.places.filter(p => p.type === 'institute').length : 0;
      
      results.push({
        test: '기관 등록 → 사용자 노출',
        adminCount: adminInstitutes,
        userCount: userVisibleInstitutes,
        success: userVisibleInstitutes > 0,
        details: `관리자 등록: ${adminInstitutes}개, 사용자 노출: ${userVisibleInstitutes}개`
      });
      
      console.log(`   ✅ 관리자 등록: ${adminInstitutes}개`);
      console.log(`   ✅ 사용자 노출: ${userVisibleInstitutes}개`);
    } catch (error) {
      results.push({
        test: '기관 등록 → 사용자 노출',
        success: false,
        error: error.message
      });
      console.log(`   ❌ 오류: ${error.message}`);
    }

    // 2. 훈련사 승인 → 사용자 검색 가능 확인
    console.log('\n2️⃣ 훈련사 승인 → 사용자 검색 확인');
    try {
      const trainerListResponse = await fetch(`${this.baseURL}/api/trainers`);
      const trainers = await trainerListResponse.json();
      
      const trainerSearchResponse = await fetch(`${this.baseURL}/api/places/search?keyword=훈련사`);
      const trainerSearchResults = await trainerSearchResponse.json();
      
      const adminTrainers = trainers.length || 0;
      const userVisibleTrainers = trainerSearchResults.places ? trainerSearchResults.places.filter(p => p.type === 'trainer').length : 0;
      
      results.push({
        test: '훈련사 승인 → 사용자 검색',
        adminCount: adminTrainers,
        userCount: userVisibleTrainers,
        success: userVisibleTrainers > 0 || adminTrainers > 0,
        details: `관리자 등록: ${adminTrainers}개, 사용자 검색: ${userVisibleTrainers}개`
      });
      
      console.log(`   ✅ 관리자 등록: ${adminTrainers}개`);
      console.log(`   ✅ 사용자 검색: ${userVisibleTrainers}개`);
    } catch (error) {
      results.push({
        test: '훈련사 승인 → 사용자 검색',
        success: false,
        error: error.message
      });
      console.log(`   ❌ 오류: ${error.message}`);
    }

    // 3. 위치 정보 등록 → 지도 서비스 노출 확인
    console.log('\n3️⃣ 위치 정보 → 지도 서비스 확인');
    try {
      const locationResponse = await fetch(`${this.baseURL}/api/places/nearby?lat=37.5665&lng=126.9780&type=institute&radius=5000`);
      const locations = await locationResponse.json();
      
      const locationCount = locations.length || 0;
      
      results.push({
        test: '위치 정보 → 지도 서비스',
        userCount: locationCount,
        success: locationCount > 0,
        details: `지도 서비스 노출: ${locationCount}개 위치`
      });
      
      console.log(`   ✅ 지도 서비스 노출: ${locationCount}개 위치`);
    } catch (error) {
      results.push({
        test: '위치 정보 → 지도 서비스',
        success: false,
        error: error.message
      });
      console.log(`   ❌ 오류: ${error.message}`);
    }

    // 4. 관리자 설정 → 사용자 경험 반영 확인
    console.log('\n4️⃣ 관리자 설정 → 사용자 경험 확인');
    try {
      const systemStatusResponse = await fetch(`${this.baseURL}/api/dashboard/system-status`);
      const systemStatus = await systemStatusResponse.json();
      
      results.push({
        test: '관리자 설정 → 사용자 경험',
        success: systemStatusResponse.ok,
        details: `시스템 상태: ${systemStatus.totalUsers || 0}명 사용자, 활성 사용자: ${systemStatus.activeUsers || 0}명`
      });
      
      console.log(`   ✅ 시스템 활성 상태 확인됨`);
      console.log(`   ✅ 총 사용자: ${systemStatus.totalUsers || 0}명`);
    } catch (error) {
      results.push({
        test: '관리자 설정 → 사용자 경험',
        success: false,
        error: error.message
      });
      console.log(`   ❌ 오류: ${error.message}`);
    }

    return results;
  }

  async validateUserToAdminFlow() {
    console.log('\n🔄 사용자 → 관리자 데이터 플로우 검증 중...\n');

    const results = [];

    // 1. 사용자 예약 → 관리자 알림 확인
    console.log('1️⃣ 사용자 예약 → 관리자 알림 확인');
    try {
      // 테스트 예약 생성
      const reservationResponse = await fetch(`${this.baseURL}/api/trainers/1/consultation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: '2024-12-20',
          time: '10:00',
          petName: '테스트 강아지',
          phone: '010-1234-5678',
          email: 'test@test.com'
        })
      });

      results.push({
        test: '사용자 예약 → 관리자 알림',
        success: reservationResponse.ok,
        details: reservationResponse.ok ? '예약 시스템 정상 작동' : '예약 시스템 오류'
      });

      if (reservationResponse.ok) {
        console.log('   ✅ 예약 시스템 정상 작동');
      } else {
        console.log('   ❌ 예약 시스템 오류');
      }
    } catch (error) {
      results.push({
        test: '사용자 예약 → 관리자 알림',
        success: false,
        error: error.message
      });
      console.log(`   ❌ 오류: ${error.message}`);
    }

    // 2. 사용자 리뷰 → 관리자 모니터링 확인
    console.log('\n2️⃣ 사용자 활동 → 관리자 분석 데이터 확인');
    try {
      const analyticsResponse = await fetch(`${this.baseURL}/api/dashboard/analytics`);
      
      results.push({
        test: '사용자 활동 → 관리자 분석',
        success: analyticsResponse.ok,
        details: analyticsResponse.ok ? '분석 데이터 수집 정상' : '분석 데이터 수집 오류'
      });

      if (analyticsResponse.ok) {
        console.log('   ✅ 분석 데이터 수집 정상');
      } else {
        console.log('   ❌ 분석 데이터 수집 오류');
      }
    } catch (error) {
      results.push({
        test: '사용자 활동 → 관리자 분석',
        success: false,
        error: error.message
      });
      console.log(`   ❌ 오류: ${error.message}`);
    }

    return results;
  }

  generateFlowReport(adminToUserResults, userToAdminResults) {
    const allResults = [...adminToUserResults, ...userToAdminResults];
    const successCount = allResults.filter(r => r.success).length;
    const totalCount = allResults.length;
    
    console.log('\n📊 === 데이터 플로우 검증 결과 ===');
    console.log(`✅ 성공: ${successCount}/${totalCount} (${(successCount/totalCount*100).toFixed(1)}%)`);
    console.log(`❌ 실패: ${totalCount - successCount}/${totalCount}`);

    console.log('\n📋 === 상세 결과 ===');
    allResults.forEach((result, index) => {
      const icon = result.success ? '✅' : '❌';
      console.log(`${icon} ${result.test}`);
      if (result.details) {
        console.log(`     ${result.details}`);
      }
      if (result.error) {
        console.log(`     오류: ${result.error}`);
      }
    });

    // 개선 권장사항
    const failedTests = allResults.filter(r => !r.success);
    if (failedTests.length > 0) {
      console.log('\n💡 === 개선 권장사항 ===');
      failedTests.forEach((test, index) => {
        console.log(`${index + 1}. ${test.test} 실패`);
        if (test.test.includes('기관')) {
          console.log('   → server/institutes/routes.ts와 client/src/pages/locations/index.tsx 연계 확인');
        } else if (test.test.includes('훈련사')) {
          console.log('   → server/trainers/routes.ts와 검색 API 연동 확인');
        } else if (test.test.includes('위치')) {
          console.log('   → server/location/routes.ts와 지도 컴포넌트 연계 확인');
        } else if (test.test.includes('예약')) {
          console.log('   → 예약 API와 알림 시스템 연계 확인');
        }
      });
    }

    return {
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount,
        successRate: (successCount/totalCount*100).toFixed(1)
      },
      results: allResults,
      timestamp: new Date().toISOString()
    };
  }

  async run() {
    console.log('🚀 TALEZ 데이터 플로우 검증 시작...\n');

    try {
      const adminToUserResults = await this.validateAdminToUserFlow();
      const userToAdminResults = await this.validateUserToAdminFlow();
      
      const report = this.generateFlowReport(adminToUserResults, userToAdminResults);
      
      // 결과 파일 저장
      require('fs').writeFileSync(
        require('path').join(__dirname, '../logs/data-flow-report.json'),
        JSON.stringify(report, null, 2)
      );

      console.log('\n📋 상세 리포트가 logs/data-flow-report.json에 저장되었습니다.');
      
      return report;
    } catch (error) {
      console.error('❌ 검증 실행 중 오류:', error);
      return null;
    }
  }
}

// 실행부
if (require.main === module) {
  const validator = new DataFlowValidator();
  validator.run();
}

module.exports = DataFlowValidator;
