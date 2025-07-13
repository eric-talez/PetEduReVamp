#!/bin/bash

echo "🔧 서버 환경 변수 설정 수정 스크립트"

# 서버 프로젝트 디렉토리 확인
if [ ! -f "/var/www/funnytalez/.env" ]; then
    echo "❌ /var/www/funnytalez/.env 파일이 없습니다."
    echo "🔧 .env 파일 생성 중..."
    cat > /var/www/funnytalez/.env << 'EOF'
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
    echo "✅ .env 파일이 생성되었습니다."
else
    echo "✅ .env 파일이 존재합니다."
fi

# .env 파일 권한 설정
chmod 600 /var/www/funnytalez/.env
chown $USER:$USER /var/www/funnytalez/.env

echo "📋 현재 .env 파일 내용:"
cat /var/www/funnytalez/.env

echo ""
echo "🔧 PM2 환경 변수 설정 방법:"
echo "1. OpenAI API 키 설정:"
echo "   pm2 set funnytalez-backend-prod:OPENAI_API_KEY 'your-actual-openai-key'"
echo ""
echo "2. 카카오 맵 API 키 설정:"
echo "   pm2 set funnytalez-backend-prod:KAKAO_MAPS_API_KEY 'ce38e8a3c2b566aeb9faf4c60b0153d2'"
echo ""
echo "3. PM2 재시작:"
echo "   pm2 restart funnytalez-backend-prod"
echo ""
echo "4. 환경 변수 확인:"
echo "   pm2 show funnytalez-backend-prod"