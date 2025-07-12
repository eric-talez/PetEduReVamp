#!/usr/bin/env node

// 🚀 TALEZ 즉시 서비스 오픈 API 테스트
// 날짜: 2025-07-12

import http from 'http';

const testEndpoints = [
  { name: "대시보드 통계", url: "/api/dashboard/stats" },
  { name: "강좌 목록", url: "/api/courses" },
  { name: "훈련사 목록", url: "/api/trainers" },
  { name: "사용자 통계", url: "/api/users/stats" },
  { name: "홈페이지", url: "/" }
];

function testAPI(endpoint) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: endpoint.url,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const status = res.statusCode === 200 ? '✅' : '❌';
        console.log(`${status} ${endpoint.name}: ${res.statusCode}`);
        if (res.statusCode !== 200 && data) {
          console.log(`   응답: ${data.substring(0, 100)}...`);
        }
        resolve({ name: endpoint.name, status: res.statusCode });
      });
    });

    req.on('error', (err) => {
      console.log(`❌ ${endpoint.name}: 연결 실패 - ${err.message}`);
      resolve({ name: endpoint.name, status: 'ERROR' });
    });

    req.on('timeout', () => {
      console.log(`⏰ ${endpoint.name}: 응답 시간 초과`);
      req.destroy();
      resolve({ name: endpoint.name, status: 'TIMEOUT' });
    });

    req.end();
  });
}

async function runTests() {
  console.log('🚀 TALEZ 서비스 오픈 API 테스트 시작...\n');
  
  const results = [];
  for (const endpoint of testEndpoints) {
    const result = await testAPI(endpoint);
    results.push(result);
  }

  console.log('\n📊 테스트 결과 요약:');
  const passed = results.filter(r => r.status === 200).length;
  const total = results.length;
  
  console.log(`✅ 성공: ${passed}/${total}`);
  console.log(`❌ 실패: ${total - passed}/${total}`);

  if (passed === total) {
    console.log('\n🎉 모든 API 테스트 통과! 서비스 오픈 준비 완료!');
  } else {
    console.log('\n⚠️  일부 API에 문제가 있습니다. 수정이 필요합니다.');
  }

  return passed === total;
}

// 스크립트가 직접 실행된 경우
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runTests, testAPI };