
#!/usr/bin/env node

const fs = require('fs');

console.log('👥 커뮤니티 기능 완성도 체크');
console.log('='.repeat(50));

async function checkCommunityFeatures() {
  const results = {
    postManagement: [],
    userInteraction: [],
    socialFeatures: [],
    moderationFeatures: [],
    completionRate: 0
  };

  // 1. 게시글 관리 기능 체크
  console.log('\n📝 게시글 관리 기능 체크:');
  const postAPIs = [
    { endpoint: '/api/community/posts', method: 'GET', description: '게시글 목록 조회' },
    { endpoint: '/api/community/posts', method: 'POST', description: '게시글 작성' },
    { endpoint: '/api/community/posts/:id', method: 'GET', description: '게시글 상세 조회' },
    { endpoint: '/api/community/posts/:id', method: 'PUT', description: '게시글 수정' },
    { endpoint: '/api/community/posts/:id', method: 'DELETE', description: '게시글 삭제' }
  ];

  for (const api of postAPIs) {
    try {
      const response = await checkAPI(`http://localhost:5000${api.endpoint.replace(':id', '1')}`, api.method);
      const status = response ? '✅' : '❌';
      console.log(`  ${status} ${api.method} ${api.endpoint} - ${api.description}`);
      results.postManagement.push({ ...api, status: response ? 'OK' : 'FAIL' });
    } catch (error) {
      console.log(`  ❌ ${api.method} ${api.endpoint} - ${api.description} (Error: ${error.message})`);
      results.postManagement.push({ ...api, status: 'ERROR', error: error.message });
    }
  }

  // 2. 사용자 상호작용 기능 체크
  console.log('\n👍 사용자 상호작용 기능 체크:');
  const interactionAPIs = [
    { endpoint: '/api/community/posts/:id/like', method: 'POST', description: '게시글 좋아요' },
    { endpoint: '/api/community/posts/:id/comments', method: 'GET', description: '댓글 목록 조회' },
    { endpoint: '/api/community/posts/:id/comments', method: 'POST', description: '댓글 작성' },
    { endpoint: '/api/community/posts/:id/share', method: 'POST', description: '게시글 공유' },
    { endpoint: '/api/community/posts/:id/bookmark', method: 'POST', description: '북마크 추가' }
  ];

  for (const api of interactionAPIs) {
    try {
      const response = await checkAPI(`http://localhost:5000${api.endpoint.replace(':id', '1')}`, api.method);
      const status = response ? '✅' : '❌';
      console.log(`  ${status} ${api.method} ${api.endpoint} - ${api.description}`);
      results.userInteraction.push({ ...api, status: response ? 'OK' : 'FAIL' });
    } catch (error) {
      console.log(`  ❌ ${api.method} ${api.endpoint} - ${api.description} (Error: ${error.message})`);
      results.userInteraction.push({ ...api, status: 'ERROR', error: error.message });
    }
  }

  // 3. 소셜 기능 체크
  console.log('\n🌐 소셜 기능 체크:');
  const socialAPIs = [
    { endpoint: '/api/community/users/:id/follow', method: 'POST', description: '사용자 팔로우' },
    { endpoint: '/api/community/users/:id/followers', method: 'GET', description: '팔로워 목록' },
    { endpoint: '/api/community/users/:id/following', method: 'GET', description: '팔로잉 목록' },
    { endpoint: '/api/community/feed', method: 'GET', description: '개인화된 피드' },
    { endpoint: '/api/community/trending', method: 'GET', description: '인기 게시글' }
  ];

  for (const api of socialAPIs) {
    try {
      const response = await checkAPI(`http://localhost:5000${api.endpoint.replace(':id', '1')}`, api.method);
      const status = response ? '✅' : '❌';
      console.log(`  ${status} ${api.method} ${api.endpoint} - ${api.description}`);
      results.socialFeatures.push({ ...api, status: response ? 'OK' : 'FAIL' });
    } catch (error) {
      console.log(`  ❌ ${api.method} ${api.endpoint} - ${api.description} (Error: ${error.message})`);
      results.socialFeatures.push({ ...api, status: 'ERROR', error: error.message });
    }
  }

  // 4. 관리 기능 체크
  console.log('\n🛡️  관리 기능 체크:');
  const moderationAPIs = [
    { endpoint: '/api/community/posts/:id/report', method: 'POST', description: '게시글 신고' },
    { endpoint: '/api/community/posts/:id/moderate', method: 'POST', description: '게시글 관리' },
    { endpoint: '/api/community/users/:id/ban', method: 'POST', description: '사용자 제재' },
    { endpoint: '/api/community/reports', method: 'GET', description: '신고 목록 조회' }
  ];

  for (const api of moderationAPIs) {
    try {
      const response = await checkAPI(`http://localhost:5000${api.endpoint.replace(':id', '1')}`, api.method);
      const status = response ? '✅' : '❌';
      console.log(`  ${status} ${api.method} ${api.endpoint} - ${api.description}`);
      results.moderationFeatures.push({ ...api, status: response ? 'OK' : 'FAIL' });
    } catch (error) {
      console.log(`  ❌ ${api.method} ${api.endpoint} - ${api.description} (Error: ${error.message})`);
      results.moderationFeatures.push({ ...api, status: 'ERROR', error: error.message });
    }
  }

  // 5. 프론트엔드 컴포넌트 체크
  console.log('\n🎨 프론트엔드 컴포넌트 체크:');
  const frontendComponents = [
    { path: 'client/src/pages/community/index.tsx', description: '커뮤니티 메인 페이지' },
    { path: 'client/src/pages/community/create.tsx', description: '게시글 작성 페이지' },
    { path: 'client/src/pages/community/post-detail.tsx', description: '게시글 상세 페이지' },
    { path: 'client/src/components/community/BoardTable.tsx', description: '게시판 테이블 컴포넌트' },
    { path: 'client/src/components/CommunityPostForm.tsx', description: '게시글 작성 폼' }
  ];

  frontendComponents.forEach(component => {
    if (fs.existsSync(component.path)) {
      console.log(`  ✅ ${component.description}`);
    } else {
      console.log(`  ❌ ${component.description} (파일 없음)`);
    }
  });

  // 완성도 계산
  const allFeatures = [...results.postManagement, ...results.userInteraction, ...results.socialFeatures, ...results.moderationFeatures];
  const successCount = allFeatures.filter(feature => feature.status === 'OK').length;
  results.completionRate = Math.round((successCount / allFeatures.length) * 100);

  console.log('\n📊 커뮤니티 기능 완성도 요약:');
  console.log(`  📝 게시글 관리: ${results.postManagement.filter(f => f.status === 'OK').length}/${results.postManagement.length}`);
  console.log(`  👍 사용자 상호작용: ${results.userInteraction.filter(f => f.status === 'OK').length}/${results.userInteraction.length}`);
  console.log(`  🌐 소셜 기능: ${results.socialFeatures.filter(f => f.status === 'OK').length}/${results.socialFeatures.length}`);
  console.log(`  🛡️  관리 기능: ${results.moderationFeatures.filter(f => f.status === 'OK').length}/${results.moderationFeatures.length}`);
  console.log(`  🎯 전체 완성도: ${results.completionRate}%`);

  if (results.completionRate < 50) {
    console.log('\n⚠️  개선 필요: 커뮤니티 기본 기능부터 구현하세요.');
  } else if (results.completionRate < 80) {
    console.log('\n🔧 거의 완성: 사용자 참여 기능을 추가하면 완료됩니다.');
  } else {
    console.log('\n🎉 완성도 우수: 커뮤니티 기능이 잘 구현되어 있습니다.');
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

checkCommunityFeatures().catch(console.error);
