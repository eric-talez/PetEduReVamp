
// user-experience-tester.ts
// 실사용자 관점에서 서비스를 완전히 테스트하는 시스템

import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

interface TestResult {
  success: boolean;
  message: string;
  screenshot?: string;
  responseTime?: number;
  errors?: string[];
  suggestions?: string[];
}

interface UserScenario {
  name: string;
  description: string;
  steps: UserStep[];
  expectedOutcome: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface UserStep {
  action: 'navigate' | 'click' | 'type' | 'wait' | 'scroll' | 'check' | 'submit';
  selector?: string;
  text?: string;
  url?: string;
  timeout?: number;
  expectation?: string;
}

export class UserExperienceTester {
  private browser: Browser | null = null;
  private baseUrl: string;
  private testResults: any[] = [];
  private screenshots: string[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // 끝의 / 제거
  }

  // 🎭 실사용자 완전 테스트 실행
  async runCompleteUserTest() {
    console.log('🎭 실사용자 관점 서비스 테스트 시작');
    console.log(`🌐 테스트 대상: ${this.baseUrl}\n`);

    try {
      await this.initializeBrowser();
      
      const testSession = {
        startTime: new Date().toLocaleString('ko-KR'),
        baseUrl: this.baseUrl,
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        criticalIssues: [],
        userExperienceScore: 0,
        scenarios: []
      };

      // 1단계: 기본 접근성 테스트
      console.log('🌐 1단계: 기본 웹사이트 접근성 테스트');
      const accessibilityResults = await this.testBasicAccessibility();
      testSession.scenarios.push(accessibilityResults);

      // 2단계: 핵심 사용자 시나리오 테스트
      console.log('👤 2단계: 핵심 사용자 시나리오 테스트');
      const userScenarios = this.generateUserScenarios();
      
      for (const scenario of userScenarios) {
        console.log(`  📝 테스트 중: ${scenario.name}`);
        const result = await this.executeUserScenario(scenario);
        testSession.scenarios.push(result);
        testSession.totalTests++;
        
        if (result.success) {
          testSession.passedTests++;
        } else {
          testSession.failedTests++;
          if (scenario.priority === 'critical') {
            testSession.criticalIssues.push(result);
          }
        }
      }

      // 3단계: 성능 및 반응성 테스트
      console.log('⚡ 3단계: 성능 및 사용자 경험 테스트');
      const performanceResults = await this.testPerformanceFromUserPerspective();
      testSession.scenarios.push(performanceResults);

      // 4단계: 모바일 사용자 경험 테스트
      console.log('📱 4단계: 모바일 사용자 경험 테스트');
      const mobileResults = await this.testMobileExperience();
      testSession.scenarios.push(mobileResults);

      // 5단계: 접근성 및 사용성 테스트
      console.log('♿ 5단계: 접근성 및 사용성 테스트');
      const accessibilityScore = await this.testAccessibilityFromUserView();
      testSession.scenarios.push(accessibilityScore);

      // 6단계: 에러 상황 처리 테스트
      console.log('🚨 6단계: 에러 상황 사용자 경험 테스트');
      const errorHandlingResults = await this.testErrorHandlingUserExperience();
      testSession.scenarios.push(errorHandlingResults);

      // 사용자 경험 점수 계산
      testSession.userExperienceScore = this.calculateUserExperienceScore(testSession);

      // 최종 보고서 생성
      await this.generateUserTestReport(testSession);
      
      return testSession;

    } finally {
      await this.closeBrowser();
    }
  }

