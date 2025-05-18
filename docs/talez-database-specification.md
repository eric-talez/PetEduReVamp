
# TALEZ 데이터베이스 테이블 명세서

## 1. 사용자 관련 테이블

### 1.1 users (사용자)
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | serial | Y | AUTO | Primary Key |
| username | text | Y | - | 사용자명 (unique) |
| password | text | Y | - | 암호화된 비밀번호 |
| email | text | Y | - | 이메일 (unique) |
| name | text | Y | - | 실명 |
| role | text | Y | 'user' | 권한 (user/pet-owner/trainer/institute-admin/admin) |
| avatar | text | N | null | 프로필 이미지 URL |
| created_at | timestamp | Y | now() | 생성일시 |
| bio | text | N | null | 자기소개 |
| location | text | N | null | 위치 |
| specialty | text | N | null | 전문분야 |
| is_verified | boolean | Y | false | 인증여부 |
| institute_id | integer | N | null | 소속 기관 ID (FK) |

### 1.2 pets (반려견)
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | serial | Y | AUTO | Primary Key |
| name | text | Y | - | 반려견 이름 |
| breed | text | Y | - | 품종 |
| age | text | Y | - | 나이 |
| gender | text | Y | - | 성별 |
| weight | text | Y | - | 체중 |
| photo | text | N | null | 사진 URL |
| user_id | integer | Y | - | 보호자 ID (FK) |
| health | text | N | null | 건강상태 |
| temperament | text | N | null | 성격 |
| allergies | text | N | null | 알러지 정보 |
| created_at | timestamp | Y | now() | 등록일시 |
| updated_at | timestamp | Y | now() | 수정일시 |

## 2. 교육 관련 테이블

### 2.1 courses (교육과정)
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | serial | Y | AUTO | Primary Key |
| title | text | Y | - | 과정명 |
| description | text | Y | - | 설명 |
| image | text | N | null | 대표이미지 URL |
| price | integer | Y | - | 가격 |
| duration | text | Y | - | 교육기간 |
| level | text | Y | - | 난이도 |
| category | text | Y | - | 카테고리 |
| trainer_id | integer | Y | - | 담당 훈련사 ID (FK) |
| institute_id | integer | N | null | 소속 기관 ID (FK) |
| is_popular | boolean | Y | false | 인기과정 여부 |
| is_certified | boolean | Y | false | 인증과정 여부 |
| syllabus | json | N | null | 커리큘럼 |
| created_at | timestamp | Y | now() | 등록일시 |
| updated_at | timestamp | Y | now() | 수정일시 |

### 2.2 enrollments (수강신청)
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | serial | Y | AUTO | Primary Key |
| user_id | integer | Y | - | 수강생 ID (FK) |
| course_id | integer | Y | - | 과정 ID (FK) |
| progress | integer | Y | 0 | 진도율 |
| status | varchar(20) | Y | 'inProgress' | 상태 |
| start_date | timestamp | Y | now() | 시작일 |
| end_date | timestamp | N | null | 종료일 |
| completed | boolean | Y | false | 수료여부 |
| certificate_issued | boolean | Y | false | 수료증 발급여부 |

## 3. 교육기관 관련 테이블

### 3.1 institutes (교육기관)
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | serial | Y | AUTO | Primary Key |
| name | text | Y | - | 기관명 |
| description | text | Y | - | 소개 |
| image | text | N | null | 대표이미지 URL |
| location | text | Y | - | 위치 |
| facilities | json | N | null | 시설정보 |
| opening_hours | text | Y | - | 운영시간 |
| category | text | Y | - | 카테고리 |
| certification | boolean | Y | false | 인증여부 |
| premium | boolean | Y | false | 프리미엄여부 |
| established | text | N | null | 설립일 |
| created_at | timestamp | Y | now() | 등록일시 |
| updated_at | timestamp | Y | now() | 수정일시 |

