# TALEZ 배포 가이드

## 🎯 배포 준비도: 90%

이 문서는 TALEZ 플랫폼의 프로덕션 배포를 위한 완전한 가이드입니다.

## 📋 사전 요구사항

### 1. 환경 변수
```bash
# 데이터베이스
DATABASE_URL=postgresql://user:password@host:port/dbname

# AI 서비스
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...

# 결제 서비스
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...

# 이메일 서비스
SENDGRID_API_KEY=SG....

# 소셜 로그인
KAKAO_CLIENT_ID=...
NAVER_CLIENT_ID=...
GOOGLE_CLIENT_ID=...

# 보안
JWT_SECRET=...
SESSION_SECRET=...

# 기타
NODE_ENV=production
PORT=5000
```

### 2. 시스템 요구사항
- Node.js 20.x LTS
- PostgreSQL 15+
- Redis (세션 스토어용, 선택사항)
- Nginx (리버스 프록시)
- SSL 인증서

## 🚀 배포 방법

### Option 1: Docker 배포 (권장)

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
npm ci --only=production
```

#### 2. 프론트엔드 빌드
```bash
npm run build
```

#### 3. PM2로 프로세스 관리
```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
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

배포 관련 문의사항이 있으시면 DevOps 팀에 연락해주세요.