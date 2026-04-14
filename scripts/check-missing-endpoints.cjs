#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 누락된 엔드포인트 및 익스포트 체크 시작\n');

// 1. 프론트엔드에서 호출하는 API 엔드포인트 수집
console.log('📱 1. 프론트엔드 API 호출 분석:');
const clientDir = 'client/src';
const apiCalls = new Set();

function scanClientFiles(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanClientFiles(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      // fetch, axios 등의 API 호출 패턴 찾기
      const apiPatterns = [
        /fetch\(['"`]([^'"`]+)['"`]/g,
        /axios\.(get|post|put|delete|patch)\(['"`]([^'"`]+)['"`]/g,
        /\.get\(['"`]([^'"`]+)['"`]/g,
        /\.post\(['"`]([^'"`]+)['"`]/g,
        /\.put\(['"`]([^'"`]+)['"`]/g,
        /\.delete\(['"`]([^'"`]+)['"`]/g,
        /\.patch\(['"`]([^'"`]+)['"`]/g,
        /api\(['"`]([^'"`]+)['"`]/g
      ];
      
      apiPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          let endpoint = match[1] || match[2];
          if (endpoint && endpoint.startsWith('/api/')) {
            // 동적 파라미터 정규화
            endpoint = endpoint.replace(/\/\d+/g, '/:id');
            apiCalls.add(endpoint);
          }
        }
      });
    }
  });
}

scanClientFiles(clientDir);
console.log(`발견된 API 호출: ${apiCalls.size}개`);
Array.from(apiCalls).sort().forEach(api => console.log(`  - ${api}`));

// 2. 서버에서 정의된 엔드포인트 수집
console.log('\n🖥️  2. 서버 엔드포인트 분석:');
const serverRoutes = new Set();
const routeFiles = [
  'server/routes.ts',
  'server/routes/admin.ts',
  'server/routes/dashboard.ts',
  'server/routes/messaging.ts',
  'server/routes/analytics.ts',
  'server/routes/shopping.ts',
  'server/routes/products.ts',
  'server/routes/simple-products.ts',
  'server/routes/upload.ts',
  'server/location/routes.ts'
];

routeFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Express 라우트 패턴 찾기
    const routePattern = /app\.(get|post|put|delete|patch)\(['"`]([^'"`]+)['"`]/g;
    let match;
    while ((match = routePattern.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const path = match[2];
      serverRoutes.add(`${method} ${path}`);
    }
  }
});

console.log(`정의된 서버 라우트: ${serverRoutes.size}개`);

// 3. 누락된 엔드포인트 찾기
console.log('\n❌ 3. 누락된 엔드포인트:');
const missingEndpoints = [];

apiCalls.forEach(apiCall => {
  const hasGetRoute = serverRoutes.has(`GET ${apiCall}`);
  const hasPostRoute = serverRoutes.has(`POST ${apiCall}`);
  const hasPutRoute = serverRoutes.has(`PUT ${apiCall}`);
  const hasDeleteRoute = serverRoutes.has(`DELETE ${apiCall}`);
  const hasPatchRoute = serverRoutes.has(`PATCH ${apiCall}`);
  
  if (!hasGetRoute && !hasPostRoute && !hasPutRoute && !hasDeleteRoute && !hasPatchRoute) {
    missingEndpoints.push(apiCall);
  }
});

if (missingEndpoints.length > 0) {
  console.log('다음 엔드포인트들이 누락되었습니다:');
  missingEndpoints.forEach(endpoint => console.log(`  ❌ ${endpoint}`));
} else {
  console.log('✅ 모든 API 엔드포인트가 구현되어 있습니다.');
}

// 4. 익스포트 체크
console.log('\n📤 4. 익스포트 체크:');
const exportIssues = [];

// storage.ts export 체크
if (fs.existsSync('server/storage.ts')) {
  const storageContent = fs.readFileSync('server/storage.ts', 'utf-8');
  if (!storageContent.includes('export')) {
    exportIssues.push('server/storage.ts - 익스포트가 없습니다');
  }
}

// storage-minimal.ts export 체크
if (fs.existsSync('server/storage-minimal.ts')) {
  const minimalContent = fs.readFileSync('server/storage-minimal.ts', 'utf-8');
  if (!minimalContent.includes('export class') && !minimalContent.includes('export const storage')) {
    exportIssues.push('server/storage-minimal.ts - storage 클래스나 인스턴스 익스포트가 없습니다');
  }
}

// routes.ts export 체크
const routesPath = 'server/routes.ts';
if (fs.existsSync(routesPath)) {
  const routesContent = fs.readFileSync(routesPath, 'utf-8');
  if (!routesContent.includes('export function registerRoutes') && !routesContent.includes('export async function registerRoutes')) {
    exportIssues.push('server/routes.ts - registerRoutes 함수 익스포트가 없습니다');
  }
}

if (exportIssues.length > 0) {
  console.log('다음 익스포트 문제가 발견되었습니다:');
  exportIssues.forEach(issue => console.log(`  ❌ ${issue}`));
} else {
  console.log('✅ 모든 필수 익스포트가 정상입니다.');
}

// 5. 권장 수정사항
console.log('\n💡 5. 권장 수정사항:');

if (missingEndpoints.length > 0) {
  console.log('\n누락된 엔드포인트를 추가하세요:');
  missingEndpoints.forEach(endpoint => {
    console.log(`
app.get('${endpoint}', async (req, res) => {
  try {
    // TODO: ${endpoint} 구현
    res.json({ message: 'Not implemented yet' });
  } catch (error) {
    console.error('${endpoint} 오류:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});`);
  });
}

console.log('\n🔍 체크 완료!');
