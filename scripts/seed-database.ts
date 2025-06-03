import { db } from '../server/db';
import * as schema from '../shared/schema';

async function seedDatabase() {
  try {
    console.log('🌱 데이터베이스 시드 데이터 생성 시작...');

    // 기본 사용자 생성
    const users = await db.insert(schema.users).values([
      {
        name: '관리자',
        email: 'admin@talez.com',
        password: 'hashed_password_here',
        role: 'admin',
        phone: '010-0000-0000',
        isEmailVerified: true,
        isActive: true
      },
      {
        name: '테스트 훈련사',
        email: 'trainer@talez.com',
        password: 'hashed_password_here',
        role: 'trainer',
        phone: '010-1111-1111',
        isEmailVerified: true,
        isActive: true
      },
      {
        name: '테스트 반려인',
        email: 'owner@talez.com',
        password: 'hashed_password_here',
        role: 'pet-owner',
        phone: '010-2222-2222',
        isEmailVerified: true,
        isActive: true
      }
    ]).returning();

    console.log('✅ 기본 사용자 생성 완료');

    // 기본 반려동물 생성
    const pets = await db.insert(schema.pets).values([
      {
        name: '멍멍이',
        species: 'dog',
        breed: '골든 리트리버',
        age: 3,
        gender: 'male',
        weight: 25.5,
        color: '골든',
        personality: '활발하고 친근함',
        ownerId: users[2].id,
        isActive: true
      },
      {
        name: '야옹이',
        species: 'cat',
        breed: '코숏',
        age: 2,
        gender: 'female',
        weight: 4.2,
        color: '검정',
        personality: '조용하고 독립적',
        ownerId: users[2].id,
        isActive: true
      }
    ]).returning();

    console.log('✅ 기본 반려동물 생성 완료');

    // 커뮤니티 게시글 생성
    const posts = await db.insert(schema.posts).values([
      {
        title: '강아지 산책 팁 공유',
        content: '강아지와 즐거운 산책을 위한 유용한 팁들을 공유합니다...',
        category: 'tips',
        tags: ['산책', '강아지', '팁'],
        authorId: users[1].id,
        views: 125,
        likes: 15,
        isPublished: true
      },
      {
        title: '고양이 놀아주기 방법',
        content: '고양이와 함께 할 수 있는 다양한 놀이 방법들...',
        category: 'tips',
        tags: ['고양이', '놀이', '케어'],
        authorId: users[1].id,
        views: 89,
        likes: 12,
        isPublished: true
      },
      {
        title: '반려동물 건강 관리',
        content: '반려동물의 건강을 지키는 기본적인 관리 방법들...',
        category: 'health',
        tags: ['건강', '관리', '예방'],
        authorId: users[1].id,
        views: 203,
        likes: 28,
        isPublished: true
      }
    ]).returning();

    console.log('✅ 커뮤니티 게시글 생성 완료');

    // 쇼핑몰 카테고리 생성
    const categories = await db.insert(schema.shopCategories).values([
      {
        name: '강아지 사료',
        description: '강아지를 위한 다양한 사료',
        isActive: true
      },
      {
        name: '고양이 사료',
        description: '고양이를 위한 다양한 사료',
        isActive: true
      },
      {
        name: '장난감',
        description: '반려동물 장난감',
        isActive: true
      },
      {
        name: '용품',
        description: '반려동물 생활용품',
        isActive: true
      }
    ]).returning();

    console.log('✅ 쇼핑몰 카테고리 생성 완료');

    // 상품 생성
    await db.insert(schema.products).values([
      {
        name: '프리미엄 강아지 사료 2kg',
        description: '영양 균형이 잡힌 프리미엄 강아지 사료입니다.',
        price: 35000,
        categoryId: categories[0].id,
        images: ['/images/dog-food-1.jpg'],
        tags: ['사료', '강아지', '프리미엄'],
        stock: 50,
        isActive: true,
        rating: 450,
        reviewCount: 23
      },
      {
        name: '고양이 장난감 세트',
        description: '고양이가 좋아하는 다양한 장난감 세트',
        price: 15000,
        categoryId: categories[2].id,
        images: ['/images/cat-toys-1.jpg'],
        tags: ['장난감', '고양이', '세트'],
        stock: 30,
        isActive: true,
        rating: 420,
        reviewCount: 15
      }
    ]);

    console.log('✅ 상품 생성 완료');

    console.log('🎉 데이터베이스 시드 데이터 생성 완료!');
  } catch (error) {
    console.error('❌ 시드 데이터 생성 실패:', error);
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