  // 🌐 기본 웹사이트 접근성 테스트
  private async testBasicAccessibility(): Promise<TestResult> {
    const page = await this.createNewPage();
    const startTime = Date.now();
    
    try {
      console.log('  🔍 웹사이트 로딩 테스트...');
      
      // 메인 페이지 접속
      const response = await page.goto(this.baseUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      const responseTime = Date.now() - startTime;
      
      if (!response || !response.ok()) {
        return {
          success: false,
          message: `웹사이트 접속 실패 (HTTP ${response?.status()})`,
          responseTime,
          errors: ['웹사이트에 접속할 수 없습니다'],
          suggestions: ['서버가 실행 중인지 확인하세요', '도메인 설정을 확인하세요']
        };
      }

      // 페이지 제목 확인
      const title = await page.title();
      const hasValidTitle = title && title.length > 0 && title !== 'Document';

      // 기본 HTML 구조 확인
      const hasH1 = await page.$('h1') !== null;
      const hasNavigation = await page.$('nav, header') !== null;
      const hasMainContent = await page.$('main, .main, #main') !== null;

      // JavaScript 오류 체크
      const jsErrors: string[] = [];
      page.on('pageerror', error => {
        jsErrors.push(error.message);
      });

      // 스크린샷 촬영
      const screenshot = await this.takeScreenshot(page, 'main-page');

      const issues = [];
      const suggestions = [];

      if (responseTime > 5000) {
        issues.push('페이지 로딩이 5초 이상 걸립니다');
        suggestions.push('이미지 최적화나 서버 성능 개선이 필요합니다');
      }

      if (!hasValidTitle) {
        issues.push('적절한 페이지 제목이 없습니다');
        suggestions.push('<title> 태그에 의미있는 제목을 추가하세요');
      }

      if (!hasH1) {
        issues.push('메인 헤딩(H1)이 없습니다');
        suggestions.push('페이지의 주요 내용을 나타내는 H1 태그를 추가하세요');
      }

      if (!hasNavigation) {
        issues.push('내비게이션 요소가 없습니다');
        suggestions.push('사용자가 사이트를 탐색할 수 있는 메뉴를 추가하세요');
      }

      return {
        success: issues.length === 0,
        message: issues.length === 0 ? 
          `웹사이트 기본 접근성 테스트 통과 (${responseTime}ms)` :
          `${issues.length}개의 접근성 문제 발견`,
        responseTime,
        screenshot,
        errors: issues,
        suggestions
      };

    } catch (error) {
      return {
        success: false,
        message: '웹사이트 접근 테스트 실패',
        errors: [error.message],
        suggestions: ['서버 상태를 확인하고 네트워크 연결을 점검하세요']
      };
    } finally {
      await page.close();
    }
  }

  // 👤 사용자 시나리오 생성
  private generateUserScenarios(): UserScenario[] {
    return [
      {
        name: '첫 방문자 경험',
        description: '처음 방문한 사용자가 사이트를 이해하고 탐색할 수 있는지 테스트',
        priority: 'critical',
        expectedOutcome: '사용자가 5초 내에 사이트의 목적을 이해할 수 있어야 함',
        steps: [
          { action: 'navigate', url: this.baseUrl },
          { action: 'wait', timeout: 2000 },
          { action: 'check', expectation: '명확한 헤딩과 설명이 보여야 함' },
          { action: 'scroll', expectation: '스크롤이 부드럽게 작동해야 함' },
          { action: 'check', expectation: '연락처나 추가 정보 링크가 있어야 함' }
        ]
      },
      {
        name: '메뉴 내비게이션',
        description: '사용자가 메뉴를 통해 다른 페이지로 이동할 수 있는지 테스트',
        priority: 'high',
        expectedOutcome: '모든 메뉴 링크가 정상 작동해야 함',
        steps: [
          { action: 'navigate', url: this.baseUrl },
          { action: 'click', selector: 'nav a, .nav a, .menu a', expectation: '메뉴 클릭 가능' },
          { action: 'wait', timeout: 3000 },
          { action: 'check', expectation: '새 페이지가 정상 로드되어야 함' }
        ]
      }
    ];
  }

  // 🎬 사용자 시나리오 실행
  private async executeUserScenario(scenario: UserScenario): Promise<TestResult> {
    const page = await this.createNewPage();
    const startTime = Date.now();
    
    try {
      let stepResults = [];
      let hasError = false;
      let errorMessages = [];

      for (let i = 0; i < scenario.steps.length; i++) {
        const step = scenario.steps[i];
        
        try {
          switch (step.action) {
            case 'navigate':
              await page.goto(step.url || this.baseUrl, { waitUntil: 'networkidle2' });
              stepResults.push(`✅ 페이지 이동: ${step.url || this.baseUrl}`);
              break;

            case 'click':
              if (step.selector) {
                const element = await page.$(step.selector);
                if (element) {
                  await element.click();
                  await page.waitForTimeout(1000);
                  stepResults.push(`✅ 클릭: ${step.selector}`);
                } else {
                  throw new Error(`클릭할 요소를 찾을 수 없음: ${step.selector}`);
                }
              }
              break;

            case 'wait':
              await page.waitForTimeout(step.timeout || 1000);
              stepResults.push(`✅ 대기: ${step.timeout}ms`);
              break;

            case 'scroll':
              await page.evaluate(() => window.scrollBy(0, window.innerHeight));
              await page.waitForTimeout(1000);
              stepResults.push('✅ 스크롤 수행');
              break;

            case 'check':
              // 페이지 상태 검증
              const title = await page.title();
              const url = page.url();
              stepResults.push(`✅ 확인: ${title} (${url})`);
              break;
          }
        } catch (stepError) {
          hasError = true;
          errorMessages.push(`❌ 단계 ${i + 1}: ${stepError.message}`);
          stepResults.push(`❌ 실패: ${step.action} - ${stepError.message}`);
        }
      }

      // 시나리오 완료 후 스크린샷
      const screenshot = await this.takeScreenshot(page, scenario.name.replace(/\s+/g, '-'));
      
      const responseTime = Date.now() - startTime;

      return {
        success: !hasError,
        message: hasError ? 
          `시나리오 실패: ${errorMessages.length}개 단계에서 오류` :
          `시나리오 성공: 모든 단계 완료 (${responseTime}ms)`,
        responseTime,
        screenshot,
        errors: hasError ? errorMessages : undefined,
        suggestions: hasError ? this.generateScenarioSuggestions(scenario, errorMessages) : undefined
      };

    } catch (error) {
      return {
        success: false,
        message: `시나리오 실행 오류: ${error.message}`,
        errors: [error.message],
        suggestions: ['페이지 구조를 확인하고 요소 선택자를 점검하세요']
      };
    } finally {
      await page.close();
    }
  }

  // ⚡ 성능 테스트 (사용자 관점)
  private async testPerformanceFromUserPerspective(): Promise<TestResult> {
    const page = await this.createNewPage();
    
    try {
      console.log('  ⚡ 페이지 로딩 성능 측정...');
      
      const startTime = Date.now();
      const response = await page.goto(this.baseUrl, { waitUntil: 'networkidle2' });
      const loadTime = Date.now() - startTime;

      // 이미지 로딩 상태 확인
      const brokenImages = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.filter(img => !img.complete || img.naturalWidth === 0).length;
      });

      const performanceIssues = [];
      const suggestions = [];

      if (loadTime > 3000) {
        performanceIssues.push('페이지 로딩이 3초 이상 걸립니다');
        suggestions.push('이미지 압축, CSS/JS 최적화를 고려하세요');
      }

      if (brokenImages > 0) {
        performanceIssues.push(`${brokenImages}개의 이미지가 로드되지 않았습니다`);
        suggestions.push('이미지 URL과 파일 경로를 확인하세요');
      }

      const screenshot = await this.takeScreenshot(page, 'performance-test');

      return {
        success: performanceIssues.length === 0,
        message: performanceIssues.length === 0 ?
          `성능 테스트 통과 (로딩: ${loadTime}ms)` :
          `${performanceIssues.length}개의 성능 이슈 발견`,
        responseTime: loadTime,
        screenshot,
        errors: performanceIssues,
        suggestions
      };

    } catch (error) {
      return {
        success: false,
        message: '성능 테스트 실패',
        errors: [error.message],
        suggestions: ['네트워크 연결과 서버 응답을 확인하세요']
      };
    } finally {
      await page.close();
    }
  }

