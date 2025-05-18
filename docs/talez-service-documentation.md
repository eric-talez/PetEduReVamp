
# TALEZ 서비스 문서

## 1. 서비스 개요

TALEZ는 반려견 훈련 플랫폼으로, 반려견 주인과 전문 훈련사를 연결하고 교육 콘텐츠를 제공하는 종합 플랫폼입니다.

### 1.1 주요 기능
- 반려견 훈련 예약 및 관리
- 실시간 화상 상담
- 커뮤니티 및 정보 공유
- 반려견 용품 쇼핑몰
- AI 기반 반려견 행동 분석

## 2. 사용자 권한 체계

### 2.1 사용자 역할
- 일반 사용자 (user)
- 반려견 주인 (pet-owner)
- 훈련사 (trainer)
- 기관 관리자 (institute-admin)
- 시스템 관리자 (admin)

### 2.2 역할별 권한
```typescript
// UserRole 정의
export type UserRole = 'user' | 'pet-owner' | 'trainer' | 'institute-admin' | 'admin';
```

## 3. 시스템 아키텍처

### 3.1 프론트엔드
- Framework: React + TypeScript
- 상태관리: React Context
- UI 라이브러리: 자체 컴포넌트 시스템
- 라우팅: 커스텀 라우터

### 3.2 백엔드
- Runtime: Node.js
- Framework: Express
- 데이터베이스: PostgreSQL (Drizzle ORM)
- WebSocket: 실시간 메시징

### 3.3 주요 API 엔드포인트
```typescript
// 인증
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

// 사용자 관리
GET /api/users/:id
PATCH /api/users/profile

// 반려견 관리
GET /api/pets
POST /api/pets
GET /api/pets/:id

// 훈련 과정
GET /api/courses
POST /api/courses
GET /api/courses/:id

// 쇼핑몰
GET /api/shop/products
GET /api/shop/cart
POST /api/shop/cart
```

## 4. 데이터베이스 구조

### 4.1 주요 테이블
```typescript
// 사용자
users {
  id: serial (PK)
  username: text
  email: text
  role: UserRole
  instituteId: integer (FK)
}

// 반려견
pets {
  id: serial (PK)
  name: text
  breed: text
  userId: integer (FK)
}

// 교육과정
courses {
  id: serial (PK)
  title: text
  trainerId: integer (FK)
  instituteId: integer (FK)
}

// 교육기관
institutes {
  id: serial (PK)
  name: text
  location: text
}
```

## 5. 서버 스펙

### 5.1 개발 환경
- Node.js 서버
- 포트: 5000
- WebSocket 지원 (/ws 엔드포인트)

### 5.2 배포 환경
- Replit 호스팅
- 자동 HTTPS 지원
- 실시간 업데이트

## 6. 보안

### 6.1 인증
- 세션 기반 인증
- 토스 본인인증 연동
- CSRF 보호

### 6.2 데이터 보안
- 환경변수 관리
- API 키 보안
- 사용자 데이터 암호화

## 7. 모니터링 및 로깅

### 7.1 시스템 로그
- API 요청/응답 로깅
- 에러 트래킹
- 성능 모니터링

### 7.2 사용자 활동
- 로그인 기록
- 중요 작업 감사 로그
- 보안 이벤트 추적

## 8. 확장성

### 8.1 모듈화
- 기능별 라우터 분리
- 컴포넌트 기반 UI
- 재사용 가능한 훅

### 8.2 성능 최적화
- 이미지 최적화
- 코드 분할
- 캐싱 전략

## 9. 개발 가이드라인

### 9.1 코드 스타일
- TypeScript 사용
- ESLint 규칙
- 접근성 준수

### 9.2 배포 프로세스
- 자동화된 빌드
- 테스트 자동화
- 무중단 배포
