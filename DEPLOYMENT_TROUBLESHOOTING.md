# TALEZ 배포 환경 502 에러 해결 가이드

## 문제 증상
배포된 사이트(funnytalez.com)에서 모든 API 호출이 502 Bad Gateway 에러를 반환합니다:
- `/api/logo`
- `/api/dashboard/system/status`
- `/api/institutes`
- `/api/locations/search`
- 기타 모든 API 엔드포인트

## 502 Bad Gateway 의미
Nginx/게이트웨이가 백엔드 Node.js 서버로부터 응답을 받지 못하고 있습니다. 이는 백엔드 서버의 문제를 의미합니다.

## 원인 진단 체크리스트

### 1. 서버 로그 확인 (최우선)
```bash
# PM2 사용 시
pm2 logs talez

# Docker 사용 시
docker logs talez-container

# systemd 사용 시
journalctl -u talez -n 100
```

**확인할 내용**:
- 서버가 시작되었는가?
- 크래시 에러 메시지가 있는가?
- 데이터베이스 연결 오류가 있는가?
- 포트 바인딩 실패가 있는가?

### 2. 서버 프로세스 상태 확인
```bash
# PM2
pm2 status
pm2 list

# 일반 프로세스
ps aux | grep node
netstat -tulpn | grep :5000
```

**예상 결과**:
- Node.js 프로세스가 실행 중이어야 함
- 포트 5000이 LISTEN 상태여야 함

### 3. 환경 변수 확인
```bash
# 배포 환경에서
printenv | grep DATABASE_URL
printenv | grep VITE_GOOGLE_MAPS_API_KEY
```

**필수 환경 변수**:
```bash
DATABASE_URL=postgresql://user:password@host:port/database
VITE_GOOGLE_MAPS_API_KEY=your_api_key
NODE_ENV=production
```

### 4. 데이터베이스 연결 테스트
```bash
# PostgreSQL 연결 테스트
psql $DATABASE_URL -c "SELECT 1;"
```

**확인 사항**:
- 데이터베이스 서버가 실행 중인가?
- 연결 문자열이 올바른가?
- 방화벽이 차단하지 않는가?

### 5. Nginx 설정 확인
```bash
# Nginx 설정 테스트
sudo nginx -t

# Nginx 로그
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

**확인할 내용**:
```nginx
# /etc/nginx/sites-available/talez
upstream backend {
    server localhost:5000;  # 올바른 포트인가?
}

server {
    location /api/ {
        proxy_pass http://backend;
        proxy_read_timeout 30s;  # 타임아웃 설정
        proxy_connect_timeout 10s;
    }
}
```

## 일반적인 해결 방법

### 해결책 1: 서버 재시작
```bash
# PM2
pm2 restart talez
pm2 logs talez --lines 100

# Docker
docker restart talez-container
docker logs -f talez-container

# systemd
sudo systemctl restart talez
sudo journalctl -u talez -f
```

### 해결책 2: 데이터베이스 연결 문제
서버 로그에서 다음과 같은 에러가 보이면:
```
Error: connect ECONNREFUSED
Error: Connection terminated unexpectedly
```

**해결**:
1. `DATABASE_URL` 환경 변수 확인
2. PostgreSQL 서버 상태 확인: `sudo systemctl status postgresql`
3. 방화벽 규칙 확인

### 해결책 3: 메모리 부족
서버가 반복적으로 크래시한다면:
```bash
# 메모리 사용량 확인
free -h
top

# PM2 메모리 제한 증가
pm2 start ecosystem.config.js --max-memory-restart 1G
```

### 해결책 4: 빌드 문제
타입스크립트 빌드 에러:
```bash
# 다시 빌드
npm run build

# 빌드 결과 확인
ls -la dist/
```

### 해결책 5: 포트 충돌
포트 5000이 이미 사용 중:
```bash
# 포트 사용 프로세스 확인
sudo lsof -i :5000
sudo kill -9 <PID>

# 또는 다른 포트 사용
export PORT=5001
```

## 배포 환경 설정 체크리스트

### 환경 변수 (.env.production)
```bash
# 필수
DATABASE_URL=postgresql://...
VITE_GOOGLE_MAPS_API_KEY=...
NODE_ENV=production

# 선택
OPENAI_API_KEY=...
STRIPE_SECRET_KEY=...
SESSION_SECRET=your-secret-here-32-chars-min
```

### PM2 설정 (ecosystem.config.js)
```javascript
module.exports = {
  apps: [{
    name: 'talez',
    script: './dist/server/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    max_memory_restart: '1G',
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    time: true
  }]
}
```

### Nginx 설정 (/etc/nginx/sites-available/talez)
```nginx
upstream talez_backend {
    server localhost:5000;
    keepalive 64;
}

server {
    listen 80;
    server_name funnytalez.com www.funnytalez.com;

    # 타임아웃 설정 (중요!)
    proxy_connect_timeout 10s;
    proxy_send_timeout 30s;
    proxy_read_timeout 30s;

    location /api/ {
        proxy_pass http://talez_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://talez_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 긴급 복구 절차

### 즉시 확인
1. `pm2 logs talez` 또는 `docker logs talez-container`로 에러 확인
2. 서버 프로세스 상태: `pm2 status` 또는 `docker ps`
3. 데이터베이스 연결: `psql $DATABASE_URL -c "SELECT 1;"`

### 서버 재시작
```bash
# 1단계: 프로세스 중지
pm2 stop talez

# 2단계: 환경 변수 확인
cat .env.production

# 3단계: 서버 시작
pm2 start ecosystem.config.js --env production

# 4단계: 로그 모니터링
pm2 logs talez --lines 50
```

### 롤백 (문제가 계속되면)
```bash
# 이전 버전으로 롤백
git checkout <previous-commit>
npm install
npm run build
pm2 restart talez
```

## 디버깅 팁

### 1. 헬스 체크 엔드포인트 직접 호출
```bash
# 서버에서 직접 호출
curl http://localhost:5000/api/logo
curl http://localhost:5000/api/dashboard/system/status
```

예상 결과: JSON 응답 (502가 아님)

### 2. 네트워크 연결 확인
```bash
# Nginx → Backend 연결 테스트
telnet localhost 5000
```

### 3. 로그 실시간 모니터링
```bash
# 터미널 1: 서버 로그
pm2 logs talez

# 터미널 2: Nginx 로그
sudo tail -f /var/log/nginx/error.log

# 터미널 3: 시스템 리소스
htop
```

## 자주 발생하는 오류와 해결

### "ECONNREFUSED" 에러
**원인**: 데이터베이스 연결 실패
**해결**: DATABASE_URL 확인, PostgreSQL 서버 시작

### "Cannot find module" 에러
**원인**: npm 패키지 누락
**해결**: `npm install --production`

### "Port 5000 is already in use"
**원인**: 포트 충돌
**해결**: 기존 프로세스 종료 또는 다른 포트 사용

### 메모리 부족으로 크래시
**원인**: Node.js 메모리 제한 초과
**해결**: `--max-old-space-size=2048` 또는 PM2 재시작 제한 설정

## 추가 지원

문제가 계속되면 다음 정보를 수집하세요:
1. 서버 로그 (최근 100줄)
2. Nginx 에러 로그
3. `pm2 status` 출력
4. 환경 변수 목록 (민감 정보 제외)
5. 데이터베이스 연결 테스트 결과

이 정보로 더 정확한 진단이 가능합니다.
