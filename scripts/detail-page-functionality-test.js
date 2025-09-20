
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 상세 페이지 기능 테스트\n');

// 상세 페이지별 필수 기능 정의
const detailPageFeatures = {
  'trainers/detail.tsx': {
    essential: [
      'trainer profile display',
      'contact information',
      'specialties list',
      'certifications',
      'schedule display',
      'consultation booking',
      'course list',
      'reviews section'
    ],
    patterns: {
      'trainer profile display': /trainer.*name|profile.*info/i,
      'contact information': /phone|email|contact/i,
      'specialties list': /specialt|expertise/i,
      'certifications': /certification|license/i,
      'schedule display': /schedule|time|hour/i,
      'consultation booking': /booking|reservation|상담/i,
      'course list': /course.*list|강의.*목록/i,
      'reviews section': /review|rating|평가/i
    }
  },

  'courses/detail.tsx': {
    essential: [
      'course information',
      'instructor details', 
      'curriculum display',
      'enrollment button',
      'price information',
      'duration display',
      'lesson list',
      'requirements'
    ],
    patterns: {
      'course information': /course.*title|description/i,
      'instructor details': /instructor|trainer|선생/i,
      'curriculum display': /curriculum|syllabus|커리큘럼/i,
      'enrollment button': /enroll|register|수강신청/i,
      'price information': /price|cost|요금/i,
      'duration display': /duration|time|기간/i,
      'lesson list': /lesson|module|강의/i,
      'requirements': /requirement|prerequisite|요구사항/i
    }
  },

  'community/post/[id].tsx': {
    essential: [
      'post content display',
      'author information',
      'timestamp',
      'like/dislike buttons',
      'comment system',
      'comment form',
      'edit/delete options',
      'share functionality'
    ],
    patterns: {
      'post content display': /post.*content|title/i,
      'author information': /author|writer|작성자/i,
      'timestamp': /date|time|created/i,
      'like/dislike buttons': /like|thumb|좋아요/i,
      'comment system': /comment|댓글/i,
      'comment form': /comment.*form|textarea/i,
      'edit/delete options': /edit|delete|수정|삭제/i,
      'share functionality': /share|공유/i
    }
  },

  'events/event-detail.tsx': {
    essential: [
      'event information',
      'date and time',
      'location details',
      'registration button',
      'organizer info',
      'participant count',
      'price display',
      'event description'
    ],
    patterns: {
      'event information': /event.*title|name/i,
      'date and time': /date|time|schedule/i,
      'location details': /location|address|장소/i,
      'registration button': /register|join|참가/i,
      'organizer info': /organizer|host|주최/i,
      'participant count': /participant|attendee|참가자/i,
      'price display': /price|fee|참가비/i,
      'event description': /description|detail|설명/i
    }
  },

  'shop/product-detail.tsx': {
    essential: [
      'product information',
      'product images',
      'price display',
      'add to cart',
      'product options',
      'shipping info',
      'reviews section',
      'related products'
    ],
    patterns: {
      'product information': /product.*name|title/i,
      'product images': /image|photo|gallery/i,
      'price display': /price|cost|가격/i,
      'add to cart': /cart|basket|장바구니/i,
      'product options': /option|variant|선택/i,
      'shipping info': /shipping|delivery|배송/i,
      'reviews section': /review|rating/i,
      'related products': /related|recommend|추천/i
    }
  }
};

// 상세 페이지 기능 체크
function checkDetailPageFeatures(pagePath, features) {
  console.log(`📄 ${pagePath} 기능 체크:`);
  
  const fullPath = `client/src/pages/${pagePath}`;
  
  if (!fs.existsSync(fullPath)) {
    console.log(`  ❌ 파일 없음: ${fullPath}`);
    return { implemented: 0, total: features.essential.length };
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  let implementedCount = 0;
  
  features.essential.forEach(feature => {
    const pattern = features.patterns[feature];
    const isImplemented = pattern ? pattern.test(content) : 
                         content.toLowerCase().includes(feature.toLowerCase());
    
    if (isImplemented) {
      implementedCount++;
      console.log(`    ✅ ${feature}`);
    } else {
      console.log(`    ❌ ${feature}`);
    }
  });
  
  const completionRate = Math.round((implementedCount / features.essential.length) * 100);
  console.log(`  📊 완성도: ${implementedCount}/${features.essential.length} (${completionRate}%)\n`);
  
  return { implemented: implementedCount, total: features.essential.length };
}

// 상세 페이지 네비게이션 체크
function checkDetailPageNavigation() {
  console.log('🧭 상세 페이지 네비게이션 체크:');
  
  const navigationPatterns = [
    {
      page: 'trainers/detail.tsx',
      patterns: ['back to list', 'breadcrumb', '목록으로', 'history.back']
    },
    {
      page: 'courses/detail.tsx', 
      patterns: ['back to courses', 'course list', '강의목록', 'breadcrumb']
    },
    {
      page: 'community/post/[id].tsx',
      patterns: ['back to community', '커뮤니티로', 'community list']
    },
    {
      page: 'events/event-detail.tsx',
      patterns: ['back to events', 'event list', '이벤트목록']
    },
    {
      page: 'shop/product-detail.tsx',
      patterns: ['back to shop', 'product list', '상품목록', 'continue shopping']
    }
  ];
  
  navigationPatterns.forEach(nav => {
    const filePath = `client/src/pages/${nav.page}`;
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const hasNavigation = nav.patterns.some(pattern => 
        content.toLowerCase().includes(pattern.toLowerCase())
      );
      
      console.log(`  ${hasNavigation ? '✅' : '❌'} ${nav.page} 네비게이션`);
    } else {
      console.log(`  ❌ ${nav.page} (파일 없음)`);
    }
  });
  console.log('');
}

