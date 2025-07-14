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
    // courses data
    this.courses = [];
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

  getAllCurricula() {
    return this.courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      trainerId: course.trainerId,
      trainerName: course.trainerName,
      duration: course.duration,
      difficulty: course.level,
      category: course.category || '기초 훈련',
      price: course.price,
      maxStudents: course.maxStudents,
      status: 'published',
      enrollmentCount: 0,
      averageRating: 4.5,
      modules: course.modules || [],
      createdAt: course.createdAt || new Date().toISOString(),
      updatedAt: course.updatedAt || new Date().toISOString()
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
}

const storage = new Storage();

export { storage };
export default storage;