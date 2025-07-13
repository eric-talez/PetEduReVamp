# Git 기반 배포 가이드

## 1. Git 저장소 초기 설정

### 로컬 Git 저장소 초기화
```bash
# Git 저장소 초기화 (이미 되어있다면 생략)
git init

# 사용자 정보 설정
git config user.name "your-name"
git config user.email "your-email@example.com"

# 원격 저장소 추가
git remote add origin https://github.com/your-username/talez-platform.git
```

### 원격 저장소 연결
```bash
# GitHub/GitLab 등에서 새 저장소 생성 후
git remote add origin https://github.com/your-username/talez-platform.git

# 또는 기존 저장소 연결
git remote set-url origin https://github.com/your-username/talez-platform.git
```

## 2. 소스 코드 업로드

### 초기 커밋 및 푸시
```bash
# 모든 파일 스테이징
git add .

# 초기 커밋
git commit -m "Initial commit: TALEZ platform with production-ready build"

# 메인 브랜치로 푸시
git push -u origin main
```

### 개발 브랜치 전략
```bash
# 개발 브랜치 생성
git checkout -b develop

# 기능 브랜치 생성
git checkout -b feature/new-feature

# 작업 완료 후 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# 개발 브랜치로 머지
git checkout develop
git merge feature/new-feature
```

## 3. EC2 서버에서 Git 배포

### 서버 초기 설정
```bash
# 서버에 Git 설치
sudo apt update
sudo apt install git

# 프로젝트 클론
cd /var/www
sudo git clone https://github.com/your-username/talez-platform.git
sudo chown -R $USER:$USER talez-platform
cd talez-platform
```

### 자동 배포 스크립트 생성
```bash
#!/bin/bash
# deploy-from-git.sh

echo "🚀 Git 기반 자동 배포 시작..."

# Git 저장소에서 최신 코드 가져오기
echo "📡 최신 코드 가져오는 중..."
git fetch origin
git reset --hard origin/main

# 의존성 설치
echo "📦 의존성 설치 중..."
npm ci

# 프로덕션 빌드
echo "🔨 프로덕션 빌드 중..."
npm run build

# 서비스 재시작
echo "🔄 서비스 재시작 중..."
pm2 restart talez-service || pm2 start ecosystem.config.cjs --env production

echo "✅ 배포 완료!"
pm2 status
```

## 4. GitHub Actions 자동 배포

### Workflow 파일 생성
```yaml
# .github/workflows/deploy.yml
name: Deploy to EC2

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build project
      run: npm run build

    - name: Deploy to EC2
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.EC2_HOST }}
        username: ${{ secrets.EC2_USER }}
        key: ${{ secrets.EC2_PRIVATE_KEY }}
        script: |
          cd /var/www/talez-platform
          git pull origin main
          npm ci
          npm run build
          pm2 restart talez-service
```

## 5. 환경 변수 관리

### 서버 환경 변수 파일
```bash
# .env.production
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/talez_prod
SESSION_SECRET=your-production-session-secret
CORS_ORIGIN=https://yourdomain.com
```

### Git에서 환경 변수 제외
```bash
# .gitignore에 추가
.env
.env.local
.env.production
.env.development
```

## 6. 배포 명령어

### 수동 배포
```bash
# 서버에서 수동 배포
cd /var/www/talez-platform
git pull origin main
npm ci
npm run build
pm2 restart talez-service
```

### 자동 배포 스크립트 실행
```bash
# 실행 권한 부여
chmod +x deploy-from-git.sh

# 배포 실행
./deploy-from-git.sh
```

## 7. 배포 확인

### 서비스 상태 확인
```bash
# PM2 상태 확인
pm2 status

# 로그 확인
pm2 logs talez-service

# 서비스 재시작
pm2 restart talez-service
```

### 웹 서비스 확인
```bash
# 서비스 접속 테스트
curl http://localhost:3000
curl http://localhost:3000/api/health
```

## 8. 트러블슈팅

### 일반적인 문제 해결
```bash
# 권한 문제
sudo chown -R $USER:$USER /var/www/talez-platform

# 포트 충돌
sudo netstat -tulpn | grep :3000
sudo kill -9 $(sudo lsof -t -i:3000)

# PM2 프로세스 초기화
pm2 delete all
pm2 start ecosystem.config.cjs --env production
```

### Git 관련 문제
```bash
# 병합 충돌 해결
git status
git add .
git commit -m "Resolve merge conflicts"

# 강제 업데이트
git fetch origin
git reset --hard origin/main
```