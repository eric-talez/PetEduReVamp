
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 전체 페이지 동작 및 에러 체크 시작\n');

// 1. 라우팅 파일 분석
console.log('📋 1. 라우팅 구조 분석:');
const routingFiles = [
  'client/src/SimpleApp.tsx',
  'shared/menu-config.ts',
  'client/src/components/Sidebar.tsx'
];

const routes = new Set();
const menuItems = new Set();

routingFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Route 패턴 찾기
    const routeMatches = content.match(/path="([^"]+)"/g);
    if (routeMatches) {
      routeMatches.forEach(match => {
        const path = match.match(/path="([^"]+)"/)[1];
        routes.add(path);
      });
    }
    
    // href 패턴 찾기
    const hrefMatches = content.match(/href="([^"]+)"/g);
    if (hrefMatches) {
      hrefMatches.forEach(match => {
        const href = match.match(/href="([^"]+)"/)[1];
        if (href.startsWith('/') && !href.includes('http')) {
          routes.add(href);
        }
      });
    }
    
    // setLocation 패턴 찾기
    const locationMatches = content.match(/setLocation\('([^']+)'\)/g);
    if (locationMatches) {
      locationMatches.forEach(match => {
        const location = match.match(/setLocation\('([^']+)'\)/)[1];
        routes.add(location);
      });
    }
  }
});

console.log(`발견된 라우트: ${Array.from(routes).sort().join(', ')}\n`);

// 2. 페이지 파일 존재 여부 체크
console.log('📂 2. 페이지 파일 존재 여부 체크:');
const pageDir = 'client/src/pages';
const existingPages = new Set();

function scanDirectory(dir, prefix = '') {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath, prefix + '/' + file);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      const pagePath = (prefix + '/' + file.replace(/\.(tsx|jsx)$/, '')).replace('/index', '');
      existingPages.add(pagePath || '/');
    }
  });
}

scanDirectory(pageDir);
console.log(`발견된 페이지 파일: ${Array.from(existingPages).sort().join(', ')}\n`);

// 환경변수 체크 완성
envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    lines.forEach(line => {
      if (line.includes('=') && !line.startsWith('#')) {
        const varName = line.split('=')[0].trim();
        if (varName) envVars.add(varName);
      }
    });
  }
});

console.log(`발견된 환경변수: ${Array.from(envVars).sort().join(', ')}\n`);

// 3. 라우트와 페이지 파일 매칭 체크
console.log('🔗 3. 라우트-페이지 매칭 체크:');
const missingPages = [];
const orphanedPages = [];

Array.from(routes).forEach(route => {
  const cleanRoute = route.replace(/:\w+/g, '').replace(/\/$/, '') || '/';
  const hasPage = Array.from(existingPages).some(page => 
    page === cleanRoute || 
    page.startsWith(cleanRoute + '/') ||
    cleanRoute.startsWith(page)
  );
  
  if (!hasPage) {
    missingPages.push(route);
  }
});

Array.from(existingPages).forEach(page => {
  const hasRoute = Array.from(routes).some(route => 
    route === page || 
    route.startsWith(page) ||
    page.startsWith(route.replace(/:\w+/g, ''))
  );
  
  if (!hasRoute && page !== '/') {
    orphanedPages.push(page);
  }
});

if (missingPages.length > 0) {
  console.log('❌ 라우트는 있지만 페이지 파일이 없는 경우:');
  missingPages.forEach(page => console.log(`   - ${page}`));
} else {
  console.log('✅ 모든 라우트에 해당하는 페이지 파일이 존재합니다');
}

if (orphanedPages.length > 0) {
  console.log('⚠️  페이지 파일은 있지만 라우트가 없는 경우:');
  orphanedPages.forEach(page => console.log(`   - ${page}`));
}

console.log('');

// 4. 컴포넌트 내 에러 패턴 체크
console.log('🐛 4. 컴포넌트 에러 패턴 체크:');
let errorCount = 0;

