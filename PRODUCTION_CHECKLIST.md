# TALEZ 상용화 체크리스트

## 🎯 상용화 준비도: 85%

이 문서는 TALEZ 플랫폼을 상용화하기 위한 필수 점검 항목들입니다.

---

## ✅ 완료된 항목

### 1. 보안 (Security)
- [x] 토스페이먼츠 하드코딩 제거 (환경 변수 필수화)
- [x] API 엔드포인트 CSRF 보호 적용 (/api/toss/confirm, /api/toss/cancel)
- [x] API 엔드포인트 인증 미들웨어 적용 (requireAuth)
- [x] 세션 관리 보안 설정 (httpOnly, secure, sameSite)
- [x] 비밀번호 해싱 (bcrypt)
- [x] SQL 인젝션 방지 (Drizzle ORM)

### 2. 결제 시스템 (Payment System)
- [x] 토스페이먼츠 통합 완료
- [x] 결제 승인 API (/api/toss/confirm)
- [x] 결제 조회 API (/api/toss/payment/:paymentKey)
- [x] 결제 취소 API (/api/toss/cancel)
- [x] 프론트엔드 SDK 통합 (checkout.tsx)
- [x] 성공/실패 페이지 구현
- [x] 환경 변수 기반 키 관리

### 3. 코드 품질 (Code Quality)
- [x] TypeScript 컴파일 오류 0개
- [x] LSP 진단 오류 0개
- [x] 프로덕션 빌드 성공
- [x] 중복 className 경고 수정

### 4. 배포 준비 (Deployment Ready)
- [x] Docker 설정 완료
- [x] PM2 설정 완료
- [x] Nginx 설정 준비
- [x] 환경 변수 문서화 (DEPLOYMENT.md)
- [x] GitHub Actions CI/CD 파이프라인

---

## ⚠️ 상용화 전 필수 작업

### 1. 환경 변수 설정 (CRITICAL)

#### 필수 환경 변수
```bash
# 데이터베이스
DATABASE_URL=postgresql://user:password@host:port/dbname

# 토스페이먼츠 (CRITICAL)
VITE_TOSS_CLIENT_KEY=live_ck_...  # ⚠️ 실제 키로 교체 필수
TOSS_SECRET_KEY=live_sk_...       # ⚠️ 실제 키로 교체 필수

# AI 서비스
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...

# 이메일 서비스
SENDGRID_API_KEY=SG....

# 소셜 로그인
KAKAO_CLIENT_ID=...
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# 지도 서비스
VITE_NAVER_CLIENT_ID=...
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
VITE_KAKAO_MAP_APP_KEY=...

# 보안
JWT_SECRET=...  # ⚠️ 랜덤 문자열 생성 필수
SESSION_SECRET=...  # ⚠️ 랜덤 문자열 생성 필수

# 기타
NODE_ENV=production
PORT=5000
```

#### 토스페이먼츠 실제 키 발급 방법
1. https://developers.tosspayments.com/ 로그인
2. 개발자센터 > 내 개발정보 > API 키
3. **실 운영용 키** 발급 (사업자 등록 필수)
   - 테스트 키로는 실제 결제 불가
   - 사업자 등록증 제출 후 승인 필요
4. 클라이언트 키와 시크릿 키를 각각 `VITE_TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY`에 설정

### 2. 데이터베이스 (Database)

#### 결제 정보 저장 로직 추가 필요
현재 `/api/toss/confirm`에서 결제 정보를 데이터베이스에 저장하지 않음 (주석 처리됨)

**TODO:**
```typescript
// server/routes.ts의 /api/toss/confirm 엔드포인트 수정 필요
await storage.createTransaction({
  userId: req.user?.id,
  transactionType: 'course_payment',
  paymentProvider: 'toss',
  externalTransactionId: paymentResult.paymentKey,
  amount: paymentResult.totalAmount,
  status: 'completed',
  // ... 기타 필드
});
```

#### 토스페이먼츠 전용 테이블 추가 고려
`transactions` 테이블로 충분하지만, 더 상세한 정보 저장이 필요할 경우:

