#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Building production version...');

// 1. TypeScript 컴파일
try {
  console.log('📦 Compiling TypeScript...');
  execSync('npx tsc --build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ TypeScript compilation failed');
  process.exit(1);
}

// 2. 필요한 디렉토리 생성
const requiredDirs = ['dist', 'logs'];
requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// 3. PM2 ecosystem 파일 업데이트
const ecosystemConfig = `module.exports = {
  apps: [
    {
      name: 'funnytalez-backend-prod',
      script: 'dist/server/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      merge_logs: true,
      kill_timeout: 5000,
      listen_timeout: 10000
    }
  ]
};`;

fs.writeFileSync('ecosystem.config.js', ecosystemConfig);
console.log('✅ Updated PM2 ecosystem configuration');

console.log('🎉 Production build completed!');
console.log('');
console.log('To deploy:');
console.log('1. pm2 delete all');
console.log('2. NODE_ENV=production pm2 start ecosystem.config.js');
console.log('3. pm2 save');