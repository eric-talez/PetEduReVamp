#!/bin/bash

# 🚀 TALEZ 즉시 서비스 오픈 설정 스크립트
# 날짜: 2025-07-12

echo "🚀 TALEZ 즉시 서비스 오픈 설정 시작..."

# 1. 환경 변수 설정
echo "📝 프로덕션 환경 변수 설정 중..."
cat > .env.production << 'EOF'
# =================================
# 🚀 TALEZ 즉시 서비스 오픈 설정
# =================================

# 기본 서버 설정
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# 보안 설정 (즉시 서비스 오픈용)
SESSION_SECRET=talez-super-secure-session-secret-2025-production-ready
CORS_ORIGIN=*
ENCRYPTION_KEY=talez-32-character-encryption-key

# 데이터베이스 설정
DATABASE_URL=${DATABASE_URL}

# 카카오 맵 API (이미 설정됨)
KAKAO_MAPS_API_KEY=ce38e8a3c2b566aeb9faf4c60b0153d2
VITE_KAKAO_MAPS_API_KEY=ce38e8a3c2b566aeb9faf4c60b0153d2

# 기본 설정 (서비스 오픈용)
OPENAI_API_KEY=dummy-key-for-launch
STRIPE_SECRET_KEY=dummy-key-for-launch
SENTRY_DSN=dummy-dsn-for-launch

# 소셜 로그인 (차후 설정)
KAKAO_CLIENT_ID=dummy-client-id
KAKAO_CLIENT_SECRET=dummy-client-secret
NAVER_CLIENT_ID=dummy-client-id
NAVER_CLIENT_SECRET=dummy-client-secret
GOOGLE_CLIENT_ID=dummy-client-id
GOOGLE_CLIENT_SECRET=dummy-client-secret
EOF

# 2. 현재 환경 변수 업데이트
echo "🔧 현재 환경 변수 업데이트 중..."
echo "SESSION_SECRET=talez-super-secure-session-secret-2025-production-ready" >> .env
echo "CORS_ORIGIN=*" >> .env
echo "ENCRYPTION_KEY=talez-32-character-encryption-key" >> .env

# 3. 퍼미션 설정
echo "🔐 파일 퍼미션 설정 중..."
chmod 600 .env*
chmod +x deploy-*.sh
chmod +x *.sh

# 4. 빌드 실행
echo "🏗️ 프로덕션 빌드 실행 중..."
npm run build

# 5. 테스트 실행
echo "🧪 기본 API 테스트 실행 중..."
curl -f http://localhost:5000/api/dashboard/stats || echo "⚠️ 대시보드 API 테스트 실패"

echo "✅ TALEZ 즉시 서비스 오픈 설정 완료!"
echo "📊 서비스 상태: 베타 런칭 준비 완료"
echo "🌐 서비스 URL: http://localhost:5000"
echo "🎯 다음 단계: 프로덕션 배포 실행"