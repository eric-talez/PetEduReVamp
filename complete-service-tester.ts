
// complete-service-tester.ts
// 개발자 관점 + 사용자 관점 완전 통합 테스트

import { ProductionReadyAutoFixer } from './mcp-auto-fixer';
import { UserExperienceTester } from './user-experience-tester';
import fs from 'fs/promises';

interface CompleteTestResult {
  developmentReady: any;
  userExperience: any;
  finalRecommendation: string;
  launchReady: boolean;
  overallScore: number;
}

export class CompleteServiceTester {
  private localUrl: string;
  private productionUrl: string;

  constructor(localUrl: string = 'http://localhost:5000', productionUrl?: string) {
    this.localUrl = localUrl;
    this.productionUrl = productionUrl || localUrl;
  }

  // 🚀 완전한 서비스 런칭 준비 테스트
  async runCompleteServiceTest(): Promise<CompleteTestResult> {
    console.log('🎯 완전한 서비스 런칭 준비 테스트를 시작합니다!');
    console.log('개발자 관점과 실사용자 관점에서 모든 것을 테스트합니다.\n');

    const testSession = {
      startTime: new Date().toLocaleString('ko-KR'),
      developmentReady: null,
      userExperience: null,
      finalRecommendation: '',
      launchReady: false,
      overallScore: 0
    };

    try {
      // 1단계: 개발자 관점 - 코드 품질 및 기술적 준비
      console.log('🔧 1단계: 개발자 관점 테스트 (코드 품질, 보안, 성능)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const autoFixer = new ProductionReadyAutoFixer();
      testSession.developmentReady = await autoFixer.makeProductionReady();
      
      console.log('✅ 개발자 관점 테스트 완료\n');

      // 2단계: 실사용자 관점 - 사용자 경험 테스트
      console.log('👤 2단계: 실사용자 관점 테스트 (사용자 경험, 접근성, 사용성)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // 로컬 서버가 실행 중인지 먼저 확인
      const isServerRunning = await this.checkServerStatus();
      
      if (!isServerRunning) {
        console.log('⚠️ 로컬 서버가 실행되지 않고 있습니다. 서버를 시작합니다...');
        await this.startLocalServer();
        
        // 서버 시작 대기
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      const uxTester = new UserExperienceTester(this.localUrl);
      testSession.userExperience = await uxTester.runCompleteUserTest();
      
      console.log('✅ 실사용자 관점 테스트 완료\n');

      // 3단계: 종합 분석 및 최종 판정
      console.log('📊 3단계: 종합 분석 및 런칭 준비도 평가');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const finalAnalysis = this.analyzeFinalReadiness(testSession);
      
      testSession.finalRecommendation = finalAnalysis.recommendation;
      testSession.launchReady = finalAnalysis.ready;
      testSession.overallScore = finalAnalysis.score;

      // 4단계: 최종 보고서 생성
      await this.generateFinalReport(testSession);

      return testSession;

    } catch (error) {
      console.error('❌ 완전 테스트 실행 중 오류:', error);
      throw error;
    }
  }

  // 🔍 서버 상태 확인
  private async checkServerStatus(): Promise<boolean> {
    try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(this.localUrl + '/health');
      return response.ok;
    } catch {
      try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(this.localUrl);
        return response.ok;
      } catch {
        return false;
      }
    }
  }

  // 🚀 로컬 서버 시작
  private async startLocalServer(): Promise<void> {
    const { spawn } = require('child_process');
    
    try {
      console.log('  📡 서버 시작 중...');
      
      const server = spawn('npm', ['start'], {
        detached: true,
        stdio: 'ignore'
      });

      server.unref();
      
      console.log('  ✅ 서버 시작 요청 완료');
      
    } catch (error) {
      console.log('  ⚠️ 서버 자동 시작 실패. 수동으로 "npm start"를 실행해주세요.');
    }
  }

  // 📊 최종 런칭 준비도 분석
  private analyzeFinalReadiness(testSession: any): any {
    const devReady = testSession.developmentReady;
    const uxReady = testSession.userExperience;

    let overallScore = 0;
    let issues = [];
    let strengths = [];

    // 개발자 관점 점수 (50%)
    const devScore = devReady?.finalStatus === 'PRODUCTION_READY' ? 50 : 
                    devReady?.finalStatus === 'NEEDS_MANUAL_REVIEW' ? 30 : 10;
    
    // 사용자 경험 점수 (50%)
    const uxScore = (uxReady?.userExperienceScore || 0) * 0.5;

    overallScore = devScore + uxScore;

    // 문제점 분석
    if (devReady?.finalStatus !== 'PRODUCTION_READY') {
      issues.push('코드 품질 및 기술적 준비 미완료');
    }

    if (uxReady?.userExperienceScore < 70) {
      issues.push('사용자 경험 품질 미흡');
    }

    if (uxReady?.criticalIssues?.length > 0) {
      issues.push('치명적인 사용성 문제 존재');
    }

    // 강점 분석
    if (devReady?.finalStatus === 'PRODUCTION_READY') {
      strengths.push('코드 품질 및 보안 준비 완료');
    }

    if (uxReady?.userExperienceScore >= 80) {
      strengths.push('우수한 사용자 경험');
    }

    if (devReady?.totalFixes > 0) {
      strengths.push(`${devReady.totalFixes}개 이슈 자동 해결`);
    }

    // 최종 판정
    let recommendation = '';
    let ready = false;

    if (overallScore >= 80 && issues.length === 0) {
      recommendation = '🎉 완벽한 서비스 런칭 준비 완료! 자신있게 서비스를 오픈하세요!';
      ready = true;
    } else if (overallScore >= 60 && issues.length <= 2) {
      recommendation = '⚠️ 몇 가지 개선 후 런칭 권장. 주요 이슈를 해결하면 서비스 오픈 가능합니다.';
      ready = false;
    } else {
      recommendation = '🚨 서비스 런칭 전 필수 개선 필요. 심각한 문제들을 먼저 해결해야 합니다.';
      ready = false;
    }

    return {
      score: Math.round(overallScore),
      ready,
      recommendation,
      issues,
      strengths,
      details: {
        developmentScore: devScore,
        userExperienceScore: uxScore,
        totalIssues: issues.length,
        totalStrengths: strengths.length
      }
    };
  }

  // 📋 최종 통합 보고서 생성
  private async generateFinalReport(testSession: any) {
    const report = {
      title: '🚀 완전한 서비스 런칭 준비 보고서',
      timestamp: new Date().toLocaleString('ko-KR'),
      summary: {
        overallScore: testSession.overallScore,
        launchReady: testSession.launchReady,
        recommendation: testSession.finalRecommendation
      },
      developmentTest: {
        status: testSession.developmentReady?.finalStatus || 'UNKNOWN',
        totalFixes: testSession.developmentReady?.totalFixes || 0,
        criticalFixes: testSession.developmentReady?.criticalFixes?.length || 0
      },
      userExperienceTest: {
        score: testSession.userExperience?.userExperienceScore || 0,
        passedTests: testSession.userExperience?.passedTests || 0,
        failedTests: testSession.userExperience?.failedTests || 0,
        criticalIssues: testSession.userExperience?.criticalIssues || 0
      },
      finalAnalysis: this.analyzeFinalReadiness(testSession)
    };

    // 콘솔 최종 보고서
    console.log('\n' + '='.repeat(100));
    console.log('🎯 완전한 서비스 런칭 준비 최종 보고서');
    console.log('='.repeat(100));
    console.log(`📊 종합 점수: ${report.summary.overallScore}/100`);
    console.log(`🚀 런칭 준비: ${report.summary.launchReady ? '✅ 준비 완료' : '❌ 추가 작업 필요'}`);
    console.log('');

    // 개발자 관점 요약
    console.log('🔧 개발자 관점 (코드 품질):');
    console.log(`  • 상태: ${this.getStatusEmoji(report.developmentTest.status)} ${report.developmentTest.status}`);
    console.log(`  • 총 수정사항: ${report.developmentTest.totalFixes}개`);
    console.log(`  • 치명적 수정: ${report.developmentTest.criticalFixes}개`);
    console.log('');

    // 사용자 관점 요약
    console.log('👤 사용자 관점 (사용자 경험):');
    console.log(`  • UX 점수: ${report.userExperienceTest.score}/100`);
    console.log(`  • 통과 테스트: ${report.userExperienceTest.passedTests}개`);
    console.log(`  • 실패 테스트: ${report.userExperienceTest.failedTests}개`);
    console.log(`  • 치명적 이슈: ${report.userExperienceTest.criticalIssues}개`);
    console.log('');

    // 최종 판정
    console.log('🏆 최종 판정:');
    console.log(`${report.summary.recommendation}`);
    console.log('');

    if (report.finalAnalysis.strengths.length > 0) {
      console.log('✅ 우수한 점들:');
      report.finalAnalysis.strengths.forEach((strength: string, i: number) => {
        console.log(`  ${i + 1}. ${strength}`);
      });
      console.log('');
    }

    if (report.finalAnalysis.issues.length > 0) {
      console.log('⚠️ 개선 필요사항:');
      report.finalAnalysis.issues.forEach((issue: string, i: number) => {
        console.log(`  ${i + 1}. ${issue}`);
      });
      console.log('');
    }

    // 다음 단계 안내
    if (report.summary.launchReady) {
      console.log('🎉 축하합니다! 서비스 런칭 체크리스트:');
      console.log('  1. ✅ 코드 품질 검증 완료');
      console.log('  2. ✅ 사용자 경험 검증 완료');
      console.log('  3. 🌐 도메인 설정 및 SSL 인증서 적용');
      console.log('  4. 📊 모니터링 시스템 활성화');
      console.log('  5. 🚀 서비스 정식 오픈!');
    } else {
      console.log('🔧 다음 단계:');
      console.log('  1. 위의 개선 필요사항들을 해결하세요');
      console.log('  2. 다시 완전 테스트를 실행하세요: npm run complete-test');
      console.log('  3. 모든 문제가 해결되면 서비스를 오픈하세요');
    }

    console.log('\n📋 상세 보고서:');
    console.log('  📄 production-ready-report.html (개발자 관점)');
    console.log('  🌐 user-experience-report.html (사용자 관점)');
    console.log('  📊 complete-service-report.html (통합 보고서)');

    console.log('\n' + '='.repeat(100));

    // JSON 보고서 저장
    await fs.writeFile('complete-service-report.json', JSON.stringify(report, null, 2));

    // HTML 통합 보고서 생성
    await this.generateIntegratedHTMLReport(report);

    return report;
  }

  // 🎨 상태 이모지 반환
  private getStatusEmoji(status: string): string {
    switch (status) {
      case 'PRODUCTION_READY': return '✅';
      case 'NEEDS_MANUAL_REVIEW': return '⚠️';
      case 'FAILED': return '❌';
      default: return '❓';
    }
  }

  // 🌐 통합 HTML 보고서 생성
  private async generateIntegratedHTMLReport(report: any) {
    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>완전한 서비스 런칭 준비 보고서</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        .score-section {
            padding: 40px;
            text-align: center;
            background: #f8f9fa;
        }
        .overall-score {
            font-size: 4em;
            font-weight: bold;
            margin: 20px 0;
            color: ${report.summary.overallScore >= 80 ? '#28a745' : 
                     report.summary.overallScore >= 60 ? '#ffc107' : '#dc3545'};
        }
        .readiness-badge {
            display: inline-block;
            padding: 15px 30px;
            border-radius: 50px;
            font-size: 1.2em;
            font-weight: bold;
            margin: 20px 0;
            ${report.summary.launchReady ? 
                'background: #d4edda; color: #155724; border: 2px solid #28a745;' :
                'background: #f8d7da; color: #721c24; border: 2px solid #dc3545;'}
        }
        .test-comparison {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            padding: 40px;
        }
        .test-card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border-top: 5px solid;
        }
        .dev-card { border-color: #007bff; }
        .ux-card { border-color: #28a745; }
        .test-score {
            font-size: 3em;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        .dev-score { color: #007bff; }
        .ux-score { color: #28a745; }
        .metric-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .recommendation-section {
            padding: 40px;
            background: ${report.summary.launchReady ? '#d4edda' : '#fff3cd'};
            border-left: 5px solid ${report.summary.launchReady ? '#28a745' : '#ffc107'};
        }
        .details-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 40px;
        }
        .detail-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .detail-number {
            font-size: 2em;
            font-weight: bold;
            margin: 10px 0;
        }
        .launch-ready { color: #28a745; }
        .needs-work { color: #dc3545; }
        .warning { color: #ffc107; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 완전한 서비스 런칭 준비 보고서</h1>
            <p style="font-size: 1.2em; opacity: 0.9;">개발자 관점 + 사용자 관점 종합 분석</p>
            <p>테스트 완료: ${report.timestamp}</p>
        </div>

        <div class="score-section">
            <div class="overall-score">${report.summary.overallScore}/100</div>
            <h2>종합 런칭 준비도</h2>
            <div class="readiness-badge">
                ${report.summary.launchReady ? '✅ 런칭 준비 완료' : '⚠️ 추가 작업 필요'}
            </div>
        </div>

        <div class="test-comparison">
            <div class="test-card dev-card">
                <h3>🔧 개발자 관점</h3>
                <div class="test-score dev-score">${report.developmentTest.status === 'PRODUCTION_READY' ? '100' : 
                                                    report.developmentTest.status === 'NEEDS_MANUAL_REVIEW' ? '60' : '20'}</div>
                <div class="metric-row">
                    <span>상태:</span>
                    <span><strong>${this.getStatusEmoji(report.developmentTest.status)} ${report.developmentTest.status}</strong></span>
                </div>
                <div class="metric-row">
                    <span>총 수정사항:</span>
                    <span><strong>${report.developmentTest.totalFixes}개</strong></span>
                </div>
                <div class="metric-row">
                    <span>치명적 수정:</span>
                    <span><strong>${report.developmentTest.criticalFixes}개</strong></span>
                </div>
                <p><small>코드 품질, 보안, 빌드, 배포 준비 상태</small></p>
            </div>

            <div class="test-card ux-card">
                <h3>👤 사용자 관점</h3>
                <div class="test-score ux-score">${report.userExperienceTest.score}</div>
                <div class="metric-row">
                    <span>통과 테스트:</span>
                    <span><strong>${report.userExperienceTest.passedTests}개</strong></span>
                </div>
                <div class="metric-row">
                    <span>실패 테스트:</span>
                    <span><strong>${report.userExperienceTest.failedTests}개</strong></span>
                </div>
                <div class="metric-row">
                    <span>치명적 이슈:</span>
                    <span><strong>${report.userExperienceTest.criticalIssues}개</strong></span>
                </div>
                <p><small>사용성, 접근성, 성능, 모바일 경험</small></p>
            </div>
        </div>

        <div class="recommendation-section">
            <h2>🏆 최종 판정</h2>
            <p style="font-size: 1.3em; font-weight: 500;">${report.summary.recommendation}</p>
        </div>

        <div class="details-grid">
            <div class="detail-card">
                <div class="detail-number ${report.summary.overallScore >= 80 ? 'launch-ready' : 'needs-work'}">
                    ${report.summary.overallScore}
                </div>
                <div>종합 점수</div>
            </div>
            <div class="detail-card">
                <div class="detail-number ${report.developmentTest.status === 'PRODUCTION_READY' ? 'launch-ready' : 'warning'}">
                    ${report.developmentTest.totalFixes}
                </div>
                <div>자동 수정된 이슈</div>
            </div>
            <div class="detail-card">
                <div class="detail-number ${report.userExperienceTest.score >= 80 ? 'launch-ready' : 'needs-work'}">
                    ${report.userExperienceTest.score}
                </div>
                <div>사용자 경험 점수</div>
            </div>
            <div class="detail-card">
                <div class="detail-number ${report.summary.launchReady ? 'launch-ready' : 'needs-work'}">
                    ${report.summary.launchReady ? '✅' : '❌'}
                </div>
                <div>런칭 준비 상태</div>
            </div>
        </div>

        ${report.summary.launchReady ? `
            <div style="background: #d4edda; padding: 40px; text-align: center;">
                <h2 style="color: #155724;">🎉 서비스 런칭 준비 완료!</h2>
                <p style="color: #155724; font-size: 1.2em;">
                    개발자 관점과 사용자 관점 모든 테스트를 통과했습니다.<br>
                    자신있게 서비스를 런칭하세요! 🚀
                </p>
            </div>
        ` : `
            <div style="background: #fff3cd; padding: 40px; text-align: center;">
                <h2 style="color: #856404;">🔧 추가 작업이 필요합니다</h2>
                <p style="color: #856404; font-size: 1.2em;">
                    위의 개선 필요사항들을 해결한 후 다시 테스트를 실행하세요.
                </p>
                <p style="color: #856404;">
                    <code>npm run complete-test</code> 명령어로 재테스트할 수 있습니다.
                </p>
            </div>
        `}

        <footer style="padding: 30px; text-align: center; background: #f8f9fa; color: #666;">
            <p>🤖 MCP 완전 통합 테스트 시스템으로 생성됨</p>
            <p><small>개발자 관점 + 실사용자 관점 종합 분석 • ${new Date().toLocaleString('ko-KR')}</small></p>
        </footer>
    </div>
</body>
</html>`;

    await fs.writeFile('complete-service-report.html', html);
  }
}

// 🚀 메인 실행 함수
export async function runCompleteServiceTest(localUrl?: string, productionUrl?: string) {
  console.log('🎯 완전한 서비스 런칭 준비 테스트 시작!');
  console.log('개발자와 사용자 양쪽 관점에서 모든 것을 검증합니다.\n');

  const tester = new CompleteServiceTester(localUrl, productionUrl);
  
  try {
    const result = await tester.runCompleteServiceTest();
    
    if (result.launchReady) {
      console.log('\n🎊🎊🎊 완벽합니다! 🎊🎊🎊');
      console.log('모든 테스트를 통과했습니다! 지금 바로 서비스를 런칭하세요! 🚀🚀🚀');
    } else {
      console.log('\n🔧 조금만 더 노력하면 됩니다!');
      console.log('몇 가지만 개선하면 완벽한 서비스가 될 것입니다.');
      console.log('포기하지 말고 계속 진행하세요! 💪');
    }

    return result;
    
  } catch (error) {
    console.error('❌ 완전 테스트 실행 중 오류:', error);
    throw error;
  }
}

if (require.main === module) {
  const localUrl = process.argv[2] || 'http://localhost:5000';
  const productionUrl = process.argv[3];
  
  runCompleteServiceTest(localUrl, productionUrl).catch(console.error);
}
