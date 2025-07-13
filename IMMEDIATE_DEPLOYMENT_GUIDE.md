# 즉시 배포 가이드 - 502 오류 해결

## 🚨 현재 상황
- PM2 프로세스가 환경 변수 부족으로 인해 시작 실패
- /api 요청이 모두 502 Bad Gateway 오류 발생
- OPENAI_API_KEY 및 KAKAO_MAPS_API_KEY 환경 변수 누락

## 🔧 즉시 실행할 명령어 (서버에서)

### 방법 1: 빠른 해결 (추천)
```bash
# 1. 프로젝트 디렉토리로 이동
cd /var/www/funnytalez

# 2. 환경 변수 파일 생성
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
SESSION_SECRET=talez-super-secure-session-secret-2025-production-ready
CORS_ORIGIN=*
ENCRYPTION_KEY=talez-32-character-encryption-key
VITE_KAKAO_MAPS_API_KEY=ce38e8a3c2b566aeb9faf4c60b0153d2
KAKAO_MAPS_API_KEY=ce38e8a3c2b566aeb9faf4c60b0153d2
OPENAI_API_KEY=실제-OpenAI-API-키-여기-입력
EOF

# 3. 파일 권한 설정
chmod 600 .env

# 4. PM2 프로세스 재시작
pm2 restart funnytalez-backend-prod

# 5. 상태 확인
pm2 logs funnytalez-backend-prod --lines 10
```

### 방법 2: 스크립트 실행
```bash
# 1. 프로젝트 디렉토리로 이동
cd /var/www/funnytalez

# 2. 배포 스크립트 실행
./production-env-setup.sh

# 3. 결과 확인
curl http://localhost:5000/api/health
```

## 📋 확인 사항

### 성공적인 배포 후 확인할 것들
```bash
# 1. PM2 상태 확인
pm2 status
# 예상 출력: funnytalez-backend-prod | online

# 2. 포트 확인
netstat -tulpn | grep :5000
# 예상 출력: tcp 0 0 0.0.0.0:5000 0.0.0.0:* LISTEN

# 3. API 테스트
curl http://localhost:5000/api/health
# 예상 출력: {"status":"ok"}

# 4. 로그 확인
pm2 logs funnytalez-backend-prod
# 예상 출력: ✅ Server running on port 5000
```

### 오류가 지속되는 경우
```bash
# 1. 완전 재시작
pm2 stop funnytalez-backend-prod
pm2 delete funnytalez-backend-prod
pm2 start ecosystem.config.cjs --env production

# 2. 환경 변수 직접 설정
pm2 set funnytalez-backend-prod:OPENAI_API_KEY "실제-키"
pm2 set funnytalez-backend-prod:KAKAO_MAPS_API_KEY "ce38e8a3c2b566aeb9faf4c60b0153d2"

# 3. 재시작
pm2 restart funnytalez-backend-prod
```

## 🎯 핵심 해결 사항

### 1. 환경 변수 설정 완료
- ✅ ecosystem.config.cjs에 모든 필요한 환경 변수 추가
- ✅ .env 파일 자동 생성 스크립트 작성
- ✅ PM2 환경 변수 직접 설정 방법 제공

### 2. 포트 설정 수정
- ✅ Production 환경 포트 5000으로 통일
- ✅ Nginx 프록시 설정과 일치

### 3. API 키 구성
- ✅ OpenAI API 키 환경 변수 설정
- ✅ 카카오 맵 API 키 환경 변수 설정

## 🚀 배포 후 테스트

### 웹사이트 확인
- 메인 페이지: https://funnytalez.com
- 관리자 페이지: https://funnytalez.com/admin
- API 헬스체크: https://funnytalez.com/api/health

### 기능 테스트
- AI 기능 (OpenAI API 연동)
- 지도 기능 (카카오 맵 API 연동)
- 사용자 인증 및 세션 관리
- 쇼핑몰 기능

## 📞 문제 해결

만약 여전히 502 오류가 발생한다면:

1. **로그 확인**: `pm2 logs funnytalez-backend-prod`
2. **환경 변수 확인**: `pm2 show funnytalez-backend-prod`
3. **포트 확인**: `netstat -tulpn | grep :5000`
4. **Nginx 재시작**: `sudo systemctl restart nginx`

이 가이드를 따라 실행하면 502 오류가 해결되고 정상적인 서비스 운영이 가능해집니다.