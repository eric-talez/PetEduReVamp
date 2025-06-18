
#!/bin/bash

echo "🚀 TALEZ 실서비스 최종 배포"
echo "=========================="
echo ""

# 환경 검증
if [ "$NODE_ENV" != "production" ]; then
    echo "⚠️ NODE_ENV가 production으로 설정되지 않았습니다."
    echo "export NODE_ENV=production을 실행해주세요."
    exit 1
fi

# 환경 변수 확인
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL이 설정되지 않았습니다."
    exit 1
fi

if [ -z "$SESSION_SECRET" ]; then
    echo "❌ SESSION_SECRET이 설정되지 않았습니다."
    exit 1
fi

echo "✅ 환경 변수 검증 완료"

# 기존 프로세스 중지
echo "🛑 기존 서비스 중지..."
pm2 delete funnytalez-backend-prod 2>/dev/null || true

# 의존성 설치
echo "📦 의존성 설치..."
npm ci --production=false

# 데이터베이스 마이그레이션
echo "🗄️ 데이터베이스 마이그레이션..."
npm run db:push

# 로그 디렉토리 생성
echo "📁 로그 디렉토리 생성..."
mkdir -p logs

# 프로덕션 서버 시작
echo "🚀 프로덕션 서버 시작..."
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
  --min-uptime 10s \
  --env production

# PM2 설정 저장
echo "💾 PM2 설정 저장..."
pm2 save
pm2 startup

# 서비스 상태 확인
echo "📊 서비스 상태 확인..."
sleep 5
pm2 status
pm2 logs funnytalez-backend-prod --lines 20

echo ""
echo "🎉 실서비스 배포 완료!"
echo ""
echo "📋 유용한 명령어:"
echo "  pm2 logs funnytalez-backend-prod  # 로그 확인"
echo "  pm2 restart funnytalez-backend-prod  # 서비스 재시작"
echo "  pm2 monit  # 실시간 모니터링"
echo ""
echo "🌐 서비스 URL: http://0.0.0.0:5000"
echo "📱 로컬 접속: http://localhost:5000"
