# Talez 배포 가이드

이 문서는 Talez 플랫폼을 다양한 환경에 배포하는 방법을 설명합니다.

## 목차

1. [사전 준비사항](#사전-준비사항)
2. [개발 환경 설정](#개발-환경-설정)
3. [배포 방법](#배포-방법)
   - [수동 배포](#수동-배포)
   - [자동 배포 (CI/CD)](#자동-배포-cicd)
4. [환경별 배포](#환경별-배포)
   - [개발 환경](#개발-환경)
   - [스테이징 환경](#스테이징-환경)
   - [프로덕션 환경](#프로덕션-환경)
5. [데이터베이스 관리](#데이터베이스-관리)
6. [모니터링 및 로깅](#모니터링-및-로깅)
7. [트러블슈팅](#트러블슈팅)

## 사전 준비사항

Talez 플랫폼을 배포하기 위해 다음 항목이 필요합니다:

- Node.js v20 이상
- PostgreSQL 데이터베이스
- Docker 및 Docker Compose (컨테이너 배포 시)
- Nginx (프록시 서버)
- 도메인 및 SSL 인증서
- 소셜 로그인 API 키 (카카오, 네이버, Google)
- OpenAI API 키 (AI 기능용)

## 개발 환경 설정

1. 저장소 복제:
   ```bash
   git clone https://github.com/your-organization/talez.git
   cd talez
   ```

2. 환경 변수 설정:
   ```bash
   ./scripts/setup-env.sh development
   ```

3. 환경 변수 파일(`.env.development`)을 편집하여 필요한 키와 설정을 추가합니다.

4. 의존성 설치:
   ```bash
   npm ci
   ```

5. 개발 서버 실행:
   ```bash
   npm run dev
   ```

## 배포 방법

### 수동 배포

1. 배포 스크립트 실행:
   ```bash
   ./scripts/deploy.sh production
   ```

2. 또는 단계별로 수동 배포:
   ```bash
   git pull origin main
   npm ci
   npm run build
   npm run db:push
   pm2 reload talez-app || pm2 start dist/server/index.js --name talez-app
   ```

### 자동 배포 (CI/CD)

GitHub Actions를 통한 자동 배포가 설정되어 있습니다:

1. `main` 브랜치에 코드가 병합되면 자동으로 CI/CD 파이프라인이 실행됩니다.
2. 테스트, 빌드, 배포 과정이 자동화됩니다.
3. 배포 결과는 Slack을 통해 알림이 발송됩니다.

## 환경별 배포

### 개발 환경

개발 환경은 개발자들이 기능을 개발하고 테스트하는 환경입니다:

```bash
./scripts/deploy.sh development
```

### 스테이징 환경

스테이징 환경은 프로덕션과 유사한 환경에서 최종 테스트를 수행하는 환경입니다:

```bash
./scripts/deploy.sh staging
```

### 프로덕션 환경

프로덕션 환경은 실제 사용자들이 접근하는 라이브 환경입니다:

```bash
./scripts/deploy.sh production
```

## 데이터베이스 관리

### 백업

정기적인 데이터베이스 백업을 위해 다음 명령을 실행합니다:

```bash
./scripts/backup.sh production
```

### 복원

백업에서 데이터베이스를 복원하려면:

```bash
pg_restore -h $PGHOST -U $PGUSER -d $PGDATABASE -c -v backups/talez_db_production_20250525123456.sql.gz
```

## 모니터링 및 로깅

### 로그 확인

애플리케이션 로그를 확인하려면:

```bash
# PM2 로그
pm2 logs talez-app

# Docker 로그
docker-compose logs -f app
```

### 모니터링

- 서버 모니터링: PM2 모니터링 대시보드를 사용합니다.
- 애플리케이션 모니터링: Sentry나 New Relic을 사용합니다.
- 서버 리소스 모니터링: Grafana와 Prometheus를 사용합니다.

## 트러블슈팅

### 일반적인 문제

1. **애플리케이션이 시작되지 않는 경우**
   - 로그 확인: `pm2 logs talez-app`
   - 환경 변수 확인: `.env.production` 파일의 설정 확인
   - 포트 충돌 확인: `lsof -i :5000`

2. **데이터베이스 연결 오류**
   - 데이터베이스 서버 상태 확인
   - 환경 변수의 데이터베이스 연결 정보 확인
   - 방화벽 설정 확인

3. **소셜 로그인 오류**
   - API 키 및 리다이렉트 URL 설정 확인
   - 개발자 콘솔 오류 확인
   - 네트워크 요청/응답 분석

4. **SSL 인증서 문제**
   - 인증서 만료 여부 확인
   - 인증서 갱신: `certbot renew`