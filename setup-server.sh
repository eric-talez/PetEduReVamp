#!/bin/bash

echo "🔧 TALEZ 플랫폼 서버 초기 설정 스크립트"

# 시스템 업데이트
echo "📦 시스템 업데이트 중..."
sudo apt update && sudo apt upgrade -y

# Node.js 20.x 설치
echo "🟢 Node.js 20.x 설치 중..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Git 설치
echo "📡 Git 설치 중..."
sudo apt install -y git

# PM2 전역 설치
echo "⚙️ PM2 설치 중..."
sudo npm install -g pm2

# PostgreSQL 설치
echo "🐘 PostgreSQL 설치 중..."
sudo apt install -y postgresql postgresql-contrib

# Nginx 설치
echo "🌐 Nginx 설치 중..."
sudo apt install -y nginx

# 프로젝트 디렉토리 생성
echo "📁 프로젝트 디렉토리 설정 중..."
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www

# 프로젝트 클론
echo "📥 프로젝트 클론 중..."
cd /var/www
git clone https://github.com/your-username/talez-platform.git
cd talez-platform

# 환경 변수 파일 생성
echo "🔐 환경 변수 파일 생성 중..."
cp .env.example .env

# 의존성 설치
echo "📦 의존성 설치 중..."
npm ci

# 프로덕션 빌드
echo "🔨 프로덕션 빌드 중..."
npm run build

# 로그 디렉토리 생성
mkdir -p logs

# PM2 시작
echo "🚀 PM2로 서비스 시작 중..."
pm2 start ecosystem.config.cjs --env production

# PM2 자동 시작 설정
echo "🔄 PM2 자동 시작 설정 중..."
pm2 startup
pm2 save

# 방화벽 설정
echo "🔥 방화벽 설정 중..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "✅ 서버 초기 설정 완료!"
echo "🔧 다음 단계:"
echo "1. .env 파일의 환경 변수를 실제 값으로 설정하세요"
echo "2. PostgreSQL 데이터베이스를 생성하고 DATABASE_URL을 설정하세요"
echo "3. Nginx 설정을 완료하세요"
echo "4. SSL 인증서를 설치하세요"
echo ""
echo "📊 서비스 상태:"
pm2 status