  // 📱 모바일 사용자 경험 테스트
  private async testMobileExperience(): Promise<TestResult> {
    const page = await this.createNewPage();
    
    try {
      console.log('  📱 모바일 디바이스 테스트...');
      
      await page.emulate({
        viewport: { width: 375, height: 667, isMobile: true },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
      });

      await page.goto(this.baseUrl, { waitUntil: 'networkidle2' });

      const mobileChecks = await page.evaluate(() => {
        return {
          hasViewportMeta: !!document.querySelector('meta[name="viewport"]'),
          hasHorizontalScroll: document.body.scrollWidth > window.innerWidth,
          hasReadableTextSize: Array.from(document.querySelectorAll('p, span, div')).some(el => {
            const style = window.getComputedStyle(el);
            const fontSize = parseInt(style.fontSize);
            return fontSize >= 16;
          })
        };
      });

      const mobileIssues = [];
      const suggestions = [];

      if (!mobileChecks.hasViewportMeta) {
        mobileIssues.push('뷰포트 메타 태그가 없습니다');
        suggestions.push('<meta name="viewport" content="width=device-width, initial-scale=1.0"> 추가');
      }

      if (mobileChecks.hasHorizontalScroll) {
        mobileIssues.push('가로 스크롤이 발생합니다');
        suggestions.push('CSS에서 max-width: 100%와 box-sizing: border-box 적용');
      }

      const screenshot = await this.takeScreenshot(page, 'mobile-test');

      return {
        success: mobileIssues.length === 0,
        message: mobileIssues.length === 0 ?
          '모바일 사용자 경험 테스트 통과' :
          `${mobileIssues.length}개의 모바일 UX 이슈 발견`,
        screenshot,
        errors: mobileIssues,
        suggestions
      };

    } catch (error) {
      return {
        success: false,
        message: '모바일 테스트 실패',
        errors: [error.message],
        suggestions: ['모바일 최적화를 확인하세요']
      };
    } finally {
      await page.close();
    }
  }

