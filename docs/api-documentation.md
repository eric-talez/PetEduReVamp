# TALEZ API 문서

## 📋 개요
TALEZ 플랫폼의 RESTful API 문서입니다. 모든 API는 JSON 형식으로 데이터를 주고받으며, 인증이 필요한 엔드포인트는 세션 기반 인증을 사용합니다.

## 🔑 인증
- **방식**: 세션 기반 인증
- **헤더**: `Cookie: connect.sid=<session-id>`
- **CSRF**: `X-CSRF-Token` 헤더 필요 (POST/PUT/DELETE 요청)

## 📊 응답 형식
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2025-08-08T15:30:00.000Z"
}
```

### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  },
  "timestamp": "2025-08-08T15:30:00.000Z"
}
```

## 🔐 인증 API

### POST /api/auth/login
사용자 로그인

**요청 본문:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "사용자명",
      "role": "user"
    },
    "sessionId": "sess_123456"
  }
}
```

### POST /api/auth/register
사용자 회원가입

**요청 본문:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "사용자명",
  "phone": "010-1234-5678"
}
```

### POST /api/auth/logout
로그아웃

### GET /api/auth/me
현재 사용자 정보 조회

## 👥 사용자 관리 API

### GET /api/users
사용자 목록 조회 (관리자만)

**쿼리 파라미터:**
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 20)
- `role`: 사용자 역할 필터
- `search`: 이름/이메일 검색

### GET /api/users/:id
특정 사용자 정보 조회

### PUT /api/users/:id
사용자 정보 수정

### DELETE /api/users/:id
사용자 삭제 (관리자만)

## 📚 교육 서비스 API

### GET /api/courses
강의 목록 조회

**쿼리 파라미터:**
- `page`: 페이지 번호
- `category`: 카테고리 필터
- `level`: 난이도 필터
- `search`: 제목/설명 검색

**응답:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": 1,
        "title": "반려견 기초 훈련",
        "description": "기본 명령어 훈련",
        "price": 150000,
        "duration": 480,
        "level": "beginner",
        "category": "basic",
        "trainer": {
          "id": 1,
          "name": "김훈련사",
          "avatar": "https://example.com/avatar.jpg"
        },
        "thumbnail": "https://example.com/course.jpg",
        "createdAt": "2025-08-08T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

### GET /api/courses/:id
강의 상세 정보 조회

### POST /api/courses
새 강의 생성 (트레이너/관리자만)

### PUT /api/courses/:id
강의 정보 수정

### DELETE /api/courses/:id
강의 삭제

### POST /api/courses/:id/enroll
강의 수강 신청

## 🧑‍🏫 트레이너 API

### GET /api/trainers
트레이너 목록 조회

### GET /api/trainers/:id
트레이너 상세 정보 조회

### POST /api/trainers
트레이너 등록 신청

### PUT /api/trainers/:id
트레이너 정보 수정

## 🛒 쇼핑몰 API

### GET /api/products
상품 목록 조회

**쿼리 파라미터:**
- `page`: 페이지 번호
- `category`: 카테고리 ID
- `minPrice`: 최소 가격
- `maxPrice`: 최대 가격
- `search`: 상품명 검색
- `sort`: 정렬 방식 (price_asc, price_desc, popular, newest)

### GET /api/products/:id
상품 상세 정보 조회

### POST /api/cart/add
장바구니에 상품 추가

**요청 본문:**
```json
{
  "productId": 1,
  "quantity": 2,
  "options": {
    "size": "M",
    "color": "blue"
  }
}
```

### GET /api/cart
장바구니 조회

### PUT /api/cart/:itemId
장바구니 항목 수정

### DELETE /api/cart/:itemId
장바구니에서 항목 제거

## 💳 결제 API

### POST /api/payment/create-intent
결제 인텐트 생성

**요청 본문:**
```json
{
  "items": [
    {
      "type": "course",
      "id": 1,
      "quantity": 1
    }
  ],
  "amount": 150000,
  "currency": "KRW"
}
```

### POST /api/payment/confirm
결제 확인

### GET /api/orders
주문 내역 조회

### GET /api/orders/:id
주문 상세 정보 조회

## 💬 커뮤니티 API

### GET /api/community/posts
게시글 목록 조회

**쿼리 파라미터:**
- `page`: 페이지 번호
- `category`: 카테고리 필터
- `sort`: 정렬 방식 (latest, popular, oldest)
- `search`: 제목/내용 검색

### GET /api/community/posts/:id
게시글 상세 조회

### POST /api/community/posts
새 게시글 작성

**요청 본문:**
```json
{
  "title": "게시글 제목",
  "content": "게시글 내용",
  "category": "general",
  "tags": ["훈련", "팁"]
}
```

### PUT /api/community/posts/:id
게시글 수정

### DELETE /api/community/posts/:id
게시글 삭제

