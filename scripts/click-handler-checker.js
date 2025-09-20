
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 전체 서비스 클릭 핸들러 및 상세 페이지 기능 체크\n');

// 페이지별 클릭 핸들러 및 상세 페이지 매핑
const pageClickHandlers = {
  // 메인 홈페이지
  'Home.tsx': {
    handlers: [
      'handleQuickLogin',
      'toggleServiceStats', 
      'nextSlide',
      'prevSlide',
      'resetExperience',
      'startAnalysis'
    ],
    detailPages: [],
    navigation: ['/', '/dashboard', '/trainers', '/courses']
  },

  // 훈련사 관련
  'Trainers.tsx': {
    handlers: [
      'openTrainerProfile',
      'setFilter',
      'setSearchQuery',
      'setShowCertifiedOnly'
    ],
    detailPages: ['/trainers/detail'],
    navigation: ['/trainers']
  },

  'trainers/detail.tsx': {
    handlers: [
      'fetchTrainerData',
      'handleJoinClass',
      'handleAddToCart'
    ],
    detailPages: [],
    navigation: ['/trainers/:id']
  },

  // 강의 관련
  'Courses.tsx': {
    handlers: [
      'handleCourseClick',
      'handleEnroll',
      'handlePlayVideo'
    ],
    detailPages: ['/courses/detail'],
    navigation: ['/courses']
  },

  'courses/detail.tsx': {
    handlers: [
      'handleEnrollment',
      'handleJoinClass',
      'handleAddToCart'
    ],
    detailPages: [],
    navigation: ['/courses/:id']
  },

  // 커뮤니티
  'Community.tsx': {
    handlers: [
      'setIsPostFormOpen',
      'setSearchTerm'
    ],
    detailPages: ['/community/post/:id'],
    navigation: ['/community']
  },

  'community/post/[id].tsx': {
    handlers: [
      'onSubmit',
      'handleCommentEdit',
      'handleCommentDelete',
      'handlePostDelete',
      'handlePostEdit'
    ],
    detailPages: [],
    navigation: ['/community/post/:id']
  },

  // 이벤트
  'events/index.tsx': {
    handlers: [
      'setSearchTerm',
      'setSelectedRegion',
      'setSelectedCategory',
      'handleMapMarkerClick'
    ],
    detailPages: ['/events/event-detail'],
    navigation: ['/events']
  },

  'events/event-detail.tsx': {
    handlers: [
      'handleRegister',
      'handleShare',
      'toggleWishlist'
    ],
    detailPages: [],
    navigation: ['/events/:id']
  },

  // 쇼핑몰
  'shop/index.tsx': {
    handlers: [
      'handleSearchFocus',
      'handleSearchBlur', 
      'handleSearch',
      'addToCart',
      'toggleWishlist'
    ],
    detailPages: ['/shop/product-detail'],
    navigation: ['/shop']
  },

  'shop/product-detail.tsx': {
    handlers: [
      'addToCart',
      'toggleWishlist',
      'shareProduct',
      'verifyReferralCode',
      'copyLink',
      'selectImage'
    ],
    detailPages: [],
    navigation: ['/shop/product/:id']
  }
};

// 컴포넌트별 클릭 핸들러
const componentClickHandlers = {
  'RealTimePopularChart.tsx': [
    'handleItemClick',
    'handleConsultationClick'
  ],
  'Sidebar.tsx': [
    'handleItemClick',
    'toggleGroup'
  ],
  'TopBar.tsx': [
    'handleNotificationClick',
    'handleProfileClick'
  ],
  'TrainerProfileModal.tsx': [
    'handleConsultationRequest',
    'handleBooking'
  ]
};

// 파일별 클릭 핸들러 체크
function checkClickHandlers(filePath, expectedHandlers) {
  console.log(`📄 ${filePath} 체크:`);
  
  if (!fs.existsSync(`client/src/pages/${filePath}`)) {
    console.log(`  ❌ 파일 없음: client/src/pages/${filePath}`);
    return { found: 0, missing: expectedHandlers };
  }
  
  const content = fs.readFileSync(`client/src/pages/${filePath}`, 'utf-8');
  const foundHandlers = [];
  const missingHandlers = [];
  
  expectedHandlers.forEach(handler => {
    // 함수 정의나 호출 패턴 체크
    const patterns = [
      `const ${handler}`,
      `function ${handler}`,
      `${handler} =`,
      `${handler}:`,
      `onClick={${handler}}`,
      `onClick={() => ${handler}`,
      `${handler}(`
    ];
    
    const isFound = patterns.some(pattern => content.includes(pattern));
    
    if (isFound) {
      foundHandlers.push(handler);
      console.log(`    ✅ ${handler}`);
    } else {
      missingHandlers.push(handler);
      console.log(`    ❌ ${handler} (누락)`);
    }
  });
  
  return { found: foundHandlers.length, missing: missingHandlers };
}

