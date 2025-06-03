
#!/usr/bin/env node

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000';

// API 엔드포인트 목록
const API_ENDPOINTS = [
  { name: '인증 상태 확인', url: '/api/auth/me', method: 'GET' },
  { name: '사용자 목록', url: '/api/spring/users', method: 'GET' },
  { name: '강좌 목록', url: '/api/courses', method: 'GET' },
  { name: '이벤트 목록', url: '/api/events', method: 'GET' },
  { name: '반려동물 목록', url: '/api/spring/pets', method: 'GET' },
  { name: '헬스체크', url: '/actuator/health', method: 'GET' },
  { name: '훈련사 목록', url: '/api/trainers', method: 'GET' },
  { name: '쇼핑 상품', url: '/api/shopping/products', method: 'GET' }
];

async function checkEndpoint(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint.url}`, {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const status = response.status;
    const statusText = response.statusText;
    
    let result = {
      name: endpoint.name,
      url: endpoint.url,
      status: status,
      statusText: statusText,
      success: status >= 200 && status < 400
    };

    if (response.headers.get('content-type')?.includes('application/json')) {
      try {
        const data = await response.json();
        result.hasData = Array.isArray(data) ? data.length > 0 : !!data;
        result.dataCount = Array.isArray(data) ? data.length : (data ? 1 : 0);
      } catch (e) {
        result.jsonError = e.message;
      }
    }

    return result;
  } catch (error) {
    return {
      name: endpoint.name,
      url: endpoint.url,
      error: error.message,
      success: false
    };
  }
}

async function checkDatabase() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/spring/users`);
    const users = await response.json();
    
    return {
      connected: response.ok,
      userCount: Array.isArray(users) ? users.length : 0,
      sampleData: users?.slice(0, 2) || []
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
}

async function checkImageUploads() {
  const uploadsPath = './public/uploads';
  const fs = require('fs');
  
  try {
    if (fs.existsSync(uploadsPath)) {
      const files = fs.readdirSync(uploadsPath);
      return {
        uploadsFolder: true,
        fileCount: files.length,
        files: files.slice(0, 5)
      };
    } else {
      return {
        uploadsFolder: false,
        error: 'uploads 폴더가 존재하지 않습니다'
      };
    }
  } catch (error) {
    return {
      uploadsFolder: false,
      error: error.message
    };
  }
}

async function main() {
  console.log('🔍 TALEZ 서비스 API 연동 상태 체크');
  console.log('=====================================\n');

  console.log('📡 API 엔드포인트 상태:');
  console.log('-------------------------');
  
  for (const endpoint of API_ENDPOINTS) {
    const result = await checkEndpoint(endpoint);
    
    const statusIcon = result.success ? '✅' : '❌';
    const dataInfo = result.hasData !== undefined ? 
      ` (데이터: ${result.dataCount}개)` : '';
    
    console.log(`${statusIcon} ${result.name}: ${result.status || 'ERROR'}${dataInfo}`);
    
    if (result.error) {
      console.log(`   오류: ${result.error}`);
    }
    if (result.jsonError) {
      console.log(`   JSON 파싱 오류: ${result.jsonError}`);
    }
  }

  console.log('\n💾 데이터베이스 상태:');
  console.log('-------------------');
  const dbStatus = await checkDatabase();
  
  if (dbStatus.connected) {
    console.log('✅ 데이터베이스 연결: 정상');
    console.log(`📊 사용자 수: ${dbStatus.userCount}명`);
    if (dbStatus.sampleData.length > 0) {
      console.log('👤 샘플 사용자:');
      dbStatus.sampleData.forEach(user => {
        console.log(`   - ${user.name} (${user.username}) - ${user.role}`);
      });
    }
  } else {
    console.log('❌ 데이터베이스 연결: 실패');
    console.log(`   오류: ${dbStatus.error}`);
  }

  console.log('\n🖼️ 이미지 업로드 상태:');
  console.log('--------------------');
  const imageStatus = await checkImageUploads();
  
  if (imageStatus.uploadsFolder) {
    console.log('✅ 업로드 폴더: 존재');
    console.log(`📁 업로드된 파일: ${imageStatus.fileCount}개`);
    if (imageStatus.files.length > 0) {
      console.log('📄 최근 파일:');
      imageStatus.files.forEach(file => {
        console.log(`   - ${file}`);
      });
    }
  } else {
    console.log('❌ 업로드 폴더: 없음');
    console.log(`   오류: ${imageStatus.error}`);
  }

  console.log('\n🔧 권장 조치사항:');
  console.log('----------------');
  
  const failedEndpoints = API_ENDPOINTS.filter(async (endpoint) => {
    const result = await checkEndpoint(endpoint);
    return !result.success;
  });

  if (failedEndpoints.length > 0) {
    console.log('⚠️  실패한 API 엔드포인트가 있습니다.');
    console.log('   - 서버가 정상적으로 실행되고 있는지 확인하세요.');
    console.log('   - 라우트 설정을 점검하세요.');
  }

  if (!dbStatus.connected) {
    console.log('⚠️  데이터베이스 연결이 실패했습니다.');
    console.log('   - 환경 변수 DATABASE_URL을 확인하세요.');
    console.log('   - 데이터베이스 서버 상태를 점검하세요.');
  }

  if (!imageStatus.uploadsFolder) {
    console.log('⚠️  이미지 업로드 폴더가 없습니다.');
    console.log('   - mkdir -p public/uploads 명령으로 생성하세요.');
  }

  console.log('\n체크 완료! 🎉');
}

main().catch(console.error);
