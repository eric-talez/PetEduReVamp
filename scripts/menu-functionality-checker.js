
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 메뉴별 기능 체크 시작\n');

// 메뉴 구성 분석
function checkMenuConfiguration() {
  console.log('📋 1. 메뉴 구성 분석:');
  
  const menuConfigPath = 'shared/menu-config.ts';
  if (fs.existsSync(menuConfigPath)) {
    const menuConfig = fs.readFileSync(menuConfigPath, 'utf-8');
    
    // 메뉴 아이템 추출
    const menuItems = [];
    const itemMatches = menuConfig.match(/{\s*id:\s*['"]([^'"]+)['"][^}]+}/g);
    
    if (itemMatches) {
      itemMatches.forEach(item => {
        const idMatch = item.match(/id:\s*['"]([^'"]+)['"]/);
        const titleMatch = item.match(/title:\s*['"]([^'"]+)['"]/);
        const pathMatch = item.match(/path:\s*['"]([^'"]+)['"]/);
        const rolesMatch = item.match(/roles:\s*\[([^\]]+)\]/);
        
        if (idMatch && titleMatch && pathMatch) {
          menuItems.push({
            id: idMatch[1],
            title: titleMatch[1],
            path: pathMatch[1],
            roles: rolesMatch ? rolesMatch[1].split(',').map(r => r.trim().replace(/['"]/g, '')) : []
          });
        }
      });
    }
    
    console.log(`✅ 발견된 메뉴 아이템: ${menuItems.length}개`);
    return menuItems;
  } else {
    console.log('❌ 메뉴 설정 파일을 찾을 수 없습니다.');
    return [];
  }
}

// 페이지 파일 존재 확인
function checkPageFiles(menuItems) {
  console.log('\n📁 2. 페이지 파일 존재 확인:');
  
  const results = {
    existing: [],
    missing: [],
    external: []
  };
  
  menuItems.forEach(item => {
    if (item.path.startsWith('http')) {
      results.external.push(item);
      return;
    }
    
    const possiblePaths = [
      `client/src/pages${item.path}/index.tsx`,
      `client/src/pages${item.path}.tsx`,
      `client/src/pages${item.path}/index.js`,
      `client/src/pages${item.path}.js`
    ];
    
    let found = false;
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        results.existing.push({ ...item, filePath });
        found = true;
        break;
      }
    }
    
    if (!found) {
      results.missing.push(item);
    }
  });
  
  console.log(`✅ 존재하는 페이지: ${results.existing.length}개`);
  console.log(`❌ 누락된 페이지: ${results.missing.length}개`);
  console.log(`🔗 외부 링크: ${results.external.length}개`);
  
  if (results.missing.length > 0) {
    console.log('\n누락된 페이지:');
    results.missing.forEach(item => {
      console.log(`  - ${item.title} (${item.path})`);
    });
  }
  
  return results;
}

// 라우팅 설정 확인
function checkRouting() {
  console.log('\n🛣️  3. 라우팅 설정 확인:');
  
  const simpleAppPath = 'client/src/SimpleApp.tsx';
  if (!fs.existsSync(simpleAppPath)) {
    console.log('❌ SimpleApp.tsx 파일을 찾을 수 없습니다.');
    return;
  }
  
  const simpleAppContent = fs.readFileSync(simpleAppPath, 'utf-8');
  
  // Route 패턴 찾기
  const routes = [];
  const routeMatches = simpleAppContent.match(/<Route\s+path="([^"]+)"[^>]*>/g);
  
  if (routeMatches) {
    routeMatches.forEach(match => {
      const pathMatch = match.match(/path="([^"]+)"/);
      if (pathMatch) {
        routes.push(pathMatch[1]);
      }
    });
  }
  
  console.log(`✅ 설정된 라우트: ${routes.length}개`);
  
  return routes;
}

// 권한 체크
function checkPermissions(menuItems) {
  console.log('\n🔐 4. 권한 설정 확인:');
  
  const roleGroups = {
    'admin': [],
    'institute-admin': [],
    'trainer': [],
    'pet-owner': [],
    'user': [],
    'public': []
  };
  
  menuItems.forEach(item => {
    item.roles.forEach(role => {
      if (roleGroups[role]) {
        roleGroups[role].push(item.title);
      }
    });
  });
  
  Object.entries(roleGroups).forEach(([role, menus]) => {
    if (menus.length > 0) {
      console.log(`  ${role}: ${menus.length}개 메뉴`);
    }
  });
}

