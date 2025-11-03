#!/bin/bash

echo "🔍 배포 환경 검증 중..."
echo ""

# 환경 변수 확인
echo "0. 필수 환경 변수 확인..."
if [ -z "$DATABASE_URL" ]; then
  echo "   ❌ DATABASE_URL이 설정되지 않았습니다."
else
  echo "   ✅ DATABASE_URL 설정됨"
fi

if [ -z "$SESSION_SECRET" ]; then
  echo "   ❌ SESSION_SECRET이 설정되지 않았습니다."
else
  echo "   ✅ SESSION_SECRET 설정됨"
fi

if [ -z "$VITE_GOOGLE_MAPS_API_KEY" ]; then
  echo "   ⚠️  VITE_GOOGLE_MAPS_API_KEY가 설정되지 않았습니다."
else
  echo "   ✅ VITE_GOOGLE_MAPS_API_KEY 설정됨"
fi

echo ""

# 1. 포트 확인
echo "1. 포트 설정 확인..."
PORT=${PORT:-5000}
echo "   포트: $PORT"

# 2. Node.js 버전 확인
echo ""
echo "2. Node.js 버전:"
node --version

# 3. 의존성 설치 확인
echo ""
echo "3. 의존성 확인:"
if [ -d "node_modules" ]; then
    echo "✅ node_modules 존재"
else
    echo "❌ node_modules 없음 - npm install 실행 필요"
fi

# 4. 빌드 파일 확인
echo ""
echo "4. 빌드 파일:"
if [ -d "dist" ]; then
    echo "✅ dist 디렉토리 존재"
else
    echo "❌ dist 디렉토리 없음 - npm run build 실행 필요"
fi

echo ""
echo "🎯 검증 완료!"