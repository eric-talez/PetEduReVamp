
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 TALEZ 기능별 검증 - 로그 추적 오류 체크 시작\n');

class ErrorLogTracker {
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.errors = [];
    this.warnings = [];
    this.functionalErrors = [];
    this.performanceIssues = [];
    this.logPatterns = {
      errors: [
        /ERROR.*?:/gi,
        /Exception.*?:/gi,
        /Failed.*?:/gi,
        /Cannot.*?:/gi,
        /undefined.*?:/gi,
        /null.*?:/gi,
        /500.*?:/gi,
        /404.*?:/gi,
        /Connection.*?refused/gi,
        /Database.*?error/gi
      ],
      warnings: [
        /WARN.*?:/gi,
        /Warning.*?:/gi,
        /Deprecated.*?:/gi,
        /Slow.*?query/gi,
        /High.*?memory/gi,
        /Performance.*?issue/gi
      ],
      functional: [
        /Authentication.*?failed/gi,
        /Permission.*?denied/gi,
        /Validation.*?error/gi,
        /API.*?timeout/gi,
        /Database.*?connection.*?lost/gi,
        /Session.*?expired/gi,
        /File.*?not.*?found/gi
      ]
    };
  }

  async scanAllLogs() {
    console.log('📂 로그 파일 스캔 중...\n');
    
    if (!fs.existsSync(this.logDir)) {
      console.log('❌ logs 디렉토리가 존재하지 않습니다.');
      return;
    }

    const logFiles = fs.readdirSync(this.logDir)
      .filter(file => file.endsWith('.log'))
      .sort((a, b) => {
        const statA = fs.statSync(path.join(this.logDir, a));
        const statB = fs.statSync(path.join(this.logDir, b));
        return statB.mtime - statA.mtime; // 최신 파일 우선
      });

    console.log(`📄 발견된 로그 파일: ${logFiles.length}개\n`);

    for (const logFile of logFiles) {
      await this.analyzeLogFile(logFile);
    }

    this.generateReport();
  }

  async analyzeLogFile(logFile) {
    const filePath = path.join(this.logDir, logFile);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    console.log(`🔍 ${logFile} 분석 중...`);

    let errorCount = 0;
    let warningCount = 0;
    let functionalErrorCount = 0;

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // 에러 패턴 검사
      this.logPatterns.errors.forEach(pattern => {
        if (pattern.test(line)) {
          this.errors.push({
            file: logFile,
            line: lineNumber,
            content: line.trim(),
            type: 'ERROR',
            timestamp: this.extractTimestamp(line)
          });
          errorCount++;
        }
      });

      // 경고 패턴 검사
      this.logPatterns.warnings.forEach(pattern => {
        if (pattern.test(line)) {
          this.warnings.push({
            file: logFile,
            line: lineNumber,
            content: line.trim(),
            type: 'WARNING',
            timestamp: this.extractTimestamp(line)
          });
          warningCount++;
        }
      });

      // 기능적 오류 패턴 검사
      this.logPatterns.functional.forEach(pattern => {
        if (pattern.test(line)) {
          this.functionalErrors.push({
            file: logFile,
            line: lineNumber,
            content: line.trim(),
            type: 'FUNCTIONAL_ERROR',
            timestamp: this.extractTimestamp(line)
          });
          functionalErrorCount++;
        }
      });

      // 성능 이슈 검사
      if (this.isPerformanceIssue(line)) {
        this.performanceIssues.push({
          file: logFile,
          line: lineNumber,
          content: line.trim(),
          type: 'PERFORMANCE',
          timestamp: this.extractTimestamp(line)
        });
      }
    });

    console.log(`   ❌ 에러: ${errorCount}개`);
    console.log(`   ⚠️  경고: ${warningCount}개`);
    console.log(`   🔧 기능적 오류: ${functionalErrorCount}개\n`);
  }

  extractTimestamp(line) {
    // 타임스탬프 패턴 매칭
    const patterns = [
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
      /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/,
      /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]/
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        return match[0];
      }
    }
    return null;
  }

  isPerformanceIssue(line) {
    const performanceKeywords = [
      'slow query',
      'high memory',
      'timeout',
      'response time',
      'memory usage',
      'cpu usage'
    ];

    const lowerLine = line.toLowerCase();
    return performanceKeywords.some(keyword => lowerLine.includes(keyword));
  }

  generateReport() {
    console.log('\n📊 === 로그 추적 오류 체크 결과 === \n');

    // 전체 통계
    const totalIssues = this.errors.length + this.warnings.length + 
                       this.functionalErrors.length + this.performanceIssues.length;
    
    console.log(`🔍 총 발견된 이슈: ${totalIssues}개`);
    console.log(`   ❌ 에러: ${this.errors.length}개`);
    console.log(`   ⚠️  경고: ${this.warnings.length}개`);
    console.log(`   🔧 기능적 오류: ${this.functionalErrors.length}개`);
    console.log(`   ⚡ 성능 이슈: ${this.performanceIssues.length}개\n`);

    // 중요한 에러 우선 표시
    if (this.errors.length > 0) {
      console.log('🚨 === 중요한 에러 (최근 10개) ===');
      this.errors
        .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
        .slice(0, 10)
        .forEach((error, index) => {
          console.log(`${index + 1}. [${error.file}:${error.line}] ${error.content}`);
          if (error.timestamp) {
            console.log(`   시간: ${error.timestamp}`);
          }
          console.log('');
        });
    }

    // 기능별 오류 분석
    if (this.functionalErrors.length > 0) {
      console.log('🔧 === 기능별 오류 분석 ===');
      const functionalGroups = this.groupErrorsByFunction();
      
      Object.entries(functionalGroups).forEach(([category, errors]) => {
        console.log(`\n📂 ${category} (${errors.length}개 오류):`);
        errors.slice(0, 5).forEach(error => {
          console.log(`   • ${error.content}`);
        });
        if (errors.length > 5) {
          console.log(`   ... 외 ${errors.length - 5}개 더`);
        }
      });
    }

    // 성능 이슈 분석
    if (this.performanceIssues.length > 0) {
      console.log('\n⚡ === 성능 이슈 분석 ===');
      this.performanceIssues.slice(0, 5).forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.file}] ${issue.content}`);
      });
    }

    // 권장사항 생성
    this.generateRecommendations();

    // 상세 보고서 저장
    this.saveDetailedReport();
  }

  groupErrorsByFunction() {
    const groups = {
      '인증 관련': [],
      '데이터베이스': [],
      'API 호출': [],
      '파일 시스템': [],
      '네트워크': [],
      '기타': []
    };

    this.functionalErrors.forEach(error => {
      const content = error.content.toLowerCase();
      
      if (content.includes('auth') || content.includes('login') || content.includes('session')) {
        groups['인증 관련'].push(error);
      } else if (content.includes('database') || content.includes('sql') || content.includes('db')) {
        groups['데이터베이스'].push(error);
      } else if (content.includes('api') || content.includes('request') || content.includes('response')) {
        groups['API 호출'].push(error);
      } else if (content.includes('file') || content.includes('directory') || content.includes('path')) {
        groups['파일 시스템'].push(error);
      } else if (content.includes('network') || content.includes('connection') || content.includes('timeout')) {
        groups['네트워크'].push(error);
      } else {
        groups['기타'].push(error);
      }
    });

    // 빈 그룹 제거
    return Object.fromEntries(
      Object.entries(groups).filter(([key, value]) => value.length > 0)
    );
  }

  generateRecommendations() {
    console.log('\n💡 === 개선 권장사항 ===\n');

    const recommendations = [];

    if (this.errors.length > 10) {
      recommendations.push('🔥 높은 에러율 - 에러 핸들링 강화 필요');
    }

    if (this.functionalErrors.some(e => e.content.toLowerCase().includes('auth'))) {
      recommendations.push('🔐 인증 시스템 점검 필요');
    }

    if (this.functionalErrors.some(e => e.content.toLowerCase().includes('database'))) {
      recommendations.push('💾 데이터베이스 연결 안정성 개선 필요');
    }

    if (this.performanceIssues.length > 5) {
      recommendations.push('⚡ 성능 최적화 필요');
    }

    if (this.warnings.some(w => w.content.toLowerCase().includes('memory'))) {
      recommendations.push('🧠 메모리 사용량 모니터링 강화 필요');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ 전반적으로 양호한 상태입니다');
    }

    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }

  saveDetailedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length,
        totalFunctionalErrors: this.functionalErrors.length,
        totalPerformanceIssues: this.performanceIssues.length
      },
      errors: this.errors,
      warnings: this.warnings,
      functionalErrors: this.functionalErrors,
      performanceIssues: this.performanceIssues
    };

    const reportPath = path.join(this.logDir, 'error-tracking-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📄 상세 보고서 저장됨: ${reportPath}`);
  }
}

// 실행
async function main() {
  const tracker = new ErrorLogTracker();
  await tracker.scanAllLogs();
  
  console.log('\n✨ 로그 추적 오류 체크 완료!');
  console.log('📊 상세한 분석 결과는 logs/error-tracking-report.json 파일을 확인하세요.\n');
}

main().catch(console.error);