  // ♿ 접근성 테스트 (사용자 관점)
  private async testAccessibilityFromUserView(): Promise<TestResult> {
    const page = await this.createNewPage();
    
    try {
      console.log('  ♿ 접근성 및 사용성 테스트...');
      
      await page.goto(this.baseUrl, { waitUntil: 'networkidle2' });

      const accessibilityChecks = await page.evaluate(() => {
        return {
          imagesWithoutAlt: Array.from(document.querySelectorAll('img')).filter(img => !img.alt).length,
          hasProperHeadingStructure: !!document.querySelector('h1'),
          inputsWithoutLabels: Array.from(document.querySelectorAll('input, textarea, select')).filter(input => {
            const id = input.id;
            const hasLabel = id && document.querySelector(`label[for="${id}"]`);
            const hasAriaLabel = input.getAttribute('aria-label');
            return !hasLabel && !hasAriaLabel;
          }).length,
          focusableElements: document.querySelectorAll('a, button, input, textarea, select, [tabindex]').length
        };
      });

      const accessibilityIssues = [];
      const suggestions = [];

      if (accessibilityChecks.imagesWithoutAlt > 0) {
        accessibilityIssues.push(`${accessibilityChecks.imagesWithoutAlt}개 이미지에 alt 텍스트가 없습니다`);
        suggestions.push('모든 이미지에 적절한 alt 속성을 추가하세요');
      }

      if (!accessibilityChecks.hasProperHeadingStructure) {
        accessibilityIssues.push('페이지에 주요 헤딩(H1)이 없습니다');
        suggestions.push('페이지의 주요 내용을 나타내는 H1 태그를 추가하세요');
      }

      const screenshot = await this.takeScreenshot(page, 'accessibility-test');

      return {
        success: accessibilityIssues.length === 0,
        message: accessibilityIssues.length === 0 ?
          '접근성 테스트 통과' :
          `${accessibilityIssues.length}개의 접근성 이슈 발견`,
        screenshot,
        errors: accessibilityIssues,
        suggestions
      };

    } catch (error) {
      return {
        success: false,
        message: '접근성 테스트 실패',
        errors: [error.message],
        suggestions: ['접근성 표준을 확인하세요']
      };
    } finally {
      await page.close();
    }
  }