function checkComponentErrors(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.includes('node_modules')) {
      checkComponentErrors(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      // 일반적인 에러 패턴들
      const errorPatterns = [
        { pattern: /console\.error/g, type: 'Console Error' },
        { pattern: /throw new Error/g, type: 'Throw Error' },
        { pattern: /undefined.*\?/g, type: 'Undefined Check' },
        { pattern: /\.map\(.*\)/g, type: 'Map without key warning risk' },
        { pattern: /useEffect.*\[\]/g, type: 'Empty dependency array' },
        { pattern: /useState.*undefined/g, type: 'Undefined initial state' },
        { pattern: /onClick.*undefined/g, type: 'Undefined onClick handler' }
      ];
      
      errorPatterns.forEach(({ pattern, type }) => {
        const matches = content.match(pattern);
        if (matches) {
          console.log(`⚠️  ${fullPath}: ${type} (${matches.length}개)`);
          errorCount++;
        }
      });
      
      // Import 에러 체크
      const importMatches = content.match(/import.*from ['"]([^'"]+)['"]/g);
      if (importMatches) {
        importMatches.forEach(importLine => {
          const importPath = importLine.match(/from ['"]([^'"]+)['"]/)[1];
          if (importPath.startsWith('./') || importPath.startsWith('../')) {
            const resolvedPath = path.resolve(path.dirname(fullPath), importPath);
            const possibleExtensions = ['.tsx', '.jsx', '.ts', '.js', '.json'];
            let exists = false;
            
            // 파일 확장자 확인
            if (fs.existsSync(resolvedPath)) {
              exists = true;
            } else {
              for (const ext of possibleExtensions) {
                if (fs.existsSync(resolvedPath + ext)) {
                  exists = true;
                  break;
                }
              }
              // index 파일 확인
              if (!exists && fs.existsSync(path.join(resolvedPath, 'index.tsx'))) {
                exists = true;
              }
            }
            
            if (!exists) {
              console.log(`❌ ${fullPath}: 존재하지 않는 import - ${importPath}`);
              errorCount++;
            }
          }
        });
      }
    }
  });
}

checkComponentErrors('client/src');

if (errorCount === 0) {
  console.log('✅ 컴포넌트 에러 패턴이 발견되지 않았습니다');
}

console.log('');

// 5. 메뉴 권한 체크
console.log('🔐 5. 메뉴 권한 설정 체크:');
const menuConfigPath = 'shared/menu-config.ts';
if (fs.existsSync(menuConfigPath)) {
  const menuConfig = fs.readFileSync(menuConfigPath, 'utf-8');
  
  // 권한별 메뉴 분석
  const roleMenus = {
    'admin': [],
    'institute-admin': [],
    'trainer': [],
    'pet-owner': []
  };
  
  const menuMatches = menuConfig.match(/{\s*id:[^}]+}/g);
  if (menuMatches) {
    menuMatches.forEach(menu => {
      const idMatch = menu.match(/id:\s*['"]([^'"]+)['"]/);
      const rolesMatch = menu.match(/roles:\s*\[([^\]]+)\]/);
      
      if (idMatch && rolesMatch) {
        const id = idMatch[1];
        const roles = rolesMatch[1].split(',').map(r => r.trim().replace(/['"]/g, ''));
        
        roles.forEach(role => {
          if (roleMenus[role]) {
            roleMenus[role].push(id);
          }
        });
      }
    });
  }
  
  Object.entries(roleMenus).forEach(([role, menus]) => {
    console.log(`${role}: ${menus.length}개 메뉴 (${menus.join(', ')})`);
  });
} else {
  console.log('❌ 메뉴 설정 파일을 찾을 수 없습니다');
}

console.log('');

// 6. API 엔드포인트 체크
console.log('🌐 6. API 엔드포인트 체크:');
const serverFiles = [
  'server/routes.ts',
  'server/spring-boot-routes.ts',
  'server/auth/index.ts'
];

const apiEndpoints = new Set();

serverFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    
    const apiMatches = content.match(/app\.(get|post|put|delete|patch)\(['"]([^'"]+)['"]/g);
    if (apiMatches) {
      apiMatches.forEach(match => {
        const endpoint = match.match(/\(['"]([^'"]+)['"]/)[1];
        apiEndpoints.add(endpoint);
      });
    }
  }
});

console.log(`발견된 API 엔드포인트: ${Array.from(apiEndpoints).sort().join(', ')}\n`);

// 7. 환경변수 체크
console.log('🔧 7. 환경변수 설정 체크:');
const envFiles = ['.env', '.env.local', '.env.example'];
const envVars = new Set();

envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    const vars = content.match(/^[A-Z_][A-Z0-9_]*=/gm);
    if (vars) {
      vars.forEach(v => envVars.add(v.replace('=', '')));
    }
  }
});

console.log(`설정된 환경변수: ${Array.from(envVars).sort().join(', ')}\n`);

// 8. 요약 리포트
console.log('📊 8. 종합 리포트:');
console.log(`총 라우트 수: ${routes.size}`);
console.log(`총 페이지 파일 수: ${existingPages.size}`);
console.log(`누락된 페이지: ${missingPages.length}`);
console.log(`고아 페이지: ${orphanedPages.length}`);
console.log(`에러 패턴: ${errorCount}`);
console.log(`API 엔드포인트: ${apiEndpoints.size}`);
console.log(`환경변수: ${envVars.size}`);

const totalIssues = missingPages.length + orphanedPages.length + errorCount;
if (totalIssues === 0) {
  console.log('\n🎉 모든 체크를 통과했습니다!');
} else {
  console.log(`\n⚠️  총 ${totalIssues}개의 이슈가 발견되었습니다.`);
}

console.log('\n✅ 전체 페이지 체크 완료');
