# TALEZ 배포 체크리스트 (2025-11-03)

## 🚀 배포 전 필수 점검 사항

### 1. 환경 변수 설정 ✅
배포 서버의 `.env.production` 파일에 다음 변수들이 설정되어 있어야 합니다:

```bash
# 필수 환경 변수
DATABASE_URL=postgresql://user:password@host:port/database
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NODE_ENV=production

# 선택 환경 변수 (상용화 시)
VITE_ENABLE_QUICK_LOGIN=false  # 보안상 false로 설정
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

**확인 방법**:
```bash
ssh user@13.125.73.213
cd /path/to/talez
cat .env.production
```

### 2. 데이터베이스 마이그레이션 ⚠️
최신 변경사항: **vaccinations 테이블 추가** (예방접종 스케줄 관리 기능)

**배포 서버에서 실행**:
```bash
cd /path/to/talez
npm run db:push --force
```

**예상 결과**:
- `vaccinations` 테이블 생성됨
- 기존 데이터 유지됨

**실패 시 대응**:
```bash
# 데이터베이스 연결 테스트
psql $DATABASE_URL -c "SELECT 1;"

# 테이블 확인
psql $DATABASE_URL -c "\dt vaccinations"
```

### 3. 코드 배포 📦

**Git 배포**:
```bash
cd /path/to/talez
git pull origin main
npm install --production
npm run build
```

**빌드 확인**:
```bash
# dist 폴더 생성 확인
ls -la dist/

# 중요 파일 존재 확인
ls dist/server/index.js
ls dist/client/index.html
```

### 4. 서버 재시작 🔄

**PM2 사용 시**:
```bash
pm2 restart talez
pm2 save
```

**Docker 사용 시**:
```bash
docker restart talez-container
```

**재시작 후 로그 확인**:
```bash
pm2 logs talez --lines 50
# 또는
docker logs -f talez-container
```

### 5. API 엔드포인트 테스트 🧪

**서버에서 직접 테스트**:
```bash
# 헬스 체크
curl http://localhost:5000/api/dashboard/system/status

# 로고 API
curl http://localhost:5000/api/logo

# 기관 목록
curl http://localhost:5000/api/institutes

# 예방접종 API (새로 추가됨)
curl http://localhost:5000/api/vaccinations/user/1
```

**외부에서 테스트**:
```bash
curl https://funnytalez.com/api/dashboard/system/status
curl https://funnytalez.com/api/logo
curl https://funnytalez.com/api/institutes
```

**예상 응답**: JSON 데이터 (502 에러가 아님)

## 🔍 502 Bad Gateway 에러 해결

### 즉시 확인할 사항
1. **서버 프로세스 상태**:
```bash
pm2 status
# 또는
docker ps
```

2. **서버 로그** (가장 중요!):
```bash
pm2 logs talez --err --lines 100
# 또는
docker logs talez-container --tail 100
```

3. **데이터베이스 연결**:
```bash
psql $DATABASE_URL -c "SELECT 1;"
```

### 일반적인 원인과 해결

#### 원인 1: 데이터베이스 연결 실패
**증상**: 로그에 `ECONNREFUSED` 또는 `Connection terminated` 에러

**해결**:
```bash
# DATABASE_URL 확인
echo $DATABASE_URL

# PostgreSQL 서버 상태 확인
sudo systemctl status postgresql

# 방화벽 확인
sudo ufw status
```

#### 원인 2: 환경 변수 누락
**증상**: 로그에 `VITE_GOOGLE_MAPS_API_KEY is not defined` 에러

**해결**:
```bash
# .env.production 파일 확인
cat .env.production

# PM2 환경 변수 확인
pm2 env 0
```

#### 원인 3: 포트 충돌
**증상**: 로그에 `Port 5000 is already in use` 에러

**해결**:
```bash
# 포트 5000 사용 프로세스 확인
sudo lsof -i :5000

# 프로세스 종료
sudo kill -9 <PID>
```

#### 원인 4: 메모리 부족
**증상**: 서버가 반복적으로 재시작됨

**해결**:
```bash
# 메모리 사용량 확인
free -h
top

