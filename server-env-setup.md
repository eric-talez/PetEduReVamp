# 서버 환경 변수 설정 해결 가이드

## 🚨 현재 문제점
- PM2 프로세스가 환경 변수를 읽지 못함
- OPENAI_API_KEY 및 KAKAO_MAPS_API_KEY 누락으로 인한 502 오류
- API 호출 전체가 실패하는 상황

## 🔧 해결 방법

### 1. 서버에서 실행할 명령어 순서

```bash
# 1. 프로젝트 디렉토리로 이동
cd /var/www/funnytalez

# 2. 현재 PM2 프로세스 중지
pm2 stop funnytalez-backend-prod

# 3. PM2 환경 변수 직접 설정
pm2 set funnytalez-backend-prod:OPENAI_API_KEY "실제-OpenAI-API-키"
pm2 set funnytalez-backend-prod:KAKAO_MAPS_API_KEY "ce38e8a3c2b566aeb9faf4c60b0153d2"

# 4. 새로운 설정으로 PM2 시작
pm2 start ecosystem.config.cjs --env production

# 5. 상태 확인
pm2 logs funnytalez-backend-prod --lines 20
```

### 2. 또는 .env 파일 방식 (권장)

```bash
# 1. .env 파일 생성/수정
nano /var/www/funnytalez/.env

# 2. 다음 내용 추가/수정
NODE_ENV=production
PORT=5000
SESSION_SECRET=talez-super-secure-session-secret-2025-production-ready
CORS_ORIGIN=*
ENCRYPTION_KEY=talez-32-character-encryption-key
VITE_KAKAO_MAPS_API_KEY=ce38e8a3c2b566aeb9faf4c60b0153d2
KAKAO_MAPS_API_KEY=ce38e8a3c2b566aeb9faf4c60b0153d2
OPENAI_API_KEY=실제-OpenAI-API-키

# 3. PM2 ecosystem 설정으로 시작
pm2 restart funnytalez-backend-prod
```

### 3. 환경 변수 로드 스크립트 방식

```bash
# 1. 환경 변수 로드 스크립트 실행
source /var/www/funnytalez/.env

# 2. 환경 변수와 함께 PM2 시작
PM2_HOME=/var/www/funnytalez/.pm2 pm2 start ecosystem.config.cjs --env production --update-env

# 3. 확인
pm2 show funnytalez-backend-prod
```

## 📋 확인 체크리스트

### 서버에서 실행할 확인 명령어
```bash
# 1. PM2 프로세스 상태 확인
pm2 status

# 2. 환경 변수 확인
pm2 show funnytalez-backend-prod

# 3. 로그 확인
pm2 logs funnytalez-backend-prod

# 4. 포트 확인
netstat -tulpn | grep :5000

# 5. API 테스트
curl http://localhost:5000/api/health
```

### 예상 정상 출력
```
✅ Server running on port 5000
✅ OpenAI API initialized successfully
✅ Kakao Maps API configured
✅ No environment variable errors
```

## 🔍 문제 진단

### 현재 오류 원인
1. **PM2 환경 변수 누락**: ecosystem.config.cjs의 env_production에 OPENAI_API_KEY 누락
2. **Dotenv 로드 실패**: .env 파일이 PM2 프로세스에서 로드되지 않음
3. **API 초기화 실패**: 환경 변수 부재로 인한 OpenAI 클라이언트 생성 실패

### 해결 우선순위
1. **즉시 해결**: PM2 환경 변수 직접 설정
2. **안정성 확보**: ecosystem.config.cjs 파일 내 환경 변수 명시
3. **백업 방안**: .env 파일 생성 및 권한 설정

## 🚀 최종 실행 명령어

```bash
# 한 번에 실행할 수 있는 명령어 시퀀스
cd /var/www/funnytalez && \
pm2 stop funnytalez-backend-prod && \
pm2 start ecosystem.config.cjs --env production && \
pm2 logs funnytalez-backend-prod --lines 10
```

## ⚠️ 주의사항

1. **OpenAI API 키**: 실제 유효한 키로 교체 필요
2. **보안**: API 키는 .env 파일에 저장하고 권한 설정 (chmod 600)
3. **확인**: PM2 재시작 후 반드시 로그 확인
4. **테스트**: API 엔드포인트 정상 동작 확인

이제 서버에서 위 명령어들을 실행하면 502 오류가 해결될 것입니다.