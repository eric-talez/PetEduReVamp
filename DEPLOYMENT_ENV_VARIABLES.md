# TALEZ 배포 환경 변수 가이드

## 필수 환경 변수

### 1. Google Maps API
```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```
- **용도**: 모든 지도 기능 (훈련사 위치, 주변 검색 등)
- **획득 방법**: [Google Cloud Console](https://console.cloud.google.com/)에서 Maps JavaScript API 활성화
- **참고**: 프로젝트의 모든 지도는 Google Maps를 사용합니다

### 2. 데이터베이스
```bash
DATABASE_URL=your_postgresql_connection_string
```
- **용도**: PostgreSQL 데이터베이스 연결
- **형식**: `postgresql://user:password@host:port/database`

## 선택적 환경 변수

### 3. 퀵로그인 활성화 (배포 환경)
```bash
VITE_ENABLE_QUICK_LOGIN=true
```
- **용도**: 배포 환경에서 퀵로그인 버튼 표시 여부
- **기본값**: 개발 환경에서는 자동으로 표시됨
- **참고**: 상용 배포 시에는 보안상 `false` 또는 설정하지 않는 것을 권장

### 4. Kakao Maps API (사용 안 함)
```bash
# VITE_KAKAO_MAPS_API_KEY=deprecated
# VITE_KAKAO_MAP_APP_KEY=deprecated
```
- **참고**: 현재 프로젝트는 Google Maps만 사용합니다
- 카카오 맵 관련 환경 변수는 설정하지 않아도 됩니다

### 5. 기타 OAuth 및 서비스
```bash
# OAuth 제공자
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# Stripe 결제
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

# Toss Payments (한국 시장)
TOSS_CLIENT_KEY=your_toss_client_key
TOSS_SECRET_KEY=your_toss_secret_key
```

## 배포 체크리스트

### 상용화 배포 전 필수 확인사항

1. **지도 API 설정**
   - [ ] `VITE_GOOGLE_MAPS_API_KEY` 설정 완료
   - [ ] Google Maps API 할당량 및 결제 설정 확인
   - [ ] 네이버/카카오 맵 관련 코드가 실행되지 않는지 확인

2. **테마 일관성**
   - [ ] 모든 페이지에서 ThemeProvider 사용 확인
   - [ ] localStorage의 `petedu-theme` 키 사용 일관성 확인

3. **보안**
   - [ ] 퀵로그인 버튼 비활성화 (`VITE_ENABLE_QUICK_LOGIN` 설정 안 함)
   - [ ] 모든 API 키가 환경 변수로 관리되는지 확인

4. **데이터베이스**
   - [ ] 프로덕션 데이터베이스 연결 문자열 설정
   - [ ] 데이터베이스 백업 설정 완료

## 환경별 설정 예시

### 개발 환경 (.env.development)
```bash
VITE_GOOGLE_MAPS_API_KEY=your_dev_key
DATABASE_URL=postgresql://localhost:5432/talez_dev
# VITE_ENABLE_QUICK_LOGIN은 설정하지 않음 (자동으로 true)
```

### 배포 환경 (.env.production)
```bash
VITE_GOOGLE_MAPS_API_KEY=your_production_key
DATABASE_URL=postgresql://production_host:5432/talez_prod
# VITE_ENABLE_QUICK_LOGIN=false (또는 설정하지 않음)
```

## 문제 해결

### 502 Bad Gateway 에러가 발생하는 경우
**원인**: 백엔드 서버가 응답하지 못하고 있음 (서버 크래시, DB 연결 실패, 환경 변수 누락 등)

**긴급 조치**:
```bash
# 1. 서버 로그 확인
pm2 logs talez
# 또는
docker logs talez-container

# 2. 서버 재시작
pm2 restart talez
# 또는
docker restart talez-container

# 3. 데이터베이스 연결 테스트
psql $DATABASE_URL -c "SELECT 1;"
```

**자세한 해결 방법**: `DEPLOYMENT_TROUBLESHOOTING.md` 참고

### API 타임아웃 문제
**증상**: 특정 API만 502 에러 (전체가 아님)

**해결 방법**:
1. **환경 변수 확인**: `VITE_GOOGLE_MAPS_API_KEY`와 `DATABASE_URL`이 올바르게 설정되었는지 확인
2. **Google API 할당량**: Google Cloud Console에서 Places API 할당량 확인
3. **타임아웃 처리**: 코드에 자동 타임아웃 보호 기능이 적용되어 있음
   - Google Places API: 10초 타임아웃
   - 데이터베이스 쿼리: 5초 타임아웃
   - API 호출 실패 시 빈 배열 반환
4. **네트워크**: 서버에서 Google API에 접근 가능한지 확인

### 지도가 표시되지 않는 경우
1. `VITE_GOOGLE_MAPS_API_KEY`가 올바르게 설정되었는지 확인
2. Google Cloud Console에서 Maps JavaScript API가 활성화되었는지 확인
3. API 키의 도메인 제한 설정 확인

### 테마가 페이지마다 다른 경우
1. 브라우저 개발자 도구의 Application > Local Storage 확인
2. `petedu-theme` 키의 값 확인 (light/dark/system)
3. 페이지를 새로고침하여 ThemeProvider 초기화 확인

### 퀵로그인 버튼이 표시되지 않는 경우 (배포 환경)
- 의도된 동작입니다. 배포 환경에서 퀵로그인을 활성화하려면 `VITE_ENABLE_QUICK_LOGIN=true` 설정

### 지도 검색이 느린 경우
- Google Places API와 데이터베이스 모두 사용하므로 첫 검색에 시간이 걸릴 수 있음
- 타임아웃 설정으로 최대 10초 이상 대기하지 않음
- 실패 시 자동으로 graceful fallback 처리됨
