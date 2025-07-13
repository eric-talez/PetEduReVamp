#!/bin/bash

echo "🚀 Git 기반 TALEZ 플랫폼 자동 배포 시작..."

# 현재 디렉토리 확인
if [ ! -f "package.json" ]; then
    echo "❌ package.json이 없습니다. 프로젝트 루트에서 실행하세요."
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

# 환경 변수 확인
if [ ! -f ".env" ]; then
    echo "⚠️  .env 파일이 없습니다. 환경 변수를 설정하세요."
fi

# 프로덕션 빌드
echo "🔨 프로덕션 빌드 중..."
npm run build

# 빌드 결과 확인
if [ ! -f "dist/index.js" ]; then
    echo "❌ 빌드 실패: dist/index.js 없음"
    exit 1
fi

# PM2로 서비스 재시작
echo "🔄 서비스 재시작 중..."
pm2 restart talez-service || pm2 start ecosystem.config.cjs --env production

# 상태 확인
echo "✅ 배포 완료!"
echo "📊 서비스 상태:"
pm2 status

# 로그 확인
echo "📝 최근 로그:"
pm2 logs talez-service --lines 10

echo "🌐 서비스 URL: http://localhost:3000"
echo "🛠️  관리자 대시보드: http://localhost:3000/admin"