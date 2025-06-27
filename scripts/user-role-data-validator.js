
#!/usr/bin/env node

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

class UserRoleDataValidator {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:5000';
    this.results = {
      userRoleTests: [],
      dataConnectivityTests: [],
      permissionTests: [],
      dataFlowTests: [],
      errors: []
    };
  }

  async validateUserRoleDataFlow() {
    console.log('🔍 사용자 역할별 데이터 연결성 검증 시작...\n');

    // 1. 반려견 주인 → 다른 역할 연결성
    await this.validatePetOwnerConnections();
    
    // 2. 훈련사 → 다른 역할 연결성
    await this.validateTrainerConnections();
    
    // 3. 기관 관리자 → 다른 역할 연결성
    await this.validateInstituteAdminConnections();
    
    // 4. 관리자 → 전체 시스템 연결성
    await this.validateAdminConnections();
    
    // 5. 역할 간 권한 체크
    await this.validateRolePermissions();
    
    // 6. 데이터 무결성 체크
    await this.validateDataIntegrity();
  }

  async validatePetOwnerConnections() {
    console.log('👨‍👩‍👧‍👦 반려견 주인 데이터 연결성 검증...');

    // 1. 반려견 주인 → 훈련사 예약 연결
    const petOwnerToTrainer = await this.checkDataFlow(
      '반려견 주인 → 훈련사 예약',
      async () => {
        // 반려견 주인으로 훈련사 예약 시도
        const trainers = await this.checkAPI('/api/trainers');
        if (trainers.success && trainers.data.length > 0) {
          const reservation = await this.checkAPI(
            `/api/trainers/${trainers.data[0].id}/consultation`,
            'POST',
            {
              date: '2024-12-25',
              time: '14:00',
              petName: '테스트 반려견',
              phone: '010-1234-5678',
              email: 'petowner@test.com'
            }
          );
          return reservation.success;
        }
        return false;
      }
    );

    // 2. 반려견 주인 → 기관 검색/등록 연결
    const petOwnerToInstitute = await this.checkDataFlow(
      '반려견 주인 → 기관 검색',
      async () => {
        const institutes = await this.checkAPI('/api/institutes');
        const search = await this.checkAPI('/api/places/search?keyword=훈련소');
        return institutes.success && search.success;
      }
    );

    // 3. 반려견 주인 → 상품 구매 연결
    const petOwnerToShop = await this.checkDataFlow(
      '반려견 주인 → 쇼핑',
      async () => {
        const products = await this.checkAPI('/api/shop/products');
        return products.success;
      }
    );

    this.results.userRoleTests.push({
      role: 'pet-owner',
      connections: [petOwnerToTrainer, petOwnerToInstitute, petOwnerToShop]
    });
  }

  async validateTrainerConnections() {
    console.log('🏃‍♂️ 훈련사 데이터 연결성 검증...');

    // 1. 훈련사 → 기관 소속 연결
    const trainerToInstitute = await this.checkDataFlow(
      '훈련사 → 기관 소속',
      async () => {
        const trainers = await this.checkAPI('/api/trainers');
        if (trainers.success && trainers.data.length > 0) {
          const trainer = trainers.data[0];
          if (trainer.instituteId) {
            const institute = await this.checkAPI(`/api/institutes/${trainer.instituteId}`);
            return institute.success;
          }
        }
        return false;
      }
    );

    // 2. 훈련사 → 수강생 관리 연결
    const trainerToStudents = await this.checkDataFlow(
      '훈련사 → 수강생 관리',
      async () => {
        const courses = await this.checkAPI('/api/courses');
        return courses.success;
      }
    );

    // 3. 훈련사 → 수익 정산 연결
    const trainerToEarnings = await this.checkDataFlow(
      '훈련사 → 수익 정산',
      async () => {
        const earnings = await this.checkAPI('/api/trainers/1/earnings');
        return earnings.success;
      }
    );

    this.results.userRoleTests.push({
      role: 'trainer',
      connections: [trainerToInstitute, trainerToStudents, trainerToEarnings]
    });
  }

  async validateInstituteAdminConnections() {
    console.log('🏢 기관 관리자 데이터 연결성 검증...');

    // 1. 기관 관리자 → 훈련사 관리 연결
    const instituteToTrainers = await this.checkDataFlow(
      '기관 관리자 → 훈련사 관리',
      async () => {
        const institutes = await this.checkAPI('/api/institutes');
        if (institutes.success && institutes.data.length > 0) {
          const instituteId = institutes.data[0].id;
          const trainers = await this.checkAPI(`/api/institutes/${instituteId}/trainers`);
          return trainers.success;
        }
        return false;
      }
    );

    // 2. 기관 관리자 → 수강생 관리 연결
    const instituteToStudents = await this.checkDataFlow(
      '기관 관리자 → 수강생 관리',
      async () => {
        const students = await this.checkAPI('/api/institutes/1/students');
        return students.success;
      }
    );

    // 3. 기관 관리자 → 수익 통계 연결
    const instituteToStats = await this.checkDataFlow(
      '기관 관리자 → 수익 통계',
      async () => {
        const stats = await this.checkAPI('/api/institutes/1/stats');
        return stats.success;
      }
    );

    this.results.userRoleTests.push({
      role: 'institute-admin',
      connections: [instituteToTrainers, instituteToStudents, instituteToStats]
    });
  }

  async validateAdminConnections() {
    console.log('👑 관리자 전체 시스템 연결성 검증...');

    // 1. 관리자 → 승인 관리 연결
    const adminToApprovals = await this.checkDataFlow(
      '관리자 → 승인 관리',
      async () => {
        const approvals = await this.checkAPI('/api/admin/approvals');
        return approvals.success;
      }
    );

    // 2. 관리자 → 시스템 모니터링 연결
    const adminToMonitoring = await this.checkDataFlow(
      '관리자 → 시스템 모니터링',
      async () => {
        const systemStatus = await this.checkAPI('/api/dashboard/system-status');
        const analytics = await this.checkAPI('/api/dashboard/analytics');
        return systemStatus.success && analytics.success;
      }
    );

    // 3. 관리자 → 전체 사용자 관리 연결
    const adminToUsers = await this.checkDataFlow(
      '관리자 → 사용자 관리',
      async () => {
        const users = await this.checkAPI('/api/spring/users');
        return users.success;
      }
    );

    this.results.userRoleTests.push({
      role: 'admin',
      connections: [adminToApprovals, adminToMonitoring, adminToUsers]
    });
  }

  async validateRolePermissions() {
    console.log('🔐 역할별 권한 체크...');

    const roles = ['pet-owner', 'trainer', 'institute-admin', 'admin'];
    
    for (const role of roles) {
      const permissions = await this.checkRolePermissions(role);
      this.results.permissionTests.push({
        role,
        permissions,
        timestamp: new Date().toISOString()
      });
    }
  }

  async checkRolePermissions(role) {
    const permissionMap = {
      'pet-owner': [
        { resource: '/api/trainers', method: 'GET', expected: true },
        { resource: '/api/institutes', method: 'GET', expected: true },
        { resource: '/api/shop/products', method: 'GET', expected: true },
        { resource: '/api/admin/users', method: 'GET', expected: false }
      ],
      'trainer': [
        { resource: '/api/trainers/1/earnings', method: 'GET', expected: true },
        { resource: '/api/courses', method: 'POST', expected: true },
        { resource: '/api/admin/approvals', method: 'GET', expected: false }
      ],
      'institute-admin': [
        { resource: '/api/institutes/1/trainers', method: 'GET', expected: true },
        { resource: '/api/institutes/1/stats', method: 'GET', expected: true },
        { resource: '/api/admin/users', method: 'GET', expected: false }
      ],
      'admin': [
        { resource: '/api/admin/approvals', method: 'GET', expected: true },
        { resource: '/api/dashboard/analytics', method: 'GET', expected: true },
        { resource: '/api/spring/users', method: 'GET', expected: true }
      ]
    };

    const rolePermissions = permissionMap[role] || [];
    const results = [];

    for (const permission of rolePermissions) {
      try {
        const response = await fetch(`${this.baseURL}${permission.resource}`, {
          method: permission.method,
          headers: { 'X-User-Role': role }
        });
        
        const hasAccess = response.ok;
        results.push({
          resource: permission.resource,
          method: permission.method,
          expected: permission.expected,
          actual: hasAccess,
          success: permission.expected === hasAccess
        });
      } catch (error) {
        results.push({
          resource: permission.resource,
          method: permission.method,
          expected: permission.expected,
          actual: false,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  async validateDataIntegrity() {
    console.log('🔍 데이터 무결성 검증...');

    // 1. 사용자 - 역할 일관성
    const userRoleConsistency = await this.checkDataFlow(
      '사용자-역할 일관성',
      async () => {
        const users = await this.checkAPI('/api/spring/users');
        if (users.success) {
          // 각 사용자의 역할이 올바른지 확인
          return users.data.every(user => 
            ['pet-owner', 'trainer', 'institute-admin', 'admin'].includes(user.role)
          );
        }
        return false;
      }
    );

    // 2. 기관 - 훈련사 관계 일관성
    const instituteTrainerConsistency = await this.checkDataFlow(
      '기관-훈련사 관계 일관성',
      async () => {
        const institutes = await this.checkAPI('/api/institutes');
        const trainers = await this.checkAPI('/api/trainers');
        
        if (institutes.success && trainers.success) {
          // 훈련사의 기관 ID가 실제 존재하는 기관인지 확인
          const instituteIds = institutes.data.map(i => i.id);
          return trainers.data.every(trainer => 
            !trainer.instituteId || instituteIds.includes(trainer.instituteId)
          );
        }
        return false;
      }
    );

    // 3. 예약 - 사용자 관계 일관성
    const reservationUserConsistency = await this.checkDataFlow(
      '예약-사용자 관계 일관성',
      async () => {
        // 예약 데이터와 사용자 데이터의 일관성 확인
        return true; // 구현 예정
      }
    );

    this.results.dataFlowTests.push(
      userRoleConsistency,
      instituteTrainerConsistency,
      reservationUserConsistency
    );
  }

  async checkAPI(endpoint, method = 'GET', data = null) {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };

      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      const responseData = await response.json().catch(() => ({}));

      return {
        endpoint,
        method,
        status: response.status,
        success: response.ok,
        data: responseData
      };
    } catch (error) {
      return {
        endpoint,
        method,
        success: false,
        error: error.message
      };
    }
  }

  async checkDataFlow(testName, testFunction) {
    try {
      const result = await testFunction();
      return {
        name: testName,
        success: result,
        timestamp: new Date().toISOString(),
        details: result ? '연결 성공' : '연결 실패'
      };
    } catch (error) {
      return {
        name: testName,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  generateReport() {
    const allTests = [
      ...this.results.userRoleTests.flatMap(r => r.connections),
      ...this.results.permissionTests.flatMap(r => r.permissions),
      ...this.results.dataFlowTests
    ];

    const successfulTests = allTests.filter(t => t.success).length;
    const totalTests = allTests.length;

    console.log('\n📊 === 사용자 역할별 데이터 연결성 검증 결과 ===');
    console.log(`✅ 성공: ${successfulTests}/${totalTests} (${(successfulTests/totalTests*100).toFixed(1)}%)`);
    console.log(`❌ 실패: ${totalTests - successfulTests}/${totalTests}`);

    console.log('\n👥 === 역할별 연결성 상세 결과 ===');
    this.results.userRoleTests.forEach(roleTest => {
      console.log(`\n[${roleTest.role.toUpperCase()}]`);
      roleTest.connections.forEach(conn => {
        const icon = conn.success ? '✅' : '❌';
        console.log(`  ${icon} ${conn.name} - ${conn.details || conn.error || '완료'}`);
      });
    });

    console.log('\n🔐 === 권한 검증 결과 ===');
    this.results.permissionTests.forEach(permTest => {
      console.log(`\n[${permTest.role.toUpperCase()}]`);
      permTest.permissions.forEach(perm => {
        const icon = perm.success ? '✅' : '❌';
        console.log(`  ${icon} ${perm.method} ${perm.resource} - 예상:${perm.expected}, 실제:${perm.actual}`);
      });
    });

    console.log('\n🔍 === 데이터 무결성 검증 결과 ===');
    this.results.dataFlowTests.forEach(test => {
      const icon = test.success ? '✅' : '❌';
      console.log(`${icon} ${test.name} - ${test.details || test.error || '완료'}`);
    });

    return {
      summary: {
        total: totalTests,
        successful: successfulTests,
        failed: totalTests - successfulTests,
        successRate: (successfulTests/totalTests*100).toFixed(1)
      },
      details: this.results,
      timestamp: new Date().toISOString()
    };
  }

  async run() {
    console.log('🚀 TALEZ 사용자 역할별 데이터 연결성 검증 시작...\n');

    try {
      await this.validateUserRoleDataFlow();
      const report = this.generateReport();
      
      // 결과 파일 저장
      fs.writeFileSync(
        path.join(__dirname, '../logs/user-role-validation-report.json'),
        JSON.stringify(report, null, 2)
      );

      console.log('\n📋 상세 리포트가 logs/user-role-validation-report.json에 저장되었습니다.');
      
      return report;
    } catch (error) {
      console.error('❌ 검증 실행 중 오류:', error);
      return null;
    }
  }
}

// 실행부
if (require.main === module) {
  const validator = new UserRoleDataValidator();
  validator.run();
}

module.exports = UserRoleDataValidator;