// 상세 페이지 데이터 로딩 체크
function checkDataLoading() {
  console.log('📡 데이터 로딩 체크:');
  
  Object.keys(detailPageFeatures).forEach(pagePath => {
    const filePath = `client/src/pages/${pagePath}`;
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const loadingChecks = {
        'useEffect': /useEffect|componentDidMount/i.test(content),
        'fetch/api call': /fetch|api|axios/i.test(content),
        'loading state': /loading|isLoading/i.test(content),
        'error handling': /error|catch|try/i.test(content),
        'data validation': /if.*data|data.*length|data\?/i.test(content)
      };
      
      console.log(`  📄 ${pagePath}:`);
      Object.entries(loadingChecks).forEach(([check, passed]) => {
        console.log(`    ${passed ? '✅' : '❌'} ${check}`);
      });
      console.log('');
    }
  });
}

// 반응형 지원 체크
function checkResponsiveSupport() {
  console.log('📱 반응형 지원 체크:');
  
  Object.keys(detailPageFeatures).forEach(pagePath => {
    const filePath = `client/src/pages/${pagePath}`;
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const responsiveChecks = {
        'grid system': /grid|Grid|flex|Flex/i.test(content),
        'responsive classes': /sm:|md:|lg:|xl:/i.test(content),
        'mobile optimization': /mobile|Mobile|isMobile/i.test(content),
        'container width': /container|max-w|w-full/i.test(content)
      };
      
      console.log(`  📄 ${pagePath}:`);
      Object.entries(responsiveChecks).forEach(([check, passed]) => {
        console.log(`    ${passed ? '✅' : '❌'} ${check}`);
      });
      console.log('');
    }
  });
}

// 접근성 체크
function checkAccessibility() {
  console.log('♿ 접근성 체크:');
  
  Object.keys(detailPageFeatures).forEach(pagePath => {
    const filePath = `client/src/pages/${pagePath}`;
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const a11yChecks = {
        'aria labels': /aria-label|aria-describedby/i.test(content),
        'heading structure': /<h[1-6]|className.*text-[0-9]xl/i.test(content),
        'alt text': /alt=|alt\s*:/i.test(content),
        'focus management': /focus|tabIndex/i.test(content),
        'semantic elements': /<main|<section|<article|<nav/i.test(content)
      };
      
      console.log(`  📄 ${pagePath}:`);
      Object.entries(a11yChecks).forEach(([check, passed]) => {
        console.log(`    ${passed ? '✅' : '❌'} ${check}`);
      });
      console.log('');
    }
  });
}

// 성능 최적화 체크
function checkPerformanceOptimization() {
  console.log('⚡ 성능 최적화 체크:');
  
  Object.keys(detailPageFeatures).forEach(pagePath => {
    const filePath = `client/src/pages/${pagePath}`;
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const perfChecks = {
        'lazy loading': /lazy|Lazy|Suspense/i.test(content),
        'memoization': /useMemo|useCallback|memo/i.test(content),
        'image optimization': /loading="lazy"|LazyImage/i.test(content),
        'code splitting': /dynamic.*import|React\.lazy/i.test(content)
      };
      
      console.log(`  📄 ${pagePath}:`);
      Object.entries(perfChecks).forEach(([check, passed]) => {
        console.log(`    ${passed ? '✅' : '❌'} ${check}`);
      });
      console.log('');
    }
  });
}

// 메인 실행
async function main() {
  let totalImplemented = 0;
  let totalRequired = 0;
  
  console.log('🎯 상세 페이지별 기능 체크:\n');
  
  // 각 상세 페이지 기능 체크
  Object.entries(detailPageFeatures).forEach(([pagePath, features]) => {
    const result = checkDetailPageFeatures(pagePath, features);
    totalImplemented += result.implemented;
    totalRequired += result.total;
  });
  
  // 추가 체크 항목들
  checkDetailPageNavigation();
  checkDataLoading();
  checkResponsiveSupport();
  checkAccessibility();
  checkPerformanceOptimization();
  
  // 전체 요약
  console.log('📊 전체 요약:');
  const overallCompletion = Math.round((totalImplemented / totalRequired) * 100);
  console.log(`- 전체 기능 구현율: ${totalImplemented}/${totalRequired} (${overallCompletion}%)`);
  
  if (overallCompletion >= 80) {
    console.log('✅ 상세 페이지 기능이 잘 구현되어 있습니다!');
  } else if (overallCompletion >= 60) {
    console.log('⚠️ 상세 페이지 기능이 부분적으로 구현되어 있습니다.');
  } else {
    console.log('❌ 상세 페이지 기능 개선이 필요합니다.');
  }
  
  console.log('\n🔧 개선 권장사항:');
  console.log('1. 누락된 필수 기능 구현');
  console.log('2. 데이터 로딩 상태 개선');
  console.log('3. 에러 처리 강화');
  console.log('4. 반응형 디자인 최적화');
  console.log('5. 접근성 개선');
  console.log('6. 성능 최적화 적용');
}

main().catch(console.error);