### POST /api/community/posts/:id/comments
댓글 작성

### GET /api/community/posts/:id/comments
댓글 목록 조회

## 🤖 AI 분석 API

### POST /api/ai/analyze-behavior
반려견 행동 분석

**요청 본문:**
```json
{
  "petId": 1,
  "behaviorDescription": "강아지가 자꾸 짖어요",
  "videoUrl": "https://example.com/video.mp4",
  "duration": 300
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "behaviorType": "excessive_barking",
      "severity": "moderate",
      "causes": ["separation_anxiety", "territorial"],
      "recommendations": [
        {
          "action": "gradual_desensitization",
          "description": "점진적 둔감화 훈련을 시도해보세요",
          "priority": "high"
        }
      ],
      "estimatedImprovementTime": "2-4주"
    },
    "confidence": 0.87
  }
}
```

### POST /api/ai/generate-training-plan
맞춤형 훈련 계획 생성

### GET /api/ai/analysis-history/:petId
AI 분석 이력 조회

## 📍 위치 기반 서비스 API

### GET /api/locations/facilities
반려동물 시설 검색

**쿼리 파라미터:**
- `lat`: 위도
- `lng`: 경도
- `radius`: 검색 반경 (미터)
- `type`: 시설 유형 (hospital, hotel, cafe, park)

### GET /api/locations/facilities/:id
시설 상세 정보 조회

### POST /api/locations/reservations
시설 예약

## 🔔 알림 API

### GET /api/notifications
알림 목록 조회

### PUT /api/notifications/:id/read
알림 읽음 처리

### POST /api/notifications/settings
알림 설정 변경

## 📊 관리자 대시보드 API

### GET /api/admin/dashboard/stats
대시보드 통계 조회

**응답:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1250,
      "active": 980,
      "newThisMonth": 150
    },
    "courses": {
      "total": 45,
      "active": 42,
      "enrollments": 320
    },
    "revenue": {
      "thisMonth": 15000000,
      "lastMonth": 12000000,
      "growth": 25.0
    }
  }
}
```

### GET /api/admin/users
사용자 관리

### GET /api/admin/courses
강의 관리

### GET /api/admin/orders
주문 관리

### GET /api/admin/reports
신고 관리

## 📤 파일 업로드 API

### POST /api/upload/image
이미지 업로드

**요청**: `multipart/form-data`
- `file`: 이미지 파일
- `type`: 업로드 유형 (avatar, course_thumbnail, product_image)

**응답:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.example.com/images/123456.jpg",
    "filename": "uploaded_image.jpg",
    "size": 1024000
  }
}
```

### POST /api/upload/video
동영상 업로드

## 🔍 검색 API

### GET /api/search
통합 검색

**쿼리 파라미터:**
- `q`: 검색어
- `type`: 검색 유형 (all, courses, products, posts, trainers)
- `page`: 페이지 번호

## 📈 분석 API

### GET /api/analytics/popular
인기 콘텐츠 조회

### GET /api/analytics/user-activity
사용자 활동 분석

### GET /api/analytics/revenue
매출 분석

## ⚠️ 에러 코드

| 코드 | 설명 |
|------|------|
| `AUTH_REQUIRED` | 인증이 필요합니다 |
| `INVALID_CREDENTIALS` | 잘못된 인증 정보 |
| `PERMISSION_DENIED` | 권한이 없습니다 |
| `NOT_FOUND` | 리소스를 찾을 수 없습니다 |
| `VALIDATION_ERROR` | 입력값 검증 실패 |
| `RATE_LIMIT_EXCEEDED` | 요청 횟수 제한 초과 |
| `SERVER_ERROR` | 서버 내부 오류 |
| `PAYMENT_FAILED` | 결제 실패 |
| `FILE_TOO_LARGE` | 파일 크기 초과 |
| `UNSUPPORTED_FORMAT` | 지원하지 않는 파일 형식 |

## 🚀 성능 최적화

### 캐싱
- `Cache-Control` 헤더 활용
- ETags를 통한 조건부 요청
- Redis 기반 응답 캐싱

### 페이지네이션
- 커서 기반 페이지네이션 지원
- 최대 100개 항목까지 한 번에 조회 가능

### 압축
- gzip 압축 지원
- 큰 응답에 대한 자동 압축

## 🔒 보안

### HTTPS
- 모든 API는 HTTPS를 통해서만 접근 가능

### CORS
- 허용된 도메인에서만 API 접근 가능

### Rate Limiting
- IP별 시간당 요청 제한
- 인증된 사용자는 더 높은 제한

### Input Validation
- 모든 입력값에 대한 검증
- SQL Injection 방지
- XSS 방지

## 📞 지원

API 관련 문의사항이 있으시면:
- 이메일: dev@talez.com
- 문서 업데이트: 매주 금요일
- API 버전: v1.0.0