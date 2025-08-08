# TALEZ 운영 배포 체크리스트

## 🏗️ 인프라 준비

### 서버 환경
- [ ] **클라우드 서버** 준비 (AWS EC2, Google Cloud, 또는 전용 서버)
  - CPU: 4코어 이상
  - RAM: 8GB 이상
  - 디스크: SSD 100GB 이상
  - 네트워크: 1Gbps 이상

- [ ] **도메인** 등록 및 설정
  - 메인 도메인: www.talez.co.kr
  - API 도메인: api.talez.co.kr
  - 관리자 도메인: admin.talez.co.kr (선택)

- [ ] **SSL 인증서** 설정
  - Let's Encrypt 무료 인증서 또는 상용 인증서
  - 자동 갱신 설정

### 데이터베이스
- [ ] **PostgreSQL 운영 DB** 설정
  - 버전 15+ 권장
  - 백업 자동화 설정
  - 모니터링 설정

- [ ] **Redis 캐시 서버** (선택적, 성능 향상)
  - 세션 저장소
  - API 응답 캐시

## 🔧 환경 설정

### 1. 환경 변수 설정
```bash
# .env.production 파일 생성
cp .env.production.example .env.production
# 모든 필수 값 입력 완료
```

### 2. 의존성 설치 및 빌드
```bash
# Node.js 패키지 설치
npm ci --production

# 프론트엔드 빌드
npm run build

# 타입 체크
npm run check
```

### 3. 데이터베이스 마이그레이션
```bash
# 스키마 적용
npm run db:push

# 기본 데이터 삽입 (필요시)
npm run db:seed
```

## 🚀 서비스 배포

### 1. PM2로 서비스 시작
```bash
# PM2 설치
npm install -g pm2

# 애플리케이션 시작
pm2 start ecosystem.config.cjs --env production

# 자동 시작 설정
pm2 startup
pm2 save
```

### 2. Nginx 리버스 프록시 설정
```nginx
# /etc/nginx/sites-available/talez
server {
    listen 80;
    server_name www.talez.co.kr talez.co.kr;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name www.talez.co.kr talez.co.kr;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. 방화벽 설정
```bash
# UFW 방화벽 설정
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 🔍 테스트 및 검증

### 1. 기능 테스트
- [ ] **홈페이지** 로딩 확인
- [ ] **회원가입/로그인** 테스트
- [ ] **결제 시스템** 테스트 (테스트 모드)
- [ ] **파일 업로드** 테스트
- [ ] **이메일 발송** 테스트

### 2. 성능 테스트
- [ ] **로드 테스트** 실행 (Apache Bench, Artillery)
- [ ] **응답 시간** 측정 (목표: 500ms 이하)
- [ ] **동시 접속자** 처리 확인

### 3. 보안 테스트
- [ ] **SSL 등급** 확인 (SSL Labs)
- [ ] **보안 헤더** 검증
- [ ] **취약점 스캔** 실행

## 📊 모니터링 설정

### 1. 애플리케이션 모니터링
- [ ] **PM2 모니터링** 설정
```bash
pm2 install pm2-server-monit
```

- [ ] **Sentry 에러 트래킹** 활성화
```javascript
// server/index.ts에서 확인
const SENTRY_DSN = process.env.SENTRY_DSN;
```

### 2. 시스템 모니터링
- [ ] **서버 리소스** 모니터링 (htop, netdata)
- [ ] **디스크 사용량** 알림 설정
- [ ] **데이터베이스** 성능 모니터링

### 3. 로그 관리
- [ ] **로그 로테이션** 설정
- [ ] **중요 로그** 알림 설정
- [ ] **보안 로그** 모니터링

## 📧 알림 설정

### 1. 시스템 알림
- [ ] **서버 다운** 시 SMS/이메일 알림
- [ ] **높은 CPU/메모리** 사용률 알림
- [ ] **디스크 공간** 부족 알림

### 2. 애플리케이션 알림
- [ ] **에러율** 증가 알림
- [ ] **응답 시간** 증가 알림
- [ ] **결제 실패** 알림

## 🔄 백업 및 복구

### 1. 데이터베이스 백업
```bash
# 일일 백업 스크립트
#!/bin/bash
BACKUP_DIR="/backups/database"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump talez_production > "$BACKUP_DIR/talez_$DATE.sql"

# crontab 등록
0 2 * * * /path/to/backup-script.sh
```

### 2. 파일 백업
- [ ] **업로드 파일** 백업 (S3, Google Cloud Storage)
- [ ] **설정 파일** 백업
- [ ] **SSL 인증서** 백업

### 3. 복구 절차
- [ ] **복구 절차** 문서화
- [ ] **복구 테스트** 주기적 실행

## 📋 운영 절차

### 1. 배포 절차
```bash
# 1. 코드 업데이트
git pull origin main

# 2. 의존성 업데이트
npm ci --production

# 3. 빌드
npm run build

# 4. 서비스 재시작
pm2 reload all

# 5. 헬스 체크
curl -f http://localhost:5000/health
```

### 2. 롤백 절차
```bash
# 1. 이전 버전으로 롤백
git checkout <previous-commit>

# 2. 의존성 재설치
npm ci --production

# 3. 빌드 및 재시작
npm run build
pm2 reload all
```

### 3. 긴급 대응
- [ ] **장애 대응** 매뉴얼 작성
- [ ] **연락 체계** 구축
- [ ] **에스컬레이션** 절차 정의

## ✅ 최종 체크리스트

### 배포 전 확인
- [ ] 모든 환경 변수 설정 완료
- [ ] SSL 인증서 적용 완료
- [ ] 데이터베이스 연결 확인
- [ ] 외부 서비스 API 키 동작 확인
- [ ] 백업 시스템 동작 확인

### 배포 후 확인
- [ ] 웹사이트 정상 접속 확인
- [ ] 모든 주요 기능 테스트 완료
- [ ] 모니터링 시스템 동작 확인
- [ ] 성능 지표 정상 범위 확인
- [ ] 에러 로그 확인

### 사용자 공지
- [ ] 서비스 오픈 공지
- [ ] 이용 가이드 제공
- [ ] 고객 지원 채널 안내
- [ ] 개인정보처리방침 게시

## 🎯 성공 지표

### 기술적 지표
- **가동률:** 99.9% 이상
- **평균 응답시간:** 500ms 이하
- **에러율:** 0.1% 이하
- **동시 접속자:** 1,000명 이상 처리

### 비즈니스 지표
- **일일 신규 가입자:** 50명 이상
- **결제 성공률:** 98% 이상
- **페이지 이탈률:** 40% 이하
- **사용자 만족도:** 4.5/5.0 이상

---

**이 체크리스트를 완료하면 TALEZ 플랫폼이 안정적인 상용 서비스로 운영될 수 있습니다.**