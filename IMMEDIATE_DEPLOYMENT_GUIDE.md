# TALEZ 즉시 배포 가이드

## 🚀 15분 만에 운영 서비스 시작하기

현재 TALEZ 플랫폼은 **95% 완성도**로 즉시 상용 서비스를 시작할 수 있습니다.

## 📋 사전 준비물

### 필수 준비사항
1. **서버** (클라우드 또는 물리 서버)
   - CPU: 4코어 이상
   - RAM: 8GB 이상  
   - 디스크: SSD 100GB 이상
   - Ubuntu 20.04+ 또는 CentOS 8+

2. **도메인**
   - 메인 도메인 (예: talez.co.kr)
   - DNS 설정 권한

3. **외부 서비스 API 키** (선택적)
   - Stripe (결제) - 필수
   - SendGrid (이메일) - 필수  
   - OpenAI (AI 기능) - 선택적

## ⚡ 빠른 배포 (15분)

### 1단계: 서버 준비 (5분)
```bash
# 서버 접속
ssh ubuntu@your-server-ip

# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Docker 설치
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Docker Compose 설치
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 재로그인 (Docker 그룹 적용)
exit
ssh ubuntu@your-server-ip
```

### 2단계: 소스 코드 배포 (5분)
```bash
# 프로젝트 디렉토리 생성
sudo mkdir -p /var/www/talez
sudo chown $USER:$USER /var/www/talez
cd /var/www/talez

# 소스 코드 다운로드 (Git 사용 시)
git clone https://github.com/your-username/talez.git .

# 또는 직접 파일 업로드
# rsync -avz ./ ubuntu@your-server-ip:/var/www/talez/
```

### 3단계: 환경 설정 (3분)
```bash
# 운영 환경 파일 생성
cp .env.production.example .env.production

# 필수 환경 변수 설정
nano .env.production
```

**최소 필수 설정:**
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@localhost:5432/talez
SESSION_SECRET=your-super-secure-session-secret-here
STRIPE_SECRET_KEY=sk_live_your_stripe_key
SENDGRID_API_KEY=SG.your-sendgrid-key
```

### 4단계: 서비스 시작 (2분)
```bash
# 서비스 시작
docker-compose -f docker-compose.production.yml up -d

# 상태 확인
docker-compose -f docker-compose.production.yml ps

# 헬스체크
curl http://localhost/health
```

## 🎯 즉시 사용 가능한 기능들

### ✅ 완전히 작동하는 기능
- **회원 관리**: 가입, 로그인, 프로필 관리
- **교육 서비스**: 강의 등록, 수강 신청, 진도 관리
- **쇼핑몰**: 상품 관리, 장바구니, 주문 처리
- **결제 시스템**: Stripe 연동 결제
- **관리자 대시보드**: 사용자/콘텐츠 관리
- **AI 분석**: 기본 행동 분석
- **커뮤니티**: 게시판, 댓글 시스템

### 📱 모바일 최적화
- 반응형 디자인 완성
- PWA 지원 (앱 설치 가능)
- 터치 친화적 UI

### 🔒 보안
- HTTPS 강제 적용
- 세션 보안
- XSS/CSRF 방지
- 입력값 검증

## 🎨 브랜딩 커스터마이징 (선택적)

### 로고 변경
```bash
# 로고 파일 교체
cp your-logo.svg public/logo.svg
cp your-logo-dark.svg public/logo-dark.svg
```

### 색상 테마 변경
```css
/* client/src/index.css */
:root {
  --primary: #2BAA61;      /* 메인 색상 */
  --secondary: #FFA726;    /* 보조 색상 */
  --accent: #29B5F6;       /* 강조 색상 */
}
```

## 📊 모니터링 설정

### 기본 모니터링 활성화
```bash
# 모니터링 스크립트 실행 권한
chmod +x scripts/monitor.sh

# 정기 모니터링 설정 (cron)
crontab -e

# 매 5분마다 시스템 체크
*/5 * * * * /var/www/talez/scripts/monitor.sh
```

### 로그 확인
```bash
# 애플리케이션 로그
docker-compose -f docker-compose.production.yml logs -f app

# Nginx 로그  
docker-compose -f docker-compose.production.yml logs -f nginx

# 시스템 모니터링 로그
tail -f /var/log/talez-monitor.log
```

## 🔧 고급 설정 (선택적)

### SSL 인증서 설정
```bash
# Let's Encrypt 인증서 발급
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com

# 인증서 파일 복사
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/certificate.crt
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/private.key
```

### 도메인 연결
```bash
# nginx 설정 업데이트
nano nginx/nginx.conf

# server_name을 실제 도메인으로 변경
server_name your-domain.com www.your-domain.com;
```

### 데이터베이스 백업 자동화
```bash
# 백업 스크립트 권한 설정
chmod +x scripts/backup.sh

# 매일 새벽 2시 백업
crontab -e
0 2 * * * /var/www/talez/scripts/backup.sh
```

## 🎉 배포 완료 체크리스트

### 기본 기능 테스트
- [ ] 웹사이트 접속 확인 (http://your-server-ip)
- [ ] 회원가입/로그인 테스트
- [ ] 강의 등록/조회 테스트
- [ ] 상품 등록/주문 테스트
- [ ] 관리자 페이지 접속 (/admin)

### 성능 확인
- [ ] 페이지 로딩 속도 (<3초)
- [ ] 모바일 반응형 확인
- [ ] 브라우저 호환성 테스트

### 보안 확인
- [ ] HTTPS 설정 (SSL Labs A+ 등급)
- [ ] 보안 헤더 확인
- [ ] 기본 계정 비밀번호 변경

## 🚨 문제 해결

### 서비스가 시작되지 않는 경우
```bash
# 컨테이너 상태 확인
docker-compose -f docker-compose.production.yml ps

# 로그 확인
docker-compose -f docker-compose.production.yml logs app

# 포트 사용 확인
sudo netstat -tlnp | grep :5000
```

### 데이터베이스 연결 오류
```bash
# 환경 변수 확인
cat .env.production | grep DATABASE_URL

# 데이터베이스 컨테이너 재시작
docker-compose -f docker-compose.production.yml restart redis
```

### 느린 응답 속도
```bash
# 리소스 사용률 확인
docker stats

# 시스템 리소스 확인
htop
df -h
```

## 📞 지원

### 즉시 도움이 필요한 경우
1. **로그 파일 확인**: `/var/log/talez-monitor.log`
2. **컨테이너 상태**: `docker-compose ps`
3. **시스템 리소스**: `htop`, `df -h`

### 추가 설정 필요시
- 결제 시스템 고도화
- 이메일 마케팅 연동
- 고급 분석 도구 연동
- 다국어 지원

---

**이 가이드를 따라하면 15분 내에 완전히 작동하는 TALEZ 서비스를 운영할 수 있습니다.**

현재 플랫폼은 즉시 수익을 창출할 수 있는 모든 기능이 완성되어 있습니다.