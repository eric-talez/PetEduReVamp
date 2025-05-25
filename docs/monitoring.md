# Talez 모니터링 및 알림 가이드

이 문서는 Talez 플랫폼의 모니터링 및 알림 시스템 설정 방법을 설명합니다.

## 목차

1. [모니터링 개요](#모니터링-개요)
2. [서버 모니터링](#서버-모니터링)
3. [애플리케이션 모니터링](#애플리케이션-모니터링)
4. [로그 관리](#로그-관리)
5. [알림 설정](#알림-설정)
6. [대시보드](#대시보드)

## 모니터링 개요

Talez 플랫폼은 다음 영역에 대한 모니터링을 제공합니다:

- 서버 상태 및 리소스 사용량
- 애플리케이션 성능 및 오류
- 데이터베이스 성능
- API 요청/응답 지표
- 사용자 활동 및 행동

## 서버 모니터링

### PM2 모니터링

PM2를 사용하여 Node.js 프로세스를 모니터링합니다:

```bash
# 상태 확인
pm2 status

# 모니터링 대시보드
pm2 monit

# 로그 확인
pm2 logs talez-app
```

### 시스템 리소스 모니터링

Prometheus와 Grafana를 사용하여 시스템 리소스를 모니터링합니다:

1. **설치**: 
   ```bash
   docker-compose -f docker-compose.monitoring.yml up -d
   ```

2. **지표 수집**: 
   - CPU 사용량
   - 메모리 사용량
   - 디스크 I/O
   - 네트워크 트래픽

3. **알림 규칙**:
   - CPU 사용량 > 80% (5분 이상)
   - 메모리 사용량 > 90%
   - 디스크 공간 < 10GB

## 애플리케이션 모니터링

### 성능 모니터링

1. **New Relic 설정**:
   - APM 에이전트 설치: `npm install newrelic`
   - 설정 파일 구성: `newrelic.js`

2. **모니터링 지표**:
   - 응답 시간
   - 처리량
   - 오류율
   - Apdex 점수

### 오류 모니터링

Sentry를 사용하여 애플리케이션 오류를 모니터링합니다:

1. **설치**:
   ```bash
   npm install @sentry/node @sentry/tracing
   ```

2. **설정**:
   ```javascript
   import * as Sentry from '@sentry/node';
   import { ProfilingIntegration } from '@sentry/profiling-node';

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     integrations: [
       new ProfilingIntegration(),
     ],
     tracesSampleRate: 1.0,
   });
   ```

3. **알림 규칙**:
   - 새로운 오류 발생
   - 오류 발생 빈도 증가
   - 특정 심각도 이상의 오류

## 로그 관리

### 로그 집계

ELK 스택(Elasticsearch, Logstash, Kibana)을 사용하여 로그를 집계하고 분석합니다:

1. **설치**:
   ```bash
   docker-compose -f docker-compose.elk.yml up -d
   ```

2. **로그 형식**:
   ```json
   {
     "timestamp": "2025-05-25T12:34:56.789Z",
     "level": "info",
     "service": "talez-api",
     "message": "Request completed",
     "requestId": "abc123",
     "method": "GET",
     "path": "/api/users",
     "statusCode": 200,
     "responseTime": 45
   }
   ```

3. **로그 보존 정책**:
   - 상세 로그: 7일
   - 집계 로그: 30일
   - 오류 로그: 90일

## 알림 설정

### Slack 알림

1. **설정**:
   - Slack 웹훅 URL 생성
   - 환경 변수에 URL 설정: `SLACK_WEBHOOK_URL`

2. **알림 유형**:
   - 서버 상태 변경
   - 애플리케이션 오류
   - 배포 상태
   - 보안 경고

### 이메일 알림

1. **설정**:
   ```javascript
   import nodemailer from 'nodemailer';

   const transporter = nodemailer.createTransport({
     host: process.env.SMTP_HOST,
     port: process.env.SMTP_PORT,
     secure: true,
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASSWORD
     }
   });

   export async function sendAlertEmail(subject, message) {
     await transporter.sendMail({
       from: process.env.ALERT_EMAIL_FROM,
       to: process.env.ALERT_EMAIL_TO,
       subject: `[TALEZ ALERT] ${subject}`,
       html: message
     });
   }
   ```

2. **알림 정책**:
   - 심각한 오류만 이메일로 알림
   - 일일 요약 보고서
   - 보안 관련 경고

## 대시보드

### 운영 대시보드

Grafana를 사용하여 통합 운영 대시보드를 구성합니다:

1. **시스템 상태**:
   - 서버 리소스 사용량
   - 애플리케이션 상태
   - 데이터베이스 상태

2. **애플리케이션 성능**:
   - API 응답 시간
   - 요청 처리량
   - 오류율

3. **비즈니스 지표**:
   - 활성 사용자 수
   - 신규 가입자 수
   - 기능별 사용량