```typescript
// shared/schema.ts에 추가 고려
export const tossPayments = pgTable("toss_payments", {
  id: serial("id").primaryKey(),
  paymentKey: varchar("payment_key", { length: 200 }).notNull().unique(),
  orderId: varchar("order_id", { length: 64 }).notNull(),
  orderName: varchar("order_name", { length: 100 }),
  userId: integer("user_id").references(() => users.id),
  method: varchar("method", { length: 50 }), // 카드, 가상계좌, 계좌이체 등
  totalAmount: integer("total_amount").notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  requestedAt: timestamp("requested_at"),
  approvedAt: timestamp("approved_at"),
  receiptUrl: text("receipt_url"),
  rawData: jsonb("raw_data"), // 토스페이먼츠 전체 응답
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 3. 테스트 (Testing)

#### 결제 플로우 E2E 테스트
- [ ] 테스트 환경에서 토스페이먼츠 샌드박스 키로 결제 테스트
- [ ] 결제 성공 시나리오 검증
- [ ] 결제 실패 시나리오 검증
- [ ] 결제 취소 시나리오 검증
- [ ] 에러 메시지 확인

#### 성능 테스트
- [ ] 동시 접속 100명 테스트
- [ ] 결제 동시 처리 테스트
- [ ] 응답 시간 측정 (목표: < 1초)

### 4. 모니터링 및 로깅 (Monitoring & Logging)

#### Sentry 설정 완료 확인
- [ ] Sentry DSN 설정
- [ ] 에러 트래킹 테스트
- [ ] 알림 설정 (이메일, Slack 등)

#### 로그 시스템 점검
- [ ] Winston 로그 레벨 확인 (production: warn 이상)
- [ ] 로그 로테이션 설정 (일일 로그 파일)
- [ ] 결제 로그 별도 관리

### 5. 성능 최적화 (Performance)

#### 프론트엔드
- [ ] 이미지 최적화 (WebP, lazy loading)
- [ ] 코드 스플리팅 최적화 (현재 경고 해결)
- [ ] CDN 설정 (정적 파일)
- [ ] Service Worker 설정 (PWA)

#### 백엔드
- [ ] 데이터베이스 인덱스 최적화
- [ ] API 응답 캐싱 (Redis)
- [ ] Connection Pool 설정
- [ ] Rate Limiting 점검

### 6. 법적 준비 (Legal)

- [ ] 개인정보 처리방침 작성
- [ ] 이용약관 작성
- [ ] 환불 정책 수립
- [ ] 사업자 등록증 준비
- [ ] 통신판매업 신고
- [ ] PG사 계약 (토스페이먼츠)

### 7. 보안 강화 (Security Hardening)

#### SSL/TLS
- [ ] SSL 인증서 발급 (Let's Encrypt)
- [ ] HTTPS 강제 리다이렉트
- [ ] HSTS 헤더 설정

#### 추가 보안 설정
- [ ] 비밀번호 정책 강화 (최소 길이, 복잡도)
- [ ] 로그인 실패 횟수 제한
- [ ] IP 화이트리스트 (관리자 페이지)
- [ ] 웹훅 서명 검증 (토스페이먼츠)

### 8. 백업 및 복구 (Backup & Recovery)

- [ ] 데이터베이스 자동 백업 설정 (일 1회)
- [ ] 백업 복구 테스트
- [ ] 재해 복구 계획 수립
- [ ] 스냅샷 정책 설정

---

## 📋 상용화 체크리스트 요약

### Phase 1: 필수 보안 설정 (CRITICAL)
1. ✅ 토스페이먼츠 실제 키 발급 및 설정
2. ✅ JWT_SECRET, SESSION_SECRET 랜덤 문자열 생성
3. ✅ SSL 인증서 발급 및 HTTPS 설정
4. ✅ 데이터베이스 백업 자동화

### Phase 2: 결제 시스템 완성
1. ⚠️ 결제 정보 데이터베이스 저장 로직 구현
2. ⚠️ 토스페이먼츠 웹훅 구현 (결제 완료/취소 알림)
3. ⚠️ E2E 결제 테스트 (샌드박스 → 실제)
4. ⚠️ 환불 프로세스 구현

### Phase 3: 성능 및 안정성
1. ⚠️ Redis 캐시 설정
2. ⚠️ 부하 테스트 (100명 동시 접속)
3. ⚠️ 에러 모니터링 (Sentry)
4. ⚠️ 로그 분석 대시보드

### Phase 4: 법적 준비
1. ⚠️ 개인정보 처리방침
2. ⚠️ 이용약관
3. ⚠️ 사업자 등록
4. ⚠️ PG사 실계약

---

## 🚀 배포 절차

1. **환경 변수 설정**: 모든 필수 환경 변수 설정 확인
2. **데이터베이스 마이그레이션**: `npm run db:push --force`
3. **프로덕션 빌드**: `npm run build`
4. **Docker 배포**: `docker-compose -f docker-compose.prod.yml up -d`
5. **헬스 체크**: API 엔드포인트 응답 확인
6. **결제 테스트**: 토스페이먼츠 샌드박스로 테스트 결제
7. **모니터링 확인**: Sentry, 로그 확인
8. **실제 키 전환**: 테스트 키 → 실제 키
9. **최종 결제 테스트**: 소액 실제 결제 테스트
10. **런칭**: DNS 설정 및 공개

---

## 📞 긴급 연락처

- **개발 팀**: [연락처 추가]
- **토스페이먼츠 고객센터**: 1544-7772
- **서버 호스팅**: [연락처 추가]
- **데이터베이스**: [연락처 추가]

---

## 📝 변경 이력

- **2025-10-25**: 초기 체크리스트 작성
  - 토스페이먼츠 통합 완료
  - 보안 수정 완료 (하드코딩 제거)
  - 프로덕션 빌드 테스트 완료
