
// run-complete-test.ts - Replit에서 바로 실행
import { runCompleteServiceTest } from './complete-service-tester';

async function main() {
  console.log('🎯 완전한 서비스 테스트를 시작합니다!');
  console.log('잠시 기다리시면 모든 것을 자동으로 검사하고 수정합니다.\n');

  try {
    const result = await runCompleteServiceTest();
    
    console.log('\n' + '='.repeat(60));
    if (result.launchReady) {
      console.log('🎊 축하합니다! 서비스 런칭 준비 완료! 🎊');
      console.log(`📊 최종 점수: ${result.overallScore}/100`);
      console.log('🚀 지금 바로 서비스를 오픈하셔도 됩니다!');
    } else {
      console.log('🔧 조금만 더 노력하면 됩니다!');
      console.log(`📊 현재 점수: ${result.overallScore}/100`);
      console.log('💪 몇 가지만 개선하면 완벽해집니다!');
    }
    console.log('='.repeat(60));

    console.log('\n📋 상세 보고서를 확인하세요:');
    console.log('🌐 complete-service-report.html을 브라우저로 열어보세요!');

  } catch (error) {
    console.error('❌ 테스트 실행 중 오류:', error.message);
    console.log('\n💡 해결 방법:');
    console.log('1. "npm install" 실행해서 패키지 재설치');
    console.log('2. "npm start"로 서버가 실행 중인지 확인');
    console.log('3. 다시 "npm run complete-test" 실행');
  }
}

main();
