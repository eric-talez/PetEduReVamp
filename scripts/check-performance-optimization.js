
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('⚡ 성능 최적화 (캐싱, 압축) 체크');
console.log('='.repeat(50));

function checkPerformanceOptimization() {
  const results = {
    caching: { enabled: false, details: [] },
    compression: { enabled: false, details: [] },
    bundleOptimization: { enabled: false, details: [] },
    imageOptimization: { enabled: false, details: [] },
    score: 0
  };

  // 1. 캐싱 설정 체크
  console.log('\n🗄️  캐싱 설정 체크:');
  
  // Express 캐싱 체크
  const serverIndexPath = 'server/index.ts';
  if (fs.existsSync(serverIndexPath)) {
    const serverContent = fs.readFileSync(serverIndexPath, 'utf8');
    
    if (serverContent.includes('cache-control') || serverContent.includes('etag')) {
      results.caching.enabled = true;
      results.caching.details.push('✅ Express 헤더 캐싱 설정됨');
      console.log('  ✅ Express 헤더 캐싱 설정됨');
    } else {
      results.caching.details.push('❌ Express 헤더 캐싱 미설정');
      console.log('  ❌ Express 헤더 캐싱 미설정');
    }

    if (serverContent.includes('redis') || serverContent.includes('memcached')) {
      results.caching.details.push('✅ 메모리 캐싱 시스템 사용');
      console.log('  ✅ 메모리 캐싱 시스템 사용');
    } else {
      results.caching.details.push('❌ 메모리 캐싱 시스템 미사용');
      console.log('  ❌ 메모리 캐싱 시스템 미사용');
    }
  }

  // 브라우저 캐싱 체크
  const viteConfigPath = 'vite.config.ts';
  if (fs.existsSync(viteConfigPath)) {
    const viteContent = fs.readFileSync(viteConfigPath, 'utf8');
    if (viteContent.includes('rollupOptions')) {
      results.caching.details.push('✅ 번들 캐싱 최적화 설정됨');
      console.log('  ✅ 번들 캐싱 최적화 설정됨');
    } else {
      results.caching.details.push('❌ 번들 캐싱 최적화 미설정');
      console.log('  ❌ 번들 캐싱 최적화 미설정');
    }
  }

  // 2. 압축 설정 체크
  console.log('\n📦 압축 설정 체크:');
  
  if (fs.existsSync(serverIndexPath)) {
    const serverContent = fs.readFileSync(serverIndexPath, 'utf8');
    
    if (serverContent.includes('compression') || serverContent.includes('gzip')) {
      results.compression.enabled = true;
      results.compression.details.push('✅ gzip 압축 활성화됨');
      console.log('  ✅ gzip 압축 활성화됨');
    } else {
      results.compression.details.push('❌ gzip 압축 미활성화');
      console.log('  ❌ gzip 압축 미활성화');
    }

    if (serverContent.includes('brotli')) {
      results.compression.details.push('✅ Brotli 압축 활성화됨');
      console.log('  ✅ Brotli 압축 활성화됨');
    } else {
      results.compression.details.push('❌ Brotli 압축 미활성화');
      console.log('  ❌ Brotli 압축 미활성화');
    }
  }

  // 3. 번들 최적화 체크
  console.log('\n📦 번들 최적화 체크:');
  
  const packageJsonPath = 'package.json';
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (packageJson.scripts && packageJson.scripts.build) {
      results.bundleOptimization.enabled = true;
      results.bundleOptimization.details.push('✅ 빌드 스크립트 설정됨');
      console.log('  ✅ 빌드 스크립트 설정됨');
    } else {
      results.bundleOptimization.details.push('❌ 빌드 스크립트 미설정');
      console.log('  ❌ 빌드 스크립트 미설정');
    }

    // Tree shaking 체크
    if (fs.existsSync(viteConfigPath)) {
      const viteContent = fs.readFileSync(viteConfigPath, 'utf8');
      if (viteContent.includes('treeshake') || viteContent.includes('sideEffects')) {
        results.bundleOptimization.details.push('✅ Tree shaking 활성화됨');
        console.log('  ✅ Tree shaking 활성화됨');
      } else {
        results.bundleOptimization.details.push('❌ Tree shaking 미활성화');
        console.log('  ❌ Tree shaking 미활성화');
      }
    }
  }

  // 4. 이미지 최적화 체크
  console.log('\n🖼️  이미지 최적화 체크:');
  
  const imageComponentPath = 'client/src/components/OptimizedImage.tsx';
  if (fs.existsSync(imageComponentPath)) {
    results.imageOptimization.enabled = true;
    results.imageOptimization.details.push('✅ 최적화된 이미지 컴포넌트 사용');
    console.log('  ✅ 최적화된 이미지 컴포넌트 사용');
  } else {
    results.imageOptimization.details.push('❌ 이미지 최적화 컴포넌트 미사용');
    console.log('  ❌ 이미지 최적화 컴포넌트 미사용');
  }

  // WebP 지원 체크
  const imagesDir = 'public/images';
  if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir, { recursive: true });
    const webpFiles = files.filter(file => file.toString().endsWith('.webp'));
    if (webpFiles.length > 0) {
      results.imageOptimization.details.push('✅ WebP 포맷 이미지 사용');
      console.log('  ✅ WebP 포맷 이미지 사용');
    } else {
      results.imageOptimization.details.push('❌ WebP 포맷 이미지 미사용');
      console.log('  ❌ WebP 포맷 이미지 미사용');
    }
  }

  // 성능 점수 계산
  let score = 0;
  if (results.caching.enabled) score += 25;
  if (results.compression.enabled) score += 25;
  if (results.bundleOptimization.enabled) score += 25;
  if (results.imageOptimization.enabled) score += 25;
  
  results.score = score;

  console.log('\n📊 성능 최적화 요약:');
  console.log(`  🗄️  캐싱: ${results.caching.enabled ? '✅' : '❌'}`);
  console.log(`  📦 압축: ${results.compression.enabled ? '✅' : '❌'}`);
  console.log(`  📦 번들 최적화: ${results.bundleOptimization.enabled ? '✅' : '❌'}`);
  console.log(`  🖼️  이미지 최적화: ${results.imageOptimization.enabled ? '✅' : '❌'}`);
  console.log(`  🎯 성능 점수: ${results.score}/100`);

  if (results.score < 50) {
    console.log('\n⚠️  성능 개선 필요: 캐싱과 압축 설정을 우선 적용하세요.');
  } else if (results.score < 75) {
    console.log('\n🔧 성능 양호: 추가 최적화로 더 향상시킬 수 있습니다.');
  } else {
    console.log('\n🎉 성능 우수: 최적화가 잘 되어 있습니다.');
  }

  return results;
}

checkPerformanceOptimization();