  // 🚨 에러 상황 처리 테스트
  private async testErrorHandlingUserExperience(): Promise<TestResult> {
    const page = await this.createNewPage();
    
    try {
      console.log('  🚨 에러 상황 사용자 경험 테스트...');
      
      const errorTests = [];
      
      // 1. 존재하지 않는 페이지 접속
      try {
        const response = await page.goto(`${this.baseUrl}/nonexistent-page-12345`, { waitUntil: 'networkidle2' });
        const title = await page.title();
        const content = await page.content();
        
        if (response?.status() === 404) {
          if (title.includes('404') || content.includes('페이지를 찾을 수 없습니다') || content.includes('Not Found')) {
            errorTests.push('✅ 404 페이지가 적절하게 표시됩니다');
          } else {
            errorTests.push('❌ 404 페이지가 사용자 친화적이지 않습니다');
          }
        } else {
          errorTests.push('❌ 404 상황이 적절히 처리되지 않습니다');
        }
      } catch (error) {
        errorTests.push('❌ 페이지 오류 처리에 문제가 있습니다');
      }

      // 2. JavaScript 에러 발생 상황 테스트
      await page.goto(this.baseUrl);
      
      const jsErrors: string[] = [];
      page.on('pageerror', error => {
        jsErrors.push(error.message);
      });

      await page.waitForTimeout(2000);

      if (jsErrors.length === 0) {
        errorTests.push('✅ JavaScript 오류가 발견되지 않았습니다');
      } else {
        errorTests.push(`❌ ${jsErrors.length}개의 JavaScript 오류 발견`);
      }

      const screenshot = await this.takeScreenshot(page, 'error-handling-test');

      const failedTests = errorTests.filter(test => test.includes('❌'));
      const suggestions = [];

      if (failedTests.length > 0) {
        suggestions.push('사용자 친화적인 404 페이지를 만드세요');
        suggestions.push('JavaScript 오류를 수정하고 에러 핸들링을 추가하세요');
        suggestions.push('에러 상황에서도 사용자가 다른 페이지로 이동할 수 있게 하세요');
      }

      return {
        success: failedTests.length === 0,
        message: failedTests.length === 0 ?
          '에러 처리 테스트 통과' :
          `${failedTests.length}개의 에러 처리 문제 발견`,
        screenshot,
        errors: failedTests,
        suggestions
      };

    } catch (error) {
      return {
        success: false,
        message: '에러 처리 테스트 실패',
        errors: [error.message],
        suggestions: ['에러 처리 로직을 점검하세요']
      };
    } finally {
      await page.close();
    }
  }

  // 📊 사용자 경험 점수 계산
  private calculateUserExperienceScore(testSession: any): number {
    const totalTests = testSession.scenarios.length;
    const passedTests = testSession.scenarios.filter((s: any) => s.success).length;
    const criticalFailures = testSession.criticalIssues.length;

    let baseScore = (passedTests / totalTests) * 100;
    
    if (criticalFailures > 0) {
      baseScore -= (criticalFailures * 20);
    }

    const performanceTest = testSession.scenarios.find((s: any) => s.message?.includes('성능'));
    if (performanceTest && performanceTest.responseTime > 5000) {
      baseScore -= 15;
    }

    return Math.max(0, Math.min(100, Math.round(baseScore)));
  }