// 상세 페이지 연결 체크
function checkDetailPageConnections() {
  console.log('\n🔗 상세 페이지 연결 체크:');
  
  const connections = [
    {
      from: 'client/src/pages/Trainers.tsx',
      to: 'client/src/pages/trainers/detail.tsx',
      pattern: 'setLocation.*trainers'
    },
    {
      from: 'client/src/pages/Courses.tsx', 
      to: 'client/src/pages/courses/detail.tsx',
      pattern: 'setLocation.*courses'
    },
    {
      from: 'client/src/pages/Community.tsx',
      to: 'client/src/pages/community/post/[id].tsx',
      pattern: 'setLocation.*community'
    },
    {
      from: 'client/src/pages/events/index.tsx',
      to: 'client/src/pages/events/event-detail.tsx', 
      pattern: 'setLocation.*events'
    },
    {
      from: 'client/src/pages/shop/index.tsx',
      to: 'client/src/pages/shop/product-detail.tsx',
      pattern: 'setLocation.*shop.*product'
    }
  ];
  
  connections.forEach(conn => {
    if (fs.existsSync(conn.from)) {
      const content = fs.readFileSync(conn.from, 'utf-8');
      const hasConnection = new RegExp(conn.pattern, 'i').test(content);
      
      console.log(`  ${hasConnection ? '✅' : '❌'} ${path.basename(conn.from)} → ${path.basename(conn.to)}`);
    } else {
      console.log(`  ❌ ${path.basename(conn.from)} (파일 없음)`);
    }
  });
}

// API 연결 체크
function checkAPIConnections() {
  console.log('\n🌐 API 연결 체크:');
  
  const apiEndpoints = [
    { page: 'Trainers.tsx', api: '/api/trainers' },
    { page: 'Courses.tsx', api: '/api/admin/curriculums' },
    { page: 'Community.tsx', api: '/api/community/posts' },
    { page: 'events/index.tsx', api: '/api/events' },
    { page: 'shop/product-detail.tsx', api: '/api/shop/products' }
  ];
  
  apiEndpoints.forEach(endpoint => {
    const filePath = `client/src/pages/${endpoint.page}`;
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const hasAPI = content.includes(endpoint.api);
      
      console.log(`  ${hasAPI ? '✅' : '❌'} ${endpoint.page} → ${endpoint.api}`);
    }
  });
}

// 라우팅 설정 체크
function checkRouting() {
  console.log('\n🛣️ 라우팅 설정 체크:');
  
  const simpleAppPath = 'client/src/SimpleApp.tsx';
  if (!fs.existsSync(simpleAppPath)) {
    console.log('❌ SimpleApp.tsx 파일을 찾을 수 없습니다.');
    return;
  }
  
  const content = fs.readFileSync(simpleAppPath, 'utf-8');
  
  const routes = [
    '/trainers',
    '/trainers/:id', 
    '/courses',
    '/courses/:id',
    '/community',
    '/community/post/:id',
    '/events',
    '/events/:id',
    '/shop',
    '/shop/product/:id'
  ];
  
  routes.forEach(route => {
    const routePattern = route.replace(':id', '[^/]+');
    const hasRoute = new RegExp(`path="${routePattern}"`).test(content) || 
                     new RegExp(`path='${routePattern}'`).test(content);
    
    console.log(`  ${hasRoute ? '✅' : '❌'} ${route}`);
  });
}

// 컴포넌트 클릭 핸들러 체크
function checkComponentHandlers() {
  console.log('\n🎯 컴포넌트 클릭 핸들러 체크:');
  
  Object.entries(componentClickHandlers).forEach(([componentFile, handlers]) => {
    const filePath = `client/src/components/${componentFile}`;
    console.log(`\n📦 ${componentFile}:`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`  ❌ 파일 없음: ${filePath}`);
      return;
    }
    
    checkClickHandlers(`../components/${componentFile}`, handlers);
  });
}

