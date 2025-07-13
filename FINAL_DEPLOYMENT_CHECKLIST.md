# 최종 배포 체크리스트

## ✅ 완료된 작업들

### 1. 포트 설정 수정
- ✅ PM2 production 포트 3000 → 5000 변경
- ✅ ecosystem.config.cjs 및 ecosystem.config.mjs 모두 업데이트
- ✅ Nginx 프록시 설정과 완전 일치

### 2. 환경 변수 설정
- ✅ OPENAI_API_KEY 환경 변수 추가
- ✅ KAKAO_MAPS_API_KEY 환경 변수 추가
- ✅ PM2 설정 파일에 모든 환경 변수 포함
- ✅ 자동 .env 파일 생성 스크립트 작성

### 3. 정적 파일 문제 해결
- ✅ 정적 파일 복사 스크립트 생성 (copy-static-files.sh)
- ✅ 로고 파일들 자동 복사 (public/ → dist/public/)
- ✅ 파비콘, 이미지, 관리자 파일 등 모든 정적 자산 복사
- ✅ 배포 스크립트에 정적 파일 복사 통합

### 4. 배포 스크립트 완성
- ✅ deploy-for-nginx.sh (현재 서버 환경 최적화)
- ✅ production-env-setup.sh (완전한 환경 설정)
- ✅ copy-static-files.sh (정적 파일 복사)
- ✅ build-with-static.sh (통합 빌드)

## 🚀 서버에서 실행할 최종 명령어

### 한 번에 모든 문제 해결 (권장)
```bash
# 1. 프로젝트 디렉토리로 이동
cd /var/www/funnytalez

# 2. 완전한 환경 설정 및 배포
chmod +x production-env-setup.sh
./production-env-setup.sh

# 3. 정적 파일 복사 (이미 위 스크립트에 포함되어 있음)
# ./copy-static-files.sh (자동 실행됨)
```

### 또는 단계별 실행
```bash
# 1. 환경 변수 설정
cd /var/www/funnytalez
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
SESSION_SECRET=talez-super-secure-session-secret-2025-production-ready
CORS_ORIGIN=*
ENCRYPTION_KEY=talez-32-character-encryption-key
VITE_KAKAO_MAPS_API_KEY=ce38e8a3c2b566aeb9faf4c60b0153d2
KAKAO_MAPS_API_KEY=ce38e8a3c2b566aeb9faf4c60b0153d2
OPENAI_API_KEY=실제-OpenAI-API-키-입력
EOF

# 2. 빌드 및 정적 파일 복사
npm run build
./copy-static-files.sh

# 3. PM2 재시작
pm2 restart funnytalez-backend-prod
```

## 📋 배포 후 확인 사항

### 1. 서버 상태 확인
```bash
# PM2 상태
pm2 status

# 포트 확인
netstat -tulpn | grep :5000

# 로그 확인
pm2 logs funnytalez-backend-prod --lines 20
```

### 2. API 연결 확인
```bash
# 헬스체크
curl http://localhost:5000/api/health

# 대시보드 API
curl http://localhost:5000/api/dashboard/stats
```

### 3. 정적 파일 확인
```bash
# 로고 파일 확인
curl https://funnytalez.com/logo.svg
curl https://funnytalez.com/favicon.svg

# 이미지 파일 확인
curl https://funnytalez.com/images/wangzzang/logo.png
```

### 4. 웹사이트 기능 확인
- ✅ 메인 페이지 로고 표시
- ✅ 파비콘 표시
- ✅ 관리자 페이지 접근
- ✅ API 요청 정상 처리 (502 오류 해결)
- ✅ AI 기능 정상 작동
- ✅ 지도 기능 정상 작동

## 🎯 예상 결과

### 성공 시 표시될 내용
```
✅ Server running on port 5000
✅ OpenAI API initialized successfully
✅ Kakao Maps API configured
✅ PostgreSQL connected
✅ All static files served correctly
```

### 웹사이트 정상 동작
- 메인 페이지: https://funnytalez.com (로고 표시됨)
- 관리자 페이지: https://funnytalez.com/admin (모든 이미지 로드됨)
- API 엔드포인트: 모든 /api/* 요청 정상 처리

## 🔧 문제 발생 시 해결 방법

### 502 오류가 지속되는 경우
```bash
# 1. 환경 변수 직접 설정
pm2 set funnytalez-backend-prod:OPENAI_API_KEY "실제-키"

# 2. 완전 재시작
pm2 stop funnytalez-backend-prod
pm2 delete funnytalez-backend-prod
pm2 start ecosystem.config.cjs --env production

# 3. Nginx 재시작
sudo systemctl restart nginx
```

### 로고가 표시되지 않는 경우
```bash
# 정적 파일 재복사
./copy-static-files.sh

# 파일 권한 확인
ls -la dist/public/logo*.svg
```

이제 모든 설정이 완료되었습니다. 서버에서 위 명령어를 실행하면 502 오류와 로고 표시 문제가 모두 해결될 것입니다.