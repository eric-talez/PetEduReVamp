#!/bin/bash

# 🚀 TALEZ 서버 배포 빠른 수정 스크립트
# 빌드 오류 해결 및 서버 배포 준비

echo "🔧 TALEZ 서버 배포 빠른 수정 시작..."

# 1. 필수 패키지 설치
echo "📦 빌드 필수 패키지 설치..."
npm install @vitejs/plugin-react @replit/vite-plugin-cartographer @replit/vite-plugin-runtime-error-modal

# 2. 모든 의존성 설치
echo "📦 전체 의존성 설치..."
npm ci

# 3. 프로덕션 빌드
echo "🏗️ 프로덕션 빌드 실행..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 빌드 성공!"
    echo "🚀 서버 시작 준비 완료"
    echo ""
    echo "다음 명령어로 서버를 시작하세요:"
    echo "npm start"
    echo ""
    echo "또는 PM2 사용:"
    echo "pm2 start dist/index.js --name talez-server"
else
    echo "❌ 빌드 실패"
    echo "다시 시도하거나 로그를 확인하세요."
    exit 1
fi

# 4. 불필요한 devDependencies 제거 (선택사항)
read -p "불필요한 개발 의존성을 제거하시겠습니까? (y/n): " remove_dev
if [[ $remove_dev == "y" || $remove_dev == "Y" ]]; then
    echo "🧹 개발 의존성 제거 중..."
    npm prune --production
    echo "✅ 개발 의존성 제거 완료"
fi

echo "🎉 서버 배포 준비 완료!"