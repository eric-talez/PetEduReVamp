#!/bin/bash

# Funnytalez Production 배포 스크립트
echo "🚀 Funnytalez Production 배포를 시작합니다..."

# 1. 기존 프로세스 중지
echo "📦 기존 서비스 중지 중..."
pm2 delete funnytalez-backend-prod 2>/dev/null || true

# 2. 의존성 설치
echo "📦 의존성 설치 중..."
npm ci --production=false

# 3. 프로젝트 빌드
echo "🔨 프로젝트 빌드 중..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 빌드 실패! 배포를 중단합니다."
    exit 1
fi

# 4. Nginx 설정 복사 및 재시작
echo "🌐 Nginx 설정 업데이트 중..."
sudo cp nginx/funnytalez.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/funnytalez.conf /etc/nginx/sites-enabled/
sudo nginx -t

if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    echo "✅ Nginx 설정 완료"
else
    echo "❌ Nginx 설정 오류! 수동으로 확인해주세요."
fi

# 5. PM2로 Production 서버 시작
echo "🚀 Production 서버 시작 중..."
NODE_ENV=production pm2 start server/index.ts \
  --name funnytalez-backend-prod \
  --interpreter ./node_modules/.bin/tsx \
  --instances max \
  --exec-mode cluster \
  --max-memory-restart 1G \
  --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
  --merge-logs \
  --restart-delay 5000 \
  --max-restarts 10 \
  --min-uptime 10s

# 6. PM2 설정 저장
pm2 save
pm2 startup

echo "🎉 배포 완료!"
echo "📊 서버 상태 확인: pm2 status"
echo "📋 로그 확인: pm2 logs funnytalez-backend-prod"
echo "🌐 웹사이트: http://your-domain.com"