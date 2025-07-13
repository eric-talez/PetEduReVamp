#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔧 빠른 빌드 검사 시작...');

try {
  // TypeScript 컴파일 체크
  const result = execSync('npm run check', { 
    encoding: 'utf8',
    timeout: 30000
  });
  
  console.log('✅ TypeScript 컴파일 성공');
  console.log('🚀 빌드 테스트 진행 중...');
  
  // 빌드 테스트 (30초 제한)
  const buildResult = execSync('timeout 30 npm run build', { 
    encoding: 'utf8',
    timeout: 35000
  });
  
  console.log('✅ 빌드 성공!');
  
} catch (error) {
  console.log('❌ 오류 발생:');
  console.log(error.stdout || error.message);
  
  // 오류 상세 정보 저장
  fs.writeFileSync('build-errors.log', error.stdout || error.message);
  console.log('📝 오류 정보가 build-errors.log에 저장됨');
}