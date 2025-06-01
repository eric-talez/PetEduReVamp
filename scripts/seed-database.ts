import { db } from "../server/db";
import { 
  events, eventLocations, 
  courses, 
  commissionPolicies, commissionTransactions, settlementReports,
  shopCategories, products,
  institutes, users
} from "../shared/schema";

async function seedDatabase() {
  console.log("🌱 데이터베이스 시드 데이터 생성 시작...");

  try {
    // 1. 이벤트 위치 생성
    console.log("📍 이벤트 위치 데이터 생성 중...");
    const eventLocationData = [
      {
        name: "서울 반려동물 종합센터",
        address: "서울특별시 강남구 테헤란로 123",
        latitude: "37.5665",
        longitude: "126.9780",
        capacity: 200
      },
      {
        name: "부산 펫케어 교육원",
        address: "부산광역시 해운대구 해운대로 456",
        latitude: "35.1796",
        longitude: "129.0756",
        capacity: 150
      },
      {
        name: "대구 반려동물 문화센터",
        address: "대구광역시 중구 중앙대로 789",
        latitude: "35.8714",
        longitude: "128.6014",
        capacity: 100
      }
    ];

    const createdLocations = await db.insert(eventLocations).values(eventLocationData).returning();

    // 2. 이벤트 생성
    console.log("🎉 이벤트 데이터 생성 중...");
    const eventData = [
      {
        title: "반려견 응급처치 교육",
        description: "반려견에게 응급상황 발생 시 대처 방법을 배우는 실습 중심의 교육입니다.",
        category: "교육",
        date: new Date("2025-06-15T10:00:00Z"),
        location: createdLocations[0].address,
        maxParticipants: 50,
        currentParticipants: 23,
        price: 50000,
        imageUrl: "/images/events/emergency-care.jpg",
        organizerId: 1
      },
      {
        title: "반려동물 행동교정 세미나",
        description: "문제행동을 보이는 반려동물의 행동교정 방법을 전문가와 함께 알아봅니다.",
        category: "세미나",
        date: new Date("2025-06-20T14:00:00Z"),
        location: createdLocations[1].address,
        maxParticipants: 80,
        currentParticipants: 45,
        price: 30000,
        imageUrl: "/images/events/behavior-training.jpg",
        organizerId: 1
      },
      {
        title: "펫 그루밍 체험 워크샵",
        description: "집에서 할 수 있는 기본 그루밍 기법을 배우는 실습 워크샵입니다.",
        category: "워크샵",
        date: new Date("2025-06-25T13:00:00Z"),
        location: createdLocations[2].address,
        maxParticipants: 30,
        currentParticipants: 18,
        price: 75000,
        imageUrl: "/images/events/grooming-workshop.jpg",
        organizerId: 1
      },
      {
        title: "반려동물 영양관리 특강",
        description: "연령별, 품종별 맞춤 영양관리 방법을 수의사와 함께 배웁니다.",
        category: "특강",
        date: new Date("2025-07-05T15:00:00Z"),
        location: createdLocations[0].address,
        maxParticipants: 60,
        currentParticipants: 31,
        price: 40000,
        imageUrl: "/images/events/nutrition-seminar.jpg",
        organizerId: 1
      }
    ];

    await db.insert(events).values(eventData);

    // 3. 교육기관 생성
    console.log("🏢 교육기관 데이터 생성 중...");
    const instituteData = [
      {
        name: "한국반려동물교육원",
        code: "KPEI001",
        address: "서울특별시 서초구 서초대로 77길 42",
        phone: "02-1234-5678",
        email: "info@kpei.co.kr",
        website: "https://kpei.co.kr",
        description: "반려동물 전문 교육기관으로 다양한 인증 과정을 제공합니다.",
        logo: "/images/institutes/kpei-logo.png"
      },
      {
        name: "펫케어아카데미",
        code: "PCA002",
        address: "경기도 성남시 분당구 정자일로 95",
        phone: "031-987-6543",
        email: "contact@petcare-academy.com",
        website: "https://petcare-academy.com",
        description: "실무 중심의 펫케어 전문가 양성 교육기관입니다.",
        logo: "/images/institutes/pca-logo.png"
      }
    ];

    await db.insert(institutes).values(instituteData);

    // 4. 강좌 생성
    console.log("📚 강좌 데이터 생성 중...");
    const courseData = [
      {
        title: "반려동물 행동분석사 과정",
        description: "반려동물의 행동을 과학적으로 분석하고 문제행동을 교정하는 전문가 과정입니다.",
        image: "/images/courses/behavior-analyst.jpg",
        category: "자격증",
        level: "중급",
        duration: 120,
        price: 850000,
        trainerId: 1,
        instituteId: 1,
        isPopular: true,
        isCertified: true
      },
      {
        title: "펫 그루밍 전문가 과정",
        description: "전문적인 펫 그루밍 기술을 습득하여 그루머로 활동할 수 있는 실무 과정입니다.",
        image: "/images/courses/grooming-expert.jpg",
        category: "기술",
        level: "초급",
        duration: 80,
        price: 650000,
        trainerId: 1,
        instituteId: 2,
        isPopular: false,
        isCertified: true
      },
      {
        title: "반려동물 영양사 자격과정",
        description: "반려동물의 영양 요구량을 분석하고 맞춤 식단을 제공하는 전문가 과정입니다.",
        image: "/images/courses/nutrition-specialist.jpg",
        category: "자격증",
        level: "고급",
        duration: 100,
        price: 750000,
        trainerId: 1,
        instituteId: 1,
        isPopular: true,
        isCertified: true
      }
    ];

    await db.insert(courses).values(courseData);

    // 5. 쇼핑몰 카테고리 생성
    console.log("🛍️ 쇼핑몰 카테고리 데이터 생성 중...");
    const categoryData = [
      {
        name: "사료/간식",
        description: "건강한 반려동물을 위한 프리미엄 사료와 영양간식",
        imageUrl: "/images/categories/food-treats.jpg",
        sortOrder: 1
      },
      {
        name: "장난감/용품",
        description: "안전하고 재미있는 반려동물 장난감과 생활용품",
        imageUrl: "/images/categories/toys-supplies.jpg",
        sortOrder: 2
      },
      {
        name: "건강/위생",
        description: "반려동물의 건강관리와 위생을 위한 전문 제품",
        imageUrl: "/images/categories/health-hygiene.jpg",
        sortOrder: 3
      },
      {
        name: "패션/액세서리",
        description: "스타일리시하고 실용적인 반려동물 패션 아이템",
        imageUrl: "/images/categories/fashion-accessories.jpg",
        sortOrder: 4
      }
    ];

    const createdCategories = await db.insert(shopCategories).values(categoryData).returning();

    // 6. 상품 생성
    console.log("🎁 상품 데이터 생성 중...");
    const productData = [
      {
        name: "프리미엄 연어 사료 (3kg)",
        description: "신선한 연어를 주원료로 한 고단백 프리미엄 사료입니다. 오메가-3가 풍부하여 털 건강에 도움을 줍니다.",
        price: 45000,
        discountPrice: 39000,
        categoryId: createdCategories[0].id,
        images: ["/images/products/salmon-food-1.jpg", "/images/products/salmon-food-2.jpg"],
        tags: ["프리미엄", "연어", "고단백", "오메가3"],
        stock: 150,
        rating: 470,
        reviewCount: 234
      },
      {
        name: "천연 덴탈 껌 (대용량)",
        description: "치아 건강을 위한 100% 천연 원료 덴탈 껌입니다. 치석 제거와 구강 건강에 효과적입니다.",
        price: 28000,
        categoryId: createdCategories[0].id,
        images: ["/images/products/dental-chew-1.jpg"],
        tags: ["천연", "덴탈케어", "치석제거", "구강건강"],
        stock: 89,
        rating: 450,
        reviewCount: 187
      },
      {
        name: "인터랙티브 퍼즐 장난감",
        description: "지능 발달을 돕는 퍼즐 형태의 장난감입니다. 간식을 숨겨두고 찾는 재미로 스트레스 해소에 도움됩니다.",
        price: 32000,
        discountPrice: 27000,
        categoryId: createdCategories[1].id,
        images: ["/images/products/puzzle-toy-1.jpg", "/images/products/puzzle-toy-2.jpg"],
        tags: ["지능발달", "퍼즐", "스트레스해소", "인터랙티브"],
        stock: 67,
        rating: 480,
        reviewCount: 92
      },
      {
        name: "프로바이오틱스 영양제",
        description: "장 건강을 위한 반려동물 전용 프로바이오틱스입니다. 면역력 향상과 소화 개선에 도움됩니다.",
        price: 55000,
        categoryId: createdCategories[2].id,
        images: ["/images/products/probiotics-1.jpg"],
        tags: ["프로바이오틱스", "장건강", "면역력", "영양제"],
        stock: 43,
        rating: 460,
        reviewCount: 156
      },
      {
        name: "방수 레인코트 (M사이즈)",
        description: "비오는 날 산책을 위한 방수 레인코트입니다. 통기성이 좋고 착용이 편리합니다.",
        price: 38000,
        discountPrice: 32000,
        categoryId: createdCategories[3].id,
        images: ["/images/products/raincoat-1.jpg", "/images/products/raincoat-2.jpg"],
        tags: ["방수", "레인코트", "산책용", "통기성"],
        stock: 75,
        rating: 440,
        reviewCount: 68
      }
    ];

    await db.insert(products).values(productData);

    // 7. 수수료 정책 생성
    console.log("💰 수수료 정책 데이터 생성 중...");
    const commissionPolicyData = [
      {
        name: "기본 강좌 수수료",
        description: "일반 강좌에 적용되는 기본 수수료 정책",
        rate: 1500, // 15%
        minAmount: 10000,
        maxAmount: 500000
      },
      {
        name: "프리미엄 강좌 수수료",
        description: "프리미엄 강좌에 적용되는 수수료 정책",
        rate: 2000, // 20%
        minAmount: 50000,
        maxAmount: 1000000
      }
    ];

    await db.insert(commissionPolicies).values(commissionPolicyData);

    // 8. 수수료 거래 내역 생성
    console.log("📊 수수료 거래 데이터 생성 중...");
    const transactionData = [
      {
        orderId: "ORD-2025-001",
        amount: 850000,
        commissionRate: 1500,
        commissionAmount: 127500,
        status: "completed",
        userId: 1
      },
      {
        orderId: "ORD-2025-002",
        amount: 650000,
        commissionRate: 1500,
        commissionAmount: 97500,
        status: "pending",
        userId: 1
      }
    ];

    await db.insert(commissionTransactions).values(transactionData);

    // 9. 정산 보고서 생성
    console.log("📈 정산 보고서 데이터 생성 중...");
    const settlementData = [
      {
        period: "2025-05",
        totalRevenue: 1500000,
        totalCommission: 225000,
        netAmount: 1275000,
        status: "approved"
      }
    ];

    await db.insert(settlementReports).values(settlementData);

    console.log("✅ 모든 시드 데이터 생성 완료!");
    console.log("📊 생성된 데이터:");
    console.log(`   - 이벤트 위치: ${eventLocationData.length}개`);
    console.log(`   - 이벤트: ${eventData.length}개`);
    console.log(`   - 교육기관: ${instituteData.length}개`);
    console.log(`   - 강좌: ${courseData.length}개`);
    console.log(`   - 상품 카테고리: ${categoryData.length}개`);
    console.log(`   - 상품: ${productData.length}개`);
    console.log(`   - 수수료 정책: ${commissionPolicyData.length}개`);
    console.log(`   - 거래 내역: ${transactionData.length}개`);
    console.log(`   - 정산 보고서: ${settlementData.length}개`);

  } catch (error) {
    console.error("❌ 시드 데이터 생성 중 오류 발생:", error);
    throw error;
  }
}

// 스크립트 실행
seedDatabase()
  .then(() => {
    console.log("🎉 데이터베이스 시드 완료!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 시드 실행 실패:", error);
    process.exit(1);
  });

export { seedDatabase };