#!/bin/bash

# 정적 파일 복사 스크립트
echo "📂 정적 파일 복사 중..."

# 빌드된 파일들이 있는지 확인
if [ ! -d "dist" ]; then
  echo "❌ dist 폴더가 없습니다. 먼저 빌드를 실행해주세요."
  exit 1
fi

# public 폴더 복사 (있는 경우)
if [ -d "public" ]; then
  echo "📁 public 폴더 복사 중..."
  cp -r public/* dist/ 2>/dev/null || true
fi

# uploads 폴더 복사 (있는 경우)
if [ -d "uploads" ]; then
  echo "📁 uploads 폴더 복사 중..."
  mkdir -p dist/uploads
  cp -r uploads/* dist/uploads/ 2>/dev/null || true
fi

# 환경 파일 복사
if [ -f ".env.production" ]; then
  echo "🔧 환경 파일 복사 중..."
  cp .env.production dist/.env
elif [ -f ".env" ]; then
  echo "🔧 환경 파일 복사 중..."
  cp .env dist/.env
fi

# PM2 설정 파일 복사
if [ -f "ecosystem.config.cjs" ]; then
  echo "⚙️ PM2 설정 파일 복사 중..."
  cp ecosystem.config.cjs dist/
fi

# package.json 복사 (운영에서 npm install이 필요한 경우)
if [ -f "package.json" ]; then
  echo "📦 package.json 복사 중..."
  cp package.json dist/
fi

# package-lock.json 복사
if [ -f "package-lock.json" ]; then
  echo "🔒 package-lock.json 복사 중..."
  cp package-lock.json dist/
fi

# nginx 설정 파일 복사 (있는 경우)
if [ -f "nginx.conf" ] || [ -f "nginx-config.conf" ]; then
  echo "🌐 nginx 설정 파일 복사 중..."
  cp nginx*.conf dist/ 2>/dev/null || true
fi

# 권한 설정
chmod +x dist/*.sh 2>/dev/null || true

echo "✅ 정적 파일 복사 완료!"