#!/bin/bash

echo "🚀 프로덕션 환경 변수 설정 스크립트"

# 프로젝트 디렉토리 확인
PROJECT_DIR="/var/www/funnytalez"
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ 프로젝트 디렉토리 $PROJECT_DIR 가 존재하지 않습니다."
    exit 1
fi

cd "$PROJECT_DIR"

# 환경 변수 파일 생성
echo "📝 .env 파일 생성 중..."
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

# 파일 권한 설정
chmod 600 .env
echo "✅ .env 파일이 생성되었습니다."

# PM2 환경 변수 설정
echo "🔧 PM2 환경 변수 설정 중..."

# 기존 PM2 프로세스 중지
echo "⏹️  기존 PM2 프로세스 중지 중..."
pm2 stop funnytalez-backend-prod 2>/dev/null || echo "이미 중지된 상태입니다."

# PM2 프로세스 삭제
pm2 delete funnytalez-backend-prod 2>/dev/null || echo "삭제할 프로세스가 없습니다."

# 환경 변수 소스
source .env

# 새로운 PM2 프로세스 시작
echo "🚀 새로운 PM2 프로세스 시작 중..."
pm2 start ecosystem.config.cjs --env production --name funnytalez-backend-prod

# 상태 확인
echo "📊 PM2 프로세스 상태:"
pm2 status

# 환경 변수 확인
echo "🔍 환경 변수 확인:"
pm2 show funnytalez-backend-prod

# 로그 확인
echo "📝 최근 로그 (10줄):"
pm2 logs funnytalez-backend-prod --lines 10

# 포트 확인
echo "🔌 포트 5000 상태:"
netstat -tulpn | grep :5000 || echo "포트 5000이 사용 중이지 않습니다."

# API 테스트
echo "🧪 API 테스트:"
sleep 3
curl -s http://localhost:5000/api/health || echo "API가 아직 준비되지 않았습니다."

echo ""
echo "✅ 설정 완료!"
echo "🌐 웹사이트: https://funnytalez.com"
echo "🔧 관리자: https://funnytalez.com/admin"
echo ""
echo "📋 다음 단계:"
echo "1. OPENAI_API_KEY를 실제 키로 교체"
echo "2. 웹사이트에서 AI 기능 테스트"
echo "3. 모든 API 엔드포인트 확인"