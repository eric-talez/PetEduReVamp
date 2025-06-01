
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 런타임 에러 체크 스크립트\n');

// 클라이언트 사이드 에러 체크를 위한 HTML 파일 생성
const testHTML = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>페이지 테스트</title>
    <script>
        // 전역 에러 캐처
        window.addEventListener('error', function(e) {
            console.error('스크립트 에러:', e.filename, e.lineno, e.message);
            document.getElementById('errors').innerHTML += 
                '<div class="error">스크립트 에러: ' + e.message + ' (라인: ' + e.lineno + ')</div>';
        });
        
        window.addEventListener('unhandledrejection', function(e) {
            console.error('Promise 에러:', e.reason);
            document.getElementById('errors').innerHTML += 
                '<div class="error">Promise 에러: ' + e.reason + '</div>';
        });
        
        // 페이지 로드 후 체크
        document.addEventListener('DOMContentLoaded', function() {
            checkPageElements();
        });
        
        function checkPageElements() {
            const errors = [];
            
            // 이미지 로딩 에러 체크
            const images = document.querySelectorAll('img');
            images.forEach((img, index) => {
                img.onerror = function() {
                    errors.push('이미지 로딩 실패: ' + img.src);
                    updateErrorDisplay(errors);
                };
            });
            
            // 링크 체크
            const links = document.querySelectorAll('a[href^="/"]');
            links.forEach((link, index) => {
                if (link.href.includes('undefined') || link.href.includes('null')) {
                    errors.push('잘못된 링크: ' + link.href);
                }
            });
            
            // 폼 요소 체크
            const forms = document.querySelectorAll('form');
            forms.forEach((form, index) => {
                const action = form.getAttribute('action');
                if (action && (action.includes('undefined') || action === '')) {
                    errors.push('잘못된 폼 액션: ' + action);
                }
            });
            
            // 버튼 이벤트 체크
            const buttons = document.querySelectorAll('button');
            buttons.forEach((button, index) => {
                const onclick = button.getAttribute('onclick');
                if (onclick && onclick.includes('undefined')) {
                    errors.push('잘못된 버튼 이벤트: ' + onclick);
                }
            });
            
            updateErrorDisplay(errors);
        }
        
        function updateErrorDisplay(errors) {
            const errorDiv = document.getElementById('errors');
            if (errors.length === 0) {
                errorDiv.innerHTML = '<div class="success">✅ 에러가 발견되지 않았습니다</div>';
            } else {
                errorDiv.innerHTML = errors.map(err => 
                    '<div class="error">❌ ' + err + '</div>'
                ).join('');
            }
        }
        
        // 성능 체크
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                document.getElementById('performance').innerHTML = 
                    '<h3>성능 정보</h3>' +
                    '<p>페이지 로드 시간: ' + loadTime.toFixed(2) + 'ms</p>' +
                    '<p>DOM 로드 시간: ' + (perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart).toFixed(2) + 'ms</p>';
            }, 1000);
        });
    </script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .error { background: #ffebee; color: #c62828; padding: 10px; margin: 5px 0; border-radius: 4px; }
        .success { background: #e8f5e8; color: #2e7d32; padding: 10px; margin: 5px 0; border-radius: 4px; }
        .test-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 4px; }
        #performance { background: #f5f5f5; padding: 10px; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>페이지 런타임 에러 체크</h1>
    
    <div class="test-section">
        <h2>에러 로그</h2>
        <div id="errors">로딩 중...</div>
    </div>
    
    <div class="test-section">
        <div id="performance">성능 데이터 수집 중...</div>
    </div>
    
    <div class="test-section">
        <h2>테스트할 주요 페이지</h2>
        <ul>
            <li><a href="http://localhost:5000" target="_blank">홈페이지</a></li>
            <li><a href="http://localhost:5000/courses" target="_blank">강의</a></li>
            <li><a href="http://localhost:5000/trainers" target="_blank">훈련사</a></li>
            <li><a href="http://localhost:5000/institutes" target="_blank">기관</a></li>
            <li><a href="http://localhost:5000/shop" target="_blank">쇼핑</a></li>
            <li><a href="http://localhost:5000/auth" target="_blank">인증</a></li>
            <li><a href="http://localhost:5000/admin" target="_blank">관리자 (로그인 필요)</a></li>
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
console.log('✅ 런타임 테스트 페이지가 생성되었습니다: /public/test-runner.html');
console.log('🌐 브라우저에서 http://localhost:5000/test-runner.html 을 열어서 테스트하세요\n');

// 서버 사이드 에러 체크
console.log('🔧 서버 사이드 코드 체크:');

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
        { pattern: /req\.body\.\w+/g, type: '요청 바디 접근' },
        { pattern: /req\.params\.\w+/g, type: '파라미터 접근' }
      ];
      
      serverErrorPatterns.forEach(({ pattern, type }) => {
        const matches = content.match(pattern);
        if (matches) {
          console.log(`ℹ️  ${fullPath}: ${type} (${matches.length}개)`);
        }
      });
    }
  });
}

checkServerCode('server');

console.log('\n📋 추가 체크 사항:');
console.log('1. 브라우저 콘솔에서 JavaScript 에러 확인');
console.log('2. 네트워크 탭에서 API 호출 실패 확인');
console.log('3. 각 페이지의 로딩 속도 확인');
console.log('4. 모바일 디바이스에서 테스트');
console.log('5. 다양한 브라우저에서 테스트 (Chrome, Firefox, Safari)');

console.log('\n✅ 런타임 에러 체크 스크립트 완료');
