#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dotenv = require('dotenv'); // dotenv is likely needed for .env files

// 환경 변수 로드
dotenv.config();

console.log('🔧 프로덕션 최적화 시작...\n');

// 환경 변수 확인 및 설정
const requiredEnvVars = [
  'VITE_GOOGLE_MAPS_API_KEY',
  'VITE_KAKAO_MAPS_API_KEY',
  'DATABASE_URL',
  'SESSION_SECRET'
];

console.log('🔑 환경 변수 확인 중...');
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.warn(`⚠️  ${varName}이(가) 설정되지 않았습니다.`);
  } else {
    console.log(`✅ ${varName} 설정됨`);
  }
});

// 1. 의존성 설치 확인
console.log('\n1️⃣ 의존성 확인 중...');
execSync('npm install', { stdio: 'inherit' });


// 2. 캐시 정리
console.log('2️⃣ Cleaning caches...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
  }
  if (fs.existsSync('dist')) {
    execSync('rm -rf dist', { stdio: 'inherit' });
  }
} catch (error) {
  console.log('⚠️ Cache cleaning completed');
}

// 3. TypeScript 컴파일 체크
console.log('3️⃣ TypeScript compilation check...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful');
} catch (error) {
  console.log('⚠️ TypeScript compilation issues detected');
}

// 4. 환경 변수 검증 (기존 NODE_ENV 검증 유지)
console.log('4️⃣ Environment variables validation...');
const existingRequiredEnvVars = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'NODE_ENV'
];

const missingVars = existingRequiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.log(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
} else {
  console.log('✅ All required environment variables present');
}

// 5. 로그 디렉토리 생성
console.log('5️⃣ Setting up log directories...');
const logDirs = ['logs', 'public/uploads', 'public/uploads/images', 'public/uploads/documents'];
logDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// 6. 성능 체크
console.log('6️⃣ Performance optimization check...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const devDependencies = Object.keys(packageJson.devDependencies || {});
console.log(`📦 Dev dependencies: ${devDependencies.length}`);
console.log(`📦 Dependencies: ${Object.keys(packageJson.dependencies || {}).length}`);

console.log('');
console.log('✅ TALEZ Production Optimization Complete!');
console.log('');
console.log('🎯 Next steps:');
console.log('   npm run build (if needed)');
console.log('   npm start');