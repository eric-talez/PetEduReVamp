# TALEZ 배포 가이드

## 🎯 배포 준비도: 95%

이 문서는 TALEZ 플랫폼의 프로덕션 배포를 위한 완전한 가이드입니다.

## ✅ 배포 준비 상태 (2025-10-11 업데이트)
- **컴파일 오류 해결**: 모든 TypeScript/JSX 컴파일 오류 수정 완료
- **빌드 시스템**: dist/ 디렉토리에 production 빌드 생성 확인
- **배포 스크립트**: deploy-immediate.sh 자동화 스크립트 준비 완료
- **서버 보안**: production.ts 보안 설정 구문 오류 수정
- **EC2 준비**: 서버 배포용 빌드 출력 검증 완료
- **PM2 설정 수정**: ES 모듈 호환성 문제 해결 (ecosystem.config.cjs)
- **🔧 정적 파일 경로 수정 (2025-10-11)**: Vite 빌드 경로와 서버 정적 파일 서빙 경로 일치 문제 해결

## 📋 사전 요구사항

### 1. 환경 변수
```bash
# 데이터베이스
DATABASE_URL=postgresql://user:password@host:port/dbname

# AI 서비스
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...

# 결제 서비스 - 토스페이먼츠 (권장, 한국 시장 최적화)
VITE_TOSS_CLIENT_KEY=live_ck_...  # 프론트엔드용 (테스트: test_gck_docs_...)
TOSS_SECRET_KEY=live_sk_...       # 서버용 (테스트: test_gsk_docs_...)

# 결제 서비스 - Stripe (선택사항, 글로벌 결제)
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...

# 지도/위치 서비스
VITE_GOOGLE_MAPS_API_KEY=...      # 구글 맵 API 키 (필수)

# 이메일 서비스
SENDGRID_API_KEY=SG....

# 소셜 로그인
KAKAO_CLIENT_ID=...
NAVER_CLIENT_ID=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# 보안
JWT_SECRET=...
SESSION_SECRET=...

# 기타
NODE_ENV=production
PORT=5000
```

**토스페이먼츠 키 발급 방법:**
1. https://developers.tosspayments.com/ 회원가입
2. 개발자센터 > 결제 연동 > API 키 발급
3. 테스트용 키는 즉시 사용 가능 (사업자 등록 불필요)
4. 실 운영용 키는 사업자 등록 후 발급

**테스트 환경 설정 (필수):**
```bash
# .env 파일에 테스트 키 추가
VITE_TOSS_CLIENT_KEY=test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm
TOSS_SECRET_KEY=test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6
```

**구글 맵 API 키 발급 방법:**
1. https://console.cloud.google.com/ 접속
2. 프로젝트 생성 또는 선택
3. API 및 서비스 > 사용자 인증 정보
4. 사용자 인증 정보 만들기 > API 키
5. Maps JavaScript API 활성화
6. 생성된 API 키를 `VITE_GOOGLE_MAPS_API_KEY`에 설정

**⚠️ 중요 보안 사항:**
- 환경 변수 미설정 시 결제 및 지도 기능이 작동하지 않습니다 (보안상 하드코딩 제거)
- 테스트 키는 반드시 환경 변수로 설정하세요
- 실 운영 시 테스트 키를 실제 키로 교체해야 합니다
- Google Maps API 키는 필수이며, 미설정 시 지도가 표시되지 않습니다

**현재 상태:**
- 토스페이먼츠 통합 완료 ✅
- 환경 변수 필수 설정으로 보안 강화 ✅
- 지도 서비스: 구글 맵 (Google Maps) ✅
- 상용화 시 실제 키로 교체 필요 ⚠️

### 2. 시스템 요구사항
- Node.js 20.x LTS
- PostgreSQL 15+
- Redis (세션 스토어용, 선택사항)
- Nginx (리버스 프록시)
- SSL 인증서
- 최소 2GB RAM (권장: 4GB)
- 최소 10GB 디스크 공간

## 🚀 배포 방법

### Option 1: Git 기반 배포 (권장)

#### 1. 서버 초기 설정
```bash
# 서버 초기 설정 스크립트 실행
chmod +x setup-server.sh
./setup-server.sh
```

