# Nginx 배포 가이드 - 현재 서버 구조와 완벽 일치

## 🎯 현재 배포 구조 (완벽한 설정)

### 1. 현재 Nginx 설정 분석
```nginx
# 정적 파일 서빙 (80/443 포트)
root /var/www/funnytalez/dist/public;

# API 프록시 (5000 포트)
location /api/ {
    proxy_pass http://localhost:5000;
}

# WebSocket 프록시 (5000 포트)
location /ws {
    proxy_pass http://localhost:5000;
}
```

### 2. 프로젝트 빌드 설정 (완벽한 일치)
```typescript
// vite.config.ts
build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
}
```

### 3. 현재 파일 구조 확인
```
/var/www/funnytalez/
├── dist/
│   ├── index.js          # PM2가 실행하는 서버 파일
│   └── public/           # Nginx가 서빙하는 정적 파일
│       ├── index.html
│       ├── assets/
│       └── shop/
└── ecosystem.config.cjs  # PM2 설정
```

## 🚀 배포 명령어 (현재 구조와 일치)

### 1. 빌드 및 배포
```bash
# 프로젝트 루트에서
npm run build

# 빌드 결과 확인
ls -la dist/
ls -la dist/public/

# PM2 재시작
pm2 restart funnytalez-backend-prod
```

### 2. Git 기반 배포 (수정된 스크립트)
```bash
#!/bin/bash
# deploy-for-nginx.sh

echo "🚀 Nginx 환경 배포 시작..."

# Git 업데이트
git fetch origin
git reset --hard origin/main

# 의존성 설치
npm ci

# 빌드 (dist/public 생성)
npm run build

# PM2 재시작 (5000 포트 API 서버)
pm2 restart funnytalez-backend-prod || pm2 start ecosystem.config.cjs --env production

# 배포 확인
echo "✅ 배포 완료!"
echo "🌐 웹사이트: https://funnytalez.com (Nginx → dist/public)"
echo "🔌 API 서버: http://localhost:5000 (PM2 → dist/index.js)"
```

## 🔄 업데이트 프로세스

### 현재 운영 중인 업데이트 방법
```bash
# 1. 서버 접속
ssh user@funnytalez.com

# 2. 프로젝트 디렉토리 이동
cd /var/www/funnytalez

# 3. 코드 업데이트
git pull origin main

# 4. 빌드 및 재시작
npm run build
pm2 restart funnytalez-backend-prod

# 5. 확인
pm2 status
curl https://funnytalez.com/api/health
```

## 🎯 현재 구조의 장점

### 1. 최적화된 성능
- **정적 파일**: Nginx가 직접 서빙 (빠른 속도)
- **API 요청**: PM2 프로세스로 프록시 (안정성)
- **SSL 터미네이션**: Nginx에서 처리

### 2. 확장성
- **로드 밸런싱**: Nginx 레벨에서 가능
- **캐싱**: 정적 파일 캐싱 최적화
- **압축**: Gzip 압축 적용

### 3. 보안
- **SSL 인증서**: Let's Encrypt 자동 갱신
- **보안 헤더**: X-Frame-Options, CSP 등 적용
- **포트 분리**: 외부는 80/443만 노출

## 📋 배포 체크리스트

### 배포 전 확인사항
- [ ] `npm run build` 성공 확인
- [ ] `dist/public/index.html` 파일 존재 확인
- [ ] `dist/index.js` 서버 파일 존재 확인
- [ ] 환경 변수 설정 완료
- [ ] PM2 프로세스 정상 실행

### 배포 후 확인사항
- [ ] https://funnytalez.com 정상 접속
- [ ] API 엔드포인트 정상 동작
- [ ] WebSocket 연결 정상
- [ ] SSL 인증서 정상
- [ ] PM2 프로세스 상태 정상

## 🛠️ 현재 구조 유지 권장사항

현재 서버의 Nginx 설정은 **이미 완벽한 프로덕션 환경**입니다:

1. **구조 변경 불필요**: 현재 구조가 최적화되어 있음
2. **포트 설정 완벽**: 80/443 → 정적 파일, 5000 → API 서버
3. **성능 최적화**: Nginx + PM2 조합으로 최적 성능
4. **보안 강화**: SSL, 보안 헤더, 포트 분리 완료

### 결론
**현재 배포 방식을 그대로 유지하면서 Git 기반 배포 스크립트만 활용하는 것이 최선입니다.**