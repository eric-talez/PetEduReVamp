
const http = require('http');

console.log('🚀 TALEZ API 기능 테스트 시작\n');

const baseUrl = 'http://localhost:5000';

const testCases = [
  {
    name: '인기 통계 조회',
    method: 'GET',
    path: '/api/popular-stats',
    expectedStatus: 200
  },
  {
    name: '배너 조회',
    method: 'GET', 
    path: '/api/banners',
    expectedStatus: 200
  },
  {
    name: '훈련사 목록 조회',
    method: 'GET',
    path: '/api/trainers',
    expectedStatus: 200
  },
  {
    name: '강좌 목록 조회',
    method: 'GET',
    path: '/api/courses',
    expectedStatus: 200
  },
  {
    name: '알림장 목록 조회',
    method: 'GET',
    path: '/api/notebook/entries',
    expectedStatus: 200
  },
  {
    name: '상담 신청',
    method: 'POST',
    path: '/api/consultation/request',
    body: {
      trainerId: 1,
      message: '테스트 상담 신청입니다.'
    },
    expectedStatus: 200
  },
  {
    name: '알림장 작성',
    method: 'POST',
    path: '/api/notebook/entries',
    body: {
      title: '테스트 알림장',
      content: '테스트 내용입니다.',
      petName: '멍멍이'
    },
    expectedStatus: 200
  },
  {
    name: '강좌 수강신청',
    method: 'POST',
    path: '/api/courses/enroll',
    body: {
      courseId: 1
    },
    expectedStatus: 200
  }
];

async function runTests() {
  console.log(`📍 테스트 대상: ${baseUrl}\n`);
  
  for (let i = 0; i < testCases.length; i++) {
    const test = testCases[i];
    console.log(`${i + 1}. ${test.name} 테스트 중...`);
    
    try {
      const result = await makeRequest(test);
      const status = result.statusCode === test.expectedStatus ? '✅ 성공' : '❌ 실패';
      console.log(`   ${status} - HTTP ${result.statusCode}`);
      
      if (result.data) {
        console.log(`   📄 응답: ${JSON.stringify(result.data).substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`   ❌ 오류: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('🏁 테스트 완료!');
}

function makeRequest(testCase) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: testCase.path,
      method: testCase.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = data ? JSON.parse(data) : null;
          resolve({
            statusCode: res.statusCode,
            data: parsedData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (testCase.body) {
      req.write(JSON.stringify(testCase.body));
    }

    req.end();
  });
}

// 서버가 실행 중인지 확인
console.log('🔍 서버 상태 확인 중...\n');

makeRequest({ method: 'GET', path: '/api/popular-stats', expectedStatus: 200 })
  .then(() => {
    console.log('✅ 서버가 정상적으로 실행 중입니다.\n');
    runTests();
  })
  .catch(() => {
    console.log('❌ 서버가 실행되지 않았습니다.');
    console.log('💡 먼저 "npm run dev" 명령으로 서버를 시작해주세요.\n');
  });