#### 2. Git 저장소 연결
```bash
# 원격 저장소 확인
git remote -v

# 원격 저장소 추가 (필요한 경우)
git remote add origin https://github.com/your-username/talez-platform.git

# 소스 코드 업로드
git add .
git commit -m "Initial commit: TALEZ platform production ready"
git push -u origin main
```

#### 3. 서버에서 배포
```bash
# 서버에서 프로젝트 클론
cd /var/www
git clone https://github.com/your-username/talez-platform.git
cd talez-platform

# Git 기반 자동 배포
chmod +x deploy-from-git.sh
./deploy-from-git.sh
```

### Option 2: Docker 배포

#### 1. Docker 이미지 빌드
```bash
# 멀티스테이지 빌드로 최적화
docker build -t talez:latest .
```

#### 2. Docker Compose 실행
```bash
# 프로덕션 환경
docker-compose -f docker-compose.prod.yml up -d
```

#### 3. 데이터베이스 마이그레이션
```bash
docker exec talez-app npm run db:push
```

### Option 2: 직접 배포

#### 1. 의존성 설치
```bash
# 모든 의존성 설치 (빌드 시 devDependencies도 필요)
npm ci

# 또는 yarn 사용시
yarn install --frozen-lockfile
```

#### 2. 프론트엔드 빌드
```bash
# 프로덕션 빌드
npm run build

# 빌드 완료 후 불필요한 devDependencies 제거 (선택사항)
npm prune --production
```

#### 3. PM2로 프로세스 관리

**⚠️ ES 모듈 프로젝트에서 PM2 설정 파일 사용 시 주의사항:**
- `ecosystem.config.js` 파일은 ES 모듈에서 호환성 문제가 발생합니다
- `.cjs` 또는 `.mjs` 확장자를 사용하세요

```bash
npm install -g pm2

# 방법 1: CommonJS 설정 파일 사용 (권장)
pm2 start ecosystem.config.cjs --env production

# 방법 2: ES 모듈 설정 파일 사용
pm2 start ecosystem.config.mjs --env production

# 방법 3: 직접 실행
pm2 start dist/index.js --name talez-service --env production

# 상태 확인
pm2 status
pm2 logs talez-service
```

#### 4. Nginx 설정
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;

    # 정적 파일
    location /assets/ {
        alias /app/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 프록시
    location /api/ {
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

    # WebSocket 프록시
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA 라우팅
    location / {
        try_files $uri $uri/ /index.html;
        root /app/dist;
    }
}
```

## 🏗 클라우드 배포

### AWS 배포

#### 1. ECS + Fargate
```yaml
# ecs-task-definition.json
{
  "family": "talez",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "talez",
      "image": "your-account.dkr.ecr.region.amazonaws.com/talez:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "PORT", "value": "5000"}
      ],
      "secrets": [
        {"name": "DATABASE_URL", "valueFrom": "arn:aws:secretsmanager:..."},
        {"name": "OPENAI_API_KEY", "valueFrom": "arn:aws:secretsmanager:..."}
      ]
    }
  ]
}
```

#### 2. RDS 데이터베이스 설정
```bash
# RDS PostgreSQL 인스턴스 생성
aws rds create-db-instance \
  --db-instance-identifier talez-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password "your-password" \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-12345678
```

### Google Cloud Platform

#### 1. Cloud Run 배포
```bash
# Container Registry에 이미지 푸시
docker tag talez:latest gcr.io/PROJECT_ID/talez:latest
docker push gcr.io/PROJECT_ID/talez:latest

# Cloud Run 서비스 배포
gcloud run deploy talez \
  --image gcr.io/PROJECT_ID/talez:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10
```

#### 2. Cloud SQL 데이터베이스
```bash
# PostgreSQL 인스턴스 생성
gcloud sql instances create talez-db \
  --database-version POSTGRES_15 \
  --tier db-f1-micro \
  --region us-central1
```

## 📊 모니터링 설정

### 1. 애플리케이션 모니터링
```javascript
// server/monitoring/metrics.js
import prometheus from 'prom-client';