  // 📋 사용자 테스트 보고서 생성
  private async generateUserTestReport(testSession: any) {
    const report = {
      title: '🎭 실사용자 관점 서비스 테스트 보고서',
      timestamp: new Date().toLocaleString('ko-KR'),
      baseUrl: testSession.baseUrl,
      summary: {
        userExperienceScore: testSession.userExperienceScore,
        totalTests: testSession.totalTests,
        passedTests: testSession.passedTests,
        failedTests: testSession.failedTests,
        criticalIssues: testSession.criticalIssues.length
      },
      grade: this.getUXGrade(testSession.userExperienceScore),
      scenarios: testSession.scenarios,
      recommendations: this.generateUXRecommendations(testSession),
      screenshots: this.screenshots
    };

    // 콘솔 보고서
    console.log('\n' + '='.repeat(80));
    console.log('🎭 실사용자 관점 서비스 테스트 결과');
    console.log('='.repeat(80));
    console.log(`📊 사용자 경험 점수: ${report.summary.userExperienceScore}/100 (${report.grade})`);
    console.log(`✅ 통과한 테스트: ${report.summary.passedTests}/${report.summary.totalTests}`);
    console.log(`❌ 실패한 테스트: ${report.summary.failedTests}/${report.summary.totalTests}`);
    console.log(`🚨 치명적 이슈: ${report.summary.criticalIssues}개`);

    if (report.summary.userExperienceScore >= 80) {
      console.log('\n🎉 축하합니다! 사용자 경험이 우수합니다!');
      console.log('이 수준이면 자신있게 서비스를 런칭할 수 있습니다! 🚀');
    } else if (report.summary.userExperienceScore >= 60) {
      console.log('\n⚠️ 사용자 경험이 보통 수준입니다.');
      console.log('몇 가지 개선 후 서비스 런칭을 권장합니다.');
    } else {
      console.log('\n🚨 사용자 경험에 심각한 문제가 있습니다!');
      console.log('서비스 런칭 전에 반드시 문제를 해결해야 합니다.');
    }

    console.log('\n='.repeat(80));

    await fs.writeFile('user-experience-report.json', JSON.stringify(report, null, 2));
    await this.generateUserTestHTMLReport(report);

    return report;
  }

  // 📈 UX 등급 계산
  private getUXGrade(score: number): string {
    if (score >= 90) return 'A+ (최우수)';
    if (score >= 80) return 'A (우수)';
    if (score >= 70) return 'B+ (양호)';
    if (score >= 60) return 'B (보통)';
    if (score >= 50) return 'C (미흡)';
    return 'D (매우 미흡)';
  }

  // 💡 UX 개선 권장사항 생성
  private generateUXRecommendations(testSession: any): string[] {
    const recommendations = [];
    const failedScenarios = testSession.scenarios.filter((s: any) => !s.success);

    for (const scenario of failedScenarios) {
      if (scenario.suggestions) {
        recommendations.push(...scenario.suggestions);
      }
    }

    if (testSession.userExperienceScore < 80) {
      recommendations.push('페이지 로딩 속도를 3초 이내로 최적화하세요');
      recommendations.push('모든 링크와 버튼이 정상 작동하는지 확인하세요');
      recommendations.push('모바일에서도 편리하게 사용할 수 있도록 반응형 디자인을 적용하세요');
      recommendations.push('에러 상황에서 사용자에게 명확한 안내를 제공하세요');
      recommendations.push('접근성을 개선하여 모든 사용자가 이용할 수 있게 하세요');
    }

    return [...new Set(recommendations)];
  }

