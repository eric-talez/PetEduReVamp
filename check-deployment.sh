
#!/bin/bash

echo "🔍 배포 환경 체크 시작..."

# 1. 필수 환경 변수 확인
echo ""
echo "📋 환경 변수 확인:"
required_vars=("DATABASE_URL" "SESSION_SECRET" "VITE_GOOGLE_MAPS_API_KEY")

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ $var 누락"
    else
        echo "✅ $var 설정됨"
    fi
done

# 2. 포트 확인
echo ""
echo "🔌 포트 설정:"
echo "PORT=${PORT:-5000}"

# 3. Node.js 버전 확인
echo ""
echo "📦 Node.js 버전:"
node --version

# 4. 의존성 설치 확인
echo ""
echo "📚 의존성 확인:"
if [ -d "node_modules" ]; then
    echo "✅ node_modules 존재"
else
    echo "❌ node_modules 없음 - npm install 실행 필요"
fi

# 5. 빌드 파일 확인
echo ""
echo "🏗️ 빌드 파일:"
if [ -d "dist" ]; then
    echo "✅ dist 디렉토리 존재"
else
    echo "❌ dist 디렉토리 없음 - npm run build 실행 필요"
fi

echo ""
echo "🎯 체크 완료!"
