/**
 * Java Spring Boot 스타일의 ApplicationConfig
 * Node.js/TypeScript로 구현된 Spring Boot 설정 클래스 패턴
 */

export class ApplicationConfig {
  private static instance: ApplicationConfig;
  
  private constructor() {}
  
  public static getInstance(): ApplicationConfig {
    if (!ApplicationConfig.instance) {
      ApplicationConfig.instance = new ApplicationConfig();
    }
    return ApplicationConfig.instance;
  }
  
  /**
   * @Configuration 스타일 설정
   */
  public getServerConfig() {
    return {
      name: 'PetEdu Platform',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 5000,
      springBootStyle: true,
      architecture: 'Hybrid Node.js + Spring Boot Pattern'
    };
  }
  
  /**
   * @Bean 스타일 빈 등록
   */
  public getRegisteredBeans() {
    return {
      userService: 'UserService@Singleton',
      petService: 'PetService@Singleton', 
      courseService: 'CourseService@Singleton',
      userController: 'UserController@RestController',
      petController: 'PetController@RestController',
      courseController: 'CourseController@RestController'
    };
  }
  
  /**
   * 애플리케이션 정보 반환
   */
  public getApplicationInfo() {
    return {
      ...this.getServerConfig(),
      beans: this.getRegisteredBeans(),
      endpoints: {
        users: '/api/spring/users',
        pets: '/api/spring/pets', 
        courses: '/api/spring/courses',
        health: '/actuator/health'
      },
      timestamp: new Date(),
      status: 'RUNNING'
    };
  }
}

export const applicationConfig = ApplicationConfig.getInstance();