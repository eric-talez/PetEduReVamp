#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 런타임 에러 체크 스크립트\n');

// 클라이언트 코드 에러 패턴 체크
function checkClientCode(dir) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      checkClientCode(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');

      // 클라이언트 에러 패턴
      const clientErrorPatterns = [
        { pattern: /console\.error/g, type: 'Console Error' },
        { pattern: /throw\s+new\s+Error/g, type: 'Error 던지기' },
        { pattern: /try\s*{[^}]*}\s*catch/g, type: 'Try-Catch 블록' },
        { pattern: /useState\(\s*undefined\s*\)/g, type: 'Undefined State' },
        { pattern: /useEffect\(\s*\(\s*\)\s*=>\s*{[^}]*navigate/g, type: 'Navigate in useEffect' },
        { pattern: /```text/g, type: '구문 오류 - 백틱' }
      ];

      clientErrorPatterns.forEach(({ pattern, type }) => {
        const matches = content.match(pattern);
        if (matches) {
          console.log(`⚠️ ${fullPath}: ${type} (${matches.length}개)`);
        }
      });
    }
  });
}

// 서버 코드 에러 체크
function checkServerCode(dir) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      checkServerCode(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf-8');

      // 서버 코드 에러 패턴
      const serverErrorPatterns = [
        { pattern: /res\.status\(500\)/g, type: '500 에러 처리' },
        { pattern: /try\s*{[^}]*}\s*catch/g, type: 'Try-Catch 블록' },
        { pattern: /console\.error/g, type: 'Error 로깅' },
        { pattern: /throw\s+new\s+Error/g, type: 'Error 던지기' },
        { pattern: /process\.env\.\w+/g, type: '환경변수 사용' },
        { pattern: /async\s+\([^)]*\)\s*=>\s*{(?!.*await)/g, type: 'Async without await' }
      ];

      serverErrorPatterns.forEach(({ pattern, type }) => {
        const matches = content.match(pattern);
        if (matches) {
          console.log(`📊 ${fullPath}: ${type} (${matches.length}개)`);
        }
      });
    }
  });
}

console.log('🔍 클라이언트 코드 체크:');
checkClientCode('client/src');

console.log('\n🔍 서버 코드 체크:');
checkServerCode('server');

// 런타임 테스트 HTML 생성
const testHTML = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>런타임 에러 테스트</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .test-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
        .error { color: red; }
        .success { color: green; }
        button { margin: 5px; padding: 10px; }
    </style>
</head>
<body>
    <h1>🔍 런타임 에러 테스트 페이지</h1>

    <div class="test-section">
        <h2>자동 테스트 링크</h2>
        <ul>
            <li><a href="/" target="_blank">홈페이지 테스트</a></li>
            <li><a href="/auth" target="_blank">인증 페이지 테스트</a></li>
            <li><a href="/dashboard" target="_blank">대시보드 테스트</a></li>
            <li><a href="/trainers" target="_blank">훈련사 페이지 테스트</a></li>
            <li><a href="/courses" target="_blank">강좌 페이지 테스트</a></li>
            <li><a href="/community" target="_blank">커뮤니티 페이지 테스트</a></li>
            <li><a href="/shop" target="_blank">쇼핑 페이지 테스트 (로그인 필요)</a></li>
        </ul>
    </div>

    <div class="test-section">
        <h2>수동 테스트 체크리스트</h2>
        <ul>
            <li>📱 모바일 반응형 디자인</li>
            <li>🔗 모든 링크 클릭 가능</li>
            <li>📝 폼 제출 동작</li>
            <li>🔍 검색 기능</li>
            <li>📊 데이터 로딩</li>
            <li>🔐 인증 흐름</li>
            <li>🛒 장바구니 기능</li>
            <li>📨 알림 시스템</li>
        </ul>
    </div>
</body>
</html>
`;

fs.writeFileSync('public/test-runner.html', testHTML);
console.log('\n✅ 런타임 테스트 페이지가 생성되었습니다: /public/test-runner.html');
console.log('🌐 브라우저에서 http://localhost:5000/test-runner.html 을 열어서 테스트하세요\n');