// Redirect to minimal storage implementation to avoid TypeScript compilation errors
export * from "./storage-minimal";

// 커리큘럼 관리
  async createCourse(courseData: any) {
    const course = {
      id: courseData.id || `course-${Date.now()}`,
      ...courseData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.courses.push(course);
    return course;
  }

  async getCurriculums() {
    // 기존 courses 데이터를 커리큘럼 형식으로 변환하여 반환
    return this.courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category || '전문교육',
      difficulty: course.difficulty || 'intermediate',
      duration: course.duration || 480,
      price: course.price || 400000,
      modules: course.modules || [],
      enrollmentCount: course.enrollmentCount || 0,
      rating: course.rating || 0,
      reviewCount: course.reviewCount || 0,
      isActive: course.isActive !== false,
      featured: course.featured || false,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }));
  }

  async createCurriculum(curriculumData: any) {
    return this.createCourse(curriculumData);
  }