const register = new prometheus.Registry();

// 기본 메트릭 수집
prometheus.collectDefaultMetrics({ register });

// 커스텀 메트릭
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

register.registerMetric(httpRequestDuration);

export { register, httpRequestDuration };
```

### 2. 로그 관리
```javascript
// server/logging/winston.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export default logger;
```

### 3. 헬스체크 엔드포인트
```javascript
// server/routes/health.js
app.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    checks: {
      database: 'OK',
      redis: 'OK',
      external_apis: 'OK'
    }
  };

  res.status(200).json(healthcheck);
});
```

## 🔒 보안 설정

### 1. SSL/TLS 설정
```bash
# Let's Encrypt 인증서 자동 갱신
0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. 방화벽 설정
```bash
# UFW 방화벽 설정
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 3. 보안 헤더
```javascript
// server/middleware/security.js
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## 📈 성능 최적화

### 1. CDN 설정
```javascript
// 정적 파일 CDN 설정
const CDN_URL = process.env.CDN_URL || '';

export const getAssetUrl = (path) => {
  return CDN_URL + path;
};
```

### 2. 캐싱 전략
```javascript
// Redis 캐싱
import redis from 'redis';

const client = redis.createClient({
  url: process.env.REDIS_URL
});

export const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = req.originalUrl;
    const cached = await client.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      client.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    
    next();
  };
};
```

## 🚨 장애 대응

### 1. 백업 전략
```bash
# 데이터베이스 백업 스크립트
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://talez-backups/
rm backup_$DATE.sql
```

### 2. 롤백 절차
```bash
# 애플리케이션 롤백
pm2 stop all
git checkout previous-stable-tag
npm ci --only=production
npm run build
pm2 start ecosystem.config.js --env production
```

## 📞 배포 후 체크리스트

- [ ] 애플리케이션 정상 실행 확인
- [ ] 데이터베이스 연결 확인
- [ ] API 엔드포인트 테스트
- [ ] WebSocket 연결 테스트
- [ ] SSL 인증서 확인
- [ ] 모니터링 대시보드 설정
- [ ] 로그 수집 확인
- [ ] 백업 시스템 동작 확인
- [ ] 부하 테스트 실행
- [ ] 보안 스캔 실행

## 📊 성능 지표

### 목표 지표
- **응답 시간**: 95%ile < 500ms
- **가용성**: 99.9% uptime
- **처리량**: 1000 RPS
- **메모리 사용량**: < 1GB
- **CPU 사용량**: < 70%

### 모니터링 도구
- Prometheus + Grafana
- ELK Stack (로그 분석)
- Sentry (에러 트래킹)
- New Relic (APM)

---

## 🔧 알려진 문제 및 해결 방법

### ⚠️ 배포 버전에서 화면이 보이지 않는 문제

**문제**: 프로덕션 배포 후 브라우저에서 화면이 표시되지 않음

**원인**: Vite 빌드 출력 경로(`dist/public`)와 서버 정적 파일 서빙 경로(`server/public`) 불일치

**해결 방법 1 - 빌드 스크립트 사용 (권장)**:
```bash
# 프로덕션 빌드 실행 (자동으로 파일 복사 포함)
./build-production.sh
```

**해결 방법 2 - 수동 복사**:
```bash
# 빌드 후 파일 복사
npm run build
rm -rf server/public
cp -r dist/public server/public
```

**해결 방법 3 - Docker 사용**:
```bash
# 업데이트된 Dockerfile.production 사용
docker build -f Dockerfile.production -t talez:production .
# Dockerfile에서 자동으로 파일 복사 처리됨
```

**영구적 해결**:
- `build-production.sh` 스크립트가 모든 빌드 프로세스를 자동화합니다
- `Dockerfile.production`도 업데이트되어 빌드 시 자동으로 파일을 복사합니다
- CI/CD 파이프라인에 빌드 스크립트를 포함하세요

---

배포 관련 문의사항이 있으시면 DevOps 팀에 연락해주세요.

**마지막 업데이트**: 2025-10-11  
**주요 변경사항**: 정적 파일 서빙 경로 문제 해결