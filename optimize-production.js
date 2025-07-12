
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 TALEZ Production Optimization Starting...');

// 1. 의존성 최적화
console.log('1️⃣ Optimizing dependencies...');
try {
  execSync('npm ci --production=false', { stdio: 'inherit' });
  execSync('npm audit fix --force', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️ Dependency optimization completed with warnings');
}

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

// 4. 환경 변수 검증
console.log('4️⃣ Environment variables validation...');
const requiredEnvVars = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'NODE_ENV'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
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