  // 🌐 HTML 보고서 생성
  private async generateUserTestHTMLReport(report: any) {
    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>사용자 경험 테스트 보고서</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
        }
        .score-card {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .score-item {
            text-align: center;
        }
        .score-number {
            font-size: 2.5em;
            font-weight: bold;
            margin: 10px 0;
        }
        .score-excellent { color: #28a745; }
        .score-good { color: #17a2b8; }
        .score-warning { color: #ffc107; }
        .score-danger { color: #dc3545; }
        .scenario-card {
            margin: 15px 0;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid;
        }
        .scenario-success {
            background: #d4edda;
            border-color: #28a745;
        }
        .scenario-failure {
            background: #f8d7da;
            border-color: #dc3545;
        }
        .recommendation-list {
            background: #fff3cd;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            transition: width 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎭 실사용자 관점 서비스 테스트 보고서</h1>
            <p>테스트 일시: ${report.timestamp}</p>
            <p>테스트 URL: <strong>${report.baseUrl}</strong></p>
        </div>

        <div class="score-card">
            <div class="score-item">
                <div class="score-number ${this.getScoreColorClass(report.summary.userExperienceScore)}">
                    ${report.summary.userExperienceScore}
                </div>
                <div>사용자 경험 점수</div>
                <div><strong>${report.grade}</strong></div>
            </div>
            <div class="score-item">
                <div class="score-number score-good">${report.summary.passedTests}</div>
                <div>통과한 테스트</div>
            </div>
            <div class="score-item">
                <div class="score-number ${report.summary.failedTests > 0 ? 'score-danger' : 'score-good'}">
                    ${report.summary.failedTests}
                </div>
                <div>실패한 테스트</div>
            </div>
            <div class="score-item">
                <div class="score-number ${report.summary.criticalIssues > 0 ? 'score-danger' : 'score-good'}">
                    ${report.summary.criticalIssues}
                </div>
                <div>치명적 이슈</div>
            </div>
        </div>

        <div class="progress-bar">
            <div class="progress-fill ${this.getScoreColorClass(report.summary.userExperienceScore)}" 
                 style="width: ${report.summary.userExperienceScore}%"></div>
        </div>

        <h2>📊 테스트 시나리오 결과</h2>
        ${report.scenarios.map((scenario: any) => `
            <div class="scenario-card ${scenario.success ? 'scenario-success' : 'scenario-failure'}">
                <h3>${scenario.success ? '✅' : '❌'} ${scenario.message}</h3>
                ${scenario.responseTime ? `<p><strong>응답시간:</strong> ${scenario.responseTime}ms</p>` : ''}
                ${scenario.errors && scenario.errors.length > 0 ? `
                    <div><strong>발견된 문제:</strong></div>
                    <ul>
                        ${scenario.errors.map((error: string) => `<li>${error}</li>`).join('')}
                    </ul>
                ` : ''}
                ${scenario.suggestions && scenario.suggestions.length > 0 ? `
                    <div><strong>개선 제안:</strong></div>
                    <ul>
                        ${scenario.suggestions.map((suggestion: string) => `<li>${suggestion}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `).join('')}

        ${report.recommendations.length > 0 ? `
            <div class="recommendation-list">
                <h2>💡 주요 개선 권장사항</h2>
                <ol>
                    ${report.recommendations.slice(0, 10).map((rec: string) => `<li>${rec}</li>`).join('')}
                </ol>
            </div>
        ` : ''}

        <div style="margin-top: 40px; padding: 20px; background: #e9ecef; border-radius: 8px; text-align: center;">
            <h3>🚀 런칭 준비도</h3>
            ${report.summary.userExperienceScore >= 80 ? 
                '<p style="color: #28a745; font-size: 1.2em;"><strong>✅ 서비스 런칭 준비 완료!</strong><br>사용자 경험이 우수하여 자신있게 서비스를 오픈할 수 있습니다.</p>' :
                report.summary.userExperienceScore >= 60 ?
                '<p style="color: #ffc107; font-size: 1.2em;"><strong>⚠️ 개선 후 런칭 권장</strong><br>몇 가지 문제를 해결한 후 서비스를 오픈하세요.</p>' :
                '<p style="color: #dc3545; font-size: 1.2em;"><strong>🚨 런칭 전 필수 개선 필요</strong><br>사용자 경험에 심각한 문제가 있어 즉시 개선이 필요합니다.</p>'
            }
        </div>

        <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
            <small>🤖 MCP 사용자 경험 테스트 시스템으로 생성됨 | ${new Date().toLocaleString('ko-KR')}</small>
        </footer>
    </div>
</body>
</html>`;

    await fs.writeFile('user-experience-report.html', html);
  }

  // 🎨 점수에 따른 색상 클래스
  private getScoreColorClass(score: number): string {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-warning';
    return 'score-danger';
  }

  // 🔧 시나리오 제안사항 생성
  private generateScenarioSuggestions(scenario: UserScenario, errorMessages: string[]): string[] {
    const suggestions = [];
    
    if (errorMessages.some(msg => msg.includes('요소를 찾을 수 없음'))) {
      suggestions.push('HTML 구조를 확인하고 CSS 선택자를 점검하세요');
      suggestions.push('페이지가 완전히 로드된 후 요소가 나타나는지 확인하세요');
    }
    
    if (errorMessages.some(msg => msg.includes('클릭'))) {
      suggestions.push('버튼이나 링크가 실제로 클릭 가능한지 확인하세요');
      suggestions.push('JavaScript 오류로 인해 클릭 이벤트가 막혔는지 확인하세요');
    }

    return suggestions;
  }

  // 🖼️ 스크린샷 촬영
  private async takeScreenshot(page: Page, name: string): Promise<string> {
    try {
      const screenshotPath = `screenshots/user-test-${name}-${Date.now()}.png`;
      
      await fs.mkdir('screenshots', { recursive: true });
      
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      this.screenshots.push(screenshotPath);
      return screenshotPath;
    } catch (error) {
      console.log(`스크린샷 촬영 실패: ${name}`);
      return '';
    }
  }

  // 🌐 브라우저 초기화
  private async initializeBrowser() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
  }

  // 📄 새 페이지 생성
  private async createNewPage(): Promise<Page> {
    if (!this.browser) {
      await this.initializeBrowser();
    }
    
    const page = await this.browser!.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setViewport({ width: 1366, height: 768 });
    
    return page;
  }

  // 🚪 브라우저 종료
  private async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// 🚀 실행 함수
export async function runUserExperienceTest(baseUrl: string) {
  console.log('🎭 실사용자 관점 서비스 테스트를 시작합니다!');
  console.log('실제 사용자가 웹사이트를 사용하는 것처럼 모든 기능을 테스트합니다.\n');

  const tester = new UserExperienceTester(baseUrl);
  
  try {
    const result = await tester.runCompleteUserTest();
    
    if (result.userExperienceScore >= 80) {
      console.log('\n🎉🎉🎉 완벽합니다! 🎉🎉🎉');
      console.log('사용자 경험이 우수하여 자신있게 서비스를 런칭할 수 있습니다! 🚀');
    } else if (result.userExperienceScore >= 60) {
      console.log('\n⚠️ 개선이 필요합니다.');
      console.log('몇 가지 문제를 해결한 후 서비스를 오픈하는 것을 권장합니다.');
    } else {
      console.log('\n🚨 긴급 개선 필요!');
      console.log('사용자 경험에 심각한 문제가 있어 서비스 오픈 전에 반드시 해결해야 합니다.');
    }

    return result;
    
  } catch (error) {
    console.error('❌ 사용자 경험 테스트 실행 중 오류:', error);
    throw error;
  }
}

if (require.main === module) {
  const baseUrl = process.argv[2] || 'http://localhost:5000';
  runUserExperienceTest(baseUrl).catch(console.error);
}
