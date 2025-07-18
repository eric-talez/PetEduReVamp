class Storage {
  users: any[] = [];
  pets: any[] = [];
  courses: any[] = [];
  notifications: any[] = [];
  registrations: any[] = [];
  institutes: any[] = [];
  subscriptionPlans: any[] = [];
  paymentRequests: any[] = [];
  products: any[] = [];
  pricingRules: any[] = [];
  trainingJournals: any[] = [];
  posts: any[] = [];
  coursePurchases: any[] = [];
  courseProgress: any[] = [];
  progressSharing: any[] = [];
  lessonSessions: any[] = [];
  trainerActivityLogs: any[] = [];
  pointSettings: any = {};
  // 대체 훈련사 시스템 데이터 저장소
  substituteClassPosts: any[] = [];
  substituteClassApplications: any[] = [];
  substitutePosts: any[] = [];
  substituteAlerts: any[] = [];
  trainers: any[] = [];
  events: any[] = [
    {
      id: 1,
      name: "멍룡 썸머 뮤직 피크닉",
      location: {
        address: "전북 익산시 왕궁면 왕궁리 산80-1 (왕궁보석테마관광지 가족공원)",
        lat: 35.948611,
        lng: 126.837500
      },
      startDate: "2025-07-12",
      endDate: "2025-07-12",
      time: "오후 7:00 - 10:00",
      description: "반려인과 비반려인이 함께 즐기는 여름밤 문화행사. 보석 십자수, 자개 열쇠고리 만들기, 반려동물 미로 탐험, 어질리티 체험, 멍BTI 테스트 등 다양한 체험 프로그램과 클래식 4중주, 키즈팝 댄스, 버블쇼 등 공연이 펼쳐집니다.",
      category: "지역축제",
      price: "무료",
      attendees: 150,
      maxAttendees: 300,
      organizer: "익산시청",
      status: "완료",
      tags: ["반려동물", "문화체험", "음악회", "펫티켓", "반려동물 친화관광도시"],
      sourceUrl: "https://www.jjan.kr/article/20250712580069",
      thumbnailUrl: "https://tse3.mm.bing.net/th/id/OIP._D4iSsXD0kjWw4hBbdyX5gHaHa?r=0&pid=Api",
      lastUpdated: new Date().toISOString()
    },
    {
      id: 2,
      name: "2025 케이펫페어 마곡",
      location: {
        address: "서울특별시 강서구 마곡중앙로 38 (코엑스 마곡전시장)",
        lat: 37.5635,
        lng: 126.8266
      },
      startDate: "2025-06-13",
      endDate: "2025-06-15",
      time: "오전 10:00 - 오후 6:00",
      description: "아시아 최대 규모의 반려동물 전시회. 최신 펫 트렌드, 제품 체험, 전문가 강연, 반려동물 동반 입장 가능한 다양한 프로그램이 진행됩니다.",
      category: "전시회",
      price: "5000",
      attendees: 12000,
      maxAttendees: 15000,
      organizer: "케이펫페어 조직위원회",
      status: "완료",
      tags: ["전시회", "펫용품", "전문가강연", "트렌드"],
      sourceUrl: "https://www.kpetfair.co.kr/",
      thumbnailUrl: "https://tse3.mm.bing.net/th/id/OIP._D4iSsXD0kjWw4hBbdyX5gHaHa?r=0&pid=Api",
      lastUpdated: new Date().toISOString()
    },
    {
      id: 3,
      name: "한강 반려동물 동반 피크닉",
      location: {
        address: "서울특별시 마포구 망원동 (망원한강공원)",
        lat: 37.5547,
        lng: 126.8967
      },
      startDate: "2025-05-25",
      endDate: "2025-05-25",
      time: "오전 11:00 - 오후 4:00",
      description: "한강에서 펼쳐지는 반려동물과 함께하는 힐링 피크닉. 반려동물 건강 체크, 훈련 체험, 사진 촬영 등 다양한 프로그램이 준비되어 있습니다.",
      category: "자연체험",
      price: "무료",
      attendees: 800,
      maxAttendees: 1000,
      organizer: "서울특별시",
      status: "완료",
      tags: ["한강", "피크닉", "힐링", "건강체크", "훈련체험"],
      sourceUrl: "https://hangang.seoul.go.kr/",
      thumbnailUrl: "https://tse3.mm.bing.net/th/id/OIP._D4iSsXD0kjWw4hBbdyX5gHaHa?r=0&pid=Api",
      lastUpdated: new Date().toISOString()
    },
    {
      id: 4,
      name: "부산 기장 반려동물 문화축제",
      location: {
        address: "부산광역시 기장군 정관읍 정관로 804 (정관 중앙공원)",
        lat: 35.3105,
        lng: 129.2086
      },
      startDate: "2025-06-07",
      endDate: "2025-06-07",
      time: "오전 10:00 - 오후 6:00",
      description: "정관 중앙공원 잔디광장에서 열리는 반려동물 문화축제. 펫푸드·미용체험, 행동교육, 산책예절 교육 등 다양한 프로그램이 진행됩니다.",
      category: "지역축제",
      price: "무료",
      attendees: 2500,
      maxAttendees: 5000,
      organizer: "부산광역시 기장군",
      status: "완료",
      tags: ["문화축제", "펫미용", "행동교육", "산책예절"],
      sourceUrl: "https://www.instagram.com/p/DJ5hYHMS3v_/",
      thumbnailUrl: "https://tse3.mm.bing.net/th/id/OIP._D4iSsXD0kjWw4hBbdyX5gHaHa?r=0&pid=Api",
      lastUpdated: new Date().toISOString()
    },
    {
      id: 5,
      name: "가평 반려동물 문화행사 '활짝펫'",
      location: {
        address: "경기도 가평군 상면 수목원로 432 (가평 수목원)",
        lat: 37.7447,
        lng: 127.3729
      },
      startDate: "2025-05-15",
      endDate: "2025-05-17",
      time: "오전 10:00 - 오후 5:00",
      description: "산책형 문화 행사로 오프리쉬존, 펫게임, 산책, 행동교육, 체험 마켓 등이 포함된 자연 친화적인 반려동물 축제입니다.",
      category: "자연체험",
      price: "무료",
      attendees: 1200,
      maxAttendees: 3000,
      organizer: "가평군",
      status: "완료",
      tags: ["산책", "자연체험", "오프리쉬존", "펫게임", "행동교육"],
      sourceUrl: "https://korean.visitkorea.or.kr/kfes/detail/fstvlDetail.do?fstvlCntntsId=29ce22e7-6d69-40e4-9d74-1c306a339b16",
      thumbnailUrl: "https://tse3.mm.bing.net/th/id/OIP._D4iSsXD0kjWw4hBbdyX5gHaHa?r=0&pid=Api",
      lastUpdated: new Date().toISOString()
    },
    {
      id: 6,
      name: "궁디팡팡 캣페스타",
      location: {
        address: "서울특별시 서초구 강남대로 27 (aT센터)",
        lat: 37.4848,
        lng: 127.0347
      },
      startDate: "2025-06-13",
      endDate: "2025-06-16",
      time: "오전 10:00 - 오후 6:00",
      description: "고양이 전용 축제로 신제품 체험, 굿즈 증정, 포토존, 행동 전문가 강연, 수의사 Q&A 등 고양이 전문 프로그램이 진행됩니다.",
      category: "전시회",
      price: "8000",
      attendees: 5000,
      maxAttendees: 10000,
      organizer: "캣페스타 조직위원회",
      status: "완료",
      tags: ["고양이", "캣페스타", "전시회", "수의사", "행동전문가"],
      sourceUrl: "https://muhwagwalab.tistory.com/entry/2025-양재-박람회-일정·위치·주차-총정리-궁디팡팡-캣페스타-꿀팁",
      thumbnailUrl: "https://tse3.mm.bing.net/th/id/OIP._D4iSsXD0kjWw4hBbdyX5gHaHa?r=0&pid=Api",
      lastUpdated: new Date().toISOString()
    },
    {
      id: 7,
      name: "춘천 반려동물 페스티벌",
      location: {
        address: "강원도 춘천시 서면 박사로 854 (애니메이션 박물관)",
        lat: 37.8813,
        lng: 127.7298
      },
      startDate: "2025-09-25",
      endDate: "2025-09-27",
      time: "오전 10:00 - 오후 6:00",
      description: "강원정보문화산업진흥원 애니메이션 박물관 일대에서 열리는 반려동물 축제. 다양한 체험 프로그램과 교육 세션이 진행됩니다.",
      category: "지역축제",
      price: "무료",
      attendees: 0,
      maxAttendees: 8000,
      organizer: "춘천시 / 강원정보문화산업진흥원",
      status: "예정",
      tags: ["지역축제", "애니메이션", "교육", "체험"],
      sourceUrl: "https://korean.visitkorea.or.kr/kfes/detail/fstvlDetail.do?fstvlCntntsId=eb8683a5-3ca8-4636-8ad1-0d089533bb87",
      thumbnailUrl: "https://tse3.mm.bing.net/th/id/OIP._D4iSsXD0kjWw4hBbdyX5gHaHa?r=0&pid=Api",
      lastUpdated: new Date().toISOString()
    }
  ];

  constructor() {
    console.log('🔄 운영 환경용 메모리 저장소 초기화...');
    this.initializeData();
    this.initializeSubstituteTrainerData();
  }

  private initializeData() {
    // 기본 사용자 데이터
    this.users = [
      { 
        id: 1, 
        name: '관리자', 
        email: 'admin@talez.com', 
        role: 'admin', 
        password: 'admin123',
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      { 
        id: 2, 
        name: '강동훈', 
        email: 'donghoong@wangzzang.com', 
        role: 'trainer', 
        password: 'trainer123',
        isVerified: true,
        certification: '반려동물행동지도사 국가자격증 2급',
        experience: 5,
        specialization: ['기초 훈련', '문제 행동 교정', '사회화 훈련'],
        createdAt: new Date().toISOString()
      },
      { 
        id: 3, 
        name: '테스트 사용자', 
        email: 'test@test.com', 
        role: 'pet-owner', 
        password: 'test123',
        isVerified: true,
        createdAt: new Date().toISOString()
      }
    ];

    // 기본 반려동물 데이터
    this.pets = [
      {
        id: 1,
        name: '맥스',
        species: 'dog',
        breed: '골든리트리버',
        age: 3,
        gender: 'male',
        weight: 25,
        color: '골든',
        personality: '활발하고 친근함',
        medicalHistory: '',
        specialNotes: '',
        imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=max',
        ownerId: 3,
        trainingStatus: 'assigned',
        assignedTrainerId: 2,
        assignedTrainerName: '강동훈',
        trainingType: 'basic',
        notebookEnabled: true,
        trainingStartDate: new Date().toISOString(),
        lastNotebookEntry: '오늘 기초 훈련 진행',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: '루이',
        species: 'dog',
        breed: '시바이누',
        age: 2,
        gender: 'male',
        weight: 15,
        color: '갈색',
        personality: '조용하고 독립적',
        medicalHistory: '',
        specialNotes: '',
        imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=louis',
        ownerId: 3,
        trainingStatus: 'not_assigned',
        assignedTrainerId: null,
        assignedTrainerName: null,
        trainingType: null,
        notebookEnabled: false,
        trainingStartDate: null,
        lastNotebookEntry: null,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // 구독 플랜 데이터 초기화
    this.subscriptionPlans = [
      {
        id: 1,
        name: '스타터 플랜',
        code: 'starter',
        description: '소규모 기관을 위한 기본 플랜',
        price: 150000,
        currency: 'KRW',
        billingPeriod: 'monthly',
        maxMembers: 50,
        maxVideoHours: 10,
        maxAiAnalysis: 50,
        features: {
          basicLMS: true,
          basicVideoConsultation: true,
          basicStatistics: true,
          aiRecommendation: false,
          customBranding: false,
          apiIntegration: false,
          dedicatedSupport: false,
          whiteLabel: false
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: '스탠다드 플랜',
        code: 'standard',
        description: '중간 규모 기관을 위한 고급 플랜',
        price: 300000,
        currency: 'KRW',
        billingPeriod: 'monthly',
        maxMembers: 200,
        maxVideoHours: 30,
        maxAiAnalysis: 100,
        features: {
          basicLMS: true,
          basicVideoConsultation: true,
          basicStatistics: true,
          aiRecommendation: true,
          customBranding: true,
          apiIntegration: false,
          dedicatedSupport: false,
          whiteLabel: false
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        name: '프로페셔널 플랜',
        code: 'professional',
        description: '대규모 기관을 위한 전문 플랜',
        price: 500000,
        currency: 'KRW',
        billingPeriod: 'monthly',
        maxMembers: 500,
        maxVideoHours: -1, // 무제한
        maxAiAnalysis: 200,
        features: {
          basicLMS: true,
          basicVideoConsultation: true,
          basicStatistics: true,
          aiRecommendation: true,
          customBranding: true,
          apiIntegration: true,
          dedicatedSupport: true,
          whiteLabel: false
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        name: '엔터프라이즈 플랜',
        code: 'enterprise',
        description: '대형 기관을 위한 맞춤형 플랜',
        price: 800000,
        currency: 'KRW',
        billingPeriod: 'monthly',
        maxMembers: -1, // 무제한
        maxVideoHours: -1, // 무제한
        maxAiAnalysis: -1, // 무제한
        features: {
          basicLMS: true,
          basicVideoConsultation: true,
          basicStatistics: true,
          aiRecommendation: true,
          customBranding: true,
          apiIntegration: true,
          dedicatedSupport: true,
          whiteLabel: true
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // 기관 데이터 초기화
    this.institutes = [
      {
        id: 1,
        name: '왕짱스쿨',
        code: 'WZS001',
        businessNumber: '123-45-67890',
        address: '경북 구미시 구평동 661',
        phone: '010-4765-1909',
        email: 'donghoong@wangzzang.com',
        directorName: '강동훈',
        directorEmail: 'donghoong@wangzzang.com',
        trainerName: '강동훈',
        trainerId: 2,
        status: 'active',
        isActive: true,
        isVerified: true,
        certification: '반려동물행동지도사 국가자격증 2급',
        establishedDate: '2020-01-01',
        registeredDate: '2024-01-15',
        trainersCount: 1,
        studentsCount: 87,
        coursesCount: 6,
        facilities: ['실내 훈련장', '야외 훈련장', '대기실', '상담실', '애견유치원'],
        // 구독 플랜 정보
        subscriptionPlan: 'standard',
        subscriptionStatus: 'active',
        subscriptionStartDate: new Date().toISOString(),
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        maxMembers: 200,
        maxVideoHours: 30,
        maxAiAnalysis: 100,
        featuresEnabled: {
          basicLMS: true,
          basicVideoConsultation: true,
          basicStatistics: true,
          aiRecommendation: true,
          customBranding: true,
          apiIntegration: false,
          dedicatedSupport: false,
          whiteLabel: false
        },
        operatingHours: '평일 09:00-18:00, 토요일 09:00-18:00, 일요일 휴무',
        description: '국가자격증 훈련부터 반려동물 교감 교육까지! 반려견과 보호자의 "진짜 관계"를 만들어 드리는 전문 교육기관입니다.',
        website: 'https://wangzzang.com',
        specialPrograms: [
          '구미시 2025 미래교육지구 마을학교 "반려꿈터" 운영',
          '정신건강 및 특수교육 대상자를 위한 교감 활동',
          '경북소방본부, 교육기관 대상 강의 및 상담'
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: '서울반려견아카데미',
        businessNumber: '234-56-78901',
        address: '서울시 강남구 테헤란로 123',
        phone: '02-1234-5678',
        email: 'info@seoul-pet-academy.com',
        directorName: '이기관',
        directorEmail: 'lee.institute@example.com',
        status: 'active',
        isVerified: true,
        certification: '교육부 인증',
        establishedDate: '2020-01-15',
        registeredDate: '2024-01-15',
        trainersCount: 8,
        studentsCount: 156,
        coursesCount: 12,
        facilities: ['실내 훈련장', '야외 운동장', '대기실', '상담실'],
        operatingHours: '평일 09:00-18:00, 주말 10:00-17:00',
        description: '전문 반려견 교육 및 훈련 서비스를 제공하는 종합 교육기관입니다.',
        subscriptionPlan: 'professional',
        subscriptionStatus: 'active',
        subscriptionStartDate: new Date().toISOString(),
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        maxMembers: 500,
        maxVideoHours: 100,
        maxAiAnalysis: 300,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: '부산펫트레이닝센터',
        businessNumber: '345-67-89012',
        address: '부산시 해운대구 해운대로 456',
        phone: '051-2345-6789',
        email: 'info@busan-pet-center.com',
        directorName: '박기관',
        directorEmail: 'park.institute@example.com',
        status: 'pending',
        isVerified: false,
        certification: '신청 중',
        establishedDate: '2023-06-01',
        registeredDate: '2024-02-20',
        trainersCount: 3,
        studentsCount: 45,
        coursesCount: 5,
        facilities: ['실내 훈련장', '놀이터'],
        operatingHours: '평일 10:00-19:00, 토요일 10:00-15:00',
        description: '개인 맞춤형 반려견 훈련 전문 센터입니다.',
        subscriptionPlan: 'starter',
        subscriptionStatus: 'pending',
        subscriptionStartDate: new Date().toISOString(),
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        maxMembers: 50,
        maxVideoHours: 10,
        maxAiAnalysis: 50,
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        name: '대구애견학교',
        businessNumber: '456-78-90123',
        address: '대구시 중구 동성로 789',
        phone: '053-3456-7890',
        email: 'info@daegu-pet-school.com',
        directorName: '최기관',
        directorEmail: 'choi.institute@example.com',
        status: 'suspended',
        isVerified: true,
        certification: '한국애견협회 인증',
        establishedDate: '2019-03-01',
        registeredDate: '2024-01-30',
        trainersCount: 5,
        studentsCount: 89,
        coursesCount: 8,
        facilities: ['실내 훈련장', '야외 운동장', '수영장'],
        operatingHours: '일시 운영 중단',
        description: '체계적인 교육 프로그램으로 유명한 반려견 교육 전문기관입니다.',
        suspendedReason: '시설 보수 공사로 인한 일시 중단',
        subscriptionPlan: 'enterprise',
        subscriptionStatus: 'suspended',
        subscriptionStartDate: new Date().toISOString(),
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        maxMembers: 1000,
        maxVideoHours: 500,
        maxAiAnalysis: 1000,
        createdAt: new Date().toISOString()
      }
    ];
    
    // 훈련 일지 샘플 데이터 - 다양한 훈련사들의 알림장 포함
    this.trainingJournals = [
      // 강동훈 훈련사 (id: 1)
      {
        id: 1,
        trainerId: 1,
        petId: 1,
        trainerName: "강동훈",
        petName: "맥스",
        title: "기본 복종 훈련 1회차",
        content: "오늘은 맥스와 함께 기본적인 앉기, 기다리기 훈련을 진행했습니다. 처음에는 산만했지만 점차 집중력이 향상되었습니다.",
        trainingDate: "2025-01-10",
        status: "sent",
        createdAt: new Date('2025-01-10').toISOString(),
        sentAt: new Date('2025-01-10T18:00:00').toISOString(),
        trainer: { name: "강동훈" },
        pet: { name: "맥스" }
      },
      {
        id: 2,
        trainerId: 1,
        petId: 1,
        trainerName: "강동훈",
        petName: "맥스",
        title: "기본 복종 훈련 2회차",
        content: "앉기 명령에 대한 반응이 좋아졌습니다. 이제 손신호도 함께 병행하여 훈련하고 있습니다.",
        trainingDate: "2025-01-12",
        status: "read",
        createdAt: new Date('2025-01-12').toISOString(),
        sentAt: new Date('2025-01-12T18:30:00').toISOString(),
        readAt: new Date('2025-01-12T20:15:00').toISOString(),
        trainer: { name: "강동훈" },
        pet: { name: "맥스" }
      },
      {
        id: 3,
        trainerId: 1,
        petId: 2,
        trainerName: "강동훈",
        petName: "루나",
        title: "사회화 훈련 1회차",
        content: "루나는 다른 개들과의 만남에 약간 긴장하는 모습을 보였습니다. 천천히 적응할 수 있도록 도와주겠습니다.",
        trainingDate: "2025-01-13",
        status: "draft",
        createdAt: new Date('2025-01-13').toISOString(),
        trainer: { name: "강동훈" },
        pet: { name: "루나" }
      },
      {
        id: 4,
        trainerId: 1,
        petId: 3,
        trainerName: "강동훈",
        petName: "초코",
        title: "문제 행동 교정 1회차",
        content: "짖는 행동에 대한 교정 훈련을 시작했습니다. 원인을 파악하고 단계별로 접근하고 있습니다.",
        trainingDate: "2025-01-14",
        status: "sent",
        createdAt: new Date('2025-01-14').toISOString(),
        sentAt: new Date('2025-01-14T19:00:00').toISOString(),
        trainer: { name: "강동훈" },
        pet: { name: "초코" }
      },
      {
        id: 5,
        trainerId: 1,
        petId: 1,
        trainerName: "강동훈",
        petName: "맥스",
        title: "기본 복종 훈련 3회차",
        content: "맥스가 '엎드려' 명령을 완전히 습득했습니다. 이제 거리를 두고도 명령을 잘 따릅니다.",
        trainingDate: "2025-01-15",
        status: "read",
        createdAt: new Date('2025-01-15').toISOString(),
        sentAt: new Date('2025-01-15T18:45:00').toISOString(),
        readAt: new Date('2025-01-15T21:30:00').toISOString(),
        trainer: { name: "강동훈" },
        pet: { name: "맥스" }
      },
      // 김민수 훈련사 (id: 2)
      {
        id: 6,
        trainerId: 2,
        petId: 2,
        trainerName: "김민수",
        petName: "루나",
        title: "어질리티 훈련 1회차",
        content: "루나의 운동 능력이 뛰어나서 어질리티 훈련을 시작했습니다. 장애물 뛰어넘기에 자신감을 보입니다.",
        trainingDate: "2025-01-11",
        status: "sent",
        createdAt: new Date('2025-01-11').toISOString(),
        sentAt: new Date('2025-01-11T17:30:00').toISOString(),
        trainer: { name: "김민수" },
        pet: { name: "루나" }
      },
      {
        id: 7,
        trainerId: 2,
        petId: 3,
        trainerName: "김민수",
        petName: "초코",
        title: "산책 훈련 1회차",
        content: "초코가 산책 시 당기는 습관을 교정하는 훈련을 했습니다. 조금씩 개선되고 있어요.",
        trainingDate: "2025-01-12",
        status: "read",
        createdAt: new Date('2025-01-12').toISOString(),
        sentAt: new Date('2025-01-12T16:15:00').toISOString(),
        readAt: new Date('2025-01-12T19:45:00').toISOString(),
        trainer: { name: "김민수" },
        pet: { name: "초코" }
      },
      {
        id: 8,
        trainerId: 2,
        petId: 1,
        trainerName: "김민수",
        petName: "맥스",
        title: "고급 복종 훈련 1회차",
        content: "맥스가 기본 훈련을 완료하여 고급 과정으로 진입했습니다. 원거리 명령 훈련을 시작합니다.",
        trainingDate: "2025-01-13",
        status: "sent",
        createdAt: new Date('2025-01-13').toISOString(),
        sentAt: new Date('2025-01-13T17:00:00').toISOString(),
        trainer: { name: "김민수" },
        pet: { name: "맥스" }
      },
      // 박지혜 훈련사 (id: 3)
      {
        id: 9,
        trainerId: 3,
        petId: 2,
        trainerName: "박지혜",
        petName: "루나",
        title: "반응성 훈련 1회차",
        content: "루나가 다른 개에게 과도한 반응을 보이는 문제를 다루고 있습니다. 진전이 보입니다.",
        trainingDate: "2025-01-10",
        status: "read",
        createdAt: new Date('2025-01-10').toISOString(),
        sentAt: new Date('2025-01-10T15:20:00').toISOString(),
        readAt: new Date('2025-01-10T18:10:00').toISOString(),
        trainer: { name: "박지혜" },
        pet: { name: "루나" }
      },
      {
        id: 10,
        trainerId: 3,
        petId: 3,
        trainerName: "박지혜",
        petName: "초코",
        title: "분리불안 훈련 1회차",
        content: "초코의 분리불안 증상을 완화하기 위한 훈련을 시작했습니다. 단계적으로 접근하고 있습니다.",
        trainingDate: "2025-01-14",
        status: "sent",
        createdAt: new Date('2025-01-14').toISOString(),
        sentAt: new Date('2025-01-14T16:45:00').toISOString(),
        trainer: { name: "박지혜" },
        pet: { name: "초코" }
      },
      // 최예린 훈련사 (id: 4)
      {
        id: 11,
        trainerId: 4,
        petId: 1,
        trainerName: "최예린",
        petName: "맥스",
        title: "트릭 훈련 1회차",
        content: "맥스에게 재미있는 트릭들을 가르치고 있습니다. '하이파이브'를 성공적으로 배웠어요!",
        trainingDate: "2025-01-11",
        status: "read",
        createdAt: new Date('2025-01-11').toISOString(),
        sentAt: new Date('2025-01-11T14:30:00').toISOString(),
        readAt: new Date('2025-01-11T20:15:00').toISOString(),
        trainer: { name: "최예린" },
        pet: { name: "맥스" }
      },
      {
        id: 12,
        trainerId: 4,
        petId: 2,
        trainerName: "최예린",
        petName: "루나",
        title: "노즈워크 훈련 1회차",
        content: "루나의 후각 능력을 활용한 노즈워크 훈련을 시작했습니다. 매우 집중력이 좋아요.",
        trainingDate: "2025-01-15",
        status: "draft",
        createdAt: new Date('2025-01-15').toISOString(),
        trainer: { name: "최예린" },
        pet: { name: "루나" }
      },
      // 정수현 훈련사 (id: 5)
      {
        id: 13,
        trainerId: 5,
        petId: 3,
        trainerName: "정수현",
        petName: "초코",
        title: "기본 매너 훈련 1회차",
        content: "초코에게 기본적인 매너를 가르치고 있습니다. 인사법과 차분히 기다리기를 연습했어요.",
        trainingDate: "2025-01-13",
        status: "sent",
        createdAt: new Date('2025-01-13').toISOString(),
        sentAt: new Date('2025-01-13T13:45:00').toISOString(),
        trainer: { name: "정수현" },
        pet: { name: "초코" }
      },
      {
        id: 14,
        trainerId: 5,
        petId: 1,
        trainerName: "정수현",
        petName: "맥스",
        title: "심화 복종 훈련 1회차",
        content: "맥스의 복종 훈련을 한 단계 더 발전시키고 있습니다. 복잡한 명령 조합을 연습하고 있어요.",
        trainingDate: "2025-01-14",
        status: "read",
        createdAt: new Date('2025-01-14').toISOString(),
        sentAt: new Date('2025-01-14T15:20:00').toISOString(),
        readAt: new Date('2025-01-14T17:55:00').toISOString(),
        trainer: { name: "정수현" },
        pet: { name: "맥스" }
      },
      {
        id: 15,
        trainerId: 5,
        petId: 2,
        trainerName: "정수현",
        petName: "루나",
        title: "사회화 심화 훈련 1회차",
        content: "루나의 사회화 능력을 더욱 발전시키기 위해 다양한 환경에서 훈련을 진행했습니다.",
        trainingDate: "2025-01-15",
        status: "sent",
        createdAt: new Date('2025-01-15').toISOString(),
        sentAt: new Date('2025-01-15T14:10:00').toISOString(),
        trainer: { name: "정수현" },
        pet: { name: "루나" }
      }
    ];
    
    // courses data - 커리큘럼 가격 정보 포함
    this.courses = [
      {
        id: 1,
        title: "기초 복종 훈련 완전정복",
        description: "반려견의 기본적인 복종 훈련을 체계적으로 배우는 8주 완성 과정입니다. 앉아, 기다려, 이리와 등 기본 명령어부터 산책 매너까지 완전히 마스터할 수 있습니다.",
        trainerId: 1,
        trainerName: "강동훈",
        duration: 8,
        level: "beginner",
        category: "기초 훈련",
        price: 280000,
        maxStudents: 20,
        currentStudents: 15,
        status: "published",
        enrollmentCount: 15,
        averageRating: 4.7,
        reviewCount: 12,
        modules: [
          {
            id: 1,
            title: "기본 자세 훈련",
            description: "앉아, 엎드려, 일어나 등 기본 자세 명령어 훈련",
            duration: 60,
            isFree: false,
            price: 35000,
            order: 1,
            videoUrl: null,
            materials: []
          },
          {
            id: 2,
            title: "호명 반응 훈련",
            description: "이름 부르기에 대한 반응 향상 훈련",
            duration: 60,
            isFree: false,
            price: 35000,
            order: 2,
            videoUrl: null,
            materials: []
          },
          {
            id: 3,
            title: "기다려 명령 훈련",
            description: "인내심을 기르는 기다려 명령 집중 훈련",
            duration: 60,
            isFree: false,
            price: 35000,
            order: 3,
            videoUrl: null,
            materials: []
          },
          {
            id: 4,
            title: "이리와 명령 훈련",
            description: "안전한 호출 훈련과 즉시 반응 훈련",
            duration: 60,
            isFree: false,
            price: 35000,
            order: 4,
            videoUrl: null,
            materials: []
          },
          {
            id: 5,
            title: "산책 매너 훈련",
            description: "리드줄 당기지 않기와 산책 예절 훈련",
            duration: 60,
            isFree: false,
            price: 35000,
            order: 5,
            videoUrl: null,
            materials: []
          },
          {
            id: 6,
            title: "실외 복종 훈련",
            description: "실외 환경에서의 복종 명령 적용 훈련",
            duration: 60,
            isFree: false,
            price: 35000,
            order: 6,
            videoUrl: null,
            materials: []
          },
          {
            id: 7,
            title: "사회화 기초 훈련",
            description: "다른 개와 사람에 대한 사회화 훈련",
            duration: 60,
            isFree: false,
            price: 35000,
            order: 7,
            videoUrl: null,
            materials: []
          },
          {
            id: 8,
            title: "종합 평가 및 마무리",
            description: "전체 훈련 과정 종합 평가 및 유지 방법",
            duration: 60,
            isFree: false,
            price: 35000,
            order: 8,
            videoUrl: null,
            materials: []
          }
        ],
        createdAt: new Date('2025-01-10').toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: "퍼피 사회화 전문 과정",
        description: "생후 3-6개월 강아지를 위한 사회화 전문 과정입니다. 사람, 동물, 환경에 대한 적응력을 키우고 건강한 성격 형성을 도움니다.",
        trainerId: 2,
        trainerName: "김민수",
        duration: 6,
        level: "beginner",
        category: "사회화",
        price: 320000,
        maxStudents: 15,
        currentStudents: 8,
        status: "published",
        enrollmentCount: 8,
        averageRating: 4.8,
        reviewCount: 6,
        modules: [
          {
            id: 1,
            title: "사회화 기초 이론",
            description: "퍼피 사회화의 중요성과 기본 원리",
            duration: 45,
            isFree: true,
            price: 0,
            order: 1,
            videoUrl: null,
            materials: []
          },
          {
            id: 2,
            title: "사람에 대한 사회화",
            description: "다양한 연령대와 외모의 사람들과 친화력 기르기",
            duration: 60,
            isFree: false,
            price: 53000,
            order: 2,
            videoUrl: null,
            materials: []
          },
          {
            id: 3,
            title: "동물 간 사회화",
            description: "다른 강아지들과의 건전한 상호작용 훈련",
            duration: 60,
            isFree: false,
            price: 53000,
            order: 3,
            videoUrl: null,
            materials: []
          },
          {
            id: 4,
            title: "환경 적응 훈련",
            description: "다양한 소리와 환경에 대한 적응 훈련",
            duration: 60,
            isFree: false,
            price: 53000,
            order: 4,
            videoUrl: null,
            materials: []
          },
          {
            id: 5,
            title: "핸들링 적응 훈련",
            description: "목욕, 미용, 건강 체크 등 핸들링 적응",
            duration: 60,
            isFree: false,
            price: 53000,
            order: 5,
            videoUrl: null,
            materials: []
          },
          {
            id: 6,
            title: "종합 사회화 테스트",
            description: "전체 사회화 과정 평가 및 향후 계획",
            duration: 60,
            isFree: false,
            price: 53000,
            order: 6,
            videoUrl: null,
            materials: []
          }
        ],
        createdAt: new Date('2025-01-08').toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        title: "문제 행동 교정 마스터 클래스",
        description: "짖음, 물기, 분리불안 등 다양한 문제 행동을 체계적으로 교정하는 전문 과정입니다. 행동 분석부터 교정 방법까지 완전 마스터할 수 있습니다.",
        trainerId: 3,
        trainerName: "박지혜",
        duration: 10,
        level: "advanced",
        category: "행동 교정",
        price: 450000,
        maxStudents: 12,
        currentStudents: 10,
        status: "published",
        enrollmentCount: 10,
        averageRating: 4.9,
        reviewCount: 8,
        modules: [
          {
            id: 1,
            title: "행동 분석 기초",
            description: "문제 행동의 원인 분석과 평가 방법",
            duration: 90,
            isFree: false,
            price: 45000,
            order: 1,
            videoUrl: null,
            materials: []
          },
          {
            id: 2,
            title: "과도한 짖음 교정",
            description: "짖음 행동의 원인별 교정 방법",
            duration: 90,
            isFree: false,
            price: 45000,
            order: 2,
            videoUrl: null,
            materials: []
          },
          {
            id: 3,
            title: "물기 행동 교정",
            description: "공격성과 물기 행동 교정 전문 기법",
            duration: 90,
            isFree: false,
            price: 45000,
            order: 3,
            videoUrl: null,
            materials: []
          },
          {
            id: 4,
            title: "분리불안 치료",
            description: "분리불안 증상 완화와 독립성 기르기",
            duration: 90,
            isFree: false,
            price: 45000,
            order: 4,
            videoUrl: null,
            materials: []
          },
          {
            id: 5,
            title: "파괴 행동 교정",
            description: "집 안 파괴 행동 예방과 교정 방법",
            duration: 90,
            isFree: false,
            price: 45000,
            order: 5,
            videoUrl: null,
            materials: []
          },
          {
            id: 6,
            title: "식탐 행동 교정",
            description: "음식 보호 행동과 식탐 교정 훈련",
            duration: 90,
            isFree: false,
            price: 45000,
            order: 6,
            videoUrl: null,
            materials: []
          },
          {
            id: 7,
            title: "과잉 활동 조절",
            description: "과도한 활동량과 흥분 조절 훈련",
            duration: 90,
            isFree: false,
            price: 45000,
            order: 7,
            videoUrl: null,
            materials: []
          },
          {
            id: 8,
            title: "반응성 교정",
            description: "다른 개나 사람에 대한 과도한 반응 교정",
            duration: 90,
            isFree: false,
            price: 45000,
            order: 8,
            videoUrl: null,
            materials: []
          },
          {
            id: 9,
            title: "스트레스 관리",
            description: "스트레스 신호 인식과 관리 방법",
            duration: 90,
            isFree: false,
            price: 45000,
            order: 9,
            videoUrl: null,
            materials: []
          },
          {
            id: 10,
            title: "종합 교정 계획",
            description: "개별 맞춤형 교정 계획 수립 및 실행",
            duration: 90,
            isFree: false,
            price: 45000,
            order: 10,
            videoUrl: null,
            materials: []
          }
        ],
        createdAt: new Date('2025-01-05').toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // 포인트 설정 초기화
    this.pointSettings = {
      video_upload: { points: 50, incentivePerPoint: 1000 },
      comment: { points: 5, incentivePerPoint: 500 },
      view: { points: 1, incentivePerPoint: 100 },
      member_recruitment: { points: 100, incentivePerPoint: 2000 },
      certification: { points: 200, incentivePerPoint: 5000 },
      consultation: { points: 30, incentivePerPoint: 1500 },
      course_creation: { points: 150, incentivePerPoint: 3000 }
    };

    // 샘플 활동 로그 데이터
    this.trainerActivityLogs = [
      {
        id: 1,
        trainerId: 2,
        trainerName: "강동훈",
        activityType: "video_upload",
        activityTitle: "기초 복종 훈련 영상 업로드",
        activityDescription: "앉아, 기다려 명령어 훈련 영상을 업로드했습니다.",
        pointsEarned: 50,
        incentiveAmount: "50000",
        metadata: { videoId: "v001", duration: "15:30", views: 125 },
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        trainerId: 2,
        trainerName: "강동훈",
        activityType: "comment",
        activityTitle: "커뮤니티 댓글 작성",
        activityDescription: "반려견 산책 관련 질문에 전문적인 답변을 제공했습니다.",
        pointsEarned: 5,
        incentiveAmount: "2500",
        metadata: { postId: "p123", commentLength: 200 },
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        trainerId: 2,
        trainerName: "강동훈",
        activityType: "view",
        activityTitle: "영상 조회수 달성",
        activityDescription: "기초 복종 훈련 영상이 100회 조회를 달성했습니다.",
        pointsEarned: 100,
        incentiveAmount: "10000",
        metadata: { videoId: "v001", totalViews: 100 },
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        trainerId: 3,
        trainerName: "이미정",
        activityType: "member_recruitment",
        activityTitle: "신규 회원 추천",
        activityDescription: "지인을 통해 신규 회원 1명을 추천하여 가입을 유도했습니다.",
        pointsEarned: 100,
        incentiveAmount: "200000",
        metadata: { newMemberId: "m456", referralCode: "REF001" },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 5,
        trainerId: 3,
        trainerName: "이미정",
        activityType: "certification",
        activityTitle: "반려동물 행동 교정사 자격증 취득",
        activityDescription: "한국반려동물협회 공인 행동 교정사 자격증을 취득했습니다.",
        pointsEarned: 200,
        incentiveAmount: "1000000",
        metadata: { certificationId: "C789", issueDate: "2025-01-15" },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 6,
        trainerId: 4,
        trainerName: "박지혜",
        activityType: "consultation",
        activityTitle: "온라인 상담 완료",
        activityDescription: "프렌치 불독 분리불안 상담을 성공적으로 완료했습니다.",
        pointsEarned: 30,
        incentiveAmount: "45000",
        metadata: { consultationId: "cons001", duration: "60분", rating: 5 },
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 7,
        trainerId: 4,
        trainerName: "박지혜",
        activityType: "course_creation",
        activityTitle: "새로운 강의 생성",
        activityDescription: "소형견 전용 사회화 훈련 강의를 새로 개설했습니다.",
        pointsEarned: 150,
        incentiveAmount: "450000",
        metadata: { courseId: "course789", modules: 8, duration: "4주" },
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 8,
        trainerId: 5,
        trainerName: "최예린",
        activityType: "video_upload",
        activityTitle: "트릭 훈련 영상 업로드",
        activityDescription: "반려견 트릭 훈련 시리즈 첫 번째 영상을 업로드했습니다.",
        pointsEarned: 50,
        incentiveAmount: "50000",
        metadata: { videoId: "v002", duration: "12:45", views: 87 },
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9,
        trainerId: 5,
        trainerName: "최예린",
        activityType: "comment",
        activityTitle: "전문가 답변 제공",
        activityDescription: "반려견 트릭 훈련 관련 질문에 상세한 답변을 제공했습니다.",
        pointsEarned: 5,
        incentiveAmount: "2500",
        metadata: { postId: "p456", commentLength: 350 },
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 10,
        trainerId: 6,
        trainerName: "정수현",
        activityType: "consultation",
        activityTitle: "화상 상담 완료",
        activityDescription: "골든 리트리버 복종 훈련 화상 상담을 완료했습니다.",
        pointsEarned: 30,
        incentiveAmount: "45000",
        metadata: { consultationId: "cons002", duration: "45분", rating: 4.8 },
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  // 커리큘럼 관련 메서드들
  getCurriculums() {
    return this.courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      trainerId: course.trainerId,
      trainerName: course.trainerName,
      duration: course.duration,
      level: course.level,
      category: course.category || '기초 훈련',
      price: course.price,
      maxStudents: course.maxStudents,
      currentStudents: 0,
      status: 'published',
      createdAt: course.createdAt
    }));
  }



  createCurriculum(curriculumData: any) {
    const newCourse = {
      id: this.courses.length + 1,
      ...curriculumData,
      createdAt: new Date().toISOString()
    };

    this.courses.push(newCourse);
    return newCourse;
  }

  // 기관 관련 메서드들
  getInstitutes() {
    return this.institutes || [];
  }

  getAllInstitutes() {
    return this.institutes || [];
  }

  getSubscriptionPlan(planCode: string) {
    return this.subscriptionPlans.find(plan => plan.code === planCode) || null;
  }

  getSubscriptionPlans() {
    return this.subscriptionPlans || [];
  }

  getAllSubscriptionPlans() {
    return this.subscriptionPlans || [];
  }

  getInstitute(id: number) {
    return this.institutes?.find(institute => institute.id === id);
  }

  createInstitute(instituteData: any) {
    const newInstitute = {
      id: (this.institutes?.length || 0) + 1,
      ...instituteData,
      isActive: true,
      isVerified: false,
      createdAt: new Date().toISOString()
    };

    if (!this.institutes) {
      this.institutes = [];
    }
    this.institutes.push(newInstitute);
    return newInstitute;
  }

  updateInstitute(id: number, updateData: any) {
    const institute = this.getInstitute(id);
    if (institute) {
      Object.assign(institute, updateData);
      return institute;
    }
    return null;
  }

  // 사용자 관련 메서드들
  getUsers() {
    return this.users || [];
  }

  getAllUsers() {
    return this.users || [];
  }

  getUser(id: number) {
    return this.users?.find(user => user.id === id);
  }

  getUserByEmail(email: string) {
    return this.users?.find(user => user.email === email);
  }

  createUser(userData: any) {
    const newUser = {
      id: (this.users?.length || 0) + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };

    if (!this.users) {
      this.users = [];
    }
    this.users.push(newUser);
    return newUser;
  }

  // 펫 관련 메서드들
  getPets() {
    return this.pets || [];
  }

  getPet(id: number) {
    return this.pets.find(pet => pet.id === id);
  }

  getPetsByUserId(userId: number) {
    return this.pets.filter(pet => pet.ownerId === userId);
  }

  createPet(petData: any) {
    const newPet = {
      id: this.pets.length ? Math.max(...this.pets.map(p => p.id)) + 1 : 1,
      ...petData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.pets.push(newPet);
    return newPet;
  }

  updatePet(id: number, updates: any) {
    const petIndex = this.pets.findIndex(pet => pet.id === id);
    if (petIndex !== -1) {
      this.pets[petIndex] = { 
        ...this.pets[petIndex], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      return this.pets[petIndex];
    }
    return null;
  }

  deletePet(id: number) {
    const petIndex = this.pets.findIndex(pet => pet.id === id);
    if (petIndex !== -1) {
      this.pets.splice(petIndex, 1);
      return true;
    }
    return false;
  }

  getAllPets() {
    return this.pets || [];
  }

  getPetsByOwnerId(ownerId: number) {
    return this.pets?.filter(pet => pet.ownerId === ownerId) || [];
  }

  // 통계 관련 메서드들
  getUserStats() {
    const users = this.users || [];
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isVerified !== false).length;
    const inactiveUsers = totalUsers - activeUsers;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      newUsersToday: 0,
      newUsersThisWeek: 0,
      newUsersThisMonth: 0
    };
  }

  getSystemErrors() {
    return [];
  }

  getAllTrainers() {
    return this.users?.filter(user => user.role === 'trainer') || [];
  }

  getTrainer(id: number) {
    return this.users?.find(user => user.id === id && user.role === 'trainer');
  }

  // 로고 설정 관련 메서드들
  getLogoSettings() {
    return {
      id: 1,
      logoUrl: '/logo.svg',
      darkLogoUrl: '/logo-dark.svg',
      compactLogoUrl: '/logo-compact.svg',
      symbolUrl: '/logo-symbol.svg',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  updateLogoSettings(settings: any) {
    // 로고 설정 업데이트 로직
    console.log('로고 설정 업데이트:', settings);
    return this.getLogoSettings();
  }

  // 강좌 관련 메서드들  
  getAllCourses() {
    return this.courses || [];
  }

  getCourse(id: number) {
    return this.courses?.find(course => course.id === id);
  }

  // 기관 관련 메서드들
  getAllInstitutes() {
    // 구독 플랜 정보가 포함된 전체 기관 정보 반환
    return (this.institutes || []).map(institute => {
      console.log(`[Storage] 기관 ${institute.name} 구독 플랜:`, institute.subscriptionPlan);
      return {
        ...institute,
        // 구독 플랜 정보 명시적으로 포함
        subscriptionPlan: institute.subscriptionPlan,
        subscriptionStatus: institute.subscriptionStatus,
        subscriptionStartDate: institute.subscriptionStartDate,
        subscriptionEndDate: institute.subscriptionEndDate,
        maxMembers: institute.maxMembers,
        maxVideoHours: institute.maxVideoHours,
        maxAiAnalysis: institute.maxAiAnalysis,
        featuresEnabled: institute.featuresEnabled
      };
    });
  }

  // 구독 플랜 관련 메서드들
  getAllSubscriptionPlans() {
    return this.subscriptionPlans || [];
  }

  getSubscriptionPlans() {
    return this.subscriptionPlans || [];
  }

  getSubscriptionPlan(code: string) {
    return this.subscriptionPlans?.find(plan => plan.code === code);
  }

  getSubscriptionPlanById(id: number) {
    return this.subscriptionPlans?.find(plan => plan.id === id);
  }

  // 기관 구독 관련 메서드들
  createInstituteWithSubscription(instituteData: any) {
    const newInstitute = {
      ...instituteData,
      id: this.institutes.length + 1,
      isActive: true,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.institutes.push(newInstitute);
    return newInstitute;
  }

  updateInstituteSubscription(instituteId: number, subscriptionData: any) {
    const institute = this.institutes.find(inst => inst.id === instituteId);
    if (institute) {
      Object.assign(institute, subscriptionData, {
        updatedAt: new Date().toISOString()
      });
      return institute;
    }
    return null;
  }

  deleteInstitute(instituteId: number): boolean {
    const index = this.institutes.findIndex(i => i.id === instituteId);
    if (index === -1) {
      return false;
    }

    this.institutes.splice(index, 1);
    return true;
  }

  getInstitute(instituteId: number): any {
    return this.institutes.find(i => i.id === instituteId);
  }

  updateInstitute(instituteId: number, updateData: any): any {
    const institute = this.institutes.find(i => i.id === instituteId);
    if (!institute) {
      return null;
    }

    // 기존 정보와 업데이트 데이터 병합
    Object.assign(institute, updateData, {
      updatedAt: new Date().toISOString()
    });

    console.log('[Storage] 기관 정보 업데이트 완료:', institute.id, institute.name);
    return institute;
  }

  // 기관 구독 변경 및 결제 관련 메서드들
  changeInstituteSubscription(instituteId: number, newPlanCode: string, paymentMethod: 'self' | 'admin') {
    const institute = this.institutes.find(i => i.id === instituteId);
    const newPlan = this.subscriptionPlans.find(p => p.code === newPlanCode);
    
    if (!institute || !newPlan) {
      return null;
    }

    // 현재 구독 정보 백업
    const oldSubscription = {
      planCode: institute.subscriptionPlan,
      startDate: institute.subscriptionStartDate,
      endDate: institute.subscriptionEndDate,
      price: institute.subscriptionPrice
    };

    // 새 구독 정보 업데이트
    institute.subscriptionPlan = newPlan.code;
    institute.subscriptionPrice = newPlan.price;
    institute.subscriptionStartDate = new Date().toISOString();
    institute.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30일 후
    institute.paymentMethod = paymentMethod;
    institute.updatedAt = new Date().toISOString();

    // 결제 요청 생성 (관리자 결제의 경우)
    if (paymentMethod === 'admin') {
      const paymentRequest = {
        id: `payment-${Date.now()}`,
        instituteId: instituteId,
        instituteName: institute.name,
        oldPlan: oldSubscription,
        newPlan: {
          code: newPlan.code,
          name: newPlan.name,
          price: newPlan.price
        },
        amount: newPlan.price,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        paymentMethod: 'admin',
        notes: `${institute.name} 구독 플랜 변경 요청 (${oldSubscription.planCode} → ${newPlan.code})`
      };

      if (!this.paymentRequests) {
        this.paymentRequests = [];
      }
      this.paymentRequests.push(paymentRequest);
    }

    return {
      institute,
      oldSubscription,
      newSubscription: {
        planCode: newPlan.code,
        planName: newPlan.name,
        price: newPlan.price,
        startDate: institute.subscriptionStartDate,
        endDate: institute.subscriptionEndDate
      }
    };
  }

  // 기관 자체 결제 처리
  processInstitutePayment(instituteId: number, paymentData: any) {
    const institute = this.institutes.find(i => i.id === instituteId);
    if (!institute) {
      return null;
    }

    // 결제 정보 저장
    institute.paymentStatus = 'completed';
    institute.paymentDate = new Date().toISOString();
    institute.paymentTransactionId = paymentData.transactionId || `tx-${Date.now()}`;
    institute.updatedAt = new Date().toISOString();

    return institute;
  }

  // 관리자 대리 결제 처리
  processAdminPayment(paymentRequestId: string, adminId: number) {
    const paymentRequest = this.paymentRequests?.find(pr => pr.id === paymentRequestId);
    if (!paymentRequest) {
      return null;
    }

    const institute = this.institutes.find(i => i.id === paymentRequest.instituteId);
    if (!institute) {
      return null;
    }

    // 결제 요청 상태 업데이트
    paymentRequest.status = 'completed';
    paymentRequest.processedAt = new Date().toISOString();
    paymentRequest.processedBy = adminId;

    // 기관 결제 상태 업데이트
    institute.paymentStatus = 'completed';
    institute.paymentDate = new Date().toISOString();
    institute.paymentTransactionId = `admin-${paymentRequestId}`;
    institute.updatedAt = new Date().toISOString();

    return {
      paymentRequest,
      institute
    };
  }

  createPaymentRequest(paymentRequest: any): Promise<any> {
    if (!this.paymentRequests) {
      this.paymentRequests = [];
    }
    this.paymentRequests.push(paymentRequest);
    return Promise.resolve(paymentRequest);
  }

  getPaymentRequests(): any[] {
    return this.paymentRequests || [];
  }

  updatePaymentRequest(requestId: string, updateData: any): any {
    if (!this.paymentRequests) {
      this.paymentRequests = [];
    }
    const request = this.paymentRequests.find(r => r.id === requestId);
    if (request) {
      Object.assign(request, updateData);
      return request;
    }
    return null;
  }

  // 상품 관리 메서드
  getAllProducts(): any[] {
    return this.products || [];
  }

  getProduct(id: number): any {
    return this.products.find(p => p.id === id);
  }

  updateProductPricing(id: number, pricingData: any): any {
    const product = this.products.find(p => p.id === id);
    if (product) {
      // 할인 정보 업데이트
      product.originalPrice = pricingData.originalPrice;
      product.discountType = pricingData.discountType;
      product.discountStartDate = pricingData.discountStartDate;
      product.discountEndDate = pricingData.discountEndDate;
      product.isDiscountActive = pricingData.isDiscountActive;
      product.updatedAt = new Date().toISOString();
      
      // 할인 가격 및 퍼센트 계산
      if (pricingData.discountType === 'percentage') {
        product.discountPercentage = pricingData.discountValue;
        product.discountPrice = Math.round(product.originalPrice * (1 - pricingData.discountValue / 100));
      } else if (pricingData.discountType === 'fixed') {
        product.discountPrice = Math.max(0, product.originalPrice - pricingData.discountValue);
        product.discountPercentage = Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100);
      } else {
        product.discountPrice = undefined;
        product.discountPercentage = undefined;
      }
      
      return product;
    }
    return null;
  }

  // 가격 규칙 관리 메서드
  getAllPricingRules(): any[] {
    return this.pricingRules || [];
  }

  createPricingRule(ruleData: any): any {
    const rule = {
      id: this.pricingRules.length + 1,
      ...ruleData,
      createdAt: new Date().toISOString()
    };
    this.pricingRules.push(rule);
    return rule;
  }

  updatePricingRule(id: number, updateData: any): any {
    const rule = this.pricingRules.find(r => r.id === id);
    if (rule) {
      Object.assign(rule, updateData);
      return rule;
    }
    return null;
  }

  deletePricingRule(id: number): boolean {
    const index = this.pricingRules.findIndex(r => r.id === id);
    if (index !== -1) {
      this.pricingRules.splice(index, 1);
      return true;
    }
    return false;
  }

  getInstituteSubscriptionInfo(instituteId: number) {
    const institute = this.institutes.find(inst => inst.id === instituteId);
    if (institute) {
      return {
        subscriptionPlan: institute.subscriptionPlan,
        subscriptionStatus: institute.subscriptionStatus,
        subscriptionStartDate: institute.subscriptionStartDate,
        subscriptionEndDate: institute.subscriptionEndDate,
        maxMembers: institute.maxMembers,
        maxVideoHours: institute.maxVideoHours,
        featuresEnabled: institute.featuresEnabled
      };
    }
    return null;
  }

  checkInstituteFeatureAccess(instituteId: number, featureName: string) {
    const institute = this.institutes.find(inst => inst.id === instituteId);
    if (institute && institute.featuresEnabled) {
      return institute.featuresEnabled[featureName] === true;
    }
    return false;
  }

  checkInstituteLimits(instituteId: number) {
    const institute = this.institutes.find(inst => inst.id === instituteId);
    if (institute) {
      return {
        maxMembers: institute.maxMembers,
        maxVideoHours: institute.maxVideoHours,
        currentMembers: institute.studentsCount || 0,
        currentVideoHours: institute.usedVideoHours || 0
      };
    }
    return null;
  }

  // 알림장 관리 메서드
  getAllTrainingJournals(): any[] {
    return this.trainingJournals || [];
  }

  getTrainingJournalsByTrainer(trainerId: number): any[] {
    return (this.trainingJournals || []).filter(journal => journal.trainerId === trainerId);
  }

  getTrainingJournalsByPet(petId: number): any[] {
    return (this.trainingJournals || []).filter(journal => journal.petId === petId);
  }

  async getTrainingJournalsByOwner(ownerId: number): Promise<any[]> {
    try {
      const ownerPets = await this.getPetsByUserId(ownerId);
      const petIds = ownerPets.map(pet => pet.id);
      
      return (this.trainingJournals || []).filter(journal => 
        petIds.includes(journal.petId)
      );
    } catch (error) {
      console.error('getTrainingJournalsByOwner 오류:', error);
      return [];
    }
  }

  createTrainingJournal(journalData: any): any {
    const journal = {
      id: (this.trainingJournals || []).length + 1,
      ...journalData,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    if (!this.trainingJournals) {
      this.trainingJournals = [];
    }
    this.trainingJournals.push(journal);
    return journal;
  }

  updateTrainingJournal(id: number, updateData: any): any {
    const journal = (this.trainingJournals || []).find(j => j.id === id);
    if (journal) {
      Object.assign(journal, updateData);
      return journal;
    }
    return null;
  }

  // 커리큘럼 관리 메서드
  createCurriculum(curriculumData: any): any {
    const curriculum = {
      id: Date.now().toString(),
      ...curriculumData,
      status: curriculumData.status || 'draft', // 기본 상태를 draft로 설정
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (!this.courses) {
      this.courses = [];
    }
    this.courses.push(curriculum);
    return curriculum;
  }

  getAllCurricula(): any[] {
    return this.courses || [];
  }

  getCurriculumById(id: string): any {
    return this.courses.find(curriculum => curriculum.id == id);
  }

  updateCurriculum(id: string, updateData: any): any {
    const curriculum = this.courses.find(c => c.id == id); // == 사용하여 타입 변환 허용
    if (curriculum) {
      Object.assign(curriculum, updateData, { updatedAt: new Date().toISOString() });
      return curriculum;
    }
    return null;
  }

  deleteCurriculum(id: string): boolean {
    const index = this.courses.findIndex(c => c.id == id);
    if (index !== -1) {
      this.courses.splice(index, 1);
      return true;
    }
    return false;
  }

  // 이벤트 관리 메서드
  getAllEvents(): any[] {
    return this.events || [];
  }

  getEventById(id: number): any {
    return this.events.find(event => event.id === id);
  }

  getEventBySourceUrl(sourceUrl: string): any {
    return this.events.find(event => event.sourceUrl === sourceUrl);
  }

  createEvent(eventData: any): any {
    const event = {
      id: this.events.length + 1,
      ...eventData,
      createdAt: new Date().toISOString()
    };
    this.events.push(event);
    return event;
  }

  updateEvent(id: number, updateData: any): any {
    const event = this.events.find(e => e.id === id);
    if (event) {
      Object.assign(event, updateData);
      return event;
    }
    return null;
  }

  // 대체 훈련사 게시판 관리 메서드
  initializeSubstitutePosts(): any[] {
    return [
      {
        id: '1',
        title: '긴급! 오늘 오후 3시 기초 훈련 수업 대체 훈련사 필요',
        description: '강남 펫 아카데미에서 기초 훈련 수업을 담당할 대체 훈련사를 찾고 있습니다.',
        instituteName: '강남 펫 아카데미',
        originalTrainerName: '김주훈련사',
        date: '2025-01-24',
        time: '15:00-16:00',
        subject: '기초 훈련',
        level: '초급',
        pay: 150000,
        location: '서울 강남구 역삼동',
        requirements: ['기초 훈련 경험 2년 이상', '관련 자격증 보유'],
        trainerId: 1,
        trainerName: '김주훈련사',
        urgent: true,
        status: 'open',
        applicants: [],
        createdAt: '2025-01-24T09:00:00Z',
        updatedAt: '2025-01-24T09:00:00Z'
      },
      {
        id: '2',
        title: '내일 아침 반려견 사회화 훈련 수업 대체 훈련사 구해요',
        description: '서울 반려견 훈련소에서 사회화 훈련 수업을 담당할 대체 훈련사를 찾고 있습니다.',
        instituteName: '서울 반려견 훈련소',
        originalTrainerName: '박대훈련사',
        date: '2025-01-25',
        time: '10:00-11:30',
        subject: '사회화 훈련',
        level: '중급',
        pay: 180000,
        location: '서울 마포구 상암동',
        requirements: ['사회화 훈련 경험 3년 이상', '퍼피 스쿨 경험'],
        trainerId: 2,
        trainerName: '박대훈련사',
        urgent: false,
        status: 'open',
        applicants: [],
        createdAt: '2025-01-24T10:30:00Z',
        updatedAt: '2025-01-24T10:30:00Z'
      },
      {
        id: '3',
        title: '다음주 화요일 어질리티 훈련 수업',
        description: '부산 펫 트레이닝 센터에서 어질리티 훈련 수업을 담당할 대체 훈련사를 찾고 있습니다.',
        instituteName: '부산 펫 트레이닝 센터',
        originalTrainerName: '이전문훈련사',
        date: '2025-01-28',
        time: '14:00-15:30',
        subject: '어질리티 훈련',
        level: '고급',
        pay: 220000,
        location: '부산 해운대구 우동',
        requirements: ['어질리티 훈련 전문가', '대회 참가 경험'],
        trainerId: 3,
        trainerName: '이전문훈련사',
        urgent: false,
        status: 'open',
        applicants: [],
        createdAt: '2025-01-24T11:00:00Z',
        updatedAt: '2025-01-24T11:00:00Z'
      }
    ];
  }

  getSubstitutePosts(): any[] {
    if (!this.substitutePosts) {
      this.substitutePosts = this.initializeSubstitutePosts();
    }
    return this.substitutePosts;
  }

  createSubstitutePost(postData: any): any {
    const newPost = {
      id: Date.now().toString(),
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicants: []
    };
    
    if (!this.substitutePosts) {
      this.substitutePosts = [];
    }
    this.substitutePosts.push(newPost);
    return newPost;
  }

  updateSubstitutePost(id: string, updateData: any): any {
    const post = this.substitutePosts?.find(p => p.id === id);
    if (post) {
      Object.assign(post, updateData, { updatedAt: new Date().toISOString() });
      return post;
    }
    return null;
  }

  deleteSubstitutePost(id: string): boolean {
    if (!this.substitutePosts) return false;
    const index = this.substitutePosts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.substitutePosts.splice(index, 1);
      return true;
    }
    return false;
  }

  applyForSubstitutePost(id: string, applicationData: any): any {
    const post = this.substitutePosts?.find(p => p.id === id);
    if (post) {
      if (!post.applicants) {
        post.applicants = [];
      }
      const application = {
        id: Date.now().toString(),
        ...applicationData,
        appliedAt: new Date().toISOString()
      };
      post.applicants.push(application);
      return application;
    }
    return null;
  }

  getSubstituteOverview(): any {
    return {
      totalPosts: this.substitutePosts?.length || 0,
      activePosts: this.substitutePosts?.filter(p => p.status === 'open').length || 0,
      totalApplications: this.substitutePosts?.reduce((sum, p) => sum + (p.applicants?.length || 0), 0) || 0,
      completedSessions: 45,
      monthlyGrowth: 12.5,
      avgResponseTime: 2.3,
      satisfactionRate: 94.8
    };
  }

  getSubstituteInstitutes(): any[] {
    return [
      {
        id: '1',
        name: '강남 펫 아카데미',
        activePosts: 8,
        totalRequests: 25,
        successRate: 92.0,
        averageRating: 4.6,
        totalTrainers: 12,
        availableTrainers: 8,
        lastRequestDate: '2025-01-24'
      },
      {
        id: '2',
        name: '서울 반려견 훈련소',
        activePosts: 6,
        totalRequests: 18,
        successRate: 88.9,
        averageRating: 4.4,
        totalTrainers: 9,
        availableTrainers: 6,
        lastRequestDate: '2025-01-23'
      }
    ];
  }

  getSubstituteAlerts(): any[] {
    return [
      {
        id: '1',
        type: 'urgent',
        title: '긴급 대체 훈련사 필요',
        description: '강남 펫 아카데미에서 오늘 오후 2시 수업 대체 훈련사가 필요합니다.',
        instituteName: '강남 펫 아카데미',
        priority: 'high',
        createdAt: '2025-01-24T09:30:00Z',
        resolved: false
      },
      {
        id: '2',
        type: 'warning',
        title: '대체 훈련사 부족',
        description: '이번 주 대체 훈련사 신청이 평소보다 30% 감소했습니다.',
        instituteName: '전체',
        priority: 'medium',
        createdAt: '2025-01-24T08:15:00Z',
        resolved: false
      }
    ];
  }

  getSubstituteTrainers(): any[] {
    return [
      {
        id: '1',
        name: '박대체훈련사',
        instituteName: '강남 펫 아카데미',
        tier: 'certified',
        totalSubstitutes: 15,
        successRate: 96.7,
        averageRating: 4.9,
        totalEarnings: 1200000,
        lastActiveDate: '2025-01-24'
      },
      {
        id: '2',
        name: '최대체훈련사',
        instituteName: '서울 반려견 훈련소',
        tier: 'semi_certified',
        totalSubstitutes: 12,
        successRate: 91.7,
        averageRating: 4.7,
        totalEarnings: 960000,
        lastActiveDate: '2025-01-23'
      }
    ];
  }

  resolveSubstituteAlert(id: string): any {
    const alert = this.substituteAlerts?.find(a => a.id === id);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date().toISOString();
      return alert;
    }
    return null;
  }

  // 커뮤니티 게시글 관리 메서드
  createPost(postData: any): any {
    const newPost = {
      id: (this.posts?.length || 0) + 1,
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    if (!this.posts) {
      this.posts = [];
    }
    this.posts.push(newPost);
    return newPost;
  }

  getAllPosts(): any[] {
    return this.posts || [];
  }

  getPostById(id: number): any {
    return this.posts?.find(post => post.id === id);
  }

  updatePost(id: number, updateData: any): any {
    const post = this.posts?.find(p => p.id === id);
    if (post) {
      Object.assign(post, updateData);
      post.updatedAt = new Date().toISOString();
      return post;
    }
    return null;
  }

  deletePost(id: number): boolean {
    const index = this.posts?.findIndex(p => p.id === id);
    if (index !== undefined && index !== -1) {
      this.posts?.splice(index, 1);
      return true;
    }
    return false;
  }

  deleteEvent(id: number): boolean {
    const index = this.events.findIndex(e => e.id === id);
    if (index !== -1) {
      this.events.splice(index, 1);
      return true;
    }
    return false;
  }

  updateEventThumbnail(id: number, thumbnailUrl: string): any {
    const event = this.events.find(e => e.id === id);
    if (event) {
      event.thumbnailUrl = thumbnailUrl;
      event.lastUpdated = new Date().toISOString();
      return event;
    }
    return null;
  }

  // 정보 수정 요청 승인/반려 처리
  async reviewCorrectionRequest(requestId: string, action: string, adminNotes: string) {
    console.log('[Storage] 정보 수정 요청 처리:', requestId, action, adminNotes);
    
    // 임시 데이터 소스에서 정보 수정 요청 찾기
    const correctionRequests = this.getCorrectionRequests();
    const requestIndex = correctionRequests.findIndex(req => req.id === requestId);
    
    if (requestIndex === -1) {
      throw new Error('정보 수정 요청을 찾을 수 없습니다.');
    }
    
    const request = correctionRequests[requestIndex];
    
    // 요청 상태 업데이트
    request.status = action === 'approve' ? 'approved' : 'rejected';
    request.reviewedAt = new Date().toISOString();
    request.reviewedBy = '관리자';
    request.adminNotes = adminNotes;
    
    // 승인된 경우 실제 업체 정보 업데이트
    if (action === 'approve') {
      await this.updateBusinessInfo(request);
    }
    
    console.log('[Storage] 정보 수정 요청 처리 완료:', request);
    return request;
  }

  // 업체 정보 업데이트 (승인된 수정 요청 반영)
  async updateBusinessInfo(request: any) {
    console.log('[Storage] 업체 정보 업데이트:', request.businessId, request.correctionType, request.proposedValue);
    
    // 업체 유형에 따라 적절한 데이터 소스 업데이트
    if (request.businessType === 'institute') {
      await this.updateInstituteField(request.businessId, request.correctionType, request.proposedValue);
    } else if (request.businessType === 'trainer') {
      await this.updateTrainerField(request.businessId, request.correctionType, request.proposedValue);
    } else if (request.businessType === 'business') {
      await this.updateBusinessField(request.businessId, request.correctionType, request.proposedValue);
    }
    
    console.log('[Storage] 업체 정보 업데이트 완료');
  }

  // 기관 정보 필드 업데이트
  async updateInstituteField(businessId: string, correctionType: string, proposedValue: string) {
    const institute = this.institutes.find(inst => inst.id === parseInt(businessId));
    if (institute) {
      switch (correctionType) {
        case 'address':
          institute.address = proposedValue;
          break;
        case 'phone':
          institute.phone = proposedValue;
          break;
        case 'description':
          institute.description = proposedValue;
          break;
        case 'services':
          institute.services = proposedValue.split(',').map(s => s.trim());
          break;
        default:
          institute[correctionType] = proposedValue;
      }
      console.log('[Storage] 기관 정보 업데이트 완료:', institute.name);
    }
  }

  // 훈련사 정보 필드 업데이트
  async updateTrainerField(businessId: string, correctionType: string, proposedValue: string) {
    const trainer = this.trainers.find(t => t.id === parseInt(businessId));
    if (trainer) {
      switch (correctionType) {
        case 'address':
          trainer.address = proposedValue;
          break;
        case 'phone':
          trainer.phone = proposedValue;
          break;
        case 'description':
          trainer.bio = proposedValue;
          break;
        case 'services':
          trainer.specialties = proposedValue.split(',').map(s => s.trim());
          break;
        default:
          trainer[correctionType] = proposedValue;
      }
      console.log('[Storage] 훈련사 정보 업데이트 완료:', trainer.name);
    }
  }

  // 일반 업체 정보 필드 업데이트
  async updateBusinessField(businessId: string, correctionType: string, proposedValue: string) {
    // 일반 업체 정보 업데이트 로직 (필요시 구현)
    console.log('[Storage] 일반 업체 정보 업데이트:', businessId, correctionType, proposedValue);
  }

  // 강의 생성
  async createCourse(courseData: any): Promise<any> {
    try {
      const newCourse = {
        id: courseData.id || `course-${Date.now()}`,
        title: courseData.title,
        instructor: courseData.instructor,
        description: courseData.description,
        category: courseData.category,
        difficulty: courseData.difficulty,
        price: courseData.price,
        duration: courseData.duration,
        modules: courseData.modules || [],
        enrollmentCount: courseData.enrollmentCount || 0,
        rating: courseData.rating || 0,
        reviewCount: courseData.reviewCount || 0,
        isActive: courseData.isActive !== false,
        featured: courseData.featured || false,
        tags: courseData.tags || [],
        createdAt: courseData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.courses.push(newCourse);
      console.log('[Storage] 새 강의 생성:', newCourse.title);
      return newCourse;
    } catch (error) {
      console.error('[Storage] 강의 생성 실패:', error);
      throw error;
    }
  }

  // 모든 강의 조회
  async getAllCourses(): Promise<any[]> {
    return this.courses;
  }

  // 훈련사 생성
  async createTrainer(trainerData: any): Promise<any> {
    try {
      const newTrainer = {
        id: trainerData.id || Date.now(),
        name: trainerData.name,
        email: trainerData.email,
        phone: trainerData.phone,
        bio: trainerData.bio,
        specialties: trainerData.specialties || [],
        experience: trainerData.experience || 0,
        certifications: trainerData.certifications || [],
        price: trainerData.price || 0,
        location: trainerData.location,
        address: trainerData.address,
        profileImage: trainerData.profileImage,
        rating: trainerData.rating || 0,
        reviewCount: trainerData.reviewCount || 0,
        featured: trainerData.featured || false,
        isActive: trainerData.isActive !== false,
        createdAt: trainerData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 전역 훈련사 목록에 추가
      if (!global.trainers) {
        global.trainers = [];
      }
      global.trainers.push(newTrainer);
      
      console.log('[Storage] 새 훈련사 생성:', newTrainer.name);
      return newTrainer;
    } catch (error) {
      console.error('[Storage] 훈련사 생성 실패:', error);
      throw error;
    }
  }

  // 정보 수정 요청 목록 조회
  getCorrectionRequests() {
    return [
      {
        id: '1',
        businessId: '1',
        businessName: '서울 펫트레이닝 센터',
        businessType: 'institute',
        requesterName: '김철수',
        requesterEmail: 'kimcs@example.com',
        requesterPhone: '010-1234-5678',
        correctionType: 'address',
        currentValue: '서울시 강남구 역삼동 123-45',
        proposedValue: '서울시 강남구 역삼동 678-90',
        reason: '이전으로 인한 주소 변경',
        evidence: ['image1.jpg', 'lease_contract.pdf'],
        status: 'pending',
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high'
      },
      {
        id: '2',
        businessId: '2',
        businessName: '부산 동물병원',
        businessType: 'business',
        requesterName: '이영희',
        requesterEmail: 'leeyh@example.com',
        correctionType: 'phone',
        currentValue: '051-123-4567',
        proposedValue: '051-987-6543',
        reason: '전화번호 변경',
        status: 'in-review',
        submittedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        priority: 'medium'
      }
    ];
  }

  // 상품 관련 메소드들
  async getProducts() {
    try {
      console.log('[Storage] 상품 목록 조회');
      return this.products || [];
    } catch (error) {
      console.error('[Storage] 상품 목록 조회 실패:', error);
      return [];
    }
  }

  async getProduct(id: number) {
    try {
      const product = this.products.find(p => p.id === id);
      return product || null;
    } catch (error) {
      console.error('[Storage] 상품 조회 실패:', error);
      return null;
    }
  }

  // 강의 구매 관련 메소드
  async purchaseCourse(userId: number, courseId: number, purchaseAmount: number, paymentMethod: string) {
    try {
      const purchase = {
        id: this.coursePurchases.length + 1,
        userId,
        courseId,
        purchaseAmount,
        paymentMethod,
        paymentStatus: 'completed',
        accessGranted: true,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1년 후
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.coursePurchases.push(purchase);
      
      // 강의 진행 상황 초기화
      const progress = {
        id: this.courseProgress.length + 1,
        userId,
        courseId,
        currentLesson: 1,
        completedLessons: 0,
        totalLessons: 10, // 기본값
        progressPercentage: 0,
        timeSpent: 0,
        averageScore: 0,
        lastAccessedAt: new Date().toISOString(),
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.courseProgress.push(progress);
      
      return { purchase, progress };
    } catch (error) {
      console.error('[Storage] 강의 구매 실패:', error);
      throw error;
    }
  }

  // 강의 진행 상황 업데이트
  async updateCourseProgress(userId: number, courseId: number, progressData: any) {
    try {
      const progressIndex = this.courseProgress.findIndex(p => p.userId === userId && p.courseId === courseId);
      
      if (progressIndex === -1) {
        throw new Error('강의 진행 상황을 찾을 수 없습니다.');
      }
      
      this.courseProgress[progressIndex] = {
        ...this.courseProgress[progressIndex],
        ...progressData,
        updatedAt: new Date().toISOString()
      };
      
      return this.courseProgress[progressIndex];
    } catch (error) {
      console.error('[Storage] 강의 진행 상황 업데이트 실패:', error);
      throw error;
    }
  }

  // 진행 상황 공유
  async shareProgress(userId: number, courseId: number, shareType: string, trainerId?: number, instituteId?: number) {
    try {
      const sharing = {
        id: this.progressSharing.length + 1,
        userId,
        courseId,
        trainerId,
        instituteId,
        shareType,
        sharedAt: new Date().toISOString(),
        permissions: {
          canViewProgress: true,
          canViewDetailedStats: true,
          canReceiveNotifications: true
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.progressSharing.push(sharing);
      return sharing;
    } catch (error) {
      console.error('[Storage] 진행 상황 공유 실패:', error);
      throw error;
    }
  }

  // 사용자별 강의 구매 목록 조회
  async getUserCoursePurchases(userId: number) {
    try {
      return this.coursePurchases.filter(purchase => purchase.userId === userId);
    } catch (error) {
      console.error('[Storage] 사용자 강의 구매 목록 조회 실패:', error);
      return [];
    }
  }

  // 사용자별 강의 진행 상황 조회
  async getUserCourseProgress(userId: number) {
    try {
      return this.courseProgress.filter(progress => progress.userId === userId);
    } catch (error) {
      console.error('[Storage] 사용자 강의 진행 상황 조회 실패:', error);
      return [];
    }
  }

  // 훈련사별 공유된 진행 상황 조회
  async getSharedProgressByTrainer(trainerId: number) {
    try {
      const sharedProgress = this.progressSharing.filter(sharing => 
        sharing.trainerId === trainerId && sharing.isActive
      );
      
      const progressWithDetails = sharedProgress.map(sharing => {
        const progress = this.courseProgress.find(p => 
          p.userId === sharing.userId && p.courseId === sharing.courseId
        );
        const user = this.users.find(u => u.id === sharing.userId);
        const course = this.courses.find(c => c.id === sharing.courseId);
        
        return {
          ...sharing,
          progress,
          user,
          course
        };
      });
      
      return progressWithDetails;
    } catch (error) {
      console.error('[Storage] 훈련사별 공유 진행 상황 조회 실패:', error);
      return [];
    }
  }

  // 기관별 공유된 진행 상황 조회
  async getSharedProgressByInstitute(instituteId: number) {
    try {
      const sharedProgress = this.progressSharing.filter(sharing => 
        sharing.instituteId === instituteId && sharing.isActive
      );
      
      const progressWithDetails = sharedProgress.map(sharing => {
        const progress = this.courseProgress.find(p => 
          p.userId === sharing.userId && p.courseId === sharing.courseId
        );
        const user = this.users.find(u => u.id === sharing.userId);
        const course = this.courses.find(c => c.id === sharing.courseId);
        
        return {
          ...sharing,
          progress,
          user,
          course
        };
      });
      
      return progressWithDetails;
    } catch (error) {
      console.error('[Storage] 기관별 공유 진행 상황 조회 실패:', error);
      return [];
    }
  }

  // 강의 세션 기록 저장
  async recordLessonSession(userId: number, courseId: number, sessionData: any) {
    try {
      const session = {
        id: this.lessonSessions.length + 1,
        userId,
        courseId,
        ...sessionData,
        createdAt: new Date().toISOString()
      };
      
      this.lessonSessions.push(session);
      return session;
    } catch (error) {
      console.error('[Storage] 강의 세션 기록 실패:', error);
      throw error;
    }
  }

  // 포인트 관리 관련 메서드들
  getTrainerActivityLogs(filters: any = {}) {
    return this.trainerActivityLogs.filter(log => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = log.trainerName.toLowerCase().includes(searchTerm) ||
                             log.activityTitle.toLowerCase().includes(searchTerm) ||
                             log.activityDescription.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }
      
      if (filters.activityType && filters.activityType !== 'all') {
        if (log.activityType !== filters.activityType) return false;
      }
      
      if (filters.trainer && filters.trainer !== 'all') {
        if (log.trainerId.toString() !== filters.trainer) return false;
      }
      
      if (filters.date && filters.date !== 'all') {
        const logDate = new Date(log.createdAt);
        const today = new Date();
        
        switch (filters.date) {
          case 'today':
            if (logDate.toDateString() !== today.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (logDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (logDate < monthAgo) return false;
            break;
        }
      }
      
      return true;
    });
  }

  getActivitySummary() {
    const logs = this.trainerActivityLogs;
    
    const totalActivities = logs.length;
    const totalPoints = logs.reduce((sum, log) => sum + log.pointsEarned, 0);
    const totalIncentives = logs.reduce((sum, log) => sum + Number(log.incentiveAmount), 0);
    const activeTrainers = new Set(logs.map(log => log.trainerId)).size;
    
    // 활동 타입별 집계
    const activityCounts: Record<string, any> = {};
    logs.forEach(log => {
      if (!activityCounts[log.activityType]) {
        activityCounts[log.activityType] = {
          activityType: log.activityType,
          activityTitle: log.activityTitle,
          count: 0,
          totalPoints: 0
        };
      }
      activityCounts[log.activityType].count++;
      activityCounts[log.activityType].totalPoints += log.pointsEarned;
    });
    
    const topActivities = Object.values(activityCounts)
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 5);
    
    return {
      totalActivities,
      totalPoints,
      totalIncentives,
      activeTrainers,
      topActivities
    };
  }

  getTrainerStats() {
    const logs = this.trainerActivityLogs;
    const trainerStats: Record<number, any> = {};
    
    logs.forEach(log => {
      if (!trainerStats[log.trainerId]) {
        trainerStats[log.trainerId] = {
          trainerId: log.trainerId,
          trainerName: log.trainerName,
          totalActivities: 0,
          totalPoints: 0,
          totalIncentives: 0,
          lastActivity: log.createdAt,
          topActivity: log.activityTitle,
          rank: 0
        };
      }
      
      trainerStats[log.trainerId].totalActivities++;
      trainerStats[log.trainerId].totalPoints += log.pointsEarned;
      trainerStats[log.trainerId].totalIncentives += Number(log.incentiveAmount);
      
      if (new Date(log.createdAt) > new Date(trainerStats[log.trainerId].lastActivity)) {
        trainerStats[log.trainerId].lastActivity = log.createdAt;
      }
    });
    
    const statsArray = Object.values(trainerStats)
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((stat, index) => ({
        ...stat,
        rank: index + 1
      }));
    
    return statsArray;
  }

  deleteTrainerActivityLog(logId: number) {
    const index = this.trainerActivityLogs.findIndex(log => log.id === logId);
    if (index !== -1) {
      this.trainerActivityLogs.splice(index, 1);
      return true;
    }
    return false;
  }

  recalculatePoints() {
    // 포인트 재계산 로직
    console.log('[Storage] 포인트 재계산 시작');
    
    // 여기서 실제로는 복잡한 포인트 재계산 로직이 들어가야 함
    // 현재는 단순히 로그를 출력하고 성공 반환
    this.trainerActivityLogs.forEach(log => {
      log.pointsEarned = this.calculatePoints(log.activityType, log.metadata);
    });
    
    console.log('[Storage] 포인트 재계산 완료');
    return true;
  }

  private calculatePoints(activityType: string, metadata: any) {
    // 활동 타입별 포인트 계산 로직
    const pointValues = {
      'video_upload': 50,
      'comment': 5,
      'view': 1,
      'member_recruitment': 100,
      'certification': 200,
      'consultation': 30,
      'course_creation': 150
    };
    
    return pointValues[activityType as keyof typeof pointValues] || 0;
  }

  // 포인트 설정 관련 메서드들
  getPointSettings() {
    return this.pointSettings;
  }

  updatePointSettings(settings: any) {
    this.pointSettings = { ...this.pointSettings, ...settings };
    return this.pointSettings;
  }

  // ===== 대체 훈련사 시스템 메서드들 =====
  
  // 대체 훈련사 게시글 조회
  async getSubstituteTrainerPosts(options: any = {}) {
    const { page = 1, limit = 10, status = 'all', instituteId } = options;
    
    let posts = this.substituteClassPosts.filter(post => {
      if (status !== 'all' && post.status !== status) return false;
      if (instituteId && post.instituteId !== instituteId) return false;
      return true;
    });

    // 훈련사 정보 포함
    posts = posts.map(post => ({
      ...post,
      trainer: this.trainers.find(t => t.id === post.trainerId)
    }));

    // 페이지네이션 적용
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return posts.slice(startIndex, endIndex);
  }

  // 대체 훈련사 게시글 생성
  async createSubstituteTrainerPost(postData: any) {
    const newPost = {
      id: this.substituteClassPosts.length + 1,
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.substituteClassPosts.push(newPost);
    return newPost;
  }

  // 대체 훈련사 게시글 단일 조회
  async getSubstituteTrainerPost(postId: number) {
    const post = this.substituteClassPosts.find(p => p.id === postId);
    if (!post) return null;
    
    return {
      ...post,
      trainer: this.trainers.find(t => t.id === post.trainerId),
      applications: this.substituteClassApplications.filter(app => app.postId === postId)
    };
  }

  // 대체 훈련사 게시글 업데이트
  async updateSubstituteTrainerPost(postId: number, updateData: any) {
    const postIndex = this.substituteClassPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error('게시글을 찾을 수 없습니다.');
    
    this.substituteClassPosts[postIndex] = {
      ...this.substituteClassPosts[postIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return this.substituteClassPosts[postIndex];
  }

  // 대체 훈련사 지원 신청 생성
  async createSubstituteTrainerApplication(applicationData: any) {
    const newApplication = {
      id: this.substituteClassApplications.length + 1,
      ...applicationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.substituteClassApplications.push(newApplication);
    return newApplication;
  }

  // 대체 훈련사 지원 신청 조회
  async getSubstituteTrainerApplications(options: any = {}) {
    const { instituteId } = options;
    
    let applications = this.substituteClassApplications;
    
    if (instituteId) {
      // 기관 소속 훈련사들의 지원 신청만 필터링
      const institutePosts = this.substituteClassPosts.filter(p => p.instituteId === instituteId);
      const institutePostIds = institutePosts.map(p => p.id);
      applications = applications.filter(app => institutePostIds.includes(app.postId));
    }

    return applications.map(app => ({
      ...app,
      post: this.substituteClassPosts.find(p => p.id === app.postId),
      applicant: this.trainers.find(t => t.id === app.applicantId)
    }));
  }

  // 대체 훈련사 지원 신청 업데이트
  async updateSubstituteTrainerApplication(applicationId: number, updateData: any) {
    const applicationIndex = this.substituteClassApplications.findIndex(a => a.id === applicationId);
    if (applicationIndex === -1) throw new Error('지원 신청을 찾을 수 없습니다.');
    
    this.substituteClassApplications[applicationIndex] = {
      ...this.substituteClassApplications[applicationIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return this.substituteClassApplications[applicationIndex];
  }

  // 대체 훈련사 세션 완료 처리
  async completeSubstituteTrainerSession(sessionId: number, completionData: any) {
    // 세션 완료 처리 로직 (실제 구현에서는 별도 세션 테이블 사용)
    const session = {
      id: sessionId,
      ...completionData,
      status: 'completed'
    };
    
    return session;
  }

  // 대체 훈련사 결제 처리
  async processSubstituteTrainerPayment(paymentData: any) {
    // 결제 처리 로직 (실제 구현에서는 결제 시스템 연동)
    const payment = {
      id: Date.now(), // 임시 ID
      ...paymentData,
      paymentStatus: 'completed',
      processedAt: new Date().toISOString()
    };
    
    return payment;
  }

  // 대체 훈련사 시스템 초기 데이터 생성
  private initializeSubstituteTrainerData() {
    // 훈련사 데이터 추가
    this.trainers = [
      {
        id: 1,
        name: '강동훈',
        email: 'donghoong@wangzzang.com',
        phone: '010-4765-1909',
        certification: '반려동물행동지도사 국가자격증 2급',
        experience: 5,
        specialization: ['기초 훈련', '문제 행동 교정', '사회화 훈련'],
        instituteId: 1,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: '김민수',
        email: 'kim@trainingcenter.com',
        phone: '010-1234-5678',
        certification: '반려동물 훈련 전문가 자격증',
        experience: 8,
        specialization: ['사회화 훈련', '분리불안 치료', '기초 복종'],
        instituteId: 1,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: '박지혜',
        email: 'park@behaviorplus.com',
        phone: '010-9876-5432',
        certification: '동물행동 전문가 자격증',
        experience: 6,
        specialization: ['행동 교정', '공격성 치료', '고급 훈련'],
        instituteId: 2,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        name: '이수현',
        email: 'lee@puppytraining.com',
        phone: '010-5678-9012',
        certification: '반려동물 훈련사 자격증',
        experience: 4,
        specialization: ['퍼피 훈련', '소형견 전문', '기초 복종'],
        instituteId: 2,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        name: '최영진',
        email: 'choi@advancedtraining.com',
        phone: '010-3456-7890',
        certification: '동물행동 치료사 자격증',
        experience: 10,
        specialization: ['고급 훈련', '특수 행동 치료', '전문 트레이닝'],
        instituteId: 3,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    // 샘플 대체 훈련사 게시글 데이터
    this.substituteClassPosts = [
      {
        id: 1,
        trainerId: 1,
        instituteId: 1,
        title: "급하게 대체 훈련사 구합니다 - 골든리트리버 기초 훈련",
        content: "갑작스러운 개인 사정으로 내일 오후 2시 수업을 진행할 수 없게 되었습니다. 골든리트리버 기초 복종 훈련이며, 반려견 경험이 풍부한 훈련사분을 찾습니다.",
        substituteDate: new Date('2025-07-19'),
        substituteTime: "14:00",
        location: "강남구 테헤란로 123",
        trainingType: "기초 복종 훈련",
        petInfo: "골든리트리버, 2살, 수컷, 이름: 맥스",
        requirements: "골든리트리버 훈련 경험 필수, TALEZ 인증 훈련사",
        paymentAmount: 80000,
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        trainerId: 2,
        instituteId: 1,
        title: "주말 대체 훈련사 모집 - 소형견 사회화 훈련",
        content: "이번 주말 토요일 오전 10시 소형견 사회화 훈련 수업을 대신 진행해주실 훈련사를 찾습니다. 소형견 특화 훈련 경험이 있으신 분 우대합니다.",
        substituteDate: new Date('2025-07-20'),
        substituteTime: "10:00",
        location: "서초구 서초대로 456",
        trainingType: "사회화 훈련",
        petInfo: "요크셔테리어, 1살, 암컷, 이름: 루나",
        requirements: "소형견 훈련 경험, 사회화 훈련 전문성",
        paymentAmount: 60000,
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // 샘플 대체 훈련사 지원 신청 데이터
    this.substituteClassApplications = [
      {
        id: 1,
        postId: 1,
        applicantId: 3,
        message: "안녕하세요, 골든리트리버 훈련 경험이 5년 이상 있는 전문 훈련사입니다. 기초 복종 훈련에 특화되어 있으며, 해당 시간에 대체 수업 진행 가능합니다.",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        postId: 2,
        applicantId: 4,
        message: "소형견 사회화 훈련 전문가입니다. 특히 요크셔테리어 훈련 경험이 많으며, 주말 수업 진행에 문제없습니다.",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
}

const storage = new Storage();

export { storage };
export default storage;