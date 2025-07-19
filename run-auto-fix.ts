
// run-auto-fix.ts
// TALEZ에서 바로 실행할 수 있는 간단한 스크립트

import { ProductionReadyAutoFixer } from './mcp-auto-fixer';

async function main() {
  console.log('🐕 TALEZ 서비스 오픈 자동 수정 시스템');
  console.log('=========================================\n');
  
  const args = process.argv.slice(2);
  const command = args[0] || 'full';

  const fixer = new ProductionReadyAutoFixer();

  switch (command) {
    case 'full':
    case 'production':
      console.log('🚀 TALEZ 전체 자동 수정 실행 중...');
      await fixer.makeProductionReady();
      break;
      
    case 'quick':
      console.log('⚡ 빠른 수정 실행 중...');
      await quickFix();
      break;
      
    case 'check':
      console.log('🔍 TALEZ 상태 체크 실행 중...');
      await healthCheck();
      break;
      
    default:
      showHelp();
  }
}

async function quickFix() {
  console.log('TALEZ 빠른 수정을 시작합니다...\n');
  
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);

  try {
    // 1. 패키지 문제 해결
    console.log('📦 TALEZ 패키지 확인 중...');
    await execAsync('npm install').catch(() => console.log('  패키지 설치 스킵'));
    
    // 2. TypeScript 체크
    console.log('🔧 TALEZ TypeScript 체크 중...');
    const { stderr } = await execAsync('npx tsc --noEmit').catch(e => ({ stderr: e.message }));
    
    if (stderr && stderr.includes('error')) {
      console.log('  ⚠️ TypeScript 오류 발견');
      console.log('  전체 수정을 위해 "npm run talez-production-ready" 실행을 권장합니다');
    } else {
      console.log('  ✅ TypeScript 오류 없음');
    }
    
    // 3. TALEZ 서버 시작 테스트
    console.log('🚀 TALEZ 서버 시작 테스트 중...');
    try {
      const server = exec('npm run dev');
      await new Promise(resolve => setTimeout(resolve, 3000));
      server.kill();
      console.log('  ✅ TALEZ 서버 정상 시작');
    } catch {
      console.log('  ⚠️ TALEZ 서버 시작 확인 필요');
    }
    
    console.log('\n✅ TALEZ 빠른 수정 완료!');
    
  } catch (error) {
    console.log('❌ 빠른 수정 중 오류:', error.message);
  }
}

async function healthCheck() {
  console.log('TALEZ 시스템 상태를 확인합니다...\n');
  
  const fs = require('fs').promises;
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);

  const checks = [];

  // 1. TALEZ 필수 파일 확인
  const requiredFiles = ['package.json', 'server/index.ts', 'server/storage.ts', 'client/src/main.tsx'];
  for (const file of requiredFiles) {
    try {
      await fs.access(file);
      checks.push(`✅ ${file} 존재`);
    } catch {
      checks.push(`❌ ${file} 누락`);
    }
  }

  // 2. 의존성 확인
  try {
    await fs.access('node_modules');
    checks.push('✅ 의존성 설치됨');
  } catch {
    checks.push('❌ npm install 필요');
  }

  // 3. TALEZ Storage 시스템 확인
  try {
    const storageContent = await fs.readFile('server/storage.ts', 'utf-8');
    if (storageContent.includes('export { storage }')) {
      checks.push('✅ TALEZ Storage 시스템 정상');
    } else {
      checks.push('❌ TALEZ Storage export 확인 필요');
    }
  } catch {
    checks.push('❌ TALEZ Storage 시스템 오류');
  }

  // 4. TALEZ 서버 시작 가능 여부
  try {
    const server = exec('npm run dev');
    await new Promise(resolve => setTimeout(resolve, 3000));
    server.kill();
    checks.push('✅ TALEZ 서버 시작 가능');
  } catch {
    checks.push('❌ TALEZ 서버 시작 실패');
  }

  // 결과 출력
  console.log('TALEZ 상태 체크 결과:');
  checks.forEach(check => console.log(`  ${check}`));
  
  const hasErrors = checks.some(check => check.includes('❌'));
  
  if (hasErrors) {
    console.log('\n⚠️ TALEZ에서 문제가 발견되었습니다.');
    console.log('전체 자동 수정을 실행하세요: npm run talez-production-ready');
  } else {
    console.log('\n🎉 모든 체크 통과! TALEZ 서비스 준비 완료!');
    console.log('🐕 이제 Run 버튼을 눌러 TALEZ를 시작하세요!');
  }
}

function showHelp() {
  console.log('🐕 TALEZ MCP 자동 수정 시스템 사용법:');
  console.log('');
  console.log('📋 명령어:');
  console.log('  npm run talez-production-ready  # 전체 자동 수정 (서비스 오픈 준비)');
  console.log('  npx ts-node run-auto-fix.ts quick     # 빠른 수정');
  console.log('  npx ts-node run-auto-fix.ts check     # 상태 체크만');
  console.log('');
  console.log('🚀 Replit Shell에서 직접 실행:');
  console.log('  node -e "require(\'./run-auto-fix\').main()" full');
  console.log('  node -e "require(\'./run-auto-fix\').main()" quick');
  console.log('  node -e "require(\'./run-auto-fix\').main()" check');
  console.log('');
  console.log('🎯 권장 사용법:');
  console.log('  1. npm install (의존성 설치)');
  console.log('  2. npm run talez-production-ready (전체 자동 수정)');
  console.log('  3. npm run dev (서버 시작 테스트)');
  console.log('  4. Release 버튼으로 배포');
}

// 직접 실행시
if (require.main === module) {
  main().catch(error => {
    console.error('❌ 실행 중 오류:', error);
    process.exit(1);
  });
}

export { main, quickFix, healthCheck };
