// 중복 라우트 및 컴포넌트 체크 스크립트
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTE_PATTERN = /<Route[^>]+path=["'`]([^"'`]+)["'`]/g;
const IMPORT_PATTERN = /import\s+(?:\{[^}]*\}|[^,\s]+)\s+from\s+["'`]([^"'`]+)["'`]/g;
const COMPONENT_PATTERN = /(?:const|function|class)\s+([A-Z][a-zA-Z0-9]*)/g;

const routeMap = new Map();
const componentMap = new Map();
const importMap = new Map();

function scanDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory() && !file.includes('node_modules')) {
      scanDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      // 라우트 패턴 체크
      let match;
      while ((match = ROUTE_PATTERN.exec(content)) !== null) {
        const routePath = match[1].toLowerCase();
        const existing = routeMap.get(routePath) || [];
        routeMap.set(routePath, [...existing, { file: fullPath, original: match[1] }]);
      }

      // 컴포넌트 선언 체크
      while ((match = COMPONENT_PATTERN.exec(content)) !== null) {
        const componentName = match[1];
        const existing = componentMap.get(componentName) || [];
        componentMap.set(componentName, [...existing, fullPath]);
      }

      // import 패턴 체크
      while ((match = IMPORT_PATTERN.exec(content)) !== null) {
        const importPath = match[1];
        const existing = importMap.get(importPath) || [];
        importMap.set(importPath, [...existing, fullPath]);
      }
    }
  }
}

console.log('🔍 프로젝트 중복 요소 검사 시작...\n');

// 스캔 실행
const projectRoot = path.join(__dirname, '..');
scanDir(path.join(projectRoot, 'client/src'));
scanDir(path.join(projectRoot, 'server'));

let hasIssues = false;

// 1. 중복 라우트 체크
console.log('📍 중복 라우트 체크 (대소문자 구분 없음):');
for (const [pathValue, locations] of routeMap.entries()) {
  if (locations.length > 1) {
    hasIssues = true;
    console.log(`❗ '${pathValue}' 경로가 중복됩니다 (${locations.length}회):`);
    locations.forEach((loc, i) => {
      console.log(`  [${i + 1}] ${loc.file} (원본: ${loc.original})`);
    });
    console.log('');
  }
}

// 2. 중복 컴포넌트 체크
console.log('🧩 중복 컴포넌트 체크:');
for (const [componentName, files] of componentMap.entries()) {
  if (files.length > 1) {
    hasIssues = true;
    console.log(`❗ '${componentName}' 컴포넌트가 중복됩니다 (${files.length}회):`);
    files.forEach((file, i) => console.log(`  [${i + 1}] ${file}`));
    console.log('');
  }
}

// 3. 케이스 민감성 체크
console.log('🔤 대소문자 혼용 파일명 체크:');
const fileNames = new Map();
function checkCaseSensitivity(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    
    if (fs.statSync(fullPath).isDirectory() && !file.includes('node_modules')) {
      checkCaseSensitivity(fullPath);
    } else {
      const lowerFile = file.toLowerCase();
      const existing = fileNames.get(lowerFile) || [];
      fileNames.set(lowerFile, [...existing, fullPath]);
    }
  }
}

checkCaseSensitivity(path.join(projectRoot, 'client/src'));

for (const [fileName, paths] of fileNames.entries()) {
  if (paths.length > 1) {
    const realNames = paths.map(p => path.basename(p));
    const uniqueNames = [...new Set(realNames)];
    
    if (uniqueNames.length > 1) {
      hasIssues = true;
      console.log(`❗ 대소문자만 다른 파일들:`);
      paths.forEach((p, i) => console.log(`  [${i + 1}] ${p}`));
      console.log('');
    }
  }
}

// 4. React Strict Mode 체크
console.log('⚛️ React StrictMode 체크:');
const indexFiles = [
  path.join(projectRoot, 'client/src/main.tsx'), 
  path.join(projectRoot, 'client/src/index.tsx'), 
  path.join(projectRoot, 'client/src/App.tsx')
];
for (const file of indexFiles) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    if (content.includes('StrictMode')) {
      console.log(`⚠️ ${file}에서 StrictMode 감지됨 (개발 환경에서 이중 렌더링 발생)`);
      hasIssues = true;
    }
  }
}

// 5. useEffect 의존성 체크
console.log('\n🔄 useEffect 무한 루프 위험 체크:');
function checkUseEffect(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    
    if (fs.statSync(fullPath).isDirectory() && !file.includes('node_modules')) {
      checkUseEffect(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      // navigate() in useEffect without conditions
      if (content.includes('navigate(') && content.includes('useEffect')) {
        const lines = content.split('\n');
        let inUseEffect = false;
        let hasCondition = false;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          if (line.includes('useEffect')) {
            inUseEffect = true;
            hasCondition = false;
          }
          
          if (inUseEffect && line.includes('navigate(')) {
            // Check if there's an if condition before navigate
            const prevLines = lines.slice(Math.max(0, i - 3), i);
            hasCondition = prevLines.some(l => l.includes('if '));
            
            if (!hasCondition) {
              console.log(`⚠️ ${fullPath}:${i + 1} - navigate() without condition in useEffect`);
            }
          }
        }
              hasIssues = true;
            }
          }
          
          if (line.includes('}') && inUseEffect) {
            inUseEffect = false;
          }
        }
      }
    }
  }
}

checkUseEffect(path.join(projectRoot, 'client/src'));

if (!hasIssues) {
  console.log('\n✅ 중복 요소 및 잠재적 문제점 없음!');
} else {
  console.log('\n🛠️ 위 문제들을 수정하시길 권장합니다.');
}

console.log('\n📊 검사 완료!');