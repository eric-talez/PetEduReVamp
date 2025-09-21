
const fs = require('fs');
const path = require('path');

console.log('🔍 TALEZ 플랫폼 종합 시스템 체크 시작...\n');

// 1. 핵심 파일 존재 여부 체크
const criticalFiles = [
  'client/src/SimpleApp.tsx',
  'client/src/components/TopBar.tsx',
  'client/src/components/Sidebar.tsx',
  'client/src/components/ui/button.tsx',
  'server/index.ts',
  'package.json'
];

console.log('📁 핵심 파일 존재 여부 체크:');
let missingFiles = [];
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - 누락됨`);
    missingFiles.push(file);
  }
});

// 2. 컴포넌트 일관성 체크
console.log('\n🎨 컴포넌트 일관성 체크:');
const componentDir = 'client/src/components/ui';
let inconsistentComponents = [];

if (fs.existsSync(componentDir)) {
  const components = fs.readdirSync(componentDir)
    .filter(file => file.endsWith('.tsx'))
    .slice(0, 10); // 주요 컴포넌트만 체크

  components.forEach(component => {
    const filePath = path.join(componentDir, component);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 기본 품질 체크
      const hasForwardRef = content.includes('React.forwardRef');
      const hasDisplayName = content.includes('.displayName');
      const hasTypeScript = content.includes('interface') || content.includes('type');
      
      if (hasForwardRef && hasDisplayName && hasTypeScript) {
        console.log(`  ✅ ${component} - 일관성 양호`);
      } else {
        console.log(`  ⚠️  ${component} - 일관성 개선 필요`);
        inconsistentComponents.push(component);
      }
    } catch (error) {
      console.log(`  ❌ ${component} - 읽기 오류`);
    }
  });
}

// 3. 버튼 사용량 체크
console.log('\n🔘 버튼 사용량 및 일관성 체크:');
const pagesDir = 'client/src/pages';
let buttonUsageStats = {
  total: 0,
  withVariant: 0,
  withSize: 0,
  withTestId: 0
};

function checkButtonsInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const buttonMatches = content.match(/<Button[^>]*>/g) || [];
    
    buttonMatches.forEach(button => {
      buttonUsageStats.total++;
      if (button.includes('variant=')) buttonUsageStats.withVariant++;
      if (button.includes('size=')) buttonUsageStats.withSize++;
      if (button.includes('data-testid=')) buttonUsageStats.withTestId++;
    });
  } catch (error) {
    // 파일 읽기 오류 무시
  }
}

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  
  fs.readdirSync(dir).forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (item.endsWith('.tsx')) {
      checkButtonsInFile(fullPath);
    }
  });
}

scanDirectory(pagesDir);

console.log(`  총 버튼 사용량: ${buttonUsageStats.total}개`);
console.log(`  variant 사용: ${buttonUsageStats.withVariant}개 (${Math.round(buttonUsageStats.withVariant/buttonUsageStats.total*100)}%)`);
console.log(`  size 사용: ${buttonUsageStats.withSize}개 (${Math.round(buttonUsageStats.withSize/buttonUsageStats.total*100)}%)`);
console.log(`  data-testid 사용: ${buttonUsageStats.withTestId}개 (${Math.round(buttonUsageStats.withTestId/buttonUsageStats.total*100)}%)`);

// 4. 접근성 체크
console.log('\n♿ 접근성 기본 체크:');
const accessibilityFiles = [
  'client/src/components/a11y/AccessibilityProvider.tsx',
  'client/src/components/accessibility/SkipLink.tsx',
  'client/src/utils/a11y-checker.ts'
];

let accessibilityScore = 0;
accessibilityFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
    accessibilityScore++;
  } else {
    console.log(`  ❌ ${file} - 누락됨`);
  }
});

// 5. 종합 평가
console.log('\n📊 종합 평가:');
const totalScore = {
  files: Math.round((criticalFiles.length - missingFiles.length) / criticalFiles.length * 100),
  components: Math.round((10 - inconsistentComponents.length) / 10 * 100),
  buttons: Math.round((buttonUsageStats.withVariant + buttonUsageStats.withSize) / (buttonUsageStats.total * 2) * 100),
  accessibility: Math.round(accessibilityScore / accessibilityFiles.length * 100)
};

const overallScore = Math.round((totalScore.files + totalScore.components + totalScore.buttons + totalScore.accessibility) / 4);

console.log(`  파일 완성도: ${totalScore.files}%`);
console.log(`  컴포넌트 일관성: ${totalScore.components}%`);
console.log(`  버튼 표준화: ${totalScore.buttons}%`);
console.log(`  접근성 준비도: ${totalScore.accessibility}%`);
console.log(`\n🎯 전체 시스템 안정성: ${overallScore}%`);

if (overallScore >= 90) {
  console.log('🟢 시스템 상태: 매우 안정적 - 배포 준비 완료');
} else if (overallScore >= 80) {
  console.log('🟡 시스템 상태: 안정적 - 일부 개선 권장');
} else if (overallScore >= 70) {
  console.log('🟠 시스템 상태: 보통 - 개선 필요');
} else {
  console.log('🔴 시스템 상태: 불안정 - 즉시 개선 필요');
}

// 6. 개선 권장사항
console.log('\n💡 개선 권장사항:');
if (missingFiles.length > 0) {
  console.log(`  - 누락된 파일 ${missingFiles.length}개 복구 필요`);
}
if (inconsistentComponents.length > 0) {
  console.log(`  - 컴포넌트 ${inconsistentComponents.length}개 표준화 필요`);
}
if (buttonUsageStats.withVariant / buttonUsageStats.total < 0.8) {
  console.log(`  - 버튼 variant 사용률 향상 필요 (현재: ${Math.round(buttonUsageStats.withVariant/buttonUsageStats.total*100)}%)`);
}
if (accessibilityScore < 3) {
  console.log(`  - 접근성 컴포넌트 추가 구현 필요`);
}

console.log('\n✅ 시스템 체크 완료!');
