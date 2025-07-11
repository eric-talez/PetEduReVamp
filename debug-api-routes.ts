import { db } from './server/db';
import { products, shopCategories } from './shared/schema';
import { eq } from 'drizzle-orm';

// 데이터베이스 연결 및 상품 데이터 직접 조회 테스트
async function testDatabaseConnection() {
  console.log('🔍 데이터베이스 연결 테스트 시작...');
  
  try {
    console.log('🔧 PostgreSQL 연결 설정');
    
    // 상품 데이터 조회
    const products_result = await db.select().from(products).limit(5);
    console.log('✅ 상품 데이터 조회 성공:', products_result.length, '개');
    
    products_result.forEach((product, index) => {
      console.log(`📦 상품 ${index + 1}:`, {
        id: product.id,
        name: product.name,
        price: product.price,
        is_active: product.is_active
      });
    });
    
    // 카테고리 데이터 조회
    const categories_result = await db.select().from(shopCategories).limit(5);
    console.log('✅ 카테고리 데이터 조회 성공:', categories_result.length, '개');
    
    categories_result.forEach((category, index) => {
      console.log(`📂 카테고리 ${index + 1}:`, {
        id: category.id,
        name: category.name
      });
    });
    
    // 활성 상품만 조회
    const active_products = await db.select().from(products).where(eq(products.is_active, true));
    console.log('✅ 활성 상품 조회 성공:', active_products.length, '개');
    
    return {
      success: true,
      productCount: products_result.length,
      categoryCount: categories_result.length,
      activeProductCount: active_products.length,
      sampleProduct: products_result[0] || null
    };
    
  } catch (error) {
    console.error('❌ 데이터베이스 연결 오류:', error);
    return {
      success: false,
      error: error.message,
      stack: error.stack
    };
  }
}

// 직접 실행
testDatabaseConnection().then(result => {
  console.log('\n🎯 최종 테스트 결과:');
  console.log(JSON.stringify(result, null, 2));
  
  if (result.success) {
    console.log('\n✅ 데이터베이스 연결 및 상품 데이터 조회 완료');
    console.log('🚀 API 서버 구현 준비 완료');
  } else {
    console.log('\n❌ 데이터베이스 연결 실패');
    console.log('🔧 문제 해결 필요');
  }
}).catch(error => {
  console.error('💥 테스트 실행 중 오류:', error);
});