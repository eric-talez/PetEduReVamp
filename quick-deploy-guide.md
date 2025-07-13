# TALEZ 플랫폼 빠른 배포 가이드

## 🚀 5분 안에 배포하기

### 1. Git 저장소 준비
```bash
# GitHub/GitLab에서 새 저장소 생성
# 저장소 URL: https://github.com/your-username/talez-platform.git

# 로컬에서 원격 저장소 연결
git remote add origin https://github.com/your-username/talez-platform.git
git push -u origin main
```

### 2. EC2 서버에서 배포
```bash
# 서버 접속
ssh ubuntu@your-server-ip

# 프로젝트 클론 및 설정
cd /var/www
git clone https://github.com/your-username/talez-platform.git
cd talez-platform

# 환경 변수 설정
cp .env.example .env
vim .env  # 필요한 값들 설정

# 자동 배포 스크립트 실행
chmod +x deploy-from-git.sh
./deploy-from-git.sh
```

### 3. 서비스 확인
```bash
# 서비스 상태 확인
pm2 status

# 웹 브라우저에서 확인
http://your-server-ip:3000
```

## 🔄 업데이트 배포

### 코드 변경 후 배포
```bash
# 로컬에서 코드 변경 후
git add .
git commit -m "Update: 새로운 기능 추가"
git push origin main

# 서버에서 업데이트
cd /var/www/talez-platform
./deploy-from-git.sh
```

## 📋 필수 환경 변수

### 최소 설정 (.env 파일)
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/talez_production
SESSION_SECRET=your-session-secret-key-here
```

### 완전한 설정
```bash
# .env.example 파일 참조
cp .env.example .env
# 모든 필요한 API 키와 설정 값 입력
```

## 🛠️ 트러블슈팅

### 자주 발생하는 문제들

#### 1. PM2 설정 파일 오류
```bash
# 해결방법
pm2 start ecosystem.config.cjs --env production
```

#### 2. 포트 충돌
```bash
# 포트 사용 중인 프로세스 확인
sudo netstat -tulpn | grep :3000

# 프로세스 종료
sudo kill -9 $(sudo lsof -t -i:3000)
```

#### 3. 빌드 실패
```bash
# 의존성 재설치
rm -rf node_modules
npm ci
npm run build
```

#### 4. 권한 문제
```bash
# 프로젝트 디렉토리 권한 설정
sudo chown -R $USER:$USER /var/www/talez-platform
```

## 🎯 자동화 옵션

### GitHub Actions 자동 배포
- `.github/workflows/deploy.yml` 파일이 설정됨
- main 브랜치에 푸시하면 자동 배포
- EC2 접속 정보를 GitHub Secrets에 등록 필요

### 수동 배포 vs 자동 배포
- **수동 배포**: `./deploy-from-git.sh` 스크립트 실행
- **자동 배포**: GitHub Actions를 통한 CI/CD