# PM2 메모리 제한 증가
pm2 start ecosystem.config.js --max-memory-restart 1G
```

## 📊 배포 후 검증

### 1. 프론트엔드 접근성 테스트
- [ ] https://funnytalez.com 접속 확인
- [ ] 로그인 페이지 작동 확인
- [ ] 지도 표시 확인 (Google Maps)
- [ ] 다크 모드 전환 확인

### 2. 주요 기능 테스트
- [ ] 사용자 로그인/로그아웃
- [ ] 훈련사 목록 조회
- [ ] 기관 검색 (지도 포함)
- [ ] 위치 검색 (/api/locations/search)
- [ ] 예방접종 스케줄 관리 (신규 기능)

### 3. API 응답 시간 확인
```bash
# 브라우저 개발자 도구 Network 탭에서 확인
# 평균 응답 시간: <300ms 목표
# Google Places API: <10초 (타임아웃 설정)
```

### 4. 에러 로그 모니터링
```bash
# 실시간 로그 모니터링 (5분간)
pm2 logs talez --lines 0

# 에러 발생 여부 확인
pm2 logs talez --err --lines 50
```

## 🆕 최신 변경사항 (2025-11-03)

### 예방접종 스케줄 관리 기능
- **데이터베이스**: `vaccinations` 테이블 추가
- **API 엔드포인트**: 7개 추가
  - GET `/api/vaccinations/user/:userId` - 사용자별 조회
  - GET `/api/vaccinations/pet/:petId` - 반려동물별 조회
  - GET `/api/vaccinations/upcoming/:userId` - 다가오는 일정
  - GET `/api/vaccinations/:id` - 단일 조회
  - POST `/api/vaccinations` - 생성
  - PATCH `/api/vaccinations/:id` - 수정
  - DELETE `/api/vaccinations/:id` - 삭제
- **프론트엔드**: `/pet-care/vaccination-schedule` 페이지 추가
- **메뉴**: 사이드바 "학습 > 예방접종 스케줄" 추가

### 에러 핸들링 개선
- `/api/locations/search` 엔드포인트 안정성 향상
- Google Places API 타임아웃: 10초
- 데이터베이스 쿼리 타임아웃: 5초
- API 실패 시 빈 배열 반환 (502 에러 방지)

## 🔧 긴급 복구 절차

만약 배포 후 모든 API가 502 에러를 반환한다면:

```bash
# 1단계: 서버 중지
pm2 stop talez

# 2단계: 로그 확인
pm2 logs talez --err --lines 100

# 3단계: 환경 변수 확인
cat .env.production

# 4단계: 데이터베이스 연결 테스트
psql $DATABASE_URL -c "SELECT 1;"

# 5단계: 서버 재시작
pm2 start ecosystem.config.js --env production

# 6단계: 로그 실시간 모니터링
pm2 logs talez --lines 0

# 7단계: API 테스트
curl http://localhost:5000/api/dashboard/system/status
```

## 📞 지원 정보

### 문제가 계속되면 다음 정보를 수집하세요:
1. `pm2 logs talez --err --lines 100` 출력
2. `pm2 status` 출력
3. `printenv | grep -E 'DATABASE_URL|VITE_GOOGLE_MAPS_API_KEY'` 출력 (민감 정보 제외)
4. `psql $DATABASE_URL -c "SELECT 1;"` 결과

### 관련 문서:
- 환경 변수 가이드: `DEPLOYMENT_ENV_VARIABLES.md`
- 트러블슈팅 가이드: `DEPLOYMENT_TROUBLESHOOTING.md`
- 프로젝트 개요: `replit.md`

## ✅ 배포 완료 확인

모든 항목이 체크되면 배포 완료:
- [ ] 환경 변수 설정 완료
- [ ] 데이터베이스 마이그레이션 완료 (vaccinations 테이블 생성)
- [ ] 코드 빌드 및 배포 완료
- [ ] 서버 정상 실행 (pm2 status: online)
- [ ] 모든 API 정상 응답 (502 에러 없음)
- [ ] 프론트엔드 정상 접근
- [ ] 예방접종 스케줄 페이지 작동 확인
- [ ] 5분간 에러 로그 없음
