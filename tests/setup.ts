// 테스트 환경 설정 파일

// 환경 변수 설정
process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-session-secret';
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/talez_test';

// Jest 전역 타임아웃 설정 (10초)
jest.setTimeout(10000);

// 전역 afterAll 훅 - 모든 테스트가 완료된 후 실행
afterAll(async () => {
  // 열려있는 DB 연결 종료 등의 정리 작업
  // 사용 중인 자원 정리 코드
  console.log('테스트 정리 작업 완료');
});