## 4. 건강/훈련 기록 테이블

### 4.1 vaccinations (예방접종)
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | serial | Y | AUTO | Primary Key |
| pet_id | integer | Y | - | 반려견 ID (FK) |
| name | text | Y | - | 백신명 |
| date | timestamp | Y | - | 접종일 |
| next_due | timestamp | N | null | 다음 접종예정일 |
| notes | text | N | null | 비고 |

### 4.2 training_sessions (훈련기록)
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | serial | Y | AUTO | Primary Key |
| pet_id | integer | Y | - | 반려견 ID (FK) |
| course_id | integer | N | null | 과정 ID (FK) |
| name | text | Y | - | 훈련명 |
| date | timestamp | Y | - | 훈련일 |
| notes | text | N | null | 특이사항 |

### 4.3 achievements (성과기록)
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | serial | Y | AUTO | Primary Key |
| pet_id | integer | Y | - | 반려견 ID (FK) |
| name | text | Y | - | 성과명 |
| date | timestamp | Y | - | 달성일 |
| description | text | N | null | 설명 |

## 5. 커뮤니티 테이블

### 5.1 posts (게시글)
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | serial | Y | AUTO | Primary Key |
| author_id | integer | Y | - | 작성자 ID (FK) |
| title | text | Y | - | 제목 |
| content | text | Y | - | 내용 |
| image | text | N | null | 이미지 URL |
| tag | text | N | null | 태그 |
| likes | integer | Y | 0 | 좋아요 수 |
| comments | integer | Y | 0 | 댓글 수 |
| created_at | timestamp | Y | now() | 작성일시 |
| updated_at | timestamp | Y | now() | 수정일시 |

## 6. 정산 관련 테이블

### 6.1 commission_policies (수수료 정책)
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | serial | Y | AUTO | Primary Key |
| name | text | Y | - | 정책명 |
| type | text | Y | - | 유형 |
| base_rate | integer | Y | - | 기본 수수료율 |
| status | text | Y | 'active' | 상태 |
| description | text | N | null | 설명 |
| created_at | timestamp | Y | now() | 생성일시 |
| updated_at | timestamp | Y | now() | 수정일시 |

### 6.2 commission_tiers (수수료 등급)
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | serial | Y | AUTO | Primary Key |
| policy_id | integer | Y | - | 정책 ID (FK) |
| name | text | Y | - | 등급명 |
| min_sales | integer | Y | - | 최소 매출액 |
| rate | integer | Y | - | 수수료율 |

### 6.3 commission_transactions (수수료 거래)
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | serial | Y | AUTO | Primary Key |
| user_id | integer | Y | - | 사용자 ID (FK) |
| order_number | text | Y | - | 주문번호 |
| product_name | text | Y | - | 상품명 |
| order_amount | integer | Y | - | 주문금액 |
| commission_amount | integer | Y | - | 수수료금액 |
| commission_rate | integer | Y | - | 적용 수수료율 |
| status | text | Y | 'pending' | 상태 |
| referral_code | text | N | null | 추천인 코드 |
| created_at | timestamp | Y | now() | 생성일시 |
| paid_at | timestamp | N | null | 지급일시 |

### 6.4 settlement_reports (정산 보고서)
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | serial | Y | AUTO | Primary Key |
| user_id | integer | Y | - | 사용자 ID (FK) |
| period_start | timestamp | Y | - | 정산기간 시작 |
| period_end | timestamp | Y | - | 정산기간 종료 |
| total_commission | integer | Y | - | 총 수수료 |
| transaction_count | integer | Y | - | 거래 건수 |
| status | text | Y | 'pending' | 상태 |
| created_at | timestamp | Y | now() | 생성일시 |
| updated_at | timestamp | N | null | 수정일시 |
| paid_at | timestamp | N | null | 지급일시 |
| payment_method | text | N | null | 지급방법 |
| bank_info | text | N | null | 계좌정보 |