// API 엔드포인트 확인
function checkApiEndpoints() {
  console.log('\n🔌 5. API 엔드포인트 확인:');
  
  const serverIndexPath = 'server/index.ts';
  if (!fs.existsSync(serverIndexPath)) {
    console.log('❌ server/index.ts 파일을 찾을 수 없습니다.');
    return;
  }
  
  const serverContent = fs.readFileSync(serverIndexPath, 'utf-8');
  
  // API 라우트 찾기
  const apiRoutes = [];
  const routeMatches = serverContent.match(/app\.(get|post|put|delete|patch)\(['"]([^'"]+)['"]/g);
  
  if (routeMatches) {
    routeMatches.forEach(match => {
      const methodMatch = match.match(/app\.(\w+)\(['"]([^'"]+)['"]/);
      if (methodMatch) {
        apiRoutes.push({
          method: methodMatch[1].toUpperCase(),
          path: methodMatch[2]
        });
      }
    });
  }
  
  console.log(`✅ 발견된 API 엔드포인트: ${apiRoutes.length}개`);
  
  // 주요 API 그룹별 분류
  const apiGroups = {
    auth: apiRoutes.filter(r => r.path.includes('/auth')),
    menu: apiRoutes.filter(r => r.path.includes('/menu')),
    users: apiRoutes.filter(r => r.path.includes('/user')),
    courses: apiRoutes.filter(r => r.path.includes('/course')),
    trainers: apiRoutes.filter(r => r.path.includes('/trainer')),
    admin: apiRoutes.filter(r => r.path.includes('/admin'))
  };
  
  Object.entries(apiGroups).forEach(([group, routes]) => {
    if (routes.length > 0) {
      console.log(`  ${group}: ${routes.length}개 엔드포인트`);
    }
  });
}

// 컴포넌트 임포트 확인
function checkComponentImports() {
  console.log('\n📦 6. 컴포넌트 임포트 확인:');
  
  const simpleAppPath = 'client/src/SimpleApp.tsx';
  if (!fs.existsSync(simpleAppPath)) {
    console.log('❌ SimpleApp.tsx 파일을 찾을 수 없습니다.');
    return;
  }
  
  const content = fs.readFileSync(simpleAppPath, 'utf-8');
  
  // import 문 찾기
  const imports = [];
  const importMatches = content.match(/import\s+[^;]+from\s+['"][^'"]+['"]/g);
  
  if (importMatches) {
    importMatches.forEach(importStatement => {
      const pathMatch = importStatement.match(/from\s+['"]([^'"]+)['"]/);
      if (pathMatch && pathMatch[1].startsWith('./pages/')) {
        imports.push(pathMatch[1]);
      }
    });
  }
  
  console.log(`✅ 페이지 컴포넌트 임포트: ${imports.length}개`);
  
  // 누락된 임포트 확인
  const missingImports = [];
  imports.forEach(importPath => {
    const fullPath = importPath.replace('./', 'client/src/');
    if (!fs.existsSync(fullPath + '.tsx') && !fs.existsSync(fullPath + '/index.tsx')) {
      missingImports.push(importPath);
    }
  });
  
  if (missingImports.length > 0) {
    console.log(`❌ 누락된 임포트: ${missingImports.length}개`);
    missingImports.forEach(imp => console.log(`  - ${imp}`));
  }
}

// 사이드바 메뉴 연결 확인
function checkSidebarMenus() {
  console.log('\n📍 7. 사이드바 메뉴 연결 확인:');
  
  const sidebarPath = 'client/src/components/Sidebar.tsx';
  if (!fs.existsSync(sidebarPath)) {
    console.log('❌ Sidebar.tsx 파일을 찾을 수 없습니다.');
    return;
  }
  
  const sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');
  
  // AccessibleNavItem 찾기
  const navItems = [];
  const navItemMatches = sidebarContent.match(/<AccessibleNavItem[^>]+>/g);
  
  if (navItemMatches) {
    navItemMatches.forEach(match => {
      const hrefMatch = match.match(/href="([^"]+)"/);
      const titleMatch = match.match(/>([^<]+)</);
      
      if (hrefMatch) {
        navItems.push({
          href: hrefMatch[1],
          title: titleMatch ? titleMatch[1] : 'Unknown'
        });
      }
    });
  }
  
  console.log(`✅ 사이드바 메뉴 항목: ${navItems.length}개`);
}

// 메인 실행
async function main() {
  try {
    const menuItems = checkMenuConfiguration();
    const pageResults = checkPageFiles(menuItems);
    checkRouting();
    checkPermissions(menuItems);
    checkApiEndpoints();
    checkComponentImports();
    checkSidebarMenus();
    
    console.log('\n📊 요약:');
    console.log(`- 총 메뉴 아이템: ${menuItems.length}개`);
    console.log(`- 정상 작동 가능한 페이지: ${pageResults.existing.length}개`);
    console.log(`- 누락된 페이지: ${pageResults.missing.length}개`);
    console.log(`- 외부 링크: ${pageResults.external.length}개`);
    
    if (pageResults.missing.length === 0) {
      console.log('\n✅ 모든 메뉴 기능이 정상적으로 설정되어 있습니다!');
    } else {
      console.log('\n⚠️  일부 메뉴에 누락된 기능이 있습니다. 위의 세부사항을 확인해주세요.');
    }
    
  } catch (error) {
    console.error('❌ 체크 중 오류 발생:', error.message);
  }
}

main();
