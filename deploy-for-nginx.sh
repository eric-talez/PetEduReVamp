#!/bin/bash

echo "🚀 Nginx 환경 TALEZ 플랫폼 배포 시작..."

# 현재 디렉토리 확인
if [ ! -f "package.json" ]; then
    echo "❌ package.json이 없습니다. /var/www/funnytalez 디렉토리에서 실행하세요."
    exit 1
fi

# 로그 디렉토리 생성
mkdir -p logs

# Git 저장소에서 최신 코드 가져오기
echo "📡 최신 코드 가져오는 중..."
git fetch origin
git reset --hard origin/main

# 의존성 설치
echo "📦 의존성 설치 중..."
npm ci

# 환경 변수 확인 및 생성
if [ ! -f ".env" ]; then
    echo "⚠️  .env 파일이 없습니다. 기본 .env 파일을 생성합니다."
    cat > .env << 'EOF'
# 기본 환경 변수
NODE_ENV=production
PORT=5000

# 세션 보안
SESSION_SECRET=talez-super-secure-session-secret-2025-production-ready
CORS_ORIGIN=*
ENCRYPTION_KEY=talez-32-character-encryption-key

# 카카오 맵 API
VITE_KAKAO_MAPS_API_KEY=ce38e8a3c2b566aeb9faf4c60b0153d2
KAKAO_MAPS_API_KEY=ce38e8a3c2b566aeb9faf4c60b0153d2

# OpenAI API (실제 키로 교체 필요)
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
EOF
    chmod 600 .env
fi

# 프로덕션 빌드 (dist/public 생성)
echo "🔨 프로덕션 빌드 중..."
npm run build

# 빌드 결과 확인
if [ ! -f "dist/index.js" ]; then
    echo "❌ 서버 빌드 실패: dist/index.js 없음"
    exit 1
fi

if [ ! -f "dist/public/index.html" ]; then
    echo "❌ 클라이언트 빌드 실패: dist/public/index.html 없음"
    exit 1
fi

# 현재 실행 중인 PM2 프로세스 확인
CURRENT_PM2=$(pm2 list | grep funnytalez-backend-prod)
if [ -n "$CURRENT_PM2" ]; then
    echo "🔄 기존 PM2 프로세스 재시작 중..."
    pm2 restart funnytalez-backend-prod
else
    echo "🚀 새로운 PM2 프로세스 시작 중..."
    pm2 start ecosystem.config.cjs --env production
fi

# Nginx 설정 확인
if [ -f "/etc/nginx/sites-available/funnytalez.com.conf" ]; then
    echo "✅ Nginx 설정 파일 확인됨"
    echo "🌐 정적 파일 경로: /var/www/funnytalez/dist/public"
    echo "🔌 API 프록시: localhost:5000"
else
    echo "⚠️  Nginx 설정 파일을 확인하세요."
fi

# 배포 완료 상태 확인
echo "✅ 배포 완료!"
echo ""
echo "📊 서비스 상태:"
pm2 status

echo ""
echo "🌐 접속 정보:"
echo "  - 메인 사이트: https://funnytalez.com"
echo "  - API 서버: http://localhost:5000"
echo "  - 관리자: https://funnytalez.com/admin"

echo ""
echo "📁 파일 구조:"
echo "  - 정적 파일: /var/www/funnytalez/dist/public/ (Nginx 서빙)"
echo "  - API 서버: /var/www/funnytalez/dist/index.js (PM2 실행)"

echo ""
echo "🔍 빠른 상태 확인:"
echo "  - pm2 logs funnytalez-backend-prod"
echo "  - curl https://funnytalez.com/api/health"
echo "  - nginx -t && systemctl status nginx"