
import { db } from '../server/db';
import * as schema from '../shared/schema';

async function seedDatabase() {
  try {
    console.log('🌱 운영 환경용 데이터베이스 초기화 시작...');

    // 기존 데이터 정리 (개발용 데이터 삭제)
    console.log('🧹 기존 데이터 정리 중...');
    
    // 기본 관리자 계정 생성 (운영용)
    const users = await db.insert(schema.users).values([
      {
        name: '시스템 관리자',
        email: 'admin@talez.co.kr',
        password: 'hashed_password_here', // 실제 운영시 변경 필요
        role: 'admin',
        phone: '02-0000-0000',
        isEmailVerified: true,
        isActive: true
      }
    ]).returning();

    console.log('✅ 관리자 계정 생성 완료');

    // 기본 기관 생성 (샘플)
    const institutes = await db.insert(schema.institutes).values([
      {
        name: '테일즈 본사',
        code: 'TALEZ_HQ',
        address: '서울시 강남구',
        phone: '02-1234-5678',
        email: 'contact@talez.co.kr',
        description: '테일즈 서비스 본사',
        isActive: true,
        businessNumber: '123-45-67890',
        capacity: 100
      }
    ]).returning();

    console.log('✅ 기본 기관 생성 완료');

    // 기본 쇼핑몰 카테고리 생성
    const categories = await db.insert(schema.shopCategories).values([
      {
        name: '반려동물 사료',
        description: '반려동물을 위한 건강한 사료',
        isActive: true
      }
    ]).returning();

    console.log('✅ 기본 쇼핑몰 카테고리 생성 완료');

    // 기본 상품 생성 (샘플)
    await db.insert(schema.products).values([
      {
        name: '프리미엄 반려동물 사료',
        description: '영양 균형이 잡힌 프리미엄 사료입니다.',
        price: 50000,
        categoryId: categories[0].id,
        images: ['/images/sample-food.jpg'],
        tags: ['사료', '프리미엄', '건강'],
        stock: 100,
        isActive: true,
        rating: 450,
        reviewCount: 1
      }
    ]);

    console.log('✅ 기본 상품 생성 완료');

    // 기본 커뮤니티 게시글 생성 (샘플)
    const posts = await db.insert(schema.posts).values([
      {
        title: '테일즈 서비스 이용 안내',
        content: '테일즈 서비스에 오신 것을 환영합니다. 이 게시글은 샘플 게시글입니다.',
        category: 'notice',
        tags: ['공지', '안내'],
        authorId: users[0].id,
        views: 1,
        likes: 0,
        isPublished: true
      }
    ]).returning();

    console.log('✅ 기본 게시글 생성 완료');

    // 기본 배너 생성 (샘플)
    await db.insert(schema.banners).values([
      {
        title: '테일즈 서비스 오픈',
        description: '반려동물 교육 플랫폼 테일즈에 오신 것을 환영합니다',
        imageUrl: '/images/welcome-banner.jpg',
        altText: '테일즈 서비스 환영 배너',
        linkUrl: '/',
        type: 'main',
        position: 'hero',
        orderIndex: 1,
        status: 'active',
        isActive: true,
        createdBy: users[0].id
      }
    ]);

    console.log('✅ 기본 배너 생성 완료');

    // 기본 이벤트 생성 (샘플)
    await db.insert(schema.events).values([
      {
        title: '테일즈 서비스 론칭 이벤트',
        description: '테일즈 서비스 오픈을 기념하는 특별 이벤트입니다.',
        category: 'promotion',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후
        location: '온라인',
        maxParticipants: 100,
        currentParticipants: 0,
        price: 0,
        imageUrl: '/images/launch-event.jpg',
        organizerId: users[0].id,
        isActive: true
      }
    ]);

    console.log('✅ 기본 이벤트 생성 완료');

    // 기본 수수료 정책 생성
    await db.insert(schema.commissionPolicies).values([
      {
        name: '기본 수수료 정책',
        description: '표준 수수료 정책입니다.',
        rate: 1000, // 10%
        minAmount: 0,
        isActive: true
      }
    ]);

    console.log('✅ 기본 수수료 정책 생성 완료');

    console.log('🎉 운영 환경용 데이터베이스 초기화 완료!');
    console.log('📋 생성된 기본 데이터:');
    console.log('   - 관리자 계정: 1개');
    console.log('   - 기관: 1개');
    console.log('   - 상품 카테고리: 1개');
    console.log('   - 상품: 1개');
    console.log('   - 게시글: 1개');
    console.log('   - 배너: 1개');
    console.log('   - 이벤트: 1개');
    console.log('   - 수수료 정책: 1개');
    console.log('');
    console.log('⚠️  주의사항:');
    console.log('   - 관리자 비밀번호를 반드시 변경하세요');
    console.log('   - 기관 정보를 실제 정보로 업데이트하세요');
    console.log('   - 배너 이미지 경로를 실제 이미지로 교체하세요');

  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error);
    throw error;
  }
}

// 스크립트가 직접 실행될 때만 실행
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default seedDatabase;
