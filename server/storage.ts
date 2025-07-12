class Storage {
  users: any[] = [];
  pets: any[] = [];
  courses: any[] = [];
  notifications: any[] = [];
  registrations: any[] = [];
  institutes: any[] = [];

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
        name: '김반려', 
        email: 'owner@test.com', 
        role: 'pet-owner', 
        password: 'owner123',
        isVerified: false,
        createdAt: new Date().toISOString()
      }
    ];

    // 기본 반려동물 데이터
    this.pets = [
      {
        id: 1,
        name: '맥스',
        breed: '골든리트리버',
        age: 3,
        ownerId: 3,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: '루이',
        breed: '시바이누',
        age: 2,
        ownerId: 3,
        createdAt: new Date().toISOString()
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
}

const storage = new Storage();

export { storage };
export default storage;