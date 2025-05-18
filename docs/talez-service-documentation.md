
# TALEZ 서비스 종합 문서

## 1. API 명세서

### 1.1 인증 API
- POST /api/auth/login: 로그인
- POST /api/auth/logout: 로그아웃 
- GET /api/auth/me: 현재 사용자 정보
- POST /api/auth/register: 회원가입
- POST /api/auth/verify-identity: 본인인증

### 1.2 사용자 API
- GET /api/users/:id: 사용자 정보 조회
- PATCH /api/users/profile: 프로필 업데이트
- GET /api/users/search: 사용자 검색

### 1.3 반려견 API
- GET /api/pets: 사용자의 반려견 목록
- GET /api/pets/:id: 특정 반려견 정보
- POST /api/pets: 새 반려견 등록

### 1.4 교육 API
- GET /api/courses: 전체 강좌 목록
- GET /api/courses/:id: 강좌 상세 정보
- POST /api/courses: 강좌 생성 (훈련사용)
- POST /api/courses/:id/enroll: 강좌 등록
- GET /api/user/courses: 등록된 강좌 목록

### 1.5 훈련사 API
- GET /api/trainers: 전체 훈련사 목록
- GET /api/trainers/:id: 훈련사 상세 정보

### 1.6 기관 API
- GET /api/institutes: 교육기관 목록
- GET /api/institutes/:id: 기관 상세 정보
- POST /api/institutes: 기관 등록

### 1.7 화상 교육 API
- WebSocket /ws: 실시간 화상 통신
- GET /api/video-call/rooms: 화상룸 목록
- POST /api/video-call/rooms: 화상룸 생성

### 1.8 결제/정산 API
- POST /api/shop/check-referral: 추천인 코드 확인
- GET /api/shop/cart: 장바구니 조회
- POST /api/shop/cart: 장바구니 담기
- GET /api/shop/orders: 주문 내역
- POST /api/shop/orders: 주문 생성

## 2. 메뉴별 기능 흐름

### 2.1 회원가입/로그인
1. 회원가입
   - 이메일/휴대폰 인증
   - 약관 동의
   - 프로필 설정
   - 회원 유형 선택

2. 로그인
   - 일반 로그인
   - 소셜 로그인
   - 본인인증

### 2.2 반려견 관리
1. 반려견 등록
   - 기본 정보 입력
   - 건강 정보 입력
   - 사진 등록

2. 반려견 프로필
   - 건강 기록
   - 예방접종 기록
   - 훈련 이력

### 2.3 교육 시스템
1. 강좌 관리 (훈련사)
   - 강좌 등록
   - 커리큘럼 설계
   - 수강생 관리
   - 평가/피드백

2. 수강 관리 (반려견 주인)
   - 강좌 검색/등록
   - 진도 관리
   - 과제 제출
   - 평가 확인

### 2.4 커뮤니티
1. 게시판
   - 공지사항
   - Q&A
   - 경험 공유
   - 리뷰/평가

2. 메시징
   - 1:1 대화
   - 그룹 채팅
   - 파일 공유

## 3. 데이터베이스 구조

### 3.1 주요 테이블
1. users
   - id (PK)
   - username
   - email
   - password
   - role
   - instituteId (FK)

2. pets
   - id (PK)
   - name
   - breed
   - userId (FK)
   - health
   - temperament

3. courses
   - id (PK)
   - title
   - description
   - trainerId (FK)
   - instituteId (FK)
   - price
   - duration

4. enrollments
   - id (PK)
   - userId (FK)
   - courseId (FK)
   - progress
   - status
   - startDate

5. institutes
   - id (PK)
   - name
   - location
   - facilities
   - certification

## 4. 권한별 접근 제어

### 4.1 일반 사용자 (user)
- 강좌 목록 조회
- 훈련사 검색
- 커뮤니티 읽기
- 기본 정보 수정

### 4.2 반려견 주인 (pet-owner)
- 반려견 프로필 관리
- 강좌 수강
- 훈련사와 소통
- 리뷰 작성
- 건강기록 관리

### 4.3 훈련사 (trainer)
- 강좌 개설/관리
- 수강생 관리
- 평가/피드백 제공
- 전문가 프로필 관리
- 수익 통계 확인

### 4.4 기관 관리자 (institute-admin)
- 소속 훈련사 관리
- 기관 강좌 관리
- 시설 관리
- 매출 통계 확인

### 4.5 시스템 관리자 (admin)
- 전체 사용자 관리
- 시스템 설정
- 콘텐츠 관리
- 통계/분석

## 5. 페이지 라우트 구조

### 5.1 메인 페이지
- /: 홈페이지
- /courses: 강좌 목록
- /trainers: 훈련사 목록
- /institutes: 교육기관 목록
- /community: 커뮤니티

### 5.2 사용자 페이지
- /my-page: 마이페이지
- /my-pets: 반려견 관리
- /my-courses: 수강 관리
- /messages: 메시지함
- /notifications: 알림

### 5.3 훈련사 페이지
- /trainer/dashboard: 대시보드
- /trainer/courses: 강좌 관리
- /trainer/students: 수강생 관리
- /trainer/schedule: 일정 관리
- /trainer/earnings: 수익 관리

### 5.4 기관 관리 페이지
- /institute/dashboard: 대시보드
- /institute/trainers: 훈련사 관리
- /institute/courses: 강좌 관리
- /institute/facilities: 시설 관리
- /institute/stats: 통계

### 5.5 관리자 페이지
- /admin/dashboard: 대시보드
- /admin/users: 사용자 관리
- /admin/contents: 콘텐츠 관리
- /admin/settings: 시스템 설정
- /admin/stats: 통계/분석