// 상호작용 기능 체크
function checkInteractionFeatures() {
  console.log('\n⚡ 상호작용 기능 체크:');
  
  const features = [
    {
      name: '검색 기능',
      files: ['Trainers.tsx', 'Courses.tsx', 'Community.tsx', 'events/index.tsx'],
      pattern: /search|Search|setSearchTerm|searchQuery/
    },
    {
      name: '필터 기능', 
      files: ['Trainers.tsx', 'Courses.tsx', 'events/index.tsx'],
      pattern: /filter|Filter|setFilter/
    },
    {
      name: '페이지네이션',
      files: ['Community.tsx', 'events/index.tsx'],
      pattern: /pagination|currentPage|setCurrentPage/
    },
    {
      name: '모달 창',
      files: ['Trainers.tsx', 'Courses.tsx', 'shop/product-detail.tsx'],
      pattern: /Modal|Dialog|setIs.*Open/
    }
  ];
  
  features.forEach(feature => {
    console.log(`\n🔧 ${feature.name}:`);
    let foundCount = 0;
    
    feature.files.forEach(file => {
      const filePath = `client/src/pages/${file}`;
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const hasFeature = feature.pattern.test(content);
        
        console.log(`    ${hasFeature ? '✅' : '❌'} ${file}`);
        if (hasFeature) foundCount++;
      } else {
        console.log(`    ❌ ${file} (파일 없음)`);
      }
    });
    
    console.log(`    총 ${foundCount}/${feature.files.length}개 파일에서 구현됨`);
  });
}

// 에러 처리 체크
function checkErrorHandling() {
  console.log('\n🚨 에러 처리 체크:');
  
  const errorPatterns = [
    'try.*catch',
    'catch.*error',
    'error.*state',
    'isLoading',
    'loading.*true',
    'error.*message'
  ];
  
  Object.keys(pageClickHandlers).forEach(file => {
    const filePath = `client/src/pages/${file}`;
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      let errorHandlingCount = 0;
      errorPatterns.forEach(pattern => {
        if (new RegExp(pattern, 'i').test(content)) {
          errorHandlingCount++;
        }
      });
      
      const hasGoodErrorHandling = errorHandlingCount >= 2;
      console.log(`  ${hasGoodErrorHandling ? '✅' : '⚠️'} ${file} (${errorHandlingCount}/6 패턴)`);
    }
  });
}

// 메인 실행
async function main() {
  console.log('🚀 클릭 핸들러 체크 시작\n');
  
  let totalFound = 0;
  let totalExpected = 0;
  
  // 페이지별 클릭 핸들러 체크
  console.log('📋 페이지별 클릭 핸들러 체크:');
  Object.entries(pageClickHandlers).forEach(([file, config]) => {
    const result = checkClickHandlers(file, config.handlers);
    totalFound += result.found;
    totalExpected += config.handlers.length;
    console.log('');
  });
  
  // 컴포넌트 클릭 핸들러 체크
  checkComponentHandlers();
  
  // 상세 페이지 연결 체크
  checkDetailPageConnections();
  
  // API 연결 체크
  checkAPIConnections();
  
  // 라우팅 체크
  checkRouting();
  
  // 상호작용 기능 체크
  checkInteractionFeatures();
  
  // 에러 처리 체크
  checkErrorHandling();
  
  // 요약
  console.log('\n📊 체크 결과 요약:');
  console.log(`- 클릭 핸들러: ${totalFound}/${totalExpected}개 구현됨 (${Math.round(totalFound/totalExpected*100)}%)`);
  
  if (totalFound === totalExpected) {
    console.log('✅ 모든 클릭 핸들러가 구현되어 있습니다!');
  } else {
    console.log('⚠️ 일부 클릭 핸들러가 누락되어 있습니다.');
  }
  
  console.log('\n💡 권장사항:');
  console.log('1. 누락된 클릭 핸들러 구현');
  console.log('2. 에러 처리 로직 강화');
  console.log('3. 로딩 상태 표시 개선');
  console.log('4. 사용자 피드백 메시지 추가');
}

main().catch(console.error);
