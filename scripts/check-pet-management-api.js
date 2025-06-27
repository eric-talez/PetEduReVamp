
#!/usr/bin/env node

const fs = require('fs');

console.log('🐾 반려동물 관리 API 완성도 체크');
console.log('='.repeat(50));

async function checkPetManagementAPI() {
  const results = {
    coreAPIs: [],
    healthAPIs: [],
    trainingAPIs: [],
    completionRate: 0
  };

  // 1. 기본 반려동물 CRUD API 체크
  console.log('\n📋 기본 CRUD API 체크:');
  const coreAPIs = [
    { endpoint: '/api/pets', method: 'GET', description: '반려동물 목록 조회' },
    { endpoint: '/api/pets', method: 'POST', description: '반려동물 등록' },
    { endpoint: '/api/pets/:id', method: 'GET', description: '반려동물 상세 조회' },
    { endpoint: '/api/pets/:id', method: 'PUT', description: '반려동물 정보 수정' },
    { endpoint: '/api/pets/:id', method: 'DELETE', description: '반려동물 삭제' }
  ];

  for (const api of coreAPIs) {
    try {
      const response = await checkAPI(`http://localhost:5000${api.endpoint.replace(':id', '1')}`, api.method);
      const status = response ? '✅' : '❌';
      console.log(`  ${status} ${api.method} ${api.endpoint} - ${api.description}`);
      results.coreAPIs.push({ ...api, status: response ? 'OK' : 'FAIL' });
    } catch (error) {
      console.log(`  ❌ ${api.method} ${api.endpoint} - ${api.description} (Error: ${error.message})`);
      results.coreAPIs.push({ ...api, status: 'ERROR', error: error.message });
    }
  }

  // 2. 건강 관리 API 체크
  console.log('\n🏥 건강 관리 API 체크:');
  const healthAPIs = [
    { endpoint: '/api/pets/:id/health', method: 'GET', description: '건강 기록 조회' },
    { endpoint: '/api/pets/:id/vaccinations', method: 'GET', description: '예방접종 기록' },
    { endpoint: '/api/pets/:id/health-records', method: 'POST', description: '건강 기록 추가' },
    { endpoint: '/api/pets/:id/medications', method: 'GET', description: '약물 기록 조회' }
  ];

  for (const api of healthAPIs) {
    try {
      const response = await checkAPI(`http://localhost:5000${api.endpoint.replace(':id', '1')}`, api.method);
      const status = response ? '✅' : '❌';
      console.log(`  ${status} ${api.method} ${api.endpoint} - ${api.description}`);
      results.healthAPIs.push({ ...api, status: response ? 'OK' : 'FAIL' });
    } catch (error) {
      console.log(`  ❌ ${api.method} ${api.endpoint} - ${api.description} (Error: ${error.message})`);
      results.healthAPIs.push({ ...api, status: 'ERROR', error: error.message });
    }
  }

  // 3. 훈련 관리 API 체크
  console.log('\n📚 훈련 관리 API 체크:');
  const trainingAPIs = [
    { endpoint: '/api/pets/:id/training-sessions', method: 'GET', description: '훈련 세션 기록' },
    { endpoint: '/api/pets/:id/progress', method: 'GET', description: '훈련 진행도' },
    { endpoint: '/api/pets/:id/achievements', method: 'GET', description: '성취 기록' }
  ];

  for (const api of trainingAPIs) {
    try {
      const response = await checkAPI(`http://localhost:5000${api.endpoint.replace(':id', '1')}`, api.method);
      const status = response ? '✅' : '❌';
      console.log(`  ${status} ${api.method} ${api.endpoint} - ${api.description}`);
      results.trainingAPIs.push({ ...api, status: response ? 'OK' : 'FAIL' });
    } catch (error) {
      console.log(`  ❌ ${api.method} ${api.endpoint} - ${api.description} (Error: ${error.message})`);
      results.trainingAPIs.push({ ...api, status: 'ERROR', error: error.message });
    }
  }

  // 완성도 계산
  const totalAPIs = results.coreAPIs.length + results.healthAPIs.length + results.trainingAPIs.length;
  const successAPIs = [...results.coreAPIs, ...results.healthAPIs, ...results.trainingAPIs]
    .filter(api => api.status === 'OK').length;
  
  results.completionRate = Math.round((successAPIs / totalAPIs) * 100);

  console.log('\n📊 반려동물 관리 API 완성도 요약:');
  console.log(`  📋 기본 CRUD: ${results.coreAPIs.filter(a => a.status === 'OK').length}/${results.coreAPIs.length}`);
  console.log(`  🏥 건강 관리: ${results.healthAPIs.filter(a => a.status === 'OK').length}/${results.healthAPIs.length}`);
  console.log(`  📚 훈련 관리: ${results.trainingAPIs.filter(a => a.status === 'OK').length}/${results.trainingAPIs.length}`);
  console.log(`  🎯 전체 완성도: ${results.completionRate}%`);

  if (results.completionRate < 70) {
    console.log('\n⚠️  개선 필요: 반려동물 관리 API 완성도가 70% 미만입니다.');
  } else if (results.completionRate < 90) {
    console.log('\n🔧 거의 완성: 몇 가지 API만 추가하면 완료됩니다.');
  } else {
    console.log('\n🎉 완성도 우수: 반려동물 관리 API가 잘 구현되어 있습니다.');
  }

  return results;
}

async function checkAPI(url, method = 'GET') {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url, { method });
    return response.status < 500;
  } catch (error) {
    return false;
  }
}

checkPetManagementAPI().catch(console.error);
