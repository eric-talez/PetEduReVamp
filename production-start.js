#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting production server...\n');

// 필수 환경 변수 확인
const requiredVars = ['DATABASE_URL', 'SESSION_SECRET'];
const missingVars = requiredVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('Please set them in Replit Secrets');
  process.exit(1);
}

// Google Maps API Key 확인 (경고만)
if (!process.env.VITE_GOOGLE_MAPS_API_KEY) {
  console.warn('⚠️  VITE_GOOGLE_MAPS_API_KEY is not set - Google Maps may not work');
}

// 환경 변수 설정
const env = {
  ...process.env,
  NODE_ENV: 'production',
  PORT: process.env.PORT || '5000',
  HOST: process.env.HOST || '0.0.0.0'
};

console.log('✅ Environment variables validated\n');

// tsx로 TypeScript 파일 직접 실행
const server = spawn('npx', ['tsx', 'server/index.ts'], {
  env,
  stdio: 'inherit',
  shell: true
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Process termination handling
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});