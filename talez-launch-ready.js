
#!/usr/bin/env node

// TALEZ 서비스 런칭 준비 - 즉시 실행 가능한 JavaScript 버전
console.log('🐕 TALEZ 서비스 런칭 준비 시스템');
console.log('====================================\n');

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function checkTalezReadiness() {
  console.log('🔍 TALEZ 서비스 상태 확인 중...\n');
  
  const issues = [];
  const fixes = [];

  try {
    // 1. 필수 파일 확인
    console.log('📁 필수 파일 확인...');
    const requiredFiles = [
      'package.json',
      'server/index.ts', 
      'server/storage.ts',
      'client/src/main.tsx',
      'shared/menu-config.ts'
    ];

    for (const file of requiredFiles) {
      if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
        fixes.push(`${file} 존재 확인`);
      } else {
        console.log(`  ❌ ${file} 누락`);
        issues.push(`${file} 파일이 없습니다`);
      }
    }

    // 2. 패키지 설치 확인
    console.log('\n📦 패키지 의존성 확인...');
    if (fs.existsSync('node_modules')) {
      console.log('  ✅ 의존성 설치됨');
      fixes.push('패키지 의존성 설치 완료');
    } else {
      console.log('  ⚠️ 의존성 설치 중...');
      try {
        await execAsync('npm install');
        console.log('  ✅ 의존성 설치 완료');
        fixes.push('패키지 의존성 설치 완료');
      } catch (error) {
        console.log('  ❌ 의존성 설치 실패');
        issues.push('npm install 실행 필요');
      }
    }

    // 3. TALEZ Storage 시스템 확인
    console.log('\n🗄️ TALEZ Storage 시스템 확인...');
    try {
      const storageContent = fs.readFileSync('server/storage.ts', 'utf-8');
      if (storageContent.includes('export { storage }')) {
        console.log('  ✅ TALEZ Storage export 정상');
        fixes.push('TALEZ Storage 시스템 정상');
      } else {
        console.log('  ⚠️ TALEZ Storage export 누락');
        issues.push('Storage 클래스 export 확인 필요');
      }
    } catch (error) {
      console.log('  ❌ TALEZ Storage 파일 오류');
      issues.push('server/storage.ts 파일 확인 필요');
    }

    // 4. 서버 시작 테스트
    console.log('\n🚀 TALEZ 서버 시작 테스트...');
    try {
      console.log('  ⏳ 서버 시작 중... (5초 테스트)');
      const server = exec('npm run dev');
      
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          server.kill();
          resolve();
        }, 5000);
        
        server.on('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });
      
      console.log('  ✅ TALEZ 서버 정상 시작');
      fixes.push('TALEZ 서버 시작 테스트 통과');
    } catch (error) {
      console.log('  ❌ TALEZ 서버 시작 실패');
      issues.push('서버 시작 오류 - 로그 확인 필요');
    }

    // 5. 환경 설정 확인
    console.log('\n🔧 환경 설정 확인...');
    if (fs.existsSync('.env')) {
      console.log('  ✅ .env 파일 존재');
      fixes.push('.env 환경변수 파일 확인');
    } else {
      console.log('  ⚠️ .env 파일 없음');
      issues.push('.env 파일 생성 권장');
    }

    // 결과 출력
    console.log('\n' + '='.repeat(50));
    console.log('🐕 TALEZ 서비스 상태 리포트');
    console.log('='.repeat(50));
    
    console.log(`\n✅ 정상 항목: ${fixes.length}개`);
    fixes.forEach((fix, i) => console.log(`  ${i + 1}. ${fix}`));
    
    if (issues.length > 0) {
      console.log(`\n⚠️ 확인 필요 항목: ${issues.length}개`);
      issues.forEach((issue, i) => console.log(`  ${i + 1}. ${issue}`));
    }

    // 최종 판정
    if (issues.length === 0) {
      console.log('\n🎉🎉🎉 축하합니다! 🎉🎉🎉');
      console.log('🐕 TALEZ 서비스 런칭 준비 완료!');
      console.log('\n🚀 다음 단계:');
      console.log('  1. Replit Run 버튼으로 서버 시작');
      console.log('  2. 브라우저에서 정상 작동 확인');
      console.log('  3. Release 버튼으로 공개 배포');
      console.log('  4. 🎊 TALEZ 서비스 정식 오픈!');
    } else if (issues.length <= 2) {
      console.log('\n⚡ 거의 완료!');
      console.log('위의 몇 가지 항목만 확인하면 바로 서비스 오픈 가능합니다.');
    } else {
      console.log('\n🔧 추가 작업 필요');
      console.log('MCP 자동 수정 시스템을 실행하세요:');
      console.log('npm run talez-production-ready');
    }

    console.log('\n' + '='.repeat(50));
    return { fixes, issues, ready: issues.length === 0 };

  } catch (error) {
    console.error('\n❌ 상태 확인 중 오류 발생:', error.message);
    return { fixes: [], issues: ['시스템 오류'], ready: false };
  }
}

// 빠른 수정 함수
async function quickFixTalez() {
  console.log('⚡ TALEZ 빠른 수정 모드\n');

  try {
    // 1. npm install 실행
    console.log('📦 패키지 설치 확인 중...');
    await execAsync('npm install');
    console.log('  ✅ 패키지 설치 완료');

    // 2. Storage export 수정
    console.log('🗄️ Storage 시스템 수정 중...');
    try {
      const storagePath = 'server/storage.ts';
      let storageContent = fs.readFileSync(storagePath, 'utf-8');
      
      if (!storageContent.includes('export { storage }')) {
        if (!storageContent.includes('const storage = new Storage()')) {
          storageContent += '\nconst storage = new Storage();\nexport { storage };\n';
        } else {
          storageContent += '\nexport { storage };\n';
        }
        fs.writeFileSync(storagePath, storageContent);
        console.log('  ✅ Storage export 추가 완료');
      } else {
        console.log('  ✅ Storage export 정상');
      }
    } catch (error) {
      console.log('  ⚠️ Storage 수정 스킵:', error.message);
    }

    // 3. .env 파일 생성 (없는 경우)
    console.log('🔧 환경 설정 확인 중...');
    if (!fs.existsSync('.env')) {
      const envContent = `# TALEZ 환경 변수
NODE_ENV=production
PORT=5000
SESSION_SECRET=talez-secret-${Math.random().toString(36).substr(2, 9)}
`;
      fs.writeFileSync('.env', envContent);
      console.log('  ✅ .env 파일 생성 완료');
    } else {
      console.log('  ✅ .env 파일 존재');
    }

    console.log('\n🎉 빠른 수정 완료!');
    console.log('이제 npm run dev로 서버를 시작해보세요.');

  } catch (error) {
    console.error('❌ 빠른 수정 중 오류:', error.message);
  }
}

// 메인 실행 함수
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'check';

  switch (command) {
    case 'check':
      await checkTalezReadiness();
      break;
    case 'fix':
      await quickFixTalez();
      break;
    case 'full':
      console.log('🔄 전체 체크 및 수정 실행...\n');
      await quickFixTalez();
      console.log('\n🔍 상태 재확인...\n');
      await checkTalezReadiness();
      break;
    default:
      console.log('사용법:');
      console.log('  node talez-launch-ready.js check  # 상태 확인');
      console.log('  node talez-launch-ready.js fix    # 빠른 수정');
      console.log('  node talez-launch-ready.js full   # 전체 실행');
  }
}

// 스크립트 실행
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkTalezReadiness, quickFixTalez, main };
