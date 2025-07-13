class Storage {
  users: any[] = [];
  pets: any[] = [];
  courses: any[] = [];
  notifications: any[] = [];
  registrations: any[] = [];
  institutes: any[] = [];
  subscriptionPlans: any[] = [];

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

  // 구독 플랜 관련 메서드들
  getAllSubscriptionPlans() {
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
}

const storage = new Storage();

export { storage };
export default storage;