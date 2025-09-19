
const fetch = require('node-fetch');
const chalk = require('chalk');

const BASE_URL = 'http://localhost:5000';

async function testSocialLoginEndpoints() {
  console.log(chalk.blue('🔍 소셜 로그인 엔드포인트 테스트 시작\n'));

  const endpoints = [
    { name: '카카오 로그인', path: '/api/auth/kakao' },
    { name: '네이버 로그인', path: '/api/auth/naver' },
    { name: '구글 로그인', path: '/api/auth/google' },
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(chalk.yellow(`테스트 중: ${endpoint.name}`));
      
      const response = await fetch(`${BASE_URL}${endpoint.path}`, {
        method: 'GET',
        redirect: 'manual'
      });

      if (response.status === 302) {
        console.log(chalk.green(`✓ ${endpoint.name}: 리다이렉션 정상 (${response.status})`));
        console.log(`  → Location: ${response.headers.get('location')}\n`);
      } else if (response.status === 404) {
        console.log(chalk.red(`✗ ${endpoint.name}: 엔드포인트 없음 (${response.status})\n`));
      } else {
        console.log(chalk.orange(`⚠ ${endpoint.name}: 예상과 다른 응답 (${response.status})\n`));
      }
    } catch (error) {
      console.log(chalk.red(`✗ ${endpoint.name}: 연결 실패 - ${error.message}\n`));
    }
  }

  // 콜백 URL 테스트
  console.log(chalk.blue('📍 콜백 URL 테스트\n'));
  
  const callbacks = [
    '/api/auth/kakao/callback',
    '/api/auth/naver/callback', 
    '/api/auth/google/callback'
  ];

  for (const callback of callbacks) {
    try {
      const response = await fetch(`${BASE_URL}${callback}`, {
        method: 'GET',
        redirect: 'manual'
      });
      
      console.log(chalk.cyan(`${callback}: ${response.status}`));
    } catch (error) {
      console.log(chalk.red(`${callback}: 연결 실패`));
    }
  }
}

if (require.main === module) {
  testSocialLoginEndpoints().catch(console.error);
}

module.exports = { testSocialLoginEndpoints };
