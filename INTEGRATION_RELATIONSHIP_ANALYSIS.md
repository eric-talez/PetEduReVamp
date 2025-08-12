# TALEZ 플랫폼 통합 관계 분석 보고서

## 개요
실제 상품, 기관 코드, 훈련사 연동, 훈련사 알림장, 견주 알림장 간의 연결 관계를 분석한 결과를 정리합니다.

## 1. 실제 상품 시스템 (Products System)

### 데이터베이스 스키마
```sql
products 테이블:
- id: 상품 고유 ID
- name: 상품명
- description: 상품 설명
- price: 가격
- category_id: 카테고리 ID
- images: 상품 이미지 (JSON)
- stock: 재고
- rating: 평점
- review_count: 리뷰 수
```

### 연동 관계
- **훈련사 연결**: 
  - `TrainerRecommendation` 인터페이스를 통해 훈련사가 상품 추천 가능
  - `commissionRate` 필드로 훈련사 수수료율 관리
  - `referralCommission` 필드로 추천 수익 분배

- **교육과정 연결**: 
  - `AdminCurriculum.tsx`에서 `handleMaterialClick` 함수를 통해 교육 준비물과 상품 연동
  - 커리큘럼 모듈의 `materials` 필드와 상품 정보 매핑

## 2. 기관 코드 시스템 (Institutes System)

### 데이터베이스 스키마
```sql
institutes 테이블:
- id: 기관 고유 ID
- name: 기관명
- subscriptionPlan: 구독 플랜 (starter/standard/professional/enterprise)
- subscriptionStatus: 구독 상태
- maxMembers: 최대 회원수
- featuresEnabled: 활성화된 기능 (JSON)
```

### 연동 관계
- **구독 관리**: 
  - `subscriptionPlans` 테이블과 연동하여 기관별 서비스 제한 관리
  - `AdminCommission.tsx`에서 기관별 구독 상품 관리

- **훈련사 소속**: 
  - 훈련사가 특정 기관에 소속되어 활동할 수 있는 구조
  - 기관별 훈련사 관리 및 수익 분배 체계

## 3. 훈련사 연동 시스템 (Trainer Integration)

### 핵심 테이블들
```sql
- trainers: 기본 훈련사 정보
- trainerActivityLogs: 훈련사 활동 로그
- trainerRankings: 훈련사 등급 시스템
- incentivePayments: 인센티브 지급 내역
- monthlyPointSummary: 월별 포인트 합산
```

### 연동 포인트
1. **상품 추천 시스템**:
   - `TrainerRecommendation` 인터페이스로 상품-훈련사 연결
   - 추천 상품별 수수료율 및 판매 실적 관리

2. **커리큘럼 관리**:
   - `CurriculumData`에서 `trainerId`, `trainerName` 필드로 연결
   - 훈련사별 강의 수익 분배율 관리 (`revenueShare`)

3. **활동 추적**:
   - `activityType`: 'review_video', 'consultation', 'course_creation' 등
   - 포인트 및 인센티브 자동 계산 시스템

## 4. 훈련사 알림장 시스템

### 현재 구현 상태
- **알림 서비스**: `NotificationService` 클래스로 WebSocket 기반 실시간 알림
- **알림 테이블**: `notifications` 테이블에 사용자별 알림 저장
- **메시징 시스템**: `server/messaging/` 디렉토리에 메시징 기능 구현

### 훈련사 전용 알림 유형
```typescript
알림 타입:
- 'consultation': 상담 요청 알림
- 'course_enrollment': 강의 등록 알림  
- 'revenue_update': 수익 업데이트 알림
- 'ranking_change': 등급 변동 알림
- 'incentive_payment': 인센티브 지급 알림
```

## 5. 견주 알림장 시스템

### 현재 구현 상태
- **반려동물 관리**: `pets` 테이블로 견주-반려동물 관계 관리
- **예약 시스템**: `reservations` 테이블로 훈련사-견주 예약 관리
- **건강 관리**: `vaccinations`, `checkups` 테이블로 건강 정보 추적

### 견주 전용 알림 유형
```typescript
알림 타입:
- 'vaccination_due': 예방접종 일정 알림
- 'checkup_reminder': 건강검진 알림
- 'reservation_confirmed': 예약 확정 알림
- 'training_progress': 훈련 진도 알림
- 'product_recommendation': 상품 추천 알림
```

## 6. 통합 연결 관계 매트릭스

| 시스템 구성요소 | 상품 | 기관 | 훈련사 | 훈련사 알림장 | 견주 알림장 |
|----------------|------|------|--------|--------------|------------|
| **상품 시스템** | ✅ | 🔄 | ✅ | ✅ | ✅ |
| **기관 시스템** | 🔄 | ✅ | ✅ | ✅ | 🔄 |
| **훈련사 시스템** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **알림 시스템** | ✅ | ✅ | ✅ | ✅ | ✅ |

범례:
- ✅ 완전 연동 (실제 데이터 연결)
- 🔄 부분 연동 (구조는 있으나 완전 구현 필요)
- ❌ 연동 없음

## 7. 개선 필요사항

### A. 데이터 연동 강화
1. **기관-상품 연결**: 기관별 추천 상품 관리 시스템 필요
2. **실시간 동기화**: 상품 재고, 예약 상태 등 실시간 업데이트 체계
3. **통합 대시보드**: 모든 시스템의 데이터를 통합한 관리 대시보드

### B. 알림 시스템 개선
1. **개인화된 알림**: 사용자 역할별 맞춤형 알림 설정
2. **알림 우선순위**: 중요도별 알림 분류 및 표시
3. **배치 알림**: 일괄 알림 발송 시스템

### C. 비즈니스 로직 강화
1. **자동 수수료 계산**: 상품 판매시 훈련사 수수료 자동 계산
2. **포인트 시스템**: 활동별 포인트 적립 및 등급 자동 업데이트
3. **수익 분배**: 실시간 수익 분배 및 정산 시스템

## 8. 결론

현재 TALEZ 플랫폼은 기본적인 데이터 구조와 연동 시스템이 구축되어 있으나, 실제 비즈니스 로직과 실시간 연동 부분에서 추가 개발이 필요한 상태입니다. 

주요 강점:
- 포괄적인 데이터베이스 스키마
- WebSocket 기반 실시간 알림 시스템
- 훈련사-견주-상품 간 기본 연결 구조

개선 영역:
- 실시간 데이터 동기화
- 자동화된 비즈니스 프로세스
- 통합 관리 대시보드

이러한 분석을 바탕으로 단계적인 개선 계획을 수립하여 플랫폼의 완성도를 높일 수 있을 것으로 판단됩니다.