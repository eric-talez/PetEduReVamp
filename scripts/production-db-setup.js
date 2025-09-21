
#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🗄️ 운영 데이터베이스 설정 시작...');

try {
  // 데이터베이스 스키마 적용
  console.log('📋 스키마 적용 중...');
  execSync('npm run db:push', { stdio: 'inherit' });
  
  // 기본 데이터 삽입
  console.log('📊 기본 데이터 삽입 중...');
  execSync('npm run db:seed', { stdio: 'inherit' });
  
  console.log('✅ 운영 데이터베이스 설정 완료!');
} catch (error) {
  console.error('❌ 데이터베이스 설정 실패:', error.message);
  process.exit(1);
}
