# 포트 설정 수정 완료

## 🔧 문제점
- **Nginx 설정**: API 요청을 `localhost:5000`으로 프록시
- **PM2 Production 설정**: 서버를 `3000`번 포트에서 실행
- **결과**: 포트 불일치로 인한 API 연결 실패

## ✅ 수정 사항

### 1. ecosystem.config.cjs 수정
```javascript
env_production: {
  NODE_ENV: 'production',
  PORT: 5000  // 3000 → 5000으로 변경
}
```

### 2. ecosystem.config.mjs 수정
```javascript
env_production: {
  NODE_ENV: 'production',
  PORT: 5000  // 3000 → 5000으로 변경
}
```

## 🚀 적용 방법

### 서버에서 실행할 명령어
```bash
# 현재 PM2 프로세스 중지
pm2 stop talez-service

# 새로운 설정으로 시작
pm2 start ecosystem.config.cjs --env production

# 또는 이미 실행 중인 경우 재시작
pm2 restart talez-service
```

## 🔍 확인 방법

### 1. PM2 상태 확인
```bash
pm2 status
pm2 show talez-service
```

### 2. 포트 확인
```bash
# 5000번 포트 사용 중인지 확인
netstat -tulpn | grep :5000
lsof -i :5000
```

### 3. API 연결 테스트
```bash
# 로컬에서 API 테스트
curl http://localhost:5000/api/health

# Nginx를 통한 API 테스트
curl https://funnytalez.com/api/health
```

## 🎯 현재 구조 (수정 후)

### 올바른 포트 구성
```
클라이언트 → Nginx (80/443) → API Server (5000)
```

### 파일 서빙 구조
```
정적 파일: /var/www/funnytalez/dist/public (Nginx 직접 서빙)
API 요청: /api/* → http://localhost:5000 (PM2 프로세스)
```

## 📋 배포 체크리스트

- [x] ecosystem.config.cjs 포트 5000으로 수정
- [x] ecosystem.config.mjs 포트 5000으로 수정
- [ ] PM2 프로세스 재시작
- [ ] 포트 5000 정상 실행 확인
- [ ] API 엔드포인트 정상 작동 확인
- [ ] 웹사이트 전체 기능 테스트

## 🔄 향후 배포 시 주의사항

현재 서버에서 `pm2 start ecosystem.config.cjs --env production` 명령어를 실행하면 이제 올바른 5000번 포트에서 서비스가 시작됩니다.